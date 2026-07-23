import re

with open('src/pages/OrdersManagement.tsx', 'r') as f:
    content = f.read()

btn_regex = r"\s*\{!isSystemManagement && \(\s*<button.*?新增订单\s*</button>\s*\)\}"
content = re.sub(btn_regex, "", content, flags=re.DOTALL)

with open('src/pages/OrdersManagement.tsx', 'w') as f:
    f.write(content)
