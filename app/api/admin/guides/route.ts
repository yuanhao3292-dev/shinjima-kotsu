import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { GuideActionSchema, sanitizeSearchInput } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { generateUniqueReferralCode, generateRandomPassword } from '@/lib/utils/referral-code';
import { z } from 'zod';

// 创建导游的 Schema
const CreateGuideSchema = z.object({
  email: z.string().email('無效的郵箱地址'),
  name: z.string().min(1, '請輸入導遊姓名'),
});

/**
 * 管理员导游管理 API
 *
 * GET /api/admin/guides - 获取导游列表
 * GET /api/admin/guides?id=xxx - 获取单个导游详情
 * PUT /api/admin/guides - 创建新导游账户
 */
export async function GET(request: NextRequest) {
  // GET 端点速率限制（防数据枚举攻击）
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/guides:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const guideId = searchParams.get('id');
  const status = searchParams.get('status');
  const searchRaw = searchParams.get('search');
  const search = searchRaw ? sanitizeSearchInput(searchRaw) : null;

  // 分页参数
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const offset = (page - 1) * limit;

  try {
    if (guideId) {
      // 获取单个导游详情
      const { data: guide, error } = await supabase
        .from('guides')
        .select(`
          *,
          referrer:referrer_id(id, name, referral_code)
        `)
        .eq('id', guideId)
        .single();

      if (error || !guide) {
        return createErrorResponse(Errors.notFound('导游不存在'));
      }

      // 获取导游的订单统计
      const { count: bookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('guide_id', guideId);

      // 获取导游的推荐人数
      const { count: referralCount } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', guideId);

      return NextResponse.json({
        ...guide,
        stats: {
          bookingCount: bookingCount || 0,
          referralCount: referralCount || 0,
        },
      });
    } else {
      // 获取导游列表（带分页）
      let query = supabase
        .from('guides')
        .select(`
          id, name, email, phone, wechat_id,
          status, level, kyc_status,
          total_commission, total_bookings,
          referral_code, referrer_id,
          created_at, updated_at
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // 按状态筛选
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // 搜索（已消毒的输入）
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,referral_code.ilike.%${search}%`);
      }

      const { data: guides, error, count } = await query;

      if (error) {
        const apiError = normalizeError(error);
        logError(apiError, { path: '/api/admin/guides', method: 'GET' });
        return createErrorResponse(Errors.internal('获取导游列表失败'));
      }

      // 统计
      const { count: total } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true });

      const { count: approved } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: pending } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      return NextResponse.json({
        guides: guides || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
        stats: {
          total: total || 0,
          approved: approved || 0,
          pending: pending || 0,
          suspended: (total || 0) - (approved || 0) - (pending || 0),
        },
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/guides', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

/**
 * POST /api/admin/guides - 更新导游状态
 */
export async function POST(request: NextRequest) {
  try {
    // 速率限制检查（管理员敏感操作）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/guides`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    // 使用 Zod 验证输入
    const validation = await validateBody(request, GuideActionSchema);
    if (!validation.success) return validation.error;
    const { guideId, action, level, note } = validation.data;

    const supabase = getSupabaseAdmin();

    let updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case 'approve':
        updateData.status = 'approved';
        break;
      case 'suspend':
        updateData.status = 'suspended';
        break;
      case 'reactivate':
        updateData.status = 'approved';
        break;
      case 'update_level':
        updateData.level = level;
        break;
    }

    const { error } = await supabase
      .from('guides')
      .update(updateData)
      .eq('id', guideId);

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/guides', method: 'POST' });
      return createErrorResponse(Errors.internal('更新导游状态失败'));
    }

    // 记录审计日志（失败时记录告警但不阻断主流程）
    const { error: auditError } = await supabase.from('audit_logs').insert({
      action: `guide_${action}`,
      entity_type: 'guide',
      entity_id: guideId,
      admin_id: authResult.userId,
      admin_email: authResult.email,
      details: { level, note },
    });

    if (auditError) {
      console.error('[CRITICAL] 审计日志写入失败:', auditError);
    }

    return NextResponse.json({
      success: true,
      message: '操作成功',
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/guides', method: 'POST' });
    return createErrorResponse(apiError);
  }
}

/**
 * PUT /api/admin/guides - 创建新导游账户
 */
export async function PUT(request: NextRequest) {
  try {
    // 速率限制检查（管理员敏感操作）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/guides:PUT`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    // 验证输入
    const validation = await validateBody(request, CreateGuideSchema);
    if (!validation.success) return validation.error;
    const { email, name } = validation.data;

    const supabase = getSupabaseAdmin();

    // 检查邮箱是否已存在
    const { data: existingGuide } = await supabase
      .from('guides')
      .select('email')
      .eq('email', email)
      .single();

    if (existingGuide) {
      return createErrorResponse(Errors.validation('該郵箱已被使用'));
    }

    // 生成随机密码
    const password = generateRandomPassword();

    // 生成唯一的推荐码（带重试机制）
    let referralCode: string;
    try {
      referralCode = await generateUniqueReferralCode(supabase, 10);
    } catch (error) {
      logError(normalizeError(error), { path: '/api/admin/guides', method: 'PUT' });
      return createErrorResponse(Errors.internal('無法生成唯一推薦碼，請重試'));
    }

    // 创建 Supabase Auth 账户
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // 自动确认邮箱
      user_metadata: {
        name,
        role: 'guide',
      },
    });

    if (authError || !authData.user) {
      logError(normalizeError(authError), { path: '/api/admin/guides', method: 'PUT' });
      return createErrorResponse(Errors.internal('創建認證帳號失敗'));
    }

    // 在 guides 表中创建记录
    const { error: guideError } = await supabase
      .from('guides')
      .insert({
        auth_user_id: authData.user.id, // ✅ 修复：使用 auth_user_id 字段（与用户注册保持一致）
        email,
        name,
        referral_code: referralCode,
        status: 'approved', // 管理员添加的导游直接设为已认证
        level: 'growth',
        kyc_status: 'pending',
        total_commission: 0,
        total_bookings: 0,
      });

    if (guideError) {
      // 如果创建 guides 记录失败，删除刚创建的 auth 账户
      await supabase.auth.admin.deleteUser(authData.user.id);
      logError(normalizeError(guideError), { path: '/api/admin/guides', method: 'PUT' });
      return createErrorResponse(Errors.internal('創建導遊記錄失敗'));
    }

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      action: 'guide_created',
      entity_type: 'guide',
      entity_id: authData.user.id,
      admin_id: authResult.userId,
      admin_email: authResult.email,
      details: { email, name, referral_code: referralCode },
    });

    return NextResponse.json({
      success: true,
      message: '導遊帳號創建成功',
      password, // 返回密码给管理员
      guideId: authData.user.id,
      referralCode,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/guides', method: 'PUT' });
    return createErrorResponse(apiError);
  }
}
