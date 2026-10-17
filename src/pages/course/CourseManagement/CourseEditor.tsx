import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Eye, X, Book, Layout, BarChart, Tag as TagIcon, Edit3, Plus, Settings, Cpu, ChevronDown, ChevronRight,
  CheckSquare, Image as ImageIcon, Video, Target, Edit, Sparkles, CheckCircle2, GitFork, Network, PieChart, Trash2, FolderOpen
} from 'lucide-react';
import StepEditorModal from './StepEditorModal';
import CourseAiAssistantSection from './CourseAiAssistantSection';
import CourseResourcesSection from './CourseResourcesSection';
import SkillGraphImportModals, { SkillCategory, ImportType } from '../TeacherCourseManagement/SkillGraphImportModal';

interface CourseEditorProps {
  onBack: () => void;
  courseId: number;
}

export default function CourseEditor({ onBack, courseId }: CourseEditorProps) {
  const [activeMenu, setActiveMenu] = useState('chapters');
  const [editingTask, setEditingTask] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const sidebarMenu = [
    { id: 'info', label: '基本信息', icon: Book },
    { id: 'settings', label: '课程设置', icon: Settings },
    { id: 'chapters', label: '课程章节', icon: Layout },
    { id: 'resources', label: '课程资源', icon: FolderOpen },
    { id: 'ai', label: 'AI技能助手', icon: Cpu },
    { id: 'graph', label: '技能图谱', icon: Target },
  ];

  const chapters = [
    {
      id: 1, 
      title: '第一章：图片标注',
      tasks: [
        { id: '1-1', title: '1-1 任务1：图像基础操作（图文）', type: 'text', hasTrial: true },
        { id: '1-2', title: '1-2 任务1：图像基础操作（视频）', type: 'video', hasTrial: true },
        { id: '1-3', title: '1-3 任务1：图像基础操作（习题）', type: 'exercise', hasTrial: true },
        { id: '1-4', title: '1-4 任务2：图像处理（实验）', type: 'experiment', hasTrial: false },
        { id: '1-5', title: '1-5 任务2：图像处理（报告）', type: 'report', hasTrial: false },
        { id: '1-6', title: '1-6 任务2：图像处理（实验2）', type: 'experiment', hasTrial: false },
        { id: '1-7', title: '1-7 任务3：图像分类标注（图文）', type: 'text', hasTrial: false },
        { id: '1-8', title: '1-8 任务3：图像分类标注（习题）', type: 'exercise', hasTrial: false },
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

  // -------------------------------------------------------------
  // 技能图谱 状态与高保真数据（复刻教师角色我的课程中的图谱配置）
  // -------------------------------------------------------------
  const [graphViewMode, setGraphViewMode] = useState<'outline' | 'tree' | 'network' | 'circle'>('outline');
  const [graphSearchText, setGraphSearchText] = useState('');

  const initialSkillCategories: SkillCategory[] = [
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

  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(initialSkillCategories);
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
      const newCat: SkillCategory = {
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

  const courseTitle = '数据标注与处理（中职）';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden relative select-none">
      {/* 顶部轻量 Toast 提示 */}
      {toastMsg && (
        <div role="status" className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800/90 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-1.5 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className={`${activeMenu === 'ai' ? 'min-h-[200px] border-b-[10px] border-[#f0f2f5] px-[15px] py-5 gap-y-4 flex-wrap xl:flex-nowrap' : 'h-28 border-b border-slate-200 px-6 shadow-sm'} bg-white flex items-center shrink-0 relative z-10`}>
        <div className={`${activeMenu === 'ai' ? 'w-[280px] h-[150px] mr-7 rounded-md' : 'w-48 h-20 mr-6 rounded-lg'} bg-blue-100 overflow-hidden shrink-0 relative`}>
          <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400" alt="cover" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-md">
            数据标注与处理
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <h2 className="text-xl font-bold text-slate-800 mr-2">{courseTitle}</h2>
            <button className="text-[#1890ff] hover:bg-blue-50 p-1 rounded transition-colors"><Edit3 className="w-4 h-4" /></button>
          </div>
          <div className={`flex items-center text-sm text-slate-600 ${activeMenu === 'ai' ? 'flex-wrap gap-x-12 gap-y-5' : 'space-x-8'}`}>
            <div className="flex items-center"><Book className="w-4 h-4 mr-1.5 text-slate-400" /> 专业：<span className="font-medium ml-1">基础</span> <Edit3 className="w-3.5 h-3.5 ml-1 text-[#1890ff] cursor-pointer" /></div>
            <div className="flex items-center"><Layout className="w-4 h-4 mr-1.5 text-slate-400" /> 课程类型：<span className="font-medium ml-1">技能课程</span> <Edit3 className="w-3.5 h-3.5 ml-1 text-[#1890ff] cursor-pointer" /></div>
            <div className="flex items-center"><BarChart className="w-4 h-4 mr-1.5 text-slate-400" /> 层次：<span className="font-medium ml-1">中职</span> <Edit3 className="w-3.5 h-3.5 ml-1 text-[#1890ff] cursor-pointer" /></div>
            <div className={`flex items-center ${activeMenu === 'ai' ? 'basis-full' : ''}`}><TagIcon className="w-4 h-4 mr-1.5 text-slate-400" /> 课程标签：<span className="font-medium ml-1">暂无标签</span> <Edit3 className="w-3.5 h-3.5 ml-1 text-[#1890ff] cursor-pointer" /></div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-3 ml-4 shrink-0 ${activeMenu === 'ai' ? 'self-start' : ''}`}>
          <button onClick={onBack} className="px-4 py-2 bg-white border border-blue-200 text-[#1890ff] rounded text-sm hover:bg-blue-50 transition-colors flex items-center cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回
          </button>
          <button className="px-4 py-2 bg-blue-50 text-[#1890ff] rounded text-sm hover:bg-blue-100 transition-colors flex items-center border border-transparent hover:border-blue-200 cursor-pointer">
            <Eye className="w-4 h-4 mr-1" /> 预览
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center cursor-pointer">
            取消发布
          </button>
        </div>
      </div>

      {/* Main Edit Area */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {/* Left Sidebar */}
        <div className={`${activeMenu === 'ai' ? 'w-[210px] border-r-[10px] border-[#f5f7fa] py-3' : 'w-48 border-r border-slate-200 py-4'} bg-white shrink-0`}>
          <div className={`space-y-1 ${activeMenu === 'ai' ? 'pl-3 pr-0' : 'px-3'}`}>
            {sidebarMenu.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                aria-current={activeMenu === item.id ? 'page' : undefined}
                className={`w-full flex items-center px-4 ${activeMenu === 'ai' ? 'h-10' : 'py-3'} rounded-lg text-sm transition-colors cursor-pointer relative ${
                  activeMenu === item.id 
                    ? 'bg-[#e1eeff] text-[#409eff] font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-4 h-4 mr-3 ${activeMenu === item.id ? 'text-[#1890ff]' : 'text-slate-400'}`} />
                {item.label}
                {activeMenu === item.id && <div className="absolute left-0 w-1 h-8 bg-[#1890ff] rounded-r-md"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className={`flex-1 min-w-0 overflow-y-auto ${activeMenu === 'ai' ? 'bg-white px-4 py-1.5' : 'p-6'}`}>
          {activeMenu === 'ai' && (
            <CourseAiAssistantSection courseId={courseId} onSaved={showToast} />
          )}
          {activeMenu === 'resources' && (
            <CourseResourcesSection courseId={courseId} showToast={showToast} />
          )}
          {activeMenu === 'chapters' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* Actions */}
              <div className="flex items-center justify-between mb-6">
                <button className="px-4 py-2 bg-[#1890ff] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors flex items-center shadow-sm shadow-blue-200 cursor-pointer">
                  <Plus className="w-4 h-4 mr-1" /> 新增章/项目
                </button>
                <div className="flex items-center space-x-3">
                  <button onClick={() => showToast('课程章节信息已保存')} className="px-4 py-1.5 bg-[#1890ff] text-white rounded text-sm hover:bg-blue-600 transition-colors cursor-pointer">保存</button>
                  <button onClick={() => showToast('已设置为试学')} className="px-4 py-1.5 bg-blue-200 text-blue-700 rounded text-sm hover:bg-blue-300 transition-colors cursor-pointer">试学</button>
                  <button onClick={() => showToast('已取消试学')} className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded text-sm hover:bg-slate-300 transition-colors cursor-pointer">取消试学</button>
                  <button onClick={() => showToast('已批量删除所选任务')} className="px-4 py-1.5 bg-red-200 text-red-600 rounded text-sm hover:bg-red-300 transition-colors cursor-pointer">批量删除</button>
                </div>
              </div>

              {/* Chapter List */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {chapters.map(chapter => (
                  <div key={chapter.id}>
                    {/* Chapter Header */}
                    <div className="flex items-center px-4 py-3 bg-slate-50 border-b border-slate-200 group">
                      <input type="checkbox" className="mr-3 rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff]" />
                      <ChevronDown className="w-4 h-4 text-slate-400 mr-2 cursor-pointer" />
                      <span className="font-bold text-slate-800 text-sm">{chapter.title}</span>
                      <Edit3 className="w-3.5 h-3.5 ml-2 text-[#1890ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Tasks */}
                    <div className="divide-y divide-slate-100">
                      {chapter.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between px-4 py-3 hover:bg-blue-50/50 group transition-colors">
                          <div className="flex items-center flex-1">
                            <input type="checkbox" className="mr-3 rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff] ml-7" />
                            {task.type && typeConfig[task.type] && (
                              <span className={`px-2 py-0.5 rounded text-xs font-medium border mr-3 ${typeConfig[task.type].color}`}>
                                {typeConfig[task.type].label}
                              </span>
                            )}
                            
                            <span className="text-sm text-slate-700">{task.title}</span>
                            <Edit3 className="w-3.5 h-3.5 ml-2 text-[#1890ff] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {task.hasTrial && (
                              <span className="ml-3 px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs font-medium border border-pink-200">试学</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setEditingTask({ ...task, chapterName: chapter.title })}
                              className="text-[#1890ff] hover:text-blue-700 text-sm font-medium cursor-pointer"
                            >
                              编辑
                            </button>
                            {task.hasTrial && (
                              <button className="text-red-500 hover:text-red-600 text-sm font-medium cursor-pointer">
                                取消试学
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 技能图谱 Tab（复刻教师角色我的课程中的完整技能图谱设置） */}
          {activeMenu === 'graph' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
              {/* 顶部栏：左侧 技能图谱切换胶囊 (大纲 / 树图 / 网图 / 环形图)，右侧 导入 / 导出 / 新窗口打开 */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                {/* 技能图谱多视图胶囊切换 */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800 mr-1">技能图谱</span>
                  <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs shadow-2xs">
                    <button
                      onClick={() => setGraphViewMode('outline')}
                      className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                        graphViewMode === 'outline'
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
                      className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                        graphViewMode === 'tree'
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
                      className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                        graphViewMode === 'network'
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
                      className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                        graphViewMode === 'circle'
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
                  {/* 导入下拉菜单（蓝色胶囊按钮 + 带顶部小尖角白色气泡菜单） */}
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

              {/* 大纲树视图 */}
              {graphViewMode === 'outline' ? (
                <div className="space-y-3">
                  {/* 输入搜索框 */}
                  <div className="max-w-md">
                    <input
                      type="text"
                      value={graphSearchText}
                      onChange={(e) => setGraphSearchText(e.target.value)}
                      placeholder="请输入"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded outline-none focus:border-blue-500 bg-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* 快捷操作行：全部展开/收起、全选/取消全选、新增、删除 */}
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

                  {/* 多级分类与技能点树形展示 */}
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

                              {/* 分类徽章 */}
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

                                        {/* 技能点徽章 */}
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
                      数据标注与核心技能
                    </div>
                    {/* 周围环绕节点 */}
                    <div className="absolute top-2 left-6 px-3 py-1.5 bg-indigo-800/80 border border-indigo-400 rounded-full text-xs">
                      神经网络与架构
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-800/80 border border-emerald-400 rounded-full text-xs">
                      张量与计算图
                    </div>
                    <div className="absolute bottom-6 left-2 px-3 py-1.5 bg-purple-800/80 border border-purple-400 rounded-full text-xs">
                      卷积与目标检测
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

      {/* 步骤独立编辑弹窗 */}
      {editingTask && (
        <StepEditorModal 
          courseName="数据标注与处理" 
          task={editingTask} 
          chapters={chapters}
          skillCategories={skillCategories}
          onClose={() => setEditingTask(null)} 
        />
      )}

      {/* 技能图谱导入功能独立弹窗群（Excel导入、课程导入、课程章节导入、AI智能导入） */}
      <SkillGraphImportModals
        activeModal={activeImportModal}
        onClose={() => setActiveImportModal(null)}
        currentCategories={skillCategories}
        currentChapters={chapters as any}
        courseTitle={courseTitle}
        onImportSkills={(mergedCategories) => {
          setSkillCategories(mergedCategories);
          showToast('技能图谱已成功导入并智能合并！');
        }}
      />
    </div>
  );
}

