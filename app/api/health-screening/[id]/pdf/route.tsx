import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import HealthReportDocument from '@/components/HealthReportPDF';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/health-screening/[id]/pdf?lang=zh-CN
 * GET /api/health-screening/[id]/pdf?sessionId=xxx&lang=zh-CN  (whitelabel)
 *
 * 服务端生成健康评估报告 PDF。
 * 支持两种认证：Supabase auth（官方用户）或 sessionId（白标用户）。
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const lang = searchParams.get('lang') as 'ja' | 'zh-CN' | 'zh-TW' | 'en' | null;
    const language = (['ja', 'zh-CN', 'zh-TW', 'en'].includes(lang || '') ? lang : null) as 'ja' | 'zh-CN' | 'zh-TW' | 'en' | null;

    let screening: any = null;

    if (sessionId) {
      // 白标用户：通过 sessionId 验证
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('whitelabel_screenings')
        .select('id, status, body_map_data, analysis_result, created_at, user_email')
        .eq('id', id)
        .eq('session_id', sessionId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Screening not found' }, { status: 404 });
      }
      screening = data;
    } else {
      // 官方用户：通过 Supabase auth 验证
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data, error } = await supabase
        .from('health_screenings')
        .select('id, status, body_map_data, analysis_result, created_at, user_email')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Screening not found' }, { status: 404 });
      }
      screening = data;
    }

    if (screening.status !== 'completed' || !screening.analysis_result) {
      return NextResponse.json({ error: 'Analysis not ready' }, { status: 400 });
    }

    const analysisResult = screening.analysis_result;
    const reportLanguage = language || analysisResult.language || 'zh-CN';

    const pdfBuffer = await renderToBuffer(
      <HealthReportDocument
        reportData={{
          id: screening.id,
          createdAt: screening.created_at,
          userEmail: screening.user_email || '',
          bodyMapData: screening.body_map_data || undefined,
          analysisResult,
          language: reportLanguage,
        }}
      />
    );

    const filename = `Niijima-Health-Report-${screening.id.substring(0, 8).toUpperCase()}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[Health PDF] Generation failed:', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
