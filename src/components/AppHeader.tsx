import React from 'react';
import { Languages } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';

export interface AppHeaderProps {
  activeTab?: 'course-hall' | 'lab-hall' | 'dataset-hall' | 'home';
  activeTenant?: { name: string };
  onNavigate?: (view: any) => void;
  onSwitchTenant?: () => void;
  className?: string;
}

export default function AppHeader({
  activeTab,
  activeTenant = { name: '教育公司' },
  onNavigate,
  onSwitchTenant,
  className = '',
}: AppHeaderProps) {
  return (
    <header className={`bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50 shadow-sm ${className}`}>
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => onNavigate?.('course-hall')}
        >
          <img src="/logo.png" alt="UUSIMA 智慧教学实验平台" className="h-8 object-contain" />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-500">
          <button
            className={`transition-colors cursor-pointer ${activeTab === 'course-hall' ? 'text-blue-500 font-medium' : 'hover:text-blue-500'}`}
            onClick={() => onNavigate?.('course-hall')}
          >
            课程大厅
          </button>
          <button
            className={`transition-colors cursor-pointer ${activeTab === 'lab-hall' ? 'text-blue-500 font-medium' : 'hover:text-blue-500'}`}
            onClick={() => onNavigate?.('lab-hall')}
          >
            实验大厅
          </button>
          <button
            className={`transition-colors cursor-pointer ${activeTab === 'dataset-hall' ? 'text-blue-500 font-medium' : 'hover:text-blue-500'}`}
            onClick={() => onNavigate?.('dataset-hall')}
          >
            数据大厅
          </button>
          <a
            href="https://aixb.nlecloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            AI技能分析系统
          </a>
          <a
            href="https://lct-xy.nlecloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            AI产教融合系统
          </a>
          <a
            href="https://deviceai.nlecloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            硬件智能体系统
          </a>
          <a
            href="#"
            className="hover:text-blue-500 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            考试系统
          </a>
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6 text-sm">
        <button className="flex items-center text-slate-600 hover:text-blue-500 transition-colors cursor-pointer">
          <Languages className="w-4 h-4 mr-1" />
          En
        </button>
        <button
          onClick={() => onNavigate?.('personal')}
          className="text-slate-700 hover:text-blue-500 font-medium transition-colors cursor-pointer"
        >
          我的主页
        </button>

        <UserProfileDropdown
          tenantName={activeTenant.name}
          onNavigate={onNavigate}
          onSwitchTenant={onSwitchTenant}
        />
      </div>
    </header>
  );
}
