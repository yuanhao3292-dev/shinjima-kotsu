import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { verifyInvoiceToken } from '@/lib/invoice-token';
import { InvoiceDocument, type InvoiceData } from '@/lib/invoice-pdf';

/**
 * GET /api/invoices/[orderId]?token=xxx
 *
 * 生成并返回订单收据 PDF。
 * 通过签名 token 验证访问权限（无需登录）。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // UUID 格式校验
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 查询订单 + 客户 + 套餐
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount_jpy,
        paid_at,
        status,
        customer_id,
        package_id,
        customer_snapshot
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 只有已付款的订单才能下载收据
    if (!['paid', 'confirmed', 'completed', 'refunded'].includes(order.status)) {
      return NextResponse.json({ error: 'Order not paid' }, { status: 400 });
    }

    // 获取客户邮箱用于 token 验证
    const snapshot = order.customer_snapshot as { email?: string; name?: string } | null;
    let customerEmail = snapshot?.email || '';
    let customerName = snapshot?.name || '';

    if (!customerEmail && order.customer_id) {
      const { data: customer } = await supabase
        .from('customers')
        .select('email, name')
        .eq('id', order.customer_id)
        .single();
      customerEmail = customer?.email || '';
      customerName = customerName || customer?.name || '';
    }

    if (!customerEmail) {
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 });
    }

    // 验证 token
    const isValid = await verifyInvoiceToken(token, orderId, customerEmail);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // 查询套餐名称
    let packageName = '';
    if (order.package_id) {
      const { data: pkg } = await supabase
        .from('medical_packages')
        .select('name_zh_tw, name_ja, name_en')
        .eq('id', order.package_id)
        .single();
      packageName = pkg?.name_zh_tw || pkg?.name_ja || pkg?.name_en || '';
    }

    // 检测语言
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = (['ja', 'zh-TW', 'zh-CN', 'en'].includes(localeCookie || '')
      ? localeCookie
      : 'zh-TW') as 'ja' | 'zh-TW' | 'zh-CN' | 'en';

    // 生成 PDF
    const invoiceData: InvoiceData = {
      orderId: order.id,
      orderNumber: order.order_number || undefined,
      paidAt: order.paid_at || new Date().toISOString(),
      customerName,
      customerEmail,
      packageName: packageName || 'Medical Service',
      totalAmount: order.total_amount_jpy || 0,
      locale,
    };

    const pdfBuffer = await renderToBuffer(
      <InvoiceDocument data={invoiceData} />
    );

    // 审计日志（電子帳簿保存法 合规）
    supabase.from('invoice_downloads').insert({
      order_id: orderId,
      customer_email: customerEmail,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      user_agent: (request.headers.get('user-agent') || '').slice(0, 500),
    }).then(({ error: logError }) => {
      if (logError) console.warn('[Invoice] Failed to log download:', logError.message);
    });

    const filename = `receipt-${(order.order_number || order.id.slice(-8)).toUpperCase()}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[Invoice] PDF generation failed:', err);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
