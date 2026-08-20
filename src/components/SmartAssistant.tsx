import React, { useState, useRef, useEffect } from 'react';
import { Bot, ChevronRight, MessageCircle, Plus, Paperclip, ArrowUp } from 'lucide-react';

export default function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed right-6 bottom-24 z-[9999]">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Popup */}
      <div 
        ref={popupRef}
        className={`absolute bottom-0 right-0 w-[380px] h-[600px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-[#f2f4f7] px-4 py-3 flex items-center justify-between border-b border-slate-200">
          <div className="flex-1 text-center font-bold text-slate-800 text-lg">
            灵云助手
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header */}
        <div className="flex flex-col items-center pt-6 pb-2">
          <div className="w-12 h-12 bg-[#8b7ff8] rounded-full flex items-center justify-center shadow-md mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM6.5 12.5C6.5 12.5 8.5 15.5 12 15.5C15.5 15.5 17.5 12.5 17.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="font-bold text-slate-800 text-lg">通用助手</h3>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          <div className="flex items-start space-x-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
              <Bot className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-[#3b82f6] text-sm mt-1.5 font-medium">
              欢迎使用通用助手~
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-4 py-3 bg-white">
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center justify-center space-x-1.5 px-3 py-1.5 border border-[#8b7ff8] rounded text-[#8b7ff8] text-xs hover:bg-[#f8f7ff] transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>会话列表</span>
            </button>
            <button className="flex items-center justify-center space-x-1.5 px-3 py-1.5 border border-[#8b7ff8] rounded text-[#8b7ff8] text-xs hover:bg-[#f8f7ff] transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span>新建会话</span>
            </button>
          </div>
          
          {/* Input Area */}
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm relative focus-within:border-[#8b7ff8] transition-colors">
            <textarea 
              placeholder="点击这里开始提问" 
              className="w-full h-24 p-3 text-sm text-slate-700 bg-transparent resize-none outline-none"
            ></textarea>
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <button className="text-slate-500 hover:text-slate-700 p-1">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 rounded-full bg-[#8b7ff8] text-white flex items-center justify-center hover:bg-[#7a6ee6] transition-colors">
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
