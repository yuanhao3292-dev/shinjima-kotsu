import type { Metadata } from 'next'
import './globals.css'
import FloatingContact from '@/components/FloatingContact'
import LocaleFontSetter from '@/components/LocaleFontSetter'
import WhiteLabelTracker from '@/components/WhiteLabelTracker'
import { WhiteLabelProvider } from '@/lib/contexts/WhiteLabelContext'
import { getWhiteLabelConfig } from '@/lib/utils/whitelabel-server'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'TIMC OSAKA 體檢預約 | 日本大阪德洲會國際醫療中心 - 新島交通',
  description: 'TIMC OSAKA（德洲會國際醫療中心）官方預約代理。提供專業日本高端體檢服務，PET-CT癌症篩查、全身MRI、胃腸鏡等項目。中文服務、專車接送、報告翻譯一站式服務。',
  keywords: ['日本體檢', 'TIMC', '大阪體檢', '德洲會', 'PET-CT', '癌症篩查', '日本醫療旅遊', '高端體檢', '健康檢查'],
  authors: [{ name: '新島交通株式会社' }],
  creator: '新島交通株式会社',
  publisher: '新島交通株式会社',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="58" font-size="72" font-weight="600" fill="%232D2D2D" text-anchor="middle" dominant-baseline="central" font-family="Shippori Mincho, serif">新</text></svg>',
  },
  openGraph: {
    title: 'TIMC OSAKA 體檢預約 | 日本大阪德洲會國際醫療中心',
    description: '專業日本高端體檢服務，PET-CT癌症篩查、全身MRI、胃腸鏡等項目。中文服務一站式體驗。',
    url: 'https://timc.niijima-koutsu.jp',
    siteName: 'TIMC OSAKA 體檢預約',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIMC OSAKA 體檢預約 | 日本大阪德洲會國際醫療中心',
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

  return (
    <html lang="ja">
      <head>
        {/* 使用 loli.net 镜像，中国大陆可访问 */}
        <link rel="preconnect" href="https://fonts.loli.net" />
        <link rel="preconnect" href="https://gstatic.loli.net" crossOrigin="anonymous" />
        <link href="https://fonts.loli.net/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Sans+TC:wght@300;400;500;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Shippori+Mincho:wght@400;600;700&family=Noto+Serif+TC:wght@400;600;700&family=Noto+Serif+SC:wght@400;600;700&family=Inter:wght@300;400;500;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
        {/* 霞鹜文楷 - jsDelivr 中国有节点，用于简体中文标题 */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@latest/style.min.css" />
        {/* Font Awesome - cdnjs 在中国可访问 */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className="antialiased">
        <LocaleFontSetter />
        <WhiteLabelProvider initialConfig={whiteLabelConfig}>
          {children}
          <FloatingContact />
          <WhiteLabelTracker />
        </WhiteLabelProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
