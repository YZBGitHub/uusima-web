import React, { useState } from 'react';
import { Smartphone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface ForgotPasswordProps {
  onNavigate?: (view: any) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleGetCode = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fa] font-sans relative px-4 py-8 overflow-hidden">
      
      {/* 动态氛AI氛围背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* 背景漂浮曲线 */}
        <div className="absolute inset-0 opacity-60">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="curve1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="curve2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="curve3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <motion.path 
              d="M -200 500 C 100 200, 400 800, 800 400 S 1200 400, 1400 600" 
              fill="none" 
              stroke="url(#curve1)" 
              strokeWidth="2" 
              animate={{
                d: [
                  "M -200 500 C 100 200, 400 800, 800 400 S 1200 400, 1400 600",
                  "M -200 600 C 200 100, 500 700, 900 300 S 1300 500, 1400 400",
                  "M -200 500 C 100 200, 400 800, 800 400 S 1200 400, 1400 600"
                ]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path 
              d="M -200 200 C 300 600, 600 100, 1000 500 S 1400 300, 1600 400" 
              fill="none" 
              stroke="url(#curve2)" 
              strokeWidth="3" 
              animate={{
                d: [
                  "M -200 200 C 300 600, 600 100, 1000 500 S 1400 300, 1600 400",
                  "M -200 300 C 200 500, 700 200, 900 600 S 1300 200, 1600 500",
                  "M -200 200 C 300 600, 600 100, 1000 500 S 1400 300, 1600 400"
                ]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
             <motion.path 
              d="M -200 800 C 200 400, 500 900, 900 500 S 1300 700, 1500 600" 
              fill="none" 
              stroke="url(#curve3)" 
              strokeWidth="1.5" 
              animate={{
                d: [
                  "M -200 800 C 200 400, 500 900, 900 500 S 1300 700, 1500 600",
                  "M -200 700 C 300 300, 600 800, 1000 600 S 1400 800, 1500 500",
                  "M -200 800 C 200 400, 500 900, 900 500 S 1300 700, 1500 600"
                ]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </svg>
        </div>
        {/* 漂浮光晕 */}
        <motion.div
           className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply"
           animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
         />
         <motion.div
           className="absolute top-2/3 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl mix-blend-multiply"
           animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
           transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
         />
      </div>

      {/* 顶部 Logo */}
      <div 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center cursor-pointer z-10" 
        onClick={() => onNavigate && onNavigate('home')}
      >
        <div className="flex items-center space-x-2">
           <svg viewBox="0 0 160 50" className="h-10 md:h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M10 25 C10 12, 22 10, 22 10 C22 10, 34 12, 34 25 C34 25, 22 35, 10 25 Z" fill="#E34823" />
             <path d="M38 10 C38 10, 50 12, 50 25 C50 38, 38 40, 38 40 L38 25 Z" fill="#1B93D4" />
             <path d="M10 30 C10 40, 22 45, 22 45 C22 45, 34 40, 34 30 L22 30 Z" fill="#E8AA35" />
             <path d="M38 28 C38 28, 50 30, 45 42 C40 45, 38 45, 38 45 L38 28 Z" fill="#0D8F42" />
             <path d="M22 22 L24 16 L28 20 L22 22 Z" fill="white" />
             <text x="58" y="32" fontFamily="sans-serif" fontWeight="900" fontSize="28" fill="#222">UUSIMA</text>
             <circle cx="127" cy="14" r="3" fill="#1B93D4" />
             <rect x="124" y="18" width="6" height="2" fill="#E34823" />
             <text x="58" y="44" fontFamily="sans-serif" fontSize="8" fill="#444">where skills become intelligent</text>
             <text x="150" y="32" fontFamily="sans-serif" fontSize="8" fill="#444">®</text>
           </svg>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* 头部：Logo 和标题 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">找回密码</h2>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          {/* 手机号 */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50 hover:bg-white"
                placeholder="请输入已注册的手机号"
              />
            </div>
          </div>

          {/* 验证码 */}
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={6}
                className="block w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 text-center tracking-widest font-mono text-lg placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-left bg-slate-50 hover:bg-white"
                placeholder="请输入验证码"
              />
            </div>
            <button
              type="button"
              disabled={countdown > 0}
              onClick={handleGetCode}
              className="px-4 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-500 disabled:bg-slate-100"
            >
              {countdown > 0 ? `${countdown}s 后重新获取` : '获取验证码'}
            </button>
          </div>

          {/* 新密码 */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="block w-full pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50 hover:bg-white"
                placeholder="请输入新密码"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* 确认新密码 */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="block w-full pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50 hover:bg-white"
                placeholder="请再次输入新密码"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* 操作区 */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
            >
              确认修改并登录
            </button>
          </div>

          {/* 返回登录 */}
          <div className="text-center mt-6">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('login');
              }}
              className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              返回登录
            </a>
          </div>

        </form>
      </div>

      {/* 底部版权信息 */}
      <div className="absolute bottom-6 text-center z-10">
        <p className="text-[11px] text-slate-400">
          Copyright © 2026 UUSIMA 版权所有
        </p>
      </div>
    </div>
  );
}
