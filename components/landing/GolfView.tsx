'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, MapPin, Building, Lock, Trophy, Car, Bath, MessageSquare } from 'lucide-react';
import ContactButtons from '../ContactButtons';
import type { SubViewProps } from './types';

const GolfView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, currentLang, getImage }) => {
  // State for database images (starts empty, merged after API fetch)
  const [dbImages, setDbImages] = useState<Record<string, string>>({});

  // Fetch images from API (database) on mount
  useEffect(() => {
    fetch('/api/golf-plan-images')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setDbImages(data);
        }
      })
      .catch(err => {
        console.warn('Failed to fetch golf plan images from API:', err);
      });
  }, []);

  // 获取方案图片：DB > 空（显示骨架屏）
  const getPlanImage = (id: string): string => {
    return dbImages[id] || '';
  };

  // 合作球场数据 — 从翻译数据获取
  const partnerCourses = (t.golf as any).partnerCourses || [
    { name: '六甲国際ゴルフ倶楽部', region: '兵庫', rank: '名門', url: 'http://rokkokokusai-kobe.jp/' },
    { name: 'ABCゴルフ倶楽部', region: '兵庫', rank: '名門', url: 'https://abc-golf.co.jp/' },
    { name: '太平洋クラブ御殿場コース', region: '静岡', rank: '名門', url: 'https://www.taiheiyoclub.co.jp/course/gotenba/' },
    { name: '有馬ロイヤルゴルフクラブ', region: '兵庫', rank: '名門', url: 'https://arima-royal.com/' },
    { name: 'ゴールデンバレーゴルフ倶楽部', region: '兵庫', rank: '名門', url: 'https://www.gvgc.jp/' },
    { name: '富士桜カントリー倶楽部', region: '山梨', rank: '名門', url: 'https://www.fujizakura-cc.jp/' },
  ];

  // 统计数据 — 仅使用可验证的事实
  const stats = [
    { value: '25+', label: t.golf.stat_courses || '提携名門コース', sublabel: currentLang === 'zh-TW' ? '頂級球場' : currentLang === 'zh-CN' ? '顶级球场' : currentLang === 'ja' ? 'プレミアムコース' : 'Premium Courses' },
    { value: '7', label: currentLang === 'zh-TW' ? '地區覆蓋' : currentLang === 'zh-CN' ? '地区覆盖' : currentLang === 'ja' ? '対応エリア' : 'Regions', sublabel: currentLang === 'zh-TW' ? '遍佈日本' : currentLang === 'zh-CN' ? '遍布日本' : currentLang === 'ja' ? '日本全国' : 'Across Japan' },
    { value: 'VIP', label: currentLang === 'zh-TW' ? '專屬待遇' : currentLang === 'zh-CN' ? '专属待遇' : currentLang === 'ja' ? '専用サービス' : 'Exclusive Service', sublabel: currentLang === 'zh-TW' ? '會員專屬通道' : currentLang === 'zh-CN' ? '会员专属通道' : currentLang === 'ja' ? '会員限定アクセス' : 'Members Only Access' },
    { value: '2020', label: currentLang === 'zh-TW' ? '公司成立' : currentLang === 'zh-CN' ? '公司成立' : currentLang === 'ja' ? '会社設立' : 'Established', sublabel: currentLang === 'ja' ? '大阪' : 'Osaka, Japan' },
  ];

  return (
  <div className="animate-fade-in-up min-h-screen bg-neutral-50">
     {/* 1. Hero Section - Cancer Treatment style */}
     <section className="relative min-h-screen flex items-center bg-brand-900 overflow-hidden">
       <div className="absolute inset-0">
         {getImage('golf_hero') ? (
           <Image
             src={getImage('golf_hero')}
             fill
             className="object-cover object-center"
             alt="Premium Golf Course Japan"
             sizes="100vw"
             quality={75}
             priority
           />
         ) : (
           <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950 animate-pulse" />
         )}
         <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/85 to-brand-900/70"></div>
       </div>
       {/* Decorative Elements */}
       <div className="absolute inset-0 pointer-events-none">
         <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
         <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
       </div>
       <div className="container mx-auto px-6 relative z-10 py-32">
         <div className="max-w-4xl">
           <div className="flex items-center gap-3 mb-8">
             <div className="h-[1px] w-12 bg-gold-400"></div>
             <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">{currentLang === 'zh-TW' ? '頂級高爾夫' : currentLang === 'zh-CN' ? '顶级高尔夫' : currentLang === 'ja' ? 'プレミアムゴルフ' : 'PREMIUM GOLF'}</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
             {t.golf.title_1}
             <br />
             <span className="text-gold-400">{t.golf.title_2}</span>
           </h1>
           <p className="text-xl text-neutral-300 mb-8 leading-relaxed font-light max-w-2xl whitespace-pre-line">
             {t.golf.desc}
           </p>
           <div className="flex flex-wrap gap-4">
             <a
               href="#golf-plans"
               className="inline-flex items-center px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium tracking-wider hover:bg-gold-300 transition-colors"
             >
               {t.golf.btn_tour || 'View Itineraries'}
             </a>
             <a
               href="#golf-contact"
               className="inline-flex items-center px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm tracking-wider hover:bg-white/20 transition-colors"
             >
               <MessageSquare size={20} />
               {currentLang === 'zh-TW' ? '諮詢預約' : currentLang === 'zh-CN' ? '咨询预约' : currentLang === 'ja' ? 'お問い合わせ' : 'Contact Us'}
             </a>
           </div>
         </div>
       </div>
     </section>

     {/* ===== STATS BAR - Floating ===== */}
     <div className="relative -mt-20 z-20 container mx-auto px-6 py-12 md:py-24">
       <div className="golf-glass rounded-2xl p-8 shadow-2xl">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
           {stats.map((stat, i) => (
             <div key={i} className="golf-stat-card text-center p-4 rounded-xl hover:bg-brand-50/50 transition-all duration-500">
               <div className="text-2xl md:text-4xl lg:text-5xl font-bold golf-gold-text mb-2">{stat.value}</div>
               <div className="text-sm font-bold text-neutral-800">{stat.label}</div>
               <div className="text-xs text-neutral-400 mt-1">{stat.sublabel}</div>
             </div>
           ))}
         </div>
       </div>
     </div>

     {/* ===== BRAND STANDARD SECTION ===== */}
     <div className="py-24 bg-gradient-to-b from-neutral-50 to-white">
       <div className="container mx-auto px-6 py-12 md:py-24">
         {/* Section Header */}
         <div className="text-center mb-16">
           <div className="inline-flex items-center gap-4 mb-4">
             <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold-400"></div>
             <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-bold">{t.golf.std_title}</span>
             <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold-400"></div>
           </div>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-neutral-900 golf-title-decorated">
             {currentLang === 'zh-TW' ? '為什麼選擇新島高爾夫？' : currentLang === 'zh-CN' ? '为什么选择新岛高尔夫？' : currentLang === 'ja' ? 'なぜ新島ゴルフ？' : 'Why Choose Niijima Golf?'}
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
                    ${item.accent === 'emerald' ? 'bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white' : ''}
                    ${item.accent === 'amber' ? 'bg-gold-50 text-gold-600 group-hover:bg-gold-600 group-hover:text-white' : ''}
                    ${item.accent === 'slate' ? 'bg-neutral-100 text-neutral-600 group-hover:bg-brand-700 group-hover:text-white' : ''}
                    ${item.accent === 'orange' ? 'bg-gold-50 text-gold-500 group-hover:bg-gold-500 group-hover:text-white' : ''}
                  `}>
                    {item.icon}
                  </div>
                  {/* Gold top border on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
                  <h3 className="font-bold text-xl mb-4 font-serif text-neutral-900">{item.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
               </div>
             ))}
         </div>
       </div>
     </div>

     {/* ===== PARTNER COURSES SHOWCASE ===== */}
     <div className="py-20 bg-brand-900 relative overflow-hidden">
       {/* Background Pattern */}
       <div className="absolute inset-0 opacity-5">
         <div className="absolute inset-0" style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
         }}></div>
       </div>

       <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
         <div className="text-center mb-12">
           <div className="inline-flex items-center gap-4 mb-4">
             <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold-400"></div>
             <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-bold">{currentLang === 'zh-TW' ? '合作球場' : currentLang === 'zh-CN' ? '合作球场' : currentLang === 'ja' ? '提携コース' : 'Partner Courses'}</span>
             <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold-400"></div>
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
               className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-gold-400/30 transition-all duration-500 cursor-pointer block"
             >
               <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <MapPin size={20} className="text-gold-400" />
               </div>
               <h4 className="text-white font-bold text-sm mb-1 group-hover:text-gold-300 transition-colors">{course.name}</h4>
               <p className="text-white/50 text-xs mb-2">{course.region}</p>
               <span className="inline-block text-[10px] px-2 py-1 bg-gold-400/20 text-gold-300 rounded-full">{course.rank}</span>
               {/* External link indicator */}
               <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[10px] text-gold-400/70 flex items-center justify-center gap-1">
                   {currentLang === 'zh-TW' ? '官方網站' : currentLang === 'zh-CN' ? '官方网站' : currentLang === 'ja' ? '公式サイト' : 'Official Site'} <ArrowRight size={10} />
                 </span>
               </div>
             </a>
           ))}
         </div>

         {/* More Courses Hint */}
         <div className="text-center mt-8">
           <span className="text-white/40 text-sm">{currentLang === 'zh-TW' ? '...以及日本各地 20+ 座頂級球場' : currentLang === 'zh-CN' ? '...以及日本各地 20+ 座顶级球场' : currentLang === 'ja' ? '...ほか日本全国20以上の名門コース' : '...and 20+ more exclusive courses across Japan'}</span>
         </div>
       </div>
     </div>

     {/* ===== RECOMMENDED ITINERARIES ===== */}
     <div id="golf-plans" className="py-24 bg-white">
       <div className="container mx-auto px-6 py-12 md:py-24">
         {/* Section Header */}
         <div className="text-center mb-20">
           <div className="inline-flex items-center gap-4 mb-4">
             <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold-400"></div>
             <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-bold">{(t.golf as any).plans_section_label || (currentLang === 'zh-TW' ? '精選行程' : currentLang === 'zh-CN' ? '精选行程' : currentLang === 'ja' ? '厳選プラン' : 'Signature Itineraries')}</span>
             <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold-400"></div>
           </div>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-neutral-900 mb-4">{(t.golf as any).plans_section_title || (currentLang === 'zh-TW' ? '推薦行程' : currentLang === 'zh-CN' ? '推荐行程' : currentLang === 'ja' ? 'おすすめプラン' : 'Recommended Itineraries')}</h2>
           <p className="text-neutral-500 max-w-xl mx-auto">{(t.golf as any).plans_section_subtitle || (currentLang === 'zh-TW' ? '為鑑賞家精心策劃的高爾夫體驗' : currentLang === 'zh-CN' ? '为鉴赏家精心策划的高尔夫体验' : currentLang === 'ja' ? '目の肥えたゴルファーのための厳選体験' : 'Curated experiences for discerning golfers')}</p>
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
                        <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-gold-400/60 rounded-tl-lg z-10"></div>
                        <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-gold-400/60 rounded-br-lg z-10"></div>

                        {/* Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] lg:h-[500px] bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200">
                           {getPlanImage(plan.id) ? (
                             <Image
                                src={getPlanImage(plan.id)}
                                fill
                                className="object-cover transform group-hover:scale-105 transition duration-1000"
                                alt={plan.title}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                quality={75}
                                priority={index < 2}
                             />
                           ) : (
                             <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse flex items-center justify-center">
                               <div className="w-12 h-12 border-2 border-neutral-300 border-t-brand-500 rounded-full animate-spin" />
                             </div>
                           )}
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
                             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
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
                        <div className="flex-grow h-px bg-gradient-to-r from-gold-400/50 to-transparent"></div>
                     </div>

                     <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-3 leading-tight">{plan.title}</h3>
                     <h4 className="text-lg text-gold-600 mb-6 font-medium">{plan.subtitle}</h4>
                     <p className="text-neutral-600 leading-relaxed mb-10 text-lg">{plan.desc}</p>

                     {/* Schedule Card - Premium Style */}
                     <div className="golf-luxury-card rounded-2xl p-8 mb-10">
                        {/* Hotel Info */}
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
                           <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                             <Building size={18} className="text-brand-600" />
                           </div>
                           <div>
                             <span className="text-xs text-neutral-400 uppercase tracking-wider">{currentLang === 'zh-TW' ? '住宿' : currentLang === 'zh-CN' ? '住宿' : currentLang === 'ja' ? '宿泊' : 'Accommodation'}</span>
                             <p className="text-neutral-900 font-bold">{plan.hotel}</p>
                           </div>
                        </div>

                        {/* Schedule Timeline */}
                        <div className="space-y-4">
                           {plan.schedule.map((day: any, dIndex: number) => (
                              <div key={dIndex} className="flex gap-4 group">
                                 <div className="flex flex-col items-center">
                                   <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                     {dIndex + 1}
                                   </span>
                                   {dIndex < plan.schedule.length - 1 && (
                                     <div className="w-px h-full bg-gradient-to-b from-brand-200 to-transparent mt-2"></div>
                                   )}
                                 </div>
                                 <div className="flex-1 pb-4">
                                   <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">{day.day}</span>
                                   <p className="text-neutral-700 leading-relaxed mt-1">{day.text}</p>
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
     <div id="golf-contact" className="py-16 bg-white">
       <div className="container mx-auto px-6 py-12 md:py-24">
         <div className="max-w-2xl mx-auto text-center">
           <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">{t.golf.cta_title}</h3>
           <p className="text-neutral-500 mb-8">{t.golf.cta_desc}</p>
           <ContactButtons />
         </div>
       </div>
     </div>

     {/* Back to Home */}
     <div className="py-8 bg-neutral-50">
       <button
         onClick={() => setCurrentPage('home')}
         className="w-full text-center text-neutral-500 hover:text-brand-900 transition-colors flex justify-center items-center gap-2 group"
       >
         <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
         {t.about.back}
       </button>
     </div>
  </div>
  );
};

export default GolfView;
