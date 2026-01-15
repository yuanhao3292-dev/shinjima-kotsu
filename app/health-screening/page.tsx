'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BodyMapSelector, { type BodyMapSelectionData } from '@/components/BodyMapSelector';
import DynamicScreeningForm from '@/components/DynamicScreeningForm';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Heart,
  Shield,
  Sparkles,
  Activity,
  FileText,
  Users,
} from 'lucide-react';
import { FREE_SCREENING_LIMIT } from '@/lib/screening-questions';

interface ScreeningData {
  screeningId?: string;
  freeRemaining: number;
  existingScreening?: {
    id: string;
    status: string;
    answers: any[];
    bodyMapData?: BodyMapSelectionData;
  };
}

type ScreeningStep = 'welcome' | 'body-map' | 'questionnaire';

export default function HealthScreeningPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScreeningData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<ScreeningStep>('welcome');
  const [bodyMapData, setBodyMapData] = useState<BodyMapSelectionData | null>(null);

  // 加载用户状态和未完成的筛查
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/health-screening');

        if (response.status === 401) {
          router.push('/auth/login?redirect=/health-screening');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '載入失敗');
        }

        const result = await response.json();

        // 检查是否有未完成的筛查
        const inProgressScreening = result.screenings?.find(
          (s: any) => s.status === 'in_progress'
        );

        if (inProgressScreening) {
          // 获取详细答案
          const detailResponse = await fetch(
            `/api/health-screening/${inProgressScreening.id}`
          );
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            setData({
              freeRemaining: result.freeRemaining,
              existingScreening: {
                id: inProgressScreening.id,
                status: inProgressScreening.status,
                answers: detailData.screening.answers || [],
                bodyMapData: detailData.screening.bodyMapData,
              },
            });
            // 如果有已保存的 bodyMapData，恢复到问卷步骤
            if (detailData.screening.bodyMapData) {
              setBodyMapData(detailData.screening.bodyMapData);
              setCurrentStep('questionnaire');
            }
          } else {
            setData({
              freeRemaining: result.freeRemaining,
            });
          }
        } else {
          setData({
            freeRemaining: result.freeRemaining,
          });
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  // 开始新的筛查
  const startNewScreening = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/health-screening', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '創建筛查失敗');
      }

      const result = await response.json();
      setData({
        screeningId: result.screeningId,
        freeRemaining: result.freeRemaining,
      });
      // 进入人体图选择步骤
      setCurrentStep('body-map');
    } catch (err: any) {
      console.error('Create error:', err);
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  // 人体图选择完成
  const handleBodyMapComplete = (selectionData: BodyMapSelectionData) => {
    setBodyMapData(selectionData);
    setCurrentStep('questionnaire');
  };

  // 返回到人体图选择
  const handleBackToBodyMap = () => {
    setCurrentStep('body-map');
  };

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  // 显示问卷表单
  if (currentStep === 'questionnaire' && (data?.screeningId || data?.existingScreening)) {
    const screeningId = data.screeningId || data.existingScreening?.id!;
    const initialAnswers = data.existingScreening?.answers || [];

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={handleBackToBodyMap}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">返回症狀選擇</span>
            </button>
          </div>
        </div>

        {/* Progress Info */}
        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
              <Shield className="w-4 h-4" />
              <span>本週免費筛查剩餘 {data.freeRemaining} 次</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
              AI 智能健康問診
            </h1>
            <p className="text-gray-500 mt-2">
              根據您選擇的症狀，AI 為您定制專屬問診流程
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <DynamicScreeningForm
            screeningId={screeningId}
            initialAnswers={initialAnswers}
            bodyMapData={bodyMapData || undefined}
          />
        </div>
      </div>
    );
  }

  // 人体图选择步骤
  if (currentStep === 'body-map' && (data?.screeningId || data?.existingScreening)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
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

        {/* Progress Info */}
        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
              <Activity className="w-4 h-4" />
              <span>第一步：選擇不適部位</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
              點擊人體圖選擇症狀部位
            </h1>
            <p className="text-gray-500 mt-2">
              這將幫助 AI 更精準地為您定制問診流程
            </p>
          </div>
        </div>

        {/* Body Map Selector */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <BodyMapSelector
            onComplete={handleBodyMapComplete}
            onBack={() => setCurrentStep('welcome')}
          />
        </div>
      </div>
    );
  }

  // 欢迎页面
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
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

      {/* Hero */}
      <div className="bg-gradient-to-b from-white to-blue-50/30 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg shadow-blue-200">
            <Heart className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            AI 智能健康筛查
          </h1>

          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            全新升級！通過人體圖交互選擇不適部位，AI
            根據您的症狀智能推薦檢查科室，並生成專業健康評估報告
          </p>

          {/* 免费次数提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 text-green-700 rounded-full text-sm mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>
              本週免費筛查剩餘 {data?.freeRemaining ?? FREE_SCREENING_LIMIT} 次
            </span>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 开始按钮 */}
          {(data?.freeRemaining ?? FREE_SCREENING_LIMIT) > 0 ? (
            <button
              onClick={startNewScreening}
              disabled={isCreating}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:-translate-y-0.5"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  正在創建...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  開始智能筛查
                </span>
              )}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">本週免費筛查次數已用完，下週一將自動重置</p>
              <Link
                href="/health-screening/history"
                className="text-blue-600 hover:underline"
              >
                查看歷史記錄
              </Link>
            </div>
          )}

          {/* 快捷链接 */}
          <div className="flex justify-center gap-4 mt-6">
            <Link
              href="/health-screening/history"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              查看歷史記錄 →
            </Link>
          </div>
        </div>
      </div>

      {/* 新功能亮点 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            全新升級功能
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">人體圖交互</h3>
            <p className="text-gray-500 text-sm">
              直觀點擊選擇不適部位，無需文字描述
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">智能科室推薦</h3>
            <p className="text-gray-500 text-sm">
              AI 自動關聯症狀對應的醫療科室
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">動態問診</h3>
            <p className="text-gray-500 text-sm">
              根據症狀智能調整問診問題
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">PDF 報告</h3>
            <p className="text-gray-500 text-sm">
              生成精美健康評估報告可下載
            </p>
          </div>
        </div>
      </div>

      {/* 原有功能特性 */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">隱私保護</h3>
            <p className="text-gray-500 text-sm">
              您的健康數據安全加密存儲，僅供您個人查看
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI 智能分析</h3>
            <p className="text-gray-500 text-sm">
              基於先進 AI 模型，為您提供專業的健康評估
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">日本醫療推薦</h3>
            <p className="text-gray-500 text-sm">
              根據您的情況推薦日本頂尖醫療機構
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
