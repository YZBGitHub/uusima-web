import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  LayoutGrid,
  Tag,
  BarChart2,
  GraduationCap,
  Wrench,
  Presentation,
  FileCheck2,
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Bot,
  Terminal,
  Cpu,
  Server,
  Layers,
  Network,
  GitBranch,
  PieChart,
  HelpCircle,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  Info,
  Lock,
  Check,
  X
} from 'lucide-react';
import AppHeader from '../../components/AppHeader';

export interface CourseDetailProps {
  onNavigate?: (view: string, extra?: any) => void;
  courseData?: any;
}

export default function CourseDetail({ onNavigate, courseData }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState<'介绍' | '目录' | '技能图谱'>('目录');
  const [activeTask, setActiveTask] = useState<string>('task1');
  const [graphViewMode, setGraphViewMode] = useState<'outline' | 'tree' | 'network' | 'circle'>('tree');
  
  // 课程购买与试学状态：支持外界传入，也支持在页面上快速切换演示 3 种情况
  // 1. 已购课程 ('purchased')
  // 2. 未购买课程，无试学 ('unpurchased_no_trial')
  // 3. 未购买课程，但存在试学 ('unpurchased_with_trial')
  const initialMode = courseData?.isPurchased === false
    ? 'unpurchased_with_trial'
    : (courseData?.isPurchased === true ? 'purchased' : 'purchased');
    
  const [courseMode, setCourseMode] = useState<'purchased' | 'unpurchased_no_trial' | 'unpurchased_with_trial'>(initialMode);

  // 判定条件
  const isPurchased = courseMode === 'purchased';
  const hasTrial = courseMode === 'unpurchased_with_trial' || courseMode === 'purchased';

  // 加入自学弹窗状态
  const [showSelfStudyModal, setShowSelfStudyModal] = useState(false);
  const [taskNameInput, setTaskNameInput] = useState('');
  const [taskNameError, setTaskNameError] = useState('');

  // AI 助教弹窗状态
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: '你好！我是本课程的专属 AI 学伴助教。针对《人工智能训练师（高级工）》的业务流程、无人超市视觉识别或考核要点，欢迎随时向我提问！'
    }
  ]);

  // 课程基本信息
  const course = {
    title: courseData?.title || 'AI学伴-人工智能训练师（高级工）软件版',
    subTitle: courseData?.desc || '人工智能训练师（高级工）',
    hours: '32 小时',
    type: '岗位认证课',
    tags: ['人工智能-训练师系列', 'AI学伴系列'],
    difficulty: '容易',
    major: '机器学习',
    progress: 0,
    learnedCount: 0,
    totalCount: 8
  };

  // 课程目录列表数据（带是否支持试学标记）
  const courseTasks = [
    {
      id: 'task1',
      title: 'Task1 业务流程设计与业务模块效果优化',
      lessons: [
        {
          id: '1',
          name: '1.无人超市商品智慧结算业务流程设计（教材）',
          type: '教材',
          iconType: 'wrench',
          hasMicroCourse: true,
          isTrial: true // 试学章节
        },
        {
          id: '2',
          name: '2.无人超市商品智慧结算业务流程设计（PPT）',
          type: 'PPT',
          iconType: 'ppt',
          hasMicroCourse: false,
          isTrial: true // 试学章节
        },
        {
          id: '3',
          name: '3.无人超市商品智慧结算业务流程设计（理论试题）',
          type: '理论试题',
          iconType: 'exam',
          hasMicroCourse: false,
          isTrial: false
        },
        {
          id: '4',
          name: '4.无人超市自动识别业务模块效果优化（教材）',
          type: '教材',
          iconType: 'wrench',
          hasMicroCourse: true,
          isTrial: false
        },
        {
          id: '5',
          name: '5.无人超市自动识别业务模块效果优化（PPT）',
          type: 'PPT',
          iconType: 'ppt',
          hasMicroCourse: false,
          isTrial: false
        },
        {
          id: '6',
          name: '6.无人超市自动识别业务模块效果优化（实操）',
          type: '实操',
          iconType: 'lab',
          hasMicroCourse: true,
          isTrial: false
        },
        {
          id: '7',
          name: '7.无人超市自动识别业务模块效果优化（理论试题）',
          type: '理论试题',
          iconType: 'exam',
          hasMicroCourse: false,
          isTrial: false
        },
        {
          id: '8',
          name: '8.业务流程设计与模块优化总结（报告）',
          type: '报告',
          iconType: 'report',
          hasMicroCourse: false,
          isTrial: false
        }
      ]
    }
  ];

  // 技能图谱数据结构
  const skillNodes = [
    {
      title: '业务流程设计',
      desc: '掌握智能零售与业务全周期流程分析',
      skills: ['业务需求拆解', '流程图规范绘制', '无人结算业务流', '人机协同边界界定']
    },
    {
      title: '数据采集与预处理',
      desc: '商品多视角图像标注与清洗强化',
      skills: ['商品视觉数据采集', 'Labelme精准标注', '数据增强策略', '脏数据清洗过滤']
    },
    {
      title: '模型微调与训练优化',
      desc: '基于主流视觉骨干网络调优训练',
      skills: ['YOLOv8模型微调', '超参数调试', '混淆矩阵分析', 'mAP多指标评测']
    },
    {
      title: '业务系统部署与评估',
      desc: '智能终端推理适配与落地验证',
      skills: ['ONNX模型导出', '边缘盒子运行适配', '端到端性能压测', '准确率持续回流']
    }
  ];

  // 打开加入自学弹窗
  const handleOpenSelfStudyModal = () => {
    setTaskNameInput(`${course.title} - 自学任务`);
    setTaskNameError('');
    setShowSelfStudyModal(true);
  };

  // 确认加入自学并跳转至任务学习概览界面
  const handleConfirmSelfStudy = () => {
    if (!taskNameInput.trim()) {
      setTaskNameError('请输入自学任务名称');
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: taskNameInput.trim(),
      courseName: course.title,
      createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      isTrialOnly: !isPurchased && hasTrial,
      status: '进行中',
      lessonsCount: (!isPurchased && hasTrial) ? 2 : 8
    };

    // 保存到本地存储
    try {
      const stored = localStorage.getItem('uusima_self_study_tasks');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newTask);
      localStorage.setItem('uusima_self_study_tasks', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    setShowSelfStudyModal(false);

    // 跳转至任务学习概览界面 (CourseLearning)，传入新任务详情
    if (onNavigate) {
      onNavigate('course-learning', {
        taskId: newTask.id,
        taskTitle: newTask.title,
        courseName: newTask.courseName,
        isTrialOnly: newTask.isTrialOnly
      });
    }
  };

  const handleSendAiMessage = () => {
    if (!aiQuestion.trim()) return;
    const userQ = aiQuestion.trim();
    setAiMessages(prev => [...prev, { role: 'user', text: userQ }]);
    setAiQuestion('');
    setTimeout(() => {
      setAiMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: `针对问题「${userQ}」：在人工智能训练师无人超市场景中，关键在于将业务结算环节抽象为多目标检测与行为识别管道。建议您先复习第1节《教材》的流程规范，并在实操实验环节使用预装的优化脚本验证。`
        }
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans">
      {/* 顶部统一平台导航栏 */}
      <AppHeader activeTab="course-hall" onNavigate={onNavigate} />

      {/* 顶部课程信息横幅 (Hero Banner) */}
      <section className="relative bg-gradient-to-r from-[#deebfc] via-[#eaf2fd] to-[#f4f7fe] pt-6 pb-14 px-6 border-b border-blue-100/60 overflow-hidden">
        {/* 背景微光圈与装饰 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* 左侧文字与属性信息 */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {course.title}
              </h1>
            </div>

            <p className="text-sm text-slate-600 mb-5 font-normal">
              {course.subTitle}
            </p>

            {/* 课程元属性行（精准还原截图中的图标、斜线分隔与标签徽章） */}
            <div className="flex flex-wrap items-center gap-y-2 text-xs text-slate-600">
              {/* 课时 */}
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>课时：<strong className="text-slate-800 font-semibold">{course.hours}</strong></span>
              </div>
              <span className="text-slate-300 mx-2.5">/</span>

              {/* 课程类型 */}
              <div className="flex items-center space-x-1">
                <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                <span>课程类型：<strong className="text-slate-800 font-semibold">{course.type}</strong></span>
              </div>
              <span className="text-slate-300 mx-2.5">/</span>

              {/* 课程标签 */}
              <div className="flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-500" />
                <span>课程标签：</span>
                <span className="bg-[#67c23a] text-white px-2 py-0.5 rounded text-[11px] font-medium leading-normal tracking-wide shadow-xs">
                  {course.tags[0]}
                </span>
                <span className="bg-[#409eff] text-white px-2 py-0.5 rounded text-[11px] font-medium leading-normal tracking-wide shadow-xs">
                  {course.tags[1]}
                </span>
              </div>
              <span className="text-slate-300 mx-2.5">/</span>

              {/* 难度 */}
              <div className="flex items-center space-x-1">
                <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
                <span>难度：<strong className="text-slate-800 font-semibold">{course.difficulty}</strong></span>
              </div>
              <span className="text-slate-300 mx-2.5">/</span>

              {/* 专业 */}
              <div className="flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                <span>专业：<strong className="text-slate-800 font-semibold">{course.major}</strong></span>
              </div>
            </div>

            {/* 课程状态切换器（供演示验证 3 种情况） */}
            <div className="mt-4 inline-flex items-center bg-white/70 backdrop-blur-xs border border-blue-200/80 rounded-lg p-1 space-x-1">
              <span className="text-[11px] text-slate-500 px-2 font-medium">演示状态切换:</span>
              <button
                type="button"
                onClick={() => setCourseMode('purchased')}
                className={`text-[11px] px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                  courseMode === 'purchased'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-white/80'
                }`}
              >
                1. 已购课程
              </button>
              <button
                type="button"
                onClick={() => setCourseMode('unpurchased_no_trial')}
                className={`text-[11px] px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                  courseMode === 'unpurchased_no_trial'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-white/80'
                }`}
              >
                2. 未购无试学
              </button>
              <button
                type="button"
                onClick={() => setCourseMode('unpurchased_with_trial')}
                className={`text-[11px] px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                  courseMode === 'unpurchased_with_trial'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-white/80'
                }`}
              >
                3. 未购有试学
              </button>
            </div>
          </div>

          {/* 右侧区域：顶部返回按钮 + 课程大封面 */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            {/* 返回按钮 */}
            <button
              onClick={() => onNavigate?.('course-hall')}
              className="px-3.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 bg-white/80 hover:bg-white border border-slate-300/70 rounded-md shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回</span>
            </button>

            {/* 封面卡片 (新大陆时代科技 高保真立体设计) */}
            <div className="w-[340px] h-[142px] rounded-xl overflow-hidden shadow-md relative bg-gradient-to-r from-[#2181f8] via-[#2f8efd] to-[#459bfe] p-4 flex items-center justify-between select-none border border-blue-400/30">
              {/* 背景科技网格底纹 */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-15 pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />

              {/* 左侧品牌文字 */}
              <div className="relative z-10 text-white max-w-[170px]">
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className="w-3.5 h-3.5 bg-white rounded-xs transform rotate-45 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-xs" />
                  </div>
                  <span className="text-base font-bold tracking-tight">新大陆时代科技</span>
                </div>
                <div className="text-[11px] font-medium tracking-wider text-blue-100 opacity-90 pl-5">
                  NEWLAND ERA HI-TECH
                </div>
              </div>

              {/* 右侧 3D 立体文件盒插图 */}
              <div className="relative z-10 w-28 h-28 flex items-center justify-center">
                <div className="relative w-24 h-22 bg-white/25 backdrop-blur-md rounded-lg border-2 border-white/60 shadow-lg transform -rotate-6 flex items-center justify-center">
                  {/* 立体文件夹多层 */}
                  <div className="absolute -top-3 left-3 w-16 h-10 bg-blue-300/80 rounded-t-md transform rotate-3 border border-white/50" />
                  <div className="absolute -top-1 left-2 w-18 h-12 bg-white/90 rounded-md shadow-sm transform -rotate-2 flex items-center justify-center p-1.5">
                    <div className="w-full h-full bg-blue-50/80 rounded border border-blue-200 flex flex-col justify-center space-y-1 px-1">
                      <div className="w-3/4 h-1 bg-blue-400 rounded-full" />
                      <div className="w-1/2 h-1 bg-blue-300 rounded-full" />
                    </div>
                  </div>
                  {/* 外盒栅格 */}
                  <div className="w-16 h-8 border-2 border-white/80 rounded bg-white/10 flex items-center justify-around px-1 z-10">
                    <div className="w-1.5 h-5 bg-white/80 rounded-xs" />
                    <div className="w-1.5 h-5 bg-white/80 rounded-xs" />
                    <div className="w-1.5 h-5 bg-white/80 rounded-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 悬浮学习进度卡片 (Floating Progress Strip) */}
      <div className="max-w-7xl mx-auto px-6 w-full -mt-7 relative z-20">
        <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-slate-150/80 px-8 py-3.5 flex items-center justify-between">
          {/* 左侧：圆环进度与文字 */}
          <div className="flex items-center space-x-6">
            {/* 0% 圆环 */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#edf2f7"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#1e80ff"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * course.progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[11px] font-semibold text-slate-400">
                {course.progress}%
              </span>
            </div>

            {/* 学习概况文字 */}
            <div className="text-xs text-slate-600 font-medium">
              <span>已学 <strong className="text-slate-800">{course.learnedCount}</strong> 节</span>
              <span className="text-slate-300 mx-3">|</span>
              <span>学完 <strong className="text-slate-800">{course.progress}%</strong></span>
            </div>
          </div>

          {/* 右侧：3种状态对应三种情况的按钮显示 */}
          <div className="flex items-center space-x-5">
            {/* 展开书本装饰图 */}
            <div className="hidden sm:flex items-center relative">
              <div className="w-10 h-7 bg-gradient-to-r from-blue-400 to-sky-300 rounded-sm transform -rotate-12 shadow-sm opacity-90" />
              <div className="w-10 h-7 bg-gradient-to-r from-sky-300 to-blue-500 rounded-sm transform rotate-12 shadow-sm -ml-4 opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow">
                ✦
              </div>
            </div>

            {/* 
              按钮状态对应规则：
              1. 已购课程 (isPurchased)：显示「加入自学」
              2. 未购买课程且无试学 (!isPurchased && !hasTrial)：不显示按钮
              3. 未购买课程但存在试学 (!isPurchased && hasTrial)：显示「加入自学」
            */}
            {isPurchased ? (
              // 状态 1：已购课程 -> 显示「加入自学」
              <button
                type="button"
                onClick={handleOpenSelfStudyModal}
                className="bg-[#1e80ff] hover:bg-blue-600 text-white text-xs font-semibold px-6 py-2 rounded-full shadow-sm shadow-blue-500/30 hover:shadow-md hover:shadow-blue-500/40 transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>加入自学</span>
              </button>
            ) : hasTrial ? (
              // 状态 3：未购买课程，但存在试学章节 -> 显示「加入自学」
              <button
                type="button"
                onClick={handleOpenSelfStudyModal}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold px-6 py-2 rounded-full shadow-sm shadow-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/40 transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>加入自学</span>
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-normal">
                  含试学
                </span>
              </button>
            ) : (
              // 状态 2：未购买课程且无试学 -> 不显示按钮
              <span className="text-xs text-slate-400 font-medium px-2 py-1">
                未购买课程暂不支持自学
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 主体双栏区域 */}
      <main className="max-w-7xl mx-auto px-6 py-6 w-full flex flex-col lg:flex-row gap-6 items-start flex-1">
        {/* 左侧核心内容大卡片 */}
        <div className="flex-1 bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden w-full">
          {/* 三大 Tabs 导航 (介绍、目录、技能图谱) */}
          <div className="flex items-center px-6 border-b border-slate-100 bg-white">
            {(['介绍', '目录', '技能图谱'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium transition-all relative cursor-pointer ${
                  activeTab === tab
                    ? 'text-[#1e80ff] font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-[#1e80ff] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: 目录 (截图重点复刻部分，已去除“开始学习”按钮) */}
          {activeTab === '目录' && (
            <div className="p-6">
              {/* 课程阶段主标题 */}
              <div className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>{course.subTitle}</span>
                <span className="text-xs font-normal text-slate-400">共 1 个任务，8 个学习单元</span>
              </div>

              {/* Task 任务切换栏 (当前选中 Task1 带有高亮蓝横条) */}
              <div className="mb-6">
                <div className="inline-flex items-center border-b-2 border-[#1e80ff] pb-2 cursor-pointer">
                  <span className="text-xs font-bold text-[#1e80ff] tracking-wide">
                    Task1
                  </span>
                  <span className="text-xs font-bold text-[#1e80ff] ml-2">
                    业务流程设计与业务模块效果优化
                  </span>
                </div>
              </div>

              {/* 课时节点列表 (已去除开始学习按钮，增加虚线与微课/试学标识) */}
              <div className="space-y-4 pl-4 pr-2">
                {courseTasks[0].lessons.map(lesson => {
                  const isLessonLocked = !isPurchased && !lesson.isTrial;

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between group hover:bg-slate-50/70 p-2.5 rounded-lg transition-colors"
                    >
                      {/* 左侧：图标 + 标题 + 试学徽章 */}
                      <div className="flex items-center space-x-3 max-w-[70%] shrink-0">
                        {/* 图标渲染 */}
                        <div className={isLessonLocked ? 'text-slate-400' : 'text-[#1e80ff]'}>
                          {lesson.iconType === 'wrench' && <Wrench className="w-4 h-4 transform rotate-12" />}
                          {lesson.iconType === 'ppt' && <Presentation className="w-4 h-4" />}
                          {lesson.iconType === 'exam' && <FileCheck2 className="w-4 h-4" />}
                          {lesson.iconType === 'lab' && <Terminal className="w-4 h-4" />}
                          {lesson.iconType === 'report' && <FileText className="w-4 h-4" />}
                        </div>

                        <span className={`text-xs truncate font-normal transition-colors ${
                          isLessonLocked ? 'text-slate-400' : 'text-slate-700 group-hover:text-blue-600'
                        }`}>
                          {lesson.name}
                        </span>

                        {/* 试学标记 */}
                        {lesson.isTrial && (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] px-1.5 py-0.2 rounded font-medium shrink-0">
                            试学
                          </span>
                        )}
                      </div>

                      {/* 中间点阵虚线延伸带 */}
                      <div className="flex-1 mx-4 border-b border-dashed border-slate-200/90 group-hover:border-blue-200 transition-colors" />

                      {/* 右侧微课/流程标志或锁定标志（已去除开始学习按钮） */}
                      <div className="flex items-center space-x-3 shrink-0">
                        {lesson.hasMicroCourse && (
                          <div
                            className="w-5 h-5 flex items-center justify-center text-blue-500/80 group-hover:text-blue-600"
                            title="配套微课与流程图"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" />
                              <circle cx="6" cy="18" r="2" fill="currentColor" />
                            </svg>
                          </div>
                        )}

                        {isLessonLocked ? (
                          <span className="flex items-center space-x-1 text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            <Lock className="w-3 h-3" />
                            <span>需购买</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            可自学
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: 介绍 */}
          {activeTab === '介绍' && (
            <div className="p-8 space-y-6 text-slate-700 leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center">
                  <span className="w-1.5 h-4 bg-[#1e80ff] rounded mr-2" />
                  课程概述
                </h3>
                <p className="text-sm text-slate-600 leading-7">
                  《AI学伴-人工智能训练师（高级工）软件版》紧密贴合国家职业技能标准，围绕“无人超市”智慧零售核心业务场景，全面解析商品智慧结算、自动识别系统设计与模型调优工作流。课程配套完整的软硬件仿真环境与实训算力，通过理实一体化的实训设计，培养学员业务抽象、数据清洗标注、模型微调调优及工程化落地能力。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center text-blue-600">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> 培养目标
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>掌握无人超市商品结算核心业务流程</li>
                    <li>熟练使用主流计算机视觉模型进行目标检测与优化</li>
                    <li>具备解决复杂工程问题与模型评估指标诊断能力</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center text-indigo-600">
                    <Sparkles className="w-4 h-4 mr-1.5" /> 课程特色
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>全流程 AI 学伴辅助答疑与智能评估</li>
                    <li>开箱即用的高性能容器云实验环境</li>
                    <li>直通人工智能训练师（高级工）职业认证考核</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: 技能图谱 */}
          {activeTab === '技能图谱' && (
            <div className="p-6">
              {/* 顶部视图模式切换 */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800 mr-2">图谱视图：</span>
                  {[
                    { id: 'tree', label: '树状图谱', icon: GitBranch },
                    { id: 'network', label: '知识网图', icon: Network },
                    { id: 'outline', label: '大纲清单', icon: Layers },
                    { id: 'circle', label: '环形占比', icon: PieChart }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setGraphViewMode(mode.id as any)}
                      className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md transition-all cursor-pointer ${
                        graphViewMode === mode.id
                          ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <mode.icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400">
                  共涵盖 4 个能力维度，16 项关键技能点
                </div>
              </div>

              {/* 技能图谱展示面板 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillNodes.map((node, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/50 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                        {node.title}
                      </h4>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                        能力模块 0{idx + 1}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">{node.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {node.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-white text-slate-600 border border-slate-200 text-[11px] px-2 py-0.5 rounded-md hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧栏：AI工具、课程开发人员、实验环境 */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
          {/* 卡片 1: AI 工具 */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5">
            <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-1 h-3.5 bg-[#1e80ff] rounded-xs mr-2" />
              AI工具
            </h3>
            <div
              onClick={() => setShowAiModal(true)}
              className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-50/80 hover:bg-purple-50/50 border border-slate-100 hover:border-purple-200 transition-all cursor-pointer group"
            >
              {/* 紫色高质感圆形渐变 AI 徽章 */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-400 flex items-center justify-center text-white font-black text-base shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                AI
              </div>
              <span className="text-xs font-medium text-slate-700 mt-2.5 group-hover:text-purple-600 transition-colors">
                AI工具
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">点击启动智能助学工作台</span>
            </div>
          </div>

          {/* 卡片 2: 课程开发人员 */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5">
            <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-1 h-3.5 bg-[#1e80ff] rounded-xs mr-2" />
              课程开发人员
            </h3>
            <div className="flex items-center space-x-3.5 p-2 rounded-lg bg-slate-50/50 border border-slate-100">
              {/* 讲师免冠眼镜头像 */}
              <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-slate-200 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160&h=160"
                  alt="刘国升 讲师"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800">刘国升</span>
                  <span className="text-[10px] text-[#409eff] bg-[#409eff]/15 px-1.5 py-0.2 rounded font-medium">
                    讲师
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">课程开发者</p>
              </div>
            </div>
          </div>

          {/* 卡片 3: 实验环境 */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5">
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-1 h-3.5 bg-[#1e80ff] rounded-xs mr-2" />
                <span>实验环境</span>
              </div>
              <span className="flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                就绪
              </span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">操作系统</span>
                <span className="font-semibold text-slate-800">Ubuntu 22.04 LTS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">核心算力</span>
                <span className="font-semibold text-slate-800">CPU 8核 / 32GB</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">预装框架</span>
                <span className="font-semibold text-slate-800">PyTorch 2.1 / OpenCV</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* 弹窗 1: 加入自学任务弹窗 (填任务名称，含试学提示，确定后自动跳转任务学习概览界面) */}
      {showSelfStudyModal && (
        <div className="fixed inset-0 z-[150] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">加入自学任务</h3>
                  <p className="text-[11px] text-blue-100">将本课程学习计划添加至您的个人自学任务库</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSelfStudyModal(false)}
                className="text-white/80 hover:text-white text-sm p-1 rounded hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 弹窗表单主体 */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* 课程名称信息 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  所属课程
                </label>
                <div className="text-xs text-slate-800 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>{course.title}</span>
                  <span className="text-[11px] text-slate-400">总课时：{course.hours}</span>
                </div>
              </div>

              {/* 任务名称输入框 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  自学任务名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taskNameInput}
                  onChange={(e) => {
                    setTaskNameInput(e.target.value);
                    if (taskNameError) setTaskNameError('');
                  }}
                  placeholder="请输入自学任务名称，如：AI训练师无人超市自学"
                  className={`w-full text-xs px-3 py-2.5 rounded-lg border transition-all outline-hidden ${
                    taskNameError
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {taskNameError && (
                  <p className="text-[11px] text-red-500 mt-1">{taskNameError}</p>
                )}
              </div>

              {/* 对应情况3的说明提示或情况1的提示 */}
              {!isPurchased && hasTrial ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-800">试学提示说明：</p>
                    <p className="text-[11px] leading-relaxed text-amber-700">
                      该课程当前尚未购买，仅包含<strong>【试学】</strong>标记的章节（共 2 节：教材与PPT）会加入您的自学任务中。其余 6 个实操与试题学习单元需在购买课程后解锁。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-blue-800">已购课程提示：</p>
                    <p className="text-[11px] leading-relaxed text-blue-700">
                      该课程已成功购买，确定后将生成完整的自学任务，涵盖全部 8 个学习小节与实训环境，学习进度将自动记录。
                    </p>
                  </div>
                </div>
              )}

              {/* 将加入的章节预览 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>预计加入章节清单</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {!isPurchased && hasTrial ? '仅加入 2 节试学内容' : '共 8 节全部加入'}
                  </span>
                </label>
                <div className="border border-slate-200 rounded-lg p-2 max-h-36 overflow-y-auto space-y-1.5 bg-slate-50/50">
                  {courseTasks[0].lessons.map(item => {
                    const isIncluded = isPurchased || item.isTrial;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between px-2 py-1 rounded text-[11px] ${
                          isIncluded
                            ? 'bg-white text-slate-700 border border-slate-150'
                            : 'text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {isIncluded ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{item.name}</span>
                        </div>
                        <span className="shrink-0 text-[10px] ml-2">
                          {item.isTrial ? (
                            <span className="text-emerald-600 font-medium bg-emerald-50 px-1 py-0.2 rounded">
                              试学
                            </span>
                          ) : isIncluded ? (
                            <span className="text-blue-600 font-medium">完整</span>
                          ) : (
                            <span className="text-slate-400">未购不加入</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 弹窗底部操作按钮 */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowSelfStudyModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmSelfStudy}
                className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <span>确定加入并前往任务概览</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗 2: AI 工具智能问答对话弹窗 */}
      {showAiModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* 弹窗头部 */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">AI 智能学伴助手</h4>
                  <p className="text-[10px] text-purple-200">支持技能答疑、业务排错与实训引导</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-white/80 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 对话消息区 */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50 min-h-[260px] max-h-[360px]">
              {aiMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* 输入区 */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                placeholder="输入关于人工智能训练师或业务流程的疑问..."
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSendAiMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg font-medium shadow-xs transition-colors cursor-pointer"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
