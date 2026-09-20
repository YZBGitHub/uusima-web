import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  Settings2, 
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff, 
  Archive, 
  Power, 
  Sparkles,
  Bot,
  Layers,
  Cpu,
  Terminal,
  Box,
  Monitor,
  Database,
  Activity,
  Droplets,
  HeartPulse,
  Play
} from 'lucide-react';

export type LabCategory = '全部' | '平台型' | '容器型' | '虚拟系统' | '组合型';

export interface LabItem {
  id: string;
  order: number;
  name: string;
  type: '平台型' | '容器型' | '虚拟系统' | '组合型';
  status: '启用' | '禁用';
  hallVisibility: '显示' | '隐藏';
  allowCustomCourse: boolean; // 是否允许自定义课程使用
  createTime: string;
  iconType: string;
  iconBg?: string;
  isArchived?: boolean;
  cpu?: string;
  memory?: string;
  image?: string;
  desc?: string;
}

// 对应截图前10条真实数据 + 扩充至共59条
const INITIAL_LABS: LabItem[] = [
  {
    id: 'lab-1',
    order: 1,
    name: '工程虚拟仿真',
    type: '平台型',
    status: '启用',
    hallVisibility: '显示',
    allowCustomCourse: true,
    createTime: '2024-02-18 18:19:11',
    iconType: 'simulation-engine',
    cpu: '4 核',
    memory: '8 GB',
    desc: '三维数字孪生与工程虚拟仿真实验环境'
  },
  {
    id: 'lab-2',
    order: 2,
    name: '3D应用设计器',
    type: '平台型',
    status: '启用',
    hallVisibility: '显示',
    allowCustomCourse: true,
    createTime: '2024-02-18 18:27:15',
    iconType: '3d-designer',
    cpu: '8 核',
    memory: '16 GB',
    desc: '基于WebGL的多视角三维场景搭建环境'
  },
  {
    id: 'lab-3',
    order: 4,
    name: '嵌入式仿真',
    type: '平台型',
    status: '启用',
    hallVisibility: '显示',
    allowCustomCourse: true,
    createTime: '2024-02-19 09:10:35',
    iconType: 'embedded-sim',
    cpu: '4 核',
    memory: '8 GB',
    desc: 'ARM/RISC-V 虚拟硬件架构与逻辑信号仿真'
  },
  {
    id: 'lab-4',
    order: 6,
    name: '2D应用设计器',
    type: '平台型',
    status: '启用',
    hallVisibility: '显示',
    allowCustomCourse: true,
    createTime: '2024-09-19 18:13:10',
    iconType: '2d-designer',
    cpu: '2 核',
    memory: '4 GB',
    desc: '工业组态与2D人机交互设计引擎'
  },
  {
    id: 'lab-5',
    order: 1,
    name: '智慧水务',
    type: '平台型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2024-09-19 18:13:57',
    iconType: 'smart-water',
    cpu: '4 核',
    memory: '8 GB',
    desc: '智慧水处理管网水质监控与调度实训环境'
  },
  {
    id: 'lab-6',
    order: 1,
    name: '智慧健康',
    type: '平台型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2024-09-19 18:14:21',
    iconType: 'smart-health',
    cpu: '4 核',
    memory: '8 GB',
    desc: '智能穿戴健康监测与医疗数据分析实训平台'
  },
  {
    id: 'lab-7',
    order: 1,
    name: '案例题',
    type: '平台型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: false,
    createTime: '2025-05-16 17:35:39',
    iconType: 'case-cube',
    cpu: '2 核',
    memory: '4 GB',
    desc: '综合工程案例解析与交互测评沙箱'
  },
  {
    id: 'lab-8',
    order: 1,
    name: '大数据',
    type: '容器型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2025-05-20 20:01:06',
    iconType: 'big-data',
    cpu: '8 核',
    memory: '32 GB',
    desc: 'Spark/Hadoop 分布式大数据分析容器集群'
  },
  {
    id: 'lab-9',
    order: 1,
    name: '智能BI',
    type: '平台型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2025-06-06 11:54:36',
    iconType: 'bi-rect',
    cpu: '4 核',
    memory: '16 GB',
    desc: '商业智能数据大屏建模与多维报表分析平台'
  },
  {
    id: 'lab-10',
    order: 1,
    name: '物联网实验环境',
    type: '容器型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2025-09-19 20:53:06',
    iconType: 'iot-mesh',
    cpu: '4 核',
    memory: '8 GB',
    desc: 'MQTT/CoAP 多协议终端传感器网络模拟环境'
  },
  // 扩充数据至共59条（支持分页）
  {
    id: 'lab-11',
    order: 2,
    name: '人工智能平台-Jupyter',
    type: '容器型',
    status: '启用',
    hallVisibility: '显示',
    allowCustomCourse: true,
    createTime: '2024-03-01 10:20:15',
    iconType: 'ai-jupyter',
    cpu: '8 核',
    memory: '32 GB',
    desc: '预置 PyTorch/TensorFlow GPU 加速容器环境'
  },
  {
    id: 'lab-12',
    order: 3,
    name: '工业互联网边缘网关',
    type: '虚拟系统',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2024-03-12 14:15:30',
    iconType: 'gateway-sys',
    cpu: '4 核',
    memory: '8 GB',
    desc: '虚拟边缘计算Linux系统与Modbus设备总线仿真'
  },
  {
    id: 'lab-13',
    order: 5,
    name: 'Renode目标机组合实训',
    type: '组合型',
    status: '启用',
    hallVisibility: '显示',
    allowCustomCourse: true,
    createTime: '2024-04-05 09:40:22',
    iconType: 'combo-renode',
    cpu: '6 核',
    memory: '16 GB',
    desc: '多节点Renode联合仿真与自动化评测系统'
  },
  {
    id: 'lab-14',
    order: 7,
    name: 'Ubuntu 22.04 深度学习镜像',
    type: '虚拟系统',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2024-04-18 16:55:10',
    iconType: 'ubuntu-sys',
    cpu: '8 核',
    memory: '32 GB',
    desc: '纯净版 Linux 系统实验环境，支持桌面远程连接'
  },
  {
    id: 'lab-15',
    order: 8,
    name: 'WebIDE 代码工作台',
    type: '容器型',
    status: '启用',
    hallVisibility: '显示',
    allowCustomCourse: true,
    createTime: '2024-05-02 11:30:00',
    iconType: 'vscode-ide',
    cpu: '2 核',
    memory: '4 GB',
    desc: '基于 VS Code Server 的云端轻量级编程环境'
  },
  {
    id: 'lab-16',
    order: 9,
    name: '自动驾驶传感器仿真',
    type: '平台型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2024-05-19 15:20:45',
    iconType: 'auto-drive',
    cpu: '16 核',
    memory: '32 GB',
    desc: '激光雷达点云与视觉摄像头融合实训'
  },
  {
    id: 'lab-17',
    order: 10,
    name: '区块链智能合约沙盒',
    type: '容器型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2024-06-08 17:10:33',
    iconType: 'blockchain-sand',
    cpu: '4 核',
    memory: '8 GB',
    desc: 'Solidity 编译器与私有以太坊测试链容器'
  },
  {
    id: 'lab-18',
    order: 11,
    name: 'PLC工业自动化控制仿真',
    type: '组合型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2024-06-25 13:45:12',
    iconType: 'plc-control',
    cpu: '4 核',
    memory: '8 GB',
    desc: '梯形图编程与虚拟三维流水线联合联动环境'
  },
  {
    id: 'lab-19',
    order: 12,
    name: '网络安全渗透靶场',
    type: '虚拟系统',
    status: '禁用',
    hallVisibility: '隐藏',
    allowCustomCourse: false,
    createTime: '2024-07-14 08:30:00',
    iconType: 'cyber-sec',
    cpu: '4 核',
    memory: '8 GB',
    desc: '预置漏洞场景的多网段隔离攻击防御实训'
  },
  {
    id: 'lab-20',
    order: 13,
    name: '鸿蒙HarmonyOS分布式开发',
    type: '容器型',
    status: '启用',
    hallVisibility: '隐藏',
    allowCustomCourse: true,
    createTime: '2024-07-28 19:12:44',
    iconType: 'harmony-dev',
    cpu: '8 核',
    memory: '16 GB',
    desc: 'ArkTS 语言实训与鸿蒙虚拟设备模拟器'
  },
  // 生成余下至59条
  ...Array.from({ length: 39 }, (_, index) => {
    const num = index + 21;
    const types: ('平台型' | '容器型' | '虚拟系统' | '组合型')[] = ['平台型', '容器型', '虚拟系统', '组合型'];
    const names = [
      '机器人运动学仿真', '智慧物流分拣沙盘', '机器视觉表面质检', '自然语言微调实训',
      '微服务网格容器群', '数字电路EDA仿真', '云计算OpenStack虚拟云', '低代码应用搭建台',
      '5G核心网协议分析', '虚拟现实沉浸式课堂', '无人机编队飞行模拟', '声学降噪信号处理',
      '智能电网调度仿真', '生物信息基因测序分析', '金融高频交易量化回测'
    ];
    const name = `${names[index % names.length]}_v${Math.floor(index / 10) + 1}.${num % 5}`;
    const selectedType = types[index % types.length];
    const isVisible = index % 4 === 0;

    return {
      id: `lab-${num}`,
      order: (num % 8) + 1,
      name,
      type: selectedType,
      status: (num % 9 === 0 ? '禁用' : '启用') as '启用' | '禁用',
      hallVisibility: (isVisible ? '显示' : '隐藏') as '显示' | '隐藏',
      allowCustomCourse: index % 6 !== 0,
      createTime: `2024-${String(Math.floor(index / 5) + 1).padStart(2, '0')}-${String((index % 25) + 1).padStart(2, '0')} 14:${String(index).padStart(2, '0')}:28`,
      iconType: 'default-sim',
      cpu: '4 核',
      memory: '8 GB',
      desc: `${name} 专项实训与评测实验环境`
    };
  })
];

export default function LabManagement() {
  const [labs, setLabs] = useState<LabItem[]>(INITIAL_LABS);
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>('全部');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // 高级筛选状态
  const [filterStatus, setFilterStatus] = useState<'全部' | '启用' | '禁用'>('全部');
  const [filterVisibility, setFilterVisibility] = useState<'全部' | '显示' | '隐藏'>('全部');
  const [filterCustomCourse, setFilterCustomCourse] = useState<'全部' | '允许' | '禁止'>('全部');

  // 排序状态
  const [sortField, setSortField] = useState<'order' | 'createTime' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [gotoPageInput, setGotoPageInput] = useState('');

  // 模态框状态
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showEnterModal, setShowEnterModal] = useState(false);
  const [currentSelectedLab, setCurrentSelectedLab] = useState<LabItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 添加表单状态
  const [formData, setFormData] = useState({
    name: '',
    type: '平台型' as '平台型' | '容器型' | '虚拟系统' | '组合型',
    order: 1,
    status: '启用' as '启用' | '禁用',
    hallVisibility: '隐藏' as '显示' | '隐藏',
    allowCustomCourse: true,
    cpu: '4 核',
    memory: '8 GB',
    desc: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // 过滤与排序
  const filteredLabs = useMemo(() => {
    return labs.filter(item => {
      if (selectedCategory !== '全部' && item.type !== selectedCategory) {
        return false;
      }
      if (searchKeyword.trim() && !item.name.toLowerCase().includes(searchKeyword.trim().toLowerCase())) {
        return false;
      }
      if (filterStatus !== '全部' && item.status !== filterStatus) {
        return false;
      }
      if (filterVisibility !== '全部' && item.hallVisibility !== filterVisibility) {
        return false;
      }
      if (filterCustomCourse === '允许' && !item.allowCustomCourse) {
        return false;
      }
      if (filterCustomCourse === '禁止' && item.allowCustomCourse) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === 'order') {
        return sortOrder === 'asc' ? a.order - b.order : b.order - a.order;
      }
      if (sortField === 'createTime') {
        return sortOrder === 'asc' 
          ? new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
          : new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      }
      return 0;
    });
  }, [labs, selectedCategory, searchKeyword, filterStatus, filterVisibility, sortField, sortOrder]);

  // 分页数据
  const totalItems = filteredLabs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedLabs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLabs.slice(start, start + pageSize);
  }, [filteredLabs, currentPage, pageSize]);

  // 切换排序
  const handleSort = (field: 'order' | 'createTime') => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortField(null);
        setSortOrder('asc');
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 切换大厅发布状态
  const handleTogglePublish = (labId: string) => {
    setLabs(prev => prev.map(lab => {
      if (lab.id === labId) {
        const nextVis = lab.hallVisibility === '显示' ? '隐藏' : '显示';
        showToast(`已${nextVis === '显示' ? '发布到实验大厅' : '取消大厅发布'}`);
        return { ...lab, hallVisibility: nextVis };
      }
      return lab;
    }));
  };

  // 切换启用/禁用状态
  const handleToggleStatus = (labId: string) => {
    setLabs(prev => prev.map(lab => {
      if (lab.id === labId) {
        const nextStatus = lab.status === '启用' ? '禁用' : '启用';
        showToast(`实验环境已${nextStatus}`);
        return { ...lab, status: nextStatus };
      }
      return lab;
    }));
  };

  // 切换是否允许自定义课程使用
  const handleToggleAllowCustomCourse = (labId: string) => {
    setLabs(prev => prev.map(lab => {
      if (lab.id === labId) {
        const nextAllow = !lab.allowCustomCourse;
        showToast(`已${nextAllow ? '允许' : '禁止'}【${lab.name}】用于自定义课程`);
        return { ...lab, allowCustomCourse: nextAllow };
      }
      return lab;
    }));
  };

  // 复制实验环境
  const handleCopyLab = (lab: LabItem) => {
    const newLab: LabItem = {
      ...lab,
      id: `lab-${Date.now()}`,
      name: `${lab.name} (副本)`,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      hallVisibility: '隐藏'
    };
    setLabs(prev => [newLab, ...prev]);
    showToast(`成功复制实验环境：${lab.name}`);
  };

  // 归档实验环境
  const handleArchiveLab = (labId: string) => {
    setLabs(prev => prev.filter(lab => lab.id !== labId));
    showToast('实验环境已移入归档库');
  };

  // 渲染环境专用 Logo 图标
  const renderLabIcon = (type: string, name: string) => {
    switch (type) {
      case 'simulation-engine': // 工程虚拟仿真：蓝色六边形四象限
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-500 text-white shadow-xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        );
      case '3d-designer': // 3D应用设计器：黑色三角金字塔
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-[#1e232a] text-white shadow-xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-white stroke-2">
              <path d="M12 2L2 22h20L12 2z" />
              <path d="M12 2v20" />
            </svg>
          </div>
        );
      case 'embedded-sim': // 嵌入式仿真：绿色芯片板
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-[#10b981] text-white shadow-xs">
            <Cpu className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        );
      case '2d-designer': // 2D应用设计器：水滴/罗盘
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-xs">
            <Droplets className="w-3.5 h-3.5 fill-white/30" />
          </div>
        );
      case 'smart-water': // 智慧水务：蓝色水滴
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-600 text-white shadow-xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
        );
      case 'smart-health': // 智慧健康：玫红/粉紫心形+心电图
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-[#e11d48] text-white shadow-xs">
            <HeartPulse className="w-3.5 h-3.5" />
          </div>
        );
      case 'case-cube': // 案例题：蓝色立方体
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-500 text-white shadow-xs">
            <Box className="w-3.5 h-3.5" />
          </div>
        );
      case 'big-data': // 大数据：紫色显示器/网络
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-[#7c3aed] text-white shadow-xs">
            <Monitor className="w-3.5 h-3.5" />
          </div>
        );
      case 'bi-rect': // 智能BI：黑底白字BI
        return (
          <div className="w-5 h-5 rounded bg-black flex items-center justify-center text-white text-[10px] font-black tracking-tighter shadow-xs">
            BI
          </div>
        );
      case 'iot-mesh': // 物联网实验环境：浅蓝紫色IoT互联
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-[#0284c7] text-white shadow-xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-500 text-white shadow-xs">
            <Terminal className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  // 添加新实验环境
  const handleSaveAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('请输入实验环境名称');
      return;
    }
    const newLab: LabItem = {
      id: `lab-${Date.now()}`,
      name: formData.name.trim(),
      type: formData.type,
      order: Number(formData.order) || 1,
      status: formData.status,
      hallVisibility: formData.hallVisibility,
      allowCustomCourse: formData.allowCustomCourse,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      iconType: 'default-sim',
      cpu: formData.cpu,
      memory: formData.memory,
      desc: formData.desc || '实验环境'
    };
    setLabs(prev => [newLab, ...prev]);
    setShowAddModal(false);
    setFormData({
      name: '',
      type: '平台型',
      order: 1,
      status: '启用',
      hallVisibility: '隐藏',
      allowCustomCourse: true,
      cpu: '4 核',
      memory: '8 GB',
      desc: ''
    });
    showToast('成功添加新实验环境！');
  };

  // 保存配置修改
  const handleSaveConfig = () => {
    if (!currentSelectedLab) return;
    setLabs(prev => prev.map(lab => lab.id === currentSelectedLab.id ? currentSelectedLab : lab));
    setShowConfigModal(false);
    showToast('实验环境配置已保存！');
  };

  const categories: LabCategory[] = ['全部', '平台型', '容器型', '虚拟系统', '组合型'];

  return (
    <div className="p-5 bg-white min-h-[calc(100vh-64px)] flex flex-col justify-between font-sans relative">
      {/* Toast 提示 */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 text-white px-4 py-2 rounded-md shadow-lg text-xs flex items-center space-x-2 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        {/* 顶部搜索与筛选区 */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          {/* 左侧：分类选择 */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 text-xs">分类：</span>
            <div className="flex items-center space-x-1">
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded text-xs transition-all ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 font-medium' 
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧：搜索框与展开/收起 */}
          <div className="flex items-center space-x-4">
            {/* 搜索输入框 */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="请输入名称进行搜索"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-3 pr-8 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-md placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 展开/收起按钮 */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-xs text-slate-500 hover:text-slate-700 transition"
            >
              <span>{isExpanded ? '收起' : '展开'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 ml-1 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* 展开的高级筛选面板 */}
        {isExpanded && (
          <div className="py-3 px-4 my-3 bg-slate-50/80 rounded-md border border-slate-100 flex items-center space-x-6 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">运行状态：</span>
              {(['全部', '启用', '禁用'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2 py-0.5 rounded ${
                    filterStatus === s ? 'bg-blue-600 text-white' : 'hover:text-blue-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">大厅展示：</span>
              {(['全部', '显示', '隐藏'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setFilterVisibility(v)}
                  className={`px-2 py-0.5 rounded ${
                    filterVisibility === v ? 'bg-blue-600 text-white' : 'hover:text-blue-600'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">自定义课程：</span>
              {(['全部', '允许', '禁止'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCustomCourse(c)}
                  className={`px-2 py-0.5 rounded ${
                    filterCustomCourse === c ? 'bg-blue-600 text-white' : 'hover:text-blue-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedCategory('全部');
                setSearchKeyword('');
                setFilterStatus('全部');
                setFilterVisibility('全部');
                setFilterCustomCourse('全部');
                setSortField(null);
              }}
              className="text-blue-600 hover:underline ml-auto"
            >
              重置筛选
            </button>
          </div>
        )}

        {/* + 添加 按钮区域 */}
        <div className="py-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-medium rounded shadow-xs transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>添加</span>
          </button>
        </div>

        {/* 表格区域 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-xs font-normal">
                {/* 排序号 */}
                <th 
                  className="py-3 px-3 font-normal cursor-pointer hover:text-slate-800 transition w-20 select-none"
                  onClick={() => handleSort('order')}
                >
                  <div className="flex items-center space-x-1">
                    <span>排序号</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'order' ? 'text-blue-600' : 'text-slate-300'}`} />
                  </div>
                </th>

                {/* 实验环境 */}
                <th className="py-3 px-3 font-normal w-52">实验环境</th>

                {/* 类型 */}
                <th className="py-3 px-3 font-normal w-28">类型</th>

                {/* 状态 */}
                <th className="py-3 px-3 font-normal w-24">状态</th>

                {/* 实验大厅 */}
                <th className="py-3 px-3 font-normal w-28">实验大厅</th>

                {/* 是否允许自定义课程使用 */}
                <th className="py-3 px-3 font-normal w-36">允许自定义课程</th>

                {/* 创建时间 */}
                <th 
                  className="py-3 px-3 font-normal cursor-pointer hover:text-slate-800 transition w-44 select-none"
                  onClick={() => handleSort('createTime')}
                >
                  <div className="flex items-center space-x-1">
                    <span>创建时间</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'createTime' ? 'text-blue-600' : 'text-slate-300'}`} />
                  </div>
                </th>

                {/* 操作 */}
                <th className="py-3 px-3 font-normal text-right pr-4">操作</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedLabs.length > 0 ? (
                paginatedLabs.map(lab => {
                  const isVisibleInHall = lab.hallVisibility === '显示';

                  return (
                    <tr 
                      key={lab.id} 
                      className="hover:bg-slate-50/70 transition group"
                    >
                      {/* 排序号 */}
                      <td className="py-3 px-3 text-slate-600">
                        {lab.order}
                      </td>

                      {/* 实验环境 */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          {renderLabIcon(lab.iconType, lab.name)}
                          <span className="font-normal text-slate-800">{lab.name}</span>
                        </div>
                      </td>

                      {/* 类型 */}
                      <td className="py-3 px-3 text-slate-600">
                        {lab.type}
                      </td>

                      {/* 状态 */}
                      <td className="py-3 px-3 text-slate-600">
                        {lab.status}
                      </td>

                      {/* 实验大厅标签 */}
                      <td className="py-3 px-3">
                        {isVisibleInHall ? (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-normal bg-[#eaf8ee] text-[#34a853] border border-[#d2f0d9]/60">
                            显示
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-normal bg-[#fdeeed] text-[#eb5757] border border-[#fbd4d2]/60">
                            隐藏
                          </span>
                        )}
                      </td>

                      {/* 允许自定义课程开关 */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={lab.allowCustomCourse}
                          onClick={() => handleToggleAllowCustomCourse(lab.id)}
                          className="inline-flex items-center space-x-2 group/switch cursor-pointer select-none focus:outline-none"
                          title={`点击${lab.allowCustomCourse ? '禁止' : '允许'}自定义课程使用`}
                        >
                          <div 
                            className={`relative inline-flex h-4.5 w-8 shrink-0 rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                              lab.allowCustomCourse ? 'bg-blue-600' : 'bg-slate-200 group-hover/switch:bg-slate-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 mt-[1px] transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                lab.allowCustomCourse ? 'translate-x-3.5' : 'translate-x-0.5'
                              }`}
                            />
                          </div>
                          <span className={`text-[11px] transition-colors ${
                            lab.allowCustomCourse ? 'text-blue-600 font-medium' : 'text-slate-400'
                          }`}>
                            {lab.allowCustomCourse ? '允许' : '禁止'}
                          </span>
                        </button>
                      </td>

                      {/* 创建时间 */}
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {lab.createTime}
                      </td>

                      {/* 操作按钮组：根据大厅显示状态精确区分 */}
                      <td className="py-3 px-3 text-right pr-4 whitespace-nowrap">
                        {isVisibleInHall ? (
                          // 大厅“显示”态的操作：配置 进入实验 复制 取消发布(红)
                          <div className="inline-flex items-center space-x-3 justify-end">
                            <button
                              onClick={() => {
                                setCurrentSelectedLab(lab);
                                setShowConfigModal(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 transition font-normal"
                            >
                              配置
                            </button>
                            <button
                              onClick={() => {
                                setCurrentSelectedLab(lab);
                                setShowEnterModal(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 transition font-normal"
                            >
                              进入实验
                            </button>
                            <button
                              onClick={() => handleCopyLab(lab)}
                              className="text-blue-500 hover:text-blue-700 transition font-normal"
                            >
                              复制
                            </button>
                            <button
                              onClick={() => handleTogglePublish(lab.id)}
                              className="text-red-500 hover:text-red-700 transition font-normal"
                            >
                              取消发布
                            </button>
                          </div>
                        ) : (
                          // 大厅“隐藏”态的操作：禁用/启用(橙) 配置(蓝) 归档(橙) 进入实验(蓝) 复制(蓝) 发布(蓝)
                          <div className="inline-flex items-center space-x-3 justify-end">
                            <button
                              onClick={() => handleToggleStatus(lab.id)}
                              className="text-amber-500 hover:text-amber-700 transition font-normal"
                            >
                              {lab.status === '启用' ? '禁用' : '启用'}
                            </button>
                            <button
                              onClick={() => {
                                setCurrentSelectedLab(lab);
                                setShowConfigModal(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 transition font-normal"
                            >
                              配置
                            </button>
                            <button
                              onClick={() => handleArchiveLab(lab.id)}
                              className="text-amber-500 hover:text-amber-700 transition font-normal"
                            >
                              归档
                            </button>
                            <button
                              onClick={() => {
                                setCurrentSelectedLab(lab);
                                setShowEnterModal(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 transition font-normal"
                            >
                              进入实验
                            </button>
                            <button
                              onClick={() => handleCopyLab(lab)}
                              className="text-blue-500 hover:text-blue-700 transition font-normal"
                            >
                              复制
                            </button>
                            <button
                              onClick={() => handleTogglePublish(lab.id)}
                              className="text-blue-500 hover:text-blue-700 transition font-normal"
                            >
                              发布
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    暂无匹配的实验环境
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部翻页栏与AI悬浮球 */}
      <div className="pt-6 pb-2 flex items-center justify-between border-t border-slate-100 mt-6 text-xs text-slate-600">
        {/* 左侧：总数 */}
        <div>
          <span>共 {totalItems} 条</span>
        </div>

        {/* 中间右侧：条数下拉 + 页码控制 + 前往跳转 */}
        <div className="flex items-center space-x-3">
          {/* 每页条数下拉 */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none bg-white border border-slate-200 rounded px-2.5 py-1 pr-6 text-xs text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 页码按钮 */}
          <div className="flex items-center space-x-1">
            {/* 上一页 */}
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* 数字页码列表 */}
            {Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1).map(pageNum => {
              const isCurrent = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs transition ${
                    isCurrent
                      ? 'bg-[#1677ff] text-white font-medium shadow-xs'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* 下一页 */}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 前往指定页 */}
          <div className="flex items-center space-x-1 text-slate-600">
            <span>前往</span>
            <input
              type="text"
              value={gotoPageInput}
              onChange={(e) => setGotoPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = Number(gotoPageInput);
                  if (!isNaN(target) && target >= 1 && target <= totalPages) {
                    setCurrentPage(target);
                    setGotoPageInput('');
                  }
                }
              }}
              placeholder="1"
              className="w-9 h-7 border border-slate-200 rounded text-center text-xs focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* 右下角 AI 助手圆形浮动球 (1:1 复刻截图右下角) */}
        <div 
          className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-gradient-to-tr from-[#1677ff] via-[#2563eb] to-[#0ea5e9] text-white flex flex-col items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer hover:scale-105 active:scale-95 transition z-40 group"
          title="AI 智教助教"
          onClick={() => showToast('AI 实验运维助手已就绪')}
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[8px] font-black tracking-tighter leading-none mt-0.5">AI</span>
        </div>
      </div>

      {/* ===================== 弹窗 1：添加实验环境 ===================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center">
                <Plus className="w-4 h-4 text-blue-600 mr-2" />
                添加实验环境
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddLab} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  实验环境名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：量子计算模拟环境"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">类型</label>
                  <select
                    value={formData.type}
                    onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="平台型">平台型</option>
                    <option value="容器型">容器型</option>
                    <option value="虚拟系统">虚拟系统</option>
                    <option value="组合型">组合型</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">排序号</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">运行状态</label>
                  <select
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="启用">启用</option>
                    <option value="禁用">禁用</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">实验大厅展示</label>
                  <select
                    value={formData.hallVisibility}
                    onChange={(e: any) => setFormData({ ...formData, hallVisibility: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="显示">显示</option>
                    <option value="隐藏">隐藏</option>
                  </select>
                </div>
              </div>

              {/* 允许自定义课程开关 */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-md flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-700 text-xs">允许自定义课程使用</div>
                  <div className="text-[11px] text-slate-400">开启后教师创建自定义课程时可选择将该实验绑定至课程任务</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.allowCustomCourse}
                  onClick={() => setFormData({ ...formData, allowCustomCourse: !formData.allowCustomCourse })}
                  className="inline-flex items-center space-x-2 cursor-pointer focus:outline-none"
                >
                  <div 
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                      formData.allowCustomCourse ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 mt-[0.5px] transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                        formData.allowCustomCourse ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span className={`text-xs ${formData.allowCustomCourse ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                    {formData.allowCustomCourse ? '允许' : '禁止'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">CPU 配额</label>
                  <input
                    type="text"
                    value={formData.cpu}
                    onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">内存配额</label>
                  <input
                    type="text"
                    value={formData.memory}
                    onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">环境简介与说明</label>
                <textarea
                  rows={3}
                  placeholder="请输入环境功能特点说明..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1677ff] text-white rounded hover:bg-blue-600 transition"
                >
                  确定添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== 弹窗 2：配置实验环境 ===================== */}
      {showConfigModal && currentSelectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center">
                <Settings2 className="w-4 h-4 text-blue-600 mr-2" />
                配置实验环境 - {currentSelectedLab.name}
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">环境名称</label>
                <input
                  type="text"
                  value={currentSelectedLab.name}
                  onChange={(e) => setCurrentSelectedLab({ ...currentSelectedLab, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">类型</label>
                  <select
                    value={currentSelectedLab.type}
                    onChange={(e: any) => setCurrentSelectedLab({ ...currentSelectedLab, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="平台型">平台型</option>
                    <option value="容器型">容器型</option>
                    <option value="虚拟系统">虚拟系统</option>
                    <option value="组合型">组合型</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">显示排序</label>
                  <input
                    type="number"
                    value={currentSelectedLab.order}
                    onChange={(e) => setCurrentSelectedLab({ ...currentSelectedLab, order: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* 允许自定义课程开关 */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-md flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-700 text-xs">允许自定义课程使用</div>
                  <div className="text-[11px] text-slate-400">设置该实训环境是否开放给教师创建自定义课程时引用</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={currentSelectedLab.allowCustomCourse}
                  onClick={() => setCurrentSelectedLab({ 
                    ...currentSelectedLab, 
                    allowCustomCourse: !currentSelectedLab.allowCustomCourse 
                  })}
                  className="inline-flex items-center space-x-2 cursor-pointer focus:outline-none"
                >
                  <div 
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                      currentSelectedLab.allowCustomCourse ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 mt-[0.5px] transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                        currentSelectedLab.allowCustomCourse ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span className={`text-xs ${currentSelectedLab.allowCustomCourse ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                    {currentSelectedLab.allowCustomCourse ? '允许' : '禁止'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">CPU 核心数</label>
                  <input
                    type="text"
                    value={currentSelectedLab.cpu || '4 核'}
                    onChange={(e) => setCurrentSelectedLab({ ...currentSelectedLab, cpu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">内存上限</label>
                  <input
                    type="text"
                    value={currentSelectedLab.memory || '8 GB'}
                    onChange={(e) => setCurrentSelectedLab({ ...currentSelectedLab, memory: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">描述与技术栈说明</label>
                <textarea
                  rows={3}
                  value={currentSelectedLab.desc || ''}
                  onChange={(e) => setCurrentSelectedLab({ ...currentSelectedLab, desc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-1.5 bg-[#1677ff] text-white rounded hover:bg-blue-600 transition"
                >
                  保存配置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 弹窗 3：进入实验体验 ===================== */}
      {showEnterModal && currentSelectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 text-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-800">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-medium text-slate-200">
                  实训沙盒运行中 - {currentSelectedLab.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {currentSelectedLab.type}
                </span>
              </div>
              <button
                onClick={() => setShowEnterModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-100">{currentSelectedLab.name}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  {currentSelectedLab.desc || '仿真实验环境已就绪，正在准备全屏沉浸式工作空间。'}
                </p>
              </div>

              <div className="w-full max-w-md bg-slate-950/60 rounded-lg p-3 text-left font-mono text-[11px] text-slate-400 border border-slate-800/80 space-y-1">
                <div className="text-emerald-400">&gt; 环境检测通过: CPU {currentSelectedLab.cpu || '4 核'} | 内存 {currentSelectedLab.memory || '8 GB'}</div>
                <div className="text-blue-400">&gt; 挂载虚拟网络总线: 192.168.10.22/24 OK</div>
                <div className="text-slate-500">&gt; 启动图形服务端口: :8080 (WebSocket 已握手)</div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    showToast('已全屏接管实训环境');
                    setShowEnterModal(false);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium shadow-md transition"
                >
                  全屏开启实训
                </button>
                <button
                  onClick={() => setShowEnterModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs transition"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
