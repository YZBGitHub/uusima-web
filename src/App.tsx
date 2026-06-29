import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ConfigManagement from "./pages/ConfigManagement";
import Personal from "./pages/Personal";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import SchoolLibrary from "./pages/SchoolLibrary";
import TenantManagement from "./pages/TenantManagement";
import PersonalTenantManagement from "./pages/PersonalTenantManagement";
import JoinOrg from "./pages/JoinOrg";
import InviteLanding from "./pages/InviteLanding";
import InviteRecords from "./pages/InviteRecords";
import MobileRegistrationSuccess from "./pages/MobileRegistrationSuccess";

export default function App() {
  const [activeView, setActiveView] = useState<
    | "home"
    | "login"
    | "registration"
    | "certification"
    | "config"
    | "personal"
    | "forgot-password"
    | "profile"
    | "school"
    | "tenant"
    | "personal-tenant"
    | "join-org"
    | "invite-landing"
    | "invite-records"
    | "mobile-success"
  >("login");
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navItems = [
    { id: "home", label: "首页" },
    { id: "login", label: "登录" },
    { id: "registration", label: "用户注册" },
    { id: "config", label: "系统管理" },
    { id: "personal", label: "个人中心" },
    { id: "forgot-password", label: "找回密码" },
    { id: "tenant", label: "租户管理" },
    { id: "personal-tenant", label: "个人租户" },
    { id: "join-org", label: "加入组织" },
    { id: "invite-landing", label: "邀请单页" },
    { id: "school", label: "学校库" },
    { id: "mobile-success", label: "移动端注册成功" },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 侧边原型的全局快速导航 */}
      <div className="fixed left-0 bottom-4 z-[100] flex items-end drop-shadow-xl">
        <div
          className={`bg-white border-y border-r border-slate-200 rounded-tr-xl rounded-br-xl transition-all duration-300 overflow-hidden flex flex-col shadow-inner ${isNavOpen ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
        >
          <div className="py-3 px-2 flex justify-between items-center border-b border-slate-50 shadow-sm">
            <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider">
              页面切换
            </span>
            <button
              onClick={() => setIsNavOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="py-2 px-2 max-h-[70vh] overflow-y-auto no-scrollbar space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as any);
                  setIsNavOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeView === item.id ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="bg-white/90 backdrop-blur-sm border border-slate-200 border-l-0 shadow-lg text-slate-500 rounded-r-lg p-2 hover:text-[#1e80ff] hover:bg-blue-50 transition-all flex items-center justify-center ml-0 translate-y-0 relative z-[101]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* 动态页面渲染内容区域 */}
      <div className="flex-1 relative overflow-x-hidden">
        {activeView === "home" && (
          <Home onNavigate={(view) => setActiveView(view)} />
        )}
        {activeView === "login" && (
          <Login onNavigate={(view) => setActiveView(view)} />
        )}
        {activeView === "registration" && (
          <Registration onNavigate={(view) => setActiveView(view)} />
        )}
        {activeView === "config" && (
          <ConfigManagement onNavigate={(view) => setActiveView(view as any)} />
        )}
        {activeView === "personal" && (
          <Personal onNavigate={(view) => setActiveView(view as any)} />
        )}
        {activeView === "forgot-password" && (
          <ForgotPassword onNavigate={(view) => setActiveView(view)} />
        )}
        {activeView === "school" && <SchoolLibrary />}
        {activeView === "tenant" && <TenantManagement />}
        {activeView === "personal-tenant" && <PersonalTenantManagement />}
        {activeView === "join-org" && <JoinOrg />}
        {activeView === "invite-landing" && (
          <InviteLanding onNavigate={(view) => setActiveView(view)} />
        )}
        {activeView === "invite-records" && <InviteRecords />}
        {activeView === "mobile-success" && <MobileRegistrationSuccess />}
      </div>
    </div>
  );
}
