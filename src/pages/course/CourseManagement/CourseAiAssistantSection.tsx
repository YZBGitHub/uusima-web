import React, { useEffect, useState } from 'react';
import { Bot, Code, GraduationCap, BookOpen, Target } from 'lucide-react';
import SearchableSingleSelect, { SelectOption } from './SearchableSingleSelect';

// 与当前课程模块一致，暂使用本地示例候选数据，接入服务后替换列表即可。
const applicationOptions: SelectOption[] = [
  { id: 'app-course-assistant', name: '学科大模型案例助手', icon: GraduationCap, type: '案例教学', description: '结合学科知识与教学案例，辅助分析实际问题，提供案例讲解与学习指导。' },
  { id: 'app-code-mentor', name: '代码排错导师', icon: Code, type: '编程助手', description: '诊断代码与实验环境中的常见错误，提供排查思路和代码优化建议。' },
  { id: 'app-theory-tutor', name: '理论原理解构师', icon: BookOpen, type: '知识问答', description: '通过概念拆解、公式推导与实例讲解，帮助理解课程核心理论。' },
  { id: 'app-exam-coach', name: '实训通关教练', icon: Target, type: '实训指导', description: '围绕实训大纲与考核要求，分步骤指导实验操作、作业完成和报告撰写。' },
  { id: 'app-general-assistant', name: '全能答疑助教', icon: Bot, type: '综合助教', description: '兼顾理论答疑与实践指导，为课程学习提供知识解答和学习建议。' },
];

const knowledgeBaseOptions: SelectOption[] = [
  { id: 'kb-1', name: '深度学习核心算法与原理问答库', description: '包含损失函数、反向传播与优化器理论答疑。', category: '专业理论' },
  { id: 'kb-2', name: 'TensorFlow与PyTorch实训工程排错集', description: '收录实验环境安装报错、张量维度不匹配等常见问题及解决方案。', category: '实训排错' },
  { id: 'kb-3', name: '校本特色实训指导大纲与作业规范', description: '包含实训考查评分标准、实验报告模板与代码提交规范。', category: '教学规范' },
  { id: 'kb-4', name: '计算机视觉经典网络架构知识库', description: '详细解析 ResNet、YOLO、Transformer 等经典网络结构与应用案例。', category: '专业技术' },
];

interface AssistantConfig {
  applicationId: string;
  showInLargeModel: boolean;
  knowledgeBaseId: string;
}

const emptyConfig: AssistantConfig = {
  applicationId: '',
  showInLargeModel: false,
  knowledgeBaseId: '',
};

export default function CourseAiAssistantSection({ courseId, onSaved }: {
  courseId: number;
  onSaved: (message: string) => void;
}) {
  const [config, setConfig] = useState<AssistantConfig>(emptyConfig);
  const [error, setError] = useState('');
  const storageKey = `uusima_course_ai_assistant_${courseId}`;

  useEffect(() => {
    setError('');
    setConfig(emptyConfig);
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      setConfig({
        applicationId: typeof parsed?.applicationId === 'string' ? parsed.applicationId : '',
        showInLargeModel: parsed?.showInLargeModel === true,
        knowledgeBaseId: typeof parsed?.knowledgeBaseId === 'string' ? parsed.knowledgeBaseId : '',
      });
    } catch {
      setError('配置读取失败，请重新填写并保存。');
    }
  }, [storageKey]);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const next = {
        ...config,
        applicationId: config.applicationId.trim(),
        knowledgeBaseId: config.knowledgeBaseId.trim(),
      };
      localStorage.setItem(storageKey, JSON.stringify(next));
      setConfig(next);
      setError('');
      onSaved('AI技能助手配置已保存');
    } catch {
      setError('保存失败，请检查浏览器存储空间后重试。');
    }
  };

  return (
    <form onSubmit={handleSave} aria-label="AI技能助手配置" className="relative min-h-full text-sm text-[#606266]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 pt-0.5">
          <label htmlFor={`ai-application-${courseId}`} className="mb-2 block leading-5">应用标识</label>
          <SearchableSingleSelect
            id={`ai-application-${courseId}`}
            value={config.applicationId}
            options={applicationOptions}
            onChange={applicationId => setConfig(prev => ({ ...prev, applicationId }))}
            placeholder="搜索并选择应用"
            savedLabel="已保存的应用"
          />
        </div>
        <button type="submit" className="h-8 shrink-0 cursor-pointer rounded bg-[#409eff] px-4 text-white transition-colors hover:bg-[#66b1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#409eff] active:bg-[#3a8ee6]">保存</button>
      </div>

      <fieldset className="mt-4 border-0 p-0">
        <legend className="mb-3 leading-5">是否在大模型展示</legend>
        <div className="flex h-5 items-center gap-8">
          {[{ label: '不展示', value: false }, { label: '展示', value: true }].map(option => (
            <label key={option.label} className="flex cursor-pointer items-center gap-2 text-[#909399]">
              <input
                type="radio"
                name={`ai-visibility-${courseId}`}
                value={String(option.value)}
                checked={config.showInLargeModel === option.value}
                onChange={() => setConfig(prev => ({ ...prev, showInLargeModel: option.value }))}
                className="h-3.5 w-3.5 cursor-pointer accent-[#409eff]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor={`ai-knowledge-base-${courseId}`} className="mb-2 block leading-5">关联知识库</label>
        <SearchableSingleSelect
          id={`ai-knowledge-base-${courseId}`}
          value={config.knowledgeBaseId}
          options={knowledgeBaseOptions}
          onChange={knowledgeBaseId => setConfig(prev => ({ ...prev, knowledgeBaseId }))}
          placeholder="搜索并选择知识库"
          savedLabel="已保存的知识库"
        />
      </div>
      {error && <p role="alert" className="mt-4 text-[#f56c6c]">{error}</p>}
    </form>
  );
}
