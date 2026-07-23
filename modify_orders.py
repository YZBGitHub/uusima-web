import re

with open('src/pages/OrdersManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Order interface to include status
content = content.replace(
    '  packageDetails: PackageDetails;\n}',
    '  packageDetails: PackageDetails;\n  status: \'生效中\' | \'到期\' | \'已作废\';\n}'
)

# 2. Update orders mock data with status
content = content.replace(
    "      packageDetails: {",
    "      status: '生效中',\n      packageDetails: {"
)
# Make order 2 '已作废' just to have variety
content = content.replace(
    "      packageDetails: {\n        packageType: '陆产通',",
    "      status: '已作废',\n      packageDetails: {\n        packageType: '陆产通',"
)

# 3. Add selectedRows state and handle select/selectAll
imports_match = re.search(r"import React, { useState } from 'react';", content)
if imports_match:
    content = content.replace(
        "import React, { useState } from 'react';",
        "import React, { useState, useMemo } from 'react';"
    )

state_insertion = """  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [statusSearch, setStatusSearch] = useState('');
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);"""
content = content.replace("  const [formData, setFormData] = useState({", state_insertion + "\n  const [formData, setFormData] = useState({")

# 4. Add "批量作废" button
add_button_block = """        {!isSystemManagement && (
          <button
            onClick={() => { setShowAddModal(true); setAddStep(hideTenantSearch ? 2 : 1); setFormData({ projectName: "", customerName: "", salesperson: "", orderPrice: "", crmOrderNo: "", remarks: "" }); setPackageCount(1); setSelectedPackage(null); setSelectedCourse(null); }}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>新增订单</span>
          </button>
        )}"""
new_buttons_block = """        <div className="flex space-x-3">
          <button
            onClick={() => selectedOrders.size > 0 && setShowVoidConfirm(true)}
            disabled={selectedOrders.size === 0}
            className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            <span>批量作废</span>
          </button>
          {!isSystemManagement && (
            <button
              onClick={() => { setShowAddModal(true); setAddStep(hideTenantSearch ? 2 : 1); setFormData({ projectName: "", customerName: "", salesperson: "", orderPrice: "", crmOrderNo: "", remarks: "" }); setPackageCount(1); setSelectedPackage(null); setSelectedCourse(null); }}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>新增订单</span>
            </button>
          )}
        </div>"""
content = content.replace(add_button_block, new_buttons_block)

# 5. Add status filter to Search Area
status_filter = """        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 whitespace-nowrap">状态：</span>
          <select 
            value={statusSearch}
            onChange={(e) => setStatusSearch(e.target.value)}
            className="w-40 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="生效中">生效中</option>
            <option value="到期">到期</option>
            <option value="已作废">已作废</option>
          </select>
        </div>"""

search_area_marker = """<div className="flex items-center space-x-2 ml-auto">"""
content = content.replace(search_area_marker, status_filter + "\n        " + search_area_marker)

# 6. Add Checkbox column to table
th_checkbox = """<th className="w-10 px-4"></th>"""
new_th_checkbox = """<th className="w-10 px-4">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(new Set(currentOrders.map(o => o.id)));
                      } else {
                        setSelectedOrders(new Set());
                      }
                    }}
                    checked={currentOrders.length > 0 && selectedOrders.size === currentOrders.length}
                  />
                </th>
                <th className="w-10 px-4"></th>"""
content = content.replace(th_checkbox, new_th_checkbox)

# Also add 状态 column header
th_status = """<th className="px-6 py-4 font-medium text-slate-500">创建时间</th>"""
new_th_status = th_status + """\n                <th className="px-6 py-4 font-medium text-slate-500">状态</th>"""
content = content.replace(th_status, new_th_status)

# 7. Add Checkbox to td and toggleRow td, and status td
td_toggle = """<td className="px-4 py-4">
                      <button onClick={() => toggleRow(order.id)} className="text-slate-400 hover:text-slate-600">
                        {expandedRows.has(order.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>"""
new_td_toggle = """<td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selectedOrders.has(order.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedOrders);
                          if (e.target.checked) {
                            newSelected.add(order.id);
                          } else {
                            newSelected.delete(order.id);
                          }
                          setSelectedOrders(newSelected);
                        }}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => toggleRow(order.id)} className="text-slate-400 hover:text-slate-600">
                        {expandedRows.has(order.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>"""
content = content.replace(td_toggle, new_td_toggle)

# 8. Add status display td
td_status = """<td className="px-6 py-4 text-slate-700">{order.createTime}</td>"""
new_td_status = td_status + """\n                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        order.status === '生效中' ? 'bg-green-100 text-green-700' : 
                        order.status === '到期' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>"""
content = content.replace(td_status, new_td_status)

# Increase colSpan for expanded row
content = content.replace('colSpan={6}', 'colSpan={8}')

# 9. Add Void Confirm Modal
void_modal = """
      {/* Void Confirm Modal */}
      {showVoidConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认作废？</h3>
              <p className="text-sm text-slate-600">您已选择 {selectedOrders.size} 个订单，作废后相关服务将停止，确认作废吗？</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button onClick={() => setShowVoidConfirm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded bg-white hover:bg-slate-50 transition-colors text-sm font-medium">取消</button>
              <button onClick={() => {
                // Here you would normally update the actual data. For demo:
                setShowVoidConfirm(false);
                setSelectedOrders(new Set());
              }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium">确认作废</button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace('      <AnimatePresence>', void_modal + '\n      <AnimatePresence>', 1)

with open('src/pages/OrdersManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

