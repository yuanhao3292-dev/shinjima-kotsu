/**
 * 白标商城可选页面配置
 * Guide Storefront Page Configuration
 */

// 可选页面的定义
export interface StorefrontPage {
  id: string;
  name: string;
  nameJa: string;
  nameEn: string;
  description: string;
  icon: string; // Lucide icon name
  href: string;
  category: 'medical' | 'leisure' | 'business' | 'service';
  isDefault: boolean; // 是否默认选中
}

// 所有可选页面列表
export const STOREFRONT_PAGES: StorefrontPage[] = [
  {
    id: 'timc-medical',
    name: '日本精密健检',
    nameJa: '日本精密健診',
    nameEn: 'Medical Checkup',
    description: 'TIMC 国际医疗中心精密健康检查',
    icon: 'Stethoscope',
    href: '/?page=medical',
    category: 'medical',
    isDefault: true,
  },
  {
    id: 'premium-golf',
    name: '名门高尔夫',
    nameJa: '名門ゴルフ',
    nameEn: 'Premium Golf',
    description: '日本顶级会员制高尔夫球场预约',
    icon: 'Flag',
    href: '/?page=golf',
    category: 'leisure',
    isDefault: true,
  },
  {
    id: 'business-inspection',
    name: '商务考察',
    nameJa: '商務視察',
    nameEn: 'Business Tour',
    description: '日本顶级企业商务考察定制',
    icon: 'Building2',
    href: '/?page=business',
    category: 'business',
    isDefault: true,
  },
  {
    id: 'vehicles',
    name: '车辆介绍',
    nameJa: '車両紹介',
    nameEn: 'Our Fleet',
    description: '豪华商务车队展示',
    icon: 'Car',
    href: '/vehicles',
    category: 'service',
    isDefault: false,
  },
  {
    id: 'hyogo-medical',
    name: '兵库医科大学病院',
    nameJa: '兵庫医科大学病院',
    nameEn: 'Hyogo Medical University Hospital',
    description: '兵库县最大规模特定功能医院，963床41诊疗科',
    icon: 'Building2',
    href: '/hyogo-medical',
    category: 'medical',
    isDefault: false,
  },
];

// 获取页面 ID 列表
export const PAGE_IDS = STOREFRONT_PAGES.map((p) => p.id);

// 获取默认选中的页面
export const DEFAULT_SELECTED_PAGES = STOREFRONT_PAGES.filter((p) => p.isDefault).map((p) => p.id);

// 根据 ID 获取页面信息
export function getPageById(id: string): StorefrontPage | undefined {
  return STOREFRONT_PAGES.find((p) => p.id === id);
}

// 根据 href 获取页面信息
export function getPageByHref(href: string): StorefrontPage | undefined {
  return STOREFRONT_PAGES.find((p) => p.href === href);
}

// 验证页面 ID 列表是否有效
export function validatePageIds(ids: string[]): boolean {
  return ids.every((id) => PAGE_IDS.includes(id));
}

// 过滤出有效的页面 ID
export function filterValidPageIds(ids: string[]): string[] {
  return ids.filter((id) => PAGE_IDS.includes(id));
}
