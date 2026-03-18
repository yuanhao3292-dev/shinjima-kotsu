'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScreeningResult from '@/components/ScreeningResult';
import { ArrowLeft, Loader2, AlertCircle, Download, FileText, Globe, Check } from 'lucide-react';
import { type AnalysisResult } from '@/services/aemc/types';
import { downloadHealthReportPDF } from '@/components/HealthReportPDF';
import { type BodyMapSelectionData } from '@/components/BodyMapSelector';
import { useLanguage, type Language } from '@/hooks/useLanguage';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ScreeningData {
  id: string;
  status: string;
  answers: any[];
  bodyMapData?: BodyMapSelectionData;
  analysisResult: AnalysisResult;
  createdAt: string;
  completedAt: string;
  userEmail: string;
}

const translations = {
  loadError: { ja: '読み込みに失敗しました', 'zh-CN': '载入失败', 'zh-TW': '載入失敗', en: 'Failed to load' },
  analysisNotFound: { ja: '分析結果が見つかりません', 'zh-CN': '分析结果不存在', 'zh-TW': '分析結果不存在', en: 'Analysis result not found' },
  pdfDownloadError: { ja: 'PDFダウンロードに失敗しました。後でもう一度お試しください', 'zh-CN': 'PDF 下载失败，请稍后重试', 'zh-TW': 'PDF 下載失敗，請稍後重試', en: 'PDF download failed, please try again later' },
  loadingResult: { ja: '分析結果を読み込み中...', 'zh-CN': '载入分析结果...', 'zh-TW': '載入分析結果...', en: 'Loading analysis result...' },
  backButton: { ja: '戻る', 'zh-CN': '返回', 'zh-TW': '返回', en: 'Back' },
  backToScreening: { ja: '健康スクリーニングに戻る', 'zh-CN': '返回健康筛查', 'zh-TW': '返回健康篩查', en: 'Back to Health Screening' },
  screeningHistory: { ja: 'スクリーニング履歴', 'zh-CN': '筛查历史', 'zh-TW': '篩查歷史', en: 'Screening History' },
  generating: { ja: '生成中...', 'zh-CN': '生成中...', 'zh-TW': '生成中...', en: 'Generating...' },
  downloadPDF: { ja: 'PDFレポートをダウンロード', 'zh-CN': '下载 PDF 报告', 'zh-TW': '下載 PDF 報告', en: 'Download PDF Report' },
  analysisComplete: { ja: '分析完了', 'zh-CN': '分析完成', 'zh-TW': '分析完成', en: 'Analysis Complete' },
  reportTitle: { ja: 'AI 健康評価レポート', 'zh-CN': 'AI 健康评估报告', 'zh-TW': 'AI 健康評估報告', en: 'AI Health Assessment Report' },
  reportSubtitle: { ja: 'あなたの回答に基づき、AIが以下の健康分析レポートを生成しました', 'zh-CN': '根据您的回答，AI 为您生成了以下健康分析报告', 'zh-TW': '根據您的回答，AI 為您生成了以下健康分析報告', en: 'Based on your responses, AI has generated the following health analysis report' },
  saveReportTitle: { ja: '健康レポートを保存', 'zh-CN': '保存您的健康报告', 'zh-TW': '保存您的健康報告', en: 'Save Your Health Report' },
  saveReportDesc: { ja: 'PDF形式の精美なレポートをダウンロードし、保存や医師への共有に便利', 'zh-CN': '下载 PDF 格式的精美报告，方便保存和分享给医生', 'zh-TW': '下載 PDF 格式的精美報告，方便保存和分享給醫生', en: 'Download beautiful PDF report for easy saving and sharing with your doctor' },
  translating: { ja: '翻訳中...', 'zh-CN': '翻译中...', 'zh-TW': '翻譯中...', en: 'Translating...' },
  translateError: { ja: '翻訳に失敗しました', 'zh-CN': '翻译失败', 'zh-TW': '翻譯失敗', en: 'Translation failed' },
  reportLanguage: { ja: 'レポート言語', 'zh-CN': '报告语言', 'zh-TW': '報告語言', en: 'Report Language' },
} as const;

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

export default function ScreeningResultPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const siteLang = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [displayResult, setDisplayResult] = useState<AnalysisResult | null>(null);

  // 报告语言：优先使用当前展示结果的语言，否则回退到站点语言
  const lang: Language = (displayResult?.language as Language) || (screeningData?.analysisResult?.language as Language) || siteLang;

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`/api/health-screening/${id}`);

        if (response.status === 401) {
          router.push('/auth/login?redirect=/health-screening');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || t('loadError', siteLang));
        }

        const data = await response.json();

        if (data.screening.status !== 'completed') {
          router.push('/health-screening');
          return;
        }

        if (!data.screening.analysisResult) {
          throw new Error(t('analysisNotFound', siteLang));
        }

        setScreeningData(data.screening);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  const currentResult = displayResult || screeningData?.analysisResult;

  const handleDownloadPDF = async () => {
    if (!screeningData || !currentResult) return;

    setIsDownloading(true);
    try {
      await downloadHealthReportPDF({
        id: screeningData.id,
        createdAt: screeningData.createdAt,
        userEmail: screeningData.userEmail,
        bodyMapData: screeningData.bodyMapData,
        analysisResult: currentResult,
        language: lang,
      });
    } catch (err) {
      console.error('PDF download error:', err);
      alert(t('pdfDownloadError', lang));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTranslate = async (targetLang: Language) => {
    if (!screeningData || isTranslating) return;
    // 如果目标语言与当前展示语言相同，无需翻译
    if (targetLang === lang) return;

    setIsTranslating(true);
    setError(null);
    try {
      const response = await fetch('/api/health-screening/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId: id, language: targetLang }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('translateError', lang));
      setDisplayResult(result.analysisResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">{t('loadingResult', lang)}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href="/health-screening"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{t('backButton', lang)}</span>
            </Link>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 justify-center">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Link
            href="/health-screening"
            className="inline-block mt-6 text-blue-600 hover:underline"
          >
            {t('backToScreening', lang)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/health-screening/history"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t('screeningHistory', lang)}</span>
          </Link>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('generating', lang)}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {t('downloadPDF', lang)}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title + Language Selector */}
      <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm mb-4">
            <FileText className="w-4 h-4" />
            {t('analysisComplete', lang)}
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-900 tracking-wide">
            {t('reportTitle', lang)}
          </h1>
          <p className="text-gray-500 mt-2">
            {t('reportSubtitle', lang)}
          </p>

          {/* 语言切换 */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">{t('reportLanguage', lang)}:</span>
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleTranslate(opt.value)}
                  disabled={isTranslating}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    lang === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isTranslating && lang !== opt.value ? '' : opt.label}
                </button>
              ))}
            </div>
            {isTranslating && (
              <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t('translating', lang)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {currentResult && (
          <ScreeningResult
            result={currentResult}
            screeningId={id}
            bodyMapData={screeningData?.bodyMapData}
            overrideLanguage={lang}
          />
        )}

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-gray-900 mb-1">{t('saveReportTitle', lang)}</h3>
              <p className="text-sm text-gray-500">
                {t('saveReportDesc', lang)}
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-blue-200"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('generating', lang)}
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {t('downloadPDF', lang)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
