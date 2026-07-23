import re

with open('src/pages/OnlineTenants.tsx', 'r') as f:
    content = f.read()

# Add states for Add Modal
add_modal_states = """  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    type: '学校',
    city: '',
    schoolLevel: '本科',
    subCollege: ''
  });

  const handleAddTenant = () => {
    const t: Tenant = {
      id: Math.random().toString(36).substr(2, 9),
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      name: newTenant.name,
      type: newTenant.type,
      city: newTenant.city,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'enabled'
    };
    setTenants([t, ...tenants]);
    setIsAddModalOpen(false);
    setNewTenant({
      name: '',
      type: '学校',
      city: '',
      schoolLevel: '本科',
      subCollege: ''
    });
  };
"""

content = re.sub(r"(const \[modalState, setModalState\] = useState)", add_modal_states + r"\n  \1", content)

# Add "新增租户" button
add_btn = """      {/* Action Area */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center"
        >
          <span className="mr-1">+</span> 新增租户
        </button>
"""

content = content.replace("      {/* Action Area */}\n      <div className=\"flex items-center space-x-2\">", add_btn)


# Add Add Modal JSX
add_modal_jsx = """      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setIsAddModalOpen(false)}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">新增租户</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">租户名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newTenant.name}
                    onChange={e => setNewTenant({...newTenant, name: e.target.value})}
                    placeholder="请输入租户名称" 
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">租户类型 <span className="text-red-500">*</span></label>
                  <select 
                    value={newTenant.type}
                    onChange={e => setNewTenant({...newTenant, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="学校">学校</option>
                    <option value="机构">机构</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">所在城市 (省市区) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newTenant.city}
                    onChange={e => setNewTenant({...newTenant, city: e.target.value})}
                    placeholder="例：浙江省杭州市西湖区" 
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>

                {newTenant.type === '学校' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">学校层次 <span className="text-red-500">*</span></label>
                      <select 
                        value={newTenant.schoolLevel}
                        onChange={e => setNewTenant({...newTenant, schoolLevel: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="本科">本科</option>
                        <option value="高职">高职</option>
                        <option value="独立学院">独立学院</option>
                        <option value="中职中专">中职中专</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">二级学院名称 (非必填)</label>
                      <input 
                        type="text" 
                        value={newTenant.subCollege}
                        onChange={e => setNewTenant({...newTenant, subCollege: e.target.value})}
                        placeholder="请输入二级学院名称" 
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-200 space-x-3">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm hover:bg-slate-100 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddTenant}
                  disabled={!newTenant.name || !newTenant.city}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal */}"""

content = content.replace("      {/* Modal */}", add_modal_jsx)

# Also update the original search dropdown to include '机构'
search_dropdown = """          <select 
            value={searchParams.type}
            onChange={e => setSearchParams({...searchParams, type: e.target.value})}
            className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="学校">学校</option>
            <option value="企业">企业</option>
            <option value="机构">机构</option>
          </select>"""

content = re.sub(
    r"<select \s*value=\{searchParams\.type\}.*?</select>",
    search_dropdown,
    content,
    flags=re.DOTALL
)

with open('src/pages/OnlineTenants.tsx', 'w') as f:
    f.write(content)
