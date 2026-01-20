import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { decryptPII, maskPII } from '@/lib/utils/encryption';
import { sendKYCNotification } from '@/lib/email';
import { getSupabaseAdmin } from '@/lib/supabase/api';

/**
 * 管理员 KYC API
 *
 * GET /api/admin/kyc - 获取待审核的 KYC 列表
 * GET /api/admin/kyc?id=xxx - 获取单个 KYC 详情
 */
export async function GET(request: NextRequest) {
  // 验证管理员身份
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const guideId = searchParams.get('id');
  const status = searchParams.get('status') || 'submitted';

  try {
    if (guideId) {
      // 获取单个导游的 KYC 详情
      const { data: guide, error } = await supabase
        .from('guides')
        .select(`
          id, name, email, phone,
          kyc_status, id_document_type, id_document_number,
          legal_name, nationality,
          id_document_front_url, id_document_back_url,
          kyc_submitted_at, kyc_reviewed_at, kyc_review_note,
          created_at
        `)
        .eq('id', guideId)
        .single();

      if (error) {
        return NextResponse.json({ error: '导游不存在' }, { status: 404 });
      }

      // 解密身份证号码并脱敏显示
      let maskedDocumentNumber = null;
      if (guide.id_document_number) {
        try {
          const decrypted = decryptPII(guide.id_document_number);
          maskedDocumentNumber = maskPII(decrypted);
        } catch {
          maskedDocumentNumber = '解密失败';
        }
      }

      return NextResponse.json({
        ...guide,
        id_document_number_masked: maskedDocumentNumber,
        id_document_number: undefined, // 不返回原始加密数据
      });
    } else {
      // 获取 KYC 列表
      const { data: guides, error } = await supabase
        .from('guides')
        .select(`
          id, name, email,
          kyc_status, id_document_type,
          legal_name, nationality,
          kyc_submitted_at
        `)
        .eq('kyc_status', status)
        .order('kyc_submitted_at', { ascending: false });

      if (error) {
        console.error('获取 KYC 列表失败:', error);
        return NextResponse.json({ error: '获取列表失败' }, { status: 500 });
      }

      return NextResponse.json({ guides: guides || [] });
    }
  } catch (error: unknown) {
    console.error('KYC API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * POST /api/admin/kyc - 审核 KYC
 */
export async function POST(request: NextRequest) {
  // 验证管理员身份
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  try {
    const body = await request.json();
    const { guideId, action, reviewNote } = body;

    if (!guideId || !action) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: '无效的操作' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // 更新导游 KYC 状态
    const { error } = await supabase
      .from('guides')
      .update({
        kyc_status: newStatus,
        kyc_reviewed_at: new Date().toISOString(),
        kyc_review_note: reviewNote || null,
        // 如果审核通过，同时更新 status 为 approved
        ...(action === 'approve' ? { status: 'approved' } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', guideId)
      .eq('kyc_status', 'submitted'); // 只能审核已提交的

    if (error) {
      console.error('更新 KYC 状态失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    // 获取导游信息用于发送邮件
    const { data: guideData } = await supabase
      .from('guides')
      .select('name, email')
      .eq('id', guideId)
      .single();

    // 发送 KYC 审核结果通知邮件
    if (guideData?.email) {
      await sendKYCNotification({
        guideEmail: guideData.email,
        guideName: guideData.name || '用户',
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewNote: reviewNote || undefined,
      }).catch(err => {
        console.error('发送 KYC 通知邮件失败:', err);
      });
    }

    // 记录审计日志
    try {
      await supabase.from('audit_logs').insert({
        action: `kyc_${action}`,
        entity_type: 'guide',
        entity_id: guideId,
        admin_id: authResult.userId,
        admin_email: authResult.email,
        details: { reviewNote },
      });
    } catch {
      // 审计日志失败不影响主流程
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'KYC 已通过' : 'KYC 已拒绝',
    });
  } catch (error: unknown) {
    console.error('KYC 审核错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
