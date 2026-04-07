import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Use vi.hoisted to ensure mockSend is available when vi.mock factory runs
const { mockSend } = vi.hoisted(() => {
  // Set env vars before any module loads (vi.hoisted runs before vi.mock factories)
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.NOTIFICATION_EMAIL = 'admin@test.com';
  process.env.ADMIN_EMAIL = 'admin@test.com';
  return {
    mockSend: vi.fn().mockResolvedValue({ id: 'test-email-id' }),
  };
});

vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = { send: mockSend };
    },
  };
});

import {
  sendOrderConfirmationEmail,
  sendNewOrderNotificationToMerchant,
  sendWhitelabelSubscriptionEmail,
  sendGuideCommissionNotification,
  sendKYCNotification,
  sendGuideBookingNotificationToAdmin,
  sendGuideRegistrationEmail,
  sendScreeningErrorNotification,
  sendRefundNotificationEmail,
} from '@/lib/email';

describe('email module', () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockResolvedValue({ id: 'test-email-id' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================
  // 1. sendOrderConfirmationEmail
  // ============================================================

  describe('sendOrderConfirmationEmail', () => {
    const baseData = {
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      packageName: 'Basic Package',
      packagePrice: 150000,
      orderId: 'order-12345678',
    };

    it('sends email successfully (TIMC)', async () => {
      const result = await sendOrderConfirmationEmail(baseData);
      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledOnce();
      const call = mockSend.mock.calls[0][0];
      expect(call.to).toBe('test@example.com');
      expect(call.subject).toBeTruthy();
      expect(call.html).toContain('TOKUSHUKAI');
    });

    it('sends email with provider (generic)', async () => {
      const result = await sendOrderConfirmationEmail({
        ...baseData,
        provider: 'hyogo_medical',
      });
      expect(result.success).toBe(true);
      const call = mockSend.mock.calls[0][0];
      expect(call.html).toContain('NIIJIMA MEDICAL');
    });

    it('includes preferred date and time', async () => {
      const result = await sendOrderConfirmationEmail({
        ...baseData,
        preferredDate: '2025-06-15',
        preferredTime: '10:00',
      });
      expect(result.success).toBe(true);
    });

    it('includes notes', async () => {
      const result = await sendOrderConfirmationEmail({
        ...baseData,
        notes: 'Special request',
      });
      expect(result.success).toBe(true);
    });

    it('supports different locales', async () => {
      for (const locale of ['ja', 'en', 'zh-TW', 'zh-CN'] as const) {
        mockSend.mockClear();
        const result = await sendOrderConfirmationEmail({
          ...baseData,
          locale,
        });
        expect(result.success).toBe(true);
      }
    });

    it('handles send failure', async () => {
      mockSend.mockRejectedValueOnce(new Error('Send failed'));
      const result = await sendOrderConfirmationEmail(baseData);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Send failed');
    });
  });

  // ============================================================
  // 2. sendNewOrderNotificationToMerchant
  // ============================================================

  describe('sendNewOrderNotificationToMerchant', () => {
    it('sends merchant notification', async () => {
      await sendNewOrderNotificationToMerchant({
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        packageName: 'Premium',
        packagePrice: 300000,
        orderId: 'order-87654321',
      });
      expect(mockSend).toHaveBeenCalledOnce();
      const call = mockSend.mock.calls[0][0];
      expect(call.to).toBe('admin@test.com');
      expect(call.subject).toContain('新訂單');
    });
  });

  // ============================================================
  // 3. sendWhitelabelSubscriptionEmail
  // ============================================================

  describe('sendWhitelabelSubscriptionEmail', () => {
    const baseData = {
      guideEmail: 'guide@example.com',
      guideName: 'Guide Test',
      subscriptionPlan: 'Professional',
      monthlyPrice: 0,
    };

    it('sends subscription email', async () => {
      const result = await sendWhitelabelSubscriptionEmail(baseData);
      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledOnce();
      const call = mockSend.mock.calls[0][0];
      expect(call.to).toBe('guide@example.com');
    });

    it('includes whitelabel URL when provided', async () => {
      const result = await sendWhitelabelSubscriptionEmail({
        ...baseData,
        whitelabelUrl: 'https://test.bespoketrip.jp',
      });
      expect(result.success).toBe(true);
    });

    it('supports all locales', async () => {
      for (const locale of ['ja', 'en', 'zh-TW', 'zh-CN'] as const) {
        mockSend.mockClear();
        const result = await sendWhitelabelSubscriptionEmail({ ...baseData, locale });
        expect(result.success).toBe(true);
      }
    });

    it('handles send failure', async () => {
      mockSend.mockRejectedValueOnce(new Error('Network error'));
      const result = await sendWhitelabelSubscriptionEmail(baseData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // 4. sendGuideCommissionNotification
  // ============================================================

  describe('sendGuideCommissionNotification', () => {
    const baseData = {
      guideEmail: 'guide@example.com',
      guideName: 'Guide Test',
      orderType: 'timc_medical',
      orderAmount: 200000,
      commissionAmount: 20000,
      commissionRate: 10,
      isNewCustomerBonus: false,
      orderId: 'order-comm-12345678',
    };

    it('sends commission notification', async () => {
      const result = await sendGuideCommissionNotification(baseData);
      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledOnce();
    });

    it('includes new customer bonus', async () => {
      const result = await sendGuideCommissionNotification({
        ...baseData,
        isNewCustomerBonus: true,
        bonusAmount: 5000,
      });
      expect(result.success).toBe(true);
    });

    it('includes withholding tax', async () => {
      const result = await sendGuideCommissionNotification({
        ...baseData,
        withholdingAmount: 2042,
        locale: 'ja',
      });
      expect(result.success).toBe(true);
    });

    it('supports all locales', async () => {
      for (const locale of ['ja', 'en', 'zh-TW', 'zh-CN'] as const) {
        mockSend.mockClear();
        const result = await sendGuideCommissionNotification({ ...baseData, locale });
        expect(result.success).toBe(true);
      }
    });

    it('handles send failure', async () => {
      mockSend.mockRejectedValueOnce(new Error('Failed'));
      const result = await sendGuideCommissionNotification(baseData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // 5. sendKYCNotification
  // ============================================================

  describe('sendKYCNotification', () => {
    it('sends approved notification', async () => {
      const result = await sendKYCNotification({
        guideEmail: 'guide@example.com',
        guideName: 'Guide Name',
        status: 'approved',
      });
      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledOnce();
    });

    it('sends rejected notification', async () => {
      const result = await sendKYCNotification({
        guideEmail: 'guide@example.com',
        guideName: 'Guide Name',
        status: 'rejected',
        reviewNote: 'ID document unclear',
      });
      expect(result.success).toBe(true);
    });

    it('includes review note', async () => {
      const result = await sendKYCNotification({
        guideEmail: 'guide@example.com',
        guideName: 'Guide Name',
        status: 'rejected',
        reviewNote: 'Please resubmit',
        locale: 'en',
      });
      expect(result.success).toBe(true);
    });

    it('handles send failure', async () => {
      mockSend.mockRejectedValueOnce(new Error('Failed'));
      const result = await sendKYCNotification({
        guideEmail: 'guide@example.com',
        guideName: 'Guide',
        status: 'approved',
      });
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // 6. sendGuideBookingNotificationToAdmin
  // ============================================================

  describe('sendGuideBookingNotificationToAdmin', () => {
    const baseData = {
      guideName: 'Guide Name',
      venueName: 'Restaurant ABC',
      customerName: 'Customer',
      partySize: 4,
      bookingDate: '2025-07-01',
    };

    it('sends booking notification', async () => {
      const result = await sendGuideBookingNotificationToAdmin(baseData);
      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledOnce();
    });

    it('includes optional fields', async () => {
      const result = await sendGuideBookingNotificationToAdmin({
        ...baseData,
        customerPhone: '090-1234-5678',
        bookingTime: '18:00',
        specialRequests: 'Vegetarian menu',
      });
      expect(result.success).toBe(true);
    });

    it('handles send failure', async () => {
      mockSend.mockRejectedValueOnce(new Error('Failed'));
      const result = await sendGuideBookingNotificationToAdmin(baseData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // 7. sendGuideRegistrationEmail
  // ============================================================

  describe('sendGuideRegistrationEmail', () => {
    const baseData = {
      guideEmail: 'newguide@example.com',
      guideName: 'New Guide',
      referralCode: 'ABC123',
    };

    it('sends registration email', async () => {
      const result = await sendGuideRegistrationEmail(baseData);
      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledOnce();
    });

    it('supports all locales', async () => {
      for (const locale of ['ja', 'en', 'zh-TW', 'zh-CN'] as const) {
        mockSend.mockClear();
        const result = await sendGuideRegistrationEmail({ ...baseData, locale });
        expect(result.success).toBe(true);
      }
    });

    it('handles send failure', async () => {
      mockSend.mockRejectedValueOnce(new Error('Failed'));
      const result = await sendGuideRegistrationEmail(baseData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // 8. sendScreeningErrorNotification
  // ============================================================

  describe('sendScreeningErrorNotification', () => {
    const baseData = {
      errorMessage: 'All AI models failed',
      screeningId: 'screen-12345678',
      userType: 'authenticated' as const,
      endpoint: '/api/v1/medical-triage',
      timestamp: '2025-06-01T12:00:00Z',
    };

    it('sends error notification', async () => {
      const result = await sendScreeningErrorNotification(baseData);
      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledOnce();
      const call = mockSend.mock.calls[0][0];
      expect(call.subject).toContain('AEMC ERROR');
    });

    it('includes optional userId and sessionId', async () => {
      const result = await sendScreeningErrorNotification({
        ...baseData,
        userId: 'user-123',
        sessionId: 'sess-456',
        failedAiRuns: 2,
        userType: 'whitelabel',
      });
      expect(result.success).toBe(true);
    });

    it('handles send failure', async () => {
      mockSend.mockRejectedValueOnce(new Error('Failed'));
      const result = await sendScreeningErrorNotification(baseData);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // 9. sendRefundNotificationEmail
  // ============================================================

  describe('sendRefundNotificationEmail', () => {
    const baseData = {
      customerEmail: 'customer@example.com',
      customerName: 'Customer Name',
      packageName: 'Premium Package',
      refundAmount: 50000,
      orderId: 'order-refund-12345678',
    };

    it('sends refund notification', async () => {
      const result = await sendRefundNotificationEmail(baseData);
      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledOnce();
      const call = mockSend.mock.calls[0][0];
      expect(call.to).toBe('customer@example.com');
    });

    it('includes optional fields', async () => {
      const result = await sendRefundNotificationEmail({
        ...baseData,
        reason: 'Customer requested',
        stripeRefundId: 're_1234567890',
      });
      expect(result.success).toBe(true);
    });

    it('supports all locales', async () => {
      for (const locale of ['ja', 'en', 'zh-TW', 'zh-CN'] as const) {
        mockSend.mockClear();
        const result = await sendRefundNotificationEmail({ ...baseData, locale });
        expect(result.success).toBe(true);
      }
    });

    it('handles send failure', async () => {
      mockSend.mockRejectedValueOnce(new Error('Failed'));
      const result = await sendRefundNotificationEmail(baseData);
      expect(result.success).toBe(false);
    });
  });
});
