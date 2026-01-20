/**
 * DeepSeek API 服務
 * 用於 AI 健康篩查分析
 *
 * 此文件現在從模組化的 deepseek/ 目錄重新導出
 * 保持向後兼容性
 *
 * 安全特性：
 * - Prompt 注入防護（多語言：中/英/日）
 * - AI 故障降級策略（規則引擎）
 * - 輸出結構驗證
 * - 請求超時處理（30秒）
 * - 請求追蹤 ID
 * - 性能監控
 */

// 重新導出所有類型
export type {
  AnalysisResult,
  RecommendedHospital,
  RiskLevel,
  ValidationResult,
} from './deepseek/types';

// 重新導出常量
export {
  DEEPSEEK_API_URL,
  API_TIMEOUT_MS,
  MAX_INPUT_LENGTH,
  MAX_NOTE_LENGTH,
  LIMITS,
  MEDICAL_DISCLAIMER,
  NEGATION_WORDS,
  INJECTION_PATTERNS,
} from './deepseek/constants';

// 重新導出工具函數
export {
  generateRequestId,
  sanitizeUserInput,
  validateAnswers,
} from './deepseek/sanitize';

// 重新導出降級分析
export { generateFallbackAnalysis } from './deepseek/fallback';

// 重新導出解析器
export {
  parseAnalysisResult,
  validateAnalysisResult,
} from './deepseek/parser';

// 重新導出主函數和哈希生成
export {
  analyzeHealthScreening,
  generateAnswersHash,
  buildAnalysisPrompt,
} from './deepseek/index';

// 重新導出性能監控
export type { PerformanceMetrics } from './deepseek/performance';
export {
  recordMetrics,
  getPerformanceStats,
  clearMetrics,
  createPerformanceTimer,
} from './deepseek/performance';
