export interface SchoolItem {
  id: string | number;
  name: string;
  code: string;
  level: string; // 本科, 专科, 高职, 高中 等
  city?: string;
  isCustom?: boolean; // 是否为用户新增进库的学校
}

// 国家标准学校库预设数据
export const STANDARD_SCHOOLS: SchoolItem[] = [
  { id: 1, name: '清华大学', code: '12100000400000624D', level: '本科', city: '北京市' },
  { id: 2, name: '北京大学', code: '12100000400002558N', level: '本科', city: '北京市' },
  { id: 3, name: '浙江大学', code: '12100000470003401X', level: '本科', city: '浙江省杭州市' },
  { id: 4, name: '复旦大学', code: '1210000042500615X0', level: '本科', city: '上海市' },
  { id: 5, name: '上海交通大学', code: '12100000400007530H', level: '本科', city: '上海市' },
  { id: 6, name: '南京大学', code: '12100000466006742B', level: '本科', city: '江苏省南京市' },
  { id: 7, name: '武汉大学', code: '12100000441626284C', level: '本科', city: '湖北省武汉市' },
  { id: 8, name: '华中科技大学', code: '121000004416262927', level: '本科', city: '湖北省武汉市' },
  { id: 9, name: '中山大学', code: '121000004558588048', level: '本科', city: '广东省广州市' },
  { id: 10, name: '深圳职业技术大学', code: '124403004558588048', level: '高职', city: '广东省深圳市' },
  { id: 11, name: '四川大学', code: '12100000400010188Q', level: '本科', city: '四川省成都市' },
  { id: 12, name: '西安交通大学', code: '12100000435231737F', level: '本科', city: '陕西省西安市' },
  { id: 13, name: '哈尔滨工业大学', code: '1210000040000262X9', level: '本科', city: '黑龙江省哈尔滨市' },
  { id: 14, name: '同济大学', code: '121000004000075571', level: '本科', city: '上海市' },
  { id: 15, name: '演示高中', code: '121000004000329000', level: '高中', city: '浙江省杭州市' }
];

const STORAGE_KEY = 'uusima_custom_schools';

// 获取所有学校（标准库 + 新增库）
export function getSchoolList(): SchoolItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customSchools: SchoolItem[] = raw ? JSON.parse(raw) : [];
    // 将自定义学校排在前面或与标准库合并去重
    const customNames = new Set(customSchools.map(s => s.name));
    const standards = STANDARD_SCHOOLS.filter(s => !customNames.has(s.name));
    return [...customSchools, ...standards];
  } catch {
    return STANDARD_SCHOOLS;
  }
}

// 模糊搜索学校库
export function searchSchools(keyword: string): SchoolItem[] {
  const allSchools = getSchoolList();
  if (!keyword || !keyword.trim()) {
    return allSchools.slice(0, 8);
  }
  const kw = keyword.trim().toLowerCase();
  return allSchools.filter(
    s => s.name.toLowerCase().includes(kw) || s.code.toLowerCase().includes(kw)
  );
}

// 添加新学校到库中（对接新增学校库）
export function addCustomSchool(school: { name: string; code: string; level?: string; city?: string }): SchoolItem {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customSchools: SchoolItem[] = raw ? JSON.parse(raw) : [];
    
    // 如果已经存在同名学校，则更新 code
    const existingIndex = customSchools.findIndex(s => s.name === school.name);
    const newSchool: SchoolItem = {
      id: `custom_${Date.now()}`,
      name: school.name.trim(),
      code: school.code.trim(),
      level: school.level || '本科',
      city: school.city || '',
      isCustom: true
    };

    if (existingIndex >= 0) {
      customSchools[existingIndex] = { ...customSchools[existingIndex], ...newSchool };
    } else {
      customSchools.unshift(newSchool);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSchools));
    return newSchool;
  } catch (err) {
    console.error('Failed to save custom school', err);
    return {
      id: `custom_${Date.now()}`,
      name: school.name,
      code: school.code,
      level: school.level || '本科',
      city: school.city,
      isCustom: true
    };
  }
}
