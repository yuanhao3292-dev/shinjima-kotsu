'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Building, Activity, Shield, Armchair, FileText, Zap, Coffee, ChevronDown, Cpu, Scan, MessageSquare } from 'lucide-react';
import PackageComparisonTable from '../PackageComparisonTable';
import ContactButtons from '../ContactButtons';
import { localizeText } from '@/lib/utils/text-converter';
import { getTestimonials } from '@/lib/data/medical-checkup-i18n';
import type { SubViewProps } from './types';

// --- NEW COMPONENT: AI Tech Card (Used in MedicalView) ---
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
    <div className="group relative bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Image Container with Tech Overlay */}
      <div className="relative h-64 overflow-hidden bg-brand-900">
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
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2.5s_linear_infinite]"></div>
        </div>
        <div className="absolute top-4 left-4">
           <div className={`w-8 h-8 rounded backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white ${colorClass}`}>
              <Icon size={16} />
           </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
           <span className="text-[10px] text-white bg-black/50 backdrop-blur px-2 py-1 rounded border border-white/10 uppercase tracking-wider font-mono">AI Analysis</span>
           <span className="text-[10px] text-brand-400 bg-black/50 backdrop-blur px-2 py-1 rounded border border-white/10 font-mono">Active</span>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-2 mb-3">
           <div className={`h-1 w-6 rounded-full ${colorClass.replace('text-', 'bg-')}`}></div>
           <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Advanced Tech</span>
        </div>
        <h4 className="text-xl font-bold text-brand-900 mb-3 font-serif group-hover:text-brand-700 transition-colors">{title}</h4>
        <div className="flex flex-wrap gap-2 mb-4">
           <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100 flex items-center gap-1">
              <Cpu size={10} /> {spec1}
           </span>
           <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100 flex items-center gap-1">
              <Scan size={10} /> {spec2}
           </span>
        </div>
        <p className="text-neutral-500 text-sm leading-relaxed text-justify line-clamp-4 group-hover:line-clamp-none transition-all">
           {desc}
        </p>
      </div>
    </div>
  );
});

// 使用 React.memo 优化 MedicalView 渲染性能
const MedicalView: React.FC<SubViewProps> = ({ t, setCurrentPage, onOpenTIMCQuote, currentLang, getImage }) => (
  <div className="animate-fade-in-up min-h-screen bg-white">
    {/* 1. Hero Section - Cancer Treatment style */}
    <section className="relative min-h-screen flex items-center bg-brand-900 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={getImage('medical_hero')}
          fill
          className="object-cover object-center"
          alt="TIMC Lobby Luxury Environment"
          key="medical_hero"
          sizes="100vw"
          quality={75}
          priority
        />
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
            <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">TIMC OSAKA</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
            {t.medical.hero_title_1}<br/>
            <span className="text-gold-400">{t.medical.hero_title_2}</span>
          </h1>
          <p className="text-xl text-neutral-300 mb-4 leading-relaxed font-light max-w-2xl">
            {t.medical.hero_subtitle}
          </p>
          <p className="text-xl text-neutral-400 mb-8 leading-relaxed font-light max-w-2xl whitespace-pre-line">
            {t.medical.hero_text}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#packages"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium tracking-wider hover:bg-gold-300 transition-colors"
            >
              <Scan size={20} />
              {currentLang === 'zh-TW' ? '查看體檢套餐' : currentLang === 'zh-CN' ? '查看体检套餐' : currentLang === 'ja' ? '健診プランを見る' : 'View Plans'}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm tracking-wider hover:bg-white/20 transition-colors"
            >
              <MessageSquare size={20} />
              {currentLang === 'zh-TW' ? '諮詢預約' : currentLang === 'zh-CN' ? '咨询预约' : currentLang === 'ja' ? 'ご予約相談' : 'Consult'}
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* Hospital Introduction Video Section */}
    <div className="bg-gradient-to-b from-brand-900 to-brand-800 py-20">
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="text-center mb-12">
          <span className="text-brand-400 text-xs tracking-[0.3em] uppercase font-bold">Hospital Tour</span>
          <h3 className="text-3xl font-serif text-white mt-3">{t.medical.video_title}</h3>
          <p className="text-neutral-400 text-sm mt-2 max-w-2xl mx-auto">{t.medical.video_subtitle}</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
            <video
              className="w-full h-full object-cover"
              controls
              poster="https://i.ibb.co/xS1h4rTM/hero-medical.jpg"
              preload="metadata"
            >
              <source src="https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/videos/timc_intro.mp4" type="video/mp4" />
              {t.medical.video_fallback}
            </video>
          </div>
          <p className="text-center text-neutral-500 text-xs mt-4">{t.medical.video_caption}</p>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-6 py-12 md:py-24 py-24">
      {/* 2. Authority Section */}
      <div className="mb-24">
          <div className="text-center mb-16">
              <span className="text-brand-500 text-xs tracking-widest uppercase font-bold">{t.medical.auth_tag}</span>
              <h3 className="text-3xl font-serif text-neutral-900 mt-2">{t.medical.auth_title}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200 hover:shadow-lg transition duration-300 group">
                  <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition">
                      <Building size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-800 mb-3 font-serif">{t.medical.auth_1_t}</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">{t.medical.auth_1_d}</p>
              </div>
              <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200 hover:shadow-lg transition duration-300 group">
                  <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition">
                      <MapPin size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-800 mb-3 font-serif">{t.medical.auth_2_t}</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">{t.medical.auth_2_d}</p>
              </div>
              <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200 hover:shadow-lg transition duration-300 group">
                  <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition">
                      <Shield size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-800 mb-3 font-serif">{t.medical.auth_3_t}</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">{t.medical.auth_3_d}</p>
              </div>
          </div>
      </div>

      {/* 3. Tech Section - 双列全屏背景图设计 */}
      <div className="mb-0">
          <div className="text-center py-20 bg-white">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-neutral-900 mb-3">{t.medical.tech_title}</h3>
              <p className="text-neutral-500 text-sm tracking-widest uppercase mb-6">Medical Equipment Lineup</p>
              <p className="text-neutral-600 text-sm max-w-2xl mx-auto px-4">{t.medical.tech_sub}</p>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/50 to-brand-900/20"></div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/50 to-brand-900/20"></div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/50 to-brand-900/20"></div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/50 to-brand-900/20"></div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/50 to-brand-900/20"></div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/50 to-brand-900/20"></div>
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
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-neutral-900 mb-3">{t.medical.facility_title}</h3>
              <p className="text-neutral-500 text-sm tracking-widest uppercase mb-6">Facility & Rooms</p>
              <p className="text-neutral-600 text-sm max-w-2xl mx-auto px-4">{t.medical.facility_subtitle}</p>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/70 to-transparent"></div>
                  <div className="relative container mx-auto px-6 py-12 md:py-24 py-16">
                      <div className="max-w-xl">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="h-[1px] w-12 bg-gold-400"></div>
                              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">01</span>
                          </div>
                          <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.medical.facility_1_title}</h4>
                          <p className="text-lg text-white/80 leading-relaxed">{t.medical.facility_1_desc}</p>
                          <div className="mt-6 flex gap-3">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">4,000&#x33A1;</span>
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Japan&apos;s Largest</span>
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
                  <div className="absolute inset-0 bg-gradient-to-l from-brand-900/90 via-brand-900/70 to-transparent"></div>
                  <div className="relative container mx-auto px-6 py-12 md:py-24 py-16">
                      <div className="max-w-xl ml-auto text-right">
                          <div className="flex items-center justify-end gap-3 mb-4">
                              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">02</span>
                              <div className="h-[1px] w-12 bg-gold-400"></div>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/70 to-transparent"></div>
                  <div className="relative container mx-auto px-6 py-12 md:py-24 py-16">
                      <div className="max-w-xl">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="h-[1px] w-12 bg-gold-400"></div>
                              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">03</span>
                          </div>
                          <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.medical.facility_3_title}</h4>
                          <p className="text-lg text-white/80 leading-relaxed">{t.medical.facility_3_desc}</p>
                          <div className="mt-6 flex gap-3 flex-wrap">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">20 Rooms</span>
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">30&#x33A1;+</span>
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
                  <div className="absolute inset-0 bg-gradient-to-l from-brand-900/90 via-brand-900/70 to-transparent"></div>
                  <div className="relative container mx-auto px-6 py-12 md:py-24 py-16">
                      <div className="max-w-xl ml-auto text-right">
                          <div className="flex items-center justify-end gap-3 mb-4">
                              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">04</span>
                              <div className="h-[1px] w-12 bg-gold-400"></div>
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
      <div className="mb-24 bg-brand-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div>
           <div className="relative z-10 text-center mb-12">
               <h3 className="text-3xl font-serif">{t.medical.flow_title}</h3>
               <p className="text-neutral-400 mt-2 text-sm">Experience the Flow</p>
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
                  <div className="text-brand-400 font-mono text-xl mb-4 opacity-50">{step.id}</div>
                  <div className="flex justify-center mb-4 text-white opacity-80 group-hover:scale-110 transition">{step.icon}</div>
                  <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
               </div>
              ))}
           </div>
      </div>

      {/* 5. Packages - UPDATED 6 COURSES */}
      <div className="mb-24" id="timc-packages">
          <div className="text-center mb-16">
              <h3 className="text-3xl font-serif text-neutral-900">{t.medical.pkg_title}</h3>
              <p className="text-neutral-500 text-sm mt-2">TIMC × NIIJIMA Exclusive B2B Lineup</p>

              {/* 套餐推荐按钮 */}
              <div className="mt-8">
                  <a
                      href="/package-recommender"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-900 text-white px-8 py-4 rounded-full font-bold hover:from-brand-800 hover:to-brand-900 transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:-translate-y-0.5"
                  >
                      <MessageSquare size={20} />
                      <span>{t.medical.pkg_recommend_btn}</span>
                      <ArrowRight size={18} />
                  </a>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">

              {/* 1. VIP Member */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1 border border-gold-400 rounded-2xl p-6 hover:shadow-2xl transition hover:-translate-y-1 relative overflow-hidden bg-brand-900 text-white flex flex-col">
                  <div className="absolute top-0 right-0 bg-gold-400 text-brand-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Flagship</div>
                  <div className="mb-4">
                      <h4 className="text-xl font-serif font-bold text-gold-400">{t.medical.pkg_vip_title}</h4>
                      <p className="text-xs text-neutral-400 mt-1">VIP Member Course</p>
                      <p className="text-2xl font-bold text-gold-400 mt-2">&yen;1,512,500</p>
                      <p className="text-[10px] text-neutral-500">{t.medical.pkg_price_note}</p>
                  </div>
                  <p className="text-xs text-neutral-300 mb-4 leading-relaxed flex-grow">
                      {t.medical.pkg_vip_desc}
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gold-400 shrink-0" /> {t.medical.pkg_vip_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gold-400 shrink-0" /> {t.medical.pkg_vip_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gold-400 shrink-0" /> {t.medical.pkg_vip_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gold-400 shrink-0" /> {t.medical.pkg_vip_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gold-400 shrink-0" /> {t.medical.pkg_vip_item_5}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-gold-400 shrink-0" /> {t.medical.pkg_vip_item_6}</div>
                  </div>
                  <a href="/medical-packages/vip-member-course" className="w-full py-2 bg-gold-400 text-brand-900 text-xs font-bold rounded hover:bg-gold-300 transition text-center block">{t.medical.pkg_consult_btn}</a>
              </div>

              {/* 2. PREMIUM (Cardiac) */}
              <div className="border border-brand-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-brand-900">{t.medical.pkg_premium_title}</h4>
                       <p className="text-xs text-brand-400 mt-1">Premium Cardiac Course</p>
                       <p className="text-xl font-bold text-brand-900 mt-2">&yen;825,000</p>
                       <p className="text-[10px] text-neutral-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-neutral-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_premium_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-neutral-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_premium_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_premium_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_premium_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_premium_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_premium_item_5}</div>
                   </div>
                   <a href="/medical-packages/premium-cardiac-course" className="w-full py-2 border border-brand-300 text-brand-700 text-xs font-bold rounded hover:bg-brand-50 transition text-center block">{t.medical.pkg_consult_btn}</a>
              </div>

              {/* 3. SELECT (Gastro + Colon) */}
              <div className="border border-brand-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-brand-900">{t.medical.pkg_select_gc_title}</h4>
                       <p className="text-xs text-brand-400 mt-1">Gastro + Colonoscopy Course</p>
                       <p className="text-xl font-bold text-brand-900 mt-2">&yen;825,000</p>
                       <p className="text-[10px] text-neutral-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-neutral-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_select_gc_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-neutral-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_gc_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_gc_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_gc_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_gc_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_gc_item_5}</div>
                   </div>
                   <a href="/medical-packages/select-gastro-colonoscopy" className="w-full py-2 border border-brand-300 text-brand-700 text-xs font-bold rounded hover:bg-brand-50 transition text-center block">{t.medical.pkg_consult_btn}</a>
              </div>

              {/* 4. SELECT (Stomach only) */}
              <div className="border border-brand-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-brand-900">{t.medical.pkg_select_g_title}</h4>
                       <p className="text-xs text-brand-400 mt-1">Gastroscopy Course</p>
                       <p className="text-xl font-bold text-brand-900 mt-2">&yen;687,500</p>
                       <p className="text-[10px] text-neutral-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-neutral-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_select_g_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-neutral-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_g_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_g_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_g_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_g_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_select_g_item_5}</div>
                   </div>
                   <Link href="/medical-packages/select-gastroscopy" className="w-full py-2 border border-brand-300 text-brand-700 text-xs font-bold rounded hover:bg-brand-50 transition text-center block">{t.medical.pkg_consult_btn}</Link>
              </div>

              {/* 5. DWIBS */}
              <div className="border border-brand-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-brand-900">{t.medical.pkg_dwibs_title}</h4>
                       <p className="text-xs text-brand-400 mt-1">DWIBS Cancer Screening</p>
                       <p className="text-xl font-bold text-brand-900 mt-2">&yen;275,000</p>
                       <p className="text-[10px] text-neutral-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-neutral-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_dwibs_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-neutral-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_dwibs_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_dwibs_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_dwibs_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_dwibs_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-brand-500 shrink-0" /> {t.medical.pkg_dwibs_item_5}</div>
                   </div>
                   <Link href="/medical-packages/dwibs-cancer-screening" className="w-full py-2 border border-brand-300 text-brand-700 text-xs font-bold rounded hover:bg-brand-50 transition text-center block">{t.medical.pkg_consult_btn}</Link>
              </div>

              {/* 6. BASIC */}
              <div className="border border-neutral-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-neutral-50 flex flex-col">
                   <div className="mb-4">
                       <h4 className="text-lg font-serif font-bold text-neutral-800">{t.medical.pkg_basic_title}</h4>
                       <p className="text-xs text-neutral-500 mt-1">Standard Checkup Course</p>
                       <p className="text-xl font-bold text-neutral-800 mt-2">&yen;550,000</p>
                       <p className="text-[10px] text-neutral-400">{t.medical.pkg_price_note}</p>
                   </div>
                   <p className="text-xs text-neutral-500 mb-4 leading-relaxed flex-grow">
                       {t.medical.pkg_basic_desc}
                   </p>
                   <div className="space-y-1.5 mb-4 text-xs text-neutral-700">
                      <div className="flex gap-2"><CheckCircle size={14} className="text-neutral-500 shrink-0" /> {t.medical.pkg_basic_item_1}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-neutral-500 shrink-0" /> {t.medical.pkg_basic_item_2}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-neutral-500 shrink-0" /> {t.medical.pkg_basic_item_3}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-neutral-500 shrink-0" /> {t.medical.pkg_basic_item_4}</div>
                      <div className="flex gap-2"><CheckCircle size={14} className="text-neutral-500 shrink-0" /> {t.medical.pkg_basic_item_5}</div>
                   </div>
                   <Link href="/medical-packages/basic-checkup" className="w-full py-2 border border-neutral-300 text-neutral-600 text-xs font-bold rounded hover:bg-neutral-100 transition text-center block">{t.medical.pkg_consult_btn}</Link>
              </div>

          </div>
      </div>

      {/* 套餐對比表格 */}
      <div className="mb-24" id="timc-comparison">
          <div className="text-center mb-12">
              <h3 className="text-3xl font-serif text-neutral-900">{t.medical.pkg_compare_title}</h3>
              <p className="text-neutral-500 text-sm mt-2">{t.medical.pkg_compare_sub}</p>
          </div>
          <div className="max-w-7xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
                  <PackageComparisonTable currentLang={currentLang} />
              </div>
          </div>
      </div>

      {/* 客戶評價區塊 - 自動滾動輪播 */}
      <div className="mb-24" id="timc-testimonials">
          <div className="text-center mb-16">
              <span className="text-brand-600 text-xs tracking-widest uppercase font-bold">Customer Reviews</span>
              <h3 className="text-3xl font-serif text-neutral-900 mt-2">{t.medical.testimonials_title}</h3>
              <p className="text-neutral-500 text-sm mt-2">{t.medical.testimonials_sub}</p>
          </div>

          {/* 統計數據 */}
          <div className="flex flex-wrap justify-center gap-12 mb-12">
              <div className="text-center">
                  <div className="text-4xl font-bold text-brand-700">98%</div>
                  <div className="text-sm text-neutral-500 mt-1">{t.medical.stat_satisfaction}</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-brand-700">500+</div>
                  <div className="text-sm text-neutral-500 mt-1">{t.medical.stat_served}</div>
              </div>
              <div className="text-center">
                  <div className="text-4xl font-bold text-brand-700">4.9</div>
                  <div className="text-sm text-neutral-500 mt-1">{t.medical.stat_rating}</div>
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
                  {getTestimonials(currentLang || 'zh-TW').map((review, i) => (
                      <div key={`first-${i}`} className="flex-shrink-0 w-80 mx-3 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-brand-700 to-brand-900 rounded-full flex items-center justify-center text-white font-bold">
                                  {review.name.charAt(0)}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <span className="font-semibold text-neutral-900 text-sm">{review.name}</span>
                                      <span>{review.flag}</span>
                                  </div>
                                  <div className="text-xs text-neutral-400">{review.loc}</div>
                              </div>
                          </div>
                          <div className="text-xs text-brand-700 font-medium mb-3">{review.pkg}</div>
                          <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">{review.text}</p>
                          <div className="flex items-center gap-2 text-brand-600 text-xs">
                              <CheckCircle size={12} />
                              <span className="font-medium">{review.highlight}</span>
                          </div>
                      </div>
                  ))}
                  {/* 複製一組實現無縫滾動 */}
                  {getTestimonials(currentLang || 'zh-TW').map((review, i) => (
                      <div key={`second-${i}`} className="flex-shrink-0 w-80 mx-3 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-brand-700 to-brand-900 rounded-full flex items-center justify-center text-white font-bold">
                                  {review.name.charAt(0)}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <span className="font-semibold text-neutral-900 text-sm">{review.name}</span>
                                      <span>{review.flag}</span>
                                  </div>
                                  <div className="text-xs text-neutral-400">{review.loc}</div>
                              </div>
                          </div>
                          <div className="text-xs text-brand-700 font-medium mb-3">{review.pkg}</div>
                          <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">{review.text}</p>
                          <div className="flex items-center gap-2 text-brand-600 text-xs">
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
              <span className="text-brand-600 text-xs tracking-widest uppercase font-bold">FAQ</span>
              <h3 className="text-3xl font-serif text-neutral-900 mt-2">{t.medical.faq_title}</h3>
              <p className="text-neutral-500 text-sm mt-2">{t.medical.faq_sub}</p>
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
                  <details key={i} className="group bg-white rounded-xl border border-neutral-200 overflow-hidden">
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-neutral-50 transition">
                          <span className="font-semibold text-neutral-900 pr-4">{faq.q}</span>
                          <ChevronDown size={20} className="text-neutral-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-6 py-12 md:py-24 pb-6 text-neutral-600 text-sm leading-relaxed">
                          {faq.a}
                      </div>
                  </details>
              ))}
          </div>
      </div>

      {/* 訂單查詢入口 */}
      <div className="mb-24" id="timc-order-lookup">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-200 p-8 text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={28} className="text-brand-700" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-3">{t.medical.order_title}</h3>
              <p className="text-neutral-500 mb-6">{t.medical.order_sub}</p>
              <a
                  href="/order-lookup"
                  className="inline-flex items-center gap-2 bg-brand-900 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-800 transition"
              >
                  <FileText size={18} />
                  {t.medical.order_btn}
              </a>
          </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-700 rounded-3xl p-12 text-center text-white shadow-2xl shadow-brand-200">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">{t.medical.cta_title}</h3>
          <p className="text-brand-100 max-w-2xl mx-auto mb-6 leading-relaxed whitespace-pre-line">
              {t.medical.cta_text}
          </p>
          <div>
              <button onClick={() => { const element = document.getElementById('timc-packages'); element?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-white text-brand-900 font-bold px-10 py-4 rounded-full hover:bg-neutral-100 transition shadow-lg inline-flex items-center gap-2">
                  <Zap size={18} /> {t.medical.cta_btn}
              </button>
          </div>
      </div>

      {/* Contact Buttons */}
      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">{t.medical.contact_other}</h3>
            <ContactButtons />
          </div>
        </div>
      </div>

      <div className="text-center py-12">
         <button onClick={() => setCurrentPage('home')} className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition">
            <ArrowLeft size={16} /> {t.about.back}
         </button>
      </div>
    </div>
  </div>
);

export default MedicalView;
