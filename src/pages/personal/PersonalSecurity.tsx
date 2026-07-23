import React, { useState } from "react";
import { Shield, BadgeCheck, CheckCircle2, UserCircle } from "lucide-react";

export default function PersonalSecurity({ 
  profileData, isPhoneVerified, setIsPhoneVerifyModalOpen, isWechatBound, setIsWechatModalOpen, setIsPasswordModalOpen
}: any) {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6">安全认证</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <div className="font-medium text-slate-800">修改密码</div>
              <div className="text-sm text-slate-500">定期修改密码有助于保护账号安全</div>
            </div>
          </div>
          <button className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors">修改</button>
        </div>
      </div>
    </div>
  );
}
