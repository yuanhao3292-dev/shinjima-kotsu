import { describe, it, expect } from 'vitest';
import {
  t,
  common,
  orderConfirmation,
  orderConfirmationGeneric,
  whitelabelSubscription,
  guideCommission,
  kycNotification,
  guideRegistration,
  refundNotification,
  healthCheckupReminder,
} from '@/lib/email-i18n';
import type { EmailLocale } from '@/lib/email-i18n';

// ============================================================
// t() translation function
// ============================================================

describe('t() translation function', () => {
  const map = {
    ja: 'Japanese',
    'zh-CN': 'Simplified Chinese',
    'zh-TW': 'Traditional Chinese',
    en: 'English',
  } as Record<EmailLocale, string>;

  it('returns correct translation for each locale', () => {
    expect(t(map, 'ja')).toBe('Japanese');
    expect(t(map, 'zh-CN')).toBe('Simplified Chinese');
    expect(t(map, 'zh-TW')).toBe('Traditional Chinese');
    expect(t(map, 'en')).toBe('English');
  });

  it('falls back to ja for unknown locale', () => {
    // @ts-expect-error testing unknown locale fallback
    expect(t(map, 'ko')).toBe('Japanese');
  });
});

// ============================================================
// Translation structure validation
// ============================================================

const ALL_LOCALES: EmailLocale[] = ['ja', 'zh-CN', 'zh-TW', 'en'];

function validateTranslationObject(name: string, obj: Record<string, unknown>) {
  describe(`${name} translations`, () => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && 'ja' in value) {
        it(`${key} has all 4 locales`, () => {
          const record = value as Record<string, string>;
          ALL_LOCALES.forEach(locale => {
            expect(record[locale], `Missing ${locale} for ${name}.${key}`).toBeDefined();
            expect(typeof record[locale]).toBe('string');
            expect(record[locale].length).toBeGreaterThan(0);
          });
        });
      }
    }
  });
}

// Validate all exported translation objects
validateTranslationObject('common', common);
validateTranslationObject('orderConfirmation', orderConfirmation);
validateTranslationObject('orderConfirmationGeneric', orderConfirmationGeneric);
validateTranslationObject('whitelabelSubscription', whitelabelSubscription);
validateTranslationObject('guideCommission', guideCommission);
validateTranslationObject('kycNotification', kycNotification);
validateTranslationObject('guideRegistration', guideRegistration);
validateTranslationObject('refundNotification', refundNotification);
validateTranslationObject('healthCheckupReminder', healthCheckupReminder);

// ============================================================
// Specific content assertions
// ============================================================

describe('email-i18n content checks', () => {
  it('common.footerCompany has correct company name', () => {
    expect(t(common.footerCompany, 'ja')).toContain('新島交通');
    expect(t(common.footerCompany, 'en')).toContain('Niijima Kotsu');
  });

  it('orderConfirmation.subject contains orderId placeholder', () => {
    ALL_LOCALES.forEach(locale => {
      expect(t(orderConfirmation.subject, locale)).toContain('{{orderId}}');
    });
  });

  it('whitelabelSubscription.greeting contains name placeholder', () => {
    ALL_LOCALES.forEach(locale => {
      expect(t(whitelabelSubscription.greeting, locale)).toContain('{{name}}');
    });
  });

  it('guideCommission.subject contains amount placeholder', () => {
    ALL_LOCALES.forEach(locale => {
      expect(t(guideCommission.subject, locale)).toContain('{{amount}}');
    });
  });

  it('guideRegistration.step2 contains code placeholder', () => {
    ALL_LOCALES.forEach(locale => {
      expect(t(guideRegistration.step2, locale)).toContain('{{code}}');
    });
  });

  it('healthCheckupReminder.subject contains months placeholder', () => {
    ALL_LOCALES.forEach(locale => {
      expect(t(healthCheckupReminder.subject, locale)).toContain('{{months}}');
    });
  });

  it('guideCommission.orderTypes covers medical, golf, business', () => {
    for (const type of ['medical', 'golf', 'business']) {
      const record = guideCommission.orderTypes[type];
      expect(record).toBeDefined();
      ALL_LOCALES.forEach(locale => {
        expect(record[locale]).toBeDefined();
      });
    }
  });
});
