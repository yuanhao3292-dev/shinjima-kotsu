/**
 * SafetyGate 确定性安全闸门测试
 *
 * 测试范围：
 * 1. A/B/C/D 四级分类逻辑
 * 2. 红旗词典扫描（keyword + combo_trigger）
 * 3. 年龄风险检查（儿童/高龄）
 * 4. AI 模型一致性检查
 * 5. 交叉验证 XVAL-001 ~ XVAL-006
 * 6. 缺失信息触发 B 类
 * 7. emergency severity → D 类（AUDIT-FIX 回归）
 */

import { describe, it, expect } from 'vitest';
import { evaluateSafetyGate, type SafetyGateInput } from '../services/aemc/safety-gate';
import type {
  CasePacket,
  StructuredCase,
  TriageAssessment,
  AdjudicatedAssessment,
  ChallengeReview,
} from '../services/aemc/types';

// ============================================================
// 工厂函数
// ============================================================

function makeCasePacket(overrides: Partial<CasePacket> = {}): CasePacket {
  return {
    case_id: 'test-sg-001',
    source_type: ['questionnaire'],
    user_type: 'authenticated',
    language: 'zh-CN',
    demographics: { age: 40, sex: 'male' },
    body_regions: [],
    selected_symptoms: [],
    questionnaire_answers: {},
    timeline: [],
    raw_text_bundle: [],
    metadata: { screening_id: 'scr-001', created_at: new Date().toISOString() },
    ...overrides,
  };
}

function makeStructuredCase(overrides: Partial<StructuredCase> = {}): StructuredCase {
  return {
    case_id: 'test-sg-001',
    language: 'zh-CN',
    demographics: { age: 40, sex: 'male' },
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

function makeTriage(overrides: Partial<TriageAssessment> = {}): TriageAssessment {
  return {
    case_id: 'test-sg-001',
    urgency_level: 'low',
    recommended_departments: ['内科'],
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

function makeAdjudication(overrides: Partial<AdjudicatedAssessment> = {}): AdjudicatedAssessment {
  return {
    case_id: 'test-sg-001',
    final_risk_level: 'low',
    final_departments: ['内科'],
    final_summary: '低风险',
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

function makeInput(overrides: Partial<SafetyGateInput> = {}): SafetyGateInput {
  return {
    case_packet: makeCasePacket(),
    structured_case: makeStructuredCase(),
    triage_assessment: makeTriage(),
    adjudicated_assessment: makeAdjudication(),
    ...overrides,
  };
}

// ============================================================
// 1. Gate A — 低风险自动展示
// ============================================================

describe('SafetyGate — Gate A (自动展示)', () => {
  it('健康体检正常人 → A 类', () => {
    const result = evaluateSafetyGate(makeInput());
    expect(result.gate_class).toBe('A');
    expect(result.allow_auto_display).toBe(true);
    expect(result.require_human_review).toBe(false);
    expect(result.require_emergency_notice).toBe(false);
  });

  it('A 类无需补问', () => {
    const result = evaluateSafetyGate(makeInput());
    expect(result.require_followup_questions).toBe(false);
  });
});

// ============================================================
// 2. Gate B — 展示+补问
// ============================================================

describe('SafetyGate — Gate B (展示+补问)', () => {
  it('缺失信息 >3 项触发 B 类', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        missing_critical_info: ['过敏史', '用药史', '家族史', '手术史'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('B');
    expect(result.require_followup_questions).toBe(true);
    expect(result.allow_auto_display).toBe(false);
  });

  it('缺失信息 ≤3 项不触发 B 类', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        missing_critical_info: ['过敏史', '用药史'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('A');
  });

  it('缺失信息 + must_ask_followups 合并计数', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        missing_critical_info: ['过敏史', '用药史'],
      }),
      adjudicated_assessment: makeAdjudication({
        must_ask_followups: ['家族史', '手术史'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('B');
    expect(result.triggered_rules.some(r => r.rule_id === 'INFO-001')).toBe(true);
  });
});

// ============================================================
// 3. Gate C — 人工审核
// ============================================================

describe('SafetyGate — Gate C (人工审核)', () => {
  it('儿童患者 (<14) → C 类 (AGE-001)', () => {
    const input = makeInput({
      case_packet: makeCasePacket({ demographics: { age: 10, sex: 'male' } }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
    expect(result.require_human_review).toBe(true);
    expect(result.triggered_rules.some(r => r.rule_id === 'AGE-001')).toBe(true);
  });

  it('高龄患者 (>75) → C 类 (AGE-002)', () => {
    const input = makeInput({
      case_packet: makeCasePacket({ demographics: { age: 80, sex: 'female' } }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
    expect(result.triggered_rules.some(r => r.rule_id === 'AGE-002')).toBe(true);
  });

  it('仲裁置信度 < 0.7 → C 类 (MODEL-001)', () => {
    const input = makeInput({
      adjudicated_assessment: makeAdjudication({ confidence: 0.5 }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
    expect(result.triggered_rules.some(r => r.rule_id === 'MODEL-001')).toBe(true);
  });

  it('仲裁官要求人工升级 → C 类 (MODEL-002)', () => {
    const input = makeInput({
      adjudicated_assessment: makeAdjudication({
        escalate_to_human: true,
        escalation_reason: '需要专家会诊',
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
    expect(result.triggered_rules.some(r => r.rule_id === 'MODEL-002')).toBe(true);
  });

  it('挑战官检测到 under-triage → C 类 (MODEL-003)', () => {
    const challenge: ChallengeReview = {
      case_id: 'test-sg-001',
      main_concerns: ['分诊不足'],
      alternative_risks: [],
      under_triage_risk: true,
      over_triage_risk: false,
      recommended_escalation: false,
      missing_high_impact_data: [],
      confidence: 0.8,
    };
    const input = makeInput({ challenge_review: challenge });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
    expect(result.triggered_rules.some(r => r.rule_id === 'MODEL-003')).toBe(true);
  });

  it('分诊与仲裁风险等级差 ≥2 → C 类 (MODEL-007)', () => {
    const input = makeInput({
      triage_assessment: makeTriage({ urgency_level: 'low' }),
      adjudicated_assessment: makeAdjudication({ final_risk_level: 'high' }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
    expect(result.triggered_rules.some(r => r.rule_id === 'MODEL-007')).toBe(true);
  });

  it('仲裁 final_risk_level = "high" → C 类', () => {
    const input = makeInput({
      adjudicated_assessment: makeAdjudication({
        final_risk_level: 'high',
        safe_to_auto_display: false,
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
  });

  it('safe_to_auto_display = false → C 类', () => {
    const input = makeInput({
      adjudicated_assessment: makeAdjudication({
        safe_to_auto_display: false,
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
  });
});

// ============================================================
// 4. Gate D — 紧急提示
// ============================================================

describe('SafetyGate — Gate D (紧急提示)', () => {
  it('红旗关键词 "呕血" → D 类 (severity=emergency)', () => {
    const input = makeInput({
      case_packet: makeCasePacket({
        raw_text_bundle: [{ source: 'questionnaire', text: '近期出现呕血' }],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('D');
    expect(result.require_emergency_notice).toBe(true);
  });

  it('组合触发 "胸痛 + 出汗" → D 类 (CV-001)', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        chief_complaint: '胸痛伴大量出汗',
      }),
      case_packet: makeCasePacket({
        raw_text_bundle: [{ source: 'questionnaire', text: '胸痛伴大量出汗' }],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('D');
    expect(result.triggered_rules.some(r => r.severity === 'emergency')).toBe(true);
  });

  it('分诊建议急诊评估 → D 类 (MODEL-006)', () => {
    const input = makeInput({
      triage_assessment: makeTriage({ needs_emergency_evaluation: true }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('D');
    expect(result.triggered_rules.some(r => r.rule_id === 'MODEL-006')).toBe(true);
  });

  it('[AUDIT-FIX 回归] 心血管类 emergency severity 不应被降级为 C', () => {
    // 此测试确保 AUDIT-FIX 修复后，cardiovascular category + emergency severity
    // 能正确触发 D 类而非 C 类
    const input = makeInput({
      case_packet: makeCasePacket({
        raw_text_bundle: [{ source: 'questionnaire', text: '突然半身不遂，说话含糊' }],
      }),
      structured_case: makeStructuredCase({
        chief_complaint: '突然半身不遂，说话含糊',
      }),
    });
    const result = evaluateSafetyGate(input);
    // 半身不遂+说话含糊 应匹配 NEURO-001 stroke 规则 (severity=emergency)
    expect(result.gate_class).toBe('D');
  });

  it('AI 识别的红旗（不在词典中）→ 也记录为 emergency', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        red_flags: ['急性肺栓塞风险极高'],
      }),
    });
    const result = evaluateSafetyGate(input);
    // AI 红旗默认 severity=emergency
    expect(result.triggered_rules.some(r => r.rule_id.startsWith('AI-FLAG'))).toBe(true);
    expect(result.gate_class).toBe('D');
  });
});

// ============================================================
// 5. 交叉验证 (XVAL)
// ============================================================

describe('SafetyGate — 交叉验证', () => {
  it('XVAL-001: 红旗未被鉴别诊断覆盖 → C 类', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        red_flags: ['AFP 显著升高'],
      }),
      triage_assessment: makeTriage({
        differential_directions: [
          { name: '胃炎', likelihood: 'medium', reason: '上腹痛' },
        ],
        do_not_miss_conditions: ['急性胰腺炎'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.triggered_rules.some(r => r.rule_id === 'XVAL-001')).toBe(true);
  });

  it('XVAL-002: 肿瘤标志物升高但未推荐肿瘤排查 → C 类', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        exam_findings: ['AFP 升高 650ng/mL'],
      }),
      triage_assessment: makeTriage({
        suggested_tests: ['腹部超声', '血常规'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.triggered_rules.some(r => r.rule_id === 'XVAL-002')).toBe(true);
  });

  it('XVAL-002: 肿瘤标志物 + 推荐 PET-CT → 不触发', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        exam_findings: ['AFP 升高 650ng/mL'],
      }),
      triage_assessment: makeTriage({
        suggested_tests: ['PET-CT', '肝脏增强MRI'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.triggered_rules.some(r => r.rule_id === 'XVAL-002')).toBe(false);
  });

  it('XVAL-003: 心功能异常但未推荐心内科 → C 类', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        exam_findings: ['LVEF 30%'],
      }),
      triage_assessment: makeTriage({
        suggested_tests: ['血常规'],
        recommended_departments: ['内科'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.triggered_rules.some(r => r.rule_id === 'XVAL-003')).toBe(true);
  });

  it('XVAL-004: 三系统累及 + urgency low → C 类', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        known_diagnoses: ['高血压', '糖尿病', 'CKD G3a'],
        exam_findings: ['eGFR 45', 'HbA1c 7.5%', 'Agatston 520'],
      }),
      triage_assessment: makeTriage({ urgency_level: 'low' }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.triggered_rules.some(r => r.rule_id === 'XVAL-004')).toBe(true);
  });

  it('XVAL-005: 肝脏病变但未推荐 HBV/HCV 筛查 → C 类', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        exam_findings: ['肝脏占位性病变'],
      }),
      triage_assessment: makeTriage({
        suggested_tests: ['增强CT'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.triggered_rules.some(r => r.rule_id === 'XVAL-005')).toBe(true);
  });

  it('XVAL-006: 恶性肿瘤转移但未推荐 MDT → C 类', () => {
    const input = makeInput({
      structured_case: makeStructuredCase({
        exam_findings: ['肝转移灶多发'],
        known_diagnoses: ['肺癌'],
      }),
      adjudicated_assessment: makeAdjudication({
        final_risk_level: 'high',
        safe_to_auto_display: false,
      }),
      triage_assessment: makeTriage({
        suggested_tests: ['PET-CT'],
        differential_directions: [{ name: '肺癌肝转移', likelihood: 'high', reason: '影像学证据' }],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.triggered_rules.some(r => r.rule_id === 'XVAL-006')).toBe(true);
  });
});

// ============================================================
// 6. 优先级：D > C > B > A
// ============================================================

describe('SafetyGate — 分类优先级', () => {
  it('同时有 emergency + missing_info → D 类（不降级为 B）', () => {
    const input = makeInput({
      case_packet: makeCasePacket({
        raw_text_bundle: [{ source: 'q', text: '大量呕血' }],
      }),
      structured_case: makeStructuredCase({
        missing_critical_info: ['过敏史', '用药史', '家族史', '手术史'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('D');
  });

  it('同时有 high_risk_population + missing_info → C 类（不降级为 B）', () => {
    const input = makeInput({
      case_packet: makeCasePacket({ demographics: { age: 10, sex: 'male' } }),
      structured_case: makeStructuredCase({
        missing_critical_info: ['过敏史', '用药史', '家族史', '手术史'],
      }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.gate_class).toBe('C');
  });
});

// ============================================================
// 7. 输出格式
// ============================================================

describe('SafetyGate — 输出格式', () => {
  it('explanation 包含 gate 描述', () => {
    const result = evaluateSafetyGate(makeInput());
    expect(result.explanation).toBeTruthy();
  });

  it('D 类 explanation 包含紧急提示文本', () => {
    const input = makeInput({
      triage_assessment: makeTriage({ needs_emergency_evaluation: true }),
    });
    const result = evaluateSafetyGate(input);
    expect(result.explanation).toContain('急症');
  });

  it('triggered_rules 中每条都有 rule_id 和 severity', () => {
    const input = makeInput({
      case_packet: makeCasePacket({ demographics: { age: 10, sex: 'male' } }),
    });
    const result = evaluateSafetyGate(input);
    for (const rule of result.triggered_rules) {
      expect(rule.rule_id).toBeTruthy();
      expect(['high', 'emergency']).toContain(rule.severity);
    }
  });
});
