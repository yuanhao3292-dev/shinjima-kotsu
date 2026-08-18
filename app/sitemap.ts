import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { allLocalePaths, HREFLANG } from '@/lib/i18n-routing';

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
    // ⚠️ /health-screening 不在此列：它要求登录，匿名访问一律 307 到
    // /login?redirect=… 。挂在 sitemap 里只会让 Google 反复抓到重定向，
    // 在 Search Console 里堆积「有重定向的网页」。等它对匿名开放再加回来。
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
    // /community（健康故事社区）暂不进 sitemap：无站内入口、线上 0 条数据、
    // 投稿页未实现。等功能成型再加回。
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

  // 给每条 URL 挂上各语言版本 —— Next 会渲染成 xhtml:link alternate，
  // 与页面 <head> 里的 hreflang 相互印证。
  // 注意 alternates 里也要包含自己（Google 要求 hreflang 集合自包含）。
  return [...staticPages, ...clinicPages, ...packagePages].map((entry) => {
    const basePath = entry.url.slice(BASE_URL.length) || '/';
    const paths = allLocalePaths(basePath);
    const languages: Record<string, string> = {};
    for (const [lang, p] of Object.entries(paths)) {
      languages[HREFLANG[lang as keyof typeof HREFLANG]] =
        `${BASE_URL}${p === '/' ? '' : p}`;
    }
    languages['x-default'] = entry.url;
    return { ...entry, alternates: { languages } };
  });
}
