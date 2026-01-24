import type { Metadata } from 'next';

/**
 * 业务领域页面 Metadata
 *
 * SEO 优化:
 * - 多语言标题和描述
 * - Open Graph 标签（社交媒体分享）
 * - Twitter Card 标签
 * - hreflang 标签（多语言支持）
 * - Canonical URL
 */
export const metadata: Metadata = {
  title: {
    default: '事業領域 | 新島交通',
    template: '%s | 新島交通',
  },
  description:
    '新島交通在医疗旅游、高尔夫旅游、商务考察、导游合伙人四大领域，提供连接华人旅客与日本高品质资源的服务。TIMC官方代理，20+名门球场，100+企业考察。',
  keywords: [
    '新島交通',
    'NIIJIMA KOTSU',
    '医疗旅游',
    '高尔夫旅游',
    '商务考察',
    '导游合伙人',
    'TIMC',
    '日本旅游',
    '企业考察',
    '名门高尔夫球场',
  ],
  authors: [{ name: 'NIIJIMA KOTSU', url: 'https://niijima-koutsu.jp' }],
  creator: 'NIIJIMA KOTSU',
  publisher: 'NIIJIMA KOTSU',

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    title: '事業領域 - 医疗旅游、高尔夫旅游、商务考察、导游合伙人 | 新島交通',
    description:
      '新島交通提供医疗旅游（TIMC官方代理）、高尔夫旅游（20+名门球场）、商务考察（100+企业）、导游合伙人（3000+网络）四大领域专业服务。',
    url: 'https://niijima-koutsu.jp/business',
    siteName: 'NIIJIMA KOTSU 新島交通',
    locale: 'ja_JP',
    alternateLocale: ['zh_TW', 'zh_CN', 'en_US'],
    type: 'website',
    images: [
      {
        url: 'https://niijima-koutsu.jp/og-business.jpg',
        width: 1200,
        height: 630,
        alt: '新島交通 业务领域 - 医疗旅游、高尔夫旅游、商务考察、导游合伙人',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '事業領域 | 新島交通',
    description:
      '医疗旅游（TIMC官方代理）、高尔夫旅游（20+名门球场）、商务考察（100+企业）、导游合伙人（3000+网络）',
    images: ['https://niijima-koutsu.jp/og-business.jpg'],
    creator: '@NiijimaKotsu',
  },

  // 多语言支持
  alternates: {
    canonical: 'https://niijima-koutsu.jp/business',
    languages: {
      'ja-JP': 'https://niijima-koutsu.jp/business',
      'zh-TW': 'https://niijima-koutsu.jp/business?lang=zh-TW',
      'zh-CN': 'https://niijima-koutsu.jp/business?lang=zh-CN',
      'en-US': 'https://niijima-koutsu.jp/business?lang=en',
    },
  },

  // 机器人爬取
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 其他 Meta 标签
  category: 'Business Services',
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
