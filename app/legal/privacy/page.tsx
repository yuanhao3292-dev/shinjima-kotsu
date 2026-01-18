import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

/**
 * プライバシーポリシー
 * 個人情報保護方針ページ
 */
export default function PrivacyPolicyPage() {
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
          プライバシーポリシー
        </h1>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
          {/* 序文 */}
          <p className="text-gray-700 leading-relaxed">
            新島交通株式会社（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と考え、
            以下のプライバシーポリシーに基づき、適切な取り扱いと保護に努めます。
          </p>

          <Section title="1. 個人情報の定義">
            <p>
              本プライバシーポリシーにおいて「個人情報」とは、生存する個人に関する情報であって、
              当該情報に含まれる氏名、生年月日、住所、電話番号、メールアドレスその他の記述等により
              特定の個人を識別することができるものをいいます。
            </p>
          </Section>

          <Section title="2. 収集する個人情報">
            <p className="mb-3">
              当社は、サービス提供にあたり、以下の個人情報を収集することがあります：
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>氏名（漢字・フリガナ）</li>
              <li>生年月日・性別</li>
              <li>住所・電話番号・メールアドレス</li>
              <li>パスポート情報（海外からのお客様の場合）</li>
              <li>健康状態に関する情報（医療サービスご利用の場合）</li>
              <li>クレジットカード情報（決済に必要な範囲）</li>
              <li>ご予約・ご利用履歴</li>
            </ul>
          </Section>

          <Section title="3. 個人情報の利用目的">
            <p className="mb-3">
              当社は、収集した個人情報を以下の目的で利用いたします：
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>各種サービス（車両手配、医療ツーリズム、ゴルフツアー等）のご提供</li>
              <li>ご予約の確認・変更・キャンセル等のご連絡</li>
              <li>お問い合わせへの対応</li>
              <li>サービス向上のための分析</li>
              <li>新サービスや特典のご案内（ご同意いただいた場合のみ）</li>
              <li>法令に基づく対応</li>
            </ul>
          </Section>

          <Section title="4. 第三者への提供">
            <p className="mb-3">
              当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません：
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>お客様の同意がある場合</li>
              <li>サービス提供に必要な業務委託先（宿泊施設、医療機関等）への提供</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              なお、業務委託先への提供に際しては、適切な管理監督を行います。
            </p>
          </Section>

          <Section title="5. 安全管理措置">
            <p>
              当社は、個人情報の漏洩、滅失、毀損の防止その他の安全管理のために、
              組織的・技術的に適切な措置を講じます。
              また、個人情報を取り扱う従業者に対し、必要かつ適切な監督を行います。
            </p>
          </Section>

          <Section title="6. Cookieの使用について">
            <p className="mb-3">
              当社のウェブサイトでは、サービス向上のためCookieを使用しています。
              Cookieにより収集する情報には、以下が含まれます：
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>アクセス日時・閲覧ページ</li>
              <li>リファラー（参照元）</li>
              <li>使用ブラウザ・OS情報</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              お客様はブラウザの設定によりCookieを無効にすることができますが、
              一部のサービスがご利用いただけなくなる場合があります。
            </p>
          </Section>

          <Section title="7. 開示・訂正・削除の請求">
            <p>
              お客様は、当社が保有する自己の個人情報について、開示、訂正、追加、削除、
              利用停止または消去を請求することができます。
              ご請求の際は、下記のお問い合わせ窓口までご連絡ください。
            </p>
          </Section>

          <Section title="8. プライバシーポリシーの改定">
            <p>
              当社は、必要に応じて本プライバシーポリシーを改定することがあります。
              改定した場合は、本ウェブサイト上でお知らせいたします。
            </p>
          </Section>

          <Section title="9. お問い合わせ窓口">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-gray-900">新島交通株式会社</p>
              <p className="text-sm text-gray-600">個人情報保護管理者</p>
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

        {/* 白标モードの注意書き */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="font-bold text-blue-900 mb-2">提携パートナー経由でご利用のお客様へ</h2>
          <p className="text-blue-800 text-sm leading-relaxed">
            当社は、導遊（ガイド）の方々と提携し、ホワイトラベルサービスを提供しています。
            提携パートナーのウェブサイトからご予約いただいた場合も、個人情報の管理主体は当社であり、
            本プライバシーポリシーが適用されます。
          </p>
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
            href="/legal/terms"
            className="text-blue-600 hover:underline text-sm"
          >
            利用規約 →
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
