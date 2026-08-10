/**
 * 选品中心分类配置
 * 定义产品中心的展示分类及其包含的模块
 *
 * 新增分类步骤：
 * 1. 在 PRODUCT_CATEGORIES 中添加新条目
 * 2. 将对应模块的 component_key 加入 moduleKeys
 * 3. 确保 page_modules 表中有对应的 is_active=true 记录
 */

/**
 * 白标支持详情页的模块 component_key —— 唯一数据源 (SSOT),as const 元组。
 * 由此派生联合类型 SupportedComponentKey;所有 per-key 映射(标签/首图/路由/详情组件)
 * 均以 Record<SupportedComponentKey, T> 声明,漏配任何一处 = 编译报错(而非上线后静默出错)。
 *
 * 新增模块:在此加入 key → 各 Record 映射与 [moduleSlug] 详情页 switch 会同时报"缺项",
 * 补齐即可。成员白名单也自动同步,不会再出现"能选却渲染不出 / 404"的漂移。
 */
export const SUPPORTED_COMPONENT_KEYS = [
  'medical_packages', 'hyogo_medical', 'kindai_hospital', 'cancer_treatment',
  'sai_clinic', 'wclinic_mens', 'helene_clinic', 'ginza_phoenix',
  'cell_medicine', 'ac_plus', 'igtc', 'osaka_himak',
] as const;

/** 支持详情页的模块 key 联合类型 */
export type SupportedComponentKey = typeof SUPPORTED_COMPONENT_KEYS[number];

/** Set 形式(string 便于 .has() 直接判断) */
export const SUPPORTED_COMPONENT_KEY_SET: ReadonlySet<string> =
  new Set(SUPPORTED_COMPONENT_KEYS);

/** 运行时类型守卫:把 string 窄化为 SupportedComponentKey(用于需要按 key 索引/穷尽的地方) */
export function isSupportedComponentKey(key: string): key is SupportedComponentKey {
  return SUPPORTED_COMPONENT_KEY_SET.has(key);
}

/** component_key(下划线) → URL slug(连字符):medical_packages → medical-packages */
export function toModuleUrlSlug(componentKey: string): string {
  return componentKey.replace(/_/g, '-');
}

/** 白标模块的 URL 路径段(连字符形式)集合,供 middleware 路由匹配 */
export const SUPPORTED_MODULE_PATHS: ReadonlySet<string> = new Set(
  SUPPORTED_COMPONENT_KEYS.map(toModuleUrlSlug),
);

export interface ProductCategory {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  iconName: 'Hospital' | 'Stethoscope' | 'Sparkles' | 'Dna';
  gradient: string;
  textColor: string;
  /** 只能引用 SUPPORTED_COMPONENT_KEYS 里的 key(写错 = 编译报错) */
  moduleKeys: SupportedComponentKey[];
  sortOrder: number;
}

/** 模块详情页路由映射（无白标 slug 时的 fallback，独立页面预览用；缺失只是没预览链接,非致命） */
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

// 开发期自检:每个支持的模块都应归入某个分类,否则选品中心不会展示它。
// (类型只保证分类不引用非法 key;此处补上"是否有 key 漏归类"的运行时提醒)
if (process.env.NODE_ENV !== 'production') {
  const categorized = new Set<string>(PRODUCT_CATEGORIES.flatMap((c) => c.moduleKeys));
  const uncategorized = SUPPORTED_COMPONENT_KEYS.filter((k) => !categorized.has(k));
  if (uncategorized.length > 0) {
    console.warn('[product-categories] 以下模块未归入任何分类(选品中心不展示):', uncategorized);
  }
}

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
