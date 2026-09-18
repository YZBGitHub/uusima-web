import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  ArrowUp, 
  ArrowDown, 
  Link2, 
  Box, 
  Plus, 
  Minus, 
  ChevronRight, 
  Bold, 
  Underline, 
  Italic, 
  Strikethrough, 
  Heading, 
  Code, 
  Image, 
  Undo, 
  Redo, 
  Eye, 
  List, 
  ListOrdered, 
  UploadCloud, 
  Copy, 
  Cpu, 
  Target, 
  Book,
  Search,
  Sparkles,
  Check,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ChevronsRight,
  ChevronsLeft,
  CheckCircle2,
  RotateCw,
  GitBranch,
  Layers,
  CheckSquare,
  Square
} from 'lucide-react';

export interface TeacherTask {
  id: string;
  title: string;
  type: string;
  hasTrial?: boolean;
  chapterName?: string;
  skillIds?: string[];
  labEnvIds?: string[];
  labGradingConfig?: any;
}

export interface TeacherChapter {
  id: number;
  title: string;
  tasks: TeacherTask[];
}

export interface SkillItem {
  id: string;
  code: string;
  name: string;
}

export interface SkillCategory {
  id: string;
  code: string;
  name: string;
  skills: SkillItem[];
}

export interface TeacherStepEditorModalProps {
  task: TeacherTask;
  courseName?: string;
  chapters?: TeacherChapter[];
  skillCategories?: SkillCategory[];
  onClose: () => void;
  onSave?: (updatedTask: TeacherTask) => void;
}

// 默认全课程技能点树（与课程编辑器保持一致）
const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'cat-A',
    code: 'A',
    name: '深度学习基础',
    skills: [
      { id: 's-001', code: '001', name: '神经网络基本结构' },
      { id: 's-002', code: '002', name: '激活函数' },
      { id: 's-003', code: '003', name: '损失函数' },
      { id: 's-004', code: '004', name: '优化算法' },
      { id: 's-005', code: '005', name: '反向传播原理' },
    ]
  },
  {
    id: 'cat-B',
    code: 'B',
    name: 'Tensorflow框架应用',
    skills: [
      { id: 's-006', code: '001', name: '张量操作' },
      { id: 's-007', code: '002', name: '计算图构建' },
      { id: 's-008', code: '003', name: '简单模型训练' },
      { id: 's-009', code: '004', name: '数据读取管线' },
      { id: 's-010', code: '005', name: '模型保存与加载' },
    ]
  },
  {
    id: 'cat-C',
    code: 'C',
    name: '卷积神经网络',
    skills: [
      { id: 's-011', code: '001', name: '卷积层与卷积核' },
      { id: 's-012', code: '002', name: '池化层计算' },
      { id: 's-013', code: '003', name: '经典网络架构' },
      { id: 's-014', code: '004', name: '迁移学习' },
      { id: 's-015', code: '005', name: 'Transformer架构' },
    ]
  }
];

// 实验大厅全部实验环境列表（10款主流实训环境）
export const LAB_HALL_ENVIRONMENTS = [
  { id: 'env-1', title: '大数据-jupyter', type: '容器型', category: 'jupyter', typeColor: 'bg-purple-500', desc: '支持分布式大数据分析与 Python 交互式编程环境' },
  { id: 'env-2', title: '工程虚拟仿真', type: '平台型', category: 'simulation', typeColor: 'bg-blue-500', desc: '支持三维可视化界面的工程虚拟仿真应用设计' },
  { id: 'env-3', title: '3D应用设计器', type: '平台型', category: 'platform', typeColor: 'bg-blue-500', desc: '支持三维可视化界面的交互应用搭建' },
  { id: 'env-4', title: '行业云', type: '平台型', category: 'platform', typeColor: 'bg-blue-500', desc: '行业云平台是一款功能全面的工业云实训系统' },
  { id: 'env-5', title: '嵌入式(仿真+Renode)', type: '组合型', category: 'simulation', typeColor: 'bg-[#1e5aa0]', desc: '嵌入式虚拟仿真与 Renode 虚拟目标机联合实训平台' },
  { id: 'env-6', title: 'ThingsBoard', type: '平台型', category: 'platform', typeColor: 'bg-blue-500', desc: '开源物联网平台设备连接与数据流转实战' },
  { id: 'env-7', title: '2D应用设计器', type: '平台型', category: 'platform', typeColor: 'bg-blue-500', desc: '快速搭建 2D 组态与图形化人机交互界面' },
  { id: 'env-8', title: '数据标注平台实验环境', type: '平台型', category: 'platform', typeColor: 'bg-blue-500', desc: '开源数据标注工具，支持视觉与文本深度标注' },
  { id: 'env-9', title: 'VSCode', type: '容器型', category: 'container', typeColor: 'bg-purple-500', desc: '轻量化云端 IDE 容器，支持全栈代码工程开发' },
  { id: 'env-10', title: '人工智能平台-jupyter', type: '容器型', category: 'jupyter', typeColor: 'bg-purple-500', desc: '内置 PyTorch/TensorFlow 的深度学习交互式实训平台' }
];

const typeConfig: Record<string, { label: string, color: string }> = {
  text: { label: '图文', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  video: { label: '视频', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  exercise: { label: '习题', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  experiment: { label: '实验', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  report: { label: '报告', color: 'bg-purple-100 text-purple-600 border-purple-200' }
};

export default function TeacherStepEditorModal({ 
  task, 
  courseName, 
  chapters = [], 
  skillCategories = DEFAULT_SKILL_CATEGORIES,
  onClose,
  onSave 
}: TeacherStepEditorModalProps) {
  const [currentTask, setCurrentTask] = useState<TeacherTask>(task);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [activeTab, setActiveTab] = useState(`${task.type}_settings`);
  const [currentType, setCurrentType] = useState(task.type);
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<number[]>(chapters.map(c => c.id));
  
  const toggleChapter = (id: number) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const expandAll = () => setExpandedChapters(chapters.map(c => c.id));
  const collapseAll = () => setExpandedChapters([]);

  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        const modalLeft = sidebarRef.current.getBoundingClientRect().left;
        const newWidth = e.clientX - modalLeft;
        setSidebarWidth(Math.max(200, Math.min(500, newWidth)));
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  // Update internal state when navigating between tasks via sidebar
  useEffect(() => {
    setCurrentType(currentTask.type);
    setTaskTitle(currentTask.title);
    const newType = currentTask.type;
    setActiveTab(`${newType}_settings`);
    // 同步关联的技能点
    setSelectedSkillIds(currentTask.skillIds || ['s-001', 's-002']);
    setLeftCheckedSkillIds([]);
    setRightCheckedSkillIds([]);
    // 同步关联的实验环境
    setSelectedLabEnvIds(currentTask.labEnvIds || ['env-1', 'env-2']);
  }, [currentTask]);

  // -------------------------------------------------------------
  // 实验步骤：实验环境配置（多选与搜索）及评分设置状态
  // -------------------------------------------------------------
  const [selectedLabEnvIds, setSelectedLabEnvIds] = useState<string[]>(
    task.labEnvIds || ['env-1', 'env-2']
  );
  const [isLabEnvDropdownOpen, setIsLabEnvDropdownOpen] = useState(false);
  const [labEnvSearchText, setLabEnvSearchText] = useState('');
  const labEnvDropdownRef = useRef<HTMLDivElement>(null);

  // 评分设置状态
  const [isAutoGradingEnabled, setIsAutoGradingEnabled] = useState(
    task.labGradingConfig?.enabled ?? true
  );
  const [gradingTotalScore, setGradingTotalScore] = useState(
    task.labGradingConfig?.totalScore ?? 100
  );
  const [gradingPassScore, setGradingPassScore] = useState(
    task.labGradingConfig?.passScore ?? 60
  );
  const [allowViewDiagnostics, setAllowViewDiagnostics] = useState(true);
  const [gradingWeights, setGradingWeights] = useState({
    codeExecution: 40,      // 代码单元执行率 (Jupyter)
    assertionTest: 30,      // 输出断言校验 (Jupyter)
    simulationOperation: 40,// 仿真步骤完成度 (虚拟仿真)
    paramAccuracy: 30,      // 参数设定正确率 (虚拟仿真)
    reportQuality: 30       // 实验总结报告 (通用)
  });

  // 判断选中的实验环境是否包含“虚拟仿真”或“Jupyter”
  const hasJupyterEnv = selectedLabEnvIds.some(id => {
    const env = LAB_HALL_ENVIRONMENTS.find(e => e.id === id);
    return env && (env.category === 'jupyter' || env.title.toLowerCase().includes('jupyter'));
  });

  const hasSimulationEnv = selectedLabEnvIds.some(id => {
    const env = LAB_HALL_ENVIRONMENTS.find(e => e.id === id);
    return env && (env.category === 'simulation' || env.title.includes('仿真'));
  });

  const isGradingSupported = hasJupyterEnv || hasSimulationEnv;

  // 点击外部关闭实验环境下拉面板
  useEffect(() => {
    const handleOutsideLabEnv = (e: MouseEvent) => {
      if (labEnvDropdownRef.current && !labEnvDropdownRef.current.contains(e.target as Node)) {
        setIsLabEnvDropdownOpen(false);
      }
    };
    if (isLabEnvDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideLabEnv);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideLabEnv);
    };
  }, [isLabEnvDropdownOpen]);

  // -------------------------------------------------------------
  // 技能点穿梭框状态与 AI 智能关联
  // -------------------------------------------------------------
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    task.skillIds || ['s-001', 's-002']
  );
  const [leftCheckedSkillIds, setLeftCheckedSkillIds] = useState<string[]>([]);
  const [rightCheckedSkillIds, setRightCheckedSkillIds] = useState<string[]>([]);
  const [skillSearchKeyword, setSkillSearchKeyword] = useState('');
  const [leftExpandedCatIds, setLeftExpandedCatIds] = useState<string[]>(
    skillCategories.map(c => c.id)
  );
  const [rightExpandedCatIds, setRightExpandedCatIds] = useState<string[]>(
    skillCategories.map(c => c.id)
  );
  const [isAiAssociating, setIsAiAssociating] = useState(false);
  const [modalToast, setModalToast] = useState<string | null>(null);

  const showModalToast = (msg: string) => {
    setModalToast(msg);
    setTimeout(() => setModalToast(null), 2800);
  };

  // 左侧过滤技能树
  const filteredSkillCategories = skillCategories.map(cat => {
    const isCatMatch = cat.name.toLowerCase().includes(skillSearchKeyword.toLowerCase()) || 
                       cat.code.toLowerCase().includes(skillSearchKeyword.toLowerCase());
    const matchedSkills = isCatMatch 
      ? cat.skills 
      : cat.skills.filter(s => 
          s.name.toLowerCase().includes(skillSearchKeyword.toLowerCase()) || 
          s.code.includes(skillSearchKeyword)
        );
    return {
      ...cat,
      matchedSkills
    };
  }).filter(cat => cat.matchedSkills.length > 0);

  // 右侧已关联技能树（保持树形层级展示）
  const associatedSkillCategories = skillCategories.map(cat => ({
    ...cat,
    skills: cat.skills.filter(s => selectedSkillIds.includes(s.id))
  })).filter(cat => cat.skills.length > 0);

  // 一键 AI 智能关联核心逻辑
  const handleAiAutoAssociate = () => {
    setIsAiAssociating(true);
    setTimeout(() => {
      setIsAiAssociating(false);
      const titleLower = (taskTitle || currentTask.title).toLowerCase();
      const matchedIds: string[] = [];

      // 关键词语义规则库
      if (titleLower.includes('神经网络') || titleLower.includes('结构') || titleLower.includes('基础') || titleLower.includes('神经')) {
        matchedIds.push('s-001');
      }
      if (titleLower.includes('激活') || titleLower.includes('relu') || titleLower.includes('sigmoid')) {
        matchedIds.push('s-002');
      }
      if (titleLower.includes('损失') || titleLower.includes('loss') || titleLower.includes('代价') || titleLower.includes('误差')) {
        matchedIds.push('s-003');
      }
      if (titleLower.includes('优化') || titleLower.includes('sgd') || titleLower.includes('adam') || titleLower.includes('梯度') || titleLower.includes('学习率')) {
        matchedIds.push('s-004');
      }
      if (titleLower.includes('反向传播') || titleLower.includes('bp') || titleLower.includes('导数') || titleLower.includes('链式')) {
        matchedIds.push('s-005');
      }
      if (titleLower.includes('张量') || titleLower.includes('tensor') || titleLower.includes('矩阵') || titleLower.includes('维度')) {
        matchedIds.push('s-006');
      }
      if (titleLower.includes('计算图') || titleLower.includes('图') || titleLower.includes('graph')) {
        matchedIds.push('s-007');
      }
      if (titleLower.includes('训练') || titleLower.includes('拟合') || titleLower.includes('模型') || titleLower.includes('实验')) {
        matchedIds.push('s-008');
      }
      if (titleLower.includes('数据') || titleLower.includes('管线') || titleLower.includes('dataset') || titleLower.includes('dataloader')) {
        matchedIds.push('s-009');
      }
      if (titleLower.includes('保存') || titleLower.includes('加载') || titleLower.includes('checkpoint') || titleLower.includes('导出')) {
        matchedIds.push('s-010');
      }
      if (titleLower.includes('卷积') || titleLower.includes('cnn') || titleLower.includes('卷积核') || titleLower.includes('特征图')) {
        matchedIds.push('s-011');
      }
      if (titleLower.includes('池化') || titleLower.includes('pooling') || titleLower.includes('下采样') || titleLower.includes('步长')) {
        matchedIds.push('s-012');
      }
      if (titleLower.includes('resnet') || titleLower.includes('lenet') || titleLower.includes('vgg') || titleLower.includes('架构') || titleLower.includes('经典')) {
        matchedIds.push('s-013');
      }
      if (titleLower.includes('迁移') || titleLower.includes('微调') || titleLower.includes('fine-tune') || titleLower.includes('预训练')) {
        matchedIds.push('s-014');
      }
      if (titleLower.includes('transformer') || titleLower.includes('注意力') || titleLower.includes('attention') || titleLower.includes('大模型')) {
        matchedIds.push('s-015');
      }

      // 未命中具体规则时根据步骤类型给出典型推荐
      let finalNewIds = matchedIds;
      if (finalNewIds.length === 0) {
        if (currentType === 'experiment') {
          finalNewIds = ['s-006', 's-008', 's-011'];
        } else if (currentType === 'exercise') {
          finalNewIds = ['s-001', 's-003', 's-004'];
        } else {
          finalNewIds = ['s-001', 's-002', 's-006'];
        }
      }

      const merged = Array.from(new Set([...selectedSkillIds, ...finalNewIds]));
      setSelectedSkillIds(merged);
      setLeftCheckedSkillIds([]);
      showModalToast(`AI 智能分析完毕：已精准匹配并关联 ${finalNewIds.length} 个核心技能点！`);
    }, 600);
  };

  // 穿梭操作：左 -> 右
  const handleMoveRight = () => {
    const validToAdd = leftCheckedSkillIds.filter(id => !selectedSkillIds.includes(id));
    if (validToAdd.length === 0) {
      showModalToast('所选技能点已在右侧或未勾选有效项');
      return;
    }
    setSelectedSkillIds(prev => Array.from(new Set([...prev, ...validToAdd])));
    setLeftCheckedSkillIds([]);
    showModalToast(`成功关联 ${validToAdd.length} 个技能点到当前步骤`);
  };

  // 穿梭操作：右 -> 左（移除）
  const handleMoveLeft = () => {
    if (rightCheckedSkillIds.length === 0) {
      showModalToast('请先勾选右侧需要解除关联的技能点');
      return;
    }
    setSelectedSkillIds(prev => prev.filter(id => !rightCheckedSkillIds.includes(id)));
    setRightCheckedSkillIds([]);
    showModalToast('已解除选中技能点的关联');
  };

  // 全部穿梭关联到右侧
  const handleMoveAllRight = () => {
    const allMatchingSkillIds = filteredSkillCategories
      .flatMap(c => c.matchedSkills)
      .map(s => s.id);
    const merged = Array.from(new Set([...selectedSkillIds, ...allMatchingSkillIds]));
    setSelectedSkillIds(merged);
    setLeftCheckedSkillIds([]);
    showModalToast(`已将搜索匹配的全部技能点关联到当前步骤`);
  };

  // 全部清空关联
  const handleClearAllRight = () => {
    if (selectedSkillIds.length === 0) return;
    setSelectedSkillIds([]);
    setRightCheckedSkillIds([]);
    showModalToast('已清空所有关联的技能点');
  };

  // 单个快捷关联
  const handleAddSingleSkill = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) return;
    setSelectedSkillIds(prev => [...prev, skillId]);
    setLeftCheckedSkillIds(prev => prev.filter(id => id !== skillId));
  };

  // 单个快捷移除
  const handleRemoveSingleSkill = (skillId: string) => {
    setSelectedSkillIds(prev => prev.filter(id => id !== skillId));
    setRightCheckedSkillIds(prev => prev.filter(id => id !== skillId));
  };

  // 切换左侧某个分类下的全部勾选
  const handleToggleCategoryCheckLeft = (cat: { id: string; matchedSkills: SkillItem[] }) => {
    const skillIdsInCat = cat.matchedSkills.map(s => s.id);
    const allChecked = skillIdsInCat.every(id => leftCheckedSkillIds.includes(id));
    if (allChecked) {
      setLeftCheckedSkillIds(prev => prev.filter(id => !skillIdsInCat.includes(id)));
    } else {
      setLeftCheckedSkillIds(prev => Array.from(new Set([...prev, ...skillIdsInCat])));
    }
  };

  // 切换右侧某个分类下的全部勾选
  const handleToggleCategoryCheckRight = (cat: { id: string; skills: SkillItem[] }) => {
    const skillIdsInCat = cat.skills.map(s => s.id);
    const allChecked = skillIdsInCat.every(id => rightCheckedSkillIds.includes(id));
    if (allChecked) {
      setRightCheckedSkillIds(prev => prev.filter(id => !skillIdsInCat.includes(id)));
    } else {
      setRightCheckedSkillIds(prev => Array.from(new Set([...prev, ...skillIdsInCat])));
    }
  };

  // -------------------------------------------------------------
  // 习题设置：习题列表、关联技能点与 AI 批量关联
  // -------------------------------------------------------------
  interface QuestionItem {
    id: number;
    title: string;
    type: string;
    category: string;
    score: number;
    skillIds?: string[];
  }

  const [questions, setQuestions] = useState<QuestionItem[]>([
    { 
      id: 1, 
      title: "关于 plt.scatter(hours, score, c=attend, cmap='Blues') 与 plt.colorbar() 的说法，正确的是（ ）。", 
      type: '多选题', 
      category: '编程基础', 
      score: 2,
      skillIds: ['s-001', 's-006']
    },
    { 
      id: 2, 
      title: "下列属于 plt.scatter() 常用参数的有（ ）。", 
      type: '多选题', 
      category: '编程基础', 
      score: 2,
      skillIds: ['s-006']
    },
    { 
      id: 3, 
      title: "下列属于虚拟仿真环境支持的操作功能的有（ ）。", 
      type: '多选题', 
      category: '仿真', 
      score: 4,
      skillIds: ['s-007', 's-008']
    },
    { 
      id: 4, 
      title: "在智慧家居项目的应用设计中，2D应用界面需实现的功能包括（ ）。", 
      type: '多选题', 
      category: '设计', 
      score: 4,
      skillIds: ['s-010']
    },
  ]);

  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [requireAllAnswered, setRequireAllAnswered] = useState(true);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  // 单题关联技能点下拉树浮层状态
  const [activeQuestionDropdownId, setActiveQuestionDropdownId] = useState<number | null>(null);
  const [questionSkillSearchText, setQuestionSkillSearchText] = useState('');
  const [isTreeRootExpanded, setIsTreeRootExpanded] = useState(true);
  const [qDropdownExpandedCatIds, setQDropdownExpandedCatIds] = useState<string[]>(
    skillCategories.map(c => c.id)
  );
  const [isAiBatchAssociating, setIsAiBatchAssociating] = useState(false);
  const questionDropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部收起题目关联技能点下拉树
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (questionDropdownRef.current && !questionDropdownRef.current.contains(e.target as Node)) {
        setActiveQuestionDropdownId(null);
      }
    };
    if (activeQuestionDropdownId !== null) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activeQuestionDropdownId]);

  // 获取技能点名称辅助函数
  const getSkillNameById = (skillId: string) => {
    for (const cat of skillCategories) {
      const s = cat.skills.find(item => item.id === skillId);
      if (s) return s.name;
    }
    return skillId;
  };

  // AI一键批量关联选中的习题
  const handleAiBatchAssociateQuestions = () => {
    const targetQuestionIds = selectedQuestions.length > 0 
      ? selectedQuestions 
      : filteredQuestions.map(q => q.id);

    if (targetQuestionIds.length === 0) {
      showModalToast('当前暂无可关联的习题');
      return;
    }

    setIsAiBatchAssociating(true);
    setTimeout(() => {
      setIsAiBatchAssociating(false);
      setQuestions(prev => prev.map(q => {
        if (!targetQuestionIds.includes(q.id)) return q;
        
        const titleLower = q.title.toLowerCase();
        const matched: string[] = [];
        if (titleLower.includes('plt') || titleLower.includes('scatter') || titleLower.includes('colorbar') || titleLower.includes('图')) {
          matched.push('s-006', 's-001');
        }
        if (titleLower.includes('仿真') || titleLower.includes('虚拟') || titleLower.includes('环境')) {
          matched.push('s-007', 's-008');
        }
        if (titleLower.includes('智慧') || titleLower.includes('设计') || titleLower.includes('界面') || titleLower.includes('应用')) {
          matched.push('s-010', 's-009');
        }
        if (titleLower.includes('模型') || titleLower.includes('训练') || titleLower.includes('算法')) {
          matched.push('s-004', 's-005');
        }
        if (matched.length === 0) {
          matched.push('s-001', 's-002');
        }

        const merged = Array.from(new Set([...(q.skillIds || []), ...matched]));
        return {
          ...q,
          skillIds: merged
        };
      }));

      showModalToast(`AI 智能关联完成：已为 ${targetQuestionIds.length} 道习题自动匹配专业技能点！`);
    }, 650);
  };

  // 单题关联技能点：勾选/反选单个技能点
  const handleToggleQuestionSkill = (questionId: number, skillId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      const currentSkills = q.skillIds || [];
      const isExist = currentSkills.includes(skillId);
      return {
        ...q,
        skillIds: isExist ? currentSkills.filter(id => id !== skillId) : [...currentSkills, skillId]
      };
    }));
  };

  // 单题关联技能点：勾选/反选分类下所有技能点
  const handleToggleQuestionCategory = (questionId: number, catSkills: SkillItem[]) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      const currentSkills = q.skillIds || [];
      const catSkillIds = catSkills.map(s => s.id);
      const isAllChecked = catSkillIds.every(id => currentSkills.includes(id));
      return {
        ...q,
        skillIds: isAllChecked 
          ? currentSkills.filter(id => !catSkillIds.includes(id)) 
          : Array.from(new Set([...currentSkills, ...catSkillIds]))
      };
    }));
  };

  // 单题关联技能点：勾选/反选顶级（全技能点）
  const handleToggleQuestionRoot = (questionId: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      const currentSkills = q.skillIds || [];
      const allSkillIds = skillCategories.flatMap(c => c.skills).map(s => s.id);
      const isAllChecked = allSkillIds.every(id => currentSkills.includes(id));
      return {
        ...q,
        skillIds: isAllChecked ? [] : allSkillIds
      };
    }));
  };

  const filteredQuestions = questions.filter(q => {
    if (searchTitle && !q.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;
    if (searchType && q.type !== searchType) return false;
    if (searchCategory && q.category !== searchCategory) return false;
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleSelectQuestion = (id: number) => {
    setSelectedQuestions(prev => prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]);
  };

  const handleBatchDelete = () => {
    setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
    setSelectedQuestions([]);
  };

  const renderDocumentEditor = () => (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full">
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center space-x-6 shrink-0">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="teacher_doc_content_type" className="text-[#1890ff] focus:ring-[#1890ff]" defaultChecked />
            <span className="text-[#1890ff] text-sm font-medium">在线编辑</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="teacher_doc_content_type" className="text-[#1890ff] focus:ring-[#1890ff]" />
            <span className="text-slate-600 text-sm">上传文档</span>
          </label>
        </div>
        
        <div className="flex-1 border border-slate-200 rounded flex flex-col min-h-0">
          {/* Editor Toolbar */}
          <div className="h-12 border-b border-slate-200 flex items-center px-4 space-x-2 text-slate-500 shrink-0 bg-slate-50">
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Bold className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Underline className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Italic className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Strikethrough className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-slate-300 mx-2"></div>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Heading className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-slate-300 mx-2"></div>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><List className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><ListOrdered className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-slate-300 mx-2"></div>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Code className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Image className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Link2 className="w-4 h-4" /></button>
            <div className="flex-1"></div>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Undo className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Redo className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-slate-300 mx-2"></div>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Eye className="w-4 h-4" /></button>
          </div>
          
          {/* Split Editor Area */}
          <div className="flex-1 flex divide-x divide-slate-200 bg-white">
            <div className="flex-1 p-6 text-slate-400 text-sm focus:outline-none" contentEditable suppressContentEditableWarning>请输入步骤教学正文、实验要求或操作说明...</div>
            <div className="flex-1 p-6 bg-slate-50/50"></div>
          </div>
          
          {/* Editor Footer */}
          <div className="h-8 border-t border-slate-200 flex items-center justify-between px-4 text-xs text-slate-500 bg-slate-50 shrink-0">
            <span>字数：0</span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <span>同步滚动</span>
              <input type="checkbox" className="rounded-sm border-slate-300 text-slate-500 focus:ring-0 w-3 h-3" defaultChecked />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-[88vw] max-w-7xl h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden select-none border border-slate-200"
      >
        {/* Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 bg-slate-50/80">
          <div className="flex items-center">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="mr-4 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              title={showSidebar ? "隐藏左侧目录" : "展开左侧目录"}
            >
              <List className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 flex items-center">
              编辑教学步骤
              <span className="ml-2.5 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                教师自建
              </span>
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar Tree */}
          <AnimatePresence initial={false}>
            {showSidebar && (
              <motion.div
                ref={sidebarRef}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: sidebarWidth, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: isResizing ? 0 : 0.2 }}
                className="border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden shrink-0 relative"
              >
                <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0 flex flex-col gap-3">
                  <h4 className="font-bold text-slate-700 flex items-center text-sm truncate">
                    <Book className="w-4 h-4 mr-2 text-[#1890ff] shrink-0" />
                    <span className="truncate">{courseName || '未命名课程'}</span>
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-[#1890ff]">
                    <button onClick={expandAll} className="hover:text-blue-700 font-medium cursor-pointer">全部展开</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={collapseAll} className="hover:text-blue-700 font-medium cursor-pointer">全部收起</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {chapters.map(chapter => {
                    const isExpanded = expandedChapters.includes(chapter.id);
                    return (
                      <div key={chapter.id}>
                        <div 
                          className="flex items-center text-sm font-bold text-slate-700 mb-2 px-2 cursor-pointer select-none hover:text-[#1890ff] transition-colors group"
                          onClick={() => toggleChapter(chapter.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0 group-hover:text-[#1890ff]" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0 group-hover:text-[#1890ff]" />
                          )}
                          <span className="truncate">{chapter.title}</span>
                        </div>
                        {isExpanded && (
                          <div className="space-y-1">
                            {chapter.tasks.map(t => (
                              <button
                                key={t.id}
                                onClick={() => setCurrentTask({ ...t, chapterName: chapter.title })}
                                className={`w-full flex items-center px-3 py-2 text-left text-sm rounded-lg transition-colors group cursor-pointer ${
                                  currentTask.id === t.id 
                                    ? 'bg-blue-100 font-medium text-[#1890ff]' 
                                    : 'text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <div className="flex items-center min-w-0 flex-1 w-full">
                                  {t.type && typeConfig[t.type] && (
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border mr-2 shrink-0 ${typeConfig[t.type].color}`}>
                                      {typeConfig[t.type].label}
                                    </span>
                                  )}
                                  <span className="truncate flex-1">{t.title}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Resizer Handle */}
                <div 
                  onMouseDown={startResizing}
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#1890ff]/50 active:bg-[#1890ff] transition-colors z-10"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Editor Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Top Info Section */}
            <div className="p-6 border-b border-slate-200 bg-white shrink-0">
              <div className="mb-4 text-xs text-slate-500 flex items-center">
                <Box className="w-4 h-4 mr-1.5 text-slate-400" />
                {courseName || '自建课程'} <ChevronRight className="w-3.5 h-3.5 mx-1" /> {currentTask.chapterName || '教学章节'}
              </div>
              <div className="grid grid-cols-2 gap-6 max-w-4xl">
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span> 步骤名称
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890ff]/20 focus:border-[#1890ff] text-xs bg-slate-50 hover:bg-white transition-colors"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">{taskTitle.length} / 50</span>
                  </div>
                </div>
                
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span> 步骤类型
                  </label>
                  <div className="relative">
                    <select 
                      value={currentType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setCurrentType(newType);
                        setCurrentTask(prev => ({ ...prev, type: newType }));
                        setActiveTab(`${newType}_settings`);
                      }}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890ff]/20 focus:border-[#1890ff] text-xs appearance-none bg-slate-50 hover:bg-white transition-colors cursor-pointer"
                    >
                      <option value="text">图文</option>
                      <option value="video">视频</option>
                      <option value="exercise">习题</option>
                      <option value="experiment">实验</option>
                      <option value="report">报告</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs & Content */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
              <div className="flex px-6 border-b border-slate-200 pt-3 bg-white shrink-0 items-center overflow-hidden relative">
                <div className="flex space-x-6 flex-1 overflow-x-auto hide-scrollbar">
                  {currentType === 'exercise' && (
                    <button
                      onClick={() => setActiveTab('exercise_settings')}
                      className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'exercise_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>习题设置</span>
                    </button>
                  )}
                  {currentType === 'experiment' && (
                    <button
                      onClick={() => setActiveTab('experiment_settings')}
                      className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'experiment_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>实验设置</span>
                    </button>
                  )}
                  {currentType === 'video' && (
                    <button
                      onClick={() => setActiveTab('video_settings')}
                      className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'video_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>视频设置</span>
                    </button>
                  )}
                  {currentType === 'text' && (
                    <button
                      onClick={() => setActiveTab('text_settings')}
                      className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'text_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>图文设置</span>
                    </button>
                  )}
                  {currentType === 'report' && (
                    <button
                      onClick={() => setActiveTab('report_settings')}
                      className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'report_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>报告设置</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'description' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    步骤说明 <span className="text-[11px] text-slate-400 font-normal ml-1">(选填)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('instruction_config')}
                    className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'instruction_config' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    指令配置 <span className="text-[11px] text-slate-400 font-normal ml-1">(选填)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('skill_config')}
                    className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'skill_config' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    技能点配置 <span className="text-[11px] text-slate-400 font-normal ml-1">(选填)</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'description' && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 flex flex-col h-full"
                    >
                      <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex-1 flex flex-col overflow-hidden">
                        <div className="h-10 border-b border-slate-200 flex items-center px-4 space-x-2 text-slate-500 shrink-0 bg-slate-50">
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Bold className="w-3.5 h-3.5" /></button>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Underline className="w-3.5 h-3.5" /></button>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Italic className="w-3.5 h-3.5" /></button>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Strikethrough className="w-3.5 h-3.5" /></button>
                          <div className="w-px h-4 bg-slate-300 mx-1.5"></div>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Heading className="w-3.5 h-3.5" /></button>
                          <div className="w-px h-4 bg-slate-300 mx-1.5"></div>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><List className="w-3.5 h-3.5" /></button>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><ListOrdered className="w-3.5 h-3.5" /></button>
                          <div className="w-px h-4 bg-slate-300 mx-1.5"></div>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Code className="w-3.5 h-3.5" /></button>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Image className="w-3.5 h-3.5" /></button>
                          <div className="flex-1"></div>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Undo className="w-3.5 h-3.5" /></button>
                          <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Redo className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="flex-1 p-5 text-slate-400 bg-white focus:outline-none text-xs" contentEditable suppressContentEditableWarning>
                          请输入教师备课步骤说明、重点提示与学生学习要求...
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'instruction_config' && (
                    <motion.div
                      key="instruction_config"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs min-h-[350px] flex flex-col items-center justify-center h-full"
                    >
                      <div className="text-center">
                        <div className="w-14 h-14 bg-blue-50 text-[#1890ff] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
                          <Cpu className="w-7 h-7" />
                        </div>
                        <h4 className="text-slate-800 font-bold mb-1.5 text-base">配置 AI 技能助手教学指令</h4>
                        <p className="text-slate-400 text-xs mb-6 max-w-md mx-auto">
                          您可以为自建课程的当前步骤配置专属的 AI 助教指令，指导学生完成代码编写、答疑与实验排错。
                        </p>
                        <button className="px-5 py-2 bg-[#1890ff] text-white rounded-lg text-xs hover:bg-blue-600 shadow-sm transition-colors font-medium cursor-pointer">
                          添加助教指令
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'skill_config' && (
                    <motion.div
                      key="skill_config"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col h-full min-h-[500px]"
                    >
                      {/* 顶部说明与快捷统计栏 */}
                      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 shrink-0">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 flex items-center">
                            <Target className="w-4 h-4 mr-1.5 text-blue-600" />
                            教学步骤技能点关联配置
                            <span className="ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              左右穿梭关联
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            为当前教学步骤《{taskTitle || currentTask.title}》关联对应的课程专业技能点，学生完成该步骤将点亮掌握度
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-slate-500">
                            已关联技能点：
                            <strong className="text-blue-600 font-bold ml-1 text-sm">{selectedSkillIds.length}</strong> 个
                          </span>
                        </div>
                      </div>

                      {/* 穿梭框主体区域（左面板 - 中间控制柱 - 右面板） */}
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_64px_1fr] gap-3 min-h-0">
                        
                        {/* ================= 左侧：课程所有技能点树 ================= */}
                        <div className="border border-slate-200 rounded-xl bg-slate-50/40 flex flex-col min-h-0 overflow-hidden shadow-2xs">
                          {/* 左侧头部 */}
                          <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-800 flex items-center">
                                <GitBranch className="w-3.5 h-3.5 mr-1 text-slate-500" />
                                课程技能点树
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-600 text-[10px] font-semibold">
                                共 {filteredSkillCategories.reduce((acc, cur) => acc + cur.matchedSkills.length, 0)} 项
                              </span>
                            </div>

                            {/* 一键 AI 智能关联按钮 */}
                            <button
                              type="button"
                              onClick={handleAiAutoAssociate}
                              disabled={isAiAssociating}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-95 text-white text-[11px] font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-70 group"
                              title="根据当前步骤标题与内容，由 AI 自动推断并关联推荐技能点"
                            >
                              <Sparkles className={`w-3 h-3 text-amber-300 ${isAiAssociating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                              <span>{isAiAssociating ? 'AI分析中...' : '一键AI智能关联'}</span>
                            </button>
                          </div>

                          {/* 左侧搜索与全选工具栏 */}
                          <div className="p-2.5 bg-white border-b border-slate-100 space-y-2 shrink-0">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={skillSearchKeyword}
                                onChange={(e) => setSkillSearchKeyword(e.target.value)}
                                placeholder="搜索分类或技能点关键字..."
                                className="w-full pl-8 pr-7 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                              />
                              {skillSearchKeyword && (
                                <button
                                  type="button"
                                  onClick={() => setSkillSearchKeyword('')}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setLeftExpandedCatIds(filteredSkillCategories.map(c => c.id))}
                                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                                >
                                  全部展开
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => setLeftExpandedCatIds([])}
                                  className="text-slate-500 hover:text-slate-700 cursor-pointer"
                                >
                                  全部收起
                                </button>
                              </div>
                              <span className="text-slate-400">
                                已勾选待穿梭: <strong className="text-blue-600">{leftCheckedSkillIds.length}</strong>
                              </span>
                            </div>
                          </div>

                          {/* 左侧技能点树形滚动列表 */}
                          <div className="flex-1 overflow-y-auto p-2 space-y-2.5 bg-white">
                            {filteredSkillCategories.length === 0 ? (
                              <div className="py-12 text-center text-slate-400 text-xs">
                                <Search className="w-7 h-7 mx-auto mb-2 opacity-30" />
                                未找到包含「{skillSearchKeyword}」的技能点
                              </div>
                            ) : (
                              filteredSkillCategories.map(cat => {
                                const isExpanded = leftExpandedCatIds.includes(cat.id);
                                const skills = cat.matchedSkills;
                                const checkedCount = skills.filter(s => leftCheckedSkillIds.includes(s.id)).length;
                                const isAllCatChecked = skills.length > 0 && checkedCount === skills.length;
                                const isSomeCatChecked = checkedCount > 0 && checkedCount < skills.length;

                                return (
                                  <div key={cat.id} className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50">
                                    {/* 分类标题行 */}
                                    <div className="px-2.5 py-1.5 flex items-center justify-between bg-slate-100/70 hover:bg-slate-100 transition-colors">
                                      <div className="flex items-center space-x-1.5 min-w-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setLeftExpandedCatIds(prev =>
                                              prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                            );
                                          }}
                                          className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                                        >
                                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                        </button>
                                        
                                        <input
                                          type="checkbox"
                                          checked={isAllCatChecked}
                                          ref={el => {
                                            if (el) el.indeterminate = isSomeCatChecked;
                                          }}
                                          onChange={() => handleToggleCategoryCheckLeft(cat)}
                                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                          title="勾选/取消此分类下所有匹配项"
                                        />

                                        <span className="text-xs font-bold text-slate-700 truncate flex items-center">
                                          <span className="w-4 h-4 rounded bg-blue-100 text-blue-700 text-[10px] font-bold inline-flex items-center justify-center mr-1">
                                            {cat.code}
                                          </span>
                                          {cat.name}
                                        </span>
                                      </div>

                                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                                        {skills.length} 项
                                      </span>
                                    </div>

                                    {/* 分类下的技能点项 */}
                                    {isExpanded && (
                                      <div className="p-1 space-y-1 bg-white">
                                        {skills.map(s => {
                                          const isAlreadySelected = selectedSkillIds.includes(s.id);
                                          const isChecked = leftCheckedSkillIds.includes(s.id);

                                          return (
                                            <div
                                              key={s.id}
                                              onClick={() => {
                                                if (isAlreadySelected) return;
                                                setLeftCheckedSkillIds(prev =>
                                                  prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]
                                                );
                                              }}
                                              className={`px-2 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors group cursor-pointer ${
                                                isAlreadySelected
                                                  ? 'bg-slate-50 text-slate-400 opacity-60 cursor-default'
                                                  : isChecked
                                                  ? 'bg-blue-50/70 border border-blue-200 text-blue-900'
                                                  : 'hover:bg-slate-50 border border-transparent text-slate-700'
                                              }`}
                                            >
                                              <div className="flex items-center space-x-2 min-w-0">
                                                <input
                                                  type="checkbox"
                                                  checked={isChecked || isAlreadySelected}
                                                  disabled={isAlreadySelected}
                                                  onChange={() => {}} // 由外层 div 控制
                                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                                                />
                                                <span className="text-[10px] font-mono px-1 py-0.2 bg-slate-100 text-slate-500 rounded">
                                                  {s.code}
                                                </span>
                                                <span className={`truncate ${isChecked ? 'font-semibold' : ''}`}>
                                                  {s.name}
                                                </span>
                                              </div>

                                              {/* 状态徽章或快捷添加按钮 */}
                                              <div className="shrink-0 ml-2">
                                                {isAlreadySelected ? (
                                                  <span className="text-[10px] text-emerald-600 font-medium flex items-center bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                                                    <Check className="w-2.5 h-2.5 mr-0.5" /> 已关联
                                                  </span>
                                                ) : (
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleAddSingleSkill(s.id);
                                                      showModalToast(`已关联《${s.name}》`);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-100 rounded text-blue-600 transition-opacity"
                                                    title="直接添加此技能点"
                                                  >
                                                    <Plus className="w-3 h-3 stroke-[2.5]" />
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* ================= 中间：穿梭操作控制柱 ================= */}
                        <div className="flex lg:flex-col items-center justify-center gap-2 py-2 shrink-0">
                          {/* 穿梭到右侧 > */}
                          <button
                            type="button"
                            onClick={handleMoveRight}
                            disabled={leftCheckedSkillIds.length === 0}
                            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer group"
                            title="将左侧勾选技能点穿梭到右侧"
                          >
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>

                          {/* 移回左侧 < */}
                          <button
                            type="button"
                            onClick={handleMoveLeft}
                            disabled={rightCheckedSkillIds.length === 0}
                            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 hover:text-amber-600 flex items-center justify-center transition-all shadow-2xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer group"
                            title="解除右侧勾选技能点的关联"
                          >
                            <ChevronDown className="w-4 h-4 lg:hidden group-hover:translate-y-0.5 transition-transform" />
                            <ChevronRight className="w-4 h-4 hidden lg:block rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                          </button>

                          <div className="w-6 h-px lg:w-px lg:h-6 bg-slate-200 my-1"></div>

                          {/* 全部穿梭 >> */}
                          <button
                            type="button"
                            onClick={handleMoveAllRight}
                            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer group"
                            title="将左侧全部技能点加入右侧"
                          >
                            <ChevronsRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>

                          {/* 全部清空 << */}
                          <button
                            type="button"
                            onClick={handleClearAllRight}
                            disabled={selectedSkillIds.length === 0}
                            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 text-slate-700 hover:text-red-500 flex items-center justify-center transition-all shadow-2xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer group"
                            title="全部清空右侧已关联技能点"
                          >
                            <ChevronsLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        {/* ================= 右侧：选中的技能点树 ================= */}
                        <div className="border border-slate-200 rounded-xl bg-slate-50/40 flex flex-col min-h-0 overflow-hidden shadow-2xs">
                          {/* 右侧头部 */}
                          <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-800 flex items-center">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                已选技能点树
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                                已选 {selectedSkillIds.length} 项
                              </span>
                            </div>

                            {selectedSkillIds.length > 0 && (
                              <button
                                type="button"
                                onClick={handleClearAllRight}
                                className="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              >
                                一键清空
                              </button>
                            )}
                          </div>

                          {/* 右侧工具栏 */}
                          <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                            <span>所属知识结构分类：{associatedSkillCategories.length} 个</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setRightExpandedCatIds(skillCategories.map(c => c.id))}
                                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                              >
                                全部展开
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                type="button"
                                onClick={() => setRightExpandedCatIds([])}
                                className="text-slate-500 hover:text-slate-700 cursor-pointer"
                              >
                                全部收起
                              </button>
                            </div>
                          </div>

                          {/* 右侧已选技能点树形滚动列表 */}
                          <div className="flex-1 overflow-y-auto p-2 space-y-2.5 bg-white">
                            {associatedSkillCategories.length === 0 ? (
                              <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-full">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                                  <Layers className="w-6 h-6 opacity-60" />
                                </div>
                                <p className="text-slate-600 font-semibold mb-1">当前步骤暂未关联任何技能点</p>
                                <p className="text-[11px] text-slate-400 mb-3 max-w-[220px]">
                                  可从左侧挑选技能点勾选穿梭，或点击上方【一键AI智能关联】
                                </p>
                                <button
                                  type="button"
                                  onClick={handleAiAutoAssociate}
                                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                  <span>使用 AI 智能关联</span>
                                </button>
                              </div>
                            ) : (
                              associatedSkillCategories.map(cat => {
                                const isExpanded = rightExpandedCatIds.includes(cat.id);
                                const checkedCount = cat.skills.filter(s => rightCheckedSkillIds.includes(s.id)).length;
                                const isAllCatChecked = cat.skills.length > 0 && checkedCount === cat.skills.length;
                                const isSomeCatChecked = checkedCount > 0 && checkedCount < cat.skills.length;

                                return (
                                  <div key={cat.id} className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50">
                                    {/* 分类标题行 */}
                                    <div className="px-2.5 py-1.5 flex items-center justify-between bg-slate-100/70 hover:bg-slate-100 transition-colors">
                                      <div className="flex items-center space-x-1.5 min-w-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setRightExpandedCatIds(prev =>
                                              prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                            );
                                          }}
                                          className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                                        >
                                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                        </button>

                                        <input
                                          type="checkbox"
                                          checked={isAllCatChecked}
                                          ref={el => {
                                            if (el) el.indeterminate = isSomeCatChecked;
                                          }}
                                          onChange={() => handleToggleCategoryCheckRight(cat)}
                                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                          title="勾选/取消勾选分类下所有已选技能点"
                                        />

                                        <span className="text-xs font-bold text-slate-700 truncate flex items-center">
                                          <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold inline-flex items-center justify-center mr-1">
                                            {cat.code}
                                          </span>
                                          {cat.name}
                                        </span>
                                      </div>

                                      <span className="text-[10px] text-emerald-600 font-bold shrink-0 ml-1">
                                        已关联 {cat.skills.length} 项
                                      </span>
                                    </div>

                                    {/* 分类下的已选技能点项 */}
                                    {isExpanded && (
                                      <div className="p-1 space-y-1 bg-white">
                                        {cat.skills.map(s => {
                                          const isChecked = rightCheckedSkillIds.includes(s.id);
                                          return (
                                            <div
                                              key={s.id}
                                              onClick={() => {
                                                setRightCheckedSkillIds(prev =>
                                                  prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]
                                                );
                                              }}
                                              className={`px-2 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors group cursor-pointer ${
                                                isChecked
                                                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                                                  : 'hover:bg-slate-50 border border-transparent text-slate-700'
                                              }`}
                                            >
                                              <div className="flex items-center space-x-2 min-w-0">
                                                <input
                                                  type="checkbox"
                                                  checked={isChecked}
                                                  onChange={() => {}} // 由外层 div 控制
                                                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 pointer-events-none"
                                                />
                                                <span className="text-[10px] font-mono px-1 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                                                  {s.code}
                                                </span>
                                                <span className={`truncate ${isChecked ? 'font-semibold' : ''}`}>
                                                  {s.name}
                                                </span>
                                              </div>

                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRemoveSingleSkill(s.id);
                                                  showModalToast(`已解除《${s.name}》关联`);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-opacity"
                                                title="解除该技能点关联"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'exercise_settings' && currentType === 'exercise' && (
                    <motion.div
                      key="exercise_settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col h-full"
                    >
                      {/* Top Actions */}
                      <div className="flex flex-col mb-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <button className="px-3.5 py-1.5 bg-[#1890ff] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors shadow-2xs cursor-pointer">
                              新建题目
                            </button>
                            <button className="px-3.5 py-1.5 bg-white border border-[#1890ff] text-[#1890ff] rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors cursor-pointer">
                              从校本题库导入
                            </button>

                            {/* 新增：AI 一键批量关联功能 */}
                            <button 
                              type="button"
                              onClick={handleAiBatchAssociateQuestions}
                              disabled={isAiBatchAssociating}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer ${
                                selectedQuestions.length > 0
                                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-sm'
                                  : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                              }`}
                              title={selectedQuestions.length > 0 ? `使用 AI 为选中的 ${selectedQuestions.length} 道习题自动匹配关联专业技能点` : '勾选习题后使用 AI 一键批量关联'}
                            >
                              <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isAiBatchAssociating ? 'animate-spin' : ''}`} />
                              <span>{isAiBatchAssociating ? 'AI批量匹配中...' : `AI一键批量关联${selectedQuestions.length > 0 ? ` (${selectedQuestions.length})` : ''}`}</span>
                            </button>

                            {selectedQuestions.length > 0 && (
                              <button onClick={handleBatchDelete} className="px-3.5 py-1.5 bg-white border border-red-500 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors cursor-pointer">
                                批量删除 ({selectedQuestions.length})
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center text-xs bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                              <span className="text-slate-600 mr-4">总分：<span className="text-red-500 font-bold text-sm mx-1">27</span> 分</span>
                              <span className="text-slate-600">题目数：<span className="text-blue-600 font-bold text-sm mx-1">{filteredQuestions.length}</span> 题</span>
                            </div>
                            <button 
                              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)} 
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title={isFiltersExpanded ? "收起筛选" : "展开筛选"}
                            >
                              {isFiltersExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Search and Filters */}
                        <AnimatePresence>
                          {isFiltersExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs"
                            >
                              <input 
                                type="text" 
                                placeholder="按题干快速检索..." 
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1890ff] text-xs bg-white"
                              />
                              <select 
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="w-36 px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1890ff] text-xs bg-white"
                              >
                                <option value="">全部题型</option>
                                <option value="单选题">单选题</option>
                                <option value="多选题">多选题</option>
                                <option value="简答题">简答题</option>
                              </select>
                              <select 
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                                className="w-36 px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1890ff] text-xs bg-white"
                              >
                                <option value="">全部分类</option>
                                <option value="编程基础">编程基础</option>
                                <option value="仿真">仿真</option>
                                <option value="设计">设计</option>
                              </select>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Table */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col min-h-0 text-xs">
                        {/* 增加【关联技能点】列 */}
                        <div className="grid grid-cols-[40px_45px_1fr_200px_80px_80px_80px_110px] gap-2.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 shrink-0">
                          <div className="flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff]" 
                            />
                          </div>
                          <div className="text-center">序号</div>
                          <div>题目名称</div>
                          <div className="flex items-center text-blue-700">
                            <Target className="w-3.5 h-3.5 mr-1" />
                            关联技能点
                          </div>
                          <div>题目类型</div>
                          <div>知识分类</div>
                          <div>分值</div>
                          <div>操作</div>
                        </div>
                        
                        <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
                          {filteredQuestions.map((q, index) => {
                            const qSkillIds = q.skillIds || [];
                            const isDropdownOpen = activeQuestionDropdownId === q.id;

                            // 树节点过滤
                            const searchKeyword = questionSkillSearchText.toLowerCase();
                            const filteredCatsForQ = skillCategories.map(cat => {
                              const isCatMatch = cat.name.toLowerCase().includes(searchKeyword);
                              const matchedSkills = isCatMatch 
                                ? cat.skills 
                                : cat.skills.filter(s => s.name.toLowerCase().includes(searchKeyword) || s.code.includes(searchKeyword));
                              return {
                                ...cat,
                                matchedSkills
                              };
                            }).filter(cat => cat.matchedSkills.length > 0);

                            const allFilteredSkillIds = filteredCatsForQ.flatMap(c => c.matchedSkills).map(s => s.id);
                            const isAllRootChecked = allFilteredSkillIds.length > 0 && allFilteredSkillIds.every(id => qSkillIds.includes(id));
                            const isSomeRootChecked = allFilteredSkillIds.some(id => qSkillIds.includes(id)) && !isAllRootChecked;

                            return (
                              <div key={q.id} className="grid grid-cols-[40px_45px_1fr_200px_80px_80px_80px_110px] gap-2.5 px-4 py-2.5 items-center hover:bg-blue-50/30 transition-colors">
                                <div className="flex items-center justify-center">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedQuestions.includes(q.id)}
                                    onChange={() => handleSelectQuestion(q.id)}
                                    className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff]" 
                                  />
                                </div>
                                <div className="flex items-center justify-center font-medium text-slate-400">
                                  {index + 1}
                                </div>
                                <div className="text-slate-700 font-medium truncate pr-2" title={q.title}>
                                  {q.title}
                                </div>

                                {/* 关联技能点列：参考截图实现的下拉选择框与树形多选 */}
                                <div className="relative">
                                  {/* 截图样式触发器 */}
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveQuestionDropdownId(isDropdownOpen ? null : q.id);
                                      setQuestionSkillSearchText('');
                                    }}
                                    className={`min-h-[30px] px-2 py-1 bg-white border rounded-lg flex items-center justify-between cursor-pointer transition-all shadow-2xs group ${
                                      isDropdownOpen 
                                        ? 'border-blue-500 ring-2 ring-blue-100' 
                                        : 'border-slate-200 hover:border-blue-400'
                                    }`}
                                  >
                                    <div className="flex-1 truncate mr-1">
                                      {qSkillIds.length === 0 ? (
                                        <span className="text-slate-400 text-xs select-none">请选择</span>
                                      ) : (
                                        <div className="flex items-center space-x-1 truncate">
                                          <span className="inline-flex items-center px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] rounded font-medium truncate max-w-[125px]">
                                            {getSkillNameById(qSkillIds[0])}
                                          </span>
                                          {qSkillIds.length > 1 && (
                                            <span className="px-1 py-0.2 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                                              +{qSkillIds.length - 1}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1 shrink-0 text-slate-400">
                                      <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-slate-600'}`} />
                                      <Link2 className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-600" />
                                    </div>
                                  </div>

                                  {/* 截图同款下拉树选择器（加入关键字搜索） */}
                                  {isDropdownOpen && (
                                    <div 
                                      ref={questionDropdownRef}
                                      onClick={(e) => e.stopPropagation()}
                                      className="absolute top-full left-0 mt-1 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2.5 text-xs animate-fadeIn"
                                    >
                                      {/* 搜索框：在截图实现基础上新增关键字过滤 */}
                                      <div className="relative mb-2">
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input 
                                          type="text"
                                          value={questionSkillSearchText}
                                          onChange={(e) => setQuestionSkillSearchText(e.target.value)}
                                          placeholder="搜索分类或技能点关键字..."
                                          className="w-full pl-8 pr-7 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                          autoFocus
                                        />
                                        {questionSkillSearchText && (
                                          <button 
                                            type="button" 
                                            onClick={() => setQuestionSkillSearchText('')} 
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>

                                      {/* 树形列表内容（1:1 复刻截图结构与蓝绿标签） */}
                                      <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-slate-100 rounded-lg p-1.5 bg-slate-50/30 select-none">
                                        {/* 1. 顶级节点 */}
                                        <div className="flex items-center space-x-1.5 py-1 px-1 hover:bg-slate-100/60 rounded">
                                          <button
                                            type="button"
                                            onClick={() => setIsTreeRootExpanded(!isTreeRootExpanded)}
                                            className="text-slate-400 hover:text-slate-700 p-0.5"
                                          >
                                            {isTreeRootExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                          </button>
                                          <input
                                            type="checkbox"
                                            checked={isAllRootChecked}
                                            ref={el => {
                                              if (el) el.indeterminate = isSomeRootChecked;
                                            }}
                                            onChange={() => handleToggleQuestionRoot(q.id)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                          />
                                          <span className="font-bold text-slate-800">顶级</span>
                                        </div>

                                        {/* 2. 分类与技能点节点 */}
                                        {isTreeRootExpanded && (
                                          <div className="space-y-1">
                                            {filteredCatsForQ.map(cat => {
                                              const isCatExpanded = qDropdownExpandedCatIds.includes(cat.id);
                                              const catSkills = cat.matchedSkills;
                                              const checkedCount = catSkills.filter(s => qSkillIds.includes(s.id)).length;
                                              const isAllCatChecked = catSkills.length > 0 && checkedCount === catSkills.length;
                                              const isSomeCatChecked = checkedCount > 0 && checkedCount < catSkills.length;

                                              return (
                                                <div key={cat.id} className="space-y-0.5">
                                                  {/* 二级：分类节点（带蓝色 [分类] 标签） */}
                                                  <div className="flex items-center space-x-1.5 py-1 pl-4 pr-1 hover:bg-slate-100/60 rounded">
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setQDropdownExpandedCatIds(prev =>
                                                          prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                                        );
                                                      }}
                                                      className="text-slate-400 hover:text-slate-700 p-0.5"
                                                    >
                                                      {isCatExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <input
                                                      type="checkbox"
                                                      checked={isAllCatChecked}
                                                      ref={el => {
                                                        if (el) el.indeterminate = isSomeCatChecked;
                                                      }}
                                                      onChange={() => handleToggleQuestionCategory(q.id, catSkills)}
                                                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    />
                                                    <span className="font-medium text-slate-700 truncate">{cat.name}</span>
                                                    {/* 截图中的蓝色【分类】标签 */}
                                                    <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded text-[10px] font-bold shrink-0">
                                                      分类
                                                    </span>
                                                  </div>

                                                  {/* 三级：技能点节点（带绿色 [技能点] 标签） */}
                                                  {isCatExpanded && (
                                                    <div className="space-y-0.5">
                                                      {catSkills.map(skill => {
                                                        const isSkillChecked = qSkillIds.includes(skill.id);
                                                        return (
                                                          <div
                                                            key={skill.id}
                                                            onClick={() => handleToggleQuestionSkill(q.id, skill.id)}
                                                            className={`flex items-center space-x-1.5 py-1 pl-8 pr-1.5 rounded cursor-pointer transition-colors ${
                                                              isSkillChecked 
                                                                ? 'bg-blue-50/70 text-blue-900 font-medium' 
                                                                : 'hover:bg-slate-100 text-slate-600'
                                                            }`}
                                                          >
                                                            <input
                                                              type="checkbox"
                                                              checked={isSkillChecked}
                                                              onChange={() => {}} // 由外层 div 点击控制
                                                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                                                            />
                                                            <span className="truncate flex-1">{skill.name}</span>
                                                            {/* 截图中的绿色【技能点】标签 */}
                                                            <span className="px-1.5 py-0.2 bg-lime-500 text-white rounded text-[10px] font-bold shrink-0">
                                                              技能点
                                                            </span>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>

                                      {/* 下拉面板底部操作栏 */}
                                      <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500">
                                          已选 <strong className="text-blue-600">{qSkillIds.length}</strong> 项技能点
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => setActiveQuestionDropdownId(null)}
                                          className="px-3 py-1 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 shadow-2xs cursor-pointer"
                                        >
                                          完成
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="text-slate-500">{q.type}</div>
                                <div className="text-slate-500">{q.category}</div>
                                <div className="flex items-center">
                                  <div className="flex items-center border border-slate-200 rounded-md overflow-hidden w-20">
                                    <button className="px-1.5 py-0.5 bg-slate-50 text-slate-400 hover:text-[#1890ff] hover:bg-blue-50 border-r border-slate-200">
                                      <Minus className="w-2.5 h-2.5" />
                                    </button>
                                    <input type="text" defaultValue={q.score} readOnly className="w-full text-center text-xs outline-none bg-white py-0.5 font-medium text-slate-700" />
                                    <button className="px-1.5 py-0.5 bg-slate-50 text-slate-400 hover:text-[#1890ff] hover:bg-blue-50 border-l border-slate-200">
                                      <Plus className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 text-[#1890ff]">
                                  <button className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" title="编辑"><ExternalLink className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => setQuestions(prev => prev.filter(item => item.id !== q.id))} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50" title="删除"><X className="w-3.5 h-3.5" /></button>
                                  <button className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" title="上移" disabled={index === 0}><ArrowUp className={`w-3.5 h-3.5 ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`} /></button>
                                  <button className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" title="下移" disabled={index === filteredQuestions.length - 1}><ArrowDown className={`w-3.5 h-3.5 ${index === filteredQuestions.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`} /></button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'experiment_settings' && currentType === 'experiment' && (
                    <motion.div
                      key="experiment_settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col h-full text-xs overflow-y-auto space-y-6"
                    >
                      {/* 上半部分：实验资源包与实验环境配置 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                        {/* 资源包上传 */}
                        <div className="space-y-2">
                          <label className="font-semibold text-slate-700 block">
                            实验实训资源包（代码工程、Jupyter、数据集等）：
                          </label>
                          <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 border border-[#1890ff] text-[#1890ff] rounded-lg bg-white hover:bg-blue-50 transition-colors text-xs font-medium cursor-pointer shadow-2xs">
                              上传教学实验包
                            </button>
                            <span className="text-slate-400 text-[11px]">支持 .zip, .tar.gz, .ipynb 格式包</span>
                          </div>
                        </div>

                        {/* 实验环境配置（原 实验云镜像环境，已去除测试环境按钮，升级为多选下拉搜索） */}
                        <div className="space-y-2 relative" ref={labEnvDropdownRef}>
                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-slate-700 flex items-center">
                              <span>实验环境配置</span>
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400 font-normal">
                              已选择 <strong className="text-blue-600">{selectedLabEnvIds.length}</strong> 个环境
                            </span>
                          </div>

                          {/* 触发框 (Trigger) */}
                          <div
                            onClick={() => setIsLabEnvDropdownOpen(!isLabEnvDropdownOpen)}
                            className={`min-h-[38px] p-1.5 bg-white rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                              isLabEnvDropdownOpen
                                ? 'border-blue-500 ring-2 ring-blue-100 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
                              {selectedLabEnvIds.length === 0 ? (
                                <span className="text-xs text-slate-400 px-1 select-none">
                                  请选择实验环境（支持多选与关键字搜索）...
                                </span>
                              ) : (
                                selectedLabEnvIds.map(envId => {
                                  const env = LAB_HALL_ENVIRONMENTS.find(e => e.id === envId);
                                  if (!env) return null;
                                  return (
                                    <span
                                      key={envId}
                                      className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-[11px] font-medium"
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${env.typeColor}`}></span>
                                      <span className="truncate max-w-[130px]">{env.title}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedLabEnvIds(selectedLabEnvIds.filter(id => id !== envId));
                                        }}
                                        className="text-blue-400 hover:text-blue-700 p-0.5 rounded hover:bg-blue-100 ml-0.5"
                                        title="移除此环境"
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    </span>
                                  );
                                })
                              )}
                            </div>

                            <div className="flex items-center space-x-1 shrink-0 text-slate-400 pl-1 border-l border-slate-100">
                              {selectedLabEnvIds.length > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLabEnvIds([]);
                                    showModalToast('已清空所选实验环境');
                                  }}
                                  className="p-1 hover:text-red-500 hover:bg-red-50 rounded text-slate-400 transition-colors mr-0.5"
                                  title="清空全部已选"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isLabEnvDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                            </div>
                          </div>

                          {/* 下拉浮层面板 */}
                          {isLabEnvDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden animate-fadeIn">
                              {/* 搜索框与全选工具栏 */}
                              <div className="p-2.5 bg-slate-50 border-b border-slate-100 space-y-2">
                                <div className="relative">
                                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                  <input
                                    type="text"
                                    value={labEnvSearchText}
                                    onChange={(e) => setLabEnvSearchText(e.target.value)}
                                    placeholder="搜索实验大厅环境名称、类型或简介..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                  />
                                  {labEnvSearchText && (
                                    <button
                                      onClick={() => setLabEnvSearchText('')}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                                  <span>
                                    显示 {LAB_HALL_ENVIRONMENTS.filter(env =>
                                      env.title.toLowerCase().includes(labEnvSearchText.toLowerCase()) ||
                                      env.type.toLowerCase().includes(labEnvSearchText.toLowerCase()) ||
                                      env.desc.toLowerCase().includes(labEnvSearchText.toLowerCase())
                                    ).length} / 10 个实验大厅环境
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const matchingIds = LAB_HALL_ENVIRONMENTS.filter(env =>
                                          env.title.toLowerCase().includes(labEnvSearchText.toLowerCase()) ||
                                          env.type.toLowerCase().includes(labEnvSearchText.toLowerCase()) ||
                                          env.desc.toLowerCase().includes(labEnvSearchText.toLowerCase())
                                        ).map(e => e.id);
                                        setSelectedLabEnvIds(Array.from(new Set([...selectedLabEnvIds, ...matchingIds])));
                                      }}
                                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                                    >
                                      全选匹配项
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedLabEnvIds([])}
                                      className="text-slate-500 hover:text-red-600 cursor-pointer"
                                    >
                                      全部清空
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* 实验大厅全部环境列表项 */}
                              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-1">
                                {(() => {
                                  const filtered = LAB_HALL_ENVIRONMENTS.filter(env =>
                                    env.title.toLowerCase().includes(labEnvSearchText.toLowerCase()) ||
                                    env.type.toLowerCase().includes(labEnvSearchText.toLowerCase()) ||
                                    env.desc.toLowerCase().includes(labEnvSearchText.toLowerCase())
                                  );

                                  if (filtered.length === 0) {
                                    return (
                                      <div className="py-8 text-center text-slate-400 text-xs">
                                        未找到包含「{labEnvSearchText}」的相关实验环境
                                      </div>
                                    );
                                  }

                                  return filtered.map(env => {
                                    const isChecked = selectedLabEnvIds.includes(env.id);
                                    const isHighlightGrading = env.category === 'jupyter' || env.category === 'simulation' || env.title.includes('仿真') || env.title.includes('jupyter');

                                    return (
                                      <div
                                        key={env.id}
                                        onClick={() => {
                                          if (isChecked) {
                                            setSelectedLabEnvIds(selectedLabEnvIds.filter(id => id !== env.id));
                                          } else {
                                            setSelectedLabEnvIds([...selectedLabEnvIds, env.id]);
                                          }
                                        }}
                                        className={`p-2.5 rounded-lg cursor-pointer transition-colors flex items-start space-x-2.5 ${
                                          isChecked
                                            ? 'bg-blue-50/60 hover:bg-blue-50 text-blue-900'
                                            : 'hover:bg-slate-50 text-slate-700'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => {}}
                                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center space-x-2">
                                            <span className={`text-xs ${isChecked ? 'font-bold text-blue-900' : 'font-medium text-slate-800'}`}>
                                              {env.title}
                                            </span>
                                            <span className={`text-[10px] px-1.5 py-0.2 rounded text-white ${env.typeColor}`}>
                                              {env.type}
                                            </span>
                                            {isHighlightGrading && (
                                              <span className="text-[10px] px-1 py-0.2 bg-purple-100 text-purple-700 rounded font-semibold">
                                                支持智能评分
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{env.desc}</p>
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>

                              {/* 底部确认栏 */}
                              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500">
                                  已勾选 <strong className="text-blue-600">{selectedLabEnvIds.length}</strong> 项环境
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setIsLabEnvDropdownOpen(false)}
                                  className="px-3.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                                >
                                  完成选择
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 中间功能区：评分设置功能（当选择虚拟仿真和jupyter的时候支持） */}
                      {isGradingSupported ? (
                        <div className="border border-purple-200/80 rounded-xl p-4 bg-gradient-to-r from-purple-50/40 via-blue-50/30 to-indigo-50/40 space-y-4 animate-fadeIn shadow-2xs">
                          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                                <Sparkles className="w-4 h-4 text-amber-300" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-xs flex items-center">
                                  实验评分设置
                                  <span className="ml-2 px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-medium text-[10px]">
                                    {hasJupyterEnv ? 'Jupyter 代码实训' : ''}
                                    {hasJupyterEnv && hasSimulationEnv ? ' · ' : ''}
                                    {hasSimulationEnv ? '虚拟仿真运行' : ''}
                                  </span>
                                </h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  系统已检测到包含 {hasJupyterEnv ? '「Jupyter」' : ''}{hasSimulationEnv ? '「虚拟仿真」' : ''} 环境，支持开启代码自动判定、仿真参数校验与智能评分
                                </p>
                              </div>
                            </div>

                            {/* 启用自动评分开关 */}
                            <label className="flex items-center space-x-2 cursor-pointer select-none">
                              <span className="text-xs font-semibold text-slate-700">启用自动评分</span>
                              <input
                                type="checkbox"
                                checked={isAutoGradingEnabled}
                                onChange={(e) => setIsAutoGradingEnabled(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                              />
                            </label>
                          </div>

                          {isAutoGradingEnabled && (
                            <div className="space-y-4 pt-1">
                              {/* 分值与及格线配置 */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-3 rounded-lg border border-slate-200">
                                <div>
                                  <label className="text-[11px] text-slate-500 block mb-1">实验满分值</label>
                                  <div className="flex items-center space-x-1">
                                    <input
                                      type="number"
                                      value={gradingTotalScore}
                                      onChange={(e) => setGradingTotalScore(Number(e.target.value))}
                                      className="w-24 px-2 py-1 border border-slate-200 rounded text-xs text-slate-700 font-bold focus:border-purple-500 outline-none"
                                    />
                                    <span className="text-slate-400 text-xs">分</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[11px] text-slate-500 block mb-1">及格基准线</label>
                                  <div className="flex items-center space-x-1">
                                    <input
                                      type="number"
                                      value={gradingPassScore}
                                      onChange={(e) => setGradingPassScore(Number(e.target.value))}
                                      className="w-24 px-2 py-1 border border-slate-200 rounded text-xs text-slate-700 font-bold focus:border-purple-500 outline-none"
                                    />
                                    <span className="text-slate-400 text-xs">分</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[11px] text-slate-500 block mb-1">学生即时反馈</label>
                                  <label className="flex items-center space-x-2 mt-1.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={allowViewDiagnostics}
                                      onChange={(e) => setAllowViewDiagnostics(e.target.checked)}
                                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-xs text-slate-600">允许查看测试用例得分与报错排错建议</span>
                                  </label>
                                </div>
                              </div>

                              {/* 评分维度与权重配置 */}
                              <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-2">
                                  评分考核维度与权重配比（自动综合折算）：
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {hasJupyterEnv && (
                                    <>
                                      <div className="bg-white p-2.5 rounded-lg border border-purple-100 flex items-center justify-between">
                                        <div>
                                          <div className="font-semibold text-slate-800">Notebook 单元执行率</div>
                                          <div className="text-[10px] text-slate-400">代码单元按序无异常运行</div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <input
                                            type="number"
                                            value={gradingWeights.codeExecution}
                                            onChange={(e) => setGradingWeights({ ...gradingWeights, codeExecution: Number(e.target.value) })}
                                            className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-xs text-center font-bold text-purple-700"
                                          />
                                          <span className="text-slate-400">%</span>
                                        </div>
                                      </div>

                                      <div className="bg-white p-2.5 rounded-lg border border-purple-100 flex items-center justify-between">
                                        <div>
                                          <div className="font-semibold text-slate-800">关键变量与断言检测</div>
                                          <div className="text-[10px] text-slate-400">输出张量、指标与断言测试</div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <input
                                            type="number"
                                            value={gradingWeights.assertionTest}
                                            onChange={(e) => setGradingWeights({ ...gradingWeights, assertionTest: Number(e.target.value) })}
                                            className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-xs text-center font-bold text-purple-700"
                                          />
                                          <span className="text-slate-400">%</span>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {hasSimulationEnv && (
                                    <>
                                      <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center justify-between">
                                        <div>
                                          <div className="font-semibold text-slate-800">仿真操作规范度</div>
                                          <div className="text-[10px] text-slate-400">设备组装、接线与交互顺序</div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <input
                                            type="number"
                                            value={gradingWeights.simulationOperation}
                                            onChange={(e) => setGradingWeights({ ...gradingWeights, simulationOperation: Number(e.target.value) })}
                                            className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-xs text-center font-bold text-blue-700"
                                          />
                                          <span className="text-slate-400">%</span>
                                        </div>
                                      </div>

                                      <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center justify-between">
                                        <div>
                                          <div className="font-semibold text-slate-800">仿真参数正确率</div>
                                          <div className="text-[10px] text-slate-400">环境参数、阈值与物理量匹配</div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <input
                                            type="number"
                                            value={gradingWeights.paramAccuracy}
                                            onChange={(e) => setGradingWeights({ ...gradingWeights, paramAccuracy: Number(e.target.value) })}
                                            className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-xs text-center font-bold text-blue-700"
                                          />
                                          <span className="text-slate-400">%</span>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                                    <div>
                                      <div className="font-semibold text-slate-800">实验总结与思考题</div>
                                      <div className="text-[10px] text-slate-400">分析报告与结论心得撰写</div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <input
                                        type="number"
                                        value={gradingWeights.reportQuality}
                                        onChange={(e) => setGradingWeights({ ...gradingWeights, reportQuality: Number(e.target.value) })}
                                        className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-xs text-center font-bold text-slate-700"
                                      />
                                      <span className="text-slate-400">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-400 flex items-center space-x-2">
                          <span className="text-base">💡</span>
                          <span>提示：在上方【实验环境配置】中勾选包含「虚拟仿真」或「Jupyter」的实训环境时，即可开启实验智能自动评分设置。</span>
                        </div>
                      )}

                      {/* 下半部分：实验指导书正文在线编辑 */}
                      <div className="space-y-3 flex-1 flex flex-col min-h-[300px]">
                        <label className="font-semibold text-slate-700 block">实验指导书正文</label>
                        {renderDocumentEditor()}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'video_settings' && currentType === 'video' && (
                    <motion.div
                      key="video_settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs h-full text-xs"
                    >
                      <div className="space-y-6 max-w-3xl mx-auto pt-4">
                        <div className="space-y-2">
                          <label className="font-semibold text-slate-700 block">视频上传方式</label>
                          <div className="relative w-80">
                            <select className="w-full px-3.5 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#1890ff]">
                              <option>本地视频上传</option>
                              <option>网络视频流引用</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="font-semibold text-slate-700 block">视频上传区</label>
                          <div className="border-2 border-blue-200 border-dashed rounded-2xl bg-blue-50/40 py-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/70 transition-colors">
                            <div className="w-12 h-12 bg-[#1890ff] rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-blue-200">
                              <UploadCloud className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-slate-800 font-bold mb-1 text-sm">点击或拖拽上传教学视频</p>
                            <p className="text-slate-400 text-xs">支持 MP4, WebM 格式，单个最大 2GB</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'text_settings' && currentType === 'text' && (
                    <motion.div
                      key="text_settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {renderDocumentEditor()}
                    </motion.div>
                  )}

                  {activeTab === 'report_settings' && currentType === 'report' && (
                    <motion.div
                      key="report_settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {renderDocumentEditor()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="h-16 border-t border-slate-200 flex items-center justify-between px-6 bg-slate-50 shrink-0">
          <div className="text-xs text-slate-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            当前关联 <strong className="text-blue-600 font-bold mx-1">{selectedSkillIds.length}</strong> 个专业技能点
          </div>
          <div className="flex items-center">
            <button 
              onClick={onClose} 
              className="px-5 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors mr-3 cursor-pointer"
            >
              取消
            </button>
            <button 
              onClick={() => {
                if (onSave) {
                  onSave({
                    ...currentTask,
                    title: taskTitle.trim() || currentTask.title,
                    type: currentType,
                    skillIds: selectedSkillIds,
                    labEnvIds: selectedLabEnvIds,
                    labGradingConfig: {
                      enabled: isAutoGradingEnabled,
                      totalScore: gradingTotalScore,
                      passScore: gradingPassScore,
                      weights: gradingWeights,
                      allowViewDiagnostics
                    }
                  });
                }
                onClose();
              }}
              className="px-6 py-2 bg-[#1890ff] text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
            >
              保存配置
            </button>
          </div>
        </div>

        {/* 浮动 Toast 提示 */}
        <AnimatePresence>
          {modalToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 backdrop-blur-sm pointer-events-none"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{modalToast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
