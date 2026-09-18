import React from 'react';
import { Building2, UserPlus, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { motion } from 'motion/react';

interface InviteLandingProps {
  onNavigate: (view: 'login' | 'registration') => void;
}

export default function InviteLanding({ onNavigate }: InviteLandingProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Building2 className="w-8 h-8" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">邀请加入组织</h1>
            <p className="text-slate-500 text-sm">
              您收到了一封组织邀请函，请登录或注册后加入。
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-left space-y-3">
             <div className="flex items-center text-sm">
               <span className="text-slate-500 w-20">邀请组织：</span>
               <span className="font-semibold text-slate-800">新大陆时代科技</span>
             </div>
          </div>
          
          <div className="flex items-start bg-blue-50/50 p-3 rounded-lg text-left">
            <ShieldCheck className="w-5 h-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              加入组织后，系统可能会进行审核。在审核通过前，您将暂时获得<span className="font-semibold text-slate-800">游客权限</span>进行访问，待管理员审核通过后将正式生效您的角色权限。
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              onClick={() => onNavigate('login')}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              已有账号，直接登录
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button 
              onClick={() => onNavigate('registration')}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              没有账号？去注册
            </button>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
           此邀请链接有效期至 2026-12-31，请尽快处理。
        </div>
      </motion.div>
    </div>
  );
}
