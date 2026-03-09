
import React, { useState, useEffect, memo, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';
import { translations, Language } from '../translations';
import { UserProfile } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Building, Activity, Shield, Armchair, FileText, Check, Zap, Coffee, Globe, ChevronDown, Heart, Bus, Utensils, Quote, Lock, Trophy, Car, Bath, Handshake, Mail, X, Phone, Loader2, User, Scan, Cpu, Microscope, Monitor, Map, Award, MessageSquare, Factory, Stethoscope, ExternalLink } from 'lucide-react';
import emailjs from '@emailjs/browser';
import HeroCarousel, { CarouselSlide } from './HeroCarousel';
import TestimonialWall from './TestimonialWall';
import PackageComparisonTable from './PackageComparisonTable';
import TIMCQuoteModal from './TIMCQuoteModal';
import PublicLayout from './PublicLayout';
import ContactButtons from './ContactButtons';
import { useWhiteLabel, useWhiteLabelVisibility } from '@/lib/contexts/WhiteLabelContext';
import { COMPANY_DATA, type Company } from '@/data/companies';
import { useCommissionTiers } from '@/lib/hooks/useCommissionTiers';
import { useSiteImages } from '@/lib/hooks/useSiteImages';
import { localizeText } from '@/lib/utils/text-converter';
import { validatePaymentForm } from '@/lib/validation';
import type { PageView, SubViewProps } from './landing/types';

// Lazy-loaded view components (code-split for performance)
const MedicalView = dynamic(() => import('./landing/MedicalView'), { ssr: false });
const GolfView = dynamic(() => import('./landing/GolfView'), { ssr: false });
const BusinessView = dynamic(() => import('./landing/BusinessView'), { ssr: false });
const PartnerView = dynamic(() => import('./landing/PartnerView'), { ssr: false });

// --- IMAGE ASSETS CONFIGURATION ---
// 硬编码的默认图片（作为数据库未配置时的 fallback）
// 所有图片都可以在数据库 site_images 表中更换
const DEFAULT_SITE_IMAGES: Record<string, string> = {
  // Medical Page - User Provided Direct Links
  medical_hero: "https://i.ibb.co/xS1h4rTM/hero-medical.jpg",
  tech_ct: "https://i.ibb.co/mFbDmCvg/tech-ct.jpg",
  tech_mri: "https://i.ibb.co/XxZdfCML/tech-mri.jpg",
  tech_endo: "https://i.ibb.co/MkkrywCZ/tech-endo.jpg",
  tech_dental: "https://i.ibb.co/tM1LBQJW/tech-dental.jpg",

  // Golf Page
  golf_hero: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop",
  plan_kansai: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop", // Plan 1: Classic Green
  plan_difficult: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1000&auto=format&fit=crop", // Plan 2: Golfer Swing/Action
  plan_fuji: "https://i.ibb.co/B2L1nxdg/2025-12-16-16-36-41.png", // Plan 3: Mt. Fuji Spectacular (Updated by User)

  // Business Page
  business_hero: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop",
  // New Business Plan Images - 6 Plans
  biz_auto: "https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1000&auto=format&fit=crop", // Plan 1: Toyota/Automotive
  biz_tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", // Plan 2: Semiconductor/Tech
  biz_retail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop", // Plan 3: Retail/UNIQLO
  biz_medical: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000&auto=format&fit=crop", // Plan 4: Medical/Healthcare
  biz_food: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop", // Plan 5: Food/Beverage Factory
  biz_hospitality: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop", // Plan 6: Hotel/Hospitality
  // New Business Plans (biz-plan-7 to biz-plan-14)
  biz_century: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop", // Plan 7: Century-old Companies (Kyoto Temple)
  biz_precision: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop", // Plan 8: Precision Manufacturing
  biz_esg: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1000&auto=format&fit=crop", // Plan 9: ESG/Sustainability
  biz_inamori: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1000&auto=format&fit=crop", // Plan 10: Inamori Philosophy (Kyoto)
  biz_logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop", // Plan 11: Logistics/Supply Chain
  biz_agtech: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop", // Plan 12: AgTech/Food Safety
  biz_dx: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop", // Plan 13: Digital Transformation
  biz_construction: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop", // Plan 14: Construction/Real Estate
  biz_senior_care: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1000&auto=format&fit=crop", // Plan 15: Senior Care Industry
  biz_senior_living: "https://images.unsplash.com/photo-1559234938-b60fff04894d?q=80&w=1000&auto=format&fit=crop", // Plan 16: Senior Living & Dementia Care

  // Home Page Previews
  home_medical_preview: "https://images.unsplash.com/photo-1531297461136-82ae96c51248?q=80&w=1000&auto=format&fit=crop",
  home_business_preview: "https://images.unsplash.com/photo-1577962917302-cd874c4e3169?q=80&w=800&auto=format&fit=crop",

  // Founder
  founder_portrait: "https://i.ibb.co/B2mJDvq7/founder.jpg",

  // MOBILE FALLBACKS (Updated by User Request)
  mobile_medical_fallback: "https://i.ibb.co/TDYnsXBb/013-2.jpg",
  mobile_business_fallback: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop"
};

const FALLBACK_IMAGES: Record<string, string> = {
  medical_hero: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop",
  tech_ct: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
  tech_mri: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800&auto=format&fit=crop",
  tech_endo: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop",
  tech_dental: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop",

  golf_hero: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2000&auto=format&fit=crop",
  plan_kansai: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop",
  plan_difficult: "https://images.unsplash.com/photo-1623567341691-389eb3292434?q=80&w=800&auto=format&fit=crop",
  plan_fuji: "https://images.unsplash.com/photo-1563205764-5d59524dc335?q=80&w=800&auto=format&fit=crop",
  
  business_hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
  biz_auto: "https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=800&auto=format&fit=crop",
  biz_tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
  biz_retail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
  biz_medical: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
  biz_food: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
  biz_hospitality: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  biz_century: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=800&auto=format&fit=crop",
  biz_precision: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
  biz_esg: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=800&auto=format&fit=crop",
  biz_inamori: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=800&auto=format&fit=crop",
  biz_logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
  biz_agtech: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop",
  biz_dx: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  biz_construction: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
  biz_senior_care: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
  biz_senior_living: "https://images.unsplash.com/photo-1559234938-b60fff04894d?q=80&w=800&auto=format&fit=crop",

  founder_portrait: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop"
};

const handleSmartImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackKey: string) => {
  const target = e.currentTarget;
  const attemptStr = target.getAttribute('data-retry-attempt') || '0';
  let attempt = parseInt(attemptStr, 10);
  const fallbackSrc = FALLBACK_IMAGES[fallbackKey] || FALLBACK_IMAGES.default;

  if (target.src === fallbackSrc) return;
  const currentPath = target.getAttribute('src') || '';
  const cleanBase = currentPath.split('?')[0].replace(/(\.jpg|\.png|\.jpeg|\.webp)+$/i, '');
  attempt += 1;
  target.setAttribute('data-retry-attempt', attempt.toString());
  if (attempt === 1) target.src = `${cleanBase}.jpg.jpg`;
  else if (attempt === 2) target.src = `${cleanBase}.JPG`;
  else if (attempt === 3) target.src = `${cleanBase}.png`;
  else target.src = fallbackSrc;
};

interface LandingPageProps {
  onLogin: (user: UserProfile, pendingRequest?: string) => void;
}

// PageView and SubViewProps are imported from './landing/types'

// MedicalView, GolfView, BusinessView, PartnerView are lazy-loaded via dynamic imports above
// HomeView remains inline as the default view (always loaded)

// --- PLACEHOLDER: Removed inline MedicalView (now in ./landing/MedicalView.tsx) ---
// --- PLACEHOLDER: Removed inline GolfView (now in ./landing/GolfView.tsx) ---
// --- PLACEHOLDER: Removed inline BusinessView (now in ./landing/BusinessView.tsx) ---
// --- PLACEHOLDER: Removed inline PartnerView (now in ./landing/PartnerView.tsx) ---

// ... (HomeView remains largely the same but ensure no breaking changes) ...
const HomeView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, currentLang, landingInputText, setLandingInputText, hideOfficialBranding, getImage }) => {
  // 获取佣金等级配置（用于动态显示分成比例）
  const { summary: commissionSummary } = useCommissionTiers();

  // 动态获取最新消息
  const [newsItems, setNewsItems] = useState<Array<{
    id: string;
    title: string;
    category: string;
    published_at: string;
  }>>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news?limit=5&lang=${currentLang}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!cancelled && data?.news) setNewsItems(data.news);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [currentLang]);

  // 注意：getImage 函数现在从父组件传入，支持数据库配置的图片

  // 首页轮播图配置 - 竞拍展位系统
  // 每周竞拍一次，起价 20,000 日币，轮播 3 张图
  // 图片从数据库 site_images 表读取，可在后台管理
  const heroSlides: CarouselSlide[] = [
    {
      id: 'cancer-treatment',
      title: currentLang === 'zh-TW' ? '日本尖端癌症治療' : currentLang === 'zh-CN' ? '日本尖端癌症治疗' : currentLang === 'ja' ? '日本最先端がん治療' : 'Japan Advanced Cancer Treatment',
      subtitle: currentLang === 'zh-TW' ? '質子重離子 / 光免疫 / BNCT' : currentLang === 'zh-CN' ? '质子重离子 / 光免疫 / BNCT' : currentLang === 'ja' ? '陽子線・光免疫・BNCT' : 'Proton / Photoimmunotherapy / BNCT',
      description: currentLang === 'zh-TW' ? '全球領先的癌症治療技術，精準打擊癌細胞' : currentLang === 'zh-CN' ? '全球领先的癌症治疗技术，精准打击癌细胞' : currentLang === 'ja' ? '世界最先端の治療技術でがん細胞を狙い撃ち' : 'World-leading technology for precise cancer treatment',
      imageUrl: getImage('hero_slide_1', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop'),
      ctaText: currentLang === 'zh-TW' ? '諮詢治療方案' : currentLang === 'zh-CN' ? '咨询治疗方案' : currentLang === 'ja' ? '治療相談' : 'Consult Now',
      ctaLink: '/cancer-treatment',
      overlayColor: 'rgba(30, 60, 114, 0.5)',
      textPosition: 'center',
      advertiser: 'NIIJIMA',
    },
    {
      id: 'timc-health-checkup',
      title: currentLang === 'zh-TW' ? '日本 TIMC 精密體檢' : currentLang === 'zh-CN' ? '日本 TIMC 精密体检' : currentLang === 'ja' ? '日本TIMC精密健診' : 'Japan TIMC Premium Checkup',
      subtitle: currentLang === 'zh-TW' ? '德洲會國際醫療中心' : currentLang === 'zh-CN' ? '德洲会国际医疗中心' : currentLang === 'ja' ? '徳洲会国際医療センター' : 'Tokushukai International Medical Center',
      description: currentLang === 'zh-TW' ? 'PET-CT / MRI / 胃腸鏡 - 早期發現，守護健康' : currentLang === 'zh-CN' ? 'PET-CT / MRI / 胃肠镜 - 早期发现，守护健康' : currentLang === 'ja' ? 'PET-CT / MRI / 胃腸内視鏡 - 早期発見で健康を守る' : 'PET-CT / MRI / Endoscopy - Early Detection for Better Health',
      imageUrl: getImage('hero_slide_2', 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg'),
      mobileImageUrl: getImage('hero_slide_2_mobile', 'https://i.ibb.co/TDYnsXBb/013-2.jpg'),
      ctaText: currentLang === 'zh-TW' ? '了解詳情' : currentLang === 'zh-CN' ? '了解详情' : currentLang === 'ja' ? '詳細を見る' : 'Learn More',
      ctaLink: '/medical',
      overlayColor: 'rgba(0, 50, 100, 0.5)',
      textPosition: 'center',
      advertiser: 'TIMC',
    },
    {
      id: 'ai-health-screening',
      title: currentLang === 'zh-TW' ? 'AI 智能健康檢測' : currentLang === 'zh-CN' ? 'AI 智能健康检测' : currentLang === 'ja' ? 'AI健康診断' : 'AI Health Screening',
      subtitle: currentLang === 'zh-TW' ? '3 分鐘了解您的健康風險' : currentLang === 'zh-CN' ? '3 分钟了解您的健康风险' : currentLang === 'ja' ? '3分でリスクを把握' : '3-Minute Risk Assessment',
      description: currentLang === 'zh-TW' ? '基於 AI 的專業問診，為您推薦最適合的體檢方案' : currentLang === 'zh-CN' ? '基于 AI 的专业问诊，为您推荐最适合的体检方案' : currentLang === 'ja' ? 'AIによる問診で最適な健診プランをご提案' : 'AI-powered consultation for personalized health plans',
      imageUrl: getImage('hero_slide_3', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop'),
      ctaText: currentLang === 'zh-TW' ? '免費檢測' : currentLang === 'zh-CN' ? '免费检测' : currentLang === 'ja' ? '無料診断' : 'Free Screening',
      ctaLink: '/health-screening',
      overlayColor: 'rgba(30, 60, 114, 0.6)',
      textPosition: 'center',
      advertiser: 'NIIJIMA',
    },
  ];

  return (
  <div className="animate-fade-in-up pt-0 bg-white">
      {/* 1. Hero Carousel - 竞拍展位轮播图 */}
      {/* 图片从数据库加载，加载中显示骨架屏 */}
      <HeroCarousel
        slides={heroSlides}
        autoPlayInterval={6000}
        showIndicators={true}
        showArrows={true}
        height="85vh"
      />

      {/* 2. ニュースルーム - JTB风格列表式设计 */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-4xl mx-auto">
            {/* 标题 - 居中 */}
            <div className="text-center mb-12">
              <h2 className="serif text-2xl md:text-3xl text-neutral-900 tracking-wide mb-2">
                {currentLang === 'zh-TW' ? '最新消息' : currentLang === 'zh-CN' ? '最新消息' : currentLang === 'en' ? 'News' : 'お知らせ'}
              </h2>
              <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">News Room</p>
            </div>

            {/* 新闻列表 - 动态从API获取 */}
            <div className="space-y-0 border-t border-neutral-200">
              {newsItems.map((news) => {
                const date = new Date(news.published_at);
                const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
                const categoryLabel = news.category === 'service'
                  ? (currentLang === 'zh-TW' ? '服務' : currentLang === 'zh-CN' ? '服务' : currentLang === 'en' ? 'Service' : 'サービス')
                  : news.category === 'press'
                  ? (currentLang === 'zh-TW' ? '新聞' : currentLang === 'zh-CN' ? '新闻' : currentLang === 'en' ? 'Press' : 'プレス')
                  : (currentLang === 'zh-TW' ? '公告' : currentLang === 'zh-CN' ? '公告' : currentLang === 'en' ? 'Notice' : 'お知らせ');

                return (
                  <a key={news.id} href={`/news/${news.id}`} className="group block py-6 border-b border-neutral-200 hover:bg-white transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* 日期 */}
                      <div className="text-sm text-neutral-500 md:w-32 flex-shrink-0">
                        {dateStr}
                      </div>
                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 md:w-40 flex-shrink-0">
                        <span className="text-xs px-3 py-1 rounded-full border border-brand-500 text-brand-600">
                          {categoryLabel}
                        </span>
                      </div>
                      {/* 标题 */}
                      <div className="flex-1">
                        <h3 className="text-neutral-900 leading-relaxed group-hover:text-brand-700 transition-colors">
                          {localizeText(news.title, currentLang)}
                        </h3>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* 查看更多 */}
            <div className="text-center mt-10">
              <a
                href="/news"
                className="inline-flex items-center text-sm text-neutral-600 hover:text-brand-900 border border-neutral-300 px-8 py-4 rounded hover:border-neutral-400 transition-colors"
              >
                {currentLang === 'zh-TW' ? '查看全部消息' : currentLang === 'zh-CN' ? '查看全部消息' : currentLang === 'en' ? 'View All News' : 'すべてのお知らせ'}
                <ArrowRight size={14} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 医療サービス - 温暖、舒适、给人希望和安心 */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* 全屏背景图 - 温暖的医疗场景 */}
        <div className="absolute inset-0">
          <Image
            src={getImage('homepage_medical_bg', 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop')}
            alt="Healthcare"
            fill
            className="object-cover"
            sizes="100vw"
            quality={75}
          />
          {/* 温暖的渐变，类似高尔夫板块但用蓝绿色调 */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/70 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="max-w-2xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-brand-400"></div>
              <span className="text-xs tracking-[0.3em] text-brand-400 uppercase">Medical Tourism</span>
            </div>

            {/* 核心标题 - 温暖、给人希望 */}
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              {currentLang === 'zh-TW' ? '把健康交給' : currentLang === 'zh-CN' ? '把健康交给' : '健康を託す'}
              <br />
              <span className="text-brand-300">{currentLang === 'zh-TW' ? '值得信賴的人' : currentLang === 'zh-CN' ? '值得信赖的人' : '信頼できる人へ'}</span>
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-brand-100/80 mb-6 md:mb-8 leading-relaxed font-light">
              {currentLang === 'zh-TW' ? '日本醫療技術全球領先，PET-CT可發現5mm早期病變。我們提供專車接送、全程陪診翻譯、報告解讀——讓您專心照顧健康，其他的交給我們。' : currentLang === 'zh-CN' ? '日本医疗技术全球领先，PET-CT可发现5mm早期病变。我们提供专车接送、全程陪诊翻译、报告解读——让您专心照顾健康，其他的交给我们。' : '日本の医療技術は世界トップクラス。PET-CTは5mmの早期病変を発見可能。専用車送迎、全行程通訳同行、レポート解説——健康に専念していただき、他はお任せください。'}
            </p>

            {/* 核心数据 */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">12<span className="text-brand-300">年</span></div>
                <div className="text-[10px] md:text-xs text-brand-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '醫療服務經驗' : currentLang === 'zh-CN' ? '医疗服务经验' : '医療サービス実績'}</div>
              </div>
              <div className="border-x border-white/20 px-2 md:px-6 py-12 md:py-24 text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">3000<span className="text-brand-300">+</span></div>
                <div className="text-[10px] md:text-xs text-brand-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '服務客戶' : currentLang === 'zh-CN' ? '服务客户' : 'ご利用者様'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">100<span className="text-brand-300">%</span></div>
                <div className="text-[10px] md:text-xs text-brand-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '全程陪同' : currentLang === 'zh-CN' ? '全程陪同' : '全行程同行'}</div>
              </div>
            </div>

            {/* 服务亮点标签 */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                currentLang === 'zh-TW' ? '專車接送' : currentLang === 'zh-CN' ? '专车接送' : '専用車送迎',
                currentLang === 'zh-TW' ? '醫療翻譯' : currentLang === 'zh-CN' ? '医疗翻译' : '医療通訳',
                currentLang === 'zh-TW' ? '報告解讀' : currentLang === 'zh-CN' ? '报告解读' : 'レポート解説',
                currentLang === 'zh-TW' ? '後續跟進' : currentLang === 'zh-CN' ? '后续跟进' : 'アフターフォロー'
              ].map((tag, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                onClick={() => setCurrentPage('medical')}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-900 text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
              >
                {currentLang === 'zh-TW' ? '了解體檢方案' : currentLang === 'zh-CN' ? '了解体检方案' : '健診プランを見る'}
                <ArrowRight size={18} className="ml-3" />
              </a>
              <a
                href="/health-screening"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/40 text-white text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                {currentLang === 'zh-TW' ? '免費健康評估' : currentLang === 'zh-CN' ? '免费健康评估' : '無料健康診断'}
              </a>
            </div>
          </div>
        </div>

        {/* 右下角：检查项目卡片（桌面端） */}
        <div className="hidden lg:block absolute right-8 bottom-8 w-80">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h4 className="text-white font-medium mb-4">{currentLang === 'zh-TW' ? '精密檢查項目' : currentLang === 'zh-CN' ? '精密检查项目' : '精密検査項目'}</h4>
            <div className="space-y-3">
              {[
                { name: 'PET-CT', desc: currentLang === 'zh-TW' ? '全身癌症早期篩查' : currentLang === 'zh-CN' ? '全身癌症早期筛查' : '全身がん早期検診' },
                { name: 'MRI 3.0T', desc: currentLang === 'zh-TW' ? '腦部·心臟精密檢查' : currentLang === 'zh-CN' ? '脑部·心脏精密检查' : '脳・心臓精密検査' },
                { name: currentLang === 'zh-TW' ? '無痛胃腸鏡' : currentLang === 'zh-CN' ? '无痛胃肠镜' : '無痛内視鏡', desc: currentLang === 'zh-TW' ? '消化道全面檢查' : currentLang === 'zh-CN' ? '消化道全面检查' : '消化器系総合検査' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <CheckCircle size={16} className="text-brand-300 flex-shrink-0" />
                  <div>
                    <span className="text-white">{item.name}</span>
                    <span className="text-brand-200/60 ml-2">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 重疾治療 - 沉浸式全屏背景，与其他板块风格统一 */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* 全屏背景图 */}
        <div className="absolute inset-0">
          <Image
            src={getImage('homepage_treatment_bg', 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2000&auto=format&fit=crop')}
            alt="Advanced Medical Treatment"
            fill
            className="object-cover"
            sizes="100vw"
            quality={75}
          />
          {/* 深蓝色渐变，传达专业、希望 */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/70 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="max-w-2xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-brand-300"></div>
              <span className="text-xs tracking-[0.3em] text-brand-300 uppercase">Advanced Treatment</span>
            </div>

            {/* 核心标题 */}
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              {currentLang === 'zh-TW' ? '面對重疾' : currentLang === 'zh-CN' ? '面对重疾' : '重病と向き合う時'}
              <br />
              <span className="text-brand-300">{currentLang === 'zh-TW' ? '日本醫療給您更多希望' : currentLang === 'zh-CN' ? '日本医疗给您更多希望' : '日本医療がもう一つの希望に'}</span>
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-neutral-200/80 mb-6 md:mb-8 leading-relaxed font-light">
              {currentLang === 'zh-TW' ? '質子重離子治療、免疫細胞療法、達文西微創手術——日本癌症5年生存率全球領先。我們協助您獲得日本頂尖醫院的治療機會，全程陪同，讓您專注康復。' : currentLang === 'zh-CN' ? '质子重离子治疗、免疫细胞疗法、达文西微创手术——日本癌症5年生存率全球领先。我们协助您获得日本顶尖医院的治疗机会，全程陪同，让您专注康復。' : '陽子線・重粒子線治療、免疫細胞療法、ダヴィンチ手術——日本のがん5年生存率は世界トップ。日本トップ病院での治療機会をサポート、全行程同行で治療に専念いただけます。'}
            </p>

            {/* 核心数据 */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">68<span className="text-brand-300">%</span></div>
                <div className="text-[10px] md:text-xs text-neutral-300/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '癌症5年生存率' : currentLang === 'zh-CN' ? '癌症5年生存率' : 'がん5年生存率'}</div>
              </div>
              <div className="border-x border-white/20 px-2 md:px-6 py-12 md:py-24 text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">98<span className="text-brand-300">%</span></div>
                <div className="text-[10px] md:text-xs text-neutral-300/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '心臟手術成功率' : currentLang === 'zh-CN' ? '心脏手术成功率' : '心臓手術成功率'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">24<span className="text-brand-300">h</span></div>
                <div className="text-[10px] md:text-xs text-neutral-300/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '病歷評估響應' : currentLang === 'zh-CN' ? '病历评估响应' : '診療情報評価'}</div>
              </div>
            </div>

            {/* 治疗领域标签 */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                currentLang === 'zh-TW' ? '癌症治療' : currentLang === 'zh-CN' ? '癌症治疗' : 'がん治療',
                currentLang === 'zh-TW' ? '質子重離子' : currentLang === 'zh-CN' ? '质子重离子' : '陽子線・重粒子線',
                currentLang === 'zh-TW' ? '心臟手術' : currentLang === 'zh-CN' ? '心脏手术' : '心臓手術',
                currentLang === 'zh-TW' ? '腦血管' : currentLang === 'zh-CN' ? '脑血管' : '脳血管治療'
              ].map((tag, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/cancer-treatment"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-900 text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors"
              >
                {currentLang === 'zh-TW' ? '了解治療服務' : currentLang === 'zh-CN' ? '了解治疗服务' : '治療サービス詳細'}
                <ArrowRight size={18} className="ml-3" />
              </a>
              <a
                href="/cancer-treatment/remote-consultation"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/40 text-white text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                {currentLang === 'zh-TW' ? '免費遠程諮詢' : currentLang === 'zh-CN' ? '免费远程咨询' : '無料遠隔相談'}
              </a>
            </div>
          </div>
        </div>

        {/* 右下角：治疗流程简述（桌面端） */}
        <div className="hidden lg:block absolute right-8 bottom-8 w-80">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h4 className="text-white font-medium mb-4">{currentLang === 'zh-TW' ? '服務流程' : currentLang === 'zh-CN' ? '服务流程' : 'サービスの流れ'}</h4>
            <div className="space-y-3">
              {[
                { step: '01', text: currentLang === 'zh-TW' ? '提交病歷，24小時內評估' : currentLang === 'zh-CN' ? '提交病历，24小时内评估' : '診療情報提出、24時間以内に評価' },
                { step: '02', text: currentLang === 'zh-TW' ? '制定方案，明確費用' : currentLang === 'zh-CN' ? '制定方案，明确费用' : '治療計画策定、費用明確化' },
                { step: '03', text: currentLang === 'zh-TW' ? '赴日治療，全程陪同' : currentLang === 'zh-CN' ? '赴日治疗，全程陪同' : '渡航・治療、全行程同行' },
                { step: '04', text: currentLang === 'zh-TW' ? '回國後持續跟進' : currentLang === 'zh-CN' ? '回国后持续跟进' : '帰国後継続フォロー' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 bg-brand-400/30 rounded-full flex items-center justify-center text-xs text-brand-200 flex-shrink-0">{item.step}</span>
                  <span className="text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. ゴルフサービス - Pebble Beach风格：黑白金、大图沉浸、稀缺感 */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* 全屏背景图 */}
        <div className="absolute inset-0">
          <Image
            src={getImage('homepage_golf_bg', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop')}
            alt="Premium Golf Course"
            fill
            className="object-cover"
            sizes="100vw"
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="max-w-2xl">
            {/* 权威认证标签 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400"></div>
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">Exclusive Access</span>
            </div>

            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              {currentLang === 'zh-TW' ? '踏入' : currentLang === 'zh-CN' ? '踏入' : '足を踏み入れる'}
              <br />
              <span className="text-gold-400">{currentLang === 'zh-TW' ? '傳說中的名門' : currentLang === 'zh-CN' ? '传说中的名门' : '伝説の名門へ'}</span>
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-neutral-300 mb-6 md:mb-8 leading-relaxed font-light">
              {currentLang === 'zh-TW' ? '廣野、霞ヶ関、小野——這些球場的名字，在高爾夫愛好者心中如雷貫耳。平時需要會員介紹才能踏入的聖地，現在向您敞開大門。' : currentLang === 'zh-CN' ? '广野、霞ヶ関、小野——这些球场的名字，在高尔夫爱好者心中如雷貫耳。平时需要会员介绍才能踏入的圣地，现在向您敞开大门。' : '廣野、霞ヶ関、小野——ゴルフ愛好家なら誰もが憧れる名門。通常は会員紹介が必要な聖地が、今あなたに開かれます。'}
            </p>

            {/* 核心数据 - 金色边框 */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">25<span className="text-gold-400">+</span></div>
                <div className="text-[10px] md:text-xs text-neutral-400 tracking-wider uppercase">{currentLang === 'zh-TW' ? '名門球場' : currentLang === 'zh-CN' ? '名门球场' : '名門コース'}</div>
              </div>
              <div className="border-x border-white/20 px-2 md:px-6 py-12 md:py-24 text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">0</div>
                <div className="text-[10px] md:text-xs text-neutral-400 tracking-wider uppercase">{currentLang === 'zh-TW' ? '會員介紹' : currentLang === 'zh-CN' ? '会员介绍' : '会員紹介不要'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">VIP</div>
                <div className="text-[10px] md:text-xs text-neutral-400 tracking-wider uppercase">{currentLang === 'zh-TW' ? '專屬待遇' : currentLang === 'zh-CN' ? '专属待遇' : '専用待遇'}</div>
              </div>
            </div>

            {/* 球场列表 */}
            <div className="mb-10">
              <div className="text-xs text-neutral-500 mb-3 uppercase tracking-wider">{currentLang === 'zh-TW' ? '合作名門' : currentLang === 'zh-CN' ? '合作名门' : '提携名門コース'}</div>
              <div className="flex flex-wrap gap-2">
                {['廣野ゴルフ倶楽部', '霞ヶ関カンツリー倶楽部', '小野ゴルフ倶楽部', '茨木カンツリー倶楽部', '古賀ゴルフ・クラブ'].map((course, idx) => (
                  <span key={idx} className="text-sm text-white/80 after:content-['·'] after:mx-2 after:text-gold-400 last:after:content-none">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <a
              onClick={() => setCurrentPage('golf')}
              className="inline-flex items-center px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium tracking-wider hover:bg-gold-300 transition-colors cursor-pointer"
            >
              {currentLang === 'zh-TW' ? '探索名門球場' : currentLang === 'zh-CN' ? '探索名门球场' : '名門コースを見る'}
              <ArrowRight size={18} className="ml-3" />
            </a>
          </div>
        </div>

        {/* 右下角服务标签 */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 max-w-xs">
            <div className="text-xs text-gold-400 mb-2 uppercase tracking-wider">{currentLang === 'zh-TW' ? '尊享服務' : currentLang === 'zh-CN' ? '尊享服务' : 'プレミアムサービス'}</div>
            <div className="space-y-2 text-sm text-white/80">
              <div>✓ {currentLang === 'zh-TW' ? '專屬開球時段' : currentLang === 'zh-CN' ? '专属开球时段' : '専用スタート枠'}</div>
              <div>✓ {currentLang === 'zh-TW' ? '雙語球童服務' : currentLang === 'zh-CN' ? '双语球童服务' : 'バイリンガルキャディ'}</div>
              <div>✓ {currentLang === 'zh-TW' ? '溫泉旅館安排' : currentLang === 'zh-CN' ? '温泉旅馆安排' : '温泉旅館手配'}</div>
              <div>✓ {currentLang === 'zh-TW' ? '懷石料理預約' : currentLang === 'zh-CN' ? '怀石料理预约' : '懐石料理予約'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ビジネス視察 - Business Inspection 顶尖企业对接 */}
      <section className="relative min-h-[90vh] flex items-center bg-brand-900 text-white">
        <div className="absolute inset-0">
          <Image
            src={getImage('homepage_business_bg', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')}
            alt="Business District"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            quality={75}
          />
        </div>
        <div className="relative container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold-400 uppercase mb-8 md:mb-10">Business Inspection</p>
                <h2 className="serif text-3xl md:text-4xl lg:text-5xl text-white mb-8 md:mb-10 leading-tight">
                  {currentLang === 'zh-TW' ? '對話日本頂尖企業' : currentLang === 'zh-CN' ? '对话日本顶尖企业' : '日本トップ企業との対話'}
                </h2>
                <p className="text-neutral-300 leading-relaxed mb-8">
                  {currentLang === 'zh-TW' ? '12年深耕日本商務市場，我們與豐田、松下、資生堂等500強企業建立深度合作。從工廠參觀到高管對談，為您打造真正有價值的商務考察之旅。' : currentLang === 'zh-CN' ? '12年深耕日本商务市场，我们与丰田、松下、资生堂等500强企业建立深度合作。从工厂参观到高管对谈，为您打造真正有价值的商务考察之旅。' : '12年間日本ビジネス市場を深耕。トヨタ、パナソニック、資生堂など500社以上と深い協力関係を構築。工場見学から経営層との対談まで、真に価値ある視察をご提供。'}
                </p>

                <div className="grid grid-cols-2 gap-3 md:gap-6 mb-10">
                  {[
                    { num: '16', label: currentLang === 'zh-TW' ? '行業覆蓋' : currentLang === 'zh-CN' ? '行业覆盖' : '対応業界' },
                    { num: '500+', label: currentLang === 'zh-TW' ? '合作企業' : currentLang === 'zh-CN' ? '合作企业' : '提携企業' },
                    { num: '98%', label: currentLang === 'zh-TW' ? '客戶滿意度' : currentLang === 'zh-CN' ? '客户满意度' : '顧客満足度' },
                    { num: '1000+', label: currentLang === 'zh-TW' ? '成功案例' : currentLang === 'zh-CN' ? '成功案例' : '成功実績' },
                  ].map((stat, idx) => (
                    <div key={idx} className="border-l-2 border-gold-400/50 pl-4">
                      <div className="text-2xl font-light text-white">{stat.num}</div>
                      <div className="text-xs text-neutral-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                  {[
                    currentLang === 'zh-TW' ? '製造業' : currentLang === 'zh-CN' ? '制造业' : '製造業',
                    currentLang === 'zh-TW' ? '零售業' : currentLang === 'zh-CN' ? '零售业' : '小売業',
                    currentLang === 'zh-TW' ? '醫療健康' : currentLang === 'zh-CN' ? '医疗健康' : '医療・ヘルスケア',
                    currentLang === 'zh-TW' ? '科技創新' : currentLang === 'zh-CN' ? '科技创新' : 'テクノロジー',
                    currentLang === 'zh-TW' ? '農業食品' : currentLang === 'zh-CN' ? '农业食品' : '農業・食品',
                  ].map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 text-xs border border-white/20 text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  onClick={() => setCurrentPage('business')}
                  className="inline-flex items-center px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium hover:bg-gold-300 transition-colors cursor-pointer"
                >
                  {currentLang === 'zh-TW' ? '定制考察方案' : currentLang === 'zh-CN' ? '定制考察方案' : '視察プランを相談'}
                  <ArrowRight size={18} className="ml-3" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: currentLang === 'zh-TW' ? '豐田汽車' : currentLang === 'zh-CN' ? '丰田汽车' : 'トヨタ自動車', type: currentLang === 'zh-TW' ? '製造業' : currentLang === 'zh-CN' ? '制造业' : '製造業' },
                  { name: currentLang === 'zh-TW' ? '松下電器' : currentLang === 'zh-CN' ? '松下电器' : 'パナソニック', type: currentLang === 'zh-TW' ? '電子科技' : currentLang === 'zh-CN' ? '电子科技' : '電機' },
                  { name: currentLang === 'zh-TW' ? '資生堂' : currentLang === 'zh-CN' ? '资生堂' : '資生堂', type: currentLang === 'zh-TW' ? '美妝日化' : currentLang === 'zh-CN' ? '美妝日化' : '化粧品' },
                  { name: currentLang === 'zh-TW' ? '永旺集團' : currentLang === 'zh-CN' ? '永旺集团' : 'イオン', type: currentLang === 'zh-TW' ? '零售業' : currentLang === 'zh-CN' ? '零售业' : '小売業' },
                ].map((company, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur p-6 border border-white/10 hover:border-white/30 transition-colors">
                    <div className="text-white font-medium mb-1">{company.name}</div>
                    <div className="text-xs text-neutral-400">{company.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 主要取引先 - Partners */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">Partners</p>
              <h2 className="serif text-2xl md:text-3xl text-neutral-900 tracking-wide">
                {currentLang === 'zh-TW' ? '合作夥伴' : currentLang === 'zh-CN' ? '合作伙伴' : '主要取引先'}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
              {[
                { name: '徳洲会グループ', sub: 'Tokushukai Group' },
                { name: 'TIMC OSAKA', sub: 'Medical Center' },
                { name: '帝国ホテル', sub: 'Imperial Hotel' },
                { name: 'ザ・リッツ・カールトン', sub: 'The Ritz-Carlton' },
                { name: 'ANA', sub: 'All Nippon Airways' },
                { name: 'JR西日本', sub: 'JR West' },
              ].map((partner, index) => (
                <div key={index} className="bg-white p-6 text-center border border-neutral-200 hover:border-neutral-300 transition-colors">
                  <div className="text-sm font-medium text-neutral-900 mb-1">{partner.name}</div>
                  <div className="text-[10px] text-neutral-400">{partner.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. 企業理念 - Corporate Philosophy */}
      <section className="py-24 bg-brand-900 text-white">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-6">Corporate Philosophy</p>
            <h2 className="serif text-3xl md:text-4xl lg:text-5xl text-white mb-8 leading-relaxed">
              {currentLang === 'zh-TW' ? '用心連結世界與日本' : currentLang === 'zh-CN' ? '用心连结世界与日本' : '心をつなぐ、世界と日本'}
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              {currentLang === 'zh-TW' ? '我們致力於為華人旅客提供最高品質的日本旅遊體驗。我們相信，真正的服務不僅是滿足需求，更是創造感動。' : currentLang === 'zh-CN' ? '我们致力于为华人旅客提供最高品质的日本旅游体验。我们相信，真正的服务不仅是满足需求，更是创造感动。' : '2020年設立以来、新島交通は華人旅行者の皆様に最高品質の日本旅行体験を提供してまいりました。真のサービスとは、ニーズを満たすだけでなく、感動を創造することだと信じています。'}
            </p>
            <a
              href="/company/about"
              className="inline-flex items-center text-xs text-white border border-white/30 px-8 py-3 hover:bg-white hover:text-brand-900 transition-all tracking-wider"
            >
              {currentLang === 'zh-TW' ? '了解更多' : currentLang === 'zh-CN' ? '了解更多' : '詳しく見る'}
              <ArrowRight size={14} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* 9. 導遊合作 - 沉浸式全屏背景，与其他板块风格统一 */}
      {!hideOfficialBranding && (
      <section id="guide-partner" className="relative min-h-[85vh] flex items-center">
        {/* 全屏背景图 */}
        <div className="absolute inset-0">
          <Image
            src={getImage('homepage_partner_bg', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop')}
            alt="Partnership"
            fill
            className="object-cover"
            sizes="100vw"
            quality={75}
          />
          {/* 深紫色渐变，传达高端、信任 */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/70 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="max-w-2xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400"></div>
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">Partnership</span>
            </div>

            {/* 核心标题 */}
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              {currentLang === 'zh-TW' ? '導遊提攜夥伴' : currentLang === 'zh-CN' ? '导游提攜伙伴' : 'ガイドパートナー'}
              <br />
              <span className="text-gold-400">{currentLang === 'zh-TW' ? '客戶介紹計劃' : currentLang === 'zh-CN' ? '客户介绍计划' : '顧客紹介プログラム'}</span>
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-gold-100/80 mb-6 md:mb-8 leading-relaxed font-light">
              {currentLang === 'zh-TW' ? '新島交通提供高端夜總會、精密體檢、綜合醫療等服務資源。您介紹客戶，我們提供服務，成功即有介紹報酬。' : currentLang === 'zh-CN' ? '新岛交通提供高端夜总会、精密体检、综合医疗等服务资源。您介绍客户，我们提供服务，成功即有介绍报酬。' : '新島交通は高級クラブ、精密健診、総合医療などのサービスを提供。お客様をご紹介いただき、成約時に紹介報酬をお支払いします。'}
            </p>

            {/* 核心数据 */}
            <div className="grid grid-cols-2 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">160<span className="text-gold-400">+</span></div>
                <div className="text-xs text-gold-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '合作店舖' : currentLang === 'zh-CN' ? '合作店舖' : '提携店舗'}</div>
              </div>
              <div className="border-l border-white/20 pl-3 md:pl-6 text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">3000<span className="text-gold-400">+</span></div>
                <div className="text-[10px] md:text-xs text-gold-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '服務客戶' : currentLang === 'zh-CN' ? '服务客户' : 'ご利用者様'}</div>
              </div>
            </div>

            {/* 服务亮点标签 */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                currentLang === 'zh-TW' ? '高端夜總會' : currentLang === 'zh-CN' ? '高端夜总会' : '高級クラブ',
                currentLang === 'zh-TW' ? 'TIMC精密體檢' : currentLang === 'zh-CN' ? 'TIMC精密体检' : 'TIMC精密健診',
                currentLang === 'zh-TW' ? '綜合醫療' : currentLang === 'zh-CN' ? '综合医疗' : '総合医療',
                currentLang === 'zh-TW' ? '幹細胞·抗衰' : currentLang === 'zh-CN' ? '干细胞·抗衰' : '幹細胞・アンチエイジング'
              ].map((tag, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/guide-partner"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-900 text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors"
              >
                {currentLang === 'zh-TW' ? '了解詳情' : currentLang === 'zh-CN' ? '了解详情' : '詳細を見る'}
                <ArrowRight size={18} className="ml-3" />
              </a>
              <a
                href="/guide-partner/login"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/40 text-white text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                {currentLang === 'zh-TW' ? '夥伴登入' : currentLang === 'zh-CN' ? '伙伴登入' : 'パートナーログイン'}
              </a>
            </div>
          </div>
        </div>

        {/* 右下角：合作模式卡片（桌面端） */}
        <div className="hidden lg:block absolute right-8 bottom-8 w-80">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h4 className="text-white font-medium mb-4">{currentLang === 'zh-TW' ? '合作模式' : currentLang === 'zh-CN' ? '合作模式' : '提携モデル'}</h4>
            <div className="space-y-3">
              {[
                { name: currentLang === 'zh-TW' ? '您介紹客戶' : currentLang === 'zh-CN' ? '您介绍客户' : 'お客様をご紹介', desc: currentLang === 'zh-TW' ? '推薦有需求的客戶' : currentLang === 'zh-CN' ? '推荐有需求的客户' : 'ニーズのあるお客様を' },
                { name: currentLang === 'zh-TW' ? '新島提供服務' : currentLang === 'zh-CN' ? '新岛提供服务' : '新島がサービス提供', desc: currentLang === 'zh-TW' ? '預約、接待、全程服務' : currentLang === 'zh-CN' ? '预约、接待、全程服务' : '予約・接客・全行程' },
                { name: currentLang === 'zh-TW' ? '成功獲得報酬' : currentLang === 'zh-CN' ? '成功获得报酬' : '成約で報酬', desc: currentLang === 'zh-TW' ? '每月結算介紹報酬' : currentLang === 'zh-CN' ? '每月结算介绍报酬' : '毎月紹介報酬を精算' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <CheckCircle size={16} className="text-gold-400 flex-shrink-0" />
                  <div>
                    <span className="text-white">{item.name}</span>
                    <span className="text-gold-200/60 ml-2">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* 法律声明 */}
            <p className="text-[10px] text-gold-200/40 mt-4 pt-3 border-t border-white/10 leading-relaxed">
              {currentLang === 'zh-TW' ? '所有旅行服務由新島交通株式會社提供' : currentLang === 'zh-CN' ? '所有旅行服务由新岛交通株式会社提供' : '全ての旅行サービスは新島交通株式会社が提供'}
            </p>
          </div>
        </div>
      </section>
      )}
  </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState<Language | null>(null);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormData, setAuthFormData] = useState({ companyName: '', contactPerson: '', email: '' });
  const [authError, setAuthError] = useState('');
  const [isSendingAuth, setIsSendingAuth] = useState(false);

  // State for the Landing Page Input
  const [landingInputText, setLandingInputText] = useState("");

  // State for TIMC Quote Modal
  const [showTIMCQuoteModal, setShowTIMCQuoteModal] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'error' | 'success' | 'info';
  }>({ show: false, message: '', type: 'info' });

  // Toast helper function
  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 5000);
  };

  // State for Partner Inquiry Modal
  const [showPartnerInquiryModal, setShowPartnerInquiryModal] = useState(false);
  const [partnerInquiryForm, setPartnerInquiryForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    message: '',
  });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySubmitStatus, setInquirySubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [inquiryErrorMessage, setInquiryErrorMessage] = useState('');

  // 白标模式
  const { isWhiteLabelMode, branding } = useWhiteLabel();
  const { hideOfficialBranding, hideGuidePartnerContent } = useWhiteLabelVisibility();

  // 从数据库获取网站图片配置（支持后台管理更换图片）
  const { getImage: getDbImage } = useSiteImages();

  // 获取图片：优先从数据库获取，如果数据库没有则使用硬编码的默认值
  // @param key - 图片标识符
  // @param fallback - 可选的备用图片 URL（用于数据库和静态配置都没有的情况）
  const getImage = (key: string, fallback?: string): string => {
    const dbImage = getDbImage(key);
    if (dbImage) return dbImage;
    return DEFAULT_SITE_IMAGES[key] || fallback || FALLBACK_IMAGES[key] || FALLBACK_IMAGES.default;
  };

  useEffect(() => { emailjs.init('exX0IhSSUjNgMhuGb'); }, []);

  // 从 cookie 读取用户语言偏好
  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    // 如果没有 cookie，根据浏览器语言判断
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
    else setCurrentLang('ja');
  }, []);

  const lang: Language = currentLang || 'ja';
  const t = translations[lang];

  // 处理 URL 参数和 hash，支持从其他页面跳转回来时切换到指定页面
  // 使用 searchParams 监听 URL 变化，解决点击 Logo 无法返回首页的问题
  useEffect(() => {
    // 优先从路径检测页面（支持 next.config.js rewrites: /medical → /?page=medical）
    const PATH_PAGE_MAP: Record<string, PageView> = {
      '/medical': 'medical',
      '/golf': 'golf',
      '/business': 'business',
      '/partner': 'partner',
    };
    const pageFromPath = PATH_PAGE_MAP[pathname];

    // 其次从查询参数检测（兼容旧链接 /?page=medical）
    const pageFromParam = searchParams.get('page');

    if (pageFromPath) {
      setCurrentPage(pageFromPath);
    } else if (pageFromParam && ['medical', 'golf', 'business', 'partner'].includes(pageFromParam)) {
      setCurrentPage(pageFromParam as PageView);
    } else {
      setCurrentPage('home');
    }

    // 处理 hash 锚点
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          if (id === 'ai-b2b' || id === 'about') setCurrentPage('home');
        }
      }, 500);
    }
  }, [pathname, searchParams]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authFormData.companyName.trim() || !authFormData.email.trim() || !authFormData.contactPerson.trim()) {
      setAuthError('全ての項目を入力してください (All fields are required)');
      return;
    }
    setIsSendingAuth(true);
    // ... (Auth Logic) ...
    setTimeout(() => {
        setIsSendingAuth(false);
        // Pass the landingInputText to the onLogin callback
        onLogin(
          { companyName: authFormData.companyName, email: authFormData.email },
          landingInputText
        );
    }, 1000);
  };

  const openAuthModal = () => { setAuthError(''); setShowAuthModal(true); };

  // Partner Inquiry Form handlers
  const openPartnerInquiryModal = () => {
    setPartnerInquiryForm({ companyName: '', contactName: '', email: '', phone: '', businessType: '', message: '' });
    setInquirySubmitStatus('idle');
    setInquiryErrorMessage('');
    setShowPartnerInquiryModal(true);
  };

  const handlePartnerInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerInquiryForm.companyName.trim() || !partnerInquiryForm.contactName.trim() ||
        !partnerInquiryForm.email.trim() || !partnerInquiryForm.message.trim()) {
      setInquiryErrorMessage('請填寫所有必填欄位');
      return;
    }

    setIsSubmittingInquiry(true);
    setInquiryErrorMessage('');

    try {
      const response = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerInquiryForm),
      });

      const data = await response.json();

      if (response.ok) {
        setInquirySubmitStatus('success');
      } else {
        setInquirySubmitStatus('error');
        setInquiryErrorMessage(data.error || '提交失敗，請稍後再試');
      }
    } catch (error) {
      setInquirySubmitStatus('error');
      setInquiryErrorMessage('網絡錯誤，請稍後再試');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  // 根据当前页面确定 PublicLayout 的 activeNav
  const getActiveNav = () => {
    if (currentPage === 'medical') return 'medical';
    if (currentPage === 'golf') return 'golf';
    if (currentPage === 'business') return 'business';
    if (currentPage === 'partner') return 'partner';
    return undefined;
  };

  const handleLogoClick = () => {
    setCurrentPage('home');
    router.push('/'); // 清理 URL 参数，确保首页 URL 是纯粹的 /
  };

  return (
    <PublicLayout activeNav={getActiveNav()} transparentNav={true} onLogoClick={handleLogoClick}>
       {/* Content */}
       <main className="min-h-screen">
          {currentPage === 'home' && (
            <HomeView
              t={t}
              setCurrentPage={setCurrentPage}
              onLoginTrigger={() => router.push('/login')}
              currentLang={lang}
              landingInputText={landingInputText}
              setLandingInputText={setLandingInputText}
              hideOfficialBranding={hideOfficialBranding}
              getImage={getImage}
            />
          )}
          {currentPage === 'medical' && <MedicalView t={t} setCurrentPage={setCurrentPage} onOpenTIMCQuote={() => setShowTIMCQuoteModal(true)} currentLang={lang} getImage={getImage} />}
          {currentPage === 'business' && <BusinessView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={() => router.push('/login')} currentLang={lang} getImage={getImage} />}
          {currentPage === 'golf' && <GolfView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={() => router.push('/login')} currentLang={lang} getImage={getImage} />}
          {/* 白标模式下隐藏 Partner 页面（B2B 同业合作） */}
          {currentPage === 'partner' && !hideGuidePartnerContent && <PartnerView t={t} setCurrentPage={setCurrentPage} onOpenPartnerInquiry={openPartnerInquiryModal} currentLang={lang} getImage={getImage} />}
       </main>

       {/* Auth Modal */}
       {showAuthModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
               <button
                 onClick={() => setShowAuthModal(false)}
                 className="absolute top-4 right-4 text-neutral-400 hover:text-black transition"
               >
                 <X size={20} />
               </button>

               <div className="mb-8 text-center">
                  <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <User size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-900">
                    {lang === 'ja' ? 'B2B パートナー登録' : 'Partner Application'}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-2">
                    Access exclusive B2B rates and AI quoting system.
                  </p>
               </div>

               <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={authFormData.companyName}
                      onChange={(e) => setAuthFormData({...authFormData, companyName: e.target.value})}
                      className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="Travel Agency Co., Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={authFormData.contactPerson}
                      onChange={(e) => setAuthFormData({...authFormData, contactPerson: e.target.value})}
                      className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authFormData.email}
                      onChange={(e) => setAuthFormData({...authFormData, email: e.target.value})}
                      className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="agent@example.com"
                    />
                  </div>
                  {authError && <p className="text-xs text-gold-500">{authError}</p>}
                  <button
                    type="submit"
                    disabled={isSendingAuth}
                    className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition shadow-lg mt-2 flex items-center justify-center gap-2"
                  >
                    {isSendingAuth ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                    {isSendingAuth ? 'Processing...' : 'Apply for Access'}
                  </button>
               </form>
            </div>
         </div>
       )}

       {/* Partner Inquiry Modal */}
       {showPartnerInquiryModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
               <button
                 onClick={() => setShowPartnerInquiryModal(false)}
                 className="absolute top-4 right-4 text-neutral-400 hover:text-black transition z-10"
               >
                 <X size={20} />
               </button>

               {inquirySubmitStatus === 'success' ? (
                 // Success State
                 <div className="p-8 text-center">
                   <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle className="text-brand-700" size={32} />
                   </div>
                   <h3 className="text-2xl font-serif font-bold text-brand-900 mb-4">申請已提交</h3>
                   <p className="text-neutral-600 mb-6">
                     感謝您的合作申請！我們已收到您的信息，<br />
                     將在 1-2 個工作日內與您聯繫。
                   </p>
                   <button
                     onClick={() => setShowPartnerInquiryModal(false)}
                     className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-500 transition"
                   >
                     關閉
                   </button>
                 </div>
               ) : (
                 // Form State
                 <>
                   <div className="p-6 border-b border-neutral-100">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
                         <Handshake size={20} />
                       </div>
                       <div>
                         <h3 className="text-xl font-serif font-bold text-brand-900">
                           同業合作申請
                         </h3>
                         <p className="text-sm text-neutral-500">填寫以下資料，我們將盡快與您聯繫</p>
                       </div>
                     </div>
                   </div>

                   <form onSubmit={handlePartnerInquirySubmit} className="p-6 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                           公司名稱 <span className="text-gold-500">*</span>
                         </label>
                         <input
                           type="text"
                           required
                           value={partnerInquiryForm.companyName}
                           onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, companyName: e.target.value})}
                           className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                           placeholder="旅行社名稱"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                           聯絡人 <span className="text-gold-500">*</span>
                         </label>
                         <input
                           type="text"
                           required
                           value={partnerInquiryForm.contactName}
                           onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, contactName: e.target.value})}
                           className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                           placeholder="您的姓名"
                         />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                           電子郵件 <span className="text-gold-500">*</span>
                         </label>
                         <input
                           type="email"
                           required
                           value={partnerInquiryForm.email}
                           onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, email: e.target.value})}
                           className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                           placeholder="email@company.com"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                           聯絡電話
                         </label>
                         <input
                           type="tel"
                           value={partnerInquiryForm.phone}
                           onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, phone: e.target.value})}
                           className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                           placeholder="+886 912 345 678"
                         />
                       </div>
                     </div>

                     <div>
                       <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                         業務類型
                       </label>
                       <select
                         value={partnerInquiryForm.businessType}
                         onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, businessType: e.target.value})}
                         className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                       >
                         <option value="">請選擇</option>
                         <option value="旅行社">旅行社</option>
                         <option value="OTA 平台">OTA 平台</option>
                         <option value="導遊/領隊">導遊/領隊</option>
                         <option value="企業差旅">企業差旅</option>
                         <option value="其他">其他</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                         合作意向說明 <span className="text-gold-500">*</span>
                       </label>
                       <textarea
                         required
                         rows={4}
                         value={partnerInquiryForm.message}
                         onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, message: e.target.value})}
                         className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                         placeholder="請簡述您的合作需求，例如：主要客群、預計業務量、希望合作的產品類型等..."
                       />
                     </div>

                     {inquiryErrorMessage && (
                       <p className="text-sm text-gold-500 bg-gold-50 p-3 rounded-lg">{inquiryErrorMessage}</p>
                     )}

                     <button
                       type="submit"
                       disabled={isSubmittingInquiry}
                       className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {isSubmittingInquiry ? (
                         <>
                           <Loader2 className="animate-spin" size={16} />
                           提交中...
                         </>
                       ) : (
                         <>
                           <Mail size={16} />
                           提交申請
                         </>
                       )}
                     </button>

                     <p className="text-xs text-neutral-400 text-center">
                       提交後我們會將確認信發送至您的郵箱
                     </p>
                   </form>
                 </>
               )}
            </div>
         </div>
       )}

       {/* TIMC Quote Modal */}
       <TIMCQuoteModal
         isOpen={showTIMCQuoteModal}
         onClose={() => setShowTIMCQuoteModal(false)}
       />

       {/* Toast Notification */}
       {toast.show && (
         <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
           <div
             className={`
               rounded-lg shadow-2xl p-4 min-w-[300px] max-w-md
               flex items-start gap-3
               ${toast.type === 'error' ? 'bg-gold-50 border-l-4 border-gold-500' : ''}
               ${toast.type === 'success' ? 'bg-brand-50 border-l-4 border-brand-600' : ''}
               ${toast.type === 'info' ? 'bg-brand-50 border-l-4 border-brand-500' : ''}
             `}
           >
             <div className="flex-shrink-0 mt-0.5">
               {toast.type === 'error' && (
                 <X className="h-5 w-5 text-gold-500" />
               )}
               {toast.type === 'success' && (
                 <CheckCircle className="h-5 w-5 text-brand-600" />
               )}
               {toast.type === 'info' && (
                 <Activity className="h-5 w-5 text-brand-500" />
               )}
             </div>
             <div className="flex-1">
               <p
                 className={`text-sm font-medium ${
                   toast.type === 'error' ? 'text-gold-800' :
                   toast.type === 'success' ? 'text-brand-800' :
                   'text-brand-800'
                 }`}
               >
                 {toast.message}
               </p>
             </div>
             <button
               onClick={() => setToast({ show: false, message: '', type: 'info' })}
               className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
             >
               <X className="h-4 w-4" />
             </button>
           </div>
         </div>
       )}
    </PublicLayout>
  );
};

export default LandingPage;
