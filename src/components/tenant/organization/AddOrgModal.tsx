import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Search, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchSchools, addCustomSchool, SchoolItem } from '../../../data/schools';
import { searchEnterprises, addCustomEnterprise, EnterpriseItem } from '../../../data/enterprises';

export interface NewOrgData {
  id?: string;
  parentName: string;
  name: string;
  code: string;
  type: string;
  subType: string;
  isClass: boolean;
  major: string;
  contact?: string;
  phone?: string;
  remark?: string;
}

interface AddOrgModalProps {
  isOpen: boolean;
  title?: string;
  tenantType?: string; // 租户类型：'学校' | '机构' 等
  parentOrgName?: string;
  parentOptions?: string[];
  initialData?: Partial<NewOrgData>;
  onClose: () => void;
  onSubmit: (data: NewOrgData) => void;
}

const ORG_TYPES = ['学校', '企业', '政府', '游客', '其他'];

const SUB_TYPES_MAP: Record<string, string[]> = {
  '学校': ['高职院校', '本科院校', '中职院校', '二级学院', '专业系所', '研究院所'],
  '企业': ['教育科技', '科技企业', '制造企业', '服务企业', '国企央企', '其他企业'],
  '政府': ['教育行政部门', '人力资源部门', '其他政府机构'],
  '游客': ['个人游客', '体验组织'],
  '其他': ['社会组织', '行业协会', '其他']
};

const MAJOR_OPTIONS = ['计算机应用技术', '软件工程', '人工智能技术应用', '物联网应用技术', '大数据技术', '智能互联网络技术', '电子商务'];

export default function AddOrgModal({
  isOpen,
  title = '新增组织机构',
  tenantType = '学校',
  parentOrgName = '新大陆教育研究院',
  parentOptions = ['新大陆教育研究院', '人工智能&物联网研究院'],
  initialData,
  onClose,
  onSubmit
}: AddOrgModalProps) {
  const isSchoolTenant = tenantType === '学校';

  const [formData, setFormData] = useState<NewOrgData>({
    parentName: parentOrgName,
    type: isSchoolTenant ? '学校' : '企业',
    subType: isSchoolTenant ? '二级学院' : '教育科技',
    name: '',
    code: '',
    // 学校租户默认为“是”(true)，非学校租户（机构）默认为“否”(false)
    isClass: isSchoolTenant ? true : false,
    major: '',
    contact: '',
    phone: '',
    remark: ''
  });

  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSubTypeOpen, setIsSubTypeOpen] = useState(false);
  const [isMajorOpen, setIsMajorOpen] = useState(false);

  // 选库搜索相关状态（仅用于机构等非学校模式）
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [matchedSchools, setMatchedSchools] = useState<SchoolItem[]>([]);
  const [matchedEnterprises, setMatchedEnterprises] = useState<EnterpriseItem[]>([]);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const parentDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const subTypeDropdownRef = useRef<HTMLDivElement>(null);
  const majorDropdownRef = useRef<HTMLDivElement>(null);

  // 外部点击关闭所有下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchBoxRef.current && !searchBoxRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (parentDropdownRef.current && !parentDropdownRef.current.contains(target)) {
        setIsParentOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(target)) {
        setIsTypeOpen(false);
      }
      if (subTypeDropdownRef.current && !subTypeDropdownRef.current.contains(target)) {
        setIsSubTypeOpen(false);
      }
      if (majorDropdownRef.current && !majorDropdownRef.current.contains(target)) {
        setIsMajorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const defaultIsClass = isSchoolTenant ? true : false;
      const currentType = initialData?.type || (isSchoolTenant ? '学校' : '');
      const availableSubTypes = SUB_TYPES_MAP[currentType] || [];
      const currentSubType = initialData?.subType || availableSubTypes[0] || '';

      setFormData({
        id: initialData?.id,
        parentName: initialData?.parentName || parentOrgName || '新大陆教育研究院',
        type: currentType,
        subType: currentSubType,
        name: initialData?.name || '',
        code: initialData?.code || '',
        isClass: initialData?.isClass !== undefined ? initialData.isClass : defaultIsClass,
        major: initialData?.major || '',
        contact: initialData?.contact || '',
        phone: initialData?.phone || '',
        remark: initialData?.remark || ''
      });
      setIsParentOpen(false);
      setIsTypeOpen(false);
      setIsSubTypeOpen(false);
      setIsMajorOpen(false);
      setIsSearchOpen(false);
    }
  }, [isOpen, parentOrgName, initialData, isSchoolTenant]);

  if (!isOpen) return null;

  // 组织类型切换（机构模式下）
  const handleTypeSelect = (selectedType: string) => {
    const newSubTypes = SUB_TYPES_MAP[selectedType] || [];
    setFormData(prev => ({
      ...prev,
      type: selectedType,
      subType: newSubTypes[0] || ''
    }));
    setIsTypeOpen(false);
    setIsSearchOpen(false);
  };

  // 组织机构名称输入变化
  const handleOrgNameChange = (val: string) => {
    setFormData(prev => ({ ...prev, name: val }));
    // 当租户类型为学校时，用户明确要求：组织机构名称和组织机构编码手动填写，不启动选库
    if (!isSchoolTenant) {
      if (formData.type === '学校') {
        setMatchedSchools(searchSchools(val));
        setIsSearchOpen(true);
      } else if (formData.type === '企业') {
        setMatchedEnterprises(searchEnterprises(val));
        setIsSearchOpen(true);
      }
    }
  };

  // 聚焦组织机构名称
  const handleOrgNameFocus = () => {
    if (!isSchoolTenant) {
      if (formData.type === '学校') {
        setMatchedSchools(searchSchools(formData.name));
        setIsSearchOpen(true);
      } else if (formData.type === '企业') {
        setMatchedEnterprises(searchEnterprises(formData.name));
        setIsSearchOpen(true);
      }
    }
  };

  // 选中学校
  const handleSelectSchool = (school: SchoolItem) => {
    setFormData(prev => ({
      ...prev,
      name: school.name,
      code: school.code,
      subType: school.level ? `${school.level}院校` : prev.subType
    }));
    setIsSearchOpen(false);
  };

  // 选中企业
  const handleSelectEnterprise = (ent: EnterpriseItem) => {
    setFormData(prev => ({
      ...prev,
      name: ent.name,
      code: ent.code,
      subType: ent.industry || prev.subType
    }));
    setIsSearchOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    // 若非班级，专业不传或置空
    const submitData = {
      ...formData,
      major: formData.isClass ? formData.major : ''
    };

    // 机构模式下，若不在库中，沉淀到对应的新增库
    if (!isSchoolTenant) {
      if (formData.type === '学校') {
        const existing = searchSchools(formData.name).find(s => s.name === formData.name.trim());
        if (!existing) {
          addCustomSchool({
            name: formData.name.trim(),
            code: formData.code.trim(),
            level: formData.subType?.replace('院校', '') || '本科'
          });
        }
      } else if (formData.type === '企业') {
        const existing = searchEnterprises(formData.name).find(e => e.name === formData.name.trim());
        if (!existing) {
          addCustomEnterprise({
            name: formData.name.trim(),
            code: formData.code.trim(),
            type: formData.subType
          });
        }
      }
    }

    onSubmit(submitData);
  };

  const isFormValid = Boolean(
    formData.name.trim() &&
    formData.code.trim() &&
    formData.parentName
  );

  const currentSubTypes = SUB_TYPES_MAP[formData.type] || [];
  const isLibraryEnabled = !isSchoolTenant && (formData.type === '学校' || formData.type === '企业');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-[680px] bg-gradient-to-b from-[#e3f0fe] via-[#ecf4fd] to-[#edf4fd] rounded-[28px] shadow-2xl overflow-hidden relative z-10 my-8 border border-white/70"
        >
          {/* 顶栏 */}
          <div className="px-8 pt-7 pb-5 flex items-center justify-between">
            <h2 className="text-[23px] font-bold text-[#1e293b] tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="w-10 h-10 rounded-full bg-white/75 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* 表单卡片 */}
          <div className="px-6">
            <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(30,58,138,0.02)] border border-blue-50/60 space-y-5">
              {/* 1. 上级组织 (全宽) */}
              <div className="relative" ref={parentDropdownRef}>
                <label className="block text-[14px] font-medium text-[#334155] mb-2">
                  <span className="text-red-500 mr-1">*</span>上级组织
                </label>
                <div
                  onClick={() => setIsParentOpen(!isParentOpen)}
                  className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 flex items-center justify-between cursor-pointer hover:border-slate-300 transition select-none"
                >
                  <span>{formData.parentName}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isParentOpen ? 'rotate-180' : ''}`} />
                </div>

                {isParentOpen && (
                  <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1">
                    {parentOptions.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setFormData({ ...formData, parentName: opt });
                          setIsParentOpen(false);
                        }}
                        className={`px-3.5 py-2 text-[14px] cursor-pointer hover:bg-blue-50 transition-colors ${
                          formData.parentName === opt ? 'text-[#0ea5e9] font-medium bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. 组织类型 & 细分类别（仅在非学校租户时显示；当租户为学校时，需求明确：删去组织类型、细分类型） */}
              {!isSchoolTenant && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative" ref={typeDropdownRef}>
                    <label className="block text-[14px] font-medium text-[#334155] mb-2">
                      <span className="text-red-500 mr-1">*</span>组织类型
                    </label>
                    <div
                      onClick={() => {
                        setIsTypeOpen(!isTypeOpen);
                        setIsSubTypeOpen(false);
                        setIsParentOpen(false);
                        setIsMajorOpen(false);
                        setIsSearchOpen(false);
                      }}
                      className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 flex items-center justify-between cursor-pointer hover:border-slate-300 transition select-none"
                    >
                      <span className={formData.type ? 'text-slate-700' : 'text-[#94a3b8]'}>
                        {formData.type || '请选择组织类型'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isTypeOpen && (
                      <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1">
                        {ORG_TYPES.map((type) => (
                          <div
                            key={type}
                            onClick={() => handleTypeSelect(type)}
                            className={`px-3.5 py-2 text-[14px] cursor-pointer hover:bg-blue-50 transition-colors ${
                              formData.type === type ? 'text-[#0ea5e9] font-medium bg-blue-50/50' : 'text-slate-700'
                            }`}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={subTypeDropdownRef}>
                    <label className="block text-[14px] font-medium text-[#334155] mb-2">
                      细分类别
                    </label>
                    <div
                      onClick={() => {
                        setIsSubTypeOpen(!isSubTypeOpen);
                        setIsTypeOpen(false);
                        setIsParentOpen(false);
                        setIsMajorOpen(false);
                        setIsSearchOpen(false);
                      }}
                      className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 flex items-center justify-between cursor-pointer hover:border-slate-300 transition select-none"
                    >
                      <span className={formData.subType ? 'text-slate-700' : 'text-[#94a3b8]'}>
                        {formData.subType || '请选择细分类别'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSubTypeOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isSubTypeOpen && (
                      <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1">
                        {currentSubTypes.length > 0 ? (
                          currentSubTypes.map((sub) => (
                            <div
                              key={sub}
                              onClick={() => {
                                setFormData({ ...formData, subType: sub });
                                setIsSubTypeOpen(false);
                              }}
                              className={`px-3.5 py-2 text-[14px] cursor-pointer hover:bg-blue-50 transition-colors ${
                                formData.subType === sub ? 'text-[#0ea5e9] font-medium bg-blue-50/50' : 'text-slate-700'
                              }`}
                            >
                              {sub}
                            </div>
                          ))
                        ) : (
                          <div className="px-3.5 py-2 text-slate-400 text-[13px]">暂无细分类别</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. 组织机构名称 & 组织机构编码 (两列并排) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative" ref={searchBoxRef}>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    <span className="text-red-500 mr-1">*</span>组织机构名称
                    {!isSchoolTenant && formData.type === '学校' && (
                      <span className="ml-1.5 text-[12px] text-blue-500 font-normal">
                        (对接学校库)
                      </span>
                    )}
                    {!isSchoolTenant && formData.type === '企业' && (
                      <span className="ml-1.5 text-[12px] text-emerald-600 font-normal">
                        (对接企业库)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={30}
                      value={formData.name}
                      onChange={(e) => handleOrgNameChange(e.target.value)}
                      onFocus={handleOrgNameFocus}
                      placeholder={
                        isSchoolTenant
                          ? '请输入组织机构名称'
                          : formData.type === '学校'
                          ? '输入或搜索学校名称'
                          : formData.type === '企业'
                          ? '输入或搜索企业名称'
                          : '请输入组织机构名称'
                      }
                      className="w-full h-11 px-3.5 pr-16 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#60a5fa] pointer-events-none select-none">
                      {formData.name.length} / 30
                    </span>
                  </div>

                  {/* 选库模糊搜索下拉面板（仅非学校租户时启用） */}
                  {isLibraryEnabled && isSearchOpen && (
                    <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1.5 divide-y divide-slate-100">
                      <div className="px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between bg-slate-50/70">
                        <span>{formData.type === '学校' ? '匹配标准学校库' : '匹配标准企业库'}</span>
                        <span>选择后自动补齐组织编码</span>
                      </div>

                      {formData.type === '学校' && (
                        <>
                          {matchedSchools.length > 0 ? (
                            matchedSchools.map((school) => {
                              const isSelected = formData.name === school.name;
                              return (
                                <div
                                  key={school.id}
                                  onClick={() => handleSelectSchool(school)}
                                  className={`px-3.5 py-2.5 cursor-pointer transition-colors flex items-center justify-between group hover:bg-blue-50/70 ${
                                    isSelected ? 'bg-blue-50/50 text-[#0ea5e9]' : 'text-slate-700'
                                  }`}
                                >
                                  <div className="flex flex-col pr-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-[14px] group-hover:text-blue-600 transition-colors">
                                        {school.name}
                                      </span>
                                      {school.level && (
                                        <span className="text-[11px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 font-normal">
                                          {school.level}
                                        </span>
                                      )}
                                      {school.isCustom && (
                                        <span className="text-[11px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-100 font-normal">
                                          新增库
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[12px] text-slate-400 mt-0.5 font-mono">
                                      编码: {school.code}
                                    </span>
                                  </div>
                                  {isSelected && <Check className="w-4 h-4 text-[#0ea5e9] shrink-0" />}
                                </div>
                              );
                            })
                          ) : (
                            <div className="px-3.5 py-3 text-center text-slate-400 text-[13px]">
                              未在标准学校库中找到匹配项
                            </div>
                          )}

                          {formData.name.trim() && (
                            <div
                              onClick={() => setIsSearchOpen(false)}
                              className="px-3.5 py-2.5 bg-sky-50/50 hover:bg-sky-50 text-sky-700 text-[13px] cursor-pointer flex items-center space-x-1.5 transition-colors border-t border-sky-100/60"
                            >
                              <Plus className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>使用自定义学校「<strong>{formData.name}</strong>」，并手动录入编码</span>
                            </div>
                          )}
                        </>
                      )}

                      {formData.type === '企业' && (
                        <>
                          {matchedEnterprises.length > 0 ? (
                            matchedEnterprises.map((ent) => {
                              const isSelected = formData.name === ent.name;
                              return (
                                <div
                                  key={ent.id}
                                  onClick={() => handleSelectEnterprise(ent)}
                                  className={`px-3.5 py-2.5 cursor-pointer transition-colors flex items-center justify-between group hover:bg-emerald-50/70 ${
                                    isSelected ? 'bg-emerald-50/50 text-emerald-600' : 'text-slate-700'
                                  }`}
                                >
                                  <div className="flex flex-col pr-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-[14px] group-hover:text-emerald-700 transition-colors">
                                        {ent.name}
                                      </span>
                                      {ent.industry && (
                                        <span className="text-[11px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100 font-normal">
                                          {ent.industry}
                                        </span>
                                      )}
                                      {ent.isCustom && (
                                        <span className="text-[11px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-100 font-normal">
                                          新增库
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[12px] text-slate-400 mt-0.5 font-mono">
                                      编码: {ent.code}
                                    </span>
                                  </div>
                                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                                </div>
                              );
                            })
                          ) : (
                            <div className="px-3.5 py-3 text-center text-slate-400 text-[13px]">
                              未在标准企业库中找到匹配项
                            </div>
                          )}

                          {formData.name.trim() && (
                            <div
                              onClick={() => setIsSearchOpen(false)}
                              className="px-3.5 py-2.5 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-[13px] cursor-pointer flex items-center space-x-1.5 transition-colors border-t border-emerald-100/60"
                            >
                              <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>使用自定义企业「<strong>{formData.name}</strong>」，并手动录入编码</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    <span className="text-red-500 mr-1">*</span>组织机构编码
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder={
                      isLibraryEnabled
                        ? '选库后自动补齐，或手动输入'
                        : '请输入组织机构编码'
                    }
                    className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 font-mono placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                  />
                </div>
              </div>

              {/* 4. 是否班级 & 专业 */}
              {/* 需求关键点：是否是班级为否的，无需显示专业下拉框选项！ */}
              <div className={`grid gap-5 ${formData.isClass ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                <div>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2.5">
                    <span className="text-red-500 mr-1">*</span>是否班级
                  </label>
                  <div className="flex items-center space-x-7 pt-1">
                    {[
                      { label: '是', value: true },
                      { label: '否', value: false }
                    ].map((item) => {
                      const isSelected = formData.isClass === item.value;
                      return (
                        <label
                          key={item.label}
                          className="flex items-center space-x-2.5 cursor-pointer select-none group"
                          onClick={() => setFormData({ ...formData, isClass: item.value })}
                        >
                          <div
                            className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-[5px] border-[#0ea5e9] bg-white'
                                : 'border-2 border-slate-300 bg-white group-hover:border-slate-400'
                            }`}
                          />
                          <span
                            className={`text-[15px] font-medium transition-colors ${
                              isSelected ? 'text-[#0ea5e9]' : 'text-[#334155]'
                            }`}
                          >
                            {item.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 仅当 isClass 为“是”时显示专业下拉框；为“否”时无需显示！ */}
                {formData.isClass && (
                  <div className="relative" ref={majorDropdownRef}>
                    <label className="block text-[14px] font-medium text-[#334155] mb-2">
                      专业
                    </label>
                    <div
                      onClick={() => {
                        setIsMajorOpen(!isMajorOpen);
                        setIsTypeOpen(false);
                        setIsSubTypeOpen(false);
                        setIsParentOpen(false);
                        setIsSearchOpen(false);
                      }}
                      className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 flex items-center justify-between cursor-pointer hover:border-slate-300 transition select-none"
                    >
                      <span className={formData.major ? 'text-slate-700' : 'text-[#94a3b8]'}>
                        {formData.major || '请选择专业'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMajorOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isMajorOpen && (
                      <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1">
                        {MAJOR_OPTIONS.map((major) => (
                          <div
                            key={major}
                            onClick={() => {
                              setFormData({ ...formData, major });
                              setIsMajorOpen(false);
                            }}
                            className={`px-3.5 py-2 text-[14px] cursor-pointer hover:bg-blue-50 transition-colors ${
                              formData.major === major ? 'text-[#0ea5e9] font-medium bg-blue-50/50' : 'text-slate-700'
                            }`}
                          >
                            {major}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 5. 联系人 & 联系方式 (两列) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    联系人
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="请输入联系人姓名"
                    className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    联系方式
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入联系方式"
                    className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                  />
                </div>
              </div>

              {/* 6. 备注 (全宽，带 0/200 计数) */}
              <div>
                <label className="block text-[14px] font-medium text-[#334155] mb-2">
                  备注
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={200}
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    placeholder="请输入备注"
                    className="w-full p-3.5 pb-7 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition resize-y"
                  />
                  <span className="absolute right-3.5 bottom-2.5 text-[12px] text-[#60a5fa] pointer-events-none select-none">
                    {(formData.remark || '').length} / 200
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作区 */}
          <div className="px-8 py-5 flex items-center justify-end space-x-3.5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-7 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#334155] font-medium rounded-xl text-[15px] transition shadow-sm"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="h-11 px-7 bg-[#0096fa] hover:bg-[#0087e0] active:bg-[#0078c8] text-white font-medium rounded-xl text-[15px] transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
