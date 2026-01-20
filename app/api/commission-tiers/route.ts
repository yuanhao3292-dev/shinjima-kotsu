import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration is missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

/**
 * 获取佣金等级配置
 * 公开 API，用于前端展示分成比例
 */
export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: tiers, error } = await supabase
      .from('commission_tiers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('获取佣金等级失败:', error);
      return NextResponse.json(
        { error: '获取失败' },
        { status: 500 }
      );
    }

    // 提取关键信息
    const minRate = tiers?.[0]?.commission_rate || 10;
    const maxRate = tiers?.[tiers.length - 1]?.commission_rate || 20;

    return NextResponse.json({
      tiers: tiers || [],
      summary: {
        minRate,
        maxRate,
        tierCount: tiers?.length || 0,
      }
    });

  } catch (error: unknown) {
    console.error('API 错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}
