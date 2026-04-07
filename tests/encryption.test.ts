import { describe, it, expect } from 'vitest';
import {
  encryptPII,
  decryptPII,
  decryptPIISafe,
  isEncrypted,
  maskPII,
  maskEmail,
  maskPhone,
  maskIdNumber,
  maskCustomerPII,
  encryptCustomerPII,
  decryptCustomerPII,
  encryptFields,
  decryptFields,
  validateEncryptionKey,
  EncryptionError,
} from '@/lib/utils/encryption';

// ============================================================
// maskPII
// ============================================================

describe('maskPII', () => {
  it('returns empty string for empty input', () => {
    expect(maskPII('')).toBe('');
  });

  it('masks entire short string', () => {
    expect(maskPII('AB', 4)).toBe('**');
    expect(maskPII('ABCD', 4)).toBe('****');
  });

  it('shows first and last chars for longer string', () => {
    const result = maskPII('Hello World', 4);
    expect(result).toMatch(/^He/);
    expect(result).toMatch(/ld$/);
    expect(result).toContain('*');
  });

  it('limits masked chars to 6 asterisks max', () => {
    const result = maskPII('A very long string for testing masking', 4);
    const asterisks = result.match(/\*/g) || [];
    expect(asterisks.length).toBeLessThanOrEqual(6);
  });
});

// ============================================================
// maskEmail
// ============================================================

describe('maskEmail', () => {
  it('masks email preserving first char and domain', () => {
    expect(maskEmail('zhang@example.com')).toBe('z***@example.com');
  });

  it('handles single char local part', () => {
    expect(maskEmail('a@test.com')).toBe('a***@test.com');
  });

  it('falls back to maskPII for invalid email', () => {
    const result = maskEmail('notanemail');
    expect(result).toContain('*');
  });

  it('returns empty string for empty input', () => {
    expect(maskEmail('')).toBe('');
  });
});

// ============================================================
// maskPhone
// ============================================================

describe('maskPhone', () => {
  it('masks phone showing first 3 and last 4', () => {
    expect(maskPhone('13800138000')).toBe('138****8000');
  });

  it('handles short phone number', () => {
    const result = maskPhone('12345');
    expect(result).toContain('*');
  });

  it('strips non-digit characters before masking', () => {
    expect(maskPhone('+81-90-1234-5678')).toBe('819****5678');
  });

  it('returns empty string for empty input', () => {
    expect(maskPhone('')).toBe('');
  });
});

// ============================================================
// maskIdNumber
// ============================================================

describe('maskIdNumber', () => {
  it('masks ID showing first 6 and last 4', () => {
    expect(maskIdNumber('310101199001011234')).toBe('310101********1234');
  });

  it('handles short ID', () => {
    const result = maskIdNumber('12345');
    expect(result).toContain('*');
  });

  it('returns empty string for empty input', () => {
    expect(maskIdNumber('')).toBe('');
  });
});

// ============================================================
// maskCustomerPII
// ============================================================

describe('maskCustomerPII', () => {
  it('masks all provided fields', () => {
    const result = maskCustomerPII({
      name: 'Zhang San',
      email: 'zhang@test.com',
      phone: '13800138000',
      wechat: 'zhangsan_wx',
      idNumber: '310101199001011234',
      address: 'Tokyo Shibuya 1-2-3 Building A',
    });

    expect(result.name).toContain('*');
    expect(result.email).toContain('***@');
    expect(result.phone).toContain('****');
    expect(result.idNumber).toContain('********');
    expect(result.wechat).toContain('*');
    expect(result.address).toContain('*');
  });

  it('returns undefined for missing fields', () => {
    const result = maskCustomerPII({});
    expect(result.name).toBeUndefined();
    expect(result.email).toBeUndefined();
    expect(result.phone).toBeUndefined();
  });
});

// ============================================================
// encryptPII / decryptPII roundtrip
// ============================================================

describe('encryptPII + decryptPII', () => {
  it('returns empty string for empty input', () => {
    expect(encryptPII('')).toBe('');
    expect(decryptPII('')).toBe('');
  });

  it('encrypts and decrypts back to original', () => {
    const original = 'Hello, World! 你好世界';
    const encrypted = encryptPII(original);
    expect(encrypted).not.toBe(original);
    const decrypted = decryptPII(encrypted);
    expect(decrypted).toBe(original);
  });

  it('produces different ciphertext for same plaintext (random IV)', () => {
    const a = encryptPII('test');
    const b = encryptPII('test');
    expect(a).not.toBe(b);
  });

  it('encrypted output has 3 colon-separated parts', () => {
    const encrypted = encryptPII('data');
    const parts = encrypted.split(':');
    expect(parts).toHaveLength(3);
  });

  it('handles unicode characters', () => {
    const original = '日本語テスト 🎌';
    const encrypted = encryptPII(original);
    expect(decryptPII(encrypted)).toBe(original);
  });

  it('handles long strings', () => {
    const original = 'A'.repeat(10000);
    const encrypted = encryptPII(original);
    expect(decryptPII(encrypted)).toBe(original);
  });
});

// ============================================================
// decryptPII — backward compatibility
// ============================================================

describe('decryptPII backward compatibility', () => {
  it('returns unencrypted data as-is (legacy format)', () => {
    const plaintext = 'plain text without colons';
    expect(decryptPII(plaintext)).toBe(plaintext);
  });

  it('returns data with single colon as-is', () => {
    expect(decryptPII('foo:bar')).toBe('foo:bar');
  });
});

// ============================================================
// decryptPIISafe
// ============================================================

describe('decryptPIISafe', () => {
  it('returns null for empty input', () => {
    expect(decryptPIISafe('')).toBeNull();
  });

  it('decrypts valid encrypted data', () => {
    const encrypted = encryptPII('secret');
    expect(decryptPIISafe(encrypted)).toBe('secret');
  });

  it('returns original on failure when fallbackToOriginal=true', () => {
    // Create a 3-part string that looks encrypted but has invalid content
    const fake = 'AAAAAAAAAAAAAAAAAAAAAA==:AAAAAAAAAAAAAAAAAAAAAA==:invalidciphertext';
    const result = decryptPIISafe(fake, true);
    expect(result).toBe(fake);
  });

  it('returns null on failure when fallbackToOriginal=false', () => {
    const fake = 'AAAAAAAAAAAAAAAAAAAAAA==:AAAAAAAAAAAAAAAAAAAAAA==:invalidciphertext';
    const result = decryptPIISafe(fake, false);
    expect(result).toBeNull();
  });
});

// ============================================================
// isEncrypted
// ============================================================

describe('isEncrypted', () => {
  it('returns false for empty string', () => {
    expect(isEncrypted('')).toBe(false);
  });

  it('returns false for plain text', () => {
    expect(isEncrypted('Hello World')).toBe(false);
  });

  it('returns false for text with wrong number of colons', () => {
    expect(isEncrypted('a:b')).toBe(false);
    expect(isEncrypted('a:b:c:d')).toBe(false);
  });

  it('returns true for properly encrypted data', () => {
    const encrypted = encryptPII('test data');
    expect(isEncrypted(encrypted)).toBe(true);
  });

  it('returns false for 3-part string with wrong lengths', () => {
    // IV and authTag base64 should decode to specific lengths
    expect(isEncrypted('short:short:data')).toBe(false);
  });
});

// ============================================================
// encryptCustomerPII / decryptCustomerPII
// ============================================================

describe('encryptCustomerPII + decryptCustomerPII', () => {
  it('roundtrips all customer fields', () => {
    const pii = {
      name: '张三',
      email: 'zhang@example.com',
      phone: '13800138000',
      wechat: 'zhang_wx',
      idNumber: '310101199001011234',
      address: 'Tokyo Shibuya 1-2-3',
    };

    const encrypted = encryptCustomerPII(pii);
    expect(encrypted.customer_name).toBe('张三'); // name kept in plaintext
    expect(encrypted.customer_name_encrypted).toBeDefined();
    expect(encrypted.customer_email_encrypted).toBeDefined();
    expect(encrypted.customer_phone_encrypted).toBeDefined();
    expect(encrypted.customer_wechat_encrypted).toBeDefined();
    expect(encrypted.customer_id_number_encrypted).toBeDefined();
    expect(encrypted.customer_address_encrypted).toBeDefined();

    const decrypted = decryptCustomerPII(encrypted);
    expect(decrypted.name).toBe('张三');
    expect(decrypted.email).toBe('zhang@example.com');
    expect(decrypted.phone).toBe('13800138000');
    expect(decrypted.wechat).toBe('zhang_wx');
    expect(decrypted.idNumber).toBe('310101199001011234');
    expect(decrypted.address).toBe('Tokyo Shibuya 1-2-3');
  });

  it('handles partial PII', () => {
    const encrypted = encryptCustomerPII({ name: 'Alice' });
    expect(encrypted.customer_name).toBe('Alice');
    expect(encrypted.customer_email_encrypted).toBeUndefined();

    const decrypted = decryptCustomerPII(encrypted);
    expect(decrypted.name).toBe('Alice');
    expect(decrypted.email).toBeUndefined();
  });

  it('decrypts with plaintext name fallback', () => {
    // Simulate old data with only customer_name (no encrypted version)
    const oldData = { customer_name: 'Legacy Name' };
    const decrypted = decryptCustomerPII(oldData);
    expect(decrypted.name).toBe('Legacy Name');
  });
});

// ============================================================
// encryptFields / decryptFields
// ============================================================

describe('encryptFields + decryptFields', () => {
  it('adds _encrypted suffix to specified fields', () => {
    const data = { name: 'Test', email: 'test@test.com', age: 30 };
    const result = encryptFields(data, ['name', 'email']);
    expect(result.name_encrypted).toBeDefined();
    expect(result.email_encrypted).toBeDefined();
    expect(result.name).toBe('Test'); // original preserved
    expect(result.age).toBe(30);
  });

  it('decryptFields reverses encryptFields', () => {
    const data = { name: 'Secret', phone: '1234567890', count: 5 };
    const encrypted = encryptFields(data, ['name', 'phone']);
    const decrypted = decryptFields(encrypted, ['name_encrypted', 'phone_encrypted']);
    expect(decrypted.name).toBe('Secret');
    expect(decrypted.phone).toBe('1234567890');
  });

  it('skips non-string fields', () => {
    const data = { count: 42, flag: true };
    const result = encryptFields(data, ['count', 'flag'] as never[]);
    // Non-string values should not get _encrypted fields
    expect(result).not.toHaveProperty('count_encrypted');
  });
});

// ============================================================
// validateEncryptionKey
// ============================================================

describe('validateEncryptionKey', () => {
  it('returns valid for development mode without key', () => {
    // In test environment (non-production), no key is fine
    const result = validateEncryptionKey();
    if (!process.env.ENCRYPTION_KEY) {
      expect(result.valid).toBe(true);
      expect(result.message).toContain('development');
    }
  });
});

// ============================================================
// EncryptionError
// ============================================================

describe('EncryptionError', () => {
  it('has correct name and code', () => {
    const err = new EncryptionError('test', 'MISSING_KEY');
    expect(err.name).toBe('EncryptionError');
    expect(err.code).toBe('MISSING_KEY');
    expect(err.message).toBe('test');
    expect(err instanceof Error).toBe(true);
  });
});
