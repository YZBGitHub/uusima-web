import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, AlertCircle, ChevronDown, ChevronRight, Play, Square, ArrowLeft, Archive, Loader2, ChevronLeft } from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  type: string;
  version: string;
  duration: number;
  tokenCount: number;
  accountCount: number;
  pptCount: number;
  serviceLife: number;
  price: number;
  products: string;
  status: 'draft' | 'enabled' | 'disabled' | 'archived';
  updateTime: string;
}

const generateMockData = (): PackageItem[] => {
  const data: PackageItem[] = [];
  const statuses: ('draft' | 'enabled' | 'disabled' | 'archived')[] = ['draft', 'enabled', 'disabled', 'archived'];
  for (let i = 1; i <= 45; i++) {
    data.push({
      id: `pkg-${i}`,
      name: `测试套餐 ${i}`,
      type: i % 2 === 0 ? '陆产通' : 'UUSIMA',
      version: `v1.0.${i}`,
      duration: 1000 * i,
      tokenCount: 100000 * i,
      accountCount: 10 + i,
      pptCount: 20 + i,
      serviceLife: 12,
      price: 99.9 * i,
      products: 'AI技能分析系统, 知识库应用系统',
      status: statuses[i % 4],
      updateTime: `2023-10-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`
    });
  }
  return data;
};

const initialPackages = generateMockData();

const STATUS_MAP = {
  draft: { label: '草稿', color: 'bg-slate-100 text-slate-700' },
  enabled: { label: '启用', color: 'bg-green-100 text-green-700' },
  disabled: { label: '停用', color: 'bg-red-100 text-red-700' },
  archived: { label: '归档', color: 'bg-gray-100 text-gray-500' }
};

export default function BillingPackage() {
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  
  // Search State
  const [searchParams, setSearchParams] = useState({
    name: '',
    type: '',
    products: '',
    status: ''
  });
  const [appliedSearch, setAppliedSearch] = useState(searchParams);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Expand State
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormData = {
    name: '',
    type: 'UUSIMA',
    duration: 0 as number | '',
    tokenCount: 0 as number | '',
    accountCount: 0 as number | '',
    pptCount: 0 as number | '',
    serviceLife: 12 as number | '',
    price: 0 as number | '',
    products: [] as string[]
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleSearch = () => {
    setAppliedSearch(searchParams);
    setCurrentPage(1);
  };

  const handleReset = () => {
    const empty = { name: '', type: '', products: '', status: '' };
    setSearchParams(empty);
    setAppliedSearch(empty);
    setCurrentPage(1);
  };

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchName = pkg.name.toLowerCase().includes(appliedSearch.name.toLowerCase());
      const matchType = pkg.type.toLowerCase().includes(appliedSearch.type.toLowerCase());
      const matchProducts = pkg.products.toLowerCase().includes(appliedSearch.products.toLowerCase());
      const matchStatus = appliedSearch.status === '' || pkg.status === appliedSearch.status;
      return matchName && matchType && matchProducts && matchStatus;
    }).sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime());
  }, [packages, appliedSearch]);

  const totalItems = filteredPackages.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedPackages = filteredPackages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingId(null);
    setFormData(initialFormData);
    setErrors({});
    setShowAddModal(true);
  };

  const handleOpenEdit = (pkg: PackageItem) => {
    setModalMode('edit');
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      type: pkg.type,
      duration: pkg.duration,
      tokenCount: pkg.tokenCount,
      accountCount: pkg.accountCount,
      pptCount: pkg.pptCount,
      serviceLife: pkg.serviceLife,
      price: pkg.price,
      products: pkg.products ? pkg.products.split(', ') : []
    });
    setErrors({});
    setShowAddModal(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = '套餐名称不能为空';
    } else if (trimmedName.length > 50) {
      newErrors.name = '套餐名称最多50个字符';
    } else {
      const isDuplicate = packages.some(p => p.type === formData.type && p.name === trimmedName && p.id !== editingId && p.status !== 'archived');
      if (isDuplicate) {
        newErrors.name = '同类型下套餐名称已存在';
      }
    }

    if (!formData.type) newErrors.type = '请选择套餐类型';

    if (formData.duration !== '' && (Number(formData.duration) < 0 || !Number.isInteger(Number(formData.duration)) || Number(formData.duration) > 999999)) {
      newErrors.duration = '必须为0-999999的整数';
    }
    if (formData.tokenCount !== '' && (Number(formData.tokenCount) < 0 || !Number.isInteger(Number(formData.tokenCount)) || Number(formData.tokenCount) > 999999999)) {
      newErrors.tokenCount = '必须为0-999999999的整数';
    }
    if (formData.accountCount !== '' && (Number(formData.accountCount) < 0 || !Number.isInteger(Number(formData.accountCount)))) {
      newErrors.accountCount = '必须为非负整数';
    }
    if (formData.pptCount !== '' && (Number(formData.pptCount) < 0 || !Number.isInteger(Number(formData.pptCount)))) {
      newErrors.pptCount = '必须为非负整数';
    }
    if (formData.serviceLife === '' || Number(formData.serviceLife) < 1 || Number(formData.serviceLife) > 1200 || !Number.isInteger(Number(formData.serviceLife))) {
      newErrors.serviceLife = '必须为1-1200的整数';
    }
    
    if (formData.price === '') {
      newErrors.price = '套餐价格不能为空';
    } else {
      const priceNum = Number(formData.price);
      if (priceNum < 0 || priceNum > 999999999.99) {
        newErrors.price = '价格范围0-999999999.99';
      } else if (!/^\d+(\.\d{1,2})?$/.test(String(formData.price))) {
        newErrors.price = '最多保留两位小数';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    const submittedData = {
      name: formData.name.trim(),
      type: formData.type,
      duration: formData.duration === '' ? 0 : Number(formData.duration),
      tokenCount: formData.tokenCount === '' ? 0 : Number(formData.tokenCount),
      accountCount: formData.accountCount === '' ? 0 : Number(formData.accountCount),
      pptCount: formData.pptCount === '' ? 0 : Number(formData.pptCount),
      serviceLife: Number(formData.serviceLife),
      price: Number(formData.price),
      products: formData.products.join(', ')
    };

    if (modalMode === 'add') {
      setPackages([{
        ...submittedData,
        id: `pkg-${Date.now()}`,
        version: 'v1.0.0',
        status: 'draft',
        updateTime: now
      }, ...packages]);
    } else {
      const newPackages = packages.flatMap(p => {
        if (p.id === editingId) {
          if (p.status === 'enabled') {
            // Version bump for enabled packages, duplicate as a new version
            const vParts = p.version.replace('v', '').split('.');
            vParts[2] = String(Number(vParts[2]) + 1);
            const newVersion: PackageItem = { 
              ...p, 
              ...submittedData, 
              id: `pkg-${Date.now()}`, 
              version: `v${vParts.join('.')}`, 
              updateTime: now 
            };
            const oldVersion: PackageItem = {
              ...p,
              status: 'archived'
            };
            return [newVersion, oldVersion];
          }
          return [{ ...p, ...submittedData, updateTime: now }];
        }
        return [p];
      });
      setPackages(newPackages);
    }
    setShowAddModal(false);
  };

  const changeStatus = (id: string, newStatus: PackageItem['status']) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setPackages(packages.map(p => p.id === id ? { ...p, status: newStatus, updateTime: now } : p));
  };

  const handleDelete = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  const handleProductToggle = (productName: string) => {
    setFormData(prev => {
      const products = prev.products.includes(productName)
        ? prev.products.filter(p => p !== productName)
        : [...prev.products, productName];
      return { ...prev, products };
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Search Area */}
      <div className="mb-4 bg-slate-50/50 border border-slate-200 rounded-lg p-4 flex flex-wrap gap-4 items-center shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">套餐名称：</span>
          <input 
            type="text" 
            placeholder="名称模糊搜索" 
            value={searchParams.name}
            onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
            className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">套餐类型：</span>
          <input 
            type="text" 
            placeholder="类型模糊搜索" 
            value={searchParams.type}
            onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
            className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">关联产品：</span>
          <input 
            type="text" 
            placeholder="产品模糊搜索" 
            value={searchParams.products}
            onChange={(e) => setSearchParams({...searchParams, products: e.target.value})}
            className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">状态：</span>
          <select 
            value={searchParams.status}
            onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
            className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="draft">草稿</option>
            <option value="enabled">启用</option>
            <option value="disabled">停用</option>
            <option value="archived">归档</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <button onClick={handleSearch} className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm">
            搜索
          </button>
          <button onClick={handleReset} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm">
            重置
          </button>
        </div>
      </div>

      <div className="mb-4 shrink-0">
        <button 
          onClick={handleOpenAdd}
          className="flex items-center px-4 py-2 bg-[#108ee9] text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          新增套餐
        </button>
      </div>

      <div className="flex-1 overflow-auto border border-slate-200 rounded-lg flex flex-col bg-white">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[max-content] table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4 font-medium text-slate-500 w-48">套餐名称</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-24">类型</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-32 text-right">价格 (元)</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-24 text-right">使用有效期(月)</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-32">资源额度</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-48">关联产品</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-24">状态</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-40">更新时间</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-48">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPackages.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-20 text-center text-slate-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                paginatedPackages.map(pkg => (
                  <React.Fragment key={pkg.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium truncate" title={pkg.name}>{pkg.name}</td>
                      <td className="px-6 py-4 text-slate-600 truncate" title={pkg.type}>{pkg.type}</td>
                      <td className="px-6 py-4 text-slate-600 text-right">{pkg.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-600 text-right">{pkg.serviceLife}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <button 
                          onClick={() => toggleRowExpand(pkg.id)} 
                          className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          查看额度
                          {expandedRows.has(pkg.id) ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-600 truncate max-w-[12rem]" title={pkg.products}>{pkg.products || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_MAP[pkg.status].color}`}>
                          {STATUS_MAP[pkg.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 truncate">{pkg.updateTime}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {pkg.status === 'draft' && (
                            <>
                              <button onClick={() => changeStatus(pkg.id, 'enabled')} className="text-green-600 hover:text-green-700 text-xs flex items-center"><Play className="w-3 h-3 mr-1" /> 启用</button>
                              <button onClick={() => handleOpenEdit(pkg)} className="text-[#108ee9] hover:text-blue-700 text-xs flex items-center"><Edit2 className="w-3 h-3 mr-1" /> 编辑</button>
                              <button onClick={() => handleDelete(pkg.id)} className="text-red-500 hover:text-red-600 text-xs flex items-center"><Trash2 className="w-3 h-3 mr-1" /> 删除</button>
                            </>
                          )}
                          {pkg.status === 'enabled' && (
                            <>
                              <button onClick={() => changeStatus(pkg.id, 'disabled')} className="text-orange-500 hover:text-orange-600 text-xs flex items-center"><Square className="w-3 h-3 mr-1" /> 停用</button>
                              <button onClick={() => changeStatus(pkg.id, 'draft')} className="text-slate-600 hover:text-slate-700 text-xs flex items-center"><ArrowLeft className="w-3 h-3 mr-1" /> 退回草稿</button>
                              <button onClick={() => handleOpenEdit(pkg)} className="text-[#108ee9] hover:text-blue-700 text-xs flex items-center"><Edit2 className="w-3 h-3 mr-1" /> 编辑</button>
                            </>
                          )}
                          {pkg.status === 'disabled' && (
                            <>
                              <button onClick={() => changeStatus(pkg.id, 'enabled')} className="text-green-600 hover:text-green-700 text-xs flex items-center"><Play className="w-3 h-3 mr-1" /> 启用</button>
                              <button onClick={() => changeStatus(pkg.id, 'archived')} className="text-slate-600 hover:text-slate-700 text-xs flex items-center"><Archive className="w-3 h-3 mr-1" /> 归档</button>
                            </>
                          )}
                          {pkg.status === 'archived' && (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(pkg.id) && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-4 gap-4 text-sm bg-white p-4 rounded border border-slate-200 ml-12 mr-12 shadow-sm">
                            <div>
                              <span className="text-slate-500 block mb-1">实验时长（分钟）</span>
                              <span className="text-slate-800 font-medium text-lg">{pkg.duration.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-1">token（数量）</span>
                              <span className="text-slate-800 font-medium text-lg">{pkg.tokenCount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-1">PPT次数</span>
                              <span className="text-slate-800 font-medium text-lg">{pkg.pptCount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-1">账号数量</span>
                              <span className="text-slate-800 font-medium text-lg">{pkg.accountCount.toLocaleString()}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-white shrink-0">
            <div className="flex items-center text-sm text-slate-600">
              共 {totalItems} 条记录
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-4 border-slate-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={20}>20 条/页</option>
                <option value={50}>50 条/页</option>
                <option value={100}>100 条/页</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] h-8 rounded text-sm font-medium transition-colors ${
                        currentPage === pageNum 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">{modalMode === 'add' ? '新增套餐' : '编辑套餐'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-500 transition-colors">
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 套餐名称</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入套餐名称" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 套餐类型</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={`w-full px-3 py-2 border ${errors.type ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}>
                    <option value="UUSIMA">UUSIMA</option>
                    <option value="陆产通">陆产通</option>
                  </select>
                  {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">实验时长（分钟）</label>
                  <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className={`w-full px-3 py-2 border ${errors.duration ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入实验时长" />
                  {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">token（数量）</label>
                  <input type="number" value={formData.tokenCount} onChange={e => setFormData({...formData, tokenCount: e.target.value})} className={`w-full px-3 py-2 border ${errors.tokenCount ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入token数量" />
                  {errors.tokenCount && <p className="text-xs text-red-500">{errors.tokenCount}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">账号数量</label>
                  <input type="number" value={formData.accountCount} onChange={e => setFormData({...formData, accountCount: e.target.value})} className={`w-full px-3 py-2 border ${errors.accountCount ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入账号数量" />
                  {errors.accountCount && <p className="text-xs text-red-500">{errors.accountCount}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">PPT次数</label>
                  <input type="number" value={formData.pptCount} onChange={e => setFormData({...formData, pptCount: e.target.value})} className={`w-full px-3 py-2 border ${errors.pptCount ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入PPT次数" />
                  {errors.pptCount && <p className="text-xs text-red-500">{errors.pptCount}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 使用有效期(月)</label>
                  <input type="number" step="1" min="1" max="1200" value={formData.serviceLife} onChange={e => setFormData({...formData, serviceLife: e.target.value})} className={`w-full px-3 py-2 border ${errors.serviceLife ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入使用有效期(月)" />
                  {errors.serviceLife && <p className="text-xs text-red-500">{errors.serviceLife}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 套餐价格(元)</label>
                  <input type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入套餐价格" />
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium text-slate-700">关联产品</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {['AI技能分析系统', '智能体应用系统', '知识库应用系统', '硬件智能体系统'].map(prod => (
                      <label key={prod} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={formData.products.includes(prod)} onChange={() => handleProductToggle(prod)} className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-slate-700">{prod}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded bg-white hover:bg-slate-50 transition-colors text-sm font-medium">取消</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#108ee9] text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
