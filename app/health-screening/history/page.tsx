'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  Download,
} from 'lucide-react';
import { FREE_SCREENING_LIMIT } from '@/lib/screening-questions';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import PublicLayout from '@/components/PublicLayout';
import HealthPassport from '@/components/HealthPassport';
import type { HealthSnapshotRow } from '@/lib/health-score';
import { calculateHealthScoreWithBreakdown } from '@/lib/health-score';
import { downloadHealthPassportPDF } from '@/components/HealthPassportPDF';

interface ScreeningRecord {
  id: string;
  status: 'in_progress' | 'completed';
  createdAt: string;
  completedAt: string | null;
  hasResult: boolean;
  riskLevel: 'low' | 'medium' | 'high' | null;
}

const T: Record<string, Record<Language, string>> = {
  loadError: { ja: '読み込みに失敗しました', 'zh-CN': '载入失败', 'zh-TW': '載入失敗', en: 'Failed to load' },
  loading: { ja: '読み込み中...', 'zh-CN': '载入中...', 'zh-TW': '載入中...', en: 'Loading...' },
  backToAccount: { ja: 'マイアカウントに戻る', 'zh-CN': '返回我的账户', 'zh-TW': '返回我的帳戶', en: 'Back to My Account' },
  heroLabel: { ja: 'HEALTH PASSPORT', 'zh-CN': 'HEALTH PASSPORT', 'zh-TW': 'HEALTH PASSPORT', en: 'HEALTH PASSPORT' },
  title: { ja: 'ヘルスパスポート', 'zh-CN': '健康护照', 'zh-TW': '健康護照', en: 'Health Passport' },
  usedCount: { ja: '使用済み', 'zh-CN': '已使用', 'zh-TW': '已使用', en: 'Used' },
  freeRemaining: { ja: '残り無料回数', 'zh-CN': '免费剩余', 'zh-TW': '免費剩餘', en: 'Free Remaining' },
  times: { ja: '回', 'zh-CN': '次', 'zh-TW': '次', en: 'times' },
  newScreening: { ja: '新しいスクリーニング', 'zh-CN': '新的筛查', 'zh-TW': '新的篩查', en: 'New Screening' },
  downloadPDF: { ja: 'PDFエクスポート', 'zh-CN': '导出PDF', 'zh-TW': '匯出PDF', en: 'Export PDF' },
  generating: { ja: '生成中...', 'zh-CN': '生成中...', 'zh-TW': '生成中...', en: 'Generating...' },
};

const t = (key: string, lang: Language): string => T[key]?.[lang] ?? key;

export default function ScreeningHistoryPage() {
  const router = useRouter();
  const lang = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [snapshots, setSnapshots] = useState<HealthSnapshotRow[]>([]);
  const [freeRemaining, setFreeRemaining] = useState(FREE_SCREENING_LIMIT);
  const [totalUsed, setTotalUsed] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

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
        setSnapshots(data.snapshots || []);
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

  const handleDownloadPassportPDF = async () => {
    if (snapshots.length === 0 || isDownloading) return;
    setIsDownloading(true);
    try {
      const latest = snapshots[0];
      const breakdown = calculateHealthScoreWithBreakdown({
        riskLevel: latest.risk_level as 'low' | 'medium' | 'high',
        recommendedDepartments: latest.departments,
        recommendedTests: Array(latest.test_count).fill(''),
        safetyGateClass: latest.safety_gate as string | undefined,
        requiresHumanReview: false,
        riskSummary: latest.top_findings[0] ?? '',
        treatmentSuggestions: [],
      } as any);
      const langMap: Record<Language, 'ja' | 'zh-CN' | 'zh-TW' | 'en'> = { ja: 'ja', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en' };
      await downloadHealthPassportPDF({
        language: langMap[lang],
        healthScore: latest.health_score,
        riskLevel: latest.risk_level,
        trend: latest.trend,
        scoreDelta: latest.score_delta,
        breakdown,
        topFindings: latest.top_findings,
        departments: latest.departments,
        latestScreeningDate: latest.created_at,
        snapshots,
      });
    } catch (err) {
      console.error('Passport PDF error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout showFooter={false} transparentNav={false}>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-700 mx-auto mb-4" />
            <p className="text-neutral-500 text-sm">{t('loading', lang)}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-brand-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20" />
            <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 pt-40 pb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400" />
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">
                {t('heroLabel', lang)}
              </span>
              <div className="h-[1px] w-12 bg-gold-400" />
            </div>

            <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl text-white mb-6 leading-tight">
              {t('title', lang)}
            </h1>

            <p className="text-neutral-300 text-sm">
              {t('usedCount', lang)} {totalUsed} {t('times', lang)} · {t('freeRemaining', lang)} {freeRemaining} {t('times', lang)}
            </p>
          </div>
        </section>

        {/* Action Bar */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/my-account"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              <span>{t('backToAccount', lang)}</span>
            </Link>

            <div className="flex items-center gap-3">
              {snapshots.length > 0 && (
                <button
                  onClick={handleDownloadPassportPDF}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors text-sm"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isDownloading ? t('generating', lang) : t('downloadPDF', lang)}
                </button>
              )}
              {freeRemaining > 0 && (
                <Link
                  href="/health-screening"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400 hover:bg-gold-300 text-brand-900 font-medium text-sm tracking-wider transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('newScreening', lang)}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <HealthPassport
            screenings={screenings}
            snapshots={snapshots}
            lang={lang}
          />
        </div>
      </div>
    </PublicLayout>
  );
}
