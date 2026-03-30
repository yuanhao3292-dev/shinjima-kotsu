import { SupabaseClient } from '@supabase/supabase-js';

/**
 * 佣金撤回（退款/争议共用）
 *
 * 1. 幂等检查（防止 webhook 重试导致双倍扣回）
 * 2. 更新 white_label_orders.commission_status → 'clawed_back'
 * 3. 原子递减导游累计佣金
 * 4. 撤回推荐奖励
 */
export async function clawbackCommission(
  supabase: SupabaseClient,
  orderId: string,
  guideId: string,
  commissionAmount: number
) {
  // 幂等检查：已经撤回过的不再执行
  const { data: existing } = await supabase
    .from('white_label_orders')
    .select('commission_status')
    .eq('source_order_id', orderId)
    .eq('guide_id', guideId)
    .single();

  if (existing?.commission_status === 'clawed_back') {
    console.log(`[Clawback] Already clawed back for order ${orderId}, skipping (idempotent)`);
    return;
  }

  // 1. 更新 white_label_orders 佣金状态
  const { error: wlError } = await supabase
    .from('white_label_orders')
    .update({ commission_status: 'clawed_back' })
    .eq('source_order_id', orderId)
    .eq('guide_id', guideId);

  if (wlError) {
    console.error(`[Clawback] Failed to update white_label_orders for order ${orderId}:`, wlError);
  }

  // 2. 原子递减导游累计佣金
  await supabase.rpc('increment_guide_commission', {
    p_guide_id: guideId,
    p_amount: -commissionAmount,
  });

  console.log(`[Clawback] Commission ${commissionAmount}円 clawed back from guide ${guideId} for order ${orderId}`);

  // 3. 撤回推荐奖励
  await supabase
    .from('referral_rewards')
    .update({ status: 'clawed_back' })
    .eq('booking_id', orderId);
}
