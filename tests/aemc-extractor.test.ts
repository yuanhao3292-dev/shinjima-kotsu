import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock OpenAI
const mockCreate = vi.fn();
vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = { completions: { create: mockCreate } };
  },
}));

// Set API key
process.env.OPENROUTER_API_KEY = 'test-key';

import { extractCase, ExtractorError } from '@/services/aemc/extractor';
import type { CasePacket } from '@/services/aemc/types';

const mockCasePacket: CasePacket = {
  case_id: 'test-case-001',
  language: 'zh-CN',
  raw_answers: { symptoms: '头疼, 发烧', duration: '3天' },
  metadata: { screening_id: 'screen-001', source: 'web', ip: '127.0.0.1', user_agent: 'test', timestamp: new Date().toISOString() },
};

const mockStructuredCase = {
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

describe('extractCase', () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it('extracts case successfully', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(mockStructuredCase) } }],
      usage: { prompt_tokens: 500, completion_tokens: 300 },
    });

    const result = await extractCase(mockCasePacket);
    expect(result.structuredCase.case_id).toBe('test-case-001');
    expect(result.structuredCase.chief_complaint).toBeTruthy();
    expect(result.runRecord.role).toBe('extractor');
    expect(result.runRecord.model_vendor).toBe('openai');
    expect(result.runRecord.screening_id).toBe('screen-001');
    expect(result.runRecord.latency_ms).toBeGreaterThanOrEqual(0);
  });

  it('handles markdown-wrapped JSON response', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '```json\n' + JSON.stringify(mockStructuredCase) + '\n```' } }],
      usage: { prompt_tokens: 500, completion_tokens: 300 },
    });

    const result = await extractCase(mockCasePacket);
    expect(result.structuredCase.case_id).toBe('test-case-001');
  });

  it('fills in missing array fields', async () => {
    const partial = { case_id: 'test-case-001', chief_complaint: 'Test' };
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(partial) } }],
      usage: {},
    });

    const result = await extractCase(mockCasePacket);
    expect(Array.isArray(result.structuredCase.red_flags)).toBe(true);
    expect(Array.isArray(result.structuredCase.past_history)).toBe(true);
    expect(result.structuredCase.present_illness).toBeDefined();
  });

  it('fixes mismatched case_id', async () => {
    const wrongId = { ...mockStructuredCase, case_id: 'wrong-id' };
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(wrongId) } }],
      usage: {},
    });

    const result = await extractCase(mockCasePacket);
    expect(result.structuredCase.case_id).toBe('test-case-001');
  });

  it('throws ExtractorError on empty response', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '' } }],
      usage: {},
    });

    await expect(extractCase(mockCasePacket)).rejects.toThrow(ExtractorError);
  });

  it('throws ExtractorError on invalid JSON', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'not json' } }],
      usage: {},
    });

    await expect(extractCase(mockCasePacket)).rejects.toThrow(ExtractorError);
  });

  it('throws when API key missing', async () => {
    const orig = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;

    await expect(extractCase(mockCasePacket)).rejects.toThrow('OPENROUTER_API_KEY');

    process.env.OPENROUTER_API_KEY = orig;
  });

  it('ExtractorError has runRecord', () => {
    const record = {
      screening_id: 'test',
      model_vendor: 'openai',
      model_name: 'gpt-4o',
      role: 'extractor' as const,
      prompt_version: 'v1',
      input_hash: 'abc',
      output_json: {},
      latency_ms: 100,
    };
    const err = new ExtractorError('test error', record);
    expect(err.name).toBe('ExtractorError');
    expect(err.runRecord).toBe(record);
    expect(err.message).toBe('test error');
  });
});
