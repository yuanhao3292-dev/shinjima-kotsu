'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import BodyMapSelector, { type BodyMapSelectionData } from '@/components/BodyMapSelector';
import WhitelabelScreeningForm from '@/components/whitelabel/WhitelabelScreeningForm';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Heart,
  Activity,
  Sparkles,
  Shield,
  FileText,
  Users,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

type ScreeningStep = 'welcome' | 'body-map' | 'questionnaire';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'wl_screening_session';
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export default function WhitelabelHealthScreeningPage({ params }: PageProps) {
  const { slug } = use(params);
  const [sessionId, setSessionId] = useState('');
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ScreeningStep>('welcome');
  const [bodyMapData, setBodyMapData] = useState<BodyMapSelectionData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  const startNewScreening = async () => {
    if (!sessionId) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/whitelabel/screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, guideSlug: slug }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '创建筛查失败');
      }

      const result = await response.json();
      setScreeningId(result.screeningId);
      setCurrentStep('body-map');
    } catch (err: any) {
      console.error('Create error:', err);
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleBodyMapComplete = (selectionData: BodyMapSelectionData) => {
    setBodyMapData(selectionData);
    setCurrentStep('questionnaire');
  };

  // 问卷步骤
  if (currentStep === 'questionnaire' && screeningId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setCurrentStep('body-map')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">返回症状选择</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
              <Shield className="w-4 h-4" />
              <span>免费 AI 智能分析</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
              AI 智能健康问诊
            </h1>
            <p className="text-gray-500 mt-2">
              根据您选择的症状，AI 为您定制专属问诊流程
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-16">
          <WhitelabelScreeningForm
            screeningId={screeningId}
            sessionId={sessionId}
            resultPath={`/g/${slug}/health-screening/result`}
            bodyMapData={bodyMapData || undefined}
          />
        </div>
      </div>
    );
  }

  // 人体图步骤
  if (currentStep === 'body-map' && screeningId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href={`/g/${slug}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">返回首页</span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
              <Activity className="w-4 h-4" />
              <span>第一步：选择不适部位</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
              点击人体图选择症状部位
            </h1>
            <p className="text-gray-500 mt-2">
              这将帮助 AI 更精准地为您定制问诊流程
            </p>
          </div>
        </div>

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
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href={`/g/${slug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">返回首页</span>
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
            通过人体图交互选择不适部位，AI
            根据您的症状智能推荐检查科室，并生成专业健康评估报告
          </p>

          {/* 无需登录提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 text-green-700 rounded-full text-sm mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>完全免费 · 无需登录 · AI 即时分析</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={startNewScreening}
            disabled={isCreating || !sessionId}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isCreating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                正在创建...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                开始智能筛查
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 功能亮点 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI 驱动健康评估
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">人体图交互</h3>
            <p className="text-gray-500 text-sm">
              直观点击选择不适部位，无需文字描述
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">智能科室推荐</h3>
            <p className="text-gray-500 text-sm">
              AI 自动关联症状对应的医疗科室
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">动态问诊</h3>
            <p className="text-gray-500 text-sm">
              根据症状智能调整问诊问题
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">PDF 报告</h3>
            <p className="text-gray-500 text-sm">
              生成精美健康评估报告可下载
            </p>
          </div>
        </div>
      </div>

      {/* 信任保障 */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">隐私保护</h3>
            <p className="text-gray-500 text-sm">
              您的健康数据安全加密存储，仅供您个人查看
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI 智能分析</h3>
            <p className="text-gray-500 text-sm">
              基于先进 AI 模型，为您提供专业的健康评估
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">日本医疗推荐</h3>
            <p className="text-gray-500 text-sm">
              根据您的情况推荐日本顶尖医疗机构
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
