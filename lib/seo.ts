/**
 * 站点 SEO 基础设施
 *
 * 背景：同一套站点同时跑在 niijima-koutsu.jp 和 www.bespoketrip.jp 上，
 * 内容与标题完全相同，且全站没有 canonical —— Google 会把两个域名当重复
 * 内容，自行挑一个当主版本，外链权重被劈成两半。
 *
 * 这里把「主域」收敛成唯一常量，供 metadata、sitemap 共用：
 * - canonical 一律指向主域，两个域名上的同一页面归并成同一个 URL
 * - sitemap 里的 URL 也用它（此前 fallback 写的是 bespoketrip.jp，
 *   导致主域的 sitemap 列的全是外域 URL，跨域 sitemap 会被 Google 忽略）
 *
 * ⚠️ NEXT_PUBLIC_BASE_URL 若在 Vercel 上被设成别的域名，会覆盖这里的默认值。
 */

import type { Metadata } from 'next';

/** 主域（canonical / sitemap 的唯一来源） */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'https://niijima-koutsu.jp'
).replace(/\/$/, '');

export const SITE_NAME = '新島交通株式會社';

interface PageMetaInput {
  title: string;
  description: string;
  /** 以 / 开头的路径，用于 canonical。首页传 '/' */
  path: string;
  keywords?: string[];
  /** 语言标记，影响 og:locale。医院专题页用日文，商业主力页用繁中 */
  locale?: 'zh_TW' | 'ja' | 'en';
  /** 后台/工具类页面不入索引 */
  noIndex?: boolean;
}

/**
 * 生成单页 metadata。
 *
 * title 用 { absolute, template } 而不是裸字符串：
 * - absolute：本页标题就是这一串，不再被上层 template 二次加工。
 *   裸字符串会依赖「最近一个定义了 template 的祖先」，而 metadata 是按字段
 *   浅合并的 —— 中间任何一层写了裸 title 就会把根上的 template 一起顶掉。
 *   实测 /business 写了裸 title 后，/business/partner 的站名后缀就没了。
 * - template：本页若还有子路由，后缀规则继续往下传。
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  locale = 'zh_TW',
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  // 不显式指定 images —— app/opengraph-image.tsx 的文件约定会自动注入，
  // 这里写死反而会覆盖掉它。
  //
  // ⚠️ 同理不要在这里写 alternates：metadata 按字段浅合并，子页面一写
  // alternates 就会把根 layout 算好的 canonical + hreflang 整组顶掉
  // （实测 /ja/medical 的 canonical 变回 /medical、hreflang 一条不剩）。
  // canonical 与 hreflang 一律由 app/layout.tsx 依 x-pathname 逐页生成。
  return {
    title: { absolute: fullTitle, template: `%s | ${SITE_NAME}` },
    description,
    ...(keywords?.length ? { keywords } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
