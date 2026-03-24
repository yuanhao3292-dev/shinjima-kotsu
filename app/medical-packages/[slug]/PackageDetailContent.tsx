'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Car, Building, Check, Shield, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import SmartBackLink from '@/components/SmartBackLink';
import ProviderBanner, { useProviderKey } from '@/components/ProviderBanner';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import { translations, Language } from '@/translations';

// 套餐基础数据（不含翻译文本）
const packageColors: Record<string, {
  headerBg: string;
  title: string;
  price: string;
  check: string;
  button: string;
  cardBg: string;
  cardBorder: string;
  badgeBg?: string;
}> = {
  'vip-member-course': {
    headerBg: 'bg-brand-900',
    title: 'text-gold-400',
    price: 'text-gold-400',
    check: 'text-gold-400',
    button: 'bg-gold-400 text-brand-900 hover:bg-gold-300',
    cardBg: 'bg-brand-900',
    cardBorder: 'border-gold-400/30',
    badgeBg: 'bg-gold-400 text-brand-900',
  },
  'premium-cardiac-course': {
    headerBg: 'bg-brand-900',
    title: 'text-brand-900',
    price: 'text-brand-900',
    check: 'text-brand-700',
    button: 'bg-gold-400 text-brand-900 hover:bg-gold-300',
    cardBg: 'bg-neutral-50',
    cardBorder: 'border-neutral-200',
  },
  'select-gastro-colonoscopy': {
    headerBg: 'bg-brand-900',
    title: 'text-brand-900',
    price: 'text-brand-900',
    check: 'text-brand-700',
    button: 'bg-gold-400 text-brand-900 hover:bg-gold-300',
    cardBg: 'bg-neutral-50',
    cardBorder: 'border-neutral-200',
  },
  'select-gastroscopy': {
    headerBg: 'bg-brand-900',
    title: 'text-brand-900',
    price: 'text-brand-900',
    check: 'text-brand-700',
    button: 'bg-gold-400 text-brand-900 hover:bg-gold-300',
    cardBg: 'bg-neutral-50',
    cardBorder: 'border-neutral-200',
  },
  'dwibs-cancer-screening': {
    headerBg: 'bg-brand-900',
    title: 'text-brand-900',
    price: 'text-brand-900',
    check: 'text-brand-700',
    button: 'bg-gold-400 text-brand-900 hover:bg-gold-300',
    cardBg: 'bg-neutral-50',
    cardBorder: 'border-neutral-200',
  },
  'basic-checkup': {
    headerBg: 'bg-brand-900',
    title: 'text-brand-900',
    price: 'text-brand-900',
    check: 'text-brand-700',
    button: 'bg-gold-400 text-brand-900 hover:bg-gold-300',
    cardBg: 'bg-neutral-50',
    cardBorder: 'border-neutral-200',
  },
};

// 价格统一从 MEDICAL_PACKAGES 配置读取（SSOT）
const packagePrices: Record<string, number> = Object.fromEntries(
  Object.entries(MEDICAL_PACKAGES)
    .filter(([, pkg]) => pkg.category === 'health_checkup')
    .map(([slug, pkg]) => [slug, pkg.priceJpy])
);

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
  } as Record<string, {
    id: string; slug: string; name: string; nameEn: string;
    price: number; description: string; longDescription: string;
    features: string[]; badge?: string; isVIP?: boolean;
    colors: typeof packageColors[string];
  }>;
}

// 根据语言获取增值服务数据
function getAddOnServices(lang: Language) {
  const t = translations[lang].medical.pkgDetail;
  return [
    { id: 'airport_pickup', name: t.addOnAirportPickup, description: t.addOnAirportPickupDesc, price: 22000, icon: Car },
    { id: 'airport_dropoff', name: t.addOnAirportDropoff, description: t.addOnAirportDropoffDesc, price: 22000, icon: Car },
    { id: 'hotel_booking', name: t.addOnHotel, description: t.addOnHotelDesc, price: null as number | null, icon: Building },
  ];
}

interface PackageDetailContentProps {
  packageSlug: string;
  /** 导游站内嵌模式：隐藏 ProviderBanner，返回按钮指向导游站 */
  isGuideEmbed?: boolean;
  /** 导游站返回路径 */
  backHref?: string;
  /** 导游 slug，用于订单归因 */
  guideSlug?: string;
}

export default function PackageDetailContent({
  packageSlug,
  isGuideEmbed,
  backHref,
  guideSlug,
}: PackageDetailContentProps) {
  const rawProviderKey = useProviderKey();
  const providerKey = isGuideEmbed ? null : rawProviderKey;

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
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
  }, []);

  const t = translations[currentLang].medical.pkgDetail;
  const packagesData = getPackagesData(currentLang);
  const ADD_ON_SERVICES = getAddOnServices(currentLang);
  const pkg = packagesData[packageSlug];

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [consents, setConsents] = useState({ cancel: false, tokushoho: false, privacy: false });

  if (!pkg) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-xl text-neutral-600 mb-4">{t.notFound}</p>
          <Link href={backHref || '/medical'} className="text-brand-700 hover:underline">{t.backToList}</Link>
        </div>
      </div>
    );
  }

  const hasValidContact = () => {
    return customerInfo.phone.trim() !== '' ||
           customerInfo.email.trim() !== '' ||
           customerInfo.line.trim() !== '' ||
           customerInfo.wechat.trim() !== '' ||
           customerInfo.whatsapp.trim() !== '';
  };

  /** 客户端表单验证，返回 true 表示通过 */
  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!customerInfo.name.trim()) {
      errors.name = t.nameRequired;
    }
    if (customerInfo.phone.trim() && customerInfo.phone.trim().length < 8) {
      errors.phone = t.phoneTooShort;
    }
    if (customerInfo.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())) {
      errors.email = t.emailInvalid;
    }

    setFieldErrors(errors);

    if (!hasValidContact()) {
      setContactError(t.contactError);
      return false;
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    try {
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

      const notesWithTime = `【體檢時段】9:00 - 16:00\n\n${fullNotes}`.trim();

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug,
          customerInfo,
          preferredDate: preferredDate || null,
          notes: notesWithTime || null,
          provider: providerKey,
          locale: currentLang,
          consents,
          ...(isGuideEmbed && guideSlug ? { guideSlug } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '創建支付會話失敗');
      }
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else throw new Error(t.paymentLinkError);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t.paymentError;
      alert(message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      {!isGuideEmbed && (
        <Suspense fallback={null}>
          <ProviderBanner lang={currentLang as 'ja' | 'zh-TW' | 'zh-CN' | 'en'} />
        </Suspense>
      )}

      {/* Header / Back link */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {isGuideEmbed && backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              {t.backToList}
            </Link>
          ) : (
            <SmartBackLink
              defaultHref="/medical"
              defaultLabel={t.backToList}
              memberHref="/medical"
              memberLabel={t.backToList}
            />
          )}
        </div>
      </div>

      {/* Package Hero */}
      <div className={`${pkg.colors.headerBg} py-12`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              {pkg.badge && (
                <span className={`inline-block text-[10px] font-bold px-3 py-1 uppercase tracking-wider mb-3 ${pkg.colors.badgeBg || 'bg-white/20 text-white'}`}>
                  {pkg.badge}
                </span>
              )}
              <h1 className={`text-3xl md:text-4xl font-serif font-bold ${pkg.isVIP ? 'text-gold-400' : 'text-white'}`}>{pkg.name}</h1>
              <p className={`text-sm mt-2 ${pkg.isVIP ? 'text-neutral-400' : 'text-neutral-300'}`}>{pkg.nameEn}</p>
            </div>
            <div className="text-right">
              <p className={`text-4xl md:text-5xl font-bold ${pkg.isVIP ? 'text-gold-400' : 'text-white'}`}>¥{pkg.price.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${pkg.isVIP ? 'text-neutral-500' : 'text-neutral-300'}`}>{t.priceNote}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Package Info */}
          <div className="lg:col-span-1">
            <div className={`p-6 border ${pkg.colors.cardBorder} ${pkg.colors.cardBg} ${pkg.isVIP ? 'text-white' : ''} sticky top-8`}>
              <h3 className={`text-lg font-serif font-bold mb-3 ${pkg.colors.title}`}>{t.pkgIncludes}</h3>
              <p className={`text-sm mb-6 leading-relaxed ${pkg.isVIP ? 'text-neutral-300' : 'text-neutral-500'}`}>{pkg.longDescription}</p>
              <div className={`space-y-2.5 text-sm ${pkg.isVIP ? '' : 'text-neutral-700'}`}>
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle size={16} className={`shrink-0 mt-0.5 ${pkg.colors.check}`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-6 pt-6 border-t ${pkg.isVIP ? 'border-neutral-700' : 'border-neutral-200'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${pkg.isVIP ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.pkgPrice}</span>
                  <span className={`text-xl font-bold ${pkg.colors.price}`}>¥{pkg.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-2xl font-serif font-bold text-brand-900 mb-6">{t.bookingTitle}</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t.formName} <span className="text-red-500">*</span></label>
                    <input type="text" required value={customerInfo.name} onChange={(e) => { setCustomerInfo({ ...customerInfo, name: e.target.value }); setFieldErrors(prev => { const { name: _, ...rest } = prev; return rest; }); }} className={`w-full px-4 py-2.5 border focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm ${fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-neutral-200'}`} placeholder={t.formNamePlaceholder} />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t.formCompany}</label>
                    <input type="text" value={customerInfo.company} onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm" placeholder={t.formCompanyPlaceholder} />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-neutral-700">{t.formContact} <span className="text-red-500">*</span></label>
                    <span className="text-xs text-neutral-400">{t.formContactRequired}</span>
                  </div>
                  {contactError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 text-sm text-red-600">
                      {contactError}
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1.5">{t.formPhone}</label>
                      <input type="tel" value={customerInfo.phone} onChange={(e) => { setCustomerInfo({ ...customerInfo, phone: e.target.value }); setContactError(''); setFieldErrors(prev => { const { phone: _, ...rest } = prev; return rest; }); }} className={`w-full px-4 py-2.5 border focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-neutral-200'}`} placeholder={t.formPhonePlaceholder} />
                      {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1.5">{t.formEmail}</label>
                      <input type="email" value={customerInfo.email} onChange={(e) => { setCustomerInfo({ ...customerInfo, email: e.target.value }); setContactError(''); setFieldErrors(prev => { const { email: _, ...rest } = prev; return rest; }); }} className={`w-full px-4 py-2.5 border focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-neutral-200'}`} placeholder={t.formEmailPlaceholder} />
                      {fieldErrors.email ? <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p> : <p className="mt-1 text-xs text-neutral-400">{t.formEmailNote}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1.5">{t.formLine}</label>
                      <input type="text" value={customerInfo.line} onChange={(e) => { setCustomerInfo({ ...customerInfo, line: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-neutral-200 focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm" placeholder={t.formLinePlaceholder} />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1.5">{t.formWechat}</label>
                      <input type="text" value={customerInfo.wechat} onChange={(e) => { setCustomerInfo({ ...customerInfo, wechat: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-neutral-200 focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm" placeholder={t.formWechatPlaceholder} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-neutral-500 mb-1.5">{t.formWhatsapp}</label>
                      <input type="tel" value={customerInfo.whatsapp} onChange={(e) => { setCustomerInfo({ ...customerInfo, whatsapp: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-neutral-200 focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm" placeholder={t.formWhatsappPlaceholder} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-neutral-400">{t.formContactNote}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t.formDate}</label>
                    <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full px-4 py-2.5 border border-neutral-200 focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t.formTime}</label>
                    <div className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-600 text-sm">{t.formTimeFixed}</div>
                    <p className="mt-1.5 text-xs text-neutral-400">{t.formTimeNote}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-brand-900 mb-4">{t.addOnTitle}</h3>
                  <div className="space-y-3">
                    {ADD_ON_SERVICES.map((service) => {
                      const isSelected = selectedAddOns.includes(service.id);
                      const ServiceIcon = service.icon;
                      return (
                        <button key={service.id} type="button" onClick={() => setSelectedAddOns(isSelected ? selectedAddOns.filter(id => id !== service.id) : [...selectedAddOns, service.id])}
                          className={`w-full p-4 border-2 text-left transition-all flex items-start gap-4 ${isSelected ? 'border-brand-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
                          <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-brand-900 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                            <ServiceIcon size={20} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${isSelected ? 'text-brand-900' : 'text-neutral-700'}`}>{service.name}</span>
                              {isSelected && <Check className="w-5 h-5 text-brand-900" />}
                            </div>
                            <p className="text-sm text-neutral-500 mt-1">{service.description}</p>
                            <p className="text-sm font-semibold mt-1 text-brand-900">{service.price ? `¥${service.price.toLocaleString()}` : t.addOnFreeConsult}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedAddOns.length > 0 && <p className="mt-3 text-xs text-neutral-400">{t.addOnNote}</p>}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">{t.formNotes}</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-700 focus:border-transparent text-sm" placeholder={t.formNotesPlaceholder} />
                </div>

                <div className="mb-8 bg-amber-50 border border-amber-100 p-5">
                  <h3 className="font-semibold text-amber-800 mb-3 text-sm">{t.cancelPolicy}</h3>
                  <ul className="text-sm text-amber-700 space-y-1.5">
                    <li>• {t.cancelPolicy1}</li>
                    <li>• {t.cancelPolicy2}</li>
                    <li>• {t.cancelPolicy3}</li>
                  </ul>
                </div>

                {/* Medical Disclaimer */}
                <p className="mb-6 text-xs text-neutral-500 leading-relaxed">{t.medicalDisclaimer}</p>

                {/* Legal Consent Checkboxes */}
                <div className="mb-8 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={consents.cancel} onChange={(e) => setConsents({ ...consents, cancel: e.target.checked })} className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-900 focus:ring-brand-700" />
                    <span className="text-sm text-neutral-700">{t.consentCancel}</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={consents.tokushoho} onChange={(e) => setConsents({ ...consents, tokushoho: e.target.checked })} className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-900 focus:ring-brand-700" />
                    <span className="text-sm text-neutral-700"><Link href="/legal/tokushoho" target="_blank" className="underline hover:text-brand-900">{t.consentTokushoho}</Link></span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={consents.privacy} onChange={(e) => setConsents({ ...consents, privacy: e.target.checked })} className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-900 focus:ring-brand-700" />
                    <span className="text-sm text-neutral-700"><Link href="/legal/privacy" target="_blank" className="underline hover:text-brand-900">{t.consentPrivacy}</Link></span>
                  </label>
                  {!(consents.cancel && consents.tokushoho && consents.privacy) && (
                    <p className="text-xs text-amber-600">{t.consentRequired}</p>
                  )}
                </div>

                <button type="submit" disabled={processing || !(consents.cancel && consents.tokushoho && consents.privacy)} className={`w-full py-4 text-base font-bold transition-all ${pkg.colors.button} disabled:opacity-50`}>
                  {processing ? t.processing : `${t.submitBtn} ¥${pkg.price.toLocaleString()}`}
                </button>
                <p className="mt-4 text-xs text-neutral-400 text-center">{t.stripeNote}</p>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="text-xs text-neutral-400">{t.paymentMethods}</span>
                  <div className="flex items-center gap-2">
                    <Image src="/icons/payment/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/mastercard.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/amex.svg" alt="American Express" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/jcb.svg" alt="JCB" width={40} height={25} className="h-6 w-auto" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5"><Lock size={14} /><span>{t.securitySSL}</span></div>
                  <div className="flex items-center gap-1.5"><CreditCard size={14} /><span>{t.securityStripe}</span></div>
                  <div className="flex items-center gap-1.5"><Shield size={14} /><span>{t.securityPrivacy}</span></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
