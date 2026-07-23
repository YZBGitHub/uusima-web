import re

with open('src/pages/OrdersManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add formErrors state
state_insertion = """  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.projectName.trim()) {
      errors.projectName = '项目名称不能为空';
    } else if (formData.projectName.length > 100) {
      errors.projectName = '字符长度限制在 1 ~ 100 个字符之间';
    }

    if (!formData.customerName.trim()) {
      errors.customerName = '客户名称不能为空';
    } else if (formData.customerName.length > 100) {
      errors.customerName = '字符长度限制在 1 ~ 100 个字符之间';
    }

    if (!formData.salesperson.trim()) {
      errors.salesperson = '销售人员不能为空';
    } else if (formData.salesperson.length > 50) {
      errors.salesperson = '字符长度限制在 1 ~ 50 个字符之间';
    }

    if (!formData.orderPrice.trim()) {
      errors.orderPrice = '订单价格不能为空';
    } else {
      const priceNum = Number(formData.orderPrice);
      if (isNaN(priceNum) || priceNum < 0) {
        errors.orderPrice = '必须为大于等于 0 的数值';
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.orderPrice)) {
        errors.orderPrice = '格式上最多保留 2 位小数';
      }
    }

    if (!formData.crmOrderNo.trim()) {
      errors.crmOrderNo = 'CRM订单号不能为空';
    } else if (!/^[A-Za-z0-9\-_]+$/.test(formData.crmOrderNo)) {
      errors.crmOrderNo = '只能输入英文字母、数字及连字符（-、_）';
    } else if (formData.crmOrderNo.length > 50) {
      errors.crmOrderNo = '字符长度限制在 1 ~ 50 个字符之间';
    }

    if (formData.remarks && formData.remarks.length > 500) {
      errors.remarks = '字符长度限制在 0 ~ 500 个字符之间';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
"""

content = content.replace("  const [showVoidConfirm, setShowVoidConfirm] = useState(false);", "  const [showVoidConfirm, setShowVoidConfirm] = useState(false);\n" + state_insertion)

# Replace '下一步' button logic
next_button_old = """                    <button
                      onClick={() => setAddStep(addStep + 1)}
                      className="px-4 py-2 bg-[#108ee9] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                    >"""
next_button_new = """                    <button
                      onClick={() => {
                        if (addStep === 3) {
                          if (validateStep3()) {
                            setAddStep(addStep + 1);
                          }
                        } else {
                          setAddStep(addStep + 1);
                        }
                      }}
                      className="px-4 py-2 bg-[#108ee9] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                    >"""
content = content.replace(next_button_old, next_button_new)

# Modify case 3 HTML
old_case3_match = re.search(r"      case 3:\n        return \(\n          <div className=\"space-y-4\">.*?          </div>\n        \);", content, re.DOTALL)

new_case3 = """      case 3:
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">3. 表单信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-600">项目名称 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.projectName} onChange={e => { setFormData({...formData, projectName: e.target.value}); if (formErrors.projectName) setFormErrors({...formErrors, projectName: ''}) }} className={`w-full px-3 py-2 border ${formErrors.projectName ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="1 ~ 100 个字符" />
                {formErrors.projectName && <p className="text-xs text-red-500">{formErrors.projectName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">客户名称 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.customerName} onChange={e => { setFormData({...formData, customerName: e.target.value}); if (formErrors.customerName) setFormErrors({...formErrors, customerName: ''}) }} className={`w-full px-3 py-2 border ${formErrors.customerName ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="1 ~ 100 个字符" />
                {formErrors.customerName && <p className="text-xs text-red-500">{formErrors.customerName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">销售人员 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.salesperson} onChange={e => { setFormData({...formData, salesperson: e.target.value}); if (formErrors.salesperson) setFormErrors({...formErrors, salesperson: ''}) }} className={`w-full px-3 py-2 border ${formErrors.salesperson ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="1 ~ 50 个字符" />
                {formErrors.salesperson && <p className="text-xs text-red-500">{formErrors.salesperson}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">订单价格 <span className="text-red-500">*</span></label>
                <input type="number" min="0" step="0.01" value={formData.orderPrice} onChange={e => { setFormData({...formData, orderPrice: e.target.value}); if (formErrors.orderPrice) setFormErrors({...formErrors, orderPrice: ''}) }} className={`w-full px-3 py-2 border ${formErrors.orderPrice ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="必须为非负数" />
                {formErrors.orderPrice && <p className="text-xs text-red-500">{formErrors.orderPrice}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">CRM订单号 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.crmOrderNo} onChange={e => { setFormData({...formData, crmOrderNo: e.target.value}); if (formErrors.crmOrderNo) setFormErrors({...formErrors, crmOrderNo: ''}) }} className={`w-full px-3 py-2 border ${formErrors.crmOrderNo ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="英文字母、数字、连字符" />
                {formErrors.crmOrderNo && <p className="text-xs text-red-500">{formErrors.crmOrderNo}</p>}
              </div>
              <div className="space-y-1 relative">
                <label className="text-sm text-slate-600">(可选) 课程包</label>
                <div 
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white cursor-pointer flex justify-between items-center"
                  onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                >
                  <span className={selectedCourse ? "text-slate-800" : "text-slate-400"}>
                    {selectedCourse ? courses.find(c => c.id === selectedCourse)?.name : "请搜索并选择课程包"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                
                {isCourseDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-2 top-2" />
                        <input
                          type="text"
                          placeholder="搜索课程包..."
                          value={courseSearch}
                          onChange={e => setCourseSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-transparent rounded text-sm focus:outline-none focus:bg-white focus:border-blue-500"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto">
                      <div 
                        className="px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 cursor-pointer"
                        onClick={() => { setSelectedCourse(null); setIsCourseDropdownOpen(false); }}
                      >
                        不选择
                      </div>
                      {courses.filter(c => c.name.includes(courseSearch)).map(course => (
                        <div 
                          key={course.id}
                          className="px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer"
                          onClick={() => {
                            setSelectedCourse(course.id);
                            setIsCourseDropdownOpen(false);
                            setCourseSearch('');
                          }}
                        >
                          {course.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-sm text-slate-600">填写备注</label>
                <textarea rows={2} value={formData.remarks} onChange={e => { setFormData({...formData, remarks: e.target.value}); if (formErrors.remarks) setFormErrors({...formErrors, remarks: ''}) }} className={`w-full px-3 py-2 border ${formErrors.remarks ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} placeholder="补充说明事项，最多500字符"></textarea>
                {formErrors.remarks && <p className="text-xs text-red-500">{formErrors.remarks}</p>}
              </div>
            </div>
          </div>
        );"""

if old_case3_match:
    content = content[:old_case3_match.start()] + new_case3 + content[old_case3_match.end():]
else:
    print("Failed to find case 3")

with open('src/pages/OrdersManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

