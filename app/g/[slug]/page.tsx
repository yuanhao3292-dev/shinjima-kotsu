import { notFound, redirect } from 'next/navigation';
import { getGuideDistributionPage } from '@/lib/services/whitelabel';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * /g/[slug] 落地页
 * 自动跳转到第一个可用产品的独立详情页
 */
export default async function GuideDistributionPage({ params }: PageProps) {
  const { slug } = await params;

  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    notFound();
  }

  const { selectedModules } = pageData;

  // 支持独立详情页的 component_key
  const DETAIL_MODULES = new Set([
    'medical_packages', 'hyogo_medical', 'cancer_treatment',
    'golf', 'medical_tourism', 'health_screening', 'sai_clinic',
  ]);

  // 找到第一个有详情页的模块，跳转过去
  const firstModule = selectedModules.find(
    (m) => DETAIL_MODULES.has(m.module.componentKey)
  );

  if (firstModule) {
    const moduleSlug = firstModule.module.componentKey.replace(/_/g, '-');
    redirect(`/g/${slug}/${moduleSlug}`);
  }

  // 没有可用模块 → 404
  notFound();
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    return { title: '页面不存在' };
  }

  const brandName = pageData.guide.brandName || pageData.guide.name;

  return {
    title: pageData.config.seoTitle || `${brandName} - 日本高端定制旅行`,
    description: pageData.config.seoDescription || '专业日本高端体检、医疗服务、商务考察。中文服务、专属定制。',
  };
}
