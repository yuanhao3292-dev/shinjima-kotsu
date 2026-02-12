import { notFound } from 'next/navigation';
import { getGuideDistributionPage, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import {
  Package,
  ChevronRight,
} from 'lucide-react';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';
import TIMCContent from '@/app/guide-partner/product-center/timc/TIMCContent';
import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';
import SaiClinicContent from '@/app/sai-clinic/SaiClinicContent';
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

  const { guide, config, selectedModules } = pageData;

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
  const DETAIL_MODULES = new Set([
    'medical_packages', 'hyogo_medical', 'cancer_treatment',
    'golf', 'medical_tourism', 'health_screening', 'sai_clinic',
  ]);

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
          {/* medical_packages / hyogo_medical / sai_clinic 自带完整 hero，跳过 ImmersiveSection */}
          {componentKey !== 'hyogo_medical' && componentKey !== 'medical_packages' && componentKey !== 'sai_clinic' && (
            <ImmersiveSection
              config={dc}
              ctaHref={DETAIL_MODULES.has(componentKey) ? `/g/${slug}/${componentKey.replace(/_/g, '-')}` : undefined}
            />
          )}
          {/* medical_packages: 渲染完整版 TIMC 内容（含自带 hero） */}
          {componentKey === 'medical_packages' && (
            <TIMCContent
              whitelabel={{
                brandName,
                brandColor,
                contactInfo,
                moduleId: 'medical-packages-inline',
                moduleName: 'TIMC 体检套餐',
                showContact: false,
              }}
            />
          )}
          {/* sai_clinic: 渲染完整 SAI CLINIC 医美内容（含自带 hero） */}
          {componentKey === 'sai_clinic' && (
            <SaiClinicContent
              whitelabel={{
                brandName,
                brandColor,
                contactInfo,
                moduleId: 'sai-clinic-inline',
                moduleName: 'SAI CLINIC 医美整形',
                showContact: false,
              }}
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
