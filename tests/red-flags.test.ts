import { describe, it, expect } from 'vitest';
import {
  ALL_RED_FLAG_RULES,
  EMERGENCY_RED_FLAGS,
  ONCOLOGY_RED_FLAGS,
  TRAUMA_RED_FLAGS,
  HIGH_RISK_POPULATION_FLAGS,
  getRedFlagRuleIds,
  getRedFlagRuleById,
} from '@/services/aemc/red-flags';
import type { RedFlagRule, RedFlagCategory } from '@/services/aemc/red-flags';

// ============================================================
// Structure / integrity
// ============================================================

describe('ALL_RED_FLAG_RULES structure', () => {
  it('is a non-empty array', () => {
    expect(ALL_RED_FLAG_RULES.length).toBeGreaterThan(0);
  });

  it('equals the union of all category arrays', () => {
    const combined = [
      ...EMERGENCY_RED_FLAGS,
      ...ONCOLOGY_RED_FLAGS,
      ...TRAUMA_RED_FLAGS,
      ...HIGH_RISK_POPULATION_FLAGS,
    ];
    expect(ALL_RED_FLAG_RULES).toEqual(combined);
  });

  it('has unique IDs across all rules', () => {
    const ids = ALL_RED_FLAG_RULES.map(r => r.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all rules have valid category values', () => {
    const validCategories: RedFlagCategory[] = [
      'cardiovascular', 'neurological', 'gastrointestinal',
      'respiratory', 'oncology', 'systemic', 'trauma', 'high_risk_population',
    ];
    ALL_RED_FLAG_RULES.forEach(rule => {
      expect(validCategories).toContain(rule.category);
    });
  });

  it('all rules have valid severity', () => {
    ALL_RED_FLAG_RULES.forEach(rule => {
      expect(['high', 'emergency']).toContain(rule.severity);
    });
  });

  it('all rules have valid action', () => {
    ALL_RED_FLAG_RULES.forEach(rule => {
      expect(['escalate_human', 'emergency_notice']).toContain(rule.action);
    });
  });

  it('all rules have non-empty name_cn and name_en', () => {
    ALL_RED_FLAG_RULES.forEach(rule => {
      expect(rule.name_cn.length).toBeGreaterThan(0);
      expect(rule.name_en.length).toBeGreaterThan(0);
    });
  });

  it('all rules have non-empty rationale', () => {
    ALL_RED_FLAG_RULES.forEach(rule => {
      expect(rule.rationale.length).toBeGreaterThan(0);
    });
  });

  it('rules have either keywords or combo_trigger (or both)', () => {
    ALL_RED_FLAG_RULES.forEach(rule => {
      const hasKeywords = rule.keywords.length > 0;
      const hasCombo = !!rule.combo_trigger;
      expect(hasKeywords || hasCombo).toBe(true);
    });
  });

  it('combo_trigger has min_match >= 1', () => {
    ALL_RED_FLAG_RULES.forEach(rule => {
      if (rule.combo_trigger) {
        expect(rule.combo_trigger.min_match).toBeGreaterThanOrEqual(1);
        expect(rule.combo_trigger.keywords.length).toBeGreaterThanOrEqual(rule.combo_trigger.min_match);
      }
    });
  });
});

// ============================================================
// Category arrays
// ============================================================

describe('EMERGENCY_RED_FLAGS', () => {
  it('contains cardiovascular rules', () => {
    const cv = EMERGENCY_RED_FLAGS.filter(r => r.category === 'cardiovascular');
    expect(cv.length).toBeGreaterThan(0);
  });

  it('contains neurological rules', () => {
    const neuro = EMERGENCY_RED_FLAGS.filter(r => r.category === 'neurological');
    expect(neuro.length).toBeGreaterThan(0);
  });

  it('all have emergency severity or emergency action', () => {
    EMERGENCY_RED_FLAGS.forEach(rule => {
      expect(rule.severity).toBe('emergency');
    });
  });

  it('all have emergency_notice action', () => {
    EMERGENCY_RED_FLAGS.forEach(rule => {
      expect(rule.action).toBe('emergency_notice');
    });
  });
});

describe('ONCOLOGY_RED_FLAGS', () => {
  it('all have oncology category', () => {
    ONCOLOGY_RED_FLAGS.forEach(rule => {
      expect(rule.category).toBe('oncology');
    });
  });

  it('all have high severity', () => {
    ONCOLOGY_RED_FLAGS.forEach(rule => {
      expect(rule.severity).toBe('high');
    });
  });

  it('all have escalate_human action', () => {
    ONCOLOGY_RED_FLAGS.forEach(rule => {
      expect(rule.action).toBe('escalate_human');
    });
  });
});

describe('TRAUMA_RED_FLAGS', () => {
  it('has at least one trauma rule', () => {
    expect(TRAUMA_RED_FLAGS.length).toBeGreaterThan(0);
  });

  it('all have trauma category', () => {
    TRAUMA_RED_FLAGS.forEach(rule => {
      expect(rule.category).toBe('trauma');
    });
  });
});

describe('HIGH_RISK_POPULATION_FLAGS', () => {
  it('has pediatric and pregnant patient rules', () => {
    const ids = HIGH_RISK_POPULATION_FLAGS.map(r => r.id);
    expect(ids).toContain('POP-001'); // pediatric
    expect(ids).toContain('POP-002'); // pregnant
  });

  it('all have high_risk_population category', () => {
    HIGH_RISK_POPULATION_FLAGS.forEach(rule => {
      expect(rule.category).toBe('high_risk_population');
    });
  });
});

// ============================================================
// getRedFlagRuleIds
// ============================================================

describe('getRedFlagRuleIds', () => {
  it('returns array of string IDs', () => {
    const ids = getRedFlagRuleIds();
    expect(Array.isArray(ids)).toBe(true);
    ids.forEach(id => expect(typeof id).toBe('string'));
  });

  it('matches ALL_RED_FLAG_RULES length', () => {
    expect(getRedFlagRuleIds().length).toBe(ALL_RED_FLAG_RULES.length);
  });

  it('contains known rule IDs', () => {
    const ids = getRedFlagRuleIds();
    expect(ids).toContain('CV-001');
    expect(ids).toContain('NEURO-001');
    expect(ids).toContain('ONC-001');
    expect(ids).toContain('TRAUMA-001');
    expect(ids).toContain('POP-001');
  });
});

// ============================================================
// getRedFlagRuleById
// ============================================================

describe('getRedFlagRuleById', () => {
  it('returns the correct rule for a valid ID', () => {
    const rule = getRedFlagRuleById('CV-001');
    expect(rule).toBeDefined();
    expect(rule!.id).toBe('CV-001');
    expect(rule!.category).toBe('cardiovascular');
    expect(rule!.name_en).toBe('Suspected Acute Coronary Syndrome');
  });

  it('returns the suicide/self-harm rule', () => {
    const rule = getRedFlagRuleById('SYS-006');
    expect(rule).toBeDefined();
    expect(rule!.severity).toBe('emergency');
  });

  it('returns undefined for non-existent ID', () => {
    expect(getRedFlagRuleById('DOES-NOT-EXIST')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(getRedFlagRuleById('')).toBeUndefined();
  });
});
