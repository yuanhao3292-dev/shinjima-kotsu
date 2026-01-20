/**
 * DeepSeek 健康篩查 AI 服務
 *
 * 安全特性：
 * - Prompt 注入防護（多語言）
 * - AI 故障降級策略
 * - 輸出結構驗證
 * - 請求超時處理
 * - 請求追蹤 ID
 * - 性能監控
 */

import { ScreeningAnswer } from '@/lib/screening-questions';
import crypto from 'crypto';

// 導入類型
export type { AnalysisResult, RecommendedHospital, RiskLevel, ValidationResult } from './types';
import type { AnalysisResult } from './types';

// 導入常量
export {
  DEEPSEEK_API_URL,
  API_TIMEOUT_MS,
  MAX_INPUT_LENGTH,
  MAX_NOTE_LENGTH,
  LIMITS,
  MEDICAL_DISCLAIMER,
  NEGATION_WORDS,
  INJECTION_PATTERNS,
} from './constants';
import {
  DEEPSEEK_API_URL,
  API_TIMEOUT_MS,
  MAX_INPUT_LENGTH,
  MAX_NOTE_LENGTH,
  MEDICAL_DISCLAIMER,
} from './constants';

// 導入工具函數
export { generateRequestId, sanitizeUserInput, validateAnswers } from './sanitize';
import { generateRequestId, sanitizeUserInput, validateAnswers } from './sanitize';

// 導入降級分析
export { generateFallbackAnalysis } from './fallback';
import { generateFallbackAnalysis } from './fallback';

// 導入解析器
export { parseAnalysisResult, validateAnalysisResult } from './parser';
import { parseAnalysisResult, validateAnalysisResult } from './parser';

// 導入性能監控
export type { PerformanceMetrics } from './performance';
export {
  recordMetrics,
  getPerformanceStats,
  clearMetrics,
  createPerformanceTimer,
} from './performance';
import { createPerformanceTimer } from './performance';

// ============================================
// 哈希生成
// ============================================

/**
 * 生成答案的內容哈希（用於緩存）
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

// ============================================
// Prompt 構建
// ============================================

/**
 * 構建安全的 AI 分析 Prompt
 */
export function buildAnalysisPrompt(
  answers: ScreeningAnswer[],
  phase: 1 | 2 = 2
): string {
  // 安全處理每個答案
  const formattedAnswers = answers
    .map((a) => {
      // 清理問題文本
      const safeQuestion = sanitizeUserInput(a.question, 200);

      // 清理答案
      let answerText: string;
      if (Array.isArray(a.answer)) {
        answerText = a.answer
          .map((item) => sanitizeUserInput(String(item), MAX_INPUT_LENGTH))
          .join('、');
      } else {
        answerText = sanitizeUserInput(String(a.answer), MAX_INPUT_LENGTH);
      }

      // 清理備註
      if (a.note) {
        const safeNote = sanitizeUserInput(a.note, MAX_NOTE_LENGTH);
        if (safeNote) {
          answerText += `（補充說明：${safeNote}）`;
        }
      }

      return `問題${a.questionId}: ${safeQuestion}\n回答: ${answerText}`;
    })
    .join('\n\n');

  const phaseNote =
    phase === 1
      ? '\n⚡ 這是快速篩查階段，請提供簡潔的初步建議。\n'
      : '\n📋 這是完整問診階段，請提供詳細深入的分析報告。\n';

  // 使用結構化的 prompt 格式，降低注入風險
  return `
作為專業醫療健康顧問，請分析以下健康問卷答案。
${phaseNote}
---健康問卷答案開始---
${formattedAnswers}
---健康問卷答案結束---

請嚴格按照以下格式輸出分析結果（繁體中文）：

## 健康風險評估
分析健康風險等級，必須明確標註：【低】、【中】或【高】。說明主要關注領域。

## 建議檢查項目
列出 3-5 項建議檢查，每項用「- 」開頭，說明原因。

## 日本先端治療建議
根據情況介紹適合的日本先進治療（如適用）：
- 質子重粒子治療
- 免疫細胞療法
- 微創機器人手術
- 再生醫療
- 精準醫療基因檢測

## 推薦醫療機構
推薦 2-3 家日本醫療機構，格式：
1. **機構名稱** - 地點
   - 特點：xxx
   - 適合：xxx

## 下一步建議
給出 2-3 條行動建議，用數字序號開頭。
`;
}

// ============================================
// 主要導出函數
// ============================================

/**
 * 調用 DeepSeek API 分析健康問卷（帶降級策略和性能監控）
 *
 * @param answers - 篩查問卷答案
 * @param phase - 問診階段 (1: 快速篩查, 2: 完整問診)
 * @returns 分析結果（AI 或降級規則引擎）
 */
export async function analyzeHealthScreening(
  answers: ScreeningAnswer[],
  phase: 1 | 2 = 2
): Promise<AnalysisResult> {
  // 生成請求追蹤 ID 並啟動性能計時器
  const requestId = generateRequestId();
  const timer = createPerformanceTimer(requestId, phase, answers.length);

  // 1. 驗證輸入
  const validation = validateAnswers(answers);
  if (!validation.valid) {
    console.warn(`[${requestId}] Answer validation failed:`, validation.error);
    const result = generateFallbackAnalysis(answers, requestId);
    timer.end('rule-based', true);
    return result;
  }

  // 2. 檢查 API Key
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn(`[${requestId}] DEEPSEEK_API_KEY not set, using fallback`);
    const result = generateFallbackAnalysis(answers, requestId);
    timer.end('rule-based', true);
    return result;
  }

  // 3. 構建安全的 prompt
  const prompt = buildAnalysisPrompt(answers, phase);

  // 4. 帶超時的 API 調用
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              '你是專業醫療健康顧問，為前往日本進行精密健檢的客戶提供諮詢。使用繁體中文回答，嚴格按照指定格式輸出。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 5. 檢查響應狀態
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(
        `[${requestId}] DeepSeek API error (${response.status}):`,
        errorText
      );
      const result = generateFallbackAnalysis(answers, requestId);
      timer.end('rule-based', false, `api_error_${response.status}`);
      return result;
    }

    // 6. 解析響應
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error(`[${requestId}] DeepSeek API returned empty content`);
      const result = generateFallbackAnalysis(answers, requestId);
      timer.end('rule-based', false, 'empty_response');
      return result;
    }

    // 7. 解析並驗證結果
    const result = parseAnalysisResult(content, requestId);

    if (!validateAnalysisResult(result)) {
      console.warn(`[${requestId}] AI result validation failed, using fallback`);
      const fallbackResult = generateFallbackAnalysis(answers, requestId);
      timer.end('rule-based', false, 'validation_failed');
      return fallbackResult;
    }

    timer.end('ai', true);
    return result;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    // 處理超時
    let errorType = 'unknown';
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[${requestId}] DeepSeek API request timeout`);
      errorType = 'timeout';
    } else {
      console.error(`[${requestId}] DeepSeek API error:`, error);
      errorType = 'network_error';
    }

    // 任何錯誤都使用降級
    const result = generateFallbackAnalysis(answers, requestId);
    timer.end('rule-based', false, errorType);
    return result;
  }
}
