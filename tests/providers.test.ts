import { describe, it, expect } from 'vitest';
import {
  PROVIDERS,
  VALID_PROVIDER_KEYS,
  isValidProvider,
} from '@/lib/config/providers';

describe('PROVIDERS', () => {
  it('has at least one provider', () => {
    expect(Object.keys(PROVIDERS).length).toBeGreaterThan(0);
  });

  it('all providers have required fields', () => {
    for (const [key, config] of Object.entries(PROVIDERS)) {
      expect(config.key).toBe(key);
      expect(config.name.ja).toBeTruthy();
      expect(config.name['zh-TW']).toBeTruthy();
      expect(config.name['zh-CN']).toBeTruthy();
      expect(config.name.en).toBeTruthy();
      expect(config.shortName.ja).toBeTruthy();
      expect(config.shortName['zh-TW']).toBeTruthy();
      expect(config.shortName['zh-CN']).toBeTruthy();
      expect(config.shortName.en).toBeTruthy();
    }
  });

  it('includes hyogo_medical provider', () => {
    expect(PROVIDERS.hyogo_medical).toBeDefined();
    expect(PROVIDERS.hyogo_medical.name.en).toContain('Hyogo');
  });
});

describe('VALID_PROVIDER_KEYS', () => {
  it('matches PROVIDERS keys', () => {
    expect(VALID_PROVIDER_KEYS).toEqual(Object.keys(PROVIDERS));
  });
});

describe('isValidProvider', () => {
  it('returns true for known provider', () => {
    expect(isValidProvider('hyogo_medical')).toBe(true);
  });

  it('returns false for unknown key', () => {
    expect(isValidProvider('unknown')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidProvider(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isValidProvider(undefined)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidProvider('')).toBe(false);
  });
});
