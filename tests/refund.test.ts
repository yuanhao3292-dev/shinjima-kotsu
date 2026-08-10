import { describe, it, expect, vi } from 'vitest';
import { clawbackCommission } from '@/lib/refund';

describe('clawbackCommission', () => {
  function createMockSupabase(opts: {
    existingStatus?: string | null;
    clawbackRpcError?: { message: string } | null;
  } = {}) {
    const mockSingle = vi.fn().mockResolvedValue({
      data: opts.existingStatus ? { commission_status: opts.existingStatus } : null,
      error: null,
    });
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({ single: mockSingle }),
      }),
    });

    // referral_rewards update chain
    const refUpdateEq = vi.fn().mockResolvedValue({ error: null });
    const refUpdate = vi.fn().mockReturnValue({ eq: refUpdateEq });

    // clawback_commission 原子 RPC 可配置成功/失败;其它 RPC 默认成功
    const mockRpc = vi.fn((fn: string) => {
      if (fn === 'clawback_commission') {
        return Promise.resolve(
          opts.clawbackRpcError
            ? { data: null, error: opts.clawbackRpcError }
            : { data: { result: 'clawed_back' }, error: null },
        );
      }
      return Promise.resolve({ data: null, error: null });
    });

    const supabase = {
      from: vi.fn((table: string) => {
        if (table === 'referral_rewards') {
          return { update: refUpdate };
        }
        return { select: mockSelect, update: mockUpdate };
      }),
      rpc: mockRpc,
    };

    return { supabase: supabase as any, mockRpc, mockSingle };
  }

  it('优先调用原子 RPC clawback_commission，成功即不走回退', async () => {
    const { supabase, mockRpc } = createMockSupabase();
    await clawbackCommission(supabase, 'order-123', 'guide-456', 5000);

    expect(mockRpc).toHaveBeenCalledWith('clawback_commission', {
      p_order_id: 'order-123',
      p_guide_id: 'guide-456',
    });
    // RPC 成功后不应再走旧逻辑的 increment_guide_commission
    expect(mockRpc).not.toHaveBeenCalledWith('increment_guide_commission', expect.anything());
  });

  it('RPC 不可用时回退旧逻辑：递减累计佣金', async () => {
    const { supabase, mockRpc } = createMockSupabase({
      existingStatus: 'available',
      clawbackRpcError: { message: 'function clawback_commission does not exist' },
    });
    await clawbackCommission(supabase, 'order-123', 'guide-456', 5000);

    expect(mockRpc).toHaveBeenCalledWith('increment_guide_commission', {
      p_guide_id: 'guide-456',
      p_amount: -5000,
    });
  });

  it('回退路径下已撤回则幂等跳过', async () => {
    const { supabase, mockRpc } = createMockSupabase({
      existingStatus: 'clawed_back',
      clawbackRpcError: { message: 'function clawback_commission does not exist' },
    });
    await clawbackCommission(supabase, 'order-123', 'guide-456', 5000);

    // 已 clawed_back，回退逻辑应在 increment 之前 return
    expect(mockRpc).not.toHaveBeenCalledWith('increment_guide_commission', expect.anything());
  });

  it('回退路径出错也不抛异常', async () => {
    const { supabase } = createMockSupabase({
      existingStatus: 'available',
      clawbackRpcError: { message: 'boom' },
    });
    await clawbackCommission(supabase, 'order-123', 'guide-456', 5000);
  });
});
