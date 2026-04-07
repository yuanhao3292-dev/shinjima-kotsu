import { describe, it, expect } from 'vitest';
import {
  JTB_DEPARTMENT_MAP,
  SPECIALTY_TO_DEPARTMENTS,
  normalizeJTBDepartment,
  inferDepartments,
  inferCategory,
} from '@/services/aemc/department-mapping';

// ============================================================
// normalizeJTBDepartment
// ============================================================

describe('normalizeJTBDepartment', () => {
  it('maps standard Japanese department names', () => {
    expect(normalizeJTBDepartment('内科')).toBe('内科');
    expect(normalizeJTBDepartment('外科')).toBe('外科');
    expect(normalizeJTBDepartment('小児科')).toBe('小儿科');
  });

  it('maps specialized Japanese departments', () => {
    expect(normalizeJTBDepartment('消化器内科')).toBe('消化内科');
    expect(normalizeJTBDepartment('循環器内科')).toBe('循环内科');
    expect(normalizeJTBDepartment('脳神経外科')).toBe('脑神经外科');
  });

  it('correctly maps 整形外科 to 骨科 (not aesthetic surgery)', () => {
    expect(normalizeJTBDepartment('整形外科')).toBe('骨科');
  });

  it('maps 形成外科 to 整形外科 (aesthetic/plastic surgery)', () => {
    expect(normalizeJTBDepartment('形成外科')).toBe('整形外科');
    expect(normalizeJTBDepartment('美容外科')).toBe('整形外科');
  });

  it('trims whitespace', () => {
    expect(normalizeJTBDepartment('  内科  ')).toBe('内科');
  });

  it('returns null for unknown department names', () => {
    expect(normalizeJTBDepartment('存在しない科')).toBeNull();
    expect(normalizeJTBDepartment('unknown')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(normalizeJTBDepartment('')).toBeNull();
  });

  it('maps 透析科 to 肾脏内科', () => {
    expect(normalizeJTBDepartment('透析科')).toBe('肾脏内科');
  });

  it('maps 人間ドック to 健康诊断科', () => {
    expect(normalizeJTBDepartment('人間ドック')).toBe('健康诊断科');
  });
});

// ============================================================
// JTB_DEPARTMENT_MAP structure
// ============================================================

describe('JTB_DEPARTMENT_MAP', () => {
  it('has more than 80 entries', () => {
    expect(Object.keys(JTB_DEPARTMENT_MAP).length).toBeGreaterThan(80);
  });

  it('all values are non-empty strings', () => {
    for (const [key, value] of Object.entries(JTB_DEPARTMENT_MAP)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================
// SPECIALTY_TO_DEPARTMENTS structure
// ============================================================

describe('SPECIALTY_TO_DEPARTMENTS', () => {
  it('has entries for common specialties', () => {
    expect(SPECIALTY_TO_DEPARTMENTS['人間ドック']).toContain('健康诊断科');
    expect(SPECIALTY_TO_DEPARTMENTS['再生医療']).toContain('再生医疗科');
    expect(SPECIALTY_TO_DEPARTMENTS['免疫療法']).toContain('免疫细胞治疗科');
  });

  it('all values are non-empty arrays of strings', () => {
    for (const [, depts] of Object.entries(SPECIALTY_TO_DEPARTMENTS)) {
      expect(Array.isArray(depts)).toBe(true);
      expect(depts.length).toBeGreaterThan(0);
      depts.forEach(d => expect(typeof d).toBe('string'));
    }
  });
});

// ============================================================
// inferDepartments
// ============================================================

describe('inferDepartments', () => {
  it('infers from raw department names', () => {
    const result = inferDepartments(['内科', '外科'], [], [], '', '');
    expect(result).toContain('内科');
    expect(result).toContain('外科');
  });

  it('infers from specialties via keyword matching', () => {
    const result = inferDepartments([], ['人間ドック'], [], '', '');
    expect(result).toContain('健康诊断科');
  });

  it('infers from program names', () => {
    const result = inferDepartments([], [], [{ name: 'PET-CT検診', category: 'screening' }], '', '');
    expect(result).toContain('健康诊断科');
    expect(result).toContain('放射科');
  });

  it('infers from overview text', () => {
    const result = inferDepartments([], [], [], '当院は再生医療を専門としています', '');
    expect(result).toContain('再生医疗科');
  });

  it('infers from salesPoints text', () => {
    const result = inferDepartments([], [], [], '', '免疫細胞療法による治療');
    expect(result).toContain('免疫细胞治疗科');
  });

  it('deduplicates departments', () => {
    const result = inferDepartments(
      ['内科', '総合内科'], // both map to 内科
      [],
      [],
      '',
      ''
    );
    const count = result.filter(d => d === '内科').length;
    expect(count).toBe(1);
  });

  it('returns empty array when nothing matches', () => {
    const result = inferDepartments([], [], [], '', '');
    expect(result).toEqual([]);
  });
});

// ============================================================
// inferCategory
// ============================================================

describe('inferCategory', () => {
  it('returns stem_cell when 幹細胞 is present', () => {
    expect(inferCategory(['幹細胞治療'], [], [], '')).toBe('stem_cell');
  });

  it('returns stem_cell when 再生医療 is present', () => {
    expect(inferCategory([], [], [], '再生医療を提供')).toBe('stem_cell');
  });

  it('returns aesthetics when 美容 is present', () => {
    expect(inferCategory(['美容外科'], [], [], '')).toBe('aesthetics');
  });

  it('returns aesthetics for 糸リフト', () => {
    expect(inferCategory([], [], [{ name: '糸リフト施術', category: 'beauty' }], '')).toBe('aesthetics');
  });

  it('returns health_screening for 人間ドック only (no 外科/内科)', () => {
    expect(inferCategory(['人間ドック'], ['health'], [], '')).toBe('health_screening');
  });

  it('returns general_hospital when 人間ドック + 外科 present', () => {
    expect(inferCategory(['人間ドック'], [], [], '外科も対応しています')).toBe('general_hospital');
  });

  it('returns general_hospital by default', () => {
    expect(inferCategory([], [], [], '')).toBe('general_hospital');
  });

  it('stem_cell takes priority over aesthetics', () => {
    expect(inferCategory(['幹細胞', '美容'], [], [], '')).toBe('stem_cell');
  });
});
