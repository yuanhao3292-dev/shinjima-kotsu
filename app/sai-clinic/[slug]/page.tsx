'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Shield, Lock, CreditCard } from 'lucide-react';
import CheckoutLayout from '@/components/CheckoutLayout';
import SmartBackLink from '@/components/SmartBackLink';

// ━━━━━━━━ SAI CLINIC 套餐数据 ━━━━━━━━

interface SaiPackage {
  slug: string;
  name: string;
  nameJa: string;
  nameEn: string;
  description: string;
  price: number;
  features: string[];
  category: string;
  colorTheme: 'rose' | 'purple' | 'blue' | 'amber' | 'gray' | 'teal' | 'green';
}

const SAI_PACKAGES: Record<string, SaiPackage> = {
  // Thread Lift
  'sai-lift-try': {
    slug: 'sai-lift-try', name: 'SAI LIFT TRY', nameJa: 'SAI LIFT TRY（糸リフト体験）', nameEn: 'SAI LIFT TRY - Thread Lift Trial',
    description: '初次体验推荐。使用可吸收线材进行面部提升，刺激胶原蛋白再生，实现自然年轻化效果。',
    price: 380000, category: '糸リフト',
    features: ['可吸收线材提升', '自然提升效果', '刺激胶原蛋白再生', '术后恢复快', '含术后回诊'],
    colorTheme: 'rose',
  },
  'sai-lift-standard': {
    slug: 'sai-lift-standard', name: 'SAI LIFT STANDARD', nameJa: 'SAI LIFT STANDARD（糸リフト標準）', nameEn: 'SAI LIFT STANDARD - Thread Lift Standard',
    description: '最受欢迎的线雕方案。增加线材数量，实现更明显的提升和紧致效果。效果持续12-18个月。',
    price: 680000, category: '糸リフト',
    features: ['高人气选择', '明显提升效果', '刺激胶原再生', '效果持续12-18个月', '含术后回诊', '6个月内复诊优惠'],
    colorTheme: 'purple',
  },
  'sai-lift-perfect': {
    slug: 'sai-lift-perfect', name: 'SAI LIFT PERFECT', nameJa: 'SAI LIFT PERFECT（糸リフト完美）', nameEn: 'SAI LIFT PERFECT - Thread Lift Premium',
    description: '最高级线雕方案。全脸全方位提升改善，线材用量最多，效果最持久。VIP专属服务。',
    price: 980000, category: '糸リフト',
    features: ['最强提升效果', '全脸全方位改善', '最长持效期', '术后1年内复诊优惠', 'VIP专属服务', '个性化设计方案'],
    colorTheme: 'amber',
  },
  // Combination Sets
  'sai-nasolabial-set': {
    slug: 'sai-nasolabial-set', name: '法令纹改善套餐', nameJa: 'ほうれい線セット', nameEn: 'Nasolabial Fold Treatment Set',
    description: '糸リフト + 玻尿酸注射的黄金组合，针对法令纹的综合解决方案。',
    price: 378000, category: '组合套餐',
    features: ['糸リフト提升', '玻尿酸填充', '针对法令纹', '即刻见效', '含术后回诊'],
    colorTheme: 'rose',
  },
  'sai-vline-set': {
    slug: 'sai-vline-set', name: 'V脸线条套餐', nameJa: 'V-Lineセット', nameEn: 'V-Line Facial Contouring Set',
    description: '精准脂肪溶解 + 线雕提升，打造理想V脸线条。',
    price: 496000, category: '组合套餐',
    features: ['脂肪溶解注射', '线雕提升', 'V脸线条重塑', '无需手术', '恢复期短'],
    colorTheme: 'purple',
  },
  'sai-neck-set': {
    slug: 'sai-neck-set', name: '颈纹改善套餐', nameJa: '首シワセット', nameEn: 'Neck Wrinkle Treatment Set',
    description: '糸リフト + 玻尿酸，有效改善颈部细纹和松弛。',
    price: 378000, category: '组合套餐',
    features: ['颈部线雕提升', '玻尿酸填充', '改善颈纹', '自然效果', '含术后回诊'],
    colorTheme: 'teal',
  },
  'sai-eye-fatigue-set': {
    slug: 'sai-eye-fatigue-set', name: '眼周疲劳改善套餐', nameJa: '目元セット', nameEn: 'Eye Fatigue Treatment Set',
    description: '针对眼周暗沉、细纹的综合年轻化方案。',
    price: 378000, category: '组合套餐',
    features: ['眼周专项治疗', '改善暗沉', '淡化细纹', '提升眼周轮廓', '含术后回诊'],
    colorTheme: 'blue',
  },
  // Eye Surgery
  'sai-double-eyelid': {
    slug: 'sai-double-eyelid', name: '自然双眼皮', nameJa: '二重埋没法（ナチュラル）', nameEn: 'Natural Double Eyelid Surgery',
    description: '微创埋线法双眼皮，自然美观，恢复快速。1年保障。',
    price: 300000, category: '眼部整形',
    features: ['微创埋线法', '自然双眼皮效果', '术后恢复快', '1年保障', '无需拆线'],
    colorTheme: 'purple',
  },
  'sai-double-eyelid-premium': {
    slug: 'sai-double-eyelid-premium', name: '精致双眼皮（6点连续法）', nameJa: '6点連続法二重', nameEn: 'Premium Double Eyelid - 6-Point Method',
    description: '6点连续缝合法，线条更精致持久。5年保障。',
    price: 580000, category: '眼部整形',
    features: ['6点连续缝合法', '精致持久线条', '5年保障', '自然美观', '崔医生亲诊'],
    colorTheme: 'purple',
  },
  'sai-under-eye-reversehamra': {
    slug: 'sai-under-eye-reversehamra', name: '黑眼圈·眼袋去除', nameJa: '裏ハムラ法', nameEn: 'Under-Eye Treatment - Reverse Hamra',
    description: 'Reverse Hamra法，去除眼袋并重新分配脂肪，从根本解决黑眼圈问题。',
    price: 880000, category: '眼部整形',
    features: ['Reverse Hamra法', '根本解决黑眼圈', '脂肪重新分配', '自然无痕', '长效持久'],
    colorTheme: 'purple',
  },
  // Nose Surgery
  'sai-nose-thread': {
    slug: 'sai-nose-thread', name: '线雕隆鼻（8线）', nameJa: 'SAI LIFT NOSE 8本', nameEn: 'Nose Thread Lift - 8 Threads',
    description: '8根专用隆鼻线，无需开刀即可获得自然挺拔的鼻型。',
    price: 560000, category: '鼻部整形',
    features: ['8根专用隆鼻线', '无需开刀', '自然挺拔', '即刻见效', '刺激胶原再生'],
    colorTheme: 'blue',
  },
  'sai-nose-implant': {
    slug: 'sai-nose-implant', name: '硅胶隆鼻', nameJa: 'プロテーゼ隆鼻', nameEn: 'Silicone Nose Implant',
    description: '硅胶假体隆鼻，永久效果，自然手感。由崔医生亲自设计鼻型。',
    price: 480000, category: '鼻部整形',
    features: ['硅胶假体', '永久效果', '自然手感', '个性化设计', '崔医生亲诊'],
    colorTheme: 'blue',
  },
  // Injectables
  'sai-botox-full-face': {
    slug: 'sai-botox-full-face', name: 'Allergan全脸肉毒素', nameJa: 'ボトックス全顔100単位', nameEn: 'Allergan Botox Full Face 100 Units',
    description: 'Allergan正品肉毒素100单位，全脸抗皱除纹。Allergan认证医师施术。',
    price: 240000, category: '注射美容',
    features: ['Allergan正品', '100单位全脸', '抗皱除纹', '认证医师施术', '效果3-6个月'],
    colorTheme: 'rose',
  },
  'sai-hyaluronic-1cc': {
    slug: 'sai-hyaluronic-1cc', name: '玻尿酸注射（1cc）', nameJa: 'ヒアルロン酸 1cc', nameEn: 'Hyaluronic Acid Filler 1cc',
    description: 'Juvéderm系列高端玻尿酸，精准塑形填充。',
    price: 148000, category: '注射美容',
    features: ['Juvéderm系列', '精准塑形', '即刻见效', '自然效果', '认证医师施术'],
    colorTheme: 'rose',
  },
  'sai-skin-rejuvenation': {
    slug: 'sai-skin-rejuvenation', name: '肌肤再生·水光注射', nameJa: '水光注射+幹細胞エキス', nameEn: 'Skin Rejuvenation - Hydro + Stem Cell',
    description: '水光注射 + 干细胞精华，深层修复再生，全面改善肤质。',
    price: 304000, category: '注射美容',
    features: ['水光注射', '干细胞精华', '深层修复', '改善肤质', '美白提亮'],
    colorTheme: 'teal',
  },
  'sai-exosome-therapy': {
    slug: 'sai-exosome-therapy', name: '干细胞外泌体疗法', nameJa: 'エクソソーム療法', nameEn: 'Exosome Stem Cell Therapy',
    description: '最前沿的再生医疗。新鲜干细胞外泌体（2-3次疗程），全面抗衰再生。',
    price: 760000, category: '再生医疗',
    features: ['新鲜干细胞外泌体', '2-3次疗程', '最前沿再生医疗', '全面抗衰', '深层修复再生'],
    colorTheme: 'green',
  },
  // Fat Procedures
  'sai-fat-grafting-face': {
    slug: 'sai-fat-grafting-face', name: '全脸脂肪填充', nameJa: '全顔脂肪注入', nameEn: 'Full Face Fat Grafting',
    description: '自体脂肪提取 + 全脸无限注入，永久自然的面部年轻化。',
    price: 1760000, category: '脂肪手术',
    features: ['自体脂肪提取', '全脸无限注入', '永久效果', '自然年轻化', '无异物感'],
    colorTheme: 'amber',
  },
  'sai-liposuction-face': {
    slug: 'sai-liposuction-face', name: '面部吸脂（双区）', nameJa: '脂肪吸引（2部位）', nameEn: 'Facial Liposuction - 2 Areas',
    description: '精准面部吸脂（颊部+下颚），永久减脂不反弹。',
    price: 480000, category: '脂肪手术',
    features: ['颊部+下颚双区', '永久减脂', '不反弹', '精准吸引', '改善脸型'],
    colorTheme: 'gray',
  },
  // Wellness
  'sai-nutrition-perfect': {
    slug: 'sai-nutrition-perfect', name: '精密营养分析套餐', nameJa: 'パーフェクト栄養解析', nameEn: 'Precision Nutrition Analysis - Perfect',
    description: '82项血液检测 + 专业营养分析，定制个人健康管理方案。',
    price: 118000, category: '美容内科',
    features: ['82项血液检测', '专业营养分析', '个人健康方案', '内服处方建议', '营养补充指导'],
    colorTheme: 'green',
  },
  'sai-vitamin-c-drip': {
    slug: 'sai-vitamin-c-drip', name: '高浓度维C点滴（20g）', nameJa: '高濃度ビタミンC点滴20g', nameEn: 'High-Dose Vitamin C IV Drip 20g',
    description: '超高浓度维生素C静脉注射，美白·抗氧化·免疫力提升。',
    price: 26000, category: '美容内科',
    features: ['20g高浓度维C', '美白抗氧化', '免疫力提升', '即刻补充', '安全舒适'],
    colorTheme: 'green',
  },
};

const COLOR_THEMES: Record<string, { headerBg: string; button: string; cardBg: string; cardBorder: string; check: string; title: string; price: string }> = {
  rose: { headerBg: 'bg-gradient-to-r from-rose-600 to-pink-600', button: 'bg-rose-600 text-white hover:bg-rose-700', cardBg: 'bg-rose-50', cardBorder: 'border-rose-200', check: 'text-rose-500', title: 'text-rose-900', price: 'text-rose-900' },
  purple: { headerBg: 'bg-gradient-to-r from-purple-600 to-violet-600', button: 'bg-purple-600 text-white hover:bg-purple-700', cardBg: 'bg-purple-50', cardBorder: 'border-purple-200', check: 'text-purple-500', title: 'text-purple-900', price: 'text-purple-900' },
  blue: { headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600', button: 'bg-blue-600 text-white hover:bg-blue-700', cardBg: 'bg-blue-50', cardBorder: 'border-blue-200', check: 'text-blue-500', title: 'text-blue-900', price: 'text-blue-900' },
  amber: { headerBg: 'bg-gray-900', button: 'bg-amber-500 text-black hover:bg-amber-400', cardBg: 'bg-gray-900', cardBorder: 'border-gray-700', check: 'text-amber-500', title: 'text-amber-400', price: 'text-amber-400' },
  gray: { headerBg: 'bg-gradient-to-r from-gray-700 to-gray-800', button: 'bg-gray-700 text-white hover:bg-gray-800', cardBg: 'bg-gray-50', cardBorder: 'border-gray-300', check: 'text-gray-500', title: 'text-gray-800', price: 'text-gray-800' },
  teal: { headerBg: 'bg-gradient-to-r from-teal-600 to-cyan-600', button: 'bg-teal-600 text-white hover:bg-teal-700', cardBg: 'bg-teal-50', cardBorder: 'border-teal-200', check: 'text-teal-500', title: 'text-teal-900', price: 'text-teal-900' },
  green: { headerBg: 'bg-gradient-to-r from-emerald-600 to-green-600', button: 'bg-emerald-600 text-white hover:bg-emerald-700', cardBg: 'bg-emerald-50', cardBorder: 'border-emerald-200', check: 'text-emerald-500', title: 'text-emerald-900', price: 'text-emerald-900' },
};

export default function SaiClinicCheckoutPage() {
  const params = useParams();
  const slug = params.slug as string;
  const pkg = SAI_PACKAGES[slug];
  const theme = pkg ? COLOR_THEMES[pkg.colorTheme] : COLOR_THEMES.rose;
  const isVIP = pkg?.colorTheme === 'amber';

  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '', email: '', phone: '', line: '', wechat: '', whatsapp: '', company: '', country: 'TW',
  });
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [contactError, setContactError] = useState('');

  if (!pkg) {
    return (
      <CheckoutLayout>
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">找不到该项目</p>
            <Link href="/sai-clinic" className="text-rose-600 hover:underline">返回 SAI CLINIC</Link>
          </div>
        </div>
      </CheckoutLayout>
    );
  }

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
        alert('请输入姓名');
        setProcessing(false);
        return;
      }
      if (!hasValidContact()) {
        setContactError('请至少填写一种联系方式');
        setProcessing(false);
        return;
      }

      const contactMethods: string[] = [];
      if (customerInfo.phone) contactMethods.push(`电话: ${customerInfo.phone}`);
      if (customerInfo.email) contactMethods.push(`邮箱: ${customerInfo.email}`);
      if (customerInfo.line) contactMethods.push(`LINE: ${customerInfo.line}`);
      if (customerInfo.wechat) contactMethods.push(`微信: ${customerInfo.wechat}`);
      if (customerInfo.whatsapp) contactMethods.push(`WhatsApp: ${customerInfo.whatsapp}`);

      let fullNotes = '';
      if (contactMethods.length > 0) {
        fullNotes += `【联系方式】\n${contactMethods.join('\n')}\n\n`;
      }
      fullNotes += `【项目】${pkg.name}（${pkg.category}）\n`;
      if (notes) fullNotes += `\n${notes}`;

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: slug,
          customerInfo,
          preferredDate: preferredDate || null,
          notes: fullNotes.trim() || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '创建支付会话失败');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else throw new Error('无法获取支付链接');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '支付出错，请重试';
      alert(message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <CheckoutLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <SmartBackLink defaultHref="/sai-clinic" defaultLabel="返回 SAI CLINIC" memberHref="/sai-clinic" memberLabel="返回 SAI CLINIC" />
        </div>
      </div>

      {/* Package Hero */}
      <div className={`${theme.headerBg} py-12`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 bg-white/20 text-white">{pkg.category}</span>
              <h1 className={`text-3xl md:text-4xl font-bold ${isVIP ? 'text-amber-400' : 'text-white'}`}>{pkg.name}</h1>
              <p className={`text-sm mt-2 ${isVIP ? 'text-gray-400' : 'text-white/70'}`}>{pkg.nameEn}</p>
            </div>
            <div className="text-right">
              <p className={`text-4xl md:text-5xl font-bold ${isVIP ? 'text-amber-400' : 'text-white'}`}>¥{pkg.price.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${isVIP ? 'text-gray-500' : 'text-white/60'}`}>含税·含全程服务费</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Package Info */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 border ${theme.cardBorder} ${theme.cardBg} ${isVIP ? 'text-white' : ''} sticky top-8`}>
              <h3 className={`text-lg font-bold mb-3 ${theme.title}`}>项目内容</h3>
              <p className={`text-sm mb-6 leading-relaxed ${isVIP ? 'text-gray-300' : 'text-gray-500'}`}>{pkg.description}</p>
              <div className={`space-y-2.5 text-sm ${isVIP ? '' : 'text-gray-700'}`}>
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <CheckCircle size={16} className={`shrink-0 mt-0.5 ${theme.check}`} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-6 pt-6 border-t ${isVIP ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isVIP ? 'text-gray-400' : 'text-gray-500'}`}>项目费用</span>
                  <span className={`text-xl font-bold ${theme.price}`}>¥{pkg.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">预约信息</h2>

              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text" required value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  placeholder="您的姓名"
                />
              </div>

              {/* Company */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">公司（选填）</label>
                <input
                  type="text" value={customerInfo.company}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  placeholder="公司名称"
                />
              </div>

              {/* Contact Methods */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系方式 <span className="text-rose-500">*</span>
                  <span className="text-xs text-gray-400 ml-2">至少填写一种</span>
                </label>
                {contactError && <p className="text-sm text-rose-500 mb-2">{contactError}</p>}
                <div className="grid sm:grid-cols-2 gap-3">
                  <input type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" placeholder="电话号码" />
                  <input type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" placeholder="邮箱" />
                  <input type="text" value={customerInfo.line} onChange={(e) => setCustomerInfo({ ...customerInfo, line: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" placeholder="LINE ID" />
                  <input type="text" value={customerInfo.wechat} onChange={(e) => setCustomerInfo({ ...customerInfo, wechat: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" placeholder="微信号" />
                  <input type="text" value={customerInfo.whatsapp} onChange={(e) => setCustomerInfo({ ...customerInfo, whatsapp: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" placeholder="WhatsApp" />
                </div>
              </div>

              {/* Preferred Date */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">希望预约日期（选填）</label>
                <input
                  type="date" value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                />
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">备注（选填）</label>
                <textarea
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  rows={3} maxLength={1000}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none"
                  placeholder="如有特殊需求或问题，请在此备注..."
                />
              </div>

              {/* Cancellation Policy */}
              <div className="mb-8 bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h4 className="font-medium text-gray-900 text-sm mb-3">预约须知</h4>
                <ul className="space-y-1.5 text-xs text-gray-500">
                  <li>- SAI CLINIC 采用完全预约制</li>
                  <li>- 预约确认后，如需变更请提前3天联系</li>
                  <li>- 当日取消或无故未到将收取全额费用</li>
                  <li>- 手术类项目需签署知情同意书</li>
                  <li>- 付款后我们会在24小时内与您确认预约详情</li>
                </ul>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={processing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${theme.button} disabled:opacity-50`}
              >
                {processing ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <CreditCard size={20} />
                    确认并支付 ¥{pkg.price.toLocaleString()}
                  </>
                )}
              </button>

              {/* Security badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Lock size={12} /> SSL加密</span>
                <span className="flex items-center gap-1"><Shield size={12} /> Stripe安全支付</span>
                <span className="flex items-center gap-1"><Shield size={12} /> 隐私保护</span>
              </div>

              {/* Payment method icons */}
              <div className="mt-4 flex items-center justify-center gap-3">
                {['Visa', 'Mastercard', 'Amex', 'JCB'].map((card) => (
                  <span key={card} className="px-2 py-1 bg-gray-100 text-[10px] text-gray-500 rounded font-medium">{card}</span>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}
