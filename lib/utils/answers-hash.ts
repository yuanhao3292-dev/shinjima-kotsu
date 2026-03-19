/**
 * 答案哈希工具
 * 生成筛查答案的内容哈希（用于缓存去重）
 */

import crypto from 'crypto';
import type { ScreeningAnswer } from '@/lib/screening-questions';

/**
 * 生成答案的内容哈希（用于缓存）
 * 包含 questionId、answer、note 和文档文本（如有）
 *
 * Bug fix: 之前只 hash 问卷答案，文档模式下 answers=[] 导致
 * 所有文档筛查产生相同哈希 → 不同 PDF 返回第一次的缓存结果
 */
export function generateAnswersHash(answers: ScreeningAnswer[], documentText?: string): string {
  const normalized = answers
    .map((a) => `${a.questionId}:${JSON.stringify(a.answer)}:${a.note || ''}`)
    .sort()
    .join('|');

  const hashInput = documentText ? `${normalized}||DOC:${documentText}` : normalized;

  return crypto
    .createHash('sha256')
    .update(hashInput)
    .digest('hex')
    .substring(0, 16);
}
