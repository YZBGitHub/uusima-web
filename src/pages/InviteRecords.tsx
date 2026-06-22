import React, { useState } from 'react';
import { RefreshCcw, Link as LinkIcon, Building2, UserCircle, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JoinOrg from './JoinOrg';

export default function InviteRecords({ isSubpage }: { isSubpage?: boolean } = {}) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rejoinModalOpen, setRejoinModalOpen] = useState(false);

  const records = [
    {
      id: 'r1',
      org: '软件学院',
      role: '学生',
      inviter: '王建国 (导员)',
      link: 'https://invite.example.com/org/123',
      status: 'pending',
      date: '2024-05-18 10:30'
    },
    {
      id: 'r2',
      org: '计算机科学系',
      role: '教师',
      inviter: '系统分配',
      link: 'https://invite.example.com/org/456',
      status: 'approved',
      date: '2024-05-15 14:20'
    },
    {
      id: 'r3',
      org: '社团联合会',
      role: '成员',
      inviter: '张伟 (会长)',
      link: 'https://invite.example.com/org/789',
      status: 'rejected',
      date: '2024-05-10 09:15',
      rejectReason: '提交的学号信息有误，请重新填写'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: '待审核', color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertCircle };
      case 'approved': return { label: '已通过', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 };
      case 'rejected': return { label: '已驳回', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
      default: return { label: '未知', color: 'text-slate-600', bg: 'bg-slate-50', icon: AlertCircle };
    }
  };

  const filteredRecords = filterStatus === 'all' ? records : records.filter(r => r.status === filterStatus);

  return (
    <div className={isSubpage ? "h-full bg-white p-6" : "min-h-screen bg-slate-50/50 p-6 md:p-10"}>
      <div className={isSubpage ? "w-full" : "max-w-5xl mx-auto"}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">组织邀请记录</h1>
          <p className="text-slate-500 mt-2 text-sm">查看和管理我收到的组织加入邀请记录</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex space-x-1">
              {[
                { id: 'all', label: '全部记录' },
                { id: 'pending', label: '待审核' },
                { id: 'approved', label: '已通过' },
                { id: 'rejected', label: '已驳回' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === tab.id 
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60' 
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-200/50">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const StatusIcon = getStatusConfig(record.status).icon;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={record.id}
                      className="p-6 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${getStatusConfig(record.status).bg} ${getStatusConfig(record.status).color}`}>
                              <StatusIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                                  <Building2 className="w-4 h-4 text-slate-400" />
                                  {record.org}
                                </h3>
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusConfig(record.status).bg} ${getStatusConfig(record.status).color}`}>
                                  {getStatusConfig(record.status).label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <UserCircle className="w-4 h-4 text-slate-400" />
                                  角色: {record.role}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  {record.date}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pl-14">
                            <div className="flex items-center gap-2 text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 inline-flex max-w-full">
                              <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-slate-500 truncate" title={record.link}>{record.link}</span>
                              <button className="text-blue-600 hover:text-blue-800 ml-2 font-medium shrink-0">复制</button>
                            </div>
                            
                            {record.status === 'rejected' && record.rejectReason && (
                              <div className="mt-3 text-sm text-red-600 bg-red-50/50 px-4 py-2.5 rounded-lg border border-red-100 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-medium mr-1">驳回原因:</span>
                                  {record.rejectReason}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {record.status === 'rejected' && (
                          <div className="md:pl-6 md:border-l border-slate-100 flex items-center shrink-0">
                            <button 
                              onClick={() => setRejoinModalOpen(true)}
                              className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                            >
                              重新加入
                            </button>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-12 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">暂无{filterStatus !== 'all' ? getStatusConfig(filterStatus).label : ''}相关记录</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {rejoinModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejoinModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative"
              >
                <JoinOrg isModal onClose={() => setRejoinModalOpen(false)} />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
