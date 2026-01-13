
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { translations, Language } from '../translations';
import { UserProfile } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Building, Activity, Shield, Armchair, FileText, Check, Brain, Eye, Zap, Coffee, Globe, ChevronDown, Smile, Heart, Bus, Utensils, Quote, Lock, Trophy, Car, Bath, Handshake, Users, Briefcase, Mail, X, Menu, LogIn, Phone, Loader2, User, Sparkles, Scan, Cpu, Microscope, Dna, Monitor, Fingerprint, Printer, Map, Star, Award, MessageSquare, Bot } from 'lucide-react';
import emailjs from '@emailjs/browser';
import IntroParticles from './IntroParticles';
import MedicalDNA from './MedicalDNA';
import BusinessNetwork from './BusinessNetwork';
import PartnerParticles from './PartnerParticles';
import TestimonialWall from './TestimonialWall';

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
  onLoginTrigger: () => void;
  currentLang: Language;
  landingInputText?: string;
  setLandingInputText?: (text: string) => void;
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
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0"
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

const MedicalView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger }) => (
  <div className="animate-fade-in-up pt-24 min-h-screen bg-white">
    {/* ... (MedicalView content unchanged) ... */}
    {/* 1. Hero Section */}
    <div className="relative h-[70vh] min-h-[600px] flex items-center overflow-hidden text-white bg-slate-900">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
              
              {/* 1. VIP Member */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1 border border-gray-900 rounded-2xl p-6 hover:shadow-2xl transition hover:-translate-y-1 relative overflow-hidden bg-gray-900 text-white flex flex-col">
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Flagship</div>
                  <div className="mb-4">
                      <h4 className="text-xl font-serif font-bold text-yellow-400">VIP 頂級全能套裝</h4>
                      <p className="text-xs text-gray-400 mt-1">VIP Member Course</p>
                  </div>
                  <p className="text-xs text-gray-300 mb-6 leading-relaxed flex-grow">
                      針對企業領袖的終極方案。包含腦、心、全身癌篩及消化道內視鏡的「全包式」檢查。
                  </p>
                  <div className="space-y-2 mb-6 text-xs">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> MRI: 腦(MRA)+心+DWIBS+骨盆</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> CT: 胸部+冠脈鈣化+內臟脂肪</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> 內視鏡: 胃鏡+大腸鏡 (鎮靜)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> 超音波: 頸/心/腹/下肢/乳房(女)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> 尊享: 單間休息室、精緻餐券</div>
                  </div>
                  <button onClick={onLoginTrigger} className="w-full py-2 bg-yellow-500 text-black text-xs font-bold rounded hover:bg-yellow-400 transition">詢價</button>
              </div>

              {/* 2. PREMIUM (Cardiac) */}
              <div className="border border-blue-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-blue-900">PREMIUM (心臟精密)</h4>
                       <p className="text-xs text-blue-400 mt-1">Premium Cardiac Course</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-grow">
                       針對高壓力、缺乏運動菁英人士。深度評估猝死與動脈硬化風險。
                   </p>
                   <div className="space-y-2 mb-6 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> MRI: 心臟(非造影)+腦+DWIBS</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> CT: 冠狀動脈鈣化積分</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> 超音波: 心臟、頸動脈</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> 血液: BNP, 心肌蛋白T, CPK</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> 機能: ABI/CAVI (血管年齡)</div>
                   </div>
                   <button onClick={onLoginTrigger} className="w-full py-2 border border-blue-200 text-blue-600 text-xs font-bold rounded hover:bg-blue-50 transition">詢價</button>
              </div>

              {/* 3. SELECT (Gastro + Colon) */}
              <div className="border border-green-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-green-900">SELECT (胃+大腸鏡)</h4>
                       <p className="text-xs text-green-500 mt-1">Gastro + Colonoscopy Course</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-grow">
                       應酬頻繁者的最佳選擇。一次完成上下消化道精密檢查 (鎮靜麻醉)。
                   </p>
                   <div className="space-y-2 mb-6 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 內視鏡: 胃鏡 + 大腸鏡</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 處置: 可當場切除息肉</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 超音波: 腹部 (肝膽胰脾腎)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 感染: 幽門螺旋桿菌抗體</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> 血液: 消化道腫瘤標誌物</div>
                   </div>
                   <button onClick={onLoginTrigger} className="w-full py-2 border border-green-200 text-green-600 text-xs font-bold rounded hover:bg-green-50 transition">詢價</button>
              </div>

              {/* 4. SELECT (Stomach only) */}
              <div className="border border-teal-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-teal-800">SELECT (胃鏡)</h4>
                       <p className="text-xs text-teal-500 mt-1">Gastroscopy Course</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-grow">
                       針對胃癌高風險族群。無需清腸，檢查時間短，負擔較輕。
                   </p>
                   <div className="space-y-2 mb-6 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 內視鏡: 胃鏡 (經口/經鼻)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 超音波: 腹部 (肝膽胰脾腎)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 感染: 幽門螺旋桿菌抗體</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 血液: 胃癌/食道癌風險指標</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> 基礎: 身體測量/視力聽力</div>
                   </div>
                   <button onClick={onLoginTrigger} className="w-full py-2 border border-teal-200 text-teal-600 text-xs font-bold rounded hover:bg-teal-50 transition">詢價</button>
              </div>

              {/* 5. DWIBS */}
              <div className="border border-purple-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-purple-900">DWIBS (防癌篩查)</h4>
                       <p className="text-xs text-purple-500 mt-1">DWIBS Cancer Screening</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-grow">
                       無輻射全身癌症篩查 MRI。無需顯影劑，適合定期追蹤。
                   </p>
                   <div className="space-y-2 mb-6 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> MRI: DWIBS (頸部至骨盆)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> 血液: 全套腫瘤標誌物</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> 血液: 肝腎功能/常規檢查</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> 特點: 無輻射/無痛/非侵入</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> 對象: 關注全身癌症風險</div>
                   </div>
                   <button onClick={onLoginTrigger} className="w-full py-2 border border-purple-200 text-purple-600 text-xs font-bold rounded hover:bg-purple-50 transition">詢價</button>
              </div>

              {/* 6. BASIC */}
              <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-gray-50 flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-gray-800">BASIC (基礎套餐)</h4>
                       <p className="text-xs text-gray-500 mt-1">Standard Checkup Course</p>
                   </div>
                   <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-grow">
                       包含血液、影像、超音波的標準健檢。高性價比的企業團體首選。
                   </p>
                   <div className="space-y-2 mb-6 text-xs text-gray-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 影像: 胸部X光 + 腹部超音波</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 血液: 肝腎脂糖/甲狀腺/腫瘤標誌物</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 基礎: 視力/聽力/眼壓/眼底/心電圖</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 檢體: 尿液 + 便潛血(2日法)</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> 適用: 年度例行檢查/入職體檢</div>
                   </div>
                   <button onClick={onLoginTrigger} className="w-full py-2 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-100 transition">詢價</button>
              </div>

          </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-200">
          <h3 className="text-3xl md:text-4xl font-serif mb-6">{t.medical.cta_title}</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
              {t.medical.cta_text}
          </p>
          <button onClick={onLoginTrigger} className="bg-white text-blue-800 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition shadow-lg inline-flex items-center gap-2">
              <Zap size={18} /> {t.medical.cta_btn}
          </button>
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
  <div className="animate-fade-in-up pt-24 min-h-screen bg-white">
     {/* Hero */}
     <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
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
    <div className="animate-fade-in-up pt-24 min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
         <div className="absolute inset-0">
             <BusinessNetwork />
         </div>
         <div className="relative z-10 text-center px-6 pointer-events-none">
            <span className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block bg-white/80 backdrop-blur inline-block px-4 py-1 rounded-full border border-blue-100">
                {t.business.hero_tag}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 bg-clip-text">
                {t.business.hero_title}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
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
  <div className="animate-fade-in-up pt-24 min-h-screen bg-white">
     {/* Updated Hero for PartnerView using PartnerParticles (SHIN/RAI) */}
     <div className="relative h-[60vh] flex flex-col items-center justify-center bg-blue-50 overflow-hidden">
         <div className="absolute inset-0">
             <PartnerParticles />
         </div>
         <div className="relative z-10 text-center px-6 pointer-events-none">
             <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block bg-white/80 backdrop-blur inline-block px-4 py-1 rounded-full border border-blue-100">
                {t.partner.hero_tag}
             </span>
             <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 bg-clip-text">
                {t.partner.hero_title}
             </h1>
             <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed whitespace-pre-line text-sm md:text-base bg-white/60 p-4 rounded-xl backdrop-blur-sm shadow-sm">
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
const HomeView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, currentLang, landingInputText, setLandingInputText }) => {
  // STRICT JS MOBILE DETECTION
  const isMobile = useIsMobile();

  return (
  <div className="animate-fade-in-up pt-0 bg-white">
      {/* 1. Hero Header with 3D Particles */}
      <header className="relative w-full h-[85vh] flex items-center justify-center bg-white overflow-hidden">
          <div className="absolute inset-0 z-0">
             {/* Use IntroParticles on BOTH Desktop and Mobile as requested */}
             <IntroParticles />
          </div>
          <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
              <div className="animate-fade-in-up space-y-8 mt-48 md:mt-64">
                  <div className="pt-12 pointer-events-auto">
                      <button 
                          onClick={() => document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'})}
                          className="group inline-flex items-center gap-2 text-gray-800 border border-gray-300 bg-white/50 backdrop-blur-md px-8 py-3 rounded-full text-sm tracking-widest hover:bg-black hover:text-white hover:border-black transition duration-300 shadow-lg"
                      >
                          {t.hero.cta} <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={16} />
                      </button>
                  </div>
              </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-300 pointer-events-none">
             <ChevronDown size={24} />
          </div>
      </header>

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
                     <span className="text-transparent bg-clip-text gemini-gradient">早發現，早治療</span>
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

    {/* AI B2B Section */}
    <section id="ai-b2b" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-50 via-purple-50/30 to-transparent opacity-60 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="gemini-text font-bold text-sm tracking-widest uppercase">{t.ai.tag}</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 mb-6">{t.ai.title}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed whitespace-pre-line">
            {t.ai.desc}
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="p-10 md:w-1/2 border-r border-gray-50 bg-gray-[50] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{t.ai.input_label}</span>
              </div>
              
              {/* Interactive Input Area */}
              <div className="mb-8">
                <textarea 
                  className="w-full h-48 font-mono text-sm text-gray-700 leading-relaxed bg-white border border-gray-200 p-6 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all placeholder-gray-300"
                  placeholder={t.ai.input_ph}
                  value={landingInputText || ''}
                  onChange={(e) => setLandingInputText && setLandingInputText(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={onLoginTrigger}
              className="w-full py-4 gemini-gradient text-white font-medium rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Zap size={16} /> {t.ai.btn_gen}
            </button>
          </div>

          <div className="p-10 md:w-1/2 bg-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8">
              <span className="text-xs text-gray-400 uppercase tracking-wider">{t.ai.result_tag}</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full ring-1 ring-blue-100">
                <Zap size={10} className="inline mr-1" /> Generated in 1.2s
              </span>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-start bg-[#FAFAFA] p-5 rounded-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1 h-full bg-blue-400"></div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t.ai.result_med}</p>
                  <p className="text-sm font-bold text-gray-800">TIMC Premium PET-CT Course</p>
                  <p className="text-xs text-blue-600 mt-1">
                    <CheckCircle size={10} className="inline mr-1" /> OK
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-800">¥ 880,000</span>
                  {/* HIDDEN Profit Margin Display per user request for clean public view */}
                </div>
              </div>

              <div className="flex justify-between items-center p-4 pl-2">
                <div>
                  <p className="text-xs text-gray-400">{t.ai.result_stay}</p>
                  <p className="text-sm font-bold text-gray-800">2 Nights (OTA Match)</p>
                </div>
                <span className="text-green-500 text-xs flex items-center gap-1"><CheckCircle size={12} /> OK</span>
              </div>

              <div className="flex justify-between items-center p-4 pl-2 border-t border-dashed border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">{t.ai.result_car}</p>
                  <p className="text-sm font-bold text-gray-800">Full Course</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm text-gray-500">{t.ai.total}</span>
                <span className="text-3xl font-serif text-gray-900 gemini-text font-bold">¥ 1,880,000</span>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                {t.ai.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Founder Section (New) */}
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

    {/* About Section */}
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
  </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW'); // Default to TW
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormData, setAuthFormData] = useState({ companyName: '', contactPerson: '', email: '' });
  const [authError, setAuthError] = useState('');
  const [isSendingAuth, setIsSendingAuth] = useState(false);
  
  // State for the Landing Page Input
  const [landingInputText, setLandingInputText] = useState("");

  const t = translations[currentLang];

  useEffect(() => { emailjs.init('exX0IhSSUjNgMhuGb'); }, []);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (window.location.hash) {
        const id = window.location.hash.substring(1);
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                if (id === 'ai-b2b' || id === 'about') setCurrentPage('home');
            }
        }, 500);
    }
  }, []);

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

  const LanguageSwitcher = () => (
    <div className="relative">
      <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black transition uppercase tracking-wider">
        <Globe size={14} />
        {currentLang === 'zh-TW' ? '繁中' : currentLang.toUpperCase()}
        <ChevronDown size={12} />
      </button>
      {langMenuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-down">
           {[{ code: 'ja', label: '日本語' }, { code: 'zh-TW', label: '繁體中文' }, { code: 'en', label: 'English' }].map((lang) => (
             <button key={lang.code} onClick={() => { setCurrentLang(lang.code as Language); setLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 transition ${currentLang === lang.code ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}>
               {lang.label}
             </button>
           ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-100">
       {/* Navigation - Restored to Clean SVG Logo Design (React Component) */}
       {/* UPDATED: Only show background if scrolled or not on home page */}
       <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${currentPage === 'home' && !scrolled ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
         <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => setCurrentPage('home')}
            >
               <Logo className="w-10 h-10 text-black group-hover:text-blue-600 transition-colors" />
               <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg tracking-wide leading-none text-gray-900">NIIJIMA</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-1 group-hover:text-blue-500 transition-colors">{t.nav.brand_sub}</span>
               </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
               <button onClick={() => setCurrentPage('medical')} className={`text-sm font-medium hover:text-blue-600 transition ${currentPage === 'medical' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{t.nav.timc}</button>
               <button onClick={() => setCurrentPage('golf')} className={`text-sm font-medium hover:text-blue-600 transition ${currentPage === 'golf' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{t.nav.golf}</button>
               <button onClick={() => setCurrentPage('business')} className={`text-sm font-medium hover:text-blue-600 transition ${currentPage === 'business' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{t.nav.business}</button>
               <button onClick={() => setCurrentPage('partner')} className={`text-sm font-medium hover:text-blue-600 transition ${currentPage === 'partner' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{t.nav.partner}</button>
               <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="text-sm font-medium hover:text-blue-600 transition gemini-text font-bold">{t.nav.ai}</button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
               <LanguageSwitcher />
               <button 
                 onClick={openAuthModal}
                 className="hidden md:flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-gray-800 transition shadow-lg border border-transparent hover:border-gray-600"
               >
                 <LogIn size={14} /> {t.nav.login}
               </button>
               
               {/* Mobile Menu Button */}
               <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
         </div>
       </nav>

       {/* Mobile Menu Content */}
       {mobileMenuOpen && (
          <div className="fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-white z-40 p-6 flex flex-col gap-6 overflow-y-auto animate-fade-in-down">
              <button onClick={() => { setCurrentPage('medical'); setMobileMenuOpen(false); }} className="text-xl font-serif border-b pb-2">{t.nav.timc}</button>
              <button onClick={() => { setCurrentPage('golf'); setMobileMenuOpen(false); }} className="text-xl font-serif border-b pb-2">{t.nav.golf}</button>
              <button onClick={() => { setCurrentPage('business'); setMobileMenuOpen(false); }} className="text-xl font-serif border-b pb-2">{t.nav.business}</button>
              <button onClick={() => { setCurrentPage('partner'); setMobileMenuOpen(false); }} className="text-xl font-serif border-b pb-2">{t.nav.partner}</button>
              <button onClick={() => { openAuthModal(); setMobileMenuOpen(false); }} className="bg-black text-white py-4 rounded-lg font-bold mt-4">{t.nav.login}</button>
          </div>
       )}

       {/* Content */}
       <main className="min-h-screen">
          {currentPage === 'home' && <HomeView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} currentLang={currentLang} landingInputText={landingInputText} setLandingInputText={setLandingInputText} />}
          {currentPage === 'medical' && <MedicalView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} currentLang={currentLang} />}
          {currentPage === 'business' && <BusinessView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} currentLang={currentLang} />}
          {currentPage === 'golf' && <GolfView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} currentLang={currentLang} />}
          {currentPage === 'partner' && <PartnerView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} currentLang={currentLang} />}
       </main>

       {/* Footer - Maintained 4-Column Layout but using React Logo Component */}
       <footer className="bg-[#111] text-white py-16 border-t border-gray-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                           <Logo className="w-10 h-10 text-white" />
                           <span className="text-xl font-serif tracking-widest font-bold">NIIJIMA</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                           B2B Land Operator<br/>
                           Specializing in Kansai Region
                        </p>
                        <p className="text-gray-500 text-xs">
                           &copy; 2025 Niijima Kotsu Co., Ltd.<br/>All Rights Reserved.
                        </p>
                    </div>
    
                    {/* Column 2: License */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6">License & Cert</h4>
                        <div className="space-y-3 text-sm text-gray-400">
                            <p>大阪府知事登録旅行業第2-3115号</p>
                            <p>JATA 正会員</p>
                            <p>Authorized by Osaka Prefecture</p>
                        </div>
                    </div>
    
                    {/* Column 3: Contact */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6">{t.footer.contact_us}</h4>
                        <div className="space-y-3 text-sm text-gray-400">
                            <p className="flex items-center gap-3"><Mail size={16} /> info@niijima-koutsu.jp</p>
                            <p className="flex items-center gap-3"><Phone size={16} /> 06-6632-8807</p>
                            <p className="flex items-center gap-3"><Printer size={16} /> 06-6632-8826 (FAX)</p>
                            <p className="flex items-start gap-3 mt-4">
                                <MapPin size={16} className="mt-1 min-w-[16px]" />
                                <span>〒556-0014<br/>大阪府大阪市浪速区大国1-2-21-602</span>
                            </p>
                        </div>
                    </div>
    
                    {/* Column 4: Emergency / Direct */}
                    <div>
                        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Emergency / VIP Direct
                        </h4>
                        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                            <p className="text-xs text-gray-500 mb-2">代表直通 (24/7 Support)</p>
                            <p className="text-xl font-bold text-white tracking-wider mb-1">+81 70-2173-8304</p>
                            <p className="text-xs text-gray-500">Available for WeChat / WhatsApp</p>
                        </div>
                    </div>
                </div>
                
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                     <div className="flex gap-6">
                        <span className="hover:text-gray-300 cursor-pointer transition">Privacy Policy</span>
                        <span className="hover:text-gray-300 cursor-pointer transition">Terms of Service</span>
                     </div>
                     <div className="mt-4 md:mt-0">
                        Powered by Niijima AI System • Designed in Osaka
                     </div>
                </div>
            </div>
        </footer>

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
    </div>
  );
};

export default LandingPage;
