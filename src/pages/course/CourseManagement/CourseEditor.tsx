import React, { useState } from 'react';
import { ArrowLeft, Eye, X, Book, Layout, BarChart, Tag as TagIcon, Edit3, Plus, Settings, Cpu, ChevronDown, CheckSquare, Image as ImageIcon, Video, Target, Edit } from 'lucide-react';
import StepEditorModal from './StepEditorModal';

interface CourseEditorProps {
  onBack: () => void;
  courseId: number;
}

export default function CourseEditor({ onBack, courseId }: CourseEditorProps) {
  const [activeMenu, setActiveMenu] = useState('chapters');
  const [editingTask, setEditingTask] = useState<any>(null);

  const sidebarMenu = [
    { id: 'info', label: '基本信息', icon: Book },
    { id: 'settings', label: '课程设置', icon: Settings },
    { id: 'chapters', label: '课程章节', icon: Layout },
    { id: 'ai', label: 'AI技能助手', icon: Cpu },
    { id: 'graph', label: '技能图谱', icon: Target },
  ];

  const chapters = [
    {
      id: 1, 
      title: '第一章：图片标注',
      tasks: [
        { id: '1-1', title: '1-1 任务1：图像基础操作（图文）', type: 'text', hasTrial: true },
        { id: '1-2', title: '1-2 任务1：图像基础操作（视频）', type: 'video', hasTrial: true },
        { id: '1-3', title: '1-3 任务1：图像基础操作（习题）', type: 'exercise', hasTrial: true },
        { id: '1-4', title: '1-4 任务2：图像处理（实验）', type: 'experiment', hasTrial: false },
        { id: '1-5', title: '1-5 任务2：图像处理（报告）', type: 'report', hasTrial: false },
        { id: '1-6', title: '1-6 任务2：图像处理（实验2）', type: 'experiment', hasTrial: false },
        { id: '1-7', title: '1-7 任务3：图像分类标注（图文）', type: 'text', hasTrial: false },
        { id: '1-8', title: '1-8 任务3：图像分类标注（习题）', type: 'exercise', hasTrial: false },
      ]
    }
  ];

  const typeConfig: Record<string, { label: string, color: string }> = {
    text: { label: '图文', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    video: { label: '视频', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
    exercise: { label: '习题', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    experiment: { label: '实验', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    report: { label: '报告', color: 'bg-purple-100 text-purple-600 border-purple-200' }
  };
  
  const specificSetting: Record<string, string> = {
    video: '视频设置',
    exercise: '题目设置',
    experiment: '实验设置',
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Top Header */}
      <div className="h-28 border-b border-slate-200 bg-white flex items-center px-6 shrink-0 shadow-sm relative z-10">
        <div className="w-48 h-20 bg-blue-100 rounded-lg overflow-hidden mr-6 shrink-0 relative">
          <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400" alt="cover" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-md">
            数据标注与处理
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <h2 className="text-xl font-bold text-slate-800 mr-2">数据标注与处理（中职）</h2>
            <button className="text-[#1890ff] hover:bg-blue-50 p-1 rounded transition-colors"><Edit3 className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center space-x-8 text-sm text-slate-600">
            <div className="flex items-center"><Book className="w-4 h-4 mr-1.5 text-slate-400" /> 专业：<span className="font-medium ml-1">基础</span> <Edit3 className="w-3.5 h-3.5 ml-1 text-[#1890ff] cursor-pointer" /></div>
            <div className="flex items-center"><Layout className="w-4 h-4 mr-1.5 text-slate-400" /> 课程类型：<span className="font-medium ml-1">技能课程</span> <Edit3 className="w-3.5 h-3.5 ml-1 text-[#1890ff] cursor-pointer" /></div>
            <div className="flex items-center"><BarChart className="w-4 h-4 mr-1.5 text-slate-400" /> 层次：<span className="font-medium ml-1">中职</span> <Edit3 className="w-3.5 h-3.5 ml-1 text-[#1890ff] cursor-pointer" /></div>
            <div className="flex items-center"><TagIcon className="w-4 h-4 mr-1.5 text-slate-400" /> 课程标签：<span className="font-medium ml-1">暂无标签</span> <Edit3 className="w-3.5 h-3.5 ml-1 text-[#1890ff] cursor-pointer" /></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 ml-4 shrink-0">
          <button onClick={onBack} className="px-4 py-2 bg-white border border-blue-200 text-[#1890ff] rounded text-sm hover:bg-blue-50 transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回
          </button>
          <button className="px-4 py-2 bg-blue-50 text-[#1890ff] rounded text-sm hover:bg-blue-100 transition-colors flex items-center border border-transparent hover:border-blue-200">
            <Eye className="w-4 h-4 mr-1" /> 预览
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center">
            取消发布
          </button>
        </div>
      </div>

      {/* Main Edit Area */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {/* Left Sidebar */}
        <div className="w-48 bg-white border-r border-slate-200 py-4 shrink-0">
          <div className="space-y-1 px-3">
            {sidebarMenu.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeMenu === item.id 
                    ? 'bg-blue-50 text-[#1890ff] font-medium' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-4 h-4 mr-3 ${activeMenu === item.id ? 'text-[#1890ff]' : 'text-slate-400'}`} />
                {item.label}
                {activeMenu === item.id && <div className="absolute left-0 w-1 h-8 bg-[#1890ff] rounded-r-md"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeMenu === 'chapters' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* Actions */}
              <div className="flex items-center justify-between mb-6">
                <button className="px-4 py-2 bg-[#1890ff] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors flex items-center shadow-sm shadow-blue-200">
                  <Plus className="w-4 h-4 mr-1" /> 新增章/项目
                </button>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-1.5 bg-[#1890ff] text-white rounded text-sm hover:bg-blue-600 transition-colors">保存</button>
                  <button className="px-4 py-1.5 bg-blue-200 text-blue-700 rounded text-sm hover:bg-blue-300 transition-colors">试学</button>
                  <button className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded text-sm hover:bg-slate-300 transition-colors">取消试学</button>
                  <button className="px-4 py-1.5 bg-red-200 text-red-600 rounded text-sm hover:bg-red-300 transition-colors">批量删除</button>
                </div>
              </div>

              {/* Chapter List */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {chapters.map(chapter => (
                  <div key={chapter.id}>
                    {/* Chapter Header */}
                    <div className="flex items-center px-4 py-3 bg-slate-50 border-b border-slate-200 group">
                      <input type="checkbox" className="mr-3 rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff]" />
                      <ChevronDown className="w-4 h-4 text-slate-400 mr-2 cursor-pointer" />
                      <span className="font-bold text-slate-800 text-sm">{chapter.title}</span>
                      <Edit3 className="w-3.5 h-3.5 ml-2 text-[#1890ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Tasks */}
                    <div className="divide-y divide-slate-100">
                      {chapter.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between px-4 py-3 hover:bg-blue-50/50 group transition-colors">
                          <div className="flex items-center flex-1">
                            <input type="checkbox" className="mr-3 rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff] ml-7" />
                            {task.type && typeConfig[task.type] && (
                              <span className={`px-2 py-0.5 rounded text-xs font-medium border mr-3 ${typeConfig[task.type].color}`}>
                                {typeConfig[task.type].label}
                              </span>
                            )}
                            
                            <span className="text-sm text-slate-700">{task.title}</span>
                            <Edit3 className="w-3.5 h-3.5 ml-2 text-[#1890ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {task.hasTrial && (
                              <span className="ml-3 px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs font-medium border border-pink-200">试学</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setEditingTask({ ...task, chapterName: chapter.title })}
                              className="text-[#1890ff] hover:text-blue-700 text-sm font-medium"
                            >
                              编辑
                            </button>
                            {task.hasTrial && (
                              <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                                取消试学
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {editingTask && (
        <StepEditorModal 
          courseName="数据标注与处理" 
          task={editingTask} 
          chapters={chapters}
          onClose={() => setEditingTask(null)} 
        />
      )}
    </div>
  );
}
