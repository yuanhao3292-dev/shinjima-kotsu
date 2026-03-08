import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';
import { createHmac } from 'crypto';

/**
 * 生成合同签约令牌（HMAC-based, 无需数据库额外字段）
 * 管理员发送签约链接时使用: /contract/sign/{id}?token={generateSigningToken(id)}
 */
export function generateSigningToken(contractId: string): string {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) throw new Error('ENCRYPTION_KEY not configured');
  return createHmac('sha256', secret).update(contractId).digest('hex').substring(0, 32);
}

/** 验证签约令牌 */
function verifySigningToken(contractId: string, token: string): boolean {
  try {
    return generateSigningToken(contractId) === token;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 限速
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/contract/customer`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
    }

    const body = await request.json();
    const { contractId, customerData, signature, token } = body;

    // 验证必填字段
    if (!contractId || !customerData || !signature) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 验证签约令牌
    if (!token || !verifySigningToken(contractId, token)) {
      return NextResponse.json(
        { error: '无效的签约链接' },
        { status: 403 }
      );
    }

    // 使用 service role 绕过 RLS（客户签约无需登录）
    const supabase = getSupabaseAdmin();

    // 获取现有合同（只查必要字段）
    const { data: contract, error: fetchError } = await supabase
      .from('customer_service_contracts')
      .select('id, status')
      .eq('id', contractId)
      .single();

    if (fetchError || !contract) {
      return NextResponse.json(
        { error: '合同不存在' },
        { status: 404 }
      );
    }

    // 检查合同是否已签署
    if (contract.status === 'signed' || contract.status === 'active') {
      return NextResponse.json(
        { error: '合同已签署，无法重复签署' },
        { status: 400 }
      );
    }

    // 更新合同信息
    const { data: updatedContract, error: updateError } = await supabase
      .from('customer_service_contracts')
      .update({
        customer_name: customerData.customerName,
        passport_number: customerData.passportNumber,
        nationality: customerData.nationality,
        phone: customerData.phone,
        email: customerData.email,
        emergency_contact: customerData.emergencyContact,
        emergency_phone: customerData.emergencyPhone,
        customer_signature_data: signature,
        signed_by_customer_at: new Date().toISOString(),
        status: 'signed',
      })
      .eq('id', contractId)
      .select()
      .single();

    if (updateError) {
      console.error('Update contract error:', updateError);
      return NextResponse.json(
        { error: '更新合同失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      message: '合同签署成功',
    });
  } catch (error) {
    console.error('Contract signing error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contractId = searchParams.get('id');
    const token = searchParams.get('token');

    if (!contractId) {
      return NextResponse.json(
        { error: '缺少合同ID' },
        { status: 400 }
      );
    }

    // 验证签约令牌
    if (!token || !verifySigningToken(contractId, token)) {
      return NextResponse.json(
        { error: '无效的签约链接' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: contract, error } = await supabase
      .from('customer_service_contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (error || !contract) {
      return NextResponse.json(
        { error: '合同不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error('Fetch contract error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
