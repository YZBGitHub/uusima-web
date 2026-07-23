import React, { useState } from 'react';
import BillingPackage from './BillingPackage';
import BillingPoints from './BillingPoints';

export default function BillingSettings() {
  const [activeTab, setActiveTab] = useState<'package' | 'points'>('package');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center space-x-6 border-b border-slate-200 mb-4 px-2 shrink-0">
        <button
          onClick={() => setActiveTab('package')}
          className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'package' 
              ? 'border-[#1890ff] text-[#1890ff]' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          套餐管理
        </button>
        <button
          onClick={() => setActiveTab('points')}
          className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'points' 
              ? 'border-[#1890ff] text-[#1890ff]' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          积分设置
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'package' && <BillingPackage />}
        {activeTab === 'points' && <BillingPoints />}
      </div>
    </div>
  );
}
