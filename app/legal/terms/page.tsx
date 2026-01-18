'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

/**
 * 利用規約
 * Terms of Service page
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-gray-900">NIIJIMA</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={18} />
            <span>トップへ戻る</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          利用規約
        </h1>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
          {/* 序文 */}
          <p className="text-gray-700 leading-relaxed">
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
            <ul className="list-disc list-inside space-y-1 text-gray-600">
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
                <ul className="list-disc list-inside ml-6 mt-2 text-gray-600">
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
                <ul className="list-disc list-inside ml-6 mt-2 text-gray-600">
                  <li>クレジットカード（Visa, Mastercard, American Express, JCB）</li>
                  <li>銀行振込（振込手数料はお客様負担）</li>
                </ul>
              </li>
              <li>オンライン決済はStripe社のセキュアな決済システムを使用しております。</li>
            </ol>
          </Section>

          <Section title="第5条（キャンセル・変更）">
            <p className="mb-3">お客様都合によるキャンセル・変更には、以下のキャンセル料が発生します：</p>
            <table className="w-full border-collapse border border-gray-300 text-sm mb-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">キャンセル時期</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">キャンセル料</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">サービス提供日の7日前まで</td>
                  <td className="border border-gray-300 px-4 py-2">無料</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">6日前〜3日前</td>
                  <td className="border border-gray-300 px-4 py-2">料金の30%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">2日前〜前日</td>
                  <td className="border border-gray-300 px-4 py-2">料金の50%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">当日・無連絡キャンセル</td>
                  <td className="border border-gray-300 px-4 py-2">料金の100%</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-500">
              ※ 天候・災害・医療機関の都合等やむを得ない事情による場合は、別途ご相談の上対応いたします。
            </p>
          </Section>

          <Section title="第6条（禁止事項）">
            <p className="mb-3">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
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

          <Section title="第7条（免責事項）">
            <ol className="list-decimal list-inside space-y-2">
              <li>当社は、本サービスに事実上または法律上の瑕疵がないことを保証するものではありません。</li>
              <li>当社は、本サービスに起因してユーザーに生じた損害について、当社の故意または重大な過失による場合を除き、一切の責任を負いません。</li>
              <li>医療サービスに関しては、当社は予約代行を行うものであり、医療行為自体は提携医療機関が行います。医療行為に関する責任は、当該医療機関が負うものとします。</li>
              <li>天候、交通事情、その他不可抗力によるサービス内容の変更・中止について、当社は責任を負いません。</li>
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
              <li>当社は、ユーザーへの事前の通知なく、本サービスの内容を変更または終了することができるものとします。</li>
              <li>当社は、本サービスの変更または終了によりユーザーに生じた損害について、一切の責任を負いません。</li>
            </ol>
          </Section>

          <Section title="第10条（利用規約の変更）">
            <ol className="list-decimal list-inside space-y-2">
              <li>当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。</li>
              <li>変更後の利用規約は、当社ウェブサイトに掲示した時点から効力を生じるものとします。</li>
            </ol>
          </Section>

          <Section title="第11条（準拠法・裁判管轄）">
            <ol className="list-decimal list-inside space-y-2">
              <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
              <li>本サービスに関して紛争が生じた場合には、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
            </ol>
          </Section>

          <Section title="第12条（お問い合わせ）">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-gray-900">新島交通株式会社</p>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>〒556-0014 大阪府大阪市浪速区大国1-2-21-602</p>
                <p>電話: 06-6632-8807</p>
                <p>FAX: 06-6632-8826</p>
                <p>Email: info@niijima-koutsu.jp</p>
              </div>
            </div>
          </Section>

          {/* 制定日 */}
          <div className="pt-6 border-t text-sm text-gray-500">
            <p>制定日：2024年1月1日</p>
            <p>最終改定日：2025年1月1日</p>
          </div>
        </div>

        {/* 関連リンク */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/legal/tokushoho"
            className="text-blue-600 hover:underline text-sm"
          >
            特定商取引法に基づく表記 →
          </Link>
          <Link
            href="/legal/privacy"
            className="text-blue-600 hover:underline text-sm"
          >
            プライバシーポリシー →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} 新島交通株式会社 All Rights Reserved.</p>
          <p className="mt-2">大阪府知事登録旅行業 第2-3115号 ｜ 一般社団法人 日本旅行業協会（JATA）正会員</p>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
