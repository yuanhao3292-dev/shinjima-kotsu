import { Resend } from 'resend';
import { escapeHtml } from './utils/html-escape';
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
  refundNotification,
} from './email-i18n';
import { EMAIL_FROM } from './email-template';
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
      valueColor: '#b13e22',
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
                  <p style="color: #1e293b; margin: 0; font-size: 14px;">${escapeHtml(data.notes)}</p>
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
      from: EMAIL_FROM.system,
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
      from: EMAIL_FROM.system,
      to: BCC_EMAIL,
      subject: `【新訂單】${data.packageName} - ${data.customerName}`,
      html: buildEmailHtml({
        headerTitle: 'NIIJIMA',
        iconEmoji: '&#128276;',
        iconBgColor: '#fef6f4',
        statusTitle: '收到新的體檢預約訂單',
        statusSubtitle: '請盡快聯繫客戶確認體檢日期',
        contentSections: [
          buildDetailsTable('訂單詳情', [
            { label: '訂單編號', value: data.orderId },
            { label: '套餐', value: data.packageName },
            { label: '金額', value: `¥${data.packagePrice.toLocaleString()}（税込）`, valueColor: '#b13e22' },
            { label: '客戶姓名', value: data.customerName },
            { label: '客戶郵箱', value: data.customerEmail },
            { label: '希望日期', value: data.preferredDate || '未指定', valueBold: false },
            { label: '希望時段', value: data.preferredTime || '未指定', valueBold: false },
            { label: '備註', value: data.notes || '無', valueBold: false },
          ]),
        ],
        ctaText: '查看訂單管理',
        ctaUrl: 'https://niijima-koutsu.jp/admin/orders',
        footerCompanyName: '新島交通株式會社',
        footerDisclaimer: '此郵件由系統自動發送',
      }),
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
        rawHtml: true,
      },
    ]),
  ];

  // 白标 URL
  if (data.whitelabelUrl) {
    contentSections.push(
      buildInfoCard(
        t(ws.whitelabelUrlLabel, locale),
        `<div style="text-align: center;"><a href="${escapeHtml(data.whitelabelUrl)}" style="color: #2563eb; font-size: 16px; word-break: break-all;">${escapeHtml(data.whitelabelUrl)}</a></div>`,
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
    bodyBgColor: '#f0f9ff',
    iconEmoji: '🎉',
    iconBgColor: '#dcfce7',
    statusTitle: t(ws.statusTitle, locale),
    statusSubtitle: t(ws.greeting, locale).replace('{{name}}', escapeHtml(data.guideName)),
    contentSections,
    ctaText: t(ws.ctaText, locale),
    ctaUrl: 'https://niijima-koutsu.jp/guide-partner/whitelabel',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Guide Partner Program',
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM.partner,
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
  withholdingAmount?: number;
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
      valueColor: '#b13e22',
    });
  }

  // 源泉徴収行（withholding tax）
  if (data.withholdingAmount && data.withholdingAmount > 0) {
    const withholdingLabel = locale === 'ja' ? '源泉徴収額'
      : locale === 'en' ? 'Withholding Tax'
      : '预扣税额';
    rows.push({
      label: withholdingLabel,
      value: `-¥${data.withholdingAmount.toLocaleString()}`,
      valueColor: '#dc2626',
      valueBold: false,
    });
  }

  // 佣金总计行 (使用 extraHtml 实现加粗分隔效果)
  const netAmount = data.commissionAmount - (data.withholdingAmount || 0);
  const totalLabel = (data.withholdingAmount && data.withholdingAmount > 0)
    ? (locale === 'ja' ? '手取り額' : locale === 'en' ? 'Net Amount' : locale === 'zh-TW' ? '實際到手' : '实际到手')
    : t(gc.labelTotal, locale);
  const totalRowHtml = `
                <table width="100%" style="font-size: 14px; margin-top: 12px; border-top: 2px solid #166534; padding-top: 8px;">
                  <tr>
                    <td style="color: #166534; font-weight: 600; font-size: 16px;">${totalLabel}</td>
                    <td style="color: #166534; text-align: right; font-weight: 700; font-size: 24px;">+¥${netAmount.toLocaleString()}</td>
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
    bodyBgColor: '#fff7ed',
    iconEmoji: '💰',
    iconBgColor: '#dcfce7',
    statusTitle: t(gc.statusTitle, locale),
    statusSubtitle: t(gc.statusSubtitle, locale).replace('{{name}}', escapeHtml(data.guideName)),
    contentSections,
    ctaText: t(gc.ctaText, locale),
    ctaUrl: 'https://niijima-koutsu.jp/guide-partner/commission',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Guide Partner Program',
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM.partner,
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
                <p style="color: #1e293b; margin: 0; font-size: 14px;">${escapeHtml(data.reviewNote)}</p>
              </div>
            </td>
          </tr>`
    );
  }

  const html = buildEmailHtml({
    headerTitle: 'NIIJIMA',
    headerSubtitle: 'Guide Partner Program',
    iconEmoji: `<span style="color: ${statusColor};">${statusIcon}</span>`,
    iconBgColor: statusBgColor,
    statusTitle: t(isApproved ? kn.statusApproved : kn.statusRejected, locale),
    statusTitleColor: statusColor,
    statusSubtitle: `${escapeHtml(data.guideName)}${locale === 'ja' ? ' 様' : ''}`,
    contentSections,
    ctaText: t(isApproved ? kn.ctaApproved : kn.ctaRejected, locale),
    ctaUrl: isApproved
      ? 'https://niijima-koutsu.jp/guide-partner/whitelabel'
      : 'https://niijima-koutsu.jp/guide-partner/settings',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Guide Partner Program',
    footerDisclaimer: t(kn.contactNote, locale),
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM.partner,
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
      from: EMAIL_FROM.partner,
      to: BCC_EMAIL,
      subject: `【新預約】${data.venueName} - ${data.customerName}（${data.partySize}人）by ${data.guideName}`,
      html: buildEmailHtml({
        headerTitle: 'NIIJIMA',
        iconEmoji: '&#128276;',
        iconBgColor: '#fef6f4',
        statusTitle: '新導遊預約通知',
        statusSubtitle: 'Guide Partner Booking',
        contentSections: [
          buildDetailsTable('預約詳情', [
            { label: '導遊', value: data.guideName },
            { label: '店舖', value: data.venueName, valueColor: '#b13e22' },
            { label: '客戶姓名', value: data.customerName, valueBold: false },
            ...(data.customerPhone ? [{ label: '客戶電話', value: data.customerPhone, valueBold: false }] : []),
            { label: '人數', value: `${data.partySize} 人` },
            { label: '預約日期', value: data.bookingDate },
            ...(data.bookingTime ? [{ label: '預約時間', value: data.bookingTime, valueBold: false }] : []),
          ], data.specialRequests ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e8e6e3;">
                  <p style="color: #78716a; margin: 0 0 4px; font-size: 12px;">特殊要求</p>
                  <p style="color: #1b1917; margin: 0; font-size: 14px;">${escapeHtml(data.specialRequests)}</p>
                </div>` : undefined),
        ],
        ctaText: '查看預約管理',
        ctaUrl: 'https://niijima-koutsu.jp/admin/bookings',
        footerCompanyName: '新島交通株式會社',
        footerDisclaimer: '此郵件由系統自動發送',
      }),
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
        valueColor: '#b13e22',
        valueFontSize: '18px',
      },
      {
        label: t(gr.labelAccountStatus, locale),
        value: buildStatusBadge(t(gr.statusActive, locale)),
        rawHtml: true,
      },
    ]),
    // 步骤
    buildStepsSection(t(gr.nextStepsTitle, locale), [
      t(gr.step1, locale),
      t(gr.step2, locale).replace('{{code}}', escapeHtml(data.referralCode)),
      t(gr.step3, locale),
      t(gr.step4, locale),
    ]),
  ];

  const html = buildEmailHtml({
    headerTitle: 'NIIJIMA',
    headerSubtitle: 'Guide Partner Program',
    bodyBgColor: '#f0f9ff',
    iconEmoji: '&#127881;',
    iconBgColor: '#dcfce7',
    statusTitle: t(gr.statusTitle, locale),
    statusSubtitle: t(gr.greeting, locale).replace('{{name}}', escapeHtml(data.guideName)),
    contentSections,
    ctaText: t(gr.ctaText, locale),
    ctaUrl: 'https://niijima-koutsu.jp/login',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Guide Partner Program',
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM.partner,
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
      from: EMAIL_FROM.system,
      to: BCC_EMAIL,
      subject: `[AEMC ERROR] AI 筛查 Pipeline 故障 - ${data.screeningId.slice(0, 8)}`,
      html: buildEmailHtml({
        headerTitle: 'NIIJIMA',
        iconEmoji: '&#9888;',
        iconBgColor: '#fef2f2',
        statusTitle: 'AEMC Pipeline 故障报告',
        statusTitleColor: '#dc2626',
        contentSections: [
          buildDetailsTable('故障信息', [
            { label: '时间', value: data.timestamp, valueBold: false },
            { label: '筛查 ID', value: data.screeningId, valueBold: false },
            { label: '用户类型', value: data.userType === 'authenticated' ? '注册用户' : '白标访客', valueBold: false },
            ...(data.userId ? [{ label: '用户 ID', value: data.userId, valueBold: false }] : []),
            ...(data.sessionId ? [{ label: 'Session ID', value: data.sessionId, valueBold: false }] : []),
            { label: '端点', value: data.endpoint, valueBold: false },
            ...(data.failedAiRuns !== undefined ? [{ label: '已完成 AI', value: `${data.failedAiRuns} 个 AI 模型完成后失败`, valueBold: false }] : []),
          ], `
                <div style="margin-top: 12px; padding: 12px; background: #fef2f2; border-radius: 6px; border-left: 4px solid #dc2626;">
                  <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: 600;">错误信息</p>
                  <p style="margin: 8px 0 0; font-size: 13px; color: #7f1d1d; font-family: monospace; word-break: break-all;">${escapeHtml(data.errorMessage)}</p>
                </div>`),
          buildInfoCard('', `<p style="color: #78716a; margin: 0; font-size: 12px;">该用户已收到友好的错误提示，建议稍后重试。如果此错误持续出现，请检查 OpenRouter API 状态和额度。</p>`),
        ],
        footerCompanyName: '新島交通株式會社',
        footerDisclaimer: '此郵件由系統自動發送',
      }),
    });

    console.log('[ScreeningError] Admin notification sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('[ScreeningError] Failed to send notification:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// 退款通知邮件（客户）
// ============================================

interface RefundNotificationData {
  customerEmail: string;
  customerName: string;
  packageName: string;
  refundAmount: number;
  orderId: string;
  reason?: string;
  stripeRefundId?: string;
  locale?: EmailLocale;
}

export async function sendRefundNotificationEmail(data: RefundNotificationData) {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped: Resend not configured');
    return { success: false, error: 'Resend not configured' };
  }

  const locale: EmailLocale = data.locale || 'ja';
  const rn = refundNotification;

  const shortId = data.orderId.slice(-8).toUpperCase();
  const subject = t(rn.subject, locale).replace('{{orderId}}', shortId);

  const rows: Array<{ label: string; value: string; valueColor?: string; valueFontSize?: string; valueBold?: boolean }> = [
    { label: t(rn.labelOrderId, locale), value: `#${shortId}` },
    { label: t(rn.labelPackage, locale), value: data.packageName },
    {
      label: t(rn.labelRefundAmount, locale),
      value: `¥${data.refundAmount.toLocaleString()}`,
      valueColor: '#dc2626',
      valueFontSize: '18px',
    },
    { label: t(rn.labelRefundMethod, locale), value: t(rn.refundMethodCard, locale), valueBold: false },
    { label: t(rn.labelRefundTimeline, locale), value: t(rn.refundTimeline, locale), valueBold: false },
  ];

  if (data.stripeRefundId) {
    rows.push({ label: t(rn.labelRefundId, locale), value: data.stripeRefundId, valueBold: false });
  }

  if (data.reason) {
    rows.push({ label: t(rn.labelReason, locale), value: data.reason, valueBold: false });
  }

  const contentSections = [
    buildDetailsTable(t(rn.detailsTitle, locale), rows),
    buildInfoCard('', `<p style="color: #64748b; margin: 0; font-size: 13px;">${t(rn.footerNote, locale)}</p><p style="color: #64748b; margin: 8px 0 0; font-size: 12px;">${t(rn.contactNote, locale)}</p>`),
    buildContactSection({
      prompt: t(common.contactPrompt, locale),
      lineButton: t(common.lineButton, locale),
      wechatButton: t(common.wechatButton, locale),
    }),
  ];

  const html = buildEmailHtml({
    headerTitle: 'NIIJIMA KOUTSU',
    headerSubtitle: '',
    headerTag: 'REFUND',
    iconEmoji: '&#8634;',
    statusTitle: t(rn.statusTitle, locale),
    statusSubtitle: t(rn.statusSubtitle, locale),
    contentSections,
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: '',
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM.system,
      to: data.customerEmail,
      bcc: BCC_EMAIL,
      subject,
      html,
    });

    console.log('[Refund] Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('[Refund] Failed to send email:', error);
    return { success: false, error: error.message };
  }
}
