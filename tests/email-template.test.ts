import { describe, it, expect } from 'vitest';
import {
  buildEmailHtml,
  buildDetailsTable,
  buildStepsSection,
  buildInfoCard,
  buildBanner,
  buildContactSection,
  buildStatusBadge,
} from '@/lib/email-template';

// ============================================================
// buildEmailHtml
// ============================================================

describe('buildEmailHtml', () => {
  // 2026-08-20 起统一模板：头部固定品牌渐变 + NIIJIMA 字标，页脚固定公司信息。
  // headerTitle/headerGradient/bodyBgColor/footerCompanyName 等个性化参数
  // 保留签名但不再参与渲染 —— 测试锁定的是"不可定制"这一契约本身。
  const minimalOpts = {
    headerTitle: 'Test Title',
    iconEmoji: '✅',
    statusTitle: 'Success',
    contentSections: ['<tr><td>Content</td></tr>'],
    footerCompanyName: 'Test Corp',
    footerDisclaimer: 'This is a test.',
  };

  it('returns valid HTML document', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html>');
    expect(html).toContain('</html>');
  });

  it('renders unified brand header (NIIJIMA wordmark, not caller title)', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain('NIIJIMA');
    expect(html).toContain('新島交通株式會社');
    expect(html).not.toContain('Test Title');
  });

  it('always uses the brand gradient header, ignoring custom gradients', () => {
    const html = buildEmailHtml({
      ...minimalOpts,
      headerGradient: 'linear-gradient(red, blue)',
    });
    expect(html).toContain('linear-gradient(100deg, #E8452F 0%, #EC652A 100%)');
    expect(html).not.toContain('linear-gradient(red, blue)');
  });

  it('renders unified footer company info, ignoring caller company name', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain('NIIJIMA KOTSU Co., Ltd.');
    expect(html).toContain('大阪府大阪市浪速区大国1-2-21-602');
    expect(html).toContain('+81-6-6632-8807');
    expect(html).not.toContain('Test Corp');
  });

  it('includes status icon emoji', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain('✅');
  });

  it('includes status title', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain('Success');
  });

  it('includes content sections', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain('Content');
  });

  it('includes footer disclaimer', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain('This is a test.');
  });

  it('uses unified light background', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain('#f6f5f3');
  });

  it('includes CTA button when provided (brand gradient)', () => {
    const html = buildEmailHtml({
      ...minimalOpts,
      ctaText: 'Click Me',
      ctaUrl: 'https://example.com',
    });
    expect(html).toContain('Click Me');
    expect(html).toContain('https://example.com');
  });

  it('omits CTA when not provided', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).not.toContain('Click Me');
  });

  it('includes status subtitle when provided', () => {
    const html = buildEmailHtml({ ...minimalOpts, statusSubtitle: 'Sub-status' });
    expect(html).toContain('Sub-status');
  });

  it('uses custom icon background color', () => {
    const html = buildEmailHtml({ ...minimalOpts, iconBgColor: '#ff0000' });
    expect(html).toContain('#ff0000');
  });

  it('uses custom status title color', () => {
    const html = buildEmailHtml({ ...minimalOpts, statusTitleColor: '#333333' });
    expect(html).toContain('#333333');
  });

  it('includes copyright year', () => {
    const html = buildEmailHtml(minimalOpts);
    expect(html).toContain(`© ${new Date().getFullYear()}`);
  });
});

// ============================================================
// buildDetailsTable
// ============================================================

describe('buildDetailsTable', () => {
  it('includes title', () => {
    const html = buildDetailsTable('Order Details', []);
    expect(html).toContain('Order Details');
  });

  it('includes row labels and values', () => {
    const html = buildDetailsTable('Details', [
      { label: 'Name', value: 'Alice' },
      { label: 'Amount', value: '¥5,000', valueBold: true },
    ]);
    expect(html).toContain('Name');
    expect(html).toContain('Alice');
    expect(html).toContain('Amount');
    expect(html).toContain('¥5,000');
  });

  it('escapes HTML in values by default', () => {
    const html = buildDetailsTable('Test', [
      { label: 'XSS', value: '<script>alert("xss")</script>' },
    ]);
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert');
  });

  it('allows rawHtml when specified', () => {
    const badge = '<span style="color:green">OK</span>';
    const html = buildDetailsTable('Test', [
      { label: 'Status', value: badge, rawHtml: true },
    ]);
    expect(html).toContain(badge);
  });

  it('always escapes labels', () => {
    const html = buildDetailsTable('Test', [
      { label: '<b>Bold</b>', value: 'val' },
    ]);
    expect(html).toContain('&lt;b&gt;Bold&lt;/b&gt;');
  });

  it('includes extraHtml when provided', () => {
    const html = buildDetailsTable('Test', [], '<p>Extra</p>');
    expect(html).toContain('<p>Extra</p>');
  });

  it('applies custom valueColor', () => {
    const html = buildDetailsTable('Test', [
      { label: 'Price', value: '¥100', valueColor: '#ef4444' },
    ]);
    expect(html).toContain('#ef4444');
  });

  it('applies custom valueFontSize', () => {
    const html = buildDetailsTable('Test', [
      { label: 'Big', value: 'BIG', valueFontSize: '20px' },
    ]);
    expect(html).toContain('font-size: 20px');
  });
});

// ============================================================
// buildStepsSection
// ============================================================

describe('buildStepsSection', () => {
  it('includes title', () => {
    const html = buildStepsSection('Next Steps', ['Step 1', 'Step 2']);
    expect(html).toContain('Next Steps');
  });

  it('includes steps as list items', () => {
    const html = buildStepsSection('Steps', ['Alpha', 'Beta', 'Gamma']);
    expect(html).toContain('<li>Alpha</li>');
    expect(html).toContain('<li>Beta</li>');
    expect(html).toContain('<li>Gamma</li>');
  });

  it('uses custom colors', () => {
    const html = buildStepsSection('Custom', ['S1'], {
      bgColor: '#fff0f0',
      borderColor: '#ff0000',
      titleColor: '#cc0000',
    });
    expect(html).toContain('#fff0f0');
    expect(html).toContain('#ff0000');
    expect(html).toContain('#cc0000');
  });
});

// ============================================================
// buildInfoCard
// ============================================================

describe('buildInfoCard', () => {
  it('includes title and content', () => {
    const html = buildInfoCard('Info', '<p>Details here</p>');
    expect(html).toContain('Info');
    expect(html).toContain('Details here');
  });

  it('uses custom colors', () => {
    const html = buildInfoCard('Test', '<p>Content</p>', {
      bgColor: '#f0f0f0',
      borderColor: '#cccccc',
    });
    expect(html).toContain('#f0f0f0');
    expect(html).toContain('#cccccc');
  });
});

// ============================================================
// buildBanner
// ============================================================

describe('buildBanner', () => {
  it('includes html content', () => {
    const html = buildBanner('Special offer!');
    expect(html).toContain('Special offer!');
  });

  it('uses custom gradient', () => {
    const html = buildBanner('Test', {
      bgGradient: 'linear-gradient(blue, green)',
    });
    expect(html).toContain('linear-gradient(blue, green)');
  });
});

// ============================================================
// buildContactSection
// ============================================================

describe('buildContactSection', () => {
  it('includes all labels', () => {
    const html = buildContactSection({
      prompt: 'Need help?',
      lineButton: 'LINE Us',
      wechatButton: 'WeChat Us',
    });
    expect(html).toContain('Need help?');
    expect(html).toContain('LINE Us');
    expect(html).toContain('WeChat Us');
  });

  it('includes LINE and WeChat URLs', () => {
    const html = buildContactSection({
      prompt: 'Contact',
      lineButton: 'LINE',
      wechatButton: 'WeChat',
    });
    expect(html).toContain('line.me');
    expect(html).toContain('wechat-qr.png');
  });
});

// ============================================================
// buildStatusBadge
// ============================================================

describe('buildStatusBadge', () => {
  it('includes text', () => {
    const html = buildStatusBadge('Confirmed');
    expect(html).toContain('Confirmed');
  });

  it('uses default colors', () => {
    const html = buildStatusBadge('OK');
    expect(html).toContain('#dcfce7');
    expect(html).toContain('#166534');
  });

  it('uses custom colors', () => {
    const html = buildStatusBadge('Error', {
      bgColor: '#fef2f2',
      textColor: '#991b1b',
    });
    expect(html).toContain('#fef2f2');
    expect(html).toContain('#991b1b');
  });
});
