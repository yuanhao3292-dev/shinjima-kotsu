'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'ja';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
      return value as Language;
    }
  }
  return 'ja';
}

const t: Record<Language, {
  heroTag: string;
  heroTitle: string;
  legalNote: string;
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
  linkYakkan: string;
  linkTokushoho: string;
  linkTerms: string;
  linkPrivacy: string;
}> = {
  ja: {
    heroTag: 'Medical Disclaimer',
    heroTitle: '医療サービスに関する免責事項',
    legalNote: '',
    intro: '新島交通株式会社（以下「当社」）は、大阪府知事登録旅行業 第2-3115号の登録を受けた旅行業者として、医療ツーリズムにおける予約手配・渡航支援サービスを提供しています。本ページでは、医療サービスに関する重要な免責事項をご案内いたします。',
    sections: [
      {
        title: '1. 当社の役割について',
        paragraphs: [
          '当社は旅行業者として、提携医療機関との予約手配、通訳・翻訳手配、渡航・宿泊手配等の旅行サービスを提供する立場です。医療行為そのものの提供者ではありません。',
          '医療サービスは、各提携医療機関の医師・医療従事者が直接提供します。当社は医療機関ではなく、医師法に基づく診断・治療行為は行いません。',
        ],
      },
      {
        title: '2. 治療効果について',
        paragraphs: [
          '当サイトに掲載されている医療サービスの効果・効能に関する記述は、一般的な医学情報の提供を目的としたものであり、特定の治療効果を保証するものではありません。',
          '治療効果には個人差があり、すべての方に同様の結果が得られるとは限りません。治療に関する最終的な判断は、担当医師との十分な相談の上で行ってください。',
        ],
      },
      {
        title: '3. インフォームド・コンセントについて',
        paragraphs: [
          '医療サービスをご利用になる場合、提携医療機関との間で別途インフォームド・コンセント（説明と同意）の手続きを行っていただきます。治療内容、リスク、副作用、代替治療の選択肢等について、担当医師から直接説明を受けた上で、ご自身の判断で同意いただく必要があります。',
        ],
      },
      {
        title: '4. 医療機関の責任について',
        paragraphs: [
          '医療サービスの提供に関する責任は、各提携医療機関が直接負います。医療行為の結果（合併症、副作用、期待された効果が得られない場合等）については、当社は責任を負いかねます。',
          '万が一、医療サービスに関してトラブルが生じた場合は、まず提携医療機関に直接ご相談ください。当社としても可能な範囲で連絡・調整のサポートを行います。',
        ],
      },
      {
        title: '5. 健康情報の正確性について',
        paragraphs: [
          'お客様は、ご自身の健康状態、既往歴、服用中の薬剤、アレルギー等に関する正確な情報を、当社および提携医療機関に対して提供する義務があります。不正確または不完全な情報に基づくサービス提供の結果について、当社は責任を負いかねます。',
        ],
      },
      {
        title: '6. 自由診療について',
        paragraphs: [
          '当サイトで取り扱う医療サービスの多くは自由診療（保険適用外）です。治療費は全額自己負担となります。各サービスページに表示された料金は税込価格ですが、別途交通費・宿泊費等が発生する場合があります。',
          '自由診療は公的医療保険の適用対象外であり、治療費の還付・補助を受けることはできません。',
        ],
      },
      {
        title: '7. 当サイトの医療情報について',
        paragraphs: [
          '当サイトに掲載されている医療に関する情報は、一般的な情報提供を目的としたものであり、医師による診断や治療の代替となるものではありません。健康上の問題がある場合は、必ず医師にご相談ください。',
          '掲載情報の正確性には十分注意を払っていますが、医学の進歩により情報が最新でない場合があります。最新の医療情報については、担当医師または提携医療機関にご確認ください。',
        ],
      },
      {
        title: '8. 渡航に伴うリスクについて',
        paragraphs: [
          '海外から日本への医療ツーリズムにおいて、長時間のフライトや環境の変化が健康状態に影響を与える可能性があります。渡航前に、担当医師にご相談の上、渡航の可否をご判断ください。',
          '当社は、お客様の渡航中の健康状態の変化や、渡航に起因する健康上の問題について責任を負いかねます。海外旅行保険への加入を強くお勧めいたします。',
        ],
      },
    ],
    linkYakkan: '旅行業約款',
    linkTokushoho: '特定商取引法に基づく表記',
    linkTerms: '利用規約',
    linkPrivacy: 'プライバシーポリシー',
  },
  'zh-TW': {
    heroTag: 'Medical Disclaimer',
    heroTitle: '醫療服務免責聲明',
    legalNote: '※ 本免責聲明以日語版為法律效力文本，翻譯僅供參考。',
    intro: '新島交通株式會社（以下簡稱「本公司」）作為持有大阪府知事登錄旅行業第2-3115號的旅行業者，提供醫療旅遊預約安排及渡航支援服務。本頁面告知與醫療服務相關之重要免責事項。',
    sections: [
      {
        title: '1. 本公司之角色',
        paragraphs: [
          '本公司作為旅行業者，提供與合作醫療機構之預約安排、口譯翻譯、渡航住宿安排等旅行服務。本公司並非醫療行為之提供者。',
          '醫療服務由各合作醫療機構之醫師及醫療人員直接提供。本公司並非醫療機構，不進行基於醫師法之診斷或治療行為。',
        ],
      },
      {
        title: '2. 關於治療效果',
        paragraphs: [
          '本網站所載之醫療服務效果相關說明，旨在提供一般醫學資訊，並不保證特定之治療效果。',
          '治療效果因人而異，並非所有人都能獲得相同結果。治療之最終判斷，請在與主治醫師充分諮詢後進行。',
        ],
      },
      {
        title: '3. 關於知情同意',
        paragraphs: [
          '使用醫療服務時，您需與合作醫療機構另行進行知情同意程序。治療內容、風險、副作用、替代治療方案等，須由主治醫師直接說明後，由您自行判斷並同意。',
        ],
      },
      {
        title: '4. 關於醫療機構之責任',
        paragraphs: [
          '醫療服務之提供責任由各合作醫療機構直接承擔。對於醫療行為之結果（併發症、副作用、未達預期效果等），本公司不承擔責任。',
          '萬一發生與醫療服務相關之問題，請先直接與合作醫療機構聯繫。本公司亦將在可能範圍內提供聯絡協調支援。',
        ],
      },
      {
        title: '5. 關於健康資訊之準確性',
        paragraphs: [
          '客戶有義務向本公司及合作醫療機構提供關於自身健康狀況、病史、正在服用之藥物、過敏等之準確資訊。對於基於不準確或不完整資訊所提供之服務結果，本公司不承擔責任。',
        ],
      },
      {
        title: '6. 關於自費醫療',
        paragraphs: [
          '本網站處理之多數醫療服務為自費醫療（非保險適用）。治療費用須全額自行負擔。各服務頁面所顯示之費用為含稅價格，但可能另行產生交通費、住宿費等。',
          '自費醫療不適用公共醫療保險，無法獲得治療費之退款或補助。',
        ],
      },
      {
        title: '7. 關於本網站之醫療資訊',
        paragraphs: [
          '本網站所載之醫療相關資訊旨在提供一般資訊，不能替代醫師之診斷或治療。如有健康問題，請務必諮詢醫師。',
          '我們雖已充分注意所載資訊之準確性，但因醫學進步，資訊可能並非最新。最新之醫療資訊請向主治醫師或合作醫療機構確認。',
        ],
      },
      {
        title: '8. 關於渡航風險',
        paragraphs: [
          '從海外赴日之醫療旅遊中，長時間飛行及環境變化可能影響健康狀況。渡航前請諮詢主治醫師，判斷是否適合渡航。',
          '本公司對客戶渡航中之健康狀況變化或因渡航引起之健康問題不承擔責任。強烈建議購買海外旅行保險。',
        ],
      },
    ],
    linkYakkan: '旅行業約款',
    linkTokushoho: '特定商取引法標示',
    linkTerms: '使用條款',
    linkPrivacy: '隱私政策',
  },
  'zh-CN': {
    heroTag: 'Medical Disclaimer',
    heroTitle: '医疗服务免责声明',
    legalNote: '※ 本免责声明以日语版为法律效力文本，翻译仅供参考。',
    intro: '新岛交通株式会社（以下简称"本公司"）作为持有大阪府知事登录旅行业第2-3115号的旅行业者，提供医疗旅游预约安排及渡航支援服务。本页面告知与医疗服务相关之重要免责事项。',
    sections: [
      {
        title: '1. 本公司之角色',
        paragraphs: [
          '本公司作为旅行业者，提供与合作医疗机构之预约安排、口译翻译、渡航住宿安排等旅行服务。本公司并非医疗行为之提供者。',
          '医疗服务由各合作医疗机构之医师及医疗人员直接提供。本公司并非医疗机构，不进行基于医师法之诊断或治疗行为。',
        ],
      },
      {
        title: '2. 关于治疗效果',
        paragraphs: [
          '本网站所载之医疗服务效果相关说明，旨在提供一般医学信息，并不保证特定之治疗效果。',
          '治疗效果因人而异，并非所有人都能获得相同结果。治疗之最终判断，请在与主治医师充分咨询后进行。',
        ],
      },
      {
        title: '3. 关于知情同意',
        paragraphs: [
          '使用医疗服务时，您需与合作医疗机构另行进行知情同意程序。治疗内容、风险、副作用、替代治疗方案等，须由主治医师直接说明后，由您自行判断并同意。',
        ],
      },
      {
        title: '4. 关于医疗机构之责任',
        paragraphs: [
          '医疗服务之提供责任由各合作医疗机构直接承担。对于医疗行为之结果（并发症、副作用、未达预期效果等），本公司不承担责任。',
          '万一发生与医疗服务相关之问题，请先直接与合作医疗机构联系。本公司亦将在可能范围内提供联络协调支援。',
        ],
      },
      {
        title: '5. 关于健康信息之准确性',
        paragraphs: [
          '客户有义务向本公司及合作医疗机构提供关于自身健康状况、病史、正在服用之药物、过敏等之准确信息。对于基于不准确或不完整信息所提供之服务结果，本公司不承担责任。',
        ],
      },
      {
        title: '6. 关于自费医疗',
        paragraphs: [
          '本网站处理之多数医疗服务为自费医疗（非保险适用）。治疗费用须全额自行负担。各服务页面所显示之费用为含税价格，但可能另行产生交通费、住宿费等。',
          '自费医疗不适用公共医疗保险，无法获得治疗费之退款或补助。',
        ],
      },
      {
        title: '7. 关于本网站之医疗信息',
        paragraphs: [
          '本网站所载之医疗相关信息旨在提供一般信息，不能替代医师之诊断或治疗。如有健康问题，请务必咨询医师。',
          '我们虽已充分注意所载信息之准确性，但因医学进步，信息可能并非最新。最新之医疗信息请向主治医师或合作医疗机构确认。',
        ],
      },
      {
        title: '8. 关于渡航风险',
        paragraphs: [
          '从海外赴日之医疗旅游中，长时间飞行及环境变化可能影响健康状况。渡航前请咨询主治医师，判断是否适合渡航。',
          '本公司对客户渡航中之健康状况变化或因渡航引起之健康问题不承担责任。强烈建议购买海外旅行保险。',
        ],
      },
    ],
    linkYakkan: '旅行业约款',
    linkTokushoho: '特定商取引法标示',
    linkTerms: '使用条款',
    linkPrivacy: '隐私政策',
  },
  en: {
    heroTag: 'Medical Disclaimer',
    heroTitle: 'Medical Service Disclaimer',
    legalNote: '※ The Japanese version is the legally binding text. This translation is for reference only.',
    intro: 'Niijima Kotsu Co., Ltd. (hereinafter "the Company"), as a registered travel agency under Osaka Prefectural Governor Registration No. 2-3115, provides reservation arrangement and travel support services for medical tourism. This page outlines important disclaimers regarding medical services.',
    sections: [
      {
        title: '1. Role of the Company',
        paragraphs: [
          'The Company, as a travel agency, provides travel services including appointment arrangements with partner medical institutions, interpretation and translation, and travel and accommodation arrangements. The Company is not a provider of medical procedures.',
          'Medical services are directly provided by physicians and medical professionals at each partner medical institution. The Company is not a medical institution and does not perform diagnosis or treatment under the Medical Practitioners Act.',
        ],
      },
      {
        title: '2. Treatment Outcomes',
        paragraphs: [
          'Descriptions regarding the effects and efficacy of medical services on this website are intended to provide general medical information and do not guarantee specific treatment outcomes.',
          'Treatment outcomes vary between individuals and the same results may not be obtained for everyone. Final decisions regarding treatment should be made after thorough consultation with the attending physician.',
        ],
      },
      {
        title: '3. Informed Consent',
        paragraphs: [
          'When using medical services, you will undergo a separate informed consent process with the partner medical institution. You must receive direct explanation from the attending physician regarding treatment content, risks, side effects, alternative treatment options, etc., and consent based on your own judgment.',
        ],
      },
      {
        title: '4. Medical Institution Liability',
        paragraphs: [
          'Liability for the provision of medical services is borne directly by each partner medical institution. The Company cannot be held liable for the results of medical procedures (complications, side effects, failure to achieve expected outcomes, etc.).',
          'In the unlikely event of problems related to medical services, please contact the partner medical institution directly first. The Company will also provide liaison and coordination support to the extent possible.',
        ],
      },
      {
        title: '5. Accuracy of Health Information',
        paragraphs: [
          'Customers have an obligation to provide accurate information regarding their health condition, medical history, medications being taken, allergies, etc. to the Company and partner medical institutions. The Company cannot be held liable for service outcomes based on inaccurate or incomplete information.',
        ],
      },
      {
        title: '6. Self-Pay Medical Treatment',
        paragraphs: [
          'Many medical services handled on this website are self-pay treatments (not covered by insurance). Treatment costs must be borne entirely by the patient. Prices displayed on each service page include tax, but additional transportation and accommodation costs may apply.',
          'Self-pay medical treatment is not covered by public health insurance, and refunds or subsidies for treatment costs cannot be obtained.',
        ],
      },
      {
        title: '7. Medical Information on This Website',
        paragraphs: [
          'Medical information published on this website is intended for general informational purposes and is not a substitute for diagnosis or treatment by a physician. If you have health concerns, please be sure to consult a physician.',
          'While we take great care to ensure the accuracy of published information, information may not be current due to advances in medicine. For the latest medical information, please confirm with your attending physician or partner medical institution.',
        ],
      },
      {
        title: '8. Travel-Related Risks',
        paragraphs: [
          'In medical tourism from overseas to Japan, long flights and environmental changes may affect health conditions. Before traveling, please consult your physician and determine whether travel is appropriate.',
          'The Company cannot be held liable for changes in health condition during travel or health problems caused by travel. We strongly recommend purchasing overseas travel insurance.',
        ],
      },
    ],
    linkYakkan: 'Travel Terms',
    linkTokushoho: 'Specified Commercial Transactions',
    linkTerms: 'Terms of Use',
    linkPrivacy: 'Privacy Policy',
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-brand-900 mb-3">{title}</h2>
      <div className="text-neutral-700 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function MedicalDisclaimerPage() {
  const [lang, setLang] = useState<Language>('ja');
  useEffect(() => { setLang(getInitialLang()); }, []);
  const l = t[lang];

  return (
    <PublicLayout showFooter>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center bg-brand-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
          <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
        </div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400"></div>
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">{l.heroTag}</span>
              <div className="h-[1px] w-12 bg-gold-400"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
              {l.heroTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl space-y-6">
          {l.legalNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs">
              {l.legalNote}
            </div>
          )}

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8">
            <p className="text-neutral-700 text-sm leading-relaxed">{l.intro}</p>
          </div>

          {l.sections.map((section, i) => (
            <Section key={i} title={section.title}>
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </Section>
          ))}

          {/* 関連リンク */}
          <div className="flex flex-wrap gap-6 pt-8 border-t border-neutral-200">
            <Link href="/legal/yakkan" className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors">
              {l.linkYakkan} <ArrowRight size={14} />
            </Link>
            <Link href="/legal/tokushoho" className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors">
              {l.linkTokushoho} <ArrowRight size={14} />
            </Link>
            <Link href="/legal/terms" className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors">
              {l.linkTerms} <ArrowRight size={14} />
            </Link>
            <Link href="/legal/privacy" className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors">
              {l.linkPrivacy} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
