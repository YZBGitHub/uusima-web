import re

with open('src/pages/PlatformOperation.tsx', 'r') as f:
    content = f.read()

# Replace Imports
import_pattern = r"(import \{.*\} from 'lucide-react';)"
content = re.sub(import_pattern, r"\1\nimport BillingPackage from './BillingPackage';\nimport BillingPoints from './BillingPoints';\nimport OrdersManagement from './OrdersManagement';\n", content)

# Remove 计费管理 button
content = re.sub(r"\s*<button \s*onClick=\{\(\) => setActiveMenu\('order-billing'\)\}.*?计费管理\s*</button>", "", content, flags=re.DOTALL)

# Add 计费设置 section
billing_section = """
             <div>
               <div className="px-8 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">计费设置</div>
               <div className="mt-1 space-y-1">
                 <button 
                  onClick={() => setActiveMenu('billing-package')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'billing-package' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <Settings className={`w-4 h-4 mr-3 ${activeMenu === 'billing-package' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 套餐管理
                 </button>
                 <button 
                  onClick={() => setActiveMenu('billing-points')} 
                  className={`w-full flex items-center px-8 py-2.5 text-sm transition-colors ${activeMenu === 'billing-points' ? 'bg-[#e6f7ff] text-[#1890ff] font-medium border-r-2 border-[#1890ff]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                 >
                    <Settings className={`w-4 h-4 mr-3 ${activeMenu === 'billing-points' ? 'text-[#1890ff]' : 'text-slate-500'}`} /> 积分设置
                 </button>
               </div>
             </div>"""

content = re.sub(r"(</nav>)", billing_section + r"\n          \1", content)

# Modify Content Title
title_pattern = r"(<h2 className=\"text-xl font-bold\">.*?)(</h2>)"
new_titles = r"""\1
              {activeMenu === 'billing-package' && '套餐管理'}
              {activeMenu === 'billing-points' && '积分设置'}
            \2"""
content = re.sub(title_pattern, new_titles, content, flags=re.DOTALL)

# Modify main content body
content_pattern = r"(<div className=\"flex-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400\">\s*开发中...\s*</div>)"

new_content = """{activeMenu === 'billing-package' ? (
            <BillingPackage />
          ) : activeMenu === 'billing-points' ? (
            <BillingPoints />
          ) : activeMenu === 'order-list' ? (
            <OrdersManagement />
          ) : (
            <div className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
               开发中...
            </div>
          )}"""
content = re.sub(content_pattern, new_content, content, flags=re.DOTALL)

with open('src/pages/PlatformOperation.tsx', 'w') as f:
    f.write(content)

