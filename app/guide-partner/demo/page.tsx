'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import {
  Car,
  User,
  Package,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  Users,
  Palette,
  Settings,
  Eye,
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

// ── Translations ──────────────────────────────────────────

const translations: Record<string, Record<Language, string>> = {
  // Page hero
  heroTagline: {
    ja: 'ホワイトラベル・インタラクティブデモ',
    'zh-TW': '白標品牌互動體驗',
    'zh-CN': '白标品牌互动体验',
    en: 'White-Label Interactive Demo',
  },
  heroTitle: {
    ja: 'あなたのブランドサイトを体験',
    'zh-TW': '體驗您的品牌網站',
    'zh-CN': '体验您的品牌网站',
    en: 'Experience Your Brand Site',
  },
  heroDesc: {
    ja: 'ブランド名、カラー、連絡先を入力して、リアルタイムプレビューをご覧ください。',
    'zh-TW': '輸入品牌名稱、選擇顏色、填寫聯繫方式，即時預覽您的專屬網站。',
    'zh-CN': '输入品牌名称、选择颜色、填写联系方式，即时预览您的专属网站。',
    en: 'Enter your brand name, pick colors, add contact info — see your site update in real time.',
  },
  // Panel tabs
  tabBrand: {
    ja: 'ブランド設定',
    'zh-TW': '品牌設定',
    'zh-CN': '品牌设置',
    en: 'Brand',
  },
  tabContact: {
    ja: '連絡先',
    'zh-TW': '聯繫方式',
    'zh-CN': '联系方式',
    en: 'Contact',
  },
  // Brand fields
  labelBrandName: {
    ja: 'ブランド名',
    'zh-TW': '品牌名稱',
    'zh-CN': '品牌名称',
    en: 'Brand Name',
  },
  placeholderBrandName: {
    ja: '例：東京プレミアムガイド',
    'zh-TW': '例：東京精品旅遊',
    'zh-CN': '例：东京精品旅游',
    en: 'e.g. Tokyo Premium Guide',
  },
  labelBrandColor: {
    ja: 'ブランドカラー',
    'zh-TW': '品牌色彩',
    'zh-CN': '品牌颜色',
    en: 'Brand Color',
  },
  presetColors: {
    ja: 'プリセット',
    'zh-TW': '預設',
    'zh-CN': '预设',
    en: 'Presets',
  },
  labelLogoUrl: {
    ja: 'ロゴ URL（任意）',
    'zh-TW': 'Logo 網址（選填）',
    'zh-CN': 'Logo 网址（选填）',
    en: 'Logo URL (optional)',
  },
  placeholderLogoUrl: {
    ja: 'https://example.com/logo.png',
    'zh-TW': 'https://example.com/logo.png',
    'zh-CN': 'https://example.com/logo.png',
    en: 'https://example.com/logo.png',
  },
  // Contact fields
  labelWechat: {
    ja: 'WeChat ID',
    'zh-TW': '微信號',
    'zh-CN': '微信号',
    en: 'WeChat ID',
  },
  labelLine: {
    ja: 'LINE ID',
    'zh-TW': 'LINE ID',
    'zh-CN': 'LINE ID',
    en: 'LINE ID',
  },
  labelPhone: {
    ja: '電話番号',
    'zh-TW': '電話',
    'zh-CN': '电话',
    en: 'Phone',
  },
  labelEmail: {
    ja: 'メールアドレス',
    'zh-TW': '電子郵件',
    'zh-CN': '邮箱',
    en: 'Email',
  },
  // Preview section labels
  previewLabel: {
    ja: 'リアルタイムプレビュー',
    'zh-TW': '即時預覽',
    'zh-CN': '即时预览',
    en: 'Live Preview',
  },
  previewAbout: {
    ja: '会社概要',
    'zh-TW': '關於我們',
    'zh-CN': '关于我们',
    en: 'About Us',
  },
  previewAboutDesc: {
    ja: '為您提供最優質な日本旅行と医療サービス体験',
    'zh-TW': '為您提供最優質的日本旅行和醫療服務體驗',
    'zh-CN': '为您提供最优质的日本旅行和医疗服务体验',
    en: 'Premium Japan travel and medical service experience',
  },
  previewGuideDesc: {
    ja: 'プロフェッショナルガイド、最高のサービスを提供します。',
    'zh-TW': '專業導遊，為您提供最貼心的服務。',
    'zh-CN': '专业导游，为您提供最贴心的服务。',
    en: 'Professional guide, providing you the best service.',
  },
  previewVehicles: {
    ja: '車両紹介',
    'zh-TW': '車輛介紹',
    'zh-CN': '车辆介绍',
    en: 'Our Fleet',
  },
  previewVehiclesDesc: {
    ja: '快適で安全なハイエンド車両を提供',
    'zh-TW': '為您提供舒適、安全的高端座駕',
    'zh-CN': '为您提供舒适、安全的高端座驾',
    en: 'Comfortable, safe, premium vehicles for you',
  },
  previewServices: {
    ja: 'サービス',
    'zh-TW': '服務項目',
    'zh-CN': '服务项目',
    en: 'Services',
  },
  previewServicesDesc: {
    ja: '厳選した医療・旅行サービス',
    'zh-TW': '為您精選的優質醫療和旅行服務',
    'zh-CN': '为您精选的优质医疗和旅行服务',
    en: 'Curated premium medical and travel services',
  },
  previewContact: {
    ja: 'お問い合わせ',
    'zh-TW': '聯繫我們',
    'zh-CN': '联系我们',
    en: 'Contact Us',
  },
  previewContactDesc: {
    ja: 'いつでもご相談ください',
    'zh-TW': '隨時為您提供諮詢和服務',
    'zh-CN': '随时为您提供咨询和服务',
    en: 'We are always here for you',
  },
  previewDetails: {
    ja: '詳細を見る',
    'zh-TW': '了解詳情',
    'zh-CN': '了解详情',
    en: 'Learn More',
  },
  previewHeroSubtitle: {
    ja: '日本高端カスタム旅行',
    'zh-TW': '日本高端定制旅行',
    'zh-CN': '日本高端定制旅行',
    en: 'Premium Custom Japan Travel',
  },
  previewHeroDesc: {
    ja: '高級医療検診・ビジネス視察・プライベートカスタムサービス。中国語対応・専属カスタム。',
    'zh-TW': '專業日本高端醫療體檢、商務考察、私人定制服務。中文服務、專屬定制。',
    'zh-CN': '专业日本高端医疗体检、商务考察、私人定制服务。中文服务、专属定制。',
    en: 'Premium medical checkups, business tours, private custom services. Chinese support & exclusive customization.',
  },
  tagChinese: {
    ja: '中国語サービス',
    'zh-TW': '中文服務',
    'zh-CN': '中文服务',
    en: 'Chinese Service',
  },
  tagCustom: {
    ja: '専属カスタム',
    'zh-TW': '專屬定制',
    'zh-CN': '专属定制',
    en: 'Exclusive Custom',
  },
  tagPremium: {
    ja: 'ハイエンド体験',
    'zh-TW': '高端體驗',
    'zh-CN': '高端体验',
    en: 'Premium Experience',
  },
  seats: {
    ja: '座',
    'zh-TW': '座',
    'zh-CN': '座',
    en: 'seats',
  },
  footerProvider: {
    ja: '旅行サービスは 新島交通株式会社 が提供',
    'zh-TW': '旅行服務由 新島交通株式會社 提供',
    'zh-CN': '旅行服务由 新岛交通株式会社 提供',
    en: 'Travel services provided by NIIJIMA KOTSU Co., Ltd.',
  },
  footerLicense: {
    ja: '大阪府知事登録旅行業 第2-3115号',
    'zh-TW': '大阪府知事登錄旅行業 第2-3115號',
    'zh-CN': '大阪府知事登录旅行业 第2-3115号',
    en: 'Osaka Licensed Travel Agency No. 2-3115',
  },
  // CTA
  ctaTitle: {
    ja: 'あなた専用サイトを今すぐ開設',
    'zh-TW': '立即開通您的專屬網站',
    'zh-CN': '立即开通您的专属网站',
    en: 'Launch Your Own Site Now',
  },
  ctaDesc: {
    ja: '月額わずか ¥1,980 でプロのホワイトラベルサイトを所有',
    'zh-TW': '每月僅需 ¥1,980 即可擁有專業白標品牌網站',
    'zh-CN': '每月仅需 ¥1,980 即可拥有专业白标品牌网站',
    en: 'Own a professional white-label site for just ¥1,980/month',
  },
  ctaButton: {
    ja: '申し込む',
    'zh-TW': '立即申請',
    'zh-CN': '立即申请',
    en: 'Get Started',
  },
  ctaLearnMore: {
    ja: 'プログラム詳細を見る →',
    'zh-TW': '了解更多計劃詳情 →',
    'zh-CN': '了解更多计划详情 →',
    en: 'Learn more about the program →',
  },
  // Mobile
  togglePanel: {
    ja: 'カスタマイズ',
    'zh-TW': '自訂設定',
    'zh-CN': '自定义设置',
    en: 'Customize',
  },
  hidePanel: {
    ja: 'パネルを閉じる',
    'zh-TW': '收起面板',
    'zh-CN': '收起面板',
    en: 'Hide Panel',
  },
};

// ── Sample data ──────────────────────────────────────────

interface SampleVehicle {
  id: string;
  name: Record<Language, string>;
  type: string;
  seats: number;
  features: string[];
}

interface SampleService {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
}

const SAMPLE_VEHICLES: SampleVehicle[] = [
  {
    id: 'v1',
    name: { ja: 'トヨタ アルファード', 'zh-TW': 'Toyota Alphard', 'zh-CN': 'Toyota Alphard 埃尔法', en: 'Toyota Alphard' },
    type: 'minivan',
    seats: 7,
    features: ['WiFi', 'USB', 'Leather'],
  },
  {
    id: 'v2',
    name: { ja: 'トヨタ ハイエース', 'zh-TW': 'Toyota HiAce', 'zh-CN': 'Toyota HiAce 海狮', en: 'Toyota HiAce' },
    type: 'van',
    seats: 14,
    features: ['Spacious', 'Airport', 'Luggage'],
  },
  {
    id: 'v3',
    name: { ja: 'メルセデスVクラス', 'zh-TW': 'Mercedes V-Class', 'zh-CN': 'Mercedes V-Class 奔驰', en: 'Mercedes V-Class' },
    type: 'luxury',
    seats: 7,
    features: ['Premium', 'Business', 'Privacy'],
  },
];

const SAMPLE_SERVICES: SampleService[] = [
  {
    id: 's1',
    name: { ja: 'TIMC 精密検診', 'zh-TW': 'TIMC 精密體檢', 'zh-CN': 'TIMC 精密健检', en: 'TIMC Premium Checkup' },
    description: {
      ja: 'PET-CT、MRI、腫瘍マーカー検査など最先端の検診',
      'zh-TW': 'PET-CT、MRI、腫瘤標記物等最先進的健檢',
      'zh-CN': 'PET-CT、MRI、肿瘤标记物等最先进的健检',
      en: 'PET-CT, MRI, tumor marker screening and more',
    },
  },
  {
    id: 's2',
    name: { ja: '総合医療サービス', 'zh-TW': '綜合醫療服務', 'zh-CN': '综合医疗服务', en: 'Comprehensive Medical' },
    description: {
      ja: '幹細胞治療、アンチエイジング、専門医紹介',
      'zh-TW': '幹細胞治療、抗衰老、專科醫師轉介',
      'zh-CN': '干细胞治疗、抗衰老、专科医生转介',
      en: 'Stem cell therapy, anti-aging, specialist referrals',
    },
  },
  {
    id: 's3',
    name: { ja: '高級ナイトクラブ予約', 'zh-TW': '高級夜總會預約', 'zh-CN': '高级夜总会预约', en: 'Premium Club Booking' },
    description: {
      ja: '全国160以上の店舗、VIP席予約、当日手配可能',
      'zh-TW': '全日本160+門店、VIP席位預約、當日安排',
      'zh-CN': '全日本160+门店、VIP席位预约、当日安排',
      en: '160+ venues nationwide, VIP booking, same-day arrangement',
    },
  },
];

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#059669', // Emerald
  '#7c3aed', // Violet
  '#ea580c', // Orange
  '#0891b2', // Cyan
  '#be185d', // Pink
  '#1a1a2e', // Navy
];

// ── Utilities ──────────────────────────────────────────

function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');
  if (hex.length !== 6) return color;
  const r = clamp(parseInt(hex.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'zh-CN';
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
  return 'zh-CN';
}

// ── Component ──────────────────────────────────────────

interface DemoConfig {
  brandName: string;
  brandColor: string;
  brandLogoUrl: string;
  contactWechat: string;
  contactLine: string;
  contactPhone: string;
  contactEmail: string;
}

const defaultConfig: DemoConfig = {
  brandName: '',
  brandColor: '#2563eb',
  brandLogoUrl: '',
  contactWechat: '',
  contactLine: '',
  contactPhone: '',
  contactEmail: '',
};

export default function GuidePartnerDemoPage() {
  const [lang, setLang] = useState<Language>('zh-CN');
  const [config, setConfig] = useState<DemoConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<'brand' | 'contact'>('brand');
  const [panelOpen, setPanelOpen] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLang(getInitialLang());
  }, []);

  const t = (key: string) => translations[key]?.[lang] || translations[key]?.['en'] || key;

  const displayName = config.brandName || t('placeholderBrandName');
  const brandColor = config.brandColor;
  const hasContact = config.contactWechat || config.contactLine || config.contactPhone || config.contactEmail;

  const slugName = config.brandName
    ? config.brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-\u4e00-\u9fff]/g, '').slice(0, 20)
    : 'yourname';

  const updateConfig = (partial: Partial<DemoConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
    if (partial.brandLogoUrl !== undefined) setLogoError(false);
  };

  return (
    <PublicLayout showFooter={false} activeNav="partner">
      {/* Hero */}
      <section className="bg-[#1a1a2e] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-amber-400 text-sm font-medium mb-3 tracking-wide">{t('heroTagline')}</p>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{t('heroTitle')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('heroDesc')}</p>
        </div>
      </section>

      {/* Main area */}
      <section className="bg-gray-100 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Mobile toggle */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 bg-white border rounded-lg py-3 text-sm font-medium text-gray-700"
          >
            <Settings size={16} />
            {panelOpen ? t('hidePanel') : t('togglePanel')}
          </button>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Customization Panel ── */}
            {panelOpen && (
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
                  {/* Tabs */}
                  <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('brand')}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition ${
                        activeTab === 'brand' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      <Palette size={14} className="inline mr-1.5 -mt-0.5" />
                      {t('tabBrand')}
                    </button>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition ${
                        activeTab === 'contact' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      <Phone size={14} className="inline mr-1.5 -mt-0.5" />
                      {t('tabContact')}
                    </button>
                  </div>

                  {activeTab === 'brand' && (
                    <div className="space-y-5">
                      {/* Brand name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('labelBrandName')}</label>
                        <input
                          type="text"
                          value={config.brandName}
                          onChange={e => updateConfig({ brandName: e.target.value })}
                          placeholder={t('placeholderBrandName')}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          maxLength={40}
                        />
                      </div>

                      {/* Brand color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('labelBrandColor')}</label>
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="color"
                            value={config.brandColor}
                            onChange={e => updateConfig({ brandColor: e.target.value })}
                            className="w-10 h-10 rounded-lg border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.brandColor}
                            onChange={e => {
                              const v = e.target.value;
                              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) updateConfig({ brandColor: v });
                            }}
                            className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            maxLength={7}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{t('presetColors')}</p>
                        <div className="flex flex-wrap gap-2">
                          {PRESET_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => updateConfig({ brandColor: color })}
                              className={`w-7 h-7 rounded-full border-2 transition ${
                                config.brandColor === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                              aria-label={`Select color ${color}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Logo URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('labelLogoUrl')}</label>
                        <input
                          type="url"
                          value={config.brandLogoUrl}
                          onChange={e => updateConfig({ brandLogoUrl: e.target.value })}
                          placeholder={t('placeholderLogoUrl')}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        {config.brandLogoUrl && !logoError && (
                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src={config.brandLogoUrl}
                              alt="Logo preview"
                              className="h-8 w-auto"
                              onError={() => setLogoError(true)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('labelWechat')}</label>
                        <input
                          type="text"
                          value={config.contactWechat}
                          onChange={e => updateConfig({ contactWechat: e.target.value })}
                          placeholder="WeChat ID"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('labelLine')}</label>
                        <input
                          type="text"
                          value={config.contactLine}
                          onChange={e => updateConfig({ contactLine: e.target.value })}
                          placeholder="LINE ID"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('labelPhone')}</label>
                        <input
                          type="tel"
                          value={config.contactPhone}
                          onChange={e => updateConfig({ contactPhone: e.target.value })}
                          placeholder="+81 90-1234-5678"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('labelEmail')}</label>
                        <input
                          type="email"
                          value={config.contactEmail}
                          onChange={e => updateConfig({ contactEmail: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Live Preview ── */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Eye size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">{t('previewLabel')}</span>
              </div>

              {/* Browser frame */}
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-500 text-xs ml-2">{slugName}.niijima-koutsu.jp</span>
                </div>

                {/* Page content */}
                <div className="bg-gray-50 max-h-[600px] overflow-y-auto">
                  {/* === Preview: Header === */}
                  <header
                    className="bg-white border-b sticky top-0 z-10"
                    style={{ borderBottomColor: brandColor }}
                  >
                    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {config.brandLogoUrl && !logoError ? (
                          <img
                            src={config.brandLogoUrl}
                            alt={displayName}
                            className="h-8 w-auto"
                            onError={() => setLogoError(true)}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: brandColor }}
                          >
                            {(config.brandName || 'D').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-base font-bold text-gray-900">{displayName}</span>
                      </div>
                      <nav className="hidden md:flex items-center gap-4 text-xs text-gray-500">
                        <span>{t('previewAbout')}</span>
                        <span>{t('previewVehicles')}</span>
                        <span>{t('previewServices')}</span>
                        <span>{t('previewContact')}</span>
                      </nav>
                    </div>
                  </header>

                  {/* === Preview: Hero === */}
                  <section
                    className="py-12 text-white text-center"
                    style={{
                      background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, -30)} 100%)`,
                    }}
                  >
                    <div className="max-w-3xl mx-auto px-4">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        {displayName} - {t('previewHeroSubtitle')}
                      </h2>
                      <p className="text-white/80 text-sm">{t('previewHeroDesc')}</p>
                    </div>
                  </section>

                  {/* === Preview: About === */}
                  <section className="py-10">
                    <div className="max-w-5xl mx-auto px-4">
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{t('previewAbout')}</h3>
                      <p className="text-gray-500 text-sm text-center mb-6">{t('previewAboutDesc')}</p>
                      <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-5">
                          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                            {config.brandLogoUrl && !logoError ? (
                              <img
                                src={config.brandLogoUrl}
                                alt={displayName}
                                className="w-16 h-16 object-contain"
                                onError={() => setLogoError(true)}
                              />
                            ) : (
                              <User size={32} className="text-gray-400" />
                            )}
                          </div>
                          <div className="text-center sm:text-left">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{displayName}</h4>
                            <p className="text-gray-500 text-sm mb-3">{t('previewGuideDesc')}</p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{t('tagChinese')}</span>
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{t('tagCustom')}</span>
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">{t('tagPremium')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* === Preview: Vehicles === */}
                  <section className="py-10 bg-white">
                    <div className="max-w-5xl mx-auto px-4">
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{t('previewVehicles')}</h3>
                      <p className="text-gray-500 text-sm text-center mb-6">{t('previewVehiclesDesc')}</p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SAMPLE_VEHICLES.map(v => (
                          <div key={v.id} className="bg-gray-50 rounded-xl border overflow-hidden">
                            <div className="aspect-video bg-gray-200 flex items-center justify-center">
                              <Car size={32} className="text-gray-400" />
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-gray-900 text-sm mb-1">{v.name[lang]}</h4>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <Users size={12} />
                                <span>{v.seats} {t('seats')}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {v.features.map(f => (
                                  <span key={f} className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">{f}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* === Preview: Services === */}
                  <section className="py-10">
                    <div className="max-w-5xl mx-auto px-4">
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{t('previewServices')}</h3>
                      <p className="text-gray-500 text-sm text-center mb-6">{t('previewServicesDesc')}</p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SAMPLE_SERVICES.map(s => (
                          <div key={s.id} className="bg-white rounded-xl border p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${brandColor}15` }}
                              >
                                <Package size={20} style={{ color: brandColor }} />
                              </div>
                              <h4 className="font-bold text-gray-900 text-sm">{s.name[lang]}</h4>
                            </div>
                            <p className="text-gray-500 text-xs mb-3">{s.description[lang]}</p>
                            <button
                              className="w-full py-1.5 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1"
                              style={{ backgroundColor: brandColor }}
                            >
                              {t('previewDetails')}
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* === Preview: Contact === */}
                  <section className="py-10 bg-white">
                    <div className="max-w-5xl mx-auto px-4">
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{t('previewContact')}</h3>
                      <p className="text-gray-500 text-sm text-center mb-6">{t('previewContactDesc')}</p>
                      <div className="max-w-lg mx-auto bg-gray-50 rounded-xl p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(config.contactWechat || !hasContact) && (
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${brandColor}15` }}
                              >
                                <MessageCircle size={18} style={{ color: brandColor }} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">{t('labelWechat')}</p>
                                <p className="text-sm font-medium text-gray-900">{config.contactWechat || 'your_wechat'}</p>
                              </div>
                            </div>
                          )}
                          {(config.contactLine || !hasContact) && (
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${brandColor}15` }}
                              >
                                <MessageCircle size={18} style={{ color: brandColor }} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">LINE</p>
                                <p className="text-sm font-medium text-gray-900">{config.contactLine || 'your_line'}</p>
                              </div>
                            </div>
                          )}
                          {(config.contactPhone || !hasContact) && (
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${brandColor}15` }}
                              >
                                <Phone size={18} style={{ color: brandColor }} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">{t('labelPhone')}</p>
                                <p className="text-sm font-medium text-gray-900">{config.contactPhone || '+81 90-xxxx-xxxx'}</p>
                              </div>
                            </div>
                          )}
                          {(config.contactEmail || !hasContact) && (
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${brandColor}15` }}
                              >
                                <Mail size={18} style={{ color: brandColor }} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">{t('labelEmail')}</p>
                                <p className="text-sm font-medium text-gray-900">{config.contactEmail || 'you@example.com'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* === Preview: Footer === */}
                  <footer className="bg-gray-900 text-white py-8">
                    <div className="max-w-5xl mx-auto px-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {config.brandLogoUrl && !logoError ? (
                            <img
                              src={config.brandLogoUrl}
                              alt={displayName}
                              className="h-6 w-auto brightness-0 invert"
                              onError={() => setLogoError(true)}
                            />
                          ) : (
                            <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs font-bold">
                              {(config.brandName || 'D').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-medium">{displayName}</span>
                        </div>
                        <div className="text-xs text-gray-400 text-center sm:text-right">
                          <p>{t('footerProvider')}</p>
                          <p className="mt-0.5">{t('footerLicense')}</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-800 mt-5 pt-5 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} {displayName}. All rights reserved.
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">{t('ctaTitle')}</h2>
          <p className="text-black/70 mb-6">{t('ctaDesc')}</p>
          <Link
            href="/guide-partner"
            className="inline-block bg-black hover:bg-gray-900 text-white font-bold px-8 py-3 rounded transition-colors"
          >
            {t('ctaButton')}
          </Link>
          <p className="mt-4">
            <Link href="/guide-partner" className="text-black/60 hover:text-black text-sm underline">
              {t('ctaLearnMore')}
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
