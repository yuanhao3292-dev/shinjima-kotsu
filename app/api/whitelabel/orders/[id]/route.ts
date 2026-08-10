/**
 * 白标订单详情 API
 * ============================================
 * GET /api/whitelabel/orders/[id] - 获取订单详情
 * PATCH /api/whitelabel/orders/[id] - 更新订单状态（管理员操作）
 *
 * DB 表: white_label_orders (058_white_label_system.sql)
 * 状态: pending → confirmed → completed / cancelled
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
  createRateLimitHeaders,
} from '@/lib/utils/rate-limiter';
import {
  normalizeError,
  logError,
  createErrorResponse,
  Errors,
} from '@/lib/utils/api-errors';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { calculateWithholdingTax } from '@/lib/commission-tax';
import { z } from 'zod';

const getSupabase = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error('Supabase configuration is missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// 内联 Zod schema
const UpdateOrderSchema = z.object({
  action: z.enum(['confirm', 'complete', 'cancel']),
  totalAmount: z.number().int().min(0).optional(),
  commissionAmount: z.number().int().min(0).optional(),
  cancelReason: z.string().max(500).optional(),
  adminNotes: z.string().max(2000).optional(),
});

// 状态转换映射
const ACTION_TO_STATUS: Record<string, string> = {
  confirm: 'confirmed',
  complete: 'completed',
  cancel: 'cancelled',
};

// 合法状态转换表（终态不可变更）
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

// ============================================
// GET - 获取订单详情
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/orders/${orderId}`,
      RATE_LIMITS.standard
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const supabase = getSupabase();

    // 鉴权：仅允许 owning guide 或 admin 查看
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponse(Errors.auth('未授权'));
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return createErrorResponse(Errors.auth('认证失败'));
    }

    // 检查是否是 admin
    const adminResult = await verifyAdminAuth(authHeader);
    const isAdmin = adminResult.isValid;

    // 非 admin 则必须是 owning guide
    let callerGuideId: string | null = null;
    if (!isAdmin) {
      const { data: guide } = await supabase
        .from('guides')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();
      callerGuideId = guide?.id || null;
    }

    // 查询订单详情（直接通过 guide_id 关联 guides）
    const { data: order, error: queryError } = await supabase
      .from('white_label_orders')
      .select(`
        *,
        guides (
          id,
          name,
          email
        ),
        page_modules (
          id,
          name,
          category
        )
      `)
      .eq('id', orderId)
      .single();

    if (queryError || !order) {
      console.error('[Orders] Order not found:', orderId);
      return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    }

    // 非 admin 且不是 owning guide → 403
    if (!isAdmin && order.guide_id !== callerGuideId) {
      return createErrorResponse(Errors.forbidden('无权查看此订单'));
    }

    // 构建响应（匹配 DB 实际列）
    const response = {
      id: order.id,
      customer: {
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email,
        wechat: order.customer_wechat,
        line: order.customer_line,
        notes: order.customer_notes,
      },
      service: {
        type: order.service_type,
        name: order.service_name,
        date: order.service_date,
        time: order.service_time,
      },
      status: order.status,
      payment: {
        status: order.payment_status,
        totalAmount: order.total_amount,
        paidAt: order.paid_at,
        stripePaymentIntentId: order.stripe_payment_intent_id,
      },
      commission: {
        rate: order.commission_rate,
        amount: order.commission_amount,
      },
      timeline: {
        createdAt: order.created_at,
        confirmedAt: order.confirmed_at,
        completedAt: order.completed_at,
        cancelledAt: order.cancelled_at,
      },
      cancelReason: order.cancel_reason,
      adminNotes: order.admin_notes,
      module: order.page_modules,
      guide: order.guides,
      updatedAt: order.updated_at,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    console.error('[Orders] GET detail error:', apiError);
    logError(apiError, { path: '/api/whitelabel/orders/[id]', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

// ============================================
// PATCH - 更新订单状态
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/orders/${orderId}:patch`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const supabase = getSupabase();

    // 管理员鉴权
    const adminAuth = await verifyAdminAuth(request.headers.get('authorization'));
    if (!adminAuth.isValid) {
      return createErrorResponse(Errors.forbidden(adminAuth.error || '需要管理员权限'));
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(Errors.validation('无效的请求体'));
    }

    const parseResult = UpdateOrderSchema.safeParse(body);
    if (!parseResult.success) {
      return createErrorResponse(Errors.validation('参数错误'));
    }

    const { action, totalAmount, commissionAmount, cancelReason, adminNotes } = parseResult.data;

    // 获取当前订单（含计佣所需字段）
    const { data: currentOrder, error: fetchError } = await supabase
      .from('white_label_orders')
      .select('id, status, guide_id, commission_rate, total_amount, source_order_id')
      .eq('id', orderId)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    }

    const newStatus = ACTION_TO_STATUS[action];
    if (!newStatus) {
      return NextResponse.json({ error: '无效的操作' }, { status: 400 });
    }

    // 状态转换验证（终态不可变更）
    const allowedTransitions = VALID_TRANSITIONS[currentOrder.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        { error: `无法从 ${currentOrder.status} 转换到 ${newStatus}` },
        { status: 400 }
      );
    }

    // 构建更新数据（匹配 DB 实际列）
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    // 线下/手动订单完成时应入账的佣金（0 = 不入账）。在 update 成功后原子累计到导游。
    let offlineCommissionToCredit = 0;
    let offlineCommissionGuideId: string | null = null;

    switch (action) {
      case 'confirm':
        updateData.confirmed_at = new Date().toISOString();
        break;
      case 'complete': {
        updateData.completed_at = new Date().toISOString();
        if (totalAmount !== undefined) updateData.total_amount = totalAmount;

        // 线下计佣：仅对手动单（无 source_order_id，即非 Stripe 在线单）结算，
        // 避免与 webhook 在线计佣重复。complete 是终态且状态机不可回退，天然一次性幂等。
        const isManualOrder = !currentOrder.source_order_id;
        const effectiveTotal = totalAmount ?? (currentOrder.total_amount as number | null) ?? 0;
        const rate = (currentOrder.commission_rate as number | null) ?? 0;
        // 管理员可显式传入 commissionAmount，否则按 总额 × 佣金率(%) 计算
        const computedCommission = commissionAmount ?? Math.round(effectiveTotal * rate / 100);

        if (isManualOrder && currentOrder.guide_id && computedCommission > 0) {
          updateData.commission_amount = computedCommission;
          updateData.commission_status = 'calculated';
          // 佣金可提现等待期：完成日 + 14 天（与在线路径一致）
          const availableAt = new Date();
          availableAt.setDate(availableAt.getDate() + 14);
          updateData.commission_available_at = availableAt.toISOString();

          // 源泉徴収：与在线单口径一致（按导游税务居住地计算），存 withholding 列；
          // release 成熟时会扣除净额入 available_balance,避免线下单多发。
          const { data: guideTax } = await supabase
            .from('guides')
            .select('tax_residency')
            .eq('id', currentOrder.guide_id)
            .single();
          const isResident = guideTax?.tax_residency === 'resident';
          const { withholdingAmount, withholdingRate } = calculateWithholdingTax(computedCommission, isResident);
          updateData.withholding_tax_amount = withholdingAmount;
          updateData.withholding_tax_rate = withholdingRate;

          offlineCommissionToCredit = computedCommission;
          offlineCommissionGuideId = currentOrder.guide_id as string;
        } else if (commissionAmount !== undefined) {
          updateData.commission_amount = commissionAmount;
        }
        break;
      }
      case 'cancel':
        updateData.cancelled_at = new Date().toISOString();
        if (cancelReason) updateData.cancel_reason = cancelReason;
        break;
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('white_label_orders')
      .update(updateData)
      .eq('id', orderId)
      .select('id, status, commission_amount')
      .single();

    if (updateError) {
      console.error('[Orders] Update error:', updateError);
      logError(normalizeError(updateError), {
        path: '/api/whitelabel/orders/[id]',
        method: 'PATCH',
      });
      return NextResponse.json({ error: '更新订单失败' }, { status: 500 });
    }

    console.log(`[Orders] Order ${orderId}: ${currentOrder.status} → ${newStatus}`);

    // 线下手动单完成 → 原子累计导游佣金 + 转化计数（与在线 webhook 路径对齐）。
    // 放在状态更新成功之后：终态不可回退保证本分支每单最多执行一次。
    if (offlineCommissionGuideId && offlineCommissionToCredit > 0) {
      const { error: commissionErr } = await supabase.rpc('increment_guide_commission', {
        p_guide_id: offlineCommissionGuideId,
        p_amount: offlineCommissionToCredit,
      });
      if (commissionErr) {
        // 佣金累计失败不回滚订单完成状态，仅告警——避免订单状态与佣金入账互相阻塞。
        console.error(`[Orders] 线下佣金累计失败 order=${orderId}:`, commissionErr);
        logError(normalizeError(commissionErr), {
          path: '/api/whitelabel/orders/[id]',
          method: 'PATCH',
          context: 'offline_commission',
        });
      } else {
        await supabase.rpc('increment_guide_conversion_stats', { p_guide_id: offlineCommissionGuideId });
        console.log(`[Orders] 线下佣金入账: guide=${offlineCommissionGuideId}, +${offlineCommissionToCredit}円`);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      previousStatus: currentOrder.status,
      newStatus: updatedOrder.status,
      message: getStatusChangeMessage(action),
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    console.error('[Orders] PATCH error:', apiError);
    logError(apiError, { path: '/api/whitelabel/orders/[id]', method: 'PATCH' });
    return createErrorResponse(apiError);
  }
}

function getStatusChangeMessage(action: string): string {
  const messages: Record<string, string> = {
    confirm: '订单已确认',
    complete: '订单已完成',
    cancel: '订单已取消',
  };
  return messages[action] || '状态已更新';
}
