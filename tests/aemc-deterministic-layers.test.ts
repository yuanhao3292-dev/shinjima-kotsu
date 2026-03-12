/**
 * AEMC 确定性安全层严格测试
 *
 * 测试范围：
 * 1. clinical-guidelines.ts — 临床指南匹配
 * 2. icd10-mapper.ts — ICD-10 编码映射
 * 3. drug-interaction-checker.ts — 药物相互作用检查
 *
 * 测试策略：
 * - 正向匹配（应该触发）
 * - 反向验证（不该触发的不触发）
 * - 回归测试（修复的 bug 不应再出现）
 * - 边界情况（大小写、多语言、部分匹配）
 * - 集成场景（真实病例模拟）
 */

import { describe, it, expect } from 'vitest';
import { matchClinicalGuidelines } from '../services/aemc/clinical-guidelines';
import { mapToICD10 } from '../services/aemc/icd10-mapper';
import { checkDrugInteractions } from '../services/aemc/drug-interaction-checker';
import type { StructuredCase, TriageAssessment } from '../services/aemc/types';

// ============================================================
// 测试工厂函数
// ============================================================

function makeStructuredCase(overrides: Partial<StructuredCase> = {}): StructuredCase {
  return {
    case_id: 'test-001',
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

function makeTriageAssessment(overrides: Partial<TriageAssessment> = {}): TriageAssessment {
  return {
    case_id: 'test-001',
    urgency_level: 'semi_urgent',
    recommended_departments: ['内科'],
    differential_directions: [],
    suggested_tests: [],
    needs_emergency_evaluation: false,
    doctor_review_required: false,
    reasoning_summary: '',
    confidence: 0.8,
    ...overrides,
  };
}

// ============================================================
// 1. 临床指南匹配测试
// ============================================================

describe('matchClinicalGuidelines', () => {
  describe('肝细胞癌指南 (GL-HCC-001)', () => {
    it('应匹配 "肝占位" 关键词', () => {
      const sc = makeStructuredCase({ chief_complaint: '发现肝占位性病变2周' });
      const result = matchClinicalGuidelines(sc);
      const ids = result.matchedGuidelines.map((g) => g.id);
      expect(ids).toContain('GL-HCC-001');
    });

    it('应匹配英文 "hepatocellular"', () => {
      const sc = makeStructuredCase({
        known_diagnoses: ['Suspected hepatocellular carcinoma'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-HCC-001')).toBe(true);
    });

    it('应匹配日文 "肝腫瘍"', () => {
      const sc = makeStructuredCase({ exam_findings: ['肝腫瘍の疑い'] });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-HCC-001')).toBe(true);
    });
  });

  describe('AFP + 肝脏指南 (GL-HCC-002) — 需要共现关键词', () => {
    it('应匹配 AFP + 肝 共现', () => {
      const sc = makeStructuredCase({
        exam_findings: ['AFP 850ng/mL', '肝脏多发占位'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-HCC-002')).toBe(true);
    });

    it('不应匹配仅有 AFP 无肝脏关键词', () => {
      const sc = makeStructuredCase({
        exam_findings: ['AFP 500ng/mL'],
        chief_complaint: '腹痛',
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-HCC-002')).toBe(false);
    });
  });

  describe('转移瘤 / 原发灶不明 (GL-CUP-001) — 需要共现关键词', () => {
    it('应匹配 转移 + 肝/淋巴结 共现', () => {
      const sc = makeStructuredCase({
        known_diagnoses: ['肝转移'],
        exam_findings: ['门脉旁淋巴结肿大'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-CUP-001')).toBe(true);
    });

    it('不应匹配无共现关键词', () => {
      const sc = makeStructuredCase({
        chief_complaint: '皮肤转移灶',
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-CUP-001')).toBe(false);
    });
  });

  describe('心血管指南', () => {
    it('应匹配冠脉钙化评分 (GL-CAD-001)', () => {
      const sc = makeStructuredCase({
        exam_findings: ['Agatston score: 520'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-CAD-001')).toBe(true);
    });

    it('应匹配房颤 (GL-AF-001)', () => {
      const sc = makeStructuredCase({
        known_diagnoses: ['atrial fibrillation'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-AF-001')).toBe(true);
    });

    it('应匹配日文心不全 (GL-HF-001)', () => {
      const sc = makeStructuredCase({
        known_diagnoses: ['慢性心不全'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-HF-001')).toBe(true);
    });
  });

  describe('CKD 指南 (GL-CKD-001)', () => {
    it('应匹配 eGFR', () => {
      const sc = makeStructuredCase({
        exam_findings: ['eGFR 45 mL/min'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-CKD-001')).toBe(true);
    });

    it('应匹配 creatinine', () => {
      const sc = makeStructuredCase({
        exam_findings: ['Creatinine 2.1 mg/dL'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-CKD-001')).toBe(true);
    });
  });

  describe('糖尿病指南 (GL-DM-001)', () => {
    it('应匹配 HbA1c', () => {
      const sc = makeStructuredCase({
        exam_findings: ['HbA1c 7.2%'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-DM-001')).toBe(true);
    });

    it('应匹配 "糖尿病" 诊断', () => {
      const sc = makeStructuredCase({
        known_diagnoses: ['2型糖尿病'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-DM-001')).toBe(true);
    });
  });

  describe('骨转移指南 (GL-BONE-001) — 需要共现关键词', () => {
    it('应匹配 骨转移 + 癌', () => {
      const sc = makeStructuredCase({
        known_diagnoses: ['肺癌'],
        exam_findings: ['骨转移灶'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-BONE-001')).toBe(true);
    });

    it('不应匹配仅骨质疏松无恶性标记', () => {
      const sc = makeStructuredCase({
        chief_complaint: '腰痛，骨质疏松',
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-BONE-001')).toBe(false);
    });
  });

  describe('无关病例不应匹配任何指南', () => {
    it('普通感冒不匹配', () => {
      const sc = makeStructuredCase({
        chief_complaint: '流鼻涕、打喷嚏3天',
        present_illness: {
          symptoms: [{ name: '流涕', duration: '3天', severity: '轻度', certainty: 'explicit', evidence: '流鼻涕' }],
          aggravating_factors: [],
          relieving_factors: [],
          associated_symptoms: ['打喷嚏'],
        },
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines).toHaveLength(0);
      expect(result.guidelineContextForAI).toBe('');
    });
  });

  // === 回归测试：修复的误匹配 ===
  describe('回归测试：误匹配修复', () => {
    it('MAJOR-2: "胸部不适" 不应触发肺癌指南 GL-LUNG-001', () => {
      const sc = makeStructuredCase({
        chief_complaint: '胸部不适，心悸',
        exam_findings: ['胸部CT未见异常'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-LUNG-001')).toBe(false);
    });

    it('MAJOR-3: "空腹血糖 5.0mmol/L" 不应触发糖尿病指南', () => {
      const sc = makeStructuredCase({
        exam_findings: ['空腹血糖 5.0mmol/L（正常）'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-DM-001')).toBe(false);
    });

    it('MAJOR-3: "血糖升高" 应触发糖尿病指南', () => {
      const sc = makeStructuredCase({
        exam_findings: ['血糖升高，HbA1c 待查'],
      });
      const result = matchClinicalGuidelines(sc);
      expect(result.matchedGuidelines.some((g) => g.id === 'GL-DM-001')).toBe(true);
    });
  });

  describe('输出格式', () => {
    it('guidelineContextForAI 包含指南 ID 和证据级别', () => {
      const sc = makeStructuredCase({ known_diagnoses: ['高血压', '2型糖尿病'] });
      const result = matchClinicalGuidelines(sc);
      expect(result.guidelineContextForAI).toContain('CLINICAL GUIDELINE REFERENCES');
      expect(result.guidelineContextForAI).toContain('GL-DM-001');
    });
  });
});

// ============================================================
// 2. ICD-10 编码映射测试
// ============================================================

describe('mapToICD10', () => {
  describe('恶性肿瘤编码', () => {
    it('应匹配肝细胞癌 → C22.0', () => {
      const result = mapToICD10(['肝细胞癌'], 'zh-CN');
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].code).toBe('C22.0');
      expect(result.matches[0].standardName).toBe('肝细胞癌');
    });

    it('应匹配英文 Hepatocellular carcinoma → C22.0', () => {
      const result = mapToICD10(['Hepatocellular carcinoma'], 'en');
      expect(result.matches[0].code).toBe('C22.0');
      expect(result.matches[0].standardName).toBe('Hepatocellular carcinoma');
    });

    it('应匹配日文肝細胞癌 → C22.0', () => {
      const result = mapToICD10(['肝細胞癌の疑い'], 'ja');
      expect(result.matches[0].code).toBe('C22.0');
      expect(result.matches[0].standardName).toBe('肝細胞癌');
    });

    it('应匹配肝转移 → C78.7', () => {
      const result = mapToICD10(['肝转移灶'], 'zh-CN');
      expect(result.matches[0].code).toBe('C78.7');
    });

    it('应匹配胆管细胞癌 → C22.1', () => {
      const result = mapToICD10(['肝内胆管细胞癌'], 'zh-CN');
      expect(result.matches[0].code).toBe('C22.1');
    });

    it('应匹配肺癌 → C34', () => {
      const result = mapToICD10(['肺癌'], 'zh-CN');
      expect(result.matches[0].code).toBe('C34');
    });

    it('应匹配胰腺癌 → C25', () => {
      const result = mapToICD10(['pancreatic cancer'], 'en');
      expect(result.matches[0].code).toBe('C25');
    });
  });

  describe('心血管编码', () => {
    it('应匹配高血压 → I10', () => {
      const result = mapToICD10(['高血压'], 'zh-CN');
      expect(result.matches[0].code).toBe('I10');
    });

    it('应匹配房颤 → I48', () => {
      const result = mapToICD10(['心房細動'], 'ja');
      expect(result.matches[0].code).toBe('I48');
      expect(result.matches[0].standardName).toBe('心房細動');
    });

    it('应匹配心力衰竭 → I50', () => {
      const result = mapToICD10(['heart failure'], 'en');
      expect(result.matches[0].code).toBe('I50');
    });

    it('应匹配脑梗死 → I63', () => {
      const result = mapToICD10(['脑梗塞'], 'zh-CN');
      expect(result.matches[0].code).toBe('I63');
    });
  });

  describe('卒中编码区分（MEDIUM-2 修复）', () => {
    it('缺血性卒中 → I63', () => {
      const result = mapToICD10(['Ischemic stroke'], 'en');
      expect(result.matches[0].code).toBe('I63');
    });

    it('出血性卒中 → I61（不应编为 I63）', () => {
      const result = mapToICD10(['Hemorrhagic stroke'], 'en');
      expect(result.matches[0].code).toBe('I61');
    });

    it('脑出血 → I61', () => {
      const result = mapToICD10(['脑出血'], 'zh-CN');
      expect(result.matches[0].code).toBe('I61');
    });
  });

  describe('多诊断匹配', () => {
    it('应同时匹配多个诊断', () => {
      const result = mapToICD10(
        ['肝细胞癌', '高血压', '2型糖尿病', '慢性肾脏病'],
        'zh-CN'
      );
      const codes = result.matches.map((m) => m.code);
      expect(codes).toContain('C22.0');
      expect(codes).toContain('I10');
      expect(codes).toContain('E11');
      expect(codes).toContain('N18');
      expect(result.matches).toHaveLength(4);
    });
  });

  describe('去重逻辑', () => {
    it('同一 ICD-10 编码不应重复出现', () => {
      const result = mapToICD10(
        ['肝癌', '肝细胞癌'],
        'zh-CN'
      );
      const codes = result.matches.map((m) => m.code);
      const uniqueCodes = [...new Set(codes)];
      expect(codes.length).toBe(uniqueCodes.length);
    });
  });

  describe('未匹配诊断', () => {
    it('无法匹配的诊断不产生结果', () => {
      const result = mapToICD10(['维生素D缺乏症'], 'zh-CN');
      expect(result.matches).toHaveLength(0);
      expect(result.formattedForDisplay).toBe('');
      expect(result.icd10ContextForAI).toBe('');
    });
  });

  // === 回归测试：短关键词误匹配修复 (CRITICAL-1) ===
  describe('回归测试：短关键词误匹配修复', () => {
    it('"Hypertensive heart disease" 不应匹配肺栓塞 I26（旧 "pe" bug）', () => {
      const result = mapToICD10(['Hypertensive heart disease'], 'en');
      // 应匹配 hypertension → I10，不应匹配 I26
      const codes = result.matches.map((m) => m.code);
      expect(codes).not.toContain('I26');
    });

    it('"Type 2 diabetes" 不应匹配肺栓塞 I26（旧 "pe" bug）', () => {
      const result = mapToICD10(['Type 2 diabetes'], 'en');
      const codes = result.matches.map((m) => m.code);
      expect(codes).not.toContain('I26');
    });

    it('"Sleep apnea" 不应匹配肺栓塞 I26（旧 "pe" bug）', () => {
      const result = mapToICD10(['Sleep apnea'], 'en');
      expect(result.matches).toHaveLength(0); // 无匹配
    });

    it('"Pulmonary embolism" 应正确匹配 I26', () => {
      const result = mapToICD10(['Pulmonary embolism'], 'en');
      expect(result.matches[0].code).toBe('I26');
    });

    it('"Subarachnoid hemorrhage" 应匹配 I60（用长关键词）', () => {
      const result = mapToICD10(['Subarachnoid hemorrhage'], 'en');
      expect(result.matches[0].code).toBe('I60');
    });

    it('"Acute coronary syndrome" 应匹配 I21（用长关键词）', () => {
      const result = mapToICD10(['Acute coronary syndrome'], 'en');
      expect(result.matches[0].code).toBe('I21');
    });
  });

  describe('输出格式', () => {
    it('formattedForDisplay 格式正确', () => {
      const result = mapToICD10(['肝细胞癌', '高血压'], 'zh-CN');
      expect(result.formattedForDisplay).toContain('肝细胞癌 [C22.0]');
      expect(result.formattedForDisplay).toContain('原发性高血压 [I10]');
    });

    it('icd10ContextForAI 包含 ICD-10 标记', () => {
      const result = mapToICD10(['肺炎'], 'zh-CN');
      expect(result.icd10ContextForAI).toContain('ICD-10 CODES');
      expect(result.icd10ContextForAI).toContain('J18');
    });
  });

  describe('空输入', () => {
    it('空数组返回空结果', () => {
      const result = mapToICD10([], 'zh-CN');
      expect(result.matches).toHaveLength(0);
    });
  });
});

// ============================================================
// 3. 药物相互作用检查测试
// ============================================================

describe('checkDrugInteractions', () => {
  describe('DDI-001: 华法林 + NSAIDs', () => {
    it('应检测华法林 + 布洛芬', () => {
      const sc = makeStructuredCase({
        medication_history: ['华法林 3mg 每日一次', '布洛芬 400mg prn'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions).toHaveLength(1);
      expect(result.interactions[0].ruleId).toBe('DDI-001');
      expect(result.interactions[0].severity).toBe('critical');
    });

    it('应检测 warfarin + aspirin', () => {
      const sc = makeStructuredCase({
        medication_history: ['Warfarin 5mg daily', 'Aspirin 81mg daily'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-001')).toBe(true);
    });

    it('应检测日文 ワーファリン + ロキソプロフェン', () => {
      const sc = makeStructuredCase({
        medication_history: ['ワーファリン 3mg', 'ロキソプロフェン 60mg'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-001')).toBe(true);
    });
  });

  describe('DDI-003: 辛伐他汀 + 强 CYP3A4 抑制剂', () => {
    it('应检测辛伐他汀 + 克拉霉素', () => {
      const sc = makeStructuredCase({
        medication_history: ['辛伐他汀 40mg', '克拉霉素 500mg'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-003')).toBe(true);
      expect(result.interactions.find((i) => i.ruleId === 'DDI-003')?.severity).toBe('critical');
    });
  });

  describe('DDI-005: 胺碘酮 + QT 延长药物', () => {
    it('应检测 amiodarone + levofloxacin (via triage)', () => {
      const sc = makeStructuredCase({
        medication_history: ['Amiodarone 200mg'],
      });
      const triage = makeTriageAssessment({
        suggested_tests: ['recommend levofloxacin for pneumonia'],
        reasoning_summary: 'Consider levofloxacin treatment',
      });
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-005')).toBe(true);
    });
  });

  describe('DDI-006: ACEI/ARB + 保钾利尿剂', () => {
    it('应检测缬沙坦 + 螺内酯', () => {
      const sc = makeStructuredCase({
        medication_history: ['缬沙坦 80mg', '螺内酯 25mg'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-006')).toBe(true);
    });
  });

  describe('DDI-007: 甲氨蝶呤 + NSAIDs', () => {
    it('应检测 MTX + ibuprofen', () => {
      const sc = makeStructuredCase({
        medication_history: ['methotrexate 15mg weekly', 'ibuprofen 600mg tid'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-007')).toBe(true);
    });
  });

  describe('DDI-009: 地高辛 + 胺碘酮', () => {
    it('应检测地高辛 + 胺碘酮', () => {
      const sc = makeStructuredCase({
        medication_history: ['地高辛 0.125mg', '胺碘酮 200mg'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-009')).toBe(true);
    });
  });

  describe('DDI-010: SSRI + MAOIs/曲马多', () => {
    it('应检测 sertraline + tramadol', () => {
      const sc = makeStructuredCase({
        medication_history: ['Sertraline 50mg', 'Tramadol 50mg prn'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-010')).toBe(true);
    });

    it('应检测 fluoxetine + linezolid (both in medication_history)', () => {
      const sc = makeStructuredCase({
        medication_history: ['氟西汀 20mg', '利奈唑胺 600mg'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-010')).toBe(true);
    });
  });

  describe('无相互作用场景', () => {
    it('不相关药物不应触发', () => {
      const sc = makeStructuredCase({
        medication_history: ['阿莫西林 500mg', '奥美拉唑 20mg'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions).toHaveLength(0);
      expect(result.ddiWarningsForAdjudicator).toBe('');
    });

    it('空用药史不应触发', () => {
      const sc = makeStructuredCase({ medication_history: [] });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions).toHaveLength(0);
    });
  });

  // === 回归测试：CRITICAL-2 + MAJOR-1 修复 ===
  describe('回归测试：已停药 / known_diagnoses 不应触发', () => {
    it('CRITICAL-2: past_history 中的已停药不应触发 DDI', () => {
      const sc = makeStructuredCase({
        medication_history: ['阿司匹林 100mg qd'],
        past_history: ['2019年因出血停用华法林'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      // 华法林在 past_history 而非 medication_history，不应触发 DDI-001
      expect(result.interactions.some((i) => i.ruleId === 'DDI-001')).toBe(false);
    });

    it('CRITICAL-2: known_diagnoses 中的疾病名不应触发 DDI', () => {
      const sc = makeStructuredCase({
        medication_history: ['缬沙坦 80mg'],
        known_diagnoses: ['低钾血症'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      // "低钾血症" 含 "钾" 字但不应触发 DDI-006
      expect(result.interactions.some((i) => i.ruleId === 'DDI-006')).toBe(false);
    });

    it('MAJOR-1: "低钾血症" 在 medication_history 中也不应匹配（已移除单字 "钾"）', () => {
      const sc = makeStructuredCase({
        medication_history: ['缬沙坦 80mg', '补钾治疗 氯化钾缓释片'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      // "补钾" 和 "氯化钾" 是精确匹配的新关键词，应该触发
      expect(result.interactions.some((i) => i.ruleId === 'DDI-006')).toBe(true);
    });
  });

  describe('多重 DDI 检测', () => {
    it('应同时检测多个相互作用', () => {
      const sc = makeStructuredCase({
        medication_history: [
          '华法林 3mg',
          '阿司匹林 100mg',
          '辛伐他汀 40mg',
          '克拉霉素 500mg',
        ],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.length).toBeGreaterThanOrEqual(2);
      const ruleIds = result.interactions.map((i) => i.ruleId);
      expect(ruleIds).toContain('DDI-001');
      expect(ruleIds).toContain('DDI-003');
    });
  });

  describe('Triage 推荐中的药物也应被检测', () => {
    it('should detect DDI between existing medication and AI-2 recommended drug', () => {
      const sc = makeStructuredCase({
        medication_history: ['华法林 3mg daily'],
      });
      const triage = makeTriageAssessment({
        suggested_tests: ['Consider adding aspirin for cardiovascular protection'],
        reasoning_summary: 'Patient may benefit from aspirin',
      });
      const result = checkDrugInteractions(sc, triage);
      expect(result.interactions.some((i) => i.ruleId === 'DDI-001')).toBe(true);
    });
  });

  describe('输出格式', () => {
    it('ddiWarningsForAdjudicator 包含正确的标记', () => {
      const sc = makeStructuredCase({
        medication_history: ['warfarin 5mg', 'aspirin 81mg'],
      });
      const triage = makeTriageAssessment();
      const result = checkDrugInteractions(sc, triage);
      expect(result.ddiWarningsForAdjudicator).toContain('DRUG-DRUG INTERACTION ALERTS');
      expect(result.ddiWarningsForAdjudicator).toContain('DDI-001');
      expect(result.ddiWarningsForAdjudicator).toContain('CRITICAL');
    });
  });
});

// ============================================================
// 4. 集成场景测试 — 模拟真实病例
// ============================================================

describe('真实病例集成测试', () => {
  it('肝癌MR报告病例 — 应触发多个指南 + ICD-10 + DDI', () => {
    const sc = makeStructuredCase({
      demographics: { age: 55, sex: 'male' },
      chief_complaint: '体检发现肝脏占位2周',
      known_diagnoses: ['慢性乙型肝炎', '高血压'],
      exam_findings: [
        '肝脏MRI：肝右叶占位性病变，大小约5.2×4.1cm，动脉期强化',
        'AFP 650ng/mL',
        '门脉旁淋巴结肿大',
      ],
      medication_history: ['华法林 3mg qd', '阿司匹林 100mg qd', '恩替卡韦 0.5mg qd'],
      past_history: ['乙肝病毒携带20年'],
      present_illness: {
        symptoms: [{ name: '腹胀', duration: '2周', severity: '轻度', certainty: 'explicit', evidence: '腹部胀满感' }],
        aggravating_factors: [],
        relieving_factors: [],
        associated_symptoms: [],
      },
      red_flags: ['AFP 显著升高'],
    });

    const triage = makeTriageAssessment({
      differential_directions: [
        { name: '肝细胞癌', likelihood: 'high', reason: 'AFP 升高 + 肝脏占位 + 乙肝病史' },
        { name: '肝内胆管细胞癌', likelihood: 'medium', reason: '不典型强化模式需排除' },
        { name: '肝转移', likelihood: 'low', reason: '需排除其他原发灶' },
      ],
      suggested_tests: ['多期增强CT', 'PET-CT', 'HBV DNA'],
    });

    // 1. 指南匹配
    const guidelines = matchClinicalGuidelines(sc);
    const guidelineIds = guidelines.matchedGuidelines.map((g) => g.id);
    expect(guidelineIds).toContain('GL-HCC-001');
    expect(guidelineIds).toContain('GL-HCC-002');

    // 2. ICD-10
    const icd10 = mapToICD10(
      triage.differential_directions.map((d) => d.name),
      'zh-CN'
    );
    const codes = icd10.matches.map((m) => m.code);
    expect(codes).toContain('C22.0');
    expect(codes).toContain('C22.1');

    // 3. DDI
    const ddi = checkDrugInteractions(sc, triage);
    expect(ddi.interactions.some((i) => i.ruleId === 'DDI-001')).toBe(true);
    expect(ddi.ddiWarningsForAdjudicator).toContain('CRITICAL');
  });

  it('心衰房颤病例 — 应触发心血管指南 + DDI', () => {
    const sc = makeStructuredCase({
      demographics: { age: 72, sex: 'male' },
      chief_complaint: '呼吸困难加重1周',
      known_diagnoses: ['慢性心力衰竭 HFrEF', '心房細動', '2型糖尿病'],
      medication_history: [
        'Digoxin 0.125mg daily',
        'Amiodarone 200mg daily',
        'Valsartan 80mg daily',
        'Spironolactone 25mg daily',
      ],
      exam_findings: ['LVEF 35%', 'BNP 1200pg/mL', 'eGFR 42'],
    });

    const triage = makeTriageAssessment({
      differential_directions: [
        { name: '心力衰竭急性加重', likelihood: 'high', reason: 'LVEF低+BNP升高' },
        { name: '心房颤动快速心室率', likelihood: 'medium', reason: '已知房颤' },
      ],
    });

    // 指南
    const guidelines = matchClinicalGuidelines(sc);
    const ids = guidelines.matchedGuidelines.map((g) => g.id);
    expect(ids).toContain('GL-HF-001');
    expect(ids).toContain('GL-AF-001');
    expect(ids).toContain('GL-CKD-001');
    expect(ids).toContain('GL-DM-001');

    // DDI
    const ddi = checkDrugInteractions(sc, triage);
    const ruleIds = ddi.interactions.map((i) => i.ruleId);
    expect(ruleIds).toContain('DDI-009');
    expect(ruleIds).toContain('DDI-006');

    // ICD-10
    const icd10 = mapToICD10(
      triage.differential_directions.map((d) => d.name),
      'zh-CN'
    );
    expect(icd10.matches.some((m) => m.code === 'I50')).toBe(true);
  });

  it('健康体检正常人 — 不应触发任何内容', () => {
    const sc = makeStructuredCase({
      demographics: { age: 30, sex: 'female' },
      chief_complaint: '年度体检',
      medication_history: [],
      known_diagnoses: [],
      exam_findings: ['各项指标正常'],
    });

    const triage = makeTriageAssessment({
      differential_directions: [
        { name: '健康状态', likelihood: 'high', reason: '体检正常' },
      ],
    });

    const guidelines = matchClinicalGuidelines(sc);
    expect(guidelines.matchedGuidelines).toHaveLength(0);

    const ddi = checkDrugInteractions(sc, triage);
    expect(ddi.interactions).toHaveLength(0);

    const icd10 = mapToICD10(
      triage.differential_directions.map((d) => d.name),
      'zh-CN'
    );
    expect(icd10.matches).toHaveLength(0);
  });
});
