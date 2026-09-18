import React, { useState } from "react";
import { CheckCircle, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MobileRegistrationSuccess() {
  const [copied, setCopied] = useState(false);
  const pcUrl = window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(pcUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">注册成功！</h1>

        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
          欢迎加入我们。目前平台的大部分功能专为桌面端优化，移动端暂不支持重度使用。为了获得最佳体验，请在电脑浏览器中访问我们的平台。
        </p>

        <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 relative">
          <div className="text-xs text-slate-500 mb-1 text-left">
            电脑端访问地址
          </div>
          <div className="text-sm font-medium text-slate-800 text-left truncate pr-12">
            {pcUrl}
          </div>
          <button
            onClick={handleCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="复制链接"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center space-x-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>复制网址去电脑端登录</span>
            </>
          )}
        </button>
      </div>

      {/* 提示Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-green-400" />
            <span>地址已复制</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
