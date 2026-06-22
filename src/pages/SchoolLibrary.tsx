import React from 'react';
import { Plus, ChevronDown, ChevronRight, ChevronLeft, Search } from 'lucide-react';

function Header() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br from-blue-500 to-indigo-600 rounded">
                N
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">UUSIMA <span className="font-medium text-base ml-1">智慧教学实验平台</span></span>
          </div>
          <div className="h-5 w-px bg-slate-300 mx-2" />
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600">课程大厅</a>
            <a href="#" className="hover:text-blue-600">实验大厅</a>
            <a href="#" className="hover:text-blue-600">考试大厅</a>
            <a href="#" className="hover:text-blue-600">最佳实践</a>
            <a href="#" className="hover:text-blue-600">产品中心</a>
            <a href="#" className="hover:text-blue-600">关于UUSIMA</a>
          </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src="https://ui-avatars.com/api/?name=AI&background=eff6ff&color=1d4ed8" alt="AI Agent" className="w-6 h-6 rounded-full" />
          <div className="flex items-center bg-slate-100 rounded px-2 py-1 text-xs text-slate-600">
            中/En
          </div>
        </div>
        <span className="text-sm font-medium text-slate-600">我的主页</span>
        <div className="flex items-center text-sm font-medium text-slate-600 cursor-pointer">
          学校管理员 <ChevronDown className="w-4 h-4 ml-1" />
        </div>
      </div>
    </header>
  );
}

export default function SchoolLibrary() {
  const tableData = [
    { id: 1, name: '清华大学', code: '12100000400000624D', level: '本科', status: true },
    { id: 2, name: '复旦大学', code: '1210000042500615X0', level: '本科', status: true },
    { id: 3, name: '深圳职业技术大学', code: '124403004558588048', level: '专科', status: false },
    { id: 4, name: '演示高中', code: '121000004000329000', level: '高中', status: true },
  ];

  return (
    <div className="absolute inset-0 bg-[#eef1f6] flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex overflow-hidden">
         {/* 左侧菜单 */}
         <aside className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col py-2 shrink-0">
          <nav className="flex-1 space-y-1">
             <div className="group cursor-pointer">
               <div className="px-6 py-3 flex justify-between items-center text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <div className="flex items-center">
                    <span className="w-4 flex justify-center text-blue-600 mr-2 text-lg">🏢</span> 基础数据
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
               </div>
               <div className="bg-blue-50/50">
                  <button className="w-full text-left pl-12 pr-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-100/50 border-r-2 border-blue-600 transition-colors">
                     院校库管理
                  </button>
                  <button className="w-full text-left pl-12 pr-6 py-2.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                     专业库管理
                  </button>
               </div>
             </div>
             
             <div className="group cursor-pointer">
               <div className="px-6 py-3 flex justify-between items-center text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                  <div className="flex items-center">
                    <span className="w-4 flex justify-center text-slate-400 mr-2 text-lg">👥</span> 成员管理
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
               </div>
             </div>

             <div className="group cursor-pointer">
               <div className="px-6 py-3 flex justify-between items-center text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                  <div className="flex items-center">
                    <span className="w-4 flex justify-center text-slate-400 mr-2 text-lg">📚</span> 教学管理
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
               </div>
             </div>
          </nav>
        </aside>

        {/* 右侧工作区 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#eef1f6] flex flex-col">
          
          <div className="bg-white rounded border border-slate-200 flex-1 flex flex-col p-4">
            
            {/* 顶部搜索与筛选区 */}
            <div className="flex items-center justify-between mb-4 pb-4">
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap">名称：</span>
                  <input type="text" className="border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-1.5 text-sm w-[200px] outline-none" placeholder="请输入名称" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap">办学层次：</span>
                  <select className="border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-1.5 text-sm w-[160px] bg-white outline-none">
                    <option>请选择办学层次</option>
                    <option>本科</option>
                    <option>专科</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3 ml-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap">状态：</span>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-slate-600">启用</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-slate-600">禁用</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-2 shrink-0 ml-4">
                <button className="px-5 py-1.5 bg-blue-600 text-white text-sm rounded shadow-sm hover:bg-blue-700 flex flex-row items-center">
                  <Search className="w-3.5 h-3.5 mr-1" /> 查询
                </button>
                <button className="px-5 py-1.5 bg-slate-100 text-slate-600 text-sm border border-slate-200 rounded hover:bg-slate-200 flex flex-row items-center">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> 重置
                </button>
              </div>
            </div>

            {/* 操作按钮栏 */}
            <div className="mb-4 flex space-x-2">
              <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center shadow-sm">
                <Plus className="w-4 h-4 mr-1"/> 新增
              </button>
              <button className="px-4 py-1.5 bg-white text-blue-600 border border-blue-600 text-sm rounded hover:bg-blue-50 shadow-sm">
                批量导入
              </button>
              <button className="px-4 py-1.5 bg-white text-slate-600 border border-slate-300 text-sm rounded hover:bg-slate-50 shadow-sm">
                数据导出
              </button>
            </div>

            {/* 数据表格区 */}
            <div className="border border-slate-200 rounded overflow-hidden flex-1 flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-[#f8f9fa] text-slate-700 font-medium">
                    <tr>
                      <th className="px-4 py-3 border-b border-slate-200 font-medium text-center w-16">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      </th>
                      <th className="px-4 py-3 border-b border-slate-200 font-medium">序号</th>
                      <th className="px-4 py-3 border-b border-slate-200 font-medium">学校全称</th>
                      <th className="px-4 py-3 border-b border-slate-200 font-medium">统一社会信用代码</th>
                      <th className="px-4 py-3 border-b border-slate-200 font-medium">办学层次</th>
                      <th className="px-4 py-3 border-b border-slate-200 font-medium text-center">状态</th>
                      <th className="px-4 py-3 border-b border-slate-200 font-medium text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, idx) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        </td>
                        <td className="px-4 py-3">{idx + 1}</td>
                        <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">{row.name}</td>
                        <td className="px-4 py-3">{row.code}</td>
                        <td className="px-4 py-3">{row.level}</td>
                        <td className="px-4 py-3 text-center">
                           <label className="relative inline-flex items-center cursor-pointer">
                             <input type="checkbox" className="sr-only peer" defaultChecked={row.status} />
                             <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                           </label>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-3 text-blue-600">
                            <button className="hover:text-blue-800 transition-colors">查看</button>
                            <button className="hover:text-blue-800 transition-colors">编辑</button>
                            <button className="hover:text-blue-800 transition-colors text-red-500 hover:text-red-700">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                 <div className="text-sm text-slate-500">
                   共 4 条
                 </div>
                 <div className="flex items-center space-x-1">
                   <select className="border border-slate-300 rounded text-sm px-2 py-1 bg-white outline-none text-slate-700 mr-2">
                     <option>10 条/页</option>
                     <option>20 条/页</option>
                   </select>
                   <button className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded text-slate-400 hover:bg-slate-50">
                     <ChevronLeft className="w-4 h-4" />
                   </button>
                   <button className="w-8 h-8 flex items-center justify-center border border-blue-600 bg-blue-600 text-white rounded text-sm font-medium">
                     1
                   </button>
                   <button className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded text-slate-400 hover:bg-slate-50">
                     <ChevronRight className="w-4 h-4" />
                   </button>
                 </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
