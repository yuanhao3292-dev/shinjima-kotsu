/**
 * 提取验证器 (Extraction Validator)
 *
 * 在 AI-1 输出后、AI-2 输入前执行。
 * 用正则表达式扫描 OCR 原文，检查 AI-1 是否遗漏了关键异常值。
 * 如果发现遗漏，自动补充到 StructuredCase 的 exam_findings 和 red_flags 中。
 *
 * 设计原则：
 * - 纯确定性逻辑，无 AI 调用
 * - 宁可误报，不可漏报（downstream AI 可以剔除误报）
 * - 不修改 AI-1 已提取的内容，只追加遗漏项
 */

import type { CasePacket, StructuredCase } from './types';
import { type AEMCLang } from './hospital-knowledge-base';

export interface ValidationResult {
  /** AI-1 提取后的补充版 StructuredCase */
  enrichedCase: StructuredCase;
  /** 补充了多少条 exam_findings */
  addedFindings: string[];
  /** 补充了多少条 red_flags */
  addedRedFlags: string[];
}

// ============================================================
// 多语言标签
// ============================================================

type VStr = Record<AEMCLang, string>;
const VAL_I18N: Record<string, VStr> = {
  prefix: { 'zh-CN': '[验证器补充]', 'zh-TW': '[驗證器補充]', en: '[Validator supplement]', ja: '[バリデータ補足]' },
  abnormal: { 'zh-CN': '异常', 'zh-TW': '異常', en: 'abnormal', ja: '異常' },
};

function VL(key: string, lang: AEMCLang): string {
  return VAL_I18N[key]?.[lang] || VAL_I18N[key]?.['zh-CN'] || key;
}

/** Per-pattern i18n: name + redFlagDescription */
interface PatternI18n { name: string; redFlagDescription?: string }
const PATTERN_I18N: Record<string, Partial<Record<AEMCLang, PatternI18n>>> = {
  agatston: {
    'zh-TW': { name: 'Agatston 冠脈鈣化評分', redFlagDescription: '冠脈鈣化評分極高 (Agatston >400)，嚴重冠狀動脈粥樣硬化風險' },
    en: { name: 'Agatston Coronary Calcium Score', redFlagDescription: 'Very high coronary calcium score (Agatston >400), severe coronary atherosclerosis risk' },
    ja: { name: 'Agatston 冠動脈石灰化スコア', redFlagDescription: '冠動脈石灰化スコア極めて高値（Agatston >400）、重度冠動脈硬化リスク' },
  },
  scc: {
    'zh-TW': { name: 'SCC（鱗狀細胞癌抗原）', redFlagDescription: 'SCC 升高，需排除鱗狀細胞癌（肺/頭頸）' },
    en: { name: 'SCC (Squamous Cell Carcinoma Antigen)', redFlagDescription: 'Elevated SCC, rule out squamous cell carcinoma (lung/head & neck)' },
    ja: { name: 'SCC（扁平上皮癌抗原）', redFlagDescription: 'SCC 高値、扁平上皮癌の除外が必要（肺/頭頸部）' },
  },
  cyfra: {
    'zh-TW': { name: 'CYFRA 21-1', redFlagDescription: 'CYFRA 升高，需排除非小細胞肺癌' },
    en: { name: 'CYFRA 21-1', redFlagDescription: 'Elevated CYFRA, rule out non-small cell lung cancer' },
    ja: { name: 'CYFRA 21-1', redFlagDescription: 'CYFRA 高値、非小細胞肺癌の除外が必要' },
  },
  cea: {
    'zh-TW': { name: 'CEA（癌胚抗原）', redFlagDescription: 'CEA 顯著升高，需排除消化道/肺惡性腫瘤' },
    en: { name: 'CEA (Carcinoembryonic Antigen)', redFlagDescription: 'Significantly elevated CEA, rule out GI/lung malignancy' },
    ja: { name: 'CEA（癌胎児性抗原）', redFlagDescription: 'CEA 著明高値、消化管/肺悪性腫瘍の除外が必要' },
  },
  afp: {
    'zh-TW': { name: 'AFP（甲胎蛋白）', redFlagDescription: 'AFP 升高，需排除肝細胞癌' },
    en: { name: 'AFP (Alpha-fetoprotein)', redFlagDescription: 'Elevated AFP, rule out hepatocellular carcinoma' },
    ja: { name: 'AFP（αフェトプロテイン）', redFlagDescription: 'AFP 高値、肝細胞癌の除外が必要' },
  },
  ca199: {
    'zh-TW': { name: 'CA19-9', redFlagDescription: 'CA19-9 顯著升高，需排除胰腺/膽道惡性腫瘤' },
    en: { name: 'CA19-9', redFlagDescription: 'Significantly elevated CA19-9, rule out pancreatic/biliary malignancy' },
    ja: { name: 'CA19-9', redFlagDescription: 'CA19-9 著明高値、膵臓/胆道悪性腫瘍の除外が必要' },
  },
  psa: {
    'zh-TW': { name: 'PSA（前列腺特異抗原）', redFlagDescription: 'PSA 顯著升高，需排除前列腺癌' },
    en: { name: 'PSA (Prostate-Specific Antigen)', redFlagDescription: 'Significantly elevated PSA, rule out prostate cancer' },
    ja: { name: 'PSA（前立腺特異抗原）', redFlagDescription: 'PSA 著明高値、前立腺癌の除外が必要' },
  },
  ca125: {
    'zh-TW': { name: 'CA125' },
    en: { name: 'CA125' },
    ja: { name: 'CA125' },
  },
  nse: {
    'zh-TW': { name: 'NSE（神經元特異性烯醇化酶）' },
    en: { name: 'NSE (Neuron-Specific Enolase)' },
    ja: { name: 'NSE（神経特異エノラーゼ）' },
  },
  progrp: {
    'zh-TW': { name: 'ProGRP' },
    en: { name: 'ProGRP' },
    ja: { name: 'ProGRP' },
  },
  bnp: {
    'zh-TW': { name: 'BNP', redFlagDescription: 'BNP 顯著升高，提示心力衰竭' },
    en: { name: 'BNP', redFlagDescription: 'Significantly elevated BNP, suggests heart failure' },
    ja: { name: 'BNP', redFlagDescription: 'BNP 著明高値、心不全を示唆' },
  },
  ntprobnp: {
    'zh-TW': { name: 'NT-proBNP', redFlagDescription: 'NT-proBNP 顯著升高，提示心力衰竭' },
    en: { name: 'NT-proBNP', redFlagDescription: 'Significantly elevated NT-proBNP, suggests heart failure' },
    ja: { name: 'NT-proBNP', redFlagDescription: 'NT-proBNP 著明高値、心不全を示唆' },
  },
  troponin: {
    'zh-TW': { name: 'Troponin', redFlagDescription: 'Troponin 升高，提示心肌損傷' },
    en: { name: 'Troponin', redFlagDescription: 'Elevated Troponin, suggests myocardial injury' },
    ja: { name: 'トロポニン', redFlagDescription: 'トロポニン高値、心筋障害を示唆' },
  },
  lvef: {
    'zh-TW': { name: 'LVEF（左室射血分數）', redFlagDescription: 'LVEF <40%，提示收縮性心力衰竭' },
    en: { name: 'LVEF (Left Ventricular Ejection Fraction)', redFlagDescription: 'LVEF <40%, suggests systolic heart failure' },
    ja: { name: 'LVEF（左室駆出率）', redFlagDescription: 'LVEF <40%、収縮性心不全を示唆' },
  },
  tapse: {
    'zh-TW': { name: 'TAPSE', redFlagDescription: 'TAPSE 降低，提示右心功能不全' },
    en: { name: 'TAPSE', redFlagDescription: 'Decreased TAPSE, suggests right ventricular dysfunction' },
    ja: { name: 'TAPSE', redFlagDescription: 'TAPSE 低下、右心機能不全を示唆' },
  },
  egfr: {
    'zh-TW': { name: 'eGFR', redFlagDescription: 'eGFR <30，CKD G4-G5，嚴重腎功能不全' },
    en: { name: 'eGFR', redFlagDescription: 'eGFR <30, CKD G4-G5, severe renal insufficiency' },
    ja: { name: 'eGFR', redFlagDescription: 'eGFR <30、CKD G4-G5、重度腎機能不全' },
  },
  creatinine: {
    'zh-TW': { name: '血清肌酐' },
    en: { name: 'Serum Creatinine' },
    ja: { name: '血清クレアチニン' },
  },
  hba1c: {
    'zh-TW': { name: 'HbA1c', redFlagDescription: 'HbA1c ≥10%，糖尿病控制極差' },
    en: { name: 'HbA1c', redFlagDescription: 'HbA1c ≥10%, very poorly controlled diabetes' },
    ja: { name: 'HbA1c', redFlagDescription: 'HbA1c ≥10%、糖尿病コントロール極めて不良' },
  },
  ldl: {
    'zh-TW': { name: 'LDL 膽固醇' },
    en: { name: 'LDL Cholesterol' },
    ja: { name: 'LDL コレステロール' },
  },
  tsh: {
    'zh-TW': { name: 'TSH' },
    en: { name: 'TSH' },
    ja: { name: 'TSH' },
  },
  hbsag: {
    'zh-TW': { name: 'HBsAg（乙肝表面抗原）' },
    en: { name: 'HBsAg (Hepatitis B Surface Antigen)' },
    ja: { name: 'HBsAg（B型肝炎表面抗原）' },
  },
  hbvdna: {
    'zh-TW': { name: 'HBV DNA' },
    en: { name: 'HBV DNA' },
    ja: { name: 'HBV DNA' },
  },
  antihcv: {
    'zh-TW': { name: 'Anti-HCV（丙肝抗體）' },
    en: { name: 'Anti-HCV (Hepatitis C Antibody)' },
    ja: { name: 'Anti-HCV（C型肝炎抗体）' },
  },
};

// ============================================================
// 关键医学指标的正则模式
// ============================================================

interface MedicalPattern {
  /** 指标名称 */
  name: string;
  /** i18n key */
  i18nKey: string;
  /** 匹配正则 — 尽量捕获指标名称+数值 */
  pattern: RegExp;
  /** 如果数值满足条件则视为异常 */
  isAbnormal?: (value: number) => boolean;
  /** 固定标记为异常（某些指标只要出现在报告中就是重要的） */
  alwaysFlag?: boolean;
  /** 触发红旗的条件 */
  redFlagCondition?: (value: number) => boolean;
  /** 红旗描述 */
  redFlagDescription?: string;
  /** 用于检查 exam_findings 中是否已提取的关键词 */
  checkKeywords: string[];
}

const MEDICAL_PATTERNS: MedicalPattern[] = [
  // === 冠脉钙化评分 ===
  {
    name: 'Agatston 冠脉钙化评分',
    i18nKey: 'agatston',
    pattern: /(?:agatston|calcium\s*score|カルシウムスコア|钙化评分|钙化积分|冠[動动]脈[硬石]化)[^\d]*?(\d+(?:\.\d+)?)/i,
    isAbnormal: (v) => v > 0,
    redFlagCondition: (v) => v > 400,
    redFlagDescription: '冠脉钙化评分极高 (Agatston >400)，严重冠状动脉粥样硬化风险',
    checkKeywords: ['agatston', '钙化评分', '钙化积分', 'calcium score', 'カルシウムスコア'],
  },
  // === 肿瘤标志物 ===
  {
    name: 'SCC (鳞状细胞癌抗原)',
    i18nKey: 'scc',
    pattern: /SCC[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 1.5,
    redFlagCondition: (v) => v > 1.5,
    redFlagDescription: 'SCC 升高，需排除鳞状细胞癌 (肺/头颈)',
    checkKeywords: ['scc', '鳞状细胞'],
  },
  {
    name: 'CYFRA 21-1',
    i18nKey: 'cyfra',
    pattern: /CYFRA[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 3.3,
    redFlagCondition: (v) => v > 3.3,
    redFlagDescription: 'CYFRA 升高，需排除非小细胞肺癌',
    checkKeywords: ['cyfra'],
  },
  {
    name: 'CEA (癌胚抗原)',
    i18nKey: 'cea',
    pattern: /CEA[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 5.0,
    redFlagCondition: (v) => v > 10.0,
    redFlagDescription: 'CEA 显著升高，需排除消化道/肺恶性肿瘤',
    checkKeywords: ['cea', '癌胚抗原'],
  },
  {
    name: 'AFP (甲胎蛋白)',
    i18nKey: 'afp',
    pattern: /AFP[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 10.0,
    redFlagCondition: (v) => v > 20.0,
    redFlagDescription: 'AFP 升高，需排除肝细胞癌',
    checkKeywords: ['afp', '甲胎蛋白'],
  },
  {
    name: 'CA19-9',
    i18nKey: 'ca199',
    pattern: /CA\s*19-?9[^\d]*?(\d+(?:\.\d+)?)\s*(?:U\/ml)?/i,
    isAbnormal: (v) => v > 37.0,
    redFlagCondition: (v) => v > 100.0,
    redFlagDescription: 'CA19-9 显著升高，需排除胰腺/胆道恶性肿瘤',
    checkKeywords: ['ca19-9', 'ca 19-9'],
  },
  {
    name: 'PSA (前列腺特异抗原)',
    i18nKey: 'psa',
    pattern: /PSA[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 4.0,
    redFlagCondition: (v) => v > 10.0,
    redFlagDescription: 'PSA 显著升高，需排除前列腺癌',
    checkKeywords: ['psa', '前列腺'],
  },
  {
    name: 'CA125',
    i18nKey: 'ca125',
    pattern: /CA\s*125[^\d]*?(\d+(?:\.\d+)?)\s*(?:U\/ml)?/i,
    isAbnormal: (v) => v > 35.0,
    checkKeywords: ['ca125', 'ca 125'],
  },
  {
    name: 'NSE (神经元特异性烯醇化酶)',
    i18nKey: 'nse',
    pattern: /NSE[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 16.3,
    checkKeywords: ['nse'],
  },
  {
    name: 'ProGRP',
    i18nKey: 'progrp',
    pattern: /ProGRP[^\d]*?(\d+(?:\.\d+)?)\s*(?:pg\/ml)?/i,
    isAbnormal: (v) => v > 81.0,
    checkKeywords: ['progrp'],
  },
  // === 心功能指标 ===
  {
    name: 'BNP',
    i18nKey: 'bnp',
    pattern: /(?:^|\s)BNP[^\d]*?(\d+(?:\.\d+)?)\s*(?:pg\/ml)?/i,
    isAbnormal: (v) => v > 100,
    redFlagCondition: (v) => v > 400,
    redFlagDescription: 'BNP 显著升高，提示心力衰竭',
    checkKeywords: ['bnp'],
  },
  {
    name: 'NT-proBNP',
    i18nKey: 'ntprobnp',
    pattern: /NT-?proBNP[^\d]*?(\d+(?:\.\d+)?)\s*(?:pg\/ml)?/i,
    isAbnormal: (v) => v > 300,
    redFlagCondition: (v) => v > 900,
    redFlagDescription: 'NT-proBNP 显著升高，提示心力衰竭',
    checkKeywords: ['nt-probnp', 'ntprobnp'],
  },
  {
    name: 'Troponin',
    i18nKey: 'troponin',
    pattern: /(?:troponin|トロポニン|肌钙蛋白)[^\d]*?(\d+(?:\.\d+)?)/i,
    isAbnormal: (v) => v > 0.04,
    redFlagCondition: (v) => v > 0.04,
    redFlagDescription: 'Troponin 升高，提示心肌损伤',
    checkKeywords: ['troponin', 'トロポニン', '肌钙蛋白'],
  },
  {
    name: 'LVEF (左室射血分数)',
    i18nKey: 'lvef',
    pattern: /(?:LVEF|EF|射血分数|駆出率)[^\d]*?(\d+(?:\.\d+)?)\s*%?/i,
    isAbnormal: (v) => v < 50,
    redFlagCondition: (v) => v < 40,
    redFlagDescription: 'LVEF <40%，提示收缩性心力衰竭',
    checkKeywords: ['lvef', 'ef', '射血分数', '駆出率'],
  },
  {
    name: 'TAPSE',
    i18nKey: 'tapse',
    pattern: /TAPSE[^\d]*?(\d+(?:\.\d+)?)\s*(?:mm)?/i,
    isAbnormal: (v) => v < 17,
    redFlagCondition: (v) => v < 17,
    redFlagDescription: 'TAPSE 降低，提示右心功能不全',
    checkKeywords: ['tapse'],
  },
  // === 肾功能 ===
  {
    name: 'eGFR',
    i18nKey: 'egfr',
    pattern: /eGFR[^\d]*?(\d+(?:\.\d+)?)\s*(?:ml\/min)?/i,
    isAbnormal: (v) => v < 60,
    redFlagCondition: (v) => v < 30,
    redFlagDescription: 'eGFR <30，CKD G4-G5，严重肾功能不全',
    checkKeywords: ['egfr'],
  },
  {
    name: '血清肌酐',
    i18nKey: 'creatinine',
    pattern: /(?:creatinine|クレアチニン|肌酐|Cr)[^\d]*?(\d+(?:\.\d+)?)\s*(?:mg\/dl|μmol\/l)?/i,
    isAbnormal: (v) => v > 1.2,
    checkKeywords: ['creatinine', 'クレアチニン', '肌酐'],
  },
  // === 代谢指标 ===
  {
    name: 'HbA1c',
    i18nKey: 'hba1c',
    pattern: /HbA1c[^\d]*?(\d+(?:\.\d+)?)\s*%?/i,
    isAbnormal: (v) => v >= 6.5,
    redFlagCondition: (v) => v >= 10.0,
    redFlagDescription: 'HbA1c ≥10%，糖尿病控制极差',
    checkKeywords: ['hba1c'],
  },
  {
    name: 'LDL 胆固醇',
    i18nKey: 'ldl',
    pattern: /LDL[^\d]*?(\d+(?:\.\d+)?)\s*(?:mg\/dl)?/i,
    isAbnormal: (v) => v > 140,
    checkKeywords: ['ldl'],
  },
  // === 甲状腺 ===
  {
    name: 'TSH',
    i18nKey: 'tsh',
    pattern: /TSH[^\d]*?(\d+(?:\.\d+)?)\s*(?:μIU\/ml|mIU\/L)?/i,
    isAbnormal: (v) => v < 0.4 || v > 4.0,
    checkKeywords: ['tsh'],
  },
  // === 肝炎标志物 ===
  {
    name: 'HBsAg (乙肝表面抗原)',
    i18nKey: 'hbsag',
    pattern: /HBsAg[^\d]*?(\d+(?:\.\d+)?)\s*(?:IU\/ml|COI)?/i,
    alwaysFlag: true,
    checkKeywords: ['hbsag', '乙肝表面抗原', 'b型肝炎'],
  },
  {
    name: 'HBV DNA',
    i18nKey: 'hbvdna',
    pattern: /HBV\s*DNA[^\d]*?(\d+(?:\.\d+)?)/i,
    alwaysFlag: true,
    checkKeywords: ['hbv dna', 'hbv-dna'],
  },
  {
    name: 'Anti-HCV (丙肝抗体)',
    i18nKey: 'antihcv',
    pattern: /(?:anti-?HCV|HCV\s*(?:Ab|抗体))[^\d]*?(\d+(?:\.\d+)?)/i,
    alwaysFlag: true,
    checkKeywords: ['anti-hcv', 'hcv', '丙肝'],
  },
];

// ============================================================
// 主入口
// ============================================================

/**
 * 验证 AI-1 的提取结果，补充遗漏的关键指标
 *
 * @param casePacket 原始输入（含 OCR 文本）
 * @param structuredCase AI-1 的输出
 * @param language 输出语言
 * @returns 补充后的 StructuredCase + 补漏统计
 */
export function validateExtraction(
  casePacket: CasePacket,
  structuredCase: StructuredCase,
  language?: string
): ValidationResult {
  const lang = (language || 'zh-CN') as AEMCLang;
  const addedFindings: string[] = [];
  const addedRedFlags: string[] = [];

  // 只有在存在上传报告文本时才执行验证
  const reportText = casePacket.uploaded_report_text;
  if (!reportText || reportText.trim().length < 10) {
    return { enrichedCase: structuredCase, addedFindings, addedRedFlags };
  }

  // 将现有 exam_findings 合并为检索文本
  const existingFindings = structuredCase.exam_findings.join(' ').toLowerCase();
  const existingRedFlags = structuredCase.red_flags.join(' ').toLowerCase();
  const prefix = VL('prefix', lang);
  const abnormalLabel = VL('abnormal', lang);

  // 扫描每个医学指标模式
  for (const mp of MEDICAL_PATTERNS) {
    const match = reportText.match(mp.pattern);
    if (!match) continue;

    const rawValue = parseFloat(match[1]);
    if (isNaN(rawValue)) continue;

    // 检查是否异常
    const abnormal = mp.alwaysFlag || (mp.isAbnormal && mp.isAbnormal(rawValue));
    if (!abnormal) continue;

    // 检查 AI-1 是否已提取
    const alreadyExtracted = mp.checkKeywords.some(
      (kw) => existingFindings.includes(kw.toLowerCase())
    );

    // 获取本地化名称
    const localName = PATTERN_I18N[mp.i18nKey]?.[lang]?.name || mp.name;

    if (!alreadyExtracted) {
      const finding = `${prefix} ${localName}: ${rawValue} (${abnormalLabel})`;
      structuredCase.exam_findings.push(finding);
      addedFindings.push(finding);
      console.info(`[ExtractionValidator] 补充遗漏指标: ${mp.name} = ${rawValue}`);
    }

    // 检查是否需要添加红旗
    if (mp.redFlagCondition && mp.redFlagCondition(rawValue) && mp.redFlagDescription) {
      const alreadyFlagged = mp.checkKeywords.some(
        (kw) => existingRedFlags.includes(kw.toLowerCase())
      );

      if (!alreadyFlagged) {
        const localDesc = PATTERN_I18N[mp.i18nKey]?.[lang]?.redFlagDescription || mp.redFlagDescription;
        const flag = `${prefix} ${localDesc} (${rawValue})`;
        structuredCase.red_flags.push(flag);
        addedRedFlags.push(flag);
        console.info(`[ExtractionValidator] 补充红旗: ${mp.redFlagDescription}`);
      }
    }
  }

  if (addedFindings.length > 0 || addedRedFlags.length > 0) {
    console.info(
      `[ExtractionValidator] 补充完成: +${addedFindings.length} findings, +${addedRedFlags.length} red flags`
    );
  }

  return {
    enrichedCase: structuredCase,
    addedFindings,
    addedRedFlags,
  };
}
