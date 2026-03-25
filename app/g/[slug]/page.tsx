import { notFound } from 'next/navigation';
import { getCachedDistributionPageWithTag } from '@/lib/cache/whitelabel-cache';
import { ArrowRight } from 'lucide-react';
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

/** 支持详情页的 component_key（必须与 page_modules 表一致） */
const DETAIL_MODULES = new Set([
  'medical_packages', 'hyogo_medical', 'kindai_hospital', 'cancer_treatment',
  'sai_clinic', 'wclinic_mens',
  'helene_clinic', 'ginza_phoenix', 'cell_medicine', 'ac_plus', 'igtc',
  'osaka_himak',
]);

/** 详情页首图映射（确保首页背景图严格复用详情页首图） */
const DETAIL_PAGE_HERO_IMAGES: Record<string, string> = {
  medical_packages: 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg',
  health_screening: 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg', // 和 medical_packages 共用
  sai_clinic: 'https://saicli.jp/wp-content/themes/initializr/img/topFvImg01.jpg',
  hyogo_medical: 'https://www.hosp.hyo-med.ac.jp/library/petcenter/institution/img/img01.jpg',
  kindai_hospital: 'https://www.med.kindai.ac.jp/img/about/relocation/mv.webp',
  cancer_treatment: 'https://www.nihonsekkei.co.jp/wp-content/uploads/2017/07/3c692a8b8911831af2d1fd6bfcd4e0e7.jpg',
  helene_clinic: 'https://stemcells.jp/en/wp-content/themes/flavor_flavor_flavor/images/top/top-firstview-bg.webp',
  ginza_phoenix: 'https://static.wixstatic.com/media/1778a7_4417743f0826481297af97cd36d5a362~mv2.jpg',
  wclinic_mens: 'https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/new/img/top/image03.png',
  cell_medicine: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2000&auto=format&fit=crop',
  ac_plus: 'https://cdn.yun.sooce.cn/6/60567/png/1751617672017b7325ee433cf0da1346880da57c866f4.png?version=0',
  igtc: 'https://igtc.jp/wp-content/themes/igtclinic/images/top/mainVisual_img01.jpg',
  osaka_himak: 'https://www.osaka-himak.or.jp/cn/images/top/sec_slide01_mv_img01_pc.jpg',
};

export default async function GuideHomePage({ params }: PageProps) {
  const { slug } = await params;
  const pageData = await getCachedDistributionPageWithTag(slug);

  if (!pageData) {
    notFound();
  }

  const { guide, selectedModules } = pageData;

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
              src={DETAIL_PAGE_HERO_IMAGES[heroCard.componentKey] || heroCard.config.heroImage}
              alt={heroCard.config.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${heroTheme.gradientFrom} ${heroTheme.gradientVia} to-transparent`} />
          </>
        )}
        {!heroCard && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            {heroCard && (
              <>
                {/* 标签 */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-white/40" />
                  <span className="text-xs tracking-[0.3em] text-white/70 uppercase">
                    {heroCard.config.tagline}
                  </span>
                </div>

                {/* 标题 */}
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  {heroCard.customTitle || heroCard.config.title}
                </h1>

                {/* 描述 */}
                <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                  {heroCard.config.description}
                </p>

                {/* 数据统计 */}
                {heroCard.config.stats.length > 0 && (
                  <div className="flex gap-8 mb-10">
                    {heroCard.config.stats.slice(0, 3).map((stat, idx) => (
                      <div key={idx}>
                        <div className="text-3xl font-bold text-white mb-1">
                          {stat.value}<span className="text-white/60 text-xl ml-1">{stat.unit}</span>
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA 按钮 */}
                <Link
                  href={`/g/${slug}/${toUrlSlug(heroCard.componentKey)}`}
                  className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                >
                  {heroCard.config.ctaText} <ArrowRight size={18} />
                </Link>
              </>
            )}
            {!heroCard && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-white/40" />
                  <span className="text-xs tracking-[0.3em] text-white/60 uppercase">Japan Premium Medical & Beauty</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  NIIJIMA
                </h1>
                <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
                  专业医疗旅行服务平台，提供预约安排、中文翻译、全程陪同等一站式服务，让您安心就医。
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 合作机构（全屏沉浸式展示）━━━━━━━━ */}
      {productCards.slice(1).map(({ config: dc, componentKey, customTitle }, index) => {
        const theme = COLOR_THEMES[dc.colorTheme as ColorTheme] || COLOR_THEMES.teal;
        const detailHref = `/g/${slug}/${toUrlSlug(componentKey)}`;

        return (
          <section
            key={dc.sectionId}
            className="relative min-h-screen flex items-center overflow-hidden"
            id={`service-${index + 1}`}
          >
            {/* 背景图片（直接复用详情页首图） */}
            <img
              src={DETAIL_PAGE_HERO_IMAGES[componentKey] || dc.heroImage}
              alt={dc.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* 渐变蒙层 */}
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} to-transparent`} />

            {/* 内容区 */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
              <div className="max-w-2xl">
                {/* 标签 */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-white/40" />
                  <span className="text-xs tracking-[0.3em] text-white/70 uppercase">
                    {dc.tagline}
                  </span>
                </div>

                {/* 标题 */}
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  {customTitle || dc.title}
                </h2>

                {/* 描述 */}
                <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                  {dc.description}
                </p>

                {/* 数据统计 */}
                {dc.stats.length > 0 && (
                  <div className="flex gap-8 mb-10">
                    {dc.stats.slice(0, 3).map((stat, idx) => (
                      <div key={idx}>
                        <div className="text-3xl font-bold text-white mb-1">
                          {stat.value}<span className="text-white/60 text-xl ml-1">{stat.unit}</span>
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA 按钮 */}
                <Link
                  href={detailHref}
                  className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                >
                  {dc.ctaText} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* ━━━━━━━━ 合作伙伴 ━━━━━━━━ */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">Partners</p>
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-900 tracking-wide">合作伙伴</h2>
          </div>

          {/* 医疗合作机构 */}
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-4 text-center">医疗合作机构</p>
            <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-md mx-auto">
              {[
                { name: '徳洲会グループ', sub: 'Tokushukai Group' },
                { name: 'TIMC OSAKA', sub: 'Medical Center' },
              ].map((partner, index) => (
                <div key={index} className="bg-white p-6 text-center border border-neutral-200 hover:border-neutral-300 transition-colors">
                  <div className="text-sm font-medium text-neutral-900 mb-1">{partner.name}</div>
                  <div className="text-[10px] text-neutral-400">{partner.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 服务合作伙伴 */}
          <div>
            <p className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-4 text-center">服务合作伙伴</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
              {[
                { name: '南海国際旅行', sub: 'Nankai International Travel' },
                { name: '大丸松坂屋百貨', sub: 'Daimaru Matsuzakaya' },
                { name: '近鉄百貨店', sub: 'Kintetsu Department Store' },
                { name: '海南航空', sub: 'Hainan Airlines' },
                { name: 'INSOU', sub: 'INSOU Holdings' },
                { name: 'アリババ日本', sub: 'Alibaba Japan' },
              ].map((partner, index) => (
                <div key={index} className="bg-white p-6 text-center border border-neutral-200 hover:border-neutral-300 transition-colors">
                  <div className="text-sm font-medium text-neutral-900 mb-1">{partner.name}</div>
                  <div className="text-[10px] text-neutral-400">{partner.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 企业理念 ━━━━━━━━ */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 text-center">
          <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-6">Corporate Philosophy</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-8 leading-relaxed">
            用心连结世界与日本
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            我们致力于为全球旅客提供优质的日本旅游体验。我们相信，真正的服务不仅是满足需求，更是创造感动。
          </p>
          <a
            href="/company/about"
            className="inline-flex items-center text-xs text-white border border-white/30 px-8 py-3 hover:bg-white hover:text-gray-900 transition-all tracking-wider"
          >
            企业介绍
            <ArrowRight size={14} className="ml-2" />
          </a>
        </div>
      </section>
    </>
  );
}
