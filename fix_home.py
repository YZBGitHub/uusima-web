import re

with open('src/pages/Home.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if "const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);" not in content:
    content = content.replace("const [currentSlide, setCurrentSlide] = useState(0);", 
"""const [currentSlide, setCurrentSlide] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const activeTenant = { name: "教育公司" };""")

old_dropdown = """          {/* User Profile Dropdown Component */}
          <div className="relative group cursor-pointer flex items-center space-x-2">
            <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-slate-700 font-medium text-sm">杨振邦<span className="text-slate-400 font-normal text-xs">(15396005420)</span></span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
            
            {/* Dropdown Menu (Hover to reveal for simple mock) */}
            <div className="absolute top-10 right-0 w-48 bg-white border border-slate-100 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button 
                onClick={() => onNavigate('personal')}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50"
              >
                个人中心
              </button>
              <button 
                onClick={() => onNavigate('config')}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50"
              >
                系统管理
              </button>
              <button 
                onClick={() => onNavigate('platform-operation')}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50"
              >
                平台运营
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50"
              >
                退出登录
              </button>
            </div>
          </div>"""

new_dropdown = """          {/* User Profile Dropdown Component */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-slate-700 font-medium text-sm">杨振邦<span className="text-slate-400 font-normal text-xs">(15396005420)</span></span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden transform origin-top-right">
                <div className="relative h-12 bg-blue-50/80">
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-red-400 text-white flex items-center justify-center font-medium border-2 border-white text-sm">
                    振邦
                  </div>
                </div>
                <div className="pt-7 pb-2">
                  <button 
                    onClick={() => onNavigate && onNavigate('personal')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    个人设置
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('config')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    系统管理
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('platform-operation')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    平台运营
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('login')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
                <div className="border-t border-slate-100 px-4 py-3">
                  <div className="text-xs text-slate-400 mb-2">组织</div>
                  <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                        {activeTenant.name.substring(0, 1)}
                      </div>
                      <span className="text-sm font-medium text-slate-700 truncate">{activeTenant.name}</span>
                    </div>
                    <button 
                      onClick={() => { setIsUserMenuOpen(false); setIsTenantOpen(true); }}
                      className="text-xs text-slate-400 hover:text-blue-600 flex items-center shrink-0 ml-2"
                    >
                      切换 <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>"""

content = content.replace(old_dropdown, new_dropdown)

with open('src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
