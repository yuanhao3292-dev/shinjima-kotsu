'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Shield,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Language } from '@/hooks/useLanguage';
import type { HealthSnapshotRow } from '@/lib/health-score';
import ScoreRing from './ScoreRing';

// ============================================================
// i18n
// ============================================================

const T: Record<string, Record<Language, string>> = {
  passportTitle: {
    'zh-CN': '健康护照',
    'zh-TW': '健康護照',
    ja: 'ヘルスパスポート',
    en: 'Health Passport',
  },
  healthScore: {
    'zh-CN': '健康评分',
    'zh-TW': '健康評分',
    ja: '健康スコア',
    en: 'Health Score',
  },
  lastScreening: {
    'zh-CN': '上次筛查',
    'zh-TW': '上次篩查',
    ja: '前回チェック',
    en: 'Last Screening',
  },
  daysAgo: {
    'zh-CN': '天前',
    'zh-TW': '天前',
    ja: '日前',
    en: ' days ago',
  },
  today: {
    'zh-CN': '今天',
    'zh-TW': '今天',
    ja: '今日',
    en: 'Today',
  },
  improving: {
    'zh-CN': '改善中',
    'zh-TW': '改善中',
    ja: '改善中',
    en: 'Improving',
  },
  stable: {
    'zh-CN': '稳定',
    'zh-TW': '穩定',
    ja: '安定',
    en: 'Stable',
  },
  worsening: {
    'zh-CN': '需注意',
    'zh-TW': '需注意',
    ja: '要注意',
    en: 'Needs Attention',
  },
  trendTitle: {
    'zh-CN': '健康趋势',
    'zh-TW': '健康趨勢',
    ja: '健康トレンド',
    en: 'Health Trend',
  },
  historyTitle: {
    'zh-CN': '筛查记录',
    'zh-TW': '篩查記錄',
    ja: 'チェック履歴',
    en: 'Screening History',
  },
  riskLow: {
    'zh-CN': '低风险',
    'zh-TW': '低風險',
    ja: '低リスク',
    en: 'Low Risk',
  },
  riskMedium: {
    'zh-CN': '中等风险',
    'zh-TW': '中等風險',
    ja: '中等リスク',
    en: 'Medium Risk',
  },
  riskHigh: {
    'zh-CN': '高风险',
    'zh-TW': '高風險',
    ja: '高リスク',
    en: 'High Risk',
  },
  viewReport: {
    'zh-CN': '查看报告',
    'zh-TW': '查看報告',
    ja: 'レポートを見る',
    en: 'View Report',
  },
  noData: {
    'zh-CN': '完成您的第一次健康筛查以启动健康护照',
    'zh-TW': '完成您的第一次健康篩查以啟動健康護照',
    ja: '初回のヘルスチェックを受けてヘルスパスポートを開始しましょう',
    en: 'Complete your first screening to activate your Health Passport',
  },
  scorePoints: {
    'zh-CN': '分',
    'zh-TW': '分',
    ja: '点',
    en: 'pts',
  },
  inProgress: {
    'zh-CN': '进行中',
    'zh-TW': '進行中',
    ja: '進行中',
    en: 'In Progress',
  },
  completedAt: {
    'zh-CN': '完成于',
    'zh-TW': '完成於',
    ja: '完了日時',
    en: 'Completed',
  },
  report: {
    'zh-CN': '健康筛查报告',
    'zh-TW': '健康篩查報告',
    ja: 'ヘルスチェックレポート',
    en: 'Health Screening Report',
  },
  incomplete: {
    'zh-CN': '未完成的筛查',
    'zh-TW': '未完成的篩查',
    ja: '未完了のヘルスチェック',
    en: 'Incomplete Screening',
  },
  startedAt: {
    'zh-CN': '开始于',
    'zh-TW': '開始於',
    ja: '開始日時',
    en: 'Started',
  },
};

const t = (key: string, lang: Language): string => T[key]?.[lang] ?? key;

// ============================================================
// Types
// ============================================================

interface ScreeningRecord {
  id: string;
  status: 'in_progress' | 'completed';
  createdAt: string;
  completedAt: string | null;
  hasResult: boolean;
  riskLevel: 'low' | 'medium' | 'high' | null;
}

interface Props {
  screenings: ScreeningRecord[];
  snapshots: HealthSnapshotRow[];
  lang: Language;
}

// ============================================================
// Trend Badge
// ============================================================

function TrendBadge({
  trend,
  scoreDelta,
  lang,
}: {
  trend: string;
  scoreDelta: number | null;
  lang: Language;
}) {
  const config = {
    improving: {
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    stable: {
      icon: Minus,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    worsening: {
      icon: TrendingDown,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  };

  const c = config[trend as keyof typeof config] ?? config.stable;
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.color}`}
    >
      <Icon className="w-4 h-4" />
      {scoreDelta !== null && scoreDelta !== 0 && (
        <span>
          {scoreDelta > 0 ? '+' : ''}
          {scoreDelta}
        </span>
      )}
      {t(trend, lang)}
    </span>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function HealthPassport({ screenings, snapshots, lang }: Props) {
  const latestSnapshot = snapshots[0] ?? null;
  const hasData = snapshots.length > 0;

  // Chart data (oldest → newest for line chart)
  const chartData = useMemo(() => {
    return [...snapshots]
      .reverse()
      .map((s) => {
        const d = new Date(s.created_at);
        const label =
          lang === 'ja'
            ? `${d.getMonth() + 1}/${d.getDate()}`
            : `${d.getMonth() + 1}/${d.getDate()}`;
        return {
          date: label,
          score: s.health_score,
          risk: s.risk_level,
        };
      });
  }, [snapshots, lang]);

  // Group screenings by year
  const groupedByYear = useMemo(() => {
    const groups: Record<number, ScreeningRecord[]> = {};
    for (const s of screenings) {
      const year = new Date(s.createdAt).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(s);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a));
  }, [screenings]);

  // Find snapshot for a screening
  const snapshotMap = useMemo(() => {
    const map = new Map<string, HealthSnapshotRow>();
    for (const s of snapshots) {
      map.set(s.screening_id, s);
    }
    return map;
  }, [snapshots]);

  // Days since last screening
  const daysSinceLastScreening = useMemo(() => {
    if (!latestSnapshot) return null;
    const diff = Date.now() - new Date(latestSnapshot.created_at).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [latestSnapshot]);

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {t('passportTitle', lang)}
        </h3>
        <p className="text-neutral-500 text-sm">{t('noData', lang)}</p>
      </div>
    );
  }

  const scoreColor =
    latestSnapshot.health_score >= 80
      ? 'text-emerald-600'
      : latestSnapshot.health_score >= 60
        ? 'text-amber-500'
        : 'text-red-500';

  const riskLabels: Record<string, string> = {
    low: t('riskLow', lang),
    medium: t('riskMedium', lang),
    high: t('riskHigh', lang),
  };

  const riskConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle }> = {
    low: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle },
    high: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
  };

  return (
    <div className="space-y-6">
      {/* ─── Section A: Score Overview ─── */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 tracking-wide">
            {t('passportTitle', lang)}
          </h3>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Ring */}
          <div className="relative flex-shrink-0">
            <ScoreRing score={latestSnapshot.health_score} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>
                {latestSnapshot.health_score}
              </span>
              <span className="text-xs text-neutral-400 mt-0.5">
                {t('healthScore', lang)}
              </span>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            {/* Trend badge */}
            <TrendBadge
              trend={latestSnapshot.trend}
              scoreDelta={latestSnapshot.score_delta}
              lang={lang}
            />

            {/* Last screening */}
            <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-neutral-500">
              <Calendar className="w-4 h-4" />
              <span>
                {t('lastScreening', lang)}:{' '}
                {daysSinceLastScreening === 0
                  ? t('today', lang)
                  : `${daysSinceLastScreening}${t('daysAgo', lang)}`}
              </span>
            </div>

            {/* Risk level */}
            <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-neutral-500">
              <Activity className="w-4 h-4" />
              <span>{riskLabels[latestSnapshot.risk_level] ?? latestSnapshot.risk_level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section B: Trend Chart ─── */}
      {chartData.length >= 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h4 className="text-lg font-semibold text-neutral-900 mb-4">
            {t('trendTitle', lang)}
          </h4>
          <div className="h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [
                    `${value} ${t('scorePoints', lang)}`,
                    t('healthScore', lang),
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ─── Section C: History Cards (grouped by year) ─── */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h4 className="text-lg font-semibold text-neutral-900 mb-4">
          {t('historyTitle', lang)}
        </h4>

        {groupedByYear.map(([year, records]) => (
          <div key={year} className="mb-6 last:mb-0">
            <div className="text-sm font-medium text-neutral-400 mb-3">
              {year}
            </div>
            <div className="space-y-3">
              {records.map((screening) => {
                const snap = snapshotMap.get(screening.id);
                const isCompleted = screening.status === 'completed';
                const risk = screening.riskLevel
                  ? riskConfig[screening.riskLevel]
                  : null;
                const RiskIcon = risk?.icon;

                return (
                  <Link
                    key={screening.id}
                    href={
                      isCompleted
                        ? `/health-screening/result/${screening.id}`
                        : '/health-screening'
                    }
                    className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-emerald-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon */}
                      {isCompleted && risk && RiskIcon ? (
                        <div className={`p-2 rounded-lg flex-shrink-0 ${risk.bg}`}>
                          <RiskIcon className={`w-5 h-5 ${risk.color}`} />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg flex-shrink-0 bg-gray-100">
                          <Clock className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-neutral-900 text-sm">
                            {isCompleted ? t('report', lang) : t('incomplete', lang)}
                          </span>
                          {isCompleted && screening.riskLevel && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${risk?.bg} ${risk?.color}`}
                            >
                              {riskLabels[screening.riskLevel]}
                            </span>
                          )}
                          {!isCompleted && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">
                              {t('inProgress', lang)}
                            </span>
                          )}
                          {/* Score + trend badge */}
                          {snap && (
                            <>
                              <span className="text-xs font-semibold text-emerald-600">
                                {snap.health_score}{t('scorePoints', lang)}
                              </span>
                              {snap.trend !== 'stable' && (
                                <TrendBadge
                                  trend={snap.trend}
                                  scoreDelta={snap.score_delta}
                                  lang={lang}
                                />
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5 truncate">
                          {isCompleted && screening.completedAt
                            ? `${t('completedAt', lang)} ${formatDate(screening.completedAt, lang)}`
                            : `${t('startedAt', lang)} ${formatDate(screening.createdAt, lang)}`}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Date formatter
// ============================================================

function formatDate(dateStr: string, lang: Language): string {
  const d = new Date(dateStr);
  const localeMap: Record<Language, string> = {
    ja: 'ja-JP',
    'zh-TW': 'zh-TW',
    'zh-CN': 'zh-CN',
    en: 'en-US',
  };
  return d.toLocaleDateString(localeMap[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
