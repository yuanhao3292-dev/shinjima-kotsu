'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Stethoscope,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// ============================================================
// Types
// ============================================================

interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
  commissions: number;
}

interface AnalyticsData {
  revenue: {
    totalGMV: number;
    mtdGMV: number;
    totalOrders: number;
    mtdOrders: number;
    avgOrderValue: number;
    totalCommissions: number;
    takeRate: number;
  };
  screenings: {
    total: number;
    completed: number;
    completionRate: number;
    mtdTotal: number;
    riskDistribution: { low: number; medium: number; high: number };
    avgAiLatencyMs: number;
    totalAiCostEstimate: number;
  };
  guides: {
    totalActive: number;
    goldPartners: number;
    growthPartners: number;
    pendingKYC: number;
    totalPayouts: number;
  };
  funnel: {
    screeningsCompleted: number;
    ordersFromScreening: number;
    conversionRate: number;
  };
  monthlyRevenue: MonthlyRevenue[];
  generatedAt: string;
}

// ============================================================
// Helpers
// ============================================================

function formatJPY(amount: number): string {
  if (amount >= 1_000_000) return `¥${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `¥${(amount / 1_000).toFixed(0)}K`;
  return `¥${amount.toLocaleString()}`;
}

function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

const RISK_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
};

// ============================================================
// KPI Card Component
// ============================================================

function KPICard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  iconColor = 'text-indigo-600',
  iconBg = 'bg-indigo-100',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; positive: boolean } | null;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend.positive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {trend.positive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setError('認証が必要です');
          return;
        }

        const res = await fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'データ取得に失敗しました');
        }

        setData(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pie chart data
  const riskPieData = useMemo(() => {
    if (!data) return [];
    const { low, medium, high } = data.screenings.riskDistribution;
    return [
      { name: 'Low', value: low, color: RISK_COLORS.low },
      { name: 'Medium', value: medium, color: RISK_COLORS.medium },
      { name: 'High', value: high, color: RISK_COLORS.high },
    ].filter((d) => d.value > 0);
  }, [data]);

  // Monthly chart data (display month as 'M月')
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.monthlyRevenue.map((m) => ({
      ...m,
      label: `${parseInt(m.month.split('-')[1])}月`,
      revenueK: Math.round(m.revenue / 1000),
      commissionsK: Math.round(m.commissions / 1000),
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-3" />
          <p className="text-gray-500">データ読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => fetchData()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            CEO Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            最終更新: {new Date(data.generatedAt).toLocaleString('ja-JP')}
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          更新
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Revenue KPIs */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Revenue
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={DollarSign}
            title="累計 GMV"
            value={formatJPY(data.revenue.totalGMV)}
            subtitle={`今月: ${formatJPY(data.revenue.mtdGMV)}`}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <KPICard
            icon={TrendingUp}
            title="受注件数"
            value={`${data.revenue.totalOrders}`}
            subtitle={`今月: ${data.revenue.mtdOrders}件`}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <KPICard
            icon={DollarSign}
            title="平均単価 (AOV)"
            value={formatJPY(data.revenue.avgOrderValue)}
            iconColor="text-violet-600"
            iconBg="bg-violet-100"
          />
          <KPICard
            icon={ShieldCheck}
            title="テイクレート"
            value={`${data.revenue.takeRate}%`}
            subtitle={`手数料: ${formatJPY(data.revenue.totalCommissions)}`}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
        </div>
      </section>

      {/* Screening & AI KPIs */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Health Screening & AI
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={Stethoscope}
            title="累計スクリーニング"
            value={`${data.screenings.total}`}
            subtitle={`今月: ${data.screenings.mtdTotal}件 · 完了率 ${data.screenings.completionRate}%`}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <KPICard
            icon={Activity}
            title="スクリーニング → 受注"
            value={`${data.funnel.conversionRate}%`}
            subtitle={`${data.funnel.screeningsCompleted} → ${data.funnel.ordersFromScreening}`}
            iconColor="text-rose-600"
            iconBg="bg-rose-100"
          />
          <KPICard
            icon={Bot}
            title="AI 平均レイテンシ"
            value={`${(data.screenings.avgAiLatencyMs / 1000).toFixed(1)}s`}
            subtitle={`累計コスト: ${formatUSD(data.screenings.totalAiCostEstimate)}`}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-100"
          />
          <KPICard
            icon={Users}
            title="アクティブガイド"
            value={`${data.guides.totalActive}`}
            subtitle={`Gold: ${data.guides.goldPartners} · Growth: ${data.guides.growthPartners} · 審査中: ${data.guides.pendingKYC}`}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-100"
          />
        </div>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            月次売上推移（千円）
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `¥${value}K`,
                    name === 'revenueK' ? '売上' : '手数料',
                  ]}
                />
                <Bar
                  dataKey="revenueK"
                  name="売上"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="commissionsK"
                  name="手数料"
                  fill="#a5b4fc"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            リスク分布
          </h3>
          {riskPieData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-xs text-gray-600">{value}</span>
                    )}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
              データなし
            </div>
          )}
        </div>
      </div>

      {/* Order Trend Line Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          月次受注件数推移
        </h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value}件`, '受注']}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 4, fill: '#6366f1' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Guide Payout Summary */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Partner Payouts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">累計支払い</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {formatJPY(data.guides.totalPayouts)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Gold パートナー</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {data.guides.goldPartners}名
            </p>
            <p className="text-xs text-gray-400 mt-1">手数料率 20%</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Growth パートナー</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {data.guides.growthPartners}名
            </p>
            <p className="text-xs text-gray-400 mt-1">手数料率 10%</p>
          </div>
        </div>
      </section>
    </div>
  );
}
