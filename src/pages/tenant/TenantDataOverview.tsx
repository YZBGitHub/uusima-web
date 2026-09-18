import React from 'react';
import { Activity, Users, Clock, ArrowUpRight, Zap, Target, Globe } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const trendData = [
  { time: '00:00', calls: 2400 },
  { time: '04:00', calls: 1398 },
  { time: '08:00', calls: 9800 },
  { time: '12:00', calls: 14500 },
  { time: '16:00', calls: 11200 },
  { time: '20:00', calls: 8700 },
  { time: '24:00', calls: 3400 },
];

const featureData = [
  { name: '文本生成', value: 4500 },
  { name: '图像分析', value: 2100 },
  { name: '知识问答', value: 3800 },
  { name: '代码辅助', value: 1200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const regionData = [
  { name: '华东', value: 4500 },
  { name: '华北', value: 3200 },
  { name: '华南', value: 2800 },
  { name: '西南', value: 1500 },
  { name: '其他', value: 900 },
];

const StatCard = ({ title, value, icon: Icon, change, trend }: any) => (
  <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <Icon className="w-16 h-16" />
    </div>
    <div className="flex items-center space-x-2 mb-4 text-slate-400">
      <Icon className="w-5 h-5 text-blue-400" />
      <span className="font-medium">{title}</span>
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="flex items-center space-x-1 text-sm">
      <span className={trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
        {change}
      </span>
      <span className="text-slate-500">较昨日</span>
    </div>
  </div>
);

export default function TenantDataOverview() {
  return (
    <div className="min-h-full bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">数据大屏</h2>
          <p className="text-slate-400 text-sm">实时监控租户运行状态与资源消耗</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>系统正常运行中</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="总调用次数" value="1,284,592" icon={Activity} change="+12.5%" trend="up" />
        <StatCard title="活跃用户数" value="45,231" icon={Users} change="+5.2%" trend="up" />
        <StatCard title="平均响应延迟" value="124ms" icon={Clock} change="-12ms" trend="up" />
        <StatCard title="请求成功率" value="99.9%" icon={Target} change="+0.1%" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">24小时调用趋势</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">功能调用分布</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {featureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">地域分布Top5</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  cursor={{fill: '#334155', opacity: 0.4}}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">异常告警事件</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">查看全部</button>
          </div>
          <div className="space-y-4">
            {[
              { time: '10:24:33', msg: '数据库连接数接近阈值', level: 'warn' },
              { time: '09:12:05', msg: '接口响应时间超过 2000ms', level: 'error' },
              { time: '08:45:12', msg: '流量突增触发流控策略', level: 'info' },
              { time: '04:30:00', msg: '每日数据备份完成', level: 'success' },
              { time: '02:15:22', msg: '检测到异常登录IP', level: 'warn' },
            ].map((log, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  log.level === 'warn' ? 'bg-amber-400' : 
                  log.level === 'error' ? 'bg-rose-400' :
                  log.level === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm truncate">{log.msg}</p>
                </div>
                <div className="text-xs text-slate-500">{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
