import re

files_info = [
    {
        'path': 'src/pages/Home.tsx',
        'avatar': '振邦',
        'name': '杨振邦',
        'on_personal': "onNavigate && onNavigate('personal')"
    },
    {
        'path': 'src/pages/ConfigManagement.tsx',
        'avatar': '林敏',
        'name': '林敏学',
        'on_personal': "onNavigate && onNavigate('personal')"
    },
    {
        'path': 'src/pages/PlatformOperation.tsx',
        'avatar': '林敏',
        'name': '林敏学',
        'on_personal': "onNavigate && onNavigate('personal')"
    },
    {
        'path': 'src/pages/Personal.tsx',
        'avatar': '林敏',
        'name': '林敏学',
        'on_personal': "setActiveMenu('info')"
    },
    {
        'path': 'src/pages/Profile.tsx',
        'avatar': '管理',
        'name': '学校管理员',
        'on_personal': "onNavigate && onNavigate('personal')" # it doesn't have onNavigate by default in Profile.tsx, wait
    }
]

# Wait, Profile.tsx doesn't take onNavigate as a prop!
# Let's fix Profile.tsx prop if needed. Actually it's inside `function Header()`.
# Let's just use empty string or a console.log for Profile if onNavigate is not available.
# But Profile is in the App.tsx router, wait, Profile.tsx doesn't receive onNavigate in App.tsx!
# App.tsx: `{activeView === "profile" && <Profile />}` (wait, it's not even passed).
# I'll add onNavigate optional prop to Header if possible, or just ignore for now in Profile, or `window.location.href = '/'`

# Wait, let's just use `onNavigate && onNavigate('...')` for Profile.tsx. It won't crash if onNavigate is undefined.

pattern = r'\{isUserMenuOpen && \(\s*<div className="absolute right-0.*?</div>\s*\)\}'

for info in files_info:
    with open(info['path'], 'r', encoding='utf-8') as f:
        content = f.read()

    new_dropdown = f"""{{isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden transform origin-top-right">
                <div className="relative h-12 bg-[#e6f4ff]">
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#f48b8d] text-white flex items-center justify-center font-medium border-[3px] border-white text-sm shadow-sm">
                    {info['avatar']}
                  </div>
                </div>
                <div className="pt-8 pb-1">
                  <div className="text-center px-4 mb-2">
                    <div className="font-medium text-slate-800 text-sm">{info['name']}</div>
                    <div className="text-xs text-slate-400 mt-0.5">15396005420</div>
                  </div>
                  <div className="h-px bg-slate-100 my-2 mx-2"></div>
                  <button 
                    onClick={{() => {info['on_personal']}}}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    个人设置
                  </button>
                  <button 
                    onClick={{() => typeof onNavigate !== 'undefined' && onNavigate('config')}}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    系统管理
                  </button>
                  <button 
                    onClick={{() => typeof onNavigate !== 'undefined' && onNavigate('platform-operation')}}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    平台运营
                  </button>
                  <button 
                    onClick={{() => typeof onNavigate !== 'undefined' && onNavigate('login')}}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
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
                      <span className="text-[13px] text-slate-700 truncate">{{typeof activeTenant !== 'undefined' && activeTenant ? activeTenant.name : "教育公司"}}</span>
                    </div>
                    <button 
                      onClick={{() => {{ setIsUserMenuOpen(false); typeof setIsTenantOpen !== 'undefined' && setIsTenantOpen(true); }}}}
                      className="text-[12px] text-slate-400 hover:text-blue-500 flex items-center shrink-0"
                    >
                      切换 <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}}"""
            
    if "{isUserMenuOpen && (" in content:
        content = re.sub(pattern, new_dropdown, content, flags=re.DOTALL)
        with open(info['path'], 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {info['path']}")
    else:
        print(f"Skipped {info['path']} - pattern not found")

