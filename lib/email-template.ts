import { escapeHtml } from './utils/html-escape';

// ============================================
// 统一发件人（显示名一律 NIIJIMA 新島交通，地址按用途分）
// ============================================
export const EMAIL_FROM = {
  system: 'NIIJIMA 新島交通 <noreply@niijima-koutsu.jp>',
  partner: 'NIIJIMA 新島交通 <partner@niijima-koutsu.jp>',
  health: 'NIIJIMA 新島交通 <health@niijima-koutsu.jp>',
} as const;

// 品牌渐变（与官网导航同源）——所有邮件头部/主按钮唯一用色
const BRAND_GRADIENT = 'linear-gradient(100deg, #E8452F 0%, #EC652A 100%)';

// ============================================
// 统一邮件 HTML 模板构建器
// ============================================

export interface EmailTemplateOptions {
  // Header
  headerTitle: string;
  headerSubtitle?: string;
  headerTag?: string;
  headerGradient?: string; // CSS gradient, default blue

  // Status icon section
  iconEmoji: string;
  iconBgColor?: string; // default #dcfce7
  statusTitle: string;
  statusTitleColor?: string; // default #166534
  statusSubtitle?: string;

  // Content sections (array of pre-built HTML blocks)
  contentSections: string[];

  // CTA button (optional)
  ctaText?: string;
  ctaUrl?: string;
  ctaGradient?: string;

  // Footer
  footerCompanyName: string;
  footerSubtitle?: string;
  footerDisclaimer: string;

  // Body background
  bodyBgColor?: string; // default #f5f5f5
}

/**
 * 生成统一风格的邮件 HTML
 */
export function buildEmailHtml(opts: EmailTemplateOptions): string {
  // 2026-08-20 起统一模板（用户要求所有对外邮件格式高度统一，参考 Google 交易邮件）：
  // 头部固定为品牌渐变 + NIIJIMA 字标（headerTitle/headerGradient 等参数保留签名
  // 但不再参与渲染），页脚统一浅色公司信息。此前 17 个发信点五种配色各写各的。
  const iconBg = opts.iconBgColor || '#f0fdf4';
  const titleColor = opts.statusTitleColor || '#1b1917';
  const year = new Date().getFullYear();

  const subtitleHtml = opts.statusSubtitle
    ? `<p style="color: #58534e; margin: 0; font-size: 15px; line-height: 1.7;">${opts.statusSubtitle}</p>`
    : '';

  const ctaHtml =
    opts.ctaText && opts.ctaUrl
      ? `
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="${opts.ctaUrl}" style="display: inline-block; background: ${BRAND_GRADIENT}; color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                ${opts.ctaText}
              </a>
            </td>
          </tr>`
      : '';

  const contentHtml = opts.contentSections.join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f6f5f3; font-family: 'Helvetica Neue', 'Noto Sans JP', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f5f3; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">

          <!-- Header：品牌渐变带 + 字标（全部邮件一致） -->
          <tr>
            <td style="background: ${BRAND_GRADIENT}; padding: 32px 30px; text-align: center;">
              <div style="color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 0.08em;">NIIJIMA</div>
              <div style="color: rgba(255,255,255,0.9); margin-top: 6px; font-size: 13px; letter-spacing: 0.12em;">新島交通株式會社</div>
            </td>
          </tr>

          <!-- Status -->
          <tr>
            <td style="padding: 36px 30px 20px; text-align: center;">
              <div style="width: 72px; height: 72px; background-color: ${iconBg}; border-radius: 50%; display: inline-block; line-height: 72px;">
                <span style="font-size: 34px;">${opts.iconEmoji}</span>
              </div>
              <h2 style="color: ${titleColor}; margin: 20px 0 10px; font-size: 22px; font-weight: 700;">${opts.statusTitle}</h2>
              ${subtitleHtml}
            </td>
          </tr>

          <!-- Content Sections -->
          ${contentHtml}

          <!-- CTA -->
          ${ctaHtml}

          <!-- Footer：统一公司信息 -->
          <tr>
            <td style="background-color: #fbfaf9; border-top: 1px solid #e8e6e3; padding: 24px 30px; text-align: center;">
              <p style="color: #1b1917; margin: 0 0 4px; font-size: 13px; font-weight: 600;">新島交通株式會社 NIIJIMA KOTSU Co., Ltd.</p>
              <p style="color: #78716a; margin: 0 0 4px; font-size: 12px;">〒556-0014 大阪府大阪市浪速区大国1-2-21-602</p>
              <p style="color: #78716a; margin: 0 0 12px; font-size: 12px;">TEL: +81-6-6632-8807 · <a href="mailto:haoyuan@niijima-koutsu.jp" style="color: #b13e22; text-decoration: none;">haoyuan@niijima-koutsu.jp</a></p>
              <p style="color: #a8a29b; margin: 0 0 4px; font-size: 11px;">${opts.footerDisclaimer}</p>
              <p style="color: #a8a29b; margin: 0; font-size: 11px;">© ${year} NIIJIMA KOTSU Co., Ltd. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================
// 内容块构建器
// ============================================

export interface DetailRow {
  label: string;
  value: string;
  valueColor?: string;
  valueBold?: boolean;
  valueFontSize?: string;
  /** Set to true if value contains intentional HTML (e.g. buildStatusBadge). Default: auto-escaped. */
  rawHtml?: boolean;
}

/**
 * 构建键值对详情表格
 */
export function buildDetailsTable(
  title: string,
  rows: DetailRow[],
  extraHtml?: string
): string {
  const rowsHtml = rows
    .map(
      (r) => {
        const safeValue = r.rawHtml ? r.value : escapeHtml(r.value);
        return `
                  <tr>
                    <td style="color: #64748b; padding: 8px 0;">${escapeHtml(r.label)}</td>
                    <td style="color: ${r.valueColor || '#1e293b'}; text-align: right; font-weight: ${r.valueBold !== false ? '600' : '400'}; ${r.valueFontSize ? `font-size: ${r.valueFontSize};` : ''}">${safeValue}</td>
                  </tr>`;
      }
    )
    .join('');

  return `
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 16px; font-weight: 600;">${title}</h3>
                <table width="100%" style="font-size: 14px;">
                  ${rowsHtml}
                </table>
                ${extraHtml || ''}
              </div>
            </td>
          </tr>`;
}

/**
 * 构建步骤列表卡片
 */
export function buildStepsSection(
  title: string,
  steps: string[],
  options?: {
    bgColor?: string;
    borderColor?: string;
    titleColor?: string;
  }
): string {
  const bgColor = options?.bgColor || '#fbfaf9';
  const borderColor = options?.borderColor || '#e8e6e3';
  const titleColor = options?.titleColor || '#1b1917';

  const stepsHtml = steps
    .map((step) => `<li>${step}</li>`)
    .join('\n                  ');

  return `
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: ${bgColor}; border-radius: 12px; padding: 24px; border: 1px solid ${borderColor};">
                <h3 style="color: ${titleColor}; margin: 0 0 16px; font-size: 16px; font-weight: 600;">${title}</h3>
                <ol style="color: #475569; margin: 0; padding-left: 20px; line-height: 2; font-size: 14px;">
                  ${stepsHtml}
                </ol>
              </div>
            </td>
          </tr>`;
}

/**
 * 构建信息卡片（通用）
 */
export function buildInfoCard(
  title: string,
  contentHtml: string,
  options?: { bgColor?: string; borderColor?: string }
): string {
  const bgColor = options?.bgColor || '#fbfaf9';
  const borderColor = options?.borderColor || '#e8e6e3';

  return `
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: ${bgColor}; border-radius: 12px; padding: 20px; border: 1px solid ${borderColor};">
                <h3 style="color: #1e293b; margin: 0 0 12px; font-size: 14px; font-weight: 600;">${title}</h3>
                ${contentHtml}
              </div>
            </td>
          </tr>`;
}

/**
 * 构建高亮横幅
 */
export function buildBanner(
  html: string,
  options?: { bgGradient?: string; borderColor?: string; textColor?: string }
): string {
  const bg = options?.bgGradient || '#fef6f4';
  const border = options?.borderColor || '#fbd5cc';
  const color = options?.textColor || '#b13e22';

  return `
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: ${bg}; border-radius: 12px; padding: 20px; border: 1px solid ${border};">
                <p style="color: ${color}; margin: 0; font-size: 14px; text-align: center;">
                  ${html}
                </p>
              </div>
            </td>
          </tr>`;
}

/**
 * 构建联系方式区块（LINE + WeChat）
 */
export function buildContactSection(labels: {
  prompt: string;
  lineButton: string;
  wechatButton: string;
}): string {
  return `
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="text-align: center; padding: 20px; background-color: #fafafa; border-radius: 12px;">
                <p style="color: #64748b; margin: 0 0 16px; font-size: 14px;">${labels.prompt}</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom: 12px;">
                      <a href="https://line.me/ti/p/j3XxBP50j9" style="display: inline-block; background-color: #06C755; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        ${labels.lineButton}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href="https://niijima-koutsu.jp/wechat-qr.png" style="display: inline-block; background-color: #07C160; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        ${labels.wechatButton}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>`;
}

/**
 * 构建状态徽章 HTML
 */
export function buildStatusBadge(
  text: string,
  options?: { bgColor?: string; textColor?: string }
): string {
  const bg = options?.bgColor || '#dcfce7';
  const color = options?.textColor || '#166534';
  return `<span style="background-color: ${bg}; color: ${color}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${text}</span>`;
}
