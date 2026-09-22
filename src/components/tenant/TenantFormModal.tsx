import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Eye, EyeOff, Search, Building, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchSchools, addCustomSchool, SchoolItem } from '../../data/schools';

export interface TenantFormData {
  name: string;
  type: '学校' | '机构' | string;
  category: '正式' | '试用' | '测试' | string;
  orgName: string; // 组织名称 (必填)
  orgCode: string; // 组织编码 (必填)
  city: string;
  schoolLevel: string;
  subCollege: string;
  adminAccount: string;
  adminPassword?: string;
}

interface TenantFormModalProps {
  isOpen: boolean;
  mode?: 'add' | 'edit';
  initialData?: Partial<TenantFormData>;
  onClose: () => void;
  onSubmit: (data: TenantFormData) => void;
}

// 预设城市列表
const CITY_OPTIONS = [
  '北京市',
  '上海市',
  '广东省广州市',
  '广东省深圳市',
  '浙江省杭州市',
  '江苏省南京市',
  '江苏省苏州市',
  '四川省成都市',
  '湖北省武汉市',
  '陕西省西安市',
  '重庆市',
  '湖南省长沙市',
  '山东省济南市',
  '福建省厦门市',
  '河南省郑州市',
  '安徽省合肥市'
];

// 学校层次列表
const SCHOOL_LEVEL_OPTIONS = [
  '本科',
  '高职',
  '高专',
  '独立学院',
  '中职中专',
  '研究生院',
  '科研院所'
];

export default function TenantFormModal({
  isOpen,
  mode = 'add',
  initialData,
  onClose,
  onSubmit
}: TenantFormModalProps) {
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    type: '学校',
    category: '正式',
    orgName: '',
    orgCode: '',
    city: '',
    schoolLevel: '本科',
    subCollege: '',
    adminAccount: '',
    adminPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isSchoolLevelOpen, setIsSchoolLevelOpen] = useState(false);

  // 学校库模糊搜索相关状态
  const [isOrgSearchOpen, setIsOrgSearchOpen] = useState(false);
  const [matchedSchools, setMatchedSchools] = useState<SchoolItem[]>([]);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const schoolLevelDropdownRef = useRef<HTMLDivElement>(null);
  const orgSearchRef = useRef<HTMLDivElement>(null);

  // 监听外部点击自动收起下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(target)) {
        setIsCityOpen(false);
      }
      if (schoolLevelDropdownRef.current && !schoolLevelDropdownRef.current.contains(target)) {
        setIsSchoolLevelOpen(false);
      }
      if (orgSearchRef.current && !orgSearchRef.current.contains(target)) {
        setIsOrgSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 弹窗打开时初始化表单数据
  useEffect(() => {
    if (isOpen) {
      const currentType = initialData?.type || '学校';
      setFormData({
        name: initialData?.name || '',
        type: currentType,
        category: initialData?.category || '正式',
        orgName: initialData?.orgName || '',
        orgCode: initialData?.orgCode || '',
        city: initialData?.city || '',
        schoolLevel: initialData?.schoolLevel || (currentType === '机构' ? '' : '本科'),
        subCollege: initialData?.subCollege || '',
        adminAccount: initialData?.adminAccount || '',
        adminPassword: initialData?.adminPassword || ''
      });
      setShowPassword(false);
      setIsCityOpen(false);
      setIsSchoolLevelOpen(false);
      setIsOrgSearchOpen(false);
      setMatchedSchools(searchSchools(initialData?.orgName || ''));
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // 处理组织名称输入变化（学校模式下模糊搜索学校库）
  const handleOrgNameChange = (val: string) => {
    setFormData(prev => ({ ...prev, orgName: val }));
    if (formData.type === '学校') {
      setMatchedSchools(searchSchools(val));
      setIsOrgSearchOpen(true);
    }
  };

  // 选择库中某所学校，自动补齐组织编码和相关属性
  const handleSelectSchool = (school: SchoolItem) => {
    setFormData(prev => ({
      ...prev,
      orgName: school.name,
      orgCode: school.code,
      schoolLevel: school.level || prev.schoolLevel || '本科',
      city: school.city || prev.city,
      name: prev.name ? prev.name : school.name
    }));
    setIsOrgSearchOpen(false);
  };

  // 切换租户类型
  const handleTypeChange = (newType: string) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      schoolLevel: newType === '学校' ? (prev.schoolLevel || '本科') : '',
      subCollege: newType === '学校' ? prev.subCollege : ''
    }));
    setIsOrgSearchOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    if (!formData.city) return;
    if (!formData.orgName.trim() || !formData.orgCode.trim()) return;
    if (mode === 'add' && (!formData.adminAccount.trim() || !formData.adminPassword?.trim())) return;

    // 当为学校模式时，如果该学校未在已有库中，自动保存沉淀至新增学校库【对接新增学校库】
    if (formData.type === '学校') {
      const existing = searchSchools(formData.orgName).find(
        s => s.name === formData.orgName.trim()
      );
      if (!existing) {
        addCustomSchool({
          name: formData.orgName.trim(),
          code: formData.orgCode.trim(),
          level: formData.schoolLevel || '本科',
          city: formData.city
        });
      }
    }

    onSubmit(formData);
  };

  const isFormValid = Boolean(
    formData.name.trim() &&
    formData.city &&
    formData.orgName.trim() &&
    formData.orgCode.trim() &&
    (mode === 'edit' || (formData.adminAccount.trim() && formData.adminPassword?.trim()))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* 背景蒙层 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* 弹窗主体 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-[760px] bg-gradient-to-b from-[#e3f0fe] via-[#ecf4fd] to-[#edf4fd] rounded-[28px] shadow-2xl overflow-hidden relative z-10 my-8 border border-white/70"
        >
          {/* Header 顶栏 */}
          <div className="px-8 pt-7 pb-5 flex items-center justify-between">
            <h2 className="text-[23px] font-bold text-[#1e293b] tracking-tight">
              {mode === 'add' ? '新增租户' : '编辑租户'}
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="w-10 h-10 rounded-full bg-white/75 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* 表单内容区 - 纯白大卡片 */}
          <div className="px-6">
            <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(30,58,138,0.02)] border border-blue-50/60 space-y-5">
              {/* 第 1 行：租户类型 & 租户分类 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 租户类型 */}
                <div>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2.5">
                    <span className="text-red-500 mr-1">*</span>租户类型
                  </label>
                  <div className="flex items-center space-x-7 pt-0.5">
                    {['学校', '机构'].map((typeOption) => {
                      const isSelected = formData.type === typeOption;
                      return (
                        <label
                          key={typeOption}
                          className="flex items-center space-x-2.5 cursor-pointer select-none group"
                          onClick={() => handleTypeChange(typeOption)}
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
                            {typeOption}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 租户分类 */}
                <div>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2.5">
                    <span className="text-red-500 mr-1">*</span>租户分类
                  </label>
                  <div className="flex items-center space-x-7 pt-0.5">
                    {['正式', '试用', '测试'].map((catOption) => {
                      const isSelected = formData.category === catOption;
                      return (
                        <label
                          key={catOption}
                          className="flex items-center space-x-2.5 cursor-pointer select-none group"
                          onClick={() => setFormData({ ...formData, category: catOption })}
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
                            {catOption}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 第 2 行：组织名称 & 组织编码 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 组织名称 */}
                <div className="relative" ref={orgSearchRef}>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    <span className="text-red-500 mr-1">*</span>组织名称
                    {formData.type === '学校' && (
                      <span className="ml-2 text-[12px] text-blue-500 font-normal">
                        (对接标准学校库)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => handleOrgNameChange(e.target.value)}
                      onFocus={() => {
                        if (formData.type === '学校') {
                          setMatchedSchools(searchSchools(formData.orgName));
                          setIsOrgSearchOpen(true);
                        }
                      }}
                      placeholder={
                        formData.type === '学校'
                          ? '输入或搜索学校名称（如清华、复旦）'
                          : '请输入组织名称'
                      }
                      className="w-full h-11 px-3.5 pr-8 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                    />
                    {formData.type === '学校' && (
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>

                  {/* 学校模式下的模糊搜索下拉结果面板 */}
                  {formData.type === '学校' && isOrgSearchOpen && (
                    <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto py-1.5 divide-y divide-slate-100">
                      <div className="px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between bg-slate-50/70">
                        <span>匹配标准学校库</span>
                        <span>选择后自动补齐组织编码</span>
                      </div>

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

                      {/* 不在库里的学校，允许直接录入【对接新增学校库】 */}
                      {formData.orgName.trim() && (
                        <div
                          onClick={() => {
                            setIsOrgSearchOpen(false);
                          }}
                          className="px-3.5 py-2.5 bg-sky-50/50 hover:bg-sky-50 text-sky-700 text-[13px] cursor-pointer flex items-center space-x-1.5 transition-colors border-t border-sky-100/60"
                        >
                          <Plus className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>
                            使用自定义学校「<strong className="text-sky-800">{formData.orgName}</strong>」，并录入右侧组织编码
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 组织编码 */}
                <div>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    <span className="text-red-500 mr-1">*</span>组织编码
                    {formData.type === '学校' && (
                      <span className="ml-2 text-[12px] text-slate-400 font-normal">
                        (统一社会信用代码)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.orgCode}
                      onChange={(e) => setFormData({ ...formData, orgCode: e.target.value })}
                      placeholder={
                        formData.type === '学校'
                          ? '选择学校自动补齐，或手动输入'
                          : '请输入组织编码'
                      }
                      className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] font-mono focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                    />
                  </div>
                </div>
              </div>

              {/* 第 3 行：租户名称 & 所在城市 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 租户名称 */}
                <div>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    <span className="text-red-500 mr-1">*</span>租户名称
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={30}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="请输入租户名称"
                      className="w-full h-11 px-3.5 pr-16 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#60a5fa] pointer-events-none select-none font-normal">
                      {formData.name.length} / 30
                    </span>
                  </div>
                </div>

                {/* 所在城市 */}
                <div className="relative" ref={cityDropdownRef}>
                  <label className="block text-[14px] font-medium text-[#334155] mb-2">
                    <span className="text-red-500 mr-1">*</span>所在城市
                  </label>
                  <div
                    onClick={() => {
                      setIsCityOpen(!isCityOpen);
                      setIsSchoolLevelOpen(false);
                      setIsOrgSearchOpen(false);
                    }}
                    className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] flex items-center justify-between cursor-pointer hover:border-slate-300 focus:outline-none transition select-none"
                  >
                    <span className={formData.city ? 'text-slate-700' : 'text-[#94a3b8]'}>
                      {formData.city || '请选择所在城市'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#94a3b8] transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isCityOpen && (
                    <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1">
                      {CITY_OPTIONS.map((city) => (
                        <div
                          key={city}
                          onClick={() => {
                            setFormData({ ...formData, city });
                            setIsCityOpen(false);
                          }}
                          className={`px-3.5 py-2 text-[14px] cursor-pointer hover:bg-blue-50 transition-colors ${
                            formData.city === city ? 'text-[#0ea5e9] font-medium bg-blue-50/50' : 'text-slate-700'
                          }`}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 学校类型特有行：学校层次 & 二级学院 */}
              {formData.type === '学校' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 学校层次 */}
                  <div className="relative" ref={schoolLevelDropdownRef}>
                    <label className="block text-[14px] font-medium text-[#334155] mb-2">
                      <span className="text-red-500 mr-1">*</span>学校层次
                    </label>
                    <div
                      onClick={() => {
                        setIsSchoolLevelOpen(!isSchoolLevelOpen);
                        setIsCityOpen(false);
                        setIsOrgSearchOpen(false);
                      }}
                      className="w-full h-11 px-3.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] flex items-center justify-between cursor-pointer hover:border-slate-300 focus:outline-none transition select-none"
                    >
                      <span className={formData.schoolLevel ? 'text-slate-700' : 'text-[#94a3b8]'}>
                        {formData.schoolLevel || '请选择学校层次'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#94a3b8] transition-transform duration-200 ${isSchoolLevelOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isSchoolLevelOpen && (
                      <div className="absolute left-0 right-0 top-[76px] z-50 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto py-1">
                        {SCHOOL_LEVEL_OPTIONS.map((level) => (
                          <div
                            key={level}
                            onClick={() => {
                              setFormData({ ...formData, schoolLevel: level });
                              setIsSchoolLevelOpen(false);
                            }}
                            className={`px-3.5 py-2 text-[14px] cursor-pointer hover:bg-blue-50 transition-colors ${
                              formData.schoolLevel === level ? 'text-[#0ea5e9] font-medium bg-blue-50/50' : 'text-slate-700'
                            }`}
                          >
                            {level}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 二级学院 */}
                  <div>
                    <label className="block text-[14px] font-medium text-[#334155] mb-2">
                      二级学院
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={100}
                        value={formData.subCollege}
                        onChange={(e) => setFormData({ ...formData, subCollege: e.target.value })}
                        placeholder="请输入二级学院"
                        className="w-full h-11 px-3.5 pr-20 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#60a5fa] pointer-events-none select-none">
                        {formData.subCollege.length} / 100
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 管理员账号 (全宽) */}
              <div>
                <label className="block text-[14px] font-medium text-[#334155] mb-2">
                  <span className="text-red-500 mr-1">*</span>管理员账号
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={20}
                    value={formData.adminAccount}
                    onChange={(e) => setFormData({ ...formData, adminAccount: e.target.value })}
                    placeholder="请输入管理员账号"
                    className="w-full h-11 px-3.5 pr-16 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#60a5fa] pointer-events-none select-none">
                    {formData.adminAccount.length} / 20
                  </span>
                </div>
              </div>

              {/* 管理员密码 (全宽) */}
              <div>
                <label className="block text-[14px] font-medium text-[#334155] mb-1">
                  <span className="text-red-500 mr-1">*</span>管理员密码
                </label>
                <div className="text-[13px] text-[#64748b] mb-2">
                  密码规则：长度 6-16 位，包含数字，不含空白字符
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.adminPassword || ''}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    placeholder="请输入管理员密码"
                    className="w-full h-11 px-3.5 pr-10 bg-white border border-[#e2e8f0] rounded-xl text-slate-700 placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/15 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer 底部操作区 */}
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
              className="h-11 px-7 bg-[#67c4f8] hover:bg-[#53b8f4] active:bg-[#40acee] text-white font-medium rounded-xl text-[15px] transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              确定
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
