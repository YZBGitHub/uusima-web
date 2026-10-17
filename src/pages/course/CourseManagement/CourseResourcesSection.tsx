import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Edit3, File, Folder, FolderPlus, HardDrive, Loader2, Trash2, Upload, X } from 'lucide-react';
import {
  accessCourseResources, assertResourceCapacity, USER_RESOURCE_LIMIT, CourseResourceFolder,
  folderSize, formatResourceSize, resourceSize,
} from './courseResourceStorage';

const primaryButton = 'inline-flex items-center justify-center gap-1.5 rounded bg-[#409eff] px-4 py-2 text-sm text-white hover:bg-[#66b1ff] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer';
const secondaryButton = 'inline-flex items-center justify-center gap-1.5 rounded border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer';

export default function CourseResourcesSection({ courseId, showToast }: {
  courseId: number;
  showToast: (message: string) => void;
}) {
  const [folders, setFolders] = useState<CourseResourceFolder[]>([]);
  const [userUsedBytes, setUserUsedBytes] = useState(0);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [folderForm, setFolderForm] = useState<{ id?: string; name: string; remark: string; shared: boolean } | null>(null);
  const [formError, setFormError] = useState('');
  const [deletion, setDeletion] = useState<{ folderId: string; fileId?: string; name: string } | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    setError('');
    setSelectedFolderId(null);
    accessCourseResources(courseId).then(data => {
      if (!cancelled) { setFolders(data.folders); setUserUsedBytes(data.userUsedBytes); }
    }).catch(reason => {
      if (!cancelled) {
        setError(reason instanceof Error ? reason.message : '资源读取失败，请重试。');
        setLoadFailed(true);
      }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [courseId, reload]);

  useEffect(() => {
    let cancelled = false;
    const refreshUsage = () => {
      accessCourseResources(courseId).then(data => {
        if (!cancelled) { setFolders(data.folders); setUserUsedBytes(data.userUsedBytes); }
      }).catch(() => { /* 正常加载和写入流程负责展示存储错误。 */ });
    };
    window.addEventListener('focus', refreshUsage);
    return () => { cancelled = true; window.removeEventListener('focus', refreshUsage); };
  }, [courseId]);

  useEffect(() => { if (deletion) cancelRef.current?.focus(); }, [deletion]);

  const selectedFolder = folders.find(folder => folder.id === selectedFolderId);
  const usedBytes = resourceSize(folders);
  const fileCount = folders.reduce((count, folder) => count + folder.files.length, 0);

  const mutate = async (update: (current: CourseResourceFolder[], userUsedBytes: number) => CourseResourceFolder[], message: string) => {
    setBusy(true);
    setError('');
    try {
      const next = await accessCourseResources(courseId, update);
      setFolders(next.folders);
      setUserUsedBytes(next.userUsedBytes);
      showToast(message);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '操作失败，请重试。');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const saveFolder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!folderForm || busy) return;
    const name = folderForm.name.trim();
    if (!name) { setFormError('请输入文件夹名称'); return; }
    if (folders.some(folder => folder.id !== folderForm.id && folder.name === name)) {
      setFormError('文件夹名称已存在，请使用其他名称'); return;
    }
    const success = await mutate(current => {
      if (current.some(folder => folder.id !== folderForm.id && folder.name === name)) throw new Error('文件夹名称已存在，请使用其他名称。');
      const fields = { name, remark: folderForm.remark.trim(), shared: folderForm.shared };
      if (folderForm.id) {
        if (!current.some(folder => folder.id === folderForm.id)) throw new Error('文件夹已被删除，请刷新列表。');
        return current.map(folder => folder.id === folderForm.id ? { ...folder, ...fields } : folder);
      }
      return [...current, { id: crypto.randomUUID(), ...fields, files: [] }];
    }, folderForm.id ? '文件夹已更新' : '文件夹已创建');
    if (success) setFolderForm(null);
  };

  const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []) as File[];
    event.target.value = '';
    if (!files.length || !selectedFolder || busy) return;
    const folderId = selectedFolder.id;
    const uploadedAt = new Date().toISOString();
    await mutate((current, totalUsedBytes) => {
      if (!current.some(folder => folder.id === folderId)) throw new Error('文件夹已被删除，请返回资源列表。');
      assertResourceCapacity(totalUsedBytes, files.reduce((sum, file) => sum + file.size, 0));
      const additions = files.map(file => ({
        id: crypto.randomUUID(), name: file.name, size: file.size,
        type: file.name.includes('.') ? file.name.split('.').pop()!.toUpperCase() : file.type || '未知类型',
        uploadedAt, content: file,
      }));
      return current.map(folder => folder.id === folderId ? { ...folder, files: [...folder.files, ...additions] } : folder);
    }, `已上传 ${files.length} 个文件`);
  };

  const confirmDelete = async () => {
    if (!deletion || busy) return;
    const success = await mutate(current => deletion.fileId
      ? current.map(folder => folder.id === deletion.folderId ? { ...folder, files: folder.files.filter(file => file.id !== deletion.fileId) } : folder)
      : current.filter(folder => folder.id !== deletion.folderId), deletion.fileId ? '文件已删除' : '文件夹及其文件已删除');
    if (success) setDeletion(null);
  };

  const modalKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && !busy) { setFolderForm(null); setDeletion(null); }
    if (event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll('button:not(:disabled), input, textarea')) as HTMLElement[];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };

  return (
    <section aria-label="课程资源" className="space-y-5 text-sm">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800"><HardDrive className="h-5 w-5 text-[#409eff]" />课程资源</h3>
            <p className="mt-2 text-slate-500">管理本课程的文件资源，按文件夹设置共享。</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">容量说明：10 GB 为当前用户的总资源容量，所有课程共用；本课程上传的文件计入用户已用空间。</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500">用户已用空间 <strong className="ml-2 text-lg font-semibold text-[#409eff]">{formatResourceSize(userUsedBytes)}</strong><span className="ml-1">/ 10 GB</span></p>
            <p className="mt-1 text-xs text-slate-400">本课程占用 {formatResourceSize(usedBytes)} · {folders.length} 个文件夹 · {fileCount} 个文件</p>
          </div>
        </div>
        <div role="progressbar" aria-label="当前用户总资源空间使用量" aria-valuemin={0} aria-valuemax={USER_RESOURCE_LIMIT} aria-valuenow={Math.min(userUsedBytes, USER_RESOURCE_LIMIT)} aria-valuetext={`${formatResourceSize(userUsedBytes)} / 10 GB`} className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#409eff] transition-[width]" style={{ width: `${Math.min(100, userUsedBytes / USER_RESOURCE_LIMIT * 100)}%` }} />
        </div>
      </div>

      {error && <div role="alert" className="rounded border border-red-100 bg-red-50 px-4 py-3 text-red-600">{error}{loadFailed && <button type="button" onClick={() => setReload(value => value + 1)} className="ml-3 cursor-pointer underline">重试</button>}</div>}

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div className="flex min-w-0 items-center gap-3">
            {selectedFolder && <button type="button" onClick={() => setSelectedFolderId(null)} className={secondaryButton}><ArrowLeft className="h-4 w-4" />返回</button>}
            <h4 className="break-all font-medium text-slate-800">{selectedFolder ? selectedFolder.name : '文件夹列表'}</h4>
            {busy && <span role="status" className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400"><Loader2 className="h-3.5 w-3.5 animate-spin" />保存中</span>}
          </div>
          {selectedFolder ? <>
            <input ref={uploadRef} type="file" multiple hidden onChange={uploadFiles} />
            <button type="button" disabled={busy || loading || loadFailed} onClick={() => uploadRef.current?.click()} className={primaryButton}><Upload className="h-4 w-4" />上传文件</button>
          </> : <button type="button" disabled={busy || loading || loadFailed} onClick={() => { setFormError(''); setFolderForm({ name: '', remark: '', shared: false }); }} className={primaryButton}><FolderPlus className="h-4 w-4" />新建文件夹</button>}
        </div>
        {selectedFolder && <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-100 px-4 py-3 text-xs text-slate-500"><span className="break-all">备注：{selectedFolder.remark || '暂无备注'}</span><span>文件夹大小：{formatResourceSize(folderSize(selectedFolder))}</span><span>{selectedFolder.shared ? '已开启共享' : '未共享'}</span></div>}

        <div className="overflow-x-auto">
          {selectedFolder ? (
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-slate-50 text-slate-500"><tr>{['名称', '大小', '类型', '上传时间', '操作'].map(label => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {selectedFolder.files.map(file => <tr key={file.id} className="hover:bg-slate-50/60">
                  <td className="max-w-xs px-4 py-4"><span className="flex items-center gap-2"><File className="h-4 w-4 shrink-0 text-[#409eff]" /><span className="break-all">{file.name}</span></span></td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-500">{formatResourceSize(file.size)}</td>
                  <td className="max-w-40 break-all px-4 py-4 text-slate-500">{file.type}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-500">{new Date(file.uploadedAt).toLocaleString('zh-CN', { hour12: false })}</td>
                  <td className="px-4 py-4"><button type="button" disabled={busy} onClick={() => setDeletion({ folderId: selectedFolder.id, fileId: file.id, name: file.name })} className="cursor-pointer text-red-500 hover:text-red-600 disabled:opacity-50" aria-label={`删除文件 ${file.name}`}>删除</button></td>
                </tr>)}
                {!selectedFolder.files.length && <tr><td colSpan={5} className="px-4 py-16 text-center text-slate-400">暂无文件，点击“上传文件”添加课程资源</td></tr>}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[740px] text-left">
              <thead className="bg-slate-50 text-slate-500"><tr>{['文件夹名称', '备注', '文件数', '文件夹大小', '是否共享', '操作'].map(label => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && !loadFailed && folders.map(folder => <tr key={folder.id} className="hover:bg-slate-50/60">
                  <td className="max-w-xs px-4 py-4"><button type="button" onClick={() => setSelectedFolderId(folder.id)} className="flex cursor-pointer items-center gap-2 text-[#409eff] hover:underline"><Folder className="h-5 w-5 shrink-0" /><span className="break-all text-left">{folder.name}</span></button></td>
                  <td className="max-w-64 px-4 py-4 text-slate-500"><p className="line-clamp-2 break-all" title={folder.remark}>{folder.remark || '—'}</p></td>
                  <td className="px-4 py-4 text-slate-500">{folder.files.length}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-500">{formatResourceSize(folderSize(folder))}</td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2">
                    <button type="button" role="switch" aria-checked={folder.shared} aria-label={`共享文件夹 ${folder.name}`} disabled={busy} onClick={() => mutate(current => current.map(item => item.id === folder.id ? { ...item, shared: !folder.shared } : item), folder.shared ? '已关闭文件夹共享' : '已开启文件夹共享')} className={`relative h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors disabled:opacity-50 ${folder.shared ? 'bg-[#409eff]' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-[left] ${folder.shared ? 'left-[22px]' : 'left-0.5'}`} /></button>
                    <span className="whitespace-nowrap text-xs text-slate-400">{folder.shared ? '已共享' : '未共享'}</span>
                  </div></td>
                  <td className="px-4 py-4"><div className="flex gap-3">
                    <button type="button" disabled={busy} onClick={() => { setFormError(''); setFolderForm({ id: folder.id, name: folder.name, remark: folder.remark, shared: folder.shared }); }} aria-label={`编辑文件夹 ${folder.name}`} className="cursor-pointer text-[#409eff] disabled:opacity-50"><Edit3 className="h-4 w-4" /></button>
                    <button type="button" disabled={busy} onClick={() => setDeletion({ folderId: folder.id, name: folder.name })} aria-label={`删除文件夹 ${folder.name}`} className="cursor-pointer text-red-500 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                  </div></td>
                </tr>)}
                {(loading || loadFailed || !folders.length) && <tr><td colSpan={6} className="px-4 py-16 text-center text-slate-400">{loading ? '正在加载课程资源…' : loadFailed ? '课程资源加载失败，请重试' : '暂无文件夹，点击“新建文件夹”添加课程资源'}</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {folderForm && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 p-4" onKeyDown={modalKeys}>
        <form onSubmit={saveFolder} role="dialog" aria-modal="true" aria-labelledby="resource-folder-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 p-5"><h3 id="resource-folder-title" className="text-base font-semibold">{folderForm.id ? '编辑文件夹' : '新建文件夹'}</h3><button type="button" disabled={busy} onClick={() => setFolderForm(null)} aria-label="关闭" className="cursor-pointer text-slate-400"><X className="h-5 w-5" /></button></div>
          <div className="space-y-4 p-5">
            <div><label htmlFor="resource-folder-name" className="mb-2 block">文件夹名称 <span className="text-red-500">*</span></label><input id="resource-folder-name" autoFocus required maxLength={100} value={folderForm.name} onChange={event => { setFolderForm({ ...folderForm, name: event.target.value }); setFormError(''); }} placeholder="请输入文件夹名称" className="h-9 w-full rounded border border-slate-200 px-3 outline-none focus:border-[#409eff]" /></div>
            <div><label htmlFor="resource-folder-remark" className="mb-2 block">备注</label><textarea id="resource-folder-remark" maxLength={500} rows={3} value={folderForm.remark} onChange={event => setFolderForm({ ...folderForm, remark: event.target.value })} placeholder="请输入文件夹备注" className="w-full resize-y rounded border border-slate-200 px-3 py-2 outline-none focus:border-[#409eff]" /><p className="mt-1 text-right text-xs text-slate-400">{folderForm.remark.length}/500</p></div>
            <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={folderForm.shared} onChange={event => setFolderForm({ ...folderForm, shared: event.target.checked })} className="accent-[#409eff]" />共享此文件夹</label>
            {formError && <p role="alert" className="text-red-500">{formError}</p>}
            {error && <p role="alert" className="text-red-500">{error}</p>}
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 p-4"><button type="button" disabled={busy} onClick={() => setFolderForm(null)} className={secondaryButton}>取消</button><button type="submit" disabled={busy} className={primaryButton}>{busy ? '保存中…' : '保存'}</button></div>
        </form>
      </div>}

      {deletion && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 p-4" onKeyDown={modalKeys}>
        <div role="dialog" aria-modal="true" aria-labelledby="resource-delete-title" aria-describedby="resource-delete-description" className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h3 id="resource-delete-title" className="text-base font-semibold">{deletion.fileId ? '删除文件' : '删除文件夹'}</h3>
          <p id="resource-delete-description" className="mt-4 break-all leading-6 text-slate-500">确定删除“{deletion.name}”吗？{deletion.fileId ? '该文件将被移除。' : '文件夹内的所有文件也将一并删除。'}此操作无法撤销。</p>
          {error && <p role="alert" className="mt-3 text-red-500">{error}</p>}
          <div className="mt-6 flex justify-end gap-3"><button ref={cancelRef} type="button" disabled={busy} onClick={() => setDeletion(null)} className={secondaryButton}>取消</button><button type="button" disabled={busy} onClick={confirmDelete} className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50">{busy ? '删除中…' : '确认删除'}</button></div>
        </div>
      </div>}
    </section>
  );
}
