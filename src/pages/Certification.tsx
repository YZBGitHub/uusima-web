import React, { useState } from 'react';
import { Briefcase, Building, Check, Search, ChevronRight, X, BadgeCheck, Clock, CheckCircle2, Save, Plus, UploadCloud, Image as ImageIcon } from 'lucide-react';

type IdentityStatus = 'approved' | 'pending' | 'rejected' | 'draft';

interface IdentityRecord {
  id: string;
  type: 'inst' | 'corp';
  roleName: string;
  orgName: string;
  deptName?: string;
  status: IdentityStatus;
  submitTime: string;
  rawData?: any;
  rejectReason?: string;
}

function ImageUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        onChange={handleChange}
        accept="image/*"
      />
      {file ? (
        <div className="flex flex-col items-center">
          <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
          <span className="text-sm text-slate-700 font-medium">{file.name}</span>
          <span className="text-xs text-slate-500">点击或拖拽重新上传</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-slate-500">
          <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
          <p className="text-sm font-medium mb-1"><span className="text-blue-600">点击上传</span> 或将文件拖拽到此处</p>
          <p className="text-xs">支持 JPG, PNG, PDF，最大 5MB</p>
        </div>
      )}
    </div>
  );
}

function OrgSearchInput({ 
  placeholder, 
  value, 
  onChange, 
  onMissingOrg,
  options
}: { 
  placeholder: string; 
  value: string; 
  onChange: (v: string) => void; 
  onMissingOrg: () => void; 
  options: string[];
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const filteredOptions = options.filter(s => s.includes(value));

  return (
    <div className="relative z-10">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-20 pointer-events-none" />
      <input 
        type="text" 
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setDropdownOpen(true);
        }}
        onFocus={() => setDropdownOpen(true)}
        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
        placeholder={placeholder}
      />
      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden flex flex-col max-h-64 z-50">
            <div className="overflow-y-auto w-full">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      onChange(opt);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-slate-50 last:border-0"
                  >
                    {opt}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-500 mb-3">暂无匹配选项</p>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen(false);
                      onMissingOrg();
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
  );
}

const MOCK_CORP_DEPTS: Record<string, string[]> = {
  '腾讯科技': ['CSIG (云与智慧产业事业群)', 'WXG (微信事业群)', 'IEG (互动娱乐事业群)', 'PCG (平台与内容事业群)'],
  '阿里巴巴': ['淘天集团', '阿里云智能集团', '阿里国际数字商业集团', '本地生活集团'],
  '字节跳动': ['抖音集团', '朝夕光年', '飞书', '火山引擎'],
  '百度': ['MEG (移动生态事业群)', 'ACG (智能云事业群)', 'IDG (智能驾驶事业群)'],
  '华为': ['终端BG', 'ICT基础设施业务', '华为云', '数字能源']
};


export default function Certification() {
  const mockIdentity: IdentityRecord = {
    id: 'mock-1',
    type: 'inst',
    roleName: '教师',
    orgName: '福建信息职业技术学院',
    deptName: '信息工程系',
    status: 'approved',
    submitTime: '2026-05-12'
  };

  const [identities, setIdentities] = useState<IdentityRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inst' | 'corp'>('inst');

  const toggleMockStatus = () => {
    if (identities.length === 0) {
      setIdentities([mockIdentity]);
    } else {
      setIdentities([]);
    }
  };
  
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [corpSearchQuery, setCorpSearchQuery] = useState('');
  const [missingOrgModalOpen, setMissingOrgModalOpen] = useState(false);
  const [missingOrgName, setMissingOrgName] = useState('');
  const [instRole, setInstRole] = useState('');
  const [instDept, setInstDept] = useState('');
  const [corpDept, setCorpDept] = useState('');

  // Additional fields
  const [instTitle, setInstTitle] = useState('');
  const [instResearchArea, setInstResearchArea] = useState('');
  const [instId, setInstId] = useState('');
  const [instMajor, setInstMajor] = useState('');
  const [instDegree, setInstDegree] = useState('');
  const [instGradYear, setInstGradYear] = useState('');
  const [instJobIntention, setInstJobIntention] = useState('');
  const [corpPosition, setCorpPosition] = useState('');

  const SCHOOL_LIST = [
    '江西先锋软件职业技术学院',
    '许昌陶瓷职业学院',
    '南华大学船山学院',
    '重庆工业职业技术学院',
    '西藏民族学院',
    '南京艺术学院',
    '江西工程职业学院',
    '郑州理工职业学院',
  ];

  const handleDraft = () => {
    const rawData = {
      schoolSearchQuery,
      corpSearchQuery,
      instRole,
      instDept,
      corpDept,
      instTitle,
      instResearchArea,
      instId,
      instMajor,
      instDegree,
      instGradYear,
      instJobIntention,
      corpPosition,
    };
    
    let newRecord: IdentityRecord;
    if (activeTab === 'inst') {
      newRecord = {
        id: editingDraftId || Date.now().toString(),
        type: 'inst',
        roleName: instRole === 'admin' ? '院校处室人员' : instRole === 'teacher' ? '教师' : (instRole === 'student' ? '学生' : '未选择身份'),
        orgName: schoolSearchQuery || '未填写院校',
        deptName: instDept,
        status: 'draft',
        submitTime: new Date().toISOString().split('T')[0],
        rawData,
      };
    } else {
      newRecord = {
        id: editingDraftId || Date.now().toString(),
        type: 'corp',
        roleName: '企业人员',
        orgName: corpSearchQuery || '未填写企业',
        deptName: corpDept || corpSearchQuery,
        status: 'draft',
        submitTime: new Date().toISOString().split('T')[0],
        rawData,
      };
    }

    if (editingDraftId) {
      setIdentities(identities.map(id => id.id === editingDraftId ? newRecord : id));
    } else {
      setIdentities([...identities, newRecord]);
    }
    
    closeModal();
  };

  const handleSave = () => {
    let newRecord: IdentityRecord;
    if (activeTab === 'inst') {
      if (!schoolSearchQuery || !instRole) {
        alert('请填写完整信息');
        return;
      }
      newRecord = {
        id: editingDraftId || Date.now().toString(),
        type: 'inst',
        roleName: instRole === 'admin' ? '院校处室人员' : instRole === 'teacher' ? '教师' : '学生',
        orgName: schoolSearchQuery,
        deptName: instDept,
        status: 'pending',
        submitTime: new Date().toISOString().split('T')[0],
        rawData: null, // clear raw data on submit
      };
    } else {
      if (!corpSearchQuery) {
        alert('请填写完整信息');
        return;
      }
      newRecord = {
        id: editingDraftId || Date.now().toString(),
        type: 'corp',
        roleName: '企业人员',
        orgName: corpSearchQuery,
        deptName: corpDept || corpSearchQuery,
        status: 'pending',
        submitTime: new Date().toISOString().split('T')[0],
        rawData: null,
      };
    }

    if (editingDraftId) {
      setIdentities(identities.map(id => id.id === editingDraftId ? newRecord : id));
    } else {
      setIdentities([...identities, newRecord]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingDraftId(null);
    setSchoolSearchQuery('');
    setCorpSearchQuery('');
    setCorpDept('');
    setInstRole('');
    setInstDept('');
    setInstTitle('');
    setInstResearchArea('');
    setInstId('');
    setInstMajor('');
    setInstDegree('');
    setInstGradYear('');
    setInstJobIntention('');
    setCorpPosition('');
  };

  const openAppModal = () => {
    setEditingDraftId(null);
    setActiveTab('inst');
    setShowAddModal(true);
  };
  
  const editDraft = (record: IdentityRecord) => {
    const raw = record.rawData || {};
    setSchoolSearchQuery(raw.schoolSearchQuery || '');
    setCorpSearchQuery(raw.corpSearchQuery || '');
    setInstRole(raw.instRole || '');
    setInstDept(raw.instDept || '');
    setCorpDept(raw.corpDept || '');
    setInstTitle(raw.instTitle || '');
    setInstResearchArea(raw.instResearchArea || '');
    setInstId(raw.instId || '');
    setInstMajor(raw.instMajor || '');
    setInstDegree(raw.instDegree || '');
    setInstGradYear(raw.instGradYear || '');
    setInstJobIntention(raw.instJobIntention || '');
    setCorpPosition(raw.corpPosition || '');
    setActiveTab(record.type);
    setEditingDraftId(record.id);
    setShowAddModal(true);
  };

  const deleteDraft = (id: string) => {
    setIdentities(identities.filter(record => record.id !== id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between xl:items-baseline mb-6 space-x-4">
        <div className="flex items-baseline space-x-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">身份认证</h1>
          <p className="text-sm text-slate-500">查看您的已有身份或补充新的专业身份信息</p>
        </div>
        <button 
          onClick={toggleMockStatus}
          className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200 shadow-sm"
        >
          切换状态（演示用）
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {identities.length === 0 ? (
          <>
            <div className="bg-amber-50 rounded-lg p-5 border border-amber-100 flex items-start mb-6">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <h3 className="text-amber-800 font-medium mb-1">当前身份：普通用户</h3>
                <p className="text-amber-700/80 text-sm">
                  您暂未补充专业身份信息，平台部分功能将受到限制。建议您在下方选择对应的身份进行认证。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* 院校用户认证入口 */}
               <div className="bg-white border border-slate-200 shadow-sm rounded-xl py-6 px-6 relative hover:shadow-md transition-shadow flex flex-col justify-between items-center text-center group cursor-pointer" onClick={() => { setActiveTab('inst'); setShowAddModal(true); }}>
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex justify-center items-center mb-4 group-hover:scale-110 transition-transform">
                     <Building className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">院校用户</h3>
                  <p className="text-sm text-slate-500 mb-6">适用于高等院校、高职高专、K12等学校的教师和学生</p>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                     去认证
                  </button>
               </div>
               
               {/* 企业用户认证入口 */}
               <div className="bg-white border border-slate-200 shadow-sm rounded-xl py-6 px-6 relative hover:shadow-md transition-shadow flex flex-col justify-between items-center text-center group cursor-pointer" onClick={() => { setActiveTab('corp'); setShowAddModal(true); }}>
                  <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex justify-center items-center mb-4 group-hover:scale-110 transition-transform">
                     <Briefcase className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">企业用户</h3>
                  <p className="text-sm text-slate-500 mb-6">适用于企业员工、行业专家、合作伙伴等企业界人士</p>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                     去认证
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            {identities.map((identity) => {
              const Icon = identity.type === 'inst' ? Building : Briefcase;
              const isApproved = identity.status === 'approved';
              const isPending = identity.status === 'pending';
              const isRejected = identity.status === 'rejected';
              const isDraft = identity.status === 'draft';

              return (
                <div key={identity.id} className="bg-white border border-slate-200 text-card-foreground shadow-sm rounded-xl overflow-hidden">
                  <div className={`p-6 border-b ${isApproved ? 'bg-green-50/50 border-green-100' : isPending ? 'bg-blue-50/50 border-blue-100' : isRejected ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isApproved ? 'bg-green-100 text-green-600' : isPending ? 'bg-blue-100 text-blue-600' : isRejected ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{identity.type === 'inst' ? '院校认证' : '企业认证'}</h3>
                          <p className="text-sm text-slate-500 mt-1">提交时间：{identity.submitTime}</p>
                        </div>
                      </div>
                      <div>
                        {isApproved && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            认证成功
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            <Clock className="w-4 h-4 mr-1.5" />
                            审核中
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200" title={identity.rejectReason ? `原因: ${identity.rejectReason}` : '已驳回'}>
                            <X className="w-4 h-4 mr-1.5" />
                            已驳回
                          </span>
                        )}
                        {isDraft && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            <Save className="w-4 h-4 mr-1.5" />
                            未提交 (草稿)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">认证信息明细</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-slate-500">机构名称</div>
                        <div className="col-span-2 text-slate-900 font-medium">{identity.orgName}</div>
                      </div>
                      {identity.deptName && (
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-slate-500">所属部门/院系</div>
                          <div className="col-span-2 text-slate-900 font-medium">{identity.deptName}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-slate-500">身份类型/职位</div>
                        <div className="col-span-2 text-slate-900 font-medium">{identity.roleName}</div>
                      </div>
                    </div>
                    
                    {(isDraft || isRejected) && (
                      <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end space-x-3">
                        <button 
                          onClick={() => deleteDraft(identity.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          删除
                        </button>
                        <button 
                          onClick={() => editDraft(identity)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          重新编辑并提交
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 新增身份 Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[100]" onClick={closeModal} />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-600" />
                  {activeTab === 'inst' ? '院校认证' : '企业认证'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {activeTab === 'inst' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>所在院校全称
                      </label>
                      <OrgSearchInput 
                        placeholder="搜索/选择已初始化的院校全称"
                        value={schoolSearchQuery}
                        onChange={setSchoolSearchQuery}
                        onMissingOrg={() => setMissingOrgModalOpen(true)}
                        options={SCHOOL_LIST}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        所在院系
                      </label>
                      <input 
                        type="text"
                        value={instDept}
                        onChange={e => setInstDept(e.target.value)}
                        className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                        placeholder="请输入所在院系"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>身份类型
                      </label>
                      <div className="relative">
                        <select 
                          value={instRole}
                          onChange={e => setInstRole(e.target.value)}
                          className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white appearance-none transition-all shadow-sm"
                        >
                          <option value="">请选择身份类型</option>
                          <option value="admin">院校处室人员</option>
                          <option value="teacher">教师</option>
                          <option value="student">学生</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                          <ChevronRight className="h-4 w-4 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {(instRole === 'admin' || instRole === 'teacher') ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            <span className="text-red-500 mr-1">*</span>职称/职务
                          </label>
                          <input 
                            type="text" 
                            value={instTitle}
                            onChange={(e) => setInstTitle(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                            placeholder="请输入职称或职务"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            <span className="text-red-500 mr-1">*</span>研究领域
                          </label>
                          <input 
                            type="text" 
                            value={instResearchArea}
                            onChange={(e) => setInstResearchArea(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                            placeholder="请输入研究领域"
                          />
                        </div>
                      </>
                    ) : instRole === 'student' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            <span className="text-red-500 mr-1">*</span>专业
                          </label>
                          <input 
                            type="text" 
                            value={instMajor}
                            onChange={(e) => setInstMajor(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                            placeholder="请输入专业名称"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            <span className="text-red-500 mr-1">*</span>学历
                          </label>
                          <div className="relative">
                            <select 
                              value={instDegree}
                              onChange={(e) => setInstDegree(e.target.value)}
                              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white appearance-none transition-all shadow-sm"
                            >
                              <option value="">请选择学历</option>
                              <option value="大专">大专</option>
                              <option value="本科">本科</option>
                              <option value="硕士">硕士</option>
                              <option value="博士">博士</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                              <ChevronRight className="h-4 w-4 rotate-90" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            <span className="text-red-500 mr-1">*</span>学号
                          </label>
                          <input 
                            type="text" 
                            value={instId}
                            onChange={(e) => setInstId(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                            placeholder="请输入学号"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            <span className="text-red-500 mr-1">*</span>毕业年份
                          </label>
                          <div className="relative">
                            <select 
                              value={instGradYear}
                              onChange={(e) => setInstGradYear(e.target.value)}
                              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white appearance-none transition-all shadow-sm"
                            >
                              <option value="">请选择毕业年份</option>
                              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 4 - i).map(year => (
                                <option key={year} value={year}>{year}年</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                              <ChevronRight className="h-4 w-4 rotate-90" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            <span className="text-red-500 mr-1">*</span>求职意向
                          </label>
                          <input 
                            type="text" 
                            value={instJobIntention}
                            onChange={(e) => setInstJobIntention(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                            placeholder="请输入求职意向，如：前端工程师"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          <span className="text-red-500 mr-1">*</span>学号/工号
                        </label>
                        <input 
                          type="text" 
                          value={instId}
                          onChange={(e) => setInstId(e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                          placeholder="请输入学号或工号"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>资质证明
                      </label>
                      <p className="text-xs text-slate-500 mb-2">请上传学生证/教师证/工作证等能证明您身份的材料</p>
                      <ImageUpload />
                    </div>
                  </div>
                )}

                {activeTab === 'corp' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>所属企业
                      </label>
                      <OrgSearchInput 
                        placeholder="搜索/选择已注册的企业"
                        value={corpSearchQuery}
                        onChange={setCorpSearchQuery}
                        onMissingOrg={() => setMissingOrgModalOpen(true)}
                        options={['腾讯科技', '阿里巴巴', '字节跳动', '百度', '华为']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        所属部门
                      </label>
                      <input 
                        type="text"
                        value={corpDept}
                        onChange={(e) => setCorpDept(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                        placeholder="请输入所属部门"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        职位
                      </label>
                      <input 
                        type="text" 
                        value={corpPosition}
                        onChange={(e) => setCorpPosition(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all shadow-sm"
                        placeholder="请输入职位名称"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>资质证明
                      </label>
                      <p className="text-xs text-slate-500 mb-2">请上传工作牌/名片/在职证明等能证明您身份的材料</p>
                      <ImageUpload />
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
                <div className="flex space-x-3">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    提交审核
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 填写机构名称 Modal */}
      {missingOrgModalOpen && (
        <>
          <div
            onClick={() => setMissingOrgModalOpen(false)}
            className="fixed inset-0 bg-black/50 z-[120]"
          />
          <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] flex flex-col overflow-hidden pointer-events-auto transform transition-all animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900">填写机构/企业名称</h2>
                <button 
                  onClick={() => setMissingOrgModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <label className="block text-sm font-medium text-slate-700 mb-2"><span className="text-red-500 mr-1">*</span>全称</label>
                <input 
                  type="text" 
                  value={missingOrgName}
                  onChange={(e) => setMissingOrgName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="请输入全称" 
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
                      if (activeTab === 'inst') {
                        setSchoolSearchQuery(missingOrgName);
                      } else {
                        setCorpSearchQuery(missingOrgName);
                      }
                      setMissingOrgModalOpen(false);
                      setMissingOrgName('');
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
