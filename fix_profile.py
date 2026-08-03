import re

with open('src/pages/Profile.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states to Header
if "const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);" not in content:
    content = content.replace("function Header() {", """function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const activeTenant = { name: "教育公司" };""")

old_dropdown = """        <div className="flex items-center text-sm font-medium text-slate-600 cursor-pointer">
          学校管理员 <ChevronDown className="w-4 h-4 ml-1" />
        </div>"""

new_dropdown = """        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center text-sm font-medium text-slate-600 cursor-pointer focus:outline-none"
          >
            学校管理员 <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden transform origin-top-right">
              <div className="relative h-12 bg-[#e6f4ff]">
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#f48b8d] text-white flex items-center justify-center font-medium border-[3px] border-white text-sm shadow-sm">
                  振邦
                </div>
              </div>
              <div className="pt-8 pb-1">
                <button 
                  className="w-full text-left px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                >
                  个人设置
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                >
                  退出登录
                </button>
              </div>
              <div className="border-t border-slate-100 px-3 py-3">
                <div className="text-[12px] text-slate-500 mb-2 px-1">组织</div>
                <div className="bg-[#f5f7fa] rounded flex items-center justify-between p-2">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <div className="w-5 h-5 bg-white rounded shadow-sm text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs italic">
                      X
                    </div>
                    <span className="text-[13px] text-slate-700 truncate">{activeTenant.name}</span>
                  </div>
                  <button 
                    onClick={() => { setIsUserMenuOpen(false); setIsTenantOpen(true); }}
                    className="text-[12px] text-slate-400 hover:text-blue-500 flex items-center shrink-0"
                  >
                    切换 <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>"""

content = content.replace(old_dropdown, new_dropdown)
if "ChevronRight" not in content:
    content = content.replace("ChevronDown, Bell } from 'lucide-react';", "ChevronDown, Bell, ChevronRight } from 'lucide-react';")

with open('src/pages/Profile.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
