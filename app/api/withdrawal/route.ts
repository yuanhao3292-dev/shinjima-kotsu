import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 最低提现金额
const MIN_WITHDRAWAL_AMOUNT = 5000; // 5,000 日元

/**
 * 提现申请 API
 *
 * GET /api/withdrawal - 获取提现历史
 * POST /api/withdrawal - 创建提现申请
 */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 验证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: '认证失败' }, { status: 401 });
    }

    // 获取导游信息
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, available_balance, total_commission, total_withdrawn, bank_name, bank_branch, bank_account_type, bank_account_number, bank_account_holder')
      .eq('auth_user_id', user.id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: '导游不存在' }, { status: 404 });
    }

    // 获取提现历史
    const { data: withdrawals, error: withdrawalError } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('guide_id', guide.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (withdrawalError) {
      console.error('获取提现历史失败:', withdrawalError);
      return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }

    // 计算统计
    const pendingAmount = withdrawals
      ?.filter(w => ['pending', 'approved', 'processing'].includes(w.status))
      .reduce((sum, w) => sum + Number(w.amount), 0) || 0;

    return NextResponse.json({
      balance: {
        available: guide.available_balance || 0,
        totalEarned: guide.total_commission || 0,
        totalWithdrawn: guide.total_withdrawn || 0,
        pending: pendingAmount,
      },
      bankInfo: {
        bankName: guide.bank_name,
        bankBranch: guide.bank_branch,
        accountType: guide.bank_account_type,
        accountNumber: guide.bank_account_number,
        accountHolder: guide.bank_account_holder,
      },
      withdrawals: withdrawals || [],
      minAmount: MIN_WITHDRAWAL_AMOUNT,
    });
  } catch (error: any) {
    console.error('提现 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 验证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: '认证失败' }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    // 验证金额
    if (!amount || typeof amount !== 'number' || amount < MIN_WITHDRAWAL_AMOUNT) {
      return NextResponse.json({
        error: `提现金额必须至少 ¥${MIN_WITHDRAWAL_AMOUNT.toLocaleString()}`
      }, { status: 400 });
    }

    // 获取导游信息
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, available_balance, kyc_status, bank_name, bank_branch, bank_account_type, bank_account_number, bank_account_holder')
      .eq('auth_user_id', user.id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: '导游不存在' }, { status: 404 });
    }

    // 检查 KYC 状态
    if (guide.kyc_status !== 'approved') {
      return NextResponse.json({
        error: '请先完成身份验证（KYC）才能提现'
      }, { status: 400 });
    }

    // 检查银行信息是否完整
    if (!guide.bank_name || !guide.bank_account_number || !guide.bank_account_holder) {
      return NextResponse.json({
        error: '请先完善银行账户信息'
      }, { status: 400 });
    }

    // 检查余额
    if ((guide.available_balance || 0) < amount) {
      return NextResponse.json({
        error: '可提现余额不足'
      }, { status: 400 });
    }

    // 检查是否有待处理的提现申请
    const { data: pendingRequests } = await supabase
      .from('withdrawal_requests')
      .select('id')
      .eq('guide_id', guide.id)
      .in('status', ['pending', 'approved', 'processing'])
      .limit(1);

    if (pendingRequests && pendingRequests.length > 0) {
      return NextResponse.json({
        error: '您有待处理的提现申请，请等待处理完成后再申请'
      }, { status: 400 });
    }

    // 创建提现申请
    const { data: withdrawal, error: insertError } = await supabase
      .from('withdrawal_requests')
      .insert({
        guide_id: guide.id,
        amount: amount,
        bank_name: guide.bank_name,
        bank_branch: guide.bank_branch,
        account_type: guide.bank_account_type,
        account_number: guide.bank_account_number,
        account_holder: guide.bank_account_holder,
      })
      .select()
      .single();

    if (insertError) {
      console.error('创建提现申请失败:', insertError);
      if (insertError.message?.includes('余额不足')) {
        return NextResponse.json({ error: '可提现余额不足' }, { status: 400 });
      }
      return NextResponse.json({ error: '创建失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '提现申请已提交，我们将在 1-3 个工作日内处理',
      withdrawal,
    });
  } catch (error: any) {
    console.error('提现 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * DELETE /api/withdrawal?id=xxx - 取消提现申请
 */
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const { searchParams } = new URL(request.url);
  const withdrawalId = searchParams.get('id');

  if (!withdrawalId) {
    return NextResponse.json({ error: '缺少提现 ID' }, { status: 400 });
  }

  try {
    // 验证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: '认证失败' }, { status: 401 });
    }

    // 获取导游 ID
    const { data: guide } = await supabase
      .from('guides')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!guide) {
      return NextResponse.json({ error: '导游不存在' }, { status: 404 });
    }

    // 检查提现申请是否存在且属于该导游
    const { data: withdrawal } = await supabase
      .from('withdrawal_requests')
      .select('id, status, guide_id')
      .eq('id', withdrawalId)
      .single();

    if (!withdrawal) {
      return NextResponse.json({ error: '提现申请不存在' }, { status: 404 });
    }

    if (withdrawal.guide_id !== guide.id) {
      return NextResponse.json({ error: '无权操作' }, { status: 403 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: '只能取消待审核的申请' }, { status: 400 });
    }

    // 取消申请（触发器会自动退还余额）
    const { error: updateError } = await supabase
      .from('withdrawal_requests')
      .update({ status: 'cancelled' })
      .eq('id', withdrawalId);

    if (updateError) {
      console.error('取消提现失败:', updateError);
      return NextResponse.json({ error: '取消失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '提现申请已取消',
    });
  } catch (error: any) {
    console.error('取消提现错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
