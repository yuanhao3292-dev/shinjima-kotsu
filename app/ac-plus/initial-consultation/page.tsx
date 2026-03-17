'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import CheckoutLayout from '@/components/CheckoutLayout';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import ProviderBanner, { useProviderKey } from '@/components/ProviderBanner';
import { isValidSlug } from '@/lib/whitelabel-config';
import {
  ArrowLeft, CheckCircle, FileText, Shield, Clock,
  Loader2, CreditCard, Users, Phone, Mail, MessageSquare
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  serviceName: { ja: 'ACセルクリニック 初期相談サービス', 'zh-TW': 'AC Cell Clinic 前期諮詢服務', 'zh-CN': 'AC Cell Clinic 前期咨询服务', en: 'AC Cell Clinic Initial Consultation' } as Record<Language, string>,
  serviceNameEn: { ja: 'AC Cell Clinic - Initial Consultation', 'zh-TW': 'AC Cell Clinic - Initial Consultation', 'zh-CN': 'AC Cell Clinic - Initial Consultation', en: 'AC Cell Clinic - Initial Consultation' } as Record<Language, string>,
  serviceDescription: { ja: '病歴翻訳・クリニック相談・再生医療プラン評価・費用概算', 'zh-TW': '病歷翻譯、診所諮詢、再生醫療方案評估、費用概算', 'zh-CN': '病历翻译、诊所咨询、再生医疗方案评估、费用概算', en: 'Medical record translation, clinic consultation, regenerative medicine assessment, cost estimate' } as Record<Language, string>,
  serviceLongDescription: { ja: 'ACセルクリニック向けの初期相談サービス。診療情報を翻訳（中→日）し、クリニックと初期相談を行い、再生医療の可能性を評価し、費用概算をご提供します。', 'zh-TW': '專為AC Cell Clinic提供的前期諮詢服務。我們將翻譯您的病歷資料（中→日），並與AC Cell Clinic進行初步諮詢，評估再生醫療可行性並提供費用概算。', 'zh-CN': '专为AC Cell Clinic提供的前期咨询服务。我们将翻译您的病历资料（中→日），并与AC Cell Clinic进行初步咨询，评估再生医疗可行性并提供费用概算。', en: 'Initial consultation for AC Cell Clinic. We translate your medical records (CN→JP), consult with the clinic, assess regenerative medicine feasibility and provide cost estimates.' } as Record<Language, string>,
  taxIncluded: { ja: '日円（税込）', 'zh-TW': '日円（税込）', 'zh-CN': '日元（含税）', en: 'JPY (tax incl.)' } as Record<Language, string>,
  backToMain: { ja: 'ACセルクリニックに戻る', 'zh-TW': '返回AC Cell Clinic', 'zh-CN': '返回AC Cell Clinic', en: 'Back to AC Cell Clinic' } as Record<Language, string>,
  featuresTitle: { ja: 'サービス内容', 'zh-TW': '服務包含', 'zh-CN': '服务包含', en: 'Service Includes' } as Record<Language, string>,
  feature1: { ja: '診療情報の翻訳（中→日）', 'zh-TW': '病歷資料翻譯（中→日）', 'zh-CN': '病历资料翻译（中→日）', en: 'Medical record translation (CN→JP)' } as Record<Language, string>,
  feature2: { ja: 'ACセルクリニックへの初期相談', 'zh-TW': 'AC Cell Clinic初步諮詢', 'zh-CN': 'AC Cell Clinic初步咨询', en: 'Initial consultation with AC Cell Clinic' } as Record<Language, string>,
  feature3: { ja: '再生医療可能性評価レポート', 'zh-TW': '再生醫療可行性評估報告', 'zh-CN': '再生医疗可行性评估报告', en: 'Regenerative medicine feasibility assessment' } as Record<Language, string>,
  feature4: { ja: '費用概算のご説明', 'zh-TW': '費用概算說明', 'zh-CN': '费用概算说明', en: 'Cost estimation explanation' } as Record<Language, string>,
  feature5: { ja: '次のステップのご案内', 'zh-TW': '後續流程指導', 'zh-CN': '后续流程指导', en: 'Next steps guidance' } as Record<Language, string>,
  requiredDocsTitle: { ja: '必要書類のご準備', 'zh-TW': '請準備以下資料', 'zh-CN': '请准备以下资料', en: 'Please Prepare the Following Documents' } as Record<Language, string>,
  doc1: { ja: '3ヶ月以内の健康診断書', 'zh-TW': '3個月內的健康檢查報告', 'zh-CN': '3个月内的健康检查报告', en: 'Health checkup report (within 3 months)' } as Record<Language, string>,
  doc2: { ja: '血液検査報告', 'zh-TW': '血液檢查報告', 'zh-CN': '血液检查报告', en: 'Blood test report' } as Record<Language, string>,
  doc3: { ja: '現在の診断書・治療経過', 'zh-TW': '目前診斷書、治療經過', 'zh-CN': '目前诊断书、治疗经过', en: 'Current diagnosis and treatment history' } as Record<Language, string>,
  doc4: { ja: '現在服用中のお薬リスト', 'zh-TW': '目前用藥清單', 'zh-CN': '目前用药清单', en: 'Current medication list' } as Record<Language, string>,
  doc5: { ja: 'パスポート写真ページ', 'zh-TW': '護照照片頁', 'zh-CN': '护照照片页', en: 'Passport photo page' } as Record<Language, string>,
  bookingInfo: { ja: 'ご予約情報', 'zh-TW': '預約信息', 'zh-CN': '预约信息', en: 'Booking Information' } as Record<Language, string>,
  contractNotice: { ja: 'ご契約について：本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。', 'zh-TW': 'ご契約について：本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。', 'zh-CN': 'ご契約について：本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。', en: 'Contract Notice: This service contract is concluded with Niijima Kotsu Co., Ltd. (Osaka Prefecture Registered Travel Agency No. 2-3115).' } as Record<Language, string>,
  patientInfoTitle: { ja: '患者情報', 'zh-TW': '患者信息', 'zh-CN': '患者信息', en: 'Patient Information' } as Record<Language, string>,
  patientName: { ja: '患者氏名 *', 'zh-TW': '患者姓名 *', 'zh-CN': '患者姓名 *', en: 'Patient Name *' } as Record<Language, string>,
  patientNamePlaceholder: { ja: '患者氏名をご入力ください', 'zh-TW': '請輸入患者姓名', 'zh-CN': '请输入患者姓名', en: 'Enter patient name' } as Record<Language, string>,
  age: { ja: '年齢', 'zh-TW': '年齡', 'zh-CN': '年龄', en: 'Age' } as Record<Language, string>,
  agePlaceholder: { ja: '例：45歳', 'zh-TW': '例如：45歲', 'zh-CN': '例如：45岁', en: 'e.g., 45' } as Record<Language, string>,
  gender: { ja: '性別', 'zh-TW': '性別', 'zh-CN': '性别', en: 'Gender' } as Record<Language, string>,
  genderSelect: { ja: 'ご選択ください', 'zh-TW': '請選擇', 'zh-CN': '请选择', en: 'Please select' } as Record<Language, string>,
  male: { ja: '男性', 'zh-TW': '男', 'zh-CN': '男', en: 'Male' } as Record<Language, string>,
  female: { ja: '女性', 'zh-TW': '女', 'zh-CN': '女', en: 'Female' } as Record<Language, string>,
  treatmentGoal: { ja: 'ご希望の治療', 'zh-TW': '希望的治療', 'zh-CN': '希望的治疗', en: 'Desired Treatment' } as Record<Language, string>,
  treatmentGoalPlaceholder: { ja: '例：幹細胞治療、NK細胞療法、ACRS療法、幹細胞培養上清液等', 'zh-TW': '例如：幹細胞治療、NK細胞療法、ACRS療法、幹細胞培養上清液等', 'zh-CN': '例如：干细胞治疗、NK细胞疗法、ACRS疗法、干细胞培养上清液等', en: 'e.g., Stem cell therapy, NK cell therapy, ACRS therapy, stem cell culture supernatant, etc.' } as Record<Language, string>,
  currentStatus: { ja: '現在の健康状態', 'zh-TW': '目前健康狀況', 'zh-CN': '目前健康状况', en: 'Current Health Status' } as Record<Language, string>,
  currentStatusPlaceholder: { ja: '現在の健康状態、既往歴等を簡単にご記入ください', 'zh-TW': '請簡述目前的健康狀況、病史等', 'zh-CN': '请简述目前的健康状况、病史等', en: 'Brief description of current health and medical history' } as Record<Language, string>,
  contactInfoTitle: { ja: 'ご連絡先情報', 'zh-TW': '聯繫人信息', 'zh-CN': '联系人信息', en: 'Contact Information' } as Record<Language, string>,
  contactName: { ja: 'ご連絡先氏名 *', 'zh-TW': '聯繫人姓名 *', 'zh-CN': '联系人姓名 *', en: 'Contact Name *' } as Record<Language, string>,
  contactNamePlaceholder: { ja: 'ご連絡先氏名をご入力ください', 'zh-TW': '請輸入聯繫人姓名', 'zh-CN': '请输入联系人姓名', en: 'Enter contact name' } as Record<Language, string>,
  region: { ja: '所在地域', 'zh-TW': '所在地區', 'zh-CN': '所在地区', en: 'Region' } as Record<Language, string>,
  regionTW: { ja: '台湾', 'zh-TW': '台灣', 'zh-CN': '台湾', en: 'Taiwan' } as Record<Language, string>,
  regionCN: { ja: '中国本土', 'zh-TW': '中國大陸', 'zh-CN': '中国大陆', en: 'Mainland China' } as Record<Language, string>,
  regionHK: { ja: '香港', 'zh-TW': '香港', 'zh-CN': '香港', en: 'Hong Kong' } as Record<Language, string>,
  regionSG: { ja: 'シンガポール', 'zh-TW': '新加坡', 'zh-CN': '新加坡', en: 'Singapore' } as Record<Language, string>,
  regionMY: { ja: 'マレーシア', 'zh-TW': '馬來西亞', 'zh-CN': '马来西亚', en: 'Malaysia' } as Record<Language, string>,
  regionOther: { ja: 'その他', 'zh-TW': '其他', 'zh-CN': '其他', en: 'Other' } as Record<Language, string>,
  phone: { ja: '携帯電話番号', 'zh-TW': '手機號碼', 'zh-CN': '手机号码', en: 'Mobile Phone' } as Record<Language, string>,
  phonePlaceholder: { ja: '+886 912345678', 'zh-TW': '+886 912345678', 'zh-CN': '+86 13812345678', en: '+1 234-567-8900' } as Record<Language, string>,
  email: { ja: 'メールアドレス', 'zh-TW': '電子郵箱', 'zh-CN': '电子邮箱', en: 'Email Address' } as Record<Language, string>,
  emailPlaceholder: { ja: 'example@email.com', 'zh-TW': 'example@email.com', 'zh-CN': 'example@email.com', en: 'example@email.com' } as Record<Language, string>,
  lineId: { ja: 'LINE ID', 'zh-TW': 'LINE ID', 'zh-CN': 'LINE ID', en: 'LINE ID' } as Record<Language, string>,
  lineIdPlaceholder: { ja: 'LINE IDをご入力ください', 'zh-TW': '您的 LINE ID', 'zh-CN': '您的 LINE ID', en: 'Your LINE ID' } as Record<Language, string>,
  wechat: { ja: 'WeChat ID', 'zh-TW': '微信 WeChat', 'zh-CN': '微信 WeChat', en: 'WeChat ID' } as Record<Language, string>,
  wechatPlaceholder: { ja: 'WeChat IDをご入力ください', 'zh-TW': '您的微信號', 'zh-CN': '您的微信号', en: 'Your WeChat ID' } as Record<Language, string>,
  contactMethodRequired: { ja: '* 少なくとも一つの連絡方法をご入力ください', 'zh-TW': '* 至少填寫一種聯繫方式', 'zh-CN': '* 至少填写一种联系方式', en: '* At least one contact method required' } as Record<Language, string>,
  additionalNotes: { ja: '補足説明', 'zh-TW': '補充說明', 'zh-CN': '补充说明', en: 'Additional Notes' } as Record<Language, string>,
  additionalNotesPlaceholder: { ja: 'その他ご説明が必要な事項がございましたら、こちらにご記入ください', 'zh-TW': '如有其他需要說明的情況，請在此填寫', 'zh-CN': '如有其他需要说明的情况，请在此填写', en: 'If you have any other matters to explain, please write here' } as Record<Language, string>,
  serviceFee: { ja: 'サービス料金', 'zh-TW': '服務費用', 'zh-CN': '服务费用', en: 'Service Fee' } as Record<Language, string>,
  paymentNotice: { ja: 'お支払い完了後、24時間以内にご連絡し、資料提出方法をご案内いたします', 'zh-TW': '支付完成後，我們將在 24 小時內與您聯繫，確認資料提交方式', 'zh-CN': '支付完成后，我们将在 24 小时内与您联系，确认资料提交方式', en: 'We will contact you within 24 hours after payment to confirm document submission method' } as Record<Language, string>,
  confirmPayment: { ja: '確認してお支払い', 'zh-TW': '確認並支付', 'zh-CN': '确认并支付', en: 'Confirm & Pay' } as Record<Language, string>,
  processing: { ja: '処理中...', 'zh-TW': '處理中...', 'zh-CN': '处理中...', en: 'Processing...' } as Record<Language, string>,
  securePayment: { ja: '安全なお支払い', 'zh-TW': '安全支付', 'zh-CN': '安全支付', en: 'Secure Payment' } as Record<Language, string>,
  contact24h: { ja: '24時間以内にご連絡', 'zh-TW': '24小時內聯繫', 'zh-CN': '24小时内联系', en: '24h Contact' } as Record<Language, string>,
  alertContactName: { ja: 'ご連絡先氏名をご入力ください', 'zh-TW': '請填寫聯繫人姓名', 'zh-CN': '请填写联系人姓名', en: 'Please enter contact name' } as Record<Language, string>,
  alertPatientName: { ja: '患者氏名をご入力ください', 'zh-TW': '請填寫患者姓名', 'zh-CN': '请填写患者姓名', en: 'Please enter patient name' } as Record<Language, string>,
  alertContactMethod: { ja: '少なくとも一つの連絡方法（電話、メール、LINE、WeChat）をご入力ください', 'zh-TW': '請至少填寫一種聯繫方式（手機、郵箱、LINE 或微信）', 'zh-CN': '请至少填写一种联系方式（手机、邮箱、LINE 或微信）', en: 'Please provide at least one contact method (phone, email, LINE, or WeChat)' } as Record<Language, string>,
  alertPaymentError: { ja: 'お支払い処理でエラーが発生しました。しばらくしてから再度お試しください', 'zh-TW': '支付流程出現錯誤，請稍後重試', 'zh-CN': '支付流程出现错误，请稍后重试', en: 'Payment error occurred. Please try again later' } as Record<Language, string>,
  alertCreateSessionError: { ja: '支払いセッションの作成に失敗しました', 'zh-TW': '創建支付會話失敗', 'zh-CN': '创建支付会话失败', en: 'Failed to create payment session' } as Record<Language, string>,
  alertNoCheckoutUrl: { ja: '支払いリンクを取得できませんでした', 'zh-TW': '未獲取到支付鏈接', 'zh-CN': '未获取到支付链接', en: 'Failed to retrieve payment link' } as Record<Language, string>,
};

const SERVICE_INFO = {
  id: MEDICAL_PACKAGES['ac-plus-initial-consultation'].slug,
  slug: MEDICAL_PACKAGES['ac-plus-initial-consultation'].slug,
  price: MEDICAL_PACKAGES['ac-plus-initial-consultation'].priceJpy,
};

export default function ACPlusInitialConsultationPage() {
  const providerKey = useProviderKey();
  const searchParams = useSearchParams();
  const guideSlugParam = searchParams.get('guide');
  const guideSlug = guideSlugParam && isValidSlug(guideSlugParam) ? guideSlugParam : null;
  const backHref = guideSlug ? `/g/${guideSlug}/ac-plus` : '/ac-plus';
  const [currentLang, setCurrentLang] = useState<Language>('zh-CN');
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    line: '',
    wechat: '',
    country: 'CN',
  });
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    age: '',
    gender: '',
    treatmentGoal: '',
    currentStatus: '',
  });
  const [notes, setNotes] = useState('');
  const [contactError, setContactError] = useState('');

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

  const t = (key: keyof typeof pageTranslations): string => {
    return pageTranslations[key][currentLang] || pageTranslations[key]['zh-CN'];
  };

  const hasValidContact = () => {
    return customerInfo.phone.trim() !== '' ||
           customerInfo.email.trim() !== '' ||
           customerInfo.line.trim() !== '' ||
           customerInfo.wechat.trim() !== '';
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactError('');
    setProcessing(true);

    try {
      if (!customerInfo.name) { alert(t('alertContactName')); setProcessing(false); return; }
      if (!patientInfo.patientName) { alert(t('alertPatientName')); setProcessing(false); return; }
      if (!hasValidContact()) { setContactError(t('alertContactMethod')); setProcessing(false); return; }

      const contactMethods: string[] = [];
      if (customerInfo.phone) contactMethods.push(`${t('phone')}: ${customerInfo.phone}`);
      if (customerInfo.email) contactMethods.push(`${t('email')}: ${customerInfo.email}`);
      if (customerInfo.line) contactMethods.push(`LINE: ${customerInfo.line}`);
      if (customerInfo.wechat) contactMethods.push(`WeChat: ${customerInfo.wechat}`);

      let fullNotes = `【${t('serviceName')}】\n\n`;
      fullNotes += `【${t('patientInfoTitle')}】\n`;
      fullNotes += `${t('patientName').replace(' *', '')}: ${patientInfo.patientName}\n`;
      fullNotes += `${t('age')}: ${patientInfo.age || '未提供'}\n`;
      fullNotes += `${t('gender')}: ${patientInfo.gender || '未提供'}\n`;
      fullNotes += `${t('treatmentGoal')}: ${patientInfo.treatmentGoal || '未提供'}\n`;
      fullNotes += `${t('currentStatus')}: ${patientInfo.currentStatus || '未提供'}\n\n`;
      fullNotes += `【${t('contactInfoTitle')}】\n${contactMethods.join('\n')}\n\n`;
      if (notes) fullNotes += `【${t('additionalNotes')}】\n${notes}`;

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: SERVICE_INFO.slug,
          customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email || '',
            phone: customerInfo.phone,
            line: customerInfo.line,
            wechat: customerInfo.wechat,
            country: customerInfo.country,
          },
          preferredDate: null,
          preferredTime: null,
          notes: fullNotes,
          provider: providerKey || 'ac_plus',
          locale: currentLang,
          ...(guideSlug ? { guideSlug } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('alertCreateSessionError'));
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else throw new Error(t('alertNoCheckoutUrl'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('alertPaymentError');
      alert(message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <CheckoutLayout>
      <Suspense fallback={null}>
        <ProviderBanner lang={currentLang} />
      </Suspense>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-900 transition">
            <ArrowLeft size={16} />
            {t('backToMain')}
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">{t('serviceName')}</h1>
              <p className="text-gray-300 text-sm mt-1">{t('serviceNameEn')}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">¥{SERVICE_INFO.price.toLocaleString()}</p>
              <p className="text-xs text-gray-300 mt-1">{t('taxIncluded')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100 sticky top-8">
              <h3 className="text-lg font-bold text-teal-900 mb-3">{t('featuresTitle')}</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{t('serviceLongDescription')}</p>
              <div className="space-y-2.5 text-sm text-gray-700">
                {[t('feature1'), t('feature2'), t('feature3'), t('feature4'), t('feature5')].map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-teal-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-teal-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-teal-600" />
                  {t('requiredDocsTitle')}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[t('doc1'), t('doc2'), t('doc3'), t('doc4'), t('doc5')].map((doc, idx) => (
                    <li key={idx} className="flex gap-2"><span className="text-gray-400">•</span><span>{doc}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{t('bookingInfo')}</h2>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-teal-800">
                  <strong>{t('contractNotice').split('：')[0]}：</strong>{t('contractNotice').split('：')[1]}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Users size={18} className="text-teal-600" />{t('patientInfoTitle')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('patientName')}</label>
                      <input type="text" required value={patientInfo.patientName} onChange={(e) => setPatientInfo({ ...patientInfo, patientName: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder={t('patientNamePlaceholder')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')}</label>
                      <input type="text" value={patientInfo.age} onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder={t('agePlaceholder')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')}</label>
                      <select value={patientInfo.gender} onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <option value="">{t('genderSelect')}</option>
                        <option value={t('male')}>{t('male')}</option>
                        <option value={t('female')}>{t('female')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('treatmentGoal')}</label>
                      <input type="text" value={patientInfo.treatmentGoal} onChange={(e) => setPatientInfo({ ...patientInfo, treatmentGoal: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder={t('treatmentGoalPlaceholder')} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('currentStatus')}</label>
                      <textarea value={patientInfo.currentStatus} onChange={(e) => setPatientInfo({ ...patientInfo, currentStatus: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" rows={3} placeholder={t('currentStatusPlaceholder')} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Phone size={18} className="text-teal-600" />{t('contactInfoTitle')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactName')}</label>
                      <input type="text" required value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder={t('contactNamePlaceholder')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('region')}</label>
                      <select value={customerInfo.country} onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <option value="TW">{t('regionTW')}</option>
                        <option value="CN">{t('regionCN')}</option>
                        <option value="HK">{t('regionHK')}</option>
                        <option value="SG">{t('regionSG')}</option>
                        <option value="MY">{t('regionMY')}</option>
                        <option value="OTHER">{t('regionOther')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                      <input type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder={t('phonePlaceholder')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                      <input type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder={t('emailPlaceholder')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('lineId')}</label>
                      <input type="text" value={customerInfo.line} onChange={(e) => setCustomerInfo({ ...customerInfo, line: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder={t('lineIdPlaceholder')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('wechat')}</label>
                      <input type="text" value={customerInfo.wechat} onChange={(e) => setCustomerInfo({ ...customerInfo, wechat: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder={t('wechatPlaceholder')} />
                    </div>
                  </div>
                  {contactError && <p className="mt-2 text-sm text-red-500">{contactError}</p>}
                  <p className="mt-2 text-xs text-gray-400">{t('contactMethodRequired')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('additionalNotes')}</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent" rows={4} placeholder={t('additionalNotesPlaceholder')} />
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">{t('serviceFee')}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">¥{SERVICE_INFO.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 ml-1">{t('taxIncluded').split('（')[0]}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{t('paymentNotice')}</p>
                  <button type="submit" disabled={processing} className="w-full py-4 bg-gradient-to-r from-teal-800 to-cyan-900 text-white font-bold rounded-xl hover:from-teal-700 hover:to-cyan-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {processing ? (<><Loader2 className="animate-spin" size={20} />{t('processing')}</>) : (<><CreditCard size={20} />{t('confirmPayment')}</>)}
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1"><Shield size={14} className="text-green-500" /><span>{t('securePayment')}</span></div>
                  <div className="flex items-center gap-1"><Clock size={14} className="text-teal-500" /><span>{t('contact24h')}</span></div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Image src="/icons/payment/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                  <Image src="/icons/payment/mastercard.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                  <Image src="/icons/payment/amex.svg" alt="American Express" width={40} height={25} className="h-6 w-auto" />
                  <Image src="/icons/payment/jcb.svg" alt="JCB" width={40} height={25} className="h-6 w-auto" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}
