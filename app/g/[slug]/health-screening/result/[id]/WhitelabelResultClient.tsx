'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScreeningResult from '@/components/ScreeningResult';
import { type BodyMapSelectionData } from '@/components/BodyMapSelector';
import { type AnalysisResult } from '@/services/aemc/types';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { SCREENING_SESSION_HEADER } from '@/lib/utils/screening-session';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Download,
  FileText,
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// i18n translations
// ---------------------------------------------------------------------------

const translations = {
  sessionExpired: {
    'zh-CN': '会话已过期，请重新进行筛查',
    'zh-TW': '會話已過期，請重新進行篩查',
    ja: 'セッションの有効期限が切れました。再度ヘルスチェックを行ってください',
    en: 'Session expired. Please redo the screening.',
  },
  loadFailed: {
    'zh-CN': '加载失败',
    'zh-TW': '載入失敗',
    ja: '読み込みに失敗しました',
    en: 'Failed to load',
  },
  screeningIncomplete: {
    'zh-CN': '筛查尚未完成',
    'zh-TW': '篩查尚未完成',
    ja: 'ヘルスチェックはまだ完了していません',
    en: 'Screening is not yet complete',
  },
  analysisNotFound: {
    'zh-CN': '分析结果不存在',
    'zh-TW': '分析結果不存在',
    ja: '分析結果が見つかりません',
    en: 'Analysis result not found',
  },
  pdfFailed: {
    'zh-CN': 'PDF 下载失败，请稍后重试',
    'zh-TW': 'PDF 下載失敗，請稍後重試',
    ja: 'PDFのダウンロードに失敗しました。後ほど再度お試しください',
    en: 'PDF download failed. Please try again later.',
  },
  loadingResults: {
    'zh-CN': '加载分析结果...',
    'zh-TW': '載入分析結果...',
    ja: '分析結果を読み込んでいます...',
    en: 'Loading analysis results...',
  },
  goBack: {
    'zh-CN': '返回',
    'zh-TW': '返回',
    ja: '戻る',
    en: 'Back',
  },
  goHome: {
    'zh-CN': '返回首页',
    'zh-TW': '返回首頁',
    ja: 'トップページへ',
    en: 'Back to Home',
  },
  generating: {
    'zh-CN': '生成中...',
    'zh-TW': '生成中...',
    ja: '生成中...',
    en: 'Generating...',
  },
  downloadPdf: {
    'zh-CN': '下载 PDF 报告',
    'zh-TW': '下載 PDF 報告',
    ja: 'PDFレポートをダウンロード',
    en: 'Download PDF Report',
  },
  analysisComplete: {
    'zh-CN': '分析完成',
    'zh-TW': '分析完成',
    ja: '分析完了',
    en: 'Analysis Complete',
  },
  aiHealthReport: {
    'zh-CN': 'AI 健康评估报告',
    'zh-TW': 'AI 健康評估報告',
    ja: 'AI 健康評価レポート',
    en: 'AI Health Assessment Report',
  },
  reportDesc: {
    'zh-CN': '根据您的回答，AI 为您生成了以下健康分析报告',
    'zh-TW': '根據您的回答，AI 為您生成了以下健康分析報告',
    ja: 'ご回答に基づき、AIが以下の健康分析レポートを作成しました',
    en: 'Based on your responses, AI has generated the following health analysis report',
  },
  recommendedServicesTitle: {
    'zh-CN': '根据您的筛查结果，推荐以下服务',
    'zh-TW': '根據您的篩查結果，推薦以下服務',
    ja: 'ヘルスチェック結果に基づき、以下のサービスをご参考ください',
    en: 'Based on your screening results, we recommend the following services',
  },
  recommendedServicesDesc: {
    'zh-CN': '日本医疗机构提供的诊断与治疗服务',
    'zh-TW': '日本醫療機構提供的診斷與治療服務',
    ja: '日本の医療機関による診断・治療サービスです',
    en: 'Diagnosis and treatment services from Japanese medical institutions',
  },
  learnMore: {
    'zh-CN': '了解详情',
    'zh-TW': '了解詳情',
    ja: '詳しく見る',
    en: 'Learn More',
  },
  needConsultation: {
    'zh-CN': '需要专业咨询？联系我们',
    'zh-TW': '需要專業諮詢？聯繫我們',
    ja: '専門的なご相談が必要ですか？お気軽にお問い合わせください',
    en: 'Need professional consultation? Contact us',
  },
  consultationDesc: {
    'zh-CN': '我们的工作人员可以根据您的筛查结果，为您介绍相关的日本医疗服务',
    'zh-TW': '我們的工作人員可以根據您的篩查結果，為您介紹相關的日本醫療服務',
    ja: '担当スタッフが、ヘルスチェック結果を踏まえて日本の医療サービスについてご案内いたします',
    en: 'Our staff can introduce relevant Japanese medical services based on your screening results',
  },
  wechatLabel: {
    'zh-CN': '微信:',
    'zh-TW': '微信:',
    ja: 'WeChat:',
    en: 'WeChat:',
  },
  lineConsult: {
    'zh-CN': 'LINE 咨询',
    'zh-TW': 'LINE 諮詢',
    ja: 'LINE で相談',
    en: 'LINE Consultation',
  },
  emailConsult: {
    'zh-CN': '邮件咨询',
    'zh-TW': '郵件諮詢',
    ja: 'メールで相談',
    en: 'Email Consultation',
  },
  saveReport: {
    'zh-CN': '保存您的健康报告',
    'zh-TW': '保存您的健康報告',
    ja: '健康レポートを保存する',
    en: 'Save Your Health Report',
  },
  saveReportDesc: {
    'zh-CN': '下载 PDF 格式的精美报告，方便保存和分享给医生',
    'zh-TW': '下載 PDF 格式的精美報告，方便保存和分享給醫生',
    ja: 'PDF形式のレポートをダウンロードして、保存や医師との共有にご利用ください',
    en: 'Download a beautifully formatted PDF report for easy saving and sharing with your doctor',
  },
  retakeScreening: {
    'zh-CN': '再次进行筛查 →',
    'zh-TW': '再次進行篩查 →',
    ja: 'ヘルスチェックをやり直す →',
    en: 'Retake Screening →',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string =>
  (translations[key] as Record<Language, string>)[lang];

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

interface RecommendedService {
  name: string;
  description: string;
  href: string;
  heroImage: string;
}

interface ContactInfo {
  brandName: string;
  wechat: string | null;
  line: string | null;
  phone: string | null;
  email: string | null;
}

interface ScreeningData {
  id: string;
  status: string;
  answers: any[];
  bodyMapData?: BodyMapSelectionData;
  analysisResult: AnalysisResult;
  createdAt: string;
  completedAt: string;
}

interface WhitelabelResultClientProps {
  slug: string;
  screeningId: string;
  recommendedServices: RecommendedService[];
  contactInfo: ContactInfo;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('wl_screening_session') || '';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WhitelabelResultClient({
  slug,
  screeningId,
  recommendedServices,
  contactInfo,
}: WhitelabelResultClientProps) {
  const siteLang = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const isDownloading = false; // 服务端生成，无需 loading 状态

  // 报告语言：优先使用 AI 生成时的语言，否则回退到站点语言
  const lang: Language = (screeningData?.analysisResult?.language as Language) || siteLang;

  useEffect(() => {
    async function fetchResult() {
      try {
        const sessionId = getSessionId();
        if (!sessionId) {
          setError(t('sessionExpired', siteLang));
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/whitelabel/screening/${screeningId}`, {
          headers: { [SCREENING_SESSION_HEADER]: sessionId },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || t('loadFailed', siteLang));
        }

        const data = await response.json();

        if (data.screening.status !== 'completed') {
          setError(t('screeningIncomplete', siteLang));
          setLoading(false);
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
  }, [screeningId]);

  const handleDownloadPDF = async () => {
    if (!screeningData) return;
    const sessionId = getSessionId();
    if (!sessionId) {
      setError(t('sessionExpired', siteLang));
      return;
    }

    // 会话令牌走请求头而非 URL，所以拿不到可直接导航的地址，只能先取回二进制。
    //
    // 触发方式必须是 <a download> 而不是 window.open：fetch 之后用户激活
    // （transient user activation）已经过期，此时调用 window.open 会被浏览器
    // 静默拦截 —— 它返回 null 而不抛异常，catch 不触发，用户点了按钮却毫无反应。
    // 锚点下载不受弹窗策略限制，也能保留文件名。
    try {
      const response = await fetch(
        `/api/health-screening/${screeningData.id}/pdf?lang=${encodeURIComponent(lang)}`,
        { headers: { [SCREENING_SESSION_HEADER]: sessionId } }
      );
      if (!response.ok) throw new Error(t('loadFailed', siteLang));

      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Niijima-Health-Report-${screeningData.id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      console.error('PDF download error:', err);
      setError(err.message || t('pdfFailed', siteLang));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-neutral-500">{t('loadingResults', lang)}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        <div className="bg-white border-b border-neutral-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href={`/g/${slug}/health-screening`}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{t('goBack', lang)}</span>
            </Link>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 justify-center">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Link
            href={`/g/${slug}/health-screening`}
            className="inline-block mt-6 text-brand-600 hover:underline"
          >
            {t('retakeScreening', lang)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/g/${slug}`}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t('goHome', lang)}</span>
          </Link>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('generating', lang)}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {t('downloadPdf', lang)}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-gradient-to-b from-white to-brand-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm mb-4">
            <FileText className="w-4 h-4" />
            {t('analysisComplete', lang)}
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            {t('aiHealthReport', lang)}
          </h1>
          <p className="text-neutral-500 mt-2">
            {t('reportDesc', lang)}
          </p>
        </div>
      </div>

      {/* Result */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {screeningData?.analysisResult && (
          <ScreeningResult
            result={screeningData.analysisResult}
            screeningId={screeningId}
            bodyMapData={screeningData.bodyMapData}
            isGuideEmbed={true}
            overrideLanguage={lang}
          />
        )}
      </div>

      {/* 推荐服务 */}
      {recommendedServices.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              {t('recommendedServicesTitle', lang)}
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
              {t('recommendedServicesDesc', lang)}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {recommendedServices.map((service, index) => (
                <Link
                  key={index}
                  href={service.href}
                  className="group flex items-start gap-4 p-4 border border-neutral-200 rounded-xl hover:border-brand-300 hover:shadow-md transition-all"
                >
                  {service.heroImage && (
                    <img
                      src={service.heroImage}
                      alt={service.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-neutral-900 group-hover:text-brand-600 transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-brand-600 mt-2">
                      {t('learnMore', lang)} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 导游联系 CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">
              {t('needConsultation', lang)}
            </h3>
            <p className="text-neutral-400">
              {t('consultationDesc', lang)}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {contactInfo.wechat && (
              <div className="flex items-center gap-2 px-5 py-3 bg-brand-500 text-white rounded-xl">
                <MessageCircle className="w-5 h-5" />
                <span>{t('wechatLabel', lang)} {contactInfo.wechat}</span>
              </div>
            )}
            {contactInfo.line && (
              <a
                href={`https://line.me/R/ti/p/${contactInfo.line}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 brand-gradient-solid text-white rounded-xl hover:bg-brand-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('lineConsult', lang)}</span>
              </a>
            )}
            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-2 px-5 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{contactInfo.phone}</span>
              </a>
            )}
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-2 px-5 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{t('emailConsult', lang)}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* PDF 下载提示 */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="p-6 bg-gradient-to-r from-brand-50 to-brand-50 rounded-2xl border border-brand-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-neutral-900 mb-1">{t('saveReport', lang)}</h3>
              <p className="text-sm text-neutral-500">
                {t('saveReportDesc', lang)}
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-brand-200"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('generating', lang)}
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {t('downloadPdf', lang)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 再次筛查 */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center">
          <Link
            href={`/g/${slug}/health-screening`}
            className="text-brand-600 hover:underline text-sm"
          >
            {t('retakeScreening', lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}
