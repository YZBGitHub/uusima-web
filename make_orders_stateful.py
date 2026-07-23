import re

with open('src/pages/OrdersManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace const orders = [...] with const [orders, setOrders] = useState<Order[]>([...])
content = content.replace("  const orders: Order[] = [", "  const [orders, setOrders] = useState<Order[]>([")
content = content.replace("    }\n  ];\n\n  const filteredOrders = ", "    }\n  ]);\n\n  const filteredOrders = ")

# Update the "确认作废" button to actually update the state
update_orders_code = """              <button onClick={() => {
                const newOrders = orders.map(o => {
                  if (selectedOrders.has(o.id)) {
                    return { ...o, status: '已作废' as const };
                  }
                  return o;
                });
                setOrders(newOrders);
                setShowVoidConfirm(false);
                setSelectedOrders(new Set());
              }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium">确认作废</button>"""

content = re.sub(
    r"""              <button onClick=\{\(\) => \{\n                // Here you would normally update the actual data. For demo:\n                setShowVoidConfirm\(false\);\n                setSelectedOrders\(new Set\(\)\);\n              \}\} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium">确认作废</button>""",
    update_orders_code,
    content
)

with open('src/pages/OrdersManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

