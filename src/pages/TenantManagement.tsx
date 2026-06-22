import React, { useState } from 'react';
import { Search, ChevronDown, Edit, Trash2, Users, Network, X, Upload, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TenantManagement() {
  const [tenantType, setTenantType] = useState('请选择租户类型');
  const [city, setCity] = useState('请选择所在城市');
  const [keyword, setKeyword] = useState('新大陆');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<'school' | 'enterprise'>('school');
  const [addTenantModalOpen, setAddTenantModalOpen] = useState(false);
  const [addTenantType, setAddTenantType] = useState<'school' | 'enterprise'>('school');
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);

  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [missingOrgModalOpen, setMissingOrgModalOpen] = useState(false);
  const [missingOrgName, setMissingOrgName] = useState('');

  const SCHOOL_LIST = [
    '江西先锋软件职业技术学院',
    '许昌陶瓷职业学院',
    '南华大学船山学院',
    '重庆工业职业技术学院',
    '西藏民族学院',
    '湛江现代科技职业学院',
    '江西枫林涉外经贸职业学院',
    '河北轨道运输职业技术学院',
    '南京艺术学院',
    '江西工程职业学院',
    '郑州理工职业学院',
    '湖南商学院北津学院'
  ];

  const filteredSchools = SCHOOL_LIST.filter(s => s.includes(schoolSearchQuery));

  const tenants = [
    { id: '2046388348272463873', name: '新大陆-客户教师体验试用', type: '学校', updateTime: '2026-04-21 08:39:37' },
    { id: '10051', name: '新大陆技术中心', type: '学校', updateTime: '2026-01-20 14:47:57' },
    { id: '2005513775779540994', name: '新大陆-产业生态', type: '学校', updateTime: '2025-12-29 13:38:39' },
    { id: '1998269074857885697', name: '新大陆时代科技-产品演示', type: '学校', updateTime: '2025-12-09 13:50:48' },
    { id: '1972114744344338433', name: '新大陆教育-国培', type: '学校', updateTime: '2025-09-28 09:42:50' },
    { id: '1964953689532948482', name: '新大陆竞赛', type: '学校', updateTime: '2025-09-08 15:27:21' },
    { id: '1934437003180257281', name: '新大陆时代科技-在线直播', type: '学校', updateTime: '2025-06-16 10:24:56' },
    { id: '1933061040865423362', name: '新大陆-客户体验试用', type: '学校', updateTime: '2025-06-12 15:17:21' },
    { id: '1932380092240179202', name: '新大陆时代科技', type: '学校', updateTime: '2025-06-10 18:11:31' },
    { id: '1926829615198388225', name: '新大陆专用-物联网工程技术人员考试', type: '学校', updateTime: '2025-05-26 10:35:54' },
    { id: '1925473506038530050', name: '新大陆-大数据专业', type: '学校', updateTime: '2025-05-22 16:47:12' },
    { id: '1775351216859275265', name: '新大陆行业云', type: '学校', updateTime: '2024-04-03 10:34:49' }
  ];

  return (
    <div className="min-h-full bg-white flex flex-col p-6 font-sans">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-1 h-4 bg-blue-600 rounded-sm"></div>
        <h1 className="text-base font-bold text-slate-800">租户管理</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setEditingTenantId(null);
              setAddTenantModalOpen(true);
            }}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors shadow-sm"
          >
            添加租户
          </button>
          <button 
            onClick={() => setImportModalOpen(true)}
            className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-sm"
          >
            批量导入
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-slate-500 bg-white min-w-[140px]">
              <option>请选择租户类型</option>
              <option>学校</option>
              <option>企业</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-slate-500 bg-white min-w-[140px]">
              <option>请选择所在城市</option>
              <option>北京</option>
              <option>上海</option>
              <option>广州</option>
              <option>深圳</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 min-w-[160px] text-slate-700" 
          />

          <button className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors shadow-sm">
            查询
          </button>
          
          <button className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            重置
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-600 bg-slate-50 sticky top-0 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-center w-[20%]">ID</th>
              <th className="px-6 py-4 font-semibold text-center w-[20%]">租户名称</th>
              <th className="px-6 py-4 font-semibold text-center w-[15%]">租户类型</th>
              <th className="px-6 py-4 font-semibold text-center w-[20%]">更新时间</th>
              <th className="px-6 py-4 font-semibold text-center w-[25%]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((tenant, index) => (
              <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 text-slate-500 text-center">{tenant.id}</td>
                <td className="px-6 py-4 text-slate-600 text-center">{tenant.name}</td>
                <td className="px-6 py-4 text-slate-600 text-center">{tenant.type}</td>
                <td className="px-6 py-4 text-slate-500 text-center">{tenant.updateTime}</td>
                <td className="px-6 py-4 flex items-center justify-center space-x-4">
                  <button className="flex items-center text-blue-500 hover:text-blue-700 font-medium">
                    <Network className="w-4 h-4 mr-1" />
                    组织管理
                  </button>
                  <button className="flex items-center text-blue-500 hover:text-blue-700 font-medium">
                    <Users className="w-4 h-4 mr-1" />
                    成员管理
                  </button>
                  <button 
                    onClick={() => {
                      setAddTenantType(tenant.type === '学校' ? 'school' : 'enterprise');
                      setEditingTenantId(tenant.id);
                      setAddTenantModalOpen(true);
                    }}
                    className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </button>
                  <button className="flex items-center text-red-500 hover:text-red-700 font-medium">
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end space-x-4 mt-4 text-sm text-slate-600">
        <span>共 25 条</span>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-600">
            <option>20条/页</option>
            <option>50条/页</option>
            <option>100条/页</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-400 cursor-not-allowed">
            <ChevronDown className="w-4 h-4 rotate-90" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium transition-colors border border-slate-200">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span>前往</span>
          <input type="text" defaultValue="1" className="w-12 h-8 text-center border border-slate-300 rounded focus:outline-none focus:border-blue-500" />
          <span>页</span>
        </div>
      </div>

      {/* 添加租户 Modal */}
      <AnimatePresence>
        {addTenantModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddTenantModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-[800px] flex flex-col overflow-hidden pointer-events-auto max-h-[90vh]"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                  <h2 className="text-lg font-semibold text-slate-900">{editingTenantId ? '编辑租户信息' : '添加租户信息'}</h2>
                  <button 
                    onClick={() => setAddTenantModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                  {/* 类型选择 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">类型选择</label>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name="addTenantType"
                          value="school"
                          checked={addTenantType === 'school'}
                          onChange={() => setAddTenantType('school')}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 rounded-full cursor-pointer" 
                        />
                        <span className="ml-2 text-sm text-slate-700 group-hover:text-blue-600 transition-colors">院校</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name="addTenantType"
                          value="enterprise"
                          checked={addTenantType === 'enterprise'}
                          onChange={() => setAddTenantType('enterprise')}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 rounded-full cursor-pointer" 
                        />
                        <span className="ml-2 text-sm text-slate-700 group-hover:text-blue-600 transition-colors">企业</span>
                      </label>
                    </div>
                  </div>

                  {/* 表单字段区 */}
                  <div className="grid grid-cols-2 gap-6">
                     {addTenantType === 'school' && (
                       <>
                         <div className="relative z-10">
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>学校全称</label>
                           <div className="relative mt-1">
                             <input 
                               type="text" 
                               value={schoolSearchQuery}
                               onChange={(e) => {
                                 setSchoolSearchQuery(e.target.value);
                                 setSchoolDropdownOpen(true);
                               }}
                               onFocus={() => setSchoolDropdownOpen(true)}
                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" 
                               placeholder="需与办学许可证一致" 
                             />
                             {schoolDropdownOpen && (
                               <>
                                 <div className="fixed inset-0 z-40" onClick={() => setSchoolDropdownOpen(false)} />
                                 <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden flex flex-col max-h-64 z-50">
                                   <div className="overflow-y-auto w-full">
                                     {filteredSchools.length > 0 ? (
                                       filteredSchools.map((school, idx) => (
                                         <button 
                                           key={idx}
                                           onClick={(e) => {
                                             e.preventDefault();
                                             setSchoolSearchQuery(school);
                                             setSchoolDropdownOpen(false);
                                           }}
                                           className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-slate-50 last:border-0"
                                         >
                                           {school}
                                         </button>
                                       ))
                                     ) : (
                                       <div className="p-4 text-center">
                                         <p className="text-sm text-slate-500 mb-3">暂无匹配选项</p>
                                         <button 
                                           onClick={(e) => {
                                             e.preventDefault();
                                             setSchoolDropdownOpen(false);
                                             setMissingOrgModalOpen(true);
                                           }}
                                           className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border-blue-200 border w-full"
                                         >
                                           找不到？点击添加机构
                                         </button>
                                       </div>
                                     )}
                                   </div>
                                 </div>
                               </>
                             )}
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>学校简称</label>
                           <input type="text" maxLength={20} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="20个字符以内" />
                         </div>
                         <div className="col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>统一社会信用代码</label>
                           <input type="text" maxLength={18} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="18位信用代码或办学许可证号" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>办学层次</label>
                           <div className="relative">
                             <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white">
                               <option>普通本科</option><option>职业本科</option><option>高职（专科）</option><option>中专</option><option>技工院校</option><option>其他</option>
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>院校性质</label>
                           <div className="relative">
                             <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white">
                               <option>公办</option><option>民办</option><option>独立学院</option><option>中外合作办学</option>
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                         </div>
                         <div className="col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>成立时间</label>
                           <input type="date" max={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" />
                         </div>
                         <div className="col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>院校地址</label>
                           <div className="flex space-x-2">
                             <div className="relative w-1/3">
                               <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-600">
                                 <option>福建省</option><option>北京市</option>
                               </select>
                               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                             </div>
                             <div className="relative w-1/3">
                               <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-600">
                                 <option>福州市</option><option>厦门市</option>
                               </select>
                               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                             </div>
                             <div className="relative w-1/3">
                               <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-600">
                                 <option>马尾区</option><option>鼓楼区</option>
                               </select>
                               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                             </div>
                           </div>
                           <input type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors mt-2" placeholder="填写详细地址" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>联系人姓名</label>
                           <input type="text" maxLength={20} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="20个字符以内" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5">邮箱</label>
                           <input type="email" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="标准邮箱格式" />
                         </div>
                       </>
                     )}
                     {addTenantType === 'enterprise' && (
                       <>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>企业全称</label>
                           <input type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="需与营业执照一致" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>简称</label>
                           <input type="text" maxLength={20} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="20个字符以内" />
                         </div>
                         <div className="col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>统一社会信用代码</label>
                           <input type="text" maxLength={18} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="18位信用代码" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>企业性质</label>
                           <div className="relative">
                             <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white">
                               <option>国有</option><option>民营</option><option>股份制</option><option>外资</option><option>合伙</option><option>事业单位</option><option>行政机关</option><option>社会团体</option>
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>所属行业</label>
                           <div className="relative">
                             <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white">
                               <option>企业服务</option><option>医疗健康</option><option>互联网</option><option>金融</option><option>教育</option><option>其他</option>
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5">注册资金</label>
                           <div className="relative">
                             <input type="number" step="0.01" className="w-full pl-3 pr-10 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="请输入" />
                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">万元</span>
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>企业规模</label>
                           <div className="relative">
                             <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white">
                               <option>微型</option><option>小型</option><option>中型</option><option>大型</option>
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>员工人数</label>
                           <input type="number" min="1" step="1" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="输入正整数" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5">发展阶段</label>
                           <div className="relative">
                             <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white">
                               <option value="">请选择 (非必选)</option><option>未融资</option><option>天使轮</option><option>A~D轮</option><option>已上市</option><option>不需要融资</option>
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                         </div>
                         <div className="col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1.5">营业执照</label>
                           <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group">
                             <div className="space-y-2 text-center flex flex-col items-center">
                               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                 <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                               </div>
                               <div className="flex text-sm text-slate-600">
                                 <span className="relative font-medium text-blue-600 hover:text-blue-500">上传证明文件</span>
                               </div>
                               <p className="text-xs text-slate-500">支持 JPG/PNG/PDF，单文件上限10MB</p>
                             </div>
                           </div>
                         </div>
                         <div className="col-span-2">
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>企业地址</label>
                           <div className="flex space-x-2">
                             <div className="relative w-1/3">
                               <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-600">
                                 <option>福建省</option><option>北京市</option>
                               </select>
                               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                             </div>
                             <div className="relative w-1/3">
                               <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-600">
                                 <option>福州市</option><option>厦门市</option>
                               </select>
                               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                             </div>
                             <div className="relative w-1/3">
                               <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-white text-slate-600">
                                 <option>马尾区</option><option>鼓楼区</option>
                               </select>
                               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                             </div>
                           </div>
                           <input type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors mt-2" placeholder="填写详细地址" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>联系人</label>
                           <input type="text" maxLength={20} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="20个字符以内" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1.5">邮箱</label>
                           <input type="email" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="如果 abc@example.com" />
                         </div>
                       </>
                     )}
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
                  <button 
                    onClick={() => setAddTenantModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    确认提交
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 批量导入 Modal */}
      <AnimatePresence>
        {importModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setImportModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-[500px] flex flex-col overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">批量导入</h2>
                  <button 
                    onClick={() => setImportModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* 类型选择 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">类型选择</label>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name="importType"
                          value="school"
                          checked={importType === 'school'}
                          onChange={() => setImportType('school')}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 rounded-full cursor-pointer" 
                        />
                        <span className="ml-2 text-sm text-slate-700 group-hover:text-blue-600 transition-colors">院校</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name="importType"
                          value="enterprise"
                          checked={importType === 'enterprise'}
                          onChange={() => setImportType('enterprise')}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 rounded-full cursor-pointer" 
                        />
                        <span className="ml-2 text-sm text-slate-700 group-hover:text-blue-600 transition-colors">企业</span>
                      </label>
                    </div>
                  </div>

                  {/* 模板下载 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">模板下载</label>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                      <Download className="w-4 h-4 mr-1.5" />
                      {importType === 'school' ? '院校信息模板下载' : '企业导入模板下载'}
                    </button>
                  </div>

                  {/* Excel 上传 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Excel 文件</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group">
                      <div className="space-y-2 text-center flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div className="flex text-sm text-slate-600">
                          <span className="relative font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>点击上传</span>
                          </span>
                          <p className="pl-1">或拖拽文件到这里</p>
                        </div>
                        <p className="text-xs text-slate-500">
                          支持 .xlsx, .xls 格式
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button 
                    onClick={() => setImportModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    确认导入
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 填写机构名称 Modal */}
      <AnimatePresence>
        {missingOrgModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMissingOrgModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-[400px] flex flex-col overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">填写机构名称</h2>
                  <button 
                    onClick={() => setMissingOrgModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2"><span className="text-red-500 mr-1">*</span>机构全称</label>
                  <input 
                    type="text" 
                    value={missingOrgName}
                    onChange={(e) => setMissingOrgName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="请输入机构全称" 
                  />
                  <p className="mt-2 text-xs text-slate-500">提交后将触发后台收录审核</p>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button 
                    onClick={() => setMissingOrgModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      if (missingOrgName.trim()) {
                        setSchoolSearchQuery(missingOrgName);
                        setMissingOrgModalOpen(false);
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    提交审核
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
