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
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  FileText,
} from 'lucide-react';

interface DynamicScreeningFormProps {
  screeningId: string;
  initialAnswers?: ScreeningAnswer[];
  bodyMapData?: BodyMapSelectionData;
}

export default function DynamicScreeningForm({
  screeningId,
  initialAnswers = [],
  bodyMapData,
}: DynamicScreeningFormProps) {
  const router = useRouter();
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
          throw new Error(data.error || '保存失敗');
        }
      } catch (err: unknown) {
        // 不记录详细错误信息
        console.warn('Save operation failed');
        setError('保存失敗，請稍後重試');
      } finally {
        setIsSaving(false);
      }
    },
    [screeningId]
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
      setError('請回答當前問題');
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
      setError('請回答當前問題');
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
        body: JSON.stringify({ screeningId, phase: 1 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '分析失敗');

      router.push(`/health-screening/result/${screeningId}`);
    } catch (err: unknown) {
      console.warn('Quick analysis submission failed');
      setError('分析請求失敗，請稍後重試');
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
      setError('請回答當前問題');
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
        body: JSON.stringify({ screeningId, phase: 2 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '分析失敗');

      router.push(`/health-screening/result/${screeningId}`);
    } catch (err: unknown) {
      console.warn('Full analysis submission failed');
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
          <p className="text-sm text-gray-500 mb-2">可選擇多個選項</p>
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
                  placeholder={`請輸入${field}`}
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

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            快速篩查完成！
          </h2>

          <p className="text-gray-600 mb-8">
            您已完成 10 道快速篩查問題。現在您可以選擇：
          </p>

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
                <span className="font-semibold text-gray-900">立即獲取結果</span>
              </div>
              <p className="text-sm text-gray-600">
                根據已回答的問題，立即生成初步健康建議和推薦檢查項目
              </p>
              {isSubmitting && (
                <div className="flex items-center gap-2 mt-3 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI 分析中...</span>
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
                <span className="font-semibold text-gray-900">繼續深度問診</span>
              </div>
              <p className="text-sm text-gray-600">
                再回答 {getPhase2QuestionsByBodyParts(bodyMapData?.selectedBodyParts || []).length} 道問題，獲得更詳細、更精準的健康分析報告
              </p>
              <div className="mt-3">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  推薦
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
        <p className="text-gray-500">載入中...</p>
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
                <span className="font-medium text-blue-700">快速篩查</span>
                <span className="text-sm text-blue-500">（第一階段）</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">深度問診</span>
                <span className="text-sm text-green-500">（第二階段）</span>
              </>
            )}
          </div>
          <span className="text-sm text-gray-500">
            共 {currentPhaseQuestions.length} 題
          </span>
        </div>
        {currentPhase === 1 && (
          <p className="text-sm text-blue-600 mt-2">
            完成後可立即獲取初步建議，或繼續深度問診
          </p>
        )}
      </div>

      {/* 人体图数据提示 */}
      {bodyMapData && bodyMapData.selectedBodyParts.length > 0 && currentPhase === 2 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-700">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">智能問診模式</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            根據您選擇的不適部位，AI 已為您優化深度問診流程
          </p>
        </div>
      )}

      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            問題 {currentQuestionIndex + 1} / {currentPhaseQuestions.length}
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        {renderOptions(currentQuestion)}

        {/* 备注输入框 */}
        {currentQuestion.hasNote &&
          (currentAnswer === 'yes' || currentAnswer === 'other') && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                請補充說明
              </label>
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="請描述詳細情況..."
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

        {isLastQuestionInPhase ? (
          currentPhase === 1 ? (
            <button
              onClick={handlePhase1Complete}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              完成快速篩查
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
                  AI 分析中...
                </>
              ) : (
                <>
                  提交並獲取完整報告
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
