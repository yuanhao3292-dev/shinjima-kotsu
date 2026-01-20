/**
 * 輸入清理和驗證工具
 * 防止 Prompt 注入攻擊
 */

import { ScreeningAnswer } from '@/lib/screening-questions';
import { MAX_INPUT_LENGTH, INJECTION_PATTERNS } from './constants';
import { ValidationResult } from './types';

/**
 * 生成請求追蹤 ID
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${random}`;
}

/**
 * 防止 Prompt 注入攻擊
 * - 移除可能的指令注入字符（多語言）
 * - 限制長度
 * - 轉義特殊字符
 */
export function sanitizeUserInput(
  text: string,
  maxLength: number = MAX_INPUT_LENGTH
): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // 1. 限制長度
  let sanitized = text.substring(0, maxLength);

  // 2. 移除可能的 prompt 注入模式（包含多語言）
  INJECTION_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[已過濾]');
  });

  // 3. 轉義換行符（防止格式破壞）
  sanitized = sanitized
    .replace(/\n{3,}/g, '\n\n') // 限制連續換行
    .replace(/\r/g, ''); // 移除回車符

  // 4. 移除控制字符
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized.trim();
}

/**
 * 驗證答案數組的安全性
 */
export function validateAnswers(
  answers: ScreeningAnswer[]
): ValidationResult {
  if (!Array.isArray(answers)) {
    return { valid: false, error: '答案格式無效' };
  }

  if (answers.length === 0) {
    return { valid: false, error: '沒有提供答案' };
  }

  if (answers.length > 50) {
    return { valid: false, error: '答案數量超過限制' };
  }

  for (const answer of answers) {
    if (!answer.questionId || !answer.question) {
      return { valid: false, error: '答案結構不完整' };
    }

    // 檢查答案內容
    const answerText = Array.isArray(answer.answer)
      ? answer.answer.join('')
      : String(answer.answer || '');

    if (answerText.length > MAX_INPUT_LENGTH * 2) {
      return { valid: false, error: `問題 ${answer.questionId} 的答案過長` };
    }
  }

  return { valid: true };
}
