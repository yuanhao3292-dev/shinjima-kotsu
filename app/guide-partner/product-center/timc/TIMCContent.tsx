'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, CheckCircle, MapPin, Building, Activity, Shield,
  Armchair, FileText, Zap, Coffee, ChevronDown, MessageSquare,
} from 'lucide-react';
import { translations, type Language } from '@/translations';
import PackageComparisonTable from '@/components/PackageComparisonTable';
import ContactButtons from '@/components/ContactButtons';
import { localizeText } from '@/lib/utils/text-converter';

// 图片资源
const IMAGES: Record<string, string> = {
  medical_hero: 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg',
  tech_ct: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/CT.JPG',
  tech_mri: 'https://i.ibb.co/XxZdfCML/tech-mri.jpg',
  tech_endo: 'https://i.ibb.co/MkkrywCZ/tech-endo.jpg',
  tech_dental: 'https://i.ibb.co/tM1LBQJW/tech-dental.jpg',
  detail_echo: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/4.JPG',
  detail_mammo: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/5.JPG',
  facility_center: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/dating.JPG',
  facility_reception: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/qiantai.JPG',
  facility_room: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/wuzi.JPG',
  facility_bathroom: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/cesuo.JPG',
};

// 评价数据
const REVIEWS = [
  { name: '陳先生', loc: '台北', flag: '🇹🇼', pkg: 'SELECT 甄選套餐', text: '第一次來日本做健檢，從預約到體檢完成都非常順暢。TIMC的設備真的很先進，整個環境也很舒適。', highlight: '設備先進、環境舒適' },
  { name: '林小姐', loc: '高雄', flag: '🇹🇼', pkg: 'PREMIUM 尊享套餐', text: '做了PET-CT全身檢查，醫生非常仔細地解說了每一項結果。中文報告很詳盡，下次會帶爸媽一起來。', highlight: 'PET-CT檢查專業' },
  { name: '王先生', loc: '新竹', flag: '🇹🇼', pkg: 'VIP 至尊套餐', text: '公司高管健檢選擇了VIP套餐，從機場接送到檢查後的休息都安排得很周到。腸胃鏡是無痛的，睡一覺就做完了。', highlight: '無痛腸胃鏡、服務周到' },
  { name: '黃先生', loc: '上海', flag: '🇨🇳', pkg: 'PREMIUM 尊享套餐', text: '專程從上海飛過來做體檢，整體體驗非常好。日本的醫療水平確實領先，MRI檢查非常細緻。', highlight: 'MRI檢查細緻' },
  { name: '張小姐', loc: '香港', flag: '🇭🇰', pkg: 'SELECT 甄選套餐', text: '香港過來很方便，兩個小時飛機就到。檢查流程很順，翻譯全程陪同，完全沒有語言障礙。', highlight: '中文服務貼心' },
  { name: '李先生', loc: '深圳', flag: '🇨🇳', pkg: 'VIP 至尊套餐', text: '帶父母一起來做年度健檢，VIP套餐的休息室非常舒適，老人家也不會覺得累。報告解讀很詳細。', highlight: '適合全家健檢' },
  { name: '吳小姐', loc: '台中', flag: '🇹🇼', pkg: 'PREMIUM 尊享套餐', text: '朋友推薦來的，做了全身MRI和腫瘤標記物檢測。醫生說我的健康狀況很好，讓我安心不少。', highlight: '全身MRI精準' },
  { name: '許先生', loc: '北京', flag: '🇨🇳', pkg: 'SELECT 甄選套餐', text: '日本醫療服務果然名不虛傳，從接機開始就感受到專業。已經推薦給好幾個朋友了。', highlight: '接機服務周到' },
];

interface TIMCContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

export default function TIMCContent({ isGuideEmbed, guideSlug }: TIMCContentProps) {
  const [lang, setLang] = useState<Language>('zh-TW');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setLang(value as Language);
        return;
      }
    }
    const bl = navigator.language;
    if (bl.startsWith('ja')) setLang('ja');
    else if (bl === 'zh-CN' || bl === 'zh-Hans' || bl.startsWith('zh')) setLang('zh-CN');
    else if (bl.startsWith('en')) setLang('en');
  }, []);

  const t = translations[lang];
  const pkgBase = isGuideEmbed && guideSlug ? `/g/${guideSlug}/medical-packages` : '/medical-packages';

  return (
    <div className="animate-fade-in-up">

      {/* 1. Hero Section */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden text-white bg-slate-900">
        <Image
          src={IMAGES.medical_hero}
          fill
          className="object-cover opacity-80"
          alt="TIMC Lobby Luxury Environment"
          priority
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
        <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-4 md:mb-6 leading-[1.2]">
              {t.medical.hero_title_1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{t.medical.hero_title_2}</span>
            </h1>
            <h2 className="text-base sm:text-lg md:text-2xl text-gray-300 font-light mb-6 md:mb-8 font-serif">
              {t.medical.hero_subtitle}
            </h2>
            <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base border-l-2 border-blue-500 pl-4 md:pl-6 max-w-2xl whitespace-pre-line">
              {t.medical.hero_text}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Hospital Introduction Video */}
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
                poster={IMAGES.medical_hero}
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
        {/* 3. Authority Section */}
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

        {/* 4. Tech Equipment Section */}
        <div className="mb-0">
          <div className="text-center py-20 bg-white">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-3">{t.medical.tech_title}</h3>
            <p className="text-gray-500 text-sm tracking-widest uppercase mb-6">Medical Equipment Lineup</p>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto px-4">{t.medical.tech_sub}</p>
          </div>

          {/* Row 1: CT + MRI */}
          <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
            <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
              <Image src={IMAGES.tech_ct} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="CT Scanner" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.tech_ct_t}</h4>
                <p className="text-base text-white/80 leading-relaxed">{t.medical.tech_ct_d}</p>
              </div>
            </div>
            <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
              <Image src={IMAGES.tech_mri} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="MRI Scanner" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.tech_mri_t}</h4>
                <p className="text-base text-white/80 leading-relaxed">{t.medical.tech_mri_d}</p>
              </div>
            </div>
          </div>

          {/* Row 2: Endoscopy + Dental */}
          <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
            <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
              <Image src={IMAGES.tech_endo} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Endoscopy" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.tech_endo_t}</h4>
                <p className="text-base text-white/80 leading-relaxed">{t.medical.tech_endo_d}</p>
              </div>
            </div>
            <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
              <Image src={IMAGES.tech_dental} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Dental" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.tech_dental_t}</h4>
                <p className="text-base text-white/80 leading-relaxed">{t.medical.tech_dental_d}</p>
              </div>
            </div>
          </div>

          {/* Row 3: Ultrasound + Mammography */}
          <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
            <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
              <Image src={IMAGES.detail_echo} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Ultrasound" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.detail_echo_title}</h4>
                <p className="text-base text-white/80 leading-relaxed">{t.medical.detail_echo_desc}</p>
              </div>
            </div>
            <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
              <Image src={IMAGES.detail_mammo} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Mammography" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.medical.detail_mammo_title}</h4>
                <p className="text-base text-white/80 leading-relaxed">{t.medical.detail_mammo_desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Facility & Rooms Section */}
        <div className="mb-24">
          <div className="text-center py-20 bg-white">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-3">{t.medical.facility_title}</h3>
            <p className="text-gray-500 text-sm tracking-widest uppercase mb-6">Facility & Rooms</p>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto px-4">{t.medical.facility_subtitle}</p>
          </div>

          <div className="space-y-0">
            {/* Facility 1 */}
            <div className="relative min-h-[60vh] flex items-center overflow-hidden">
              <Image src={IMAGES.facility_center} fill className="object-cover" alt="Center Interior" sizes="100vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
              <div className="relative container mx-auto px-6 py-16">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[1px] w-12 bg-amber-400"></div>
                    <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">01</span>
                  </div>
                  <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.medical.facility_1_title}</h4>
                  <p className="text-lg text-white/80 leading-relaxed">{t.medical.facility_1_desc}</p>
                  <div className="mt-6 flex gap-3">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">4,000㎡</span>
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Japan&apos;s Largest</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Facility 2 */}
            <div className="relative min-h-[60vh] flex items-center overflow-hidden">
              <Image src={IMAGES.facility_reception} fill className="object-cover" alt="Reception" sizes="100vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-900/90 via-slate-900/70 to-transparent"></div>
              <div className="relative container mx-auto px-6 py-16">
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

            {/* Facility 3 */}
            <div className="relative min-h-[60vh] flex items-center overflow-hidden">
              <Image src={IMAGES.facility_room} fill className="object-cover" alt="Private Suite" sizes="100vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
              <div className="relative container mx-auto px-6 py-16">
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

            {/* Facility 4 */}
            <div className="relative min-h-[60vh] flex items-center overflow-hidden">
              <Image src={IMAGES.facility_bathroom} fill className="object-cover" alt="Bathroom" sizes="100vw" quality={75} />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-900/90 via-slate-900/70 to-transparent"></div>
              <div className="relative container mx-auto px-6 py-16">
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

        {/* 6. Flow Experience */}
        <div className="mb-24 bg-gray-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
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

        {/* 7. Packages - 6 COURSES */}
        <div className="mb-24" id="timc-packages">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-serif text-gray-900">{t.medical.pkg_title}</h3>
            <p className="text-gray-500 text-sm mt-2">TIMC × NIIJIMA Exclusive B2B Lineup</p>

            {!isGuideEmbed && (
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
            {/* VIP Member */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 border border-gray-900 rounded-2xl p-6 hover:shadow-2xl transition hover:-translate-y-1 relative overflow-hidden bg-gray-900 text-white flex flex-col">
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Flagship</div>
              <div className="mb-4">
                <h4 className="text-xl font-serif font-bold text-yellow-400">{t.medical.pkg_vip_title}</h4>
                <p className="text-xs text-gray-400 mt-1">VIP Member Course</p>
                <p className="text-2xl font-bold text-yellow-400 mt-2">¥1,512,500</p>
                <p className="text-[10px] text-gray-500">{t.medical.pkg_price_note}</p>
              </div>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed flex-grow">{t.medical.pkg_vip_desc}</p>
              <div className="space-y-1.5 mb-4 text-xs">
                <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_1}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_2}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_3}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_4}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_5}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-yellow-500 shrink-0" /> {t.medical.pkg_vip_item_6}</div>
              </div>
              <a href={`${pkgBase}/vip-member-course`} className="w-full py-2 bg-yellow-500 text-black text-xs font-bold rounded hover:bg-yellow-400 transition text-center block">{t.medical.pkg_consult_btn}</a>
            </div>

            {/* PREMIUM (Cardiac) */}
            <div className="border border-blue-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white flex flex-col">
              <div className="mb-4">
                <h4 className="text-lg font-serif font-bold text-blue-900">{t.medical.pkg_premium_title}</h4>
                <p className="text-xs text-blue-400 mt-1">Premium Cardiac Course</p>
                <p className="text-xl font-bold text-blue-900 mt-2">¥825,000</p>
                <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">{t.medical.pkg_premium_desc}</p>
              <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_1}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_2}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_3}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_4}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-blue-500 shrink-0" /> {t.medical.pkg_premium_item_5}</div>
              </div>
              <a href={`${pkgBase}/premium-cardiac-course`} className="w-full py-2 border border-blue-200 text-blue-600 text-xs font-bold rounded hover:bg-blue-50 transition text-center block">{t.medical.pkg_consult_btn}</a>
            </div>

            {/* SELECT (Gastro + Colon) */}
            <div className="border border-green-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
              <div className="mb-4">
                <h4 className="text-lg font-serif font-bold text-green-900">{t.medical.pkg_select_gc_title}</h4>
                <p className="text-xs text-green-500 mt-1">Gastro + Colonoscopy Course</p>
                <p className="text-xl font-bold text-green-900 mt-2">¥825,000</p>
                <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">{t.medical.pkg_select_gc_desc}</p>
              <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_1}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_2}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_3}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_4}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {t.medical.pkg_select_gc_item_5}</div>
              </div>
              <a href={`${pkgBase}/select-gastro-colonoscopy`} className="w-full py-2 border border-green-200 text-green-600 text-xs font-bold rounded hover:bg-green-50 transition text-center block">{t.medical.pkg_consult_btn}</a>
            </div>

            {/* SELECT (Stomach only) */}
            <div className="border border-teal-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
              <div className="mb-4">
                <h4 className="text-lg font-serif font-bold text-teal-800">{t.medical.pkg_select_g_title}</h4>
                <p className="text-xs text-teal-500 mt-1">Gastroscopy Course</p>
                <p className="text-xl font-bold text-teal-800 mt-2">¥687,500</p>
                <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">{t.medical.pkg_select_g_desc}</p>
              <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_1}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_2}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_3}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_4}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-teal-500 shrink-0" /> {t.medical.pkg_select_g_item_5}</div>
              </div>
              <Link href={`${pkgBase}/select-gastroscopy`} className="w-full py-2 border border-teal-200 text-teal-600 text-xs font-bold rounded hover:bg-teal-50 transition text-center block">{t.medical.pkg_consult_btn}</Link>
            </div>

            {/* DWIBS */}
            <div className="border border-purple-100 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-white flex flex-col">
              <div className="mb-4">
                <h4 className="text-lg font-serif font-bold text-purple-900">{t.medical.pkg_dwibs_title}</h4>
                <p className="text-xs text-purple-500 mt-1">DWIBS Cancer Screening</p>
                <p className="text-xl font-bold text-purple-900 mt-2">¥275,000</p>
                <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">{t.medical.pkg_dwibs_desc}</p>
              <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_1}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_2}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_3}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_4}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-purple-500 shrink-0" /> {t.medical.pkg_dwibs_item_5}</div>
              </div>
              <Link href={`${pkgBase}/dwibs-cancer-screening`} className="w-full py-2 border border-purple-200 text-purple-600 text-xs font-bold rounded hover:bg-purple-50 transition text-center block">{t.medical.pkg_consult_btn}</Link>
            </div>

            {/* BASIC */}
            <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 bg-gray-50 flex flex-col">
              <div className="mb-4">
                <h4 className="text-lg font-serif font-bold text-gray-800">{t.medical.pkg_basic_title}</h4>
                <p className="text-xs text-gray-500 mt-1">Standard Checkup Course</p>
                <p className="text-xl font-bold text-gray-800 mt-2">¥550,000</p>
                <p className="text-[10px] text-gray-400">{t.medical.pkg_price_note}</p>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-grow">{t.medical.pkg_basic_desc}</p>
              <div className="space-y-1.5 mb-4 text-xs text-gray-700">
                <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_1}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_2}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_3}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_4}</div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-gray-500 shrink-0" /> {t.medical.pkg_basic_item_5}</div>
              </div>
              <Link href={`${pkgBase}/basic-checkup`} className="w-full py-2 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-100 transition text-center block">{t.medical.pkg_consult_btn}</Link>
            </div>
          </div>
        </div>

        {/* 8. Package Comparison Table */}
        <div className="mb-24" id="timc-comparison">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif text-gray-900">{t.medical.pkg_compare_title}</h3>
            <p className="text-gray-500 text-sm mt-2">{t.medical.pkg_compare_sub}</p>
          </div>
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <PackageComparisonTable currentLang={lang} />
            </div>
          </div>
        </div>

        {/* 9. Customer Reviews */}
        <div className="mb-24" id="timc-testimonials">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">Customer Reviews</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.medical.testimonials_title}</h3>
            <p className="text-gray-500 text-sm mt-2">{t.medical.testimonials_sub}</p>
          </div>

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

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="flex animate-scroll-reviews hover:pause-animation">
              {[...REVIEWS, ...REVIEWS].map((review, i) => (
                <div key={i} className="flex-shrink-0 w-80 mx-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {localizeText(review.name, lang).charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{localizeText(review.name, lang)}</span>
                        <span>{review.flag}</span>
                      </div>
                      <div className="text-xs text-gray-400">{review.loc}</div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-3">{localizeText(review.pkg, lang)}</div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{localizeText(review.text, lang)}</p>
                  <div className="flex items-center gap-2 text-green-600 text-xs">
                    <CheckCircle size={12} />
                    <span className="font-medium">{localizeText(review.highlight, lang)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 10. FAQ */}
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
                <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* 11. Order Lookup - only in non-whitelabel mode */}
        {!isGuideEmbed && (
          <div className="mb-24">
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
        )}

        {/* 12. CTA */}
        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-200">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">{t.medical.cta_title}</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6 leading-relaxed whitespace-pre-line">
            {t.medical.cta_text}
          </p>
          <div>
            <button onClick={() => { const element = document.getElementById('timc-packages'); element?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-white text-blue-800 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition shadow-lg inline-flex items-center gap-2">
              <Zap size={18} /> {t.medical.cta_btn}
            </button>
          </div>
        </div>

        {/* 13. Contact */}
        {!isGuideEmbed && (
          <div className="py-12 bg-gray-50 mt-24 rounded-2xl">
            <div className="max-w-2xl mx-auto text-center px-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t.medical.contact_other}</h3>
              <ContactButtons />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
