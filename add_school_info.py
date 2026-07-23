import re

with open('src/pages/OnlineTenants.tsx', 'r') as f:
    content = f.read()

# Add Info to lucide-react imports
content = content.replace("Activity, X, MoreHorizontal }", "Activity, X, MoreHorizontal, Info }")

# Update Tenant interface
content = content.replace("  updateTime: string;\n  status: 'enabled' | 'disabled';\n}", "  updateTime: string;\n  status: 'enabled' | 'disabled';\n  schoolLevel?: string;\n  subCollege?: string;\n}")

# Update mock data to include school details
content = content.replace("      city: '上海',\n      updateTime: '2026-07-22 14:30:00',\n      status: 'enabled'", "      city: '上海',\n      updateTime: '2026-07-22 14:30:00',\n      status: 'enabled',\n      schoolLevel: '本科',\n      subCollege: '计算机科学与技术学院'")
content = content.replace("      city: '杭州',\n      updateTime: '2026-07-20 09:00:00',\n      status: 'disabled'", "      city: '杭州',\n      updateTime: '2026-07-20 09:00:00',\n      status: 'disabled',\n      schoolLevel: '本科',\n      subCollege: '软件学院'")


# Update handleAddTenant
content = re.sub(
    r"city: newTenant\.city,\n\s*updateTime: new Date\(\)\.toISOString\(\)\.replace\('T', ' '\)\.substring\(0, 19\),\n\s*status: 'enabled'\n\s*\};",
    "city: newTenant.city,\n      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),\n      status: 'enabled',\n      schoolLevel: newTenant.type === '学校' ? newTenant.schoolLevel : undefined,\n      subCollege: newTenant.type === '学校' ? newTenant.subCollege : undefined\n    };",
    content
)

# Render info tooltip
target_type_cell = """                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tenant.type === '学校' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {tenant.type}
                    </span>
                  </td>"""

new_type_cell = """                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        tenant.type === '学校' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {tenant.type}
                      </span>
                      {tenant.type === '学校' && (
                        <div className="relative group ml-2 flex items-center">
                          <Info className="w-4 h-4 text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50">
                            <div className="bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                              <div className="flex flex-col space-y-1">
                                <div><span className="text-slate-400">学校层次：</span>{tenant.schoolLevel || '-'}</div>
                                <div><span className="text-slate-400">所在城市：</span>{tenant.city || '-'}</div>
                                <div><span className="text-slate-400">二级学院：</span>{tenant.subCollege || '-'}</div>
                              </div>
                              <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>"""

content = content.replace(target_type_cell, new_type_cell)

with open('src/pages/OnlineTenants.tsx', 'w') as f:
    f.write(content)
