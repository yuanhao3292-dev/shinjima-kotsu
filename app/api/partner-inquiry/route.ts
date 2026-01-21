import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
  message: string;
  businessType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: PartnerInquiryData = await request.json();

    // 验证必填字段
    if (!data.companyName || !data.contactName || !data.email || !data.message) {
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

    // 发送邮件给管理员
    const result = await resend.emails.send({
      from: '同業合作申請 <partner@niijima-koutsu.jp>',
      to: PARTNER_INQUIRY_EMAIL,
      replyTo: data.email,
      subject: `【同業合作申請】${data.companyName} - ${data.contactName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">新同業合作申請</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">收到新的合作夥伴申請</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin: 0 0 20px; font-size: 18px; font-weight: 600;">申請資料</h3>

                <table width="100%" style="font-size: 14px;">
                  <tr>
                    <td style="color: #64748b; padding: 12px 0; border-bottom: 1px solid #e2e8f0; width: 30%;">公司名稱</td>
                    <td style="color: #1e293b; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${data.companyName}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">聯絡人</td>
                    <td style="color: #1e293b; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${data.contactName}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">電子郵件</td>
                    <td style="color: #1e293b; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                      <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
                    </td>
                  </tr>
                  ${data.phone ? `
                  <tr>
                    <td style="color: #64748b; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">聯絡電話</td>
                    <td style="color: #1e293b; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${data.phone}</td>
                  </tr>
                  ` : ''}
                  ${data.businessType ? `
                  <tr>
                    <td style="color: #64748b; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">業務類型</td>
                    <td style="color: #1e293b; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${data.businessType}</td>
                  </tr>
                  ` : ''}
                </table>

                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; margin: 0 0 8px; font-size: 12px; font-weight: 600;">合作意向說明</p>
                  <p style="color: #1e293b; margin: 0; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${data.message}</p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Action -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="mailto:${data.email}?subject=Re: 同業合作申請" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                回覆此申請
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 8px; font-size: 14px; font-weight: 600;">新島交通株式會社</p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">同業合作夥伴系統</p>
              <p style="color: #475569; margin: 16px 0 0; font-size: 11px;">
                此郵件由網站自動發送 | 申請時間: ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Tokyo' })}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log('Partner inquiry email sent:', result);

    // 发送确认邮件给申请人
    await resend.emails.send({
      from: '新島交通 <noreply@niijima-koutsu.jp>',
      to: data.email,
      subject: '【新島交通】感謝您的合作申請',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">NIIJIMA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">新島交通株式會社</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; display: inline-block; line-height: 80px; margin-bottom: 20px;">
                <span style="font-size: 40px;">✓</span>
              </div>
              <h2 style="color: #166534; margin: 0 0 16px; font-size: 24px;">申請已收到</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.8;">
                ${data.contactName} 您好，<br><br>
                感謝您對新島交通同業合作的興趣！<br>
                我們已收到您的申請，將在 1-2 個工作日內與您聯繫。
              </p>
            </td>
          </tr>

          <!-- Summary -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0 0 8px; font-size: 12px;">您的申請摘要</p>
                <p style="color: #1e293b; margin: 0; font-size: 14px;"><strong>公司名稱：</strong>${data.companyName}</p>
              </div>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="text-align: center; padding: 20px; background-color: #fafafa; border-radius: 12px;">
                <p style="color: #64748b; margin: 0 0 16px; font-size: 14px;">如有任何問題，歡迎聯繫我們</p>
                <a href="mailto:haoyuan@niijima-koutsu.jp" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  聯繫我們
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 8px; font-size: 14px; font-weight: 600;">新島交通株式會社</p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">日本第二類旅行社</p>
              <p style="color: #475569; margin: 16px 0 0; font-size: 11px;">
                此郵件由系統自動發送，請勿直接回覆
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
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
