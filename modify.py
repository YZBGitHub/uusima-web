import re

with open('src/pages/OrdersManagement.tsx', 'r') as f:
    content = f.read()

# Replace lucide-react import to include Search, ChevronLeft, ChevronRight
content = re.sub(r"import { X } from 'lucide-react';", "import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';", content)

# Modify OrdersManagement component body
body_pattern = r"export default function OrdersManagement\(\) \{.*?const \[selectedOrder, setSelectedOrder\] = useState<Order \| null>\(null\);"
new_body = """export default function OrdersManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;"""
content = re.sub(body_pattern, new_body, content, flags=re.DOTALL)


# Modify render part
render_pattern = r"(<div className=\"mb-4 text-slate-800 flex justify-between items-end\">\s*<h2 className=\"text-xl font-bold\">订购订单</h2>\s*</div>)\s*<div className=\"bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden mb-8\">\s*<div className=\"p-0 overflow-x-auto\">\s*<table className=\"w-full text-left text-sm whitespace-nowrap min-w-\[max-content\]\">"

new_render = """\\1
      <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden mb-8">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">创建时间：</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[max-content]">"""

content = re.sub(render_pattern, new_render, content)

# Map logic modification
map_pattern = r"\{orders\.map\(\(order, i\) => \("
# we need to inject the filtered array and pagination logic before the return
return_pattern = r"(return \(\s*<div className=\"flex-1 flex flex-col h-full bg-\[\#f0f2f5\] p-6 overflow-y-auto\">)"
new_logic = """  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createTime).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      const realEnd = endDate ? end + 24 * 60 * 60 * 1000 - 1 : Infinity;
      return orderDate >= start && orderDate <= realEnd;
    });
  }, [startDate, endDate]); // orders is static here, if it were dynamic we'd include it

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  \\1"""

content = re.sub(return_pattern, new_logic, content)

# Replace orders.map and orders.length inside render
content = content.replace("orders.map((order, i) =>", "currentOrders.map((order, i) =>")
content = content.replace("{orders.length === 0 && (", "{currentOrders.length === 0 && (")
content = content.replace("{(i + 1)}", "{(currentPage - 1) * itemsPerPage + i + 1}")
content = content.replace("{i + 1}", "{(currentPage - 1) * itemsPerPage + i + 1}")


# Add pagination component
pagination_component = """          </table>
        </div>
        
        {totalPages > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-sm text-slate-500">
              共 {filteredOrders.length} 条记录，第 {currentPage} / {totalPages} 页
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  // Simple pagination display logic
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded text-sm font-medium flex items-center justify-center transition-colors ${
                          currentPage === page
                            ? 'bg-[#108ee9] text-white border border-[#108ee9]'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="text-slate-400">...</span>;
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>"""

content = content.replace("          </table>\n        </div>\n      </div>", pagination_component)

with open('src/pages/OrdersManagement.tsx', 'w') as f:
    f.write(content)
