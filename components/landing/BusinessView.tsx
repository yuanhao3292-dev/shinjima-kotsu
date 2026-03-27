'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Building, Microscope, Heart, Factory, Cpu, Monitor, Stethoscope, Globe, Bus, Utensils, ExternalLink, MessageSquare } from 'lucide-react';
import ContactButtons from '../ContactButtons';
import { COMPANY_DATA, type Company } from '@/data/companies';
import { localizeText } from '@/lib/utils/text-converter';
import type { SubViewProps } from './types';

const BusinessView: React.FC<SubViewProps> = ({ t, setCurrentPage, onLoginTrigger, currentLang, getImage }) => {
   // ⚡ 性能优化：缓存所有通用文本的翻译结果
   const isEn = currentLang === 'en';
   const isJa = currentLang === 'ja';
   const localizedTexts = useMemo(() => ({
      // 类别标题
      automotive: isJa ? '自動車製造業' : isEn ? 'Automotive Manufacturing' : localizeText('汽車製造業', currentLang),
      electronics: isJa ? '電子・半導体産業' : isEn ? 'Electronics & Semiconductor' : localizeText('電子與半導體產業', currentLang),
      precision: isJa ? '精密機械・オートメーション' : isEn ? 'Precision Machinery & Automation' : localizeText('精密機械與自動化', currentLang),
      medical: isJa ? '医療・ヘルスケア' : isEn ? 'Medical & Healthcare' : localizeText('醫療與健康照護', currentLang),
      appliances: isJa ? '家電・消費者向け電子機器' : isEn ? 'Appliances & Consumer Electronics' : localizeText('家電與消費電子', currentLang),
      retail: isJa ? '小売・サービス業' : isEn ? 'Retail & Services' : localizeText('零售與服務業', currentLang),
      hospitality: isJa ? 'ホテル・ホスピタリティ' : isEn ? 'Hospitality' : localizeText('飯店與款待業', currentLang),
      food: isJa ? '食品・飲料産業' : isEn ? 'Food & Beverage' : localizeText('食品與飲料產業', currentLang),
      logistics: isJa ? '物流・運輸' : isEn ? 'Logistics & Transportation' : localizeText('物流與運輸', currentLang),
      tech: isJa ? 'テクノロジー・通信' : isEn ? 'Technology & Communications' : localizeText('科技與通訊', currentLang),

      // 通用文案
      officialWebsite: isJa ? '公式サイト' : isEn ? 'Official Website' : localizeText('官方網站', currentLang),
      topCompanies: isJa ? '視察予約可能な日本トップ企業' : isEn ? 'Top Japanese Companies Available for Inspection' : localizeText('可預約考察的日本頂級企業', currentLang),
      companyIntro: isJa ? '以下の企業はすべて企業視察の予約が可能です。全行程のコーディネート、プロ通訳の手配、スケジュール作成を承ります。' : isEn ? 'All companies below are open for business inspection bookings. We handle full coordination, professional interpretation and itinerary planning.' : localizeText('以下企業均開放企業考察預約，我們負責全程協調、專業翻譯及行程安排', currentLang),
      bookableCompanies: isJa ? '予約可能企業' : isEn ? 'Bookable Companies' : localizeText('可預約企業', currentLang),
      industryCategories: isJa ? '産業カテゴリー' : isEn ? 'Industry Categories' : localizeText('產業類別', currentLang),
      prefecturesCovered: isJa ? '対応都道府県' : isEn ? 'Prefectures Covered' : localizeText('覆蓋都道府縣', currentLang),
      successRate: isJa ? '予約成功率' : isEn ? 'Booking Success Rate' : localizeText('預約成功率', currentLang),
      notice: isJa ? '※ ご注意事項' : isEn ? '※ Please Note' : localizeText('※ 注意事項', currentLang),
      noticeText: isJa ? '上記の企業はすべて一般企業見学およびビジネス視察の予約が可能です。視察の予約調整、プロ通訳の手配、送迎・宿泊の手配を承ります。各企業の見学可能な時間帯や内容は異なりますので、詳細はお問い合わせください。' : isEn ? 'All companies above are open for general corporate visits and business inspections. We handle booking coordination, professional interpreter arrangements, transportation and accommodation. Visit schedules and content vary by company — please inquire for details.' : localizeText('以上企業均開放一般企業見學與商務考察預約。我們負責考察的預約協調、專業翻譯安排、交通接送及住宿統籌。各企業可參訪的時段與內容不盡相同，詳情請洽詢。', currentLang),
      ctaTitle: isJa ? 'ビジネス視察を始めましょう' : isEn ? 'Start Your Business Inspection' : localizeText('開始您的商務考察', currentLang),
      ctaSubtitle: isJa ? 'オーダーメイド行程・企業訪問手配・全行程通訳サポート' : isEn ? 'Custom itineraries · Corporate visit arrangements · Full interpretation support' : localizeText('專業行程定制・企業參訪安排・全程翻譯陪同', currentLang),
   }), [currentLang, isEn, isJa]);

   // ⚡ 性能优化：缓存所有企业数据的翻译结果
   // 数据源：@/data/companies.ts（数据与视图分离）
   const localizedCompanies = useMemo(() => {
      const localizeCompanies = (companies: Company[]) =>
         companies.map(c => ({
            name: isJa ? c.nameJa : isEn ? c.nameEn : localizeText(c.name, currentLang),
            nameEn: c.nameEn,
            desc: isJa ? c.descJa : isEn ? c.descEn : localizeText(c.desc, currentLang),
            url: c.url,
            location: isJa ? c.locationJa : isEn ? c.locationEn : localizeText(c.location, currentLang),
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
   }, [currentLang, isEn, isJa]);

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

   // Helper to render a company category section
   const renderCompanyCategory = (
      icon: React.ReactNode,
      title: string,
      subtitle: string,
      companies: { name: string; nameEn: string; desc: string; url: string; location: string }[]
   ) => (
      <div>
         <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-900 rounded-lg flex items-center justify-center">
               {icon}
            </div>
            <div>
               <h4 className="font-bold text-neutral-900">{title}</h4>
               <p className="text-xs text-neutral-500">{subtitle}</p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company, i) => (
               <a key={i} href={company.url} target="_blank" rel="noopener noreferrer" className="group p-5 bg-white border border-neutral-200 rounded-xl hover:border-brand-200 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                        <h5 className="font-bold text-neutral-900 group-hover:text-brand-600 transition">{company.name}</h5>
                        {company.name !== company.nameEn && <p className="text-xs text-neutral-400">{company.nameEn}</p>}
                     </div>
                     <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{company.location}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-3">{company.desc}</p>
                  <div className="flex items-center gap-1 text-brand-600 text-xs font-medium"><span>{localizedTexts.officialWebsite}</span><ExternalLink size={12} /></div>
               </a>
            ))}
         </div>
      </div>
   );

   return (
    <div className="animate-fade-in-up min-h-screen bg-white">
      {/* 1. Hero Section - Cancer Treatment style */}
      <section className="relative min-h-screen flex items-center bg-brand-900 overflow-hidden">
        <div className="absolute inset-0">
          {getImage('business_hero') ? (
            <Image
              src={getImage('business_hero')}
              fill
              className="object-cover object-center"
              alt="Japan Business Inspection"
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
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">{currentLang === 'zh-TW' ? '商務考察' : currentLang === 'zh-CN' ? '商务考察' : currentLang === 'ja' ? '企業視察' : 'BUSINESS INSPECTION'}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
              {t.business.hero_title}
            </h1>
            <p className="text-xl text-neutral-300 mb-8 leading-relaxed font-light max-w-2xl whitespace-pre-line">
              {t.business.hero_text}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#business-plans-section"
                className="inline-flex items-center px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium tracking-wider hover:bg-gold-300 transition-colors"
              >
                {t.business.btn_case}
              </a>
              <a
                href="#business-contact"
                className="inline-flex items-center px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm tracking-wider hover:bg-white/20 transition-colors"
              >
                <MessageSquare size={20} />
                {currentLang === 'zh-TW' ? '諮詢預約' : currentLang === 'zh-CN' ? '咨询预约' : currentLang === 'ja' ? 'お問い合わせ' : 'Contact Us'}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-24 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-24">
             <div>
                <h3 className="text-3xl font-serif text-neutral-900 mb-6">{t.business.tag}</h3>
                <p className="text-neutral-500 leading-relaxed whitespace-pre-line mb-8">
                   {t.business.desc}
                </p>
                <button
                   onClick={() => {
                      const element = document.getElementById('business-plans-section');
                      if (element) {
                         element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                   }}
                   className="inline-flex items-center gap-2 bg-brand-900 text-white px-8 py-4 font-bold hover:bg-brand-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
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
                  <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition flex gap-4 items-start">
                     <div className="bg-brand-50 text-brand-600 p-3 rounded-lg">{item.i}</div>
                     <div>
                        <h4 className="font-bold text-neutral-900">{item.t}</h4>
                        <p className="text-xs text-neutral-500 mt-1">{item.d}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Process Steps */}
          <div className="mb-24 bg-brand-900 rounded-3xl p-10 md:p-16 text-white overflow-hidden relative">
             <div className="relative z-10 text-center mb-16">
                 <h3 className="text-3xl font-serif">{t.business.process_title}</h3>
                 <p className="text-neutral-400 mt-2 text-sm">{t.business.process_sub}</p>
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
                       <div className="text-4xl font-mono font-bold text-brand-800 mb-4 group-hover:text-brand-500 transition">0{i+1}</div>
                       <h4 className="font-bold text-lg mb-2">{step.t}</h4>
                       <p className="text-xs text-neutral-400 leading-relaxed">{step.d}</p>
                    </div>
                 ))}
             </div>
          </div>

          {/* Bookable Japanese Top Companies Section - 100 Companies */}
          <div className="mb-24">
             <div className="text-center mb-12">
                <h3 className="text-3xl font-serif text-neutral-900 mb-3">{localizedTexts.topCompanies}</h3>
                <p className="text-neutral-500 text-sm max-w-2xl mx-auto">{localizedTexts.companyIntro}</p>
             </div>

             {/* Company Categories */}
             <div className="space-y-12">
                {renderCompanyCategory(<Factory size={20} className="text-white" />, localizedTexts.automotive, 'Automotive Manufacturing', localizedCompanies.automotive)}
                {renderCompanyCategory(<Cpu size={20} className="text-white" />, localizedTexts.electronics, 'Electronics & Semiconductor', localizedCompanies.electronics)}
                {renderCompanyCategory(<Factory size={20} className="text-white" />, localizedTexts.precision, 'Precision Machinery & Automation', localizedCompanies.precision)}
                {renderCompanyCategory(<Stethoscope size={20} className="text-white" />, localizedTexts.medical, 'Healthcare & Medical', localizedCompanies.medical)}
                {renderCompanyCategory(<Monitor size={20} className="text-white" />, localizedTexts.appliances, 'Consumer Electronics', localizedCompanies.appliances)}
                {renderCompanyCategory(<Building size={20} className="text-white" />, localizedTexts.retail, 'Retail & Service', localizedCompanies.retail)}
                {renderCompanyCategory(<Heart size={20} className="text-white" />, localizedTexts.hospitality, 'Hotel & Hospitality', localizedCompanies.hospitality)}
                {renderCompanyCategory(<Utensils size={20} className="text-white" />, localizedTexts.food, 'Food & Beverage', localizedCompanies.food)}
                {renderCompanyCategory(<Bus size={20} className="text-white" />, localizedTexts.logistics, 'Logistics & Transportation', localizedCompanies.logistics)}
                {renderCompanyCategory(<Globe size={20} className="text-white" />, localizedTexts.tech, 'Technology & Telecommunications', localizedCompanies.tech)}
             </div>

             {/* Stats Bar */}
             <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-brand-900 text-white p-6 rounded-xl text-center">
                   <div className="text-3xl font-bold">70+</div>
                   <div className="text-sm opacity-80">{localizedTexts.bookableCompanies}</div>
                </div>
                <div className="bg-brand-800 text-white p-6 rounded-xl text-center">
                   <div className="text-3xl font-bold">10</div>
                   <div className="text-sm opacity-80">{localizedTexts.industryCategories}</div>
                </div>
                <div className="bg-brand-700 text-white p-6 rounded-xl text-center">
                   <div className="text-3xl font-bold">16</div>
                   <div className="text-sm opacity-80">{currentLang === 'zh-TW' ? '考察方案' : currentLang === 'zh-CN' ? '考察方案' : currentLang === 'ja' ? '視察プラン' : 'Inspection Plans'}</div>
                </div>
             </div>

             {/* Note */}
             <div className="mt-8 p-6 bg-brand-50 rounded-xl border border-brand-100">
                <p className="text-sm text-brand-800">
                   <span className="font-bold">{localizedTexts.notice}</span>
                   <br />
                   {localizedTexts.noticeText}
                </p>
             </div>
          </div>

          {/* New Business Plans Section */}
          <div id="business-plans-section" className="mb-24 scroll-mt-24">
             <div className="text-center mb-16">
                <h3 className="text-3xl font-serif text-neutral-900">{t.business.itin_title}</h3>
                <p className="text-neutral-500 text-sm mt-2">{currentLang === 'zh-TW' ? '為企業高管精心策劃' : currentLang === 'zh-CN' ? '为企业高管精心策划' : currentLang === 'ja' ? 'エグゼクティブ向け厳選プラン' : 'Curated for Executives'}</p>
             </div>

             <div className="space-y-20">
                {t.business.plans?.map((plan: any, index: number) => (
                   <div key={plan.id} className="flex flex-col md:flex-row gap-10 items-start border-b border-neutral-200 pb-20 last:border-0 last:pb-0">
                      {/* Image - Smaller aspect than Golf */}
                      <div className="md:w-1/3 w-full">
                         <div className="relative rounded-xl overflow-hidden shadow-lg h-[250px] md:h-[320px] group">
                            {getBizImage(plan.id) ? (
                              <Image
                                 src={getBizImage(plan.id)}
                                 fill
                                 className="object-cover transform group-hover:scale-105 transition duration-700"
                                 alt={plan.title}
                                 sizes="(max-width: 768px) 100vw, 33vw"
                                 quality={75}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse flex items-center justify-center">
                                <div className="w-10 h-10 border-2 border-neutral-300 border-t-brand-500 rounded-full animate-spin" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition"></div>
                         </div>
                      </div>

                      {/* Content */}
                      <div className="md:w-2/3 w-full">
                         <div className="flex flex-wrap gap-2 mb-4">
                            {plan.tags.map((tag: string, i: number) => (
                               <span key={i} className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-1 rounded border border-brand-100">
                                  {tag}
                               </span>
                            ))}
                         </div>
                         <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">{plan.title}</h3>
                         <h4 className="text-sm font-bold text-neutral-500 mb-4">{plan.subtitle}</h4>
                         <p className="text-neutral-600 text-sm leading-relaxed mb-6 border-l-2 border-neutral-200 pl-4">{plan.desc}</p>

                         <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200">
                            <div className="space-y-3">
                               {plan.schedule.map((day: any, dIndex: number) => (
                                  <div key={dIndex} className="flex gap-4 text-xs md:text-sm">
                                     <span className="font-bold text-neutral-400 w-12 flex-shrink-0">{day.day}</span>
                                     <span className="text-neutral-700 leading-relaxed">{day.text}</span>
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
          <div id="business-contact" className="py-16 bg-neutral-50 -mx-6 px-6 py-12 md:py-24 mt-16">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">{localizedTexts.ctaTitle}</h3>
              <p className="text-neutral-500 mb-8">{localizedTexts.ctaSubtitle}</p>
              <ContactButtons />
            </div>
          </div>

          <div className="text-center mt-12">
             <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 mx-auto text-neutral-500 hover:text-brand-900 transition">
                <ArrowLeft size={16} /> {t.about.back}
             </button>
          </div>
      </div>
    </div>
   );
};

export default BusinessView;
