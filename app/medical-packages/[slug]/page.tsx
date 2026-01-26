'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Car, Building, Check, Shield, Lock, CreditCard } from 'lucide-react';
import SmartBackLink from '@/components/SmartBackLink';
import { translations, Language } from '@/translations';

// 套餐基础数据（不含翻译文本）
const packageColors = {
  'vip-member-course': {
    headerBg: 'bg-gray-900',
    title: 'text-yellow-400',
    price: 'text-yellow-400',
    check: 'text-yellow-500',
    button: 'bg-yellow-500 text-black hover:bg-yellow-400',
    cardBg: 'bg-gray-900',
    cardBorder: 'border-gray-800',
    badgeBg: 'bg-yellow-500 text-black',
  },
  'premium-cardiac-course': {
    headerBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
    title: 'text-blue-900',
    price: 'text-blue-900',
    check: 'text-blue-500',
    button: 'bg-blue-600 text-white hover:bg-blue-700',
    cardBg: 'bg-gradient-to-br from-blue-50 to-white',
    cardBorder: 'border-blue-200',
  },
  'select-gastro-colonoscopy': {
    headerBg: 'bg-gradient-to-r from-green-600 to-green-700',
    title: 'text-green-900',
    price: 'text-green-900',
    check: 'text-green-500',
    button: 'bg-green-600 text-white hover:bg-green-700',
    cardBg: 'bg-white',
    cardBorder: 'border-green-200',
  },
  'select-gastroscopy': {
    headerBg: 'bg-gradient-to-r from-teal-600 to-teal-700',
    title: 'text-teal-800',
    price: 'text-teal-800',
    check: 'text-teal-500',
    button: 'bg-teal-600 text-white hover:bg-teal-700',
    cardBg: 'bg-white',
    cardBorder: 'border-teal-200',
  },
  'dwibs-cancer-screening': {
    headerBg: 'bg-gradient-to-r from-purple-600 to-purple-700',
    title: 'text-purple-900',
    price: 'text-purple-900',
    check: 'text-purple-500',
    button: 'bg-purple-600 text-white hover:bg-purple-700',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-200',
  },
  'basic-checkup': {
    headerBg: 'bg-gradient-to-r from-gray-700 to-gray-800',
    title: 'text-gray-800',
    price: 'text-gray-800',
    check: 'text-gray-500',
    button: 'bg-gray-700 text-white hover:bg-gray-800',
    cardBg: 'bg-gray-50',
    cardBorder: 'border-gray-300',
  },
};

const packagePrices: Record<string, number> = {
  'vip-member-course': 1512500,
  'premium-cardiac-course': 825000,
  'select-gastro-colonoscopy': 825000,
  'select-gastroscopy': 687500,
  'dwibs-cancer-screening': 275000,
  'basic-checkup': 550000,
};

// 根据语言获取套餐数据
function getPackagesData(lang: Language) {
  const t = translations[lang].medical;
  return {
    'vip-member-course': {
      id: 'vip',
      slug: 'vip-member-course',
      name: t.pkg_vip_title,
      nameEn: 'VIP Member Course',
      price: packagePrices['vip-member-course'],
      description: t.pkg_vip_desc,
      longDescription: t.pkg_vip_desc,
      features: [t.pkg_vip_item_1, t.pkg_vip_item_2, t.pkg_vip_item_3, t.pkg_vip_item_4, t.pkg_vip_item_5, t.pkg_vip_item_6],
      badge: 'Flagship',
      isVIP: true,
      colors: packageColors['vip-member-course'],
    },
    'premium-cardiac-course': {
      id: 'premium',
      slug: 'premium-cardiac-course',
      name: t.pkg_premium_title,
      nameEn: 'Premium Cardiac Course',
      price: packagePrices['premium-cardiac-course'],
      description: t.pkg_premium_desc,
      longDescription: t.pkg_premium_desc,
      features: [t.pkg_premium_item_1, t.pkg_premium_item_2, t.pkg_premium_item_3, t.pkg_premium_item_4, t.pkg_premium_item_5],
      colors: packageColors['premium-cardiac-course'],
    },
    'select-gastro-colonoscopy': {
      id: 'select-both',
      slug: 'select-gastro-colonoscopy',
      name: t.pkg_select_gc_title,
      nameEn: 'Gastro + Colonoscopy Course',
      price: packagePrices['select-gastro-colonoscopy'],
      description: t.pkg_select_gc_desc,
      longDescription: t.pkg_select_gc_desc,
      features: [t.pkg_select_gc_item_1, t.pkg_select_gc_item_2, t.pkg_select_gc_item_3, t.pkg_select_gc_item_4, t.pkg_select_gc_item_5],
      colors: packageColors['select-gastro-colonoscopy'],
    },
    'select-gastroscopy': {
      id: 'select-gastro',
      slug: 'select-gastroscopy',
      name: t.pkg_select_g_title,
      nameEn: 'Gastroscopy Course',
      price: packagePrices['select-gastroscopy'],
      description: t.pkg_select_g_desc,
      longDescription: t.pkg_select_g_desc,
      features: [t.pkg_select_g_item_1, t.pkg_select_g_item_2, t.pkg_select_g_item_3, t.pkg_select_g_item_4, t.pkg_select_g_item_5],
      colors: packageColors['select-gastroscopy'],
    },
    'dwibs-cancer-screening': {
      id: 'dwibs',
      slug: 'dwibs-cancer-screening',
      name: t.pkg_dwibs_title,
      nameEn: 'DWIBS Cancer Screening',
      price: packagePrices['dwibs-cancer-screening'],
      description: t.pkg_dwibs_desc,
      longDescription: t.pkg_dwibs_desc,
      features: [t.pkg_dwibs_item_1, t.pkg_dwibs_item_2, t.pkg_dwibs_item_3, t.pkg_dwibs_item_4, t.pkg_dwibs_item_5],
      colors: packageColors['dwibs-cancer-screening'],
    },
    'basic-checkup': {
      id: 'basic',
      slug: 'basic-checkup',
      name: t.pkg_basic_title,
      nameEn: 'Standard Checkup Course',
      price: packagePrices['basic-checkup'],
      description: t.pkg_basic_desc,
      longDescription: t.pkg_basic_desc,
      features: [t.pkg_basic_item_1, t.pkg_basic_item_2, t.pkg_basic_item_3, t.pkg_basic_item_4, t.pkg_basic_item_5],
      colors: packageColors['basic-checkup'],
    },
  };
}

// 根据语言获取增值服务数据
function getAddOnServices(lang: Language) {
  const t = translations[lang].medical.pkgDetail;
  return [
    { id: 'airport_pickup', name: t.addOnAirportPickup, description: t.addOnAirportPickupDesc, price: 22000, icon: Car },
    { id: 'airport_dropoff', name: t.addOnAirportDropoff, description: t.addOnAirportDropoffDesc, price: 22000, icon: Car },
    { id: 'hotel_booking', name: t.addOnHotel, description: t.addOnHotelDesc, price: null, icon: Building },
  ];
}

export default function PackageDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // 读取当前语言
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    // 如果没有 cookie，根据浏览器语言判断
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
  }, []);

  // 获取当前语言的翻译
  const t = translations[currentLang].medical.pkgDetail;
  const packagesData = getPackagesData(currentLang);
  const ADD_ON_SERVICES = getAddOnServices(currentLang);
  const pkg = packagesData[slug];

  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    line: '',
    wechat: '',
    whatsapp: '',
    company: '',
    country: 'TW'
  });
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [contactError, setContactError] = useState('');

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">{t.notFound}</p>
          <Link href="/?page=medical" className="text-blue-600 hover:underline">{t.backToList}</Link>
        </div>
      </div>
    );
  }

  // 检查是否至少填写了一种联系方式
  const hasValidContact = () => {
    return customerInfo.phone.trim() !== '' ||
           customerInfo.email.trim() !== '' ||
           customerInfo.line.trim() !== '' ||
           customerInfo.wechat.trim() !== '' ||
           customerInfo.whatsapp.trim() !== '';
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactError('');
    setProcessing(true);
    try {
      if (!customerInfo.name) {
        alert(t.nameRequired);
        setProcessing(false);
        return;
      }
      if (!hasValidContact()) {
        setContactError(t.contactError);
        setProcessing(false);
        return;
      }

      // 构建联系方式信息
      const contactMethods: string[] = [];
      if (customerInfo.phone) contactMethods.push(`電話: ${customerInfo.phone}`);
      if (customerInfo.email) contactMethods.push(`郵箱: ${customerInfo.email}`);
      if (customerInfo.line) contactMethods.push(`LINE: ${customerInfo.line}`);
      if (customerInfo.wechat) contactMethods.push(`微信: ${customerInfo.wechat}`);
      if (customerInfo.whatsapp) contactMethods.push(`WhatsApp: ${customerInfo.whatsapp}`);

      const addOnNames = selectedAddOns.map(id => ADD_ON_SERVICES.find(s => s.id === id)?.name || '').filter(Boolean);
      let fullNotes = '';
      if (contactMethods.length > 0) {
        fullNotes += `【聯繫方式】\n${contactMethods.join('\n')}\n\n`;
      }
      if (addOnNames.length > 0) {
        fullNotes += `【增值服務需求】${addOnNames.join('、')}\n\n`;
      }
      if (notes) {
        fullNotes += notes;
      }

      // 将体检时间段 "9:00-16:00" 添加到 notes 中，因为 preferredTime 只接受 HH:MM 格式
      const notesWithTime = `【體檢時段】9:00 - 16:00\n\n${fullNotes}`.trim();

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageSlug: slug, customerInfo, preferredDate: preferredDate || null, notes: notesWithTime || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '創建支付會話失敗');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else throw new Error(t.paymentLinkError);
    } catch (error: any) {
      alert(error.message || t.paymentError);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <SmartBackLink
            defaultHref="/?page=medical"
            defaultLabel={t.backToList}
            memberHref="/?page=medical"
            memberLabel={t.backToList}
          />
        </div>
      </div>

      {/* Package Hero */}
      <div className={`${pkg.colors.headerBg} py-12`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              {pkg.badge && (
                <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 ${pkg.colors.badgeBg || 'bg-white/20 text-white'}`}>
                  {pkg.badge}
                </span>
              )}
              <h1 className={`text-3xl md:text-4xl font-serif font-bold ${pkg.isVIP ? 'text-yellow-400' : 'text-white'}`}>{pkg.name}</h1>
              <p className={`text-sm mt-2 ${pkg.isVIP ? 'text-gray-400' : 'text-white/70'}`}>{pkg.nameEn}</p>
            </div>
            <div className="text-right">
              <p className={`text-4xl md:text-5xl font-bold ${pkg.isVIP ? 'text-yellow-400' : 'text-white'}`}>¥{pkg.price.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${pkg.isVIP ? 'text-gray-500' : 'text-white/60'}`}>{t.priceNote}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Package Info */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 border ${pkg.colors.cardBorder} ${pkg.colors.cardBg} ${pkg.isVIP ? 'text-white' : ''} sticky top-8`}>
              <h3 className={`text-lg font-serif font-bold mb-3 ${pkg.colors.title}`}>{t.pkgIncludes}</h3>
              <p className={`text-sm mb-6 leading-relaxed ${pkg.isVIP ? 'text-gray-300' : 'text-gray-500'}`}>{pkg.longDescription}</p>
              <div className={`space-y-2.5 text-sm ${pkg.isVIP ? '' : 'text-gray-700'}`}>
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle size={16} className={`shrink-0 mt-0.5 ${pkg.colors.check}`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-6 pt-6 border-t ${pkg.isVIP ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${pkg.isVIP ? 'text-gray-400' : 'text-gray-500'}`}>{t.pkgPrice}</span>
                  <span className={`text-xl font-bold ${pkg.colors.price}`}>¥{pkg.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{t.bookingTitle}</h2>
              <form onSubmit={handleSubmit}>
                {/* 基本信息 */}
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.formName} <span className="text-red-500">*</span></label>
                    <input type="text" required value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder={t.formNamePlaceholder} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.formCompany}</label>
                    <input type="text" value={customerInfo.company} onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder={t.formCompanyPlaceholder} />
                  </div>
                </div>

                {/* 联系方式 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">{t.formContact} <span className="text-red-500">*</span></label>
                    <span className="text-xs text-gray-400">{t.formContactRequired}</span>
                  </div>
                  {contactError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {contactError}
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">{t.formPhone}</label>
                      <input type="tel" value={customerInfo.phone} onChange={(e) => { setCustomerInfo({ ...customerInfo, phone: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder={t.formPhonePlaceholder} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">{t.formEmail}</label>
                      <input type="email" value={customerInfo.email} onChange={(e) => { setCustomerInfo({ ...customerInfo, email: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder={t.formEmailPlaceholder} />
                      <p className="mt-1 text-xs text-gray-400">{t.formEmailNote}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">{t.formLine}</label>
                      <input type="text" value={customerInfo.line} onChange={(e) => { setCustomerInfo({ ...customerInfo, line: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder={t.formLinePlaceholder} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">{t.formWechat}</label>
                      <input type="text" value={customerInfo.wechat} onChange={(e) => { setCustomerInfo({ ...customerInfo, wechat: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder={t.formWechatPlaceholder} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1.5">{t.formWhatsapp}</label>
                      <input type="tel" value={customerInfo.whatsapp} onChange={(e) => { setCustomerInfo({ ...customerInfo, whatsapp: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder={t.formWhatsappPlaceholder} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">{t.formContactNote}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.formDate}</label>
                    <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.formTime}</label>
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm">{t.formTimeFixed}</div>
                    <p className="mt-1.5 text-xs text-gray-400">{t.formTimeNote}</p>
                  </div>
                </div>

                {/* Add-on Services */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.addOnTitle}</h3>
                  <div className="space-y-3">
                    {ADD_ON_SERVICES.map((service) => {
                      const isSelected = selectedAddOns.includes(service.id);
                      const ServiceIcon = service.icon;
                      return (
                        <button key={service.id} type="button" onClick={() => setSelectedAddOns(isSelected ? selectedAddOns.filter(id => id !== service.id) : [...selectedAddOns, service.id])}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <ServiceIcon size={20} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{service.name}</span>
                              {isSelected && <Check className="w-5 h-5 text-gray-900" />}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                            <p className="text-sm font-semibold mt-1 text-gray-900">{service.price ? `¥${service.price.toLocaleString()}` : t.addOnFreeConsult}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedAddOns.length > 0 && <p className="mt-3 text-xs text-gray-400">{t.addOnNote}</p>}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.formNotes}</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder={t.formNotesPlaceholder} />
                </div>

                {/* Cancellation Policy */}
                <div className="mb-8 bg-amber-50 border border-amber-100 rounded-xl p-5">
                  <h3 className="font-semibold text-amber-800 mb-3 text-sm">{t.cancelPolicy}</h3>
                  <ul className="text-sm text-amber-700 space-y-1.5">
                    <li>• {t.cancelPolicy1}</li>
                    <li>• {t.cancelPolicy2}</li>
                    <li>• {t.cancelPolicy3}</li>
                  </ul>
                </div>

                <button type="submit" disabled={processing} className={`w-full py-4 text-base font-bold rounded-xl transition-all ${pkg.colors.button} disabled:opacity-50`}>
                  {processing ? t.processing : `${t.submitBtn} ¥${pkg.price.toLocaleString()}`}
                </button>
                <p className="mt-4 text-xs text-gray-400 text-center">{t.stripeNote}</p>

                {/* Payment Method Icons */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="text-xs text-gray-400">{t.paymentMethods}</span>
                  <div className="flex items-center gap-2">
                    <Image src="/icons/payment/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/mastercard.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/amex.svg" alt="American Express" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/jcb.svg" alt="JCB" width={40} height={25} className="h-6 w-auto" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5"><Lock size={14} /><span>{t.securitySSL}</span></div>
                  <div className="flex items-center gap-1.5"><CreditCard size={14} /><span>{t.securityStripe}</span></div>
                  <div className="flex items-center gap-1.5"><Shield size={14} /><span>{t.securityPrivacy}</span></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
