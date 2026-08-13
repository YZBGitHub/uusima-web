import React, { useState, useEffect } from 'react';
import { X, Copy, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
}

export default function PortalConfigModal({ isOpen, onClose, tenantId, tenantName }: PortalConfigModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    hideFooter: false,
    enabled: false
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: tenantName,
        hideFooter: false,
        enabled: false
      });
    }
  }, [isOpen, tenantName]);

  if (!isOpen) return null;

  const displayUrl = `https://aiot.nlecloud.com/home/index/2087412292399505410`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 pb-2">
            <h3 className="text-lg font-medium text-slate-800 flex-1 text-center pr-6">门户配置 - {tenantName}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 absolute right-4 top-4">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Form */}
          <div className="p-8 space-y-8">
            <div className="flex items-start">
              <label className="w-32 text-right pr-4 text-sm text-slate-600 pt-1">独立首页地址：</label>
              <div className="flex-1">
                <div className="flex items-center text-sm text-slate-700 mb-2">
                  {displayUrl}
                  <button className="ml-2 text-blue-400 hover:text-blue-500">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-400">此地址可用于学员直接访问该租户门户</div>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right pr-4 text-sm text-slate-600"><span className="text-red-500 mr-1">*</span>门户标题：</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="flex-1 px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-start">
              <label className="w-32 text-right pr-4 text-sm text-slate-600 pt-3"><span className="text-red-500 mr-1">*</span>Logo 图标：</label>
              <div className="flex items-center space-x-3">
                <div className="w-24 h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-300 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors bg-slate-50/50">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>支持 PNG, JPG</div>
                  <div>建议尺寸 120x40</div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <label className="w-32 text-right pr-4 text-sm text-slate-600 pt-2"><span className="text-red-500 mr-1">*</span>网站图标：</label>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-300 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors bg-slate-50/50">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>支持 PNG, ICO, JPG</div>
                  <div>建议 32x32</div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right pr-4 text-sm text-slate-600">隐藏首页底部：</label>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${!formData.hideFooter ? 'text-blue-500' : 'text-slate-400'}`}>否</span>
                <button 
                  onClick={() => setFormData({...formData, hideFooter: !formData.hideFooter})}
                  className={`relative inline-flex h-[22px] w-11 items-center rounded-full transition-colors ${formData.hideFooter ? 'bg-blue-500' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform ${formData.hideFooter ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                </button>
                <span className={`text-sm font-medium ${formData.hideFooter ? 'text-slate-800' : 'text-slate-400'}`}>是</span>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right pr-4 text-sm text-slate-600">启用配置：</label>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${!formData.enabled ? 'text-blue-500' : 'text-slate-400'}`}>否</span>
                <button 
                  onClick={() => setFormData({...formData, enabled: !formData.enabled})}
                  className={`relative inline-flex h-[22px] w-11 items-center rounded-full transition-colors ${formData.enabled ? 'bg-blue-500' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform ${formData.enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                </button>
                <span className={`text-sm font-medium ${formData.enabled ? 'text-slate-800' : 'text-slate-400'}`}>是</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-6 space-x-4 mb-4">
            <button 
              onClick={onClose}
              className="px-10 py-2.5 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors"
            >
              取 消
            </button>
            <button 
              onClick={onClose}
              className="px-10 py-2.5 bg-[#3b82f6] text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              保存配置
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
