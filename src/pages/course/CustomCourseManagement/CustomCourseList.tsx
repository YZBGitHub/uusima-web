import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  LayoutGrid,
  List,
  Edit3,
  Globe,
  EyeOff,
  Copy,
  Calendar,
  User,
  School,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  BookOpen,
  Filter,
  Check,
  X,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Tag
} from 'lucide-react';

export interface CustomCourseData {
  id: number;
  title: string;
  category: string;
  type: string;
  schoolName: string;
  creator: string;
  creatorRole?: string;
  creatorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  desc: string;
  cover?: string;
  gradient?: string;
  bannerText?: string;
  bannerSub?: string;
  theme?: string;
  isCustom: boolean;
  allowSelfStudy?: boolean;
  status: '已发布' | '未发布';
  studentCount?: number;
  tasksCount?: number;
}

// 默认自建课程初始数据（涵盖多个知名高校与教师）
export const DEFAULT_CUSTOM_COURSES: CustomCourseData[] = [
  {
    id: 201,
    title: 'Python程序设计进阶与网络爬虫',
    category: '专业核心课',
    type: '专业核心课',
    schoolName: '清华大学',
    creator: '张伟',
    creatorRole: '计算机系 教授',
    createdAt: '2026-09-02 09:30:00',
    updatedAt: '2026-09-18 14:00:00',
    desc: '计算机学院自建实战课程，聚焦异步并发爬虫、数据清洗与Scrapy实操工程。',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-blue-600 via-indigo-600 to-blue-800',
    bannerText: 'Python进阶与爬虫',
    bannerSub: '校本特色实战体系',
    theme: 'deep-blue',
    isCustom: true,
    allowSelfStudy: true,
    status: '已发布',
    studentCount: 320,
    tasksCount: 16
  },
  {
    id: 202,
    title: '深度学习实训：目标检测与YOLO项目',
    category: '行业应用课',
    type: '行业应用课',
    schoolName: '北京航空航天大学',
    creator: '李明',
    creatorRole: '人工智能学院 副教授',
    createdAt: '2026-08-28 15:45:00',
    updatedAt: '2026-09-15 11:20:00',
    desc: '面向高年级自建实训项目，含工业缺陷识别、PyTorch模型调优与自动评分大纲。',
    cover: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-emerald-600 via-teal-600 to-emerald-800',
    bannerText: '深度学习实训',
    bannerSub: 'YOLOv8目标检测',
    theme: 'emerald',
    isCustom: true,
    allowSelfStudy: true,
    status: '已发布',
    studentCount: 245,
    tasksCount: 12
  },
  {
    id: 203,
    title: '边缘计算与智能网关协议开发',
    category: '专业基础课',
    type: '专业基础课',
    schoolName: '浙江大学',
    creator: '王华',
    creatorRole: '控制科学与工程学院 教授',
    createdAt: '2026-08-15 10:15:00',
    updatedAt: '2026-09-10 16:30:00',
    desc: '本校教师自研网关开发实验，覆盖Modbus、MQTT上云协议与边缘容器推理。',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-cyan-600 via-blue-600 to-indigo-800',
    bannerText: '边缘计算与智能网关',
    bannerSub: '协议开发与上云实训',
    theme: 'blue-gradient',
    isCustom: true,
    allowSelfStudy: false,
    status: '未发布',
    studentCount: 180,
    tasksCount: 10
  },
  {
    id: 204,
    title: '自主移动机器人ROS2导航实战',
    category: '岗位技能认证',
    type: '岗位技能认证',
    schoolName: '哈尔滨工业大学',
    creator: '陈立强',
    creatorRole: '机器人研究所 教授',
    createdAt: '2026-07-20 14:00:00',
    updatedAt: '2026-09-08 09:10:00',
    desc: '基于ROS2 Humble与Gazebo仿真环境的激光SLAM建图与自主路径规划实战。',
    cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-purple-600 via-indigo-700 to-violet-900',
    bannerText: 'ROS2移动机器人',
    bannerSub: 'SLAM建图与自主导航',
    theme: 'purple',
    isCustom: true,
    allowSelfStudy: true,
    status: '已发布',
    studentCount: 410,
    tasksCount: 18
  },
  {
    id: 205,
    title: '大数据流式计算：Flink工程化落地',
    category: '专业核心课',
    type: '专业核心课',
    schoolName: '华中科技大学',
    creator: '赵雪',
    creatorRole: '软件学院 副教授',
    createdAt: '2026-06-18 11:20:00',
    updatedAt: '2026-08-30 17:40:00',
    desc: '结合真实生产级日志流，讲解Flink窗口算子、状态存储与Checkpoint容错机制。',
    cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-amber-600 via-orange-600 to-red-700',
    bannerText: 'Flink流式计算',
    bannerSub: '实时数据流架构实战',
    theme: 'amber',
    isCustom: true,
    allowSelfStudy: false,
    status: '未发布',
    studentCount: 130,
    tasksCount: 8
  },
  {
    id: 206,
    title: '智能网联汽车V2X通信与仿真',
    category: '行业应用课',
    type: '行业应用课',
    schoolName: '上海交通大学',
    creator: '刘阳',
    creatorRole: '机械与动力工程学院 讲师',
    createdAt: '2026-05-12 16:30:00',
    updatedAt: '2026-09-05 13:15:00',
    desc: '车路协同V2X协议仿真课程，包含DSRC与C-V2X标准场景测试与路测案例剖析。',
    cover: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-teal-600 via-cyan-700 to-blue-900',
    bannerText: '智能汽车V2X',
    bannerSub: '车路协同技术仿真',
    theme: 'teal',
    isCustom: true,
    allowSelfStudy: true,
    status: '已发布',
    studentCount: 290,
    tasksCount: 14
  }
];

interface CustomCourseListProps {
  onEditCourse: (course: CustomCourseData) => void;
  onCloneSuccess?: (clonedCourseName: string) => void;
}

export default function CustomCourseList({ onEditCourse, onCloneSuccess }: CustomCourseListProps) {
  // 课程数据列表（持久化至 localStorage，与教师端自建课程打通联动）
  const [courses, setCourses] = useState<CustomCourseData[]>(() => {
    try {
      const stored = localStorage.getItem('uusima_custom_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            ...DEFAULT_CUSTOM_COURSES[idx % DEFAULT_CUSTOM_COURSES.length],
            ...item,
            id: item.id || 200 + idx,
            schoolName: item.schoolName || DEFAULT_CUSTOM_COURSES[idx % DEFAULT_CUSTOM_COURSES.length].schoolName,
            creator: item.creator || DEFAULT_CUSTOM_COURSES[idx % DEFAULT_CUSTOM_COURSES.length].creator,
            createdAt: item.createdAt || DEFAULT_CUSTOM_COURSES[idx % DEFAULT_CUSTOM_COURSES.length].createdAt
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CUSTOM_COURSES;
  });

  // 状态筛选 Tab：'全部' | '已发布' | '未发布'
  const [statusFilter, setStatusFilter] = useState<'全部' | '已发布' | '未发布'>('全部');
  // 学校筛选
  const [selectedSchool, setSelectedSchool] = useState<string>('全部');
  // 教师筛选
  const [selectedCreator, setSelectedCreator] = useState<string>('全部');
  // 课程分类筛选
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  // 关键词搜索
  const [searchKeyword, setSearchKeyword] = useState('');
  // 视图模式：卡片（card） vs 列表（list）
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  // 选中的课程 ID
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);

  // 克隆弹窗状态
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [cloningCourse, setCloningCourse] = useState<CustomCourseData | null>(null);
  const [cloneCourseName, setCloneCourseName] = useState('');
  const [cloneMajor, setCloneMajor] = useState('人工智能/自建克隆');

  // 轻提示 Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 自动同步到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('uusima_custom_courses', JSON.stringify(courses));
    } catch (e) {
      console.error(e);
    }
  }, [courses]);

  // 获取所有参与建课的高校列表与教师列表
  const allSchools = ['全部', ...Array.from(new Set(courses.map(c => c.schoolName)))];
  const allCreators = ['全部', ...Array.from(new Set(courses.map(c => c.creator)))];
  const allCategories = ['全部', '专业核心课', '专业基础课', '行业应用课', '岗位技能认证'];

  // 过滤后的列表
  const filteredCourses = courses.filter(course => {
    // 状态过滤
    if (statusFilter !== '全部' && course.status !== statusFilter) return false;
    // 学校过滤
    if (selectedSchool !== '全部' && course.schoolName !== selectedSchool) return false;
    // 教师过滤
    if (selectedCreator !== '全部' && course.creator !== selectedCreator) return false;
    // 分类过滤
    if (selectedCategory !== '全部' && course.category !== selectedCategory) return false;
    // 搜索过滤
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(kw);
      const matchCreator = course.creator.toLowerCase().includes(kw);
      const matchSchool = course.schoolName.toLowerCase().includes(kw);
      const matchDesc = course.desc.toLowerCase().includes(kw);
      if (!matchTitle && !matchCreator && !matchSchool && !matchDesc) return false;
    }
    return true;
  });

  const isAllSelected = filteredCourses.length > 0 && filteredCourses.every(c => selectedCourseIds.includes(c.id));

  // 单选 / 反选
  const handleToggleSelectCourse = (id: number) => {
    setSelectedCourseIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 全选 / 取消全选
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIds = filteredCourses.map(c => c.id);
      setSelectedCourseIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredCourses.map(c => c.id);
      setSelectedCourseIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // 发布 / 下架状态切换
  const handleTogglePublish = (courseId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let nextStatus: '已发布' | '未发布' = '已发布';
    let targetTitle = '';

    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          nextStatus = c.status === '已发布' ? '未发布' : '已发布';
          targetTitle = c.title;
          return { ...c, status: nextStatus, updatedAt: new Date().toLocaleString() };
        }
        return c;
      })
    );

    showToast(`课程《${targetTitle}》状态已更新为【${nextStatus}】`);
  };

  // 批量发布 / 批量下架
  const handleBatchPublish = (publish: boolean) => {
    if (selectedCourseIds.length === 0) return;
    const targetStatus = publish ? '已发布' : '未发布';
    setCourses(prev =>
      prev.map(c => {
        if (selectedCourseIds.includes(c.id)) {
          return { ...c, status: targetStatus, updatedAt: new Date().toLocaleString() };
        }
        return c;
      })
    );
    showToast(`已批量将选中的 ${selectedCourseIds.length} 门自建课程设置为【${targetStatus}】`);
  };

  // 打开克隆弹窗
  const handleOpenCloneModal = (course: CustomCourseData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCloningCourse(course);
    // 默认名称是 课程名称 + 副本
    setCloneCourseName(`${course.title} 副本`);
    setCloneMajor(`人工智能/${course.category}`);
    setIsCloneModalOpen(true);
  };

  // 确认克隆并复制到系统课程管理中
  const handleConfirmClone = () => {
    if (!cloningCourse || !cloneCourseName.trim()) return;

    try {
      // 1. 获取现有系统课程列表
      const storedSysCourses = localStorage.getItem('uusima_system_courses');
      let sysCourses: any[] = [];
      if (storedSysCourses) {
        try {
          sysCourses = JSON.parse(storedSysCourses);
        } catch (err) {
          console.error(err);
        }
      }

      // 若系统课程库为空，则初始化一套默认标准系统课程
      if (!sysCourses || sysCourses.length === 0) {
        sysCourses = [
          { id: 1, title: '数据标注与处理（中职）', status: '已发布', major: '人工智能/基础', creator: '系统内置', createdAt: '2026-05-10 09:00:00', desc: '本课程是中等职业学校人工智能专业的专业基础课...', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
          { id: 2, title: '深度学习应用技术', status: '未发布', major: '人工智能/深度学习', creator: '系统内置', createdAt: '2026-06-12 14:30:00', desc: '深入浅出地讲解深度学习的基础技术与实际实训...', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
          { id: 3, title: '计算机视觉技术应用', status: '未发布', major: '人工智能/计算机视觉', creator: '系统内置', createdAt: '2026-07-01 16:20:00', desc: '熟悉计算机视觉技术应用与工程化场景部署...', env: 'UUSIMA', isAI: true, cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400' },
        ];
      }

      // 2. 构建克隆后的系统课程对象
      const newSysCourse = {
        id: Date.now(),
        title: cloneCourseName.trim(),
        status: '未发布', // 新克隆默认为未发布，供管理员二次审查与发布
        major: cloneMajor,
        creator: `${cloningCourse.creator} (${cloningCourse.schoolName})`, // 明确标注是谁创建
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        desc: `【克隆自${cloningCourse.schoolName}·${cloningCourse.creator}教师自建课】${cloningCourse.desc}`,
        env: 'UUSIMA',
        isAI: true,
        cover: cloningCourse.cover || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400',
        sourceCustomCourseId: cloningCourse.id,
        isClonedFromCustom: true
      };

      // 3. 追加到系统课程列表开头
      const updatedSysCourses = [newSysCourse, ...sysCourses];
      localStorage.setItem('uusima_system_courses', JSON.stringify(updatedSysCourses));

      // 触发跨页面事件通知
      window.dispatchEvent(new Event('uusima_system_courses_updated'));

      setIsCloneModalOpen(false);
      showToast(`课程已成功克隆至【系统课程管理】库，名称：《${newSysCourse.title}》`);

      if (onCloneSuccess) {
        onCloneSuccess(newSysCourse.title);
      }
    } catch (e) {
      console.error('克隆课程失败:', e);
      showToast('克隆操作失败，请重试');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Toast 提示 */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 顶部 Tab 栏与统计信息 */}
      <div className="px-6 pt-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex space-x-8">
          {(['全部', '已发布', '未发布'] as const).map(tab => {
            const count =
              tab === '全部'
                ? courses.length
                : courses.filter(c => c.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setSelectedCourseIds([]);
                }}
                className={`pb-3 text-sm font-semibold relative transition-colors flex items-center cursor-pointer ${
                  statusFilter === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
                <span
                  className={`ml-2 px-2 py-0.5 text-[11px] rounded-full font-medium ${
                    statusFilter === tab
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-3 mb-2">
          <span className="text-xs text-slate-500">
            涵盖 <strong className="text-blue-600 font-semibold">{allSchools.length - 1}</strong> 所合作高校 ·{' '}
            <strong className="text-blue-600 font-semibold">{allCreators.length - 1}</strong> 位名师自建课程
          </span>
        </div>
      </div>

      {/* 多维筛选栏与检索区 */}
      <div className="px-6 py-3 border-b border-slate-100 bg-white space-y-3 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* 高校筛选与教师筛选下拉 */}
          <div className="flex items-center space-x-4 flex-wrap gap-y-2">
            {/* 院校筛选 */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-500 font-medium flex items-center shrink-0">
                <School className="w-3.5 h-3.5 mr-1 text-slate-400" />
                开课院校：
              </span>
              <select
                value={selectedSchool}
                onChange={e => setSelectedSchool(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
              >
                {allSchools.map(school => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>

            {/* 创建教师筛选 */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-500 font-medium flex items-center shrink-0">
                <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                创建教师：
              </span>
              <select
                value={selectedCreator}
                onChange={e => setSelectedCreator(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
              >
                {allCreators.map(creator => (
                  <option key={creator} value={creator}>
                    {creator}
                  </option>
                ))}
              </select>
            </div>

            {/* 课程分类快速标签 */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-slate-500 font-medium mr-1 shrink-0">分类：</span>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧搜索框与视图模式切换 */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="relative w-64">
              <input
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="搜索课程名、高校、创建人..."
                className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-md outline-none focus:border-blue-500 bg-white placeholder:text-slate-400 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* 卡片 / 列表展示模式切换按钮组 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
              <button
                onClick={() => setViewMode('card')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="卡片展示模式"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">卡片</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="列表展示模式"
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-[11px]">列表</span>
              </button>
            </div>
          </div>
        </div>

        {/* 排序与批量全选栏 */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
          <div className="flex items-center space-x-4 text-slate-500">
            <span>当前筛选结果：<strong className="text-slate-800 font-semibold">{filteredCourses.length}</strong> 门课程</span>
            {(selectedSchool !== '全部' || selectedCreator !== '全部' || selectedCategory !== '全部' || searchKeyword) && (
              <button
                onClick={() => {
                  setSelectedSchool('全部');
                  setSelectedCreator('全部');
                  setSelectedCategory('全部');
                  setSearchKeyword('');
                }}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                重置所有筛选
              </button>
            )}
          </div>

          <label className="inline-flex items-center space-x-1.5 cursor-pointer hover:text-blue-600 select-none text-slate-600">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleSelectAll}
              className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span>全选当前 ({filteredCourses.length})</span>
          </label>
        </div>
      </div>

      {/* 批量操作工具条（当勾选课程时浮现） */}
      {selectedCourseIds.length > 0 && (
        <div className="mx-6 my-2 px-4 py-2 bg-blue-50/95 border border-blue-200 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-150 shadow-2xs flex-wrap gap-2 shrink-0">
          <div className="flex items-center space-x-3 text-xs text-slate-700">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
              {selectedCourseIds.length}
            </span>
            <span>
              已选择 <strong className="text-blue-600 font-bold">{selectedCourseIds.length}</strong> 门自建课程
            </span>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setSelectedCourseIds([])}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer underline"
            >
              取消选择
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBatchPublish(true)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>批量发布</span>
            </button>
            <button
              onClick={() => handleBatchPublish(false)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>批量取消发布</span>
            </button>
          </div>
        </div>
      )}

      {/* 核心展示区域：卡片模式 vs 列表模式 */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-50/60">
        {filteredCourses.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-slate-400">
            <BookOpen className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-sm">暂未找到符合条件的自建课程</p>
            <button
              onClick={() => {
                setStatusFilter('全部');
                setSelectedSchool('全部');
                setSelectedCreator('全部');
                setSelectedCategory('全部');
                setSearchKeyword('');
              }}
              className="mt-3 text-xs text-blue-600 hover:underline cursor-pointer"
            >
              重置筛选条件
            </button>
          </div>
        ) : viewMode === 'card' ? (
          /* ======================== 卡片视图 ======================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCourses.map(course => {
              const isSelected = selectedCourseIds.includes(course.id);
              const isPublished = course.status === '已发布';

              return (
                <div
                  key={course.id}
                  className={`rounded-xl overflow-hidden transition-all flex flex-col justify-between group relative bg-white border ${
                    isSelected
                      ? 'ring-2 ring-blue-500 shadow-md border-blue-400'
                      : 'border-slate-200/90 hover:border-blue-400 hover:shadow-lg'
                  }`}
                >
                  {/* 顶部标签栏：自建标识 + 发布状态 */}
                  <div className="absolute left-0 top-0 z-20 flex items-center shadow-xs">
                    <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-none flex items-center">
                      <Edit3 className="w-2.5 h-2.5 mr-1 stroke-[2.5]" />
                      自建课程
                    </div>
                    <div
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-br-lg flex items-center ${
                        isPublished
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700/95 text-slate-100'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1 ${
                          isPublished ? 'bg-white animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      {isPublished ? '已发布' : '未发布'}
                    </div>
                  </div>

                  {/* 右上角勾选 Checkbox */}
                  <div
                    className="absolute right-2 top-2 z-20"
                    onClick={e => e.stopPropagation()}
                  >
                    <div
                      className={`p-1 rounded-md cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white shadow-sm'
                          : 'bg-black/30 hover:bg-white/90 group-hover:bg-white/90'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectCourse(course.id)}
                        className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer block"
                      />
                    </div>
                  </div>

                  {/* 顶部封面大图与主题文字 */}
                  <div className="relative h-[125px] overflow-hidden select-none">
                    {course.cover ? (
                      <div className="w-full h-full relative">
                        <img
                          src={course.cover}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-3 text-white">
                          <div className="text-[13px] font-bold tracking-tight line-clamp-1 drop-shadow-sm">
                            {course.bannerText || course.title}
                          </div>
                          <div className="text-[10px] opacity-80 mt-0.5 truncate">
                            {course.bannerSub || course.category}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${course.gradient || 'from-blue-600 to-indigo-800'} p-3 flex flex-col justify-between text-white`}>
                        <div className="mt-5">
                          <div className="text-[13px] font-bold tracking-tight drop-shadow-xs">
                            {course.bannerText || course.title}
                          </div>
                          <div className="text-[10px] opacity-80 mt-0.5">
                            {course.bannerSub || course.category}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <BookOpen className="w-5 h-5 opacity-40" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 中间信息区：重点展示创建人与创建日期 */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* 标题 */}
                      <h4
                        className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors"
                        title={course.title}
                      >
                        {course.title}
                      </h4>

                      {/* 核心需求：展示谁创建、开课高校 */}
                      <div className="mt-2 flex items-center text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <User className="w-3 h-3 mr-1 text-blue-500 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate" title={`${course.creator} (${course.schoolName})`}>
                          {course.creator}
                        </span>
                        <span className="mx-1 text-slate-300">·</span>
                        <span className="text-slate-500 truncate" title={course.schoolName}>
                          {course.schoolName}
                        </span>
                      </div>

                      {/* 核心需求：展示创建日期 */}
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center truncate" title={`创建时间：${course.createdAt}`}>
                          <Calendar className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                          <span>创建于 {course.createdAt.split(' ')[0]}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium text-[10px]">
                          {course.category}
                        </span>
                      </div>

                      {/* 简介 */}
                      <p
                        className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed"
                        title={course.desc}
                      >
                        {course.desc}
                      </p>
                    </div>

                    {/* 底部操作行：支持编辑、发布/下架、以及克隆 */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      {/* 发布状态指示 */}
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 ${
                            isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-[11px] text-slate-500 font-medium">
                          {isPublished ? '已上线' : '草稿'}
                        </span>
                      </div>

                      {/* 操作按钮组 */}
                      <div className="flex items-center space-x-1.5">
                        {/* 编辑 */}
                        <button
                          onClick={() => onEditCourse(course)}
                          className="px-2 py-1 rounded border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-[11px] font-medium transition-colors flex items-center cursor-pointer shadow-2xs"
                          title="编辑自建课程内容与大纲"
                        >
                          <Edit3 className="w-3 h-3 mr-0.5" />
                          编辑
                        </button>

                        {/* 发布 / 下架 */}
                        <button
                          onClick={e => handleTogglePublish(course.id, e)}
                          className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors flex items-center cursor-pointer shadow-2xs ${
                            isPublished
                              ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700'
                              : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                          title={isPublished ? '下架该课程' : '发布该课程'}
                        >
                          {isPublished ? (
                            <>
                              <EyeOff className="w-3 h-3 mr-0.5" />
                              下架
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3 mr-0.5" />
                              发布
                            </>
                          )}
                        </button>

                        {/* 克隆（复制到系统课程管理） */}
                        <button
                          onClick={e => handleOpenCloneModal(course, e)}
                          className="px-2 py-1 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-semibold transition-colors flex items-center cursor-pointer shadow-2xs active:scale-95"
                          title="克隆此课程到系统标准课程管理库"
                        >
                          <Copy className="w-3 h-3 mr-0.5" />
                          克隆
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ======================== 列表视图（参考教师端自建课程列表高保真） ======================== */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold text-slate-500 select-none">
                    <th className="py-3 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 min-w-[280px]">课程名称与简介</th>
                    <th className="py-3 px-4 w-36">开课院校</th>
                    {/* 核心需求：显示课程是谁创建 */}
                    <th className="py-3 px-4 w-32">创建教师</th>
                    {/* 核心需求：显示创建日期 */}
                    <th className="py-3 px-4 w-36">创建日期</th>
                    <th className="py-3 px-4 w-28">所属分类</th>
                    <th className="py-3 px-4 w-28 text-center">课程状态</th>
                    <th className="py-3 px-4 w-52 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCourses.map(course => {
                    const isSelected = selectedCourseIds.includes(course.id);
                    const isPublished = course.status === '已发布';

                    return (
                      <tr
                        key={course.id}
                        onClick={() => handleToggleSelectCourse(course.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/60 hover:bg-blue-50/90' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* 复选框 */}
                        <td
                          className="py-3.5 px-4 text-center"
                          onClick={e => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectCourse(course.id)}
                            className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* 封面缩略图与课程信息 */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-14 h-10 rounded-lg shrink-0 overflow-hidden bg-slate-100 relative shadow-2xs border border-slate-200/80">
                              {course.cover ? (
                                <img
                                  src={course.cover}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${course.gradient || 'from-blue-600 to-indigo-800'} flex items-center justify-center text-white`}>
                                  <BookOpen className="w-5 h-5 opacity-80" />
                                </div>
                              )}
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center font-semibold py-0.2">
                                自建
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shrink-0">
                                  自建课
                                </span>
                                <h4
                                  className="text-xs font-bold text-slate-800 truncate hover:text-blue-600 transition-colors"
                                  title={course.title}
                                >
                                  {course.title}
                                </h4>
                              </div>
                              <p
                                className="text-[11px] text-slate-400 truncate mt-1"
                                title={course.desc}
                              >
                                {course.desc}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 开课院校 */}
                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="flex items-center space-x-1 font-medium">
                            <School className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">{course.schoolName}</span>
                          </div>
                        </td>

                        {/* 核心需求：显示是谁创建 */}
                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-1 font-medium text-slate-800">
                              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-semibold">{course.creator}</span>
                            </div>
                            {course.creatorRole && (
                              <span className="text-[10px] text-slate-400 truncate mt-0.5">
                                {course.creatorRole}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 核心需求：显示创建日期 */}
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                          <div className="flex items-center space-x-1 text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{course.createdAt}</span>
                          </div>
                        </td>

                        {/* 所属分类 */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                            {course.category}
                          </span>
                        </td>

                        {/* 课程状态 */}
                        <td
                          className="py-3.5 px-4 text-center"
                          onClick={e => e.stopPropagation()}
                        >
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              isPublished
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                              }`}
                            />
                            {isPublished ? '已发布' : '未发布'}
                          </span>
                        </td>

                        {/* 操作栏：支持编辑、发布、克隆 */}
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* 编辑 */}
                            <button
                              onClick={() => onEditCourse(course)}
                              className="px-2 py-1 rounded border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-medium transition-colors flex items-center cursor-pointer shadow-2xs"
                              title="编辑课程大纲与步骤"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              编辑
                            </button>

                            {/* 发布 / 下架 */}
                            <button
                              onClick={e => handleTogglePublish(course.id, e)}
                              className={`px-2 py-1 rounded border text-xs font-medium transition-colors flex items-center cursor-pointer shadow-2xs ${
                                isPublished
                                  ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700'
                                  : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold'
                              }`}
                              title={isPublished ? '点击下架' : '点击发布'}
                            >
                              {isPublished ? (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  下架
                                </>
                              ) : (
                                <>
                                  <Globe className="w-3 h-3 mr-1" />
                                  发布
                                </>
                              )}
                            </button>

                            {/* 克隆 */}
                            <button
                              onClick={e => handleOpenCloneModal(course, e)}
                              className="px-2.5 py-1 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors flex items-center cursor-pointer shadow-2xs active:scale-95"
                              title="克隆此课程到系统标准课程管理中"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              克隆
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ======================== 克隆弹窗（核心功能需求） ======================== */}
      {isCloneModalOpen && cloningCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 via-indigo-50/60 to-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">克隆自建课程到系统课程管理</h3>
                  <p className="text-[11px] text-slate-500">将优质教师自建课直接复制并转入系统标准课程库</p>
                </div>
              </div>
              <button
                onClick={() => setIsCloneModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 弹窗表单内容 */}
            <div className="p-6 space-y-4">
              {/* 原课程简况信息 */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">原自建课程：</span>
                  <span className="font-semibold text-slate-800">{cloningCourse.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">开课高校与教师：</span>
                  <span className="text-slate-700 font-medium">
                    {cloningCourse.schoolName} · {cloningCourse.creator} ({cloningCourse.creatorRole || '授课教师'})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">原建课日期：</span>
                  <span className="text-slate-500 font-mono">{cloningCourse.createdAt}</span>
                </div>
              </div>

              {/* 核心要求：弹窗提示填写课程名称，默认名称是课程名称+副本 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>系统课程名称（默认填入：课程名称+副本）
                </label>
                <input
                  type="text"
                  value={cloneCourseName}
                  onChange={e => setCloneCourseName(e.target.value)}
                  placeholder="请输入克隆后的系统课程名称"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  克隆后的课程将直接写入「课程管理 - 课程列表」，成为系统官方标准课程。
                </p>
              </div>

              {/* 目标专业/分类 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  目标所属专业/分类
                </label>
                <input
                  type="text"
                  value={cloneMajor}
                  onChange={e => setCloneMajor(e.target.value)}
                  placeholder="例如：人工智能/基础"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* 提示条款 */}
              <div className="flex items-start space-x-2 text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-md border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                <span>
                  提示：克隆生成的系统标准课程将保留原课的章节、教学大纲与技能图谱实验配置，默认状态为“未发布”，可由管理员在系统课程管理中进一步审核并发布。
                </span>
              </div>
            </div>

            {/* 弹窗底部操作 */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setIsCloneModalOpen(false)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmClone}
                disabled={!cloneCourseName.trim()}
                className={`px-4 py-1.5 text-xs font-semibold text-white rounded-md transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                  cloneCourseName.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>确认克隆并复制到系统课程管理</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
