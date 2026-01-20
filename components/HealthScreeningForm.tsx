'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  SCREENING_QUESTIONS,
  CATEGORY_NAMES,
  TOTAL_QUESTIONS,
  ScreeningQuestion,
  ScreeningAnswer,
} from '@/lib/screening-questions';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface HealthScreeningFormProps {
  screeningId: string;
  initialAnswers?: ScreeningAnswer[];
}

export default function HealthScreeningForm({
  screeningId,
  initialAnswers = [],
}: HealthScreeningFormProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ScreeningAnswer[]>(initialAnswers);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('');
  const [currentNote, setCurrentNote] = useState('');
  const [inputFields, setInputFields] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = SCREENING_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;

  // 加载已有答案到当前问题
  useEffect(() => {
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
    let answerValue: string | string[] = currentAnswer;

    // 处理多字段输入
    if (currentQuestion.type === 'input' && currentQuestion.fields) {
      answerValue = currentQuestion.fields
        .map((field) => inputFields[field] || '')
        .join(' / ');
    }

    // 检查答案是否有效
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
    async (answersToSave: ScreeningAnswer[]) => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/health-screening/${screeningId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: answersToSave }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || '保存失敗');
        }
      } catch (err: unknown) {
        // 不记录详细错误信息到控制台，避免泄露敏感信息
        console.warn('Save operation failed');
        setError('保存失敗，請稍後重試');
      } finally {
        setIsSaving(false);
      }
    },
    [screeningId]
  );

  // 下一题
  const handleNext = async () => {
    if (!saveCurrentAnswer()) {
      setError('請回答當前問題');
      return;
    }

    setError(null);

    // 保存到服务器
    const updatedAnswers = [
      ...answers.filter((a) => a.questionId !== currentQuestion.id),
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer:
          currentQuestion.type === 'input' && currentQuestion.fields
            ? currentQuestion.fields
                .map((field) => inputFields[field] || '')
                .join(' / ')
            : currentAnswer,
        ...(currentNote && { note: currentNote }),
      },
    ];

    await saveToServer(updatedAnswers);

    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
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

  // 提交分析
  const handleSubmit = async () => {
    if (!saveCurrentAnswer()) {
      setError('請回答當前問題');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // 先保存最后一个答案
      const finalAnswers = [
        ...answers.filter((a) => a.questionId !== currentQuestion.id),
        {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          answer:
            currentQuestion.type === 'input' && currentQuestion.fields
              ? currentQuestion.fields
                  .map((field) => inputFields[field] || '')
                  .join(' / ')
              : currentAnswer,
          ...(currentNote && { note: currentNote }),
        },
      ];

      await saveToServer(finalAnswers);

      // 触发 AI 分析
      const response = await fetch('/api/health-screening/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '分析失敗');
      }

      // 跳转到结果页
      router.push(`/health-screening/result/${screeningId}`);
    } catch (err: unknown) {
      // 不记录详细错误信息到控制台
      console.warn('Analysis submission failed');
      setError('分析請求失敗，請稍後重試');
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

      // 如果选择了"无"，清除其他选项
      if (value === 'none') {
        return ['none'];
      }

      // 如果选择了其他选项，移除"无"
      const filtered = arr.filter((v) => v !== 'none');

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
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
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
          <p className="text-sm text-gray-500 mb-2">可選擇多個選項</p>
          {question.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleMultiSelect(option.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
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
                  placeholder={`請輸入${field}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      );
    }

    return null;
  };

  // 检查是否可以进入下一题
  const canProceed = () => {
    if (currentQuestion.type === 'input' && currentQuestion.fields) {
      return currentQuestion.fields.every((field) => inputFields[field]?.trim());
    }
    if (currentQuestion.type === 'multi') {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return typeof currentAnswer === 'string' && currentAnswer.trim() !== '';
  };

  const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            問題 {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
          </span>
          <span className="text-sm text-gray-500">
            {CATEGORY_NAMES[currentQuestion.category]}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 问题卡片 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        {renderOptions(currentQuestion)}

        {/* 备注输入框 */}
        {currentQuestion.hasNote && currentAnswer === 'yes' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              請補充說明
            </label>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="請描述詳細情況..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          上一題
        </button>

        {isSaving && (
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            自動保存中...
          </span>
        )}

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI 分析中...
              </>
            ) : (
              <>
                提交並獲取分析
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            下一題
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 保存提示 */}
      <p className="text-center text-sm text-gray-400 mt-6">
        您的答案會自動保存，可隨時返回繼續作答
      </p>
    </div>
  );
}
