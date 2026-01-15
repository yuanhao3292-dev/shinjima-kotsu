'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScreeningResult from '@/components/ScreeningResult';
import { ArrowLeft, Loader2, AlertCircle, Download, FileText } from 'lucide-react';
import { AnalysisResult } from '@/services/deepseekService';
import { downloadHealthReportPDF } from '@/components/HealthReportPDF';
import { type BodyMapSelectionData } from '@/components/BodyMapSelector';

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

export default function ScreeningResultPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
          throw new Error(errorData.error || '載入失敗');
        }

        const data = await response.json();

        if (data.screening.status !== 'completed') {
          // 如果筛查未完成，跳转到问卷页面继续
          router.push('/health-screening');
          return;
        }

        if (!data.screening.analysisResult) {
          throw new Error('分析結果不存在');
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
  }, [id, router]);

  // 下载 PDF 报告
  const handleDownloadPDF = async () => {
    if (!screeningData) return;

    setIsDownloading(true);
    try {
      await downloadHealthReportPDF({
        id: screeningData.id,
        createdAt: screeningData.createdAt,
        userEmail: screeningData.userEmail,
        bodyMapData: screeningData.bodyMapData,
        analysisResult: screeningData.analysisResult,
      });
    } catch (err) {
      console.error('PDF download error:', err);
      alert('PDF 下載失敗，請稍後重試');
    } finally {
      setIsDownloading(false);
    }
  };

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">載入分析結果...</p>
        </div>
      </div>
    );
  }

  // 错误
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href="/health-screening"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
            href="/health-screening"
            className="inline-block mt-6 text-blue-600 hover:underline"
          >
            返回健康筛查
          </Link>
        </div>
      </div>
    );
  }

  // 结果页面
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/health-screening/history"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">筛查歷史</span>
          </Link>

          {/* PDF 下载按钮 */}
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
                下載 PDF 報告
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
            AI 健康評估報告
          </h1>
          <p className="text-gray-500 mt-2">
            根據您的回答，AI 為您生成了以下健康分析報告
          </p>
        </div>
      </div>

      {/* Result */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {screeningData?.analysisResult && (
          <ScreeningResult
            result={screeningData.analysisResult}
            screeningId={id}
            bodyMapData={screeningData.bodyMapData}
          />
        )}

        {/* 底部 PDF 下载提示 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-gray-900 mb-1">保存您的健康報告</h3>
              <p className="text-sm text-gray-500">
                下載 PDF 格式的精美報告，方便保存和分享給醫生
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
                  下載 PDF 報告
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
