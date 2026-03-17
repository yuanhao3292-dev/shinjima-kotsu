'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CheckoutLayout from '@/components/CheckoutLayout';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import ProviderBanner, { useProviderKey } from '@/components/ProviderBanner';
import { isValidSlug } from '@/lib/whitelabel-config';
import {
  ArrowLeft, Shield, Clock,
  Loader2, CreditCard, Lock,
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const ui = {
  backToMain: { ja: 'W CLINIC men\'sに戻る', 'zh-TW': '返回W CLINIC men\'s', 'zh-CN': '返回W CLINIC men\'s', en: 'Back to W CLINIC men\'s' } as Record<Language, string>,
  taxIncluded: { ja: '（税込）', 'zh-TW': '（含稅）', 'zh-CN': '（含税）', en: '(tax incl.)' } as Record<Language, string>,
  bookingInfo: { ja: 'ご予約情報', 'zh-TW': '預約信息', 'zh-CN': '预约信息', en: 'Booking Information' } as Record<Language, string>,
  contractNotice: { ja: 'ご契約について：本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。', 'zh-TW': '合約說明：本服務合約由新島交通株式會社（大阪府知事登録旅行業 第2-3115號）締結。', 'zh-CN': '合同说明：本服务合同由新岛交通株式会社（大阪府知事登录旅行业 第2-3115号）締结。', en: 'Contract Notice: This service contract is concluded with Niijima Kotsu Co., Ltd. (Osaka Prefecture Registered Travel Agency No. 2-3115).' } as Record<Language, string>,
  contactName: { ja: 'お名前 *', 'zh-TW': '姓名 *', 'zh-CN': '姓名 *', en: 'Name *' } as Record<Language, string>,
  contactNamePh: { ja: 'お名前をご入力ください', 'zh-TW': '請輸入姓名', 'zh-CN': '请输入姓名', en: 'Enter your name' } as Record<Language, string>,
  region: { ja: '所在地域', 'zh-TW': '所在地區', 'zh-CN': '所在地区', en: 'Region' } as Record<Language, string>,
  phone: { ja: '携帯電話番号', 'zh-TW': '手機號碼', 'zh-CN': '手机号码', en: 'Mobile Phone' } as Record<Language, string>,
  phonePh: { ja: '+81 090-1234-5678', 'zh-TW': '+886 912345678', 'zh-CN': '+86 13812345678', en: '+1 234-567-8900' } as Record<Language, string>,
  email: { ja: 'メールアドレス', 'zh-TW': '電子郵箱', 'zh-CN': '电子邮箱', en: 'Email' } as Record<Language, string>,
  emailPh: { ja: 'example@email.com', 'zh-TW': 'example@email.com', 'zh-CN': 'example@email.com', en: 'example@email.com' } as Record<Language, string>,
  lineId: { ja: 'LINE ID', 'zh-TW': 'LINE ID', 'zh-CN': 'LINE ID', en: 'LINE ID' } as Record<Language, string>,
  lineIdPh: { ja: 'LINE IDをご入力ください', 'zh-TW': '您的 LINE ID', 'zh-CN': '您的 LINE ID', en: 'Your LINE ID' } as Record<Language, string>,
  wechat: { ja: 'WeChat ID', 'zh-TW': '微信 WeChat', 'zh-CN': '微信 WeChat', en: 'WeChat ID' } as Record<Language, string>,
  wechatPh: { ja: 'WeChat IDをご入力ください', 'zh-TW': '您的微信號', 'zh-CN': '您的微信号', en: 'Your WeChat ID' } as Record<Language, string>,
  contactRequired: { ja: '* 少なくとも一つの連絡方法をご入力ください', 'zh-TW': '* 至少填寫一種聯繫方式', 'zh-CN': '* 至少填写一种联系方式', en: '* At least one contact method required' } as Record<Language, string>,
  preferredDate: { ja: 'ご希望日程', 'zh-TW': '希望就診日期', 'zh-CN': '希望就诊日期', en: 'Preferred Date' } as Record<Language, string>,
  preferredDatePh: { ja: '例: 2025年3月中旬希望', 'zh-TW': '例: 2025年3月中旬', 'zh-CN': '例: 2025年3月中旬', en: 'e.g., Mid-March 2025' } as Record<Language, string>,
  notes: { ja: '補足説明', 'zh-TW': '補充說明', 'zh-CN': '补充说明', en: 'Additional Notes' } as Record<Language, string>,
  notesPh: { ja: 'その他ご質問等がございましたらこちらにご記入ください', 'zh-TW': '如有其他問題請在此填寫', 'zh-CN': '如有其他问题请在此填写', en: 'Any questions or additional information' } as Record<Language, string>,
  serviceFee: { ja: 'サービス料金', 'zh-TW': '服務費用', 'zh-CN': '服务费用', en: 'Service Fee' } as Record<Language, string>,
  paymentNotice: { ja: 'お支払い完了後、24時間以内にご連絡いたします', 'zh-TW': '支付完成後，24小時內與您聯繫', 'zh-CN': '支付完成后，24小时内与您联系', en: 'We will contact you within 24 hours after payment' } as Record<Language, string>,
  confirmPayment: { ja: '確認してお支払い', 'zh-TW': '確認並支付', 'zh-CN': '确认并支付', en: 'Confirm & Pay' } as Record<Language, string>,
  processing: { ja: '処理中...', 'zh-TW': '處理中...', 'zh-CN': '处理中...', en: 'Processing...' } as Record<Language, string>,
  securePayment: { ja: '安全なお支払い', 'zh-TW': '安全支付', 'zh-CN': '安全支付', en: 'Secure Payment' } as Record<Language, string>,
  contact24h: { ja: '24時間以内にご連絡', 'zh-TW': '24小時內聯繫', 'zh-CN': '24小时内联系', en: '24h Contact' } as Record<Language, string>,
  notFound: { ja: '指定の診療項目が見つかりません', 'zh-TW': '找不到該診療項目', 'zh-CN': '找不到该诊疗项目', en: 'Treatment not found' } as Record<Language, string>,
  regionTW: { ja: '台湾', 'zh-TW': '台灣', 'zh-CN': '台湾', en: 'Taiwan' } as Record<Language, string>,
  regionCN: { ja: '中国本土', 'zh-TW': '中國大陸', 'zh-CN': '中国大陆', en: 'Mainland China' } as Record<Language, string>,
  regionHK: { ja: '香港', 'zh-TW': '香港', 'zh-CN': '香港', en: 'Hong Kong' } as Record<Language, string>,
  regionJP: { ja: '日本', 'zh-TW': '日本', 'zh-CN': '日本', en: 'Japan' } as Record<Language, string>,
  regionOther: { ja: 'その他', 'zh-TW': '其他', 'zh-CN': '其他', en: 'Other' } as Record<Language, string>,
  alertName: { ja: 'お名前をご入力ください', 'zh-TW': '請填寫姓名', 'zh-CN': '请填写姓名', en: 'Please enter your name' } as Record<Language, string>,
  alertContact: { ja: '少なくとも一つの連絡方法をご入力ください', 'zh-TW': '請至少填寫一種聯繫方式', 'zh-CN': '请至少填写一种联系方式', en: 'Please provide at least one contact method' } as Record<Language, string>,
};

export default function WClinicMensCheckoutPage() {
  const params = useParams();
  const providerKey = useProviderKey();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const guideSlugParam = searchParams.get('guide');
  const guideSlug = guideSlugParam && isValidSlug(guideSlugParam) ? guideSlugParam : null;
  const backHref = guideSlug ? `/g/${guideSlug}/wclinic-mens` : '/wclinic-mens';

  const pkg = MEDICAL_PACKAGES[slug];

  const [lang, setLang] = useState<Language>('zh-CN');
  const [processing, setProcessing] = useState(false);
  const [contactError, setContactError] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '', email: '', phone: '', line: '', wechat: '', country: 'CN',
  });
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

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
    else if (bl === 'zh-TW' || bl === 'zh-Hant') setLang('zh-TW');
    else if (bl === 'zh-CN' || bl === 'zh-Hans' || bl.startsWith('zh')) setLang('zh-CN');
    else if (bl.startsWith('en')) setLang('en');
  }, []);

  const t = (key: keyof typeof ui): string => ui[key][lang] || ui[key]['zh-CN'];

  if (!pkg || !slug.startsWith('wclinic-')) {
    return (
      <CheckoutLayout>
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">{ui.notFound[lang]}</p>
            <Link href={backHref} className="text-amber-600 hover:underline">{t('backToMain')}</Link>
          </div>
        </div>
      </CheckoutLayout>
    );
  }

  const getName = () => {
    switch (lang) {
      case 'ja': return pkg.nameJa;
      case 'en': return pkg.nameEn;
      default: return pkg.nameZhTw;
    }
  };

  const hasValidContact = () =>
    customerInfo.phone.trim() !== '' ||
    customerInfo.email.trim() !== '' ||
    customerInfo.line.trim() !== '' ||
    customerInfo.wechat.trim() !== '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactError('');
    setProcessing(true);

    try {
      if (!customerInfo.name) { alert(t('alertName')); setProcessing(false); return; }
      if (!hasValidContact()) { setContactError(t('alertContact')); setProcessing(false); return; }

      const contactMethods: string[] = [];
      if (customerInfo.phone) contactMethods.push(`${t('phone')}: ${customerInfo.phone}`);
      if (customerInfo.email) contactMethods.push(`${t('email')}: ${customerInfo.email}`);
      if (customerInfo.line) contactMethods.push(`LINE: ${customerInfo.line}`);
      if (customerInfo.wechat) contactMethods.push(`WeChat: ${customerInfo.wechat}`);

      let fullNotes = `【${getName()}】\n\n`;
      fullNotes += `【${t('region')}】${customerInfo.country}\n`;
      fullNotes += `【連絡先】\n${contactMethods.join('\n')}\n`;
      if (preferredDate) fullNotes += `\n【${t('preferredDate')}】${preferredDate}\n`;
      if (notes) fullNotes += `\n【${t('notes')}】\n${notes}`;

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: slug,
          customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email || '',
            phone: customerInfo.phone,
            line: customerInfo.line,
            wechat: customerInfo.wechat,
            country: customerInfo.country,
          },
          preferredDate: preferredDate || null,
          notes: fullNotes,
          provider: providerKey || 'wclinic_mens',
          locale: lang,
          ...(guideSlug ? { guideSlug } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create checkout session');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else throw new Error('Failed to retrieve payment link');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Payment error, please try again';
      alert(message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <CheckoutLayout>
      <Suspense fallback={null}>
        <ProviderBanner lang={lang} />
      </Suspense>

      {/* Back link */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-900 transition">
            <ArrowLeft size={16} />
            {t('backToMain')}
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#293f58] to-[#1a2a3e] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 bg-white/10 text-[#00c300]">W CLINIC men&apos;s</span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">{getName()}</h1>
              <p className="text-gray-400 text-sm mt-1">{pkg.nameEn}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl md:text-4xl font-bold text-white">¥{pkg.priceJpy.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{t('taxIncluded')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">{t('bookingInfo')}</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">{t('contractNotice')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactName')}</label>
                <input type="text" required value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder={t('contactNamePh')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('region')}</label>
                <select value={customerInfo.country} onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="TW">{t('regionTW')}</option>
                  <option value="CN">{t('regionCN')}</option>
                  <option value="HK">{t('regionHK')}</option>
                  <option value="JP">{t('regionJP')}</option>
                  <option value="OTHER">{t('regionOther')}</option>
                </select>
              </div>
            </div>

            {/* Contact methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder={t('phonePh')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder={t('emailPh')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('lineId')}</label>
                <input type="text" value={customerInfo.line} onChange={(e) => setCustomerInfo({ ...customerInfo, line: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder={t('lineIdPh')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('wechat')}</label>
                <input type="text" value={customerInfo.wechat} onChange={(e) => setCustomerInfo({ ...customerInfo, wechat: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder={t('wechatPh')} />
              </div>
            </div>
            {contactError && <p className="text-sm text-red-500">{contactError}</p>}
            <p className="text-xs text-gray-400">{t('contactRequired')}</p>

            {/* Preferred date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('preferredDate')}</label>
              <input type="text" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder={t('preferredDatePh')} />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" rows={3} placeholder={t('notesPh')} />
            </div>

            {/* Payment */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">{t('serviceFee')}</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">¥{pkg.priceJpy.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-1">{t('taxIncluded')}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">{t('paymentNotice')}</p>
              <button type="submit" disabled={processing} className="w-full py-4 bg-gradient-to-r from-[#293f58] to-[#1a2a3e] text-white font-bold rounded-xl hover:from-[#1a2a3e] hover:to-[#293f58] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {processing ? (<><Loader2 className="animate-spin" size={20} />{t('processing')}</>) : (<><CreditCard size={20} />{t('confirmPayment')}</>)}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1"><Shield size={14} className="text-green-500" /><span>{t('securePayment')}</span></div>
              <div className="flex items-center gap-1"><Clock size={14} className="text-amber-500" /><span>{t('contact24h')}</span></div>
              <div className="flex items-center gap-1"><Lock size={14} className="text-gray-400" /><span>Stripe</span></div>
            </div>
          </form>
        </div>
      </div>
    </CheckoutLayout>
  );
}
