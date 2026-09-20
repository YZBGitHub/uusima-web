import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  Book,
  Layout,
  Edit3,
  Plus,
  Cpu,
  ChevronDown,
  ChevronRight,
  Target,
  Check,
  Save,
  Trash2,
  CheckCircle2,
  Search,
  ExternalLink,
  Download,
  Upload,
  Bot,
  Sparkles,
  Database,
  FileText,
  FolderPlus,
  Network,
  Share2,
  PieChart,
  GitFork,
  X,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';
import TeacherStepEditorModal, { TeacherTask, TeacherChapter } from './TeacherStepEditorModal';
import SkillGraphImportModals, { ImportType } from './SkillGraphImportModal';
import TeacherAiAssistantSection from './TeacherAiAssistantSection';

interface TeacherCourseEditorProps {
  course: {
    id: number;
    title: string;
    category?: string;
    desc?: string;
    time?: string;
    type?: string;
    bannerText?: string;
    bannerSub?: string;
    gradient?: string;
    theme?: string;
    isCustom?: boolean;
  };
  onBack: () => void;
  onUpdateCourse?: (updatedCourse: any) => void;
}

// 截图一中的 7 种课程类型
const COURSE_TYPES = [
  '岗位技能认证',
  '基础通识',
  '专业基础课',
  '专业核心课',
  '行业应用课',
  '技能课程',
  '岗位认证课'
];

export default function TeacherCourseEditor({ course, onBack, onUpdateCourse }: TeacherCourseEditorProps) {
  const [activeMenu, setActiveMenu] = useState('chapters');
  const [editingTask, setEditingTask] = useState<TeacherTask | null>(null);
  const [courseTitle, setCourseTitle] = useState(course.title || '自建特色课程');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // 1. 课程类型状态（截图一中的7种之一，默认取传入的category或专业核心课）
  const [selectedType, setSelectedType] = useState<string>(
    COURSE_TYPES.includes(course.category || '') ? (course.category as string) : '专业核心课'
  );

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // 3. 侧边栏菜单（已去除课程设置，AI助学助教改成AI技能助手，能力图谱改成技能图谱）
  const sidebarMenu = [
    { id: 'info', label: '基本信息', icon: Book },
    { id: 'chapters', label: '课程章节', icon: Layout },
    { id: 'ai', label: 'AI技能助手', icon: Cpu },
    { id: 'graph', label: '技能图谱', icon: Target },
  ];

  // 章节与教学任务步骤数据（2. 已完全去除试学）
  const [chapters, setChapters] = useState<TeacherChapter[]>([
    {
      id: 1,
      title: '第一章：课程导引与项目基础环境配置',
      tasks: [
        { id: '1-1', title: '1-1 教学导引：理论基础与核心概念导读（图文）', type: 'text' },
        { id: '1-2', title: '1-2 名师精讲：工程架构与设计思路（视频）', type: 'video' },
        { id: '1-3', title: '1-3 知识自测：核心知识点随堂习题（习题）', type: 'exercise' },
        { id: '1-4', title: '1-4 综合实训：开发环境搭建与上机实战（实验）', type: 'experiment' },
        { id: '1-5', title: '1-5 实验报告：撰写与上交阶段性实训成果（报告）', type: 'report' },
      ]
    },
    {
      id: 2,
      title: '第二章：核心业务模块开发与算法调优',
      tasks: [
        { id: '2-1', title: '2-1 架构解析：核心功能代码精读与逻辑剖析（图文）', type: 'text' },
        { id: '2-2', title: '2-2 动手实训：主干业务实现与在线调试（实验）', type: 'experiment' },
        { id: '2-3', title: '2-3 技能考核：模块综合能力测评（习题）', type: 'exercise' },
      ]
    }
  ]);

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const typeConfig: Record<string, { label: string, color: string }> = {
    text: { label: '图文', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    video: { label: '视频', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
    exercise: { label: '习题', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    experiment: { label: '实验', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    report: { label: '报告', color: 'bg-purple-100 text-purple-600 border-purple-200' }
  };

  // 新增章节
  const handleAddChapter = () => {
    const nextId = chapters.length + 1;
    const newChapter: TeacherChapter = {
      id: Date.now(),
      title: `第${nextId}章：新建自建教学单元`,
      tasks: [
        {
          id: `${nextId}-1`,
          title: `${nextId}-1 单元概述与预习指引（图文）`,
          type: 'text'
        }
      ]
    };
    setChapters([...chapters, newChapter]);
    showToast('已成功添加新章节！');
  };

  // 批量删除章节任务
  const handleBatchDeleteTasks = () => {
    if (selectedTaskIds.length === 0) {
      alert('请先勾选需要删除的任务步骤');
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedTaskIds.length} 个任务步骤吗？`)) {
      setChapters(prev => prev.map(c => ({
        ...c,
        tasks: c.tasks.filter(t => !selectedTaskIds.includes(t.id))
      })));
      setSelectedTaskIds([]);
      showToast('已批量删除选中的步骤');
    }
  };

  // 任务步骤更新回调
  const handleSaveTaskStep = (updatedTask: TeacherTask) => {
    setChapters(prev => prev.map(c => ({
      ...c,
      tasks: c.tasks.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t)
    })));
    showToast(`已更新步骤《${updatedTask.title}》！`);
  };

  // -------------------------------------------------------------
  // 4. AI技能助手 状态与配置
  // -------------------------------------------------------------
  const [aiSubTab, setAiSubTab] = useState<'assistant' | 'kb'>('assistant');
  const [selectedKbIds, setSelectedKbIds] = useState<string[]>(['kb-1', 'kb-2']);
  const [kbSearchKeyword, setKbSearchKeyword] = useState('');

  // 知识库文件类型定义
  interface KnowledgeBaseFile {
    id: string;
    name: string;
    size: string;
    uploadTime: string;
    status: '已向量化' | '解析中' | '已就绪';
  }

  interface TeacherKnowledgeBaseItem {
    id: string;
    name: string;
    docsCount: number;
    chunksCount?: number;
    updateTime: string;
    desc: string;
    files: KnowledgeBaseFile[];
  }

  const [knowledgeBases, setKnowledgeBases] = useState<TeacherKnowledgeBaseItem[]>([
    {
      id: 'kb-1',
      name: '深度学习核心算法与原理问答库',
      docsCount: 4,
      updateTime: '2026-09-15 14:20:00',
      desc: '包含损失函数、反向传播与优化器理论答疑',
      files: [
        { id: 'f-101', name: '深度学习理论基础与反向传播推导.pdf', size: '4.2 MB', uploadTime: '2026-09-15 14:18:22', status: '已向量化' },
        { id: 'f-102', name: '常用梯度下降优化器对比分析(Adam_SGD).docx', size: '1.8 MB', uploadTime: '2026-09-15 14:19:05', status: '已向量化' },
        { id: 'f-103', name: '深度前馈网络过拟合抑制手段与Dropout原理.md', size: '320 KB', uploadTime: '2026-09-15 14:20:00', status: '已向量化' },
        { id: 'f-104', name: '卷积神经网络CNN核心算子速查手册.pdf', size: '5.6 MB', uploadTime: '2026-09-14 10:11:30', status: '已向量化' }
      ]
    },
    {
      id: 'kb-2',
      name: 'TensorFlow与PyTorch实训工程排错集',
      docsCount: 3,
      updateTime: '2026-09-12 11:30:15',
      desc: '学生实验常见环境安装报错、张量维度不匹配解决方案',
      files: [
        { id: 'f-201', name: 'CUDA与cuDNN驱动版本对应及常见报错FAQ.docx', size: '2.1 MB', uploadTime: '2026-09-12 11:20:00', status: '已向量化' },
        { id: 'f-202', name: 'PyTorch多GPU分布式训练排查指南.md', size: '540 KB', uploadTime: '2026-09-12 11:25:40', status: '已向量化' },
        { id: 'f-203', name: 'Tensor张量维度广播与自动求导踩坑汇总.pdf', size: '3.8 MB', uploadTime: '2026-09-12 11:30:15', status: '已向量化' }
      ]
    },
    {
      id: 'kb-3',
      name: '校本特色实训指导大纲与作业规范',
      docsCount: 3,
      updateTime: '2026-09-08 09:10:00',
      desc: '实训考查评分标准、报告模板与代码规范',
      files: [
        { id: 'f-301', name: '计算机学院课程实验报告撰写规范标准V2.0.pdf', size: '1.2 MB', uploadTime: '2026-09-08 09:05:12', status: '已向量化' },
        { id: 'f-302', name: '实训代码提交Git分支管理与Checklist.md', size: '180 KB', uploadTime: '2026-09-08 09:08:30', status: '已向量化' },
        { id: 'f-303', name: '课程期末大作业评分细则与查重规范.docx', size: '890 KB', uploadTime: '2026-09-08 09:10:00', status: '已向量化' }
      ]
    },
    {
      id: 'kb-4',
      name: '计算机视觉经典网络架构知识库',
      docsCount: 3,
      updateTime: '2026-09-01 16:45:20',
      desc: 'ResNet、YOLO、Transformer 等结构详细解析',
      files: [
        { id: 'f-401', name: 'ResNet残差网络与DenseNet密集连接精读.pdf', size: '6.4 MB', uploadTime: '2026-09-01 16:30:15', status: '已向量化' },
        { id: 'f-402', name: 'YOLOv8实时目标检测网络结构拆解与实战.pdf', size: '8.2 MB', uploadTime: '2026-09-01 16:40:00', status: '已向量化' },
        { id: 'f-403', name: 'Vision_Transformer(ViT)模型架构解析.docx', size: '3.5 MB', uploadTime: '2026-09-01 16:45:20', status: '已向量化' }
      ]
    }
  ]);

  const [isKbModalOpen, setIsKbModalOpen] = useState(false);
  const [editingKbItem, setEditingKbItem] = useState<any>(null);
  const [kbFormName, setKbFormName] = useState('');
  const [kbFormDesc, setKbFormDesc] = useState('');

  // 知识库文件配置弹窗状态
  const [isKbFilesModalOpen, setIsKbFilesModalOpen] = useState(false);
  const [activeConfigKb, setActiveConfigKb] = useState<TeacherKnowledgeBaseItem | null>(null);
  const [kbFileSearchKeyword, setKbFileSearchKeyword] = useState('');
  const kbFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingKbFile, setIsUploadingKbFile] = useState(false);

  // 打开知识库文件配置弹窗
  const handleOpenKbFilesModal = (kb: TeacherKnowledgeBaseItem) => {
    setActiveConfigKb(kb);
    setKbFileSearchKeyword('');
    setIsKbFilesModalOpen(true);
  };

  // 删除知识库中指定文件
  const handleDeleteKbFile = (fileId: string) => {
    if (!activeConfigKb) return;
    const updatedFiles = activeConfigKb.files.filter(f => f.id !== fileId);
    const updatedKb = {
      ...activeConfigKb,
      files: updatedFiles,
      docsCount: updatedFiles.length,
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setActiveConfigKb(updatedKb);
    setKnowledgeBases(prev => prev.map(k => k.id === updatedKb.id ? updatedKb : k));
    showToast('文档已从知识库中删除');
  };

  // 新增上传文件到知识库
  const handleUploadKbFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !activeConfigKb) return;

    setIsUploadingKbFile(true);
    const newFiles: KnowledgeBaseFile[] = [];

    Array.from(fileList).forEach((file: any, index) => {
      let sizeStr = '';
      if (file.size < 1024) {
        sizeStr = `${file.size} B`;
      } else if (file.size < 1024 * 1024) {
        sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      } else {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      newFiles.push({
        id: `f-${Date.now()}-${index}`,
        name: file.name,
        size: sizeStr,
        uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: '已向量化'
      });
    });

    setTimeout(() => {
      const mergedFiles = [...newFiles, ...activeConfigKb.files];
      const updatedKb = {
        ...activeConfigKb,
        files: mergedFiles,
        docsCount: mergedFiles.length,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      setActiveConfigKb(updatedKb);
      setKnowledgeBases(prev => prev.map(k => k.id === updatedKb.id ? updatedKb : k));
      setIsUploadingKbFile(false);
      showToast(`已成功上传并解析 ${newFiles.length} 个文件到知识库！`);
      if (e.target) e.target.value = '';
    }, 500);
  };

  // 拖拽上传支持
  const handleDropKbFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!activeConfigKb) return;
    const fileList = e.dataTransfer.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploadingKbFile(true);
    const newFiles: KnowledgeBaseFile[] = [];

    Array.from(fileList).forEach((file: any, index) => {
      let sizeStr = '';
      if (file.size < 1024) {
        sizeStr = `${file.size} B`;
      } else if (file.size < 1024 * 1024) {
        sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      } else {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      newFiles.push({
        id: `f-${Date.now()}-${index}`,
        name: file.name,
        size: sizeStr,
        uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: '已向量化'
      });
    });

    setTimeout(() => {
      const mergedFiles = [...newFiles, ...activeConfigKb.files];
      const updatedKb = {
        ...activeConfigKb,
        files: mergedFiles,
        docsCount: mergedFiles.length,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      setActiveConfigKb(updatedKb);
      setKnowledgeBases(prev => prev.map(k => k.id === updatedKb.id ? updatedKb : k));
      setIsUploadingKbFile(false);
      showToast(`已成功上传并解析 ${newFiles.length} 个文件到知识库！`);
    }, 500);
  };


  // -------------------------------------------------------------
  // 5. 技能图谱 状态与高保真数据（完全还原截图二）
  // -------------------------------------------------------------
  const [graphViewMode, setGraphViewMode] = useState<'outline' | 'tree' | 'network' | 'circle'>('outline');
  const [graphSearchText, setGraphSearchText] = useState('');

  // 截图二完整数据结构
  const initialSkillCategories = [
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

  const [skillCategories, setSkillCategories] = useState(initialSkillCategories);
  const [collapsedCatIds, setCollapsedCatIds] = useState<string[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);

  // 技能图谱导入功能状态（Excel / 课程 / 课程章节 / AI智能导入）
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [activeImportModal, setActiveImportModal] = useState<ImportType>(null);
  const importDropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭导入下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (importDropdownRef.current && !importDropdownRef.current.contains(e.target as Node)) {
        setShowImportDropdown(false);
      }
    };
    if (showImportDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showImportDropdown]);

  // 技能图谱展开与收起
  const toggleCollapseCat = (catId: string) => {
    setCollapsedCatIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleCollapseAllCats = () => {
    if (collapsedCatIds.length === skillCategories.length) {
      setCollapsedCatIds([]);
    } else {
      setCollapsedCatIds(skillCategories.map(c => c.id));
    }
  };

  // 全选与取消全选
  const allSkillIds = skillCategories.flatMap(c => [c.id, ...c.skills.map(s => s.id)]);
  const handleSelectAllSkills = () => {
    if (selectedSkillIds.length === allSkillIds.length) {
      setSelectedSkillIds([]);
    } else {
      setSelectedSkillIds(allSkillIds);
    }
  };

  // 新增分类或技能点
  const handleAddSkillNode = () => {
    const title = prompt('请输入新技能分类名称（如：E.强化学习进阶）：');
    if (title && title.trim()) {
      const code = String.fromCharCode(65 + skillCategories.length);
      const newCat = {
        id: `cat-${Date.now()}`,
        code,
        name: title.trim(),
        skills: [
          { id: `s-${Date.now()}-1`, code: '001', name: '核心概念与基础' }
        ]
      };
      setSkillCategories([...skillCategories, newCat]);
      showToast('已新增技能分类');
    }
  };

  // 删除选中的分类或技能点
  const handleDeleteSelectedSkills = () => {
    if (selectedSkillIds.length === 0) {
      alert('请先勾选需要删除的技能节点');
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedSkillIds.length} 项技能节点吗？`)) {
      setSkillCategories(prev => prev
        .filter(c => !selectedSkillIds.includes(c.id))
        .map(c => ({
          ...c,
          skills: c.skills.filter(s => !selectedSkillIds.includes(s.id))
        }))
      );
      setSelectedSkillIds([]);
      showToast('已删除选中的节点');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative select-none">
      {/* 顶部轻量 Toast 提示 */}
      {toastMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800/90 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-1.5 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Top Header 顶部导航与课程信息条（已去除专业方向、层次、课程标签，仅保留7种类型选择） */}
      <div className="h-28 border-b border-slate-200 bg-white flex items-center px-6 shrink-0 shadow-xs relative z-10">
        {/* 左侧封面缩略 */}
        <div className="w-44 h-20 rounded-xl overflow-hidden mr-5 shrink-0 relative shadow-2xs">
          <div className="w-full h-full bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] p-2.5 flex flex-col justify-between text-white relative">
            <div>
              <span className="text-xs font-black tracking-tight drop-shadow-xs line-clamp-1">
                {course.bannerText || courseTitle}
              </span>
              <span className="text-[9px] opacity-85 font-mono block mt-0.5">
                {course.bannerSub || '自建课程'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-bold backdrop-blur-xs">
                教师自建
              </span>
              <Edit3 className="w-4 h-4 text-white/90" />
            </div>
          </div>
        </div>

        {/* 中间信息区：仅保留课程名称和截图一中的7种课程类型 */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center mb-2.5">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2 flex-1 max-w-lg">
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="px-2.5 py-1 text-base font-bold text-slate-800 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 w-full"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsEditingTitle(false);
                    if (onUpdateCourse) {
                      onUpdateCourse({ ...course, title: courseTitle, category: selectedType });
                    }
                    showToast('课程名称已更新');
                  }}
                  className="px-2.5 py-1 bg-blue-600 text-white text-xs rounded-md font-medium hover:bg-blue-700 cursor-pointer"
                >
                  确定
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-800 truncate" title={courseTitle}>
                  {courseTitle}
                </h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="text-[#1890ff] hover:bg-blue-50 p-1 rounded-md transition-colors cursor-pointer"
                  title="点击修改课程名称"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 仅保留类型（截图一中的7种，支持点击切换） */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-semibold mr-1">课程类型：</span>
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
              {COURSE_TYPES.map(typeName => {
                const isCurrent = selectedType === typeName;
                return (
                  <button
                    key={typeName}
                    onClick={() => {
                      setSelectedType(typeName);
                      if (onUpdateCourse) {
                        onUpdateCourse({ ...course, category: typeName });
                      }
                      showToast(`课程类型已变更为：${typeName}`);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${isCurrent
                        ? 'bg-[#1890ff] text-white font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                  >
                    {typeName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧动作按钮区 */}
        <div className="flex items-center space-x-2.5 ml-4 shrink-0">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1 text-slate-500" /> 返回我的课程
          </button>

          <button
            onClick={() => showToast('已进入课程学生端预览模式')}
            className="px-3.5 py-1.5 bg-blue-50 text-[#1890ff] rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center border border-blue-200/60 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> 预览效果
          </button>

          <button
            onClick={() => {
              setIsPublished(!isPublished);
              showToast(isPublished ? '课程已设为下线草稿状态' : '课程已成功发布至备课中心');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center cursor-pointer shadow-2xs ${isPublished
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
          >
            {isPublished ? '已发布' : '草稿发布'}
          </button>
        </div>
      </div>

      {/* Main Edit Area 页面主体（左侧导航 + 右侧主内容） */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {/* Left Sidebar 左侧编辑导航（已去除课程设置，保留基本信息、课程章节、AI技能助手、技能图谱） */}
        <div className="w-48 bg-white border-r border-slate-200 py-3 shrink-0 flex flex-col justify-between">
          <div className="space-y-1 px-2.5">
            {sidebarMenu.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${activeMenu === item.id
                    ? 'bg-blue-50 text-[#1890ff] shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <item.icon className={`w-4 h-4 mr-2.5 ${activeMenu === item.id ? 'text-[#1890ff]' : 'text-slate-400'}`} />
                {item.label}
                {activeMenu === item.id && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#1890ff] rounded-l-md" />
                )}
              </button>
            ))}
          </div>

          <div className="m-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 block mb-1">💡 教师提示</span>
            当前处于自建课程专属编辑模式，修改后仅对本课程生效。
          </div>
        </div>

        {/* Right Content 右侧工作区 */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* 1. 课程章节 Tab（2. 已完全去除设为试学、取消试学、试学徽章） */}
          {activeMenu === 'chapters' && (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5">
              {/* 顶部操作条（已移除试学按钮） */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAddChapter}
                    className="px-4 py-2 bg-[#1890ff] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors flex items-center shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> 新增章/教学项目
                  </button>
                  <span className="text-xs text-slate-400">
                    共 {chapters.length} 章，{chapters.reduce((acc, c) => acc + c.tasks.length, 0)} 个教学任务步骤
                  </span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => showToast('教学大纲与章节已全部保存')}
                    className="px-3.5 py-1.5 bg-[#1890ff] text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center shadow-2xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" /> 保存大纲
                  </button>
                  <button
                    onClick={handleBatchDeleteTasks}
                    className="px-3.5 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> 批量删除
                  </button>
                </div>
              </div>

              {/* 章节大纲树列表（已去除任何试学标签） */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="bg-white">
                    {/* Chapter Header 章节点 */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 border-b border-slate-100 group">
                      <div className="flex items-center space-x-2 flex-1">
                        <ChevronDown className="w-4 h-4 text-slate-400 cursor-pointer" />
                        <span className="font-bold text-slate-800 text-xs">{chapter.title}</span>
                        <span className="text-[11px] text-slate-400 ml-2">
                          ({chapter.tasks.length} 节)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            const title = prompt('请输入修改后的章名称：', chapter.title);
                            if (title && title.trim()) {
                              setChapters(chapters.map(c => c.id === chapter.id ? { ...c, title: title.trim() } : c));
                              showToast('章名称已更新');
                            }
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer flex items-center"
                        >
                          <Edit3 className="w-3 h-3 mr-0.5" /> 重命名
                        </button>
                        <button
                          onClick={() => {
                            const newTask: TeacherTask = {
                              id: `${chapter.id}-${chapter.tasks.length + 1}`,
                              title: `${chapter.tasks.length + 1} 任务：新增教学实践（图文）`,
                              type: 'text'
                            };
                            setChapters(chapters.map(c => c.id === chapter.id ? { ...c, tasks: [...c.tasks, newTask] } : c));
                            showToast('已为本章新增任务步骤');
                          }}
                          className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center ml-2"
                        >
                          <Plus className="w-3 h-3 mr-0.5" /> 添加步骤
                        </button>
                      </div>
                    </div>

                    {/* Tasks 任务步骤列表（无试学字样与标签） */}
                    <div className="divide-y divide-slate-100">
                      {chapter.tasks.map((task) => {
                        const isChecked = selectedTaskIds.includes(task.id);
                        return (
                          <div
                            key={task.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-blue-50/40 group transition-colors select-none"
                          >
                            <div className="flex items-center flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTaskIds([...selectedTaskIds, task.id]);
                                  } else {
                                    setSelectedTaskIds(selectedTaskIds.filter(id => id !== task.id));
                                  }
                                }}
                                className="mr-3 rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff] ml-5 cursor-pointer"
                              />
                              {task.type && typeConfig[task.type] && (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border mr-3 shrink-0 ${typeConfig[task.type].color}`}>
                                  {typeConfig[task.type].label}
                                </span>
                              )}

                              <span className="text-xs font-medium text-slate-700 truncate pr-2">
                                {task.title}
                              </span>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button
                                onClick={() => setEditingTask({ ...task, chapterName: chapter.title })}
                                className="px-2 py-1 text-xs font-semibold text-[#1890ff] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              >
                                编辑步骤内容
                              </button>
                              <button
                                onClick={() => {
                                  setChapters(chapters.map(c => c.id === chapter.id ? { ...c, tasks: c.tasks.filter(t => t.id !== task.id) } : c));
                                  showToast('任务已删除');
                                }}
                                className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. 基本信息 Tab */}
          {activeMenu === 'info' && (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">自建课程基本信息</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">课程全称</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">课程类型分类</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 bg-white cursor-pointer"
                  >
                    {COURSE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">课程简要说明与教学目标</label>
                  <textarea
                    rows={4}
                    defaultValue={course.desc || '本课程由主讲教师校本自建，涵盖核心理论教学与综合实践上机环节。'}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 resize-none bg-white"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onUpdateCourse) {
                        onUpdateCourse({ ...course, title: courseTitle, category: selectedType });
                      }
                      showToast('课程基本信息已保存');
                    }}
                    className="px-5 py-2 bg-[#1890ff] text-white rounded-lg font-bold text-xs hover:bg-blue-600 cursor-pointer shadow-2xs"
                  >
                    保存基本信息
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. AI技能助手 Tab（包含：AI技能助手配置、知识库配置） */}
          {activeMenu === 'ai' && (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              {/* 二级子导航 */}
              <div className="flex items-center px-6 pt-4 border-b border-slate-200 bg-slate-50/50 space-x-6">
                <button
                  onClick={() => setAiSubTab('assistant')}
                  className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center ${aiSubTab === 'assistant'
                      ? 'text-[#1890ff] border-[#1890ff]'
                      : 'text-slate-500 border-transparent hover:text-slate-800'
                    }`}
                >
                  <Bot className="w-4 h-4 mr-1.5" />
                  AI技能助手配置
                </button>
                <button
                  onClick={() => setAiSubTab('kb')}
                  className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center ${aiSubTab === 'kb'
                      ? 'text-[#1890ff] border-[#1890ff]'
                      : 'text-slate-500 border-transparent hover:text-slate-800'
                    }`}
                >
                  <Database className="w-4 h-4 mr-1.5" />
                  知识库配置
                  <span className="ml-1.5 px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] rounded-full">
                    {knowledgeBases.length}
                  </span>
                </button>
              </div>

              {/* 子面板一：AI技能助手配置与实时问答调试（支持预置提示词及右侧实时调试对话） */}
              {aiSubTab === 'assistant' && (
                <TeacherAiAssistantSection
                  knowledgeBases={knowledgeBases}
                  selectedKbIds={selectedKbIds}
                  setSelectedKbIds={setSelectedKbIds}
                  showToast={showToast}
                />
              )}

              {/* 子面板二：知识库配置（新增、编辑、删除、查找知识库） */}
              {aiSubTab === 'kb' && (
                <div className="p-6 space-y-4">
                  {/* 操作栏：查找知识库与新增知识库 */}
                  <div className="flex items-center justify-between">
                    <div className="relative w-80">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={kbSearchKeyword}
                        onChange={(e) => setKbSearchKeyword(e.target.value)}
                        placeholder="输入名称或描述查找知识库..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setEditingKbItem(null);
                        setKbFormName('');
                        setKbFormDesc('');
                        setIsKbModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#1890ff] text-white rounded-xl text-xs font-bold hover:bg-blue-600 flex items-center shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      新增知识库
                    </button>
                  </div>

                  {/* 知识库表格列表 */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-[1fr_100px_160px_150px] gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <div>知识库名称与简介</div>
                      <div className="text-center">文档篇数</div>
                      <div>最后更新时间</div>
                      <div className="text-right">操作</div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {knowledgeBases
                        .filter(kb => !kbSearchKeyword.trim() || kb.name.includes(kbSearchKeyword) || kb.desc.includes(kbSearchKeyword))
                        .map((kb) => (
                          <div key={kb.id} className="grid grid-cols-[1fr_100px_160px_150px] gap-3 px-4 py-3.5 items-center hover:bg-blue-50/30 transition-colors">
                            <div>
                              <div className="font-bold text-slate-800 flex items-center">
                                <Database className="w-3.5 h-3.5 mr-1.5 text-[#1890ff]" />
                                {kb.name}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-md">
                                {kb.desc}
                              </div>
                            </div>
                            <div className="text-center font-mono font-medium text-slate-600">{kb.docsCount}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{kb.updateTime}</div>
                            <div className="flex items-center justify-end space-x-2 text-blue-600">
                              <button
                                onClick={() => handleOpenKbFilesModal(kb)}
                                className="text-[#1890ff] hover:text-blue-800 font-semibold cursor-pointer"
                                title="管理该知识库的文件列表与上传"
                              >
                                配置
                              </button>
                              <span className="text-slate-200">|</span>
                              <button
                                onClick={() => {
                                  setEditingKbItem(kb);
                                  setKbFormName(kb.name);
                                  setKbFormDesc(kb.desc);
                                  setIsKbModalOpen(true);
                                }}
                                className="hover:text-blue-800 font-semibold cursor-pointer"
                              >
                                编辑
                              </button>
                              <span className="text-slate-200">|</span>
                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除知识库《${kb.name}》吗？`)) {
                                    setKnowledgeBases(knowledgeBases.filter(item => item.id !== kb.id));
                                    setSelectedKbIds(selectedKbIds.filter(id => id !== kb.id));
                                    showToast('知识库已删除');
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 新增/编辑知识库弹窗 */}
              {isKbModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsKbModalOpen(false)} />
                  <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden z-10 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-800">
                        {editingKbItem ? '编辑知识库' : '新增知识库'}
                      </h3>
                      <button onClick={() => setIsKbModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">知识库名称 *</label>
                        <input
                          type="text"
                          value={kbFormName}
                          onChange={(e) => setKbFormName(e.target.value)}
                          placeholder="例如：智能制造与工业互联网知识库"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">简介与应用场景</label>
                        <textarea
                          rows={3}
                          value={kbFormDesc}
                          onChange={(e) => setKbFormDesc(e.target.value)}
                          placeholder="请输入该知识库收录的教学资料范围..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none bg-white"
                        />
                      </div>
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-700 flex items-center">
                        <UploadCloud className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
                        创建成功后可在知识库列表点击“配置”上传 PDF、Word 或 Markdown 文档。
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setIsKbModalOpen(false)}
                        className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => {
                          if (!kbFormName.trim()) {
                            alert('请输入知识库名称');
                            return;
                          }
                          if (editingKbItem) {
                            setKnowledgeBases(knowledgeBases.map(item => item.id === editingKbItem.id ? { ...item, name: kbFormName, desc: kbFormDesc } : item));
                            showToast('知识库已更新');
                          } else {
                            const newKb: TeacherKnowledgeBaseItem = {
                              id: `kb-${Date.now()}`,
                              name: kbFormName,
                              desc: kbFormDesc || '教师校本特色知识库',
                              docsCount: 0,
                              updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
                              files: []
                            };
                            setKnowledgeBases([newKb, ...knowledgeBases]);
                            setSelectedKbIds([...selectedKbIds, newKb.id]);
                            showToast('知识库新增成功并已自动关联');
                          }
                          setIsKbModalOpen(false);
                        }}
                        className="px-5 py-1.5 text-xs font-bold bg-[#1890ff] text-white rounded-lg hover:bg-blue-600 cursor-pointer shadow-xs"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 知识库文件配置弹窗 (KbFilesManagementModal) */}
              {isKbFilesModalOpen && activeConfigKb && (
                <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
                  <div
                    className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity"
                    onClick={() => setIsKbFilesModalOpen(false)}
                  />
                  <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1890ff] flex items-center justify-center">
                          <Database className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-bold text-slate-800">知识库文件配置</h3>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1890ff] text-xs font-semibold border border-blue-100">
                              {activeConfigKb.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            管理知识库内的文档资产，支持新增上传文件与废弃文档删除，文件上传后自动向量化
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsKbFilesModalOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* SubHeader / 操作工具栏 */}
                    <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                      <div className="relative w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={kbFileSearchKeyword}
                          onChange={(e) => setKbFileSearchKeyword(e.target.value)}
                          placeholder="搜索文档名称..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white placeholder:text-slate-400"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          ref={kbFileInputRef}
                          onChange={handleUploadKbFiles}
                          multiple
                          accept=".pdf,.docx,.doc,.txt,.md,.xlsx,.pptx"
                          className="hidden"
                        />
                        <button
                          onClick={() => kbFileInputRef.current?.click()}
                          disabled={isUploadingKbFile}
                          className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingKbFile ? '上传解析中...' : '上传新文件'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 文件列表内容区域 */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {/* 顶部轻量上传引导提示 */}
                      <div
                        onClick={() => kbFileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropKbFiles}
                        className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 hover:bg-blue-50/70 transition-all rounded-xl p-4 flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              点击或拖拽文件至此处上传
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              支持 PDF、Word (.docx/.doc)、Markdown (.md)、TXT 格式，单个文件不超过 50MB
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#1890ff] group-hover:underline">
                          选择文件
                        </span>
                      </div>

                      {/* 文件表格 */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                        <div className="grid grid-cols-[1fr_100px_150px_100px_70px] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                          <div>文档名称</div>
                          <div>大小</div>
                          <div>上传时间</div>
                          <div className="text-center">状态</div>
                          <div className="text-right">操作</div>
                        </div>

                        <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                          {activeConfigKb.files
                            .filter(file => !kbFileSearchKeyword.trim() || file.name.toLowerCase().includes(kbFileSearchKeyword.trim().toLowerCase()))
                            .length > 0 ? (
                            activeConfigKb.files
                              .filter(file => !kbFileSearchKeyword.trim() || file.name.toLowerCase().includes(kbFileSearchKeyword.trim().toLowerCase()))
                              .map((file) => {
                                const isPdf = file.name.endsWith('.pdf');
                                const isDoc = file.name.endsWith('.docx') || file.name.endsWith('.doc');
                                const isMd = file.name.endsWith('.md');

                                return (
                                  <div
                                    key={file.id}
                                    className="grid grid-cols-[1fr_100px_150px_100px_70px] gap-3 px-4 py-3 items-center hover:bg-slate-50/80 transition-colors"
                                  >
                                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                                      <span
                                        className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${isPdf
                                            ? 'bg-red-50 text-red-600 border border-red-200'
                                            : isDoc
                                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                              : isMd
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                          }`}
                                      >
                                        {isPdf ? 'PDF' : isDoc ? 'DOC' : isMd ? 'MD' : 'TXT'}
                                      </span>
                                      <span className="text-xs font-semibold text-slate-800 truncate" title={file.name}>
                                        {file.name}
                                      </span>
                                    </div>

                                    <div className="font-mono text-slate-500 text-[11px]">{file.size}</div>
                                    <div className="text-slate-400 font-mono text-[11px]">{file.uploadTime}</div>

                                    <div className="text-center">
                                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        <span>{file.status}</span>
                                      </span>
                                    </div>

                                    <div className="text-right">
                                      <button
                                        onClick={() => {
                                          if (confirm(`确定要从知识库中删除文档《${file.name}》吗？`)) {
                                            handleDeleteKbFile(file.id);
                                          }
                                        }}
                                        className="text-red-500 hover:text-red-700 font-semibold cursor-pointer p-1 rounded hover:bg-red-50 transition-colors"
                                        title="删除文档"
                                      >
                                        删除
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                          ) : (
                            <div className="py-12 text-center text-slate-400">
                              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                              <p className="text-xs">未找到匹配的文档</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                      <div className="text-xs text-slate-500">
                        当前知识库文档总数：
                        <strong className="text-slate-800 font-bold ml-1">{activeConfigKb.files.length}</strong> 篇
                      </div>
                      <button
                        onClick={() => setIsKbFilesModalOpen(false)}
                        className="px-5 py-2 bg-[#1890ff] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        完成
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. 技能图谱 Tab（高保真还原截图二） */}
          {activeMenu === 'graph' && (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
              {/* 截图二顶部栏：左侧 技能图谱切换胶囊 (大纲 / 树图 / 网图 / 环形图)，右侧 导入 / 导出 / 新窗口打开 */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                {/* 技能图谱多视图胶囊切换 */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800 mr-1">技能图谱</span>
                  <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs shadow-2xs">
                    <button
                      onClick={() => setGraphViewMode('outline')}
                      className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${graphViewMode === 'outline'
                          ? 'bg-[#1890ff] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      大纲
                    </button>
                    <button
                      onClick={() => {
                        setGraphViewMode('tree');
                        showToast('已切换至技能树状可视化图');
                      }}
                      className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${graphViewMode === 'tree'
                          ? 'bg-[#1890ff] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      树图
                    </button>
                    <button
                      onClick={() => {
                        setGraphViewMode('network');
                        showToast('已切换至技能拓扑网络图');
                      }}
                      className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${graphViewMode === 'network'
                          ? 'bg-[#1890ff] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      网图
                    </button>
                    <button
                      onClick={() => {
                        setGraphViewMode('circle');
                        showToast('已切换至环形能力图谱');
                      }}
                      className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${graphViewMode === 'circle'
                          ? 'bg-[#1890ff] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      环形图
                    </button>
                  </div>
                </div>

                {/* 右侧操作按钮：导入、导出、新窗口打开 */}
                <div className="flex items-center space-x-2">
                  {/* 导入下拉菜单（完全还原截图一：蓝色胶囊按钮 + 带顶部小尖角白色气泡菜单） */}
                  <div className="relative inline-block" ref={importDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowImportDropdown(!showImportDropdown)}
                      className="px-3.5 py-1.5 bg-[#1890ff] text-white rounded text-xs font-medium hover:bg-blue-600 flex items-center cursor-pointer shadow-2xs transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5 mr-1" />
                      <span>导入</span>
                    </button>

                    {showImportDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in duration-100">
                        {/* 气泡上方白色小尖角 */}
                        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-slate-100 transform rotate-45" />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveImportModal('excel');
                            setShowImportDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer block"
                        >
                          Excel导入
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveImportModal('course');
                            setShowImportDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer block"
                        >
                          课程导入
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveImportModal('chapter');
                            setShowImportDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer block"
                        >
                          课程章节导入
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveImportModal('ai');
                            setShowImportDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer block font-medium text-[#1890ff]"
                        >
                          AI智能导入
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => showToast('技能图谱已成功导出为图谱知识文件')}
                    className="px-3 py-1.5 bg-[#1890ff] text-white rounded text-xs font-medium hover:bg-blue-600 flex items-center cursor-pointer shadow-2xs"
                  >
                    导出 <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                  <button
                    onClick={() => showToast('已在新全屏沉浸窗口中打开技能图谱工作台')}
                    className="px-3 py-1.5 bg-[#1890ff] text-white rounded text-xs font-medium hover:bg-blue-600 flex items-center cursor-pointer shadow-2xs"
                  >
                    新窗口打开
                  </button>
                </div>
              </div>

              {/* 截图二模式：大纲树视图 */}
              {graphViewMode === 'outline' ? (
                <div className="space-y-3">
                  {/* 输入搜索框（占位符：请输入） */}
                  <div className="max-w-md">
                    <input
                      type="text"
                      value={graphSearchText}
                      onChange={(e) => setGraphSearchText(e.target.value)}
                      placeholder="请输入"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded outline-none focus:border-blue-500 bg-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* 快捷操作行：全部收起、全部选中、新增、删除 */}
                  <div className="flex items-center space-x-4 text-xs pt-1">
                    <button
                      onClick={handleCollapseAllCats}
                      className="text-[#1890ff] hover:text-blue-700 cursor-pointer font-medium"
                    >
                      {collapsedCatIds.length === skillCategories.length ? '全部展开' : '全部收起'}
                    </button>
                    <button
                      onClick={handleSelectAllSkills}
                      className="text-[#1890ff] hover:text-blue-700 cursor-pointer font-medium"
                    >
                      {selectedSkillIds.length === allSkillIds.length ? '取消全选' : '全部选中'}
                    </button>
                    <button
                      onClick={handleAddSkillNode}
                      className="text-[#1890ff] hover:text-blue-700 cursor-pointer font-medium"
                    >
                      新增
                    </button>
                    <button
                      onClick={handleDeleteSelectedSkills}
                      className="text-red-500 hover:text-red-700 cursor-pointer font-medium"
                    >
                      删除
                    </button>
                  </div>

                  {/* 多级分类与技能点树形展示（高保真还原截图二） */}
                  <div className="pt-2 space-y-3 font-sans text-xs">
                    {skillCategories
                      .filter(cat => {
                        if (!graphSearchText.trim()) return true;
                        const kw = graphSearchText.toLowerCase();
                        const matchCat = cat.name.toLowerCase().includes(kw);
                        const matchSkill = cat.skills.some(s => s.name.toLowerCase().includes(kw));
                        return matchCat || matchSkill;
                      })
                      .map((category) => {
                        const isCollapsed = collapsedCatIds.includes(category.id);
                        const isCatSelected = selectedSkillIds.includes(category.id);

                        return (
                          <div key={category.id} className="space-y-1.5">
                            {/* 一级分类节点：折叠箭头、复选框、A.分类名称、[分类]徽章 */}
                            <div className="flex items-center space-x-1.5 select-none hover:bg-slate-50 py-1 px-1 rounded transition-colors">
                              <button
                                type="button"
                                onClick={() => toggleCollapseCat(category.id)}
                                className="text-slate-500 hover:text-slate-800 p-0.5 cursor-pointer"
                              >
                                {isCollapsed ? (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </button>

                              <input
                                type="checkbox"
                                checked={isCatSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSkillIds([...new Set([...selectedSkillIds, category.id, ...category.skills.map(s => s.id)])]);
                                  } else {
                                    const removeIds = [category.id, ...category.skills.map(s => s.id)];
                                    setSelectedSkillIds(selectedSkillIds.filter(id => !removeIds.includes(id)));
                                  }
                                }}
                                className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff] cursor-pointer"
                              />

                              <span className="font-semibold text-slate-800">
                                {category.code}.{category.name}
                              </span>

                              {/* 分类徽章（截图二为纯蓝色小块） */}
                              <span className="px-1.5 py-0.2 text-[10px] bg-[#1890ff] text-white rounded font-medium">
                                分类
                              </span>
                            </div>

                            {/* 二级技能点列表（展开时渲染） */}
                            {!isCollapsed && (
                              <div className="pl-7 space-y-1">
                                {category.skills
                                  .filter(skill => {
                                    if (!graphSearchText.trim()) return true;
                                    const kw = graphSearchText.toLowerCase();
                                    return category.name.toLowerCase().includes(kw) || skill.name.toLowerCase().includes(kw);
                                  })
                                  .map((skill) => {
                                    const isSkillSelected = selectedSkillIds.includes(skill.id);
                                    return (
                                      <div
                                        key={skill.id}
                                        className="flex items-center space-x-1.5 select-none hover:bg-slate-50 py-0.8 px-1 rounded transition-colors"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSkillSelected}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedSkillIds([...selectedSkillIds, skill.id]);
                                            } else {
                                              setSelectedSkillIds(selectedSkillIds.filter(id => id !== skill.id));
                                            }
                                          }}
                                          className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff] cursor-pointer ml-1"
                                        />

                                        <span className="text-slate-700 font-mono">
                                          {skill.code}.{skill.name}
                                        </span>

                                        {/* 技能点徽章（截图二为绿色小块） */}
                                        <span className="px-1.5 py-0.2 text-[10px] bg-[#52c41a] text-white rounded font-medium">
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
                </div>
              ) : graphViewMode === 'tree' ? (
                /* 树图可视化视图 */
                <div className="min-h-[420px] bg-slate-50/70 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-3 left-3 text-xs text-slate-400 flex items-center">
                    <GitFork className="w-4 h-4 mr-1 text-[#1890ff]" /> 技能分支层级树图（支持拖拽与缩放）
                  </div>
                  <div className="flex flex-col items-center space-y-6 w-full max-w-4xl py-6">
                    <div className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md text-sm">
                      {courseTitle}·核心技能大纲
                    </div>
                    <div className="w-0.5 h-6 bg-blue-300"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                      {skillCategories.map(cat => (
                        <div key={cat.id} className="bg-white border-2 border-blue-200 rounded-xl p-3 shadow-xs flex flex-col items-center text-center">
                          <span className="text-xs font-bold text-blue-700 mb-2">{cat.code}.{cat.name}</span>
                          <div className="space-y-1 w-full text-[11px] text-slate-600">
                            {cat.skills.slice(0, 4).map(s => (
                              <div key={s.id} className="py-0.5 px-1 bg-slate-50 rounded truncate border border-slate-100">
                                {s.name}
                              </div>
                            ))}
                            {cat.skills.length > 4 && (
                              <div className="text-[10px] text-slate-400">+{cat.skills.length - 4} 个点...</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : graphViewMode === 'network' ? (
                /* 网图拓扑力导向图视图 */
                <div className="min-h-[420px] bg-slate-900 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden text-white">
                  <div className="absolute top-3 left-3 text-xs text-cyan-300 flex items-center">
                    <Network className="w-4 h-4 mr-1" /> 技能知识网络拓扑关联图
                  </div>
                  <div className="relative w-96 h-80 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-blue-600/80 border-2 border-cyan-400 flex items-center justify-center text-center p-2 text-xs font-bold shadow-lg shadow-cyan-500/20 z-10 animate-pulse">
                      深度学习核心
                    </div>
                    {/* 周围环绕节点 */}
                    <div className="absolute top-2 left-6 px-3 py-1.5 bg-indigo-800/80 border border-indigo-400 rounded-full text-xs">
                      激活函数与梯度
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-800/80 border border-emerald-400 rounded-full text-xs">
                      张量与计算图
                    </div>
                    <div className="absolute bottom-6 left-2 px-3 py-1.5 bg-purple-800/80 border border-purple-400 rounded-full text-xs">
                      卷积与池化
                    </div>
                    <div className="absolute bottom-4 right-6 px-3 py-1.5 bg-amber-800/80 border border-amber-400 rounded-full text-xs">
                      图像分类实战
                    </div>
                  </div>
                </div>
              ) : (
                /* 环形图视图 */
                <div className="min-h-[420px] bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-3 left-3 text-xs text-slate-400 flex items-center">
                    <PieChart className="w-4 h-4 mr-1 text-[#1890ff]" /> 技能环形雷达全景
                  </div>
                  <div className="w-64 h-64 rounded-full border-4 border-dashed border-blue-200 flex items-center justify-center relative">
                    <div className="w-44 h-44 rounded-full border-2 border-blue-400 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-center font-bold text-xs p-2 shadow-md">
                        技能全景
                      </div>
                    </div>
                    <span className="absolute -top-3 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">深度学习基础</span>
                    <span className="absolute -right-3 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] font-bold">TensorFlow应用</span>
                    <span className="absolute -bottom-3 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">实战案例</span>
                    <span className="absolute -left-3 bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">卷积网络</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 任务步骤独立编辑弹窗 */}
      {editingTask && (
        <TeacherStepEditorModal
          courseName={courseTitle}
          task={editingTask}
          chapters={chapters}
          skillCategories={skillCategories}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTaskStep}
        />
      )}
      {/* 技能图谱导入功能独立弹窗群（Excel导入、课程导入、课程章节导入、AI智能导入） */}
      <SkillGraphImportModals
        activeModal={activeImportModal}
        onClose={() => setActiveImportModal(null)}
        currentCategories={skillCategories}
        currentChapters={chapters}
        courseTitle={courseTitle}
        onImportSkills={(mergedCategories) => {
          setSkillCategories(mergedCategories);
          showToast('技能图谱已成功导入并智能合并！');
        }}
      />
    </div>
  );
}
