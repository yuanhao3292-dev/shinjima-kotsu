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

export interface ValidationResult {
  /** AI-1 提取后的补充版 StructuredCase */
  enrichedCase: StructuredCase;
  /** 补充了多少条 exam_findings */
  addedFindings: string[];
  /** 补充了多少条 red_flags */
  addedRedFlags: string[];
}

// ============================================================
// 关键医学指标的正则模式
// ============================================================

interface MedicalPattern {
  /** 指标名称 */
  name: string;
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
    pattern: /(?:agatston|calcium\s*score|カルシウムスコア|钙化评分|钙化积分|冠[動动]脈[硬石]化)[^\d]*?(\d+(?:\.\d+)?)/i,
    isAbnormal: (v) => v > 0,
    redFlagCondition: (v) => v > 400,
    redFlagDescription: '冠脉钙化评分极高 (Agatston >400)，严重冠状动脉粥样硬化风险',
    checkKeywords: ['agatston', '钙化评分', '钙化积分', 'calcium score', 'カルシウムスコア'],
  },
  // === 肿瘤标志物 ===
  {
    name: 'SCC (鳞状细胞癌抗原)',
    pattern: /SCC[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 1.5,
    redFlagCondition: (v) => v > 1.5,
    redFlagDescription: 'SCC 升高，需排除鳞状细胞癌 (肺/头颈)',
    checkKeywords: ['scc', '鳞状细胞'],
  },
  {
    name: 'CYFRA 21-1',
    pattern: /CYFRA[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 3.3,
    redFlagCondition: (v) => v > 3.3,
    redFlagDescription: 'CYFRA 升高，需排除非小细胞肺癌',
    checkKeywords: ['cyfra'],
  },
  {
    name: 'CEA (癌胚抗原)',
    pattern: /CEA[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 5.0,
    redFlagCondition: (v) => v > 10.0,
    redFlagDescription: 'CEA 显著升高，需排除消化道/肺恶性肿瘤',
    checkKeywords: ['cea', '癌胚抗原'],
  },
  {
    name: 'AFP (甲胎蛋白)',
    pattern: /AFP[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 10.0,
    redFlagCondition: (v) => v > 20.0,
    redFlagDescription: 'AFP 升高，需排除肝细胞癌',
    checkKeywords: ['afp', '甲胎蛋白'],
  },
  {
    name: 'CA19-9',
    pattern: /CA\s*19-?9[^\d]*?(\d+(?:\.\d+)?)\s*(?:U\/ml)?/i,
    isAbnormal: (v) => v > 37.0,
    redFlagCondition: (v) => v > 100.0,
    redFlagDescription: 'CA19-9 显著升高，需排除胰腺/胆道恶性肿瘤',
    checkKeywords: ['ca19-9', 'ca 19-9'],
  },
  {
    name: 'PSA (前列腺特异抗原)',
    pattern: /PSA[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 4.0,
    redFlagCondition: (v) => v > 10.0,
    redFlagDescription: 'PSA 显著升高，需排除前列腺癌',
    checkKeywords: ['psa', '前列腺'],
  },
  {
    name: 'CA125',
    pattern: /CA\s*125[^\d]*?(\d+(?:\.\d+)?)\s*(?:U\/ml)?/i,
    isAbnormal: (v) => v > 35.0,
    checkKeywords: ['ca125', 'ca 125'],
  },
  {
    name: 'NSE (神经元特异性烯醇化酶)',
    pattern: /NSE[^\d]*?(\d+(?:\.\d+)?)\s*(?:ng\/ml)?/i,
    isAbnormal: (v) => v > 16.3,
    checkKeywords: ['nse'],
  },
  {
    name: 'ProGRP',
    pattern: /ProGRP[^\d]*?(\d+(?:\.\d+)?)\s*(?:pg\/ml)?/i,
    isAbnormal: (v) => v > 81.0,
    checkKeywords: ['progrp'],
  },
  // === 心功能指标 ===
  {
    name: 'BNP',
    pattern: /(?:^|\s)BNP[^\d]*?(\d+(?:\.\d+)?)\s*(?:pg\/ml)?/i,
    isAbnormal: (v) => v > 100,
    redFlagCondition: (v) => v > 400,
    redFlagDescription: 'BNP 显著升高，提示心力衰竭',
    checkKeywords: ['bnp'],
  },
  {
    name: 'NT-proBNP',
    pattern: /NT-?proBNP[^\d]*?(\d+(?:\.\d+)?)\s*(?:pg\/ml)?/i,
    isAbnormal: (v) => v > 300,
    redFlagCondition: (v) => v > 900,
    redFlagDescription: 'NT-proBNP 显著升高，提示心力衰竭',
    checkKeywords: ['nt-probnp', 'ntprobnp'],
  },
  {
    name: 'Troponin',
    pattern: /(?:troponin|トロポニン|肌钙蛋白)[^\d]*?(\d+(?:\.\d+)?)/i,
    isAbnormal: (v) => v > 0.04,
    redFlagCondition: (v) => v > 0.04,
    redFlagDescription: 'Troponin 升高，提示心肌损伤',
    checkKeywords: ['troponin', 'トロポニン', '肌钙蛋白'],
  },
  {
    name: 'LVEF (左室射血分数)',
    pattern: /(?:LVEF|EF|射血分数|駆出率)[^\d]*?(\d+(?:\.\d+)?)\s*%?/i,
    isAbnormal: (v) => v < 50,
    redFlagCondition: (v) => v < 40,
    redFlagDescription: 'LVEF <40%，提示收缩性心力衰竭',
    checkKeywords: ['lvef', 'ef', '射血分数', '駆出率'],
  },
  {
    name: 'TAPSE',
    pattern: /TAPSE[^\d]*?(\d+(?:\.\d+)?)\s*(?:mm)?/i,
    isAbnormal: (v) => v < 17,
    redFlagCondition: (v) => v < 17,
    redFlagDescription: 'TAPSE 降低，提示右心功能不全',
    checkKeywords: ['tapse'],
  },
  // === 肾功能 ===
  {
    name: 'eGFR',
    pattern: /eGFR[^\d]*?(\d+(?:\.\d+)?)\s*(?:ml\/min)?/i,
    isAbnormal: (v) => v < 60,
    redFlagCondition: (v) => v < 30,
    redFlagDescription: 'eGFR <30，CKD G4-G5，严重肾功能不全',
    checkKeywords: ['egfr'],
  },
  {
    name: '血清肌酐',
    pattern: /(?:creatinine|クレアチニン|肌酐|Cr)[^\d]*?(\d+(?:\.\d+)?)\s*(?:mg\/dl|μmol\/l)?/i,
    isAbnormal: (v) => v > 1.2,
    checkKeywords: ['creatinine', 'クレアチニン', '肌酐'],
  },
  // === 代谢指标 ===
  {
    name: 'HbA1c',
    pattern: /HbA1c[^\d]*?(\d+(?:\.\d+)?)\s*%?/i,
    isAbnormal: (v) => v >= 6.5,
    redFlagCondition: (v) => v >= 10.0,
    redFlagDescription: 'HbA1c ≥10%，糖尿病控制极差',
    checkKeywords: ['hba1c'],
  },
  {
    name: 'LDL 胆固醇',
    pattern: /LDL[^\d]*?(\d+(?:\.\d+)?)\s*(?:mg\/dl)?/i,
    isAbnormal: (v) => v > 140,
    checkKeywords: ['ldl'],
  },
  // === 甲状腺 ===
  {
    name: 'TSH',
    pattern: /TSH[^\d]*?(\d+(?:\.\d+)?)\s*(?:μIU\/ml|mIU\/L)?/i,
    isAbnormal: (v) => v < 0.4 || v > 4.0,
    checkKeywords: ['tsh'],
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
 * @returns 补充后的 StructuredCase + 补漏统计
 */
export function validateExtraction(
  casePacket: CasePacket,
  structuredCase: StructuredCase
): ValidationResult {
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

    if (!alreadyExtracted) {
      const finding = `[验证器补充] ${mp.name}: ${rawValue} (异常)`;
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
        const flag = `[验证器补充] ${mp.redFlagDescription} (${rawValue})`;
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
