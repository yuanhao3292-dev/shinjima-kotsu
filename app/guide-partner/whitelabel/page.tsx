'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_SELECTED_PAGES } from '@/lib/whitelabel-config';
import { SUBSCRIPTION_PLANS } from '@/lib/whitelabel-config';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  Globe,
  Palette,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Save,
  Package,
  ChevronRight,
  Car,
  User,
} from 'lucide-react';

const translations = {
  pageTitle: {
    ja: '販売ページ',
    'zh-CN': '分销页面',
    'zh-TW': '分銷頁面',
    en: 'Distribution Page',
  },
  headerTitle: {
    ja: '販売ページ',
    'zh-CN': '分销页面',
    'zh-TW': '分銷頁面',
    en: 'Distribution Page',
  },
  headerDesc: {
    ja: 'あなた専用のブランドサイトを構築',
    'zh-CN': '创建你的专属网站',
    'zh-TW': '建立你的專屬網站',
    en: 'Build your own branded website',
  },
  guideNotFoundTitle: {
    ja: 'ガイド情報が見つかりません',
    'zh-CN': '未找到导游资料',
    'zh-TW': '未找到導遊資料',
    en: 'Guide Profile Not Found',
  },
  guideNotFoundDesc: {
    ja: 'お客様のアカウントはまだガイドIDと紐づいていないため、販売ページ機能をご利用いただけません。\n管理者にお問い合わせいただき、アカウントの紐づけを完了してください。',
    'zh-CN': '您的账户尚未关联导游身份，无法使用分销页面功能。\n请联系管理员完成账户关联。',
    'zh-TW': '您的帳戶尚未關聯導遊身份，無法使用分銷頁面功能。\n請聯繫管理員完成帳戶關聯。',
    en: 'Your account is not linked to a guide identity. Distribution page features are unavailable.\nPlease contact an administrator to complete account linking.',
  },
  guideNotFoundError: {
    ja: 'ガイド情報が見つかりません。アカウントがガイドIDと紐づいているかご確認ください。',
    'zh-CN': '未找到您的导游资料。请确认您的账户已关联导游身份。',
    'zh-TW': '未找到您的導遊資料。請確認您的帳戶已關聯導遊身份。',
    en: 'Guide profile not found. Please confirm your account is linked to a guide identity.',
  },
  subscriptionCancelled: {
    ja: 'サブスクリプションがキャンセルされました。',
    'zh-CN': '订阅已取消。',
    'zh-TW': '訂閱已取消。',
    en: 'Subscription cancelled.',
  },
  subscriptionPlan: {
    ja: 'サブスクリプションプラン',
    'zh-CN': '订阅方案',
    'zh-TW': '訂閱方案',
    en: 'Subscription Plan',
  },
  choosePlan: {
    ja: 'お客様に合ったプランをお選びください',
    'zh-CN': '选择适合您的订阅方案',
    'zh-TW': '選擇適合您的訂閱方案',
    en: 'Choose the plan that suits you',
  },
  subscribed: {
    ja: '購読中',
    'zh-CN': '已订阅',
    'zh-TW': '已訂閱',
    en: 'Subscribed',
  },
  notSubscribed: {
    ja: '未購読',
    'zh-CN': '未订阅',
    'zh-TW': '未訂閱',
    en: 'Not Subscribed',
  },
  perMonth: {
    ja: '/月',
    'zh-CN': '/月',
    'zh-TW': '/月',
    en: '/mo',
  },
  processing: {
    ja: '処理中...',
    'zh-CN': '处理中...',
    'zh-TW': '處理中...',
    en: 'Processing...',
  },
  subscribeNow: {
    ja: '今すぐ購読',
    'zh-CN': '立即订阅',
    'zh-TW': '立即訂閱',
    en: 'Subscribe Now',
  },
  nextRenewalDate: {
    ja: '次回更新日：',
    'zh-CN': '下次续费日期：',
    'zh-TW': '下次續費日期：',
    en: 'Next renewal: ',
  },
  manageSubscription: {
    ja: 'サブスクリプション管理',
    'zh-CN': '管理订阅',
    'zh-TW': '管理訂閱',
    en: 'Manage Subscription',
  },
  planProfessional: {
    ja: 'プロフェッショナル',
    'zh-CN': '专业版',
    'zh-TW': '專業版',
    en: 'Professional',
  },
  featureAllPages: {
    ja: '全ページ対応',
    'zh-CN': '全部页面',
    'zh-TW': '全部頁面',
    en: 'All Pages',
  },
  featureSubdomain: {
    ja: '専用サブドメイン',
    'zh-CN': '专属子域名',
    'zh-TW': '專屬子域名',
    en: 'Custom Subdomain',
  },
  featureBrandName: {
    ja: 'ブランド名変更',
    'zh-CN': '品牌名称替换',
    'zh-TW': '品牌名稱替換',
    en: 'Brand Name Replacement',
  },
  featureContact: {
    ja: '連絡先表示',
    'zh-CN': '联系方式展示',
    'zh-TW': '聯繫方式展示',
    en: 'Contact Info Display',
  },
  featureAnalytics: {
    ja: 'アクセス統計',
    'zh-CN': '访问统计',
    'zh-TW': '訪問統計',
    en: 'Visit Analytics',
  },
  yourPageLink: {
    ja: 'あなた専用のページリンク',
    'zh-CN': '您的专属页面链接',
    'zh-TW': '您的專屬頁面連結',
    en: 'Your Exclusive Page Link',
  },
  copyLink: {
    ja: 'リンクをコピー',
    'zh-CN': '复制链接',
    'zh-TW': '複製連結',
    en: 'Copy Link',
  },
  openPage: {
    ja: 'ページを開く',
    'zh-CN': '打开页面',
    'zh-TW': '開啟頁面',
    en: 'Open Page',
  },
  setSlugFirst: {
    ja: '専用リンクを生成するために、まずURL識別子を設定してください',
    'zh-CN': '请先设置 URL 标识以生成您的专属链接',
    'zh-TW': '請先設置 URL 標識以生成您的專屬連結',
    en: 'Set your URL identifier first to generate your exclusive link',
  },
  pageNotGenerated: {
    ja: '販売ページがまだ生成されていません',
    'zh-CN': '分销页面尚未生成',
    'zh-TW': '分銷頁面尚未生成',
    en: 'Distribution page not yet generated',
  },
  pageNotGeneratedHint: {
    ja: '下記のブランド設定と連絡先を入力し、「設定を保存」ボタンをクリックして専用販売ページを生成してください。',
    'zh-CN': '请先完善下方的品牌设置和联系方式，然后点击「保存设置」按钮以生成您的专属分销页面。',
    'zh-TW': '請先完善下方的品牌設置和聯繫方式，然後點擊「保存設置」按鈕以生成您的專屬分銷頁面。',
    en: 'Please complete the brand settings and contact information below, then click "Save Settings" to generate your exclusive distribution page.',
  },
  pageViews: {
    ja: 'ページ閲覧数',
    'zh-CN': '页面浏览量',
    'zh-TW': '頁面瀏覽量',
    en: 'Page Views',
  },
  orderConversions: {
    ja: '注文コンバージョン',
    'zh-CN': '订单转化',
    'zh-TW': '訂單轉化',
    en: 'Order Conversions',
  },
  productCenter: {
    ja: '選品センター',
    'zh-CN': '选品中心',
    'zh-TW': '選品中心',
    en: 'Product Center',
  },
  productCenterDesc: {
    ja: 'ページに表示する医療サービス、車両などの製品モジュールを選択してください',
    'zh-CN': '选择要在您页面展示的医疗服务、车辆等产品模块',
    'zh-TW': '選擇要在您頁面展示的醫療服務、車輛等產品模組',
    en: 'Select medical services, vehicles, and other modules to display on your page',
  },
  enterProductCenter: {
    ja: '選品に進む',
    'zh-CN': '进入选品',
    'zh-TW': '進入選品',
    en: 'Browse Products',
  },
  serviceModules: {
    ja: 'サービスモジュール',
    'zh-CN': '服务模块',
    'zh-TW': '服務模組',
    en: 'Service Modules',
  },
  freeChoice: {
    ja: '自由に選択',
    'zh-CN': '自由选择',
    'zh-TW': '自由選擇',
    en: 'Free Choice',
  },
  selfIntroduction: {
    ja: '自己紹介',
    'zh-CN': '自我介绍',
    'zh-TW': '自我介紹',
    en: 'Self Introduction',
  },
  multipleTemplates: {
    ja: '複数テンプレート',
    'zh-CN': '多种模板',
    'zh-TW': '多種模板',
    en: 'Multiple Templates',
  },
  vehicleDisplay: {
    ja: '車両展示',
    'zh-CN': '车辆展示',
    'zh-TW': '車輛展示',
    en: 'Vehicle Display',
  },
  richModels: {
    ja: '豊富な車種',
    'zh-CN': '丰富车型',
    'zh-TW': '豐富車型',
    en: 'Various Models',
  },
  brandSettings: {
    ja: 'ブランド設定',
    'zh-CN': '品牌设置',
    'zh-TW': '品牌設置',
    en: 'Brand Settings',
  },
  pageIdentifier: {
    ja: '専用ページ識別子',
    'zh-CN': '专属页面标识',
    'zh-TW': '專屬頁面標識',
    en: 'Page Identifier',
  },
  slugHint: {
    ja: '小文字の英数字とハイフンのみ使用可能（3～50文字）',
    'zh-CN': '只能使用小写字母、数字和连字符（3-50个字符）',
    'zh-TW': '只能使用小寫字母、數字和連字符（3-50個字符）',
    en: 'Only lowercase letters, numbers, and hyphens (3-50 characters)',
  },
  brandName: {
    ja: 'ブランド名',
    'zh-CN': '品牌名称',
    'zh-TW': '品牌名稱',
    en: 'Brand Name',
  },
  brandNamePlaceholder: {
    ja: '例：日本カスタムツアー - 田中',
    'zh-CN': '例：日本定制游 - 小王',
    'zh-TW': '例：日本定制遊 - 小王',
    en: 'e.g.: Japan Custom Tours - John',
  },
  brandNameHint: {
    ja: 'ナビゲーションバーとフッターのブランド名を置き換えます',
    'zh-CN': '将替换导航栏和页脚的品牌名称',
    'zh-TW': '將替換導航欄和頁腳的品牌名稱',
    en: 'Will replace the brand name in the navigation bar and footer',
  },
  brandEnglishName: {
    ja: 'ブランド英語名',
    'zh-CN': '品牌英文名',
    'zh-TW': '品牌英文名',
    en: 'Brand English Name',
  },
  brandEnglishPlaceholder: {
    ja: '例：Bespoke Japan Travel',
    'zh-CN': '例：Bespoke Japan Travel',
    'zh-TW': '例：Bespoke Japan Travel',
    en: 'e.g.: Bespoke Japan Travel',
  },
  brandEnglishHint: {
    ja: 'ナビゲーションバーのブランド名の下に表示される英語サブタイトル',
    'zh-CN': '显示在导航栏品牌名称下方的英文副标题',
    'zh-TW': '顯示在導航欄品牌名稱下方的英文副標題',
    en: 'English subtitle displayed below the brand name in the navigation bar',
  },
  contactInfo: {
    ja: '連絡先情報',
    'zh-CN': '联系方式',
    'zh-TW': '聯繫方式',
    en: 'Contact Information',
  },
  contactInfoDesc: {
    ja: 'これらの情報は販売ページ右下のフローティング連絡ボタンに表示され、お客様が簡単にご連絡いただけます',
    'zh-CN': '这些信息将显示在分销页面右下角的悬浮联系按钮中，方便客户联系您',
    'zh-TW': '這些資訊將顯示在分銷頁面右下角的懸浮聯繫按鈕中，方便客戶聯繫您',
    en: 'This information will be displayed in the floating contact button on the bottom right of your page, making it easy for customers to reach you',
  },
  wechatId: {
    ja: 'WeChat ID',
    'zh-CN': '微信号',
    'zh-TW': '微信號',
    en: 'WeChat ID',
  },
  lineId: {
    ja: 'LINE ID',
    'zh-CN': 'LINE ID',
    'zh-TW': 'LINE ID',
    en: 'LINE ID',
  },
  displayPhone: {
    ja: '表示用電話番号',
    'zh-CN': '显示电话',
    'zh-TW': '顯示電話',
    en: 'Display Phone',
  },
  email: {
    ja: 'メールアドレス',
    'zh-CN': '邮箱',
    'zh-TW': '郵箱',
    en: 'Email',
  },
  emailHint: {
    ja: 'このメールアドレスは販売ページの連絡先に表示されます',
    'zh-CN': '此邮箱将显示在分销页面的联系方式中',
    'zh-TW': '此郵箱將顯示在分銷頁面的聯繫方式中',
    en: 'This email will be displayed in the contact section of your distribution page',
  },
  saveSettings: {
    ja: '設定を保存',
    'zh-CN': '保存设置',
    'zh-TW': '保存設置',
    en: 'Save Settings',
  },
  needSubscription: {
    ja: 'ブランド展示サイト機能を使用するにはサブスクリプションが必要です',
    'zh-CN': '需要订阅才能使用品牌展示网站功能',
    'zh-TW': '需要訂閱才能使用品牌展示網站功能',
    en: 'Subscription required to use the branded website feature',
  },
  needSubscriptionDesc: {
    ja: '月額わずか¥1,980で専用ブランド展示ページを取得でき、お客様がリンクからアクセスすると自動的にあなたに帰属されます。',
    'zh-CN': '每月仅需 ¥1,980，即可获得专属品牌展示页面，所有客户通过您的链接访问都将自动归属于您。',
    'zh-TW': '每月僅需 ¥1,980，即可獲得專屬品牌展示頁面，所有客戶通過您的連結訪問都將自動歸屬於您。',
    en: 'For just ¥1,980/month, get your exclusive branded page. All customers visiting through your link will be automatically attributed to you.',
  },
  legalNotice: {
    ja: '重要な法的事項',
    'zh-CN': '重要法律声明',
    'zh-TW': '重要法律聲明',
    en: 'Important Legal Notice',
  },
  legalLine1: {
    ja: 'ブランド展示サイトは新島交通株式会社システムの許可された使用です',
    'zh-CN': '品牌展示网站为新岛交通株式会社系统的授权使用',
    'zh-TW': '品牌展示網站為新島交通株式會社系統的授權使用',
    en: 'The branded website is an authorized use of Niijima Kotsu Co., Ltd. system',
  },
  legalLine2: {
    ja: 'サイト上のすべての旅行サービスは新島交通株式会社（大阪府知事登録旅行業 第2-3115号）が提供しています',
    'zh-CN': '网站上的所有旅行服务由新岛交通株式会社（大阪府知事登录旅行业 第2-3115号）提供',
    'zh-TW': '網站上的所有旅行服務由新島交通株式會社（大阪府知事登錄旅行業 第2-3115號）提供',
    en: 'All travel services on the website are provided by Niijima Kotsu Co., Ltd. (Osaka Governor Registration Travel Agency No. 2-3115)',
  },
  legalLine3: {
    ja: 'あなたの役割は「お客様紹介者」であり、独立した旅行サービス提供者ではありません',
    'zh-CN': '您的角色为「客户介绍者」，不是独立的旅行服务提供者',
    'zh-TW': '您的角色為「客戶介紹者」，不是獨立的旅行服務提供者',
    en: 'Your role is "Customer Introducer", not an independent travel service provider',
  },
  legalLine4: {
    ja: 'すべての旅行サービス契約は新島交通とお客様の間で締結されます',
    'zh-CN': '所有旅行服务合同均在新岛交通与客户之间签订',
    'zh-TW': '所有旅行服務合同均在新島交通與客戶之間簽訂',
    en: 'All travel service contracts are concluded between Niijima Kotsu and the customer',
  },
  legalLine5: {
    ja: 'サイトのフッターにはサービス提供者情報と旅行業登録番号が自動的に表示されます',
    'zh-CN': '网站底部将自动显示服务提供者信息及旅行业登录号',
    'zh-TW': '網站底部將自動顯示服務提供者資訊及旅行業登錄號',
    en: 'The website footer will automatically display service provider information and travel agency registration number',
  },
  successTitle: {
    ja: 'サブスクリプション成功！',
    'zh-CN': '订阅成功！',
    'zh-TW': '訂閱成功！',
    en: 'Subscription Successful!',
  },
  successDesc: {
    ja: 'おめでとうございます！販売ページサブスクリプションが有効になりました。\n専用ブランドページの設定を始めましょう。',
    'zh-CN': '恭喜您！分销页面订阅已激活。\n现在可以开始设置您的专属品牌页面了。',
    'zh-TW': '恭喜您！分銷頁面訂閱已啟用。\n現在可以開始設置您的專屬品牌頁面了。',
    en: 'Congratulations! Your distribution page subscription is now active.\nYou can now start setting up your exclusive branded page.',
  },
  successPlanLabel: {
    ja: 'サブスクリプションプラン',
    'zh-CN': '订阅套餐',
    'zh-TW': '訂閱套餐',
    en: 'Subscription Plan',
  },
  successPlanValue: {
    ja: '販売ページ - 月額',
    'zh-CN': '分销页面 - 月度',
    'zh-TW': '分銷頁面 - 月度',
    en: 'Distribution Page - Monthly',
  },
  successFeeLabel: {
    ja: 'サブスクリプション料金',
    'zh-CN': '订阅费用',
    'zh-TW': '訂閱費用',
    en: 'Subscription Fee',
  },
  successEmailNotice: {
    ja: '確認メールを送信しました。\n登録メールアドレスにサブスクリプション確認メールを送信しましたので、ご確認ください。',
    'zh-CN': '确认邮件已发送\n我们已向您的注册邮箱发送了订阅确认邮件，请注意查收。',
    'zh-TW': '確認郵件已發送\n我們已向您的註冊郵箱發送了訂閱確認郵件，請注意查收。',
    en: 'Confirmation email sent\nWe have sent a subscription confirmation email to your registered email address. Please check your inbox.',
  },
  startSetup: {
    ja: '販売ページの設定を開始',
    'zh-CN': '开始设置分销页面',
    'zh-TW': '開始設置分銷頁面',
    en: 'Start Setting Up Distribution Page',
  },
  errSlugTaken: {
    ja: 'このURL識別子は既に使用されています。別の名前を選択してください',
    'zh-CN': '此 URL 标识已被使用，请选择其他名称',
    'zh-TW': '此 URL 標識已被使用，請選擇其他名稱',
    en: 'This URL identifier is already in use. Please choose a different name',
  },
  errSubscribeFirst: {
    ja: '先にサブスクリプションを購入してください',
    'zh-CN': '请先订阅分销服务',
    'zh-TW': '請先訂閱分銷服務',
    en: 'Please subscribe first',
  },
  errSaveFailed: {
    ja: '保存に失敗しました',
    'zh-CN': '保存失败',
    'zh-TW': '保存失敗',
    en: 'Save failed',
  },
  errSlugTakenOther: {
    ja: 'このURL識別子は他のガイドが使用しています',
    'zh-CN': '此 URL 标识已被其他导游使用',
    'zh-TW': '此 URL 標識已被其他導遊使用',
    en: 'This URL identifier is already used by another guide',
  },
  settingsSaved: {
    ja: '設定を保存しました',
    'zh-CN': '设置已保存',
    'zh-TW': '設置已保存',
    en: 'Settings saved',
  },
  errSaveRetry: {
    ja: '保存に失敗しました。後ほど再度お試しください',
    'zh-CN': '保存失败，请稍后重试',
    'zh-TW': '保存失敗，請稍後重試',
    en: 'Save failed. Please try again later',
  },
  errSubscriptionFailed: {
    ja: 'サブスクリプションの作成に失敗しました',
    'zh-CN': '创建订阅失败',
    'zh-TW': '創建訂閱失敗',
    en: 'Failed to create subscription',
  },
  errSubscriptionRetry: {
    ja: 'サブスクリプションの作成に失敗しました。後ほど再度お試しください',
    'zh-CN': '创建订阅失败，请稍后重试',
    'zh-TW': '創建訂閱失敗，請稍後重試',
    en: 'Failed to create subscription. Please try again later',
  },
  errManageFailed: {
    ja: 'サブスクリプション管理を開けません',
    'zh-CN': '无法打开订阅管理',
    'zh-TW': '無法打開訂閱管理',
    en: 'Unable to open subscription management',
  },
  errManageRetry: {
    ja: 'サブスクリプション管理を開けません。後ほど再度お試しください',
    'zh-CN': '无法打开订阅管理，请稍后重试',
    'zh-TW': '無法打開訂閱管理，請稍後重試',
    en: 'Unable to open subscription management. Please try again later',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

interface GuideWhiteLabelData {
  id: string;
  name: string;
  slug: string | null;
  brand_name: string | null;
  brand_logo_url: string | null;
  brand_color: string;
  contact_wechat: string | null;
  contact_line: string | null;
  contact_display_phone: string | null;
  email: string | null;
  subscription_status: 'inactive' | 'active' | 'cancelled' | 'past_due';
  subscription_plan: string | null;
  subscription_end_date: string | null;
  whitelabel_views: number;
  whitelabel_conversions: number;
}

export default function WhiteLabelSettingsPage() {
  const [guide, setGuide] = useState<GuideWhiteLabelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasWhiteLabelConfig, setHasWhiteLabelConfig] = useState(true);

  // 表单状态
  const [formData, setFormData] = useState({
    slug: '',
    brandName: '',
    brandTagline: '',
    contactWechat: '',
    contactLine: '',
    contactDisplayPhone: '',
    contactEmail: '',
    selectedPages: DEFAULT_SELECTED_PAGES as string[],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const lang = useLanguage();

  // 分销页面 URL（路径模式）
  const whiteLabelUrl = guide?.slug
    ? `https://bespoketrip.jp/g/${guide.slug}`
    : null;

  // 初始加载导游数据（仅执行一次）
  useEffect(() => {
    loadGuideData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 检查订阅回调参数（仅在 URL 参数变化时执行）
  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      // 付款成功后，主动同步订阅状态（Webhook 可能延迟）
      syncSubscriptionStatus();
      setShowSuccessModal(true);
      // 清除 URL 参数，避免刷新时重复显示
      window.history.replaceState({}, '', '/guide-partner/whitelabel');
    } else if (subscriptionStatus === 'cancelled') {
      setMessage({ type: 'error', text: t('subscriptionCancelled', lang) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 从 Stripe 同步订阅状态（Webhook 备用机制）
  const syncSubscriptionStatus = async () => {
    if (!guide?.id) {
      const checkAndSync = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: guideData } = await supabase
          .from('guides')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (guideData?.id) {
          try {
            await fetch('/api/whitelabel/sync-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ guideId: guideData.id }),
            });
            loadGuideData();
          } catch (error) {
            console.error('Subscription sync failed:', error);
          }
        }
      };
      checkAndSync();
      return;
    }

    try {
      await fetch('/api/whitelabel/sync-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideId: guide.id }),
      });
      loadGuideData();
    } catch (error) {
      console.error('Subscription sync failed:', error);
    }
  };

  // ESC 键关闭弹窗
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSuccessModal) {
        setShowSuccessModal(false);
        loadGuideData();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showSuccessModal]);

  const loadGuideData = async () => {
    try {
      const response = await fetch('/api/whitelabel/settings');

      if (response.status === 401) {
        router.push('/guide-partner/login');
        return;
      }

      if (response.status === 404) {
        const errorData = await response.json();
        console.error('Guide profile not found:', errorData);
        setMessage({
          type: 'error',
          text: t('guideNotFoundError', lang)
        });
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load guide data');
      }

      const guideData = await response.json();

      setGuide({
        id: guideData.id,
        name: guideData.name,
        slug: guideData.slug,
        brand_name: guideData.brandName,
        brand_logo_url: guideData.brandLogoUrl,
        brand_color: guideData.brandColor,
        contact_wechat: guideData.contactWechat,
        contact_line: guideData.contactLine,
        contact_display_phone: guideData.contactDisplayPhone,
        email: guideData.email,
        subscription_status: guideData.subscriptionStatus,
        subscription_plan: guideData.subscriptionPlan,
        subscription_end_date: guideData.subscriptionEndDate,
        whitelabel_views: guideData.whiteLabelViews,
        whitelabel_conversions: guideData.whiteLabelConversions,
      });
      setFormData({
        slug: guideData.slug || '',
        brandName: guideData.brandName || '',
        brandTagline: guideData.brandTagline || '',
        contactWechat: guideData.contactWechat || '',
        contactLine: guideData.contactLine || '',
        contactDisplayPhone: guideData.contactDisplayPhone || '',
        contactEmail: guideData.email || '',
        selectedPages: guideData.selectedPages || DEFAULT_SELECTED_PAGES,
      });

      if (guideData.subscription_status === 'active') {
        const { data: wlConfig } = await supabase
          .from('guide_white_label')
          .select('id')
          .eq('guide_id', guideData.id)
          .single();
        setHasWhiteLabelConfig(!!wlConfig);
      }
    } catch (error) {
      console.error('Error loading guide data:', error);
      router.push('/guide-partner/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!guide) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/whitelabel/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug || null,
          brandName: formData.brandName || null,
          brandTagline: formData.brandTagline || null,
          contactWechat: formData.contactWechat || null,
          contactLine: formData.contactLine || null,
          contactDisplayPhone: formData.contactDisplayPhone || null,
          contactEmail: formData.contactEmail || null,
          selectedPages: formData.selectedPages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setMessage({ type: 'error', text: t('errSlugTaken', lang) });
        } else if (response.status === 403) {
          setMessage({ type: 'error', text: t('errSubscribeFirst', lang) });
        } else if (data.details) {
          const firstError = data.details[0];
          setMessage({ type: 'error', text: firstError?.message || t('errSaveFailed', lang) });
        } else {
          setMessage({ type: 'error', text: data.error || t('errSaveFailed', lang) });
        }
        setSaving(false);
        return;
      }

      const { error: wlError } = await supabase
        .from('guide_white_label')
        .upsert({
          guide_id: guide.id,
          slug: formData.slug,
          display_name: formData.brandName || guide.name,
          contact_wechat: formData.contactWechat || null,
          contact_line: formData.contactLine || null,
          contact_phone: formData.contactDisplayPhone || null,
          contact_email: formData.contactEmail || null,
          is_published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'guide_id',
        });

      if (wlError) {
        console.error('[handleSave] guide_white_label upsert error:', wlError);
        if (wlError.code === '23505') {
          setMessage({ type: 'error', text: t('errSlugTakenOther', lang) });
          setSaving(false);
          return;
        }
      }

      setMessage({ type: 'success', text: t('settingsSaved', lang) });
      setHasWhiteLabelConfig(true);
      loadGuideData();
    } catch (error) {
      setMessage({ type: 'error', text: t('errSaveRetry', lang) });
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = async (plan: 'professional' = 'professional') => {
    if (!guide) return;

    if (subscribing) return;
    setSubscribing(true);
    setMessage(null);

    console.log('[handleSubscribe] Starting subscription, guide info:', { id: guide.id, name: guide.name });

    try {
      const requestBody = {
        guideId: guide.id,
        successUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=success`,
        cancelUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=cancelled`,
      };
      console.log('[handleSubscribe] Sending request:', requestBody);

      const response = await fetch('/api/whitelabel/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: guide.id,
          plan,
          successUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=success`,
          cancelUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=cancelled`,
        }),
      });

      console.log('[handleSubscribe] Response status:', response.status);

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.error || t('errSubscriptionFailed', lang) });
        setSubscribing(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('errSubscriptionRetry', lang) });
      setSubscribing(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!guide || managingSubscription) return;

    setManagingSubscription(true);
    setSubscriptionError(null);

    try {
      const response = await fetch('/api/whitelabel/manage-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: guide.id,
          returnUrl: `${window.location.origin}/guide-partner/whitelabel`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setSubscriptionError(data.error || t('errManageFailed', lang));
        setManagingSubscription(false);
      }
    } catch (error) {
      setSubscriptionError(t('errManageRetry', lang));
      setManagingSubscription(false);
    }
  };

  const copyUrl = () => {
    if (whiteLabelUrl) {
      navigator.clipboard.writeText(whiteLabelUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDateLocale = (l: Language): string => {
    const localeMap: Record<Language, string> = {
      ja: 'ja-JP',
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      en: 'en-US',
    };
    return localeMap[l];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <GuideSidebar pageTitle={t('pageTitle', lang)} />
        <main className="lg:ml-64 pt-16 lg:pt-0">
          <div className="p-6 lg:p-8 max-w-4xl">
            {message && (
              <div className="p-4 flex items-center gap-3 bg-red-50 text-red-800 border border-red-200">
                <AlertCircle size={20} />
                <span>{message.text}</span>
              </div>
            )}
            <div className="mt-6 bg-white border p-6 text-center">
              <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
              <h2 className="text-xl font-bold font-serif text-brand-900 mb-2">{t('guideNotFoundTitle', lang)}</h2>
              <p className="text-neutral-600 mb-6 whitespace-pre-line">
                {t('guideNotFoundDesc', lang)}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isSubscribed = guide.subscription_status === 'active';

  return (
    <div className="min-h-screen bg-neutral-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />

      {/* 订阅成功弹窗 */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowSuccessModal(false);
            loadGuideData();
          }}
        >
          <div
            className="bg-white max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 成功图标 */}
            <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>

            {/* 标题 */}
            <h2 className="text-2xl font-bold font-serif text-brand-900 mb-2">
              {t('successTitle', lang)}
            </h2>

            {/* 描述 */}
            <p className="text-neutral-600 mb-6 whitespace-pre-line">
              {t('successDesc', lang)}
            </p>

            {/* 订阅信息 */}
            <div className="bg-neutral-50 p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-500">{t('successPlanLabel', lang)}</span>
                <span className="font-medium">{t('successPlanValue', lang)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">{t('successFeeLabel', lang)}</span>
                <span className="font-bold text-brand-600">¥1,980{t('perMonth', lang)}</span>
              </div>
            </div>

            {/* 提示 */}
            <div className="bg-brand-50 border border-brand-200 p-3 mb-6 text-left">
              <p className="text-brand-800 text-sm whitespace-pre-line">
                {t('successEmailNotice', lang)}
              </p>
            </div>

            {/* 按钮 */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                loadGuideData();
              }}
              className="w-full py-3 bg-brand-600 text-white font-medium hover:bg-brand-700 transition"
            >
              {t('startSetup', lang)}
            </button>
          </div>
        </div>
      )}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-serif text-brand-900">{t('headerTitle', lang)}</h1>
          <p className="text-neutral-500 mt-1">{t('headerDesc', lang)}</p>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`p-4 flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* 订阅方案选择 */}
        <div className="bg-white border p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold font-serif flex items-center gap-2">
                <CreditCard size={20} />
                {t('subscriptionPlan', lang)}
              </h2>
              <p className="text-neutral-500 text-sm mt-1">
                {t('choosePlan', lang)}
              </p>
            </div>
            <div className={`px-3 py-1 text-sm font-medium ${
              isSubscribed
                ? 'bg-green-100 text-green-700'
                : 'bg-neutral-100 text-neutral-600'
            }`}>
              {isSubscribed ? t('subscribed', lang) : t('notSubscribed', lang)}
            </div>
          </div>

          {/* 专业版 */}
          <div className={`p-5 border-2 transition ${
            isSubscribed
              ? 'border-brand-500 bg-brand-50'
              : 'border-neutral-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{t('planProfessional', lang)}</h3>
              <span className="text-2xl font-bold">¥{SUBSCRIPTION_PLANS.professional.priceJpy}<span className="text-sm font-normal text-neutral-500">{t('perMonth', lang)}</span></span>
            </div>
            <ul className="space-y-2 text-sm text-neutral-600 mb-4">
              {(['featureAllPages', 'featureSubdomain', 'featureBrandName', 'featureContact', 'featureAnalytics'] as const).map((key) => (
                <li key={key} className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  {t(key, lang)}
                </li>
              ))}
            </ul>
            {!isSubscribed && (
              <button
                onClick={() => handleSubscribe('professional')}
                disabled={subscribing}
                className="w-full py-2 bg-brand-600 text-white hover:bg-brand-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {subscribing && <Loader2 size={16} className="animate-spin" />}
                {subscribing ? t('processing', lang) : t('subscribeNow', lang)}
              </button>
            )}
          </div>

          {isSubscribed && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  {t('nextRenewalDate', lang)}{guide.subscription_end_date ? new Date(guide.subscription_end_date).toLocaleDateString(getDateLocale(lang)) : '-'}
                </p>
                <button
                  onClick={handleManageSubscription}
                  disabled={managingSubscription}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {managingSubscription && <Loader2 size={14} className="animate-spin" />}
                  {t('manageSubscription', lang)}
                </button>
              </div>
              {subscriptionError && (
                <div className="p-3 bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{subscriptionError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 分销页面 URL */}
        {isSubscribed && (
          <div className="bg-white border p-6">
            <h2 className="text-lg font-bold font-serif flex items-center gap-2 mb-4">
              <Globe size={20} />
              {t('yourPageLink', lang)}
            </h2>

            {whiteLabelUrl ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-neutral-50 font-mono text-sm truncate">
                  {whiteLabelUrl}
                </div>
                <button
                  onClick={copyUrl}
                  className="p-3 border hover:bg-neutral-50 transition"
                  title={t('copyLink', lang)}
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
                <a
                  href={whiteLabelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border hover:bg-neutral-50 transition"
                  title={t('openPage', lang)}
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">
                {t('setSlugFirst', lang)}
              </p>
            )}

            {/* 分销页面配置缺失提示 */}
            {!hasWhiteLabelConfig && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 font-medium text-sm">{t('pageNotGenerated', lang)}</p>
                  <p className="text-amber-700 text-sm mt-1">
                    {t('pageNotGeneratedHint', lang)}
                  </p>
                </div>
              </div>
            )}

            {/* 统计数据 */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-brand-50">
                <div className="text-2xl font-bold text-brand-700">
                  {guide.whitelabel_views.toLocaleString()}
                </div>
                <div className="text-sm text-brand-600">{t('pageViews', lang)}</div>
              </div>
              <div className="p-4 bg-green-50">
                <div className="text-2xl font-bold text-green-700">
                  {guide.whitelabel_conversions.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">{t('orderConversions', lang)}</div>
              </div>
            </div>
          </div>
        )}

        {/* 选品中心入口 */}
        {isSubscribed && (
          <div className="bg-gradient-to-r from-brand-700 to-brand-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 flex items-center justify-center">
                  <Package size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif">{t('productCenter', lang)}</h2>
                  <p className="text-white/80 text-sm mt-1">
                    {t('productCenterDesc', lang)}
                  </p>
                </div>
              </div>
              <Link
                href="/guide-partner/product-center"
                className="flex items-center gap-2 bg-white text-brand-600 px-5 py-3 font-medium hover:bg-white/90 transition"
              >
                {t('enterProductCenter', lang)}
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* 快速信息 */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/10 p-3">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                  <Package size={14} />
                  {t('serviceModules', lang)}
                </div>
                <div className="text-lg font-bold">{t('freeChoice', lang)}</div>
              </div>
              <div className="bg-white/10 p-3">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                  <User size={14} />
                  {t('selfIntroduction', lang)}
                </div>
                <div className="text-lg font-bold">{t('multipleTemplates', lang)}</div>
              </div>
              <div className="bg-white/10 p-3">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                  <Car size={14} />
                  {t('vehicleDisplay', lang)}
                </div>
                <div className="text-lg font-bold">{t('richModels', lang)}</div>
              </div>
            </div>
          </div>
        )}

        {/* 品牌设置 */}
        <div className={`bg-white border p-6 ${!isSubscribed ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-bold font-serif flex items-center gap-2 mb-6">
            <Palette size={20} />
            {t('brandSettings', lang)}
          </h2>

          <div className="space-y-6">
            {/* URL 标识 */}
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-2">
                {t('pageIdentifier', lang)}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-sm">bespoketrip.jp/g/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  placeholder="your-name"
                  className="w-40 px-4 py-2 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {t('slugHint', lang)}
              </p>
            </div>

            {/* 品牌名称 */}
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-2">
                {t('brandName', lang)}
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder={t('brandNamePlaceholder', lang)}
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="mt-1 text-xs text-neutral-500">
                {t('brandNameHint', lang)}
              </p>
            </div>

            {/* 品牌英文名 (导航栏副标题) */}
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-2">
                {t('brandEnglishName', lang)}
              </label>
              <input
                type="text"
                value={formData.brandTagline}
                onChange={(e) => setFormData({ ...formData, brandTagline: e.target.value })}
                placeholder={t('brandEnglishPlaceholder', lang)}
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="mt-1 text-xs text-neutral-500">
                {t('brandEnglishHint', lang)}
              </p>
            </div>

          </div>
        </div>

        {/* 联系方式 */}
        <div className={`bg-white border p-6 ${!isSubscribed ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-bold font-serif flex items-center gap-2 mb-6">
            <MessageCircle size={20} />
            {t('contactInfo', lang)}
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            {t('contactInfoDesc', lang)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-2">
                {t('wechatId', lang)}
              </label>
              <input
                type="text"
                value={formData.contactWechat}
                onChange={(e) => setFormData({ ...formData, contactWechat: e.target.value })}
                placeholder="your_wechat_id"
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-900 mb-2">
                {t('lineId', lang)}
              </label>
              <input
                type="text"
                value={formData.contactLine}
                onChange={(e) => setFormData({ ...formData, contactLine: e.target.value })}
                placeholder="your_line_id"
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-900 mb-2">
                {t('displayPhone', lang)}
              </label>
              <input
                type="tel"
                value={formData.contactDisplayPhone}
                onChange={(e) => setFormData({ ...formData, contactDisplayPhone: e.target.value })}
                placeholder="+86 138-xxxx-xxxx"
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-900 mb-2">
                {t('email', lang)}
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="mt-1 text-xs text-neutral-500">
                {t('emailHint', lang)}
              </p>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        {isSubscribed && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white hover:bg-brand-700 transition font-medium disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {t('saveSettings', lang)}
            </button>
          </div>
        )}

        {/* 未订阅提示 */}
        {!isSubscribed && (
          <div className="bg-amber-50 border border-amber-200 p-6 text-center">
            <AlertCircle size={32} className="mx-auto text-amber-500 mb-3" />
            <h3 className="font-bold text-amber-800 mb-2">{t('needSubscription', lang)}</h3>
            <p className="text-amber-700 text-sm mb-4">
              {t('needSubscriptionDesc', lang)}
            </p>
            <button
              onClick={() => handleSubscribe('professional')}
              disabled={subscribing}
              className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {subscribing && <Loader2 size={16} className="animate-spin" />}
              {subscribing ? t('processing', lang) : t('subscribeNow', lang)}
            </button>
          </div>
        )}

        {/* 法律声明 */}
        <div className="bg-brand-50 border border-brand-200 p-6">
          <h3 className="font-bold text-brand-800 mb-3 flex items-center gap-2">
            <AlertCircle size={18} />
            {t('legalNotice', lang)}
          </h3>
          <ul className="space-y-2 text-sm text-brand-700">
            <li>• {t('legalLine1', lang)}</li>
            <li>• {t('legalLine2', lang)}</li>
            <li>• {t('legalLine3', lang)}</li>
            <li>• {t('legalLine4', lang)}</li>
            <li>• {t('legalLine5', lang)}</li>
          </ul>
        </div>
        </div>
      </main>
    </div>
  );
}
