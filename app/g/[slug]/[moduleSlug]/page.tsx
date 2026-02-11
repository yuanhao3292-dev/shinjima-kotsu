import { notFound } from 'next/navigation';
import { getGuideModuleByComponentKey, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import MedicalPackagesFullPage from '@/components/modules/MedicalPackagesFullPage';
import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';

interface PageProps {
  params: Promise<{ slug: string; moduleSlug: string }>;
}

/** 将 URL slug (medical-packages) 转换为 component_key (medical_packages) */
function toComponentKey(urlSlug: string): string {
  return urlSlug.replace(/-/g, '_');
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { slug, moduleSlug } = await params;
  const componentKey = toComponentKey(moduleSlug);

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

  // 根据 component_key 渲染对应的详情页组件
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
      return (
        <HyogoMedicalContent
          whitelabel={{
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
          }}
        />
      );

    default:
      // 未实现详情页的模块 → 404
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
