/**
 * Health Community Stories API
 *
 * GET  /api/community/stories — List approved stories (public)
 * POST /api/community/stories — Submit a new story (requires auth)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabaseWithAuth } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

// ============================================================
// GET /api/community/stories — Public listing
// ============================================================

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/community/stories:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ja';
  const category = searchParams.get('category');
  const parsedLimit = parseInt(searchParams.get('limit') || '20');
  const limit = Math.min(Number.isNaN(parsedLimit) ? 20 : parsedLimit, 50);
  const offset = parseInt(searchParams.get('offset') || '0') || 0;

  try {
    let query = supabase
      .from('health_stories')
      .select('id, title, content, language, category, tags, risk_level, author_display_name, is_anonymous, view_count, helpful_count, created_at')
      .eq('status', 'approved')
      .eq('language', lang)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      logError(normalizeError(error), { path: '/api/community/stories', method: 'GET' });
      return createErrorResponse(Errors.internal('Failed to fetch stories'));
    }

    return NextResponse.json({
      stories: data || [],
      hasMore: (data?.length || 0) === limit,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/community/stories', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

// ============================================================
// POST /api/community/stories — Submit story (auth required)
// ============================================================

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/community/stories`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  // Auth
  const authResult = await getSupabaseWithAuth(request.headers.get('authorization'));
  if (authResult.error || !authResult.user) {
    return createErrorResponse(Errors.auth('ログインが必要です'));
  }

  try {
    const body = await request.json();
    const { title, content, language, category, tags, isAnonymous, displayName } = body as {
      title?: string;
      content?: string;
      language?: string;
      category?: string;
      tags?: string[];
      isAnonymous?: boolean;
      displayName?: string;
    };

    if (!title || title.trim().length < 3) {
      return createErrorResponse(Errors.validation('Title must be at least 3 characters'));
    }
    if (!content || content.trim().length < 10) {
      return createErrorResponse(Errors.validation('Content must be at least 10 characters'));
    }

    const validLanguages = ['ja', 'zh-CN', 'zh-TW', 'en'];
    const validCategories = ['experience', 'tip', 'question', 'review'];

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('health_stories')
      .insert({
        user_id: authResult.user.id,
        title: title.trim(),
        content: content.trim(),
        language: validLanguages.includes(language || '') ? language : 'ja',
        category: validCategories.includes(category || '') ? category : 'experience',
        tags: Array.isArray(tags) ? tags.slice(0, 5) : [],
        is_anonymous: isAnonymous !== false,
        author_display_name: displayName?.trim() || null,
        status: 'pending', // Requires admin approval
      })
      .select('id')
      .single();

    if (error) {
      logError(normalizeError(error), { path: '/api/community/stories', method: 'POST' });
      return createErrorResponse(Errors.internal('Failed to submit story'));
    }

    return NextResponse.json({
      success: true,
      storyId: data?.id,
      message: 'Story submitted for review',
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/community/stories', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
