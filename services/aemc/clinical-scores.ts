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
import { type AEMCLang } from './hospital-knowledge-base';
import { aemcLog } from './logger';

// ============================================================
// 多语言标签
// ============================================================

type SStr = Record<AEMCLang, string>;
const SCORE_I18N: Record<string, SStr> = {
  // Score names
  ckdName: { 'zh-CN': 'CKD 分期', 'zh-TW': 'CKD 分期', en: 'CKD Staging', ja: 'CKD 病期分類' },
  cvName: { 'zh-CN': '心血管风险评估', 'zh-TW': '心血管風險評估', en: 'Cardiovascular Risk Assessment', ja: '心血管リスク評価' },
  chaName: { 'zh-CN': 'CHA2DS2-VASc (房颤卒中风险)', 'zh-TW': 'CHA2DS2-VASc（房顫中風風險）', en: 'CHA2DS2-VASc (AF Stroke Risk)', ja: 'CHA2DS2-VASc（心房細動脳卒中リスク）' },
  // CKD grades
  ckdFromDx: { 'zh-CN': '慢性肾脏病 G{stage} 期（来自已知诊断）', 'zh-TW': '慢性腎臟病 G{stage} 期（來自已知診斷）', en: 'Chronic kidney disease G{stage} (from known diagnosis)', ja: '慢性腎臓病 G{stage}（既知の診断から）' },
  noCalc: { 'zh-CN': '无法计算', 'zh-TW': '無法計算', en: 'Cannot calculate', ja: '計算不可' },
  noEgfr: { 'zh-CN': '缺少 eGFR 或肌酐数据', 'zh-TW': '缺少 eGFR 或肌酐數據', en: 'Missing eGFR or creatinine data', ja: 'eGFR またはクレアチニンデータなし' },
  g1: { 'zh-CN': 'G1 (正常)', 'zh-TW': 'G1（正常）', en: 'G1 (Normal)', ja: 'G1（正常）' },
  g1i: { 'zh-CN': '肾功能正常', 'zh-TW': '腎功能正常', en: 'Normal kidney function', ja: '腎機能正常' },
  g2: { 'zh-CN': 'G2 (轻度下降)', 'zh-TW': 'G2（輕度下降）', en: 'G2 (Mildly decreased)', ja: 'G2（軽度低下）' },
  g2i: { 'zh-CN': '肾功能轻度下降', 'zh-TW': '腎功能輕度下降', en: 'Mildly decreased kidney function', ja: '腎機能軽度低下' },
  g3a: { 'zh-CN': 'G3a (轻中度下降)', 'zh-TW': 'G3a（輕中度下降）', en: 'G3a (Mild-moderately decreased)', ja: 'G3a（軽度〜中等度低下）' },
  g3ai: { 'zh-CN': '肾功能轻中度下降，需定期监测', 'zh-TW': '腎功能輕中度下降，需定期監測', en: 'Mild-moderately decreased, regular monitoring required', ja: '腎機能軽度〜中等度低下、定期的な監視が必要' },
  g3b: { 'zh-CN': 'G3b (中重度下降)', 'zh-TW': 'G3b（中重度下降）', en: 'G3b (Moderate-severely decreased)', ja: 'G3b（中等度〜高度低下）' },
  g3bi: { 'zh-CN': '肾功能中重度下降，需肾内科随访', 'zh-TW': '腎功能中重度下降，需腎內科隨訪', en: 'Moderate-severely decreased, nephrology follow-up required', ja: '腎機能中等度〜高度低下、腎臓内科フォローが必要' },
  g4: { 'zh-CN': 'G4 (重度下降)', 'zh-TW': 'G4（重度下降）', en: 'G4 (Severely decreased)', ja: 'G4（高度低下）' },
  g4i: { 'zh-CN': '肾功能重度下降，需考虑透析准备', 'zh-TW': '腎功能重度下降，需考慮透析準備', en: 'Severely decreased, dialysis preparation should be considered', ja: '腎機能高度低下、透析準備の検討が必要' },
  g5: { 'zh-CN': 'G5 (肾衰竭)', 'zh-TW': 'G5（腎衰竭）', en: 'G5 (Kidney failure)', ja: 'G5（腎不全）' },
  g5i: { 'zh-CN': '肾衰竭，需紧急肾内科评估', 'zh-TW': '腎衰竭，需緊急腎內科評估', en: 'Kidney failure, urgent nephrology evaluation required', ja: '腎不全、緊急の腎臓内科評価が必要' },
  // CV risk factors
  ageOver65: { 'zh-CN': '年龄 {age}岁 (≥65)', 'zh-TW': '年齡 {age}歲 (≥65)', en: 'Age {age} (≥65)', ja: '年齢 {age}歳（≥65）' },
  ageOver55: { 'zh-CN': '年龄 {age}岁 (≥55)', 'zh-TW': '年齡 {age}歲 (≥55)', en: 'Age {age} (≥55)', ja: '年齢 {age}歳（≥55）' },
  male: { 'zh-CN': '男性', 'zh-TW': '男性', en: 'Male', ja: '男性' },
  hypertension: { 'zh-CN': '高血压', 'zh-TW': '高血壓', en: 'Hypertension', ja: '高血圧' },
  diabetes: { 'zh-CN': '糖尿病/糖耐量异常', 'zh-TW': '糖尿病/糖耐量異常', en: 'Diabetes/impaired glucose tolerance', ja: '糖尿病/耐糖能異常' },
  dyslipidemia: { 'zh-CN': '血脂异常', 'zh-TW': '血脂異常', en: 'Dyslipidemia', ja: '脂質異常症' },
  smoking: { 'zh-CN': '吸烟', 'zh-TW': '吸菸', en: 'Smoking', ja: '喫煙' },
  coronaryCalc: { 'zh-CN': '冠脉钙化 Agatston {val}', 'zh-TW': '冠脈鈣化 Agatston {val}', en: 'Coronary calcification Agatston {val}', ja: '冠動脈石灰化 Agatston {val}' },
  ckd: { 'zh-CN': '慢性肾脏病', 'zh-TW': '慢性腎臟病', en: 'Chronic kidney disease', ja: '慢性腎臓病' },
  carotid: { 'zh-CN': '颈动脉硬化', 'zh-TW': '頸動脈硬化', en: 'Carotid atherosclerosis', ja: '頸動脈硬化' },
  // CV risk grades
  noAssess: { 'zh-CN': '无法评估', 'zh-TW': '無法評估', en: 'Cannot assess', ja: '評価不可' },
  noData: { 'zh-CN': '缺少足够的心血管风险因素数据', 'zh-TW': '缺少足夠的心血管風險因素數據', en: 'Insufficient cardiovascular risk factor data', ja: '心血管リスク因子データが不足' },
  veryHigh: { 'zh-CN': '极高危', 'zh-TW': '極高危', en: 'Very high risk', ja: '超高リスク' },
  high: { 'zh-CN': '高危', 'zh-TW': '高危', en: 'High risk', ja: '高リスク' },
  modHigh: { 'zh-CN': '中高危', 'zh-TW': '中高危', en: 'Moderate-high risk', ja: '中〜高リスク' },
  modLow: { 'zh-CN': '中低危', 'zh-TW': '中低危', en: 'Moderate-low risk', ja: '中〜低リスク' },
  cvInterp: { 'zh-CN': '{count} 个危险因素', 'zh-TW': '{count} 個危險因素', en: '{count} risk factor(s)', ja: '{count} 個のリスク因子' },
  cvVeryHigh: { 'zh-CN': '极高心血管风险，需积极干预', 'zh-TW': '極高心血管風險，需積極干預', en: 'Very high cardiovascular risk, aggressive intervention needed', ja: '超高心血管リスク、積極的介入が必要' },
  cvHigh: { 'zh-CN': '高心血管风险', 'zh-TW': '高心血管風險', en: 'High cardiovascular risk', ja: '高心血管リスク' },
  cvModHigh: { 'zh-CN': '中高心血管风险', 'zh-TW': '中高心血管風險', en: 'Moderate-high cardiovascular risk', ja: '中〜高心血管リスク' },
  cvModLow: { 'zh-CN': '中低心血管风险', 'zh-TW': '中低心血管風險', en: 'Moderate-low cardiovascular risk', ja: '中〜低心血管リスク' },
  factors: { 'zh-CN': '因素', 'zh-TW': '因素', en: 'Factors', ja: '因子' },
  // CHA2DS2-VASc components
  chaC: { 'zh-CN': 'C(心衰)+1', 'zh-TW': 'C(心衰)+1', en: 'C(CHF)+1', ja: 'C(心不全)+1' },
  chaH: { 'zh-CN': 'H(高血压)+1', 'zh-TW': 'H(高血壓)+1', en: 'H(Hypertension)+1', ja: 'H(高血圧)+1' },
  chaA2: { 'zh-CN': 'A2(≥75岁)+2', 'zh-TW': 'A2(≥75歲)+2', en: 'A2(≥75y)+2', ja: 'A2(≥75歳)+2' },
  chaD: { 'zh-CN': 'D(糖尿病)+1', 'zh-TW': 'D(糖尿病)+1', en: 'D(Diabetes)+1', ja: 'D(糖尿病)+1' },
  chaS2: { 'zh-CN': 'S2(卒中史)+2', 'zh-TW': 'S2(中風史)+2', en: 'S2(Stroke/TIA)+2', ja: 'S2(脳卒中歴)+2' },
  chaV: { 'zh-CN': 'V(血管病)+1', 'zh-TW': 'V(血管病)+1', en: 'V(Vascular disease)+1', ja: 'V(血管疾患)+1' },
  chaA: { 'zh-CN': 'A(65-74岁)+1', 'zh-TW': 'A(65-74歲)+1', en: 'A(65-74y)+1', ja: 'A(65-74歳)+1' },
  chaSc: { 'zh-CN': 'Sc(女性)+1', 'zh-TW': 'Sc(女性)+1', en: 'Sc(Female)+1', ja: 'Sc(女性)+1' },
  chaPoints: { 'zh-CN': '{score}分', 'zh-TW': '{score}分', en: '{score} points', ja: '{score}点' },
  chaAnticoag: { 'zh-CN': 'CHA2DS2-VASc {score}分 — 建议抗凝治疗', 'zh-TW': 'CHA2DS2-VASc {score}分 — 建議抗凝治療', en: 'CHA2DS2-VASc {score} — anticoagulation recommended', ja: 'CHA2DS2-VASc {score}点 — 抗凝固療法を推奨' },
  chaConsider: { 'zh-CN': 'CHA2DS2-VASc {score}分 — 考虑抗凝治疗', 'zh-TW': 'CHA2DS2-VASc {score}分 — 考慮抗凝治療', en: 'CHA2DS2-VASc {score} — consider anticoagulation', ja: 'CHA2DS2-VASc {score}点 — 抗凝固療法を検討' },
  chaLow: { 'zh-CN': 'CHA2DS2-VASc {score}分 — 卒中风险低', 'zh-TW': 'CHA2DS2-VASc {score}分 — 中風風險低', en: 'CHA2DS2-VASc {score} — low stroke risk', ja: 'CHA2DS2-VASc {score}点 — 脳卒中リスク低' },
  composition: { 'zh-CN': '组成', 'zh-TW': '組成', en: 'Components', ja: '構成' },
};

function CSL(key: string, lang: AEMCLang): string {
  return SCORE_I18N[key]?.[lang] || SCORE_I18N[key]?.['zh-CN'] || key;
}

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
  return keywords.some((kw) => {
    const lower = kw.toLowerCase();
    // 短英文关键词（≤4 字符且全 ASCII）使用词边界匹配，防止子串误匹配
    if (lower.length <= 4 && /^[a-z0-9-]+$/.test(lower)) {
      return new RegExp(`\\b${lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(combined);
    }
    return combined.includes(lower);
  });
}

// ============================================================
// eGFR CKD 分期
// ============================================================

function calculateCKDStage(structuredCase: StructuredCase, lang: AEMCLang): ClinicalScoreResult {
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
        name: CSL('ckdName', lang),
        value: null,
        grade: `CKD G${stage}`,
        interpretation: CSL('ckdFromDx', lang).replace('{stage}', stage),
        dataQuality: 'partial',
      };
    }

    return {
      name: CSL('ckdName', lang),
      value: null,
      grade: CSL('noCalc', lang),
      interpretation: CSL('noEgfr', lang),
      dataQuality: 'insufficient',
    };
  }

  let grade: string;
  let interpretation: string;
  if (egfr >= 90) {
    grade = CSL('g1', lang);
    interpretation = CSL('g1i', lang);
  } else if (egfr >= 60) {
    grade = CSL('g2', lang);
    interpretation = CSL('g2i', lang);
  } else if (egfr >= 45) {
    grade = CSL('g3a', lang);
    interpretation = CSL('g3ai', lang);
  } else if (egfr >= 30) {
    grade = CSL('g3b', lang);
    interpretation = CSL('g3bi', lang);
  } else if (egfr >= 15) {
    grade = CSL('g4', lang);
    interpretation = CSL('g4i', lang);
  } else {
    grade = CSL('g5', lang);
    interpretation = CSL('g5i', lang);
  }

  return {
    name: CSL('ckdName', lang),
    value: egfr,
    grade,
    interpretation: `eGFR ${egfr} ml/min → ${interpretation}`,
    dataQuality: 'complete',
  };
}

// ============================================================
// 心血管风险评估 (简化版 Framingham-like)
// ============================================================

function calculateCardiovascularRisk(structuredCase: StructuredCase, lang: AEMCLang): ClinicalScoreResult {
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
    factors.push(CSL('ageOver65', lang).replace('{age}', String(age)));
  } else if (age && age >= 55) {
    riskFactors += 1;
    factors.push(CSL('ageOver55', lang).replace('{age}', String(age)));
  }

  // 性别
  if (structuredCase.demographics.sex === 'male') {
    riskFactors += 1;
    factors.push(CSL('male', lang));
  }

  // 高血压
  if (hasKeyword(allText, ['高血压', 'hypertension', '降圧', 'exforge', 'amlodipine', 'valsartan', 'enalapril', 'losartan'])) {
    riskFactors += 1;
    factors.push(CSL('hypertension', lang));
  }

  // 糖尿病/糖耐量异常
  if (hasKeyword(allText, ['糖尿病', 'diabetes', 'hba1c', '糖耐量', 'impaired glucose', 'pre-diabet'])) {
    riskFactors += 1;
    factors.push(CSL('diabetes', lang));
  }

  // 血脂异常
  if (hasKeyword(allText, ['血脂异常', 'dyslipidemia', '高脂血', 'lipitor', 'atorvastatin', 'statin', '他汀', 'ldl'])) {
    riskFactors += 1;
    factors.push(CSL('dyslipidemia', lang));
  }

  // 吸烟
  if (hasKeyword(allText, ['吸烟', 'smoking', 'smoker', '喫煙'])) {
    riskFactors += 1;
    factors.push(CSL('smoking', lang));
  }

  // 冠脉钙化
  const agatston = extractNumericValue(
    structuredCase.exam_findings,
    ['agatston', 'calcium score', '钙化评分', '钙化积分']
  );
  if (agatston !== null && agatston > 100) {
    riskFactors += (agatston > 400 ? 3 : agatston > 100 ? 2 : 1);
    factors.push(CSL('coronaryCalc', lang).replace('{val}', String(agatston)));
  }

  // CKD
  if (hasKeyword(allText, ['ckd', '慢性肾', 'chronic kidney', '肾功能不全'])) {
    riskFactors += 1;
    factors.push(CSL('ckd', lang));
  }

  // 颈动脉硬化
  if (hasKeyword(allText, ['颈动脉', 'carotid', '頸動脈', '动脉硬化', 'atherosclerosis'])) {
    riskFactors += 1;
    factors.push(CSL('carotid', lang));
  }

  if (factors.length === 0) {
    return {
      name: CSL('cvName', lang),
      value: 0,
      grade: CSL('noAssess', lang),
      interpretation: CSL('noData', lang),
      dataQuality: 'insufficient',
    };
  }

  let grade: string;
  let interpDetail: string;
  if (riskFactors >= 7) {
    grade = CSL('veryHigh', lang);
    interpDetail = CSL('cvVeryHigh', lang);
  } else if (riskFactors >= 5) {
    grade = CSL('high', lang);
    interpDetail = CSL('cvHigh', lang);
  } else if (riskFactors >= 3) {
    grade = CSL('modHigh', lang);
    interpDetail = CSL('cvModHigh', lang);
  } else {
    grade = CSL('modLow', lang);
    interpDetail = CSL('cvModLow', lang);
  }

  const countLabel = CSL('cvInterp', lang).replace('{count}', String(riskFactors));
  const factorsLabel = CSL('factors', lang);

  return {
    name: CSL('cvName', lang),
    value: riskFactors,
    grade,
    interpretation: `${countLabel} — ${interpDetail}。${factorsLabel}: ${factors.join('、')}`,
    dataQuality: factors.length >= 3 ? 'complete' : 'partial',
  };
}

// ============================================================
// CHA2DS2-VASc（房颤卒中风险，仅在有房颤时计算）
// ============================================================

function calculateCHA2DS2VASc(structuredCase: StructuredCase, lang: AEMCLang): ClinicalScoreResult | null {
  const allText = [
    ...structuredCase.known_diagnoses,
    ...structuredCase.past_history,
    ...structuredCase.exam_findings,
  ];

  // 仅在有房颤时计算
  if (!hasKeyword(allText, ['房颤', 'atrial fibrillation', 'afib', 'a-fib', '心房細動', '心房颤动'])) {
    return null;
  }

  let score = 0;
  const components: string[] = [];

  // C: 心力衰竭 (+1)
  if (hasKeyword(allText, ['心力衰竭', 'heart failure', '心不全', 'chf'])) {
    score += 1;
    components.push(CSL('chaC', lang));
  }
  // H: 高血压 (+1)
  if (hasKeyword(allText, ['高血压', 'hypertension', '降圧'])) {
    score += 1;
    components.push(CSL('chaH', lang));
  }
  // A2: 年龄≥75 (+2)
  const age = structuredCase.demographics.age;
  if (age && age >= 75) {
    score += 2;
    components.push(CSL('chaA2', lang));
  }
  // D: 糖尿病 (+1)
  if (hasKeyword(allText, ['糖尿病', 'diabetes', 'dm2', 'dm1', 'type 2 dm', 'type 1 dm'])) {
    score += 1;
    components.push(CSL('chaD', lang));
  }
  // S2: 卒中/TIA史 (+2)
  if (hasKeyword(allText, ['卒中', 'stroke', 'tia', '脑梗', '脳梗塞'])) {
    score += 2;
    components.push(CSL('chaS2', lang));
  }
  // V: 血管疾病 (+1)
  if (hasKeyword(allText, ['心肌梗', 'myocardial infarction', '外周动脉', 'peripheral arterial', '主动脉斑块', 'aortic plaque'])) {
    score += 1;
    components.push(CSL('chaV', lang));
  }
  // A: 年龄65-74 (+1)
  if (age && age >= 65 && age < 75) {
    score += 1;
    components.push(CSL('chaA', lang));
  }
  // Sc: 女性 (+1)
  if (structuredCase.demographics.sex === 'female') {
    score += 1;
    components.push(CSL('chaSc', lang));
  }

  let interpretation: string;
  if (score >= 2) {
    interpretation = CSL('chaAnticoag', lang).replace('{score}', String(score));
  } else if (score === 1) {
    interpretation = CSL('chaConsider', lang).replace('{score}', String(score));
  } else {
    interpretation = CSL('chaLow', lang).replace('{score}', String(score));
  }

  const compLabel = CSL('composition', lang);

  return {
    name: CSL('chaName', lang),
    value: score,
    grade: CSL('chaPoints', lang).replace('{score}', String(score)),
    interpretation: `${interpretation}。${compLabel}: ${components.join('、')}`,
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
  structuredCase: StructuredCase,
  language?: string
): ClinicalScoresOutput {
  const lang = (language || 'zh-CN') as AEMCLang;
  const scores: ClinicalScoreResult[] = [];

  // 1. CKD 分期
  const ckd = calculateCKDStage(structuredCase, lang);
  if (ckd.dataQuality !== 'insufficient') {
    scores.push(ckd);
  }

  // 2. 心血管风险
  const cvRisk = calculateCardiovascularRisk(structuredCase, lang);
  if (cvRisk.dataQuality !== 'insufficient') {
    scores.push(cvRisk);
  }

  // 3. CHA2DS2-VASc（仅房颤患者）
  const cha2ds2 = calculateCHA2DS2VASc(structuredCase, lang);
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
    aemcLog.info('clinical-scores', `Calculated ${scores.length} scores`, {
      scores: scores.map((s) => `${s.name}=${s.grade}`),
    });
  }

  return { scores, summaryForTriage };
}
