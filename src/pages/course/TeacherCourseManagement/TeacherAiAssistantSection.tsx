import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Cpu,
  Sparkles,
  Target,
  Check,
  Upload,
  X,
  Database,
  ChevronDown,
  Search,
  Send,
  RotateCcw,
  Plus,
  ArrowRight,
  Info,
  Copy,
  CheckCircle2,
  FileText,
  HelpCircle,
  Sliders,
  Terminal,
  MessageSquare,
  Flame,
  AlertCircle
} from 'lucide-react';

export interface KnowledgeBaseFile {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
  status: '已向量化' | '解析中' | '已就绪';
}

export interface TeacherKnowledgeBaseItem {
  id: string;
  name: string;
  docsCount: number;
  chunksCount?: number;
  updateTime: string;
  desc: string;
  files: KnowledgeBaseFile[];
}

interface TeacherAiAssistantSectionProps {
  knowledgeBases: TeacherKnowledgeBaseItem[];
  selectedKbIds: string[];
  setSelectedKbIds: React.Dispatch<React.SetStateAction<string[]>>;
  showToast: (msg: string) => void;
}

// 预设人设与系统提示词模板
const SYSTEM_PROMPT_TEMPLATES = [
  {
    id: 'code-mentor',
    name: '代码排错导师',
    tag: '聚焦实践',
    desc: '侧重于代码诊断、环境错误排查与代码重构，给出具体修复代码',
    prompt: `你是一名高校计算机与深度学习课程的专属代码指导助教。
在回答学生问题时：
1. 优先诊断代码或环境报错根因，给出规范、可直接运行的示例修复代码；
2. 结合绑定的课程排错知识库，指出容易踩坑的张量形状、驱动依赖和超参数设置；
3. 语言严谨平实，适当引导学生掌握断点调试与日志排查技能。`
  },
  {
    id: 'theory-tutor',
    name: '理论原理解构师',
    tag: '注重概念',
    desc: '擅长苏格拉底式启发，公式推导与算法直觉拆解，辅以生活化比喻',
    prompt: `你是一名专业富有启发性的理论课程AI助教。
在回答学生关于模型架构、损失函数或优化算法问题时：
1. 先用直观生动的比喻阐述算法核心思想，再逐步引入数学公式与推导步骤；
2. 结合当前课程绑定的理论大纲和课件知识库，确保术语标准统一；
3. 在回答末尾附带 1~2 个引导性启发思考题，鼓励学生深入探索。`
  },
  {
    id: 'exam-coach',
    name: '实训通关教练',
    tag: '步骤指引',
    desc: '紧扣实训大纲与考核指标，按步骤指导学生完成实验要求与报告',
    prompt: `你是一名实训实验专项通关教练。
你的职责是指导学生高效完成实验任务：
1. 紧密围绕实训任务书与实验评分标准，给出清晰的 Step-by-Step 实施指引；
2. 强调实验报告的规范性与分析深度（如对比实验设计、消融实验观察）；
3. 严禁直接代写完整报告，采用提问和引导方式辅助学生得出结论。`
  },
  {
    id: 'general-assistant',
    name: '全能答疑助教',
    tag: '综合均衡',
    desc: '兼顾理论讲解与动手实践，适应各种课程问答场景',
    prompt: `你是一名亲切耐心的课程AI专属学习学伴。
1. 结合绑定的课程专业知识库，准确回答学生的课程内容、实验实训及学习路线疑问；
2. 回复结构清晰，善于使用要点、代码块及知识拓展；
3. 态度积极友好，鼓励学生主动动手实践。`
  }
];

// 快捷推荐问题库候选
const SUGGESTED_PRESETS = [
  '请简要介绍这门课程的核心知识脉络与学习建议',
  'PyTorch 训练中出现张量维度不匹配（Dimension mismatch）如何排查？',
  '损失函数中的 CrossEntropyLoss 与 MSELoss 在应用场景上有何区别？',
  '深度前馈网络中 Dropout 的作用机制和防过拟合原理是什么？',
  '常用优化器 Adam 相比传统 SGD 有哪些优势，何时选用？',
  '本门课程绑定的实验环境与提交规范有哪些核心要求？'
];

export default function TeacherAiAssistantSection({
  knowledgeBases,
  selectedKbIds,
  setSelectedKbIds,
  showToast
}: TeacherAiAssistantSectionProps) {
  // -------------------------------------------------------------
  // 1. 左侧可编辑状态（编辑态）
  // -------------------------------------------------------------
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState('bot-1');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>('');
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // 知识库下拉搜索与状态
  const [isKbDropdownOpen, setIsKbDropdownOpen] = useState(false);
  const [kbDropdownSearch, setKbDropdownSearch] = useState('');
  const kbDropdownRef = useRef<HTMLDivElement>(null);

  // 预置提示词与开场设置
  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT_TEMPLATES[0].prompt);
  const [activeTemplateId, setActiveTemplateId] = useState('code-mentor');
  const [presetPrompts, setPresetPrompts] = useState<string[]>([
    '请简要介绍这门课程的核心知识脉络与学习建议',
    'PyTorch 训练中出现张量维度不匹配如何排查？',
    '常用优化器 Adam 相比传统 SGD 有哪些优势与适用场景？'
  ]);
  const [newPresetInput, setNewPresetInput] = useState('');
  const [greetingMessage, setGreetingMessage] = useState(
    '同学你好！我是《深度学习与计算机视觉》专属AI技能助手。我已经加载了本课程的核心原理库与实训排错集，学习中有任何困惑都可以随时问我~'
  );

  // -------------------------------------------------------------
  // 2. 已保存生效的配置状态（生效态，右侧调试窗口依据此状态运行）
  // -------------------------------------------------------------
  const [savedConfig, setSavedConfig] = useState({
    isEnabled: true,
    selectedKbIds: ['kb-1', 'kb-2'],
    avatar: 'bot-1',
    customAvatarUrl: '',
    systemPrompt: SYSTEM_PROMPT_TEMPLATES[0].prompt,
    presetPrompts: [
      '请简要介绍这门课程的核心知识脉络与学习建议',
      'PyTorch 训练中出现张量维度不匹配如何排查？',
      '常用优化器 Adam 相比传统 SGD 有哪些优势与适用场景？'
    ],
    greetingMessage: '同学你好！我是《深度学习与计算机视觉》专属AI技能助手。我已经加载了本课程的核心原理库与实训排错集，学习中有任何困惑都可以随时问我~',
    savedAt: '2026-09-20 20:20:00'
  });

  // 判断是否有未保存的改动
  const isConfigDirty =
    isAiEnabled !== savedConfig.isEnabled ||
    selectedAvatar !== savedConfig.avatar ||
    customAvatarUrl !== savedConfig.customAvatarUrl ||
    systemPrompt !== savedConfig.systemPrompt ||
    greetingMessage !== savedConfig.greetingMessage ||
    JSON.stringify(selectedKbIds.sort()) !== JSON.stringify(savedConfig.selectedKbIds.sort()) ||
    JSON.stringify(presetPrompts) !== JSON.stringify(savedConfig.presetPrompts);

  // -------------------------------------------------------------
  // 3. 右侧对话调试窗口状态
  // -------------------------------------------------------------
  interface ChatMessage {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    time: string;
    referencedKbs?: string[];
  }

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showConfigInspector, setShowConfigInspector] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // 预设卡通头像定义
  const avatarOptions = [
    { id: 'bot-1', name: '灵动学伴', icon: Bot, color: 'bg-blue-600', gradient: 'from-blue-600 to-indigo-600' },
    { id: 'bot-2', name: '智慧教授', icon: Cpu, color: 'bg-indigo-600', gradient: 'from-indigo-600 to-purple-600' },
    { id: 'bot-3', name: '代码助手', icon: Sparkles, color: 'bg-emerald-600', gradient: 'from-emerald-600 to-teal-600' },
    { id: 'bot-4', name: '实训领航员', icon: Target, color: 'bg-purple-600', gradient: 'from-purple-600 to-pink-600' },
  ];

  // 获取当前生效头像组件或图像
  const getAvatarBadge = (avatarId: string, customUrl: string, size = 'w-9 h-9') => {
    if (avatarId === 'custom' && customUrl) {
      return (
        <img
          src={customUrl}
          alt="自定义头像"
          className={`${size} rounded-xl object-cover shadow-2xs border border-white/40`}
        />
      );
    }
    const found = avatarOptions.find(a => a.id === avatarId) || avatarOptions[0];
    const IconComp = found.icon;
    return (
      <div className={`${size} rounded-xl bg-gradient-to-tr ${found.gradient} text-white flex items-center justify-center shadow-2xs shrink-0`}>
        <IconComp className="w-4 h-4" />
      </div>
    );
  };

  const currentAvatarName =
    savedConfig.avatar === 'custom'
      ? '自定义图标'
      : (avatarOptions.find(a => a.id === savedConfig.avatar)?.name || 'AI技能助手');

  // 点击外部关闭知识库下拉
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (kbDropdownRef.current && !kbDropdownRef.current.contains(event.target as Node)) {
        setIsKbDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 消息自动滚底
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isThinking]);

  // 处理自定义头像上传
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('请上传图片格式文件（PNG/JPG/SVG）');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('头像文件请小于 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomAvatarUrl(result);
        setSelectedAvatar('custom');
        showToast('已成功上传自定义头像，点击「保存助手配置」即可生效！');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 添加一条预置提示词
  const handleAddPresetPrompt = () => {
    const trimmed = newPresetInput.trim();
    if (!trimmed) return;
    if (presetPrompts.includes(trimmed)) {
      showToast('该提示词已在列表中');
      return;
    }
    if (presetPrompts.length >= 8) {
      showToast('最多配置 8 条快捷预置提示词');
      return;
    }
    setPresetPrompts([...presetPrompts, trimmed]);
    setNewPresetInput('');
    showToast('已添加预置提示词');
  };

  // 删除一条预置提示词
  const handleDeletePresetPrompt = (index: number) => {
    setPresetPrompts(presetPrompts.filter((_, i) => i !== index));
  };

  // 保存当前全部配置
  const handleSaveConfig = () => {
    if (selectedKbIds.length === 0) {
      showToast('请至少绑定一个课程专属知识库');
      return;
    }
    if (!systemPrompt.trim()) {
      showToast('系统提示词不能为空');
      return;
    }

    const nowStr = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    setSavedConfig({
      isEnabled: isAiEnabled,
      selectedKbIds: [...selectedKbIds],
      avatar: selectedAvatar,
      customAvatarUrl,
      systemPrompt: systemPrompt.trim(),
      presetPrompts: [...presetPrompts],
      greetingMessage: greetingMessage.trim() || '同学你好！有什么问题随时问我~',
      savedAt: nowStr
    });

    showToast('AI技能助手配置已保存成功！调试窗口已即刻应用最新配置。');
  };

  // -------------------------------------------------------------
  // 4. 调试问答模拟交互引擎
  // -------------------------------------------------------------
  const handleSendChatMessage = (textToSend?: string) => {
    const q = (textToSend !== undefined ? textToSend : chatInput).trim();
    if (!q) return;

    if (!savedConfig.isEnabled) {
      showToast('当前 AI 技能助手处于关闭状态，请在左侧启用并保存后再调试');
      return;
    }

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: q,
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (textToSend === undefined) setChatInput('');
    setIsThinking(true);

    // 智能模拟响应生成
    setTimeout(() => {
      // 计算命中的知识库文件
      const matchedBases = knowledgeBases.filter(kb => savedConfig.selectedKbIds.includes(kb.id));
      const referencedFiles: string[] = [];

      if (q.includes('大纲') || q.includes('知识脉络') || q.includes('课程') || q.includes('学习')) {
        referencedFiles.push('校本特色实训指导大纲与作业规范.pdf', '深度学习核心算法与原理问答库');
      } else if (q.includes('PyTorch') || q.includes('维度') || q.includes('报错') || q.includes('排查') || q.includes('CUDA')) {
        referencedFiles.push('Tensor张量维度广播与自动求导踩坑汇总.pdf', 'PyTorch多GPU分布式训练排查指南.md');
      } else if (q.includes('优化器') || q.includes('Adam') || q.includes('SGD') || q.includes('梯度')) {
        referencedFiles.push('常用梯度下降优化器对比分析(Adam_SGD).docx');
      } else if (q.includes('过拟合') || q.includes('Dropout') || q.includes('损失函数')) {
        referencedFiles.push('深度前馈网络过拟合抑制手段与Dropout原理.md');
      } else {
        if (matchedBases.length > 0 && matchedBases[0].files.length > 0) {
          referencedFiles.push(matchedBases[0].files[0].name);
        }
      }

      // 生成带有代码与专业解释的回复
      let replyContent = '';
      if (q.includes('维度') || q.includes('Dimension mismatch')) {
        replyContent = `【诊断与排查思路】\n根据检索到的《Tensor张量维度广播与自动求导踩坑汇总》：\n维度不匹配常发生在线性全连接层（\`nn.Linear\`）输入形状不一致，或卷积池化后的展平环节。\n\n💡 **常见排错步骤：**\n1. 在前向传播函数中打印张量维度：\n\`\`\`python\ndef forward(self, x):\n    x = self.conv_pool(x)\n    print("展平前维度:", x.shape) # 查看 [Batch, Channels, H, W]\n    x = x.view(x.size(0), -1)\n    print("传入Linear维度:", x.shape)\n    return self.fc(x)\n\`\`\`\n2. 检查 Linear 层的 \`in_features\` 是否等于上一层卷积特征图的通道数乘以高宽乘积。\n\n按人设原则，建议先进行单批次 (Batch=1) 的前向模拟，观察各层输出维度流动。`;
      } else if (q.includes('Adam') || q.includes('SGD') || q.includes('优化器')) {
        replyContent = `【知识库核心要点检索】\n参考《常用梯度下降优化器对比分析(Adam_SGD)》：\n\n- **SGD (标准梯度下降 / 带动量)**：沿当前批次梯度均值方向更新。泛化性能理论上限通常优于自适应类，但对学习率调优要求高，容易在鞍点停滞。\n- **Adam (自适应动量估计)**：结合了 Momentum（一阶动量保持方向）与 RMSprop（二阶动量自适应调节学习率）：\n  $$v_t = \\beta_1 v_{t-1} + (1-\\beta_1)g_t$$\n  $$s_t = \\beta_2 s_{t-1} + (1-\\beta_2)g_t^2$$\n\n🎯 **适用建议**：实训前期快速验证模型时推荐首选 \`Adam(lr=1e-3)\`，待结构稳定后若需打磨更高准确率可切换至带动量的 \`SGD\` 配合余弦退火学习率策略。`;
      } else if (q.includes('脉络') || q.includes('介绍') || q.includes('大纲')) {
        replyContent = `同学你好！本门课程围绕**「深度学习基础理论」**与**「工程实训能力」**双轮驱动：\n\n1. **理论基石**：损失函数与反向传播推导、卷积神经网络核心算子、经典骨干网（ResNet/ViT）剖析；\n2. **动手实操**：从张量张量计算、自动求导机制，到使用 PyTorch 搭建完整分类/检测实战流水线；\n3. **工程排错规范**：掌握多卡训练、GPU显存排查与代码提交规范。\n\n已为你关联当前课程的 4 个知识库文档，学习中遇到概念卡点可随时呼叫我为你逐步拆解！`;
      } else {
        replyContent = `针对你的提问「${q}」，根据系统提示词【${currentAvatarName}】的解答指引：\n\n已成功检索课程专属知识库中的相关章节，核心建议如下：\n1. 请先理清理论定义与输入输出张量规格，确保前置理论概念扎实；\n2. 建议在 Notebook 交互式实验环境中运行单步单元测试，观察变量状态变化；\n3. 如果是在实验环节出现异常，请确认实训指导书中的环境依赖版本是否与当前容器一致。`;
      }

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: replyContent,
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        referencedKbs: referencedFiles
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 850);
  };

  return (
    <div className="p-6">
      {/* 顶部标题与状态徽章 */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Bot className="w-4 h-4 text-blue-600 mr-2" />
            AI 技能助手配置与实时问答调试
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            配置本课程 AI 助手的专属知识库、人设指令与预置提示词，在右侧调试沙箱中即时体验问答效果
          </p>
        </div>

        {/* 状态徽章 */}
        <div className="flex items-center space-x-2">
          {isConfigDirty ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-500" />
              有未保存改动 (保存后右侧即生效)
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              配置已就绪 (调试中)
            </span>
          )}
        </div>
      </div>

      {/* 主体左右双栏响应式网格布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* 左侧配置栏 (占比 7/12) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* 配置项1：启用开关 */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center">
                是否启用 AI 技能助手
                {isAiEnabled ? (
                  <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded">
                    运行中
                  </span>
                ) : (
                  <span className="ml-2 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-semibold rounded">
                    已停用
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                开启后，学生在进入课程学习或实验实训时，可在右侧呼叫 AI 助手进行辅导答疑
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isAiEnabled}
              onClick={() => {
                setIsAiEnabled(!isAiEnabled);
                showToast(!isAiEnabled ? '已开启 AI 技能助手（请记得点击保存）' : '已关闭 AI 技能助手');
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                isAiEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  isAiEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 配置项2：展示图标 / 头像 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center">
                <span>AI 技能助手展示图标 / 头像 <span className="text-red-500">*</span></span>
              </label>
              <span className="text-[11px] text-slate-400">预设卡通助手或自定义上传</span>
            </div>

            <input
              ref={avatarFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {avatarOptions.map((av) => {
                const Icon = av.icon;
                const isSelected = selectedAvatar === av.id;
                return (
                  <div
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-100 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${av.color} text-white flex items-center justify-center shadow-xs mb-1.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{av.name}</span>
                    {isSelected ? (
                      <span className="text-[10px] text-blue-600 font-bold mt-0.5 flex items-center">
                        <Check className="w-2.5 h-2.5 mr-0.5 stroke-[3]" /> 当前选用
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-0.5">预设</span>
                    )}
                  </div>
                );
              })}

              {/* 自定义上传图片头像 */}
              <div
                onClick={() => {
                  if (customAvatarUrl) {
                    setSelectedAvatar('custom');
                  } else {
                    avatarFileInputRef.current?.click();
                  }
                }}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center transition-all relative group ${
                  selectedAvatar === 'custom'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-100 shadow-xs'
                    : 'border-slate-200 hover:border-blue-300 bg-white'
                }`}
              >
                {customAvatarUrl ? (
                  <>
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs mb-1.5 border border-slate-200">
                      <img src={customAvatarUrl} alt="自定义头像" className="w-full h-full object-cover" />
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          avatarFileInputRef.current?.click();
                        }}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        title="更换图片"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-800">自定义图片</span>
                    <span className="text-[10px] text-blue-600 font-bold mt-0.5">
                      {selectedAvatar === 'custom' ? '当前选用' : '点击选用'}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 flex items-center justify-center mb-1.5 transition-colors bg-slate-50/50">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                      上传头像
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG / PNG</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 配置项3：绑定知识库（下拉多选） */}
          <div className="space-y-2 relative" ref={kbDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center">
                <span>绑定专属知识库 <span className="text-red-500">*</span></span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                已选 <span className="text-blue-600 font-bold">{selectedKbIds.length}</span> 个知识库
              </span>
            </div>

            {/* 下拉触发框 */}
            <div
              onClick={() => setIsKbDropdownOpen(!isKbDropdownOpen)}
              className={`min-h-[42px] p-2 bg-white rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isKbDropdownOpen
                  ? 'border-blue-500 ring-2 ring-blue-100 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
                {selectedKbIds.length === 0 ? (
                  <span className="text-xs text-slate-400 px-1 select-none">
                    点击选择需要绑定的课程专属知识库...
                  </span>
                ) : (
                  selectedKbIds.map((id) => {
                    const kb = knowledgeBases.find(k => k.id === id);
                    if (!kb) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium group"
                      >
                        <Database className="w-3 h-3 text-blue-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{kb.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedKbIds(selectedKbIds.filter(item => item !== id));
                          }}
                          className="text-blue-400 hover:text-blue-700 rounded p-0.5 hover:bg-blue-100 transition-colors ml-0.5"
                          title="移除"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>

              <div className="flex items-center space-x-1 shrink-0 text-slate-400 pl-1 border-l border-slate-100">
                {selectedKbIds.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKbIds([]);
                    }}
                    className="p-1 hover:text-red-500 hover:bg-red-50 rounded text-slate-400 transition-colors"
                    title="清空已选"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isKbDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </div>
            </div>

            {/* 下拉浮层 */}
            {isKbDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden animate-fadeIn">
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={kbDropdownSearch}
                      onChange={(e) => setKbDropdownSearch(e.target.value)}
                      placeholder="搜索知识库名称或描述..."
                      className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span>知识库列表</span>
                    <button
                      type="button"
                      onClick={() => {
                        const allIds = knowledgeBases.map(k => k.id);
                        setSelectedKbIds(allIds);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      全选
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 p-1">
                  {knowledgeBases
                    .filter(kb =>
                      kb.name.toLowerCase().includes(kbDropdownSearch.toLowerCase()) ||
                      kb.desc.toLowerCase().includes(kbDropdownSearch.toLowerCase())
                    )
                    .map((kb) => {
                      const isChecked = selectedKbIds.includes(kb.id);
                      return (
                        <div
                          key={kb.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedKbIds(selectedKbIds.filter(id => id !== kb.id));
                            } else {
                              setSelectedKbIds([...selectedKbIds, kb.id]);
                            }
                          }}
                          className={`p-2.5 rounded-lg cursor-pointer transition-colors flex items-start space-x-2.5 ${
                            isChecked ? 'bg-blue-50/60 hover:bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className={`text-xs truncate ${isChecked ? 'font-bold text-blue-900' : 'font-medium text-slate-800'}`}>
                              {kb.name}
                            </h5>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{kb.desc}</p>
                            <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                              <span>{kb.docsCount} 篇文档</span>
                              <span>·</span>
                              <span>更新于 {kb.updateTime.split(' ')[0]}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    已勾选 <strong className="text-blue-600">{selectedKbIds.length}</strong> 项
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsKbDropdownOpen(false)}
                    className="px-3.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    确定
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 配置项4：预置提示词与开场设置（核心新功能模块） */}
          {/* ========================================================= */}
          <div className="p-4 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/30 to-slate-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-blue-100 text-blue-700 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  预置提示词与开场设置
                </h4>
              </div>
              <span className="text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                决定助手的回答风格与开场引导
              </span>
            </div>

            {/* 4.1 系统提示词 (System Prompt) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>系统角色人设与指导指令 (System Prompt)</span>
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {systemPrompt.length} 字
                </span>
              </div>

              {/* 常用预设人设模板快捷套用 */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                <span className="text-[11px] text-slate-500 mr-1 flex items-center">
                  <Flame className="w-3 h-3 text-amber-500 mr-0.5" /> 推荐模板:
                </span>
                {SYSTEM_PROMPT_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSystemPrompt(tpl.prompt);
                      setActiveTemplateId(tpl.id);
                      showToast(`已套用「${tpl.name}」人设提示词`);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                      activeTemplateId === tpl.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    <span>{tpl.name}</span>
                    <span className={`text-[9px] px-1 rounded ${activeTemplateId === tpl.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {tpl.tag}
                    </span>
                  </button>
                ))}
              </div>

              {/* 提示词输入框 */}
              <textarea
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value);
                  setActiveTemplateId('');
                }}
                rows={4}
                placeholder="请输入系统提示词，明确AI助教的身份、回答原则、知识库结合要求与代码输出规范..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y font-mono"
              />
              <p className="text-[11px] text-slate-400 flex items-center">
                <Info className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                系统提示词将在后台作为首要约束注入给大模型，约束回答语气和结合知识库检索的方式。
              </p>
            </div>

            {/* 4.2 开场欢迎语 (Greeting Message) */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200/80">
              <label className="text-xs font-bold text-slate-700 block">
                助手初次对话开场欢迎语
              </label>
              <input
                type="text"
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                placeholder="例如：同学你好！我是本课程的专属AI技能助手..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 4.3 预置推荐提问词列表 (Preset Prompts) */}
            <div className="space-y-2 pt-1 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>学生端开场推荐提问 (Preset Prompts)</span>
                  <span className="ml-1.5 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-normal">
                    {presetPrompts.length} 条已配置
                  </span>
                </label>
                <span className="text-[11px] text-slate-400">
                  点击右侧对话框快捷气泡可直接提问
                </span>
              </div>

              {/* 现有预置词列表 */}
              <div className="space-y-1.5">
                {presetPrompts.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors text-xs text-slate-700 group"
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePresetPrompt(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors opacity-70 group-hover:opacity-100 shrink-0"
                      title="删除此预置词"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 添加新预置词输入框 */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={newPresetInput}
                  onChange={(e) => setNewPresetInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPresetPrompt()}
                  placeholder="输入自定义推荐提问，如：PyTorch张量如何广播？（按Enter添加）"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddPresetPrompt}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加</span>
                </button>
              </div>

              {/* 快捷备选词推荐（点击快速加到列表） */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400">快速填充候选题:</span>
                {SUGGESTED_PRESETS.filter(p => !presetPrompts.includes(p)).slice(0, 3).map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (presetPrompts.length >= 8) {
                        showToast('最多配置 8 条快捷预置提示词');
                        return;
                      }
                      setPresetPrompts([...presetPrompts, sug]);
                      showToast('已添加推荐提问词');
                    }}
                    className="text-[11px] text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 px-2 py-0.5 rounded border border-dashed border-slate-300 hover:border-blue-300 transition-colors"
                  >
                    + {sug.slice(0, 16)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 保存配置按钮栏 */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-6 py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>保存助手配置</span>
              </button>
              {isConfigDirty && (
                <span className="text-xs text-amber-600 font-medium flex items-center animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  存在未保存内容
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400">
              上次保存于: {savedConfig.savedAt}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 右侧实时对话调试窗口 (占比 5/12) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 sticky top-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col h-[700px]">
            {/* 调试窗口 Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-700/50 shrink-0">
              <div className="flex items-center space-x-2.5">
                {getAvatarBadge(savedConfig.avatar, savedConfig.customAvatarUrl, 'w-8 h-8')}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-white">
                      {currentAvatarName}
                    </h4>
                    {savedConfig.isEnabled ? (
                      <span className="inline-flex items-center px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                        调试就绪
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.2 bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-medium rounded-full">
                        已停用
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    已连 {savedConfig.selectedKbIds.length} 个知识库 · 支持实时问答验证
                  </p>
                </div>
              </div>

              {/* 右侧控制按钮 */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setShowConfigInspector(!showConfigInspector)}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    showConfigInspector
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title="查看当前生效的 Prompt 与知识库上下文"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChatMessages([]);
                    showToast('已重置调试对话');
                  }}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg text-xs transition-colors cursor-pointer"
                  title="清空会话记录"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 未保存变更提醒浮条 */}
            {isConfigDirty && (
              <div className="px-3.5 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-800 text-[11px] flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-1.5 truncate">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">左侧配置已调整，点击「保存助手配置」生效</span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="text-blue-600 hover:text-blue-800 font-bold ml-2 underline shrink-0 cursor-pointer"
                >
                  立即保存
                </button>
              </div>
            )}

            {/* 配置检查器抽屉浮层 */}
            {showConfigInspector && (
              <div className="p-3 bg-slate-800 text-slate-200 text-xs border-b border-slate-700 space-y-2 animate-fadeIn shrink-0 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold border-b border-slate-700 pb-1">
                  <span>🛠 当前生效上下文配置 (Active Config)</span>
                  <button
                    onClick={() => setShowConfigInspector(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <span className="text-blue-400 font-medium text-[10px]">已绑定知识库:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {savedConfig.selectedKbIds.map(id => {
                      const kb = knowledgeBases.find(k => k.id === id);
                      return (
                        <span key={id} className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] text-slate-300">
                          {kb?.name || id}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-blue-400 font-medium text-[10px]">系统提示词 (System Prompt):</span>
                  <p className="mt-0.5 text-[10px] text-slate-300 line-clamp-3 bg-slate-900/60 p-1.5 rounded font-mono">
                    {savedConfig.systemPrompt}
                  </p>
                </div>
              </div>
            )}

            {/* 消息对话区域 */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70"
            >
              {/* 开场欢迎卡片 */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start space-x-2.5">
                  {getAvatarBadge(savedConfig.avatar, savedConfig.customAvatarUrl, 'w-8 h-8')}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        {currentAvatarName}
                      </span>
                      <span className="text-[10px] text-slate-400">刚刚</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {savedConfig.greetingMessage}
                    </p>
                  </div>
                </div>

                {/* 快捷推荐提问词气泡（直接采用已保存生效的预置词） */}
                {savedConfig.presetPrompts.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 block">
                      💡 预置提问引导（点击直接调试）：
                    </span>
                    <div className="flex flex-col space-y-1.5">
                      {savedConfig.presetPrompts.map((promptText, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleSendChatMessage(promptText)}
                          disabled={!savedConfig.isEnabled || isThinking}
                          className="w-full text-left px-3 py-2 bg-blue-50/60 hover:bg-blue-100/70 active:scale-[0.99] text-blue-900 rounded-xl text-xs font-medium transition-all flex items-center justify-between group border border-blue-100/80 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <span className="truncate pr-2">{promptText}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 历史对话记录 */}
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="mr-2 shrink-0">
                      {getAvatarBadge(savedConfig.avatar, savedConfig.customAvatarUrl, 'w-7 h-7')}
                    </div>
                  )}

                  <div className={`max-w-[86%] space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#1890ff] text-white shadow-xs rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                      {/* 助手消息知识库溯源引用 */}
                      {msg.role === 'assistant' && msg.referencedKbs && msg.referencedKbs.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center">
                            <Database className="w-3 h-3 mr-1 text-blue-500" />
                            引用知识库文档切片:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {msg.referencedKbs.map((doc, dIdx) => (
                              <span
                                key={dIdx}
                                className="inline-flex items-center text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100"
                              >
                                <FileText className="w-2.5 h-2.5 mr-1" />
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center space-x-1 text-[10px] text-slate-400 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.time}</span>
                      {msg.role === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                            showToast('已复制回答内容');
                          }}
                          className="hover:text-blue-600 ml-1 p-0.5 rounded cursor-pointer"
                          title="复制内容"
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* 思考中动画指示器 */}
              {isThinking && (
                <div className="flex items-center space-x-2 text-slate-400 text-xs pl-9 animate-fadeIn">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-500 ml-1">
                    AI 正在结合课程知识库检索与思考...
                  </span>
                </div>
              )}
            </div>

            {/* 底部输入框 */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChatMessage();
                    }
                  }}
                  disabled={!savedConfig.isEnabled || isThinking}
                  placeholder={
                    !savedConfig.isEnabled
                      ? '助手已停用，请在左侧开启并保存后调试...'
                      : '输入问题，测试 AI 技能助手的问答效果（Enter 发送）...'
                  }
                  className="w-full pl-3.5 pr-11 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => handleSendChatMessage()}
                  disabled={!chatInput.trim() || !savedConfig.isEnabled || isThinking}
                  className="absolute right-1.5 p-1.5 bg-[#1890ff] hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                  title="发送调试"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                <span>提示：当前为沙箱环境，直接调用已保存配置</span>
                <span>Enter 发送 / 点击快捷气泡提问</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
