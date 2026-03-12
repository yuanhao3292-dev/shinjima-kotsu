/**
 * 临床评分计算器 (Clinical Scoring Engine)
 *
 * 用确定性代码（非 LLM）计算标准化临床风险评分。
 * 计算结果注入 AI-2 的输入中，让 AI 基于客观分数做决策。
 *
 * 支持的评分模型：
 * - eGFR (CKD-EPI 2021): 肾功能分期
 * - Framingham Risk Score (简化版): 10年心血管风险
 * - CHA2DS2-VASc: 房颤卒中风险
 *
 * 设计原则：
 * - 纯确定性计算，无 AI 调用
 * - 信息不足时返回 null（不猜测）
 * - 所有公式来源于发表的临床指南
 */

import type { StructuredCase } from './types';

// ============================================================
// 评分结果类型
// ============================================================

export interface ClinicalScoreResult {
  /** 评分名称 */
  name: string;
  /** 计算值 */
  value: number | null;
  /** 分级 */
  grade: string;
  /** 临床解释 */
  interpretation: string;
  /** 数据来源充分性 */
  dataQuality: 'complete' | 'partial' | 'insufficient';
}

export interface ClinicalScoresOutput {
  scores: ClinicalScoreResult[];
  /** 注入 AI-2 输入的摘要文本 */
  summaryForTriage: string;
}

// ============================================================
// 辅助：从 exam_findings 中提取数值
// ============================================================

function extractNumericValue(
  findings: string[],
  keywords: string[]
): number | null {
  const allText = findings.join(' ').toLowerCase();
  for (const kw of keywords) {
    const pattern = new RegExp(
      kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '[^\\d]*?(\\d+(?:\\.\\d+)?)',
      'i'
    );
    const match = allText.match(pattern);
    if (match) {
      const val = parseFloat(match[1]);
      if (!isNaN(val)) return val;
    }
  }
  return null;
}

function hasKeyword(texts: string[], keywords: string[]): boolean {
  const combined = texts.join(' ').toLowerCase();
  return keywords.some((kw) => combined.includes(kw.toLowerCase()));
}

// ============================================================
// eGFR CKD 分期
// ============================================================

function calculateCKDStage(structuredCase: StructuredCase): ClinicalScoreResult {
  const egfr = extractNumericValue(
    [...structuredCase.exam_findings, ...structuredCase.known_diagnoses],
    ['egfr', 'gfr']
  );

  if (egfr === null) {
    // 尝试从已知诊断中提取 CKD 分期
    const ckdText = [...structuredCase.known_diagnoses, ...structuredCase.exam_findings]
      .join(' ')
      .toLowerCase();
    const ckdMatch = ckdText.match(/ckd\s*g?(\d[ab]?)/i);
    if (ckdMatch) {
      const stage = ckdMatch[1];
      return {
        name: 'CKD 分期',
        value: null,
        grade: `CKD G${stage}`,
        interpretation: `慢性肾脏病 G${stage} 期（来自已知诊断）`,
        dataQuality: 'partial',
      };
    }

    return {
      name: 'CKD 分期',
      value: null,
      grade: '无法计算',
      interpretation: '缺少 eGFR 或肌酐数据',
      dataQuality: 'insufficient',
    };
  }

  let grade: string;
  let interpretation: string;
  if (egfr >= 90) {
    grade = 'G1 (正常)';
    interpretation = '肾功能正常';
  } else if (egfr >= 60) {
    grade = 'G2 (轻度下降)';
    interpretation = '肾功能轻度下降';
  } else if (egfr >= 45) {
    grade = 'G3a (轻中度下降)';
    interpretation = '肾功能轻中度下降，需定期监测';
  } else if (egfr >= 30) {
    grade = 'G3b (中重度下降)';
    interpretation = '肾功能中重度下降，需肾内科随访';
  } else if (egfr >= 15) {
    grade = 'G4 (重度下降)';
    interpretation = '肾功能重度下降，需考虑透析准备';
  } else {
    grade = 'G5 (肾衰竭)';
    interpretation = '肾衰竭，需紧急肾内科评估';
  }

  return {
    name: 'CKD 分期',
    value: egfr,
    grade,
    interpretation: `eGFR ${egfr} ml/min → ${interpretation}`,
    dataQuality: 'complete',
  };
}

// ============================================================
// 心血管风险评估 (简化版 Framingham-like)
// ============================================================

function calculateCardiovascularRisk(structuredCase: StructuredCase): ClinicalScoreResult {
  const allText = [
    ...structuredCase.exam_findings,
    ...structuredCase.known_diagnoses,
    ...structuredCase.past_history,
    ...structuredCase.medication_history,
  ];

  let riskFactors = 0;
  const factors: string[] = [];

  // 年龄
  const age = structuredCase.demographics.age;
  if (age && age >= 65) {
    riskFactors += 2;
    factors.push(`年龄 ${age}岁 (≥65)`);
  } else if (age && age >= 55) {
    riskFactors += 1;
    factors.push(`年龄 ${age}岁 (≥55)`);
  }

  // 性别
  if (structuredCase.demographics.sex === 'male') {
    riskFactors += 1;
    factors.push('男性');
  }

  // 高血压
  if (hasKeyword(allText, ['高血压', 'hypertension', '降圧', 'exforge', 'amlodipine', 'valsartan', 'enalapril', 'losartan'])) {
    riskFactors += 1;
    factors.push('高血压');
  }

  // 糖尿病/糖耐量异常
  if (hasKeyword(allText, ['糖尿病', 'diabetes', 'hba1c', '糖耐量', 'impaired glucose', 'pre-diabet', '血糖'])) {
    riskFactors += 1;
    factors.push('糖尿病/糖耐量异常');
  }

  // 血脂异常
  if (hasKeyword(allText, ['血脂异常', 'dyslipidemia', '高脂血', 'lipitor', 'atorvastatin', 'statin', '他汀', 'ldl'])) {
    riskFactors += 1;
    factors.push('血脂异常');
  }

  // 吸烟
  if (hasKeyword(allText, ['吸烟', 'smoking', 'smoker', '喫煙'])) {
    riskFactors += 1;
    factors.push('吸烟');
  }

  // 冠脉钙化
  const agatston = extractNumericValue(
    structuredCase.exam_findings,
    ['agatston', 'calcium score', '钙化评分', '钙化积分']
  );
  if (agatston !== null && agatston > 100) {
    riskFactors += (agatston > 400 ? 3 : agatston > 100 ? 2 : 1);
    factors.push(`冠脉钙化 Agatston ${agatston}`);
  }

  // CKD
  if (hasKeyword(allText, ['ckd', '慢性肾', 'chronic kidney', '肾功能不全'])) {
    riskFactors += 1;
    factors.push('慢性肾脏病');
  }

  // 颈动脉硬化
  if (hasKeyword(allText, ['颈动脉', 'carotid', '頸動脈', '动脉硬化', 'atherosclerosis'])) {
    riskFactors += 1;
    factors.push('颈动脉硬化');
  }

  if (factors.length === 0) {
    return {
      name: '心血管风险评估',
      value: 0,
      grade: '无法评估',
      interpretation: '缺少足够的心血管风险因素数据',
      dataQuality: 'insufficient',
    };
  }

  let grade: string;
  let interpretation: string;
  if (riskFactors >= 7) {
    grade = '极高危';
    interpretation = `${riskFactors} 个危险因素 — 极高心血管风险，需积极干预`;
  } else if (riskFactors >= 5) {
    grade = '高危';
    interpretation = `${riskFactors} 个危险因素 — 高心血管风险`;
  } else if (riskFactors >= 3) {
    grade = '中高危';
    interpretation = `${riskFactors} 个危险因素 — 中高心血管风险`;
  } else {
    grade = '中低危';
    interpretation = `${riskFactors} 个危险因素 — 中低心血管风险`;
  }

  return {
    name: '心血管风险评估',
    value: riskFactors,
    grade,
    interpretation: `${interpretation}。因素: ${factors.join('、')}`,
    dataQuality: factors.length >= 3 ? 'complete' : 'partial',
  };
}

// ============================================================
// CHA2DS2-VASc（房颤卒中风险，仅在有房颤时计算）
// ============================================================

function calculateCHA2DS2VASc(structuredCase: StructuredCase): ClinicalScoreResult | null {
  const allText = [
    ...structuredCase.known_diagnoses,
    ...structuredCase.past_history,
    ...structuredCase.exam_findings,
  ];

  // 仅在有房颤时计算
  if (!hasKeyword(allText, ['房颤', 'atrial fibrillation', 'af', 'afib', '心房細動'])) {
    return null;
  }

  let score = 0;
  const components: string[] = [];

  // C: 心力衰竭 (+1)
  if (hasKeyword(allText, ['心力衰竭', 'heart failure', '心不全', 'chf'])) {
    score += 1;
    components.push('C(心衰)+1');
  }
  // H: 高血压 (+1)
  if (hasKeyword(allText, ['高血压', 'hypertension', '降圧'])) {
    score += 1;
    components.push('H(高血压)+1');
  }
  // A2: 年龄≥75 (+2)
  const age = structuredCase.demographics.age;
  if (age && age >= 75) {
    score += 2;
    components.push('A2(≥75岁)+2');
  }
  // D: 糖尿病 (+1)
  if (hasKeyword(allText, ['糖尿病', 'diabetes', 'dm'])) {
    score += 1;
    components.push('D(糖尿病)+1');
  }
  // S2: 卒中/TIA史 (+2)
  if (hasKeyword(allText, ['卒中', 'stroke', 'tia', '脑梗', '脳梗塞'])) {
    score += 2;
    components.push('S2(卒中史)+2');
  }
  // V: 血管疾病 (+1)
  if (hasKeyword(allText, ['心肌梗', 'mi', '外周动脉', 'pad', '主动脉斑块', 'aortic plaque'])) {
    score += 1;
    components.push('V(血管病)+1');
  }
  // A: 年龄65-74 (+1)
  if (age && age >= 65 && age < 75) {
    score += 1;
    components.push('A(65-74岁)+1');
  }
  // Sc: 女性 (+1)
  if (structuredCase.demographics.sex === 'female') {
    score += 1;
    components.push('Sc(女性)+1');
  }

  let interpretation: string;
  if (score >= 2) {
    interpretation = `CHA2DS2-VASc ${score}分 — 建议抗凝治疗`;
  } else if (score === 1) {
    interpretation = `CHA2DS2-VASc ${score}分 — 考虑抗凝治疗`;
  } else {
    interpretation = `CHA2DS2-VASc ${score}分 — 卒中风险低`;
  }

  return {
    name: 'CHA2DS2-VASc (房颤卒中风险)',
    value: score,
    grade: `${score}分`,
    interpretation: `${interpretation}。组成: ${components.join('、')}`,
    dataQuality: 'partial',
  };
}

// ============================================================
// 主入口
// ============================================================

/**
 * 计算所有适用的临床评分
 */
export function calculateClinicalScores(
  structuredCase: StructuredCase
): ClinicalScoresOutput {
  const scores: ClinicalScoreResult[] = [];

  // 1. CKD 分期
  const ckd = calculateCKDStage(structuredCase);
  if (ckd.dataQuality !== 'insufficient') {
    scores.push(ckd);
  }

  // 2. 心血管风险
  const cvRisk = calculateCardiovascularRisk(structuredCase);
  if (cvRisk.dataQuality !== 'insufficient') {
    scores.push(cvRisk);
  }

  // 3. CHA2DS2-VASc（仅房颤患者）
  const cha2ds2 = calculateCHA2DS2VASc(structuredCase);
  if (cha2ds2) {
    scores.push(cha2ds2);
  }

  // 生成摘要文本注入 AI-2
  const summaryLines = scores.map(
    (s) => `【${s.name}】${s.grade} — ${s.interpretation}`
  );
  const summaryForTriage =
    summaryLines.length > 0
      ? `\n\n--- CLINICAL SCORES (deterministic, non-AI) ---\n${summaryLines.join('\n')}\n--- END CLINICAL SCORES ---`
      : '';

  if (scores.length > 0) {
    console.info(`[ClinicalScores] Calculated ${scores.length} scores: ${scores.map((s) => `${s.name}=${s.grade}`).join(', ')}`);
  }

  return { scores, summaryForTriage };
}
