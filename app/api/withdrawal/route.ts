import { NextRequest, NextResponse } from 'next/server';
import { maskPII } from '@/lib/utils/encryption';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { WithdrawalRequestSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

// 最低提现金额
const MIN_WITHDRAWAL_AMOUNT = 5000; // 5,000 日元

/**
 * 提现申请 API
 *
 * GET /api/withdrawal - 获取提现历史
 * POST /api/withdrawal - 创建提现申请
 */

export async function GET(request: NextRequest) {
  // GET 端点速率限制
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/withdrawal:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return createErrorResponse(Errors.auth('未授权'));
  }

  const token = authHeader.split(' ')[1];
  const supabase = getSupabaseAdmin();

  try {
    // 验证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return createErrorResponse(Errors.auth('认证失败'));
    }

    // 获取导游信息
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, available_balance, total_commission, total_withdrawn, bank_name, bank_branch, bank_account_type, bank_account_number, bank_account_holder')
      .eq('auth_user_id', user.id)
      .single();

    if (guideError || !guide) {
      return createErrorResponse(Errors.notFound('导游不存在'));
    }

    // 获取提现历史
    const { data: withdrawals, error: withdrawalError } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('guide_id', guide.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (withdrawalError) {
      logError(normalizeError(withdrawalError), { path: '/api/withdrawal', method: 'GET' });
      return createErrorResponse(Errors.internal('获取提现历史失败'));
    }

    // 计算统计
    const pendingAmount = withdrawals
      ?.filter(w => ['pending', 'approved', 'processing'].includes(w.status))
      .reduce((sum, w) => sum + Number(w.amount), 0) || 0;

    return NextResponse.json({
      balance: {
        available: guide.available_balance || 0,
        totalEarned: guide.total_commission || 0,
        totalWithdrawn: guide.total_withdrawn || 0,
        pending: pendingAmount,
      },
      bankInfo: {
        bankName: guide.bank_name,
        bankBranch: guide.bank_branch,
        accountType: guide.bank_account_type,
        // 脱敏银行账号，只显示后4位
        accountNumber: guide.bank_account_number ? maskPII(guide.bank_account_number, 4) : null,
        // 脱敏账户名义人
        accountHolder: guide.bank_account_holder ? maskPII(guide.bank_account_holder, 4) : null,
      },
      withdrawals: withdrawals || [],
      minAmount: MIN_WITHDRAWAL_AMOUNT,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/withdrawal', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查（敏感端点）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/withdrawal`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponse(Errors.auth('未授权'));
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseAdmin();

    // 验证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return createErrorResponse(Errors.auth('认证失败'));
    }

    // 使用 Zod 验证输入
    const validation = await validateBody(request, WithdrawalRequestSchema);
    if (!validation.success) return validation.error;
    const { amount } = validation.data;

    // 获取导游信息
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, available_balance, kyc_status, bank_name, bank_branch, bank_account_type, bank_account_number, bank_account_holder')
      .eq('auth_user_id', user.id)
      .single();

    if (guideError || !guide) {
      return createErrorResponse(Errors.notFound('导游不存在'));
    }

    // 检查 KYC 状态
    if (guide.kyc_status !== 'approved') {
      return createErrorResponse(Errors.business('请先完成身份验证（KYC）才能提现', 'KYC_REQUIRED'));
    }

    // 检查银行信息是否完整
    if (!guide.bank_name || !guide.bank_account_number || !guide.bank_account_holder) {
      return createErrorResponse(Errors.business('请先完善银行账户信息', 'BANK_INFO_REQUIRED'));
    }

    // 检查余额
    if ((guide.available_balance || 0) < amount) {
      return createErrorResponse(Errors.business('可提现余额不足', 'INSUFFICIENT_BALANCE'));
    }

    // 检查是否有待处理的提现申请
    const { data: pendingRequests } = await supabase
      .from('withdrawal_requests')
      .select('id')
      .eq('guide_id', guide.id)
      .in('status', ['pending', 'approved', 'processing'])
      .limit(1);

    if (pendingRequests && pendingRequests.length > 0) {
      return createErrorResponse(Errors.business('您有待处理的提现申请，请等待处理完成后再申请', 'PENDING_WITHDRAWAL_EXISTS'));
    }

    // 创建提现申请
    const { data: withdrawal, error: insertError } = await supabase
      .from('withdrawal_requests')
      .insert({
        guide_id: guide.id,
        amount: amount,
        bank_name: guide.bank_name,
        bank_branch: guide.bank_branch,
        account_type: guide.bank_account_type,
        account_number: guide.bank_account_number,
        account_holder: guide.bank_account_holder,
      })
      .select()
      .single();

    if (insertError) {
      logError(normalizeError(insertError), { path: '/api/withdrawal', method: 'POST', context: 'create_withdrawal' });
      if (insertError.message?.includes('余额不足')) {
        return createErrorResponse(Errors.business('可提现余额不足', 'INSUFFICIENT_BALANCE'));
      }
      return createErrorResponse(Errors.internal('创建提现申请失败'));
    }

    return NextResponse.json({
      success: true,
      message: '提现申请已提交，我们将在 1-3 个工作日内处理',
      withdrawal,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/withdrawal', method: 'POST' });
    return createErrorResponse(apiError);
  }
}

/**
 * DELETE /api/withdrawal?id=xxx - 取消提现申请
 */
export async function DELETE(request: NextRequest) {
  try {
    // DELETE 端点速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/withdrawal:DELETE`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponse(Errors.auth('未授权'));
    }

    const token = authHeader.split(' ')[1];
    const { searchParams } = new URL(request.url);
    const withdrawalId = searchParams.get('id');

    if (!withdrawalId) {
      return createErrorResponse(Errors.validation('缺少提现 ID'));
    }

    const supabase = getSupabaseAdmin();

    // 验证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return createErrorResponse(Errors.auth('认证失败'));
    }

    // 获取导游 ID
    const { data: guide } = await supabase
      .from('guides')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!guide) {
      return createErrorResponse(Errors.notFound('导游'));
    }

    // 检查提现申请是否存在且属于该导游
    const { data: withdrawal } = await supabase
      .from('withdrawal_requests')
      .select('id, status, guide_id')
      .eq('id', withdrawalId)
      .single();

    if (!withdrawal) {
      return createErrorResponse(Errors.notFound('提现申请'));
    }

    if (withdrawal.guide_id !== guide.id) {
      return createErrorResponse(Errors.forbidden('无权操作此提现申请'));
    }

    if (withdrawal.status !== 'pending') {
      return createErrorResponse(Errors.business('只能取消待审核的申请', 'WITHDRAWAL_INVALID_STATE'));
    }

    // 取消申请（触发器会自动退还余额）
    const { error: updateError } = await supabase
      .from('withdrawal_requests')
      .update({ status: 'cancelled' })
      .eq('id', withdrawalId);

    if (updateError) {
      logError(normalizeError(updateError), { path: '/api/withdrawal', method: 'DELETE' });
      return createErrorResponse(Errors.internal('取消失败'));
    }

    return NextResponse.json({
      success: true,
      message: '提现申请已取消',
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/withdrawal', method: 'DELETE' });
    return createErrorResponse(apiError);
  }
}
