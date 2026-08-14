import type { Metadata } from 'next'
import { cookies } from 'next/headers'
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
// ⚠️ 必须 preload: false —— 这是一款 CJK 字体，next/font 会为它的每个
// unicode-range subset 各生成一个 <link rel="preload">。实测线上：
// 244 个预加载 link 中 239 个属于本字体，硬拉 7.37MB（占全部字体流量
// 99.6%），而非日语页面一个字形都不会用到它（document.fonts 已加载数为 0）。
// 其余 8 套字体本来就有 preload: false，唯独这里漏了。
// 关掉后仍可正常使用，只是改为按需取所需 subset。
const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-shippori-mincho',
  display: 'swap',
  preload: false,
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

  // 服务端就定好语言 —— 原本 lang 写死 ja、data-locale 由客户端
  // LocaleFontSetter 在 useEffect 里补，水合前后各命中一套字体栈：
  // 简中用户会先下日文 subset（Noto Sans JP + Shippori Mincho），
  // 水合后再下中文 subset，等于两套都下。
  // 从 cookie 直接读，首屏即用正确字体族，另一套永远不会被请求。
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value
  const locale = ['ja', 'zh-TW', 'zh-CN', 'en', 'ko'].includes(cookieLocale ?? '')
    ? (cookieLocale as string)
    : 'ja'
  const htmlLang = locale

  return (
    <html lang={htmlLang} data-locale={locale} className={fontVariableClasses}>
      {/* 曾在此引入霞鹜文楷 CDN 样式表作为简中 serif 后备，已移除：
          它是 <head> 里阻塞渲染的第三方样式表，带来 582 条 @font-face
          （LXGW WenKai + Mono 各 291），而它在字体栈里排第 4 位后备，
          前面的 var(--font-noto-serif-sc) 已覆盖全部字形 —— 线上实测
          document.fonts 中该族已加载数为 0，一个字都没渲染过。
          另外 @latest 未锁版本，第三方随时可变更内容。 */}
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
