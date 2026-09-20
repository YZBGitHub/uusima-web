import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Upload,
  ArrowUpDown,
  Download,
  CheckCircle2
} from 'lucide-react';
import { SkillCategory } from './TeacherStepEditorModal';

export interface LabGradingRule {
  id: string;
  name: string;
  description: string;
  type: string;
  score: number;
  skillIds: string[];
  scene?: string; // 评分场景，如 '软件实验'
  ruleCategory?: string; // 类型，如 '单个' | '组合'
  updatedAt?: string; // 更新时间，如 '2026-09-20 09:44:51'
  enabled?: boolean;
}

export interface LabEnvGradingConfig {
  standardAnswerFile?: string;
  defaultSimFile?: string;
  rules: LabGradingRule[];
  enabled?: boolean;
  totalScore?: number;
  passScore?: number;
  allowViewDiagnostics?: boolean;
}

interface LabGradingRuleModalProps {
  envInfo: {
    id: string;
    title: string;
    type: string;
    category?: string;
  };
  initialConfig?: LabEnvGradingConfig;
  skillCategories: SkillCategory[];
  onClose: () => void;
  onSave: (config: LabEnvGradingConfig) => void;
}

// 格式化当前时间为 YYYY-MM-DD HH:mm:ss
const formatCurrentTime = () => {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// 预置符合截图效果的默认评分规则
export const generateDefaultRulesForEnv = (env: { title: string; category?: string }): LabGradingRule[] => {
  const isSimulation = env.category === 'simulation' || env.title.includes('仿真');

  if (isSimulation) {
    return [
      {
        id: 'rule-sim-1',
        name: '设备连线',
        description: '检测虚拟仿真环境中三维模型的拼装完整度及核心端子接线时序',
        type: '仿真事件',
        scene: '软件实验',
        ruleCategory: '单个',
        score: 10,
        skillIds: ['s-001', 's-007'],
        updatedAt: '2026-09-20 09:44:51',
        enabled: true
      },
      {
        id: 'rule-sim-2',
        name: '设备选型',
        description: '断言校验仿真控制面板输入的设备型号、采样频率与物理量参数匹配',
        type: '断言校验',
        scene: '软件实验',
        ruleCategory: '单个',
        score: 10,
        skillIds: ['s-004'],
        updatedAt: '2026-09-20 09:44:51',
        enabled: true
      },
      {
        id: 'rule-sim-3',
        name: '仿真1',
        description: '验证工况下仿真机构能否正确触发联锁切断与稳定运行状态检测',
        type: '单元测试',
        scene: '软件实验',
        ruleCategory: '单个',
        score: 1,
        skillIds: ['s-002', 's-008'],
        updatedAt: '2026-09-20 09:44:51',
        enabled: true
      }
    ];
  }

  // 其他环境默认规则
  return [
    {
      id: 'rule-def-1',
      name: '设备连线',
      description: '代码单元顺序执行与软硬件交互接口连线检测',
      type: '单元测试',
      scene: '软件实验',
      ruleCategory: '单个',
      score: 10,
      skillIds: ['s-001'],
      updatedAt: '2026-09-20 09:44:51',
      enabled: true
    },
    {
      id: 'rule-def-2',
      name: '设备选型',
      description: '校验输出的目标参数与实验环境基础选型指标',
      type: '断言校验',
      scene: '软件实验',
      ruleCategory: '单个',
      score: 10,
      skillIds: ['s-004'],
      updatedAt: '2026-09-20 09:44:51',
      enabled: true
    },
    {
      id: 'rule-def-3',
      name: '仿真1',
      description: '主程序运行收敛与实验结果持久化文件输出校验',
      type: '仿真事件',
      scene: '软件实验',
      ruleCategory: '单个',
      score: 1,
      skillIds: ['s-008'],
      updatedAt: '2026-09-20 09:44:51',
      enabled: true
    }
  ];
};

export default function LabGradingRuleModal({
  envInfo,
  initialConfig,
  skillCategories,
  onClose,
  onSave
}: LabGradingRuleModalProps) {
  // 仿真包文件状态
  const [standardAnswerFile, setStandardAnswerFile] = useState(
    initialConfig?.standardAnswerFile ?? ''
  );
  const [defaultSimFile, setDefaultSimFile] = useState(
    initialConfig?.defaultSimFile ?? ''
  );

  // 规则列表
  const [rules, setRules] = useState<LabGradingRule[]>(() => {
    if (initialConfig?.rules && initialConfig.rules.length > 0) {
      return initialConfig.rules;
    }
    return generateDefaultRulesForEnv(envInfo);
  });

  // 搜索过滤状态
  const [searchRuleName, setSearchRuleName] = useState('');
  const [filterScoreMethod, setFilterScoreMethod] = useState('');

  // 选中的行（多选删除）
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // 展开行状态
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);

  // 排序状态
  const [sortField, setSortField] = useState<'score' | 'updatedAt' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 分页状态
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState('1');

  // Toast 提示
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 编辑/新建规则弹窗
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleFormName, setRuleFormName] = useState('');
  const [ruleFormScene, setRuleFormScene] = useState('软件实验');
  const [ruleFormType, setRuleFormType] = useState('单个');
  const [ruleFormScoreMethod, setRuleFormScoreMethod] = useState('仿真事件');
  const [ruleFormScore, setRuleFormScore] = useState(10);
  const [ruleFormDesc, setRuleFormDesc] = useState('');
  const [ruleFormSkills, setRuleFormSkills] = useState<string[]>([]);

  // 行内技能点下拉弹出
  const [activeSkillDropdownRuleId, setActiveSkillDropdownRuleId] = useState<string | null>(null);
  const [skillSearchText, setSkillSearchText] = useState('');
  const skillDropdownRef = useRef<HTMLDivElement>(null);

  // 隐藏的上传 input 引用
  const standardFileInputRef = useRef<HTMLInputElement>(null);
  const defaultSimFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 根据技能ID查找技能信息
  const getSkillName = (skillId: string) => {
    for (const cat of skillCategories) {
      const s = cat.skills.find(item => item.id === skillId);
      if (s) return `${s.code} ${s.name}`;
    }
    return skillId;
  };

  // 过滤后的规则列表
  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const matchName = !searchRuleName.trim() || r.name.toLowerCase().includes(searchRuleName.trim().toLowerCase());
      const matchMethod = !filterScoreMethod || r.scene === filterScoreMethod || r.type === filterScoreMethod;
      return matchName && matchMethod;
    });
  }, [rules, searchRuleName, filterScoreMethod]);

  // 排序后的规则
  const sortedRules = useMemo(() => {
    if (!sortField) return filteredRules;
    return [...filteredRules].sort((a, b) => {
      if (sortField === 'score') {
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
      }
      if (sortField === 'updatedAt') {
        const timeA = a.updatedAt || '';
        const timeB = b.updatedAt || '';
        return sortOrder === 'asc' ? timeA.localeCompare(timeB) : timeB.localeCompare(timeA);
      }
      return 0;
    });
  }, [filteredRules, sortField, sortOrder]);

  // 分页切片
  const totalPages = Math.max(1, Math.ceil(sortedRules.length / pageSize));
  const paginatedRules = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRules.slice(start, start + pageSize);
  }, [sortedRules, currentPage, pageSize]);

  // 全选/全不选处理
  const isAllSelected = paginatedRules.length > 0 && paginatedRules.every(r => selectedRowIds.includes(r.id));
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds(prev => prev.filter(id => !paginatedRules.some(r => r.id === id)));
    } else {
      const newIds = Array.from(new Set([...selectedRowIds, ...paginatedRules.map(r => r.id)]));
      setSelectedRowIds(newIds);
    }
  };

  const handleToggleRowSelect = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 展开折叠切换
  const handleToggleExpandRow = (id: string) => {
    setExpandedRowIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 排序切换
  const handleSort = (field: 'score' | 'updatedAt') => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortField(null);
        setSortOrder('asc');
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowIds.length === 0) return;
    setRules(prev => prev.filter(r => !selectedRowIds.includes(r.id)));
    setSelectedRowIds([]);
    showToast(`已成功删除选中的 ${selectedRowIds.length} 条评分规则`);
  };

  // 单条删除
  const handleDeleteSingle = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    setSelectedRowIds(prev => prev.filter(item => item !== id));
    showToast('已删除该评分规则');
  };

  // 重置搜索
  const handleResetSearch = () => {
    setSearchRuleName('');
    setFilterScoreMethod('');
    setCurrentPage(1);
    setJumpPageInput('1');
  };

  // 从模板导入
  const handleImportTemplate = () => {
    const templates = generateDefaultRulesForEnv(envInfo);
    setRules(templates);
    showToast('已成功从推荐模板导入评分规则');
  };

  // AI 一键关联技能点核心逻辑（保留并增强）
  const handleAiAssociateSkills = () => {
    if (rules.length === 0) {
      showToast('当前无评分规则可关联');
      return;
    }
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      let matchedCount = 0;

      setRules(prev => prev.map(rule => {
        const textToAnalyze = (rule.name + ' ' + (rule.description || '') + ' ' + (rule.scene || '')).toLowerCase();
        const matchedSkills: string[] = [];

        if (textToAnalyze.includes('连线') || textToAnalyze.includes('接线') || textToAnalyze.includes('组装') || textToAnalyze.includes('模型')) {
          matchedSkills.push('s-001', 's-007');
        }
        if (textToAnalyze.includes('选型') || textToAnalyze.includes('参数') || textToAnalyze.includes('设置') || textToAnalyze.includes('配置')) {
          matchedSkills.push('s-004');
        }
        if (textToAnalyze.includes('仿真') || textToAnalyze.includes('切断') || textToAnalyze.includes('运行') || textToAnalyze.includes('联锁')) {
          matchedSkills.push('s-002', 's-008');
        }
        if (textToAnalyze.includes('代码') || textToAnalyze.includes('单元测试') || textToAnalyze.includes('断言')) {
          matchedSkills.push('s-003', 's-006');
        }

        if (matchedSkills.length === 0) {
          matchedSkills.push('s-001', 's-002');
        }

        const merged = Array.from(new Set([...(rule.skillIds || []), ...matchedSkills]));
        if (merged.length > (rule.skillIds || []).length) {
          matchedCount++;
        }

        return {
          ...rule,
          skillIds: merged
        };
      }));

      // 展开所有行以便直观查看 AI 匹配效果
      setExpandedRowIds(rules.map(r => r.id));
      showToast(`AI 智能分析完成：已成功为当前规则匹配并关联课程技能点！`);
    }, 700);
  };

  // 单条规则移除技能点
  const handleRemoveSkillFromRule = (ruleId: string, skillId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id !== ruleId) return r;
      return {
        ...r,
        skillIds: r.skillIds.filter(id => id !== skillId)
      };
    }));
  };

  // 单条规则添加/切换技能点
  const handleToggleSkillForRule = (ruleId: string, skillId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id !== ruleId) return r;
      const exists = r.skillIds.includes(skillId);
      return {
        ...r,
        skillIds: exists ? r.skillIds.filter(id => id !== skillId) : [...r.skillIds, skillId]
      };
    }));
  };

  // 打开新建弹窗
  const handleOpenAddModal = () => {
    setEditingRuleId(null);
    setRuleFormName('');
    setRuleFormScene('软件实验');
    setRuleFormType('单个');
    setRuleFormScoreMethod('仿真事件');
    setRuleFormScore(10);
    setRuleFormDesc('');
    setRuleFormSkills([]);
    setIsRuleModalOpen(true);
  };

  // 打开编辑弹窗
  const handleOpenEditModal = (rule: LabGradingRule) => {
    setEditingRuleId(rule.id);
    setRuleFormName(rule.name);
    setRuleFormScene(rule.scene || '软件实验');
    setRuleFormType(rule.ruleCategory || '单个');
    setRuleFormScoreMethod(rule.type || '仿真事件');
    setRuleFormScore(rule.score);
    setRuleFormDesc(rule.description || '');
    setRuleFormSkills(rule.skillIds || []);
    setIsRuleModalOpen(true);
  };

  // 保存规则表单
  const handleSaveRuleForm = () => {
    if (!ruleFormName.trim()) {
      showToast('请输入规则名称');
      return;
    }

    if (editingRuleId) {
      setRules(prev => prev.map(r => {
        if (r.id !== editingRuleId) return r;
        return {
          ...r,
          name: ruleFormName.trim(),
          scene: ruleFormScene,
          ruleCategory: ruleFormType,
          type: ruleFormScoreMethod,
          score: Number(ruleFormScore) || 0,
          description: ruleFormDesc.trim(),
          skillIds: ruleFormSkills,
          updatedAt: formatCurrentTime()
        };
      }));
      showToast('规则已修改');
    } else {
      const newRule: LabGradingRule = {
        id: `rule-${Date.now()}`,
        name: ruleFormName.trim(),
        scene: ruleFormScene,
        ruleCategory: ruleFormType,
        type: ruleFormScoreMethod,
        score: Number(ruleFormScore) || 0,
        description: ruleFormDesc.trim(),
        skillIds: ruleFormSkills,
        updatedAt: formatCurrentTime(),
        enabled: true
      };
      setRules(prev => [...prev, newRule]);
      showToast('规则新建成功');
    }
    setIsRuleModalOpen(false);
  };

  // 确认保存并回传
  const handleConfirmAll = () => {
    onSave({
      standardAnswerFile,
      defaultSimFile,
      rules,
      enabled: true
    });
    onClose();
  };

  // 模拟文件上传
  const handleStandardFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStandardAnswerFile(file.name);
      showToast(`已上传标准答案仿真包：${file.name}`);
    }
  };

  const handleDefaultSimFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDefaultSimFile(file.name);
      showToast(`已上传默认仿真包：${file.name}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="w-[96vw] max-w-6xl h-[88vh] max-h-[820px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Toast 提示浮层 */}
        {toastMessage && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-lg text-xs shadow-xl flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 顶部 Header：标题 + 面包屑 + 关闭 */}
        <div className="px-6 py-3.5 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">添加评分规则</h2>
            <div className="text-xs text-[#1890ff] font-medium flex items-center space-x-1.5">
              <span>物联网（组合型）</span>
              <span>&gt;</span>
              <span>物联网+TB+虚拟仿真</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 顶部 Tabs 选项卡：截图中的 1111 */}
        <div className="px-6 border-b border-slate-200 shrink-0 bg-white flex items-center">
          <div className="relative py-2.5 px-3 text-xs font-bold text-[#1890ff] cursor-pointer">
            <span>1111</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1890ff]" />
          </div>
        </div>

        {/* 内容主体滚动区域 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
          {/* 标准答案与默认仿真包上传区 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* 标准答案 */}
            <div className="flex items-center space-x-2">
              <label className="text-xs text-slate-700 whitespace-nowrap shrink-0 flex items-center">
                <span className="text-red-500 mr-0.5">*</span>
                <span>标准答案</span>
              </label>
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={standardAnswerFile}
                  onChange={(e) => setStandardAnswerFile(e.target.value)}
                  placeholder="请输入仿真包"
                  className="flex-1 h-8 px-3 text-xs border border-slate-200 rounded outline-none focus:border-[#1890ff] transition-colors"
                />
                <input
                  type="file"
                  ref={standardFileInputRef}
                  className="hidden"
                  onChange={handleStandardFileUpload}
                />
                <button
                  type="button"
                  onClick={() => standardFileInputRef.current?.click()}
                  className="h-8 px-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 rounded text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>上传N2V文件</span>
                </button>
              </div>
            </div>

            {/* 默认仿真包 */}
            <div className="flex items-center space-x-2">
              <label className="text-xs text-slate-700 whitespace-nowrap shrink-0">
                默认仿真包
              </label>
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={defaultSimFile}
                  onChange={(e) => setDefaultSimFile(e.target.value)}
                  placeholder="请输入仿真包，不传默认成空包"
                  className="flex-1 h-8 px-3 text-xs border border-slate-200 rounded outline-none focus:border-[#1890ff] transition-colors"
                />
                <input
                  type="file"
                  ref={defaultSimFileInputRef}
                  className="hidden"
                  onChange={handleDefaultSimFileUpload}
                />
                <button
                  type="button"
                  onClick={() => defaultSimFileInputRef.current?.click()}
                  className="h-8 px-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 rounded text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>上传N2V文件</span>
                </button>
              </div>
            </div>
          </div>

          {/* 搜索与查询工具条 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-700 whitespace-nowrap">规则名称:</span>
                <input
                  type="text"
                  value={searchRuleName}
                  onChange={(e) => setSearchRuleName(e.target.value)}
                  placeholder="请输入规则名称"
                  className="w-48 h-8 px-3 text-xs border border-slate-200 rounded outline-none focus:border-[#1890ff] transition-colors"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-700 whitespace-nowrap">评分方式:</span>
                <div className="relative">
                  <select
                    value={filterScoreMethod}
                    onChange={(e) => setFilterScoreMethod(e.target.value)}
                    className="w-48 h-8 pl-3 pr-8 text-xs border border-slate-200 rounded appearance-none outline-none focus:border-[#1890ff] bg-white cursor-pointer"
                  >
                    <option value="">请选择评分方式</option>
                    <option value="软件实验">软件实验</option>
                    <option value="仿真事件">仿真事件</option>
                    <option value="断言校验">断言校验</option>
                    <option value="单元测试">单元测试</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="h-8 px-4 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>查询</span>
              </button>
              <button
                type="button"
                onClick={handleResetSearch}
                className="h-8 px-4 border border-[#1890ff] text-[#1890ff] hover:bg-blue-50/50 bg-white rounded text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 表格操作按钮条 */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="h-8 px-3.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium flex items-center space-x-1 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建</span>
              </button>

              <button
                type="button"
                onClick={handleBatchDelete}
                disabled={selectedRowIds.length === 0}
                className={`h-8 px-3.5 border rounded text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                  selectedRowIds.length > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                    : 'bg-rose-50/40 border-rose-100 text-rose-300 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>

              <button
                type="button"
                onClick={handleImportTemplate}
                className="h-8 px-3.5 bg-[#e6f7ff] hover:bg-[#bae7ff] border border-[#91d5ff] text-[#1890ff] rounded text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>从模板导入</span>
              </button>

              {/* 核心需求保留：AI一键关联技能点 */}
              <button
                type="button"
                onClick={handleAiAssociateSkills}
                disabled={isAiLoading || rules.length === 0}
                className={`h-8 px-3.5 rounded text-xs font-medium flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer ${
                  isAiLoading
                    ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white active:scale-98'
                }`}
                title="通过大模型提取考核关键词，一键批量为当前环境评分规则匹配课程技能点"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin text-purple-200' : 'text-amber-300'}`} />
                <span>{isAiLoading ? 'AI 分析关联中...' : 'AI 一键关联技能点'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => showToast('已成功调起导入数据包')}
                className="h-8 px-3.5 border border-[#91d5ff] bg-[#e6f7ff] text-[#1890ff] hover:bg-[#bae7ff] rounded text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>导入</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('已成功导出评分规则配置列表')}
                className="h-8 px-3.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>导出</span>
              </button>
            </div>
          </div>

          {/* 表格区域 */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-slate-200 text-slate-600 font-medium">
                  <th className="w-10 px-3 py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="w-8 py-2.5"></th>
                  <th className="px-4 py-2.5 font-medium">规则名称</th>
                  <th className="px-4 py-2.5 font-medium">评分场景</th>
                  <th className="px-4 py-2.5 font-medium cursor-pointer" onClick={() => handleSort('score')}>
                    <div className="flex items-center space-x-1 hover:text-slate-900">
                      <span>分值</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-2.5 font-medium">类型</th>
                  <th className="px-4 py-2.5 font-medium cursor-pointer" onClick={() => handleSort('updatedAt')}>
                    <div className="flex items-center space-x-1 hover:text-slate-900">
                      <span>更新</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-2.5 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white text-slate-700">
                {paginatedRules.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      暂无符合条件的评分规则
                    </td>
                  </tr>
                ) : (
                  paginatedRules.map(rule => {
                    const isChecked = selectedRowIds.includes(rule.id);
                    const isExpanded = expandedRowIds.includes(rule.id);
                    const isDropdownOpen = activeSkillDropdownRuleId === rule.id;

                    return (
                      <React.Fragment key={rule.id}>
                        <tr className={`hover:bg-slate-50/70 transition-colors ${isChecked ? 'bg-blue-50/20' : ''}`}>
                          <td className="px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleRowSelect(rule.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-3">
                            <button
                              type="button"
                              onClick={() => handleToggleExpandRow(rule.id)}
                              className="text-slate-400 hover:text-slate-700 transition-transform cursor-pointer p-0.5"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-normal text-slate-800">
                            {rule.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {rule.scene || '软件实验'}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {rule.score}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {rule.ruleCategory || '单个'}
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                            {rule.updatedAt || '2026-09-20 09:44:51'}
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(rule)}
                              className="text-[#1890ff] hover:underline mr-3 cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSingle(rule.id)}
                              className="text-rose-500 hover:underline cursor-pointer"
                            >
                              删除
                            </button>
                          </td>
                        </tr>

                        {/* 展开行：展示关联的技能点与规则说明 */}
                        {isExpanded && (
                          <tr className="bg-slate-50/50 border-b border-slate-200">
                            <td colSpan={8} className="px-10 py-3">
                              <div className="space-y-2 text-xs">
                                {rule.description && (
                                  <div className="flex items-start space-x-2 text-slate-600">
                                    <span className="text-slate-400 shrink-0 font-medium">判分说明:</span>
                                    <span>{rule.description}</span>
                                  </div>
                                )}

                                <div className="flex items-center flex-wrap gap-1.5">
                                  <span className="text-slate-400 font-medium flex items-center mr-1">
                                    <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                    关联技能点:
                                  </span>

                                  {(!rule.skillIds || rule.skillIds.length === 0) ? (
                                    <span className="text-[11px] text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                      暂未关联技能点（可点击右侧按钮添加或使用AI一键关联）
                                    </span>
                                  ) : (
                                    rule.skillIds.map(sId => (
                                      <span
                                        key={sId}
                                        className="inline-flex items-center space-x-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded text-[11px]"
                                      >
                                        <span>{getSkillName(sId)}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveSkillFromRule(rule.id, sId)}
                                          className="text-indigo-400 hover:text-indigo-700 rounded hover:bg-indigo-100 p-0.2 cursor-pointer"
                                          title="移除此技能点"
                                        >
                                          <X className="w-2.5 h-2.5" />
                                        </button>
                                      </span>
                                    ))
                                  )}

                                  {/* 关联技能点下拉 */}
                                  <div className="relative inline-block" ref={isDropdownOpen ? skillDropdownRef : null}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isDropdownOpen) {
                                          setActiveSkillDropdownRuleId(null);
                                        } else {
                                          setActiveSkillDropdownRuleId(rule.id);
                                          setSkillSearchText('');
                                        }
                                      }}
                                      className="px-2 py-0.5 border border-dashed border-slate-300 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 rounded text-[11px] flex items-center space-x-1 transition-colors bg-white cursor-pointer"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>关联技能点</span>
                                      <ChevronDown className="w-2.5 h-2.5" />
                                    </button>

                                    {isDropdownOpen && (
                                      <div className="absolute left-0 top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-2.5">
                                        <div className="relative mb-2">
                                          <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                                          <input
                                            type="text"
                                            value={skillSearchText}
                                            onChange={(e) => setSkillSearchText(e.target.value)}
                                            placeholder="搜索课程技能点..."
                                            className="w-full pl-6 pr-2 py-1 text-xs border border-slate-200 rounded outline-none focus:border-[#1890ff]"
                                            autoFocus
                                          />
                                        </div>

                                        <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                                          {skillCategories.map(cat => {
                                            const filteredSkills = cat.skills.filter(s =>
                                              s.name.toLowerCase().includes(skillSearchText.toLowerCase()) ||
                                              s.code.includes(skillSearchText)
                                            );
                                            if (filteredSkills.length === 0) return null;

                                            return (
                                              <div key={cat.id} className="space-y-1">
                                                <div className="text-[11px] font-bold text-slate-600 bg-slate-100/70 px-2 py-0.5 rounded flex items-center justify-between">
                                                  <span>{cat.code} {cat.name}</span>
                                                </div>
                                                <div className="pl-1 space-y-0.5">
                                                  {filteredSkills.map(skill => {
                                                    const isChecked = rule.skillIds?.includes(skill.id);
                                                    return (
                                                      <div
                                                        key={skill.id}
                                                        onClick={() => handleToggleSkillForRule(rule.id, skill.id)}
                                                        className={`px-2 py-1 rounded cursor-pointer text-xs flex items-center justify-between transition-colors ${
                                                          isChecked
                                                            ? 'bg-indigo-50 text-indigo-800 font-medium'
                                                            : 'hover:bg-slate-50 text-slate-700'
                                                        }`}
                                                      >
                                                        <span className="truncate">{skill.code} {skill.name}</span>
                                                        {isChecked && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                          <span className="text-slate-400">已选 {rule.skillIds?.length || 0} 个</span>
                                          <button
                                            type="button"
                                            onClick={() => setActiveSkillDropdownRuleId(null)}
                                            className="px-2.5 py-0.5 bg-[#1890ff] text-white rounded text-xs hover:bg-blue-600 cursor-pointer"
                                          >
                                            完成
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 分页控制器 */}
          <div className="flex items-center justify-end space-x-3 text-xs text-slate-600 pt-2 pb-1">
            <span>共 {sortedRules.length} 条</span>

            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:border-[#1890ff] cursor-pointer"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              >
                &lt;
              </button>
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center border border-[#1890ff] bg-[#1890ff] text-white rounded font-medium"
              >
                {currentPage}
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              >
                &gt;
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <span>前往</span>
              <input
                type="text"
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const p = parseInt(jumpPageInput, 10);
                    if (!isNaN(p) && p >= 1 && p <= totalPages) {
                      setCurrentPage(p);
                    } else {
                      setJumpPageInput(String(currentPage));
                    }
                  }
                }}
                className="w-10 h-7 border border-slate-200 rounded text-center outline-none focus:border-[#1890ff]"
              />
              <span>页</span>
            </div>
          </div>
        </div>

        {/* 弹窗底部操作按钮（居中对齐） */}
        <div className="py-4 border-t border-slate-200 bg-white flex items-center justify-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-20 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded text-xs transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirmAll}
            className="w-20 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            确认
          </button>
        </div>
      </motion.div>

      {/* 新建/编辑规则弹窗 */}
      <AnimatePresence>
        {isRuleModalOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  {editingRuleId ? '编辑评分规则' : '新建评分规则'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    <span className="text-red-500 mr-0.5">*</span>规则名称
                  </label>
                  <input
                    type="text"
                    value={ruleFormName}
                    onChange={(e) => setRuleFormName(e.target.value)}
                    placeholder="如：设备连线、参数断言检验等"
                    className="w-full h-8 px-3 border border-slate-200 rounded outline-none focus:border-[#1890ff]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">评分场景</label>
                    <input
                      type="text"
                      value={ruleFormScene}
                      onChange={(e) => setRuleFormScene(e.target.value)}
                      placeholder="如：软件实验"
                      className="w-full h-8 px-3 border border-slate-200 rounded outline-none focus:border-[#1890ff]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">分值</label>
                    <input
                      type="number"
                      value={ruleFormScore}
                      onChange={(e) => setRuleFormScore(Number(e.target.value))}
                      className="w-full h-8 px-3 border border-slate-200 rounded outline-none focus:border-[#1890ff] font-bold text-[#1890ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">规则类型</label>
                    <select
                      value={ruleFormType}
                      onChange={(e) => setRuleFormType(e.target.value)}
                      className="w-full h-8 px-3 border border-slate-200 rounded outline-none focus:border-[#1890ff] bg-white cursor-pointer"
                    >
                      <option value="单个">单个</option>
                      <option value="组合">组合</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">评分方式</label>
                    <select
                      value={ruleFormScoreMethod}
                      onChange={(e) => setRuleFormScoreMethod(e.target.value)}
                      className="w-full h-8 px-3 border border-slate-200 rounded outline-none focus:border-[#1890ff] bg-white cursor-pointer"
                    >
                      <option value="仿真事件">仿真事件</option>
                      <option value="断言校验">断言校验</option>
                      <option value="单元测试">单元测试</option>
                      <option value="控制台输出">控制台输出</option>
                      <option value="AI语义打分">AI语义打分</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">规则描述 / 判分说明</label>
                  <textarea
                    value={ruleFormDesc}
                    onChange={(e) => setRuleFormDesc(e.target.value)}
                    rows={2}
                    placeholder="输入自动化评分的判分逻辑或针对学生的考核指导说明..."
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-[#1890ff] resize-none"
                  />
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:bg-white rounded text-xs cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveRuleForm}
                  className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

