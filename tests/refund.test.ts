import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clawbackCommission } from '@/lib/refund';

describe('clawbackCommission', () => {
  function createMockSupabase(opts: {
    existingStatus?: string | null;
    updateError?: any;
  } = {}) {
    const mockSingle = vi.fn().mockResolvedValue({
      data: opts.existingStatus ? { commission_status: opts.existingStatus } : null,
      error: null,
    });
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: opts.updateError || null,
        }),
      }),
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      }),
    });
    const mockRpc = vi.fn().mockResolvedValue({ data: null, error: null });

    // referral_rewards update chain
    const refUpdateEq = vi.fn().mockResolvedValue({ error: null });
    const refUpdate = vi.fn().mockReturnValue({ eq: refUpdateEq });

    const supabase = {
      from: vi.fn((table: string) => {
        if (table === 'referral_rewards') {
          return { update: refUpdate };
        }
        return {
          select: mockSelect,
          update: mockUpdate,
        };
      }),
      rpc: mockRpc,
    };

    return { supabase: supabase as any, mockRpc, mockSingle };
  }

  it('claws back commission successfully', async () => {
    const { supabase, mockRpc } = createMockSupabase({ existingStatus: 'paid' });
    await clawbackCommission(supabase, 'order-123', 'guide-456', 5000);
    expect(mockRpc).toHaveBeenCalledWith('increment_guide_commission', {
      p_guide_id: 'guide-456',
      p_amount: -5000,
    });
  });

  it('skips if already clawed back (idempotent)', async () => {
    const { supabase, mockRpc } = createMockSupabase({ existingStatus: 'clawed_back' });
    await clawbackCommission(supabase, 'order-123', 'guide-456', 5000);
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('handles update error gracefully', async () => {
    const { supabase } = createMockSupabase({
      existingStatus: 'paid',
      updateError: { message: 'DB error' },
    });
    // Should not throw
    await clawbackCommission(supabase, 'order-123', 'guide-456', 5000);
  });
});
