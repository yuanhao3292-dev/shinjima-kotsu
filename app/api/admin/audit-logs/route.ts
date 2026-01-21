import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { validateBody } from '@/lib/validations/validate';
import { AuditLogCreateSchema } from '@/lib/validations/api-schemas';

/**
 * 审计日志 API
 *
 * GET /api/admin/audit-logs - 获取审计日志列表
 * GET /api/admin/audit-logs?entity_type=guide&entity_id=xxx - 获取特定实体的日志
 * GET /api/admin/audit-logs?action=kyc_approve - 按操作类型筛选
 * GET /api/admin/audit-logs?severity=warning - 按严重程度筛选
 * GET /api/admin/audit-logs?from=2026-01-01&to=2026-01-31 - 按日期范围筛选
 */
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('entity_type');
  const entityId = searchParams.get('entity_id');
  const action = searchParams.get('action');
  const severity = searchParams.get('severity');
  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

  try {
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // 应用筛选条件
    if (entityType) {
      query = query.eq('entity_type', entityType);
    }
    if (entityId) {
      query = query.eq('entity_id', entityId);
    }
    if (action) {
      query = query.ilike('action', `%${action}%`);
    }
    if (severity) {
      query = query.eq('severity', severity);
    }
    if (fromDate) {
      query = query.gte('created_at', `${fromDate}T00:00:00`);
    }
    if (toDate) {
      query = query.lte('created_at', `${toDate}T23:59:59`);
    }

    // 分页
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('获取审计日志失败:', error);
      return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }

    // 获取统计数据
    const { data: stats } = await supabase
      .from('audit_logs')
      .select('severity')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const statsMap = {
      info: 0,
      warning: 0,
      critical: 0,
      total24h: 0,
    };

    stats?.forEach(s => {
      statsMap.total24h++;
      if (s.severity && statsMap[s.severity as keyof typeof statsMap] !== undefined) {
        (statsMap[s.severity as keyof typeof statsMap] as number)++;
      }
    });

    return NextResponse.json({
      logs: logs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      stats: statsMap,
    });
  } catch (error: unknown) {
    console.error('审计日志 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * POST /api/admin/audit-logs - 手动记录审计日志
 */
export async function POST(request: NextRequest) {
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  try {
    // 使用 Zod Schema 验证输入
    const validation = await validateBody(request, AuditLogCreateSchema);
    if (!validation.success) return validation.error;
    const { action, entityType, entityId, details, severity } = validation.data;

    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        action,
        entity_type: entityType,
        entity_id: entityId,
        admin_id: authResult.userId,
        admin_email: authResult.email,
        details: details || null,
        severity: severity || 'info',
      })
      .select()
      .single();

    if (error) {
      console.error('记录审计日志失败:', error);
      return NextResponse.json({ error: '记录失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      log: data,
    });
  } catch (error: unknown) {
    console.error('审计日志记录错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
