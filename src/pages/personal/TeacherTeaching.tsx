import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Network,
  Share2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Calendar,
  Layers,
  FileText,
  User,
  X,
  Send,
  Eye,
  Award,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Bot,
  FlaskConical,
  BookOpen,
  SlidersHorizontal,
  Check,
  FolderTree,
  Sparkles
} from 'lucide-react';

export interface TaskItem {
  id: string;
  name: string;
  type: '练习任务' | '实训任务' | '考试任务';
  status: '进行中' | '已归档';
  auditStatus: '审核通过' | '审核中' | '未通过';
  dispatchTime: string;
  product: string;
  duration: number; // 分钟
  submittedCount: number;
  totalCount: number;
}

// 模拟截图中的真实数据（10 条记录）
const INITIAL_TASKS: TaskItem[] = [
  {
    id: '1',
    name: 'AI学伴-功能演示 1789454686416',
    type: '实训任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2026-9-15 14:44:54',
    product: 'AI学伴产品',
    duration: 1000,
    submittedCount: 0,
    totalCount: 6
  },
  {
    id: '2',
    name: '自然语言处理技术与应用17888240735441',
    type: '实训任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2026-9-8 10:32:03',
    product: 'AI学伴产品',
    duration: 1000,
    submittedCount: 0,
    totalCount: 6
  },
  {
    id: '3',
    name: '智慧园区-虚实验台V1.21781611613917',
    type: '实训任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2026-6-16 20:07:16',
    product: '智慧园区云部',
    duration: 1000,
    submittedCount: 0,
    totalCount: 4
  },
  {
    id: '4',
    name: '硬件模块-任务名称仅针对下发',
    type: '实训任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2025-12-18 21:57:09',
    product: '硬件开发平台',
    duration: 1000,
    submittedCount: 1,
    totalCount: 4
  },
  {
    id: '5',
    name: '智慧水务1765818101176',
    type: '练习任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2025-12-16 01:01:49',
    product: '智慧水务系统',
    duration: 1000,
    submittedCount: 0,
    totalCount: 4
  },
  {
    id: '6',
    name: '硬件模块1765817675729',
    type: '实训任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2025-12-16 00:54:48',
    product: '硬件开发平台',
    duration: 1000,
    submittedCount: 1,
    totalCount: 4
  },
  {
    id: '7',
    name: '计算机专业业务开发-计算机类1765106285345',
    type: '实训任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2025-12-7 19:22:45',
    product: '云端实训产品',
    duration: 1000,
    submittedCount: 1,
    totalCount: 1
  },
  {
    id: '8',
    name: '智慧水务业务开发1765105085376',
    type: '实训任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2025-12-7 18:24:06',
    product: '云端实训产品',
    duration: 1000,
    submittedCount: 0,
    totalCount: 1
  },
  {
    id: '9',
    name: 'AI视觉图像处理业务开发1765102965911',
    type: '实训任务',
    status: '进行中',
    auditStatus: '审核通过',
    dispatchTime: '2025-12-7 10:23:18',
    product: 'AI视觉产品',
    duration: 1000,
    submittedCount: 0,
    totalCount: 1
  },
  {
    id: '10',
    name: '网络安全渗透实训考核20250912001',
    type: '考试任务',
    status: '已归档',
    auditStatus: '审核通过',
    dispatchTime: '2025-09-12 09:00:00',
    product: '网络安全防线产品',
    duration: 120,
    submittedCount: 28,
    totalCount: 28
  }
];

// 教学小节步骤定义（支持细粒度智能体控制）
export interface ChapterTaskStep {
  id: string;
  code: string;
  name: string;
  type: 'experiment' | 'theory';
  agentEnabled: boolean;
  selected: boolean;
}

// 教学章节一级项目节点
export interface ChapterProjectNode {
  id: string;
  title: string;
  collapsed: boolean;
  tasks: ChapterTaskStep[];
}

// 截图 1:1 默认章节树数据（AI学伴-功能演示 4个项目共11节）
const DEFAULT_CHAPTER_PROJECTS: ChapterProjectNode[] = [
  {
    id: 'proj_1',
    title: '项目一：开发环境认知与快速体验',
    collapsed: false,
    tasks: [
      {
        id: 't1_1',
        code: '任务1.1',
        name: 'Jupyter云端实验环境容器构建与快速启动',
        type: 'experiment',
        agentEnabled: true,
        selected: true
      },
      {
        id: 't1_2',
        code: '任务1.2',
        name: '大模型API交互接口连通性测试与参数调试',
        type: 'experiment',
        agentEnabled: true,
        selected: true
      },
      {
        id: 't1_3',
        code: '任务1.3',
        name: 'AI学伴核心交互界面与系统架构导读',
        type: 'theory',
        agentEnabled: false,
        selected: true
      }
    ]
  },
  {
    id: 'proj_2',
    title: '项目二：Python编程语法基础实训',
    collapsed: false,
    tasks: [
      {
        id: 't2_1',
        code: '任务2.1',
        name: 'Python核心数据结构与推导式编程实操',
        type: 'experiment',
        agentEnabled: true,
        selected: true
      },
      {
        id: 't2_2',
        code: '任务2.2',
        name: 'NumPy多维张量运算与数据标准化清洗实践',
        type: 'experiment',
        agentEnabled: true,
        selected: true
      },
      {
        id: 't2_3',
        code: '任务2.3',
        name: '数据科学计算核心算子理论解析',
        type: 'theory',
        agentEnabled: false,
        selected: true
      }
    ]
  },
  {
    id: 'proj_3',
    title: '项目三：文本分词与特征提取实践',
    collapsed: false,
    tasks: [
      {
        id: 't3_1',
        code: '任务3.1',
        name: '基于Jieba与NLTK的中英文分词与停用词过滤',
        type: 'experiment',
        agentEnabled: true,
        selected: true
      },
      {
        id: 't3_2',
        code: '任务3.2',
        name: 'TF-IDF特征提取算法实现与词云可视化',
        type: 'experiment',
        agentEnabled: true,
        selected: true
      },
      {
        id: 't3_3',
        code: '任务3.3',
        name: '自然语言特征空间向量表征机理',
        type: 'theory',
        agentEnabled: false,
        selected: true
      }
    ]
  },
  {
    id: 'proj_4',
    title: '项目四：分类算法实操与自动评测',
    collapsed: false,
    tasks: [
      {
        id: 't4_1',
        code: '任务4.1',
        name: '基于逻辑回归与SVM的文本意图分类模型训练',
        type: 'experiment',
        agentEnabled: true,
        selected: true
      },
      {
        id: 't4_2',
        code: '任务4.2',
        name: '模型准确率召回率全指标测评与调优',
        type: 'experiment',
        agentEnabled: true,
        selected: true
      }
    ]
  }
];

const CLASS_OPTIONS = [
  '人工智能2101班',
  '人工智能2102班',
  '大数据应用2101班',
  '软件工程2103班',
  '物联网工程2201班'
];

const STUDENT_SELECT_OPTIONS = [
  '全选（当前班级全部学生 30人）',
  '第一实验小组 (15人)',
  '第二实验小组 (15人)',
  '学业攻坚小组 (6人)'
];

const COURSE_SELECT_OPTIONS = [
  'AI学伴-功能演示（AI学伴产品）',
  '自然语言处理技术与应用（AI学伴产品）',
  '智慧园区-虚拟实验台（智慧园区云部）',
  '智慧水务业务开发（智慧水务系统）',
  '硬件模块开发实践（硬件开发平台）'
];

// 预设下发选项数据（联动）
const COURSE_OPTIONS = [
  {
    id: 'c1',
    name: 'AI学伴-功能演示 1789454686416',
    product: 'AI学伴产品',
    defaultType: '实训任务',
    defaultDuration: 1000,
    chapters: [
      '项目一：开发环境认知与快速体验',
      '项目二：Python编程语法基础实训',
      '项目三：文本分词与特征提取实践',
      '项目四：分类算法实操与自动评测'
    ]
  },
  {
    id: 'c2',
    name: '自然语言处理技术与应用17888240735441',
    product: 'AI学伴产品',
    defaultType: '实训任务',
    defaultDuration: 1000,
    chapters: [
      '项目一：NLTK与Jieba分词实战',
      '项目二：Word2Vec与词向量空间建模',
      '项目三：BiLSTM情感倾向分析',
      '项目四：Transformer编码器构建'
    ]
  },
  {
    id: 'c3',
    name: '智慧园区-虚实验台V1.21781611613917',
    product: '智慧园区云部',
    defaultType: '实训任务',
    defaultDuration: 1000,
    chapters: [
      '模块一：3D虚实映射底座搭建',
      '模块二：环境感知传感器驱动调试',
      '模块三：安防摄像头视频流推流',
      '模块四：能源能耗负荷综合调度'
    ]
  },
  {
    id: 'c4',
    name: '智慧水务业务开发1765105085376',
    product: '智慧水务系统',
    defaultType: '练习任务',
    defaultDuration: 1000,
    chapters: [
      '任务一：水质监测网关MQTT配置',
      '任务二：流量水压预警算法构建',
      '任务三：泵房自动化启停仿真'
    ]
  },
  {
    id: 'c5',
    name: '硬件模块-任务名称仅针对下发',
    product: '硬件开发平台',
    defaultType: '实训任务',
    defaultDuration: 1000,
    chapters: [
      '实验一：嵌入式GPIO与中断服务实验',
      '实验二：串口通信与波特率校验',
      '实验三：I2C总线温湿度采集'
    ]
  }
];

const ORG_LIST = [
  '信息工程学院 / 人工智能系',
  '计算机科学与技术学院 / 软件工程教研室',
  '物联网与智能互联产业学院',
  '大数据与智能控制教研组'
];

const STUDENT_LIST = [
  '全选（当前机构全部学生 120人）',
  '人工智能2101班 (30人)',
  '人工智能2102班 (28人)',
  '计算机应用2101班 (32人)',
  '物联网工程2201班 (30人)'
];

export default function TeacherTeaching() {
  // 顶部 Tab 状态
  const [taskCategory, setTaskCategory] = useState<'全部' | '练习任务' | '实训任务' | '考试任务'>('全部');
  const [taskStatus, setTaskStatus] = useState<'进行中' | '已归档'>('进行中');

  // 搜索关键字
  const [searchKeyword, setSearchKeyword] = useState('');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [jumpPage, setJumpPage] = useState('1');

  // 任务数据
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  // 活跃操作卡片下拉菜单
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // 模态框状态
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [gradingTask, setGradingTask] = useState<TaskItem | null>(null);
  const [atlasTask, setAtlasTask] = useState<TaskItem | null>(null);

  // 下发任务完整表单状态（1:1严格还原截图，大部分项预置丰富合理的默认值）
  const [envType, setEnvType] = useState<'cloud'>('cloud');
  const [selectedClass, setSelectedClass] = useState('人工智能2101班');
  const [selectedStudentGroup, setSelectedStudentGroup] = useState('全选（当前班级全部学生 30人）');
  const [selectedCourseResource, setSelectedCourseResource] = useState('AI学伴-功能演示（AI学伴产品）');
  const [timeType, setTimeType] = useState<'duration' | 'deadline'>('duration');
  const [taskDuration, setTaskDuration] = useState('1000');
  const [taskDeadline, setTaskDeadline] = useState('2026-10-31 23:59');
  const [dispatchTaskName, setDispatchTaskName] = useState('AI学伴-功能演示 202609172024');
  const [dispatchTaskType, setDispatchTaskType] = useState<'实训任务' | '练习任务' | '考试任务'>('实训任务');
  const [toastMessage, setToastMessage] = useState('');

  // 教学章节树形状态（每个实验步骤均可独立配置智能体显隐）
  const [chapterProjects, setChapterProjects] = useState<ChapterProjectNode[]>(DEFAULT_CHAPTER_PROJECTS);

  // 批改作业模拟名单
  const mockSubmissions = useMemo(() => {
    if (!gradingTask) return [];
    const count = gradingTask.totalCount;
    const submitted = gradingTask.submittedCount;
    const students = [
      { name: '张子轩', id: '20220101', score: 92, submitted: true, submitTime: '2026-09-16 10:20:15', status: '已批改' },
      { name: '李雨桐', id: '20220102', score: null, submitted: true, submitTime: '2026-09-16 11:45:32', status: '待批改' },
      { name: '王俊杰', id: '20220103', score: null, submitted: false, submitTime: '-', status: '未提交' },
      { name: '陈思琪', id: '20220104', score: 88, submitted: true, submitTime: '2026-09-15 17:12:00', status: '已批改' },
      { name: '杨浩然', id: '20220105', score: null, submitted: false, submitTime: '-', status: '未提交' },
      { name: '赵若涵', id: '20220106', score: 95, submitted: true, submitTime: '2026-09-15 15:30:22', status: '已批改' }
    ];
    return students.slice(0, count).map((stu, index) => ({
      ...stu,
      submitted: index < submitted,
      status: index < submitted ? (stu.score !== null ? '已批改' : '待批改') : '未提交'
    }));
  }, [gradingTask]);

  // 状态计数
  const activeCount = useMemo(() => tasks.filter(t => t.status === '进行中').length, [tasks]);
  const archivedCount = useMemo(() => tasks.filter(t => t.status === '已归档').length, [tasks]);

  // 数据过滤逻辑
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // 1. 分类筛选
      if (taskCategory !== '全部' && t.type !== taskCategory) {
        return false;
      }
      // 2. 状态筛选
      if (t.status !== taskStatus) {
        return false;
      }
      // 3. 关键字搜索（任务名称、归属产品、ID等）
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.trim().toLowerCase();
        const matchName = t.name.toLowerCase().includes(keyword);
        const matchProduct = t.product.toLowerCase().includes(keyword);
        const matchType = t.type.toLowerCase().includes(keyword);
        if (!matchName && !matchProduct && !matchType) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, taskCategory, taskStatus, searchKeyword]);

  // 分页计算
  const totalItems = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const currentList = useMemo(() => {
    const start = (currentPageSafe - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPageSafe, pageSize]);

  // 章节树统计
  const totalChaptersCount = useMemo(() => {
    return chapterProjects.reduce((acc, p) => acc + p.tasks.length, 0);
  }, [chapterProjects]);

  const selectedChaptersCount = useMemo(() => {
    return chapterProjects.reduce((acc, p) => acc + p.tasks.filter(t => t.selected).length, 0);
  }, [chapterProjects]);

  const isAllChaptersSelected = totalChaptersCount > 0 && selectedChaptersCount === totalChaptersCount;
  const isAllProjectsCollapsed = chapterProjects.length > 0 && chapterProjects.every(p => p.collapsed);

  // 树操作：切换单项智能体显隐（实验步骤独立控制）
  const handleToggleAgent = (projectId: string, taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChapterProjects(prev =>
      prev.map(proj => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          tasks: proj.tasks.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, agentEnabled: !task.agentEnabled };
          })
        };
      })
    );
  };

  // 树操作：勾选/取消小节任务
  const handleToggleTaskSelect = (projectId: string, taskId: string) => {
    setChapterProjects(prev =>
      prev.map(proj => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          tasks: proj.tasks.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, selected: !task.selected };
          })
        };
      })
    );
  };

  // 树操作：项目级全选/反选
  const handleToggleProjectSelect = (projectId: string) => {
    setChapterProjects(prev =>
      prev.map(proj => {
        if (proj.id !== projectId) return proj;
        const allSelected = proj.tasks.every(t => t.selected);
        return {
          ...proj,
          tasks: proj.tasks.map(task => ({ ...task, selected: !allSelected }))
        };
      })
    );
  };

  // 树操作：项目折叠/展开
  const handleToggleProjectCollapse = (projectId: string) => {
    setChapterProjects(prev =>
      prev.map(proj => (proj.id === projectId ? { ...proj, collapsed: !proj.collapsed } : proj))
    );
  };

  // 树操作：全部全选 / 取消全选
  const handleToggleSelectAllChapters = () => {
    const nextSelect = !isAllChaptersSelected;
    setChapterProjects(prev =>
      prev.map(proj => ({
        ...proj,
        tasks: proj.tasks.map(t => ({ ...t, selected: nextSelect }))
      }))
    );
  };

  // 树操作：全部折叠 / 全部展开
  const handleToggleCollapseAll = () => {
    const nextCollapsed = !isAllProjectsCollapsed;
    setChapterProjects(prev =>
      prev.map(proj => ({
        ...proj,
        collapsed: nextCollapsed
      }))
    );
  };

  // 切换课程资源时自动联动任务名称
  const handleSelectCourse = (courseName: string) => {
    setSelectedCourseResource(courseName);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const cleanName = courseName.split('（')[0];
    setDispatchTaskName(`${cleanName} ${dateStr}`);
  };

  // 打开下发弹窗时初始化表单，赋予完备的默认值
  const handleOpenDispatchModal = () => {
    setSelectedClass('人工智能2101班');
    setSelectedStudentGroup('全选（当前班级全部学生 30人）');
    setSelectedCourseResource('AI学伴-功能演示（AI学伴产品）');
    setTimeType('duration');
    setTaskDuration('1000');
    setDispatchTaskName('AI学伴-功能演示 202609172024');
    setDispatchTaskType('实训任务');
    // 章节树初始化：默认全部勾选，实验步骤默认开启智能体
    setChapterProjects(
      DEFAULT_CHAPTER_PROJECTS.map(proj => ({
        ...proj,
        collapsed: false,
        tasks: proj.tasks.map(t => ({
          ...t,
          selected: true,
          agentEnabled: t.type === 'experiment'
        }))
      }))
    );
    setIsDispatchModalOpen(true);
  };

  // 处理下发新任务
  const handleCreateTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dispatchTaskName.trim()) {
      alert('请输入任务名称');
      return;
    }
    if (selectedChaptersCount === 0) {
      alert('请至少选择一个教学章节任务小节！');
      return;
    }

    const newTask: TaskItem = {
      id: Date.now().toString(),
      name: dispatchTaskName.trim(),
      type: dispatchTaskType || '实训任务',
      status: '进行中',
      auditStatus: '审核通过',
      dispatchTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      product: selectedCourseResource.includes('智慧水务')
        ? '智慧水务系统'
        : selectedCourseResource.includes('智慧园区')
        ? '智慧园区云部'
        : selectedCourseResource.includes('硬件')
        ? '硬件开发平台'
        : 'AI学伴产品',
      duration: parseInt(taskDuration, 10) || 1000,
      submittedCount: 0,
      totalCount: selectedStudentGroup.includes('28人')
        ? 28
        : selectedStudentGroup.includes('32人')
        ? 32
        : 30
    };

    setTasks([newTask, ...tasks]);
    setIsDispatchModalOpen(false);
    setToastMessage(`任务《${dispatchTaskName}》创建并下发成功！已授权 ${selectedChaptersCount} 节教学小节。`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 归档或删除
  const handleArchiveTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === '进行中' ? '已归档' : '进行中' } : t));
    setActiveMenuId(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setActiveMenuId(null);
  };

  // 渲染环形进度条组件（完全还原截图中的圆形设计）
  const renderCircularProgress = (submitted: number, total: number) => {
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
    const radius = 21;
    const strokeWidth = 3.5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 50 50">
          {/* 背景圆环 */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* 进度圆环 - 截图中的绿色环形 */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="#52c41a"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center">
          <span className="text-[10px] font-semibold text-slate-700 tracking-tighter">
            {submitted}/{total}
          </span>
          <span className="text-[8px] text-slate-400 mt-0.5 scale-90 origin-center">
            已提交
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f5f7fa] h-full overflow-hidden text-slate-800" onClick={() => setActiveMenuId(null)}>
      {/* 顶部白色容器：包含一级分类与二级状态Tab */}
      <div className="bg-white border-b border-slate-200 shrink-0 px-6 pt-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {/* 一级分类导航 */}
        <div className="flex items-center space-x-7 text-sm font-medium pb-2.5">
          {(['全部', '练习任务', '实训任务', '考试任务'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setTaskCategory(cat);
                setCurrentPage(1);
              }}
              className={`transition-colors cursor-pointer text-xs md:text-sm ${
                taskCategory === cat
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 二级状态导航（进行中 / 已归档） */}
        <div className="flex items-center space-x-6 text-xs md:text-sm border-t border-slate-100 pt-1">
          <button
            onClick={() => {
              setTaskStatus('进行中');
              setCurrentPage(1);
            }}
            className={`py-2 relative font-medium transition-colors cursor-pointer flex items-center ${
              taskStatus === '进行中'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>进行中 ({activeCount})</span>
            {taskStatus === '进行中' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setTaskStatus('已归档');
              setCurrentPage(1);
            }}
            className={`py-2 relative font-medium transition-colors cursor-pointer flex items-center ${
              taskStatus === '已归档'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>已归档 ({archivedCount})</span>
            {taskStatus === '已归档' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 操作工具栏：下发任务按钮 + 搜索框 */}
      <div className="px-6 py-3.5 flex items-center justify-between shrink-0">
        {/* 左侧下发任务按钮 */}
        <button
          onClick={handleOpenDispatchModal}
          className="inline-flex items-center px-3.5 py-1.5 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium transition-colors shadow-xs cursor-pointer group"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-blue-600 group-hover:scale-110 transition-transform" />
          下发任务
        </button>

        {/* 右侧搜索框（完全复刻截图：请输入任务名称/账户名/学生姓名） */}
        <div className="relative w-72">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="请输入任务名称/账户名/学生姓名"
            className="w-full bg-white border border-slate-300 rounded text-xs pl-3 pr-8 py-1.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
            title="搜索"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3列网格卡片展示区 */}
      <div className="flex-1 px-6 pb-2 overflow-y-auto">
        {currentList.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-slate-400 bg-white rounded-lg border border-slate-200/80 shadow-xs mt-2">
            <FileText className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
            <p className="text-xs text-slate-500">暂无符合条件的教学任务</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentList.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-md border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-4.5 flex flex-col justify-between relative group"
              >
                {/* 卡片头部：任务标题 + 审核状态 + 更多按钮 */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div className="flex-1 pr-2">
                    <h3
                      className="text-xs font-semibold text-slate-800 line-clamp-1 hover:text-blue-600 cursor-pointer"
                      title={task.name}
                    >
                      {task.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="inline-flex items-center text-[11px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                      {task.auditStatus}
                    </span>

                    {/* 更多菜单按钮 */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                        className="p-0.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>

                      {/* 菜单弹层 */}
                      {activeMenuId === task.id && (
                        <div className="absolute right-0 top-6 w-28 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 text-xs text-slate-600 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => {
                              setIsDispatchModalOpen(true);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600"
                          >
                            编辑任务
                          </button>
                          <button
                            onClick={() => handleArchiveTask(task.id)}
                            className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {task.status === '进行中' ? '归档任务' : '恢复进行'}
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                          >
                            删除任务
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 卡片主体：左侧下发信息，右侧操作与统计 */}
                <div className="py-3 flex items-center justify-between">
                  {/* 左侧元信息 */}
                  <div className="space-y-1.5 text-[11px] text-slate-500 flex-1 pr-3">
                    <div className="flex items-center text-slate-600">
                      <span className="text-slate-400 mr-1">下发时间:</span>
                      <span>{task.dispatchTime}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <span className="text-slate-400 mr-1">任务类型:</span>
                      <span>{task.type}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <span className="text-slate-400 mr-1">归属产品:</span>
                      <span className="truncate max-w-[130px]">{task.product}</span>
                    </div>
                    <div className="pt-2 text-[11px] font-medium text-slate-700">
                      {task.duration}分钟
                    </div>
                  </div>

                  {/* 右侧：环形进度（批改作业） + 拓扑图标（查看数谱） */}
                  <div className="flex items-center space-x-4 shrink-0 pl-2">
                    {/* 环形进度圈 & 批改作业 */}
                    <div className="flex flex-col items-center justify-center">
                      {renderCircularProgress(task.submittedCount, task.totalCount)}
                      <button
                        onClick={() => setGradingTask(task)}
                        className="mt-1.5 text-[11px] text-slate-600 hover:text-blue-600 font-normal cursor-pointer transition-colors"
                      >
                        批改作业
                      </button>
                    </div>

                    {/* 查看数谱 / 数据拓扑图标 */}
                    <div className="flex flex-col items-center justify-center">
                      <button
                        onClick={() => setAtlasTask(task)}
                        className="w-12 h-12 rounded-full border border-slate-200/90 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer group/icon shadow-2xs"
                        title="查看知识与技能数谱"
                      >
                        <Network className="w-5 h-5 text-slate-600 group-hover/icon:text-blue-600 transition-colors" />
                      </button>
                      <button
                        onClick={() => setAtlasTask(task)}
                        className="mt-1.5 text-[11px] text-slate-600 hover:text-blue-600 font-normal cursor-pointer transition-colors"
                      >
                        查看数谱
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部经典分页器（1:1 复刻截图：共10条 9条/页 ‹ 1 2 › 前往 1 页） */}
      <div className="px-6 py-2.5 bg-white border-t border-slate-200 shrink-0 flex items-center justify-end space-x-3 text-xs text-slate-600 select-none">
        {/* 总条数 */}
        <span>共 {totalItems} 条</span>

        {/* 每页条数下拉选择 */}
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value={9}>9条/页</option>
            <option value={18}>18条/页</option>
            <option value={30}>30条/页</option>
          </select>
        </div>

        {/* 上一页 */}
        <button
          disabled={currentPageSafe <= 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          className={`p-1 rounded border border-slate-300 flex items-center justify-center transition-colors ${
            currentPageSafe <= 1
              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
              : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* 页码按钮 */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === currentPageSafe;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-6 h-6 rounded text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* 下一页 */}
        <button
          disabled={currentPageSafe >= totalPages}
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          className={`p-1 rounded border border-slate-300 flex items-center justify-center transition-colors ${
            currentPageSafe >= totalPages
              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
              : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
          }`}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* 前往页 */}
        <div className="flex items-center space-x-1 pl-1">
          <span>前往</span>
          <input
            type="text"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = parseInt(jumpPage, 10);
                if (!isNaN(target) && target >= 1 && target <= totalPages) {
                  setCurrentPage(target);
                }
              }
            }}
            className="w-8 border border-slate-300 rounded text-center py-0.5 text-xs outline-none focus:border-blue-500 bg-white"
          />
          <span>页</span>
        </div>
      </div>

      {/* 全局操作反馈 Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] bg-emerald-600 text-white px-4 py-2.5 rounded shadow-lg text-xs font-medium flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 弹窗1：下发教学任务模态框（1:1严格高保真复刻用户截图设计） */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-2xs flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-200/80 flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            {/* 弹窗顶部标头 */}
            <div className="px-8 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
              <div className="flex items-start space-x-3">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block mt-0.5" />
                <div>
                  <h3 className="font-bold text-base text-slate-900 tracking-tight">下发教学任务</h3>
                  <p className="text-xs text-slate-400 mt-0.5">面向指定班级一键配置教学实验与任务，支持章节粒度精细化智能体授权</p>
                </div>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer p-1.5 rounded-lg transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 左右分栏主体区域 */}
            <div className="flex-1 overflow-y-auto px-8 py-5 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white">
              {/* 左侧一栏：基础信息配置（占比 5 列） */}
              <div className="lg:col-span-5 space-y-4 pr-1">
                {/* 标头 */}
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-800 font-semibold text-xs">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    <span>基础信息配置</span>
                  </div>
                  <span className="text-[11px] text-slate-400">带 * 为必填项</span>
                </div>

                {/* 实验环境 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>实验环境:
                  </label>
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border-2 border-blue-500 bg-blue-50/60 text-blue-600 text-xs font-medium cursor-pointer shadow-2xs">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-700">云实验环境</span>
                  </div>
                </div>

                {/* 班级 与 学生 并排网格 */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>班级:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full h-9 pl-3 pr-8 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer shadow-2xs"
                      >
                        {CLASS_OPTIONS.map((cls) => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>学生:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedStudentGroup}
                        onChange={(e) => setSelectedStudentGroup(e.target.value)}
                        className="w-full h-9 pl-3 pr-8 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer truncate shadow-2xs"
                      >
                        {STUDENT_SELECT_OPTIONS.map((stu) => (
                          <option key={stu} value={stu}>{stu}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 课程 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>课程:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCourseResource}
                      onChange={(e) => handleSelectCourse(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer shadow-2xs"
                    >
                      {COURSE_SELECT_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 时间类型 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">时间类型:</label>
                  <div className="flex items-center space-x-6 h-8">
                    <label className="inline-flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="timeType"
                        checked={timeType === 'duration'}
                        onChange={() => setTimeType('duration')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <span>设置任务时长</span>
                    </label>
                    <label className="inline-flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="timeType"
                        checked={timeType === 'deadline'}
                        onChange={() => setTimeType('deadline')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <span>设置任务截止时间</span>
                    </label>
                  </div>
                </div>

                {/* 任务时长（分钟） */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      <span className="text-red-500 mr-1">*</span>
                      {timeType === 'duration' ? '任务时长 (分钟):' : '任务截止时间:'}
                    </label>
                    {timeType === 'duration' && (
                      <span className="text-[11px] text-slate-500">
                        预计消耗时长: <span className="text-blue-600 font-bold">{taskDuration || 0} 分钟</span>
                      </span>
                    )}
                  </div>
                  {timeType === 'duration' ? (
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={taskDuration}
                        onChange={(e) => setTaskDuration(e.target.value)}
                        className="w-full h-9 pl-3 pr-12 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                        分钟
                      </span>
                    </div>
                  ) : (
                    <input
                      type="datetime-local"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                    />
                  )}
                </div>

                {/* 任务名称 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>任务名称:
                  </label>
                  <input
                    type="text"
                    required
                    value={dispatchTaskName}
                    onChange={(e) => setDispatchTaskName(e.target.value)}
                    placeholder="请输入任务名称"
                    className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
                  />
                </div>

                {/* 任务类型 */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>任务类型:
                  </label>
                  <div className="relative">
                    <select
                      value={dispatchTaskType}
                      onChange={(e) => setDispatchTaskType(e.target.value as any)}
                      required
                      className="w-full h-9 pl-3 pr-8 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer shadow-2xs"
                    >
                      <option value="实训任务">实训任务</option>
                      <option value="练习任务">练习任务</option>
                      <option value="考试任务">考试任务</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 右侧一栏：教学章节树形列表（占比 7 列） */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                {/* 标头区域 */}
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <FolderTree className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-800">
                      <span className="text-red-500 mr-1">*</span>教学章节树形列表
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200/60">
                      已选 {selectedChaptersCount} / {totalChaptersCount} 节
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleToggleSelectAllChapters}
                      className="px-2.5 py-1 rounded border border-slate-200 hover:border-blue-300 text-[11px] font-medium text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50/30 transition-colors cursor-pointer shadow-2xs"
                    >
                      {isAllChaptersSelected ? '取消全选' : '全选'}
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleCollapseAll}
                      className="px-2.5 py-1 rounded border border-slate-200 hover:border-blue-300 text-[11px] font-medium text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50/30 transition-colors cursor-pointer shadow-2xs"
                    >
                      {isAllProjectsCollapsed ? '全部展开' : '全部折叠'}
                    </button>
                  </div>
                </div>

                {/* 树形卡片滚动列表容器 */}
                <div className="flex-1 max-h-[410px] overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                  {chapterProjects.map((project) => {
                    const projectTotal = project.tasks.length;
                    const projectSelected = project.tasks.filter(t => t.selected).length;
                    const isProjectAllSelected = projectTotal > 0 && projectSelected === projectTotal;
                    const isProjectPartial = projectSelected > 0 && projectSelected < projectTotal;

                    return (
                      <div
                        key={project.id}
                        className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
                      >
                        {/* 项目父节点头部 */}
                        <div className="px-3.5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between select-none">
                          <div className="flex items-center space-x-2.5">
                            {/* 展开/折叠箭头 */}
                            <button
                              type="button"
                              onClick={() => handleToggleProjectCollapse(project.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/50 transition-colors cursor-pointer"
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  project.collapsed ? '-rotate-90' : ''
                                }`}
                              />
                            </button>

                            {/* 项目级全选复选框 */}
                            <input
                              type="checkbox"
                              checked={isProjectAllSelected}
                              ref={(el) => {
                                if (el) el.indeterminate = isProjectPartial;
                              }}
                              onChange={() => handleToggleProjectSelect(project.id)}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />

                            {/* 项目名称 */}
                            <span
                              onClick={() => handleToggleProjectCollapse(project.id)}
                              className="text-xs font-semibold text-slate-800 cursor-pointer hover:text-blue-600"
                            >
                              {project.title}
                            </span>
                          </div>

                          {/* 项目内小节数统计 */}
                          <span className="text-[11px] text-slate-400 font-medium">
                            {projectSelected}/{projectTotal} 节
                          </span>
                        </div>

                        {/* 项目子任务列表 */}
                        {!project.collapsed && (
                          <div className="divide-y divide-slate-100 bg-white">
                            {project.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                              >
                                {/* 左侧：复选框 + 任务标题 + 类型标签 */}
                                <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-3">
                                  <input
                                    type="checkbox"
                                    checked={task.selected}
                                    onChange={() => handleToggleTaskSelect(project.id, task.id)}
                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                                  />
                                  <span
                                    onClick={() => handleToggleTaskSelect(project.id, task.id)}
                                    className="text-xs text-slate-700 truncate cursor-pointer select-none"
                                    title={`${task.code}: ${task.name}`}
                                  >
                                    <span className="font-semibold text-slate-800 mr-1">{task.code}:</span>
                                    {task.name}
                                  </span>

                                  {/* 类型 Badge */}
                                  {task.type === 'experiment' ? (
                                    <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                                      <FlaskConical className="w-3 h-3 text-emerald-600" />
                                      <span>实验</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                                      <BookOpen className="w-3 h-3 text-slate-500" />
                                      <span>理论</span>
                                    </span>
                                  )}
                                </div>

                                {/* 右侧：智能体授权开关（每个实验步骤均可单独设置显示隐藏） */}
                                {task.type === 'experiment' && (
                                  <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-blue-50/70 border border-blue-100/80 text-blue-600 shrink-0 shadow-2xs">
                                    <Bot className="w-3.5 h-3.5 text-blue-600" />
                                    <span className="text-[11px] font-medium text-blue-700 select-none">智能体</span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleToggleAgent(project.id, task.id, e)}
                                      title={task.agentEnabled ? '已开启智能体（点击关闭）' : '已隐藏智能体（点击开启）'}
                                      className={`relative inline-flex h-4 w-7.5 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                        task.agentEnabled ? 'bg-blue-600' : 'bg-slate-300'
                                      }`}
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ${
                                          task.agentEnabled ? 'translate-x-4' : 'translate-x-0.5'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 底部温馨提示条 */}
                <div className="flex items-center space-x-2 px-3.5 py-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80 text-blue-700 text-xs shadow-2xs">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-normal text-[11px] leading-tight">
                    提示：实验步骤类型默认开启实验智能体，支持单独关闭
                  </span>
                </div>
              </div>
            </div>

            {/* 底部汇总栏与操作按钮（Footer） */}
            <div className="px-8 py-3.5 bg-slate-50/80 border-t border-slate-200 shrink-0 flex items-center justify-between">
              {/* 左侧实时摘要信息 */}
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>目标班级：<strong className="font-semibold text-slate-800">{selectedClass}</strong></span>
                <span className="text-slate-300">｜</span>
                <span>已选章节：<strong className="font-bold text-blue-600">{selectedChaptersCount} 节</strong></span>
                <span className="text-slate-300">｜</span>
                <span>任务类型：<strong className="font-semibold text-slate-800">{dispatchTaskType}</strong></span>
              </div>

              {/* 右侧操作按钮 */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-2xs"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateTask()}
                  className="inline-flex items-center space-x-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>创建并下发任务</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗2：批改作业模态框 */}
      {gradingTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            {/* 弹窗头部 */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
              <div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-sm text-slate-800">批改作业与评测</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{gradingTask.name}</p>
              </div>
              <button
                onClick={() => setGradingTask(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 统计指标卡 */}
            <div className="px-5 py-3 grid grid-cols-3 gap-3 bg-white border-b border-slate-100 shrink-0">
              <div className="bg-blue-50/60 p-2.5 rounded border border-blue-100 text-center">
                <div className="text-[11px] text-blue-600 font-medium">总应交人数</div>
                <div className="text-base font-bold text-blue-900 mt-0.5">{gradingTask.totalCount} 人</div>
              </div>
              <div className="bg-emerald-50/60 p-2.5 rounded border border-emerald-100 text-center">
                <div className="text-[11px] text-emerald-600 font-medium">已提交人数</div>
                <div className="text-base font-bold text-emerald-900 mt-0.5">{gradingTask.submittedCount} 人</div>
              </div>
              <div className="bg-amber-50/60 p-2.5 rounded border border-amber-100 text-center">
                <div className="text-[11px] text-amber-600 font-medium">待批改</div>
                <div className="text-base font-bold text-amber-900 mt-0.5">
                  {Math.max(0, gradingTask.submittedCount - 1)} 人
                </div>
              </div>
            </div>

            {/* 作业提交列表 */}
            <div className="flex-1 p-5 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium pb-2">
                    <th className="pb-2">学号</th>
                    <th className="pb-2">姓名</th>
                    <th className="pb-2">提交状态</th>
                    <th className="pb-2">提交时间</th>
                    <th className="pb-2">评分</th>
                    <th className="pb-2 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        当前暂无学生作答记录
                      </td>
                    </tr>
                  ) : (
                    mockSubmissions.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 font-mono text-slate-600">{student.id}</td>
                        <td className="py-2.5 font-medium text-slate-800">{student.name}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              student.status === '已批改'
                                ? 'bg-emerald-50 text-emerald-600'
                                : student.status === '待批改'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-500 font-mono text-[11px]">{student.submitTime}</td>
                        <td className="py-2.5">
                          {student.score !== null ? (
                            <span className="font-semibold text-blue-600">{student.score} 分</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-2.5 text-right">
                          {student.submitted ? (
                            <button
                              onClick={() => alert(`正在调取 [${student.name}] 的在线实训实验记录与代码...`)}
                              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                              批阅打分
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`已向 [${student.name}] 发送作业催交通知`)}
                              className="text-slate-400 hover:text-blue-500 cursor-pointer"
                            >
                              催交
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 弹窗底部 */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
              <button
                onClick={() => setGradingTask(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗3：查看数谱（知识与技能雷达图谱） */}
      {atlasTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/50 shrink-0">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-sm text-slate-800">班级知识与技能数谱</h3>
              </div>
              <button
                onClick={() => setAtlasTask(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <div className="font-medium text-slate-800 text-xs mb-1">{atlasTask.name}</div>
                <div className="text-[11px] text-slate-500">
                  任务类型：{atlasTask.type} | 产品：{atlasTask.product} | 达标率：78.5%
                </div>
              </div>

              {/* 模拟技能雷达指标条 */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-700">核心能力点达成度数谱：</div>
                {[
                  { name: '算法模型搭建与配置', rate: 86, color: 'bg-blue-500' },
                  { name: '数据集清洗与标注规范', rate: 92, color: 'bg-emerald-500' },
                  { name: '接口协议联调与测试', rate: 74, color: 'bg-indigo-500' },
                  { name: '边缘推理运行与日志排查', rate: 68, color: 'bg-amber-500' },
                  { name: '工程代码规范与自动化脚本', rate: 82, color: 'bg-teal-500' }
                ].map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>{skill.name}</span>
                      <span className="font-semibold text-slate-700">{skill.rate}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${skill.color} rounded-full transition-all duration-700`}
                        style={{ width: `${skill.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50/50 rounded border border-blue-100 flex items-start space-x-2 text-[11px] text-blue-700">
                <TrendingUp className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <span>
                  数谱洞察：本任务整体掌握情况优良。建议在后续课时中针对「边缘推理运行与日志排查」模块进行专项答疑演练。
                </span>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
              <button
                onClick={() => setAtlasTask(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
