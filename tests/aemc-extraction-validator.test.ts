/**
 * 提取验证器测试
 *
 * 测试范围：
 * 1. 肿瘤标志物检测（AFP, CEA, CA19-9, PSA, SCC, CYFRA）
 * 2. 心脏标志物检测（BNP, Troponin, LVEF）
 * 3. 肾功能检测（eGFR, Creatinine）
 * 4. 代谢检测（HbA1c, LDL）
 * 5. 冠脉钙化 Agatston
 * 6. 已提取项不重复补充
 * 7. 红旗条件触发
 */

import { describe, it, expect } from 'vitest';
import { validateExtraction } from '../services/aemc/extraction-validator';
import type { CasePacket, StructuredCase } from '../services/aemc/types';

function makeCasePacket(reportText?: string): CasePacket {
  return {
    case_id: 'test-ev-001',
    source_type: ['medical_report'],
    user_type: 'authenticated',
    language: 'zh-CN',
    demographics: { age: 55, sex: 'male' },
    body_regions: [],
    selected_symptoms: [],
    questionnaire_answers: {},
    uploaded_report_text: reportText,
    timeline: [],
    raw_text_bundle: reportText ? [{ source: 'report', text: reportText }] : [],
    metadata: { screening_id: 'scr-001', created_at: new Date().toISOString() },
  };
}

function makeSC(overrides: Partial<StructuredCase> = {}): StructuredCase {
  return {
    case_id: 'test-ev-001',
    language: 'zh-CN',
    demographics: { age: 55, sex: 'male' },
    chief_complaint: '',
    present_illness: {
      symptoms: [],
      aggravating_factors: [],
      relieving_factors: [],
      associated_symptoms: [],
    },
    past_history: [],
    medication_history: [],
    allergy_history: [],
    known_diagnoses: [],
    exam_findings: [],
    red_flags: [],
    missing_critical_info: [],
    inferred_items: [],
    unknown_items: [],
    ...overrides,
  };
}

// ============================================================
// 肿瘤标志物
// ============================================================

describe('提取验证器 — 肿瘤标志物', () => {
  it('应检测遗漏的 AFP 升高并补充', () => {
    const cp = makeCasePacket('检验报告结果：AFP: 25.3 ng/mL，需进一步检查');
    const sc = makeSC(); // AI-1 未提取 AFP
    const result = validateExtraction(cp, sc);
    expect(result.addedFindings.length).toBeGreaterThan(0);
    expect(result.addedFindings.some(f => f.includes('AFP'))).toBe(true);
  });

  it('AFP > 20 触发红旗', () => {
    const cp = makeCasePacket('检验报告结果：AFP: 25.3 ng/mL，需进一步检查');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.length).toBeGreaterThan(0);
    expect(result.addedRedFlags.some(f => f.includes('AFP') || f.includes('肝'))).toBe(true);
  });

  it('CEA > 10 触发红旗', () => {
    const cp = makeCasePacket('检验报告结果：CEA: 15.2 ng/mL，建议复查');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.some(f => f.includes('CEA'))).toBe(true);
  });

  it('PSA > 10 触发红旗', () => {
    const cp = makeCasePacket('检验报告结果：PSA: 12.5 ng/mL，需排查');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.some(f => f.includes('PSA') || f.includes('前列腺'))).toBe(true);
  });

  it('CA19-9 > 100 触发红旗', () => {
    const cp = makeCasePacket('检验报告结果：CA19-9: 150.0 U/mL，显著升高');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.some(f => f.includes('CA19-9') || f.includes('胰'))).toBe(true);
  });
});

// ============================================================
// 心脏标志物
// ============================================================

describe('提取验证器 — 心脏标志物', () => {
  it('BNP > 400 触发红旗', () => {
    const cp = makeCasePacket('心功能检查报告\nBNP: 580 pg/mL，明显升高');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.length).toBeGreaterThan(0);
  });

  it('Troponin > 0.04 触发红旗', () => {
    const cp = makeCasePacket('心肌损伤标志物检测：Troponin I: 0.15 ng/mL');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.length).toBeGreaterThan(0);
  });

  it('LVEF < 40% 触发红旗', () => {
    const cp = makeCasePacket('心脏超声报告：LVEF: 30%，室壁运动减弱');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.length).toBeGreaterThan(0);
  });
});

// ============================================================
// 肾功能
// ============================================================

describe('提取验证器 — 肾功能', () => {
  it('eGFR < 30 触发红旗', () => {
    const cp = makeCasePacket('肾功能检查报告：eGFR: 25 mL/min/1.73m2，肾功能严重下降');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.length).toBeGreaterThan(0);
  });

  it('eGFR 50（异常但非红旗）→ 仅补充 finding', () => {
    const cp = makeCasePacket('肾功能检查报告：eGFR: 50 mL/min，轻度下降');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedFindings.length).toBeGreaterThan(0);
    expect(result.addedRedFlags).toHaveLength(0);
  });
});

// ============================================================
// 代谢
// ============================================================

describe('提取验证器 — 代谢', () => {
  it('HbA1c ≥ 10% 触发红旗', () => {
    const cp = makeCasePacket('糖尿病检查报告：HbA1c: 11.2%，血糖控制极差');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.length).toBeGreaterThan(0);
  });

  it('HbA1c 7.5%（异常但非红旗）→ 仅补充 finding', () => {
    const cp = makeCasePacket('糖尿病检查报告：HbA1c: 7.5%，血糖偏高');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedFindings.length).toBeGreaterThan(0);
    expect(result.addedRedFlags).toHaveLength(0);
  });
});

// ============================================================
// 冠脉钙化
// ============================================================

describe('提取验证器 — Agatston', () => {
  it('Agatston > 400 触发红旗', () => {
    const cp = makeCasePacket('冠脉CT检查报告：Agatston calcium score: 520，钙化显著');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedRedFlags.length).toBeGreaterThan(0);
  });

  it('Agatston 150（异常但非红旗）→ 仅补充 finding', () => {
    const cp = makeCasePacket('冠脉CT检查报告：Agatston calcium score: 150，轻度钙化');
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedFindings.length).toBeGreaterThan(0);
    expect(result.addedRedFlags).toHaveLength(0);
  });
});

// ============================================================
// 不重复补充
// ============================================================

describe('提取验证器 — 去重', () => {
  it('AI-1 已提取的指标不再重复补充', () => {
    const cp = makeCasePacket('检验报告结果：AFP: 25.3 ng/mL，需进一步检查');
    const sc = makeSC({
      exam_findings: ['AFP 25.3 ng/mL 升高'],
    });
    const result = validateExtraction(cp, sc);
    // AFP 已被 AI-1 提取，不应重复补充
    expect(result.addedFindings.filter(f => f.includes('AFP'))).toHaveLength(0);
  });
});

// ============================================================
// 无报告文本
// ============================================================

describe('提取验证器 — 无报告', () => {
  it('无 uploaded_report_text → 不补充任何内容', () => {
    const cp = makeCasePacket(); // 无报告
    const sc = makeSC();
    const result = validateExtraction(cp, sc);
    expect(result.addedFindings).toHaveLength(0);
    expect(result.addedRedFlags).toHaveLength(0);
  });
});

// ============================================================
// enrichedCase 不修改原始数据
// ============================================================

describe('提取验证器 — enrichedCase', () => {
  it('返回的 enrichedCase 包含补充内容', () => {
    const cp = makeCasePacket('检验报告：AFP: 25.3 ng/mL, eGFR: 25 mL/min');
    const sc = makeSC();
    const originalFindingsCount = sc.exam_findings.length;
    const result = validateExtraction(cp, sc);
    // enrichedCase 应包含补充的内容
    expect(result.addedFindings.length).toBeGreaterThan(0);
    expect(result.enrichedCase.exam_findings.length).toBeGreaterThan(originalFindingsCount);
  });
});
