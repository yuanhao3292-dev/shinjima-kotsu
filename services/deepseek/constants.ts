/**
 * DeepSeek 服務常量配置
 */

export const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
export const API_TIMEOUT_MS = 30000; // 30秒超時
export const MAX_INPUT_LENGTH = 500; // 單個答案最大長度
export const MAX_NOTE_LENGTH = 200; // 備註最大長度

// 結果限制
export const LIMITS = {
  recommendedTests: 10,
  treatmentSuggestions: 10,
  nextSteps: 5,
  hospitals: 5,
  riskSummaryLength: 500,
  itemMaxLength: 200,
} as const;

// 完整的醫療免責聲明
export const MEDICAL_DISCLAIMER = `⚠️ 重要醫療免責聲明

1. 本 AI 健康評估系統僅供健康參考，不構成任何形式的醫學診斷、治療建議或處方。
2. AI 分析結果不能替代專業醫療人員的診查、診斷和治療建議。
3. 如您被評估為中度或高度健康風險，請儘速諮詢專業醫療機構。
4. 任何健康決策請務必諮詢持有執照的醫療專業人員。
5. 新島交通株式會社對因使用本系統所做決策產生的任何後果不承擔法律責任。
6. 緊急情況請立即撥打急救電話或前往最近醫療機構。

© 新島交通株式會社 | 日本精密健檢服務`;

// 否定詞列表（多語言）
export const NEGATION_WORDS = [
  // 中文 - 基本否定
  '不', '沒有', '沒', '無', '否', '未', '從不', '從未',
  // 中文 - 戒除/過去式（避免 "已戒煙5年" 被誤判）
  '戒', '已戒', '戒掉', '戒了', '不再', '曾經', '以前', '過去',
  // 英文
  'not', 'no', "don't", "doesn't", 'never', 'none', 'without',
  'quit', 'stopped', 'used to', 'formerly', 'ex-',
  // 日文
  'ない', 'いいえ', '無い', 'なし', 'やめた', '禁煙',
];

// Prompt 注入攻擊模式（多語言）
export const INJECTION_PATTERNS = [
  // 英文
  /ignore\s+(previous|above|all)\s+instructions?/gi,
  /disregard\s+(previous|above|all)/gi,
  /forget\s+(everything|all|previous)/gi,
  /new\s+instructions?:/gi,
  /system\s*:/gi,
  /assistant\s*:/gi,
  /user\s*:/gi,
  /override[\s\w]*:?/gi,
  /bypass[\s\w]*:?/gi,
  /role[\s]*[:=]/gi,
  // LLM 格式標記
  /\[INST\]/gi,
  /\[\/INST\]/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
  // 中文注入
  /忽略(之前|上面|所有)(的)?(指令|說明)/gi,
  /無視(之前|上面|所有)(的)?(指令|說明)/gi,
  /新(的)?指令[:：]/gi,
  /系統[:：]/gi,
  // 日文注入
  /前の指示を(無視|忘れ)/gi,
  /システム[:：]/gi,
  // 代碼塊和格式破壞
  /```[\s\S]*```/g,
  /#{3,}/g,
];
