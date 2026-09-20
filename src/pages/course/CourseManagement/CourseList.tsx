import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Eye,
  Copy,
  Tag,
  Edit,
  Trash2,
  ArrowLeftRight,
  Check,
  X,
  User,
  Calendar,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen
} from 'lucide-react';

// 初始系统标准内置课程
const INITIAL_SYSTEM_COURSES = [
  {
    id: 1,
    title: '数据标注与处理（中职）',
    status: '已发布',
    major: '人工智能/基础',
    creator: '系统专家组',
    createdAt: '2026-05-10 09:00:00',
    desc: '本课程是中等职业学校人工智能专业的专业基础课，讲解图像标注与文本清洗规范。',
    env: 'UUSIMA',
    isAI: true,
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    title: '深度学习应用技术',
    status: '未发布',
    major: '人工智能/深度学习',
    creator: '人工智能教研组',
    createdAt: '2026-06-12 14:30:00',
    desc: '深入浅出地讲解深度学习的基础技术与实际实训案例，涵盖卷积神经网络与实战项目。',
    env: 'UUSIMA',
    isAI: true,
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    title: '计算机视觉技术应用',
    status: '未发布',
    major: '人工智能/计算机视觉',
    creator: '系统专家组',
    createdAt: '2026-07-01 16:20:00',
    desc: '熟悉计算机视觉技术应用与工程化场景部署，OpenCV图像处理与形态学运算。',
    env: 'UUSIMA',
    isAI: true,
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    title: 'Python程序设计',
    status: '未发布',
    major: '人工智能/基础',
    creator: '计算机软件系',
    createdAt: '2026-07-15 10:00:00',
    desc: 'Python程序设计语法基础、函数式编程、面向对象与模块开发实训。',
    env: 'UUSIMA',
    isAI: true,
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 5,
    title: '数字图像处理技术应用',
    status: '未发布',
    major: '人工智能/计算机视觉',
    creator: '数字媒体教研室',
    createdAt: '2026-07-28 11:40:00',
    desc: '数字图像滤波、边缘提取、特征匹配及频域变换原理与算法应用。',
    env: 'UUSIMA',
    isAI: true,
    cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 6,
    title: 'Pytorch深度学习技术应用',
    status: '未发布',
    major: '人工智能/深度学习',
    creator: '智能科学系',
    createdAt: '2026-08-05 15:10:00',
    desc: 'PyTorch张量计算、自动求导机制、模型搭建及工业级场景推理部署。',
    env: 'UUSIMA',
    isAI: true,
    cover: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=400'
  }
];

export default function CourseList({ onEditCourse }: { onEditCourse: (id: number) => void }) {
  const [courses, setCourses] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('uusima_system_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SYSTEM_COURSES;
  });

  const [activeTab, setActiveTab] = useState('全部');
  const [activeMajor, setActiveMajor] = useState('全部');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [hoveredCourseId, setHoveredCourseId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // 监听跨页面系统课程克隆更新事件
  useEffect(() => {
    const loadCourses = () => {
      try {
        const stored = localStorage.getItem('uusima_system_courses');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCourses(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('uusima_system_courses_updated', loadCourses);
    return () => {
      window.removeEventListener('uusima_system_courses_updated', loadCourses);
    };
  }, []);

  const saveCourses = (next: any[]) => {
    setCourses(next);
    try {
      localStorage.setItem('uusima_system_courses', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const majors = ['全部', '物联网', '人工智能', '工业互联网', '大数据', '区块链', '专业技术技能', '岗位课程'];
  const tabs = ['全部', '已发布', '未发布'];

  // 过滤列表
  const filteredCourses = courses.filter(c => {
    if (activeTab !== '全部' && c.status !== activeTab) return false;
    if (activeMajor !== '全部' && !c.major.includes(activeMajor)) return false;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(kw);
      const matchCreator = c.creator ? c.creator.toLowerCase().includes(kw) : false;
      const matchMajor = c.major.toLowerCase().includes(kw);
      if (!matchTitle && !matchCreator && !matchMajor) return false;
    }
    return true;
  });

  const handleTogglePublish = (courseId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          status: c.status === '已发布' ? '未发布' : '已发布'
        };
      }
      return c;
    });
    saveCourses(next);
    setMenuOpenId(null);
  };

  const handleDeleteCourse = (courseId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('确认删除该系统课程吗？')) {
      const next = courses.filter(c => c.id !== courseId);
      saveCourses(next);
      setMenuOpenId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-wrap gap-3">
        <button
          onClick={() => onEditCourse(courses[0]?.id || 1)}
          className="flex items-center px-4 py-2 bg-[#1890ff] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1" /> 新增课程
        </button>

        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-slate-200 rounded overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50 border-r border-slate-200 text-xs text-slate-500 flex items-center cursor-pointer hover:bg-slate-100 transition-colors">
              标签筛选 <ChevronDown className="w-3 h-3 ml-1" />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="搜索课程名称、创建人、专业..."
                className="w-64 px-3 py-1.5 text-xs focus:outline-none"
              />
              <span className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-slate-400 border-l border-slate-100 bg-slate-50">
                <Search className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* 切换卡片 / 列表模式 */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('card')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
                viewMode === 'card' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>卡片</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>列表</span>
            </button>
          </div>
        </div>
      </div>

      {/* Majors Filter */}
      <div className="flex items-center px-4 py-3 border-b border-slate-100">
        <span className="text-sm text-slate-500 mr-4 font-medium shrink-0">专业：</span>
        <div className="flex flex-wrap gap-2 flex-1">
          {majors.map(major => (
            <button
              key={major}
              onClick={() => setActiveMajor(major)}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                activeMajor === major
                  ? 'bg-blue-50 text-[#1890ff] font-semibold border border-blue-200'
                  : 'text-slate-600 hover:text-[#1890ff] border border-transparent'
              }`}
            >
              {major}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex space-x-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm py-2 relative transition-colors cursor-pointer ${
                activeTab === tab ? 'text-[#1890ff] font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1890ff] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500">
          共 <strong className="text-slate-800 font-semibold">{filteredCourses.length}</strong> 门系统课程
        </div>
      </div>

      {/* 内容区域：支持卡片与列表展示 */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        {viewMode === 'card' ? (
          /* 卡片视图 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all relative flex flex-col justify-between group"
                onMouseEnter={() => setHoveredCourseId(course.id)}
                onMouseLeave={() => setHoveredCourseId(null)}
              >
                {/* 封面与状态标签 */}
                <div className="relative h-38 bg-blue-100 overflow-hidden">
                  <img
                    src={course.cover}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-10">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs ${
                        course.status === '已发布' ? 'bg-emerald-600' : 'bg-slate-600/90'
                      }`}
                    >
                      {course.status}
                    </span>
                    {course.isClonedFromCustom && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-white shadow-xs flex items-center">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                        自建克隆
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-base drop-shadow-md z-10 line-clamp-1">
                    {course.title}
                  </div>
                </div>

                {/* 核心信息区：明确显示创建人和创建日期 */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3
                        className="font-bold text-xs text-slate-800 truncate group-hover:text-blue-600 transition-colors"
                        title={course.title}
                      >
                        {course.title}
                      </h3>
                      <div className="relative">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === course.id ? null : course.id);
                          }}
                          className="p-1 rounded bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-[#1890ff] transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {menuOpenId === course.id && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-30 text-xs">
                            <button
                              onClick={e => handleTogglePublish(course.id, e)}
                              className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 flex items-center"
                            >
                              {course.status === '已发布' ? (
                                <>
                                  <X className="w-3.5 h-3.5 mr-2 text-red-500" /> 取消发布
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" /> 发布课程
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                onEditCourse(course.id);
                              }}
                              className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center"
                            >
                              <Edit className="w-3.5 h-3.5 mr-2" /> 编辑
                            </button>
                            <button
                              onClick={e => handleDeleteCourse(course.id, e)}
                              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" /> 删除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-[#1890ff] font-medium mb-1.5">{course.major}</div>

                    {/* 需求关键：显示创建人与创建日期 */}
                    <div className="space-y-1 bg-slate-50 p-2 rounded-md border border-slate-100 text-[11px] mb-2">
                      <div className="flex items-center text-slate-600 truncate" title={`创建人：${course.creator || '系统内置'}`}>
                        <User className="w-3 h-3 mr-1.5 text-blue-500 shrink-0" />
                        <span className="text-slate-400 mr-1">创建人:</span>
                        <span className="font-semibold text-slate-700 truncate">{course.creator || '系统内置'}</span>
                      </div>
                      <div className="flex items-center text-slate-500 text-[10px]" title={`创建时间：${course.createdAt || '2026-05-10'}`}>
                        <Calendar className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />
                        <span className="text-slate-400 mr-1">创建日期:</span>
                        <span className="font-mono">{course.createdAt || '2026-05-10'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2 line-clamp-1" title={course.desc}>
                      {course.desc}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center text-xs text-slate-500">
                      <span className="mr-1.5">环境:</span>
                      <span className="px-1.5 py-0.2 bg-blue-50 text-[#1890ff] rounded font-bold text-[10px]">
                        UUSIMA
                      </span>
                    </div>
                    <button
                      onClick={() => onEditCourse(course.id)}
                      className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      进入编辑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 列表视图 */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold text-slate-500 select-none">
                  <th className="py-3 px-4 min-w-[240px]">课程名称与概述</th>
                  <th className="py-3 px-4 w-36">所属专业</th>
                  {/* 核心要求：显示创建人 */}
                  <th className="py-3 px-4 w-36">创建人</th>
                  {/* 核心要求：显示创建日期 */}
                  <th className="py-3 px-4 w-36">创建日期</th>
                  <th className="py-3 px-4 w-28 text-center">状态</th>
                  <th className="py-3 px-4 w-36 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={course.cover}
                          alt={course.title}
                          className="w-12 h-9 rounded object-cover shadow-2xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5">
                            {course.isClonedFromCustom && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                                自建克隆
                              </span>
                            )}
                            <span className="font-bold text-slate-800 truncate" title={course.title}>
                              {course.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5" title={course.desc}>
                            {course.desc}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-blue-600 font-medium">{course.major}</td>
                    {/* 创建人 */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="font-semibold truncate">{course.creator || '系统内置'}</span>
                      </div>
                    </td>
                    {/* 创建日期 */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{course.createdAt || '2026-05-10'}</span>
                      </div>
                    </td>
                    {/* 状态 */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          course.status === '已发布'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            course.status === '已发布' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {course.status}
                      </span>
                    </td>
                    {/* 操作 */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onEditCourse(course.id)}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs font-medium cursor-pointer"
                        >
                          编辑
                        </button>
                        <button
                          onClick={e => handleTogglePublish(course.id, e)}
                          className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-medium cursor-pointer"
                        >
                          {course.status === '已发布' ? '下架' : '发布'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
        <div>共 {filteredCourses.length} 条记录</div>
        <div className="flex items-center space-x-2">
          <span>1 / 1 页</span>
        </div>
      </div>
    </div>
  );
}
