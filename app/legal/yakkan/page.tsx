'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

/**
 * 旅行業約款
 * 旅行業法 第12条の2 に基づく旅行業約款
 * JATA 標準旅行業約款を準拠
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

export default function YakkanPage() {
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
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">Travel Terms</span>
              <div className="h-[1px] w-12 bg-gold-400"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
              旅行業約款
            </h1>
            <p className="mt-4 text-neutral-400 text-sm">
              旅行業法 第12条の2 に基づく旅行業約款
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl space-y-6">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8">
            <p className="text-neutral-700 text-sm leading-relaxed">
              新島交通株式会社（以下「当社」）は、大阪府知事登録旅行業 第2-3115号の登録を受けた第2種旅行業者として、
              一般社団法人日本旅行業協会（JATA）正会員の立場から、標準旅行業約款に準拠した旅行業約款を定めます。
            </p>
          </div>

          <Section title="第1章 総則">
            <p><strong>第1条（適用範囲）</strong></p>
            <p>
              当社が手配する旅行契約は、この約款の定めるところによります。
              この約款に定めのない事項については、法令または一般に確立された慣習によります。
              当社が法令に反せず、かつ旅行者の不利にならない範囲で書面により特約を結んだときは、
              その特約が優先します。
            </p>
          </Section>

          <Section title="第2章 契約の締結">
            <p><strong>第2条（契約の申込み）</strong></p>
            <p>
              当社と手配旅行契約を締結しようとする旅行者は、当社所定の申込書に所要事項を記入のうえ、
              当社が別に定める金額の申込金とともに、当社に提出しなければなりません。
              なお、当社ウェブサイトからのオンライン予約の場合は、所定のフォームへの入力および
              決済手続きの完了をもって申込みとします。
            </p>
            <p><strong>第3条（契約の成立時期）</strong></p>
            <p>
              手配旅行契約は、当社が契約の締結を承諾し、申込金を受理した時に成立するものとします。
              オンライン決済の場合は、決済が正常に完了した時点で契約が成立します。
            </p>
            <p><strong>第4条（契約締結の拒否）</strong></p>
            <p>当社は、次に掲げる場合において、手配旅行契約の締結に応じないことがあります：</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 ml-4">
              <li>旅行者が他の旅行者に迷惑を及ぼし、又は団体旅行の円滑な実施を妨げるおそれがあるとき</li>
              <li>当社の業務上の都合があるとき</li>
              <li>旅行者が暴力団員その他の反社会的勢力であると認められるとき</li>
              <li>旅行者からの通信契約による申込みの場合、クレジットカード会社の承認が得られないとき</li>
            </ul>
          </Section>

          <Section title="第3章 契約の変更">
            <p><strong>第5条（契約内容の変更）</strong></p>
            <p>
              旅行者は、当社に対し、旅行日程、旅行サービスの内容その他の手配旅行契約の内容の変更を
              求めることができます。この場合、当社は、可能な限り旅行者の求めに応じます。
            </p>
          </Section>

          <Section title="第4章 契約の解除">
            <p><strong>第6条（旅行者による任意解除）</strong></p>
            <p>
              旅行者は、いつでも手配旅行契約の全部又は一部を解除することができます。
              ただし、当該契約の解除により当社に損害が生じた場合、旅行者は以下の取消料を支払うものとします：
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 ml-4">
              <li>サービス提供日の14日前まで：無料</li>
              <li>サービス提供日の7日前～14日前：旅行代金の50%</li>
              <li>サービス提供日の7日前以降：旅行代金の100%</li>
            </ul>
            <p className="mt-2">
              なお、医療サービスについては、提携医療機関の個別のキャンセルポリシーが適用される場合があります。
            </p>
            <p className="mt-4"><strong>第7条（当社による解除）</strong></p>
            <p>当社は、次に掲げる場合において、手配旅行契約を解除することがあります：</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 ml-4">
              <li>旅行者が所定の期日までに旅行代金を支払わないとき</li>
              <li>天災地変、戦乱、暴動等により旅行の安全かつ円滑な実施が不可能となったとき</li>
              <li>旅行者が暴力団員その他の反社会的勢力であることが判明したとき</li>
            </ul>
          </Section>

          <Section title="第5章 団体・グループ手配">
            <p><strong>第8条（団体・グループ手配の特則）</strong></p>
            <p>
              当社は、同一の行程で旅行する複数の旅行者が、その代表者を定めて申し込んだ
              手配旅行契約の締結については、特約を結ぶことがあります。
            </p>
          </Section>

          <Section title="第6章 当社の責任">
            <p><strong>第9条（当社の責任）</strong></p>
            <p>
              当社は、手配旅行契約の履行に当たって、当社又は当社の手配代行者が故意又は過失により
              旅行者に損害を与えたときは、その損害を賠償する責に任じます。ただし、損害発生の翌日から
              起算して2年以内に当社に対して通知があったときに限ります。
            </p>
            <p className="mt-2">
              当社は、手配した旅行サービス提供機関（医療機関、宿泊施設、運送機関等）の提供する
              サービスそのものの不具合については責任を負いません。医療サービスの結果については、
              提携医療機関が直接責任を負います。
            </p>
            <p className="mt-4"><strong>第10条（特別補償）</strong></p>
            <p>
              当社は、第9条の規定に基づく当社の責任が生じるか否かを問わず、
              手配旅行契約の履行に際し、別途定める特別補償規程に基づき、
              旅行者が手配旅行参加中にその生命、身体又は手荷物の上に被った一定の損害について、
              補償金及び見舞金を支払います。
            </p>
          </Section>

          <Section title="第7章 旅行者の責任">
            <p><strong>第11条（旅行者の責任）</strong></p>
            <p>
              旅行者の故意又は過失により当社が損害を被ったときは、
              当該旅行者は損害を賠償しなければなりません。
            </p>
            <p className="mt-2">
              旅行者は、当社から提供される情報を活用し、旅行者の権利義務等について理解するよう
              努めなければなりません。旅行者は、自らの健康状態等に関する正確な情報を当社に
              提供しなければなりません。
            </p>
          </Section>

          <Section title="第8章 医療ツーリズムに関する特則">
            <p><strong>第12条（医療サービスの取扱い）</strong></p>
            <p>
              当社が手配する医療ツーリズムサービスにおいて、医療行為は提携医療機関が直接提供します。
              当社は、医療機関との予約手配、通訳翻訳、渡航手配等の旅行サービスを提供する立場であり、
              医療行為そのものの提供者ではありません。
            </p>
            <p className="mt-2">
              治療効果には個人差があり、結果を保証するものではありません。
              旅行者は、医療機関との間で別途インフォームドコンセント（説明と同意）の手続きを行います。
            </p>
          </Section>

          <Section title="附則">
            <p>この約款は、2025年1月1日より適用します。</p>
          </Section>

          {/* 関連リンク */}
          <div className="flex flex-wrap gap-6 pt-8 border-t border-neutral-200">
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
