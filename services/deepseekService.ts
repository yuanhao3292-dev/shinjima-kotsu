/**
 * DeepSeek API 服務
 * 用於 AI 健康篩查分析
 */

import { ScreeningAnswer } from '@/lib/screening-questions';

export interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskSummary: string;
  recommendedTests: string[];
  treatmentSuggestions: string[];
  recommendedHospitals: RecommendedHospital[];
  nextSteps: string[];
  rawContent: string; // 原始 AI 輸出
  disclaimer: string;
}

export interface RecommendedHospital {
  name: string;
  nameJa?: string;
  location: string;
  features: string[];
  suitableFor: string;
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * 構建 AI 分析 Prompt
 * @param answers 用戶答案
 * @param phase 問診階段：1 = 快速篩查, 2 = 完整分析
 */
function buildAnalysisPrompt(answers: ScreeningAnswer[], phase: 1 | 2 = 2): string {
  const formattedAnswers = answers.map((a) => {
    let answerText = Array.isArray(a.answer) ? a.answer.join('、') : a.answer;
    if (a.note) {
      answerText += `（備註：${a.note}）`;
    }
    return `Q${a.questionId}: ${a.question}\nA: ${answerText}`;
  }).join('\n\n');

  // 根據階段調整 prompt
  const phaseNote = phase === 1
    ? '\n⚡ 注意：這是快速篩查（僅10道問題），請提供簡潔的初步建議。\n'
    : '\n📋 注意：這是完整問診（全部20道問題），請提供詳細深入的分析報告。\n';

  return `
你是一位專業的醫療健康顧問，專門為想要前往日本進行精密健檢或先端治療的客戶提供諮詢。
${phaseNote}

請根據以下用戶的健康問卷答案，提供專業分析：

【用戶答案】
${formattedAnswers}

請按以下格式輸出分析結果（使用繁體中文）：

## 健康風險評估
根據您的回答，分析您可能存在的健康風險等級（低/中/高）及主要關注領域。請明確標註風險等級：【低】、【中】或【高】。

## 建議檢查項目
列出 3-5 項建議您重點關注的檢查項目，並說明原因。每項用「- 」開頭。

## 日本先端治療建議
根據用戶的健康狀況，介紹日本適合的先進治療手段（如適用）：
- 質子重粒子治療（適用於特定癌症）
- 免疫細胞療法（NK細胞、樹突細胞等）
- 微創機器人手術（達文西手術系統）
- 再生醫療（幹細胞治療）
- 精準醫療基因檢測

## 推薦醫療機構
根據用戶情況，推薦 2-3 家日本醫療機構：

1. **德洲會集團 (TIMC)** - 大阪
   - 特點：綜合健檢、4.2萬醫護團隊、全日本最大醫療集團
   - 適合：全面精密健檢、慢性病管理

2. **癌研有明病院** - 東京
   - 特點：日本頂尖癌症專科、國際患者服務完善
   - 適合：癌症篩查與治療

3. **國立癌症研究中心** - 東京
   - 特點：最新臨床試驗、免疫治療研究前沿
   - 適合：需要前沿治療方案

4. **慶應義塾大學病院** - 東京
   - 特點：再生醫療研究領先
   - 適合：需要幹細胞治療

請根據用戶的具體情況，選擇最適合的 2-3 家推薦。

## 下一步建議
給出 2-3 條具體的行動建議。每條用數字序號開頭。

---
⚠️ 免責聲明：本分析僅供參考，不構成醫療診斷。具體健康問題請諮詢專業醫生。
`;
}

/**
 * 解析 AI 輸出結果
 */
function parseAnalysisResult(content: string): AnalysisResult {
  // 提取風險等級
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (content.includes('【高】') || content.includes('高風險')) {
    riskLevel = 'high';
  } else if (content.includes('【中】') || content.includes('中風險') || content.includes('中等')) {
    riskLevel = 'medium';
  }

  // 提取風險摘要
  const riskMatch = content.match(/## 健康風險評估\n([\s\S]*?)(?=\n## |$)/);
  const riskSummary = riskMatch ? riskMatch[1].trim() : '';

  // 提取建議檢查項目
  const testsMatch = content.match(/## 建議檢查項目\n([\s\S]*?)(?=\n## |$)/);
  const recommendedTests = testsMatch
    ? testsMatch[1]
        .split('\n')
        .filter((line) => line.startsWith('- '))
        .map((line) => line.replace(/^- /, '').trim())
    : [];

  // 提取治療建議
  const treatmentMatch = content.match(/## 日本先端治療建議\n([\s\S]*?)(?=\n## |$)/);
  const treatmentSuggestions = treatmentMatch
    ? treatmentMatch[1]
        .split('\n')
        .filter((line) => line.startsWith('- '))
        .map((line) => line.replace(/^- /, '').trim())
    : [];

  // 提取推薦醫院
  const hospitalsMatch = content.match(/## 推薦醫療機構\n([\s\S]*?)(?=\n## |$)/);
  const recommendedHospitals: RecommendedHospital[] = [];

  if (hospitalsMatch) {
    const hospitalBlocks = hospitalsMatch[1].split(/\n\d+\. \*\*/).filter(Boolean);
    hospitalBlocks.forEach((block) => {
      const nameMatch = block.match(/^([^*]+)\*\*\s*-\s*(.+)/);
      if (nameMatch) {
        const featuresMatch = block.match(/特點：(.+)/);
        const suitableMatch = block.match(/適合：(.+)/);

        recommendedHospitals.push({
          name: nameMatch[1].replace(/\*\*/g, '').trim(),
          location: nameMatch[2].trim(),
          features: featuresMatch ? featuresMatch[1].split('、').map(s => s.trim()) : [],
          suitableFor: suitableMatch ? suitableMatch[1].trim() : '',
        });
      }
    });
  }

  // 如果解析失败，使用默认医院
  if (recommendedHospitals.length === 0) {
    recommendedHospitals.push({
      name: '德洲會集團 (TIMC)',
      location: '大阪',
      features: ['綜合健檢', '4.2萬醫護團隊'],
      suitableFor: '全面精密健檢',
    });
  }

  // 提取下一步建议
  const nextStepsMatch = content.match(/## 下一步建議\n([\s\S]*?)(?=\n---|$)/);
  const nextSteps = nextStepsMatch
    ? nextStepsMatch[1]
        .split('\n')
        .filter((line) => /^\d+\./.test(line.trim()))
        .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    : [];

  return {
    riskLevel,
    riskSummary,
    recommendedTests,
    treatmentSuggestions,
    recommendedHospitals,
    nextSteps,
    rawContent: content,
    disclaimer: '⚠️ 免責聲明：本分析僅供參考，不構成醫療診斷。具體健康問題請諮詢專業醫生。',
  };
}

/**
 * 调用 DeepSeek API 分析健康问卷
 * @param answers 用户答案
 * @param phase 问诊阶段：1 = 快速筛查, 2 = 完整分析
 */
export async function analyzeHealthScreening(
  answers: ScreeningAnswer[],
  phase: 1 | 2 = 2
): Promise<AnalysisResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY 环境变量未设置');
  }

  const prompt = buildAnalysisPrompt(answers, phase);

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
            '你是一位專業的醫療健康顧問，專門為想要前往日本進行精密健檢或先端治療的客戶提供諮詢。請使用繁體中文回答。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('DeepSeek API error:', error);
    throw new Error(`DeepSeek API 调用失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('DeepSeek API 返回空结果');
  }

  return parseAnalysisResult(content);
}

/**
 * 导出用于测试的函数
 */
export { buildAnalysisPrompt, parseAnalysisResult };
