import { notFound } from 'next/navigation';
import { getGuideDistributionPage, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import { ArrowRight } from 'lucide-react';
import DistributionNav from '@/components/distribution/DistributionNav';
import FloatingContact from '@/components/distribution/FloatingContact';
import type { ImmersiveDisplayConfig } from '@/lib/types/display-config';
import { COLOR_THEMES, type ColorTheme } from '@/lib/types/display-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideDistributionPage({ params }: PageProps) {
  const { slug } = await params;

  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    notFound();
  }

  const { guide, selectedModules } = pageData;

  // 记录页面访问
  const headersList = await headers();
  const referer = headersList.get('referer') || undefined;
  recordPageView(guide.id, {
    pagePath: `/g/${slug}`,
    referrer: referer,
  }).catch(() => {});

  const brandName = guide.brandName || guide.name;
  const brandColor = guide.brandColor || '#2563eb';

  // 支持独立详情页的 component_key
  const DETAIL_MODULES = new Set([
    'medical_packages', 'hyogo_medical', 'cancer_treatment',
    'golf', 'medical_tourism', 'health_screening', 'sai_clinic',
  ]);

  // 提取有沉浸式配置的产品
  const productCards: Array<{ config: ImmersiveDisplayConfig; componentKey: string }> = [];
  selectedModules.forEach((m) => {
    const dc = m.module.displayConfig;
    if (dc && dc.template === 'immersive') {
      productCards.push({ config: dc, componentKey: m.module.componentKey });
    }
  });

  // 导航
  const navItems: Array<{ id: string; label: string }> = [];
  if (productCards.length > 0) navItems.push({ id: 'products', label: '服务项目' });

  // 联系信息
  const contactInfo = {
    wechat: guide.contactWechat || null,
    line: guide.contactLine || null,
    phone: guide.contactDisplayPhone || null,
    email: guide.email || null,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 - 仅显示导游 logo/名称 */}
      <DistributionNav
        brandName={brandName}
        brandColor={brandColor}
        brandLogoUrl={guide.brandLogoUrl}
        navItems={navItems}
        startScrolled
      />

      {/* 产品卡片网格 - 主要内容 */}
      {productCards.length > 0 && (
        <section id="products" className="pt-20 pb-12">
          <div className="max-w-5xl mx-auto px-6 space-y-6">
            {productCards.map(({ config: dc, componentKey }) => {
              const theme = COLOR_THEMES[dc.colorTheme as ColorTheme] || COLOR_THEMES.teal;
              const detailHref = DETAIL_MODULES.has(componentKey)
                ? `/g/${slug}/${componentKey.replace(/_/g, '-')}`
                : '#';

              return (
                <a
                  key={dc.sectionId}
                  href={detailHref}
                  className="group block relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* 背景图 + 渐变遮罩 */}
                  <div className="relative h-64 sm:h-72">
                    <img
                      src={dc.heroImage}
                      alt={dc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} to-transparent`} />

                    {/* 产品信息 */}
                    <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                      <div className="max-w-lg">
                        <p className={`text-[10px] tracking-[0.25em] ${theme.accent} uppercase mb-2`}>
                          {dc.tagline}
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                          {dc.title}
                        </h2>
                        <p className={`text-base sm:text-lg ${theme.accent} mb-3`}>{dc.subtitle}</p>
                        <p className={`text-sm ${theme.descText} line-clamp-2 mb-4`}>{dc.description}</p>

                        {/* Stats 简化展示 */}
                        {dc.stats.length > 0 && (
                          <div className="flex gap-6 mb-4">
                            {dc.stats.slice(0, 3).map((stat, idx) => (
                              <div key={idx}>
                                <div className="text-lg font-light text-white">
                                  {stat.value}<span className={theme.accent}>{stat.unit}</span>
                                </div>
                                <div className={`text-[10px] ${theme.statSubtext} uppercase`}>{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        <span className={`inline-flex items-center gap-2 px-5 py-2.5 ${theme.ctaBg} ${theme.ctaText} text-sm font-medium rounded-lg transition-transform group-hover:translate-x-1`}>
                          {dc.ctaText}
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 悬浮联系按钮 */}
      <FloatingContact
        brandColor={brandColor}
        contactInfo={contactInfo}
      />

      {/* 页脚 - 简洁 */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-sm text-gray-400 space-y-1">
            <p>旅行服务由 新岛交通株式会社 提供</p>
            <p>大阪府知事登録旅行業 第2-3115号</p>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
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
    description: pageData.config.seoDescription || '专业日本高端体检、医疗服务。中文服务、专属定制。',
  };
}
