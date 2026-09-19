import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  Sliders, 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  BookOpen,
  Cpu,
  Layers,
  ChevronDown,
  Info,
  Edit2
} from 'lucide-react';
import { SkillCategory, SkillItem } from './TeacherStepEditorModal';

export interface LabGradingRule {
  id: string;
  name: string;
  description: string;
  type: 'unit_test' | 'assertion' | 'simulation_event' | 'console_output' | 'ai_semantic';
  score: number;
  skillIds: string[];
  enabled: boolean;
}

export interface LabEnvGradingConfig {
  enabled: boolean;
  totalScore: number;
  passScore: number;
  allowViewDiagnostics: boolean;
  rules: LabGradingRule[];
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

const RULE_TYPE_MAP: Record<LabGradingRule['type'], { label: string; color: string; bg: string }> = {
  unit_test: { label: '单元测试', color: 'text-indigo-700 border-indigo-200', bg: 'bg-indigo-50' },
  assertion: { label: '断言校验', color: 'text-purple-700 border-purple-200', bg: 'bg-purple-50' },
  simulation_event: { label: '仿真事件', color: 'text-blue-700 border-blue-200', bg: 'bg-blue-50' },
  console_output: { label: '控制台输出', color: 'text-emerald-700 border-emerald-200', bg: 'bg-emerald-50' },
  ai_semantic: { label: 'AI语义打分', color: 'text-amber-700 border-amber-200', bg: 'bg-amber-50' }
};

// 预置默认评分规则生成器
export const generateDefaultRulesForEnv = (env: { title: string; category?: string }): LabGradingRule[] => {
  const isSimulation = env.category === 'simulation' || env.title.includes('仿真');
  
  if (isSimulation) {
    return [
      {
        id: 'rule-sim-1',
        name: '虚拟场景三维设备组装与接线顺序',
        description: '检测虚拟仿真环境中三维模型的拼装完整度及核心端子接线时序',
        type: 'simulation_event',
        score: 35,
        skillIds: ['s-001', 's-007'],
        enabled: true
      },
      {
        id: 'rule-sim-2',
        name: '关键工况物理参数与控制阈值设定匹配',
        description: '断言校验仿真控制面板输入的 PID 增益、采样频率与物理量参数',
        type: 'assertion',
        score: 35,
        skillIds: ['s-004'],
        enabled: true
      },
      {
        id: 'rule-sim-3',
        name: '安全联锁动作触发与事故响应测试',
        description: '单元测试验证在超温超压工况下仿真机构能否正确触发联锁切断',
        type: 'unit_test',
        score: 30,
        skillIds: ['s-002', 's-008'],
        enabled: true
      }
    ];
  }

  // Jupyter 环境默认规则
  return [
    {
      id: 'rule-jup-1',
      name: 'Jupyter Notebook 代码单元顺序执行与无异常',
      description: '自动化检测所有代码单元（Code Cell）是否按序跑通且无 Syntax/Runtime 报错',
      type: 'unit_test',
      score: 30,
      skillIds: ['s-006', 's-001'],
      enabled: true
    },
    {
      id: 'rule-jup-2',
      name: '输出张量维度与分类准确率断言检测',
      description: '校验输出的目标张量 shape 以及在验证集上的 accuracy 是否达到设计阈值',
      type: 'assertion',
      score: 40,
      skillIds: ['s-003', 's-004'],
      enabled: true
    },
    {
      id: 'rule-jup-3',
      name: '模型训练收敛与权重 Checkpoint 文件保存',
      description: '静态检验 output 目录下是否生成指定格式的模型权重持久化文件',
      type: 'unit_test',
      score: 30,
      skillIds: ['s-010'],
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
  const [enabled, setEnabled] = useState(initialConfig?.enabled ?? true);
  const [totalScore, setTotalScore] = useState(initialConfig?.totalScore ?? 100);
  const [passScore, setPassScore] = useState(initialConfig?.passScore ?? 60);
  const [allowViewDiagnostics, setAllowViewDiagnostics] = useState(
    initialConfig?.allowViewDiagnostics ?? true
  );
  const [rules, setRules] = useState<LabGradingRule[]>(() => {
    if (initialConfig?.rules && initialConfig.rules.length > 0) {
      return initialConfig.rules;
    }
    return generateDefaultRulesForEnv(envInfo);
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 技能点选择下拉菜单状态 (ruleId -> boolean)
  const [activeSkillDropdownRuleId, setActiveSkillDropdownRuleId] = useState<string | null>(null);
  const [skillSearchText, setSkillSearchText] = useState('');
  const skillDropdownRef = useRef<HTMLDivElement>(null);

  // 新建规则表单抽屉
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleType, setNewRuleType] = useState<LabGradingRule['type']>('assertion');
  const [newRuleScore, setNewRuleScore] = useState(20);
  const [newRuleSkills, setNewRuleSkills] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 点击外部关闭技能点下拉
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(e.target as Node)) {
        setActiveSkillDropdownRuleId(null);
      }
    };
    if (activeSkillDropdownRuleId) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [activeSkillDropdownRuleId]);

  // 根据技能ID查找技能名称
  const getSkillName = (skillId: string) => {
    for (const cat of skillCategories) {
      const s = cat.skills.find(item => item.id === skillId);
      if (s) return s.name;
    }
    return skillId;
  };

  // 计算当前全部规则的分值总和
  const currentTotalScore = rules.reduce((acc, r) => acc + (r.enabled ? Number(r.score) || 0 : 0), 0);

  // AI 一键关联技能点逻辑
  const handleAiAssociateSkills = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      let updatedCount = 0;

      setRules(prev => prev.map(rule => {
        const textToAnalyze = (rule.name + ' ' + (rule.description || '')).toLowerCase();
        const matchedSkills: string[] = [];

        // 语义匹配规则库
        if (textToAnalyze.includes('张量') || textToAnalyze.includes('tensor') || textToAnalyze.includes('维度') || textToAnalyze.includes('矩阵')) {
          matchedSkills.push('s-006');
        }
        if (textToAnalyze.includes('神经网络') || textToAnalyze.includes('结构') || textToAnalyze.includes('接线') || textToAnalyze.includes('组装')) {
          matchedSkills.push('s-001');
        }
        if (textToAnalyze.includes('激活') || textToAnalyze.includes('relu') || textToAnalyze.includes('sigmoid') || textToAnalyze.includes('动作')) {
          matchedSkills.push('s-002');
        }
        if (textToAnalyze.includes('损失') || textToAnalyze.includes('loss') || textToAnalyze.includes('断言') || textToAnalyze.includes('指标')) {
          matchedSkills.push('s-003');
        }
        if (textToAnalyze.includes('优化') || textToAnalyze.includes('参数') || textToAnalyze.includes('学习率') || textToAnalyze.includes('梯度')) {
          matchedSkills.push('s-004');
        }
        if (textToAnalyze.includes('反向传播') || textToAnalyze.includes('导数') || textToAnalyze.includes('收敛')) {
          matchedSkills.push('s-005');
        }
        if (textToAnalyze.includes('计算图') || textToAnalyze.includes('联锁') || textToAnalyze.includes('时序')) {
          matchedSkills.push('s-007');
        }
        if (textToAnalyze.includes('训练') || textToAnalyze.includes('运行') || textToAnalyze.includes('测试') || textToAnalyze.includes('仿真')) {
          matchedSkills.push('s-008');
        }
        if (textToAnalyze.includes('数据') || textToAnalyze.includes('读取') || textToAnalyze.includes('管线')) {
          matchedSkills.push('s-009');
        }
        if (textToAnalyze.includes('保存') || textToAnalyze.includes('权重') || textToAnalyze.includes('checkpoint') || textToAnalyze.includes('加载')) {
          matchedSkills.push('s-010');
        }
        if (textToAnalyze.includes('卷积') || textToAnalyze.includes('特征')) {
          matchedSkills.push('s-011');
        }

        if (matchedSkills.length === 0) {
          matchedSkills.push('s-001', 's-002');
        }

        const merged = Array.from(new Set([...(rule.skillIds || []), ...matchedSkills]));
        if (merged.length > (rule.skillIds || []).length) {
          updatedCount++;
        }

        return {
          ...rule,
          skillIds: merged
        };
      }));

      showToast(`AI 智能分析完成：已为当前 ${rules.length} 条评分规则成功匹配并关联技能点！`);
    }, 700);
  };

  // 单条规则移除某个技能点
  const handleRemoveSkillFromRule = (ruleId: string, skillId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id !== ruleId) return r;
      return {
        ...r,
        skillIds: r.skillIds.filter(id => id !== skillId)
      };
    }));
  };

  // 单条规则添加/切换某个技能点
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

  // 添加新规则
  const handleConfirmAddRule = () => {
    if (!newRuleName.trim()) {
      showToast('请输入评分规则名称');
      return;
    }
    const newRule: LabGradingRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim(),
      description: newRuleDesc.trim(),
      type: newRuleType,
      score: Number(newRuleScore) || 10,
      skillIds: newRuleSkills,
      enabled: true
    };
    setRules(prev => [...prev, newRule]);
    setIsAddingRule(false);
    setNewRuleName('');
    setNewRuleDesc('');
    setNewRuleScore(20);
    setNewRuleSkills([]);
    showToast('评分规则添加成功');
  };

  // 重置为推荐模板
  const handleResetToTemplate = () => {
    const defaultRules = generateDefaultRulesForEnv(envInfo);
    setRules(defaultRules);
    showToast('已重置载入当前实训环境的标准评测规则');
  };

  // 保存并回传
  const handleSave = () => {
    onSave({
      enabled,
      totalScore,
      passScore,
      allowViewDiagnostics,
      rules
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="w-[90vw] max-w-5xl h-[88vh] max-h-[820px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-xl text-xs shadow-xl flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 弹窗头部 */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-800">
                  【{envInfo.title}】实验评分规则配置
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  {envInfo.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                支持单元测试、代码断言、仿真交互事件及大模型语义检测，并精准绑定能力考核技能点
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 启用自动评分 Switch */}
            <div className="flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">自动评分</span>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                  enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 基础配置条目（分值、及格线、即时反馈） */}
        <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-2">
              <span className="text-slate-600 font-medium">满分值:</span>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  value={totalScore}
                  onChange={(e) => setTotalScore(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-blue-700 outline-none focus:border-blue-500"
                />
                <span className="text-slate-400">分</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-600 font-medium">及格分:</span>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  value={passScore}
                  onChange={(e) => setPassScore(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-slate-700 outline-none focus:border-blue-500"
                />
                <span className="text-slate-400">分</span>
              </div>
            </div>

            <label className="flex items-center space-x-1.5 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={allowViewDiagnostics}
                onChange={(e) => setAllowViewDiagnostics(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>学生评测后可查看错误断言与诊断建议</span>
            </label>
          </div>

          {/* 分数核算提示 */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">
              规则有效分总计: 
              <strong className={`ml-1 ${currentTotalScore === totalScore ? 'text-emerald-600' : 'text-amber-600 font-bold'}`}>
                {currentTotalScore}
              </strong> / {totalScore} 分
            </span>
            {currentTotalScore !== totalScore && (
              <span className="text-[11px] text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>与满分值不一致</span>
              </span>
            )}
          </div>
        </div>

        {/* 主操作栏：AI一键关联技能点、新建规则、载入模板 */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAddingRule(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建评分规则</span>
            </button>

            {/* AI 一键关联技能点核心按钮 */}
            <button
              type="button"
              disabled={isAiLoading || rules.length === 0}
              onClick={handleAiAssociateSkills}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                isAiLoading
                  ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/20 active:scale-98'
              }`}
              title="通过大模型提取考核关键词，一键批量为当前环境评分规则匹配课程技能点"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin text-purple-500' : 'text-amber-300'}`} />
              <span>{isAiLoading ? 'AI 正在智能分析关联...' : 'AI 一键关联技能点'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetToTemplate}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置推荐模板</span>
            </button>
            <span className="text-xs text-slate-400 font-normal">
              共 <strong className="text-slate-700">{rules.length}</strong> 条评分规则
            </span>
          </div>
        </div>

        {/* 规则编辑/新增弹出卡片 (Drawer/Card) */}
        <AnimatePresence>
          {isAddingRule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-blue-200 bg-blue-50/40 px-6 py-4 shrink-0 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-xs font-bold text-slate-800">新建实验评分规则</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-4">
                  <label className="block text-slate-600 font-medium mb-1">规则名称 *</label>
                  <input
                    type="text"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="如：模型训练权重保存检验..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">评测方式</label>
                  <select
                    value={newRuleType}
                    onChange={(e) => setNewRuleType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="assertion">断言校验 (Assertion)</option>
                    <option value="unit_test">单元测试 (Unit Test)</option>
                    <option value="simulation_event">仿真交互事件</option>
                    <option value="console_output">控制台标准输出</option>
                    <option value="ai_semantic">AI大模型语义打分</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">分值权重</label>
                  <input
                    type="number"
                    value={newRuleScore}
                    onChange={(e) => setNewRuleScore(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs font-bold text-blue-700"
                  />
                </div>

                <div className="sm:col-span-3 flex items-end space-x-2">
                  <button
                    type="button"
                    onClick={handleConfirmAddRule}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    确认添加
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingRule(false)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-white text-slate-600 rounded-lg text-xs"
                  >
                    取消
                  </button>
                </div>

                <div className="sm:col-span-12">
                  <label className="block text-slate-600 font-medium mb-1">规则描述与评测要点</label>
                  <input
                    type="text"
                    value={newRuleDesc}
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    placeholder="输入自动化评分的判分逻辑或针对学生的考核指导说明..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 评分规则列表区域 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-slate-50/50">
          {rules.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16">
              <FileCode2 className="w-12 h-12 text-slate-300 stroke-1 mb-2" />
              <p className="text-sm font-medium text-slate-600">暂未配置评分规则</p>
              <p className="text-xs text-slate-400 mt-1">
                您可以点击「新建评分规则」或直接「载入推荐模板」快速初始化
              </p>
              <div className="mt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={handleResetToTemplate}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-xs"
                >
                  载入推荐模板
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule, idx) => {
                const typeInfo = RULE_TYPE_MAP[rule.type] || RULE_TYPE_MAP.assertion;
                const isDropdownOpen = activeSkillDropdownRuleId === rule.id;

                return (
                  <div
                    key={rule.id}
                    className={`bg-white rounded-xl border transition-all p-4 shadow-xs relative ${
                      rule.enabled
                        ? 'border-slate-200/90 hover:border-blue-300 hover:shadow-md'
                        : 'border-slate-200/60 bg-slate-50/70 opacity-65'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* 规则基本信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800">
                            {rule.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${typeInfo.bg} ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[11px]">
                            {rule.score} 分
                          </span>
                        </div>

                        {rule.description && (
                          <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">
                            {rule.description}
                          </p>
                        )}

                        {/* 关联技能点展示区域（重点需求！） */}
                        <div className="mt-3 flex items-center flex-wrap gap-1.5">
                          <span className="text-[11px] text-slate-400 font-medium flex items-center mr-1">
                            <BookOpen className="w-3 h-3 mr-1 text-slate-400" />
                            关联技能点:
                          </span>

                          {(!rule.skillIds || rule.skillIds.length === 0) ? (
                            <span className="text-[11px] text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              尚未关联技能点
                            </span>
                          ) : (
                            rule.skillIds.map(sId => (
                              <span
                                key={sId}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 bg-indigo-50/80 border border-indigo-200 text-indigo-700 rounded text-[11px]"
                              >
                                <span className="font-medium">{getSkillName(sId)}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkillFromRule(rule.id, sId)}
                                  className="text-indigo-400 hover:text-indigo-700 rounded hover:bg-indigo-100 p-0.2"
                                  title="移除此技能点"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))
                          )}

                          {/* 添加/修改关联技能点按钮与下拉选择树 */}
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

                            {/* 技能点多选下拉选择树浮层 */}
                            {isDropdownOpen && (
                              <div className="absolute left-0 top-full mt-1 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-2.5 animate-in fade-in duration-150">
                                <div className="relative mb-2">
                                  <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                                  <input
                                    type="text"
                                    value={skillSearchText}
                                    onChange={(e) => setSkillSearchText(e.target.value)}
                                    placeholder="搜索全课程技能点..."
                                    className="w-full pl-6 pr-2 py-1 text-xs border border-slate-200 rounded-md outline-none focus:border-blue-500"
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
                                  <span className="text-slate-400">
                                    已关联 {rule.skillIds?.length || 0} 个
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setActiveSkillDropdownRuleId(null)}
                                    className="px-2.5 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                  >
                                    完成
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 右侧操作栏（启用开关、分值调节、删除） */}
                      <div className="flex items-center space-x-3 shrink-0 pt-0.5">
                        <div className="flex items-center space-x-1">
                          <span className="text-[11px] text-slate-400">分值:</span>
                          <input
                            type="number"
                            value={rule.score}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRules(prev => prev.map(r => r.id === rule.id ? { ...r, score: val } : r));
                            }}
                            className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-xs text-center font-bold text-blue-700"
                          />
                        </div>

                        {/* 启用 Switch */}
                        <button
                          type="button"
                          onClick={() => {
                            setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
                          }}
                          className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                            rule.enabled ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                          title={rule.enabled ? '已启用此规则' : '已禁用此规则'}
                        >
                          <div
                            className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                              rule.enabled ? 'translate-x-3' : 'translate-x-0'
                            }`}
                          />
                        </button>

                        {/* 删除规则 */}
                        <button
                          type="button"
                          onClick={() => {
                            setRules(prev => prev.filter(r => r.id !== rule.id));
                            showToast('已删除该评分规则');
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="删除此规则"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 弹窗底部操作条 */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <span>评分规则将在学生提交实验时由评测引擎自动运行打分并生成能力雷达图诊断报告</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              保存评分规则配置
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
