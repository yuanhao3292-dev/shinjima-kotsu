'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

/**
 * プライバシーポリシー
 * 個人情報保護方針ページ
 */
export default function PrivacyPolicyPage() {
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
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">Privacy Policy</span>
              <div className="h-[1px] w-12 bg-gold-400"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
              プライバシーポリシー
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
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>氏名（漢字・フリガナ）</li>
                <li>生年月日・性別</li>
                <li>住所・電話番号・メールアドレス</li>
                <li>パスポート情報（海外からのお客様の場合）</li>
                <li>健康状態に関する情報（既往歴、アレルギー歴、現在の服薬情報等 ※医療サービスご利用の場合。要配慮個人情報として、お客様の明示的な同意のもとに収集いたします）</li>
                <li>クレジットカード情報（決済に必要な範囲）</li>
                <li>ご予約・ご利用履歴</li>
              </ul>
            </Section>

            <Section title="3. 個人情報の利用目的">
              <p className="mb-3">
                当社は、収集した個人情報を以下の目的で利用いたします：
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>各種サービス（車両手配、医療ツーリズム、ゴルフツアー等）のご提供</li>
                <li>ご予約の確認・変更・キャンセル等のご連絡</li>
                <li>お問い合わせへの対応</li>
                <li>サービス向上のための分析</li>
                <li>新サービスや特典のご案内（ご同意いただいた場合のみ）</li>
                <li>医療機関への診療情報の共有（お客様の明示的な同意に基づく）</li>
                <li>法令に基づく対応</li>
              </ul>
            </Section>

            <Section title="4. 第三者への提供">
              <p className="mb-3">
                当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません：
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>お客様の同意がある場合</li>
                <li>サービス提供に必要な業務委託先（宿泊施設、医療機関等）への提供</li>
                <li>提携ガイド（導遊）への紹介元情報の提供（ご予約の円滑な提供のため）</li>
                <li>決済サービス提供者（Stripe Inc.）への決済に必要な情報の提供</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要な場合</li>
              </ul>
              <p className="mt-3 text-sm text-neutral-500">
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
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>アクセス日時・閲覧ページ</li>
                <li>リファラー（参照元）</li>
                <li>使用ブラウザ・OS情報</li>
                <li>紹介元パートナーの識別情報（wl_guideクッキー、有効期間30日、ご予約の紹介元特定のため）</li>
              </ul>
              <p className="mt-3 text-sm text-neutral-500">
                お客様はブラウザの設定によりCookieを無効にすることができますが、
                一部のサービスがご利用いただけなくなる場合があります。
              </p>
            </Section>

            <Section title="7. 海外への個人情報の移転について">
              <p className="mb-3">
                当社のサービス提供にあたり、お客様の個人情報を以下の海外事業者に移転する場合があります。
                これらの事業者は適切な安全管理措置を講じております。
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Stripe, Inc.（米国）— 決済処理</li>
                <li>Supabase, Inc.（米国 AWS）— データベース管理</li>
                <li>Resend, Inc.（米国）— メール配信</li>
                <li>Vercel, Inc.（米国）— ウェブホスティング</li>
                <li>Functional Software, Inc.（米国、Sentry）— エラーモニタリング</li>
              </ul>
              <p className="mt-3 text-sm text-neutral-500">
                これらの移転は、個人情報保護法第28条に基づき、お客様のサービス利用に必要な範囲で行われます。
              </p>
            </Section>

            <Section title="8. 開示・訂正・削除の請求">
              <p>
                お客様は、当社が保有する自己の個人情報について、開示、訂正、追加、削除、
                利用停止または消去を請求することができます。
                ご請求の際は、下記のお問い合わせ窓口までご連絡ください。
              </p>
            </Section>

            <Section title="9. プライバシーポリシーの改定">
              <p>
                当社は、必要に応じて本プライバシーポリシーを改定することがあります。
                改定した場合は、本ウェブサイト上でお知らせいたします。
              </p>
            </Section>

            <Section title="10. お問い合わせ窓口">
              <div className="bg-neutral-50 p-6 rounded-2xl">
                <p className="font-bold text-brand-900">新島交通株式会社</p>
                <p className="text-sm text-neutral-600">個人情報保護管理者: 代表取締役 員昊</p>
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

            {/* 白标モードの注意書き */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
              <h2 className="font-bold text-brand-900 mb-2">提携パートナー経由でご利用のお客様へ</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                当社は、導遊（ガイド）の方々と提携し、ホワイトラベルサービスを提供しています。
                提携パートナーのウェブサイトからご予約いただいた場合も、個人情報の管理主体は当社であり、
                本プライバシーポリシーが適用されます。
              </p>
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
                href="/legal/terms"
                className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors"
              >
                利用規約 <ArrowRight size={14} />
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
