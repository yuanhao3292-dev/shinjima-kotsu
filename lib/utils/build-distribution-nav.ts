/**
 * 共享工具：根据导游选品构建 DistributionNav 导航项
 * 供 app/g/[slug]/layout.tsx 和 app/layout.tsx 复用
 */
import type { NavItem } from '@/components/distribution/DistributionNav';
import type { SelectedModuleWithDetails } from '@/lib/types/whitelabel';
import type { ImmersiveDisplayConfig } from '@/lib/types/display-config';

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

/** 模块名 fallback 映射（优先级：customTitle > navLabel > MODULE_LABELS > module.name） */
const MODULE_LABELS: Record<string, string> = {
  medical_packages: '精密体检',
  hyogo_medical: '兵庫医大病院',
  kindai_hospital: '近畿大学病院',
  cancer_treatment: '癌症治疗',
  sai_clinic: 'SAI CLINIC',
  wclinic_mens: 'W CLINIC men\'s',
  helene_clinic: 'HELENE クリニック',
  ginza_phoenix: '銀座鳳凰クリニック',
  cell_medicine: '先端細胞医療',
  ac_plus: 'ACセルクリニック',
  igtc: 'IGTクリニック',
  osaka_himak: '大阪重粒子線センター',
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
    { id: 'home', label: '首页', href: homeHref },
  ];

  selectedModules.forEach((m) => {
    const key = m.module.componentKey;
    if (key && DETAIL_MODULES.has(key)) {
      const dc = m.module.displayConfig as ImmersiveDisplayConfig | null;
      navItems.push({
        id: key,
        label: m.customTitle || dc?.navLabel || MODULE_LABELS[key] || m.module.name,
        href: `/g/${slug}/${toUrlSlug(key)}`,
      });
    }
  });

  return navItems;
}
