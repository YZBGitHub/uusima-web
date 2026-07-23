import re

with open('src/pages/TenantResourceOverview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add BarChart and Bar to recharts import
content = content.replace(
"""  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';""",
"""  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';"""
)

# Add loginTrendData
data_block = """const durationTrendData = ["""
new_data_block = """const loginTrendData = [
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

const durationTrendData = ["""
content = content.replace(data_block, new_data_block)

# Replace the login stat card with the BarChart card
old_card = """      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">近30天的平台账号登录次数</div>
            <div className="text-2xl font-bold text-slate-800">1,285</div>
          </div>
        </div>
      </div>"""

new_card = """      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
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
      </div>"""

content = content.replace(old_card, new_card)

with open('src/pages/TenantResourceOverview.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

