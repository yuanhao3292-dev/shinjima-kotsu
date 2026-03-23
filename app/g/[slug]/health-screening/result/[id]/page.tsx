import { notFound } from 'next/navigation';
import { getGuideDistributionPage } from '@/lib/services/whitelabel';
import type { ImmersiveDisplayConfig } from '@/lib/types/display-config';
import WhitelabelResultClient from './WhitelabelResultClient';

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

/** component_key → URL slug */
function toUrlSlug(componentKey: string): string {
  return componentKey.replace(/_/g, '-');
}

/** 有详情页的模块 */
const DETAIL_MODULES = new Set([
  'medical_packages', 'hyogo_medical', 'cancer_treatment',
  'sai_clinic', 'wclinic_mens',
  'helene_clinic', 'ginza_phoenix', 'cell_medicine', 'ac_plus', 'igtc',
]);

export default async function WhitelabelResultPage({ params }: PageProps) {
  const { slug, id } = await params;

  const pageData = await getGuideDistributionPage(slug);
  if (!pageData) {
    notFound();
  }

  const { guide, selectedModules } = pageData;
  const brandName = guide.brandName || guide.name;

  // 构建推荐服务列表（从导游选择的模块中提取）
  const recommendedServices = selectedModules
    .filter((m) => m.module.componentKey && DETAIL_MODULES.has(m.module.componentKey))
    .map((m) => {
      const dc = m.module.displayConfig as ImmersiveDisplayConfig | null;
      return {
        name: m.customTitle || dc?.title || m.module.name,
        description: dc?.description || m.module.description || '',
        href: `/g/${slug}/${toUrlSlug(m.module.componentKey!)}`,
        heroImage: dc?.heroImage || m.module.thumbnailUrl || '',
      };
    });

  // 联系信息
  const contactInfo = {
    brandName,
    wechat: guide.contactWechat || null,
    line: guide.contactLine || null,
    phone: guide.contactDisplayPhone || null,
    email: guide.email || null,
  };

  return (
    <WhitelabelResultClient
      slug={slug}
      screeningId={id}
      recommendedServices={recommendedServices}
      contactInfo={contactInfo}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    return { title: '页面不存在' };
  }

  return {
    title: `AI 健康评估报告 - 新岛交通`,
    description: '基于 AI 智能分析的健康评估报告',
  };
}
