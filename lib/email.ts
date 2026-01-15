import { Resend } from 'resend';

// 延迟初始化，避免构建时报错
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not configured, emails will be skipped');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// 发件人地址 - 使用已验证的 niijima-koutsu.jp 域名
const FROM_EMAIL = 'TIMC 體檢預約 <noreply@niijima-koutsu.jp>';
// 抄送给商家的邮箱 - TODO: 替换为您的实际邮箱
const BCC_EMAIL = 'yuanhao3292@gmail.com'; // 商家通知邮箱

interface OrderConfirmationData {
  customerName: string;
  customerEmail: string;
  packageName: string;
  packagePrice: number;
  orderId: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

/**
 * 发送订单确认邮件给客户
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const timeLabel = data.preferredTime || '9:00 - 16:00';

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      bcc: BCC_EMAIL,
      subject: `【TIMC】您的體檢預約已確認 - 訂單 #${data.orderId.slice(-8).toUpperCase()}`,
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
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">TOKUSHUKAI INTERNATIONAL</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; font-weight: 500;">Medical Check-up OSAKA</p>
              <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px;">TIMC OSAKA</p>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; display: inline-block; line-height: 80px;">
                <span style="font-size: 40px;">✓</span>
              </div>
              <h2 style="color: #166534; margin: 20px 0 10px; font-size: 24px;">預約成功！</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">感謝您選擇 TIMC OSAKA，我們已收到您的預約</p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 16px; font-weight: 600;">訂單詳情</h3>

                <table width="100%" style="font-size: 14px;">
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">訂單編號</td>
                    <td style="color: #1e293b; text-align: right; font-weight: 600;">#${data.orderId.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">體檢套餐</td>
                    <td style="color: #1e293b; text-align: right; font-weight: 600;">${data.packageName}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">金額</td>
                    <td style="color: #1e40af; text-align: right; font-weight: 600; font-size: 18px;">¥${data.packagePrice.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">預約人</td>
                    <td style="color: #1e293b; text-align: right;">${data.customerName}</td>
                  </tr>
                  ${data.preferredDate ? `
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">希望日期</td>
                    <td style="color: #1e293b; text-align: right;">${data.preferredDate}</td>
                  </tr>
                  ` : ''}
                  ${data.preferredTime ? `
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">希望時段</td>
                    <td style="color: #1e293b; text-align: right;">${timeLabel}</td>
                  </tr>
                  ` : ''}
                </table>

                ${data.notes ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; margin: 0 0 4px; font-size: 12px;">備註</p>
                  <p style="color: #1e293b; margin: 0; font-size: 14px;">${data.notes}</p>
                </div>
                ` : ''}
              </div>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #eff6ff; border-radius: 12px; padding: 24px; border: 1px solid #bfdbfe;">
                <h3 style="color: #1e40af; margin: 0 0 16px; font-size: 16px; font-weight: 600;">📋 接下來的步驟</h3>
                <ol style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
                  <li>我們的客服將在 <strong>1-2 個工作日內</strong> 與您聯繫確認體檢日期</li>
                  <li>確認後會發送 <strong>體檢須知</strong> 和 <strong>注意事項</strong></li>
                  <li>體檢前一天會收到 <strong>提醒通知</strong></li>
                  <li>體檢完成後 <strong>7-10 個工作日</strong> 會收到中文報告</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="text-align: center; padding: 20px; background-color: #fafafa; border-radius: 12px;">
                <p style="color: #64748b; margin: 0 0 16px; font-size: 14px;">如有任何問題，歡迎聯繫我們</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom: 12px;">
                      <a href="https://line.me/ti/p/j3XxBP50j9" style="display: inline-block; background-color: #06C755; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        LINE 即時諮詢
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href="https://niijima-koutsu.jp/wechat-qr.png" style="display: inline-block; background-color: #07C160; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        微信掃碼諮詢
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Facility Info -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin: 0 0 12px; font-size: 14px; font-weight: 600;">📍 體檢地點</h3>
                <p style="color: #1e293b; margin: 0 0 4px; font-size: 14px; font-weight: 600;">TOKUSHUKAI INTERNATIONAL Medical Check-up OSAKA（TIMC OSAKA）</p>
                <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.6;">
                  〒530-0001<br>
                  大阪市北区梅田三丁目２番２号<br>
                  JP TOWER OSAKA 11階<br>
                  TEL: 06-7777-3353
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 8px; font-size: 14px; font-weight: 600;">新島交通株式会社</p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">TIMC OSAKA 指定預約代理</p>
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

    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 发送新订单通知给商家
 */
export async function sendNewOrderNotificationToMerchant(data: OrderConfirmationData) {
  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: BCC_EMAIL,
      subject: `【新訂單】${data.packageName} - ${data.customerName}`,
      html: `
        <h2>收到新的體檢預約訂單</h2>
        <ul>
          <li><strong>訂單編號:</strong> ${data.orderId}</li>
          <li><strong>套餐:</strong> ${data.packageName}</li>
          <li><strong>金額:</strong> ¥${data.packagePrice.toLocaleString()}</li>
          <li><strong>客戶姓名:</strong> ${data.customerName}</li>
          <li><strong>客戶郵箱:</strong> ${data.customerEmail}</li>
          <li><strong>希望日期:</strong> ${data.preferredDate || '未指定'}</li>
          <li><strong>希望時段:</strong> ${data.preferredTime || '未指定'}</li>
          <li><strong>備註:</strong> ${data.notes || '無'}</li>
        </ul>
        <p>請盡快聯繫客戶確認體檢日期。</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send merchant notification:', error);
  }
}
