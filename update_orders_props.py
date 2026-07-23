import re

with open('src/pages/OrdersManagement.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'export default function OrdersManagement({ hideTenantSearch = false, isSystemManagement = false }: { hideTenantSearch?: boolean; isSystemManagement?: boolean } = {}) {',
    'export default function OrdersManagement({ hideTenantSearch = false, isSystemManagement = false, presetTenantId, presetTenantName }: { hideTenantSearch?: boolean; isSystemManagement?: boolean; presetTenantId?: string; presetTenantName?: string; } = {}) {'
)

# Replace the showAddModal setup to properly handle the preset tenant
# We will use useEffect if showAddModal becomes true

new_use_state = '''
  const [selectedTenant, setSelectedTenant] = useState<string | null>(presetTenantId || null);
'''

# Find the location to insert this. There's already selectedTenant state later probably? Let's check where selectedTenant is declared.
