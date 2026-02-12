import { notFound } from 'next/navigation';
import { getGuideDistributionPage } from '@/lib/services/whitelabel';
import { ArrowRight, Shield, Award, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { ImmersiveDisplayConfig } from '@/lib/types/display-config';
import { COLOR_THEMES, type ColorTheme } from '@/lib/types/display-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** component_key → URL slug */
function toUrlSlug(componentKey: string): string {
  return componentKey.replace(/_/g, '-');
}

/** 支持详情页的 component_key */
const DETAIL_MODULES = new Set([
  'medical_packages', 'hyogo_medical', 'cancer_treatment',
  'golf', 'medical_tourism', 'health_screening', 'sai_clinic',
]);

export default async function GuideHomePage({ params }: PageProps) {
  const { slug } = await params;
  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    notFound();
  }

  const { guide, selectedModules } = pageData;
  const brandName = guide.brandName || guide.name;

  // 提取有沉浸式配置的产品卡片
  const productCards = selectedModules
    .filter((m) => {
      const dc = m.module.displayConfig;
      return dc && dc.template === 'immersive' && m.module.componentKey && DETAIL_MODULES.has(m.module.componentKey);
    })
    .map((m) => ({
      config: m.module.displayConfig as ImmersiveDisplayConfig,
      componentKey: m.module.componentKey!,
      customTitle: m.customTitle,
      moduleName: m.module.name,
    }));

  // 第一个产品卡片用作 hero 背景
  const heroCard = productCards[0];
  const heroTheme = heroCard
    ? COLOR_THEMES[heroCard.config.colorTheme as ColorTheme] || COLOR_THEMES.teal
    : COLOR_THEMES.teal;

  return (
    <>
      {/* ━━━━━━━━ Hero Section ━━━━━━━━ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gray-950">
        {heroCard && (
          <>
            <img
              src={heroCard.config.heroImage}
              alt={heroCard.config.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${heroTheme.gradientFrom} ${heroTheme.gradientVia} to-transparent`} />
          </>
        )}
        {!heroCard && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-white/40" />
              <span className="text-xs tracking-[0.3em] text-white/60 uppercase">Japan Premium Medical & Beauty</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {brandName}
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              为您甄选日本顶级医疗与美容机构，提供专业中文服务、全程陪同、安心无忧的高端定制体验。
            </p>
            {productCards.length > 0 && (
              <Link
                href={`/g/${slug}/${toUrlSlug(productCards[0].componentKey)}`}
                className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
              >
                查看服务项目 <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 合作机构 ━━━━━━━━ */}
      {productCards.length > 0 && (
        <section className="py-20 bg-white" id="services">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-sm tracking-widest text-gray-400 uppercase">Partner Institutions</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-3">合作医疗机构</h2>
              <p className="text-gray-500 text-sm mt-2">每一家都经过严格筛选，确保为您提供最优质的服务</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {productCards.map(({ config: dc, componentKey, customTitle }) => {
                const theme = COLOR_THEMES[dc.colorTheme as ColorTheme] || COLOR_THEMES.teal;
                const detailHref = `/g/${slug}/${toUrlSlug(componentKey)}`;

                return (
                  <Link
                    key={dc.sectionId}
                    href={detailHref}
                    className="group block relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-72">
                      <img
                        src={dc.heroImage}
                        alt={dc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <p className="text-[10px] tracking-[0.25em] text-white/60 uppercase mb-1">
                          {dc.tagline}
                        </p>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {customTitle || dc.title}
                        </h3>
                        <p className="text-sm text-white/70 mb-3 line-clamp-2">{dc.description}</p>

                        {dc.stats.length > 0 && (
                          <div className="flex gap-5 mb-3">
                            {dc.stats.slice(0, 3).map((stat, idx) => (
                              <div key={idx}>
                                <div className="text-base font-light text-white">
                                  {stat.value}<span className="text-white/60">{stat.unit}</span>
                                </div>
                                <div className="text-[9px] text-white/40 uppercase">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:translate-x-1 transition-transform">
                          {dc.ctaText} <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━━━ 信赖保障 ━━━━━━━━ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">正规旅行社资质</h4>
              <p className="text-sm text-gray-500">新岛交通株式会社<br />大阪府知事登録旅行業 第2-3115号</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Award size={24} className="text-amber-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">严选合作机构</h4>
              <p className="text-sm text-gray-500">每家机构经过严格审核<br />确保医疗品质与服务水准</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <MapPin size={24} className="text-emerald-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">全程中文服务</h4>
              <p className="text-sm text-gray-500">从咨询到术后跟进<br />全程专业中文陪同</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
