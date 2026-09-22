export interface EnterpriseItem {
  id: string | number;
  name: string;
  code: string;
  type?: string;
  industry?: string;
  city?: string;
  isCustom?: boolean; // 是否为用户新增进库的企业
}

// 国家标准企业库预设数据
export const STANDARD_ENTERPRISES: EnterpriseItem[] = [
  { id: 1, name: '福建新大陆教育科技有限公司', code: '91350100058921884M', type: '企业', industry: '教育科技', city: '福建省福州市' },
  { id: 2, name: '新大陆科技集团有限公司', code: '91350100727900762X', type: '企业', industry: '物联网与金融IT', city: '福建省福州市' },
  { id: 3, name: '华为技术有限公司', code: '914403001922038216', type: '企业', industry: '通信与智能硬件', city: '广东省深圳市' },
  { id: 4, name: '腾讯科技（深圳）有限公司', code: '91440300708461136T', type: '企业', industry: '互联网与软件', city: '广东省深圳市' },
  { id: 5, name: '阿里巴巴（中国）网络技术有限公司', code: '91330100716105852F', type: '企业', industry: '电子商务与云计算', city: '浙江省杭州市' },
  { id: 6, name: '百度在线网络技术（北京）有限公司', code: '91110000717866398Y', type: '企业', industry: '人工智能与搜索引擎', city: '北京市' },
  { id: 7, name: '北京字节跳动科技有限公司', code: '91110108592366553M', type: '企业', industry: '数字媒体与人工智能', city: '北京市' },
  { id: 8, name: '科大讯飞股份有限公司', code: '91340000711771143X', type: '企业', industry: '智能语音与人工智能', city: '安徽省合肥市' },
  { id: 9, name: '联想（北京）有限公司', code: '91110108101740925G', type: '企业', industry: '计算机与智能终端', city: '北京市' },
  { id: 10, name: '京东世纪贸易有限公司', code: '911103027993433544', type: '企业', industry: '零售电商与数智物流', city: '北京市' },
  { id: 11, name: '网易（杭州）网络有限公司', code: '91330108788262208B', type: '企业', industry: '互联网服务与数字文化', city: '浙江省杭州市' }
];

const STORAGE_KEY = 'uusima_custom_enterprises';

// 获取所有企业（标准库 + 新增库）
export function getEnterpriseList(): EnterpriseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customEnterprises: EnterpriseItem[] = raw ? JSON.parse(raw) : [];
    const customNames = new Set(customEnterprises.map(e => e.name));
    const standards = STANDARD_ENTERPRISES.filter(e => !customNames.has(e.name));
    return [...customEnterprises, ...standards];
  } catch {
    return STANDARD_ENTERPRISES;
  }
}

// 模糊搜索企业库
export function searchEnterprises(keyword: string): EnterpriseItem[] {
  const allEnterprises = getEnterpriseList();
  if (!keyword || !keyword.trim()) {
    return allEnterprises.slice(0, 8);
  }
  const kw = keyword.trim().toLowerCase();
  return allEnterprises.filter(
    e => e.name.toLowerCase().includes(kw) || e.code.toLowerCase().includes(kw)
  );
}

// 添加新企业到库中（对接新增企业库）
export function addCustomEnterprise(enterprise: { name: string; code: string; type?: string; city?: string }): EnterpriseItem {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customEnterprises: EnterpriseItem[] = raw ? JSON.parse(raw) : [];

    const existingIndex = customEnterprises.findIndex(e => e.name === enterprise.name);
    const newEnterprise: EnterpriseItem = {
      id: `custom_ent_${Date.now()}`,
      name: enterprise.name.trim(),
      code: enterprise.code.trim(),
      type: enterprise.type || '企业',
      city: enterprise.city || '',
      isCustom: true
    };

    if (existingIndex >= 0) {
      customEnterprises[existingIndex] = { ...customEnterprises[existingIndex], ...newEnterprise };
    } else {
      customEnterprises.unshift(newEnterprise);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customEnterprises));
    return newEnterprise;
  } catch (err) {
    console.error('Failed to save custom enterprise', err);
    return {
      id: `custom_ent_${Date.now()}`,
      name: enterprise.name,
      code: enterprise.code,
      type: enterprise.type || '企业',
      isCustom: true
    };
  }
}
