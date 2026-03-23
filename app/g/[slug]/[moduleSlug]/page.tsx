import { notFound } from 'next/navigation';
import { getGuideModuleByComponentKey } from '@/lib/services/whitelabel';
import TIMCContent from '@/app/guide-partner/product-center/timc/TIMCContent';
import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';
import SaiClinicContent from '@/app/sai-clinic/SaiClinicContent';
import OICIContent from '@/app/oici/OICIContent';
import HeleneClinicContent from '@/app/helene-clinic/HeleneClinicContent';
import GinzaPhoenixContent from '@/app/ginza-phoenix/GinzaPhoenixContent';
import WClinicMensContent from '@/app/wclinic-mens/WClinicMensContent';
import CellMedicineContent from '@/app/cell-medicine/CellMedicineContent';
import ACPlusContent from '@/app/ac-plus/ACPlusContent';
import IGTCContent from '@/app/igtc/IGTCContent';
import OsakaHimakContent from '@/app/osaka-himak/OsakaHimakContent';
import KindaiHospitalContent from '@/app/kindai-hospital/KindaiHospitalContent';
import { getSaiClinicImages } from '@/lib/services/sai-clinic-images';

interface PageProps {
  params: Promise<{ slug: string; moduleSlug: string }>;
}

/** 将 URL slug (medical-packages) 转换为 component_key (medical_packages) */
function toComponentKey(urlSlug: string): string {
  return urlSlug.replace(/-/g, '_');
}

/** 所有支持详情页的 component_key（必须与 page_modules 表一致） */
const SUPPORTED_KEYS = new Set([
  'medical_packages',
  'hyogo_medical',
  'kindai_hospital',
  'cancer_treatment',
  'sai_clinic',
  'wclinic_mens',
  'helene_clinic',
  'ginza_phoenix',
  'cell_medicine',
  'ac_plus',
  'igtc',
  'osaka_himak',
]);

export default async function ModuleDetailPage({ params }: PageProps) {
  const { slug, moduleSlug } = await params;
  const componentKey = toComponentKey(moduleSlug);

  if (!SUPPORTED_KEYS.has(componentKey)) {
    notFound();
  }

  // 验证导游已选择此模块
  const result = await getGuideModuleByComponentKey(slug, componentKey);
  if (!result) {
    notFound();
  }

  // 渲染官方内容（不注入品牌信息）
  // 导游品牌仅通过 layout 的 DistributionNav + FloatingContact 展示
  switch (componentKey) {
    case 'medical_packages':
      return <TIMCContent isGuideEmbed guideSlug={slug} />;

    case 'hyogo_medical':
      return <HyogoMedicalContent isGuideEmbed guideSlug={slug} />;

    case 'kindai_hospital':
      return <KindaiHospitalContent isGuideEmbed guideSlug={slug} />;

    case 'sai_clinic': {
      const images = await getSaiClinicImages();
      return <SaiClinicContent isGuideEmbed guideSlug={slug} images={images} />;
    }

    case 'cancer_treatment':
      return <OICIContent isGuideEmbed guideSlug={slug} />;

    case 'helene_clinic':
      return <HeleneClinicContent isGuideEmbed guideSlug={slug} />;

    case 'ginza_phoenix':
      return <GinzaPhoenixContent isGuideEmbed guideSlug={slug} />;

    case 'wclinic_mens':
      return <WClinicMensContent isGuideEmbed guideSlug={slug} />;

    case 'cell_medicine':
      return <CellMedicineContent isGuideEmbed guideSlug={slug} />;

    case 'ac_plus':
      return <ACPlusContent isGuideEmbed guideSlug={slug} />;

    case 'igtc':
      return <IGTCContent isGuideEmbed guideSlug={slug} />;

    case 'osaka_himak':
      return <OsakaHimakContent isGuideEmbed guideSlug={slug} />;

    default:
      notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, moduleSlug } = await params;
  const componentKey = toComponentKey(moduleSlug);
  const result = await getGuideModuleByComponentKey(slug, componentKey);

  if (!result) {
    return { title: '页面不存在' };
  }

  const moduleName = result.module.customTitle || result.module.module.name;

  return {
    title: `${moduleName} - 新岛交通`,
    description: result.module.module.description || `新岛交通 - ${moduleName}`,
  };
}
