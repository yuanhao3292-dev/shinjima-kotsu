import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { aemcLog } from '@/services/aemc/logger';

describe('aemcLog', () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================
  // info / warn / error
  // ============================================================

  it('info emits JSON to console.info', () => {
    aemcLog.info('extractor', 'Test message', { foo: 'bar' });
    expect(infoSpy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(parsed.level).toBe('info');
    expect(parsed.service).toBe('aemc');
    expect(parsed.module).toBe('extractor');
    expect(parsed.message).toBe('Test message');
    expect(parsed.data).toEqual({ foo: 'bar' });
    expect(parsed.timestamp).toBeTruthy();
  });

  it('warn emits JSON to console.warn', () => {
    aemcLog.warn('triage', 'Warning msg');
    expect(warnSpy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(parsed.level).toBe('warn');
    expect(parsed.module).toBe('triage');
  });

  it('error emits JSON to console.error', () => {
    aemcLog.error('adjudicator', 'Error msg', { code: 500 });
    expect(errorSpy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(parsed.level).toBe('error');
    expect(parsed.data).toEqual({ code: 500 });
  });

  it('omits data field when empty object', () => {
    aemcLog.info('test', 'No data', {});
    const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(parsed.data).toBeUndefined();
  });

  it('omits data field when not provided', () => {
    aemcLog.info('test', 'No data');
    const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(parsed.data).toBeUndefined();
  });

  // ============================================================
  // aiCall
  // ============================================================

  describe('aiCall', () => {
    it('logs successful AI call to console.info', () => {
      aemcLog.aiCall('extractor', 'gpt-4o', {
        latencyMs: 2100,
        inputTokens: 500,
        outputTokens: 800,
        success: true,
      });
      expect(infoSpy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.level).toBe('info');
      expect(parsed.message).toContain('gpt-4o completed in 2100ms');
      expect(parsed.data.model).toBe('gpt-4o');
      expect(parsed.data.latencyMs).toBe(2100);
      expect(parsed.data.inputTokens).toBe(500);
      expect(parsed.data.outputTokens).toBe(800);
      expect(parsed.data.success).toBe(true);
    });

    it('logs failed AI call to console.error', () => {
      aemcLog.aiCall('triage', 'gemini-pro', {
        latencyMs: 5000,
        success: false,
        error: 'RateLimitError',
        attempt: 2,
      });
      expect(errorSpy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
      expect(parsed.level).toBe('error');
      expect(parsed.message).toContain('gemini-pro failed');
      expect(parsed.message).toContain('RateLimitError');
      expect(parsed.data.attempt).toBe(2);
      expect(parsed.data.error).toBe('RateLimitError');
    });

    it('omits optional fields when not provided', () => {
      aemcLog.aiCall('judge', 'claude', {
        latencyMs: 1000,
        success: true,
      });
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.data.inputTokens).toBeUndefined();
      expect(parsed.data.outputTokens).toBeUndefined();
      expect(parsed.data.error).toBeUndefined();
      expect(parsed.data.attempt).toBeUndefined();
    });
  });

  // ============================================================
  // safetyGate
  // ============================================================

  describe('safetyGate', () => {
    it('logs safety gate result', () => {
      aemcLog.safetyGate('B', 3, 'case-123');
      expect(infoSpy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.module).toBe('safety-gate');
      expect(parsed.message).toContain('case-123');
      expect(parsed.message).toContain('Gate B');
      expect(parsed.data.gateClass).toBe('B');
      expect(parsed.data.triggeredRules).toBe(3);
      expect(parsed.data.caseId).toBe('case-123');
    });
  });

  // ============================================================
  // pipeline
  // ============================================================

  describe('pipeline', () => {
    it('logs successful pipeline', () => {
      aemcLog.pipeline('case-456', 'v4.0', {
        totalLatencyMs: 8000,
        gateClass: 'A',
        riskLevel: 'low',
        aiCallCount: 4,
        success: true,
      });
      expect(infoSpy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.level).toBe('info');
      expect(parsed.module).toBe('pipeline');
      expect(parsed.message).toContain('case-456');
      expect(parsed.message).toContain('v4.0');
      expect(parsed.message).toContain('Gate A');
      expect(parsed.data.totalLatencyMs).toBe(8000);
      expect(parsed.data.aiCallCount).toBe(4);
    });

    it('logs failed pipeline to error', () => {
      aemcLog.pipeline('case-789', 'v4.0', {
        totalLatencyMs: 30000,
        gateClass: 'D',
        riskLevel: 'high',
        aiCallCount: 1,
        success: false,
        error: 'All AI models failed',
      });
      expect(errorSpy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
      expect(parsed.level).toBe('error');
      expect(parsed.message).toContain('failed');
      expect(parsed.message).toContain('All AI models failed');
      expect(parsed.data.error).toBe('All AI models failed');
    });

    it('omits error field when not provided', () => {
      aemcLog.pipeline('case-000', 'v4.0', {
        totalLatencyMs: 5000,
        gateClass: 'B',
        riskLevel: 'medium',
        aiCallCount: 3,
        success: true,
      });
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.data.error).toBeUndefined();
    });
  });
});
