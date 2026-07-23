import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface PointRule {
  id: number;
  name: string;
  type: string;
  value: number;
  exchangeRate: string;
}

export default function BillingPoints() {
  const [rules, setRules] = useState<PointRule[]>([
    { id: 1, name: '词元兑换', type: 'token', value: 100, exchangeRate: '1积分 = 100 词元(token)' },
    { id: 2, name: 'PPT生成兑换', type: 'ppt', value: 1, exchangeRate: '1积分 = 1 次PPT生成' },
    { id: 3, name: '实验时长兑换', type: 'duration', value: 60, exchangeRate: '1积分 = 60 实验时长（分钟）' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const initialFormData = {
    type: 'token',
    value: '' as number | ''
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

  const handleOpenEdit = (rule: PointRule) => {
    setModalMode('edit');
    setEditingId(rule.id);
    setFormData({
      type: rule.type,
      value: rule.value
    });
    setErrors({});
    setShowAddModal(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) {
      newErrors.type = '请选择积分项类型';
    }

    if (formData.value === '') {
      newErrors.value = '请输入兑换数值';
    } else {
      const v = Number(formData.value);
      if (v <= 0) {
        newErrors.value = '必须大于0';
      } else if (!Number.isInteger(v)) {
        newErrors.value = '必须为整数';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const value = Number(formData.value);
    let name = '';
    let unit = '';
    if (formData.type === 'token') {
      name = '词元兑换';
      unit = '词元(token)';
    } else if (formData.type === 'ppt') {
      name = 'PPT生成兑换';
      unit = '次PPT生成';
    } else if (formData.type === 'duration') {
      name = '实验时长兑换';
      unit = '实验时长（分钟）';
    }

    const exchangeRate = `1积分 = ${value} ${unit}`;

    const submittedData = {
      name,
      type: formData.type,
      value,
      exchangeRate
    };

    if (modalMode === 'add') {
      setRules([...rules, { ...submittedData, id: Date.now() }]);
    } else {
      setRules(rules.map(r => r.id === editingId ? { ...submittedData, id: r.id } : r));
    }
    setShowAddModal(false);
  };


  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="mb-4">
        <button 
          onClick={handleOpenAdd}
          className="flex items-center px-4 py-2 bg-[#108ee9] text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          新增积分项
        </button>
      </div>

      <div className="flex-1 overflow-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">规则名称</th>
              <th className="px-6 py-4 font-medium text-slate-500">兑换比例</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rules.map(rule => (
              <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-700 font-medium">{rule.name}</td>
                <td className="px-6 py-4 text-slate-600">{rule.exchangeRate}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button onClick={() => handleOpenEdit(rule)} className="text-[#108ee9] hover:text-blue-700 transition-colors flex items-center text-sm">
                      <Edit2 className="w-3 h-3 mr-1" /> 编辑
                    </button>
                    <button className="text-red-500 hover:text-red-600 transition-colors flex items-center text-sm">
                      <Trash2 className="w-3 h-3 mr-1" /> 删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">{modalMode === 'add' ? '新增积分项' : '编辑积分项'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-500 transition-colors">
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 积分项类型</label>
                <select disabled={modalMode === 'edit'} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={`w-full px-3 py-2 border ${errors.type ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${modalMode === 'edit' ? 'bg-slate-100' : ''}`}>
                  <option value="token">词元(token)</option>
                  <option value="ppt">PPT生成</option>
                  <option value="duration">实验时长（分钟）</option>
                </select>
                {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 兑换数值 (1积分=)</label>
                <input type="number" min="1" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className={`w-full px-3 py-2 border ${errors.value ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="请输入兑换数值" />
                {errors.value && <p className="text-xs text-red-500">{errors.value}</p>}
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
