import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';

/**
 * 管理员店铺管理 API
 *
 * GET /api/admin/venues - 获取店铺列表
 * GET /api/admin/venues?id=xxx - 获取单个店铺详情
 * POST /api/admin/venues - 创建/更新/删除店铺
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
  const venueId = searchParams.get('id');
  const category = searchParams.get('category');
  const city = searchParams.get('city');
  const active = searchParams.get('active');

  try {
    if (venueId) {
      // 获取单个店铺详情
      const { data: venue, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();

      if (error) {
        return NextResponse.json({ error: '店铺不存在' }, { status: 404 });
      }

      return NextResponse.json(venue);
    } else {
      // 获取店铺列表
      let query = supabase
        .from('venues')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (city && city !== '全部') {
        query = query.eq('city', city);
      }
      if (active === 'true') {
        query = query.eq('is_active', true);
      } else if (active === 'false') {
        query = query.eq('is_active', false);
      }

      const { data: venues, error } = await query;

      if (error) {
        console.error('获取店铺列表失败:', error);
        return NextResponse.json({ error: '获取失败' }, { status: 500 });
      }

      // 统计
      const { count: total } = await supabase
        .from('venues')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('venues')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return NextResponse.json({
        venues: venues || [],
        stats: {
          total: total || 0,
          active: activeCount || 0,
          inactive: (total || 0) - (activeCount || 0),
        },
      });
    }
  } catch (error: any) {
    console.error('店铺 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

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
    const { action, venueId, venueData } = body;

    if (!action) {
      return NextResponse.json({ error: '缺少操作类型' }, { status: 400 });
    }

    switch (action) {
      case 'create': {
        if (!venueData) {
          return NextResponse.json({ error: '缺少店铺数据' }, { status: 400 });
        }

        const { error } = await supabase
          .from('venues')
          .insert({
            ...venueData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('创建店铺失败:', error);
          return NextResponse.json({ error: '创建失败' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: '店铺已创建' });
      }

      case 'update': {
        if (!venueId || !venueData) {
          return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
        }

        const { error } = await supabase
          .from('venues')
          .update({
            ...venueData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', venueId);

        if (error) {
          console.error('更新店铺失败:', error);
          return NextResponse.json({ error: '更新失败' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: '店铺已更新' });
      }

      case 'toggle_active': {
        if (!venueId) {
          return NextResponse.json({ error: '缺少店铺 ID' }, { status: 400 });
        }

        // 获取当前状态
        const { data: venue } = await supabase
          .from('venues')
          .select('is_active')
          .eq('id', venueId)
          .single();

        if (!venue) {
          return NextResponse.json({ error: '店铺不存在' }, { status: 404 });
        }

        const { error } = await supabase
          .from('venues')
          .update({
            is_active: !venue.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', venueId);

        if (error) {
          console.error('切换店铺状态失败:', error);
          return NextResponse.json({ error: '操作失败' }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: venue.is_active ? '店铺已下架' : '店铺已上架',
        });
      }

      case 'delete': {
        if (!venueId) {
          return NextResponse.json({ error: '缺少店铺 ID' }, { status: 400 });
        }

        const { error } = await supabase
          .from('venues')
          .delete()
          .eq('id', venueId);

        if (error) {
          console.error('删除店铺失败:', error);
          return NextResponse.json({ error: '删除失败' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: '店铺已删除' });
      }

      default:
        return NextResponse.json({ error: '无效的操作' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('店铺操作错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
