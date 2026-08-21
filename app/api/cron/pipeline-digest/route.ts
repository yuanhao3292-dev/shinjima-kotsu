/**
 * Pipeline Daily Digest — 每日管线健康诊断
 *
 * GET /api/cron/pipeline-digest
 *
 * 每天 JST 10:00 (UTC 01:00) 执行。
 * 查询过去 24h 的 AI 调用记录，聚合指标并检测异常，
 * 发送摘要邮件给管理员。
 */

import { NextRequest, NextResponse } from 'next/server';
import { EMAIL_FROM, buildEmailHtml } from '@/lib/email-template';
import { Resend } from 'resend';
import { queryPipelineMetrics, type PipelineDigest, type RoleMetrics, type AnomalyFlag } from '@/lib/utils/pipeline-metrics';

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  // 验证 Cron 密钥
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV === 'production' && !cronSecret) {
    console.error('[PipelineDigest] CRON_SECRET not configured');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  const adminEmail = process.env.BCC_EMAIL || process.env.NOTIFICATION_EMAIL;

  if (!resend || !adminEmail) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
  }

  try {
    const digest = await queryPipelineMetrics(24);
    const hasAnomalies = digest.anomalies.length > 0;
    const hasCritical = digest.anomalies.some(a => a.severity === 'critical');

    // 零活动：简短通知
    if (digest.totalScreenings === 0 && digest.roleMetrics.length === 0) {
      console.info('[PipelineDigest] No activity in last 24h, skipping email');
      return NextResponse.json({ success: true, activity: false, emailSent: false });
    }

    const html = buildDigestHtml(digest);
    const subjectPrefix = hasCritical ? '🔴 CRITICAL' : hasAnomalies ? '🟡 WARNING' : '✅';
    const subject = `${subjectPrefix} Pipeline Digest — ${digest.totalScreenings} screenings, ${digest.roleMetrics.reduce((s, r) => s + r.totalCalls, 0)} AI calls`;

    await resend.emails.send({
      from: EMAIL_FROM.system,
      to: adminEmail,
      subject,
      html,
    });

    console.info('[PipelineDigest] Email sent:', { screenings: digest.totalScreenings, anomalies: digest.anomalies.length });

    return NextResponse.json({
      success: true,
      activity: true,
      emailSent: true,
      screenings: digest.totalScreenings,
      anomalies: digest.anomalies.length,
    });
  } catch (error) {
    console.error('[PipelineDigest] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// ── HTML 邮件构建 ──

function buildDigestHtml(digest: PipelineDigest): string {
  const hasAnomalies = digest.anomalies.length > 0;
  const hasCritical = digest.anomalies.some(a => a.severity === 'critical');

  const statusColor = hasCritical ? '#dc2626' : hasAnomalies ? '#b45309' : '#16a34a';
  const statusIcon = hasCritical ? '🔴' : hasAnomalies ? '🟡' : '✅';
  const statusText = hasCritical ? 'Anomalies Detected' : hasAnomalies ? 'Warnings' : 'All Normal';

  const totalCalls = digest.roleMetrics.reduce((s, r) => s + r.totalCalls, 0);
  const totalErrors = digest.roleMetrics.reduce((s, r) => s + r.errorCount, 0);
  const overallErrorRate = totalCalls > 0 ? ((totalErrors / totalCalls) * 100).toFixed(1) : '0.0';

  // 概览表
  const overviewRows = `
    <tr><td style="padding:6px 0;color:#6b7280;">总筛查数</td><td style="padding:6px 0;text-align:right;font-weight:600;">${digest.totalScreenings}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">AI 总调用</td><td style="padding:6px 0;text-align:right;font-weight:600;">${totalCalls}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">总错误率</td><td style="padding:6px 0;text-align:right;font-weight:600;color:${totalErrors > 0 ? '#dc2626' : '#059669'};">${overallErrorRate}%</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">平均延迟</td><td style="padding:6px 0;text-align:right;font-weight:600;">${(digest.avgPipelineLatencyMs / 1000).toFixed(1)}s</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">Safety Gate</td><td style="padding:6px 0;text-align:right;font-weight:600;">A:${digest.gateDistribution.A} B:${digest.gateDistribution.B} C:${digest.gateDistribution.C} D:${digest.gateDistribution.D}</td></tr>`;

  // 各 role 详情
  const roleRows = digest.roleMetrics
    .sort((a, b) => roleOrder(a.role) - roleOrder(b.role))
    .map(r => buildRoleRow(r))
    .join('');

  // 异常告警
  const anomalyHtml = hasAnomalies
    ? `<tr><td style="padding:0 24px 20px;">
        <div style="background:${hasCritical ? '#fef2f2' : '#fffbeb'};border:1px solid ${hasCritical ? '#fecaca' : '#fde68a'};border-radius:8px;padding:16px;">
          <p style="margin:0 0 8px;font-weight:600;color:${hasCritical ? '#991b1b' : '#92400e'};">⚠️ Anomalies (${digest.anomalies.length})</p>
          ${digest.anomalies.map(a => `<p style="margin:4px 0;font-size:13px;color:${a.severity === 'critical' ? '#dc2626' : '#d97706'};">• ${a.message}</p>`).join('')}
        </div>
      </td></tr>`
    : '';

  // 基线对比
  const baselineHtml = digest.baseline
    ? `<tr><td style="padding:0 24px 20px;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;">
          <p style="margin:0;font-size:12px;color:#0369a1;">📊 7-day baseline: avg ${Math.round(digest.baseline.avgDailyCalls)} calls/day, Judge success ${(digest.baseline.avgJudgeSuccessRate * 100).toFixed(0)}%</p>
        </div>
      </td></tr>`
    : '';

  return buildEmailHtml({
    headerTitle: 'NIIJIMA',
    iconEmoji: statusIcon,
    iconBgColor: hasCritical ? '#fef2f2' : hasAnomalies ? '#fffbeb' : '#f0fdf4',
    statusTitle: `AEMC Pipeline Daily Digest`,
    statusTitleColor: statusColor,
    statusSubtitle: `${statusText} · ${digest.period.from.slice(0, 10)} — ${digest.period.to.slice(0, 10)}`,
    contentSections: [
      anomalyHtml,
      `<tr><td style="padding:0 30px 8px;"><p style="margin:0;font-size:14px;font-weight:600;color:#1b1917;">Overview</p></td></tr>
       <tr><td style="padding:0 30px 20px;"><table width="100%" style="font-size:13px;">${overviewRows}</table></td></tr>`,
      `<tr><td style="padding:0 30px 8px;"><p style="margin:0;font-size:14px;font-weight:600;color:#1b1917;">AI Models</p></td></tr>
       <tr><td style="padding:0 30px 20px;">
         <table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;border-collapse:collapse;">
           <tr style="background:#fbfaf9;">
             <th style="text-align:left;padding:8px 6px;color:#78716a;font-weight:500;">Role</th>
             <th style="text-align:right;padding:8px 6px;color:#78716a;font-weight:500;">Calls</th>
             <th style="text-align:right;padding:8px 6px;color:#78716a;font-weight:500;">Errors</th>
             <th style="text-align:right;padding:8px 6px;color:#78716a;font-weight:500;">Avg ms</th>
             <th style="text-align:right;padding:8px 6px;color:#78716a;font-weight:500;">Tokens</th>
           </tr>
           ${roleRows}
         </table>
       </td></tr>`,
      baselineHtml,
    ].filter(Boolean),
    footerCompanyName: '新島交通株式會社',
    footerDisclaimer: 'Auto-generated daily digest. Anomalies are flagged based on 7-day baseline.',
  });
}

function buildRoleRow(r: RoleMetrics): string {
  const errorColor = r.errorRate > 0.2 ? '#dc2626' : r.errorRate > 0 ? '#d97706' : '#059669';
  const errorText = r.errorCount > 0 ? `${r.errorCount} (${(r.errorRate * 100).toFixed(0)}%)` : '0';
  const tokens = r.totalInputTokens + r.totalOutputTokens;
  const tokensText = tokens > 1000 ? `${(tokens / 1000).toFixed(1)}k` : String(tokens);
  const modelStr = Object.entries(r.models).map(([m, c]) => `${m.split('/').pop()}×${c}`).join(', ');

  return `
    <tr style="border-bottom:1px solid #f1f5f9;">
      <td style="padding:8px 6px;">
        <p style="margin:0;font-weight:500;">${roleLabel(r.role)}</p>
        <p style="margin:2px 0 0;font-size:11px;color:#9ca3af;">${modelStr}</p>
      </td>
      <td style="padding:8px 6px;text-align:right;">${r.totalCalls}</td>
      <td style="padding:8px 6px;text-align:right;color:${errorColor};font-weight:500;">${errorText}</td>
      <td style="padding:8px 6px;text-align:right;">${r.avgLatencyMs > 0 ? r.avgLatencyMs : '—'}</td>
      <td style="padding:8px 6px;text-align:right;">${tokensText}</td>
    </tr>`;
}

function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    extractor: 'AI-1 Extractor',
    triage: 'AI-2 Triage',
    challenger: 'AI-3 Challenger',
    adjudicator: 'AI-4 Adjudicator',
    judge: 'AI-5 Judge',
    hospital_matcher: 'Hospital Matcher',
  };
  return labels[role] || role;
}

function roleOrder(role: string): number {
  const order: Record<string, number> = {
    extractor: 1, triage: 2, challenger: 3, adjudicator: 4, judge: 5, hospital_matcher: 6,
  };
  return order[role] || 99;
}
