import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Upload, 
  Search, 
  FileText, 
  BookOpen, 
  Layers, 
  Check, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  FileSpreadsheet
} from 'lucide-react';

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

export type ImportType = 'excel' | 'course' | 'chapter' | 'ai' | null;

interface UploadedRefFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'word' | 'txt';
}

interface SkillGraphImportModalsProps {
  activeModal: ImportType;
  onClose: () => void;
  currentCategories: SkillCategory[];
  currentChapters?: Array<{ id: number; title: string; tasks?: Array<{ id: number; title: string }> }>;
  onImportSkills: (newCategories: SkillCategory[]) => void;
  courseTitle?: string;
}

// 模拟预置的标准课程库（用于课程导入）
const PRESET_COURSES = [
  {
    id: 'course-iot',
    name: '物联网系统与嵌入式实战开发',
    category: '工程物联网',
    skillCount: 18,
    categories: [
      {
        id: 'cat-iot-1',
        code: 'A',
        name: '物联网感知与传感技术',
        skills: [
          { id: 's-iot-1', code: '001', name: '温湿度传感器I2C总线驱动' },
          { id: 's-iot-2', code: '002', name: '模拟量ADC采样与滤波' },
          { id: 's-iot-3', code: '003', name: 'RFID射频识别标签解析' }
        ]
      },
      {
        id: 'cat-iot-2',
        code: 'B',
        name: '无线网络通信协议',
        skills: [
          { id: 's-iot-4', code: '001', name: 'MQTT通信机制与Topic订阅' },
          { id: 's-iot-5', code: '002', name: 'CoAP轻量协议应用' },
          { id: 's-iot-6', code: '003', name: 'WiFi与BLE低功耗配网' }
        ]
      }
    ]
  },
  {
    id: 'course-ai',
    name: '人工智能与深度学习实训课程',
    category: '人工智能',
    skillCount: 22,
    categories: [
      {
        id: 'cat-ai-1',
        code: 'A',
        name: '特征工程与数据预处理',
        skills: [
          { id: 's-ai-1', code: '001', name: '连续数据归一化与标准化' },
          { id: 's-ai-2', code: '002', name: '类别特征One-Hot编码' },
          { id: 's-ai-3', code: '003', name: '文本分词与TF-IDF权重计算' }
        ]
      },
      {
        id: 'cat-ai-2',
        code: 'B',
        name: '卷积神经网络与计算机视觉',
        skills: [
          { id: 's-ai-4', code: '001', name: '卷积与池化层前向运算' },
          { id: 's-ai-5', code: '002', name: 'ResNet残差块结构解析' },
          { id: 's-ai-6', code: '003', name: 'YOLO目标检测锚框回归' }
        ]
      }
    ]
  },
  {
    id: 'course-bigdata',
    name: '大数据分布式计算与实时处理',
    category: '大数据',
    skillCount: 16,
    categories: [
      {
        id: 'cat-bd-1',
        code: 'A',
        name: 'Hadoop与分布式存储',
        skills: [
          { id: 's-bd-1', code: '001', name: 'HDFS元数据与Block管理机制' },
          { id: 's-bd-2', code: '002', name: 'MapReduce切片与Shuffle过程' }
        ]
      },
      {
        id: 'cat-bd-2',
        code: 'B',
        name: 'Spark与实时流计算',
        skills: [
          { id: 's-bd-3', code: '001', name: 'Spark RDD转换算子与行动算子' },
          { id: 's-bd-4', code: '002', name: 'Structured Streaming事件时间水印' }
        ]
      }
    ]
  }
];

// 处理重名添加序号后缀的辅助函数
export const deduplicateAndMergeSkills = (
  existingCategories: SkillCategory[],
  incomingCategories: SkillCategory[]
): SkillCategory[] => {
  const existingCatNames = new Set(existingCategories.map(c => c.name));
  const existingSkillNames = new Set(existingCategories.flatMap(c => c.skills.map(s => s.name)));

  // 生成下一个唯一的分类名称
  const getUniqueCatName = (name: string): string => {
    if (!existingCatNames.has(name)) {
      existingCatNames.add(name);
      return name;
    }
    let count = 1;
    while (existingCatNames.has(`${name} (${count})`)) {
      count++;
    }
    const unique = `${name} (${count})`;
    existingCatNames.add(unique);
    return unique;
  };

  // 生成下一个唯一的技能名称
  const getUniqueSkillName = (name: string): string => {
    if (!existingSkillNames.has(name)) {
      existingSkillNames.add(name);
      return name;
    }
    let count = 1;
    while (existingSkillNames.has(`${name} (${count})`)) {
      count++;
    }
    const unique = `${name} (${count})`;
    existingSkillNames.add(unique);
    return unique;
  };

  // 计算新的分类 code，如已存在 A, B, C 则依次生成 D, E, F...
  const usedCodes = new Set(existingCategories.map(c => c.code.toUpperCase()));
  const getNextCatCode = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < letters.length; i++) {
      const code = letters[i];
      if (!usedCodes.has(code)) {
        usedCodes.add(code);
        return code;
      }
    }
    return `C${Date.now() % 100}`;
  };

  const processedIncoming: SkillCategory[] = incomingCategories.map(cat => {
    const newCatCode = getNextCatCode();
    const newCatName = getUniqueCatName(cat.name);
    const newSkills = cat.skills.map((s, idx) => ({
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      code: String(idx + 1).padStart(3, '0'),
      name: getUniqueSkillName(s.name)
    }));

    return {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      code: newCatCode,
      name: newCatName,
      skills: newSkills
    };
  });

  return [...existingCategories, ...processedIncoming];
};

export default function SkillGraphImportModals({
  activeModal,
  onClose,
  currentCategories,
  currentChapters = [],
  onImportSkills,
  courseTitle = '当前课程'
}: SkillGraphImportModalsProps) {
  // -------------------------------------------------------------
  // AI智能导入 状态管理（完全还原截图二 + 上传参考文件功能）
  // -------------------------------------------------------------
  const [promptText, setPromptText] = useState('');
  const [refFiles, setRefFiles] = useState<UploadedRefFile[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generatedCategories, setGeneratedCategories] = useState<SkillCategory[]>([]);
  const [searchPreviewText, setSearchPreviewText] = useState('');
  const [selectedPreviewIds, setSelectedPreviewIds] = useState<string[]>([]);
  const [collapsedPreviewCatIds, setCollapsedPreviewCatIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // 课程导入 状态
  // -------------------------------------------------------------
  const [selectedCourseId, setSelectedCourseId] = useState<string>(PRESET_COURSES[0].id);

  // -------------------------------------------------------------
  // 课程章节导入 状态
  // -------------------------------------------------------------
  const [selectedChapterIds, setSelectedChapterIds] = useState<number[]>(
    currentChapters.map(c => c.id)
  );

  // -------------------------------------------------------------
  // Excel导入 状态
  // -------------------------------------------------------------
  const [uploadedExcelName, setUploadedExcelName] = useState<string>('');
  const excelInputRef = useRef<HTMLInputElement>(null);

  // 上传参考文件 (PDF / Word / TXT)
  const handleRefFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedRefFile[] = Array.from(files).map((file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type: 'pdf' | 'word' | 'txt' = 'txt';
      if (ext === 'pdf') type = 'pdf';
      else if (ext === 'doc' || ext === 'docx') type = 'word';

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        size: sizeStr,
        type
      };
    });

    setRefFiles(prev => [...prev, ...newFiles]);
  };

  const removeRefFile = (fileId: string) => {
    setRefFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // 清空 AI 输入
  const handleClearAiInput = () => {
    setPromptText('');
    setRefFiles([]);
    setGeneratedCategories([]);
    setSelectedPreviewIds([]);
  };

  // AI 智能生成图谱
  const handleGenerateByAi = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);

      // 提取提示词关键词与文件名
      const keywords = (promptText + ' ' + refFiles.map(f => f.name).join(' ')).toLowerCase();

      let mockGenerated: SkillCategory[] = [];

      if (keywords.includes('物联') || keywords.includes('传感器') || keywords.includes('单片机') || keywords.includes('嵌入式')) {
        mockGenerated = [
          {
            id: 'gen-cat-1',
            code: 'A',
            name: '嵌入式驱动与接口通信',
            skills: [
              { id: 'gen-s-1', code: '001', name: 'UART异步串口通信解析' },
              { id: 'gen-s-2', code: '002', name: 'SPI外设总线双向数据交互' },
              { id: 'gen-s-3', code: '003', name: 'GPIO中断时序与消抖控制' },
              { id: 'gen-s-4', code: '004', name: 'PWM脉宽调制与舵机角度控制' }
            ]
          },
          {
            id: 'gen-cat-2',
            code: 'B',
            name: '边缘计算与网络数据流',
            skills: [
              { id: 'gen-s-5', code: '001', name: 'MQTT物联网协议长连接保活' },
              { id: 'gen-s-6', code: '002', name: 'JSON与Protobuf报文轻量序列化' },
              { id: 'gen-s-7', code: '003', name: '边缘网关本地数据缓存与重发机制' }
            ]
          },
          {
            id: 'gen-cat-3',
            code: 'C',
            name: '云端控制与可视化组态',
            skills: [
              { id: 'gen-s-8', code: '001', name: 'ThingsBoard平台设备数字孪生建模' },
              { id: 'gen-s-9', code: '002', name: '遥测遥控指令下发规则链引擎' }
            ]
          }
        ];
      } else {
        // 通用或深度学习图谱
        mockGenerated = [
          {
            id: 'gen-cat-1',
            code: 'A',
            name: '核心基础理论与算法',
            skills: [
              { id: 'gen-s-1', code: '001', name: '核心数学原理与数学模型构建' },
              { id: 'gen-s-2', code: '002', name: '典型数据结构与系统抽象' },
              { id: 'gen-s-3', code: '003', name: '约束条件与损失评价函数定义' }
            ]
          },
          {
            id: 'gen-cat-2',
            code: 'B',
            name: '工程实现与系统设计',
            skills: [
              { id: 'gen-s-4', code: '001', name: '模块化接口规范与架构分层' },
              { id: 'gen-s-5', code: '002', name: '核心功能单元代码实现与自测' },
              { id: 'gen-s-6', code: '003', name: '鲁棒性断言与异常边界防御' }
            ]
          },
          {
            id: 'gen-cat-3',
            code: 'C',
            name: '综合实验与效能评估',
            skills: [
              { id: 'gen-s-7', code: '001', name: '实验工况模拟与仿真环境搭建' },
              { id: 'gen-s-8', code: '002', name: '多维指标分析与调优报告编制' }
            ]
          }
        ];
      }

      setGeneratedCategories(mockGenerated);
      // 默认全选所有生成的分类和技能
      const allIds = mockGenerated.flatMap(c => [c.id, ...c.skills.map(s => s.id)]);
      setSelectedPreviewIds(allIds);
      setCollapsedPreviewCatIds([]);
    }, 1000);
  };

  // 过滤后的生成技能
  const filteredGeneratedCategories = useMemo(() => {
    if (!searchPreviewText.trim()) return generatedCategories;
    const kw = searchPreviewText.toLowerCase();
    return generatedCategories
      .map(cat => {
        const matchCat = cat.name.toLowerCase().includes(kw);
        const matchedSkills = cat.skills.filter(s => s.name.toLowerCase().includes(kw));
        if (matchCat) return cat;
        if (matchedSkills.length > 0) {
          return { ...cat, skills: matchedSkills };
        }
        return null;
      })
      .filter(Boolean) as SkillCategory[];
  }, [generatedCategories, searchPreviewText]);

  // 全部生成项的 ID 集合
  const allGeneratedItemIds = useMemo(() => {
    return generatedCategories.flatMap(c => [c.id, ...c.skills.map(s => s.id)]);
  }, [generatedCategories]);

  // 预览列表全选 / 全不选
  const handleToggleSelectAllPreview = () => {
    if (selectedPreviewIds.length > 0) {
      setSelectedPreviewIds([]);
    } else {
      setSelectedPreviewIds(allGeneratedItemIds);
    }
  };

  // 展开 / 收起全部预览项
  const handleToggleCollapseAllPreview = () => {
    if (collapsedPreviewCatIds.length === generatedCategories.length) {
      setCollapsedPreviewCatIds([]);
    } else {
      setCollapsedPreviewCatIds(generatedCategories.map(c => c.id));
    }
  };

  // 切换单个分类勾选
  const handleToggleCatSelect = (cat: SkillCategory) => {
    const catItemIds = [cat.id, ...cat.skills.map(s => s.id)];
    const isCatFullySelected = catItemIds.every(id => selectedPreviewIds.includes(id));

    if (isCatFullySelected) {
      setSelectedPreviewIds(prev => prev.filter(id => !catItemIds.includes(id)));
    } else {
      setSelectedPreviewIds(prev => Array.from(new Set([...prev, ...catItemIds])));
    }
  };

  // 切换单个技能勾选
  const handleToggleSkillSelect = (catId: string, skillId: string, catSkills: SkillItem[]) => {
    const isChecked = selectedPreviewIds.includes(skillId);
    let nextSelected: string[];

    if (isChecked) {
      nextSelected = selectedPreviewIds.filter(id => id !== skillId);
      // 若分类下的技能全不选，取消分类勾选
      const remainingSkills = catSkills.filter(s => s.id !== skillId && nextSelected.includes(s.id));
      if (remainingSkills.length === 0) {
        nextSelected = nextSelected.filter(id => id !== catId);
      }
    } else {
      nextSelected = [...selectedPreviewIds, skillId];
      // 如果选了技能，自动把父分类勾选上
      if (!nextSelected.includes(catId)) {
        nextSelected.push(catId);
      }
    }
    setSelectedPreviewIds(nextSelected);
  };

  // 提交 AI 导入
  const handleSubmitAiImport = () => {
    const categoriesToImport: SkillCategory[] = [];

    generatedCategories.forEach(cat => {
      const selectedSkills = cat.skills.filter(s => selectedPreviewIds.includes(s.id));
      if (selectedSkills.length > 0) {
        categoriesToImport.push({
          ...cat,
          skills: selectedSkills
        });
      }
    });

    if (categoriesToImport.length === 0) return;

    const merged = deduplicateAndMergeSkills(currentCategories, categoriesToImport);
    onImportSkills(merged);
    onClose();
  };

  // 提交课程导入
  const handleSubmitCourseImport = () => {
    const targetCourse = PRESET_COURSES.find(c => c.id === selectedCourseId);
    if (!targetCourse) return;

    const merged = deduplicateAndMergeSkills(currentCategories, targetCourse.categories);
    onImportSkills(merged);
    onClose();
  };

  // 提交章节导入
  const handleSubmitChapterImport = () => {
    const targetChapters = currentChapters.filter(c => selectedChapterIds.includes(c.id));
    if (targetChapters.length === 0) return;

    const incomingCategories: SkillCategory[] = targetChapters.map((chap, idx) => ({
      id: `chap-cat-${chap.id}`,
      code: String.fromCharCode(65 + idx),
      name: chap.title.replace(/^第[一二三四五六七八九十\d]+章[\s:：]*/, ''),
      skills: (chap.tasks && chap.tasks.length > 0)
        ? chap.tasks.map((task, tIdx) => ({
            id: `task-skill-${task.id}`,
            code: String(tIdx + 1).padStart(3, '0'),
            name: task.title.replace(/^步骤[\s:：\d]+/, '')
          }))
        : [
            { id: `ts-1-${chap.id}`, code: '001', name: `${chap.title} 核心知识体系理解` },
            { id: `ts-2-${chap.id}`, code: '002', name: `${chap.title} 实验步骤与动手验证` }
          ]
    }));

    const merged = deduplicateAndMergeSkills(currentCategories, incomingCategories);
    onImportSkills(merged);
    onClose();
  };

  // 提交 Excel 导入
  const handleSubmitExcelImport = () => {
    // 模拟从 Excel 解析生成的图谱结构
    const parsedFromExcel: SkillCategory[] = [
      {
        id: 'excel-cat-1',
        code: 'A',
        name: '标准体系技能模块一',
        skills: [
          { id: 'es-1', code: '001', name: '系统环境搭建与依赖排查' },
          { id: 'es-2', code: '002', name: '核心参数配置与运行验证' }
        ]
      },
      {
        id: 'excel-cat-2',
        code: 'B',
        name: '标准体系技能模块二',
        skills: [
          { id: 'es-3', code: '001', name: '功能集成与异常调试定位' }
        ]
      }
    ];

    const merged = deduplicateAndMergeSkills(currentCategories, parsedFromExcel);
    onImportSkills(merged);
    onClose();
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
      {/* -------------------------------------------------------------
          1. AI 智能导入弹窗（严格对齐截图二 + 增加上传文件功能）
         ------------------------------------------------------------- */}
      {activeModal === 'ai' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="w-[94vw] max-w-4xl h-[86vh] max-h-[660px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        >
          {/* 弹窗 Header：标题 + 说明 + 关闭按钮（高保真还原截图二） */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center">
              <h3 className="text-base font-bold text-slate-800 tracking-tight">AI智能导入</h3>
              <span className="text-xs text-slate-400 font-normal ml-3">
                根据提示词生成技能图谱，预览后确认添加
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 左右分栏主体区域 */}
          <div className="flex-1 min-h-0 flex divide-x divide-slate-100 overflow-hidden">
            {/* 左侧输入区域（占 48%） */}
            <div className="w-[48%] flex flex-col p-5 space-y-3 overflow-y-auto">
              {/* 顶部操作按钮：清空、生成 */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleClearAiInput}
                  className="px-3 py-1 bg-[#40a9ff] hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  清空
                </button>
                <button
                  type="button"
                  onClick={handleGenerateByAi}
                  disabled={isAiGenerating}
                  className="px-3.5 py-1 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Sparkles className={`w-3 h-3 ${isAiGenerating ? 'animate-spin' : ''}`} />
                  <span>{isAiGenerating ? '生成中...' : '生成'}</span>
                </button>
              </div>

              {/* 提示词描述输入卡片（截图二样式） */}
              <div className="border border-dashed border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/30 flex-1 flex flex-col">
                <label className="text-xs font-medium text-slate-700 block">
                  提示词描述：
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="请输入具体描述：例如：请帮我生成和当前课程主题相关的技能图谱，要求至少10个分类，每个分类至少20个技能点"
                  className="w-full flex-1 min-h-[140px] p-3 text-xs border border-slate-200 rounded-md outline-none focus:border-[#1890ff] bg-white resize-none placeholder:text-slate-400 leading-relaxed transition-colors"
                />

                {/* 增加文件上传功能（核心需求）：除了提示词，还可以上传 pdf、word、txt 文件作为参考 */}
                <div className="pt-2 border-t border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center">
                      <BookOpen className="w-3.5 h-3.5 mr-1 text-[#1890ff]" />
                      参考文档上传（支持 PDF、Word、TXT）：
                    </span>
                    <span className="text-[11px] text-slate-400">单文件 ≤ 20MB</span>
                  </div>

                  {/* 隐藏的上传 input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleRefFileUpload}
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />

                  {/* 点击/拖拽上传按钮区域 */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-slate-300 hover:border-[#1890ff] bg-white hover:bg-blue-50/20 rounded-md py-2 px-3 text-center cursor-pointer transition-colors flex items-center justify-center space-x-2 text-xs text-slate-500"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#1890ff]" />
                    <span>点击上传课程大纲或讲义资料（.pdf / .doc / .txt）</span>
                  </div>

                  {/* 已上传参考文件列表 */}
                  {refFiles.length > 0 && (
                    <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                      {refFiles.map(file => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between bg-white border border-slate-200 rounded px-2.5 py-1 text-[11px] text-slate-700"
                        >
                          <div className="flex items-center space-x-1.5 truncate max-w-[260px]">
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${
                              file.type === 'pdf' ? 'text-red-500' :
                              file.type === 'word' ? 'text-blue-500' : 'text-slate-500'
                            }`} />
                            <span className="truncate">{file.name}</span>
                            <span className="text-slate-400 shrink-0">({file.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRefFile(file.id)}
                            className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧生成预览区域（占 52%） */}
            <div className="w-[52%] flex flex-col p-5 space-y-3 overflow-hidden">
              {/* 顶部搜索框：占位符“请输入” */}
              <div>
                <input
                  type="text"
                  value={searchPreviewText}
                  onChange={(e) => setSearchPreviewText(e.target.value)}
                  placeholder="请输入"
                  className="w-full h-8 px-3 text-xs border border-slate-200 rounded outline-none focus:border-[#1890ff] placeholder:text-slate-400 bg-white"
                />
              </div>

              {/* 快捷操作：全部展开、全部不选 */}
              <div className="flex items-center space-x-4 text-xs">
                <button
                  type="button"
                  onClick={handleToggleCollapseAllPreview}
                  className="text-[#1890ff] hover:text-blue-700 font-medium cursor-pointer"
                >
                  {collapsedPreviewCatIds.length === generatedCategories.length ? '全部展开' : '全部收起'}
                </button>
                <button
                  type="button"
                  onClick={handleToggleSelectAllPreview}
                  className="text-[#1890ff] hover:text-blue-700 font-medium cursor-pointer"
                >
                  {selectedPreviewIds.length > 0 ? '全部不选' : '全部选中'}
                </button>
              </div>

              {/* 预览列表展示区 */}
              <div className="flex-1 min-h-0 overflow-y-auto border border-slate-100 rounded-lg bg-slate-50/30 p-3">
                {isAiGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16 space-y-3">
                    <Sparkles className="w-8 h-8 text-[#1890ff] animate-spin" />
                    <p className="text-xs font-medium text-slate-600">
                      AI 正在解析提示词与参考文档，构建技能图谱节点...
                    </p>
                  </div>
                ) : generatedCategories.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                    <p className="text-sm font-medium text-slate-400">暂无数据</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    {filteredGeneratedCategories.map(cat => {
                      const isCollapsed = collapsedPreviewCatIds.includes(cat.id);
                      const isCatSelected = selectedPreviewIds.includes(cat.id);

                      return (
                        <div key={cat.id} className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                          {/* 分类节点行 */}
                          <div className="flex items-center space-x-2 select-none">
                            <button
                              type="button"
                              onClick={() => {
                                setCollapsedPreviewCatIds(prev =>
                                  prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                );
                              }}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                            >
                              {isCollapsed ? (
                                <ChevronRight className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <input
                              type="checkbox"
                              checked={isCatSelected}
                              onChange={() => handleToggleCatSelect(cat)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                            />

                            <span className="font-bold text-slate-800">
                              {cat.code}. {cat.name}
                            </span>

                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 border border-blue-100">
                              分类
                            </span>

                            <span className="text-[11px] text-slate-400 ml-auto">
                              共 {cat.skills.length} 个技能点
                            </span>
                          </div>

                          {/* 技能点子列表 */}
                          {!isCollapsed && (
                            <div className="pl-6 pt-1 space-y-1">
                              {cat.skills.map(skill => {
                                const isSkillSelected = selectedPreviewIds.includes(skill.id);
                                return (
                                  <div
                                    key={skill.id}
                                    onClick={() => handleToggleSkillSelect(cat.id, skill.id, cat.skills)}
                                    className="flex items-center space-x-2 py-1 px-1.5 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSkillSelected}
                                      onChange={() => {}}
                                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                                    />
                                    <span className="text-slate-700">
                                      {skill.code}. {skill.name}
                                    </span>
                                    <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 ml-auto">
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
          </div>

          {/* 弹窗 Footer（高保真还原截图二）：左侧红色提示 + 右侧取消与提交 */}
          <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
            <span className="text-xs text-red-500 font-normal">
              提示：导入如有同名，将在名称后添加数字以区分。
            </span>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded text-xs transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSubmitAiImport}
                disabled={selectedPreviewIds.length === 0}
                className={`px-5 py-1.5 rounded text-xs font-medium transition-colors shadow-2xs cursor-pointer ${
                  selectedPreviewIds.length > 0
                    ? 'bg-[#1890ff] hover:bg-blue-600 text-white'
                    : 'bg-[#91d5ff] text-white cursor-not-allowed'
                }`}
              >
                提交
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* -------------------------------------------------------------
          2. Excel 导入弹窗
         ------------------------------------------------------------- */}
      {activeModal === 'excel' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Excel 导入技能图谱</h3>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-[#1890ff]" />
                <div>
                  <div className="font-semibold text-slate-800">下载标准导入模板</div>
                  <div className="text-[11px] text-slate-500">按格式规范填写技能分类、代码及技能点</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('已为您下载「技能图谱标准模板.xlsx」')}
                className="px-3 py-1 bg-white border border-[#91d5ff] text-[#1890ff] rounded text-xs hover:bg-blue-50 font-medium flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载模板</span>
              </button>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1.5">上传 Excel 文件：</label>
              <input
                type="file"
                ref={excelInputRef}
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setUploadedExcelName(file.name);
                }}
                className="hidden"
              />
              <div
                onClick={() => excelInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#1890ff] bg-slate-50/50 hover:bg-blue-50/30 rounded-lg p-6 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                {uploadedExcelName ? (
                  <div className="text-[#1890ff] font-semibold">{uploadedExcelName}</div>
                ) : (
                  <>
                    <p className="font-medium text-slate-700">点击或拖拽 Excel 文件至此处</p>
                    <p className="text-[11px] text-slate-400 mt-1">支持 .xlsx, .xls 文件格式</p>
                  </>
                )}
              </div>
            </div>

            <div className="text-red-500 text-[11px]">
              提示：导入如有同名，将在名称后添加数字以区分。
            </div>
          </div>

          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:bg-white rounded text-xs cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmitExcelImport}
              disabled={!uploadedExcelName}
              className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 disabled:bg-blue-300 text-white rounded text-xs font-medium cursor-pointer"
            >
              确认导入
            </button>
          </div>
        </motion.div>
      )}

      {/* -------------------------------------------------------------
          3. 课程导入弹窗
         ------------------------------------------------------------- */}
      {activeModal === 'course' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#1890ff]" />
              <h3 className="text-sm font-bold text-slate-800">从已有课程导入技能图谱</h3>
            </div>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <p className="text-slate-500">
              请选择要复用技能图谱的已有标杆课程，导入后自动合并入本课程图谱：
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {PRESET_COURSES.map(course => {
                const isSelected = selectedCourseId === course.id;
                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#1890ff] bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-800">{course.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        学科分类：{course.category} · 包含 {course.skillCount} 个标准技能点
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#1890ff] shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="text-red-500 text-[11px] pt-1">
              提示：导入如有同名，将在名称后添加数字以区分。
            </div>
          </div>

          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:bg-white rounded text-xs cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmitCourseImport}
              className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer"
            >
              确认导入
            </button>
          </div>
        </motion.div>
      )}

      {/* -------------------------------------------------------------
          4. 课程章节导入弹窗
         ------------------------------------------------------------- */}
      {activeModal === 'chapter' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#1890ff]" />
              <h3 className="text-sm font-bold text-slate-800">从当前课程章节导入技能点</h3>
            </div>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <p className="text-slate-500">
              将根据当前课程「{courseTitle}」已编辑的章节目录及实验任务自动生成技能分类与技能点：
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto border border-slate-100 rounded-lg p-2.5 bg-slate-50/40">
              {currentChapters.length === 0 ? (
                <div className="py-6 text-center text-slate-400">当前课程暂未配置章节</div>
              ) : (
                currentChapters.map(chap => {
                  const isChecked = selectedChapterIds.includes(chap.id);
                  return (
                    <div
                      key={chap.id}
                      onClick={() => {
                        setSelectedChapterIds(prev =>
                          isChecked ? prev.filter(id => id !== chap.id) : [...prev, chap.id]
                        );
                      }}
                      className="flex items-center space-x-2 py-1.5 px-2 rounded hover:bg-white cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#1890ff] focus:ring-0 cursor-pointer"
                      />
                      <span className="font-medium text-slate-700">{chap.title}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">
                        含 {chap.tasks?.length || 0} 个实验步骤
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-red-500 text-[11px]">
              提示：导入如有同名，将在名称后添加数字以区分。
            </div>
          </div>

          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:bg-white rounded text-xs cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmitChapterImport}
              disabled={selectedChapterIds.length === 0}
              className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 disabled:bg-blue-300 text-white rounded text-xs font-medium cursor-pointer"
            >
              一键生成导入
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
