import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Check, 
  FileSpreadsheet, 
  Bot,
  AlertCircle,
  PlusCircle
} from 'lucide-react';

// ======================= 数据类型定义 =======================
export type QuestionType = '单选题' | '多选题' | '判断题' | '填空题' | '简答题';
export type DifficultyLevel = '入门' | '常规' | '困难';

export interface QuestionOptionItem {
  id: string;
  key: string; // A, B, C, D...
  content: string; // 选项内容
  isCorrect: boolean; // 是否是正确选项
}

export interface QuestionItem {
  id: number;
  stem: string; // 题干
  score: number; // 评分
  category: string; // 分类
  difficulty: DifficultyLevel; // 难度
  updatedAt: string; // 操作时间
  type: QuestionType; // 类型
  options?: QuestionOptionItem[]; // 选项
  correctAnswer?: string; // 参考答案
  analysis?: string; // 解析
  minWordCount?: number; // 答案最少字数限制（简答题）
  maxWordCount?: number; // 答案最多字数限制（简答题）
}

// 模拟截图真实初始数据 (10条截图原版数据 + 简答题/填空题扩充)
const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    stem: "关于 plt.scatter(hours, score, c=attend, cmap='Blues') 与 plt.colorbar() 的说法，正确的有（）。",
    score: 2,
    category: '数据可视化1',
    difficulty: '困难',
    updatedAt: '2026-08-26 10:45:57',
    type: '多选题',
    options: [
      { id: 'opt-1-1', key: 'A', content: 'hours与score分别对应散点图的横纵坐标', isCorrect: true },
      { id: 'opt-1-2', key: 'B', content: 'c=attend表示按出勤率进行色彩映射', isCorrect: true },
      { id: 'opt-1-3', key: 'C', content: 'cmap指定色彩映射谱为Blues', isCorrect: true },
      { id: 'opt-1-4', key: 'D', content: 'plt.colorbar()用于在图旁绘制颜色刻度条', isCorrect: true }
    ],
    correctAnswer: 'A,B,C,D',
    analysis: 'plt.scatter接收x, y坐标及c参数控制色彩，配合cmap与colorbar绘制完整的色阶标尺。'
  },
  {
    id: 2,
    stem: '下列属于 plt.scatter() 常用参数的有（）。',
    score: 2,
    category: '数据可视化1',
    difficulty: '入门',
    updatedAt: '2026-08-26 10:46:55',
    type: '多选题',
    options: [
      { id: 'opt-2-1', key: 'A', content: 'x, y 数据坐标', isCorrect: true },
      { id: 'opt-2-2', key: 'B', content: 's 散点大小参数', isCorrect: true },
      { id: 'opt-2-3', key: 'C', content: 'c 颜色参数', isCorrect: true },
      { id: 'opt-2-4', key: 'D', content: 'marker 标记样式', isCorrect: true }
    ],
    correctAnswer: 'A,B,C,D',
    analysis: '常用的散点图绘制参数包括坐标位置x/y、大小s、颜色c及形状marker。'
  },
  {
    id: 3,
    stem: '（）是以高级语言编写计算机运行交互的综合性技术，结合了语言学、心理学、工程、计算机技术等领域的知识。',
    score: 1,
    category: '2025人工智能全栈工程实践赛预选赛',
    difficulty: '入门',
    updatedAt: '2026-09-14 10:00:29',
    type: '单选题',
    options: [
      { id: 'opt-3-1', key: 'A', content: '自然语言处理', isCorrect: true },
      { id: 'opt-3-2', key: 'B', content: '模式识别', isCorrect: false },
      { id: 'opt-3-3', key: 'C', content: '人工神经网络', isCorrect: false },
      { id: 'opt-3-4', key: 'D', content: '专家系统', isCorrect: false }
    ],
    correctAnswer: 'A',
    analysis: '自然语言处理(NLP)是计算机科学、人工智能以及语言学的交叉学科。'
  },
  {
    id: 4,
    stem: '下列属于基于统计的自然语言处理逻辑的是（）。',
    score: 1,
    category: '2025人工智能全栈工程实践赛预选赛',
    difficulty: '入门',
    updatedAt: '2026-09-14 10:01:27',
    type: '单选题',
    options: [
      { id: 'opt-4-1', key: 'A', content: 'N-gram马尔可夫模型', isCorrect: true },
      { id: 'opt-4-2', key: 'B', content: '手工编写语法产生式规则', isCorrect: false },
      { id: 'opt-4-3', key: 'C', content: '基于逻辑词典的语义消歧', isCorrect: false },
      { id: 'opt-4-4', key: 'D', content: '乔姆斯基层级结构推导', isCorrect: false }
    ],
    correctAnswer: 'A',
    analysis: 'N-gram模型建立在马尔可夫假设之上，依靠统计词频与转移概率进行建模。'
  },
  {
    id: 5,
    stem: '下列对人工智能芯片的表述，不正确的是（）。',
    score: 1,
    category: '2025人工智能全栈工程实践赛预选赛',
    difficulty: '入门',
    updatedAt: '2026-09-14 10:00:55',
    type: '单选题',
    options: [
      { id: 'opt-5-1', key: 'A', content: 'GPU具备高并发流水线，适合矩阵乘法', isCorrect: false },
      { id: 'opt-5-2', key: 'B', content: 'TPU是针对张量计算专用的ASIC芯片', isCorrect: false },
      { id: 'opt-5-3', key: 'C', content: '人工智能芯片只能部署在大型云服务器上，无法在边缘端运行', isCorrect: true },
      { id: 'opt-5-4', key: 'D', content: 'NPU具备针对神经网络算法的硬件加速单元', isCorrect: false }
    ],
    correctAnswer: 'C',
    analysis: '边缘AI芯片如K210、Jetson、手机NPU均可在本地边缘设备流畅运行推理。'
  },
  {
    id: 6,
    stem: '（）是指能够自己找出问题、思考问题、解决问题的人工智能。',
    score: 1,
    category: '2025人工智能全栈工程实践赛预选赛',
    difficulty: '入门',
    updatedAt: '2026-09-14 10:00:42',
    type: '单选题',
    options: [
      { id: 'opt-6-1', key: 'A', content: '弱人工智能', isCorrect: false },
      { id: 'opt-6-2', key: 'B', content: '通用强人工智能 (AGI)', isCorrect: true },
      { id: 'opt-6-3', key: 'C', content: '专用计算系统', isCorrect: false },
      { id: 'opt-6-4', key: 'D', content: '知识图谱推理引擎', isCorrect: false }
    ],
    correctAnswer: 'B',
    analysis: '强人工智能具备通用认知推理与自适应自主解决未知问题的能力。'
  },
  {
    id: 7,
    stem: '在人工智能的所有子集当中所牵涉范围最广的是（）。',
    score: 1,
    category: '2025人工智能全栈工程实践赛预选赛',
    difficulty: '入门',
    updatedAt: '2026-09-14 10:01:11',
    type: '单选题',
    options: [
      { id: 'opt-7-1', key: 'A', content: '机器学习', isCorrect: true },
      { id: 'opt-7-2', key: 'B', content: '深度学习', isCorrect: false },
      { id: 'opt-7-3', key: 'C', content: '自然语言理解', isCorrect: false },
      { id: 'opt-7-4', key: 'D', content: '模式匹配', isCorrect: false }
    ],
    correctAnswer: 'A',
    analysis: '机器学习是人工智能的核心研究分支，深度学习为机器学习的一个子集。'
  },
  {
    id: 8,
    stem: '智能音箱本质上是音箱，智能语音交互系统、互联网、内容叠加的产物。',
    score: 2,
    category: '人工智能',
    difficulty: '困难',
    updatedAt: '2025-09-03 17:41:26',
    type: '判断题',
    options: [
      { id: 'opt-8-1', key: 'A', content: '正确', isCorrect: true },
      { id: 'opt-8-2', key: 'B', content: '错误', isCorrect: false }
    ],
    correctAnswer: 'A',
    analysis: '智能音箱通过内置麦克风阵列与语音唤醒模型，联动云端互联网服务输出语音与音乐。'
  },
  {
    id: 9,
    stem: '智能安防监控系统中应用到的生物识别技术有（）。',
    score: 5,
    category: '人工智能',
    difficulty: '常规',
    updatedAt: '2026-08-26 10:38:22',
    type: '多选题',
    options: [
      { id: 'opt-9-1', key: 'A', content: '人脸识别', isCorrect: true },
      { id: 'opt-9-2', key: 'B', content: '虹膜识别', isCorrect: true },
      { id: 'opt-9-3', key: 'C', content: '步态识别', isCorrect: true },
      { id: 'opt-9-4', key: 'D', content: '声纹特征分析', isCorrect: true }
    ],
    correctAnswer: 'A,B,C,D',
    analysis: '安防系统中综合应用了人脸、虹膜、步态以及声纹等多种生理与行为生物特征。'
  },
  {
    id: 10,
    stem: '若模式的特征量为0-1二值特征量，统一应采用（）进行相似性度量。',
    score: 2,
    category: '人工智能',
    difficulty: '入门',
    updatedAt: '2025-08-20 19:30:05',
    type: '单选题',
    options: [
      { id: 'opt-10-1', key: 'A', content: '杰卡德相似系数 (Jaccard)', isCorrect: true },
      { id: 'opt-10-2', key: 'B', content: '欧几里得距离', isCorrect: false },
      { id: 'opt-10-3', key: 'C', content: '马氏距离', isCorrect: false },
      { id: 'opt-10-4', key: 'D', content: '切比雪夫距离', isCorrect: false }
    ],
    correctAnswer: 'A',
    analysis: 'Jaccard系数适用于集合或二值特征向量之间的交并比相似度评估。'
  },
  // 简答题 (用户专属需求)
  {
    id: 11,
    stem: '请简述在大语言模型 (LLM) 微调过程中，LoRA (Low-Rank Adaptation) 低秩适应技术的核心原理与算力优势。',
    score: 10,
    category: '人工智能',
    difficulty: '困难',
    updatedAt: '2026-09-18 16:40:00',
    type: '简答题',
    correctAnswer: '1. 核心原理：固定预训练大模型原本的高维权重矩阵W0，在侧边引入两个低秩矩阵A和B(秩r<<d)，使得权重增量ΔW=B*A；\n2. 优势：仅需微调极少数参数(通常不足原模型的1%)，显著降低GPU显存占用与训练开销，且推理时可直接矩阵融合无额外延迟。',
    analysis: '重点考查参数高效微调(PEFT)中LoRA低秩分解的数学本质与工程显存节约优势。',
    minWordCount: 50,
    maxWordCount: 500
  },
  // 填空题
  {
    id: 12,
    stem: 'Matplotlib 中用于绘制散点图的核心基础函数是（）。',
    score: 2,
    category: '数据可视化1',
    difficulty: '入门',
    updatedAt: '2026-09-15 11:20:10',
    type: '填空题',
    correctAnswer: 'plt.scatter',
    analysis: 'plt.scatter()是Python数据可视化最常用的散点绘制接口。'
  }
];

// 分类下拉候选项
const CATEGORY_OPTIONS = [
  '全部分类',
  '数据可视化1',
  '2025人工智能全栈工程实践赛预选赛',
  '人工智能',
  'Python编程基础',
  '深度学习与计算机视觉'
];

// 题型候选项 (含简答题与填空题)
const TYPE_OPTIONS: ('全部类型' | QuestionType)[] = ['全部类型', '单选题', '多选题', '判断题', '填空题', '简答题'];

// 难度候选项
const DIFFICULTY_OPTIONS: ('全部难度' | DifficultyLevel)[] = ['全部难度', '入门', '常规', '困难'];

export default function QuestionManagement() {
  // 试题数据列表
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);

  // 筛选过滤状态
  const [selectedCategory, setSelectedCategory] = useState('全部分类');
  const [selectedType, setSelectedType] = useState<'全部类型' | QuestionType>('全部类型');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'全部难度' | DifficultyLevel>('全部难度');
  const [stemKeyword, setStemKeyword] = useState('');

  // 分页状态 (截图默认展示：10条/页，总数显示如 1054 条)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // 虚拟总数模拟（保留截图底部的“共 1054 条”真实感）
  const totalDisplayBase = 1054;
  const deltaCount = questions.length - INITIAL_QUESTIONS.length;
  const totalCount = totalDisplayBase + deltaCount;

  // 弹窗状态
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // 新增/编辑题目表单状态（完全复刻截图结构）
  const [formType, setFormType] = useState<QuestionType>('单选题');
  const [formScore, setFormScore] = useState<number>(1);
  const [formCategory, setFormCategory] = useState<string>('');
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>('入门');
  const [formStem, setFormStem] = useState<string>('');
  const [formAnalysis, setFormAnalysis] = useState<string>('');
  const [formEssayAnswer, setFormEssayAnswer] = useState<string>(''); // 简答题/填空题参考答案
  const [formMinWords, setFormMinWords] = useState<number>(0); // 简答题最少字数 (0代表不限)
  const [formMaxWords, setFormMaxWords] = useState<number>(500); // 简答题最多字数限制

  // 选项行列表（用于单选题、多选题、判断题）
  const [optionRows, setOptionRows] = useState<QuestionOptionItem[]>([
    { id: 'opt-a', key: 'A', content: '', isCorrect: true },
    { id: 'opt-b', key: 'B', content: '', isCorrect: false },
    { id: 'opt-c', key: 'C', content: '', isCorrect: false },
    { id: 'opt-d', key: 'D', content: '', isCorrect: false }
  ]);

  // 提示信息 Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 筛选过滤
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 分类筛选
      if (selectedCategory !== '全部分类' && q.category !== selectedCategory) {
        return false;
      }
      // 类型筛选
      if (selectedType !== '全部类型' && q.type !== selectedType) {
        return false;
      }
      // 难度筛选
      if (selectedDifficulty !== '全部难度' && q.difficulty !== selectedDifficulty) {
        return false;
      }
      // 题干关键字筛选
      if (stemKeyword.trim() && !q.stem.toLowerCase().includes(stemKeyword.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [questions, selectedCategory, selectedType, selectedDifficulty, stemKeyword]);

  // 分页截取
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = ((currentPage - 1) * pageSize) % Math.max(filteredQuestions.length, 1);
    const slice = filteredQuestions.slice(start, start + pageSize);
    if (slice.length > 0) return slice;
    return filteredQuestions.slice(0, pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  // 重置筛选条件
  const handleResetFilters = () => {
    setSelectedCategory('全部分类');
    setSelectedType('全部类型');
    setSelectedDifficulty('全部难度');
    setStemKeyword('');
    setCurrentPage(1);
  };

  // 页码跳转
  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPageInput('');
    } else {
      showToast(`请输入 1 到 ${totalPages} 之间的有效页码`);
    }
  };

  // 切换题目类型时的初始化联动
  const handleTypeChange = (newType: QuestionType) => {
    setFormType(newType);
    if (newType === '判断题') {
      setOptionRows([
        { id: 'opt-judge-1', key: 'A', content: '正确', isCorrect: true },
        { id: 'opt-judge-2', key: 'B', content: '错误', isCorrect: false }
      ]);
    } else if (newType === '单选题') {
      // 保证只有一个正确选项
      setOptionRows(prev => {
        let hasCorrect = false;
        return prev.map(opt => {
          if (opt.isCorrect && !hasCorrect) {
            hasCorrect = true;
            return opt;
          }
          return { ...opt, isCorrect: false };
        });
      });
    }
  };

  // 新增一个选项行
  const handleAddOption = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nextChar = alphabet[optionRows.length % alphabet.length] || `X${optionRows.length + 1}`;
    const newOpt: QuestionOptionItem = {
      id: `opt-${Date.now()}-${optionRows.length}`,
      key: nextChar,
      content: '',
      isCorrect: false
    };
    setOptionRows(prev => [...prev, newOpt]);
  };

  // 删除某选项行
  const handleDeleteOption = (id: string) => {
    if (optionRows.length <= 2) {
      showToast('至少需要保留 2 个选项');
      return;
    }
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const updated = optionRows.filter(o => o.id !== id).map((item, idx) => ({
      ...item,
      key: alphabet[idx] || `X${idx + 1}`
    }));
    setOptionRows(updated);
  };

  // 选项行内容更新
  const handleOptionContentChange = (id: string, text: string) => {
    setOptionRows(prev => prev.map(o => o.id === id ? { ...o, content: text } : o));
  };

  // 切换选项正确答案
  const handleToggleOptionCorrect = (id: string) => {
    if (formType === '单选题' || formType === '判断题') {
      setOptionRows(prev => prev.map(o => ({ ...o, isCorrect: o.id === id })));
    } else if (formType === '多选题') {
      setOptionRows(prev => prev.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o));
    }
  };

  // 打开新增弹窗（重置为截图默认态：单选、1分、分类空、入门、选项空、解析空）
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormType('单选题');
    setFormScore(1);
    setFormCategory('');
    setFormDifficulty('入门');
    setFormStem('');
    setFormAnalysis('');
    setFormEssayAnswer('');
    setFormMinWords(0);
    setFormMaxWords(500);
    setOptionRows([
      { id: 'opt-a', key: 'A', content: '', isCorrect: true },
      { id: 'opt-b', key: 'B', content: '', isCorrect: false },
      { id: 'opt-c', key: 'C', content: '', isCorrect: false },
      { id: 'opt-d', key: 'D', content: '', isCorrect: false }
    ]);
    setIsAddModalOpen(true);
  };

  // 打开编辑弹窗
  const handleOpenEditModal = (q: QuestionItem) => {
    setEditingQuestion(q);
    setFormType(q.type);
    setFormScore(q.score || 1);
    setFormCategory(q.category || '');
    setFormDifficulty(q.difficulty || '入门');
    setFormStem(q.stem || '');
    setFormAnalysis(q.analysis || '');
    setFormEssayAnswer(q.correctAnswer || '');
    setFormMinWords(q.minWordCount ?? 0);
    setFormMaxWords(q.maxWordCount ?? 500);
    if (q.options && q.options.length > 0) {
      setOptionRows(q.options);
    } else {
      setOptionRows([
        { id: 'opt-a', key: 'A', content: '', isCorrect: true },
        { id: 'opt-b', key: 'B', content: '', isCorrect: false },
        { id: 'opt-c', key: 'C', content: '', isCorrect: false },
        { id: 'opt-d', key: 'D', content: '', isCorrect: false }
      ]);
    }
    setIsAddModalOpen(true);
  };

  // 保存题目（新增或修改）
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStem.trim()) {
      showToast('请输入题干内容');
      return;
    }

    // 校验选项
    let finalAnswer = '';
    let finalOptions: QuestionOptionItem[] | undefined = undefined;

    if (formType === '单选题' || formType === '多选题' || formType === '判断题') {
      const correctKeys = optionRows.filter(o => o.isCorrect).map(o => o.key);
      if (correctKeys.length === 0) {
        showToast('请至少勾选一个正确选项');
        return;
      }
      finalAnswer = correctKeys.join(',');
      finalOptions = optionRows;
    } else if (formType === '填空题' || formType === '简答题') {
      if (!formEssayAnswer.trim()) {
        showToast(`请输入${formType}的参考答案与采分点`);
        return;
      }
      finalAnswer = formEssayAnswer.trim();
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (editingQuestion) {
      // 编辑更新
      setQuestions(prev => prev.map(item => {
        if (item.id === editingQuestion.id) {
          return {
            ...item,
            stem: formStem.trim(),
            type: formType,
            category: formCategory.trim() || '通用分类',
            difficulty: formDifficulty,
            score: formScore,
            options: finalOptions,
            correctAnswer: finalAnswer,
            analysis: formAnalysis.trim(),
            minWordCount: formType === '简答题' ? formMinWords : undefined,
            maxWordCount: formType === '简答题' ? Math.max(formMinWords, formMaxWords) : undefined,
            updatedAt: nowStr
          };
        }
        return item;
      }));
      showToast('试题更新成功！');
    } else {
      // 新增保存
      const newId = Date.now();
      const newQ: QuestionItem = {
        id: newId,
        stem: formStem.trim(),
        type: formType,
        category: formCategory.trim() || '通用分类',
        difficulty: formDifficulty,
        score: formScore,
        options: finalOptions,
        correctAnswer: finalAnswer,
        analysis: formAnalysis.trim(),
        minWordCount: formType === '简答题' ? formMinWords : undefined,
        maxWordCount: formType === '简答题' ? Math.max(formMinWords, formMaxWords) : undefined,
        updatedAt: nowStr
      };
      setQuestions(prev => [newQ, ...prev]);
      showToast('题目创建成功！');
    }

    setIsAddModalOpen(false);
    setEditingQuestion(null);
  };

  // 删除试题
  const handleDeleteQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    setDeleteConfirmId(null);
    showToast('试题已成功移除！');
  };

  // 生成页码序列（带省略号）
  const renderPaginationButtons = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, 4, 5, 6, '...', totalPages);
    }

    return pages.map((p, idx) => {
      if (p === '...') {
        return (
          <span key={`ellipsis-${idx}`} className="w-7 h-7 flex items-center justify-center text-slate-400 text-xs select-none">
            ...
          </span>
        );
      }
      const pageNum = Number(p);
      const isCurrent = currentPage === pageNum;
      return (
        <button
          key={pageNum}
          type="button"
          onClick={() => setCurrentPage(pageNum)}
          className={`w-7 h-7 text-xs font-medium rounded transition-colors flex items-center justify-center ${
            isCurrent
              ? 'bg-[#1677ff] text-white shadow-xs font-semibold'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-800 relative">
      
      {/* 顶部 Toast 消息通知 */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs shadow-lg flex items-center space-x-2 animate-in fade-in duration-200">
          <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          1. 顶部操作栏与检索表单栏（完全贴合截图）
      ======================================================== */}
      <div className="shrink-0 p-5 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* 左侧主按钮组：+ 新增试题、+ 批量导入 */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>新增试题</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>批量导入</span>
          </button>
        </div>

        {/* 右侧多条件筛选栏：分类、类型、难度、题干、查询、重置 */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* 分类下拉 */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3 pr-7 py-1 text-xs bg-white border border-slate-200 rounded text-slate-700 outline-none hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c === '全部分类' ? '分类' : c}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 类型下拉 (含简答题与填空题) */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as any);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3 pr-7 py-1 text-xs bg-white border border-slate-200 rounded text-slate-700 outline-none hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
            >
              {TYPE_OPTIONS.map(t => (
                <option key={t} value={t}>{t === '全部类型' ? '类型' : t}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 难度下拉 */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value as any);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3 pr-7 py-1 text-xs bg-white border border-slate-200 rounded text-slate-700 outline-none hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
            >
              {DIFFICULTY_OPTIONS.map(d => (
                <option key={d} value={d}>{d === '全部难度' ? '难度' : d}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 题干搜索输入框 */}
          <div className="relative">
            <input
              type="text"
              value={stemKeyword}
              onChange={(e) => {
                setStemKeyword(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="题干"
              className="w-36 md:w-44 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded text-slate-700 outline-none hover:border-blue-400 focus:border-blue-500 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* 查询按钮 */}
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className="px-3 py-1 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>查询</span>
          </button>

          {/* 重置按钮 */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置</span>
          </button>

        </div>

      </div>

      {/* ========================================================
          2. 数据表格（1:1 复刻截图：序号、题干、评分、分类、难度、操作时间、类型、操作）
      ======================================================== */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead className="sticky top-0 bg-white z-10 border-b border-slate-200/90 text-xs font-medium text-slate-600">
            <tr>
              <th className="py-3 px-3 text-center w-14 text-slate-500 font-normal">序号</th>
              <th className="py-3 px-4 text-left font-normal text-slate-600">题干</th>
              <th className="py-3 px-3 text-center w-16 text-slate-600 font-normal">评分</th>
              <th className="py-3 px-4 text-center w-48 text-slate-600 font-normal">分类</th>
              <th className="py-3 px-3 text-center w-20 text-slate-600 font-normal">难度</th>
              <th className="py-3 px-4 text-center w-40 text-slate-600 font-normal">操作时间</th>
              <th className="py-3 px-3 text-center w-24 text-slate-600 font-normal">类型</th>
              <th className="py-3 px-4 text-center w-32 text-slate-600 font-normal">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {paginatedQuestions.length > 0 ? (
              paginatedQuestions.map((q, idx) => {
                const rowNum = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr key={q.id} className="hover:bg-blue-50/20 transition-colors group">
                    {/* 序号 */}
                    <td className="py-3.5 px-3 text-center text-slate-500">
                      {rowNum}
                    </td>

                    {/* 题干 (支持展开查看完整选项) */}
                    <td className="py-3.5 px-4 text-slate-800 leading-relaxed font-normal">
                      <div className="line-clamp-2 hover:line-clamp-none transition-all cursor-default" title={q.stem}>
                        {q.stem}
                      </div>
                    </td>

                    {/* 评分 */}
                    <td className="py-3.5 px-3 text-center text-slate-700 font-medium">
                      {q.score}
                    </td>

                    {/* 分类 */}
                    <td className="py-3.5 px-4 text-center text-slate-600 whitespace-nowrap">
                      {q.category}
                    </td>

                    {/* 难度 */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`text-xs ${
                        q.difficulty === '困难'
                          ? 'text-amber-600'
                          : q.difficulty === '常规'
                          ? 'text-blue-600'
                          : 'text-slate-600'
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>

                    {/* 操作时间 */}
                    <td className="py-3.5 px-4 text-center text-slate-500 whitespace-nowrap">
                      {q.updatedAt}
                    </td>

                    {/* 类型 */}
                    <td className="py-3.5 px-3 text-center text-slate-600 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                        q.type === '简答题' 
                          ? 'bg-purple-50 text-purple-600 border border-purple-200' 
                          : q.type === '填空题'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-50 text-slate-600'
                      }`}>
                        {q.type}
                      </span>
                      {q.type === '简答题' && (q.maxWordCount || q.minWordCount) ? (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {q.minWordCount ? `${q.minWordCount}-` : '≤'}{q.maxWordCount || 500}字
                        </div>
                      ) : null}
                    </td>

                    {/* 操作：编辑、删除 */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(q)}
                          className="text-[#1677ff] hover:text-blue-700 flex items-center space-x-0.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 mr-0.5" />
                          <span>编辑</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(q.id)}
                          className="text-[#ff4d4f] hover:text-red-700 flex items-center space-x-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 mr-0.5" />
                          <span>删除</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-14 text-center text-slate-400 text-xs">
                  暂未检索到匹配的试题数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          3. 表格底部分页条（1:1 复刻截图：共1054条、10条/页、< 1 2 3 4 5 6 ... 107 > 前往 1 页）
      ======================================================== */}
      <div className="shrink-0 px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-white z-10">
        
        {/* 左侧：条数统计与下拉 */}
        <div className="flex items-center space-x-3">
          <span>
            共 <span className="text-slate-800">{totalCount}</span> 条
          </span>

          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none pl-2.5 pr-6 py-1 bg-white border border-slate-200 rounded text-slate-700 text-xs outline-none hover:border-blue-400 cursor-pointer"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
              <option value={100}>100条/页</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 右侧：页码数字按钮与直接跳转 */}
        <div className="flex items-center space-x-1.5">
          {/* 上一页 */}
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-500"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* 页码序列 */}
          {renderPaginationButtons()}

          {/* 下一页 */}
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-500"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* 前往 N 页 */}
          <form onSubmit={handleJumpPage} className="flex items-center space-x-1 pl-2 text-slate-500">
            <span>前往</span>
            <input
              type="text"
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              placeholder="1"
              className="w-9 py-0.5 text-center text-xs border border-slate-200 rounded text-slate-700 outline-none hover:border-blue-400 focus:border-blue-500"
            />
            <span>页</span>
          </form>
        </div>

      </div>

      {/* ========================================================
          4. 浮动智能助手图标（参考截图右下角的可爱机器人）
      ======================================================== */}
      <div 
        className="fixed bottom-6 right-8 w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 transition-all z-40 border-2 border-white"
        title="试题智能助手：支持 AI 一键自动组卷、试题智能查重与查漏补缺"
        onClick={() => showToast('AI 试题分析助手已就绪：支持一键润色试题题干与自动生成解析！')}
      >
        <Bot className="w-5 h-5" />
      </div>

      {/* ========================================================
          5. 新增 / 编辑题目 Modal 弹窗（1:1 复刻用户发来的新增题目截图）
      ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-[560px] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
            
            {/* 弹窗 Header：新增题目 + X 关闭 */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-base font-medium text-slate-800">
                {editingQuestion ? '编辑题目' : '新增题目'}
              </h3>
              <button 
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingQuestion(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 弹窗 Body：各表单项按照截图从上至下依次排布 */}
            <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs">
              
              {/* 1. * 题目类型: 单选题、多选题、判断题、填空题、简答题 (Radio组) */}
              <div>
                <label className="block text-slate-700 font-normal mb-2">
                  <span className="text-red-500 mr-1">*</span>题目类型:
                </label>
                <div className="flex flex-wrap items-center gap-5">
                  {(['单选题', '多选题', '判断题', '填空题', '简答题'] as QuestionType[]).map((type) => {
                    const isSelected = formType === type;
                    return (
                      <label 
                        key={type} 
                        className="flex items-center space-x-1.5 cursor-pointer select-none"
                        onClick={() => handleTypeChange(type)}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-[#1677ff] bg-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#1677ff]"></div>}
                        </div>
                        <span className={`text-xs ${isSelected ? 'text-[#1677ff] font-medium' : 'text-slate-600'}`}>
                          {type}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. 分数: 减号 / 数字输入 / 加号 步进器 */}
              <div>
                <label className="block text-slate-700 font-normal mb-1.5">
                  分数:
                </label>
                <div className="flex items-center border border-slate-200 rounded w-28 h-7.5 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setFormScore(prev => Math.max(1, prev - 1))}
                    className="w-7 h-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 border-r border-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formScore}
                    onChange={(e) => setFormScore(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="flex-1 h-full text-center text-xs outline-none text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setFormScore(prev => prev + 1)}
                    className="w-7 h-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 border-l border-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 3. 分类: 下拉选择框（placeholder 请输入） */}
              <div>
                <label className="block text-slate-700 font-normal mb-1.5">
                  分类:
                </label>
                <div className="relative">
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-slate-200 rounded text-slate-700 text-xs outline-none hover:border-blue-400 focus:border-[#1677ff] bg-white cursor-pointer transition-colors"
                  >
                    <option value="">请输入</option>
                    {CATEGORY_OPTIONS.filter(c => c !== '全部分类').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 4. * 难度: 下拉框（默认 入门） */}
              <div>
                <label className="block text-slate-700 font-normal mb-1.5">
                  <span className="text-red-500 mr-1">*</span>难度:
                </label>
                <div className="relative">
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full appearance-none px-3 py-2 border border-slate-200 rounded text-slate-700 text-xs outline-none hover:border-blue-400 focus:border-[#1677ff] bg-white cursor-pointer transition-colors"
                  >
                    <option value="入门">入门</option>
                    <option value="常规">常规</option>
                    <option value="困难">困难</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 5. * 题干: 单行输入框 */}
              <div>
                <label className="block text-slate-700 font-normal mb-1.5">
                  <span className="text-red-500 mr-1">*</span>题干:
                </label>
                <input
                  type="text"
                  required
                  value={formStem}
                  onChange={(e) => setFormStem(e.target.value)}
                  placeholder="请输入"
                  className="w-full px-3 py-2 border border-slate-200 rounded text-slate-800 text-xs outline-none hover:border-blue-400 focus:border-[#1677ff] bg-white transition-colors"
                />
              </div>

              {/* 6. * 选项: 
                  单选题 / 多选题 / 判断题：展示截图中的选项表格；
                  简答题：用户新增类型，展示答案字数配置、参考答案与采分要点输入框；
                  填空题：展示标准填空词输入框 */}
              {formType === '简答题' ? (
                <div className="space-y-3.5">
                  {/* 简答题答案字数配置 */}
                  <div>
                    <label className="block text-slate-700 font-normal mb-1.5">
                      答案字数配置:
                    </label>
                    <div className="flex flex-wrap items-center gap-3 p-3 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-500">最少:</span>
                        <input
                          type="number"
                          min={0}
                          max={formMaxWords || 5000}
                          value={formMinWords === 0 ? '' : formMinWords}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormMinWords(val);
                          }}
                          placeholder="不限"
                          className="w-20 px-2 py-1 text-center bg-white border border-slate-200 rounded text-slate-800 outline-none hover:border-blue-400 focus:border-[#1677ff] transition-colors"
                        />
                        <span className="text-slate-500">字</span>
                        <span className="text-[11px] text-slate-400">(留空不限)</span>
                      </div>

                      <span className="text-slate-300">至</span>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-500">最多:</span>
                        <input
                          type="number"
                          min={1}
                          max={5000}
                          value={formMaxWords || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 500 : Math.max(1, parseInt(e.target.value, 10) || 1);
                            setFormMaxWords(val);
                          }}
                          placeholder="500"
                          className="w-20 px-2 py-1 text-center bg-white border border-slate-200 rounded text-slate-800 outline-none hover:border-blue-400 focus:border-[#1677ff] transition-colors"
                        />
                        <span className="text-slate-500">字</span>
                      </div>

                      <div className="ml-auto text-[11px] text-slate-400">
                        {formMinWords > 0 ? (
                          <span>要求：<span className="text-blue-600 font-medium">{formMinWords} ~ {formMaxWords}</span> 字</span>
                        ) : (
                          <span>要求：<span className="text-blue-600 font-medium">最多 {formMaxWords}</span> 字</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 参考答案与采分要点 */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-700 font-normal">
                        <span className="text-red-500 mr-1">*</span>参考答案与采分要点:
                      </label>
                      <span className="text-[11px] text-slate-400">
                        已输入 {formEssayAnswer.length} 字
                        {formMaxWords > 0 && ` (建议不超过 ${formMaxWords} 字)`}
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={formEssayAnswer}
                      onChange={(e) => setFormEssayAnswer(e.target.value)}
                      placeholder="请输入简答题的参考标准答案、要点及采分规则..."
                      className="w-full p-2.5 border border-slate-200 rounded text-slate-800 text-xs outline-none hover:border-blue-400 focus:border-[#1677ff] bg-white transition-colors leading-relaxed"
                    />
                  </div>
                </div>
              ) : formType === '填空题' ? (
                <div>
                  <label className="block text-slate-700 font-normal mb-1.5">
                    <span className="text-red-500 mr-1">*</span>填空标准参考答案:
                  </label>
                  <input
                    type="text"
                    required
                    value={formEssayAnswer}
                    onChange={(e) => setFormEssayAnswer(e.target.value)}
                    placeholder="请输入填空标准答案，多个空格请用分号隔开"
                    className="w-full px-3 py-2 border border-slate-200 rounded text-slate-800 text-xs outline-none hover:border-blue-400 focus:border-[#1677ff] bg-white transition-colors"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 font-normal mb-1.5">
                    <span className="text-red-500 mr-1">*</span>选项:
                  </label>
                  
                  {/* 选项表格 (截图1:1复刻样式) */}
                  <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
                    {/* 表头 */}
                    <div className="bg-[#f4f6f9] border-b border-slate-200 flex items-center text-slate-600 text-xs py-2 px-3 font-medium">
                      <div className="w-20 text-center">正确选项</div>
                      <div className="w-14 text-center">选项</div>
                      <div className="flex-1 text-left pl-2">选项内容</div>
                      <div className="w-16 text-center">删除</div>
                    </div>

                    {/* 选项行列表 */}
                    <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                      {optionRows.map((opt) => (
                        <div key={opt.id} className="flex items-center py-2 px-3 hover:bg-slate-50/60 transition-colors gap-2">
                          
                          {/* 正确选项：单选题为单选Radio，多选题为Checkbox复选框 */}
                          <div className="w-20 flex justify-center items-center">
                            {formType === '多选题' ? (
                              <input
                                type="checkbox"
                                checked={opt.isCorrect}
                                onChange={() => handleToggleOptionCorrect(opt.id)}
                                className="w-3.5 h-3.5 rounded border-slate-300 text-[#1677ff] focus:ring-0 cursor-pointer"
                              />
                            ) : (
                              <input
                                type="radio"
                                name="single-correct"
                                checked={opt.isCorrect}
                                onChange={() => handleToggleOptionCorrect(opt.id)}
                                className="w-3.5 h-3.5 border-slate-300 text-[#1677ff] focus:ring-0 cursor-pointer"
                              />
                            )}
                          </div>

                          {/* 选项标签：A, B, C, D */}
                          <div className="w-14 text-center font-medium text-slate-700">
                            {opt.key}
                          </div>

                          {/* 选项内容输入框 */}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={opt.content}
                              onChange={(e) => handleOptionContentChange(opt.id, e.target.value)}
                              placeholder="请输入选项内容"
                              className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded outline-none hover:border-blue-400 focus:border-[#1677ff] text-slate-800 bg-white"
                            />
                          </div>

                          {/* 删除操作 */}
                          <div className="w-16 text-center">
                            {formType !== '判断题' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteOption(opt.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="删除此选项"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* 底部：[ ⊕ 新增选项 ] 蓝色线框按钮 (判断题不可新增) */}
                    {formType !== '判断题' && (
                      <div className="p-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleAddOption}
                          className="px-3 py-1.5 border border-[#1677ff] text-[#1677ff] hover:bg-blue-50/60 rounded text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>新增选项</span>
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* 7. * 解 析: textarea 带 0 / 200 字符限制 */}
              <div>
                <label className="block text-slate-700 font-normal mb-1.5">
                  <span className="text-red-500 mr-1">*</span>解 析:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={200}
                    value={formAnalysis}
                    onChange={(e) => setFormAnalysis(e.target.value)}
                    placeholder="请输入"
                    className="w-full p-2.5 pb-6 border border-slate-200 rounded text-slate-800 text-xs outline-none hover:border-blue-400 focus:border-[#1677ff] bg-white transition-colors leading-relaxed"
                  />
                  <div className="absolute right-2.5 bottom-2 text-[11px] text-slate-400 pointer-events-none select-none">
                    {formAnalysis.length} / 200
                  </div>
                </div>
              </div>

              {/* 8. 底部操作按钮：左边取消 (灰色)，右边保存 (亮蓝) */}
              <div className="pt-3 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingQuestion(null);
                  }}
                  className="px-7 py-2 bg-[#8c8c8c] hover:bg-slate-500 text-white rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-7 py-2 bg-[#2f80ed] hover:bg-blue-600 text-white rounded text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  保存
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          6. 批量导入 Modal 弹窗
      ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">批量导入试题</h3>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 group">
                <FileSpreadsheet className="w-10 h-10 text-slate-300 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                <p className="font-medium text-slate-700">点击或将 Excel 试题文件拖拽至此处</p>
                <p className="text-[11px] text-slate-400 mt-1">支持 .xlsx、.xls 标准试题模版文件</p>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 text-slate-600 text-[11px] space-y-1">
                <div className="font-semibold text-blue-700">导入提示：</div>
                <div>1. 支持单选题、多选题、判断题、填空题与简答题格式模版；</div>
                <div>2. 系统将自动按分类、难度及题型进行校验与排重；</div>
                <div>
                  <button 
                    type="button"
                    onClick={() => showToast('已下载标准试题导入模版 (Excel)')}
                    className="text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    下载标准试题模版 (.xlsx)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('试题批量导入成功：新增 10 道试题，已自动更新列表！');
                    setIsImportModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
                >
                  开始导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. 删除确认对话框
      ======================================================== */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 text-xs animate-in fade-in zoom-in-95 duration-150">
            <h4 className="text-sm font-bold text-slate-800 mb-2">确认删除试题</h4>
            <p className="text-slate-500 mb-4">
              删除后该试题将从题库中彻底移除，若试卷已引用可能影响统计，确定要继续删除吗？
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(deleteConfirmId)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
