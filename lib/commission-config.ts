/**
 * 佣金结算参数
 * ============================================
 * 唯一来源。此前 14 天写死在 3 处（Stripe webhook 两处 + 后台确认订单一处），
 * 改周期要三处同改。
 */

/**
 * 佣金持有期（天）：从服务完成日（无服务日期则从付款日）起算，
 * 期满后由 cron /api/cron/release-commissions（每日 03:00）或导游提现时
 * 调用 release_matured_*_commissions() 转为 available。
 *
 * 目的是给退款窗口留出时间 —— 期内退款走 clawback，钱还没到导游手里；
 * 期后退款只能从 available_balance 反扣（迁移 111）。
 */
export const COMMISSION_HOLD_DAYS = 14;

/** 在给定日期上加持有期，返回 ISO 字符串（供写入 commission_available_at） */
export function commissionAvailableAt(from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + COMMISSION_HOLD_DAYS);
  return d.toISOString();
}
