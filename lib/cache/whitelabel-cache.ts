/**
 * 白标页面 ISR 缓存优化
 * ============================================
 * 使用 Next.js 缓存机制优化白标页面性能
 *
 * 缓存策略：
 * - 导游配置：5分钟缓存，配置更新时按需重新验证
 * - 分销页面：10分钟缓存，模板/模块变化时按需重新验证
 * - 静态资源：1小时缓存
 *
 * 重新验证触发点：
 * - 导游更新白标设置
 * - 导游启用/禁用模块
 * - 导游更换模板
 * - 订阅状态变化
 *
 * @version 1.0.0
 */

import { unstable_cache, revalidatePath } from 'next/cache';

// Next.js 16 的 revalidateTag 需要第二个参数
// 使用 'default' profile 进行标准缓存失效
const DEFAULT_CACHE_PROFILE = 'default';
import { createClient } from '@supabase/supabase-js';
import {
  getGuideBySlug as _getGuideBySlug,
  getGuideDistributionPage as _getGuideDistributionPage,
  type GuideDistributionPage,
} from '@/lib/services/whitelabel';
import type { GuideWhiteLabelConfig } from '@/lib/types/whitelabel';

// ============================================
// 缓存配置
// ============================================

/**
 * 缓存时间配置（秒）
 */
export const CACHE_TTL = {
  /** 导游配置缓存时间 */
  GUIDE_CONFIG: 300, // 5 分钟
  /** 分销页面缓存时间 */
  DISTRIBUTION_PAGE: 600, // 10 分钟
  /** 模板列表缓存时间 */
  TEMPLATES: 3600, // 1 小时
  /** 模块列表缓存时间 */
  MODULES: 1800, // 30 分钟
} as const;

/**
 * 缓存标签前缀
 */
export const CACHE_TAGS = {
  /** 导游配置标签前缀 */
  GUIDE: 'guide',
  /** 白标页面标签前缀 */
  WHITELABEL: 'whitelabel',
  /** 分销页面标签前缀 */
  DISTRIBUTION: 'distribution',
  /** 模板标签 */
  TEMPLATES: 'templates',
  /** 模块标签 */
  MODULES: 'modules',
} as const;

// ============================================
// 缓存函数
// ============================================

/**
 * 获取导游配置（带缓存）
 *
 * @param slug 导游 slug
 * @returns 导游配置或 null
 *
 * @example
 * const config = await getCachedGuideBySlug('john-doe');
 */
export const getCachedGuideBySlug = unstable_cache(
  async (slug: string): Promise<GuideWhiteLabelConfig | null> => {
    console.log(`[Cache] Fetching guide config: ${slug}`);
    return _getGuideBySlug(slug);
  },
  ['guide-by-slug'],
  {
    revalidate: CACHE_TTL.GUIDE_CONFIG,
    tags: [CACHE_TAGS.GUIDE],
  }
);

/**
 * 获取导游配置（带特定标签的缓存）
 * 用于更精细的缓存失效控制
 *
 * @param slug 导游 slug
 */
export async function getCachedGuideBySlugWithTag(
  slug: string
): Promise<GuideWhiteLabelConfig | null> {
  const cacheKey = `guide-config-${slug}`;
  const cacheTag = `${CACHE_TAGS.GUIDE}-${slug}`;

  const cachedFn = unstable_cache(
    async () => {
      console.log(`[Cache] Fetching guide config with tag: ${slug}`);
      return _getGuideBySlug(slug);
    },
    [cacheKey],
    {
      revalidate: CACHE_TTL.GUIDE_CONFIG,
      tags: [CACHE_TAGS.GUIDE, cacheTag],
    }
  );

  return cachedFn();
}

/**
 * 获取分销页面数据（带缓存）
 *
 * @param slug 分销页面 slug
 * @returns 完整的分销页面数据或 null
 *
 * @example
 * const page = await getCachedDistributionPage('john-doe');
 */
export const getCachedDistributionPage = unstable_cache(
  async (slug: string): Promise<GuideDistributionPage | null> => {
    console.log(`[Cache] Fetching distribution page: ${slug}`);
    return _getGuideDistributionPage(slug);
  },
  ['distribution-page'],
  {
    revalidate: CACHE_TTL.DISTRIBUTION_PAGE,
    tags: [CACHE_TAGS.DISTRIBUTION],
  }
);

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

// ============================================
// 缓存失效函数
// ============================================

/**
 * 使特定导游的缓存失效
 *
 * @param slug 导游 slug
 *
 * @example
 * // 导游更新设置后调用
 * await invalidateGuideCache('john-doe');
 */
export async function invalidateGuideCache(slug: string): Promise<void> {
  console.log(`[Cache] Invalidating guide cache: ${slug}`);

  // 失效路由缓存（这是主要的缓存失效方式）
  revalidatePath(`/p/${slug}`);
  revalidatePath(`/g/${slug}`);

  // 注意：unstable_cache 的标签需要通过重新部署或使用 revalidatePath 来失效
  // Next.js 16 的 revalidateTag API 变化较大，使用 revalidatePath 更可靠
}

/**
 * 使所有导游配置缓存失效
 *
 * @example
 * // 系统级配置变化时调用
 * await invalidateAllGuideCache();
 */
export async function invalidateAllGuideCache(): Promise<void> {
  console.log('[Cache] Invalidating all guide caches');
  // 使用路径模式失效所有白标页面
  revalidatePath('/p/[slug]', 'page');
  revalidatePath('/g/[slug]', 'page');
}

/**
 * 使模板缓存失效
 *
 * @example
 * // 管理员修改模板后调用
 * await invalidateTemplatesCache();
 */
export async function invalidateTemplatesCache(): Promise<void> {
  console.log('[Cache] Invalidating templates cache');
  // 模板变化影响所有分销页面
  revalidatePath('/g/[slug]', 'page');
}

/**
 * 使模块缓存失效
 *
 * @example
 * // 管理员修改模块后调用
 * await invalidateModulesCache();
 */
export async function invalidateModulesCache(): Promise<void> {
  console.log('[Cache] Invalidating modules cache');
  // 模块变化影响所有分销页面
  revalidatePath('/g/[slug]', 'page');
}

// ============================================
// 预热缓存函数
// ============================================

/**
 * 预热活跃导游的缓存
 * 可在部署后或定时任务中调用
 *
 * @param limit 预热数量限制
 */
export async function warmupActiveGuidesCaches(limit: number = 50): Promise<void> {
  console.log(`[Cache] Warming up caches for top ${limit} active guides`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 获取最近活跃的导游
  const { data: activeGuides } = await supabase
    .from('guides')
    .select('slug')
    .eq('subscription_status', 'active')
    .eq('status', 'approved')
    .not('slug', 'is', null)
    .order('whitelabel_views', { ascending: false })
    .limit(limit);

  if (!activeGuides || activeGuides.length === 0) {
    console.log('[Cache] No active guides to warmup');
    return;
  }

  // 并行预热缓存
  const warmupPromises = activeGuides.map(async (guide) => {
    if (guide.slug) {
      try {
        await getCachedGuideBySlugWithTag(guide.slug);
        console.log(`[Cache] Warmed up: ${guide.slug}`);
      } catch (err) {
        console.warn(`[Cache] Failed to warmup ${guide.slug}:`, err);
      }
    }
  });

  await Promise.all(warmupPromises);
  console.log(`[Cache] Warmup completed for ${activeGuides.length} guides`);
}

// ============================================
// 缓存状态检查
// ============================================

/**
 * 获取缓存统计信息（用于监控）
 */
export function getCacheStats(): {
  ttl: typeof CACHE_TTL;
  tags: typeof CACHE_TAGS;
} {
  return {
    ttl: CACHE_TTL,
    tags: CACHE_TAGS,
  };
}
