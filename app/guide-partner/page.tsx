'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import {
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
    'ja': '紹介手数料をお支払いします',
    'zh-TW': '我們支付介紹手續費',
    'zh-CN': '我们支付介绍手续费',
    'en': 'We pay referral fees',
  },
  heroDesc: {
    'ja': '精密検診・医療ツーリズムをはじめ、各種日本旅行手配が可能です。',
    'zh-TW': '精密體檢、醫療旅遊等日本旅行服務，我們均可安排。',
    'zh-CN': '精密健检、医疗旅游等日本旅行服务，我们均可安排。',
    'en': 'We arrange Japan travel services including precision health checkups and medical tourism.',
  },
  heroDesc2: {
    'ja': 'お客様をご紹介ください。サービスはすべて新島交通が責任を持って提供します。',
    'zh-TW': '請將客戶介紹給我們。所有服務由新島交通全權負責提供。',
    'zh-CN': '请将客户介绍给我们。所有服务由新岛交通全权负责提供。',
    'en': 'Refer clients to us. All services are provided by Niijima Kotsu with full responsibility.',
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
    'ja': 'お客様が検診・医療サービスに関心をお持ちの場合、新島交通をご紹介ください',
    'zh-TW': '客戶對體檢、醫療服務有需求時，請將新島交通介紹給客戶',
    'zh-CN': '客户对体检、医疗服务有需求时，请将新岛交通介绍给客户',
    'en': 'When clients are interested in checkups or medical services, introduce Niijima Kotsu',
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
    'ja': 'お客様が旅行サービスをご成約後、紹介手数料をお支払い（毎月精算・銀行振込）',
    'zh-TW': '客戶成功購買旅行服務後，我們支付介紹手續費（每月結算・銀行匯款）',
    'zh-CN': '客户成功购买旅行服务后，我们支付介绍手续费（每月结算・银行汇款）',
    'en': 'After client purchases travel services, we pay referral fees (monthly, bank transfer)',
  },

  // Resources Section
  resourcesTitle: {
    'ja': '私たちのリソースは？',
    'zh-TW': '我們有什麼資源？',
    'zh-CN': '我们有什么资源？',
    'en': 'What Resources Do We Have?',
  },
  resourcesDesc: {
    'ja': '新島交通が提供する旅行サービスの一覧です',
    'zh-TW': '以下為新島交通提供的旅行服務',
    'zh-CN': '以下为新岛交通提供的旅行服务',
    'en': 'Travel services provided by Niijima Kotsu',
  },

  // Resource 1: Nightclub
  resource1Badge: {
    'ja': '娯楽手配',
    'zh-TW': '娛樂安排',
    'zh-CN': '娱乐安排',
    'en': 'Entertainment',
  },
  resource1Subtitle: {
    'ja': '新島交通が直接手配',
    'zh-TW': '新島交通直接安排',
    'zh-CN': '新岛交通直接安排',
    'en': 'Arranged directly by NIIJIMA',
  },
  resource1Title: {
    'ja': '娯楽施設手配サービス',
    'zh-TW': '娛樂設施安排服務',
    'zh-CN': '娱乐设施安排服务',
    'en': 'Entertainment Venue Arrangement',
  },
  resource1Desc1: {
    'ja': '銀座、六本木、北新地、中洲など全国主要都市の娯楽施設を新島交通が旅行業の一環として手配。',
    'zh-TW': '銀座、六本木、北新地、中洲等日本主要城市的娛樂設施，由新島交通作為旅行業務的一環進行安排。',
    'zh-CN': '银座、六本木、北新地、中洲等日本主要城市的娱乐设施，由新岛交通作为旅行业务的一环进行安排。',
    'en': 'Entertainment venues in major cities including Ginza, Roppongi, Kitashinchi, Nakasu — arranged by NIIJIMA as part of travel services.',
  },
  resource1Desc2: {
    'ja': '※ 本サービスは新島交通が旅行手配として直接提供するものであり、紹介手数料の対象外です。',
    'zh-TW': '※ 本服務由新島交通作為旅行安排直接提供，不屬於介紹手續費適用範圍。',
    'zh-CN': '※ 本服务由新岛交通作为旅行安排直接提供，不属于介绍手续费适用范围。',
    'en': '※ This service is provided directly by NIIJIMA as travel arrangement and is NOT eligible for referral fees.',
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
    'ja': '',
    'zh-TW': '',
    'zh-CN': '',
    'en': '',
  },
  price1: {
    'ja': '',
    'zh-TW': '',
    'zh-CN': '',
    'en': '',
  },
  priceUnit: {
    'ja': '',
    'zh-TW': '',
    'zh-CN': '',
    'en': '',
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
    'zh-TW': '德州會 TIMC',
    'zh-CN': '德州会 TIMC',
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
    'zh-TW': '德州會醫療集團旗下的國際醫療中心，位於大阪 JP Tower。',
    'zh-CN': '德州会医疗集团旗下的国际医疗中心，位于大阪 JP Tower。',
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
    'ja': '日本の医療機関と連携',
    'zh-TW': '與日本醫療機構合作',
    'zh-CN': '与日本医疗机构合作',
    'en': 'Partnered with Japanese Medical Institutions',
  },
  resource3Title: {
    'ja': '医療ツーリズム手配',
    'zh-TW': '醫療旅遊安排',
    'zh-CN': '医疗旅游安排',
    'en': 'Medical Tourism Arrangement',
  },
  resource3Desc1: {
    'ja': '専門医への受診手配、病院コーディネートなど、医療ツーリズムに関する旅行手配を承ります。',
    'zh-TW': '專科就診安排、醫院協調等，我們提供醫療旅遊相關的旅行安排服務。',
    'zh-CN': '专科就诊安排、医院协调等，我们提供医疗旅游相关的旅行安排服务。',
    'en': 'We arrange medical tourism travel services including specialist visit coordination and hospital arrangements.',
  },
  resource3Desc2: {
    'ja': '※ 新島交通は旅行手配のみを行い、医療行為・医療助言は一切行いません。治療の判断は医療機関が行います。',
    'zh-TW': '※ 新島交通僅提供旅行安排，不進行任何醫療行為或醫療建議。治療決定由醫療機構作出。',
    'zh-CN': '※ 新岛交通仅提供旅行安排，不进行任何医疗行为或医疗建议。治疗决定由医疗机构作出。',
    'en': '※ NIIJIMA provides travel arrangement only. We do not perform medical acts or give medical advice. Treatment decisions are made by medical institutions.',
  },
  tag5: {
    'ja': '受診手配',
    'zh-TW': '就診安排',
    'zh-CN': '就诊安排',
    'en': 'Visit Arrangement',
  },
  tag6: {
    'ja': '通訳手配',
    'zh-TW': '翻譯安排',
    'zh-CN': '翻译安排',
    'en': 'Interpreter Arrangement',
  },
  tag7: {
    'ja': '病院コーディネート',
    'zh-TW': '醫院協調',
    'zh-CN': '医院协调',
    'en': 'Hospital Coordination',
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
    'ja': 'お客様が旅行サービスをご成約後、紹介手数料をお支払い',
    'zh-TW': '客戶購買旅行服務後，我們支付介紹手續費',
    'zh-CN': '客户购买旅行服务后，我们支付介绍手续费',
    'en': 'Referral fees paid after client purchases travel services',
  },
  rule2Item2: {
    'ja': '毎月15日に前月分を銀行振込で精算',
    'zh-TW': '每月 15 日透過銀行匯款結算上月款項',
    'zh-CN': '每月 15 日通过银行汇款结算上月款项',
    'en': 'Monthly bank transfer settlement on the 15th',
  },
  rule2Item3: {
    'ja': '源泉徴収の処理が必要（支払調書を発行します）',
    'zh-TW': '需依法進行扣繳處理（我們將開具支付憑證）',
    'zh-CN': '需依法进行扣缴处理（我们将开具支付凭证）',
    'en': 'Withholding tax processing required (payment certificate issued)',
  },

  // Rule 3
  rule3Title: {
    'ja': '紹介者の責任範囲',
    'zh-TW': '介紹人的責任範圍',
    'zh-CN': '介绍人的责任范围',
    'en': 'Scope of Introducer Role',
  },
  rule3Item1: {
    'ja': '紹介者はお客様を新島交通に紹介するのみ。サービスの説明・契約・代金収受は行わないでください',
    'zh-TW': '介紹人僅需將客戶介紹給新島交通。請勿代為說明服務內容、簽約或收取費用',
    'zh-CN': '介绍人仅需将客户介绍给新岛交通。请勿代为说明服务内容、签约或收取费用',
    'en': 'Introducers only refer clients to NIIJIMA. Do not explain services, sign contracts, or collect payments on our behalf',
  },
  rule3Item2: {
    'ja': '医療サービスに関する医学的助言をお客様に行わないでください',
    'zh-TW': '請勿向客戶提供任何醫療建議',
    'zh-CN': '请勿向客户提供任何医疗建议',
    'en': 'Do not provide any medical advice to clients',
  },
  rule3Item3: {
    'ja': '虚偽や誇大な説明でサービスを推奨することは禁止です',
    'zh-TW': '禁止以虛假或誇大方式推薦服務',
    'zh-CN': '禁止以虚假或夸大方式推荐服务',
    'en': 'False or exaggerated service promotion is prohibited',
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
    'ja': '検診・医療ツーリズムサービスをワンクリック掲載',
    'zh-TW': '體檢、醫療旅遊服務一鍵上架',
    'zh-CN': '体检、医疗旅游服务一键上架',
    'en': 'One-click listing for checkups and medical tourism',
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
    'ja': '精密検診 · 医療ツーリズム · 旅行手配',
    'zh-TW': '精密體檢 · 醫療旅遊 · 旅行安排',
    'zh-CN': '精密健检 · 医疗旅游 · 旅行安排',
    'en': 'Health Checkup · Medical Tourism · Travel Arrangement',
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
    'ja': '1. 本プログラムのすべての旅行サービスは、大阪府知事登録旅行業者である新島交通株式会社が提供します。2. パートナーの役割は「お客様紹介者」に限定され、サービスの説明、契約締結、代金収受等の旅行業務を行うことはできません（旅行業法第3条）。3. すべての旅行契約は新島交通とお客様の間で直接締結されます。4. 紹介手数料は銀行振込で支払われ、所得税法に基づく源泉徴収の対象となります。5. 娯楽施設の手配は新島交通が旅行業の一環として直接行うものであり、紹介手数料の対象外です。6. 医療サービスに関して、パートナーが医学的助言を行うことは禁止されています。新島交通は旅行手配のみを行い、医療行為は一切行いません（医療法第17条）。7. 本プログラムは多段階報酬制度（いわゆるマルチ商法）ではありません。',
    'zh-TW': '1. 本計劃所有旅行服務均由持有大阪府知事登錄旅行業執照的新島交通株式會社提供。2. 合作夥伴的角色僅限於「客戶介紹者」，不得從事服務說明、簽約、代收款等旅行業務（旅行業法第3條）。3. 所有旅行服務合同由新島交通與客戶直接簽訂。4. 介紹手續費通過銀行匯款支付，依所得稅法進行源泉扣繳。5. 娛樂設施安排由新島交通作為旅行業務直接辦理，不屬於介紹手續費適用範圍。6. 關於醫療服務，合作夥伴不得向客戶提供任何醫療建議。新島交通僅提供旅行安排，不進行任何醫療行為（醫療法第17條）。7. 本計劃不是多層次傳銷制度。',
    'zh-CN': '1. 本计划所有旅行服务均由持有大阪府知事登录旅行业执照的新岛交通株式会社提供。2. 合作伙伴的角色仅限于「客户介绍者」，不得从事服务说明、签约、代收款等旅行业务（旅行业法第3条）。3. 所有旅行服务合同由新岛交通与客户直接签订。4. 介绍手续费通过银行汇款支付，依所得税法进行源泉扣缴。5. 娱乐设施安排由新岛交通作为旅行业务直接办理，不属于介绍手续费适用范围。6. 关于医疗服务，合作伙伴不得向客户提供任何医疗建议。新岛交通仅提供旅行安排，不进行任何医疗行为（医疗法第17条）。7. 本计划不是多层次传销制度。',
    'en': '1. All travel services are provided by Niijima Kotsu Co., Ltd., a licensed travel operator (Osaka Gov. License No. 2-3115). 2. Partners are limited to the role of "client introducer" and may not engage in service explanation, contract signing, or payment collection (Travel Business Act Art. 3). 3. All travel contracts are signed directly between NIIJIMA and clients. 4. Referral fees are paid via bank transfer and subject to withholding tax. 5. Entertainment venue arrangements are handled directly by NIIJIMA as travel services and are NOT eligible for referral fees. 6. Partners must not provide medical advice. NIIJIMA provides travel arrangement only and does not perform medical acts (Medical Practitioners Act Art. 17). 7. This program is not a multi-level marketing scheme.',
  },
  legalFooter: {
    'ja': '新島交通株式会社 ｜ 大阪府知事登録旅行業 第2-3115号 ｜ JATA正会員',
    'zh-TW': '新島交通株式會社 ｜ 大阪府知事登錄旅行業 第2-3115號 ｜ JATA正會員',
    'zh-CN': '新岛交通株式会社 ｜ 大阪府知事登录旅行业 第2-3115号 ｜ JATA正会员',
    'en': 'Niijima Kotsu Co., Ltd. | Osaka Gov. License No. 2-3115 | JATA Member',
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
    <PublicLayout showFooter={true} activeNav="partner">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-brand-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop"
            alt="Guide Partner"
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={75}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/85 to-brand-900/70"></div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
          <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400"></div>
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">{t('heroTagline')}</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
              {t('heroTitle1')}
              <br />
              <span className="text-gold-400">{t('heroTitle2')}</span>
            </h1>

            <p className="text-xl text-neutral-300 mb-8 leading-relaxed font-light max-w-2xl">
              {t('heroDesc')}<br />
              {t('heroDesc2')}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowWechatQR(true)}
                className="inline-flex items-center px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium tracking-wider hover:bg-gold-300 transition-colors"
                aria-label={t('ariaWechatApply')}
              >
                {t('btnWechatApply')}
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm tracking-wider hover:bg-white/20 transition-colors"
                aria-label={t('ariaLearnHow')}
              >
                {t('btnLearnHow')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="bg-white py-16 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">01</div>
              <h3 className="font-bold text-brand-900 mb-2">{t('step1Title')}</h3>
              <p className="text-neutral-500 text-sm">{t('step1Desc')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">02</div>
              <h3 className="font-bold text-brand-900 mb-2">{t('step2Title')}</h3>
              <p className="text-neutral-500 text-sm">{t('step2Desc')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">03</div>
              <h3 className="font-bold text-brand-900 mb-2">{t('step3Title')}</h3>
              <p className="text-neutral-500 text-sm">{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="how-it-works" className="bg-neutral-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-serif text-brand-900 mb-2">{t('resourcesTitle')}</h2>
          <p className="text-neutral-500 mb-12">{t('resourcesDesc')}</p>

          <div className="space-y-6">
            {/* Nightclub */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-neutral-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded">{t('resource1Badge')}</span>
                    <span className="text-neutral-400 text-sm">{t('resource1Subtitle')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-2">{t('resource1Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {t('resource1Desc1')}<br />
                    {t('resource1Desc2')}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('city1')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('city2')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('city3')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('city4')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('citiesMore')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-neutral-400 text-sm">{t('priceLabel')}</p>
                  <p className="text-2xl font-bold text-brand-900">{t('price1')}<span className="text-sm font-normal text-neutral-500">{t('priceUnit')}</span></p>
                </div>
              </div>
            </div>

            {/* Health Checkup */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-neutral-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded">{t('resource2Badge')}</span>
                    <span className="text-neutral-400 text-sm">{t('resource2Subtitle')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-2">{t('resource2Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {t('resource2Desc1')}<br />
                    {t('resource2Desc2')}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('tag1')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('tag2')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('tag3')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('tag4')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-neutral-400 text-sm">{t('packagePriceLabel')}</p>
                  <p className="text-2xl font-bold text-brand-900">{t('price2')}<span className="text-sm font-normal text-neutral-500">{t('priceUnit')}</span></p>
                </div>
              </div>
            </div>

            {/* Medical Services */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-neutral-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded">{t('resource3Badge')}</span>
                    <span className="text-neutral-400 text-sm">{t('resource3Subtitle')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-2">{t('resource3Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {t('resource3Desc1')}<br />
                    {t('resource3Desc2')}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('tag5')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('tag6')}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{t('tag7')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-neutral-400 text-sm">{t('treatmentPriceLabel')}</p>
                  <p className="text-2xl font-bold text-brand-900">{t('price3')}<span className="text-sm font-normal text-neutral-500">{t('priceUnit')}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Rules */}
      <section className="bg-white py-20 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-serif text-brand-900 mb-2">{t('rulesTitle')}</h2>
          <p className="text-neutral-500 mb-12">{t('rulesDesc')}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="font-bold text-brand-900 mb-3">{t('rule1Title')}</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule1Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule1Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule1Item3')}</span>
                </li>
              </ul>
            </div>

            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="font-bold text-brand-900 mb-3">{t('rule2Title')}</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule2Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule2Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule2Item3')}</span>
                </li>
              </ul>
            </div>

            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="font-bold text-brand-900 mb-3">{t('rule3Title')}</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule3Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule3Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule3Item3')}</span>
                </li>
              </ul>
            </div>

            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="font-bold text-brand-900 mb-3">{t('rule4Title')}</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule4Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule4Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{t('rule4Item3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Website */}
      <section className="bg-brand-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="md:flex md:items-center md:gap-12">
            <div className="flex-1 mb-10 md:mb-0">
              <p className="text-gold-400 text-sm font-medium mb-4">{t('brandSectionBadge')}</p>
              <h2 className="text-2xl md:text-3xl font-serif mb-4">
                {t('brandSectionTitle')}
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                {t('brandSectionDesc1')}<br />
                {t('brandSectionDesc2')}
              </p>
              <ul className="space-y-3 text-neutral-300 text-sm mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-gold-400">✓</span>
                  {t('brandFeature1')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-400">✓</span>
                  {t('brandFeature2')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-400">✓</span>
                  {t('brandFeature3')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-400">✓</span>
                  {t('brandFeature4')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-400">✓</span>
                  {t('brandFeature5')}
                </li>
              </ul>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-gold-400">{t('brandPrice')}</span>
                <span className="text-neutral-500">{t('brandPriceUnit')}</span>
              </div>
              <button
                onClick={() => setShowWechatQR(true)}
                className="bg-gold-400 hover:bg-gold-500 text-black font-bold px-6 py-3 rounded transition-colors"
                aria-label={t('ariaWechatConsult')}
              >
                {t('btnConsult')}
              </button>
            </div>
            <div className="flex-1">
              <p className="text-neutral-400 text-sm mb-3">{t('previewLabel')}</p>
              <div className="rounded-lg overflow-hidden border border-brand-700 shadow-2xl">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800 border-b border-neutral-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                  <div className="flex-1 mx-4">
                    <div className="bg-neutral-700 rounded-md px-3 py-1 text-neutral-400 text-[10px] text-center">niijima-koutsu.jp/g/yourname</div>
                  </div>
                </div>
                {/* Live iframe preview */}
                <iframe
                  src="/g/demo"
                  className="w-full h-[400px] md:h-[480px] border-0"
                  title="White-label demo"
                  loading="lazy"
                />
              </div>
              <a
                href="/g/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-gold-400 text-sm mt-3 hover:underline"
              >
                {t('viewDemo')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-900 mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-neutral-600 mb-8">
            {t('ctaDesc')}
          </p>
          <button
            onClick={() => setShowWechatQR(true)}
            className="bg-gold-400 hover:bg-gold-500 text-brand-900 font-bold px-10 py-4 rounded transition-colors inline-flex items-center gap-3"
            aria-label={t('ariaWechatPartner')}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
            </svg>
            {t('btnWechatQR')}
          </button>
          <p className="text-neutral-500 text-sm mt-4">
            {t('ctaEmailLabel')} <a href="mailto:haoyuan@niijima-koutsu.jp" className="underline">haoyuan@niijima-koutsu.jp</a>
          </p>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="bg-neutral-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-neutral-600" />
              <h3 className="font-bold text-brand-900">{t('legalTitle')}</h3>
            </div>
            <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
              <p>
                {t('legalText')}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
              {t('legalFooter')}
            </div>
          </div>
        </div>
      </section>


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
              <h3 id="wechat-modal-title" className="font-bold text-lg text-brand-900">{t('modalTitle')}</h3>
              <button
                onClick={() => setShowWechatQR(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
                aria-label={t('ariaCloseModal')}
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 flex justify-center">
              <img
                src={WECHAT_QR_URL}
                alt="WeChat QR Code"
                className="w-56 h-56 object-contain"
              />
            </div>

            <p className="text-center text-neutral-600 mt-4 text-sm">
              {t('modalDesc')}
            </p>

            <div className="mt-4 bg-gold-50 rounded-lg p-4 text-sm text-gold-700">
              <p className="font-medium mb-1">{t('modalNoteTitle')}</p>
              <p>{t('modalNoteText')}</p>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
