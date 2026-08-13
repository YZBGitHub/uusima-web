import React, { useState, useMemo } from 'react';
import { X, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, Check, BookOpen, Package, Activity, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PackageDetails {
  packageType: string;
  duration: number;
  usedDuration: number;
  tokenCount: number;
  usedTokenCount: number;
  accountCount: number;
  usedAccountCount: number;
  pptCount: number;
  usedPptCount: number;
  serviceLife: number;
  startTime: string;
  endTime: string;
  billingItems?: { id: string; name: string; value: number; used: number }[];
}

interface OrderPackage {
  packageName: string;
  packageDetails: PackageDetails;
}

interface Order {
  id: number;
  createTime: string;
  orderNo: string;
  tenantName: string;
  packageName: string;
  operator: string;
  project: string;
  customer: string;
  salesperson: string;
  price: number;
  crmOrderNo: string;
  remarks: string;
  coursePackage?: string;
  packageDetails: PackageDetails;
  packages?: OrderPackage[];
  status: '生效中' | '到期' | '已作废';
}

export default function OrdersManagement({ hideTenantSearch = false, isSystemManagement = false, presetTenantId, presetTenantName }: { hideTenantSearch?: boolean; isSystemManagement?: boolean; presetTenantId?: string; presetTenantName?: string; } = {}) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [selectedCoursePackageIndex, setSelectedCoursePackageIndex] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(hideTenantSearch ? 2 : 1);
  
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [statusSearch, setStatusSearch] = useState('');
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.projectName.trim()) {
      errors.projectName = '项目名称不能为空';
    } else if (formData.projectName.length > 100) {
      errors.projectName = '字符长度限制在 1 ~ 100 个字符之间';
    }

    if (!formData.customerName.trim()) {
      errors.customerName = '客户名称不能为空';
    } else if (formData.customerName.length > 100) {
      errors.customerName = '字符长度限制在 1 ~ 100 个字符之间';
    }

    if (!formData.salesperson.trim()) {
      errors.salesperson = '销售人员不能为空';
    } else if (formData.salesperson.length > 50) {
      errors.salesperson = '字符长度限制在 1 ~ 50 个字符之间';
    }

    if (!formData.orderPrice.trim()) {
      errors.orderPrice = '订单价格不能为空';
    } else {
      const priceNum = Number(formData.orderPrice);
      if (isNaN(priceNum) || priceNum < 0) {
        errors.orderPrice = '必须为大于等于 0 的数值';
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.orderPrice)) {
        errors.orderPrice = '格式上最多保留 2 位小数';
      }
    }

    if (!formData.crmOrderNo.trim()) {
      errors.crmOrderNo = 'CRM订单号不能为空';
    } else if (!/^[A-Za-z0-9\-_]+$/.test(formData.crmOrderNo)) {
      errors.crmOrderNo = '只能输入英文字母、数字及连字符（-、_）';
    } else if (formData.crmOrderNo.length > 50) {
      errors.crmOrderNo = '字符长度限制在 1 ~ 50 个字符之间';
    }

    if (formData.remarks && formData.remarks.length > 500) {
      errors.remarks = '字符长度限制在 0 ~ 500 个字符之间';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [formData, setFormData] = useState({
    projectName: '',
    customerName: '',
    salesperson: '',
    orderPrice: '',
    crmOrderNo: '',
    remarks: ''
  });

  
  const [packageSearch, setPackageSearch] = useState('');
  interface SelectedPackageData {
  id: string;
  count: number;
  effectiveTime: string;
}
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackageData[]>([]);
  const [addingPackageId, setAddingPackageId] = useState<string | null>(null);
  const [addingPackageData, setAddingPackageData] = useState<{ count: number; effectiveTime: string }>({ count: 1, effectiveTime: '' });

  const packages = [
    { id: 'PKG-001', name: '智联网综合实践平台服务增配包', type: 'UUSIMA', duration: 3000, tokenCount: 5000000, accountCount: 50, serviceLife: 1, product: '智能交互白板' },
    { id: 'PKG-002', name: '基础版套餐', type: '陆产通', duration: 1000, tokenCount: 1000000, accountCount: 10, serviceLife: 1, product: 'AI助手基础版' },
    { id: 'PKG-003', name: '高级版套餐', type: 'UUSIMA', duration: 5000, tokenCount: 10000000, accountCount: 100, serviceLife: 2, product: '全系产品' },
    { id: 'PKG-004', name: 'AI视觉分析增配包', type: 'UUSIMA', duration: 2000, tokenCount: 2000000, accountCount: 30, serviceLife: 1, product: 'AI视觉模组' },
    { id: 'PKG-005', name: '边缘计算基础套餐', type: 'UUSIMA', duration: 1500, tokenCount: 1500000, accountCount: 20, serviceLife: 1, product: '边缘计算网关' },
    { id: 'PKG-006', name: '企业尊享版', type: 'UUSIMA', duration: 10000, tokenCount: 50000000, accountCount: 200, serviceLife: 3, product: '全系产品' },
    { id: 'PKG-007', name: '数字孪生基础包', type: '陆产通', duration: 2500, tokenCount: 3000000, accountCount: 40, serviceLife: 1, product: '数字孪生平台' },
    { id: 'PKG-008', name: '机器视觉进阶包', type: 'UUSIMA', duration: 4000, tokenCount: 8000000, accountCount: 60, serviceLife: 2, product: 'AI视觉模组' },
    { id: 'PKG-009', name: '大模型微调服务包', type: '云服务', duration: 8000, tokenCount: 20000000, accountCount: 80, serviceLife: 1, product: '大语言模型' },
    { id: 'PKG-010', name: '智慧农业实训包', type: 'UUSIMA', duration: 1200, tokenCount: 1000000, accountCount: 15, serviceLife: 1, product: '农业沙盘' },
    { id: 'PKG-011', name: '智慧交通实训包', type: 'UUSIMA', duration: 1800, tokenCount: 1800000, accountCount: 25, serviceLife: 1, product: '交通沙盘' },
    { id: 'PKG-012', name: '智能制造综合包', type: 'UUSIMA', duration: 6000, tokenCount: 12000000, accountCount: 120, serviceLife: 2, product: '工业机械臂' }
  ];

  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const courses = [
    { id: 'CRS-001', name: '物联网基础课程包', course: '物联网导论', major: '物联网工程', description: '包含传感器、RFID、基础通信理论等内容', cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop' },
    { id: 'CRS-002', name: 'AI大模型开发课程', course: '大语言模型原理与实践', major: '人工智能', description: '提供大语言模型的微调、提示词工程等实训环境', cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=150&fit=crop' },
    { id: 'CRS-003', name: 'Python程序设计', course: 'Python基础', major: '软件工程', description: 'Python基本语法、数据结构、函数与模块', cover: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=200&h=150&fit=crop' },
    { id: 'CRS-004', name: '机器视觉基础', course: '计算机视觉', major: '人工智能', description: '图像处理基础、特征提取、目标检测', cover: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=200&h=150&fit=crop' },
    { id: 'CRS-005', name: '深度学习实战', course: '深度学习', major: '人工智能', description: 'CNN、RNN、Transformer原理与实现', cover: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=200&h=150&fit=crop' },
    { id: 'CRS-006', name: '嵌入式系统开发', course: '嵌入式原理', major: '电子信息', description: 'ARM架构、RTOS、底层驱动开发', cover: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceea?w=200&h=150&fit=crop' },
    { id: 'CRS-007', name: '云计算与容器化', course: '云计算基础', major: '软件工程', description: 'Docker、Kubernetes、微服务架构', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=150&fit=crop' },
    { id: 'CRS-008', name: '前端开发进阶', course: 'Web前端开发', major: '软件工程', description: 'React、Vue、前端工程化实践', cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=150&fit=crop' },
    { id: 'CRS-009', name: '网络安全基础', course: '信息安全', major: '网络空间安全', description: '密码学、网络攻防、系统安全', cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=150&fit=crop' },
    { id: 'CRS-010', name: '边缘计算应用', course: '边缘计算', major: '物联网工程', description: '边缘节点部署、数据协同、轻量级推理', cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=150&fit=crop' },
    { id: 'CRS-011', name: '数字孪生技术', course: '数字孪生', major: '智能制造', description: '3D建模、数据驱动、虚实同步', cover: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=200&h=150&fit=crop' },
    { id: 'CRS-012', name: '机器人操作系统', course: 'ROS基础', major: '机器人工程', description: 'ROS节点通信、导航、机械臂控制', cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=150&fit=crop' }
  ];

  const [tenantSearch, setTenantSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(presetTenantId || 'TENANT-001');
  const tenants = [
    ...(presetTenantId && presetTenantName && !['TENANT-001', 'TENANT-002', 'TENANT-003'].includes(presetTenantId) ? [{ id: presetTenantId, name: presetTenantName, type: '高校', city: '未知' }] : []),
    { id: 'TENANT-001', name: '上海某某大学', type: '高校', city: '上海' }, 
    { id: 'TENANT-002', name: '测试企业租户A', type: '企业', city: '北京' }, 
    { id: 'TENANT-003', name: '浙江大学', type: '高校', city: '杭州' },
    { id: 'TENANT-004', name: '清华大学', type: '高校', city: '北京' },
    { id: 'TENANT-005', name: '复旦大学', type: '高校', city: '上海' },
    { id: 'TENANT-006', name: '南京大学', type: '高校', city: '南京' },
    { id: 'TENANT-007', name: '腾讯科技', type: '企业', city: '深圳' },
    { id: 'TENANT-008', name: '阿里巴巴', type: '企业', city: '杭州' },
    { id: 'TENANT-009', name: '百度在线', type: '企业', city: '北京' },
    { id: 'TENANT-010', name: '武汉大学', type: '高校', city: '武汉' },
    { id: 'TENANT-011', name: '四川大学', type: '高校', city: '成都' },
    { id: 'TENANT-012', name: '中山大学', type: '高校', city: '广州' }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [detailTab, setDetailTab] = useState<'package' | 'course'>('package');
  const [resourceTab, setResourceTab] = useState<'legacy' | 'billing'>('billing');
  const itemsPerPage = 10;

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      createTime: '2026-04-20 10:00:00',
      orderNo: '2026042020035452',
      tenantName: '上海某某大学',
      packageName: '智联网综合实践平台服务增配包-TJ',
      operator: 'admin',
      project: '2026春季学期智联网实训',
      customer: '计算机学院',
      salesperson: '张三',
      price: 50000,
      crmOrderNo: 'CRM-2026-001',
      remarks: '加急办理',
      coursePackage: '物联网基础课程包, 大数据课程包',
      status: '生效中',
      packageDetails: {
        packageType: 'UUSIMA',
        duration: 3000,
        usedDuration: 1200,
        tokenCount: 5000000,
        usedTokenCount: 2500000,
        accountCount: 50,
        usedAccountCount: 20,
        pptCount: 100,
        usedPptCount: 30,
        serviceLife: 1,
        startTime: '2026-04-20 00:00:00',
        endTime: '2027-04-20 00:00:00',
        billingItems: [
          { id: '1', name: '词元(token)兑换', value: 5000000, used: 2500000 },
          { id: '2', name: 'PPT生成兑换', value: 100, used: 30 },
          { id: '3', name: '实验时长兑换', value: 3000, used: 1200 }
        ]
      },
      packages: [
        {
          packageName: '智联网综合实践平台服务增配包-TJ',
          packageDetails: {
            packageType: 'UUSIMA',
            duration: 3000,
            usedDuration: 1200,
            tokenCount: 5000000,
            usedTokenCount: 2500000,
            accountCount: 50,
            usedAccountCount: 20,
            pptCount: 100,
            usedPptCount: 30,
            serviceLife: 1,
            startTime: '2026-04-20 00:00:00',
            endTime: '2027-04-20 00:00:00',
            billingItems: [
              { id: '1', name: '词元(token)兑换', value: 5000000, used: 2500000 },
              { id: '2', name: 'PPT生成兑换', value: 100, used: 30 },
              { id: '3', name: '实验时长兑换', value: 3000, used: 1200 }
            ]
          }
        },
        {
          packageName: 'AI视觉分析增配包',
          packageDetails: {
            packageType: 'UUSIMA',
            duration: 2000,
            usedDuration: 500,
            tokenCount: 2000000,
            usedTokenCount: 1000000,
            accountCount: 30,
            usedAccountCount: 10,
            pptCount: 50,
            usedPptCount: 10,
            serviceLife: 1,
            startTime: '2026-04-20 00:00:00',
            endTime: '2027-04-20 00:00:00',
            billingItems: [
              { id: '4', name: '词元(token)兑换', value: 2000000, used: 1000000 },
              { id: '5', name: 'PPT生成兑换', value: 50, used: 10 }
            ]
          }
        }
      ]
    },
    {
      id: 2,
      createTime: '2025-07-22 14:38:34',
      orderNo: '2025072214383481',
      tenantName: '测试企业租户A',
      packageName: '试用套餐',
      operator: 'system',
      project: '内部测试项目',
      customer: '测试客户',
      salesperson: '李四',
      price: 0,
      crmOrderNo: 'CRM-2025-099',
      remarks: '测试用途',
      status: '已作废',
      packageDetails: {
        packageType: '陆产通',
        duration: 1000,
        usedDuration: 800,
        tokenCount: 1000000,
        usedTokenCount: 900000,
        accountCount: 10,
        usedAccountCount: 10,
        pptCount: 20,
        usedPptCount: 20,
        serviceLife: 1,
        startTime: '2025-07-22 00:00:00',
        endTime: '2026-07-22 00:00:00',
        billingItems: [
          { id: '1', name: '词元(token)兑换', value: 1000000, used: 900000 },
          { id: '2', name: 'PPT生成兑换', value: 20, used: 20 },
          { id: '3', name: '实验时长兑换', value: 1000, used: 800 }
        ]
      }
    }
  ]);

  const filteredOrders = orders.filter(order => {
    if (statusSearch && order.status !== statusSearch) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };


  const handleNextStep = () => {
    if (addStep === 3) {
      const newErrors: Record<string, string> = {};
      const { projectName, customerName, salesperson, orderPrice, crmOrderNo } = formData;
      
      if (!projectName.trim()) newErrors.projectName = '项目名称不能为空';
      else if (projectName.trim().length > 100) newErrors.projectName = '项目名称长度不能超过100个字符';
      
      if (!customerName.trim()) newErrors.customerName = '客户名称不能为空';
      else if (customerName.trim().length > 100) newErrors.customerName = '客户名称长度不能超过100个字符';
      
      if (!salesperson.trim()) newErrors.salesperson = '销售人员不能为空';
      else if (salesperson.trim().length > 50) newErrors.salesperson = '销售人员长度不能超过50个字符';
      
      if (!orderPrice) {
        newErrors.orderPrice = '订单价格不能为空';
      } else {
        const p = Number(orderPrice);
        if (p < 0 || isNaN(p)) newErrors.orderPrice = '订单价格必须为大于等于0的数值';
        else if (!/^\d+(\.\d{1,2})?$/.test(orderPrice.toString())) newErrors.orderPrice = '格式上最多保留 2 位小数';
      }
      
      if (!crmOrderNo.trim()) {
        newErrors.crmOrderNo = 'CRM订单号不能为空';
      } else if (!/^[a-zA-Z0-9\-_]+$/.test(crmOrderNo.trim())) {
        newErrors.crmOrderNo = 'CRM订单号只能包含英文字母、数字及连字符（-、_）';
      } else if (crmOrderNo.trim().length > 50) {
        newErrors.crmOrderNo = 'CRM订单号长度不能超过50个字符';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setFormErrors(newErrors);
        return;
      }
    }
    
    setAddStep(addStep + 1);
  };

  const renderAddModalContent = () => {
    switch (addStep) {
            case 1:
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">1. 选择租户</h4>
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索租户..." 
                value={tenantSearch}
                onChange={e => setTenantSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <div className="grid grid-cols-4 gap-3 ">
              {tenants.filter(t => t.name.includes(tenantSearch) || t.id.includes(tenantSearch)).map(tenant => (
                <div 
                  key={tenant.id}
                  onClick={() => setSelectedTenant(tenant.id)}
                  className={`border rounded-lg p-3 cursor-pointer relative transition-colors ${
                    selectedTenant === tenant.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {selectedTenant === tenant.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="font-medium text-slate-800">{tenant.name}</div>
                  <div className="text-xs text-slate-500 mt-1 flex space-x-2">
                    <span>ID: {tenant.id}</span>
                    <span>|</span>
                    <span>类型: {tenant.type}</span>
                    <span>|</span>
                    <span>城市: {tenant.city}</span>
                  </div>
                </div>
              ))}
              {tenants.filter(t => t.name.includes(tenantSearch) || t.id.includes(tenantSearch)).length === 0 && (
                <div className="col-span-2 text-center py-4 text-slate-500 text-sm">
                  没有找到匹配的租户
                </div>
              )}
            </div>
          </div>
        );
            case 2:
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">2. 选择套餐</h4>
            
            <div className="flex space-x-4">
              {/* Left: Available packages */}
              <div className="flex-1 border border-slate-200 rounded-lg flex flex-col bg-slate-50 min-h-0">
                 <div className="p-3 border-b border-slate-200">
                   <div className="relative">
                      <input 
                         type="text" 
                         placeholder="搜索套餐..." 
                         value={packageSearch}
                        onChange={e => setPackageSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                   </div>
                 </div>
                 
                 <div className="p-3 overflow-y-auto max-h-[60vh] space-y-3">
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                    {packages.filter(p => p.name.includes(packageSearch) || p.id.includes(packageSearch)).map(pkg => {
                      const isAdding = addingPackageId === pkg.id;
                      
                      return (
                        <div key={pkg.id} className={`bg-white border rounded-lg p-3 relative transition-colors ${isAdding ? 'border-blue-300 ring-1 ring-blue-100 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}>
                          <div className="flex justify-between items-start mb-2">
                             <div className="font-medium text-slate-800 text-sm leading-tight pr-10">{pkg.name}</div>
                             {isAdding ? null : (
                               <button onClick={() => {
                                  setAddingPackageId(pkg.id);
                                  const now = new Date();
                                  const today = now.toISOString().split('T')[0];
                                  setAddingPackageData({ count: 1, effectiveTime: today });
                               }} className="absolute top-3 right-3 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors font-medium cursor-pointer shadow-sm">添加</button>
                             )}
                          </div>
                          
                          <div className="text-xs text-slate-500 grid grid-cols-2 gap-y-1 mb-2">
                            <div>类型: {pkg.type}</div>
                            <div>产品: {pkg.product}</div>
                            <div>时长: {pkg.duration}分</div>
                            <div>Token: {pkg.tokenCount >= 10000 ? `${(pkg.tokenCount / 10000).toFixed(0)}w` : pkg.tokenCount}</div>
                            <div>账号: {pkg.accountCount}</div>
                            <div>年限: {pkg.serviceLife}年</div>
                          </div>
                          
                          {isAdding && (
                             <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col space-y-3">
                                <div className="flex space-x-2">
                                  <div className="flex-1 min-w-0">
                                    <label className="block text-[10px] font-medium text-slate-500 mb-1">数量</label>
                                    <input 
                                      type="number" 
                                      value={addingPackageData.count}
                                      onChange={e => setAddingPackageData({...addingPackageData, count: Math.max(1, parseInt(e.target.value) || 1)})}
                                      min={1} 
                                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <label className="block text-[10px] font-medium text-slate-500 mb-1">生效时间</label>
                                    <input 
                                      type="date" 
                                      value={addingPackageData.effectiveTime}
                                      onChange={e => setAddingPackageData({...addingPackageData, effectiveTime: e.target.value})}
                                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                   <button onClick={() => setAddingPackageId(null)} className="text-[10px] px-2 py-1 text-slate-500 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100">取消</button>
                                   <button onClick={() => {
                                     setSelectedPackages([...selectedPackages, { id: pkg.id, count: addingPackageData.count, effectiveTime: addingPackageData.effectiveTime }]);
                                     setAddingPackageId(null);
                                   }} className="text-[10px] px-2 py-1 bg-[#108ee9] text-white rounded hover:bg-blue-600">确认</button>
                                </div>
                             </div>
                          )}
                        </div>
                      );
                    })}
                    </div>
                 </div>
              </div>
              
              {/* Right: Selected packages */}
              <div className="w-[280px] xl:w-[320px] border border-slate-200 rounded-lg flex flex-col bg-white flex-shrink-0 min-h-0">
                 <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                   <div className="font-medium text-slate-700 text-sm">已选套餐 ({selectedPackages.length})</div>
                   {selectedPackages.length > 0 && (
                     <button onClick={() => setSelectedPackages([])} className="text-xs text-slate-500 hover:text-red-500 transition-colors">清空</button>
                   )}
                 </div>
                 
                 <div className="p-3 overflow-y-auto max-h-[60vh] space-y-3">
                   {selectedPackages.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 text-sm">
                         暂未选择套餐
                      </div>
                   ) : (
                      selectedPackages.map((pkgData, index) => {
                         const pkg = packages.find(p => p.id === pkgData.id);
                         if (!pkg) return null;
                         return (
                            <div key={`${pkgData.id}-${index}`} className="border border-slate-200 rounded-lg p-3 relative group">
                               <button 
                                  onClick={() => {
                                      const newSelected = [...selectedPackages];
                                      newSelected.splice(index, 1);
                                      setSelectedPackages(newSelected);
                                  }}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 w-6 h-6 rounded flex items-center justify-center transition-colors"
                                  title="删除"
                               >
                                  <X className="w-4 h-4" />
                               </button>
                               <div className="font-medium text-slate-800 text-sm pr-8 mb-1">{pkg.name}</div>
                               <div className="text-[10px] text-slate-500 mb-2">类型: {pkg.type}</div>
                               <div className="bg-slate-50 p-2 rounded text-[10px] space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">数量:</span>
                                    <span className="font-medium text-slate-700">x{pkgData.count}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">生效:</span>
                                    <span className="font-medium text-slate-700">{pkgData.effectiveTime}</span>
                                  </div>
                               </div>
                            </div>
                         )
                      })
                   )}
                 </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">3. 表单信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-600">项目名称 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.projectName} onChange={e => { setFormData({...formData, projectName: e.target.value}); if (formErrors.projectName) setFormErrors({...formErrors, projectName: ''}) }} className={`w-full px-3 py-2 border ${formErrors.projectName ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="1 ~ 100 个字符" />
                {formErrors.projectName && <p className="text-xs text-red-500">{formErrors.projectName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">客户名称 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.customerName} onChange={e => { setFormData({...formData, customerName: e.target.value}); if (formErrors.customerName) setFormErrors({...formErrors, customerName: ''}) }} className={`w-full px-3 py-2 border ${formErrors.customerName ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="1 ~ 100 个字符" />
                {formErrors.customerName && <p className="text-xs text-red-500">{formErrors.customerName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">销售人员 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.salesperson} onChange={e => { setFormData({...formData, salesperson: e.target.value}); if (formErrors.salesperson) setFormErrors({...formErrors, salesperson: ''}) }} className={`w-full px-3 py-2 border ${formErrors.salesperson ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="1 ~ 50 个字符" />
                {formErrors.salesperson && <p className="text-xs text-red-500">{formErrors.salesperson}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">订单价格 <span className="text-red-500">*</span></label>
                <input type="number" min="0" step="0.01" value={formData.orderPrice} onChange={e => { setFormData({...formData, orderPrice: e.target.value}); if (formErrors.orderPrice) setFormErrors({...formErrors, orderPrice: ''}) }} className={`w-full px-3 py-2 border ${formErrors.orderPrice ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="必须为非负数" />
                {formErrors.orderPrice && <p className="text-xs text-red-500">{formErrors.orderPrice}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">CRM订单号 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.crmOrderNo} onChange={e => { setFormData({...formData, crmOrderNo: e.target.value}); if (formErrors.crmOrderNo) setFormErrors({...formErrors, crmOrderNo: ''}) }} className={`w-full px-3 py-2 border ${formErrors.crmOrderNo ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="英文字母、数字、连字符" />
                {formErrors.crmOrderNo && <p className="text-xs text-red-500">{formErrors.crmOrderNo}</p>}
              </div>
              <div className="space-y-1 col-span-2 relative">
                <label className="text-sm text-slate-600">(可选) 课程包（可多选）</label>
                <div 
                  className="w-full px-3 py-3 border border-slate-300 rounded bg-white cursor-pointer flex justify-between items-center min-h-[42px] flex-wrap gap-2"
                  onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                >
                  {selectedCourses.length > 0 ? (
                    selectedCourses.map(courseId => {
                      const course = courses.find(c => c.id === courseId);
                      return course ? (
                        <span key={courseId} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100" onClick={e => e.stopPropagation()}>
                          {course.name}
                          <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCourses(selectedCourses.filter(id => id !== courseId))} />
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-slate-400 text-sm">请选择或搜索课程包</span>
                  )}
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                </div>
                
                {isCourseDropdownOpen && (
                  <div className="w-full mt-2 bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-slate-100 bg-slate-50">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="搜索课程包名称或专业..."
                          value={courseSearch}
                          onChange={e => setCourseSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50/50">
                      <div className="grid grid-cols-4 gap-3">
                        {courses.filter(c => c.name.includes(courseSearch) || c.major.includes(courseSearch)).map(course => {
                          const isSelected = selectedCourses.includes(course.id);
                          return (
                            <div 
                              key={course.id}
                              className={`p-3 text-sm bg-white border rounded-lg cursor-pointer flex items-start space-x-3 transition-colors ${
                                isSelected ? 'border-blue-500 shadow-sm ring-1 ring-blue-100' : 'border-slate-200 hover:border-blue-300'
                              }`}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                                } else {
                                  setSelectedCourses([...selectedCourses, course.id]);
                                }
                              }}
                            >
                              <img src={course.cover} alt={course.name} className="w-16 h-12 object-cover rounded shadow-sm bg-slate-100" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-800 mb-1 flex justify-between">
                                  {course.name}
                                  {isSelected && <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                                </div>
                                <div className="text-xs text-slate-500 mb-1">专业: <span className="text-slate-600 bg-slate-100 px-1 rounded">{course.major}</span></div>
                                <div className="text-xs text-slate-400 line-clamp-1" title={course.description}>{course.description}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-sm text-slate-600">填写备注</label>
                <textarea rows={2} value={formData.remarks} onChange={e => { setFormData({...formData, remarks: e.target.value}); if (formErrors.remarks) setFormErrors({...formErrors, remarks: ''}) }} className={`w-full px-3 py-2 border ${formErrors.remarks ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="补充说明事项，最多500字符"></textarea>
                {formErrors.remarks && <p className="text-xs text-red-500">{formErrors.remarks}</p>}
              </div>
            </div>
          </div>
        );
            case 4:
        const t = tenants.find(t => t.id === selectedTenant);
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-medium text-slate-800">确认提交新订单？</h4>
              <p className="text-slate-500 text-sm mt-1">请核对以下已选信息无误后，点击确认提交。</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2">租户信息</div>
                {t ? (
                  <div className="text-sm text-slate-700">
                    <span className="font-medium mr-2">{t.name}</span>
                    <span className="text-slate-500">(ID: {t.id} | 类型: {t.type} | 城市: {t.city})</span>
                  </div>
                ) : <div className="text-sm text-red-500">未选择租户</div>}
              </div>
              
              <div className="h-px bg-slate-200"></div>
              
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2">套餐信息</div>
                {selectedPackages.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPackages.map(pkgData => {
                      const p = packages.find(p => p.id === pkgData.id);
                      if (!p) return null;
                      return (
                        <div key={pkgData.id} className="text-sm text-slate-700 bg-white p-3 rounded border border-slate-200">
                          <div className="font-medium mb-1 flex items-center justify-between">
                            <span>{p.name} <span className="text-blue-600 font-semibold ml-1 bg-blue-50 px-1.5 py-0.5 rounded text-xs">x{pkgData.count}</span></span>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">生效: {pkgData.effectiveTime}</span>
                          </div>
                          <div className="text-slate-500 text-xs">
                            类型: {p.type} | 时长: {p.duration}分钟 | Token: {p.tokenCount.toLocaleString()} | 账号: {p.accountCount}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="text-sm text-red-500">未选择套餐</div>}
              </div>
              
              <div className="h-px bg-slate-200"></div>
              
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2">课程包信息</div>
                {selectedCourses.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCourses.map(courseId => {
                      const c = courses.find(c => c.id === courseId);
                      if (!c) return null;
                      return (
                        <div key={courseId} className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-200 flex items-center space-x-2">
                          <img src={c.cover} alt={c.name} className="w-10 h-7 object-cover rounded bg-slate-100" />
                          <div className="flex-1 overflow-hidden">
                            <div className="font-medium text-xs truncate">{c.name}</div>
                            <div className="text-slate-500 text-[10px] truncate">
                              专业: {c.major}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="text-sm text-slate-500">未选择课程包</div>}
              </div>

              <div className="h-px bg-slate-200"></div>
              
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2">表单信息</div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div>
                    <span className="text-slate-500 mr-2">项目名称:</span>
                    <span className="text-slate-800">{formData.projectName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 mr-2">客户名称:</span>
                    <span className="text-slate-800">{formData.customerName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 mr-2">销售人员:</span>
                    <span className="text-slate-800">{formData.salesperson || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 mr-2">订单价格:</span>
                    <span className="text-slate-800 font-medium text-orange-500">{formData.orderPrice ? `￥${formData.orderPrice}` : '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 mr-2">CRM订单号:</span>
                    <span className="text-slate-800">{formData.crmOrderNo || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 mr-2">备注:</span>
                    <span className="text-slate-800">{formData.remarks || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] p-6 overflow-y-auto">
      <div className="mb-4 text-slate-800 flex justify-between items-end">
        <h2 className="text-xl font-bold">订购订单</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => selectedOrders.size > 0 && setShowVoidConfirm(true)}
            disabled={selectedOrders.size === 0}
            className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            <span>批量作废</span>
          </button>
          {!isSystemManagement && (
            <button
              onClick={() => { setShowAddModal(true); setAddStep(hideTenantSearch ? 2 : 1); setFormErrors({}); setFormData({ projectName: "", customerName: "", salesperson: "", orderPrice: "", crmOrderNo: "", remarks: "" }); setSelectedPackages([]); setSelectedCourses([]); setIsCourseDropdownOpen(false); }}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>新增订单</span>
            </button>
          )}
        </div>
      </div>

      
      {/* Search Area */}
      <div className="mb-4 bg-slate-50/50 border border-slate-200 rounded-lg p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">订单号：</span>
          <input type="text" placeholder="请输入订单号" className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">时间范围：</span>
          <div className="flex items-center space-x-1">
            <input type="date" className="w-36 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <span className="text-slate-400">-</span>
            <input type="date" className="w-36 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
        {!hideTenantSearch && (<div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">租户：</span>
          <input type="text" placeholder="请输入租户名称" className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>)}
        {!isSystemManagement && (<div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">套餐：</span>
          <input type="text" placeholder="请输入套餐名称" className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>)}
        {!isSystemManagement && (<div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">CRM订单号：</span>
          <input type="text" placeholder="请输入CRM订单号" className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>)}
        {!isSystemManagement && (<div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">项目名称：</span>
          <input type="text" placeholder="请输入项目名称" className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>)}
        
                <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">状态：</span>
          <select 
            value={statusSearch}
            onChange={(e) => setStatusSearch(e.target.value)}
            className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="生效中">生效中</option>
            <option value="到期">到期</option>
            <option value="已作废">已作废</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <button onClick={() => setStatusSearch('')} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm">
            重置
          </button>
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm">
            查询
          </button>
        </div>
      </div>

      <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden mb-8">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[max-content]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="w-10 px-4">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(new Set(currentOrders.map(o => o.id)));
                      } else {
                        setSelectedOrders(new Set());
                      }
                    }}
                    checked={currentOrders.length > 0 && selectedOrders.size === currentOrders.length}
                  />
                </th>
                <th className="w-10 px-4"></th>
                <th className="px-6 py-4 font-medium text-slate-500">创建时间</th>
                <th className="px-6 py-4 font-medium text-slate-500">状态</th>
                <th className="px-6 py-4 font-medium text-slate-500">订单号</th>
                {!isSystemManagement && <th className="px-6 py-4 font-medium text-slate-500">租户名称</th>}
                <th className="px-6 py-4 font-medium text-slate-500">套餐名称</th>
                <th className="px-6 py-4 font-medium text-slate-500">操作者</th>
                <th className="px-6 py-4 font-medium text-slate-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentOrders.map((order, i) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selectedOrders.has(order.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedOrders);
                          if (e.target.checked) {
                            newSelected.add(order.id);
                          } else {
                            newSelected.delete(order.id);
                          }
                          setSelectedOrders(newSelected);
                        }}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => toggleRow(order.id)} className="text-slate-400 hover:text-slate-600">
                        {expandedRows.has(order.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{order.createTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        order.status === '生效中' ? 'bg-green-100 text-green-700' : 
                        order.status === '到期' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{order.orderNo}</td>
                    {!isSystemManagement && <td className="px-6 py-4 text-slate-700">{order.tenantName}</td>}
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {order.packages ? order.packages.map(p => p.packageName).join(', ') : order.packageName}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{order.operator}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => { setSelectedOrder(order); setSelectedPackageIndex(0); setDetailTab('package'); }}
                        className="text-[#108ee9] hover:text-blue-700 transition-colors font-medium"
                      >
                        查看明细
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(order.id) && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={8} className="px-10 py-4 border-b border-slate-100">
                        <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm">
                          {!isSystemManagement && <div>
                            <span className="text-slate-500 mr-2">项目名称:</span>
                            <span className="text-slate-800">{order.project}</span>
                          </div>}
                          <div>
                            <span className="text-slate-500 mr-2">客户名称:</span>
                            <span className="text-slate-800">{order.customer}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 mr-2">销售人员:</span>
                            <span className="text-slate-800">{order.salesperson}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 mr-2">订单价格:</span>
                            <span className="text-slate-800 font-medium text-orange-500">￥{order.price.toLocaleString()}</span>
                          </div>
                          {!isSystemManagement && <div>
                            <span className="text-slate-500 mr-2">CRM订单号:</span>
                            <span className="text-slate-800">{order.crmOrderNo}</span>
                          </div>}
                          <div>
                            <span className="text-slate-500 mr-2">课程包:</span>
                            <span className="text-slate-800">{order.coursePackage || '无'}</span>
                          </div>
                          <div className="col-span-3">
                            <span className="text-slate-500 mr-2">备注:</span>
                            <span className="text-slate-800">{order.remarks || '无'}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-sm text-slate-500">
              共 {orders.length} 条记录，第 {currentPage} / {totalPages} 页
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded text-sm font-medium flex items-center justify-center transition-colors ${
                          currentPage === page
                            ? 'bg-[#108ee9] text-white border border-[#108ee9]'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-slate-400">...</span>;
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Void Confirm Modal */}
      {showVoidConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认作废？</h3>
              <p className="text-sm text-slate-600">您已选择 {selectedOrders.size} 个订单，作废后相关服务将停止，确认作废吗？</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button onClick={() => setShowVoidConfirm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded bg-white hover:bg-slate-50 transition-colors text-sm font-medium">取消</button>
              <button onClick={() => {
                const newOrders = orders.map(o => {
                  if (selectedOrders.has(o.id)) {
                    return { ...o, status: '已作废' as const };
                  }
                  return o;
                });
                setOrders(newOrders);
                setShowVoidConfirm(false);
                setSelectedOrders(new Set());
              }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium">确认作废</button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">
                  订单明细
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col space-y-4">
                {/* Order Information Section */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[#108ee9]" />
                    订单信息
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><span className="text-slate-500">订单编号：</span><span className="font-medium text-slate-800">{selectedOrder.orderNo}</span></div>
                    <div><span className="text-slate-500">创建时间：</span><span className="font-medium text-slate-800">{selectedOrder.createTime}</span></div>
                    <div><span className="text-slate-500">CRM订单号：</span><span className="font-medium text-slate-800">{selectedOrder.crmOrderNo}</span></div>
                    <div><span className="text-slate-500">项目名称：</span><span className="font-medium text-slate-800">{selectedOrder.project}</span></div>
                    <div><span className="text-slate-500">客户名称：</span><span className="font-medium text-slate-800">{selectedOrder.customer}</span></div>
                    <div><span className="text-slate-500">销售人员：</span><span className="font-medium text-slate-800">{selectedOrder.salesperson}</span></div>
                    <div><span className="text-slate-500">订单价格：</span><span className="font-medium text-red-600">￥{selectedOrder.price.toLocaleString()}</span></div>
                    <div className="col-span-2"><span className="text-slate-500">备注：</span><span className="font-medium text-slate-800">{selectedOrder.remarks || '-'}</span></div>
                  </div>
                </div>
                
                <div className="flex border-b border-slate-200 mt-2">
                  <button 
                    onClick={() => setDetailTab('package')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${detailTab === 'package' ? 'border-[#108ee9] text-[#108ee9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    套餐使用情况
                  </button>
                  {selectedOrder.coursePackage && (
                    <button 
                      onClick={() => setDetailTab('course')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${detailTab === 'course' ? 'border-[#108ee9] text-[#108ee9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      课程包明细 ({selectedOrder.coursePackage})
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto min-h-0">
                {detailTab === 'package' && (() => {
                  const displayPackages = selectedOrder.packages || [{ packageName: selectedOrder.packageName, packageDetails: selectedOrder.packageDetails }];
                  const currentPackage = displayPackages[selectedPackageIndex] || displayPackages[0];
                  
                  return (
                  <div className="space-y-6">
                    {displayPackages.length > 1 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {displayPackages.map((pkg, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPackageIndex(idx)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                              selectedPackageIndex === idx 
                                ? 'bg-[#108ee9] text-white border-[#108ee9]' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#108ee9] hover:text-[#108ee9]'
                            }`}
                          >
                            {pkg.packageName}
                          </button>
                        ))}
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-[#108ee9]" /> 
                        套餐基本信息
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">套餐名称</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageName}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">套餐类型</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.packageType}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">生效时间</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.startTime}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">失效时间</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                        <h4 className="text-base font-semibold text-slate-800 flex items-center m-0">
                          <Activity className="w-4 h-4 mr-2 text-[#108ee9]" />
                          资源使用情况
                        </h4>
                        {currentPackage.packageDetails.billingItems && currentPackage.packageDetails.billingItems.length > 0 && (
                          <div className="flex bg-slate-100 p-1 rounded-md self-start sm:self-auto shrink-0">
                            <button
                              onClick={() => setResourceTab('legacy')}
                              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                                resourceTab === 'legacy' 
                                  ? 'bg-white shadow-sm text-[#108ee9]' 
                                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                              }`}
                            >
                              基础资源
                            </button>
                            <button
                              onClick={() => setResourceTab('billing')}
                              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                                resourceTab === 'billing' 
                                  ? 'bg-white shadow-sm text-[#108ee9]' 
                                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                              }`}
                            >
                              计费项资源
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-0 border border-slate-100 rounded-lg overflow-hidden">
                        {currentPackage.packageDetails.billingItems && resourceTab === 'billing' ? (
                          <>
                            {currentPackage.packageDetails.billingItems.map((item, idx) => (
                              <div key={item.id} className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 ${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                                <span className="text-slate-500 text-sm">{item.name} (已用/总计)</span>
                                <span className="text-slate-800 text-sm font-medium">
                                  <span className="text-[#108ee9]">{item.used.toLocaleString()}</span> / {item.value.toLocaleString()}
                                </span>
                              </div>
                            ))}
                            <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 ${currentPackage.packageDetails.billingItems.length % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                              <span className="text-slate-500 text-sm">账号数量 (已用/总计)</span>
                              <span className="text-slate-800 text-sm font-medium">
                                <span className="text-[#108ee9]">{currentPackage.packageDetails.usedAccountCount.toLocaleString()}</span> / {currentPackage.packageDetails.accountCount.toLocaleString()}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 ${(currentPackage.packageDetails.billingItems.length + 1) % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                              <span className="text-slate-500 text-sm">使用年限</span>
                              <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.serviceLife} 年</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                              <span className="text-slate-500 text-sm">实验时长 (已用/总计)</span>
                              <span className="text-slate-800 text-sm font-medium">
                                <span className="text-[#108ee9]">{currentPackage.packageDetails.usedDuration.toLocaleString()}</span> / {currentPackage.packageDetails.duration.toLocaleString()} 分钟
                              </span>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                              <span className="text-slate-500 text-sm">Token 数量 (已用/总计)</span>
                              <span className="text-slate-800 text-sm font-medium">
                                <span className="text-[#108ee9]">{currentPackage.packageDetails.usedTokenCount.toLocaleString()}</span> / {currentPackage.packageDetails.tokenCount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                              <span className="text-slate-500 text-sm">账号数量 (已用/总计)</span>
                              <span className="text-slate-800 text-sm font-medium">
                                <span className="text-[#108ee9]">{currentPackage.packageDetails.usedAccountCount.toLocaleString()}</span> / {currentPackage.packageDetails.accountCount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                              <span className="text-slate-500 text-sm">PPT 次数 (已用/总计)</span>
                              <span className="text-slate-800 text-sm font-medium">
                                <span className="text-[#108ee9]">{currentPackage.packageDetails.usedPptCount.toLocaleString()}</span> / {currentPackage.packageDetails.pptCount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                              <span className="text-slate-500 text-sm">使用年限</span>
                              <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.serviceLife} 年</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between px-4 py-3 border-slate-100">
                          <span className="text-slate-500 text-sm">关联产品</span>
                          <span className="text-slate-800 text-sm font-medium">{packages.find(p => p.name === currentPackage.packageName)?.product || '全系产品'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })()}

                {detailTab === 'course' && selectedOrder.coursePackage && (() => {
                  const coursePackages = selectedOrder.coursePackage.split(',').map(s => s.trim()).filter(Boolean);
                  const currentCoursePackage = coursePackages[selectedCoursePackageIndex] || coursePackages[0];
                  
                  return (
                  <div>
                    {coursePackages.length > 1 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {coursePackages.map((pkg, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCoursePackageIndex(idx)}
                            className={`px-4 py-2 text-sm rounded border transition-colors ${
                              selectedCoursePackageIndex === idx 
                                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 font-medium' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                            }`}
                          >
                            {pkg}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-[#108ee9]" /> 
                      关联课程列表 {coursePackages.length > 1 && <span className="text-slate-500 text-sm ml-2 font-normal">({currentCoursePackage})</span>}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courses.filter(c => currentCoursePackage && c.name.includes(currentCoursePackage) || currentCoursePackage && currentCoursePackage.includes(c.name)).length > 0 ? (
                        courses.filter(c => currentCoursePackage && c.name.includes(currentCoursePackage) || currentCoursePackage && currentCoursePackage.includes(c.name)).map(course => (
                          <div key={course.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col hover:shadow-sm transition-shadow">
                            <div className="font-medium text-slate-800 mb-3">{course.name}</div>
                            <div className="flex flex-col space-y-2 mb-3">
                              <div className="flex items-center text-sm text-slate-600">
                                <span className="text-slate-400 w-12 text-xs">专业：</span>
                                <span className="bg-blue-100 text-[#108ee9] px-2 py-0.5 rounded text-xs">{course.major}</span>
                              </div>
                              <div className="flex items-center text-sm text-slate-600">
                                <span className="text-slate-400 w-12 text-xs">课程：</span>
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">{course.course}</span>
                              </div>
                            </div>
                            <div className="text-sm text-slate-500 mt-auto">{course.description}</div>
                          </div>
                        ))
                      ) : (
                        courses.map(course => (
                          <div key={course.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col hover:shadow-sm transition-shadow">
                            <div className="font-medium text-slate-800 mb-3">{course.name}</div>
                            <div className="flex flex-col space-y-2 mb-3">
                              <div className="flex items-center text-sm text-slate-600">
                                <span className="text-slate-400 w-12 text-xs">专业：</span>
                                <span className="bg-blue-100 text-[#108ee9] px-2 py-0.5 rounded text-xs">{course.major}</span>
                              </div>
                              <div className="flex items-center text-sm text-slate-600">
                                <span className="text-slate-400 w-12 text-xs">课程：</span>
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">{course.course}</span>
                              </div>
                            </div>
                            <div className="text-sm text-slate-500 mt-auto">{course.description}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  );
                })()}
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full w-[80vw] max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">
                  新增订单
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === addStep 
                          ? 'bg-[#108ee9] text-white' 
                          : step < addStep 
                            ? 'bg-blue-100 text-[#108ee9]' 
                            : 'bg-white border border-slate-200 text-slate-400'
                      }`}>
                        {step < addStep ? <Check className="w-4 h-4" /> : step}
                      </div>
                      <div className={`ml-2 text-sm font-medium ${step === addStep ? 'text-[#108ee9]' : step < addStep ? 'text-slate-700' : 'text-slate-400'}`}>
                        {step === 1 ? '选择租户' : step === 2 ? '选择套餐' : step === 3 ? '表单信息' : '确认提交'}
                      </div>
                      {step < 4 && (
                        <div className={`w-12 h-px mx-4 ${step < addStep ? 'bg-[#108ee9]' : 'bg-slate-200'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 min-h-0">
                {renderAddModalContent()}
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <div className="space-x-3">
                  {((hideTenantSearch && addStep > 2) || (!hideTenantSearch && addStep > 1)) && (
                    <button
                      onClick={() => setAddStep(addStep - 1)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      上一步
                    </button>
                  )}
                  {addStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-[#108ee9] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      下一步
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-[#108ee9] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      确认提交
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
