import { notFound } from 'next/navigation';
import { getGuideModuleByComponentKey } from '@/lib/services/whitelabel';
import PackageDetailContent from '@/app/medical-packages/[slug]/PackageDetailContent';

interface PageProps {
  params: Promise<{ slug: string; moduleSlug: string; itemSlug: string }>;
}

function toComponentKey(urlSlug: string): string {
  return urlSlug.replace(/-/g, '_');
}

const ITEM_DETAIL_MODULES = new Set(['medical_packages', 'health_screening']);

export default async function GuideItemDetailPage({ params }: PageProps) {
  const { slug, moduleSlug, itemSlug } = await params;
  const componentKey = toComponentKey(moduleSlug);

  if (!ITEM_DETAIL_MODULES.has(componentKey)) {
    notFound();
  }

  const result = await getGuideModuleByComponentKey(slug, componentKey);
  if (!result) {
    notFound();
  }

  const backHref = `/g/${slug}/${moduleSlug}`;

  return (
    <PackageDetailContent
      packageSlug={itemSlug}
      isGuideEmbed
      backHref={backHref}
      guideSlug={slug}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, moduleSlug, itemSlug } = await params;
  const componentKey = toComponentKey(moduleSlug);
  const result = await getGuideModuleByComponentKey(slug, componentKey);

  if (!result) {
    return { title: '页面不存在' };
  }

  const brandName = result.guide.brandName || result.guide.name;

  return {
    title: `${itemSlug.replace(/-/g, ' ')} - ${brandName}`,
    description: `${brandName} - 体检套餐详情`,
  };
}
