import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { TicketActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 管理员工单 API
 *
 * GET /api/admin/tickets - 获取工单列表
 * GET /api/admin/tickets?id=xxx - 获取单个工单详情
 */
export async function GET(request: NextRequest) {
  // 速率限制
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(
    `${clientIp}:/api/admin/tickets:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  // 验证管理员身份
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('id');
  const status = searchParams.get('status');

  // 分页参数
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const offset = (page - 1) * limit;

  try {
    if (ticketId) {
      // 获取单个工单详情
      const { data: ticket, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          guide:guides(id, name, email, phone)
        `)
        .eq('id', ticketId)
        .single();

      if (error || !ticket) {
        return createErrorResponse(Errors.notFound('工单不存在'));
      }

      // 获取回复列表
      const { data: replies } = await supabase
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      return NextResponse.json({
        ticket,
        replies: replies || [],
      });
    } else {
      // 获取工单列表（带分页）
      let query = supabase
        .from('support_tickets')
        .select(`
          id, ticket_type, subject, status, priority,
          created_at, updated_at,
          guide:guides(id, name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: tickets, error, count } = await query;

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/tickets', method: 'GET' });
        return createErrorResponse(Errors.internal('获取工单列表失败'));
      }

      // 统计各状态数量
      const { data: stats } = await supabase
        .from('support_tickets')
        .select('status');

      const statusCounts = {
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0,
      };
      (stats || []).forEach((t: { status: keyof typeof statusCounts }) => {
        if (statusCounts[t.status] !== undefined) {
          statusCounts[t.status]++;
        }
      });

      return NextResponse.json({
        tickets: tickets || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
        stats: statusCounts,
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/tickets', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

/**
 * POST /api/admin/tickets - 更新工单状态或添加回复
 */
export async function POST(request: NextRequest) {
  try {
    // 速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(
      `${clientIp}:/api/admin/tickets`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    // 验证管理员身份
    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    // 使用 Zod 验证输入
    const validation = await validateBody(request, TicketActionSchema);
    if (!validation.success) return validation.error;
    const { ticketId, action, status, priority, resolutionNote, replyContent, assignedTo } = validation.data;

    const supabase = getSupabaseAdmin();

    // 更新工单状态
    if (action === 'update_status' && status) {
      const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (priority) updateData.priority = priority;
      if (assignedTo) updateData.assigned_to = assignedTo;
      if (resolutionNote) updateData.resolution_note = resolutionNote;
      if (status === 'resolved' || status === 'closed') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId);

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/tickets', method: 'POST' });
        return createErrorResponse(Errors.internal('更新工单失败'));
      }

      // 记录审计日志
      const { error: auditError } = await supabase.from('audit_logs').insert({
        action: `ticket_${action}`,
        entity_type: 'support_ticket',
        entity_id: ticketId,
        admin_id: authResult.userId,
        admin_email: authResult.email,
        details: { status, priority, resolutionNote },
      });

      if (auditError) {
        console.error('[CRITICAL] 审计日志写入失败:', auditError);
      }

      return NextResponse.json({ success: true, message: '工单已更新' });
    }

    // 添加回复
    if (action === 'reply' && replyContent) {
      const { error } = await supabase
        .from('ticket_replies')
        .insert({
          ticket_id: ticketId,
          reply_by: authResult.email,
          is_staff: true,
          content: replyContent,
        });

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/tickets', method: 'POST' });
        return createErrorResponse(Errors.internal('回复失败'));
      }

      // 更新工单状态为处理中（如果当前是 open）
      await supabase
        .from('support_tickets')
        .update({
          status: 'in_progress',
          assigned_to: authResult.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId)
        .eq('status', 'open');

      return NextResponse.json({ success: true, message: '回复已发送' });
    }

    return createErrorResponse(Errors.validation('无效的操作'));
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/tickets', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
