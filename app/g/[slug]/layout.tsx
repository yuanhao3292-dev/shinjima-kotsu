import { notFound } from 'next/navigation';
import { getGuideDistributionPage, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import DistributionNav from '@/components/distribution/DistributionNav';
import FloatingContact from '@/components/distribution/FloatingContact';
import type { NavItem } from '@/components/distribution/DistributionNav';
import type { ImmersiveDisplayConfig } from '@/lib/types/display-config';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

/** component_key → URL slug (medical_packages → medical-packages) */
function toUrlSlug(componentKey: string): string {
  return componentKey.replace(/_/g, '-');
}

/** 模块名显示映射 */
const MODULE_LABELS: Record<string, string> = {
  sai_clinic: 'SAI CLINIC',
  hyogo_medical: '兵庫医大病院',
  medical_packages: '精密体检',
  cancer_treatment: '癌症治疗',
  golf: '高尔夫',
  medical_tourism: '医疗观光',
  health_screening: '健康检查',
};

export default async function GuideLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    notFound();
  }

  const { guide, selectedModules } = pageData;

  const brandName = guide.brandName || guide.name;
  const brandColor = guide.brandColor || '#2563eb';
  const homeHref = `/g/${slug}`;

  // 构建导航：首页 + 选中的模块页面
  const navItems: NavItem[] = [
    { id: 'home', label: '首页', href: homeHref },
  ];

  // 支持详情页的模块
  const DETAIL_MODULES = new Set([
    'medical_packages', 'hyogo_medical', 'cancer_treatment',
    'golf', 'medical_tourism', 'health_screening', 'sai_clinic',
  ]);

  selectedModules.forEach((m) => {
    const key = m.module.componentKey;
    if (key && DETAIL_MODULES.has(key)) {
      const dc = m.module.displayConfig as ImmersiveDisplayConfig | null;
      navItems.push({
        id: key,
        label: m.customTitle || dc?.navLabel || MODULE_LABELS[key] || m.module.name,
        href: `/g/${slug}/${toUrlSlug(key)}`,
      });
    }
  });

  // 联系信息
  const contactInfo = {
    wechat: guide.contactWechat || null,
    line: guide.contactLine || null,
    phone: guide.contactDisplayPhone || null,
    email: guide.email || null,
  };

  // 记录页面访问（非阻塞）
  const headersList = await headers();
  const referer = headersList.get('referer') || undefined;
  recordPageView(guide.id, {
    pagePath: `/g/${slug}`,
    referrer: referer,
  }).catch(() => {});

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 导航栏 — 仅展示导游品牌 */}
      <DistributionNav
        brandName={brandName}
        brandColor={brandColor}
        brandLogoUrl={guide.brandLogoUrl}
        navItems={navItems}
        homeHref={homeHref}
        startScrolled
      />

      {/* 页面内容 */}
      <main className="flex-1 pt-[72px]">
        {children}
      </main>

      {/* 页脚 */}
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

      {/* 悬浮联系按钮 — 展示导游联系方式 */}
      <FloatingContact
        brandColor={brandColor}
        contactInfo={contactInfo}
      />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    return { title: '页面不存在' };
  }

  const brandName = pageData.guide.brandName || pageData.guide.name;

  return {
    title: pageData.config.seoTitle || `${brandName} - 日本高端医疗·美容服务`,
    description: pageData.config.seoDescription || '专业日本高端体检、医疗美容服务。中文服务、专属定制。',
  };
}
