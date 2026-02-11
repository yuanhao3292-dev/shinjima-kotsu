import { notFound } from 'next/navigation';
import { getGuideDistributionPage, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import {
  Car,
  Package,
  ChevronRight,
  Users,
} from 'lucide-react';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';
import MedicalPackagesModule from '@/components/whitelabel-modules/MedicalPackagesModule';
import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';
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
  const DETAIL_MODULES = new Set(['medical_packages', 'hyogo_medical']);

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
  const navItems: Array<{ id: string; label: string }> = [];
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

  // 是否有沉浸式模块（决定 Nav 初始状态）
  const hasImmersive = immersiveModules.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ========= Navigation (Client Component) ========= */}
      <DistributionNav
        brandName={brandName}
        brandColor={brandColor}
        brandLogoUrl={guide.brandLogoUrl}
        navItems={navItems}
        startScrolled={!hasImmersive}
      />

      {/* ======== 数据驱动：动态渲染所有沉浸式板块 ======== */}
      {immersiveModules.map(({ config: dc, componentKey }) => (
        <div key={dc.sectionId}>
          {/* hyogo_medical 自带完整 hero，跳过 ImmersiveSection */}
          {componentKey !== 'hyogo_medical' && (
            <ImmersiveSection
              config={dc}
              ctaHref={DETAIL_MODULES.has(componentKey) ? `/g/${slug}/${componentKey.replace(/_/g, '-')}` : undefined}
            />
          )}
          {/* medical_packages: ImmersiveSection 后面紧跟完整套餐卡片 */}
          {componentKey === 'medical_packages' && (
            <MedicalPackagesModule
              brandColor={brandColor}
              brandName={brandName}
              contactInfo={contactInfo}
              moduleId="medical-packages-inline"
              moduleName="TIMC 体检套餐"
              showContact={false}
            />
          )}
          {/* hyogo_medical: 直接渲染完整兵庫医大页面（含自带 hero） */}
          {componentKey === 'hyogo_medical' && (
            <HyogoMedicalContent
              whitelabel={{
                brandName,
                brandColor,
                contactInfo,
                moduleId: 'hyogo-medical-inline',
                moduleName: '兵庫医科大学病院',
                showContact: false,
              }}
            />
          )}
        </div>
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
