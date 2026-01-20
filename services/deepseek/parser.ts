/**
 * AI 輸出解析和驗證
 */

import { AnalysisResult, RecommendedHospital } from './types';
import { MEDICAL_DISCLAIMER, LIMITS } from './constants';

/**
 * 解析列表項目
 */
function parseListItems(
  text: string,
  prefix: string = '- ',
  maxLength: number = LIMITS.itemMaxLength,
  maxItems: number = LIMITS.recommendedTests
): string[] {
  return text
    .split('\n')
    .filter((line) => line.trim().startsWith(prefix))
    .map((line) => line.replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`), '').trim())
    .filter((item) => item.length > 0 && item.length < maxLength)
    .slice(0, maxItems);
}

/**
 * 解析並驗證 AI 輸出結果
 */
export function parseAnalysisResult(
  content: string,
  requestId?: string
): AnalysisResult {
  // 提取風險等級
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (
    content.includes('【高】') ||
    content.includes('高風險') ||
    content.includes('高度風險')
  ) {
    riskLevel = 'high';
  } else if (
    content.includes('【中】') ||
    content.includes('中風險') ||
    content.includes('中度') ||
    content.includes('中等')
  ) {
    riskLevel = 'medium';
  } else if (content.includes('【低】') || content.includes('低風險')) {
    riskLevel = 'low';
  }

  // 提取風險摘要
  const riskMatch = content.match(/## 健康風險評估\n([\s\S]*?)(?=\n## |$)/);
  const riskSummary = riskMatch
    ? riskMatch[1].trim().substring(0, LIMITS.riskSummaryLength)
    : '請參考詳細分析結果。';

  // 提取建議檢查項目
  const testsMatch = content.match(/## 建議檢查項目\n([\s\S]*?)(?=\n## |$)/);
  let recommendedTests = testsMatch
    ? parseListItems(testsMatch[1], '- ')
    : [];

  // 提取治療建議
  const treatmentMatch = content.match(
    /## 日本先端治療建議\n([\s\S]*?)(?=\n## |$)/
  );
  let treatmentSuggestions = treatmentMatch
    ? parseListItems(treatmentMatch[1], '- ')
    : [];

  // 提取推薦醫院
  const hospitalsMatch = content.match(
    /## 推薦醫療機構\n([\s\S]*?)(?=\n## |$)/
  );
  const recommendedHospitals: RecommendedHospital[] = [];

  if (hospitalsMatch) {
    const hospitalBlocks = hospitalsMatch[1]
      .split(/\n\d+\.\s*\*\*/)
      .filter(Boolean);
    hospitalBlocks.forEach((block) => {
      const nameMatch = block.match(/^([^*]+)\*\*\s*-\s*(.+)/);
      if (nameMatch) {
        const featuresMatch = block.match(/特點[：:]\s*(.+)/);
        const suitableMatch = block.match(/適合[：:]\s*(.+)/);

        recommendedHospitals.push({
          name: nameMatch[1]
            .replace(/\*\*/g, '')
            .trim()
            .substring(0, 50),
          location: nameMatch[2].trim().substring(0, 20),
          features: featuresMatch
            ? featuresMatch[1]
                .split(/[、,，]/)
                .map((s) => s.trim())
                .slice(0, 5)
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
        .filter((item) => item.length > 0 && item.length < LIMITS.itemMaxLength)
        .slice(0, LIMITS.nextSteps)
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
    requestId,
  };
}

/**
 * 驗證分析結果的完整性
 */
export function validateAnalysisResult(result: AnalysisResult): boolean {
  if (!['low', 'medium', 'high'].includes(result.riskLevel)) {
    return false;
  }
  if (!result.riskSummary || result.riskSummary.length < 10) {
    return false;
  }
  if (
    !Array.isArray(result.recommendedTests) ||
    result.recommendedTests.length === 0
  ) {
    return false;
  }
  return true;
}
