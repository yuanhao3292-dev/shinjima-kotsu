import { notFound } from 'next/navigation';
import { getGuideModuleByComponentKey, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import MedicalPackagesFullPage from '@/components/modules/MedicalPackagesFullPage';
import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';
import SaiClinicContent from '@/app/sai-clinic/SaiClinicContent';
import CancerTreatmentContent from '@/app/cancer-treatment/CancerTreatmentContent';
import GolfContent from '@/app/business/golf/GolfContent';
import MedicalTourismContent from '@/app/business/medical/MedicalTourismContent';
import type { WhitelabelModuleProps } from '@/components/whitelabel-modules/types';

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

  // 不支持的 key 直接 404
  if (!SUPPORTED_KEYS.has(componentKey)) {
    notFound();
  }

  const result = await getGuideModuleByComponentKey(slug, componentKey);
  if (!result) {
    notFound();
  }

  const { guide, module: selectedModule } = result;
  const brandName = guide.brandName || guide.name;
  const brandColor = guide.brandColor || '#2563eb';

  // 记录页面访问
  const headersList = await headers();
  const referer = headersList.get('referer') || undefined;
  recordPageView(guide.id, {
    pagePath: `/g/${slug}/${moduleSlug}`,
    referrer: referer,
  }).catch(() => {});

  // 构建通用白标 props（注入导游的品牌和联系方式）
  const whitelabelProps: WhitelabelModuleProps = {
    brandName,
    brandColor,
    contactInfo: {
      wechat: guide.contactWechat || null,
      line: guide.contactLine || null,
      phone: guide.contactDisplayPhone || null,
      email: guide.email || null,
    },
    moduleId: selectedModule.module.id,
    moduleName: selectedModule.customTitle || selectedModule.module.name,
  };

  // 根据 component_key 渲染对应的后台详情页组件（内容不变，只注入品牌信息）
  switch (componentKey) {
    case 'medical_packages':
      return (
        <MedicalPackagesFullPage
          guideSlug={slug}
          brandColor={brandColor}
          brandName={brandName}
        />
      );

    case 'hyogo_medical':
      return <HyogoMedicalContent whitelabel={whitelabelProps} />;

    case 'sai_clinic':
      return <SaiClinicContent whitelabel={whitelabelProps} />;

    case 'cancer_treatment':
      return <CancerTreatmentContent whitelabel={whitelabelProps} />;

    case 'golf':
      return <GolfContent whitelabel={whitelabelProps} />;

    case 'medical_tourism':
      return <MedicalTourismContent whitelabel={whitelabelProps} />;

    case 'health_screening':
      // health_screening 复用 medical_packages
      return (
        <MedicalPackagesFullPage
          guideSlug={slug}
          brandColor={brandColor}
          brandName={brandName}
        />
      );

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
