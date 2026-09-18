import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  ChevronLeft,
  ChevronDown,
  X,
  Play,
  Check
} from 'lucide-react';

// ======================= 数据类型定义 =======================
export interface CourseTaskItem {
  id: string;
  name: string;
  type: 'theory' | 'practice' | 'video' | 'report' | 'quiz';
  typeName: string;
  status: 'completed' | 'in_progress' | 'not_started';
  statusName: string;
  progress: number;
  issueTime: string; // 下发时间 / 加入学习时间
  lastStudyTime: string; // 最近学习时间
}

export interface StudentCourse {
  id: string;
  name: string;
  subTitle: string;
  category: string;
  teacher?: string;
  cover: string;
  isSelfStudy?: boolean;
  lastStudiedTaskId?: string; // 最近学习的任务 ID
  tasks: CourseTaskItem[];
}

export interface FlatTaskRow extends CourseTaskItem {
  courseId: string;
  courseName: string;
  isSelfStudy: boolean;
}

// ======================= 10 门扩充模拟课程数据 =======================
// 1. 教师下发的任务课程 (共 10 门课)
const MOCK_TEACHER_COURSES: StudentCourse[] = [
  {
    id: 'tc-1',
    name: '自然语言处理技术与应用17888340735441',
    subTitle: 'NLP深度实训体系',
    category: '专业核心课',
    teacher: '张宏 教授',
    lastStudiedTaskId: 't1-2',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't1-1', name: '1-6 任务2 中文文本分词方法与工具使用（理论）', type: 'theory', typeName: '理论', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-09-01 10:00', lastStudyTime: '2026-09-12 14:50' },
      { id: 't1-2', name: '1-7 任务2 中文文本分词与TF-IDF实训（实操）', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 60, issueTime: '2026-09-05 10:00', lastStudyTime: '2026-09-17 11:20' },
      { id: 't1-3', name: '1-8 任务2 词频统计与jieba扩展词典（视频）', type: 'video', typeName: '视频', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-09-08 10:00', lastStudyTime: '2026-09-10 09:30' },
      { id: 't1-4', name: '1-9 任务3 核心词汇识别与词云开发（报告）', type: 'report', typeName: '报告', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-14 09:00', lastStudyTime: '-' },
      { id: 't1-5', name: '1-10 任务3 NLP分词算法阶段性测验（习题）', type: 'quiz', typeName: '习题', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-15 14:00', lastStudyTime: '-' },
    ]
  },
  {
    id: 'tc-2',
    name: 'Python程序设计进阶任务202308',
    subTitle: '面向对象与并发编程',
    category: '专业核心课',
    teacher: '李建军 副教授',
    lastStudiedTaskId: 't2-2',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't2-1', name: '2-1 面向对象高级特性与魔法方法', type: 'theory', typeName: '理论', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-20 09:00', lastStudyTime: '2026-09-14 16:20' },
      { id: 't2-2', name: '2-2 生成器、迭代器与装饰器实操', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 50, issueTime: '2026-09-02 09:00', lastStudyTime: '2026-09-18 10:15' },
      { id: 't2-3', name: '2-3 Python多线程与多进程并发编程', type: 'theory', typeName: '理论', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-10 15:00', lastStudyTime: '-' },
      { id: 't2-4', name: '2-4 异步IO与asyncio网络编程实训', type: 'practice', typeName: '实操', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-16 10:00', lastStudyTime: '-' },
    ]
  },
  {
    id: 'tc-3',
    name: '深度学习与计算机视觉实训202306',
    subTitle: 'CNN与目标检测',
    category: '专业核心课',
    teacher: '王敏 讲师',
    lastStudiedTaskId: 't3-3',
    cover: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't3-1', name: '1-1 卷积神经网络CNN基础结构解析', type: 'theory', typeName: '理论', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-15 09:00', lastStudyTime: '2026-08-25 14:00' },
      { id: 't3-2', name: '1-2 ResNet残差网络搭建与MNIST实操', type: 'practice', typeName: '实操', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-28 09:00', lastStudyTime: '2026-09-02 16:30' },
      { id: 't3-3', name: '2-1 目标检测YOLOv5网络微调实训', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 80, issueTime: '2026-09-11 10:00', lastStudyTime: '2026-09-16 18:30' },
      { id: 't3-4', name: '2-2 自定义数据集标注与模型量化', type: 'report', typeName: '报告', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-15 09:00', lastStudyTime: '-' },
    ]
  },
  {
    id: 'tc-4',
    name: '工业物联网数据采集与网关开发',
    subTitle: 'Modbus与MQTT协议实训',
    category: '技能实训课',
    teacher: '周伟 副教授',
    lastStudiedTaskId: 't4-2',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't4-1', name: '1-1 工业物联网架构与边缘传感器组网', type: 'theory', typeName: '理论', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-20 14:00', lastStudyTime: '2026-09-01 10:20' },
      { id: 't4-2', name: '1-2 Modbus RTU串口总线数据轮询采集', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 45, issueTime: '2026-09-09 14:00', lastStudyTime: '2026-09-17 15:40' },
      { id: 't4-3', name: '2-1 MQTT微客户端与云端平台遥测上报', type: 'practice', typeName: '实操', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-16 14:00', lastStudyTime: '-' },
    ]
  },
  {
    id: 'tc-5',
    name: '大数据分布式存储与Hadoop集群运维',
    subTitle: '分布式系统核心',
    category: '专业基础课',
    teacher: '陈光耀 教授',
    lastStudiedTaskId: 't5-2',
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't5-1', name: '1-1 HDFS分布式文件系统读写机制剖析', type: 'theory', typeName: '理论', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-09-01 08:30', lastStudyTime: '2026-09-08 11:00' },
      { id: 't5-2', name: '1-2 Hadoop三节点高可用集群实训搭建', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 30, issueTime: '2026-09-12 08:30', lastStudyTime: '2026-09-18 09:40' },
      { id: 't5-3', name: '2-1 YARN资源调度与容量队列配置实验', type: 'practice', typeName: '实操', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-17 08:30', lastStudyTime: '-' },
    ]
  },
  {
    id: 'tc-6',
    name: '嵌入式Linux驱动开发实战',
    subTitle: '设备树与内核模块',
    category: '专业核心课',
    teacher: '刘正元 高级工程师',
    lastStudiedTaskId: 't6-1',
    cover: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't6-1', name: '1-1 Linux字符设备驱动架构与主次设备号', type: 'theory', typeName: '理论', status: 'in_progress', statusName: '进行中', progress: 40, issueTime: '2026-09-14 10:00', lastStudyTime: '2026-09-17 19:10' },
      { id: 't6-2', name: '1-2 GPIO子系统与LED流水灯驱动编写', type: 'practice', typeName: '实操', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-16 10:00', lastStudyTime: '-' },
      { id: 't6-3', name: '2-1 I2C总线驱动框架与温湿度传感器接入', type: 'practice', typeName: '实操', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-18 10:00', lastStudyTime: '-' },
    ]
  },
  {
    id: 'tc-7',
    name: '前端工程化与现代前端框架实训',
    subTitle: 'React19与TypeScript最佳实践',
    category: '技能实训课',
    teacher: '赵文博 讲师',
    lastStudiedTaskId: 't7-2',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't7-1', name: '1-1 组件设计模式与Custom Hooks封装', type: 'theory', typeName: '理论', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-25 14:00', lastStudyTime: '2026-09-04 15:30' },
      { id: 't7-2', name: '1-2 Vite打包优化与Monorepo工程配置实战', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 70, issueTime: '2026-09-08 14:00', lastStudyTime: '2026-09-16 21:00' },
      { id: 't7-3', name: '2-1 企业级智慧后台管理系统综合设计', type: 'report', typeName: '报告', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-15 14:00', lastStudyTime: '-' },
    ]
  },
  {
    id: 'tc-8',
    name: '智能网联汽车V2X协同感知技术',
    subTitle: '车路协同实训体系',
    category: '前沿选修课',
    teacher: '吴凯 博士',
    lastStudiedTaskId: 't8-1',
    cover: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't8-1', name: '1-1 车载激光雷达点云预处理与滤波算法', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 35, issueTime: '2026-09-10 16:00', lastStudyTime: '2026-09-15 17:30' },
      { id: 't8-2', name: '1-2 V2X标准协议栈与路侧单元通信实验', type: 'theory', typeName: '理论', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-14 16:00', lastStudyTime: '-' },
    ]
  },
  {
    id: 'tc-9',
    name: '网络空间安全与渗透测试实操',
    subTitle: '攻防对抗实训',
    category: '专业核心课',
    teacher: '孙浩 副教授',
    lastStudiedTaskId: 't9-2',
    cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't9-1', name: '1-1 Web常见漏洞（SQL注入与XSS）防御', type: 'theory', typeName: '理论', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-09-02 10:00', lastStudyTime: '2026-09-09 16:20' },
      { id: 't9-2', name: '1-2 靶场环境下的提权实战与审计报告', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 55, issueTime: '2026-09-11 10:00', lastStudyTime: '2026-09-17 14:10' },
    ]
  },
  {
    id: 'tc-10',
    name: '云计算与微服务架构K8s实战',
    subTitle: 'Docker与K8s容器化部署',
    category: '专业核心课',
    teacher: '黄海峰 架构师',
    lastStudiedTaskId: 't10-1',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't10-1', name: '1-1 Docker容器编排与Dockerfile优化实训', type: 'practice', typeName: '实操', status: 'in_progress', statusName: '进行中', progress: 85, issueTime: '2026-09-06 09:00', lastStudyTime: '2026-09-18 11:30' },
      { id: 't10-2', name: '1-2 K8s Pod控制器与Ingress灰度发布实验', type: 'practice', typeName: '实操', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-09-15 09:00', lastStudyTime: '-' },
    ]
  }
];

// 2. 自学课程 (共 8 门课)
const MOCK_SELF_COURSES: StudentCourse[] = [
  {
    id: 'sc-1',
    name: 'PyTorch深度学习框架零基础到进阶',
    subTitle: 'PyTorch官方深度实训',
    category: '自主选修',
    isSelfStudy: true,
    lastStudiedTaskId: 's1-3',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 's1-1', name: '第1章 Tensor张量基础操作与自动微分', type: 'theory', typeName: '章节', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-10 14:20', lastStudyTime: '2026-08-25 16:00' },
      { id: 's1-2', name: '第2章 nn.Module核心模块与线性回归构建', type: 'practice', typeName: '实验', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-10 14:20', lastStudyTime: '2026-09-02 11:30' },
      { id: 's1-3', name: '第3章 DataLoader与图像数据集流水线搭建', type: 'practice', typeName: '实验', status: 'in_progress', statusName: '进行中', progress: 40, issueTime: '2026-08-10 14:20', lastStudyTime: '2026-09-14 20:10' },
      { id: 's1-4', name: '第4章 GPU加速训练技巧与模型量化', type: 'theory', typeName: '章节', status: 'not_started', statusName: '未开始', progress: 0, issueTime: '2026-08-10 14:20', lastStudyTime: '-' },
    ]
  },
  {
    id: 'sc-2',
    name: '大数据分析与分布式计算原理（Spark）',
    subTitle: '海量数据流式计算实训',
    category: '自主选修',
    isSelfStudy: true,
    lastStudiedTaskId: 's2-4',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 's2-1', name: '1-1 分布式集群架构与HDFS读写', type: 'theory', typeName: '章节', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-15 14:00', lastStudyTime: '2026-08-20 10:00' },
      { id: 's2-2', name: '1-2 MapReduce计算范式与单节点调试', type: 'practice', typeName: '实验', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-15 14:00', lastStudyTime: '2026-08-28 15:40' },
      { id: 's2-3', name: '2-1 Spark RDD弹性分布式数据集核心机制', type: 'theory', typeName: '章节', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-15 14:00', lastStudyTime: '2026-09-08 18:20' },
      { id: 's2-4', name: '2-2 Spark SQL结构化数据查询及算子应用', type: 'practice', typeName: '实验', status: 'in_progress', statusName: '进行中', progress: 75, issueTime: '2026-08-15 14:00', lastStudyTime: '2026-09-17 11:20' },
    ]
  },
  {
    id: 'sc-3',
    name: 'Go语言高并发分布式微服务开发',
    subTitle: 'Gin与gRPC微服务',
    category: '自主选修',
    isSelfStudy: true,
    lastStudiedTaskId: 's3-2',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 's3-1', name: '1-1 Goroutine并发调度与Channel通道通信', type: 'theory', typeName: '章节', status: 'completed', statusName: '已完成', progress: 100, issueTime: '2026-08-28 10:00', lastStudyTime: '2026-09-05 14:10' },
      { id: 's3-2', name: '1-2 gRPC接口定义与Protobuf序列化实操', type: 'practice', typeName: '实验', status: 'in_progress', statusName: '进行中', progress: 50, issueTime: '2026-08-28 10:00', lastStudyTime: '2026-09-16 16:30' },
    ]
  },
  {
    id: 'sc-4',
    name: 'Rust语言系统级编程实战',
    subTitle: '内存安全与所有权模型',
    category: '自主选修',
    isSelfStudy: true,
    lastStudiedTaskId: 's4-1',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 's4-1', name: '1-1 所有权、借用与生命周期深入理解', type: 'theory', typeName: '章节', status: 'in_progress', statusName: '进行中', progress: 45, issueTime: '2026-09-05 09:00', lastStudyTime: '2026-09-15 10:00' },
    ]
  },
  {
    id: 'sc-5',
    name: 'AIGC与Prompt工程提示词架构',
    subTitle: '大语言模型协同工作流',
    category: '自主选修',
    isSelfStudy: true,
    lastStudiedTaskId: 's5-1',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 's5-1', name: '1-1 Few-shot与CoT思维链提示词优化实战', type: 'practice', typeName: '实验', status: 'in_progress', statusName: '进行中', progress: 65, issueTime: '2026-09-12 11:00', lastStudyTime: '2026-09-18 10:40' },
    ]
  },
  {
    id: 'sc-6',
    name: 'Unity3D虚拟现实与元宇宙交互开发',
    subTitle: 'XR场景与物理引擎',
    category: '自主选修',
    isSelfStudy: true,
    lastStudiedTaskId: 's6-1',
    cover: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 's6-1', name: '1-1 虚拟现实头显SDK配置与空间定位', type: 'practice', typeName: '实验', status: 'in_progress', statusName: '进行中', progress: 30, issueTime: '2026-09-10 15:00', lastStudyTime: '2026-09-16 14:20' },
    ]
  }
];

interface StudentStudiesProps {
  onNavigate?: (view: string) => void;
}

export default function StudentStudies({ onNavigate }: StudentStudiesProps) {
  // ======================= 上部分状态：我学的课 =======================
  const [courseTab, setCourseTab] = useState<'task' | 'self'>('task');
  // 控制哪些课程卡片展开了所有关联任务列表（默认全部收起，只展示最近学习任务）
  const [expandedCourseIds, setExpandedCourseIds] = useState<Record<string, boolean>>({});

  const toggleExpandCourse = (courseId: string) => {
    setExpandedCourseIds(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  // 当前所选 Tab 下的课程列表
  const activeCourses = useMemo(() => {
    return courseTab === 'task' ? MOCK_TEACHER_COURSES : MOCK_SELF_COURSES;
  }, [courseTab]);

  // 计算课程完成度统计
  const calculateCourseProgress = (tasks: CourseTaskItem[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const total = tasks.reduce((sum, t) => sum + (t.progress || 0), 0);
    return Math.round(total / tasks.length);
  };

  // 获取最近学习的那个任务（如果没有学过，则选第一个任务）
  const getLatestStudiedTask = (course: StudentCourse): CourseTaskItem => {
    if (course.lastStudiedTaskId) {
      const found = course.tasks.find(t => t.id === course.lastStudiedTaskId);
      if (found) return found;
    }
    const inProgress = course.tasks.find(t => t.status === 'in_progress');
    if (inProgress) return inProgress;
    return course.tasks[0];
  };

  // ======================= 下部分状态：任务列表 =======================
  // Tab 名称：'task' -> 我的任务, 'self' -> 我的自学
  const [taskListTab, setTaskListTab] = useState<'task' | 'self'>('task');
  
  // 搜索筛选字段
  const [searchTaskName, setSearchTaskName] = useState('');
  
  // 课程下拉选择（支持在下拉面板内关键字即时过滤）
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [courseFilterKeyword, setCourseFilterKeyword] = useState('');

  // 时间范围筛选
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeDateQuickTag, setActiveDateQuickTag] = useState<string | null>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 整理扁平的任务列表
  const flatTaskList: FlatTaskRow[] = useMemo(() => {
    const sourceCourses = taskListTab === 'task' ? MOCK_TEACHER_COURSES : MOCK_SELF_COURSES;
    const list: FlatTaskRow[] = [];
    sourceCourses.forEach(c => {
      c.tasks.forEach(t => {
        list.push({
          ...t,
          courseId: c.id,
          courseName: c.name,
          isSelfStudy: !!c.isSelfStudy
        });
      });
    });
    return list;
  }, [taskListTab]);

  // 可选课程下拉列表选项（从当前 Tab 课程中提取）
  const availableCourseNames = useMemo(() => {
    const sourceCourses = taskListTab === 'task' ? MOCK_TEACHER_COURSES : MOCK_SELF_COURSES;
    return Array.from(new Set(sourceCourses.map(c => c.name)));
  }, [taskListTab]);

  const filteredDropdownCourseNames = useMemo(() => {
    if (!courseFilterKeyword.trim()) return availableCourseNames;
    return availableCourseNames.filter(name => 
      name.toLowerCase().includes(courseFilterKeyword.trim().toLowerCase())
    );
  }, [availableCourseNames, courseFilterKeyword]);

  // 快捷时间范围选择处理
  const handleQuickDateSelect = (days: number, label: string) => {
    setActiveDateQuickTag(label);
    const now = new Date('2026-09-18T23:59:59'); // 以当前系统时间为基准
    const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const formatDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    setStartDate(formatDate(past));
    setEndDate(formatDate(now));
    setCurrentPage(1);
  };

  // 根据搜索条件过滤任务
  const filteredTaskList = useMemo(() => {
    return flatTaskList.filter(row => {
      // 任务名称模糊匹配
      const matchTask = !searchTaskName.trim() || row.name.toLowerCase().includes(searchTaskName.trim().toLowerCase());
      
      // 课程名称精准或匹配
      const matchCourse = !selectedCourseName.trim() || row.courseName === selectedCourseName.trim();
      
      // 时间范围匹配 (截取 YYYY-MM-DD 部分比较)
      let matchDate = true;
      const rowDateStr = row.issueTime.slice(0, 10);
      if (startDate && rowDateStr < startDate) {
        matchDate = false;
      }
      if (endDate && rowDateStr > endDate) {
        matchDate = false;
      }

      return matchTask && matchCourse && matchDate;
    });
  }, [flatTaskList, searchTaskName, selectedCourseName, startDate, endDate]);

  // 分页截取
  const totalItems = filteredTaskList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTaskList.slice(start, start + pageSize);
  }, [filteredTaskList, currentPage, pageSize]);

  // 搜索重置
  const handleResetSearch = () => {
    setSearchTaskName('');
    setSelectedCourseName('');
    setStartDate('');
    setEndDate('');
    setActiveDateQuickTag(null);
    setCurrentPage(1);
  };

  // 跳转继续学习
  const handleContinueStudy = (_taskId?: string) => {
    if (onNavigate) {
      onNavigate('course-learning');
    }
  };

  return (
    <div className="flex-1 p-6 bg-[#f4f7f9] min-h-0 overflow-y-auto space-y-7">
      
      {/* ========================================================
          1. 上部分：我学的课（一行4门，默认收起任务列表，只展示最近学习的那个任务直接跳转）
      ======================================================== */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-slate-200/80 p-6">
        {/* 顶部标题与 Tab 栏 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">我学的课</h2>
            <span className="text-xs text-slate-400 font-normal">
              {courseTab === 'task' ? `共 ${MOCK_TEACHER_COURSES.length} 门教师下发课程 · 点击最近学习任务可快速直达` : `共 ${MOCK_SELF_COURSES.length} 门自主参与课程`}
            </span>
          </div>

          {/* 两个 Tab：任务课程 / 自学课程 */}
          <div className="flex bg-slate-100/90 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => {
                setCourseTab('task');
                setExpandedCourseIds({});
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center space-x-1.5 ${
                courseTab === 'task'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>任务课程</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${courseTab === 'task' ? 'bg-blue-100/80 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                {MOCK_TEACHER_COURSES.length}
              </span>
            </button>
            <button
              onClick={() => {
                setCourseTab('self');
                setExpandedCourseIds({});
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center space-x-1.5 ${
                courseTab === 'self'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>自学课程</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${courseTab === 'self' ? 'bg-blue-100/80 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                {MOCK_SELF_COURSES.length}
              </span>
            </button>
          </div>
        </div>

        {/* 课程网格：一行 4 门（在 lg 及 xl 屏幕下为 4 列） */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeCourses.map((course) => {
            const progress = calculateCourseProgress(course.tasks);
            const latestTask = getLatestStudiedTask(course);
            const isExpanded = !!expandedCourseIds[course.id];

            return (
              <div 
                key={course.id} 
                className="border border-slate-200/90 rounded-xl bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* 1. 顶部：封面图 + 类别标签 */}
                <div className="relative w-full h-32 bg-slate-900 overflow-hidden shrink-0">
                  <img
                    src={course.cover}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium">
                    {course.category}
                  </div>
                  {course.teacher && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-[10px] text-slate-200">
                      {course.teacher}
                    </div>
                  )}
                </div>

                {/* 2. 中部：课程名称与学习进度百分比 */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-blue-600 transition-colors" 
                      title={course.name}
                    >
                      {course.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {course.subTitle}
                    </p>

                    {/* 进度条与百分比 */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-400">学习进度</span>
                        <span className="font-bold text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. 核心区域：聚焦展示「最近学习的那个任务」，点击直接快速到该任务学习 */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1.5">
                      <span className="flex items-center text-slate-500 font-medium">
                        <Clock className="w-3 h-3 mr-1 text-blue-500" />
                        最近学习任务
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleExpandCourse(course.id)}
                        className="text-[10px] text-blue-500 hover:text-blue-700 hover:underline flex items-center"
                      >
                        {isExpanded ? '收起列表' : `全部(${course.tasks.length})`}
                        <ChevronDown className={`w-2.5 h-2.5 ml-0.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* 最近任务卡片（重点交互：可直接点击快速跳转学习） */}
                    <div
                      onClick={() => handleContinueStudy(latestTask?.id)}
                      className="p-2.5 rounded-lg bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100/80 transition-all cursor-pointer group/quick"
                      title="点击快速继续该任务学习"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-medium">
                          {latestTask?.typeName || '任务'}
                        </span>
                        <div className="flex items-center text-[10px] text-blue-600 font-medium group-hover/quick:translate-x-0.5 transition-transform">
                          <span>快速去学习</span>
                          <Play className="w-2.5 h-2.5 ml-1 fill-current" />
                        </div>
                      </div>
                      <div className="text-xs text-slate-700 font-medium line-clamp-1 mt-1.5 group-hover/quick:text-blue-700">
                        {latestTask?.name}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>进度: {latestTask?.progress}%</span>
                        <span>{latestTask?.lastStudyTime !== '-' ? latestTask?.lastStudyTime : '待开始'}</span>
                      </div>
                    </div>

                    {/* 可选展开的关联任务列表（最近5条） */}
                    {isExpanded && (
                      <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="text-[10px] text-slate-400 mb-1">全部关联任务:</div>
                        {course.tasks.slice(0, 5).map((task, idx) => (
                          <div
                            key={task.id}
                            onClick={() => handleContinueStudy(task.id)}
                            className="flex items-center justify-between px-2 py-1 rounded bg-slate-50 hover:bg-blue-50 text-[11px] text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            <span className="truncate pr-1">
                              {idx + 1}. {task.name}
                            </span>
                            <span className="shrink-0 text-[10px] text-slate-400">
                              {task.progress}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          2. 下部分：任务列表（名称改为任务列表，Tab改为我的任务和我的自学）
      ======================================================== */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-slate-200/80 p-6">
        
        {/* 顶部标题与 Tab 栏 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">任务列表</h2>
            <span className="text-xs text-slate-400 font-normal">支持课程下拉过滤、时间范围与快捷日期检索</span>
          </div>

          {/* 两个 Tab：我的任务 / 我的自学 */}
          <div className="flex bg-slate-100/90 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => {
                setTaskListTab('task');
                setSelectedCourseName('');
                setCourseFilterKeyword('');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                taskListTab === 'task'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              我的任务
            </button>
            <button
              onClick={() => {
                setTaskListTab('self');
                setSelectedCourseName('');
                setCourseFilterKeyword('');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                taskListTab === 'self'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              我的自学
            </button>
          </div>
        </div>

        {/* 多条件检索栏（任务名称、课程下拉选择+搜索、时间范围+快速选项） */}
        <div className="mt-5 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            
            {/* 1. 任务名称搜索 */}
            <div className="md:col-span-3">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">任务名称</span>
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                <input
                  type="text"
                  value={searchTaskName}
                  onChange={(e) => {
                    setSearchTaskName(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="输入任务名称搜索..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all text-slate-700"
                />
              </div>
            </div>

            {/* 2. 课程搜索：下拉显示课程并支持关键字搜索 */}
            <div className="md:col-span-4 relative">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">所属课程</span>
              <div 
                onClick={() => setIsCourseDropdownOpen(prev => !prev)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors"
              >
                <span className={`truncate ${selectedCourseName ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                  {selectedCourseName || '全部课程'}
                </span>
                <div className="flex items-center space-x-1 shrink-0 ml-1">
                  {selectedCourseName && (
                    <X 
                      className="w-3 h-3 text-slate-400 hover:text-slate-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourseName('');
                        setCurrentPage(1);
                      }}
                    />
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCourseDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* 下拉面板（带关键字检索） */}
              {isCourseDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setIsCourseDropdownOpen(false)} 
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-30 space-y-1.5">
                    {/* 下拉内部搜索框 */}
                    <div className="relative flex items-center">
                      <Search className="w-3 h-3 text-slate-400 absolute left-2" />
                      <input
                        type="text"
                        value={courseFilterKeyword}
                        onChange={(e) => setCourseFilterKeyword(e.target.value)}
                        placeholder="检索课程..."
                        autoFocus
                        className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded outline-none text-slate-700"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {/* 选项列表 */}
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-50 text-xs">
                      <div
                        onClick={() => {
                          setSelectedCourseName('');
                          setIsCourseDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`px-2.5 py-1.5 rounded cursor-pointer flex items-center justify-between ${
                          !selectedCourseName ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>全部课程</span>
                        {!selectedCourseName && <Check className="w-3 h-3 text-blue-600" />}
                      </div>

                      {filteredDropdownCourseNames.map((name) => (
                        <div
                          key={name}
                          onClick={() => {
                            setSelectedCourseName(name);
                            setIsCourseDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`px-2.5 py-1.5 rounded cursor-pointer flex items-center justify-between ${
                            selectedCourseName === name ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate pr-2">{name}</span>
                          {selectedCourseName === name && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                        </div>
                      ))}

                      {filteredDropdownCourseNames.length === 0 && (
                        <div className="py-2 text-center text-slate-400 text-xs">
                          无匹配课程
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. 时间范围选择（开始日期 ~ 结束日期） */}
            <div className="md:col-span-5">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                {taskListTab === 'task' ? '下发时间范围' : '加入学习时间范围'}
              </span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setActiveDateQuickTag(null);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none text-slate-700"
                />
                <span className="text-slate-400 text-xs">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setActiveDateQuickTag(null);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none text-slate-700"
                />
              </div>
            </div>

          </div>

          {/* 快捷时间选项与重置按钮行 */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-[11px]">快捷时间:</span>
              {[
                { label: '最近7天', days: 7 },
                { label: '最近10天', days: 10 },
                { label: '最近一个月', days: 30 },
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleQuickDateSelect(item.days, item.label)}
                  className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${
                    activeDateQuickTag === item.label
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <button
                type="button"
                onClick={handleResetSearch}
                className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded text-xs transition-colors flex items-center"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                重置条件
              </button>
            </div>
          </div>
        </div>

        {/* 任务表格（无封面，包含课程名称、任务名称、下发时间/加入学习时间、完成进度、最近学习时间、操作） */}
        <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-slate-500 text-xs border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4 w-14 text-center">序号</th>
                  <th className="py-3 px-4 w-52">课程名称</th>
                  <th className="py-3 px-4">任务名称</th>
                  <th className="py-3 px-4 w-40">
                    {taskListTab === 'task' ? '下发时间' : '加入学习时间'}
                  </th>
                  <th className="py-3 px-4 w-44">完成进度</th>
                  <th className="py-3 px-4 w-40">最近学习时间</th>
                  <th className="py-3 px-4 w-28 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map((row, index) => {
                    const rowNumber = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors group">
                        {/* 序号 */}
                        <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                          {rowNumber}
                        </td>

                        {/* 课程名称 */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[200px] truncate" title={row.courseName}>
                          {row.courseName}
                        </td>

                        {/* 任务名称 */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 shrink-0 font-medium">
                              {row.typeName}
                            </span>
                            <span 
                              className="font-medium text-slate-700 hover:text-blue-600 cursor-pointer line-clamp-1" 
                              title={row.name}
                              onClick={() => handleContinueStudy(row.id)}
                            >
                              {row.name}
                            </span>
                          </div>
                        </td>

                        {/* 下发时间 / 加入学习时间 */}
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {row.issueTime}
                        </td>

                        {/* 完成进度 */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  row.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${row.progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 w-8 text-right shrink-0">
                              {row.progress}%
                            </span>
                          </div>
                        </td>

                        {/* 最近学习时间 */}
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {row.lastStudyTime}
                        </td>

                        {/* 继续学习按钮 */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleContinueStudy(row.id)}
                            className="px-3 py-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded text-xs font-medium transition-colors"
                          >
                            继续学习
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-xs text-slate-500">未找到符合检索条件的课程任务</p>
                        <button
                          onClick={handleResetSearch}
                          className="mt-2 text-xs text-blue-600 hover:underline"
                        >
                          清空检索条件
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 表格底部带分页 */}
          <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center space-x-3">
              <span>
                共 <strong className="text-slate-800">{totalItems}</strong> 条任务
              </span>
              <span>
                第 <strong className="text-slate-800">{currentPage}</strong> / {totalPages} 页
              </span>
              <div className="flex items-center space-x-1 pl-2">
                <span>每页:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 outline-none"
                >
                  <option value={5}>5 条</option>
                  <option value={10}>10 条</option>
                  <option value={20}>20 条</option>
                </select>
              </div>
            </div>

            {/* 页码切换 */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="上一页"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="下一页"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
