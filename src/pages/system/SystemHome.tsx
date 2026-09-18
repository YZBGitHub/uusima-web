import React, { useState } from 'react';
import { GraduationCap, Wallet, CreditCard, Gift, Users, Activity, Clock, FileText, Search, RefreshCw, Coins, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

export default function SystemHome() {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showUsageDetailsModal, setShowUsageDetailsModal] = useState(false);
  const [selectedUsageItem, setSelectedUsageItem] = useState<any>(null);
  const [limits, setLimits] = useState([
    { id: 'token', name: 'Token', remaining: 8153956, used: 6846044, isLimited: true, maxLimit: 5000000 },
    { id: 'duration', name: '实验时长', remaining: 4500, used: 1500, isLimited: true, maxLimit: 6000 },
    { id: 'ai-ppt', name: 'AI-PPT', remaining: 4, used: 1, isLimited: true, maxLimit: 5 },
  ]);

  const handleLimitChange = (id: string, value: number) => {
    setLimits(limits.map(l => l.id === id ? { ...l, maxLimit: value } : l));
  };

  const handleToggle = (id: string) => {
    setLimits(limits.map(l => l.id === id ? { ...l, isLimited: !l.isLimited } : l));
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm border border-slate-200 p-6 overflow-auto">
      <div className="flex items-center text-slate-800 mb-8">
        <GraduationCap className="w-8 h-8 text-blue-500 mr-3" />
        <h1 className="text-xl font-bold">新大陆教育行业云</h1>
      </div>

      <div className="flex mb-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 w-full">
          {/* 账号数量 */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative h-[180px]">
            <div className="p-6 flex items-center h-full">
              <div className="flex-1">
                <div className="flex flex-row items-center space-x-2 pb-2">
                  <h3 className="tracking-tight text-sm font-medium text-slate-500">
                    账号数量
                  </h3>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex items-baseline space-x-2 mt-2">
                  <div className="text-3xl font-bold text-slate-800">
                    120
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    个 剩余
                  </span>
                </div>
                <div className="text-xs mt-4 space-y-1">
                  <div className="text-slate-500">
                    总计: 200 个
                  </div>
                  <div className="text-slate-500 flex items-center gap-1">
                    已使用:{" "}
                    <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                    80 个
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "剩余", value: 120 },
                        { name: "已使用", value: 80 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell key="cell-0" fill="#3b82f6" />
                      <Cell key="cell-1" fill="#cbd5e1" />
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) =>
                        value.toLocaleString() + " 个"
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                  <span className="text-xs text-blue-600 font-bold">
                    40%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Token (词元) 数量 */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative h-[180px]">
            <div className="p-6 flex items-center h-full">
              <div className="flex-1">
                <div className="flex flex-row items-center space-x-2 pb-2">
                  <h3 className="tracking-tight text-sm font-medium text-slate-500">
                    Token (词元) 数量
                  </h3>
                  <Activity className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex items-baseline space-x-2 mt-2">
                  <div className="text-3xl font-bold text-slate-800">
                    8,153,956
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    剩余
                  </span>
                </div>
                <div className="text-xs mt-4 space-y-1">
                  <div className="text-slate-500">
                    总计: 15,000,000
                  </div>
                  <div className="text-slate-500 flex items-center gap-1">
                    已使用:{" "}
                    <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                    6,846,044
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "剩余", value: 8153956 },
                        { name: "已使用", value: 6846044 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell key="cell-0" fill="#3b82f6" />
                      <Cell key="cell-1" fill="#cbd5e1" />
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) =>
                        value.toLocaleString()
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                  <span className="text-xs text-blue-600 font-bold">
                    54%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 实验时长 */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative h-[180px]">
            <div className="p-6 flex items-center h-full">
              <div className="flex-1">
                <div className="flex flex-row items-center space-x-2 pb-2">
                  <h3 className="tracking-tight text-sm font-medium text-slate-500">
                    实验时长
                  </h3>
                  <Clock className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline space-x-2 mt-2">
                  <div className="text-3xl font-bold text-slate-800">
                    4,500
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    分钟 剩余
                  </span>
                </div>
                <div className="text-xs mt-4 space-y-1">
                  <div className="text-slate-500">总计: 6,000 分钟</div>
                  <div className="text-slate-500 flex items-center gap-1">
                    已使用:{" "}
                    <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                    1,500 分钟
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "剩余", value: 4500 },
                        { name: "已使用", value: 1500 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell key="cell-0" fill="#10b981" />
                      <Cell key="cell-1" fill="#cbd5e1" />
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => value + " 分钟"}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                  <span className="text-xs text-emerald-600 font-bold">
                    75%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PPT 生成次数 */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative h-[180px]">
            <div className="p-6 flex items-center h-full">
              <div className="flex-1">
                <div className="flex flex-row items-center space-x-2 pb-2">
                  <h3 className="tracking-tight text-sm font-medium text-slate-500">
                    PPT 生成次数
                  </h3>
                  <FileText className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex items-baseline space-x-2 mt-2">
                  <div className="text-3xl font-bold text-slate-800">
                    4
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    次 剩余
                  </span>
                </div>
                <div className="text-xs mt-4 space-y-1">
                  <div className="text-slate-500">总计: 5 次</div>
                  <div className="text-slate-500 flex items-center gap-1">
                    已使用:{" "}
                    <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                    1 次
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "剩余", value: 4 },
                        { name: "已使用", value: 1 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell key="cell-0" fill="#a855f7" />
                      <Cell key="cell-1" fill="#cbd5e1" />
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => value + " 次"}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                  <span className="text-xs text-purple-600 font-bold">
                    80%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 text-slate-800">
        <h2 className="text-base font-bold">套餐用量</h2>
      </div>

      <div className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-t border-slate-100 border-r-0 border-l-0">
            <tr>
              <th className="px-6 py-4 font-normal text-slate-400 text-center w-1/6">项目</th>
              <th className="px-6 py-4 font-normal text-slate-400 text-center w-1/6">剩余</th>
              <th className="px-6 py-4 font-normal text-slate-400 text-center w-1/6">已用</th>
              <th className="px-6 py-4 font-normal text-slate-400 text-center w-1/4">限额开关</th>
              <th className="px-6 py-4 font-normal text-slate-400 text-center w-1/6">最高限额(按账号)</th>
              <th className="px-6 py-4 font-normal text-slate-400 text-center w-1/6">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {limits.map((item) => {
              const total = item.remaining + item.used;
              const percent = total > 0 ? ((item.remaining / total) * 100).toFixed(1) : '0';
              return (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 text-center text-slate-600">{item.name}</td>
                <td className="px-6 py-5 text-center text-slate-600">
                  <div className="font-medium text-slate-800">{item.remaining}</div>
                  <div className="text-xs text-slate-400 mt-1">剩余 {percent}%</div>
                </td>
                <td className="px-6 py-5 text-center text-slate-600">{item.used}</td>
                <td className="px-6 py-5">
                  {item.id === 'duration' ? (
                    <div className="text-center text-slate-400">-</div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <span className={`text-sm ${item.isLimited ? 'text-[#108ee9] font-medium' : 'text-slate-400'}`}>有限制</span>
                      <button 
                        onClick={() => handleToggle(item.id)}
                        className={`w-11 h-[22px] rounded-full flex items-center p-[2px] transition-colors ${item.isLimited ? 'bg-[#108ee9]' : 'bg-slate-300'}`}
                      >
                        <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transform transition-transform ${item.isLimited ? 'translate-x-[22px]' : 'translate-x-0'}`} />
                      </button>
                      <span className={`text-sm ${!item.isLimited ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>无限制</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-5">
                  {item.id === 'duration' ? (
                    <div className="text-center text-slate-400">-</div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-slate-200 rounded overflow-hidden shadow-sm bg-white">
                        <button 
                          onClick={() => handleLimitChange(item.id, Math.max(0, item.maxLimit - 1))}
                          className={`px-3 py-1.5 bg-slate-50 border-r border-slate-200 transition-colors ${!item.isLimited ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-100'}`}
                          disabled={!item.isLimited}
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          value={item.maxLimit}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            handleLimitChange(item.id, isNaN(val) ? 0 : val);
                          }}
                          className={`w-28 text-center py-1.5 focus:outline-none text-sm disabled:cursor-not-allowed disabled:bg-slate-50 ${!item.isLimited ? 'text-slate-400' : 'text-slate-700'}`}
                          disabled={!item.isLimited}
                        />
                        <button 
                          onClick={() => handleLimitChange(item.id, item.maxLimit + 1)}
                          className={`px-3 py-1.5 bg-slate-50 border-l border-slate-200 transition-colors ${!item.isLimited ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-100'}`}
                          disabled={!item.isLimited}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    {item.id !== 'duration' && <button onClick={() => { setSelectedUsageItem(item); setShowLimitModal(true); }} className="text-[#108ee9] hover:text-blue-700 transition-colors text-[13px] font-medium">限额设置</button>}
                    <button onClick={() => { setSelectedUsageItem(item); setShowUsageDetailsModal(true); }} className="text-[#108ee9] hover:text-blue-700 transition-colors text-[13px] font-medium">用量详情</button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center text-slate-800 font-bold text-lg">
                <GraduationCap className="w-6 h-6 mr-2 text-[#108ee9]" />
                新大陆教育行业云
              </div>
              <button onClick={() => setShowLimitModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-white">
              <h2 className="text-lg font-bold text-slate-800 mb-6">限额分配（按账号） Token</h2>
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="rounded-xl p-6 relative overflow-hidden bg-gradient-to-br from-[#40a9ff] to-[#096dd9] text-white shadow-md">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mt-20 -mr-20"></div>
                  <div className="relative z-10">
                    <div className="text-sm font-medium text-white/90 mb-2">套餐总量</div>
                    <div className="text-4xl font-bold">971976159</div>
                  </div>
                  <div className="absolute bottom-4 right-4 z-10 opacity-30">
                    <Coins className="w-16 h-16" />
                  </div>
                  <div className="absolute bottom-4 right-4 z-10 text-white/90">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <Coins className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl p-6 relative overflow-hidden bg-gradient-to-br from-[#5c8aff] to-[#2b5aed] text-white shadow-md">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mt-20 -mr-20"></div>
                  <div className="relative z-10">
                    <div className="text-sm font-medium text-white/90 mb-2">已分配额度</div>
                    <div className="text-4xl font-bold">148292682</div>
                  </div>
                  <div className="absolute bottom-4 right-4 z-10 text-white/90">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <Wallet className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl p-6 relative overflow-hidden bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white shadow-md">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mt-20 -mr-20"></div>
                  <div className="relative z-10">
                    <div className="text-sm font-medium text-white/90 mb-2">未分配额度</div>
                    <div className="text-4xl font-bold">823683477</div>
                  </div>
                  <div className="absolute bottom-4 right-4 z-10 text-white/90">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <Gift className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-[#3b82f6] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors">
                    批量配置
                  </button>
                  <button className="px-4 py-2 bg-[#a5cbf8] text-white rounded text-sm font-medium cursor-not-allowed">
                    保存
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded text-sm text-slate-500 bg-white hover:border-slate-300 focus:outline-none w-40">
                      <option>请选择组织机构</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded text-sm text-slate-500 bg-white hover:border-slate-300 focus:outline-none w-32">
                      <option>请选择角色</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="请输入关键词" 
                    className="pl-3 pr-3 py-2 border border-slate-200 rounded text-sm w-48 focus:outline-none focus:border-[#3b82f6]"
                  />
                  <button className="px-4 py-2 bg-[#3b82f6] text-white rounded text-sm flex items-center hover:bg-blue-600 transition-colors">
                    <Search className="w-4 h-4 mr-1" />
                    搜索
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded text-sm flex items-center hover:bg-slate-50 transition-colors">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    重置
                  </button>
                </div>
              </div>
              
              {/* Table */}
              <div className="flex-1 overflow-auto border-t border-slate-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white sticky top-0 z-10 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-normal text-slate-600">姓名</th>
                      <th className="px-6 py-4 font-normal text-slate-600">角色</th>
                      <th className="px-6 py-4 font-normal text-slate-600">班级</th>
                      <th className="px-6 py-4 font-normal text-slate-600 text-right">使用量</th>
                      <th className="px-6 py-4 font-normal text-slate-600 text-center w-64">最高限额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: '江杰', roles: '学生,AI学伴-学生,学员', cls: '产品', limit: 5000000, used: 600000, percent: 12 },
                      { name: '翁林奇', roles: '学生,老师,AI学伴-教师,阅卷老师,案例创建者,案例开发者', cls: '产品', limit: 5000000, used: 12222, percent: 0.2 },
                      { name: '郑鸿杰', roles: '产品管理员,学生,学校管理员,运营决策者,AI学伴-学生,超级管理员,运营管理员,案例创建者,案例开发者,系统管理员', cls: '产品', limit: 5000000, used: 250000, percent: 5 },
                      { name: '涂玉宝', roles: '学生,AI学伴-学生,学科大模型-学生', cls: '产品', limit: 5000000, used: 12222, percent: 12 },
                      { name: '智联网演示学生01', roles: '学生,AI学伴-学生,学科大模型-学生', cls: '产品', limit: 5000000, used: 89000, percent: 1.7 },
                      { name: '小周', roles: '学生,AI学伴-学生,学科大模型-学生', cls: '软件', limit: 5000000, used: 400000, percent: 8 },
                      { name: '小小陈（接口自动化）', roles: '学生,AI学伴-学生,学科大模型-学生', cls: '测试部', limit: 5000000, used: 0, percent: 0 },
                      { name: '(学生)开放接口测试', roles: '学生,AI学伴-学生,学科大模型-学生', cls: '软件', limit: 5000000, used: 50000, percent: 1 }
                    ].map((user, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-600">{user.name}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs leading-relaxed max-w-md">{user.roles}</td>
                        <td className="px-6 py-4 text-slate-600">{user.cls}</td>
                        <td className="px-6 py-4 text-slate-600 text-right font-medium">{user.used.toLocaleString()}次<span className="text-slate-400 font-normal ml-1">({user.percent}%)</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-white">
                              <button className="px-3 py-1.5 bg-slate-50 border-r border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
                                -
                              </button>
                              <input 
                                type="text" 
                                value={user.limit}
                                readOnly
                                className="w-24 text-center py-1.5 focus:outline-none text-sm text-slate-700"
                              />
                              <button className="px-3 py-1.5 bg-slate-50 border-l border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
                                +
                              </button>
                            </div>
                            <span className="ml-2 text-slate-500 text-sm">次</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-end mt-4 text-sm text-slate-500 space-x-4">
                <span>共 27 条</span>
                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded text-slate-600 bg-white hover:border-slate-300 focus:outline-none">
                    <option>10条/页</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
                <div className="flex items-center space-x-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-400 hover:bg-slate-100"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#3b82f6] text-white">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">3</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-400 hover:bg-slate-100"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center space-x-2">
                  <span>前往</span>
                  <input type="text" defaultValue="1" className="w-12 text-center py-1 border border-slate-200 rounded focus:outline-none focus:border-[#3b82f6]" />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real Usage Details Modal */}
      {showUsageDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white shadow-xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col relative rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">用量详情</h2>
              <button onClick={() => setShowUsageDetailsModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-white">
              
              {/* Controls */}
              <div className="flex items-center justify-end mb-6 space-x-3">
                <input 
                  type="text" 
                  placeholder="请输入使用账号" 
                  className="pl-3 pr-3 py-1.5 border border-slate-200 rounded text-sm w-48 focus:outline-none focus:border-[#3b82f6] text-slate-600"
                />
                
                <div className="flex items-center border border-slate-200 rounded bg-white text-sm">
                  <div className="px-3 py-1.5 text-slate-400 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <input type="text" placeholder="开始日期" className="w-20 outline-none text-slate-600 bg-transparent" />
                  </div>
                  <span className="text-slate-300">-</span>
                  <div className="px-3 py-1.5 text-slate-400 flex items-center">
                    <input type="text" placeholder="结束日期" className="w-20 outline-none text-slate-600 bg-transparent" />
                  </div>
                </div>

                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded text-sm text-slate-500 bg-white hover:border-slate-300 focus:outline-none w-32">
                    <option>Token</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
                
                <button className="px-4 py-1.5 bg-[#3b82f6] text-white rounded text-sm flex items-center hover:bg-blue-600 transition-colors">
                  <Search className="w-4 h-4 mr-1" />
                  搜索
                </button>
                <button className="px-4 py-1.5 bg-white border border-[#3b82f6] text-[#3b82f6] rounded text-sm flex items-center hover:bg-blue-50 transition-colors">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  重置
                </button>
              </div>
              
              {/* Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white sticky top-0 z-10 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-normal text-slate-500">序号</th>
                      <th className="px-6 py-4 font-normal text-slate-500">开始时间</th>
                      <th className="px-6 py-4 font-normal text-slate-500">使用账号</th>
                      <th className="px-6 py-4 font-normal text-slate-500 text-center">计费项</th>
                      <th className="px-6 py-4 font-normal text-slate-500 text-right">用量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { id: 1, time: '2026-08-10 15:23:18', account: '15959081657', billing: 'openai直接调用', amount: '681 Token(s)' },
                      { id: 2, time: '2026-08-10 11:38:34', account: '15959081657', billing: 'openai直接调用', amount: '652 Token(s)' },
                      { id: 3, time: '2026-08-10 11:04:44', account: '15959081657', billing: 'openai直接调用', amount: '616 Token(s)' },
                      { id: 4, time: '2026-08-10 11:03:40', account: '15959081657', billing: 'openai直接调用', amount: '653 Token(s)' },
                      { id: 5, time: '2026-08-10 11:02:26', account: '15959081657', billing: 'openai直接调用', amount: '593 Token(s)' },
                      { id: 6, time: '2026-08-10 11:01:55', account: '18558756641', billing: 'openai直接调用', amount: '6679 Token(s)' },
                      { id: 7, time: '2026-08-10 11:01:28', account: '15959081657', billing: 'openai直接调用', amount: '651 Token(s)' },
                      { id: 8, time: '2026-08-10 11:00:56', account: '15959081657', billing: 'openai直接调用', amount: '643 Token(s)' },
                      { id: 9, time: '2026-08-10 11:00:48', account: '15959081657', billing: 'openai直接调用', amount: '645 Token(s)' },
                      { id: 10, time: '2026-08-10 11:00:29', account: '15959081657', billing: 'openai直接调用', amount: '644 Token(s)' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-500">{row.id}</td>
                        <td className="px-6 py-4 text-slate-600">{row.time}</td>
                        <td className="px-6 py-4 text-slate-600">{row.account}</td>
                        <td className="px-6 py-4 text-slate-600 text-center">{row.billing}</td>
                        <td className="px-6 py-4 text-slate-600 text-right">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-end mt-4 text-sm text-slate-500 space-x-4 pt-4 border-t border-slate-100">
                <span className="text-slate-600">当前页合计Token(s): 12457 Token</span>
                <span>共 3158 条</span>
                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded text-slate-600 bg-white hover:border-slate-300 focus:outline-none">
                    <option>10条/页</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
                <div className="flex items-center space-x-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-400 hover:bg-slate-100"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#3b82f6] text-white">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">3</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">4</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">5</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">6</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">...</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100">316</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-400 hover:bg-slate-100"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center space-x-2">
                  <span>前往</span>
                  <input type="text" defaultValue="1" className="w-12 text-center py-1 border border-slate-200 rounded focus:outline-none focus:border-[#3b82f6]" />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
