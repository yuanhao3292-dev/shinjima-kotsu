/**
 * 白标分销页的读缓存（unstable_cache，10 分钟）
 *
 * 唯一入口 getCachedDistributionPageWithTag，供 app/g/[slug] 的 layout 与 page 使用。
 * 失效由 /api/whitelabel/settings 的 revalidatePath('/g/<slug>', 'layout') 触发；
 * TTL 只是兜底。
 */

import { unstable_cache } from 'next/cache';

import {
  getGuideDistributionPage as _getGuideDistributionPage,
  type GuideDistributionPage,
} from '@/lib/services/whitelabel';

// ============================================
// 缓存配置
// ============================================

/**
 * 缓存时间配置（秒）
 */
const CACHE_TTL = {
  /** 分销页面缓存时间 */
  DISTRIBUTION_PAGE: 600, // 10 分钟
} as const;

/** 缓存标签。/api/whitelabel/settings 用 revalidatePath 失效整条 /g/[slug] 布局，
 *  这里的标签目前只用于分组，没有单独按标签失效的调用方。 */
const CACHE_TAGS = {
  DISTRIBUTION: 'distribution',
  TEMPLATES: 'templates',
  MODULES: 'modules',
} as const;

// ============================================
// 缓存函数
// ============================================
//
// 2026-08-18 收敛：原本还有 getCachedGuideBySlug / getCachedDistributionPage /
// 四个 invalidate* / warmupActiveGuidesCaches，唯一调用方是 /api/cache/revalidate ——
// 而那条路由本身没有任何调用方（无 cron、无触发器、无前端），一并删除。
// 缓存失效实际走的是 /api/whitelabel/settings 里的 revalidatePath。

/**
 * 获取分销页面数据（带特定标签的缓存）
 *
 * @param slug 分销页面 slug
 */
export async function getCachedDistributionPageWithTag(
  slug: string
): Promise<GuideDistributionPage | null> {
  const cacheKey = `distribution-page-${slug}`;
  const cacheTag = `${CACHE_TAGS.DISTRIBUTION}-${slug}`;

  const cachedFn = unstable_cache(
    async () => {
      console.log(`[Cache] Fetching distribution page with tag: ${slug}`);
      return _getGuideDistributionPage(slug);
    },
    [cacheKey],
    {
      revalidate: CACHE_TTL.DISTRIBUTION_PAGE,
      tags: [CACHE_TAGS.DISTRIBUTION, cacheTag, CACHE_TAGS.TEMPLATES, CACHE_TAGS.MODULES],
    }
  );

  return cachedFn();
}
