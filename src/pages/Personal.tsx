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
  ChevronRight
} from 'lucide-react';

export default function Personal({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [activeTeachingTab, setActiveTeachingTab] = useState('进行中');
  const [activeTaskListTab, setActiveTaskListTab] = useState('进行中');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const activeTenant = { name: "教育公司" };

  const CourseSearchDropdown = ({ placeholder = "请输入课程名称进行搜索" }: { placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const courses = ['自然语言处理技术与应用', 'Python程序设计进阶', '机器学习基础', '深度学习原理', '计算机视觉实战'];
    const filtered = courses.filter(c => c.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="relative w-64 z-10">
        <div 
          className="flex items-center border border-slate-200 rounded-md bg-white w-full overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400"
        >
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

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-slate-400 mt-20">
      <div className="relative w-32 h-32 mb-4">
        {/* Simple abstract SVG for empty state based on screenshot */}
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#f0f7ff" />
          <path d="M30 40 L70 40 L65 70 L35 70 Z" fill="#d1e4ff" />
          <path d="M40 55 L60 55" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M45 65 L55 65" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="30" r="8" fill="#7bf1e6" />
        </svg>
      </div>
      <p className="text-sm">暂无任务</p>
    </div>
  );

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

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans">
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
            <a href="https://aixb.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">AI技能分析系统</a>
            <a href="https://lct-xy.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">AI产教融合系统</a>
            <a href="https://deviceai.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">硬件智能体系统</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => e.preventDefault()}>考试系统</a>
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

          {/* User Profile Dropdown Component */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-slate-700 font-medium text-sm">杨振邦<span className="text-slate-400 font-normal text-xs">(15396005420)</span></span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden transform origin-top-right">
                <div className="relative h-12 bg-[#e6f4ff]">
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#f48b8d] text-white flex items-center justify-center font-medium border-[3px] border-white text-sm shadow-sm">
                    振邦
                  </div>
                </div>
                <div className="pt-8 pb-1">
                  <div className="text-center px-4 mb-2">
                    <div className="font-medium text-slate-800 text-sm">杨振邦</div>
                    <div className="text-xs text-slate-400 mt-0.5">15396005420</div>
                  </div>
                  <div className="h-px bg-slate-100 my-2 mx-2"></div>
                  <button 
                    onClick={() => onNavigate && onNavigate('personal')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    个人设置
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('config')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    系统管理
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('platform-operation')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
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
                <div className="border-t border-slate-100 px-3 py-3">
                  <div className="text-[12px] text-slate-500 mb-2 px-1">组织</div>
                  <div className="bg-[#f5f7fa] rounded flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="w-5 h-5 bg-white rounded shadow-sm text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs italic">
                        X
                      </div>
                      <span className="text-[13px] text-slate-700 truncate">{activeTenant.name}</span>
                    </div>
                    <button 
                      onClick={() => { setIsUserMenuOpen(false); setIsTenantOpen(true); }}
                      className="text-[12px] text-slate-400 hover:text-blue-500 flex items-center shrink-0"
                    >
                      切换 <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 bg-white shrink-0 shadow-sm flex flex-col py-6 overflow-y-auto">
        <nav className="flex flex-col space-y-2 px-4">
          <button 
            onClick={() => onNavigate && onNavigate('course-hall')}
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
      <main className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        
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
                  <p className="text-sm font-medium text-slate-700 mt-0.5">新大陆教育行业云</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">学院</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">新大陆教育行业云</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">专业</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">--</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Illustration Decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none flex items-center justify-end pr-8">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                 {/* Decorative stars */}
                 <path d="M10 20 L15 10 L20 20 L30 25 L20 30 L15 40 L10 30 L0 25 Z" fill="#93c5fd" />
                 <path d="M80 80 L83 75 L86 80 L91 82 L86 84 L83 89 L80 84 L75 82 Z" fill="#93c5fd" />
                 {/* Clipboard body */}
                 <rect x="25" y="25" width="45" height="55" rx="4" fill="#3b82f6" transform="rotate(-10 50 50)" />
                 <rect x="35" y="30" width="45" height="55" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" transform="rotate(5 50 50)" />
                 {/* Checkmark */}
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
              <p className="text-2xl font-bold text-slate-800">0 <span className="text-sm font-normal text-slate-500">个</span></p>
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
              <p className="text-2xl font-bold text-slate-800">0 <span className="text-sm font-normal text-slate-500">个</span></p>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
                 <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">已用时长</p>
              <p className="text-2xl font-bold text-slate-800">0 <span className="text-sm font-normal text-slate-500">分钟</span></p>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
                 <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full border-2 border-white flex items-center justify-center">
                 <Clock className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">剩余时长</p>
              <p className="text-2xl font-bold text-slate-800">0 <span className="text-sm font-normal text-slate-500">分钟</span></p>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
                 <Timer className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full border-2 border-white flex items-center justify-center">
                 <Clock className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">实验报告数</p>
              <p className="text-2xl font-bold text-slate-800">0 <span className="text-sm font-normal text-slate-500">份</span></p>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-lg transform -rotate-3 opacity-90 flex items-center justify-center">
                 <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Panels */}
        <div className="grid grid-cols-2 gap-4 flex-1">
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

      </main>
      </div>
    </div>
  );
}
