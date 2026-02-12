'use client';

import { useState, useEffect } from 'react';

export interface CommissionTier {
  id: string;
  tier_code: string;
  tier_name_ja: string;
  tier_name_zh: string;
  tier_name_en: string;
  min_monthly_sales: number;      // 保持兼容（实际存储季度销售额）
  min_quarterly_sales?: number;   // 季度销售额阈值
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
  tierCount: 2,
};

// 两级合伙人：初期 10% / 金牌 20%
const DEFAULT_TIERS: CommissionTier[] = [
  { id: '1', tier_code: 'growth', tier_name_ja: '初期合夥人', tier_name_zh: '初期合伙人', tier_name_en: 'Growth Partner', min_monthly_sales: 0, min_quarterly_sales: 0, commission_rate: 10, badge_color: '#F97316', sort_order: 1 },
  { id: '2', tier_code: 'gold', tier_name_ja: '金牌合夥人', tier_name_zh: '金牌合伙人', tier_name_en: 'Gold Partner', min_monthly_sales: 0, min_quarterly_sales: 0, commission_rate: 20, badge_color: '#FFD700', sort_order: 2 },
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
 * 格式化季度销售额门槛
 */
export function formatSalesThreshold(amount: number, includeUnit: boolean = true): string {
  if (amount >= 10000) {
    return includeUnit ? `¥${(amount / 10000).toFixed(0)}万/季度` : `¥${(amount / 10000).toFixed(0)}万`;
  }
  return includeUnit ? `¥${amount.toLocaleString()}/季度` : `¥${amount.toLocaleString()}`;
}

/**
 * 获取当前季度信息
 */
export function getCurrentQuarterInfo(): { quarter: number; year: number; startMonth: number; endMonth: number } {
  const now = new Date();
  const month = now.getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  const startMonth = (quarter - 1) * 3 + 1;
  const endMonth = quarter * 3;
  return {
    quarter,
    year: now.getFullYear(),
    startMonth,
    endMonth,
  };
}

/**
 * 格式化季度显示
 */
export function formatQuarter(quarter: number, year: number): string {
  return `${year}年第${quarter}季度`;
}
