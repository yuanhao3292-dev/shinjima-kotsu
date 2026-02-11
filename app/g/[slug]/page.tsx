import { notFound } from 'next/navigation';
import { getGuideDistributionPage, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import {
  Car,
  User,
  Package,
  ChevronRight,
  ChevronDown,
  Users,
  Shield,
  Globe,
  Star,
  HeartHandshake,
} from 'lucide-react';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';
import ImmersiveSection from '@/components/distribution/ImmersiveSection';
import DistributionNav from '@/components/distribution/DistributionNav';
import type { ImmersiveDisplayConfig } from '@/lib/types/display-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideDistributionPage({ params }: PageProps) {
  const { slug } = await params;

  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    notFound();
  }

  const { guide, config, selectedModules, selectedVehicles } = pageData;

  // 记录页面访问
  const headersList = await headers();
  const referer = headersList.get('referer') || undefined;
  recordPageView(guide.id, {
    pagePath: `/g/${slug}`,
    referrer: referer,
  }).catch(() => {});

  const brandName = guide.brandName || guide.name;
  const brandColor = guide.brandColor || '#2563eb';

  // ======== 数据驱动渲染：按 display_config 分类模块 ========
  const DETAIL_MODULES = new Set(['medical_packages']);

  const immersiveModules: Array<{ config: ImmersiveDisplayConfig; componentKey: string }> = [];
  const genericModules = selectedModules.filter((m) => {
    const dc = m.module.displayConfig;
    if (dc && dc.template === 'immersive') {
      immersiveModules.push({ config: dc, componentKey: m.module.componentKey });
      return false;
    }
    return true;
  });

  // 构建动态导航
  const navItems: Array<{ id: string; label: string }> = [
    { id: 'about', label: '关于我们' },
  ];
  immersiveModules.forEach(({ config: dc }) => {
    navItems.push({ id: dc.sectionId, label: dc.navLabel });
  });
  if (selectedVehicles.length > 0) navItems.push({ id: 'vehicles', label: '车辆介绍' });
  if (genericModules.length > 0) navItems.push({ id: 'services', label: '服务项目' });
  navItems.push({ id: 'contact', label: '联系我们' });

  // 构建联系信息
  const contactInfo = {
    wechat: guide.contactWechat,
    line: guide.contactLine,
    phone: guide.contactDisplayPhone,
    email: guide.email,
  };

  // 计算服务数量（用于 Hero stats）
  const totalServices = selectedModules.length;
  const totalVehicles = selectedVehicles.length;

  return (
    <div className="min-h-screen bg-white">
      {/* ========= Navigation (Client Component) ========= */}
      <DistributionNav
        brandName={brandName}
        brandColor={brandColor}
        brandLogoUrl={guide.brandLogoUrl}
        navItems={navItems}
      />

      {/* ========= Hero Section — Full Screen ========= */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, -40)} 50%, ${adjustColor(brandColor, -70)} 100%)`,
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }}
        />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24 w-full">
          {/* Tagline badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            日本旅行 · 医疗体检 · 定制服务
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
            {config.seoTitle || (
              <>
                {brandName}
                <br />
                <span className="text-white/70">日本高端定制旅行</span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed">
            {config.seoDescription || '专业日本高端医疗体检、商务考察、私人定制服务。中文服务、专属定制、全程陪同。'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-20">
            <a
              href={immersiveModules.length > 0 ? `#${immersiveModules[0].config.sectionId}` : '#services'}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-black/10"
            >
              浏览服务
              <ChevronRight size={20} className="ml-2" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              联系我们
            </a>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-8 md:gap-16">
            {totalServices > 0 && (
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">{totalServices}<span className="text-white/50 text-xl">+</span></div>
                <div className="text-white/50 text-sm mt-1">精选服务</div>
              </div>
            )}
            {totalVehicles > 0 && (
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">{totalVehicles}</div>
                <div className="text-white/50 text-sm mt-1">高端车型</div>
              </div>
            )}
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">100<span className="text-white/50 text-xl">%</span></div>
              <div className="text-white/50 text-sm mt-1">中文服务</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">24h</div>
              <div className="text-white/50 text-sm mt-1">随时响应</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} className="animate-bounce" />
        </div>
      </section>

      {/* ========= About Section ========= */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest uppercase" style={{ color: brandColor }}>
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">关于我们</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">为您提供最优质的日本旅行和医疗服务体验</p>
          </div>

          {/* Profile + Feature cards grid */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Profile card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center h-full flex flex-col items-center justify-center">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `${brandColor}15`,
                    boxShadow: `0 0 0 4px white, 0 0 0 8px ${brandColor}30`,
                  }}
                >
                  {guide.brandLogoUrl ? (
                    <img src={guide.brandLogoUrl} alt={brandName} className="w-20 h-20 object-contain rounded-full" />
                  ) : (
                    <User size={40} style={{ color: brandColor }} />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{guide.name}</h3>
                <p className="text-gray-500 mb-6">专业旅行顾问</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${brandColor}10`, color: brandColor }}
                  >
                    中文服务
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${brandColor}10`, color: brandColor }}
                  >
                    专属定制
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${brandColor}10`, color: brandColor }}
                  >
                    高端体验
                  </span>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              <FeatureCard
                icon={<Shield size={24} />}
                brandColor={brandColor}
                title="专业可靠"
                description="持有日本国家认证资质，多年深耕日本高端旅行和医疗服务领域"
              />
              <FeatureCard
                icon={<Globe size={24} />}
                brandColor={brandColor}
                title="中日双语"
                description="全程中文沟通服务，消除语言障碍，让您安心享受日本之旅"
              />
              <FeatureCard
                icon={<Star size={24} />}
                brandColor={brandColor}
                title="高端定制"
                description="根据您的需求量身打造专属行程方案，拒绝千篇一律"
              />
              <FeatureCard
                icon={<HeartHandshake size={24} />}
                brandColor={brandColor}
                title="贴心服务"
                description="从行前咨询到行后跟进，全流程专属管家式服务体验"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======== 数据驱动：动态渲染所有沉浸式板块 ======== */}
      {immersiveModules.map(({ config: dc, componentKey }) => (
        <ImmersiveSection
          key={dc.sectionId}
          config={dc}
          ctaHref={DETAIL_MODULES.has(componentKey) ? `/g/${slug}/${componentKey.replace(/_/g, '-')}` : undefined}
        />
      ))}

      {/* ========= 车辆介绍 ========= */}
      {selectedVehicles.length > 0 && (
        <section id="vehicles" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-medium tracking-widest uppercase" style={{ color: brandColor }}>
                Fleet
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">车辆介绍</h2>
              <p className="text-gray-500 mt-3">为您提供舒适、安全的高端座驾</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectedVehicles.map((sv) => (
                <div key={sv.id} className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden">
                    {sv.vehicle.images?.[0] ? (
                      <img src={sv.vehicle.images[0]} alt={sv.vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Car size={48} className="text-gray-300" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{sv.vehicle.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{sv.vehicle.description || sv.vehicle.vehicleType}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {sv.vehicle.seats} 座
                      </span>
                    </div>
                    {sv.vehicle.features && sv.vehicle.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
                        {sv.vehicle.features.slice(0, 4).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-xs rounded-md font-medium"
                            style={{ backgroundColor: `${brandColor}08`, color: `${brandColor}cc` }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========= 通用服务卡片 ========= */}
      {genericModules.length > 0 && (
        <section id="services" className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-medium tracking-widest uppercase" style={{ color: brandColor }}>
                Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">服务项目</h2>
              <p className="text-gray-500 mt-3">为您精选的优质医疗和旅行服务</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {genericModules.map((sm) => (
                <div key={sm.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${brandColor}10` }}
                      >
                        {sm.module.thumbnailUrl ? (
                          <img src={sm.module.thumbnailUrl} alt={sm.module.name} className="w-8 h-8" />
                        ) : (
                          <Package size={28} style={{ color: brandColor }} />
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{sm.module.name}</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {sm.module.description || '优质服务项目'}
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                      style={{ color: brandColor }}
                    >
                      了解详情
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========= Contact ========= */}
      <div id="contact">
        <WhitelabelContactSection brandColor={brandColor} brandName={brandName} contactInfo={contactInfo} />
      </div>

      {/* ========= Footer ========= */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              {guide.brandLogoUrl ? (
                <img src={guide.brandLogoUrl} alt={brandName} className="h-8 w-auto brightness-0 invert" />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  {brandName.charAt(0)}
                </div>
              )}
              <span className="text-lg font-bold">{brandName}</span>
            </div>
            <div className="text-sm text-gray-400 text-center md:text-right space-y-1">
              <p>旅行服务由 新岛交通株式会社 提供</p>
              <p>大阪府知事登録旅行業 第2-3115号</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Feature card — used in About section */
function FeatureCard({
  icon,
  brandColor,
  title,
  description,
}: {
  icon: React.ReactNode;
  brandColor: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${brandColor}10`, color: brandColor }}
      >
        {icon}
      </div>
      <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');
  const r = clamp(parseInt(hex.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
    openGraph: {
      title: pageData.config.seoTitle || `${brandName} - 日本高端定制旅行`,
      description: pageData.config.seoDescription || '专业日本高端体检、医疗服务、商务考察服务。',
    },
  };
}
