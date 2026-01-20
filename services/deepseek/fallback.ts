/**
 * AI 故障降級策略
 * 基於規則的分析引擎
 */

import { ScreeningAnswer } from '@/lib/screening-questions';
import { AnalysisResult } from './types';
import { MEDICAL_DISCLAIMER, NEGATION_WORDS } from './constants';

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
  return NEGATION_WORDS.some((neg) => prefix.includes(neg));
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
export function generateFallbackAnalysis(
  answers: ScreeningAnswer[],
  requestId?: string
): AnalysisResult {
  // 風險因子計數
  let riskScore = 0;
  const riskFactors: string[] = [];
  const recommendedTests: string[] = [];

  // 分析每個答案
  answers.forEach((answer) => {
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
    riskSummary =
      riskFactors.length > 0
        ? `您存在一些健康風險因子（${riskFactors.join('、')}），建議定期健康檢查。`
        : '您的健康狀況需要關注，建議進行常規健康檢查。';
  } else {
    riskSummary =
      '根據您的回答，目前未發現明顯健康風險。建議保持健康生活習慣，定期體檢。';
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
    requestId,
  };
}
