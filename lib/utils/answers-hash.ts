/**
 * 答案哈希工具
 * 生成筛查答案的内容哈希（用于缓存去重）
 */

import crypto from 'crypto';
import type { ScreeningAnswer } from '@/lib/screening-questions';

/**
 * 生成答案的内容哈希（用于缓存）
 * 包含 questionId、answer 和 note
 */
export function generateAnswersHash(answers: ScreeningAnswer[]): string {
  const normalized = answers
    .map((a) => `${a.questionId}:${JSON.stringify(a.answer)}:${a.note || ''}`)
    .sort()
    .join('|');

  return crypto
    .createHash('sha256')
    .update(normalized)
    .digest('hex')
    .substring(0, 16);
}
