'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScreeningResult from '@/components/ScreeningResult';
import { downloadHealthReportPDF } from '@/components/HealthReportPDF';
import { type BodyMapSelectionData } from '@/components/BodyMapSelector';
import { type AnalysisResult } from '@/services/deepseekService';
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

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('wl_screening_session') || '';
}

export default function WhitelabelResultClient({
  slug,
  screeningId,
  recommendedServices,
  contactInfo,
}: WhitelabelResultClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      try {
        const sessionId = getSessionId();
        if (!sessionId) {
          setError('会话已过期，请重新进行筛查');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/whitelabel/screening/${screeningId}?sessionId=${encodeURIComponent(sessionId)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '加载失败');
        }

        const data = await response.json();

        if (data.screening.status !== 'completed') {
          setError('筛查尚未完成');
          setLoading(false);
          return;
        }

        if (!data.screening.analysisResult) {
          throw new Error('分析结果不存在');
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
  }, [screeningId]);

  const handleDownloadPDF = async () => {
    if (!screeningData) return;

    setIsDownloading(true);
    try {
      await downloadHealthReportPDF({
        id: screeningData.id,
        createdAt: screeningData.createdAt,
        userEmail: '',
        bodyMapData: screeningData.bodyMapData,
        analysisResult: screeningData.analysisResult,
      });
    } catch (err) {
      console.error('PDF download error:', err);
      alert('PDF 下载失败，请稍后重试');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">加载分析结果...</p>
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
              href={`/g/${slug}/health-screening`}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">返回</span>
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
            className="inline-block mt-6 text-blue-600 hover:underline"
          >
            重新进行筛查
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
            href={`/g/${slug}`}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">返回首页</span>
          </Link>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                下载 PDF 报告
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm mb-4">
            <FileText className="w-4 h-4" />
            分析完成
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
            AI 健康评估报告
          </h1>
          <p className="text-gray-500 mt-2">
            根据您的回答，AI 为您生成了以下健康分析报告
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
          />
        )}
      </div>

      {/* 推荐服务 */}
      {recommendedServices.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              根据您的筛查结果，推荐以下服务
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              日本顶级医疗机构，提供专业诊断与治疗服务
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {recommendedServices.map((service, index) => (
                <Link
                  key={index}
                  href={service.href}
                  className="group flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                >
                  {service.heroImage && (
                    <img
                      src={service.heroImage}
                      alt={service.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-2">
                      了解详情 <ArrowRight size={14} />
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
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">
              需要专业咨询？联系 {contactInfo.brandName}
            </h3>
            <p className="text-gray-400">
              我们的医疗顾问可以根据您的筛查结果，为您推荐最适合的日本医疗服务
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {contactInfo.wechat && (
              <div className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl">
                <MessageCircle className="w-5 h-5" />
                <span>微信: {contactInfo.wechat}</span>
              </div>
            )}
            {contactInfo.line && (
              <a
                href={`https://line.me/R/ti/p/${contactInfo.line}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-[#06C755] text-white rounded-xl hover:bg-[#05b54e] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>LINE 咨询</span>
              </a>
            )}
            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{contactInfo.phone}</span>
              </a>
            )}
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>邮件咨询</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* PDF 下载提示 */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-gray-900 mb-1">保存您的健康报告</h3>
              <p className="text-sm text-gray-500">
                下载 PDF 格式的精美报告，方便保存和分享给医生
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
                  生成中...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  下载 PDF 报告
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
            className="text-blue-600 hover:underline text-sm"
          >
            再次进行筛查 →
          </Link>
        </div>
      </div>
    </div>
  );
}
