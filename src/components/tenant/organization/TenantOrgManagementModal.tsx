import React, { useState, useMemo } from 'react';
import { 
  X, Search, Plus, Edit, Trash2, RotateCw, Settings2, 
  ChevronDown, ChevronRight, Check, Eye, Archive, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EditTopOrgModal, { TopOrgData } from './EditTopOrgModal';
import AddOrgModal, { NewOrgData } from './AddOrgModal';

export interface OrgNode {
  id: string;
  name: string;
  code: string;
  type: string;
  subType?: string;
  parentId?: string | null;
  parentName?: string;
  isClass: boolean;
  major?: string;
  status: 'enabled' | 'disabled' | 'archived';
  contact?: string;
  phone?: string;
  remark?: string;
  children?: OrgNode[];
}

interface TenantOrgManagementModalProps {
  isOpen: boolean;
  tenantName: string;
  tenantType?: string;
  onClose: () => void;
}

export default function TenantOrgManagementModal({
  isOpen,
  tenantName = '二级学院',
  tenantType = '机构',
  onClose
}: TenantOrgManagementModalProps) {
  // 顶级组织数据
  const [topOrg, setTopOrg] = useState<TopOrgData>({
    tenantName: tenantName,
    orgName: tenantType === '学校' ? tenantName : '新大陆教育研究院',
    orgCode: tenantType === '学校' ? 'fjrj_college_01' : 'newland_edu_RI',
    orgType: tenantType === '学校' ? '学校' : '企业',
    subType: tenantType === '学校' ? '高职院校' : '教育科技',
    contact: '',
    phone: '',
    remark: ''
  });

  // 组织列表数据
  const [orgList, setOrgList] = useState<OrgNode[]>([
    {
      id: 'sub_1',
      name: tenantType === '学校' ? '软件工程2023级1班' : '人工智能&物联网研究院',
      code: tenantType === '学校' ? 'SE_2023_01' : 'newland_ai_aiot',
      type: tenantType === '学校' ? '学校' : '企业',
      subType: tenantType === '学校' ? '二级学院' : '科技企业',
      parentId: 'top_1',
      parentName: tenantType === '学校' ? tenantName : '新大陆教育研究院',
      isClass: tenantType === '学校' ? true : false,
      major: tenantType === '学校' ? '软件工程' : '',
      status: 'enabled',
      contact: tenantType === '学校' ? '李老师' : '张教授',
      phone: tenantType === '学校' ? '13900000002' : '13800000001',
      remark: ''
    }
  ]);

  // 当弹窗打开或租户类型/名称改变时，动态同步顶级组织与初始子组织数据
  React.useEffect(() => {
    if (isOpen) {
      const isSchool = tenantType === '学校';
      const defaultTopName = tenantName || (isSchool ? '福州软件职业技术学院' : '新大陆教育研究院');
      setTopOrg({
        tenantName: tenantName,
        orgName: defaultTopName,
        orgCode: isSchool ? 'fjrj_college_01' : 'newland_edu_RI',
        orgType: isSchool ? '学校' : '企业',
        subType: isSchool ? '高职院校' : '教育科技',
        contact: '',
        phone: '',
        remark: ''
      });
      setAddOrgParentName(defaultTopName);

      if (isSchool) {
        setOrgList([
          {
            id: 'sub_school_1',
            name: '软件工程2023级1班',
            code: 'SE_2023_01',
            type: '学校',
            subType: '二级学院',
            parentId: 'top_1',
            parentName: defaultTopName,
            isClass: true,
            major: '软件工程',
            status: 'enabled',
            contact: '李老师',
            phone: '13900000002',
            remark: ''
          },
          {
            id: 'sub_school_2',
            name: '智能技术应用实训中心',
            code: 'AI_LAB_01',
            type: '学校',
            subType: '二级学院',
            parentId: 'top_1',
            parentName: defaultTopName,
            isClass: false,
            major: '',
            status: 'enabled',
            contact: '王主任',
            phone: '13900000003',
            remark: ''
          }
        ]);
      } else {
        setOrgList([
          {
            id: 'sub_ent_1',
            name: '人工智能&物联网研究院',
            code: 'newland_ai_aiot',
            type: '企业',
            subType: '科技企业',
            parentId: 'top_1',
            parentName: defaultTopName,
            isClass: false,
            major: '',
            status: 'enabled',
            contact: '张教授',
            phone: '13800000001',
            remark: ''
          }
        ]);
      }
    }
  }, [isOpen, tenantName, tenantType]);

  // 左侧树搜索与折叠
  const [treeSearchKey, setTreeSearchKey] = useState('');
  const [isTopExpanded, setIsTopExpanded] = useState(true);
  const [selectedTreeId, setSelectedTreeId] = useState<string>('top_1');

  // 右侧筛选表单状态
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    enabled: true,
    disabled: false,
    archived: false
  });
  const [isClassFilter, setIsClassFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchMajor, setSearchMajor] = useState('');
  const [isMajorDropdownOpen, setIsMajorDropdownOpen] = useState(false);

  // 表格多选勾选
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // 子弹窗控制
  const [isEditTopOpen, setIsEditTopOpen] = useState(false);
  const [isAddOrgOpen, setIsAddOrgOpen] = useState(false);
  const [addOrgParentName, setAddOrgParentName] = useState('新大陆教育研究院');
  const [editingOrgData, setEditingOrgData] = useState<NewOrgData | null>(null);

  // 过滤后的表格数据
  const filteredList = useMemo(() => {
    return orgList.filter((item) => {
      // 状态筛选
      const matchEnabled = statusFilters.enabled && item.status === 'enabled';
      const matchDisabled = statusFilters.disabled && item.status === 'disabled';
      const matchArchived = statusFilters.archived && item.status === 'archived';
      if (!matchEnabled && !matchDisabled && !matchArchived) return false;

      // 是否班级
      if (isClassFilter === 'yes' && !item.isClass) return false;
      if (isClassFilter === 'no' && item.isClass) return false;

      // 组织名称
      if (searchName && !item.name.toLowerCase().includes(searchName.toLowerCase())) return false;

      // 组织编码
      if (searchCode && !item.code.toLowerCase().includes(searchCode.toLowerCase())) return false;

      // 专业
      if (searchMajor && item.major !== searchMajor) return false;

      return true;
    });
  }, [orgList, statusFilters, isClassFilter, searchName, searchCode, searchMajor]);

  if (!isOpen) return null;

  // 切换单行状态
  const toggleRowStatus = (id: string) => {
    setOrgList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'enabled' ? 'disabled' : 'enabled'
        };
      }
      return item;
    }));
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowIds.length === 0) return;
    setOrgList(prev => prev.map(item => 
      selectedRowIds.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    setSelectedRowIds([]);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowIds.length === 0) return;
    setOrgList(prev => prev.map(item => 
      selectedRowIds.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    setSelectedRowIds([]);
  };

  // 删除单行
  const handleDeleteRow = (id: string) => {
    setOrgList(prev => prev.filter(item => item.id !== id));
    setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
  };

  // 归档单行
  const handleArchiveRow = (id: string) => {
    setOrgList(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'archived' } : item
    ));
  };

  // 重置筛选
  const handleResetFilter = () => {
    setStatusFilters({ enabled: true, disabled: false, archived: false });
    setIsClassFilter('all');
    setSearchName('');
    setSearchCode('');
    setSearchMajor('');
  };

  // 全选控制
  const isAllSelected = filteredList.length > 0 && selectedRowIds.length === filteredList.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredList.map(i => i.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // 新增/编辑组织机构成功回调
  const handleAddOrgSubmit = (newOrg: NewOrgData) => {
    if (newOrg.id) {
      setOrgList(prev => prev.map(item => item.id === newOrg.id ? {
        ...item,
        name: newOrg.name,
        code: newOrg.code,
        type: newOrg.type,
        subType: newOrg.subType,
        parentName: newOrg.parentName,
        isClass: newOrg.isClass,
        major: newOrg.major,
        contact: newOrg.contact,
        phone: newOrg.phone,
        remark: newOrg.remark
      } : item));
    } else {
      const newItem: OrgNode = {
        id: `sub_${Date.now()}`,
        name: newOrg.name,
        code: newOrg.code,
        type: newOrg.type || '企业',
        subType: newOrg.subType,
        parentId: 'top_1',
        parentName: newOrg.parentName,
        isClass: newOrg.isClass,
        major: newOrg.major,
        status: 'enabled',
        contact: newOrg.contact,
        phone: newOrg.phone,
        remark: newOrg.remark
      };
      setOrgList(prev => [newItem, ...prev]);
    }
    setIsAddOrgOpen(false);
    setEditingOrgData(null);
  };

  const handleOpenEditSubOrg = (sub: OrgNode) => {
    setEditingOrgData({
      id: sub.id,
      parentName: sub.parentName || topOrg.orgName,
      name: sub.name,
      code: sub.code,
      type: sub.type,
      subType: sub.subType || '',
      isClass: sub.isClass,
      major: sub.major || '',
      contact: sub.contact || '',
      phone: sub.phone || '',
      remark: sub.remark || ''
    });
    setAddOrgParentName(sub.parentName || topOrg.orgName);
    setIsAddOrgOpen(true);
  };

  const handleOpenAddSubOrg = (parentName: string) => {
    setEditingOrgData(null);
    setAddOrgParentName(parentName);
    setIsAddOrgOpen(true);
  };

  // 保存顶级组织回调
  const handleEditTopSubmit = (updated: TopOrgData) => {
    setTopOrg(updated);
    setIsEditTopOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* 背景蒙层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 弹窗外壳 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-[1240px] bg-gradient-to-b from-[#e3f0fe] via-[#ecf4fd] to-[#edf4fd] rounded-[28px] shadow-2xl overflow-hidden relative z-10 my-4 border border-white/70 flex flex-col max-h-[92vh]"
          >
            {/* 顶栏 */}
            <div className="px-8 pt-6 pb-4 flex items-center justify-between shrink-0">
              <h2 className="text-[23px] font-bold text-[#1e293b] tracking-tight">
                {tenantName} - 组织管理
              </h2>
              <button
                onClick={onClose}
                type="button"
                className="w-10 h-10 rounded-full bg-white/75 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* 主体卡片 */}
            <div className="px-6 flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(30,58,138,0.02)] border border-blue-50/60 flex-1 flex overflow-hidden">
                {/* 左侧栏：组织树 */}
                <div className="w-64 border-r border-slate-100 p-4 flex flex-col shrink-0 bg-white">
                  {/* 搜索框 */}
                  <div className="relative mb-3">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={treeSearchKey}
                      onChange={(e) => setTreeSearchKey(e.target.value)}
                      placeholder="请输入组织名称搜索"
                      className="w-full h-8 pl-8 pr-3 text-[13px] bg-white border border-[#e2e8f0] rounded-lg text-slate-700 placeholder-[#94a3b8] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]/20 transition"
                    />
                  </div>

                  {/* 树形列表 */}
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-[13px]">
                    {/* 顶级节点 */}
                    <div>
                      <div 
                        onClick={() => setSelectedTreeId('top_1')}
                        className={`group flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                          selectedTreeId === 'top_1' ? 'bg-blue-50/70 text-[#0096fa]' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 overflow-hidden">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsTopExpanded(!isTopExpanded);
                            }}
                            className="text-slate-400 hover:text-slate-600 p-0.5"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTopExpanded ? '' : '-rotate-90'}`} />
                          </button>
                          <span className="truncate font-medium" title={topOrg.orgName}>
                            {topOrg.orgName.length > 6 ? `${topOrg.orgName.substring(0, 6)}...` : topOrg.orgName}
                          </span>
                        </div>
                        {/* 操作图标组 */}
                        <div className="flex items-center space-x-1.5 text-slate-400 group-hover:text-slate-500">
                          <button
                            type="button"
                            title="新增子组织"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddSubOrg(topOrg.orgName);
                            }}
                            className="hover:text-[#0096fa] p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            title="编辑顶级组织机构"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditTopOpen(true);
                            }}
                            className="hover:text-[#0096fa] p-0.5"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                          <button
                            type="button"
                            title="删除"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('顶级组织不支持直接删除');
                            }}
                            className="hover:text-red-500 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        </div>
                      </div>

                      {/* 子节点 */}
                      {isTopExpanded && (
                        <div className="pl-6 pt-1 space-y-1">
                          {orgList
                            .filter(sub => !treeSearchKey || sub.name.includes(treeSearchKey))
                            .map((sub) => (
                              <div
                                key={sub.id}
                                onClick={() => setSelectedTreeId(sub.id)}
                                className={`group flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  selectedTreeId === sub.id ? 'bg-blue-50/70 text-[#0096fa]' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <span className="truncate font-medium" title={sub.name}>
                                  {sub.name.length > 5 ? `${sub.name.substring(0, 5)}...` : sub.name}
                                </span>
                                <div className="flex items-center space-x-1.5 text-slate-400 group-hover:text-slate-500">
                                  <button
                                    type="button"
                                    title="新增子组织"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenAddSubOrg(sub.name);
                                    }}
                                    className="hover:text-[#0096fa] p-0.5"
                                  >
                                    <Plus className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" />
                                  </button>
                                  <button
                                    type="button"
                                    title="编辑"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditSubOrg(sub);
                                    }}
                                    className="hover:text-[#0096fa] p-0.5"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-blue-400" />
                                  </button>
                                  <button
                                    type="button"
                                    title="删除"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteRow(sub.id);
                                    }}
                                    className="hover:text-red-500 p-0.5"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 右侧栏：组织管理工作台 */}
                <div className="flex-1 p-5 overflow-y-auto flex flex-col bg-white">
                  {/* 顶部检索筛选区 */}
                  <div className="space-y-3.5 pb-4 border-b border-slate-100 text-[13px]">
                    {/* 第 1 行：状态多选、是否班级单选、组织机构名称输入 */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-center">
                      {/* 状态多选 */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[#334155] font-medium shrink-0">状态</span>
                        <div className="flex items-center space-x-4">
                          {[
                            { key: 'enabled', label: '启用' },
                            { key: 'disabled', label: '禁用' },
                            { key: 'archived', label: '归档' }
                          ].map((s) => (
                            <label
                              key={s.key}
                              onClick={() => setStatusFilters({ ...statusFilters, [s.key]: !statusFilters[s.key] })}
                              className="flex items-center space-x-1.5 cursor-pointer select-none"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                  statusFilters[s.key]
                                    ? 'bg-[#0096fa] border-[#0096fa] text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {statusFilters[s.key] && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-slate-700">{s.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 是否班级单选 */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[#334155] font-medium shrink-0">是否班级</span>
                        <div className="flex items-center space-x-4">
                          {[
                            { val: 'all', label: '全部' },
                            { val: 'yes', label: '是' },
                            { val: 'no', label: '否' }
                          ].map((item) => (
                            <label
                              key={item.val}
                              onClick={() => setIsClassFilter(item.val as any)}
                              className="flex items-center space-x-1.5 cursor-pointer select-none group"
                            >
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                                  isClassFilter === item.val
                                    ? 'border-[5px] border-[#0096fa] bg-white'
                                    : 'border-2 border-slate-300 bg-white group-hover:border-slate-400'
                                }`}
                              />
                              <span className={isClassFilter === item.val ? 'text-[#0096fa] font-medium' : 'text-slate-700'}>
                                {item.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 组织机构名称 */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[#334155] font-medium shrink-0">组织机构名称</span>
                        <input
                          type="text"
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                          placeholder="请输入组织机构名称"
                          className="flex-1 h-9 px-3 bg-white border border-[#e2e8f0] rounded-lg text-slate-700 placeholder-[#94a3b8] text-[13px] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]/20 transition"
                        />
                      </div>
                    </div>

                    {/* 第 2 行：组织机构编码、专业、搜索/重置按钮 */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                      <div className="flex flex-wrap items-center gap-5">
                        {/* 组织机构编码 */}
                        <div className="flex items-center space-x-2">
                          <span className="text-[#334155] font-medium shrink-0">组织机构编码</span>
                          <input
                            type="text"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            placeholder="请输入组织机构编码"
                            className="w-48 h-9 px-3 bg-white border border-[#e2e8f0] rounded-lg text-slate-700 font-mono placeholder-[#94a3b8] text-[13px] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]/20 transition"
                          />
                        </div>

                        {/* 专业下拉 */}
                        <div className="flex items-center space-x-2 relative">
                          <span className="text-[#334155] font-medium shrink-0">专业</span>
                          <div
                            onClick={() => setIsMajorDropdownOpen(!isMajorDropdownOpen)}
                            className="w-56 h-9 px-3 bg-white border border-[#e2e8f0] rounded-lg text-[13px] flex items-center justify-between cursor-pointer hover:border-slate-300 transition select-none"
                          >
                            <span className={searchMajor ? 'text-slate-700' : 'text-[#94a3b8]'}>
                              {searchMajor || '请选择专业'}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMajorDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>

                          {isMajorDropdownOpen && (
                            <div className="absolute left-10 right-0 top-[40px] z-50 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto py-1">
                              <div
                                onClick={() => {
                                  setSearchMajor('');
                                  setIsMajorDropdownOpen(false);
                                }}
                                className="px-3 py-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer text-[13px]"
                              >
                                全部专业
                              </div>
                              {['计算机应用技术', '软件工程', '人工智能技术应用', '物联网应用技术', '大数据技术'].map((m) => (
                                <div
                                  key={m}
                                  onClick={() => {
                                    setSearchMajor(m);
                                    setIsMajorDropdownOpen(false);
                                  }}
                                  className={`px-3 py-1.5 cursor-pointer text-[13px] hover:bg-blue-50 ${
                                    searchMajor === m ? 'text-[#0096fa] font-medium bg-blue-50/50' : 'text-slate-700'
                                  }`}
                                >
                                  {m}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 搜索 / 重置按钮 */}
                      <div className="flex items-center space-x-2.5">
                        <button
                          type="button"
                          className="h-9 px-4 bg-[#0096fa] hover:bg-[#0087e0] active:bg-[#0078c8] text-white font-medium rounded-lg text-[13px] flex items-center space-x-1.5 shadow-sm transition"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>搜索</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetFilter}
                          className="h-9 px-4 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-600 font-medium rounded-lg text-[13px] flex items-center space-x-1.5 shadow-sm transition"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>重置</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 操作工具栏 */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* + 新增 */}
                      <button
                        type="button"
                        onClick={() => handleOpenAddSubOrg(topOrg.orgName)}
                        className="h-8 px-4 bg-[#0096fa] hover:bg-[#0087e0] text-white font-medium rounded-lg text-[13px] flex items-center space-x-1 shadow-sm transition"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>新增</span>
                      </button>

                      {/* ✓ 批量启用 */}
                      <button
                        type="button"
                        onClick={handleBatchEnable}
                        disabled={selectedRowIds.length === 0}
                        className="h-8 px-3 bg-[#e6f9f0] border border-[#a3e6cd] hover:bg-[#d6f5e8] text-[#059669] font-medium rounded-lg text-[13px] flex items-center space-x-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>批量启用</span>
                      </button>

                      {/* ✕ 批量禁用 */}
                      <button
                        type="button"
                        onClick={handleBatchDisable}
                        disabled={selectedRowIds.length === 0}
                        className="h-8 px-3 bg-[#fff7e8] border border-[#fed7aa] hover:bg-[#ffedd5] text-[#d97706] font-medium rounded-lg text-[13px] flex items-center space-x-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>批量禁用</span>
                      </button>
                    </div>

                    {/* 右侧小工具圆钮 */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {}}
                        className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white hover:bg-slate-50 text-slate-500 flex items-center justify-center transition"
                        title="刷新"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {}}
                        className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white hover:bg-slate-50 text-slate-500 flex items-center justify-center transition"
                        title="列设置"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 表格区 */}
                  <div className="flex-1 overflow-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-[13px] border-collapse">
                      <thead>
                        <tr className="bg-[#f0f5fb] text-slate-600 font-medium border-b border-slate-200/80">
                          <th className="w-10 px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={toggleSelectAll}
                              className="rounded border-slate-300 text-[#0096fa] focus:ring-0 cursor-pointer"
                            />
                          </th>
                          <th className="px-4 py-3">组织机构名称</th>
                          <th className="px-4 py-3">组织机构编码</th>
                          <th className="px-4 py-3">专业</th>
                          <th className="px-4 py-3">上级组织</th>
                          <th className="px-4 py-3 text-center">状态</th>
                          <th className="px-4 py-3 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredList.map((row) => {
                          const isSelected = selectedRowIds.includes(row.id);
                          return (
                            <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-3 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectRow(row.id)}
                                  className="rounded border-slate-300 text-[#0096fa] focus:ring-0 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-3.5">
                                <span 
                                  onClick={() => handleOpenEditSubOrg(row)}
                                  className="text-[#0096fa] hover:underline cursor-pointer font-medium"
                                >
                                  {row.name}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-slate-600 font-mono">
                                {row.code}
                              </td>
                              <td className="px-4 py-3.5 text-slate-500">
                                {row.major || ''}
                              </td>
                              <td className="px-4 py-3.5 text-slate-600">
                                {row.parentName ? `${row.parentName.substring(0, 5)}...` : topOrg.orgName}
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                {/* 天蓝色 Switch 开关 */}
                                <button
                                  type="button"
                                  onClick={() => toggleRowStatus(row.id)}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    row.status === 'enabled' ? 'bg-[#0096fa]' : 'bg-slate-300'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                      row.status === 'enabled' ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <div className="flex items-center justify-center space-x-3 text-[13px]">
                                  <button
                                    type="button"
                                    onClick={() => alert(`组织详情：\n名称: ${row.name}\n编码: ${row.code}`)}
                                    className="text-[#0096fa] hover:text-[#0078c8]"
                                  >
                                    查看
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleArchiveRow(row.id)}
                                    className="text-[#38bdf8] hover:text-[#0ea5e9]"
                                  >
                                    归档
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditSubOrg(row)}
                                    className="text-[#0096fa] hover:text-[#0078c8]"
                                  >
                                    编辑
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRow(row.id)}
                                    className="text-rose-500 hover:text-rose-700"
                                  >
                                    删除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {filteredList.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-[13px]">
                              暂无符合条件的组织数据
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部关闭栏 */}
            <div className="px-8 py-4 flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-6 bg-[#0096fa] hover:bg-[#0087e0] text-white font-medium rounded-xl text-[14px] shadow-sm transition"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* 嵌套子弹窗 1：编辑顶级组织机构 (截图 2) */}
      <EditTopOrgModal
        isOpen={isEditTopOpen}
        tenantName={tenantName}
        initialData={topOrg}
        onClose={() => setIsEditTopOpen(false)}
        onSubmit={handleEditTopSubmit}
      />

      {/* 嵌套子弹窗 2：新增/编辑组织机构 (截图 3) */}
      <AddOrgModal
        isOpen={isAddOrgOpen}
        title={editingOrgData ? '编辑组织机构' : '新增组织机构'}
        tenantType={tenantType}
        parentOrgName={addOrgParentName}
        parentOptions={[topOrg.orgName, ...orgList.map(o => o.name)]}
        initialData={editingOrgData || undefined}
        onClose={() => {
          setIsAddOrgOpen(false);
          setEditingOrgData(null);
        }}
        onSubmit={handleAddOrgSubmit}
      />
    </>
  );
}
