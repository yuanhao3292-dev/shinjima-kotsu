/**
 * 选品中心分类配置
 * 定义产品中心的展示分类及其包含的模块
 *
 * 新增分类步骤：
 * 1. 在 PRODUCT_CATEGORIES 中添加新条目
 * 2. 将对应模块的 component_key 加入 moduleKeys
 * 3. 确保 page_modules 表中有对应的 is_active=true 记录
 */

export interface ProductCategory {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  iconName: 'Hospital' | 'Stethoscope' | 'Microscope' | 'Sparkles';
  gradient: string;
  textColor: string;
  moduleKeys: string[];
  sortOrder: number;
}

/** 模块详情页路由映射 */
export const MODULE_DETAIL_ROUTES: Record<string, string> = {
  medical_packages: '/guide-partner/product-center/timc',
  hyogo_medical: '/hyogo-medical',
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'general_hospital',
    name: '综合医院合作',
    nameJa: '総合病院提携',
    description: '与日本顶级综合医院合作，提供高端诊疗与先进医疗服务',
    iconName: 'Hospital',
    gradient: 'from-emerald-600 to-teal-700',
    textColor: 'text-emerald-100',
    moduleKeys: ['hyogo_medical'],
    sortOrder: 1,
  },
  {
    id: 'health_screening',
    name: '体检中心合作',
    nameJa: '健診センター提携',
    description: '精密体检中心合作，提供全面日本高端健康检查服务',
    iconName: 'Stethoscope',
    gradient: 'from-blue-600 to-indigo-700',
    textColor: 'text-blue-100',
    moduleKeys: ['medical_packages'],
    sortOrder: 2,
  },
  // 未来分类（有合作机构后取消注释即可启用）：
  // {
  //   id: 'stem_cell',
  //   name: '干细胞中心合作',
  //   nameJa: '幹細胞センター提携',
  //   description: '日本先进干细胞治疗与再生医疗中心',
  //   iconName: 'Microscope',
  //   gradient: 'from-purple-600 to-violet-700',
  //   textColor: 'text-purple-100',
  //   moduleKeys: [],
  //   sortOrder: 3,
  // },
  // {
  //   id: 'aesthetics',
  //   name: '医美整容中心合作',
  //   nameJa: '美容医療センター提携',
  //   description: '日本顶级医美整容机构，安全高品质的美容医疗',
  //   iconName: 'Sparkles',
  //   gradient: 'from-pink-500 to-rose-600',
  //   textColor: 'text-pink-100',
  //   moduleKeys: [],
  //   sortOrder: 4,
  // },
];

/**
 * 获取有模块的活跃分类（空分类自动隐藏）
 */
export function getActiveCategories(
  moduleComponentKeys: string[]
): ProductCategory[] {
  return PRODUCT_CATEGORIES
    .filter((cat) => cat.moduleKeys.some((key) => moduleComponentKeys.includes(key)))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
