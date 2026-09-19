import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, ArrowUp, ArrowDown, Link2, Box, Image as ImageIcon, Plus, Minus, Bold, Underline, Italic, Strikethrough, Heading, Code, Image, Undo, Redo, Eye, List, ListOrdered, UploadCloud, Copy, Cpu, Target, Book } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: string;
  hasTrial: boolean;
  chapterName?: string;
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
  onClose: () => void;
}

const typeConfig: Record<string, { label: string, color: string }> = {
  text: { label: '图文', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  video: { label: '视频', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  exercise: { label: '习题', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  experiment: { label: '实验', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  report: { label: '报告', color: 'bg-purple-100 text-purple-600 border-purple-200' }
};

export default function StepEditorModal({ task, courseName, chapters = [], onClose }: StepEditorModalProps) {
  const [currentTask, setCurrentTask] = useState(task);
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
    
    // Auto-switch tabs logic based on the new task type
    const newType = currentTask.type;
    setActiveTab(`${newType}_settings`);
  }, [currentTask]);

  const [questions, setQuestions] = useState([
    { id: 1, title: "关于 plt.scatter(hours, score, c=attend, cmap='Blues') 与 plt.colorbar() 的说法，正确的是（ ）。", type: '多选题', category: '编程基础', score: 2 },
    { id: 2, title: "下列属于 plt.scatter() 常用参数的有（ ）。", type: '多选题', category: '编程基础', score: 2 },
    { id: 3, title: "下列属于虚拟仿真环境支持的操作功能的有（ ）。", type: '多选题', category: '仿真', score: 4 },
    { id: 4, title: "在智慧家居项目的应用设计中，2D应用界面需实现的功能包括（ ）。", type: '多选题', category: '设计', score: 4 },
    { id: 5, title: "使用 OpenCV 进行图像色彩空间转换时，BGR 转灰度图的常用色彩代码是（ ）。", type: '单选题', category: '编程基础', score: 2 },
    { id: 6, title: "在图像标注任务中，以下关于目标检测矩形框标注规范说法正确的有（ ）。", type: '多选题', category: '设计', score: 3 },
    { id: 7, title: "NumPy 中用于矩阵转置的属性是（ ）。", type: '单选题', category: '编程基础', score: 2 },
    { id: 8, title: "下列哪些方法可以用来防止机器学习模型过拟合（ ）。", type: '多选题', category: '编程基础', score: 4 },
    { id: 9, title: "虚拟现实与仿真系统中常采用的三维模型文件格式包括（ ）。", type: '多选题', category: '仿真', score: 3 },
    { id: 10, title: "在进行多边形语义分割标注时，关键边缘点的贴合度要求应达到（ ）。", type: '单选题', category: '设计', score: 2 },
    { id: 11, title: "简述在图像预处理阶段进行直方图均衡化的主要目的和基本原理。", type: '简答题', category: '编程基础', score: 5 },
    { id: 12, title: "PyTorch 中用于定义神经网络层参数梯度的核心属性是 requires_grad。（ ）", type: '单选题', category: '编程基础', score: 2 },
    { id: 13, title: "在 3D 点云仿真交互中，用于坐标系姿态描述的四元数包含几个分量（ ）。", type: '单选题', category: '仿真', score: 2 },
    { id: 14, title: "UI 设计中遵循的无障碍对比度（WCAG AA级）对于普通文本的最小比值是（ ）。", type: '单选题', category: '设计', score: 3 },
    { id: 15, title: "Pandas 中读取 CSV 文件并自动解析日期列的常用参数是（ ）。", type: '单选题', category: '编程基础', score: 2 },
    { id: 16, title: "下列属于常见工业缺陷图像检测样本增强手段的有（ ）。", type: '多选题', category: '设计', score: 4 },
    { id: 17, title: "在机器人轨迹仿真测试中，逆运动学求解的主要应用场景是什么？", type: '简答题', category: '仿真', score: 5 },
    { id: 18, title: "Matplotlib 图表中保存高分辨率图像时，推荐设置的 dpi 数值是（ ）。", type: '单选题', category: '编程基础', score: 2 },
    { id: 19, title: "交互式标注系统中快捷键撤销和重做的通用快捷键是（ ）。", type: '多选题', category: '设计', score: 2 },
    { id: 20, title: "数字孪生车间建模中支持物理碰撞检测的物理引擎包括（ ）。", type: '多选题', category: '仿真', score: 4 },
    { id: 21, title: "在卷积神经网络中，Pooling 池化层的主要作用包括（ ）。", type: '多选题', category: '编程基础', score: 3 },
    { id: 22, title: "Labelme 工具导出的常用标注元数据保存格式为（ ）。", type: '单选题', category: '设计', score: 2 },
    { id: 23, title: "简要说明虚拟仿真实验中“事件驱动机制”的工作过程。", type: '简答题', category: '仿真', score: 5 },
    { id: 24, title: "Python 列表中向末尾追加多个元素的方法是（ ）。", type: '单选题', category: '编程基础', score: 2 },
    { id: 25, title: "标注数据质检验收（QA）合格率通常需达到的行业基准要求是（ ）。", type: '单选题', category: '设计', score: 3 },
    { id: 26, title: "三维物理仿真场景中光照渲染模型主要包含哪些分量？", type: '多选题', category: '仿真', score: 3 },
    { id: 27, title: "在深度学习模型训练中，学习率衰减（Learning Rate Decay）的作用是（ ）。", type: '单选题', category: '编程基础', score: 2 },
    { id: 28, title: "人机交互界面中关于“格式塔心理学”原则包括以下哪些？", type: '多选题', category: '设计', score: 4 },
  ]);

  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [requireAllAnswered, setRequireAllAnswered] = useState(true);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

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

  const renderDocumentEditor = () => (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full">
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center space-x-6 shrink-0">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="doc_content_type" className="text-[#1890ff] focus:ring-[#1890ff]" defaultChecked />
            <span className="text-[#1890ff] text-sm font-medium">在线编辑</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="doc_content_type" className="text-[#1890ff] focus:ring-[#1890ff]" />
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
            <div className="flex-1 p-6 text-slate-400 text-sm focus:outline-none" contentEditable suppressContentEditableWarning>请输入正文</div>
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
        className="w-[85vw] h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden select-none"
      >
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
                              className={`w-full flex items-center px-3 py-2 text-left text-sm rounded transition-colors group ${
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
                      key={currentTask.id} // Force re-render on task change
                      type="text" 
                      defaultValue={currentTask.title}
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
                      className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm min-h-[400px] h-full flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-6 shrink-0">
                        <h4 className="text-slate-700 font-medium">已关联技能点</h4>
                        <button className="px-4 py-2 bg-[#1890ff] text-white rounded text-sm hover:bg-blue-600 shadow-sm shadow-blue-200 transition-colors">
                          关联新技能
                        </button>
                      </div>
                      <div className="border border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center bg-slate-50 border-dashed flex-1">
                        <Target className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 text-sm">当前步骤暂未关联任何技能点</p>
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
                        <div className="grid grid-cols-[40px_60px_1fr_100px_100px_120px_160px] gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 font-medium text-slate-600 shrink-0 text-sm">
                          <div className="flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={isCurrentPageAllSelected}
                              onChange={handleSelectAllCurrentPage}
                              className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff]" 
                            />
                          </div>
                          <div className="text-center">序号</div>
                          <div>名称</div>
                          <div>题目类型</div>
                          <div>分类</div>
                          <div>分数</div>
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

                              return (
                                <div key={q.id} className="grid grid-cols-[40px_60px_1fr_100px_100px_120px_160px] gap-4 px-4 py-4 items-center hover:bg-blue-50/30 transition-colors text-sm">
                                  <div className="flex items-center justify-center">
                                    <input 
                                      type="checkbox" 
                                      checked={selectedQuestions.includes(q.id)}
                                      onChange={() => handleSelectQuestion(q.id)}
                                      className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff]" 
                                    />
                                  </div>
                                  <div className="flex items-center justify-center font-medium text-slate-500">
                                    {absoluteIndex + 1}
                                  </div>
                                  <div className="text-slate-700 leading-relaxed pr-4 font-medium flex flex-col">
                                    <span>{q.title}</span>
                                  </div>
                                  <div className="text-slate-500">{q.type}</div>
                                  <div className="text-slate-500">{q.category}</div>
                                  <div className="flex items-center">
                                    <div className="flex items-center border border-slate-200 rounded overflow-hidden w-24">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, score: Math.max(1, (item.score || 1) - 1) } : item));
                                        }}
                                        className="px-2 py-1 bg-slate-50 text-slate-400 hover:text-[#1890ff] hover:bg-blue-50 border-r border-slate-200 transition-colors cursor-pointer"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <input type="text" value={q.score} readOnly className="w-full text-center text-sm outline-none bg-white py-1 font-medium text-slate-700" />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, score: (item.score || 0) + 1 } : item));
                                        }}
                                        className="px-2 py-1 bg-slate-50 text-slate-400 hover:text-[#1890ff] hover:bg-blue-50 border-l border-slate-200 transition-colors cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3 text-[#1890ff]">
                                    <button className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" title="编辑"><ExternalLink className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50" title="删除"><X className="w-4 h-4" /></button>
                                    <button 
                                      onClick={() => handleMoveQuestion(q.id, 'up')} 
                                      className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" 
                                      title="上移" 
                                      disabled={isFirst}
                                    >
                                      <ArrowUp className={`w-4 h-4 ${isFirst ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`} />
                                    </button>
                                    <button 
                                      onClick={() => handleMoveQuestion(q.id, 'down')} 
                                      className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" 
                                      title="下移" 
                                      disabled={isLast}
                                    >
                                      <ArrowDown className={`w-4 h-4 ${isLast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`} />
                                    </button>
                                    <button className="hover:text-blue-700 p-1 rounded hover:bg-blue-50" title="关联"><Link2 className="w-4 h-4" /></button>
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
                      className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full"
                    >
                      <div className="flex space-x-12 mb-8 shrink-0">
                        <div className="flex-1 space-y-3">
                          <label className="text-sm font-medium text-slate-700 block">实验资源 <span className="text-slate-400 font-normal">（添加实验包、jupyter文档、代码包、数据集等资源）：</span></label>
                          <button className="px-4 py-2 border border-[#1890ff] text-[#1890ff] rounded bg-white hover:bg-blue-50 transition-colors text-sm">上传资源</button>
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
                            <button className="px-4 py-2 border border-[#1890ff] text-[#1890ff] rounded bg-white hover:bg-blue-50 transition-colors whitespace-nowrap text-sm">添加实验环境</button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 flex-1 flex flex-col min-h-0">
                        <label className="text-sm font-medium text-slate-700">实验正文</label>
                        <div className="flex items-center space-x-6 shrink-0">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="exp_content_type" className="text-[#1890ff] focus:ring-[#1890ff]" defaultChecked />
                            <span className="text-[#1890ff] text-sm font-medium">在线编辑</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="exp_content_type" className="text-[#1890ff] focus:ring-[#1890ff]" />
                            <span className="text-slate-600 text-sm">上传PDF</span>
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
                            <div className="flex-1"></div>
                            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Undo className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Redo className="w-4 h-4" /></button>
                            <div className="w-px h-5 bg-slate-300 mx-2"></div>
                            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Eye className="w-4 h-4" /></button>
                          </div>
                          
                          {/* Split Editor Area */}
                          <div className="flex-1 flex divide-x divide-slate-200 bg-white">
                            <div className="flex-1 p-6 text-slate-400 text-sm focus:outline-none" contentEditable suppressContentEditableWarning>请输入正文</div>
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
    </div>
  );
}
