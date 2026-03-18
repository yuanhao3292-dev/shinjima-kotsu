'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  SCREENING_QUESTIONS,
  CATEGORY_NAMES,
  CATEGORY_ICONS,
  PHASE_1_QUESTIONS,
  getPhase1Questions,
  getPhase2QuestionsByBodyParts,
  ScreeningQuestion,
  ScreeningAnswer,
} from '@/lib/screening-questions';
import { type BodyMapSelectionData } from './BodyMapSelector';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  FileText,
  Globe,
} from 'lucide-react';

const translations: Record<string, Record<Language, string>> = {
  saveFailed: {
    ja: '保存に失敗しました',
    'zh-CN': '保存失败',
    'zh-TW': '保存失敗',
    en: 'Save failed',
  },
  saveFailedRetry: {
    ja: '保存に失敗しました。しばらくしてからもう一度お試しください',
    'zh-CN': '保存失败，请稍后重试',
    'zh-TW': '保存失敗，請稍後重試',
    en: 'Save failed. Please try again later',
  },
  pleaseAnswerCurrentQuestion: {
    ja: '現在の質問にお答えください',
    'zh-CN': '请回答当前问题',
    'zh-TW': '請回答當前問題',
    en: 'Please answer the current question',
  },
  analysisFailed: {
    ja: '分析に失敗しました',
    'zh-CN': '分析失败',
    'zh-TW': '分析失敗',
    en: 'Analysis failed',
  },
  analysisFailedRetry: {
    ja: '分析リクエストに失敗しました。しばらくしてからもう一度お試しください',
    'zh-CN': '分析请求失败，请稍后重试',
    'zh-TW': '分析請求失敗，請稍後重試',
    en: 'Analysis request failed. Please try again later',
  },
  canSelectMultiple: {
    ja: '複数選択可能',
    'zh-CN': '可选择多个选项',
    'zh-TW': '可選擇多個選項',
    en: 'You can select multiple options',
  },
  pleaseEnter: {
    ja: 'を入力してください',
    'zh-CN': '请输入',
    'zh-TW': '請輸入',
    en: 'Please enter ',
  },
  quickScreeningComplete: {
    ja: 'クイックスクリーニング完了！',
    'zh-CN': '快速筛查完成！',
    'zh-TW': '快速篩查完成！',
    en: 'Quick screening complete!',
  },
  phase1CompleteDesc: {
    ja: '10問のクイックスクリーニングが完了しました。次の操作をお選びください：',
    'zh-CN': '您已完成 10 道快速筛查问题。现在您可以选择：',
    'zh-TW': '您已完成 10 道快速篩查問題。現在您可以選擇：',
    en: 'You have completed 10 quick screening questions. Now you can choose:',
  },
  getResultsNow: {
    ja: '今すぐ結果を取得',
    'zh-CN': '立即获取结果',
    'zh-TW': '立即獲取結果',
    en: 'Get results now',
  },
  getResultsNowDesc: {
    ja: 'ご回答いただいた内容に基づき、初期の健康アドバイスと推奨検査項目を生成します',
    'zh-CN': '根据已回答的问题，立即生成初步健康建议和推荐检查项目',
    'zh-TW': '根據已回答的問題，立即生成初步健康建議和推薦檢查項目',
    en: 'Generate preliminary health recommendations and suggested examinations based on your answers',
  },
  aiAnalyzing: {
    ja: 'AI 分析中...',
    'zh-CN': 'AI 分析中...',
    'zh-TW': 'AI 分析中...',
    en: 'AI analyzing...',
  },
  continueInDepth: {
    ja: '詳細問診を続ける',
    'zh-CN': '继续深度问诊',
    'zh-TW': '繼續深度問診',
    en: 'Continue in-depth consultation',
  },
  continueInDepthDesc: {
    ja: 'さらに {n} 問に回答して、より詳細で正確な健康分析レポートを取得します',
    'zh-CN': '再回答 {n} 道问题，获得更详细、更精准的健康分析报告',
    'zh-TW': '再回答 {n} 道問題，獲得更詳細、更精準的健康分析報告',
    en: 'Answer {n} more questions to receive a more detailed and accurate health analysis report',
  },
  recommended: {
    ja: 'おすすめ',
    'zh-CN': '推荐',
    'zh-TW': '推薦',
    en: 'Recommended',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  quickScreening: {
    ja: 'クイックスクリーニング',
    'zh-CN': '快速筛查',
    'zh-TW': '快速篩查',
    en: 'Quick Screening',
  },
  phase1: {
    ja: '（第1段階）',
    'zh-CN': '（第一阶段）',
    'zh-TW': '（第一階段）',
    en: '(Phase 1)',
  },
  inDepthConsultation: {
    ja: '詳細問診',
    'zh-CN': '深度问诊',
    'zh-TW': '深度問診',
    en: 'In-depth Consultation',
  },
  phase2: {
    ja: '（第2段階）',
    'zh-CN': '（第二阶段）',
    'zh-TW': '（第二階段）',
    en: '(Phase 2)',
  },
  totalQuestions: {
    ja: '全 {n} 問',
    'zh-CN': '共 {n} 题',
    'zh-TW': '共 {n} 題',
    en: '{n} questions total',
  },
  phase1Hint: {
    ja: '完了後すぐに初期アドバイスを取得するか、詳細問診を続けることができます',
    'zh-CN': '完成后可立即获取初步建议，或继续深度问诊',
    'zh-TW': '完成後可立即獲取初步建議，或繼續深度問診',
    en: 'After completion, you can get preliminary recommendations or continue with in-depth consultation',
  },
  smartConsultation: {
    ja: 'スマート問診モード',
    'zh-CN': '智能问诊模式',
    'zh-TW': '智能問診模式',
    en: 'Smart consultation mode',
  },
  smartConsultationDesc: {
    ja: 'お選びいただいた不調部位に基づき、AIが詳細問診の流れを最適化しました',
    'zh-CN': '根据您选择的不适部位，AI 已为您优化深度问诊流程',
    'zh-TW': '根據您選擇的不適部位，AI 已為您優化深度問診流程',
    en: 'Based on the areas of discomfort you selected, AI has optimized the in-depth consultation process for you',
  },
  questionProgress: {
    ja: '質問 {n} / {total}',
    'zh-CN': '问题 {n} / {total}',
    'zh-TW': '問題 {n} / {total}',
    en: 'Question {n} / {total}',
  },
  pleaseProvideDetails: {
    ja: '詳細をご記入ください',
    'zh-CN': '请补充说明',
    'zh-TW': '請補充說明',
    en: 'Please provide details',
  },
  describeInDetail: {
    ja: '詳しい状況をご記入ください...',
    'zh-CN': '请描述详细情况...',
    'zh-TW': '請描述詳細情況...',
    en: 'Please describe in detail...',
  },
  previousQuestion: {
    ja: '前の質問',
    'zh-CN': '上一题',
    'zh-TW': '上一題',
    en: 'Previous',
  },
  autoSaving: {
    ja: '自動保存中...',
    'zh-CN': '自动保存中...',
    'zh-TW': '自動保存中...',
    en: 'Auto-saving...',
  },
  completeQuickScreening: {
    ja: 'クイックスクリーニングを完了',
    'zh-CN': '完成快速筛查',
    'zh-TW': '完成快速篩查',
    en: 'Complete quick screening',
  },
  submitAndGetReport: {
    ja: '送信して完全レポートを取得',
    'zh-CN': '提交并获取完整报告',
    'zh-TW': '提交並獲取完整報告',
    en: 'Submit and get full report',
  },
  nextQuestion: {
    ja: '次の質問',
    'zh-CN': '下一题',
    'zh-TW': '下一題',
    en: 'Next',
  },
  autoSaveHint: {
    ja: '回答は自動保存されます。いつでも戻って続きから回答できます',
    'zh-CN': '您的答案会自动保存，可随时返回继续作答',
    'zh-TW': '您的答案會自動保存，可隨時返回繼續作答',
    en: 'Your answers are auto-saved. You can return anytime to continue',
  },
  reportLanguage: {
    ja: 'レポート言語',
    'zh-CN': '报告语言',
    'zh-TW': '報告語言',
    en: 'Report language',
  },
};

interface DynamicScreeningFormProps {
  screeningId: string;
  initialAnswers?: ScreeningAnswer[];
  bodyMapData?: BodyMapSelectionData;
  /** [Phase 3] 当 AEMC 需要补问时触发 */
  onFollowupRequired?: (screeningId: string, questions: string[]) => void;
}

export default function DynamicScreeningForm({
  screeningId,
  initialAnswers = [],
  bodyMapData,
  onFollowupRequired,
}: DynamicScreeningFormProps) {
  const router = useRouter();
  const lang = useLanguage();
  const t = (key: string) => (translations as any)[key]?.[lang] || (translations as any)[key]?.['ja'] || key;
  const [reportLang, setReportLang] = useState<Language>(lang);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ScreeningAnswer[]>(initialAnswers);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('');
  const [currentNote, setCurrentNote] = useState('');
  const [inputFields, setInputFields] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 当前阶段：1 = 快速筛查, 2 = 深度问诊
  const [currentPhase, setCurrentPhase] = useState<1 | 2>(1);
  // 是否显示阶段过渡界面
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);

  // 获取当前阶段的问题
  const currentPhaseQuestions = useMemo((): ScreeningQuestion[] => {
    if (currentPhase === 1) {
      return getPhase1Questions();
    } else {
      const bodyPartIds = bodyMapData?.selectedBodyParts || [];
      return getPhase2QuestionsByBodyParts(bodyPartIds);
    }
  }, [currentPhase, bodyMapData]);

  const currentQuestion = currentPhaseQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentPhaseQuestions.length) * 100;

  // 加载已有答案到当前问题
  useEffect(() => {
    if (!currentQuestion) return;

    const existingAnswer = answers.find(
      (a) => a.questionId === currentQuestion.id
    );
    if (existingAnswer) {
      setCurrentAnswer(existingAnswer.answer);
      setCurrentNote(existingAnswer.note || '');
      if (currentQuestion.type === 'input' && currentQuestion.fields) {
        const fieldValues: Record<string, string> = {};
        const answerStr =
          typeof existingAnswer.answer === 'string'
            ? existingAnswer.answer
            : '';
        const parts = answerStr.split(' / ');
        currentQuestion.fields.forEach((field, idx) => {
          fieldValues[field] = parts[idx] || '';
        });
        setInputFields(fieldValues);
      }
    } else {
      setCurrentAnswer(currentQuestion.type === 'multi' ? [] : '');
      setCurrentNote('');
      setInputFields({});
    }
  }, [currentQuestionIndex, answers, currentQuestion]);

  // 保存当前答案到 answers 数组
  const saveCurrentAnswer = useCallback(() => {
    if (!currentQuestion) return false;

    let answerValue: string | string[] = currentAnswer;

    if (currentQuestion.type === 'input' && currentQuestion.fields) {
      answerValue = currentQuestion.fields
        .map((field) => inputFields[field] || '')
        .join(' / ');
    }

    const isValid =
      (typeof answerValue === 'string' && answerValue.trim() !== '') ||
      (Array.isArray(answerValue) && answerValue.length > 0);

    if (!isValid) return false;

    const newAnswer: ScreeningAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: answerValue,
      ...(currentNote && { note: currentNote }),
    };

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });

    return true;
  }, [currentAnswer, currentNote, currentQuestion, inputFields]);

  // 保存到服务器
  const saveToServer = useCallback(
    async (answersToSave: ScreeningAnswer[], bodyMapDataToSave?: BodyMapSelectionData) => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/health-screening/${screeningId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: answersToSave,
            bodyMapData: bodyMapDataToSave,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || t('saveFailed'));
        }
      } catch (err: unknown) {
        // 不记录详细错误信息
        console.warn('Save operation failed');
        setError(t('saveFailedRetry'));
      } finally {
        setIsSaving(false);
      }
    },
    [screeningId, t]
  );

  // 构建更新后的答案数组
  const buildUpdatedAnswers = useCallback(() => {
    return [
      ...answers.filter((a) => a.questionId !== currentQuestion?.id),
      ...(currentQuestion ? [{
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer:
          currentQuestion.type === 'input' && currentQuestion.fields
            ? currentQuestion.fields
                .map((field) => inputFields[field] || '')
                .join(' / ')
            : currentAnswer,
        ...(currentNote && { note: currentNote }),
      }] : []),
    ];
  }, [answers, currentQuestion, inputFields, currentAnswer, currentNote]);

  // 下一题
  const handleNext = async () => {
    if (!saveCurrentAnswer()) {
      setError(t('pleaseAnswerCurrentQuestion'));
      return;
    }

    setError(null);
    const updatedAnswers = buildUpdatedAnswers();
    await saveToServer(updatedAnswers, bodyMapData);

    if (currentQuestionIndex < currentPhaseQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // 上一题
  const handlePrevious = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // 完成第一阶段，显示过渡界面
  const handlePhase1Complete = async () => {
    if (!saveCurrentAnswer()) {
      setError(t('pleaseAnswerCurrentQuestion'));
      return;
    }

    setError(null);
    const updatedAnswers = buildUpdatedAnswers();
    setAnswers(updatedAnswers);
    await saveToServer(updatedAnswers, bodyMapData);

    setShowPhaseTransition(true);
  };

  // 选择获取快速结果（仅第一阶段）
  const handleGetQuickResult = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/health-screening/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId, phase: 1, language: reportLang }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('analysisFailed'));

      // [Phase 3] 检查是否需要补问
      if (data.needsFollowup && data.followupQuestions?.length > 0 && onFollowupRequired) {
        onFollowupRequired(screeningId, data.followupQuestions);
        return;
      }

      router.push(`/health-screening/result/${screeningId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('analysisFailedRetry');
      console.warn('Quick analysis submission failed:', msg);
      setError(msg);
      setIsSubmitting(false);
    }
  };

  // 选择继续深度问诊
  const handleContinueToPhase2 = () => {
    setShowPhaseTransition(false);
    setCurrentPhase(2);
    setCurrentQuestionIndex(0);
  };

  // 提交完整分析（第二阶段完成）
  const handleSubmitFull = async () => {
    if (!saveCurrentAnswer()) {
      setError(t('pleaseAnswerCurrentQuestion'));
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const finalAnswers = buildUpdatedAnswers();
      await saveToServer(finalAnswers, bodyMapData);

      const response = await fetch('/api/health-screening/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId, phase: 2, language: reportLang }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('analysisFailed'));

      // [Phase 3] 检查是否需要补问
      if (data.needsFollowup && data.followupQuestions?.length > 0 && onFollowupRequired) {
        onFollowupRequired(screeningId, data.followupQuestions);
        return;
      }

      router.push(`/health-screening/result/${screeningId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('analysisFailedRetry');
      console.warn('Full analysis submission failed:', msg);
      setError(msg);
      setIsSubmitting(false);
    }
  };

  // 处理单选
  const handleSingleSelect = (value: string) => {
    setCurrentAnswer(value);
    setError(null);
  };

  // 处理多选
  const handleMultiSelect = (value: string) => {
    setCurrentAnswer((prev) => {
      const arr = Array.isArray(prev) ? prev : [];

      if (value === 'none' || value === 'normal') {
        return [value];
      }

      const filtered = arr.filter((v) => v !== 'none' && v !== 'normal');

      if (filtered.includes(value)) {
        return filtered.filter((v) => v !== value);
      } else {
        return [...filtered, value];
      }
    });
    setError(null);
  };

  // 处理输入字段
  const handleInputChange = (field: string, value: string) => {
    setInputFields((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // 处理文本输入
  const handleTextInput = (value: string) => {
    setCurrentAnswer(value);
    setError(null);
  };

  // 渲染题目选项
  const renderOptions = (question: ScreeningQuestion) => {
    if (question.type === 'single') {
      return (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSingleSelect(option.value)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                currentAnswer === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option.value
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {currentAnswer === option.value && (
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (question.type === 'multi') {
      const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-2">{t('canSelectMultiple')}</p>
          {question.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleMultiSelect(option.value)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                selectedValues.includes(option.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedValues.includes(option.value)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedValues.includes(option.value) && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (question.type === 'input') {
      if (question.fields) {
        return (
          <div className="space-y-4">
            {question.fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field}
                </label>
                <input
                  type="text"
                  value={inputFields[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={lang === 'ja' ? `${field}${t('pleaseEnter')}` : `${t('pleaseEnter')}${field}`}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        );
      }

      return (
        <textarea
          value={typeof currentAnswer === 'string' ? currentAnswer : ''}
          onChange={(e) => handleTextInput(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      );
    }

    return null;
  };

  // 检查是否可以进入下一题
  const canProceed = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'input' && currentQuestion.fields) {
      return currentQuestion.fields.every((field) => inputFields[field]?.trim());
    }
    if (currentQuestion.type === 'multi') {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return typeof currentAnswer === 'string' && currentAnswer.trim() !== '';
  };

  const isLastQuestionInPhase = currentQuestionIndex === currentPhaseQuestions.length - 1;
  const categoryIcon = currentQuestion ? (CATEGORY_ICONS[currentQuestion.category] || '📋') : '📋';

  // 阶段过渡界面
  if (showPhaseTransition) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-serif font-semibold text-neutral-900 tracking-wide mb-4">
            {t('quickScreeningComplete')}
          </h2>

          <p className="text-gray-600 mb-6">
            {t('phase1CompleteDesc')}
          </p>

          {/* 报告语言选择器 */}
          <div className="flex items-center justify-center gap-2 mb-8 p-3 bg-gray-50 rounded-xl">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t('reportLanguage')}:</span>
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

          <div className="grid md:grid-cols-2 gap-4">
            {/* 获取快速结果 */}
            <button
              onClick={handleGetQuickResult}
              disabled={isSubmitting}
              className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">{t('getResultsNow')}</span>
              </div>
              <p className="text-sm text-gray-600">
                {t('getResultsNowDesc')}
              </p>
              {isSubmitting && (
                <div className="flex items-center gap-2 mt-3 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t('aiAnalyzing')}</span>
                </div>
              )}
            </button>

            {/* 继续深度问诊 */}
            <button
              onClick={handleContinueToPhase2}
              disabled={isSubmitting}
              className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">{t('continueInDepth')}</span>
              </div>
              <p className="text-sm text-gray-600">
                {t('continueInDepthDesc').replace('{n}', String(getPhase2QuestionsByBodyParts(bodyMapData?.selectedBodyParts || []).length))}
              </p>
              <div className="mt-3">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {t('recommended')}
                </span>
              </div>
            </button>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 加载状态
  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 阶段提示 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentPhase === 1 ? (
              <>
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700">{t('quickScreening')}</span>
                <span className="text-sm text-blue-500">{t('phase1')}</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">{t('inDepthConsultation')}</span>
                <span className="text-sm text-green-500">{t('phase2')}</span>
              </>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {t('totalQuestions').replace('{n}', String(currentPhaseQuestions.length))}
          </span>
        </div>
        {currentPhase === 1 && (
          <p className="text-sm text-blue-600 mt-2">
            {t('phase1Hint')}
          </p>
        )}
      </div>

      {/* 人体图数据提示 */}
      {bodyMapData && bodyMapData.selectedBodyParts.length > 0 && currentPhase === 2 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-700">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">{t('smartConsultation')}</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            {t('smartConsultationDesc')}
          </p>
        </div>
      )}

      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            {t('questionProgress').replace('{n}', String(currentQuestionIndex + 1)).replace('{total}', String(currentPhaseQuestions.length))}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <span>{categoryIcon}</span>
            {CATEGORY_NAMES[currentQuestion.category]}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              currentPhase === 1
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 问题卡片 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-serif font-semibold text-neutral-900 tracking-wide mb-6">
          {currentQuestion.question}
        </h2>

        {renderOptions(currentQuestion)}

        {/* 备注输入框 */}
        {currentQuestion.hasNote &&
          (currentAnswer === 'yes' || currentAnswer === 'other') && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pleaseProvideDetails')}
              </label>
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder={t('describeInDetail')}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          )}

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* 报告语言选择器（仅在最后一题显示） */}
      {isLastQuestionInPhase && currentPhase === 2 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{t('reportLanguage')}:</span>
          <div className="flex gap-1 flex-wrap">
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
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 导航按钮 */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-neutral-500 hover:text-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('previousQuestion')}
        </button>

        {isSaving && (
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('autoSaving')}
          </span>
        )}

        {isLastQuestionInPhase ? (
          currentPhase === 1 ? (
            <button
              onClick={handlePhase1Complete}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t('completeQuickScreening')}
              <CheckCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitFull}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('aiAnalyzing')}
                </>
              ) : (
                <>
                  {t('submitAndGetReport')}
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          )
        ) : (
          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              currentPhase === 1
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {t('nextQuestion')}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 保存提示 */}
      <p className="text-center text-sm text-gray-400 mt-6">
        {t('autoSaveHint')}
      </p>
    </div>
  );
}
