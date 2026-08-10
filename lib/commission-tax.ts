/**
 * 佣金源泉徴収(预扣税)计算 —— 在线(Stripe webhook)与线下手动单共用,保证口径一致。
 *
 * 居住者: 100万円以下 → 10.21%, 100万円超 → 20.42%(加重平均)
 * 非居住者: 一律 20.42%
 */
export function calculateWithholdingTax(
  commission: number,
  isResident: boolean,
): { withholdingAmount: number; withholdingRate: number } {
  if (commission <= 0) {
    return { withholdingAmount: 0, withholdingRate: 0 };
  }

  if (!isResident) {
    // 非居住者: 一律 20.42%
    const amount = Math.round(commission * 0.2042);
    return { withholdingAmount: amount, withholdingRate: 0.2042 };
  }

  // 居住者: 100万円以下 → 10.21%, 100万円超過分 → 20.42%
  const threshold = 1_000_000;
  if (commission <= threshold) {
    const amount = Math.round(commission * 0.1021);
    return { withholdingAmount: amount, withholdingRate: 0.1021 };
  } else {
    const amount = Math.round(threshold * 0.1021 + (commission - threshold) * 0.2042);
    // 加重平均レートを記録
    const effectiveRate = amount / commission;
    return { withholdingAmount: amount, withholdingRate: Math.round(effectiveRate * 10000) / 10000 };
  }
}
