import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, UserCircle, Settings, Activity, LogOut, ChevronRight } from 'lucide-react';

export interface UserProfileDropdownProps {
  userName?: string;
  userPhone?: string;
  avatarText?: string;
  tenantName?: string;
  onNavigate?: (view: string) => void;
  onSwitchTenant?: () => void;
  className?: string;
}

export default function UserProfileDropdown({
  userName = '杨振邦',
  userPhone = '15396005420',
  avatarText = '振邦',
  tenantName = '教育公司',
  onNavigate,
  onSwitchTenant,
  className = '',
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
          <User className="w-4 h-4 text-slate-500" />
        </div>
        <span className="text-slate-700 font-medium text-sm">
          {userName}
          <span className="text-slate-400 font-normal text-xs ml-1">({userPhone})</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-100">
          <div className="relative h-12 bg-[#e6f4ff]">
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#f48b8d] text-white flex items-center justify-center font-medium border-[3px] border-white text-sm shadow-sm">
              {avatarText}
            </div>
          </div>
          <div className="pt-8 pb-1">
            <div className="text-center px-4 mb-2">
              <div className="font-medium text-slate-800 text-sm">{userName}</div>
              <div className="text-xs text-slate-400 mt-0.5">{userPhone}</div>
            </div>
            <div className="h-px bg-slate-100 my-2 mx-2"></div>
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.('personal');
              }}
              className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
            >
              <UserCircle className="w-4 h-4 mr-2 text-slate-400" />
              个人设置
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.('config');
              }}
              className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2 text-slate-400" />
              系统管理
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.('platform-operation');
              }}
              className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
            >
              <Activity className="w-4 h-4 mr-2 text-slate-400" />
              平台运营
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.('login');
              }}
              className="w-full flex items-center px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2 text-red-400" />
              退出登录
            </button>
          </div>
          <div className="border-t border-slate-100 px-3 py-3">
            <div className="text-[12px] text-slate-500 mb-2 px-1">组织</div>
            <div className="bg-[#f5f7fa] rounded-md flex items-center justify-between p-2">
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="w-5 h-5 bg-white rounded shadow-sm text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs italic">
                  X
                </div>
                <span className="text-[13px] text-slate-700 truncate">{tenantName}</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSwitchTenant?.();
                }}
                className="text-[12px] text-slate-400 hover:text-blue-500 flex items-center shrink-0 ml-1 transition-colors"
              >
                切换 <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
