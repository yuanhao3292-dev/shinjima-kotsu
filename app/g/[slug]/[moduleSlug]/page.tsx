import { notFound } from 'next/navigation';
import { getGuideModuleByComponentKey } from '@/lib/services/whitelabel';
import TIMCContent from '@/app/guide-partner/product-center/timc/TIMCContent';
import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';
import SaiClinicContent from '@/app/sai-clinic/SaiClinicContent';
import OICIContent from '@/app/oici/OICIContent';
import GolfContent from '@/app/business/golf/GolfContent';
import MedicalTourismContent from '@/app/business/medical/MedicalTourismContent';
import HeleneClinicContent from '@/app/helene-clinic/HeleneClinicContent';
import GinzaPhoenixContent from '@/app/ginza-phoenix/GinzaPhoenixContent';
import WClinicMensContent from '@/app/wclinic-mens/WClinicMensContent';
import CellMedicineContent from '@/app/cell-medicine/CellMedicineContent';
import ACPlusContent from '@/app/ac-plus/ACPlusContent';
import { getSaiClinicImages } from '@/lib/services/sai-clinic-images';

interface PageProps {
  params: Promise<{ slug: string; moduleSlug: string }>;
}

/** 将 URL slug (medical-packages) 转换为 component_key (medical_packages) */
function toComponentKey(urlSlug: string): string {
  return urlSlug.replace(/-/g, '_');
}

/** 所有支持详情页的 component_key */
const SUPPORTED_KEYS = new Set([
  'medical_packages',
  'hyogo_medical',
  'sai_clinic',
  'cancer_treatment',
  'golf',
  'medical_tourism',
  'helene_clinic',
  'ginza_phoenix',
  'wclinic_mens',
  'cell_medicine',
  'ac_plus',
  // health_screening 已迁移到 /g/[slug]/health-screening/ 独立路由
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
      return <HyogoMedicalContent isGuideEmbed />;

    case 'sai_clinic': {
      const images = await getSaiClinicImages();
      return <SaiClinicContent isGuideEmbed images={images} />;
    }

    case 'cancer_treatment':
      return <OICIContent isGuideEmbed />;

    case 'golf':
      return <GolfContent isGuideEmbed />;

    case 'medical_tourism':
      return <MedicalTourismContent isGuideEmbed />;

    case 'helene_clinic':
      return <HeleneClinicContent isGuideEmbed />;

    case 'ginza_phoenix':
      return <GinzaPhoenixContent isGuideEmbed />;

    case 'wclinic_mens':
      return <WClinicMensContent isGuideEmbed />;

    case 'cell_medicine':
      return <CellMedicineContent isGuideEmbed />;

    case 'ac_plus':
      return <ACPlusContent isGuideEmbed />;

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

  const brandName = result.guide.brandName || result.guide.name;
  const moduleName = result.module.customTitle || result.module.module.name;

  return {
    title: `${moduleName} - ${brandName}`,
    description: result.module.module.description || `${brandName} - ${moduleName}`,
  };
}
