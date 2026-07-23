import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
import_pattern = r"(import ConfigManagement from \"\./pages/ConfigManagement\";)"
content = re.sub(import_pattern, r"\1\nimport PlatformOperation from \"./pages/PlatformOperation\";", content)

# Add to activeView type
type_pattern = r"(\| \"mobile-success\")"
content = re.sub(type_pattern, r"\1\n    | \"platform-operation\"", content)

# Add to navItems
nav_items_pattern = r"(\{ id: \"mobile-success\", label: \"移动端注册成功\" \},)"
content = re.sub(nav_items_pattern, r"\1\n    { id: \"platform-operation\", label: \"平台运营\" },", content)

# Add component to render
render_pattern = r"(\{activeView === \"mobile-success\" && <MobileRegistrationSuccess />\})"
new_render = r"\1\n        {activeView === \"platform-operation\" && (\n          <PlatformOperation onNavigate={(view) => setActiveView(view as any)} />\n        )}"
content = re.sub(render_pattern, new_render, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
