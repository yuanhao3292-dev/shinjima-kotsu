import { notFound } from 'next/navigation';
import { getGuideDistributionPage, recordPageView } from '@/lib/services/whitelabel';
import { getModuleComponent } from '@/components/whitelabel-modules/registry';
import { headers } from 'next/headers';
import {
  Car,
  User,
  Package,
  ChevronRight,
  Users,
} from 'lucide-react';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideDistributionPage({ params }: PageProps) {
  const { slug } = await params;

  // 获取导游分销页面数据
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
  }).catch((err) => {
    console.error('Failed to record page view:', err);
  });

  const brandName = guide.brandName || guide.name;
  const brandColor = guide.brandColor || '#2563eb';

  // 分离有 componentKey 的完整页面模块 和 普通模块
  const fullPageModules = selectedModules.filter(m => m.module.componentKey);
  const genericModules = selectedModules.filter(m => !m.module.componentKey);
  const hasVehiclesModule = fullPageModules.some(m => m.module.componentKey === 'vehicles');

  // 构建联系信息
  const contactInfo = {
    wechat: guide.contactWechat,
    line: guide.contactLine,
    phone: guide.contactDisplayPhone,
    email: guide.email,
  };

  // 构建动态导航
  const navItems: Array<{ id: string; label: string }> = [
    { id: 'about', label: '关于我们' },
  ];

  // 为每个完整页面模块添加导航项
  fullPageModules.forEach((m) => {
    navItems.push({
      id: `module-${m.module.componentKey}`,
      label: m.module.name,
    });
  });

  if (selectedVehicles.length > 0 && !hasVehiclesModule) {
    navItems.push({ id: 'vehicles', label: '车辆介绍' });
  }
  if (genericModules.length > 0) {
    navItems.push({ id: 'services', label: '服务项目' });
  }
  navItems.push({ id: 'contact', label: '联系我们' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="bg-white border-b sticky top-0 z-50"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {guide.brandLogoUrl ? (
              <img
                src={guide.brandLogoUrl}
                alt={brandName}
                className="h-10 w-auto"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: brandColor }}
              >
                {brandName.charAt(0)}
              </div>
            )}
            <span className="text-xl font-bold text-gray-900">{brandName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm overflow-x-auto">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-20 text-white"
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, -30)} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {config.seoTitle || `${brandName} - 日本高端定制旅行`}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {config.seoDescription ||
              '专业日本高端医疗体检、商务考察、私人定制服务。中文服务、专属定制。'}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">关于我们</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              为您提供最优质的日本旅行和医疗服务体验
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                {guide.brandLogoUrl ? (
                  <img
                    src={guide.brandLogoUrl}
                    alt={brandName}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{guide.name}</h3>
                <p className="text-gray-600 mb-4">
                  专业导游，为您提供最贴心的服务。
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    中文服务
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    专属定制
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    高端体验
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Page Module Components */}
      {fullPageModules.map((sm) => {
        const ModuleComponent = getModuleComponent(sm.module.componentKey!);
        if (!ModuleComponent) return null;
        return (
          <section key={sm.id} id={`module-${sm.module.componentKey}`}>
            <ModuleComponent
              brandColor={brandColor}
              brandName={brandName}
              contactInfo={contactInfo}
              moduleId={sm.moduleId}
              moduleName={sm.module.name}
              showContact={false}
            />
          </section>
        );
      })}

      {/* Vehicles Section (only if VehiclesModule is not enabled) */}
      {selectedVehicles.length > 0 && !hasVehiclesModule && (
        <section id="vehicles" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">车辆介绍</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                为您提供舒适、安全的高端座驾
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedVehicles.map((sv) => (
                <div
                  key={sv.id}
                  className="bg-gray-50 rounded-xl overflow-hidden border hover:shadow-lg transition"
                >
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    {sv.vehicle.images?.[0] ? (
                      <img
                        src={sv.vehicle.images[0]}
                        alt={sv.vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car size={48} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {sv.vehicle.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {sv.vehicle.description || sv.vehicle.vehicleType}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {sv.vehicle.seats} 座
                      </span>
                    </div>
                    {sv.vehicle.features && sv.vehicle.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {sv.vehicle.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded"
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

      {/* Generic Services Section (modules without componentKey) */}
      {genericModules.length > 0 && (
        <section id="services" className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">服务项目</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                为您精选的优质医疗和旅行服务
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genericModules.map((sm) => (
                <div
                  key={sm.id}
                  className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${brandColor}15` }}
                      >
                        {sm.module.thumbnailUrl ? (
                          <img
                            src={sm.module.thumbnailUrl}
                            alt={sm.module.name}
                            className="w-8 h-8"
                          />
                        ) : (
                          <Package size={28} style={{ color: brandColor }} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {sm.module.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {sm.module.description || '优质服务项目'}
                    </p>
                    <button
                      className="w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-white"
                      style={{ backgroundColor: brandColor }}
                    >
                      了解详情
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <div id="contact">
        <WhitelabelContactSection
          brandColor={brandColor}
          brandName={brandName}
          contactInfo={contactInfo}
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {guide.brandLogoUrl ? (
                <img
                  src={guide.brandLogoUrl}
                  alt={brandName}
                  className="h-8 w-auto brightness-0 invert"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                  {brandName.charAt(0)}
                </div>
              )}
              <span className="font-medium">{brandName}</span>
            </div>
            <div className="text-sm text-gray-400 text-center md:text-right">
              <p>旅行服务由 新岛交通株式会社 提供</p>
              <p className="mt-1">大阪府知事登录旅行业 第2-3115号</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 调整颜色明暗
function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');
  const r = clamp(parseInt(hex.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    return {
      title: '页面不存在',
    };
  }

  const brandName = pageData.guide.brandName || pageData.guide.name;

  return {
    title: pageData.config.seoTitle || `${brandName} - 日本高端定制旅行`,
    description:
      pageData.config.seoDescription ||
      '专业日本高端体检、医疗服务、商务考察。中文服务、专属定制。',
    openGraph: {
      title: pageData.config.seoTitle || `${brandName} - 日本高端定制旅行`,
      description:
        pageData.config.seoDescription ||
        '专业日本高端体检、医疗服务、商务考察服务。',
    },
  };
}
