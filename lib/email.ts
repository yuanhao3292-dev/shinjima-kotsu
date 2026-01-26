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
// 抄送给商家的邮箱 - 从环境变量读取，避免硬编码
const BCC_EMAIL = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || '';

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

// ============================================
// 白标订阅成功通知
// ============================================

interface WhitelabelSubscriptionData {
  guideEmail: string;
  guideName: string;
  subscriptionPlan: string;
  monthlyPrice: number;
  whitelabelUrl?: string;
}

/**
 * 发送白标订阅成功邮件
 */
export async function sendWhitelabelSubscriptionEmail(data: WhitelabelSubscriptionData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const whitelabelSection = data.whitelabelUrl ? `
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; border: 1px solid #bbf7d0; text-align: center;">
          <p style="color: #166534; margin: 0 0 12px; font-size: 14px; font-weight: 600;">🔗 您的专属白标页面</p>
          <a href="${data.whitelabelUrl}" style="color: #2563eb; font-size: 16px; word-break: break-all;">${data.whitelabelUrl}</a>
        </div>
      </td>
    </tr>
  ` : '';

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
      to: data.guideEmail,
      bcc: BCC_EMAIL,
      subject: `🎉 白标页面订阅成功 - NIIJIMA 导游合伙人`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f0f9ff; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">NIIJIMA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Guide Partner Program</p>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 50%; display: inline-block; line-height: 80px;">
                <span style="font-size: 40px;">🎉</span>
              </div>
              <h2 style="color: #166534; margin: 20px 0 10px; font-size: 28px;">订阅成功！</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">${data.guideName}，您好</p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                恭喜您成功订阅白标页面服务！<br />
                现在可以开始设置您的专属品牌页面，向客户展示您的服务了。
              </p>
            </td>
          </tr>

          <!-- Subscription Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 16px; font-weight: 600;">📋 订阅详情</h3>

                <table width="100%" style="font-size: 14px;">
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">订阅套餐</td>
                    <td style="color: #1e293b; text-align: right; font-weight: 600;">${data.subscriptionPlan}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">订阅费用</td>
                    <td style="color: #2563eb; text-align: right; font-weight: 600; font-size: 18px;">¥${data.monthlyPrice.toLocaleString()}/月</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">订阅状态</td>
                    <td style="text-align: right;"><span style="background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">已激活</span></td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          ${whitelabelSection}

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #eff6ff; border-radius: 12px; padding: 24px; border: 1px solid #bfdbfe;">
                <h3 style="color: #1e40af; margin: 0 0 16px; font-size: 16px; font-weight: 600;">🚀 接下来的步骤</h3>
                <ol style="color: #475569; margin: 0; padding-left: 20px; line-height: 2; font-size: 14px;">
                  <li>设置您的 <strong>URL 标识</strong>（例如：bespoketrip.jp/p/your-name）</li>
                  <li>自定义 <strong>品牌名称</strong> 和 <strong>品牌颜色</strong></li>
                  <li>添加您的 <strong>联系方式</strong>（微信、LINE、电话）</li>
                  <li>将白标链接分享给您的客户</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="https://niijima-koutsu.jp/guide-partner/whitelabel" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                设置我的白标页面
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 8px; font-size: 14px; font-weight: 600;">新島交通株式会社</p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">Guide Partner Program</p>
              <p style="color: #475569; margin: 16px 0 0; font-size: 11px;">
                此邮件由系统自动发送，请勿直接回复
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

    console.log('Whitelabel subscription email sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send whitelabel subscription email:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// 導遊合夥人佣金通知
// ============================================

interface GuideCommissionNotificationData {
  guideEmail: string;
  guideName: string;
  orderType: string;
  orderAmount: number;
  commissionAmount: number;
  commissionRate: number;
  isNewCustomerBonus: boolean;
  bonusAmount?: number;
  orderId: string;
}

/**
 * 發送佣金通知郵件給導遊
 */
export async function sendGuideCommissionNotification(data: GuideCommissionNotificationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const orderTypeLabels: Record<string, string> = {
    medical: '醫療體檢',
    golf: '高爾夫旅遊',
    business: '商務考察',
  };
  const orderTypeLabel = orderTypeLabels[data.orderType] || data.orderType;

  const bonusSection = data.isNewCustomerBonus && data.bonusAmount ? `
    <tr>
      <td style="color: #7c3aed; padding: 8px 0;">🎁 新客獎勵</td>
      <td style="color: #7c3aed; text-align: right; font-weight: 600;">+¥${data.bonusAmount.toLocaleString()}</td>
    </tr>
  ` : '';

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
      to: data.guideEmail,
      subject: `🎉 新佣金到帳！+¥${data.commissionAmount.toLocaleString()} - ${orderTypeLabel}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fff7ed; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff7ed; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">NIIJIMA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Guide Partner Program</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 50%; display: inline-block; line-height: 80px;">
                <span style="font-size: 40px;">💰</span>
              </div>
              <h2 style="color: #16a34a; margin: 20px 0 10px; font-size: 28px;">新佣金到帳！</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">恭喜 ${data.guideName}，您的推薦客戶已完成付款</p>
            </td>
          </tr>

          <!-- Commission Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; border: 1px solid #bbf7d0;">
                <h3 style="color: #166534; margin: 0 0 16px; font-size: 16px; font-weight: 600;">佣金明細</h3>

                <table width="100%" style="font-size: 14px;">
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">訂單類型</td>
                    <td style="color: #1e293b; text-align: right; font-weight: 600;">${orderTypeLabel}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">訂單金額</td>
                    <td style="color: #1e293b; text-align: right;">¥${data.orderAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">佣金率</td>
                    <td style="color: #1e293b; text-align: right;">${data.commissionRate}%</td>
                  </tr>
                  ${bonusSection}
                  <tr style="border-top: 2px solid #166534;">
                    <td style="color: #166534; padding: 12px 0 0; font-weight: 600; font-size: 16px;">本次佣金</td>
                    <td style="color: #166534; text-align: right; font-weight: 700; font-size: 24px;">+¥${data.commissionAmount.toLocaleString()}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          ${data.isNewCustomerBonus ? `
          <!-- New Customer Bonus Banner -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); border-radius: 12px; padding: 20px; border: 1px solid #e9d5ff;">
                <p style="color: #7c3aed; margin: 0; font-size: 14px; text-align: center;">
                  🎁 <strong>新客首單獎勵 +5%</strong> 已自動計入！
                </p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="https://niijima-koutsu.jp/guide-partner/commission" style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                查看佣金詳情
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 8px; font-size: 14px; font-weight: 600;">新島交通株式會社</p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">Guide Partner Program</p>
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

    console.log('Guide commission notification sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send guide commission notification:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// KYC 审核结果通知
// ============================================

interface KYCNotificationData {
  guideEmail: string;
  guideName: string;
  status: 'approved' | 'rejected';
  reviewNote?: string;
}

/**
 * 发送 KYC 审核结果通知邮件
 */
export async function sendKYCNotification(data: KYCNotificationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const isApproved = data.status === 'approved';
  const subject = isApproved
    ? '🎉 恭喜！您的身份验证已通过 - NIIJIMA 导游合伙人'
    : '⚠️ 身份验证未通过 - NIIJIMA 导游合伙人';

  const statusIcon = isApproved ? '✓' : '✗';
  const statusColor = isApproved ? '#16a34a' : '#dc2626';
  const statusBgColor = isApproved ? '#dcfce7' : '#fee2e2';
  const statusText = isApproved ? '验证通过' : '验证未通过';
  const messageText = isApproved
    ? '恭喜您！您的身份验证已通过审核，现在可以开始使用白标页面推广业务了。'
    : '很抱歉，您的身份验证未能通过审核。请检查提交的资料并重新申请。';

  const reviewNoteSection = data.reviewNote ? `
    <tr>
      <td style="padding: 20px 30px;">
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border-left: 4px solid ${statusColor};">
          <p style="color: #64748b; margin: 0 0 8px; font-size: 12px; font-weight: 600;">审核备注</p>
          <p style="color: #1e293b; margin: 0; font-size: 14px;">${data.reviewNote}</p>
        </div>
      </td>
    </tr>
  ` : '';

  const nextStepSection = isApproved ? `
    <tr>
      <td style="padding: 0 30px 30px; text-align: center;">
        <a href="https://niijima-koutsu.jp/guide-partner/whitelabel"
           style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          设置我的白标页面
        </a>
      </td>
    </tr>
  ` : `
    <tr>
      <td style="padding: 0 30px 30px; text-align: center;">
        <a href="https://niijima-koutsu.jp/guide-partner/settings"
           style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          重新提交资料
        </a>
      </td>
    </tr>
  `;

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
      to: data.guideEmail,
      subject,
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
            <td style="background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">NIIJIMA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Guide Partner Program</p>
            </td>
          </tr>

          <!-- Status Icon -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: ${statusBgColor}; border-radius: 50%; display: inline-block; line-height: 80px;">
                <span style="font-size: 40px; color: ${statusColor};">${statusIcon}</span>
              </div>
              <h2 style="color: ${statusColor}; margin: 20px 0 10px; font-size: 24px;">${statusText}</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">${data.guideName}，您好</p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 20px; text-align: center;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                ${messageText}
              </p>
            </td>
          </tr>

          ${reviewNoteSection}
          ${nextStepSection}

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                如有任何问题，请联系我们的客服团队
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

    console.log('KYC notification sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send KYC notification:', error);
    return { success: false, error: error.message };
  }
}
