import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';

/**
 * 管理员工单 API
 *
 * GET /api/admin/tickets - 获取工单列表
 * GET /api/admin/tickets?id=xxx - 获取单个工单详情
 */
export async function GET(request: NextRequest) {
  // 验证管理员身份
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('id');
  const status = searchParams.get('status');

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

      if (error) {
        return NextResponse.json({ error: '工单不存在' }, { status: 404 });
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
      // 获取工单列表
      let query = supabase
        .from('support_tickets')
        .select(`
          id, ticket_type, subject, status, priority,
          created_at, updated_at,
          guide:guides(id, name, email)
        `)
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: tickets, error } = await query;

      if (error) {
        console.error('获取工单列表失败:', error);
        return NextResponse.json({ error: '获取列表失败' }, { status: 500 });
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
        stats: statusCounts,
      });
    }
  } catch (error: unknown) {
    console.error('工单 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * POST /api/admin/tickets - 更新工单状态或添加回复
 */
export async function POST(request: NextRequest) {
  // 验证管理员身份
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  try {
    const body = await request.json();
    const { ticketId, action, status, priority, resolutionNote, replyContent, assignedTo } = body;

    if (!ticketId) {
      return NextResponse.json({ error: '缺少工单 ID' }, { status: 400 });
    }

    // 更新工单状态
    if (action === 'update_status' && status) {
      const updateData: Record<string, any> = {
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
        console.error('更新工单失败:', error);
        return NextResponse.json({ error: '更新失败' }, { status: 500 });
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
        console.error('添加回复失败:', error);
        return NextResponse.json({ error: '回复失败' }, { status: 500 });
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

    return NextResponse.json({ error: '无效的操作' }, { status: 400 });
  } catch (error: unknown) {
    console.error('工单操作错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
