import re

with open('src/pages/OnlineTenants.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure FileText is imported
if 'FileText' not in content:
    content = re.sub(r"import \{([^}]+)\} from 'lucide-react';", lambda m: f"import {{{m.group(1)}, FileText}} from 'lucide-react';", content)

# Add state and mock data
state_code = """  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);

  const mockLogs = [
    { time: '2026-8-8', type: '租户操作', operator: 'admin', remarks: '创建租户' },
    { time: '2026-9-9', type: '租户操作', operator: 'admin', remarks: '停用租户' },
    { time: '2026-9-9', type: '订单操作', operator: 'admin', remarks: '新增订单（订单号：xxx，金额：888）' },
    { time: '2026-9-9', type: '订单操作', operator: 'admin', remarks: '作废订单（订单号：xxx）' }
  ];"""

# Insert state after modal mode
if 'const [activeModal, setActiveModal] = useState' in content:
    content = content.replace("  const [activeModal, setActiveModal] = useState<'resource' | 'orders' | 'organization' | 'members' | null>(null);", "  const [activeModal, setActiveModal] = useState<'resource' | 'orders' | 'organization' | 'members' | null>(null);\n" + state_code)


button_target = """                      <button 
                        onClick={() => handleEditClick(tenant)}
                        className="text-[#108ee9] hover:text-blue-700 font-medium text-xs transition-colors"
                      >
                        编辑
                      </button>"""

button_replacement = """                      <button 
                        onClick={() => handleEditClick(tenant)}
                        className="text-[#108ee9] hover:text-blue-700 font-medium text-xs transition-colors"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => {
                          setCurrentTenantId(tenant.id);
                          setLogModalOpen(true);
                        }}
                        className="text-[#108ee9] hover:text-blue-700 font-medium text-xs transition-colors"
                      >
                        日志
                      </button>"""

content = content.replace(button_target, button_replacement)

log_modal_code = """      {/* 日志 Modal */}
      <AnimatePresence>
        {logModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLogModalOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-[700px] flex flex-col overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">日志</h2>
                  <button 
                    onClick={() => setLogModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-600 mb-4 text-sm">
                    记录租户的创建信息、订单新增记录、作废记录、启用停用记录。
                  </p>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#4a5568] text-white">
                        <tr>
                          <th className="px-4 py-3 font-medium w-[120px] border-r border-[#2d3748]/20">时间</th>
                          <th className="px-4 py-3 font-medium w-[120px] border-r border-[#2d3748]/20">类型</th>
                          <th className="px-4 py-3 font-medium w-[120px] border-r border-[#2d3748]/20">操作者</th>
                          <th className="px-4 py-3 font-medium">备注说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {mockLogs.map((log, idx) => (
                          <tr key={idx} className="bg-white hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-700 border-r border-slate-200">{log.time}</td>
                            <td className="px-4 py-3 text-slate-700 border-r border-slate-200">{log.type}</td>
                            <td className="px-4 py-3 text-slate-700 border-r border-slate-200">{log.operator}</td>
                            <td className="px-4 py-3 text-slate-700">{log.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}"""

content = content.replace("    </div>\n  );\n}", log_modal_code)

with open('src/pages/OnlineTenants.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

