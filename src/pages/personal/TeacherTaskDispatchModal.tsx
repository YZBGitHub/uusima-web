import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Send,
  ChevronDown,
  Bot,
  FlaskConical,
  BookOpen,
  SlidersHorizontal,
  FolderTree,
  Sparkles
} from 'lucide-react';

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

export const DEFAULT_CLASS_OPTIONS = [
  '人工智能2101班',
  '人工智能2102班',
  '大数据应用2101班',
  '软件工程2103班',
  '物联网工程2201班',
  '计算机2101班'
];

export const DEFAULT_STUDENT_SELECT_OPTIONS = [
  '全选（当前班级全部学生 30人）',
  '第一实验小组 (15人)',
  '第二实验小组 (15人)',
  '学业攻坚小组 (6人)'
];

export const BASE_COURSE_SELECT_OPTIONS = [
  'AI学伴-功能演示（AI学伴产品）',
  '自然语言处理技术与应用（AI学伴产品）',
  '智慧园区-虚拟实验台（智慧园区云部）',
  '智慧水务业务开发（智慧水务系统）',
  '硬件模块开发实践（硬件开发平台）'
];

// 根据课程标题动态生成匹配的高仿真章节树
export function generateChapterProjects(courseTitle: string): ChapterProjectNode[] {
  const clean = courseTitle || '';
  if (clean.includes('自然语言') || clean.includes('NLP')) {
    return [
      {
        id: 'proj_nlp_1',
        title: '项目一：文本分词与语料预处理实践',
        collapsed: false,
        tasks: [
          { id: 't_nlp_1', code: '任务1.1', name: 'Jieba与NLTK中英文精确分词与分词模式对比', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_nlp_2', code: '任务1.2', name: '停用词过滤与正则表达式语料规则清洗', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_nlp_3', code: '任务1.3', name: '语言模型与词频分布统计规律理论导读', type: 'theory', agentEnabled: false, selected: true }
        ]
      },
      {
        id: 'proj_nlp_2',
        title: '项目二：词向量表示与特征工程实操',
        collapsed: false,
        tasks: [
          { id: 't_nlp_4', code: '任务2.1', name: '基于TF-IDF与CountVectorizer文本特征提取', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_nlp_5', code: '任务2.2', name: 'Word2Vec分布式词向量训练与空间降维可视化', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_nlp_6', code: '任务2.3', name: '高维向量空间余弦相似度计算机制', type: 'theory', agentEnabled: false, selected: true }
        ]
      },
      {
        id: 'proj_nlp_3',
        title: '项目三：序列建模与情感分类实践',
        collapsed: false,
        tasks: [
          { id: 't_nlp_7', code: '任务3.1', name: '双向LSTM神经网络构建与意图文本分类训练', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_nlp_8', code: '任务3.2', name: '注意力机制（Attention）层嵌入与权重热力图分析', type: 'experiment', agentEnabled: true, selected: true }
        ]
      },
      {
        id: 'proj_nlp_4',
        title: '项目四：大模型Prompt提示词与下游应用微调',
        collapsed: false,
        tasks: [
          { id: 't_nlp_9', code: '任务4.1', name: '基于Zero-shot与Few-shot的任务Prompt工程实战', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_nlp_10', code: '任务4.2', name: '模型评估指标（Accuracy/F1-Score）全流程评测', type: 'experiment', agentEnabled: true, selected: true }
        ]
      }
    ];
  }

  if (clean.includes('水务') || clean.includes('环境')) {
    return [
      {
        id: 'proj_water_1',
        title: '项目一：水质监测传感器网络与采集网关配置',
        collapsed: false,
        tasks: [
          { id: 't_water_1', code: '任务1.1', name: 'pH/浊度/余氯传感器接口标定与Modbus调试', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_water_2', code: '任务1.2', name: '边缘网关MQTT上行传输协议配置与报文解析', type: 'experiment', agentEnabled: true, selected: true }
        ]
      },
      {
        id: 'proj_water_2',
        title: '项目二：供水管网水压异常与漏损诊断算法',
        collapsed: false,
        tasks: [
          { id: 't_water_3', code: '任务2.1', name: '管网时序压力波动特征提取与清洗过滤', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_water_4', code: '任务2.2', name: '基于Isolation Forest孤立森林算法的漏水点告警', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_water_5', code: '任务2.3', name: '城市多级供水管网流体动力学理论基础', type: 'theory', agentEnabled: false, selected: true }
        ]
      },
      {
        id: 'proj_water_3',
        title: '项目三：加压泵房自动化联动与能耗调度实验',
        collapsed: false,
        tasks: [
          { id: 't_water_6', code: '任务3.1', name: '变频泵组PID闭环恒压供水仿真调试', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_water_7', code: '任务3.2', name: '综合能效与峰谷电价策略优化排程开发', type: 'experiment', agentEnabled: true, selected: true }
        ]
      }
    ];
  }

  if (clean.includes('园区') || clean.includes('物联网') || clean.includes('工业')) {
    return [
      {
        id: 'proj_iot_1',
        title: '项目一：3D虚实映射数字孪生底座搭建',
        collapsed: false,
        tasks: [
          { id: 't_iot_1', code: '任务1.1', name: 'BIM空间模型轻量化转换与坐标系校准', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_iot_2', code: '任务1.2', name: '虚拟传感器测点数据绑定与动画状态驱动', type: 'experiment', agentEnabled: true, selected: true }
        ]
      },
      {
        id: 'proj_iot_2',
        title: '项目二：边缘感知与安防智能识别实训',
        collapsed: false,
        tasks: [
          { id: 't_iot_3', code: '任务2.1', name: 'RTSP视频流抓帧与YOLO目标检测边缘推理', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_iot_4', code: '任务2.2', name: '周界入侵事件触发与多级告警广播联动', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_iot_5', code: '任务2.3', name: '工业物联网边缘网关与通信协议标准导读', type: 'theory', agentEnabled: false, selected: true }
        ]
      },
      {
        id: 'proj_iot_3',
        title: '项目三：多能互补能耗负荷预测与综合调度',
        collapsed: false,
        tasks: [
          { id: 't_iot_6', code: '任务3.1', name: '园区光伏/储能/空调用电历史时序回归预测', type: 'experiment', agentEnabled: true, selected: true },
          { id: 't_iot_7', code: '任务3.2', name: '微电网负荷削峰填谷策略编写与成效验证', type: 'experiment', agentEnabled: true, selected: true }
        ]
      }
    ];
  }

  // 默认使用AI学伴与通用课程高仿真教学章节（4个项目共11节）
  return [
    {
      id: 'proj_default_1',
      title: '项目一：开发环境认知与快速体验',
      collapsed: false,
      tasks: [
        { id: 't_def_1', code: '任务1.1', name: 'Jupyter云端实验环境容器构建与快速启动', type: 'experiment', agentEnabled: true, selected: true },
        { id: 't_def_2', code: '任务1.2', name: '大模型API交互接口连通性测试与参数调试', type: 'experiment', agentEnabled: true, selected: true },
        { id: 't_def_3', code: '任务1.3', name: '核心交互界面与系统架构导读', type: 'theory', agentEnabled: false, selected: true }
      ]
    },
    {
      id: 'proj_default_2',
      title: '项目二：核心语法与数据结构实训',
      collapsed: false,
      tasks: [
        { id: 't_def_4', code: '任务2.1', name: '核心数据结构与推导式编程实操', type: 'experiment', agentEnabled: true, selected: true },
        { id: 't_def_5', code: '任务2.2', name: '多维张量运算与数据标准化清洗实践', type: 'experiment', agentEnabled: true, selected: true },
        { id: 't_def_6', code: '任务2.3', name: '数据科学计算核心算子理论解析', type: 'theory', agentEnabled: false, selected: true }
      ]
    },
    {
      id: 'proj_default_3',
      title: '项目三：特征工程与模型训练实践',
      collapsed: false,
      tasks: [
        { id: 't_def_7', code: '任务3.1', name: '中英文分词与特征矩阵构建实操', type: 'experiment', agentEnabled: true, selected: true },
        { id: 't_def_8', code: '任务3.2', name: '特征权重分析与统计词云可视化', type: 'experiment', agentEnabled: true, selected: true },
        { id: 't_def_9', code: '任务3.3', name: '高维特征空间向量表征机理', type: 'theory', agentEnabled: false, selected: true }
      ]
    },
    {
      id: 'proj_default_4',
      title: '项目四：算法实操与自动评测验证',
      collapsed: false,
      tasks: [
        { id: 't_def_10', code: '任务4.1', name: '分类算法模型训练与参数调优', type: 'experiment', agentEnabled: true, selected: true },
        { id: 't_def_11', code: '任务4.2', name: '模型准确率召回率全指标评测与报告导出', type: 'experiment', agentEnabled: true, selected: true }
      ]
    }
  ];
}

export interface TaskDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 选中的初始课程（支持外部传入）
  initialCourseTitle?: string;
  // 外部提供的课程列表
  availableCourseTitles?: string[];
  // 下发成功回调
  onDispatchSuccess?: (taskData: {
    taskName: string;
    courseTitle: string;
    targetClass: string;
    studentGroup: string;
    chaptersCount: number;
    taskType: '实训任务' | '练习任务' | '考试任务';
    duration: number;
  }) => void;
}

export default function TeacherTaskDispatchModal({
  isOpen,
  onClose,
  initialCourseTitle,
  availableCourseTitles,
  onDispatchSuccess
}: TaskDispatchModalProps) {
  // 合并全部可选课程（确保 initialCourseTitle 在可选项中）
  const courseOptions = useMemo(() => {
    const list = [...(availableCourseTitles || []), ...BASE_COURSE_SELECT_OPTIONS];
    if (initialCourseTitle && !list.includes(initialCourseTitle)) {
      list.unshift(initialCourseTitle);
    }
    // 去重
    return Array.from(new Set(list));
  }, [availableCourseTitles, initialCourseTitle]);

  // 表单状态
  const [selectedClass, setSelectedClass] = useState(DEFAULT_CLASS_OPTIONS[0]);
  const [selectedStudentGroup, setSelectedStudentGroup] = useState(DEFAULT_STUDENT_SELECT_OPTIONS[0]);
  const [selectedCourseResource, setSelectedCourseResource] = useState<string>(
    initialCourseTitle || courseOptions[0] || 'AI学伴-功能演示（AI学伴产品）'
  );
  const [timeType, setTimeType] = useState<'duration' | 'deadline'>('duration');
  const [taskDuration, setTaskDuration] = useState('1000');
  const [taskDeadline, setTaskDeadline] = useState('2026-10-31 23:59');
  const [dispatchTaskName, setDispatchTaskName] = useState('');
  const [dispatchTaskType, setDispatchTaskType] = useState<'实训任务' | '练习任务' | '考试任务'>('实训任务');

  // 教学章节树形状态
  const [chapterProjects, setChapterProjects] = useState<ChapterProjectNode[]>([]);

  // 当弹窗打开或 initialCourseTitle 改变时，重新初始化数据
  useEffect(() => {
    if (isOpen) {
      const activeCourse = initialCourseTitle || courseOptions[0] || 'AI学伴-功能演示（AI学伴产品）';
      setSelectedCourseResource(activeCourse);
      
      const cleanName = activeCourse.split('（')[0].split('(')[0].trim();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      setDispatchTaskName(`${cleanName} ${dateStr}`);
      
      setSelectedClass(DEFAULT_CLASS_OPTIONS[0]);
      setSelectedStudentGroup(DEFAULT_STUDENT_SELECT_OPTIONS[0]);
      setTimeType('duration');
      setTaskDuration('1000');
      setDispatchTaskType('实训任务');

      // 初始化章节树
      setChapterProjects(generateChapterProjects(activeCourse));
    }
  }, [isOpen, initialCourseTitle, courseOptions]);

  // 章节树统计
  const totalChaptersCount = useMemo(() => {
    return chapterProjects.reduce((acc, p) => acc + p.tasks.length, 0);
  }, [chapterProjects]);

  const selectedChaptersCount = useMemo(() => {
    return chapterProjects.reduce((acc, p) => acc + p.tasks.filter(t => t.selected).length, 0);
  }, [chapterProjects]);

  const isAllChaptersSelected = totalChaptersCount > 0 && selectedChaptersCount === totalChaptersCount;
  const isAllProjectsCollapsed = chapterProjects.length > 0 && chapterProjects.every(p => p.collapsed);

  // 切换课程资源
  const handleSelectCourse = (courseName: string) => {
    setSelectedCourseResource(courseName);
    const cleanName = courseName.split('（')[0].split('(')[0].trim();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    setDispatchTaskName(`${cleanName} ${dateStr}`);
    // 动态载入匹配该课程的章节树
    setChapterProjects(generateChapterProjects(courseName));
  };

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

  // 提交下发
  const handleSubmitDispatch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dispatchTaskName.trim()) {
      alert('请输入任务名称');
      return;
    }
    if (selectedChaptersCount === 0) {
      alert('请至少选择一个教学章节任务小节！');
      return;
    }

    if (onDispatchSuccess) {
      onDispatchSuccess({
        taskName: dispatchTaskName.trim(),
        courseTitle: selectedCourseResource,
        targetClass: selectedClass,
        studentGroup: selectedStudentGroup,
        chaptersCount: selectedChaptersCount,
        taskType: dispatchTaskType,
        duration: parseInt(taskDuration, 10) || 1000
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-2xs flex items-center justify-center z-[200] p-4 sm:p-6 overflow-y-auto">
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
            onClick={onClose}
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
                    {DEFAULT_CLASS_OPTIONS.map((cls) => (
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
                    {DEFAULT_STUDENT_SELECT_OPTIONS.map((stu) => (
                      <option key={stu} value={stu}>{stu}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 课程下拉选择 */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                <span className="text-red-500 mr-1">*</span>课程:
              </label>
              <div className="relative">
                <select
                  value={selectedCourseResource}
                  onChange={(e) => handleSelectCourse(e.target.value)}
                  className="w-full h-9 pl-3 pr-8 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer shadow-2xs truncate"
                >
                  {courseOptions.map((c) => (
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
                    name="modalTimeType"
                    checked={timeType === 'duration'}
                    onChange={() => setTimeType('duration')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <span>设置任务时长</span>
                </label>
                <label className="inline-flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="modalTimeType"
                    checked={timeType === 'deadline'}
                    onChange={() => setTimeType('deadline')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <span>设置任务截止时间</span>
                </label>
              </div>
            </div>

            {/* 任务时长（分钟）或截止时间 */}
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
              onClick={onClose}
              className="px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-2xs"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmitDispatch}
              className="inline-flex items-center space-x-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>创建并下发任务</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
