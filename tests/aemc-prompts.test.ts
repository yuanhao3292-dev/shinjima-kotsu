import { describe, it, expect } from 'vitest';
import {
  getExtractorSystemPrompt,
  buildExtractorUserPrompt,
  EXTRACTOR_PROMPT_VERSION,
} from '@/services/aemc/prompts/extractor-v1';
import {
  getTriageSystemPrompt,
  buildTriageUserPrompt,
  TRIAGE_PROMPT_VERSION,
} from '@/services/aemc/prompts/triage-v1';
import {
  getChallengerSystemPrompt,
  buildChallengerUserPrompt,
  CHALLENGER_PROMPT_VERSION,
} from '@/services/aemc/prompts/challenger-v1';
import {
  getAdjudicatorSystemPrompt,
  buildAdjudicatorUserPrompt,
  ADJUDICATOR_PROMPT_VERSION,
} from '@/services/aemc/prompts/adjudicator-v1';
import {
  getJudgeSystemPrompt,
  buildJudgeUserPrompt,
  JUDGE_PROMPT_VERSION,
} from '@/services/aemc/prompts/judge-v1';

// ============================================================
// Version strings
// ============================================================

describe('Prompt versions', () => {
  it('extractor version follows semver-like pattern', () => {
    expect(EXTRACTOR_PROMPT_VERSION).toMatch(/^extractor-v\d+\.\d+$/);
  });

  it('triage version follows pattern', () => {
    expect(TRIAGE_PROMPT_VERSION).toMatch(/^triage-v\d+\.\d+$/);
  });

  it('challenger version follows pattern', () => {
    expect(CHALLENGER_PROMPT_VERSION).toMatch(/^challenger-v\d+\.\d+$/);
  });

  it('adjudicator version follows pattern', () => {
    expect(ADJUDICATOR_PROMPT_VERSION).toMatch(/^adjudicator-v\d+\.\d+$/);
  });

  it('judge version follows pattern', () => {
    expect(JUDGE_PROMPT_VERSION).toMatch(/^judge-v\d+\.\d+$/);
  });
});

// ============================================================
// AI-1 Extractor prompts
// ============================================================

describe('getExtractorSystemPrompt', () => {
  it('returns non-empty string', () => {
    const prompt = getExtractorSystemPrompt('日本語');
    expect(prompt.length).toBeGreaterThan(100);
  });

  it('includes language parameter', () => {
    const prompt = getExtractorSystemPrompt('中文');
    expect(prompt).toContain('中文');
  });

  it('includes JSON schema instruction', () => {
    const prompt = getExtractorSystemPrompt('English');
    expect(prompt).toContain('case_id');
    expect(prompt).toContain('chief_complaint');
    expect(prompt).toContain('red_flags');
  });

  it('includes red flag checklist', () => {
    const prompt = getExtractorSystemPrompt('English');
    expect(prompt).toContain('RED FLAG CHECKLIST');
    expect(prompt).toContain('Acute Coronary Syndrome');
    expect(prompt).toContain('Stroke');
  });

  it('includes tumor marker extraction rules', () => {
    const prompt = getExtractorSystemPrompt('English');
    expect(prompt).toContain('tumor marker');
    expect(prompt).toContain('CEA');
    expect(prompt).toContain('AFP');
  });

  it('includes imaging feature extraction rules', () => {
    const prompt = getExtractorSystemPrompt('English');
    expect(prompt).toContain('DWI');
    expect(prompt).toContain('enhancement');
  });
});

describe('buildExtractorUserPrompt', () => {
  it('wraps case data in delimiters', () => {
    const prompt = buildExtractorUserPrompt('{"test": true}');
    expect(prompt).toContain('---PATIENT DATA START---');
    expect(prompt).toContain('---PATIENT DATA END---');
    expect(prompt).toContain('{"test": true}');
  });

  it('requests JSON-only response', () => {
    const prompt = buildExtractorUserPrompt('{}');
    expect(prompt).toContain('Return ONLY the JSON object');
  });
});

// ============================================================
// AI-2 Triage prompts
// ============================================================

describe('getTriageSystemPrompt', () => {
  it('returns non-empty string', () => {
    const prompt = getTriageSystemPrompt('日本語');
    expect(prompt.length).toBeGreaterThan(100);
  });

  it('includes language parameter', () => {
    const prompt = getTriageSystemPrompt('中文');
    expect(prompt).toContain('中文');
  });

  it('includes risk level guidelines', () => {
    const prompt = getTriageSystemPrompt('English');
    expect(prompt).toContain('"low"');
    expect(prompt).toContain('"medium"');
    expect(prompt).toContain('"high"');
    expect(prompt).toContain('"emergency"');
  });

  it('includes confidence scoring guidelines', () => {
    const prompt = getTriageSystemPrompt('English');
    expect(prompt).toContain('CONFIDENCE SCORING');
    expect(prompt).toContain('0.9-1.0');
  });

  it('includes test safety checks', () => {
    const prompt = getTriageSystemPrompt('English');
    expect(prompt).toContain('Exercise stress test');
    expect(prompt).toContain('Agatston');
    expect(prompt).toContain('CONTRAINDICATED');
  });

  it('includes tumor marker awareness', () => {
    const prompt = getTriageSystemPrompt('English');
    expect(prompt).toContain('TUMOR MARKER');
    expect(prompt).toContain('SCC');
    expect(prompt).toContain('CYFRA');
  });

  it('includes JSON output schema', () => {
    const prompt = getTriageSystemPrompt('English');
    expect(prompt).toContain('urgency_level');
    expect(prompt).toContain('recommended_departments');
    expect(prompt).toContain('do_not_miss_conditions');
  });
});

describe('buildTriageUserPrompt', () => {
  it('wraps structured case in delimiters', () => {
    const prompt = buildTriageUserPrompt('{"case_id":"123"}');
    expect(prompt).toContain('---STRUCTURED CASE START---');
    expect(prompt).toContain('---STRUCTURED CASE END---');
    expect(prompt).toContain('{"case_id":"123"}');
  });
});

// ============================================================
// AI-3 Challenger prompts
// ============================================================

describe('getChallengerSystemPrompt', () => {
  it('returns non-empty string', () => {
    const prompt = getChallengerSystemPrompt('English');
    expect(prompt.length).toBeGreaterThan(100);
  });

  it('includes Devil\'s Advocate role', () => {
    const prompt = getChallengerSystemPrompt('English');
    expect(prompt).toContain('Devil');
    expect(prompt).toContain('CHALLENGE');
  });

  it('includes under/over triage detection', () => {
    const prompt = getChallengerSystemPrompt('English');
    expect(prompt).toContain('under_triage_risk');
    expect(prompt).toContain('over_triage_risk');
  });

  it('includes test safety review', () => {
    const prompt = getChallengerSystemPrompt('English');
    expect(prompt).toContain('Exercise stress test');
    expect(prompt).toContain('Agatston');
  });
});

describe('buildChallengerUserPrompt', () => {
  it('builds sequential mode prompt when triage is provided', () => {
    const prompt = buildChallengerUserPrompt('{"case":"data"}', '{"triage":"data"}');
    expect(prompt).toContain('---STRUCTURED CASE');
    expect(prompt).toContain('---TRIAGE ASSESSMENT');
    expect(prompt).toContain('THIS IS WHAT YOU ARE CHALLENGING');
  });

  it('builds parallel mode prompt when no triage is provided', () => {
    const prompt = buildChallengerUserPrompt('{"case":"data"}');
    expect(prompt).toContain('Independently evaluate');
    expect(prompt).not.toContain('TRIAGE ASSESSMENT');
  });
});

// ============================================================
// AI-4 Adjudicator prompts
// ============================================================

describe('getAdjudicatorSystemPrompt', () => {
  it('returns non-empty string', () => {
    const prompt = getAdjudicatorSystemPrompt('English');
    expect(prompt.length).toBeGreaterThan(100);
  });

  it('includes escalation triggers', () => {
    const prompt = getAdjudicatorSystemPrompt('English');
    expect(prompt).toContain('ESCALATION TRIGGERS');
    expect(prompt).toContain('escalate_to_human');
  });

  it('includes safe_to_auto_display rules', () => {
    const prompt = getAdjudicatorSystemPrompt('English');
    expect(prompt).toContain('SAFE_TO_AUTO_DISPLAY');
  });

  it('includes oncology quality check', () => {
    const prompt = getAdjudicatorSystemPrompt('English');
    expect(prompt).toContain('ONCOLOGY QUALITY CHECK');
    expect(prompt).toContain('primary tumor');
  });

  it('includes challenge review integration', () => {
    const prompt = getAdjudicatorSystemPrompt('English');
    expect(prompt).toContain('CHALLENGE REVIEW INTEGRATION');
    expect(prompt).toContain('under_triage_risk');
  });
});

describe('buildAdjudicatorUserPrompt', () => {
  it('includes structured case and triage sections', () => {
    const prompt = buildAdjudicatorUserPrompt('{"case":"data"}', '{"triage":"data"}');
    expect(prompt).toContain('---STRUCTURED CASE');
    expect(prompt).toContain('---TRIAGE ASSESSMENT');
  });

  it('includes challenge review when provided', () => {
    const prompt = buildAdjudicatorUserPrompt('{"case":"data"}', '{"triage":"data"}', '{"challenge":"data"}');
    expect(prompt).toContain('---CHALLENGE REVIEW');
    expect(prompt).toContain('{"challenge":"data"}');
  });

  it('notes absence of challenge review when not provided', () => {
    const prompt = buildAdjudicatorUserPrompt('{"case":"data"}', '{"triage":"data"}');
    expect(prompt).toContain('No AI-3 Challenge Review is available');
  });
});

// ============================================================
// AI-5 Judge prompts
// ============================================================

describe('getJudgeSystemPrompt', () => {
  it('returns non-empty string', () => {
    const prompt = getJudgeSystemPrompt('English');
    expect(prompt.length).toBeGreaterThan(100);
  });

  it('includes consistency check categories', () => {
    const prompt = getJudgeSystemPrompt('English');
    expect(prompt).toContain('differential_coherence');
    expect(prompt).toContain('department_logic');
    expect(prompt).toContain('urgency_justification');
    expect(prompt).toContain('test_rationale');
    expect(prompt).toContain('high_risk_exclusion');
  });

  it('includes escalation rules', () => {
    const prompt = getJudgeSystemPrompt('English');
    expect(prompt).toContain('should_escalate');
    expect(prompt).toContain('"high" severity');
  });
});

describe('buildJudgeUserPrompt', () => {
  it('includes all three inputs', () => {
    const prompt = buildJudgeUserPrompt('{"case":"c"}', '{"triage":"t"}', '{"adjudicated":"a"}');
    expect(prompt).toContain('## Structured Case');
    expect(prompt).toContain('## Triage Assessment');
    expect(prompt).toContain('## Adjudicated Assessment');
    expect(prompt).toContain('{"case":"c"}');
    expect(prompt).toContain('{"triage":"t"}');
    expect(prompt).toContain('{"adjudicated":"a"}');
  });
});
