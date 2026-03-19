'use client';

import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import type { AnalysisResult } from '@/services/aemc/types';
import type { Language } from '@/hooks/useLanguage';
import {
  matchPackages,
  getPackageName,
  getPackagePrice,
  formatPriceJPY,
  PACKAGE_HIGHLIGHTS,
  PACKAGE_URLS,
} from '@/lib/screening-package-matcher';

// ============================================================
// i18n
// ============================================================

const t = (key: string, lang: Language): string => T[key]?.[lang] ?? key;

const T: Record<string, Record<Language, string>> = {
  title: {
    'zh-CN': '推荐健检套餐',
    'zh-TW': '推薦健檢套餐',
    ja: 'おすすめ健診コース',
    en: 'Recommended Packages',
  },
  desc: {
    'zh-CN': '根据您的健康评估结果，为您推荐以下日本精密健检方案',
    'zh-TW': '根據您的健康評估結果，為您推薦以下日本精密健檢方案',
    ja: '健康評価の結果に基づき、以下の精密健診プランをおすすめします',
    en: 'Based on your health assessment, we recommend the following packages',
  },
  viewDetails: {
    'zh-CN': '查看详情',
    'zh-TW': '查看詳情',
    ja: '詳細を見る',
    en: 'View Details',
  },
  cancerFlag: {
    'zh-CN': '癌症风险评估',
    'zh-TW': '癌症風險評估',
    ja: 'がんリスク評価',
    en: 'Cancer Risk Assessment',
  },
  cancerScreening: {
    'zh-CN': '无创癌症筛查',
    'zh-TW': '無創癌症篩查',
    ja: '非侵襲がん検診',
    en: 'Non-Invasive Cancer Screening',
  },
  deptCardiology: {
    'zh-CN': '心脏专项评估',
    'zh-TW': '心臟專項評估',
    ja: '心臓専門評価',
    en: 'Cardiac Assessment',
  },
  deptGastro: {
    'zh-CN': '消化道专项检查',
    'zh-TW': '消化道專項檢查',
    ja: '消化管専門検査',
    en: 'GI Tract Screening',
  },
  highRisk: {
    'zh-CN': '综合精密健检',
    'zh-TW': '綜合精密健檢',
    ja: '総合精密健診',
    en: 'Comprehensive Screening',
  },
  generalCheckup: {
    'zh-CN': '定期健康检查',
    'zh-TW': '定期健康檢查',
    ja: '定期健康診断',
    en: 'Regular Health Checkup',
  },
  preventive: {
    'zh-CN': '预防性健康筛查',
    'zh-TW': '預防性健康篩查',
    ja: '予防的健康スクリーニング',
    en: 'Preventive Screening',
  },
};

// ============================================================
// Component
// ============================================================

interface Props {
  result: AnalysisResult;
  lang: Language;
}

export default function RecommendedPackages({ result, lang }: Props) {
  const recommendations = matchPackages(result);
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Package className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="text-xl font-serif font-semibold text-neutral-900 tracking-wide">
          {t('title', lang)}
        </h3>
      </div>
      <p className="text-gray-500 text-sm mb-6 ml-[52px]">{t('desc', lang)}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => {
          const name = getPackageName(rec.slug, lang);
          const price = getPackagePrice(rec.slug);
          const highlights = PACKAGE_HIGHLIGHTS[rec.slug]?.[lang] ?? [];
          const url = PACKAGE_URLS[rec.slug] ?? '#';

          return (
            <Link
              key={rec.slug}
              href={url}
              className="group border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              {/* 匹配原因标签 */}
              <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full mb-3">
                {t(rec.matchReasonKey, lang)}
              </span>

              {/* 名称 + 价格 */}
              <h4 className="font-bold text-gray-900 mb-1 leading-snug">{name}</h4>
              {price > 0 && (
                <p className="text-emerald-600 font-semibold text-lg mb-3">
                  {formatPriceJPY(price)}
                </p>
              )}

              {/* 亮点 */}
              {highlights.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA */}
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                {t('viewDetails', lang)}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
