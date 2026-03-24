'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

/**
 * 医療サービスに関する免責事項
 * 医療広告ガイドライン・医療法・薬機法に基づく免責表示
 */

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
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">Medical Disclaimer</span>
              <div className="h-[1px] w-12 bg-gold-400"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
              医療サービスに関する免責事項
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl space-y-6">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8">
            <p className="text-neutral-700 text-sm leading-relaxed">
              新島交通株式会社（以下「当社」）は、大阪府知事登録旅行業 第2-3115号の登録を受けた旅行業者として、
              医療ツーリズムにおける予約手配・渡航支援サービスを提供しています。
              本ページでは、医療サービスに関する重要な免責事項をご案内いたします。
            </p>
          </div>

          <Section title="1. 当社の役割について">
            <p>
              当社は旅行業者として、提携医療機関との予約手配、通訳・翻訳手配、
              渡航・宿泊手配等の旅行サービスを提供する立場です。
              医療行為そのものの提供者ではありません。
            </p>
            <p>
              医療サービスは、各提携医療機関の医師・医療従事者が直接提供します。
              当社は医療機関ではなく、医師法に基づく診断・治療行為は行いません。
            </p>
          </Section>

          <Section title="2. 治療効果について">
            <p>
              当サイトに掲載されている医療サービスの効果・効能に関する記述は、
              一般的な医学情報の提供を目的としたものであり、特定の治療効果を保証するものではありません。
            </p>
            <p>
              治療効果には個人差があり、すべての方に同様の結果が得られるとは限りません。
              治療に関する最終的な判断は、担当医師との十分な相談の上で行ってください。
            </p>
          </Section>

          <Section title="3. インフォームド・コンセントについて">
            <p>
              医療サービスをご利用になる場合、提携医療機関との間で別途インフォームド・コンセント
              （説明と同意）の手続きを行っていただきます。治療内容、リスク、副作用、
              代替治療の選択肢等について、担当医師から直接説明を受けた上で、
              ご自身の判断で同意いただく必要があります。
            </p>
          </Section>

          <Section title="4. 医療機関の責任について">
            <p>
              医療サービスの提供に関する責任は、各提携医療機関が直接負います。
              医療行為の結果（合併症、副作用、期待された効果が得られない場合等）については、
              当社は責任を負いかねます。
            </p>
            <p>
              万が一、医療サービスに関してトラブルが生じた場合は、
              まず提携医療機関に直接ご相談ください。
              当社としても可能な範囲で連絡・調整のサポートを行います。
            </p>
          </Section>

          <Section title="5. 健康情報の正確性について">
            <p>
              お客様は、ご自身の健康状態、既往歴、服用中の薬剤、アレルギー等に関する
              正確な情報を、当社および提携医療機関に対して提供する義務があります。
              不正確または不完全な情報に基づくサービス提供の結果について、
              当社は責任を負いかねます。
            </p>
          </Section>

          <Section title="6. 自由診療について">
            <p>
              当サイトで取り扱う医療サービスの多くは自由診療（保険適用外）です。
              治療費は全額自己負担となります。各サービスページに表示された料金は
              税込価格ですが、別途交通費・宿泊費等が発生する場合があります。
            </p>
            <p>
              自由診療は公的医療保険の適用対象外であり、
              治療費の還付・補助を受けることはできません。
            </p>
          </Section>

          <Section title="7. 当サイトの医療情報について">
            <p>
              当サイトに掲載されている医療に関する情報は、一般的な情報提供を目的としたものであり、
              医師による診断や治療の代替となるものではありません。
              健康上の問題がある場合は、必ず医師にご相談ください。
            </p>
            <p>
              掲載情報の正確性には十分注意を払っていますが、医学の進歩により
              情報が最新でない場合があります。最新の医療情報については、
              担当医師または提携医療機関にご確認ください。
            </p>
          </Section>

          <Section title="8. 渡航に伴うリスクについて">
            <p>
              海外から日本への医療ツーリズムにおいて、長時間のフライトや環境の変化が
              健康状態に影響を与える可能性があります。渡航前に、担当医師にご相談の上、
              渡航の可否をご判断ください。
            </p>
            <p>
              当社は、お客様の渡航中の健康状態の変化や、
              渡航に起因する健康上の問題について責任を負いかねます。
              海外旅行保険への加入を強くお勧めいたします。
            </p>
          </Section>

          {/* 関連リンク */}
          <div className="flex flex-wrap gap-6 pt-8 border-t border-neutral-200">
            <Link
              href="/legal/yakkan"
              className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors"
            >
              旅行業約款 <ArrowRight size={14} />
            </Link>
            <Link
              href="/legal/tokushoho"
              className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors"
            >
              特定商取引法に基づく表記 <ArrowRight size={14} />
            </Link>
            <Link
              href="/legal/terms"
              className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors"
            >
              利用規約 <ArrowRight size={14} />
            </Link>
            <Link
              href="/legal/privacy"
              className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors"
            >
              プライバシーポリシー <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
