import { describe, it, expect } from 'vitest';
import {
  BODY_PARTS,
  MEDICAL_DEPARTMENTS,
  BODY_PART_SYMPTOMS,
  GENERAL_SYMPTOMS,
  getBodyPartById,
  getDepartmentsByBodyPart,
  getSymptomsByBodyPart,
  getRecommendedDepartments,
  calculateRiskLevel,
  getAllSymptoms,
  type BodyPart,
  type MedicalDepartment,
  type Symptom,
} from '@/lib/body-map-config';

// ============================================================
// BODY_PARTS data integrity
// ============================================================

describe('BODY_PARTS', () => {
  it('has 10 body parts', () => {
    expect(BODY_PARTS).toHaveLength(10);
  });

  it('all body parts have required fields', () => {
    for (const part of BODY_PARTS) {
      expect(part.id).toBeTruthy();
      expect(part.name).toBeTruthy();
      expect(part.nameEn).toBeTruthy();
      expect(typeof part.path).toBe('string');
      expect(part.departments.length).toBeGreaterThan(0);
      expect(Array.isArray(part.symptomQuestionIds)).toBe(true);
      expect(Array.isArray(part.commonSymptoms)).toBe(true);
    }
  });

  it('has unique IDs', () => {
    const ids = BODY_PARTS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes expected body regions', () => {
    const ids = BODY_PARTS.map(p => p.id);
    expect(ids).toContain('head');
    expect(ids).toContain('chest');
    expect(ids).toContain('abdomen');
  });

  it('all department references exist in MEDICAL_DEPARTMENTS', () => {
    const deptIds = new Set(MEDICAL_DEPARTMENTS.map(d => d.id));
    for (const part of BODY_PARTS) {
      for (const deptId of part.departments) {
        expect(deptIds.has(deptId), `Department ${deptId} referenced by ${part.id} not found`).toBe(true);
      }
    }
  });
});

// ============================================================
// MEDICAL_DEPARTMENTS
// ============================================================

describe('MEDICAL_DEPARTMENTS', () => {
  it('has departments', () => {
    expect(MEDICAL_DEPARTMENTS.length).toBeGreaterThan(5);
  });

  it('all departments have required fields', () => {
    for (const dept of MEDICAL_DEPARTMENTS) {
      expect(dept.id).toBeTruthy();
      expect(dept.name).toBeTruthy();
      expect(dept.nameEn).toBeTruthy();
      expect(dept.icon).toBeTruthy();
      expect(dept.description).toBeTruthy();
      expect(dept.recommendedTests.length).toBeGreaterThan(0);
      expect(dept.bodyParts.length).toBeGreaterThan(0);
    }
  });

  it('has unique IDs', () => {
    const ids = MEDICAL_DEPARTMENTS.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ============================================================
// BODY_PART_SYMPTOMS
// ============================================================

describe('BODY_PART_SYMPTOMS', () => {
  it('has entries for multiple body parts', () => {
    expect(Object.keys(BODY_PART_SYMPTOMS).length).toBeGreaterThan(3);
  });

  it('each symptom has required fields', () => {
    for (const [partId, symptoms] of Object.entries(BODY_PART_SYMPTOMS)) {
      for (const symptom of symptoms) {
        expect(symptom.id, `Missing id in ${partId}`).toBeTruthy();
        expect(symptom.bodyPartId).toBe(partId);
        expect(symptom.name).toBeTruthy();
        expect(['low', 'medium', 'high']).toContain(symptom.severity);
        expect(Array.isArray(symptom.followUpQuestions)).toBe(true);
      }
    }
  });

  it('follow-up questions have valid structure', () => {
    for (const symptoms of Object.values(BODY_PART_SYMPTOMS)) {
      for (const symptom of symptoms) {
        for (const q of symptom.followUpQuestions) {
          expect(q.id).toBeTruthy();
          expect(q.question).toBeTruthy();
          expect(['single', 'multi', 'input']).toContain(q.type);
        }
      }
    }
  });
});

// ============================================================
// GENERAL_SYMPTOMS
// ============================================================

describe('GENERAL_SYMPTOMS', () => {
  it('has general symptoms', () => {
    expect(GENERAL_SYMPTOMS.length).toBeGreaterThan(0);
  });

  it('all have bodyPartId "general"', () => {
    for (const symptom of GENERAL_SYMPTOMS) {
      expect(symptom.bodyPartId).toBe('general');
    }
  });
});

// ============================================================
// getBodyPartById
// ============================================================

describe('getBodyPartById', () => {
  it('returns body part for valid ID', () => {
    const head = getBodyPartById('head');
    expect(head).toBeDefined();
    expect(head!.id).toBe('head');
    expect(head!.nameEn).toBe('Head');
  });

  it('returns undefined for unknown ID', () => {
    expect(getBodyPartById('nonexistent')).toBeUndefined();
  });

  it('returns all expected body parts', () => {
    for (const part of BODY_PARTS) {
      expect(getBodyPartById(part.id)).toBeDefined();
    }
  });
});

// ============================================================
// getDepartmentsByBodyPart
// ============================================================

describe('getDepartmentsByBodyPart', () => {
  it('returns departments for valid body part', () => {
    const depts = getDepartmentsByBodyPart('head');
    expect(depts.length).toBeGreaterThan(0);
    // All returned departments should exist in MEDICAL_DEPARTMENTS
    const deptIds = new Set(MEDICAL_DEPARTMENTS.map(d => d.id));
    for (const dept of depts) {
      expect(deptIds.has(dept.id)).toBe(true);
    }
  });

  it('returns empty array for unknown body part', () => {
    expect(getDepartmentsByBodyPart('nonexistent')).toEqual([]);
  });

  it('returns departments matching body part references', () => {
    const headPart = BODY_PARTS.find(p => p.id === 'head')!;
    const depts = getDepartmentsByBodyPart('head');
    const deptIds = depts.map(d => d.id);
    for (const expectedId of headPart.departments) {
      expect(deptIds).toContain(expectedId);
    }
  });
});

// ============================================================
// getSymptomsByBodyPart
// ============================================================

describe('getSymptomsByBodyPart', () => {
  it('returns symptoms for body part with symptoms', () => {
    const headSymptoms = getSymptomsByBodyPart('head');
    expect(headSymptoms.length).toBeGreaterThan(0);
    headSymptoms.forEach(s => expect(s.bodyPartId).toBe('head'));
  });

  it('returns empty array for unknown body part', () => {
    expect(getSymptomsByBodyPart('nonexistent')).toEqual([]);
  });
});

// ============================================================
// getRecommendedDepartments
// ============================================================

describe('getRecommendedDepartments', () => {
  it('returns empty array for empty symptoms', () => {
    expect(getRecommendedDepartments([])).toEqual([]);
  });

  it('returns departments for valid symptom IDs', () => {
    // Get a real symptom ID from the data
    const allSymptoms = getAllSymptoms();
    if (allSymptoms.length > 0) {
      const symptom = allSymptoms.find(s => s.bodyPartId !== 'general');
      if (symptom) {
        const depts = getRecommendedDepartments([symptom.id]);
        expect(depts.length).toBeGreaterThan(0);
      }
    }
  });

  it('returns empty for unknown symptom IDs', () => {
    const depts = getRecommendedDepartments(['nonexistent_symptom']);
    expect(depts).toEqual([]);
  });

  it('deduplicates departments when multiple symptoms share departments', () => {
    const headSymptoms = getSymptomsByBodyPart('head');
    if (headSymptoms.length >= 2) {
      const ids = headSymptoms.slice(0, 2).map(s => s.id);
      const depts = getRecommendedDepartments(ids);
      const deptIds = depts.map(d => d.id);
      // Should be deduplicated
      expect(new Set(deptIds).size).toBe(deptIds.length);
    }
  });
});

// ============================================================
// calculateRiskLevel
// ============================================================

describe('calculateRiskLevel', () => {
  const make = (severity: 'low' | 'medium' | 'high'): Symptom => ({
    id: `test-${Math.random()}`,
    bodyPartId: 'test',
    name: 'Test',
    severity,
    followUpQuestions: [],
  });

  it('returns low for no symptoms', () => {
    expect(calculateRiskLevel([])).toBe('low');
  });

  it('returns low for all low-severity symptoms', () => {
    expect(calculateRiskLevel([make('low'), make('low'), make('low')])).toBe('low');
  });

  it('returns low for 1-2 medium symptoms', () => {
    expect(calculateRiskLevel([make('medium'), make('medium')])).toBe('low');
  });

  it('returns medium for 3+ medium symptoms', () => {
    expect(calculateRiskLevel([make('medium'), make('medium'), make('medium')])).toBe('medium');
  });

  it('returns medium for 1 high symptom', () => {
    expect(calculateRiskLevel([make('high')])).toBe('medium');
  });

  it('returns high for 2+ high symptoms', () => {
    expect(calculateRiskLevel([make('high'), make('high')])).toBe('high');
  });

  it('returns high for 1 high + 2 medium', () => {
    expect(calculateRiskLevel([make('high'), make('medium'), make('medium')])).toBe('high');
  });
});

// ============================================================
// getAllSymptoms
// ============================================================

describe('getAllSymptoms', () => {
  it('returns non-empty array', () => {
    const all = getAllSymptoms();
    expect(all.length).toBeGreaterThan(0);
  });

  it('includes symptoms from body parts and general', () => {
    const all = getAllSymptoms();
    const bodyPartIds = new Set(all.map(s => s.bodyPartId));
    expect(bodyPartIds.has('general')).toBe(true);
    // Should also have non-general symptoms
    expect(bodyPartIds.size).toBeGreaterThan(1);
  });

  it('total equals sum of all body part symptoms + general', () => {
    let expected = 0;
    for (const symptoms of Object.values(BODY_PART_SYMPTOMS)) {
      expected += symptoms.length;
    }
    expected += GENERAL_SYMPTOMS.length;
    expect(getAllSymptoms()).toHaveLength(expected);
  });
});
