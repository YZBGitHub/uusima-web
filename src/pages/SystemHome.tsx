import React, { useState } from 'react';
import { GraduationCap, Wallet, CreditCard, Gift, Users } from 'lucide-react';

export default function SystemHome() {
  const [limits, setLimits] = useState([
    { id: 'token', name: 'Token', remaining: 8153956, used: 6846044, isLimited: true, maxLimit: 5000000 },
    { id: 'ai-ppt', name: 'AI-PPT', remaining: 4, used: 1, isLimited: true, maxLimit: 5 },
    { id: 'exp-time', name: '实验时长(分钟)', remaining: 1200, used: 300, isLimited: true, maxLimit: 600 },
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
        {/* Cards */}
        <div className="grid grid-cols-4 gap-4 flex-1">
          {/* Card 1 */}
          <div className="bg-gradient-to-r from-[#2190ff] to-[#0477fe] rounded-lg p-5 text-white relative overflow-hidden h-36 flex flex-col justify-between shadow-sm">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-8">
              <div className="w-32 h-32 rounded-full border-[12px] border-white"></div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform -translate-x-2 -translate-y-2">
              <div className="w-48 h-48 rounded-full border-[12px] border-white"></div>
            </div>
            <div className="text-sm font-medium opacity-90 z-10">账户总余额</div>
            <div className="flex items-baseline space-x-2 z-10 mb-2">
              <span className="text-[32px] font-bold leading-none">0</span>
              <span className="text-sm">元</span>
            </div>
            <div className="absolute right-4 bottom-4 z-10 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 opacity-100" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-r from-[#4d6dfd] to-[#3651fa] rounded-lg p-5 text-white relative overflow-hidden h-36 flex flex-col justify-between shadow-sm">
             <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-8">
              <div className="w-32 h-32 rounded-full border-[12px] border-white"></div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform -translate-x-2 -translate-y-2">
              <div className="w-48 h-48 rounded-full border-[12px] border-white"></div>
            </div>
            <div className="text-sm font-medium opacity-90 z-10">充值余额</div>
            <div className="flex items-baseline space-x-2 z-10 mb-2">
              <span className="text-[32px] font-bold leading-none">0</span>
              <span className="text-sm">元</span>
            </div>
            <div className="absolute right-4 bottom-4 z-10 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-4 h-4 opacity-100" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-r from-[#7a53fe] to-[#5a36f9] rounded-lg p-5 text-white relative overflow-hidden h-36 flex flex-col justify-between shadow-sm">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-8">
              <div className="w-32 h-32 rounded-full border-[12px] border-white"></div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform -translate-x-2 -translate-y-2">
              <div className="w-48 h-48 rounded-full border-[12px] border-white"></div>
            </div>
            <div className="text-sm font-medium opacity-90 z-10">赠送余额</div>
            <div className="flex items-baseline space-x-2 z-10 mb-2">
              <span className="text-[32px] font-bold leading-none">0</span>
              <span className="text-sm">元</span>
            </div>
            <div className="absolute right-4 bottom-4 z-10 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 opacity-100" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-r from-[#9b49ff] to-[#7f26f6] rounded-lg p-5 text-white relative overflow-hidden h-36 flex flex-col justify-between shadow-sm">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-8">
              <div className="w-32 h-32 rounded-full border-[12px] border-white"></div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform -translate-x-2 -translate-y-2">
              <div className="w-48 h-48 rounded-full border-[12px] border-white"></div>
            </div>
            <div className="text-sm font-medium opacity-90 z-10">剩余账号数</div>
            <div className="flex items-baseline space-x-2 z-10 mb-2">
              <span className="text-[32px] font-bold leading-none">-4</span>
              <span className="text-sm">个</span>
            </div>
            <div className="absolute right-4 bottom-4 z-10 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 opacity-100" />
            </div>
          </div>
        </div>

        {/* Action Buttons to the right */}
        <div className="flex flex-col justify-center pl-8 space-y-4">
          <button className="text-[#108ee9] hover:text-blue-700 text-[13px] font-medium transition-colors text-right w-full">订购充值</button>
          <button className="text-[#108ee9] hover:text-blue-700 text-[13px] font-medium transition-colors text-right w-full">计费明细</button>
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
                </td>
                <td className="px-6 py-5">
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
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <button className="text-[#108ee9] hover:text-blue-700 transition-colors text-[13px] font-medium">限额设置</button>
                    <button className="text-[#108ee9] hover:text-blue-700 transition-colors text-[13px] font-medium">用量详情</button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
