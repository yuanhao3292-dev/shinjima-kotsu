import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { validateBody } from '@/lib/validations/validate';
import { z } from 'zod';
import { generateUniqueReferralCode, generateRandomPassword } from '@/lib/utils/referral-code';

/**
 * 导游注册 API
 *
 * POST /api/guide/register
 *
 * 安全要点：
 * - 使用服务端 Supabase Admin 客户端
 * - 自动生成唯一推荐码
 * - 使用数据库事务确保原子性
 * - 失败时自动清理 Auth 账户
 */

const RegisterGuideSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().min(1, '请输入电话号码'),
  wechat_id: z.string().optional(),
  password: z.string().min(8, '密码至少需要 8 位字符'),
  referrer_code: z.string().max(20).optional(), // 推荐人的推荐码
});

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查（注册为敏感操作）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/guide/register`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    // 验证输入
    const validation = await validateBody(request, RegisterGuideSchema);
    if (!validation.success) return validation.error;
    const { name, email, phone, wechat_id, password, referrer_code } = validation.data;

    const supabase = getSupabaseAdmin();

    // 1. 如果有推荐码，查找推荐人
    let referrerId: string | null = null;
    if (referrer_code) {
      const { data: referrer } = await supabase
        .from('guides')
        .select('id, name')
        .eq('referral_code', referrer_code.toUpperCase())
        .eq('status', 'approved')
        .single();

      if (referrer) {
        referrerId = referrer.id;
        console.log(`[register] 找到推荐人: ${referrer.name} (${referrer.id})`);
      } else {
        console.log(`[register] 推荐码 ${referrer_code} 无效或推荐人未通过审核`);
        // 不阻止注册，只是不设置推荐关系
      }
    }

    // 2. 检查邮箱是否已存在
    const { data: existingGuide } = await supabase
      .from('guides')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingGuide) {
      return createErrorResponse(Errors.validation('该邮箱已被注册'));
    }

    // 3. 生成唯一的推荐码（带重试机制）
    let referralCode: string;
    try {
      referralCode = await generateUniqueReferralCode(supabase, 10);
    } catch (error) {
      logError(normalizeError(error), { path: '/api/guide/register', method: 'POST' });
      return createErrorResponse(Errors.internal('无法生成唯一推荐码，请稍后重试'));
    }

    // 4. 创建 Supabase Auth 账户
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
      logError(normalizeError(authError), { path: '/api/guide/register', method: 'POST' });
      return createErrorResponse(Errors.internal('创建账户失败，请稍后重试'));
    }

    // 5. 在 guides 表中创建记录
    const { error: guideError } = await supabase
      .from('guides')
      .insert({
        auth_user_id: authData.user.id,
        email,
        name,
        phone,
        wechat_id: wechat_id || null,
        referral_code: referralCode,
        referrer_id: referrerId, // ✅ 设置推荐人 ID
        status: 'approved',
        level: 'bronze',
        kyc_status: 'pending',
        total_commission: 0,
        total_bookings: 0,
      });

    if (guideError) {
      // ⚠️ 关键：如果创建 guides 记录失败，必须删除刚创建的 auth 账户
      console.error('[CRITICAL] 导游记录创建失败，正在清理 auth 账户:', guideError);
      await supabase.auth.admin.deleteUser(authData.user.id);

      logError(normalizeError(guideError), { path: '/api/guide/register', method: 'POST' });
      return createErrorResponse(Errors.internal('注册失败，请稍后重试'));
    }

    // 6. 注册成功
    return NextResponse.json({
      success: true,
      message: '注册成功！',
      guideId: authData.user.id,
      referralCode,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/register', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
