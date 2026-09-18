import React, { useState } from 'react';
import { Search, ChevronDown, Plus, MoreHorizontal, Eye, Copy, Tag, Edit, Trash2, ArrowLeftRight, Check, X } from 'lucide-react';

// Mock data
const mockCourses = [
  { id: 1, title: '数据标注与处理（中职）', status: '已发布', major: '人工智能/基础', desc: '本课程是中等职业学校人工智能专业的专业...', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: '深度学习应用技术', status: '未发布', major: '人工智能/深度学习', desc: '深入浅出地讲解深度学习的基础技术与实际...', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: '计算机视觉技术应用', status: '未发布', major: '人工智能/计算机视觉', desc: '熟悉计算机视觉技术应用', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
  { id: 4, title: 'Python程序设计', status: '未发布', major: '人工智能/基础', desc: 'Python程序设计', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
  { id: 5, title: '计算机视觉技术应用', status: '未发布', major: '人工智能/计算机视觉', desc: '熟悉计算机视觉技术应用', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
  { id: 6, title: '数字图像处理技术应用', status: '未发布', major: '人工智能/计算机视觉', desc: '数字图像处理技术应用', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
  { id: 7, title: 'Pytorch深度学习技术应用', status: '未发布', major: '人工智能/深度学习', desc: 'Pytorch深度学习技术应用', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
  { id: 8, title: 'Python程序设计', status: '未发布', major: '人工智能/基础', desc: 'Python程序设计', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
];

export default function CourseList({ onEditCourse }: { onEditCourse: (id: number) => void }) {
  const [activeTab, setActiveTab] = useState('全部');
  const [activeMajor, setActiveMajor] = useState('全部');
  const [hoveredCourseId, setHoveredCourseId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const majors = ['全部', '物联网', '人工智能', '工业互联网', '大数据', '区块链', '专业技术技能', '岗位课程'];
  const tabs = ['全部', '已发布', '未发布'];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <button className="flex items-center px-4 py-2 bg-[#1890ff] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4 mr-1" /> 新增课程
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-slate-200 rounded overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50 border-r border-slate-200 text-sm text-slate-500 flex items-center cursor-pointer hover:bg-slate-100 transition-colors">
              请选择标签 <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </div>
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="请输入名称进行搜索" 
                className="w-64 px-3 py-1.5 text-sm focus:outline-none"
              />
              <button className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-slate-400 hover:text-slate-600 border-l border-slate-100 bg-slate-50">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button className="flex items-center text-sm text-slate-600 hover:text-[#1890ff] transition-colors ml-4">
            <ArrowLeftRight className="w-4 h-4 mr-1" /> 切换模式
          </button>
        </div>
      </div>

      {/* Majors Filter */}
      <div className="flex items-center px-4 py-3 border-b border-slate-100">
        <span className="text-sm text-slate-500 mr-4 font-medium">专业：</span>
        <div className="flex flex-wrap gap-2 flex-1">
          {majors.map(major => (
            <button
              key={major}
              onClick={() => setActiveMajor(major)}
              className={`px-4 py-1 rounded text-sm transition-colors ${
                activeMajor === major 
                  ? 'bg-blue-50 text-[#1890ff] border border-blue-200' 
                  : 'text-slate-600 hover:text-[#1890ff] border border-transparent'
              }`}
            >
              {major}
            </button>
          ))}
        </div>
        <button className="text-sm text-slate-500 flex items-center hover:text-slate-700">
          展开 <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex space-x-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm py-2 relative transition-colors ${
                activeTab === tab ? 'text-[#1890ff] font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1890ff] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
        <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center">
          <MoreHorizontal className="w-4 h-4 mr-1" /> 更多操作
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockCourses.map(course => (
            <div 
              key={course.id} 
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow relative"
              onMouseEnter={() => setHoveredCourseId(course.id)}
              onMouseLeave={() => setHoveredCourseId(null)}
            >
              <div className="relative h-40 bg-blue-100 overflow-hidden">
                <img src={course.cover} alt={course.title} className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium text-white ${
                  course.status === '已发布' ? 'bg-green-500' : 'bg-slate-400'
                }`}>
                  {course.status}
                </div>
                <div className="absolute bottom-4 left-4 text-white font-bold text-xl drop-shadow-md z-10">
                  {course.title}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800 truncate" title={course.title}>{course.title}</h3>
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === course.id ? null : course.id);
                      }}
                      className="p-1 rounded bg-blue-50 text-[#1890ff] hover:bg-blue-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpenId === course.id && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded shadow-lg border border-slate-100 py-1 z-20">
                        {course.status === '已发布' ? (
                          <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 flex items-center">
                            <X className="w-4 h-4 mr-2" /> 取消发布
                          </button>
                        ) : (
                          <button className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-slate-50 flex items-center">
                            <Check className="w-4 h-4 mr-2" /> 发布课程
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setMenuOpenId(null);
                            onEditCourse(course.id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1890ff] flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" /> 编辑
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1890ff] flex items-center">
                          <Eye className="w-4 h-4 mr-2" /> 查看
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1890ff] flex items-center">
                          <Copy className="w-4 h-4 mr-2" /> 复制
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1890ff] flex items-center">
                          <Tag className="w-4 h-4 mr-2" /> 标签绑定
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-[#1890ff] mb-2">{course.major}</div>
                <div className="text-xs text-slate-500 mb-4 line-clamp-1" title={course.desc}>
                  课程概述：{course.desc}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-500">
                    <span className="mr-2">环境：</span>
                    <span className="w-5 h-5 bg-blue-50 text-[#1890ff] rounded flex items-center justify-center font-bold text-[10px]">U</span>
                  </div>
                  {course.isAI && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                      AI
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination (Simplified) */}
      <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-sm text-slate-500">
        <div>共 762 条</div>
        <div className="flex items-center space-x-2">
          <select className="border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none">
            <option>20条/页</option>
          </select>
          <div className="flex space-x-1">
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400">&lt;</button>
            <button className="w-8 h-8 rounded bg-[#1890ff] text-white flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">2</button>
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">3</button>
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">4</button>
            <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-50">...</button>
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">39</button>
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">&gt;</button>
          </div>
          <div className="flex items-center ml-2">
            前往 <input type="text" className="w-10 border border-slate-200 rounded px-1 text-center mx-1 h-8 focus:outline-none" defaultValue="1" /> 页
          </div>
        </div>
      </div>
    </div>
  );
}
