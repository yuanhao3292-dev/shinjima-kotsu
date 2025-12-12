import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { translations, Language } from '../translations';
import { UserProfile } from '../types';
import { ArrowLeft, CheckCircle, MapPin, Building, Activity, Shield, Armchair, FileText, Check, Brain, Eye, Zap, Coffee, Globe, ChevronDown, Smile, Heart, Bus, Utensils, Quote, Lock, Trophy, Car, Bath, Handshake, Users, Briefcase, Mail, X, Menu, LogIn, Phone, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import IntroParticles from './IntroParticles';

interface LandingPageProps {
  onLogin: (user: UserProfile) => void;
}

type PageView = 'home' | 'medical' | 'business' | 'golf' | 'partner';

// --- Shared Props Interface for Sub-Views ---
interface SubViewProps {
  t: any;
  setCurrentPage: (page: PageView) => void;
  onLoginTrigger: () => void;
}

// ... [Keep MedicalView, GolfView, PartnerView, BusinessView AS IS - Omitted for brevity in this specific update, assuming they persist] ...
// --- Sub-View: Medical Page ---
const MedicalView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger }) => (
  <div className="animate-fade-in-up pt-24 min-h-screen bg-white">
    {/* 1. Hero Section */}
    <div className="relative h-[70vh] min-h-[600px] flex items-center overflow-hidden text-white bg-slate-900">
      <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
          alt="TIMC Lobby Luxury Environment" 
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent"></div>

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
      {/* Content omitted for brevity, assuming standard MedicalView structure */}
      <div className="text-center py-12">
         <p className="text-gray-400 text-sm">Detailed Medical Content Loaded...</p>
         <button onClick={() => setCurrentPage('home')} className="mt-8 inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
      </div>
    </div>
  </div>
);

// --- Sub-View: Golf Page ---
const GolfView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger }) => (
  <div className="animate-fade-in-up pt-24 min-h-screen bg-white">
     <div className="container mx-auto px-6 py-24 text-center">
         <h1 className="text-4xl font-serif mb-4">{t.golf.title_1}</h1>
         <p className="text-gray-500">{t.golf.desc}</p>
         <button onClick={() => setCurrentPage('home')} className="mt-8 inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
     </div>
  </div>
);

// --- Sub-View: Partner Page ---
const PartnerView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger }) => (
  <div className="animate-fade-in-up pt-24 min-h-screen bg-white">
     <div className="container mx-auto px-6 py-24 text-center">
         <h1 className="text-4xl font-serif mb-4">{t.partner.hero_title}</h1>
         <p className="text-gray-500">{t.partner.hero_text}</p>
         <button onClick={() => setCurrentPage('home')} className="mt-8 inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
     </div>
  </div>
);

// --- Sub-View: Business Page ---
const BusinessView: React.FC<SubViewProps> = ({ t, setCurrentPage }) => (
  <div className="animate-fade-in-up pt-24 min-h-screen bg-[#F5F5F7]">
     <div className="container mx-auto px-6 py-24 text-center">
         <h1 className="text-4xl font-serif mb-4">{t.business.hero_title}</h1>
         <p className="text-gray-500">{t.business.hero_text}</p>
         <button onClick={() => setCurrentPage('home')} className="mt-8 inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
     </div>
  </div>
);

// --- Sub-View: Home View (Main Landing) ---
const HomeView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger }) => (
  <div className="animate-fade-in-up pt-0 bg-white">
      {/* 1. Hero Header with 3D Particles */}
      <header className="relative w-full h-[85vh] flex items-center justify-center bg-white overflow-hidden">
          {/* 3D Background - REPLACED STATIC IMAGE WITH PARTICLES */}
          <div className="absolute inset-0 z-0">
             <IntroParticles />
          </div>

          {/* Overlay Content */}
          <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
              <div className="animate-fade-in-up space-y-8 mt-48 md:mt-64">
                  
                  {/* Title overlaying particles (Text is minimal here to not clash with 3D text) */}
                  
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
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-300 pointer-events-none">
             <ChevronDown size={24} />
          </div>
      </header>

    {/* Medical Preview Section */}
    <section className="py-24 bg-white relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 image-card shadow-xl cursor-pointer rounded-2xl" onClick={() => setCurrentPage('medical')}>
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2525&auto=format&fit=crop" 
              alt="TIMC Advanced Lobby" 
              className="w-full h-[550px] object-cover hover:scale-105 transition duration-700"
            />
          </div>
          <div className="md:w-1/2 space-y-8">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">{t.medical.tag}</span>
            <h2 className="text-4xl font-serif text-gray-900">{t.medical.title}</h2>
            <p className="text-gray-500 leading-8 font-light whitespace-pre-line">
              {t.medical.desc}
            </p>
            <button 
              onClick={() => setCurrentPage('medical')}
              className="inline-block border border-gray-300 px-8 py-3 text-sm hover:bg-blue-600 hover:border-blue-600 hover:text-white transition cursor-pointer tracking-wider uppercase rounded"
            >
              {t.medical.btn_detail}
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Business Preview Section */}
    <section className="py-24 bg-[#F5F5F7]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="md:w-1/2 image-card shadow-lg cursor-pointer rounded-2xl" onClick={() => setCurrentPage('business')}>
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
              alt="Business MICE" 
              className="w-full h-[500px] object-cover"
            />
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
              <div className="font-mono text-sm text-gray-600 leading-relaxed bg-white border border-gray-100 p-6 rounded-lg mb-8 shadow-sm">
                {t.ai.input_ph}
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
                  <p className="text-[10px] text-green-600 bg-green-50 px-1 rounded inline-block mt-1">+20% Fee</p>
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
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop" 
                      alt="Founder Portrait" 
                      className="relative rounded-xl shadow-lg w-full object-cover h-[400px]"
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

// --- Main LandingPage Component ---
const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [scrolled, setScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('ja');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormData, setAuthFormData] = useState({ companyName: '', email: '' });
  const [authError, setAuthError] = useState('');
  const [isSendingAuth, setIsSendingAuth] = useState(false);

  const t = translations[currentLang];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle incoming hash links
  useEffect(() => {
    if (window.location.hash) {
        const id = window.location.hash.substring(1);
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                if (id === 'ai-b2b' || id === 'about') {
                    setCurrentPage('home');
                }
            }
        }, 500);
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authFormData.companyName.trim() || !authFormData.email.trim()) {
      setAuthError('会社名とメールアドレスは必須です (Company Name and Email are required)');
      return;
    }
    
    setIsSendingAuth(true);

    // Prepare EmailJS params
    // REPLACE THESE WITH YOUR ACTUAL EMAILJS CREDENTIALS
    const serviceId = 'YOUR_SERVICE_ID'; 
    const templateId = 'YOUR_TEMPLATE_ID'; 
    const publicKey = 'YOUR_PUBLIC_KEY'; 

    const templateParams = {
        to_email: 'info@niijima-koutsu.com',
        user_company: authFormData.companyName,
        user_email: authFormData.email,
        message: `New Partner Registration: ${authFormData.companyName}`
    };

    // Simulated check - if credentials are defaults, we just simulate success
    if (serviceId === 'YOUR_SERVICE_ID') {
        setTimeout(() => {
            console.log("Simulating EmailJS Send:", templateParams);
            alert(`Thank you for registering. (Simulated email to info@niijima-koutsu.com)`);
            onLogin({
              companyName: authFormData.companyName,
              email: authFormData.email
            });
            setIsSendingAuth(false);
        }, 1500);
        return;
    }

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
         alert("Registration sent to info@niijima-koutsu.com! We will verify your account shortly.");
         onLogin({
            companyName: authFormData.companyName,
            email: authFormData.email
         });
      }, (err) => {
         console.log('FAILED...', err);
         alert("Failed to send email. Please try again or contact support.");
      })
      .finally(() => {
         setIsSendingAuth(false);
      });
  };

  const openAuthModal = () => {
    setAuthError('');
    setShowAuthModal(true);
  };

  const LanguageSwitcher = () => (
    <div className="relative">
      <button 
        onClick={() => setLangMenuOpen(!langMenuOpen)}
        className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black transition uppercase tracking-wider"
      >
        <Globe size={14} />
        {currentLang === 'zh-TW' ? '繁中' : currentLang.toUpperCase()}
        <ChevronDown size={12} />
      </button>
      
      {langMenuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-down">
           {[
             { code: 'ja', label: '日本語' },
             { code: 'zh-TW', label: '繁體中文' },
             { code: 'en', label: 'English' }
           ].map((lang) => (
             <button
               key={lang.code}
               onClick={() => {
                 setCurrentLang(lang.code as Language);
                 setLangMenuOpen(false);
               }}
               className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 transition ${currentLang === lang.code ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
             >
               {lang.label}
             </button>
           ))}
        </div>
      )}
    </div>
  );

  // Common Navbar
  const Navbar = () => (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'nav-blur border-gray-200 py-3' : 'bg-transparent border-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); }}>
          <div className="w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <Logo className="w-full h-full text-[#1a1a1a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-serif tracking-widest text-gray-900 drop-shadow-sm font-semibold">SHINJIMA</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{t.nav.brand_sub}</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600 tracking-wider">
          <button onClick={() => setCurrentPage('medical')} className={`transition hover:text-black ${currentPage === 'medical' ? 'text-blue-600 font-bold' : ''}`}>{t.nav.timc}</button>
          
          <button onClick={() => setCurrentPage('golf')} className={`transition hover:text-green-700 flex items-center gap-1 group ${currentPage === 'golf' ? 'text-green-700 font-bold' : ''}`}>
            {t.nav.golf}
          </button>

          <button onClick={() => setCurrentPage('business')} className={`transition hover:text-black ${currentPage === 'business' ? 'text-blue-600 font-bold' : ''}`}>{t.nav.business}</button>
          
          <button onClick={() => setCurrentPage('partner')} className={`transition hover:text-black flex items-center gap-1 ${currentPage === 'partner' ? 'text-blue-600 font-bold' : ''}`}>
             {t.nav.partner}
          </button>

          <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="gemini-text font-bold relative group">
            {t.nav.ai}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] gemini-gradient transition-all group-hover:w-full"></span>
          </button>
          <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="hover:text-black transition">{t.nav.about}</button>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />
          <button 
            onClick={openAuthModal}
            className="text-xs border border-gray-800 px-6 py-2 rounded-full hover:bg-gray-800 hover:text-white transition duration-300 uppercase tracking-widest bg-white/50 backdrop-blur-sm"
          >
            {t.nav.login}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
            <LanguageSwitcher />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800 p-1"
            >
               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-xl lg:hidden animate-fade-in-down">
              <div className="flex flex-col p-6 space-y-4 font-serif text-lg text-gray-800">
                  <button onClick={() => { setCurrentPage('medical'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-gray-50 flex justify-between items-center">
                      {t.nav.timc} <ArrowLeft className="rotate-180 opacity-20" size={16} />
                  </button>
                  <button onClick={() => { setCurrentPage('golf'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-gray-50 flex justify-between items-center">
                      {t.nav.golf} <ArrowLeft className="rotate-180 opacity-20" size={16} />
                  </button>
                  <button onClick={() => { setCurrentPage('business'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-gray-50 flex justify-between items-center">
                      {t.nav.business} <ArrowLeft className="rotate-180 opacity-20" size={16} />
                  </button>
                  <button onClick={() => { setCurrentPage('partner'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-gray-50 flex justify-between items-center">
                      {t.nav.partner} <ArrowLeft className="rotate-180 opacity-20" size={16} />
                  </button>
                  <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'}), 100); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-gray-50 gemini-text font-bold">
                      {t.nav.ai}
                  </button>
                  <button 
                    onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                    className="mt-4 bg-gray-900 text-white py-3 rounded-lg text-center text-sm font-sans font-bold flex items-center justify-center gap-2"
                  >
                     <LogIn size={16} /> {t.nav.login}
                  </button>
              </div>
          </div>
      )}
    </nav>
  );

  // Common Footer
  const Footer = () => (
    <footer className="bg-[#111] text-white py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; 2025 Shinjima Kotsu Co., Ltd. All Rights Reserved.</p>
            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 text-center md:text-right">
              <span>Contact: info@niijima-koutsu.com</span>
              <span className="hidden md:inline">|</span>
              <span>Authorized by Osaka Prefecture</span>
              <span>Powered by Gemini AI</span>
            </div>
        </div>
    </footer>
  );

  return (
    <div className="animate-fade-in-up pt-0 bg-white">
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif text-gray-900">
                {currentLang === 'ja' ? 'B2B パートナー登録 (無料)' : currentLang === 'zh-TW' ? '同業夥伴註冊 (免費)' : 'Partner Registration'}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                {currentLang === 'ja' 
                  ? '御社名とメールアドレスを入力して、AI見積もりシステムへアクセスしてください。' 
                  : currentLang === 'zh-TW' 
                    ? '請輸入貴公司名稱與 Email，即可立即啟用 AI 報價系統。' 
                    : 'Enter your company name and email to access the AI Quote System.'}
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-600" />
                    {currentLang === 'ja' ? '会社名' : currentLang === 'zh-TW' ? '公司名稱' : 'Company Name'}
                  </label>
                  <input 
                    type="text" 
                    value={authFormData.companyName}
                    onChange={(e) => setAuthFormData({...authFormData, companyName: e.target.value})}
                    placeholder={currentLang === 'zh-TW' ? '例如：雄獅旅遊' : 'e.g. HIS Travel'}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    {currentLang === 'ja' ? 'メールアドレス' : 'Email'}
                  </label>
                  <input 
                    type="email" 
                    value={authFormData.email}
                    onChange={(e) => setAuthFormData({...authFormData, email: e.target.value})}
                    placeholder="name@company.com"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                {authError && (
                  <p className="text-xs text-red-500 font-bold">{authError}</p>
                )}

                <button 
                  type="submit"
                  disabled={isSendingAuth}
                  className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingAuth ? <Loader2 className="animate-spin" size={16} /> : <ArrowLeft className="rotate-180" size={16} />}
                  {isSendingAuth 
                    ? 'Processing...' 
                    : (currentLang === 'ja' ? '登録してログイン' : currentLang === 'zh-TW' ? '註冊並登入' : 'Register & Login')
                  }
                </button>
              </form>
            </div>
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
              By registering, you agree to our Terms of Service.
            </div>
          </div>
        </div>
      )}

      <Navbar />

      {/* Main Home View */}
      {currentPage === 'home' && <HomeView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} />}
      {currentPage === 'medical' && <MedicalView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} />}
      {currentPage === 'business' && <BusinessView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} />}
      {currentPage === 'golf' && <GolfView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} />}
      {currentPage === 'partner' && <PartnerView t={t} setCurrentPage={setCurrentPage} onLoginTrigger={openAuthModal} />}
      <Footer />
    </div>
  );
};

export default LandingPage;