import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock OpenAI
const mockCreate = vi.fn();
vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = { completions: { create: mockCreate } };
  },
}));

process.env.OPENROUTER_API_KEY = 'test-key';

import { triageCase, TriageError } from '@/services/aemc/triage';
import type { StructuredCase } from '@/services/aemc/types';

const mockStructuredCase: StructuredCase = {
  case_id: 'test-case-001',
  chief_complaint: '头疼和发烧3天',
  present_illness: {
    symptoms: [{ name: '头疼' }, { name: '发烧' }],
    aggravating_factors: [],
    relieving_factors: [],
    associated_symptoms: [],
  },
  red_flags: [],
  missing_critical_info: [],
  past_history: [],
  medication_history: [],
  allergy_history: [],
  known_diagnoses: [],
  exam_findings: [],
  inferred_items: [],
  unknown_items: [],
  demographics: { age: 35, gender: 'male' },
  language: 'zh-CN',
};

const mockTriageAssessment = {
  case_id: 'test-case-001',
  urgency_level: 'medium',
  confidence: 0.8,
  needs_emergency_evaluation: false,
  doctor_review_required: true,
  recommended_departments: [{ name: '内科', nameEn: 'Internal Medicine' }],
  differential_directions: ['上呼吸道感染'],
  suggested_tests: ['血常规'],
  do_not_miss_conditions: [],
  missing_information_impact: [],
  reasoning_summary: '患者有头疼和发烧症状3天',
};

describe('triageCase', () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it('triages case successfully', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(mockTriageAssessment) } }],
      usage: { prompt_tokens: 600, completion_tokens: 400 },
    });

    const result = await triageCase(mockStructuredCase);
    expect(result.triageAssessment.case_id).toBe('test-case-001');
    expect(result.triageAssessment.urgency_level).toBe('medium');
    expect(result.runRecord.role).toBe('triage');
    expect(result.runRecord.model_vendor).toBe('google');
  });

  it('includes additional context in prompt', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(mockTriageAssessment) } }],
      usage: {},
    });

    const result = await triageCase(mockStructuredCase, '\n[CLINICAL SCORES: NEWS=5]');
    expect(result.triageAssessment.case_id).toBe('test-case-001');
  });

  it('validates and fills missing fields', async () => {
    const partial = {
      case_id: 'test-case-001',
      urgency_level: 'low',
      confidence: 0.7,
    };
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(partial) } }],
      usage: {},
    });

    const result = await triageCase(mockStructuredCase);
    expect(Array.isArray(result.triageAssessment.recommended_departments)).toBe(true);
    expect(Array.isArray(result.triageAssessment.differential_directions)).toBe(true);
    expect(result.triageAssessment.doctor_review_required).toBe(true); // default
  });

  it('fixes invalid urgency_level to high', async () => {
    const invalid = { ...mockTriageAssessment, urgency_level: 'invalid' };
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(invalid) } }],
      usage: {},
    });

    const result = await triageCase(mockStructuredCase);
    expect(result.triageAssessment.urgency_level).toBe('high');
  });

  it('fixes out-of-range confidence', async () => {
    const invalid = { ...mockTriageAssessment, confidence: 5 };
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(invalid) } }],
      usage: {},
    });

    const result = await triageCase(mockStructuredCase);
    expect(result.triageAssessment.confidence).toBe(0.5);
  });

  it('throws TriageError on empty response', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '' } }],
      usage: {},
    });

    await expect(triageCase(mockStructuredCase)).rejects.toThrow(TriageError);
  });

  it('throws TriageError on invalid JSON', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'not json' } }],
      usage: {},
    });

    await expect(triageCase(mockStructuredCase)).rejects.toThrow(TriageError);
  });

  it('throws when API key missing', async () => {
    const orig = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    await expect(triageCase(mockStructuredCase)).rejects.toThrow('OPENROUTER_API_KEY');
    process.env.OPENROUTER_API_KEY = orig;
  });

  it('TriageError has runRecord', () => {
    const record = {
      screening_id: 'test',
      model_vendor: 'google',
      model_name: 'gemini',
      role: 'triage' as const,
      prompt_version: 'v1',
      input_hash: 'abc',
      output_json: {},
      latency_ms: 100,
    };
    const err = new TriageError('test', record);
    expect(err.name).toBe('TriageError');
    expect(err.runRecord).toBe(record);
  });
});
