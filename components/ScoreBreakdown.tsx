'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Language } from '@/hooks/useLanguage';
import type { ScoreBreakdownResult, ScoreBreakdownItem } from '@/lib/health-score';

// ============================================================
// i18n
// ============================================================

const T: Record<string, Record<Language, string>> = {
  title: {
    'zh-CN': '评分详情',
    'zh-TW': '評分詳情',
    ja: 'スコア内訳',
    en: 'Score Breakdown',
  },
  baseScore: {
    'zh-CN': '基础分',
    'zh-TW': '基礎分',
    ja: '基礎スコア',
    en: 'Base Score',
  },
  finalScore: {
    'zh-CN': '最终评分',
    'zh-TW': '最終評分',
    ja: '最終スコア',
    en: 'Final Score',
  },
  risk_level: {
    'zh-CN': '风险等级',
    'zh-TW': '風險等級',
    ja: 'リスクレベル',
    en: 'Risk Level',
  },
  department: {
    'zh-CN': '推荐科室',
    'zh-TW': '推薦科室',
    ja: '推奨診療科',
    en: 'Department',
  },
  test: {
    'zh-CN': '检查项目',
    'zh-TW': '檢查項目',
    ja: '検査項目',
    en: 'Tests',
  },
  safety_gate: {
    'zh-CN': '安全闸门',
    'zh-TW': '安全閘門',
    ja: '安全ゲート',
    en: 'Safety Gate',
  },
  human_review: {
    'zh-CN': '人工审核',
    'zh-TW': '人工審核',
    ja: '専門家レビュー',
    en: 'Expert Review',
  },
  cancer_keyword: {
    'zh-CN': '癌症风险',
    'zh-TW': '癌症風險',
    ja: 'がんリスク',
    en: 'Cancer Risk',
  },
  showDetails: {
    'zh-CN': '查看评分详情',
    'zh-TW': '查看評分詳情',
    ja: 'スコア内訳を表示',
    en: 'Show Score Details',
  },
  hideDetails: {
    'zh-CN': '收起评分详情',
    'zh-TW': '收起評分詳情',
    ja: 'スコア内訳を隠す',
    en: 'Hide Score Details',
  },
};

const t = (key: string, lang: Language): string => T[key]?.[lang] ?? key;

// ============================================================
// Deduction color
// ============================================================

function deductionColor(deduction: number): string {
  if (deduction >= 20) return 'text-red-600';
  if (deduction >= 8) return 'text-orange-500';
  return 'text-amber-500';
}

function deductionBg(deduction: number): string {
  if (deduction >= 20) return 'bg-red-50';
  if (deduction >= 8) return 'bg-orange-50';
  return 'bg-amber-50';
}

// ============================================================
// Component
// ============================================================

interface Props {
  breakdown: ScoreBreakdownResult;
  lang: Language;
  defaultOpen?: boolean;
}

export default function ScoreBreakdown({ breakdown, lang, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const scoreColor =
    breakdown.finalScore >= 80
      ? 'text-emerald-600'
      : breakdown.finalScore >= 60
        ? 'text-amber-500'
        : 'text-red-500';

  return (
    <div className="w-full">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
      >
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        {open ? t('hideDetails', lang) : t('showDetails', lang)}
      </button>

      {/* Collapsible panel */}
      {open && (
        <div className="mt-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-2">
          {/* Base score */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">{t('baseScore', lang)}</span>
            <span className="font-semibold text-neutral-900">100</span>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 my-1" />

          {/* Deduction items */}
          {breakdown.items.map((item: ScoreBreakdownItem, idx: number) => (
            <div
              key={`${item.category}-${idx}`}
              className={`flex items-center justify-between text-sm rounded-lg px-3 py-1.5 ${deductionBg(item.deduction)}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-neutral-500 text-xs flex-shrink-0">
                  {t(item.category, lang)}
                </span>
                <span className="text-neutral-700 truncate">{item.label}</span>
              </div>
              <span className={`font-mono font-semibold flex-shrink-0 ${deductionColor(item.deduction)}`}>
                -{item.deduction}
              </span>
            </div>
          ))}

          {/* No deductions */}
          {breakdown.items.length === 0 && (
            <div className="text-sm text-emerald-600 text-center py-2">
              {lang === 'ja' ? '減点なし — 満点です！' :
               lang === 'en' ? 'No deductions — perfect score!' :
               lang === 'zh-TW' ? '無扣分 — 滿分！' :
               '无扣分 — 满分！'}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-neutral-200 my-1" />

          {/* Final score */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-neutral-700">{t('finalScore', lang)}</span>
            <span className={`text-lg font-bold ${scoreColor}`}>
              {breakdown.finalScore}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
