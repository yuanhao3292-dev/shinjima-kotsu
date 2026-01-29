/**
 * 缓存重新验证 API
 * ============================================
 * POST /api/cache/revalidate
 *
 * 用于按需触发缓存失效，支持：
 * - 特定导游缓存失效
 * - 全局模板/模块缓存失效
 *
 * 安全：需要提供 REVALIDATION_SECRET
 *
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  invalidateGuideCache,
  invalidateAllGuideCache,
  invalidateTemplatesCache,
  invalidateModulesCache,
} from '@/lib/cache/whitelabel-cache';

// ============================================
// 类型定义
// ============================================

interface RevalidateRequest {
  /** 重新验证类型 */
  type: 'guide' | 'all-guides' | 'templates' | 'modules';
  /** 导游 slug（type 为 guide 时必填） */
  slug?: string;
  /** 认证密钥 */
  secret: string;
}

// ============================================
// API 处理
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: RevalidateRequest = await request.json();
    const { type, slug, secret } = body;

    // 1. 验证密钥
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret) {
      console.error('[Revalidate] REVALIDATION_SECRET not configured');
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.warn('[Revalidate] Invalid secret provided');
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // 2. 执行重新验证
    switch (type) {
      case 'guide':
        if (!slug) {
          return NextResponse.json(
            { error: 'slug is required for guide revalidation' },
            { status: 400 }
          );
        }
        await invalidateGuideCache(slug);
        console.log(`[Revalidate] Invalidated cache for guide: ${slug}`);
        return NextResponse.json({
          success: true,
          type: 'guide',
          slug,
          message: `Cache invalidated for guide: ${slug}`,
        });

      case 'all-guides':
        await invalidateAllGuideCache();
        console.log('[Revalidate] Invalidated all guide caches');
        return NextResponse.json({
          success: true,
          type: 'all-guides',
          message: 'All guide caches invalidated',
        });

      case 'templates':
        await invalidateTemplatesCache();
        console.log('[Revalidate] Invalidated templates cache');
        return NextResponse.json({
          success: true,
          type: 'templates',
          message: 'Templates cache invalidated',
        });

      case 'modules':
        await invalidateModulesCache();
        console.log('[Revalidate] Invalidated modules cache');
        return NextResponse.json({
          success: true,
          type: 'modules',
          message: 'Modules cache invalidated',
        });

      default:
        return NextResponse.json(
          { error: `Invalid revalidation type: ${type}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

/**
 * GET - 健康检查
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoints: {
      guide: 'POST with { type: "guide", slug: "xxx", secret: "..." }',
      allGuides: 'POST with { type: "all-guides", secret: "..." }',
      templates: 'POST with { type: "templates", secret: "..." }',
      modules: 'POST with { type: "modules", secret: "..." }',
    },
  });
}
