/**
 * 健康筛查表单 Hook
 * 统一的状态管理、自动保存、错误处理
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ScreeningAnswer, ScreeningQuestion } from '@/lib/screening-questions';
import {
  SCREENING_CONFIG,
  saveDraftToLocal,
  loadDraftFromLocal,
  clearDraftFromLocal,
  fetchWithTimeout,
  getSafeErrorMessage,
  updateAnswer,
  isValidAnswer,
  calculateProgress,
  setupBeforeUnloadWarning,
} from '@/lib/screening-utils';

// ============================================
// 类型定义
// ============================================

export interface UseScreeningFormOptions {
  screeningId: string;
  initialAnswers?: ScreeningAnswer[];
  questions: ScreeningQuestion[];
  onComplete?: () => void;
  autoSave?: boolean;
}

export interface UseScreeningFormReturn {
  // 状态
  answers: ScreeningAnswer[];
  currentQuestionIndex: number;
  currentAnswer: string | string[];
  currentNote: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';

  // 计算属性
  progress: number;
  currentQuestion: ScreeningQuestion | undefined;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  canProceed: boolean;

  // 操作方法
  setCurrentAnswer: (answer: string | string[]) => void;
  setCurrentNote: (note: string) => void;
  handleSingleSelect: (option: string) => void;
  handleMultiSelect: (option: string) => void;
  handleTextInput: (text: string) => void;
  goToNextQuestion: () => Promise<void>;
  goToPrevQuestion: () => void;
  goToQuestion: (index: number) => void;
  saveAnswers: () => Promise<boolean>;
  submitForAnalysis: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// Hook 实现
// ============================================

export function useScreeningForm({
  screeningId,
  initialAnswers = [],
  questions,
  onComplete,
  autoSave = true,
}: UseScreeningFormOptions): UseScreeningFormReturn {
  // 核心状态
  const [answers, setAnswers] = useState<ScreeningAnswer[]>(initialAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('');
  const [currentNote, setCurrentNote] = useState('');

  // UI 状态
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Refs
  const hasUnsavedChanges = useRef(false);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // 当前问题
  const currentQuestion = questions[currentQuestionIndex];

  // 计算属性
  const progress = calculateProgress(answers, questions.length);
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = isValidAnswer(currentAnswer);

  // ============================================
  // 初始化
  // ============================================

  // 加载已保存的答案
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = answers.find(a => a.questionId === currentQuestion.id);
      if (existingAnswer) {
        setCurrentAnswer(existingAnswer.answer);
        setCurrentNote(existingAnswer.note || '');
      } else {
        setCurrentAnswer(currentQuestion.type === 'multi' ? [] : '');
        setCurrentNote('');
      }
    }
  }, [currentQuestionIndex, currentQuestion, answers]);

  // 尝试恢复本地草稿
  useEffect(() => {
    const localDraft = loadDraftFromLocal(screeningId);
    if (localDraft && localDraft.length > initialAnswers.length) {
      setAnswers(localDraft);
    }
  }, [screeningId, initialAnswers.length]);

  // 设置离开警告
  useEffect(() => {
    const cleanup = setupBeforeUnloadWarning(() => hasUnsavedChanges.current);
    return cleanup;
  }, []);

  // 自动保存
  useEffect(() => {
    if (!autoSave) return;

    if (autoSaveTimer.current) {
      clearInterval(autoSaveTimer.current);
    }

    autoSaveTimer.current = setInterval(() => {
      if (hasUnsavedChanges.current) {
        saveAnswers();
      }
    }, SCREENING_CONFIG.AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current);
      }
    };
  }, [autoSave]);

  // ============================================
  // 选择处理
  // ============================================

  const handleSingleSelect = useCallback((option: string) => {
    setCurrentAnswer(option);
    hasUnsavedChanges.current = true;
  }, []);

  const handleMultiSelect = useCallback((option: string) => {
    setCurrentAnswer(prev => {
      const prevArray = Array.isArray(prev) ? prev : [];
      if (prevArray.includes(option)) {
        return prevArray.filter(o => o !== option);
      } else {
        return [...prevArray, option];
      }
    });
    hasUnsavedChanges.current = true;
  }, []);

  const handleTextInput = useCallback((text: string) => {
    // 限制长度
    const sanitized = text.substring(0, SCREENING_CONFIG.MAX_TEXT_LENGTH);
    setCurrentAnswer(sanitized);
    hasUnsavedChanges.current = true;
  }, []);

  // ============================================
  // 保存逻辑
  // ============================================

  const saveAnswers = useCallback(async (): Promise<boolean> => {
    if (!currentQuestion || !screeningId) return false;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      // 更新本地状态
      const newAnswers = updateAnswer(
        answers,
        currentQuestion.id,
        currentQuestion.question,
        currentAnswer,
        currentNote
      );
      setAnswers(newAnswers);

      // 保存到 LocalStorage（即时备份）
      saveDraftToLocal(screeningId, newAnswers);

      // 保存到服务器
      const response = await fetchWithTimeout(
        `/api/health-screening/${screeningId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      hasUnsavedChanges.current = false;
      setSaveStatus('saved');

      // 3秒后重置状态
      setTimeout(() => setSaveStatus('idle'), 3000);

      return true;
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
      setError(getSafeErrorMessage(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [screeningId, currentQuestion, answers, currentAnswer, currentNote]);

  // ============================================
  // 导航逻辑
  // ============================================

  const goToNextQuestion = useCallback(async () => {
    // 先保存当前答案
    const saved = await saveAnswers();
    if (!saved) return;

    if (isLastQuestion) {
      // 最后一题，提交分析
      await submitForAnalysis();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [isLastQuestion, saveAnswers]);

  const goToPrevQuestion = useCallback(() => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [isFirstQuestion]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  // ============================================
  // 提交分析
  // ============================================

  const submitForAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithTimeout(
        '/api/health-screening/analyze',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ screeningId }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || '分析請求失敗');
      }

      // 清除本地草稿
      clearDraftFromLocal(screeningId);

      // 触发完成回调
      onComplete?.();
    } catch (err) {
      console.error('Analysis error:', err);
      setError(getSafeErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [screeningId, onComplete]);

  // ============================================
  // 工具方法
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // 返回值
  // ============================================

  return {
    // 状态
    answers,
    currentQuestionIndex,
    currentAnswer,
    currentNote,
    isLoading,
    isSaving,
    error,
    saveStatus,

    // 计算属性
    progress,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    canProceed,

    // 操作方法
    setCurrentAnswer,
    setCurrentNote,
    handleSingleSelect,
    handleMultiSelect,
    handleTextInput,
    goToNextQuestion,
    goToPrevQuestion,
    goToQuestion,
    saveAnswers,
    submitForAnalysis,
    clearError,
  };
}
