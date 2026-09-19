import React, { useState } from 'react';
import { 
  Home, 
  Hourglass, 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen,
  Search,
  CheckSquare,
  CheckCircle2,
  Clock,
  Timer,
  FileText,
  Languages,
  ChevronDown,
  User,
  UserCircle,
  Settings,
  LogOut,
  Activity,
  ChevronRight,
  Book,
  LayoutGrid,
  Tag,
  Database,
  PieChart,
  Shield,
  Trophy,
  UserCheck,
  PanelLeftClose,
  PanelLeft,
  ChevronUp,
  Package,
  Sparkles,
  Calendar,
  Layers,
  Award,
  BarChart3,
  X,
  Check,
  School,
  ArrowRight,
  UploadCloud,
  Plus,
  SlidersHorizontal,
  Send,
  Edit3,
  Cpu,
  Terminal,
  Copy,
  Code2,
  List,
  Lock,
  Unlock
} from 'lucide-react';
import CourseManagement from '../course/CourseManagement';
import UsersManagement from '../system/UsersManagement';
import OrdersManagement from '../operation/OrdersManagement';
import TeacherTeaching from './TeacherTeaching';
import StudentStudies from './StudentStudies';
import TeacherCourseEditor from '../course/TeacherCourseManagement/TeacherCourseEditor';
import { QuestionManagement, AutoGradingManagement } from '../course';

// 角色标识类型
export type UserRole = 'student' | 'teacher' | 'school_admin' | 'course_developer' | 'super_admin';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  children?: MenuItem[];
}

interface RoleDefinition {
  id: UserRole;
  name: string;
  tag: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
  icon: any;
  avatarLabel: string;
  menuSummary: string[];
  defaultMenu: string;
}

const ROLES: RoleDefinition[] = [
  {
    id: 'student',
    name: '学生',
    tag: '学习实践端',
    desc: '课程学习、任务实验、自学进度与个人考试管理',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    badgeText: 'bg-emerald-500',
    icon: GraduationCap,
    avatarLabel: '学生',
    menuSummary: ['学生主页', '我的考试', '我的学习'],
    defaultMenu: 'student-home'
  },
  {
    id: 'teacher',
    name: '教师',
    tag: '教学教研端',
    desc: '主讲课程、教学排课、实验批阅与班级学情统计',
    badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
    badgeText: 'bg-blue-500',
    icon: UserCheck,
    avatarLabel: '教师',
    menuSummary: ['教师主页', '我的课程', '我的教学'],
    defaultMenu: 'teacher-home'
  },
  {
    id: 'school_admin',
    name: '学校管理员',
    tag: '学校管理端',
    desc: '本校组织架构、师生成员、订购信息与统考调度',
    badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
    badgeText: 'bg-purple-500',
    icon: School,
    avatarLabel: '校管',
    menuSummary: ['成员管理', '订购信息查询', '教学管理', '考试竞赛'],
    defaultMenu: 'members'
  },
  {
    id: 'course_developer',
    name: '课程开发人员',
    tag: '课程研发展现端',
    desc: '负责课程体系建设与课程模块包维护',
    badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    badgeText: 'bg-indigo-500',
    icon: Code2,
    avatarLabel: '课开',
    menuSummary: ['课程管理', '课程模块包'],
    defaultMenu: 'course-list'
  },
  {
    id: 'super_admin',
    name: '超级管理员',
    tag: '全平台运维端',
    desc: '全系统课程、题库、成员、订购、运营及全局管理功能',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    badgeText: 'bg-amber-500',
    icon: Shield,
    avatarLabel: '超管',
    menuSummary: ['显示所有菜单（15+项功能模块）'],
    defaultMenu: 'course-list'
  }
];

// 教师角色-基础已购课程数据
const TEACHER_PURCHASED_COURSES = [
  {
    id: 1,
    title: 'AI学伴-功能演示',
    category: '人工智能',
    time: '2026-09-15 22:13:54',
    desc: '课程简介：AI学伴（演示）Python编程与理论',
    type: '岗位技能认证',
    bannerText: '新大陆时代科技',
    bannerSub: 'Newland Era Hi-Tech',
    theme: 'blue-gradient',
    allowSelfStudy: true
  },
  {
    id: 2,
    title: '自然语言处理技术与应用',
    category: '自然语言处理',
    time: '2026-09-15 18:20:14',
    desc: '课程简介：本模块介绍自然语言处理的基本理论、技术及应...',
    type: '专业核心课',
    bannerText: '自然语言处理',
    bannerSub: '技术与应用',
    theme: 'deep-blue',
    allowSelfStudy: true
  },
  {
    id: 3,
    title: '智慧行业应用开发-牧场、家居、温室',
    category: '行业应用',
    time: '2026-09-15 16:44:56',
    desc: '课程简介：本模块以智慧农业中的物联网实训为核心，面向...',
    type: '行业应用课',
    bannerText: '智慧行业应用开发',
    bannerSub: '牧场、家居、温室',
    theme: 'cyber-purple',
    allowSelfStudy: true
  },
  {
    id: 4,
    title: '应用系统现代代设计开发',
    category: '专属课程',
    time: '2026-09-15 12:31:54',
    desc: '课程简介：本课程以《智能系统》实训为基础，贯穿Node...',
    type: '专业基础课',
    bannerText: '新大陆时代科技',
    bannerSub: 'Newland Era Hi-Tech',
    theme: 'blue-gradient',
    allowSelfStudy: false
  },
  {
    id: 5,
    title: 'AI学伴-人工智能训练师（高级工）软件版',
    category: '机器学习',
    time: '2026-09-15 10:48:06',
    desc: '课程简介：人工智能训练师（高级工）',
    type: '岗位认证课',
    bannerText: '新大陆时代科技',
    bannerSub: 'Newland Era Hi-Tech',
    theme: 'blue-gradient',
    allowSelfStudy: true
  },
  {
    id: 6,
    title: '工业互联网关键技术',
    category: '工业互联网技术',
    time: '2026-09-10 09:59:25',
    desc: '课程简介：工业互联网关键技术',
    type: '专业核心课',
    bannerText: '新大陆时代科技',
    bannerSub: 'Newland Era Hi-Tech',
    theme: 'blue-gradient',
    allowSelfStudy: true
  },
  {
    id: 7,
    title: '工业物联网数据采集技术',
    category: '行业数据分析',
    time: '2026-09-08 00:00:43',
    desc: '课程简介：工业物联网数据采集技术',
    type: '专业基础课',
    bannerText: '新大陆时代科技',
    bannerSub: 'Newland Era Hi-Tech',
    theme: 'blue-gradient',
    allowSelfStudy: true
  },
  {
    id: 8,
    title: '智慧水务应用开发',
    category: '行业应用',
    time: '2026-08-20 10:48:23',
    desc: '课程简介：智慧水务应用开发',
    type: '行业应用课',
    bannerText: '智慧水务应用开发',
    bannerSub: '智能水质调度实训',
    theme: 'cyber-purple',
    allowSelfStudy: true
  },
  {
    id: 9,
    title: '智慧行业应用开发-牧场、家居、温室',
    category: '行业应用',
    time: '2026-07-15 17:17:00',
    desc: '课程简介：本模块面向智能牧场、智能家居物联网研发一个...',
    type: '行业应用课',
    bannerText: '智慧行业应用开发',
    bannerSub: '牧场、家居、温室',
    theme: 'cyber-purple',
    allowSelfStudy: true
  },
  {
    id: 10,
    title: '智能制造装备与系统',
    category: '智能制造',
    time: '2026-07-15 17:10:46',
    desc: '课程简介：智能制造',
    type: '专业核心课',
    bannerText: '智慧行业应用开发',
    bannerSub: '牧场、家居、温室',
    theme: 'cyber-purple',
    allowSelfStudy: false
  },
  {
    id: 11,
    title: '智能网联汽车实训平台V1.1',
    category: '智能网联',
    time: '2026-06-03 17:06:46',
    desc: '课程简介：本课程以“智慧园区”真实项目为背景，本...',
    type: '技能竞赛',
    bannerText: '新大陆时代科技',
    bannerSub: 'Newland Era Hi-Tech',
    theme: 'blue-gradient',
    allowSelfStudy: true
  },
  {
    id: 12,
    title: '数字化设计与制造',
    category: '数字化转型',
    time: '2026-05-30 11:14:42',
    desc: '课程简介：数字化设计',
    type: '基础素质',
    bannerText: '新大陆时代科技',
    bannerSub: 'Newland Era Hi-Tech',
    theme: 'blue-gradient',
    allowSelfStudy: true
  }
];

export default function Personal({ 
  onNavigate,
  initialRole,
  initialMenu
}: { 
  onNavigate?: (view: string) => void;
  initialRole?: UserRole;
  initialMenu?: string;
}) {
  // 当前角色，默认为学生，可随时弹窗切换
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole || 'student');
  // 首次进入我的主页，若未指定明确的初始菜单，则弹窗让用户选择角色
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(!initialRole && !initialMenu);
  const [activeMenu, setActiveMenu] = useState(initialMenu || 'student-home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCourseManagementOpen, setIsCourseManagementOpen] = useState(true);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(true);
  
  // 顶部与用户信息状态
  const [activeTeachingTab, setActiveTeachingTab] = useState('进行中');
  const [activeTaskListTab, setActiveTaskListTab] = useState('进行中');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const activeTenant = { name: "新大陆教育行业云" };

  // 我的课程状态（支持 全部 / 已购课程 / 自建课程，默认卡片展示）
  const [teachingCourseTab, setTeachingCourseTab] = useState<'all' | 'purchased' | 'custom'>('all');
  const [courseViewMode, setCourseViewMode] = useState<'card' | 'list'>('card');
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [selectedCourseType, setSelectedCourseType] = useState('全部');
  const [activeCourseSort, setActiveCourseSort] = useState('默认排序');
  const [courseSearchKeyword, setCourseSearchKeyword] = useState('');
  const [isCourseFilterExpanded, setIsCourseFilterExpanded] = useState(false);
  const [editingTeacherCourse, setEditingTeacherCourse] = useState<any | null>(null);

  // 状态化已购课程数据（支持动态修改学生自学权限）
  const [purchasedCourses, setPurchasedCourses] = useState(TEACHER_PURCHASED_COURSES);

  // 创建课程与任务下发弹窗状态
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedCourseForDispatch, setSelectedCourseForDispatch] = useState<any>(null);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('专业核心课');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [isCopyFromExisting, setIsCopyFromExisting] = useState(false);
  const [selectedSourceCourse, setSelectedSourceCourse] = useState<any>(null);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [dropdownSearchKeyword, setDropdownSearchKeyword] = useState('');
  const [dispatchSelectedClass, setDispatchSelectedClass] = useState('计算机2101班');
  const [dispatchTaskName, setDispatchTaskName] = useState('');
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState('');

  // 自建课程数据列表（增加 allowSelfStudy 属性）
  const [customCourses, setCustomCourses] = useState([
    {
      id: 101,
      title: 'Python程序设计进阶与网络爬虫',
      category: '专业核心课',
      time: '2026-09-12 14:00:00',
      desc: '课程简介：计算机学院自建课程，聚焦异步并发爬虫、数据清洗与Scrapy实训。',
      gradient: 'from-blue-500 to-indigo-600',
      bannerText: 'Python进阶与爬虫',
      bannerSub: '校本特色实战',
      isCustom: true,
      allowSelfStudy: true
    },
    {
      id: 102,
      title: '深度学习实训：目标检测与YOLO项目',
      category: '行业应用课',
      time: '2026-09-02 09:30:00',
      desc: '课程简介：计算机视觉方向自建实训项目，含工业质检缺陷识别与自动评分。',
      gradient: 'from-indigo-600 to-purple-600',
      bannerText: '深度学习实训',
      bannerSub: 'YOLOv8目标检测',
      isCustom: true,
      allowSelfStudy: true
    },
    {
      id: 103,
      title: '边缘计算与智能网关协议开发',
      category: '专业基础课',
      time: '2026-08-25 16:20:00',
      desc: '课程简介：本校教师自研网关开发实验，覆盖Modbus、MQTT上云与边缘推理。',
      gradient: 'from-cyan-500 to-blue-600',
      bannerText: '边缘计算与智能网关',
      bannerSub: '协议开发与上云',
      isCustom: true,
      allowSelfStudy: false
    }
  ]);

  // 单门课程快速切换学生自学权限
  const handleToggleCourseSelfStudy = (courseId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updatedTitle = '';
    let nextStatus = false;

    setPurchasedCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        updatedTitle = c.title;
        nextStatus = !c.allowSelfStudy;
        return { ...c, allowSelfStudy: nextStatus };
      }
      return c;
    }));

    setCustomCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        updatedTitle = c.title;
        nextStatus = !c.allowSelfStudy;
        return { ...c, allowSelfStudy: nextStatus };
      }
      return c;
    }));

    setDispatchSuccessToast(`课程《${updatedTitle}》已${nextStatus ? '允许' : '禁止'}学生自主学习`);
    setTimeout(() => setDispatchSuccessToast(''), 3000);
  };

  // 批量为课程设置学生自学权限
  const handleBatchSetSelfStudy = (allow: boolean) => {
    if (selectedCourseIds.length === 0) return;
    const count = selectedCourseIds.length;

    setPurchasedCourses(prev => prev.map(c => {
      if (selectedCourseIds.includes(c.id)) {
        return { ...c, allowSelfStudy: allow };
      }
      return c;
    }));

    setCustomCourses(prev => prev.map(c => {
      if (selectedCourseIds.includes(c.id)) {
        return { ...c, allowSelfStudy: allow };
      }
      return c;
    }));

    setSelectedCourseIds([]);
    setDispatchSuccessToast(`已成功将选中的 ${count} 门课程批量设置为【${allow ? '允许学生自学' : '禁止学生自学'}】`);
    setTimeout(() => setDispatchSuccessToast(''), 3500);
  };

  // 勾选/取消勾选课程
  const handleToggleSelectCourse = (courseId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCourseIds(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  // 全选/反选当前筛选列表的所有课程
  const handleToggleSelectAll = (filteredIds: number[]) => {
    const isAllSelected = filteredIds.length > 0 && filteredIds.every(id => selectedCourseIds.includes(id));
    if (isAllSelected) {
      setSelectedCourseIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedCourseIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const currentRoleInfo = ROLES.find(r => r.id === currentRole) || ROLES[0];

  // 切换角色处理
  const handleSelectRole = (roleId: UserRole) => {
    setCurrentRole(roleId);
    const targetRole = ROLES.find(r => r.id === roleId);
    if (targetRole) {
      setActiveMenu(targetRole.defaultMenu);
    }
    setIsRoleModalOpen(false);
  };

  // 根据当前角色生成对应的侧边栏菜单
  const getSidebarItems = (): MenuItem[] => {
    switch (currentRole) {
      case 'student':
        return [
          { id: 'student-home', label: '学生主页', icon: Home },
          { id: 'my-exams', label: '我的考试', icon: Hourglass },
          { id: 'my-studies', label: '我的学习', icon: BookOpen }
        ];
      case 'teacher':
        return [
          { id: 'teacher-home', label: '教师主页', icon: UserCheck },
          { id: 'my-courses', label: '我的课程', icon: Book },
          { id: 'my-teaching', label: '我的教学', icon: Layers }
        ];
      case 'school_admin':
        return [
          { id: 'members', label: '成员管理', icon: Users },
          { id: 'orders', label: '订购信息查询', icon: Package },
          { id: 'teaching', label: '教学管理', icon: BookOpen },
          { id: 'exams', label: '考试竞赛', icon: Trophy }
        ];
      case 'course_developer':
        return [
          {
            id: 'course-management',
            label: '课程管理',
            icon: Book,
            children: [
              { id: 'course-list', label: '课程列表', icon: Book },
              { 
                id: 'questions', 
                label: '题库管理', 
                icon: Database,
                children: [
                  { id: 'question-list', label: '试题管理', icon: FileText }
                ]
              },
              { id: 'auto-grading', label: '自动评分', icon: Clock }
            ]
          },
          { id: 'course-packages', label: '课程模块包', icon: LayoutGrid }
        ];
      case 'super_admin':
      default:
        return [
          {
            id: 'course-management',
            label: '课程管理',
            icon: Book,
            children: [
              { id: 'course-list', label: '课程列表', icon: Book },
              { 
                id: 'questions', 
                label: '题库管理', 
                icon: Database,
                children: [
                  { id: 'question-list', label: '试题管理', icon: FileText }
                ]
              },
              { id: 'auto-grading', label: '自动评分', icon: Clock }
            ]
          },
          { id: 'course-packages', label: '课程模块包', icon: LayoutGrid },
          { id: 'tags', label: '标签管理', icon: Tag },
          { id: 'admin-home', label: '管理员主页', icon: Home },
          { id: 'operations', label: '运营管理', icon: PieChart },
          { id: 'system-admin', label: '系统管理员主页', icon: Shield },
          { id: 'exams', label: '考试竞赛', icon: Trophy },
          { id: 'members', label: '成员管理', icon: Users },
          { id: 'orders', label: '订购信息查询', icon: Package },
          { id: 'account', label: '账户管理', icon: User },
          { id: 'teaching', label: '教学管理', icon: BookOpen },
          { id: 'teacher-home', label: '教师主页', icon: UserCheck },
          { id: 'student-home', label: '学生主页', icon: GraduationCap },
        ];
    }
  };

  const sidebarItems = getSidebarItems();

  // 课程搜索下拉组件
  const CourseSearchDropdown = ({ placeholder = "请输入课程名称进行搜索" }: { placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const courses = ['自然语言处理技术与应用', 'Python程序设计进阶', '机器学习基础', '深度学习原理', '计算机视觉实战'];
    const filtered = courses.filter(c => c.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="relative w-64 z-10">
        <div className="flex items-center border border-slate-200 rounded-md bg-white w-full overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
          <div className="pl-3 pr-2 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder={placeholder}
            className="w-full py-1.5 text-xs outline-none text-slate-600 bg-transparent"
          />
          <div 
            className="px-2 border-l border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-slate-100 h-full" 
            onMouseDown={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filtered.length > 0 ? filtered.map((c, idx) => (
              <div 
                key={idx}
                className="px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearch(c);
                  setIsOpen(false);
                }}
              >
                {c}
              </div>
            )) : (
              <div className="px-3 py-2 text-xs text-slate-400 text-center">无匹配课程</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const mockCourses = [
    {
      id: 1,
      title: '自然语言处理技术与应用17888340735441',
      courseName: '自然语言处理技术与应用',
      progress: 0,
      lastProgress: '1-6 任务2 中文文本分词方法与工具使用 （理论）',
      issueTime: '2023-09-01 10:00',
      lastStudyTime: '2023-09-15 14:30',
      cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300&h=200'
    },
    {
      id: 2,
      title: 'Python程序设计进阶任务202308',
      courseName: 'Python程序设计进阶',
      progress: 45,
      lastProgress: '2-1 面向对象编程基础',
      issueTime: '2023-08-20 09:00',
      lastStudyTime: '2023-09-14 16:20',
      cover: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=300&h=200'
    }
  ];

  const CourseCard = ({ course }: { course: typeof mockCourses[0]; key?: React.Key }) => (
    <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      <div className="w-full h-[140px] shrink-0 bg-blue-50 relative">
        <img src={course.cover} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-1" title={course.title}>{course.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{course.courseName}</p>
          
          <div className="flex items-center space-x-2 mt-3">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
            <span className="text-xs text-slate-500 w-8">{course.progress}%</span>
          </div>
          
          <div className="text-xs text-slate-500 mt-2 line-clamp-1" title={`上次进度：${course.lastProgress}`}>
            上次进度：{course.lastProgress}
          </div>
          
          <div className="text-[10px] text-slate-400 mt-1.5 flex flex-col space-y-0.5">
            <span>下发时间：{course.issueTime}</span>
            <span>最近学习：{course.lastStudyTime}</span>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => onNavigate && onNavigate('course-learning')}
            className="bg-[#4a8df8] hover:bg-blue-600 text-white text-xs px-5 py-2 rounded transition-colors"
          >
            继续学习
          </button>
        </div>
      </div>
    </div>
  );

  // 1. 学生主页视图
  const renderStudentHome = () => (
    <div className="p-6 space-y-6 overflow-y-auto flex-1">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-8 flex items-center justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center space-x-12 z-10">
          <h1 className="text-xl font-bold text-slate-800">
            Hi, <span className="mx-1">杨振邦</span> 同学 欢迎回来~
          </h1>
          
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">班级</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">人工智能2024级1班</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">学院</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">信息与软件工程学院</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">专业</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">计算机科学与技术</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none flex items-center justify-end pr-8">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20 L15 10 L20 20 L30 25 L20 30 L15 40 L10 30 L0 25 Z" fill="#93c5fd" />
              <path d="M80 80 L83 75 L86 80 L91 82 L86 84 L83 89 L80 84 L75 82 Z" fill="#93c5fd" />
              <rect x="25" y="25" width="45" height="55" rx="4" fill="#3b82f6" transform="rotate(-10 50 50)" />
              <rect x="35" y="30" width="45" height="55" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" transform="rotate(5 50 50)" />
              <path d="M45 55 L52 62 L65 45" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" transform="rotate(5 50 50)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">待办任务</p>
            <p className="text-2xl font-bold text-slate-800">2 <span className="text-sm font-normal text-slate-500">个</span></p>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
            <div className="absolute inset-0 bg-blue-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">已完成任务</p>
            <p className="text-2xl font-bold text-slate-800">12 <span className="text-sm font-normal text-slate-500">个</span></p>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-100 rounded-lg transform rotate-3"></div>
            <div className="absolute inset-0 bg-emerald-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">已用时长</p>
            <p className="text-2xl font-bold text-slate-800">380 <span className="text-sm font-normal text-slate-500">分钟</span></p>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-100 rounded-lg transform rotate-3"></div>
            <div className="absolute inset-0 bg-amber-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">剩余时长</p>
            <p className="text-2xl font-bold text-slate-800">1200 <span className="text-sm font-normal text-slate-500">分钟</span></p>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-100 rounded-lg transform rotate-3"></div>
            <div className="absolute inset-0 bg-cyan-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
              <Timer className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">实验报告数</p>
            <p className="text-2xl font-bold text-slate-800">8 <span className="text-sm font-normal text-slate-500">份</span></p>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-100 rounded-lg transform rotate-3"></div>
            <div className="absolute inset-0 bg-purple-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-[500px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">我的任务</h2>
            <CourseSearchDropdown placeholder="检索任务课程..." />
          </div>
          
          <div className="flex space-x-3 mt-5">
            {['进行中', '已完成'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTeachingTab(tab)}
                className={`px-5 py-1.5 rounded-md text-sm transition-colors ${
                  activeTeachingTab === tab 
                    ? 'bg-[#e6f0ff] text-blue-600 font-medium' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex-1 mt-5 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {mockCourses.map(course => (
                <CourseCard key={`left-${course.id}`} course={course} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-[500px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">我的自学</h2>
            <CourseSearchDropdown placeholder="检索自学课程..." />
          </div>
          
          <div className="flex space-x-3 mt-5">
            {['进行中', '已完成'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTaskListTab(tab)}
                className={`px-5 py-1.5 rounded-md text-sm transition-colors ${
                  activeTaskListTab === tab 
                    ? 'bg-[#e6f0ff] text-blue-600 font-medium' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex-1 mt-5 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {mockCourses.map(course => (
                <CourseCard key={`task-${course.id}`} course={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. 教师主页视图
  const renderTeacherHome = () => (
    <div className="p-6 space-y-6 overflow-y-auto flex-1">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-xl p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs backdrop-blur-sm">教师授课工作台</span>
            <span className="text-xs text-blue-100">2024年秋季学期</span>
          </div>
          <h1 className="text-2xl font-bold">
            杨振邦 老师，新学期教学愉快！
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            本学期负责《自然语言处理技术与应用》、《深度学习基础》等 3 门核心课程，共有 186 名学生正在修读。
          </p>
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-20 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* 教学数据指标 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs">主讲课程</span>
            <Book className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">3 <span className="text-xs text-slate-400 font-normal">门</span></div>
          <p className="text-[11px] text-emerald-600 mt-2 flex items-center">已发布实验 24 个</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs">授课班级</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">4 <span className="text-xs text-slate-400 font-normal">个班级</span></div>
          <p className="text-[11px] text-slate-400 mt-2">覆盖学生 186 人</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs">待批改实验报告</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">18 <span className="text-xs text-slate-400 font-normal">份</span></div>
          <p className="text-[11px] text-amber-600 mt-2">近3日内需完成审阅</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs">班级平均完成度</span>
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">76.8 <span className="text-xs text-slate-400 font-normal">%</span></div>
          <p className="text-[11px] text-emerald-600 mt-2">较上周增长 +5.2%</p>
        </div>
      </div>

      {/* 快捷操作与班级教学活动 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">我负责的授课班级</h3>
            <button 
              onClick={() => setActiveMenu('my-courses')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-medium"
            >
              课程管理 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: '计算机2101班', course: '自然语言处理技术与应用', students: 48, rate: 82, status: '上课中' },
              { name: '人工智能2203班', course: '深度学习原理与实训', students: 45, rate: 74, status: '实验中' },
              { name: '软件工程2201班', course: 'Python程序设计进阶', students: 50, rate: 69, status: '待开始' },
              { name: '大数据应用2202班', course: '智能实验分析导论', students: 43, rate: 91, status: '已完成' },
            ].map((cls, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800">{cls.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">{cls.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cls.course} · {cls.students}人</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">{cls.rate}%</span>
                  <p className="text-[10px] text-slate-400">完成率</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg mt-4 border border-dashed border-slate-200">
            <div className="flex items-center text-xs text-slate-600 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              下一次课程：明日 09:00 - 10:40
            </div>
            <p className="text-xs text-slate-400">《自然语言处理技术与应用》计算机2101班 (机房A302)</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. 考试竞赛通用视图
  const renderExamsView = () => (
    <div className="p-6 space-y-6 overflow-y-auto flex-1">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">考试与竞赛中心</h2>
          <p className="text-xs text-slate-500 mt-1">包含理论期末统考、技能考核以及高校学科竞赛等任务</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center">
          <Trophy className="w-4 h-4 mr-1.5" /> 参加模拟测试
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { title: '2024秋季自然语言处理期末统考', type: '期末考试', time: '2024-12-20 14:00 - 16:00', duration: '120分钟', status: '未开始', tagColor: 'bg-blue-100 text-blue-700' },
          { title: '全国大学生人工智能创新大赛校内选拔赛', type: '学科竞赛', time: '2024-11-15 09:00 - 18:00', duration: '9小时', status: '报名中', tagColor: 'bg-amber-100 text-amber-700' },
          { title: 'Python程序设计阶段性实训考核', type: '技能考查', time: '2024-10-10 10:00 - 11:30', duration: '90分钟', status: '已结束', tagColor: 'bg-slate-100 text-slate-600' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${item.tagColor}`}>{item.type}</span>
                <span className="text-xs font-semibold text-slate-400">{item.status}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-800 mb-2">{item.title}</h3>
              <div className="space-y-1 text-xs text-slate-500">
                <p>考试时间：{item.time}</p>
                <p>考试时长：{item.duration}</p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">总分：100分</span>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">查看详情 →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 4. 我的学习 / 教学管理通用视图
  const renderSimplePlaceholder = (title: string, subTitle: string) => (
    <div className="p-8 flex-1 flex flex-col items-center justify-center bg-slate-50 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1.5 max-w-md">{subTitle}</p>
      <div className="mt-6 flex space-x-3">
        <button 
          onClick={() => setActiveMenu(currentRoleInfo.defaultMenu)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          返回当前主页
        </button>
        <button 
          onClick={() => setIsRoleModalOpen(true)}
          className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
        >
          切换其他身份
        </button>
      </div>
    </div>
  );

  // 5. 教师-我的课程视图（支持列表与卡片展示切换、批量为课程设置学生自学权限）
  const renderTeacherCoursesView = () => {
    // 若当前正在编辑自建课程，渲染教师端专属自建课程编辑器
    if (editingTeacherCourse) {
      return (
        <TeacherCourseEditor 
          course={editingTeacherCourse} 
          onBack={() => setEditingTeacherCourse(null)}
          onUpdateCourse={(updatedCourse) => {
            setCustomCourses(prev => prev.map(c => c.id === updatedCourse.id ? { ...c, ...updatedCourse } : c));
            setEditingTeacherCourse(updatedCourse);
          }}
        />
      );
    }

    const courseTypes = [
      '全部',
      '岗位技能认证',
      '基础素质',
      '专业基础课',
      '专业核心课',
      '行业应用课',
      '技能竞赛',
      '岗位认证课'
    ];

    // 当前列表源（全部 / 已购课程 / 自建课程）
    let sourceList: any[] = [];
    if (teachingCourseTab === 'all') {
      sourceList = [...purchasedCourses, ...customCourses];
    } else if (teachingCourseTab === 'purchased') {
      sourceList = purchasedCourses;
    } else {
      sourceList = customCourses;
    }

    // 过滤逻辑
    const filteredCourses = sourceList.filter(c => {
      const matchType = selectedCourseType === '全部' || c.type === selectedCourseType || c.category.includes(selectedCourseType);
      const matchSearch = !courseSearchKeyword || c.title.toLowerCase().includes(courseSearchKeyword.toLowerCase()) || c.desc.toLowerCase().includes(courseSearchKeyword.toLowerCase());
      return matchType && matchSearch;
    });

    const isAllFilteredSelected = filteredCourses.length > 0 && filteredCourses.every(c => selectedCourseIds.includes(c.id));

    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* 顶部 Tab 栏（全部 vs 已购课程 vs 自建课程）与 创建课程按钮 */}
        <div className="px-6 pt-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setTeachingCourseTab('all');
                setSelectedCourseIds([]);
              }}
              className={`pb-3 text-sm font-semibold relative transition-colors flex items-center cursor-pointer ${
                teachingCourseTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部
              <span className={`ml-2 px-2 py-0.2 text-[11px] rounded-full font-medium ${
                teachingCourseTab === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {purchasedCourses.length + customCourses.length}
              </span>
            </button>

            <button
              onClick={() => {
                setTeachingCourseTab('purchased');
                setSelectedCourseIds([]);
              }}
              className={`pb-3 text-sm font-semibold relative transition-colors flex items-center cursor-pointer ${
                teachingCourseTab === 'purchased'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              已购课程
              <span className={`ml-2 px-2 py-0.2 text-[11px] rounded-full font-medium ${
                teachingCourseTab === 'purchased' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {purchasedCourses.length}
              </span>
            </button>

            <button
              onClick={() => {
                setTeachingCourseTab('custom');
                setSelectedCourseIds([]);
              }}
              className={`pb-3 text-sm font-semibold relative transition-colors flex items-center cursor-pointer ${
                teachingCourseTab === 'custom'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              自建课程
              <span className={`ml-2 px-2 py-0.2 text-[11px] rounded-full font-medium ${
                teachingCourseTab === 'custom' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {customCourses.length}
              </span>
            </button>
          </div>

          {/* 创建课程按钮（自建课程及全部视图下均提供快捷入口） */}
          {(teachingCourseTab === 'custom' || teachingCourseTab === 'all') && (
            <button
              onClick={() => {
                setNewCourseName('');
                setNewCourseDesc('');
                setIsCopyFromExisting(false);
                setSelectedSourceCourse(null);
                setIsCourseDropdownOpen(false);
                setDropdownSearchKeyword('');
                setIsCreateCourseModalOpen(true);
              }}
              className="mb-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors flex items-center shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              创建自建课程
            </button>
          )}
        </div>

        {/* 筛选、搜索与视图切换栏 */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            {/* 课程类型标签列表 */}
            <div className="flex items-center space-x-1.5 text-xs flex-1 flex-wrap gap-y-1.5">
              <span className="text-slate-500 font-medium mr-1 shrink-0">课程类型：</span>
              {courseTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedCourseType(t)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedCourseType === t
                      ? 'bg-[#1890ff] text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* 右侧搜索框、展开与视图切换模式（卡片 vs 列表，默认卡片） */}
            <div className="flex items-center space-x-3 shrink-0 ml-4">
              <div className="relative w-60">
                <input
                  type="text"
                  value={courseSearchKeyword}
                  onChange={(e) => setCourseSearchKeyword(e.target.value)}
                  placeholder="请输入课程名进行搜索"
                  className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-md outline-none focus:border-blue-500 bg-white placeholder:text-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => setIsCourseFilterExpanded(!isCourseFilterExpanded)}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center shrink-0 cursor-pointer"
              >
                <span>展开</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${isCourseFilterExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* 卡片 / 列表展示模式切换按钮组（默认卡片） */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <button
                  onClick={() => setCourseViewMode('card')}
                  className={`px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                    courseViewMode === 'card'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="卡片展示视图（默认）"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="text-[11px]">卡片</span>
                </button>
                <button
                  onClick={() => setCourseViewMode('list')}
                  className={`px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                    courseViewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="列表展示视图"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="text-[11px]">列表</span>
                </button>
              </div>
            </div>
          </div>

          {/* 排序与全选控制行 */}
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 text-xs">
            <div className="flex items-center space-x-6">
              {['默认排序', '最新', '引用最多'].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveCourseSort(s)}
                  className={`transition-colors cursor-pointer ${
                    activeCourseSort === s ? 'text-[#1890ff] font-semibold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* 批量全选当前筛选结果 */}
            <div className="flex items-center space-x-3 text-xs text-slate-600">
              <label className="inline-flex items-center space-x-1.5 cursor-pointer hover:text-blue-600 select-none">
                <input
                  type="checkbox"
                  checked={isAllFilteredSelected}
                  onChange={() => handleToggleSelectAll(filteredCourses.map(c => c.id))}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span>全选当前 ({filteredCourses.length})</span>
              </label>
            </div>
          </div>
        </div>

        {/* 批量操作浮动工具栏（当选中课程数 > 0 时动态弹出） */}
        {selectedCourseIds.length > 0 && (
          <div className="mx-6 my-2.5 px-4 py-2 bg-blue-50/90 border border-blue-200 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-150 shadow-2xs">
            <div className="flex items-center space-x-3 text-xs text-slate-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                {selectedCourseIds.length}
              </span>
              <span>
                已选择 <strong className="text-blue-600 font-bold">{selectedCourseIds.length}</strong> 门课程
              </span>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setSelectedCourseIds([])}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer underline"
              >
                取消选择
              </button>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="text-xs text-slate-600 font-medium">批量设置学生自学:</span>
              <button
                onClick={() => handleBatchSetSelfStudy(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title="批量允许学生自主学习"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>批量允许自学</span>
              </button>
              <button
                onClick={() => handleBatchSetSelfStudy(false)}
                className="px-3.5 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title="批量禁止学生自学（仅排课教学可见）"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>批量禁止自学</span>
              </button>
            </div>
          </div>
        )}

        {/* 主列表区域：支持卡片展示与列表展示 */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50">
          {filteredCourses.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <BookOpen className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm">未检索到相关课程</p>
            </div>
          ) : courseViewMode === 'card' ? (
            /* 卡片展示模式（默认） */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
              {filteredCourses.map((course) => {
                const isCustom = !!course.isCustom;
                const isSelected = selectedCourseIds.includes(course.id);
                const allowStudy = course.allowSelfStudy !== false;

                return (
                  <div
                    key={course.id}
                    className={`rounded-lg overflow-hidden transition-all flex flex-col justify-between group relative ${
                      isSelected
                        ? 'ring-2 ring-blue-500 shadow-md bg-white'
                        : isCustom
                        ? 'bg-white border-2 border-emerald-400/90 hover:border-emerald-500 hover:shadow-lg shadow-emerald-500/5'
                        : 'bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    {/* 左上角角色/性质标签 */}
                    <div className="absolute left-0 top-0 z-20">
                      {isCustom ? (
                        <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-md shadow-xs flex items-center">
                          <Edit3 className="w-2.5 h-2.5 mr-1 stroke-[2.5]" />
                          自建课程
                        </div>
                      ) : (
                        <div className="bg-[#1677ff] text-white text-[10px] font-bold px-2 py-0.5 rounded-br-md shadow-xs flex items-center">
                          <Shield className="w-2.5 h-2.5 mr-1 stroke-[2.5]" />
                          已购课程
                        </div>
                      )}
                    </div>

                    {/* 右上角多选 Checkbox */}
                    <div 
                      className="absolute right-2 top-2 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={`p-1 rounded-md cursor-pointer transition-all ${
                        isSelected ? 'bg-white shadow-sm' : 'bg-black/25 hover:bg-white/90 group-hover:bg-white/90'
                      }`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectCourse(course.id)}
                          className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer block"
                        />
                      </div>
                    </div>

                    {/* 顶部封面图区域 */}
                    <div className="relative h-[115px] overflow-hidden select-none">
                      {course.theme === 'blue-gradient' ? (
                        <div className="w-full h-full bg-gradient-to-br from-[#70baff] via-[#4096ff] to-[#1677ff] p-3 flex flex-col justify-between text-white relative">
                          <div className="z-10 mt-3">
                            <div className="text-[13px] font-extrabold tracking-tight drop-shadow-xs">{course.bannerText}</div>
                            <div className="text-[9px] opacity-90 font-mono tracking-tighter">{course.bannerSub}</div>
                          </div>
                          <div className="absolute right-2 bottom-1.5 w-14 h-14 opacity-90">
                            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-xs border border-white/30 transform rotate-12 flex items-center justify-center">
                              <Layers className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                      ) : course.theme === 'deep-blue' ? (
                        <div className="w-full h-full bg-gradient-to-br from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] p-3 flex flex-col justify-between text-white relative">
                          <div className="z-10 mt-3">
                            <div className="text-[13px] font-extrabold tracking-tight">{course.bannerText}</div>
                            <div className="text-[9px] opacity-90 font-medium">{course.bannerSub}</div>
                          </div>
                          <div className="absolute right-2 bottom-2 w-12 h-12 rounded-full bg-blue-400/30 blur-xs"></div>
                          <div className="absolute right-2 bottom-2">
                            <Sparkles className="w-7 h-7 text-cyan-200" />
                          </div>
                        </div>
                      ) : isCustom ? (
                        <div className="w-full h-full bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] p-3 flex flex-col justify-between text-white relative">
                          <div className="z-10 mt-3">
                            <div className="text-[12px] font-extrabold tracking-tight leading-tight drop-shadow-xs">{course.bannerText}</div>
                            <div className="text-[9px] opacity-90 font-medium mt-0.5">{course.bannerSub}</div>
                          </div>
                          <div className="absolute right-2 bottom-2">
                            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center">
                              <Edit3 className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#4338ca] p-3 flex flex-col justify-between text-white relative">
                          <div className="z-10 mt-3">
                            <div className="text-[12px] font-extrabold tracking-tight leading-tight">{course.bannerText}</div>
                            <div className="text-[9px] opacity-90 font-medium mt-0.5">{course.bannerSub}</div>
                          </div>
                          <div className="absolute right-2 bottom-2">
                            <div className="w-10 h-10 rounded-full border-2 border-purple-300/40 flex items-center justify-center">
                              <Cpu className="w-5 h-5 text-purple-200" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 右下角炫彩徽章 */}
                      <div className={`absolute right-2 bottom-2 z-10 w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                        isCustom ? 'bg-gradient-to-tr from-emerald-400 to-teal-200 text-emerald-900' : 'bg-gradient-to-tr from-purple-500 to-pink-400 text-white'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                      </div>
                    </div>

                    {/* 中间信息区 */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        {/* 标题 */}
                        <h4 
                          className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors" 
                          title={course.title}
                        >
                          {course.title}
                        </h4>

                        {/* 分类、标签与时间 */}
                        <div className="flex items-center text-[10px] mt-1.5 truncate">
                          {isCustom ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold mr-1 shrink-0">
                              自建
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold mr-1 shrink-0">
                              已购
                            </span>
                          )}
                          <span className="text-slate-600 truncate">{course.category}</span>
                          <span className="mx-1 text-slate-300">|</span>
                          <span className="text-slate-400 truncate">{course.time}</span>
                        </div>

                        {/* 简介 */}
                        <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-1" title={course.desc}>
                          {course.desc}
                        </p>

                        {/* 学生自学权限状态控制条（支持一键开关） */}
                        <div 
                          className="mt-2.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400 font-medium">自学:</span>
                            {allowStudy ? (
                              <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
                                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-emerald-500" />
                                允许自学
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-slate-400 flex items-center">
                                <Lock className="w-2.5 h-2.5 mr-0.5 text-slate-400" />
                                禁止自学
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleToggleCourseSelfStudy(course.id, e)}
                            title={allowStudy ? "点击切换为禁止自学" : "点击切换为允许自学"}
                            className={`relative inline-flex h-3.5 w-6.5 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                              allowStudy ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ${
                                allowStudy ? 'translate-x-3' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 底部操作行 */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        {/* 环境标签 */}
                        <div className="flex items-center space-x-1">
                          <span className="text-[11px] text-slate-400 font-medium">环境</span>
                          <div className="flex items-center space-x-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {isCustom && (
                            <button
                              onClick={() => {
                                setEditingTeacherCourse(course);
                              }}
                              className="px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold transition-colors cursor-pointer flex items-center shadow-2xs"
                              title="编辑自建课程教学大纲与步骤"
                            >
                              <Edit3 className="w-2.5 h-2.5 mr-0.5" />
                              编辑
                            </button>
                          )}
                          {/* 下发任务按钮 */}
                          <button
                            onClick={() => {
                              setSelectedCourseForDispatch(course);
                              setDispatchTaskName(`${course.title}-实训任务`);
                              setIsDispatchModalOpen(true);
                            }}
                            className={`px-2 py-0.5 rounded border text-[11px] font-medium transition-colors flex items-center cursor-pointer ${
                              isCustom
                                ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                : 'border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-600'
                            }`}
                            title="下发任务到班级"
                          >
                            <UploadCloud className="w-3 h-3 mr-1" />
                            下发
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 列表展示模式 */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold text-slate-500 select-none">
                      <th className="py-3 px-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={isAllFilteredSelected}
                          onChange={() => handleToggleSelectAll(filteredCourses.map(c => c.id))}
                          className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4 min-w-[260px]">课程名称与简介</th>
                      <th className="py-3 px-4 w-32">所属分类</th>
                      <th className="py-3 px-4 w-32">课程类型</th>
                      <th className="py-3 px-4 w-36">更新时间</th>
                      <th className="py-3 px-4 w-44 text-center">学生自学权限</th>
                      <th className="py-3 px-4 w-36 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredCourses.map((course) => {
                      const isCustom = !!course.isCustom;
                      const isSelected = selectedCourseIds.includes(course.id);
                      const allowStudy = course.allowSelfStudy !== false;

                      return (
                        <tr
                          key={course.id}
                          onClick={() => handleToggleSelectCourse(course.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected ? 'bg-blue-50/50 hover:bg-blue-50/80' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {/* 复选框 */}
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
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
                              <div className={`w-12 h-8 rounded-md shrink-0 flex items-center justify-center text-white text-[10px] font-bold shadow-2xs overflow-hidden ${
                                isCustom
                                  ? 'bg-gradient-to-br from-emerald-500 to-teal-700'
                                  : course.theme === 'deep-blue'
                                  ? 'bg-gradient-to-br from-blue-600 to-indigo-800'
                                  : 'bg-gradient-to-br from-sky-400 to-blue-600'
                              }`}>
                                <BookOpen className="w-4 h-4 opacity-90" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-1.5">
                                  {isCustom ? (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shrink-0">
                                      自建
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold shrink-0">
                                      已购
                                    </span>
                                  )}
                                  <h4 className="text-xs font-bold text-slate-800 truncate" title={course.title}>
                                    {course.title}
                                  </h4>
                                </div>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5" title={course.desc}>
                                  {course.desc}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 分类 */}
                          <td className="py-3.5 px-4 text-slate-600">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                              {course.category}
                            </span>
                          </td>

                          {/* 类型 */}
                          <td className="py-3.5 px-4 text-slate-600 text-xs">
                            {course.type}
                          </td>

                          {/* 时间 */}
                          <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                            {course.time}
                          </td>

                          {/* 学生自学权限 Switch 与徽章 */}
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border shadow-2xs transition-all bg-white border-slate-200">
                              {allowStudy ? (
                                <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600">
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                                  允许自学
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[11px] font-medium text-slate-400">
                                  <Lock className="w-3 h-3 mr-1 text-slate-400" />
                                  禁止自学
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleToggleCourseSelfStudy(course.id, e)}
                                title={allowStudy ? "点击切换为禁止学生自学" : "点击切换为允许学生自学"}
                                className={`relative inline-flex h-4 w-7.5 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                  allowStudy ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ${
                                    allowStudy ? 'translate-x-4' : 'translate-x-0.5'
                                  }`}
                                />
                              </button>
                            </div>
                          </td>

                          {/* 操作 */}
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end space-x-2">
                              {isCustom && (
                                <button
                                  onClick={() => setEditingTeacherCourse(course)}
                                  className="px-2.5 py-1 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium transition-colors cursor-pointer flex items-center shadow-2xs"
                                  title="编辑自建课程教学大纲与步骤"
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  编辑
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedCourseForDispatch(course);
                                  setDispatchTaskName(`${course.title}-实训任务`);
                                  setIsDispatchModalOpen(true);
                                }}
                                className={`px-2.5 py-1 rounded border text-xs font-medium transition-colors flex items-center cursor-pointer shadow-2xs ${
                                  isCustom
                                    ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                    : 'border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-600'
                                }`}
                                title="下发任务到班级"
                              >
                                <UploadCloud className="w-3 h-3 mr-1" />
                                下发
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

        {/* 底部分页区 */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-4">
            <span>共 {filteredCourses.length} 条</span>
            <div className="relative">
              <select className="border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 bg-white outline-none cursor-pointer">
                <option value="12">12条/页</option>
                <option value="24">24条/页</option>
                <option value="48">48条/页</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-400 disabled:opacity-50">
              &lt;
            </button>
            <button className="px-2.5 py-1 bg-blue-600 text-white rounded font-medium shadow-xs">
              1
            </button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-600">
              2
            </button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-600">
              &gt;
            </button>
            <span className="ml-2">前往</span>
            <input 
              type="text" 
              defaultValue="1" 
              className="w-10 text-center border border-slate-200 rounded py-0.5 text-xs outline-none focus:border-blue-500" 
            />
            <span>页</span>
          </div>
        </div>
      </div>
    );
  };

  // 6. 教师-我的教学活动与任务监控视图
  const renderTeacherTeachingActivityView = () => {
    const teachingTasks = [
      {
        id: 1,
        title: '第3周自然语言分词与模型实训任务',
        course: '自然语言处理技术与应用',
        targetClass: '计算机2101班',
        submittedCount: 42,
        totalStudents: 48,
        deadline: '2026-10-15',
        status: '进行中',
        toGrade: 12
      },
      {
        id: 2,
        title: 'Python程序设计进阶大作业',
        course: 'Python程序设计进阶',
        targetClass: '软件工程2201班',
        submittedCount: 48,
        totalStudents: 50,
        deadline: '2026-10-10',
        status: '待批改',
        toGrade: 18
      },
      {
        id: 3,
        title: '智慧农业环境数据采集与云端展示',
        course: '智慧行业应用开发-牧场、家居、温室',
        targetClass: '人工智能2203班',
        submittedCount: 45,
        totalStudents: 45,
        deadline: '2026-09-28',
        status: '已结束',
        toGrade: 0
      }
    ];

    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/50">
        {/* 顶部统计条 */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">我的教学任务与作业管理</h2>
            <p className="text-xs text-slate-500 mt-1">集中管理班级任务发布、实训代码评测、实验报告批改与学情进度</p>
          </div>
          <button 
            onClick={() => setActiveMenu('my-courses')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center cursor-pointer shadow-xs"
          >
            <UploadCloud className="w-4 h-4 mr-1.5" />
            从我的课程下发新任务
          </button>
        </div>

        {/* 任务指标卡 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <span className="text-xs text-slate-500">已发布任务总数</span>
            <div className="text-xl font-bold text-slate-800 mt-1">16 <span className="text-xs text-slate-400 font-normal">个</span></div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <span className="text-xs text-slate-500">正在进行任务</span>
            <div className="text-xl font-bold text-blue-600 mt-1">4 <span className="text-xs text-slate-400 font-normal">个</span></div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <span className="text-xs text-slate-500">待批改实验报告</span>
            <div className="text-xl font-bold text-amber-600 mt-1">30 <span className="text-xs text-slate-400 font-normal">份</span></div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <span className="text-xs text-slate-500">学生整体提交率</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">89.4 <span className="text-xs text-slate-400 font-normal">%</span></div>
          </div>
        </div>

        {/* 教学任务列表 */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">下发任务列表</h3>
            <span className="text-xs text-slate-400">共 {teachingTasks.length} 个进行中任务</span>
          </div>

          <div className="space-y-3">
            {teachingTasks.map((t) => (
              <div key={t.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-blue-50/30 transition-colors flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-slate-800">{t.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      t.status === '进行中' ? 'bg-blue-100 text-blue-700' :
                      t.status === '待批改' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                    <span>关联课程：{t.course}</span>
                    <span>班级：{t.targetClass}</span>
                    <span>截止时间：{t.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-xs text-slate-400">提交情况</span>
                    <div className="text-xs font-bold text-slate-700">{t.submittedCount}/{t.totalStudents} 人</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        setDispatchSuccessToast(`正在打开《${t.title}》批改界面...`);
                        setTimeout(() => setDispatchSuccessToast(''), 2500);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors cursor-pointer"
                    >
                      批改报告 ({t.toGrade})
                    </button>
                    <button 
                      onClick={() => {
                        setDispatchSuccessToast(`已向未提交学生发送催交提醒！`);
                        setTimeout(() => setDispatchSuccessToast(''), 2500);
                      }}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs rounded-md transition-colors cursor-pointer"
                    >
                      催交
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 渲染右侧内容主区域
  const renderMainContent = () => {
    // 1. 学生主页
    if (activeMenu === 'student-home') {
      return renderStudentHome();
    }
    // 2. 教师主页
    if (activeMenu === 'teacher-home') {
      return renderTeacherHome();
    }
    // 3. 教师-我的课程（带已购课程/自建课程Tab、创建课程按钮、课程卡片矩阵与下发任务）
    if (activeMenu === 'my-courses') {
      return renderTeacherCoursesView();
    }
    // 4. 超级管理员-课程管理 / 课程列表
    if (activeMenu === 'course-list' || activeMenu === 'course-management') {
      return <CourseManagement />;
    }
    // 4.1 题库管理 / 试题管理 (参考截图 1:1 实现)
    if (activeMenu === 'questions' || activeMenu === 'question-list') {
      return <QuestionManagement />;
    }
    // 4.2 自动评分
    if (activeMenu === 'auto-grading') {
      return <AutoGradingManagement />;
    }
    // 5. 成员管理
    if (activeMenu === 'members') {
      return <UsersManagement />;
    }
    // 6. 订购信息查询
    if (activeMenu === 'orders') {
      return <OrdersManagement hideTenantSearch={currentRole === 'school_admin'} />;
    }
    // 7. 考试与竞赛
    if (activeMenu === 'my-exams' || activeMenu === 'exams') {
      return renderExamsView();
    }
    // 8. 我的学习（参考截图1:1高保真界面）
    if (activeMenu === 'my-studies') {
      return <StudentStudies onNavigate={onNavigate} />;
    }
    // 9. 我的教学 / 教学管理（参考截图1:1高保真教学任务中心）
    if (activeMenu === 'teaching' || activeMenu === 'my-teaching') {
      return <TeacherTeaching />;
    }
    // 其他超级管理员二级子菜单占位
    return renderSimplePlaceholder(
      sidebarItems.find(i => i.id === activeMenu)?.label || '功能模块',
      '该功能已接入平台主控台，支持在线参数配置与数据可视化调度。'
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#f4f7f9] font-sans text-slate-800 overflow-hidden">
      {/* 顶部 Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 shrink-0 z-40 sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-10">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer" 
            onClick={() => onNavigate && onNavigate('course-hall')}
            title="智慧教学实验平台"
          >
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
              <div className="bg-red-500 rounded-tl-sm"></div>
              <div className="bg-green-500 rounded-tr-sm"></div>
              <div className="bg-blue-500 rounded-bl-sm"></div>
              <div className="bg-yellow-500 rounded-br-sm"></div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-800 tracking-tight">智慧教学实验平台</span>
              <span className="text-[10px] text-slate-400 font-medium">by UUSIMA</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-500">
            <button className="hover:text-blue-600 transition-colors" onClick={() => onNavigate && onNavigate('course-hall')}>课程大厅</button>
            <button className="hover:text-blue-600 transition-colors" onClick={() => onNavigate && onNavigate('lab-hall')}>实验大厅</button>
            <button className="hover:text-blue-600 transition-colors" onClick={() => onNavigate && onNavigate('dataset-hall')}>数据大厅</button>
            <a href="https://aixb.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">AI技能分析系统</a>
            <a href="https://lct-xy.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">AI产教融合系统</a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 text-sm">
          {/* 角色切换胶囊徽标 */}
          <button 
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full border bg-white hover:bg-blue-50/50 border-blue-200 text-slate-700 shadow-sm hover:border-blue-400 transition-all group"
            title="点击切换身份角色"
          >
            <span className={`w-2 h-2 rounded-full ${currentRoleInfo.badgeText} animate-pulse`}></span>
            <span className="text-xs text-slate-500">当前角色：</span>
            <span className="text-xs font-bold text-blue-600 flex items-center">
              {currentRoleInfo.name}
            </span>
            <span className="text-[11px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded group-hover:bg-blue-100 transition-colors">
              切换角色
            </span>
          </button>

          <button className="flex items-center text-slate-600 hover:text-blue-600 transition-colors px-2 py-1">
            <Languages className="w-4 h-4 mr-1" />
            En
          </button>

          <button 
            onClick={() => {
              setActiveMenu(currentRoleInfo.defaultMenu);
            }}
            className="text-blue-600 font-medium transition-colors px-2 py-1"
          >
            我的主页
          </button>

          {/* User Profile Dropdown Component */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                {currentRoleInfo.avatarLabel.slice(0, 1)}
              </div>
              <span className="text-slate-700 font-medium text-sm">杨振邦<span className="text-slate-400 font-normal text-xs">(15396005420)</span></span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-100">
                <div className="relative h-12 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#f48b8d] text-white flex items-center justify-center font-medium border-[3px] border-white text-sm shadow-sm">
                    振邦
                  </div>
                </div>
                <div className="pt-8 pb-2">
                  <div className="text-center px-4 mb-2">
                    <div className="font-semibold text-slate-800 text-sm">杨振邦</div>
                    <div className="text-xs text-slate-400 mt-0.5">15396005420</div>
                    <div className="mt-1.5">
                      <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full border ${currentRoleInfo.badgeBg}`}>
                        {currentRoleInfo.name} ({currentRoleInfo.tag})
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 my-2 mx-2"></div>
                  
                  <button 
                    onClick={() => { setIsUserMenuOpen(false); setIsRoleModalOpen(true); }}
                    className="w-full flex items-center justify-between px-4 py-2 text-[13px] text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                  >
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                      切换使用角色
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  </button>

                  <button 
                    onClick={() => onNavigate && onNavigate('personal')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    个人设置
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('config')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    系统管理
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('platform-operation')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    平台运营
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('login')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </button>
                </div>
                <div className="border-t border-slate-100 px-3 py-2.5 bg-slate-50/50">
                  <div className="text-[11px] text-slate-400 mb-1 px-1">当前所属租户</div>
                  <div className="bg-white rounded border border-slate-200/60 flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="w-5 h-5 bg-blue-500 text-white rounded shadow-xs flex items-center justify-center shrink-0 font-bold text-[10px]">
                        云
                      </div>
                      <span className="text-[12px] text-slate-700 truncate font-medium">{activeTenant.name}</span>
                    </div>
                    <button 
                      onClick={() => { setIsUserMenuOpen(false); setIsTenantOpen(true); }}
                      className="text-[11px] text-blue-600 hover:underline flex items-center shrink-0"
                    >
                      切换
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 页面主体：左侧边栏 + 右侧主内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 */}
        <aside className={`${isSidebarOpen ? 'w-60' : 'w-20'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full shadow-sm z-20 relative select-none`}>
          {/* 折叠控制与角色指示 */}
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold truncate ${currentRoleInfo.badgeBg}`}>
                  {currentRoleInfo.name}
                </span>
                <button 
                  onClick={() => setIsRoleModalOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center shrink-0 font-medium cursor-pointer"
                >
                  更换角色
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <button 
                  onClick={() => setIsRoleModalOpen(true)}
                  className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold hover:bg-blue-100 transition-colors"
                  title={`当前角色：${currentRoleInfo.name}，点击更换角色`}
                >
                  {currentRoleInfo.name[0]}
                </button>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              title={isSidebarOpen ? '收起侧边栏' : '展开侧边栏'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* 动态侧边栏菜单列表 */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-2.5 px-2 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = !!item.children && item.children.length > 0;
              
              // 递归判断当前菜单或任意后代子菜单是否激活
              const isDescendantActive = (children?: MenuItem[]): boolean => {
                if (!children) return false;
                return children.some(c => c.id === activeMenu || isDescendantActive(c.children));
              };

              const isChildActive = hasChildren && isDescendantActive(item.children);
              const isActive = activeMenu === item.id || isChildActive;

              if (hasChildren) {
                return (
                  <div key={item.id} className="space-y-0.5">
                    <button
                      onClick={() => {
                        if (!isSidebarOpen) setIsSidebarOpen(true);
                        setIsCourseManagementOpen(!isCourseManagementOpen);
                      }}
                      className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 text-sm rounded-lg font-medium transition-colors ${
                        isActive ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 hover:bg-slate-100/80'
                      }`}
                      title={!isSidebarOpen ? item.label : undefined}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${isSidebarOpen ? 'mr-2.5' : ''} ${
                          isActive ? 'text-blue-600 bg-blue-100' : 'text-slate-500 bg-slate-100'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                      </div>
                      {isSidebarOpen && (
                        isCourseManagementOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {isCourseManagementOpen && isSidebarOpen && (
                      <div className="pl-6 space-y-0.5">
                        {item.children?.map(child => {
                          const ChildIcon = child.icon;
                          const hasSubChildren = !!child.children && child.children.length > 0;
                          const isSubChildActive = hasSubChildren && child.children?.some(sc => sc.id === activeMenu);
                          const isCurrentActive = activeMenu === child.id || isSubChildActive;

                          // 若二级菜单含有三级子菜单（如题库管理 -> 试题管理）
                          if (hasSubChildren) {
                            return (
                              <div key={child.id} className="space-y-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsQuestionBankOpen(!isQuestionBankOpen);
                                    // 点击题库管理时默认进入试题管理
                                    if (activeMenu !== 'question-list' && activeMenu !== 'questions') {
                                      setActiveMenu('question-list');
                                    }
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md font-medium transition-colors ${
                                    isCurrentActive
                                      ? 'bg-blue-50 text-blue-600 font-semibold'
                                      : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <ChildIcon className="w-3.5 h-3.5 mr-2" />
                                    <span>{child.label}</span>
                                  </div>
                                  {isQuestionBankOpen ? (
                                    <ChevronUp className="w-3 h-3 text-slate-400" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3 text-slate-400" />
                                  )}
                                </button>

                                {/* 三级子菜单列表 */}
                                {isQuestionBankOpen && (
                                  <div className="pl-5 space-y-0.5 border-l border-slate-200/60 ml-3 my-0.5">
                                    {child.children?.map(subChild => {
                                      const SubIcon = subChild.icon;
                                      const isSubActive = activeMenu === subChild.id;
                                      return (
                                        <button
                                          key={subChild.id}
                                          type="button"
                                          onClick={() => {
                                            setActiveMenu(subChild.id);
                                            setEditingTeacherCourse(null);
                                          }}
                                          className={`w-full flex items-center px-2.5 py-1.5 text-[11px] rounded-md transition-colors ${
                                            isSubActive
                                              ? 'bg-blue-100/70 text-blue-700 font-semibold'
                                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                          }`}
                                        >
                                          <SubIcon className="w-3 h-3 mr-1.5 text-slate-400" />
                                          <span>{subChild.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          // 普通二级子菜单（如课程列表、自动评分）
                          const isSubActive = activeMenu === child.id;
                          return (
                            <button
                              key={child.id}
                              onClick={() => {
                                setActiveMenu(child.id);
                                setEditingTeacherCourse(null);
                              }}
                              className={`w-full flex items-center px-3 py-2 text-xs rounded-md font-medium transition-colors ${
                                isSubActive
                                  ? 'bg-blue-50 text-blue-600 font-semibold'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <ChildIcon className="w-3.5 h-3.5 mr-2" />
                              <span>{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setEditingTeacherCourse(null);
                  }}
                  className={`w-full flex items-center ${isSidebarOpen ? 'px-3 justify-start' : 'px-0 justify-center'} py-2.5 text-sm rounded-lg font-medium transition-colors ${
                    activeMenu === item.id
                      ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${isSidebarOpen ? 'mr-2.5' : ''} ${
                    activeMenu === item.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </aside>

        {/* 右侧主工作台内容区 */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      {/* 角色选择弹窗 (RoleSelectionModal) */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsRoleModalOpen(false)}
          />
          
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* 弹窗 Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">切换角色</h3>
              <button 
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 简单角色列表：仅展示角色名称，无冗余解释 */}
            <div className="p-3 space-y-1.5 max-h-[60vh] overflow-y-auto">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = currentRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/60 text-blue-700 shadow-xs' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{role.name}</span>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 弹窗 Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 创建课程弹窗 (CreateCourseModal) */}
      {isCreateCourseModalOpen && (() => {
        // 汇集全部可选课程（包含已购与自建课程）
        const allAvailableCourses = [...TEACHER_PURCHASED_COURSES, ...customCourses];
        
        // 搜索过滤
        const filteredDropdownCourses = allAvailableCourses.filter(c => {
          if (!dropdownSearchKeyword.trim()) return true;
          const kw = dropdownSearchKeyword.trim().toLowerCase();
          const matchTitle = c.title?.toLowerCase().includes(kw);
          const matchCategory = c.category?.toLowerCase().includes(kw);
          const matchType = c.type?.toLowerCase().includes(kw);
          const matchSourceType = (c.isCustom ? '自建' : '已购 已购买').includes(kw);
          return matchTitle || matchCategory || matchType || matchSourceType;
        });

        // 微缩封面渲染函数
        const renderCoverThumbnail = (course: any) => {
          if (course.isCustom) {
            return (
              <div className="w-full h-full bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] p-1 flex flex-col justify-between text-white relative">
                <span className="text-[8px] font-extrabold leading-tight truncate">{course.bannerText || '校本课程'}</span>
                <Edit3 className="w-3.5 h-3.5 text-white/90 self-end" />
              </div>
            );
          }
          if (course.theme === 'deep-blue') {
            return (
              <div className="w-full h-full bg-gradient-to-br from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] p-1 flex flex-col justify-between text-white relative">
                <span className="text-[8px] font-extrabold leading-tight truncate">{course.bannerText || 'NLP'}</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-200 self-end" />
              </div>
            );
          }
          if (course.theme === 'cyber-purple') {
            return (
              <div className="w-full h-full bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#4338ca] p-1 flex flex-col justify-between text-white relative">
                <span className="text-[8px] font-extrabold leading-tight truncate">{course.bannerText || '行业实训'}</span>
                <Cpu className="w-3.5 h-3.5 text-purple-200 self-end" />
              </div>
            );
          }
          return (
            <div className="w-full h-full bg-gradient-to-br from-[#70baff] via-[#4096ff] to-[#1677ff] p-1 flex flex-col justify-between text-white relative">
              <span className="text-[8px] font-extrabold leading-tight truncate">{course.bannerText || '新大陆科技'}</span>
              <Layers className="w-3.5 h-3.5 text-white/90 self-end" />
            </div>
          );
        };

        return (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => {
                setIsCreateCourseModalOpen(false);
                setIsCourseDropdownOpen(false);
              }}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
              {/* 弹窗头部 */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">新建自建课程</h3>
                    <p className="text-xs text-slate-400">快速创建专属于您的校本特色课程或实训任务</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsCreateCourseModalOpen(false);
                    setIsCourseDropdownOpen(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 弹窗表单主体（支持内部顺畅滚动，避免被弹窗截断） */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {/* 1. 仅保留课程名称输入 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center text-sm font-bold text-slate-800">
                      课程名称 <span className="text-red-500 ml-1">*</span>
                    </span>
                    {isCopyFromExisting && selectedSourceCourse && (
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        已自动载入推荐名称，可直接编辑修改
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="请输入课程名称，例如：智能网联与车路协同综合实训"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 bg-white shadow-2xs"
                  />
                </div>

                {/* 2. 根据其他课程创建开关卡片 */}
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        isCopyFromExisting ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Copy className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 flex items-center">
                          根据其他课程创建
                          {isCopyFromExisting && (
                            <span className="ml-2.5 px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-semibold rounded-md">
                              已开启模板创建
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          开启后可选择已有课程作为模板，快速复制课程结构、章节目录与教学实验
                        </div>
                      </div>
                    </div>
                    {/* Switch 切换开关 */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isCopyFromExisting}
                      onClick={() => {
                        const nextState = !isCopyFromExisting;
                        setIsCopyFromExisting(nextState);
                        if (!nextState) {
                          setSelectedSourceCourse(null);
                          setIsCourseDropdownOpen(false);
                          setDropdownSearchKeyword('');
                        } else {
                          setIsCourseDropdownOpen(true);
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isCopyFromExisting ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isCopyFromExisting ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 开启后显示的大尺寸课程选择面板 */}
                  {isCopyFromExisting && (
                    <div className="pt-3 border-t border-slate-200/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <label className="text-xs font-bold text-slate-700 flex items-center">
                            选择模板课程 <span className="text-red-500 ml-1">*</span>
                          </label>
                          <span className="text-xs text-slate-400">
                            (共 {allAvailableCourses.length} 门可选，点击选中一门)
                          </span>
                        </div>
                        {selectedSourceCourse && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-emerald-600 font-medium flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              已选中：{selectedSourceCourse.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSourceCourse(null);
                                setNewCourseName('');
                              }}
                              className="text-xs text-slate-400 hover:text-red-500 underline ml-1 cursor-pointer"
                            >
                              重选
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 搜索框与过滤栏 */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={dropdownSearchKeyword}
                          onChange={(e) => setDropdownSearchKeyword(e.target.value)}
                          placeholder="输入关键字快速搜索课程名称、分类、标签（如：Python、AI、自建等）..."
                          className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs placeholder:text-slate-400"
                        />
                        {dropdownSearchKeyword && (
                          <button
                            type="button"
                            onClick={() => setDropdownSearchKeyword('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* 宽敞的双列卡片矩阵列表，一览无余 */}
                      <div className="bg-white border border-slate-200 rounded-xl p-2 max-h-72 overflow-y-auto shadow-2xs">
                        {filteredDropdownCourses.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 text-xs">
                            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                            未检索到包含“{dropdownSearchKeyword}”的课程
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filteredDropdownCourses.map((course) => {
                              const isSelected = selectedSourceCourse?.id === course.id;
                              return (
                                <div
                                  key={course.id}
                                  onClick={() => {
                                    setSelectedSourceCourse(course);
                                    if (!newCourseName.trim() || newCourseName.endsWith('(副本)')) {
                                      setNewCourseName(`${course.title} (副本)`);
                                    }
                                  }}
                                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 select-none ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-100'
                                      : 'border-slate-150 hover:border-blue-300 hover:bg-slate-50/80'
                                  }`}
                                >
                                  {/* 大号高清晰封面图 */}
                                  <div className="w-16 h-11 rounded-lg overflow-hidden shrink-0 shadow-2xs relative">
                                    {renderCoverThumbnail(course)}
                                  </div>

                                  {/* 课程详情信息 */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-1.5 mb-1">
                                      <h4 className="text-xs font-bold text-slate-800 truncate" title={course.title}>
                                        {course.title}
                                      </h4>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-[11px]">
                                      {course.isCustom ? (
                                        <span className="px-1.5 py-0.2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded shrink-0">
                                          自建
                                        </span>
                                      ) : (
                                        <span className="px-1.5 py-0.2 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold rounded shrink-0">
                                          已购买
                                        </span>
                                      )}
                                      <span className="text-slate-400 truncate">
                                        {course.category || course.type || '专业课'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* 选中标记 */}
                                  {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border border-slate-200 shrink-0 group-hover:border-slate-300" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 弹窗底部操作栏：按要求实现“选中其中一个才出现确定按钮” */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                {/* 状态提示文字 */}
                <div className="text-xs">
                  {isCopyFromExisting && !selectedSourceCourse ? (
                    <span className="text-amber-600 flex items-center font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 inline-block animate-pulse"></span>
                      已开启模板复制，请在上方列表中点击选中一门源课程
                    </span>
                  ) : isCopyFromExisting && selectedSourceCourse ? (
                    <span className="text-blue-600 flex items-center font-semibold">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600" />
                      已选定源课程模板《{selectedSourceCourse.title}》
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      创建成功后将归入「自建课程」列表
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setIsCreateCourseModalOpen(false);
                      setIsCourseDropdownOpen(false);
                    }}
                    className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
                  >
                    取消
                  </button>

                  {/* 核心规则：根据其他课程创建打开后，选中其中一个才出现确定按钮；关闭时正常显示确定按钮 */}
                  {(!isCopyFromExisting || !!selectedSourceCourse) && (
                    <button
                      onClick={() => {
                        if (!newCourseName.trim()) {
                          alert('请输入课程名称');
                          return;
                        }
                        if (isCopyFromExisting && !selectedSourceCourse) {
                          alert('请先选择一门源课程');
                          return;
                        }

                        const newCourse = {
                          id: Date.now(),
                          title: newCourseName.trim(),
                          category: selectedSourceCourse ? selectedSourceCourse.category : '校本自建课',
                          time: new Date().toISOString().replace('T', ' ').slice(0, 19),
                          desc: selectedSourceCourse ? `【基于《${selectedSourceCourse.title}》创建】${selectedSourceCourse.desc || ''}` : '校本自建特色课程',
                          gradient: selectedSourceCourse?.gradient || 'from-emerald-600 to-teal-700',
                          bannerText: newCourseName.trim(),
                          bannerSub: selectedSourceCourse ? `来源: ${selectedSourceCourse.title.slice(0, 10)}` : '校本自建',
                          theme: selectedSourceCourse ? selectedSourceCourse.theme : undefined,
                          isCustom: true
                        };

                        setCustomCourses([newCourse, ...customCourses]);
                        setIsCreateCourseModalOpen(false);
                        setIsCourseDropdownOpen(false);
                        setTeachingCourseTab('custom');
                        setDispatchSuccessToast(`自建课程《${newCourseName.trim()}》创建成功！`);
                        setTimeout(() => setDispatchSuccessToast(''), 3000);
                      }}
                      className="px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center animate-in fade-in zoom-in-95 duration-150"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      确定创建
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 下发任务弹窗 (DispatchTaskModal) */}
      {isDispatchModalOpen && selectedCourseForDispatch && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDispatchModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/40">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">下发教学实训任务</h3>
                  <p className="text-[11px] text-slate-500">将选定课程的实验与作业一键发布至授课班级</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">所选下发课程</span>
                  <span className="text-xs font-bold text-slate-800">{selectedCourseForDispatch.title}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                  {selectedCourseForDispatch.category}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  下发目标班级 <span className="text-red-500">*</span>
                </label>
                <select
                  value={dispatchSelectedClass}
                  onChange={(e) => setDispatchSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                >
                  <option value="计算机2101班">计算机2101班 (48人)</option>
                  <option value="人工智能2203班">人工智能2203班 (45人)</option>
                  <option value="软件工程2201班">软件工程2201班 (50人)</option>
                  <option value="大数据应用2202班">大数据应用2202班 (43人)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  任务名称
                </label>
                <input
                  type="text"
                  value={dispatchTaskName}
                  onChange={(e) => setDispatchTaskName(e.target.value)}
                  placeholder="例如：第3周自然语言分词与模型实训任务"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    完成截止时间
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-10-15"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    评分方式
                  </label>
                  <select className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white">
                    <option value="auto">系统自动评分 + 报告审核</option>
                    <option value="manual">教师手动批改</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsDispatchModalOpen(false);
                  setDispatchSuccessToast(`任务《${dispatchTaskName || selectedCourseForDispatch.title}》已成功下发至 ${dispatchSelectedClass}！`);
                  setTimeout(() => setDispatchSuccessToast(''), 3500);
                }}
                className="px-5 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                <span>立即下发</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功反馈 Toast */}
      {dispatchSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[250] bg-slate-900/90 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{dispatchSuccessToast}</span>
        </div>
      )}
    </div>
  );
}

