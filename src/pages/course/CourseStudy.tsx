import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft,
  AlignLeft,
  BookMarked,
  Film,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Home,
  ShieldCheck,
  Edit2,
  Type,
  PenTool,
  Image as ImageIcon,
  ChevronsRight,
  Maximize2,
  Columns2,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  CheckCircle2,
  Save,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  Subscript,
  Superscript,
  List,
  ListOrdered,
  ListTodo,
  Code,
  Eye,
  FileDown,
  RotateCcw,
  Sparkles,
  Folder,
  FileCode,
  Power,
  RefreshCw,
  FolderPlus,
  Upload,
  Minimize2,
  ArrowRight,
  Clock,
  Plus,
  Minus,
  Download,
  Bookmark,
  ArrowUp,
  Wrench,
  Camera,
  Minimize,
  Paperclip,
  Table,
  Link,
  Quote,
  Undo2,
  Redo2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelTopClose,
  PanelTopOpen,
  BookOpen
} from 'lucide-react';

// 四叶彩色气泡章节徽标（高精度还原截图）
const ChapterBubbleIcon = () => (
  <div className="w-5 h-5 mr-3 shrink-0 grid grid-cols-2 gap-1 p-0.5">
    <div className="w-2 h-2 rounded-full bg-[#9bb5ff] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"></div>
    <div className="w-2 h-2 rounded-full bg-[#2f80ed] shadow-[0_1px_2px_rgba(0,0,0,0.12)]"></div>
    <div className="w-2 h-2 rounded-full bg-[#bfdbfe] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"></div>
    <div className="w-2 h-2 rounded-full bg-[#1864cc] shadow-[0_1px_2px_rgba(0,0,0,0.12)]"></div>
  </div>
);

// 拖拽手柄组件（放在窗口右边缘，按住可横向拖动改变窗口大小）
const ResizeHandle = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) => (
  <div 
    onMouseDown={onMouseDown}
    className="absolute -right-1 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-500/25 active:bg-blue-600/35 transition-colors z-50 flex items-center justify-center group select-none"
    title="按住鼠标左键横向拖拽调整窗口大小"
  >
    <div className="w-[3px] h-9 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors shadow-xs"></div>
  </div>
);

// 新大陆时代科技 Logo 组件（完美对照课件截图右上角）
const NewlandLogo = () => (
  <div className="flex items-center space-x-2 select-none">
    <div className="w-6 h-6 sm:w-7 sm:h-7 relative flex items-center justify-center shrink-0">
      <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
        <polygon points="20,2 38,20 20,38 2,20" fill="#0c63c9" />
        <line x1="8" y1="18" x2="16" y2="26" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="11" y1="14" x2="22" y2="25" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="15" y1="10" x2="29" y2="24" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="19" y1="6" x2="33" y2="20" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
    <div className="flex flex-col text-left leading-none">
      <span className="text-[12px] sm:text-[13px] font-bold text-[#0c63c9] tracking-tight font-sans">新大陆时代科技</span>
      <span className="text-[6.5px] sm:text-[7.5px] font-bold text-[#0c63c9] tracking-[0.16em] uppercase font-sans mt-0.5">Newland Era Hi-Tech</span>
    </div>
  </div>
);

// 课件 PPT 幻灯片查看器组件（100%对照用户提供的课件阅读截图实现）
interface SlideViewerProps {
  title?: string;
  onBackToDirectory?: () => void;
  onDownload?: () => void;
}

const SlideViewer: React.FC<SlideViewerProps> = ({
  title = '章节1 授课操作演示（PPT）',
  onBackToDirectory,
  onDownload,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(6); // 默认定位到截图中的第 6 页
  const [inputPageText, setInputPageText] = useState<string>('6');
  const totalPages = 21;
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [zoomModeLabel, setZoomModeLabel] = useState<string>('自动缩放');
  const [isZoomDropdownOpen, setIsZoomDropdownOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeTool, setActiveTool] = useState<'pen' | 'text' | 'highlight' | 'image' | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 滚动到指定页码
  const handlePageJump = (page: number) => {
    const targetPage = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(targetPage);
    setInputPageText(String(targetPage));
    const targetElem = document.getElementById(`slide-page-${targetPage}`);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 缩放调整
  const handleZoomChange = (val: number) => {
    const clamped = Math.max(50, Math.min(200, val));
    setZoomPercent(clamped);
    setZoomModeLabel(`${clamped}%`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#c8ced8] overflow-hidden select-none relative">
      {/* 顶部标题行（左：章节1 授课操作演示（PPT），右：返回目录） */}
      <div className="h-10 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 shrink-0 z-20 shadow-2xs">
        <div className="text-[13px] sm:text-sm font-bold text-slate-800 tracking-tight flex items-center truncate pr-3">
          <span className="truncate">{title}</span>
        </div>
        <button 
          onClick={onBackToDirectory}
          className="text-xs sm:text-[13px] text-[#2f80ed] hover:text-blue-700 font-medium transition-colors cursor-pointer hover:underline shrink-0"
        >
          返回目录
        </button>
      </div>

      {/* 第二行工具条（高保真还原截图） */}
      <div className="h-9 bg-[#fbfcfd] border-b border-slate-200 flex items-center justify-between px-2.5 sm:px-3 text-slate-600 text-xs shrink-0 z-10 select-none overflow-x-auto custom-scrollbar">
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* 缩略图侧边栏切换 */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded hover:bg-slate-200/70 transition-colors cursor-pointer ${isSidebarOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
            title={isSidebarOpen ? '收起缩略图' : '展开缩略图'}
          >
            <div className="w-3.5 h-3.5 border border-current rounded-xs flex overflow-hidden">
              <div className="w-1 border-r border-current h-full bg-current/20"></div>
            </div>
          </button>

          {/* 全文搜索 */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 rounded hover:bg-slate-200/70 transition-colors cursor-pointer ${isSearchOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
            title="全文检索"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* 上一页 ^ */}
          <button 
            onClick={() => handlePageJump(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200/70 rounded cursor-pointer"
            title="上一页"
          >
            <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* 下一页 v */}
          <button 
            onClick={() => handlePageJump(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200/70 rounded cursor-pointer"
            title="下一页"
          >
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* 页码输入框 [ 6 ] / 21 */}
          <div className="flex items-center space-x-1 pl-0.5">
            <input 
              type="text"
              value={inputPageText}
              onChange={(e) => setInputPageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const p = parseInt(inputPageText);
                  if (!isNaN(p) && p >= 1 && p <= totalPages) {
                    handlePageJump(p);
                  }
                }
              }}
              onBlur={() => {
                const p = parseInt(inputPageText);
                if (!isNaN(p) && p >= 1 && p <= totalPages) {
                  handlePageJump(p);
                } else {
                  setInputPageText(String(currentPage));
                }
              }}
              className="w-8 h-5.5 text-center border border-slate-300 rounded bg-white text-xs font-mono shadow-2xs outline-none focus:border-blue-500"
            />
            <span className="text-slate-400 font-mono text-[11px]">/ {totalPages}</span>
          </div>

          <div className="h-3.5 w-px bg-slate-300 mx-1"></div>

          {/* 缩小按钮 — */}
          <button 
            onClick={() => handleZoomChange(zoomPercent - 10)}
            className="w-5 h-5 flex items-center justify-center hover:bg-slate-200/70 rounded text-slate-700 font-bold cursor-pointer"
            title="缩小"
          >
            <Minus className="w-3 h-3 stroke-[2.5]" />
          </button>

          {/* 放大按钮 + */}
          <button 
            onClick={() => handleZoomChange(zoomPercent + 10)}
            className="w-5 h-5 flex items-center justify-center hover:bg-slate-200/70 rounded text-slate-700 font-bold cursor-pointer"
            title="放大"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
          </button>

          {/* 缩放下拉框 [ 自动缩放 v ] */}
          <div className="relative">
            <button 
              onClick={() => setIsZoomDropdownOpen(!isZoomDropdownOpen)}
              className="flex items-center justify-between space-x-1 px-2 py-0.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-[11px] text-slate-700 min-w-[76px] cursor-pointer shadow-2xs"
            >
              <span>{zoomModeLabel}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isZoomDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-40 text-xs">
                {[
                  { label: '自动缩放', percent: 100 },
                  { label: '适合页宽', percent: 100 },
                  { label: '实际大小', percent: 100 },
                  { label: '50%', percent: 50 },
                  { label: '75%', percent: 75 },
                  { label: '125%', percent: 125 },
                  { label: '150%', percent: 150 },
                  { label: '200%', percent: 200 },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setZoomModeLabel(opt.label);
                      setZoomPercent(opt.percent);
                      setIsZoomDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1 hover:bg-blue-50 cursor-pointer ${zoomModeLabel === opt.label ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-3.5 w-px bg-slate-300 mx-1"></div>

          {/* 批注工具组（倾斜毛笔、T 文本、细铅笔、图片、更多 >>） */}
          <div className="flex items-center space-x-0.5 text-slate-500">
            <button 
              onClick={() => setActiveTool(activeTool === 'highlight' ? null : 'highlight')}
              className={`p-1 rounded hover:bg-slate-200/70 hover:text-blue-600 cursor-pointer ${activeTool === 'highlight' ? 'text-blue-600 bg-blue-50' : ''}`}
              title="荧光高亮"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'text' ? null : 'text')}
              className={`p-1 rounded hover:bg-slate-200/70 hover:text-blue-600 font-serif font-bold text-xs cursor-pointer ${activeTool === 'text' ? 'text-blue-600 bg-blue-50' : ''}`}
              title="文本标注"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'pen' ? null : 'pen')}
              className={`p-1 rounded hover:bg-slate-200/70 hover:text-blue-600 cursor-pointer ${activeTool === 'pen' ? 'text-blue-600 bg-blue-50' : ''}`}
              title="自由画笔"
            >
              <PenTool className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'image' ? null : 'image')}
              className={`p-1 rounded hover:bg-slate-200/70 hover:text-blue-600 cursor-pointer ${activeTool === 'image' ? 'text-blue-600 bg-blue-50' : ''}`}
              title="插入图像/贴图"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button 
              className="p-1 rounded hover:bg-slate-200/70 hover:text-blue-600 cursor-pointer text-slate-400"
              title="更多工具"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 右侧：下载课件 (PPT) */}
        <div className="flex items-center space-x-2 shrink-0 ml-2">
          <button 
            onClick={onDownload}
            className="flex items-center space-x-1.5 px-3 py-1 bg-[#2f80ed] hover:bg-blue-600 text-white text-xs rounded shadow-xs font-medium transition-all active:scale-95 cursor-pointer"
            title="下载当前课件 PPT 源文件"
          >
            <FileDown className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>下载课件 (PPT)</span>
          </button>
        </div>
      </div>

      {/* 搜索展开框 */}
      {isSearchOpen && (
        <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索课件幻灯片内容（如：scatter、参数、目标）..."
              className="w-full text-xs outline-none text-slate-700 placeholder:text-slate-400"
              autoFocus
            />
          </div>
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 主体区：左侧可选缩略图 + 右侧连续幻灯片流 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧幻灯片缩略图侧边栏 */}
        {isSidebarOpen && (
          <div className="w-36 sm:w-44 bg-[#eef1f6] border-r border-slate-300/80 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-3 space-y-3 select-none">
            <div className="text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-300 flex items-center justify-between">
              <span>幻灯片列表</span>
              <span>21 页</span>
            </div>
            {[
              { num: 1, label: '封面导读' },
              { num: 2, label: '课程模块' },
              { num: 3, label: '实训准备' },
              { num: 4, label: '前置回顾' },
              { num: 5, label: '知识框架' },
              { num: 6, label: '任务能力目标概览' },
              { num: 7, label: '六项任务能力目标' },
              { num: 8, label: '任务重难点剖析' },
              { num: 9, label: 'scatter 参数精解' },
              { num: 10, label: '坐标与标签美化' },
              { num: 11, label: '颜色映射表应用' },
              { num: 12, label: '气温与冷饮综合案例' },
              { num: 13, label: '多子图布局设计' },
              { num: 14, label: '数据读取与清洗' },
              { num: 15, label: '可视化趋势绘制' },
              { num: 16, label: '实操常见报错解析' },
              { num: 17, label: '代码工程化规范' },
              { num: 18, label: '课堂小测试' },
              { num: 19, label: '综合拓展任务' },
              { num: 20, label: '实训总结与升华' },
              { num: 21, label: '课后作业与资源' },
            ].map(slide => (
              <div 
                key={slide.num}
                onClick={() => handlePageJump(slide.num)}
                className={`p-1.5 rounded-md cursor-pointer transition-all ${
                  currentPage === slide.num 
                    ? 'bg-blue-100 ring-2 ring-blue-500' 
                    : 'bg-white hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <div className="aspect-[16/9] bg-slate-50 border border-slate-200 rounded flex flex-col items-center justify-center p-1 text-center relative overflow-hidden shadow-2xs">
                  <div className="w-full h-1 bg-blue-500 absolute top-0 left-0"></div>
                  <span className="text-[10px] font-bold text-slate-700 truncate w-full">{slide.label}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span>第 {slide.num} 页</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 核心幻灯片阅读画布（连续纵向排版，高精度还原截图内容） */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 flex flex-col items-center bg-[#c8ced8]"
        >
          {/* 幻灯片第 6 页（任务能力目标和任务重难点概览）—— 像素级还原截图 */}
          <div 
            id="slide-page-6"
            style={{ transform: `scale(${zoomPercent / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[760px] aspect-[16/9] bg-white rounded-xs shadow-[0_4px_24px_rgba(0,0,0,0.22)] p-6 sm:p-8 flex flex-col justify-between relative select-text overflow-hidden shrink-0 transition-transform duration-150"
          >
            {/* 左上角浅蓝柔和装饰波浪色块 */}
            <div className="absolute -top-3 -left-4 w-44 h-24 pointer-events-none opacity-85">
              <div className="w-24 h-4 bg-gradient-to-r from-blue-400 to-sky-300 rounded-full mb-1"></div>
              <div className="w-36 h-3.5 bg-gradient-to-r from-blue-300 to-sky-200 rounded-full mb-1 ml-3"></div>
              <div className="w-20 h-3 bg-gradient-to-r from-sky-400 to-blue-200 rounded-full ml-1"></div>
            </div>

            {/* 右上角：新大陆时代科技 Logo */}
            <div className="flex justify-end z-10">
              <NewlandLogo />
            </div>

            {/* 中间核心内容：立体菱形数字 2 + 大标题 */}
            <div className="my-auto flex items-center justify-center space-x-6 sm:space-x-8 px-4 sm:px-8 z-10">
              {/* 立体双层蓝色菱形徽标 */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-[#1960c9] to-[#0c3779] rotate-45 rounded-lg shadow-xl"></div>
                <div className="absolute inset-1.5 bg-gradient-to-tr from-[#2d7bf0] to-[#5ba0ff] rotate-45 rounded-md flex items-center justify-center"></div>
                <div className="absolute inset-3.5 bg-white rotate-45 rounded-xs flex items-center justify-center shadow-inner">
                  <span className="text-3xl sm:text-4xl font-black text-[#1556ba] -rotate-45 font-sans">2</span>
                </div>
              </div>

              {/* 标题文字 */}
              <div className="text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-[#183a6a] tracking-wider leading-snug font-sans">
                  任务能力目标<br />和任务重难点
                </h2>
              </div>
            </div>

            {/* 底部微小页码 */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100/60 pt-1">
              <span>第 6 页</span>
              <span>Python 数据可视化 · 任务概览</span>
            </div>
          </div>

          {/* 幻灯片第 7 页（任务能力目标 6 大立柱卡片）—— 像素级还原截图 */}
          <div 
            id="slide-page-7"
            style={{ transform: `scale(${zoomPercent / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[760px] aspect-[16/9] bg-white rounded-xs shadow-[0_4px_24px_rgba(0,0,0,0.22)] p-6 sm:p-8 flex flex-col justify-between relative select-text overflow-hidden shrink-0 transition-transform duration-150"
          >
            {/* 左上角浅蓝装饰与标题 */}
            <div className="absolute -top-3 -left-4 w-36 h-20 pointer-events-none opacity-85">
              <div className="w-24 h-3.5 bg-gradient-to-r from-blue-400 to-sky-300 rounded-full mb-1"></div>
              <div className="w-32 h-3 bg-gradient-to-r from-blue-300 to-sky-200 rounded-full ml-2"></div>
            </div>

            <div className="flex items-center justify-between z-10 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#183a6a] tracking-wide font-sans pl-2">
                任务能力目标
              </h2>
              <NewlandLogo />
            </div>

            {/* 6 个横向排列的彩色立柱指标卡片（01到06） */}
            <div className="grid grid-cols-6 gap-2 sm:gap-2.5 my-auto pt-2 pb-2 px-1 z-10">
              {/* 01: 蓝 */}
              <div className="flex flex-col bg-white rounded border border-blue-200/90 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform">
                <div className="bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white text-center py-1 font-bold text-xs sm:text-sm tracking-wider">
                  01
                </div>
                <div className="p-1.5 sm:p-2 text-[10px] sm:text-[11px] text-slate-700 leading-snug font-sans flex-1 flex items-center justify-center text-center">
                  能启动 Jupyter Notebook 并配置中文显示.
                </div>
              </div>

              {/* 02: 橙 */}
              <div className="flex flex-col bg-white rounded border border-amber-300 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform">
                <div className="bg-gradient-to-b from-[#f97316] to-[#c2410c] text-white text-center py-1 font-bold text-xs sm:text-sm tracking-wider">
                  02
                </div>
                <div className="p-1.5 sm:p-2 text-[10px] sm:text-[11px] text-slate-700 leading-snug font-sans flex-1 flex items-center justify-center text-center">
                  能把两个列表画成散点图并加上坐标轴和坐标轴名称.
                </div>
              </div>

              {/* 03: 蓝 */}
              <div className="flex flex-col bg-white rounded border border-blue-200/90 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform">
                <div className="bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white text-center py-1 font-bold text-xs sm:text-sm tracking-wider">
                  03
                </div>
                <div className="p-1.5 sm:p-2 text-[10px] sm:text-[11px] text-slate-700 leading-snug font-sans flex-1 flex items-center justify-center text-center">
                  能用 s、c、marker、alpha 参数调整点的大小、颜色、形状和透明度.
                </div>
              </div>

              {/* 04: 橙 */}
              <div className="flex flex-col bg-white rounded border border-amber-300 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform">
                <div className="bg-gradient-to-b from-[#f97316] to-[#c2410c] text-white text-center py-1 font-bold text-xs sm:text-sm tracking-wider">
                  04
                </div>
                <div className="p-1.5 sm:p-2 text-[10px] sm:text-[11px] text-slate-700 leading-snug font-sans flex-1 flex items-center justify-center text-center">
                  能在一张图上面画两组数据并用 legend() 显示图例.
                </div>
              </div>

              {/* 05: 蓝 */}
              <div className="flex flex-col bg-white rounded border border-blue-200/90 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform">
                <div className="bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white text-center py-1 font-bold text-xs sm:text-sm tracking-wider">
                  05
                </div>
                <div className="p-1.5 sm:p-2 text-[10px] sm:text-[11px] text-slate-700 leading-snug font-sans flex-1 flex items-center justify-center text-center">
                  能用颜色深浅 (cmap+color bar) 或点大小表示第三个变量.
                </div>
              </div>

              {/* 06: 橙 */}
              <div className="flex flex-col bg-white rounded border border-amber-300 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform">
                <div className="bg-gradient-to-b from-[#f97316] to-[#c2410c] text-white text-center py-1 font-bold text-xs sm:text-sm tracking-wider">
                  06
                </div>
                <div className="p-1.5 sm:p-2 text-[10px] sm:text-[11px] text-slate-700 leading-snug font-sans flex-1 flex items-center justify-center text-center">
                  能独立完成「气温与冷饮销量」综合案例并读懂图中的规律.
                </div>
              </div>
            </div>

            {/* 底部微小页码 */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100/60 pt-1">
              <span>第 7 页</span>
              <span>Python 数据可视化 · 能力矩阵</span>
            </div>
          </div>

          {/* 幻灯片第 8 页（任务重难点：橙色与蓝色折角条）—— 像素级还原截图 */}
          <div 
            id="slide-page-8"
            style={{ transform: `scale(${zoomPercent / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[760px] aspect-[16/9] bg-white rounded-xs shadow-[0_4px_24px_rgba(0,0,0,0.22)] p-6 sm:p-8 flex flex-col justify-between relative select-text overflow-hidden shrink-0 transition-transform duration-150"
          >
            {/* 左上角浅蓝装饰与标题 */}
            <div className="absolute -top-3 -left-4 w-36 h-20 pointer-events-none opacity-85">
              <div className="w-24 h-3.5 bg-gradient-to-r from-blue-400 to-sky-300 rounded-full mb-1"></div>
              <div className="w-32 h-3 bg-gradient-to-r from-blue-300 to-sky-200 rounded-full ml-2"></div>
            </div>

            <div className="flex items-center justify-between z-10 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#183a6a] tracking-wide font-sans pl-2">
                任务重难点
              </h2>
              <NewlandLogo />
            </div>

            {/* 重点与难点大折角条 */}
            <div className="my-auto px-4 sm:px-8 space-y-4 sm:space-y-5 w-full z-10">
              {/* 重点（橙色立体折角大文本块） */}
              <div className="relative bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white py-3.5 sm:py-4 px-6 rounded-sm shadow-md flex items-center transform -skew-x-3">
                <span className="transform skew-x-3 text-xs sm:text-sm md:text-[15px] font-bold tracking-wide font-sans">
                  重点：scatter() 四个常用参数（s、c、marker、alpha）的含义与使用。
                </span>
              </div>

              {/* 难点（蓝色立体折角大文本块） */}
              <div className="relative bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] text-white py-3.5 sm:py-4 px-6 rounded-sm shadow-md flex items-center transform -skew-x-3">
                <span className="transform skew-x-3 text-xs sm:text-sm md:text-[15px] font-bold tracking-wide font-sans">
                  难点：理解用颜色或点大小在一张图里同时表达第三个变量。
                </span>
              </div>
            </div>

            {/* 底部微小页码 */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100/60 pt-1">
              <span>第 8 页</span>
              <span>Python 数据可视化 · 教学重难点</span>
            </div>
          </div>

          {/* 幻灯片第 9 页（scatter() 函数核心语法演示） */}
          <div 
            id="slide-page-9"
            style={{ transform: `scale(${zoomPercent / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[760px] aspect-[16/9] bg-white rounded-xs shadow-[0_4px_24px_rgba(0,0,0,0.22)] p-6 sm:p-8 flex flex-col justify-between relative select-text overflow-hidden shrink-0 transition-transform duration-150"
          >
            <div className="flex items-center justify-between z-10 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#183a6a] tracking-wide font-sans pl-2">
                scatter() 核心语法结构
              </h2>
              <NewlandLogo />
            </div>

            <div className="my-auto px-6 py-2 bg-slate-900 text-slate-100 rounded-md font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
              <p className="text-emerald-400 font-bold mb-1"># 绘制多维度散点图标准语法模板</p>
              <p><span className="text-blue-400">import</span> matplotlib.pyplot <span className="text-blue-400">as</span> plt</p>
              <p className="mt-2">plt.<span className="text-amber-300">scatter</span>(</p>
              <p className="pl-4">x=temperatures, <span className="text-slate-400"># X轴数据（如日平均气温）</span></p>
              <p className="pl-4">y=ice_cream_sales, <span className="text-slate-400"># Y轴数据（冷饮日销售额）</span></p>
              <p className="pl-4">s=sales_volume * 5, <span className="text-slate-400"># 点的大小：表达客单量规模</span></p>
              <p className="pl-4">c=humidity_levels, <span className="text-slate-400"># 点的颜色：表达空气湿度</span></p>
              <p className="pl-4">cmap=<span className="text-green-300">'coolwarm'</span>, <span className="text-slate-400"># 颜色映射表</span></p>
              <p className="pl-4">alpha=<span className="text-purple-300">0.75</span>, <span className="text-slate-400"># 透明度：防止数据重叠遮挡</span></p>
              <p className="pl-4">marker=<span className="text-green-300">'o'</span> <span className="text-slate-400"># 标记形状：圆点</span></p>
              <p>)</p>
              <p className="mt-2">plt.<span className="text-amber-300">colorbar</span>(label=<span className="text-green-300">'相对湿度 (%)'</span>)</p>
              <p>plt.<span className="text-amber-300">show</span>()</p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100/60 pt-1">
              <span>第 9 页</span>
              <span>Python 数据可视化 · 核心代码语法示范</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 目录章节与步骤数据接口
interface DirectoryStepItem {
  id: string;
  title: string;
  type: 'text' | 'video' | 'lab' | 'exercise' | 'report';
  tag: '图文' | '视频' | '实验' | '习题' | '报告';
  status: '已提交' | '进行中' | '未开始';
}

interface DirectoryChapter {
  id: string;
  chapterTitle: string;
  steps: DirectoryStepItem[];
}

// 章节指令库数据模型（根据用户截图高保真定义）
interface InstructionItem {
  id: string;
  text: string;
}

interface InstructionTask {
  id: string;
  stepCode: string; // 如 1-1, 1-2
  taskName: string; // 如 任务1：图像基础操作（理论）
  type: 'theory' | 'practice' | 'video';
  instructions?: InstructionItem[];
}

interface InstructionChapterData {
  chapterId: string;
  chapterTitle: string;
  tasks: InstructionTask[];
}

// 章节指令库数据源（100%还原用户截图任务与指令卡片）
const defaultInstructionChapters: InstructionChapterData[] = [
  {
    chapterId: 'chap-image-annotation-1',
    chapterTitle: '第一章：图片标注',
    tasks: [
      { id: 't1-1', stepCode: '1-1', taskName: '任务1：图像基础操作（理论）', type: 'theory' },
      { 
        id: 't1-2', 
        stepCode: '1-2', 
        taskName: '任务1：图像基础操作（实操）', 
        type: 'practice',
        instructions: [
          { id: 'cmd-1', text: '如何使用OpenCV读取并显示图像属性' },
          { id: 'cmd-2', text: '图像的像素坐标体系是怎样定义的' },
          { id: 'cmd-3', text: '彩色图像与灰度图像在通道结构上有何差异' },
        ]
      },
      { id: 't1-3', stepCode: '1-3', taskName: '任务1：图像基础操作（视频）', type: 'video' },
      { id: 't1-4', stepCode: '1-4', taskName: '任务2：图像处理（理论）', type: 'theory' },
      { 
        id: 't1-5', 
        stepCode: '1-5', 
        taskName: '任务2：图像处理（实操）', 
        type: 'practice',
        instructions: [
          { id: 'cmd-4', text: '什么是形态学操作中的腐蚀与膨胀' },
          { id: 'cmd-5', text: '常见的图像滤波方法有哪些' },
          { id: 'cmd-6', text: '如何使用OpenCV实现图像平滑处理' },
        ]
      },
      { id: 't1-6', stepCode: '1-6', taskName: '任务2：图像处理（视频）', type: 'video' },
      { id: 't1-7', stepCode: '1-7', taskName: '任务3：图像分类标注（理论）', type: 'theory' },
      { 
        id: 't1-8', 
        stepCode: '1-8', 
        taskName: '任务3：图像分类标注（实操）', 
        type: 'practice',
        instructions: [
          { id: 'cmd-7', text: '图像多标签分类的标准标注格式是什么' },
          { id: 'cmd-8', text: '如何使用工具对图片批量导出类别标签' },
        ]
      },
      { id: 't1-9', stepCode: '1-9', taskName: '任务3：图像分类标注（视频）', type: 'video' },
      { id: 't1-10', stepCode: '1-10', taskName: '任务4：图像标框标注（理论）', type: 'theory' },
      { 
        id: 't1-11', 
        stepCode: '1-11', 
        taskName: '任务4：图像标框标注（实操）', 
        type: 'practice',
        instructions: [
          { id: 'cmd-9', text: 'VOC xml与YOLO txt边界框坐标格式转换方法' },
          { id: 'cmd-10', text: '目标检测实操中毒害标签与误检如何校正' },
        ]
      },
      { id: 't1-12', stepCode: '1-12', taskName: '任务4：图像标框标注（视频）', type: 'video' },
      { id: 't1-13', stepCode: '1-13', taskName: '任务5：图像描点标注（理论）', type: 'theory' },
      { 
        id: 't1-14', 
        stepCode: '1-14', 
        taskName: '任务5：图像描点标注（实操）', 
        type: 'practice',
        instructions: [
          { id: 'cmd-11', text: '人脸关键点与人体骨骼点标注拓扑顺序要求' },
          { id: 'cmd-12', text: '标注点遮挡（Occluded）属性的处理标准是什么' },
        ]
      },
      { id: 't1-15', stepCode: '1-15', taskName: '任务5：图像描点标注（视频）', type: 'video' },
    ]
  }
];

// 实验工具入口接口
interface LabToolItem {
  id: string;
  name: string;
  typeBadge: '平台型' | '容器型';
  badgeColor: string;
  desc: string;
  iconType: 'simulation' | 'jupyter';
}

// 实验工具卡片组件（100%还原用户截图）
const LabToolCard: React.FC<{ tool: LabToolItem; onEnter: (tool: LabToolItem) => void }> = ({ tool, onEnter }) => (
  <div className="w-[380px] bg-white rounded-xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-200 p-6 flex flex-col justify-between relative group">
    {/* 顶部：左侧图标 + 右侧类型徽标 */}
    <div className="flex items-start justify-between mb-4">
      {tool.iconType === 'simulation' ? (
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1890ff] to-[#36cfc9] flex items-center justify-center shadow-md shadow-blue-200/60">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white stroke-current fill-none stroke-[1.6]" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <circle cx="12" cy="4" r="1.5" fill="currentColor" />
            <circle cx="12" cy="20" r="1.5" fill="currentColor" />
            <circle cx="5" cy="8" r="1.5" fill="currentColor" />
            <circle cx="19" cy="8" r="1.5" fill="currentColor" />
            <circle cx="5" cy="16" r="1.5" fill="currentColor" />
            <circle cx="19" cy="16" r="1.5" fill="currentColor" />
            <line x1="12" y1="4" x2="12" y2="9.5" />
            <line x1="12" y1="14.5" x2="12" y2="20" />
            <line x1="5" y1="8" x2="10" y2="10.5" />
            <line x1="19" y1="8" x2="14" y2="10.5" />
            <line x1="5" y1="16" x2="10" y2="13.5" />
            <line x1="19" y1="16" x2="14" y2="13.5" />
            <polygon points="12,4 19,8 19,16 12,20 5,16 5,8" opacity="0.3" />
          </svg>
        </div>
      ) : (
        <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-[#e6f4ff] to-[#f4faff] border border-[#bae0ff]/60 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#1890ff] absolute top-1.5 right-3"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1890ff] absolute top-3 left-2.5"></div>
          <div className="w-9 h-3.5 border-t-[2.5px] border-b-[2.5px] border-[#1890ff] rounded-[50%] flex items-center justify-center my-0.5">
            <span className="text-[9px] font-extrabold text-[#1890ff] tracking-tighter">jupyter</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1890ff] absolute bottom-2 left-4"></div>
          <div className="w-full h-1 bg-gradient-to-r from-[#1890ff] via-[#fa8c16] to-[#fa541c] absolute bottom-0 left-0"></div>
        </div>
      )}

      {/* 右上角标签：平台型 / 容器型 */}
      <span 
        className={`px-3 py-1 rounded text-xs font-semibold text-white tracking-wide shadow-2xs ${
          tool.typeBadge === '平台型' ? 'bg-[#2b59c3]' : 'bg-[#9c27b0]'
        }`}
      >
        {tool.typeBadge}
      </span>
    </div>

    {/* 标题与简介 */}
    <div className="mb-6">
      <h3 className="text-base font-bold text-slate-800 mb-1">{tool.name}</h3>
      <p className="text-xs text-slate-400">{tool.desc || '暂无简介'}</p>
    </div>

    {/* 右下角操作链接 */}
    <div className="flex justify-end">
      <button 
        onClick={() => onEnter(tool)}
        className="text-xs text-[#2f80ed] hover:text-blue-700 font-medium transition-colors cursor-pointer group-hover:underline"
      >
        进入实验环境
      </button>
    </div>
  </div>
);

// 资源数据接口
interface ResourceTaskItem {
  id: string;
  name: string;
  fullTitle: string;
  type: 'text' | 'video' | 'manual' | 'file';
  duration?: string;
  fileSize?: string;
  desc?: string;
}

interface ChapterData {
  id: string;
  chapterTitle: string;
  items: ResourceTaskItem[];
}

// 实验报告 Markdown 实时渲染组件（解析常用格式，优雅排版）
const ReportMarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  if (!content.trim()) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-300 select-none p-8">
        <FileText className="w-12 h-12 stroke-[1.2] mb-3 text-slate-200" />
        <span className="text-sm text-slate-400">正文实时渲染预览区</span>
        <span className="text-xs text-slate-300 mt-1">在左侧编辑区输入文本后，此处将实时展示规范排版</span>
      </div>
    );
  }

  const lines = content.split('\n');
  return (
    <div className="max-w-none text-slate-800 text-sm leading-relaxed space-y-2.5 p-6 overflow-y-auto h-full select-text custom-scrollbar">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mt-4 mb-2">{line.replace(/^# /, '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-lg font-bold text-slate-800 mt-3 mb-1.5">{line.replace(/^## /, '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-base font-semibold text-slate-800 mt-2 mb-1">{line.replace(/^### /, '')}</h3>;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={idx} className="border-l-4 border-blue-500 pl-3 py-1.5 bg-blue-50/50 text-slate-600 rounded-r text-xs my-2">{line.replace(/^> /, '')}</blockquote>;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-2 text-xs sm:text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
              <span>{line.replace(/^[-*] /, '')}</span>
            </div>
          );
        }
        if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
          const checked = line.startsWith('- [x] ');
          return (
            <div key={idx} className="flex items-center space-x-2 pl-2 text-xs">
              <input type="checkbox" checked={checked} readOnly className="rounded text-blue-600 pointer-events-none" />
              <span className={checked ? 'line-through text-slate-400' : 'text-slate-700'}>{line.replace(/^- \[[ x]\] /, '')}</span>
            </div>
          );
        }
        if (line.startsWith('```')) {
          return <div key={idx} className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded w-max">{line}</div>;
        }
        if (!line.trim()) {
          return <div key={idx} className="h-2"></div>;
        }
        return <p key={idx} className="my-1 text-slate-700 text-xs sm:text-sm leading-relaxed">{line}</p>;
      })}
    </div>
  );
};

export default function CourseStudy({ onNavigate }: { onNavigate?: (view: string) => void }) {
  // 浮动抽屉激活状态：'directory'(目录) | 'notes'(笔记) | 'ai'(AI学伴) | null
  const [floatingDrawer, setFloatingDrawer] = useState<'directory' | 'notes' | 'ai' | null>('directory');
  
  // 资源面板展示状态（与右侧内容共享界面，可与浮动抽屉并存，浮动抽屉将覆盖在资源面板上）
  const [isResourceOpen, setIsResourceOpen] = useState<boolean>(false);
  
  // 浮动窗口宽度控制（支持横向拖拽改变大小，用于目录、笔记抽屉）
  const [drawerWidth, setDrawerWidth] = useState<number>(420);
  
  // 资源面板宽度控制（与右侧内容共享界面并排展示，支持拖拽改变左右两块内容占比，默认 460px）
  const [resourcePanelWidth, setResourcePanelWidth] = useState<number>(460);
  const [isDraggingResource, setIsDraggingResource] = useState<boolean>(false);
  
  // 资源面板内 4 个 Tab：'text'(图文) | 'video'(视频) | 'manual'(手册) | 'file'(文件)
  const [activeResourceTab, setActiveResourceTab] = useState<'text' | 'video' | 'manual' | 'file'>('text');
  
  // 打开的手册阅读器状态（非 null 时在资源面板中展示如截图所示的实训指导书阅读器）
  const [openedManualBook, setOpenedManualBook] = useState<{ title: string; subtitle?: string } | null>(null);
  const [manualPageNum, setManualPageNum] = useState<number>(1);
  const [manualTotalPages, setManualTotalPages] = useState<number>(10);
  const [manualZoom, setManualZoom] = useState<number>(100);
  
  // 打开的图文课件阅读器状态（非 null 时在资源面板中展示如截图所示的 PPT 课件阅读器）
  const [openedSlideBook, setOpenedSlideBook] = useState<{ chapterTitle: string; title: string } | null>(null);
  
  // 目录折叠状态控制：各个章节独立折叠/展开
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'dir-chap-1': true,
    'dir-chap-2': true,
    'dir-chap-3': false,
    'dir-chap-4': false,
  });

  // 目录中当前选中的步骤（默认为 1-2 理论图文教材，点击 1-4 等视频条目可无缝切换到视频播放器）
  const [currentStepId, setCurrentStepId] = useState<string>('1-2');

  // Toast 提示状态
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<any>(null);

  // 视频播放器状态
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const totalDurationSec = 4147; // 1小时09分07秒 = 4147秒
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState<boolean>(false);

  // 笔记内容与字数统计
  const [noteContent, setNoteContent] = useState('');
  const [isNotePreview, setIsNotePreview] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  // 资源预览弹窗
  const [previewItem, setPreviewItem] = useState<ResourceTaskItem | null>(null);

  // AI学伴浮动窗口会话与输入状态（参考截图功能）
  const [aiInputText, setAiInputText] = useState<string>('');
  const [isAiHistoryOpen, setIsAiHistoryOpen] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; time?: string }>>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // AI 弹窗独立宽度控制（默认增宽为 840px，双栏容纳指令库与会话）
  const [aiDrawerWidth, setAiDrawerWidth] = useState<number>(840);
  // AI 指令库显隐状态（默认显示在窗口左侧，可点击收起）
  const [isAiInstructionOpen, setIsAiInstructionOpen] = useState<boolean>(true);
  // 当前选中的指令库章节
  const [selectedInstructionChapterId, setSelectedInstructionChapterId] = useState<string>('chap-image-annotation-1');

  // 预设历史会话
  const aiHistoryList = [
    { id: '1', title: 'Python 数据可视化课程导学', time: '10:30' },
    { id: '2', title: 'Matplotlib 柱状图与折线图参数调优', time: '昨天' },
    { id: '3', title: 'Jupyter 虚拟实训环境配置指引', time: '前天' },
  ];

  // 发送问题处理（已深度适配截图中的图像基础操作与实操指令）
  const handleSendAiMessage = (question: string) => {
    if (!question.trim()) return;
    const userMsg = question.trim();
    setAiInputText('');
    setAiChatMessages(prev => [...prev, { role: 'user', content: userMsg, time: '刚刚' }]);
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      let reply = '这门课程主要涵盖了数据分析与可视化的基础理论及实操技能，帮助你掌握 OpenCV、数据处理等常用库的实际应用。';
      if (userMsg.includes('OpenCV') && (userMsg.includes('读取') || userMsg.includes('属性'))) {
        reply = '【OpenCV 读取与图像属性获取】\n在 Python 中使用 OpenCV 读取图像并查看核心属性：\n```python\nimport cv2\n\n# 读取图像（OpenCV 默认以 BGR 格式载入）\nimg = cv2.imread("sample.jpg")\n\n# 1. 查看图像形状尺寸（高, 宽, 通道数）\nh, w, c = img.shape\nprint(f"分辨率: {w} x {h}, 通道数: {c}")\n\n# 2. 图像像素总数（h * w * c）\nprint(f"总像素数: {img.size}")\n\n# 3. 像素数据类型（通常为 uint8，范围 0~255）\nprint(f"数据类型: {img.dtype}")\n```\n提示：若需以灰度图读取，可传入参数 `cv2.imread("sample.jpg", cv2.IMREAD_GRAYSCALE)`。';
      } else if (userMsg.includes('坐标体系') || (userMsg.includes('像素') && userMsg.includes('坐标'))) {
        reply = '【图像像素坐标体系定义】\n1. **几何空间坐标**：以图像左上角为原点 (0, 0)，水平向右为 X 轴正方向（图像宽度方向/列），垂直向下为 Y 轴正方向（图像高度方向/行）。\n2. **NumPy 数组访问**：在 Python/OpenCV 内部，图像被表示为二维或三维 NumPy 矩阵，索引遵循「先行后列」：\n   `pixel = img[y, x]` 或 `img[row, col]`\n   切片区域范围语法为：`roi = img[ymin:ymax, xmin:xmax]`。请注意避免把行列与XY坐标顺序混淆！';
      } else if (userMsg.includes('通道结构') || (userMsg.includes('彩色') && userMsg.includes('灰度'))) {
        reply = '【彩色图像与灰度图像的通道结构差异】\n1. **灰度图像**：\n   - 单通道矩阵，维度为 `(Height, Width)`；\n   - 每个像素点仅由一个 8 位整数（0~255）记录亮度强弱，0 表示纯黑，255 表示纯白。\n2. **彩色图像**：\n   - 三通道或四通道矩阵，常见维度为 `(Height, Width, 3)`；\n   - OpenCV 默认采用 **BGR 顺序**（Blue, Green, Red），与常规的 RGB 通道顺序相反；\n   - 每个通道独立记录对应颜色分量的强度，三者合成即可呈现完整色彩。';
      } else if (userMsg.includes('腐蚀') || userMsg.includes('膨胀')) {
        reply = '【形态学操作：腐蚀与膨胀】\n形态学操作通常作用于二值图像，依靠结构元（Kernel）对物体形状进行变换：\n1. **腐蚀 (Erosion)**：\n   - 原理：仅当结构元完全落在前景区域时，对应中心像素才保留为高电平；\n   - 效果：消除孤立细微噪点、缩窄目标边界、分离粘连物体；\n   - 代码：`cv2.erode(img, kernel, iterations=1)`\n2. **膨胀 (Dilation)**：\n   - 原理：只要结构元与前景有任意交集，中心像素即被置为高电平；\n   - 效果：填补前景内部微小孔洞、连接中断边缘、扩大物体范围；\n   - 代码：`cv2.dilate(img, kernel, iterations=1)`';
      } else if (userMsg.includes('滤波方法') || (userMsg.includes('滤波') && !userMsg.includes('平滑'))) {
        reply = '【常见的图像滤波方法汇总】\n1. **均值滤波** (`cv2.blur`)：简单求邻域像素算术平均，速度极快但边缘容易失真模糊；\n2. **高斯滤波** (`cv2.GaussianBlur`)：像素权重随距中心距离呈高斯分布，平滑效果自然，是去除高斯噪声的主流；\n3. **中值滤波** (`cv2.medianBlur`)：取邻域中位数，能极其完美地消除椒盐噪点（黑白斑点）且不破坏边缘；\n4. **双边滤波** (`cv2.bilateralFilter`)：结合空间距离与灰度差双权重，既能有效降噪又能极好地保全物体轮廓边缘。';
      } else if (userMsg.includes('平滑处理') || userMsg.includes('平滑')) {
        reply = '【使用 OpenCV 实现图像平滑处理】\n```python\nimport cv2\n\n# 载入待平滑图像\nimg = cv2.imread("noisy_img.jpg")\n\n# 1. 高斯平滑（卷积核大小须为奇数，如 5x5）\ngaussian = cv2.GaussianBlur(img, (5, 5), sigmaX=1.5)\n\n# 2. 中值平滑（去椒盐噪点专用）\nmedian = cv2.medianBlur(img, 5)\n\n# 3. 均值平滑\nblur = cv2.blur(img, (5, 5))\n\n# 保存或显示结果\ncv2.imwrite("smoothed.jpg", gaussian)\n```';
      } else if (userMsg.includes('多标签分类') || userMsg.includes('类别标签')) {
        reply = '【图像多标签分类与标注规范】\n1. 单张图片可同时具有多个独立属性（如「晴天」、「道路」、「行人」）；\n2. 标注数据通常以 JSON 或 Multi-hot 向量形式输出：`{"image_01.jpg": [1, 0, 1, 1]}`；\n3. 在实操中可通过标注平台的批量导出功能，直接生成配套的数据集字典索引。';
      } else if (userMsg.includes('YOLO') || userMsg.includes('VOC') || userMsg.includes('坐标格式')) {
        reply = '【VOC 与 YOLO 标注坐标转换原理】\n- **Pascal VOC 格式**：绝对像素左上与右下坐标 `[xmin, ymin, xmax, ymax]`；\n- **YOLO 格式**：归一化相对中心点与宽高 `[class_id, x_center, y_center, w, h]`（取值范围 0.0 ~ 1.0）；\n- 换算公式：\n  `x_center = (xmin + xmax) / (2 * width)`\n  `y_center = (ymin + ymax) / (2 * height)`\n  `w = (xmax - xmin) / width`\n  `h = (ymax - ymin) / height`';
      } else if (userMsg.includes('关键点') || userMsg.includes('骨骼') || userMsg.includes('描点')) {
        reply = '【图像描点与关键点标注规范】\n1. 人体骨骼点严格遵守固定拓扑序号（如 COCO 17 点标准：鼻、眼、耳、肩、肘、腕、髋、膝、踝）；\n2. 每个点包含三元组信息 `(x, y, v)`，其中 `v=0` 表示未标注，`v=1` 表示受遮挡但推断标注，`v=2` 表示清晰可见标注；\n3. 遇到肢体被前景遮挡时，需根据躯干生理连线合理标注遮挡属性。';
      } else if (userMsg.includes('主要内容') || userMsg.includes('介绍')) {
        reply = '《计算机视觉与图像标注实训》课程主要涵盖图像数据读取、OpenCV处理、VOC/YOLO标框、语义分割及关键点标注实战。点击左侧指令库中的具体指令即可快速调取实战指引！';
      } else if (userMsg.includes('大纲') || userMsg.includes('目录')) {
        reply = '实训涵盖核心模块：\n1. 第一章：图片标注（图像基础操作、OpenCV滤波、分类/标框/描点实战）\n2. 第二章：自然语言分类与聚类\n3. 第三章：酒店评论情绪分析\n4. 第四章：基于生活场景的命名实体识别';
      } else {
        reply = `已收到您的提问「${userMsg}」。在当前实训任务中，可结合左侧指令库开展实验。如需运行演示，请参考代码示例或在 Jupyter 实操环境中直接测试！`;
      }
      setAiChatMessages(prev => [...prev, { role: 'assistant', content: reply, time: '刚刚' }]);
    }, 450);
  };

  const handleNewAiChat = () => {
    setAiChatMessages([]);
    setAiInputText('');
    setIsAiHistoryOpen(false);
  };

  // 界面视窗显隐控制：隐藏左侧导航、隐藏顶部、隐藏手册(右侧资源面板由 isResourceOpen 控制)
  const [isLeftNavHidden, setIsLeftNavHidden] = useState<boolean>(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState<boolean>(false);

  // 实验报告类型步骤专用状态（100%参考截图还原大纲与双栏 Markdown 编辑器）
  const [reportSidebarOpen, setReportSidebarOpen] = useState<boolean>(true);
  const [reportContent, setReportContent] = useState<string>('');
  const [reportViewMode, setReportViewMode] = useState<'both' | 'edit' | 'preview'>('both');
  const [isReportFullscreen, setIsReportFullscreen] = useState<boolean>(false);

  // 实验报告工具栏插入辅助函数
  const handleInsertReportTag = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('report-editor-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      setReportContent(prev => prev ? `${prev}\n${prefix}${suffix}` : `${prefix}${suffix}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const prev = reportContent;
    const selected = prev.substring(start, end);
    const next = prev.substring(0, start) + prefix + selected + suffix + prev.substring(end);
    setReportContent(next);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // 左下角快捷工具箱状态与方法（截图、全屏）
  const [isToolsOpen, setIsToolsOpen] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isScreenFlashing, setIsScreenFlashing] = useState<boolean>(false);

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  // 全屏切换操作
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
        triggerSwitchToast('快捷工具', '已进入沉浸式全屏学习模式');
      }).catch(() => {
        triggerSwitchToast('快捷工具', '当前浏览器禁止自动全屏，请使用 F11 键');
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
          triggerSwitchToast('快捷工具', '已退出全屏模式');
        }).catch(() => {});
      }
    }
    setIsToolsOpen(false);
  };

  // 截图快捷操作
  const handleCaptureScreen = () => {
    setIsToolsOpen(false);
    // 触发快门闪白动画
    setIsScreenFlashing(true);
    setTimeout(() => setIsScreenFlashing(false), 300);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth || 1280;
      canvas.height = window.innerHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 绘制科技感深蓝背景
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 水印卡片
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('UUSIMA 智慧实训平台 · 课程学习快照', 60, 90);

        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`课程：自然语言处理技术与应用 / Python 数据可视化 · 当前步骤：${activeStep.title}`, 60, 140);
        ctx.fillText(`快照时间：${new Date().toLocaleString()}`, 60, 175);

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, 205);
        ctx.lineTo(canvas.width - 60, 205);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '15px sans-serif';
        ctx.fillText('✓ 截图已记录至学生实验操作日志与学情分析系统', 60, 250);

        const a = document.createElement('a');
        a.download = `实训截图_${new Date().toISOString().slice(0, 10)}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    } catch (e) {
      // ignore
    }

    triggerSwitchToast('快捷截屏', '截图成功！已自动保存并记录到本地');
  };

  // 课件查看器页码控制
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 68;

  // 实验环境运行阶段：'idle'（卡片列表）| 'launching'（启动中，参考截图1）| 'running'（实验运行中，参考截图2/截图3）
  const [labPhase, setLabPhase] = useState<'idle' | 'launching' | 'running'>('idle');
  const [activeLabTool, setActiveLabTool] = useState<LabToolItem | null>(null);
  const [launchCountdown, setLaunchCountdown] = useState<number>(3);
  const [isLabFullscreen, setIsLabFullscreen] = useState<boolean>(false);
  const [terminalCmd, setTerminalCmd] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ cmd: string; res?: string }>>([]);
  // 虚拟仿真专属交互状态
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [expandedSimCategory, setExpandedSimCategory] = useState<string>('智慧安防');
  const [simSearchText, setSimSearchText] = useState<string>('');

  // 启动倒计时逻辑（从 3s 倒计时至 0s，随后自动切换为运行中的实验环境，契合截图1到截图2）
  useEffect(() => {
    let timer: any = null;
    if (labPhase === 'launching') {
      timer = setInterval(() => {
        setLaunchCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setLabPhase('running');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [labPhase]);

  // 当切换课程步骤时，重置实验运行状态
  useEffect(() => {
    setLabPhase('idle');
    setActiveLabTool(null);
  }, [currentStepId]);

  // 视频播放计时器逻辑
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  // 时间格式化辅助函数 (秒 -> 0:00 或 1:09:07)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toast 弹窗触发器
  const triggerSwitchToast = (chapterTitle: string, stepTitle?: string) => {
    setToastMessage(`你已经切换 ${chapterTitle}${stepTitle ? ` - ${stepTitle}` : ''}`);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 通用下载资源处理（图文课件、手册指导书、文件等，支持真实浏览器下载并有 Toast 提示）
  const handleDownloadResource = (title: string, type: 'ppt' | 'pdf' | 'doc' | 'file') => {
    const ext = type === 'ppt' ? 'pptx' : type === 'pdf' ? 'pdf' : type === 'doc' ? 'docx' : 'zip';
    const mimeMap: Record<string, string> = {
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      zip: 'application/zip'
    };
    
    const content = `UUSIMA 智慧教学实验平台教学资源\n文件名称: ${title}.${ext}\n资源类别: ${type.toUpperCase()}\n下载时间: ${new Date().toLocaleString()}\n版权所属: 北京新大陆时代科技有限公司\n\n--- 资源内容已封包，支持教学查看与离线学习 ---`;
    const blob = new Blob([content], { type: mimeMap[ext] || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerSwitchToast('资源下载', `已开始下载【${title}.${ext}】`);
  };

  // 实验步骤工具列表获取函数（展示多个实验环境，包含虚拟仿真平台型与Jupyter容器型等）
  const getLabToolsForStep = (_stepId: string): LabToolItem[] => {
    return [
      {
        id: 'sim-1',
        name: '虚拟仿真',
        typeBadge: '平台型',
        badgeColor: 'bg-[#2b59c3]',
        desc: '暂无简介',
        iconType: 'simulation'
      },
      {
        id: 'jup-1',
        name: 'Jupyter',
        typeBadge: '容器型',
        badgeColor: 'bg-[#9c27b0]',
        desc: '暂无简介',
        iconType: 'jupyter'
      }
    ];
  };

  const handleEnterLabEnvironment = (tool: LabToolItem) => {
    setActiveLabTool(tool);
    setLaunchCountdown(3);
    setLabPhase('launching');
    triggerSwitchToast(activeChapter.chapterTitle, `正在启动【${tool.name}】实验环境...`);
  };

  const handleExitLabEnvironment = () => {
    setLabPhase('idle');
    setActiveLabTool(null);
  };

  // 横向拖拽手柄事件监听处理
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = drawerWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(300, Math.min(window.innerWidth * 0.75, Math.min(980, startWidth + deltaX)));
      setDrawerWidth(newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // AI 弹窗横向拖拽手柄事件监听处理（独立于目录与笔记宽度，支持宽屏拖拽）
  const handleAiMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = aiDrawerWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const minW = isAiInstructionOpen ? 560 : 360;
      const newWidth = Math.max(minW, Math.min(window.innerWidth * 0.9, Math.min(1380, startWidth + deltaX)));
      setAiDrawerWidth(newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // 资源面板左右分栏拖拽手柄事件监听处理（实时改变左侧资源与右侧内容占比）
  const handleResourceMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingResource(true);
    const startX = e.clientX;
    const startWidth = resourcePanelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // 限制左侧资源面板最小 300px，右侧内容区至少保留 380px，最大宽度受工作区总宽保护
      const maxWidth = Math.max(450, window.innerWidth - 64 - 380);
      const newWidth = Math.max(300, Math.min(maxWidth, startWidth + deltaX));
      setResourcePanelWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsDraggingResource(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // 目录章节折叠切换
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // 目录类型标签渲染函数（图文、视频、实验、习题、报告）
  const renderStepTag = (tag: '图文' | '视频' | '实验' | '习题' | '报告') => {
    switch (tag) {
      case '图文':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-blue-50 text-blue-600 border-blue-200/80 shrink-0">图文</span>;
      case '视频':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-amber-50 text-amber-600 border-amber-200/80 shrink-0">视频</span>;
      case '实验':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-purple-50 text-purple-600 border-purple-200/80 shrink-0">实验</span>;
      case '习题':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-emerald-50 text-emerald-600 border-emerald-200/80 shrink-0">习题</span>;
      case '报告':
        return <span className="px-1.5 py-0.5 text-[10px] rounded border font-medium bg-rose-50 text-rose-600 border-rose-200/80 shrink-0">报告</span>;
    }
  };

  // 目录结构数据（包含各类型步骤）
  const directoryData: DirectoryChapter[] = [
    {
      id: 'dir-chap-1',
      chapterTitle: '第一章：认识自然语言处理',
      steps: [
        { id: '1-1', title: '1-1 任务1 NLTK预处理方法（教材）', type: 'text', tag: '图文', status: '已提交' },
        { id: '1-2', title: '1-2 任务1 NLTK预处理方法（理论）', type: 'text', tag: '图文', status: '进行中' },
        { id: '1-3', title: '1-3 任务1 NLTK预处理方法（实操）', type: 'lab', tag: '实验', status: '已提交' },
        { id: '1-4', title: '1-4 任务1 NLTK预处理方法（视频）', type: 'video', tag: '视频', status: '已提交' },
        { id: '1-5', title: '1-5 任务2 中文文本分词方法与工具使用（教材）', type: 'text', tag: '图文', status: '未开始' },
        { id: '1-6', title: '1-6 任务2 中文文本分词方法与工具使用（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '1-7', title: '1-7 任务2 中文文本分词方法与工具使用（实操）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '1-8', title: '1-8 任务2 中文文本分词方法与工具使用（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '1-9', title: '1-9 任务3 核心词汇识别与云图开发（报告）', type: 'report', tag: '报告', status: '未开始' },
        { id: '1-10', title: '1-10 任务3 核心词汇识别与云图开发（习题）', type: 'exercise', tag: '习题', status: '未开始' },
      ]
    },
    {
      id: 'dir-chap-2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      steps: [
        { id: '2-1', title: '2-1 任务1 垃圾邮件分类器特征工程（教材）', type: 'text', tag: '图文', status: '未开始' },
        { id: '2-2', title: '2-2 任务1 开发中文垃圾邮件分类器（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '2-3', title: '2-3 任务1 贝叶斯分类器代码实操（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '2-4', title: '2-4 任务1 文本特征向量化精讲（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '2-5', title: '2-5 任务2 LDA主题模型无监督提取（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '2-6', title: '2-6 任务2 基于LDA开发提取邮件主题（实操）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '2-7', title: '2-7 任务2 LDA主题概率分布可视化（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '2-8', title: '2-8 任务3 主题模型评估分析报告（报告）', type: 'report', tag: '报告', status: '未开始' },
        { id: '2-9', title: '2-9 任务3 文本分类与聚类巩固测验（习题）', type: 'exercise', tag: '习题', status: '未开始' },
      ]
    },
    {
      id: 'dir-chap-3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      steps: [
        { id: '3-1', title: '3-1 任务1 情感极性判定原理（教材）', type: 'text', tag: '图文', status: '未开始' },
        { id: '3-2', title: '3-2 任务1 机器学习情感分析基础（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '3-3', title: '3-3 任务1 评论数据预处理与特征构建（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '3-4', title: '3-4 任务1 情感特征工程实战演示（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '3-5', title: '3-5 任务2 BiLSTM神经网络架构（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '3-6', title: '3-6 任务2 BiLSTM情绪识别模型训练（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '3-7', title: '3-7 任务2 神经网络训练循环剖析（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '3-8', title: '3-8 任务3 酒店评论情感评测实训报告（报告）', type: 'report', tag: '报告', status: '未开始' },
        { id: '3-9', title: '3-9 任务3 时序深度学习模型阶段测验（习题）', type: 'exercise', tag: '习题', status: '未开始' },
      ]
    },
    {
      id: 'dir-chap-4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      steps: [
        { id: '4-1', title: '4-1 任务1 实体识别BIO标注体系（教材）', type: 'text', tag: '图文', status: '未开始' },
        { id: '4-2', title: '4-2 任务1 生活场景数据处理及序列标注（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '4-3', title: '4-3 任务1 实体边界标注实战（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '4-4', title: '4-4 任务1 序列标注工具实战精讲（视频）', type: 'video', tag: '视频', status: '未开始' },
        { id: '4-5', title: '4-5 任务2 BiLSTM-CRF模型架构与训练（理论）', type: 'text', tag: '图文', status: '未开始' },
        { id: '4-6', title: '4-6 任务2 序列标注转移概率矩阵推导（实验）', type: 'lab', tag: '实验', status: '未开始' },
        { id: '4-7', title: '4-7 任务3 生活场景模型实测评估（报告）', type: 'report', tag: '报告', status: '未开始' },
        { id: '4-8', title: '4-8 任务3 命名实体识别综合考核试卷（习题）', type: 'exercise', tag: '习题', status: '未开始' },
      ]
    }
  ];

  // 查找当前激活的步骤和章节信息
  const getCurrentStepInfo = () => {
    for (const chapter of directoryData) {
      const found = chapter.steps.find(s => s.id === currentStepId);
      if (found) {
        return { chapter, step: found };
      }
    }
    return { chapter: directoryData[0], step: directoryData[0].steps[0] };
  };

  const { chapter: activeChapter, step: activeStep } = getCurrentStepInfo();

  // 1. 图文学习数据
  const textChapters: ChapterData[] = [
    {
      id: 'chap-1',
      chapterTitle: '第一章：认识自然语言处理',
      items: [
        { 
          id: '1-2', 
          name: '1-2 任务1 NLTK预处理方法（理论）', 
          fullTitle: '1-2 任务1 NLTK预处理方法（理论）',
          type: 'text',
          desc: '本任务讲解NLP基础环境构建、文本分词Tokenization及NLTK库的常见预处理流水线。'
        },
        { 
          id: '1-6', 
          name: '1-6 任务2 中文文本分词方法与工具使用（...', 
          fullTitle: '1-6 任务2 中文文本分词方法与工具使用（理论与实践）',
          type: 'text',
          desc: '深入剖析jieba分词算法原理（基于Trie树与HMM模型），以及分词工具的高阶使用技巧。'
        },
        { 
          id: '1-10', 
          name: '1-10 任务3 核心词汇识别与云图开发（理...', 
          fullTitle: '1-10 任务3 核心词汇识别与云图开发（理论与可视化）',
          type: 'text',
          desc: '基于TF-IDF算法提取核心关键词，并使用WordCloud和Matplotlib实现关键词云图绘制。'
        },
      ]
    },
    {
      id: 'chap-2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      items: [
        { 
          id: '2-2', 
          name: '2-2 任务1 开发中文垃圾邮件分类器（理论）', 
          fullTitle: '2-2 任务1 开发中文垃圾邮件分类器（理论）',
          type: 'text',
          desc: '垃圾邮件分类模型构建，涵盖CountVectorizer特征工程与朴素贝叶斯分类器训练。'
        },
        { 
          id: '2-6', 
          name: '2-6 任务2 基于LDA开发提取邮件主题模型...', 
          fullTitle: '2-6 任务2 基于LDA开发提取邮件主题模型（理论与调优）',
          type: 'text',
          desc: '隐含狄利克雷分布（LDA）主题建模无监督学习原理，主题概率分布计算及PyLDAvis可视化。'
        },
        { 
          id: '2-10', 
          name: '2-10 任务3 基于Bert模型开发多主题分类...', 
          fullTitle: '2-10 任务3 基于Bert模型开发多主题分类（深度学习）',
          type: 'text',
          desc: '深入解析Transformer架构与Bert预训练模型，使用HuggingFace进行下游微调任务。'
        },
      ]
    },
    {
      id: 'chap-3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      items: [
        { 
          id: '3-2', 
          name: '3-2 任务1 机器学习情感分析基础（理论）', 
          fullTitle: '3-2 任务1 机器学习情感分析基础（理论）',
          type: 'text',
          desc: '情感极性判定原理，正负样本数据均衡化清洗与特征提取方法。'
        },
        { 
          id: '3-6', 
          name: '3-6 任务2 酒店用户评论数据预处理与数据...', 
          fullTitle: '3-6 任务2 酒店用户评论数据预处理与数据探索性分析',
          type: 'text',
          desc: '大规模电商评论数据去重、停用词过滤及情感词典匹配构建流程。'
        },
        { 
          id: '3-10', 
          name: '3-10 任务3 基于BiLSTM学习情绪识别模型...', 
          fullTitle: '3-10 任务3 基于BiLSTM学习情绪识别模型（双向长短期记忆）',
          type: 'text',
          desc: '双向RNN与LSTM单元设计，捕捉时序语义上下文并实现细粒度情感打分预测。'
        },
      ]
    },
    {
      id: 'chap-4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      items: [
        { 
          id: '4-2', 
          name: '4-2 任务1 生活场景的数据处理及序列标注...', 
          fullTitle: '4-2 任务1 生活场景的数据处理及序列标注（BIO体系）',
          type: 'text',
          desc: '实体识别BIO标注标准，生活场景（地点、人名、机构名）语料库标注规范实训。'
        },
        { 
          id: '4-6', 
          name: '4-6 任务2 生活场景模型构建与训练（理论）', 
          fullTitle: '4-6 任务2 生活场景模型构建与训练（理论）',
          type: 'text',
          desc: 'BiLSTM-CRF网络架构在序列标注任务中的应用原理与转移概率矩阵推导。'
        },
        { 
          id: '4-10', 
          name: '4-10 任务3 生活场景模型测试（理论）', 
          fullTitle: '4-10 任务3 生活场景模型测试与实测评估（理论）',
          type: 'text',
          desc: '精确率Precision、召回率Recall及F1-Score评测，模型部署与接口封装。'
        },
      ]
    }
  ];

  // 2. 视频学习数据
  const videoChapters: ChapterData[] = [
    {
      id: 'chap-v1',
      chapterTitle: '第一章：认识自然语言处理',
      items: [
        { 
          id: 'v-1-1', 
          name: '1-4 任务1 NLTK预处理与分词环境搭建', 
          fullTitle: '1-4 任务1 NLTK预处理方法与实操教学视频',
          type: 'video',
          duration: '1:09:07',
          desc: 'JupyterLab 实操录屏：NLP 预处理与分词环境搭建教学实录'
        },
        { 
          id: 'v-1-2', 
          name: '1-8 任务2 中文文本分词与自定义词典导入', 
          fullTitle: '1-8 任务2 中文文本分词方法与工具实战精讲',
          type: 'video',
          duration: '45:15',
          desc: '分词工具配置及自定义词典引入演示'
        },
      ]
    },
    {
      id: 'chap-v2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      items: [
        { 
          id: 'v-2-1', 
          name: '2-4 任务1 垃圾邮件分类器特征工程全流程', 
          fullTitle: '2-4 任务1 中文垃圾邮件分类器训练全流程精讲',
          type: 'video',
          duration: '52:10',
          desc: '从数据导入到分类器准确率评测全过程'
        },
        { 
          id: 'v-2-2', 
          name: '2-7 任务2 LDA主题概率分布交互调优演示', 
          fullTitle: '2-7 任务2 LDA主题概率可视化调优演示视频',
          type: 'video',
          duration: '38:30',
          desc: '互动演示主题词分布与连贯性评估指标'
        },
      ]
    },
    {
      id: 'chap-v3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      items: [
        { 
          id: 'v-3-1', 
          name: '3-4 任务1 情感极性特征工程实战视频', 
          fullTitle: '3-4 任务1 情感极性特征工程实战视频教学',
          type: 'video',
          duration: '42:15',
          desc: '酒店多维度点评特征挖掘与可视化'
        },
        { 
          id: 'v-3-2', 
          name: '3-7 任务2 BiLSTM网络代码逐行剖析与演示', 
          fullTitle: '3-7 任务2 BiLSTM网络代码逐行剖析与演示视频',
          type: 'video',
          duration: '58:40',
          desc: 'PyTorch神经网络代码训练循环剖析'
        },
      ]
    },
    {
      id: 'chap-v4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      items: [
        { 
          id: 'v-4-1', 
          name: '4-4 任务1 实体识别BIO标注实操教学视频', 
          fullTitle: '4-4 任务1 实体识别BIO标注实操教学视频',
          type: 'video',
          duration: '35:50',
          desc: '工业级标注工具使用及数据增强方法'
        },
      ]
    }
  ];

  // 3. 手册学习数据
  const manualChapters: ChapterData[] = [
    {
      id: 'chap-m1',
      chapterTitle: '第一章：认识自然语言处理',
      items: [
        { 
          id: 'm-1-1', 
          name: '1-1 NLTK预处理函数与语料库使用手册', 
          fullTitle: '1-1 NLTK预处理函数与语料库官方使用手册',
          type: 'manual',
          desc: '详细介绍nltk.tokenize、nltk.stem、stopwords等常用模块API与配置'
        },
        { 
          id: 'm-1-2', 
          name: '1-5 Jieba分词精准模式与HMM底层原理手册', 
          fullTitle: '1-5 Jieba分词精准模式与HMM底层原理手册',
          type: 'manual',
          desc: 'Jieba词典格式规范、动态添加词与权重词典设定说明'
        },
      ]
    },
    {
      id: 'chap-m2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      items: [
        { 
          id: 'm-2-1', 
          name: '2-1 朴素贝叶斯分类器超参数调优指南', 
          fullTitle: '2-1 朴素贝叶斯分类器超参数调优指南与评估',
          type: 'manual',
          desc: 'MultinomialNB模型平滑因子alpha调参及交叉验证步骤'
        },
        { 
          id: 'm-2-2', 
          name: '2-5 LDA主题困惑度计算与PyLDAvis配置手册', 
          fullTitle: '2-5 LDA主题困惑度计算与PyLDAvis配置手册',
          type: 'manual',
          desc: '主题数K值择优公式及交互式可视化组件依赖部署指南'
        },
      ]
    },
    {
      id: 'chap-m3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      items: [
        { 
          id: 'm-3-1', 
          name: '3-1 中文情感词典极性打标与特征规范', 
          fullTitle: '3-1 中文情感词典极性打标与特征规范手册',
          type: 'manual',
          desc: '知网Hownet情感词表与大连理工情感本体库使用手册'
        },
        { 
          id: 'm-3-2', 
          name: '3-5 BiLSTM时序模型张量形状与输入对齐手册', 
          fullTitle: '3-5 BiLSTM时序模型张量形状与输入对齐手册',
          type: 'manual',
          desc: 'PyTorch PackedSequence序列填充与变长输入处理技巧'
        },
      ]
    },
    {
      id: 'chap-m4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      items: [
        { 
          id: 'm-4-1', 
          name: '4-1 命名实体识别BIO标注标准与质检手册', 
          fullTitle: '4-1 命名实体识别BIO标注标准与质检手册',
          type: 'manual',
          desc: '实体边界界定、多字词嵌套标注规范与常见易错示例集'
        },
      ]
    }
  ];

  // 4. 文件下载资源数据
  const fileChapters: ChapterData[] = [
    {
      id: 'chap-f1',
      chapterTitle: '第一章：认识自然语言处理',
      items: [
        { 
          id: 'f-1-1', 
          name: '1-0 《认识自然语言处理》理论讲义.pdf', 
          fullTitle: '1-0 《认识自然语言处理》理论讲义完整版.pdf',
          type: 'file',
          fileSize: '12.4 MB',
          desc: '第一章配套完整幻灯片与讲义讲稿'
        },
        { 
          id: 'f-1-2', 
          name: '1-3 NLTK与Jieba分词实操源代码.zip', 
          fullTitle: '1-3 NLTK与Jieba分词实操源代码与测试语料包.zip',
          type: 'file',
          fileSize: '4.8 MB',
          desc: '包含Jupyter Notebook实验源码与中文分词词库数据'
        },
      ]
    },
    {
      id: 'chap-f2',
      chapterTitle: '第二章：走进自然语言的分类与聚类',
      items: [
        { 
          id: 'f-2-1', 
          name: '2-0 中文垃圾邮件分类标准语料集.csv', 
          fullTitle: '2-0 中文垃圾邮件分类标准语料集（带标注）.csv',
          type: 'file',
          fileSize: '8.2 MB',
          desc: '50000条真实标注中文邮件文本语料'
        },
        { 
          id: 'f-2-2', 
          name: '2-3 贝叶斯与LDA主题建模工程模板.ipynb', 
          fullTitle: '2-3 贝叶斯与LDA主题建模工程完整模板.ipynb',
          type: 'file',
          fileSize: '1.5 MB',
          desc: '开箱即用的Jupyter实验项目模版代码'
        },
      ]
    },
    {
      id: 'chap-f3',
      chapterTitle: '第三章：走进酒店评论的情绪分析',
      items: [
        { 
          id: 'f-3-1', 
          name: '3-0 酒店评论情感分析精标数据集.json', 
          fullTitle: '3-0 酒店评论情感分析精标数据集.json',
          type: 'file',
          fileSize: '15.6 MB',
          desc: '包含评分、正面与负面评价标签的评论数据集'
        },
        { 
          id: 'f-3-2', 
          name: '3-7 BiLSTM情绪识别预训练权重.pt', 
          fullTitle: '3-7 BiLSTM情绪识别预训练权重文件.pt',
          type: 'file',
          fileSize: '48.2 MB',
          desc: '在百万评论上预训练收敛的深度学习模型权重'
        },
      ]
    },
    {
      id: 'chap-f4',
      chapterTitle: '第四章：走进基于生活场景的中文命名实体',
      items: [
        { 
          id: 'f-4-1', 
          name: '4-0 中文命名实体识别标注数据集.txt', 
          fullTitle: '4-0 中文命名实体识别生活场景标注数据集.txt',
          type: 'file',
          fileSize: '6.1 MB',
          desc: 'BIO格式生活场景人名、地名、机构名精标语料'
        },
      ]
    }
  ];

  // 根据当前激活的 Tab 获取数据
  const getCurrentChapters = () => {
    switch (activeResourceTab) {
      case 'video':
        return videoChapters;
      case 'manual':
        return manualChapters;
      case 'file':
        return fileChapters;
      case 'text':
      default:
        return textChapters;
    }
  };

  const currentChapters = getCurrentChapters();

  // 插入富文本标记辅助函数
  const handleInsertToolbarTag = (prefix: string, suffix: string = '') => {
    setNoteContent(prev => prev ? `${prev}\n${prefix}${suffix}` : `${prefix}${suffix}`);
  };

  // 步骤切换操作（附带 Toast 提示；当切换到实验类型时，自动打开资源面板切换到手册并打开手册查看器）
  const handleSelectStep = (chapterTitle: string, step: DirectoryStepItem) => {
    setCurrentStepId(step.id);
    if (step.type === 'video') {
      setIsPlaying(true);
    }

    // 需求：如果在目录中切换的步骤章节类型是实验类型，要自动打开资源并且切换到对应章节的手册并打开手册
    if (step.type === 'lab' || step.tag === '实验') {
      setIsResourceOpen(true);
      setActiveResourceTab('manual');
      setOpenedManualBook({
        title: 'Python 数据可视化实训指导书',
        subtitle: `${chapterTitle} · ${step.title}`
      });
      // 收起浮动的目录抽屉，让出视线直接展示左侧手册与右侧实验
      setFloatingDrawer(null);
      triggerSwitchToast(chapterTitle, `已自动打开【${step.title}】实训指导书手册`);
    } else {
      triggerSwitchToast(chapterTitle, step.title);
    }
  };

  // 将目录所有步骤打平成按顺序排列的一维数组（用于上一步/下一步按目录顺序切换）
  const allDirectorySteps = useMemo(() => {
    return directoryData.flatMap(chapter =>
      chapter.steps.map(step => ({
        chapterId: chapter.id,
        chapterTitle: chapter.chapterTitle,
        step
      }))
    );
  }, [directoryData]);

  // 当前激活步骤在扁平列表中的索引
  const currentStepIndex = useMemo(() => {
    return allDirectorySteps.findIndex(item => item.step.id === currentStepId);
  }, [allDirectorySteps, currentStepId]);

  // 动态计算任务进度百分比（基于当前步骤在目录总步骤中的进度）
  const taskProgressPercent = useMemo(() => {
    if (allDirectorySteps.length === 0) return 10;
    const currentIdx = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;
    return Math.round((currentIdx / allDirectorySteps.length) * 100);
  }, [allDirectorySteps, currentStepIndex]);

  // 根据当前目录切换到上一步骤
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prev = allDirectorySteps[currentStepIndex - 1];
      setExpandedChapters(prevExp => ({ ...prevExp, [prev.chapterId]: true }));
      handleSelectStep(prev.chapterTitle, prev.step);
    }
  };

  // 根据当前目录切换到下一步骤
  const handleNextStep = () => {
    if (currentStepIndex < allDirectorySteps.length - 1) {
      const next = allDirectorySteps[currentStepIndex + 1];
      setExpandedChapters(prevExp => ({ ...prevExp, [next.chapterId]: true }));
      handleSelectStep(next.chapterTitle, next.step);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans select-none relative">
      
      {/* 全局 Toast 提示（用户要求：切换章节成功后增加 toast 提示，你已经切换xxx章节） */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center space-x-2.5 border border-slate-700/60 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium tracking-wide">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 隐藏顶部时的快速唤回悬浮把手 */}
      {isHeaderHidden && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button 
            type="button"
            onClick={() => setIsHeaderHidden(false)}
            className="bg-white/95 hover:bg-white border border-t-0 border-slate-200/90 px-3.5 py-1 rounded-b-lg shadow-md text-xs text-slate-600 hover:text-blue-600 flex items-center space-x-1.5 transition-all cursor-pointer backdrop-blur-sm"
            title="恢复显示顶部导航栏"
          >
            <PanelTopOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>显示顶部栏</span>
          </button>
        </div>
      )}

      {/* 顶部主导航栏 */}
      {!isHeaderHidden && (
        <header className="relative py-1 min-h-[56px] bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-xs z-20">
          {/* 左侧：返回按钮与课程标题 */}
          <div className="flex items-center shrink-0 z-10">
            <button 
              onClick={() => onNavigate ? onNavigate('personal') : null}
              className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md transition-colors mr-3 cursor-pointer"
              title="我的主页"
            >
              <Home className="w-5 h-5" />
            </button>
            <img 
              src="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=60&h=60" 
              alt="Cover" 
              className="w-6 h-6 rounded mr-2 object-cover" 
            />
            <div className="flex items-baseline space-x-3">
              <h1 className="text-[15px] font-medium text-slate-800">《Python可视化应用》</h1>
              <span className="text-[12px] text-slate-400 font-normal hidden sm:inline">AI学伴-功能演示1789454686416</span>
            </div>
          </div>
          
          {/* 中间居中模块：任务进度与当前步骤 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none md:pointer-events-auto max-w-[42%] text-center z-10">
            <div className="flex items-center text-slate-600 text-[13px]">
              <span className="mr-2">任务进度:</span>
              <span className="font-semibold text-slate-800">{taskProgressPercent} %</span>
            </div>
            <div 
              className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[500px]"
              title={`当前步骤: ${activeChapter.chapterTitle} - ${activeStep.title}`}
            >
              当前步骤: {activeChapter.chapterTitle} - {activeStep.title}
            </div>
          </div>
          
          {/* 右侧：剩余时间与操作按钮 */}
          <div className="flex items-center space-x-3 shrink-0 ml-auto z-10">
            <div className="hidden xl:flex items-center text-slate-600 text-[13px] mr-2">
              <span className="mr-2 text-slate-400">剩余时间:</span>
              <span className="font-medium text-slate-700">16: 34: 50</span>
            </div>

            <button 
              onClick={handlePrevStep}
              disabled={currentStepIndex <= 0}
              className={`px-4 py-1.5 border rounded text-sm flex items-center transition-colors ${
                currentStepIndex <= 0
                  ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-blue-600 cursor-pointer'
              }`}
              title={currentStepIndex <= 0 ? '已经是第一个步骤' : '根据目录切换至上一节'}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              上一步
            </button>
            <button 
              onClick={handleNextStep}
              disabled={currentStepIndex >= allDirectorySteps.length - 1}
              className={`px-4 py-1.5 border rounded text-sm flex items-center transition-colors ${
                currentStepIndex >= allDirectorySteps.length - 1
                  ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-blue-600 cursor-pointer'
              }`}
              title={currentStepIndex >= allDirectorySteps.length - 1 ? '已经是最后一个步骤' : '根据目录切换至下一节'}
            >
              下一步
              <ChevronsRight className="w-4 h-4 ml-1" />
            </button>
            <button className="px-4 py-1.5 border border-blue-200 text-blue-500 hover:bg-blue-50 rounded text-sm flex items-center transition-colors bg-blue-50/30 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-1 rotate-90" />
              上报本节
            </button>
            <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors shadow-xs cursor-pointer">
              提交任务
            </button>
          </div>
        </header>
      )}

      {/* 当左侧导航隐藏时的极简悬浮恢复栏 */}
      {isLeftNavHidden && (
        <div className="fixed left-3 bottom-5 z-50 flex items-center space-x-2 animate-in fade-in slide-in-from-left-2 duration-200">
          <button
            type="button"
            onClick={() => setIsLeftNavHidden(false)}
            className="h-9 px-3 bg-white/95 backdrop-blur-sm border border-slate-200/90 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-lg flex items-center space-x-1.5 text-xs font-medium transition-all cursor-pointer"
            title="恢复显示左侧导航栏"
          >
            <PanelLeftOpen className="w-4 h-4 text-blue-600" />
            <span>显示导航</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="h-9 w-9 bg-white/95 backdrop-blur-sm border border-slate-200/90 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-lg flex items-center justify-center transition-all cursor-pointer relative"
            title="快捷工具箱"
          >
            <Wrench className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      )}

      {/* 主体工作区 */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 左侧垂直菜单栏（目录、笔记、资源、AI） */}
        {!isLeftNavHidden && (
          <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 shrink-0 z-50 select-none shadow-[2px_0_6px_rgba(0,0,0,0.03)] pointer-events-auto">
            {/* 1. 目录 */}
            <button 
              type="button"
              onClick={() => setFloatingDrawer(floatingDrawer === 'directory' ? null : 'directory')}
              className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg mb-3 transition-colors cursor-pointer relative z-10 pointer-events-auto ${
                floatingDrawer === 'directory' 
                  ? 'text-blue-600 bg-blue-50 font-medium shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              title="课程目录"
            >
              <AlignLeft className="w-5 h-5 mb-1 shrink-0" />
              <span className="text-[10px] leading-none">目录</span>
            </button>
            
            {/* 2. 笔记 */}
            <button 
              type="button"
              onClick={() => setFloatingDrawer(floatingDrawer === 'notes' ? null : 'notes')}
              className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg mb-3 transition-colors cursor-pointer relative z-10 pointer-events-auto ${
                floatingDrawer === 'notes' 
                  ? 'text-[#4f46e5] bg-[#eef2ff] font-medium shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              title="随堂笔记"
            >
              <BookMarked className="w-5 h-5 mb-1 shrink-0" />
              <span className="text-[10px] leading-none">笔记</span>
            </button>
            
            {/* 3. 资源 */}
            <button 
              type="button"
              onClick={() => {
                if (isResourceOpen) {
                  setIsResourceOpen(false);
                } else {
                  setIsResourceOpen(true);
                  setFloatingDrawer(null);
                }
              }}
              className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg mb-6 transition-colors cursor-pointer relative z-10 pointer-events-auto ${
                isResourceOpen 
                  ? 'text-blue-600 bg-blue-50 font-medium shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              title="课程资源"
            >
              <Film className="w-5 h-5 mb-1 shrink-0" />
              <span className="text-[10px] leading-none">资源</span>
            </button>
            
            {/* 4. AI */}
            <button 
              id="btn-ai-drawer"
              type="button"
              onClick={() => {
                if (floatingDrawer === 'ai') {
                  setFloatingDrawer(null);
                } else {
                  setFloatingDrawer('ai');
                  if (isAiInstructionOpen && aiDrawerWidth < 780) {
                    setAiDrawerWidth(840);
                  }
                }
              }}
              className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg mb-2 cursor-pointer transition-all active:scale-95 relative z-10 pointer-events-auto ${
                floatingDrawer === 'ai'
                  ? 'bg-[#eef2ff] text-[#4f46e5] font-medium shadow-xs ring-1 ring-indigo-300'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              title="AI学伴"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-xs mb-0.5">
                AI
              </div>
              <span className="text-[10px] leading-none">AI</span>
            </button>

            {/* 5. 左下角快捷工具箱（截图、全屏、隐藏导航、隐藏手册、隐藏顶部） */}
            <div className="mt-auto relative w-full flex flex-col items-center pointer-events-auto">
              <button 
                type="button"
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-all cursor-pointer relative z-10 pointer-events-auto ${
                  isToolsOpen 
                    ? 'text-blue-600 bg-blue-50 font-medium shadow-xs ring-1 ring-blue-300' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                title="快捷工具箱（截图、全屏、隐藏导航/手册/顶部）"
              >
                <Wrench className="w-5 h-5 mb-1 shrink-0" />
                <span className="text-[10px] leading-none">工具</span>
              </button>

              {/* 点击工具后弹出的快捷操作气泡面板 */}
              {isToolsOpen && (
                <>
                  {/* 点击外部关闭遮罩 */}
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setIsToolsOpen(false)} 
                  />

                  <div className="absolute left-16 bottom-0 ml-2 w-56 bg-white rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.14)] border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-left-2 duration-150 select-none">
                    <div className="px-3.5 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center">
                        <Wrench className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                        快捷工具箱
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">实训助手</span>
                    </div>

                    <div className="px-1 space-y-0.5">
                      {/* 1. 隐藏/显示导航（对应隐藏左侧导航） */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLeftNavHidden(!isLeftNavHidden);
                          setIsToolsOpen(false);
                          triggerSwitchToast('界面布局', !isLeftNavHidden ? '已隐藏左侧导航，可通过悬浮按钮随时恢复' : '已恢复显示左侧导航');
                        }}
                        className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                          {isLeftNavHidden ? <PanelLeftOpen className="w-4 h-4 stroke-[2]" /> : <PanelLeftClose className="w-4 h-4 stroke-[2]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 group-hover:text-blue-600 leading-tight">
                            {isLeftNavHidden ? '显示导航' : '隐藏导航'}
                          </div>
                          <div className="text-[11px] text-slate-400 group-hover:text-blue-500/80 truncate">
                            {isLeftNavHidden ? '展开左侧功能菜单栏' : '隐藏左侧功能导航栏'}
                          </div>
                        </div>
                      </button>

                      {/* 2. 隐藏/显示手册（对应右侧资源显示的面板） */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsResourceOpen(!isResourceOpen);
                          setIsToolsOpen(false);
                          triggerSwitchToast('界面布局', isResourceOpen ? '已隐藏手册资源面板' : '已展开手册资源面板');
                        }}
                        className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                          <BookOpen className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 group-hover:text-blue-600 leading-tight">
                            {isResourceOpen ? '隐藏手册' : '显示手册'}
                          </div>
                          <div className="text-[11px] text-slate-400 group-hover:text-blue-500/80 truncate">
                            {isResourceOpen ? '收起右侧手册资源面板' : '展开右侧手册资源面板'}
                          </div>
                        </div>
                      </button>

                      {/* 3. 隐藏/显示顶部 */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsHeaderHidden(!isHeaderHidden);
                          setIsToolsOpen(false);
                          triggerSwitchToast('界面布局', !isHeaderHidden ? '已隐藏顶部导航，可通过悬浮把手随时恢复' : '已恢复显示顶部导航');
                        }}
                        className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                          {isHeaderHidden ? <PanelTopOpen className="w-4 h-4 stroke-[2]" /> : <PanelTopClose className="w-4 h-4 stroke-[2]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 group-hover:text-blue-600 leading-tight">
                            {isHeaderHidden ? '显示顶部' : '隐藏顶部'}
                          </div>
                          <div className="text-[11px] text-slate-400 group-hover:text-blue-500/80 truncate">
                            {isHeaderHidden ? '展开顶部标题与状态栏' : '隐藏顶部标题与状态栏'}
                          </div>
                        </div>
                      </button>

                      <div className="h-px bg-slate-100 my-1"></div>

                      {/* 4. 页面截图快捷方式 */}
                      <button
                        type="button"
                        onClick={handleCaptureScreen}
                        className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                          <Camera className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 group-hover:text-blue-600 leading-tight">截屏快照</div>
                          <div className="text-[11px] text-slate-400 group-hover:text-blue-500/80 truncate">快速截取当前学习界面</div>
                        </div>
                      </button>

                      {/* 5. 全屏快捷方式 */}
                      <button
                        type="button"
                        onClick={toggleFullScreen}
                        className="w-full px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                          {isFullScreen ? (
                            <Minimize className="w-4 h-4 stroke-[2]" />
                          ) : (
                            <Maximize className="w-4 h-4 stroke-[2]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 group-hover:text-blue-600 leading-tight">
                            {isFullScreen ? '退出全屏' : '全屏显示'}
                          </div>
                          <div className="text-[11px] text-slate-400 group-hover:text-blue-500/80 truncate">
                            {isFullScreen ? '还原常规窗口模式' : '进入沉浸式实训视窗'}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        )}

        {/* 1. 目录浮动抽屉（支持横向拖拽改变窗口大小、折叠章节；当资源面板打开时浮动覆盖在其上方） */}
        {floatingDrawer === 'directory' && (
          <aside 
            style={{ width: `${drawerWidth}px` }}
            className={`absolute top-0 ${isLeftNavHidden ? 'left-0' : 'left-16'} bottom-0 bg-white border-r border-slate-200/90 flex flex-col z-40 shadow-[8px_0_30px_rgba(0,0,0,0.18)] transition-none animate-in fade-in duration-150`}
          >
            {/* 顶部控制栏 */}
            <div className="h-11 flex items-center justify-between px-4 border-b border-slate-100 shrink-0 bg-white">
              <span className="text-sm font-bold text-slate-800 flex items-center">
                <AlignLeft className="w-4 h-4 mr-2 text-blue-600" />
                课程目录
              </span>
              <div className="flex items-center space-x-1 text-[#4f6ef7]">
                <button 
                  onClick={() => setDrawerWidth(drawerWidth === 560 ? 420 : 560)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="分栏扩展"
                >
                  <Columns2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                <button 
                  onClick={() => setDrawerWidth(drawerWidth === 840 ? 420 : 840)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="全屏放大"
                >
                  <Maximize2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                <button 
                  onClick={() => setFloatingDrawer(null)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="关闭"
                >
                  <X className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* 目录列表（章节可折叠，步骤带类型标签） */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {directoryData.map((chapter) => {
                const isExpanded = !!expandedChapters[chapter.id];
                return (
                  <div key={chapter.id} className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/40">
                    {/* 章节标题栏（点击展开/折叠） */}
                    <button 
                      type="button"
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-100/60 hover:bg-blue-50/60 transition-colors text-left cursor-pointer border-b border-slate-100/80"
                    >
                      <span className="text-[13px] font-bold text-slate-800 truncate pr-2">
                        {chapter.chapterTitle}
                      </span>
                      <div className="flex items-center space-x-1.5 text-slate-400 shrink-0">
                        <span className="text-[11px] text-slate-400">{chapter.steps.length} 节</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`} />
                      </div>
                    </button>

                    {/* 展开的步骤列表 */}
                    {isExpanded && (
                      <div className="py-1 bg-white divide-y divide-slate-50">
                        {chapter.steps.map((step) => {
                          const isSelected = currentStepId === step.id;
                          return (
                            <div 
                              key={step.id}
                              onClick={() => handleSelectStep(chapter.chapterTitle, step)}
                              className={`flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer group ${
                                isSelected ? 'bg-blue-50/80 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center space-x-2 truncate flex-1 pr-2">
                                <span className={`truncate text-[12px] leading-relaxed ${isSelected ? 'text-blue-600 font-medium' : 'text-slate-700'}`} title={step.title}>
                                  {step.title}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1.5 shrink-0">
                                {/* 类型标签：图文、视频、实验、习题、报告 */}
                                {renderStepTag(step.tag)}

                                {/* 图文与手册步骤支持一键下载快捷按钮 */}
                                {(step.tag === '图文' || step.type === 'text') && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadResource(step.title, 'ppt');
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-blue-100/80 rounded text-slate-400 hover:text-blue-600 transition-all cursor-pointer"
                                    title="下载课件 (PPT)"
                                  >
                                    <FileDown className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {isSelected ? (
                                  <span className="text-[10px] text-blue-500 font-bold bg-white px-1 py-0.5 rounded border border-blue-200 shadow-2xs">当前</span>
                                ) : (
                                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${step.status === '已提交' ? 'border-emerald-400 bg-emerald-100/60' : 'border-slate-200'}`}></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 底部统计 */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-white text-[11px] text-slate-400 flex items-center justify-between shrink-0">
              <span>共 {directoryData.length} 章 · {directoryData.reduce((acc, c) => acc + c.steps.length, 0)} 个实训步骤</span>
              <span className="text-blue-500">点击步骤切换学习</span>
            </div>

            {/* 拖拽手柄 */}
            <ResizeHandle onMouseDown={handleMouseDownResize} />
          </aside>
        )}

        {/* 2. 笔记浮动抽屉（当资源面板打开时浮动覆盖在其上方） */}
        {floatingDrawer === 'notes' && (
          <aside 
            style={{ width: `${drawerWidth}px` }}
            className={`absolute top-0 ${isLeftNavHidden ? 'left-0' : 'left-16'} bottom-0 bg-white border-r border-slate-200/90 flex flex-col z-40 shadow-[8px_0_30px_rgba(0,0,0,0.18)] transition-none animate-in fade-in duration-150`}
          >
            {/* 笔记顶部标题与控制操作栏 */}
            <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white overflow-hidden">
              {/* 左侧：章节大标题与任务副标题 */}
              <div className="min-w-0 flex-1 pr-2.5 flex items-center space-x-2">
                <h2 className="text-[13px] sm:text-[14px] font-bold text-slate-900 tracking-tight shrink-0">
                  {activeChapter.chapterTitle}
                </h2>
                <span className="text-[11px] text-slate-500 font-normal leading-tight line-clamp-2 min-w-0">
                  {activeStep.title}
                </span>
              </div>

              {/* 右侧工具图标组：保存、分栏、全屏、关闭（蓝紫色） */}
              <div className="flex items-center space-x-1 text-[#4f6ef7] shrink-0">
                <button 
                  onClick={() => {
                    setIsNoteSaved(true);
                    setTimeout(() => setIsNoteSaved(false), 2500);
                  }}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  title="保存笔记"
                >
                  <Save className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                
                <button 
                  onClick={() => setDrawerWidth(drawerWidth === 560 ? 420 : 560)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  title="分栏/扩展宽度"
                >
                  <Columns2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                
                <button 
                  onClick={() => setDrawerWidth(drawerWidth === 840 ? 420 : 840)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  title="最大化"
                >
                  <Maximize2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>

                <button 
                  onClick={() => setFloatingDrawer(null)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                  title="关闭"
                >
                  <X className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* 富文本编辑工具条 */}
            <div className="px-3 py-1.5 border-b border-slate-200/80 bg-[#fafbfe] flex items-center space-x-1 shrink-0 text-slate-700 overflow-x-auto no-scrollbar">
              <button onClick={() => handleInsertToolbarTag('**粗体文本**')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors font-bold text-sm" title="加粗"><Bold className="w-3.5 h-3.5 stroke-[2.5]" /></button>
              <button onClick={() => handleInsertToolbarTag('<u>下划线文本</u>')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-sm" title="下划线"><Underline className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('*斜体文本*')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-sm italic" title="斜体"><Italic className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('~~删除文本~~')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-sm" title="删除线"><Strikethrough className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <div className="h-4 w-px bg-slate-300 mx-1"></div>
              <button onClick={() => handleInsertToolbarTag('### ')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors font-semibold text-sm" title="标题"><Heading className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('X<sub>2</sub>')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-xs font-mono" title="下标"><Subscript className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('X<sup>2</sup>')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors text-xs font-mono" title="上标"><Superscript className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('- 列表条目')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors" title="无序列表"><List className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('1. 列表条目')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors" title="有序列表"><ListOrdered className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => handleInsertToolbarTag('- [ ] 待办任务')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors" title="待办清单"><ListTodo className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <div className="h-4 w-px bg-slate-300 mx-1"></div>
              <button onClick={() => handleInsertToolbarTag('```python\n# 请输入代码\n```')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 transition-colors" title="插入代码块"><Code className="w-3.5 h-3.5 stroke-[2.2]" /></button>
              <button onClick={() => setIsNotePreview(prev => !prev)} className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${isNotePreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200/70'}`} title={isNotePreview ? '切换到编辑模式' : '预览排版'}><Eye className="w-3.5 h-3.5 stroke-[2.2]" /></button>
            </div>

            {/* 保存成功提示 */}
            {isNoteSaved && (
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs flex items-center border-b border-emerald-100 animate-in fade-in duration-150">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                笔记内容已成功自动同步保存
              </div>
            )}

            {/* 笔记编辑正文区域 */}
            <div className="flex-1 p-4 flex flex-col overflow-hidden bg-white">
              {isNotePreview ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {noteContent || <span className="text-slate-400">暂无内容，请点击工具栏眼睛图标返回编辑。</span>}
                </div>
              ) : (
                <textarea 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="请输入正文"
                  className="w-full flex-1 resize-none outline-none border-none text-[14px] text-slate-800 placeholder-slate-400 leading-relaxed font-sans"
                  autoFocus
                />
              )}
            </div>

            {/* 底部信息栏 */}
            <div className="px-4 py-2 border-t border-slate-100 text-[12px] text-slate-500 bg-white flex items-center justify-between shrink-0 select-none">
              <span>字数: {noteContent.length}</span>
              <span className="text-slate-400 text-[11px]">随堂笔记自动缓存</span>
            </div>

            {/* 拖拽手柄 */}
            <ResizeHandle onMouseDown={handleMouseDownResize} />
          </aside>
        )}

        {/* 4. AI学伴浮动抽屉（支持窗口增宽、左侧展示当前章节指令库、一键发送消息、收起/展开与横向拖拽） */}
        {floatingDrawer === 'ai' && (
          <aside 
            style={{ width: `${aiDrawerWidth}px` }}
            className={`absolute top-0 ${isLeftNavHidden ? 'left-0' : 'left-16'} bottom-0 bg-white border-r border-slate-200/90 flex flex-col z-40 shadow-[8px_0_30px_rgba(0,0,0,0.18)] transition-none animate-in fade-in duration-150 overflow-hidden`}
          >
            {/* 顶部控制栏（指令库展开/收起状态提示、分栏扩展、全屏放大、关闭） */}
            <div className="h-10 flex items-center justify-between px-3.5 border-b border-slate-100/90 shrink-0 bg-white text-[#4f6ef7]">
              {/* 左侧区域：当指令库收起时显示“展开指令库”快速入口，展开时显示状态标志 */}
              <div className="flex items-center space-x-2">
                {!isAiInstructionOpen ? (
                  <button 
                    onClick={() => {
                      setIsAiInstructionOpen(true);
                      if (aiDrawerWidth < 780) setAiDrawerWidth(840);
                    }}
                    className="flex items-center space-x-1.5 px-2.5 py-1 text-xs text-blue-600 bg-blue-50/80 hover:bg-blue-100 rounded-md border border-blue-200/80 transition-colors font-medium cursor-pointer shadow-2xs group"
                    title="展开当前章节指令库"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>展开指令库</span>
                    <ChevronsRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <div className="flex items-center text-xs font-semibold text-slate-700 space-x-1.5 select-none">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI 智能学习助手 · 课程指令交互</span>
                  </div>
                )}
              </div>

              {/* 右侧控制按钮：分栏切换、全屏最大化、关闭抽屉 */}
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => {
                    const normalWidth = isAiInstructionOpen ? 840 : 480;
                    setAiDrawerWidth(aiDrawerWidth >= 1080 ? normalWidth : 1120);
                  }}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="分栏扩展"
                >
                  <Columns2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                <button 
                  onClick={() => {
                    const maxWidth = Math.round(window.innerWidth * 0.88);
                    const normalWidth = isAiInstructionOpen ? 840 : 480;
                    setAiDrawerWidth(aiDrawerWidth >= maxWidth - 40 ? normalWidth : maxWidth);
                  }}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="全屏放大"
                >
                  <Maximize2 className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
                <button 
                  onClick={() => setFloatingDrawer(null)}
                  className="p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                  title="关闭"
                >
                  <X className="w-[17px] h-[17px] stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* 抽屉内容主体区域（双栏布局：左侧指令库 + 右侧对话交互区） */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* 左侧指令库展示区（默认显示，参考截图高保真实现，可点击收起） */}
              {isAiInstructionOpen && (
                <div className="w-[340px] shrink-0 border-r border-slate-200/80 bg-white flex flex-col h-full overflow-hidden select-none animate-in slide-in-from-left-2 duration-150">
                  {/* 指令库顶部导航栏（高精度还原截图：返回箭头 + 第一章：图片标注 + 蓝色高亮下划线） */}
                  <div className="h-11 px-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setIsAiInstructionOpen(false);
                          if (aiDrawerWidth > 580) setAiDrawerWidth(480);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors flex items-center cursor-pointer p-0.5"
                        title="收起指令库"
                      >
                        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      
                      {/* 章节标题与激活下划线指示条 */}
                      <div className="relative pb-1 pt-0.5">
                        <span className="text-[13px] font-bold text-blue-600 tracking-tight">
                          {defaultInstructionChapters[0].chapterTitle}
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => {
                          setIsAiInstructionOpen(false);
                          if (aiDrawerWidth > 580) setAiDrawerWidth(480);
                        }}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-2 py-1 rounded text-xs transition-colors flex items-center space-x-0.5 cursor-pointer"
                        title="收起指令库"
                      >
                        <span>收起</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 任务与指令滚动列表（100%基于截图还原灰度标题与浅蓝细边框药丸指令卡片） */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 space-y-3.5">
                    {defaultInstructionChapters[0].tasks.map((task) => (
                      <div key={task.id} className="space-y-2">
                        {/* 任务名称标题（截图中的淡灰色整齐文字） */}
                        <div className="text-slate-400 font-medium text-[12px] leading-relaxed">
                          {task.stepCode} {task.taskName}
                        </div>

                        {/* 实操任务下的指令卡片（点击后直接发送到右侧聊天窗口） */}
                        {task.instructions && task.instructions.length > 0 && (
                          <div className="space-y-2 pt-0.5">
                            {task.instructions.map((cmd) => (
                              <button
                                key={cmd.id}
                                onClick={() => handleSendAiMessage(cmd.text)}
                                className="w-full text-left bg-white hover:bg-blue-50/60 active:bg-blue-100/70 border border-[#60a5fa] hover:border-[#3b82f6] text-slate-700 hover:text-blue-700 text-xs sm:text-[12.5px] px-3.5 py-2.5 rounded-xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-[0.99] cursor-pointer block leading-normal group"
                                title="点击直接发送到聊天窗口"
                              >
                                <span>{cmd.text}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 右侧 AI 会话窗口主体（欢迎语、历史列表、问答流、专属输入框） */}
              <div className="flex-1 min-w-[360px] overflow-y-auto custom-scrollbar p-5 sm:p-6 flex flex-col justify-between bg-white">
                
                {/* 会话列表浮层（点击“会话列表”按钮后展开切换） */}
                {isAiHistoryOpen ? (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                        历史会话列表
                      </span>
                      <button 
                        onClick={() => setIsAiHistoryOpen(false)}
                        className="text-xs text-blue-600 hover:underline cursor-pointer"
                      >
                        返回当前对话
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {aiHistoryList.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            setIsAiHistoryOpen(false);
                            handleSendAiMessage(item.title);
                          }}
                          className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <span className="text-xs text-slate-700 group-hover:text-blue-600 font-medium truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0 ml-2">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 顶部科技六边立方体 Logo 与课程标题（100%还原截图） */}
                    <div className="flex flex-col items-center pt-2 pb-1">
                      <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                        <svg viewBox="0 0 54 54" className="w-11 h-11" fill="none">
                          <polygon points="27,4 47,15 47,39 27,50 7,39 7,15" stroke="#104db8" strokeWidth="5.2" strokeLinejoin="round" fill="none" />
                          <polygon points="27,17 38,23 38,36 27,42 16,36 16,23" fill="#1877f2" />
                          <line x1="27" y1="4" x2="27" y2="17" stroke="#104db8" strokeWidth="3.8" />
                          <line x1="47" y1="15" x2="38" y2="23" stroke="#104db8" strokeWidth="3.8" />
                          <line x1="47" y1="39" x2="38" y2="36" stroke="#104db8" strokeWidth="3.8" />
                          <line x1="27" y1="50" x2="27" y2="42" stroke="#104db8" strokeWidth="3.8" />
                          <line x1="7" y1="39" x2="16" y2="36" stroke="#104db8" strokeWidth="3.8" />
                          <line x1="7" y1="15" x2="16" y2="23" stroke="#104db8" strokeWidth="3.8" />
                        </svg>
                      </div>
                      <h2 className="text-[15px] sm:text-[16px] font-bold text-slate-900 tracking-tight text-center">
                        AI学伴 · 图像标注与计算机视觉实训
                      </h2>
                    </div>

                    {/* 欢迎语及推荐问题卡片（与截图完全一致） */}
                    {aiChatMessages.length === 0 ? (
                      <div className="space-y-4 pt-1">
                        {/* 欢迎语行：机器人头像 + 彩色渐变字 */}
                        <div className="flex items-center space-x-2.5">
                          {/* 浅蓝圆形科技机器人头像 */}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563eb] via-[#4f46e5] to-[#38bdf8] p-0.5 shadow-sm shrink-0 flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#1d4ed8] to-[#4338ca] flex flex-col items-center justify-center text-white">
                                <span className="text-[8px] font-black tracking-tighter leading-none">AI</span>
                                <div className="w-2 h-0.5 bg-cyan-300 rounded-full mt-0.5"></div>
                              </div>
                            </div>
                          </div>

                          <h3 className="text-[14px] sm:text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2f6bf6] to-[#6366f1] tracking-tight">
                            欢迎来到多模态智能实训平台~
                          </h3>
                        </div>

                        {/* 3 个推荐提问气泡药丸卡片 */}
                        <div className="space-y-2.5 pl-10">
                          {[
                            '请介绍下这门课程的主要内容',
                            '这门课程的主要大纲内容有哪些',
                            '如何使用OpenCV读取并显示图像属性',
                          ].map((promptText) => (
                            <button 
                              key={promptText}
                              onClick={() => handleSendAiMessage(promptText)}
                              className="w-fit max-w-[95%] px-4 py-2.5 bg-[#f1f3f7] hover:bg-[#e7ebf2] active:scale-[0.98] text-slate-700 hover:text-slate-900 text-xs sm:text-[13px] rounded-xl flex items-center space-x-2 transition-all cursor-pointer text-left shadow-2xs group"
                            >
                              <span>{promptText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* 消息对话记录 */
                      <div className="space-y-4 pt-1">
                        {aiChatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mr-2 shadow-2xs">
                                AI
                              </div>
                            )}
                            <div 
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                                msg.role === 'user' 
                                  ? 'bg-[#2f80ed] text-white rounded-br-xs shadow-xs' 
                                  : 'bg-[#f1f3f7] text-slate-800 rounded-bl-xs'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {isAiThinking && (
                          <div className="flex items-center space-x-2 text-slate-400 text-xs pl-9">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></div>
                            <span>AI学伴正在思考...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 底部操作区（会话列表/新建会话 + 大圆角输入框，100%还原截图） */}
                <div className="space-y-2.5 pt-4 shrink-0">
                  {/* 会话列表 & 新建会话按钮 */}
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setIsAiHistoryOpen(!isAiHistoryOpen)}
                      className="px-3 py-1.5 border border-[#8ea4fc] text-[#4f6ef7] hover:bg-blue-50/70 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer bg-white shadow-2xs"
                    >
                      <Clock className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>会话列表</span>
                    </button>

                    <button 
                      onClick={handleNewAiChat}
                      className="px-3 py-1.5 border border-[#8ea4fc] text-[#4f6ef7] hover:bg-blue-50/70 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer bg-white shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>新建会话</span>
                    </button>
                  </div>

                  {/* 提问输入框 */}
                  <div className="border border-slate-200/90 rounded-2xl bg-white p-3 shadow-2xs focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all flex flex-col justify-between min-h-[96px]">
                    <textarea 
                      value={aiInputText}
                      onChange={(e) => setAiInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendAiMessage(aiInputText);
                        }
                      }}
                      placeholder="点击这里开始提问，或点击左侧指令库指令直接提问..."
                      className="w-full resize-none outline-none border-none text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 leading-relaxed font-sans bg-transparent"
                      rows={2}
                    />
                    <div className="flex items-center justify-between pt-1">
                      <div></div>
                      <div className="flex items-center space-x-2">
                        <button className="text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer" title="常用提示词">
                          <Bookmark className="w-4 h-4 stroke-[2]" />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer" title="上传附件">
                          <Paperclip className="w-4 h-4 stroke-[2]" />
                        </button>
                        <button 
                          onClick={() => handleSendAiMessage(aiInputText)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            aiInputText.trim() 
                              ? 'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xs' 
                              : 'bg-[#818cf8] text-white hover:opacity-95'
                          }`}
                          title="发送提问"
                        >
                          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 拖拽手柄（支持横向拖拽改变 AI 窗口大小） */}
            <ResizeHandle onMouseDown={handleAiMouseDownResize} />
          </aside>
        )}

        {/* 3. 资源面板（与右侧内容共享界面，非浮动覆盖，支持鼠标拖拽改变左右两块内容占比；笔记与目录可覆盖在其上方） */}
        {isResourceOpen && (
          <>
            <aside 
              style={{ width: `${resourcePanelWidth}px` }}
              className="relative h-full shrink-0 bg-[#fafbfe] border-r border-slate-200/90 flex flex-col z-10 animate-in fade-in duration-150 overflow-hidden"
            >
              {/* 顶部控制栏 */}
              <div className="h-10 flex items-center justify-between px-3.5 text-[#4f6ef7] shrink-0 pt-1 border-b border-slate-100/90 bg-white">
                {openedManualBook ? (
                  <button 
                    onClick={() => setOpenedManualBook(null)}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium py-1 px-1.5 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                    title="返回资源列表"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>返回手册列表</span>
                  </button>
                ) : openedSlideBook ? (
                  <button 
                    onClick={() => setOpenedSlideBook(null)}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium py-1 px-1.5 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                    title="返回资源列表"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>返回图文列表</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-700 flex items-center">
                    <Film className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    课程资源
                  </span>
                )}

                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => {
                      const halfWidth = Math.round((window.innerWidth - 64) * 0.5);
                      setResourcePanelWidth(resourcePanelWidth === halfWidth ? 460 : halfWidth);
                    }}
                    className="p-1 rounded hover:bg-blue-50/80 transition-colors cursor-pointer"
                    title="5:5 均分左右占比"
                  >
                    <Columns2 className="w-[17px] h-[17px] stroke-[2.2]" />
                  </button>
                  
                  <button 
                    onClick={() => {
                      const largeWidth = Math.round((window.innerWidth - 64) * 0.68);
                      setResourcePanelWidth(resourcePanelWidth === largeWidth ? 460 : largeWidth);
                    }}
                    className="p-1 rounded hover:bg-blue-50/80 transition-colors cursor-pointer"
                    title="扩展左侧占比"
                  >
                    <Maximize2 className="w-[17px] h-[17px] stroke-[2.2]" />
                  </button>

                  <button 
                    onClick={() => setIsResourceOpen(false)}
                    className="p-1 rounded hover:bg-blue-50/80 transition-colors cursor-pointer"
                    title="关闭资源面板"
                  >
                    <X className="w-[17px] h-[17px] stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {/* 当处于打开手册阅读模式时，渲染实训指导书手册阅读器（100%还原截图） */}
              {openedManualBook ? (
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
                  {/* 手册阅读器顶栏工具条（精细还原截图） */}
                  <div className="h-9 bg-[#fbfcfd] border-b border-slate-200/90 flex items-center justify-between px-3 shrink-0 text-xs text-slate-600 select-none">
                    {/* 左侧控制：缩略图、搜索、页码输入、缩放控制 */}
                    <div className="flex items-center space-x-2">
                      <button className="text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-100 rounded cursor-pointer" title="页面缩略图">
                        <Columns2 className="w-3.5 h-3.5 rotate-90" />
                      </button>
                      <button className="text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-100 rounded cursor-pointer" title="全文检索">
                        <Search className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                        <input 
                          type="text" 
                          value={manualPageNum}
                          onChange={(e) => setManualPageNum(Number(e.target.value) || 1)}
                          className="w-10 h-6 text-center border border-slate-300 rounded bg-white text-xs font-mono shadow-2xs outline-none focus:border-blue-500" 
                        />
                        <span className="text-slate-400 font-mono text-[11px]">/ {manualTotalPages}</span>
                      </div>

                      <div className="h-3.5 w-px bg-slate-300 mx-0.5"></div>

                      <div className="flex items-center space-x-1 text-slate-500 font-mono">
                        <button 
                          onClick={() => setManualZoom(prev => Math.max(70, prev - 10))}
                          className="w-5 h-5 flex items-center justify-center hover:bg-slate-200/70 rounded text-slate-700 font-bold cursor-pointer"
                          title="缩小"
                        >
                          -
                        </button>
                        <span className="text-[10px] text-slate-400 w-7 text-center">{manualZoom}%</span>
                        <button 
                          onClick={() => setManualZoom(prev => Math.min(150, prev + 10))}
                          className="w-5 h-5 flex items-center justify-center hover:bg-slate-200/70 rounded text-slate-700 font-bold cursor-pointer"
                          title="放大"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* 右侧批注工具组（画笔、T字、荧光笔、插入图像、更多扩展）与下载手册按钮 */}
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <button className="p-1 hover:bg-slate-100 hover:text-blue-600 rounded cursor-pointer" title="画笔批注"><PenTool className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:bg-slate-100 hover:text-blue-600 rounded font-serif font-bold text-xs cursor-pointer" title="文本标注"><Type className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:bg-slate-100 hover:text-blue-600 rounded cursor-pointer" title="高亮标记"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:bg-slate-100 hover:text-blue-600 rounded cursor-pointer" title="插入图像"><ImageIcon className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:bg-slate-100 hover:text-blue-600 rounded cursor-pointer" title="更多工具"><ChevronsRight className="w-3.5 h-3.5" /></button>
                      
                      <div className="h-3.5 w-px bg-slate-300 mx-0.5"></div>

                      <button 
                        onClick={() => handleDownloadResource(openedManualBook.title, 'pdf')}
                        className="flex items-center space-x-1 px-2.5 py-1 bg-[#2f80ed] hover:bg-blue-600 text-white rounded text-[11px] font-medium shadow-xs transition-colors cursor-pointer"
                        title="下载实训指导书完整 PDF 手册"
                      >
                        <FileDown className="w-3.5 h-3.5 stroke-[2.2]" />
                        <span>下载手册 (PDF)</span>
                      </button>
                    </div>
                  </div>

                  {/* 手册多页纸张阅读流（灰色背景、居中白色纸张，100%还原用户截图） */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#c8ced8] p-4 sm:p-5 space-y-6">
                    {/* 第一页：封面（高精度还原截图） */}
                    <div 
                      style={{ transform: `scale(${manualZoom / 100})`, transformOrigin: 'top center' }}
                      className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.18)] mx-auto w-full max-w-[520px] aspect-[1/1.414] p-8 sm:p-10 flex flex-col justify-between relative select-text transition-transform duration-150 rounded-xs"
                    >
                      {/* 顶部公司抬头细线 */}
                      <div>
                        <div className="flex items-center justify-end pb-1 border-b border-slate-400/80">
                          <span className="text-[10px] text-slate-600 font-sans tracking-tight">北京新大陆时代科技有限公司</span>
                        </div>
                      </div>

                      {/* 居中 Logo 与标题 */}
                      <div className="flex flex-col items-center my-auto pt-4 pb-8">
                        {/* 新大陆经典蓝色几何条纹 Logo */}
                        <div className="flex items-center space-x-3 mb-12">
                          <div className="w-13 h-13 flex items-center justify-center">
                            <svg viewBox="0 0 60 60" className="w-12 h-12" fill="none">
                              <polygon points="30,4 56,30 30,56 4,30" fill="#0c63c9" />
                              <line x1="12" y1="26" x2="24" y2="38" stroke="white" strokeWidth="2.5" />
                              <line x1="16" y1="20" x2="32" y2="36" stroke="white" strokeWidth="2.5" />
                              <line x1="22" y1="14" x2="42" y2="34" stroke="white" strokeWidth="2.5" />
                              <line x1="28" y1="8" x2="48" y2="28" stroke="white" strokeWidth="2.5" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-[20px] font-black text-[#0c63c9] tracking-wider font-sans leading-none">新大陆时代科技</div>
                            <div className="text-[9px] font-bold text-[#0c63c9] tracking-[0.2em] font-sans leading-none mt-1.5 uppercase">Newland Era Hi-Tech</div>
                          </div>
                        </div>

                        {/* 指导书大标题 */}
                        <h1 className="text-[22px] sm:text-[24px] font-black text-[#0c63c9] tracking-wide text-center font-sans">
                          Python 数据可视化实训指导书
                        </h1>
                      </div>

                      {/* 底部两行蓝色口号 */}
                      <div className="flex flex-col items-center text-center pb-2">
                        <p className="text-[11px] text-[#2f6ce5] font-sans font-medium tracking-wide">
                          The wise lead The willing follow
                        </p>
                        <p className="text-[11px] text-[#2f6ce5] font-sans font-medium tracking-wide mt-1">
                          让学习者与优秀者同行
                        </p>
                      </div>
                    </div>

                    {/* 第二页：内容简介（高精度还原截图） */}
                    <div 
                      style={{ transform: `scale(${manualZoom / 100})`, transformOrigin: 'top center' }}
                      className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.18)] mx-auto w-full max-w-[520px] aspect-[1/1.414] p-8 sm:p-10 flex flex-col justify-between relative select-text transition-transform duration-150 rounded-xs"
                    >
                      {/* 顶部公司抬头细线 */}
                      <div>
                        <div className="flex items-center justify-end pb-1 border-b border-slate-400/80 mb-8">
                          <span className="text-[10px] text-slate-600 font-sans tracking-tight">北京新大陆时代科技有限公司</span>
                        </div>

                        {/* 内容简介标题 */}
                        <h2 className="text-[18px] sm:text-[19px] font-black text-[#0c63c9] tracking-widest text-center mb-8 font-sans">
                          内容简介
                        </h2>

                        {/* 正文内容 */}
                        <div className="space-y-4 text-slate-800 font-sans text-[12px] leading-[2.1] text-justify indent-7">
                          <p>
                            本实训指导书以 <span className="font-bold">Python 数据可视化核心库 Matplotlib</span> 为载体，围绕散点图这一基础图型，设计了从环境准备、参数理解、颜色映射到综合案例的完整训练路径。学习者将在 <span className="font-bold">Jupyter Notebook</span> 中以逐格运行的方式，完成 <span className="font-mono font-bold">scatter()</span> 函数核心参数、气泡图、多子图布局与趋势分析的系统训练。
                          </p>
                          <p>
                            本实训指导书在内容组织上以工程项目为主线，以「气温与冷饮销量」真实业务场景为载体，突出编程实践能力与数据思维培养，可作为高等职业院校大数据、人工智能等专业的实训教材，也可供数据可视化初学者自学使用。
                          </p>
                        </div>
                      </div>

                      {/* 底部页码 */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2.5">
                        <span>第 2 页</span>
                        <span>实训指导书 · 核心基础篇</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : openedSlideBook ? (
                /* 当处于打开图文课件模式时，在资源面板内直接展示截图所示的 PPT 查看器 */
                <div className="flex-1 flex flex-col overflow-hidden bg-[#c8ced8]">
                  <SlideViewer
                    title={`${openedSlideBook.chapterTitle} ${openedSlideBook.title}（PPT）`}
                    onBackToDirectory={() => setOpenedSlideBook(null)}
                    onDownload={() => handleDownloadResource(openedSlideBook.title, 'ppt')}
                  />
                </div>
              ) : (
                /* 常规资源 Tab 与章节资源列表 */
                <>
                  {/* 顶部 Tab 栏：4 个 Tab */}
                  <div className="px-4 pt-2 pb-2 shrink-0 bg-white border-b border-slate-100">
                    <div className="flex bg-[#f1f4fa] rounded-lg overflow-hidden p-1 shadow-inner">
                      {[
                        { key: 'text', label: '图文' },
                        { key: 'video', label: '视频' },
                        { key: 'manual', label: '手册' },
                        { key: 'file', label: '文件' },
                      ].map(tab => (
                        <button 
                          key={tab.key}
                          onClick={() => setActiveResourceTab(tab.key as any)}
                          className={`flex-1 py-1 text-[12px] sm:text-[13px] text-center relative font-medium transition-all cursor-pointer rounded-md ${
                            activeResourceTab === tab.key 
                              ? 'text-slate-800 bg-white shadow-xs font-bold' 
                              : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                          }`}
                        >
                          {tab.label}
                          {activeResourceTab === tab.key && (
                            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#2f80ed] rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 章节与资源条目列表 */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-5 py-3 space-y-6">
                    {currentChapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-3.5">
                        {/* 章节标题栏 */}
                        <div className="flex items-center">
                          <ChapterBubbleIcon />
                          <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 tracking-tight truncate">
                            {chapter.chapterTitle}
                          </h3>
                        </div>

                        {/* 章节任务条目 */}
                        <div className="space-y-3 pl-8">
                          {chapter.items.map((item) => (
                            <div 
                              key={item.id}
                              className="flex items-center justify-between group hover:bg-blue-50/50 p-1 -m-1 rounded-md transition-colors"
                            >
                              <span 
                                className="text-[12px] sm:text-[13px] text-slate-700 leading-snug truncate flex-1 pr-2 font-normal" 
                                title={item.fullTitle}
                              >
                                {item.name}
                              </span>

                              <div className="w-8 border-b border-dotted border-blue-200/90 mx-1.5 opacity-70 shrink-0"></div>

                              <div className="flex items-center space-x-1.5 shrink-0">
                                <button 
                                  onClick={() => {
                                    if (item.type === 'video') {
                                      setCurrentStepId('1-4');
                                      setIsPlaying(true);
                                      triggerSwitchToast(chapter.chapterTitle, item.fullTitle);
                                    } else if (item.type === 'manual') {
                                      setOpenedManualBook({
                                        title: item.fullTitle || item.name,
                                        subtitle: chapter.chapterTitle
                                      });
                                    } else if (item.type === 'text') {
                                      setOpenedSlideBook({
                                        chapterTitle: chapter.chapterTitle,
                                        title: item.fullTitle || item.name
                                      });
                                    } else if (item.type === 'file') {
                                      handleDownloadResource(item.fullTitle || item.name, 'file');
                                    } else {
                                      setPreviewItem(item);
                                    }
                                  }}
                                  className="px-2.5 py-0.5 text-xs text-[#2f80ed] border border-[#2f80ed] hover:bg-[#2f80ed] hover:text-white rounded-full transition-all duration-150 font-normal bg-white shadow-2xs active:scale-95 cursor-pointer"
                                >
                                  {item.type === 'video' ? '播放' : (item.type === 'file' ? '下载' : '查看')}
                                </button>

                                {/* 图文和手册除支持查看外，还支持下载 */}
                                {(item.type === 'text' || item.type === 'manual') && (
                                  <button 
                                    onClick={() => handleDownloadResource(item.fullTitle || item.name, item.type === 'text' ? 'ppt' : 'pdf')}
                                    className="px-2 py-0.5 text-xs text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-full transition-all duration-150 font-normal bg-slate-50 hover:bg-blue-50 shadow-2xs active:scale-95 cursor-pointer flex items-center space-x-0.5"
                                    title={`下载${item.type === 'text' ? '课件 (PPT)' : '手册 (PDF)'}`}
                                  >
                                    <FileDown className="w-3 h-3" />
                                    <span>下载</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 抽屉底部统计信息 */}
                  <div className="px-4 py-2.5 border-t border-slate-100 bg-white/80 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
                    <span>共 {currentChapters.reduce((acc, c) => acc + c.items.length, 0)} 项资源</span>
                    <span className="text-blue-500">点击按钮在线交互</span>
                  </div>
                </>
              )}
            </aside>

            {/* 左右分栏拖拽手柄：按住鼠标左右拖动改变左右两块内容占比 */}
            <div 
              onMouseDown={handleResourceMouseDownResize}
              className={`w-2 -ml-1 -mr-1 z-30 cursor-col-resize flex items-center justify-center select-none group transition-colors hover:bg-blue-500/20 active:bg-blue-600/30 ${
                isDraggingResource ? 'bg-blue-500/30' : ''
              }`}
              title="按住鼠标左右拖动，调整资源面板与右侧内容占比"
            >
              <div className={`w-[3px] h-12 rounded-full transition-colors shadow-xs ${
                isDraggingResource ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-blue-500'
              }`} />
            </div>
          </>
        )}

        {/* 主视窗区域：与左侧打开的资源面板共享视窗空间，自适应伸缩 */}
        <div className="flex-1 min-w-0 flex flex-col relative z-0 bg-[#181a20] overflow-hidden">
          
          {/* 场景 A：视频步骤类型（当前选中的是 1-4 等视频任务）—— 完美参考截图呈现 JupyterLab 实操视频播放器 */}
          {activeStep.type === 'video' ? (
            <div className="flex-1 flex flex-col bg-[#1e2026] relative overflow-hidden select-none">
              
              {/* 模拟全屏视频画面（JupyterLab 实操课录像） */}
              <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden relative">
                
                {/* 1. 模拟浏览器上边框与标签栏 */}
                <div className="h-9 bg-[#dfe2e7] flex items-center justify-between px-3 border-b border-[#cbd0d8] shrink-0 text-xs text-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <div className="px-3 py-1 bg-[#f0f2f5] rounded-t-md font-medium text-slate-800 text-[11px] flex items-center space-x-1.5 shadow-2xs">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span>JupyterLab</span>
                      <X className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer ml-1" />
                    </div>
                    <div className="px-3 py-1 text-slate-500 hover:bg-slate-200/60 rounded-t-md text-[11px] flex items-center space-x-1.5 cursor-pointer">
                      <span>人工智能教学实验平台</span>
                    </div>
                  </div>

                  {/* 窗口操作按钮 */}
                  <div className="flex items-center space-x-2 text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                </div>

                {/* 2. 模拟浏览器地址栏 */}
                <div className="h-8 bg-white border-b border-slate-200 flex items-center px-3 space-x-2 text-xs shrink-0">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <ChevronsRight className="w-3.5 h-3.5" />
                    <RotateCcw className="w-3 h-3" />
                  </div>
                  <div className="flex-1 bg-[#f1f3f6] rounded px-3 py-1 text-slate-600 text-[11px] font-mono flex items-center justify-between">
                    <span className="truncate">🔒 jh.nlecloud.com:30002/user/eric/lab/tree/nlpbasic/项目介绍.ipynb</span>
                    <span className="text-[10px] text-slate-400 shrink-0">CPU: 0% | Mem: 256 / 8192 MB</span>
                  </div>
                </div>

                {/* 3. JupyterLab 顶部菜单条 */}
                <div className="h-7 bg-[#ededed] border-b border-slate-300/80 flex items-center px-3 space-x-3 text-[11px] text-slate-700 shrink-0">
                  {['File', 'Edit', 'View', 'Run', 'Kernel', 'Git', 'Tabs', 'Settings', 'Help'].map(m => (
                    <span key={m} className="hover:bg-slate-200 px-1 py-0.5 rounded cursor-pointer">{m}</span>
                  ))}
                </div>

                {/* 4. JupyterLab 页面主体（左侧文件树，右侧 Notebook 文档） */}
                <div className="flex-1 flex overflow-hidden">
                  
                  {/* 左侧活动文件栏 */}
                  <div className="w-56 bg-[#f7f7f7] border-r border-slate-200 flex flex-col shrink-0 text-xs text-slate-700 select-none">
                    <div className="p-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 bg-white">
                      <span className="font-mono">/ nlpbasic /</span>
                      <Folder className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-[11px]">
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-600 hover:bg-slate-200/60 cursor-pointer">
                        <Folder className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span>data</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-600 hover:bg-slate-200/60 cursor-pointer">
                        <Folder className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span>models</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-600 hover:bg-slate-200/60 cursor-pointer">
                        <Folder className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span>result</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-700 hover:bg-slate-200/60 cursor-pointer">
                        <FileCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">任务1: 文本预处理.ipynb</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-700 hover:bg-slate-200/60 cursor-pointer">
                        <FileCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">任务2: 中文文本处理.ipynb</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-700 hover:bg-slate-200/60 cursor-pointer">
                        <FileCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">任务3: 关键词提取.ipynb</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#0366d6] text-white font-medium shadow-2xs">
                        <FileCode className="w-3.5 h-3.5 text-amber-300" />
                        <span className="truncate">项目介绍.ipynb</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded text-slate-500 hover:bg-slate-200/60 cursor-pointer">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">zhwiki-2023.txt</span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧 Notebook 内容区（高精度还原截图） */}
                  <div className="flex-1 bg-white overflow-y-auto p-8 border-l border-slate-200 flex flex-col relative">
                    
                    {/* 活动单元格侧边蓝条 */}
                    <div className="absolute left-1 top-8 bottom-8 w-1 bg-[#2196f3] rounded-full"></div>

                    {/* 课件 Notebook 文本内容 */}
                    <div className="max-w-3xl space-y-6 text-slate-800 font-sans pl-2">
                      <h1 className="text-3xl font-black text-slate-900 tracking-tight pb-1">
                        项目一：NLP基础
                      </h1>

                      <div className="space-y-2">
                        <h2 className="text-xl font-bold text-slate-800">
                          项目背景：
                        </h2>
                        <p className="text-[13px] text-slate-700 leading-relaxed indent-2 text-justify">
                          自然语言处理是目前人工智能领域内的一个很重要的方向。它的目的是实现人和计算机程序之间使用自然语言（汉语、英语等语言）进行有效通信。本项目通过四个任务分别介绍了字符串处理、正则表达式、英文文本处理、中文文本处理、分词、词性标注、关键词提取、文本向量化等知识，为接下来的其他NLP项目的学习打好坚实基础。
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-800">
                          任务列表：
                        </h2>
                        <p className="text-[13px] text-slate-600 font-medium">
                          本教学分为4个部分，总计有4份教学任务notebook:
                        </p>
                        <div className="space-y-1.5 pl-2 text-[13px] text-[#0366d6] font-medium">
                          <p className="hover:underline cursor-pointer">任务1: 文本预处理</p>
                          <p className="hover:underline cursor-pointer">任务2: 中文文本处理与解析</p>
                          <p className="hover:underline cursor-pointer">任务3: 关键词提取</p>
                          <p className="hover:underline cursor-pointer">任务4: 文本向量化</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h2 className="text-xl font-bold text-slate-800">
                          文件夹用途说明：
                        </h2>
                        <ul className="list-disc list-inside space-y-1 text-[13px] text-slate-700">
                          <li><span className="font-semibold text-slate-800 font-mono">data:</span> 存放任务所需要的数据集等文件；</li>
                          <li><span className="font-semibold text-slate-800 font-mono">models:</span> 存放任务保存的模型；</li>
                          <li><span className="font-semibold text-slate-800 font-mono">result:</span> 存放实验输出的结果文件。</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 画面未播放时，居中浮动醒目的播放大按钮 */}
                {!isPlaying && (
                  <div 
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center cursor-pointer group z-10 transition-all"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#2f80ed]/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#2f80ed] transition-all">
                      <Play className="w-9 h-9 fill-current ml-1" />
                    </div>
                    <span className="absolute bottom-16 text-white/90 text-sm font-medium tracking-wide bg-black/60 px-4 py-1.5 rounded-full shadow-lg">
                      点击播放本节微课教学视频（{activeStep.title}）
                    </span>
                  </div>
                )}

                {/* 5. 视频播放器控制条 */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-6 pb-2.5 px-4 text-white flex flex-col justify-end transition-opacity duration-200">
                  
                  {/* 可拖拽交互的视频时间轴进度条 */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      setCurrentTimeSec(Math.floor(ratio * totalDurationSec));
                    }}
                    className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full mb-3 cursor-pointer relative group transition-all"
                  >
                    {/* 已播放进度条 */}
                    <div 
                      style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                      className="h-full bg-blue-500 rounded-full relative"
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>

                  {/* 底部控制工具组 */}
                  <div className="flex items-center justify-between text-xs text-white/90">
                    
                    {/* 左侧：播放/暂停、播放时长 */}
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-blue-400 transition-colors p-1 cursor-pointer"
                        title={isPlaying ? '暂停' : '播放'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>

                      {/* 时间显示（截图所示格式：0:00 / 1:09:07） */}
                      <span className="font-mono text-sm tracking-wide text-white">
                        {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
                      </span>
                    </div>

                    {/* 中间信息 */}
                    <div className="hidden md:flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                      <span>Python 3 | Idle</span>
                      <span>Mem: 256.48 / 8192.00 MB</span>
                    </div>

                    {/* 右侧：倍速、音量、全屏 */}
                    <div className="flex items-center space-x-3.5">
                      {/* 倍速切换 */}
                      <div className="flex items-center space-x-1 bg-white/10 px-2 py-0.5 rounded text-[11px]">
                        {[1.0, 1.25, 1.5, 2.0].map(speed => (
                          <button 
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${playbackSpeed === speed ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>

                      {/* 音量调节 */}
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="hover:text-blue-400 transition-colors cursor-pointer"
                        title={isMuted ? '取消静音' : '静音'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* 全屏按钮 */}
                      <button 
                        onClick={() => setIsPlayerFullscreen(!isPlayerFullscreen)}
                        className="hover:text-blue-400 transition-colors cursor-pointer"
                        title="全屏"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ) : activeStep.type === 'lab' ? (
            
            /* 场景 B：实验步骤类型（支持启动界面[截图1]、工程虚拟仿真[截图3]、Jupyter环境[截图2]与入口卡片） */
            labPhase === 'launching' ? (
              /* ================== 子场景 1：启动中界面（参考截图1） ================== */
              <div className="flex-1 flex flex-col relative bg-[#1c2430] overflow-hidden select-none">
                {/* 顶部深色工具条 */}
                <div className="h-9 bg-[#2b333e] flex items-center justify-end px-4 space-x-3 shrink-0 border-b border-black/30 z-20">
                  <button 
                    onClick={() => setIsLabFullscreen(!isLabFullscreen)}
                    className="text-slate-300 hover:text-white p-1 rounded transition-colors cursor-pointer"
                    title={isLabFullscreen ? '退出全屏' : '全屏'}
                  >
                    {isLabFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleExitLabEnvironment}
                    className="text-emerald-400 hover:text-emerald-300 p-1 rounded transition-colors cursor-pointer"
                    title="退出启动"
                  >
                    <Power className="w-4 h-4 stroke-[2.4]" />
                  </button>
                </div>

                {/* 科技感全息实验室背景 */}
                <div 
                  className="flex-1 flex flex-col items-center justify-center relative bg-cover bg-center"
                  style={{ 
                    backgroundImage: "url('/lab_launch_bg.png')",
                    backgroundColor: '#0c1a2e'
                  }}
                >
                  <div className="absolute inset-0 bg-blue-950/40 backdrop-brightness-90"></div>

                  {/* 居中浮动状态卡片与启动指示 */}
                  <div className="flex flex-col items-center z-10 -mt-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* 启动中胶囊条：● 启动中，请稍后... 3s */}
                    <div className="bg-[#4b5563]/85 backdrop-blur-md border border-white/20 px-5 py-1.5 rounded-md flex items-center space-x-2 text-white text-xs font-mono shadow-xl mb-6">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                      <span className="text-[#10b981] font-medium">启动中，请稍后...</span>
                      <span className="text-white/95">{launchCountdown}s</span>
                    </div>

                    {/* 悬浮缩略预览卡片 */}
                    <div className="w-[280px] h-[165px] rounded-lg overflow-hidden border border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.35)] bg-slate-900/90 flex flex-col relative">
                      <div className="h-5 bg-slate-800/95 border-b border-slate-700 flex items-center px-2 space-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400/80"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400/80"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400/80"></div>
                        <span className="text-[9px] text-slate-400 pl-1">
                          {activeLabTool?.iconType === 'simulation' ? 'Virtual Simulation Engine' : 'JupyterLab / AI Container'}
                        </span>
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between font-mono text-[9.5px] text-slate-300">
                        <div className="space-y-1">
                          <div className="text-cyan-400 font-semibold">&gt;&gt; Initializing environment core...</div>
                          <div className="text-slate-400">&gt;&gt; Loading circuit &amp; hardware models [OK]</div>
                          <div className="text-slate-400">&gt;&gt; Connecting simulator websocket daemon [OK]</div>
                          <div className="text-emerald-400">&gt;&gt; Ready. Launching interactive console...</div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-800 pt-1 text-[8px] text-slate-500">
                          <span>Sandbox v3.4.1</span>
                          <span className="text-cyan-400">Node Online</span>
                        </div>
                      </div>
                    </div>

                    {/* 卡片下方文字 */}
                    <div className="mt-4 text-white font-medium text-base tracking-wide drop-shadow-md">
                      {activeLabTool?.name || 'Jupyter'}
                    </div>
                  </div>
                </div>
              </div>
            ) : labPhase === 'running' && activeLabTool?.iconType === 'simulation' ? (
              /* ================== 子场景 2：工程虚拟仿真实验环境（参考截图3） ================== */
              <div className="flex-1 flex flex-col relative bg-white overflow-hidden select-none">
                {/* 顶栏深色 Tab 条 */}
                <div className="h-9 bg-[#2c3440] flex items-center justify-between px-2 shrink-0 border-b border-black/40 z-20">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleExitLabEnvironment}
                      className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white cursor-pointer" 
                      title="返回工具入口"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                    {/* 选项卡 */}
                    <div className="h-7 px-3 bg-[#3a4454] rounded-t flex items-center space-x-2 text-white text-xs border-t-2 border-blue-500 shadow-xs">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">
                        ⬡
                      </div>
                      <span className="font-normal">工程虚拟仿真</span>
                      <button 
                        onClick={handleExitLabEnvironment}
                        className="text-slate-400 hover:text-red-400 ml-1 cursor-pointer"
                        title="关闭仿真环境"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* 右侧全屏与电源按钮 */}
                  <div className="flex items-center space-x-3 pr-2">
                    <button 
                      onClick={() => setIsLabFullscreen(!isLabFullscreen)}
                      className="text-slate-300 hover:text-white p-1 transition-colors cursor-pointer"
                      title={isLabFullscreen ? '退出全屏' : '全屏'}
                    >
                      {isLabFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={handleExitLabEnvironment}
                      className="text-emerald-400 hover:text-emerald-300 p-1 transition-colors cursor-pointer"
                      title="退出仿真环境"
                    >
                      <Power className="w-4 h-4 stroke-[2.4]" />
                    </button>
                  </div>
                </div>

                {/* 顶部操作工具条 (Toolbar) */}
                <div className="h-9 bg-[#f8f9fa] border-b border-[#e9ecef] flex items-center justify-between px-3 text-xs text-slate-600 shrink-0">
                  {/* 左侧操作按钮组 */}
                  <div className="flex items-center space-x-1.5">
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer" title="撤销">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-3.5 w-px bg-slate-300 mx-1"></div>
                    {['对齐', '图层', '成组', '复制', '删除', '清空'].map((item) => (
                      <button key={item} className="px-2 py-0.5 hover:bg-slate-200 rounded text-slate-600 cursor-pointer text-[11px]">
                        {item}
                      </button>
                    ))}
                  </div>

                  {/* 右侧智能体助手与场景切换 */}
                  <div className="flex items-center space-x-3">
                    <div 
                      onClick={() => alert('实验智能体：正在为您监测拓扑连线完整度。当前电路：12V电源供电正常，门禁控制器就绪。')}
                      className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full cursor-pointer border border-blue-200/60 shadow-2xs transition-colors"
                    >
                      <span className="text-[11px] font-medium">实验智能体</span>
                      <span className="text-xs">🤖</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] text-slate-700 cursor-pointer">
                      <span>默认场景</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* 主体区：左侧设备库 + 右侧连线画布 */}
                <div className="flex-1 flex overflow-hidden">
                  {/* 左侧：仿真设备列表 */}
                  <div className="w-52 bg-white border-r border-[#e9ecef] flex flex-col shrink-0">
                    <div className="h-9 px-3 border-b border-[#e9ecef] flex items-center font-bold text-xs text-slate-800">
                      <span className="mr-1.5 text-blue-600">⬡</span> 仿真设备
                    </div>
                    {/* 搜索框 */}
                    <div className="p-2 border-b border-[#e9ecef]">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs">
                        <input 
                          type="text" 
                          value={simSearchText}
                          onChange={(e) => setSimSearchText(e.target.value)}
                          placeholder="请输入组件名" 
                          className="w-full outline-none text-[11px] bg-transparent text-slate-700 placeholder:text-slate-400"
                        />
                        <Search className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                      </div>
                    </div>

                    {/* 分类折叠列表 */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {[
                        { title: '传感器', items: ['红外传感器', '温湿度传感器', '光敏电阻'] },
                        { title: '采集器', items: ['多路采集模块', 'AD转换器'] },
                        { title: 'RFID', items: ['低频读写头', '高频射频卡'] },
                        { title: '其他设备', items: ['12V直流电源', '5V变压器', '蜂鸣器'] },
                        { title: '环境参数', items: ['光照度检测', '烟雾探头'] },
                        { title: '智慧家居', items: ['智能窗帘电机', '遥控中继器'] },
                        { title: '智慧安防', items: ['门禁键盘读卡器', '电磁锁', '网络通信模块'] },
                        { title: '智慧农业', items: ['土壤水分传感器', '灌溉电磁阀'] },
                        { title: '智慧交通', items: ['地磁车辆检测器', '道闸控制器'] },
                        { title: '智慧建筑能耗', items: ['智能电表', '多功能电力仪表'] },
                      ].map((cat) => {
                        const isOpen = expandedSimCategory === cat.title;
                        return (
                          <div key={cat.title}>
                            <div 
                              onClick={() => setExpandedSimCategory(isOpen ? '' : cat.title)}
                              className="px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer font-medium text-slate-700 text-[11.5px]"
                            >
                              <span>{cat.title}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                            {isOpen && (
                              <div className="bg-slate-50/70 px-3 py-1 space-y-1">
                                {cat.items.map((item) => (
                                  <div 
                                    key={item}
                                    onClick={() => alert(`已选择组件：${item}`)}
                                    className="px-2 py-1 rounded hover:bg-blue-50 hover:text-blue-600 cursor-grab text-[11px] text-slate-600 transition-colors"
                                  >
                                    • {item}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 右侧：网格拓扑连线仿真画布 */}
                  <div className="flex-1 flex flex-col bg-[#fdfdfd] relative overflow-hidden">
                    {/* 画布顶栏状态 */}
                    <div className="h-8 bg-white/80 backdrop-blur-xs border-b border-slate-200 flex items-center justify-between px-4 text-xs shrink-0 z-10">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-blue-600 font-medium cursor-pointer">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-500" />
                          连线验证 (已开启)
                          <ChevronDown className="w-3 h-3 ml-0.5" />
                        </div>
                      </div>

                      {/* 中间模拟实验切换开关 */}
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setIsSimRunning(!isSimRunning)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${isSimRunning ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          title="切换模拟实验状态"
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${isSimRunning ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-xs font-medium ${isSimRunning ? 'text-emerald-600' : 'text-slate-500'}`}>
                          模拟实验({isSimRunning ? '已开启' : '已关闭'})
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                        <span className="hover:text-blue-600 cursor-pointer">虚拟仿真助手</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>

                    {/* 画布底图与高仿真拓扑 */}
                    <div 
                      className="flex-1 relative overflow-auto bg-cover bg-no-repeat bg-center"
                      style={{ 
                        backgroundImage: "url('/lab_env_simulation.png')",
                        backgroundSize: '100% 100%'
                      }}
                    >
                      {/* 开启模拟时的动态光效指示层 */}
                      {isSimRunning && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-20 left-[35%] bg-emerald-500/10 border border-emerald-500/30 rounded px-3 py-1 text-[11px] font-mono text-emerald-700 shadow-sm animate-pulse">
                            ⚡ 仿真电流正在流转: 12V 稳压输出正常 | 信号响应延迟 &lt; 2ms
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : labPhase === 'running' ? (
              /* ================== 子场景 3：JupyterLab 容器实验环境（参考截图2） ================== */
              <div className="flex-1 flex flex-col relative bg-white overflow-hidden select-none">
                {/* 顶栏深灰标签栏 */}
                <div className="h-9 bg-[#2c3440] flex items-center justify-between px-2 shrink-0 border-b border-black/40 z-20">
                  <div className="flex items-center h-full">
                    <div className="h-7 px-3 bg-[#3a4454] rounded-t flex items-center space-x-2 text-white text-xs border-t-2 border-blue-500 shadow-xs">
                      <div className="w-3.5 h-3.5 bg-blue-500 rounded-[2px] flex items-center justify-center text-[9px] font-bold text-white">
                        ≡
                      </div>
                      <span className="font-normal truncate max-w-[200px]">人工智能平台-...</span>
                      <button 
                        onClick={handleExitLabEnvironment}
                        className="text-slate-400 hover:text-red-400 ml-1 cursor-pointer"
                        title="关闭环境"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* 右侧：全屏与退出电源按钮 */}
                  <div className="flex items-center space-x-3 pr-2">
                    <button 
                      onClick={() => setIsLabFullscreen(!isLabFullscreen)}
                      className="text-slate-300 hover:text-white p-1 transition-colors cursor-pointer"
                      title={isLabFullscreen ? '退出全屏' : '全屏'}
                    >
                      {isLabFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={handleExitLabEnvironment}
                      className="text-emerald-400 hover:text-emerald-300 p-1 transition-colors cursor-pointer"
                      title="退出实验环境并返回工具列表"
                    >
                      <Power className="w-4 h-4 stroke-[2.4]" />
                    </button>
                  </div>
                </div>

                {/* 菜单栏 (JupyterLab Menu Bar) */}
                <div className="h-7 bg-[#f7f7f7] border-b border-[#e0e0e0] flex items-center justify-between px-2 text-xs text-slate-700 shrink-0">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 relative flex items-center justify-center mr-1">
                      <div className="w-3 h-1.5 border-t-2 border-b-2 border-[#fa8c16] rounded-[50%]"></div>
                      <div className="w-0.5 h-0.5 rounded-full bg-[#fa8c16] absolute top-0.5 right-0.5"></div>
                    </div>
                    {['File', 'Edit', 'View', 'Run', 'Kernel', 'Git', 'Nbgrader', 'Tabs', 'Settings', 'Help'].map(m => (
                      <button key={m} className="px-2 py-0.5 hover:bg-slate-200 rounded text-slate-700 cursor-pointer font-normal text-[11.5px]">
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-600 pr-3 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <span>CPU:</span>
                      <div className="w-16 h-2.5 bg-white border border-slate-300 rounded-[2px] overflow-hidden p-[0.5px]">
                        <div className="w-[20%] h-full bg-[#0366d6]"></div>
                      </div>
                      <span>20%</span>
                    </div>
                    <div className="h-3 w-px bg-slate-300"></div>
                    <div>Mem:120 MB</div>
                  </div>
                </div>

                {/* 主工作区 */}
                <div className="flex-1 flex overflow-hidden">
                  {/* 左侧 Activity Bar 窄边栏 */}
                  <div className="w-9 bg-[#f0f0f0] border-r border-[#e0e0e0] flex flex-col items-center py-2 space-y-3 shrink-0 text-slate-600">
                    <button className="w-full py-1.5 border-l-2 border-[#1976d2] text-[#1976d2] flex justify-center bg-white/60">
                      <Folder className="w-4 h-4" />
                    </button>
                    <button className="w-full py-1.5 text-slate-400 hover:text-slate-700 flex justify-center">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="w-full py-1.5 text-slate-400 hover:text-slate-700 flex justify-center">
                      <Code className="w-4 h-4" />
                    </button>
                    <button className="w-full py-1.5 text-slate-400 hover:text-slate-700 flex justify-center">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 左侧 File Browser 文件树列表 */}
                  <div className="w-56 bg-white border-r border-[#e0e0e0] flex flex-col shrink-0">
                    <div className="h-8 border-b border-[#e0e0e0] flex items-center justify-between px-2 text-slate-600">
                      <button className="p-1 hover:bg-slate-100 rounded text-blue-600 font-bold text-sm cursor-pointer" title="新建 Launcher">
                        +
                      </button>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <button className="p-1 hover:bg-slate-100 rounded cursor-pointer" title="新建文件夹">
                          <FolderPlus className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded cursor-pointer" title="上传文件">
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded cursor-pointer" title="刷新列表">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-1.5 border-b border-[#e0e0e0]">
                      <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-0.5 text-xs">
                        <input 
                          type="text" 
                          placeholder="Filter files by name" 
                          className="w-full outline-none text-[11px] text-slate-700 placeholder:text-slate-400"
                        />
                        <Search className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                      </div>
                    </div>

                    <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 border-b border-slate-100 flex items-center">
                      <Folder className="w-3 h-3 text-blue-500 mr-1.5" />
                      /
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <div className="flex items-center justify-between px-2.5 py-1 text-[10px] text-slate-400 font-medium border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center">
                          <span>Name</span>
                          <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                        </div>
                        <span>Last Modified</span>
                      </div>

                      <div className="px-1 py-1">
                        <div className="flex items-center justify-between px-2 py-1 hover:bg-blue-50/80 rounded text-xs cursor-pointer group">
                          <div className="flex items-center text-slate-700 font-normal">
                            <Folder className="w-3.5 h-3.5 text-amber-500 mr-2 fill-amber-500/20" />
                            <span className="text-[11.5px]">Desktop</span>
                          </div>
                          <span className="text-[10px] text-slate-400">a year ago</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1 hover:bg-blue-50/80 rounded text-xs cursor-pointer group">
                          <div className="flex items-center text-slate-700 font-normal">
                            <FileCode className="w-3.5 h-3.5 text-blue-500 mr-2" />
                            <span className="text-[11.5px]">nlp_task_experiment.ipynb</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Just now</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 中间主工作区：Terminal 选项卡与交互控制台 */}
                  <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    <div className="h-7 bg-[#f0f0f0] border-b border-[#e0e0e0] flex items-center px-1 space-x-1 shrink-0">
                      <div className="h-6 px-3 bg-white border-t-2 border-slate-800 border-x border-slate-200 flex items-center space-x-2 text-xs text-slate-800 shadow-2xs">
                        <div className="w-3 h-3 bg-slate-800 rounded-[1px] flex items-center justify-center text-[8px] text-white">
                          &gt;
                        </div>
                        <span className="text-[11px] font-mono text-slate-700">jovyan@dp-pro-ai-jupyter-15396005420-69fc65468d-mzb24: ~</span>
                        <span className="text-slate-400 hover:text-slate-700 cursor-pointer text-xs ml-1">×</span>
                      </div>
                      <button className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded text-xs" title="新建终端/窗口">
                        +
                      </button>
                    </div>

                    <div 
                      className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-white cursor-text"
                      onClick={() => {
                        const inputEl = document.getElementById('jupyter-term-input');
                        if (inputEl) inputEl.focus();
                      }}
                    >
                      {terminalLogs.map((log, index) => (
                        <div key={index} className="mb-2 leading-relaxed">
                          <div>
                            <span className="text-green-600 font-semibold">jovyan@dp-pro-ai-jupyter-15396005420-69fc65468d-mzb24</span>:
                            <span className="text-blue-600 font-semibold">~</span>$ {log.cmd}
                          </div>
                          {log.res && <div className="text-slate-600 whitespace-pre-wrap mt-0.5">{log.res}</div>}
                        </div>
                      ))}

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const cmd = terminalCmd.trim();
                          if (!cmd) return;
                          let response = '';
                          if (cmd === 'ls') {
                            response = 'Desktop/  nlp_task_experiment.ipynb  data/  models/';
                          } else if (cmd === 'pwd') {
                            response = '/home/jovyan';
                          } else if (cmd === 'python --version' || cmd === 'python -V') {
                            response = 'Python 3.10.12 (main, Nov 20 2023, 15:14:05) [GCC 11.4.0]';
                          } else if (cmd === 'clear') {
                            setTerminalLogs([]);
                            setTerminalCmd('');
                            return;
                          } else if (cmd === 'help') {
                            response = '可用命令: ls, pwd, python --version, clear, whoami, help';
                          } else if (cmd === 'whoami') {
                            response = 'jovyan';
                          } else {
                            response = `bash: ${cmd}: command not found. (可尝试输入: ls, pwd, python --version, clear)`;
                          }
                          setTerminalLogs(prev => [...prev, { cmd, res: response }]);
                          setTerminalCmd('');
                        }}
                        className="flex items-center flex-wrap leading-relaxed"
                      >
                        <span className="text-green-600 font-semibold">jovyan@dp-pro-ai-jupyter-15396005420-69fc65468d-mzb24</span>:
                        <span className="text-blue-600 font-semibold">~</span>$&nbsp;
                        <input 
                          id="jupyter-term-input"
                          type="text" 
                          value={terminalCmd}
                          onChange={(e) => setTerminalCmd(e.target.value)}
                          className="flex-1 outline-none bg-transparent font-mono text-xs text-slate-800 border-none p-0 focus:ring-0 min-w-[120px]"
                          autoFocus
                          spellCheck={false}
                        />
                        <span className="inline-block w-1.5 h-3.5 bg-black align-middle animate-pulse ml-0.5"></span>
                      </form>
                    </div>
                  </div>

                  {/* 右侧边栏窄条：Create Assignment */}
                  <div className="w-7 bg-[#f7f7f7] border-l border-[#e0e0e0] flex flex-col items-center py-4 justify-between shrink-0 text-slate-400">
                    <div className="p-1 hover:text-slate-700 cursor-pointer">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[10px] text-slate-500 tracking-widest [writing-mode:vertical-rl] rotate-180 select-none font-medium py-2">
                      Create Assignment
                    </div>
                    <div className="p-1 hover:text-slate-700 cursor-pointer">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* 底部悬浮 AI 小助手机器人 */}
                <div className="fixed bottom-9 right-8 z-30 pointer-events-auto">
                  <div 
                    className="w-10 h-10 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-slate-200 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    title="AI 助教"
                    onClick={() => alert('AI 助教已就绪：您可以随时咨询关于本实验的代码调试与环境配置问题。')}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                      🤖
                    </div>
                  </div>
                </div>

                {/* 底部状态栏 */}
                <div className="h-5 bg-[#f2f2f2] border-t border-[#e0e0e0] flex items-center justify-between px-3 text-[10px] text-slate-500 shrink-0 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1">
                      <span>Simple</span>
                      <span className="w-5 h-2.5 bg-slate-300 rounded-full inline-block relative cursor-pointer">
                        <span className="w-2 h-2 bg-white rounded-full absolute top-[1px] left-[1px]"></span>
                      </span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>Ln 1, Col 1</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span>jovyan@dp-pro-ai-jupyter-15396005420-69fc65468d-mzb24</span>
                    <span className="text-slate-300">|</span>
                    <span>Mem: 120.37 MB</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ================== 子场景 0：实验工具入口卡片列表（参考截图展示多个实验环境） ================== */
              <div className="flex-1 flex flex-col relative bg-[#fcfdfe] overflow-y-auto min-h-0 select-none">
                {/* 顶部居中标题：🛠️ 实验工具 */}
                <div className="pt-16 pb-12 flex items-center justify-center">
                  <div className="flex items-center gap-2.5 text-slate-800 font-bold text-xl tracking-wide">
                    <span className="text-xl">🛠️</span>
                    <span>实验工具</span>
                  </div>
                </div>

                {/* 实验入口卡片列表（并排居中展示多个入口卡片） */}
                <div className="flex-1 flex items-start justify-center px-8 pb-16">
                  <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl">
                    {getLabToolsForStep(activeStep.id).map(tool => (
                      <LabToolCard 
                        key={tool.id} 
                        tool={tool} 
                        onEnter={handleEnterLabEnvironment} 
                      />
                    ))}
                  </div>
                </div>

                {/* 页面右下角：黄色圆形信息图标（参考截图右下角） */}
                <div className="fixed bottom-6 right-8 z-20">
                  <button 
                    className="w-5 h-5 rounded-full bg-[#fa8c16] hover:bg-[#d46b08] text-white flex items-center justify-center text-xs font-serif font-bold italic shadow-xs cursor-pointer transition-transform hover:scale-110"
                    title="实验环境说明与指引"
                    onClick={() => alert('实验环境使用指南：点击卡片右下角“进入实验环境”即可分配容器或进入仿真平台。')}
                  >
                    i
                  </button>
                </div>
              </div>
            )
          ) : activeStep.type === 'report' || activeStep.tag === '报告' ? (
            /* ================== 场景 D：实验报告类型步骤（高精度参考用户截图） ================== */
            <div className={`flex-1 flex flex-col bg-white overflow-hidden relative ${isReportFullscreen ? 'fixed inset-0 z-50' : ''}`}>
              
              {/* 报告工作区主体：左侧可折叠大纲，右侧双栏编辑器 */}
              <div className="flex-1 flex overflow-hidden relative">
                
                {/* 1. 左侧实验报告大纲侧栏（支持折叠/展开，带把手） */}
                {reportSidebarOpen ? (
                  <div className="w-60 sm:w-64 bg-[#fcfdfe] border-r border-slate-200/90 flex flex-col shrink-0 relative select-none animate-in fade-in duration-150">
                    {/* 顶部灰白色小条：“实验报告” */}
                    <div className="h-10 bg-[#f4f6f9] border-b border-slate-200/90 flex items-center px-4 text-xs font-semibold text-slate-700 shrink-0">
                      <span>实验报告</span>
                    </div>

                    {/* 实验报告各模块大纲 */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs custom-scrollbar">
                      <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                        报告大纲导航
                      </div>
                      {[
                        { title: '一、实验目的与要求', template: '# 一、实验目的与要求\n\n1. 掌握 Python 数据可视化的核心设计思路。\n2. 熟悉 Matplotlib 与 Seaborn 基础图表绘制流程。\n' },
                        { title: '二、实验环境与数据源', template: '## 二、实验环境与数据源\n\n- **运行环境**：Python 3.10 / JupyterLab\n- **数据集**：中文自然语言与酒店评论样本库\n' },
                        { title: '三、核心算法与模型设计', template: '## 三、核心算法与模型设计\n\n> 采用 TF-IDF 特征提取与朴素贝叶斯分类器联合建模。\n' },
                        { title: '四、实验核心代码与执行', template: '## 四、实验核心代码与执行\n\n```python\nimport matplotlib.pyplot as plt\nimport numpy as np\n\n# 核心可视化代码实现\nplt.figure(figsize=(10, 6))\n```\n' },
                        { title: '五、实验结果与图表分析', template: '## 五、实验结果与图表分析\n\n- 模型准确率达 92.4%\n- 损失函数在第 15 个 Epoch 稳定收敛\n' },
                        { title: '六、思考题与实验总结', template: '## 六、思考题与实验总结\n\n通过本次实验实训，深入理解了数据预处理与特征工程对最终可视化呈现的决定性作用。\n' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            if (!reportContent) {
                              setReportContent(item.template);
                            } else {
                              handleInsertReportTag(`\n\n${item.template}`);
                            }
                            triggerSwitchToast('实验报告', `已定位/插入【${item.title}】模块`);
                          }}
                          className="px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <span className="truncate">{item.title}</span>
                          <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">插入</span>
                        </div>
                      ))}
                    </div>

                    {/* 边缘折叠按钮（小白底圆角把手标签，上面有 (( 符号，完全还原截图） */}
                    <button
                      type="button"
                      onClick={() => setReportSidebarOpen(false)}
                      className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 bg-white border border-slate-200 shadow-md rounded-full w-6 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all"
                      title="折叠实验报告大纲栏"
                    >
                      <span className="text-[11px] font-bold tracking-tighter select-none">((</span>
                    </button>
                  </div>
                ) : (
                  /* 折叠状态下的唤出把手 */
                  <div className="relative shrink-0 z-30">
                    <button
                      type="button"
                      onClick={() => setReportSidebarOpen(true)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-slate-200 border-l-0 shadow-md rounded-r-full w-5 h-12 flex items-center justify-center cursor-pointer hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all"
                      title="展开实验报告大纲栏"
                    >
                      <span className="text-[11px] font-bold tracking-tighter select-none">))</span>
                    </button>
                  </div>
                )}

                {/* 2. 右侧 Markdown 双栏编辑器主体 */}
                <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
                  
                  {/* 顶部工具栏 Toolbar（精细对齐截图） */}
                  <div className="h-10 bg-[#fafbfe] border-b border-slate-200/90 flex items-center justify-between px-3 shrink-0 text-slate-600 select-none">
                    
                    {/* 左侧富文本与 Markdown 操作工具图标 */}
                    <div className="flex items-center space-x-0.5 sm:space-x-1 overflow-x-auto no-scrollbar py-1">
                      
                      {/* B 加粗 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('**', '**')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                        title="加粗"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>

                      {/* U 下划线 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('<u>', '</u>')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="下划线"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>

                      {/* I 斜体 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('*', '*')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="斜体"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      {/* S 删除线 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('~~', '~~')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="删除线"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-200 mx-1"></div>

                      {/* H 标题 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('## ')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                        title="插入标题"
                      >
                        H
                      </button>

                      {/* x2 下标 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('<sub>', '</sub>')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="下标"
                      >
                        <Subscript className="w-3.5 h-3.5" />
                      </button>

                      {/* x^2 上标 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('<sup>', '</sup>')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="上标"
                      >
                        <Superscript className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-200 mx-1"></div>

                      {/* 引用 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('> ')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="引用"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>

                      {/* 无序列表 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('- ')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="无序列表"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>

                      {/* 有序列表 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('1. ')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="有序列表"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>

                      {/* 代办清单 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('- [ ] ')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="任务清单"
                      >
                        <ListTodo className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-200 mx-1"></div>

                      {/* 代码块 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('```python\n', '\n```')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="代码块"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>

                      {/* 图片 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('![图片说明](', ')')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="插入图片"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>

                      {/* 链接 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('[链接文本](', ')')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="插入超链接"
                      >
                        <Link className="w-3.5 h-3.5" />
                      </button>

                      {/* 表格 */}
                      <button 
                        type="button" 
                        onClick={() => handleInsertReportTag('\n| 表头1 | 表头2 | 表头3 |\n| --- | --- | --- |\n| 数据1 | 数据2 | 数据3 |\n')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="插入表格"
                      >
                        <Table className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-200 mx-1"></div>

                      {/* 撤销 / 重做 */}
                      <button 
                        type="button" 
                        onClick={() => document.execCommand('undo')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="撤销"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        type="button" 
                        onClick={() => document.execCommand('redo')}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-700 text-xs cursor-pointer transition-colors"
                        title="重做"
                      >
                        <Redo2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 右侧视图控制：预览切换、双栏分屏、全屏 */}
                    <div className="flex items-center space-x-1 shrink-0 pl-2">
                      <button
                        type="button"
                        onClick={() => setReportViewMode(reportViewMode === 'preview' ? 'both' : 'preview')}
                        className={`p-1.5 rounded hover:bg-slate-200/70 cursor-pointer transition-colors ${reportViewMode === 'preview' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
                        title={reportViewMode === 'preview' ? '退出仅预览' : '仅预览模式'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportViewMode(reportViewMode === 'both' ? 'edit' : 'both')}
                        className={`p-1.5 rounded hover:bg-slate-200/70 cursor-pointer transition-colors ${reportViewMode === 'both' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
                        title={reportViewMode === 'both' ? '仅编辑模式' : '左右双栏分屏模式'}
                      >
                        <Columns2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsReportFullscreen(!isReportFullscreen)}
                        className={`p-1.5 rounded hover:bg-slate-200/70 cursor-pointer transition-colors ${isReportFullscreen ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
                        title={isReportFullscreen ? '退出全屏' : '全屏编辑器'}
                      >
                        {isReportFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* 核心双栏编辑与预览区（高精度对齐用户截图） */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* 左栏：文本输入区 */}
                    {(reportViewMode === 'both' || reportViewMode === 'edit') && (
                      <div className="flex-1 flex flex-col overflow-hidden bg-white p-6 relative">
                        <textarea
                          id="report-editor-textarea"
                          value={reportContent}
                          onChange={(e) => setReportContent(e.target.value)}
                          placeholder="请输入正文"
                          className="w-full h-full resize-none outline-none border-none text-slate-800 placeholder:text-slate-300 text-sm leading-relaxed font-sans custom-scrollbar"
                          spellCheck={false}
                        />
                      </div>
                    )}

                    {/* 中间分隔线（双栏模式下显示） */}
                    {reportViewMode === 'both' && (
                      <div className="w-px bg-slate-200/90 shrink-0 select-none"></div>
                    )}

                    {/* 右栏：Markdown 实时排版预览区 */}
                    {(reportViewMode === 'both' || reportViewMode === 'preview') && (
                      <div className="flex-1 overflow-hidden bg-white flex flex-col">
                        <ReportMarkdownPreview content={reportContent} />
                      </div>
                    )}
                  </div>

                  {/* 底部状态栏 */}
                  <div className="h-7 bg-[#fafbfe] border-t border-slate-200/80 px-4 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
                    <div className="flex items-center space-x-3">
                      <span>字符数: {reportContent.length}</span>
                      <span>|</span>
                      <span>行数: {reportContent ? reportContent.split('\n').length : 0}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-500">
                      <span className="flex items-center text-emerald-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        已自动保存草稿
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 场景 C：图文步骤类型 —— 100% 对齐用户截图的高保真 PPT 课件阅读器（支持缩放、批注、多页滚动与课件下载） */
            <SlideViewer
              title={`${activeChapter.chapterTitle} ${activeStep.title}（PPT）`}
              onBackToDirectory={() => setFloatingDrawer('directory')}
              onDownload={() => handleDownloadResource(activeStep.title, 'ppt')}
            />
          )}

        </div>
      </div>

      {/* 资源预览模态框 */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            {/* 头部 */}
            <div className="px-6 py-4 bg-[#f8faff] border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {previewItem.type === 'video' ? '视频资源' : (previewItem.type === 'manual' ? '手册指南' : (previewItem.type === 'file' ? '资料文件' : '图文资源'))}
                </span>
                <h3 className="text-base font-bold text-slate-800 truncate max-w-[420px]">{previewItem.fullTitle}</h3>
              </div>
              <button 
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-2 text-blue-600">
                  资源说明与目标
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {previewItem.desc}
                </p>
              </div>

              {previewItem.type === 'video' ? (
                <div 
                  onClick={() => {
                    setCurrentStepId('1-4');
                    setIsPlaying(true);
                    triggerSwitchToast('第一章：认识自然语言处理', previewItem.fullTitle);
                    setPreviewItem(null);
                  }}
                  className="aspect-video bg-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center text-white relative group cursor-pointer shadow-md"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                  <span className="mt-3 text-xs text-slate-300">点击在主屏幕中立即开播（时长 {previewItem.duration || '1:09:07'}）</span>
                </div>
              ) : previewItem.type === 'file' ? (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50/60 text-center">
                  <FileDown className="w-10 h-10 text-blue-500 mb-2" />
                  <span className="font-medium text-slate-800 text-sm mb-1">{previewItem.name}</span>
                  <span className="text-xs text-slate-400 mb-4">文件大小: {previewItem.fileSize || '未知'}</span>
                  <button 
                    onClick={() => {
                      alert(`开始下载：${previewItem.name}`);
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors flex items-center cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5 mr-1.5" />
                    立即下载文件
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4 bg-white">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center text-xs text-indigo-700">
                      <FileText className="w-4 h-4 mr-1.5" /> 核心理论知识要点
                    </h5>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                      <li>分词算法的核心评价指标：查准率（Precision）、召回率（Recall）及 OOV未登录词识别率。</li>
                      <li>基于统计语言模型的隐马尔可夫模型（HMM）与维特比（Viterbi）解码算法。</li>
                      <li>停用词表的加载与词频统计过滤机制。</li>
                    </ul>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-900 text-slate-200 font-mono text-xs">
                    <div className="text-slate-400 mb-2">// 示例代码：关键词抽取与TF-IDF加权</div>
                    <pre className="text-emerald-400">
{`import jieba.analyse

sentence = "自然语言处理是计算机科学与人工智能的重要方向。"
keywords = jieba.analyse.extract_tags(sentence, topK=3, withWeight=True)
for word, weight in keywords:
    print(f"{word}: {weight:.4f}")`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-1.5" />
                已记录查阅日志
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-md text-xs text-slate-600 font-medium transition-colors cursor-pointer"
                >
                  关闭
                </button>
                <button 
                  onClick={() => {
                    setCurrentStepId('1-4');
                    setIsPlaying(true);
                    triggerSwitchToast('第一章：认识自然语言处理', previewItem.fullTitle);
                    setPreviewItem(null);
                  }}
                  className="px-4 py-1.5 bg-[#2f80ed] hover:bg-blue-600 rounded-md text-xs text-white font-medium transition-colors shadow-xs cursor-pointer"
                >
                  进入该任务学习
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 资源面板拖拽中的防穿透全屏遮罩 */}
      {isDraggingResource && (
        <div className="fixed inset-0 z-[9999] cursor-col-resize select-none pointer-events-auto" />
      )}

      {/* 截图快门白光微闪动画 */}
      {isScreenFlashing && (
        <div className="fixed inset-0 z-[9999] bg-white/70 pointer-events-none transition-opacity duration-200" />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dbe4f0; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b5c7de; 
        }
      `}</style>
    </div>
  );
}
