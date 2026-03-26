/**
 * Health Screening Document Upload API
 * POST: 上传诊断书/检查报告，提取文本内容
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { extractDocument } from '@/services/document-extractor';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';

export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
];

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/health-screening/upload-document`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '请先登入后再使用此功能' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const screeningId = formData.get('screeningId') as string;

    if (!file || !screeningId) {
      return NextResponse.json({ error: '缺少必填字段 (file, screeningId)' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: '文件类型不支持，仅支持 PDF、JPG、PNG' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '文件大小不能超过 10MB' }, { status: 400 });
    }

    // 验证筛查记录所有权
    const { data: screening, error: fetchError } = await supabase
      .from('health_screenings')
      .select('id, status')
      .eq('id', screeningId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !screening) {
      return NextResponse.json({ error: '筛查记录不存在' }, { status: 404 });
    }

    if (screening.status === 'completed') {
      return NextResponse.json({ error: '此筛查已完成，无法上传文档' }, { status: 400 });
    }

    // 上传到 Supabase Storage（使用 Service Role 绕过 Storage RLS）
    const adminClient = getSupabaseAdmin();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const fileExt = file.name.split('.').pop() || 'bin';
    const storagePath = `screening-docs/${user.id}/${screeningId}_${timestamp}_${randomStr}.${fileExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from('screening-documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[DocUpload] Storage upload failed:', uploadError.message, uploadError);
      return NextResponse.json({ error: '文件上传失败' }, { status: 500 });
    }

    // 生成有时效的签名 URL（7天，医疗文档不应永久公开）
    const { data: signedUrlData, error: signedUrlError } = await adminClient.storage
      .from('screening-documents')
      .createSignedUrl(storagePath, 7 * 24 * 60 * 60); // 7 days

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('[DocUpload] Signed URL creation failed:', signedUrlError);
      return NextResponse.json({ error: '文件URL生成失败' }, { status: 500 });
    }
    const documentUrl = signedUrlData.signedUrl;

    // 提取文本
    let extractionResult;
    try {
      extractionResult = await extractDocument(buffer, file.type);
    } catch (extractError) {
      console.error(
        '[DocUpload] Text extraction failed:',
        extractError instanceof Error ? extractError.message : extractError
      );
      return NextResponse.json(
        { error: '文档文本提取失败，请确保文档清晰可读' },
        { status: 422 }
      );
    }

    // 页数超限检查 — 返回具体页数让前端显示友好提示
    if (extractionResult.errorMessage?.startsWith('PDF_PAGE_LIMIT_EXCEEDED:')) {
      const actualPages = extractionResult.errorMessage.split(':')[1];
      return NextResponse.json(
        { error: 'PDF_PAGE_LIMIT', pageCount: Number(actualPages), maxPages: 10 },
        { status: 400 }
      );
    }

    // 更新筛查记录
    const documentType = file.type === 'application/pdf' ? 'pdf' : 'image';
    const { error: updateError } = await supabase
      .from('health_screenings')
      .update({
        document_url: documentUrl,
        document_name: file.name,
        document_type: documentType,
        document_extracted_text: extractionResult.text,
        input_mode: 'hybrid',
      })
      .eq('id', screeningId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[DocUpload] DB update failed:', updateError.message);
      return NextResponse.json({ error: '保存文档信息失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      documentUrl,
      extractedText: extractionResult.text,
      extractionMethod: extractionResult.method,
      confidence: extractionResult.confidence,
      pageCount: extractionResult.pageCount,
      fileName: file.name,
      // [SAFETY-FIX] 提取失败时的错误提示（与 extractedText 分离）
      errorMessage: extractionResult.errorMessage,
    });
  } catch (error) {
    console.warn('Document upload failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: '系统错误，请稍后重试' }, { status: 500 });
  }
}
