import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { encryptPII } from '@/lib/utils/encryption';

/**
 * KYC 提交 API
 * 负责加密敏感信息后存储到数据库
 *
 * POST /api/kyc/submit
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    const {
      guideId,
      documentType,
      documentNumber,
      legalName,
      nationality,
      frontUrl,
      backUrl,
    } = body;

    // 验证必填字段
    if (!guideId || !documentType || !documentNumber || !legalName) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 创建服务端 Supabase 客户端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 验证请求者身份（通过 Authorization header）
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      );
    }

    // 验证用户是否有权限更新这个导游记录
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, auth_user_id')
      .eq('id', guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json(
        { error: '导游不存在' },
        { status: 404 }
      );
    }

    if (guide.auth_user_id !== user.id) {
      return NextResponse.json(
        { error: '无权限更新此导游记录' },
        { status: 403 }
      );
    }

    // 加密身份证号码
    const encryptedDocumentNumber = encryptPII(documentNumber);

    // 更新导游记录
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        kyc_status: 'submitted',
        id_document_type: documentType,
        id_document_number: encryptedDocumentNumber, // 加密存储
        legal_name: legalName,
        nationality,
        id_document_front_url: frontUrl,
        id_document_back_url: backUrl,
        kyc_submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', guideId);

    if (updateError) {
      console.error('更新 KYC 信息失败:', updateError);
      return NextResponse.json(
        { error: '提交失败，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'KYC 资料已提交，请等待审核',
    });

  } catch (error: any) {
    console.error('KYC 提交错误:', error);
    return NextResponse.json(
      { error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}
