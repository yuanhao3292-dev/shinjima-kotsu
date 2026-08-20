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

    // 线上库 orders.package_id 没有实际外键（表建于迁移体系之前），
    // PostgREST 无法隐式 join —— 套餐表只有十几行，取回来手动拼。
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
        package_id
      `)
      .order('created_at', { ascending: false })
      .limit(500);

    if (status && status !== 'all' && VALID_STATUS.includes(status)) {
      query = query.eq('status', status);
    }

    const [{ data, error }, { data: packages, error: pkgError }] = await Promise.all([
      query,
      supabase.from('medical_packages').select('id, name_zh_tw, slug, price_jpy'),
    ]);
    if (error) throw error;
    if (pkgError) throw pkgError;

    const pkgById = new Map((packages || []).map((p) => [p.id, p]));
    const orders = (data || []).map(({ package_id, ...order }) => ({
      ...order,
      medical_packages: package_id ? (pkgById.get(package_id) ?? null) : null,
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    const normalized = normalizeError(error);
    logError(normalized, { path: '/api/admin/orders', method: 'GET' });
    return createErrorResponse(normalized);
  }
}
