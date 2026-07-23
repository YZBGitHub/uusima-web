import re

with open('src/pages/PrivateTenants.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove table headers
old_headers = """                <th className="px-6 py-4 font-medium text-slate-500">服务状态</th>
                <th className="px-6 py-4 font-medium text-slate-500">更新时间</th>"""
content = content.replace(old_headers, "")

# Remove table cells
old_cells = """                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tenant.status === 'enabled' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {tenant.status === 'enabled' ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{tenant.updateTime}</td>"""
content = content.replace(old_cells, "")

# Also need to fix the colSpan from 8 to 6 at the bottom for "暂无租户数据"
content = content.replace("colSpan={8}", "colSpan={6}")
# Actually it was colSpan={8}. Let's change it.

with open('src/pages/PrivateTenants.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
