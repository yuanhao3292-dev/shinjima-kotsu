import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * GET /api/admin/orders?status=<all|pending|paid|confirmed|completed|cancelled|refunded>
 *
 * 管理后台的医疗订单列表。
 * 此前后台直接从浏览器查 `medical_orders` —— 那是一张手工建的空表，
 * 真订单全部在 `orders`（RLS 只允许客户看自己的单），所以后台永远显示
 * 「暂无订单」。改为服务端用 service role 查 `orders`。
 */
const VALID_STATUS = ['pending', 'paid', 'confirmed', 'completed', 'cancelled', 'refunded'];

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    const status = request.nextUrl.searchParams.get('status');
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        created_at,
        status,
        total_amount_jpy,
        preferred_date,
        preferred_time,
        notes,
        customer_snapshot,
        paid_at,
        confirmed_at,
        refunded_at,
        referred_by_guide_slug,
        medical_packages (
          name_zh_tw,
          slug,
          price_jpy
        )
      `)
      .order('created_at', { ascending: false })
      .limit(500);

    if (status && status !== 'all' && VALID_STATUS.includes(status)) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ orders: data || [] });
  } catch (error) {
    const normalized = normalizeError(error);
    logError(normalized, { path: '/api/admin/orders', method: 'GET' });
    return createErrorResponse(normalized);
  }
}
