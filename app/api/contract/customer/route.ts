import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractId, customerData, signature } = body;

    // 验证必填字段
    if (!contractId || !customerData || !signature) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 使用 service role 绕过 RLS（客户签约无需登录）
    const supabase = getSupabaseAdmin();

    // 获取现有合同
    const { data: contract, error: fetchError } = await supabase
      .from('customer_service_contracts')
      .select('*')
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

    // TODO: 发送邮件通知
    // - 发送合同PDF到客户邮箱
    // - 通知管理员有新合同签署

    // TODO: 生成合同PDF
    // - 使用 pdf-lib 或其他库生成带签名的合同PDF
    // - 上传到 Supabase Storage
    // - 更新 pdf_url 字段

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

    if (!contractId) {
      return NextResponse.json(
        { error: '缺少合同ID' },
        { status: 400 }
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
