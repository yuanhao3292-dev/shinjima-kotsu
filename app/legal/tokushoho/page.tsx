'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

/**
 * 特定商取引法に基づく表記
 * 日本法律要求的商业公示页面
 */
export default function TokushohoPage() {
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
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">Legal Notice</span>
              <div className="h-[1px] w-12 bg-gold-400"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
              特定商取引法に基づく表記
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* 表格 */}
            <div className="bg-neutral-50 rounded-2xl overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-neutral-200">
                  <TableRow label="販売業者" value="新島交通株式会社" />
                  <TableRow
                    label="運営統括責任者"
                    value="代表取締役 員昊（Yun Hao）"
                  />
                  <TableRow
                    label="所在地"
                    value={
                      <>
                        〒556-0014<br />
                        大阪府大阪市浪速区大国1-2-21-602
                      </>
                    }
                  />
                  <TableRow
                    label="電話番号"
                    value={
                      <>
                        06-6632-8807<br />
                        <span className="text-sm text-neutral-500">
                          （受付時間：平日10:00～18:00）
                        </span>
                      </>
                    }
                  />
                  <TableRow label="FAX番号" value="06-6632-8826" />
                  <TableRow label="メールアドレス" value="info@niijima-koutsu.jp" />
                  <TableRow
                    label="販売URL"
                    value={
                      <>
                        <a
                          href="https://niijima-koutsu.jp"
                          className="text-brand-700 hover:text-brand-900 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://niijima-koutsu.jp
                        </a>
                        <br />
                        <a
                          href="https://bespoketrip.jp"
                          className="text-brand-700 hover:text-brand-900 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://bespoketrip.jp
                        </a>
                      </>
                    }
                  />
                  <TableRow
                    label="販売価格"
                    value="各サービスページに表示された価格（税込）"
                  />
                  <TableRow
                    label="商品代金以外の必要料金"
                    value={
                      <>
                        ・消費税（価格に含まれています）<br />
                        ・銀行振込の場合は振込手数料<br />
                        ・オプションサービスをご利用の場合は別途料金
                      </>
                    }
                  />
                  <TableRow
                    label="お支払方法"
                    value={
                      <>
                        ・クレジットカード（Visa, Mastercard, American Express, JCB）<br />
                        ・銀行振込
                      </>
                    }
                  />
                  <TableRow
                    label="お支払時期"
                    value="サービスご予約時に決済"
                  />
                  <TableRow
                    label="サービス提供時期"
                    value="ご予約日時に準じます"
                  />
                  <TableRow
                    label="返品・キャンセルについて"
                    value={
                      <>
                        <p className="mb-2">サービスの性質上、お客様都合によるキャンセルには以下のキャンセル料が発生します：</p>
                        <ul className="list-disc list-inside text-sm space-y-1 text-neutral-600">
                          <li>7日前まで：無料</li>
                          <li>3〜6日前：料金の30%</li>
                          <li>前日〜2日前：料金の50%</li>
                          <li>当日：料金の100%</li>
                        </ul>
                        <p className="mt-2 text-sm text-neutral-500">
                          ※ 天候・災害等やむを得ない事情による場合は別途ご相談ください
                        </p>
                      </>
                    }
                  />
                  <TableRow
                    label="動作環境"
                    value={
                      <>
                        <p>当サイトは以下のブラウザでの閲覧を推奨しています：</p>
                        <ul className="list-disc list-inside text-sm mt-1 text-neutral-600">
                          <li>Google Chrome（最新版）</li>
                          <li>Safari（最新版）</li>
                          <li>Firefox（最新版）</li>
                          <li>Microsoft Edge（最新版）</li>
                        </ul>
                      </>
                    }
                  />
                </tbody>
              </table>
            </div>

            {/* クーリング・オフについて */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
              <h2 className="font-bold text-brand-900 mb-2">申込みの撤回等について</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                本サービスは特定商取引法第26条第1項に定める「旅行業法に基づく旅行業者の行う取引」に該当するため、
                クーリング・オフ制度の適用対象外です。
                キャンセル・返金については上記のキャンセルポリシーをご確認ください。
              </p>
            </div>

            {/* 白标モードの注意書き */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
              <h2 className="font-bold text-brand-900 mb-2">提携パートナー経由でご利用のお客様へ</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                本サービスは新島交通株式会社が提供・運営しております。
                提携パートナー（ガイド・旅行代理店等）は、お客様への情報提供・ご紹介を行う立場であり、
                サービスの直接提供者ではありません。サービス提供・決済・返金・アフターサポートの
                責任主体は新島交通株式会社です。
              </p>
              <p className="text-neutral-700 text-sm leading-relaxed mt-2">
                医療サービスは各提携医療機関が直接提供し、新島交通株式会社は予約手配を行います。
              </p>
            </div>

            {/* 関連リンク */}
            <div className="flex flex-wrap gap-6">
              <Link
                href="/legal/privacy"
                className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors"
              >
                プライバシーポリシー <ArrowRight size={14} />
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

function TableRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr className="flex flex-col md:table-row hover:bg-white transition">
      <th className="py-5 px-6 text-left font-bold text-brand-900 bg-neutral-100 md:bg-transparent md:w-44 align-top">
        {label}
      </th>
      <td className="py-5 px-6 text-neutral-600">
        {value}
      </td>
    </tr>
  );
}
