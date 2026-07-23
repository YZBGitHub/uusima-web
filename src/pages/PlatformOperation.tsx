import React, { useState } from 'react';
import { Users, Building2, ShoppingCart, LogOut, UserCircle, Settings, ChevronRight, Activity, Search, Edit2, Trash2 } from 'lucide-react';
import BillingSettings from './BillingSettings';
import UsersRegistered from './UsersRegistered';
import OrdersManagement from './OrdersManagement';
import ProductsManagement from './ProductsManagement';
import OnlineTenants from './OnlineTenants';
import PrivateTenants from './PrivateTenants';


import { motion, AnimatePresence } from 'framer-motion';

export default function PlatformOperation({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
  const [activeMenu, setActiveMenu] = useState('user-registered');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm relative z-50">
        <div className="flex items-center">
            <div className="w-8 h-8 bg-[#108ee9] rounded flex items-center justify-center mr-3 shadow-inner">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="w-px h-5 bg-slate-200"></div>
            <div className="flex items-center space-x-2 ml-3">
              <span className="text-lg font-bold text-slate-800 tracking-tight">平台运营管理</span>
            </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
                Y
              </div>
              <span className="text-sm font-medium text-slate-700">yzb</span>
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 overflow-hidden">
                <button 
                  onClick={() => onNavigate && onNavigate('personal')}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  个人中心
                </button>
                <button 
                  onClick={() => onNavigate && onNavigate('config')}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  系统管理
                </button>
                <button 
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors bg-blue-50/50"
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
               <div className="px-8 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">用户管理</div>
               <div className="mt-1 space-y-1">
                 <button 
                  onClick={() => setActiveMenu('user-registered')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'user-registered' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <Users className={`w-4 h-4 mr-3 ${activeMenu === 'user-registered' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 注册用户
                 </button>
                 <button 
                  onClick={() => setActiveMenu('user-authenticated')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'user-authenticated' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <UserCircle className={`w-4 h-4 mr-3 ${activeMenu === 'user-authenticated' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 认证用户
                 </button>
               </div>
             </div>
             
             <div>
               <div className="px-8 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">租户管理</div>
               <div className="mt-1 space-y-1">
                 <button 
                  onClick={() => setActiveMenu('tenant-online')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'tenant-online' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <Building2 className={`w-4 h-4 mr-3 ${activeMenu === 'tenant-online' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 线上租户
                 </button>
                 <button 
                  onClick={() => setActiveMenu('tenant-private')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'tenant-private' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <Building2 className={`w-4 h-4 mr-3 ${activeMenu === 'tenant-private' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 私有租户
                 </button>
               </div>
             </div>

             <div>
               <div className="px-8 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">订购管理</div>
               <div className="mt-1 space-y-1">
                 <button 
                  onClick={() => setActiveMenu('order-list')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'order-list' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <ShoppingCart className={`w-4 h-4 mr-3 ${activeMenu === 'order-list' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 订单管理
                 </button>
                 <button 
                  onClick={() => setActiveMenu('order-product')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'order-product' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <ShoppingCart className={`w-4 h-4 mr-3 ${activeMenu === 'order-product' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 产品管理
                 </button>
                 <button 
                  onClick={() => setActiveMenu('order-billing')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'order-billing' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <Settings className={`w-4 h-4 mr-3 ${activeMenu === 'order-billing' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 计费设置
                 </button>
               </div>
             </div>
</nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white p-6 overflow-hidden flex flex-col">
          <div className="mb-4 text-slate-800 flex justify-between items-end">
            <h2 className="text-xl font-bold">
              {activeMenu === 'user-registered' && '注册用户'}
              {activeMenu === 'user-authenticated' && '认证用户'}
              {activeMenu === 'tenant-online' && '线上租户'}
              {activeMenu === 'tenant-private' && '私有租户管理'}
              {activeMenu === 'order-list' && '订单管理'}
              {activeMenu === 'order-product' && '产品管理'}
              {activeMenu === 'order-billing' && '计费设置'}
            </h2>
          </div>
          
          {activeMenu === 'order-list' ? (
            <OrdersManagement />
          ) : activeMenu === 'order-product' ? (
            <ProductsManagement />
          ) : activeMenu === 'order-billing' ? (
            <BillingSettings />
          ) : activeMenu === 'tenant-online' ? (
            <OnlineTenants />
          ) : activeMenu === 'tenant-private' ? (
            <PrivateTenants />
          ) : activeMenu === 'user-registered' || activeMenu === 'user-authenticated' ? (
            <UsersRegistered />
          ) : (
            <div className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
               开发中...
            </div>
          )}
      </div>
      </div>
    </div>
  );
}
