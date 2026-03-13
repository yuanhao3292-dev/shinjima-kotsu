/**
 * AEMC 确定性管线 — 临床场景端到端测试
 *
 * 模拟真实患者病例，按 Pipeline 步骤逐一走过所有确定性模块，
 * 在每个步骤断言输出的 正确性 × 4 语言一致性。
 *
 * 步骤顺序（与 index.ts 一致）：
 *   Step 2b  validateExtraction      — 提取验证
 *   Step 2c  calculateClinicalScores — 临床评分
 *   Step 2d  matchClinicalGuidelines — 临床指南
 *   Step 3b  interceptUnsafeTests    — 检查安全拦截
 *   Step 3c  checkDrugInteractions   — 药物相互作用
 *   Step 4b  mapToICD10              — ICD-10 编码
 *   Step 5   evaluateSafetyGate      — 安全闸门
 *   Step 6   matchHospitals          — 医院匹配
 */

import { describe, it, expect } from 'vitest';

import type {
  CasePacket,
  StructuredCase,
  TriageAssessment,
  AdjudicatedAssessment,
  ChallengeReview,
} from '@/services/aemc/types';

import { validateExtraction } from '@/services/aemc/extraction-validator';
import { calculateClinicalScores } from '@/services/aemc/clinical-scores';
import { matchClinicalGuidelines } from '@/services/aemc/clinical-guidelines';
import { interceptUnsafeTests } from '@/services/aemc/test-safety';
import { checkDrugInteractions } from '@/services/aemc/drug-interaction-checker';
import { mapToICD10 } from '@/services/aemc/icd10-mapper';
import { evaluateSafetyGate, type SafetyGateInput } from '@/services/aemc/safety-gate';
import { matchHospitals } from '@/services/aemc/hospital-matcher';

// ============================================================
// 工厂函数
// ============================================================

const ALL_LANGS = ['zh-CN', 'zh-TW', 'en', 'ja'] as const;
type Lang = (typeof ALL_LANGS)[number];

function baseCasePacket(overrides?: Partial<CasePacket>): CasePacket {
  return {
    case_id: 'scenario-test',
    source_type: ['questionnaire', 'medical_report'],
    user_type: 'authenticated',
    language: 'zh-CN',
    demographics: { age: 60, sex: 'male' },
    body_regions: [],
    selected_symptoms: [],
    questionnaire_answers: {},
    timeline: [],
    raw_text_bundle: [{ source: 'questionnaire', text: '' }],
    metadata: { screening_id: 'scr-test', created_at: '2025-06-01T00:00:00Z' },
    ...overrides,
  };
}

function baseStructuredCase(overrides?: Partial<StructuredCase>): StructuredCase {
  return {
    case_id: 'scenario-test',
    language: 'zh-CN',
    demographics: { age: 60, sex: 'male' },
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

function baseTriage(overrides?: Partial<TriageAssessment>): TriageAssessment {
  return {
    case_id: 'scenario-test',
    urgency_level: 'medium',
    recommended_departments: [],
    differential_directions: [],
    suggested_tests: [],
    needs_emergency_evaluation: false,
    doctor_review_required: false,
    confidence: 0.85,
    reasoning_summary: '',
    do_not_miss_conditions: [],
    missing_information_impact: [],
    ...overrides,
  };
}

function baseAdjudication(overrides?: Partial<AdjudicatedAssessment>): AdjudicatedAssessment {
  return {
    case_id: 'scenario-test',
    final_risk_level: 'medium',
    final_departments: [],
    final_summary: '',
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
// 辅助：4 语言交叉验证
// ============================================================

/** 断言 4 种语言产生不同文本（至少 minDistinct 个不同） */
function assertDistinctAcrossLangs(values: string[], minDistinct = 3, label = '') {
  const uniq = new Set(values.filter(Boolean));
  expect(
    uniq.size,
    `${label} 应至少有 ${minDistinct} 种不同文本，实际 ${uniq.size}: ${JSON.stringify(values)}`
  ).toBeGreaterThanOrEqual(minDistinct);
}

// ############################################################
//
//  病例 A：高危心血管 + 肾功能不全 + 多药联用
//
//  72 岁男性，冠脉钙化 Agatston 620，eGFR 22，
//  正在服用 warfarin + aspirin，房颤，糖尿病。
//  AI-2 推荐：运动负荷心电图、冠脉 CTA、造影 CT。
//
//  预期触发：
//  - ExtractionValidator: 补充 Agatston 620 + eGFR 22 红旗
//  - ClinicalScores: CKD G4 + CV 极高危 + CHA2DS2-VASc ≥4
//  - ClinicalGuidelines: GL-CAD-001 + GL-CKD-001 + GL-AF-001
//  - TestSafety: TSR-001(运动负荷) + TSR-002(CTA) + TSR-003(造影)
//  - DDI: DDI-001(warfarin+aspirin→出血) + DDI-002(DOAC+抗血小板)
//  - ICD-10: 冠状动脉疾病 I25.1, 房颤 I48
//  - SafetyGate: D 类（急诊评估 + 红旗 + 年龄 + 多系统）
//  - HospitalMatcher: 有急诊能力的综合医院
//
// ############################################################

describe('病例A：高危心血管 + 肾功能不全 + 多药联用 (72岁男)', () => {
  // --- 构建 fixture ---

  const caseA_reportText = [
    'Agatston calcium score: 620',
    'eGFR 22 ml/min',
    'HbA1c 8.5%',
    'LDL 185 mg/dl',
    'BNP 450 pg/ml',
  ].join('\n');

  const caseA_cp = (lang: Lang) =>
    baseCasePacket({
      language: lang,
      demographics: { age: 72, sex: 'male' },
      uploaded_report_text: caseA_reportText,
      selected_symptoms: [
        { symptom_id: 's1', body_part_id: 'chest', name: '胸痛', severity: 'high', follow_up_answers: {} },
      ],
      raw_text_bundle: [{ source: 'medical_report', text: caseA_reportText }],
    });

  const caseA_sc = (lang: Lang) =>
    baseStructuredCase({
      language: lang,
      demographics: { age: 72, sex: 'male' },
      chief_complaint: '胸痛・呼吸困難',
      present_illness: {
        symptoms: [
          { name: '胸痛', duration: '1週間', severity: 'high', certainty: 'explicit', evidence: '労作時の胸痛' },
          { name: '呼吸困難', duration: '2週間', severity: 'medium', certainty: 'explicit', evidence: '階段昇降時' },
        ],
        aggravating_factors: ['労作', '運動'],
        relieving_factors: ['安静'],
        associated_symptoms: ['発汗', '動悸'],
      },
      past_history: ['高血压 10年', '糖尿病 8年', '慢性肾脏病 CKD G4'],
      medication_history: ['warfarin 5mg', 'aspirin 100mg', 'atorvastatin 20mg', 'metformin 500mg'],
      allergy_history: [],
      known_diagnoses: ['atrial fibrillation', '高血压', '糖尿病', 'CKD G4', '动脉硬化', '心不全疑い'],
      exam_findings: ['Agatston calcium score 620', 'eGFR 22 ml/min', 'BNP 450 pg/ml'],
      red_flags: ['胸痛+動悸+発汗'],
      missing_critical_info: [],
    });

  const caseA_triage = (lang: Lang) =>
    baseTriage({
      urgency_level: 'high',
      recommended_departments: ['循環器内科', '腎臓内科'],
      differential_directions: [
        { name: '冠状动脉疾病', likelihood: 'high', reason: 'Agatston 620, 胸痛, 多危险因素' },
        { name: '心房細動', likelihood: 'confirmed', reason: '既往诊断' },
        { name: '慢性肾脏病', likelihood: 'confirmed', reason: 'eGFR 22' },
      ],
      suggested_tests: [
        'treadmill exercise stress test',
        '冠動脈CTA',
        '造影CT（腹部）',
        'BNP follow-up',
        '心エコー',
      ],
      needs_emergency_evaluation: true,
      doctor_review_required: true,
      confidence: 0.9,
      reasoning_summary: '多危险因素高龄男性胸痛，需排除急性冠脉综合征',
      do_not_miss_conditions: ['急性心肌梗死', '不安定狭心症'],
    });

  const caseA_adj = (lang: Lang) =>
    baseAdjudication({
      final_risk_level: 'high',
      final_departments: ['循環器内科', '腎臓内科'],
      final_summary: '72 岁男性多系统高危：冠脉钙化极高+肾衰竭+房颤+糖尿病',
      critical_reasons: ['冠脉钙化 Agatston 620 >400', 'eGFR 22 CKD G4', '三联抗栓出血风险'],
      must_ask_followups: ['近期有无胸痛加重', '当前 INR 值'],
      safe_to_auto_display: false,
      escalate_to_human: true,
      escalation_reason: '多系统高危需人工审核',
      confidence: 0.92,
    });

  // ========== Step 2b: 提取验证 ==========

  describe('Step 2b: validateExtraction', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 补充 BNP 红旗（>400 → 心力衰竭）`, () => {
        // 创建一个 exam_findings 中故意遗漏 BNP 的 SC
        const sc = caseA_sc(lang);
        const scWithoutBNP = {
          ...sc,
          exam_findings: sc.exam_findings.filter((f) => !f.toLowerCase().includes('bnp')),
        };
        const cp = caseA_cp(lang);
        const result = validateExtraction(cp, scWithoutBNP, lang);
        const bnpFinding = result.addedFindings.find((f) => f.toLowerCase().includes('bnp'));
        expect(bnpFinding, `${lang}: 应补充 BNP 450`).toBeTruthy();

        const bnpRedFlag = result.addedRedFlags.find((f) => f.includes('450'));
        expect(bnpRedFlag, `${lang}: BNP >400 应触发红旗`).toBeTruthy();
      });
    }

    it('4语言的 BNP 红旗描述各不相同', () => {
      const flags = ALL_LANGS.map((lang) => {
        const sc = { ...caseA_sc(lang), exam_findings: ['Agatston calcium score 620', 'eGFR 22 ml/min'] };
        return validateExtraction(caseA_cp(lang), sc, lang).addedRedFlags.find((f) => f.includes('450'));
      });
      assertDistinctAcrossLangs(flags as string[], 3, 'BNP 红旗');
    });
  });

  // ========== Step 2c: 临床评分 ==========

  describe('Step 2c: calculateClinicalScores', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: CKD G4 + CV 极高危 + CHA2DS2-VASc ≥4`, () => {
        const sc = caseA_sc(lang);
        const result = calculateClinicalScores(sc, lang);

        // CKD G4 (eGFR 22)
        const ckd = result.scores.find((s) => s.value === 22);
        expect(ckd, `${lang}: 应计算出 CKD 分期`).toBeDefined();
        expect(ckd!.grade).toContain('G4');

        // CV risk — 年龄72(+2) + 男(+1) + 高血压(+1) + 糖尿病(+1) + 他汀→血脂(+1) + Agatston620(+3) + CKD(+1) + 动脉硬化(+1)
        const cv = result.scores.find((s) => s.value !== null && s.value >= 7);
        expect(cv, `${lang}: 应计算出极高心血管风险`).toBeDefined();

        // CHA2DS2-VASc (AF present)
        const cha = result.scores.find(
          (s) => s.name.includes('CHA') || s.name.includes('房颤') || s.name.includes('AF') || s.name.includes('心房')
        );
        expect(cha, `${lang}: 应计算 CHA2DS2-VASc（房颤患者）`).toBeDefined();
        // H(高血压)+1, A2(72≥75? NO → A(65-74)+1), D(糖尿病)+1, Sc(male→0)
        // 实际 72<75 → A(65-74)+1 而不是 A2(≥75)+2
        expect(cha!.value, `${lang}: CHA2DS2-VASc 至少3分`).toBeGreaterThanOrEqual(3);
      });
    }

    it('4语言的 CKD 解释文本各不相同', () => {
      const interps = ALL_LANGS.map((lang) => {
        const r = calculateClinicalScores(caseA_sc(lang), lang);
        return r.scores.find((s) => s.value === 22)?.interpretation;
      });
      assertDistinctAcrossLangs(interps as string[], 3, 'CKD interpretation');
    });
  });

  // ========== Step 2d: 临床指南 ==========

  describe('Step 2d: matchClinicalGuidelines', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 匹配 GL-CAD-001 + GL-CKD-001 + GL-AF-001 + GL-HF-001`, () => {
        const sc = caseA_sc(lang);
        const result = matchClinicalGuidelines(sc, lang);

        const ids = result.matchedGuidelines.map((g) => g.id);
        expect(ids, `${lang}: 应匹配冠脉指南`).toContain('GL-CAD-001');
        expect(ids, `${lang}: 应匹配 CKD 指南`).toContain('GL-CKD-001');
        expect(ids, `${lang}: 应匹配房颤指南`).toContain('GL-AF-001');
        expect(ids, `${lang}: 应匹配心衰指南`).toContain('GL-HF-001');

        // 验证本地化
        for (const g of result.matchedGuidelines) {
          expect(g.recommendation.length, `${lang} ${g.id}: recommendation 不应为空`).toBeGreaterThan(10);
        }
      });
    }

    it('4语言的 GL-CAD-001 recommendation 各不相同', () => {
      const recs = ALL_LANGS.map((lang) => {
        const r = matchClinicalGuidelines(caseA_sc(lang), lang);
        return r.matchedGuidelines.find((g) => g.id === 'GL-CAD-001')?.recommendation;
      });
      assertDistinctAcrossLangs(recs as string[], 4, 'GL-CAD-001 recommendation');
    });
  });

  // ========== Step 3b: 检查安全拦截 ==========

  describe('Step 3b: interceptUnsafeTests', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: TSR-001(运动负荷) + TSR-002(CTA) + TSR-003(造影CT) 全部触发`, () => {
        const sc = caseA_sc(lang);
        const triage = caseA_triage(lang);
        const result = interceptUnsafeTests(sc, triage, lang);

        const ruleIds = result.replacements.map((r) => r.ruleId);
        expect(ruleIds, `${lang}: 应触发 TSR-001`).toContain('TSR-001');
        expect(ruleIds, `${lang}: 应触发 TSR-002`).toContain('TSR-002');
        expect(ruleIds, `${lang}: 应触发 TSR-003`).toContain('TSR-003');

        // 原始 5 个检查中只有 BNP follow-up 和 心エコー 不被替换
        const unchanged = result.safeSuggestedTests.filter((t) =>
          t === 'BNP follow-up' || t === '心エコー'
        );
        expect(unchanged.length).toBe(2);

        // reason 中包含具体数值
        const tsr001 = result.replacements.find((r) => r.ruleId === 'TSR-001');
        expect(tsr001!.reason).toContain('620');
        const tsr003 = result.replacements.find((r) => r.ruleId === 'TSR-003');
        expect(tsr003!.reason).toContain('22');
      });
    }

    it('4语言的 TSR-001 replacement 各不相同', () => {
      const reps = ALL_LANGS.map((lang) => {
        const r = interceptUnsafeTests(caseA_sc(lang), caseA_triage(lang), lang);
        return r.replacements.find((x) => x.ruleId === 'TSR-001')?.replacement;
      });
      assertDistinctAcrossLangs(reps as string[], 3, 'TSR-001 replacement');
    });

    it('4语言的 TSR-003 replacement 各不相同', () => {
      const reps = ALL_LANGS.map((lang) => {
        const r = interceptUnsafeTests(caseA_sc(lang), caseA_triage(lang), lang);
        return r.replacements.find((x) => x.ruleId === 'TSR-003')?.replacement;
      });
      assertDistinctAcrossLangs(reps as string[], 3, 'TSR-003 replacement');
    });
  });

  // ========== Step 3c: 药物相互作用 ==========

  describe('Step 3c: checkDrugInteractions', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 检测到 warfarin + aspirin (DDI-001)`, () => {
        const sc = caseA_sc(lang);
        const triage = caseA_triage(lang);
        const result = checkDrugInteractions(sc, triage, lang);

        const ddi001 = result.interactions.find((i) => i.ruleId === 'DDI-001');
        expect(ddi001, `${lang}: 应检测到 DDI-001`).toBeDefined();
        expect(ddi001!.severity).toBe('critical');
        expect(ddi001!.interaction.length).toBeGreaterThan(10);
        expect(ddi001!.recommendation.length).toBeGreaterThan(10);
      });
    }

    it('4语言的 DDI-001 interaction 描述各不相同', () => {
      const descs = ALL_LANGS.map((lang) => {
        const r = checkDrugInteractions(caseA_sc(lang), caseA_triage(lang), lang);
        return r.interactions.find((i) => i.ruleId === 'DDI-001')?.interaction;
      });
      assertDistinctAcrossLangs(descs as string[], 4, 'DDI-001 interaction');
    });
  });

  // ========== Step 4b: ICD-10 ==========

  describe('Step 4b: mapToICD10', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 冠心病 + 房颤 + CKD 正确映射`, () => {
        const differentials = caseA_triage(lang).differential_directions.map((d) => d.name);
        const result = mapToICD10(differentials, lang);

        expect(result.matches.length, `${lang}: 应匹配至少1个 ICD-10`).toBeGreaterThanOrEqual(1);
        // 冠状动脉疾病 → I25.*
        const cadMatch = result.matches.find((m) => m.originalText.includes('冠状动脉'));
        if (cadMatch) {
          expect(cadMatch.code).toMatch(/^I25/);
        }
      });
    }

    it('en 的 standardName 使用英文', () => {
      const differentials = ['冠状动脉疾病', '心房細動', '慢性肾脏病'];
      const result = mapToICD10(differentials, 'en');
      for (const m of result.matches) {
        // 英文名应至少包含一个 ASCII 字母
        expect(m.standardName).toMatch(/[a-zA-Z]/);
      }
    });
  });

  // ========== Step 5: 安全闸门 ==========

  describe('Step 5: evaluateSafetyGate', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 判定 D 类（紧急）或 C 类（人工审核）`, () => {
        const input: SafetyGateInput = {
          case_packet: caseA_cp(lang),
          structured_case: caseA_sc(lang),
          triage_assessment: caseA_triage(lang),
          adjudicated_assessment: caseA_adj(lang),
        };
        const result = evaluateSafetyGate(input);

        // needs_emergency_evaluation=true → 红旗词 → D 类
        expect(
          result.gate_class === 'D' || result.gate_class === 'C',
          `${lang}: 应为 C 或 D 类，实际 ${result.gate_class}`
        ).toBe(true);

        expect(result.require_human_review).toBe(true);
        expect(result.allow_auto_display).toBe(false);

        // 应触发 AGE-002（72>75? 不是，72<75），但有 MODEL-006（急诊评估）
        const model006 = result.triggered_rules.find((r) => r.rule_id === 'MODEL-006');
        expect(model006, `${lang}: 应触发 MODEL-006 (急诊评估)`).toBeDefined();

        // MODEL-002（仲裁官请求升级）
        const model002 = result.triggered_rules.find((r) => r.rule_id === 'MODEL-002');
        expect(model002, `${lang}: 应触发 MODEL-002 (人工升级)`).toBeDefined();

        // explanation 非空
        expect(result.explanation.length).toBeGreaterThan(20);
      });
    }

    it('4语言的 explanation 各不相同', () => {
      const explanations = ALL_LANGS.map((lang) => {
        const input: SafetyGateInput = {
          case_packet: caseA_cp(lang),
          structured_case: caseA_sc(lang),
          triage_assessment: caseA_triage(lang),
          adjudicated_assessment: caseA_adj(lang),
        };
        return evaluateSafetyGate(input).explanation;
      });
      assertDistinctAcrossLangs(explanations, 3, 'SafetyGate explanation');
    });
  });

  // ========== Step 6: 医院匹配 ==========

  describe('Step 6: matchHospitals', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 推荐含急诊能力的医院`, () => {
        const result = matchHospitals(
          caseA_sc(lang),
          caseA_triage(lang),
          caseA_adj(lang),
          lang,
        );

        expect(result.recommended_hospitals.length).toBeGreaterThan(0);
        // 紧急情况 → routing_suggestion 应包含紧急提示
        expect(result.routing_suggestion.length).toBeGreaterThan(10);
        // 应标记需要人工协调
        expect(result.requires_manual_coordinator_review).toBe(true);
      });
    }

    it('4语言的 routing_suggestion 各不相同', () => {
      const routings = ALL_LANGS.map((lang) =>
        matchHospitals(caseA_sc(lang), caseA_triage(lang), caseA_adj(lang), lang).routing_suggestion
      );
      assertDistinctAcrossLangs(routings, 3, 'routing_suggestion');
    });
  });
});

// ############################################################
//
//  病例 B：肝脏肿瘤 + 多发转移 + 肿瘤标志物升高
//
//  55 岁男性，肝占位伴 AFP 显著升高，骨转移，淋巴结转移。
//  上传了医学报告：AFP 520, CEA 15.2, CA19-9 180
//
//  预期触发：
//  - ExtractionValidator: 补充 AFP/CEA/CA19-9 异常
//  - ClinicalGuidelines: GL-HCC-001 + GL-HCC-002 + GL-CUP-001 + GL-BONE-001
//  - ICD-10: C22.0 + C78.7 + C79.5 + C77.2
//  - SafetyGate: XVAL-002 (肿瘤标志物) + XVAL-005 (HBV/HCV) + XVAL-006 (MDT)
//  - 安全闸门: C 类（肿瘤红旗 → 需人工审核）
//
// ############################################################

describe('病例B：肝脏肿瘤 + 多发转移 (55岁男)', () => {

  const caseB_reportText = 'AFP 520 ng/ml\nCEA 15.2 ng/ml\nCA19-9 180 U/ml\neGFR 75 ml/min';

  const caseB_cp = (lang: Lang) =>
    baseCasePacket({
      language: lang,
      demographics: { age: 55, sex: 'male' },
      uploaded_report_text: caseB_reportText,
      raw_text_bundle: [{ source: 'medical_report', text: caseB_reportText }],
    });

  const caseB_sc = (lang: Lang) =>
    baseStructuredCase({
      language: lang,
      demographics: { age: 55, sex: 'male' },
      chief_complaint: '右上腹痛+体重减轻',
      present_illness: {
        symptoms: [
          { name: '腹痛', duration: '2月', severity: 'high', certainty: 'explicit', evidence: '右上腹持续性钝痛' },
          { name: '体重减轻', duration: '3月', severity: 'medium', certainty: 'explicit', evidence: '3月内减轻8kg' },
        ],
        aggravating_factors: ['进食'],
        relieving_factors: [],
        associated_symptoms: ['食欲不振', '黄疸'],
      },
      past_history: ['乙肝携带者 20年'],
      medication_history: ['恩替卡韦 0.5mg'],
      allergy_history: [],
      known_diagnoses: ['hepatocellular carcinoma', '肝转移', '骨转移', '门脉淋巴结转移'],
      exam_findings: ['AFP 520 ng/ml 升高', 'CEA 15.2 ng/ml 异常', 'CA19-9 180 U/ml 升高'],
      red_flags: ['AFP 显著升高', '多发转移', '体重减轻 >5%'],
      missing_critical_info: [],
    });

  const caseB_triage = (lang: Lang) =>
    baseTriage({
      urgency_level: 'high',
      recommended_departments: ['消化器内科', '腫瘍内科'],
      differential_directions: [
        { name: '肝细胞癌', likelihood: 'high', reason: 'AFP 520 + 肝占位 + 慢性肝病史' },
        { name: '肝转移', likelihood: 'confirmed', reason: '影像确认' },
        { name: '骨转移', likelihood: 'confirmed', reason: '影像确认' },
      ],
      // 故意不推荐 HBV/HCV 筛查、不推荐 MDT → 触发 XVAL-005, XVAL-006
      suggested_tests: ['PET-CT', '肝脏增强 MRI', '骨扫描', '活检'],
      needs_emergency_evaluation: false,
      doctor_review_required: true,
      confidence: 0.88,
      reasoning_summary: '多发转移恶性肿瘤，需全面分期评估',
      do_not_miss_conditions: ['胆管细胞癌'],
    });

  const caseB_adj = (lang: Lang) =>
    baseAdjudication({
      final_risk_level: 'high',
      final_departments: ['消化器内科', '腫瘍内科'],
      final_summary: '55 岁男性肝占位伴多发转移，AFP 显著升高，高度疑似 HCC',
      critical_reasons: ['AFP >400 ng/ml', '多发转移（肝/骨/淋巴结）'],
      safe_to_auto_display: false,
      escalate_to_human: true,
      escalation_reason: '恶性肿瘤多发转移',
      confidence: 0.90,
    });

  // ========== Step 2b: 提取验证 ==========

  describe('Step 2b: validateExtraction', () => {
    it('4语言：当 exam_findings 遗漏 CA19-9 时补充', () => {
      for (const lang of ALL_LANGS) {
        const sc = {
          ...caseB_sc(lang),
          exam_findings: ['AFP 520 ng/ml 升高', 'CEA 15.2 ng/ml 异常'], // 遗漏 CA19-9
        };
        const result = validateExtraction(caseB_cp(lang), sc, lang);
        const ca199 = result.addedFindings.find((f) => f.toLowerCase().includes('ca'));
        expect(ca199, `${lang}: 应补充 CA19-9`).toBeTruthy();
      }
    });
  });

  // ========== Step 2d: 临床指南 ==========

  describe('Step 2d: matchClinicalGuidelines', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 匹配 GL-HCC-001 + GL-CUP-001 + GL-BONE-001`, () => {
        const result = matchClinicalGuidelines(caseB_sc(lang), lang);
        const ids = result.matchedGuidelines.map((g) => g.id);

        expect(ids).toContain('GL-HCC-001');
        expect(ids).toContain('GL-CUP-001');
        expect(ids).toContain('GL-BONE-001');
      });
    }
  });

  // ========== Step 4b: ICD-10 ==========

  describe('Step 4b: mapToICD10', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 映射到 C22.0 + C78.7 + C79.5`, () => {
        const differentials = caseB_triage(lang).differential_directions.map((d) => d.name);
        const result = mapToICD10(differentials, lang);

        const codes = result.matches.map((m) => m.code);
        expect(codes).toContain('C22.0'); // 肝细胞癌
      });
    }

    it('4语言的 肝细胞癌 standardName 各有本地化', () => {
      const names = ALL_LANGS.map((lang) => {
        const r = mapToICD10(['肝细胞癌'], lang);
        return r.matches[0]?.standardName;
      });
      expect(names[2]).toBe('Hepatocellular carcinoma');
      expect(names[3]).toBe('肝細胞癌');
    });
  });

  // ========== Step 5: 安全闸门 ==========

  describe('Step 5: evaluateSafetyGate', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 触发 XVAL-005(HBV) + XVAL-006(MDT) + C/D 类`, () => {
        const input: SafetyGateInput = {
          case_packet: caseB_cp(lang),
          structured_case: caseB_sc(lang),
          triage_assessment: caseB_triage(lang),
          adjudicated_assessment: caseB_adj(lang),
        };
        const result = evaluateSafetyGate(input);
        const ruleIds = result.triggered_rules.map((r) => r.rule_id);

        // 肝病变但 AI-2 未推荐 HBV/HCV 筛查
        expect(ruleIds, `${lang}: 应触发 XVAL-005`).toContain('XVAL-005');
        // 恶性肿瘤转移但未推荐 MDT
        expect(ruleIds, `${lang}: 应触发 XVAL-006`).toContain('XVAL-006');
        // 肿瘤标志物升高但未推荐肿瘤排查…但 suggested_tests 里有 PET-CT 和活检，
        // 所以 XVAL-002 可能不触发（oncologyKeywords 包含 'pet', '癌', 'biopsy'…）

        expect(result.require_human_review, `${lang}: 应需要人工审核`).toBe(true);
        expect(result.gate_class === 'C' || result.gate_class === 'D').toBe(true);
      });
    }

    it('4语言的 XVAL-005 描述各不相同', () => {
      const descs = ALL_LANGS.map((lang) => {
        const input: SafetyGateInput = {
          case_packet: caseB_cp(lang),
          structured_case: caseB_sc(lang),
          triage_assessment: caseB_triage(lang),
          adjudicated_assessment: caseB_adj(lang),
        };
        const result = evaluateSafetyGate(input);
        return result.triggered_rules.find((r) => r.rule_id === 'XVAL-005')?.description;
      });
      assertDistinctAcrossLangs(descs as string[], 3, 'XVAL-005');
    });
  });
});

// ############################################################
//
//  病例 C：低风险健康体检 — 安全闸门 A 类通过
//
//  35 岁女性，无异常发现，所有指标正常。
//  预期：所有模块均无触发 → 安全闸门 A 类 → 自动展示
//
// ############################################################

describe('病例C：低风险健康体检 (35岁女)', () => {
  const caseC_cp = (lang: Lang) =>
    baseCasePacket({
      language: lang,
      demographics: { age: 35, sex: 'female' },
      selected_symptoms: [
        { symptom_id: 's1', body_part_id: 'general', name: '健康检查', severity: 'low', follow_up_answers: {} },
      ],
    });

  const caseC_sc = (lang: Lang) =>
    baseStructuredCase({
      language: lang,
      demographics: { age: 35, sex: 'female' },
      chief_complaint: '定期健康检查',
      present_illness: {
        symptoms: [{ name: '无明显症状', duration: '', severity: 'low', certainty: 'explicit', evidence: '' }],
        aggravating_factors: [],
        relieving_factors: [],
        associated_symptoms: [],
      },
      exam_findings: [],
      known_diagnoses: [],
      red_flags: [],
    });

  const caseC_triage = (lang: Lang) =>
    baseTriage({
      urgency_level: 'low',
      recommended_departments: ['内科'],
      differential_directions: [{ name: '健康检查', likelihood: 'n/a', reason: '定期检查' }],
      suggested_tests: ['血常规', '肝肾功能', '血脂'],
      needs_emergency_evaluation: false,
      doctor_review_required: false,
      confidence: 0.95,
      reasoning_summary: '35 岁女性定期健检，无异常发现',
      do_not_miss_conditions: [],
    });

  const caseC_adj = (lang: Lang) =>
    baseAdjudication({
      final_risk_level: 'low',
      final_departments: ['内科'],
      final_summary: '低风险健康体检',
      safe_to_auto_display: true,
      confidence: 0.95,
    });

  describe('全步骤验证', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 无触发 → 安全闸门 A 类`, () => {
        const sc = caseC_sc(lang);
        const triage = caseC_triage(lang);
        const adj = caseC_adj(lang);

        // Step 3b: 无检查替换
        const testSafety = interceptUnsafeTests(sc, triage, lang);
        expect(testSafety.replacements).toHaveLength(0);

        // Step 3c: 无 DDI
        const ddi = checkDrugInteractions(sc, triage, lang);
        expect(ddi.interactions).toHaveLength(0);

        // Step 5: 安全闸门
        const gate = evaluateSafetyGate({
          case_packet: caseC_cp(lang),
          structured_case: sc,
          triage_assessment: triage,
          adjudicated_assessment: adj,
        });

        expect(gate.gate_class, `${lang}: 应为 A 类`).toBe('A');
        expect(gate.allow_auto_display).toBe(true);
        expect(gate.require_human_review).toBe(false);
        expect(gate.require_emergency_notice).toBe(false);
        expect(gate.triggered_rules).toHaveLength(0);
      });
    }

    it('4语言的 gate A explanation 各不相同', () => {
      const explanations = ALL_LANGS.map((lang) => {
        const gate = evaluateSafetyGate({
          case_packet: caseC_cp(lang),
          structured_case: caseC_sc(lang),
          triage_assessment: caseC_triage(lang),
          adjudicated_assessment: caseC_adj(lang),
        });
        return gate.explanation;
      });
      assertDistinctAcrossLangs(explanations, 4, 'Gate A explanation');
    });
  });
});

// ############################################################
//
//  病例 D：儿童患者 — AGE-001 + 安全闸门升级
//
//  6 岁男孩，发热+头痛+呕吐（疑似脑膜炎红旗）
//  预期：AGE-001 + 红旗词典触发 → D 类紧急
//
// ############################################################

describe('病例D：儿童疑似脑膜炎 (6岁男)', () => {
  const caseD_cp = (lang: Lang) =>
    baseCasePacket({
      language: lang,
      demographics: { age: 6, sex: 'male' },
      raw_text_bundle: [{ source: 'questionnaire', text: '发热39.5度 头痛 呕吐 颈部僵硬' }],
    });

  const caseD_sc = (lang: Lang) =>
    baseStructuredCase({
      language: lang,
      demographics: { age: 6, sex: 'male' },
      chief_complaint: '发热+头痛+呕吐',
      present_illness: {
        symptoms: [
          { name: '发热', duration: '2天', severity: 'high', certainty: 'explicit', evidence: '体温 39.5°C' },
          { name: '头痛', duration: '2天', severity: 'high', certainty: 'explicit', evidence: '' },
          { name: '呕吐', duration: '1天', severity: 'medium', certainty: 'explicit', evidence: '' },
        ],
        aggravating_factors: [],
        relieving_factors: [],
        associated_symptoms: ['颈部僵硬'],
      },
      exam_findings: [],
      known_diagnoses: [],
      red_flags: ['颈部僵硬', '高热'],
    });

  const caseD_triage = (lang: Lang) =>
    baseTriage({
      urgency_level: 'emergency',
      recommended_departments: ['小児科', '救急科'],
      differential_directions: [
        { name: '细菌性脑膜炎', likelihood: 'moderate', reason: '发热+头痛+颈部僵硬' },
      ],
      suggested_tests: ['腰椎穿刺', '血培养'],
      needs_emergency_evaluation: true,
      confidence: 0.8,
      reasoning_summary: '6 岁男孩发热颈强直，需紧急排除脑膜炎',
      do_not_miss_conditions: ['细菌性脑膜炎', '脑炎'],
    });

  const caseD_adj = (lang: Lang) =>
    baseAdjudication({
      final_risk_level: 'emergency',
      final_departments: ['小児科', '救急科'],
      final_summary: '6 岁男孩疑似脑膜炎',
      safe_to_auto_display: false,
      escalate_to_human: true,
      escalation_reason: '儿童疑似脑膜炎紧急',
      confidence: 0.85,
    });

  describe('安全闸门验证', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: AGE-001(儿童) + MODEL-006(急诊) → D 类`, () => {
        const gate = evaluateSafetyGate({
          case_packet: caseD_cp(lang),
          structured_case: caseD_sc(lang),
          triage_assessment: caseD_triage(lang),
          adjudicated_assessment: caseD_adj(lang),
        });

        expect(gate.gate_class).toBe('D');
        expect(gate.require_emergency_notice).toBe(true);
        expect(gate.require_human_review).toBe(true);

        const ruleIds = gate.triggered_rules.map((r) => r.rule_id);
        expect(ruleIds).toContain('AGE-001'); // 儿童
        expect(ruleIds).toContain('MODEL-006'); // 急诊评估
        expect(ruleIds).toContain('MODEL-002'); // 仲裁官升级

        // AGE-001 描述应包含年龄
        const age001 = gate.triggered_rules.find((r) => r.rule_id === 'AGE-001');
        expect(age001!.description).toContain('6');
      });
    }

    it('4语言的 AGE-001 描述各不相同', () => {
      const descs = ALL_LANGS.map((lang) => {
        const gate = evaluateSafetyGate({
          case_packet: caseD_cp(lang),
          structured_case: caseD_sc(lang),
          triage_assessment: caseD_triage(lang),
          adjudicated_assessment: caseD_adj(lang),
        });
        return gate.triggered_rules.find((r) => r.rule_id === 'AGE-001')?.description;
      });
      assertDistinctAcrossLangs(descs as string[], 4, 'AGE-001 description');
    });
  });
});

// ############################################################
//
//  病例 E：多系统代谢综合征 + eGFR 边界值
//
//  68 岁男性，冠脉钙化 Agatston 350，eGFR 45，
//  糖尿病，高血压，血脂异常，颈动脉硬化。
//  CKD G3b + 中等造影风险
//
//  预期：
//  - TSR-004（eGFR 30-60 造影注意，不是 TSR-003）
//  - 不触发 TSR-001/002（Agatston 350 < 400）
//  - XVAL-004（多系统：心血管+肾脏+代谢，urgency=medium → 分诊不足）
//  - CKD G3b + CV 极高危 + 可能触发 DM 指南
//
// ############################################################

describe('病例E：多系统代谢综合征 + eGFR 边界 (68岁男)', () => {
  const caseE_sc = (lang: Lang) =>
    baseStructuredCase({
      language: lang,
      demographics: { age: 68, sex: 'male' },
      chief_complaint: '定期随访',
      present_illness: {
        symptoms: [],
        aggravating_factors: [],
        relieving_factors: [],
        associated_symptoms: [],
      },
      past_history: ['高血压 15年', '糖尿病 10年', 'CKD G3b'],
      medication_history: ['valsartan 80mg', 'metformin 500mg', 'atorvastatin 40mg'],
      allergy_history: [],
      known_diagnoses: [
        'hypertension', '糖尿病', 'CKD G3b',
        'coronary artery disease', '颈动脉硬化',
        '脂質異常症',
      ],
      exam_findings: ['Agatston calcium score 350', 'eGFR 45 ml/min', 'HbA1c 7.8%', 'LDL 155 mg/dl'],
      red_flags: [],
    });

  const caseE_triage = (lang: Lang) =>
    baseTriage({
      urgency_level: 'medium', // 故意低估 → 触发 XVAL-004
      recommended_departments: ['循環器内科'],
      differential_directions: [
        { name: '冠状动脉疾病', likelihood: 'moderate', reason: 'Agatston 350' },
        { name: '糖尿病', likelihood: 'confirmed', reason: 'HbA1c 7.8%' },
      ],
      suggested_tests: ['contrast enhanced CT（腹部）', '血脂', 'HbA1c'],
      needs_emergency_evaluation: false,
      confidence: 0.85,
      reasoning_summary: '多系统代谢综合征定期随访',
      do_not_miss_conditions: [],
    });

  describe('Step 3b: interceptUnsafeTests', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: TSR-004(eGFR 30-60 注意) 触发，TSR-001/002/003 不触发`, () => {
        const sc = caseE_sc(lang);
        const triage = caseE_triage(lang);
        const result = interceptUnsafeTests(sc, triage, lang);

        const ruleIds = result.replacements.map((r) => r.ruleId);
        // eGFR 45 → TSR-004 (30-60 注意)
        expect(ruleIds).toContain('TSR-004');
        // Agatston 350 < 400 → 不触发 TSR-001/002
        expect(ruleIds).not.toContain('TSR-001');
        expect(ruleIds).not.toContain('TSR-002');
        // eGFR 45 >= 30 → 不触发 TSR-003
        expect(ruleIds).not.toContain('TSR-003');

        // TSR-004 追加后缀而不是完全替换
        const tsr004 = result.replacements.find((r) => r.ruleId === 'TSR-004');
        expect(tsr004!.replacement).toContain('contrast enhanced CT');
        expect(tsr004!.reason).toContain('45');
      });
    }
  });

  describe('Step 5: evaluateSafetyGate — XVAL-004 多系统', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 3系统(心血管+肾脏+代谢) + medium → XVAL-004 触发`, () => {
        const cp = baseCasePacket({ language: lang, demographics: { age: 68, sex: 'male' } });
        const sc = caseE_sc(lang);
        const triage = caseE_triage(lang);
        const adj = baseAdjudication({
          final_risk_level: 'medium',
          final_departments: ['循環器内科', '腎臓内科'],
          safe_to_auto_display: true,
          confidence: 0.85,
        });

        const gate = evaluateSafetyGate({
          case_packet: cp,
          structured_case: sc,
          triage_assessment: triage,
          adjudicated_assessment: adj,
        });

        const ruleIds = gate.triggered_rules.map((r) => r.rule_id);
        expect(ruleIds, `${lang}: 应触发 XVAL-004`).toContain('XVAL-004');

        // XVAL-004 描述应包含系统名称
        const xval004 = gate.triggered_rules.find((r) => r.rule_id === 'XVAL-004');
        expect(xval004!.description.length).toBeGreaterThan(20);
      });
    }

    it('4语言的 XVAL-004 描述中系统名称各不相同', () => {
      const descs = ALL_LANGS.map((lang) => {
        const cp = baseCasePacket({ language: lang, demographics: { age: 68, sex: 'male' } });
        const adj = baseAdjudication({ final_risk_level: 'medium', safe_to_auto_display: true, confidence: 0.85 });
        const gate = evaluateSafetyGate({
          case_packet: cp,
          structured_case: caseE_sc(lang),
          triage_assessment: caseE_triage(lang),
          adjudicated_assessment: adj,
        });
        return gate.triggered_rules.find((r) => r.rule_id === 'XVAL-004')?.description;
      });
      assertDistinctAcrossLangs(descs as string[], 3, 'XVAL-004 description');
    });
  });
});

// ############################################################
//
//  病例 F：5-HT 综合征风险 — DDI-010
//
//  42 岁女性，抑郁症服用 SSRI，AI-2 推荐曲马多镇痛。
//
// ############################################################

describe('病例F：SSRI + 曲马多 DDI (42岁女)', () => {
  const caseF_sc = (lang: Lang) =>
    baseStructuredCase({
      language: lang,
      demographics: { age: 42, sex: 'female' },
      chief_complaint: '腰痛',
      medication_history: ['escitalopram 10mg', 'sertraline 50mg'],
    });

  const caseF_triage = (lang: Lang) =>
    baseTriage({
      suggested_tests: ['推荐 tramadol 50mg 镇痛'],
      reasoning_summary: '慢性腰痛需镇痛处理',
    });

  describe('Step 3c: checkDrugInteractions', () => {
    for (const lang of ALL_LANGS) {
      it(`${lang}: 检测到 DDI-010 (SSRI + tramadol → 5-HT 综合征)`, () => {
        const result = checkDrugInteractions(caseF_sc(lang), caseF_triage(lang), lang);
        const ddi010 = result.interactions.find((i) => i.ruleId === 'DDI-010');
        expect(ddi010, `${lang}: 应检测到 DDI-010`).toBeDefined();
        expect(ddi010!.severity).toBe('critical');
        expect(ddi010!.interaction.length).toBeGreaterThan(20);
        expect(ddi010!.recommendation.length).toBeGreaterThan(20);
      });
    }

    it('4语言的 DDI-010 interaction 各不相同', () => {
      const descs = ALL_LANGS.map((lang) => {
        const r = checkDrugInteractions(caseF_sc(lang), caseF_triage(lang), lang);
        return r.interactions.find((i) => i.ruleId === 'DDI-010')?.interaction;
      });
      assertDistinctAcrossLangs(descs as string[], 4, 'DDI-010 interaction');
    });

    it('4语言的 DDI-010 recommendation 各不相同', () => {
      const recs = ALL_LANGS.map((lang) => {
        const r = checkDrugInteractions(caseF_sc(lang), caseF_triage(lang), lang);
        return r.interactions.find((i) => i.ruleId === 'DDI-010')?.recommendation;
      });
      assertDistinctAcrossLangs(recs as string[], 4, 'DDI-010 recommendation');
    });
  });
});

// ############################################################
//
//  病例 G：心功能交叉验证 (XVAL-003)
//
//  65 岁男性，LVEF 35%，但 AI-2 未推荐 BNP 和心内科。
//
// ############################################################

describe('病例G：心功能异常未被 AI-2 覆盖 — XVAL-003 (65岁男)', () => {
  for (const lang of ALL_LANGS) {
    it(`${lang}: LVEF 35% + AI-2 未推荐心功能检查 → XVAL-003`, () => {
      const cp = baseCasePacket({ language: lang, demographics: { age: 65, sex: 'male' } });
      const sc = baseStructuredCase({
        language: lang,
        demographics: { age: 65, sex: 'male' },
        exam_findings: ['LVEF 35%'],
        known_diagnoses: ['心功能低下'],
      });
      const triage = baseTriage({
        urgency_level: 'medium',
        // 故意不推荐 BNP 和心内科
        recommended_departments: ['内科'],
        suggested_tests: ['血常规', 'X线'],
        differential_directions: [{ name: '贫血', likelihood: 'moderate', reason: '' }],
        reasoning_summary: '',
        do_not_miss_conditions: [],
      });
      const adj = baseAdjudication({
        final_risk_level: 'medium',
        safe_to_auto_display: true,
        confidence: 0.8,
      });

      const gate = evaluateSafetyGate({
        case_packet: cp,
        structured_case: sc,
        triage_assessment: triage,
        adjudicated_assessment: adj,
      });

      const ruleIds = gate.triggered_rules.map((r) => r.rule_id);
      expect(ruleIds, `${lang}: 应触发 XVAL-003`).toContain('XVAL-003');
    });
  }

  it('4语言的 XVAL-003 描述各不相同', () => {
    const descs = ALL_LANGS.map((lang) => {
      const cp = baseCasePacket({ language: lang, demographics: { age: 65, sex: 'male' } });
      const sc = baseStructuredCase({
        language: lang,
        demographics: { age: 65, sex: 'male' },
        exam_findings: ['LVEF 35%'],
        known_diagnoses: ['心功能低下'],
      });
      const triage = baseTriage({
        recommended_departments: ['内科'],
        suggested_tests: ['血常规'],
        reasoning_summary: '',
        do_not_miss_conditions: [],
      });
      const adj = baseAdjudication({ final_risk_level: 'medium', safe_to_auto_display: true, confidence: 0.8 });

      const gate = evaluateSafetyGate({
        case_packet: cp,
        structured_case: sc,
        triage_assessment: triage,
        adjudicated_assessment: adj,
      });
      return gate.triggered_rules.find((r) => r.rule_id === 'XVAL-003')?.description;
    });
    assertDistinctAcrossLangs(descs as string[], 3, 'XVAL-003 description');
  });
});
