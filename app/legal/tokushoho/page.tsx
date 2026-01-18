'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

/**
 * 特定商取引法に基づく表記
 * 日本法律要求的商业公示页面
 */
export default function TokushohoPage() {
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
          特定商取引法に基づく表記
        </h1>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y">
              <TableRow
                label="販売業者"
                value="新島交通株式会社"
              />
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
                    <span className="text-sm text-gray-500">
                      （受付時間：平日10:00～18:00）
                    </span>
                  </>
                }
              />
              <TableRow
                label="FAX番号"
                value="06-6632-8826"
              />
              <TableRow
                label="メールアドレス"
                value="info@niijima-koutsu.jp"
              />
              <TableRow
                label="販売URL"
                value={
                  <a
                    href="https://niijima-koutsu.jp"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://niijima-koutsu.jp
                  </a>
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
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                      <li>7日前まで：無料</li>
                      <li>3〜6日前：料金の30%</li>
                      <li>前日〜2日前：料金の50%</li>
                      <li>当日：料金の100%</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-500">
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
                    <ul className="list-disc list-inside text-sm mt-1 text-gray-600">
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

        {/* 白标モードの注意書き */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="font-bold text-blue-900 mb-2">提携パートナー経由でご利用のお客様へ</h2>
          <p className="text-blue-800 text-sm leading-relaxed">
            本サービスは新島交通株式会社が提供・運営しております。
            提携パートナー（導遊・旅行代理店等）を通じてご予約いただいた場合も、
            サービス提供・決済・お問い合わせ対応はすべて新島交通株式会社が行います。
          </p>
        </div>

        {/* 関連リンク */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/legal/privacy"
            className="text-blue-600 hover:underline text-sm"
          >
            プライバシーポリシー →
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

function TableRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr className="hover:bg-gray-50">
      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 w-1/3 align-top">
        {label}
      </th>
      <td className="px-6 py-4 text-sm text-gray-700">
        {value}
      </td>
    </tr>
  );
}
