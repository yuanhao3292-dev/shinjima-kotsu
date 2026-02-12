
import React, { useState, useEffect, memo, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

type PageView = 'home' | 'medical' | 'business' | 'golf' | 'partner';

interface SubViewProps {
  t: any;
  setCurrentPage: (page: PageView) => void;
  onLoginTrigger?: () => void;
  onOpenTIMCQuote?: () => void;
  onOpenPartnerInquiry?: () => void;
  currentLang: Language;
  landingInputText?: string;
  setLandingInputText?: (text: string) => void;
  // 白标模式：隐藏官方品牌内容
  hideOfficialBranding?: boolean;
  // 从数据库获取图片的函数（支持可选的 fallback 参数）
  getImage: (key: string, fallback?: string) => string;
  // 图片是否正在加载
  imagesLoading?: boolean;
}

// --- NEW COMPONENT: AI Tech Card (Used in Sub-views) ---
// 使用 React.memo 优化渲染性能
const MedicalTechCard = memo(function MedicalTechCard({
  img,
  title,
  desc,
  icon: Icon,
  colorClass,
  fallbackKey,
  spec1,
  spec2
}: {
  img: string,
  title: string,
  desc: string,
  icon: any,
  colorClass: string,
  fallbackKey: string,
  spec1: string,
  spec2: string
}) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Image Container with Tech Overlay */}
      <div className="relative h-64 overflow-hidden bg-gray-900">
        <Image
          src={img}
          fill
          className="object-cover transition-all duration-700"
          alt={title}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2.5s_linear_infinite]"></div>
        </div>
        <div className="absolute top-4 left-4">
           <div className={`w-8 h-8 rounded backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white ${colorClass}`}>
              <Icon size={16} />
           </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
           <span className="text-[10px] text-white bg-black/50 backdrop-blur px-2 py-1 rounded border border-white/10 uppercase tracking-wider font-mono">AI Analysis</span>
           <span className="text-[10px] text-green-400 bg-black/50 backdrop-blur px-2 py-1 rounded border border-white/10 font-mono">Active</span>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-2 mb-3">
           <div className={`h-1 w-6 rounded-full ${colorClass.replace('text-', 'bg-')}`}></div>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Advanced Tech</span>
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-blue-700 transition-colors">{title}</h4>
        <div className="flex flex-wrap gap-2 mb-4">
           <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
              <Cpu size={10} /> {spec1}
           </span>
           <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
              <Scan size={10} /> {spec2}
           </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed text-justify line-clamp-4 group-hover:line-clamp-none transition-all">
           {desc}
        </p>
      </div>
    </div>
  );
});

// 使用 React.memo 优化 MedicalView 渲染性能
const MedicalView: React.FC<SubViewProps> = ({ t, setCurrentPage, onOpenTIMCQuote, currentLang, getImage }) => (
  <div className="animate-fade-in-up min-h-screen bg-white">
    {/* 1. Hero Section - Full height with transparent nav overlap */}
    <div className="relative min-h-[85vh] flex items-center overflow-hidden text-white bg-slate-900">
      <Image
          src={getImage('medical_hero')}
          fill
          className="object-cover opacity-80"
          alt="TIMC Lobby Luxury Environment"
          key="medical_hero"
          sizes="100vw"
          quality={75}
          priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent"></div>
      <div className="absolute inset-0 opacity-30 pointer-events-none">
         <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>
      <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-4 md:mb-6 leading-[1.2]">
                 {t.medical.hero_title_1}<br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{t.medical.hero_title_2}</span>
              </h1>
              <h2 className="text-base sm:text-lg md:text-2xl text-gray-300 font-light mb-6 md:mb-8 font-serif">
                 {t.medical.hero_subtitle}
              </h2>
              <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base border-l-2 border-blue-500 pl-4 md:pl-6 max-w-2xl whitespace-pre-line">
                 {t.medical.hero_text}
              </p>
              {/* 限量營銷文案 */}
              <div className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-5 py-3 rounded-full backdrop-blur-md">
                  <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <span className="text-amber-200 text-sm font-medium">{t.medical.limit_badge}</span>
              </div>
          </div>
      </div>
    </div>

    {/* Hospital Introduction Video Section */}
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 py-20">
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="text-center mb-12">
          <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-bold">Hospital Tour</span>
          <h3 className="text-3xl font-serif text-white mt-3">{t.medical.video_title}</h3>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl mx-auto">{t.medical.video_subtitle}</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
            <video
              className="w-full h-full object-cover"
              controls
              poster="https://i.ibb.co/xS1h4rTM/hero-medical.jpg"
              preload="metadata"
            >
              <source src="https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/videos/copy_A7D2D113-F200-464B-8DC8-AA15F3D66488.MOV" type="video/mp4" />
              {t.medical.video_fallback}
            </video>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">{t.medical.video_caption}</p>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-6 py-12 md:py-24 py-24">
      {/* 2. Authority Section */}
      <div className="mb-24">
          <div className="text-center mb-16">
              <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">{t.medical.auth_tag}</span>
              <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.medical.auth_title}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                      <Building size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{t.medical.auth_1_t}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.medical.auth_1_d}</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                  <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition">
                      <MapPin size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{t.medical.auth_2_t}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.medical.auth_2_d}</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                  <div className="w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-800 group-hover:text-white transition">
                      <Shield size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{t.medical.auth_3_t}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.medical.auth_3_d}</p>
              </div>
          </div>
      </div>

      {/* 3. Tech Section - 双列全屏背景图设计 */}
      <div className="mb-0">
          <div className="text-center py-20 bg-white">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-3">{t.medical.tech_title}</h3>
              <p className="text-gray-500 text-sm tracking-widest uppercase mb-6">Medical Equipment Lineup</p>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto px-4">{t.medical.tech_sub}</p>
          </div>

          {/* Row 1: CT + MRI */}
          <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
              {/* CT - Left */}
              <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
                  <Image
                      src={getImage('tech_ct')}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="CT Scanner"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.tech_ct_t}</h4>
                      <p className="text-base text-white/80 leading-relaxed">{t.medical.tech_ct_d}</p>
                  </div>
              </div>
              {/* MRI - Right */}
              <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
                  <Image
                      src={getImage('tech_mri')}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="MRI Scanner"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.tech_mri_t}</h4>
                      <p className="text-base text-white/80 leading-relaxed">{t.medical.tech_mri_d}</p>
                  </div>
              </div>
          </div>

          {/* Row 2: Endoscopy + Dental */}
          <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
              {/* Endoscopy - Left */}
              <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
                  <Image
                      src={getImage('tech_endo')}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Endoscopy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.tech_endo_t}</h4>
                      <p className="text-base text-white/80 leading-relaxed">{t.medical.tech_endo_d}</p>
                  </div>
              </div>
              {/* Dental - Right */}
              <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
                  <Image
                      src={getImage('tech_dental')}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Dental"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.tech_dental_t}</h4>
                      <p className="text-base text-white/80 leading-relaxed">{t.medical.tech_dental_d}</p>
                  </div>
              </div>
          </div>

          {/* Row 3: Ultrasound + Mammography */}
          <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
              {/* Ultrasound - Left */}
              <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
                  <Image
                      src={getImage('detail_echo')}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Ultrasound"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.detail_echo_title}</h4>
                      <p className="text-base text-white/80 leading-relaxed">{t.medical.detail_echo_desc}</p>
                  </div>
              </div>
              {/* Mammography - Right */}
              <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
                  <Image
                      src={getImage('detail_mammo')}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Mammography"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.detail_mammo_title}</h4>
                      <p className="text-base text-white/80 leading-relaxed">{t.medical.detail_mammo_desc}</p>
                  </div>
              </div>
          </div>
      </div>

      {/* 3.5. Facility & Rooms Section */}
      <div className="mb-24">
          <div className="text-center py-20 bg-white">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-3">{t.medical.facility_title}</h3>
              <p className="text-gray-500 text-sm tracking-widest uppercase mb-6">Facility & Rooms</p>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto px-4">{t.medical.facility_subtitle}</p>
          </div>

          <div className="space-y-0">
              {/* Facility 1 - Center Interior */}
              <div className="relative min-h-[60vh] flex items-center overflow-hidden">
                  <Image
                      src={getImage('facility_center')}
                      fill
                      className="object-cover"
                      alt="Center Interior"
                      sizes="100vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
                  <div className="relative container mx-auto px-6 py-12 md:py-24 py-16">
                      <div className="max-w-xl">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="h-[1px] w-12 bg-amber-400"></div>
                              <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">01</span>
                          </div>
                          <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.medical.facility_1_title}</h4>
                          <p className="text-lg text-white/80 leading-relaxed">{t.medical.facility_1_desc}</p>
                          <div className="mt-6 flex gap-3">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">4,000㎡</span>
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Japan's Largest</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Facility 2 - Reception */}
              <div className="relative min-h-[60vh] flex items-center overflow-hidden">
                  <Image
                      src={getImage('facility_reception')}
                      fill
                      className="object-cover"
                      alt="Reception"
                      sizes="100vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-slate-900/90 via-slate-900/70 to-transparent"></div>
                  <div className="relative container mx-auto px-6 py-12 md:py-24 py-16">
                      <div className="max-w-xl ml-auto text-right">
                          <div className="flex items-center justify-end gap-3 mb-4">
                              <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">02</span>
                              <div className="h-[1px] w-12 bg-amber-400"></div>
                          </div>
                          <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.medical.facility_2_title}</h4>
                          <p className="text-lg text-white/80 leading-relaxed">{t.medical.facility_2_desc}</p>
                          <div className="mt-6 flex justify-end gap-3">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Concierge</span>
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Hospitality</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Facility 3 - Private Suites */}
              <div className="relative min-h-[60vh] flex items-center overflow-hidden">
                  <Image
                      src={getImage('facility_room')}
                      fill
                      className="object-cover"
                      alt="Private Suite"
                      sizes="100vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
                  <div className="relative container mx-auto px-6 py-12 md:py-24 py-16">
                      <div className="max-w-xl">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="h-[1px] w-12 bg-amber-400"></div>
                              <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">03</span>
                          </div>
                          <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.medical.facility_3_title}</h4>
                          <p className="text-lg text-white/80 leading-relaxed">{t.medical.facility_3_desc}</p>
                          <div className="mt-6 flex gap-3 flex-wrap">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">20 Rooms</span>
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">30㎡+</span>
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Full Privacy</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Facility 4 - Bathroom */}
              <div className="relative min-h-[60vh] flex items-center overflow-hidden">
                  <Image
                      src={getImage('facility_bathroom')}
                      fill
                      className="object-cover"
                      alt="Bathroom"
                      sizes="100vw"
                      quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-slate-900/90 via-slate-900/70 to-transparent"></div>
                  <div className="relative container mx-auto px-6 py-12 md:py-24 py-16">
                      <div className="max-w-xl ml-auto text-right">
                          <div className="flex items-center justify-end gap-3 mb-4">
                              <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">04</span>
                              <div className="h-[1px] w-12 bg-amber-400"></div>
                          </div>
                          <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.medical.facility_4_title}</h4>
                          <p className="text-lg text-white/80 leading-relaxed">{t.medical.facility_4_desc}</p>
                          <div className="mt-6 flex justify-end gap-3">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Luxury</span>
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Full Amenities</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 4. Flow Experience */}
      <div className="mb-24 bg-gray-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div>
           <div className="relative z-10 text-center mb-12">
               <h3 className="text-3xl font-serif">{t.medical.flow_title}</h3>
               <p className="text-gray-400 mt-2 text-sm">Experience the Flow</p>
           </div>
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
              {[
                  { id: '01', icon: <Building size={24} />, title: t.medical.flow_1, desc: t.medical.flow_1_d },
                  { id: '02', icon: <Armchair size={24} />, title: t.medical.flow_2, desc: t.medical.flow_2_d },
                  { id: '03', icon: <Activity size={24} />, title: t.medical.flow_3, desc: t.medical.flow_3_d },
                  { id: '04', icon: <FileText size={24} />, title: t.medical.flow_4, desc: t.medical.flow_4_d },
                  { id: '05', icon: <Coffee size={24} />, title: t.medical.flow_5, desc: t.medical.flow_5_d },
              ].map((step, i) => (
               <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition group">
                  <div className="text-blue-400 font-mono text-xl mb-4 opacity-50">{step.id}</div>
                  <div className="flex justify-center mb-4 text-white opacity-80 group-hover:scale-110 transition">{step.icon}</div>
                  <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
               </div>
              ))}
           </div>
      </div>

      {/* 5. Packages - UPDATED 6 COURSES */}
      <div className="mb-24" id="timc-packages">
          <div className="text-center mb-16">
              <h3 className="text-3xl font-serif text-gray-900">{t.medical.pkg_title}</h3>
              <p className="text-gray-500 text-sm mt-2">TIMC × NIIJIMA Exclusive B2B Lineup</p>

              {/* 套餐推荐按钮 */}
              <div className="mt-8">
                  <a
                      href="/package-recommender"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-full font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                  >
                      <MessageSquare size={20} />
                      <span>{t.medical.pkg_recommend_btn}</span>
                      <ArrowRight size={18} />
                  </a>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
              
              {/* 1. VIP Member */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1 border border-gray-900 rounded-2xl p-6 hover:shadow-2xl transition hover:-translate-y-1 relative overflow-hidden bg-gray-900 text-white flex flex-col">
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Flagship</div>
                  <div className="mb-4">
                      <h4 className="text-xl font-serif font-bold text-yellow-400">{t.medical.pkg_vip_title}</h4>
                      <p className="text-xs text-gray-400 mt-1">VIP Member Course</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-2">¥1,512,500</p>
                      <p className="text-[10px] text-gray-500">{t.medical.pkg_price_note}</p>
                  </div>
                  <p className="text-xs text-gray-300 mb-4 leading-relaxed flex-grow">
                      {t.medical.pkg_vip_desc}
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_5}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_6}</div>
                  </div>
                  <a href="/medical-packages/vip-member-course" className="w-full py-2 bg-yellow-500 text-black text-xs font-bold rounded hover:bg-yellow-400 transition text-center block">{t.medical.pkg_consult_btn}</a>
              </div>

              {/* 2. PREMIUM (Cardiac) */}
              <div className="border border-blue-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-blue-900">{t.medical.pkg_premium_title}</h4>
                       <p className="text-xs text-blue-400 mt-1">Premium Cardiac Course</p>
                       <p className="text-xl font-bold text-blue-900 mt-2">¥825,000</p>
                       <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_premium_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_5}</div>
                   </div>
                   <a href="/medical-packages/premium-cardiac-course" className="w-full py-2 border border-blue-200 text-blue-600 text-xs font-bold rounded hover:bg-blue-50 transition text-center block">{t.medical.pkg_consult_btn}</a>
              </div>

              {/* 3. SELECT (Gastro + Colon) */}
              <div className="border border-green-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-green-900">{t.medical.pkg_select_gc_title}</h4>
                       <p className="text-xs text-green-500 mt-1">Gastro + Colonoscopy Course</p>
                       <p className="text-xl font-bold text-green-900 mt-2">¥825,000</p>
                       <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_select_gc_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_5}</div>
                   </div>
                   <a href="/medical-packages/select-gastro-colonoscopy" className="w-full py-2 border border-green-200 text-green-600 text-xs font-bold rounded hover:bg-green-50 transition text-center block">{t.medical.pkg_consult_btn}</a>
              </div>

              {/* 4. SELECT (Stomach only) */}
              <div className="border border-teal-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-teal-800">{t.medical.pkg_select_g_title}</h4>
                       <p className="text-xs text-teal-500 mt-1">Gastroscopy Course</p>
                       <p className="text-xl font-bold text-teal-800 mt-2">¥687,500</p>
                       <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_select_g_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_5}</div>
                   </div>
                   <Link href="/medical-packages/select-gastroscopy" className="w-full py-2 border border-teal-200 text-teal-600 text-xs font-bold rounded hover:bg-teal-50 transition text-center block">{t.medical.pkg_consult_btn}</Link>
              </div>

              {/* 5. DWIBS */}
              <div className="border border-purple-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-purple-900">{t.medical.pkg_dwibs_title}</h4>
                       <p className="text-xs text-purple-500 mt-1">DWIBS Cancer Screening</p>
                       <p className="text-xl font-bold text-purple-900 mt-2">¥275,000</p>
                       <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_dwibs_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_5}</div>
                   </div>
                   <Link href="/medical-packages/dwibs-cancer-screening" className="w-full py-2 border border-purple-200 text-purple-600 text-xs font-bold rounded hover:bg-purple-50 transition text-center block">{t.medical.pkg_consult_btn}</Link>
              </div>

              {/* 6. BASIC */}
              <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-gray-50 flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-gray-800">{t.medical.pkg_basic_title}</h4>
                       <p className="text-xs text-gray-500 mt-1">Standard Checkup Course</p>
                       <p className="text-xl font-bold text-gray-800 mt-2">¥550,000</p>
                       <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_basic_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_5}</div>
                   </div>
                   <Link href="/medical-packages/basic-checkup" className="w-full py-2 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-100 transition text-center block">{t.medical.pkg_consult_btn}</Link>
              </div>

          </div>
      </div>

      {/* 套餐對比表格 */}
      <div className="mb-24" id="timc-comparison">
          <div className="text-center mb-12">
              <h3 className="text-3xl font-serif text-gray-900">{t.medical.pkg_compare_title}</h3>
              <p className="text-gray-500 text-sm mt-2">{t.medical.pkg_compare_sub}</p>
          </div>
          <div className="max-w-7xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <PackageComparisonTable currentLang={currentLang} />
              </div>
          </div>
      </div>

      {/* 客戶評價區塊 - 自動滾動輪播 */}
      <div className="mb-24" id="timc-testimonials">
          <div className="text-center mb-16">
              <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">Customer Reviews</span>
              <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.medical.testimonials_title}</h3>
              <p className="text-gray-500 text-sm mt-2">{t.medical.testimonials_sub}</p>
          </div>

          {/* 統計數據 */}
          <div className="flex flex-wrap justify-center gap-12 mb-12">
              <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-500 mt-1">{t.medical.stat_satisfaction}</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-500 mt-1">{t.medical.stat_served}</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">4.9</div>
                  <div className="text-sm text-gray-500 mt-1">{t.medical.stat_rating}</div>
              </div>
          </div>

          {/* 自動滾動評價卡片 */}
          <div className="relative overflow-hidden">
              {/* 左右漸變遮罩 */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              {/* 滾動容器 */}
              <div className="flex animate-scroll-reviews hover:pause-animation">
                  {/* 第一組評價 */}
                  {[
                      { name: '陳先生', loc: '台北', flag: '🇹🇼', pkg: 'SELECT 甄選套餐', text: '第一次來日本做健檢，從預約到體檢完成都非常順暢。TIMC的設備真的很先進，整個環境也很舒適。', highlight: '設備先進、環境舒適' },
                      { name: '林小姐', loc: '高雄', flag: '🇹🇼', pkg: 'PREMIUM 尊享套餐', text: '做了PET-CT全身檢查，醫生非常仔細地解說了每一項結果。中文報告很詳盡，下次會帶爸媽一起來。', highlight: 'PET-CT檢查專業' },
                      { name: '王先生', loc: '新竹', flag: '🇹🇼', pkg: 'VIP 至尊套餐', text: '公司高管健檢選擇了VIP套餐，從機場接送到檢查後的休息都安排得很周到。腸胃鏡是無痛的，睡一覺就做完了。', highlight: '無痛腸胃鏡、服務周到' },
                      { name: '黃先生', loc: '上海', flag: '🇨🇳', pkg: 'PREMIUM 尊享套餐', text: '專程從上海飛過來做體檢，整體體驗非常好。日本的醫療水平確實領先，MRI檢查非常細緻。', highlight: 'MRI檢查細緻' },
                      { name: '張小姐', loc: '香港', flag: '🇭🇰', pkg: 'SELECT 甄選套餐', text: '香港過來很方便，兩個小時飛機就到。檢查流程很順，翻譯全程陪同，完全沒有語言障礙。', highlight: '中文服務貼心' },
                      { name: '李先生', loc: '深圳', flag: '🇨🇳', pkg: 'VIP 至尊套餐', text: '帶父母一起來做年度健檢，VIP套餐的休息室非常舒適，老人家也不會覺得累。報告解讀很詳細。', highlight: '適合全家健檢' },
                      { name: '吳小姐', loc: '台中', flag: '🇹🇼', pkg: 'PREMIUM 尊享套餐', text: '朋友推薦來的，做了全身MRI和腫瘤標記物檢測。醫生說我的健康狀況很好，讓我安心不少。', highlight: '全身MRI精準' },
                      { name: '許先生', loc: '北京', flag: '🇨🇳', pkg: 'SELECT 甄選套餐', text: '日本醫療服務果然名不虛傳，從接機開始就感受到專業。已經推薦給好幾個朋友了。', highlight: '接機服務周到' },
                  ].map((review, i) => (
                      <div key={`first-${i}`} className="flex-shrink-0 w-80 mx-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {localizeText(review.name, currentLang || 'zh-TW').charAt(0)}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-900 text-sm">{localizeText(review.name, currentLang || 'zh-TW')}</span>
                                      <span>{review.flag}</span>
                                  </div>
                                  <div className="text-xs text-gray-400">{review.loc}</div>
                              </div>
                          </div>
                          <div className="text-xs text-blue-600 font-medium mb-3">{localizeText(review.pkg, currentLang || 'zh-TW')}</div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{localizeText(review.text, currentLang || 'zh-TW')}</p>
                          <div className="flex items-center gap-2 text-green-600 text-xs">
                              <CheckCircle size={12} />
                              <span className="font-medium">{localizeText(review.highlight, currentLang || 'zh-TW')}</span>
                          </div>
                      </div>
                  ))}
                  {/* 複製一組實現無縫滾動 */}
                  {[
                      { name: '陳先生', loc: '台北', flag: '🇹🇼', pkg: 'SELECT 甄選套餐', text: '第一次來日本做健檢，從預約到體檢完成都非常順暢。TIMC的設備真的很先進，整個環境也很舒適。', highlight: '設備先進、環境舒適' },
                      { name: '林小姐', loc: '高雄', flag: '🇹🇼', pkg: 'PREMIUM 尊享套餐', text: '做了PET-CT全身檢查，醫生非常仔細地解說了每一項結果。中文報告很詳盡，下次會帶爸媽一起來。', highlight: 'PET-CT檢查專業' },
                      { name: '王先生', loc: '新竹', flag: '🇹🇼', pkg: 'VIP 至尊套餐', text: '公司高管健檢選擇了VIP套餐，從機場接送到檢查後的休息都安排得很周到。腸胃鏡是無痛的，睡一覺就做完了。', highlight: '無痛腸胃鏡、服務周到' },
                      { name: '黃先生', loc: '上海', flag: '🇨🇳', pkg: 'PREMIUM 尊享套餐', text: '專程從上海飛過來做體檢，整體體驗非常好。日本的醫療水平確實領先，MRI檢查非常細緻。', highlight: 'MRI檢查細緻' },
                      { name: '張小姐', loc: '香港', flag: '🇭🇰', pkg: 'SELECT 甄選套餐', text: '香港過來很方便，兩個小時飛機就到。檢查流程很順，翻譯全程陪同，完全沒有語言障礙。', highlight: '中文服務貼心' },
                      { name: '李先生', loc: '深圳', flag: '🇨🇳', pkg: 'VIP 至尊套餐', text: '帶父母一起來做年度健檢，VIP套餐的休息室非常舒適，老人家也不會覺得累。報告解讀很詳細。', highlight: '適合全家健檢' },
                      { name: '吳小姐', loc: '台中', flag: '🇹🇼', pkg: 'PREMIUM 尊享套餐', text: '朋友推薦來的，做了全身MRI和腫瘤標記物檢測。醫生說我的健康狀況很好，讓我安心不少。', highlight: '全身MRI精準' },
                      { name: '許先生', loc: '北京', flag: '🇨🇳', pkg: 'SELECT 甄選套餐', text: '日本醫療服務果然名不虛傳，從接機開始就感受到專業。已經推薦給好幾個朋友了。', highlight: '接機服務周到' },
                  ].map((review, i) => (
                      <div key={`second-${i}`} className="flex-shrink-0 w-80 mx-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {localizeText(review.name, currentLang || 'zh-TW').charAt(0)}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-900 text-sm">{localizeText(review.name, currentLang || 'zh-TW')}</span>
                                      <span>{review.flag}</span>
                                  </div>
                                  <div className="text-xs text-gray-400">{review.loc}</div>
                              </div>
                          </div>
                          <div className="text-xs text-blue-600 font-medium mb-3">{localizeText(review.pkg, currentLang || 'zh-TW')}</div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{localizeText(review.text, currentLang || 'zh-TW')}</p>
                          <div className="flex items-center gap-2 text-green-600 text-xs">
                              <CheckCircle size={12} />
                              <span className="font-medium">{localizeText(review.highlight, currentLang || 'zh-TW')}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* FAQ 常見問題 */}
      <div className="mb-24" id="timc-faq">
          <div className="text-center mb-16">
              <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">FAQ</span>
              <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.medical.faq_title}</h3>
              <p className="text-gray-500 text-sm mt-2">{t.medical.faq_sub}</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
              {[
                  { q: t.medical.faq_1_q, a: t.medical.faq_1_a },
                  { q: t.medical.faq_2_q, a: t.medical.faq_2_a },
                  { q: t.medical.faq_3_q, a: t.medical.faq_3_a },
                  { q: t.medical.faq_4_q, a: t.medical.faq_4_a },
                  { q: t.medical.faq_5_q, a: t.medical.faq_5_a },
                  { q: t.medical.faq_6_q, a: t.medical.faq_6_a },
              ].map((faq, i) => (
                  <details key={i} className="group bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
                          <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                          <ChevronDown size={20} className="text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-6 py-12 md:py-24 pb-6 text-gray-600 text-sm leading-relaxed">
                          {faq.a}
                      </div>
                  </details>
              ))}
          </div>
      </div>

      {/* 訂單查詢入口 */}
      <div className="mb-24" id="timc-order-lookup">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={28} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">{t.medical.order_title}</h3>
              <p className="text-gray-500 mb-6">{t.medical.order_sub}</p>
              <a
                  href="/order-lookup"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
              >
                  <FileText size={18} />
                  {t.medical.order_btn}
              </a>
          </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-200">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">{t.medical.cta_title}</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6 leading-relaxed whitespace-pre-line">
              {t.medical.cta_text}
          </p>
          {/* 限量提示 */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span className="text-blue-100 text-sm">{t.medical.cta_limit}</span>
          </div>
          <div>
              <button onClick={() => { const element = document.getElementById('timc-packages'); element?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-white text-blue-800 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition shadow-lg inline-flex items-center gap-2">
                  <Zap size={18} /> {t.medical.cta_btn}
              </button>
          </div>
      </div>

      {/* Contact Buttons */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t.medical.contact_other}</h3>
            <ContactButtons />
          </div>
        </div>
      </div>

      <div className="text-center py-12">
         <button onClick={() => setCurrentPage('home')} className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
      </div>
    </div>
  </div>
);

const GolfView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, getImage }) => {
  // Default images as fallback - All URLs verified working
  const defaultPlanImages: Record<string, string> = {
    'hokkaido-summer': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop',
    'hokkaido-niseko': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop',
    'hokkaido-premium': 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop',
    'okinawa-resort': 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop',
    'okinawa-island-hop': 'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1200&auto=format&fit=crop',
    'kyushu-onsen': 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?q=80&w=1200&auto=format&fit=crop',
    'kyushu-championship': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
    'kyushu-grand': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop',
    'chugoku-sanyo': 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200&auto=format&fit=crop',
    'chugoku-sanin': 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop',
    'shikoku-pilgrimage': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop',
    'shikoku-seto': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    'kansai-championship': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop',
    'kansai-kyoto': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop',
    'kansai-hirono': 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop',
    'tokyo-championship': 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop',
    'tokyo-fuji': 'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1200&auto=format&fit=crop',
    'tokyo-historic': 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?q=80&w=1200&auto=format&fit=crop',
    'chubu-alps': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
    'chubu-nagoya': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop',
  };

  // State for dynamic images from database
  const [planImages, setPlanImages] = useState<Record<string, string>>(defaultPlanImages);

  // Fetch images from API (database) on mount
  useEffect(() => {
    fetch('/api/golf-plan-images')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setPlanImages(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => {
        console.warn('Failed to fetch golf plan images from API:', err);
      });
  }, []);

  const getPlanImage = (id: string) => planImages[id] || defaultPlanImages[id] || getImage('golf_hero');

  // 合作球场数据（含官网链接）
  const partnerCourses = [
    { name: '六甲国際ゴルフ倶楽部', region: '兵庫', rank: 'Top 30', url: 'http://rokkokokusai-kobe.jp/' },
    { name: 'ABCゴルフ倶楽部', region: '兵庫', rank: 'Top 50', url: 'https://abc-golf.co.jp/' },
    { name: '太平洋クラブ御殿場コース', region: '静岡', rank: 'Top 10', url: 'https://www.taiheiyoclub.co.jp/course/gotenba/' },
    { name: '有馬ロイヤルゴルフクラブ', region: '兵庫', rank: 'Top 100', url: 'https://arima-royal.com/' },
    { name: 'ゴールデンバレーゴルフ倶楽部', region: '兵庫', rank: 'Top 100', url: 'https://www.gvgc.jp/' },
    { name: '富士桜カントリー倶楽部', region: '山梨', rank: 'Top 50', url: 'https://www.fujizakura-cc.jp/' },
  ];

  // 统计数据
  const stats = [
    { value: '25+', label: t.golf.stat_courses || '提携名門コース', sublabel: 'Premium Courses' },
    { value: '98%+', label: t.golf.stat_booking || '予約成功率', sublabel: 'Booking Success' },
    { value: '1,500+', label: t.golf.stat_guests || '年間VIPゲスト', sublabel: 'Annual VIP Guests' },
    { value: '15年', label: t.golf.stat_experience || '業界経験', sublabel: 'Years Experience' },
  ];

  return (
  <div className="animate-fade-in-up min-h-screen bg-[#FAFAF8]">
     {/* ===== HERO SECTION - Full Screen Cinematic ===== */}
     <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Ken Burns effect */}
        <div className="absolute inset-0">
          <Image
              src={getImage('golf_hero')}
              fill
              className="object-cover animate-kenburns-slow"
              alt="Golf Course"
              key="golf_hero"
              sizes="100vw"
              quality={75}
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-emerald-950/40"></div>
        </div>

        {/* Decorative gold lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 py-12 md:py-24 max-w-5xl mx-auto">
           {/* Main Title with Gold Accent */}
           <div className="animate-fade-in-up-delay-2">
             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-serif font-bold mb-4 tracking-tight">
               <span className="golf-gold-text">{t.golf.title_1}</span>
             </h1>
             <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-light text-white/90 mb-6 md:mb-8">{t.golf.title_2}</h2>
           </div>

           {/* Subtitle */}
           <div className="animate-fade-in-up-delay-3">
             <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed whitespace-pre-line font-light">
               {t.golf.desc}
             </p>
           </div>

           {/* CTA Button */}
           <div className="animate-fade-in-up-delay-4 flex justify-center">
             <button
               onClick={() => document.getElementById('golf-plans')?.scrollIntoView({ behavior: 'smooth' })}
               className="px-10 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
             >
               {t.golf.btn_tour || 'View Itineraries'}
             </button>
           </div>
        </div>
     </div>

     {/* ===== STATS BAR - Floating ===== */}
     <div className="relative -mt-20 z-20 container mx-auto px-6 py-12 md:py-24">
       <div className="golf-glass rounded-2xl p-8 shadow-2xl">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
           {stats.map((stat, i) => (
             <div key={i} className="golf-stat-card text-center p-4 rounded-xl hover:bg-emerald-50/50 transition-all duration-500">
               <div className="text-2xl md:text-4xl lg:text-5xl font-bold golf-gold-text mb-2">{stat.value}</div>
               <div className="text-sm font-bold text-gray-800">{stat.label}</div>
               <div className="text-xs text-gray-400 mt-1">{stat.sublabel}</div>
             </div>
           ))}
         </div>
       </div>
     </div>

     {/* ===== BRAND STANDARD SECTION ===== */}
     <div className="py-24 bg-gradient-to-b from-[#FAFAF8] to-white">
       <div className="container mx-auto px-6 py-12 md:py-24">
         {/* Section Header */}
         <div className="text-center mb-16">
           <div className="inline-flex items-center gap-4 mb-4">
             <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
             <span className="text-amber-600 text-xs tracking-[0.3em] uppercase font-bold">{t.golf.std_title}</span>
             <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
           </div>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 golf-title-decorated">
             Why Choose Niijima Golf?
           </h2>
         </div>

         {/* Feature Cards - Luxury Design */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: <Lock size={28} />, title: t.golf.f1_t, desc: t.golf.f1_d, accent: 'emerald' },
               { icon: <Trophy size={28} />, title: t.golf.f2_t, desc: t.golf.f2_d, accent: 'amber' },
               { icon: <Car size={28} />, title: t.golf.f3_t, desc: t.golf.f3_d, accent: 'slate' },
               { icon: <Bath size={28} />, title: t.golf.f4_t, desc: t.golf.f4_d, accent: 'orange' },
             ].map((item, i) => (
               <div
                 key={i}
                 className={`golf-luxury-card rounded-2xl p-8 group animate-fade-in-up-delay-${i + 1}`}
               >
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500
                    ${item.accent === 'emerald' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : ''}
                    ${item.accent === 'amber' ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white' : ''}
                    ${item.accent === 'slate' ? 'bg-slate-100 text-slate-600 group-hover:bg-slate-700 group-hover:text-white' : ''}
                    ${item.accent === 'orange' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white' : ''}
                  `}>
                    {item.icon}
                  </div>
                  {/* Gold top border on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
                  <h3 className="font-bold text-xl mb-4 font-serif text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
               </div>
             ))}
         </div>
       </div>
     </div>

     {/* ===== PARTNER COURSES SHOWCASE ===== */}
     <div className="py-20 bg-emerald-950 relative overflow-hidden">
       {/* Background Pattern */}
       <div className="absolute inset-0 opacity-5">
         <div className="absolute inset-0" style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
         }}></div>
       </div>

       <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
         <div className="text-center mb-12">
           <div className="inline-flex items-center gap-4 mb-4">
             <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
             <span className="text-amber-400 text-xs tracking-[0.3em] uppercase font-bold">Partner Courses</span>
             <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
           </div>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">{t.golf.partners_title || '提携名門コース'}</h2>
         </div>

         {/* Course Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
           {partnerCourses.map((course, i) => (
             <a
               key={i}
               href={course.url}
               target="_blank"
               rel="noopener noreferrer"
               className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-amber-400/30 transition-all duration-500 cursor-pointer block"
             >
               <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <MapPin size={20} className="text-amber-400" />
               </div>
               <h4 className="text-white font-bold text-sm mb-1 group-hover:text-amber-300 transition-colors">{course.name}</h4>
               <p className="text-white/50 text-xs mb-2">{course.region}</p>
               <span className="inline-block text-[10px] px-2 py-1 bg-amber-400/20 text-amber-300 rounded-full">{course.rank}</span>
               {/* External link indicator */}
               <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[10px] text-amber-400/70 flex items-center justify-center gap-1">
                   Official Site <ArrowRight size={10} />
                 </span>
               </div>
             </a>
           ))}
         </div>

         {/* More Courses Hint */}
         <div className="text-center mt-8">
           <span className="text-white/40 text-sm">...and 20+ more exclusive courses across Japan</span>
         </div>
       </div>
     </div>

     {/* ===== RECOMMENDED ITINERARIES ===== */}
     <div id="golf-plans" className="py-24 bg-white">
       <div className="container mx-auto px-6 py-12 md:py-24">
         {/* Section Header */}
         <div className="text-center mb-20">
           <div className="inline-flex items-center gap-4 mb-4">
             <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
             <span className="text-amber-600 text-xs tracking-[0.3em] uppercase font-bold">Signature Itineraries</span>
             <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
           </div>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-4">Recommended Itineraries</h2>
           <p className="text-gray-500 max-w-xl mx-auto">Curated experiences for discerning golfers</p>
         </div>

         {/* Plan Cards - Premium Design */}
         <div className="space-y-32">
            {t.golf.plans?.map((plan: any, index: number) => (
               <div
                 key={plan.id}
                 className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}
               >
                  {/* Image Card with Luxury Frame */}
                  <div className="lg:w-1/2 w-full">
                     <div className="relative group">
                        {/* Gold corner decorations */}
                        <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-amber-400/60 rounded-tl-lg z-10"></div>
                        <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-amber-400/60 rounded-br-lg z-10"></div>

                        {/* Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] lg:h-[500px]">
                           <Image
                              src={getPlanImage(plan.id)}
                              fill
                              className="object-cover transform group-hover:scale-105 transition duration-1000"
                              alt={plan.title}
                              sizes="(max-width: 768px) 100vw, 50vw"
                              quality={75}
                           />
                           {/* Gradient overlay */}
                           <div className="absolute inset-0 golf-image-overlay"></div>

                           {/* Tags overlay */}
                           <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                              {plan.tags.map((tag: string, i: number) => (
                                 <span
                                   key={i}
                                   className="golf-glass-dark text-white text-[10px] uppercase font-bold px-4 py-2 rounded-full tracking-wider"
                                 >
                                    {tag}
                                 </span>
                              ))}
                           </div>

                           {/* Plan number badge */}
                           <div className="absolute bottom-6 right-6">
                             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                               <span className="text-white font-bold text-lg">0{index + 1}</span>
                             </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Content - Luxury Typography */}
                  <div className="lg:w-1/2 w-full">
                     {/* Plan indicator */}
                     <div className="flex items-center gap-4 mb-4">
                        <span className="golf-gold-text font-bold text-sm tracking-[0.2em] uppercase">Plan 0{index + 1}</span>
                        <div className="flex-grow h-px bg-gradient-to-r from-amber-400/50 to-transparent"></div>
                     </div>

                     <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3 leading-tight">{plan.title}</h3>
                     <h4 className="text-lg text-amber-600 mb-6 font-medium">{plan.subtitle}</h4>
                     <p className="text-gray-600 leading-relaxed mb-10 text-lg">{plan.desc}</p>

                     {/* Schedule Card - Premium Style */}
                     <div className="golf-luxury-card rounded-2xl p-8 mb-10">
                        {/* Hotel Info */}
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                           <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                             <Building size={18} className="text-emerald-600" />
                           </div>
                           <div>
                             <span className="text-xs text-gray-400 uppercase tracking-wider">Accommodation</span>
                             <p className="text-gray-900 font-bold">{plan.hotel}</p>
                           </div>
                        </div>

                        {/* Schedule Timeline */}
                        <div className="space-y-4">
                           {plan.schedule.map((day: any, dIndex: number) => (
                              <div key={dIndex} className="flex gap-4 group">
                                 <div className="flex flex-col items-center">
                                   <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                     {dIndex + 1}
                                   </span>
                                   {dIndex < plan.schedule.length - 1 && (
                                     <div className="w-px h-full bg-gradient-to-b from-emerald-200 to-transparent mt-2"></div>
                                   )}
                                 </div>
                                 <div className="flex-1 pb-4">
                                   <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{day.day}</span>
                                   <p className="text-gray-700 leading-relaxed mt-1">{day.text}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
       </div>
     </div>

     {/* Contact Buttons */}
     <div className="py-16 bg-white">
       <div className="container mx-auto px-6 py-12 md:py-24">
         <div className="max-w-2xl mx-auto text-center">
           <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">開始您的高爾夫之旅</h3>
           <p className="text-gray-500 mb-8">專業球場預約・VIP禮遇・全程陪同</p>
           <ContactButtons />
         </div>
       </div>
     </div>

     {/* Back to Home */}
     <div className="py-8 bg-[#FAFAF8]">
       <button
         onClick={() => setCurrentPage('home')}
         className="w-full text-center text-gray-400 hover:text-emerald-600 transition-colors flex justify-center items-center gap-2 group"
       >
         <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
         {t.about.back}
       </button>
     </div>
  </div>
  );
};

const BusinessView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, currentLang, getImage }) => {
   // ⚡ 性能优化：缓存所有通用文本的翻译结果（减少 400+ 次重复调用）
   const localizedTexts = useMemo(() => ({
      // 类别标题
      automotive: localizeText('汽車製造業', currentLang),
      electronics: localizeText('電子與半導體產業', currentLang),
      precision: localizeText('精密機械與自動化', currentLang),
      medical: localizeText('醫療與健康照護', currentLang),
      appliances: localizeText('家電與消費電子', currentLang),
      retail: localizeText('零售與服務業', currentLang),
      hospitality: localizeText('飯店與款待業', currentLang),
      food: localizeText('食品與飲料產業', currentLang),
      logistics: localizeText('物流與運輸', currentLang),
      tech: localizeText('科技與通訊', currentLang),

      // 通用文案
      officialWebsite: localizeText('官方網站', currentLang),
      topCompanies: localizeText('可預約考察的日本頂級企業', currentLang),
      companyIntro: localizeText('以下企業均開放企業考察預約，我們負責全程協調、專業翻譯及行程安排', currentLang),
      bookableCompanies: localizeText('可預約企業', currentLang),
      industryCategories: localizeText('產業類別', currentLang),
      prefecturesCovered: localizeText('覆蓋都道府縣', currentLang),
      successRate: localizeText('預約成功率', currentLang),
      notice: localizeText('※ 注意事項', currentLang),
      noticeText: localizeText('以上企業均開放一般企業見學與商務考察預約。我們負責考察的預約協調、專業翻譯安排、交通接送及住宿統籌。各企業可參訪的時段與內容不盡相同，詳情請洽詢。', currentLang),
      ctaTitle: localizeText('開始您的商務考察', currentLang),
      ctaSubtitle: localizeText('專業行程定制・企業參訪安排・全程翻譯陪同', currentLang),
   }), [currentLang]);

   // ⚡ 性能优化：缓存所有企业数据的翻译结果
   // 数据源：@/data/companies.ts（数据与视图分离）
   const localizedCompanies = useMemo(() => {
      const localizeCompanies = (companies: Company[]) =>
         companies.map(c => ({
            name: localizeText(c.name, currentLang),
            nameEn: c.nameEn,
            desc: localizeText(c.desc, currentLang),
            url: c.url,
            location: localizeText(c.location, currentLang),
         }));

      return {
         automotive: localizeCompanies(COMPANY_DATA.automotive),
         electronics: localizeCompanies(COMPANY_DATA.electronics),
         precision: localizeCompanies(COMPANY_DATA.precision),
         medical: localizeCompanies(COMPANY_DATA.medical),
         appliances: localizeCompanies(COMPANY_DATA.appliances),
         retail: localizeCompanies(COMPANY_DATA.retail),
         hospitality: localizeCompanies(COMPANY_DATA.hospitality),
         food: localizeCompanies(COMPANY_DATA.food),
         logistics: localizeCompanies(COMPANY_DATA.logistics),
         tech: localizeCompanies(COMPANY_DATA.tech),
      };
   }, [currentLang]);

   // CONFIGURATION: Map Plan IDs to Image URLs
   // 所有图片均可通过数据库 site_images 表进行更换
   const planImages: Record<string, string> = {
      'biz-plan-1': getImage('biz_auto'),
      'biz-plan-2': getImage('biz_tech'),
      'biz-plan-3': getImage('biz_retail'),
      'biz-plan-4': getImage('biz_medical'),
      'biz-plan-5': getImage('biz_food'),
      'biz-plan-6': getImage('biz_hospitality'),
      'biz-plan-7': getImage('biz_century'),    // 百年企業經營哲學
      'biz-plan-8': getImage('biz_precision'),  // 精密製造與工匠精神
      'biz-plan-9': getImage('biz_esg'),        // ESG與永續經營
      'biz-plan-10': getImage('biz_inamori'),   // 稻盛和夫哲學
      'biz-plan-11': getImage('biz_logistics'), // 物流與供應鏈
      'biz-plan-12': getImage('biz_agtech'),    // 農業科技與食品安全
      'biz-plan-13': getImage('biz_dx'),        // 數位轉型DX
      'biz-plan-14': getImage('biz_construction'), // 建設與不動產
      'biz-plan-15': getImage('biz_senior_care'),   // 養老產業與銀髮經濟
      'biz-plan-16': getImage('biz_senior_living'), // 高端養老社區與認知症照護
   };

   const getBizImage = (id: string) => planImages[id] || getImage('business_hero');

   return (
    <div className="animate-fade-in-up min-h-screen bg-white">
      {/* Hero - Full height with transparent nav overlap */}
      <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
         {/* Background Image */}
         <div
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
           }}
         >
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/80 to-slate-900/70"></div>
         </div>
         {/* Decorative Elements */}
         <div className="absolute inset-0">
           <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
           <div className="absolute w-72 h-72 bg-indigo-500/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
         </div>
         <div className="relative z-10 text-center px-6 py-12 md:py-24">
            {t.business.hero_tag && (
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t.business.hero_tag}</span>
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight">
                {t.business.hero_title}
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                {t.business.hero_text}
            </p>
         </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-24">
             <div>
                <h3 className="text-3xl font-serif text-gray-900 mb-6">{t.business.tag}</h3>
                <p className="text-gray-500 leading-relaxed whitespace-pre-line mb-8">
                   {t.business.desc}
                </p>
                <button
                   onClick={() => {
                      const element = document.getElementById('business-plans-section');
                      if (element) {
                         element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                   }}
                   className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg"
                >
                   {t.business.btn_case}
                </button>
             </div>
             <div className="grid grid-cols-1 gap-6">
                {[
                  { t: t.business.theme_1_t, d: t.business.theme_1_d, i: <Microscope size={20}/> },
                  { t: t.business.theme_2_t, d: t.business.theme_2_d, i: <Heart size={20}/> },
                  { t: t.business.theme_3_t, d: t.business.theme_3_d, i: <Building size={20}/> },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex gap-4 items-start">
                     <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">{item.i}</div>
                     <div>
                        <h4 className="font-bold text-gray-900">{item.t}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.d}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Process Steps */}
          <div className="mb-24 bg-gray-900 rounded-3xl p-10 md:p-16 text-white overflow-hidden relative">
             <div className="relative z-10 text-center mb-16">
                 <h3 className="text-3xl font-serif">{t.business.process_title}</h3>
                 <p className="text-gray-400 mt-2 text-sm">{t.business.process_sub}</p>
             </div>
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4">
                 {[
                   { t: t.business.step_1_t, d: t.business.step_1_d },
                   { t: t.business.step_2_t, d: t.business.step_2_d },
                   { t: t.business.step_3_t, d: t.business.step_3_d },
                   { t: t.business.step_4_t, d: t.business.step_4_d },
                   { t: t.business.step_5_t, d: t.business.step_5_d },
                 ].map((step, i) => (
                    <div key={i} className="relative group">
                       <div className="text-4xl font-mono font-bold text-gray-800 mb-4 group-hover:text-blue-500 transition">0{i+1}</div>
                       <h4 className="font-bold text-lg mb-2">{step.t}</h4>
                       <p className="text-xs text-gray-400 leading-relaxed">{step.d}</p>
                    </div>
                 ))}
             </div>
          </div>

          {/* Bookable Japanese Top Companies Section - 100 Companies */}
          <div className="mb-24">
             <div className="text-center mb-12">
                <h3 className="text-3xl font-serif text-gray-900 mb-3">{localizedTexts.topCompanies}</h3>
                <p className="text-gray-500 text-sm max-w-2xl mx-auto">{localizedTexts.companyIntro}</p>
             </div>

             {/* Company Categories */}
             <div className="space-y-12">
                {/* 1. 汽車製造業 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                         <Factory size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.automotive}</h4>
                         <p className="text-xs text-gray-500">Automotive Manufacturing</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.automotive.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 2. 電子與半導體 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                         <Cpu size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.electronics}</h4>
                         <p className="text-xs text-gray-500">Electronics & Semiconductor</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.electronics.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 3. 精密機械與自動化 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                         <Factory size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.precision}</h4>
                         <p className="text-xs text-gray-500">Precision Machinery & Automation</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.precision.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 4. 醫療與健康照護 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                         <Stethoscope size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.medical}</h4>
                         <p className="text-xs text-gray-500">Healthcare & Medical</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.medical.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 5. 家電與消費電子 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                         <Monitor size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.appliances}</h4>
                         <p className="text-xs text-gray-500">Consumer Electronics</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.appliances.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 6. 零售與服務業 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                         <Building size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.retail}</h4>
                         <p className="text-xs text-gray-500">Retail & Service</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.retail.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 7. 飯店與款待業 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                         <Heart size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.hospitality}</h4>
                         <p className="text-xs text-gray-500">Hotel & Hospitality</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.hospitality.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 8. 食品與飲料 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                         <Utensils size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.food}</h4>
                         <p className="text-xs text-gray-500">Food & Beverage</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.food.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 9. 物流與運輸 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                         <Bus size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.logistics}</h4>
                         <p className="text-xs text-gray-500">Logistics & Transportation</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.logistics.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>

                {/* 10. 科技與通訊 */}
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                         <Globe size={20} className="text-white" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900">{localizedTexts.tech}</h4>
                         <p className="text-xs text-gray-500">Technology & Telecommunications</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCompanies.tech.map((company, i) => (
                         <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{company.name}</h5>
                                  <p className="text-xs text-gray-400">{company.nameEn}</p>
                               </div>
                               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{company.desc}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
                         </a>
                      ))}
                   </div>
                </div>
             </div>

             {/* Stats Bar */}
             <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-600 text-white p-6 rounded-xl text-center">
                   <div className="text-3xl font-bold">100+</div>
                   <div className="text-sm opacity-80">{localizedTexts.bookableCompanies}</div>
                </div>
                <div className="bg-slate-800 text-white p-6 rounded-xl text-center">
                   <div className="text-3xl font-bold">10</div>
                   <div className="text-sm opacity-80">{localizedTexts.industryCategories}</div>
                </div>
                <div className="bg-purple-600 text-white p-6 rounded-xl text-center">
                   <div className="text-3xl font-bold">47</div>
                   <div className="text-sm opacity-80">{localizedTexts.prefecturesCovered}</div>
                </div>
                <div className="bg-green-600 text-white p-6 rounded-xl text-center">
                   <div className="text-3xl font-bold">95%</div>
                   <div className="text-sm opacity-80">{localizedTexts.successRate}</div>
                </div>
             </div>

             {/* Note */}
             <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800">
                   <span className="font-bold">{localizedTexts.notice}</span>
                   <br />
                   {localizedTexts.noticeText}
                </p>
             </div>
          </div>

          {/* New Business Plans Section */}
          <div id="business-plans-section" className="mb-24 scroll-mt-24">
             <div className="text-center mb-16">
                <h3 className="text-3xl font-serif text-gray-900">{t.business.itin_title}</h3>
                <p className="text-gray-500 text-sm mt-2">Curated for Executives</p>
             </div>
             
             <div className="space-y-20">
                {t.business.plans?.map((plan: any, index: number) => (
                   <div key={plan.id} className="flex flex-col md:flex-row gap-10 items-start border-b border-gray-100 pb-20 last:border-0 last:pb-0">
                      {/* Image - Smaller aspect than Golf */}
                      <div className="md:w-1/3 w-full">
                         <div className="relative rounded-xl overflow-hidden shadow-lg h-[250px] md:h-[320px] group">
                            <Image
                               src={getBizImage(plan.id)}
                               fill
                               className="object-cover transform group-hover:scale-105 transition duration-700"
                               alt={plan.title}
                               sizes="(max-width: 768px) 100vw, 33vw"
                               quality={75}
                            />
                            <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition"></div>
                         </div>
                      </div>
                      
                      {/* Content */}
                      <div className="md:w-2/3 w-full">
                         <div className="flex flex-wrap gap-2 mb-4">
                            {plan.tags.map((tag: string, i: number) => (
                               <span key={i} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded border border-blue-100">
                                  {tag}
                               </span>
                            ))}
                         </div>
                         <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{plan.title}</h3>
                         <h4 className="text-sm font-bold text-gray-500 mb-4">{plan.subtitle}</h4>
                         <p className="text-gray-600 text-sm leading-relaxed mb-6 border-l-2 border-gray-200 pl-4">{plan.desc}</p>
                         
                         <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                            <div className="space-y-3">
                               {plan.schedule.map((day: any, dIndex: number) => (
                                  <div key={dIndex} className="flex gap-4 text-xs md:text-sm">
                                     <span className="font-bold text-gray-400 w-12 flex-shrink-0">{day.day}</span>
                                     <span className="text-gray-700 leading-relaxed">{day.text}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
          
          {/* Contact Buttons */}
          <div className="py-16 bg-gray-50 -mx-6 px-6 py-12 md:py-24 mt-16">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{localizedTexts.ctaTitle}</h3>
              <p className="text-gray-500 mb-8">{localizedTexts.ctaSubtitle}</p>
              <ContactButtons />
            </div>
          </div>

          <div className="text-center mt-12">
             <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 mx-auto text-gray-500 hover:text-black transition">
                <ArrowLeft size={16} /> {t.about.back}
             </button>
          </div>
      </div>
    </div>
   );
};

const PartnerView: React.FC<SubViewProps> = ({ t, setCurrentPage, onOpenPartnerInquiry, getImage }) => (
  <div className="animate-fade-in-up min-h-screen bg-white">
     {/* Hero - Full height with transparent nav overlap */}
     <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
         {/* Background Image */}
         <div
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop')`,
           }}
         >
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-blue-900/80 to-indigo-900/70"></div>
         </div>
         {/* Decorative Elements */}
         <div className="absolute inset-0">
           <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
           <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
         </div>
         <div className="relative z-10 text-center px-6 py-12 md:py-24">
             <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
               <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t.partner.hero_tag}</span>
             </span>
             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight">
                {t.partner.hero_title}
             </h1>
             <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed whitespace-pre-line text-sm md:text-base">
                {t.partner.hero_text}
             </p>
         </div>
     </div>

     <div className="container mx-auto px-6 py-12 md:py-24 py-24">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
             {[
               { icon: <Handshake size={32} />, title: t.partner.trust_1_t, desc: t.partner.trust_1_d },
               { icon: <Shield size={32} />, title: t.partner.trust_2_t, desc: t.partner.trust_2_d },
               { icon: <Phone size={32} />, title: t.partner.trust_3_t, desc: t.partner.trust_3_d },
             ].map((item, i) => (
               <div key={i} className="p-8 border border-gray-100 rounded-xl hover:shadow-lg transition">
                  <div className="text-blue-600 mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
               </div>
             ))}
         </div>

         {/* --- INSERT TESTIMONIAL WALL HERE --- */}
         <div className="mb-24">
            <TestimonialWall />
         </div>

         <div className="bg-gray-900 text-white rounded-3xl p-12">
            <h3 className="text-2xl font-serif mb-12 text-center">{t.partner.flow_title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { step: '01', title: t.partner.flow_1, desc: t.partner.flow_1_d },
                 { step: '02', title: t.partner.flow_2, desc: t.partner.flow_2_d },
                 { step: '03', title: t.partner.flow_3, desc: t.partner.flow_3_d },
                 { step: '04', title: t.partner.flow_4, desc: t.partner.flow_4_d },
               ].map((item, i) => (
                 <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2 font-mono">{item.step}</div>
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                 </div>
               ))}
            </div>
            <div className="mt-16 text-center border-t border-gray-800 pt-12">
               <h4 className="text-xl font-serif mb-4">{t.partner.cta_title}</h4>
               <p className="text-gray-400 mb-8 whitespace-pre-line">{t.partner.cta_desc}</p>
               <button onClick={onOpenPartnerInquiry} className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-500 transition shadow-lg">
                  {t.partner.cta_btn}
               </button>
            </div>
         </div>
         <button onClick={() => setCurrentPage('home')} className="mt-16 w-full text-center text-gray-400 hover:text-black transition flex justify-center items-center gap-2">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
     </div>
  </div>
);

// ... (HomeView remains largely the same but ensure no breaking changes) ...
const HomeView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, currentLang, landingInputText, setLandingInputText, hideOfficialBranding, getImage, imagesLoading }) => {
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
      imageUrl: getImage('hero_slide_1', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop'),
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
      ctaLink: '/?page=medical',
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
      {imagesLoading ? (
        <div className="relative h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60 text-sm">Loading...</p>
          </div>
        </div>
      ) : (
        <HeroCarousel
          slides={heroSlides}
          autoPlayInterval={6000}
          showIndicators={true}
          showArrows={true}
          height="85vh"
        />
      )}

      {/* 2. ニュースルーム - JTB风格列表式设计 */}
      <section className="py-20 bg-[#fafafa]">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-4xl mx-auto">
            {/* 标题 - 居中 */}
            <div className="text-center mb-12">
              <h2 className="serif text-2xl md:text-3xl text-gray-900 tracking-wide mb-2">
                {currentLang === 'zh-TW' ? '最新消息' : currentLang === 'zh-CN' ? '最新消息' : currentLang === 'en' ? 'News' : 'お知らせ'}
              </h2>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">News Room</p>
            </div>

            {/* 新闻列表 - 动态从API获取 */}
            <div className="space-y-0 border-t border-gray-200">
              {newsItems.map((news) => {
                const date = new Date(news.published_at);
                const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
                const categoryLabel = news.category === 'service'
                  ? (currentLang === 'zh-TW' ? '服務' : currentLang === 'zh-CN' ? '服务' : currentLang === 'en' ? 'Service' : 'サービス')
                  : news.category === 'press'
                  ? (currentLang === 'zh-TW' ? '新聞' : currentLang === 'zh-CN' ? '新闻' : currentLang === 'en' ? 'Press' : 'プレス')
                  : (currentLang === 'zh-TW' ? '公告' : currentLang === 'zh-CN' ? '公告' : currentLang === 'en' ? 'Notice' : 'お知らせ');

                return (
                  <a key={news.id} href={`/news/${news.id}`} className="group block py-6 border-b border-gray-200 hover:bg-white transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* 日期 */}
                      <div className="text-sm text-gray-500 md:w-32 flex-shrink-0">
                        {dateStr}
                      </div>
                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 md:w-40 flex-shrink-0">
                        <span className="text-xs px-3 py-1 rounded-full border border-teal-500 text-teal-600">
                          {categoryLabel}
                        </span>
                      </div>
                      {/* 标题 */}
                      <div className="flex-1">
                        <h3 className="text-gray-900 leading-relaxed group-hover:text-teal-600 transition-colors">
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
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-8 py-4 rounded hover:border-gray-400 transition-colors"
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
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-900/70 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="max-w-2xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-teal-300"></div>
              <span className="text-xs tracking-[0.3em] text-teal-300 uppercase">Medical Tourism</span>
            </div>

            {/* 核心标题 - 温暖、给人希望 */}
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              {currentLang === 'zh-TW' ? '把健康交給' : currentLang === 'zh-CN' ? '把健康交给' : '健康を託す'}
              <br />
              <span className="text-teal-300">{currentLang === 'zh-TW' ? '值得信賴的人' : currentLang === 'zh-CN' ? '值得信赖的人' : '信頼できる人へ'}</span>
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-teal-100/80 mb-6 md:mb-8 leading-relaxed font-light">
              {currentLang === 'zh-TW' ? '日本醫療技術全球領先，PET-CT可發現5mm早期病變。我們提供專車接送、全程陪診翻譯、報告解讀——讓您專心照顧健康，其他的交給我們。' : currentLang === 'zh-CN' ? '日本医疗技术全球领先，PET-CT可发现5mm早期病变。我们提供专车接送、全程陪诊翻译、报告解读——让您专心照顾健康，其他的交给我们。' : '日本の医療技術は世界トップクラス。PET-CTは5mmの早期病変を発見可能。専用車送迎、全行程通訳同行、レポート解説——健康に専念していただき、他はお任せください。'}
            </p>

            {/* 核心数据 */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">12<span className="text-teal-300">年</span></div>
                <div className="text-[10px] md:text-xs text-teal-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '醫療服務經驗' : currentLang === 'zh-CN' ? '医疗服务经验' : '医療サービス実績'}</div>
              </div>
              <div className="border-x border-white/20 px-2 md:px-6 py-12 md:py-24 text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">3000<span className="text-teal-300">+</span></div>
                <div className="text-[10px] md:text-xs text-teal-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '服務客戶' : currentLang === 'zh-CN' ? '服务客户' : 'ご利用者様'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">100<span className="text-teal-300">%</span></div>
                <div className="text-[10px] md:text-xs text-teal-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '全程陪同' : currentLang === 'zh-CN' ? '全程陪同' : '全行程同行'}</div>
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
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-900 text-sm font-medium rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
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
                  <CheckCircle size={16} className="text-teal-300 flex-shrink-0" />
                  <div>
                    <span className="text-white">{item.name}</span>
                    <span className="text-teal-200/60 ml-2">{item.desc}</span>
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-950/70 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="max-w-2xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-sky-300"></div>
              <span className="text-xs tracking-[0.3em] text-sky-300 uppercase">Advanced Treatment</span>
            </div>

            {/* 核心标题 */}
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              {currentLang === 'zh-TW' ? '面對重疾' : currentLang === 'zh-CN' ? '面对重疾' : '重病と向き合う時'}
              <br />
              <span className="text-sky-300">{currentLang === 'zh-TW' ? '日本醫療給您更多希望' : currentLang === 'zh-CN' ? '日本医疗给您更多希望' : '日本医療がもう一つの希望に'}</span>
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-blue-100/80 mb-6 md:mb-8 leading-relaxed font-light">
              {currentLang === 'zh-TW' ? '質子重離子治療、免疫細胞療法、達文西微創手術——日本癌症5年生存率全球領先。我們協助您獲得日本頂尖醫院的治療機會，全程陪同，讓您專注康復。' : currentLang === 'zh-CN' ? '质子重离子治疗、免疫细胞疗法、达文西微创手术——日本癌症5年生存率全球领先。我们协助您获得日本顶尖医院的治疗机会，全程陪同，让您专注康復。' : '陽子線・重粒子線治療、免疫細胞療法、ダヴィンチ手術——日本のがん5年生存率は世界トップ。日本トップ病院での治療機会をサポート、全行程同行で治療に専念いただけます。'}
            </p>

            {/* 核心数据 */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">68<span className="text-sky-300">%</span></div>
                <div className="text-[10px] md:text-xs text-blue-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '癌症5年生存率' : currentLang === 'zh-CN' ? '癌症5年生存率' : 'がん5年生存率'}</div>
              </div>
              <div className="border-x border-white/20 px-2 md:px-6 py-12 md:py-24 text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">98<span className="text-sky-300">%</span></div>
                <div className="text-[10px] md:text-xs text-blue-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '心臟手術成功率' : currentLang === 'zh-CN' ? '心脏手术成功率' : '心臓手術成功率'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">24<span className="text-sky-300">h</span></div>
                <div className="text-[10px] md:text-xs text-blue-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '病歷評估響應' : currentLang === 'zh-CN' ? '病历评估响应' : '診療情報評価'}</div>
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
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-950 text-sm font-medium rounded-lg hover:bg-sky-50 transition-colors"
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
                  <span className="w-6 h-6 bg-sky-400/30 rounded-full flex items-center justify-center text-xs text-sky-200 flex-shrink-0">{item.step}</span>
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
              <div className="h-[1px] w-12 bg-amber-400"></div>
              <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">Exclusive Access</span>
            </div>

            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              {currentLang === 'zh-TW' ? '踏入' : currentLang === 'zh-CN' ? '踏入' : '足を踏み入れる'}
              <br />
              <span className="text-amber-400">{currentLang === 'zh-TW' ? '傳說中的名門' : currentLang === 'zh-CN' ? '传说中的名门' : '伝説の名門へ'}</span>
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed font-light">
              {currentLang === 'zh-TW' ? '廣野、霞ヶ関、小野——這些球場的名字，在高爾夫愛好者心中如雷貫耳。平時需要會員介紹才能踏入的聖地，現在向您敞開大門。' : currentLang === 'zh-CN' ? '广野、霞ヶ関、小野——这些球场的名字，在高尔夫爱好者心中如雷貫耳。平时需要会员介绍才能踏入的圣地，现在向您敞开大门。' : '廣野、霞ヶ関、小野——ゴルフ愛好家なら誰もが憧れる名門。通常は会員紹介が必要な聖地が、今あなたに開かれます。'}
            </p>

            {/* 核心数据 - 金色边框 */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">25<span className="text-amber-400">+</span></div>
                <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase">{currentLang === 'zh-TW' ? '名門球場' : currentLang === 'zh-CN' ? '名门球场' : '名門コース'}</div>
              </div>
              <div className="border-x border-white/20 px-2 md:px-6 py-12 md:py-24 text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">0</div>
                <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase">{currentLang === 'zh-TW' ? '會員介紹' : currentLang === 'zh-CN' ? '会员介绍' : '会員紹介不要'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">VIP</div>
                <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase">{currentLang === 'zh-TW' ? '專屬待遇' : currentLang === 'zh-CN' ? '专属待遇' : '専用待遇'}</div>
              </div>
            </div>

            {/* 球场列表 */}
            <div className="mb-10">
              <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">{currentLang === 'zh-TW' ? '合作名門' : currentLang === 'zh-CN' ? '合作名门' : '提携名門コース'}</div>
              <div className="flex flex-wrap gap-2">
                {['廣野ゴルフ倶楽部', '霞ヶ関カンツリー倶楽部', '小野ゴルフ倶楽部', '茨木カンツリー倶楽部', '古賀ゴルフ・クラブ'].map((course, idx) => (
                  <span key={idx} className="text-sm text-white/80 after:content-['·'] after:mx-2 after:text-amber-400 last:after:content-none">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <a
              onClick={() => setCurrentPage('golf')}
              className="inline-flex items-center px-8 py-4 bg-amber-400 text-black text-sm font-medium tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
            >
              {currentLang === 'zh-TW' ? '探索名門球場' : currentLang === 'zh-CN' ? '探索名门球场' : '名門コースを見る'}
              <ArrowRight size={18} className="ml-3" />
            </a>
          </div>
        </div>

        {/* 右下角服务标签 */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 max-w-xs">
            <div className="text-xs text-amber-400 mb-2 uppercase tracking-wider">{currentLang === 'zh-TW' ? '尊享服務' : currentLang === 'zh-CN' ? '尊享服务' : 'プレミアムサービス'}</div>
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
      <section className="relative min-h-[90vh] flex items-center bg-slate-900 text-white">
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
                <p className="text-xs tracking-[0.3em] text-amber-400 uppercase mb-8 md:mb-10">Business Inspection</p>
                <h2 className="serif text-3xl md:text-4xl lg:text-5xl text-white mb-8 md:mb-10 leading-tight">
                  {currentLang === 'zh-TW' ? '對話日本頂尖企業' : currentLang === 'zh-CN' ? '对话日本顶尖企业' : '日本トップ企業との対話'}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-8">
                  {currentLang === 'zh-TW' ? '12年深耕日本商務市場，我們與豐田、松下、資生堂等500強企業建立深度合作。從工廠參觀到高管對談，為您打造真正有價值的商務考察之旅。' : currentLang === 'zh-CN' ? '12年深耕日本商务市场，我们与丰田、松下、资生堂等500强企业建立深度合作。从工厂参观到高管对谈，为您打造真正有价值的商务考察之旅。' : '12年間日本ビジネス市場を深耕。トヨタ、パナソニック、資生堂など500社以上と深い協力関係を構築。工場見学から経営層との対談まで、真に価値ある視察をご提供。'}
                </p>

                <div className="grid grid-cols-2 gap-3 md:gap-6 mb-10">
                  {[
                    { num: '16', label: currentLang === 'zh-TW' ? '行業覆蓋' : currentLang === 'zh-CN' ? '行业覆盖' : '対応業界' },
                    { num: '500+', label: currentLang === 'zh-TW' ? '合作企業' : currentLang === 'zh-CN' ? '合作企业' : '提携企業' },
                    { num: '98%', label: currentLang === 'zh-TW' ? '客戶滿意度' : currentLang === 'zh-CN' ? '客户满意度' : '顧客満足度' },
                    { num: '1000+', label: currentLang === 'zh-TW' ? '成功案例' : currentLang === 'zh-CN' ? '成功案例' : '成功実績' },
                  ].map((stat, idx) => (
                    <div key={idx} className="border-l-2 border-amber-400/50 pl-4">
                      <div className="text-2xl font-light text-white">{stat.num}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
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
                    <span key={idx} className="px-3 py-1 text-xs border border-white/20 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  onClick={() => setCurrentPage('business')}
                  className="inline-flex items-center px-8 py-4 bg-amber-500 text-slate-900 text-sm font-medium hover:bg-amber-400 transition-colors cursor-pointer"
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
                    <div className="text-xs text-gray-400">{company.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 主要取引先 - Partners */}
      <section className="py-20 bg-[#f8f8f8] border-t border-gray-200">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">Partners</p>
              <h2 className="serif text-2xl md:text-3xl text-gray-900 tracking-wide">
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
                <div key={index} className="bg-white p-6 text-center border border-gray-100 hover:border-gray-300 transition-colors">
                  <div className="text-sm font-medium text-gray-900 mb-1">{partner.name}</div>
                  <div className="text-[10px] text-gray-400">{partner.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. 企業理念 - Corporate Philosophy */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-6">Corporate Philosophy</p>
            <h2 className="serif text-3xl md:text-4xl lg:text-5xl text-white mb-8 leading-relaxed">
              {currentLang === 'zh-TW' ? '用心連結世界與日本' : currentLang === 'zh-CN' ? '用心连结世界与日本' : '心をつなぐ、世界と日本'}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              {currentLang === 'zh-TW' ? '我們致力於為華人旅客提供最高品質的日本旅遊體驗。我們相信，真正的服務不僅是滿足需求，更是創造感動。' : currentLang === 'zh-CN' ? '我们致力于为华人旅客提供最高品质的日本旅游体验。我们相信，真正的服务不仅是满足需求，更是创造感动。' : '2020年設立以来、新島交通は華人旅行者の皆様に最高品質の日本旅行体験を提供してまいりました。真のサービスとは、ニーズを満たすだけでなく、感動を創造することだと信じています。'}
            </p>
            <a
              href="/company/about"
              className="inline-flex items-center text-xs text-white border border-white/30 px-8 py-3 hover:bg-white hover:text-slate-900 transition-all tracking-wider"
            >
              {currentLang === 'zh-TW' ? '了解更多' : currentLang === 'zh-CN' ? '了解更多' : '詳しく見る'}
              <ArrowRight size={14} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* 9. 導遊合作 - 沉浸式全屏背景，与其他板块风格统一 */}
      {!hideOfficialBranding && (
      <section id="guide-partner" className="relative min-h-[90vh] flex items-center">
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
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/90 via-violet-950/70 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="max-w-2xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-violet-300"></div>
              <span className="text-xs tracking-[0.3em] text-violet-300 uppercase">Partnership</span>
            </div>

            {/* 核心标题 */}
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
              {currentLang === 'zh-TW' ? '導遊提攜夥伴' : currentLang === 'zh-CN' ? '导游提攜伙伴' : 'ガイドパートナー'}
              <br />
              <span className="text-violet-300">{currentLang === 'zh-TW' ? '客戶介紹計劃' : currentLang === 'zh-CN' ? '客户介绍计划' : '顧客紹介プログラム'}</span>
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-violet-100/80 mb-6 md:mb-8 leading-relaxed font-light">
              {currentLang === 'zh-TW' ? '新島交通提供高端夜總會、精密體檢、綜合醫療等服務資源。您介紹客戶，我們提供服務，成功即有介紹報酬。' : currentLang === 'zh-CN' ? '新岛交通提供高端夜总会、精密体检、综合医疗等服务资源。您介绍客户，我们提供服务，成功即有介绍报酬。' : '新島交通は高級クラブ、精密健診、総合医療などのサービスを提供。お客様をご紹介いただき、成約時に紹介報酬をお支払いします。'}
            </p>

            {/* 核心数据 */}
            <div className="grid grid-cols-2 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">160<span className="text-violet-300">+</span></div>
                <div className="text-xs text-violet-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '合作店舖' : currentLang === 'zh-CN' ? '合作店舖' : '提携店舗'}</div>
              </div>
              <div className="border-l border-white/20 pl-3 md:pl-6 text-center">
                <div className="text-2xl md:text-4xl font-light text-white mb-1">3000<span className="text-violet-300">+</span></div>
                <div className="text-[10px] md:text-xs text-violet-200/60 tracking-wider uppercase">{currentLang === 'zh-TW' ? '服務客戶' : currentLang === 'zh-CN' ? '服务客户' : 'ご利用者様'}</div>
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
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-violet-900 text-sm font-medium rounded-lg hover:bg-violet-50 transition-colors"
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
                  <CheckCircle size={16} className="text-violet-300 flex-shrink-0" />
                  <div>
                    <span className="text-white">{item.name}</span>
                    <span className="text-violet-200/60 ml-2">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* 法律声明 */}
            <p className="text-[10px] text-violet-200/40 mt-4 pt-3 border-t border-white/10 leading-relaxed">
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
  const { getImage: getDbImage, loading: imagesLoading } = useSiteImages();

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
    // 处理 ?page=xxx 参数
    const page = searchParams.get('page');
    if (page && ['medical', 'golf', 'business', 'partner'].includes(page)) {
      setCurrentPage(page as PageView);
    } else {
      // 如果没有 page 参数，返回首页
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
  }, [searchParams]);

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

  return (
    <PublicLayout activeNav={getActiveNav()} transparentNav={true} onLogoClick={() => setCurrentPage('home')}>
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
              imagesLoading={imagesLoading}
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
                 className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
               >
                 <X size={20} />
               </button>

               <div className="mb-8 text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <User size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">
                    {lang === 'ja' ? 'B2B パートナー登録' : 'Partner Application'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Access exclusive B2B rates and AI quoting system.
                  </p>
               </div>

               <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={authFormData.companyName}
                      onChange={(e) => setAuthFormData({...authFormData, companyName: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Travel Agency Co., Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={authFormData.contactPerson}
                      onChange={(e) => setAuthFormData({...authFormData, contactPerson: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authFormData.email}
                      onChange={(e) => setAuthFormData({...authFormData, email: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="agent@example.com"
                    />
                  </div>
                  {authError && <p className="text-xs text-red-500">{authError}</p>}
                  <button
                    type="submit"
                    disabled={isSendingAuth}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg mt-2 flex items-center justify-center gap-2"
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
                 className="absolute top-4 right-4 text-gray-400 hover:text-black transition z-10"
               >
                 <X size={20} />
               </button>

               {inquirySubmitStatus === 'success' ? (
                 // Success State
                 <div className="p-8 text-center">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle className="text-green-600" size={32} />
                   </div>
                   <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">申請已提交</h3>
                   <p className="text-gray-600 mb-6">
                     感謝您的合作申請！我們已收到您的信息，<br />
                     將在 1-2 個工作日內與您聯繫。
                   </p>
                   <button
                     onClick={() => setShowPartnerInquiryModal(false)}
                     className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-500 transition"
                   >
                     關閉
                   </button>
                 </div>
               ) : (
                 // Form State
                 <>
                   <div className="p-6 border-b border-gray-100">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                         <Handshake size={20} />
                       </div>
                       <div>
                         <h3 className="text-xl font-serif font-bold text-gray-900">
                           同業合作申請
                         </h3>
                         <p className="text-sm text-gray-500">填寫以下資料，我們將盡快與您聯繫</p>
                       </div>
                     </div>
                   </div>

                   <form onSubmit={handlePartnerInquirySubmit} className="p-6 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                           公司名稱 <span className="text-red-500">*</span>
                         </label>
                         <input
                           type="text"
                           required
                           value={partnerInquiryForm.companyName}
                           onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, companyName: e.target.value})}
                           className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="旅行社名稱"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                           聯絡人 <span className="text-red-500">*</span>
                         </label>
                         <input
                           type="text"
                           required
                           value={partnerInquiryForm.contactName}
                           onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, contactName: e.target.value})}
                           className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="您的姓名"
                         />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                           電子郵件 <span className="text-red-500">*</span>
                         </label>
                         <input
                           type="email"
                           required
                           value={partnerInquiryForm.email}
                           onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, email: e.target.value})}
                           className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="email@company.com"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                           聯絡電話
                         </label>
                         <input
                           type="tel"
                           value={partnerInquiryForm.phone}
                           onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, phone: e.target.value})}
                           className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="+886 912 345 678"
                         />
                       </div>
                     </div>

                     <div>
                       <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                         業務類型
                       </label>
                       <select
                         value={partnerInquiryForm.businessType}
                         onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, businessType: e.target.value})}
                         className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                       <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                         合作意向說明 <span className="text-red-500">*</span>
                       </label>
                       <textarea
                         required
                         rows={4}
                         value={partnerInquiryForm.message}
                         onChange={(e) => setPartnerInquiryForm({...partnerInquiryForm, message: e.target.value})}
                         className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                         placeholder="請簡述您的合作需求，例如：主要客群、預計業務量、希望合作的產品類型等..."
                       />
                     </div>

                     {inquiryErrorMessage && (
                       <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{inquiryErrorMessage}</p>
                     )}

                     <button
                       type="submit"
                       disabled={isSubmittingInquiry}
                       className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

                     <p className="text-xs text-gray-400 text-center">
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
               ${toast.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' : ''}
               ${toast.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : ''}
               ${toast.type === 'info' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
             `}
           >
             <div className="flex-shrink-0 mt-0.5">
               {toast.type === 'error' && (
                 <X className="h-5 w-5 text-red-500" />
               )}
               {toast.type === 'success' && (
                 <CheckCircle className="h-5 w-5 text-green-500" />
               )}
               {toast.type === 'info' && (
                 <Activity className="h-5 w-5 text-blue-500" />
               )}
             </div>
             <div className="flex-1">
               <p
                 className={`text-sm font-medium ${
                   toast.type === 'error' ? 'text-red-800' :
                   toast.type === 'success' ? 'text-green-800' :
                   'text-blue-800'
                 }`}
               >
                 {toast.message}
               </p>
             </div>
             <button
               onClick={() => setToast({ show: false, message: '', type: 'info' })}
               className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
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
