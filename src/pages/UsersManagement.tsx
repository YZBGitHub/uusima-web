import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, ChevronDown, ChevronRight, X, Play, Square, Key, Shield, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const mockUsers = [
  {
    id: '1',
    account: '15020019003',
    name: '接口自动化-林材',
    phone: '15020019003',
    org: '注册测试租户01,非班...',
    identity: '成员',
    roles: '',
    status: true,
  },
  {
    id: '2',
    account: '15396005421',
    name: '杨先生',
    phone: '15396005421',
    org: '非班级02',
    identity: '成员',
    roles: 'AI学伴-教师',
    status: true,
  }
];

const roleOptions = ['组织成员', '组织管理员', '系统管理员'];

const roleCategories = [
  '角色组',
  '运营决策大屏',
  '考试题库系统',
  'AI学伴',
  '二维码平台',
  'AIoT平台'
];

const roleOptionsData: Record<string, {name: string, desc: string}[]> = {
  '角色组': [
    { name: '普通用户组', desc: '包含各个应用的基础权限' },
    { name: '教师协作组', desc: '包含备课、授课、批改作业等权限' },
    { name: '超级管理员组', desc: '包含平台和所有应用的最高权限' },
  ],
  '运营决策大屏': [
    { name: '运营大屏 / 管理员', desc: '' },
    { name: '运营大屏 / 成员', desc: '' },
  ],
  '考试题库系统': [],
  'AI学伴': [],
  '二维码平台': [],
  'AIoT平台': []
};

export default function UsersManagement() {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'org1': true,
    'org2': true
  });
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any>(null);
  
  // Custom Role Dropdown State
  const [isEditRoleDropdownOpen, setIsEditRoleDropdownOpen] = useState(false);
  const [selectedEditRoleCategory, setSelectedEditRoleCategory] = useState('角色组');
  const [selectedEditRoles, setSelectedEditRoles] = useState<string[]>(['租户管理后台 / 管理员', '租户管理后台 / 成员']);

  const [editFormData, setEditFormData] = useState({
    phone: '15388996999',
    account: '15388996999',
    email: '505366410@qq.com',
    tenant: '1983411203003752449',
    org: '市域产教联合体',
    realName: '杨振邦',
    gender: 'Male',
    position: '产品'
  });

  const handleOpenEditModal = (user: any) => {
    setSelectedUserForEdit(user);
    setIsEditModalOpen(true);
    setIsEditRoleDropdownOpen(false);
  };

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenRoleModal = (user: any) => {
    setSelectedUserForRole(user);
    setSelectedRole(user.identity || '组织成员');
    setIsRoleModalOpen(true);
    setIsRoleDropdownOpen(false);
  };

  return (
    <div className="flex h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Left Sidebar - Organization Tree */}
      <div className="w-64 border-r border-slate-100 flex flex-col pt-4">
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="请输入组织名称搜索" 
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2">
          {/* Tree Nodes */}
          <div className="space-y-0.5 text-sm cursor-pointer select-none">
             <div className="flex items-center group px-2 py-1.5 hover:bg-slate-50 rounded">
               <div className="w-4 h-4 mr-1"></div>
               <span className="text-slate-700 flex-1 truncate">班级04</span>
               <div className="hidden group-hover:flex items-center space-x-2 text-slate-400">
                 <Plus className="w-3.5 h-3.5 hover:text-blue-600" />
                 <Edit2 className="w-3.5 h-3.5 hover:text-blue-600" />
                 <Trash2 className="w-3.5 h-3.5 hover:text-red-500" />
               </div>
             </div>
             
             <div>
               <div className="flex items-center group px-2 py-1.5 hover:bg-slate-50 rounded" onClick={() => toggleNode('org1')}>
                 <div className="w-4 h-4 mr-1 flex items-center justify-center text-slate-400">
                   {expandedNodes['org1'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                 </div>
                 <span className="text-slate-700 flex-1 truncate">顶级组织机...</span>
                 <div className="hidden group-hover:flex items-center space-x-2 text-slate-400">
                   <Plus className="w-3.5 h-3.5 hover:text-blue-600" />
                   <Edit2 className="w-3.5 h-3.5 hover:text-blue-600" />
                   <Trash2 className="w-3.5 h-3.5 hover:text-red-500" />
                 </div>
               </div>
               
               {expandedNodes['org1'] && (
                 <div className="pl-5">
                   <div className="flex items-center group px-2 py-1.5 hover:bg-slate-50 rounded">
                     <div className="w-4 h-4 mr-1"></div>
                     <span className="text-slate-600 flex-1 truncate">非班级02</span>
                     <div className="hidden group-hover:flex items-center space-x-2 text-slate-400">
                       <Plus className="w-3.5 h-3.5 hover:text-blue-600" />
                       <Edit2 className="w-3.5 h-3.5 hover:text-blue-600" />
                       <Trash2 className="w-3.5 h-3.5 hover:text-red-500" />
                     </div>
                   </div>
                   <div className="flex items-center group px-2 py-1.5 hover:bg-slate-50 rounded">
                     <div className="w-4 h-4 mr-1"></div>
                     <span className="text-slate-600 flex-1 truncate">非班级01</span>
                     <div className="hidden group-hover:flex items-center space-x-2 text-slate-400">
                       <Plus className="w-3.5 h-3.5 hover:text-blue-600" />
                       <Edit2 className="w-3.5 h-3.5 hover:text-blue-600" />
                       <Trash2 className="w-3.5 h-3.5 hover:text-red-500" />
                     </div>
                   </div>
                 </div>
               )}
             </div>
             
             <div>
               <div className="flex items-center group px-2 py-1.5 hover:bg-slate-50 rounded" onClick={() => toggleNode('org2')}>
                 <div className="w-4 h-4 mr-1 flex items-center justify-center text-slate-400">
                   {expandedNodes['org2'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                 </div>
                 <span className="text-slate-700 flex-1 truncate">注册测试租...</span>
                 <div className="hidden group-hover:flex items-center space-x-2 text-slate-400">
                   <Plus className="w-3.5 h-3.5 hover:text-blue-600" />
                   <Edit2 className="w-3.5 h-3.5 hover:text-blue-600" />
                   <Trash2 className="w-3.5 h-3.5 hover:text-red-500" />
                 </div>
               </div>
               
               {expandedNodes['org2'] && (
                 <div className="pl-5">
                   <div className="flex items-center group px-2 py-1.5 hover:bg-slate-50 rounded">
                     <div className="w-4 h-4 mr-1"></div>
                     <span className="text-slate-600 flex-1 truncate">001</span>
                     <div className="hidden group-hover:flex items-center space-x-2 text-slate-400">
                       <Plus className="w-3.5 h-3.5 hover:text-blue-600" />
                       <Edit2 className="w-3.5 h-3.5 hover:text-blue-600" />
                       <Trash2 className="w-3.5 h-3.5 hover:text-red-500" />
                     </div>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
      
      {/* Right Content Area */}
      <div className="flex-1 flex flex-col p-6 min-w-0">
        
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">组织范围:</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="w-4 h-4 rounded-full border-4 border-blue-600 shadow-sm flex items-center justify-center bg-white" />
                <span className="text-blue-600 font-medium">本级及子级</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="scope" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                <span className="text-slate-600">仅本级</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">搜索字段:</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="w-4 h-4 rounded-full border-4 border-blue-600 shadow-sm flex items-center justify-center bg-white" />
                <span className="text-blue-600 font-medium">账号</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="searchField" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                <span className="text-slate-600">姓名</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="searchField" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                <span className="text-slate-600">手机号</span>
              </label>
            </div>

            <div className="flex items-center flex-1 max-w-sm">
              <span className="text-slate-600 mr-3 whitespace-nowrap">搜索值:</span>
              <input type="text" placeholder="请输入关键字搜索" className="flex-1 min-w-0 border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-400" />
            </div>

            <div className="flex items-center space-x-3 ml-2">
              <button className="flex items-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                <Search className="w-3.5 h-3.5 mr-1.5" />
                查询
              </button>
              <button className="flex items-center px-4 py-1.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full mr-1.5" style={{ animation: 'spin 1.5s linear infinite' }}></div>
                重置
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">状态:</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-blue-600">启用</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-600">禁用</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-slate-600">身份:</span>
              <div className="relative">
                <select className="appearance-none border border-slate-200 rounded pl-3 pr-8 py-1.5 text-slate-500 min-w-[200px] focus:outline-none focus:border-blue-500 bg-white cursor-pointer">
                  <option value="">用户身份</option>
                  <option value="member">成员</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-slate-600">角色:</span>
              <div className="relative">
                <select className="appearance-none border border-slate-200 rounded pl-3 pr-8 py-1.5 text-slate-500 min-w-[200px] focus:outline-none focus:border-blue-500 bg-white cursor-pointer">
                  <option value="">请选择角色</option>
                  <option value="teacher">教师</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions Toolbar */}
        <div className="flex items-center flex-wrap gap-3 mb-4">
          <button className="flex items-center px-3 py-1.5 bg-[#1e80ff] hover:bg-blue-600 text-white text-sm rounded shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-1.5" />
            单个新增
          </button>
          <button className="flex items-center px-3 py-1.5 bg-[#1e80ff] hover:bg-blue-600 text-white text-sm rounded shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-1.5" />
            批量新增
          </button>
          <button className="flex items-center px-3 py-1.5 bg-red-300 hover:bg-red-400 text-white text-sm rounded transition-colors" disabled>
            <Trash2 className="w-4 h-4 mr-1.5" />
            批量删除
          </button>
          <button className="flex items-center px-3 py-1.5 bg-red-300 hover:bg-red-400 text-white text-sm rounded transition-colors" disabled>
            用户禁用
          </button>
          <button className="flex items-center px-3 py-1.5 bg-slate-400 hover:bg-slate-500 text-white text-sm rounded transition-colors" disabled>
            用户启用
          </button>
          <button className="flex items-center px-3 py-1.5 bg-slate-400 hover:bg-slate-500 text-white text-sm rounded transition-colors" disabled>
            <Key className="w-3.5 h-3.5 mr-1.5" />
            密码重置
          </button>
          <button className="flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-400 text-sm rounded transition-colors" disabled>
            批量授权角色
          </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto border-t border-slate-100 min-h-0">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[1000px]">
            <thead className="bg-[#fbfafe] sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3 border-b border-slate-100 w-12 text-center text-slate-500 font-medium">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700">序号</th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700">登录账号</th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700">姓名</th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700">手机号码</th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700">所属组织</th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700">用户身份</th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700">拥有角色</th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700 w-24">状态</th>
                <th className="px-5 py-3 border-b border-slate-100 font-medium text-slate-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockUsers.map((user, idx) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-5 py-4 text-slate-600">{idx + 1}</td>
                  <td className="px-5 py-4 text-slate-600">{user.account}</td>
                  <td className="px-5 py-4 font-medium text-blue-600 cursor-pointer hover:underline">{user.name}</td>
                  <td className="px-5 py-4 text-slate-600">{user.phone}</td>
                  <td className="px-5 py-4 text-slate-600 max-w-[120px] truncate" title={user.org}>{user.org}</td>
                  <td className="px-5 py-4 text-slate-600">{user.identity}</td>
                  <td className="px-5 py-4 text-slate-600">{user.roles}</td>
                  <td className="px-5 py-4">
                     <div className="flex items-center mt-1">
                       <button className={`w-10 h-5 text-white rounded-full flex items-center p-0.5 transition-colors ${user.status ? 'bg-blue-600' : 'bg-slate-300'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${user.status ? 'translate-x-5' : 'translate-x-0'}`} />
                       </button>
                     </div>
                  </td>
                  <td className="px-5 py-4 text-[#1e80ff] space-x-3 text-xs font-medium">
                    <button className="hover:text-blue-800 transition-colors">查看</button>
                    <button className="hover:text-blue-800 transition-colors" onClick={() => handleOpenEditModal(user)}>编辑</button>
                    <button className="hover:text-blue-800 transition-colors" onClick={() => handleOpenRoleModal(user)}>身份设置</button>
                    <button className="text-red-500 hover:text-red-700 transition-colors">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        <div className="mt-4 flex items-center justify-end text-sm text-slate-500 space-x-4 border-t border-slate-100 pt-4">
          <span>共 {mockUsers.length} 条</span>
          <div className="relative">
             <select className="appearance-none border border-slate-200 rounded pl-3 pr-8 py-1 focus:outline-none bg-white cursor-pointer hover:bg-slate-50">
               <option value="10">10条/页</option>
               <option value="20">20条/页</option>
               <option value="50">50条/页</option>
             </select>
             <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="flex items-center space-x-1">
             <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300">
               <ChevronRight className="w-4 h-4 rotate-180" />
             </button>
             <button className="w-7 h-7 flex items-center justify-center border border-transparent bg-[#1e80ff] text-white rounded font-medium">
               1
             </button>
             <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300">
               <ChevronRight className="w-4 h-4" />
             </button>
          </div>
          <div className="flex items-center space-x-2">
            <span>前往</span>
            <input type="text" defaultValue="1" className="w-12 text-center border border-slate-200 rounded py-1 focus:outline-none focus:border-blue-500" />
            <span>页</span>
          </div>
        </div>

      </div>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsRoleModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-lg shadow-xl w-[480px] relative z-10 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <h3 className="text-lg font-medium text-slate-800">身份选择</h3>
                <button 
                  onClick={() => setIsRoleModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pb-8 space-y-6">
                <div className="bg-[#f8f9fc] px-4 py-3.5 rounded flex items-center text-[15px]">
                  <span className="text-slate-600">当前用户：</span>
                  <span className="text-slate-800 ml-1">{selectedUserForRole?.name}</span>
                </div>
                
                <div className="space-y-2.5 relative flex-1">
                  <div className="flex items-center text-[15px]">
                    <span className="text-red-500 mr-1">*</span>
                    <span className="text-slate-600">请选择身份</span>
                  </div>
                  
                  <div 
                    className={`border rounded flex items-center justify-between px-4 py-2.5 cursor-pointer bg-white transition-colors ${isRoleDropdownOpen ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'border-slate-300 hover:border-slate-400'}`}
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  >
                    <span className={`text-[15px] ${selectedRole ? 'text-slate-800' : 'text-slate-400'}`}>
                      {selectedRole || '请选择身份'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isRoleDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-20 py-2 border border-slate-100"
                    >
                      {/* Dropdown Arrow */}
                      <div className="absolute -top-1.5 left-8 w-3 h-3 bg-white border-l border-t border-slate-100 transform rotate-45"></div>
                      
                      {roleOptions.map((role) => (
                        <div
                          key={role}
                          className={`px-6 py-2.5 text-[15px] cursor-pointer transition-colors ${selectedRole === role ? 'text-[#1e80ff]' : 'text-slate-700 hover:bg-slate-50'}`}
                          onClick={() => {
                            setSelectedRole(role);
                            setIsRoleDropdownOpen(false);
                          }}
                        >
                          {role}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl w-[560px] relative z-10 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white">
                <h3 className="text-[17px] font-medium text-slate-800">修改用户</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-6 space-y-4 overflow-visible">
                {/* Phone */}
                <div className="flex items-center">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>手机号:
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full border border-slate-200 rounded-md px-3 py-2 text-[15px] text-slate-800 focus:outline-none focus:border-blue-500 pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      {editFormData.phone.length} / 11
                    </div>
                  </div>
                </div>

                {/* Account */}
                <div className="flex items-center">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>账号:
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[15px] text-slate-500">
                    {editFormData.account}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0">
                    邮箱:
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full border border-slate-200 rounded-md px-3 py-2 text-[15px] text-slate-800 focus:outline-none focus:border-blue-500 pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      {editFormData.email.length} / 50
                    </div>
                  </div>
                </div>

                {/* Tenant */}
                <div className="flex items-center">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0">
                    租户:
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[15px] text-slate-400 flex items-center justify-between">
                    <span>{editFormData.tenant}</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Organization */}
                <div className="flex items-center">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>组织机构:
                  </div>
                  <div className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-[15px] text-slate-700 flex items-center justify-between cursor-pointer focus-within:border-blue-500">
                    <span>{editFormData.org}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Real Name */}
                <div className="flex items-center">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0">
                    <span className="text-red-500 mr-1">*</span>真实姓名:
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={editFormData.realName}
                      onChange={(e) => setEditFormData({...editFormData, realName: e.target.value})}
                      className="w-full border border-slate-200 rounded-md px-3 py-2 text-[15px] text-slate-800 focus:outline-none focus:border-blue-500 pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      {editFormData.realName.length} / 20
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0">
                    性别:
                  </div>
                  <div className="flex-1 flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editFormData.gender === 'Male' ? 'border-blue-600' : 'border-slate-300'}`}>
                        {editFormData.gender === 'Male' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <span className={`text-[15px] ${editFormData.gender === 'Male' ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>男</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editFormData.gender === 'Female' ? 'border-blue-600' : 'border-slate-300'}`}>
                        {editFormData.gender === 'Female' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <span className={`text-[15px] ${editFormData.gender === 'Female' ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>女</span>
                    </label>
                  </div>
                </div>

                {/* Position */}
                <div className="flex items-center">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0">
                    职务:
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={editFormData.position}
                      onChange={(e) => setEditFormData({...editFormData, position: e.target.value})}
                      className="w-full border border-blue-500 rounded-md px-3 py-2 text-[15px] text-slate-800 focus:outline-none focus:border-blue-500 pr-20 bg-white"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                       {editFormData.position && (
                         <button onClick={() => setEditFormData({...editFormData, position: ''})} className="text-slate-400 hover:text-slate-600">
                           <XCircle className="w-4 h-4" />
                         </button>
                       )}
                       <span className="text-slate-400 text-sm">
                        {editFormData.position.length} / 50
                       </span>
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start">
                  <div className="w-24 text-right pr-4 text-[15px] font-medium text-slate-700 flex-shrink-0 mt-2">
                    <span className="text-red-500 mr-1">*</span>角色:
                  </div>
                  <div className="flex-1 relative">
                    <div 
                      className={`relative w-full border rounded-md pl-3 pr-8 py-2 text-[15px] min-h-[40px] flex items-center flex-wrap gap-2 cursor-pointer transition-colors ${isEditRoleDropdownOpen ? 'border-blue-500' : 'border-slate-200 hover:border-blue-500'}`}
                      onClick={() => setIsEditRoleDropdownOpen(!isEditRoleDropdownOpen)}
                    >
                      {selectedEditRoles.length > 0 ? (
                        <>
                          {selectedEditRoles.map(role => (
                            <div key={role} className="flex items-center bg-[#f1f2f5] text-slate-600 text-sm px-2.5 py-1 rounded">
                              {role}
                              <button 
                                className="ml-1.5 text-slate-400 hover:text-slate-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEditRoles(selectedEditRoles.filter(r => r !== role));
                                }}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </>
                      ) : (
                        <span className="text-slate-400 text-[15px]">请选择角色或角色组</span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${isEditRoleDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Role Complex Dropdown */}
                    {isEditRoleDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] right-0 w-[460px] bg-white border border-slate-200 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-50 flex h-[320px] overflow-hidden">
                        <div className="w-[150px] flex-shrink-0 border-r border-slate-100 bg-[#f8fafc] overflow-y-auto">
                          {roleCategories.map(cat => (
                            <div 
                              key={cat}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEditRoleCategory(cat);
                              }}
                              className={`flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium ${selectedEditRoleCategory === cat ? 'bg-[#edf1fc] text-[#4f7bf6] border-l-2 border-[#4f7bf6]' : 'text-slate-600 hover:bg-slate-50 border-l-2 border-transparent'}`}
                            >
                              <span>{cat}</span>
                              {selectedEditRoleCategory === cat && <ChevronRight className="w-4 h-4 text-[#4f7bf6]" />}
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 bg-white overflow-y-auto p-4 pl-8">
                          <div className="space-y-6">
                            {(roleOptionsData[selectedEditRoleCategory] || []).map(option => (
                              <label key={option.name} className="flex items-start space-x-4 cursor-pointer group">
                                <div className="mt-0.5 flex-shrink-0">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                    checked={selectedEditRoles.includes(option.name)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedEditRoles([...selectedEditRoles, option.name]);
                                      } else {
                                        setSelectedEditRoles(selectedEditRoles.filter(r => r !== option.name));
                                      }
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className={`text-sm font-medium ${selectedEditRoles.includes(option.name) ? 'text-slate-800' : 'text-slate-700'}`}>
                                    {option.name}
                                  </div>
                                  {option.desc && (
                                    <div className="text-xs text-slate-500 mt-1">
                                      {option.desc}
                                    </div>
                                  )}
                                </div>
                              </label>
                            ))}
                            {(!roleOptionsData[selectedEditRoleCategory] || roleOptionsData[selectedEditRoleCategory].length === 0) && (
                              <div className="text-center text-slate-400 py-10 text-sm">
                                暂无数据
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex justify-end space-x-4 mt-auto">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-1.5 text-slate-600 text-sm font-medium border border-slate-200 rounded cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-1.5 bg-[#2b6bff] text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
