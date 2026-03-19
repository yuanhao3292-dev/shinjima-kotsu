/**
 * 临床评分计算器测试
 *
 * 测试范围：
 * 1. CKD 分期（eGFR → G1-G5）
 * 2. 心血管风险评估（Framingham-like 简化版）
 * 3. CHA2DS2-VASc（房颤卒中风险）
 * 4. 边界值、数据不足、多语言
 */

import { describe, it, expect } from 'vitest';
import { calculateClinicalScores } from '../services/aemc/clinical-scores';
import type { StructuredCase } from '../services/aemc/types';

function makeSC(overrides: Partial<StructuredCase> = {}): StructuredCase {
  return {
    case_id: 'test-cs-001',
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
// CKD 分期
// ============================================================

describe('CKD 分期 (eGFR)', () => {
  it('eGFR 95 → G1 正常', () => {
    const sc = makeSC({ exam_findings: ['eGFR 95 mL/min'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd).toBeDefined();
    expect(ckd!.value).toBe(95);
    expect(ckd!.grade).toContain('G1');
    expect(ckd!.dataQuality).toBe('complete');
  });

  it('eGFR 72 → G2 轻度下降', () => {
    const sc = makeSC({ exam_findings: ['eGFR 72'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.grade).toContain('G2');
  });

  it('eGFR 50 → G3a 轻中度下降', () => {
    const sc = makeSC({ exam_findings: ['GFR 50 mL/min'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.grade).toContain('G3a');
  });

  it('eGFR 35 → G3b 中重度下降', () => {
    const sc = makeSC({ exam_findings: ['eGFR 35'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.grade).toContain('G3b');
  });

  it('eGFR 20 → G4 重度下降', () => {
    const sc = makeSC({ exam_findings: ['eGFR 20'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.grade).toContain('G4');
  });

  it('eGFR 8 → G5 肾衰竭', () => {
    const sc = makeSC({ exam_findings: ['eGFR 8 mL/min/1.73m2'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.grade).toContain('G5');
  });

  it('边界值 eGFR 90 → G1', () => {
    const sc = makeSC({ exam_findings: ['eGFR 90'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.grade).toContain('G1');
  });

  it('边界值 eGFR 60 → G2', () => {
    const sc = makeSC({ exam_findings: ['eGFR 60'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.grade).toContain('G2');
  });

  it('边界值 eGFR 45 → G3a', () => {
    const sc = makeSC({ exam_findings: ['eGFR 45'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.grade).toContain('G3a');
  });

  it('已知诊断 CKD G3 也能提取', () => {
    const sc = makeSC({ known_diagnoses: ['CKD G3a'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd).toBeDefined();
    expect(ckd!.dataQuality).toBe('partial');
  });

  it('无 eGFR 数据 → 不输出 CKD 评分', () => {
    const sc = makeSC({ exam_findings: ['血红蛋白 130g/L'] });
    const { scores } = calculateClinicalScores(sc);
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd).toBeUndefined();
  });
});

// ============================================================
// 心血管风险评估
// ============================================================

describe('心血管风险评估 (Framingham-like)', () => {
  it('无任何风险因素 → 不输出评分', () => {
    const sc = makeSC({
      demographics: { age: 30, sex: 'female' },
      exam_findings: [],
      known_diagnoses: [],
    });
    const { scores } = calculateClinicalScores(sc);
    const cv = scores.find(s => s.name.includes('心血管'));
    expect(cv).toBeUndefined();
  });

  it('65岁男性+高血压 → 有评分', () => {
    const sc = makeSC({
      demographics: { age: 65, sex: 'male' },
      known_diagnoses: ['高血压'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cv = scores.find(s => s.name.includes('心血管'));
    expect(cv).toBeDefined();
    // age≥65 (+2) + male (+1) + 高血压 (+1) = 4 → 中高危
    expect(cv!.value).toBe(4);
  });

  it('极高危场景：多项危险因素 ≥7 → 极高危', () => {
    const sc = makeSC({
      demographics: { age: 70, sex: 'male' },
      known_diagnoses: ['高血压', '2型糖尿病', '高脂血症', '慢性肾脏病'],
      exam_findings: ['Agatston 520'],
      past_history: ['吸烟30年'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cv = scores.find(s => s.name.includes('心血管'));
    expect(cv).toBeDefined();
    expect(cv!.value).toBeGreaterThanOrEqual(7);
    expect(cv!.grade).toContain('极高危');
  });

  it('Agatston >400 加 3 分', () => {
    const sc = makeSC({
      demographics: { age: 55, sex: 'male' },
      exam_findings: ['Agatston calcium score 520'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cv = scores.find(s => s.name.includes('心血管'));
    expect(cv).toBeDefined();
    // age≥55 (+1) + male (+1) + agatston>400 (+3) = 5 → 高危
    expect(cv!.value).toBe(5);
  });

  it('药物名称也能识别风险因素 (statin → 血脂异常)', () => {
    const sc = makeSC({
      demographics: { age: 55, sex: 'male' },
      medication_history: ['atorvastatin 20mg'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cv = scores.find(s => s.name.includes('心血管'));
    expect(cv).toBeDefined();
    expect(cv!.interpretation).toContain('血脂');
  });
});

// ============================================================
// CHA2DS2-VASc
// ============================================================

describe('CHA2DS2-VASc (房颤卒中风险)', () => {
  it('无房颤 → 不计算', () => {
    const sc = makeSC({
      known_diagnoses: ['高血压'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cha = scores.find(s => s.name.includes('CHA2DS2'));
    expect(cha).toBeUndefined();
  });

  it('房颤 + 无其他风险 → 0 分', () => {
    const sc = makeSC({
      demographics: { age: 50, sex: 'male' },
      known_diagnoses: ['心房細動'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cha = scores.find(s => s.name.includes('CHA2DS2'));
    expect(cha).toBeDefined();
    expect(cha!.value).toBe(0);
    expect(cha!.interpretation).toContain('低');
  });

  it('房颤 + 高血压 + 75岁 + 女性 → ≥4 分（建议抗凝）', () => {
    const sc = makeSC({
      demographics: { age: 78, sex: 'female' },
      known_diagnoses: ['atrial fibrillation', '高血压'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cha = scores.find(s => s.name.includes('CHA2DS2'));
    expect(cha).toBeDefined();
    // H(高血压)+1, A2(≥75)+2, Sc(女性)+1 = 4
    expect(cha!.value).toBeGreaterThanOrEqual(4);
    expect(cha!.interpretation).toContain('抗凝');
  });

  it('房颤 + 1分 → 考虑抗凝', () => {
    const sc = makeSC({
      demographics: { age: 50, sex: 'male' },
      known_diagnoses: ['心房颤动', '高血压'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cha = scores.find(s => s.name.includes('CHA2DS2'));
    expect(cha).toBeDefined();
    expect(cha!.value).toBe(1);
    expect(cha!.interpretation).toContain('考虑');
  });

  it('卒中病史加 2 分', () => {
    const sc = makeSC({
      demographics: { age: 50, sex: 'male' },
      known_diagnoses: ['atrial fibrillation'],
      past_history: ['脑梗塞病史'],
    });
    const { scores } = calculateClinicalScores(sc);
    const cha = scores.find(s => s.name.includes('CHA2DS2'));
    expect(cha).toBeDefined();
    expect(cha!.value).toBe(2); // S2(卒中)+2
    expect(cha!.interpretation).toContain('抗凝');
  });
});

// ============================================================
// summaryForTriage 输出
// ============================================================

describe('summaryForTriage 输出', () => {
  it('有评分时包含 CLINICAL SCORES 标记', () => {
    const sc = makeSC({ exam_findings: ['eGFR 45'] });
    const { summaryForTriage } = calculateClinicalScores(sc);
    expect(summaryForTriage).toContain('CLINICAL SCORES');
    expect(summaryForTriage).toContain('CKD');
  });

  it('无评分时 summaryForTriage 为空', () => {
    const sc = makeSC({ demographics: { age: 30, sex: 'female' } });
    const { summaryForTriage } = calculateClinicalScores(sc);
    expect(summaryForTriage).toBe('');
  });
});

// ============================================================
// 多语言
// ============================================================

describe('多语言支持', () => {
  it('日文输出', () => {
    const sc = makeSC({ exam_findings: ['eGFR 45'] });
    const { scores } = calculateClinicalScores(sc, 'ja');
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.name).toContain('病期分類');
  });

  it('英文输出', () => {
    const sc = makeSC({ exam_findings: ['eGFR 45'] });
    const { scores } = calculateClinicalScores(sc, 'en');
    const ckd = scores.find(s => s.name.includes('CKD'));
    expect(ckd!.name).toContain('Staging');
  });
});
