import Link from 'next/link';
import { notFound } from 'next/navigation';
import { recordPageView } from '@/lib/services/whitelabel';
import { getCachedDistributionPageWithTag } from '@/lib/cache/whitelabel-cache';
import { headers } from 'next/headers';
import DistributionNav from '@/components/distribution/DistributionNav';
import FloatingContact from '@/components/distribution/FloatingContact';
import { buildDistributionNavItems } from '@/lib/utils/build-distribution-nav';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}


export default async function GuideLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const pageData = await getCachedDistributionPageWithTag(slug);

  if (!pageData) {
    notFound();
  }

  const { guide, selectedModules } = pageData;

  const brandColor = guide.brandColor || '#2563eb';
  const homeHref = `/g/${slug}`;

  // 品牌展示 — 使用当前导游自己的品牌（白标）。未设置时回退官方品牌，避免留白。
  const brandName = guide.brandName || 'NIIJIMA';
  const brandTagline = guide.brandTagline || '新島交通株式会社';

  // 构建导航：首页 + 选中的模块页面（使用共享工具函数）
  const navItems = buildDistributionNavItems(slug, selectedModules);

  // 联系方式 — 严格从当前 slug 对应的 guide 读取（白标数据隔离，见 CLAUDE.md LOCKED 规范）。
  // 不回退官方联系方式：避免把 A 导游的客户导流到官方或其他导游。
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
      {/* 导航栏 — 当前导游品牌（白标） */}
      <DistributionNav
        brandName={brandName}
        brandTagline={brandTagline}
        navItems={navItems}
        homeHref={homeHref}
      />

      {/* 页面内容（导航栏透明覆盖在首图上，与官网一致） */}
      <main className="flex-1">
        {children}
      </main>

      {/* 页脚 — 与官网统一风格 */}
      <footer className="bg-gradient-to-b from-[#f8f6f3] to-[#f0ece6] text-gray-800">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
            {/* 品牌区域 */}
            <div className="col-span-2">
              <div className="mb-4">
                <h3 className="text-xl font-serif tracking-[0.2em] mb-1 text-gray-800">{brandName}</h3>
                <p className="text-xs tracking-[0.1em] text-gray-500">{brandTagline}</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-[280px]">
                医疗旅行、高尔夫、商务考察——您的日本旅行服务窗口。
              </p>
              <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                <div>〒556-0014 大阪府大阪市浪速区大国1-2-21-602</div>
                <div>
                  <a href="tel:06-6632-8807" className="hover:text-gray-900 transition-colors">TEL: 06-6632-8807</a>
                </div>
              </div>
            </div>

            {/* 服务项目 */}
            <div>
              <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4">服务项目</h4>
              <ul className="space-y-2.5">
                <li><a href="/medical" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">精密体检</a></li>
                <li><a href="/cancer-treatment" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">癌症治疗</a></li>
                <li><a href="/golf" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">名门高尔夫</a></li>
                <li><a href="/business" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">商务考察</a></li>
              </ul>
            </div>

            {/* 合作伙伴 */}
            <div>
              <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4">合作伙伴</h4>
              <ul className="space-y-2.5">
                <li><a href="/guide-partner" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">导游伙伴计划</a></li>
                <li><a href="/business/partner" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">商务合作</a></li>
                <li><a href="/login?redirect=/health-screening" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">AI 健康评估</a></li>
              </ul>
            </div>

            {/* 公司信息 */}
            <div>
              <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4">公司资讯</h4>
              <ul className="space-y-2.5">
                <li><Link href="/company/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">关于我们</Link></li>
                <li><Link href="/news" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">最新消息</Link></li>
                <li><Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">常见问题</Link></li>
                <li><Link href="/legal/tokushoho" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">特定商取引法</Link></li>
                <li><a href="/legal/yakkan" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">旅行業约款</a></li>
                <li><Link href="/legal/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">隐私政策</Link></li>
                <li><Link href="/legal/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">使用条款</Link></li>
                <li><a href="/legal/medical-disclaimer" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">医疗免责事项</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部信息栏 */}
        <div className="border-t border-gray-300/50">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-500">大阪府知事登録旅行業 第2-3115号 ｜ 一般社団法人 日本旅行業協会（JATA）正会員</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} 新岛交通株式会社. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 悬浮联系按钮 — 当前导游联系方式（白标数据隔离；导游未设置则不显示） */}
      <FloatingContact
        brandColor={brandColor}
        contactInfo={contactInfo}
      />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = await getCachedDistributionPageWithTag(slug);

  if (!pageData) {
    return { title: '页面不存在' };
  }

  return {
    title: pageData.config.seoTitle || `新岛交通 - 日本医疗旅行·美容服务`,
    description: pageData.config.seoDescription || '日本体检、医疗美容旅行服务。中文对应、行程定制。',
  };
}
