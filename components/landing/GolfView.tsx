'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, MapPin, Building, Lock, Trophy, Car, Bath } from 'lucide-react';
import ContactButtons from '../ContactButtons';
import type { SubViewProps } from './types';

const GolfView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, getImage }) => {
  // Default images as fallback - All URLs verified working (Unsplash)
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

  // State for database images (starts empty, merged after API fetch)
  const [dbImages, setDbImages] = useState<Record<string, string>>({});
  // Track failed image IDs to use fallback
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

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

  // Image resolution: DB image > default Unsplash > golf_hero fallback
  // If an image has failed loading, skip the failed source
  const getPlanImage = (id: string): string => {
    const dbUrl = dbImages[id];
    const defaultUrl = defaultPlanImages[id];
    const heroFallback = getImage('golf_hero');

    if (failedImages.has(id)) {
      // Primary source failed, try default Unsplash
      if (failedImages.has(`${id}-default`)) {
        // Both failed, use hero fallback
        return heroFallback;
      }
      return defaultUrl || heroFallback;
    }
    return dbUrl || defaultUrl || heroFallback;
  };

  const handlePlanImageError = (planId: string) => {
    setFailedImages(prev => {
      const next = new Set(prev);
      if (!next.has(planId)) {
        // First failure: mark primary as failed (will try default Unsplash)
        next.add(planId);
      } else if (!next.has(`${planId}-default`)) {
        // Second failure: mark default as also failed (will use hero)
        next.add(`${planId}-default`);
      }
      return next;
    });
  };

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
  <div className="animate-fade-in-up min-h-screen bg-neutral-50">
     {/* ===== HERO SECTION - Full Screen Cinematic ===== */}
     <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 via-transparent to-brand-900/40"></div>
        </div>

        {/* Decorative gold lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"></div>

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
             <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-bold">Partner Courses</span>
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
             <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold-400"></div>
             <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-bold">Signature Itineraries</span>
             <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold-400"></div>
           </div>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-neutral-900 mb-4">Recommended Itineraries</h2>
           <p className="text-neutral-500 max-w-xl mx-auto">Curated experiences for discerning golfers</p>
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
                           <Image
                              src={getPlanImage(plan.id)}
                              fill
                              className="object-cover transform group-hover:scale-105 transition duration-1000"
                              alt={plan.title}
                              sizes="(max-width: 768px) 100vw, 50vw"
                              quality={75}
                              priority={index < 2}
                              onError={() => handlePlanImageError(plan.id)}
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
                             <span className="text-xs text-neutral-400 uppercase tracking-wider">Accommodation</span>
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
     <div className="py-16 bg-white">
       <div className="container mx-auto px-6 py-12 md:py-24">
         <div className="max-w-2xl mx-auto text-center">
           <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">{'\u958B\u59CB\u60A8\u7684\u9AD8\u723E\u592B\u4E4B\u65C5'}</h3>
           <p className="text-neutral-500 mb-8">{'\u5C08\u696D\u7403\u5834\u9810\u7D04\u30FB\x56\x49\x50\u79AE\u9047\u30FB\u5168\u7A0B\u966A\u540C'}</p>
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
