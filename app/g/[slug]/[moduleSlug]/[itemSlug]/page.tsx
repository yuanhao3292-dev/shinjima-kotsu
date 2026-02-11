import { notFound } from 'next/navigation';
import { getGuideModuleByComponentKey, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import MedicalPackageBooking from '@/components/modules/MedicalPackageBooking';

interface PageProps {
  params: Promise<{ slug: string; moduleSlug: string; itemSlug: string }>;
}

/** 将 URL slug (medical-packages) 转换为 component_key (medical_packages) */
function toComponentKey(urlSlug: string): string {
  return urlSlug.replace(/-/g, '_');
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { slug, moduleSlug, itemSlug } = await params;
  const componentKey = toComponentKey(moduleSlug);

  const result = await getGuideModuleByComponentKey(slug, componentKey);
  if (!result) {
    notFound();
  }

  const { guide } = result;
  const brandName = guide.brandName || guide.name;

  // 记录页面访问
  const headersList = await headers();
  const referer = headersList.get('referer') || undefined;
  recordPageView(guide.id, {
    pagePath: `/g/${slug}/${moduleSlug}/${itemSlug}`,
    referrer: referer,
  }).catch(() => {});

  // 根据 component_key 渲染对应的子项详情组件
  switch (componentKey) {
    case 'medical_packages':
      return (
        <MedicalPackageBooking
          packageSlug={itemSlug}
          guideSlug={slug}
          brandName={brandName}
        />
      );

    default:
      notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, moduleSlug, itemSlug } = await params;
  const componentKey = toComponentKey(moduleSlug);
  const result = await getGuideModuleByComponentKey(slug, componentKey);

  if (!result) {
    return { title: '页面不存在' };
  }

  const brandName = result.guide.brandName || result.guide.name;

  // 套餐名称映射
  const packageNames: Record<string, string> = {
    'vip-member-course': 'VIP 会员套餐',
    'premium-cardiac-course': '高端心脏套餐',
    'select-gastro-colonoscopy': '胃肠镜精选套餐',
    'select-gastroscopy': '胃镜精选套餐',
    'dwibs-cancer-screening': 'DWIBS 癌症筛查',
    'basic-checkup': '基础体检套餐',
  };

  const itemName = packageNames[itemSlug] || itemSlug;

  return {
    title: `${itemName} - ${brandName}`,
    description: `${brandName} - ${itemName} 预约`,
  };
}
