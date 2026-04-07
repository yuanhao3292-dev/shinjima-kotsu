import { describe, it, expect } from 'vitest';
import {
  sanitizeSearchInput,
  PaginationSchema,
  UUIDSchema,
  DateSchema,
  TimeSchema,
  PhoneSchema,
  CustomerInfoSchema,
  CreateCheckoutSessionSchema,
  WithdrawalRequestSchema,
  KYCSubmitSchema,
  KYCReviewSchema,
  WithdrawalActionSchema,
  GuideActionSchema,
  BookingAvailabilityCheckSchema,
  HealthScreeningAnalyzeSchema,
  WhitelabelSettingsSchema,
  CalculateQuoteSchema,
  BookingActionSchema,
  AdminImageUploadSchema,
  AuditLogCreateSchema,
} from '@/lib/validations/api-schemas';

// ============================================================
// sanitizeSearchInput
// ============================================================

describe('sanitizeSearchInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeSearchInput('')).toBe('');
  });

  it('removes SQL injection characters', () => {
    expect(sanitizeSearchInput("'; DROP TABLE users;--")).toBe('DROP TABLE users--');
  });

  it('removes percentage and underscore wildcards', () => {
    expect(sanitizeSearchInput('%admin%')).toBe('admin');
    expect(sanitizeSearchInput('_test_')).toBe('test');
  });

  it('normalizes whitespace', () => {
    expect(sanitizeSearchInput('  hello   world  ')).toBe('hello world');
  });

  it('truncates to 100 characters', () => {
    const long = 'a'.repeat(200);
    expect(sanitizeSearchInput(long).length).toBe(100);
  });

  it('preserves safe characters', () => {
    expect(sanitizeSearchInput('日本語テスト')).toBe('日本語テスト');
    expect(sanitizeSearchInput('hello world 123')).toBe('hello world 123');
  });

  it('removes angle brackets', () => {
    expect(sanitizeSearchInput('<script>alert(1)</script>')).toBe('scriptalert1/script');
  });
});

// ============================================================
// PaginationSchema
// ============================================================

describe('PaginationSchema', () => {
  it('accepts valid page and limit', () => {
    const result = PaginationSchema.parse({ page: 1, limit: 20 });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('applies defaults when missing', () => {
    const result = PaginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('coerces string numbers', () => {
    const result = PaginationSchema.parse({ page: '3', limit: '50' });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
  });

  it('rejects page < 1', () => {
    expect(() => PaginationSchema.parse({ page: 0 })).toThrow();
  });

  it('rejects limit > 100', () => {
    expect(() => PaginationSchema.parse({ limit: 101 })).toThrow();
  });
});

// ============================================================
// UUIDSchema
// ============================================================

describe('UUIDSchema', () => {
  it('accepts valid UUID', () => {
    expect(UUIDSchema.parse('550e8400-e29b-41d4-a716-446655440000')).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('rejects invalid UUID', () => {
    expect(() => UUIDSchema.parse('not-a-uuid')).toThrow();
  });

  it('rejects empty string', () => {
    expect(() => UUIDSchema.parse('')).toThrow();
  });
});

// ============================================================
// DateSchema
// ============================================================

describe('DateSchema', () => {
  it('accepts YYYY-MM-DD format', () => {
    expect(DateSchema.parse('2024-06-15')).toBe('2024-06-15');
  });

  it('rejects invalid format', () => {
    expect(() => DateSchema.parse('15-06-2024')).toThrow();
    expect(() => DateSchema.parse('2024/06/15')).toThrow();
    expect(() => DateSchema.parse('June 15')).toThrow();
  });
});

// ============================================================
// TimeSchema
// ============================================================

describe('TimeSchema', () => {
  it('accepts HH:MM format', () => {
    expect(TimeSchema.parse('09:30')).toBe('09:30');
  });

  it('rejects invalid format', () => {
    expect(() => TimeSchema.parse('9:30')).toThrow();
    expect(() => TimeSchema.parse('09:30:00')).toThrow();
  });

  it('accepts undefined (optional)', () => {
    expect(TimeSchema.parse(undefined)).toBeUndefined();
  });
});

// ============================================================
// PhoneSchema
// ============================================================

describe('PhoneSchema', () => {
  it('accepts valid phone number', () => {
    expect(PhoneSchema.parse('090-1234-5678')).toBe('090-1234-5678');
  });

  it('accepts empty string (allows blank)', () => {
    expect(PhoneSchema.parse('')).toBe('');
  });

  it('rejects too short phone (< 8 chars, non-empty)', () => {
    expect(() => PhoneSchema.parse('12345')).toThrow();
  });

  it('rejects too long phone (> 20 chars)', () => {
    expect(() => PhoneSchema.parse('1'.repeat(21))).toThrow();
  });
});

// ============================================================
// CustomerInfoSchema
// ============================================================

describe('CustomerInfoSchema', () => {
  const validCustomer = {
    name: 'Test User',
    email: 'test@example.com',
    country: 'TW',
  };

  it('accepts valid customer with email', () => {
    expect(() => CustomerInfoSchema.parse(validCustomer)).not.toThrow();
  });

  it('accepts customer with phone instead of email', () => {
    expect(() => CustomerInfoSchema.parse({
      name: 'User',
      phone: '09012345678',
    })).not.toThrow();
  });

  it('accepts customer with LINE instead of email/phone', () => {
    expect(() => CustomerInfoSchema.parse({
      name: 'User',
      line: 'my_line_id',
    })).not.toThrow();
  });

  it('rejects customer with no contact method', () => {
    expect(() => CustomerInfoSchema.parse({ name: 'User' })).toThrow();
  });

  it('rejects empty name', () => {
    expect(() => CustomerInfoSchema.parse({
      ...validCustomer,
      name: '',
    })).toThrow();
  });

  it('defaults country to TW', () => {
    const result = CustomerInfoSchema.parse(validCustomer);
    expect(result.country).toBe('TW');
  });
});

// ============================================================
// CreateCheckoutSessionSchema
// ============================================================

describe('CreateCheckoutSessionSchema', () => {
  const validSession = {
    packageSlug: 'basic-checkup',
    customerInfo: {
      name: 'Taro',
      email: 'taro@example.com',
    },
    consents: {
      cancel: true,
      tokushoho: true,
      privacy: true,
    },
  };

  it('accepts valid checkout session', () => {
    expect(() => CreateCheckoutSessionSchema.parse(validSession)).not.toThrow();
  });

  it('rejects missing consents', () => {
    expect(() => CreateCheckoutSessionSchema.parse({
      ...validSession,
      consents: { cancel: true, tokushoho: false, privacy: true },
    })).toThrow();
  });

  it('rejects empty packageSlug', () => {
    expect(() => CreateCheckoutSessionSchema.parse({
      ...validSession,
      packageSlug: '',
    })).toThrow();
  });

  it('defaults locale to ja', () => {
    const result = CreateCheckoutSessionSchema.parse(validSession);
    expect(result.locale).toBe('ja');
  });

  it('accepts valid guideSlug', () => {
    const result = CreateCheckoutSessionSchema.parse({
      ...validSession,
      guideSlug: 'my-guide-123',
    });
    expect(result.guideSlug).toBe('my-guide-123');
  });

  it('rejects invalid guideSlug format', () => {
    expect(() => CreateCheckoutSessionSchema.parse({
      ...validSession,
      guideSlug: 'INVALID',
    })).toThrow();
  });
});

// ============================================================
// WithdrawalRequestSchema
// ============================================================

describe('WithdrawalRequestSchema', () => {
  it('accepts valid amount', () => {
    expect(WithdrawalRequestSchema.parse({ amount: 10000 }).amount).toBe(10000);
  });

  it('rejects amount below minimum (5000)', () => {
    expect(() => WithdrawalRequestSchema.parse({ amount: 4999 })).toThrow();
  });

  it('rejects amount above maximum', () => {
    expect(() => WithdrawalRequestSchema.parse({ amount: 10000001 })).toThrow();
  });
});

// ============================================================
// KYCSubmitSchema
// ============================================================

describe('KYCSubmitSchema', () => {
  const validKYC = {
    guideId: '550e8400-e29b-41d4-a716-446655440000',
    documentType: 'passport' as const,
    documentNumber: 'AB123456',
    legalName: 'John Doe',
  };

  it('accepts valid KYC submission', () => {
    expect(() => KYCSubmitSchema.parse(validKYC)).not.toThrow();
  });

  it('accepts all document types', () => {
    for (const type of ['passport', 'id_card', 'residence_card', 'other'] as const) {
      expect(() => KYCSubmitSchema.parse({ ...validKYC, documentType: type })).not.toThrow();
    }
  });

  it('rejects invalid document type', () => {
    expect(() => KYCSubmitSchema.parse({ ...validKYC, documentType: 'invalid' })).toThrow();
  });

  it('rejects short document number', () => {
    expect(() => KYCSubmitSchema.parse({ ...validKYC, documentNumber: '1234' })).toThrow();
  });
});

// ============================================================
// KYCReviewSchema
// ============================================================

describe('KYCReviewSchema', () => {
  it('accepts approve action', () => {
    expect(() => KYCReviewSchema.parse({
      guideId: '550e8400-e29b-41d4-a716-446655440000',
      action: 'approve',
    })).not.toThrow();
  });

  it('accepts reject action', () => {
    expect(() => KYCReviewSchema.parse({
      guideId: '550e8400-e29b-41d4-a716-446655440000',
      action: 'reject',
      reviewNote: 'Document unclear',
    })).not.toThrow();
  });
});

// ============================================================
// WithdrawalActionSchema
// ============================================================

describe('WithdrawalActionSchema', () => {
  it('rejects complete without paymentReference', () => {
    expect(() => WithdrawalActionSchema.parse({
      withdrawalId: '550e8400-e29b-41d4-a716-446655440000',
      action: 'complete',
    })).toThrow();
  });

  it('accepts complete with paymentReference', () => {
    expect(() => WithdrawalActionSchema.parse({
      withdrawalId: '550e8400-e29b-41d4-a716-446655440000',
      action: 'complete',
      paymentReference: 'TXN-12345',
    })).not.toThrow();
  });
});

// ============================================================
// GuideActionSchema
// ============================================================

describe('GuideActionSchema', () => {
  it('rejects update_level without level', () => {
    expect(() => GuideActionSchema.parse({
      guideId: '550e8400-e29b-41d4-a716-446655440000',
      action: 'update_level',
    })).toThrow();
  });

  it('accepts update_level with valid level', () => {
    expect(() => GuideActionSchema.parse({
      guideId: '550e8400-e29b-41d4-a716-446655440000',
      action: 'update_level',
      level: 'gold',
    })).not.toThrow();
  });

  it('accepts approve without level', () => {
    expect(() => GuideActionSchema.parse({
      guideId: '550e8400-e29b-41d4-a716-446655440000',
      action: 'approve',
    })).not.toThrow();
  });
});

// ============================================================
// BookingAvailabilityCheckSchema
// ============================================================

describe('BookingAvailabilityCheckSchema', () => {
  it('requires either venueId or guideId', () => {
    expect(() => BookingAvailabilityCheckSchema.parse({
      date: '2024-06-15',
      time: '10:00',
    })).toThrow();
  });

  it('accepts with venueId', () => {
    expect(() => BookingAvailabilityCheckSchema.parse({
      venueId: '550e8400-e29b-41d4-a716-446655440000',
      date: '2024-06-15',
      time: '10:00',
    })).not.toThrow();
  });
});

// ============================================================
// HealthScreeningAnalyzeSchema
// ============================================================

describe('HealthScreeningAnalyzeSchema', () => {
  it('accepts valid screening analysis request', () => {
    const result = HealthScreeningAnalyzeSchema.parse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.phase).toBe(2); // default
  });

  it('accepts phase 1', () => {
    const result = HealthScreeningAnalyzeSchema.parse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      phase: 1,
    });
    expect(result.phase).toBe(1);
  });

  it('rejects invalid phase', () => {
    expect(() => HealthScreeningAnalyzeSchema.parse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      phase: 3,
    })).toThrow();
  });
});

// ============================================================
// WhitelabelSettingsSchema
// ============================================================

describe('WhitelabelSettingsSchema', () => {
  it('accepts valid settings', () => {
    expect(() => WhitelabelSettingsSchema.parse({
      slug: 'my-brand',
      brandName: 'My Brand',
      brandColor: '#FF0000',
    })).not.toThrow();
  });

  it('rejects invalid brandColor format', () => {
    expect(() => WhitelabelSettingsSchema.parse({
      brandColor: 'red',
    })).toThrow();
  });

  it('rejects slug with uppercase', () => {
    expect(() => WhitelabelSettingsSchema.parse({
      slug: 'My-Brand',
    })).toThrow();
  });

  it('rejects slug too short', () => {
    expect(() => WhitelabelSettingsSchema.parse({
      slug: 'ab',
    })).toThrow();
  });
});

// ============================================================
// CalculateQuoteSchema
// ============================================================

describe('CalculateQuoteSchema', () => {
  const validQuote = {
    pax: 10,
    travel_days: 5,
    hotel_req: { rooms: 5, stars: 4, nights: 4, location: 'Tokyo' },
    need_bus: true,
    bus_type: 'large_bus' as const,
    guide_language: 'zh' as const,
    agency_name: 'Test Agency',
  };

  it('accepts valid quote request', () => {
    expect(() => CalculateQuoteSchema.parse(validQuote)).not.toThrow();
  });

  it('rejects pax below 1', () => {
    expect(() => CalculateQuoteSchema.parse({ ...validQuote, pax: 0 })).toThrow();
  });

  it('rejects empty agency name', () => {
    expect(() => CalculateQuoteSchema.parse({ ...validQuote, agency_name: '' })).toThrow();
  });
});

// ============================================================
// BookingActionSchema
// ============================================================

describe('BookingActionSchema', () => {
  it('rejects complete without actualSpend', () => {
    expect(() => BookingActionSchema.parse({
      action: 'complete',
      bookingId: '550e8400-e29b-41d4-a716-446655440000',
    })).toThrow();
  });

  it('accepts complete with actualSpend', () => {
    expect(() => BookingActionSchema.parse({
      action: 'complete',
      bookingId: '550e8400-e29b-41d4-a716-446655440000',
      actualSpend: 50000,
    })).not.toThrow();
  });

  it('rejects cancel without cancelReason', () => {
    expect(() => BookingActionSchema.parse({
      action: 'cancel',
      bookingId: '550e8400-e29b-41d4-a716-446655440000',
    })).toThrow();
  });
});

// ============================================================
// AdminImageUploadSchema
// ============================================================

describe('AdminImageUploadSchema', () => {
  it('accepts valid image key', () => {
    expect(() => AdminImageUploadSchema.parse({
      imageKey: 'hero-banner',
    })).not.toThrow();
  });

  it('rejects empty image key', () => {
    expect(() => AdminImageUploadSchema.parse({
      imageKey: '',
    })).toThrow();
  });

  it('rejects image key with special chars', () => {
    expect(() => AdminImageUploadSchema.parse({
      imageKey: 'hero banner!',
    })).toThrow();
  });
});

// ============================================================
// AuditLogCreateSchema
// ============================================================

describe('AuditLogCreateSchema', () => {
  it('accepts valid audit log entry', () => {
    const result = AuditLogCreateSchema.parse({
      action: 'user_login',
      entityType: 'user',
      entityId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.severity).toBe('info'); // default
  });

  it('accepts severity override', () => {
    const result = AuditLogCreateSchema.parse({
      action: 'data_deletion',
      entityType: 'user',
      entityId: '550e8400-e29b-41d4-a716-446655440000',
      severity: 'critical',
    });
    expect(result.severity).toBe('critical');
  });
});
