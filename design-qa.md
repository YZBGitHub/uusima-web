# AI技能助手截图复刻核验

- Source visual truth: 用户本轮附图，1605 × 861；选中菜单为「AI技能助手」。附件未提供本地路径。
- Implementation: `src/pages/course/CourseManagement/CourseAiAssistantSection.tsx`，通过课程开发人员 → 课程管理 → 编辑课程 → AI技能助手进入。
- Preview: http://localhost:3003/?view=personal
- Implementation screenshot / viewport / density: 未获取。内置浏览器不可用，Chrome 浏览器连接超时，原生 Chrome 访问未获工具授权。
- State: 默认应用标识、知识库 ID 为空；大模型展示默认为「不展示」。

## 核验范围

- Fonts / typography: 代码采用现有项目字体，表单字号 14px，标签行高 20px；实际字体渲染待浏览器核验。
- Spacing / layout: 代码按参考采用 300 × 32px 输入框、右上保存按钮、白色内容区、蓝色菜单选中态；AI 页面采用 200px 顶部区域与 210px 侧栏区域。实际布局待核验。
- Colors / tokens: 输入框边框 #dcdfe6，焦点与按钮 #409eff，正文 #606266，提示文本 #a8abb2。
- Image quality / assets: 沿用现有课程封面与全局助手，不包含参考截图中的品牌封面和机器人资源；未宣称资源完全一致。
- Copy / content: 表单标签及占位文字按截图实现；课程名称与属性沿用现有页面。

## Findings

- 浏览器不可用，无法完成同尺寸整页和局部组合截图比较，也无法验证保存、重新进入、课程隔离等实际交互。不得将静态检查视为视觉验证。
- 配置使用浏览器 localStorage 按课程 ID 保存，未对接后端大模型服务。

## Checks

- `npm run lint`: passed。
- `npm run build`: passed；存在项目产物体积警告。
- `git diff --check`: passed。
- Primary interactions / console errors: 浏览器核验受阻，未验证。

## Comparison history

- 无有效浏览器截图，不存在已完成的视觉比较轮次。

## Implementation checklist

- [x] 增加 AI技能助手配置页面与课程编辑器菜单接入。
- [x] 实现应用标识、展示单选、知识库 ID 与按课程保存、读取、错误反馈。
- [x] 类型与生产构建检查。
- [ ] 浏览器交互核验与源图/实现图组合对照。

## 后续调整：搜索单选

- 按用户新要求，将应用标识与关联知识库改为可搜索的单选下拉框。
- 支持按名称或 ID 筛选、选中标记、清空、无匹配结果提示、方向键导航、Enter 选择、Escape 关闭、失焦关闭。
- 保存格式仍为应用 ID 和知识库 ID，旧手工输入的配置保留为已保存候选项。
- 候选项目前为本地示例数据，尚未连接统一应用/知识库接口。
- 本轮 `npm run lint`、`npm run build`、`git diff --check` 通过。
- 浏览器访问限制仍未解除，本轮未进行浏览器交互验证。

## 后续调整：候选项信息

- 知识库候选项展示名称、介绍和分类；应用候选项展示图标、名称、类型和应用介绍。
- 使用现有 Lucide 图标库；介绍自动换行，下拉面板扩展为 440px，列表支持滚动。
- 搜索范围覆盖名称、ID、介绍、分类与类型；键盘切换时列表自动滚动以显示当前选项。
- 示例选项补充介绍、分类和类型；旧配置缺少详细资料时继续显示已保存名称及 ID。
- 本轮类型检查、生产构建及空白检查均通过。浏览器核验仍受此前访问限制阻塞，未声明视觉或交互核验通过。

final result: blocked
