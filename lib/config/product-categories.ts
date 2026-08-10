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
  iconName: 'Hospital' | 'Stethoscope' | 'Sparkles' | 'Dna';
  gradient: string;
  textColor: string;
  moduleKeys: string[];
  sortOrder: number;
}

/** 模块详情页路由映射（无白标 slug 时的 fallback，独立页面预览用） */
export const MODULE_DETAIL_ROUTES: Record<string, string> = {
  medical_packages: '/medical',
  hyogo_medical: '/hyogo-medical',
  kindai_hospital: '/kindai-hospital',
  osaka_himak: '/osaka-himak',
  sai_clinic: '/sai-clinic',
  cancer_treatment: '/cancer-treatment',
  helene_clinic: '/helene-clinic',
  ginza_phoenix: '/ginza-phoenix',
  wclinic_mens: '/wclinic-mens',
  cell_medicine: '/cell-medicine',
  ac_plus: '/ac-plus',
  igtc: '/igtc',
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'general_hospital',
    name: '综合医院合作',
    nameJa: '総合病院提携',
    description: '与日本顶级综合医院合作，提供高端诊疗与先进医疗服务',
    iconName: 'Hospital',
    gradient: 'from-zinc-900 to-zinc-600',
    textColor: 'text-zinc-100',
    moduleKeys: ['hyogo_medical', 'kindai_hospital', 'osaka_himak', 'cancer_treatment', 'igtc'],
    sortOrder: 1,
  },
  {
    id: 'health_screening',
    name: '体检中心合作',
    nameJa: '健診センター提携',
    description: '精密体检中心合作，提供全面日本高端健康检查服务',
    iconName: 'Stethoscope',
    gradient: 'from-zinc-900 to-zinc-600',
    textColor: 'text-zinc-100',
    moduleKeys: ['medical_packages'],
    sortOrder: 2,
  },
  {
    id: 'aesthetics',
    name: '医美整形合作',
    nameJa: '美容医療センター提携',
    description: '日本顶级医美整形诊所，糸リフト·注射美容·眼鼻整形',
    iconName: 'Sparkles',
    gradient: 'from-zinc-900 to-zinc-600',
    textColor: 'text-zinc-100',
    moduleKeys: ['sai_clinic', 'wclinic_mens'],
    sortOrder: 3,
  },
  {
    id: 'stem_cell',
    name: '干细胞中心合作',
    nameJa: '幹細胞センター提携',
    description: '干细胞·再生医疗·癌症免疫细胞治疗，日本先端细胞医疗合作机构',
    iconName: 'Dna',
    gradient: 'from-zinc-900 to-zinc-600',
    textColor: 'text-zinc-100',
    moduleKeys: ['helene_clinic', 'ac_plus', 'cell_medicine', 'ginza_phoenix'],
    sortOrder: 4,
  },
];

/**
 * 白标支持详情页的模块 component_key —— 单一数据源 (SSOT)。
 * 由 PRODUCT_CATEGORIES.moduleKeys 派生。g/[slug] 首页 / 导航 / 详情页 /
 * 体检结果页 以及 middleware 全部从这里 import,避免多处硬编码白名单漂移。
 *
 * 新增模块:在对应分类的 moduleKeys 加入 key,并补齐各 per-key 映射
 * (build-distribution-nav 的 MODULE_LABELS、g/[slug]/page 的 DETAIL_PAGE_HERO_IMAGES、
 *  [moduleSlug]/page 的详情组件 switch)。成员白名单会自动同步,无需再逐处修改。
 */
export const SUPPORTED_COMPONENT_KEYS: string[] = Array.from(
  new Set(PRODUCT_CATEGORIES.flatMap((c) => c.moduleKeys)),
);

/** SUPPORTED_COMPONENT_KEYS 的 Set 形式,供 .has() 成员判断 */
export const SUPPORTED_COMPONENT_KEY_SET: ReadonlySet<string> = new Set(
  SUPPORTED_COMPONENT_KEYS,
);

/** component_key(下划线) → URL slug(连字符):medical_packages → medical-packages */
export function toModuleUrlSlug(componentKey: string): string {
  return componentKey.replace(/_/g, '-');
}

/** 白标模块的 URL 路径段(连字符形式)集合,供 middleware 路由匹配 */
export const SUPPORTED_MODULE_PATHS: ReadonlySet<string> = new Set(
  SUPPORTED_COMPONENT_KEYS.map(toModuleUrlSlug),
);

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
