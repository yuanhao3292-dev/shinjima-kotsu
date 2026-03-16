/**
 * Whitelabel Screening Document Upload API
 * POST: 上传诊断书/检查报告，提取文本内容（白标版）
 */

import { NextRequest, NextResponse } from 'next/server';
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
      `${clientIp}:/api/whitelabel/screening/upload-document`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const screeningId = formData.get('screeningId') as string;
    const sessionId = formData.get('sessionId') as string;

    if (!file || !screeningId || !sessionId) {
      return NextResponse.json(
        { error: '缺少必填字段 (file, screeningId, sessionId)' },
        { status: 400 }
      );
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

    const supabase = getSupabaseAdmin();

    // 验证 session_id 所有权
    const { data: screening, error: fetchError } = await supabase
      .from('whitelabel_screenings')
      .select('id, status')
      .eq('id', screeningId)
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !screening) {
      return NextResponse.json({ error: '筛查记录不存在' }, { status: 404 });
    }

    if (screening.status === 'completed') {
      return NextResponse.json({ error: '此筛查已完成，无法上传文档' }, { status: 400 });
    }

    // 上传到 Supabase Storage
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const fileExt = file.name.split('.').pop() || 'bin';
    const storagePath = `whitelabel-docs/${sessionId}/${screeningId}_${timestamp}_${randomStr}.${fileExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('screening-documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[DocUpload] Storage upload failed:', uploadError.message, uploadError);
      return NextResponse.json({ error: '文件上传失败' }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('screening-documents').getPublicUrl(storagePath);

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

    // 页数超限检查
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
      .from('whitelabel_screenings')
      .update({
        document_url: publicUrl,
        document_name: file.name,
        document_type: documentType,
        document_extracted_text: extractionResult.text,
        input_mode: 'hybrid',
      })
      .eq('id', screeningId)
      .eq('session_id', sessionId);

    if (updateError) {
      console.error('[DocUpload] DB update failed:', updateError.message);
      return NextResponse.json({ error: '保存文档信息失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      documentUrl: publicUrl,
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
