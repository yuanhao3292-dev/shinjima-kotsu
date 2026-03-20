import { notFound } from 'next/navigation';
import TIMCContent from '@/app/guide-partner/product-center/timc/TIMCContent';
import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';
import SaiClinicContent from '@/app/sai-clinic/SaiClinicContent';
import HeleneClinicContent from '@/app/helene-clinic/HeleneClinicContent';
import { getSaiClinicImages } from '@/lib/services/sai-clinic-images';

interface PageProps {
  params: Promise<{ moduleSlug: string }>;
}

function toComponentKey(urlSlug: string): string {
  return urlSlug.replace(/-/g, '_');
}

const DEMO_MODULES = new Set([
  'medical_packages',
  'hyogo_medical',
  'sai_clinic',
  'helene_clinic',
]);

export default async function DemoModulePage({ params }: PageProps) {
  const { moduleSlug } = await params;
  const componentKey = toComponentKey(moduleSlug);

  if (!DEMO_MODULES.has(componentKey)) {
    notFound();
  }

  switch (componentKey) {
    case 'medical_packages':
      return <TIMCContent isGuideEmbed guideSlug="demo" />;
    case 'hyogo_medical':
      return <HyogoMedicalContent isGuideEmbed guideSlug="demo" />;
    case 'sai_clinic': {
      const images = await getSaiClinicImages();
      return <SaiClinicContent isGuideEmbed guideSlug="demo" images={images} />;
    }
    case 'helene_clinic':
      return <HeleneClinicContent isGuideEmbed guideSlug="demo" />;
    default:
      notFound();
  }
}

const MODULE_TITLES: Record<string, string> = {
  medical_packages: '日本精密健康检查',
  hyogo_medical: '兵库医科大学病院',
  sai_clinic: 'SAI 美容外科诊所',
  helene_clinic: '干细胞再生医疗',
};

export async function generateMetadata({ params }: PageProps) {
  const { moduleSlug } = await params;
  const key = toComponentKey(moduleSlug);
  const title = MODULE_TITLES[key];
  if (!title) return { title: '页面不存在' };
  return { title: `${title} - 示例品牌` };
}
