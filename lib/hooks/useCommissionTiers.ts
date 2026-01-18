'use client';

import { useState, useEffect } from 'react';

export interface CommissionTier {
  id: string;
  tier_code: string;
  tier_name_ja: string;
  tier_name_zh: string;
  tier_name_en: string;
  min_monthly_sales: number;
  commission_rate: number;
  badge_color: string;
  sort_order: number;
}

export interface CommissionTiersSummary {
  minRate: number;
  maxRate: number;
  tierCount: number;
}

interface UseCommissionTiersResult {
  tiers: CommissionTier[];
  summary: CommissionTiersSummary;
  loading: boolean;
  error: string | null;
}

// 默认配置（用于 API 失败时的 fallback）
const DEFAULT_SUMMARY: CommissionTiersSummary = {
  minRate: 10,
  maxRate: 20,
  tierCount: 4,
};

const DEFAULT_TIERS: CommissionTier[] = [
  { id: '1', tier_code: 'bronze', tier_name_ja: '銅牌合夥人', tier_name_zh: '铜牌合伙人', tier_name_en: 'Bronze', min_monthly_sales: 0, commission_rate: 10, badge_color: '#CD7F32', sort_order: 1 },
  { id: '2', tier_code: 'silver', tier_name_ja: '銀牌合夥人', tier_name_zh: '银牌合伙人', tier_name_en: 'Silver', min_monthly_sales: 500000, commission_rate: 12, badge_color: '#C0C0C0', sort_order: 2 },
  { id: '3', tier_code: 'gold', tier_name_ja: '金牌合夥人', tier_name_zh: '金牌合伙人', tier_name_en: 'Gold', min_monthly_sales: 1500000, commission_rate: 15, badge_color: '#FFD700', sort_order: 3 },
  { id: '4', tier_code: 'diamond', tier_name_ja: '鑽石合夥人', tier_name_zh: '钻石合伙人', tier_name_en: 'Diamond', min_monthly_sales: 5000000, commission_rate: 20, badge_color: '#B9F2FF', sort_order: 4 },
];

/**
 * 获取佣金等级配置的 Hook
 * 用于在前端页面展示动态的分成比例
 */
export function useCommissionTiers(): UseCommissionTiersResult {
  const [tiers, setTiers] = useState<CommissionTier[]>(DEFAULT_TIERS);
  const [summary, setSummary] = useState<CommissionTiersSummary>(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch('/api/commission-tiers');
        if (!response.ok) {
          throw new Error('获取佣金等级失败');
        }
        const data = await response.json();
        setTiers(data.tiers || DEFAULT_TIERS);
        setSummary(data.summary || DEFAULT_SUMMARY);
      } catch (err: any) {
        console.error('获取佣金等级失败:', err);
        setError(err.message);
        // 使用默认值
        setTiers(DEFAULT_TIERS);
        setSummary(DEFAULT_SUMMARY);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  return { tiers, summary, loading, error };
}

/**
 * 格式化佣金率显示
 */
export function formatCommissionRate(rate: number): string {
  return `${rate}%`;
}

/**
 * 格式化月销售额门槛
 */
export function formatSalesThreshold(amount: number): string {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(0)}万`;
  }
  return `¥${amount.toLocaleString()}`;
}
