import re

with open('src/pages/OrdersManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add formErrors state
content = content.replace(
    "  const [formData, setFormData] = useState({",
    "  const [formErrors, setFormErrors] = useState<Record<string, string>>({});\n  const [formData, setFormData] = useState({"
)

# Replace the input fields in step 3
step3_old = """      case 3:
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">3. 表单信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-600">项目名称 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">客户名称 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">销售人员 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.salesperson} onChange={e => setFormData({...formData, salesperson: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">订单价格 <span className="text-red-500">*</span></label>
                <input type="number" value={formData.orderPrice} onChange={e => setFormData({...formData, orderPrice: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">CRM订单号 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.crmOrderNo} onChange={e => setFormData({...formData, crmOrderNo: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>"""

step3_new = """      case 3:
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">3. 表单信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-600">项目名称 <span className="text-red-500">*</span></label>
                <input type="text" maxLength={100} value={formData.projectName} onChange={e => { setFormData({...formData, projectName: e.target.value}); setFormErrors({...formErrors, projectName: ''}); }} className={`w-full px-3 py-2 border ${formErrors.projectName ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} />
                {formErrors.projectName && <p className="text-xs text-red-500">{formErrors.projectName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">客户名称 <span className="text-red-500">*</span></label>
                <input type="text" maxLength={100} value={formData.customerName} onChange={e => { setFormData({...formData, customerName: e.target.value}); setFormErrors({...formErrors, customerName: ''}); }} className={`w-full px-3 py-2 border ${formErrors.customerName ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} />
                {formErrors.customerName && <p className="text-xs text-red-500">{formErrors.customerName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">销售人员 <span className="text-red-500">*</span></label>
                <input type="text" maxLength={50} value={formData.salesperson} onChange={e => { setFormData({...formData, salesperson: e.target.value}); setFormErrors({...formErrors, salesperson: ''}); }} className={`w-full px-3 py-2 border ${formErrors.salesperson ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} />
                {formErrors.salesperson && <p className="text-xs text-red-500">{formErrors.salesperson}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">订单价格 <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" min="0" value={formData.orderPrice} onChange={e => { setFormData({...formData, orderPrice: e.target.value}); setFormErrors({...formErrors, orderPrice: ''}); }} className={`w-full px-3 py-2 border ${formErrors.orderPrice ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} />
                {formErrors.orderPrice && <p className="text-xs text-red-500">{formErrors.orderPrice}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">CRM订单号 <span className="text-red-500">*</span></label>
                <input type="text" maxLength={50} value={formData.crmOrderNo} onChange={e => { setFormData({...formData, crmOrderNo: e.target.value}); setFormErrors({...formErrors, crmOrderNo: ''}); }} className={`w-full px-3 py-2 border ${formErrors.crmOrderNo ? 'border-red-500' : 'border-slate-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`} />
                {formErrors.crmOrderNo && <p className="text-xs text-red-500">{formErrors.crmOrderNo}</p>}
              </div>"""

content = content.replace(step3_old, step3_new)

# Update remarks
remarks_old = """              <div className="space-y-1 col-span-2">
                <label className="text-sm text-slate-600">填写备注</label>
                <textarea rows={2} value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>"""
remarks_new = """              <div className="space-y-1 col-span-2">
                <label className="text-sm text-slate-600">填写备注</label>
                <textarea rows={2} maxLength={500} value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>"""
content = content.replace(remarks_old, remarks_new)

# Add validation logic
validation_fn = """
  const handleNextStep = () => {
    if (addStep === 3) {
      const newErrors: Record<string, string> = {};
      const { projectName, customerName, salesperson, orderPrice, crmOrderNo } = formData;
      
      if (!projectName.trim()) newErrors.projectName = '项目名称不能为空';
      else if (projectName.trim().length > 100) newErrors.projectName = '项目名称长度不能超过100个字符';
      
      if (!customerName.trim()) newErrors.customerName = '客户名称不能为空';
      else if (customerName.trim().length > 100) newErrors.customerName = '客户名称长度不能超过100个字符';
      
      if (!salesperson.trim()) newErrors.salesperson = '销售人员不能为空';
      else if (salesperson.trim().length > 50) newErrors.salesperson = '销售人员长度不能超过50个字符';
      
      if (!orderPrice) {
        newErrors.orderPrice = '订单价格不能为空';
      } else {
        const p = Number(orderPrice);
        if (p < 0 || isNaN(p)) newErrors.orderPrice = '订单价格必须为大于等于0的数值';
        else if (!/^\d+(\.\d{1,2})?$/.test(orderPrice.toString())) newErrors.orderPrice = '格式上最多保留 2 位小数';
      }
      
      if (!crmOrderNo.trim()) {
        newErrors.crmOrderNo = 'CRM订单号不能为空';
      } else if (!/^[a-zA-Z0-9\-_]+$/.test(crmOrderNo.trim())) {
        newErrors.crmOrderNo = 'CRM订单号只能包含英文字母、数字及连字符（-、_）';
      } else if (crmOrderNo.trim().length > 50) {
        newErrors.crmOrderNo = 'CRM订单号长度不能超过50个字符';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setFormErrors(newErrors);
        return;
      }
    }
    
    setAddStep(addStep + 1);
  };
"""

content = content.replace(
    "  const renderAddModalContent = () => {",
    validation_fn + "\n  const renderAddModalContent = () => {"
)

# Use handleNextStep instead of setAddStep(addStep + 1)
content = content.replace(
    "onClick={() => setAddStep(addStep + 1)}",
    "onClick={handleNextStep}"
)

# Open order modal resetting errors
content = content.replace(
    "setFormData({ projectName: \"\", customerName: \"\", salesperson: \"\", orderPrice: \"\", crmOrderNo: \"\", remarks: \"\" }); setPackageCount(1); setSelectedPackage(null); setSelectedCourse(null);",
    "setFormErrors({}); setFormData({ projectName: \"\", customerName: \"\", salesperson: \"\", orderPrice: \"\", crmOrderNo: \"\", remarks: \"\" }); setPackageCount(1); setSelectedPackage(null); setSelectedCourse(null);"
)

with open('src/pages/OrdersManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
