/**
 * 健康筛查工具函数
 * 统一的输入验证、错误处理、自动保存等功能
 */

import { ScreeningAnswer } from './screening-questions';

// ============================================
// 常量配置
// ============================================

export const SCREENING_CONFIG = {
  MAX_TEXT_LENGTH: 500,           // 文本输入最大长度
  MAX_NOTE_LENGTH: 200,           // 备注最大长度
  AUTO_SAVE_INTERVAL: 10000,      // 自动保存间隔（毫秒）
  API_TIMEOUT: 30000,             // API 超时时间
  LOCAL_STORAGE_KEY: 'screening_draft_', // 本地存储前缀
} as const;

// ============================================
// 输入验证
// ============================================

/**
 * 验证并清理文本输入
 */
export function sanitizeTextInput(text: string, maxLength: number = SCREENING_CONFIG.MAX_TEXT_LENGTH): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .substring(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // 移除控制字符
    .trim();
}

/**
 * 验证答案是否有效
 */
export function isValidAnswer(answer: string | string[] | undefined): boolean {
  if (answer === undefined || answer === null) {
    return false;
  }

  if (Array.isArray(answer)) {
    return answer.length > 0 && answer.some(a => a.trim().length > 0);
  }

  return typeof answer === 'string' && answer.trim().length > 0;
}

/**
 * 计算完成进度
 */
export function calculateProgress(answers: ScreeningAnswer[], totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  const answeredCount = answers.filter(a => isValidAnswer(a.answer)).length;
  return Math.round((answeredCount / totalQuestions) * 100);
}

// ============================================
// 本地存储（防丢失）
// ============================================

/**
 * 保存草稿到 LocalStorage
 */
export function saveDraftToLocal(screeningId: string, answers: ScreeningAnswer[]): void {
  try {
    const key = SCREENING_CONFIG.LOCAL_STORAGE_KEY + screeningId;
    const data = {
      answers,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    // LocalStorage 可能不可用或已满
    console.warn('Failed to save draft to localStorage:', error);
  }
}

/**
 * 从 LocalStorage 恢复草稿
 */
export function loadDraftFromLocal(screeningId: string): ScreeningAnswer[] | null {
  try {
    const key = SCREENING_CONFIG.LOCAL_STORAGE_KEY + screeningId;
    const data = localStorage.getItem(key);
    if (!data) return null;

    const parsed = JSON.parse(data);
    // 验证数据有效性
    if (parsed && Array.isArray(parsed.answers)) {
      return parsed.answers;
    }
    return null;
  } catch (error) {
    console.warn('Failed to load draft from localStorage:', error);
    return null;
  }
}

/**
 * 清除本地草稿
 */
export function clearDraftFromLocal(screeningId: string): void {
  try {
    const key = SCREENING_CONFIG.LOCAL_STORAGE_KEY + screeningId;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear draft from localStorage:', error);
  }
}

// ============================================
// API 请求工具
// ============================================

/**
 * 带超时的 fetch 请求
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = SCREENING_CONFIG.API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 安全的错误消息（不暴露敏感信息）
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // 网络错误
    if (error.name === 'AbortError') {
      return '請求超時，請稍後重試';
    }
    if (error.message.includes('fetch')) {
      return '網絡連接失敗，請檢查網絡';
    }
  }

  // 通用错误消息
  return '操作失敗，請稍後重試';
}

// ============================================
// 答案处理
// ============================================

/**
 * 合并答案（用于恢复草稿时）
 */
export function mergeAnswers(
  serverAnswers: ScreeningAnswer[],
  localAnswers: ScreeningAnswer[]
): ScreeningAnswer[] {
  const merged = new Map<number, ScreeningAnswer>();

  // 先添加服务器答案
  serverAnswers.forEach(a => merged.set(a.questionId, a));

  // 用本地答案覆盖（如果更新）
  localAnswers.forEach(a => {
    const existing = merged.get(a.questionId);
    if (!existing || !isValidAnswer(existing.answer)) {
      merged.set(a.questionId, a);
    }
  });

  return Array.from(merged.values());
}

/**
 * 更新单个答案
 */
export function updateAnswer(
  answers: ScreeningAnswer[],
  questionId: number,
  question: string,
  newAnswer: string | string[],
  note?: string
): ScreeningAnswer[] {
  const existingIndex = answers.findIndex(a => a.questionId === questionId);
  const sanitizedAnswer = Array.isArray(newAnswer)
    ? newAnswer.map(a => sanitizeTextInput(a))
    : sanitizeTextInput(newAnswer);
  const sanitizedNote = note ? sanitizeTextInput(note, SCREENING_CONFIG.MAX_NOTE_LENGTH) : undefined;

  const newAnswerObj: ScreeningAnswer = {
    questionId,
    question,
    answer: sanitizedAnswer,
    note: sanitizedNote,
  };

  if (existingIndex >= 0) {
    const updated = [...answers];
    updated[existingIndex] = newAnswerObj;
    return updated;
  } else {
    return [...answers, newAnswerObj];
  }
}

// ============================================
// 离开警告
// ============================================

/**
 * 设置离开页面警告
 */
export function setupBeforeUnloadWarning(hasUnsavedChanges: () => boolean): () => void {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '您有未保存的答案，確定要離開嗎？';
      return e.returnValue;
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  // 返回清理函数
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}

// ============================================
// 风险等级样式
// ============================================

export const RISK_LEVEL_CONFIG = {
  low: {
    label: '低風險',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: '✓',
  },
  medium: {
    label: '中度風險',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: '⚠',
  },
  high: {
    label: '高風險',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '⚡',
  },
} as const;

export type RiskLevel = keyof typeof RISK_LEVEL_CONFIG;
