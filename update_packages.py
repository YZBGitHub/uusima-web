import re

with open('src/pages/BillingPackage.tsx', 'r') as f:
    content = f.read()

new_imports = """import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';"""
content = content.replace("import React, { useState } from 'react';\nimport { Search, Plus, Edit2, Trash2 } from 'lucide-react';", new_imports)

# Add form state and validation
form_state_code = """
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const initialFormData = {
    name: '',
    type: 'UUSIMA',
    duration: '' as number | '',
    tokenCount: '' as number | '',
    accountCount: '' as number | '',
    pptCount: '' as number | '',
    serviceLife: '' as number | '',
    price: '' as number | '',
    products: [] as string[]
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      duration: pkg.duration || '',
      tokenCount: pkg.tokenCount || '',
      accountCount: pkg.accountCount || '',
      pptCount: pkg.pptCount || '',
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
    } else if (trimmedName.length < 1 || trimmedName.length > 50) {
      newErrors.name = '套餐名称长度限制在 1 ~ 50 个字符之间';
    }
    
    if (!formData.type) {
      newErrors.type = '请选择套餐类型';
    }

    if (formData.duration !== '') {
      const v = Number(formData.duration);
      if (!Number.isInteger(v) || v < 0) newErrors.duration = '必须为正整数或0';
    }
    
    if (formData.tokenCount !== '') {
      const v = Number(formData.tokenCount);
      if (!Number.isInteger(v) || v < 0) newErrors.tokenCount = '必须为正整数或0';
    }

    if (formData.accountCount !== '') {
      const v = Number(formData.accountCount);
      if (!Number.isInteger(v) || v < 0) newErrors.accountCount = '必须为正整数或0';
    }

    if (formData.pptCount !== '') {
      const v = Number(formData.pptCount);
      if (!Number.isInteger(v) || v < 0) newErrors.pptCount = '必须为正整数或0';
    }

    if (formData.serviceLife === '' || Number(formData.serviceLife) <= 0) {
      newErrors.serviceLife = '必须大于 0';
    }

    if (formData.price === '' || Number(formData.price) < 0) {
      newErrors.price = '价格必须非负';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
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
      setPackages([...packages, { ...submittedData, id: Date.now() }]);
    } else {
      setPackages(packages.map(p => p.id === editingId ? { ...submittedData, id: p.id } : p));
    }
    setShowAddModal(false);
  };

  const handleProductToggle = (productName: string) => {
    setFormData(prev => {
      const products = prev.products.includes(productName)
        ? prev.products.filter(p => p !== productName)
        : [...prev.products, productName];
      return { ...prev, products };
    });
  };
"""

content = content.replace("  const [showAddModal, setShowAddModal] = useState(false);", form_state_code)

content = content.replace("onClick={() => setShowAddModal(true)}", "onClick={handleOpenAdd}")
content = content.replace("""<button className="text-[#108ee9] hover:text-blue-700 transition-colors flex items-center text-sm">
                      <Edit2 className="w-3 h-3 mr-1" /> 编辑
                    </button>""", """<button onClick={() => handleOpenEdit(pkg)} className="text-[#108ee9] hover:text-blue-700 transition-colors flex items-center text-sm">
                      <Edit2 className="w-3 h-3 mr-1" /> 编辑
                    </button>""")

# Replace the modal contents
modal_html = """
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
                  <label className="text-sm font-medium text-slate-700">实验时长(分钟)</label>
                  <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className={`w-full px-3 py-2 border ${errors.duration ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入实验时长" />
                  {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">token数量</label>
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
                  <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 使用年限(年)</label>
                  <input type="number" step="0.1" min="0.1" value={formData.serviceLife} onChange={e => setFormData({...formData, serviceLife: e.target.value})} className={`w-full px-3 py-2 border ${errors.serviceLife ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入使用年限" />
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
"""

# Replace from {showAddModal && ( to )}
content = re.sub(r"\{showAddModal && \(.*?\)\}", modal_html, content, flags=re.DOTALL)

with open('src/pages/BillingPackage.tsx', 'w') as f:
    f.write(content)

