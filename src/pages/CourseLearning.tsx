import React, { useState } from 'react';
import { 
  Languages, 
  ChevronDown, 
  User, 
  Wrench,
  FileText,
  Video,
  MonitorPlay,
  ArrowLeft,
  Home,
  Hourglass,
  Users
} from 'lucide-react';

export default function CourseLearning({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const learningSteps = [
    { id: '1-1', title: '1-1 任务1 NLTK预处理方法（教材）', type: 'book', tag: '图文', status: '已提交', isLastStudied: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: '1-2', title: '1-2 任务1 NLTK预处理方法（理论）', type: 'doc', tag: '图文', status: '已提交', isLastStudied: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: '1-3', title: '1-3 任务1 NLTK预处理方法（实操）', type: 'lab', tag: '实验', status: '已提交', isLastStudied: false, icon: <Wrench className="w-4 h-4 text-slate-400" /> },
    { id: '1-4', title: '1-4 任务1 NLTK预处理方法（视频）', type: 'video', tag: '视频', status: '已提交', isLastStudied: false, icon: <MonitorPlay className="w-4 h-4 text-slate-400" /> },
    { id: '1-5', title: '1-5 任务2 中文文本分词方法与工具使用（教材）', type: 'book', tag: '图文', status: '进行中', isLastStudied: true, icon: <FileText className="w-4 h-4 text-blue-500" /> },
    { id: '1-6', title: '1-6 任务2 中文文本分词方法与工具使用（理论）', type: 'doc', tag: '图文', status: '未开始', isLastStudied: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: '1-7', title: '1-7 任务2 中文文本分词方法与工具使用（实操）', type: 'lab', tag: '实验', status: '未开始', isLastStudied: false, icon: <Wrench className="w-4 h-4 text-slate-400" /> },
    { id: '1-8', title: '1-8 任务2 中文文本分词方法与工具使用（视频）', type: 'video', tag: '视频', status: '未开始', isLastStudied: false, icon: <MonitorPlay className="w-4 h-4 text-slate-400" /> },
    { id: '1-9', title: '1-9 任务3 核心词汇识别与云图开发（报告）', type: 'report', tag: '报告', status: '未开始', isLastStudied: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: '1-10', title: '1-10 任务3 核心词汇识别与云图开发（习题）', type: 'exercise', tag: '习题', status: '未开始', isLastStudied: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
            <img src="/logo.png" alt="UUSIMA 智慧教学实验平台" className="h-8 object-contain" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-500">
            <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate && onNavigate('course-hall')}>课程大厅</button>
            <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate && onNavigate('lab-hall')}>实验大厅</button>
            <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate && onNavigate('dataset-hall')}>数据大厅</button>
            <a href="#" className="hover:text-blue-500 transition-colors">AI技能分析系统</a>
            <a href="#" className="hover:text-blue-500 transition-colors">AI产教融合系统</a>
            <a href="#" className="hover:text-blue-500 transition-colors">硬件智能体系统</a>
            <a href="#" className="hover:text-blue-500 transition-colors">考试系统</a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6 text-sm">
          <button className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
            <Languages className="w-4 h-4 mr-1" />
            En
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('personal')}
            className="text-blue-600 font-medium transition-colors"
          >
            我的主页
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-slate-700 font-medium text-sm">杨振邦</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 bg-white shrink-0 shadow-sm flex flex-col py-6 overflow-y-auto z-10">
          <nav className="flex flex-col space-y-2 px-4">
            <button 
              onClick={() => onNavigate && onNavigate('personal')}
              className="flex items-center space-x-3 px-4 py-3 bg-[#e6f0ff] text-blue-600 rounded-lg font-medium transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>学生主页</span>
            </button>
            
            <button 
              className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Hourglass className="w-5 h-5 text-green-500" />
              <span>我的考试</span>
            </button>
            
            <button 
              className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-orange-400" />
              <span>我的学习</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col mx-auto w-full overflow-y-auto">
          {/* Title Section */}
        <div className="bg-white px-8 py-6 flex items-center border-b border-slate-100">
          <button 
            onClick={() => onNavigate && onNavigate('personal')}
            className="mr-4 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center p-1.5 rounded-full hover:bg-slate-100"
            title="返回"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 mr-4">自然语言处理技术与应用17888340735441</h1>
          <span className="bg-[#e6f0ff] text-blue-500 text-xs px-3 py-1 rounded-md font-medium">进行中</span>
        </div>

        {/* Info Banner */}
        <div className="bg-white px-8 py-6 border-b border-slate-200 grid grid-cols-5 gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-2">所属课程</p>
            <p className="text-slate-700 text-sm">自然语言处理技术与应用</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">指导老师</p>
            <p className="text-slate-700 text-sm">杨振邦</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">下发时间</p>
            <p className="text-slate-700 text-sm">2026-9-8 10:32:04</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">任务类型</p>
            <p className="text-slate-700 text-sm">实训任务</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">任务时长</p>
            <p className="text-slate-700 text-sm">1000分钟</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 p-6 flex gap-6 max-w-[1600px] mx-auto w-full">
          {/* Left Column - Task List */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
            <div className="p-6 pb-4">
              <h2 className="text-lg font-bold text-slate-800">第一章：认识自然语言处理</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-2">
                {learningSteps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`flex items-center justify-between p-4 rounded-md transition-colors border border-transparent ${
                      step.isLastStudied 
                        ? 'bg-blue-50/50 border-blue-100' 
                        : (index % 2 === 1 ? 'bg-slate-50' : 'bg-white')
                    } hover:border-blue-200 group`}
                  >
                    <div className="flex items-center space-x-3">
                      {step.icon}
                      <span className={`text-sm ${step.status === '未开始' ? 'text-slate-500' : 'text-slate-800'}`}>
                        {step.title}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium border border-slate-200">
                        {step.tag}
                      </span>
                      {step.type === 'lab' && (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center ml-2">
                          <span className="text-[10px] text-blue-600 font-bold">jup</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {step.isLastStudied && (
                        <span className="text-xs text-slate-400 mr-2">最近学习: 2026-09-14 10:30</span>
                      )}
                      <span className={`text-xs ${
                        step.status === '已提交' ? 'text-green-500' : 
                        step.status === '进行中' ? 'text-blue-500' : 'text-slate-400'
                      }`}>
                        {step.status}
                      </span>
                      
                      {step.isLastStudied ? (
                        <button 
                          onClick={() => window.open('/?view=course-study', '_blank')}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-1.5 rounded transition-colors shadow-sm"
                        >
                          继续任务
                        </button>
                      ) : (
                        <button 
                          onClick={() => window.open('/?view=course-study', '_blank')}
                          className="opacity-0 group-hover:opacity-100 border border-blue-500 text-blue-500 hover:bg-blue-50 text-xs px-4 py-1.5 rounded transition-all"
                        >
                          开始
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Status and Tools */}
          <div className="w-[320px] flex flex-col gap-6">
            {/* Progress Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-800">已完成 9.00%</span>
                <span className="text-xs text-slate-400">任务耗时: 12/1000 分钟</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6 flex">
                <div className="h-full bg-gradient-to-r from-green-400 to-blue-400" style={{ width: '9%' }}></div>
              </div>

              <p className="text-xs text-slate-500">1-6 任务2 中文文本分词方法与工具使用 (理论)</p>
            </div>

            {/* Environment Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center">
                <div className="w-1 h-3.5 bg-slate-700 mr-2"></div>
                <h3 className="font-medium text-slate-700">实验环境</h3>
              </div>
              <div className="p-5">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 relative border border-blue-100">
                  <div className="absolute top-0 right-[-10px] bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded cursor-pointer hover:bg-slate-300">
                    重置
                  </div>
                  <span className="text-blue-500 font-bold text-sm">jupyter</span>
                </div>
                <p className="text-center text-xs text-slate-500">jupyter</p>
              </div>
            </div>

            {/* Resources Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex-1">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center">
                <div className="w-1 h-3.5 bg-slate-700 mr-2"></div>
                <h3 className="font-medium text-slate-700">资源下载</h3>
              </div>
              <div className="p-8 flex items-center justify-center text-slate-400 text-sm">
                暂无数据
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
