
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from './Logo';
import { translations, Language } from '../translations';
import { UserProfile } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Building, Activity, Shield, Armchair, FileText, Check, Brain, Eye, Zap, Coffee, Globe, ChevronDown, Smile, Heart, HeartPulse, Bus, Utensils, Quote, Lock, Trophy, Car, Bath, Handshake, Users, Briefcase, Mail, X, Menu, LogIn, Phone, Loader2, User, Sparkles, Scan, Cpu, Microscope, Dna, Monitor, Fingerprint, Printer, Map, Star, Award, MessageSquare, Bot } from 'lucide-react';
import emailjs from '@emailjs/browser';
import IntroParticles from './IntroParticles';
import HeroCarousel, { CarouselSlide } from './HeroCarousel';
import MedicalDNA from './MedicalDNA';
import BusinessNetwork from './BusinessNetwork';
import PartnerParticles from './PartnerParticles';
import TestimonialWall from './TestimonialWall';
import PackageComparisonTable from './PackageComparisonTable';
import TIMCQuoteModal from './TIMCQuoteModal';
import PublicLayout from './PublicLayout';
import { useWhiteLabel, useWhiteLabelVisibility } from '@/lib/contexts/WhiteLabelContext';
import { useCommissionTiers } from '@/lib/hooks/useCommissionTiers';
import { useSiteImages } from '@/lib/hooks/useSiteImages';

// --- IMAGE ASSETS CONFIGURATION ---
const SITE_IMAGES = {
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
  // New Business Plan Images
  biz_medical: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000&auto=format&fit=crop", // Plan 1: Medical Lab/Hospital
  biz_tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop", // Plan 2: Tokyo/Ginza City
  biz_factory: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop", // Plan 3: Precision Factory/Tech
  biz_resort: "https://i.ibb.co/rK2b2bZd/2025-12-16-16-38-20.png", // Plan 4: Hakone/Resort (Updated by User)
  biz_golden: "https://images.unsplash.com/photo-1490761668535-35497054764d?q=80&w=1000&auto=format&fit=crop", // Plan 5: Shinkansen/Fuji (Golden Route)

  // Home Page Previews
  home_medical_preview: "https://images.unsplash.com/photo-1531297461136-82ae96c51248?q=80&w=1000&auto=format&fit=crop", 
  home_business_preview: "https://images.unsplash.com/photo-1577962917302-cd874c4e3169?q=80&w=800&auto=format&fit=crop",
  
  // Founder
  founder_portrait: "https://i.ibb.co/B2mJDvq7/founder.jpg",

  // MOBILE FALLBACKS (Updated by User Request)
  mobile_medical_fallback: "https://i.ibb.co/TDYnsXBb/013-2.jpg", 
  mobile_business_fallback: "https://i.ibb.co/SjSf9JB/Gemini-Generated-Image-l2elrzl2elrzl2el-1.jpg"  
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
  biz_medical: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
  biz_tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop",
  biz_factory: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
  biz_resort: "https://images.unsplash.com/photo-1571896349842-6e5a513e610a?q=80&w=800&auto=format&fit=crop",
  biz_golden: "https://images.unsplash.com/photo-1490761668535-35497054764d?q=80&w=800&auto=format&fit=crop",
  
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
  currentLang: Language;
  landingInputText?: string;
  setLandingInputText?: (text: string) => void;
  // 白标模式：隐藏官方品牌内容
  hideOfficialBranding?: boolean;
}

// Hook to detect mobile screen - ensures stable rendering switch
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// --- NEW COMPONENT: AI Tech Card (Used in Sub-views) ---
const MedicalTechCard = ({ 
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
}) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Image Container with Tech Overlay */}
      <div className="relative h-64 overflow-hidden bg-gray-900">
        <img 
          src={img} 
          className="w-full h-full object-cover transition-all duration-700"
          alt={title}
          onError={(e) => handleSmartImageError(e, fallbackKey)}
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
};

const MedicalView: React.FC<SubViewProps> = ({ t, setCurrentPage, onOpenTIMCQuote }) => (
  <div className="animate-fade-in-up min-h-screen bg-white">
    {/* 1. Hero Section - Full height with transparent nav overlap */}
    <div className="relative min-h-[85vh] flex items-center overflow-hidden text-white bg-slate-900">
      <img 
          src={SITE_IMAGES.medical_hero}
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
          alt="TIMC Lobby Luxury Environment"
          key="medical_hero"
          onError={(e) => handleSmartImageError(e, 'medical_hero')}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent"></div>
      <div className="absolute inset-0 opacity-30 pointer-events-none">
         <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
              <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-bold border border-blue-400/30 px-3 py-1 rounded-full backdrop-blur-md">
                 {t.medical.hero_tag}
              </span>
              <h1 className="text-5xl md:text-7xl font-serif mt-6 mb-6 leading-[1.2]">
                 {t.medical.hero_title_1}<br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{t.medical.hero_title_2}</span>
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-300 font-light mb-8 font-serif">
                 {t.medical.hero_subtitle}
              </h2>
              <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base border-l-2 border-blue-500 pl-6 max-w-2xl whitespace-pre-line">
                 {t.medical.hero_text}
              </p>
              {/* 限量營銷文案 */}
              <div className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-5 py-3 rounded-full backdrop-blur-md">
                  <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <span className="text-amber-200 text-sm font-medium">為保證服務品質，每月僅限 <span className="text-amber-100 font-bold">20</span> 位客戶預約</span>
              </div>
          </div>
      </div>
    </div>

    {/* Hospital Introduction Video Section */}
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-bold">Hospital Tour</span>
          <h3 className="text-3xl font-serif text-white mt-3">{t.medical.video_title || '醫院介紹'}</h3>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl mx-auto">{t.medical.video_subtitle || '走進德洲會國際醫療中心，感受日本頂級醫療服務'}</p>
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
              您的瀏覽器不支援影片播放
            </video>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">德洲會國際醫療中心 TIMC - 官方介紹影片</p>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-6 py-24">
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

      {/* 3. Tech Section */}
      <div className="mb-24">
          <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-2">
                 <Sparkles size={16} className="text-blue-400 animate-pulse" />
                 <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">{t.medical.tech_tag}</span>
              </div>
              <h3 className="text-3xl font-serif text-gray-900 mt-2 mb-4">{t.medical.tech_title}</h3>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">{t.medical.tech_sub}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MedicalTechCard 
                 img={SITE_IMAGES.tech_ct}
                 title={t.medical.tech_ct_t}
                 desc={t.medical.tech_ct_d}
                 icon={Zap}
                 colorClass="text-yellow-400"
                 fallbackKey="tech_ct"
                 spec1="Dual Layer Detector"
                 spec2="Low Dose"
              />
              <MedicalTechCard 
                 img={SITE_IMAGES.tech_mri}
                 title={t.medical.tech_mri_t}
                 desc={t.medical.tech_mri_d}
                 icon={Brain}
                 colorClass="text-purple-500"
                 fallbackKey="tech_mri"
                 spec1="AI Breath Sync"
                 spec2="1.5T Ambition"
              />
              <MedicalTechCard 
                 img={SITE_IMAGES.tech_endo}
                 title={t.medical.tech_endo_t}
                 desc={t.medical.tech_endo_d}
                 icon={Eye}
                 colorClass="text-green-500"
                 fallbackKey="tech_endo"
                 spec1="BLI Light"
                 spec2="AI Diagnosis"
              />
              <MedicalTechCard 
                 img={SITE_IMAGES.tech_dental}
                 title={t.medical.tech_dental_t}
                 desc={t.medical.tech_dental_d}
                 icon={Smile}
                 colorClass="text-blue-500"
                 fallbackKey="tech_dental"
                 spec1="3D Scanning"
                 spec2="One-Day Treat"
              />
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
                      <span>不知道選哪個？智能推薦適合您的套餐</span>
                      <ArrowRight size={18} />
                  </a>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
              
              {/* 1. VIP Member */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1 border border-gray-900 rounded-2xl p-6 hover:shadow-2xl transition hover:-translate-y-1 relative overflow-hidden bg-gray-900 text-white flex flex-col">
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Flagship</div>
                  <div className="mb-4">
                      <h4 className="text-xl font-serif font-bold text-yellow-400">VIP 頂級全能套裝</h4>
                      <p className="text-xs text-gray-400 mt-1">VIP Member Course</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-2">¥1,512,500</p>
                      <p className="text-[10px] text-gray-500">含醫療翻譯・報告翻譯・消費稅10%</p>
                  </div>
                  <p className="text-xs text-gray-300 mb-4 leading-relaxed flex-grow">
                      針對企業領袖的終極方案。包含腦、心、全身癌篩及消化道內視鏡的「全包式」檢查。
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> MRI: 腦(MRA)+心臟+DWIBS+骨盆</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> CT: 胸部+冠脈鈣化+內臟脂肪</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> 內視鏡: 胃鏡+大腸鏡 (鎮靜麻醉)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> 超音波: 頸/心/腹/下肢/乳房(女)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> PET/CT: 全身癌症掃描</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> 尊享: 個室使用・精緻餐券×2</div>
                  </div>
                  <a href="/medical-packages/vip-member-course" className="w-full py-2 bg-yellow-500 text-black text-xs font-bold rounded hover:bg-yellow-400 transition text-center block">立即下單</a>
              </div>

              {/* 2. PREMIUM (Cardiac) */}
              <div className="border border-blue-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-blue-900">PREMIUM (心臟精密)</h4>
                       <p className="text-xs text-blue-400 mt-1">Premium Cardiac Course</p>
                       <p className="text-xl font-bold text-blue-900 mt-2">¥825,000</p>
                       <p className="text-[10px] text-gray-400">含醫療翻譯・報告翻譯・消費稅10%</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       針對高壓力、缺乏運動菁英人士。深度評估猝死與動脈硬化風險。
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> MRI: 心臟(非造影)+腦MRA+DWIBS</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> CT: 胸部+冠脈鈣化積分</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> 超音波: 心臟・頸動脈・下肢</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> 血液: NTproBNP・心肌蛋白T・CPK</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> 機能: ABI/CAVI (血管年齡)</div>
                   </div>
                   <a href="/medical-packages/premium-cardiac-course" className="w-full py-2 border border-blue-200 text-blue-600 text-xs font-bold rounded hover:bg-blue-50 transition text-center block">立即下單</a>
              </div>

              {/* 3. SELECT (Gastro + Colon) */}
              <div className="border border-green-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-green-900">SELECT (胃+大腸鏡)</h4>
                       <p className="text-xs text-green-500 mt-1">Gastro + Colonoscopy Course</p>
                       <p className="text-xl font-bold text-green-900 mt-2">¥825,000</p>
                       <p className="text-[10px] text-gray-400">含醫療翻譯・報告翻譯・消費稅10%</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       應酬頻繁者的最佳選擇。一次完成上下消化道精密檢查 (鎮靜麻醉)。
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 內視鏡: 胃鏡+大腸鏡 (鎮靜)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 處置: 可當場切除息肉</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 超音波: 腹部 (肝膽胰脾腎)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 感染: 幽門螺旋桿菌抗體</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 血液: 消化道腫瘤標誌物</div>
                   </div>
                   <a href="/medical-packages/select-gastro-colonoscopy" className="w-full py-2 border border-green-200 text-green-600 text-xs font-bold rounded hover:bg-green-50 transition text-center block">立即下單</a>
              </div>

              {/* 4. SELECT (Stomach only) */}
              <div className="border border-teal-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-teal-800">SELECT (胃鏡)</h4>
                       <p className="text-xs text-teal-500 mt-1">Gastroscopy Course</p>
                       <p className="text-xl font-bold text-teal-800 mt-2">¥687,500</p>
                       <p className="text-[10px] text-gray-400">含醫療翻譯・報告翻譯・消費稅10%</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       針對胃癌高風險族群。無需清腸，檢查時間短，負擔較輕。
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 內視鏡: 胃鏡 (經口/經鼻)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 超音波: 腹部 (肝膽胰脾腎)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 感染: 幽門螺旋桿菌抗體</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 血液: 胃癌風險指標・腫瘤標誌物</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 基礎: 身體測量・視力聽力・心電圖</div>
                   </div>
                   <a href="/medical-packages/select-gastroscopy" className="w-full py-2 border border-teal-200 text-teal-600 text-xs font-bold rounded hover:bg-teal-50 transition text-center block">立即下單</a>
              </div>

              {/* 5. DWIBS */}
              <div className="border border-purple-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-purple-900">DWIBS (防癌篩查)</h4>
                       <p className="text-xs text-purple-500 mt-1">DWIBS Cancer Screening</p>
                       <p className="text-xl font-bold text-purple-900 mt-2">¥275,000</p>
                       <p className="text-[10px] text-gray-400">含醫療翻譯・報告翻譯・消費稅10%</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       無輻射全身癌症篩查 MRI。無需顯影劑，適合定期追蹤。
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> MRI: DWIBS (頸部至骨盆)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> 血液: 全套腫瘤標誌物</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> 血液: 肝腎功能・甲狀腺</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> 特點: 無輻射・無痛・非侵入</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> 基礎: 身體測量・視力聽力・心電圖</div>
                   </div>
                   <a href="/medical-packages/dwibs-cancer-screening" className="w-full py-2 border border-purple-200 text-purple-600 text-xs font-bold rounded hover:bg-purple-50 transition text-center block">立即下單</a>
              </div>

              {/* 6. BASIC */}
              <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-gray-50 flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-gray-800">BASIC (基礎套餐)</h4>
                       <p className="text-xs text-gray-500 mt-1">Standard Checkup Course</p>
                       <p className="text-xl font-bold text-gray-800 mt-2">¥550,000</p>
                       <p className="text-[10px] text-gray-400">含醫療翻譯・報告翻譯・消費稅10%</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">
                       包含血液、影像、超音波的標準健檢。高性價比的企業團體首選。
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 影像: 胸部X光・腹部超音波</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 血液: 肝腎脂糖・甲狀腺・腫瘤標誌物</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 基礎: 視力・聽力・眼壓・眼底・心電圖</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 檢體: 尿液・便潛血(2日法)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 歯科: 口腔掃描・X線・餐券</div>
                   </div>
                   <a href="/medical-packages/basic-checkup" className="w-full py-2 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-100 transition text-center block">立即下單</a>
              </div>

          </div>
      </div>

      {/* 套餐對比表格 */}
      <div className="mb-24" id="timc-comparison">
          <div className="text-center mb-12">
              <h3 className="text-3xl font-serif text-gray-900">套餐項目對比</h3>
              <p className="text-gray-500 text-sm mt-2">一目了然，選擇最適合您的健檢方案</p>
          </div>
          <div className="max-w-7xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <PackageComparisonTable />
              </div>
          </div>
      </div>

      {/* 客戶評價區塊 - 自動滾動輪播 */}
      <div className="mb-24" id="timc-testimonials">
          <div className="text-center mb-16">
              <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">Customer Reviews</span>
              <h3 className="text-3xl font-serif text-gray-900 mt-2">客戶真實體驗</h3>
              <p className="text-gray-500 text-sm mt-2">來自各地客戶的體檢分享</p>
          </div>

          {/* 統計數據 */}
          <div className="flex flex-wrap justify-center gap-12 mb-12">
              <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-500 mt-1">滿意度</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-500 mt-1">服務人次</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">4.9</div>
                  <div className="text-sm text-gray-500 mt-1">平均評分</div>
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
                                  {review.name.charAt(0)}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                                      <span>{review.flag}</span>
                                  </div>
                                  <div className="text-xs text-gray-400">{review.loc}</div>
                              </div>
                          </div>
                          <div className="text-xs text-blue-600 font-medium mb-3">{review.pkg}</div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{review.text}</p>
                          <div className="flex items-center gap-2 text-green-600 text-xs">
                              <CheckCircle size={12} />
                              <span className="font-medium">{review.highlight}</span>
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
                                  {review.name.charAt(0)}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                                      <span>{review.flag}</span>
                                  </div>
                                  <div className="text-xs text-gray-400">{review.loc}</div>
                              </div>
                          </div>
                          <div className="text-xs text-blue-600 font-medium mb-3">{review.pkg}</div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{review.text}</p>
                          <div className="flex items-center gap-2 text-green-600 text-xs">
                              <CheckCircle size={12} />
                              <span className="font-medium">{review.highlight}</span>
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
              <h3 className="text-3xl font-serif text-gray-900 mt-2">常見問題</h3>
              <p className="text-gray-500 text-sm mt-2">關於 TIMC 體檢的常見疑問解答</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
              {[
                  { q: '如何預約 TIMC 體檢？', a: '您可以直接在本網站選擇心儀的套餐，填寫預約資訊後完成線上支付即可。支付成功後，我們的客服會在 1-2 個工作日內與您聯繫，確認具體的體檢日期。' },
                  { q: '體檢當天需要空腹嗎？', a: '是的，大部分體檢項目需要空腹進行。通常要求體檢前一天晚上 9 點後禁食，只可飲用少量清水。具體要求會在確認預約後發送給您的體檢須知中詳細說明。' },
                  { q: '有中文服務嗎？', a: '有的。TIMC 配備專業的中文翻譯人員，全程陪同您完成體檢。醫生問診時也會有翻譯在場，確保溝通順暢無障礙。' },
                  { q: '體檢報告什麼時候能拿到？', a: '體檢完成後約 7-10 個工作日，您會收到完整的中文版體檢報告。報告會以電子郵件發送，如需紙質版可提前告知。' },
                  { q: '可以取消或改期嗎？', a: '可以的。體檢前 14 天以上可全額退款；體檢前 7-14 天退還 50% 費用；體檢前 7 天內恕不接受取消，但可免費改期一次。改期需提前 3 個工作日通知。' },
                  { q: 'TIMC 體檢中心在哪裡？', a: 'TIMC OSAKA（德洲會國際醫療中心）位於大阪市北區梅田三丁目 2 番 2 號 JP TOWER OSAKA 11 樓。交通便利，從大阪站步行約 5 分鐘即可到達。' },
              ].map((faq, i) => (
                  <details key={i} className="group bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
                          <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                          <ChevronDown size={20} className="text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
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
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">已預約？查詢訂單狀態</h3>
              <p className="text-gray-500 mb-6">輸入您的電子郵箱和訂單編號，即可查看預約進度</p>
              <a
                  href="/order-lookup"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
              >
                  <FileText size={18} />
                  查詢我的訂單
              </a>
          </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-200">
          <h3 className="text-3xl md:text-4xl font-serif mb-6">{t.medical.cta_title}</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6 leading-relaxed whitespace-pre-line">
              {t.medical.cta_text}
          </p>
          {/* 限量提示 */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span className="text-blue-100 text-sm">每月僅限 <span className="text-white font-bold">20</span> 位 · 名額有限</span>
          </div>
          <div>
              <button onClick={onOpenTIMCQuote} className="bg-white text-blue-800 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition shadow-lg inline-flex items-center gap-2">
                  <Zap size={18} /> {t.medical.cta_btn}
              </button>
          </div>
      </div>

      <div className="text-center py-12">
         <button onClick={() => setCurrentPage('home')} className="mt-8 inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
      </div>
    </div>
  </div>
);

const GolfView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger }) => {
  // CONFIGURATION: Map Plan IDs to Image URLs
  // This makes it easy to add new photos by just adding a key-value pair here
  const planImages: Record<string, string> = {
    'kansai-elite': SITE_IMAGES.plan_kansai,
    'golf-pilgrimage': SITE_IMAGES.plan_difficult,
    'fuji-spectacular': SITE_IMAGES.plan_fuji,
    // Add new plan IDs here with their corresponding image URLs
  };

  const getPlanImage = (id: string) => planImages[id] || SITE_IMAGES.golf_hero;

  return (
  <div className="animate-fade-in-up min-h-screen bg-white">
     {/* Hero - Full height with transparent nav overlap */}
     <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img
            src={SITE_IMAGES.golf_hero}
            className="absolute inset-0 w-full h-full object-cover grayscale-[10%]" 
            alt="Golf Course" 
            key="golf_hero"
            onError={(e) => handleSmartImageError(e, 'golf_hero')}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white">
           <span className="inline-block border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-4">
              {t.golf.tag}
           </span>
           <h1 className="text-5xl font-serif font-bold mb-4">{t.golf.title_1}</h1>
           <h2 className="text-3xl font-light text-gray-200">{t.golf.title_2}</h2>
        </div>
     </div>
     <div className="container mx-auto px-6 py-24">
         <div className="text-center mb-16">
            <span className="text-green-600 text-xs tracking-widest uppercase font-bold">{t.golf.std_title}</span>
            <h2 className="text-3xl font-serif mt-3 text-gray-900">Why Choose Our Golf Division?</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
             {[
               { icon: <Lock size={24} />, title: t.golf.f1_t, desc: t.golf.f1_d, color: 'green' },
               { icon: <Trophy size={24} />, title: t.golf.f2_t, desc: t.golf.f2_d, color: 'blue' },
               { icon: <Car size={24} />, title: t.golf.f3_t, desc: t.golf.f3_d, color: 'gray' },
               { icon: <Bath size={24} />, title: t.golf.f4_t, desc: t.golf.f4_d, color: 'orange' },
             ].map((item, i) => (
               <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition duration-300 group hover:-translate-y-1">
                  <div className={`w-14 h-14 bg-white text-${item.color}-600 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-${item.color}-600 group-hover:text-white transition`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3 font-serif text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
               </div>
             ))}
         </div>

         {/* Premium Plans Section - New Update */}
         <div className="mb-24">
            <div className="text-center mb-16">
               <h3 className="text-3xl font-serif text-gray-900">Recommended Itineraries</h3>
               <p className="text-gray-500 text-sm mt-2">Curated for VIPs</p>
            </div>
            
            <div className="space-y-24">
               {t.golf.plans?.map((plan: any, index: number) => (
                  <div key={plan.id} className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-start`}>
                     {/* Image Card */}
                     <div className="md:w-1/2 w-full">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] group">
                           <img 
                              src={getPlanImage(plan.id)}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                              alt={plan.title}
                              onError={(e) => handleSmartImageError(e, `plan_${plan.id.split('-')[0]}`)}
                           />
                           <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                              {plan.tags.map((tag: string, i: number) => (
                                 <span key={i} className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-white/20">
                                    {tag}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>
                     
                     {/* Content */}
                     <div className="md:w-1/2 w-full">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-green-600 font-bold text-xs tracking-widest uppercase">Plan 0{index + 1}</span>
                           <div className="h-px bg-green-200 flex-grow"></div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">{plan.title}</h3>
                        <h4 className="text-lg text-gray-500 mb-6 font-light">{plan.subtitle}</h4>
                        <p className="text-gray-600 leading-relaxed mb-8">{plan.desc}</p>
                        
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
                           <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-800">
                              <Building size={16} className="text-green-600" />
                              <span>Accommodation: {plan.hotel}</span>
                           </div>
                           <div className="space-y-4">
                              {plan.schedule.map((day: any, dIndex: number) => (
                                 <div key={dIndex} className="flex gap-4 text-sm">
                                    <span className="font-bold text-gray-400 w-12 flex-shrink-0">{day.day}</span>
                                    <span className="text-gray-700 leading-relaxed">{day.text}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <button 
                           onClick={onLoginTrigger}
                           className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition shadow-lg flex items-center gap-2"
                        >
                           <Award size={18} />
                           {t.golf.cta_btn}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="mt-24 bg-[#111] rounded-3xl p-12 text-center text-white">
             <h3 className="text-3xl font-serif mb-4">{t.golf.cta_title}</h3>
             <p className="text-gray-400 mb-8">{t.golf.cta_desc}</p>
             <button onClick={onLoginTrigger} className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-green-500 hover:text-white transition">
                {t.golf.cta_btn}
             </button>
         </div>
         <button onClick={() => setCurrentPage('home')} className="mt-16 w-full text-center text-gray-400 hover:text-black transition flex justify-center items-center gap-2">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
     </div>
  </div>
  );
};

const BusinessView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger }) => {
   // CONFIGURATION: Map Plan IDs to Image URLs
   // Easily add new plans/images here
   const planImages: Record<string, string> = {
      'biz-plan-1': SITE_IMAGES.biz_medical,
      'biz-plan-2': SITE_IMAGES.biz_tokyo,
      'biz-plan-3': SITE_IMAGES.biz_factory,
      'biz-plan-4': SITE_IMAGES.biz_resort,
      'biz-plan-5': SITE_IMAGES.biz_golden,
      // Add more here
   };

   const getBizImage = (id: string) => planImages[id] || SITE_IMAGES.business_hero;

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
         <div className="relative z-10 text-center px-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t.business.hero_tag}</span>
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                {t.business.hero_title}
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                {t.business.hero_text}
            </p>
         </div>
      </div>

      <div className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
             <div>
                <h3 className="text-3xl font-serif text-gray-900 mb-6">{t.business.tag}</h3>
                <p className="text-gray-500 leading-relaxed whitespace-pre-line mb-8">
                   {t.business.desc}
                </p>
                <button onClick={onLoginTrigger} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">
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

          {/* New Business Plans Section */}
          <div className="mb-24">
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
                            <img 
                               src={getBizImage(plan.id)}
                               className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                               alt={plan.title}
                               onError={(e) => handleSmartImageError(e, `biz_${plan.id}`)}
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
          
          <div className="text-center mt-12">
             <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 mx-auto text-gray-500 hover:text-black transition">
                <ArrowLeft size={16} /> {t.about.back}
             </button>
          </div>
      </div>
    </div>
   );
};

const PartnerView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger }) => (
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
         <div className="relative z-10 text-center px-6">
             <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
               <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t.partner.hero_tag}</span>
             </span>
             <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                {t.partner.hero_title}
             </h1>
             <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed whitespace-pre-line text-sm md:text-base">
                {t.partner.hero_text}
             </p>
         </div>
     </div>

     <div className="container mx-auto px-6 py-24">
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
               <button onClick={onLoginTrigger} className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-500 transition shadow-lg">
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
const HomeView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, currentLang, landingInputText, setLandingInputText, hideOfficialBranding }) => {
  // STRICT JS MOBILE DETECTION
  const isMobile = useIsMobile();

  // 获取佣金等级配置（用于动态显示分成比例）
  const { summary: commissionSummary } = useCommissionTiers();

  // 从数据库获取网站图片配置
  const { getImage } = useSiteImages();

  // 首页轮播图配置 - 竞拍展位系统
  // 每周竞拍一次，起价 20,000 日币，轮播 3 张图
  // 图片从数据库 site_images 表读取，可在后台管理
  const heroSlides: CarouselSlide[] = [
    {
      id: 'timc-health-checkup',
      title: currentLang === 'zh-TW' ? '日本 TIMC 精密體檢' : currentLang === 'ja' ? '日本TIMC精密健診' : 'Japan TIMC Premium Checkup',
      subtitle: currentLang === 'zh-TW' ? '德洲會國際醫療中心' : currentLang === 'ja' ? '徳洲会国際医療センター' : 'Tokushukai International Medical Center',
      description: currentLang === 'zh-TW' ? 'PET-CT / MRI / 胃腸鏡 - 早期發現，守護健康' : currentLang === 'ja' ? 'PET-CT / MRI / 胃腸内視鏡 - 早期発見で健康を守る' : 'PET-CT / MRI / Endoscopy - Early Detection for Better Health',
      imageUrl: getImage('hero_slide_1', 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg'),
      mobileImageUrl: getImage('hero_slide_1_mobile', 'https://i.ibb.co/TDYnsXBb/013-2.jpg'),
      ctaText: currentLang === 'zh-TW' ? '了解詳情' : currentLang === 'ja' ? '詳細を見る' : 'Learn More',
      ctaLink: '/medical-packages',
      overlayColor: 'rgba(0, 50, 100, 0.5)',
      textPosition: 'center',
      advertiser: 'TIMC',
    },
    {
      id: 'ai-health-screening',
      title: currentLang === 'zh-TW' ? 'AI 智能健康檢測' : currentLang === 'ja' ? 'AI健康診断' : 'AI Health Screening',
      subtitle: currentLang === 'zh-TW' ? '3 分鐘了解您的健康風險' : currentLang === 'ja' ? '3分でリスクを把握' : '3-Minute Risk Assessment',
      description: currentLang === 'zh-TW' ? '基於 AI 的專業問診，為您推薦最適合的體檢方案' : currentLang === 'ja' ? 'AIによる問診で最適な健診プランをご提案' : 'AI-powered consultation for personalized health plans',
      imageUrl: getImage('hero_slide_2', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop'),
      ctaText: currentLang === 'zh-TW' ? '免費檢測' : currentLang === 'ja' ? '無料診断' : 'Free Screening',
      ctaLink: '/health-screening',
      overlayColor: 'rgba(30, 60, 114, 0.6)',
      textPosition: 'center',
      advertiser: 'NIIJIMA',
    },
    {
      id: 'cancer-treatment',
      title: currentLang === 'zh-TW' ? '日本尖端癌症治療' : currentLang === 'ja' ? '日本最先端がん治療' : 'Japan Advanced Cancer Treatment',
      subtitle: currentLang === 'zh-TW' ? '質子重離子 / 光免疫 / BNCT' : currentLang === 'ja' ? '陽子線・光免疫・BNCT' : 'Proton / Photoimmunotherapy / BNCT',
      description: currentLang === 'zh-TW' ? '全球領先的癌症治療技術，精準打擊癌細胞' : currentLang === 'ja' ? '世界最先端の治療技術でがん細胞を狙い撃ち' : 'World-leading technology for precise cancer treatment',
      imageUrl: getImage('hero_slide_3', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop'),
      ctaText: currentLang === 'zh-TW' ? '諮詢治療方案' : currentLang === 'ja' ? '治療相談' : 'Consult Now',
      ctaLink: '/cancer-treatment',
      overlayColor: 'rgba(139, 0, 50, 0.5)',
      textPosition: 'center',
      advertiser: 'NIIJIMA',
    },
  ];

  return (
  <div className="animate-fade-in-up pt-0 bg-white">
      {/* 1. Hero Carousel - 竞拍展位轮播图 */}
      <HeroCarousel
        slides={heroSlides}
        autoPlayInterval={6000}
        showIndicators={true}
        showArrows={true}
        height="85vh"
      />

      {/* NEW: AI Health Screening Entry Section - Prominent CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
             <div className="absolute w-96 h-96 bg-blue-200 rounded-full filter blur-3xl top-0 left-1/4 -translate-x-1/2"></div>
             <div className="absolute w-72 h-72 bg-purple-200 rounded-full filter blur-3xl bottom-0 right-1/4 translate-x-1/2"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                  {/* AI Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 px-4 py-2 rounded-full mb-6 shadow-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">AI 智能健康評估</span>
                      <Bot size={14} className="text-blue-600" />
                  </div>

                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                      {currentLang === 'zh-TW' ? (
                          <>
                              不確定是否需要赴日體檢？<br/>
                              <span className="gemini-text">讓 AI 幫您分析</span>
                          </>
                      ) : currentLang === 'ja' ? (
                          <>
                              日本での健診が必要か分からない？<br/>
                              <span className="gemini-text">AIが分析します</span>
                          </>
                      ) : (
                          <>
                              Not sure if you need a checkup in Japan?<br/>
                              <span className="gemini-text">Let AI Analyze</span>
                          </>
                      )}
                  </h2>

                  <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                      {currentLang === 'zh-TW'
                          ? '透過 3 分鐘的智能問答，AI 將根據您的健康狀況、家族病史、生活習慣等因素，評估您的疾病風險並推薦最適合的日本體檢方案。'
                          : currentLang === 'ja'
                          ? '3分間のAI問診で、健康状態・家族歴・生活習慣などを分析し、あなたに最適な健診プランをご提案します。'
                          : 'Through a 3-minute AI assessment, we analyze your health status, family history, and lifestyle to recommend the most suitable Japan medical checkup package for you.'
                      }
                  </p>

                  {/* Primary CTA Button */}
                  <a
                      href="/health-screening"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:-translate-y-1 group"
                  >
                      <Scan className="w-6 h-6 group-hover:animate-pulse" />
                      <span>{currentLang === 'zh-TW' ? '開始 AI 健康檢測' : currentLang === 'ja' ? 'AI健康診断を開始' : 'Start AI Health Screening'}</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                          <Shield size={16} className="text-green-600" />
                          <span>{currentLang === 'zh-TW' ? '隱私安全' : 'Privacy Protected'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-blue-600" />
                          <span>{currentLang === 'zh-TW' ? '免費評估' : 'Free Assessment'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-purple-600" />
                          <span>{currentLang === 'zh-TW' ? '專業醫療團隊審核' : 'Medical Team Reviewed'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* NEW: Four Cards Navigation Section */}
      <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

                  {/* Card 1: AI Health Screening */}
                  <a href="/health-screening" className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <Scan size={24} />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {currentLang === 'zh-TW' ? 'AI 健康檢測' : currentLang === 'ja' ? 'AI健康診断' : 'AI Health Screening'}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">
                          {currentLang === 'zh-TW'
                              ? '智能問診評估您的健康風險'
                              : currentLang === 'ja'
                              ? 'AI問診でリスク評価'
                              : 'AI risk assessment'
                          }
                      </p>
                      <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-bold group-hover:gap-2 transition-all">
                          {currentLang === 'zh-TW' ? '開始檢測' : 'Start'} <ArrowRight size={14} />
                      </span>
                  </a>

                  {/* Card 2: Cancer Treatment - NEW */}
                  <a href="/cancer-treatment" className="group bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <HeartPulse size={24} />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 group-hover:text-rose-700 transition-colors">
                          {currentLang === 'zh-TW' ? '日本綜合治療' : currentLang === 'ja' ? 'がん総合治療' : 'Cancer Treatment'}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">
                          {currentLang === 'zh-TW'
                              ? '質子重離子、光免疫、BNCT'
                              : currentLang === 'ja'
                              ? '陽子線・光免疫・BNCT'
                              : 'Proton, Photoimmuno, BNCT'
                          }
                      </p>
                      <span className="inline-flex items-center gap-1 text-rose-600 text-sm font-bold group-hover:gap-2 transition-all">
                          {currentLang === 'zh-TW' ? '了解更多' : 'Learn More'} <ArrowRight size={14} />
                      </span>
                  </a>

                  {/* Card 3: Package Recommender */}
                  <a href="/package-recommender" className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <MessageSquare size={24} />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                          {currentLang === 'zh-TW' ? '套餐智能推薦' : currentLang === 'ja' ? 'パッケージ推薦' : 'Package Recommender'}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">
                          {currentLang === 'zh-TW'
                              ? '找到最適合您的健檢套餐'
                              : currentLang === 'ja'
                              ? '最適なプランをご提案'
                              : 'Find your ideal package'
                          }
                      </p>
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-bold group-hover:gap-2 transition-all">
                          {currentLang === 'zh-TW' ? '開始推薦' : 'Start'} <ArrowRight size={14} />
                      </span>
                  </a>

                  {/* Card 4: Order Lookup */}
                  <a href="/order-lookup" className="group bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <FileText size={24} />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                          {currentLang === 'zh-TW' ? '訂單查詢' : currentLang === 'ja' ? '予約確認' : 'Order Lookup'}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">
                          {currentLang === 'zh-TW'
                              ? '查看您的預約狀態'
                              : currentLang === 'ja'
                              ? '予約状況を確認'
                              : 'Check reservation status'
                          }
                      </p>
                      <span className="inline-flex items-center gap-1 text-gray-600 text-sm font-bold group-hover:gap-2 transition-all">
                          {currentLang === 'zh-TW' ? '查詢訂單' : 'Check'} <ArrowRight size={14} />
                      </span>
                  </a>

              </div>
          </div>
      </section>

    {/* Medical Preview Section */}
    <section className="py-24 bg-white relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          
          {/* LEFT SIDE: HYBRID CARD */}
          <div className="md:w-1/2 cursor-pointer group w-full" onClick={() => setCurrentPage('medical')}>
            <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl bg-white border border-gray-100 h-[400px] md:h-[600px] w-full">
                
                {/* 1. 3D DNA/Cell Visualization Layer - DESKTOP ONLY (STRICT CHECK) */}
                {!isMobile && (
                  <div className="hidden md:block absolute inset-0 z-0">
                      <MedicalDNA />
                  </div>
                )}

                {/* 2. Static Fallback Image - MOBILE ONLY (STRICT CHECK) */}
                {isMobile && (
                  <div className="absolute inset-0 z-0">
                      <img 
                        src={SITE_IMAGES.mobile_medical_fallback} 
                        className="w-full h-full object-cover animate-fade-in-up" 
                        alt="Medical DNA Abstract" 
                      />
                      {/* Mobile Overlay to ensure text readability if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                  </div>
                )}
                
                {/* 3. Interaction Prompt */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-2 pointer-events-none">
                   <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-100">Tap to Explore</span>
                </div>

            </div>
          </div>

          <div className="md:w-1/2 space-y-8">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">{t.medical.tag}</span>
            <h2 className="text-4xl font-serif text-gray-900 leading-tight">
               {currentLang === 'zh-TW' ? (
                  <>
                     科技改變人類<br/>
                     <span className="gemini-text">早發現，早治療</span>
                  </>
               ) : t.medical.title}
            </h2>
            <p className="text-gray-500 leading-8 font-light whitespace-pre-line">
              {t.medical.desc}
            </p>
            <div className="flex flex-col gap-4">
               {/* Tech Features List */}
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Dna size={16} /></div>
                  <div>遺伝子レベルの解析 (Gene Analysis)</div>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><Monitor size={16} /></div>
                  <div>AI 画像診断支援 (AI Diagnosis Support)</div>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600"><Microscope size={16} /></div>
                  <div>超早期発見 (Early Detection)</div>
               </div>
            </div>
            <div className="pt-4">
               <button 
                 onClick={() => setCurrentPage('medical')}
                 className="inline-block border border-gray-300 px-8 py-3 text-sm hover:bg-blue-600 hover:border-blue-600 hover:text-white transition cursor-pointer tracking-wider uppercase rounded"
               >
                 {t.medical.btn_detail}
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Business Preview Section */}
    <section className="py-24 bg-[#F5F5F7]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
          
          {/* RIGHT SIDE: BUSINESS 3D CARD */}
          <div className="md:w-1/2 cursor-pointer group w-full" onClick={() => setCurrentPage('business')}>
            <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl bg-[#F5F5F7] border border-gray-200 h-[400px] md:h-[500px] w-full">
               
               {/* 1. 3D Network Layer - DESKTOP ONLY (STRICT CHECK) */}
               {!isMobile && (
                  <div className="hidden md:block absolute inset-0 z-0">
                      <BusinessNetwork />
                  </div>
               )}

               {/* 2. Static Fallback Image - MOBILE ONLY (STRICT CHECK) */}
               {isMobile && (
                  <div className="absolute inset-0 z-0">
                      <img 
                        src={SITE_IMAGES.mobile_business_fallback} 
                        className="w-full h-full object-cover animate-fade-in-up" 
                        alt="Global Business Network" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
               )}
               
               {/* Interaction Prompt */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-2 pointer-events-none">
                   <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-200">View Insights</span>
               </div>
            </div>
          </div>

          <div className="md:w-1/2 space-y-8 text-right md:text-left">
            <div className="flex flex-col md:items-start items-end">
              <span className="text-purple-500 text-xs tracking-widest uppercase font-bold">{t.business.tag}</span>
              <h2 className="text-4xl font-serif text-gray-900 mt-4">{t.business.title}</h2>
            </div>
            <p className="text-gray-500 leading-8 font-light whitespace-pre-line">
              {t.business.desc}
            </p>
            <button 
              onClick={() => setCurrentPage('business')}
              className="inline-block border border-gray-300 px-8 py-3 text-sm hover:bg-black hover:text-white transition cursor-pointer tracking-wider uppercase rounded"
            >
              {t.business.btn_case}
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Guide Partner Section - 白标模式下隐藏 */}
    {!hideOfficialBranding && (
    <section id="guide-partner" className="py-32 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f97316%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-orange-600 font-bold text-sm tracking-widest uppercase">{t.guidePartner?.tag || 'Guide Partnership Program'}</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 mb-4 text-gray-900">{t.guidePartner?.title || '導遊合夥人計劃'}</h2>
          <p className="text-xl text-orange-600 font-medium mb-6">{t.guidePartner?.subtitle || '讓每位獨立導遊，都擁有旅行社的資源'}</p>
          <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed whitespace-pre-line">
            {t.guidePartner?.desc || '您直接接觸富裕層客戶，卻沒有旅行社資質？\n新島交通作為日本第二類旅行社，為您打通160家高端夜總會、頂級體檢中心、綜合醫療等獨家資源。'}
          </p>
        </div>

        {/* Three Services */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Service 1: Nightclub */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.guidePartner?.service1_title || '高端夜總會'}</h3>
            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{t.guidePartner?.service1_desc || 'INSOU集團160家店舖\n覆蓋全日本（除北海道/沖繩）'}</p>
          </div>

          {/* Service 2: Medical */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.guidePartner?.service2_title || 'TIMC精密體檢'}</h3>
            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{t.guidePartner?.service2_desc || '德洲會集團旗艦設施\n大阪JP Tower'}</p>
          </div>

          {/* Service 3: Treatment */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Dna className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.guidePartner?.service3_title || '綜合醫療'}</h3>
            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{t.guidePartner?.service3_desc || '幹細胞·抗衰·專科治療\n日本頂尖醫療資源'}</p>
          </div>
        </div>

        {/* Income Highlight - Attractive CTA with Social Proof */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-3xl p-8 md:p-10 text-white mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium">本月已有 47 位導遊成功升級</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">每月輕鬆增收 50-100萬日元</h3>
              <p className="text-orange-100 text-lg mb-2">無需旅行社資質 · 階梯返金最高 <span className="font-bold text-white text-xl">20%</span></p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-white/15 px-3 py-1 rounded-full text-sm">🍸 160+高端夜總會</span>
                <span className="bg-white/15 px-3 py-1 rounded-full text-sm">🏥 頂級體檢中心</span>
                <span className="bg-white/15 px-3 py-1 rounded-full text-sm">💉 綜合醫療資源</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur rounded-2xl p-6 mb-3">
                <div className="text-4xl md:text-5xl font-bold mb-1">¥50萬+</div>
                <div className="text-orange-100 text-sm">月均收入可達</div>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-orange-200">
                <CheckCircle size={12} />
                <span>3000+ 在日導遊已加入</span>
              </div>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="relative z-10 mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{commissionSummary.minRate}%</div>
              <div className="text-xs text-orange-200">起步返金</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{commissionSummary.maxRate}%</div>
              <div className="text-xs text-orange-200">鑽石返金</div>
            </div>
            <div>
              <div className="text-2xl font-bold">月結</div>
              <div className="text-xs text-orange-200">準時到帳</div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          <div className="flex items-start gap-4 bg-white/80 backdrop-blur p-6 rounded-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{t.guidePartner?.rule1_title || '推薦制準入'}</h4>
              <p className="text-sm text-gray-500">{t.guidePartner?.rule1_desc || '會員推薦才能加入，確保圈子品質'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/80 backdrop-blur p-6 rounded-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{t.guidePartner?.rule2_title || '500元訂金'}</h4>
              <p className="text-sm text-gray-500">{t.guidePartner?.rule2_desc || '篩選認真客戶，保護商家利益'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/80 backdrop-blur p-6 rounded-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{t.guidePartner?.rule3_title || '月結算'}</h4>
              <p className="text-sm text-gray-500">{t.guidePartner?.rule3_desc || '穩定可靠，每月準時結算'}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="/guide-partner"
              className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <ArrowRight size={18} /> {t.guidePartner?.cta_detail || '了解詳情'}
            </a>
          </div>
          <p className="text-gray-400 text-sm">{t.guidePartner?.footer_note || '已有3000+在日導遊加入我們的合作網絡'}</p>
        </div>
      </div>
    </section>
    )}

    {/* Founder Section - 白标模式下隐藏 */}
    {!hideOfficialBranding && (
    <section className="py-24 bg-white border-t border-gray-100">
       <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
             <div className="md:w-1/3">
                <div className="relative">
                   <div className="absolute inset-0 bg-blue-100 transform translate-x-4 translate-y-4 rounded-xl"></div>
                   <img
                      src={SITE_IMAGES.founder_portrait}
                      alt="Founder Portrait"
                      className="relative rounded-xl shadow-lg w-full h-auto max-h-[600px] object-cover object-top"
                      key="founder_portrait"
                      onError={(e) => handleSmartImageError(e, 'founder_portrait')}
                   />
                </div>
             </div>
             <div className="md:w-2/3">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">{t.founder.title}</span>
                <h2 className="text-4xl font-serif text-gray-900 mt-4 mb-6">{t.founder.phil_title}</h2>
                <div className="relative mb-8">
                   <Quote className="absolute -top-4 -left-6 text-gray-100 w-16 h-16 transform -scale-x-100" />
                   <p className="text-gray-600 leading-relaxed relative z-10 text-xl italic font-serif pl-4 border-l-4 border-blue-500">
                      "{t.founder.quote}"
                   </p>
                </div>
                <p className="text-gray-500 leading-relaxed text-sm whitespace-pre-line">
                   {t.founder.desc}
                </p>
                <div className="mt-8 pt-8 border-t border-gray-100">
                   <p className="font-bold text-gray-900 text-lg">{t.founder.name}</p>
                   <p className="text-gray-400 text-sm">{t.founder.role}</p>
                </div>
             </div>
          </div>
       </div>
    </section>
    )}

    {/* About Section - 白标模式下隐藏 */}
    {!hideOfficialBranding && (
    <section id="about" className="py-24 bg-[#FAFAFA]">
      <div className="container mx-auto px-6 max-w-4xl">
        <h3 className="text-3xl font-serif mb-12 text-center tracking-widest">{t.about.title}</h3>

        <div className="border-t border-gray-200 text-sm font-light bg-white shadow-sm rounded-lg overflow-hidden">
          {[
            { label: t.about.name, value: t.about.name_val || '新島交通株式会社 (NIIJIMA KOTSU Co., Ltd.)' },
            { label: t.about.est, value: t.about.est_val || '2020/02' },
            { label: t.about.rep, value: t.about.rep_val || '員昊' },
            { label: t.about.cap, value: t.about.cap_val || '2500万円' },
            { label: t.about.loc, value: t.about.loc_val || '〒556-0014 大阪府大阪市浪速区大国1-2-21-602' },
            { label: t.about.client, value: t.about.client_val },
            { label: t.about.lic, value: t.about.lic_val },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 py-6 border-b border-gray-100 hover:bg-gray-50 transition px-6 group">
              <div className="md:col-span-3 text-gray-400 font-medium group-hover:text-gray-600 transition">{item.label}</div>
              <div className="md:col-span-9 text-gray-800 font-medium whitespace-pre-line leading-relaxed">{item.value}</div>
            </div>
          ))}
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
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW'); // Default to TW
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormData, setAuthFormData] = useState({ companyName: '', contactPerson: '', email: '' });
  const [authError, setAuthError] = useState('');
  const [isSendingAuth, setIsSendingAuth] = useState(false);

  // State for the Landing Page Input
  const [landingInputText, setLandingInputText] = useState("");

  // State for TIMC Quote Modal
  const [showTIMCQuoteModal, setShowTIMCQuoteModal] = useState(false);

  // 白标模式
  const { isWhiteLabelMode, branding } = useWhiteLabel();
  const { hideOfficialBranding, hideGuidePartnerContent } = useWhiteLabelVisibility();

  const t = translations[currentLang];

  useEffect(() => { emailjs.init('exX0IhSSUjNgMhuGb'); }, []);

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

  // 根据当前页面确定 PublicLayout 的 activeNav
  const getActiveNav = () => {
    if (currentPage === 'medical') return 'medical';
    if (currentPage === 'golf') return 'golf';
    if (currentPage === 'business') return 'business';
    if (currentPage === 'partner') return 'partner';
    return undefined;
  };

  return (
    <PublicLayout activeNav={getActiveNav()} transparentNav={false} onLogoClick={() => setCurrentPage('home')}>
       {/* Content */}
       <main className="min-h-screen">
          {currentPage === 'home' && (
            <HomeView
              t={t}
              setCurrentPage={setCurrentPage}
              onLoginTrigger={() => router.push('/login')}
              currentLang={currentLang}
              landingInputText={landingInputText}
              setLandingInputText={setLandingInputText}
              hideOfficialBranding={hideOfficialBranding}
            />
          )}
          {currentPage === 'medical' && <MedicalView t={t} setCurrentPage={setCurrentPage} onOpenTIMCQuote={() => setShowTIMCQuoteModal(true)} currentLang={currentLang} />}
          {currentPage === 'business' && <BusinessView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={() => router.push('/login')} currentLang={currentLang} />}
          {currentPage === 'golf' && <GolfView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={() => router.push('/login')} currentLang={currentLang} />}
          {/* 白标模式下隐藏 Partner 页面（B2B 同业合作） */}
          {currentPage === 'partner' && !hideGuidePartnerContent && <PartnerView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={() => router.push('/login')} currentLang={currentLang} />}
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
                    {currentLang === 'ja' ? 'B2B パートナー登録' : 'Partner Application'}
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

       {/* TIMC Quote Modal */}
       <TIMCQuoteModal
         isOpen={showTIMCQuoteModal}
         onClose={() => setShowTIMCQuoteModal(false)}
       />
    </PublicLayout>
  );
};

export default LandingPage;
