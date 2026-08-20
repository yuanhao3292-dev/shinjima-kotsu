import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * GET /api/admin/screenings
 *
 * 健康问卷管理列表。此前后台页面在浏览器端直查 health_screenings ——
 * RLS 只允许用户读自己的记录，管理员只能看到自己账号提交的问卷
 * （48 条里只显示 7 条）。改为服务端 service role 全量读取。
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('health_screenings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;

    return NextResponse.json({ screenings: data || [] });
  } catch (error) {
    const normalized = normalizeError(error);
    logError(normalized, { path: '/api/admin/screenings', method: 'GET' });
    return createErrorResponse(normalized);
  }
}
