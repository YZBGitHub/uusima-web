import React, { useState } from 'react';
import { Search, ChevronDown, Edit, Trash2, Users, Network, X, Key, Shield, CheckCircle2, Circle, Database, Layout, Coins, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PersonalTenantManagement() {
  const [keyword, setKeyword] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('trial');
  const [stackType, setStackType] = useState('time');
  const [effectTime, setEffectTime] = useState('immediate');
  const [quantity, setQuantity] = useState(1);

  const personalTenants = [
    { id: 'u001', account: 'zhangsan', name: '张三', phone: '13800138001', role: '教师', package: '标准版', org: '新大陆时代科技', dept: '产教融合运营中心', title: '讲师' },
    { id: 'u002', account: 'lisi', name: '李四', phone: '13800138002', role: '学生', package: '免费版', org: '福大', dept: '计算机学院', grade: '2024级' },
    { id: 'u003', account: 'wangwu', name: '王五', phone: '13800138003', role: '企业员工', package: '专业版', org: '某某科技有限公司', dept: '研发部', job: '后端开发' },
    { id: 'u004', account: 'guest_1', name: '游客1', phone: '13800138004', role: '游客', package: '免费版', org: '-', dept: '-' },
  ];

  const packages = [
    { id: 'trial', name: '试用套餐', type: '型号：-', validity: '有效期：12月', price: '免费', accounts: 0, tokens: 5000000, ppt: 5, color: 'from-blue-50 to-blue-200/50', border: 'border-blue-200', iconColor: 'text-blue-500', iconBg: 'bg-blue-100' },
    { id: 'small', name: '小容量套餐', type: '型号：-', validity: '有效期：2月', price: '免费', accounts: 5, tokens: 1000, ppt: 1, color: 'from-purple-50 to-purple-200/50', border: 'border-purple-200', iconColor: 'text-purple-500', iconBg: 'bg-purple-100' },
    { id: 'pkg10', name: '10账号套餐', type: '型号：-', validity: '有效期：12月', price: '免费', accounts: 10, tokens: 0, ppt: 0, color: 'from-orange-50 to-orange-200/50', border: 'border-orange-200', iconColor: 'text-orange-500', iconBg: 'bg-orange-100' },
    { id: 'biz', name: '智联网综合实践…', type: '型号:LingY-611-TJ', validity: '有效期：12月', price: '2000', pricePrefix: '¥', accounts: 1, tokens: 10000000, ppt: 0, color: 'from-amber-50 to-amber-200/50', border: 'border-amber-200', iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
    { id: 'demo', name: 'demo', type: '型号：-', validity: '有效期：2月', price: '免费', accounts: 1, tokens: 10000, ppt: 0, color: 'from-sky-50 to-sky-200/50', border: 'border-sky-200', iconColor: 'text-sky-500', iconBg: 'bg-sky-100' },
    { id: 'demo2', name: 'demo2', type: '型号：-', validity: '有效期：2月', price: '免费', accounts: 1, tokens: 10000, ppt: 0, color: 'from-fuchsia-50 to-fuchsia-200/50', border: 'border-fuchsia-200', iconColor: 'text-fuchsia-500', iconBg: 'bg-fuchsia-100' },
  ];

  return (
    <div className="min-h-full bg-white flex flex-col p-6 font-sans">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-1 h-4 bg-blue-600 rounded-sm"></div>
        <h1 className="text-base font-bold text-slate-800">个人租户角色管理</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-slate-500 bg-white min-w-[140px]">
              <option>请选择角色类型</option>
              <option>游客</option>
              <option>教师</option>
              <option>学生</option>
              <option>企业员工</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="账户/姓名/手机号"
            className="px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 min-w-[160px] text-slate-700" 
          />

          <button className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors shadow-sm">
            查询
          </button>
          
          <button className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            重置
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-600 bg-slate-50 sticky top-0 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-center">账户</th>
              <th className="px-6 py-4 font-semibold text-center">姓名</th>
              <th className="px-6 py-4 font-semibold text-center">手机号</th>
              <th className="px-6 py-4 font-semibold text-center">认证角色</th>
              <th className="px-6 py-4 font-semibold text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {personalTenants.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 text-slate-500 text-center">{user.account}</td>
                <td className="px-6 py-4 text-slate-600 text-center">{user.name}</td>
                <td className="px-6 py-4 text-slate-600 text-center">{user.phone}</td>
                <td className="px-6 py-4 text-center">
                   <span className={`px-2 py-1 rounded text-xs font-medium ${
                     user.role === '游客' ? 'bg-slate-100 text-slate-600' :
                     user.role === '教师' ? 'bg-blue-50 text-blue-600' :
                     user.role === '学生' ? 'bg-green-50 text-green-600' :
                     'bg-orange-50 text-orange-600'
                   }`}>
                     {user.role}
                   </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => {
                      setEditingUserId(user.id);
                      setDetailsModalOpen(true);
                    }}
                    className="flex items-center text-blue-500 hover:text-blue-700 font-medium text-xs"
                  >
                    详情
                  </button>
                  <button 
                    onClick={() => {
                      setEditingUserId(user.id);
                      setEditModalOpen(true);
                    }}
                    className="flex items-center text-blue-500 hover:text-blue-700 font-medium text-xs"
                  >
                    修改角色
                  </button>
                  <button 
                    onClick={() => {
                      setEditingUserId(user.id);
                      setRechargeModalOpen(true);
                    }}
                    className="flex items-center text-blue-500 hover:text-blue-700 font-medium text-xs"
                  >
                    充值
                  </button>
                  <button className="flex items-center text-blue-500 hover:text-blue-700 font-medium text-xs">
                    充值记录
                  </button>
                  <button className="flex items-center text-blue-500 hover:text-blue-700 font-medium text-xs">
                    用量查询
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end space-x-4 mt-4 text-sm text-slate-600">
        <span>共 {personalTenants.length} 条</span>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-600">
            <option>20条/页</option>
            <option>50条/页</option>
            <option>100条/页</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 修改权限/套餐 Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-[500px] flex flex-col overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                  <h2 className="text-lg font-semibold text-slate-900">修改角色</h2>
                  <button 
                    onClick={() => setEditModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">修改角色</label>
                    <div className="relative">
                      <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-700">
                        <option>游客</option>
                        <option>教师</option>
                        <option>学生</option>
                        <option>企业员工</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
                  <button 
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    确认保存
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      {/* 详情 Modal */}
      <AnimatePresence>
        {detailsModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailsModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-[500px] flex flex-col overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                  <h2 className="text-lg font-semibold text-slate-900">认证明细</h2>
                  <button 
                    onClick={() => setDetailsModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4">
                  {personalTenants.filter(u => u.id === editingUserId).map(user => (
                    <div key={user.id} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                         <div className="col-span-1 text-slate-500 font-medium text-sm">账户</div>
                         <div className="col-span-2 text-slate-800 text-sm font-medium">{user.account}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                         <div className="col-span-1 text-slate-500 font-medium text-sm">姓名</div>
                         <div className="col-span-2 text-slate-800 text-sm">{user.name}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                         <div className="col-span-1 text-slate-500 font-medium text-sm">手机号</div>
                         <div className="col-span-2 text-slate-800 text-sm">{user.phone}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                         <div className="col-span-1 text-slate-500 font-medium text-sm">认证角色</div>
                         <div className="col-span-2 text-slate-800 text-sm">{user.role}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                         <div className="col-span-1 text-slate-500 font-medium text-sm">申请组织</div>
                         <div className="col-span-2 text-slate-800 text-sm">{user.org}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pb-2">
                         <div className="col-span-1 text-slate-500 font-medium text-sm">部门/其他</div>
                         <div className="col-span-2 text-slate-800 text-sm">{user.dept} {user.title && `/ ${user.title}`} {user.job && `/ ${user.job}`} {user.grade && `/ ${user.grade}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                  <button 
                    onClick={() => setDetailsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 充值 Modal */}
      <AnimatePresence>
        {rechargeModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRechargeModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden pointer-events-auto h-[90vh]"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center shrink-0">
                  <div className="w-1 h-4 bg-blue-600 rounded-sm mr-2"></div>
                  <h2 className="text-lg font-bold text-slate-800">添加订购信息</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                  <div className="space-y-8">
                    {/* Step 1 */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold mr-3">1</div>
                        <span className="text-sm font-medium text-slate-700">选择院校:</span>
                        <div className="ml-4 text-sm font-semibold text-slate-800">
                          {personalTenants.find(u => u.id === editingUserId)?.org || '-'}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 ml-9">
                        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
                          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-inner">
                            <Coins className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="text-xs text-slate-500 mb-1">Token数</div>
                             <div className="text-lg font-semibold text-slate-800">--</div>
                          </div>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-inner">
                            <Layout className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="text-xs text-slate-500 mb-1">PPT调用次数</div>
                             <div className="text-lg font-semibold text-slate-800">--</div>
                          </div>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
                          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-inner">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="text-xs text-slate-500 mb-1">账号数</div>
                             <div className="text-lg font-semibold text-slate-800">--</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold mr-3">2</div>
                        <span className="text-sm font-medium text-slate-700">充值方式:</span>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-4 ml-9 relative">
                        {packages.map((pkg) => (
                          <div 
                            key={pkg.id} 
                            onClick={() => setSelectedPackage(pkg.id)}
                            className={`relative rounded-2xl flex flex-col cursor-pointer transition-all duration-200 overflow-hidden border-2 ${selectedPackage === pkg.id ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' : `border-transparent hover:border-slate-200`}`}
                          >
                             <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-80 pointer-events-none`}></div>
                             
                             {selectedPackage === pkg.id && (
                               <div className="absolute top-3 right-3 text-blue-600 bg-white rounded-full">
                                 <CheckCircle2 className="w-5 h-5" />
                               </div>
                             )}

                             <div className="relative p-5 flex flex-col h-full z-10">
                               <div className="flex items-start mb-6">
                                  <div className={`w-10 h-10 rounded-xl ${pkg.iconBg} flex items-center justify-center mr-3 shadow-sm`}>
                                    <Database className={`w-5 h-5 ${pkg.iconColor}`} />
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-800 text-[15px] mb-0.5">{pkg.name}</div>
                                    <div className="text-[10px] text-slate-500">{pkg.type}</div>
                                    <div className="text-[10px] text-slate-500">{pkg.validity}</div>
                                  </div>
                               </div>

                               <div className="flex justify-between items-end mb-6">
                                 <span className="text-xs text-slate-500">收费标准：</span>
                                 <div className="text-blue-600 font-bold">
                                   {pkg.pricePrefix && <span className="text-xs mr-0.5">{pkg.pricePrefix}</span>}
                                   <span className="text-2xl">{pkg.price}</span>
                                 </div>
                               </div>

                               <div className="space-y-3 mt-auto">
                                 <div className="flex justify-between items-center text-xs">
                                   <div className="flex items-center text-slate-600 font-medium">
                                     <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                                     账号数：
                                   </div>
                                   <span className="text-blue-600 font-bold text-sm">{pkg.accounts}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                   <div className="flex items-center text-slate-600 font-medium">
                                     <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                                     Token数：
                                   </div>
                                   <span className="text-blue-600 font-bold text-sm">{pkg.tokens}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                   <div className="flex items-center text-slate-600 font-medium">
                                     <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                                     AI-PPT：
                                   </div>
                                   <span className="text-blue-600 font-bold text-sm">{pkg.ppt}</span>
                                 </div>
                               </div>
                             </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="ml-9 mt-6">
                        <div className="relative">
                           <div className="h-1.5 bg-slate-200 rounded-full w-full"></div>
                           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-3 bg-slate-400 rounded-full shadow cursor-pointer"></div>
                        </div>
                      </div>
                      
                      <div className="ml-9 mt-6 text-sm text-slate-700 font-medium flex items-center">
                         <span>当前选择套餐：</span>
                         <span className="ml-6">型号：</span>
                      </div>
                    </div>

                    <div className="ml-9 border-t border-slate-200 pt-8 mt-8 space-y-6">
                       <div className="flex items-center space-x-12">
                          <div className="flex items-center space-x-4">
                             <span className="text-sm font-medium text-slate-700">多套餐叠加方式:</span>
                             <label className="flex items-center space-x-2 cursor-pointer text-sm text-blue-600">
                               <input type="radio" name="stack" checked={stackType === 'time'} onChange={() => setStackType('time')} className="hidden" />
                               {stackType === 'time' ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <Circle className="w-4 h-4 text-slate-300" />}
                               <span>有效期叠加</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer text-sm text-slate-600 hover:text-slate-800">
                               <input type="radio" name="stack" checked={stackType === 'resource'} onChange={() => setStackType('resource')} className="hidden" />
                               {stackType === 'resource' ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <Circle className="w-4 h-4 text-slate-300" />}
                               <span>用量资源叠加</span>
                             </label>
                          </div>
                          <div className="flex items-center space-x-4">
                             <span className="text-sm font-medium text-slate-700">套餐生效时间:</span>
                             <label className="flex items-center space-x-2 cursor-pointer text-sm text-blue-600">
                               <input type="radio" name="effect" checked={effectTime === 'immediate'} onChange={() => setEffectTime('immediate')} className="hidden" />
                               {effectTime === 'immediate' ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <Circle className="w-4 h-4 text-slate-300" />}
                               <span>即时生效</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer text-sm text-slate-600 hover:text-slate-800">
                               <input type="radio" name="effect" checked={effectTime === 'start'} onChange={() => setEffectTime('start')} className="hidden" />
                               {effectTime === 'start' ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <Circle className="w-4 h-4 text-slate-300" />}
                               <span>生效开始时间</span>
                             </label>
                          </div>
                       </div>
                       
                       <div className="flex items-center space-x-8">
                         <div className="flex items-center">
                           <span className="text-sm font-medium text-slate-700 mr-4">套餐数量:</span>
                           <div className="flex items-center border border-slate-200 rounded bg-white">
                             <button 
                               onClick={() => setQuantity(Math.max(1, quantity - 1))}
                               className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
                               disabled={quantity <= 1}
                             >
                               -
                             </button>
                             <div className="w-12 text-center text-sm border-x border-slate-200 py-1.5">{quantity}</div>
                             <button 
                               onClick={() => setQuantity(quantity + 1)}
                               className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 transition-colors"
                             >
                               +
                             </button>
                           </div>
                         </div>
                         <div className="flex items-center relative">
                           <span className="text-sm font-medium text-slate-700 mr-4">开通模块:</span>
                           <div className="relative w-48">
                             <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-400">
                               <option>请选择</option>
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-center space-x-4 shrink-0">
                  <button 
                    onClick={() => setRechargeModalOpen(false)}
                    className="px-8 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => setRechargeModalOpen(false)}
                    className="px-8 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    保存
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
