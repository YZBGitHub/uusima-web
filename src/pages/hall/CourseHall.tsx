import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Bot, BookOpen, Activity } from 'lucide-react';
import AppHeader from '../../components/AppHeader';

export default function CourseHall({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const activeTenant = { name: "教育公司" };
  const [activeSort, setActiveSort] = useState('默认排序');
  const [selectedMajor, setSelectedMajor] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

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
      title: '数字孪生应用开发',
      category: '物联网/前端与可视化',
      students: 44,
      desc: '结合Three.js实现工业级数字孪...',
      isPurchased: false,
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 8,
      title: '工业自动化与PLC编程',
      category: '工业互联网/自动控制',
      students: 120,
      desc: '涵盖常见PLC接口与现场总线系统设计...',
      isPurchased: true,
      gradient: 'from-slate-600 to-slate-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex flex-col font-sans">
      {/* Header */}
      <AppHeader
        activeTab="course-hall"
        activeTenant={activeTenant}
        onNavigate={onNavigate}
        onSwitchTenant={() => setIsTenantOpen(true)}
      />

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
              <div className="flex flex-wrap gap-2 flex-1 relative pr-16">
                {majors.map(m => (
                  <button 
                    key={m}
                    onClick={() => setSelectedMajor(m)}
                    className={`px-3 py-1.5 text-sm rounded ${selectedMajor === m ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-blue-500 border border-transparent'}`}
                  >
                    {m}
                  </button>
                ))}
                <button 
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className="absolute right-0 top-1.5 flex items-center space-x-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <span>{isFilterExpanded ? '收起' : '展开'}</span>
                  {isFilterExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            
            {isFilterExpanded && (
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
                </div>
              </div>
            )}
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
                  
                  <div className="flex items-center mb-3 text-xs">
                    <span className="text-blue-500 font-medium truncate pr-2">{course.category}</span>
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
