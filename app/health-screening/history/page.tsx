'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDateTimeLong } from '@/lib/utils/format-date';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { FREE_SCREENING_LIMIT } from '@/lib/screening-questions';
import { useLanguage, type Language } from '@/hooks/useLanguage';

interface ScreeningRecord {
  id: string;
  status: 'in_progress' | 'completed';
  createdAt: string;
  completedAt: string | null;
  hasResult: boolean;
  riskLevel: 'low' | 'medium' | 'high' | null;
}

const translations = {
  loadError: { ja: '読み込みに失敗しました', 'zh-CN': '载入失败', 'zh-TW': '載入失敗', en: 'Failed to load' },
  loadingHistory: { ja: '履歴を読み込み中...', 'zh-CN': '载入历史记录...', 'zh-TW': '載入歷史記錄...', en: 'Loading history...' },
  backToAccount: { ja: 'マイアカウントに戻る', 'zh-CN': '返回我的账户', 'zh-TW': '返回我的帳戶', en: 'Back to My Account' },
  historyTitle: { ja: 'スクリーニング履歴', 'zh-CN': '筛查历史记录', 'zh-TW': '篩查歷史記錄', en: 'Screening History' },
  usedCount: { ja: '使用済み', 'zh-CN': '已使用', 'zh-TW': '已使用', en: 'Used' },
  freeRemaining: { ja: '残り無料回数', 'zh-CN': '免费剩余', 'zh-TW': '免費剩餘', en: 'Free Remaining' },
  times: { ja: '回', 'zh-CN': '次', 'zh-TW': '次', en: 'times' },
  newScreening: { ja: '新しいスクリーニング', 'zh-CN': '新的筛查', 'zh-TW': '新的篩查', en: 'New Screening' },
  noRecordsTitle: { ja: 'スクリーニング記録がありません', 'zh-CN': '还没有筛查记录', 'zh-TW': '還沒有篩查記錄', en: 'No screening records yet' },
  noRecordsDesc: { ja: '初めての AI 健康スクリーニングを開始し、健康状態を把握しましょう', 'zh-CN': '开始您的第一次 AI 健康筛查，了解您的健康状况', 'zh-TW': '開始您的第一次 AI 健康篩查，了解您的健康狀況', en: 'Start your first AI health screening to understand your health status' },
  startFreeScreening: { ja: '無料スクリーニングを開始', 'zh-CN': '开始免费筛查', 'zh-TW': '開始免費篩查', en: 'Start Free Screening' },
  riskLow: { ja: '低リスク', 'zh-CN': '低风险', 'zh-TW': '低風險', en: 'Low Risk' },
  riskMedium: { ja: '中等リスク', 'zh-CN': '中等风险', 'zh-TW': '中等風險', en: 'Medium Risk' },
  riskHigh: { ja: '高リスク', 'zh-CN': '高风险', 'zh-TW': '高風險', en: 'High Risk' },
  reportCompleted: { ja: '健康スクリーニングレポート', 'zh-CN': '健康筛查报告', 'zh-TW': '健康篩查報告', en: 'Health Screening Report' },
  incompleteScreening: { ja: '未完了のスクリーニング', 'zh-CN': '未完成的筛查', 'zh-TW': '未完成的篩查', en: 'Incomplete Screening' },
  inProgress: { ja: '進行中', 'zh-CN': '进行中', 'zh-TW': '進行中', en: 'In Progress' },
  completedAt: { ja: '完了日時', 'zh-CN': '完成于', 'zh-TW': '完成於', en: 'Completed at' },
  startedAt: { ja: '開始日時', 'zh-CN': '开始于', 'zh-TW': '開始於', en: 'Started at' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

export default function ScreeningHistoryPage() {
  const router = useRouter();
  const lang = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [freeRemaining, setFreeRemaining] = useState(FREE_SCREENING_LIMIT);
  const [totalUsed, setTotalUsed] = useState(0);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/health-screening');

        if (response.status === 401) {
          router.push('/auth/login?redirect=/health-screening/history');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || t('loadError', lang));
        }

        const data = await response.json();
        setScreenings(data.screenings || []);
        setFreeRemaining(data.freeRemaining ?? FREE_SCREENING_LIMIT);
        setTotalUsed(data.totalUsed ?? 0);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [router, lang]);

  const riskConfig = {
    low: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: CheckCircle,
      label: t('riskLow', lang),
    },
    medium: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: AlertCircle,
      label: t('riskMedium', lang),
    },
    high: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      icon: AlertTriangle,
      label: t('riskHigh', lang),
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-neutral-500">{t('loadingHistory', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/my-account"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t('backToAccount', lang)}</span>
          </Link>
        </div>
      </div>

      {/* Title */}
      <div className="bg-gradient-to-b from-white to-[#faf9f7] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 tracking-wide">
                {t('historyTitle', lang)}
              </h1>
              <p className="text-neutral-500 mt-1">
                {t('usedCount', lang)} {totalUsed} {t('times', lang)} · {t('freeRemaining', lang)} {freeRemaining} {t('times', lang)}
              </p>
            </div>

            {freeRemaining > 0 && (
              <Link
                href="/health-screening"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('newScreening', lang)}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {screenings.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {t('noRecordsTitle', lang)}
            </h3>
            <p className="text-neutral-500 mb-6">
              {t('noRecordsDesc', lang)}
            </p>
            <Link
              href="/health-screening"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t('startFreeScreening', lang)}
            </Link>
          </div>
        )}

        {/* Records List */}
        {screenings.length > 0 && (
          <div className="space-y-4">
            {screenings.map((screening) => {
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
                  className="block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Status Icon */}
                      {isCompleted && risk && RiskIcon ? (
                        <div className={`p-2 rounded-lg ${risk.bg}`}>
                          <RiskIcon className={`w-6 h-6 ${risk.color}`} />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Clock className="w-6 h-6 text-neutral-500" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-neutral-900">
                            {isCompleted ? t('reportCompleted', lang) : t('incompleteScreening', lang)}
                          </h3>
                          {isCompleted && risk && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${risk.bg} ${risk.color}`}
                            >
                              {risk.label}
                            </span>
                          )}
                          {!isCompleted && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">
                              {t('inProgress', lang)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">
                          {isCompleted && screening.completedAt
                            ? `${t('completedAt', lang)} ${formatDateTimeLong(screening.completedAt)}`
                            : `${t('startedAt', lang)} ${formatDateTimeLong(screening.createdAt)}`}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
