import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, AlertCircle, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  status: '启用' | '禁用';
  model: string;
  type: string;
  partNumber: string;
  customerPrice: string;
  salesLimitPrice: string;
  coreElements: string;
  updateTime: string;
}

const initialProducts: ProductItem[] = [
  {
    id: 1,
    name: '智能交互白板',
    status: '启用',
    model: 'IB-2023',
    type: '硬件',
    partNumber: 'PN-001',
    customerPrice: '15000',
    salesLimitPrice: '12000',
    coreElements: '4K显示, 多点触控',
    updateTime: '2023-10-25 14:30:00'
  },
  {
    id: 2,
    name: 'AI助手基础版',
    status: '启用',
    model: 'AI-B-v1',
    type: '软件',
    partNumber: 'SW-101',
    customerPrice: '5000',
    salesLimitPrice: '4500',
    coreElements: '文本生成, 智能问答',
    updateTime: '2023-10-26 09:15:00'
  },
  {
    id: 3,
    name: '智能交互白板 Pro',
    status: '禁用',
    model: 'IB-2024P',
    type: '硬件',
    partNumber: 'PN-002',
    customerPrice: '25000',
    salesLimitPrice: '20000',
    coreElements: '8K显示, 多点触控, 语音控制',
    updateTime: '2023-11-01 10:00:00'
  }
];

// Generate some dummy data for pagination testing
for (let i = 4; i <= 45; i++) {
  initialProducts.push({
    id: i,
    name: `测试产品 ${i}`,
    status: i % 3 === 0 ? '禁用' : '启用',
    model: `Model-${i}`,
    type: i % 2 === 0 ? '硬件' : '软件',
    partNumber: `PN-${100 + i}`,
    customerPrice: `${1000 * i}`,
    salesLimitPrice: `${800 * i}`,
    coreElements: `核心要素 ${i}`,
    updateTime: `2023-11-${String((i % 30) + 1).padStart(2, '0')} 10:00:00`
  });
}

interface SearchCondition {
  name: string;
  model: string;
  partNumber: string;
  status: 'all' | 'enabled' | 'disabled';
}

const initialSearchCondition: SearchCondition = {
  name: '',
  model: '',
  partNumber: '',
  status: 'all'
};

export default function ProductsManagement() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  
  // Search State
  const [searchCondition, setSearchCondition] = useState<SearchCondition>(initialSearchCondition);
  const [appliedSearchCondition, setAppliedSearchCondition] = useState<SearchCondition>(initialSearchCondition);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  const initialFormData: Omit<ProductItem, 'id' | 'updateTime'> = {
    name: '',
    status: '启用',
    model: '',
    type: '',
    partNumber: '',
    customerPrice: '',
    salesLimitPrice: '',
    coreElements: ''
  };
  
  const [formData, setFormData] = useState<Omit<ProductItem, 'id' | 'updateTime'>>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Omit<ProductItem, 'id' | 'updateTime'>, string>>>({});
  
  const handleSearch = () => {
    setIsSearching(true);
    setSearchError(false);
    
    // Simulate network request
    setTimeout(() => {
      // Simulate random error for demonstration (10% chance)
      if (Math.random() > 0.9) {
        setSearchError(true);
        setIsSearching(false);
        return;
      }
      
      setAppliedSearchCondition(searchCondition);
      setCurrentPage(1);
      setIsSearching(false);
    }, 500);
  };

  const handleReset = () => {
    setSearchCondition(initialSearchCondition);
    setAppliedSearchCondition(initialSearchCondition);
    setCurrentPage(1);
    setSearchError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingId(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
    setShowConfirmClose(false);
  };
  
  const handleOpenEdit = (product: ProductItem) => {
    setModalMode('edit');
    setEditingId(product.id);
    setFormData({
      name: product.name,
      status: product.status,
      model: product.model,
      type: product.type,
      partNumber: product.partNumber,
      customerPrice: product.customerPrice,
      salesLimitPrice: product.salesLimitPrice,
      coreElements: product.coreElements
    });
    setFormErrors({});
    setShowModal(true);
    setShowConfirmClose(false);
  };
  
  const handleChange = (field: keyof Omit<ProductItem, 'id' | 'updateTime'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  const handleCloseAttempt = () => {
    const isDirty = modalMode === 'add' 
      ? JSON.stringify(formData) !== JSON.stringify(initialFormData)
      : JSON.stringify(formData) !== JSON.stringify(
          (() => {
            const p = products.find(p => p.id === editingId);
            if (!p) return {};
            const { id, updateTime, ...rest } = p;
            return rest;
          })()
        );
      
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      setShowModal(false);
      setShowConfirmClose(false);
    }
  };

  const confirmClose = () => {
    setShowModal(false);
    setShowConfirmClose(false);
  };

  const cancelClose = () => {
    setShowConfirmClose(false);
  };
  
  const validateForm = () => {
    const errors: Partial<Record<keyof Omit<ProductItem, 'id' | 'updateTime'>, string>> = {};
    let isValid = true;
    
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errors.name = '请输入产品名称';
      isValid = false;
    } else if (trimmedName.length > 50) {
      errors.name = '产品名称不能超过50个字符';
      isValid = false;
    }
    
    if (!formData.status) {
      errors.status = '请选择状态';
      isValid = false;
    }
    
    if (formData.model && formData.model.length > 50) {
      errors.model = '型号不能超过50个字符';
      isValid = false;
    }
    
    if (formData.type && formData.type.length > 50) {
      errors.type = '类型不能超过50个字符';
      isValid = false;
    }
    
    if (formData.partNumber) {
      if (formData.partNumber.length > 50) {
        errors.partNumber = '料号不能超过50个字符';
        isValid = false;
      } else if (!/^[A-Za-z0-9\-_]+$/.test(formData.partNumber)) {
        errors.partNumber = '料号只能包含英文字母、数字及连字符(-、_)';
        isValid = false;
      }
    }
    
    if (formData.customerPrice) {
      if (!/^\d+(\.\d{1,2})?$/.test(formData.customerPrice)) {
        errors.customerPrice = '请输入非负数值，最多保留2位小数';
        isValid = false;
      }
    }
    
    if (formData.salesLimitPrice) {
      if (!/^\d+(\.\d{1,2})?$/.test(formData.salesLimitPrice)) {
        errors.salesLimitPrice = '请输入非负数值，最多保留2位小数';
        isValid = false;
      }
    }
    
    if (formData.coreElements && formData.coreElements.length > 500) {
      errors.coreElements = '核心要素不能超过500个字符';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSave = () => {
    const cleanFormData = {
      ...formData,
      name: formData.name.trim()
    };
    
    setFormData(prev => ({ ...prev, name: cleanFormData.name }));
    
    if (validateForm()) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      if (modalMode === 'add') {
        const newProduct: ProductItem = {
          ...cleanFormData,
          id: Date.now(),
          updateTime: now
        };
        setProducts([newProduct, ...products]);
      } else {
        setProducts(products.map(p => p.id === editingId ? { ...cleanFormData, id: p.id, updateTime: now } : p));
      }
      setShowModal(false);
      setShowConfirmClose(false);
    }
  };

  const handleDelete = (id: number) => {
    setProductToDelete(id);
  };

  const executeDelete = () => {
    if (productToDelete !== null) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
  };

  // Filter and Sort Logic
  const filteredProducts = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(appliedSearchCondition.name.trim().toLowerCase());
    const matchModel = appliedSearchCondition.model.trim() === '' || (p.model && p.model.toLowerCase().includes(appliedSearchCondition.model.trim().toLowerCase()));
    const matchPartNumber = appliedSearchCondition.partNumber.trim() === '' || (p.partNumber && p.partNumber.toLowerCase().includes(appliedSearchCondition.partNumber.trim().toLowerCase()));
    
    const matchStatus = appliedSearchCondition.status === 'all' || 
      (appliedSearchCondition.status === 'enabled' && p.status === '启用') ||
      (appliedSearchCondition.status === 'disabled' && p.status === '禁用');

    return matchName && matchModel && matchPartNumber && matchStatus;
  }).sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime());

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Search Area */}
      <div className="mb-4 bg-slate-50/50 border border-slate-200 rounded-lg p-4 flex flex-wrap gap-4 items-center shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">名称：</span>
          <input 
            ref={nameInputRef}
            type="text" 
            placeholder="请输入名称" 
            value={searchCondition.name}
            onChange={(e) => setSearchCondition(prev => ({ ...prev, name: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">型号：</span>
          <input 
            type="text" 
            placeholder="请输入型号" 
            value={searchCondition.model}
            onChange={(e) => setSearchCondition(prev => ({ ...prev, model: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">料号：</span>
          <input 
            type="text" 
            placeholder="请输入料号" 
            value={searchCondition.partNumber}
            onChange={(e) => setSearchCondition(prev => ({ ...prev, partNumber: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">状态：</span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input 
                type="radio" 
                name="statusSearch" 
                value="all" 
                checked={searchCondition.status === 'all'}
                onChange={() => setSearchCondition(prev => ({ ...prev, status: 'all' }))}
                className="text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-slate-700">全部</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input 
                type="radio" 
                name="statusSearch" 
                value="enabled" 
                checked={searchCondition.status === 'enabled'}
                onChange={() => setSearchCondition(prev => ({ ...prev, status: 'enabled' }))}
                className="text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-slate-700">启用</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input 
                type="radio" 
                name="statusSearch" 
                value="disabled" 
                checked={searchCondition.status === 'disabled'}
                onChange={() => setSearchCondition(prev => ({ ...prev, status: 'disabled' }))}
                className="text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-slate-700">禁用</span>
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSearching ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : null}
            搜索
          </button>
          <button 
            onClick={handleReset}
            disabled={isSearching}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            重置
          </button>
        </div>
      </div>

      {/* Action Area */}
      <div className="mb-4 flex space-x-3 shrink-0">
        <button 
          onClick={handleOpenAdd}
          className="flex items-center px-4 py-2 bg-[#108ee9] text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          新增
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-red-500 rounded hover:bg-red-50 transition-colors text-sm font-medium shadow-sm">
          <Trash2 className="w-4 h-4 mr-2" />
          批量删除
        </button>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto border border-slate-200 rounded-lg flex flex-col bg-white">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[max-content] table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4 font-medium text-slate-500 w-48">产品名称</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-24">类型</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-32">型号</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-32">料号</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-32 text-right">客户价 (元)</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-32 text-right">销售限价 (元)</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-24">状态</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-40">更新时间</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-64">核心要素</th>
                <th className="px-6 py-4 font-medium text-slate-500 w-32">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isSearching ? (
                <tr>
                  <td colSpan={11} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                      <p>正在加载数据...</p>
                    </div>
                  </td>
                </tr>
              ) : searchError ? (
                <tr>
                  <td colSpan={11} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                      <p className="mb-4">数据加载失败</p>
                      <button 
                        onClick={handleSearch}
                        className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors"
                      >
                        重试
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <p>{Object.values(appliedSearchCondition).some(v => v !== '' && v !== 'all') ? '没有找到符合条件的产品' : '暂无数据'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium truncate" title={product.name}>{product.name}</td>
                    <td className="px-6 py-4 text-slate-600 truncate" title={product.type}>{product.type || '-'}</td>
                    <td className="px-6 py-4 text-slate-600 truncate" title={product.model}>{product.model || '-'}</td>
                    <td className="px-6 py-4 text-slate-600 truncate" title={product.partNumber}>{product.partNumber || '-'}</td>
                    <td className="px-6 py-4 text-slate-600 text-right">
                      {product.customerPrice ? Number(product.customerPrice).toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-right">
                      {product.salesLimitPrice ? Number(product.salesLimitPrice).toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate">{product.updateTime}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[16rem]" title={product.coreElements}>{product.coreElements || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(product)} className="text-[#108ee9] hover:text-blue-700 transition-colors flex items-center text-sm">
                          <Edit2 className="w-3 h-3 mr-1" /> 编辑
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600 transition-colors flex items-center text-sm">
                          <Trash2 className="w-3 h-3 mr-1" /> 删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isSearching && !searchError && totalItems > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-white shrink-0">
            <div className="flex items-center text-sm text-slate-600">
              共 {totalItems} 条记录
              <select 
                value={pageSize}
                onChange={handlePageSizeChange}
                className="ml-4 border-slate-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={20}>20 条/页</option>
                <option value={50}>50 条/页</option>
                <option value={100}>100 条/页</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(pageNum)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">{modalMode === 'add' ? '新增产品' : '编辑产品'}</h3>
              <button onClick={handleCloseAttempt} className="text-slate-400 hover:text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                
                {/* 产品名称 */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 产品名称</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`} 
                    placeholder="请输入产品名称" 
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                
                {/* 状态 */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 状态</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as '启用' | '禁用')}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${formErrors.status ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`}
                  >
                    <option value="启用">启用</option>
                    <option value="禁用">禁用</option>
                  </select>
                  {formErrors.status && <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>}
                </div>
                
                {/* 型号 */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">型号</label>
                  <input 
                    type="text" 
                    value={formData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${formErrors.model ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`} 
                    placeholder="请输入型号" 
                  />
                  {formErrors.model && <p className="text-red-500 text-xs mt-1">{formErrors.model}</p>}
                </div>
                
                {/* 类型 */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">类型</label>
                  <input 
                    type="text" 
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${formErrors.type ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`} 
                    placeholder="请输入类型" 
                  />
                  {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
                </div>
                
                {/* 料号 */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">料号</label>
                  <input 
                    type="text" 
                    value={formData.partNumber}
                    onChange={(e) => handleChange('partNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${formErrors.partNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`} 
                    placeholder="例如：SKU-001" 
                  />
                  {formErrors.partNumber && <p className="text-red-500 text-xs mt-1">{formErrors.partNumber}</p>}
                </div>
                
                {/* 客户价 */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">客户价</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.customerPrice}
                    onChange={(e) => handleChange('customerPrice', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${formErrors.customerPrice ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`} 
                    placeholder="0.00" 
                  />
                  {formErrors.customerPrice && <p className="text-red-500 text-xs mt-1">{formErrors.customerPrice}</p>}
                </div>
                
                {/* 销售限价 */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">销售限价</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.salesLimitPrice}
                    onChange={(e) => handleChange('salesLimitPrice', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${formErrors.salesLimitPrice ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`} 
                    placeholder="0.00" 
                  />
                  {formErrors.salesLimitPrice && <p className="text-red-500 text-xs mt-1">{formErrors.salesLimitPrice}</p>}
                </div>
                
                {/* 核心要素 */}
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium text-slate-700">核心要素</label>
                  <textarea 
                    value={formData.coreElements}
                    onChange={(e) => handleChange('coreElements', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${formErrors.coreElements ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`} 
                    placeholder="请输入核心要素、关键参数等" 
                    rows={4}
                  ></textarea>
                  <div className="flex justify-between items-center mt-1">
                    {formErrors.coreElements ? (
                      <p className="text-red-500 text-xs">{formErrors.coreElements}</p>
                    ) : (
                      <span className="text-xs"></span>
                    )}
                    <span className={`text-xs ${formData.coreElements.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>
                      {formData.coreElements.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button onClick={handleCloseAttempt} className="px-4 py-2 border border-slate-300 text-slate-700 rounded bg-white hover:bg-slate-50 transition-colors text-sm font-medium">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#108ee9] text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Close Modal */}
      {showConfirmClose && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认关闭？</h3>
              <p className="text-sm text-slate-600">您填写的内容尚未保存，确认关闭将丢失所有更改。</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button onClick={cancelClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded bg-white hover:bg-slate-50 transition-colors text-sm font-medium">继续编辑</button>
              <button onClick={confirmClose} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium">确认关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {productToDelete !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认删除？</h3>
              <p className="text-sm text-slate-600">删除后将无法恢复，确认要删除此产品吗？</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button onClick={() => setProductToDelete(null)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded bg-white hover:bg-slate-50 transition-colors text-sm font-medium">取消</button>
              <button onClick={executeDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

