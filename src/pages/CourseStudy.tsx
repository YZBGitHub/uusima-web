import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  AlignLeft,
  BookMarked,
  Film,
  Search,
  ChevronDown,
  ChevronUp,
  Maximize,
  Home,
  ShieldCheck,
  Edit2,
  Type,
  PenTool,
  Image as ImageIcon,
  ChevronsRight,
  Maximize2,
  Columns2,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  CheckCircle2,
  Save,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  Subscript,
  Superscript,
  List,
  ListOrdered,
  ListTodo,
  Code,
  Eye,
  FileDown,
  RotateCcw,
  Sparkles,
  Folder,
  FileCode,
  Power,
  RefreshCw,
  FolderPlus,
  Upload,
  Minimize2
} from 'lucide-react';

// 四叶彩色气泡章节徽标（高精度还原截图）
const ChapterBubbleIcon = () => (
  <div className="w-5 h-5 mr-3 shrink-0 grid grid-cols-2 gap-1 p-0.5">
    <div className="w-2 h-2 rounded-full bg-[#9bb5ff] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"></div>
    <div className="w-2 h-2 rounded-full bg-[#2f80ed] shadow-[0_1px_2px_rgba(0,0,0,0.12)]"></div>
    <div className="w-2 h-2 rounded-full bg-[#bfdbfe] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"></div>
    <div className="w-2 h-2 rounded-full bg-[#1864cc] shadow-[0_1px_2px_rgba(0,0,0,0.12)]"></div>
  </div>
);

// 拖拽手柄组件（放在窗口右边缘，按住可横向拖动改变窗口大小）
const ResizeHandle = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) => (
  <div 
    onMouseDown={onMouseDown}
    className="absolute -right-1 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-500/25 active:bg-blue-600/35 transition-colors z-50 flex items-center justify-center group select-none"
    title="按住鼠标左键横向拖拽调整窗口大小"
  >
    <div className="w-[3px] h-9 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors shadow-xs"></div>
  </div>
);

// 目录章节与步骤数据接口
interface DirectoryStepItem {
  id: string;
  title: string;
  type: 'text' | 'video' | 'lab' | 'exercise' | 'report';
  tag: '图文' | '视频' | '实验' | '习题' | '报告';
  status: '已提交' | '进行中' | '未开始';
}

interface DirectoryChapter {
  id: string;
  chapterTitle: string;
  steps: DirectoryStepItem[];
}

// 实验工具入口接口
interface LabToolItem {
  id: string;
  name: string;
  typeBadge: '平台型' | '容器型';
  badgeColor: string;
  desc: string;
  iconType: 'simulation' | 'jupyter';
}

// 实验工具卡片组件（100%还原用户截图）
const LabToolCard: React.FC<{ tool: LabToolItem; onEnter: (tool: LabToolItem) => void }> = ({ tool, onEnter }) => (
  <div className="w-[380px] bg-white rounded-xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-200 p-6 flex flex-col justify-between relative group">
    {/* 顶部：左侧图标 + 右侧类型徽标 */}
    <div className="flex items-start justify-between mb-4">
      {tool.iconType === 'simulation' ? (
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1890ff] to-[#36cfc9] flex items-center justify-center shadow-md shadow-blue-200/60">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white stroke-current fill-none stroke-[1.6]" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <circle cx="12" cy="4" r="1.5" fill="currentColor" />
            <circle cx="12" cy="20" r="1.5" fill="currentColor" />
            <circle cx="5" cy="8" r="1.5" fill="currentColor" />
            <circle cx="19" cy="8" r="1.5" fill="currentColor" />
            <circle cx="5" cy="16" r="1.5" fill="currentColor" />
            <circle cx="19" cy="16" r="1.5" fill="currentColor" />
            <line x1="12" y1="4" x2="12" y2="9.5" />
            <line x1="12" y1="14.5" x2="12" y2="20" />
            <line x1="5" y1="8" x2="10" y2="10.5" />
            <line x1="19" y1="8" x2="14" y2="10.5" />
            <line x1="5" y1="16" x2="10" y2="13.5" />
            <line x1="19" y1="16" x2="14" y2="13.5" />
            <polygon points="12,4 19,8 19,16 12,20 5,16 5,8" opacity="0.3" />
          </svg>
        </div>
      ) : (
        <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-[#e6f4ff] to-[#f4faff] border border-[#bae0ff]/60 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#1890ff] absolute top-1.5 right-3"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1890ff] absolute top-3 left-2.5"></div>
          <div className="w-9 h-3.5 border-t-[2.5px] border-b-[2.5px] border-[#1890ff] rounded-[50%] flex items-center justify-center my-0.5">
            <span className="text-[9px] font-extrabold text-[#1890ff] tracking-tighter">jupyter</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1890ff] absolute bottom-2 left-4"></div>
          <div className="w-full h-1 bg-gradient-to-r from-[#1890ff] via-[#fa8c16] to-[#fa541c] absolute bottom-0 left-0"></div>
        </div>
      )}

      {/* 右上角标签：平台型 / 容器型 */}
      <span 
        className={`px-3 py-1 rounded text-xs font-semibold text-white tracking-wide shadow-2xs ${
          tool.typeBadge === '平台型' ? 'bg-[#2b59c3]' : 'bg-[#9c27b0]'
        }`}
      >
        {tool.typeBadge}
      </span>
    </div>

    {/* 标题与简介 */}
    <div className="mb-6">
      <h3 className="text-base font-bold text-slate-800 mb-1">{tool.name}</h3>
      <p className="text-xs text-slate-400">{tool.desc || '暂无简介'}</p>
    </div>

    {/* 右下角操作链接 */}
    <div className="flex justify-end">
      <button 
        onClick={() => onEnter(tool)}
        className="text-xs text-[#2f80ed] hover:text-blue-700 font-medium transition-colors cursor-pointer group-hover:underline"
      >
        进入实验环境
      </button>
    </div>
  </div>
);

// 资源数据接口
interface ResourceTaskItem {
  id: string;
  name: string;
  fullTitle: string;
  type: 'text' | 'video' | 'manual' | 'file';
  duration?: string;
  fileSize?: string;
  desc?: string;
}

interface ChapterData {
  id: string;
  chapterTitle: string;
  items: ResourceTaskItem[];
}

export default function CourseStudy({ onNavigate }: { onNavigate?: (view: string) => void }) {
  // 左侧导航激活状态：'directory' | 'notes' | 'resources' | null
  const [activeSidebar, setActiveSidebar] = useState<'directory' | 'notes' | 'resources' | null>('directory');
  
  // 浮动窗口宽度控制（支持横向拖拽改变大小，默认 420px，最小 300px，最大 960px）
  const [drawerWidth, setDrawerWidth] = useState<number>(420);
  
  // 资源面板内 4 个 Tab：'text'(图文) | 'video'(视频) | 'manual'(手册) | 'file'(文件)
  const [activeResourceTab, setActiveResourceTab] = useState<'text' | 'video' | 'manual' | 'file'>('text');
  
  // 目录折叠状态控制：各个章节独立折叠/展开
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'dir-chap-1': true,
    'dir-chap-2': true,
    'dir-chap-3': false,
    'dir-chap-4': false,
  });

  // 目录中当前选中的步骤（默认为 1-2 理论图文教材，点击 1-4 等视频条目可无缝切换到视频播放器）
  const [currentStepId, setCurrentStepId] = useState<string>('1-2');

  // Toast 提示状态
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<any>(null);

  // 视频播放器状态
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const totalDurationSec = 4147; // 1小时09分07秒 = 4147秒
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState<boolean>(false);

  // 笔记内容与字数统计
  const [noteContent, setNoteContent] = useState('');
  const [isNotePreview, setIsNotePreview] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  // 资源预览弹窗
  const [previewItem, setPreviewItem] = useState<ResourceTaskItem | null>(null);

  // 课件查看器页码控制
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 68;

  // 实验环境运行阶段：'idle'（卡片列表）| 'launching'（启动中，参考截图1）| 'running'（实验运行中，参考截图2/截图3）
  const [labPhase, setLabPhase] = useState<'idle' | 'launching' | 'running'>('idle');
  const [activeLabTool, setActiveLabTool] = useState<LabToolItem | null>(null);
  const [launchCountdown, setLaunchCountdown] = useState<number>(3);
  const [isLabFullscreen, setIsLabFullscreen] = useState<boolean>(false);
  const [terminalCmd, setTerminalCmd] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ cmd: string; res?: string }>>([]);
  // 虚拟仿真专属交互状态
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [expandedSimCategory, setExpandedSimCategory] = useState<string>('智慧安防');
  const [simSearchText, setSimSearchText] = useState<string>('');

  // 启动倒计时逻辑（从 3s 倒计时至 0s，随后自动切换为运行中的实验环境，契合截图1到截图2）
  useEffect(() => {
    let timer: any = null;
    if (labPhase === 'launching') {
      timer = setInterval(() => {
        setLaunchCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setLabPhase('running');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [labPhase]);

  // 当切换课程步骤时，重置实验运行状态
  useEffect(() => {
    setLabPhase('idle');
    setActiveLabTool(null);
  }, [currentStepId]);

  // 视频播放计时器逻辑
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  // 时间格式化辅助函数 (秒 -> 0:00 或 1:09:07)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toast 弹窗触发器
  const triggerSwitchToast = (chapterTitle: string, stepTitle?: string) => {
    setToastMessage(`你已经切换 ${chapterTitle}${stepTitle ? ` - ${stepTitle}` : ''}`);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 实验步骤工具列表获取函数（展示多个实验环境，包含虚拟仿真平台型与Jupyter容器型等）
  const getLabToolsForStep = (_stepId: string): LabToolItem[] => {
    return [
      {
        id: 'sim-1',
        name: '虚拟仿真',
        typeBadge: '平台型',
        badgeColor: 'bg-[#2b59c3]',
        desc: '暂无简介',
        iconType: 'simulation'
      },
      {
        id: 'jup-1',
        name: 'Jupyter',
        typeBadge: '容器型',
        badgeColor: 'bg-[#9c27b0]',
        desc: '暂无简介',
        iconType: 'jupyter'
      }
    ];
  };

  const handleEnterLabEnvironment = (tool: LabToolItem) => {
    setActiveLabTool(tool);
    setLaunchCountdown(3);
    setLabPhase('launching');
    triggerSwitchToast(activeChapter.chapterTitle, `正在启动【${tool.name}】实验环境...`);
  };

  const handleExitLabEnvironment = () => {
    setLabPhase('idle');
    setActiveLabTool(null);
  };

  // 横向拖拽手柄事件监听处理
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = drawerWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(300, Math.min(window.innerWidth * 0.75, Math.min(980, startWidth + deltaX)));
      setDrawerWidth(newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // 目录章节折叠切换
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // 目录类型标签渲染函数（图文、视频、实验、习题、报告）
  const renderStepTag = (tag: '图文' | '视频' | '实验' | '习题' | '报告') => {
    switch (tag) {
      case '图文':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-blue-50 text-blue-600 border-blue-200/80 shrink-0">图文</span>;
      case '视频':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-amber-50 text-amber-600 border-amber-200/80 shrink-0">视频</span>;
      case '实验':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-purple-50 text-purple-600 border-purple-200/80 shrink-0">实验</span>;
      case '习题':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-emerald-50 text-emerald-600 border-emerald-200/80 shrink-0">习题</span>;
      case '报告':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-rose-50 text-rose-600 border-rose-200/80 shrink-0">报告</span>;
    }
  };

  // 目录结构数据（包含各类型步骤）
  const directoryData: DirectoryChapter[] = [
    {
      id: 'dir-chap-1',
      chapterTitle: '第一章：认识自然语言处理',
      steps: [
        { id: '1-1', title: '1-1 任务1 NLTK预处理方法（教材）', type: 'text', tag: '图文', status: '已提交' },
        { id: '1-2', title: '1-2 任务1 NLTK预处理方法（理论）', type: 'text', tag: '图文', status: '进行中' },
        { id: '1-3', title: '1-3 任务1 NLTK预处理方法（实操）', type: 'lab', tag: '实验', status: '已提交' },
        { id: '1-4', title: '1-4 任务1 NLTK预处理方法（视频）', type: 'video', tag: '视频', status: '已提交' },
        { id: '1-5', title: '1-5 任务2 中文文本分词方法与工具使用（教材）', type: 'text', tag: '图文', status: '未开始' },
        { id: '1-6', title: '1-6 任务2 中文文本分词方法与工具使用（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '1-7', title: '1-7 任务2 中文文本分词方法与工具使用（实操）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '1-8', title: '1-8 任务2 中文文本分词方法与工具使用（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '1-9', title: '1-9 任务3 核心词汇识别与云图开发（报告）', type: 'report', tag: '报告', status: '未开始' },
        { id: '1-10', title: '1-10 任务3 核心词汇识别与云图开发（习题）', type: 'exercise', tag: '习题', status: '未开始' },
      ]
    },
    {
      id: 'dir-chap-2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      steps: [
        { id: '2-1', title: '2-1 任务1 垃圾邮件分类器特征工程（教材）', type: 'text', tag: '图文', status: '未开始' },
        { id: '2-2', title: '2-2 任务1 开发中文垃圾邮件分类器（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '2-3', title: '2-3 任务1 贝叶斯分类器代码实操（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '2-4', title: '2-4 任务1 文本特征向量化精讲（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '2-5', title: '2-5 任务2 LDA主题模型无监督提取（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '2-6', title: '2-6 任务2 基于LDA开发提取邮件主题（实操）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '2-7', title: '2-7 任务2 LDA主题概率分布可视化（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '2-8', title: '2-8 任务3 主题模型评估分析报告（报告）', type: 'report', tag: '报告', status: '未开始' },
        { id: '2-9', title: '2-9 任务3 文本分类与聚类巩固测验（习题）', type: 'exercise', tag: '习题', status: '未开始' },
      ]
    },
    {
      id: 'dir-chap-3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      steps: [
        { id: '3-1', title: '3-1 任务1 情感极性判定原理（教材）', type: 'text', tag: '图文', status: '未开始' },
        { id: '3-2', title: '3-2 任务1 机器学习情感分析基础（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '3-3', title: '3-3 任务1 评论数据预处理与特征构建（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '3-4', title: '3-4 任务1 情感特征工程实战演示（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '3-5', title: '3-5 任务2 BiLSTM神经网络架构（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '3-6', title: '3-6 任务2 BiLSTM情绪识别模型训练（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '3-7', title: '3-7 任务2 神经网络训练循环剖析（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '3-8', title: '3-8 任务3 酒店评论情感评测实训报告（报告）', type: 'report', tag: '报告', status: '未开始' },
        { id: '3-9', title: '3-9 任务3 时序深度学习模型阶段测验（习题）', type: 'exercise', tag: '习题', status: '未开始' },
      ]
    },
    {
      id: 'dir-chap-4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      steps: [
        { id: '4-1', title: '4-1 任务1 实体识别BIO标注体系（教材）', type: 'text', tag: '图文', status: '未开始' },
        { id: '4-2', title: '4-2 任务1 生活场景数据处理及序列标注（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '4-3', title: '4-3 任务1 实体边界标注实战（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '4-4', title: '4-4 任务1 序列标注工具实战精讲（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '4-5', title: '4-5 任务2 BiLSTM-CRF模型架构与训练（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '4-6', title: '4-6 任务2 序列标注转移概率矩阵推导（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '4-7', title: '4-7 任务3 生活场景模型实测评估（报告）', type: 'report', tag: '报告', status: '未开始' },
        { id: '4-8', title: '4-8 任务3 命名实体识别综合考核试卷（习题）', type: 'exercise', tag: '习题', status: '未开始' },
      ]
    }
  ];

  // 查找当前激活的步骤和章节信息
  const getCurrentStepInfo = () => {
    for (const chapter of directoryData) {
      const found = chapter.steps.find(s => s.id === currentStepId);
      if (found) {
        return { chapter, step: found };
      }
    }
    return { chapter: directoryData[0], step: directoryData[0].steps[0] };
  };

  const { chapter: activeChapter, step: activeStep } = getCurrentStepInfo();

  // 1. 图文学习数据
  const textChapters: ChapterData[] = [
    {
      id: 'chap-1',
      chapterTitle: '第一章：认识自然语言处理',
      items: [
        { 
          id: '1-2', 
          name: '1-2 任务1 NLTK预处理方法（理论）', 
          fullTitle: '1-2 任务1 NLTK预处理方法（理论）',
          type: 'text',
          desc: '本任务讲解NLP基础环境构建、文本分词Tokenization及NLTK库的常见预处理流水线。'
        },
        { 
          id: '1-6', 
          name: '1-6 任务2 中文文本分词方法与工具使用（...', 
          fullTitle: '1-6 任务2 中文文本分词方法与工具使用（理论与实践）',
          type: 'text',
          desc: '深入剖析jieba分词算法原理（基于Trie树与HMM模型），以及分词工具的高阶使用技巧。'
        },
        { 
          id: '1-10', 
          name: '1-10 任务3 核心词汇识别与云图开发（理...', 
          fullTitle: '1-10 任务3 核心词汇识别与云图开发（理论与可视化）',
          type: 'text',
          desc: '基于TF-IDF算法提取核心关键词，并使用WordCloud和Matplotlib实现关键词云图绘制。'
        },
      ]
    },
    {
      id: 'chap-2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      items: [
        { 
          id: '2-2', 
          name: '2-2 任务1 开发中文垃圾邮件分类器（理论）', 
          fullTitle: '2-2 任务1 开发中文垃圾邮件分类器（理论）',
          type: 'text',
          desc: '垃圾邮件分类模型构建，涵盖CountVectorizer特征工程与朴素贝叶斯分类器训练。'
        },
        { 
          id: '2-6', 
          name: '2-6 任务2 基于LDA开发提取邮件主题模型...', 
          fullTitle: '2-6 任务2 基于LDA开发提取邮件主题模型（理论与调优）',
          type: 'text',
          desc: '隐含狄利克雷分布（LDA）主题建模无监督学习原理，主题概率分布计算及PyLDAvis可视化。'
        },
        { 
          id: '2-10', 
          name: '2-10 任务3 基于Bert模型开发多主题分类...', 
          fullTitle: '2-10 任务3 基于Bert模型开发多主题分类（深度学习）',
          type: 'text',
          desc: '深入解析Transformer架构与Bert预训练模型，使用HuggingFace进行下游微调任务。'
        },
      ]
    },
    {
      id: 'chap-3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      items: [
        { 
          id: '3-2', 
          name: '3-2 任务1 机器学习情感分析基础（理论）', 
          fullTitle: '3-2 任务1 机器学习情感分析基础（理论）',
          type: 'text',
          desc: '情感极性判定原理，正负样本数据均衡化清洗与特征提取方法。'
        },
        { 
          id: '3-6', 
          name: '3-6 任务2 酒店用户评论数据预处理与数据...', 
          fullTitle: '3-6 任务2 酒店用户评论数据预处理与数据探索性分析',
          type: 'text',
          desc: '大规模电商评论数据去重、停用词过滤及情感词典匹配构建流程。'
        },
        { 
          id: '3-10', 
          name: '3-10 任务3 基于BiLSTM学习情绪识别模型...', 
          fullTitle: '3-10 任务3 基于BiLSTM学习情绪识别模型（双向长短期记忆）',
          type: 'text',
          desc: '双向RNN与LSTM单元设计，捕捉时序语义上下文并实现细粒度情感打分预测。'
        },
      ]
    },
    {
      id: 'chap-4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      items: [
        { 
          id: '4-2', 
          name: '4-2 任务1 生活场景的数据处理及序列标注...', 
          fullTitle: '4-2 任务1 生活场景的数据处理及序列标注（BIO体系）',
          type: 'text',
          desc: '实体识别BIO标注标准，生活场景（地点、人名、机构名）语料库标注规范实训。'
        },
        { 
          id: '4-6', 
          name: '4-6 任务2 生活场景模型构建与训练（理论）', 
          fullTitle: '4-6 任务2 生活场景模型构建与训练（理论）',
          type: 'text',
          desc: 'BiLSTM-CRF网络架构在序列标注任务中的应用原理与转移概率矩阵推导。'
        },
        { 
          id: '4-10', 
          name: '4-10 任务3 生活场景模型测试（理论）', 
          fullTitle: '4-10 任务3 生活场景模型测试与实测评估（理论）',
          type: 'text',
          desc: '精确率Precision、召回率Recall及F1-Score评测，模型部署与接口封装。'
        },
      ]
    }
  ];

  // 2. 视频学习数据
  const videoChapters: ChapterData[] = [
    {
      id: 'chap-v1',
      chapterTitle: '第一章：认识自然语言处理',
      items: [
        { 
          id: 'v-1-1', 
          name: '1-4 任务1 NLTK预处理与分词环境搭建', 
          fullTitle: '1-4 任务1 NLTK预处理方法与实操教学视频',
          type: 'video',
          duration: '1:09:07',
          desc: 'JupyterLab 实操录屏：NLP 预处理与分词环境搭建教学实录'
        },
        { 
          id: 'v-1-2', 
          name: '1-8 任务2 中文文本分词与自定义词典导入', 
          fullTitle: '1-8 任务2 中文文本分词方法与工具实战精讲',
          type: 'video',
          duration: '45:15',
          desc: '分词工具配置及自定义词典引入演示'
        },
      ]
    },
    {
      id: 'chap-v2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      items: [
        { 
          id: 'v-2-1', 
          name: '2-4 任务1 垃圾邮件分类器特征工程全流程', 
          fullTitle: '2-4 任务1 中文垃圾邮件分类器训练全流程精讲',
          type: 'video',
          duration: '52:10',
          desc: '从数据导入到分类器准确率评测全过程'
        },
        { 
          id: 'v-2-2', 
          name: '2-7 任务2 LDA主题概率分布交互调优演示', 
          fullTitle: '2-7 任务2 LDA主题概率可视化调优演示视频',
          type: 'video',
          duration: '38:30',
          desc: '互动演示主题词分布与连贯性评估指标'
        },
      ]
    },
    {
      id: 'chap-v3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      items: [
        { 
          id: 'v-3-1', 
          name: '3-4 任务1 情感极性特征工程实战视频', 
          fullTitle: '3-4 任务1 情感极性特征工程实战视频教学',
          type: 'video',
          duration: '42:15',
          desc: '酒店多维度点评特征挖掘与可视化'
        },
        { 
          id: 'v-3-2', 
          name: '3-7 任务2 BiLSTM网络代码逐行剖析与演示', 
          fullTitle: '3-7 任务2 BiLSTM网络代码逐行剖析与演示视频',
          type: 'video',
          duration: '58:40',
          desc: 'PyTorch神经网络代码训练循环剖析'
        },
      ]
    },
    {
      id: 'chap-v4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      items: [
        { 
          id: 'v-4-1', 
          name: '4-4 任务1 实体识别BIO标注实操教学视频', 
          fullTitle: '4-4 任务1 实体识别BIO标注实操教学视频',
          type: 'video',
          duration: '35:50',
          desc: '工业级标注工具使用及数据增强方法'
        },
      ]
    }
  ];

  // 3. 手册学习数据
  const manualChapters: ChapterData[] = [
    {
      id: 'chap-m1',
      chapterTitle: '第一章：认识自然语言处理',
      items: [
        { 
          id: 'm-1-1', 
          name: '1-1 NLTK预处理函数与语料库使用手册', 
          fullTitle: '1-1 NLTK预处理函数与语料库官方使用手册',
          type: 'manual',
          desc: '详细介绍nltk.tokenize、nltk.stem、stopwords等常用模块API与配置'
        },
        { 
          id: 'm-1-2', 
          name: '1-5 Jieba分词精准模式与HMM底层原理手册', 
          fullTitle: '1-5 Jieba分词精准模式与HMM底层原理手册',
          type: 'manual',
          desc: 'Jieba词典格式规范、动态添加词与权重词典设定说明'
        },
      ]
    },
    {
      id: 'chap-m2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      items: [
        { 
          id: 'm-2-1', 
          name: '2-1 朴素贝叶斯分类器超参数调优指南', 
          fullTitle: '2-1 朴素贝叶斯分类器超参数调优指南与评估',
          type: 'manual',
          desc: 'MultinomialNB模型平滑因子alpha调参及交叉验证步骤'
        },
        { 
          id: 'm-2-2', 
          name: '2-5 LDA主题困惑度计算与PyLDAvis配置手册', 
          fullTitle: '2-5 LDA主题困惑度计算与PyLDAvis配置手册',
          type: 'manual',
          desc: '主题数K值择优公式及交互式可视化组件依赖部署指南'
        },
      ]
    },
    {
      id: 'chap-m3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      items: [
        { 
          id: 'm-3-1', 
          name: '3-1 中文情感词典极性打标与特征规范', 
          fullTitle: '3-1 中文情感词典极性打标与特征规范手册',
          type: 'manual',
          desc: '知网Hownet情感词表与大连理工情感本体库使用手册'
        },
        { 
          id: 'm-3-2', 
          name: '3-5 BiLSTM时序模型张量形状与输入对齐手册', 
          fullTitle: '3-5 BiLSTM时序模型张量形状与输入对齐手册',
          type: 'manual',
          desc: 'PyTorch PackedSequence序列填充与变长输入处理技巧'
        },
      ]
    },
    {
      id: 'chap-m4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      items: [
        { 
          id: 'm-4-1', 
          name: '4-1 命名实体识别BIO标注标准与质检手册', 
          fullTitle: '4-1 命名实体识别BIO标注标准与质检手册',
          type: 'manual',
          desc: '实体边界界定、多字词嵌套标注规范与常见易错示例集'
        },
      ]
    }
  ];

  // 4. 文件下载资源数据
  const fileChapters: ChapterData[] = [
    {
      id: 'chap-f1',
      chapterTitle: '第一章：认识自然语言处理',
      items: [
        { 
          id: 'f-1-1', 
          name: '1-0 《认识自然语言处理》理论讲义.pdf', 
          fullTitle: '1-0 《认识自然语言处理》理论讲义完整版.pdf',
          type: 'file',
          fileSize: '12.4 MB',
          desc: '第一章配套完整幻灯片与讲义讲稿'
        },
        { 
          id: 'f-1-2', 
          name: '1-3 NLTK与Jieba分词实操源代码.zip', 
          fullTitle: '1-3 NLTK与Jieba分词实操源代码与测试语料包.zip',
          type: 'file',
          fileSize: '4.8 MB',
          desc: '包含Jupyter Notebook实验源码与中文分词词库数据'
        },
      ]
    },
    {
      id: 'chap-f2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      items: [
        { 
          id: 'f-2-1', 
          name: '2-0 中文垃圾邮件分类标准语料集.csv', 
          fullTitle: '2-0 中文垃圾邮件分类标准语料集（带标注）.csv',
          type: 'file',
          fileSize: '8.2 MB',
          desc: '50000条真实标注中文邮件文本语料'
        },
        { 
          id: 'f-2-2', 
          name: '2-3 贝叶斯与LDA主题建模工程模板.ipynb', 
          fullTitle: '2-3 贝叶斯与LDA主题建模工程完整模板.ipynb',
          type: 'file',
          fileSize: '1.5 MB',
          desc: '开箱即用的Jupyter实验项目模版代码'
        },
      ]
    },
    {
      id: 'chap-f3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      items: [
        { 
          id: 'f-3-1', 
          name: '3-0 酒店评论情感分析精标数据集.json', 
          fullTitle: '3-0 酒店评论情感分析精标数据集.json',
          type: 'file',
          fileSize: '15.6 MB',
          desc: '包含评分、正面与负面评价标签的评论数据集'
        },
        { 
          id: 'f-3-2', 
          name: '3-7 BiLSTM情绪识别预训练权重.pt', 
          fullTitle: '3-7 BiLSTM情绪识别预训练权重文件.pt',
          type: 'file',
          fileSize: '48.2 MB',
          desc: '在百万评论上预训练收敛的深度学习模型权重'
        },
      ]
    },
    {
      id: 'chap-f4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      items: [
        { 
          id: 'f-4-1', 
          name: '4-0 中文命名实体识别标注数据集.txt', 
          fullTitle: '4-0 中文命名实体识别生活场景标注数据集.txt',
          type: 'file',
          fileSize: '6.1 MB',
          desc: 'BIO格式生活场景人名、地名、机构名精标语料'
        },
      ]
    }
  ];

  // 根据当前激活的 Tab 获取数据
  const getCurrentChapters = () => {
    switch (activeResourceTab) {
      case 'video':
        return videoChapters;
      case 'manual':
        return manualChapters;
      case 'file':
        return fileChapters;
      case 'text':
      default:
        return textChapters;
    }
  };

  const currentChapters = getCurrentChapters();

  // 插入富文本标记辅助函数
  const handleInsertToolbarTag = (prefix: string, suffix: string = '') => {
    setNoteContent(prev => prev ? `${prev}\n${prefix}${suffix}` : `${prefix}${suffix}`);
  };

  // 步骤切换操作（附带 Toast 提示）
  const handleSelectStep = (chapterTitle: string, step: DirectoryStepItem) => {
    setCurrentStepId(step.id);
    if (step.type === 'video') {
      setIsPlaying(true);
    }
    triggerSwitchToast(chapterTitle, step.title);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans select-none relative">
      
      {/* 全局 Toast 提示（用户要求：切换章节成功后增加 toast 提示，你已经切换xxx章节） */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center space-x-2.5 border border-slate-700/60 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium tracking-wide">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 顶部主导航栏 */}
      <header className="py-1 min-h-[56px] bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-xs z-20">
        <div className="flex items-center">
          <button 
            onClick={() => onNavigate ? onNavigate('course-hall') : (window.history.length > 1 ? window.history.back() : null)}
            className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md transition-colors mr-3 cursor-pointer"
            title="返回上一级"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img 
            src="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=60&h=60" 
            alt="Cover" 
            className="w-6 h-6 rounded mr-2 object-cover" 
          />
          <div className="flex items-baseline space-x-3">
            <h1 className="text-[15px] font-medium text-slate-800">《Python可视化应用》</h1>
            <span className="text-[12px] text-slate-400 font-normal hidden sm:inline">AI学伴-功能演示1789454686416</span>
          </div>
        </div>
        
        <div className="flex flex-1 justify-end items-center pr-8 space-x-8 text-sm">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center text-slate-600 text-[13px]">
              <span className="mr-2">任务进度:</span>
              <span className="font-medium text-slate-800">10 %</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap max-w-[340px] truncate">
              当前步骤: {activeChapter.chapterTitle} - {activeStep.title}
            </div>
          </div>

          <div className="hidden lg:flex items-center text-slate-600 text-[13px]">
            <span className="mr-2">剩余时间:</span>
            <span className="font-medium text-slate-800">16: 34: 50</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={() => {
              setCurrentPage(prev => Math.max(1, prev - 1));
              triggerSwitchToast(activeChapter.chapterTitle, '上一步');
            }}
            className="px-4 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 text-sm flex items-center transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            上一步
          </button>
          <button 
            onClick={() => {
              setCurrentPage(prev => Math.min(totalPages, prev + 1));
              triggerSwitchToast(activeChapter.chapterTitle, '下一步');
            }}
            className="px-4 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 text-sm flex items-center transition-colors cursor-pointer"
          >
            下一步
            <ChevronsRight className="w-4 h-4 ml-1" />
          </button>
          <button className="px-4 py-1.5 border border-blue-200 text-blue-500 hover:bg-blue-50 rounded text-sm flex items-center transition-colors bg-blue-50/30 cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1 rotate-90" />
            上报本节
          </button>
          <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors shadow-xs cursor-pointer">
            提交任务
          </button>
        </div>
      </header>

      {/* 主体工作区 */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 左侧垂直菜单栏（目录、笔记、资源、AI） */}
        <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 shrink-0 z-40 select-none shadow-[2px_0_6px_rgba(0,0,0,0.03)]">
          {/* 1. 目录 */}
          <button 
            type="button"
            onClick={() => setActiveSidebar(activeSidebar === 'directory' ? null : 'directory')}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg mb-3 transition-colors cursor-pointer ${
              activeSidebar === 'directory' 
                ? 'text-blue-600 bg-blue-50 font-medium' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
            title="课程目录"
          >
            <AlignLeft className="w-5 h-5 mb-1 pointer-events-none" />
            <span className="text-[10px] pointer-events-none">目录</span>
          </button>
          
          {/* 2. 笔记 */}
          <button 
            type="button"
            onClick={() => setActiveSidebar(activeSidebar === 'notes' ? null : 'notes')}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg mb-3 transition-colors cursor-pointer ${
              activeSidebar === 'notes' 
                ? 'text-[#4f46e5] bg-[#eef2ff] font-medium shadow-xs' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
            title="随堂笔记"
          >
            <BookMarked className="w-5 h-5 mb-1 pointer-events-none" />
            <span className="text-[10px] pointer-events-none">笔记</span>
          </button>
          
          {/* 3. 资源 */}
          <button 
            type="button"
            onClick={() => setActiveSidebar(activeSidebar === 'resources' ? null : 'resources')}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg mb-6 transition-colors cursor-pointer ${
              activeSidebar === 'resources' 
                ? 'text-blue-600 bg-blue-50 font-medium shadow-xs' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
            title="课程资源"
          >
            <Film className="w-5 h-5 mb-1 pointer-events-none" />
            <span className="text-[10px] pointer-events-none">资源</span>
          </button>
          
          {/* 4. AI */}
          <button 
            type="button"
            onClick={() => {
              const smartBtn = document.querySelector('[data-smart-assistant-btn]') as HTMLButtonElement;
              if (smartBtn) smartBtn.click();
            }}
            className="w-12 h-12 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg mb-2 cursor-pointer transition-transform active:scale-95"
            title="AI学伴"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              AI
            </div>
          </button>
        </aside>

        {/* 1. 目录浮动抽屉（支持横向拖拽改变窗口大小、折叠章节、各步骤类型标签、点击切换并触发Toast） */}
        {activeSidebar === 'directory' && (
          <aside 
            style={{ width: `${drawerWidth}px` }}
            className="absolute top-0 left-16 bottom-0 bg-white border-r border-slate-200/90 flex flex-col z-30 shadow-[8px_0_30px_rgba(0,0,0,0.1)] transition-none animate-in fade-in duration-150"
          >
            {/* 顶部控制栏 */}
            <div className="h-11 flex items-center justify-between px-4 border-b border-slate-100 shrink-0 bg-white">
              <span className="text-sm font-bold text-slate-800 flex items-center">
                <AlignLeft className="w-4 h-4 mr-2 text-blue-600" />
                课程目录
              </span>
              <div className="flex items-center space-x-1 text-[#4f6ef7]">
                <button 
                  onClick={() => setDrawerWidth(drawerWidth === 560 ? 420 : 560)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="分栏扩展"
                >
                  <Columns2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                <button 
                  onClick={() => setDrawerWidth(drawerWidth === 840 ? 420 : 840)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="全屏放大"
                >
                  <Maximize2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                <button 
                  onClick={() => setActiveSidebar(null)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="关闭"
                >
                  <X className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* 目录列表（章节可折叠，步骤带类型标签） */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {directoryData.map((chapter) => {
                const isExpanded = !!expandedChapters[chapter.id];
                return (
                  <div key={chapter.id} className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/40">
                    {/* 章节标题栏（点击展开/折叠） */}
                    <button 
                      type="button"
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-100/60 hover:bg-blue-50/60 transition-colors text-left cursor-pointer border-b border-slate-100/80"
                    >
                      <span className="text-[13px] font-bold text-slate-800 truncate pr-2">
                        {chapter.chapterTitle}
                      </span>
                      <div className="flex items-center space-x-1.5 text-slate-400 shrink-0">
                        <span className="text-[11px] text-slate-400">{chapter.steps.length} 节</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`} />
                      </div>
                    </button>

                    {/* 展开的步骤列表 */}
                    {isExpanded && (
                      <div className="py-1 bg-white divide-y divide-slate-50">
                        {chapter.steps.map((step) => {
                          const isSelected = currentStepId === step.id;
                          return (
                            <div 
                              key={step.id}
                              onClick={() => handleSelectStep(chapter.chapterTitle, step)}
                              className={`flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer group ${
                                isSelected ? 'bg-blue-50/80 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center space-x-2 truncate flex-1 pr-2">
                                <span className={`truncate text-[12px] leading-relaxed ${isSelected ? 'text-blue-600 font-medium' : 'text-slate-700'}`} title={step.title}>
                                  {step.title}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2 shrink-0">
                                {/* 类型标签：图文、视频、实验、习题、报告 */}
                                {renderStepTag(step.tag)}

                                {isSelected ? (
                                  <span className="text-[10px] text-blue-500 font-bold bg-white px-1 py-0.5 rounded border border-blue-200 shadow-2xs">当前</span>
                                ) : (
                                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${step.status === '已提交' ? 'border-emerald-400 bg-emerald-100/60' : 'border-slate-200'}`}></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 底部统计 */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-white text-[11px] text-slate-400 flex items-center justify-between shrink-0">
              <span>共 {directoryData.length} 章 · {directoryData.reduce((acc, c) => acc + c.steps.length, 0)} 个实训步骤</span>
              <span className="text-blue-500">点击步骤切换学习</span>
            </div>

            {/* 拖拽手柄 */}
            <ResizeHandle onMouseDown={handleMouseDownResize} />
          </aside>
        )}

        {/* 2. 笔记浮动抽屉 */}
        {activeSidebar === 'notes' && (
          <aside 
            style={{ width: `${drawerWidth}px` }}
            className="absolute top-0 left-16 bottom-0 bg-white border-r border-slate-200/90 flex flex-col z-30 shadow-[8px_0_30px_rgba(0,0,0,0.1)] transition-none animate-in fade-in duration-150"
          >
            {/* 笔记顶部标题与控制操作栏 */}
            <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white overflow-hidden">
              {/* 左侧：章节大标题与任务副标题 */}
              <div className="min-w-0 flex-1 pr-2.5 flex items-center space-x-2">
                <h2 className="text-[13px] sm:text-[14px] font-bold text-slate-900 tracking-tight shrink-0">
                  {activeChapter.chapterTitle}
                </h2>
                <span className="text-[11px] text-slate-500 font-normal leading-tight line-clamp-2 min-w-0">
                  {activeStep.title}
                </span>
              </div>

              {/* 右侧工具图标组：保存、分栏、全屏、关闭（蓝紫色） */}
              <div className="flex items-center space-x-1 text-[#4f6ef7] shrink-0">
                <button 
                  onClick={() => {
                    setIsNoteSaved(true);
                    setTimeout(() => setIsNoteSaved(false), 2500);
                  }}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  title="保存笔记"
                >
                  <Save className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                
                <button 
                  onClick={() => setDrawerWidth(drawerWidth === 560 ? 420 : 560)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  title="分栏/扩展宽度"
                >
                  <Columns2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                
                <button 
                  onClick={() => setDrawerWidth(drawerWidth === 840 ? 420 : 840)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  title="最大化"
                >
                  <Maximize2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>

                <button 
                  onClick={() => setActiveSidebar(null)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  title="关闭"
                >
                  <X className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* 富文本编辑工具条 */}
            <div className="px-3 py-1.5 border-b border-slate-200/80 bg-[#fafbfe] flex items-center space-x-1 shrink-0 text-slate-700 overflow-x-auto no-scrollbar">
              <button onClick={() => handleInsertToolbarTag('**粗体文本**')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors font-bold text-sm" title="加粗"><Bold className="w-3.5 h-3.5 stroke-[2.5]" /></button>
              <button onClick={() => handleInsertToolbarTag('<u>下划线文本</u>')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-sm" title="下划线"><Underline className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('*斜体文本*')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-sm italic" title="斜体"><Italic className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('~~删除文本~~')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-sm" title="删除线"><Strikethrough className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <div className="h-4 w-px bg-slate-300 mx-1"></div>
              <button onClick={() => handleInsertToolbarTag('### ')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors font-semibold text-sm" title="标题"><Heading className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('X<sub>2</sub>')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-xs font-mono" title="下标"><Subscript className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('X<sup>2</sup>')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-xs font-mono" title="上标"><Superscript className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('- 列表条目')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors" title="无序列表"><List className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('1. 列表条目')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors" title="有序列表"><ListOrdered className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('- [ ] 待办任务')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors" title="待办清单"><ListTodo className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <div className="h-4 w-px bg-slate-300 mx-1"></div>
              <button onClick={() => handleInsertToolbarTag('```python\n# 请输入代码\n```')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors" title="插入代码块"><Code className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => setIsNotePreview(prev => !prev)} className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${isNotePreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200/70'}`} title={isNotePreview ? '切换到编辑模式' : '预览排版'}><Eye className="w-3.5 h-3.5 stroke-[2.2]" /></button>
            </div>

            {/* 保存成功提示 */}
            {isNoteSaved && (
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs flex items-center border-b border-emerald-100 animate-in fade-in duration-150">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                笔记内容已成功自动同步保存
              </div>
            )}

            {/* 笔记编辑正文区域 */}
            <div className="flex-1 p-4 flex flex-col overflow-hidden bg-white">
              {isNotePreview ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {noteContent || <span className="text-slate-400">暂无内容，请点击工具栏眼睛图标返回编辑。</span>}
                </div>
              ) : (
                <textarea 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="请输入正文"
                  className="w-full flex-1 resize-none outline-none border-none text-[14px] text-slate-800 placeholder-slate-400 leading-relaxed font-sans"
                  autoFocus
                />
              )}
            </div>

            {/* 底部信息栏 */}
            <div className="px-4 py-2 border-t border-slate-100 text-[12px] text-slate-500 bg-white flex items-center justify-between shrink-0 select-none">
              <span>字数: {noteContent.length}</span>
              <span className="text-slate-400 text-[11px]">随堂笔记自动缓存</span>
            </div>

            {/* 拖拽手柄 */}
            <ResizeHandle onMouseDown={handleMouseDownResize} />
          </aside>
        )}

        {/* 3. 资源浮动抽屉 */}
        {activeSidebar === 'resources' && (
          <aside 
            style={{ width: `${drawerWidth}px` }}
            className="absolute top-0 left-16 bottom-0 bg-[#fafbfe] border-r border-slate-200/90 flex flex-col z-30 shadow-[8px_0_30px_rgba(0,0,0,0.1)] transition-none animate-in fade-in duration-150"
          >
            {/* 顶部控制栏 */}
            <div className="h-10 flex items-center justify-end px-3.5 space-x-2 text-[#4f6ef7] shrink-0 pt-2">
              <button 
                onClick={() => setDrawerWidth(drawerWidth === 560 ? 420 : 560)}
                className="p-1 rounded hover:bg-blue-50/80 transition-colors cursor-pointer"
                title="分栏/扩展宽度"
              >
                <Columns2 className="w-[17px] h-[17px] stroke-[2.2]" />
              </button>
              
              <button 
                onClick={() => setDrawerWidth(drawerWidth === 840 ? 420 : 840)}
                className="p-1 rounded hover:bg-blue-50/80 transition-colors cursor-pointer"
                title="最大化全屏"
              >
                <Maximize2 className="w-[17px] h-[17px] stroke-[2.2]" />
              </button>

              <button 
                onClick={() => setActiveSidebar(null)}
                className="p-1 rounded hover:bg-blue-50/80 transition-colors cursor-pointer"
                title="关闭"
              >
                <X className="w-[17px] h-[17px] stroke-[2.2]" />
              </button>
            </div>

            {/* 顶部 Tab 栏：4 个 Tab */}
            <div className="px-4 pt-1 pb-2 shrink-0">
              <div className="flex bg-[#f1f4fa] rounded-t-xl overflow-hidden p-1 shadow-inner">
                {[
                  { key: 'text', label: '图文' },
                  { key: 'video', label: '视频' },
                  { key: 'manual', label: '手册' },
                  { key: 'file', label: '文件' },
                ].map(tab => (
                  <button 
                    key={tab.key}
                    onClick={() => setActiveResourceTab(tab.key as any)}
                    className={`flex-1 py-1.5 text-[13px] text-center relative font-medium transition-all cursor-pointer rounded-lg ${
                      activeResourceTab === tab.key 
                        ? 'text-slate-800 bg-white shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                    }`}
                  >
                    {tab.label}
                    {activeResourceTab === tab.key && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-[#2f80ed] rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 章节与资源条目列表 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-3 space-y-7">
              {currentChapters.map((chapter) => (
                <div key={chapter.id} className="space-y-4">
                  {/* 章节标题栏 */}
                  <div className="flex items-center">
                    <ChapterBubbleIcon />
                    <h3 className="text-[14px] font-bold text-slate-800 tracking-tight">
                      {chapter.chapterTitle}
                    </h3>
                  </div>

                  {/* 章节任务条目 */}
                  <div className="space-y-3.5 pl-8">
                    {chapter.items.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between group hover:bg-blue-50/40 p-1 -m-1 rounded-md transition-colors"
                      >
                        <span 
                          className="text-[13px] text-slate-700 leading-snug truncate max-w-[210px] font-normal" 
                          title={item.fullTitle}
                        >
                          {item.name}
                        </span>

                        <div className="flex-1 border-b border-dotted border-blue-200/90 mx-2 min-w-[20px] opacity-70"></div>

                        <button 
                          onClick={() => {
                            if (item.type === 'video') {
                              setCurrentStepId('1-4');
                              setIsPlaying(true);
                              triggerSwitchToast(chapter.chapterTitle, item.fullTitle);
                            } else {
                              setPreviewItem(item);
                            }
                          }}
                          className="px-3.5 py-0.5 text-xs text-[#2f80ed] border border-[#2f80ed] hover:bg-[#2f80ed] hover:text-white rounded-full transition-all duration-150 shrink-0 font-normal bg-white shadow-2xs active:scale-95 cursor-pointer"
                        >
                          {item.type === 'video' ? '播放' : (item.type === 'file' ? '下载' : '查看')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 抽屉底部统计信息 */}
            <div className="px-5 py-2.5 border-t border-slate-100 bg-white/70 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
              <span>共 {currentChapters.reduce((acc, c) => acc + c.items.length, 0)} 项资源</span>
              <span className="text-blue-500">点击按钮在线交互</span>
            </div>

            {/* 拖拽手柄 */}
            <ResizeHandle onMouseDown={handleMouseDownResize} />
          </aside>
        )}

        {/* 主视窗区域：隔离在独立层级 z-0，绝对无法穿透覆盖外部抽屉 */}
        <div className="flex-1 flex flex-col relative z-0 bg-[#181a20] overflow-hidden">
          
          {/* 场景 A：视频步骤类型（当前选中的是 1-4 等视频任务）—— 完美参考截图呈现 JupyterLab 实操视频播放器 */}
          {activeStep.type === 'video' ? (
            <div className="flex-1 flex flex-col bg-[#1e2026] relative overflow-hidden select-none">
              
              {/* 模拟全屏视频画面（JupyterLab 实操课录像） */}
              <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden relative">
                
                {/* 1. 模拟浏览器上边框与标签栏 */}
                <div className="h-9 bg-[#dfe2e7] flex items-center justify-between px-3 border-b border-[#cbd0d8] shrink-0 text-xs text-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <div className="px-3 py-1 bg-[#f0f2f5] rounded-t-md font-medium text-slate-800 text-[11px] flex items-center space-x-1.5 shadow-2xs">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span>JupyterLab</span>
                      <X className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer ml-1" />
                    </div>
                    <div className="px-3 py-1 text-slate-500 hover:bg-slate-200/60 rounded-t-md text-[11px] flex items-center space-x-1.5 cursor-pointer">
                      <span>人工智能教学实验平台</span>
                    </div>
                  </div>

                  {/* 窗口操作按钮 */}
                  <div className="flex items-center space-x-2 text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                </div>

                {/* 2. 模拟浏览器地址栏 */}
                <div className="h-8 bg-white border-b border-slate-200 flex items-center px-3 space-x-2 text-xs shrink-0">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <ChevronsRight className="w-3.5 h-3.5" />
                    <RotateCcw className="w-3 h-3" />
                  </div>
                  <div className="flex-1 bg-[#f1f3f6] rounded px-3 py-1 text-slate-600 text-[11px] font-mono flex items-center justify-between">
                    <span className="truncate">🔒 jh.nlecloud.com:30002/user/eric/lab/tree/nlpbasic/项目介绍.ipynb</span>
                    <span className="text-[10px] text-slate-400 shrink-0">CPU: 0% | Mem: 256 / 8192 MB</span>
                  </div>
                </div>

                {/* 3. JupyterLab 顶部菜单条 */}
                <div className="h-7 bg-[#ededed] border-b border-slate-300/80 flex items-center px-3 space-x-3 text-[11px] text-slate-700 shrink-0">
                  {['File', 'Edit', 'View', 'Run', 'Kernel', 'Git', 'Tabs', 'Settings', 'Help'].map(m => (
                    <span key={m} className="hover:bg-slate-200 px-1 py-0.5 rounded cursor-pointer">{m}</span>
                  ))}
                </div>

                {/* 4. JupyterLab 页面主体（左侧文件树，右侧 Notebook 文档） */}
                <div className="flex-1 flex overflow-hidden">
                  
                  {/* 左侧活动文件栏 */}
                  <div className="w-56 bg-[#f7f7f7] border-r border-slate-200 flex flex-col shrink-0 text-xs text-slate-700 select-none">
                    <div className="p-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 bg-white">
                      <span className="font-mono">/ nlpbasic /</span>
                      <Folder className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-[11px]">
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-600 hover:bg-slate-200/60 cursor-pointer">
                        <Folder className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span>data</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-600 hover:bg-slate-200/60 cursor-pointer">
                        <Folder className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span>models</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-600 hover:bg-slate-200/60 cursor-pointer">
                        <Folder className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span>result</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-700 hover:bg-slate-200/60 cursor-pointer">
                        <FileCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">任务1: 文本预处理.ipynb</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-700 hover:bg-slate-200/60 cursor-pointer">
                        <FileCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">任务2: 中文文本处理.ipynb</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-700 hover:bg-slate-200/60 cursor-pointer">
                        <FileCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">任务3: 关键词提取.ipynb</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#0366d6] text-white font-medium shadow-2xs">
                        <FileCode className="w-3.5 h-3.5 text-amber-300" />
                        <span className="truncate">项目介绍.ipynb</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-500 hover:bg-slate-200/60 cursor-pointer">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">zhwiki-2023.txt</span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧 Notebook 内容区（高精度还原截图） */}
                  <div className="flex-1 bg-white overflow-y-auto p-8 border-l border-slate-200 flex flex-col relative">
                    
                    {/* 活动单元格侧边蓝条 */}
                    <div className="absolute left-1 top-8 bottom-8 w-1 bg-[#2196f3] rounded-full"></div>

                    {/* 课件 Notebook 文本内容 */}
                    <div className="max-w-3xl space-y-6 text-slate-800 font-sans pl-2">
                      <h1 className="text-3xl font-black text-slate-900 tracking-tight pb-1">
                        项目一：NLP基础
                      </h1>

                      <div className="space-y-2">
                        <h2 className="text-xl font-bold text-slate-800">
                          项目背景：
                        </h2>
                        <p className="text-[13px] text-slate-700 leading-relaxed indent-2 text-justify">
                          自然语言处理是目前人工智能领域内的一个很重要的方向。它的目的是实现人和计算机程序之间使用自然语言（汉语、英语等语言）进行有效通信。本项目通过四个任务分别介绍了字符串处理、正则表达式、英文文本处理、中文文本处理、分词、词性标注、关键词提取、文本向量化等知识，为接下来的其他NLP项目的学习打好坚实基础。
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-800">
                          任务列表：
                        </h2>
                        <p className="text-[13px] text-slate-600 font-medium">
                          本教学分为4个部分，总计有4份教学任务notebook:
                        </p>
                        <div className="space-y-1.5 pl-2 text-[13px] text-[#0366d6] font-medium">
                          <p className="hover:underline cursor-pointer">任务1: 文本预处理</p>
                          <p className="hover:underline cursor-pointer">任务2: 中文文本处理与解析</p>
                          <p className="hover:underline cursor-pointer">任务3: 关键词提取</p>
                          <p className="hover:underline cursor-pointer">任务4: 文本向量化</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h2 className="text-xl font-bold text-slate-800">
                          文件夹用途说明：
                        </h2>
                        <ul className="list-disc list-inside space-y-1 text-[13px] text-slate-700">
                          <li><span className="font-semibold text-slate-800 font-mono">data:</span> 存放任务所需要的数据集等文件；</li>
                          <li><span className="font-semibold text-slate-800 font-mono">models:</span> 存放任务保存的模型；</li>
                          <li><span className="font-semibold text-slate-800 font-mono">result:</span> 存放实验输出的结果文件。</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 画面未播放时，居中浮动醒目的播放大按钮 */}
                {!isPlaying && (
                  <div 
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center cursor-pointer group z-10 transition-all"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#2f80ed]/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#2f80ed] transition-all">
                      <Play className="w-9 h-9 fill-current ml-1" />
                    </div>
                    <span className="absolute bottom-16 text-white/90 text-sm font-medium tracking-wide bg-black/60 px-4 py-1.5 rounded-full shadow-lg">
                      点击播放本节微课教学视频（{activeStep.title}）
                    </span>
                  </div>
                )}

                {/* 5. 视频播放器控制条 */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-6 pb-2.5 px-4 text-white flex flex-col justify-end transition-opacity duration-200">
                  
                  {/* 可拖拽交互的视频时间轴进度条 */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      setCurrentTimeSec(Math.floor(ratio * totalDurationSec));
                    }}
                    className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full mb-3 cursor-pointer relative group transition-all"
                  >
                    {/* 已播放进度条 */}
                    <div 
                      style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                      className="h-full bg-blue-500 rounded-full relative"
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>

                  {/* 底部控制工具组 */}
                  <div className="flex items-center justify-between text-xs text-white/90">
                    
                    {/* 左侧：播放/暂停、播放时长 */}
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-blue-400 transition-colors p-1 cursor-pointer"
                        title={isPlaying ? '暂停' : '播放'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>

                      {/* 时间显示（截图所示格式：0:00 / 1:09:07） */}
                      <span className="font-mono text-sm tracking-wide text-white">
                        {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
                      </span>
                    </div>

                    {/* 中间信息 */}
                    <div className="hidden md:flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                      <span>Python 3 | Idle</span>
                      <span>Mem: 256.48 / 8192.00 MB</span>
                    </div>

                    {/* 右侧：倍速、音量、全屏 */}
                    <div className="flex items-center space-x-3.5">
                      {/* 倍速切换 */}
                      <div className="flex items-center space-x-1 bg-white/10 px-2 py-0.5 rounded text-[11px]">
                        {[1.0, 1.25, 1.5, 2.0].map(speed => (
                          <button 
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${playbackSpeed === speed ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>

                      {/* 音量调节 */}
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="hover:text-blue-400 transition-colors cursor-pointer"
                        title={isMuted ? '取消静音' : '静音'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* 全屏按钮 */}
                      <button 
                        onClick={() => setIsPlayerFullscreen(!isPlayerFullscreen)}
                        className="hover:text-blue-400 transition-colors cursor-pointer"
                        title="全屏"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ) : activeStep.type === 'lab' ? (
            
            /* 场景 B：实验步骤类型（支持启动界面[截图1]、工程虚拟仿真[截图3]、Jupyter环境[截图2]与入口卡片） */
            labPhase === 'launching' ? (
              /* ================== 子场景 1：启动中界面（参考截图1） ================== */
              <div className="flex-1 flex flex-col relative bg-[#1c2430] overflow-hidden select-none">
                {/* 顶部深色工具条 */}
                <div className="h-9 bg-[#2b333e] flex items-center justify-end px-4 space-x-3 shrink-0 border-b border-black/30 z-20">
                  <button 
                    onClick={() => setIsLabFullscreen(!isLabFullscreen)}
                    className="text-slate-300 hover:text-white p-1 rounded transition-colors cursor-pointer"
                    title={isLabFullscreen ? '退出全屏' : '全屏'}
                  >
                    {isLabFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleExitLabEnvironment}
                    className="text-emerald-400 hover:text-emerald-300 p-1 rounded transition-colors cursor-pointer"
                    title="退出启动"
                  >
                    <Power className="w-4 h-4 stroke-[2.4]" />
                  </button>
                </div>

                {/* 科技感全息实验室背景 */}
                <div 
                  className="flex-1 flex flex-col items-center justify-center relative bg-cover bg-center"
                  style={{ 
                    backgroundImage: "url('/lab_launch_bg.png')",
                    backgroundColor: '#0c1a2e'
                  }}
                >
                  <div className="absolute inset-0 bg-blue-950/40 backdrop-brightness-90"></div>

                  {/* 居中浮动状态卡片与启动指示 */}
                  <div className="flex flex-col items-center z-10 -mt-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* 启动中胶囊条：● 启动中，请稍后... 3s */}
                    <div className="bg-[#4b5563]/85 backdrop-blur-md border border-white/20 px-5 py-1.5 rounded-md flex items-center space-x-2 text-white text-xs font-mono shadow-xl mb-6">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                      <span className="text-[#10b981] font-medium">启动中，请稍后...</span>
                      <span className="text-white/95">{launchCountdown}s</span>
                    </div>

                    {/* 悬浮缩略预览卡片 */}
                    <div className="w-[280px] h-[165px] rounded-lg overflow-hidden border border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.35)] bg-slate-900/90 flex flex-col relative">
                      <div className="h-5 bg-slate-800/95 border-b border-slate-700 flex items-center px-2 space-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400/80"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400/80"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400/80"></div>
                        <span className="text-[9px] text-slate-400 pl-1">
                          {activeLabTool?.iconType === 'simulation' ? 'Virtual Simulation Engine' : 'JupyterLab / AI Container'}
                        </span>
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between font-mono text-[9.5px] text-slate-300">
                        <div className="space-y-1">
                          <div className="text-cyan-400 font-semibold">&gt;&gt; Initializing environment core...</div>
                          <div className="text-slate-400">&gt;&gt; Loading circuit &amp; hardware models [OK]</div>
                          <div className="text-slate-400">&gt;&gt; Connecting simulator websocket daemon [OK]</div>
                          <div className="text-emerald-400">&gt;&gt; Ready. Launching interactive console...</div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-800 pt-1 text-[8px] text-slate-500">
                          <span>Sandbox v3.4.1</span>
                          <span className="text-cyan-400">Node Online</span>
                        </div>
                      </div>
                    </div>

                    {/* 卡片下方文字 */}
                    <div className="mt-4 text-white font-medium text-base tracking-wide drop-shadow-md">
                      {activeLabTool?.name || 'Jupyter'}
                    </div>
                  </div>
                </div>
              </div>
            ) : labPhase === 'running' && activeLabTool?.iconType === 'simulation' ? (
              /* ================== 子场景 2：工程虚拟仿真实验环境（参考截图3） ================== */
              <div className="flex-1 flex flex-col relative bg-white overflow-hidden select-none">
                {/* 顶栏深色 Tab 条 */}
                <div className="h-9 bg-[#2c3440] flex items-center justify-between px-2 shrink-0 border-b border-black/40 z-20">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleExitLabEnvironment}
                      className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white cursor-pointer" 
                      title="返回工具入口"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                    {/* 选项卡 */}
                    <div className="h-7 px-3 bg-[#3a4454] rounded-t flex items-center space-x-2 text-white text-xs border-t-2 border-blue-500 shadow-xs">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">
                        ⬡
                      </div>
                      <span className="font-normal">工程虚拟仿真</span>
                      <button 
                        onClick={handleExitLabEnvironment}
                        className="text-slate-400 hover:text-red-400 ml-1 cursor-pointer"
                        title="关闭仿真环境"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* 右侧全屏与电源按钮 */}
                  <div className="flex items-center space-x-3 pr-2">
                    <button 
                      onClick={() => setIsLabFullscreen(!isLabFullscreen)}
                      className="text-slate-300 hover:text-white p-1 transition-colors cursor-pointer"
                      title={isLabFullscreen ? '退出全屏' : '全屏'}
                    >
                      {isLabFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={handleExitLabEnvironment}
                      className="text-emerald-400 hover:text-emerald-300 p-1 transition-colors cursor-pointer"
                      title="退出仿真环境"
                    >
                      <Power className="w-4 h-4 stroke-[2.4]" />
                    </button>
                  </div>
                </div>

                {/* 顶部操作工具条 (Toolbar) */}
                <div className="h-9 bg-[#f8f9fa] border-b border-[#e9ecef] flex items-center justify-between px-3 text-xs text-slate-600 shrink-0">
                  {/* 左侧操作按钮组 */}
                  <div className="flex items-center space-x-1.5">
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer" title="撤销">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-3.5 w-px bg-slate-300 mx-1"></div>
                    {['对齐', '图层', '成组', '复制', '删除', '清空'].map((item) => (
                      <button key={item} className="px-2 py-0.5 hover:bg-slate-200 rounded text-slate-600 cursor-pointer text-[11px]">
                        {item}
                      </button>
                    ))}
                  </div>

                  {/* 右侧智能体助手与场景切换 */}
                  <div className="flex items-center space-x-3">
                    <div 
                      onClick={() => alert('实验智能体：正在为您监测拓扑连线完整度。当前电路：12V电源供电正常，门禁控制器就绪。')}
                      className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full cursor-pointer border border-blue-200/60 shadow-2xs transition-colors"
                    >
                      <span className="text-[11px] font-medium">实验智能体</span>
                      <span className="text-xs">🤖</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] text-slate-700 cursor-pointer">
                      <span>默认场景</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* 主体区：左侧设备库 + 右侧连线画布 */}
                <div className="flex-1 flex overflow-hidden">
                  {/* 左侧：仿真设备列表 */}
                  <div className="w-52 bg-white border-r border-[#e9ecef] flex flex-col shrink-0">
                    <div className="h-9 px-3 border-b border-[#e9ecef] flex items-center font-bold text-xs text-slate-800">
                      <span className="mr-1.5 text-blue-600">⬡</span> 仿真设备
                    </div>
                    {/* 搜索框 */}
                    <div className="p-2 border-b border-[#e9ecef]">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs">
                        <input 
                          type="text" 
                          value={simSearchText}
                          onChange={(e) => setSimSearchText(e.target.value)}
                          placeholder="请输入组件名" 
                          className="w-full outline-none text-[11px] bg-transparent text-slate-700 placeholder:text-slate-400"
                        />
                        <Search className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                      </div>
                    </div>

                    {/* 分类折叠列表 */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {[
                        { title: '传感器', items: ['红外传感器', '温湿度传感器', '光敏电阻'] },
                        { title: '采集器', items: ['多路采集模块', 'AD转换器'] },
                        { title: 'RFID', items: ['低频读写头', '高频射频卡'] },
                        { title: '其他设备', items: ['12V直流电源', '5V变压器', '蜂鸣器'] },
                        { title: '环境参数', items: ['光照度检测', '烟雾探头'] },
                        { title: '智慧家居', items: ['智能窗帘电机', '遥控中继器'] },
                        { title: '智慧安防', items: ['门禁键盘读卡器', '电磁锁', '网络通信模块'] },
                        { title: '智慧农业', items: ['土壤水分传感器', '灌溉电磁阀'] },
                        { title: '智慧交通', items: ['地磁车辆检测器', '道闸控制器'] },
                        { title: '智慧建筑能耗', items: ['智能电表', '多功能电力仪表'] },
                      ].map((cat) => {
                        const isOpen = expandedSimCategory === cat.title;
                        return (
                          <div key={cat.title}>
                            <div 
                              onClick={() => setExpandedSimCategory(isOpen ? '' : cat.title)}
                              className="px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer font-medium text-slate-700 text-[11.5px]"
                            >
                              <span>{cat.title}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                            {isOpen && (
                              <div className="bg-slate-50/70 px-3 py-1 space-y-1">
                                {cat.items.map((item) => (
                                  <div 
                                    key={item}
                                    onClick={() => alert(`已选择组件：${item}`)}
                                    className="px-2 py-1 rounded hover:bg-blue-50 hover:text-blue-600 cursor-grab text-[11px] text-slate-600 transition-colors"
                                  >
                                    • {item}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 右侧：网格拓扑连线仿真画布 */}
                  <div className="flex-1 flex flex-col bg-[#fdfdfd] relative overflow-hidden">
                    {/* 画布顶栏状态 */}
                    <div className="h-8 bg-white/80 backdrop-blur-xs border-b border-slate-200 flex items-center justify-between px-4 text-xs shrink-0 z-10">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-blue-600 font-medium cursor-pointer">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-500" />
                          连线验证 (已开启)
                          <ChevronDown className="w-3 h-3 ml-0.5" />
                        </div>
                      </div>

                      {/* 中间模拟实验切换开关 */}
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setIsSimRunning(!isSimRunning)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${isSimRunning ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          title="切换模拟实验状态"
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${isSimRunning ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-xs font-medium ${isSimRunning ? 'text-emerald-600' : 'text-slate-500'}`}>
                          模拟实验({isSimRunning ? '已开启' : '已关闭'})
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                        <span className="hover:text-blue-600 cursor-pointer">虚拟仿真助手</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>

                    {/* 画布底图与高仿真拓扑 */}
                    <div 
                      className="flex-1 relative overflow-auto bg-cover bg-no-repeat bg-center"
                      style={{ 
                        backgroundImage: "url('/lab_env_simulation.png')",
                        backgroundSize: '100% 100%'
                      }}
                    >
                      {/* 开启模拟时的动态光效指示层 */}
                      {isSimRunning && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-20 left-[35%] bg-emerald-500/10 border border-emerald-500/30 rounded px-3 py-1 text-[11px] font-mono text-emerald-700 shadow-sm animate-pulse">
                            ⚡ 仿真电流正在流转: 12V 稳压输出正常 | 信号响应延迟 &lt; 2ms
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : labPhase === 'running' ? (
              /* ================== 子场景 3：JupyterLab 容器实验环境（参考截图2） ================== */
              <div className="flex-1 flex flex-col relative bg-white overflow-hidden select-none">
                {/* 顶栏深灰标签栏 */}
                <div className="h-9 bg-[#2c3440] flex items-center justify-between px-2 shrink-0 border-b border-black/40 z-20">
                  <div className="flex items-center h-full">
                    <div className="h-7 px-3 bg-[#3a4454] rounded-t flex items-center space-x-2 text-white text-xs border-t-2 border-blue-500 shadow-xs">
                      <div className="w-3.5 h-3.5 bg-blue-500 rounded-[2px] flex items-center justify-center text-[9px] font-bold text-white">
                        ≡
                      </div>
                      <span className="font-normal truncate max-w-[200px]">人工智能平台-...</span>
                      <button 
                        onClick={handleExitLabEnvironment}
                        className="text-slate-400 hover:text-red-400 ml-1 cursor-pointer"
                        title="关闭环境"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* 右侧：全屏与退出电源按钮 */}
                  <div className="flex items-center space-x-3 pr-2">
                    <button 
                      onClick={() => setIsLabFullscreen(!isLabFullscreen)}
                      className="text-slate-300 hover:text-white p-1 transition-colors cursor-pointer"
                      title={isLabFullscreen ? '退出全屏' : '全屏'}
                    >
                      {isLabFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={handleExitLabEnvironment}
                      className="text-emerald-400 hover:text-emerald-300 p-1 transition-colors cursor-pointer"
                      title="退出实验环境并返回工具列表"
                    >
                      <Power className="w-4 h-4 stroke-[2.4]" />
                    </button>
                  </div>
                </div>

                {/* 菜单栏 (JupyterLab Menu Bar) */}
                <div className="h-7 bg-[#f7f7f7] border-b border-[#e0e0e0] flex items-center justify-between px-2 text-xs text-slate-700 shrink-0">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 relative flex items-center justify-center mr-1">
                      <div className="w-3 h-1.5 border-t-2 border-b-2 border-[#fa8c16] rounded-[50%]"></div>
                      <div className="w-0.5 h-0.5 rounded-full bg-[#fa8c16] absolute top-0.5 right-0.5"></div>
                    </div>
                    {['File', 'Edit', 'View', 'Run', 'Kernel', 'Git', 'Nbgrader', 'Tabs', 'Settings', 'Help'].map(m => (
                      <button key={m} className="px-2 py-0.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer font-normal text-[11.5px]">
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-600 pr-3 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <span>CPU:</span>
                      <div className="w-16 h-2.5 bg-white border border-slate-300 rounded-[2px] overflow-hidden p-[0.5px]">
                        <div className="w-[20%] h-full bg-[#0366d6]"></div>
                      </div>
                      <span>20%</span>
                    </div>
                    <div className="h-3 w-px bg-slate-300"></div>
                    <div>Mem:120 MB</div>
                  </div>
                </div>

                {/* 主工作区 */}
                <div className="flex-1 flex overflow-hidden">
                  {/* 左侧 Activity Bar 窄边栏 */}
                  <div className="w-9 bg-[#f0f0f0] border-r border-[#e0e0e0] flex flex-col items-center py-2 space-y-3 shrink-0 text-slate-600">
                    <button className="w-full py-1.5 border-l-2 border-[#1976d2] text-[#1976d2] flex justify-center bg-white/60">
                      <Folder className="w-4 h-4" />
                    </button>
                    <button className="w-full py-1.5 text-slate-400 hover:text-slate-700 flex justify-center">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="w-full py-1.5 text-slate-400 hover:text-slate-700 flex justify-center">
                      <Code className="w-4 h-4" />
                    </button>
                    <button className="w-full py-1.5 text-slate-400 hover:text-slate-700 flex justify-center">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 左侧 File Browser 文件树列表 */}
                  <div className="w-56 bg-white border-r border-[#e0e0e0] flex flex-col shrink-0">
                    <div className="h-8 border-b border-[#e0e0e0] flex items-center justify-between px-2 text-slate-600">
                      <button className="p-1 hover:bg-slate-100 rounded text-blue-600 font-bold text-sm cursor-pointer" title="新建 Launcher">
                        +
                      </button>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <button className="p-1 hover:bg-slate-100 rounded cursor-pointer" title="新建文件夹">
                          <FolderPlus className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded cursor-pointer" title="上传文件">
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded cursor-pointer" title="刷新列表">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-1.5 border-b border-[#e0e0e0]">
                      <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-0.5 text-xs">
                        <input 
                          type="text" 
                          placeholder="Filter files by name" 
                          className="w-full outline-none text-[11px] text-slate-700 placeholder:text-slate-400"
                        />
                        <Search className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                      </div>
                    </div>

                    <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 border-b border-slate-100 flex items-center">
                      <Folder className="w-3 h-3 text-blue-500 mr-1.5" />
                      /
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <div className="flex items-center justify-between px-2.5 py-1 text-[10px] text-slate-400 font-medium border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center">
                          <span>Name</span>
                          <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                        </div>
                        <span>Last Modified</span>
                      </div>

                      <div className="px-1 py-1">
                        <div className="flex items-center justify-between px-2 py-1 hover:bg-blue-50/80 rounded text-xs cursor-pointer group">
                          <div className="flex items-center text-slate-700 font-normal">
                            <Folder className="w-3.5 h-3.5 text-amber-500 mr-2 fill-amber-500/20" />
                            <span className="text-[11.5px]">Desktop</span>
                          </div>
                          <span className="text-[10px] text-slate-400">a year ago</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1 hover:bg-blue-50/80 rounded text-xs cursor-pointer group">
                          <div className="flex items-center text-slate-700 font-normal">
                            <FileCode className="w-3.5 h-3.5 text-blue-500 mr-2" />
                            <span className="text-[11.5px]">nlp_task_experiment.ipynb</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Just now</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 中间主工作区：Terminal 选项卡与交互控制台 */}
                  <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    <div className="h-7 bg-[#f0f0f0] border-b border-[#e0e0e0] flex items-center px-1 space-x-1 shrink-0">
                      <div className="h-6 px-3 bg-white border-t-2 border-slate-800 border-x border-slate-200 flex items-center space-x-2 text-xs text-slate-800 shadow-2xs">
                        <div className="w-3 h-3 bg-slate-800 rounded-[1px] flex items-center justify-center text-[8px] text-white">
                          &gt;
                        </div>
                        <span className="text-[11px] font-mono text-slate-700">jovyan@dp-pro-ai-jupyter-15396005420-69fc65468d-mzb24: ~</span>
                        <span className="text-slate-400 hover:text-slate-700 cursor-pointer text-xs ml-1">×</span>
                      </div>
                      <button className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded text-xs" title="新建终端/窗口">
                        +
                      </button>
                    </div>

                    <div 
                      className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-white cursor-text"
                      onClick={() => {
                        const inputEl = document.getElementById('jupyter-term-input');
                        if (inputEl) inputEl.focus();
                      }}
                    >
                      {terminalLogs.map((log, index) => (
                        <div key={index} className="mb-2 leading-relaxed">
                          <div>
                            <span className="text-green-600 font-semibold">jovyan@dp-pro-ai-jupyter-15396005420-69fc65468d-mzb24</span>:
                            <span className="text-blue-600 font-semibold">~</span>$ {log.cmd}
                          </div>
                          {log.res && <div className="text-slate-600 whitespace-pre-wrap mt-0.5">{log.res}</div>}
                        </div>
                      ))}

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const cmd = terminalCmd.trim();
                          if (!cmd) return;
                          let response = '';
                          if (cmd === 'ls') {
                            response = 'Desktop/  nlp_task_experiment.ipynb  data/  models/';
                          } else if (cmd === 'pwd') {
                            response = '/home/jovyan';
                          } else if (cmd === 'python --version' || cmd === 'python -V') {
                            response = 'Python 3.10.12 (main, Nov 20 2023, 15:14:05) [GCC 11.4.0]';
                          } else if (cmd === 'clear') {
                            setTerminalLogs([]);
                            setTerminalCmd('');
                            return;
                          } else if (cmd === 'help') {
                            response = '可用命令: ls, pwd, python --version, clear, whoami, help';
                          } else if (cmd === 'whoami') {
                            response = 'jovyan';
                          } else {
                            response = `bash: ${cmd}: command not found. (可尝试输入: ls, pwd, python --version, clear)`;
                          }
                          setTerminalLogs(prev => [...prev, { cmd, res: response }]);
                          setTerminalCmd('');
                        }}
                        className="flex items-center flex-wrap leading-relaxed"
                      >
                        <span className="text-green-600 font-semibold">jovyan@dp-pro-ai-jupyter-15396005420-69fc65468d-mzb24</span>:
                        <span className="text-blue-600 font-semibold">~</span>$&nbsp;
                        <input 
                          id="jupyter-term-input"
                          type="text" 
                          value={terminalCmd}
                          onChange={(e) => setTerminalCmd(e.target.value)}
                          className="flex-1 outline-none bg-transparent font-mono text-xs text-slate-800 border-none p-0 focus:ring-0 min-w-[120px]"
                          autoFocus
                          spellCheck={false}
                        />
                        <span className="inline-block w-1.5 h-3.5 bg-black align-middle animate-pulse ml-0.5"></span>
                      </form>
                    </div>
                  </div>

                  {/* 右侧边栏窄条：Create Assignment */}
                  <div className="w-7 bg-[#f7f7f7] border-l border-[#e0e0e0] flex flex-col items-center py-4 justify-between shrink-0 text-slate-400">
                    <div className="p-1 hover:text-slate-700 cursor-pointer">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[10px] text-slate-500 tracking-widest [writing-mode:vertical-rl] rotate-180 select-none font-medium py-2">
                      Create Assignment
                    </div>
                    <div className="p-1 hover:text-slate-700 cursor-pointer">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* 底部悬浮 AI 小助手机器人 */}
                <div className="fixed bottom-9 right-8 z-30 pointer-events-auto">
                  <div 
                    className="w-10 h-10 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-slate-200 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    title="AI 助教"
                    onClick={() => alert('AI 助教已就绪：您可以随时咨询关于本实验的代码调试与环境配置问题。')}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                      🤖
                    </div>
                  </div>
                </div>

                {/* 底部状态栏 */}
                <div className="h-5 bg-[#f2f2f2] border-t border-[#e0e0e0] flex items-center justify-between px-3 text-[10px] text-slate-500 shrink-0 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1">
                      <span>Simple</span>
                      <span className="w-5 h-2.5 bg-slate-300 rounded-full inline-block relative cursor-pointer">
                        <span className="w-2 h-2 bg-white rounded-full absolute top-[1px] left-[1px]"></span>
                      </span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>Ln 1, Col 1</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span>jovyan@dp-pro-ai-jupyter-15396005420-69fc65468d-mzb24</span>
                    <span className="text-slate-300">|</span>
                    <span>Mem: 120.37 MB</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ================== 子场景 0：实验工具入口卡片列表（参考截图展示多个实验环境） ================== */
              <div className="flex-1 flex flex-col relative bg-[#fcfdfe] overflow-y-auto min-h-0 select-none">
                {/* 顶部居中标题：🛠️ 实验工具 */}
                <div className="pt-16 pb-12 flex items-center justify-center">
                  <div className="flex items-center gap-2.5 text-slate-800 font-bold text-xl tracking-wide">
                    <span className="text-xl">🛠️</span>
                    <span>实验工具</span>
                  </div>
                </div>

                {/* 实验入口卡片列表（并排居中展示多个入口卡片） */}
                <div className="flex-1 flex items-start justify-center px-8 pb-16">
                  <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl">
                    {getLabToolsForStep(activeStep.id).map(tool => (
                      <LabToolCard 
                        key={tool.id} 
                        tool={tool} 
                        onEnter={handleEnterLabEnvironment} 
                      />
                    ))}
                  </div>
                </div>

                {/* 页面右下角：黄色圆形信息图标（参考截图右下角） */}
                <div className="fixed bottom-6 right-8 z-20">
                  <button 
                    className="w-5 h-5 rounded-full bg-[#fa8c16] hover:bg-[#d46b08] text-white flex items-center justify-center text-xs font-serif font-bold italic shadow-xs cursor-pointer transition-transform hover:scale-110"
                    title="实验环境说明与指引"
                    onClick={() => alert('实验环境使用指南：点击卡片右下角“进入实验环境”即可分配容器或进入仿真平台。')}
                  >
                    i
                  </button>
                </div>
              </div>
            )
          ) : (
            
            /* 场景 C：图文步骤类型（原 PPT / 课件浏览） */
            <div className="flex-1 flex flex-col relative bg-[#f5f6f8]">
              {/* 查看器顶栏工具条 */}
              <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0 shadow-xs z-10">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveSidebar(activeSidebar ? null : 'directory')}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer" 
                    title="展开/收起目录"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-slate-300 mx-1"></div>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer" title="全文搜索">
                    <Search className="w-4 h-4" />
                  </button>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center ml-2 border border-slate-300 rounded bg-white overflow-hidden h-7">
                    <input 
                      type="text" 
                      value={currentPage} 
                      onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                      className="w-10 text-center text-xs outline-none h-full border-r border-slate-300" 
                    />
                    <span className="text-xs text-slate-500 px-2 bg-slate-50 h-full flex items-center">/ {totalPages}</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-slate-100 rounded border border-slate-200 h-8">
                  <button className="px-2 text-slate-500 hover:text-slate-800 transition-colors h-full border-r border-slate-200 cursor-pointer">−</button>
                  <div className="flex items-center justify-between w-24 px-2 h-full text-xs bg-white text-slate-700 cursor-pointer">
                    <span>自动缩放</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <button className="px-2 text-slate-500 hover:text-slate-800 transition-colors h-full border-l border-slate-200 cursor-pointer">+</button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer" title="绘图"><PenTool className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer" title="文本"><Type className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer" title="编辑"><Edit2 className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer" title="图片"><ImageIcon className="w-4 h-4" /></button>
                  <div className="h-4 w-px bg-slate-300 mx-1"></div>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer" title="全屏"><Maximize className="w-4 h-4" /></button>
                </div>
              </div>
              
              {/* 画布幻灯片展示区 */}
              <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
                <div className="bg-white shadow-lg rounded-sm overflow-hidden border border-slate-200 max-w-[1000px] w-full aspect-[16/9] relative flex flex-col">
                  
                  {/* 校企合作标识 */}
                  <div className="absolute top-6 right-8 flex flex-col items-end z-10">
                    <div className="flex items-center text-[#183a6a] font-bold text-xl tracking-tight mb-1">
                      <div className="w-6 h-6 mr-2 grid grid-cols-2 gap-0.5 rotate-45 transform">
                        <div className="bg-[#183a6a]"></div>
                        <div className="bg-[#4a8df8]"></div>
                        <div className="bg-[#4a8df8]"></div>
                        <div className="bg-[#183a6a]"></div>
                      </div>
                      新大陆时代科技
                    </div>
                    <div className="text-[#183a6a] font-bold text-sm tracking-wide uppercase">
                      Newland Era Hi-Tech
                    </div>
                  </div>

                  {/* 装饰渐变线条 */}
                  <div className="absolute top-[30%] left-0 w-full h-[50%] flex flex-col justify-center space-y-4 opacity-90 pointer-events-none">
                    <div className="h-6 w-[20%] bg-gradient-to-r from-[#7a4af8]/60 to-[#4adbf8]/40 rounded-r-full -ml-4"></div>
                    <div className="h-10 w-[35%] bg-gradient-to-r from-[#4a8df8] to-[#4adbf8] rounded-r-full"></div>
                    <div className="h-24 w-[90%] bg-gradient-to-r from-[#5a3af8] via-[#4a8df8] to-[#9adbf8]/50 rounded-r-full flex items-center relative">
                      
                      {/* 中央课件标题卡片 */}
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full py-8 px-40 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-50 whitespace-nowrap z-20">
                        <h2 className="text-[44px] font-black text-slate-900 tracking-tight">{activeStep.title}</h2>
                      </div>

                    </div>
                    <div className="h-6 w-[25%] bg-gradient-to-r from-[#4adbf8] to-transparent rounded-r-full ml-10"></div>
                    <div className="h-6 w-[15%] bg-gradient-to-r from-[#4adbf8]/40 to-transparent rounded-r-full -ml-2"></div>
                  </div>

                  {/* 底部胶囊徽标 */}
                  <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-[#3b82f6] text-white px-16 py-4 rounded-full text-[22px] font-medium shadow-md whitespace-nowrap tracking-wide">
                      {activeChapter.chapterTitle}
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-6 text-xs text-slate-400">
                    第 {currentPage} 页 / 共 {totalPages} 页
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 资源预览模态框 */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            {/* 头部 */}
            <div className="px-6 py-4 bg-[#f8faff] border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {previewItem.type === 'video' ? '视频资源' : (previewItem.type === 'manual' ? '手册指南' : (previewItem.type === 'file' ? '资料文件' : '图文资源'))}
                </span>
                <h3 className="text-base font-bold text-slate-800 truncate max-w-[420px]">{previewItem.fullTitle}</h3>
              </div>
              <button 
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-2 text-blue-600">
                  资源说明与目标
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {previewItem.desc}
                </p>
              </div>

              {previewItem.type === 'video' ? (
                <div 
                  onClick={() => {
                    setCurrentStepId('1-4');
                    setIsPlaying(true);
                    triggerSwitchToast('第一章：认识自然语言处理', previewItem.fullTitle);
                    setPreviewItem(null);
                  }}
                  className="aspect-video bg-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center text-white relative group cursor-pointer shadow-md"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                  <span className="mt-3 text-xs text-slate-300">点击在主屏幕中立即开播（时长 {previewItem.duration || '1:09:07'}）</span>
                </div>
              ) : previewItem.type === 'file' ? (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50/60 text-center">
                  <FileDown className="w-10 h-10 text-blue-500 mb-2" />
                  <span className="font-medium text-slate-800 text-sm mb-1">{previewItem.name}</span>
                  <span className="text-xs text-slate-400 mb-4">文件大小: {previewItem.fileSize || '未知'}</span>
                  <button 
                    onClick={() => {
                      alert(`开始下载：${previewItem.name}`);
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors flex items-center cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5 mr-1.5" />
                    立即下载文件
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4 bg-white">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center text-xs text-indigo-700">
                      <FileText className="w-4 h-4 mr-1.5" /> 核心理论知识要点
                    </h5>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                      <li>分词算法的核心评价指标：查准率（Precision）、召回率（Recall）及 OOV未登录词识别率。</li>
                      <li>基于统计语言模型的隐马尔可夫模型（HMM）与维特比（Viterbi）解码算法。</li>
                      <li>停用词表的加载与词频统计过滤机制。</li>
                    </ul>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-900 text-slate-200 font-mono text-xs">
                    <div className="text-slate-400 mb-2">// 示例代码：关键词抽取与TF-IDF加权</div>
                    <pre className="text-emerald-400">
{`import jieba.analyse

sentence = "自然语言处理是计算机科学与人工智能的重要方向。"
keywords = jieba.analyse.extract_tags(sentence, topK=3, withWeight=True)
for word, weight in keywords:
    print(f"{word}: {weight:.4f}")`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-1.5" />
                已记录查阅日志
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-md text-xs text-slate-600 font-medium transition-colors cursor-pointer"
                >
                  关闭
                </button>
                <button 
                  onClick={() => {
                    setCurrentStepId('1-4');
                    setIsPlaying(true);
                    triggerSwitchToast('第一章：认识自然语言处理', previewItem.fullTitle);
                    setPreviewItem(null);
                  }}
                  className="px-4 py-1.5 bg-[#2f80ed] hover:bg-blue-600 rounded-md text-xs text-white font-medium transition-colors shadow-xs cursor-pointer"
                >
                  进入该任务学习
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dbe4f0; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b5c7de; 
        }
      `}</style>
    </div>
  );
}
