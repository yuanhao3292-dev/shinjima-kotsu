'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/PublicLayout';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  Building2,
  Shield,
  Handshake,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  HeartPulse,
  Trophy,
  Factory,
  Loader2,
  Check
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  // Hero Section
  heroTagline: {
    'ja': 'B2B Partnership',
    'zh-TW': 'B2B Partnership',
    'zh-CN': 'B2B Partnership',
    'en': 'B2B Partnership',
  },
  heroTitle1: {
    'ja': 'パートナーシップ',
    'zh-TW': '攜手合作',
    'zh-CN': '携手合作',
    'en': 'Partnership',
  },
  heroTitle2: {
    'ja': '日本旅行の新たな可能性を共に',
    'zh-TW': '共創日本旅遊新機遇',
    'zh-CN': '共创日本旅游新机遇',
    'en': 'Creating New Opportunities in Japan Travel',
  },
  heroDesc: {
    'ja': '新島交通は日本で正式登録された旅行会社であり、12年間ハイエンドカスタマイズサービスに特化してきました。中国本土、台湾、韓国、東南アジアの旅行会社パートナーと共に、日本の医療健診、名門ゴルフ、ビジネス視察市場を開拓します。',
    'zh-TW': '新島交通是日本正規註冊旅行社，專注高端定制服務12年。我們誠邀中國大陸、台灣、韓國及東南亞地區的旅行社夥伴，共同開拓日本醫療健檢、名門高爾夫、商務考察市場。',
    'zh-CN': '新岛交通是日本正规注册旅行社，专注高端定制服务12年。我们诚邀中国大陆、台湾、韩国及东南亚地区的旅行社伙伴，共同开拓日本医疗健检、名门高尔夫、商务考察市场。',
    'en': 'NIIJIMA Transport is a licensed travel agency in Japan, specializing in premium customized services for 12 years. We invite travel agency partners from Mainland China, Taiwan, Korea, and Southeast Asia to jointly develop Japan\'s medical checkup, prestigious golf, and business inspection markets.',
  },
  heroCta: {
    'ja': '今すぐ相談する',
    'zh-TW': '立即洽談合作',
    'zh-CN': '立即洽谈合作',
    'en': 'Start Partnership Discussion',
  },
  heroCredentialLabel: {
    'ja': '公式資格',
    'zh-TW': '官方資質',
    'zh-CN': '官方资质',
    'en': 'Official Credentials',
  },
  heroCredential1: {
    'ja': '大阪府知事登録旅行業 第2-3115号',
    'zh-TW': '大阪府知事登録旅行業 第2-3115号',
    'zh-CN': '大阪府知事登録旅行業 第2-3115号',
    'en': 'Osaka Gov. Licensed Travel Agency No. 2-3115',
  },
  heroCredential2: {
    'ja': '日本旅行業協会（JATA）正会員',
    'zh-TW': '日本旅行業協會（JATA）正會員',
    'zh-CN': '日本旅行业协会（JATA）正会员',
    'en': 'JATA (Japan Association of Travel Agents) Member',
  },

  // Region Tags
  regionChina: {
    'ja': '中国本土',
    'zh-TW': '中國大陸',
    'zh-CN': '中国大陆',
    'en': 'Mainland China',
  },
  regionTaiwan: {
    'ja': '台湾',
    'zh-TW': '台灣',
    'zh-CN': '台湾',
    'en': 'Taiwan',
  },
  regionKorea: {
    'ja': '韓国',
    'zh-TW': '韓國',
    'zh-CN': '韩国',
    'en': 'Korea',
  },
  regionSingapore: {
    'ja': 'シンガポール',
    'zh-TW': '新加坡',
    'zh-CN': '新加坡',
    'en': 'Singapore',
  },
  regionMalaysia: {
    'ja': 'マレーシア',
    'zh-TW': '馬來西亞',
    'zh-CN': '马来西亚',
    'en': 'Malaysia',
  },
  regionThailand: {
    'ja': 'タイ',
    'zh-TW': '泰國',
    'zh-CN': '泰国',
    'en': 'Thailand',
  },
  regionVietnam: {
    'ja': 'ベトナム',
    'zh-TW': '越南',
    'zh-CN': '越南',
    'en': 'Vietnam',
  },
  regionIndonesia: {
    'ja': 'インドネシア',
    'zh-TW': '印尼',
    'zh-CN': '印尼',
    'en': 'Indonesia',
  },

  // Stats Section
  whyPartnerSubtitle: {
    'ja': 'Why Partner With Us',
    'zh-TW': 'Why Partner With Us',
    'zh-CN': 'Why Partner With Us',
    'en': 'Why Partner With Us',
  },
  whyPartnerTitle: {
    'ja': '新島交通を選ぶ理由',
    'zh-TW': '為什麼選擇新島交通',
    'zh-CN': '为什么选择新岛交通',
    'en': 'Why Partner With NIIJIMA',
  },
  statYears: {
    'ja': '年',
    'zh-TW': '年',
    'zh-CN': '年',
    'en': 'Yrs',
  },
  statYearsLabel: {
    'ja': '日本市場に精通',
    'zh-TW': '深耕日本市場',
    'zh-CN': '深耕日本市场',
    'en': 'Deep in Japan Market',
  },
  statClientsLabel: {
    'ja': 'お客様にサービス提供',
    'zh-TW': '服務客戶',
    'zh-CN': '服务客户',
    'en': 'Clients Served',
  },
  statPartnersLabel: {
    'ja': '提携企業リソース',
    'zh-TW': '合作企業資源',
    'zh-CN': '合作企业资源',
    'en': 'Corporate Resources',
  },
  statSatisfactionLabel: {
    'ja': '顧客満足度',
    'zh-TW': '客戶滿意度',
    'zh-CN': '客户满意度',
    'en': 'Client Satisfaction',
  },

  // Core Advantages
  advantage1Title: {
    'ja': '独占医療リソース',
    'zh-TW': '獨家醫療資源',
    'zh-CN': '独家医疗资源',
    'en': 'Exclusive Medical Resources',
  },
  advantage1Desc: {
    'ja': '徳洲会、TIMCなど日本のトップ医療機関と深く提携し、精密健診、がん治療、重粒子線治療など希少な医療リソースを提供します。',
    'zh-TW': '與德洲會、TIMC等日本頂級醫療機構深度合作，提供精密健檢、癌症治療、質子重離子等稀缺醫療資源。',
    'zh-CN': '与德洲会、TIMC等日本顶级医疗机构深度合作，提供精密健检、癌症治疗、质子重离子等稀缺医疗资源。',
    'en': 'Deep partnerships with Japan\'s top medical institutions like Tokushukai and TIMC, providing premium health checkups, cancer treatment, and proton/heavy ion therapy resources.',
  },
  advantage2Title: {
    'ja': '名門ゴルフ特権',
    'zh-TW': '名門高爾夫特權',
    'zh-CN': '名门高尔夫特权',
    'en': 'Prestigious Golf Privileges',
  },
  advantage2Desc: {
    'ja': '広野、霞ヶ関、小野など25+名門コースの独占予約権。会員紹介不要で、お客様に希少な体験を提供します。',
    'zh-TW': '廣野、霞ヶ関、小野等25+名門球場獨家預約權，無需會員介紹，為您的高端客戶提供稀缺體驗。',
    'zh-CN': '广野、霞ヶ关、小野等25+名门球场独家预约权，无需会员介绍，为您的高端客户提供稀缺体验。',
    'en': 'Exclusive booking access to 25+ prestigious courses including Hirono, Kasumigaseki, and Ono. No member referral needed for your premium clients.',
  },
  advantage3Title: {
    'ja': 'ビジネス視察ネットワーク',
    'zh-TW': '商務考察網絡',
    'zh-CN': '商务考察网络',
    'en': 'Business Inspection Network',
  },
  advantage3Desc: {
    'ja': 'トヨタ、パナソニック、資生堂など500+企業の視察リソース。16業界をカバーし、工場見学から経営者対談までワンストップで手配します。',
    'zh-TW': '豐田、松下、資生堂等500+企業考察資源，覆蓋16大行業，從工廠參觀到高管對談一站式安排。',
    'zh-CN': '丰田、松下、资生堂等500+企业考察资源，覆盖16大行业，从工厂参观到高管对谈一站式安排。',
    'en': 'Inspection resources for 500+ companies including Toyota, Panasonic, and Shiseido. Covering 16 industries, from factory tours to executive meetings.',
  },

  // Partnership Models Section
  partnershipModelSubtitle: {
    'ja': 'Partnership Model',
    'zh-TW': 'Partnership Model',
    'zh-CN': 'Partnership Model',
    'en': 'Partnership Model',
  },
  partnershipModelTitle: {
    'ja': '柔軟な提携モデル',
    'zh-TW': '靈活的合作模式',
    'zh-CN': '灵活的合作模式',
    'en': 'Flexible Partnership Models',
  },
  partnershipModelDesc: {
    'ja': '多様な提携方法を提供し、ランドオペレーター、商品代理、共同プロモーションなど、最適な提携モデルが見つかります。全て中国語対応で、コミュニケーションもスムーズです。',
    'zh-TW': '我們提供多種合作方式，無論是地接服務、產品代理還是聯合推廣，都能找到最適合您的合作模式。全程提供中文對接，讓溝通無障礙。',
    'zh-CN': '我们提供多种合作方式，无论是地接服务、产品代理还是联合推广，都能找到最适合您的合作模式。全程提供中文对接，让沟通无障碍。',
    'en': 'We offer multiple partnership methods. Whether it\'s ground services, product agency, or joint promotion, we\'ll find the best model for you. Full Chinese-language support ensures seamless communication.',
  },
  model1Title: {
    'ja': 'ランドオペレーター提携',
    'zh-TW': '地接服務合作',
    'zh-CN': '地接服务合作',
    'en': 'Ground Service Partnership',
  },
  model1Desc: {
    'ja': 'お客様の送客を担当いただき、日本での全行程手配（旅程、車両、宿泊、食事、ガイド）をワンストップで提供します。',
    'zh-TW': '您負責客源，我們提供日本全程地接，包括行程安排、用車、住宿、餐飲、導遊等一站式服務。',
    'zh-CN': '您负责客源，我们提供日本全程地接，包括行程安排、用车、住宿、餐饮、导游等一站式服务。',
    'en': 'You handle the clients, we provide full ground services in Japan including itinerary, transportation, accommodation, dining, and guide services.',
  },
  model1Item1: {
    'ja': 'プロの旅程設計',
    'zh-TW': '專業行程設計',
    'zh-CN': '专业行程设计',
    'en': 'Professional itinerary design',
  },
  model1Item2: {
    'ja': '全行程品質保証',
    'zh-TW': '全程品質保障',
    'zh-CN': '全程品质保障',
    'en': 'Full quality assurance',
  },
  model1Item3: {
    'ja': '24時間緊急サポート',
    'zh-TW': '24小時應急支援',
    'zh-CN': '24小时应急支援',
    'en': '24/7 emergency support',
  },
  model2Title: {
    'ja': '商品代理提携',
    'zh-TW': '產品代理合作',
    'zh-CN': '产品代理合作',
    'en': 'Product Agency Partnership',
  },
  model2Desc: {
    'ja': '当社の医療健診、ゴルフ、ビジネス視察などの特色商品を代理販売いただき、優遇卸売価格と専属サポートを提供します。',
    'zh-TW': '代理我們的醫療健檢、高爾夫、商務考察等特色產品，享受優惠批發價格和專屬支持。',
    'zh-CN': '代理我们的医疗健检、高尔夫、商务考察等特色产品，享受优惠批发价格和专属支持。',
    'en': 'Represent our specialty products including medical checkups, golf, and business inspections. Enjoy wholesale pricing and dedicated support.',
  },
  model2Item1: {
    'ja': '商品研修サポート',
    'zh-TW': '產品培訓支持',
    'zh-CN': '产品培训支持',
    'en': 'Product training support',
  },
  model2Item2: {
    'ja': '販売資料提供',
    'zh-TW': '銷售資料提供',
    'zh-CN': '销售资料提供',
    'en': 'Sales materials provided',
  },
  model2Item3: {
    'ja': '利益率保証',
    'zh-TW': '利潤空間保障',
    'zh-CN': '利润空间保障',
    'en': 'Profit margin guaranteed',
  },
  model3Title: {
    'ja': '共同プロモーション提携',
    'zh-TW': '聯合推廣合作',
    'zh-CN': '联合推广合作',
    'en': 'Joint Promotion Partnership',
  },
  model3Desc: {
    'ja': '市場を共同開発し、説明会や展示会を共催、顧客リソースを共有し、ウィンウィンを実現します。',
    'zh-TW': '共同開發市場，聯合舉辦推介會、展會活動，共享客戶資源，實現雙贏。',
    'zh-CN': '共同开发市场，联合举办推介会、展会活动，共享客户资源，实现双赢。',
    'en': 'Co-develop markets, jointly host seminars and exhibitions, share customer resources, and achieve win-win outcomes.',
  },
  model3Item1: {
    'ja': 'ブランド共同露出',
    'zh-TW': '品牌聯合曝光',
    'zh-CN': '品牌联合曝光',
    'en': 'Joint brand exposure',
  },
  model3Item2: {
    'ja': '市場リソース共有',
    'zh-TW': '市場資源共享',
    'zh-CN': '市场资源共享',
    'en': 'Market resource sharing',
  },
  model3Item3: {
    'ja': 'イベント費用分担',
    'zh-TW': '活動費用分擔',
    'zh-CN': '活动费用分担',
    'en': 'Event cost sharing',
  },

  // Partner Benefits
  partnerBenefitsTitle: {
    'ja': 'パートナー特典',
    'zh-TW': '合作夥伴權益',
    'zh-CN': '合作伙伴权益',
    'en': 'Partner Benefits',
  },
  benefit1: {
    'ja': '優遇卸売価格体系',
    'zh-TW': '優惠的批發價格體系',
    'zh-CN': '优惠的批发价格体系',
    'en': 'Preferential wholesale pricing',
  },
  benefit2: {
    'ja': '専属アカウントマネージャー',
    'zh-TW': '專屬客戶經理對接',
    'zh-CN': '专属客户经理对接',
    'en': 'Dedicated account manager',
  },
  benefit3: {
    'ja': '中国語契約・請求書対応',
    'zh-TW': '中文合同與發票',
    'zh-CN': '中文合同与发票',
    'en': 'Chinese contracts & invoices',
  },
  benefit4: {
    'ja': '柔軟な決済サイクル',
    'zh-TW': '靈活的結算週期',
    'zh-CN': '灵活的结算周期',
    'en': 'Flexible payment cycles',
  },
  benefit5: {
    'ja': '商品研修・販売サポート',
    'zh-TW': '產品培訓與銷售支持',
    'zh-CN': '产品培训与销售支持',
    'en': 'Product training & sales support',
  },
  benefit6: {
    'ja': '共同プロモーションリソース',
    'zh-TW': '聯合推廣資源',
    'zh-CN': '联合推广资源',
    'en': 'Joint promotion resources',
  },
  benefit7: {
    'ja': '優先予約権（繁忙期）',
    'zh-TW': '優先預訂權（旺季）',
    'zh-CN': '优先预订权（旺季）',
    'en': 'Priority booking (peak season)',
  },
  benefit8: {
    'ja': '年間リベート報酬',
    'zh-TW': '年度返利獎勵',
    'zh-CN': '年度返利奖励',
    'en': 'Annual rebate rewards',
  },

  // Voice of Partners Section
  voiceSubtitle: {
    'ja': 'Voice of Partners',
    'zh-TW': 'Voice of Partners',
    'zh-CN': 'Voice of Partners',
    'en': 'Voice of Partners',
  },
  voiceTitle: {
    'ja': 'パートナーの声',
    'zh-TW': '好評如潮',
    'zh-CN': '好评如潮',
    'en': 'Partner Testimonials',
  },
  voiceSubtitleText: {
    'ja': '500+ 旅行社のリアルな評価',
    'zh-TW': '500+ 旅行社的真實評價',
    'zh-CN': '500+ 旅行社的真实评价',
    'en': 'Real reviews from 500+ travel agencies',
  },
  voiceSubtitleDesc: {
    'ja': '台湾・中国・香港・シンガポールのプロフェッショナルたちから選ばれています',
    'zh-TW': '台灣・中國・香港・新加坡的專業旅行社們的選擇',
    'zh-CN': '台湾・中国・香港・新加坡的专业旅行社们的选择',
    'en': 'Trusted by professionals from Taiwan, China, Hong Kong, and Singapore',
  },
  voiceBasedOn: {
    'ja': '500+ 件の評価に基づく',
    'zh-TW': '基於 500+ 評價',
    'zh-CN': '基于 500+ 评价',
    'en': 'Based on 500+ reviews',
  },

  // Voice Region Stats
  voiceRegionTW: { 'ja': '🇹🇼 台湾', 'zh-TW': '🇹🇼 台灣', 'zh-CN': '🇹🇼 台湾', en: '🇹🇼 Taiwan' },
  voiceRegionCN: { 'ja': '🇨🇳 中国', 'zh-TW': '🇨🇳 中國', 'zh-CN': '🇨🇳 中国', en: '🇨🇳 China' },
  voiceRegionHK: { 'ja': '🇭🇰 香港', 'zh-TW': '🇭🇰 香港', 'zh-CN': '🇭🇰 香港', en: '🇭🇰 Hong Kong' },
  voiceRegionSG: { 'ja': '🇸🇬 シンガポール', 'zh-TW': '🇸🇬 新加坡', 'zh-CN': '🇸🇬 新加坡', en: '🇸🇬 Singapore' },

  // Industry Transformation Section
  industrySubtitle: {
    'ja': 'Industry Transformation',
    'zh-TW': 'Industry Transformation',
    'zh-CN': 'Industry Transformation',
    'en': 'Industry Transformation',
  },
  industryTitle1: {
    'ja': '従来の旅行社の',
    'zh-TW': '傳統旅行社的',
    'zh-CN': '传统旅行社的',
    'en': 'Traditional Travel Agency\'s',
  },
  industryTitle2: {
    'ja': '変革のチャンス',
    'zh-TW': '轉型契機',
    'zh-CN': '转型契机',
    'en': 'Transformation Opportunity',
  },
  painPoint1Title: {
    'ja': 'AIが旅行市場を変革中',
    'zh-TW': 'AI 正在改變旅遊市場格局',
    'zh-CN': 'AI 正在改变旅游市场格局',
    'en': 'AI is Transforming the Travel Market',
  },
  painPoint1Desc: {
    'ja': '航空券・ホテル・一般的な旅程は、お客様が簡単にセルフサービスで完了できます。旅行社はより価値のある専門サービスを提供する必要があります。',
    'zh-TW': '機票酒店、常規行程，客戶可以輕鬆自助完成。旅行社需要提供更有價值的專業服務。',
    'zh-CN': '机票酒店、常规行程，客户可以轻松自助完成。旅行社需要提供更有价值的专业服务。',
    'en': 'Flights, hotels, and standard itineraries can be easily self-booked. Travel agencies need to provide more valuable professional services.',
  },
  painPoint2Title: {
    'ja': '個人旅行のトレンドが続く',
    'zh-TW': '自由行趨勢持續上升',
    'zh-CN': '自由行趋势持续上升',
    'en': 'Independent Travel Trend Rising',
  },
  painPoint2Desc: {
    'ja': '新世代の旅行者はパーソナライズされた体験を求め、従来のツアー市場は縮小中。専門カスタマイズが新トレンドです。',
    'zh-TW': '新一代旅客更追求個性化體驗，傳統跟團遊市場正在縮小，專業定制成為新趨勢。',
    'zh-CN': '新一代旅客更追求个性化体验，传统跟团游市场正在缩小，专业定制成为新趋势。',
    'en': 'New-generation travelers seek personalized experiences. Group tour market is shrinking, professional customization is the new trend.',
  },
  painPoint3Title: {
    'ja': '差別化サービスが核心競争力',
    'zh-TW': '差異化服務是核心競爭力',
    'zh-CN': '差异化服务是核心竞争力',
    'en': 'Differentiated Services as Core Competitiveness',
  },
  painPoint3Desc: {
    'ja': '一般的な旅行商品は同質化が深刻。専門リソースの統合力だけが競争優位を構築できます。',
    'zh-TW': '常規旅遊產品同質化嚴重，只有專業資源整合能力才能建立競爭壁壘。',
    'zh-CN': '常规旅游产品同质化严重，只有专业资源整合能力才能建立竞争壁垒。',
    'en': 'Standard travel products are highly homogenized. Only professional resource integration can build competitive barriers.',
  },
  industryStatValue: {
    'ja': '3,600万+',
    'zh-TW': '3,600萬+',
    'zh-CN': '3,600万+',
    'en': '36M+',
  },
  industryStatLabel: {
    'ja': '2025年予想訪日観光客数、ハイエンドカスタマイズ市場の需要旺盛',
    'zh-TW': '2025年預計訪日遊客人次，高端定制市場需求旺盛',
    'zh-CN': '2025年预计访日游客人次，高端定制市场需求旺盛',
    'en': 'Expected Japan visitors in 2025, with strong demand in premium customization market',
  },

  // Solution Section (right panel)
  solutionTitle: {
    'ja': 'ハイエンドカスタマイズへ転換\n新市場を開拓',
    'zh-TW': '轉型高端定制\n開拓新市場',
    'zh-CN': '转型高端定制\n开拓新市场',
    'en': 'Transform to Premium\nOpen New Markets',
  },
  solutionDesc: {
    'ja': '医療健診、名門ゴルフ、企業視察——これらの深いリソース統合と専門的な対応能力が必要なサービス分野こそ、旅行社の変革に最適な方向です。',
    'zh-TW': '醫療健檢、名門高爾夫、企業考察——這些需要深度資源整合和專業對接能力的服務領域，正是旅行社轉型的最佳方向。',
    'zh-CN': '医疗健检、名门高尔夫、企业考察——这些需要深度资源整合和专业对接能力的服务领域，正是旅行社转型的最佳方向。',
    'en': 'Medical checkups, prestigious golf, business inspections -- these service areas requiring deep resource integration and professional coordination are the best direction for travel agency transformation.',
  },
  solutionItem1: {
    'ja': '精密健診：日本トップ医療機関リソース',
    'zh-TW': '精密健檢：日本頂級醫療機構資源',
    'zh-CN': '精密健检：日本顶级医疗机构资源',
    'en': 'Health Checkups: Top Japan medical institution resources',
  },
  solutionItem2: {
    'ja': '名門ゴルフ：25+ 名門コース予約チャネル',
    'zh-TW': '名門高爾夫：25+ 名門球場預約渠道',
    'zh-CN': '名门高尔夫：25+ 名门球场预约渠道',
    'en': 'Prestigious Golf: 25+ elite course booking channels',
  },
  solutionItem3: {
    'ja': 'ビジネス視察：500+ 企業訪問リソースネットワーク',
    'zh-TW': '商務考察：500+ 企業參訪資源網絡',
    'zh-CN': '商务考察：500+ 企业参访资源网络',
    'en': 'Business Inspections: 500+ corporate visit resource network',
  },
  solutionReadyLabel: {
    'ja': 'これらのリソースは、すでに準備完了です',
    'zh-TW': '這些資源，我們已經準備好了',
    'zh-CN': '这些资源，我们已经准备好了',
    'en': 'These resources are already prepared for you',
  },
  solutionReadyDesc: {
    'ja': '徳洲会病院の予約チャネル、広野ゴルフの会員人脈、トヨタ工場の視察許可——12年間の日本市場での実績が、あなたのビジネス転換を強力にサポートします。',
    'zh-TW': '德洲會醫院的預約渠道、廣野高爾夫的會員人脈、豐田工廠的考察許可——12年深耕日本市場，為您的業務轉型提供強大支持。',
    'zh-CN': '德洲会医院的预约渠道、广野高尔夫的会员人脉、丰田工厂的考察许可——12年深耕日本市场，为您的业务转型提供强大支持。',
    'en': 'Tokushukai Hospital booking channels, Hirono Golf Club member connections, Toyota factory inspection permits -- 12 years in Japan market, providing strong support for your business transformation.',
  },
  solutionFooterTitle: {
    'ja': '共に未来を創造',
    'zh-TW': '攜手合作，共創未來',
    'zh-CN': '携手合作，共创未来',
    'en': 'Together, Creating the Future',
  },
  solutionFooterDesc: {
    'ja': 'お客様のリソースと当社の専門サービス力を組み合わせ、ハイエンド旅行市場を共に開拓しましょう。',
    'zh-TW': '您有客戶資源，我們有專業服務能力。讓專業的人做專業的事，一起開拓高端旅遊市場。',
    'zh-CN': '您有客户资源，我们有专业服务能力。让专业的人做专业的事，一起开拓高端旅游市场。',
    'en': 'You have client resources, we have professional service capabilities. Let professionals do what they do best -- together, let\'s develop the premium travel market.',
  },

  // Bottom Stats (Industry Section)
  bottomStat1Value: {
    'ja': '12年',
    'zh-TW': '12年',
    'zh-CN': '12年',
    'en': '12 Yrs',
  },
  bottomStat1Label: {
    'ja': '日本市場に精通',
    'zh-TW': '深耕日本市場',
    'zh-CN': '深耕日本市场',
    'en': 'Deep in Japan Market',
  },
  bottomStat2Value: {
    'ja': '500+',
    'zh-TW': '500+',
    'zh-CN': '500+',
    'en': '500+',
  },
  bottomStat2Label: {
    'ja': '企業視察リソース',
    'zh-TW': '企業考察資源',
    'zh-CN': '企业考察资源',
    'en': 'Corporate Resources',
  },
  bottomStat3Value: {
    'ja': '25+',
    'zh-TW': '25+',
    'zh-CN': '25+',
    'en': '25+',
  },
  bottomStat3Label: {
    'ja': '名門コース提携',
    'zh-TW': '名門球場合作',
    'zh-CN': '名门球场合作',
    'en': 'Elite Courses',
  },
  bottomStat4Value: {
    'ja': '95%',
    'zh-TW': '95%',
    'zh-CN': '95%',
    'en': '95%',
  },
  bottomStat4Label: {
    'ja': 'パートナー更新率',
    'zh-TW': '合作夥伴續約率',
    'zh-CN': '合作伙伴续约率',
    'en': 'Partner Renewal Rate',
  },

  // Contact Form Section
  contactSubtitle: {
    'ja': 'Contact Us',
    'zh-TW': 'Contact Us',
    'zh-CN': 'Contact Us',
    'en': 'Contact Us',
  },
  contactTitle: {
    'ja': 'お問い合わせ',
    'zh-TW': '開啟合作洽談',
    'zh-CN': '开启合作洽谈',
    'en': 'Start a Conversation',
  },
  contactDesc: {
    'ja': '以下のフォームにご記入ください。ビジネスチームが24時間以内にご連絡いたします。',
    'zh-TW': '填寫以下表單，我們的商務團隊將在24小時內與您聯繫',
    'zh-CN': '填写以下表单，我们的商务团队将在24小时内与您联系',
    'en': 'Fill out the form below and our business team will contact you within 24 hours',
  },
  formSubmitSuccess: {
    'ja': '送信完了',
    'zh-TW': '提交成功',
    'zh-CN': '提交成功',
    'en': 'Submitted Successfully',
  },
  formSubmitSuccessDesc: {
    'ja': 'お問い合わせありがとうございます。早急にご連絡いたします。',
    'zh-TW': '感謝您的合作意向，我們將儘快與您聯繫！',
    'zh-CN': '感谢您的合作意向，我们将尽快与您联系！',
    'en': 'Thank you for your interest. We will contact you soon!',
  },
  formCompanyName: {
    'ja': '会社名 *',
    'zh-TW': '公司名稱 *',
    'zh-CN': '公司名称 *',
    'en': 'Company Name *',
  },
  formCompanyPlaceholder: {
    'ja': '会社名をご入力ください',
    'zh-TW': '請輸入貴公司名稱',
    'zh-CN': '请输入贵公司名称',
    'en': 'Enter your company name',
  },
  formContactPerson: {
    'ja': '担当者名 *',
    'zh-TW': '聯繫人 *',
    'zh-CN': '联系人 *',
    'en': 'Contact Person *',
  },
  formContactPlaceholder: {
    'ja': '担当者名をご入力ください',
    'zh-TW': '請輸入聯繫人姓名',
    'zh-CN': '请输入联系人姓名',
    'en': 'Enter contact person name',
  },
  formEmail: {
    'ja': 'メールアドレス *',
    'zh-TW': '電子郵箱 *',
    'zh-CN': '电子邮箱 *',
    'en': 'Email Address *',
  },
  formPhone: {
    'ja': '電話番号 *',
    'zh-TW': '聯繫電話 *',
    'zh-CN': '联系电话 *',
    'en': 'Phone Number *',
  },
  formPhonePlaceholder: {
    'ja': '電話番号（国番号含む）',
    'zh-TW': '請輸入聯繫電話（含國碼）',
    'zh-CN': '请输入联系电话（含国码）',
    'en': 'Enter phone number (with country code)',
  },
  formCountry: {
    'ja': '国/地域 *',
    'zh-TW': '所在國家/地區 *',
    'zh-CN': '所在国家/地区 *',
    'en': 'Country/Region *',
  },
  formCountryPlaceholder: {
    'ja': '選択してください',
    'zh-TW': '請選擇',
    'zh-CN': '请选择',
    'en': 'Please select',
  },
  formCountryChina: {
    'ja': '中国本土',
    'zh-TW': '中國大陸',
    'zh-CN': '中国大陆',
    'en': 'Mainland China',
  },
  formCountryTaiwan: {
    'ja': '台湾',
    'zh-TW': '台灣',
    'zh-CN': '台湾',
    'en': 'Taiwan',
  },
  formCountryHongKong: {
    'ja': '香港',
    'zh-TW': '香港',
    'zh-CN': '香港',
    'en': 'Hong Kong',
  },
  formCountryKorea: {
    'ja': '韓国',
    'zh-TW': '韓國',
    'zh-CN': '韩国',
    'en': 'Korea',
  },
  formCountrySingapore: {
    'ja': 'シンガポール',
    'zh-TW': '新加坡',
    'zh-CN': '新加坡',
    'en': 'Singapore',
  },
  formCountryMalaysia: {
    'ja': 'マレーシア',
    'zh-TW': '馬來西亞',
    'zh-CN': '马来西亚',
    'en': 'Malaysia',
  },
  formCountryThailand: {
    'ja': 'タイ',
    'zh-TW': '泰國',
    'zh-CN': '泰国',
    'en': 'Thailand',
  },
  formCountryVietnam: {
    'ja': 'ベトナム',
    'zh-TW': '越南',
    'zh-CN': '越南',
    'en': 'Vietnam',
  },
  formCountryIndonesia: {
    'ja': 'インドネシア',
    'zh-TW': '印尼',
    'zh-CN': '印尼',
    'en': 'Indonesia',
  },
  formCountryPhilippines: {
    'ja': 'フィリピン',
    'zh-TW': '菲律賓',
    'zh-CN': '菲律宾',
    'en': 'Philippines',
  },
  formCountryOther: {
    'ja': 'その他',
    'zh-TW': '其他',
    'zh-CN': '其他',
    'en': 'Other',
  },
  formBusinessType: {
    'ja': '業種 *',
    'zh-TW': '業務類型 *',
    'zh-CN': '业务类型 *',
    'en': 'Business Type *',
  },
  formBusinessTravel: {
    'ja': '旅行社',
    'zh-TW': '旅行社',
    'zh-CN': '旅行社',
    'en': 'Travel Agency',
  },
  formBusinessMedical: {
    'ja': '医療仲介/健康管理',
    'zh-TW': '醫療中介/健康管理',
    'zh-CN': '医疗中介/健康管理',
    'en': 'Medical Agency/Health Management',
  },
  formBusinessGolf: {
    'ja': 'ゴルフツアー',
    'zh-TW': '高爾夫旅遊',
    'zh-CN': '高尔夫旅游',
    'en': 'Golf Tourism',
  },
  formBusinessInspection: {
    'ja': 'ビジネス視察/MICE',
    'zh-TW': '商務考察/會展',
    'zh-CN': '商务考察/会展',
    'en': 'Business Inspection/MICE',
  },
  formBusinessOTA: {
    'ja': 'OTA/オンラインプラットフォーム',
    'zh-TW': 'OTA/在線平台',
    'zh-CN': 'OTA/在线平台',
    'en': 'OTA/Online Platform',
  },
  formBusinessOther: {
    'ja': 'その他',
    'zh-TW': '其他',
    'zh-CN': '其他',
    'en': 'Other',
  },
  formMessage: {
    'ja': '提携のご要望',
    'zh-TW': '合作意向說明',
    'zh-CN': '合作意向说明',
    'en': 'Partnership Details',
  },
  formMessagePlaceholder: {
    'ja': '提携のご要望、主な顧客層、予想取扱量などをご記入ください...',
    'zh-TW': '請簡要說明您的合作意向、主要客群、預計業務量等...',
    'zh-CN': '请简要说明您的合作意向、主要客群、预计业务量等...',
    'en': 'Please briefly describe your partnership goals, target clients, expected volume, etc...',
  },
  formSubmitting: {
    'ja': '送信中...',
    'zh-TW': '提交中...',
    'zh-CN': '提交中...',
    'en': 'Submitting...',
  },
  formSubmitButton: {
    'ja': '提携申請を送信',
    'zh-TW': '提交合作申請',
    'zh-CN': '提交合作申请',
    'en': 'Submit Partnership Application',
  },

  // Contact Info Section
  contactEmailLabel: {
    'ja': 'ビジネスメール',
    'zh-TW': '商務郵箱',
    'zh-CN': '商务邮箱',
    'en': 'Business Email',
  },
  contactPhoneLabel: {
    'ja': 'ビジネス電話',
    'zh-TW': '商務電話',
    'zh-CN': '商务电话',
    'en': 'Business Phone',
  },
  contactAddressLabel: {
    'ja': '所在地',
    'zh-TW': '公司地址',
    'zh-CN': '公司地址',
    'en': 'Office Address',
  },
  heroImageAlt: {
    'ja': 'ビジネスパートナーシップ',
    'zh-TW': '商業合作夥伴',
    'zh-CN': '商业合作伙伴',
    'en': 'Business Partnership',
  },
} as const;

type ReviewItem = {
  quote: Record<Language, string>;
  name: Record<Language, string>;
  region: Record<Language, string>;
  rating: number;
};

const reviewWallRow1: ReviewItem[] = [
  {
    quote: { ja: '医療リソースが素晴らしい、お客様から台湾の代理店より専門的だと好評', 'zh-TW': '醫療資源太強了，客戶都說比台灣代理商專業', 'zh-CN': '医疗资源太强了，客户都说比台湾代理商专业', en: 'Incredible medical resources, clients say they\'re more professional than local agents' },
    name: { ja: '陳マネージャー', 'zh-TW': '陳經理', 'zh-CN': '陈经理', en: 'Manager Chen' },
    region: { ja: '台湾', 'zh-TW': '台灣', 'zh-CN': '台湾', en: 'Taiwan' },
    rating: 5,
  },
  {
    quote: { ja: 'ゴルフ予約は一流、廣野まで手配可能', 'zh-TW': '高爾夫預約真的一流，廣野都能搞定', 'zh-CN': '高尔夫预约真的一流，广野都能搞定', en: 'Golf bookings are top-notch, even Hirono is no problem' },
    name: { ja: '張社長', 'zh-TW': '張總', 'zh-CN': '张总', en: 'President Zhang' },
    region: { ja: '上海', 'zh-TW': '上海', 'zh-CN': '上海', en: 'Shanghai' },
    rating: 5,
  },
  {
    quote: { ja: '3年間のパートナーシップ、一度も問題なし、安心', 'zh-TW': '合作3年，從沒出過問題，非常放心', 'zh-CN': '合作3年，从没出过问题，非常放心', en: '3 years of partnership, never a single issue, very reliable' },
    name: { ja: 'Lee代表', 'zh-TW': 'Lee代表', 'zh-CN': 'Lee代表', en: 'Rep. Lee' },
    region: { ja: 'ソウル', 'zh-TW': '首爾', 'zh-CN': '首尔', en: 'Seoul' },
    rating: 5,
  },
  {
    quote: { ja: '見積もりが早い、資料が充実、時間の節約に', 'zh-TW': '報價速度快，資料齊全，省了我很多時間', 'zh-CN': '报价速度快，资料齐全，省了我很多时间', en: 'Fast quotes, complete documentation, saves so much time' },
    name: { ja: '林会長', 'zh-TW': '林董', 'zh-CN': '林董', en: 'Chairman Lin' },
    region: { ja: '台北', 'zh-TW': '台北', 'zh-CN': '台北', en: 'Taipei' },
    rating: 5,
  },
  {
    quote: { ja: '商務視察の手配が非常にプロ、顧客の評判上々', 'zh-TW': '商務考察安排得很專業，客戶反饋超好', 'zh-CN': '商务考察安排得很专业，客户反馈超好', en: 'Business inspection arrangements are very professional, great client feedback' },
    name: { ja: '黃ディレクター', 'zh-TW': '黃總監', 'zh-CN': '黄总监', en: 'Director Huang' },
    region: { ja: '深圳', 'zh-TW': '深圳', 'zh-CN': '深圳', en: 'Shenzhen' },
    rating: 5,
  },
  {
    quote: { ja: '名門コースとのコネは本物', 'zh-TW': '名門球場的人脈真的不是蓋的', 'zh-CN': '名门球场的人脉真的不是盖的', en: 'Their connections to prestigious courses are the real deal' },
    name: { ja: 'Tony', 'zh-TW': 'Tony', 'zh-CN': 'Tony', en: 'Tony' },
    region: { ja: '香港', 'zh-TW': '香港', 'zh-CN': '香港', en: 'Hong Kong' },
    rating: 5,
  },
  {
    quote: { ja: '健診レポートの翻訳が専門的、顧客も満足', 'zh-TW': '健檢報告翻譯很專業，客戶很滿意', 'zh-CN': '健检报告翻译很专业，客户很满意', en: 'Health check report translations are very professional, clients love it' },
    name: { ja: '呉マネージャー', 'zh-TW': '吳經理', 'zh-CN': '吴经理', en: 'Manager Wu' },
    region: { ja: '台中', 'zh-TW': '台中', 'zh-CN': '台中', en: 'Taichung' },
    rating: 5,
  },
  {
    quote: { ja: '日本の地上手配はここで間違いなし', 'zh-TW': '日本地接找他們就對了', 'zh-CN': '日本地接找他们就对了', en: 'They\'re the go-to for Japan ground services' },
    name: { ja: '孫社長', 'zh-TW': '孫總', 'zh-CN': '孙总', en: 'President Sun' },
    region: { ja: '北京', 'zh-TW': '北京', 'zh-CN': '北京', en: 'Beijing' },
    rating: 5,
  },
];

const reviewWallRow2: ReviewItem[] = [
  {
    quote: { ja: '価格が透明で上乗せなし、長期パートナーとして最適', 'zh-TW': '價格透明，不會亂加價，長期合作的好夥伴', 'zh-CN': '价格透明，不会乱加价，长期合作的好伙伴', en: 'Transparent pricing, no hidden fees, great long-term partner' },
    name: { ja: '周マネージャー', 'zh-TW': '周經理', 'zh-CN': '周经理', en: 'Manager Zhou' },
    region: { ja: '杭州', 'zh-TW': '杭州', 'zh-CN': '杭州', en: 'Hangzhou' },
    rating: 5,
  },
  {
    quote: { ja: 'VIP顧客が指名するサービス品質', 'zh-TW': 'VIP客戶指定要他們服務，品質有保證', 'zh-CN': 'VIP客户指定要他们服务，品质有保证', en: 'VIP clients specifically request their services, quality guaranteed' },
    name: { ja: '鄭社長', 'zh-TW': '鄭總', 'zh-CN': '郑总', en: 'President Zheng' },
    region: { ja: '台北', 'zh-TW': '台北', 'zh-CN': '台北', en: 'Taipei' },
    rating: 5,
  },
  {
    quote: { ja: '緊急時の対応が迅速、24時間本当に繋がる', 'zh-TW': '緊急情況處理很及時，24小時真的有人', 'zh-CN': '紧急情况处理很及时，24小时真的有人', en: 'Emergency handling is prompt, truly 24/7 availability' },
    name: { ja: 'David', 'zh-TW': 'David', 'zh-CN': 'David', en: 'David' },
    region: { ja: 'シンガポール', 'zh-TW': '新加坡', 'zh-CN': '新加坡', en: 'Singapore' },
    rating: 5,
  },
  {
    quote: { ja: '日本通、どんな特殊な要望にも対応可能', 'zh-TW': '日本通，什麼稀奇古怪的要求都能滿足', 'zh-CN': '日本通，什么稀奇古怪的要求都能满足', en: 'Japan experts, can fulfill any unique requests' },
    name: { ja: '劉会長', 'zh-TW': '劉董', 'zh-CN': '刘董', en: 'Chairman Liu' },
    region: { ja: '広州', 'zh-TW': '廣州', 'zh-CN': '广州', en: 'Guangzhou' },
    rating: 5,
  },
  {
    quote: { ja: '通訳同行が専門的、お客様体験は一流', 'zh-TW': '翻譯陪同很專業，客戶體驗一流', 'zh-CN': '翻译陪同很专业，客户体验一流', en: 'Interpreter services are professional, first-class client experience' },
    name: { ja: '許マネージャー', 'zh-TW': '許經理', 'zh-CN': '许经理', en: 'Manager Hsu' },
    region: { ja: '高雄', 'zh-TW': '高雄', 'zh-CN': '高雄', en: 'Kaohsiung' },
    rating: 5,
  },
  {
    quote: { ja: '企業視察のコネが凄い、トヨタにも入れる', 'zh-TW': '企業考察的對接太厲害了，豐田都能進', 'zh-CN': '企业考察的对接太厉害了，丰田都能进', en: 'Amazing corporate visit connections, even Toyota is accessible' },
    name: { ja: '王ディレクター', 'zh-TW': '王總監', 'zh-CN': '王总监', en: 'Director Wang' },
    region: { ja: '成都', 'zh-TW': '成都', 'zh-CN': '成都', en: 'Chengdu' },
    rating: 5,
  },
  {
    quote: { ja: 'ハイエンドツアーなら必ずここに依頼、評判良し', 'zh-TW': '做高端團必找他們，口碑好', 'zh-CN': '做高端团必找他们，口碑好', en: 'The go-to for luxury tours, excellent reputation' },
    name: { ja: 'Michael', 'zh-TW': 'Michael', 'zh-CN': 'Michael', en: 'Michael' },
    region: { ja: '香港', 'zh-TW': '香港', 'zh-CN': '香港', en: 'Hong Kong' },
    rating: 5,
  },
  {
    quote: { ja: '5年連続更新、それが全てを物語る', 'zh-TW': '續約5年了，說明一切', 'zh-CN': '续约5年了，说明一切', en: '5 years of renewal, that says it all' },
    name: { ja: '趙マネージャー', 'zh-TW': '趙經理', 'zh-CN': '赵经理', en: 'Manager Zhao' },
    region: { ja: '南京', 'zh-TW': '南京', 'zh-CN': '南京', en: 'Nanjing' },
    rating: 5,
  },
];

const reviewWallRow3: ReviewItem[] = [
  {
    quote: { ja: 'ようやく見つけた信頼できる日本の地上手配', 'zh-TW': '找了很久才找到這麼靠譜的日本地接', 'zh-CN': '找了很久才找到这么靠谱的日本地接', en: 'Finally found a reliable Japan ground operator' },
    name: { ja: '蔡マネージャー', 'zh-TW': '蔡經理', 'zh-CN': '蔡经理', en: 'Manager Tsai' },
    region: { ja: 'マレーシア', 'zh-TW': '馬來西亞', 'zh-CN': '马来西亚', en: 'Malaysia' },
    rating: 5,
  },
  {
    quote: { ja: '精密健診の手配は非の打ち所がない', 'zh-TW': '精密健檢的安排無可挑剔', 'zh-CN': '精密健检的安排无可挑剔', en: 'Premium health screening arrangements are impeccable' },
    name: { ja: '楊社長', 'zh-TW': '楊總', 'zh-CN': '杨总', en: 'President Yang' },
    region: { ja: '上海', 'zh-TW': '上海', 'zh-CN': '上海', en: 'Shanghai' },
    rating: 5,
  },
  {
    quote: { ja: 'サービスの細部まで行き届いてお客様も感動', 'zh-TW': '服務細節做得好，客人都很感動', 'zh-CN': '服务细节做得好，客人都很感动', en: 'Great attention to detail, guests are always impressed' },
    name: { ja: '謝会長', 'zh-TW': '謝董', 'zh-CN': '谢董', en: 'Chairman Hsieh' },
    region: { ja: '台北', 'zh-TW': '台北', 'zh-CN': '台北', en: 'Taipei' },
    rating: 5,
  },
  {
    quote: { ja: '対応が早く実行力が高い、信頼できる', 'zh-TW': '反應快、執行力強、值得信賴', 'zh-CN': '反应快、执行力强、值得信赖', en: 'Fast response, strong execution, trustworthy' },
    name: { ja: 'Jason', 'zh-TW': 'Jason', 'zh-CN': 'Jason', en: 'Jason' },
    region: { ja: '香港', 'zh-TW': '香港', 'zh-CN': '香港', en: 'Hong Kong' },
    rating: 5,
  },
  {
    quote: { ja: '日本ハイエンド旅行の第一選択パートナー', 'zh-TW': '日本高端旅遊的首選合作夥伴', 'zh-CN': '日本高端旅游的首选合作伙伴', en: 'The preferred partner for luxury Japan travel' },
    name: { ja: '馬マネージャー', 'zh-TW': '馬經理', 'zh-CN': '马经理', en: 'Manager Ma' },
    region: { ja: '蘇州', 'zh-TW': '蘇州', 'zh-CN': '苏州', en: 'Suzhou' },
    rating: 5,
  },
  {
    quote: { ja: 'プロフェッショナリズムが期待以上、強くお勧め', 'zh-TW': '專業程度超出預期，強烈推薦', 'zh-CN': '专业程度超出预期，强烈推荐', en: 'Professionalism exceeds expectations, highly recommended' },
    name: { ja: 'Alan', 'zh-TW': 'Alan', 'zh-CN': 'Alan', en: 'Alan' },
    region: { ja: 'シンガポール', 'zh-TW': '新加坡', 'zh-CN': '新加坡', en: 'Singapore' },
    rating: 5,
  },
  {
    quote: { ja: '問題解決能力が一流、安心できる', 'zh-TW': '處理問題的能力一流，很安心', 'zh-CN': '处理问题的能力一流，很安心', en: 'First-class problem-solving ability, very reassuring' },
    name: { ja: '方ディレクター', 'zh-TW': '方總監', 'zh-CN': '方总监', en: 'Director Fang' },
    region: { ja: '武漢', 'zh-TW': '武漢', 'zh-CN': '武汉', en: 'Wuhan' },
    rating: 5,
  },
  {
    quote: { ja: '協力が順調、さらなるプロジェクトを期待', 'zh-TW': '合作愉快，期待更多項目', 'zh-CN': '合作愉快，期待更多项目', en: 'Great collaboration, looking forward to more projects' },
    name: { ja: '葉マネージャー', 'zh-TW': '葉經理', 'zh-CN': '叶经理', en: 'Manager Yeh' },
    region: { ja: '台南', 'zh-TW': '台南', 'zh-CN': '台南', en: 'Tainan' },
    rating: 5,
  },
];

type FeaturedReviewItem = {
  quote: Record<Language, string>;
  name: Record<Language, string>;
  company: Record<Language, string>;
  region: Record<Language, string>;
  avatar: string;
};

const featuredReviews: FeaturedReviewItem[] = [
  {
    quote: {
      ja: '新島交通との3年間のパートナーシップで、彼らの医療リソースは日本で最も専門的だと実感しました。お客様満足度が非常に高く、リピート率は60%以上。このようなパートナーはなかなか出会えません。',
      'zh-TW': '與新島交通合作3年，他們的醫療資源是我們在日本見過最專業的。客戶滿意度非常高，回購率達到60%以上。這種合作夥伴可遇不可求。',
      'zh-CN': '与新岛交通合作3年，他们的医疗资源是我们在日本见过最专业的。客户满意度非常高，回购率达到60%以上。这种合作伙伴可遇不可求。',
      en: '3 years of partnership with Niijima Transport — their medical resources are the most professional we\'ve seen in Japan. Client satisfaction is extremely high with over 60% repeat rate. Partners like this are rare.',
    },
    name: { ja: '王総経理', 'zh-TW': '王總經理', 'zh-CN': '王总经理', en: 'GM Wang' },
    company: { ja: '某有名旅行社', 'zh-TW': '某知名旅行社', 'zh-CN': '某知名旅行社', en: 'Leading Travel Agency' },
    region: { ja: '🇨🇳 上海', 'zh-TW': '🇨🇳 上海', 'zh-CN': '🇨🇳 上海', en: '🇨🇳 Shanghai' },
    avatar: 'W',
  },
  {
    quote: {
      ja: '名門ゴルフ場の予約は長年の課題でしたが、新島交通がその扉を開いてくれました。今ではハイエンドのお客様が指名してくるようになり、本当に感謝しています。',
      'zh-TW': '名門高爾夫球場的預約一直是我們的痛點，新島交通幫我們打開了這扇門。現在我們的高端客戶都指名要他們的服務，真的很感謝。',
      'zh-CN': '名门高尔夫球场的预约一直是我们的痛点，新岛交通帮我们打开了这扇门。现在我们的高端客户都指名要他们的服务，真的很感谢。',
      en: 'Booking prestigious golf courses was always our pain point, and Niijima Transport opened that door for us. Now our premium clients specifically request their services. Truly grateful.',
    },
    name: { ja: '李董事長', 'zh-TW': '李董事長', 'zh-CN': '李董事长', en: 'Chairman Li' },
    company: { ja: 'ゴルフ旅行専門社', 'zh-TW': '高爾夫旅遊專家', 'zh-CN': '高尔夫旅游专家', en: 'Golf Travel Expert' },
    region: { ja: '🇹🇼 台北', 'zh-TW': '🇹🇼 台北', 'zh-CN': '🇹🇼 台北', en: '🇹🇼 Taipei' },
    avatar: 'L',
  },
  {
    quote: {
      ja: '日本商務視察市場は競争が激しいですが、新島交通の企業リソースは唯一無二です。トヨタやパナソニックなどの大手も手配可能、これこそ本物の実力です。',
      'zh-TW': '日本商務考察市場競爭激烈，但新島交通的企業資源是獨一無二的。豐田、松下這些大廠，他們都能安排，這才是真正的實力。',
      'zh-CN': '日本商务考察市场竞争激烈，但新岛交通的企业资源是独一无二的。丰田、松下这些大厂，他们都能安排，这才是真正的实力。',
      en: 'The Japan business inspection market is competitive, but Niijima Transport\'s corporate resources are unmatched. Toyota, Panasonic — they can arrange visits to all major companies. That\'s real capability.',
    },
    name: { ja: '金代表', 'zh-TW': '金代表', 'zh-CN': '金代表', en: 'Rep. Kim' },
    company: { ja: 'ビジネス旅行社', 'zh-TW': '商務旅行社', 'zh-CN': '商务旅行社', en: 'Business Travel Agency' },
    region: { ja: '🇰🇷 ソウル', 'zh-TW': '🇰🇷 首爾', 'zh-CN': '🇰🇷 首尔', en: '🇰🇷 Seoul' },
    avatar: 'K',
  },
];

export default function PartnerBusinessPage() {
  const [currentLang, setCurrentLang] = useState<Language>('ja');
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    businessType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
  }, []);

  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'b2b_travel_agency' })
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const regionTags = [
    t('regionChina'), t('regionTaiwan'), t('regionKorea'), t('regionSingapore'),
    t('regionMalaysia'), t('regionThailand'), t('regionVietnam'), t('regionIndonesia')
  ];

  const stats = [
    { value: '12', suffix: t('statYears'), label: t('statYearsLabel') },
    { value: '3000', suffix: '+', label: t('statClientsLabel') },
    { value: '500', suffix: '+', label: t('statPartnersLabel') },
    { value: '98', suffix: '%', label: t('statSatisfactionLabel') },
  ];

  const advantages = [
    {
      icon: HeartPulse,
      title: t('advantage1Title'),
      desc: t('advantage1Desc'),
      color: 'text-brand-700',
      bg: 'bg-brand-50'
    },
    {
      icon: Trophy,
      title: t('advantage2Title'),
      desc: t('advantage2Desc'),
      color: 'text-gold-600',
      bg: 'bg-gold-50'
    },
    {
      icon: Factory,
      title: t('advantage3Title'),
      desc: t('advantage3Desc'),
      color: 'text-brand-600',
      bg: 'bg-brand-50'
    }
  ];

  const partnershipModels = [
    {
      title: t('model1Title'),
      desc: t('model1Desc'),
      items: [t('model1Item1'), t('model1Item2'), t('model1Item3')]
    },
    {
      title: t('model2Title'),
      desc: t('model2Desc'),
      items: [t('model2Item1'), t('model2Item2'), t('model2Item3')]
    },
    {
      title: t('model3Title'),
      desc: t('model3Desc'),
      items: [t('model3Item1'), t('model3Item2'), t('model3Item3')]
    }
  ];

  const benefits = [
    t('benefit1'), t('benefit2'), t('benefit3'), t('benefit4'),
    t('benefit5'), t('benefit6'), t('benefit7'), t('benefit8'),
  ];

  const painPoints = [
    { title: t('painPoint1Title'), desc: t('painPoint1Desc') },
    { title: t('painPoint2Title'), desc: t('painPoint2Desc') },
    { title: t('painPoint3Title'), desc: t('painPoint3Desc') },
  ];

  const solutionItems = [
    t('solutionItem1'),
    t('solutionItem2'),
    t('solutionItem3'),
  ];

  const bottomStats = [
    { value: t('bottomStat1Value'), label: t('bottomStat1Label') },
    { value: t('bottomStat2Value'), label: t('bottomStat2Label') },
    { value: t('bottomStat3Value'), label: t('bottomStat3Label') },
    { value: t('bottomStat4Value'), label: t('bottomStat4Label') },
  ];

  return (
    <PublicLayout showFooter={true}>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format&fit=crop"
            alt={t('heroImageAlt')}
            fill
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/80 to-brand-900/40"></div>
        </div>

        <div className="relative container mx-auto px-6 py-24">
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
              {t('heroDesc')}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {regionTags.map((region, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  {region}
                </span>
              ))}
            </div>

            <a
              href="#contact-form"
              className="inline-flex items-center px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium tracking-wider hover:bg-gold-300 transition-colors"
            >
              {t('heroCta')}
              <ArrowRight size={18} className="ml-3" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 max-w-xs">
            <div className="text-xs text-gold-400 mb-3 uppercase tracking-wider">{t('heroCredentialLabel')}</div>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-gold-400" />
                {t('heroCredential1')}
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-gold-400" />
                {t('heroCredential2')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">{t('whyPartnerSubtitle')}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-900">
                {t('whyPartnerTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-6 bg-neutral-50 rounded-2xl">
                  <div className="text-4xl font-light text-brand-900 mb-2">
                    {stat.value}<span className="text-gold-500">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Core Advantages */}
            <div className="grid md:grid-cols-3 gap-8">
              {advantages.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-8 rounded-2xl ${item.bg}`}>
                    <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 ${item.color}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-900 mb-3">{item.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <section className="py-20 bg-brand-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold-400 uppercase mb-4">{t('partnershipModelSubtitle')}</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
                  {t('partnershipModelTitle')}
                </h2>
                <p className="text-neutral-300 leading-relaxed mb-8">
                  {t('partnershipModelDesc')}
                </p>

                <div className="space-y-6">
                  {partnershipModels.map((model, idx) => (
                    <div key={idx} className="border-l-2 border-gold-400/50 pl-6">
                      <h4 className="text-lg font-medium text-white mb-2">{model.title}</h4>
                      <p className="text-neutral-400 text-sm mb-3">{model.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {model.items.map((item, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded text-neutral-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-medium text-white mb-6">{t('partnerBenefitsTitle')}</h3>
                <div className="space-y-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-gold-400 flex-shrink-0" />
                      <span className="text-neutral-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice of Partners */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-gold-500 uppercase mb-3">{t('voiceSubtitle')}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-900 mb-4">
                {t('voiceTitle')}
              </h2>
              <p className="text-lg text-neutral-500">
                {t('voiceSubtitleText')}
              </p>
              <p className="text-sm text-neutral-400 mt-2">
                {t('voiceSubtitleDesc')}
              </p>
            </div>

            {/* Rating Overview */}
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-5xl font-light text-gold-500 mb-1">4.9</div>
                <div className="flex items-center justify-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-neutral-500">{t('voiceBasedOn')}</div>
              </div>
              <div className="h-16 w-px bg-neutral-200"></div>
              <div className="flex gap-4">
                {[
                  { region: t('voiceRegionTW'), count: '180+' },
                  { region: t('voiceRegionCN'), count: '150+' },
                  { region: t('voiceRegionHK'), count: '90+' },
                  { region: t('voiceRegionSG'), count: '80+' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center px-4">
                    <div className="text-lg font-medium text-brand-900">{item.count}</div>
                    <div className="text-xs text-neutral-500">{item.region}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Wall - Scrolling */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none"></div>

              {/* Row 1 - scroll left */}
              <div className="flex gap-4 mb-4 animate-scroll-left">
                {[...reviewWallRow1, ...reviewWallRow1.slice(0, 4)].map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-72 bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">&ldquo;{item.quote[currentLang]}&rdquo;</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-brand-900">{item.name[currentLang]}</span>
                      <span className="text-gold-600">{item.region[currentLang]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 - scroll right */}
              <div className="flex gap-4 mb-4 animate-scroll-right">
                {[...reviewWallRow2, ...reviewWallRow2.slice(0, 4)].map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-72 bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">&ldquo;{item.quote[currentLang]}&rdquo;</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-brand-900">{item.name[currentLang]}</span>
                      <span className="text-gold-600">{item.region[currentLang]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 3 - scroll left slow */}
              <div className="flex gap-4 animate-scroll-left-slow">
                {[...reviewWallRow3, ...reviewWallRow3.slice(0, 4)].map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-72 bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">&ldquo;{item.quote[currentLang]}&rdquo;</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-brand-900">{item.name[currentLang]}</span>
                      <span className="text-gold-600">{item.region[currentLang]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Reviews */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {featuredReviews.map((testimonial, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gold-50 to-white p-8 rounded-2xl border border-gold-100">
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-neutral-700 leading-relaxed mb-6">&ldquo;{testimonial.quote[currentLang]}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-brand-900">{testimonial.name[currentLang]}</div>
                      <div className="text-sm text-neutral-500">{testimonial.company[currentLang]}</div>
                      <div className="text-xs text-gold-600 mt-0.5">{testimonial.region[currentLang]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
        .animate-scroll-left-slow {
          animation: scroll-left 50s linear infinite;
        }
      `}</style>

      {/* Industry Transformation */}
      <section className="py-20 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left: Pain Points */}
              <div>
                <p className="text-xs tracking-[0.3em] text-gold-400 uppercase mb-4">{t('industrySubtitle')}</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-6 leading-tight">
                  {t('industryTitle1')}
                  <span className="text-gold-400">{t('industryTitle2')}</span>
                </h2>

                <div className="space-y-6 mb-8">
                  {painPoints.map((point, idx) => (
                    <div key={idx} className="border-l-2 border-gold-400/50 pl-5">
                      <h4 className="font-medium text-white mb-1">{point.title}</h4>
                      <p className="text-neutral-400 text-sm">{point.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-light text-gold-400 mb-2">{t('industryStatValue')}</div>
                  <div className="text-sm text-neutral-300">{t('industryStatLabel')}</div>
                </div>
              </div>

              {/* Right: Solution */}
              <div className="bg-white rounded-2xl p-8 md:p-10 border border-neutral-200">
                <h3 className="text-2xl font-bold text-brand-900 mb-6 whitespace-pre-line">
                  {t('solutionTitle')}
                </h3>

                <p className="text-neutral-600 mb-8 leading-relaxed">
                  {t('solutionDesc')}
                </p>

                <div className="space-y-4 mb-8">
                  {solutionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-gold-500 flex-shrink-0" />
                      <span className="text-brand-900 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-50 rounded-xl p-6">
                  <div className="text-sm text-brand-900 mb-3 font-medium">{t('solutionReadyLabel')}</div>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('solutionReadyDesc')}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <div className="text-brand-900 font-bold text-lg mb-2">{t('solutionFooterTitle')}</div>
                  <p className="text-neutral-600 text-sm">{t('solutionFooterDesc')}</p>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
              {bottomStats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-light text-gold-400 mb-2">{stat.value}</div>
                  <div className="text-sm text-neutral-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">{t('contactSubtitle')}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-900 mb-4">
                {t('contactTitle')}
              </h2>
              <p className="text-neutral-500">
                {t('contactDesc')}
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-16 bg-brand-50 rounded-2xl">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-brand-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-2">{t('formSubmitSuccess')}</h3>
                <p className="text-neutral-600">{t('formSubmitSuccessDesc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">{t('formCompanyName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                    placeholder={t('formCompanyPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">{t('formContactPerson')}</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                    placeholder={t('formContactPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">{t('formEmail')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">{t('formPhone')}</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                    placeholder={t('formPhonePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">{t('formCountry')}</label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  >
                    <option value="">{t('formCountryPlaceholder')}</option>
                    <option value="中國大陸">{t('formCountryChina')}</option>
                    <option value="台灣">{t('formCountryTaiwan')}</option>
                    <option value="香港">{t('formCountryHongKong')}</option>
                    <option value="韓國">{t('formCountryKorea')}</option>
                    <option value="新加坡">{t('formCountrySingapore')}</option>
                    <option value="馬來西亞">{t('formCountryMalaysia')}</option>
                    <option value="泰國">{t('formCountryThailand')}</option>
                    <option value="越南">{t('formCountryVietnam')}</option>
                    <option value="印尼">{t('formCountryIndonesia')}</option>
                    <option value="菲律賓">{t('formCountryPhilippines')}</option>
                    <option value="其他">{t('formCountryOther')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">{t('formBusinessType')}</label>
                  <select
                    required
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  >
                    <option value="">{t('formCountryPlaceholder')}</option>
                    <option value="旅行社">{t('formBusinessTravel')}</option>
                    <option value="醫療中介">{t('formBusinessMedical')}</option>
                    <option value="高爾夫旅遊">{t('formBusinessGolf')}</option>
                    <option value="商務考察">{t('formBusinessInspection')}</option>
                    <option value="OTA平台">{t('formBusinessOTA')}</option>
                    <option value="其他">{t('formBusinessOther')}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">{t('formMessage')}</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all resize-none"
                    placeholder={t('formMessagePlaceholder')}
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gold-500 text-white font-medium rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t('formSubmitting')}
                      </>
                    ) : (
                      <>
                        {t('formSubmitButton')}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-brand-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-gold-400" />
                </div>
                <div className="text-sm text-neutral-400 mb-1">{t('contactEmailLabel')}</div>
                <a href="mailto:haoyuan@niijima-koutsu.jp" className="text-white hover:text-gold-400 transition-colors">
                  haoyuan@niijima-koutsu.jp
                </a>
              </div>
              <div>
                <div className="w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={24} className="text-gold-400" />
                </div>
                <div className="text-sm text-neutral-400 mb-1">{t('contactPhoneLabel')}</div>
                <a href="tel:+81-6-6632-8807" className="text-white hover:text-gold-400 transition-colors">
                  +81-6-6632-8807
                </a>
              </div>
              <div>
                <div className="w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={24} className="text-gold-400" />
                </div>
                <div className="text-sm text-neutral-400 mb-1">{t('contactAddressLabel')}</div>
                <div className="text-white">
                  {currentLang === 'en' ? '1-2-21-602 Daikoku, Naniwa-ku, Osaka 556-0014, Japan' : currentLang === 'zh-TW' ? '大阪府大阪市浪速區大國1-2-21-602' : '大阪府大阪市浪速区大国1-2-21-602'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
