'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Handshake, Shield, Phone } from 'lucide-react';
import TestimonialWall from '../TestimonialWall';
import type { SubViewProps } from './types';

const PartnerView: React.FC<SubViewProps> = ({ t, setCurrentPage, onOpenPartnerInquiry, getImage }) => (
  <div className="animate-fade-in-up min-h-screen bg-white">
     {/* Hero - Full height with transparent nav overlap */}
     <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
         {/* Background Image */}
         <div className="absolute inset-0">
           {getImage('partner_hero') ? (
             <Image
               src={getImage('partner_hero')}
               alt="Partner"
               fill
               className="object-cover object-center"
               sizes="100vw"
               quality={75}
             />
           ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950 animate-pulse" />
           )}
           <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/80 to-brand-900/70"></div>
         </div>
         {/* Decorative Elements */}
         <div className="absolute inset-0">
           <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
           <div className="absolute w-72 h-72 bg-brand-400/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
         </div>
         <div className="relative z-10 text-center px-6 py-12 md:py-24">
             <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
               <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t.partner.hero_tag}</span>
             </span>
             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight">
                {t.partner.hero_title}
             </h1>
             <p className="text-neutral-300 max-w-2xl mx-auto leading-relaxed whitespace-pre-line text-sm md:text-base">
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
               <div key={i} className="p-8 border border-neutral-200 rounded-xl hover:shadow-lg transition">
                  <div className="text-brand-600 mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3">{item.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
               </div>
             ))}
         </div>

         {/* --- INSERT TESTIMONIAL WALL HERE --- */}
         <div className="mb-24">
            <TestimonialWall />
         </div>

         <div className="bg-brand-900 text-white rounded-3xl p-12">
            <h3 className="text-2xl font-serif mb-12 text-center">{t.partner.flow_title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { step: '01', title: t.partner.flow_1, desc: t.partner.flow_1_d },
                 { step: '02', title: t.partner.flow_2, desc: t.partner.flow_2_d },
                 { step: '03', title: t.partner.flow_3, desc: t.partner.flow_3_d },
                 { step: '04', title: t.partner.flow_4, desc: t.partner.flow_4_d },
               ].map((item, i) => (
                 <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-brand-500 mb-2 font-mono">{item.step}</div>
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-xs text-neutral-400">{item.desc}</p>
                 </div>
               ))}
            </div>
            <div className="mt-16 text-center border-t border-brand-800 pt-12">
               <h4 className="text-xl font-serif mb-4">{t.partner.cta_title}</h4>
               <p className="text-neutral-400 mb-8 whitespace-pre-line">{t.partner.cta_desc}</p>
               <button onClick={onOpenPartnerInquiry} className="bg-brand-600 text-white px-10 py-4 rounded-full font-bold hover:bg-brand-500 transition shadow-lg">
                  {t.partner.cta_btn}
               </button>
            </div>
         </div>
         <button onClick={() => setCurrentPage('home')} className="mt-16 w-full text-center text-neutral-500 hover:text-brand-900 transition flex justify-center items-center gap-2">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
     </div>
  </div>
);

export default PartnerView;
