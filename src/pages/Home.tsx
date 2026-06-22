import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Bot, Languages, ChevronDown, User, MonitorSmartphone, FolderOpen, PieChart, Star, ArrowUp } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: any) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  // Carousel mock state
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br from-blue-500 to-indigo-600 rounded" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
              N
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">UUSIMA <span className="font-medium text-base ml-1">智慧教学实验平台</span></span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">课程大厅</a>
            <a href="#" className="hover:text-blue-600 transition-colors">实验大厅</a>
            <a href="#" className="hover:text-blue-600 transition-colors">考试大厅</a>
            <a href="#" className="hover:text-blue-600 transition-colors">最佳实践</a>
            <a href="#" className="hover:text-blue-600 transition-colors">产品中心</a>
            <a href="#" className="hover:text-blue-600 transition-colors">关于UUSIMA</a>
            <button className="flex items-center hover:text-blue-600 transition-colors">
              <span className="mb-1">...</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6 text-sm">
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <Bot className="w-4 h-4" />
          </button>
          <button className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
            <Languages className="w-4 h-4 mr-1" />
            En
          </button>
          <button 
            onClick={() => onNavigate('personal')}
            className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
          >
            我的主页
          </button>

          {/* User Profile Dropdown Component */}
          <div className="relative group cursor-pointer flex items-center space-x-2">
            <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-slate-700 font-medium text-sm">杨振邦<span className="text-slate-400 font-normal text-xs">(15396005420)</span></span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
            
            {/* Dropdown Menu (Hover to reveal for simple mock) */}
            <div className="absolute top-10 right-0 w-48 bg-white border border-slate-100 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button 
                onClick={() => onNavigate('personal')}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50"
              >
                个人中心
              </button>
              <button 
                onClick={() => onNavigate('config')}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50"
              >
                系统管理
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Banner Section */}
      <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-r from-[#eef4fd] to-[#e1effc]">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-40" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)' 
        }}></div>
        <div className="absolute inset-0 opacity-10 space-y-4 pt-10 px-8" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)' }}>
          {/* Mock grid lines */}
        </div>

        <div className="max-w-7xl mx-auto h-full flex items-center relative z-10 px-12">
          {/* Left Content */}
          <div className="flex-1 max-w-xl pr-12">
            <h1 className="text-5xl font-extrabold text-slate-800 mb-2 tracking-tight italic" style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.5)' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                AI智能辅助大模型
              </span>
            </h1>
            <p className="text-xl font-bold text-blue-800 mb-8 tracking-wider italic">
              Al intelligent assistant large model
            </p>
            
            <div className="w-16 h-1 bg-slate-300 mb-6"></div>
            
            <p className="text-lg text-slate-700 leading-relaxed font-medium mb-4">
               —— 平台集成智能辅教、实训智学、学情画像多系统，覆盖大模型助教-助学-助评全流程闭环，实现"教、学、练、评"一体化服务
            </p>
            <p className="text-sm text-slate-500 leading-relaxed font-normal">
              Platform integration of intelligent teaching assistance, practical training intelligent learning, and student profile multi-system, covering the full process of large model teaching assistance-self-helpevaluation, to achieve "teaching, learning, training, and evaluation" integrated services.
            </p>
          </div>

          {/* Right Image area (3D Mockup) */}
          <div className="flex-1 h-full flex items-center justify-center relative">
             <div className="relative w-full max-w-[500px] aspect-square rounded-full flex items-center justify-center">
                {/* Simulated 3D computer icon using gradients and an image placeholder if possible */}
                <img 
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop" 
                  alt="Computer Mockup"
                  className="w-full h-full object-cover rounded shadow-2xl z-10 border-4 border-white/50 relative object-[center_right] mix-blend-multiply"
                  style={{ maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)' }}
                />
             </div>
          </div>
        </div>

        {/* Floating Card element */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg flex items-center space-x-6 z-20 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <MonitorSmartphone className="w-6 h-6" />
          </div>
          <div className="flex items-center space-x-4 border-l border-slate-200 pl-4">
            <span className="text-4xl font-light text-slate-300">01</span>
            <div>
              <p className="text-blue-500 font-medium text-lg leading-tight mb-1">
                2025年9月20日 智联网...
              </p>
              <p className="text-slate-400 text-xs">
                2025年10月15日 16:16
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors z-20">
          <ChevronLeft className="w-10 h-10 drop-shadow-md" />
        </button>
        <button className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors z-20">
          <ChevronRight className="w-10 h-10 drop-shadow-md" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-16 flex space-x-2 z-20">
          <div className="w-2 h-2 rounded-full bg-slate-300/50 cursor-pointer"></div>
          <div className="w-8 h-2 rounded-full bg-blue-600 cursor-pointer"></div>
        </div>
      </div>

      {/* Right Fixed Toolbar */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-50">
        <button className="w-14 h-14 bg-white rounded shadow-md border border-slate-100 flex flex-col items-center justify-center text-[#1e80ff] hover:bg-blue-50 transition-colors group">
          <MonitorSmartphone className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] whitespace-nowrap">申请试用</span>
        </button>
        <button className="w-14 h-14 bg-white rounded shadow-md border border-slate-100 flex flex-col items-center justify-center text-slate-500 hover:text-[#1e80ff] hover:bg-blue-50 transition-colors group">
          <FolderOpen className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] whitespace-nowrap">产业课程</span>
        </button>
        <button className="w-14 h-14 bg-white rounded shadow-md border border-slate-100 flex flex-col items-center justify-center text-slate-500 hover:text-[#1e80ff] hover:bg-blue-50 transition-colors group">
          <PieChart className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] whitespace-nowrap">职业规划</span>
        </button>
        <button className="w-14 h-14 bg-white rounded shadow-md border border-slate-100 flex flex-col items-center justify-center text-slate-500 hover:text-[#1e80ff] hover:bg-blue-50 transition-colors group">
          <Star className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] whitespace-nowrap">专业建设</span>
        </button>
        <button className="w-14 h-14 bg-white rounded shadow-md border border-slate-100 flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors mt-4">
           <ArrowUp className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
