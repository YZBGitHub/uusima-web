import React, { useState } from 'react';
import { Users, FileText, Settings, BookOpen, ChevronDown, ChevronRight, Search, Plus, Trash2, Edit2, Check, X, MoreHorizontal, Power, MinusCircle, Bell, UserCircle, BadgeCheck, FileClock, ArrowLeftRight, LogOut, CheckCircle2, LayoutGrid, Activity } from 'lucide-react';
import OrdersManagement from './OrdersManagement';
import Invite from './Invite';
import InviteRecords from './InviteRecords';
import UsersManagement from './UsersManagement';
import SystemHome from './SystemHome';
import ClassManagement from './system/ClassManagement';
import { motion, AnimatePresence } from 'motion/react';

// Mock data
const mockClasses: any[] = [];

const tenants = [
  { id: 'personal', name: '个人', status: 'active' },
  { id: 'school', name: '福建信息职业技术学院', role: '教师', status: 'active' },
  { id: 'enterprise', name: '新大陆时代科技有限公司', role: '企业员工', status: 'active' },
];

export default function ConfigManagement({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
  const [activeMenu, setActiveMenu] = useState('class');
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(true);
  
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTenantId, setActiveTenantId] = useState('personal');
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [statusEnabled, setStatusEnabled] = useState(true);
  const [statusDisabled, setStatusDisabled] = useState(false);

  

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      {/* 顶部: 顶栏 (Navbar) */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center space-x-6">
            {/* 快速访问 */}
            <div className="group relative">
              <button className="flex items-center justify-center p-1.5 text-slate-500 hover:text-[#1890ff] hover:bg-blue-50 rounded transition-colors focus:outline-none">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <div className="absolute left-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-48 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 overflow-hidden relative">
                  <div className="absolute -top-1 left-3 w-2 h-2 bg-white border-t border-l border-slate-100 rotate-45"></div>
                  <a 
                    href="https://lct-lht.nlecloud.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1890ff] transition-colors"
                  >
                    陆产通
                  </a>
                  <a 
                    href="https://aiot.nlecloud.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1890ff] transition-colors"
                  >
                    UUSIMA
                  </a>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
              <div className="w-7 h-7 flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br from-blue-500 to-indigo-600 rounded" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
                N
              </div>
              <span className="text-lg font-bold text-slate-800 tracking-tight">Newland EDU</span>
            </div>
            <div className="w-px h-5 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-800 tracking-tight">系统管理</span>
            </div>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsTenantOpen(true)} 
            className="flex items-center text-sm mr-4 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span className="font-medium text-slate-700">{activeTenant.name}</span>
            <ArrowLeftRight className="w-3.5 h-3.5 ml-2 text-slate-400" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center text-sm font-medium text-slate-600 cursor-pointer focus:outline-none"
            >
              林敏学 <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-1.5 z-50 overflow-hidden transform origin-top-right">
                <button 
                  onClick={() => onNavigate && onNavigate('personal')}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  个人中心
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button 
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors bg-blue-50/50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  系统管理
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button
                  onClick={() => onNavigate && onNavigate("platform-operation")}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  平台运营
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button 
                  onClick={() => onNavigate && onNavigate('login')}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col py-4 shrink-0">
          <nav className="flex-1 space-y-4">
             <div>
               <div className="px-8 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">账户管理</div>
               <div className="mt-1 space-y-1">
                 <button 
                  onClick={() => setActiveMenu('class')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'class' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <Users className={`w-4 h-4 mr-3 ${activeMenu === 'class' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 组织管理
                 </button>
                 <button 
                  onClick={() => setActiveMenu('users')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'users' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <UserCircle className={`w-4 h-4 mr-3 ${activeMenu === 'users' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 用户管理
                 </button>
                 <button 
                  onClick={() => setActiveMenu('invite')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'invite' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <BadgeCheck className={`w-4 h-4 mr-3 ${activeMenu === 'invite' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 邀请管理
                 </button>
               </div>
             </div>
             
             <div>
               <div className="px-8 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">资源管理</div>
               <div className="mt-1 space-y-1">
                 <button 
                  onClick={() => setActiveMenu('home_page_mgmt')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'home_page_mgmt' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <BookOpen className={`w-4 h-4 mr-3 ${activeMenu === 'home_page_mgmt' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 资源总览
                 </button>
                 <button 
                  onClick={() => setActiveMenu('orders')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'orders' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <FileText className={`w-4 h-4 mr-3 ${activeMenu === 'orders' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 订购订单
                 </button>
               </div>
             </div>
          </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col">
        {activeMenu === 'invite' ? (
           <div className="bg-white rounded-lg h-full overflow-hidden shadow-sm border border-slate-200 flex flex-col">
             <div className="flex-1 overflow-hidden">
               <Invite isSubpage />
             </div>
           </div>
        ) : activeMenu === 'invite_record' ? (
           <div className="bg-white rounded-lg h-full overflow-hidden shadow-sm border border-slate-200">
             <InviteRecords isSubpage />
           </div>
        ) : activeMenu === 'class' ? (
           <ClassManagement />
        ) : activeMenu === 'users' ? (
           <UsersManagement />
        ) : activeMenu === 'orders' ? (
           <div className="bg-white rounded-lg h-full overflow-hidden shadow-sm border border-slate-200">
             <OrdersManagement hideTenantSearch={true} isSystemManagement={true} />
           </div>
        ) : activeMenu === 'home_page_mgmt' ? (
           <SystemHome />
        ) : (
           <div className="bg-white flex-1 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center flex-col">
              <div className="text-slate-400 mb-2 mt-4 text-sm">此模块正在开发中...</div>
           </div>
        )}
      </div>
      </div>
      
      {/* 切换组织弹窗 (Modal) */}
        <AnimatePresence>
          {isTenantOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsTenantOpen(false)}
                className="fixed inset-0 bg-black/50 z-[100]"
              />
              <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                      <ArrowLeftRight className="w-5 h-5 text-blue-600 mr-2" />
                      切换组织
                    </h2>
                    <button 
                      onClick={() => setIsTenantOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    {tenants.map(tenant => {
                      const isActive = tenant.id === activeTenantId;
                      const isPending = tenant.status === 'pending';
                      return (
                        <button 
                          key={tenant.id}
                          onClick={() => {
                            if (!isPending) {
                              setActiveTenantId(tenant.id);
                              setIsTenantOpen(false);
                            }
                          }}
                          disabled={isPending}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-blue-50 text-blue-700' 
                              : isPending 
                                ? 'text-slate-400 cursor-not-allowed opacity-70' 
                                : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center">
                            {tenant.name}
                            {tenant.role && <span className={`${isActive ? 'text-blue-500/70' : isPending ? 'text-slate-300' : 'text-slate-400'} ml-1.5`}>({tenant.role})</span>}
                          </span>
                          {isActive && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                          {isPending && <span className="text-xs font-medium px-2 py-0.5 bg-orange-50 text-orange-500 rounded border border-orange-100">审核中</span>}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
    </div>
  );
}
