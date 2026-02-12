import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { z } from 'zod';

/**
 * 导游白标页面配置 API
 *
 * GET /api/guide/whitelabel-page - 获取当前导游的白标页面配置
 * POST /api/guide/whitelabel-page - 创建或更新白标页面配置
 *
 * DB 表: guide_white_label (058_white_label_system.sql)
 * 列: slug, display_name, avatar_url, bio, contact_wechat, contact_line,
 *     contact_phone, contact_email, bio_template_id,
 *     theme_color, site_title, site_description, is_published, ...
 */

// 内联 Zod schema，匹配实际 DB 列
const WhiteLabelPageUpdateSchema = z.object({
  slug: z.string().min(3).max(50).regex(/^[a-z][a-z0-9-]*$/).optional(),
  isPublished: z.boolean().optional(),
  displayName: z.string().max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().max(2000).nullable().optional(),
  contactWechat: z.string().max(100).nullable().optional(),
  contactLine: z.string().max(100).nullable().optional(),
  contactPhone: z.string().max(30).nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  bioTemplateId: z.string().uuid().nullable().optional(),
  themeColor: z.string().max(20).optional(),
  siteTitle: z.string().max(100).nullable().optional(),
  siteDescription: z.string().max(300).nullable().optional(),
}).partial();

async function verifyGuide(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: Errors.auth('未授权') };
  }

  const token = authHeader.substring(7);
  const supabase = getSupabaseAdmin();

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return { error: Errors.auth('无效的认证令牌') };
  }

  const { data: guide, error: guideError } = await supabase
    .from('guides')
    .select('id, name, email, status')
    .eq('auth_user_id', user.id)
    .single();

  if (guideError || !guide) {
    return { error: Errors.auth('导游账户不存在') };
  }

  if (guide.status !== 'approved') {
    return { error: Errors.business('导游账户未通过审核', 'GUIDE_NOT_APPROVED') };
  }

  return { guide, supabase };
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/guide/whitelabel-page:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyGuide(request);
  if ('error' in authResult) {
    return createErrorResponse(authResult.error);
  }

  const { guide, supabase } = authResult;

  try {
    // 获取白标配置
    const { data: config, error } = await supabase
      .from('guide_white_label')
      .select('*')
      .eq('guide_id', guide.id)
      .maybeSingle();

    if (error) {
      logError(normalizeError(error), { path: '/api/guide/whitelabel-page', method: 'GET' });
      return createErrorResponse(Errors.internal('获取配置失败'));
    }

    if (!config) {
      return NextResponse.json({
        exists: false,
        config: null,
        message: '尚未创建白标页面',
      });
    }

    // 获取已选择的模块（通过 guide_id 关联）
    const { data: selectedModules } = await supabase
      .from('guide_selected_modules')
      .select('*, module:page_modules(*)')
      .eq('guide_id', guide.id)
      .order('sort_order', { ascending: true });

    return NextResponse.json({
      exists: true,
      config: {
        ...config,
        selectedModules: selectedModules || [],
      },
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/whitelabel-page', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/guide/whitelabel-page`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyGuide(request);
  if ('error' in authResult) {
    return createErrorResponse(authResult.error);
  }

  const { guide, supabase } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse(Errors.validation('无效的请求体'));
  }

  const parseResult = WhiteLabelPageUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    return createErrorResponse(Errors.validation('参数错误'));
  }
  const data = parseResult.data;

  try {
    // 检查 slug 是否已被其他导游使用
    if (data.slug) {
      const { data: existingSlug } = await supabase
        .from('guide_white_label')
        .select('id, guide_id')
        .eq('slug', data.slug)
        .maybeSingle();

      if (existingSlug && existingSlug.guide_id !== guide.id) {
        return createErrorResponse(Errors.validation('该 URL 标识已被其他导游使用'));
      }
    }

    // 检查是否已有配置
    const { data: existing } = await supabase
      .from('guide_white_label')
      .select('id')
      .eq('guide_id', guide.id)
      .maybeSingle();

    if (existing) {
      // 更新现有配置
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.isPublished !== undefined) {
        updateData.is_published = data.isPublished;
        if (data.isPublished) {
          updateData.published_at = new Date().toISOString();
        }
      }
      if (data.displayName !== undefined) updateData.display_name = data.displayName;
      if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.contactWechat !== undefined) updateData.contact_wechat = data.contactWechat;
      if (data.contactLine !== undefined) updateData.contact_line = data.contactLine;
      if (data.contactPhone !== undefined) updateData.contact_phone = data.contactPhone;
      if (data.contactEmail !== undefined) updateData.contact_email = data.contactEmail;
      if (data.bioTemplateId !== undefined) updateData.bio_template_id = data.bioTemplateId;
      if (data.themeColor !== undefined) updateData.theme_color = data.themeColor;
      if (data.siteTitle !== undefined) updateData.site_title = data.siteTitle;
      if (data.siteDescription !== undefined) updateData.site_description = data.siteDescription;

      const { error: updateError } = await supabase
        .from('guide_white_label')
        .update(updateData)
        .eq('id', existing.id);

      if (updateError) {
        logError(normalizeError(updateError), { path: '/api/guide/whitelabel-page', method: 'POST' });
        return createErrorResponse(Errors.internal('更新配置失败'));
      }

      return NextResponse.json({
        success: true,
        message: '白标页面配置已更新',
        configId: existing.id,
      });
    } else {
      // 创建新配置
      if (!data.slug) {
        return createErrorResponse(Errors.validation('创建白标页面时必须提供 URL 标识'));
      }

      const { data: newConfig, error: insertError } = await supabase
        .from('guide_white_label')
        .insert({
          guide_id: guide.id,
          slug: data.slug,
          display_name: data.displayName || guide.name,
          avatar_url: data.avatarUrl || null,
          bio: data.bio || null,
          contact_wechat: data.contactWechat || null,
          contact_line: data.contactLine || null,
          contact_phone: data.contactPhone || null,
          contact_email: data.contactEmail || null,
          bio_template_id: data.bioTemplateId || null,
          theme_color: data.themeColor || '#f97316',
          site_title: data.siteTitle || null,
          site_description: data.siteDescription || null,
          is_published: data.isPublished || false,
        })
        .select('id')
        .single();

      if (insertError) {
        logError(normalizeError(insertError), { path: '/api/guide/whitelabel-page', method: 'POST' });
        return createErrorResponse(Errors.internal('创建配置失败'));
      }

      // 自动添加必选模块
      const { data: requiredModules } = await supabase
        .from('page_modules')
        .select('id')
        .eq('is_required', true)
        .eq('is_active', true);

      if (requiredModules && requiredModules.length > 0) {
        const moduleInserts = requiredModules.map((m, index) => ({
          guide_id: guide.id,
          module_id: m.id,
          is_enabled: true,
          sort_order: index,
        }));

        await supabase.from('guide_selected_modules').insert(moduleInserts);
      }

      return NextResponse.json({
        success: true,
        message: '白标页面配置已创建',
        configId: newConfig.id,
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/whitelabel-page', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
