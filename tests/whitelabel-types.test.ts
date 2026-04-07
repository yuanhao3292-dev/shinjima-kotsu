import { describe, it, expect } from 'vitest';
import { DEFAULT_OFFICIAL_BRANDING } from '@/lib/types/whitelabel';

describe('DEFAULT_OFFICIAL_BRANDING', () => {
  it('has name', () => {
    expect(DEFAULT_OFFICIAL_BRANDING.name).toBe('NIIJIMA');
  });

  it('has subName in Japanese', () => {
    expect(DEFAULT_OFFICIAL_BRANDING.subName).toContain('新島');
  });

  it('has valid hex color', () => {
    expect(DEFAULT_OFFICIAL_BRANDING.color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('has null logoUrl', () => {
    expect(DEFAULT_OFFICIAL_BRANDING.logoUrl).toBeNull();
  });
});
