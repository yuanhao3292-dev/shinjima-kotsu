'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { FREE_SCREENING_LIMIT } from '@/lib/screening-questions';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import HealthPassport from '@/components/HealthPassport';
import type { HealthSnapshotRow } from '@/lib/health-score';

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
  title: { ja: 'ヘルスパスポート', 'zh-CN': '健康护照', 'zh-TW': '健康護照', en: 'Health Passport' },
  usedCount: { ja: '使用済み', 'zh-CN': '已使用', 'zh-TW': '已使用', en: 'Used' },
  freeRemaining: { ja: '残り無料回数', 'zh-CN': '免费剩余', 'zh-TW': '免費剩餘', en: 'Free Remaining' },
  times: { ja: '回', 'zh-CN': '次', 'zh-TW': '次', en: 'times' },
  newScreening: { ja: '新しいスクリーニング', 'zh-CN': '新的筛查', 'zh-TW': '新的篩查', en: 'New Screening' },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-neutral-500">{t('loading', lang)}</p>
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
                {t('title', lang)}
              </h1>
              <p className="text-neutral-500 mt-1">
                {t('usedCount', lang)} {totalUsed} {t('times', lang)} · {t('freeRemaining', lang)} {freeRemaining} {t('times', lang)}
              </p>
            </div>

            {freeRemaining > 0 && (
              <Link
                href="/health-screening"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
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
  );
}
