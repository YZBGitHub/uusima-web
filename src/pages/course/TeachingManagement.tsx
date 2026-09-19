import React, { useState } from 'react';
import UserProfileDropdown from '../../components/UserProfileDropdown';
import { Book, LayoutGrid, Clock, Tag, Database, Home, PieChart, Shield, Trophy, Users, User, BookOpen, UserCheck, GraduationCap, ChevronDown, ChevronUp, PanelLeftClose, PanelLeft, FileText } from 'lucide-react';
import { Languages } from 'lucide-react';
import CourseManagement from './CourseManagement';
import { QuestionManagement } from './QuestionBankManagement';
import { AutoGradingManagement } from './AutoGradingManagement';

export default function TeachingManagement({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [activeMenu, setActiveMenu] = useState('course-list');
  const [isCourseManagementOpen, setIsCourseManagementOpen] = useState(true);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarItems = [
    {
      id: 'course-management',
      label: '课程管理',
      icon: Book,
      isOpen: isCourseManagementOpen,
      toggle: () => setIsCourseManagementOpen(!isCourseManagementOpen),
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
    { id: 'account', label: '账户管理', icon: User },
    { id: 'teaching', label: '教学管理', icon: BookOpen },
    { id: 'teacher-home', label: '教师主页', icon: UserCheck },
    { id: 'student-home', label: '学生主页', icon: GraduationCap },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 shrink-0 z-50">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate && onNavigate('course-hall')}>
            <div className="flex items-center space-x-2">
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
          </div>
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-500">
            <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate && onNavigate('course-hall')}>课程大厅</button>
            <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate && onNavigate('lab-hall')}>实验大厅</button>
            <a href="https://aixb.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">AI技能分析系统</a>
            <a href="https://lct-xy.nlecloud.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">AI产教融合系统</a>
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
            className="text-blue-500 font-medium transition-colors"
          >
            我的主页
          </button>
          
          <UserProfileDropdown onNavigate={onNavigate} />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full shadow-sm z-20 relative`}>
        <div className="border-b border-slate-200 p-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center px-0'} py-2 text-slate-500 hover:bg-slate-100 rounded transition-colors`}
            title={isSidebarOpen ? '收起导航' : '展开导航'}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5 mr-3" /> : <PanelLeft className="w-5 h-5" />}
            {isSidebarOpen && <span className="text-sm font-medium">收起侧边栏</span>}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {sidebarItems.map((item, idx) => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button 
                    onClick={() => {
                      if (!isSidebarOpen) setIsSidebarOpen(true);
                      item.toggle();
                    }}
                    className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-6' : 'justify-center px-0'} py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${isSidebarOpen ? 'mr-3' : ''} ${item.isOpen ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-500'}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      {isSidebarOpen && item.label}
                    </div>
                    {isSidebarOpen && (item.isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />)}
                  </button>
                  {item.isOpen && isSidebarOpen && (
                    <div className="bg-[#f0f6ff] py-1">
                      {item.children.map(child => {
                        const hasSub = !!child.children && child.children.length > 0;
                        if (hasSub) {
                          return (
                            <div key={child.id} className="space-y-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsQuestionBankOpen(!isQuestionBankOpen);
                                  if (activeMenu !== 'question-list' && activeMenu !== 'questions') {
                                    setActiveMenu('question-list');
                                  }
                                }}
                                className={`w-full flex items-center justify-between pl-14 pr-6 py-2 text-sm transition-colors ${
                                  activeMenu === child.id || child.children?.some(sc => sc.id === activeMenu)
                                    ? 'bg-[#e6f7ff] text-[#1890ff] font-medium' 
                                    : 'text-slate-600 hover:bg-blue-50/50 hover:text-[#1890ff]'
                                }`}
                              >
                                <div className="flex items-center">
                                  <child.icon className="w-4 h-4 mr-2 text-[#1890ff]" />
                                  <span>{child.label}</span>
                                </div>
                                {isQuestionBankOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                              </button>

                              {isQuestionBankOpen && (
                                <div className="bg-blue-50/50 py-0.5">
                                  {child.children?.map(sub => (
                                    <button
                                      key={sub.id}
                                      type="button"
                                      onClick={() => setActiveMenu(sub.id)}
                                      className={`w-full flex items-center pl-20 pr-6 py-1.5 text-xs transition-colors ${
                                        activeMenu === sub.id
                                          ? 'bg-blue-100 text-[#1890ff] font-semibold'
                                          : 'text-slate-500 hover:text-[#1890ff] hover:bg-blue-50'
                                      }`}
                                    >
                                      <sub.icon className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                      <span>{sub.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <button
                            key={child.id}
                            onClick={() => setActiveMenu(child.id)}
                            className={`w-full flex items-center pl-14 pr-6 py-2.5 text-sm transition-colors ${
                              activeMenu === child.id 
                                ? 'bg-[#e6f7ff] text-[#1890ff] font-medium' 
                                : 'text-slate-600 hover:bg-blue-50/50 hover:text-[#1890ff]'
                            }`}
                          >
                            <child.icon className="w-4 h-4 mr-2 text-[#1890ff]" />
                            {child.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center ${isSidebarOpen ? 'px-6' : 'justify-center px-0'} py-3 text-sm transition-colors ${
                    activeMenu === item.id 
                      ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${isSidebarOpen ? 'mr-3' : ''} ${
                    activeMenu === item.id ? 'bg-blue-100 text-blue-600' : 
                    idx === 1 ? 'bg-green-100 text-green-500' :
                    idx === 2 ? 'bg-emerald-100 text-emerald-500' :
                    idx === 3 ? 'bg-amber-100 text-amber-500' :
                    idx === 4 ? 'bg-lime-100 text-lime-500' :
                    idx === 5 || idx === 7 ? 'bg-blue-100 text-blue-500' :
                    idx === 6 ? 'bg-orange-100 text-orange-500' :
                    idx === 8 ? 'bg-yellow-100 text-yellow-600' :
                    idx === 9 ? 'bg-blue-100 text-blue-500' :
                    idx === 10 ? 'bg-teal-100 text-teal-500' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  {isSidebarOpen && item.label}
                  {isSidebarOpen && <ChevronDown className="w-4 h-4 text-slate-300 ml-auto -rotate-90" />}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {activeMenu === 'course-list' || activeMenu === 'course-management' ? (
          <CourseManagement />
        ) : activeMenu === 'questions' || activeMenu === 'question-list' ? (
          <QuestionManagement />
        ) : activeMenu === 'auto-grading' ? (
          <AutoGradingManagement />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50">
            {sidebarItems.find(i => i.id === activeMenu)?.label || '模块开发中...'}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
