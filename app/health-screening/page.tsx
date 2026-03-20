'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import BodyMapSelector, { type BodyMapSelectionData } from '@/components/BodyMapSelector';
import DynamicScreeningForm from '@/components/DynamicScreeningForm';
import FollowUpQuestionnaire from '@/components/FollowUpQuestionnaire';
import DocumentUpload, { type UploadResult } from '@/components/DocumentUpload';
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
  Upload,
  Globe,
} from 'lucide-react';
import { FREE_SCREENING_LIMIT } from '@/lib/screening-questions';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// 翻译对象
const translations = {
  loadError: {
    ja: '読み込みに失敗しました',
    'zh-CN': '载入失败',
    'zh-TW': '載入失敗',
    en: 'Failed to load',
  },
  createError: {
    ja: 'スクリーニング作成に失敗しました',
    'zh-CN': '创建筛查失败',
    'zh-TW': '創建篩查失敗',
    en: 'Failed to create screening',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '载入中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  backToSymptoms: {
    ja: '症状選択に戻る',
    'zh-CN': '返回症状选择',
    'zh-TW': '返回症狀選擇',
    en: 'Back to Symptoms',
  },
  freeRemaining: {
    ja: '今月の無料スクリーニング残数',
    'zh-CN': '本月免费筛查剩余',
    'zh-TW': '本月免費篩查剩餘',
    en: 'Free screenings remaining this month',
  },
  aiQuestionnaire: {
    ja: 'AI スマート健康問診',
    'zh-CN': 'AI 智能健康问诊',
    'zh-TW': 'AI 智能健康問診',
    en: 'AI Smart Health Questionnaire',
  },
  customizedFlow: {
    ja: '選択された症状に基づき、AIがカスタマイズされた問診フローを作成します',
    'zh-CN': '根据您选择的症状，AI 为您定制专属问诊流程',
    'zh-TW': '根據您選擇的症狀，AI 為您定制專屬問診流程',
    en: 'AI customizes questionnaire flow based on your symptoms',
  },
  backToAccount: {
    ja: 'マイアカウントに戻る',
    'zh-CN': '返回我的账户',
    'zh-TW': '返回我的帳戶',
    en: 'Back to My Account',
  },
  step1: {
    ja: '第一歩：不調部位を選択',
    'zh-CN': '第一步：选择不适部位',
    'zh-TW': '第一步：選擇不適部位',
    en: 'Step 1: Select Affected Areas',
  },
  clickBodyMap: {
    ja: '人体図をクリックして症状部位を選択',
    'zh-CN': '点击人体图选择症状部位',
    'zh-TW': '點擊人體圖選擇症狀部位',
    en: 'Click body map to select symptom areas',
  },
  preciseDiagnosis: {
    ja: 'これにより、AIがより正確に問診フローをカスタマイズします',
    'zh-CN': '这将帮助 AI 更精准地为您定制问诊流程',
    'zh-TW': '這將幫助 AI 更精準地為您定制問診流程',
    en: 'This helps AI customize questionnaire more precisely',
  },
  aiScreeningTitle: {
    ja: 'AI スマート健康スクリーニング',
    'zh-CN': 'AI 智能健康筛查',
    'zh-TW': 'AI 智能健康篩查',
    en: 'AI Smart Health Screening',
  },
  upgradeDesc: {
    ja: '全面刷新！人体図インタラクションで不調部位を選択。AIが症状に基づき医療科を推奨し、プロフェッショナルな健康評価レポートを生成します',
    'zh-CN': '全新升级！通过人体图交互选择不适部位，AI 根据您的症状智能推荐检查科室，并生成专业健康评估报告',
    'zh-TW': '全新升級！通過人體圖交互選擇不適部位，AI 根據您的症狀智能推薦檢查科室，並生成專業健康評估報告',
    en: 'Brand new upgrade! Select affected areas via body map interaction, AI recommends medical departments and generates professional health assessment report',
  },
  creating: {
    ja: '作成中...',
    'zh-CN': '正在创建...',
    'zh-TW': '正在創建...',
    en: 'Creating...',
  },
  startScreening: {
    ja: 'スマートスクリーニング開始',
    'zh-CN': '开始智能筛查',
    'zh-TW': '開始智能篩查',
    en: 'Start Smart Screening',
  },
  limitReached: {
    ja: '今月の無料スクリーニング回数を使い切りました。来月1日に自動的にリセットされます',
    'zh-CN': '本月免费筛查次数已用完，下月1日将自动重置',
    'zh-TW': '本月免費篩查次數已用完，下月1日將自動重置',
    en: 'Monthly free screenings used up. Will reset on the 1st of next month',
  },
  viewHistory: {
    ja: '履歴を見る',
    'zh-CN': '查看历史记录',
    'zh-TW': '查看歷史記錄',
    en: 'View History',
  },
  newFeatures: {
    ja: '全面刷新機能',
    'zh-CN': '全新升级功能',
    'zh-TW': '全新升級功能',
    en: 'New Upgraded Features',
  },
  bodyMapInteraction: {
    ja: '人体図インタラクション',
    'zh-CN': '人体图交互',
    'zh-TW': '人體圖交互',
    en: 'Body Map Interaction',
  },
  bodyMapDesc: {
    ja: '直感的にクリックして不調部位を選択、文字で説明する必要がありません',
    'zh-CN': '直观点击选择不适部位，无需文字描述',
    'zh-TW': '直觀點擊選擇不適部位，無需文字描述',
    en: 'Intuitively select affected areas, no text description needed',
  },
  smartDeptRecommend: {
    ja: 'スマート診療科推奨',
    'zh-CN': '智能科室推荐',
    'zh-TW': '智能科室推薦',
    en: 'Smart Department Recommendation',
  },
  smartDeptDesc: {
    ja: 'AIが症状に対応する医療科を自動的に関連付けます',
    'zh-CN': 'AI 自动关聯症状对應的医疗科室',
    'zh-TW': 'AI 自動關聯症狀對應的醫療科室',
    en: 'AI automatically associates symptoms with medical departments',
  },
  dynamicQuestionnaire: {
    ja: 'ダイナミック問診',
    'zh-CN': '动态问诊',
    'zh-TW': '動態問診',
    en: 'Dynamic Questionnaire',
  },
  dynamicDesc: {
    ja: '症状に基づき問診内容を自動調整',
    'zh-CN': '根据症状智能调整问诊问题',
    'zh-TW': '根據症狀智能調整問診問題',
    en: 'Intelligently adjust questions based on symptoms',
  },
  pdfReport: {
    ja: 'PDFレポート',
    'zh-CN': 'PDF 报告',
    'zh-TW': 'PDF 報告',
    en: 'PDF Report',
  },
  pdfDesc: {
    ja: '精美な健康評価レポートを生成してダウンロード可能',
    'zh-CN': '生成精美健康评估报告可下载',
    'zh-TW': '生成精美健康評估報告可下載',
    en: 'Generate downloadable health assessment report',
  },
  privacyProtection: {
    ja: 'プライバシー保護',
    'zh-CN': '隐私保护',
    'zh-TW': '隱私保護',
    en: 'Privacy Protection',
  },
  privacyDesc: {
    ja: 'あなたの健康データは安全に暗号化され、個人のみ閲覧可能です',
    'zh-CN': '您的健康数据安全加密存储，仅供您个人查看',
    'zh-TW': '您的健康數據安全加密存儲，僅供您個人查看',
    en: 'Your health data is securely encrypted and viewable only by you',
  },
  aiAnalysis: {
    ja: 'AI スマート分析',
    'zh-CN': 'AI 智能分析',
    'zh-TW': 'AI 智能分析',
    en: 'AI Smart Analysis',
  },
  aiAnalysisDesc: {
    ja: '先進的なAIモデルに基づき、プロフェッショナルな健康評価を提供',
    'zh-CN': '基于先进 AI 模型，为您提供专业的健康评估',
    'zh-TW': '基於先進 AI 模型，為您提供專業的健康評估',
    en: 'Professional health assessment based on advanced AI models',
  },
  japanMedicalRecommend: {
    ja: '日本医療推奨',
    'zh-CN': '日本医疗推荐',
    'zh-TW': '日本醫療推薦',
    en: 'Japan Medical Recommendation',
  },
  japanMedicalDesc: {
    ja: 'あなたの状況に基づき、日本のトップクラスの医療機関を推奨',
    'zh-CN': '根据您的情况推荐日本顶尖医疗机构',
    'zh-TW': '根據您的情況推薦日本頂尖醫療機構',
    en: 'Recommend top Japanese medical institutions based on your condition',
  },
  aiFollowup: {
    ja: 'AI 補充問診',
    'zh-CN': 'AI 补充问诊',
    'zh-TW': 'AI 補充問診',
    en: 'AI Follow-up Questions',
  },
  followupTitle: {
    ja: '以下の補足質問にお答えください',
    'zh-CN': '请回答以下补充问题',
    'zh-TW': '請回答以下補充問題',
    en: 'Please answer the following questions',
  },
  followupDesc: {
    ja: 'より正確な健康分析のため、AIが追加情報を必要としています',
    'zh-CN': 'AI 需要更多信息以提供更准确的健康分析',
    'zh-TW': 'AI 需要更多資訊以提供更準確的健康分析',
    en: 'AI needs more information to provide a more accurate health analysis',
  },
  orUploadDoc: {
    ja: 'または診断書をアップロード',
    'zh-CN': '或上传诊断书',
    'zh-TW': '或上傳診斷書',
    en: 'Or upload medical document',
  },
  uploadDocTitle: {
    ja: '診断書・検査報告書アップロード',
    'zh-CN': '上传诊断书/检查报告',
    'zh-TW': '上傳診斷書/檢查報告',
    en: 'Upload Medical Document',
  },
  uploadDocDesc: {
    ja: 'お手持ちの診断書や検査報告書をアップロードすると、AIが自動的に情報を抽出して分析します',
    'zh-CN': '上传您的诊断书或检查报告，AI 将自动提取信息并进行分析',
    'zh-TW': '上傳您的診斷書或檢查報告，AI 將自動提取資訊並進行分析',
    en: 'Upload your medical report or test results, AI will automatically extract and analyze',
  },
  analyzeDoc: {
    ja: 'アップロード済み文書で分析開始',
    'zh-CN': '使用已上传文档开始分析',
    'zh-TW': '使用已上傳文檔開始分析',
    en: 'Start analysis with uploaded document',
  },
  orContinueQuestionnaire: {
    ja: 'さらに問診を受ける（推奨）',
    'zh-CN': '继续填写问卷补充信息（推荐）',
    'zh-TW': '繼續填寫問卷補充資訊（推薦）',
    en: 'Continue with questionnaire for more info (recommended)',
  },
  analyzing: {
    ja: '分析中...',
    'zh-CN': '分析中...',
    'zh-TW': '分析中...',
    en: 'Analyzing...',
  },
  analyzingPatience: {
    ja: 'AI が資料を詳しく分析しています。通常 30 秒〜1 分ほどかかります。画面を閉じないでください。',
    'zh-CN': 'AI 正在详细分析您的资料，通常需要 30 秒至 1 分钟，请勿关闭页面。',
    'zh-TW': 'AI 正在詳細分析您的資料，通常需要 30 秒至 1 分鐘，請勿關閉頁面。',
    en: 'AI is analyzing your data in detail. This usually takes 30 seconds to 1 minute. Please do not close the page.',
  },
  reportLanguage: {
    ja: 'レポート言語',
    'zh-CN': '报告语言',
    'zh-TW': '報告語言',
    en: 'Report language',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

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

type ScreeningStep = 'welcome' | 'body-map' | 'questionnaire' | 'followup' | 'upload-document';

// ==================== Step Header ====================
function StepHeader({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">{label}</span>
        </button>
      </div>
    </div>
  );
}

// ==================== Step Title Section ====================
function StepTitleSection({ badge, badgeIcon: BadgeIcon, title, subtitle }: {
  badge: string;
  badgeIcon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-50 text-brand-700 border border-neutral-200 text-sm mb-4">
          <BadgeIcon className="w-4 h-4" />
          <span>{badge}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif text-brand-900 tracking-wide">
          {title}
        </h1>
        <p className="text-neutral-500 mt-2">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function HealthScreeningPage() {
  const lang = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScreeningData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<ScreeningStep>('welcome');
  const [bodyMapData, setBodyMapData] = useState<BodyMapSelectionData | null>(null);
  const [followupQuestions, setFollowupQuestions] = useState<string[]>([]);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const [reportLang, setReportLang] = useState<Language>('zh-CN');

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
          throw new Error(errorData.error || t('loadError', lang));
        }

        const result = await response.json();

        const pendingScreening = result.screenings?.find(
          (s: any) => s.status === 'in_progress' || s.status === 'needs_followup'
        );

        if (pendingScreening) {
          const detailResponse = await fetch(
            `/api/health-screening/${pendingScreening.id}`
          );
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            setData({
              freeRemaining: result.freeRemaining,
              existingScreening: {
                id: pendingScreening.id,
                status: pendingScreening.status,
                answers: detailData.screening.answers || [],
                bodyMapData: detailData.screening.bodyMapData,
              },
            });
            if (pendingScreening.status === 'needs_followup' && detailData.screening.followupQuestions) {
              setBodyMapData(detailData.screening.bodyMapData || null);
              setFollowupQuestions(detailData.screening.followupQuestions);
              setCurrentStep('followup');
            } else if (detailData.screening.bodyMapData) {
              setBodyMapData(detailData.screening.bodyMapData);
              setCurrentStep('questionnaire');
            }
          } else {
            setData({ freeRemaining: result.freeRemaining });
          }
        } else {
          setData({ freeRemaining: result.freeRemaining });
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

  const startNewScreening = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/health-screening', { method: 'POST' });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('createError', lang));
      }

      const result = await response.json();
      setData({
        screeningId: result.screeningId,
        freeRemaining: result.freeRemaining,
      });
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

  const handleBackToBodyMap = () => {
    setCurrentStep('body-map');
  };

  const handleFollowupRequired = (_screeningId: string, questions: string[]) => {
    setFollowupQuestions(questions);
    setCurrentStep('followup');
  };

  const startWithDocumentUpload = async () => {
    if (data?.existingScreening) {
      setCurrentStep('upload-document');
      return;
    }
    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch('/api/health-screening', { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('createError', lang));
      }
      const result = await response.json();
      setData({
        screeningId: result.screeningId,
        freeRemaining: result.freeRemaining,
      });
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
    const screeningId = data?.screeningId || data?.existingScreening?.id;
    if (!screeningId) return;

    setIsAnalyzingDoc(true);
    setError(null);
    try {
      const response = await fetch('/api/health-screening/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId, phase: 2, language: reportLang }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('服务器暂时不可用，请稍后重试');
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result._debug ? `${result.error} [${result._debug}]` : (result.error || '分析失败'));

      if (result.needsFollowup && result.followupQuestions) {
        setFollowupQuestions(result.followupQuestions);
        setCurrentStep('followup');
      } else {
        router.push(`/health-screening/result/${screeningId}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  // ==================== Render Content ====================
  const renderContent = () => {
    // Loading
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-700 mx-auto mb-4" />
            <p className="text-neutral-500 text-sm">{t('loading', lang)}</p>
          </div>
        </div>
      );
    }

    // Follow-up step
    if (currentStep === 'followup' && (data?.screeningId || data?.existingScreening)) {
      const screeningId = data!.screeningId || data!.existingScreening?.id!;
      return (
        <div className="min-h-screen bg-white">
          <StepHeader onBack={() => setCurrentStep('body-map')} label={t('backToSymptoms', lang)} />
          <StepTitleSection
            badge={t('aiFollowup', lang)}
            badgeIcon={Sparkles}
            title={t('followupTitle', lang)}
            subtitle={t('followupDesc', lang)}
          />
          <div className="max-w-4xl mx-auto px-4 pb-16">
            <FollowUpQuestionnaire
              screeningId={screeningId}
              questions={followupQuestions}
            />
          </div>
        </div>
      );
    }

    // Questionnaire step
    if (currentStep === 'questionnaire' && (data?.screeningId || data?.existingScreening)) {
      const screeningId = data!.screeningId || data!.existingScreening?.id!;
      const initialAnswers = data!.existingScreening?.answers || [];
      return (
        <div className="min-h-screen bg-white">
          <StepHeader onBack={handleBackToBodyMap} label={t('backToSymptoms', lang)} />
          <div className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-50 text-brand-700 border border-neutral-200 text-sm mb-4">
                <Shield className="w-4 h-4" />
                <span>{t('freeRemaining', lang)} {data!.freeRemaining} {lang === 'ja' ? '回' : lang === 'en' ? '' : '次'}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-brand-900 tracking-wide">
                {t('aiQuestionnaire', lang)}
              </h1>
              <p className="text-neutral-500 mt-2">
                {t('customizedFlow', lang)}
              </p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 pb-16">
            <DynamicScreeningForm
              screeningId={screeningId}
              initialAnswers={initialAnswers}
              bodyMapData={bodyMapData || undefined}
              onFollowupRequired={handleFollowupRequired}
            />
          </div>
        </div>
      );
    }

    // Document upload step
    if (currentStep === 'upload-document' && (data?.screeningId || data?.existingScreening)) {
      const screeningId = data!.screeningId || data!.existingScreening?.id!;
      return (
        <div className="min-h-screen bg-white">
          <StepHeader onBack={() => setCurrentStep('welcome')} label={t('backToAccount', lang)} />
          <StepTitleSection
            badge={t('uploadDocTitle', lang)}
            badgeIcon={Upload}
            title={t('uploadDocTitle', lang)}
            subtitle={t('uploadDocDesc', lang)}
          />
          <div className="max-w-2xl mx-auto px-4 py-8">
            <DocumentUpload
              screeningId={screeningId}
              language={lang}
              onUploadSuccess={handleDocumentUploadSuccess}
              onRemove={() => setDocumentUploaded(false)}
            />

            {documentUploaded && (
              <div className="mt-8 space-y-3">
                {/* Report language selector */}
                <div className="flex items-center justify-center gap-2 p-3 bg-neutral-50 border border-neutral-200">
                  <Globe className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">{t('reportLanguage', lang)}:</span>
                  <div className="flex gap-1">
                    {([
                      { code: 'zh-CN' as Language, label: '简体中文' },
                      { code: 'zh-TW' as Language, label: '繁體中文' },
                      { code: 'ja' as Language, label: '日本語' },
                      { code: 'en' as Language, label: 'English' },
                    ]).map(({ code, label }) => (
                      <button
                        key={code}
                        onClick={() => setReportLang(code)}
                        className={`px-3 py-1 text-xs transition-colors ${
                          reportLang === code
                            ? 'bg-brand-900 text-white'
                            : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
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
                  className="w-full px-6 py-4 bg-gold-400 hover:bg-gold-300 text-brand-900 text-lg font-medium tracking-wider transition-colors disabled:opacity-50"
                >
                  {isAnalyzingDoc ? (
                    <span className="flex flex-col items-center gap-2">
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('analyzing', lang)}
                      </span>
                      <span className="text-xs text-brand-900/70 font-normal">
                        {t('analyzingPatience', lang)}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {t('analyzeDoc', lang)}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentStep('body-map')}
                  className="w-full px-6 py-3 border border-neutral-200 text-brand-700 hover:bg-neutral-50 transition-colors text-sm"
                >
                  {t('orContinueQuestionnaire', lang)}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Body map step
    if (currentStep === 'body-map' && (data?.screeningId || data?.existingScreening)) {
      return (
        <div className="min-h-screen bg-white">
          <div className="bg-white border-b border-neutral-200">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <Link
                href="/my-account"
                className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">{t('backToAccount', lang)}</span>
              </Link>
            </div>
          </div>
          <StepTitleSection
            badge={t('step1', lang)}
            badgeIcon={Activity}
            title={t('clickBodyMap', lang)}
            subtitle={t('preciseDiagnosis', lang)}
          />
          <div className="max-w-4xl mx-auto px-4 pb-16">
            <BodyMapSelector
              onComplete={handleBodyMapComplete}
              onBack={() => setCurrentStep('welcome')}
            />
          </div>
        </div>
      );
    }

    // ==================== Welcome Page ====================
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-brand-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20" />
            <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400" />
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">AI HEALTH SCREENING</span>
              <div className="h-[1px] w-12 bg-gold-400" />
            </div>

            <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl text-white mb-6 leading-tight">
              {t('aiScreeningTitle', lang)}
            </h1>

            <p className="text-lg text-neutral-300 leading-relaxed font-light mb-10 max-w-2xl mx-auto">
              {t('upgradeDesc', lang)}
            </p>

            {/* Free remaining badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-400/10 text-gold-400 border border-gold-400/30 text-sm mb-10">
              <Sparkles className="w-4 h-4" />
              <span>
                {t('freeRemaining', lang)} {data?.freeRemaining ?? FREE_SCREENING_LIMIT} {lang === 'ja' ? '回' : lang === 'en' ? '' : '次'}
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 max-w-md mx-auto text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* CTA */}
            {(data?.freeRemaining ?? FREE_SCREENING_LIMIT) > 0 ? (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={startNewScreening}
                  disabled={isCreating}
                  className="px-10 py-4 bg-gold-400 hover:bg-gold-300 text-brand-900 text-lg font-medium tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('creating', lang)}
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5" />
                      {t('startScreening', lang)}
                    </>
                  )}
                </button>
                <button
                  onClick={startWithDocumentUpload}
                  disabled={isCreating}
                  className="px-8 py-3 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {t('orUploadDoc', lang)}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-neutral-300 mb-4">{t('limitReached', lang)}</p>
                <Link
                  href="/health-screening/history"
                  className="text-gold-400 hover:text-gold-300"
                >
                  {t('viewHistory', lang)}
                </Link>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <Link
                href="/health-screening/history"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {t('viewHistory', lang)} →
              </Link>
            </div>
          </div>
        </section>

        {/* New Features */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-8 bg-gold-400" />
                <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">FEATURES</span>
                <div className="h-[1px] w-8 bg-gold-400" />
              </div>
              <h2 className="text-2xl font-serif text-brand-900">{t('newFeatures', lang)}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Activity, title: t('bodyMapInteraction', lang), desc: t('bodyMapDesc', lang) },
                { icon: Users, title: t('smartDeptRecommend', lang), desc: t('smartDeptDesc', lang) },
                { icon: Sparkles, title: t('dynamicQuestionnaire', lang), desc: t('dynamicDesc', lang) },
                { icon: FileText, title: t('pdfReport', lang), desc: t('pdfDesc', lang) },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="border border-neutral-200 p-5 hover:bg-neutral-50/50 transition-colors">
                  <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-700" />
                  </div>
                  <h3 className="font-semibold text-brand-900 mb-2">{title}</h3>
                  <p className="text-neutral-500 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="pb-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: t('privacyProtection', lang), desc: t('privacyDesc', lang) },
                { icon: Sparkles, title: t('aiAnalysis', lang), desc: t('aiAnalysisDesc', lang) },
                { icon: Heart, title: t('japanMedicalRecommend', lang), desc: t('japanMedicalDesc', lang) },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="border border-neutral-200 p-6">
                  <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-700" />
                  </div>
                  <h3 className="font-semibold text-brand-900 mb-2">{title}</h3>
                  <p className="text-neutral-500 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      {renderContent()}
    </PublicLayout>
  );
}
