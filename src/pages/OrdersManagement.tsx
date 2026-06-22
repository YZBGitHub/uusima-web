import React, { useState } from 'react';

export default function OrdersManagement() {
  const [activeOrderTab, setActiveOrderTab] = useState<'token' | 'duration'>('token');

  const tokenOrders = [
    { id: 1, orderNo: '2026042020035452', name: '智联网综合实践平台服务增配包-TJ', startTime: '2026-04-20 00:00:00', endTime: '2027-04-20 00:00:00', type: '套餐', amount: 4000, bonus: 0, count: 2, modules: '', majors: '' },
    { id: 2, orderNo: '2025072214383481', name: '试用套餐', startTime: '2025-07-22 00:00:00', endTime: '2026-07-22 00:00:00', type: '套餐', amount: 0, bonus: 0, count: 1, modules: 'AI教师助手, AI技能助手', majors: '人工智能训练师,物联网安装调试员,通识教育,基础编程,人工智能,物联网,大数据,工业互联网' }
  ];

  const durationOrders = [
    { id: 1, users: 0, used: 0, total: 3000, duration: 12, major: '物联网', status: '已失效', addTime: '2023-11-28 14:32:40', startTime: '2023-11-28 14:32:40' },
    { id: 2, users: 100, used: 0, total: 5000, duration: 0, major: '物联网', status: '已失效', addTime: '2025-09-20 11:39:33', startTime: '2025-09-20 11:39:33' },
    { id: 3, users: 1, used: 1008.4, total: 1000, duration: 12, major: '物联网', status: '生效中', addTime: '2025-09-20 11:40:10', startTime: '2025-09-20 11:40:10' },
    { id: 4, users: 10, used: 52.07, total: 999999, duration: 12, major: '物联网', status: '生效中', addTime: '2025-09-20 11:50:28', startTime: '2025-09-20 11:50:28' },
    { id: 5, users: 50, used: 0, total: 6000, duration: 36, major: '不限', status: '生效中', addTime: '2025-12-07 18:19:01', startTime: '2025-12-07 18:19:01' },
    { id: 6, users: 1, used: 0, total: 1000, duration: 12, major: '物联网', status: '生效中', addTime: '2025-12-07 18:19:25', startTime: '2025-12-07 18:19:25' },
    { id: 7, users: 200, used: 0, total: 5000, duration: 12, major: '人工智能', status: '生效中', addTime: '2025-12-07 18:19:35', startTime: '2025-12-07 18:19:35' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] p-6 overflow-y-auto">
      <div className="mb-4 text-slate-800 flex justify-between items-end">
        <h2 className="text-xl font-bold">订购订单</h2>
      </div>

      <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden mb-8">
        <div className="border-b border-slate-200">
          <div className="flex px-4">
            <button 
              onClick={() => setActiveOrderTab('token')}
              className={`py-4 px-4 text-sm font-medium relative transition-colors ${activeOrderTab === 'token' ? 'text-[#108ee9]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Token与PPT充值订单
              {activeOrderTab === 'token' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#108ee9]" />}
            </button>
            <button 
              onClick={() => setActiveOrderTab('duration')}
              className={`py-4 px-4 text-sm font-medium relative transition-colors ${activeOrderTab === 'duration' ? 'text-[#108ee9]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              时长与账号授权订单
              {activeOrderTab === 'duration' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#108ee9]" />}
            </button>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {activeOrderTab === 'token' ? (
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[max-content]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-slate-500">序号</th>
                  <th className="px-6 py-4 font-medium text-slate-500">充值单号</th>
                  <th className="px-6 py-4 font-medium text-slate-500">名称</th>
                  <th className="px-6 py-4 font-medium text-slate-500">生效时间</th>
                  <th className="px-6 py-4 font-medium text-slate-500">到期时间</th>
                  <th className="px-6 py-4 font-medium text-slate-500">充值类型</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-right">充值金额</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-right">赠送金额</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-center">套餐数量</th>
                  <th className="px-6 py-4 font-medium text-slate-500">开通模块</th>
                  <th className="px-6 py-4 font-medium text-slate-500">开通专业</th>
                  <th className="px-6 py-4 font-medium text-slate-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tokenOrders.map((order, i) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                    <td className="px-6 py-4 text-[#108ee9]">{order.orderNo}</td>
                    <td className="px-6 py-4 text-slate-700">{order.name}</td>
                    <td className="px-6 py-4 text-slate-500">{order.startTime}</td>
                    <td className="px-6 py-4 text-slate-500">{order.endTime}</td>
                    <td className="px-6 py-4 text-slate-500">{order.type}</td>
                    <td className="px-6 py-4 text-slate-700 text-right">{order.amount}</td>
                    <td className="px-6 py-4 text-slate-700 text-right">{order.bonus}</td>
                    <td className="px-6 py-4 text-slate-700 text-center">{order.count}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate" title={order.modules}>{order.modules}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate" title={order.majors}>{order.majors}</td>
                    <td className="px-6 py-4">
                      <button className="text-[#108ee9] hover:text-blue-700 transition-colors text-[13px] font-medium">套餐明细</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[max-content]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-slate-500">序号</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-center">人数</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-center">套餐时长 (小时) 已用时长/可用总时长</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-center">期限(月)</th>
                  <th className="px-6 py-4 font-medium text-slate-500">专业</th>
                  <th className="px-6 py-4 font-medium text-slate-500">套餐状态</th>
                  <th className="px-6 py-4 font-medium text-slate-500">套餐新增时间</th>
                  <th className="px-6 py-4 font-medium text-slate-500">生效时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {durationOrders.map((order, i) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                    <td className="px-6 py-4 text-slate-700 text-center">{order.users}</td>
                    <td className="px-6 py-4 text-slate-700 text-center">
                      <span className="text-[#108ee9]">{order.used}</span> <span className="text-slate-400">/{order.total}小时</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-center">{order.duration}</td>
                    <td className="px-6 py-4 text-slate-700">{order.major}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${order.status === '生效中' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{order.addTime}</td>
                    <td className="px-6 py-4 text-slate-500">{order.startTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
