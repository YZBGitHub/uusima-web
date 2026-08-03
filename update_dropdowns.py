import re

def update_imports(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lucide_imports_match = re.search(r'import \{([^}]+)\} from [\'"]lucide-react[\'"];', content)
    if lucide_imports_match:
        existing_imports = [imp.strip() for imp in lucide_imports_match.group(1).split(',')]
        required_imports = ['ChevronRight', 'UserCircle', 'Settings', 'LogOut', 'Activity']
        for req in required_imports:
            if req not in existing_imports:
                existing_imports.append(req)
        
        new_import_stmt = f"import {{ {', '.join(existing_imports)} }} from 'lucide-react';"
        content = content[:lucide_imports_match.start()] + new_import_stmt + content[lucide_imports_match.end():]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

for file in ['src/pages/Home.tsx', 'src/pages/Profile.tsx']:
    update_imports(file)
