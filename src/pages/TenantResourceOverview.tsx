import React from 'react';
import { Activity, Database, BarChart2, Clock, FileText, Users, PieChart, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const tokenTrendData = [
  { date: '06-24', token: 120000 }, { date: '06-25', token: 140000 }, { date: '06-26', token: 135000 },
  { date: '06-27', token: 155000 }, { date: '06-28', token: 160000 }, { date: '06-29', token: 145000 },
  { date: '06-30', token: 125000 }, { date: '07-01', token: 180000 }, { date: '07-02', token: 195000 },
  { date: '07-03', token: 210000 }, { date: '07-04', token: 190000 }, { date: '07-05', token: 220000 },
  { date: '07-06', token: 205000 }, { date: '07-07', token: 230000 }, { date: '07-08', token: 250000 },
  { date: '07-09', token: 240000 }, { date: '07-10', token: 260000 }, { date: '07-11', token: 280000 },
  { date: '07-12', token: 275000 }, { date: '07-13', token: 300000 }, { date: '07-14', token: 310000 },
  { date: '07-15', token: 290000 }, { date: '07-16', token: 150000 }, { date: '07-17', token: 280000 },
  { date: '07-18', token: 210000 }, { date: '07-19', token: 450000 }, { date: '07-20', token: 320000 },
  { date: '07-21', token: 510000 }, { date: '07-22', token: 420000 }, { date: '07-23', token: 460000 },
];

const pptTrendData = [
  { date: '07-16', count: 2 },
  { date: '07-17', count: 5 },
  { date: '07-18', count: 3 },
  { date: '07-19', count: 8 },
  { date: '07-20', count: 4 },
  { date: '07-21', count: 6 },
  { date: '07-22', count: 7 },
];

const loginTrendData = [
  { date: '06-24', count: 42 }, { date: '06-25', count: 45 }, { date: '06-26', count: 48 },
  { date: '06-27', count: 52 }, { date: '06-28', count: 50 }, { date: '06-29', count: 46 },
  { date: '06-30', count: 38 }, { date: '07-01', count: 41 }, { date: '07-02', count: 44 },
  { date: '07-03', count: 65 }, { date: '07-04', count: 58 }, { date: '07-05', count: 53 },
  { date: '07-06', count: 48 }, { date: '07-07', count: 51 }, { date: '07-08', count: 55 },
  { date: '07-09', count: 59 }, { date: '07-10', count: 62 }, { date: '07-11', count: 68 },
  { date: '07-12', count: 72 }, { date: '07-13', count: 75 }, { date: '07-14', count: 70 },
  { date: '07-15', count: 68 }, { date: '07-16', count: 74 }, { date: '07-17', count: 81 },
  { date: '07-18', count: 85 }, { date: '07-19', count: 88 }, { date: '07-20', count: 90 },
  { date: '07-21', count: 92 }, { date: '07-22', count: 95 }, { date: '07-23', count: 98 },
];

const durationTrendData = [
  { date: '07-16', duration: 120 },
  { date: '07-17', duration: 250 },
  { date: '07-18', duration: 180 },
  { date: '07-19', duration: 320 },
  { date: '07-20', duration: 210 },
  { date: '07-21', duration: 380 },
  { date: '07-22', duration: 290 },
];

const ResourceCard = ({
  title,
  icon: Icon,
  iconColor,
  remaining,
  total,
  used,
  unit,
  percentage,
  color,
}: any) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  // Calculate dash offset based on percentage
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="flex flex-col flex-1 min-w-0 pr-2">
        <div className="flex items-center space-x-2 mb-3 text-slate-600">
          <span className="text-sm font-medium">{title}</span>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex items-baseline space-x-1 mb-4">
          <span className="text-3xl font-bold text-slate-800 truncate">{remaining.toLocaleString()}</span>
          {unit && <span className="text-sm text-slate-600">{unit}</span>}
          <span className="text-sm text-slate-600">剩余</span>
        </div>
        <div className="space-y-1 text-xs text-slate-500">
          <div>总计: {total.toLocaleString()} {unit}</div>
          <div className="flex items-center space-x-1">
            <span>已使用:</span>
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            <span>{used.toLocaleString()} {unit}</span>
          </div>
        </div>
      </div>
      
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color: color }}>{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default function TenantResourceOverview({ tenantType = 'online' }: { tenantType?: 'online' | 'private' }) {
  if (tenantType === 'private') {
    return (
      <div className="h-full bg-slate-50 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">Token 总数量</div>
              <div className="text-2xl font-bold text-slate-800">15,000,000</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">已使用数量</div>
              <div className="text-2xl font-bold text-slate-800">6,846,044</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">剩余数量</div>
              <div className="text-2xl font-bold text-slate-800">8,153,956</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">剩余百分比</div>
              <div className="text-2xl font-bold text-slate-800">54%</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">近30天 Token 消耗趋势</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tokenTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value.toLocaleString(), 'Token 消耗']}
                />
                <Line type="monotone" dataKey="token" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // online tenant
  return (
    <div className="h-full bg-slate-50 overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-2 gap-4 mb-6">
        <ResourceCard 
          title="账号数量"
          icon={Users}
          iconColor="text-blue-500"
          remaining={120}
          total={200}
          used={80}
          unit="个"
          percentage={40}
          color="#3b82f6"
        />
        <ResourceCard 
          title="Token (词元) 数量"
          icon={Activity}
          iconColor="text-blue-500"
          remaining={8153956}
          total={15000000}
          used={6846044}
          unit=""
          percentage={54}
          color="#3b82f6"
        />
        <ResourceCard 
          title="实验时长"
          icon={Clock}
          iconColor="text-emerald-500"
          remaining={4500}
          total={6000}
          used={1500}
          unit="分钟"
          percentage={75}
          color="#10b981"
        />
        <ResourceCard 
          title="PPT 生成次数"
          icon={FileText}
          iconColor="text-purple-500"
          remaining={4}
          total={5}
          used={1}
          unit="次"
          percentage={80}
          color="#a855f7"
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-slate-800">近30天的平台账号登录次数趋势</h3>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">累计登录</div>
            <div className="text-xl font-bold text-slate-800">1,285</div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={loginTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [value.toLocaleString(), '登录次数']}
              />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-800">近7天时长消耗趋势</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={durationTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value.toLocaleString(), '消耗时长 (小时)']}
                />
                <Line type="monotone" dataKey="duration" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">近30天 Token 消耗趋势</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tokenTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value.toLocaleString(), 'Token 消耗']}
                />
                <Line type="monotone" dataKey="token" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-slate-800">近7天 PPT 生成次数消耗趋势</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pptTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value.toLocaleString(), 'PPT 生成次数']}
                />
                <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
