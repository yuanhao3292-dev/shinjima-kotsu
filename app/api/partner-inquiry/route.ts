import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';
import { EMAIL_FROM, buildEmailHtml, buildDetailsTable, buildInfoCard } from '@/lib/email-template';

/** HTML 实体转义 — 防止邮件模板注入 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 延迟初始化
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not configured');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// 接收合作意向的邮箱
const PARTNER_INQUIRY_EMAIL = 'haoyuan@niijima-koutsu.jp';

interface PartnerInquiryData {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  message?: string;   // 表单上是选填，与 UI 保持一致
  country?: string;
  businessType?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 限速 — 防止邮件轰炸
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/partner-inquiry`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429 }
      );
    }

    const data: PartnerInquiryData = await request.json();

    // 验证必填字段
    if (!data.companyName || !data.contactName || !data.email) {
      return NextResponse.json(
        { error: '請填寫所有必填欄位' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: '請輸入有效的電子郵件地址' },
        { status: 400 }
      );
    }

    const resend = getResend();
    if (!resend) {
      console.error('Resend not configured');
      return NextResponse.json(
        { error: '郵件服務暫時不可用，請稍後再試' },
        { status: 500 }
      );
    }

    // HTML 转义所有用户输入
    const safe = {
      companyName: escapeHtml(data.companyName),
      contactName: escapeHtml(data.contactName),
      email: escapeHtml(data.email),
      phone: data.phone ? escapeHtml(data.phone) : '',
      message: data.message ? escapeHtml(data.message) : '',
      country: data.country ? escapeHtml(data.country) : '',
      businessType: data.businessType ? escapeHtml(data.businessType) : '',
    };

    // 发送邮件给管理员
    const result = await resend.emails.send({
      from: EMAIL_FROM.partner,
      to: PARTNER_INQUIRY_EMAIL,
      replyTo: data.email,
      subject: `【同業合作申請】${safe.companyName} - ${safe.contactName}`,
      html: buildEmailHtml({
        headerTitle: 'NIIJIMA',
        iconEmoji: '&#129309;',
        iconBgColor: '#fef6f4',
        statusTitle: '新同業合作申請',
        statusSubtitle: '收到新的合作夥伴申請，請盡快跟進',
        contentSections: [
          buildDetailsTable('申請資料', [
            { label: '公司名稱', value: data.companyName },
            { label: '聯絡人', value: data.contactName },
            { label: '電子郵件', value: data.email },
            ...(data.phone ? [{ label: '聯絡電話', value: data.phone, valueBold: false }] : []),
            ...(data.country ? [{ label: '國家/地區', value: data.country, valueBold: false }] : []),
            ...(data.businessType ? [{ label: '業務類型', value: data.businessType, valueBold: false }] : []),
          ], safe.message ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e8e6e3;">
                  <p style="color: #78716a; margin: 0 0 8px; font-size: 12px; font-weight: 600;">合作意向說明</p>
                  <p style="color: #1b1917; margin: 0; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${safe.message}</p>
                </div>` : undefined),
        ],
        ctaText: '回覆此申請',
        ctaUrl: `mailto:${safe.email}?subject=Re: 同業合作申請`,
        footerCompanyName: '新島交通株式會社',
        footerDisclaimer: `此郵件由網站自動發送 | 申請時間: ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Tokyo' })}`,
      }),
    });

    console.log('Partner inquiry email sent:', result);

    // 发送确认邮件给申请人
    await resend.emails.send({
      from: EMAIL_FROM.system,
      to: data.email,
      subject: '【新島交通】感謝您的合作申請',
      html: buildEmailHtml({
        headerTitle: 'NIIJIMA',
        iconEmoji: '&#10003;',
        statusTitle: '申請已收到',
        statusTitleColor: '#16a34a',
        statusSubtitle: `${safe.contactName} 您好，<br><br>感謝您對新島交通同業合作的興趣！<br>我們已收到您的申請，將在 1-2 個工作日內與您聯繫。`,
        contentSections: [
          buildInfoCard('您的申請摘要', `<p style="color: #1b1917; margin: 0; font-size: 14px;"><strong>公司名稱：</strong>${safe.companyName}</p>`),
          buildInfoCard('', `<p style="color: #78716a; margin: 0; font-size: 13px; text-align: center;">如有任何問題，歡迎聯繫 <a href="mailto:haoyuan@niijima-koutsu.jp" style="color: #b13e22; text-decoration: none;">haoyuan@niijima-koutsu.jp</a></p>`),
        ],
        footerCompanyName: '新島交通株式會社',
        footerDisclaimer: '此郵件由系統自動發送，請勿直接回覆',
      }),
    });

    return NextResponse.json({
      success: true,
      message: '申請已成功提交',
    });
  } catch (error: unknown) {
    console.error('Partner inquiry submission failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '提交失敗，請稍後再試',
      },
      { status: 500 }
    );
  }
}
