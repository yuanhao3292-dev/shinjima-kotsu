import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// ⚠️ 此前 fallback 写的是 https://www.bespoketrip.jp —— 线上 Vercel 没设
// NEXT_PUBLIC_BASE_URL，兜底值直接顶上，导致 niijima-koutsu.jp/sitemap.xml
// 里 54 条 URL 全指向外域。跨域 sitemap 会被 Google 整份忽略，
// 等于主域一直没有 sitemap。现统一走 lib/seo 的主域常量。
const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // 医療サービスページ（各クリニック）
  const clinicSlugs = [
    'ac-plus',
    'cancer-treatment',
    'cell-medicine',
    'ginza-phoenix',
    'helene-clinic',
    'hyogo-medical',
    'igtc',
    'kindai-hospital',
    'oici',
    'osaka-himak',
    'sai-clinic',
    'wclinic-mens',
  ];

  const clinicPages: MetadataRoute.Sitemap = clinicSlugs.flatMap((slug) => [
    {
      url: `${BASE_URL}/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/${slug}/initial-consultation`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/${slug}/remote-consultation`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  // helene-clinic has an extra treatment page
  clinicPages.push({
    url: `${BASE_URL}/helene-clinic/treatment`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  });

  const staticPages: MetadataRoute.Sitemap = [
    // トップ
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // サービス総合ページ
    {
      url: `${BASE_URL}/medical`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/health-screening`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/golf`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // 情報ページ
    {
      url: `${BASE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/company/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/business`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/business/partner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/sustainability`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/sustainability/community`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    // 导游合伙人招募落地页（robots 只屏蔽 /guide-partner/ 下的后台，
    // /guide-partner 本身是对外招募页）
    {
      url: `${BASE_URL}/guide-partner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // 套餐推荐工具
    {
      url: `${BASE_URL}/package-recommender`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // 法的ページ
    {
      url: `${BASE_URL}/legal/tokushoho`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/yakkan`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/medical-disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // TIMC 精密体检套餐详情页 —— 商业价值最高的一批长尾页，此前完全不在 sitemap
  const checkupPackageSlugs = [
    'vip-member-course',
    'premium-cardiac-course',
    'select-gastro-colonoscopy',
    'select-gastroscopy',
    'dwibs-cancer-screening',
    'basic-checkup',
  ];
  const packagePages: MetadataRoute.Sitemap = checkupPackageSlugs.map((slug) => ({
    url: `${BASE_URL}/medical-packages/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...clinicPages, ...packagePages];
}
