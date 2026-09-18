import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, ShieldCheck, UserCheck, ChevronRight, ChevronDown, Phone } from 'lucide-react';

export default function JoinOrg({ isModal, onClose }: { isModal?: boolean; onClose?: () => void } = {}) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  // Mock data for the organization being joined
  const orgData = {
    name: '示范大学系统',
    department: '计算机科学与技术系 / 软件工程专业',
    requireAudit: true, // 是否需要审核
  };

  return (
    <div className={`${isModal ? '' : 'min-h-full py-24 bg-slate-50'} w-full flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Background decorations */}
      {!isModal && <div className="absolute top-0 left-0 w-full h-64 bg-blue-600/5 rounded-b-[100px] blur-3xl -z-10"></div>}
      
      <motion.div 
        initial={isModal ? false : { opacity: 0, y: 20 }}
        animate={isModal ? false : { opacity: 1, y: 0 }}
        className={`w-full max-w-md bg-white overflow-hidden relative ${isModal ? '' : 'rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100'}`}
      >
        <div className="bg-blue-600 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-4 shadow-inner ring-1 ring-white/30">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">加入组织</h2>
            <p className="text-blue-100 text-sm mt-2 opacity-90">您正在受邀加入以下组织</p>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:border-blue-100 hover:bg-blue-50/50">
                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                      <Building2 className="w-3.5 h-3.5 mr-1" />
                      机构名称
                    </div>
                    <div className="font-semibold text-slate-800 text-lg">{orgData.name}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:border-blue-100 hover:bg-blue-50/50">
                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      组织机构
                    </div>
                    <div className="font-semibold text-slate-800 text-lg">{orgData.department}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:border-blue-100 hover:bg-blue-50/50">
                    <div className="w-full">
                      <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                        <UserCheck className="w-3.5 h-3.5 mr-1" />
                        姓名
                      </div>
                      <input 
                        type="text"
                        placeholder="请输入您的姓名"
                        className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white form-input text-slate-800 font-semibold transition-all mt-1"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:border-blue-100 hover:bg-blue-50/50">
                    <div className="w-full">
                      <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        手机号
                      </div>
                      <input 
                        type="tel"
                        placeholder="请输入您的手机号"
                        className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white form-input text-slate-800 font-semibold transition-all mt-1"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between transition-colors hover:border-blue-100 hover:bg-blue-50/50">
                    <div>
                      <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        审核状态
                      </div>
                      <div className="font-semibold text-slate-800">
                        {orgData.requireAudit ? '需要管理员审核' : '免审核直接加入'}
                      </div>
                    </div>
                    {orgData.requireAudit && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        需审核
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => setSubmitted(true)}
                    className="w-full relative group overflow-hidden rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="relative flex items-center justify-center">
                      确认加入
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button
                    onClick={() => onClose && onClose()}
                    className="w-full px-4 py-3.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    暂不加入
                  </button>
                </div>
              </motion.div>
            ) : (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="py-12 flex flex-col items-center text-center space-y-4"
               >
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                   <ShieldCheck className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">提交成功</h3>
                 <p className="text-slate-500 text-sm max-w-[250px]">
                   {orgData.requireAudit 
                     ? '您的申请已提交，请等待管理员审核。' 
                     : '您已成功加入该组织！'}
                 </p>
                 <button
                    onClick={() => {
                      if (onClose) {
                        onClose();
                        setSubmitted(false);
                      } else {
                        setSubmitted(false);
                      }
                    }}
                    className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-lg"
                  >
                    {isModal ? '关闭' : '返回重新演示'}
                  </button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
