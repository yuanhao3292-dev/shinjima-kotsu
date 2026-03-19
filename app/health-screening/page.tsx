'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

export default function HealthScreeningPage() {
  const lang = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScreeningData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<ScreeningStep>('welcome');
  const [bodyMapData, setBodyMapData] = useState<BodyMapSelectionData | null>(null);
  // [Phase 3] 补问系统状态
  const [followupQuestions, setFollowupQuestions] = useState<string[]>([]);
  // [Phase 4] 文档上传状态
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  // 报告语言（独立于网站 UI 语言）
  const [reportLang, setReportLang] = useState<Language>('zh-CN');

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
          throw new Error(errorData.error || t('loadError', lang));
        }

        const result = await response.json();

        // 检查是否有未完成的筛查（in_progress 或 needs_followup）
        const pendingScreening = result.screenings?.find(
          (s: any) => s.status === 'in_progress' || s.status === 'needs_followup'
        );

        if (pendingScreening) {
          // 获取详细答案
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
            // [Phase 3] 如果状态是 needs_followup，直接显示补问界面
            if (pendingScreening.status === 'needs_followup' && detailData.screening.followupQuestions) {
              setBodyMapData(detailData.screening.bodyMapData || null);
              setFollowupQuestions(detailData.screening.followupQuestions);
              setCurrentStep('followup');
            } else if (detailData.screening.bodyMapData) {
              // 如果有已保存的 bodyMapData，恢复到问卷步骤
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
        throw new Error(errorData.error || t('createError', lang));
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

  // [Phase 3] AEMC 安全闸门 Class B → 显示补问界面
  const handleFollowupRequired = (_screeningId: string, questions: string[]) => {
    setFollowupQuestions(questions);
    setCurrentStep('followup');
  };

  // [Phase 4] 开始文档上传流程
  const startWithDocumentUpload = async () => {
    if (data?.existingScreening) {
      setCurrentStep('upload-document');
      return;
    }
    // 先创建筛查记录
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

  // [Phase 4] 文档上传成功
  const handleDocumentUploadSuccess = (_result: UploadResult) => {
    setDocumentUploaded(true);
  };

  // [Phase 4] 仅用文档触发分析
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
      if (!response.ok) throw new Error(result.error || '分析失败');

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

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  // [Phase 3] 补问界面
  if (currentStep === 'followup' && (data?.screeningId || data?.existingScreening)) {
    const screeningId = data.screeningId || data.existingScreening?.id!;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
        {/* Header */}
        <div className="bg-white border-b border-neutral-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setCurrentStep('body-map')}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{t('backToSymptoms', lang)}</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="bg-gradient-to-b from-white to-amber-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{t('aiFollowup', lang)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 tracking-wide">
              {t('followupTitle', lang)}
            </h1>
            <p className="text-neutral-500 mt-2">
              {t('followupDesc', lang)}
            </p>
          </div>
        </div>

        {/* Follow-up Form */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <FollowUpQuestionnaire
            screeningId={screeningId}
            questions={followupQuestions}
          />
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
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{t('backToSymptoms', lang)}</span>
            </button>
          </div>
        </div>

        {/* Progress Info */}
        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
              <Shield className="w-4 h-4" />
              <span>{t('freeRemaining', lang)} {data.freeRemaining} {lang === 'ja' ? '回' : lang === 'en' ? '' : '次'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 tracking-wide">
              {t('aiQuestionnaire', lang)}
            </h1>
            <p className="text-neutral-500 mt-2">
              {t('customizedFlow', lang)}
            </p>
          </div>
        </div>

        {/* Form */}
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

  // [Phase 4] 文档上传步骤
  if (currentStep === 'upload-document' && (data?.screeningId || data?.existingScreening)) {
    const screeningId = data.screeningId || data.existingScreening?.id!;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setCurrentStep('welcome')}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{t('backToAccount', lang)}</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-100 text-medical-700 rounded-full text-sm mb-4">
              <Upload className="w-4 h-4" />
              <span>{t('uploadDocTitle', lang)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 tracking-wide">
              {t('uploadDocTitle', lang)}
            </h1>
            <p className="text-neutral-500 mt-2">
              {t('uploadDocDesc', lang)}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <DocumentUpload
            screeningId={screeningId}
            language={lang}
            onUploadSuccess={handleDocumentUploadSuccess}
            onRemove={() => setDocumentUploaded(false)}
          />

          {documentUploaded && (
            <div className="mt-8 space-y-3">
              {/* 报告语言选择器 */}
              <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{t('reportLanguage', lang)}:</span>
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
                  <span className="flex flex-col items-center gap-2">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('analyzing', lang)}
                    </span>
                    <span className="text-xs text-white/70 font-normal">
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
                className="w-full px-6 py-3 border-2 border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50 transition-colors text-sm"
              >
                {t('orContinueQuestionnaire', lang)}
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

  // 人体图选择步骤
  if (currentStep === 'body-map' && (data?.screeningId || data?.existingScreening)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
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

        {/* Progress Info */}
        <div className="bg-gradient-to-b from-white to-blue-50/30 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
              <Activity className="w-4 h-4" />
              <span>{t('step1', lang)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 tracking-wide">
              {t('clickBodyMap', lang)}
            </h1>
            <p className="text-neutral-500 mt-2">
              {t('preciseDiagnosis', lang)}
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
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t('backToAccount', lang)}</span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-white to-blue-50/30 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg shadow-blue-200">
            <Heart className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 tracking-wide mb-4">
            {t('aiScreeningTitle', lang)}
          </h1>

          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            {t('upgradeDesc', lang)}
          </p>

          {/* 免费次数提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 text-green-700 rounded-full text-sm mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>
              {t('freeRemaining', lang)} {data?.freeRemaining ?? FREE_SCREENING_LIMIT} {lang === 'ja' ? '回' : lang === 'en' ? '' : '次'}
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
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={startNewScreening}
                disabled={isCreating}
                className="px-10 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-lg font-medium rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 transform hover:-translate-y-0.5"
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('creating', lang)}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    {t('startScreening', lang)}
                  </span>
                )}
              </button>
              <button
                onClick={startWithDocumentUpload}
                disabled={isCreating}
                className="px-8 py-3 border-2 border-medical-300 text-medical-700 rounded-xl hover:bg-medical-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {t('orUploadDoc', lang)}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">{t('limitReached', lang)}</p>
              <Link
                href="/health-screening/history"
                className="text-blue-600 hover:underline"
              >
                {t('viewHistory', lang)}
              </Link>
            </div>
          )}

          {/* 快捷链接 */}
          <div className="flex justify-center gap-4 mt-6">
            <Link
              href="/health-screening/history"
              className="text-sm text-neutral-500 hover:text-brand-900 transition-colors"
            >
              {t('viewHistory', lang)} →
            </Link>
          </div>
        </div>
      </div>

      {/* 新功能亮点 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {t('newFeatures', lang)}
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">{t('bodyMapInteraction', lang)}</h3>
            <p className="text-neutral-500 text-sm">
              {t('bodyMapDesc', lang)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">{t('smartDeptRecommend', lang)}</h3>
            <p className="text-neutral-500 text-sm">
              {t('smartDeptDesc', lang)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">{t('dynamicQuestionnaire', lang)}</h3>
            <p className="text-neutral-500 text-sm">
              {t('dynamicDesc', lang)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">{t('pdfReport', lang)}</h3>
            <p className="text-neutral-500 text-sm">
              {t('pdfDesc', lang)}
            </p>
          </div>
        </div>
      </div>

      {/* 原有功能特性 */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">{t('privacyProtection', lang)}</h3>
            <p className="text-neutral-500 text-sm">
              {t('privacyDesc', lang)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">{t('aiAnalysis', lang)}</h3>
            <p className="text-neutral-500 text-sm">
              {t('aiAnalysisDesc', lang)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">{t('japanMedicalRecommend', lang)}</h3>
            <p className="text-neutral-500 text-sm">
              {t('japanMedicalDesc', lang)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
