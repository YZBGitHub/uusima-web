import React, { useState } from 'react';
import { 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Clock, 
  BarChart2, 
  BookOpen, 
  Flame, 
  Languages, 
  Menu,
  ChevronRight,
  LogOut,
  Activity,
  User,
  MonitorPlay
} from 'lucide-react';

export default function LabHall({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // Filters State
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMajor, setActiveMajor] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('default');

  const navItems = [
    { id: 'all', label: '全部' },
    { id: 'platform', label: '平台型' },
    { id: 'container', label: '容器型' },
    { id: 'virtual', label: '虚拟系统' },
    { id: 'combo', label: '组合型' }
  ];

  const majorItems = [
    { id: 'all', label: '全部' },
    { id: 'iot', label: '物联网' },
    { id: 'ai', label: '人工智能' },
    { id: 'industrial', label: '工业互联网' },
    { id: 'bigdata', label: '大数据' },
    { id: 'blockchain', label: '区块链' },
    { id: 'tech', label: '专业技术技能' },
    { id: 'career', label: '岗位课程' }
  ];

  const subCategoryItems = [
    { id: 'all', label: '全部' }
  ];

  const sortItems = [
    { id: 'default', label: '默认排序' },
    { id: 'courses', label: '最多课程' },
    { id: 'views', label: '最多浏览' },
    { id: 'uses', label: '使用最多' }
  ];

  const labs = [
    {
      id: 1,
      title: '大数据-jupyter',
      type: '容器型',
      typeColor: 'bg-purple-500',
      description: '大数据-jupyter',
      courses: 5,
      time: '22,897 分钟',
      views: 244,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 2,
      title: '工程虚拟仿真',
      type: '平台型',
      typeColor: 'bg-blue-500',
      description: '支持三维可视化界面的应用设...',
      courses: 13,
      time: '69,098 小时',
      views: 17000,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 3,
      title: '3D应用设计器',
      type: '平台型',
      typeColor: 'bg-blue-500',
      description: '支持三维可视化界面的应用设...',
      courses: -1,
      time: '43,593 分钟',
      views: 564,
      image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 4,
      title: '行业云',
      type: '平台型',
      typeColor: 'bg-blue-500',
      description: '行业云平台是一款功能全面的...',
      courses: 6,
      time: '251,066 分钟',
      views: 1476,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 5,
      title: '嵌入式(仿真+Renode)',
      type: '组合型',
      typeColor: 'bg-[#1e5aa0]',
      description: '嵌入式虚拟仿真平台提供插...',
      courses: 0,
      time: '293,115 分钟',
      views: 589,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 6,
      title: 'ThingsBoard',
      type: '平台型',
      typeColor: 'bg-blue-500',
      description: 'ThingBoard是一个开源的物...',
      courses: 14,
      time: '41,367 小时',
      views: 8658,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 7,
      title: '2D应用设计器',
      type: '平台型',
      typeColor: 'bg-blue-500',
      description: '应用设计器2D平台是一款快速...',
      courses: -1,
      time: '3,585 分钟',
      views: 156,
      image: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 8,
      title: '数据标注平台实验环境',
      type: '平台型',
      typeColor: 'bg-blue-500',
      description: '开源的数据标注工具，支持在...',
      courses: 1,
      time: '6,239 分钟',
      views: 212,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee57d5?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 9,
      title: 'VSCode',
      type: '容器型',
      typeColor: 'bg-purple-500',
      description: 'Visual Studio Code（简称VS...',
      courses: 0,
      time: '36,965 分钟',
      views: 148,
      image: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?auto=format&fit=crop&q=80&w=600&h=300'
    },
    {
      id: 10,
      title: '人工智能平台-jupyter',
      type: '容器型',
      typeColor: 'bg-purple-500',
      description: 'Jupyter是一款开源的交互式...',
      courses: 35,
      time: '594,426 分钟',
      views: 1316,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=300'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate && onNavigate('course-hall')}>
            <img src="/logo.png" alt="UUSIMA 智慧教学实验平台" className="h-8 object-contain" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-500">
            <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate && onNavigate('course-hall')}>课程大厅</button>
            <button className="text-blue-500 font-medium transition-colors" onClick={() => onNavigate && onNavigate('lab-hall')}>实验大厅</button>
            <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate && onNavigate('dataset-hall')}>数据大厅</button>
            <a href="https://aixb.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">AI技能分析系统</a>
            <a href="https://lct-xy.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">AI产教融合系统</a>
            <a href="https://deviceai.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">硬件智能体系统</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => e.preventDefault()}>考试系统</a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6 text-sm">
          <button className="flex items-center text-slate-600 hover:text-blue-500 transition-colors">
            <Languages className="w-4 h-4 mr-1" />
            En
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('personal')}
            className="text-slate-700 hover:text-blue-500 font-medium transition-colors"
          >
            我的主页
          </button>

          {/* User Profile Dropdown Component */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                Y
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col">
        {/* Top Banner and Filters Section */}
        <div className="bg-gradient-to-b from-[#e8f0fe] to-white border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-6 py-6 w-full">
            
            {/* Header & Search row */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                   <MonitorPlay className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">实验环境</h1>
                  <p className="text-sm text-slate-500 mt-1">数十种环境赋能智能实训教学</p>
                </div>
              </div>
              
              <div className="w-80 flex">
                <input 
                  type="text" 
                  placeholder="请输入关键字进行搜索" 
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-l-md outline-none focus:border-blue-400 transition-colors"
                />
                <button className="px-4 py-2 bg-slate-50 border border-slate-200 border-l-0 rounded-r-md text-slate-500 hover:bg-slate-100 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className={`space-y-4 text-sm transition-all duration-300 overflow-hidden ${isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex items-start">
                <span className="text-slate-600 font-medium w-16 pt-1.5 shrink-0">分类：</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveCategory(item.id)}
                      className={`px-4 py-1.5 rounded-md transition-colors ${
                        activeCategory === item.id 
                          ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                          : 'text-slate-600 hover:text-blue-600 border border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-slate-600 font-medium w-16 pt-1.5 shrink-0">专业：</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {majorItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMajor(item.id)}
                      className={`px-4 py-1.5 rounded-md transition-colors ${
                        activeMajor === item.id 
                          ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                          : 'text-slate-600 hover:text-blue-600 border border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-slate-600 font-medium w-16 pt-1.5 shrink-0">子类：</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {subCategoryItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubCategory(item.id)}
                      className={`px-4 py-1.5 rounded-md transition-colors ${
                        activeSubCategory === item.id 
                          ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                          : 'text-slate-600 hover:text-blue-600 border border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Collapse toggle */}
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-500 transition-colors"
              >
                <span>{isFilterExpanded ? '收起' : '展开'}</span>
                {isFilterExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
            
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-[1440px] mx-auto px-6 py-6 w-full flex-1">
          {/* Sorting */}
          <div className="flex items-center space-x-6 mb-6">
            {sortItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSort(item.id)}
                className={`text-sm transition-colors ${
                  activeSort === item.id ? 'text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {labs.map(lab => (
              <div key={lab.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  <img src={lab.image} alt={lab.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 space-x-2">
                    <div className="flex items-center space-x-2 font-medium text-slate-800 truncate">
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0">
                        {/* placeholder icon matching the ones in the image - blue tint */}
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="truncate">{lab.title}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded text-white shrink-0 font-medium ${lab.typeColor}`}>
                      {lab.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                    实验简介：{lab.description}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-auto mb-3">
                    <div className="flex items-center">
                      <BarChart2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {lab.courses} 门
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {lab.time}
                    </div>
                    <div className="flex items-center">
                      <Activity className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {lab.views} 浏览人次
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <Flame className="w-3.5 h-3.5 text-orange-500 mr-1" />
                      <span className="text-xs text-slate-600 mr-2">热门课程：</span>
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 bg-blue-100 rounded-sm border border-white"></div>
                        <div className="w-5 h-5 bg-blue-200 rounded-sm border border-white"></div>
                        <div className="w-5 h-5 bg-blue-300 rounded-sm border border-white"></div>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors">
                      立即体验
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
