'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BodyMapSelector, { type BodyMapSelectionData } from '@/components/BodyMapSelector';
import WhitelabelScreeningForm from '@/components/whitelabel/WhitelabelScreeningForm';
import DocumentUpload, { type UploadResult } from '@/components/DocumentUpload';
import { useLanguage, type Language } from '@/hooks/useLanguage';
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
  Upload,
  Globe,
} from 'lucide-react';

const translations: Record<string, Record<Language, string>> = {
  // Common
  back: {
    ja: '戻る',
    'zh-CN': '返回',
    'zh-TW': '返回',
    en: 'Back',
    ko: '이전',
  },
  backToHome: {
    ja: 'トップに戻る',
    'zh-CN': '返回首页',
    'zh-TW': '返回首頁',
    en: 'Back to Home',
    ko: '홈으로 돌아가기',
  },
  createScreeningFailed: {
    ja: 'ヘルスチェックの作成に失敗しました',
    'zh-CN': '创建筛查失败',
    'zh-TW': '建立篩查失敗',
    en: 'Failed to create screening',
    ko: '건강검진 생성에 실패했습니다',
  },
  analysisFailed: {
    ja: '分析に失敗しました',
    'zh-CN': '分析失败',
    'zh-TW': '分析失敗',
    en: 'Analysis failed',
    ko: '분석에 실패했습니다',
  },

  // Upload document step
  uploadDiagnosisReport: {
    ja: '診断書/検査報告をアップロード',
    'zh-CN': '上传诊断书/检查报告',
    'zh-TW': '上傳診斷書/檢查報告',
    en: 'Upload Diagnosis / Examination Report',
    ko: '진단서/검사 보고서 업로드',
  },
  uploadDescription: {
    ja: '診断書や検査報告をアップロードすると、AIが自動的に情報を抽出・分析します',
    'zh-CN': '上传您的诊断书或检查报告，AI 将自动提取信息并进行分析',
    'zh-TW': '上傳您的診斷書或檢查報告，AI 將自動提取資訊並進行分析',
    en: 'Upload your diagnosis or examination report, and AI will automatically extract and analyze the information',
    ko: '진단서 또는 검사 보고서를 업로드하시면 AI가 자동으로 정보를 추출하여 분석합니다',
  },
  analyzing: {
    ja: '分析中...',
    'zh-CN': '分析中...',
    'zh-TW': '分析中...',
    en: 'Analyzing...',
    ko: '분석 중...',
  },
  startAnalysisWithDoc: {
    ja: 'アップロードした文書で分析を開始',
    'zh-CN': '使用已上传文档开始分析',
    'zh-TW': '使用已上傳文件開始分析',
    en: 'Start analysis with uploaded document',
    ko: '업로드된 문서로 분석 시작',
  },
  continueQuestionnaire: {
    ja: 'アンケートで補足情報を入力（推奨）',
    'zh-CN': '继续填写问卷补充信息（推荐）',
    'zh-TW': '繼續填寫問卷補充資訊（推薦）',
    en: 'Continue with questionnaire for additional info (Recommended)',
    ko: '설문지로 추가 정보 입력 (권장)',
  },

  // Questionnaire step
  backToSymptomSelection: {
    ja: '症状選択に戻る',
    'zh-CN': '返回症状选择',
    'zh-TW': '返回症狀選擇',
    en: 'Back to symptom selection',
    ko: '증상 선택으로 돌아가기',
  },
  freeAiAnalysis: {
    ja: '無料 AI 分析',
    'zh-CN': '免费 AI 智能分析',
    'zh-TW': '免費 AI 智能分析',
    en: 'Free AI Analysis',
    ko: '무료 AI 분석',
  },
  aiHealthConsultation: {
    ja: 'AI 健康問診',
    'zh-CN': 'AI 智能健康问诊',
    'zh-TW': 'AI 智能健康問診',
    en: 'AI Health Consultation',
    ko: 'AI 건강 문진',
  },
  questionnaireDescription: {
    ja: '選択した症状に基づき、AIがカスタマイズされた問診を行います',
    'zh-CN': '根据您选择的症状，AI 为您定制专属问诊流程',
    'zh-TW': '根據您選擇的症狀，AI 為您定制專屬問診流程',
    en: 'Based on your selected symptoms, AI will customize a consultation process for you',
    ko: '선택하신 증상을 바탕으로 AI가 맞춤형 문진을 진행합니다',
  },

  // Body map step
  stepOneSelectAreas: {
    ja: 'ステップ1：不調部位を選択',
    'zh-CN': '第一步：选择不适部位',
    'zh-TW': '第一步：選擇不適部位',
    en: 'Step 1: Select Areas of Discomfort',
    ko: '1단계: 불편한 부위 선택',
  },
  clickBodyMap: {
    ja: '人体図をクリックして症状部位を選択',
    'zh-CN': '点击人体图选择症状部位',
    'zh-TW': '點擊人體圖選擇症狀部位',
    en: 'Click the body map to select symptom areas',
    ko: '인체도를 클릭하여 증상 부위를 선택하세요',
  },
  bodyMapDescription: {
    ja: 'AIがより正確にカスタマイズされた問診を提供するのに役立ちます',
    'zh-CN': '这将帮助 AI 更精准地为您定制问诊流程',
    'zh-TW': '這將幫助 AI 更精準地為您定制問診流程',
    en: 'This will help AI customize a more precise consultation for you',
    ko: 'AI가 더 정확한 맞춤형 문진을 제공하는 데 도움이 됩니다',
  },

  // Welcome page
  aiHealthScreening: {
    ja: 'AI ヘルスチェック',
    'zh-CN': 'AI 智能健康筛查',
    'zh-TW': 'AI 智能健康篩查',
    en: 'AI Health Screening',
    ko: 'AI 건강검진',
  },
  welcomeDescription: {
    ja: '人体図で不調部位を選択し、AIが症状に基づいて受診科を推薦、専門的な健康評価レポートを生成します',
    'zh-CN': '通过人体图交互选择不适部位，AI 根据您的症状智能推荐检查科室，并生成专业健康评估报告',
    'zh-TW': '透過人體圖互動選擇不適部位，AI 根據您的症狀智能推薦檢查科室，並生成專業健康評估報告',
    en: 'Select areas of discomfort on the body map. AI will recommend departments based on your symptoms and generate a professional health assessment report',
    ko: '인체도에서 불편한 부위를 선택하시면 AI가 증상에 따라 진료과를 추천하고 전문 건강 평가 보고서를 생성합니다',
  },
  freeNoLoginInstantAi: {
    ja: '完全無料 · ログイン不要 · AI 即時分析',
    'zh-CN': '完全免费 · 无需登录 · AI 即时分析',
    'zh-TW': '完全免費 · 無需登入 · AI 即時分析',
    en: 'Completely Free · No Login Required · Instant AI Analysis',
    ko: '완전 무료 · 로그인 불필요 · AI 즉시 분석',
  },
  creating: {
    ja: '作成中...',
    'zh-CN': '正在创建...',
    'zh-TW': '正在建立...',
    en: 'Creating...',
    ko: '생성 중...',
  },
  startSmartScreening: {
    ja: 'ヘルスチェックを開始',
    'zh-CN': '开始智能筛查',
    'zh-TW': '開始智能篩查',
    en: 'Start Smart Screening',
    ko: '건강검진 시작',
  },
  orUploadDiagnosis: {
    ja: 'または診断書をアップロード',
    'zh-CN': '或上传诊断书',
    'zh-TW': '或上傳診斷書',
    en: 'Or Upload Diagnosis',
    ko: '또는 진단서 업로드',
  },
  aiPoweredHealthAssessment: {
    ja: 'AI 健康評価',
    'zh-CN': 'AI 驱动健康评估',
    'zh-TW': 'AI 驅動健康評估',
    en: 'AI-Powered Health Assessment',
    ko: 'AI 건강 평가',
  },
  bodyMapInteraction: {
    ja: '人体図インタラクション',
    'zh-CN': '人体图交互',
    'zh-TW': '人體圖互動',
    en: 'Body Map Interaction',
    ko: '인체도 상호작용',
  },
  bodyMapInteractionDesc: {
    ja: '不調部位を直感的にクリック選択、文字入力不要',
    'zh-CN': '直观点击选择不适部位，无需文字描述',
    'zh-TW': '直觀點擊選擇不適部位，無需文字描述',
    en: 'Intuitively click to select areas of discomfort, no text input needed',
    ko: '불편한 부위를 직관적으로 클릭하여 선택, 텍스트 입력 불필요',
  },
  smartDeptRecommendation: {
    ja: 'スマート診療科推薦',
    'zh-CN': '智能科室推荐',
    'zh-TW': '智能科室推薦',
    en: 'Smart Department Recommendation',
    ko: '스마트 진료과 추천',
  },
  smartDeptRecommendationDesc: {
    ja: 'AIが症状に対応する診療科を自動連携',
    'zh-CN': 'AI 自动关联症状对应的医疗科室',
    'zh-TW': 'AI 自動關聯症狀對應的醫療科室',
    en: 'AI automatically matches symptoms to the relevant medical departments',
    ko: 'AI가 증상에 해당하는 진료과를 자동으로 연결합니다',
  },
  dynamicConsultation: {
    ja: 'ダイナミック問診',
    'zh-CN': '动态问诊',
    'zh-TW': '動態問診',
    en: 'Dynamic Consultation',
    ko: '동적 문진',
  },
  dynamicConsultationDesc: {
    ja: '症状に応じて問診内容をスマートに調整',
    'zh-CN': '根据症状智能调整问诊问题',
    'zh-TW': '根據症狀智能調整問診問題',
    en: 'Intelligently adjusts consultation questions based on symptoms',
    ko: '증상에 따라 문진 내용을 지능적으로 조정합니다',
  },
  pdfReport: {
    ja: 'PDF レポート',
    'zh-CN': 'PDF 报告',
    'zh-TW': 'PDF 報告',
    en: 'PDF Report',
    ko: 'PDF 보고서',
  },
  pdfReportDesc: {
    ja: '美しい健康評価レポートを生成・ダウンロード可能',
    'zh-CN': '生成精美健康评估报告可下载',
    'zh-TW': '生成精美健康評估報告可下載',
    en: 'Generate and download a professional health assessment report',
    ko: '전문 건강 평가 보고서를 생성하여 다운로드할 수 있습니다',
  },
  privacyProtection: {
    ja: 'プライバシー保護',
    'zh-CN': '隐私保护',
    'zh-TW': '隱私保護',
    en: 'Privacy Protection',
    ko: '개인정보 보호',
  },
  privacyProtectionDesc: {
    ja: '健康データは安全に暗号化保存、ご本人のみ閲覧可能',
    'zh-CN': '您的健康数据安全加密存储，仅供您个人查看',
    'zh-TW': '您的健康數據安全加密儲存，僅供您個人查看',
    en: 'Your health data is securely encrypted and only accessible to you',
    ko: '건강 데이터는 안전하게 암호화되어 저장되며 본인만 열람할 수 있습니다',
  },
  aiAnalysis: {
    ja: 'AI 分析',
    'zh-CN': 'AI 智能分析',
    'zh-TW': 'AI 智能分析',
    en: 'AI Analysis',
    ko: 'AI 분석',
  },
  aiAnalysisDesc: {
    ja: 'AIモデルに基づく健康参考情報を提供（医療診断ではありません）',
    'zh-CN': '基于 AI 模型，为您提供健康参考信息（非医疗诊断）',
    'zh-TW': '基於 AI 模型，為您提供健康參考資訊（非醫療診斷）',
    en: 'AI-powered health reference information (not a medical diagnosis)',
    ko: 'AI 모델 기반 건강 참고 정보 제공 (의료 진단이 아닙니다)',
  },
  japanMedicalRecommendation: {
    ja: '日本医療推薦',
    'zh-CN': '日本医疗推荐',
    'zh-TW': '日本醫療推薦',
    en: 'Japan Medical Recommendation',
    ko: '일본 의료 추천',
  },
  japanMedicalRecommendationDesc: {
    ja: 'お客様の状況に合わせて日本の医療機関をご案内',
    'zh-CN': '根据您的情况推荐日本医疗机构',
    'zh-TW': '根據您的情況推薦日本醫療機構',
    en: 'Recommend Japanese medical institutions based on your condition',
    ko: '고객님의 상태에 맞는 일본 의료기관을 안내해 드립니다',
  },
  reportLanguage: {
    ja: 'レポート言語',
    'zh-CN': '报告语言',
    'zh-TW': '報告語言',
    en: 'Report language',
    ko: '보고서 언어',
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

type ScreeningStep = 'welcome' | 'body-map' | 'questionnaire' | 'upload-document';

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
  const router = useRouter();
  const lang = useLanguage();
  const t = (key: string) => (translations as any)[key]?.[lang] || (translations as any)[key]?.['ja'] || key;
  const [sessionId, setSessionId] = useState('');
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ScreeningStep>('welcome');
  const [bodyMapData, setBodyMapData] = useState<BodyMapSelectionData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  // 报告语言（独立于网站 UI 语言）
  const [reportLang, setReportLang] = useState<Language>(lang);

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
        throw new Error(errorData.error || t('createScreeningFailed'));
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

  // 文档上传流程
  const startWithDocumentUpload = async () => {
    if (screeningId) {
      setCurrentStep('upload-document');
      return;
    }
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
        throw new Error(errorData.error || t('createScreeningFailed'));
      }
      const result = await response.json();
      setScreeningId(result.screeningId);
      setCurrentStep('upload-document');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDocumentUploadSuccess = (_result: UploadResult) => {
    setDocumentUploaded(true);
  };

  const handleAnalyzeWithDocument = async () => {
    if (!screeningId) return;
    setIsAnalyzingDoc(true);
    setError(null);
    try {
      const response = await fetch('/api/whitelabel/screening/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId, sessionId, phase: 2, language: reportLang }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('analysisFailed'));

      router.push(`/g/${slug}/health-screening/result/${screeningId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  // 文档上传步骤
  if (currentStep === 'upload-document' && screeningId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setCurrentStep('welcome')}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{t('back')}</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-100 text-medical-700 rounded-full text-sm mb-4">
              <Upload className="w-4 h-4" />
              <span>{t('uploadDiagnosisReport')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {t('uploadDiagnosisReport')}
            </h1>
            <p className="text-gray-500 mt-2">
              {t('uploadDescription')}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <DocumentUpload
            screeningId={screeningId}
            sessionId={sessionId}
            isWhitelabel={true}
            language="zh-CN"
            onUploadSuccess={handleDocumentUploadSuccess}
            onRemove={() => setDocumentUploaded(false)}
          />

          {documentUploaded && (
            <div className="mt-8 space-y-3">
              {/* 报告语言选择器 */}
              <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{t('reportLanguage')}:</span>
                <div className="flex gap-1">
                  {([
                    { code: 'zh-CN' as Language, label: '简体中文' },
                    { code: 'zh-TW' as Language, label: '繁體中文' },
                    { code: 'ja' as Language, label: '日本語' },
                    { code: 'en' as Language, label: 'English' },
                    { code: 'ko' as Language, label: '한국어' },
                  ]).map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => setReportLang(code)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        reportLang === code
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAnalyzeWithDocument}
                disabled={isAnalyzingDoc}
                className="w-full px-6 py-4 bg-gradient-to-r from-medical-600 to-medical-700 text-white text-lg font-medium rounded-xl hover:from-medical-700 hover:to-medical-800 transition-all disabled:opacity-50 shadow-lg"
              >
                {isAnalyzingDoc ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('analyzing')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {t('startAnalysisWithDoc')}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentStep('body-map')}
                className="w-full px-6 py-3 border-2 border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50 transition-colors text-sm"
              >
                {t('continueQuestionnaire')}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 问卷步骤
  if (currentStep === 'questionnaire' && screeningId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setCurrentStep('body-map')}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{t('backToSymptomSelection')}</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
              <Shield className="w-4 h-4" />
              <span>{t('freeAiAnalysis')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {t('aiHealthConsultation')}
            </h1>
            <p className="text-gray-500 mt-2">
              {t('questionnaireDescription')}
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
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{t('backToHome')}</span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
              <Activity className="w-4 h-4" />
              <span>{t('stepOneSelectAreas')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {t('clickBodyMap')}
            </h1>
            <p className="text-gray-500 mt-2">
              {t('bodyMapDescription')}
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
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t('backToHome')}</span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-white to-blue-50/30 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg shadow-blue-200">
            <Heart className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            {t('aiHealthScreening')}
          </h1>

          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            {t('welcomeDescription')}
          </p>

          {/* 无需登录提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 text-green-700 rounded-full text-sm mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>{t('freeNoLoginInstantAi')}</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={startNewScreening}
              disabled={isCreating || !sessionId}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:-translate-y-0.5"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('creating')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('startSmartScreening')}
                </span>
              )}
            </button>
            <button
              onClick={startWithDocumentUpload}
              disabled={isCreating || !sessionId}
              className="px-8 py-3 border-2 border-medical-300 text-medical-700 rounded-xl hover:bg-medical-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {t('orUploadDiagnosis')}
            </button>
          </div>
        </div>
      </div>

      {/* 功能亮点 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {t('aiPoweredHealthAssessment')}
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('bodyMapInteraction')}</h3>
            <p className="text-gray-500 text-sm">
              {t('bodyMapInteractionDesc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('smartDeptRecommendation')}</h3>
            <p className="text-gray-500 text-sm">
              {t('smartDeptRecommendationDesc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('dynamicConsultation')}</h3>
            <p className="text-gray-500 text-sm">
              {t('dynamicConsultationDesc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('pdfReport')}</h3>
            <p className="text-gray-500 text-sm">
              {t('pdfReportDesc')}
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
            <h3 className="font-bold text-gray-900 mb-2">{t('privacyProtection')}</h3>
            <p className="text-gray-500 text-sm">
              {t('privacyProtectionDesc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('aiAnalysis')}</h3>
            <p className="text-gray-500 text-sm">
              {t('aiAnalysisDesc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('japanMedicalRecommendation')}</h3>
            <p className="text-gray-500 text-sm">
              {t('japanMedicalRecommendationDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
