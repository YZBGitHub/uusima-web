import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertResourceCapacity, USER_RESOURCE_LIMIT, CourseResourceFolder, folderSize, formatResourceSize, resourceSize, resourceSnapshot } from './courseResourceStorage';

function folder(id: string, sizes: number[]): CourseResourceFolder {
  return { id, name: id, remark: '', shared: false, files: sizes.map((size, index) => ({
    id: `${id}-${index}`, name: `${index}.txt`, size, type: 'TXT', uploadedAt: '2026-10-15T00:00:00.000Z', content: new Blob(),
  })) };
}

test('容量按所有文件夹累计，包括未共享文件夹', () => {
  const folders = [folder('a', [1024, 2048]), folder('b', [4096]), folder('empty', [])];
  assert.equal(folderSize(folders[0]), 3072);
  assert.equal(resourceSize(folders), 7168);
  assert.equal(resourceSize([]), 0);
});

test('恰好 10GB 允许上传，超过一个字节或批量累计超过上限均被拒绝', () => {
  const folders = [folder('a', [USER_RESOURCE_LIMIT - 10])];
  assert.doesNotThrow(() => assertResourceCapacity(resourceSize(folders), 10));
  assert.throws(() => assertResourceCapacity(resourceSize(folders), 11), /不能超过 10GB/);
  assert.throws(() => assertResourceCapacity(0, USER_RESOURCE_LIMIT + 1), /不能超过 10GB/);
});

test('删除文件或整个文件夹后可重新使用释放的容量', () => {
  const folders = [folder('a', [USER_RESOURCE_LIMIT - 1024]), folder('b', [1024])];
  assert.throws(() => assertResourceCapacity(resourceSize(folders), 1));
  const deletedFolder = folders.filter(item => item.id !== 'b');
  assert.equal(resourceSize(deletedFolder), USER_RESOURCE_LIMIT - 1024);
  assert.doesNotThrow(() => assertResourceCapacity(resourceSize(deletedFolder), 1024));
  const deletedFile = folders.map(item => item.id === 'a' ? { ...item, files: [] } : item);
  assert.equal(resourceSize(deletedFile), 1024);
});

test('空文件可保存，非法上传大小不计入容量', () => {
  assert.doesNotThrow(() => assertResourceCapacity(USER_RESOURCE_LIMIT, 0));
  for (const bytes of [-1, NaN, Infinity, 1.5]) assert.throws(() => assertResourceCapacity(0, bytes));
});

test('容量显示使用一致的单位', () => {
  assert.equal(formatResourceSize(0), '0 B');
  assert.equal(formatResourceSize(1024), '1 KB');
  assert.equal(formatResourceSize(1024 ** 2), '1 MB');
  assert.equal(formatResourceSize(USER_RESOURCE_LIMIT), '10 GB');
  assert.equal(formatResourceSize(1536), '1.5 KB');
});


test('当前用户所有课程共用 10GB，课程自身未超限也不能突破用户总容量', () => {
  const courses = [
    { courseId: 1, folders: [folder('a', [6 * 1024 ** 3])] },
    { courseId: 2, folders: [folder('b', [3 * 1024 ** 3])] },
  ];
  const snapshot = resourceSnapshot(courses, 2);
  assert.equal(resourceSize(snapshot.folders), 3 * 1024 ** 3);
  assert.equal(snapshot.userUsedBytes, 9 * 1024 ** 3);
  assert.doesNotThrow(() => assertResourceCapacity(snapshot.userUsedBytes, 1024 ** 3));
  assert.throws(() => assertResourceCapacity(snapshot.userUsedBytes, 2 * 1024 ** 3), /当前用户总资源大小/);
  const emptyCourse = resourceSnapshot(courses, 3);
  assert.deepEqual(emptyCourse.folders, []);
  assert.equal(emptyCourse.userUsedBytes, snapshot.userUsedBytes);
  const afterDelete = resourceSnapshot([courses[1]], 2);
  assert.equal(afterDelete.userUsedBytes, 3 * 1024 ** 3);
  assert.doesNotThrow(() => assertResourceCapacity(afterDelete.userUsedBytes, 7 * 1024 ** 3));
});
