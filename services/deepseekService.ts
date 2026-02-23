/**
 * DeepSeek API 服务
 * 用于 AI 健康筛查分析
 *
 * 此文件现在从模组化的 deepseek/ 目录重新导出
 * 保持向后兼容性
 *
 * 安全特性：
 * - Prompt 注入防护（多语言：中/英/日）
 * - AI 故障降级策略（规则引擎）
 * - 输出结构验證
 * - 请求超时处理（30秒）
 * - 请求追蹤 ID
 * - 性能监控
 */

// 重新导出所有类型
export type {
  AnalysisResult,
  RecommendedHospital,
  RiskLevel,
  ValidationResult,
} from './deepseek/types';

// 重新导出常量
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

// 重新导出工具函数
export {
  generateRequestId,
  sanitizeUserInput,
  validateAnswers,
} from './deepseek/sanitize';

// 重新导出降级分析
export { generateFallbackAnalysis } from './deepseek/fallback';

// 重新导出解析器
export {
  parseAnalysisResult,
  validateAnalysisResult,
} from './deepseek/parser';

// 重新导出主函数和哈希生成
export {
  analyzeHealthScreening,
  generateAnswersHash,
  buildAnalysisPrompt,
} from './deepseek/index';

// 重新导出性能监控
export type { PerformanceMetrics } from './deepseek/performance';
export {
  recordMetrics,
  getPerformanceStats,
  clearMetrics,
  createPerformanceTimer,
} from './deepseek/performance';
