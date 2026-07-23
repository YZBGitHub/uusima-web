import React, { useState } from 'react';
import { Shield, Key, Download, Edit, Plus, Trash2, Activity, FileText, Upload, CheckCircle2, ChevronRight, AlertCircle, FileUp, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TenantAuthManagementProps {
  tenant: any;
}

export default function TenantAuthManagement({ tenant }: TenantAuthManagementProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'credentials'>('info');

  // Auth Info State
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateStep, setGenerateStep] = useState(1);
  
  const [authData, setAuthData] = useState({
    envFile: null as File | null,
    product: '',
    salesperson: '',
    deployer: '',
    expireTime: ''
  });

  const [generatedInfo, setGeneratedInfo] = useState({
    authTime: '',
    expireTime: '',
    salesperson: '',
    deployer: '',
  });

  // Credentials State
  const [credentials, setCredentials] = useState([
    { id: '1', name: 'API Key - 生产环境', createTime: '2023-11-15 10:23:00', updateTime: '2024-01-20 14:12:30' },
    { id: '2', name: 'OAuth Client - 测试', createTime: '2024-03-10 09:15:22', updateTime: '2024-03-10 09:15:22' },
  ]);
  const [isAddCredModalOpen, setIsAddCredModalOpen] = useState(false);
  const [newCredName, setNewCredName] = useState('');

  // Pagination for Credentials
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(credentials.length / itemsPerPage);

  const startGeneration = () => {
    setIsGenerating(true);
    setGenerateStep(1);
  };

  const handleNextStep = () => {
    if (generateStep < 4) {
      setGenerateStep(generateStep + 1);
    } else {
      // Finish generation
      const today = new Date();
      const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      setGeneratedInfo({
        authTime: dateString,
        expireTime: authData.expireTime || '2025-12-31',
        salesperson: authData.salesperson || '张三',
        deployer: authData.deployer || '李四',
      });
      setIsGenerated(true);
      setIsGenerating(false);
    }
  };

  const handleAddCredential = () => {
    if (!newCredName) return;
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`;
    
    setCredentials([
      {
        id: Math.random().toString(),
        name: newCredName,
        createTime: dateString,
        updateTime: dateString
      },
      ...credentials
    ]);
    setNewCredName('');
    setIsAddCredModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 pt-4 shrink-0">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'info' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>授权信息</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('credentials')}
          className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'credentials' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>授权凭证</span>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'info' && (
          <div className="h-full">
            {!isGenerating ? (
              !isGenerated ? (
                // Un-generated State
                <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center h-full shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">暂无授权信息</h3>
                  <p className="text-slate-500 mb-8 max-w-md">
                    该租户尚未生成授权信息，您需要收集环境特征文件、关联相关产品并填写授权明细来完成授权配置。
                  </p>
                  <button 
                    onClick={startGeneration}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>生成授权信息</span>
                  </button>
                </div>
              ) : (
                // Generated State
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800">授权已生效</h3>
                        <p className="text-sm text-slate-500 mt-1">系统已成功生成并记录此租户的授权信息</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={startGeneration}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>编辑信息</span>
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>下载授权文件</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <div className="text-sm text-slate-500">授权时间</div>
                      <div className="text-base font-medium text-slate-800">{generatedInfo.authTime}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-slate-500">过期时间</div>
                      <div className="text-base font-medium text-slate-800">{generatedInfo.expireTime}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-slate-500">销售人员</div>
                      <div className="text-base font-medium text-slate-800">{generatedInfo.salesperson}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-slate-500">部署人员</div>
                      <div className="text-base font-medium text-slate-800">{generatedInfo.deployer}</div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // Generation Wizard
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full max-w-5xl mx-auto">
                {/* Stepper Header */}
                <div className="px-8 py-6 border-b border-slate-200 shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">生成授权信息</h3>
                    <button onClick={() => setIsGenerating(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                    <div className="relative z-10 flex justify-between">
                      {[
                        { num: 1, label: '上传特征文件' },
                        { num: 2, label: '关联产品' },
                        { num: 3, label: '填写表单信息' },
                        { num: 4, label: '确认并生成' }
                      ].map(step => (
                        <div key={step.num} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium mb-2 transition-colors ${
                            generateStep > step.num 
                              ? 'bg-blue-600 text-white ring-4 ring-white' 
                              : generateStep === step.num
                                ? 'bg-blue-600 text-white ring-4 ring-blue-50'
                                : 'bg-slate-200 text-slate-500 ring-4 ring-white'
                          }`}>
                            {generateStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                          </div>
                          <span className={`text-sm ${generateStep >= step.num ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                  {generateStep === 1 && (
                    <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-12">
                      <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <FileUp className="w-12 h-12 text-slate-400 mb-4" />
                        <h4 className="text-lg font-medium text-slate-700 mb-2">点击或拖拽上传环境特征文件</h4>
                        <p className="text-sm text-slate-500 text-center">支持 .txt, .json, .dat 格式文件<br/>单个文件不超过 10MB</p>
                      </div>
                      <div className="w-full mt-6 flex items-start space-x-3 p-4 bg-blue-50 text-blue-800 rounded-lg">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium mb-1">什么是环境特征文件？</p>
                          <p className="opacity-90">环境特征文件是从客户部署环境中提取的硬件指纹信息，用于绑定授权，防止授权被拷贝或滥用。</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {generateStep === 2 && (
                    <div className="max-w-2xl mx-auto py-8">
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">选择要授权的产品</label>
                        <div className="grid grid-cols-2 gap-4">
                          {['教学资源库系统', 'AIGC大模型平台', '实训室管理系统', '校园资产管理系统'].map(prod => (
                            <div 
                              key={prod}
                              onClick={() => setAuthData({...authData, product: prod})}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                                authData.product === prod 
                                  ? 'border-blue-600 bg-blue-50/50' 
                                  : 'border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-800">{prod}</span>
                                {authData.product === prod && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {generateStep === 3 && (
                    <div className="max-w-xl mx-auto py-8 space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">销售人员 <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="请输入负责销售人员姓名"
                          value={authData.salesperson}
                          onChange={e => setAuthData({...authData, salesperson: e.target.value})}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">部署人员 <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="请输入实施部署人员姓名"
                          value={authData.deployer}
                          onChange={e => setAuthData({...authData, deployer: e.target.value})}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">过期时间 <span className="text-red-500">*</span></label>
                        <input 
                          type="date" 
                          value={authData.expireTime}
                          onChange={e => setAuthData({...authData, expireTime: e.target.value})}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {generateStep === 4 && (
                    <div className="max-w-2xl mx-auto py-8">
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h4 className="text-base font-semibold text-slate-800 mb-6">授权信息确认</h4>
                        
                        <div className="space-y-4">
                          <div className="flex pb-4 border-b border-slate-200">
                            <span className="w-32 text-sm text-slate-500">环境特征文件：</span>
                            <span className="text-sm font-medium text-slate-800 flex items-center">
                              <FileText className="w-4 h-4 mr-2 text-slate-400" />
                              env_fingerprint_2024.dat
                            </span>
                          </div>
                          <div className="flex pb-4 border-b border-slate-200">
                            <span className="w-32 text-sm text-slate-500">关联产品：</span>
                            <span className="text-sm font-medium text-slate-800">{authData.product || '教学资源库系统'}</span>
                          </div>
                          <div className="flex pb-4 border-b border-slate-200">
                            <span className="w-32 text-sm text-slate-500">销售人员：</span>
                            <span className="text-sm font-medium text-slate-800">{authData.salesperson || '张三'}</span>
                          </div>
                          <div className="flex pb-4 border-b border-slate-200">
                            <span className="w-32 text-sm text-slate-500">部署人员：</span>
                            <span className="text-sm font-medium text-slate-800">{authData.deployer || '李四'}</span>
                          </div>
                          <div className="flex">
                            <span className="w-32 text-sm text-slate-500">过期时间：</span>
                            <span className="text-sm font-medium text-slate-800">{authData.expireTime || '2025-12-31'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stepper Footer */}
                <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between rounded-b-xl">
                  <button 
                    onClick={() => generateStep > 1 ? setGenerateStep(generateStep - 1) : setIsGenerating(false)}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                  >
                    {generateStep === 1 ? '取消' : '上一步'}
                  </button>
                  <button 
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                  >
                    {generateStep === 4 ? '确认并生成' : '下一步'}
                    {generateStep !== 4 && <ChevronRight className="w-4 h-4 ml-1" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'credentials' && (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">授权凭证管理</h3>
              <button 
                onClick={() => setIsAddCredModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>添加凭证</span>
              </button>
            </div>

            <div className="bg-white border text-card-foreground shadow-sm rounded-xl flex-1 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-medium text-slate-500">凭证名称</th>
                      <th className="px-6 py-4 font-medium text-slate-500">生成时间</th>
                      <th className="px-6 py-4 font-medium text-slate-500">更新时间</th>
                      <th className="px-6 py-4 font-medium text-slate-500 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {credentials.length > 0 ? (
                      credentials.map((cred) => (
                        <tr key={cred.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Key className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-800">{cred.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{cred.createTime}</td>
                          <td className="px-6 py-4 text-slate-600">{cred.updateTime}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-4">
                              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors flex items-center space-x-1">
                                <Edit className="w-3.5 h-3.5" />
                                <span>编辑</span>
                              </button>
                              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors flex items-center space-x-1">
                                <Shield className="w-3.5 h-3.5" />
                                <span>授权</span>
                              </button>
                              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors flex items-center space-x-1">
                                <Settings className="w-3.5 h-3.5" />
                                <span>限流</span>
                              </button>
                              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors flex items-center space-x-1">
                                <FileText className="w-3.5 h-3.5" />
                                <span>日志</span>
                              </button>
                              <button className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors flex items-center space-x-1">
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>删除</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          暂无授权凭证
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {credentials.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between mt-auto">
                  <div className="text-sm text-slate-500">
                    共 {credentials.length} 条记录，第 {currentPage} / {Math.max(1, totalPages)} 页
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Credential Modal */}
      <AnimatePresence>
        {isAddCredModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setIsAddCredModalOpen(false)}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">添加授权凭证</h3>
                <button onClick={() => setIsAddCredModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">凭证名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newCredName}
                    onChange={e => setNewCredName(e.target.value)}
                    placeholder="请输入凭证名称，如：正式环境 API Key"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button 
                  onClick={() => setIsAddCredModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm hover:bg-white transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddCredential}
                  disabled={!newCredName}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
