'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';

/**
 * 導遊合夥人服務協議
 * Guide Partner Service Agreement
 */
export default function GuidePartnerTermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/guide-partner" className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-orange-600" />
            <span className="font-bold text-gray-900">NIIJIMA</span>
          </Link>
          <Link
            href="/guide-partner"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={18} />
            <span>返回</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          導遊提攜夥伴服務協議
        </h1>
        <p className="text-gray-500 mb-8">Guide Partner Service Agreement</p>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
          {/* 序文 */}
          <p className="text-gray-700 leading-relaxed">
            本協議（以下簡稱「本協議」）由新島交通株式會社（大阪府知事登錄旅行業 第2-3115號，以下簡稱「甲方」或「公司」）與申請成為提攜夥伴的個人或法人（以下簡稱「乙方」或「提攜夥伴」）共同簽訂。
            乙方在註冊成為提攜夥伴時，即視為已閱讀、理解並同意本協議的全部條款。
          </p>

          <Section title="第一條 定義">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>提攜夥伴計劃</strong>：甲方提供的客戶介紹計劃，乙方作為甲方的提攜夥伴，向潛在客戶介紹甲方提供的旅行服務，並因成功介紹而獲得介紹報酬</li>
              <li><strong>品牌展示網站</strong>：甲方提供的系統授權服務，乙方可使用專屬品牌形象展示甲方的服務內容</li>
              <li><strong>介紹報酬（紹介手数料）</strong>：乙方成功介紹客戶、且客戶完成付款後，甲方支付給乙方的介紹費用</li>
              <li><strong>結算週期</strong>：每月為一個結算週期，次月1-5日統計上月介紹報酬</li>
            </ul>
          </Section>

          <Section title="第二條 合作內容">
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>乙方可通過專屬推薦連結或推薦碼向潛在客戶介紹甲方提供的服務</li>
              <li>甲方提供的服務包括但不限於：醫療體檢、高爾夫旅遊、商務考察等旅行相關服務</li>
              <li>乙方有權使用甲方提供的品牌展示網站進行客戶介紹</li>
              <li>乙方介紹的客戶在30天內完成首次付款，該訂單將計入乙方的介紹業績</li>
              <li><strong>重要：所有旅行服務均由甲方（新島交通株式會社）直接提供，乙方不參與服務的提供與履行</strong></li>
            </ol>
          </Section>

          <Section title="第三條 介紹報酬計算與支付">
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-2">介紹報酬計算公式</h4>
                <p className="text-orange-700">
                  介紹報酬 = (訂單金額 ÷ 1.1) × 報酬率
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  其中 ÷1.1 為扣除日本10%消費稅
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">介紹報酬等級</h4>
                <p className="text-sm text-gray-500 mb-3">※ 每季度重新計算等級（1-3月、4-6月、7-9月、10-12月）</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">等級</th>
                      <th className="text-left py-2">季度累計業績</th>
                      <th className="text-left py-2">報酬率</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="py-2">銅牌夥伴</td>
                      <td className="py-2">0 - 100萬日元</td>
                      <td className="py-2 font-medium text-orange-600">10%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">銀牌夥伴</td>
                      <td className="py-2">100萬 - 300萬日元</td>
                      <td className="py-2 font-medium text-gray-500">12%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">金牌夥伴</td>
                      <td className="py-2">300萬 - 500萬日元</td>
                      <td className="py-2 font-medium text-yellow-600">15%</td>
                    </tr>
                    <tr>
                      <td className="py-2">鑽石夥伴</td>
                      <td className="py-2">500萬日元以上</td>
                      <td className="py-2 font-medium text-blue-600">20%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">新客首單獎勵</h4>
                <p className="text-purple-700">
                  每位新客戶的首筆訂單，乙方將額外獲得 <strong>+5%</strong> 的介紹報酬獎勵
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>介紹報酬僅在客戶完成付款且服務正常履行後產生</li>
                <li>如客戶申請退款，相應報酬將被扣除</li>
                <li>報酬支付方式：微信轉帳、支付寶、銀行匯款（手續費由乙方承擔）</li>
                <li>每月15日前完成上月介紹報酬的支付</li>
                <li>最低提現金額為 1,000 日元</li>
              </ol>
            </div>
          </Section>

          <Section title="第四條 乙方的權利與義務">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">乙方的權利：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>獲得專屬推薦連結和推薦碼</li>
                  <li>使用甲方提供的品牌展示網站服務（需訂閱）</li>
                  <li>查看實時的訂單和介紹報酬數據</li>
                  <li>獲得甲方提供的培訓和支援</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">乙方的義務：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>提供真實、準確的個人/企業信息</li>
                  <li>遵守當地法律法規進行客戶介紹活動</li>
                  <li>不得進行虛假宣傳或誤導客戶</li>
                  <li>不得惡意刷單或進行欺詐行為</li>
                  <li>妥善保管帳號密碼，不得轉讓或出借</li>
                  <li><strong>不得以自己的名義與客戶簽訂任何旅行服務合同</strong></li>
                  <li><strong>向客戶明確說明服務提供者為新島交通株式會社</strong></li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="第五條 甲方的權利與義務">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">甲方的權利：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>審核乙方的提攜夥伴資格</li>
                  <li>調整介紹報酬政策（提前30天通知）</li>
                  <li>對違規行為進行處理，包括終止合作</li>
                  <li>解釋本協議的最終解釋權</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">甲方的義務：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>按時支付乙方應得的介紹報酬</li>
                  <li>提供穩定的技術平台支援</li>
                  <li>保護乙方的個人信息安全</li>
                  <li>提供必要的培訓和客服支援</li>
                  <li><strong>作為旅行服務提供者，對客戶履行旅行服務合同義務</strong></li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="第六條 禁止行為">
            <p className="mb-3 text-gray-700">乙方不得從事以下行為，違者將被立即終止合作並追究法律責任：</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>偽造客戶信息或訂單</li>
              <li>使用虛假或誤導性的廣告內容</li>
              <li>冒用甲方名義進行未授權的商業活動</li>
              <li>惡意攻擊甲方系統或竊取數據</li>
              <li>將佣金用於洗錢等非法用途</li>
              <li>向競爭對手洩露甲方商業機密</li>
            </ul>
          </Section>

          <Section title="第七條 協議終止">
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>乙方可隨時申請終止合作，已產生的佣金將正常結算</li>
              <li>甲方有權在乙方違反本協議時立即終止合作</li>
              <li>協議終止後，乙方應停止使用甲方的所有推廣資源</li>
              <li>終止後30天內完成最後一筆佣金結算</li>
            </ol>
          </Section>

          <Section title="第八條 免責聲明">
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>甲方不對乙方的客戶介紹行為承擔連帶責任</li>
              <li>因不可抗力導致的服務中斷，甲方不承擔責任</li>
              <li>乙方應自行處理介紹報酬產生的稅務問題（雜所得等）</li>
            </ol>
          </Section>

          <Section title="第九條 法律關係明確（重要）">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-bold mb-2">⚠️ 本條款為本協議核心條款，乙方務必仔細閱讀</p>
            </div>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li><strong>服務提供者</strong>：本協議所涉及的所有旅行相關服務（包括但不限於醫療體檢、高爾夫預約、夜總會預約、商務考察等）均由甲方（新島交通株式會社，大阪府知事登錄旅行業 第2-3115號）提供。</li>
              <li><strong>乙方的角色</strong>：乙方在本協議下的角色為「客戶介紹者」，負責向潛在客戶介紹甲方的服務。乙方<strong>不是獨立的旅行服務提供者</strong>，不具備旅行業經營資格，也不需要具備旅行業經營資格。</li>
              <li><strong>合同關係</strong>：所有旅行服務合同均在甲方與客戶之間簽訂。乙方與客戶之間<strong>不存在直接的服務合同關係</strong>。</li>
              <li><strong>禁止獨立經營</strong>：乙方<strong>不得以自己的名義</strong>與客戶簽訂任何旅行服務合同，不得收取客戶支付的旅行服務費用，不得向客戶出具旅行服務發票或收據。</li>
              <li><strong>介紹報酬性質</strong>：乙方因成功介紹客戶而獲得的報酬，其性質為「紹介手数料」（介紹費），不構成旅行業務收入，不適用旅行業法的相關規定。</li>
              <li><strong>品牌展示網站</strong>：乙方使用的品牌展示網站為甲方系統的授權使用，網站上的所有服務由甲方提供。網站底部將明確標示「本サービスは新島交通株式会社が提供しています」及甲方的旅行業登錄號。</li>
              <li><strong>客戶告知義務</strong>：乙方在向客戶介紹服務時，應明確告知客戶：服務提供者為新島交通株式會社，合同將與新島交通株式會社簽訂。</li>
            </ol>
          </Section>

          <Section title="第十條 爭議解決">
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>本協議的解釋適用日本法律</li>
              <li>雙方應首先通過友好協商解決爭議</li>
              <li>協商不成的，提交大阪地方裁判所管轄</li>
            </ol>
          </Section>

          <Section title="第十一條 聯繫方式">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-gray-900">新島交通株式會社</p>
              <p className="text-sm text-gray-600">提攜夥伴計劃運營部</p>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>〒556-0014 大阪府大阪市浪速區大國1-2-21-602</p>
                <p>電話: 06-6632-8807</p>
                <p>Email: partner@niijima-koutsu.jp</p>
              </div>
            </div>
          </Section>

          {/* 制定日 */}
          <div className="pt-6 border-t text-sm text-gray-500">
            <p>制定日：2025年1月1日</p>
            <p>最終改定日：2025年1月18日</p>
          </div>
        </div>

        {/* 同意確認區域 */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-800">註冊即表示同意</h3>
              <p className="text-green-700 text-sm mt-1">
                當您完成提攜夥伴註冊時，即表示您已閱讀、理解並同意本協議的全部條款，特別是第九條「法律關係明確」的內容。
                如有任何疑問，請在註冊前聯繫我們的客服團隊。
              </p>
            </div>
          </div>
        </div>

        {/* 相關連結 */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/legal/privacy"
            className="text-orange-600 hover:underline text-sm"
          >
            隱私政策 →
          </Link>
          <Link
            href="/legal/terms"
            className="text-orange-600 hover:underline text-sm"
          >
            一般利用規約 →
          </Link>
          <Link
            href="/guide-partner/register"
            className="text-orange-600 hover:underline text-sm"
          >
            立即申請 →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} 新島交通株式會社 All Rights Reserved.</p>
          <p className="mt-2">大阪府知事登錄旅行業 第2-3115號 ｜ 一般社團法人 日本旅行業協會（JATA）正會員</p>
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
