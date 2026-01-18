import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

// 测试邮件 API - 仅用于测试邮件模板
// 安全限制：仅开发环境可用，生产环境需要 Admin 认证
export async function POST(request: NextRequest) {
  // 生产环境禁止访问（除非有 Admin Token）
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: 'This endpoint is disabled in production' },
        { status: 403 }
      );
    }
  }

  const { testEmail } = await request.json();

  if (!testEmail) {
    return NextResponse.json({ error: '请提供测试邮箱地址' }, { status: 400 });
  }

  try {
    const result = await sendOrderConfirmationEmail({
      customerName: '測試客戶',
      customerEmail: testEmail,
      packageName: 'SELECT 甄選套餐（胃腸鏡）',
      packagePrice: 825000,
      orderId: 'test-order-' + Date.now(),
      preferredDate: '2025-02-15',
      preferredTime: 'morning',
      notes: '這是一封測試郵件，請確認郵件模板是否正常顯示。',
    });

    return NextResponse.json({
      success: true,
      message: '測試郵件已發送',
      result
    });
  } catch (error: any) {
    console.error('發送測試郵件失敗:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
