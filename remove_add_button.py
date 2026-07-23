import re

with open('src/pages/OrdersManagement.tsx', 'r') as f:
    content = f.read()

# Match the button block precisely
btn_regex = r"\s*\{!isSystemManagement && \(\s*<button[^>]*>\s*<Plus[^>]*>\s*新增订单\s*</button>\s*\)\}"
content = re.sub(btn_regex, "", content)

# Remove the showAddModal references
# content = re.sub(r"const \[showAddModal, setShowAddModal\] = useState\(false\);", "", content)

with open('src/pages/OrdersManagement.tsx', 'w') as f:
    f.write(content)
