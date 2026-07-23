import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const mockClasses: any[] = [];

export default function ClassManagement() {
  const [searchText, setSearchText] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [statusEnabled, setStatusEnabled] = useState(true);
  const [statusDisabled, setStatusDisabled] = useState(false);

  return (
<div className="flex h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Left Tree */}
      <div className="w-64 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="请输入组织名称搜索" 
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <div className="text-sm font-medium text-slate-700">
              <div className="flex items-center justify-between group py-1.5 cursor-pointer hover:bg-slate-100 rounded px-1 -mx-1">
                 <div className="flex items-center">
                    <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
                    <span>新大陆-大数据专业</span>
                 </div>
                 <div className="hidden group-hover:flex items-center space-x-2 text-blue-500">
                    <Plus className="w-3.5 h-3.5 hover:text-blue-700" />
                    <Edit2 className="w-3.5 h-3.5 hover:text-blue-700" />
                    <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                 </div>
              </div>
              <div className="pl-5 mt-1 space-y-1">
                 {[
                   '区块链1班',
                   '考试202601班',
                   '阅卷班级',
                   '考试1班',
                   '体验用户',
                   '内部账号'
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between group py-1.5 cursor-pointer hover:bg-slate-100 rounded px-1 -mx-1 transition-colors">
                     <span className="text-slate-600">{item}</span>
                     <div className="hidden group-hover:flex items-center space-x-2 text-blue-500">
                        <Plus className="w-3.5 h-3.5 hover:text-blue-700" />
                        <Edit2 className="w-3.5 h-3.5 hover:text-blue-700" />
                        <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Right Table Panel */}
      <div className="flex-1 flex flex-col p-6 min-w-0">
         {/* Filters */}
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6 flex-1 pr-6 flex-wrap gap-y-4">
               <div className="flex items-center space-x-2">
                 <label className="text-sm text-slate-700 shrink-0">名称:</label>
                 <input 
                   type="text" 
                   placeholder="请输入名称" 
                   value={searchText}
                   onChange={e => setSearchText(e.target.value)}
                   className="border border-slate-300 rounded px-3 py-1.5 text-sm w-48 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                 />
               </div>
               <div className="flex items-center space-x-2">
                 <label className="text-sm text-slate-700 shrink-0">专业:</label>
                 <select 
                   value={selectedMajor}
                   onChange={e => setSelectedMajor(e.target.value)}
                   className="border border-slate-300 rounded px-3 py-1.5 text-sm w-48 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                 >
                   <option value="">请选择专业</option>
                   <option value="物联网">物联网</option>
                   <option value="人工智能">人工智能</option>
                 </select>
               </div>
               <div className="flex items-center space-x-4">
                 <label className="text-sm text-slate-700 shrink-0">状态:</label>
                 <label className="flex items-center space-x-2 cursor-pointer">
                   <input type="checkbox" checked={statusEnabled} onChange={e => setStatusEnabled(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                   <span className="text-sm text-slate-600">启用</span>
                 </label>
                 <label className="flex items-center space-x-2 cursor-pointer">
                   <input type="checkbox" checked={statusDisabled} onChange={e => setStatusDisabled(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                   <span className="text-sm text-slate-600">禁用</span>
                 </label>
               </div>
            </div>
            
            <div className="flex items-center space-x-3 shrink-0">
               <button className="flex items-center px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white text-sm rounded shadow-sm transition-colors">
                 <Search className="w-4 h-4 mr-1.5" />
                 查询
               </button>
               <button onClick={() => {
                 setSearchText(''); setSelectedMajor(''); setStatusEnabled(true); setStatusDisabled(false);
               }} className="flex items-center px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1890ff] border border-blue-200 text-sm rounded transition-colors">
                 重置
               </button>
            </div>
         </div>

         {/* Toolbar */}
         <div className="flex items-center space-x-3 mb-4 border-t border-slate-100 pt-6">
            <button className="flex items-center px-3 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white text-sm rounded shadow-sm transition-colors">
               <Plus className="w-4 h-4 mr-1.5" />
               新增
            </button>
            <button className="flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 text-sm rounded transition-colors">
               <Check className="w-4 h-4 mr-1.5" />
               批量启用
            </button>
            <button className="flex items-center px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-sm rounded transition-colors">
               <X className="w-4 h-4 mr-1.5" />
               批量禁用
            </button>
         </div>

         {/* Table */}
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                 <tr className="bg-slate-100">
                    <th className="px-4 py-3 border-b border-white border-r w-12 text-center">
                       <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-slate-700 border-b border-white border-r">序号</th>
                    <th className="px-4 py-3 text-sm font-medium text-slate-700 border-b border-white border-r">班级名称</th>
                    <th className="px-4 py-3 text-sm font-medium text-slate-700 border-b border-white border-r">专业</th>
                    <th className="px-4 py-3 text-sm font-medium text-slate-700 border-b border-white border-r">所属组织</th>
                    <th className="px-4 py-3 text-sm font-medium text-slate-700 border-b border-white border-r w-24">状态</th>
                    <th className="px-4 py-3 text-sm font-medium text-slate-700 border-b border-white w-48">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 border-b border-slate-100">
                 {mockClasses.length > 0 ? (
                   mockClasses.map(row => (
                     <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 text-center">
                           <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">{row.no}</td>
                        <td className="px-4 py-4 text-sm text-[#1890ff] cursor-pointer hover:underline">{row.name}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{row.major}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{row.org}</td>
                        <td className="px-4 py-4">
                           <div className="flex items-center space-x-2">
                             <button className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${row.status ? 'bg-[#1890ff]' : 'bg-slate-300'}`}>
                               <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${row.status ? 'translate-x-4' : 'translate-x-0'}`} />
                             </button>
                             <span className="text-sm text-[#1890ff]">启用</span>
                           </div>
                        </td>
                        <td className="px-4 py-4 text-sm space-x-3">
                           <button className="text-[#1890ff] hover:text-blue-700">查看</button>
                           <button className="text-[#1890ff] hover:text-blue-700">归档</button>
                           <button className="text-[#1890ff] hover:text-blue-700">编辑</button>
                           <button className="text-red-500 hover:text-red-700">删除</button>
                        </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                       暂无数据
                     </td>
                   </tr>
                 )}
               </tbody>
            </table>
         </div>
         
         <div className="mt-4 flex justify-end text-sm text-slate-500">
           共 {mockClasses.length} 条数据
         </div>
      </div>
    </div>
  );
}
