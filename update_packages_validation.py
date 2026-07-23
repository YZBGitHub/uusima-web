import re

with open('src/pages/BillingPackage.tsx', 'r') as f:
    content = f.read()

# Update validation block
old_validation = """  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = '套餐名称不能为空';
    } else if (trimmedName.length < 1 || trimmedName.length > 50) {
      newErrors.name = '套餐名称长度限制在 1 ~ 50 个字符之间';
    }
    
    if (!formData.type) {
      newErrors.type = '请选择套餐类型';
    }

    if (formData.duration !== '') {
      const v = Number(formData.duration);
      if (!Number.isInteger(v) || v < 0) newErrors.duration = '必须为正整数或0';
    }
    
    if (formData.tokenCount !== '') {
      const v = Number(formData.tokenCount);
      if (!Number.isInteger(v) || v < 0) newErrors.tokenCount = '必须为正整数或0';
    }

    if (formData.accountCount !== '') {
      const v = Number(formData.accountCount);
      if (!Number.isInteger(v) || v < 0) newErrors.accountCount = '必须为正整数或0';
    }

    if (formData.pptCount !== '') {
      const v = Number(formData.pptCount);
      if (!Number.isInteger(v) || v < 0) newErrors.pptCount = '必须为正整数或0';
    }

    if (formData.serviceLife === '' || Number(formData.serviceLife) <= 0) {
      newErrors.serviceLife = '必须大于 0';
    }

    if (formData.price === '' || Number(formData.price) < 0) {
      newErrors.price = '价格必须非负';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };"""

new_validation = """  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = '套餐名称不能为空';
    } else if (trimmedName.length < 1 || trimmedName.length > 50) {
      newErrors.name = '套餐名称长度限制在 1 ~ 50 个字符之间';
    }
    
    if (!formData.type) {
      newErrors.type = '请选择套餐类型';
    }

    if (formData.duration !== '') {
      const v = Number(formData.duration);
      if (!Number.isInteger(v) || v < 0) newErrors.duration = '必须为大于等于0的整数';
      else if (v > 999999) newErrors.duration = '最大值不超过 999,999';
    }
    
    if (formData.tokenCount !== '') {
      const v = Number(formData.tokenCount);
      if (!Number.isInteger(v) || v < 0) newErrors.tokenCount = '必须为大于等于0的整数';
      else if (v > 999999999) newErrors.tokenCount = '最大值不超过 999,999,999';
    }

    if (formData.accountCount !== '') {
      const v = Number(formData.accountCount);
      if (!Number.isInteger(v) || v < 0) newErrors.accountCount = '必须为大于等于0的整数';
    }

    if (formData.pptCount !== '') {
      const v = Number(formData.pptCount);
      if (!Number.isInteger(v) || v < 0) newErrors.pptCount = '必须为大于等于0的整数';
    }

    if (formData.serviceLife === '' || Number(formData.serviceLife) <= 0) {
      newErrors.serviceLife = '必须大于 0';
    }

    if (formData.price === '') {
      newErrors.price = '套餐价格不能为空';
    } else {
      const v = Number(formData.price);
      if (v < 0) {
        newErrors.price = '价格必须非负';
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price.toString())) {
        newErrors.price = '最多保留 2 位小数';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };"""

content = content.replace(old_validation, new_validation)

with open('src/pages/BillingPackage.tsx', 'w') as f:
    f.write(content)

