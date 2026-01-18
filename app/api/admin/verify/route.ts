import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';

/**
 * 验证管理员身份
 * GET /api/admin/verify
 */
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));

  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    email: authResult.email,
  });
}
