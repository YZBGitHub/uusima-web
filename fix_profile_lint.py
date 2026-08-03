import re

with open('src/pages/Profile.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if "const onNavigate = (view: string) => {};" not in content:
    content = content.replace("const activeTenant = { name: \"教育公司\" };", 
    "const activeTenant = { name: \"教育公司\" };\n  const onNavigate = (view: string) => {};")
    
    with open('src/pages/Profile.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
