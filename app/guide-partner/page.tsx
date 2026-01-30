'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Shield,
  X
} from 'lucide-react';

// 微信二維碼圖片路徑
const WECHAT_QR_URL = '/wechat-qr.png';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  // Hero Section
  heroTagline: {
    'ja': '新島交通 · ガイドパートナープログラム',
    'zh-TW': '新島交通 · 導遊提攜夥伴計劃',
    'zh-CN': '新岛交通 · 导游合作伙伴计划',
    'en': 'NIIJIMA · Guide Partner Program',
  },
  heroTitle1: {
    'ja': 'お客様を紹介、私たちがリソースを提供',
    'zh-TW': '您帶客戶，我們出資源',
    'zh-CN': '您带客户，我们出资源',
    'en': 'You bring clients, we provide resources',
  },
  heroTitle2: {
    'ja': '成功すれば報酬あり',
    'zh-TW': '成功即有報酬',
    'zh-CN': '成功即有报酬',
    'en': 'Earn rewards on success',
  },
  heroDesc: {
    'ja': '精密検診、高級ナイトクラブ、医療サービス——これらの高級リソースはすでに確保済み。',
    'zh-TW': '精密體檢、高級夜總會、醫療服務——這些高端資源，我們已經談好了。',
    'zh-CN': '精密健检、高级夜总会、医疗服务——这些高端资源，我们已经谈好了。',
    'en': 'Premium health checkups, luxury clubs, medical services — these high-end resources are ready.',
  },
  heroDesc2: {
    'ja': 'お客様を紹介するだけ。',
    'zh-TW': '您只需要做一件事：把客戶介紹過來。',
    'zh-CN': '您只需要做一件事：把客户介绍过来。',
    'en': 'Just introduce clients.',
  },
  btnWechatApply: {
    'ja': 'WeChat申請',
    'zh-TW': '微信申請加入',
    'zh-CN': '微信申请加入',
    'en': 'WeChat Application',
  },
  btnLearnHow: {
    'ja': '仕組みを理解する',
    'zh-TW': '了解運作方式',
    'zh-CN': '了解运作方式',
    'en': 'How It Works',
  },

  // 3 Steps Section
  step1Title: {
    'ja': 'お客様を紹介',
    'zh-TW': '您介紹客戶',
    'zh-CN': '您介绍客户',
    'en': 'You introduce clients',
  },
  step1Desc: {
    'ja': 'お客様が検診・ナイトクラブに行きたい時、私たちに紹介',
    'zh-TW': '客戶想做體檢、想去夜總會，您推薦給我們',
    'zh-CN': '客户想做体检、想去夜总会，您推荐给我们',
    'en': 'Clients want checkups or clubs, you refer them to us',
  },
  step2Title: {
    'ja': '私たちがサービス提供',
    'zh-TW': '我們提供服務',
    'zh-CN': '我们提供服务',
    'en': 'We provide services',
  },
  step2Desc: {
    'ja': '新島交通が予約・受付・全サービスを担当',
    'zh-TW': '新島交通負責預約、接待、全程服務',
    'zh-CN': '新岛交通负责预约、接待、全程服务',
    'en': 'NIIJIMA handles booking, reception, full service',
  },
  step3Title: {
    'ja': '紹介報酬を受け取る',
    'zh-TW': '您收介紹報酬',
    'zh-CN': '您收介绍报酬',
    'en': 'You receive referral fees',
  },
  step3Desc: {
    'ja': 'お客様成約後、紹介報酬を受け取り、毎月精算',
    'zh-TW': '客戶成交後，您獲得介紹報酬，每月結算',
    'zh-CN': '客户成交后，您获得介绍报酬，每月结算',
    'en': 'After client conversion, get rewards, monthly settlement',
  },

  // Resources Section
  resourcesTitle: {
    'ja': '私たちのリソースは？',
    'zh-TW': '我們有什麼資源？',
    'zh-CN': '我们有什么资源？',
    'en': 'What Resources Do We Have?',
  },
  resourcesDesc: {
    'ja': 'これらは既に確保済みの提携、すぐに利用可能',
    'zh-TW': '這些都是我們已經談好的合作，您可以直接用',
    'zh-CN': '这些都是我们已经谈好的合作，您可以直接用',
    'en': 'These partnerships are ready, you can use directly',
  },

  // Resource 1: Nightclub
  resource1Badge: {
    'ja': 'ナイトクラブ',
    'zh-TW': '夜總會',
    'zh-CN': '夜总会',
    'en': 'Nightclub',
  },
  resource1Subtitle: {
    'ja': '全国 160+ 店舗',
    'zh-TW': '全日本 160+ 店舖',
    'zh-CN': '全日本 160+ 店铺',
    'en': 'Nationwide 160+ Venues',
  },
  resource1Title: {
    'ja': '高級ナイトクラブ予約',
    'zh-TW': '高級夜總會預約',
    'zh-CN': '高级夜总会预约',
    'en': 'Premium Nightclub Booking',
  },
  resource1Desc1: {
    'ja': '銀座、六本木、北新地、中洲……全国主要都市のトップクラブと提携。',
    'zh-TW': '銀座、六本木、北新地、中洲……全日本主要城市的頂級店舖，我們都有合作。',
    'zh-CN': '银座、六本木、北新地、中洲……全日本主要城市的顶级店铺，我们都有合作。',
    'en': 'Ginza, Roppongi, Kitashinchi, Nakasu... partnerships with top clubs in major cities across Japan.',
  },
  resource1Desc2: {
    'ja': 'お客様の希望店舗を教えてください、当日手配可能。',
    'zh-TW': '客戶想去哪家？您跟我們說，可當天安排。',
    'zh-CN': '客户想去哪家？您跟我们说，可当天安排。',
    'en': 'Tell us which venue, we can arrange same-day.',
  },
  city1: {
    'ja': '銀座',
    'zh-TW': '銀座',
    'zh-CN': '银座',
    'en': 'Ginza',
  },
  city2: {
    'ja': '六本木',
    'zh-TW': '六本木',
    'zh-CN': '六本木',
    'en': 'Roppongi',
  },
  city3: {
    'ja': '北新地',
    'zh-TW': '北新地',
    'zh-CN': '北新地',
    'en': 'Kitashinchi',
  },
  city4: {
    'ja': '中洲',
    'zh-TW': '中洲',
    'zh-CN': '中洲',
    'en': 'Nakasu',
  },
  citiesMore: {
    'ja': '+20都市',
    'zh-TW': '+20城市',
    'zh-CN': '+20城市',
    'en': '+20 Cities',
  },
  priceLabel: {
    'ja': '参考客単価',
    'zh-TW': '參考客單價',
    'zh-CN': '参考客单价',
    'en': 'Avg. Spending',
  },
  price1: {
    'ja': '30~150万',
    'zh-TW': '30~150萬',
    'zh-CN': '30~150万',
    'en': '¥300K-1.5M',
  },
  priceUnit: {
    'ja': '円',
    'zh-TW': '日元',
    'zh-CN': '日元',
    'en': 'JPY',
  },

  // Resource 2: Health Checkup
  resource2Badge: {
    'ja': '精密検診',
    'zh-TW': '精密體檢',
    'zh-CN': '精密健检',
    'en': 'Health Checkup',
  },
  resource2Subtitle: {
    'ja': '徳洲会 TIMC',
    'zh-TW': '德洲會 TIMC',
    'zh-CN': '德洲会 TIMC',
    'en': 'Tokushukai TIMC',
  },
  resource2Title: {
    'ja': 'TIMC 精密検診',
    'zh-TW': 'TIMC 精密體檢',
    'zh-CN': 'TIMC 精密健检',
    'en': 'TIMC Premium Checkup',
  },
  resource2Desc1: {
    'ja': '徳洲会医療グループ傘下の国際医療センター、大阪 JP Tower内。',
    'zh-TW': '德洲會醫療集團旗下的國際醫療中心，位於大阪 JP Tower。',
    'zh-CN': '德洲会医疗集团旗下的国际医疗中心，位于大阪 JP Tower。',
    'en': 'Tokushukai Medical Group\'s international center at Osaka JP Tower.',
  },
  resource2Desc2: {
    'ja': 'PET-CT、MRI、腫瘍スクリーニング完備。中国語通訳同行、レポート中国語作成。',
    'zh-TW': 'PET-CT、MRI、腫瘤篩查全套。中文翻譯全程陪同，報告中文出具。',
    'zh-CN': 'PET-CT、MRI、肿瘤筛查全套。中文翻译全程陪同，报告中文出具。',
    'en': 'Full PET-CT, MRI, tumor screening. Chinese interpreter, reports in Chinese.',
  },
  tag1: {
    'ja': 'PET-CT',
    'zh-TW': 'PET-CT',
    'zh-CN': 'PET-CT',
    'en': 'PET-CT',
  },
  tag2: {
    'ja': 'MRI',
    'zh-TW': 'MRI',
    'zh-CN': 'MRI',
    'en': 'MRI',
  },
  tag3: {
    'ja': '腫瘍スクリーニング',
    'zh-TW': '腫瘤篩查',
    'zh-CN': '肿瘤筛查',
    'en': 'Tumor Screening',
  },
  tag4: {
    'ja': '中国語通訳',
    'zh-TW': '中文翻譯',
    'zh-CN': '中文翻译',
    'en': 'Chinese Interpreter',
  },
  packagePriceLabel: {
    'ja': '参考パッケージ価格',
    'zh-TW': '參考套餐價格',
    'zh-CN': '参考套餐价格',
    'en': 'Package Price',
  },
  price2: {
    'ja': '50~200万',
    'zh-TW': '50~200萬',
    'zh-CN': '50~200万',
    'en': '¥500K-2M',
  },

  // Resource 3: Medical Services
  resource3Badge: {
    'ja': '総合医療',
    'zh-TW': '綜合醫療',
    'zh-CN': '综合医疗',
    'en': 'Medical Services',
  },
  resource3Subtitle: {
    'ja': '日本トップ医療リソース',
    'zh-TW': '日本頂尖醫療資源',
    'zh-CN': '日本顶尖医疗资源',
    'en': 'Top Japan Medical Resources',
  },
  resource3Title: {
    'ja': '総合医療サービス',
    'zh-TW': '綜合醫療服務',
    'zh-CN': '综合医疗服务',
    'en': 'Comprehensive Medical Services',
  },
  resource3Desc1: {
    'ja': '幹細胞治療、アンチエイジング、専門医紹介……',
    'zh-TW': '幹細胞治療、抗衰老療程、專科治療轉介……',
    'zh-CN': '干细胞治疗、抗衰老疗程、专科治疗转介……',
    'en': 'Stem cell therapy, anti-aging, specialist referrals...',
  },
  resource3Desc2: {
    'ja': '日本の医療リソース、私たちが橋渡しします。',
    'zh-TW': '日本的醫療資源，我們可以幫您對接。',
    'zh-CN': '日本的医疗资源，我们可以帮您对接。',
    'en': 'We connect you to Japan\'s medical resources.',
  },
  tag5: {
    'ja': '幹細胞',
    'zh-TW': '幹細胞',
    'zh-CN': '干细胞',
    'en': 'Stem Cell',
  },
  tag6: {
    'ja': 'アンチエイジング',
    'zh-TW': '抗衰老',
    'zh-CN': '抗衰老',
    'en': 'Anti-Aging',
  },
  tag7: {
    'ja': '専門医紹介',
    'zh-TW': '專科轉介',
    'zh-CN': '专科转介',
    'en': 'Specialist Referral',
  },
  treatmentPriceLabel: {
    'ja': '参考治療費用',
    'zh-TW': '參考治療費用',
    'zh-CN': '参考治疗费用',
    'en': 'Treatment Cost',
  },
  price3: {
    'ja': '100~500万',
    'zh-TW': '100~500萬',
    'zh-CN': '100~500万',
    'en': '¥1M-5M',
  },

  // Partnership Rules
  rulesTitle: {
    'ja': '提携ルール',
    'zh-TW': '合作規則',
    'zh-CN': '合作规则',
    'en': 'Partnership Rules',
  },
  rulesDesc: {
    'ja': 'シンプル・透明、裏はなし',
    'zh-TW': '簡單透明，沒有套路',
    'zh-CN': '简单透明，没有套路',
    'en': 'Simple, transparent, no tricks',
  },

  // Rule 1
  rule1Title: {
    'ja': '参加方法は？',
    'zh-TW': '如何加入？',
    'zh-CN': '如何加入？',
    'en': 'How to Join?',
  },
  rule1Item1: {
    'ja': '既存パートナーの紹介が必要',
    'zh-TW': '需要現有夥伴推薦',
    'zh-CN': '需要现有伙伴推荐',
    'en': 'Existing partner referral required',
  },
  rule1Item2: {
    'ja': 'WeChat連絡、紹介者を明記',
    'zh-TW': '微信聯繫客服，說明推薦人',
    'zh-CN': '微信联系客服，说明推荐人',
    'en': 'Contact via WeChat, mention referrer',
  },
  rule1Item3: {
    'ja': '審査通過後、アカウント開設',
    'zh-TW': '審核通過後開通帳號',
    'zh-CN': '审核通过后开通账号',
    'en': 'Account opened after approval',
  },

  // Rule 2
  rule2Title: {
    'ja': '報酬の計算方法は？',
    'zh-TW': '報酬怎麼算？',
    'zh-CN': '报酬怎么算？',
    'en': 'How Are Rewards Calculated?',
  },
  rule2Item1: {
    'ja': 'お客様紹介成功で報酬獲得',
    'zh-TW': '成功介紹客戶即獲報酬',
    'zh-CN': '成功介绍客户即获报酬',
    'en': 'Earn rewards for successful referrals',
  },
  rule2Item2: {
    'ja': '毎月15日に前月分精算',
    'zh-TW': '每月 15 日結算上月款項',
    'zh-CN': '每月 15 日结算上月款项',
    'en': 'Monthly settlement on the 15th',
  },
  rule2Item3: {
    'ja': 'WeChat、Alipay、銀行振込対応',
    'zh-TW': '支持微信、支付寶、銀行轉帳',
    'zh-CN': '支持微信、支付宝、银行转账',
    'en': 'WeChat, Alipay, bank transfer supported',
  },

  // Rule 3
  rule3Title: {
    'ja': 'ナイトクラブ予約ルール',
    'zh-TW': '夜總會預約規則',
    'zh-CN': '夜总会预约规则',
    'en': 'Nightclub Booking Rules',
  },
  rule3Item1: {
    'ja': '予約には500元（人民元）デポジット必要',
    'zh-TW': '預約需付 500 元人民幣訂金',
    'zh-CN': '预约需付 500 元人民币订金',
    'en': '¥500 RMB deposit required',
  },
  rule3Item2: {
    'ja': '当日キャンセルはデポジット返金なし',
    'zh-TW': '當天取消訂金不退',
    'zh-CN': '当天取消订金不退',
    'en': 'Same-day cancellation, no refund',
  },
  rule3Item3: {
    'ja': 'デポジットは最終消費から差し引き',
    'zh-TW': '訂金從最終消費中扣除',
    'zh-CN': '订金从最终消费中扣除',
    'en': 'Deposit deducted from final bill',
  },

  // Rule 4
  rule4Title: {
    'ja': 'サービス担当者は？',
    'zh-TW': '客戶服務由誰負責？',
    'zh-CN': '客户服务由谁负责？',
    'en': 'Who Handles Customer Service?',
  },
  rule4Item1: {
    'ja': '全サービスは新島交通が提供',
    'zh-TW': '所有服務由新島交通提供',
    'zh-CN': '所有服务由新岛交通提供',
    'en': 'All services provided by NIIJIMA',
  },
  rule4Item2: {
    'ja': '契約は新島交通とお客様の間で締結',
    'zh-TW': '合同與新島交通簽訂',
    'zh-CN': '合同与新岛交通签订',
    'en': 'Contract signed with NIIJIMA',
  },
  rule4Item3: {
    'ja': 'あなたは紹介担当、サービスは新島交通が全責任',
    'zh-TW': '您負責介紹，服務由新島交通全權負責',
    'zh-CN': '您负责介绍，服务由新岛交通全权负责',
    'en': 'You introduce, NIIJIMA handles services',
  },

  // Brand Website Section
  brandSectionBadge: {
    'ja': 'オプション付加価値サービス',
    'zh-TW': '可選增值服務',
    'zh-CN': '可选增值服务',
    'en': 'Optional Value-Added Service',
  },
  brandSectionTitle: {
    'ja': 'あなたのブランドで展示するサイトが欲しい？',
    'zh-TW': '想要一個以您品牌展示的網站？',
    'zh-CN': '想要一个以您品牌展示的网站？',
    'en': 'Want a website with your brand?',
  },
  brandSectionDesc1: {
    'ja': '専用サイトを開設可能、あなたのブランドでサービス展示。',
    'zh-TW': '我們可以為您開通一個專屬網站，以您的品牌展示服務。',
    'zh-CN': '我们可以为您开通一个专属网站，以您的品牌展示服务。',
    'en': 'We can create a dedicated site with your brand.',
  },
  brandSectionDesc2: {
    'ja': 'お客様があなたのサイトから相談・注文、システムが自動追跡。',
    'zh-TW': '客戶通過您的網站諮詢下單，系統自動追蹤至您的帳戶。',
    'zh-CN': '客户通过您的网站咨询下单，系统自动追踪至您的账户。',
    'en': 'Clients inquire via your site, auto-tracked to your account.',
  },
  brandFeature1: {
    'ja': 'yourname.niijima-koutsu.jp 専用ドメイン',
    'zh-TW': 'yourname.niijima-koutsu.jp 專屬域名',
    'zh-CN': 'yourname.niijima-koutsu.jp 专属域名',
    'en': 'yourname.niijima-koutsu.jp custom domain',
  },
  brandFeature2: {
    'ja': '検診・ナイトクラブ・医療サービスをワンクリック掲載',
    'zh-TW': '體檢、夜總會、醫療服務一鍵上架',
    'zh-CN': '体检、夜总会、医疗服务一键上架',
    'en': 'One-click listing for checkups, clubs, medical',
  },
  brandFeature3: {
    'ja': 'お客様オンライン相談、注文自動追跡',
    'zh-TW': '客戶在線諮詢，訂單自動追蹤',
    'zh-CN': '客户在线咨询，订单自动追踪',
    'en': 'Client online inquiries, auto order tracking',
  },
  brandFeature4: {
    'ja': '技術知識不要、即時開設',
    'zh-TW': '無需技術背景，快速開通',
    'zh-CN': '无需技术背景，快速开通',
    'en': 'No tech skills needed, quick setup',
  },
  brandFeature5: {
    'ja': 'サイト下部に新島交通をサービス提供者として表示',
    'zh-TW': '網站底部顯示新島交通為服務提供者',
    'zh-CN': '网站底部显示新岛交通为服务提供者',
    'en': 'NIIJIMA shown as service provider at footer',
  },
  brandPrice: {
    'ja': '¥1,980',
    'zh-TW': '¥1,980',
    'zh-CN': '¥1,980',
    'en': '¥1,980',
  },
  brandPriceUnit: {
    'ja': '/月（約100元人民元）',
    'zh-TW': '/月（約 100 元人民幣）',
    'zh-CN': '/月（约 100 元人民币）',
    'en': '/month (≈ $14 USD)',
  },
  btnConsult: {
    'ja': '相談・開設',
    'zh-TW': '諮詢開通',
    'zh-CN': '咨询开通',
    'en': 'Consult & Setup',
  },
  previewLabel: {
    'ja': '実際の表示例',
    'zh-TW': '實際效果預覽',
    'zh-CN': '实际效果预览',
    'en': 'Preview Example',
  },
  previewLogoText: {
    'ja': 'あなたのブランドロゴ',
    'zh-TW': '您的品牌 Logo',
    'zh-CN': '您的品牌 Logo',
    'en': 'Your Brand Logo',
  },
  previewBrandName: {
    'ja': 'あなたのブランド名',
    'zh-TW': '您的品牌名稱',
    'zh-CN': '您的品牌名称',
    'en': 'Your Brand Name',
  },
  previewTagline: {
    'ja': '精密検診 · 高級ナイトクラブ · 医療サービス',
    'zh-TW': '精密體檢 · 高級夜總會 · 醫療服務',
    'zh-CN': '精密健检 · 高级夜总会 · 医疗服务',
    'en': 'Health Checkup · Luxury Clubs · Medical',
  },
  viewDemo: {
    'ja': 'オンライン例を見る →',
    'zh-TW': '查看線上示例 →',
    'zh-CN': '查看线上示例 →',
    'en': 'View Live Demo →',
  },

  // CTA Section
  ctaTitle: {
    'ja': '興味がありますか？WeChat連絡',
    'zh-TW': '有興趣？微信聯繫我們',
    'zh-CN': '有兴趣？微信联系我们',
    'en': 'Interested? Contact via WeChat',
  },
  ctaDesc: {
    'ja': '明記してください：パートナー申請 + お名前 + 紹介者',
    'zh-TW': '請注明：提攜夥伴申請 + 您的姓名 + 推薦人',
    'zh-CN': '请注明：合作伙伴申请 + 您的姓名 + 推荐人',
    'en': 'Please note: Partner Application + Your Name + Referrer',
  },
  btnWechatQR: {
    'ja': 'WeChat QRコードスキャン',
    'zh-TW': '微信掃碼申請',
    'zh-CN': '微信扫码申请',
    'en': 'WeChat QR Code',
  },
  ctaEmailLabel: {
    'ja': 'またはメール：',
    'zh-TW': '或郵件：',
    'zh-CN': '或邮件：',
    'en': 'Or email:',
  },

  // Legal Section
  legalTitle: {
    'ja': '法的声明',
    'zh-TW': '法律聲明',
    'zh-CN': '法律声明',
    'en': 'Legal Notice',
  },
  legalText: {
    'ja': '本プログラムのすべての旅行サービスは新島交通株式会社が提供。パートナーの役割は「お客様紹介者」、潜在顧客へのサービス紹介を担当。すべての旅行契約は新島交通とお客様の間で締結。パートナーが得る報酬は「紹介手数料」の性質。',
    'zh-TW': '本計劃所有旅行服務均由新島交通株式會社提供。提攜夥伴的角色為「客戶介紹者」，負責向潛在客戶介紹服務。所有旅行服務合同在新島交通與客戶之間簽訂。提攜夥伴獲得的報酬性質為「紹介手数料」（介紹費）。',
    'zh-CN': '本计划所有旅行服务均由新岛交通株式会社提供。合作伙伴的角色为「客户介绍者」，负责向潜在客户介绍服务。所有旅行服务合同在新岛交通与客户之间签订。合作伙伴获得的报酬性质为「介绍费」。',
    'en': 'All travel services in this program are provided by Niijima Kotsu Co., Ltd. Partners act as "client introducers" responsible for referring services. All travel contracts are signed between NIIJIMA and clients. Partner compensation is in the nature of "referral fees".',
  },
  legalFooter: {
    'ja': '新島交通株式会社 ｜ 大阪府知事登録旅行業 第2-3115号 ｜ JATA正会員',
    'zh-TW': '新島交通株式會社 ｜ 大阪府知事登錄旅行業 第2-3115號 ｜ JATA正會員',
    'zh-CN': '新岛交通株式会社 ｜ 大阪府知事登录旅行业 第2-3115号 ｜ JATA正会员',
    'en': 'Niijima Kotsu Co., Ltd. | Osaka Gov. License No. 2-3115 | JATA Member',
  },

  // Footer
  footerCompany: {
    'ja': '新島交通株式会社',
    'zh-TW': '新島交通株式會社',
    'zh-CN': '新岛交通株式会社',
    'en': 'Niijima Kotsu Co., Ltd.',
  },
  footerAddress: {
    'ja': '〒556-0014 大阪府大阪市浪速区大国1-2-21-602',
    'zh-TW': '〒556-0014 大阪府大阪市浪速区大国1-2-21-602',
    'zh-CN': '〒556-0014 大阪府大阪市浪速区大国1-2-21-602',
    'en': '〒556-0014 1-2-21-602 Daikoku, Naniwa-ku, Osaka, Japan',
  },
  footerLicense: {
    'ja': '大阪府知事登録旅行業 第2-3115号',
    'zh-TW': '大阪府知事登錄旅行業 第2-3115號',
    'zh-CN': '大阪府知事登录旅行业 第2-3115号',
    'en': 'Osaka Gov. License No. 2-3115',
  },
  footerJATA: {
    'ja': '一般社団法人 日本旅行業協会（JATA）正会員',
    'zh-TW': '一般社團法人 日本旅行業協會（JATA）正會員',
    'zh-CN': '一般社团法人 日本旅行业协会（JATA）正会员',
    'en': 'JATA (Japan Association of Travel Agents) Member',
  },
  footerTokushoho: {
    'ja': '特定商取引法',
    'zh-TW': '特定商取引法',
    'zh-CN': '特定商取引法',
    'en': 'Tokushoho',
  },
  footerPrivacy: {
    'ja': 'プライバシーポリシー',
    'zh-TW': '隱私政策',
    'zh-CN': '隐私政策',
    'en': 'Privacy Policy',
  },
  footerTerms: {
    'ja': '利用規約',
    'zh-TW': '利用規約',
    'zh-CN': '利用规约',
    'en': 'Terms',
  },
  footerCopyright: {
    'ja': '新島交通株式会社',
    'zh-TW': '新島交通株式會社',
    'zh-CN': '新岛交通株式会社',
    'en': 'Niijima Kotsu Co., Ltd.',
  },

  // WeChat QR Modal
  modalTitle: {
    'ja': 'WeChat QRコードスキャン申請',
    'zh-TW': '微信掃碼申請',
    'zh-CN': '微信扫码申请',
    'en': 'WeChat QR Code Application',
  },
  modalDesc: {
    'ja': 'QRコードスキャンでカスタマーサービスWeChat追加',
    'zh-TW': '掃碼添加客服微信',
    'zh-CN': '扫码添加客服微信',
    'en': 'Scan to add customer service WeChat',
  },
  modalNoteTitle: {
    'ja': '申請時に明記してください：',
    'zh-TW': '申請時請注明：',
    'zh-CN': '申请时请注明：',
    'en': 'Please note when applying:',
  },
  modalNoteText: {
    'ja': 'パートナー申請 + お名前 + 紹介者',
    'zh-TW': '提攜夥伴申請 + 您的姓名 + 推薦人',
    'zh-CN': '合作伙伴申请 + 您的姓名 + 推荐人',
    'en': 'Partner Application + Your Name + Referrer',
  },

  // Aria Labels
  ariaWechatApply: {
    'ja': 'WeChat QRコードを開いて申請',
    'zh-TW': '打開微信二維碼申請加入',
    'zh-CN': '打开微信二维码申请加入',
    'en': 'Open WeChat QR code to apply',
  },
  ariaWechatConsult: {
    'ja': 'WeChat QRコードを開いてブランドサイト開設相談',
    'zh-TW': '打開微信二維碼諮詢開通品牌網站',
    'zh-CN': '打开微信二维码咨询开通品牌网站',
    'en': 'Open WeChat QR code to consult brand site',
  },
  ariaWechatPartner: {
    'ja': 'WeChat QRコードを開いてパートナー申請',
    'zh-TW': '打開微信二維碼申請成為提攜夥伴',
    'zh-CN': '打开微信二维码申请成为合作伙伴',
    'en': 'Open WeChat QR code to become partner',
  },
  ariaCloseModal: {
    'ja': 'WeChat QRコードポップアップを閉じる',
    'zh-TW': '關閉微信二維碼彈窗',
    'zh-CN': '关闭微信二维码弹窗',
    'en': 'Close WeChat QR code popup',
  },
  ariaLearnHow: {
    'ja': '仕組みセクションへスクロール',
    'zh-TW': '滾動到運作方式區域',
    'zh-CN': '滚动到运作方式区域',
    'en': 'Scroll to how it works section',
  },
  ariaViewDemo: {
    'ja': 'デモサイトを新しいタブで開く',
    'zh-TW': '在新分頁開啟示例網站',
    'zh-CN': '在新标签页打开示例网站',
    'en': 'Open demo site in new tab',
  },
  ariaTokushoho: {
    'ja': '特定商取引法ページへ移動',
    'zh-TW': '前往特定商取引法頁面',
    'zh-CN': '前往特定商取引法页面',
    'en': 'Go to Commercial Transactions Act page',
  },
  ariaPrivacy: {
    'ja': 'プライバシーポリシーページへ移動',
    'zh-TW': '前往隱私政策頁面',
    'zh-CN': '前往隐私政策页面',
    'en': 'Go to Privacy Policy page',
  },
  ariaTerms: {
    'ja': '利用規約ページへ移動',
    'zh-TW': '前往使用條款頁面',
    'zh-CN': '前往使用条款页面',
    'en': 'Go to Terms of Service page',
  },
};

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'zh-TW';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
      return value as Language;
    }
  }
  const browserLang = navigator.language;
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') return 'zh-TW';
  if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) return 'zh-CN';
  if (browserLang.startsWith('en')) return 'en';
  return 'zh-TW';
}

export default function GuidePartnerPage() {
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW');
  const [showWechatQR, setShowWechatQR] = useState(false);

  useEffect(() => {
    setCurrentLang(getInitialLang());
  }, []);

  const t = (key: keyof typeof pageTranslations) => {
    return pageTranslations[key][currentLang];
  };

  return (
    <PublicLayout showFooter={false} activeNav="partner">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#1a1a2e]/85 to-[#1a1a2e]/70"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32">
          <p className="text-amber-400 text-sm font-medium mb-4 tracking-wide">
            {t('heroTagline')}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {t('heroTitle1')}<br />
            <span className="text-amber-400">{t('heroTitle2')}</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-10">
            {t('heroDesc')}<br />
            {t('heroDesc2')}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowWechatQR(true)}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-4 rounded transition-colors"
              aria-label={t('ariaWechatApply')}
            >
              {t('btnWechatApply')}
            </button>
            <a
              href="#how-it-works"
              className="border border-gray-600 hover:border-gray-400 text-white px-8 py-4 rounded transition-colors"
              aria-label={t('ariaLearnHow')}
            >
              {t('btnLearnHow')}
            </a>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">01</div>
              <h3 className="font-bold text-gray-900 mb-2">{t('step1Title')}</h3>
              <p className="text-gray-500 text-sm">{t('step1Desc')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">02</div>
              <h3 className="font-bold text-gray-900 mb-2">{t('step2Title')}</h3>
              <p className="text-gray-500 text-sm">{t('step2Desc')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">03</div>
              <h3 className="font-bold text-gray-900 mb-2">{t('step3Title')}</h3>
              <p className="text-gray-500 text-sm">{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('resourcesTitle')}</h2>
          <p className="text-gray-500 mb-12">{t('resourcesDesc')}</p>

          <div className="space-y-6">
            {/* Nightclub */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded">{t('resource1Badge')}</span>
                    <span className="text-gray-400 text-sm">{t('resource1Subtitle')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('resource1Title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {t('resource1Desc1')}<br />
                    {t('resource1Desc2')}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('city1')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('city2')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('city3')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('city4')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('citiesMore')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{t('priceLabel')}</p>
                  <p className="text-2xl font-bold text-gray-900">{t('price1')}<span className="text-sm font-normal text-gray-500">{t('priceUnit')}</span></p>
                </div>
              </div>
            </div>

            {/* Health Checkup */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded">{t('resource2Badge')}</span>
                    <span className="text-gray-400 text-sm">{t('resource2Subtitle')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('resource2Title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {t('resource2Desc1')}<br />
                    {t('resource2Desc2')}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('tag1')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('tag2')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('tag3')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('tag4')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{t('packagePriceLabel')}</p>
                  <p className="text-2xl font-bold text-gray-900">{t('price2')}<span className="text-sm font-normal text-gray-500">{t('priceUnit')}</span></p>
                </div>
              </div>
            </div>

            {/* Medical Services */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">{t('resource3Badge')}</span>
                    <span className="text-gray-400 text-sm">{t('resource3Subtitle')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('resource3Title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {t('resource3Desc1')}<br />
                    {t('resource3Desc2')}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('tag5')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('tag6')}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('tag7')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{t('treatmentPriceLabel')}</p>
                  <p className="text-2xl font-bold text-gray-900">{t('price3')}<span className="text-sm font-normal text-gray-500">{t('priceUnit')}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Rules */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('rulesTitle')}</h2>
          <p className="text-gray-500 mb-12">{t('rulesDesc')}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">{t('rule1Title')}</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule1Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule1Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule1Item3')}</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">{t('rule2Title')}</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule2Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule2Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule2Item3')}</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">{t('rule3Title')}</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule3Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule3Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule3Item3')}</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">{t('rule4Title')}</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule4Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule4Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{t('rule4Item3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Website */}
      <section className="bg-[#1a1a2e] text-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="md:flex md:items-center md:gap-12">
            <div className="flex-1 mb-10 md:mb-0">
              <p className="text-amber-400 text-sm font-medium mb-4">{t('brandSectionBadge')}</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t('brandSectionTitle')}
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                {t('brandSectionDesc1')}<br />
                {t('brandSectionDesc2')}
              </p>
              <ul className="space-y-3 text-gray-300 text-sm mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  {t('brandFeature1')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  {t('brandFeature2')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  {t('brandFeature3')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  {t('brandFeature4')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  {t('brandFeature5')}
                </li>
              </ul>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-amber-400">{t('brandPrice')}</span>
                <span className="text-gray-500">{t('brandPriceUnit')}</span>
              </div>
              <button
                onClick={() => setShowWechatQR(true)}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded transition-colors"
                aria-label={t('ariaWechatConsult')}
              >
                {t('btnConsult')}
              </button>
            </div>
            <div className="flex-1">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-4">{t('previewLabel')}</p>
                <div className="bg-gray-900 rounded p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-500 text-xs ml-2">demo.niijima-koutsu.jp</span>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">{t('previewLogoText')}</p>
                    <p className="text-white font-bold text-xl my-4">{t('previewBrandName')}</p>
                    <p className="text-gray-500 text-xs">{t('previewTagline')}</p>
                  </div>
                </div>
                <Link
                  href="/guide-partner/demo"
                  target="_blank"
                  className="block text-center text-amber-400 text-sm mt-4 hover:underline"
                  aria-label={t('ariaViewDemo')}
                >
                  {t('viewDemo')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-black/70 mb-8">
            {t('ctaDesc')}
          </p>
          <button
            onClick={() => setShowWechatQR(true)}
            className="bg-black hover:bg-gray-900 text-white font-bold px-10 py-4 rounded transition-colors inline-flex items-center gap-3"
            aria-label={t('ariaWechatPartner')}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
            </svg>
            {t('btnWechatQR')}
          </button>
          <p className="text-black/60 text-sm mt-4">
            {t('ctaEmailLabel')} <a href="mailto:haoyuan@niijima-koutsu.jp" className="underline">haoyuan@niijima-koutsu.jp</a>
          </p>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">{t('legalTitle')}</h3>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                {t('legalText')}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              {t('legalFooter')}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="md:flex md:justify-between md:items-start">
            <div className="mb-8 md:mb-0">
              <h4 className="font-bold text-lg mb-4">{t('footerCompany')}</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin size={14} />
                  {t('footerAddress')}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  06-6632-8807
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} />
                  info@niijima-koutsu.jp
                </p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              <p>{t('footerLicense')}</p>
              <p>{t('footerJATA')}</p>
              <div className="mt-4 flex gap-4">
                <Link href="/legal/tokushoho" className="hover:text-white transition" aria-label={t('ariaTokushoho')}>{t('footerTokushoho')}</Link>
                <Link href="/legal/privacy" className="hover:text-white transition" aria-label={t('ariaPrivacy')}>{t('footerPrivacy')}</Link>
                <Link href="/legal/terms" className="hover:text-white transition" aria-label={t('ariaTerms')}>{t('footerTerms')}</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
            <p>© {new Date().getFullYear()} {t('footerCopyright')}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* WeChat QR Modal */}
      {showWechatQR && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowWechatQR(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wechat-modal-title"
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="wechat-modal-title" className="font-bold text-lg text-gray-900">{t('modalTitle')}</h3>
              <button
                onClick={() => setShowWechatQR(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label={t('ariaCloseModal')}
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
              <img
                src={WECHAT_QR_URL}
                alt="WeChat QR Code"
                className="w-56 h-56 object-contain"
              />
            </div>

            <p className="text-center text-gray-600 mt-4 text-sm">
              {t('modalDesc')}
            </p>

            <div className="mt-4 bg-amber-50 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium mb-1">{t('modalNoteTitle')}</p>
              <p>{t('modalNoteText')}</p>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
