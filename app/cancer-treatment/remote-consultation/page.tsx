'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import CheckoutLayout from '@/components/CheckoutLayout';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import ProviderBanner, { useProviderKey } from '@/components/ProviderBanner';
import {
  ArrowLeft, CheckCircle, FileText, Shield, Clock,
  Loader2, CreditCard, Users, Phone, Video, MessageSquare
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  // Service Info
  serviceName: { ja: '遠隔診療サービス', 'zh-TW': '遠程會診服務', 'zh-CN': '远程会诊服务', en: 'Remote Consultation' } as Record<Language, string>,
  serviceNameEn: { ja: 'Remote Consultation', 'zh-TW': 'Remote Consultation', 'zh-CN': 'Remote Consultation', en: 'Remote Consultation' } as Record<Language, string>,
  serviceDescription: { ja: '日本専門医とのビデオ診察・治療プラン詳細説明・費用詳細見積', 'zh-TW': '與日本醫生遠程視頻會診、討論治療方案、費用概算', 'zh-CN': '与日本医生远程视频会诊、讨论治疗方案、费用概算', en: 'Video consultation with Japanese doctor, treatment plan discussion, cost estimation' } as Record<Language, string>,
  serviceLongDescription: { ja: '日本の専門医と遠隔ビデオ診察を行い、専門医療通訳が全行程同行します。医師は治療計画、期待される効果、治療費用の詳細等を詳しく説明し、来日治療の決断をサポートします。', 'zh-TW': '與日本專科醫生進行遠程視頻會診，由專業醫療翻譯全程陪同。醫生將詳細說明治療方案、預期效果、治療費用明細等，幫助您做出赴日治療的決定。', 'zh-CN': '与日本专科医生进行远程视频会诊，由专业医疗翻译全程陪同。医生将详细说明治疗方案、预期效果、治疗费用明细等，帮助您做出赴日治疗的决定。', en: 'Remote video consultation with Japanese specialist, accompanied by professional medical interpreter. Doctor will explain treatment plan, expected outcomes, and detailed costs to help you make decisions.' } as Record<Language, string>,
  taxIncluded: { ja: '日円（税込）', 'zh-TW': '日円（税込）', 'zh-CN': '日元（含税）', en: 'JPY (tax incl.)' } as Record<Language, string>,
  videoConsultation: { ja: 'ビデオ診察', 'zh-TW': '視頻會診', 'zh-CN': '视频会诊', en: 'Video Consultation' } as Record<Language, string>,

  // Navigation
  backToMain: { ja: '日本がん総合治療に戻る', 'zh-TW': '返回日本綜合治療', 'zh-CN': '返回日本综合治疗', en: 'Back to Japan Cancer Treatment' } as Record<Language, string>,

  // Service Features
  featuresTitle: { ja: 'サービス内容', 'zh-TW': '服務包含', 'zh-CN': '服务包含', en: 'Service Includes' } as Record<Language, string>,
  feature1: { ja: '日本専門医とのビデオ診察（約30-60分）', 'zh-TW': '日本專科醫生視頻會診（約30-60分鐘）', 'zh-CN': '日本专科医生视频会诊（约30-60分钟）', en: 'Video consultation with Japanese specialist (30-60 mins)' } as Record<Language, string>,
  feature2: { ja: '専門医療通訳が全行程同行', 'zh-TW': '專業醫療翻譯全程陪同', 'zh-CN': '专业医疗翻译全程陪同', en: 'Professional medical interpreter throughout' } as Record<Language, string>,
  feature3: { ja: '詳細な治療計画のご説明', 'zh-TW': '詳細治療方案說明', 'zh-CN': '详细治疗方案说明', en: 'Detailed treatment plan explanation' } as Record<Language, string>,
  feature4: { ja: '治療費用の明細見積', 'zh-TW': '治療費用明細報價', 'zh-CN': '治疗费用明细报价', en: 'Detailed treatment cost quotation' } as Record<Language, string>,
  feature5: { ja: '質疑応答セッション', 'zh-TW': '問答環節解答疑問', 'zh-CN': '问答环节解答疑问', en: 'Q&A session' } as Record<Language, string>,
  feature6: { ja: '診察後の書面総括報告', 'zh-TW': '會診後書面總結報告', 'zh-CN': '会诊后书面总结报告', en: 'Written summary report after consultation' } as Record<Language, string>,

  // Prerequisites
  prerequisitesTitle: { ja: '前提条件', 'zh-TW': '前提條件', 'zh-CN': '前提条件', en: 'Prerequisites' } as Record<Language, string>,
  prereq1: { ja: '初期相談サービス完了済み', 'zh-TW': '已完成前期諮詢服務', 'zh-CN': '已完成前期咨询服务', en: 'Completed initial consultation service' } as Record<Language, string>,
  prereq2: { ja: '完全な診療情報提出済み', 'zh-TW': '已提交完整病歷資料', 'zh-CN': '已提交完整病历资料', en: 'Submitted complete medical records' } as Record<Language, string>,
  prereq3: { ja: '日本の病院の初期評価完了', 'zh-TW': '日本醫院已完成初步評估', 'zh-CN': '日本医院已完成初步评估', en: 'Japanese hospital completed initial assessment' } as Record<Language, string>,
  prereqNote: { ja: '* 初期相談未完了の場合は、まず初期相談サービスのご購入をお勧めします', 'zh-TW': '* 如尚未完成前期諮詢，建議先購買前期諮詢服務', 'zh-CN': '* 如尚未完成前期咨询，建议先购买前期咨询服务', en: '* If initial consultation not completed, please purchase initial consultation service first' } as Record<Language, string>,

  // Form Headers
  bookingInfo: { ja: 'ご予約情報', 'zh-TW': '預約信息', 'zh-CN': '预约信息', en: 'Booking Information' } as Record<Language, string>,
  contractNotice: { ja: 'ご契約について：本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。', 'zh-TW': 'ご契約について：本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。', 'zh-CN': 'ご契約について：本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。', en: 'Contract Notice: This service contract is concluded with Niijima Kotsu Co., Ltd. (Osaka Prefecture Registered Travel Agency No. 2-3115).' } as Record<Language, string>,

  // Patient Information
  patientInfoTitle: { ja: '患者情報', 'zh-TW': '患者信息', 'zh-CN': '患者信息', en: 'Patient Information' } as Record<Language, string>,
  patientName: { ja: '患者氏名 *', 'zh-TW': '患者姓名 *', 'zh-CN': '患者姓名 *', en: 'Patient Name *' } as Record<Language, string>,
  patientNamePlaceholder: { ja: '患者氏名をご入力ください', 'zh-TW': '請輸入患者姓名', 'zh-CN': '请输入患者姓名', en: 'Enter patient name' } as Record<Language, string>,
  age: { ja: '年齢', 'zh-TW': '年齡', 'zh-CN': '年龄', en: 'Age' } as Record<Language, string>,
  agePlaceholder: { ja: '例：65歳', 'zh-TW': '例如：65歲', 'zh-CN': '例如：65岁', en: 'e.g., 65' } as Record<Language, string>,
  gender: { ja: '性別', 'zh-TW': '性別', 'zh-CN': '性别', en: 'Gender' } as Record<Language, string>,
  genderSelect: { ja: 'ご選択ください', 'zh-TW': '請選擇', 'zh-CN': '请选择', en: 'Please select' } as Record<Language, string>,
  male: { ja: '男性', 'zh-TW': '男', 'zh-CN': '男', en: 'Male' } as Record<Language, string>,
  female: { ja: '女性', 'zh-TW': '女', 'zh-CN': '女', en: 'Female' } as Record<Language, string>,
  diagnosis: { ja: '診断名', 'zh-TW': '診斷', 'zh-CN': '诊断', en: 'Diagnosis' } as Record<Language, string>,
  diagnosisPlaceholder: { ja: '例：肺がんIII期', 'zh-TW': '例如：肺癌III期', 'zh-CN': '例如：肺癌III期', en: 'e.g., Stage III Lung Cancer' } as Record<Language, string>,
  previousConsultation: { ja: '初期相談の状況', 'zh-TW': '前期諮詢情況', 'zh-CN': '前期咨询情况', en: 'Previous Consultation Status' } as Record<Language, string>,
  previousConsultationPlaceholder: { ja: '初期相談の完了状況、相談先の病院等をご記入ください', 'zh-TW': '請說明是否已完成前期諮詢、諮詢的醫院等', 'zh-CN': '请说明是否已完成前期咨询、咨询的医院等', en: 'Please describe completion status of initial consultation, hospital consulted, etc.' } as Record<Language, string>,
  questionsToAsk: { ja: '診察時にお聞きになりたいこと', 'zh-TW': '希望諮詢的問題', 'zh-CN': '希望咨询的问题', en: 'Questions for Consultation' } as Record<Language, string>,
  questionsToAskPlaceholder: { ja: '診察時に医師に質問したい内容をご記入ください', 'zh-TW': '請列出您希望在會診中詢問醫生的問題', 'zh-CN': '请列出您希望在会诊中询问医生的问题', en: 'Please list questions you want to ask the doctor' } as Record<Language, string>,

  // Preferred Times
  preferredTimesTitle: { ja: 'ご希望診察時間', 'zh-TW': '希望會診時間', 'zh-CN': '希望会诊时间', en: 'Preferred Consultation Times' } as Record<Language, string>,
  preferredTimesNote: { ja: '1-3つのご都合の良い時間帯（日本時間 JST）をご入力ください。医師の予定に基づき確定いたします', 'zh-TW': '請提供 1-3 個您方便的時間段（日本時間 JST），我們將根據醫生排班確認', 'zh-CN': '请提供 1-3 个您方便的时间段（日本时间 JST），我们将根据医生排班确认', en: 'Please provide 1-3 convenient time slots (JST). We will confirm based on doctor\'s schedule' } as Record<Language, string>,
  preferredTime1: { ja: '第一希望時間', 'zh-TW': '首選時間', 'zh-CN': '首选时间', en: 'First Choice' } as Record<Language, string>,
  preferredTime2: { ja: '第二希望時間', 'zh-TW': '備選時間 1', 'zh-CN': '备选时间 1', en: 'Second Choice' } as Record<Language, string>,
  preferredTime3: { ja: '第三希望時間', 'zh-TW': '備選時間 2', 'zh-CN': '备选时间 2', en: 'Third Choice' } as Record<Language, string>,
  preferredTimePlaceholder1: { ja: '例：1月20日 14:00', 'zh-TW': '例如：1月20日 14:00', 'zh-CN': '例如：1月20日 14:00', en: 'e.g., Jan 20, 14:00' } as Record<Language, string>,
  preferredTimePlaceholder2: { ja: '例：1月21日 10:00', 'zh-TW': '例如：1月21日 10:00', 'zh-CN': '例如：1月21日 10:00', en: 'e.g., Jan 21, 10:00' } as Record<Language, string>,
  preferredTimePlaceholder3: { ja: '例：1月22日 15:00', 'zh-TW': '例如：1月22日 15:00', 'zh-CN': '例如：1月22日 15:00', en: 'e.g., Jan 22, 15:00' } as Record<Language, string>,

  // Contact Information
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

  // Additional Notes
  additionalNotes: { ja: '補足説明', 'zh-TW': '補充說明', 'zh-CN': '补充说明', en: 'Additional Notes' } as Record<Language, string>,
  additionalNotesPlaceholder: { ja: 'その他ご説明が必要な事項がございましたら、こちらにご記入ください', 'zh-TW': '如有其他需要說明的情況，請在此填寫', 'zh-CN': '如有其他需要说明的情况，请在此填写', en: 'If you have any other matters to explain, please write here' } as Record<Language, string>,

  // Payment Summary
  serviceFee: { ja: 'サービス料金', 'zh-TW': '服務費用', 'zh-CN': '服务费用', en: 'Service Fee' } as Record<Language, string>,
  paymentNotice: { ja: 'お支払い完了後、24時間以内にご連絡し、診察時間を確定いたします', 'zh-TW': '支付完成後，我們將在 24 小時內與您聯繫，確認會診時間', 'zh-CN': '支付完成后，我们将在 24 小时内与您联系，确认会诊时间', en: 'We will contact you within 24 hours after payment to confirm consultation time' } as Record<Language, string>,
  confirmPayment: { ja: '確認してお支払い', 'zh-TW': '確認並支付', 'zh-CN': '确认并支付', en: 'Confirm & Pay' } as Record<Language, string>,
  processing: { ja: '処理中...', 'zh-TW': '處理中...', 'zh-CN': '处理中...', en: 'Processing...' } as Record<Language, string>,

  // Trust Indicators
  securePayment: { ja: '安全なお支払い', 'zh-TW': '安全支付', 'zh-CN': '安全支付', en: 'Secure Payment' } as Record<Language, string>,
  confirmTime24h: { ja: '24時間以内に時間確定', 'zh-TW': '24小時內確認時間', 'zh-CN': '24小时内确认时间', en: '24h Time Confirmation' } as Record<Language, string>,

  // Alert Messages
  alertContactName: { ja: 'ご連絡先氏名をご入力ください', 'zh-TW': '請填寫聯繫人姓名', 'zh-CN': '请填写联系人姓名', en: 'Please enter contact name' } as Record<Language, string>,
  alertPatientName: { ja: '患者氏名をご入力ください', 'zh-TW': '請填寫患者姓名', 'zh-CN': '请填写患者姓名', en: 'Please enter patient name' } as Record<Language, string>,
  alertContactMethod: { ja: '少なくとも一つの連絡方法（電話、メール、LINE、WeChat）をご入力ください', 'zh-TW': '請至少填寫一種聯繫方式（手機、郵箱、LINE 或微信）', 'zh-CN': '请至少填写一种联系方式（手机、邮箱、LINE 或微信）', en: 'Please provide at least one contact method (phone, email, LINE, or WeChat)' } as Record<Language, string>,
  alertPaymentError: { ja: 'お支払い処理でエラーが発生しました。しばらくしてから再度お試しください', 'zh-TW': '支付流程出現錯誤，請稍後重試', 'zh-CN': '支付流程出现错误，请稍后重试', en: 'Payment error occurred. Please try again later' } as Record<Language, string>,
  alertCreateSessionError: { ja: '支払いセッションの作成に失敗しました', 'zh-TW': '創建支付會話失敗', 'zh-CN': '创建支付会话失败', en: 'Failed to create payment session' } as Record<Language, string>,
  alertNoCheckoutUrl: { ja: '支払いリンクを取得できませんでした', 'zh-TW': '未獲取到支付鏈接', 'zh-CN': '未获取到支付链接', en: 'Failed to retrieve payment link' } as Record<Language, string>,
};

const SERVICE_INFO = {
  id: MEDICAL_PACKAGES['cancer-remote-consultation'].slug,
  slug: MEDICAL_PACKAGES['cancer-remote-consultation'].slug,
  price: MEDICAL_PACKAGES['cancer-remote-consultation'].priceJpy,
};

export default function RemoteConsultationPage() {
  const providerKey = useProviderKey();
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW');
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    line: '',
    wechat: '',
    country: 'TW',
  });
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    age: '',
    gender: '',
    diagnosis: '',
    previousConsultation: '',
    questions: '',
  });
  const [preferredTimes, setPreferredTimes] = useState({
    time1: '',
    time2: '',
    time3: '',
  });
  const [notes, setNotes] = useState('');
  const [contactError, setContactError] = useState('');

  // Language detection from NEXT_LOCALE cookie or browser language
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
    return pageTranslations[key][currentLang] || pageTranslations[key]['zh-TW'];
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
      if (!customerInfo.name) {
        alert(t('alertContactName'));
        setProcessing(false);
        return;
      }
      if (!patientInfo.patientName) {
        alert(t('alertPatientName'));
        setProcessing(false);
        return;
      }
      if (!hasValidContact()) {
        setContactError(t('alertContactMethod'));
        setProcessing(false);
        return;
      }

      // Build contact methods info
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
      fullNotes += `${t('diagnosis')}: ${patientInfo.diagnosis || '未提供'}\n`;
      fullNotes += `${t('previousConsultation')}: ${patientInfo.previousConsultation || '未提供'}\n\n`;
      fullNotes += `【${t('questionsToAsk')}】\n${patientInfo.questions || '未提供'}\n\n`;
      fullNotes += `【${t('preferredTimesTitle')}】\n`;
      if (preferredTimes.time1) fullNotes += `${t('preferredTime1')}: ${preferredTimes.time1}\n`;
      if (preferredTimes.time2) fullNotes += `${t('preferredTime2')}: ${preferredTimes.time2}\n`;
      if (preferredTimes.time3) fullNotes += `${t('preferredTime3')}: ${preferredTimes.time3}\n`;
      fullNotes += `\n【${t('contactInfoTitle')}】\n${contactMethods.join('\n')}\n\n`;
      if (notes) {
        fullNotes += `【${t('additionalNotes')}】\n${notes}`;
      }

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
          preferredDate: preferredTimes.time1 || null,
          preferredTime: null,
          notes: fullNotes,
          provider: providerKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('alertCreateSessionError'));
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else throw new Error(t('alertNoCheckoutUrl'));
    } catch (error: any) {
      alert(error.message || t('alertPaymentError'));
    } finally {
      setProcessing(false);
    }
  }

  return (
    <CheckoutLayout>
      <Suspense fallback={null}>
        <ProviderBanner lang={currentLang} />
      </Suspense>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link
            href="/cancer-treatment"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition"
          >
            <ArrowLeft size={16} />
            {t('backToMain')}
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video size={20} className="text-purple-200" />
                <span className="text-purple-200 text-sm">{t('videoConsultation')}</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-white">{t('serviceName')}</h1>
              <p className="text-purple-200 text-sm mt-1">{t('serviceNameEn')}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">¥{SERVICE_INFO.price.toLocaleString()}</p>
              <p className="text-xs text-purple-200 mt-1">{t('taxIncluded')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Service Info */}
          <div className="lg:col-span-1">
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 sticky top-8">
              <h3 className="text-lg font-bold text-purple-900 mb-3">{t('featuresTitle')}</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{t('serviceLongDescription')}</p>
              <div className="space-y-2.5 text-sm text-gray-700">
                {[t('feature1'), t('feature2'), t('feature3'), t('feature4'), t('feature5'), t('feature6')].map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-purple-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-purple-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-purple-600" />
                  {t('prerequisitesTitle')}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[t('prereq1'), t('prereq2'), t('prereq3')].map((prereq, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-orange-600 mt-4">{t('prereqNote')}</p>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{t('bookingInfo')}</h2>

              {/* Contract Notice */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-purple-800">
                  <strong>{t('contractNotice').split('：')[0]}：</strong>{t('contractNotice').split('：')[1]}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Patient Info */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-purple-600" />
                    {t('patientInfoTitle')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('patientName')}</label>
                      <input
                        type="text"
                        required
                        value={patientInfo.patientName}
                        onChange={(e) => setPatientInfo({ ...patientInfo, patientName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('patientNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')}</label>
                      <input
                        type="text"
                        value={patientInfo.age}
                        onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('agePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')}</label>
                      <select
                        value={patientInfo.gender}
                        onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">{t('genderSelect')}</option>
                        <option value={t('male')}>{t('male')}</option>
                        <option value={t('female')}>{t('female')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('diagnosis')}</label>
                      <input
                        type="text"
                        value={patientInfo.diagnosis}
                        onChange={(e) => setPatientInfo({ ...patientInfo, diagnosis: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('diagnosisPlaceholder')}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('previousConsultation')}</label>
                      <textarea
                        value={patientInfo.previousConsultation}
                        onChange={(e) => setPatientInfo({ ...patientInfo, previousConsultation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={2}
                        placeholder={t('previousConsultationPlaceholder')}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('questionsToAsk')}</label>
                      <textarea
                        value={patientInfo.questions}
                        onChange={(e) => setPatientInfo({ ...patientInfo, questions: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder={t('questionsToAskPlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Times */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-purple-600" />
                    {t('preferredTimesTitle')}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {t('preferredTimesNote')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('preferredTime1')}</label>
                      <input
                        type="text"
                        value={preferredTimes.time1}
                        onChange={(e) => setPreferredTimes({ ...preferredTimes, time1: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('preferredTimePlaceholder1')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('preferredTime2')}</label>
                      <input
                        type="text"
                        value={preferredTimes.time2}
                        onChange={(e) => setPreferredTimes({ ...preferredTimes, time2: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('preferredTimePlaceholder2')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('preferredTime3')}</label>
                      <input
                        type="text"
                        value={preferredTimes.time3}
                        onChange={(e) => setPreferredTimes({ ...preferredTimes, time3: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('preferredTimePlaceholder3')}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone size={18} className="text-purple-600" />
                    {t('contactInfoTitle')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactName')}</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('contactNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('region')}</label>
                      <select
                        value={customerInfo.country}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
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
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('phonePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('emailPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('lineId')}</label>
                      <input
                        type="text"
                        value={customerInfo.line}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, line: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('lineIdPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('wechat')}</label>
                      <input
                        type="text"
                        value={customerInfo.wechat}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, wechat: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('wechatPlaceholder')}
                      />
                    </div>
                  </div>
                  {contactError && (
                    <p className="mt-2 text-sm text-red-500">{contactError}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">{t('contactMethodRequired')}</p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('additionalNotes')}</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder={t('additionalNotesPlaceholder')}
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">{t('serviceFee')}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">¥{SERVICE_INFO.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 ml-1">{t('taxIncluded').split('（')[0]}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    {t('paymentNotice')}
                  </p>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        {t('processing')}
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        {t('confirmPayment')}
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-green-500" />
                    <span>{t('securePayment')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-purple-500" />
                    <span>{t('confirmTime24h')}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}
