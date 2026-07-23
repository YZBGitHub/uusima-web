import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function UsersRegistered() {
  const [searchParams, setSearchParams] = useState({
    username: '',
    loginName: '',
    userType: '',
    auditStatus: ''
  });

  const users = [
    {
      phone: '13800138000',
      loginName: 'zj__admin',
      username: '张建',
      gender: '男',
      authUser: '院校用户',
      organization: '福州大学',
      auditStatus: '审核通过',
      lastLoginTime: '2026-06-11 10:20:30'
    },
    {
      phone: '13900139000',
      loginName: 'li_ming',
      username: '李明',
      gender: '男',
      authUser: '企业用户',
      organization: '新大陆科技集团',
      auditStatus: '待审核',
      lastLoginTime: '2026-06-10 14:15:20'
    },
    {
      phone: '13700137000',
      loginName: 'guest_user',
      username: '王小红',
      gender: '女',
      authUser: '无',
      organization: '-',
      auditStatus: '无',
      lastLoginTime: '2026-06-09 09:30:00'
    }
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Search Area */}
      <div className="bg-white border-b border-slate-200 py-4 flex flex-wrap gap-6 items-center px-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">用户名：</span>
          <input 
            type="text" 
            placeholder="请输入" 
            value={searchParams.username}
            onChange={e => setSearchParams({...searchParams, username: e.target.value})}
            className="w-48 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">登录名：</span>
          <input 
            type="text" 
            placeholder="请输入" 
            value={searchParams.loginName}
            onChange={e => setSearchParams({...searchParams, loginName: e.target.value})}
            className="w-48 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500" 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">用户类型：</span>
          <select 
            value={searchParams.userType}
            onChange={e => setSearchParams({...searchParams, userType: e.target.value})}
            className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="院校用户">院校用户</option>
            <option value="企业用户">企业用户</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">审核状态：</span>
          <select 
            value={searchParams.auditStatus}
            onChange={e => setSearchParams({...searchParams, auditStatus: e.target.value})}
            className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="审核通过">审核通过</option>
            <option value="待审核">待审核</option>
            <option value="无">无</option>
          </select>
        </div>

        <div className="flex items-center space-x-3 ml-auto">
          <button className="flex items-center px-4 py-1.5 bg-[#1890ff] text-white rounded text-sm hover:bg-[#40a9ff] transition-colors">
            <Search className="w-4 h-4 mr-1.5" />
            查询
          </button>
          <button 
            onClick={() => setSearchParams({username: '', loginName: '', userType: '', auditStatus: ''})}
            className="flex items-center px-4 py-1.5 border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            重置
          </button>
        </div>
      </div>

      {/* List Area */}
      <div className="bg-white flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#fafafa] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500">手机号</th>
                <th className="px-6 py-4 font-medium text-slate-500">登录名</th>
                <th className="px-6 py-4 font-medium text-slate-500">用户名</th>
                <th className="px-6 py-4 font-medium text-slate-500">性别</th>
                <th className="px-6 py-4 font-medium text-slate-500">认证用户</th>
                <th className="px-6 py-4 font-medium text-slate-500">加入组织</th>
                <th className="px-6 py-4 font-medium text-slate-500">审核状态</th>
                <th className="px-6 py-4 font-medium text-slate-500">最近登录时间</th>
                <th className="px-6 py-4 font-medium text-slate-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">{user.phone}</td>
                  <td className="px-6 py-4 text-slate-600">{user.loginName}</td>
                  <td className="px-6 py-4 text-slate-600">{user.username}</td>
                  <td className="px-6 py-4 text-slate-600">{user.gender}</td>
                  <td className="px-6 py-4 text-slate-600">{user.authUser}</td>
                  <td className="px-6 py-4 text-slate-600">{user.organization}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                      user.auditStatus === '审核通过' ? 'border-green-200 text-green-600 bg-green-50' : 
                      user.auditStatus === '待审核' ? 'border-orange-200 text-orange-600 bg-orange-50' : 
                      'border-slate-200 text-slate-500 bg-slate-50'
                    }`}>
                      {user.auditStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.lastLoginTime}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <button className="text-[#1890ff] hover:text-[#40a9ff] transition-colors">查看</button>
                      <button className={`${user.auditStatus === '待审核' ? 'text-[#52c41a] hover:text-[#73d13d]' : 'text-[#d9d9d9] cursor-not-allowed'} transition-colors`}>审核</button>
                      <button className="text-[#722ed1] hover:text-[#9254de] transition-colors">角色</button>
                      <button className="text-[#1890ff] hover:text-[#40a9ff] transition-colors">充值</button>
                      <button className="text-[#722ed1] hover:text-[#9254de] transition-colors">订单记录</button>
                      <button className="text-[#fa8c16] hover:text-[#ffc069] transition-colors">使用记录</button>
                      <button className="text-[#ff4d4f] hover:text-[#ff7875] transition-colors">禁用</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-end mt-auto">
          <div className="text-sm text-slate-500 mr-4">
            共 3 条
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 border border-slate-300 rounded text-sm text-slate-400 bg-slate-50 cursor-not-allowed">
              上一页
            </button>
            <button className="px-3 py-1.5 border border-blue-500 rounded bg-[#1890ff] text-white text-sm">
              1
            </button>
            <button className="px-3 py-1.5 border border-slate-300 rounded text-sm text-slate-400 bg-slate-50 cursor-not-allowed">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
