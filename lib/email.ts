import { Resend } from 'resend';
import {
  type EmailLocale,
  t,
  common,
  orderConfirmation,
  orderConfirmationGeneric,
  whitelabelSubscription,
  guideCommission,
  kycNotification,
  guideRegistration,
} from './email-i18n';
import {
  buildEmailHtml,
  buildDetailsTable,
  buildStepsSection,
  buildInfoCard,
  buildContactSection,
  buildBanner,
  buildStatusBadge,
} from './email-template';

// 延迟初始化，避免构建时报错
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not configured, emails will be skipped');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// 抄送给商家的邮箱 - 从环境变量读取，避免硬编码
const BCC_EMAIL = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || '';

// ============================================
// 1. 订单确认邮件（客户） — i18n
// ============================================

interface OrderConfirmationData {
  customerName: string;
  customerEmail: string;
  packageName: string;
  packagePrice: number;
  orderId: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  locale?: EmailLocale;
  provider?: string; // 服务提供方，有值则使用通用模板，无值则用 TIMC 体检模板
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const locale: EmailLocale = data.locale || 'ja';
  const isTIMC = !data.provider; // 无 provider → TIMC 体检；有 provider → 通用服务
  const oc = orderConfirmation;
  const gen = orderConfirmationGeneric;

  const shortId = data.orderId.slice(-8).toUpperCase();
  const subject = isTIMC
    ? t(oc.subject, locale).replace('{{orderId}}', shortId)
    : t(gen.subject, locale).replace('{{orderId}}', shortId);
  const fromName = isTIMC ? t(oc.fromName, locale) : t(gen.fromName, locale);

  // 详情行 — 服务标签根据类型不同
  const packageLabel = isTIMC ? t(oc.labelPackage, locale) : t(gen.labelPackage, locale);
  const rows = [
    { label: t(oc.labelOrderId, locale), value: `#${shortId}` },
    { label: packageLabel, value: data.packageName },
    {
      label: t(oc.labelAmount, locale),
      value: `¥${data.packagePrice.toLocaleString()}（税込）`,
      valueColor: '#1e40af',
      valueFontSize: '18px',
    },
    { label: t(oc.labelCustomer, locale), value: data.customerName, valueBold: false },
  ];
  if (data.preferredDate) {
    rows.push({ label: t(oc.labelDate, locale), value: data.preferredDate, valueBold: false });
  }
  if (data.preferredTime) {
    rows.push({ label: t(oc.labelTime, locale), value: data.preferredTime || '9:00 - 16:00', valueBold: false });
  }

  const notesHtml = data.notes
    ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; margin: 0 0 4px; font-size: 12px;">${t(oc.labelNotes, locale)}</p>
                  <p style="color: #1e293b; margin: 0; font-size: 14px;">${data.notes}</p>
                </div>`
    : '';

  // 步骤 — TIMC 体检有 4 步，通用服务有 3 步
  const steps = isTIMC
    ? [t(oc.nextStep1, locale), t(oc.nextStep2, locale), t(oc.nextStep3, locale), t(oc.nextStep4, locale)]
    : [t(gen.nextStep1, locale), t(gen.nextStep2, locale), t(gen.nextStep3, locale)];

  const contentSections = [
    buildDetailsTable(t(oc.detailsTitle, locale), rows, notesHtml),
    buildStepsSection(t(oc.nextStepsTitle, locale), steps),
    buildContactSection({
      prompt: t(common.contactPrompt, locale),
      lineButton: t(common.lineButton, locale),
      wechatButton: t(common.wechatButton, locale),
    }),
  ];

  // TIMC 体检才显示体检地点
  if (isTIMC) {
    contentSections.push(
      buildInfoCard(
        t(oc.facilityTitle, locale),
        `<p style="color: #1e293b; margin: 0 0 4px; font-size: 14px; font-weight: 600;">${t(oc.facilityName, locale)}</p>
                 <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.6;">
                   ${t(oc.facilityAddress, locale).replace(/\n/g, '<br>')}
                 </p>`
      )
    );
  }

  const html = buildEmailHtml({
    headerTitle: isTIMC ? 'TOKUSHUKAI INTERNATIONAL' : 'NIIJIMA MEDICAL',
    headerSubtitle: isTIMC ? 'Medical Check-up OSAKA' : 'Healthcare Coordination',
    headerTag: isTIMC ? 'TIMC OSAKA' : 'NIIJIMA',
    iconEmoji: '&#10003;',
    statusTitle: t(oc.statusTitle, locale),
    statusSubtitle: isTIMC ? t(oc.statusSubtitle, locale) : t(gen.statusSubtitle, locale),
    contentSections,
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: isTIMC ? t(oc.footerSubtitle, locale) : t(gen.footerSubtitle, locale),
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });

  try {
    const result = await resend.emails.send({
      from: `${fromName} <noreply@niijima-koutsu.jp>`,
      to: data.customerEmail,
      bcc: BCC_EMAIL,
      subject,
      html,
    });

    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// 2. 商家新订单通知（管理员） — 保持不变
// ============================================

export async function sendNewOrderNotificationToMerchant(data: OrderConfirmationData) {
  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: 'TIMC 體檢預約 <noreply@niijima-koutsu.jp>',
      to: BCC_EMAIL,
      subject: `【新訂單】${data.packageName} - ${data.customerName}`,
      html: `
        <h2>收到新的體檢預約訂單</h2>
        <ul>
          <li><strong>訂單編號:</strong> ${data.orderId}</li>
          <li><strong>套餐:</strong> ${data.packageName}</li>
          <li><strong>金額:</strong> ¥${data.packagePrice.toLocaleString()}（税込）</li>
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
// 3. 白标订阅成功通知（导游） — i18n
// ============================================

interface WhitelabelSubscriptionData {
  guideEmail: string;
  guideName: string;
  subscriptionPlan: string;
  monthlyPrice: number;
  whitelabelUrl?: string;
  locale?: EmailLocale;
}

export async function sendWhitelabelSubscriptionEmail(data: WhitelabelSubscriptionData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const locale: EmailLocale = data.locale || 'ja';
  const ws = whitelabelSubscription;

  const contentSections = [
    // 消息
    `<tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                ${t(ws.message, locale).replace(/\n/g, '<br />')}
              </p>
            </td>
          </tr>`,
    // 订阅详情
    buildDetailsTable(t(ws.detailsTitle, locale), [
      { label: t(ws.labelPlan, locale), value: data.subscriptionPlan },
      {
        label: t(ws.labelFee, locale),
        value: `¥${data.monthlyPrice.toLocaleString()}/${locale === 'ja' ? '月' : locale === 'en' ? 'mo' : '月'}`,
        valueColor: '#2563eb',
        valueFontSize: '18px',
      },
      {
        label: t(ws.labelStatus, locale),
        value: buildStatusBadge(t(ws.statusActive, locale)),
      },
    ]),
  ];

  // 白标 URL
  if (data.whitelabelUrl) {
    contentSections.push(
      buildInfoCard(
        t(ws.whitelabelUrlLabel, locale),
        `<div style="text-align: center;"><a href="${data.whitelabelUrl}" style="color: #2563eb; font-size: 16px; word-break: break-all;">${data.whitelabelUrl}</a></div>`,
        { bgColor: '#f0fdf4', borderColor: '#bbf7d0' }
      )
    );
  }

  // 步骤
  contentSections.push(
    buildStepsSection(t(ws.nextStepsTitle, locale), [
      t(ws.step1, locale),
      t(ws.step2, locale),
      t(ws.step3, locale),
      t(ws.step4, locale),
    ])
  );

  const html = buildEmailHtml({
    headerTitle: 'NIIJIMA',
    headerSubtitle: 'Guide Partner Program',
    headerGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    bodyBgColor: '#f0f9ff',
    iconEmoji: '🎉',
    iconBgColor: '#dcfce7',
    statusTitle: t(ws.statusTitle, locale),
    statusSubtitle: t(ws.greeting, locale).replace('{{name}}', data.guideName),
    contentSections,
    ctaText: t(ws.ctaText, locale),
    ctaUrl: 'https://niijima-koutsu.jp/guide-partner/whitelabel',
    ctaGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Guide Partner Program',
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
      to: data.guideEmail,
      bcc: BCC_EMAIL,
      subject: t(ws.subject, locale),
      html,
    });

    console.log('Whitelabel subscription email sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send whitelabel subscription email:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// 4. 佣金通知（导游） — i18n
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
  locale?: EmailLocale;
}

export async function sendGuideCommissionNotification(data: GuideCommissionNotificationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const locale: EmailLocale = data.locale || 'ja';
  const gc = guideCommission;

  const orderTypeTranslations = gc.orderTypes[data.orderType];
  const orderTypeLabel = orderTypeTranslations
    ? t(orderTypeTranslations, locale)
    : data.orderType;

  const subject = t(gc.subject, locale)
    .replace('{{amount}}', data.commissionAmount.toLocaleString())
    .replace('{{orderType}}', orderTypeLabel);

  const rows: import('./email-template').DetailRow[] = [
    { label: t(gc.labelOrderType, locale), value: orderTypeLabel },
    {
      label: t(gc.labelOrderAmount, locale),
      value: `¥${data.orderAmount.toLocaleString()}`,
      valueBold: false,
    },
    {
      label: t(gc.labelCommissionRate, locale),
      value: `${data.commissionRate}%`,
      valueBold: false,
    },
  ];

  if (data.isNewCustomerBonus && data.bonusAmount) {
    rows.push({
      label: t(gc.labelNewCustomerBonus, locale),
      value: `+¥${data.bonusAmount.toLocaleString()}`,
      valueColor: '#7c3aed',
    });
  }

  // 佣金总计行 (使用 extraHtml 实现加粗分隔效果)
  const totalRowHtml = `
                <table width="100%" style="font-size: 14px; margin-top: 12px; border-top: 2px solid #166534; padding-top: 8px;">
                  <tr>
                    <td style="color: #166534; font-weight: 600; font-size: 16px;">${t(gc.labelTotal, locale)}</td>
                    <td style="color: #166534; text-align: right; font-weight: 700; font-size: 24px;">+¥${data.commissionAmount.toLocaleString()}</td>
                  </tr>
                </table>`;

  const contentSections = [
    buildDetailsTable(t(gc.detailsTitle, locale), rows, totalRowHtml),
  ];

  if (data.isNewCustomerBonus) {
    contentSections.push(buildBanner(t(gc.bonusBanner, locale)));
  }

  const html = buildEmailHtml({
    headerTitle: 'NIIJIMA',
    headerSubtitle: 'Guide Partner Program',
    headerGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    bodyBgColor: '#fff7ed',
    iconEmoji: '💰',
    iconBgColor: '#dcfce7',
    statusTitle: t(gc.statusTitle, locale),
    statusSubtitle: t(gc.statusSubtitle, locale).replace('{{name}}', data.guideName),
    contentSections,
    ctaText: t(gc.ctaText, locale),
    ctaUrl: 'https://niijima-koutsu.jp/guide-partner/commission',
    ctaGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Guide Partner Program',
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
      to: data.guideEmail,
      subject,
      html,
    });

    console.log('Guide commission notification sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send guide commission notification:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// 5. KYC 审核结果通知（导游） — i18n
// ============================================

interface KYCNotificationData {
  guideEmail: string;
  guideName: string;
  status: 'approved' | 'rejected';
  reviewNote?: string;
  locale?: EmailLocale;
}

export async function sendKYCNotification(data: KYCNotificationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const locale: EmailLocale = data.locale || 'ja';
  const kn = kycNotification;
  const isApproved = data.status === 'approved';

  const subject = t(isApproved ? kn.subjectApproved : kn.subjectRejected, locale);
  const statusColor = isApproved ? '#16a34a' : '#dc2626';
  const statusBgColor = isApproved ? '#dcfce7' : '#fee2e2';
  const statusIcon = isApproved ? '✓' : '✗';

  const contentSections: string[] = [
    // 消息
    `<tr>
            <td style="padding: 0 30px 20px; text-align: center;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                ${t(isApproved ? kn.messageApproved : kn.messageRejected, locale)}
              </p>
            </td>
          </tr>`,
  ];

  if (data.reviewNote) {
    contentSections.push(
      `<tr>
            <td style="padding: 0 30px 20px;">
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border-left: 4px solid ${statusColor};">
                <p style="color: #64748b; margin: 0 0 8px; font-size: 12px; font-weight: 600;">${t(kn.reviewNoteLabel, locale)}</p>
                <p style="color: #1e293b; margin: 0; font-size: 14px;">${data.reviewNote}</p>
              </div>
            </td>
          </tr>`
    );
  }

  const html = buildEmailHtml({
    headerTitle: 'NIIJIMA',
    headerSubtitle: 'Guide Partner Program',
    headerGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    iconEmoji: `<span style="color: ${statusColor};">${statusIcon}</span>`,
    iconBgColor: statusBgColor,
    statusTitle: t(isApproved ? kn.statusApproved : kn.statusRejected, locale),
    statusTitleColor: statusColor,
    statusSubtitle: `${data.guideName}${locale === 'ja' ? ' 様' : ''}`,
    contentSections,
    ctaText: t(isApproved ? kn.ctaApproved : kn.ctaRejected, locale),
    ctaUrl: isApproved
      ? 'https://niijima-koutsu.jp/guide-partner/whitelabel'
      : 'https://niijima-koutsu.jp/guide-partner/settings',
    ctaGradient: isApproved
      ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Guide Partner Program',
    footerDisclaimer: t(kn.contactNote, locale),
  });

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
      to: data.guideEmail,
      subject,
      html,
    });

    console.log('KYC notification sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send KYC notification:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// 6. 导游预约通知（管理员） — 保持不变
// ============================================

interface GuideBookingNotificationData {
  guideName: string;
  venueName: string;
  customerName: string;
  customerPhone?: string;
  partySize: number;
  bookingDate: string;
  bookingTime?: string;
  specialRequests?: string;
}

export async function sendGuideBookingNotificationToAdmin(data: GuideBookingNotificationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  if (!BCC_EMAIL) {
    console.log('Email skipped: NOTIFICATION_EMAIL/ADMIN_EMAIL not configured');
    return { success: false, error: 'Admin email not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
      to: BCC_EMAIL,
      subject: `【新預約】${data.venueName} - ${data.customerName}（${data.partySize}人）by ${data.guideName}`,
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
            <td style="background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">新導遊預約通知</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Guide Partner Booking</p>
            </td>
          </tr>

          <!-- Booking Details -->
          <tr>
            <td style="padding: 30px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 16px; font-weight: 600;">預約詳情</h3>
                <table width="100%" style="font-size: 14px;">
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">導遊</td>
                    <td style="color: #1e293b; text-align: right; font-weight: 600;">${data.guideName}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">店舖</td>
                    <td style="color: #ea580c; text-align: right; font-weight: 600;">${data.venueName}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">客戶姓名</td>
                    <td style="color: #1e293b; text-align: right;">${data.customerName}</td>
                  </tr>
                  ${data.customerPhone ? `
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">客戶電話</td>
                    <td style="color: #1e293b; text-align: right;">${data.customerPhone}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">人數</td>
                    <td style="color: #1e293b; text-align: right; font-weight: 600;">${data.partySize} 人</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">預約日期</td>
                    <td style="color: #1e293b; text-align: right; font-weight: 600;">${data.bookingDate}</td>
                  </tr>
                  ${data.bookingTime ? `
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">預約時間</td>
                    <td style="color: #1e293b; text-align: right;">${data.bookingTime}</td>
                  </tr>
                  ` : ''}
                  ${data.specialRequests ? `
                  <tr>
                    <td colspan="2" style="padding-top: 12px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #64748b; margin: 0 0 4px; font-size: 12px;">特殊要求</p>
                      <p style="color: #1e293b; margin: 0;">${data.specialRequests}</p>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="https://niijima-koutsu.jp/admin/orders" style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                查看預約管理
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 20px; text-align: center;">
              <p style="color: #94a3b8; margin: 0; font-size: 12px;">此郵件由系統自動發送</p>
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

    console.log('Guide booking admin notification sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send guide booking notification:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// 7. 导游注册成功通知 — i18n
// ============================================

interface GuideRegistrationData {
  guideEmail: string;
  guideName: string;
  referralCode: string;
  locale?: EmailLocale;
}

export async function sendGuideRegistrationEmail(data: GuideRegistrationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const locale: EmailLocale = data.locale || 'ja';
  const gr = guideRegistration;

  const contentSections = [
    // 账户信息
    buildDetailsTable(t(gr.detailsTitle, locale), [
      { label: t(gr.labelEmail, locale), value: data.guideEmail },
      {
        label: t(gr.labelReferralCode, locale),
        value: data.referralCode,
        valueColor: '#ea580c',
        valueFontSize: '18px',
      },
      {
        label: t(gr.labelAccountStatus, locale),
        value: buildStatusBadge(t(gr.statusActive, locale)),
      },
    ]),
    // 步骤
    buildStepsSection(t(gr.nextStepsTitle, locale), [
      t(gr.step1, locale),
      t(gr.step2, locale).replace('{{code}}', data.referralCode),
      t(gr.step3, locale),
      t(gr.step4, locale),
    ]),
  ];

  const html = buildEmailHtml({
    headerTitle: 'NIIJIMA',
    headerSubtitle: 'Guide Partner Program',
    headerGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    bodyBgColor: '#f0f9ff',
    iconEmoji: '&#127881;',
    iconBgColor: '#dcfce7',
    statusTitle: t(gr.statusTitle, locale),
    statusSubtitle: t(gr.greeting, locale).replace('{{name}}', data.guideName),
    contentSections,
    ctaText: t(gr.ctaText, locale),
    ctaUrl: 'https://niijima-koutsu.jp/login',
    ctaGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Guide Partner Program',
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
      to: data.guideEmail,
      bcc: BCC_EMAIL,
      subject: t(gr.subject, locale),
      html,
    });

    console.log('Guide registration email sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send guide registration email:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// 8. AI 筛查 Pipeline 错误通知（管理员） — 保持不变
// ============================================

interface ScreeningErrorNotificationData {
  errorMessage: string;
  screeningId: string;
  userType: 'authenticated' | 'whitelabel';
  userId?: string;
  sessionId?: string;
  endpoint: string;
  failedAiRuns?: number;
  timestamp: string;
}

export async function sendScreeningErrorNotification(data: ScreeningErrorNotificationData) {
  const resend = getResend();
  if (!resend || !BCC_EMAIL) {
    console.warn('[ScreeningError] Resend not configured or no admin email, skipping notification');
    return { success: false, error: 'Not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: 'NIIJIMA System <noreply@niijima-koutsu.jp>',
      to: BCC_EMAIL,
      subject: `[AEMC ERROR] AI 筛查 Pipeline 故障 - ${data.screeningId.slice(0, 8)}`,
      html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #DC2626; color: white; padding: 16px 20px; border-radius: 8px 8px 0 0;">
    <h2 style="margin: 0; font-size: 18px;">⚠️ AEMC Pipeline 故障报告</h2>
  </div>
  <div style="border: 1px solid #E5E7EB; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding: 8px 0; color: #6B7280; width: 120px;">时间</td><td style="padding: 8px 0;">${data.timestamp}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">筛查 ID</td><td style="padding: 8px 0; font-family: monospace;">${data.screeningId}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">用户类型</td><td style="padding: 8px 0;">${data.userType === 'authenticated' ? '注册用户' : '白标访客'}</td></tr>
      ${data.userId ? `<tr><td style="padding: 8px 0; color: #6B7280;">用户 ID</td><td style="padding: 8px 0; font-family: monospace;">${data.userId}</td></tr>` : ''}
      ${data.sessionId ? `<tr><td style="padding: 8px 0; color: #6B7280;">Session ID</td><td style="padding: 8px 0; font-family: monospace;">${data.sessionId}</td></tr>` : ''}
      <tr><td style="padding: 8px 0; color: #6B7280;">端点</td><td style="padding: 8px 0; font-family: monospace;">${data.endpoint}</td></tr>
      ${data.failedAiRuns !== undefined ? `<tr><td style="padding: 8px 0; color: #6B7280;">已完成 AI</td><td style="padding: 8px 0;">${data.failedAiRuns} 个 AI 模型完成后失败</td></tr>` : ''}
    </table>
    <div style="margin-top: 16px; padding: 12px; background: #FEF2F2; border-radius: 6px; border-left: 4px solid #DC2626;">
      <p style="margin: 0; font-size: 13px; color: #991B1B; font-weight: 600;">错误信息</p>
      <p style="margin: 8px 0 0; font-size: 13px; color: #7F1D1D; font-family: monospace; word-break: break-all;">${data.errorMessage}</p>
    </div>
    <p style="margin-top: 16px; font-size: 12px; color: #9CA3AF;">
      该用户已收到友好的错误提示，建议稍后重试。如果此错误持续出现，请检查 OpenRouter API 状态和额度。
    </p>
  </div>
</body></html>
      `,
    });

    console.log('[ScreeningError] Admin notification sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('[ScreeningError] Failed to send notification:', error);
    return { success: false, error: error.message };
  }
}
