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
          <button
            onClick={() => setIsTenantOpen(true)}
            className="flex items-center text-sm mr-4 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span className="font-medium text-slate-700">
              {activeTenant.name}
            </span>
            <ArrowLeftRight className="w-3.5 h-3.5 ml-2 text-slate-400" />
          </button>

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
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-1.5 z-50 overflow-hidden transform origin-top-right">
                <button
                  onClick={() => setActiveMenu("info")}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors bg-blue-50/50"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  个人中心
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button
                  onClick={() => onNavigate && onNavigate("config")}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  系统管理
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button
                  onClick={() => onNavigate && onNavigate("login")}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </button>
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
            {activeMenu === "info" && (
              <div className="p-8 flex flex-col space-y-6 relative">
                {/* 主信息区 */}
                <div className="flex items-center justify-between absolute right-8 top-8 z-0">
                  <div />
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      编辑
                    </button>
                  )}
                </div>

                <div className="flex flex-row pt-8">
                  <div className="flex-1 max-w-xl">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-500 mb-2">
                        账号：
                      </label>
                      <div className="text-slate-900 text-sm py-1">
                        {profileData.account}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-500 mb-2">
                        {isEditingProfile && (
                          <span className="text-red-500 font-bold mr-1">*</span>
                        )}
                        用户名：
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          value={profileData.userName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              userName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-slate-900 text-sm py-1">
                          {profileData.userName}
                        </div>
                      )}
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-500 mb-2">
                        手机号：
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-500 bg-slate-50 focus:outline-none focus:ring-0"
                          readOnly
                          value={profileData.phone}
                        />
                      ) : (
                        <div className="text-slate-900 text-sm py-1">
                          {profileData.phone}
                        </div>
                      )}
                    </div>
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-slate-500 mb-2">
                        {isEditingProfile && (
                          <span className="text-red-500 font-bold mr-1">*</span>
                        )}
                        性别：
                      </label>
                      {isEditingProfile ? (
                        <div className="flex items-center space-x-6 h-10">
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={profileData.gender === "female"}
                              onChange={() =>
                                setProfileData({
                                  ...profileData,
                                  gender: "female",
                                })
                              }
                              className="w-4 h-4 text-blue-500 bg-slate-50 border-slate-300 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="ml-2 text-sm text-slate-700 group-hover:text-slate-900">
                              女
                            </span>
                          </label>
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={profileData.gender === "male"}
                              onChange={() =>
                                setProfileData({
                                  ...profileData,
                                  gender: "male",
                                })
                              }
                              className="w-4 h-4 text-blue-500 bg-slate-50 border-slate-300 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="ml-2 text-sm text-slate-700 group-hover:text-slate-900">
                              男
                            </span>
                          </label>
                        </div>
                      ) : (
                        <div className="text-slate-900 text-sm py-1">
                          {profileData.gender === "female" ? "女" : "男"}
                        </div>
                      )}
                    </div>

                    {isEditingProfile && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setIsEditingProfile(false)}
                          className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-2 rounded text-sm font-medium transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={() =>
                            setConfirmConfig({
                              isOpen: true,
                              title: "确认保存",
                              content: "确定要保存修改后的个人信息吗？",
                              onConfirm: () => {
                                setIsEditingProfile(false);
                              },
                            })
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                        >
                          保存
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="w-64 pl-16">
                    <label className="block text-sm font-medium text-slate-500 mb-4">
                      头像
                    </label>
                    <div className="w-24 h-24 border border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                      {isEditingProfile ? (
                        <span className="text-slate-400 text-3xl font-light leading-none mb-1">
                          +
                        </span>
                      ) : (
                        <User className="text-slate-400 w-12 h-12" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 补充信息：认证与组织 */}
                <div className="mt-8 border-t border-slate-100 flex flex-col md:flex-row gap-8 pt-8">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-bold text-slate-800 flex items-center">
                        <IdCard className="w-5 h-5 mr-2 text-blue-500" />
                        身份认证信息
                      </h3>
                      <button
                        onClick={() =>
                          setProfileData((prev) => ({
                            ...prev,
                            isCertified: !prev.isCertified,
                          }))
                        }
                        className="px-2 py-1 text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors border border-blue-200"
                      >
                        切换状态（演示用）
                      </button>
                    </div>
                    {profileData.isCertified ? (
                      <div className="space-y-4">
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 w-24">姓名：</span>
                          <span className="text-slate-900 font-medium">
                            张三
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 w-24">
                            认证类型：
                          </span>
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium border border-blue-200">
                            教师认证
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 w-24">
                            所属学校：
                          </span>
                          <span className="text-slate-900 font-medium">
                            某某大学
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 w-24">
                            工号/学号：
                          </span>
                          <span
                            className="text-slate-900 font-medium cursor-pointer"
                            title="点击查看详情"
                          >
                            20010******
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 bg-white border border-slate-200 border-dashed rounded-lg shadow-sm">
                        <Shield className="w-10 h-10 text-slate-200 mb-3" />
                        <div className="text-slate-500 text-sm mb-4">
                          暂未完成身份认证
                        </div>
                        <button
                          onClick={() => setActiveMenu("certification")}
                          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          去认证
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-bold text-slate-800 flex items-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-5 h-5 mr-2 text-indigo-500"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        加入的组织
                      </h3>
                      <button
                        onClick={() => setIsOrgRecordsModalOpen(true)}
                        className="text-[#1890ff] text-sm hover:text-blue-700 font-medium transition-colors"
                      >
                        邀请记录
                      </button>
                    </div>
                    {profileData.organizations &&
                    profileData.organizations.length > 0 ? (
                      <div className="space-y-3">
                        {profileData.organizations.map(
                          (org: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                            >
                              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mr-4 shrink-0 border border-indigo-100">
                                {org.name.charAt(0)}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-medium text-slate-900 truncate mb-0.5">
                                  {org.name}
                                </div>
                                <div className="flex items-center text-xs text-slate-500">
                                  {org.status === "pending" ? (
                                    <>
                                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
                                      <span className="text-amber-600 mr-2 font-medium">
                                        审核中
                                      </span>
                                    </>
                                  ) : (
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
                                  )}
                                  {org.role}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 text-xs px-3 py-1.5 hover:bg-blue-50 rounded font-medium transition-colors">
                                  详情
                                </button>
                                <button
                                  onClick={() => {
                                    setOrgToExit(org.name);
                                    setExitOrgCountdown(10);
                                    setExitOrgModalOpen(true);
                                  }}
                                  className="text-red-500 text-xs px-3 py-1.5 hover:bg-red-50 rounded font-medium transition-colors"
                                >
                                  退出
                                </button>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 bg-white border border-slate-200 border-dashed rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-6 h-6 text-slate-300"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div className="text-slate-400 text-sm">
                          暂未加入其他组织
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "certification" && (
              <div className="p-8">
                <Certification />
              </div>
            )}

            {activeMenu === "messages" && (
              <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                  <div className="mb-6">
                    <div className="flex items-end justify-between mb-2">
                      <h1 className="text-2xl font-bold text-slate-800">
                        消息通知
                      </h1>
                    </div>
                    <div className="flex space-x-2 border-b border-slate-200 mt-4">
                      <button
                        onClick={() => setActiveMessageTab("todo")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center -mb-[1px] ${
                          activeMessageTab === "todo"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        待办事项 (待审批)
                        <span className="ml-1.5 min-w-[1.25rem] text-center text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none">
                          12
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveMessageTab("system")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                          activeMessageTab === "system"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        系统通知
                      </button>
                      <button
                        onClick={() => setActiveMessageTab("audit")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-[1px] flex items-center space-x-1.5 ${
                          activeMessageTab === "audit"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>身份认证审核</span>
                        {adminApprovals.filter((a) => a.status === "pending")
                          .length > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {
                              adminApprovals.filter(
                                (a) => a.status === "pending",
                              ).length
                            }
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 内容区域 */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {activeMessageTab === "todo" && (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setTodoCategory("pending");
                                setSelectedTodos([]);
                                setExpandedTodo(null);
                              }}
                              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${todoCategory === "pending" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-200"}`}
                            >
                              待审批
                            </button>
                            <button
                              onClick={() => {
                                setTodoCategory("approved");
                                setSelectedTodos([]);
                                setExpandedTodo(null);
                              }}
                              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${todoCategory === "approved" ? "bg-green-100 text-green-700" : "text-slate-600 hover:bg-slate-200"}`}
                            >
                              已通过
                            </button>
                            <button
                              onClick={() => {
                                setTodoCategory("rejected");
                                setSelectedTodos([]);
                                setExpandedTodo(null);
                              }}
                              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${todoCategory === "rejected" ? "bg-red-100 text-red-700" : "text-slate-600 hover:bg-slate-200"}`}
                            >
                              已驳回
                            </button>
                          </div>
                          {todoCategory === "pending" && (
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                  checked={
                                    selectedTodos.length ===
                                      filteredTodos.length &&
                                    filteredTodos.length > 0
                                  }
                                  onChange={toggleSelectAllTodos}
                                />
                                <span className="text-sm font-medium text-slate-700">
                                  全选
                                </span>
                              </label>
                              <span className="text-sm text-slate-500">
                                已选 {selectedTodos.length} 项
                              </span>
                              <button
                                disabled={selectedTodos.length === 0}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded disabled:bg-blue-300 transition-colors"
                              >
                                批量通过
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="divide-y divide-slate-100">
                          {filteredTodos.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                              暂无数据
                            </div>
                          ) : (
                            filteredTodos.map((todo) => (
                              <div
                                key={todo.id}
                                className="flex flex-col transition-colors hover:bg-slate-50/50"
                              >
                                <div
                                  className="flex items-center p-5 cursor-pointer"
                                  onClick={() =>
                                    setExpandedTodo(
                                      expandedTodo === todo.id ? null : todo.id,
                                    )
                                  }
                                >
                                  {todoCategory === "pending" && (
                                    <div
                                      className="mr-4"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedTodos.includes(
                                          todo.id,
                                        )}
                                        onChange={() =>
                                          toggleTodoSelection(todo.id)
                                        }
                                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0 mr-4">
                                      {todo.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold text-slate-900 truncate">
                                          {todo.name}
                                        </span>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded truncate max-w-[120px]">
                                          {todo.role}
                                        </span>
                                        {todoCategory === "pending" && (
                                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded border border-amber-200">
                                            待审批
                                          </span>
                                        )}
                                        {todoCategory === "approved" && (
                                          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded border border-green-200">
                                            已通过
                                          </span>
                                        )}
                                        {todoCategory === "rejected" && (
                                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                                            已驳回
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-500 mt-1 truncate">
                                        申请角色：{todo.role} | 部门：
                                        {todo.dept} | 类型：{todo.type}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    className="flex items-center space-x-3 ml-4"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {todoCategory === "pending" && (
                                      <>
                                        <button
                                          onClick={() => {
                                            setRejectReason("");
                                            setRejectModalOpen(true);
                                          }}
                                          className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-colors shadow-sm"
                                        >
                                          驳 回
                                        </button>
                                        <button
                                          onClick={() =>
                                            setConfirmConfig({
                                              isOpen: true,
                                              title: "确认通过",
                                              content:
                                                "确定要通过该认证申请吗？",
                                              onConfirm: () => {},
                                            })
                                          }
                                          className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 shadow-sm transition-colors"
                                        >
                                          通 过
                                        </button>
                                      </>
                                    )}
                                    <button className="text-slate-400 hover:text-slate-600 p-1">
                                      <ChevronDown
                                        className={`w-5 h-5 transition-transform ${expandedTodo === todo.id ? "rotate-180" : ""}`}
                                      />
                                    </button>
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {expandedTodo === todo.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden bg-slate-50 border-t border-slate-100"
                                    >
                                      <div className="p-6">
                                        <h4 className="text-sm font-semibold text-slate-800 mb-4">
                                          表单详情
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                          {todo.details.map((detail, idx) => (
                                            <div
                                              key={idx}
                                              className="flex flex-col space-y-1"
                                            >
                                              <span className="text-xs font-medium text-slate-500">
                                                {detail.label}
                                              </span>
                                              <span className="text-sm text-slate-900">
                                                {detail.value}
                                              </span>
                                            </div>
                                          ))}
                                          {todo.status === "rejected" &&
                                            todo.rejectReason && (
                                              <div className="flex flex-col space-y-1 sm:col-span-2">
                                                <span className="text-xs font-medium text-red-500">
                                                  驳回原因
                                                </span>
                                                <span className="text-sm text-slate-900 bg-red-50 p-2 rounded border border-red-100">
                                                  {todo.rejectReason}
                                                </span>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {activeMessageTab === "system" && (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((note) => (
                          <div
                            key={note.id}
                            className="flex items-center p-5 hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="shrink-0 mr-4">
                              {note.type === "success" && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              )}
                              {note.type === "reject" && (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              {note.type === "asset" && (
                                <Gem className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <p className="text-[15px] text-slate-700">
                              {note.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeMessageTab === "audit" && (
                      <div className="divide-y divide-slate-100">
                        <div className="p-4 bg-slate-50 flex items-center space-x-2 border-b border-slate-100">
                          <button
                            onClick={() => setAdminApprovalFilter("school")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${adminApprovalFilter === "school" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-200"}`}
                          >
                            院校认证
                          </button>
                          <button
                            onClick={() => setAdminApprovalFilter("enterprise")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${adminApprovalFilter === "enterprise" ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-slate-200"}`}
                          >
                            企业认证
                          </button>
                        </div>
                        {adminApprovals
                          .filter((a) => a.type === adminApprovalFilter)
                          .map((approval) => (
                            <div
                              key={`approval-${approval.id}`}
                              className="flex flex-col p-5 hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-medium ${approval.type === "school" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}
                                    >
                                      {approval.type === "school"
                                        ? "院校认证"
                                        : "企业认证"}
                                    </span>
                                    <h3 className="font-bold text-slate-800">
                                      {approval.organization}
                                    </h3>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    申请人：{approval.name}{" "}
                                    <span className="mx-2 text-slate-300">
                                      |
                                    </span>{" "}
                                    申请身份：{approval.role}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-2 flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    提交时间：{approval.applyTime}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  {approval.status === "pending" && (
                                    <button
                                      onClick={() =>
                                        setAdminApprovalDetailModal(approval)
                                      }
                                      className="px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                                    >
                                      审 核
                                    </button>
                                  )}
                                  {approval.status === "approved" && (
                                    <span className="text-sm font-medium text-green-600 flex items-center px-3 py-1.5 bg-green-50 rounded-md border border-green-100">
                                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                      已通过
                                    </span>
                                  )}
                                  {approval.status === "rejected" && (
                                    <span
                                      className="text-sm font-medium text-red-600 flex items-center px-3 py-1.5 bg-red-50 rounded-md border border-red-100"
                                      title={approval.rejectReason}
                                    >
                                      <XCircle className="w-4 h-4 mr-1.5" />
                                      已驳回
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        {adminApprovals.filter(
                          (a) => a.type === adminApprovalFilter,
                        ).length === 0 && (
                          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                            <Shield className="w-12 h-12 mb-3 text-slate-200" />
                            <p>暂无待审核的认证信息</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 驳回原因填写弹窗 (Modal) */}
                  <AnimatePresence>
                    {rejectModalOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setRejectModalOpen(false)}
                          className="fixed inset-0 bg-black/50 z-[100]"
                        />
                        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                              type: "spring",
                              damping: 25,
                              stiffness: 300,
                            }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-[480px] overflow-hidden pointer-events-auto"
                          >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                              <h2 className="text-lg font-semibold text-slate-900">
                                填写驳回原因
                              </h2>
                              <button
                                onClick={() => setRejectModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-6">
                              <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2">
                                <span>
                                  驳回原因{" "}
                                  <span className="text-red-500">*</span>
                                </span>
                                <span
                                  className={`text-xs ${rejectReason.length < 50 || rejectReason.length > 200 ? "text-red-500" : "text-slate-500"}`}
                                >
                                  {rejectReason.length} / 200 (需50-200字)
                                </span>
                              </label>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <button
                                  onClick={() =>
                                    setRejectReason(
                                      "您提交的申请信息不完整，缺少平台规定的必要证明材料。请您仔细核对身份认证要求，补充所需的详细信息及证明文件后再次提交审核。",
                                    )
                                  }
                                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition-colors border border-slate-200"
                                >
                                  信息不完整
                                </button>
                                <button
                                  onClick={() =>
                                    setRejectReason(
                                      "系统检测到您的工号/学号验证失败，可能是由于输入有误或对应机构在库名单中未包含该信息。请确认正确的学工号后重新发起申请。",
                                    )
                                  }
                                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition-colors border border-slate-200"
                                >
                                  学工号验证失败
                                </button>
                                <button
                                  onClick={() =>
                                    setRejectReason(
                                      "由于您非本机构（学校/企业）的正式注册人员，暂不符合此身份角色的认证要求。如有特殊情况，请联系机构管理人员确认后重新申请。",
                                    )
                                  }
                                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition-colors border border-slate-200"
                                >
                                  非本机构人员
                                </button>
                              </div>
                              <textarea
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                                className={`w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] resize-y ${(rejectReason.length > 0 && rejectReason.length < 50) || rejectReason.length > 200 ? "border-red-300" : "border-slate-300"}`}
                                placeholder="请输入驳回原因，此内容将反馈给申请人"
                                maxLength={200}
                                required
                              />
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                              <button
                                onClick={() => setRejectModalOpen(false)}
                                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                取消
                              </button>
                              <button
                                disabled={
                                  rejectReason.length < 50 ||
                                  rejectReason.length > 200
                                }
                                onClick={() => {
                                  setRejectModalOpen(false);
                                  setRejectReason("");
                                }}
                                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:bg-red-300 disabled:cursor-not-allowed"
                              >
                                确认驳回
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {activeMenu === "assets" && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-slate-800">
                      我的资源
                    </h1>
                    {activeTenantId === "personal" && (
                      <div className="ml-4 flex items-center space-x-3">
                        <div className="group relative px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-100 flex items-center cursor-help">
                          <Gem className="w-4 h-4 mr-1.5" />
                          当前积分:{" "}
                          <span className="font-bold ml-1">12,500</span>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1.5 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            约等于 12,500 个 Token
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsPointsRecordModalOpen(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                        >
                          积分消耗记录
                        </button>
                      </div>
                    )}
                  </div>
                  {activeTenantId === "personal" && (
                    <div className="flex items-center space-x-3">
                      <button
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-sm group relative"
                        onClick={handleSignClick}
                      >
                        <Gift className="w-4 h-4 mr-1.5" />
                        签到送积分
                        <div className="absolute right-0 top-full mt-2 w-64 px-3 py-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 font-normal truncate">
                          每日登录签到可领取 100 积分奖励
                        </div>
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                          className={`p-2 rounded-lg transition-colors border ${isCalendarOpen ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                          {isCalendarOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl p-5 z-20"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-medium text-slate-800">
                                  2026年 6月
                                </span>
                                <button className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-50">
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
                                <div>日</div>
                                <div>一</div>
                                <div>二</div>
                                <div>三</div>
                                <div>四</div>
                                <div>五</div>
                                <div>六</div>
                              </div>
                              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                <div className="aspect-square flex items-center justify-center rounded-md text-slate-300">
                                  31
                                </div>
                                {Array.from({ length: 30 }).map((_, i) => {
                                  const dayInfo = i + 1;
                                  const dateStr = `2026-06-${dayInfo.toString().padStart(2, "0")}`;
                                  const isSigned =
                                    signedInDates.includes(dateStr);
                                  const isToday = dayInfo === 11;
                                  return (
                                    <div
                                      key={i}
                                      className={`aspect-square flex flex-col items-center justify-center rounded-md relative ${isSigned ? "bg-orange-50 text-orange-600 font-medium border border-orange-100" : isToday ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-slate-600 hover:bg-slate-50"}`}
                                    >
                                      {isSigned && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                      )}
                                      <span>{dayInfo}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center space-x-4 text-xs text-slate-500">
                                <div className="flex items-center">
                                  <div className="w-2.5 h-2.5 bg-orange-400 rounded-full mr-1.5"></div>
                                  已签到
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2.5 h-2.5 bg-blue-100 border border-blue-200 rounded-full mr-1.5"></div>
                                  今日
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>

                {activeTenantId === "personal" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* 算力配额 */}
                    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative">
                      <div className="p-6 flex items-center">
                        <div className="flex-1">
                          <div className="flex flex-row items-center space-x-2 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-500">
                              Token (词元) 数量
                            </h3>
                            <Activity className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex items-baseline space-x-2 mt-2">
                            <div className="text-3xl font-bold text-slate-800">
                              860,666
                            </div>
                            <span className="text-sm font-bold text-slate-600">
                              剩余
                            </span>
                          </div>
                          <div className="text-xs mt-4 space-y-1">
                            <div className="text-slate-500">
                              总计: 1,000,000
                            </div>
                            <div className="text-slate-500 flex items-center gap-1">
                              已使用:{" "}
                              <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                              139,334
                            </div>
                          </div>
                        </div>
                        <div className="w-32 h-32 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "剩余", value: 860666 },
                                  { name: "已使用", value: 139334 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                              >
                                <Cell key="cell-0" fill="#3b82f6" />
                                <Cell key="cell-1" fill="#cbd5e1" />
                              </Pie>
                              <RechartsTooltip
                                formatter={(value: number) =>
                                  value.toLocaleString()
                                }
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                            <span className="text-xs text-blue-600 font-bold">
                              86%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PPT 次数 */}
                    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative">
                      <div className="p-6 flex items-center">
                        <div className="flex-1">
                          <div className="flex flex-row items-center space-x-2 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-500">
                              PPT 生成次数
                            </h3>
                            <FileText className="h-4 w-4 text-purple-500" />
                          </div>
                          <div className="flex items-baseline space-x-2 mt-2">
                            <div className="text-3xl font-bold text-slate-800">
                              80
                            </div>
                            <span className="text-sm font-bold text-slate-600">
                              次 剩余
                            </span>
                          </div>
                          <div className="text-xs mt-4 space-y-1">
                            <div className="text-slate-500">总计: 200 次</div>
                            <div className="text-slate-500 flex items-center gap-1">
                              已使用:{" "}
                              <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                              120 次
                            </div>
                          </div>
                        </div>
                        <div className="w-32 h-32 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "剩余", value: 80 },
                                  { name: "已使用", value: 120 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                              >
                                <Cell key="cell-0" fill="#a855f7" />
                                <Cell key="cell-1" fill="#cbd5e1" />
                              </Pie>
                              <RechartsTooltip
                                formatter={(value: number) => value + " 次"}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                            <span className="text-xs text-purple-600 font-bold">
                              40%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="col-span-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      使用记录
                    </h3>
                    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-3 items-center">
                        <div className="relative">
                          <select
                            value={usageSearchMonth}
                            onChange={(e) =>
                              setUsageSearchMonth(e.target.value)
                            }
                            className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 appearance-none"
                          >
                            {last6Months.map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="按计费项搜索"
                            value={usageItemSearch}
                            onChange={(e) => setUsageItemSearch(e.target.value)}
                            className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                          />
                        </div>
                        <div className="flex items-center space-x-1 ml-2 bg-slate-100/80 p-1 rounded-lg border border-slate-200">
                          {(["token", "duration", "ppt"] as const).map(
                            (type) => (
                              <label
                                key={type}
                                className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${usageTypeFilter === type ? "bg-white shadow-sm text-blue-600 font-medium" : "text-slate-600 hover:text-slate-800"}`}
                              >
                                <input
                                  type="radio"
                                  name="usageType"
                                  value={type}
                                  checked={usageTypeFilter === type}
                                  onChange={(e) =>
                                    setUsageTypeFilter(e.target.value as any)
                                  }
                                  className="hidden"
                                />
                                {type === "token"
                                  ? "Token"
                                  : type === "duration"
                                    ? "时长"
                                    : "PPT"}
                              </label>
                            ),
                          )}
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-4 font-medium">序号</th>
                              <th className="px-6 py-4 font-medium">
                                开始时间
                              </th>
                              <th className="px-6 py-4 font-medium">
                                使用账号
                              </th>
                              <th className="px-6 py-4 font-medium">
                                计费项（环境）
                              </th>
                              <th className="px-6 py-4 font-medium">用量</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {getFilteredAndSortedRecords().map((record) => (
                              <tr
                                key={record.id}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="px-6 py-4 text-slate-600">
                                  {record.id}
                                </td>
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                  {record.startTime}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                  {record.account}
                                </td>
                                <td className="px-6 py-4 text-slate-800 break-words">
                                  {record.item}
                                </td>
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                  {record.type === "token" ? (
                                    <span className="text-blue-600 font-medium">
                                      {record.amount.toLocaleString()} Token(s)
                                    </span>
                                  ) : record.type === "duration" ? (
                                    <span className="text-emerald-600 font-medium">
                                      {record.amount} 分钟
                                    </span>
                                  ) : (
                                    <span className="text-purple-600 font-medium">
                                      {record.amount} 次
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {getFilteredAndSortedRecords().length === 0 && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-6 py-8 text-center text-slate-400"
                                >
                                  没有找到匹配的记录
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "advanced_security" && (
              <div className="p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                  安全设置
                </h1>
                <div className="max-w-4xl divide-y divide-slate-100">
                  <div className="py-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-slate-800 mb-1">
                        绑定手机
                      </h3>
                      <p className="text-sm text-slate-500">
                        186****1001
                        {isPhoneVerified ? (
                          <span className="text-green-600 ml-2">已认证</span>
                        ) : (
                          <span className="text-orange-500 ml-2">未认证</span>
                        )}
                      </p>
                    </div>
                    {!isPhoneVerified && (
                      <button
                        onClick={() => setIsPhoneVerifyModalOpen(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        去认证
                      </button>
                    )}
                  </div>

                  <div className="py-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-slate-800 mb-1">
                        绑定微信
                      </h3>
                      {isWechatBound ? (
                        <p className="text-sm text-slate-500">
                          已绑定{" "}
                          <span className="text-green-600">UUSIMA_User</span>
                        </p>
                      ) : (
                        <p className="text-sm text-slate-500">未绑定</p>
                      )}
                    </div>
                    {isWechatBound ? (
                      <button
                        onClick={() => setIsWechatBound(false)}
                        className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors group relative"
                      >
                        解除绑定
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsWechatModalOpen(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        去绑定
                      </button>
                    )}
                  </div>

                  <div className="py-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-slate-800 mb-1">
                        登录密码
                      </h3>
                      <p className="text-sm text-slate-500">已设置</p>
                    </div>
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      修改
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 手机认证弹窗 */}
      <AnimatePresence>
        {isPhoneVerifyModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPhoneVerifyModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    手机号码认证
                  </h2>
                  <button
                    onClick={() => setIsPhoneVerifyModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        手机号码
                      </label>
                      <input
                        type="text"
                        value="186****1001"
                        disabled
                        className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        验证码
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="请输入验证码"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          maxLength={6}
                          value={verifyCode}
                          onChange={(e) => setVerifyCode(e.target.value)}
                        />
                        <button
                          onClick={handleGetVerifyCode}
                          disabled={verifyCountdown > 0}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {verifyCountdown > 0
                            ? `${verifyCountdown}s 后重试`
                            : "获取验证码"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsPhoneVerifyModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    disabled={!verifyCode}
                    onClick={() => {
                      setIsPhoneVerifyModalOpen(false);
                      setIsPhoneVerified(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    确认认证
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 修改密码弹窗 */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    修改密码
                  </h2>
                  <button
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        旧密码
                      </label>
                      <input
                        type="password"
                        placeholder="请输入旧密码"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        新密码
                      </label>
                      <input
                        type="password"
                        placeholder="设置新密码"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        确认新密码
                      </label>
                      <input
                        type="password"
                        placeholder="再次确认新密码"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setConfirmConfig({
                        isOpen: true,
                        title: "确认修改",
                        content: "确定要提交并修改您的密码吗？",
                        onConfirm: () => {},
                      });
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    确认修改
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 确认提示弹窗 (Confirm Modal) */}
      <AnimatePresence>
        {confirmConfig?.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setConfirmConfig({ ...confirmConfig, isOpen: false })
              }
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {confirmConfig.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {confirmConfig.content}
                  </p>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button
                    onClick={() =>
                      setConfirmConfig({ ...confirmConfig, isOpen: false })
                    }
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      confirmConfig.onConfirm();
                      setConfirmConfig({ ...confirmConfig, isOpen: false });
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    确认
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 身份认证审核弹窗 */}
      <AnimatePresence>
        {adminApprovalDetailModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setAdminApprovalDetailModal(null);
                setRejectReason("");
                setIsRejectingEntity(false);
              }}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    审批认证信息
                  </h2>
                  <button
                    onClick={() => {
                      setAdminApprovalDetailModal(null);
                      setRejectReason("");
                      setIsRejectingEntity(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto w-full text-sm">
                  <div className="grid grid-cols-[100px_1fr] gap-y-4 gap-x-4">
                    {adminApprovalDetailModal.details.map(
                      (detail: any, idx: number) => (
                        <React.Fragment key={idx}>
                          <div className="text-slate-500 text-right">
                            {detail.label}
                          </div>
                          <div className="font-medium text-slate-800">
                            {detail.isAttachment ? (
                              <span className="text-blue-600 flex items-center cursor-pointer hover:underline text-sm">
                                <BadgeCheck className="w-4 h-4 mr-1" />{" "}
                                {detail.value}
                              </span>
                            ) : (
                              detail.value
                            )}
                          </div>
                        </React.Fragment>
                      ),
                    )}
                  </div>

                  {isRejectingEntity && (
                    <div className="mt-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                      <label className="block font-medium text-slate-700 mb-2">
                        驳回原因 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="请输入驳回原因..."
                        autoFocus
                      />
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={() => {
                            setIsRejectingEntity(false);
                            setRejectReason("");
                          }}
                          className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => {
                            if (!rejectReason) {
                              alert("请输入驳回原因");
                              return;
                            }
                            setAdminApprovals((prev) =>
                              prev.map((a) =>
                                a.id === adminApprovalDetailModal.id
                                  ? { ...a, status: "rejected", rejectReason }
                                  : a,
                              ),
                            );
                            setAdminApprovalDetailModal(null);
                            setIsRejectingEntity(false);
                            setRejectReason("");
                          }}
                          className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          确认驳回
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!isRejectingEntity && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
                    <button
                      onClick={() => setIsRejectingEntity(true)}
                      className="px-5 py-2 font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                    >
                      驳 回
                    </button>
                    <button
                      onClick={() => {
                        setAdminApprovals((prev) =>
                          prev.map((a) =>
                            a.id === adminApprovalDetailModal.id
                              ? { ...a, status: "approved" }
                              : a,
                          ),
                        );
                        setAdminApprovalDetailModal(null);
                      }}
                      className="px-5 py-2 font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center"
                    >
                      <Check className="w-4 h-4 mr-1.5" /> 通 过
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 切换组织弹窗 (Modal) */}
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
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
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

      {/* 微信绑定弹窗 */}
      <AnimatePresence>
        {isWechatModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWechatModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    绑定微信
                  </h3>
                  <button
                    onClick={() => setIsWechatModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 flex flex-col items-center">
                  <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center mb-4 border border-slate-200">
                    <div className="grid grid-cols-2 gap-1 w-32 h-32 opacity-20">
                      <div className="bg-slate-800 rounded-tl-lg border-2 border-slate-800"></div>
                      <div className="bg-slate-800 rounded-tr-lg border-2 border-slate-800"></div>
                      <div className="bg-slate-800 rounded-bl-lg border-2 border-slate-800"></div>
                      <div className="bg-slate-800 rounded-br-lg border-2 border-slate-800"></div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm text-center">
                    打开微信扫一扫，关注并绑定
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => {
                      setIsWechatBound(true);
                      setIsWechatModalOpen(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                  >
                    我已扫码绑定
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 退出组织提示弹窗 (Exit Organization Modal) */}
      <AnimatePresence>
        {exitOrgModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExitOrgModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto"
              >
                <div className="p-6 pb-0">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    确认退出组织？
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 whitespace-normal break-words">
                    确定要退出组织{" "}
                    <span className="font-semibold text-slate-800">
                      “{orgToExit}”
                    </span>{" "}
                    吗？
                  </p>
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-6">
                    该操作不可逆，请谨慎处理！
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setExitOrgModalOpen(false);
                      setOrgToExit(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleExitOrg}
                    disabled={exitOrgCountdown > 0}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${exitOrgCountdown > 0 ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    {exitOrgCountdown > 0
                      ? `确定退出 (${exitOrgCountdown}s)`
                      : "确定退出"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 组织申请记录弹窗 */}
      <AnimatePresence>
        {isOrgRecordsModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrgRecordsModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white shadow-xl w-full max-w-6xl h-[80vh] flex flex-col pointer-events-auto rounded-lg overflow-hidden relative"
              >
                {/* Modal Header */}
                <div className="flex-none p-6 pb-4">
                  <h2 className="text-xl font-bold text-slate-800 mb-2">
                    组织申请记录
                  </h2>
                  <p className="text-sm text-slate-500">
                    查看和管理我收到的组织加入邀请记录
                  </p>
                </div>

                {/* Tabs & Controls */}
                <div className="px-6 flex-none bg-white">
                  <div className="border-b border-slate-200">
                    <div className="flex justify-between items-center bg-slate-50 rounded-t-lg">
                      <div className="flex space-x-1 pl-2">
                        {[
                          { id: "all", label: "全部记录" },
                          { id: "pending", label: "待审批" },
                          { id: "approved", label: "已通过" },
                          { id: "rejected", label: "已驳回" },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setOrgRecordsTab(tab.id as any)}
                            className={`py-3 px-6 text-sm font-medium relative transition-colors ${
                              orgRecordsTab === tab.id
                                ? "text-blue-600 bg-white"
                                : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/50"
                            } rounded-t-lg mt-1`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <div className="pr-4">
                        <button className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors relative group">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-6 pb-6">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 sticky top-0 z-10 before:content-[''] before:absolute before:inset-0 before:border-b before:border-slate-200 before:-z-10">
                      <tr>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          组织机构
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          申请人
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          手机号
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          申请时间
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          处理时间
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          状态
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          邀请链接
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          分配角色
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600">
                          驳回原因
                        </th>
                        <th className="px-4 py-3.5 font-medium text-slate-600 bg-slate-50 sticky right-0">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Empty state */}
                      <tr>
                        <td
                          colSpan={10}
                          className="px-4 py-32 text-center text-slate-400"
                        >
                          暂无内容
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setIsOrgRecordsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 积分消耗记录 Modal */}
      <AnimatePresence>
        {isPointsRecordModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
              onClick={() => setIsPointsRecordModalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    积分消耗记录
                  </h3>
                  <button
                    onClick={() => setIsPointsRecordModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto">
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">时间</th>
                          <th className="px-4 py-3">来源/用途</th>
                          <th className="px-4 py-3 text-right">变动</th>
                          <th className="px-4 py-3 text-right">积分</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">
                            2026-06-28 14:30:12
                          </td>
                          <td className="px-4 py-3 text-slate-800">
                            使用 GPT-4 模型生成
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">
                            -500
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500">
                            12,500
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">
                            2026-06-28 09:15:00
                          </td>
                          <td className="px-4 py-3 text-slate-800">
                            每日登录签到
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-green-600">
                            +100
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500">
                            13,000
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">
                            2026-06-27 16:45:22
                          </td>
                          <td className="px-4 py-3 text-slate-800">
                            PPT 模版下载
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">
                            -1,200
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500">
                            12,900
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-600">
                            2026-06-27 08:30:00
                          </td>
                          <td className="px-4 py-3 text-slate-800">
                            每日登录签到
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-green-600">
                            +100
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500">
                            14,100
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 签到成功提示 (Toast) */}
      <AnimatePresence>
        {isSignToastOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3.5 bg-white border border-slate-100 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center space-x-3 pointer-events-none"
          >
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-[15px] font-medium text-slate-800">
                签到成功！
              </div>
              <div className="text-sm text-slate-500 mt-0.5">
                奖励：100 积分
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
