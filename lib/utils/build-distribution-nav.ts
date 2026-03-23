/**
 * 共享工具：根据导游选品构建 DistributionNav 导航项
 * 供 app/g/[slug]/layout.tsx 和 app/layout.tsx 复用
 */
import type { NavItem } from '@/components/distribution/DistributionNav';
import type { SelectedModuleWithDetails } from '@/lib/types/whitelabel';
import type { ImmersiveDisplayConfig } from '@/lib/types/display-config';

/** 多语言 label 类型 */
type MultiLabel = Record<string, string>;

/** component_key → URL slug (medical_packages → medical-packages) */
function toUrlSlug(componentKey: string): string {
  return componentKey.replace(/_/g, '-');
}

/** 支持详情页的 component_key 白名单（必须与 page_modules 表一致） */
const DETAIL_MODULES = new Set([
  'medical_packages', 'hyogo_medical', 'kindai_hospital', 'cancer_treatment',
  'sai_clinic', 'wclinic_mens',
  'helene_clinic', 'ginza_phoenix', 'cell_medicine', 'ac_plus', 'igtc',
  'osaka_himak',
]);

/** 首页 label（多语言） */
const HOME_LABEL: MultiLabel = {
  ja: 'ホーム', 'zh-CN': '首页', 'zh-TW': '首頁', en: 'Home',
};

/** 模块名 fallback 映射（多语言，优先级：customTitle > navLabel > MODULE_LABELS > module.name） */
const MODULE_LABELS: Record<string, MultiLabel> = {
  medical_packages:  { ja: '精密健康診断', 'zh-CN': '精密体检', 'zh-TW': '精密體檢', en: 'Health Screening' },
  hyogo_medical:     { ja: '兵庫医科大学病院', 'zh-CN': '兵库医科大学医院', 'zh-TW': '兵庫醫科大學醫院', en: 'Hyogo Medical University Hospital' },
  kindai_hospital:   { ja: '近畿大学病院', 'zh-CN': '近畿大学医院', 'zh-TW': '近畿大學醫院', en: 'Kindai University Hospital' },
  cancer_treatment:  { ja: 'がん治療', 'zh-CN': '癌症治疗', 'zh-TW': '癌症治療', en: 'Cancer Treatment' },
  sai_clinic:        { ja: 'SAI CLINIC', 'zh-CN': 'SAI CLINIC', 'zh-TW': 'SAI CLINIC', en: 'SAI CLINIC' },
  wclinic_mens:      { ja: 'W CLINIC men\'s', 'zh-CN': 'W CLINIC men\'s', 'zh-TW': 'W CLINIC men\'s', en: 'W CLINIC men\'s' },
  helene_clinic:     { ja: 'HELENE クリニック', 'zh-CN': 'HELENE 诊所', 'zh-TW': 'HELENE 診所', en: 'HELENE Clinic' },
  ginza_phoenix:     { ja: '銀座フェニックスクリニック', 'zh-CN': '银座凤凰诊所', 'zh-TW': '銀座鳳凰診所', en: 'Ginza Phoenix Clinic' },
  cell_medicine:     { ja: '先端細胞医療', 'zh-CN': '前沿细胞医疗', 'zh-TW': '前沿細胞醫療', en: 'Advanced Cell Medicine' },
  ac_plus:           { ja: 'ACセルクリニック', 'zh-CN': 'AC细胞诊所', 'zh-TW': 'AC細胞診所', en: 'AC Cell Clinic' },
  igtc:              { ja: 'IGTクリニック', 'zh-CN': 'IGT诊所', 'zh-TW': 'IGT診所', en: 'IGT Clinic' },
  osaka_himak:       { ja: '大阪重粒子線センター', 'zh-CN': '大阪重粒子线中心', 'zh-TW': '大阪重粒子線中心', en: 'Osaka Heavy Ion Therapy Center' },
};

/**
 * 根据导游选中的模块构建导航项列表
 * @param slug - 导游 slug
 * @param selectedModules - 导游选中的模块（含详情）
 * @returns NavItem[] 导航项（首页 + 各模块）
 */
export function buildDistributionNavItems(
  slug: string,
  selectedModules: SelectedModuleWithDetails[],
): NavItem[] {
  const homeHref = `/g/${slug}`;
  const navItems: NavItem[] = [
    { id: 'home', label: HOME_LABEL, href: homeHref },
  ];

  selectedModules.forEach((m) => {
    const key = m.module.componentKey;
    if (key && DETAIL_MODULES.has(key)) {
      const dc = m.module.displayConfig as ImmersiveDisplayConfig | null;
      navItems.push({
        id: key,
        label: MODULE_LABELS[key] || m.customTitle || dc?.navLabel || m.module.name,
        href: `/g/${slug}/${toUrlSlug(key)}`,
      });
    }
  });

  return navItems;
}
