import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, AlertCircle, X } from 'lucide-react';

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
    coreElements: '4K显示, 多点触控'
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
    coreElements: '文本生成, 智能问答'
  }
];

export default function ProductsManagement() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  const initialFormData: Omit<ProductItem, 'id'> = {
    name: '',
    status: '启用',
    model: '',
    type: '',
    partNumber: '',
    customerPrice: '',
    salesLimitPrice: '',
    coreElements: ''
  };
  
  const [formData, setFormData] = useState<Omit<ProductItem, 'id'>>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Omit<ProductItem, 'id'>, string>>>({});
  
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
  
  const handleChange = (field: keyof Omit<ProductItem, 'id'>, value: string) => {
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
            const { id, ...rest } = p;
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
    const errors: Partial<Record<keyof Omit<ProductItem, 'id'>, string>> = {};
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
    // 自动剔除首尾空格
    const cleanFormData = {
      ...formData,
      name: formData.name.trim()
    };
    
    setFormData(prev => ({ ...prev, name: cleanFormData.name }));
    
    if (validateForm()) {
      if (modalMode === 'add') {
        const newProduct: ProductItem = {
          ...cleanFormData,
          id: Date.now()
        };
        setProducts([newProduct, ...products]);
      } else {
        setProducts(products.map(p => p.id === editingId ? { ...cleanFormData, id: p.id } : p));
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search Area */}
      <div className="mb-4 bg-slate-50/50 border border-slate-200 rounded-lg p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">名称：</span>
          <input type="text" placeholder="请输入名称" className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">型号：</span>
          <input type="text" placeholder="请输入型号" className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">料号：</span>
          <input type="text" placeholder="请输入料号" className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm">
          查询
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm">
          重置
        </button>
      </div>

      {/* Action Area */}
      <div className="mb-4 flex space-x-3">
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
      <div className="flex-1 overflow-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[max-content]">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500 w-12">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="px-6 py-4 font-medium text-slate-500">产品名称</th>
              <th className="px-6 py-4 font-medium text-slate-500">状态</th>
              <th className="px-6 py-4 font-medium text-slate-500">型号</th>
              <th className="px-6 py-4 font-medium text-slate-500">类型</th>
              <th className="px-6 py-4 font-medium text-slate-500">料号</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-right">客户价 (元)</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-right">销售限价 (元)</th>
              <th className="px-6 py-4 font-medium text-slate-500">核心要素</th>
              <th className="px-6 py-4 font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td className="px-6 py-4 text-slate-700 font-medium">{product.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{product.model || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{product.type || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{product.partNumber || '-'}</td>
                <td className="px-6 py-4 text-slate-600 text-right">{product.customerPrice ? Number(product.customerPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}</td>
                <td className="px-6 py-4 text-slate-600 text-right">{product.salesLimitPrice ? Number(product.salesLimitPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}</td>
                <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate" title={product.coreElements}>{product.coreElements || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleOpenEdit(product)} className="text-[#108ee9] hover:text-blue-700 transition-colors flex items-center text-sm">
                      <Edit2 className="w-3 h-3 mr-1" /> 编辑
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600 transition-colors flex items-center text-sm">
                      <Trash2 className="w-3 h-3 mr-1" /> 删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-slate-500">暂无数据</td>
              </tr>
            )}
          </tbody>
        </table>
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
