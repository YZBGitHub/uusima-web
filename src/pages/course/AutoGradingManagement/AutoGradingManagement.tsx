import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Cpu, 
  Play, 
  Settings2, 
  RotateCcw, 
  Search, 
  Sliders, 
  Plus, 
  AlertTriangle, 
  Sparkles,
  Check,
  FileCode2,
  FileText
} from 'lucide-react';

interface GradingRuleItem {
  id: string;
  name: string;
  courseName: string;
  taskType: '客观习题' | 'Python编程' | '实验报告' | '综合实训';
  gradingMode: '完全自动判分' | 'AI智能辅助评分' | '基准单元测试';
  status: 'enabled' | 'disabled';
  accuracy: string;
  lastExecuted: string;
}

const INITIAL_RULES: GradingRuleItem[] = [
  {
    id: 'gr-1',
    name: 'NLP分词算法阶段性测验自动判分规则',
    courseName: '自然语言处理技术与应用17888340735441',
    taskType: '客观习题',
    gradingMode: '完全自动判分',
    status: 'enabled',
    accuracy: '100%',
    lastExecuted: '2026-09-18 14:30:20'
  },
  {
    id: 'gr-2',
    name: 'Python并发编程单元测试自动化评测机',
    courseName: 'Python程序设计进阶任务202308',
    taskType: 'Python编程',
    gradingMode: '基准单元测试',
    status: 'enabled',
    accuracy: '99.6%',
    lastExecuted: '2026-09-18 11:20:15'
  },
  {
    id: 'gr-3',
    name: '目标检测YOLOv5微调实验报告智能评分',
    courseName: '深度学习与计算机视觉实训202306',
    taskType: '实验报告',
    gradingMode: 'AI智能辅助评分',
    status: 'enabled',
    accuracy: '98.5%',
    lastExecuted: '2026-09-17 19:40:02'
  },
  {
    id: 'gr-4',
    name: 'Modbus协议串口轮询代码静态规范审查',
    courseName: '工业物联网数据采集与网关开发',
    taskType: 'Python编程',
    gradingMode: '完全自动判分',
    status: 'enabled',
    accuracy: '99.9%',
    lastExecuted: '2026-09-17 15:10:30'
  },
  {
    id: 'gr-5',
    name: 'Hadoop集群高可用搭建配置报告质检规则',
    courseName: '大数据分布式存储与Hadoop集群运维',
    taskType: '综合实训',
    gradingMode: 'AI智能辅助评分',
    status: 'disabled',
    accuracy: '97.2%',
    lastExecuted: '2026-09-15 09:00:10'
  }
];

export default function AutoGradingManagement() {
  const [rules, setRules] = useState<GradingRuleItem[]>(INITIAL_RULES);
  const [keyword, setKeyword] = useState('');
  const [filterType, setFilterType] = useState('全部类型');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredRules = rules.filter(r => {
    if (filterType !== '全部类型' && r.taskType !== filterType) return false;
    if (keyword.trim() && !r.name.toLowerCase().includes(keyword.trim().toLowerCase()) && !r.courseName.toLowerCase().includes(keyword.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleRuleStatus = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'enabled' ? 'disabled' : 'enabled';
        showToast(`规则「${r.name}」已${nextStatus === 'enabled' ? '启用' : '禁用'}`);
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleRunBatchGrading = () => {
    showToast('批量自动评分调度已启动：正在对待判分的 42 份学生作业进行自动判题...');
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden text-slate-800 relative p-6">
      
      {/* Toast 提示 */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-lg text-xs shadow-lg flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 mb-5">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">评分引擎状态</div>
            <div className="text-base font-bold text-slate-800 flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>正常运行中</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">活跃评分规则</div>
            <div className="text-base font-bold text-slate-800 mt-0.5">
              {rules.filter(r => r.status === 'enabled').length} <span className="text-xs text-slate-400 font-normal">/ {rules.length} 条</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">综合评分准确率</div>
            <div className="text-base font-bold text-emerald-600 mt-0.5">99.4%</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">AI辅助批阅次数</div>
            <div className="text-base font-bold text-slate-800 mt-0.5">1,280 <span className="text-xs text-slate-400 font-normal">次</span></div>
          </div>
        </div>
      </div>

      {/* 主体表格与操作栏卡片 */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-slate-200/80 flex flex-col overflow-hidden">
        
        {/* 标题与筛选操作 */}
        <div className="shrink-0 p-5 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
            <div>
              <h2 className="text-base font-bold text-slate-800">课程自动评分规则配置</h2>
              <span className="text-xs text-slate-400">支持客观题极速判分、Python代码单元测试自动化评测及实验报告大模型语义打分</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleRunBatchGrading}
              className="px-3.5 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded-lg text-xs font-medium flex items-center space-x-1 shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>一键触发批量评分</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('自动评分规则模板已打开')}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建评分规则</span>
            </button>
          </div>
        </div>

        {/* 检索过滤条 */}
        <div className="shrink-0 px-5 py-3 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索规则名称 / 课程名称..."
                className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-md text-slate-700 text-xs outline-none hover:border-blue-400 focus:border-blue-500 w-56"
              />
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-slate-400">任务类型:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 outline-none"
              >
                <option value="全部类型">全部类型</option>
                <option value="客观习题">客观习题</option>
                <option value="Python编程">Python编程</option>
                <option value="实验报告">实验报告</option>
                <option value="综合实训">综合实训</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setKeyword(''); setFilterType('全部类型'); }}
            className="text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置</span>
          </button>
        </div>

        {/* 规则表格列表 */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">序号</th>
                <th className="py-3 px-4">规则名称</th>
                <th className="py-3 px-4 w-52">关联课程</th>
                <th className="py-3 px-3 w-28 text-center">任务类型</th>
                <th className="py-3 px-3 w-36 text-center">评测运行机制</th>
                <th className="py-3 px-3 w-24 text-center">评测准确率</th>
                <th className="py-3 px-4 w-40 text-center">最近执行时间</th>
                <th className="py-3 px-3 w-20 text-center">状态</th>
                <th className="py-3 px-4 w-28 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRules.map((rule, idx) => (
                <tr key={rule.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    <div className="flex items-center space-x-2">
                      {rule.taskType === 'Python编程' ? (
                        <FileCode2 className="w-4 h-4 text-indigo-500 shrink-0" />
                      ) : rule.taskType === '实验报告' ? (
                        <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                      <span className="truncate" title={rule.name}>{rule.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]" title={rule.courseName}>
                    {rule.courseName}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {rule.taskType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600 font-medium">
                    {rule.gradingMode}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-emerald-600">
                    {rule.accuracy}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 whitespace-nowrap">
                    {rule.lastExecuted}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      rule.status === 'enabled' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {rule.status === 'enabled' ? '启用中' : '已停用'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`text-xs font-medium hover:underline transition-colors ${
                        rule.status === 'enabled' ? 'text-amber-600' : 'text-blue-600'
                      }`}
                    >
                      {rule.status === 'enabled' ? '暂停' : '启动'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
