import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';

/**
 * 管理员导游管理 API
 *
 * GET /api/admin/guides - 获取导游列表
 * GET /api/admin/guides?id=xxx - 获取单个导游详情
 */
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { searchParams } = new URL(request.url);
  const guideId = searchParams.get('id');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    if (guideId) {
      // 获取单个导游详情
      const { data: guide, error } = await supabase
        .from('guides')
        .select(`
          *,
          referrer:referred_by(id, name, referral_code)
        `)
        .eq('id', guideId)
        .single();

      if (error) {
        return NextResponse.json({ error: '导游不存在' }, { status: 404 });
      }

      // 获取导游的订单统计
      const { count: bookingCount } = await supabase
        .from('guide_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('guide_id', guideId);

      // 获取导游的推荐人数
      const { count: referralCount } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', guideId);

      return NextResponse.json({
        ...guide,
        stats: {
          bookingCount: bookingCount || 0,
          referralCount: referralCount || 0,
        },
      });
    } else {
      // 获取导游列表
      let query = supabase
        .from('guides')
        .select(`
          id, name, email, phone, wechat_id,
          status, level, kyc_status,
          total_commission, total_bookings,
          referral_code, referred_by,
          created_at, updated_at
        `)
        .order('created_at', { ascending: false });

      // 按状态筛选
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // 搜索
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,referral_code.ilike.%${search}%`);
      }

      const { data: guides, error } = await query;

      if (error) {
        console.error('获取导游列表失败:', error);
        return NextResponse.json({ error: '获取列表失败' }, { status: 500 });
      }

      // 统计
      const { count: total } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true });

      const { count: approved } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: pending } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      return NextResponse.json({
        guides: guides || [],
        stats: {
          total: total || 0,
          approved: approved || 0,
          pending: pending || 0,
          suspended: (total || 0) - (approved || 0) - (pending || 0),
        },
      });
    }
  } catch (error: any) {
    console.error('导游 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * POST /api/admin/guides - 更新导游状态
 */
export async function POST(request: NextRequest) {
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    const { guideId, action, level, note } = body;

    if (!guideId || !action) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }

    let updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case 'approve':
        updateData.status = 'approved';
        break;
      case 'suspend':
        updateData.status = 'suspended';
        break;
      case 'reactivate':
        updateData.status = 'approved';
        break;
      case 'update_level':
        if (!level) {
          return NextResponse.json({ error: '缺少等级参数' }, { status: 400 });
        }
        updateData.level = level;
        break;
      default:
        return NextResponse.json({ error: '无效的操作' }, { status: 400 });
    }

    const { error } = await supabase
      .from('guides')
      .update(updateData)
      .eq('id', guideId);

    if (error) {
      console.error('更新导游状态失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    // 记录审计日志
    try {
      await supabase.from('audit_logs').insert({
        action: `guide_${action}`,
        entity_type: 'guide',
        entity_id: guideId,
        admin_id: authResult.userId,
        admin_email: authResult.email,
        details: { level, note },
      });
    } catch {
      // 审计日志失败不影响主流程
    }

    return NextResponse.json({
      success: true,
      message: '操作成功',
    });
  } catch (error: any) {
    console.error('导游操作错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
