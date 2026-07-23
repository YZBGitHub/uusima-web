import React, { useState, useMemo } from 'react';
import { X, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, Check, BookOpen, Package, Activity } from 'lucide-react';
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
  status: '生效中' | '到期' | '已作废';
}

export default function OrdersManagement({ hideTenantSearch = false, isSystemManagement = false, presetTenantId, presetTenantName }: { hideTenantSearch?: boolean; isSystemManagement?: boolean; presetTenantId?: string; presetTenantName?: string; } = {}) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(hideTenantSearch ? 2 : 1);
  const [packageCount, setPackageCount] = useState(1);
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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const packages = [
    { id: 'PKG-001', name: '智联网综合实践平台服务增配包', type: 'UUSIMA', duration: 3000, tokenCount: 5000000, accountCount: 50, serviceLife: 1, product: '智能交互白板' },
    { id: 'PKG-002', name: '基础版套餐', type: '陆产通', duration: 1000, tokenCount: 1000000, accountCount: 10, serviceLife: 1, product: 'AI助手基础版' },
    { id: 'PKG-003', name: '高级版套餐', type: 'UUSIMA', duration: 5000, tokenCount: 10000000, accountCount: 100, serviceLife: 2, product: '全系产品' }
  ];

  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const courses = [
    { id: 'CRS-001', name: '物联网基础课程包', course: '物联网导论', major: '物联网工程', description: '包含传感器、RFID、基础通信理论等内容' },
    { id: 'CRS-002', name: 'AI大模型开发课程', course: '大语言模型原理与实践', major: '人工智能', description: '提供大语言模型的微调、提示词工程等实训环境' }
  ];

  const [tenantSearch, setTenantSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(presetTenantId || 'TENANT-001');
  const tenants = [
    ...(presetTenantId && presetTenantName && !['TENANT-001', 'TENANT-002', 'TENANT-003'].includes(presetTenantId) ? [{ id: presetTenantId, name: presetTenantName, type: '高校', city: '未知' }] : []),
    { id: 'TENANT-001', name: '上海某某大学', type: '高校', city: '上海' }, 
    { id: 'TENANT-002', name: '测试企业租户A', type: '企业', city: '北京' }, 
    { id: 'TENANT-003', name: '浙江大学', type: '高校', city: '杭州' }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [detailTab, setDetailTab] = useState<'package' | 'course'>('package');
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
      coursePackage: '物联网基础课程包',
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
        endTime: '2027-04-20 00:00:00'
      }
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
        endTime: '2026-07-22 00:00:00'
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
            <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
              {tenants.filter(t => t.name.includes(tenantSearch) || t.id.includes(tenantSearch)).map(tenant => (
                <div 
                  key={tenant.id}
                  onClick={() => setSelectedTenant(tenant.id)}
                  className={`border rounded-lg p-4 cursor-pointer relative transition-colors ${
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
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">选择一个套餐</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜索套餐..." 
                  value={packageSearch}
                  onChange={e => setPackageSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {packages.filter(p => p.name.includes(packageSearch) || p.id.includes(packageSearch)).map(pkg => (
                  <div 
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`border rounded p-3 cursor-pointer relative transition-colors ${
                      selectedPackage === pkg.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {selectedPackage === pkg.id && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <div className="font-medium text-slate-800 text-sm mb-2 pr-6">{pkg.name}</div>
                    <div className="text-xs text-slate-500 grid grid-cols-2 gap-y-1">
                      <div>类型: {pkg.type}</div>
                      <div>关联产品: {pkg.product}</div>
                      <div>时长: {pkg.duration}分钟</div>
                      <div>Token: {pkg.tokenCount.toLocaleString()}</div>
                      <div>账号: {pkg.accountCount}</div>
                      <div>年限: {pkg.serviceLife}年</div>
                    </div>
                  </div>
                ))}
                {packages.filter(p => p.name.includes(packageSearch) || p.id.includes(packageSearch)).length === 0 && (
                  <div className="text-center py-2 text-slate-500 text-sm">
                    没有找到匹配的套餐
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <label className="block text-sm font-medium text-slate-700">设置套餐数量</label>
              <input 
                type="number" 
                value={packageCount}
                onChange={e => setPackageCount(parseInt(e.target.value) || 1)}
                min={1} 
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
              />
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
              <div className="space-y-1 relative">
                <label className="text-sm text-slate-600">(可选) 课程包</label>
                <div 
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white cursor-pointer flex justify-between items-center"
                  onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                >
                  <span className={selectedCourse ? "text-slate-800" : "text-slate-400"}>
                    {selectedCourse ? courses.find(c => c.id === selectedCourse)?.name : "请搜索并选择课程包"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                
                {isCourseDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-2 top-2" />
                        <input
                          type="text"
                          placeholder="搜索课程包..."
                          value={courseSearch}
                          onChange={e => setCourseSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-transparent rounded text-sm focus:outline-none focus:bg-white focus:border-blue-500"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto">
                      <div 
                        className="px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 cursor-pointer"
                        onClick={() => { setSelectedCourse(null); setIsCourseDropdownOpen(false); }}
                      >
                        不选择
                      </div>
                      {courses.filter(c => c.name.includes(courseSearch)).map(course => (
                        <div 
                          key={course.id}
                          className="px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer"
                          onClick={() => {
                            setSelectedCourse(course.id);
                            setIsCourseDropdownOpen(false);
                            setCourseSearch('');
                          }}
                        >
                          {course.name}
                        </div>
                      ))}
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
        const p = packages.find(p => p.id === selectedPackage);
        const c = courses.find(c => c.id === selectedCourse);
        
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
                {p ? (
                  <div className="text-sm text-slate-700 space-y-1">
                    <div className="font-medium">{p.name} <span className="text-blue-600 font-semibold ml-2">x{packageCount}</span></div>
                    <div className="text-slate-500 text-xs">
                      类型: {p.type} | 时长: {p.duration}分钟 | Token: {p.tokenCount.toLocaleString()} | 账号: {p.accountCount}
                    </div>
                  </div>
                ) : <div className="text-sm text-red-500">未选择套餐</div>}
              </div>
              
              <div className="h-px bg-slate-200"></div>
              
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2">课程包信息</div>
                {c ? (
                  <div className="text-sm text-slate-700 space-y-1">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-slate-500 text-xs">
                      课程: {c.course} | 专业: {c.major}
                    </div>
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
              onClick={() => { setShowAddModal(true); setAddStep(hideTenantSearch ? 2 : 1); setFormErrors({}); setFormData({ projectName: "", customerName: "", salesperson: "", orderPrice: "", crmOrderNo: "", remarks: "" }); setPackageCount(1); setSelectedPackage(null); setSelectedCourse(null); }}
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
                      {order.packageName}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{order.operator}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => { setSelectedOrder(order); setDetailTab('package'); }}
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
              className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col"
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
              
              <div className="flex px-6 border-b border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setDetailTab('package')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${detailTab === 'package' ? 'border-[#108ee9] text-[#108ee9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  套餐使用情况
                </button>
                {selectedOrder.coursePackage && (
                  <button 
                    onClick={() => setDetailTab('course')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${detailTab === 'course' ? 'border-[#108ee9] text-[#108ee9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    课程包明细 ({selectedOrder.coursePackage})
                  </button>
                )}
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {detailTab === 'package' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-[#108ee9]" /> 
                        套餐基本信息
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">套餐名称</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageName}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">套餐类型</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageDetails.packageType}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">生效时间</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageDetails.startTime}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">失效时间</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageDetails.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-[#108ee9]" />
                        资源使用情况
                      </h4>
                      <div className="space-y-0 border border-slate-100 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">实验时长 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{selectedOrder.packageDetails.usedDuration.toLocaleString()}</span> / {selectedOrder.packageDetails.duration.toLocaleString()} 分钟
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">Token 数量 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{selectedOrder.packageDetails.usedTokenCount.toLocaleString()}</span> / {selectedOrder.packageDetails.tokenCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">账号数量 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{selectedOrder.packageDetails.usedAccountCount.toLocaleString()}</span> / {selectedOrder.packageDetails.accountCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">PPT 次数 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{selectedOrder.packageDetails.usedPptCount.toLocaleString()}</span> / {selectedOrder.packageDetails.pptCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">使用年限</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageDetails.serviceLife} 年</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-slate-100">
                          <span className="text-slate-500 text-sm">关联产品</span>
                          <span className="text-slate-800 text-sm font-medium">{packages.find(p => p.name === selectedOrder.packageName)?.product || '全系产品'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'course' && selectedOrder.coursePackage && (
                  <div>
                    <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-[#108ee9]" /> 
                      关联课程列表
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.filter(c => selectedOrder.coursePackage && c.name.includes(selectedOrder.coursePackage) || selectedOrder.coursePackage && selectedOrder.coursePackage.includes(c.name)).length > 0 ? (
                        courses.filter(c => selectedOrder.coursePackage && c.name.includes(selectedOrder.coursePackage) || selectedOrder.coursePackage && selectedOrder.coursePackage.includes(c.name)).map(course => (
                          <div key={course.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col">
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
                          <div key={course.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col">
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
                )}
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
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col"
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

              <div className="p-6 overflow-y-auto max-h-[60vh]">
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
