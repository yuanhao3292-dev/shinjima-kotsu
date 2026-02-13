import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 获取导游合同信息
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    // 获取导游ID
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json(
        { error: '导游信息不存在' },
        { status: 404 }
      );
    }

    // 获取导游的合同
    const { data: contract, error: contractError } = await supabase
      .from('guide_commission_contracts')
      .select('*')
      .eq('guide_id', guide.id)
      .eq('status', 'active')
      .single();

    if (contractError) {
      return NextResponse.json({
        success: true,
        contract: null,
        message: '暂无合同',
      });
    }

    return NextResponse.json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error('Get guide contract error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 更新导游合同（上传签名后）
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    // 获取导游ID
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json(
        { error: '导游信息不存在' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { signatureUrl, complianceAcknowledged } = body;

    // 更新合同
    const updateData: any = {};

    if (signatureUrl) {
      updateData.guide_signature_url = signatureUrl;
      updateData.signed_by_guide_at = new Date().toISOString();
    }

    if (complianceAcknowledged !== undefined) {
      updateData.compliance_acknowledged = complianceAcknowledged;
      updateData.compliance_acknowledged_at = new Date().toISOString();
    }

    const { data: updatedContract, error: updateError } = await supabase
      .from('guide_commission_contracts')
      .update(updateData)
      .eq('guide_id', guide.id)
      .eq('status', 'active')
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
      message: '合同更新成功',
    });
  } catch (error) {
    console.error('Update guide contract error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
