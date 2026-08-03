import os

with open('src/pages/BillingPackage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make changes to mock data
content = content.replace("serviceLife: 1,", "serviceLife: 12,")
content = content.replace("<th>有效期(年)</th>", "<th>有效期(月)</th>")
content = content.replace("有效期(年)", "使用有效期(月)")

# Replace initialFormData
old_form_data = """  const initialFormData = {
    name: '',
    type: 'UUSIMA',
    duration: '' as number | '',
    tokenCount: '' as number | '',
    accountCount: '' as number | '',
    pptCount: '' as number | '',
    serviceLife: '' as number | '',
    price: '' as number | '',
    products: [] as string[]
  };"""

new_form_data = """  const initialFormData = {
    name: '',
    type: 'UUSIMA',
    duration: 0 as number | '',
    tokenCount: 0 as number | '',
    accountCount: 0 as number | '',
    pptCount: 0 as number | '',
    serviceLife: 12 as number | '',
    price: 0 as number | '',
    products: [] as string[]
  };"""

content = content.replace(old_form_data, new_form_data)

# Replace validateForm
old_validate = """  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '套餐名称不能为空';
    if (!formData.type) newErrors.type = '请选择套餐类型';
    if (formData.duration === '') newErrors.duration = '不能为空';
    if (formData.tokenCount === '') newErrors.tokenCount = '不能为空';
    if (formData.accountCount === '') newErrors.accountCount = '不能为空';
    if (formData.pptCount === '') newErrors.pptCount = '不能为空';
    if (formData.serviceLife === '') newErrors.serviceLife = '不能为空';
    if (formData.price === '') newErrors.price = '不能为空';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };"""

new_validate = """  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = '套餐名称不能为空';
    } else if (trimmedName.length > 50) {
      newErrors.name = '套餐名称最多50个字符';
    } else {
      const isDuplicate = packages.some(p => p.type === formData.type && p.name === trimmedName && p.id !== editingId && p.status !== 'archived');
      if (isDuplicate) {
        newErrors.name = '同类型下套餐名称已存在';
      }
    }

    if (!formData.type) newErrors.type = '请选择套餐类型';

    if (formData.duration !== '' && (Number(formData.duration) < 0 || !Number.isInteger(Number(formData.duration)) || Number(formData.duration) > 999999)) {
      newErrors.duration = '必须为0-999999的整数';
    }
    if (formData.tokenCount !== '' && (Number(formData.tokenCount) < 0 || !Number.isInteger(Number(formData.tokenCount)) || Number(formData.tokenCount) > 999999999)) {
      newErrors.tokenCount = '必须为0-999999999的整数';
    }
    if (formData.accountCount !== '' && (Number(formData.accountCount) < 0 || !Number.isInteger(Number(formData.accountCount)))) {
      newErrors.accountCount = '必须为非负整数';
    }
    if (formData.pptCount !== '' && (Number(formData.pptCount) < 0 || !Number.isInteger(Number(formData.pptCount)))) {
      newErrors.pptCount = '必须为非负整数';
    }
    if (formData.serviceLife === '' || Number(formData.serviceLife) < 1 || Number(formData.serviceLife) > 1200 || !Number.isInteger(Number(formData.serviceLife))) {
      newErrors.serviceLife = '必须为1-1200的整数';
    }
    
    if (formData.price === '') {
      newErrors.price = '套餐价格不能为空';
    } else {
      const priceNum = Number(formData.price);
      if (priceNum < 0 || priceNum > 999999999.99) {
        newErrors.price = '价格范围0-999999999.99';
      } else if (!/^\\d+(\\.\\d{1,2})?$/.test(String(formData.price))) {
        newErrors.price = '最多保留两位小数';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };"""

content = content.replace(old_validate, new_validate)

# Replace handleSubmit mapping logic
old_submit_map = """    const submittedData = {
      name: formData.name.trim(),
      type: formData.type,
      duration: Number(formData.duration),
      tokenCount: Number(formData.tokenCount),
      accountCount: Number(formData.accountCount),
      pptCount: Number(formData.pptCount),
      serviceLife: Number(formData.serviceLife),
      price: Number(formData.price),
      products: formData.products.join(', ')
    };"""

new_submit_map = """    const submittedData = {
      name: formData.name.trim(),
      type: formData.type,
      duration: formData.duration === '' ? 0 : Number(formData.duration),
      tokenCount: formData.tokenCount === '' ? 0 : Number(formData.tokenCount),
      accountCount: formData.accountCount === '' ? 0 : Number(formData.accountCount),
      pptCount: formData.pptCount === '' ? 0 : Number(formData.pptCount),
      serviceLife: Number(formData.serviceLife),
      price: Number(formData.price),
      products: formData.products.join(', ')
    };"""

content = content.replace(old_submit_map, new_submit_map)

# Update form inputs HTML labels
content = content.replace('<label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 实验时长(分钟)</label>', '<label className="text-sm font-medium text-slate-700">实验时长(分钟)</label>')
content = content.replace('<label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> token数量</label>', '<label className="text-sm font-medium text-slate-700">token数量</label>')
content = content.replace('<label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> 账号数量</label>', '<label className="text-sm font-medium text-slate-700">账号数量</label>')
content = content.replace('<label className="text-sm font-medium text-slate-700"><span className="text-red-500">*</span> PPT次数</label>', '<label className="text-sm font-medium text-slate-700">PPT次数</label>')
content = content.replace('step="0.1" min="0.1"', 'step="1" min="1" max="1200"')

# One more fix, the table header needs to be "有效期(月)"
content = content.replace('<th className="px-6 py-4 font-medium text-slate-500 w-24 text-right">有效期(年)</th>', '<th className="px-6 py-4 font-medium text-slate-500 w-24 text-right">有效期(月)</th>')

with open('src/pages/BillingPackage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

