import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { translations, Language } from '../translations';
import { ArrowLeft, CheckCircle, MapPin, Building, Activity, Shield, Armchair, FileText, Check, Brain, Eye, Zap, Coffee, Globe, ChevronDown, Smile, Heart, Bus, Utensils, Quote } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

type PageView = 'home' | 'medical' | 'business';

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [scrolled, setScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('ja');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = translations[currentLang];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
             { code: 'en', label: 'English' },
             { code: 'ko', label: '한국어' },
             { code: 'de', label: 'Deutsch' }
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
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); }}>
          {/* Logo Container - Using text color #1a1a1a for the ink look */}
          <div className="w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <Logo className="w-full h-full text-[#1a1a1a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-serif tracking-widest text-gray-900 drop-shadow-sm font-semibold">SHINJIMA</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{t.nav.brand_sub}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 lg:space-x-12 text-sm font-medium text-gray-600 tracking-wider">
          <button onClick={() => setCurrentPage('medical')} className={`transition hover:text-black ${currentPage === 'medical' ? 'text-blue-600 font-bold' : ''}`}>{t.nav.timc}</button>
          
          {/* Golf Entry - Links to external static file */}
          <a href="golf.html" className="transition hover:text-green-700 flex items-center gap-1 group">
            <Activity size={14} className="text-green-600 group-hover:animate-bounce" />
            {t.nav.golf}
          </a>

          <button onClick={() => setCurrentPage('business')} className={`transition hover:text-black ${currentPage === 'business' ? 'text-blue-600 font-bold' : ''}`}>{t.nav.business}</button>
          <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="gemini-text font-bold relative group">
            {t.nav.ai}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] gemini-gradient transition-all group-hover:w-full"></span>
          </button>
          <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="hover:text-black transition">{t.nav.about}</button>
        </div>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <button 
            onClick={onLogin}
            className="hidden md:block text-xs border border-gray-800 px-6 py-2 rounded-full hover:bg-gray-800 hover:text-white transition duration-300 uppercase tracking-widest bg-white/50 backdrop-blur-sm"
          >
            {t.nav.login}
          </button>
        </div>
      </div>
    </nav>
  );

  // --- Sub-View: Medical Page (Detailed TIMC Info) ---
  const MedicalView = () => (
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
        
        {/* 2. Authority Section (Why TIMC?) */}
        <div className="mb-24">
            <div className="text-center mb-16">
                <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">Authority & Trust</span>
                <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.medical.auth_title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Building size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{t.medical.auth_1_t}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {t.medical.auth_1_d}
                    </p>
                </div>
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                    <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition">
                        <MapPin size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{t.medical.auth_2_t}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {t.medical.auth_2_d}
                    </p>
                </div>
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                    <div className="w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-800 group-hover:text-white transition">
                        <Shield size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{t.medical.auth_3_t}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                         {t.medical.auth_3_d}
                    </p>
                </div>
            </div>
        </div>

        {/* 3. Technology Section (Expanded to 6 Items) */}
        <div className="mb-24">
             <div className="text-center mb-16">
                <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">Advanced Equipment</span>
                <h3 className="text-3xl font-serif text-gray-900 mt-2 mb-4">{t.medical.tech_title}</h3>
                <p className="text-gray-500 text-sm max-w-3xl mx-auto">{t.medical.tech_sub}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                    { 
                        title: t.medical.tech_ct_t, 
                        desc: t.medical.tech_ct_d, 
                        img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
                        icon: <Zap className="text-yellow-500" />
                    },
                    { 
                        title: t.medical.tech_mri_t, 
                        desc: t.medical.tech_mri_d, 
                        img: "https://images.unsplash.com/photo-1579684385180-1ea55f9f7485?q=80&w=2000&auto=format&fit=crop",
                        icon: <Brain className="text-purple-500" />
                    },
                    { 
                        title: t.medical.tech_endo_t, 
                        desc: t.medical.tech_endo_d, 
                        img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
                        icon: <Eye className="text-green-500" />
                    },
                    { 
                        title: t.medical.tech_dental_t, 
                        desc: t.medical.tech_dental_d, 
                        img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop",
                        icon: <Smile className="text-blue-500" />
                    },
                    { 
                        title: t.medical.tech_echo_t, 
                        desc: t.medical.tech_echo_d, 
                        img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop",
                        icon: <Activity className="text-orange-500" />
                    },
                    { 
                        title: t.medical.tech_mammo_t, 
                        desc: t.medical.tech_mammo_d, 
                        img: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?q=80&w=2000&auto=format&fit=crop",
                        icon: <Heart className="text-pink-500" />
                    }
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-4 border-b border-gray-100 pb-8 last:border-0 md:last:border-0">
                        <div className="h-64 rounded-lg overflow-hidden group shadow-md">
                            <img src={item.img} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" alt={item.title} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                {item.icon}
                                <h4 className="text-xl font-bold text-gray-800">{item.title}</h4>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed text-justify">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 4. Experience Flow */}
        <div className="mb-24 bg-gray-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div>
             <div className="relative z-10 text-center mb-12">
                 <h3 className="text-3xl font-serif">{t.medical.flow_title}</h3>
                 <p className="text-gray-400 mt-2 text-sm">Experience the Flow</p>
             </div>
             
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
                 {[
                   { step: "01", title: t.medical.flow_1, desc: t.medical.flow_1_d, icon: <Building /> },
                   { step: "02", title: t.medical.flow_2, desc: t.medical.flow_2_d, icon: <Armchair /> },
                   { step: "03", title: t.medical.flow_3, desc: t.medical.flow_3_d, icon: <Activity /> },
                   { step: "04", title: t.medical.flow_4, desc: t.medical.flow_4_d, icon: <FileText /> },
                   { step: "05", title: t.medical.flow_5, desc: t.medical.flow_5_d, icon: <Coffee /> },
                 ].map((item, idx) => (
                   <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition group">
                      <div className="text-blue-400 font-mono text-xl mb-4 opacity-50">{item.step}</div>
                      <div className="flex justify-center mb-4 text-white opacity-80 group-hover:scale-110 transition">{item.icon}</div>
                      <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                   </div>
                 ))}
             </div>
        </div>

        {/* 5. Packages */}
        <div className="mb-24">
            <div className="text-center mb-16">
                <h3 className="text-3xl font-serif text-gray-900">{t.medical.pkg_title}</h3>
                <p className="text-gray-500 text-sm mt-2">Recommended Courses</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Premium */}
                <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition hover:-translate-y-1 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                    <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">Premium</div>
                    <h4 className="text-2xl font-serif font-bold text-gray-900 mb-2">{t.medical.pkg_p_t}</h4>
                    <p className="text-sm text-gray-500 mb-6 italic">{t.medical.pkg_p_d}</p>
                    <div className="space-y-3 mb-8">
                        {['PET-CT', 'MRI/MRA', 'Tumor Markers', 'Endoscopy (Sedation)', 'Blood Work'].map(item => (
                            <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle size={16} className="text-blue-600" /> {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Standard */}
                <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition hover:-translate-y-1 bg-white">
                     <h4 className="text-2xl font-serif font-bold text-gray-900 mb-2">{t.medical.pkg_s_t}</h4>
                    <p className="text-sm text-gray-500 mb-6 italic">{t.medical.pkg_s_d}</p>
                    <div className="space-y-3 mb-8">
                        {['PET-CT', 'Tumor Markers', 'Blood Work'].map(item => (
                            <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle size={16} className="text-gray-400" /> {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* 6. CTA */}
        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-200">
            <h3 className="text-3xl md:text-4xl font-serif mb-6">{t.medical.cta_title}</h3>
            <p className="text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
                {t.medical.cta_text}
            </p>
            <button 
                onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'}), 100); }}
                className="bg-white text-blue-800 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition shadow-lg inline-flex items-center gap-2"
            >
                <Zap size={18} />
                {t.medical.cta_btn}
            </button>
        </div>

      </div>
      
      <div className="text-center py-12 pb-24 border-t border-gray-100 mt-20">
        <button onClick={() => setCurrentPage('home')} className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
           <ArrowLeft size={16} /> {t.about.back}
        </button>
      </div>
    </div>
  );

  // --- Sub-View: Business Page ---
  const BusinessView = () => (
    <div className="animate-fade-in-up pt-24 min-h-screen bg-[#F5F5F7]">
      <div className="bg-gray-900 py-20 relative overflow-hidden text-white">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
        <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="text-purple-400 text-xs tracking-[0.3em] uppercase font-bold">{t.business.hero_tag}</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">{t.business.hero_title}</h1>
            <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed whitespace-pre-line">
               {t.business.hero_text}
            </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Themes Grid */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-12 -mt-24 relative z-20">
           <h3 className="text-2xl font-serif mb-8 text-center border-b pb-4">{t.business.themes_title}</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition">
                    <Building className="text-blue-600" />
                 </div>
                 <h4 className="font-bold text-gray-800 mb-2">{t.business.theme_1_t}</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   {t.business.theme_1_d}
                 </p>
              </div>
              <div className="text-center group">
                 <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition">
                    <Activity className="text-green-600" />
                 </div>
                 <h4 className="font-bold text-gray-800 mb-2">{t.business.theme_2_t}</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   {t.business.theme_2_d}
                 </p>
              </div>
              <div className="text-center group">
                 <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition">
                    <MapPin className="text-purple-600" />
                 </div>
                 <h4 className="font-bold text-gray-800 mb-2">{t.business.theme_3_t}</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   {t.business.theme_3_d}
                 </p>
              </div>
           </div>
        </div>

        {/* --- Process Flow Section --- */}
        <div className="max-w-6xl mx-auto mt-24 mb-16">
            <div className="text-center mb-16">
                <h3 className="text-2xl font-serif text-gray-900">{t.business.process_title}</h3>
                <p className="text-gray-500 text-sm mt-4">{t.business.process_sub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative px-4 md:px-0">
                {/* Steps */}
                {[
                  { id: 1, title: t.business.step_1_t, desc: t.business.step_1_d },
                  { id: 2, title: t.business.step_2_t, desc: t.business.step_2_d },
                  { id: 3, title: t.business.step_3_t, desc: t.business.step_3_d },
                  { id: 4, title: t.business.step_4_t, desc: t.business.step_4_d },
                  { id: 5, title: t.business.step_5_t, desc: t.business.step_5_d, icon: true },
                ].map((step, idx) => (
                   <div key={idx} className="relative text-center md:text-left z-10 group">
                      {idx < 4 && <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 shadow-lg group-hover:scale-110 transition ${step.icon ? 'bg-green-500 text-white' : 'bg-white border-2 border-blue-600 text-blue-600'}`}>
                        {step.icon ? <Check size={20} /> : step.id}
                      </div>
                      <h4 className="text-lg font-bold mb-3 text-gray-800">{step.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                          {step.desc}
                      </p>
                   </div>
                ))}
            </div>
        </div>

        {/* --- Itinerary Section --- */}
        <section id="itinerary" className="py-24 bg-white rounded-3xl mt-24">
            <div className="px-6">
                <div className="text-center mb-16">
                    <span className="text-blue-600 text-xs tracking-[0.2em] uppercase font-bold">Exclusive Business Tour</span>
                    <h2 className="text-3xl md:text-4xl font-serif mt-4 mb-6">{t.business.itin_title}</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto whitespace-pre-line">
                        {t.business.itin_desc}
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto mb-24">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 hidden md:block"></div>

                    {[
                        { day: 'Day 01', title: t.business.itin_day1_t, desc: t.business.itin_day1_d, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" },
                        { day: 'Day 02', title: t.business.itin_day2_t, desc: t.business.itin_day2_d, img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" },
                        { day: 'Day 03', title: t.business.itin_day3_t, desc: t.business.itin_day3_d, img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2000&auto=format&fit=crop" },
                        { day: 'Day 04', title: t.business.itin_day4_t, desc: t.business.itin_day4_d, img: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop" },
                        { day: 'Day 05', title: t.business.itin_day5_t, desc: t.business.itin_day5_d, img: "https://images.unsplash.com/photo-1558257409-54157740f900?q=80&w=2000&auto=format&fit=crop" }
                    ].map((item, idx) => (
                        <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-16 relative`}>
                            <div className={`md:w-1/2 p-6 ${idx % 2 === 0 ? 'text-right md:pr-12' : 'text-left md:pl-12'}`}>
                                <span className="text-blue-600 font-bold text-lg block mb-2">{item.day}</span>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                                    {item.desc}
                                </p>
                            </div>
                            <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full shadow hidden md:block ${idx % 2 === 0 ? 'bg-blue-600 border-4 border-white' : 'bg-white border-4 border-blue-600'}`}></div>
                            <div className={`md:w-1/2 p-6 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                                <img src={item.img} className="rounded-lg shadow-lg w-full h-48 object-cover hover:scale-105 transition duration-500" alt={item.title} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-serif text-gray-900">{t.business.std_title}</h3>
                        <p className="text-gray-500 text-sm mt-2">{t.business.std_sub}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1678735314088-77114b3d7350?q=80&w=2000&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Luxury Bus Interior" />
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center"><Bus className="text-blue-600 mr-2" size={18} /> {t.business.std_1_t}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {t.business.std_1_d}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Luxury Hotel Lobby" />
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center"><Building className="text-blue-600 mr-2" size={18} /> {t.business.std_2_t}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {t.business.std_2_d}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=2000&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Kaiseki Dining" />
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center"><Utensils className="text-blue-600 mr-2" size={18} /> {t.business.std_3_t}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {t.business.std_3_d}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <div className="mt-16 text-center">
           <h3 className="text-xl font-bold text-gray-800 mb-6">{t.business.support_title}</h3>
           <div className="flex flex-wrap justify-center gap-4">
              {t.business.supports.map((s, i) => (
                <span key={i} className="px-4 py-2 bg-white rounded shadow text-sm text-gray-600">{s}</span>
              ))}
           </div>
        </div>
      </div>
      
      <div className="text-center py-12 pb-24">
        <button onClick={() => setCurrentPage('home')} className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
           <ArrowLeft size={16} /> {t.about.back}
        </button>
      </div>
    </div>
  );

  // --- Main Home View ---
  const HomeView = () => (
    <div className="bg-[#FAFAFA]">
      {/* Hero Header */}
      <header className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?q=80&w=2070&auto=format&fit=crop" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 animate-kenburns-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/60"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col justify-center items-center h-full">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-600 mb-6 animate-fade-in-up">
            {t.hero.partner}
          </p>
          <h1 className="text-4xl md:text-7xl font-serif text-gray-800 leading-tight mb-8 drop-shadow-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {t.hero.title_1}<br />
            <span className="italic font-light">{t.hero.title_2}</span>{t.hero.title_3}
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto leading-relaxed text-sm md:text-base font-light animate-fade-in-up whitespace-pre-line" style={{animationDelay: '0.4s'}}>
            {t.hero.subtitle}
          </p>
          <div className="mt-12 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <button onClick={() => { document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'}) }} className="inline-flex items-center gap-2 text-sm border-b border-gray-800 pb-1 hover:text-blue-600 hover:border-blue-600 transition group">
              {t.hero.explore} 
              <ArrowLeft className="rotate-180" size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Medical Preview Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 image-card shadow-xl cursor-pointer rounded-2xl" onClick={() => setCurrentPage('medical')}>
              {/* TIMC Lobby Lookalike */}
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
                onClick={onLogin}
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
              { label: t.about.name, value: '新島交通株式会社 (SHINJIMA KOTSU Co., Ltd.)' },
              { label: t.about.est, value: '2020/02' },
              { label: t.about.rep, value: 'Yun Hao' },
              { label: t.about.loc, value: '〒556-0014 大阪府大阪市浪速区大国1-2-21-602' },
              { label: t.about.client, value: '大阪中央高級医療センター (TIMC)\nBooking.com / Agoda Partner Network' },
              { label: t.about.lic, value: '大阪府知事登録旅行業第2-3115号' },
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

  return (
    <div className="font-sans text-gray-900">
      <Navbar />
      {currentPage === 'home' && <HomeView />}
      {currentPage === 'medical' && <MedicalView />}
      {currentPage === 'business' && <BusinessView />}
    </div>
  );
};

export default LandingPage;