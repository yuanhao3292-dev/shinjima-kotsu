'use client';

/**
 * 补问问卷组件 (Phase 3)
 *
 * 当 AEMC 安全闸门判定为 Class B（缺失关键信息），
 * 显示 AI 生成的追问问题，收集用户回答后重新分析。
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Loader2,
  Send,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const translations = {
  answerAllRequired: {
    'zh-CN': '请回答所有补充问题后再提交',
    'zh-TW': '請回答所有補充問題後再提交',
    ja: 'すべての補足質問にご回答のうえ、送信してください',
    en: 'Please answer all supplementary questions before submitting',
  },
  submitFailed: {
    'zh-CN': '提交失败',
    'zh-TW': '提交失敗',
    ja: '送信に失敗しました',
    en: 'Submission failed',
  },
  submitFailedRetry: {
    'zh-CN': '提交失败，请稍后重试',
    'zh-TW': '提交失敗，請稍後重試',
    ja: '送信に失敗しました。しばらくしてから再度お試しください',
    en: 'Submission failed. Please try again later',
  },
  notProvided: {
    'zh-CN': '未提供',
    'zh-TW': '未提供',
    ja: '未回答',
    en: 'Not provided',
  },
  actionFailedRetry: {
    'zh-CN': '操作失败，请稍后重试',
    'zh-TW': '操作失敗，請稍後重試',
    ja: '操作に失敗しました。しばらくしてから再度お試しください',
    en: 'Operation failed. Please try again later',
  },
  aiNeedsInfo: {
    'zh-CN': 'AI 需要一些补充信息',
    'zh-TW': 'AI 需要一些補充資訊',
    ja: 'AIが補足情報を必要としています',
    en: 'AI requires additional information',
  },
  roundN: {
    'zh-CN': ' (第 {{round}} 轮)',
    'zh-TW': ' (第 {{round}} 輪)',
    ja: ' (第{{round}}回)',
    en: ' (Round {{round}})',
  },
  aiNeedsInfoDesc: {
    'zh-CN': '为了提供更准确的健康分析，AI 希望了解以下补充信息。回答越详细，分析结果越精准。',
    'zh-TW': '為了提供更準確的健康分析，AI 希望了解以下補充資訊。回答越詳細，分析結果越精準。',
    ja: 'より正確な健康分析を提供するため、AIは以下の補足情報を必要としています。回答が詳しいほど、分析結果がより正確になります。',
    en: 'To provide a more accurate health analysis, the AI would like to gather the following supplementary information. The more detailed your answers, the more precise the analysis will be.',
  },
  answeredProgress: {
    'zh-CN': '已回答 {{answered}} / {{total}} 题',
    'zh-TW': '已回答 {{answered}} / {{total}} 題',
    ja: '回答済み {{answered}} / {{total}} 問',
    en: '{{answered}} / {{total}} answered',
  },
  allDone: {
    'zh-CN': '全部完成',
    'zh-TW': '全部完成',
    ja: 'すべて完了',
    en: 'All done',
  },
  answerPlaceholder: {
    'zh-CN': '请在此输入您的回答...',
    'zh-TW': '請在此輸入您的回答...',
    ja: 'こちらにご回答を入力してください...',
    en: 'Please enter your answer here...',
  },
  skipFollowup: {
    'zh-CN': '跳过补充信息，直接查看结果',
    'zh-TW': '跳過補充資訊，直接查看結果',
    ja: '補足情報をスキップして結果を表示する',
    en: 'Skip supplementary questions and view results',
  },
  aiReanalyzing: {
    'zh-CN': 'AI 重新分析中...',
    'zh-TW': 'AI 重新分析中...',
    ja: 'AIが再分析中です...',
    en: 'AI is re-analyzing...',
  },
  submitFollowup: {
    'zh-CN': '提交补充信息',
    'zh-TW': '提交補充資訊',
    ja: '補足情報を送信する',
    en: 'Submit supplementary information',
  },
  followupHelp: {
    'zh-CN': '补充信息将帮助 AI 提供更精准的健康评估',
    'zh-TW': '補充資訊將幫助 AI 提供更精準的健康評估',
    ja: '補足情報はAIがより正確な健康評価を提供するのに役立ちます',
    en: 'Supplementary information will help AI provide a more precise health assessment',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string =>
  translations[key][lang];

interface FollowUpQuestionnaireProps {
  screeningId: string;
  questions: string[];
}

interface FollowupAnswer {
  question: string;
  answer: string;
}

export default function FollowUpQuestionnaire({
  screeningId,
  questions,
}: FollowUpQuestionnaireProps) {
  const router = useRouter();
  const lang = useLanguage();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 追问可能返回新的追问（第二轮）
  const [currentQuestions, setCurrentQuestions] = useState(questions);
  const [followupRound, setFollowupRound] = useState(1);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
    setError(null);
  };

  const answeredCount = Object.values(answers).filter((a) => a.trim()).length;
  const allAnswered = answeredCount === currentQuestions.length;

  const handleSubmit = async () => {
    if (!allAnswered) {
      setError(t('answerAllRequired', lang));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const followupAnswers: FollowupAnswer[] = currentQuestions.map((q, i) => ({
        question: q,
        answer: answers[i] || '',
      }));

      const response = await fetch('/api/health-screening/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId, followupAnswers }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('submitFailed', lang));

      if (data.needsFollowup && data.followupQuestions?.length > 0) {
        // 还需要更多追问（第二轮）
        setCurrentQuestions(data.followupQuestions);
        setAnswers({});
        setFollowupRound((r) => r + 1);
        setIsSubmitting(false);
      } else {
        // 分析完成
        router.push(`/health-screening/result/${screeningId}`);
      }
    } catch (err: unknown) {
      console.warn('Followup submission failed');
      setError(err instanceof Error ? err.message : t('submitFailedRetry', lang));
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    // 跳过补问，直接完成分析（使用现有结果）
    setIsSubmitting(true);
    setError(null);

    try {
      // 提交空答案让系统完成
      const followupAnswers: FollowupAnswer[] = currentQuestions.map((q) => ({
        question: q,
        answer: t('notProvided', lang),
      }));

      const response = await fetch('/api/health-screening/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId, followupAnswers }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('submitFailed', lang));

      // [AUDIT-FIX] 检查是否还需追问（防止 redirect loop）
      if (data.needsFollowup && data.followupQuestions?.length > 0) {
        setCurrentQuestions(data.followupQuestions);
        setAnswers({});
        setFollowupRound((r) => r + 1);
        setIsSubmitting(false);
      } else {
        router.push(`/health-screening/result/${screeningId}`);
      }
    } catch (err: unknown) {
      console.warn('Followup skip failed');
      setError(err instanceof Error ? err.message : t('actionFailedRetry', lang));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 提示横幅 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <span className="font-medium text-amber-800">
            {t('aiNeedsInfo', lang)}
            {followupRound > 1 && t('roundN', lang).replace('{{round}}', String(followupRound))}
          </span>
        </div>
        <p className="text-sm text-amber-700">
          {t('aiNeedsInfoDesc', lang)}
        </p>
      </div>

      {/* 进度 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-500">
            {t('answeredProgress', lang)
              .replace('{{answered}}', String(answeredCount))
              .replace('{{total}}', String(currentQuestions.length))}
          </span>
          {allAnswered && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {t('allDone', lang)}
            </span>
          )}
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
            style={{ width: `${(answeredCount / currentQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 问题列表 */}
      <div className="space-y-6 mb-8">
        {currentQuestions.map((question, index) => (
          <div
            key={`${followupRound}-${index}`}
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-amber-700">{index + 1}</span>
              </div>
              <h3 className="text-base font-medium text-neutral-900">{question}</h3>
            </div>
            <textarea
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={t('answerPlaceholder', lang)}
              rows={3}
              className="w-full p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none text-neutral-800 placeholder:text-neutral-400"
              disabled={isSubmitting}
            />
          </div>
        ))}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <button
          onClick={handleSkip}
          disabled={isSubmitting}
          className="order-2 sm:order-1 text-neutral-500 hover:text-neutral-700 text-sm disabled:opacity-50"
        >
          {t('skipFollowup', lang)}
        </button>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting}
          className="order-1 sm:order-2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('aiReanalyzing', lang)}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t('submitFollowup', lang)}
            </>
          )}
        </button>
      </div>

      <p className="text-center text-sm text-neutral-400 mt-6">
        {t('followupHelp', lang)}
      </p>
    </div>
  );
}
