/**
 * DeepSeek API 服務
 * 用於 AI 健康篩查分析
 *
 * 安全特性：
 * - Prompt 注入防護
 * - AI 故障降級策略
 * - 輸出結構驗證
 * - 請求超時處理
 */

import { ScreeningAnswer } from '@/lib/screening-questions';
import crypto from 'crypto';

// ============================================
// 類型定義
// ============================================

export interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskSummary: string;
  recommendedTests: string[];
  treatmentSuggestions: string[];
  recommendedHospitals: RecommendedHospital[];
  nextSteps: string[];
  rawContent: string;
  disclaimer: string;
  isFallback?: boolean; // 標記是否為降級結果
  analysisSource?: 'ai' | 'rule-based'; // 分析來源
}

export interface RecommendedHospital {
  name: string;
  nameJa?: string;
  location: string;
  features: string[];
  suitableFor: string;
}

// ============================================
// 常量配置
// ============================================

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_TIMEOUT_MS = 30000; // 30秒超時
const MAX_INPUT_LENGTH = 500; // 單個答案最大長度
const MAX_NOTE_LENGTH = 200; // 備註最大長度

// 完整的醫療免責聲明
const MEDICAL_DISCLAIMER = `⚠️ 重要醫療免責聲明

1. 本 AI 健康評估系統僅供健康參考，不構成任何形式的醫學診斷、治療建議或處方。
2. AI 分析結果不能替代專業醫療人員的診查、診斷和治療建議。
3. 如您被評估為中度或高度健康風險，請儘速諮詢專業醫療機構。
4. 任何健康決策請務必諮詢持有執照的醫療專業人員。
5. 新島交通株式會社對因使用本系統所做決策產生的任何後果不承擔法律責任。
6. 緊急情況請立即撥打急救電話或前往最近醫療機構。

© 新島交通株式會社 | 日本精密健檢服務`;

// ============================================
// 安全工具函數
// ============================================

/**
 * 防止 Prompt 注入攻擊
 * - 移除可能的指令注入字符
 * - 限制長度
 * - 轉義特殊字符
 */
function sanitizeUserInput(text: string, maxLength: number = MAX_INPUT_LENGTH): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // 1. 限制長度
  let sanitized = text.substring(0, maxLength);

  // 2. 移除可能的 prompt 注入模式
  const injectionPatterns = [
    /ignore\s+(previous|above|all)\s+instructions?/gi,
    /disregard\s+(previous|above|all)/gi,
    /forget\s+(everything|all|previous)/gi,
    /new\s+instructions?:/gi,
    /system\s*:/gi,
    /assistant\s*:/gi,
    /user\s*:/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
    /```[\s\S]*```/g, // 移除代碼塊
    /#{3,}/g, // 移除多個井號（可能試圖改變格式）
  ];

  injectionPatterns.forEach(pattern => {
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
function validateAnswers(answers: ScreeningAnswer[]): { valid: boolean; error?: string } {
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

/**
 * 生成答案的內容哈希（用於緩存）
 */
export function generateAnswersHash(answers: ScreeningAnswer[]): string {
  const normalized = answers
    .map(a => `${a.questionId}:${JSON.stringify(a.answer)}:${a.note || ''}`)
    .sort()
    .join('|');

  return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
}

// ============================================
// AI 分析降級策略
// ============================================

// 否定詞列表（用於規則引擎的否定句檢測）
const NEGATION_WORDS = ['不', '沒有', '沒', '無', '否', '未', 'not', 'no', "don't", 'never', 'none'];

/**
 * 檢測文本中是否包含否定詞
 * 用於避免 "我不抽煙" 被誤判為抽煙風險
 */
function containsNegation(text: string, keyword: string): boolean {
  const lowerText = text.toLowerCase();
  const keywordIndex = lowerText.indexOf(keyword.toLowerCase());

  if (keywordIndex === -1) return false;

  // 檢查關鍵詞前 10 個字符內是否有否定詞
  const prefix = lowerText.substring(Math.max(0, keywordIndex - 10), keywordIndex);
  return NEGATION_WORDS.some(neg => prefix.includes(neg));
}

/**
 * 安全地檢測風險因子（考慮否定句）
 */
function checkRiskFactor(text: string, keywords: string[]): boolean {
  for (const keyword of keywords) {
    if (text.includes(keyword) && !containsNegation(text, keyword)) {
      return true;
    }
  }
  return false;
}

/**
 * 基於規則的降級分析
 * 當 AI 服務不可用時，使用簡單規則引擎提供基本分析
 */
function generateFallbackAnalysis(answers: ScreeningAnswer[]): AnalysisResult {
  // 風險因子計數
  let riskScore = 0;
  const riskFactors: string[] = [];
  const recommendedTests: string[] = [];

  // 分析每個答案
  answers.forEach(answer => {
    const answerText = Array.isArray(answer.answer)
      ? answer.answer.join(',').toLowerCase()
      : String(answer.answer).toLowerCase();
    const question = answer.question.toLowerCase();

    // 年齡風險
    if (question.includes('年齡') || question.includes('歲')) {
      const age = parseInt(answerText);
      if (age >= 50) {
        riskScore += 2;
        riskFactors.push('年齡50歲以上');
        recommendedTests.push('全身健康檢查');
      }
      if (age >= 60) {
        riskScore += 1;
        recommendedTests.push('心血管功能檢測');
      }
    }

    // 家族病史
    if (question.includes('家族') || question.includes('遺傳')) {
      if (answerText.includes('癌') || answerText.includes('腫瘤')) {
        riskScore += 3;
        riskFactors.push('家族癌症病史');
        recommendedTests.push('腫瘤標誌物檢測');
        recommendedTests.push('癌症早期篩查');
      }
      if (answerText.includes('心') || answerText.includes('血壓')) {
        riskScore += 2;
        riskFactors.push('家族心血管病史');
        recommendedTests.push('心電圖檢查');
      }
      if (answerText.includes('糖尿')) {
        riskScore += 2;
        riskFactors.push('家族糖尿病史');
        recommendedTests.push('血糖檢測');
      }
    }

    // 吸煙（使用否定詞檢測避免 "不抽煙" 誤判）
    if (question.includes('吸煙') || question.includes('抽煙')) {
      const smokingKeywords = ['是', '有', '每天', '經常', '偶爾'];
      if (checkRiskFactor(answerText, smokingKeywords)) {
        riskScore += 2;
        riskFactors.push('吸煙習慣');
        recommendedTests.push('肺部CT檢查');
      }
    }

    // 飲酒（使用否定詞檢測）
    if (question.includes('飲酒') || question.includes('喝酒')) {
      if (checkRiskFactor(answerText, ['經常', '每天', '大量'])) {
        riskScore += 1;
        riskFactors.push('經常飲酒');
        recommendedTests.push('肝功能檢測');
      }
    }

    // 症狀
    if (question.includes('症狀') || question.includes('不適')) {
      if (answerText.includes('胸') || answerText.includes('心')) {
        riskScore += 2;
        recommendedTests.push('心臟超音波檢查');
      }
      if (answerText.includes('頭') || answerText.includes('暈')) {
        riskScore += 1;
        recommendedTests.push('腦部MRI檢查');
      }
    }

    // 慢性病
    if (question.includes('慢性') || question.includes('長期')) {
      if (answerText.includes('高血壓')) {
        riskScore += 2;
        riskFactors.push('高血壓');
      }
      if (answerText.includes('糖尿')) {
        riskScore += 2;
        riskFactors.push('糖尿病');
      }
    }
  });

  // 確定風險等級
  let riskLevel: 'low' | 'medium' | 'high';
  if (riskScore >= 6) {
    riskLevel = 'high';
  } else if (riskScore >= 3) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  // 去重推薦檢查
  const uniqueTests = [...new Set(recommendedTests)];
  if (uniqueTests.length === 0) {
    uniqueTests.push('基礎健康檢查');
    uniqueTests.push('血液常規檢測');
  }

  // 構建風險摘要
  let riskSummary = '';
  if (riskLevel === 'high') {
    riskSummary = `根據您的回答，我們識別到以下健康風險因子：${riskFactors.join('、')}。建議您儘快安排全面健康檢查。`;
  } else if (riskLevel === 'medium') {
    riskSummary = riskFactors.length > 0
      ? `您存在一些健康風險因子（${riskFactors.join('、')}），建議定期健康檢查。`
      : '您的健康狀況需要關注，建議進行常規健康檢查。';
  } else {
    riskSummary = '根據您的回答，目前未發現明顯健康風險。建議保持健康生活習慣，定期體檢。';
  }

  return {
    riskLevel,
    riskSummary,
    recommendedTests: uniqueTests.slice(0, 5),
    treatmentSuggestions: [
      '保持均衡飲食和適量運動',
      '確保充足睡眠',
      '定期健康檢查',
    ],
    recommendedHospitals: [
      {
        name: '日本精密健檢中心',
        location: '大阪',
        features: ['綜合健檢', '先進設備', '中文服務'],
        suitableFor: '全面精密健檢',
      },
      {
        name: '癌研有明病院',
        nameJa: 'がん研有明病院',
        location: '東京',
        features: ['癌症專科', '國際患者服務'],
        suitableFor: '癌症篩查與治療',
      },
    ],
    nextSteps: [
      '瀏覽我們的健檢套餐，選擇適合您的方案',
      '如有疑問，歡迎聯繫我們的健康顧問',
      '預約時間，開始您的日本健康之旅',
    ],
    rawContent: '[基於規則引擎的分析結果]',
    disclaimer: MEDICAL_DISCLAIMER,
    isFallback: true,
    analysisSource: 'rule-based',
  };
}

// ============================================
// Prompt 構建
// ============================================

/**
 * 構建安全的 AI 分析 Prompt
 */
function buildAnalysisPrompt(answers: ScreeningAnswer[], phase: 1 | 2 = 2): string {
  // 安全處理每個答案
  const formattedAnswers = answers.map((a) => {
    // 清理問題文本
    const safeQuestion = sanitizeUserInput(a.question, 200);

    // 清理答案
    let answerText: string;
    if (Array.isArray(a.answer)) {
      answerText = a.answer
        .map(item => sanitizeUserInput(String(item), MAX_INPUT_LENGTH))
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
  }).join('\n\n');

  const phaseNote = phase === 1
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
// AI 輸出解析與驗證
// ============================================

/**
 * 解析並驗證 AI 輸出結果
 */
function parseAnalysisResult(content: string): AnalysisResult {
  // 提取風險等級
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (content.includes('【高】') || content.includes('高風險') || content.includes('高度風險')) {
    riskLevel = 'high';
  } else if (content.includes('【中】') || content.includes('中風險') || content.includes('中度') || content.includes('中等')) {
    riskLevel = 'medium';
  } else if (content.includes('【低】') || content.includes('低風險')) {
    riskLevel = 'low';
  }

  // 提取風險摘要
  const riskMatch = content.match(/## 健康風險評估\n([\s\S]*?)(?=\n## |$)/);
  const riskSummary = riskMatch
    ? riskMatch[1].trim().substring(0, 500) // 限制長度
    : '請參考詳細分析結果。';

  // 提取建議檢查項目
  const testsMatch = content.match(/## 建議檢查項目\n([\s\S]*?)(?=\n## |$)/);
  let recommendedTests = testsMatch
    ? testsMatch[1]
        .split('\n')
        .filter((line) => line.trim().startsWith('- '))
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter(item => item.length > 0 && item.length < 200)
        .slice(0, 10)
    : [];

  // 提取治療建議
  const treatmentMatch = content.match(/## 日本先端治療建議\n([\s\S]*?)(?=\n## |$)/);
  let treatmentSuggestions = treatmentMatch
    ? treatmentMatch[1]
        .split('\n')
        .filter((line) => line.trim().startsWith('- '))
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter(item => item.length > 0 && item.length < 200)
        .slice(0, 10)
    : [];

  // 提取推薦醫院
  const hospitalsMatch = content.match(/## 推薦醫療機構\n([\s\S]*?)(?=\n## |$)/);
  const recommendedHospitals: RecommendedHospital[] = [];

  if (hospitalsMatch) {
    const hospitalBlocks = hospitalsMatch[1].split(/\n\d+\.\s*\*\*/).filter(Boolean);
    hospitalBlocks.forEach((block) => {
      const nameMatch = block.match(/^([^*]+)\*\*\s*-\s*(.+)/);
      if (nameMatch) {
        const featuresMatch = block.match(/特點[：:]\s*(.+)/);
        const suitableMatch = block.match(/適合[：:]\s*(.+)/);

        recommendedHospitals.push({
          name: nameMatch[1].replace(/\*\*/g, '').trim().substring(0, 50),
          location: nameMatch[2].trim().substring(0, 20),
          features: featuresMatch
            ? featuresMatch[1].split(/[、,，]/).map(s => s.trim()).slice(0, 5)
            : [],
          suitableFor: suitableMatch
            ? suitableMatch[1].trim().substring(0, 100)
            : '',
        });
      }
    });
  }

  // 如果解析失敗，使用默認醫院
  if (recommendedHospitals.length === 0) {
    recommendedHospitals.push({
      name: '日本精密健檢中心',
      location: '大阪',
      features: ['綜合健檢', '先進設備'],
      suitableFor: '全面精密健檢',
    });
  }

  // 提取下一步建議
  const nextStepsMatch = content.match(/## 下一步建議\n([\s\S]*?)(?=\n---|$)/);
  let nextSteps = nextStepsMatch
    ? nextStepsMatch[1]
        .split('\n')
        .filter((line) => /^\d+[.、]/.test(line.trim()))
        .map((line) => line.replace(/^\d+[.、]\s*/, '').trim())
        .filter(item => item.length > 0 && item.length < 200)
        .slice(0, 5)
    : [];

  // 驗證必要字段，提供默認值
  if (recommendedTests.length === 0) {
    recommendedTests = ['基礎健康檢查', '血液常規檢測'];
  }

  if (treatmentSuggestions.length === 0) {
    treatmentSuggestions = ['保持健康生活習慣', '定期健康檢查'];
  }

  if (nextSteps.length === 0) {
    nextSteps = ['諮詢我們的健康顧問', '選擇適合的健檢套餐'];
  }

  return {
    riskLevel,
    riskSummary,
    recommendedTests,
    treatmentSuggestions,
    recommendedHospitals,
    nextSteps,
    rawContent: content,
    disclaimer: MEDICAL_DISCLAIMER,
    isFallback: false,
    analysisSource: 'ai',
  };
}

/**
 * 驗證分析結果的完整性
 */
function validateAnalysisResult(result: AnalysisResult): boolean {
  if (!['low', 'medium', 'high'].includes(result.riskLevel)) {
    return false;
  }
  if (!result.riskSummary || result.riskSummary.length < 10) {
    return false;
  }
  if (!Array.isArray(result.recommendedTests) || result.recommendedTests.length === 0) {
    return false;
  }
  return true;
}

// ============================================
// 主要導出函數
// ============================================

/**
 * 調用 DeepSeek API 分析健康問卷（帶降級策略）
 */
export async function analyzeHealthScreening(
  answers: ScreeningAnswer[],
  phase: 1 | 2 = 2
): Promise<AnalysisResult> {
  // 1. 驗證輸入
  const validation = validateAnswers(answers);
  if (!validation.valid) {
    console.warn('Answer validation failed:', validation.error);
    return generateFallbackAnalysis(answers);
  }

  // 2. 檢查 API Key
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn('DEEPSEEK_API_KEY not set, using fallback analysis');
    return generateFallbackAnalysis(answers);
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
            content: '你是專業醫療健康顧問，為前往日本進行精密健檢的客戶提供諮詢。使用繁體中文回答，嚴格按照指定格式輸出。',
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
      console.error(`DeepSeek API error (${response.status}):`, errorText);

      // API 錯誤時使用降級
      return generateFallbackAnalysis(answers);
    }

    // 6. 解析響應
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('DeepSeek API returned empty content');
      return generateFallbackAnalysis(answers);
    }

    // 7. 解析並驗證結果
    const result = parseAnalysisResult(content);

    if (!validateAnalysisResult(result)) {
      console.warn('AI result validation failed, using fallback');
      return generateFallbackAnalysis(answers);
    }

    return result;

  } catch (error: unknown) {
    clearTimeout(timeoutId);

    // 處理超時
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('DeepSeek API request timeout');
    } else {
      console.error('DeepSeek API error:', error);
    }

    // 任何錯誤都使用降級
    return generateFallbackAnalysis(answers);
  }
}

/**
 * 導出用於測試的函數
 */
export {
  buildAnalysisPrompt,
  parseAnalysisResult,
  sanitizeUserInput,
  validateAnswers,
  generateFallbackAnalysis,
  MEDICAL_DISCLAIMER,
};
