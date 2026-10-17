export const USER_RESOURCE_LIMIT = 10 * 1024 ** 3;

export interface CourseResourceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  content: Blob;
}

export interface CourseResourceFolder {
  id: string;
  name: string;
  remark: string;
  shared: boolean;
  files: CourseResourceFile[];
}

export interface CourseResources {
  courseId: number;
  folders: CourseResourceFolder[];
}

export const folderSize = (folder: CourseResourceFolder) => folder.files.reduce((sum, file) => sum + file.size, 0);
export const resourceSize = (folders: CourseResourceFolder[]) => folders.reduce((sum, folder) => sum + folderSize(folder), 0);

export function assertResourceCapacity(userUsedBytes: number, addedBytes: number) {
  if (!Number.isSafeInteger(addedBytes) || addedBytes < 0 || userUsedBytes + addedBytes > USER_RESOURCE_LIMIT) {
    throw new Error('当前用户总资源大小不能超过 10GB，所有课程共用此容量，请删除部分资源后重试。');
  }
}

export function resourceSnapshot(courses: CourseResources[], courseId: number) {
  return {
    folders: courses.find(course => course.courseId === courseId)?.folders ?? [],
    userUsedBytes: courses.reduce((sum, course) => sum + resourceSize(course.folders), 0),
  };
}

export function formatResourceSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const level = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** level;
  return `${Number(value.toFixed(level === 0 ? 0 : 2))} ${units[level]}`;
}

function openResourceDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('uusima-course-resources', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('courses', { keyPath: 'courseId' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('资源存储无法打开，请检查浏览器存储权限。'));
    request.onblocked = () => reject(new Error('资源存储正在升级，请关闭其他课程页面后重试。'));
  });
}

// 当前项目使用单用户本地原型，数据库汇总该用户全部课程资源。
// 在同一读写事务中读取全部课程并修改，避免跨课程、跨标签页绕过用户容量限制。
export async function accessCourseResources(
  courseId: number,
  update?: (folders: CourseResourceFolder[], userUsedBytes: number) => CourseResourceFolder[],
): Promise<ReturnType<typeof resourceSnapshot>> {
  const database = await openResourceDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('courses', update ? 'readwrite' : 'readonly');
    const store = transaction.objectStore('courses');
    const request = store.getAll();
    let snapshot: ReturnType<typeof resourceSnapshot> = { folders: [], userUsedBytes: 0 };
    let failure: unknown;
    request.onsuccess = () => {
      try {
        const courses = request.result as CourseResources[];
        snapshot = resourceSnapshot(courses, courseId);
        if (update) {
          const previousCourseBytes = resourceSize(snapshot.folders);
          const folders = update(snapshot.folders, snapshot.userUsedBytes);
          const addedBytes = resourceSize(folders) - previousCourseBytes;
          // 旧版本可能已累计超限，仍允许删除文件或修改文件夹属性。
          if (addedBytes > 0) assertResourceCapacity(snapshot.userUsedBytes, addedBytes);
          store.put({ courseId, folders } satisfies CourseResources);
          snapshot = { folders, userUsedBytes: snapshot.userUsedBytes + addedBytes };
        }
      } catch (error) {
        failure = error;
        transaction.abort();
      }
    };
    transaction.oncomplete = () => {
      database.close();
      resolve(snapshot);
    };
    transaction.onabort = () => {
      database.close();
      reject(failure ?? new Error(transaction.error?.name === 'QuotaExceededError'
        ? '浏览器可用存储空间不足，文件未保存，请释放空间后重试。'
        : '资源保存失败，请检查浏览器存储权限后重试。'));
    };
  });
}
