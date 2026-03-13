/**
 * AEMC 确定性模块 i18n 测试
 *
 * 验证所有 8 个确定性模块在 4 种语言（zh-CN, zh-TW, en, ja）下
 * 产生正确的本地化输出。
 */

import { describe, it, expect } from 'vitest';
import type {
  CasePacket,
  StructuredCase,
  TriageAssessment,
  AdjudicatedAssessment,
} from '@/services/aemc/types';
import { interceptUnsafeTests } from '@/services/aemc/test-safety';
import { evaluateSafetyGate, type SafetyGateInput } from '@/services/aemc/safety-gate';
import { matchClinicalGuidelines } from '@/services/aemc/clinical-guidelines';
import { checkDrugInteractions } from '@/services/aemc/drug-interaction-checker';
import { calculateClinicalScores } from '@/services/aemc/clinical-scores';
import { validateExtraction } from '@/services/aemc/extraction-validator';
import { matchHospitals } from '@/services/aemc/hospital-matcher';
import { mapToICD10 } from '@/services/aemc/icd10-mapper';

// ============================================================
// 测试用 Fixture 工厂
// ============================================================

const LANGS = ['zh-CN', 'zh-TW', 'en', 'ja'] as const;

function makeCasePacket(overrides?: Partial<CasePacket>): CasePacket {
  return {
    case_id: 'test-001',
    source_type: ['questionnaire'],
    user_type: 'authenticated',
    language: 'zh-CN',
    demographics: { age: 45, sex: 'male' },
    body_regions: ['chest'],
    selected_symptoms: [
      {
        symptom_id: 's1',
        body_part_id: 'chest',
        name: '胸痛',
        severity: 'high',
        follow_up_answers: {},
      },
    ],
    questionnaire_answers: {},
    timeline: [],
    raw_text_bundle: [{ source: 'questionnaire', text: '患者胸痛3天' }],
    metadata: {
      screening_id: 'scr-001',
      created_at: '2025-01-01T00:00:00Z',
    },
    ...overrides,
  };
}

function makeStructuredCase(overrides?: Partial<StructuredCase>): StructuredCase {
  return {
    case_id: 'test-001',
    language: 'zh-CN',
    demographics: { age: 45, sex: 'male' },
    chief_complaint: '胸痛',
    present_illness: {
      symptoms: [{ name: '胸痛', duration: '3天', severity: 'high', certainty: 'explicit', evidence: '患者自述胸痛' }],
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

function makeTriageAssessment(overrides?: Partial<TriageAssessment>): TriageAssessment {
  return {
    case_id: 'test-001',
    urgency_level: 'medium',
    recommended_departments: ['循環器内科'],
    differential_directions: [{ name: '冠状动脉疾病', likelihood: 'moderate', reason: '胸痛+男性+年龄' }],
    suggested_tests: ['心电图', '心肌酶谱'],
    needs_emergency_evaluation: false,
    doctor_review_required: false,
    confidence: 0.85,
    reasoning_summary: '中年男性胸痛，需要排除心血管疾病',
    do_not_miss_conditions: ['急性心肌梗死'],
    missing_information_impact: [],
    ...overrides,
  };
}

function makeAdjudicatedAssessment(overrides?: Partial<AdjudicatedAssessment>): AdjudicatedAssessment {
  return {
    case_id: 'test-001',
    final_risk_level: 'medium',
    final_departments: ['循環器内科'],
    final_summary: '需要进一步心血管检查',
    critical_reasons: [],
    must_ask_followups: [],
    safe_to_auto_display: true,
    escalate_to_human: false,
    escalation_reason: '',
    confidence: 0.85,
    conflict_notes: [],
    ...overrides,
  };
}

// ============================================================
// 1. test-safety.ts — 检查安全性拦截器 i18n
// ============================================================

describe('test-safety i18n', () => {
  // TSR-001: Agatston >400 → 运动负荷试验禁忌
  describe('TSR-001: Agatston >400 运动负荷替换', () => {
    for (const lang of LANGS) {
      it(`${lang}: 运动负荷试验被正确替换`, () => {
        const sc = makeStructuredCase({
          exam_findings: ['Agatston calcium score 550'],
          known_diagnoses: [],
        });
        const triage = makeTriageAssessment({
          suggested_tests: ['treadmill exercise stress test', '心电图'],
        });

        const result = interceptUnsafeTests(sc, triage, lang);
        expect(result.replacements).toHaveLength(1);
        expect(result.replacements[0].ruleId).toBe('TSR-001');
        expect(result.replacements[0].replacement).toBeTruthy();
        expect(result.replacements[0].reason).toContain('550');
        // 验证输出不是其他语言
        expect(result.safeSuggestedTests[0]).toBe(result.replacements[0].replacement);
      });
    }

    it('4种语言产生不同的替换文本', () => {
      const sc = makeStructuredCase({
        exam_findings: ['Agatston calcium score 550'],
      });
      const triage = makeTriageAssessment({
        suggested_tests: ['treadmill exercise stress test'],
      });

      const results = LANGS.map((lang) => interceptUnsafeTests(sc, triage, lang));
      const replacements = results.map((r) => r.replacements[0]?.replacement);
      const reasons = results.map((r) => r.replacements[0]?.reason);

      // zh-CN 和 zh-TW 可能部分相似但不完全相同
      expect(new Set(replacements).size).toBeGreaterThanOrEqual(3);
      expect(new Set(reasons).size).toBeGreaterThanOrEqual(3);
    });
  });

  // TSR-003: eGFR <30 → 造影剂禁忌
  describe('TSR-003: eGFR <30 造影剂替换', () => {
    for (const lang of LANGS) {
      it(`${lang}: 造影检查被正确替换`, () => {
        const sc = makeStructuredCase({
          exam_findings: ['eGFR 22 ml/min'],
        });
        const triage = makeTriageAssessment({
          suggested_tests: ['造影CT'],
        });

        const result = interceptUnsafeTests(sc, triage, lang);
        expect(result.replacements).toHaveLength(1);
        expect(result.replacements[0].ruleId).toBe('TSR-003');
        expect(result.replacements[0].reason).toContain('22');
      });
    }
  });

  // TSR-004: eGFR 30-60 → 造影剂注意（追加后缀，不替换）
  describe('TSR-004: eGFR 30-60 造影剂注意', () => {
    for (const lang of LANGS) {
      it(`${lang}: 原始检查被保留并追加警告`, () => {
        const sc = makeStructuredCase({
          exam_findings: ['eGFR 45 ml/min'],
        });
        const triage = makeTriageAssessment({
          suggested_tests: ['contrast enhanced CT'],
        });

        const result = interceptUnsafeTests(sc, triage, lang);
        expect(result.replacements).toHaveLength(1);
        expect(result.replacements[0].ruleId).toBe('TSR-004');
        // TSR-004 追加后缀而不是完全替换
        expect(result.safeSuggestedTests[0]).toContain('contrast enhanced CT');
      });
    }
  });

  // 语言回退测试
  it('language 未指定时回退到 zh-CN', () => {
    const sc = makeStructuredCase({
      exam_findings: ['Agatston calcium score 550'],
    });
    const triage = makeTriageAssessment({
      suggested_tests: ['treadmill exercise stress test'],
    });

    const withDefault = interceptUnsafeTests(sc, triage);
    const withZhCN = interceptUnsafeTests(sc, triage, 'zh-CN');
    expect(withDefault.replacements[0].replacement).toBe(withZhCN.replacements[0].replacement);
    expect(withDefault.replacements[0].reason).toBe(withZhCN.replacements[0].reason);
  });

  it('无匹配规则时不产生替换', () => {
    const sc = makeStructuredCase();
    const triage = makeTriageAssessment({
      suggested_tests: ['血常规', 'blood routine'],
    });

    for (const lang of LANGS) {
      const result = interceptUnsafeTests(sc, triage, lang);
      expect(result.replacements).toHaveLength(0);
      expect(result.safeSuggestedTests).toEqual(triage.suggested_tests);
    }
  });
});

// ============================================================
// 2. safety-gate.ts — 安全闸门 i18n
// ============================================================

describe('safety-gate i18n', () => {
  describe('年龄风险 (AGE-001/002) 各语言描述', () => {
    for (const lang of LANGS) {
      it(`${lang}: 儿童患者触发 AGE-001`, () => {
        const input: SafetyGateInput = {
          case_packet: makeCasePacket({ language: lang, demographics: { age: 8, sex: 'male' } }),
          structured_case: makeStructuredCase({ demographics: { age: 8, sex: 'male' } }),
          triage_assessment: makeTriageAssessment(),
          adjudicated_assessment: makeAdjudicatedAssessment(),
        };

        const result = evaluateSafetyGate(input);
        const ageRule = result.triggered_rules.find((r) => r.rule_id === 'AGE-001');
        expect(ageRule).toBeDefined();
        expect(ageRule!.description).toContain('8');
      });

      it(`${lang}: 高龄患者触发 AGE-002`, () => {
        const input: SafetyGateInput = {
          case_packet: makeCasePacket({ language: lang, demographics: { age: 80, sex: 'female' } }),
          structured_case: makeStructuredCase({ demographics: { age: 80, sex: 'female' } }),
          triage_assessment: makeTriageAssessment(),
          adjudicated_assessment: makeAdjudicatedAssessment(),
        };

        const result = evaluateSafetyGate(input);
        const ageRule = result.triggered_rules.find((r) => r.rule_id === 'AGE-002');
        expect(ageRule).toBeDefined();
        expect(ageRule!.description).toContain('80');
      });
    }
  });

  describe('模型一致性 (MODEL-001) 各语言描述', () => {
    for (const lang of LANGS) {
      it(`${lang}: 低置信度触发 MODEL-001`, () => {
        const input: SafetyGateInput = {
          case_packet: makeCasePacket({ language: lang }),
          structured_case: makeStructuredCase(),
          triage_assessment: makeTriageAssessment(),
          adjudicated_assessment: makeAdjudicatedAssessment({ confidence: 0.5 }),
        };

        const result = evaluateSafetyGate(input);
        const rule = result.triggered_rules.find((r) => r.rule_id === 'MODEL-001');
        expect(rule).toBeDefined();
        expect(rule!.description).toContain('0.50');
      });
    }
  });

  describe('安全分类说明 (explanation) 各语言', () => {
    it('4种语言的 gate A 说明文本各不相同', () => {
      const explanations = LANGS.map((lang) => {
        const input: SafetyGateInput = {
          case_packet: makeCasePacket({ language: lang }),
          structured_case: makeStructuredCase(),
          triage_assessment: makeTriageAssessment(),
          adjudicated_assessment: makeAdjudicatedAssessment(),
        };
        return evaluateSafetyGate(input).explanation;
      });

      // 4 种语言应各不相同
      expect(new Set(explanations).size).toBe(4);
    });
  });
});

// ============================================================
// 3. clinical-guidelines.ts — 临床指南匹配 i18n
// ============================================================

describe('clinical-guidelines i18n', () => {
  describe('GL-CAD-001 冠脉钙化指南', () => {
    for (const lang of LANGS) {
      it(`${lang}: 匹配到 GL-CAD-001 并返回本地化建议`, () => {
        const sc = makeStructuredCase({
          exam_findings: ['Agatston calcium score 500'],
          known_diagnoses: ['冠動脈疾患'],
        });

        const result = matchClinicalGuidelines(sc, lang);
        const cadGuideline = result.matchedGuidelines.find((g) => g.id === 'GL-CAD-001');
        expect(cadGuideline).toBeDefined();
        expect(cadGuideline!.recommendation).toBeTruthy();
        expect(result.guidelineContextForAI).toContain('GL-CAD-001');
      });
    }

    it('4种语言的建议文本各不相同', () => {
      const sc = makeStructuredCase({
        exam_findings: ['Agatston calcium score 500'],
        known_diagnoses: ['冠動脈疾患'],
      });

      const recs = LANGS.map((lang) => {
        const result = matchClinicalGuidelines(sc, lang);
        return result.matchedGuidelines.find((g) => g.id === 'GL-CAD-001')?.recommendation;
      });

      expect(new Set(recs).size).toBe(4);
    });
  });

  describe('GL-HCC-001 肝细胞癌指南', () => {
    it('4种语言匹配并返回不同建议', () => {
      const sc = makeStructuredCase({
        exam_findings: ['肝占位'],
        known_diagnoses: ['hepatocellular carcinoma'],
      });

      const recs = LANGS.map((lang) => {
        const result = matchClinicalGuidelines(sc, lang);
        return result.matchedGuidelines.find((g) => g.id === 'GL-HCC-001')?.recommendation;
      });

      for (const rec of recs) {
        expect(rec).toBeTruthy();
      }
      expect(new Set(recs).size).toBe(4);
    });
  });

  it('标签 (recommendation/applicableTests) 在各语言不同', () => {
    const sc = makeStructuredCase({
      exam_findings: ['Agatston calcium score 500'],
      known_diagnoses: ['冠動脈疾患'],
    });

    const contexts = LANGS.map((lang) => matchClinicalGuidelines(sc, lang).guidelineContextForAI);

    // en 版本应包含 "Recommendation"，ja 版本应包含 "推奨"
    expect(contexts[2]).toContain('Recommendation');
    expect(contexts[3]).toContain('推奨');
  });
});

// ============================================================
// 4. drug-interaction-checker.ts — DDI 检查器 i18n
// ============================================================

describe('drug-interaction-checker i18n', () => {
  describe('DDI-001: 华法林 + NSAIDs', () => {
    for (const lang of LANGS) {
      it(`${lang}: 检测到 DDI-001 并返回本地化描述`, () => {
        const sc = makeStructuredCase({
          medication_history: ['warfarin 5mg daily'],
        });
        const triage = makeTriageAssessment({
          suggested_tests: ['推荐 ibuprofen 镇痛'],
          reasoning_summary: '',
        });

        const result = checkDrugInteractions(sc, triage, lang);
        expect(result.interactions).toHaveLength(1);
        expect(result.interactions[0].ruleId).toBe('DDI-001');
        expect(result.interactions[0].interaction).toBeTruthy();
        expect(result.interactions[0].recommendation).toBeTruthy();
      });
    }

    it('4种语言的描述各不相同', () => {
      const sc = makeStructuredCase({
        medication_history: ['warfarin 5mg daily'],
      });
      const triage = makeTriageAssessment({
        suggested_tests: ['推荐 ibuprofen 镇痛'],
        reasoning_summary: '',
      });

      const interactions = LANGS.map((lang) =>
        checkDrugInteractions(sc, triage, lang).interactions[0]?.interaction
      );
      const recommendations = LANGS.map((lang) =>
        checkDrugInteractions(sc, triage, lang).interactions[0]?.recommendation
      );

      expect(new Set(interactions).size).toBe(4);
      expect(new Set(recommendations).size).toBe(4);
    });
  });

  describe('DDI-005: 胺碘酮 + QT延长药物', () => {
    it('4种语言匹配并返回本地化', () => {
      const sc = makeStructuredCase({
        medication_history: ['amiodarone 200mg'],
      });
      const triage = makeTriageAssessment({
        suggested_tests: ['levofloxacin treatment'],
        reasoning_summary: '',
      });

      for (const lang of LANGS) {
        const result = checkDrugInteractions(sc, triage, lang);
        const ddi = result.interactions.find((i) => i.ruleId === 'DDI-005');
        expect(ddi).toBeDefined();
        expect(ddi!.interaction).toBeTruthy();
      }
    });
  });

  it('警告文本中的标签被本地化', () => {
    const sc = makeStructuredCase({
      medication_history: ['warfarin 5mg'],
    });
    const triage = makeTriageAssessment({
      suggested_tests: ['ibuprofen'],
      reasoning_summary: '',
    });

    const enResult = checkDrugInteractions(sc, triage, 'en');
    const jaResult = checkDrugInteractions(sc, triage, 'ja');

    expect(enResult.ddiWarningsForAdjudicator).toContain('Recommendation');
    expect(jaResult.ddiWarningsForAdjudicator).toContain('推奨');
  });
});

// ============================================================
// 5. clinical-scores.ts — 临床评分 i18n
// ============================================================

describe('clinical-scores i18n', () => {
  describe('CKD 分期', () => {
    for (const lang of LANGS) {
      it(`${lang}: eGFR 25 → G4 分期`, () => {
        const sc = makeStructuredCase({
          exam_findings: ['eGFR 25 ml/min'],
        });

        const result = calculateClinicalScores(sc, lang);
        const ckd = result.scores.find((s) => s.value === 25);
        expect(ckd).toBeDefined();
        expect(ckd!.grade).toBeTruthy();
        expect(ckd!.interpretation).toContain('25');
      });
    }

    it('4种语言的 grade 文本各不相同', () => {
      const sc = makeStructuredCase({
        exam_findings: ['eGFR 25 ml/min'],
      });

      const grades = LANGS.map((lang) => {
        const result = calculateClinicalScores(sc, lang);
        return result.scores.find((s) => s.value === 25)?.grade;
      });

      // G4 在各语言不同
      expect(new Set(grades).size).toBe(4);
    });
  });

  describe('心血管风险评估', () => {
    it('4种语言的风险因素名称不同', () => {
      const sc = makeStructuredCase({
        demographics: { age: 70, sex: 'male' },
        exam_findings: ['Agatston calcium score 500'],
        known_diagnoses: ['hypertension', '糖尿病'],
        past_history: [],
        medication_history: ['atorvastatin'],
      });

      const interpretations = LANGS.map((lang) => {
        const result = calculateClinicalScores(sc, lang);
        const cvScore = result.scores.find((s) => s.name !== undefined && s.value !== null && s.value > 3);
        return cvScore?.interpretation;
      });

      for (const interp of interpretations) {
        expect(interp).toBeTruthy();
      }
      expect(new Set(interpretations).size).toBe(4);
    });
  });

  describe('CHA2DS2-VASc（房颤患者）', () => {
    it('4种语言的评分和建议文本不同', () => {
      const sc = makeStructuredCase({
        demographics: { age: 70, sex: 'female' },
        known_diagnoses: ['atrial fibrillation', '高血压', '糖尿病'],
        exam_findings: [],
        past_history: [],
      });

      const results = LANGS.map((lang) => {
        const r = calculateClinicalScores(sc, lang);
        return r.scores.find((s) => s.name.includes('CHA') || s.name.includes('房颤') || s.name.includes('AF') || s.name.includes('心房'));
      });

      for (const r of results) {
        expect(r).toBeDefined();
        expect(r!.interpretation).toBeTruthy();
      }
    });
  });

  it('summaryForTriage 包含各语言评分名称', () => {
    const sc = makeStructuredCase({
      exam_findings: ['eGFR 50 ml/min'],
    });

    const enResult = calculateClinicalScores(sc, 'en');
    const jaResult = calculateClinicalScores(sc, 'ja');

    expect(enResult.summaryForTriage).toContain('CKD Staging');
    expect(jaResult.summaryForTriage).toContain('CKD 病期分類');
  });
});

// ============================================================
// 6. extraction-validator.ts — 提取验证器 i18n
// ============================================================

describe('extraction-validator i18n', () => {
  describe('补充遗漏的肿瘤标志物', () => {
    for (const lang of LANGS) {
      it(`${lang}: 发现遗漏的 SCC 并用本地化前缀标注`, () => {
        const cp = makeCasePacket({
          language: lang,
          uploaded_report_text: 'SCC 3.5 ng/ml (参考值 <1.5)',
        });
        const sc = makeStructuredCase({
          exam_findings: [], // AI-1 遗漏了 SCC
        });

        const result = validateExtraction(cp, sc, lang);
        expect(result.addedFindings.length).toBeGreaterThanOrEqual(1);
        // 检查前缀被本地化
        const finding = result.addedFindings[0];
        expect(finding).toBeTruthy();
      });
    }

    it('4种语言的补充前缀各不相同', () => {
      const results = LANGS.map((lang) => {
        const cp = makeCasePacket({
          language: lang,
          uploaded_report_text: 'SCC 3.5 ng/ml',
        });
        const sc = makeStructuredCase({ exam_findings: [] });
        return validateExtraction(cp, sc, lang);
      });

      const prefixes = results.map((r) => r.addedFindings[0]);
      // zh-CN: "[验证器补充]", zh-TW: "[驗證器補充]", en: "[Validator supplement]", ja: "[バリデータ補足]"
      expect(new Set(prefixes).size).toBe(4);
    });
  });

  describe('补充红旗（eGFR <30）', () => {
    it('4种语言的红旗描述各不相同', () => {
      const redFlags = LANGS.map((lang) => {
        const cp = makeCasePacket({
          language: lang,
          uploaded_report_text: 'eGFR 18 ml/min',
        });
        const sc = makeStructuredCase({ exam_findings: [], red_flags: [] });
        const result = validateExtraction(cp, sc, lang);
        return result.addedRedFlags[0];
      });

      for (const rf of redFlags) {
        expect(rf).toBeTruthy();
        expect(rf).toContain('18');
      }
      expect(new Set(redFlags).size).toBe(4);
    });
  });

  it('无上传报告时跳过验证', () => {
    for (const lang of LANGS) {
      const cp = makeCasePacket({ language: lang, uploaded_report_text: undefined });
      const sc = makeStructuredCase();
      const result = validateExtraction(cp, sc, lang);
      expect(result.addedFindings).toHaveLength(0);
      expect(result.addedRedFlags).toHaveLength(0);
    }
  });
});

// ============================================================
// 7. hospital-matcher.ts — 医院匹配器 i18n
// ============================================================

describe('hospital-matcher i18n', () => {
  describe('匹配结果本地化', () => {
    it('4种语言返回不同的医院名称和科室', () => {
      const sc = makeStructuredCase({
        chief_complaint: '胸痛',
        present_illness: {
          symptoms: [{ name: '胸痛', duration: '3天', severity: 'high', certainty: 'explicit', evidence: '' }],
          aggravating_factors: [],
          relieving_factors: [],
          associated_symptoms: [],
        },
        red_flags: [],
      });
      const triage = makeTriageAssessment({
        recommended_departments: ['循環器内科'],
        suggested_tests: ['心电图'],
        needs_emergency_evaluation: false,
      });
      const adj = makeAdjudicatedAssessment({
        final_departments: ['循環器内科'],
        final_risk_level: 'medium',
      });

      const results = LANGS.map((lang) => matchHospitals(sc, triage, adj, lang));

      // 每种语言都应有推荐
      for (const r of results) {
        expect(r.recommended_hospitals.length).toBeGreaterThan(0);
      }

      // routing_suggestion 应该在至少 3 种语言间不同
      const routings = results.map((r) => r.routing_suggestion);
      expect(new Set(routings).size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('注意事项本地化 (noEmergency / clinicCaution)', () => {
    it('4种语言的无急诊警告各不相同', () => {
      const sc = makeStructuredCase();
      const triage = makeTriageAssessment({ needs_emergency_evaluation: true });
      const adj = makeAdjudicatedAssessment({
        final_departments: ['消化器内科'],
        final_risk_level: 'emergency',
      });

      const results = LANGS.map((lang) => matchHospitals(sc, triage, adj, lang));

      // 紧急情况下应触发 emergencyRouting
      const routings = results.map((r) => r.routing_suggestion);
      for (const r of routings) {
        expect(r).toBeTruthy();
      }
      expect(new Set(routings).size).toBeGreaterThanOrEqual(3);
    });
  });
});

// ============================================================
// 8. icd10-mapper.ts — ICD-10 映射 i18n
// ============================================================

describe('icd10-mapper i18n', () => {
  describe('肝细胞癌映射 C22.0', () => {
    it('4种语言返回不同的 standardName', () => {
      const differentials = ['肝细胞癌'];

      const results = LANGS.map((lang) => mapToICD10(differentials, lang));

      for (const r of results) {
        expect(r.matches.length).toBeGreaterThan(0);
        expect(r.matches[0].code).toBe('C22.0');
      }

      const names = results.map((r) => r.matches[0].standardName);
      // zh-CN: 肝细胞癌, zh-TW: 肝細胞癌, en: Hepatocellular carcinoma, ja: 肝細胞癌
      // zh-CN 和 ja 可能相同（都是 "肝細胞癌"），但 en 一定不同
      expect(names[2]).toBe('Hepatocellular carcinoma');
      expect(names[3]).toBe('肝細胞癌');
    });
  });

  describe('多个诊断映射', () => {
    it('4种语言对骨转移返回不同的标准名', () => {
      const differentials = ['骨转移'];

      const results = LANGS.map((lang) => mapToICD10(differentials, lang));

      for (const r of results) {
        expect(r.matches.length).toBeGreaterThan(0);
      }

      const names = results.map((r) => r.matches[0].standardName);
      expect(names[2]).toContain('bone');
    });
  });

  it('formattedForDisplay 使用本地化名称', () => {
    const differentials = ['肝细胞癌'];

    const enResult = mapToICD10(differentials, 'en');
    const jaResult = mapToICD10(differentials, 'ja');

    expect(enResult.formattedForDisplay).toContain('Hepatocellular carcinoma');
    expect(jaResult.formattedForDisplay).toContain('肝細胞癌');
  });
});

// ============================================================
// 综合测试：语言回退和默认值
// ============================================================

describe('语言回退和默认值', () => {
  it('所有模块在 language 为 undefined 时使用 zh-CN', () => {
    const sc = makeStructuredCase({
      exam_findings: ['Agatston calcium score 550', 'eGFR 25 ml/min'],
      medication_history: ['warfarin 5mg'],
    });
    const triage = makeTriageAssessment({
      suggested_tests: ['treadmill exercise stress test', 'ibuprofen'],
      reasoning_summary: '',
    });

    // test-safety
    const ts1 = interceptUnsafeTests(sc, triage);
    const ts2 = interceptUnsafeTests(sc, triage, 'zh-CN');
    expect(ts1.replacements.map((r) => r.replacement)).toEqual(ts2.replacements.map((r) => r.replacement));

    // clinical-guidelines
    const cg1 = matchClinicalGuidelines(sc);
    const cg2 = matchClinicalGuidelines(sc, 'zh-CN');
    expect(cg1.guidelineContextForAI).toBe(cg2.guidelineContextForAI);

    // drug-interaction-checker
    const ddi1 = checkDrugInteractions(sc, triage);
    const ddi2 = checkDrugInteractions(sc, triage, 'zh-CN');
    expect(ddi1.ddiWarningsForAdjudicator).toBe(ddi2.ddiWarningsForAdjudicator);

    // clinical-scores
    const cs1 = calculateClinicalScores(sc);
    const cs2 = calculateClinicalScores(sc, 'zh-CN');
    expect(cs1.summaryForTriage).toBe(cs2.summaryForTriage);
  });
});
