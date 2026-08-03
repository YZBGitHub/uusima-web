import re

with open('src/pages/ConfigManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_links = """                  <button 
                    onClick={() => onNavigate && onNavigate('personal')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    个人设置
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('login')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    退出登录
                  </button>"""

new_links = """                  <button 
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
                  </button>"""

content = content.replace(old_links, new_links)
with open('src/pages/ConfigManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


with open('src/pages/Personal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
    
# In Personal.tsx, the first button goes to setActiveMenu('info') instead of onNavigate('personal')
old_links_personal = """                  <button 
                    onClick={() => setActiveMenu('info')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    个人设置
                  </button>
                  <button 
                    onClick={() => onNavigate && onNavigate('login')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    退出登录
                  </button>"""

new_links_personal = """                  <button 
                    onClick={() => setActiveMenu('info')}
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
                  </button>"""

content = content.replace(old_links_personal, new_links_personal)
with open('src/pages/Personal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
