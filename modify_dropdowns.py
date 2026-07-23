import re

# Update ConfigManagement.tsx
with open('src/pages/ConfigManagement.tsx', 'r') as f:
    content = f.read()

pattern = r"(<button \s*className=\"w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors bg-blue-50/50\"\s*>\s*<Settings className=\"w-4 h-4 mr-2\" />\s*系统管理\s*</button>)"
replacement = r"""\1
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button
                  onClick={() => onNavigate && onNavigate("platform-operation")}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  平台运营
                </button>"""
content = re.sub(pattern, replacement, content)
if "Activity" not in content and "lucide-react" in content:
    content = re.sub(r"import \{(.*?)\} from 'lucide-react';", r"import {\1, Activity} from 'lucide-react';", content)
with open('src/pages/ConfigManagement.tsx', 'w') as f:
    f.write(content)

# Update Home.tsx
with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

pattern = r"(<button \s*onClick=\{\(\) => onNavigate\('config'\)\}\s*className=\"w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50\"\s*>\s*系统管理\s*</button>)"
replacement = r"""\1
              <button 
                onClick={() => onNavigate('platform-operation')}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50"
              >
                平台运营
              </button>"""
content = re.sub(pattern, replacement, content)
with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)

