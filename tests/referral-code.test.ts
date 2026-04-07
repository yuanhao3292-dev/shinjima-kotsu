import { describe, it, expect } from 'vitest';
import {
  generateReferralCode,
  generateRandomPassword,
} from '@/lib/utils/referral-code';

// ============================================================
// generateReferralCode
// ============================================================

describe('generateReferralCode', () => {
  it('returns 6-character string', () => {
    const code = generateReferralCode();
    expect(code).toHaveLength(6);
  });

  it('contains only uppercase letters and digits', () => {
    for (let i = 0; i < 20; i++) {
      const code = generateReferralCode();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    }
  });

  it('generates different codes (probabilistic)', () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateReferralCode()));
    // With 36^6 combinations, 50 codes should all be unique
    expect(codes.size).toBe(50);
  });
});

// ============================================================
// generateRandomPassword
// ============================================================

describe('generateRandomPassword', () => {
  it('returns 12-character string', () => {
    const password = generateRandomPassword();
    expect(password).toHaveLength(12);
  });

  it('contains at least one uppercase letter', () => {
    for (let i = 0; i < 20; i++) {
      const password = generateRandomPassword();
      expect(password).toMatch(/[A-Z]/);
    }
  });

  it('contains at least one lowercase letter', () => {
    for (let i = 0; i < 20; i++) {
      const password = generateRandomPassword();
      expect(password).toMatch(/[a-z]/);
    }
  });

  it('contains at least one digit', () => {
    for (let i = 0; i < 20; i++) {
      const password = generateRandomPassword();
      expect(password).toMatch(/[0-9]/);
    }
  });

  it('contains at least one special character', () => {
    for (let i = 0; i < 20; i++) {
      const password = generateRandomPassword();
      expect(password).toMatch(/[!@#$%^&*]/);
    }
  });

  it('generates different passwords', () => {
    const passwords = new Set(Array.from({ length: 20 }, () => generateRandomPassword()));
    expect(passwords.size).toBe(20);
  });
});
