import re

with open('src/pages/OrdersManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Order interface
old_interface = """interface Order {
  id: number;
  createTime: string;
  orderNo: string;
  tenantName: string;
  packageName: string;
  operator: string;
  project: string;
  customer: string;
  salesperson: string;
  price: number;
  crmOrderNo: string;
  remarks: string;
  coursePackage?: string;
  packageDetails: PackageDetails;
  status: '生效中' | '到期' | '已作废';
}"""
new_interface = """interface OrderPackage {
  packageName: string;
  packageDetails: PackageDetails;
}

interface Order {
  id: number;
  createTime: string;
  orderNo: string;
  tenantName: string;
  packageName: string;
  operator: string;
  project: string;
  customer: string;
  salesperson: string;
  price: number;
  crmOrderNo: string;
  remarks: string;
  coursePackage?: string;
  packageDetails: PackageDetails;
  packages?: OrderPackage[];
  status: '生效中' | '到期' | '已作废';
}"""
content = content.replace(old_interface, new_interface)

# 2. Add state for selectedPackageIndex
state_search = "const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);"
state_replace = "const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);\n  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);"
content = content.replace(state_search, state_replace)

# Reset selectedPackageIndex when setting selected order
reset_search = "setSelectedOrder(order); setDetailTab('package');"
reset_replace = "setSelectedOrder(order); setSelectedPackageIndex(0); setDetailTab('package');"
content = content.replace(reset_search, reset_replace)

# 3. Add multiple packages to mock data
old_mock_order = """      packageDetails: {
        packageType: 'UUSIMA',
        duration: 3000,
        usedDuration: 1200,
        tokenCount: 5000000,
        usedTokenCount: 2500000,
        accountCount: 50,
        usedAccountCount: 20,
        pptCount: 100,
        usedPptCount: 30,
        serviceLife: 1,
        startTime: '2026-04-20 00:00:00',
        endTime: '2027-04-20 00:00:00'
      }
    }"""
new_mock_order = """      packageDetails: {
        packageType: 'UUSIMA',
        duration: 3000,
        usedDuration: 1200,
        tokenCount: 5000000,
        usedTokenCount: 2500000,
        accountCount: 50,
        usedAccountCount: 20,
        pptCount: 100,
        usedPptCount: 30,
        serviceLife: 1,
        startTime: '2026-04-20 00:00:00',
        endTime: '2027-04-20 00:00:00'
      },
      packages: [
        {
          packageName: '智联网综合实践平台服务增配包-TJ',
          packageDetails: {
            packageType: 'UUSIMA',
            duration: 3000,
            usedDuration: 1200,
            tokenCount: 5000000,
            usedTokenCount: 2500000,
            accountCount: 50,
            usedAccountCount: 20,
            pptCount: 100,
            usedPptCount: 30,
            serviceLife: 1,
            startTime: '2026-04-20 00:00:00',
            endTime: '2027-04-20 00:00:00'
          }
        },
        {
          packageName: 'AI视觉分析增配包',
          packageDetails: {
            packageType: 'UUSIMA',
            duration: 2000,
            usedDuration: 500,
            tokenCount: 2000000,
            usedTokenCount: 1000000,
            accountCount: 30,
            usedAccountCount: 10,
            pptCount: 50,
            usedPptCount: 10,
            serviceLife: 1,
            startTime: '2026-04-20 00:00:00',
            endTime: '2027-04-20 00:00:00'
          }
        }
      ]
    }"""
content = content.replace(old_mock_order, new_mock_order)

# 4. Display multiple package names in table
table_search = "{order.packageName}"
table_replace = "{order.packages ? order.packages.map(p => p.packageName).join(', ') : order.packageName}"
content = content.replace(table_search, table_replace)

# 5. Update detail modal 
# We need to render the order information at the top of the detail modal,
# and handle the tabs for multiple packages.

old_modal = """              <div className="flex px-6 border-b border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setDetailTab('package')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${detailTab === 'package' ? 'border-[#108ee9] text-[#108ee9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  套餐使用情况
                </button>
                {selectedOrder.coursePackage && (
                  <button 
                    onClick={() => setDetailTab('course')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${detailTab === 'course' ? 'border-[#108ee9] text-[#108ee9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    课程包明细 ({selectedOrder.coursePackage})
                  </button>
                )}
              </div>
              <div className="p-6 max-h-[85vh] overflow-y-auto">
                {detailTab === 'package' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-[#108ee9]" /> 
                        套餐基本信息
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">套餐名称</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageName}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">套餐类型</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageDetails.packageType}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">生效时间</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageDetails.startTime}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">失效时间</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageDetails.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-slate-800 mb-4 flex flex-wrap items-center">
                        <div className="flex items-center mr-4">
                          <Activity className="w-4 h-4 mr-2 text-[#108ee9]" />
                          资源使用情况
                        </div>
                        <span className="text-xs font-normal text-slate-500 mt-2 sm:mt-0 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          套餐信息简述（实验时长：{selectedOrder.packageDetails.duration.toLocaleString()}分钟/年  token数量：{selectedOrder.packageDetails.tokenCount >= 100000000 ? `${selectedOrder.packageDetails.tokenCount / 100000000}亿` : selectedOrder.packageDetails.tokenCount.toLocaleString()}个/每年  账号数量：{selectedOrder.packageDetails.accountCount}个  PPT次数：{selectedOrder.packageDetails.pptCount}次  有效期：{selectedOrder.packageDetails.serviceLife * 12}个月）
                        </span>
                      </h4>
                      <div className="space-y-0 border border-slate-100 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">实验时长 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{selectedOrder.packageDetails.usedDuration.toLocaleString()}</span> / {selectedOrder.packageDetails.duration.toLocaleString()} 分钟
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">Token 数量 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{selectedOrder.packageDetails.usedTokenCount.toLocaleString()}</span> / {selectedOrder.packageDetails.tokenCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">账号数量 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{selectedOrder.packageDetails.usedAccountCount.toLocaleString()}</span> / {selectedOrder.packageDetails.accountCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">PPT 次数 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{selectedOrder.packageDetails.usedPptCount.toLocaleString()}</span> / {selectedOrder.packageDetails.pptCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">使用年限</span>
                          <span className="text-slate-800 text-sm font-medium">{selectedOrder.packageDetails.serviceLife} 年</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-slate-100">
                          <span className="text-slate-500 text-sm">关联产品</span>
                          <span className="text-slate-800 text-sm font-medium">{packages.find(p => p.name === selectedOrder.packageName)?.product || '全系产品'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}"""

new_modal = """              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col space-y-4">
                {/* Order Information Section */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[#108ee9]" />
                    订单信息
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><span className="text-slate-500">订单编号：</span><span className="font-medium text-slate-800">{selectedOrder.orderNo}</span></div>
                    <div><span className="text-slate-500">创建时间：</span><span className="font-medium text-slate-800">{selectedOrder.createTime}</span></div>
                    <div><span className="text-slate-500">CRM订单号：</span><span className="font-medium text-slate-800">{selectedOrder.crmOrderNo}</span></div>
                    <div><span className="text-slate-500">项目名称：</span><span className="font-medium text-slate-800">{selectedOrder.project}</span></div>
                    <div><span className="text-slate-500">客户名称：</span><span className="font-medium text-slate-800">{selectedOrder.customer}</span></div>
                    <div><span className="text-slate-500">销售人员：</span><span className="font-medium text-slate-800">{selectedOrder.salesperson}</span></div>
                    <div><span className="text-slate-500">订单价格：</span><span className="font-medium text-red-600">￥{selectedOrder.price.toLocaleString()}</span></div>
                    <div className="col-span-2"><span className="text-slate-500">备注：</span><span className="font-medium text-slate-800">{selectedOrder.remarks || '-'}</span></div>
                  </div>
                </div>
                
                <div className="flex border-b border-slate-200 mt-2">
                  <button 
                    onClick={() => setDetailTab('package')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${detailTab === 'package' ? 'border-[#108ee9] text-[#108ee9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    套餐使用情况
                  </button>
                  {selectedOrder.coursePackage && (
                    <button 
                      onClick={() => setDetailTab('course')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${detailTab === 'course' ? 'border-[#108ee9] text-[#108ee9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      课程包明细 ({selectedOrder.coursePackage})
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 max-h-[75vh] overflow-y-auto">
                {detailTab === 'package' && (() => {
                  const displayPackages = selectedOrder.packages || [{ packageName: selectedOrder.packageName, packageDetails: selectedOrder.packageDetails }];
                  const currentPackage = displayPackages[selectedPackageIndex];
                  
                  return (
                  <div className="space-y-6">
                    {displayPackages.length > 1 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {displayPackages.map((pkg, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPackageIndex(idx)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                              selectedPackageIndex === idx 
                                ? 'bg-[#108ee9] text-white border-[#108ee9]' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#108ee9] hover:text-[#108ee9]'
                            }`}
                          >
                            {pkg.packageName}
                          </button>
                        ))}
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-[#108ee9]" /> 
                        套餐基本信息
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">套餐名称</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageName}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">套餐类型</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.packageType}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">生效时间</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.startTime}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-xs block mb-1">失效时间</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-slate-800 mb-4 flex flex-wrap items-center">
                        <div className="flex items-center mr-4">
                          <Activity className="w-4 h-4 mr-2 text-[#108ee9]" />
                          资源使用情况
                        </div>
                        <span className="text-xs font-normal text-slate-500 mt-2 sm:mt-0 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 leading-relaxed max-w-full">
                          套餐信息简述（实验时长：{currentPackage.packageDetails.duration.toLocaleString()}分钟/年  token数量：{currentPackage.packageDetails.tokenCount >= 100000000 ? `${currentPackage.packageDetails.tokenCount / 100000000}亿` : currentPackage.packageDetails.tokenCount.toLocaleString()}个/每年  账号数量：{currentPackage.packageDetails.accountCount}个  PPT次数：{currentPackage.packageDetails.pptCount}次  有效期：{currentPackage.packageDetails.serviceLife * 12}个月）
                        </span>
                      </h4>
                      <div className="space-y-0 border border-slate-100 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">实验时长 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{currentPackage.packageDetails.usedDuration.toLocaleString()}</span> / {currentPackage.packageDetails.duration.toLocaleString()} 分钟
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">Token 数量 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{currentPackage.packageDetails.usedTokenCount.toLocaleString()}</span> / {currentPackage.packageDetails.tokenCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">账号数量 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{currentPackage.packageDetails.usedAccountCount.toLocaleString()}</span> / {currentPackage.packageDetails.accountCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">PPT 次数 (已用/总计)</span>
                          <span className="text-slate-800 text-sm font-medium">
                            <span className="text-[#108ee9]">{currentPackage.packageDetails.usedPptCount.toLocaleString()}</span> / {currentPackage.packageDetails.pptCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">使用年限</span>
                          <span className="text-slate-800 text-sm font-medium">{currentPackage.packageDetails.serviceLife} 年</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-slate-100">
                          <span className="text-slate-500 text-sm">关联产品</span>
                          <span className="text-slate-800 text-sm font-medium">{packages.find(p => p.name === currentPackage.packageName)?.product || '全系产品'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}"""

content = content.replace(old_modal, new_modal)

# Make sure FileText is imported
if "FileText" not in content[:500]:
    content = content.replace("Activity,", "Activity, FileText,")

with open('src/pages/OrdersManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
