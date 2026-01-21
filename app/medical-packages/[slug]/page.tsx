'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Car, Building, Check, Shield, Lock, CreditCard } from 'lucide-react';
import SmartBackLink from '@/components/SmartBackLink';

// 套餐数据（与主页保持一致）
const packagesData: Record<string, {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  price: number;
  description: string;
  longDescription: string;
  features: string[];
  badge?: string;
  isVIP?: boolean;
  colors: {
    headerBg: string;
    title: string;
    price: string;
    check: string;
    button: string;
    cardBg: string;
    cardBorder: string;
    badgeBg?: string;
  };
}> = {
  'vip-member-course': {
    id: 'vip',
    slug: 'vip-member-course',
    name: 'VIP 頂級全能套裝',
    nameEn: 'VIP Member Course',
    price: 1512500,
    description: '針對企業領袖的終極方案。',
    longDescription: '專為企業高管、創業者設計的最頂級健檢方案。整合 PET/CT 全身癌症掃描、心臟 MRI、腦部 MRA、DWIBS 全身癌篩、胃腸鏡（鎮靜麻醉）等檢查，一次完成全方位健康評估。獨享個室休息空間及精緻餐券。',
    features: [
      'MRI: 腦(MRA)+心臟+DWIBS+骨盆',
      'CT: 胸部+冠脈鈣化+內臟脂肪',
      '內視鏡: 胃鏡+大腸鏡 (鎮靜麻醉)',
      '超音波: 頸/心/腹/下肢/乳房(女)',
      'PET/CT: 全身癌症掃描',
      '尊享: 個室使用・精緻餐券×2',
    ],
    badge: 'Flagship',
    isVIP: true,
    colors: {
      headerBg: 'bg-gray-900',
      title: 'text-yellow-400',
      price: 'text-yellow-400',
      check: 'text-yellow-500',
      button: 'bg-yellow-500 text-black hover:bg-yellow-400',
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-800',
      badgeBg: 'bg-yellow-500 text-black',
    },
  },
  'premium-cardiac-course': {
    id: 'premium',
    slug: 'premium-cardiac-course',
    name: 'PREMIUM (心臟精密)',
    nameEn: 'Premium Cardiac Course',
    price: 825000,
    description: '針對高壓力、缺乏運動菁英人士。',
    longDescription: '專為長時間工作、缺乏運動的專業人士設計。透過心臟 MRI、冠脈鈣化積分、ABI/CAVI 血管年齡檢測等，全面評估心血管健康狀況及猝死風險。',
    features: [
      'MRI: 心臟(非造影)+腦MRA+DWIBS',
      'CT: 胸部+冠脈鈣化積分',
      '超音波: 心臟・頸動脈・下肢',
      '血液: NTproBNP・心肌蛋白T・CPK',
      '機能: ABI/CAVI (血管年齡)',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
      title: 'text-blue-900',
      price: 'text-blue-900',
      check: 'text-blue-500',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
      cardBg: 'bg-gradient-to-br from-blue-50 to-white',
      cardBorder: 'border-blue-200',
    },
  },
  'select-gastro-colonoscopy': {
    id: 'select-both',
    slug: 'select-gastro-colonoscopy',
    name: 'SELECT (胃+大腸鏡)',
    nameEn: 'Gastro + Colonoscopy Course',
    price: 825000,
    description: '應酬頻繁者的最佳選擇。',
    longDescription: '專為經常應酬、飲食不規律人士設計。一次鎮靜麻醉下完成胃鏡與大腸鏡檢查，可當場處理息肉。適合消化道癌症高風險族群定期追蹤。',
    features: [
      '內視鏡: 胃鏡+大腸鏡 (鎮靜)',
      '處置: 可當場切除息肉',
      '超音波: 腹部 (肝膽胰脾腎)',
      '感染: 幽門螺旋桿菌抗體',
      '血液: 消化道腫瘤標誌物',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-green-600 to-green-700',
      title: 'text-green-900',
      price: 'text-green-900',
      check: 'text-green-500',
      button: 'bg-green-600 text-white hover:bg-green-700',
      cardBg: 'bg-white',
      cardBorder: 'border-green-200',
    },
  },
  'select-gastroscopy': {
    id: 'select-gastro',
    slug: 'select-gastroscopy',
    name: 'SELECT (胃鏡)',
    nameEn: 'Gastroscopy Course',
    price: 687500,
    description: '針對胃癌高風險族群。',
    longDescription: '專為胃部不適、有胃癌家族史人士設計。採用高畫質內視鏡，無需清腸準備，檢查時間短、身體負擔輕。發現可疑病灶可當場活檢送病理分析。',
    features: [
      '內視鏡: 胃鏡 (經口/經鼻)',
      '超音波: 腹部 (肝膽胰脾腎)',
      '感染: 幽門螺旋桿菌抗體',
      '血液: 胃癌風險指標・腫瘤標誌物',
      '基礎: 身體測量・視力聽力・心電圖',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-teal-600 to-teal-700',
      title: 'text-teal-800',
      price: 'text-teal-800',
      check: 'text-teal-500',
      button: 'bg-teal-600 text-white hover:bg-teal-700',
      cardBg: 'bg-white',
      cardBorder: 'border-teal-200',
    },
  },
  'dwibs-cancer-screening': {
    id: 'dwibs',
    slug: 'dwibs-cancer-screening',
    name: 'DWIBS (防癌篩查)',
    nameEn: 'DWIBS Cancer Screening',
    price: 275000,
    description: '無輻射全身癌症篩查 MRI。',
    longDescription: '採用先進 DWIBS 技術進行全身癌症篩查。無輻射、無需顯影劑、非侵入性，特別適合作為年度癌症篩查或治療後追蹤使用。',
    features: [
      'MRI: DWIBS (頸部至骨盆)',
      '血液: 全套腫瘤標誌物',
      '血液: 肝腎功能・甲狀腺',
      '特點: 無輻射・無痛・非侵入',
      '基礎: 身體測量・視力聽力・心電圖',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-purple-600 to-purple-700',
      title: 'text-purple-900',
      price: 'text-purple-900',
      check: 'text-purple-500',
      button: 'bg-purple-600 text-white hover:bg-purple-700',
      cardBg: 'bg-white',
      cardBorder: 'border-purple-200',
    },
  },
  'basic-checkup': {
    id: 'basic',
    slug: 'basic-checkup',
    name: 'BASIC (基礎套餐)',
    nameEn: 'Standard Checkup Course',
    price: 550000,
    description: '高性價比的企業團體首選。',
    longDescription: '涵蓋血液生化、影像檢查、超音波等基礎項目的全面健檢方案。適合作為年度基礎健康評估，也是企業團體健檢的高性價比選擇。',
    features: [
      '影像: 胸部X光・腹部超音波',
      '血液: 肝腎脂糖・甲狀腺・腫瘤標誌物',
      '基礎: 視力・聽力・眼壓・眼底・心電圖',
      '檢體: 尿液・便潛血(2日法)',
      '歯科: 口腔掃描・X線・餐券',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-gray-700 to-gray-800',
      title: 'text-gray-800',
      price: 'text-gray-800',
      check: 'text-gray-500',
      button: 'bg-gray-700 text-white hover:bg-gray-800',
      cardBg: 'bg-gray-50',
      cardBorder: 'border-gray-300',
    },
  },
};

const ADD_ON_SERVICES = [
  { id: 'airport_pickup', name: '機場接送（去程）', description: '關西機場 → 大阪市區（專車 Alphard）', price: 22000, icon: Car },
  { id: 'airport_dropoff', name: '機場接送（返程）', description: '大阪市區 → 關西機場（專車 Alphard）', price: 22000, icon: Car },
  { id: 'hotel_booking', name: '酒店代訂服務', description: '協助預訂 TIMC 附近的優質酒店', price: null, icon: Building },
];

export default function PackageDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
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
          <p className="text-xl text-gray-600 mb-4">套餐不存在</p>
          <Link href="/medical-packages" className="text-blue-600 hover:underline">返回套餐列表</Link>
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
        alert('請填寫姓名');
        setProcessing(false);
        return;
      }
      if (!hasValidContact()) {
        setContactError('請至少填寫一種聯繫方式（手機、郵箱、LINE、微信或 WhatsApp）');
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
      else throw new Error('未獲取到支付鏈接');
    } catch (error: any) {
      alert(error.message || '支付流程出現錯誤，請稍後重試');
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
            defaultHref="/medical-packages"
            defaultLabel="返回套餐列表"
            memberHref="/medical-packages"
            memberLabel="返回套餐列表"
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
              <p className={`text-xs mt-1 ${pkg.isVIP ? 'text-gray-500' : 'text-white/60'}`}>含醫療翻譯・報告翻譯・消費稅10%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Package Info */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 border ${pkg.colors.cardBorder} ${pkg.colors.cardBg} ${pkg.isVIP ? 'text-white' : ''} sticky top-8`}>
              <h3 className={`text-lg font-serif font-bold mb-3 ${pkg.colors.title}`}>套餐包含</h3>
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
                  <span className={`text-sm ${pkg.isVIP ? 'text-gray-400' : 'text-gray-500'}`}>套餐價格</span>
                  <span className={`text-xl font-bold ${pkg.colors.price}`}>¥{pkg.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">預約信息</h2>
              <form onSubmit={handleSubmit}>
                {/* 基本信息 */}
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">姓名 <span className="text-red-500">*</span></label>
                    <input type="text" required value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder="請輸入您的姓名" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">公司名稱（可選）</label>
                    <input type="text" value={customerInfo.company} onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder="公司名稱" />
                  </div>
                </div>

                {/* 联系方式 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">聯繫方式 <span className="text-red-500">*</span></label>
                    <span className="text-xs text-gray-400">請至少填寫一種</span>
                  </div>
                  {contactError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {contactError}
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">手機號碼</label>
                      <input type="tel" value={customerInfo.phone} onChange={(e) => { setCustomerInfo({ ...customerInfo, phone: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder="+886 912345678" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">電子郵箱</label>
                      <input type="email" value={customerInfo.email} onChange={(e) => { setCustomerInfo({ ...customerInfo, email: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder="your@email.com" />
                      <p className="mt-1 text-xs text-gray-400">如填寫，支付確認及體檢通知將發送至此郵箱</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">LINE ID</label>
                      <input type="text" value={customerInfo.line} onChange={(e) => { setCustomerInfo({ ...customerInfo, line: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder="您的 LINE ID" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">微信 WeChat</label>
                      <input type="text" value={customerInfo.wechat} onChange={(e) => { setCustomerInfo({ ...customerInfo, wechat: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder="您的微信號" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1.5">WhatsApp</label>
                      <input type="tel" value={customerInfo.whatsapp} onChange={(e) => { setCustomerInfo({ ...customerInfo, whatsapp: e.target.value }); setContactError(''); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder="+852 12345678" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">我們會通過您提供的聯繫方式與您確認體檢日期和相關事宜</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">希望體檢日期（可選）</label>
                    <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">體檢時間</label>
                    <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm">9:00 - 16:00</div>
                    <p className="mt-1.5 text-xs text-gray-400">體檢統一在此時段進行</p>
                  </div>
                </div>

                {/* Add-on Services */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">增值服務（可選）</h3>
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
                            <p className="text-sm font-semibold mt-1 text-gray-900">{service.price ? `¥${service.price.toLocaleString()}` : '免費諮詢'}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedAddOns.length > 0 && <p className="mt-3 text-xs text-gray-400">* 增值服務費用將在客服確認後另行報價收取</p>}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">備註（可選）</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm" placeholder="如有特殊需求或健康狀況需要說明，請在此填寫" />
                </div>

                {/* Cancellation Policy */}
                <div className="mb-8 bg-amber-50 border border-amber-100 rounded-xl p-5">
                  <h3 className="font-semibold text-amber-800 mb-3 text-sm">取消與退款政策</h3>
                  <ul className="text-sm text-amber-700 space-y-1.5">
                    <li>• <strong>體檢前 14 天以上</strong>：可全額退款</li>
                    <li>• <strong>體檢前 7-14 天</strong>：退還 50% 費用</li>
                    <li>• <strong>體檢前 7 天內</strong>：恕不接受取消，可改期一次</li>
                  </ul>
                </div>

                <button type="submit" disabled={processing} className={`w-full py-4 text-base font-bold rounded-xl transition-all ${pkg.colors.button} disabled:opacity-50`}>
                  {processing ? '處理中...' : `前往支付 ¥${pkg.price.toLocaleString()}`}
                </button>
                <p className="mt-4 text-xs text-gray-400 text-center">點擊「前往支付」後將跳轉到 Stripe 安全支付頁面</p>

                {/* Payment Method Icons */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="text-xs text-gray-400">お支払い方法:</span>
                  <div className="flex items-center gap-2">
                    <Image src="/icons/payment/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/mastercard.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/amex.svg" alt="American Express" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/icons/payment/jcb.svg" alt="JCB" width={40} height={25} className="h-6 w-auto" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5"><Lock size={14} /><span>SSL 安全加密</span></div>
                  <div className="flex items-center gap-1.5"><CreditCard size={14} /><span>Stripe 安全支付</span></div>
                  <div className="flex items-center gap-1.5"><Shield size={14} /><span>隱私保護</span></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
