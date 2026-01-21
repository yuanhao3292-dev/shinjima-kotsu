import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { decryptPII, maskPII } from '@/lib/utils/encryption';
import { sendKYCNotification } from '@/lib/email';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { KYCReviewSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 管理员 KYC API
 *
 * GET /api/admin/kyc - 获取待审核的 KYC 列表
 * GET /api/admin/kyc?id=xxx - 获取单个 KYC 详情
 */
export async function GET(request: NextRequest) {
  // GET 端点速率限制（防数据枚举攻击）
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(
    `${clientIp}:/api/admin/kyc:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  // 验证管理员身份
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const guideId = searchParams.get('id');
  const status = searchParams.get('status') || 'submitted';

  try {
    if (guideId) {
      // 获取单个导游的 KYC 详情
      const { data: guide, error } = await supabase
        .from('guides')
        .select(`
          id, name, email, phone,
          kyc_status, id_document_type, id_document_number,
          legal_name, nationality,
          id_document_front_url, id_document_back_url,
          kyc_submitted_at, kyc_reviewed_at, kyc_review_note,
          created_at
        `)
        .eq('id', guideId)
        .single();

      if (error) {
        return createErrorResponse(Errors.notFound('导游不存在'));
      }

      // 解密身份证号码并脱敏显示
      let maskedDocumentNumber = null;
      if (guide.id_document_number) {
        try {
          const decrypted = decryptPII(guide.id_document_number);
          maskedDocumentNumber = maskPII(decrypted);
        } catch {
          maskedDocumentNumber = '解密失败';
        }
      }

      return NextResponse.json({
        ...guide,
        id_document_number_masked: maskedDocumentNumber,
        id_document_number: undefined, // 不返回原始加密数据
      });
    } else {
      // 获取 KYC 列表
      const { data: guides, error } = await supabase
        .from('guides')
        .select(`
          id, name, email,
          kyc_status, id_document_type,
          legal_name, nationality,
          kyc_submitted_at
        `)
        .eq('kyc_status', status)
        .order('kyc_submitted_at', { ascending: false });

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/kyc', method: 'GET' });
        return createErrorResponse(Errors.internal('获取 KYC 列表失败'));
      }

      return NextResponse.json({ guides: guides || [] });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/kyc', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

/**
 * POST /api/admin/kyc - 审核 KYC
 */
export async function POST(request: NextRequest) {
  try {
    // 速率限制检查（管理员敏感操作）
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(
      `${clientIp}:/api/admin/kyc`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    // 验证管理员身份
    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    // 使用 Zod 验证输入
    const validation = await validateBody(request, KYCReviewSchema);
    if (!validation.success) return validation.error;
    const { guideId, action, reviewNote } = validation.data;

    const supabase = getSupabaseAdmin();
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // 更新导游 KYC 状态（状态机保护：只允许从 submitted 状态审核）
    const { data: updateResult, error } = await supabase
      .from('guides')
      .update({
        kyc_status: newStatus,
        kyc_reviewed_at: new Date().toISOString(),
        kyc_review_note: reviewNote || null,
        ...(action === 'approve' ? { status: 'approved' } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', guideId)
      .eq('kyc_status', 'submitted') // 状态机保护
      .select('id');

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/kyc', method: 'POST' });
      return createErrorResponse(Errors.internal('更新 KYC 状态失败'));
    }

    // 检查是否实际更新了记录（状态机保护触发）
    if (!updateResult || updateResult.length === 0) {
      return createErrorResponse(
        Errors.business('该 KYC 申请不存在或状态不是待审核', 'KYC_INVALID_STATE')
      );
    }

    // 获取导游信息用于发送邮件
    const { data: guideData } = await supabase
      .from('guides')
      .select('name, email')
      .eq('id', guideId)
      .single();

    // 发送 KYC 审核结果通知邮件
    if (guideData?.email) {
      await sendKYCNotification({
        guideEmail: guideData.email,
        guideName: guideData.name || '用户',
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewNote: reviewNote || undefined,
      }).catch(err => {
        console.error('发送 KYC 通知邮件失败:', err);
      });
    }

    // 记录审计日志（失败时记录告警但不阻断主流程）
    const { error: auditError } = await supabase.from('audit_logs').insert({
      action: `kyc_${action}`,
      entity_type: 'guide',
      entity_id: guideId,
      admin_id: authResult.userId,
      admin_email: authResult.email,
      details: { reviewNote },
    });

    if (auditError) {
      console.error('[CRITICAL] 审计日志写入失败:', auditError);
      // 生产环境可集成告警系统
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'KYC 已通过' : 'KYC 已拒绝',
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/kyc', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
