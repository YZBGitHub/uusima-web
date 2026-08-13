import React, { useState } from 'react';
import { ChevronDown, Search, Bot, Languages, User, UserCircle, Settings, LogOut, Activity, ChevronRight, BookOpen } from 'lucide-react';

export default function CourseHall({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const activeTenant = { name: "教育公司" };
  const [activeSort, setActiveSort] = useState('默认排序');
  const [selectedMajor, setSelectedMajor] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');

  const majors = ['全部', '物联网', '人工智能', '工业互联网', '大数据', '区块链', '专业技术技能', '岗位课程'];
  const types = ['全部', '岗位技能认证', '基础通识', '专业基础课', '专业核心课', '行业应用课', '技能课程', '岗位认证课'];

  const courses = [
    {
      id: 1,
      title: '边缘计算技术应用',
      category: '物联网/边缘计算',
      students: 191,
      desc: '《边缘计算技术应用》课程通...',
      isPurchased: false,
      gradient: 'from-indigo-400 to-indigo-300'
    },
    {
      id: 2,
      title: '软件测试技术',
      category: '物联网/通用',
      students: 111,
      desc: '《软件测试技术》针对不同软...',
      isPurchased: false,
      gradient: 'from-blue-400 to-blue-300'
    },
    {
      id: 3,
      title: '系统运维技术',
      category: '物联网/通用',
      students: 195,
      desc: '本课程围绕智慧果园、智慧家...',
      isPurchased: false,
      gradient: 'from-indigo-500 to-indigo-400'
    },
    {
      id: 4,
      title: '物联网嵌入式技术（仿真）',
      category: '物联网/嵌入式系统',
      students: 368,
      desc: '物联网嵌入式技术（仿真）',
      isPurchased: false,
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 5,
      title: '传感器技术应用（仿真）',
      category: '物联网/传感器',
      students: 250,
      desc: '传感器技术应用（仿真）',
      isPurchased: false,
      gradient: 'from-indigo-400 to-purple-400'
    },
    {
      id: 6,
      title: '智慧行业应用开发-牧场、家居、温室',
      category: '物联网/行业应用',
      students: 249,
      desc: '本课程以项目式和任务式驱动...',
      isPurchased: true,
      gradient: 'from-indigo-400 to-blue-400'
    },
    {
      id: 7,
      title: '智慧煤矿应用开发',
      category: '物联网/行业应用',
      students: 261,
      desc: '本课程基于AIoT平台，围绕“...',
      isPurchased: false,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 8,
      title: '植物工厂应用开发',
      category: '物联网/行业应用',
      students: 247,
      desc: '本课程以智慧农业中的植物工...',
      isPurchased: false,
      gradient: 'from-blue-400 to-indigo-400'
    },
    {
      id: 9,
      title: '智慧健康应用开发',
      category: '物联网/行业应用',
      students: 206,
      desc: '智慧健康应用开发',
      isPurchased: false,
      gradient: 'from-indigo-400 to-purple-400'
    },
    {
      id: 10,
      title: '智慧水务应用开发',
      category: '物联网/行业应用',
      students: 204,
      desc: '智慧水务应用开发',
      isPurchased: true,
      gradient: 'from-blue-400 to-cyan-400'
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
            <button className="text-blue-500 font-medium transition-colors" onClick={() => onNavigate && onNavigate('course-hall')}>课程大厅</button>
            <a href="#" className="hover:text-blue-500 transition-colors">实验大厅</a>
            <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate && onNavigate('dataset-hall')}>数据大厅</button>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => e.preventDefault()}>考试系统</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => e.preventDefault()}>AI全过程数据采集</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => e.preventDefault()}>AI智能体应用</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => e.preventDefault()}>AI产教融合工作台</a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6 text-sm">
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <Bot className="w-4 h-4" />
          </button>
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
                      <span className="text-[13px] text-slate-700 truncate">{activeTenant ? activeTenant.name : "教育公司"}</span>
                    </div>
                    <button 
                      onClick={() => { setIsUserMenuOpen(false); setIsTenantOpen && setIsTenantOpen(true); }}
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

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto pb-10">
        
        {/* Search & Filter Top Section */}
        <div className="bg-[#eff2f6] px-8 py-6 rounded-b-xl border border-slate-200 border-t-0 mb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">课程大厅</h1>
                <p className="text-sm text-slate-500 mt-0.5">真实行业项目实战学习</p>
              </div>
            </div>
            
            <div className="flex items-center border border-slate-200 bg-white rounded-md overflow-hidden w-96 shadow-sm">
              <div className="relative flex-1 border-r border-slate-200">
                <select className="w-full appearance-none px-3 py-2 text-sm text-slate-600 bg-transparent outline-none cursor-pointer">
                  <option value="">请选择标签</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="flex-[2] flex items-center px-3 py-2 relative">
                <input type="text" placeholder="请输入课程名进行搜索" className="w-full text-sm outline-none text-slate-600 bg-transparent" />
              </div>
              <button className="px-4 py-2 hover:bg-slate-50 transition-colors text-slate-400 border-l border-slate-200">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="text-sm font-medium text-slate-700 w-20 shrink-0 mt-1.5">专业：</div>
              <div className="flex flex-wrap gap-2 flex-1">
                {majors.map(m => (
                  <button 
                    key={m}
                    onClick={() => setSelectedMajor(m)}
                    className={`px-3 py-1.5 text-sm rounded ${selectedMajor === m ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-blue-500 border border-transparent'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-sm font-medium text-slate-700 w-20 shrink-0 mt-1.5">课程类型：</div>
              <div className="flex flex-wrap gap-2 flex-1 relative">
                {types.map(t => (
                  <button 
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1.5 text-sm rounded ${selectedType === t ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-blue-500 border border-transparent'}`}
                  >
                    {t}
                  </button>
                ))}
                <button className="absolute right-0 top-1.5 text-sm text-slate-500 hover:text-slate-800">
                  展开
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8">
          {/* Tabs */}
          <div className="flex items-center space-x-6 border-b border-slate-200 mb-6 pb-2">
            {['默认排序', '最新', '使用最多'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSort(tab)}
                className={`text-sm pb-2 -mb-2.5 transition-colors relative ${activeSort === tab ? 'text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {tab}
                {activeSort === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden flex flex-col cursor-pointer group">
                <div className={`h-36 w-full relative bg-gradient-to-br ${course.gradient} overflow-hidden flex items-center justify-center p-4`}>
                  {course.isPurchased && (
                    <div className="absolute top-2 left-2 bg-[#8cc63f] text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-sm z-10">
                      已购买
                    </div>
                  )}
                  {/* Decorative backdrop elements (simulating 3D) */}
                  <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute left-[-10%] top-[-10%] w-20 h-20 bg-white/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                  <h3 className="text-white font-bold text-lg text-center relative z-10 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity leading-tight px-2">{course.title}</h3>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-[15px] font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-blue-500 font-medium truncate pr-2">{course.category}</span>
                    <span className="text-blue-500 shrink-0">{course.students} 人在学</span>
                  </div>
                  
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed flex-1">
                    课程概述：{course.desc}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-slate-400 mr-1">实验环境：</span>
                      <div className="w-4 h-4 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                        <Activity className="w-2.5 h-2.5" />
                      </div>
                      <div className="w-4 h-4 rounded bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <Bot className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600 shadow-sm">
                      AI
                    </div>
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
