import React, { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { ChevronDown, Check, X, FileText, Download, Eye, List, Star, Search, ChevronRight, Bot, Languages, User, UserCircle, Settings, LogOut, Activity, LayoutGrid, ChevronLeft } from 'lucide-react';

export default function DatasetHall({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');
  const [sortOption, setSortOption] = useState('综合排序');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['科技互联网']);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const activeTenant = { name: "教育公司" };
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;


  const themes = [
    '科技互联网', '经济', '商业', '电商', '人文社科', 
    '金融科技', '房地产', '股票预测'
  ];

    const baseDatasets = [
    {
      author: '爱打字的程序员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      time: '1个月前',
      views: 11949,
      downloads: 729,
      title: '数据分析与可视化 用户购买行为 电商数据',
      desc: '随着智能手机的普及和移动设备的普遍使用，用户行为数据分析已成为了解用户需求、优化用户体验和提升业务转化的关键手段。',
      size: '1.2 MB',
      filesCount: 1,
      tags: ['科技互联网', '经济', '商业', '电商', '金融科技', '数据分析'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400'
    },
    {
      author: '数据挖掘达人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annie',
      time: '2个月前',
      views: 2305,
      downloads: 106,
      title: '小说网站爬虫爬取 晋江文学小说分析豆瓣小说分析',
      desc: '通过爬虫技术获取知名文学网站和阅读平台的公开小说数据，结合自然语言处理技术，对小说文本进行情感分析、题材分类、作者风格聚类等深度挖掘。',
      size: '12.5 KB',
      filesCount: 3,
      tags: ['科技互联网', '人文社科', '新闻资讯'],
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&h=400'
    },
    {
      author: '房产数据中心',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Buster',
      time: '2个月前',
      views: 1717,
      downloads: 110,
      title: '房源网站爬取 贝壳二手房数据',
      desc: '包含全国主要城市二手房挂牌信息，包括房屋基本信息、小区情况、周边配套、历史成交价格走势等丰富数据，适用于房地产市场研究。',
      size: '12.1 KB',
      filesCount: 1,
      tags: ['商业', '经济', '房地产'],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&h=400'
    },
    {
      author: '金融量化团队',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe',
      time: '1周前',
      views: 4520,
      downloads: 320,
      title: 'A股上市公司财报及股票交易明细数据',
      desc: '包含A股上市公司近五年的财务报表数据（资产负债表、利润表、现金流量表）以及每日股票交易行情数据。',
      size: '45.8 MB',
      filesCount: 12,
      tags: ['经济', '商业', '金融科技', '股票预测'],
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&h=400'
    },
    {
      author: '医疗AI实验室',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
      time: '3天前',
      views: 890,
      downloads: 45,
      title: '医学影像识别 胸部X光片肺部疾病分类数据集',
      desc: '包含超过5000张标注过的胸部X光片，用于训练深度学习模型自动识别肺炎、肺结核、气胸等常见肺部疾病。',
      size: '1.2 GB',
      filesCount: 5000,
      tags: ['医疗健康', '人工智能', '深度学习'],
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&h=400'
    }
  ];

  const datasets = Array.from({ length: 28 }).map((_, index) => {
    const base = baseDatasets[index % baseDatasets.length];
    return {
      ...base,
      id: index + 1,
      views: base.views + Math.floor(Math.random() * 1000),
      downloads: base.downloads + Math.floor(Math.random() * 100),
    };
  });

  const totalPages = Math.ceil(datasets.length / itemsPerPage);
  const currentDatasets = datasets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const handleThemeToggle = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex flex-col font-sans">
      {/* Header */}
      <AppHeader
        activeTab="dataset-hall"
        activeTenant={activeTenant}
        onNavigate={onNavigate}
        onSwitchTenant={() => setIsTenantOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] mx-auto w-full flex">
        {/* Left Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white p-6 shrink-0 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
          {/* Tabs */}
          <div className="flex items-center space-x-2 mb-8">
            <button 
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('all')}
            >
              <List className="w-4 h-4" />
              <span>全部</span>
            </button>
            <button 
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'featured' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('featured')}
            >
              <Star className="w-4 h-4" />
              <span>精选</span>
            </button>
          </div>

          <div className="space-y-8">
            {/* File Size */}
            <div>
              <h3 className="text-base font-medium text-slate-800 mb-4">文件大小</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1 flex items-center border border-slate-200 rounded-md bg-white">
                  <input type="text" placeholder="最小值" className="w-full px-3 py-1.5 text-sm outline-none bg-transparent" />
                  <div className="border-l border-slate-200 px-2 py-1.5 bg-slate-50 text-slate-500 text-sm flex items-center rounded-r-md">
                    KB <ChevronDown className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <span className="text-slate-400 text-sm">至</span>
                <div className="flex-1 flex items-center border border-slate-200 rounded-md bg-white">
                  <input type="text" placeholder="最大值" className="w-full px-3 py-1.5 text-sm outline-none bg-transparent" />
                  <div className="border-l border-slate-200 px-2 py-1.5 bg-slate-50 text-slate-500 text-sm flex items-center rounded-r-md">
                    KB <ChevronDown className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* License */}
            <div>
              <h3 className="text-base font-medium text-slate-800 mb-4">许可协议</h3>
              <div className="relative">
                <select className="w-full appearance-none border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-400 bg-white outline-none">
                  <option value="">请选择许可协议</option>
                  <option value="mit">MIT</option>
                  <option value="apache">Apache 2.0</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Themes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-slate-800">主题</h3>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-3">
                {themes.map((theme) => (
                  <label key={theme} className="flex items-center cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${selectedThemes.includes(theme) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                      {selectedThemes.includes(theme) && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-slate-600 text-sm">{theme}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-white min-h-0 overflow-y-auto">
          {/* Top Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 text-sm text-blue-500 font-medium"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  <span>{sortOption}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isSortOpen && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10">
                    {['综合排序', '最近更新', '使用最多', '下载最多', '点赞最多', '浏览最多'].map((opt) => (
                      <button
                        key={opt}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortOption === opt ? 'text-blue-500 bg-blue-50/50' : 'text-slate-700'}`}
                        onClick={() => {
                          setSortOption(opt);
                          setIsSortOpen(false);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button
                  onClick={() => setDisplayMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${displayMode === 'list' ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="列表视图"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDisplayMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${displayMode === 'grid' ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="网格视图"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                  我的收藏
                </button>
                <button className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                  <span className="mr-1">+</span> 数据集
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {selectedThemes.length > 0 && (
            <div className="flex items-center mb-6">
              <div className="flex flex-wrap gap-2">
                {selectedThemes.map(theme => (
                  <div key={theme} className="flex items-center bg-blue-50 text-blue-500 text-xs px-2.5 py-1 rounded">
                    <span>{theme}</span>
                    <button onClick={() => handleThemeToggle(theme)} className="ml-1 hover:text-blue-800">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                className="ml-4 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded px-2.5 py-1"
                onClick={() => setSelectedThemes([])}
              >
                清除
              </button>
            </div>
          )}

          {/* Dataset List */}
          <div className={displayMode === 'list' ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"}>
            {currentDatasets.map((dataset) => (
              displayMode === 'list' ? (
                <div key={dataset.id} className="flex flex-col md:flex-row gap-6 p-5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group cursor-pointer bg-white">
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center text-xs text-slate-500 mb-2.5">
                      <img src={dataset.avatar} alt="" className="w-5 h-5 rounded-full bg-slate-200 mr-2 border border-slate-100" />
                      <span className="font-medium text-slate-600">{dataset.author}</span>
                      <span className="mx-2 text-slate-300">·</span>
                      <span>{dataset.time}</span>
                      <span className="mx-2 text-slate-300">·</span>
                      <div className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1" />{dataset.views}</div>
                      <span className="mx-2 text-slate-300">·</span>
                      <div className="flex items-center"><Download className="w-3.5 h-3.5 mr-1" />{dataset.downloads}</div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-500 transition-colors line-clamp-1">{dataset.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{dataset.desc}</p>
                    
                    <div className="flex items-center flex-wrap gap-2 mt-auto">
                      <div className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        {dataset.filesCount > 0 ? `${dataset.filesCount} 文件` : dataset.size}
                      </div>
                      {dataset.filesCount > 0 && (
                        <div className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          {dataset.size}
                        </div>
                      )}
                      {dataset.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-xs text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md">{tag}</span>
                      ))}
                      {dataset.tags.length > 4 && (
                        <span className="text-xs text-slate-400">+{dataset.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-56 h-36 shrink-0 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                    <img src={dataset.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              ) : (
                <div key={dataset.id} className="flex flex-col rounded-xl hover:shadow-md transition-shadow border border-slate-200 overflow-hidden bg-white group cursor-pointer">
                  <div className="w-full h-40 shrink-0 overflow-hidden relative">
                    <img src={dataset.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {dataset.size}
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 leading-tight h-10">{dataset.title}</h3>
                    
                    <div className="flex items-center text-[11px] text-slate-500 mb-3">
                      <img src={dataset.avatar} alt="" className="w-4 h-4 rounded-full bg-slate-200 mr-1.5" />
                      <span className="truncate max-w-[80px]">{dataset.author}</span>
                      <span className="mx-1.5 text-slate-300">·</span>
                      <span className="truncate">{dataset.time}</span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">{dataset.desc}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                        <div className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1" />{dataset.views}</div>
                        <div className="flex items-center"><Download className="w-3.5 h-3.5 mr-1" />{dataset.downloads}</div>
                      </div>
                      <div className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {dataset.tags[0]}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      currentPage === i + 1 ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
