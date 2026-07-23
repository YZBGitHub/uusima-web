import re

with open('src/pages/OnlineTenants.tsx', 'r') as f:
    content = f.read()

# Update interface
content = content.replace("  updateTime: string;\n}", "  updateTime: string;\n  status: 'enabled' | 'disabled';\n}")

# Update default data
content = content.replace("      updateTime: '2026-07-22 14:30:00'", "      updateTime: '2026-07-22 14:30:00',\n      status: 'enabled'")
content = content.replace("      updateTime: '2026-07-21 16:45:00'", "      updateTime: '2026-07-21 16:45:00',\n      status: 'enabled'")
content = content.replace("      updateTime: '2026-07-20 09:00:00'", "      updateTime: '2026-07-20 09:00:00',\n      status: 'disabled'")

# Add selected state and toggle functions
states_code = """  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTenantIds(currentTenants.map(t => t.id));
    } else {
      setSelectedTenantIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedTenantIds(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleBatchStatusChange = (status: 'enabled' | 'disabled') => {
    setTenants(prev => prev.map(t => 
      selectedTenantIds.includes(t.id) ? { ...t, status } : t
    ));
    setSelectedTenantIds([]); // clear selection after action
  };
"""

content = re.sub(
    r"(const \[modalState, setModalState\] = useState)",
    states_code + r"\n  \1",
    content
)

# Add batch action bar
batch_bar = """      {/* Action Area */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => handleBatchStatusChange('enabled')}
          disabled={selectedTenantIds.length === 0}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          批量启用
        </button>
        <button 
          onClick={() => handleBatchStatusChange('disabled')}
          disabled={selectedTenantIds.length === 0}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          批量禁用
        </button>
      </div>"""

content = content.replace("      {/* List Area */}", batch_bar + "\n\n      {/* List Area */}")

# Add table columns
th_update = """              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={currentTenants.length > 0 && selectedTenantIds.length === currentTenants.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 font-medium text-slate-500">创建时间</th>
                <th className="px-6 py-4 font-medium text-slate-500">租户名称</th>
                <th className="px-6 py-4 font-medium text-slate-500">租户类型</th>
                <th className="px-6 py-4 font-medium text-slate-500">所在城市</th>
                <th className="px-6 py-4 font-medium text-slate-500">状态</th>
                <th className="px-6 py-4 font-medium text-slate-500">更新时间</th>
                <th className="px-6 py-4 font-medium text-slate-500 text-right w-32">操作</th>
              </tr>"""

content = re.sub(r"<tr>\s*<th className=\"px-6 py-4 font-medium text-slate-500\">创建时间.*?</tr>", th_update, content, flags=re.DOTALL)

td_update = """                <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedTenantIds.includes(tenant.id)}
                      onChange={() => handleSelectOne(tenant.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-700">{tenant.createTime}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{tenant.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tenant.type === '学校' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {tenant.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{tenant.city}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tenant.status === 'enabled' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {tenant.status === 'enabled' ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{tenant.updateTime}</td>
                  <td className="px-6 py-4 text-right">"""

content = re.sub(r"<tr key=\{tenant\.id\} className=\"hover:bg-slate-50 transition-colors\">.*?<td className=\"px-6 py-4 text-right\">", td_update, content, flags=re.DOTALL)

# Empty state colSpan from 6 to 8
content = content.replace("colSpan={6}", "colSpan={8}")

with open('src/pages/OnlineTenants.tsx', 'w') as f:
    f.write(content)
