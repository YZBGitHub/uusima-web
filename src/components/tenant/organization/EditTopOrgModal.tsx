import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Search, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchSchools, addCustomSchool, SchoolItem } from '../../../data/schools';
import { searchEnterprises, addCustomEnterprise, EnterpriseItem } from '../../../data/enterprises';

export interface TopOrgData {
  tenantName: string;
  orgName: string;
  orgCode: string;
  orgType: string;
  subType: string;
  contact?: string;
  phone?: string;
  remark?: string;
}

interface EditTopOrgModalProps {
  isOpen: boolean;
  tenantName: string;
  initialData?: Partial<TopOrgData>;
  onClose: () => void;
  onSubmit: (data: TopOrgData) => void;
}

const ORG_TYPES = ['学校', '企业', '政府', '游客', '其他'];

const SUB_TYPES_MAP: Record<string, string[]> = {
  '学校': ['高职院校', '本科院校', '中职院校', '独立学院', '科研院所'],
  '企业': ['教育科技', '科技企业', '制造企业', '服务企业', '国企央企', '其他企业'],
  '政府': ['教育行政部门', '人力资源部门', '其他政府机构'],
  '游客': ['个人游客', '体验组织'],
  '其他': ['社会组织', '行业协会', '其他']
};

export default function EditTopOrgModal({
  isOpen,
  tenantName,
  initialData,
  onClose,
  onSubmit
}: EditTopOrgModalProps) {
  const [formData, setFormData] = useState<TopOrgData>({
    tenantName: tenantName || '二级学院',
    orgType: '学校',
    subType: '高职院校',
    orgName: '新大陆教育研究院',
    orgCode: 'newland_edu_RI',
    contact: '',
    phone: '',
    remark: ''
  });

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSubTypeOpen, setIsSubTypeOpen] = useState(false);

  // 选库搜索相关状态
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [matchedSchools, setMatchedSchools] = useState<SchoolItem[]>([]);
  const [matchedEnterprises, setMatchedEnterprises] = useState<EnterpriseItem[]>([]);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const subTypeDropdownRef = useRef<HTMLDivElement>(null);

  // 监听外部点击关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchBoxRef.current && !searchBoxRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(target)) {
        setIsTypeOpen(false);
      }
      if (subTypeDropdownRef.current && !subTypeDropdownRef.current.contains(target)) {
        setIsSubTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const currentType = initialData?.orgType || '学校';
      const availableSubTypes = SUB_TYPES_MAP[currentType] || [];
      const currentSubType = initialData?.subType || availableSubTypes[0] || '';

      setFormData({
        tenantName: tenantName || initialData?.tenantName || '二级学院',
        orgType: currentType,
        subType: currentSubType,
        orgName: initialData?.orgName || '新大陆教育研究院',
        orgCode: initialData?.orgCode || 'newland_edu_RI',
        contact: initialData?.contact || '',
        phone: initialData?.phone || '',
        remark: initialData?.remark || ''
      });
      setIsTypeOpen(false);
      setIsSubTypeOpen(false);
      setIsSearchOpen(false);
    }
  }, [isOpen, tenantName, initialData]);

  if (!isOpen) return null;

  // 切换组织类型
  const handleTypeSelect = (selectedType: string) => {
    const newSubTypes = SUB_TYPES_MAP[selectedType] || [];
    setFormData(prev => ({
      ...prev,
      orgType: selectedType,
      subType: newSubTypes[0] || ''
    }));
    setIsTypeOpen(false);
    setIsSearchOpen(false);
  };

  // 组织机构名称输入变化
  const handleOrgNameChange = (val: string) => {
    setFormData(prev => ({ ...prev, orgName: val }));
    if (formData.orgType === '学校') {
      setMatchedSchools(searchSchools(val));
      setIsSearchOpen(true);
    } else if (formData.orgType === '企业') {
      setMatchedEnterprises(searchEnterprises(val));
      setIsSearchOpen(true);
    }
  };

  // 聚焦组织机构名称
  const handleOrgNameFocus = () => {
    if (formData.orgType === '学校') {
      setMatchedSchools(searchSchools(formData.orgName));
      setIsSearchOpen(true);
    } else if (formData.orgType === '企业') {
      setMatchedEnterprises(searchEnterprises(formData.orgName));
      setIsSearchOpen(true);
    }
  };

  // 选中学校
  const handleSelectSchool = (school: SchoolItem) => {
    setFormData(prev => ({
      ...prev,
      orgName: school.name,
      orgCode: school.code,
      subType: school.level ? `${school.level}院校` : prev.subType
    }));
    setIsSearchOpen(false);
  };

  // 选中企业
  const handleSelectEnterprise = (ent: EnterpriseItem) => {
    setFormData(prev => ({
      ...prev,
      orgName: ent.name,
      orgCode: ent.code,
      subType: ent.industry || prev.subType
    }));
    setIsSearchOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orgName.trim() || !formData.orgCode.trim()) return;

    // 若不在库中，沉淀到对应的新增库
    if (formData.orgType === '学校') {
      const existing = searchSchools(formData.orgName).find(s => s.name === formData.orgName.trim());
      if (!existing) {
        addCustomSchool({
          name: formData.orgName.trim(),
          code: formData.orgCode.trim(),
          level: formData.subType?.replace('院校', '') || '本科'
        });
      }
    } else if (formData.orgType === '企业') {
      const existing = searchEnterprises(formData.orgName).find(e => e.name === formData.orgName.trim());
      if (!existing) {
        addCustomEnterprise({
          name: formData.orgName.trim(),
          code: formData.orgCode.trim(),
          type: formData.subType
        });
      }
    }

    onSubmit(formData);
  };

  const currentSubTypes = SUB_TYPES_MAP[formData.orgType] || [];
  const isLibraryEnabled = formData.orgType === '学校' || formData.orgType === '企业';

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
          className="w-full max-w-[660px] bg-gradient-to-b from-[#e3f0fe] via-[#ecf4fd] to-[#edf4fd] rounded-[28px] shadow-2xl overflow-hidden relative z-10 my-8 border border-white/70"
        >
          {/* 顶栏 */}
          <div className="px-8 pt-7 pb-5 flex items-center justify-between">
            <h2 className="text-[23px] font-bold text-[#1e293b] tracking-tight">
              编辑顶级组织机构
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
              {/* 1. 租户 (全宽) */}
              <div>
                <label className="block text-[14px] font-medium text-[#334155] mb-2">
                  <span className="text-red-500 mr-1">*</span>租户
                </label>
                <div className="w-full h-11 px-3.5 bg-slate-50 border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 flex items-center justify-between cursor-not-allowed">
                  <span>{formData.tenantName}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* 2. 组织类型 & 细分类别 (前置，两列并排) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative" ref={typeDropdownRef}>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    <span className="text-red-500 mr-1">*</span>组织类型
                  </label>
                  <div
                    onClick={() => {
                      setIsTypeOpen(!isTypeOpen);
                      setIsSubTypeOpen(false);
                      setIsSearchOpen(false);
                    }}
                    className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 flex items-center justify-between cursor-pointer hover:border-slate-300 transition select-none"
                  >
                    <span>{formData.orgType || '请选择组织类型'}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isTypeOpen && (
                    <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1">
                      {ORG_TYPES.map((type) => (
                        <div
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                          className={`px-3.5 py-2 text-[14px] cursor-pointer hover:bg-blue-50 transition-colors ${
                            formData.orgType === type ? 'text-[#0ea5e9] font-medium bg-blue-50/50' : 'text-slate-700'
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
                      setIsSearchOpen(false);
                    }}
                    className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-slate-700 flex items-center justify-between cursor-pointer hover:border-slate-300 transition select-none"
                  >
                    <span>{formData.subType || '请选择细分类别'}</span>
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

              {/* 3. 组织机构名称 & 组织机构编码 (两列并排) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative" ref={searchBoxRef}>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    <span className="text-red-500 mr-1">*</span>组织机构名称
                    {formData.orgType === '学校' && (
                      <span className="ml-1.5 text-[12px] text-blue-500 font-normal">
                        (对接学校库)
                      </span>
                    )}
                    {formData.orgType === '企业' && (
                      <span className="ml-1.5 text-[12px] text-emerald-600 font-normal">
                        (对接企业库)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => handleOrgNameChange(e.target.value)}
                      onFocus={handleOrgNameFocus}
                      placeholder={
                        formData.orgType === '学校'
                          ? '输入或搜索学校名称'
                          : formData.orgType === '企业'
                          ? '输入或搜索企业名称'
                          : '请输入组织机构名称'
                      }
                      className="w-full h-11 px-3.5 pr-8 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                    />
                    {isLibraryEnabled && (
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>

                  {/* 选库模糊搜索下拉面板 */}
                  {isLibraryEnabled && isSearchOpen && (
                    <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1.5 divide-y divide-slate-100">
                      <div className="px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between bg-slate-50/70">
                        <span>{formData.orgType === '学校' ? '匹配标准学校库' : '匹配标准企业库'}</span>
                        <span>选择后自动补齐组织编码</span>
                      </div>

                      {formData.orgType === '学校' && (
                        <>
                          {matchedSchools.length > 0 ? (
                            matchedSchools.map((school) => {
                              const isSelected = formData.orgName === school.name;
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

                          {formData.orgName.trim() && (
                            <div
                              onClick={() => setIsSearchOpen(false)}
                              className="px-3.5 py-2.5 bg-sky-50/50 hover:bg-sky-50 text-sky-700 text-[13px] cursor-pointer flex items-center space-x-1.5 transition-colors border-t border-sky-100/60"
                            >
                              <Plus className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>使用自定义学校「<strong>{formData.orgName}</strong>」，并手动录入编码</span>
                            </div>
                          )}
                        </>
                      )}

                      {formData.orgType === '企业' && (
                        <>
                          {matchedEnterprises.length > 0 ? (
                            matchedEnterprises.map((ent) => {
                              const isSelected = formData.orgName === ent.name;
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

                          {formData.orgName.trim() && (
                            <div
                              onClick={() => setIsSearchOpen(false)}
                              className="px-3.5 py-2.5 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-[13px] cursor-pointer flex items-center space-x-1.5 transition-colors border-t border-emerald-100/60"
                            >
                              <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>使用自定义企业「<strong>{formData.orgName}</strong>」，并手动录入编码</span>
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
                    value={formData.orgCode}
                    onChange={(e) => setFormData({ ...formData, orgCode: e.target.value })}
                    placeholder={
                      isLibraryEnabled
                        ? '选库后自动补齐，或手动输入'
                        : '请输入组织机构编码'
                    }
                    className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 font-mono placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                  />
                </div>
              </div>

              {/* 4. 联系人 & 联系方式 (两列) */}
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

              {/* 5. 备注 (全宽) */}
              <div>
                <label className="block text-[14px] font-medium text-[#334155] mb-2">
                  备注
                </label>
                <textarea
                  rows={3}
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="请输入备注"
                  className="w-full p-3.5 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition resize-y"
                />
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
              disabled={!formData.orgName.trim() || !formData.orgCode.trim()}
              className="h-11 px-7 bg-[#0096fa] hover:bg-[#0087e0] active:bg-[#0078c8] text-white font-medium rounded-xl text-[15px] transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              确认
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
