import re

with open('src/pages/TenantResourceOverview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update tokenTrendData to 30 days
old_token_data = """const tokenTrendData = [
  { date: '07-16', token: 150000 },
  { date: '07-17', token: 280000 },
  { date: '07-18', token: 210000 },
  { date: '07-19', token: 450000 },
  { date: '07-20', token: 320000 },
  { date: '07-21', token: 510000 },
  { date: '07-22', token: 420000 },
];"""

new_token_data = """const tokenTrendData = [
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
];"""

content = content.replace(old_token_data, new_token_data)

# 2. Update private tenant token card to use ResourceCard
# Original code:
old_private_card = """        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">已使用 Token (总量)</div>
              <div className="text-2xl font-bold text-slate-800">2,340,000</div>
            </div>
          </div>
        </div>"""

new_private_card = """        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-2 gap-4 mb-6">
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
        </div>"""

content = content.replace(old_private_card, new_private_card)

# 3. Change all "近7天 Token 消耗趋势" to "近30天 Token 消耗趋势"
content = content.replace("近7天 Token 消耗趋势", "近30天 Token 消耗趋势")

with open('src/pages/TenantResourceOverview.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
