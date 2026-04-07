import { describe, it, expect } from 'vitest';
import {
  SCREENING_QUESTIONS,
  CATEGORY_NAMES,
  CATEGORY_ICONS,
  TOTAL_QUESTIONS,
  PHASE_1_QUESTIONS,
  PHASE_2_QUESTIONS,
  FREE_SCREENING_LIMIT,
  BODY_PART_QUESTION_MAPPING,
  ALWAYS_SHOW_QUESTIONS,
  getQuestionsByCategory,
  getPhase1Questions,
  getPhase2Questions,
  getPhase2QuestionsByBodyParts,
  type ScreeningQuestion,
} from '@/lib/screening-questions';

// ============================================================
// Data integrity
// ============================================================

describe('SCREENING_QUESTIONS data integrity', () => {
  it('has 20 questions', () => {
    expect(SCREENING_QUESTIONS).toHaveLength(20);
  });

  it('all questions have required fields', () => {
    for (const q of SCREENING_QUESTIONS) {
      expect(q.id).toBeGreaterThan(0);
      expect(q.category).toBeDefined();
      expect(q.question).toBeTruthy();
      expect(q.type).toMatch(/^(single|multi|input)$/);
      expect([1, 2]).toContain(q.phase);
    }
  });

  it('has unique IDs', () => {
    const ids = SCREENING_QUESTIONS.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('IDs are sequential 1-20', () => {
    const ids = SCREENING_QUESTIONS.map(q => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it('single/multi questions have options', () => {
    SCREENING_QUESTIONS.filter(q => q.type !== 'input').forEach(q => {
      expect(q.options).toBeDefined();
      expect(q.options!.length).toBeGreaterThan(0);
    });
  });

  it('input questions have placeholder', () => {
    SCREENING_QUESTIONS.filter(q => q.type === 'input').forEach(q => {
      expect(q.placeholder).toBeDefined();
    });
  });

  it('option values are non-empty strings', () => {
    for (const q of SCREENING_QUESTIONS) {
      if (q.options) {
        for (const opt of q.options) {
          expect(opt.value.length).toBeGreaterThan(0);
          expect(opt.label.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('valid categories only', () => {
    const validCategories = ['basic', 'family', 'symptoms', 'lifestyle', 'history', 'mental', 'cancer_risk', 'cardiovascular'];
    for (const q of SCREENING_QUESTIONS) {
      expect(validCategories).toContain(q.category);
    }
  });
});

// ============================================================
// Phase distribution
// ============================================================

describe('Phase distribution', () => {
  it('phase 1 has 10 questions', () => {
    expect(PHASE_1_QUESTIONS).toBe(10);
  });

  it('phase 2 has 10 questions', () => {
    expect(PHASE_2_QUESTIONS).toBe(10);
  });

  it('total matches sum of phases', () => {
    expect(TOTAL_QUESTIONS).toBe(PHASE_1_QUESTIONS + PHASE_2_QUESTIONS);
  });

  it('phase 1 questions are IDs 1-10', () => {
    const phase1Ids = SCREENING_QUESTIONS.filter(q => q.phase === 1).map(q => q.id);
    expect(phase1Ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('phase 2 questions are IDs 11-20', () => {
    const phase2Ids = SCREENING_QUESTIONS.filter(q => q.phase === 2).map(q => q.id);
    expect(phase2Ids).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });
});

// ============================================================
// Constants
// ============================================================

describe('CATEGORY_NAMES', () => {
  it('covers all used categories', () => {
    const usedCategories = new Set(SCREENING_QUESTIONS.map(q => q.category));
    for (const cat of usedCategories) {
      expect(CATEGORY_NAMES[cat]).toBeDefined();
    }
  });
});

describe('CATEGORY_ICONS', () => {
  it('covers all used categories', () => {
    const usedCategories = new Set(SCREENING_QUESTIONS.map(q => q.category));
    for (const cat of usedCategories) {
      expect(CATEGORY_ICONS[cat]).toBeDefined();
    }
  });
});

describe('ALWAYS_SHOW_QUESTIONS', () => {
  it('contains IDs 1-10', () => {
    expect(ALWAYS_SHOW_QUESTIONS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('FREE_SCREENING_LIMIT', () => {
  it('is 5', () => {
    expect(FREE_SCREENING_LIMIT).toBe(5);
  });
});

describe('BODY_PART_QUESTION_MAPPING', () => {
  it('has mappings for all body parts', () => {
    const expected = ['head', 'neck', 'chest', 'abdomen', 'pelvis', 'left-arm', 'right-arm', 'left-leg', 'right-leg', 'back'];
    for (const part of expected) {
      expect(BODY_PART_QUESTION_MAPPING).toHaveProperty(part);
    }
  });

  it('mapped IDs reference phase 2 questions', () => {
    const phase2Ids = new Set(SCREENING_QUESTIONS.filter(q => q.phase === 2).map(q => q.id));
    for (const ids of Object.values(BODY_PART_QUESTION_MAPPING)) {
      for (const id of ids) {
        expect(phase2Ids.has(id)).toBe(true);
      }
    }
  });
});

// ============================================================
// Functions
// ============================================================

describe('getQuestionsByCategory', () => {
  it('returns only questions of the given category', () => {
    const basicQs = getQuestionsByCategory('basic');
    expect(basicQs.length).toBeGreaterThan(0);
    basicQs.forEach(q => expect(q.category).toBe('basic'));
  });

  it('returns empty array for unknown category', () => {
    expect(getQuestionsByCategory('nonexistent')).toEqual([]);
  });
});

describe('getPhase1Questions', () => {
  it('returns 10 phase 1 questions', () => {
    const qs = getPhase1Questions();
    expect(qs).toHaveLength(10);
    qs.forEach(q => expect(q.phase).toBe(1));
  });
});

describe('getPhase2Questions', () => {
  it('returns 10 phase 2 questions', () => {
    const qs = getPhase2Questions();
    expect(qs).toHaveLength(10);
    qs.forEach(q => expect(q.phase).toBe(2));
  });
});

describe('getPhase2QuestionsByBodyParts', () => {
  it('returns all phase 2 questions when no body parts selected', () => {
    const qs = getPhase2QuestionsByBodyParts([]);
    expect(qs).toHaveLength(10);
  });

  it('returns all phase 2 questions when null-ish', () => {
    // @ts-expect-error testing null input
    const qs = getPhase2QuestionsByBodyParts(null);
    expect(qs).toHaveLength(10);
  });

  it('includes non-body-part questions plus chest questions for chest', () => {
    const qs = getPhase2QuestionsByBodyParts(['chest']);
    const ids = qs.map(q => q.id);
    // Question 14 (chest symptoms) should be included
    expect(ids).toContain(14);
    // Non-body-part questions (11, 12, 17, 18, 19, 20) should also be included
    expect(ids).toContain(11);
    expect(ids).toContain(20);
  });

  it('includes abdomen question for abdomen body part', () => {
    const qs = getPhase2QuestionsByBodyParts(['abdomen']);
    const ids = qs.map(q => q.id);
    expect(ids).toContain(13);
  });

  it('includes head question for head body part', () => {
    const qs = getPhase2QuestionsByBodyParts(['head']);
    const ids = qs.map(q => q.id);
    expect(ids).toContain(15);
  });

  it('combines multiple body parts', () => {
    const qs = getPhase2QuestionsByBodyParts(['chest', 'abdomen', 'head']);
    const ids = qs.map(q => q.id);
    expect(ids).toContain(13);
    expect(ids).toContain(14);
    expect(ids).toContain(15);
  });
});
