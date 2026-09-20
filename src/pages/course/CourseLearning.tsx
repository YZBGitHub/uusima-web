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

export interface CourseLearningProps {
  onNavigate?: (view: string) => void;
  embedded?: boolean;
  onBack?: () => void;
  taskTitle?: string;
  courseName?: string;
  isCompleted?: boolean;
  isTrialOnly?: boolean;
}

export default function CourseLearning({
  onNavigate,
  embedded = false,
  onBack,
  taskTitle = '自然语言处理技术与应用17888340735441',
  courseName = '自然语言处理技术与应用',
  isCompleted = false,
  isTrialOnly = false
}: CourseLearningProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const defaultNlpSteps = [
    { id: '1-1', title: '1-1 任务1 NLTK预处理方法（教材）', type: 'book', tag: '图文', status: '已提交', isLastStudied: false, isLocked: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: '1-2', title: '1-2 任务1 NLTK预处理方法（理论）', type: 'doc', tag: '图文', status: '已提交', isLastStudied: false, isLocked: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: '1-3', title: '1-3 任务1 NLTK预处理方法（实操）', type: 'lab', tag: '实验', status: '已提交', isLastStudied: false, isLocked: false, icon: <Wrench className="w-4 h-4 text-slate-400" /> },
    { id: '1-4', title: '1-4 任务1 NLTK预处理方法（视频）', type: 'video', tag: '视频', status: '已提交', isLastStudied: false, isLocked: false, icon: <MonitorPlay className="w-4 h-4 text-slate-400" /> },
    { id: '1-5', title: '1-5 任务2 中文文本分词方法与工具使用（教材）', type: 'book', tag: '图文', status: '进行中', isLastStudied: true, isLocked: false, icon: <FileText className="w-4 h-4 text-blue-500" /> },
    { id: '1-6', title: '1-6 任务2 中文文本分词方法与工具使用（理论）', type: 'doc', tag: '图文', status: '未开始', isLastStudied: false, isLocked: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: '1-7', title: '1-7 任务2 中文文本分词方法与工具使用（实操）', type: 'lab', tag: '实验', status: '未开始', isLastStudied: false, isLocked: false, icon: <Wrench className="w-4 h-4 text-slate-400" /> },
    { id: '1-8', title: '1-8 任务2 中文文本分词方法与工具使用（视频）', type: 'video', tag: '视频', status: '未开始', isLastStudied: false, isLocked: false, icon: <MonitorPlay className="w-4 h-4 text-slate-400" /> },
    { id: '1-9', title: '1-9 任务3 核心词汇识别与云图开发（报告）', type: 'report', tag: '报告', status: '未开始', isLastStudied: false, isLocked: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: '1-10', title: '1-10 任务3 核心词汇识别与云图开发（习题）', type: 'exercise', tag: '习题', status: '未开始', isLastStudied: false, isLocked: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
  ];

  const aiTrainerSteps = [
    { id: 't-1', title: '1.无人超市商品智慧结算业务流程设计（教材）', type: 'book', tag: '图文', status: '未开始', isLastStudied: true, isLocked: false, isTrial: true, icon: <FileText className="w-4 h-4 text-blue-500" /> },
    { id: 't-2', title: '2.无人超市商品智慧结算业务流程设计（PPT）', type: 'doc', tag: '课件', status: '未开始', isLastStudied: false, isLocked: false, isTrial: true, icon: <MonitorPlay className="w-4 h-4 text-slate-400" /> },
    { id: 't-3', title: '3.无人超市商品智慧结算业务流程设计（理论试题）', type: 'exercise', tag: '试题', status: '未开始', isLastStudied: false, isLocked: isTrialOnly, isTrial: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: 't-4', title: '4.无人超市自动识别业务模块效果优化（教材）', type: 'book', tag: '图文', status: '未开始', isLastStudied: false, isLocked: isTrialOnly, isTrial: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: 't-5', title: '5.无人超市自动识别业务模块效果优化（PPT）', type: 'doc', tag: '课件', status: '未开始', isLastStudied: false, isLocked: isTrialOnly, isTrial: false, icon: <MonitorPlay className="w-4 h-4 text-slate-400" /> },
    { id: 't-6', title: '6.无人超市自动识别业务模块效果优化（实操）', type: 'lab', tag: '实验', status: '未开始', isLastStudied: false, isLocked: isTrialOnly, isTrial: false, icon: <Wrench className="w-4 h-4 text-slate-400" /> },
    { id: 't-7', title: '7.无人超市自动识别业务模块效果优化（理论试题）', type: 'exercise', tag: '试题', status: '未开始', isLastStudied: false, isLocked: isTrialOnly, isTrial: false, icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { id: 't-8', title: '8.业务流程设计与模块优化总结（报告）', type: 'report', tag: '报告', status: '未开始', isLastStudied: false, isLocked: isTrialOnly, isTrial: false, icon: <FileText className="w-4 h-4 text-slate-400" /> }
  ];

  const learningSteps = courseName?.includes('人工智能训练师') ? aiTrainerSteps : defaultNlpSteps;

  // 渲染主体学习内容区域
  const renderLearningContent = () => (
    <div className="flex-1 flex flex-col mx-auto w-full h-full overflow-y-auto bg-[#f8fafc]">
      {/* Title Section */}
      <div className="bg-white px-8 py-5 flex items-center justify-between border-b border-slate-200/80 shrink-0">
        <div className="flex items-center">
          <button 
            type="button"
            onClick={() => onBack ? onBack() : onNavigate ? onNavigate('personal') : null}
            className="mr-4 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 border border-slate-200"
            title="返回上一级"
          >
            <ArrowLeft className="w-4 h-4 mr-1 text-slate-600" />
            <span className="text-xs font-medium text-slate-700">返回</span>
          </button>
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight" title={taskTitle}>
              {taskTitle}
            </h1>
            {isCompleted ? (
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                已完成
              </span>
            ) : (
              <span className="bg-[#e6f0ff] text-blue-600 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                进行中
              </span>
            )}
          </div>
        </div>

        {/* 顶部右侧快捷状态 */}
        <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-500">
          <span>所属课程：<strong className="text-slate-700 font-semibold">{courseName}</strong></span>
          <span className="text-slate-300">|</span>
          <span>学生：<strong className="text-slate-700 font-semibold">杨振邦</strong></span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-white px-8 py-4 border-b border-slate-200/70 grid grid-cols-2 sm:grid-cols-5 gap-4 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <p className="text-slate-400 text-xs mb-1">所属课程</p>
          <p className="text-slate-700 text-xs font-medium truncate" title={courseName}>{courseName}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">指导老师</p>
          <p className="text-slate-700 text-xs font-medium">杨振邦</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">下发时间</p>
          <p className="text-slate-700 text-xs font-medium">2026-09-08 10:32</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">任务类型</p>
          <p className="text-slate-700 text-xs font-medium">实训任务</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">任务时长</p>
          <p className="text-slate-700 text-xs font-medium">1000分钟</p>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-[1600px] w-full mx-auto">
        {/* Left Column - Task List */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">第一章：认识自然语言处理</h2>
            <span className="text-xs text-slate-400">共 10 个学习节点</span>
          </div>
          
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-2.5">
              {learningSteps.map((step, index) => {
                const stepStatus = isCompleted ? '已提交' : step.status;
                const isOngoing = !isCompleted && step.isLastStudied;

                return (
                  <div 
                    key={step.id} 
                    className={`flex items-center justify-between p-3.5 rounded-lg transition-all border ${
                      isOngoing 
                        ? 'bg-blue-50/60 border-blue-200 shadow-sm' 
                        : (index % 2 === 1 ? 'bg-slate-50/70 border-slate-100' : 'bg-white border-slate-100')
                    } hover:border-blue-200 group`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="shrink-0">{step.icon}</div>
                      <span className={`text-xs truncate ${stepStatus === '未开始' ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                        {step.title}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium border border-slate-200 shrink-0">
                        {step.tag}
                      </span>
                      {step.type === 'lab' && (
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-[9px] text-blue-600 font-bold">jup</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 shrink-0">
                      {isOngoing && (
                        <span className="text-[11px] text-slate-400 hidden sm:inline">最近学习: 2026-09-14 10:30</span>
                      )}
                      <span className={`text-xs font-medium ${
                        stepStatus === '已提交' ? 'text-emerald-600' : 
                        stepStatus === '进行中' ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {stepStatus}
                      </span>
                      
                      {step.isLocked ? (
                        <span className="text-[11px] text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-medium">
                          未购买锁定
                        </span>
                      ) : isCompleted ? (
                        <button 
                          type="button"
                          onClick={() => window.open('/?view=course-study', '_blank')}
                          className="border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 text-xs px-3 py-1 rounded transition-colors"
                        >
                          查看
                        </button>
                      ) : isOngoing ? (
                        <button 
                          type="button"
                          onClick={() => window.open('/?view=course-study', '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-1.2 rounded transition-colors shadow-sm font-medium"
                        >
                          继续任务
                        </button>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => window.open('/?view=course-study', '_blank')}
                          className="opacity-0 group-hover:opacity-100 border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs px-3 py-1 rounded transition-all"
                        >
                          开始
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Status and Tools */}
        <div className="w-full lg:w-[320px] flex flex-col gap-5 shrink-0">
          {/* Progress Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
            {isCompleted ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-800 text-sm">已完成 100.00%</span>
                  <span className="text-[11px] text-emerald-600 font-medium">任务已全部达成</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3 flex">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-[11px] text-slate-500">已用时长 380 分钟，总评分 95 分</p>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-800 text-sm">已完成 9.00%</span>
                  <span className="text-[11px] text-slate-400">任务耗时: 12/1000 分钟</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3 flex">
                  <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full" style={{ width: '9%' }}></div>
                </div>
                <p className="text-[11px] text-slate-500">上次进度：1-6 任务2 中文文本分词方法与工具使用 (理论)</p>
              </>
            )}
          </div>

          {/* Environment Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-1 h-3.5 bg-blue-600 rounded-full mr-2"></div>
                <h3 className="font-bold text-slate-700 text-xs">实验环境</h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-200">运行中</span>
            </div>
            <div className="p-5 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2 relative border border-blue-100 shadow-inner">
                <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Jupyter</span>
              </div>
              <p className="text-center text-xs text-slate-600 font-medium">JupyterLab 实验环境</p>
              <button 
                type="button"
                onClick={() => window.open('/?view=course-study', '_blank')}
                className="mt-3 w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded font-medium transition-colors"
              >
                {isCompleted ? '进入查看实验记录' : '启动实验环境'}
              </button>
            </div>
          </div>

          {/* Resources Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center">
              <div className="w-1 h-3.5 bg-slate-700 rounded-full mr-2"></div>
              <h3 className="font-bold text-slate-700 text-xs">实训资源包</h3>
            </div>
            <div className="p-5 flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-600 truncate mr-2">nltk_data_zh_corpus.zip</span>
                <span className="text-blue-600 font-medium cursor-pointer hover:underline shrink-0">下载</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-600 truncate mr-2">实验指导讲义_任务一.pdf</span>
                <span className="text-blue-600 font-medium cursor-pointer hover:underline shrink-0">下载</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 如果是作为内嵌组件在当前页面渲染，直接返回主体内容
  if (embedded) {
    return renderLearningContent();
  }

  // 独立全屏视图模式
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
        {renderLearningContent()}
      </div>
    </div>
  );
}
