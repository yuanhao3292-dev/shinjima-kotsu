'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

/**
 * 利用規約
 * Terms of Service page
 */
export default function TermsPage() {
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
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">Terms of Service</span>
              <div className="h-[1px] w-12 bg-gold-400"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
              利用規約
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* 序文 */}
            <p className="text-neutral-700 leading-relaxed">
              この利用規約（以下「本規約」といいます）は、新島交通株式会社（以下「当社」といいます）が提供するサービス（以下「本サービス」といいます）の利用条件を定めるものです。
              ユーザーの皆様（以下「ユーザー」といいます）には、本規約に同意いただいた上で、本サービスをご利用いただきます。
            </p>

            <Section title="第1条（適用）">
              <ol className="list-decimal list-inside space-y-2">
                <li>本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</li>
                <li>当社が本サービス上で掲載する個別規定、利用案内、注意事項等は、本規約の一部を構成するものとします。</li>
                <li>本規約の内容と個別規定等の内容が異なる場合には、個別規定等の内容が優先されるものとします。</li>
              </ol>
            </Section>

            <Section title="第2条（サービスの内容）">
              <p className="mb-3">当社は、以下のサービスを提供します：</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>医療ツーリズムサービス（健康診断・人間ドック予約代行）</li>
                <li>ビジネス視察・研修ツアーの企画・手配</li>
                <li>ゴルフツアーの企画・手配</li>
                <li>車両手配サービス（送迎・観光）</li>
                <li>通訳・翻訳サービス</li>
                <li>その他付随するサービス</li>
              </ul>
            </Section>

            <Section title="第3条（利用資格）">
              <ol className="list-decimal list-inside space-y-2">
                <li>本サービスは、本規約に同意した上でご利用いただきます。</li>
                <li>未成年者が本サービスを利用する場合は、法定代理人の同意を得た上でご利用ください。</li>
                <li>当社は、以下に該当するユーザーの利用をお断りすることがあります：
                  <ul className="list-disc list-inside ml-6 mt-2 text-neutral-600">
                    <li>過去に本規約違反により利用停止となった方</li>
                    <li>反社会的勢力等に該当する方</li>
                    <li>その他、当社が不適切と判断した方</li>
                  </ul>
                </li>
              </ol>
            </Section>

            <Section title="第4条（予約・決済）">
              <ol className="list-decimal list-inside space-y-2">
                <li>本サービスの予約は、当社ウェブサイトまたは当社指定の方法により行うものとします。</li>
                <li>予約が成立した時点で、当社との間にサービス提供契約が成立するものとします。</li>
                <li>サービス料金は、各サービスページに表示された価格（税込）に基づきます。</li>
                <li>お支払いは、以下の方法でお受けしております：
                  <ul className="list-disc list-inside ml-6 mt-2 text-neutral-600">
                    <li>クレジットカード（Visa, Mastercard, American Express, JCB）</li>
                    <li>銀行振込（振込手数料はお客様負担）</li>
                  </ul>
                </li>
                <li>オンライン決済はStripe社のセキュアな決済システムを使用しております。</li>
              </ol>
            </Section>

            <Section title="第5条（キャンセル・変更）">
              <p className="mb-3">お客様都合によるキャンセル・変更には、以下のキャンセル料が発生します：</p>
              <table className="w-full border-collapse border border-neutral-200 text-sm mb-4">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="border border-neutral-200 px-4 py-2 text-left text-brand-900">キャンセル時期</th>
                    <th className="border border-neutral-200 px-4 py-2 text-left text-brand-900">キャンセル料</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-neutral-200 px-4 py-2">サービス提供日の7日前まで</td>
                    <td className="border border-neutral-200 px-4 py-2">無料</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 px-4 py-2">6日前〜3日前</td>
                    <td className="border border-neutral-200 px-4 py-2">料金の30%</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 px-4 py-2">2日前〜前日</td>
                    <td className="border border-neutral-200 px-4 py-2">料金の50%</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 px-4 py-2">当日・無連絡キャンセル</td>
                    <td className="border border-neutral-200 px-4 py-2">料金の100%</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-neutral-500">
                ※ 天候・災害・医療機関の都合等やむを得ない事情による場合は、別途ご相談の上対応いたします。
              </p>
            </Section>

            <Section title="第6条（禁止事項）">
              <p className="mb-3">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当社または第三者の知的財産権、プライバシー権、名誉権その他の権利を侵害する行為</li>
                <li>当社のサービス運営を妨害する行為</li>
                <li>虚偽の情報を登録する行為</li>
                <li>他のユーザーになりすます行為</li>
                <li>当社のサービスに関連して反社会的勢力に利益を供与する行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </Section>

            <Section title="第7条（免責事項・損害賠償の範囲）">
              <ol className="list-decimal list-inside space-y-2">
                <li>当社は、本サービスに事実上または法律上の瑕疵がないことを保証するものではありません。</li>
                <li>当社の過失（重大な過失を除く）による債務不履行または不法行為によりユーザーに生じた損害について、当社は、当該サービスの利用料金の額を上限として賠償するものとします。ただし、当社の故意または重大な過失による場合はこの限りではありません。</li>
                <li>医療サービスに関しては、当社は旅行業者として予約手配を行うものであり、医療行為自体は提携医療機関の医師が提供します。医療行為に関する責任は、当該医療機関が負うものとします。</li>
                <li>天候、交通事情、感染症、その他不可抗力によるサービス内容の変更・中止について、当社はその変更・中止自体について責任を負いません。ただし、代替サービスの提供または返金等の合理的な対応に努めます。</li>
              </ol>
            </Section>

            <Section title="第8条（知的財産権）">
              <ol className="list-decimal list-inside space-y-2">
                <li>本サービスに関する著作権、商標権その他の知的財産権は、当社または正当な権利者に帰属します。</li>
                <li>ユーザーは、当社の許可なく、本サービスのコンテンツを複製、転載、改変、販売等することはできません。</li>
              </ol>
            </Section>

            <Section title="第9条（サービスの変更・終了）">
              <ol className="list-decimal list-inside space-y-2">
                <li>当社は、やむを得ない事由がある場合、本サービスの内容を変更または終了することができるものとします。重要な変更の場合は、合理的な期間をもって事前にウェブサイト上で通知いたします。</li>
                <li>当社は、本サービスの変更または終了により生じた損害について、当社に故意または過失がある場合を除き、責任を負いません。予約済みのサービスについては、返金または代替サービスの提供等、合理的な対応を行います。</li>
              </ol>
            </Section>

            <Section title="第10条（利用規約の変更）">
              <ol className="list-decimal list-inside space-y-2">
                <li>当社は、民法第548条の4の規定に基づき、ユーザーの一般の利益に適合する場合、または変更の必要性・相当性等に照らして合理的である場合に限り、本規約を変更することができるものとします。</li>
                <li>当社は、本規約の変更にあたり、変更の効力発生日の2週間前までに、変更内容および効力発生日を当社ウェブサイト上に掲示して通知いたします。</li>
                <li>変更後の規約に同意されない場合、ユーザーはサービスの利用を終了することができます。</li>
              </ol>
            </Section>

            <Section title="第11条（準拠法・裁判管轄）">
              <ol className="list-decimal list-inside space-y-2">
                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                <li>本サービスに関して紛争が生じた場合には、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
              </ol>
            </Section>

            <Section title="第12条（お問い合わせ）">
              <div className="bg-neutral-50 p-6 rounded-2xl">
                <p className="font-bold text-brand-900">新島交通株式会社</p>
                <div className="mt-3 text-sm text-neutral-700 space-y-1">
                  <p>〒556-0014 大阪府大阪市浪速区大国1-2-21-602</p>
                  <p>電話: 06-6632-8807</p>
                  <p>FAX: 06-6632-8826</p>
                  <p>Email: info@niijima-koutsu.jp</p>
                </div>
              </div>
            </Section>

            {/* 制定日 */}
            <div className="pt-6 border-t border-neutral-200 text-sm text-neutral-500">
              <p>制定日：2024年1月1日</p>
              <p>最終改定日：2025年1月1日</p>
            </div>

            {/* 関連リンク */}
            <div className="flex flex-wrap gap-6">
              <Link
                href="/legal/tokushoho"
                className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors"
              >
                特定商取引法に基づく表記 <ArrowRight size={14} />
              </Link>
              <Link
                href="/legal/privacy"
                className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors"
              >
                プライバシーポリシー <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-brand-900 mb-3 pb-2 border-b border-neutral-200">
        {title}
      </h2>
      <div className="text-neutral-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
