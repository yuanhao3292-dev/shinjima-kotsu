import { describe, it, expect } from 'vitest';
import {
  MEDICAL_GLOSSARY,
  generateGlossaryPrompt,
  detectMedicalTerms,
} from '@/lib/config/medical-glossary';

// ============================================================
// MEDICAL_GLOSSARY data integrity
// ============================================================

describe('MEDICAL_GLOSSARY', () => {
  const entries = Object.entries(MEDICAL_GLOSSARY);
  const locales = ['ja', 'zh-CN', 'zh-TW', 'en'] as const;

  it('has entries', () => {
    expect(entries.length).toBeGreaterThan(10);
  });

  it('every entry has all 4 locale keys', () => {
    for (const [key, terms] of entries) {
      for (const locale of locales) {
        expect(terms[locale], `Missing ${locale} for ${key}`).toBeDefined();
        expect(terms[locale].length, `Empty ${locale} for ${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('includes stem cell terms', () => {
    expect(MEDICAL_GLOSSARY.stem_cells).toBeDefined();
    expect(MEDICAL_GLOSSARY.stem_cells.ja).toBe('幹細胞');
    expect(MEDICAL_GLOSSARY.stem_cells.en).toBe('Stem Cell');
  });

  it('includes cancer treatment terms', () => {
    expect(MEDICAL_GLOSSARY.cancer_vaccine).toBeDefined();
    expect(MEDICAL_GLOSSARY.immunotherapy).toBeDefined();
    expect(MEDICAL_GLOSSARY.heavy_ion_therapy).toBeDefined();
  });

  it('includes health screening terms', () => {
    expect(MEDICAL_GLOSSARY.health_screening).toBeDefined();
    expect(MEDICAL_GLOSSARY.comprehensive_checkup).toBeDefined();
    expect(MEDICAL_GLOSSARY.pet_ct).toBeDefined();
  });

  it('includes consultation terms', () => {
    expect(MEDICAL_GLOSSARY.initial_consultation).toBeDefined();
    expect(MEDICAL_GLOSSARY.remote_consultation).toBeDefined();
    expect(MEDICAL_GLOSSARY.follow_up).toBeDefined();
  });
});

// ============================================================
// generateGlossaryPrompt
// ============================================================

describe('generateGlossaryPrompt', () => {
  it('returns non-empty string', () => {
    const prompt = generateGlossaryPrompt();
    expect(prompt.length).toBeGreaterThan(100);
  });

  it('includes header', () => {
    const prompt = generateGlossaryPrompt();
    expect(prompt).toContain('医疗术语标准翻译对照表');
  });

  it('includes terms from glossary', () => {
    const prompt = generateGlossaryPrompt();
    expect(prompt).toContain('幹細胞');
    expect(prompt).toContain('Stem Cell');
    expect(prompt).toContain('干细胞');
  });

  it('includes instruction for unknown terms', () => {
    const prompt = generateGlossaryPrompt();
    expect(prompt).toContain('需确认译名');
  });

  it('has one line per glossary entry', () => {
    const prompt = generateGlossaryPrompt();
    const entryCount = Object.keys(MEDICAL_GLOSSARY).length;
    const lines = prompt.split('\n').filter(l => l.startsWith('- '));
    expect(lines).toHaveLength(entryCount);
  });
});

// ============================================================
// detectMedicalTerms
// ============================================================

describe('detectMedicalTerms', () => {
  it('detects Japanese terms', () => {
    const result = detectMedicalTerms('幹細胞治療を実施');
    expect(result).toContain('stem_cells');
  });

  it('detects Simplified Chinese terms', () => {
    const result = detectMedicalTerms('进行干细胞治疗');
    expect(result).toContain('stem_cells');
  });

  it('detects Traditional Chinese terms', () => {
    const result = detectMedicalTerms('進行幹細胞治療');
    expect(result).toContain('stem_cells');
  });

  it('detects multiple terms', () => {
    const result = detectMedicalTerms('免疫療法と幹細胞を組み合わせた治療');
    expect(result).toContain('stem_cells');
    expect(result).toContain('immunotherapy');
  });

  it('returns empty array for unrelated text', () => {
    const result = detectMedicalTerms('Hello World, this is a test');
    expect(result).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(detectMedicalTerms('')).toEqual([]);
  });
});
