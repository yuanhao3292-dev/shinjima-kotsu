'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

interface ScreeningRecord {
  id: string;
  status: 'in_progress' | 'completed';
  createdAt: string;
  completedAt: string | null;
  hasResult: boolean;
  riskLevel: 'low' | 'medium' | 'high' | null;
}

export default function ScreeningHistoryPage() {
  const router = useRouter();
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
          throw new Error(errorData.error || '載入失敗');
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
  }, [router]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 风险等级配置
  const riskConfig = {
    low: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: CheckCircle,
      label: '低風險',
    },
    medium: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: AlertCircle,
      label: '中等風險',
    },
    high: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      icon: AlertTriangle,
      label: '高風險',
    },
  };

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">載入歷史記錄...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/my-account"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">返回我的帳戶</span>
          </Link>
        </div>
      </div>

      {/* Title */}
      <div className="bg-gradient-to-b from-white to-[#faf9f7] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
                筛查歷史記錄
              </h1>
              <p className="text-gray-500 mt-1">
                已使用 {totalUsed} 次 · 免費剩餘 {freeRemaining} 次
              </p>
            </div>

            {freeRemaining > 0 && (
              <Link
                href="/health-screening"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                新的筛查
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              還沒有筛查記錄
            </h3>
            <p className="text-gray-500 mb-6">
              開始您的第一次 AI 健康筛查，了解您的健康狀況
            </p>
            <Link
              href="/health-screening"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              開始免費筛查
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
                          <Clock className="w-6 h-6 text-gray-500" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {isCompleted ? '健康筛查報告' : '未完成的筛查'}
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
                              進行中
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {isCompleted && screening.completedAt
                            ? `完成於 ${formatDate(screening.completedAt)}`
                            : `開始於 ${formatDate(screening.createdAt)}`}
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
