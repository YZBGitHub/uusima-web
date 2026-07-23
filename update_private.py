import re

with open('src/pages/PrivateTenants.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
content = content.replace("import TenantAuthManagement from './TenantAuthManagement';", "import TenantAuthManagement from './TenantAuthManagement';\nimport TenantDataOverview from './TenantDataOverview';")

# Update data case in renderModalContent
old_case = """      case 'data':
        content = (
          <div className="p-8 text-center text-slate-500">
            数据概览功能
          </div>
        );
        break;"""

new_case = """      case 'data':
        content = <TenantDataOverview />;
        break;"""

content = content.replace(old_case, new_case)

with open('src/pages/PrivateTenants.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
