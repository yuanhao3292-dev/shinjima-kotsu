import { escapeHtml } from './utils/html-escape';

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
  const headerGradient =
    opts.headerGradient ||
    'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';
  const bodyBg = opts.bodyBgColor || '#f5f5f5';
  const iconBg = opts.iconBgColor || '#dcfce7';
  const titleColor = opts.statusTitleColor || '#166534';
  const ctaGradient =
    opts.ctaGradient ||
    opts.headerGradient ||
    'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';

  const headerTagHtml = opts.headerTag
    ? `<p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px;">${opts.headerTag}</p>`
    : '';
  const headerSubHtml = opts.headerSubtitle
    ? `<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; font-weight: 500;">${opts.headerSubtitle}</p>`
    : '';
  const subtitleHtml = opts.statusSubtitle
    ? `<p style="color: #6b7280; margin: 0; font-size: 16px;">${opts.statusSubtitle}</p>`
    : '';

  const ctaHtml =
    opts.ctaText && opts.ctaUrl
      ? `
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="${opts.ctaUrl}" style="display: inline-block; background: ${ctaGradient}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
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
<body style="margin: 0; padding: 0; background-color: ${bodyBg}; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${bodyBg}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: ${headerGradient}; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">${opts.headerTitle}</h1>
              ${headerSubHtml}
              ${headerTagHtml}
            </td>
          </tr>

          <!-- Status Icon -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: ${iconBg}; border-radius: 50%; display: inline-block; line-height: 80px;">
                <span style="font-size: 40px;">${opts.iconEmoji}</span>
              </div>
              <h2 style="color: ${titleColor}; margin: 20px 0 10px; font-size: 24px;">${opts.statusTitle}</h2>
              ${subtitleHtml}
            </td>
          </tr>

          <!-- Content Sections -->
          ${contentHtml}

          <!-- CTA -->
          ${ctaHtml}

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 8px; font-size: 14px; font-weight: 600;">${opts.footerCompanyName}</p>
              ${opts.footerSubtitle ? `<p style="color: #64748b; margin: 0; font-size: 12px;">${opts.footerSubtitle}</p>` : ''}
              <p style="color: #475569; margin: 16px 0 0; font-size: 11px;">
                ${opts.footerDisclaimer}
              </p>
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
  const bgColor = options?.bgColor || '#eff6ff';
  const borderColor = options?.borderColor || '#bfdbfe';
  const titleColor = options?.titleColor || '#1e40af';

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
  const bgColor = options?.bgColor || '#f8fafc';
  const borderColor = options?.borderColor || '#e2e8f0';

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
  const bg =
    options?.bgGradient ||
    'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)';
  const border = options?.borderColor || '#e9d5ff';
  const color = options?.textColor || '#7c3aed';

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
