import React, { useState } from 'react';
import { Smartphone, Eye, EyeOff, User, X, Check, ShieldCheck, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';

interface RegistrationProps {
  onNavigate?: (view: any) => void;
}

export default function Registration({ onNavigate }: RegistrationProps = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);

  // 滑块验证相关状态
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const handleGetCode = () => {
    setShowVerificationModal(true);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isVerified) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isVerified) return;
    const offset = e.clientX - dragStartX;
    const maxOffset = 300 - 48; // track width 300, thumb width 48
    setDragOffset(Math.max(0, Math.min(offset, maxOffset)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isVerified) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const maxOffset = 300 - 48;
    if (dragOffset >= maxOffset * 0.95) {
      setDragOffset(maxOffset);
      setIsVerified(true);
      setTimeout(() => {
        setShowVerificationModal(false);
        setTimeout(() => {
          setIsVerified(false);
          setDragOffset(0);
        }, 300);
        
        // 5分钟倒计时
        setCountdown(300);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 500);
    } else {
      setDragOffset(0);
    }
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 relative z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">欢迎注册</h2>
          <p className="text-slate-500 text-sm tracking-wide">领先的新一代数字技术科技企业</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* 手机号 & 验证码 */}
          <div className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-32 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50 hover:bg-white"
                  placeholder="请输入手机号"
                />
                {/* 内联获取验证码按钮 */}
                <div className="absolute inset-y-1 right-1 flex items-center">
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleGetCode}
                    className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {countdown > 0 ? (countdown > 60 ? `${Math.floor(countdown/60)}分${countdown%60}秒 后获取` : `${countdown}s 后重新获取`) : '获取验证码'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  className="block w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 text-center tracking-[0.5em] font-mono text-lg placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 bg-slate-50 hover:bg-white"
                  placeholder="请输入验证码"
                />
              </div>
            </div>
          </div>

          {/* 可选字段切换按钮 */}
          <div className="pt-2 relative z-10 w-fit">
            <button 
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              <span className="mr-1">更多设置</span>
              {showOptionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* 可选项：登录名、密码设置 */}
          {showOptionalFields && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">登录名</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50 hover:bg-white"
                    placeholder="不填默认跟手机号一致"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50 hover:bg-white"
                    placeholder="8-20位，至少包含字母与数字"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                  确认密码
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="block w-full pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50 hover:bg-white"
                    placeholder="请再次输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 操作区 */}
          <div className="pt-4 mt-2">
            <div className="flex items-center space-x-2 mb-6">
              <input 
                type="checkbox" 
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 flex-shrink-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-slate-500 cursor-pointer select-none">
                已阅读并同意 <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline">服务条款</a> 和 <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline">隐私政策</a>
              </label>
            </div>

            <button
              type="submit"
              onClick={(e) => {
                if (!agreed) {
                  e.preventDefault();
                  alert('请先同意服务条款和隐私政策');
                } else {
                  if (onNavigate) onNavigate('login');
                }
              }}
              className="w-full relative py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
            >
              同意协议并注册
            </button>
            
            <div className="mt-6 text-center">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('login');
                }}
                className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors inline-flex items-center group"
              >
                已有账号？去登录
                <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </form>
      </div>

      {/* 验证码滑块模态框 */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800 flex items-center">
                <ShieldCheck className="w-5 h-5 text-blue-500 mr-2" />
                安全验证
              </h3>
              <button 
                onClick={() => {
                  setShowVerificationModal(false);
                  setIsDragging(false);
                  setDragOffset(0);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6 text-center">请完成下方滑块验证以获取短信验证码</p>
              
              <div className="relative w-[300px] max-w-full h-12 bg-slate-100 rounded-lg overflow-hidden mx-auto shadow-inner">
                {/* 进度条背景 */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 transition-colors duration-200 ${isVerified ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${dragOffset + 24}px` }}
                ></div>
                
                {/* 提示文案 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 w-full text-sm">
                  {isVerified ? (
                    <span className="text-white font-medium flex items-center shadow-sm">
                      <Check className="w-4 h-4 mr-1" /> 验证成功
                    </span>
                  ) : (
                    <span className={`transition-opacity duration-200 ${dragOffset > 50 ? 'opacity-0' : 'text-slate-500'}`}>
                      向右拖动滑块填充拼图
                    </span>
                  )}
                </div>
                
                {/* 滑块 */}
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`absolute top-0 bottom-0 left-0 w-12 bg-white border border-slate-200 shadow-md flex items-center justify-center cursor-grab touch-none z-20 ${!isDragging && !isVerified ? 'transition-all duration-300' : ''}`}
                  style={{ transform: `translateX(${dragOffset}px)` }}
                >
                  {isVerified ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <ChevronRight className={`w-5 h-5 text-slate-400 ${isDragging ? 'text-blue-500' : ''}`} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
