import { MetadataRoute } from 'next';

// 根据请求域名动态判断 — build 时使用默认值
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bespoketrip.jp';

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
      url: `${BASE_URL}/health-checkup`,
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

  return [...staticPages, ...clinicPages];
}
