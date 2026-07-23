import React, { useState } from 'react';
import { Search, Edit2, Trash2, Shield, ShoppingCart, Users, Activity, X, MoreHorizontal, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// We will import these if they exist, but they are full pages.
import TenantResourceOverview from './TenantResourceOverview';
import TenantAuthManagement from './TenantAuthManagement';
import TenantDataOverview from './TenantDataOverview';
import OrdersManagement from './OrdersManagement';
import UsersManagement from './UsersManagement';

interface Tenant {
  onlineStatus: 'online' | 'offline';
  lastOnlineTime: string;
  id: string;
  createTime: string;
  name: string;
  type: string;
  city: string;
  updateTime: string;
  status: 'enabled' | 'disabled';
  schoolLevel?: string;
  subCollege?: string;
}

export default function PrivateTenants() {
    const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      createTime: '2026-07-22 10:00:00',
      name: '上海某某大学',
      type: '学校',
      city: '上海',
      updateTime: '2026-07-22 14:30:00',
      status: 'enabled',
      onlineStatus: 'online',
      lastOnlineTime: '2023-11-20 14:30:00',
      schoolLevel: '本科',
      subCollege: '计算机科学与技术学院'
    },
    {
      id: '2',
      createTime: '2026-07-20 09:15:00',
      name: '测试企业租户A',
      type: '企业',
      city: '北京',
      updateTime: '2026-07-21 16:45:00',
      status: 'enabled',
      onlineStatus: 'offline',
      lastOnlineTime: '2023-11-18 09:15:00'
    },
    {
      id: '3',
      createTime: '2026-07-15 11:20:00',
      name: '浙江大学',
      type: '学校',
      city: '杭州',
      updateTime: '2026-07-20 09:00:00',
      status: 'disabled',
      onlineStatus: 'offline',
      lastOnlineTime: '2023-11-01 11:45:00',
      schoolLevel: '本科',
      subCollege: '软件学院'
    }
  ]);

  const [searchParams, setSearchParams] = useState({
    type: '',
    city: '',
    name: ''
  });
  const [onlineStatusFilter, setOnlineStatusFilter] = useState('all');
  const [lastOnlineTimeSort, setLastOnlineTimeSort] = useState<'none' | 'asc' | 'desc'>('none');

    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

    const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTenantIds(currentTenants.map(t => t.id));
    } else {
      setSelectedTenantIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedTenantIds(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleBatchStatusChange = (status: 'enabled' | 'disabled') => {
    setTenants(prev => prev.map(t => 
      selectedTenantIds.includes(t.id) ? { ...t, status } : t
    ));
    setSelectedTenantIds([]); // clear selection after action
  };

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '学校',
    city: '',
    schoolLevel: '本科',
    subCollege: ''
  });

  const handleAddClick = () => {
    setFormMode('add');
    setEditingId(null);
    setFormData({ name: '', type: '学校', city: '', schoolLevel: '本科', subCollege: '' });
    setIsFormModalOpen(true);
  };

  const handleEditClick = (tenant: Tenant) => {
    setFormMode('edit');
    setEditingId(tenant.id);
    setFormData({
      name: tenant.name,
      type: tenant.type,
      city: tenant.city || '',
      schoolLevel: tenant.schoolLevel || '本科',
      subCollege: tenant.subCollege || ''
    });
    setIsFormModalOpen(true);
  };

  const handleAddTenant = () => {
    if (formMode === 'add') {
      const t: Tenant = {
        id: Math.random().toString(36).substr(2, 9),
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        name: formData.name,
        type: formData.type as '企业' | '学校',
        city: formData.city,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'enabled',
        onlineStatus: 'offline',
        lastOnlineTime: '-',
        schoolLevel: formData.type === '学校' ? formData.schoolLevel : undefined,
        subCollege: formData.type === '学校' ? formData.subCollege : undefined
      };
      setTenants([t, ...tenants]);
    } else {
      setTenants(prev => prev.map(t => 
        t.id === editingId ? {
          ...t,
          name: formData.name,
          type: formData.type as '企业' | '学校',
          city: formData.city,
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          schoolLevel: formData.type === '学校' ? formData.schoolLevel : undefined,
          subCollege: formData.type === '学校' ? formData.subCollege : undefined
        } : t
      ));
    }
    setIsFormModalOpen(false);
  };

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'resource' | 'orders' | 'auth' | 'data' | null;
    tenant: Tenant | null;
  }>({
    isOpen: false,
    type: null,
    tenant: null
  });

        let filteredTenants = tenants.filter(t => {
    return (
      (searchParams.type === '' || t.type === searchParams.type) &&
      (searchParams.city === '' || t.city.includes(searchParams.city)) &&
      (searchParams.name === '' || t.name.includes(searchParams.name)) &&
      (onlineStatusFilter === 'all' || t.onlineStatus === onlineStatusFilter)
    );
  });
  
  if (lastOnlineTimeSort !== 'none') {
    filteredTenants.sort((a, b) => {
      if (a.lastOnlineTime === '-' && b.lastOnlineTime === '-') return 0;
      if (a.lastOnlineTime === '-') return 1;
      if (b.lastOnlineTime === '-') return -1;
      const timeA = new Date(a.lastOnlineTime).getTime();
      const timeB = new Date(b.lastOnlineTime).getTime();
      return lastOnlineTimeSort === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }
  
  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const currentTenants = filteredTenants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openModal = (type: 'resource' | 'orders' | 'auth' | 'data', tenant: Tenant) => {
    setModalState({ isOpen: true, type, tenant });
    
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, tenant: null });
  };

  const renderModalContent = () => {
    if (!modalState.tenant) return null;

    let content = null;
    switch (modalState.type) {
      case 'resource':
        content = <TenantResourceOverview tenantType="private" />;
        break;
      case 'orders':
        content = <OrdersManagement hideTenantSearch={true} presetTenantId={modalState.tenant.id} presetTenantName={modalState.tenant.name} />;
        break;
            case 'auth':
        content = <TenantAuthManagement tenant={modalState.tenant} />;
        break;
      case 'data':
        content = <TenantDataOverview />;
        break;
      default:
        content = null;
    }

    return (
      <div className="flex flex-col h-[85vh] bg-slate-50">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
          <h3 className="text-lg font-semibold text-slate-800">
            {modalState.tenant.name} - {
              modalState.type === 'resource' ? '资源总览' :
              modalState.type === 'orders' ? '订购订单' :
              modalState.type === 'auth' ? '授权管理' : '数据概览'
            }
          </h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto relative p-4">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Search Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">租户类型：</span>
                    <select 
            value={searchParams.type}
            onChange={e => setSearchParams({...searchParams, type: e.target.value})}
            className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="学校">学校</option>
            <option value="企业">企业</option>
            <option value="机构">机构</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">所在城市：</span>
          <input 
            type="text" 
            placeholder="请输入城市" 
            value={searchParams.city}
            onChange={e => setSearchParams({...searchParams, city: e.target.value})}
            className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">租户名称：</span>
          <input 
            type="text" 
            placeholder="请输入租户名称" 
            value={searchParams.name}
            onChange={e => setSearchParams({...searchParams, name: e.target.value})}
            className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">在线状态：</span>
          <select 
            value={onlineStatusFilter}
            onChange={(e) => setOnlineStatusFilter(e.target.value)}
            className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">全部</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <button 
            onClick={() => setSearchParams({type: '', city: '', name: ''})}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm"
          >
            重置
          </button>
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center">
            <Search className="w-3.5 h-3.5 mr-1.5" />
            查询
          </button>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleAddClick}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center"
        >
          <span className="mr-1">+</span> 新增租户
        </button>

        <button 
          onClick={() => handleBatchStatusChange('enabled')}
          disabled={selectedTenantIds.length === 0}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          批量启用
        </button>
        <button 
          onClick={() => handleBatchStatusChange('disabled')}
          disabled={selectedTenantIds.length === 0}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          批量禁用
        </button>
      </div>

      {/* List Area */}
      <div className="bg-white border text-card-foreground shadow-sm rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={currentTenants.length > 0 && selectedTenantIds.length === currentTenants.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 font-medium text-slate-500">创建时间</th>
                <th className="px-6 py-4 font-medium text-slate-500">租户名称</th>
                <th className="px-6 py-4 font-medium text-slate-500">租户类型</th>
                <th className="px-6 py-4 font-medium text-slate-500">所在城市</th>
                                <th className="px-6 py-4 font-medium text-slate-500">在线状态</th>
                <th className="px-6 py-4 font-medium text-slate-500 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => setLastOnlineTimeSort(prev => prev === 'none' ? 'desc' : prev === 'desc' ? 'asc' : 'none')}>
                  <div className="flex items-center">
                    最近上线时间
                    <div className="ml-1 flex flex-col text-[8px] leading-[8px]">
                      <ChevronUp className={`w-3 h-3 -mb-1 ${lastOnlineTimeSort === 'asc' ? 'text-blue-600' : 'text-slate-300'}`} />
                      <ChevronDown className={`w-3 h-3 ${lastOnlineTimeSort === 'desc' ? 'text-blue-600' : 'text-slate-300'}`} />
                    </div>
                  </div>
                </th>

                <th className="px-6 py-4 font-medium text-slate-500 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentTenants.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedTenantIds.includes(tenant.id)}
                      onChange={() => handleSelectOne(tenant.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-700">{tenant.createTime}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{tenant.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        tenant.type === '学校' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {tenant.type}
                      </span>
                      {tenant.type === '学校' && (
                        <div className="relative group ml-2 flex items-center">
                          <Info className="w-4 h-4 text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50">
                            <div className="bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                              <div className="flex flex-col space-y-1">
                                <div><span className="text-slate-400">学校层次：</span>{tenant.schoolLevel || '-'}</div>
                                <div><span className="text-slate-400">所在城市：</span>{tenant.city || '-'}</div>
                                <div><span className="text-slate-400">二级学院：</span>{tenant.subCollege || '-'}</div>
                              </div>
                              <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{tenant.city}</td>
                                    <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tenant.onlineStatus === 'online' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}>
                      {tenant.onlineStatus === 'online' ? '在线' : '离线'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{tenant.lastOnlineTime}</td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => openModal('resource', tenant)}
                        className="text-[#108ee9] hover:text-blue-700 font-medium text-xs transition-colors"
                      >
                        资源总览
                      </button>
                      <button 
                        onClick={() => openModal('orders', tenant)}
                        className="text-[#108ee9] hover:text-blue-700 font-medium text-xs transition-colors"
                      >
                        订购订单
                      </button>
                                            <button 
                        onClick={() => openModal('auth', tenant)}
                        className="text-[#108ee9] hover:text-blue-700 font-medium text-xs transition-colors"
                      >
                        授权管理
                      </button>
                      <button 
                        onClick={() => openModal('data', tenant)}
                        className="text-[#108ee9] hover:text-blue-700 font-medium text-xs transition-colors"
                      >
                        数据概览
                      </button>
                      <button 
                        onClick={() => handleEditClick(tenant)}
                        className="text-[#108ee9] hover:text-blue-700 font-medium text-xs transition-colors"
                      >
                        编辑
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-600 font-medium text-xs transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    暂无租户数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Component */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="text-sm text-slate-500">
            共 {filteredTenants.length} 条记录，第 {currentPage} / {Math.max(1, totalPages)} 页
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded text-sm flex items-center justify-center transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setIsFormModalOpen(false)}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">{formMode === 'add' ? '新增租户' : '编辑租户'}</h3>
                <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">租户名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="请输入租户名称" 
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">租户类型 <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="学校">学校</option>
                    <option value="机构">机构</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">所在城市 (省市区) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder="例：浙江省杭州市西湖区" 
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>

                {formData.type === '学校' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">学校层次 <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.schoolLevel}
                        onChange={e => setFormData({...formData, schoolLevel: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="本科">本科</option>
                        <option value="高职">高职</option>
                        <option value="独立学院">独立学院</option>
                        <option value="中职中专">中职中专</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">二级学院名称 (非必填)</label>
                      <input 
                        type="text" 
                        value={formData.subCollege}
                        onChange={e => setFormData({...formData, subCollege: e.target.value})}
                        placeholder="请输入二级学院名称" 
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-200 space-x-3">
                <button 
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm hover:bg-slate-100 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddTenant}
                  disabled={!formData.name || !formData.city}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={closeModal}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-7xl overflow-hidden relative z-10"
            >
              {renderModalContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
