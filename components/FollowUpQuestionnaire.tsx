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
      setError('请回答所有补充问题后再提交');
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
      if (!response.ok) throw new Error(data.error || '提交失败');

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
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试');
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
        answer: '未提供',
      }));

      const response = await fetch('/api/health-screening/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId, followupAnswers }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '提交失败');

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
      setError(err instanceof Error ? err.message : '操作失败，请稍后重试');
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
            AI 需要一些补充信息
            {followupRound > 1 && ` (第 ${followupRound} 轮)`}
          </span>
        </div>
        <p className="text-sm text-amber-700">
          为了提供更准确的健康分析，AI 希望了解以下补充信息。
          回答越详细，分析结果越精准。
        </p>
      </div>

      {/* 进度 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-500">
            已回答 {answeredCount} / {currentQuestions.length} 题
          </span>
          {allAnswered && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              全部完成
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
              placeholder="请在此输入您的回答..."
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
          跳过补充信息，直接查看结果
        </button>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting}
          className="order-1 sm:order-2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI 重新分析中...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              提交补充信息
            </>
          )}
        </button>
      </div>

      <p className="text-center text-sm text-neutral-400 mt-6">
        补充信息将帮助 AI 提供更精准的健康评估
      </p>
    </div>
  );
}
