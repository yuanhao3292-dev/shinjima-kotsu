import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * PATCH /api/admin/orders/[id]
 *
 * 管理员更新订单状态（确认预约 / 标记完成 / 取消）。
 * 退款走专门的 POST /api/admin/orders/[id]/refund（含 Stripe 退款 + 佣金撤回）。
 */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  confirmed: ['paid'],
  completed: ['confirmed'],
  cancelled: ['pending', 'paid', 'confirmed'],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const newStatus: string = body.status;

    if (!ALLOWED_TRANSITIONS[newStatus]) {
      return createErrorResponse(Errors.validation('无效的目标状态'));
    }

    const supabase = getSupabaseAdmin();
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', id)
      .single();
    if (fetchError || !order) {
      return createErrorResponse(Errors.notFound('订单不存在'));
    }
    if (!ALLOWED_TRANSITIONS[newStatus].includes(order.status)) {
      return createErrorResponse(
        Errors.validation(`订单当前状态为 ${order.status}，不能变更为 ${newStatus}`)
      );
    }

    const patch: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'confirmed') patch.confirmed_at = new Date().toISOString();
    if (newStatus === 'completed') patch.completed_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('orders')
      .update(patch)
      .eq('id', id);
    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    const normalized = normalizeError(error);
    logError(normalized, { path: '/api/admin/orders/[id]', method: 'PATCH' });
    return createErrorResponse(normalized);
  }
}
