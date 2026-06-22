import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, Cpu, ChevronRight, X, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onNavigate: (view: any) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'password' | 'sms'>('password');
  const [agreed, setAgreed] = useState(false);
  
  // SMS login states
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzleVerified, setPuzzleVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (!puzzleVerified) {
      setShowPuzzle(true);
    } else if (countdown === 0) {
      setCountdown(60);
      setPuzzleVerified(false); // require puzzle again for next code
    }
  };

  const handlePuzzleComplete = () => {
    setPuzzleVerified(true);
    setShowPuzzle(false);
    setCountdown(60); // Automatically send code and start countdown
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
        onClick={() => onNavigate('home')}
      >
        <div className="flex items-center space-x-2">
           {/* SVG Approximation of the uploaded UUSIMA logo */}
           <svg viewBox="0 0 160 50" className="h-10 md:h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
             {/* Logo Mark */}
             <path d="M10 25 C10 12, 22 10, 22 10 C22 10, 34 12, 34 25 C34 25, 22 35, 10 25 Z" fill="#E34823" />
             <path d="M38 10 C38 10, 50 12, 50 25 C50 38, 38 40, 38 40 L38 25 Z" fill="#1B93D4" />
             <path d="M10 30 C10 40, 22 45, 22 45 C22 45, 34 40, 34 30 L22 30 Z" fill="#E8AA35" />
             <path d="M38 28 C38 28, 50 30, 45 42 C40 45, 38 45, 38 45 L38 28 Z" fill="#0D8F42" />
             <path d="M22 22 L24 16 L28 20 L22 22 Z" fill="white" />
             {/* Text "UUSIMA" */}
             <text x="58" y="32" fontFamily="sans-serif" fontWeight="900" fontSize="28" fill="#222">UUSIMA</text>
             {/* Red dot on I */}
             <circle cx="127" cy="14" r="3" fill="#1B93D4" />
             <rect x="124" y="18" width="6" height="2" fill="#E34823" />
             {/* Slogan */}
             <text x="58" y="44" fontFamily="sans-serif" fontSize="8" fill="#444">where skills become intelligent</text>
             <text x="150" y="32" fontFamily="sans-serif" fontSize="8" fill="#444">®</text>
           </svg>
        </div>
      </div>

      {/* 表单容器 (居中) */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">欢迎登录</h2>
          <div className="flex space-x-8 justify-center mt-6 border-b border-slate-100">
            <button 
              onClick={() => setLoginMode('password')}
              className={`py-2 px-2 text-sm font-medium transition-colors relative ${loginMode === 'password' ? 'text-[#1e80ff]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              账号登录
              {loginMode === 'password' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e80ff] rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setLoginMode('sms')}
              className={`py-2 px-2 text-sm font-medium transition-colors relative ${loginMode === 'sms' ? 'text-[#1e80ff]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              短信登录
              {loginMode === 'sms' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e80ff] rounded-t-full"></div>}
            </button>
          </div>
        </div>

        <form className="space-y-5" onSubmit={(e) => { 
          e.preventDefault(); 
          onNavigate('personal'); 
        }}>
          {loginMode === 'password' ? (
            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="用户名/手机号" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-slate-50 hover:bg-white"
                  required
                />
              </div>
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="密码" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-slate-50 hover:bg-white"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <input 
                  type="tel" 
                  placeholder="请输入手机号码" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-slate-50 hover:bg-white"
                  required
                />
              </div>
              
              <div className="relative flex space-x-3">
                <input 
                  type="text" 
                  placeholder="短信验证码" 
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-slate-50 hover:bg-white"
                  required
                />
                <button 
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors w-32 whitespace-nowrap
                    ${countdown > 0 
                      ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
                      : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                >
                  {countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
                </button>

                {/* 简单的模拟图形验证码浮层 */}
                {showPuzzle && (
                  <div className="absolute right-0 top-full mt-2 w-full bg-white border border-slate-200 shadow-xl rounded-lg p-5 z-50 animate-in fade-in slide-in-from-top-2">
                     <div className="flex items-center justify-between mb-4">
                       <span className="text-sm font-medium text-slate-700 flex items-center">
                         <ShieldCheck className="w-4 h-4 text-blue-500 mr-1.5" />
                         请完成安全验证
                       </span>
                       <button type="button" onClick={() => setShowPuzzle(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"><X className="w-4 h-4"/></button>
                     </div>
                     <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden group shadow-inner">
                       {/* Mock background pattern */}
                       <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80')] bg-cover"></div>
                       <Cpu className="w-8 h-8 text-slate-400 absolute" />
                       <span className="text-xs text-slate-500 relative z-10 hidden group-hover:block transition-all">滑动滑块进行验证</span>
                     </div>
                     {/* 模拟滑块 */}
                     <div className="h-10 bg-slate-100 rounded-full relative shadow-inner overflow-hidden flex items-center group cursor-pointer" onClick={handlePuzzleComplete}>
                       <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-full bg-green-100 transition-all duration-500"></div>
                       <div className="text-xs text-slate-400 absolute w-full text-center group-hover:text-transparent transition-colors z-10 pointer-events-none">向右滑动完成拼图</div>
                       <div className="h-10 w-12 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center relative z-20 group-hover:translate-x-[calc(100vw-300px)] md:group-hover:translate-x-[14rem] transition-transform duration-500 ease-in-out">
                         <ChevronRight className="w-5 h-5 text-slate-400" />
                       </div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center mb-4">
            <input 
              type="checkbox" 
              id="login-terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 flex-shrink-0 cursor-pointer"
            />
            <label htmlFor="login-terms" className="text-xs text-slate-500 cursor-pointer select-none ml-2">
              我已阅读并同意 <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline">服务条款</a> 和 <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline">隐私政策</a>
            </label>
          </div>

          <button 
            type="submit"
            onClick={(e) => {
              if (!agreed) {
                e.preventDefault();
                alert('请先阅读并同意服务条款和隐私政策');
              }
            }}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
          >
            登录
          </button>
          
          <div className="flex items-center justify-between mt-6">
            <button 
              type="button" 
              onClick={() => onNavigate('registration')}
              className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              立即注册
            </button>
            <button 
              type="button" 
              onClick={() => onNavigate('forgot-password')}
              className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              忘记密码
            </button>
          </div>

          <div className="mt-8">
            <div className="relative flex items-center py-4">
               <div className="flex-grow border-t border-slate-200"></div>
               <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">或使用以下方式登录</span>
               <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button 
              type="button"
              className="w-full py-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 rounded-lg text-sm font-medium transition-colors"
            >
              微信登录
            </button>
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
