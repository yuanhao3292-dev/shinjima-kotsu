import { notFound } from 'next/navigation';
import { getGuideModuleByComponentKey } from '@/lib/services/whitelabel';
import TIMCContent from '@/app/guide-partner/product-center/timc/TIMCContent';
import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';
import SaiClinicContent from '@/app/sai-clinic/SaiClinicContent';
import CancerTreatmentContent from '@/app/cancer-treatment/CancerTreatmentContent';
import GolfContent from '@/app/business/golf/GolfContent';
import MedicalTourismContent from '@/app/business/medical/MedicalTourismContent';
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
  'health_screening',
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
      return <CancerTreatmentContent isGuideEmbed />;

    case 'golf':
      return <GolfContent isGuideEmbed />;

    case 'medical_tourism':
      return <MedicalTourismContent isGuideEmbed />;

    case 'health_screening':
      return <TIMCContent isGuideEmbed guideSlug={slug} />;

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
