import React, { useState, useEffect } from "react";
import {
  Bell,
  UserCircle,
  Settings,
  ChevronDown,
  Check,
  LogOut,
  CheckCircle2,
  XCircle,
  Gem,
  X,
  Edit,
  Shield,
  BadgeCheck,
  Activity,
  Clock,
  ArrowLeftRight,
  User,
  IdCard,
  Package,
  Gift,
  Search,
  CalendarDays,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Calendar,
  FileText,
  LayoutGrid,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import Certification from "./Certification";
import PersonalInfo from "./personal/PersonalInfo";
import PersonalMessages from "./personal/PersonalMessages";
import PersonalAssets from "./personal/PersonalAssets";
import PersonalSecurity from "./personal/PersonalSecurity";


const MOCK_USAGE_RECORDS = [
  {
    id: 1,
    startTime: "2026-06-11 09:58:22",
    account: "18033926960",
    item: "AI技能分析系统-AI综合画像",
    usage: "19800 Token(s)",
    type: "token",
    amount: 19800,
  },
  {
    id: 2,
    startTime: "2026-06-10 17:25:05",
    account: "15396005420",
    item: "虚拟仿真实验助手",
    usage: "45 分钟",
    type: "duration",
    amount: 45,
  },
  {
    id: 3,
    startTime: "2026-06-10 15:27:36",
    account: "18033926960",
    item: "AI技能分析系统-生成工具",
    usage: "543 Token(s)",
    type: "token",
    amount: 543,
  },
  {
    id: 4,
    startTime: "2026-06-10 13:45:46",
    account: "13805009731",
    item: "通用助手",
    usage: "335 Token(s)",
    type: "token",
    amount: 335,
  },
  {
    id: 5,
    startTime: "2026-06-10 13:45:43",
    account: "13805009731",
    item: "电子电路虚拟仿真实验",
    usage: "30 分钟",
    type: "duration",
    amount: 30,
  },
  {
    id: 6,
    startTime: "2026-06-09 16:56:43",
    account: "13023112851",
    item: "AI生成PPT",
    usage: "2 次",
    type: "ppt",
    amount: 2,
  },
  {
    id: 7,
    startTime: "2026-06-09 15:24:48",
    account: "13023112851",
    item: "深度学习模型训练虚拟仿真",
    usage: "120 分钟",
    type: "duration",
    amount: 120,
  },
  {
    id: 8,
    startTime: "2026-06-09 14:43:15",
    account: "13023112851",
    item: "AI生成PPT",
    usage: "1 次",
    type: "ppt",
    amount: 1,
  },
  {
    id: 9,
    startTime: "2026-06-09 14:42:53",
    account: "13023112851",
    item: "人工智能前端设备应用实训平台智能体",
    usage: "7110 Token(s)",
    type: "token",
    amount: 7110,
  },
  {
    id: 10,
    startTime: "2026-06-09 14:41:59",
    account: "13023112851",
    item: "人工智能前端设备应用实训平台智能体",
    usage: "7296 Token(s)",
    type: "token",
    amount: 7296,
  },
];

export default function Personal({
  onNavigate,
}: { onNavigate?: (view: string) => void } = {}) {
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<
    | "info"
    | "certification"
    | "messages"
    | "assets"
    | "security"
    | "advanced_security"
  >("info");
  const [activeMessageTab, setActiveMessageTab] = useState<
    "todo" | "invites" | "system" | "audit"
  >("todo");
  const [isPointsRecordModalOpen, setIsPointsRecordModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
  } | null>(null);

  const [todoCategory, setTodoCategory] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [expandedTodo, setExpandedTodo] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoginNameModalOpen, setIsLoginNameModalOpen] = useState(false);
  const [newLoginName, setNewLoginName] = useState("");
  const [profileData, setProfileData] = useState({
    account: "18650094506",
    userName: "林敏学",
    phone: "18650094506",
    gender: "female",
    isCertified: false,
    organizations: [
      { name: "人工智能学院", role: "学生", status: "approved" },
      { name: "软件工程系", role: "学生", status: "pending" },
    ] as Array<{ name: string; role: string; status: "approved" | "pending" }>,
  });

  const [exitOrgModalOpen, setExitOrgModalOpen] = useState(false);
  const [exitOrgCountdown, setExitOrgCountdown] = useState(10);
  const [orgToExit, setOrgToExit] = useState<string | null>(null);

  const [isOrgRecordsModalOpen, setIsOrgRecordsModalOpen] = useState(false);
  const [orgRecordsTab, setOrgRecordsTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (exitOrgModalOpen && exitOrgCountdown > 0) {
      timer = setInterval(() => {
        setExitOrgCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [exitOrgModalOpen, exitOrgCountdown]);

  const handleExitOrg = () => {
    if (orgToExit) {
      setProfileData((prev) => ({
        ...prev,
        organizations: prev.organizations.filter(
          (org) => org.name !== orgToExit,
        ),
      }));
      setExitOrgModalOpen(false);
      setOrgToExit(null);
    }
  };

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPhoneVerifyModalOpen, setIsPhoneVerifyModalOpen] = useState(false);
  const [verifyCountdown, setVerifyCountdown] = useState(0);
  const [verifyCode, setVerifyCode] = useState("");

  const handleGetVerifyCode = () => {
    setVerifyCountdown(60);
    const timer = setInterval(() => {
      setVerifyCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const [adminApprovalFilter, setAdminApprovalFilter] = useState<
    "school" | "enterprise"
  >("school");
  const [adminApprovalDetailModal, setAdminApprovalDetailModal] = useState<
    any | null
  >(null);

  const [isWechatBound, setIsWechatBound] = useState(true);
  const [isWechatModalOpen, setIsWechatModalOpen] = useState(false);

  const [isVerifyingLoginName, setIsVerifyingLoginName] = useState(false);
  const [verifyLoginNameStatus, setVerifyLoginNameStatus] = useState<
    "success" | "error" | "idle"
  >("idle");

  // Assets usage records state
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date("2026-06-11");
    d.setMonth(d.getMonth() - i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [usageSearchMonth, setUsageSearchMonth] = useState(last6Months[0]);
  const [usageItemSearch, setUsageItemSearch] = useState("");
  const [usageTypeFilter, setUsageTypeFilter] = useState<
    "token" | "duration" | "ppt"
  >("token");

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date("2026-06-11"));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const signedInDates = [
    "2026-06-01",
    "2026-06-05",
    "2026-06-08",
    "2026-06-10",
    "2026-06-11",
  ];

  const getFilteredAndSortedRecords = () => {
    let result = [...MOCK_USAGE_RECORDS];
    if (usageSearchMonth) {
      result = result.filter((r) => r.startTime.startsWith(usageSearchMonth));
    }
    if (usageItemSearch) {
      result = result.filter((r) => r.item.includes(usageItemSearch));
    }
    if (usageTypeFilter) {
      result = result.filter((r) => r.type === usageTypeFilter);
    }
    return result;
  };

  const handleVerifyLoginName = () => {
    if (!newLoginName) return;
    setIsVerifyingLoginName(true);
    setVerifyLoginNameStatus("idle");
    setTimeout(() => {
      setIsVerifyingLoginName(false);
      if (newLoginName === "admin" || newLoginName === "test") {
        setVerifyLoginNameStatus("error");
      } else {
        setVerifyLoginNameStatus("success");
      }
    }, 800);
  };

  // 待办事项
  const todos = [
    {
      id: 1,
      type: "教师认证",
      template: "cert",
      name: "张三",
      role: "教师",
      dept: "计算机科学学院",
      avatar: "张",
      status: "pending",
      details: [
        { label: "姓名", value: "张三" },
        { label: "工号", value: "T2023001" },
        { label: "职称", value: "副教授" },
        { label: "研究方向", value: "人工智能" },
        { label: "申请时间", value: "2026-05-13 14:00" },
      ],
    },
    {
      id: 2,
      type: "学生认证",
      template: "cert",
      name: "李四",
      role: "学生",
      dept: "软件工程系",
      avatar: "李",
      status: "pending",
      details: [
        { label: "姓名", value: "李四" },
        { label: "学号", value: "S2024001" },
        { label: "年级", value: "大二" },
        { label: "班级", value: "软件工程2班" },
        { label: "申请时间", value: "2026-05-13 15:30" },
      ],
    },
    {
      id: 3,
      type: "加入申请",
      template: "link",
      name: "王五",
      role: "企业员工",
      dept: "研发中心二部",
      avatar: "王",
      status: "approved",
      details: [
        { label: "姓名", value: "王五" },
        { label: "邀请人", value: "李总" },
        { label: "备注", value: "已开通相关权限组" },
        { label: "审批时间", value: "2026-05-12 10:00" },
      ],
    },
    {
      id: 4,
      type: "教师认证",
      template: "cert",
      name: "陈六",
      role: "教师",
      dept: "物理学院",
      avatar: "陈",
      status: "rejected",
      rejectReason:
        "提交的证明文件不足，请提供手持工牌照片或加盖公章的在职证明。",
      details: [
        { label: "姓名", value: "陈六" },
        { label: "工号", value: "T2022099" },
        { label: "申请时间", value: "2026-05-11 09:12" },
      ],
    },
  ];

  const filteredTodos = todos.filter((t) => t.status === todoCategory);

  const toggleTodoSelection = (id: number) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAllTodos = () => {
    if (
      selectedTodos.length === filteredTodos.length &&
      filteredTodos.length > 0
    ) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(filteredTodos.map((t) => t.id));
    }
  };

  // 组织邀请
  const invites = [
    { id: 1, org: "新大陆时代科技", role: "企业员工", expire: "2026-12-31" },
  ];

  // 系统通知
  const notifications = [
    { id: 1, type: "success", message: "您的教师认证申请已通过" },
    {
      id: 2,
      type: "reject",
      message: "您的企业员工申请被驳回。原因：职位信息与实际不符",
    },
    {
      id: 3,
      type: "asset",
      message: "UUSIMA 游客体验套餐已下发（100w Token, 100分钟）",
    },
    { id: 4, type: "success", message: "您提交的学生角色认证申请已通过" },
    {
      id: 5,
      type: "reject",
      message:
        "您加入【复旦大学 - 计算机系】的申请被驳回。原因：未在新生名单中找到您的信息",
    },
    { id: 6, type: "success", message: "您已成功加入组织【新大陆时代科技】" },
  ];

  const tenants = [
    { id: "personal", name: "个人", status: "active" },
    {
      id: "school",
      name: "福建信息职业技术学院",
      role: "教师",
      status: "active",
    },
    {
      id: "enterprise",
      name: "新大陆时代科技有限公司",
      role: "企业员工",
      status: "active",
    },
  ];
  const [activeTenantId, setActiveTenantId] = useState("personal");

  const activeTenant =
    tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const [isRejectingEntity, setIsRejectingEntity] = useState(false);

  const [adminApprovals, setAdminApprovals] = useState([
    {
      id: 1,
      name: "王小明",
      role: "院校管理员",
      type: "school",
      organization: "北京大学",
      phone: "13800138000",
      applyTime: "2026-05-14 10:20",
      status: "pending",
      details: [
        { label: "姓名", value: "王小明" },
        { label: "手机号", value: "13800138000" },
        { label: "工号", value: "T10001" },
        { label: "凭证记录", value: "上传了相关证明文档", isAttachment: true },
        { label: "申请院校", value: "北京大学" },
        { label: "所在部门", value: "教务处" },
        { label: "职位", value: "处长" },
      ],
    },
    {
      id: 2,
      name: "李建国",
      role: "企业管理员",
      type: "enterprise",
      organization: "腾讯科技",
      phone: "13900139000",
      applyTime: "2026-05-14 11:30",
      status: "pending",
      details: [
        { label: "姓名", value: "李建国" },
        { label: "手机号", value: "13900139000" },
        { label: "工号", value: "E20002" },
        { label: "营业执照", value: "已上传电子版照片", isAttachment: true },
        { label: "申请企业", value: "腾讯科技" },
        { label: "所在部门", value: "人力资源部" },
        { label: "职位", value: "总监" },
      ],
    },
    {
      id: 3,
      name: "张伟",
      role: "教师",
      type: "school",
      organization: "复旦大学",
      phone: "13700137000",
      applyTime: "2026-05-13 09:15",
      status: "approved",
      details: [
        { label: "姓名", value: "张伟" },
        { label: "手机号", value: "13700137000" },
        { label: "工号", value: "T10023" },
        {
          label: "凭证记录",
          value: "教师资格证复印件.png",
          isAttachment: true,
        },
        { label: "申请院校", value: "复旦大学" },
        { label: "所在部门", value: "计算机学院" },
        { label: "职位", value: "副教授" },
      ],
    },
    {
      id: 4,
      name: "刘洋",
      role: "企业员工",
      type: "enterprise",
      organization: "阿里巴巴",
      phone: "13600136000",
      applyTime: "2026-05-12 16:45",
      status: "rejected",
      rejectReason: "提交的在职证明已过期，请重新上传。",
      details: [
        { label: "姓名", value: "刘洋" },
        { label: "手机号", value: "13600136000" },
        { label: "工号", value: "E30991" },
        { label: "凭证记录", value: "在职证明_2025.pdf", isAttachment: true },
        { label: "申请企业", value: "阿里巴巴" },
        { label: "所在部门", value: "技术部" },
        { label: "职位", value: "高级开发工程师" },
      ],
    },
    {
      id: 5,
      name: "陈辰",
      role: "学生",
      type: "school",
      organization: "上海交通大学",
      phone: "13500135000",
      applyTime: "2026-05-11 14:20",
      status: "rejected",
      rejectReason: "未找到该学号信息，请核对。",
      details: [
        { label: "姓名", value: "陈辰" },
        { label: "手机号", value: "13500135000" },
        { label: "学号", value: "S2023001" },
        { label: "凭证记录", value: "学生证照.jpg", isAttachment: true },
        { label: "申请院校", value: "上海交通大学" },
        { label: "所在部门", value: "机电学院" },
        { label: "职位", value: "学生" },
      ],
    },
  ]);

  const [isSignToastOpen, setIsSignToastOpen] = useState(false);

  const handleSignClick = () => {
    setIsSignToastOpen(true);
    setTimeout(() => {
      setIsSignToastOpen(false);
    }, 2500);
  };

  return (
    <div className="absolute inset-0 flex flex-col font-sans bg-[#eef1f6]">
      {/* 顶部: 顶栏 (Navbar) */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center space-x-6">
          {/* 快速访问 */}
          <div className="group relative">
            <button className="flex items-center justify-center p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors focus:outline-none">
              <LayoutGrid className="w-5 h-5" />
            </button>
            <div className="absolute left-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="w-48 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 overflow-hidden relative">
                <div className="absolute -top-1 left-3 w-2 h-2 bg-white border-t border-l border-slate-100 rotate-45"></div>
                <a
                  href="https://lct-lht.nlecloud.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  陆产通
                </a>
                <a
                  href="https://aiot.nlecloud.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  UUSIMA
                </a>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate && onNavigate("home")}
          >
            <div
              className="w-7 h-7 flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br from-blue-500 to-indigo-600 rounded"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              N
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              Newland EDU
            </span>
          </div>
          <div className="w-px h-5 bg-slate-200"></div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              个人中心
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center text-sm font-medium text-slate-600 cursor-pointer focus:outline-none"
            >
              林敏学{" "}
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden transform origin-top-right">
                <div className="relative h-12 bg-[#e6f4ff]">
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#f48b8d] text-white flex items-center justify-center font-medium border-[3px] border-white text-sm shadow-sm">
                    林敏
                  </div>
                </div>
                <div className="pt-8 pb-1">
                  <div className="text-center px-4 mb-2">
                    <div className="font-medium text-slate-800 text-sm">林敏学</div>
                    <div className="text-xs text-slate-400 mt-0.5">15396005420</div>
                  </div>
                  <div className="h-px bg-slate-100 my-2 mx-2"></div>
                  <button 
                    onClick={() => setActiveMenu('info')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    个人设置
                  </button>
                  <button 
                    onClick={() => typeof onNavigate !== 'undefined' && onNavigate('config')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    系统管理
                  </button>
                  <button 
                    onClick={() => typeof onNavigate !== 'undefined' && onNavigate('platform-operation')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    平台运营
                  </button>
                  <button 
                    onClick={() => typeof onNavigate !== 'undefined' && onNavigate('login')}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </button>
                </div>
                <div className="border-t border-slate-100 px-3 py-3">
                  <div className="text-[12px] text-slate-500 mb-2 px-1">组织</div>
                  <div className="bg-[#f5f7fa] rounded flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="w-5 h-5 bg-white rounded shadow-sm text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs italic">
                        X
                      </div>
                      <span className="text-[13px] text-slate-700 truncate">{typeof activeTenant !== 'undefined' && activeTenant ? activeTenant.name : "教育公司"}</span>
                    </div>
                    <button 
                      onClick={() => { setIsUserMenuOpen(false); typeof setIsTenantOpen !== 'undefined' && setIsTenantOpen(true); }}
                      className="text-[12px] text-slate-400 hover:text-blue-500 flex items-center shrink-0"
                    >
                      切换 <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 下方布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧侧边栏 */}
        <aside className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col py-4 shrink-0">
          <nav className="flex-1 space-y-2">
            <div>
              <div className="px-8 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                账户设置
              </div>
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => setActiveMenu("info")}
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === "info" ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  <User
                    className={`w-4 h-4 mr-3 ${activeMenu === "info" ? "text-blue-600" : "text-slate-500"}`}
                  />{" "}
                  个人信息
                </button>
                <button
                  onClick={() => setActiveMenu("certification")}
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === "certification" ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  <IdCard
                    className={`w-4 h-4 mr-3 ${activeMenu === "certification" ? "text-blue-600" : "text-slate-500"}`}
                  />{" "}
                  身份认证
                </button>
                <button
                  onClick={() => setActiveMenu("advanced_security")}
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === "advanced_security" ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  <Shield
                    className={`w-4 h-4 mr-3 ${activeMenu === "advanced_security" ? "text-blue-600" : "text-slate-500"}`}
                  />{" "}
                  安全认证
                </button>
              </div>
            </div>
            <div className="pt-2">
              <div className="px-8 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                资源管理
              </div>
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => setActiveMenu("assets")}
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === "assets" ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  <Package
                    className={`w-4 h-4 mr-3 ${activeMenu === "assets" ? "text-blue-600" : "text-slate-500"}`}
                  />{" "}
                  我的资源
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* 右侧主内容区 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#eef1f6]">
          <div className="min-h-full bg-white border border-slate-200 rounded">
            {activeMenu === "info" && <PersonalInfo profileData={profileData} setProfileData={setProfileData} setIsEditingProfile={setIsEditingProfile} isEditingProfile={isEditingProfile} setConfirmConfig={setConfirmConfig} setIsOrgRecordsModalOpen={setIsOrgRecordsModalOpen} setOrgToExit={setOrgToExit} setExitOrgCountdown={setExitOrgCountdown} setExitOrgModalOpen={setExitOrgModalOpen} onNavigate={onNavigate} />}
            {activeMenu === "certification" && (
              <div className="p-8">
                <Certification />
              </div>
            )}
            {activeMenu === "messages" && <PersonalMessages activeMessageTab={activeMessageTab} setActiveMessageTab={setActiveMessageTab} todoCategory={todoCategory} setTodoCategory={setTodoCategory} selectedTodos={selectedTodos} toggleSelectAllTodos={toggleSelectAllTodos} toggleTodoSelection={toggleTodoSelection} filteredTodos={filteredTodos} expandedTodo={expandedTodo} setExpandedTodo={setExpandedTodo} setRejectModalOpen={setRejectModalOpen} setConfirmConfig={setConfirmConfig} invites={invites} notifications={notifications} adminApprovalFilter={adminApprovalFilter} setAdminApprovalFilter={setAdminApprovalFilter} adminApprovals={adminApprovals} adminApprovalDetailModal={adminApprovalDetailModal} setAdminApprovalDetailModal={setAdminApprovalDetailModal} isRejectingEntity={isRejectingEntity} setIsRejectingEntity={setIsRejectingEntity} rejectReason={rejectReason} setRejectReason={setRejectReason} />}
            {activeMenu === "assets" && <PersonalAssets usageSearchMonth={usageSearchMonth} setUsageSearchMonth={setUsageSearchMonth} last6Months={last6Months} usageItemSearch={usageItemSearch} setUsageItemSearch={setUsageItemSearch} usageTypeFilter={usageTypeFilter} setUsageTypeFilter={setUsageTypeFilter} getFilteredAndSortedRecords={getFilteredAndSortedRecords} setIsPointsRecordModalOpen={setIsPointsRecordModalOpen} isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} calendarDate={calendarDate} setCalendarDate={setCalendarDate} signedInDates={signedInDates} handleSignClick={handleSignClick} isSignToastOpen={isSignToastOpen} />}
            {activeMenu === "advanced_security" && <PersonalSecurity profileData={profileData} isPhoneVerified={isPhoneVerified} setIsPhoneVerifyModalOpen={setIsPhoneVerifyModalOpen} isWechatBound={isWechatBound} setIsWechatModalOpen={setIsWechatModalOpen} setIsPasswordModalOpen={setIsPasswordModalOpen} />}
          </div>
          

        </main>
      </div>

      {/* 模态框区域 */}
      <AnimatePresence>
        {isTenantOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTenantOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                    <ArrowLeftRight className="w-5 h-5 text-blue-600 mr-2" />
                    切换组织
                  </h2>
                  <button
                    onClick={() => setIsTenantOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-2 space-y-1">
                  {tenants.map((tenant) => {
                    const isActive = tenant.id === activeTenantId;
                    const isPending = tenant.status === "pending";
                    return (
                      <button
                        key={tenant.id}
                        onClick={() => {
                          if (!isPending) {
                            setActiveTenantId(tenant.id);
                            setIsTenantOpen(false);
                          }
                        }}
                        disabled={isPending}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : isPending
                              ? "text-slate-400 cursor-not-allowed opacity-70"
                              : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center">
                          {tenant.name}
                          {tenant.role && (
                            <span
                              className={`${isActive ? "text-blue-500/70" : isPending ? "text-slate-300" : "text-slate-400"} ml-1.5`}
                            >
                              ({tenant.role})
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        )}
                        {isPending && (
                          <span className="text-xs font-medium px-2 py-0.5 bg-orange-50 text-orange-500 rounded border border-orange-100">
                            审核中
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
