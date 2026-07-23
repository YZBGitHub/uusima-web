import re

with open('src/pages/TenantResourceOverview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add pptTrendData
ppt_trend_data = """const durationTrendData = ["""
new_ppt_trend_data = """const pptTrendData = [
  { date: '07-16', count: 2 },
  { date: '07-17', count: 5 },
  { date: '07-18', count: 3 },
  { date: '07-19', count: 8 },
  { date: '07-20', count: 4 },
  { date: '07-21', count: 6 },
  { date: '07-22', count: 7 },
];

const durationTrendData = ["""
content = content.replace(ppt_trend_data, new_ppt_trend_data)

# 2. Add Login Count card to top stats
# We can just add a simple stat card or another ResourceCard. Since login count doesn't have a "total" or "percentage", a simple card is better.
# But maybe we can just make a smaller card row above or below. Let's add it before the charts.
login_card = """      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center justify-between">
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

cards_end = """      </div>"""
content = content.replace("      </div>\n      <div className=\"bg-white p-6 rounded-xl border border-slate-200 shadow-sm\">", "      </div>\n" + login_card + "\n      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6\">\n      <div className=\"bg-white p-6 rounded-xl border border-slate-200 shadow-sm\">", 1)

# 3. Add Token and PPT trend charts in a grid
# The original code has one chart. Let's put them in a grid, maybe 2 columns if screen is wide enough.
# We will wrap the existing chart and add two more.
# Existing chart is "近7天时长消耗趋势"

chart_duration = """      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
      </div>"""

# Replace the single chart div with the chart_duration
# Note: In step 2, I added `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">` before the first chart.
# So I need to add the other two charts and close the grid.

chart_token = """      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart2 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-slate-800">近7天 Token 消耗趋势</h3>
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
      </div>"""

chart_ppt = """      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
      </div>"""

content = content.replace(chart_duration, chart_duration + "\n" + chart_token + "\n" + chart_ppt + "\n      </div>")

with open('src/pages/TenantResourceOverview.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
