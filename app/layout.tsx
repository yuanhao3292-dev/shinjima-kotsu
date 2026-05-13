import type { Metadata } from 'next'
import './globals.css'
import FloatingContact from '@/components/FloatingContact'
import LocaleFontSetter from '@/components/LocaleFontSetter'
import WhiteLabelTracker from '@/components/WhiteLabelTracker'
import { WhiteLabelProvider } from '@/lib/contexts/WhiteLabelContext'
import { getWhiteLabelConfig } from '@/lib/utils/whitelabel-server'
import { getGuideDistributionPage } from '@/lib/services/whitelabel'
import { buildDistributionNavItems } from '@/lib/utils/build-distribution-nav'
import BrowserFingerprint from '@/components/BrowserFingerprint'
import CookieConsent from '@/components/CookieConsent'
import ConsentAnalytics from '@/components/ConsentAnalytics'
import {
  Inter,
  Playfair_Display,
  Noto_Sans_JP,
  Noto_Sans_TC,
  Noto_Sans_SC,
  Noto_Sans_KR,
  Noto_Serif_TC,
  Noto_Serif_SC,
  Noto_Serif_KR,
  Shippori_Mincho,
} from 'next/font/google'

// === 自托管字体（构建时下载，运行时从 Vercel CDN 提供） ===
// 默认语言 (ja) 预加载，其他语言按需加载
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})
const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-shippori-mincho',
  display: 'swap',
})
const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
  preload: false,
})
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: false,
})
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: false,
})
const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
  preload: false,
})
const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
  preload: false,
})
const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
  preload: false,
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
  preload: false,
})

const fontVariableClasses = [
  notoSansJP.variable,
  shipporiMincho.variable,
  notoSansTC.variable,
  notoSansSC.variable,
  notoSansKR.variable,
  notoSerifTC.variable,
  notoSerifSC.variable,
  notoSerifKR.variable,
  inter.variable,
  playfairDisplay.variable,
].join(' ')

export const metadata: Metadata = {
  title: 'TIMC OSAKA 體檢預約 | 日本大阪德州會國際醫療中心 - 新島交通',
  description: 'TIMC OSAKA（德州會國際醫療中心）官方預約代理。提供專業日本高端體檢服務，PET-CT癌症篩查、全身MRI、胃腸鏡等項目。中文服務、專車接送、報告翻譯一站式服務。',
  keywords: ['日本體檢', 'TIMC', '大阪體檢', '德州會', 'PET-CT', '癌症篩查', '日本醫療旅遊', '高端體檢', '健康檢查'],
  authors: [{ name: '新島交通株式会社' }],
  creator: '新島交通株式会社',
  publisher: '新島交通株式会社',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="58" font-size="72" font-weight="600" fill="%232D2D2D" text-anchor="middle" dominant-baseline="central" font-family="Shippori Mincho, serif">新</text></svg>',
  },
  openGraph: {
    title: 'TIMC OSAKA 體檢預約 | 日本大阪德州會國際醫療中心',
    description: '專業日本高端體檢服務，PET-CT癌症篩查、全身MRI、胃腸鏡等項目。中文服務一站式體驗。',
    url: 'https://timc.niijima-koutsu.jp',
    siteName: 'TIMC OSAKA 體檢預約',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIMC OSAKA 體檢預約 | 日本大阪德州會國際醫療中心',
    description: '專業日本高端體檢服務，PET-CT癌症篩查、全身MRI、胃腸鏡等項目。',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 服务端获取白标配置
  const whiteLabelConfig = await getWhiteLabelConfig();

  // 白标模式下构建 DistributionNav 导航项，供 PublicLayout 渲染统一导航
  let distributionNavItems: { id: string; label: string | Record<string, string>; href?: string }[] | null = null;
  if (whiteLabelConfig.isWhiteLabelMode && whiteLabelConfig.currentSlug) {
    const pageData = await getGuideDistributionPage(whiteLabelConfig.currentSlug);
    if (pageData) {
      distributionNavItems = buildDistributionNavItems(
        whiteLabelConfig.currentSlug,
        pageData.selectedModules,
      );
    }
  }

  return (
    <html lang="ja" className={fontVariableClasses}>
      <head>
        {/* 霞鹜文楷 - jsDelivr 中国有节点，用于简体中文 serif 后备字体 */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@latest/style.min.css" />
      </head>
      <body className="antialiased">
        <LocaleFontSetter />
        <WhiteLabelProvider initialConfig={{ ...whiteLabelConfig, distributionNavItems }}>
          {children}
          <FloatingContact />
          <WhiteLabelTracker />
        </WhiteLabelProvider>
        <BrowserFingerprint />
        <ConsentAnalytics />
        <CookieConsent />
      </body>
    </html>
  )
}
