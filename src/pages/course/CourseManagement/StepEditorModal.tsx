import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, ArrowUp, ArrowDown, Link2, Box, Image as ImageIcon, 
  Plus, Minus, Bold, Underline, Italic, Strikethrough, Heading, Code, Image, Undo, Redo, Eye, List, ListOrdered, 
  UploadCloud, Copy, Cpu, Target, Book, Sparkles, CheckCircle2, GitBranch, Search, CheckSquare,
  Check, Layers, ChevronsRight, ChevronsLeft,
  FileText, Download, Trash2, FileCheck
} from 'lucide-react';
import { SkillCategory, SkillItem } from '../TeacherCourseManagement/SkillGraphImportModal';

export interface UploadedStepDocument {
  id: string;
  name: string;
  size: string;
  type: string; // 'pdf' | 'word' | 'md' | 'txt'
  uploadTime: string;
  fileObj?: File;
}

interface Task {
  id: string;
  title: string;
  type: string;
  hasTrial: boolean;
  chapterName?: string;
  skillIds?: string[];
}

interface Chapter {
  id: number;
  title: string;
  tasks: Task[];
}

interface StepEditorModalProps {
  task: Task;
  courseName?: string;
  chapters?: Chapter[];
  skillCategories?: SkillCategory[];
  onClose: () => void;
  onSave?: (task: any) => void;
}

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
  },
  {
    id: 'cat-D',
    code: 'D',
    name: '实战案例解析',
    skills: [
      { id: 's-016', code: '001', name: '图像分类任务' },
      { id: 's-017', code: '002', name: '文本生成项目' },
      { id: 's-018', code: '003', name: '目标检测实现' },
      { id: 's-019', code: '004', name: '时间序列预测' },
      { id: 's-020', code: '005', name: '推荐系统设计' },
    ]
  }
];

const typeConfig: Record<string, { label: string, color: string }> = {
  text: { label: '图文', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  video: { label: '视频', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  exercise: { label: '习题', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  experiment: { label: '实验', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  report: { label: '报告', color: 'bg-purple-100 text-purple-600 border-purple-200' }
};

export default function StepEditorModal({ 
  task, 
  courseName, 
  chapters = [], 
  skillCategories = DEFAULT_SKILL_CATEGORIES,
  onClose,
  onSave
}: StepEditorModalProps) {
  const [currentTask, setCurrentTask] = useState(task);
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
        // Constrain width between 200px and 500px
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
    
    // Auto-switch tabs logic based on the new task type
    const newType = currentTask.type;
    setActiveTab(`${newType}_settings`);
  }, [currentTask]);

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

  // -------------------------------------------------------------
  // 文档上传、预览与下载管理状态（图文与实验步骤共用支持）
  // -------------------------------------------------------------
  const [docContentType, setDocContentType] = useState<'online' | 'upload'>('online');
  
  // 各步骤上传的文档存储（包含默认高质量示例文档）
  const [taskDocuments, setTaskDocuments] = useState<Record<string, UploadedStepDocument>>({
    't-exp': {
      id: 'doc-init-exp',
      name: '【实验指导书】物联网感知与仿真交互实验操作手册.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadTime: '2026-09-20 10:28'
    },
    't-text': {
      id: 'doc-init-text',
      name: '【理论讲义】深度学习网络拓扑结构核心理论讲义.docx',
      size: '1.8 MB',
      type: 'word',
      uploadTime: '2026-09-20 10:25'
    }
  });

  // 文档全屏高保真预览弹窗状态
  const [previewingDoc, setPreviewingDoc] = useState<UploadedStepDocument | null>(null);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewZoom, setPreviewZoom] = useState(100);

  // 文件上传隐藏 input 引用
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // 上传教学实验文档
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let docType = 'txt';
    if (ext === 'pdf') docType = 'pdf';
    else if (ext === 'doc' || ext === 'docx') docType = 'word';
    else if (ext === 'md' || ext === 'markdown') docType = 'md';

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newDoc: UploadedStepDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: sizeStr,
      type: docType,
      uploadTime: timeStr,
      fileObj: file
    };

    setTaskDocuments(prev => ({
      ...prev,
      [currentTask.id]: newDoc,
      ...(currentType === 'experiment' ? { 't-exp': newDoc } : {}),
      ...(currentType === 'text' ? { 't-text': newDoc } : {})
    }));

    showModalToast(`文档「${file.name}」上传成功！`);
  };

  // 下载教学实验文档
  const handleDownloadDocument = (doc: UploadedStepDocument) => {
    try {
      if (doc.fileObj) {
        const url = URL.createObjectURL(doc.fileObj);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const content = `=====================================================
【教学实验指导书】
文档名称：${doc.name}
文件规格：${doc.size} | 格式：${doc.type.toUpperCase()}
更新时间：${doc.uploadTime}
课程归属：${courseName || '专业核心实训课程'}
=====================================================

一、实验目标与考核要点
1. 理解实验拓扑设计原则与各节点协同工作流程；
2. 按照步骤规范完成实验考核与数据验证；
3. 掌握关键环境运行参数排查与自动化评测诊断。

二、实验软硬件准备
- 运行环境：内置容器与仿真测试平台
- 判分模式：自动化断言与能力雷达评测
- 关联技能点：已智能绑定课程大纲核心能力项

三、实验操作核心规程
1. 建立通讯连线与硬件参数自测；
2. 运行实验主程序并收集持久化结果；
3. 验证通过后提交实验任务以生成雷达图能力报告。

四、注意事项
请确保在指定时间内提交实验结果，切勿随意修改仿真环境基础配置。
=====================================================`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name.endsWith('.pdf') || doc.name.endsWith('.docx') ? `${doc.name}.txt` : doc.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      showModalToast(`已成功开始下载文档「${doc.name}」！`);
    } catch (err) {
      showModalToast(`下载文档失败，请重试`);
    }
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
    showModalToast('已添加技能点关联');
  };

  // 单个快捷移除
  const handleRemoveSingleSkill = (skillId: string) => {
    setSelectedSkillIds(prev => prev.filter(id => id !== skillId));
    setRightCheckedSkillIds(prev => prev.filter(id => id !== skillId));
    showModalToast('已解除技能点关联');
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
    { id: 1, title: "关于 plt.scatter(hours, score, c=attend, cmap='Blues') 与 plt.colorbar() 的说法，正确的是（ ）。", type: '多选题', category: '编程基础', score: 2, skillIds: ['s-006', 's-001'] },
    { id: 2, title: "下列属于 plt.scatter() 常用参数的有（ ）。", type: '多选题', category: '编程基础', score: 2, skillIds: ['s-006'] },
    { id: 3, title: "下列属于虚拟仿真环境支持的操作功能的有（ ）。", type: '多选题', category: '仿真', score: 4, skillIds: ['s-007', 's-008'] },
    { id: 4, title: "在智慧家居项目的应用设计中，2D应用界面需实现的功能包括（ ）。", type: '多选题', category: '设计', score: 4, skillIds: ['s-010'] },
    { id: 5, title: "使用 OpenCV 进行图像色彩空间转换时，BGR 转灰度图的常用色彩代码是（ ）。", type: '单选题', category: '编程基础', score: 2, skillIds: ['s-011'] },
    { id: 6, title: "在图像标注任务中，以下关于目标检测矩形框标注规范说法正确的有（ ）。", type: '多选题', category: '设计', score: 3, skillIds: ['s-016', 's-018'] },
    { id: 7, title: "NumPy 中用于矩阵转置的属性是（ ）。", type: '单选题', category: '编程基础', score: 2, skillIds: ['s-006'] },
    { id: 8, title: "下列哪些方法可以用来防止机器学习模型过拟合（ ）。", type: '多选题', category: '编程基础', score: 4, skillIds: ['s-003', 's-004'] },
    { id: 9, title: "虚拟现实与仿真系统中常采用的三维模型文件格式包括（ ）。", type: '多选题', category: '仿真', score: 3, skillIds: ['s-007'] },
    { id: 10, title: "在进行多边形语义分割标注时，关键边缘点的贴合度要求应达到（ ）。", type: '单选题', category: '设计', score: 2, skillIds: ['s-016'] },
    { id: 11, title: "简述在图像预处理阶段进行直方图均衡化的主要目的和基本原理。", type: '简答题', category: '编程基础', score: 5, skillIds: ['s-011'] },
    { id: 12, title: "PyTorch 中用于定义神经网络层参数梯度的核心属性是 requires_grad。（ ）", type: '单选题', category: '编程基础', score: 2, skillIds: ['s-001', 's-005'] },
    { id: 13, title: "在 3D 点云仿真交互中，用于坐标系姿态描述的四元数包含几个分量（ ）。", type: '单选题', category: '仿真', score: 2, skillIds: ['s-007'] },
    { id: 14, title: "UI 设计中遵循的无障碍对比度（WCAG AA级）对于普通文本的最小比值是（ ）。", type: '单选题', category: '设计', score: 3, skillIds: ['s-010'] },
    { id: 15, title: "Pandas 中读取 CSV 文件并自动解析日期列的常用参数是（ ）。", type: '单选题', category: '编程基础', score: 2, skillIds: ['s-009'] },
    { id: 16, title: "下列属于常见工业缺陷图像检测样本增强手段的有（ ）。", type: '多选题', category: '设计', score: 4, skillIds: ['s-016', 's-018'] },
    { id: 17, title: "在机器人轨迹仿真测试中，逆运动学求解的主要应用场景是什么？", type: '简答题', category: '仿真', score: 5, skillIds: ['s-007'] },
    { id: 18, title: "Matplotlib 图表中保存高分辨率图像时，推荐设置的 dpi 数值是（ ）。", type: '单选题', category: '编程基础', score: 2, skillIds: ['s-006'] },
    { id: 19, title: "交互式标注系统中快捷键撤销和重做的通用快捷键是（ ）。", type: '多选题', category: '设计', score: 2, skillIds: ['s-016'] },
    { id: 20, title: "数字孪生车间建模中支持物理碰撞检测的物理引擎包括（ ）。", type: '多选题', category: '仿真', score: 4, skillIds: ['s-007'] },
    { id: 21, title: "在卷积神经网络中，Pooling 池化层的主要作用包括（ ）。", type: '多选题', category: '编程基础', score: 3, skillIds: ['s-011', 's-012'] },
    { id: 22, title: "Labelme 工具导出的常用标注元数据保存格式为（ ）。", type: '单选题', category: '设计', score: 2, skillIds: ['s-016'] },
    { id: 23, title: "简要说明虚拟仿真实验中“事件驱动机制”的工作过程。", type: '简答题', category: '仿真', score: 5, skillIds: ['s-007'] },
    { id: 24, title: "Python 列表中向末尾追加多个元素的方法是（ ）。", type: '单选题', category: '编程基础', score: 2, skillIds: ['s-006'] },
    { id: 25, title: "标注数据质检验收（QA）合格率通常需达到的行业基准要求是（ ）。", type: '单选题', category: '设计', score: 3, skillIds: ['s-016'] },
    { id: 26, title: "三维物理仿真场景中光照渲染模型主要包含哪些分量？", type: '多选题', category: '仿真', score: 3, skillIds: ['s-007'] },
    { id: 27, title: "在深度学习模型训练中，学习率衰减（Learning Rate Decay）的作用是（ ）。", type: '单选题', category: '编程基础', score: 2, skillIds: ['s-004'] },
    { id: 28, title: "人机交互界面中关于“格式塔心理学”原则包括以下哪些？", type: '多选题', category: '设计', score: 4, skillIds: ['s-010'] },
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

  // 分页状态：支持配置分页大小（10、50、100、500）
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  const filteredQuestions = questions.filter(q => {
    if (searchTitle && !q.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;

    if (searchType && q.type !== searchType) return false;
    if (searchCategory && q.category !== searchCategory) return false;
    return true;
  });

  const totalCount = filteredQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // 当筛选条件或 pageSize 变更时校验并重置页码
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // 当前页切片数据
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 全选当前页逻辑
  const isCurrentPageAllSelected = paginatedQuestions.length > 0 && paginatedQuestions.every(q => selectedQuestions.includes(q.id));

  const handleSelectAllCurrentPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const idsToAdd = paginatedQuestions.map(q => q.id).filter(id => !selectedQuestions.includes(id));
      setSelectedQuestions(prev => [...prev, ...idsToAdd]);
    } else {
      const pageIds = paginatedQuestions.map(q => q.id);
      setSelectedQuestions(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectQuestion = (id: number) => {
    setSelectedQuestions(prev => prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]);
  };

  const handleBatchDelete = () => {
    setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
    setSelectedQuestions([]);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(prev => prev.filter(item => item.id !== id));
    setSelectedQuestions(prev => prev.filter(qId => qId !== id));
  };

  const handleMoveQuestion = (id: number, direction: 'up' | 'down') => {
    setQuestions(prev => {
      const idx = prev.findIndex(item => item.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const totalScore = filteredQuestions.reduce((sum, q) => sum + (q.score || 0), 0);

  const renderDocumentEditor = () => {
    const doc = taskDocuments[currentTask.id] || (currentType === 'experiment' ? taskDocuments['t-exp'] : taskDocuments['t-text']);

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col h-full">
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* 模式选择 Radio：在线编辑 vs 上传文档 */}
          <div className="flex items-center justify-between shrink-0 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-6">
              <label 
                className="flex items-center space-x-2 cursor-pointer select-none"
                onClick={() => setDocContentType('online')}
              >
                <input 
                  type="radio" 
                  name={`doc_mode_${currentTask.id}`} 
                  checked={docContentType === 'online'} 
                  onChange={() => setDocContentType('online')}
                  className="text-[#1890ff] focus:ring-[#1890ff] cursor-pointer" 
                />
                <span className={`text-sm font-medium transition-colors ${docContentType === 'online' ? 'text-[#1890ff]' : 'text-slate-600'}`}>
                  在线编辑
                </span>
              </label>
              <label 
                className="flex items-center space-x-2 cursor-pointer select-none"
                onClick={() => setDocContentType('upload')}
              >
                <input 
                  type="radio" 
                  name={`doc_mode_${currentTask.id}`} 
                  checked={docContentType === 'upload'} 
                  onChange={() => setDocContentType('upload')}
                  className="text-[#1890ff] focus:ring-[#1890ff] cursor-pointer" 
                />
                <span className={`text-sm font-medium transition-colors ${docContentType === 'upload' ? 'text-[#1890ff]' : 'text-slate-600'}`}>
                  上传文档
                </span>
                {doc && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
                    已上传
                  </span>
                )}
              </label>
            </div>

            {/* 当在上传文档模式且已有文档时，右上角提供快捷操作提示 */}
            {docContentType === 'upload' && doc && (
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>支持直接预览与下载指导书</span>
              </div>
            )}
          </div>
          
          {/* 在线编辑模式 */}
          {docContentType === 'online' ? (
            <div className="flex-1 border border-slate-200 rounded-lg flex flex-col min-h-0 overflow-hidden shadow-2xs">
              {/* Editor Toolbar */}
              <div className="h-11 border-b border-slate-200 flex items-center px-4 space-x-1.5 text-slate-500 shrink-0 bg-slate-50/80">
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Underline className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Strikethrough className="w-3.5 h-3.5" /></button>
                <div className="w-px h-4 bg-slate-300 mx-1.5"></div>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Heading className="w-3.5 h-3.5" /></button>
                <div className="w-px h-4 bg-slate-300 mx-1.5"></div>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><List className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><ListOrdered className="w-3.5 h-3.5" /></button>
                <div className="w-px h-4 bg-slate-300 mx-1.5"></div>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Code className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Image className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Link2 className="w-3.5 h-3.5" /></button>
                <div className="flex-1"></div>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Undo className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Redo className="w-3.5 h-3.5" /></button>
                <div className="w-px h-4 bg-slate-300 mx-1.5"></div>
                <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
              </div>
              
              {/* Split Editor Area */}
              <div className="flex-1 flex divide-x divide-slate-200 bg-white min-h-[220px]">
                <div className="flex-1 p-5 text-slate-500 text-xs focus:outline-none leading-relaxed overflow-y-auto" contentEditable suppressContentEditableWarning>
                  {currentType === 'experiment' ? (
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-2">【实验步骤】物联网交互与综合仿真实验</h3>
                      <p className="mb-2">一、实验准备：请在上方选择所需的实验环境（支持三维虚拟仿真与 Jupyter 交互编程）。</p>
                      <p className="mb-2">二、实验流程：启动环境后，根据评测要求完成接线、参数选型与时序联动测试。</p>
                      <p className="text-slate-400">（支持 Markdown 语法，可直接输入或复制实验指导书正文内容）</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-2">【教学内容】核心理论与知识点精讲</h3>
                      <p className="mb-2">在此输入图文课时正文，配合富文本排版、代码高亮与外链参考资料。</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5 bg-slate-50/40 text-slate-400 text-xs overflow-y-auto">
                  <div className="font-medium text-slate-400 mb-2">实时效果预览区</div>
                  <div className="p-3 bg-white rounded border border-slate-200 text-slate-600 text-xs">
                    内容将实时在此同步排版展示...
                  </div>
                </div>
              </div>
              
              {/* Editor Footer */}
              <div className="h-8 border-t border-slate-200 flex items-center justify-between px-4 text-xs text-slate-500 bg-slate-50/80 shrink-0">
                <span>字数：286</span>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <span>同步滚动</span>
                  <input type="checkbox" className="rounded-sm border-slate-300 text-slate-500 focus:ring-0 w-3 h-3 cursor-pointer" defaultChecked />
                </label>
              </div>
            </div>
          ) : (
            /* 上传文档模式（核心需求：上传后支持预览和下载） */
            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              {/* 隐藏的上传 input */}
              <input
                type="file"
                ref={docFileInputRef}
                onChange={handleDocFileUpload}
                accept=".pdf,.doc,.docx,.md,.markdown,.txt"
                className="hidden"
              />

              {doc ? (
                /* 已上传文档展示卡片（带有预览、下载、重传、删除） */
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                  <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-blue-50/40 via-white to-slate-50/50 shadow-xs flex items-center justify-between">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        doc.type === 'pdf' ? 'bg-red-50 text-red-600 border border-red-200' :
                        doc.type === 'word' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        doc.type === 'md' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-800 truncate" title={doc.name}>
                            {doc.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 shrink-0">
                            {doc.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                          <span>大小: {doc.size}</span>
                          <span>·</span>
                          <span>上传时间: {doc.uploadTime}</span>
                          <span>·</span>
                          <span className="text-emerald-600 font-medium flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> 已就绪
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮组：预览、下载、重新上传、删除 */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {/* 预览按钮 */}
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewingDoc(doc);
                          setPreviewPage(1);
                          setPreviewZoom(100);
                        }}
                        className="px-3.5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                        title="在线预览文档全文"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>预览文档</span>
                      </button>

                      {/* 下载按钮 */}
                      <button
                        type="button"
                        onClick={() => handleDownloadDocument(doc)}
                        className="px-3.5 py-1.5 border border-[#1890ff] text-[#1890ff] hover:bg-blue-50/60 bg-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="下载文档至本地"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>下载</span>
                      </button>

                      {/* 重新上传 */}
                      <button
                        type="button"
                        onClick={() => docFileInputRef.current?.click()}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        重新上传
                      </button>

                      {/* 删除 */}
                      <button
                        type="button"
                        onClick={() => {
                          setTaskDocuments(prev => {
                            const updated = { ...prev };
                            delete updated[currentTask.id];
                            if (currentType === 'experiment') delete updated['t-exp'];
                            if (currentType === 'text') delete updated['t-text'];
                            return updated;
                          });
                          showModalToast(`已移除当前上传的文档`);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="删除当前文档"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 内嵌预览概览视窗 (Inline Document Preview Window) */}
                  <div className="flex-1 border border-slate-200 rounded-xl bg-slate-50/40 p-4 flex flex-col min-h-[220px] overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>文档内容快速速览</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewingDoc(doc);
                          setPreviewPage(1);
                          setPreviewZoom(100);
                        }}
                        className="text-xs text-[#1890ff] hover:underline flex items-center cursor-pointer"
                      >
                        <span>打开全屏高保真阅读器</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </button>
                    </div>

                    {/* 速览纸张排版容器 */}
                    <div className="flex-1 bg-white rounded-lg border border-slate-200/80 p-5 overflow-y-auto text-xs space-y-3 leading-relaxed shadow-2xs">
                      <div className="text-center pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">{doc.name.replace(/\.[^/.]+$/, '')}</h3>
                        <p className="text-[11px] text-slate-400 mt-1">教学步骤指导文件 · 正文解析已完成</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">【第一部分：实训目标与背景】</h4>
                        <p className="text-slate-600">本步骤重点针对当前阶段核心技能点进行强化训练，学生需在规定时间内按序完成各项指导规程并提交结果。</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">【第二部分：实验环境配置与启动参数】</h4>
                        <p className="text-slate-600">依赖镜像已集成在云端实训平台中，学生启动后系统将自动挂载判分脚本，所有实验控制台输出与事件将由自动评测引擎捕获。</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">【第三部分：考核评价准则】</h4>
                        <p className="text-slate-600">实验评测采用细粒度规则断言机制，完成接线、阈值校准及测试用例跑通后将自动输出各能力项雷达图分析报告。</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 尚未上传文档：展示大方整洁的拖拽上传区域 */
                <div 
                  onClick={() => docFileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-slate-300 hover:border-[#1890ff] bg-slate-50/50 hover:bg-blue-50/30 rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group min-h-[260px]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1890ff] group-hover:bg-[#1890ff] group-hover:text-white flex items-center justify-center mb-3.5 transition-colors shadow-xs">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    点击或拖拽上传教学文档
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mb-3">
                    上传后学生端可直接阅读指导书，并支持一键在线预览与下载
                  </p>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-400">
                    <span>支持格式：PDF、Word (.doc/.docx)、Markdown (.md)、TXT</span>
                    <span>·</span>
                    <span>单文件 ≤ 50MB</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-[85vw] h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden select-none relative"
      >
        {/* 步骤编辑弹窗内部轻量 Toast */}
        {modalToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-1.5 animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{modalToast}</span>
          </div>
        )}

        {/* Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 bg-slate-50/50">
          <div className="flex items-center">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="mr-4 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded transition-colors"
            >
              <List className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              编辑步骤
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
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
                transition={{ duration: isResizing ? 0 : 0.2 }} // Disable animation while resizing for smooth dragging
                className="border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden shrink-0 relative"
              >
                <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0 flex flex-col gap-3">
                  <h4 className="font-bold text-slate-700 flex items-center text-sm truncate">
                    <Book className="w-4 h-4 mr-2 text-[#1890ff] shrink-0" />
                    <span className="truncate">{courseName || '未命名课程'}</span>
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-[#1890ff]">
                    <button onClick={expandAll} className="hover:text-blue-700 font-medium">全部展开</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={collapseAll} className="hover:text-blue-700 font-medium">全部收起</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {chapters.map(chapter => {
                    const isExpanded = expandedChapters.includes(chapter.id);
                    return (
                    <div key={chapter.id}>
                      <div 
                        onClick={() => toggleChapter(chapter.id)}
                        className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-200/50 rounded cursor-pointer group"
                      >
                        <span className="font-bold text-slate-700 text-xs truncate">{chapter.title}</span>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-1 pl-2 space-y-1">
                          {chapter.tasks.map(t => {
                            const isCurrent = t.id === currentTask.id;
                            return (
                              <div 
                                key={t.id}
                                onClick={() => {
                                  setCurrentTask({ ...t, chapterName: chapter.title });
                                  setTaskTitle(t.title);
                                }}
                                className={`flex items-center justify-between py-1.5 px-2 rounded cursor-pointer text-xs transition-colors ${
                                  isCurrent 
                                    ? 'bg-[#1890ff]/10 text-[#1890ff] font-medium' 
                                    : 'text-slate-600 hover:bg-slate-200/50'
                                }`}
                              >
                                <span className="truncate flex-1 pr-2">{t.title}</span>
                                {t.type && typeConfig[t.type] && (
                                  <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] shrink-0 border ${typeConfig[t.type].color}`}>
                                    {typeConfig[t.type].label}
                                  </span>
                                )}
                              </div>
                            );
                          })}
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
            <div className="p-8 border-b border-slate-200 bg-white shrink-0">
              <div className="mb-6 text-sm text-slate-500 flex items-center">
                <Box className="w-4 h-4 mr-2" />
                {courseName || '未命名课程'} <ChevronRight className="w-4 h-4 mx-1" /> {currentTask.chapterName || '未命名章节'}
              </div>
              <div className="grid grid-cols-2 gap-8 max-w-4xl">
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span> 步骤名称
                  </label>
                  <div className="relative">
                    <input 
                      key={currentTask.id}
                      type="text" 
                      value={taskTitle}
                      onChange={(e) => {
                        setTaskTitle(e.target.value);
                        setCurrentTask(prev => ({ ...prev, title: e.target.value }));
                      }}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890ff]/20 focus:border-[#1890ff] text-sm bg-slate-50 hover:bg-white transition-colors"
                    />
                    <span className="absolute right-3 top-3 text-xs text-slate-400">{currentTask.title.length} / 50</span>
                  </div>
                </div>
                
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
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
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890ff]/20 focus:border-[#1890ff] text-sm appearance-none bg-slate-50 hover:bg-white transition-colors"
                    >
                      <option value="text">图文</option>
                      <option value="video">视频</option>
                      <option value="exercise">习题</option>
                      <option value="experiment">实验</option>
                      <option value="report">报告</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs & Content */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
              <div className="flex px-8 border-b border-slate-200 pt-4 bg-white shrink-0 items-center overflow-hidden relative">
                <div className="flex space-x-6 flex-1 overflow-x-auto hide-scrollbar">
                  {/* Required Tabs - Always First */}
                  {currentType === 'exercise' && (
                    <button
                      onClick={() => setActiveTab('exercise_settings')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'exercise_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>习题设置</span>
                    </button>
                  )}
                  {currentType === 'experiment' && (
                    <button
                      onClick={() => setActiveTab('experiment_settings')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'experiment_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>实验设置</span>
                    </button>
                  )}
                  {currentType === 'video' && (
                    <button
                      onClick={() => setActiveTab('video_settings')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'video_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>视频设置</span>
                    </button>
                  )}
                  {currentType === 'text' && (
                    <button
                      onClick={() => setActiveTab('text_settings')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'text_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>图文设置</span>
                    </button>
                  )}
                  {currentType === 'report' && (
                    <button
                      onClick={() => setActiveTab('report_settings')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'report_settings' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <span className="flex items-center"><span className="text-red-500 mr-1">*</span>报告设置</span>
                    </button>
                  )}

                  {/* Optional Tabs */}
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'description' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    步骤说明 <span className="text-xs text-slate-400 font-normal ml-1">(选填)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('instruction_config')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'instruction_config' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    指令配置 <span className="text-xs text-slate-400 font-normal ml-1">(选填)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('skill_config')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'skill_config' ? 'border-[#1890ff] text-[#1890ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    技能点配置 <span className="text-xs text-slate-400 font-normal ml-1">(选填)</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'description' && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6 flex flex-col h-full"
                    >
                      <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                        {/* Rich Text Toolbar Mock */}
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
                          <div className="flex-1"></div>
                          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Undo className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Redo className="w-4 h-4" /></button>
                          <div className="w-px h-5 bg-slate-300 mx-2"></div>
                          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Eye className="w-4 h-4" /></button>
                        </div>
                        {/* Editor Area */}
                        <div className="flex-1 p-6 text-slate-400 bg-white focus:outline-none" contentEditable suppressContentEditableWarning>
                          请输入步骤说明内容...
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
                      className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm min-h-[400px] flex flex-col items-center justify-center h-full"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-50 text-[#1890ff] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Cpu className="w-8 h-8" />
                        </div>
                        <h4 className="text-slate-700 font-medium mb-2 text-lg">配置 AI 技能助手指令</h4>
                        <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">通过配置指令，您可以让 AI 助手在当前步骤中提供特定的帮助或自动化任务。</p>
                        <button className="px-6 py-2.5 bg-[#1890ff] text-white rounded-lg text-sm hover:bg-blue-600 shadow-sm shadow-blue-200 transition-colors font-medium">
                          添加指令
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
                                                  onChange={() => {}}
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
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-100 rounded text-blue-600 transition-opacity cursor-pointer"
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
                            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
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
                                          checked={cat.skills.length > 0 && cat.skills.every(s => rightCheckedSkillIds.includes(s.id))}
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
                                                  onChange={() => {}}
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
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-opacity cursor-pointer"
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
                      className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full"
                    >
                      {/* Top Actions */}
                      <div className="flex flex-col mb-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 bg-[#1890ff] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200/50">
                              新建题目
                            </button>
                            <button className="px-4 py-2 bg-white border border-[#1890ff] text-[#1890ff] rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                              从题库导入
                            </button>
                            {/* 一键 AI 批量关联题目技能点 */}
                            <button
                              type="button"
                              onClick={handleAiBatchAssociateQuestions}
                              disabled={isAiBatchAssociating}
                              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-95 text-white rounded text-sm font-medium transition-all shadow-sm shadow-indigo-200 flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                              title={selectedQuestions.length > 0 ? `使用 AI 为选中的 ${selectedQuestions.length} 道习题自动匹配关联专业技能点` : '勾选习题后使用 AI 一键批量关联'}
                            >
                              <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAiBatchAssociating ? 'animate-spin' : ''}`} />
                              <span>{isAiBatchAssociating ? 'AI批量分析中...' : '一键AI智能关联'}</span>
                            </button>
                            {selectedQuestions.length > 0 && (
                              <button onClick={handleBatchDelete} className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded text-sm font-medium hover:bg-red-50 transition-colors">
                                批量删除 ({selectedQuestions.length})
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                              <span className="text-slate-600 mr-6">总分数： <span className="text-red-500 font-bold text-lg mx-1">{totalScore}</span> 分</span>
                              <span className="text-slate-600">评分项个数： <span className="text-red-500 font-bold text-lg mx-1">{totalCount}</span> 个</span>
                            </div>
                            <button 
                              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)} 
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                              title={isFiltersExpanded ? "收起设置" : "展开设置"}
                            >
                              {isFiltersExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Search and Filters */}
                        <AnimatePresence>
                          {isFiltersExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                              animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
                              exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col space-y-4"
                            >
                              <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="flex-1">
                                  <input 
                                    type="text" 
                                    placeholder="按题干搜索..." 
                                    value={searchTitle}
                                    onChange={(e) => {
                                      setSearchTitle(e.target.value);
                                      setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1890ff] text-sm"
                                  />
                                </div>
                                <div className="w-48">
                                  <select 
                                    value={searchType}
                                    onChange={(e) => {
                                      setSearchType(e.target.value);
                                      setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1890ff] text-sm bg-white cursor-pointer"
                                  >
                                    <option value="">全部题型</option>
                                    <option value="单选题">单选题</option>
                                    <option value="多选题">多选题</option>
                                    <option value="简答题">简答题</option>
                                  </select>
                                </div>
                                <div className="w-48">
                                  <select 
                                    value={searchCategory}
                                    onChange={(e) => {
                                      setSearchCategory(e.target.value);
                                      setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1890ff] text-sm bg-white cursor-pointer"
                                  >
                                    <option value="">全部分类</option>
                                    <option value="编程基础">编程基础</option>
                                    <option value="仿真">仿真</option>
                                    <option value="设计">设计</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex items-center mt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={requireAllAnswered}
                                    onChange={(e) => setRequireAllAnswered(e.target.checked)}
                                    className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff]"
                                  />
                                  <span className="text-sm text-slate-700">要求全部答题才能提交</span>
                                </label>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Table */}
                      <div className="border border-slate-200 rounded overflow-hidden flex-1 flex flex-col min-h-0">
                        <div className="grid grid-cols-[40px_50px_1fr_200px_90px_90px_90px_130px] gap-2.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 shrink-0 text-xs">
                          <div className="flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={isCurrentPageAllSelected}
                              onChange={handleSelectAllCurrentPage}
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
                          {paginatedQuestions.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-sm">
                              暂无符合条件的习题
                            </div>
                          ) : (
                            paginatedQuestions.map((q, index) => {
                              const absoluteIndex = (currentPage - 1) * pageSize + index;
                              const isFirst = absoluteIndex === 0;
                              const isLast = absoluteIndex === totalCount - 1;
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
                                <div key={q.id} className="grid grid-cols-[40px_50px_1fr_200px_90px_90px_90px_130px] gap-2.5 px-4 py-2.5 items-center hover:bg-blue-50/30 transition-colors text-xs">
                                  <div className="flex items-center justify-center">
                                    <input 
                                      type="checkbox" 
                                      checked={selectedQuestions.includes(q.id)}
                                      onChange={() => handleSelectQuestion(q.id)}
                                      className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff]" 
                                    />
                                  </div>
                                  <div className="flex items-center justify-center font-medium text-slate-400">
                                    {absoluteIndex + 1}
                                  </div>
                                  <div className="text-slate-700 font-medium truncate pr-2" title={q.title}>
                                    {q.title}
                                  </div>

                                  {/* 关联技能点列：下拉选择框与树形多选 */}
                                  <div className="relative">
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveQuestionDropdownId(isDropdownOpen ? null : q.id);
                                        setQuestionSkillSearchText('');
                                      }}
                                      className={`min-h-[28px] px-2 py-1 bg-white border rounded-lg flex items-center justify-between cursor-pointer transition-all shadow-2xs group ${
                                        isDropdownOpen 
                                          ? 'border-blue-500 ring-2 ring-blue-100' 
                                          : 'border-slate-200 hover:border-blue-400'
                                      }`}
                                    >
                                      <div className="flex-1 truncate mr-1">
                                        {qSkillIds.length === 0 ? (
                                          <span className="text-slate-400 text-[11px] select-none">请选择</span>
                                        ) : (
                                          <div className="flex items-center space-x-1 truncate">
                                            <span className="inline-flex items-center px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] rounded font-medium truncate max-w-[120px]">
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

                                    {/* 下拉树选择器 */}
                                    {isDropdownOpen && (
                                      <div 
                                        ref={questionDropdownRef}
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-full left-0 mt-1 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2.5 text-xs animate-fadeIn"
                                      >
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

                                        <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-slate-100 rounded-lg p-1.5 bg-slate-50/30 select-none">
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
                                                      <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded text-[10px] font-bold shrink-0">
                                                        分类
                                                      </span>
                                                    </div>

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
                                                                  : 'hover:bg-slate-100/60 text-slate-600'
                                                              }`}
                                                            >
                                                              <input
                                                                type="checkbox"
                                                                checked={isSkillChecked}
                                                                onChange={() => {}}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                                                              />
                                                              <span className="font-mono text-slate-400 text-[10px]">{skill.code}</span>
                                                              <span className="truncate flex-1">{skill.name}</span>
                                                              <span className="px-1.5 py-0.2 bg-[#52c41a] text-white rounded text-[10px] font-medium shrink-0">
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
                                      </div>
                                    )}
                                  </div>

                                  <div className="text-slate-500">{q.type}</div>
                                  <div className="text-slate-500">{q.category}</div>
                                  <div className="flex items-center">
                                    <div className="flex items-center border border-slate-200 rounded overflow-hidden w-20">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, score: Math.max(1, (item.score || 1) - 1) } : item));
                                        }}
                                        className="px-1.5 py-1 bg-slate-50 text-slate-400 hover:text-[#1890ff] hover:bg-blue-50 border-r border-slate-200 transition-colors cursor-pointer"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <input type="text" value={q.score} readOnly className="w-full text-center text-xs outline-none bg-white py-1 font-medium text-slate-700" />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, score: (item.score || 0) + 1 } : item));
                                        }}
                                        className="px-1.5 py-1 bg-slate-50 text-slate-400 hover:text-[#1890ff] hover:bg-blue-50 border-l border-slate-200 transition-colors cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 text-[#1890ff]">
                                    <button className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" title="编辑"><ExternalLink className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50" title="删除"><X className="w-3.5 h-3.5" /></button>
                                    <button 
                                      onClick={() => handleMoveQuestion(q.id, 'up')} 
                                      className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" 
                                      title="上移" 
                                      disabled={isFirst}
                                    >
                                      <ArrowUp className={`w-3.5 h-3.5 ${isFirst ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`} />
                                    </button>
                                    <button 
                                      onClick={() => handleMoveQuestion(q.id, 'down')} 
                                      className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" 
                                      title="下移" 
                                      disabled={isLast}
                                    >
                                      <ArrowDown className={`w-3.5 h-3.5 ${isLast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      
                      {/* Pagination: 支持配置分页大小（10、50、100、500） */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 shrink-0 text-xs text-slate-500">
                        {/* 左侧：条数统计与下拉选择分页大小 */}
                        <div className="flex items-center space-x-3">
                          <span>
                            共 <span className="text-slate-800 font-semibold">{totalCount}</span> 条
                          </span>

                          <div className="relative flex items-center">
                            <select
                              value={pageSize}
                              onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                              className="appearance-none pl-2.5 pr-6 py-1 bg-white border border-slate-200 rounded text-slate-700 text-xs outline-none hover:border-[#1890ff] focus:border-[#1890ff] transition-colors cursor-pointer"
                            >
                              <option value={10}>10条/页</option>
                              <option value={50}>50条/页</option>
                              <option value={100}>100条/页</option>
                              <option value={500}>500条/页</option>
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
                            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white hover:border-[#1890ff] hover:text-[#1890ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-500 cursor-pointer"
                            title="上一页"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* 页码序列 */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[28px] h-7 px-2 flex items-center justify-center rounded text-xs transition-colors cursor-pointer ${
                                currentPage === pageNum
                                  ? 'border border-[#1890ff] bg-[#1890ff] text-white font-medium shadow-xs'
                                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[#1890ff] hover:text-[#1890ff]'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}

                          {/* 下一页 */}
                          <button
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage >= totalPages}
                            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white hover:border-[#1890ff] hover:text-[#1890ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-500 cursor-pointer"
                            title="下一页"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {/* 前往 N 页 */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const p = parseInt(jumpPageInput, 10);
                              if (!isNaN(p) && p >= 1 && p <= totalPages) {
                                setCurrentPage(p);
                              }
                              setJumpPageInput('');
                            }}
                            className="flex items-center space-x-1 pl-2 text-slate-500 text-xs"
                          >
                            <span>前往</span>
                            <input
                              type="text"
                              value={jumpPageInput}
                              onChange={(e) => setJumpPageInput(e.target.value.replace(/\D/g, ''))}
                              placeholder={String(currentPage)}
                              className="w-10 h-7 text-center border border-slate-200 rounded outline-none focus:border-[#1890ff] text-xs text-slate-700 bg-white"
                            />
                            <span>页</span>
                          </form>
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
                      className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full overflow-y-auto space-y-6"
                    >
                      <div className="flex space-x-12 shrink-0">
                        <div className="flex-1 space-y-3">
                          <label className="text-sm font-medium text-slate-700 block">实验资源 <span className="text-slate-400 font-normal">（添加实验包、jupyter文档、代码包、数据集等资源）：</span></label>
                          <button 
                            type="button"
                            onClick={() => docFileInputRef.current?.click()}
                            className="px-4 py-2 border border-[#1890ff] text-[#1890ff] rounded bg-white hover:bg-blue-50 transition-colors text-sm font-medium cursor-pointer"
                          >
                            上传资源
                          </button>
                        </div>
                        <div className="flex-1 space-y-3">
                          <label className="text-sm font-medium text-slate-700 block">实验环境</label>
                          <div className="flex items-center space-x-3">
                            <div className="relative flex-1 max-w-xs">
                              <select className="w-full px-3 py-2 border border-slate-200 rounded text-sm appearance-none bg-white text-slate-500 focus:outline-none focus:border-[#1890ff]">
                                <option>请选择实验环境进行关联</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            <button type="button" className="px-4 py-2 border border-[#1890ff] text-[#1890ff] rounded bg-white hover:bg-blue-50 transition-colors whitespace-nowrap text-sm font-medium cursor-pointer">添加实验环境</button>
                          </div>
                        </div>
                      </div>

                      {/* 下半部分：实验指导书正文（与教师端一致，支持在线编辑与上传文档，支持在线预览与下载） */}
                      <div className="space-y-3 flex-1 flex flex-col min-h-[360px]">
                        <label className="text-sm font-medium text-slate-700 block">实验指导书正文</label>
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
                      className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm h-full"
                    >
                      <div className="space-y-8 max-w-4xl mx-auto pt-6">
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-slate-700 block">视频类别</label>
                          <div className="relative w-96">
                            <select className="w-full px-4 py-2.5 border border-[#1890ff] rounded bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1890ff]/20 appearance-none shadow-sm">
                              <option>上传视频</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-slate-700 block">视频链接</label>
                          <div className="border border-blue-200 border-dashed rounded-xl bg-blue-50/30 py-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/60 transition-colors relative group overflow-hidden">
                            <div className="absolute inset-0 bg-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <div className="w-16 h-16 bg-[#1890ff] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-200 relative z-10">
                              <UploadCloud className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-slate-700 font-medium mb-3 text-lg relative z-10">点击或拖拽上传视频</p>
                            <p className="text-slate-400 text-sm relative z-10">支持 MP4, WebM, FLV 格式，最大 2GB</p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="text-sm font-medium text-slate-700 block mb-3">视频播放地址 (URL)</label>
                          <div className="flex items-stretch shadow-sm">
                            <div className="flex-1 border border-slate-200 rounded-l flex items-center bg-slate-50 px-4 py-2.5 text-sm text-slate-400 focus-within:bg-white focus-within:border-[#1890ff] focus-within:ring-1 focus-within:ring-[#1890ff] transition-all">
                              <Link2 className="w-4 h-4 mr-3 shrink-0" />
                              <input type="text" placeholder="请上传或输入视频播放地址" className="bg-transparent border-none outline-none w-full text-slate-700" />
                            </div>
                            <button className="px-6 py-2.5 border-y border-r border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors text-sm flex items-center font-medium shrink-0">
                              <Copy className="w-4 h-4 mr-2" /> 复制
                            </button>
                            <button className="px-6 py-2.5 border border-slate-200 rounded-r ml-2 bg-white text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium shrink-0">
                              预览
                            </button>
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
        <div className="h-20 border-t border-slate-200 flex items-center justify-end px-8 bg-slate-50 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors mr-4 shadow-sm">
            取消
          </button>
          <button className="px-8 py-2.5 bg-[#1890ff] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200">
            保存
          </button>
        </div>
      </motion.div>

      {/* 全屏高保真文档阅读预览弹窗（核心功能：上传文档后支持在线预览和下载） */}
      <AnimatePresence>
        {previewingDoc && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-[92vw] max-w-5xl h-[90vh] bg-slate-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* 顶部工具栏 */}
              <div className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    previewingDoc.type === 'pdf' ? 'bg-red-50 text-red-600' :
                    previewingDoc.type === 'word' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-800 truncate max-w-md">
                      {previewingDoc.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      文档在线预览器 · 格式：{previewingDoc.type.toUpperCase()} · 大小：{previewingDoc.size}
                    </p>
                  </div>
                </div>

                {/* 控制器：翻页与缩放 */}
                <div className="flex items-center space-x-4">
                  {/* 翻页 */}
                  <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      disabled={previewPage <= 1}
                      onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                      className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-600 font-medium px-2">第 {previewPage} / 3 页</span>
                    <button
                      type="button"
                      disabled={previewPage >= 3}
                      onClick={() => setPreviewPage(p => Math.min(3, p + 1))}
                      className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 缩放 */}
                  <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(z => Math.max(70, z - 10))}
                      className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-600 font-medium px-1.5 w-12 text-center">{previewZoom}%</span>
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(z => Math.min(150, z + 10))}
                      className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 右侧：下载与关闭 */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadDocument(previewingDoc)}
                    className="px-3.5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下载文档</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewingDoc(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 预览纸张内容展示区（仿 PDF 纸张仿真排版） */}
              <div className="flex-1 min-h-0 overflow-auto p-8 flex justify-center bg-slate-200/70">
                <div 
                  className="bg-white shadow-xl rounded-lg p-12 w-[720px] min-h-[960px] text-slate-800 transition-all space-y-6 shrink-0 border border-slate-200 relative"
                  style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}
                >
                  {/* 页眉 */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-[11px] text-slate-400">
                    <span>高等院校工程与实验实训教学规范指导书</span>
                    <span>编号：EXP-GUIDE-2026</span>
                  </div>

                  {/* 页面内容（按页码动态切换） */}
                  {previewPage === 1 && (
                    <div className="space-y-6">
                      <div className="text-center pt-4 pb-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          {previewingDoc.name.replace(/\.[^/.]+$/, '')}
                        </h2>
                        <p className="text-xs text-slate-500 mt-2">
                          课程：{courseName || '专业核心实训课程'} · 适用版本 2026-V1.0
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-blue-700 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                          一、实验目的与教学要求
                        </h3>
                        <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                          <li>掌握实验环境的拓扑设计原则与端到端协同通信机理。</li>
                          <li>严格遵循规范进行设备选型、引脚接线与控制参数整定。</li>
                          <li>通过自动化评测引擎校验系统在稳态和瞬态工况下的可靠性指标。</li>
                          <li>培养学生面对实际工程异常时的排查、定位与综合分析解决能力。</li>
                        </ul>
                      </div>

                      <div className="space-y-3 pt-3">
                        <h3 className="text-sm font-bold text-blue-700 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                          二、实验软硬件实训拓扑准备
                        </h3>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
                          <div className="flex items-center justify-between font-semibold text-slate-800">
                            <span>运行镜像与平台</span>
                            <span className="text-emerald-600 font-normal">已完成云端容器预置</span>
                          </div>
                          <p>本实验依托轻量化云端容器，内置 Python 交互式编程环境与三维虚拟仿真引擎，支持双向实时事件通信与遥测数据持久化。</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewPage === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-blue-700 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                          三、关键实验步骤与指令规范
                        </h3>
                        <div className="space-y-3 text-xs text-slate-600">
                          <div className="p-3 bg-slate-50 rounded border border-slate-200">
                            <div className="font-bold text-slate-800 mb-1">步骤 1：建立通信信道与握手测试</div>
                            <p>在仿真控制面板中启动虚拟目标机服务，监听端口 1883，确认 MQTT 客户端成功收到心跳回执包。</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded border border-slate-200">
                            <div className="font-bold text-slate-800 mb-1">步骤 2：端子连线与物理量采样校验</div>
                            <p>按引脚定义表连接模拟量传感器输入端子，调整采样频率至 100Hz，观察波形是否平稳无毛刺。</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded border border-slate-200">
                            <div className="font-bold text-slate-800 mb-1">步骤 3：超温超压工况安全联锁响应测试</div>
                            <p>人为注入过载故障信号，断言联锁机构在 200ms 内正确触发切断，并生成报警事件日志。</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewPage === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-blue-700 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                          四、考核评分要点与注意事项
                        </h3>
                        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                          <p>1. 实验评分规则将在学生提交实验时由评测引擎自动运行打分并生成能力雷达图诊断报告。</p>
                          <p>2. 切勿修改默认的容器端口映射与测试断言脚本，否则可能导致自动化测试执行失败。</p>
                          <p>3. 实验完成后请及时点击保存配置并下载本次实验报告留存归档。</p>
                        </div>
                      </div>

                      <div className="mt-12 p-4 bg-blue-50/50 rounded-xl border border-blue-200 text-center text-xs text-blue-800">
                        —— 本教学步骤指导文档完，支持随时在线复习与下载 ——
                      </div>
                    </div>
                  )}

                  {/* 页脚 */}
                  <div className="absolute bottom-6 left-12 right-12 flex items-center justify-between pt-3 border-t border-slate-200 text-[11px] text-slate-400">
                    <span>文档安全等级：校内实训公开</span>
                    <span>第 {previewPage} 页 / 共 3 页</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
