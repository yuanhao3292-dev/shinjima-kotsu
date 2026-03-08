'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CheckoutLayout from '@/components/CheckoutLayout';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import ProviderBanner, { useProviderKey } from '@/components/ProviderBanner';
import { isValidSlug } from '@/lib/whitelabel-config';
import {
  ArrowLeft, CheckCircle, Shield, Clock,
  Loader2, CreditCard, Users, Phone,
  ChevronDown, ChevronUp,
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

// ─── Treatment definitions ───

interface TreatmentItem {
  slug: string;
  label: Record<Language, string>;
}

interface TreatmentCategory {
  id: string;
  name: Record<Language, string>;
  items: TreatmentItem[];
}

const TREATMENT_CATEGORIES: TreatmentCategory[] = [
  {
    id: 'msc-iv',
    name: {
      ja: 'MSC幹細胞 静脈/皮下注射',
      'zh-TW': 'MSC幹細胞 靜脈/皮下注射',
      'zh-CN': 'MSC干细胞 静脉/皮下注射',
      en: 'MSC Stem Cell IV/SC',
    },
    items: [
      {
        slug: 'helene-msc-iv-grade-b-minus',
        label: {
          ja: 'Grade B-（1億個）',
          'zh-TW': 'Grade B-（1億個）',
          'zh-CN': 'Grade B-（1亿个）',
          en: 'Grade B- (100M cells)',
        },
      },
      {
        slug: 'helene-msc-iv-grade-b',
        label: {
          ja: 'Grade B（4億個）',
          'zh-TW': 'Grade B（4億個）',
          'zh-CN': 'Grade B（4亿个）',
          en: 'Grade B (400M cells)',
        },
      },
      {
        slug: 'helene-msc-iv-grade-b-plus',
        label: {
          ja: 'Grade B+（7億個）',
          'zh-TW': 'Grade B+（7億個）',
          'zh-CN': 'Grade B+（7亿个）',
          en: 'Grade B+ (700M cells)',
        },
      },
      {
        slug: 'helene-msc-iv-grade-a-minus',
        label: {
          ja: 'Grade A-（10億個）',
          'zh-TW': 'Grade A-（10億個）',
          'zh-CN': 'Grade A-（10亿个）',
          en: 'Grade A- (1B cells)',
        },
      },
      {
        slug: 'helene-msc-iv-grade-a',
        label: {
          ja: 'Grade A（22.5億個）',
          'zh-TW': 'Grade A（22.5億個）',
          'zh-CN': 'Grade A（22.5亿个）',
          en: 'Grade A (2.25B cells)',
        },
      },
    ],
  },
  {
    id: 'msc-knee',
    name: {
      ja: 'MSC幹細胞 膝関節内注射',
      'zh-TW': 'MSC幹細胞 膝關節注射',
      'zh-CN': 'MSC干细胞 膝关节注射',
      en: 'MSC Knee Injection',
    },
    items: [
      {
        slug: 'helene-msc-knee-single',
        label: {
          ja: '片膝（1億個）',
          'zh-TW': '單膝（1億個）',
          'zh-CN': '单膝（1亿个）',
          en: 'Single Knee (100M cells)',
        },
      },
      {
        slug: 'helene-msc-knee-both',
        label: {
          ja: '両膝（2億個）',
          'zh-TW': '雙膝（2億個）',
          'zh-CN': '双膝（2亿个）',
          en: 'Both Knees (200M cells)',
        },
      },
    ],
  },
  {
    id: 'msc-periodontal',
    name: {
      ja: 'MSC幹細胞 歯周組織内注射',
      'zh-TW': 'MSC幹細胞 牙周組織注射',
      'zh-CN': 'MSC干细胞 牙周组织注射',
      en: 'MSC Periodontal',
    },
    items: [
      {
        slug: 'helene-msc-periodontal-single',
        label: {
          ja: '上顎or下顎（1億個）',
          'zh-TW': '單顎（1億個）',
          'zh-CN': '单颌（1亿个）',
          en: 'Single Jaw (100M cells)',
        },
      },
      {
        slug: 'helene-msc-periodontal-both',
        label: {
          ja: '上下顎（2億個）',
          'zh-TW': '雙顎（2億個）',
          'zh-CN': '双颌（2亿个）',
          en: 'Both Jaws (200M cells)',
        },
      },
    ],
  },
  {
    id: 'msc-hair',
    name: {
      ja: 'MSC幹細胞 脱毛部位注射',
      'zh-TW': 'MSC幹細胞 脫髮部位注射',
      'zh-CN': 'MSC干细胞 脱发部位注射',
      en: 'MSC Hair Loss',
    },
    items: [
      {
        slug: 'helene-msc-hair',
        label: {
          ja: 'Grade B（10億個）',
          'zh-TW': 'Grade B（10億個）',
          'zh-CN': 'Grade B（10亿个）',
          en: 'Grade B (1B cells)',
        },
      },
    ],
  },
  {
    id: 'exosome',
    name: {
      ja: '自己エクソソーム',
      'zh-TW': '自體外泌體',
      'zh-CN': '自体外泌体',
      en: 'Autologous Exosomes',
    },
    items: [
      {
        slug: 'helene-exosome-topical',
        label: {
          ja: '外用塗布（6ヶ月分）',
          'zh-TW': '外用塗抹（6個月份）',
          'zh-CN': '外用涂抹（6个月份）',
          en: 'Topical (6 Months)',
        },
      },
      {
        slug: 'helene-exosome-injection',
        label: {
          ja: 'セルフ注射（1ヶ月分）',
          'zh-TW': '自我注射（1個月份）',
          'zh-CN': '自我注射（1个月份）',
          en: 'Self-Injection (1 Month)',
        },
      },
    ],
  },
  {
    id: 'nk-cell',
    name: {
      ja: 'NK細胞',
      'zh-TW': 'NK細胞',
      'zh-CN': 'NK细胞',
      en: 'NK Cells',
    },
    items: [
      {
        slug: 'helene-nk-50',
        label: {
          ja: '静脈投与（50億個）',
          'zh-TW': '靜脈投與（50億個）',
          'zh-CN': '静脉投与（50亿个）',
          en: 'IV Therapy (5B cells)',
        },
      },
      {
        slug: 'helene-nk-100',
        label: {
          ja: '静脈投与（100億個）',
          'zh-TW': '靜脈投與（100億個）',
          'zh-CN': '静脉投与（100亿个）',
          en: 'IV Therapy (10B cells)',
        },
      },
    ],
  },
  {
    id: 'blood',
    name: {
      ja: '血液浄化',
      'zh-TW': '血液淨化',
      'zh-CN': '血液净化',
      en: 'Blood Purification',
    },
    items: [
      {
        slug: 'helene-blood-purification',
        label: {
          ja: '血液浄化療法',
          'zh-TW': '血液淨化療法',
          'zh-CN': '血液净化疗法',
          en: 'Blood Purification Therapy',
        },
      },
    ],
  },
];

// ─── Page translations ───

const pageTranslations = {
  pageTitle: { ja: 'ヘレネクリニック 治療予約', 'zh-TW': 'HELENE診所 治療預約', 'zh-CN': 'HELENE诊所 治疗预约', en: 'HELENE Clinic Treatment Booking' } as Record<Language, string>,
  pageTitleEn: { ja: 'HELENE Clinic - Treatment Booking', 'zh-TW': 'HELENE Clinic - Treatment Booking', 'zh-CN': 'HELENE Clinic - Treatment Booking', en: 'HELENE Clinic - Treatment Booking' } as Record<Language, string>,
  taxIncluded: { ja: '日円（税込）', 'zh-TW': '日円（税込）', 'zh-CN': '日元（含税）', en: 'JPY (tax incl.)' } as Record<Language, string>,
  backToMain: { ja: 'ヘレネクリニックに戻る', 'zh-TW': '返回HELENE診所', 'zh-CN': '返回HELENE诊所', en: 'Back to HELENE Clinic' } as Record<Language, string>,
  selectTreatment: { ja: '治療メニューを選択', 'zh-TW': '選擇治療項目', 'zh-CN': '选择治疗项目', en: 'Select Treatment' } as Record<Language, string>,
  selectTreatmentHint: { ja: '以下のメニューからご希望の治療をお選びください', 'zh-TW': '請從以下項目中選擇您希望的治療', 'zh-CN': '请从以下项目中选择您希望的治疗', en: 'Please select your desired treatment from the options below' } as Record<Language, string>,
  noTreatmentSelected: { ja: '治療メニューを選択してください', 'zh-TW': '請選擇治療項目', 'zh-CN': '请选择治疗项目', en: 'Please select a treatment' } as Record<Language, string>,
  selectedTreatment: { ja: '選択中の治療', 'zh-TW': '已選擇的治療', 'zh-CN': '已选择的治疗', en: 'Selected Treatment' } as Record<Language, string>,
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
  treatmentGoal: { ja: 'ご希望の治療目的', 'zh-TW': '治療目的', 'zh-CN': '治疗目的', en: 'Treatment Goal' } as Record<Language, string>,
  treatmentGoalPlaceholder: { ja: '例：アンチエイジング、膝の痛み緩和等', 'zh-TW': '例如：抗衰老、膝蓋疼痛緩解等', 'zh-CN': '例如：抗衰老、膝盖疼痛缓解等', en: 'e.g., Anti-aging, knee pain relief, etc.' } as Record<Language, string>,
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
  treatmentFee: { ja: '治療費用', 'zh-TW': '治療費用', 'zh-CN': '治疗费用', en: 'Treatment Fee' } as Record<Language, string>,
  paymentNotice: { ja: 'お支払い完了後、24時間以内にご連絡し、治療スケジュールをご案内いたします', 'zh-TW': '支付完成後，我們將在 24 小時內與您聯繫，確認治療時程安排', 'zh-CN': '支付完成后，我们将在 24 小时内与您联系，确认治疗时程安排', en: 'We will contact you within 24 hours after payment to confirm treatment schedule' } as Record<Language, string>,
  confirmPayment: { ja: '確認してお支払い', 'zh-TW': '確認並支付', 'zh-CN': '确认并支付', en: 'Confirm & Pay' } as Record<Language, string>,
  processing: { ja: '処理中...', 'zh-TW': '處理中...', 'zh-CN': '处理中...', en: 'Processing...' } as Record<Language, string>,
  securePayment: { ja: '安全なお支払い', 'zh-TW': '安全支付', 'zh-CN': '安全支付', en: 'Secure Payment' } as Record<Language, string>,
  contact24h: { ja: '24時間以内にご連絡', 'zh-TW': '24小時內聯繫', 'zh-CN': '24小时内联系', en: '24h Contact' } as Record<Language, string>,
  alertContactName: { ja: 'ご連絡先氏名をご入力ください', 'zh-TW': '請填寫聯繫人姓名', 'zh-CN': '请填写联系人姓名', en: 'Please enter contact name' } as Record<Language, string>,
  alertPatientName: { ja: '患者氏名をご入力ください', 'zh-TW': '請填寫患者姓名', 'zh-CN': '请填写患者姓名', en: 'Please enter patient name' } as Record<Language, string>,
  alertSelectTreatment: { ja: '治療メニューをお選びください', 'zh-TW': '請選擇治療項目', 'zh-CN': '请选择治疗项目', en: 'Please select a treatment' } as Record<Language, string>,
  alertContactMethod: { ja: '少なくとも一つの連絡方法（電話、メール、LINE、WeChat）をご入力ください', 'zh-TW': '請至少填寫一種聯繫方式（手機、郵箱、LINE 或微信）', 'zh-CN': '请至少填写一种联系方式（手机、邮箱、LINE 或微信）', en: 'Please provide at least one contact method (phone, email, LINE, or WeChat)' } as Record<Language, string>,
  alertPaymentError: { ja: 'お支払い処理でエラーが発生しました。しばらくしてから再度お試しください', 'zh-TW': '支付流程出現錯誤，請稍後重試', 'zh-CN': '支付流程出现错误，请稍后重试', en: 'Payment error occurred. Please try again later' } as Record<Language, string>,
  alertCreateSessionError: { ja: '支払いセッションの作成に失敗しました', 'zh-TW': '創建支付會話失敗', 'zh-CN': '创建支付会话失败', en: 'Failed to create payment session' } as Record<Language, string>,
  alertNoCheckoutUrl: { ja: '支払いリンクを取得できませんでした', 'zh-TW': '未獲取到支付鏈接', 'zh-CN': '未获取到支付链接', en: 'Failed to retrieve payment link' } as Record<Language, string>,
};

// ─── Page Component ───

export default function HeleneTreatmentPage() {
  const providerKey = useProviderKey();
  const searchParams = useSearchParams();
  const guideSlugParam = searchParams.get('guide');
  const guideSlug = guideSlugParam && isValidSlug(guideSlugParam) ? guideSlugParam : null;
  const backHref = guideSlug ? `/g/${guideSlug}/helene-clinic` : '/helene-clinic';
  const [currentLang, setCurrentLang] = useState<Language>('zh-CN');
  const [processing, setProcessing] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'msc-iv': true,
  });
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

  // ── Language detection ──
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

  // ── Derived state ──
  const selectedPrice = selectedSlug && MEDICAL_PACKAGES[selectedSlug]
    ? MEDICAL_PACKAGES[selectedSlug].priceJpy
    : 0;

  const selectedTreatmentLabel = (() => {
    if (!selectedSlug) return '';
    for (const cat of TREATMENT_CATEGORIES) {
      for (const item of cat.items) {
        if (item.slug === selectedSlug) {
          return `${cat.name[currentLang]} - ${item.label[currentLang]}`;
        }
      }
    }
    return '';
  })();

  // ── Category toggle ──
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // ── Validation ──
  const hasValidContact = () => {
    return (
      customerInfo.phone.trim() !== '' ||
      customerInfo.email.trim() !== '' ||
      customerInfo.line.trim() !== '' ||
      customerInfo.wechat.trim() !== ''
    );
  };

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactError('');
    setProcessing(true);

    try {
      if (!selectedSlug) {
        alert(t('alertSelectTreatment'));
        setProcessing(false);
        return;
      }
      if (!patientInfo.patientName) {
        alert(t('alertPatientName'));
        setProcessing(false);
        return;
      }
      if (!customerInfo.name) {
        alert(t('alertContactName'));
        setProcessing(false);
        return;
      }
      if (!hasValidContact()) {
        setContactError(t('alertContactMethod'));
        setProcessing(false);
        return;
      }

      const contactMethods: string[] = [];
      if (customerInfo.phone) contactMethods.push(`${t('phone')}: ${customerInfo.phone}`);
      if (customerInfo.email) contactMethods.push(`${t('email')}: ${customerInfo.email}`);
      if (customerInfo.line) contactMethods.push(`LINE: ${customerInfo.line}`);
      if (customerInfo.wechat) contactMethods.push(`WeChat: ${customerInfo.wechat}`);

      let fullNotes = `【${t('pageTitle')}】\n\n`;
      fullNotes += `【${t('selectedTreatment')}】\n`;
      fullNotes += `${selectedTreatmentLabel}\n`;
      fullNotes += `¥${selectedPrice.toLocaleString()} ${t('taxIncluded')}\n\n`;
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
          packageSlug: selectedSlug,
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
          provider: providerKey || 'helene_clinic',
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

  // ─── Render ───
  return (
    <CheckoutLayout>
      <Suspense fallback={null}>
        <ProviderBanner lang={currentLang} />
      </Suspense>

      {/* Top bar: back link */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-900 transition"
          >
            <ArrowLeft size={16} />
            {t('backToMain')}
          </Link>
        </div>
      </div>

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">{t('pageTitle')}</h1>
              <p className="text-indigo-200 text-sm mt-1">{t('pageTitleEn')}</p>
            </div>
            <div className="text-right">
              {selectedSlug ? (
                <>
                  <p className="text-4xl font-bold text-white">
                    ¥{selectedPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-indigo-200 mt-1">{t('taxIncluded')}</p>
                </>
              ) : (
                <p className="text-lg text-indigo-200">{t('noTreatmentSelected')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left sidebar: Treatment selector ── */}
          <div className="lg:col-span-1">
            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 sticky top-8">
              <h3 className="text-lg font-bold text-indigo-900 mb-1">{t('selectTreatment')}</h3>
              <p className="text-xs text-gray-500 mb-4">{t('selectTreatmentHint')}</p>

              {/* Selected treatment summary (top of sidebar) */}
              {selectedSlug && (
                <div className="mb-4 bg-white rounded-xl p-3 border border-indigo-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-indigo-600" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-indigo-900 break-words">{selectedTreatmentLabel}</p>
                      <p className="text-lg font-bold text-indigo-700 mt-0.5">
                        ¥{selectedPrice.toLocaleString()}
                        <span className="text-xs font-normal text-gray-500 ml-1">{t('taxIncluded')}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Category list */}
              <div className="space-y-2">
                {TREATMENT_CATEGORIES.map((category) => {
                  const isExpanded = !!expandedCategories[category.id];
                  const hasSel = category.items.some((it) => it.slug === selectedSlug);
                  return (
                    <div key={category.id} className="rounded-xl overflow-hidden border border-indigo-100 bg-white">
                      {/* Category header */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${
                          hasSel
                            ? 'bg-indigo-100 text-indigo-900'
                            : 'bg-white text-gray-800 hover:bg-indigo-50'
                        }`}
                      >
                        <span className="text-sm font-semibold leading-tight pr-2">
                          {category.name[currentLang]}
                        </span>
                        <span className="shrink-0">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </button>

                      {/* Items */}
                      {isExpanded && (
                        <div className="border-t border-indigo-50">
                          {category.items.map((item) => {
                            const pkg = MEDICAL_PACKAGES[item.slug];
                            const price = pkg ? pkg.priceJpy : 0;
                            const isSelected = item.slug === selectedSlug;
                            return (
                              <label
                                key={item.slug}
                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition border-b border-gray-50 last:border-b-0 ${
                                  isSelected
                                    ? 'bg-indigo-50'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="treatment"
                                  value={item.slug}
                                  checked={isSelected}
                                  onChange={() => setSelectedSlug(item.slug)}
                                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className={`text-sm leading-tight ${isSelected ? 'font-semibold text-indigo-900' : 'text-gray-700'}`}>
                                    {item.label[currentLang]}
                                  </p>
                                  <p className={`text-sm mt-0.5 ${isSelected ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>
                                    ¥{price.toLocaleString()}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right main area: Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{t('bookingInfo')}</h2>

              {/* Contract notice */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-indigo-800">
                  <strong>{t('contractNotice').split('：')[0]}：</strong>
                  {t('contractNotice').split('：')[1]}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Patient info */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-indigo-600" />
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={t('patientNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')}</label>
                      <input
                        type="text"
                        value={patientInfo.age}
                        onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={t('agePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')}</label>
                      <select
                        value={patientInfo.gender}
                        onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">{t('genderSelect')}</option>
                        <option value={t('male')}>{t('male')}</option>
                        <option value={t('female')}>{t('female')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('treatmentGoal')}</label>
                      <input
                        type="text"
                        value={patientInfo.treatmentGoal}
                        onChange={(e) => setPatientInfo({ ...patientInfo, treatmentGoal: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={t('treatmentGoalPlaceholder')}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('currentStatus')}</label>
                      <textarea
                        value={patientInfo.currentStatus}
                        onChange={(e) => setPatientInfo({ ...patientInfo, currentStatus: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                        placeholder={t('currentStatusPlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone size={18} className="text-indigo-600" />
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={t('contactNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('region')}</label>
                      <select
                        value={customerInfo.country}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={t('phonePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={t('emailPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('lineId')}</label>
                      <input
                        type="text"
                        value={customerInfo.line}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, line: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={t('lineIdPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('wechat')}</label>
                      <input
                        type="text"
                        value={customerInfo.wechat}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, wechat: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={t('wechatPlaceholder')}
                      />
                    </div>
                  </div>
                  {contactError && <p className="mt-2 text-sm text-red-500">{contactError}</p>}
                  <p className="mt-2 text-xs text-gray-400">{t('contactMethodRequired')}</p>
                </div>

                {/* Additional notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('additionalNotes')}</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                    placeholder={t('additionalNotesPlaceholder')}
                  />
                </div>

                {/* Payment summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t('treatmentFee')}</span>
                    <div className="text-right">
                      {selectedSlug ? (
                        <>
                          <span className="text-2xl font-bold text-gray-900">
                            ¥{selectedPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            {t('taxIncluded').split('（')[0]}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">{t('noTreatmentSelected')}</span>
                      )}
                    </div>
                  </div>
                  {selectedSlug && (
                    <p className="text-xs text-gray-500 mb-1">{selectedTreatmentLabel}</p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">{t('paymentNotice')}</p>
                  <button
                    type="submit"
                    disabled={processing || !selectedSlug}
                    className="w-full py-4 bg-gradient-to-r from-indigo-700 to-purple-800 text-white font-bold rounded-xl hover:from-indigo-800 hover:to-purple-900 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-green-500" />
                    <span>{t('securePayment')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-indigo-500" />
                    <span>{t('contact24h')}</span>
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
