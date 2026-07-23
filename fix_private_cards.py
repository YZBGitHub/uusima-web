import re

with open('src/pages/TenantResourceOverview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { Activity, Database, BarChart2, Clock, FileText, Users } from 'lucide-react';",
    "import { Activity, Database, BarChart2, Clock, FileText, Users, PieChart, TrendingDown } from 'lucide-react';"
)

# 2. Update cards
old_cards = """        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-2 gap-4 mb-6">
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

new_cards = """        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
        </div>"""

if old_cards in content:
    content = content.replace(old_cards, new_cards)
else:
    print("Warning: old cards not found")

with open('src/pages/TenantResourceOverview.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
