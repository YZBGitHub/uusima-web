import React, { useState } from 'react';
import { X, FileSpreadsheet, ChevronDown, Copy, QrCode, Link, Send, Search, HelpCircle, UserCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Invite({ isSubpage }: { isSubpage?: boolean } = {}) {
  const [modalOpen, setModalOpen] = useState(false);
  
  const [modalRole, setModalRole] = useState('学生');

  const [modalUserSelectOrg, setModalUserSelectOrg] = useState(false);

  const [modalNeedAudit, setModalNeedAudit] = useState(false);

  const [linkGenerated, setLinkGenerated] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [currentApproveRecord, setCurrentApproveRecord] = useState<any>(null);
  const [approveRoles, setApproveRoles] = useState<string[]>([]);
  const [approveRoleDropdownOpen, setApproveRoleDropdownOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentRejectRecord, setCurrentRejectRecord] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const rejectTags = ['信息不完整', '非本机构人员'];

  // 专属链接管理 MOCK
  const linkRecords = [
    { id: 1, time: '2024-05-13 09:00', org: '软件学院', expire: '2024-05-20 23:59', invitedCount: 50, joinedCount: 12, pendingAuditCount: 3, status: '生效中', statusColor: 'text-green-600', badgeColor: 'bg-green-50' },
    { id: 2, time: '2024-05-01 10:00', org: '计算机系', expire: '永久有效', invitedCount: 68, joinedCount: 5, pendingAuditCount: 0, status: '已作废', statusColor: 'text-slate-500', badgeColor: 'bg-slate-100' },
    { id: 3, time: '2024-04-01 14:00', org: '网络中心', expire: '2024-04-08 23:59', invitedCount: 68, joinedCount: 1, pendingAuditCount: 0, status: '已过期', statusColor: 'text-red-500', badgeColor: 'bg-red-50' },
  ];

  // 待审核列表 MOCK
  const auditRecords = [
    { id: 'a1', name: '李明', phone: '13812345678', org: '软件学院', role: '学生', identifier: '2024001', submittedAt: '2024-05-13 10:20' },
    { id: 'a2', name: '王强', phone: '13912345678', org: '软件学院', role: '学生', identifier: '2024002', submittedAt: '2024-05-13 11:45' },
    { id: 'a3', name: '张伟', phone: '13712345678', org: '软件学院', role: '学生', identifier: '2024003', submittedAt: '2024-05-13 14:10' },
  ];

  const RoleSelect = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
    <div className="flex gap-3">
      {['教师', '学生'].map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${
            value === r 
              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );


  const DeptTreeSelect = () => (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <select className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white appearance-none shadow-sm transition-all text-slate-700">
        <option value="d1">西平县职业教育中心</option>
        <option value="d2">&nbsp;&nbsp;物联网1班</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );

  return (
    <div className={isSubpage ? "h-full w-full overflow-y-auto bg-white p-6" : "p-8 pb-20"}>
      <div className={isSubpage ? "w-full" : "max-w-6xl mx-auto"}>
        
        {/* 顶部操作区 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">组织邀请管理</h1>
            <p className="text-slate-500 mt-1 text-sm">通过定向发送邀请或生成邀请链接快捷邀请成员</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => { setModalOpen(true); setLinkGenerated(false); }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
            >
              <Link className="w-4 h-4" />
              <span>生成邀请链接</span>
            </button>
          </div>
        </div>

        {/* 邀请记录列表 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-100 bg-slate-50/20">创建时间</th>
                      <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-100 bg-slate-50/20">组织机构</th>
                      <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-100 bg-slate-50/20">有效截止日期</th>
                      <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-100 bg-slate-50/20">邀请人数</th>
                      <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-100 bg-slate-50/20">已加入人数</th>
                      <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-100 bg-slate-50/20">待审核人数</th>
                      <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-100 bg-slate-50/20">状态</th>
                      <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-100 bg-slate-50/20 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {linkRecords.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-800">{record.time}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{record.org}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{record.expire}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{record.invitedCount}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{record.joinedCount}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{record.pendingAuditCount}</td>
                        <td className="px-6 py-4 text-sm">
                           <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${record.badgeColor} ${record.statusColor}`}>
                             {record.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right space-x-3">
                          {record.status === '生效中' && (
                            <>
                              <button className="text-red-500 hover:text-red-700 font-medium transition-colors">提前作废</button>
                              <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">复制</button>
                              <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">下载二维码</button>
                            </>
                          )}
                          {record.pendingAuditCount > 0 && (
                            <button 
                              onClick={() => setAuditModalOpen(true)}
                              className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                            >
                              审核
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>
        </div>

      </div>

      {/* 交互弹窗：生成邀请链接 (Center Modal) */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] overflow-hidden flex flex-col border border-slate-100"
              >
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-xl font-bold text-slate-900">创建专属邀请链接</h2>
                  <button 
                    onClick={() => setModalOpen(false)}
                    className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  {/* 步骤一：配置身份属性 */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                       <div className="col-span-2">
                         <label className="block text-sm font-medium text-slate-700 mb-2">组织机构</label>
                         <DeptTreeSelect />
                       </div>
                    </div>
                  </div>

                  {/* 步骤二：设置链接规则 */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">有效截止日期</label>
                        <input 
                          type="datetime-local" 
                          className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm transition-all text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">人数上限（最多68人）</label>
                        <input 
                          type="number" 
                          placeholder="不填则默认最多人数"
                          className="w-full text-sm border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3 bg-white placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 结果状态展示 */}
                  {linkGenerated ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
                         <div className="text-sm font-medium text-blue-800">邀请链接已生成，请复制并发送给受邀人员</div>
                         <div className="flex items-center space-x-3">
                            <input 
                              readOnly
                              value="https://edu.example.com/invite/tX9qA"
                              className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-500 overflow-hidden outline-none cursor-default"
                            />
                            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center shrink-0">
                               <Copy className="w-4 h-4 mr-2" />
                               复制链接
                            </button>
                            <button className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 bg-white border border-slate-200 hover:border-blue-300 rounded-lg transition-colors group relative cursor-pointer shrink-0">
                               <QrCode className="w-5 h-5" />
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-lg">
                                 展示二维码
                               </div>
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                       <button 
                         onClick={() => setLinkGenerated(true)}
                         className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                       >
                         生成并查看链接
                       </button>
                    </div>
                  )}

                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 待审核列表弹窗 */}
      <AnimatePresence>
        {auditModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuditModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-[800px] overflow-hidden flex flex-col border border-slate-100 max-h-[80vh]"
              >
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                  <h2 className="text-xl font-bold text-slate-900">待审核列表</h2>
                  <button 
                    onClick={() => setAuditModalOpen(false)}
                    className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="overflow-y-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-200">加入机构</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-200">姓名</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-200">手机号</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-200">申请时间</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-sm border-b border-slate-200 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditRecords.map(record => (
                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 text-sm text-slate-600">{record.org}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">{record.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{record.phone}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{record.submittedAt}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setCurrentRejectRecord(record);
                                setRejectReason('');
                                setRejectModalOpen(true);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded font-medium transition-colors text-sm"
                            >
                              驳回
                            </button>
                            <button 
                              onClick={() => {
                                setCurrentApproveRecord(record);
                                setApproveRoles([record.role]);
                                setApproveModalOpen(true);
                              }}
                              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded font-medium transition-colors text-sm shadow-sm"
                            >
                              通过
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {auditRecords.length === 0 && (
                     <div className="py-20 text-center text-slate-500 text-sm flex flex-col items-center">
                        <UserCheck className="w-12 h-12 text-slate-200 mb-3" />
                        暂无待审核申请
                     </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 审核通过弹窗 */}
      <AnimatePresence>
        {approveModalOpen && currentApproveRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApproveModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
            />
            <div className="fixed inset-0 z-[111] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden flex flex-col border border-slate-100"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                  <h2 className="text-lg font-bold text-slate-900">入职审核通过</h2>
                  <button 
                    onClick={() => setApproveModalOpen(false)}
                    className="p-1.5 -mr-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">所在机构</label>
                    <DeptTreeSelect />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">分配角色 <span className="text-slate-400 font-normal ml-1">可多选</span></label>
                    <div className="relative">
                      <div 
                        onClick={() => setApproveRoleDropdownOpen(!approveRoleDropdownOpen)}
                        className="w-full flex items-center justify-between border border-slate-300 rounded-lg px-3 py-2.5 bg-white cursor-pointer shadow-sm hover:border-blue-400 text-sm"
                      >
                        {approveRoles.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {approveRoles.map(r => (
                              <span key={r} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                {r}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">请选择角色</span>
                        )}
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${approveRoleDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                      
                      <AnimatePresence>
                        {approveRoleDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                          >
                            {['学生', '教师', '管理员', '辅导员'].map(r => (
                              <div
                                key={r}
                                onClick={() => {
                                  if (approveRoles.includes(r)) {
                                    setApproveRoles(approveRoles.filter(role => role !== r));
                                  } else {
                                    setApproveRoles([...approveRoles, r]);
                                  }
                                }}
                                className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition-colors"
                              >
                                <span>{r}</span>
                                {approveRoles.includes(r) && <Check className="w-4 h-4 text-blue-600" />}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button 
                    onClick={() => setApproveModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      setApproveModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={approveRoles.length === 0}
                  >
                    确定通过
                  </button>
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden relative"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800">填写驳回原因</h3>
                  <button 
                    onClick={() => setRejectModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      驳回原因 <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-slate-400">
                      {rejectReason.length} / 200 (需50-200字)
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {rejectTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          if (rejectReason) {
                            setRejectReason(prev => prev + '，' + tag);
                          } else {
                            setRejectReason(tag);
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded hover:bg-slate-100 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请输入驳回原因..."
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    maxLength={200}
                  />
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button 
                    onClick={() => setRejectModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors bg-white shadow-sm"
                  >
                     取消
                  </button>
                  <button 
                    onClick={() => {
                      setRejectModalOpen(false);
                    }}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                  >
                    确认驳回
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
