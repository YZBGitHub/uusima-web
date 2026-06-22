import React, { useState } from 'react';
import { Plus, X, Search, ChevronDown, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function Header() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br from-blue-500 to-indigo-600 rounded">
                N
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">UUSIMA <span className="font-medium text-base ml-1">智慧教学实验平台</span></span>
          </div>
          <div className="h-5 w-px bg-slate-300 mx-2" />
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600">课程大厅</a>
            <a href="#" className="hover:text-blue-600">实验大厅</a>
            <a href="#" className="hover:text-blue-600">考试大厅</a>
            <a href="#" className="hover:text-blue-600">最佳实践</a>
            <a href="#" className="hover:text-blue-600">产品中心</a>
            <a href="#" className="hover:text-blue-600">关于UUSIMA</a>
          </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src="https://ui-avatars.com/api/?name=AI&background=eff6ff&color=1d4ed8" alt="AI Agent" className="w-6 h-6 rounded-full" />
          <div className="flex items-center bg-slate-100 rounded px-2 py-1 text-xs text-slate-600">
            中/En
          </div>
        </div>
        <span className="text-sm font-medium text-slate-600">我的主页</span>
        <div className="flex items-center text-sm font-medium text-slate-600 cursor-pointer">
          学校管理员 <ChevronDown className="w-4 h-4 ml-1" />
        </div>
      </div>
    </header>
  );
}

function BindEmailModal({ onClose }: { onClose: () => void }) {
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
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center">
      <div className="bg-white w-[400px] rounded-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">绑定邮箱</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">邮箱地址</label>
            <input type="email" placeholder="请输入需要绑定的邮箱" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">验证码</label>
            <div className="flex space-x-2">
               <input type="text" placeholder="请输入验证码" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
               <button 
                onClick={handleGetCode}
                disabled={countdown > 0}
                className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {countdown > 0 ? `${countdown}s` : '获取验证码'}
               </button>
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
             <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">取消</button>
             <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">确认绑定</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoTab() {
  return (
    <div className="flex flex-col md:flex-row gap-16">
      {/* 左侧表单区 (约 70% 宽度) */}
      <div className="flex-1 max-w-[500px]">
        <div className="space-y-6">
          <div>
            <div className="text-sm text-slate-600 mb-2">账号:</div>
            <div className="text-sm font-medium text-slate-800">18650001001</div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>用户名:
            </label>
            <input 
              type="text" 
              defaultValue="学校管理员"
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">手机号:</label>
            <input 
              type="text" 
              defaultValue="18650001001"
              disabled
              className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded px-3 py-2 text-sm cursor-not-allowed" 
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>性别:
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="gender" value="female" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-slate-700">女</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="gender" value="male" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-slate-700">男</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors">
              保存
            </button>
          </div>
        </div>
      </div>

      {/* 右侧头像区 (约 30% 宽度) */}
      <div className="w-48">
        <label className="block text-sm text-slate-600 mb-4">头像</label>
        <div className="w-28 h-28 border border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-center transition-colors">
          <Plus className="w-6 h-6 text-slate-400 font-light" strokeWidth={1} />
        </div>
      </div>
    </div>
  )
}

function SecurityTab({ onBindEmail, onModifyPassword }: { onBindEmail: () => void, onModifyPassword: () => void }) {
  return (
    <div className="max-w-[700px]">
      <h2 className="text-lg font-medium text-slate-800 mb-6 pb-2 border-b border-slate-100">安全设置</h2>
      
      <div className="space-y-0">
        {/* 绑定手机 - 模拟已绑定 */}
        <div className="flex items-center justify-between py-5 border-b border-slate-100">
           <div>
             <div className="font-medium text-slate-800 mb-1">绑定手机</div>
             <div className="text-sm text-slate-500">已绑定手机：186****1001</div>
           </div>
           <div>
             <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">修改手机</button>
           </div>
        </div>

        {/* 绑定微信 */}
        <div className="flex items-center justify-between py-5 border-b border-slate-100">
           <div>
             <div className="font-medium text-slate-800 mb-1">绑定微信</div>
             <div className="text-sm text-slate-500">已绑定 <span className="text-green-600">UUSIMA_User</span></div>
           </div>
           <div>
             <button className="text-sm text-slate-400 hover:text-slate-600 font-medium group relative">
               解除绑定
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-sm z-10">
                 需要短信验证
               </div>
             </button>
           </div>
        </div>

        {/* 绑定邮箱 - 模拟未绑定 */}
        <div className="flex items-center justify-between py-5 border-b border-slate-100">
           <div>
             <div className="font-medium text-slate-800 mb-1">绑定邮箱</div>
             <div className="text-sm text-slate-400">未绑定</div>
           </div>
           <div>
             <button onClick={onBindEmail} className="text-sm text-blue-600 hover:text-blue-700 font-medium">去绑定</button>
           </div>
        </div>
        
        {/* 登录密码 */}
        <div className="flex items-center justify-between py-5 border-b border-slate-100">
           <div>
             <div className="font-medium text-slate-800 mb-1">登录密码</div>
             <div className="text-sm text-slate-500">已设置</div>
           </div>
           <div>
             <button onClick={onModifyPassword} className="text-sm text-blue-600 hover:text-blue-700 font-medium">修改</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function AssetsTab() {
  return (
    <div className="max-w-[800px]">
      <h2 className="text-lg font-medium text-slate-800 mb-6 pb-2 border-b border-slate-100">我的资产</h2>
      
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* 装饰性光晕 */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/20 blur-2xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mb-8">
           <h3 className="text-xl font-semibold opacity-90">UUSIMA 游客体验套餐</h3>
           <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">进行中</span>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-8 divide-x divide-white/20">
           <div>
             <div className="text-blue-100 text-sm mb-2 font-medium">Tokens 余量</div>
             <div className="flex items-baseline space-x-1">
               <span className="text-4xl font-bold tracking-tight">1,000,000</span>
             </div>
           </div>
           <div className="pl-8">
             <div className="text-blue-100 text-sm mb-2 font-medium">实验时长余量</div>
             <div className="flex items-baseline space-x-1">
               <span className="text-4xl font-bold tracking-tight">100</span>
               <span className="text-blue-100 text-sm">分钟</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const [activeMenu, setActiveMenu] = useState('info');
  const [isBindEmailModalOpen, setIsBindEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean; title: string; content: string; onConfirm: () => void} | null>(null);

  return (
    <div className="absolute inset-0 bg-[#eef1f6] flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧侧边栏 */}
        <aside className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col py-2 shrink-0">
          <nav className="flex-1 space-y-1">
             <div className="px-4 py-2 text-sm text-slate-500 font-medium tracking-wide">基础信息</div>
             <button onClick={() => setActiveMenu('info')} className={`w-full flex items-center px-8 py-3 text-sm transition-colors ${activeMenu === 'info' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                <span className="mr-3">⭐</span> 我的信息
             </button>
             <button onClick={() => setActiveMenu('security')} className={`w-full flex items-center px-8 py-3 text-sm transition-colors ${activeMenu === 'security' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                <span className="mr-3">🛡️</span> 安全设置
             </button>
             <button onClick={() => setActiveMenu('assets')} className={`w-full flex items-center px-8 py-3 text-sm transition-colors ${activeMenu === 'assets' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                <span className="mr-3">💼</span> 我的资产
             </button>
          </nav>
        </aside>

        {/* 右侧主内容区 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#eef1f6]">
           <div className="h-full bg-white border border-slate-200 rounded min-h-[500px]">
              <div className="p-8">
                {activeMenu === 'info' && <InfoTab />}
                {activeMenu === 'security' && <SecurityTab onBindEmail={() => setIsBindEmailModalOpen(true)} onModifyPassword={() => setIsPasswordModalOpen(true)} />}
                {activeMenu === 'assets' && <AssetsTab />}
              </div>
           </div>
        </main>
      </div>

      {isBindEmailModalOpen && <BindEmailModal onClose={() => setIsBindEmailModalOpen(false)} />}
      
      {/* 修改密码弹窗 */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">修改密码</h2>
                  <button 
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">旧密码</label>
                      <input type="password" placeholder="请输入旧密码" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">新密码</label>
                      <input type="password" placeholder="设置新密码" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">确认新密码</label>
                      <input type="password" placeholder="再次确认新密码" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button 
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                       setIsPasswordModalOpen(false);
                       setConfirmConfig({ isOpen: true, title: '确认修改', content: '确定要提交并修改您的密码吗？', onConfirm: () => {} });
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    确认修改
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 确认提示弹窗 (Confirm Modal) */}
      <AnimatePresence>
        {confirmConfig?.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto"
              >
                 <div className="p-6">
                   <h3 className="text-lg font-bold text-slate-800 mb-2">{confirmConfig.title}</h3>
                   <p className="text-slate-600 text-sm">{confirmConfig.content}</p>
                 </div>
                 <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                    <button 
                      onClick={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                      className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      取消
                    </button>
                    <button 
                      onClick={() => {
                        confirmConfig.onConfirm();
                        setConfirmConfig({ ...confirmConfig, isOpen: false });
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      确认
                    </button>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
