import { SupabaseClient } from '@supabase/supabase-js';

/**
 * 佣金撤回（退款/争议共用）。
 *
 * 优先走原子 RPC clawback_commission（迁移 111）：锁行 + 幂等 +
 * 递减累计佣金 + **回冲已释放进 available_balance 的净额** + 撤回推荐奖励。
 * 若 RPC 不可用（迁移未应用),回退到旧逻辑(至少递减累计佣金,余额回冲需迁移后生效)。
 *
 * @param commissionAmount 仅用于回退路径与日志;RPC 路径以订单行金额为准。
 */
export async function clawbackCommission(
  supabase: SupabaseClient,
  orderId: string,
  guideId: string,
  commissionAmount: number
) {
  // 首选:原子 RPC（含可提现余额回冲）
  const { data, error } = await supabase.rpc('clawback_commission', {
    p_order_id: orderId,
    p_guide_id: guideId,
  });

  if (!error) {
    console.log(`[Clawback] order ${orderId} (guide ${guideId}, ~${commissionAmount}円):`, JSON.stringify(data));
    return;
  }

  // 回退:RPC 缺失/失败时,保留旧行为(不因迁移未应用而完全不 clawback)
  console.warn(`[Clawback] RPC clawback_commission 不可用,回退旧逻辑 (order ${orderId}):`, error.message);

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

  const { error: wlError } = await supabase
    .from('white_label_orders')
    .update({ commission_status: 'clawed_back' })
    .eq('source_order_id', orderId)
    .eq('guide_id', guideId);

  if (wlError) {
    console.error(`[Clawback] Failed to update white_label_orders for order ${orderId}:`, wlError);
  }

  await supabase.rpc('increment_guide_commission', {
    p_guide_id: guideId,
    p_amount: -commissionAmount,
  });

  await supabase
    .from('referral_rewards')
    .update({ status: 'clawed_back' })
    .eq('booking_id', orderId);

  console.log(`[Clawback] (fallback) ${commissionAmount}円 clawed back from guide ${guideId} for order ${orderId}`);
}
