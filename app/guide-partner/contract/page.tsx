'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Upload, Check, AlertCircle } from 'lucide-react';
import SignatureUpload from '@/components/guide-partner/SignatureUpload';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const translations = {
  pageTitle: {
    ja: 'コミッション契約',
    'zh-CN': '佣金协议',
    'zh-TW': '佣金協議',
    en: 'Commission Contract',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  noContract: {
    ja: 'コミッション契約なし',
    'zh-CN': '暂无佣金协议',
    'zh-TW': '暫無佣金協議',
    en: 'No Commission Contract',
  },
  noContractDesc: {
    ja: '管理者に連絡してコミッション契約を作成してください',
    'zh-CN': '请联系管理员创建您的佣金协议',
    'zh-TW': '請聯繫管理員創建您的佣金協議',
    en: 'Please contact the administrator to create your commission contract',
  },
  heading: {
    ja: '私のコミッション契約',
    'zh-CN': '我的佣金协议',
    'zh-TW': '我的佣金協議',
    en: 'My Commission Contract',
  },
  signed: {
    ja: '契約署名済み',
    'zh-CN': '协议已签署',
    'zh-TW': '協議已簽署',
    en: 'Contract Signed',
  },
  pendingSignature: {
    ja: '署名待ち',
    'zh-CN': '待签署',
    'zh-TW': '待簽署',
    en: 'Pending Signature',
  },
  signedDate: {
    ja: '署名日',
    'zh-CN': '您已于',
    'zh-TW': '您已於',
    en: 'Signed on',
  },
  signedSuffix: {
    ja: 'に契約を署名しました',
    'zh-CN': '签署协议',
    'zh-TW': '簽署協議',
    en: '',
  },
  pendingDesc: {
    ja: '契約をダウンロードし、署名後スキャンをアップロードしてください',
    'zh-CN': '请下载协议，签字后上传扫描件',
    'zh-TW': '請下載協議，簽字後上傳掃描件',
    en: 'Please download the contract, sign it, and upload the scanned copy',
  },
  contractInfo: {
    ja: '契約情報',
    'zh-CN': '协议信息',
    'zh-TW': '協議信息',
    en: 'Contract Information',
  },
  contractNumber: {
    ja: '契約番号：',
    'zh-CN': '合同编号：',
    'zh-TW': '合同編號：',
    en: 'Contract No.: ',
  },
  signDate: {
    ja: '署名日：',
    'zh-CN': '签署日期：',
    'zh-TW': '簽署日期：',
    en: 'Sign Date: ',
  },
  notSigned: {
    ja: '未署名',
    'zh-CN': '未签署',
    'zh-TW': '未簽署',
    en: 'Not signed',
  },
  effectiveDate: {
    ja: '発効日：',
    'zh-CN': '生效日期：',
    'zh-TW': '生效日期：',
    en: 'Effective Date: ',
  },
  expiryDate: {
    ja: '有効期限：',
    'zh-CN': '到期日期：',
    'zh-TW': '到期日期：',
    en: 'Expiry Date: ',
  },
  notSet: {
    ja: '未設定',
    'zh-CN': '未设置',
    'zh-TW': '未設置',
    en: 'Not set',
  },
  commissionStandard: {
    ja: 'コミッション基準',
    'zh-CN': '佣金标准',
    'zh-TW': '佣金標準',
    en: 'Commission Standard',
  },
  typeLabel: {
    ja: 'タイプ：',
    'zh-CN': '类型：',
    'zh-TW': '類型：',
    en: 'Type: ',
  },
  configLabel: {
    ja: '設定：',
    'zh-CN': '配置：',
    'zh-TW': '配置：',
    en: 'Config: ',
  },
  prohibitedTitle: {
    ja: '厳禁行為',
    'zh-CN': '严格禁止的行为',
    'zh-TW': '嚴格禁止的行為',
    en: 'Strictly Prohibited Conduct',
  },
  prohibit1: {
    ja: 'いかなる名目でも医療機関から直接費用や利益を受け取ってはなりません',
    'zh-CN': '不得以任何名义直接从医疗机构收取费用或好处',
    'zh-TW': '不得以任何名義直接從醫療機構收取費用或好處',
    en: 'Do not collect fees or benefits directly from medical institutions under any name',
  },
  prohibit2: {
    ja: '個人名義で顧客と医療ツーリズム契約を締結してはなりません',
    'zh-CN': '不得以个人名义与客户签署医疗旅游合同',
    'zh-TW': '不得以個人名義與客戶簽署醫療旅遊合同',
    en: 'Do not sign medical tourism contracts with clients in your personal name',
  },
  prohibit3: {
    ja: '医療効果を虚偽に宣伝してはなりません（「万病を治す」「100%治癒」等）',
    'zh-CN': '不得虚假宣传医疗效果（"包治百病""100%治愈"等）',
    'zh-TW': '不得虛假宣傳醫療效果（「包治百病」「100%治癒」等）',
    en: 'Do not falsely advertise medical results ("cure all diseases," "100% cure rate," etc.)',
  },
  prohibit4: {
    ja: '顧客の個人情報や医療プライバシーを漏洩してはなりません',
    'zh-CN': '不得泄露客户个人信息和医疗隐私',
    'zh-TW': '不得洩露客戶個人信息和醫療隱私',
    en: 'Do not disclose client personal information or medical privacy',
  },
  downloadTemplate: {
    ja: '契約テンプレートをダウンロード',
    'zh-CN': '下载协议模板',
    'zh-TW': '下載協議模板',
    en: 'Download Contract Template',
  },
  uploadSignature: {
    ja: '署名スキャンをアップロード',
    'zh-CN': '上传签字扫描件',
    'zh-TW': '上傳簽字掃描件',
    en: 'Upload Signed Scan',
  },
  alertSignSuccess: {
    ja: '署名のアップロードに成功しました！契約が有効になりました。',
    'zh-CN': '签字上传成功！协议已激活。',
    'zh-TW': '簽字上傳成功！協議已激活。',
    en: 'Signature uploaded successfully! Contract is now active.',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};
const dateLocaleMap: Record<Language, string> = { ja: 'ja-JP', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US' };

export default function GuideContractPage() {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const supabase = createClient();
  const lang = useLanguage();

  useEffect(() => {
    loadContract();
  }, []);

  async function loadContract() {
    // 获取当前登录导游的信息
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 获取导游ID
    const { data: guide } = await supabase
      .from('guides')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!guide) return;

    // 获取导游的佣金协议
    const { data: contractData } = await supabase
      .from('guide_commission_contracts')
      .select('*')
      .eq('guide_id', guide.id)
      .eq('status', 'active')
      .single();

    setContract(contractData);
    setLoading(false);
  }

  async function handleSignatureUploaded(url: string) {
    const { error } = await supabase
      .from('guide_commission_contracts')
      .update({
        guide_signature_url: url,
        signed_by_guide_at: new Date().toISOString(),
        status: 'active',
      })
      .eq('id', contract.id);

    if (!error) {
      alert(t('alertSignSuccess', lang));
      setShowUpload(false);
      loadContract();
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">{t('loading', lang)}</div></div>;

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GuideSidebar pageTitle={t('pageTitle', lang)} />
        <main className="lg:ml-64 pt-16 lg:pt-0">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noContract', lang)}</h3>
              <p className="text-gray-600">{t('noContractDesc', lang)}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hasSigned = !!contract.guide_signature_url;

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('heading', lang)}</h1>

          {/* 协议状态 */}
          <div className={`rounded-lg border p-6 mb-6 ${hasSigned ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-start gap-3">
              {hasSigned ? (
                <Check size={24} className="text-green-600" />
              ) : (
                <AlertCircle size={24} className="text-yellow-600" />
              )}
              <div>
                <h3 className={`font-bold mb-1 ${hasSigned ? 'text-green-900' : 'text-yellow-900'}`}>
                  {hasSigned ? t('signed', lang) : t('pendingSignature', lang)}
                </h3>
                <p className={`text-sm ${hasSigned ? 'text-green-700' : 'text-yellow-700'}`}>
                  {hasSigned
                    ? `${t('signedDate', lang)} ${new Date(contract.signed_by_guide_at).toLocaleDateString(dateLocaleMap[lang])} ${t('signedSuffix', lang)}`
                    : t('pendingDesc', lang)}
                </p>
              </div>
            </div>
          </div>

          {/* 协议信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('contractInfo', lang)}</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">{t('contractNumber', lang)}</span>{contract.contract_number}</div>
              <div><span className="text-gray-500">{t('signDate', lang)}</span>{contract.signed_by_guide_at ? new Date(contract.signed_by_guide_at).toLocaleDateString(dateLocaleMap[lang]) : t('notSigned', lang)}</div>
              <div><span className="text-gray-500">{t('effectiveDate', lang)}</span>{contract.effective_date || t('notSet', lang)}</div>
              <div><span className="text-gray-500">{t('expiryDate', lang)}</span>{contract.expiry_date || t('notSet', lang)}</div>
            </div>
          </div>

          {/* 佣金标准 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('commissionStandard', lang)}</h3>
            <div className="text-sm space-y-2">
              <div><span className="text-gray-500">{t('typeLabel', lang)}</span>{contract.commission_type}</div>
              <div><span className="text-gray-500">{t('configLabel', lang)}</span>{JSON.stringify(contract.commission_config)}</div>
            </div>
          </div>

          {/* 合规要求 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-red-900 mb-3">{t('prohibitedTitle', lang)}</h3>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• {t('prohibit1', lang)}</li>
              <li>• {t('prohibit2', lang)}</li>
              <li>• {t('prohibit3', lang)}</li>
              <li>• {t('prohibit4', lang)}</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <a
              href="/contracts/guide-commission-agreement.md"
              download
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <FileText size={20} />
              {t('downloadTemplate', lang)}
            </a>

            {!hasSigned && (
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                <Upload size={20} />
                {t('uploadSignature', lang)}
              </button>
            )}
          </div>

          {/* 上传签字组件 */}
          {showUpload && (
            <SignatureUpload
              onSuccess={handleSignatureUploaded}
              onCancel={() => setShowUpload(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
