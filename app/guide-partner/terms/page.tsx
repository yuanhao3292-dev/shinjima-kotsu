'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const translations = {
  back: {
    ja: '戻る',
    'zh-CN': '返回',
    'zh-TW': '返回',
    en: 'Back',
  },
  mainTitle: {
    ja: 'ガイド提携パートナー サービス契約',
    'zh-CN': '导游提携伙伴服务协议',
    'zh-TW': '導遊提攜夥伴服務協議',
    en: 'Guide Partner Service Agreement',
  },
  mainSubtitle: {
    ja: 'Guide Partner Service Agreement',
    'zh-CN': 'Guide Partner Service Agreement',
    'zh-TW': 'Guide Partner Service Agreement',
    en: 'Guide Partner Service Agreement',
  },
  preamble: {
    ja: '本契約（以下「本契約」）は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号、以下「甲」または「当社」）と、提携パートナーとして登録申請する個人または法人（以下「乙」または「提携パートナー」）との間で締結されます。乙は提携パートナーとして登録する時点で、本契約の全条項を読み、理解し、同意したものとみなされます。',
    'zh-CN': '本协议（以下简称"本协议"）由新岛交通株式会社（大阪府知事登录旅行业 第2-3115号，以下简称"甲方"或"公司"）与申请成为提携伙伴的个人或法人（以下简称"乙方"或"提携伙伴"）共同签订。乙方在注册成为提携伙伴时，即视为已阅读、理解并同意本协议的全部条款。',
    'zh-TW': '本協議（以下簡稱「本協議」）由新島交通株式會社（大阪府知事登錄旅行業 第2-3115號，以下簡稱「甲方」或「公司」）與申請成為提攜夥伴的個人或法人（以下簡稱「乙方」或「提攜夥伴」）共同簽訂。乙方在註冊成為提攜夥伴時，即視為已閱讀、理解並同意本協議的全部條款。',
    en: 'This Agreement (hereinafter "the Agreement") is entered into between Niijima Kotsu Co., Ltd. (Osaka Governor Registered Travel Agency No. 2-3115, hereinafter "Party A" or "the Company") and the individual or entity applying to become an affiliated partner (hereinafter "Party B" or "Affiliated Partner"). By registering as an affiliated partner, Party B is deemed to have read, understood, and agreed to all terms of this Agreement.',
  },
  article1Title: {
    ja: '第1条 定義',
    'zh-CN': '第一条 定义',
    'zh-TW': '第一條 定義',
    en: 'Article 1: Definitions',
  },
  art1Item1: {
    ja: '提携パートナープログラム：甲が提供する顧客紹介プログラム。乙は甲の提携パートナーとして、潜在顧客に甲の旅行サービスを紹介し、紹介成功により紹介報酬を受け取ります',
    'zh-CN': '提携伙伴计划：甲方提供的客户介绍计划，乙方作为甲方的提携伙伴，向潜在客户介绍甲方提供的旅行服务，并因成功介绍而获得介绍报酬',
    'zh-TW': '提攜夥伴計劃：甲方提供的客戶介紹計劃，乙方作為甲方的提攜夥伴，向潛在客戶介紹甲方提供的旅行服務，並因成功介紹而獲得介紹報酬',
    en: 'Affiliated Partner Program: A client referral program provided by Party A, in which Party B, as an affiliated partner, refers potential clients to travel services provided by Party A and receives referral rewards for successful referrals',
  },
  art1Item2: {
    ja: 'ブランド展示サイト：甲が提供するシステム授権サービス。乙は専用ブランドイメージで甲のサービス内容を展示できます',
    'zh-CN': '品牌展示网站：甲方提供的系统授权服务，乙方可使用专属品牌形象展示甲方的服务内容',
    'zh-TW': '品牌展示網站：甲方提供的系統授權服務，乙方可使用專屬品牌形象展示甲方的服務內容',
    en: 'Branded Display Website: An authorized system service provided by Party A, allowing Party B to display Party A\'s services under a dedicated brand identity',
  },
  art1Item3: {
    ja: '紹介報酬（紹介手数料）：乙が顧客の紹介に成功し、顧客が支払いを完了した後に、甲が乙に支払う紹介費用',
    'zh-CN': '介绍报酬（紹介手数料）：乙方成功介绍客户、且客户完成付款后，甲方支付给乙方的介绍费用',
    'zh-TW': '介紹報酬（紹介手数料）：乙方成功介紹客戶、且客戶完成付款後，甲方支付給乙方的介紹費用',
    en: 'Referral Reward (Referral Commission): The referral fee paid by Party A to Party B after a successful client referral and payment completion',
  },
  art1Item4: {
    ja: '精算周期：毎月を1精算周期とし、翌月1-5日に前月の紹介報酬を集計',
    'zh-CN': '结算周期：每月为一个结算周期，次月1-5日统计上月介绍报酬',
    'zh-TW': '結算週期：每月為一個結算週期，次月1-5日統計上月介紹報酬',
    en: 'Settlement Cycle: Each month constitutes one settlement cycle, with the previous month\'s referral rewards calculated on the 1st-5th of the following month',
  },
  article2Title: {
    ja: '第2条 協力内容',
    'zh-CN': '第二条 合作内容',
    'zh-TW': '第二條 合作內容',
    en: 'Article 2: Cooperation Scope',
  },
  art2Item1: {
    ja: '乙は専用紹介リンクまたは紹介コードを通じて、潜在顧客に甲のサービスを紹介できます',
    'zh-CN': '乙方可通过专属推荐连结或推荐码向潜在客户介绍甲方提供的服务',
    'zh-TW': '乙方可通過專屬推薦連結或推薦碼向潛在客戶介紹甲方提供的服務',
    en: 'Party B may refer potential clients to Party A\'s services through dedicated referral links or codes',
  },
  art2Item2: {
    ja: '甲が提供するサービスには、医療健診、ゴルフツーリズム、ビジネス視察等の旅行関連サービスが含まれますが、これらに限定されません',
    'zh-CN': '甲方提供的服务包括但不限于：医疗体检、高尔夫旅游、商务考察等旅行相关服务',
    'zh-TW': '甲方提供的服務包括但不限於：醫療體檢、高爾夫旅遊、商務考察等旅行相關服務',
    en: 'Services provided by Party A include but are not limited to: medical checkups, golf tourism, business visits, and other travel-related services',
  },
  art2Item3: {
    ja: '乙は甲が提供するブランド展示サイトサービスを使用して顧客紹介を行う権利を有します',
    'zh-CN': '乙方有权使用甲方提供的品牌展示网站进行客户介绍',
    'zh-TW': '乙方有權使用甲方提供的品牌展示網站進行客戶介紹',
    en: 'Party B has the right to use the branded display website provided by Party A for client referrals',
  },
  art2Item4: {
    ja: '乙が紹介した顧客が30日以内に初回支払いを完了した場合、その注文は乙の紹介実績として計上されます',
    'zh-CN': '乙方介绍的客户在30天内完成首次付款，该订单将计入乙方的介绍业绩',
    'zh-TW': '乙方介紹的客戶在30天內完成首次付款，該訂單將計入乙方的介紹業績',
    en: 'If a client referred by Party B completes their first payment within 30 days, the order will be counted toward Party B\'s referral performance',
  },
  art2Item5: {
    ja: '重要：すべての旅行サービスは甲（新島交通株式会社）が直接提供し、乙はサービスの提供・履行に参加しません',
    'zh-CN': '重要：所有旅行服务均由甲方（新岛交通株式会社）直接提供，乙方不参与服务的提供与履行',
    'zh-TW': '重要：所有旅行服務均由甲方（新島交通株式會社）直接提供，乙方不參與服務的提供與履行',
    en: 'Important: All travel services are provided directly by Party A (Niijima Kotsu Co., Ltd.). Party B does not participate in the provision or fulfillment of services',
  },
  article3Title: {
    ja: '第3条 紹介報酬の計算と支払い',
    'zh-CN': '第三条 介绍报酬计算与支付',
    'zh-TW': '第三條 介紹報酬計算與支付',
    en: 'Article 3: Referral Reward Calculation and Payment',
  },
  commissionFormula: {
    ja: '紹介報酬計算式',
    'zh-CN': '介绍报酬计算公式',
    'zh-TW': '介紹報酬計算公式',
    en: 'Referral Reward Formula',
  },
  formulaText: {
    ja: '紹介報酬 = (注文金額 ÷ 1.1) × 報酬率',
    'zh-CN': '介绍报酬 = (订单金额 ÷ 1.1) × 报酬率',
    'zh-TW': '介紹報酬 = (訂單金額 ÷ 1.1) × 報酬率',
    en: 'Referral Reward = (Order Amount ÷ 1.1) × Reward Rate',
  },
  formulaNote: {
    ja: '÷1.1 は日本の10%消費税を控除',
    'zh-CN': '其中 ÷1.1 为扣除日本10%消费税',
    'zh-TW': '其中 ÷1.1 為扣除日本10%消費稅',
    en: 'The ÷1.1 deducts Japan\'s 10% consumption tax',
  },
  commissionTiers: {
    ja: '紹介報酬等級',
    'zh-CN': '介绍报酬等级',
    'zh-TW': '介紹報酬等級',
    en: 'Referral Reward Tiers',
  },
  tiersNote: {
    ja: '※ 四半期ごとに等級を再計算（1-3月、4-6月、7-9月、10-12月）',
    'zh-CN': '※ 每季度重新计算等级（1-3月、4-6月、7-9月、10-12月）',
    'zh-TW': '※ 每季度重新計算等級（1-3月、4-6月、7-9月、10-12月）',
    en: '* Tiers are recalculated quarterly (Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec)',
  },
  tierHeader: {
    ja: '等級',
    'zh-CN': '等级',
    'zh-TW': '等級',
    en: 'Tier',
  },
  quarterlyPerformance: {
    ja: '四半期累計実績',
    'zh-CN': '季度累计业绩',
    'zh-TW': '季度累計業績',
    en: 'Quarterly Performance',
  },
  rewardRate: {
    ja: '報酬率',
    'zh-CN': '报酬率',
    'zh-TW': '報酬率',
    en: 'Reward Rate',
  },
  tierBronze: {
    ja: 'ブロンズパートナー',
    'zh-CN': '铜牌伙伴',
    'zh-TW': '銅牌夥伴',
    en: 'Bronze Partner',
  },
  tierSilver: {
    ja: 'シルバーパートナー',
    'zh-CN': '银牌伙伴',
    'zh-TW': '銀牌夥伴',
    en: 'Silver Partner',
  },
  tierGold: {
    ja: 'ゴールドパートナー',
    'zh-CN': '金牌伙伴',
    'zh-TW': '金牌夥伴',
    en: 'Gold Partner',
  },
  tierDiamond: {
    ja: 'ダイヤモンドパートナー',
    'zh-CN': '钻石伙伴',
    'zh-TW': '鑽石夥伴',
    en: 'Diamond Partner',
  },
  newClientBonus: {
    ja: '新規顧客初回注文ボーナス',
    'zh-CN': '新客首单奖励',
    'zh-TW': '新客首單獎勵',
    en: 'New Client First Order Bonus',
  },
  newClientBonusDesc: {
    ja: '新規顧客の初回注文につき、乙は追加で +5% の紹介報酬ボーナスを獲得します',
    'zh-CN': '每位新客户的首笔订单，乙方将额外获得 +5% 的介绍报酬奖励',
    'zh-TW': '每位新客戶的首筆訂單，乙方將額外獲得 +5% 的介紹報酬獎勵',
    en: 'For each new client\'s first order, Party B will receive an additional +5% referral reward bonus',
  },
  art3Payment1: {
    ja: '紹介報酬は顧客が支払いを完了し、サービスが正常に履行された後にのみ発生します',
    'zh-CN': '介绍报酬仅在客户完成付款且服务正常履行后产生',
    'zh-TW': '介紹報酬僅在客戶完成付款且服務正常履行後產生',
    en: 'Referral rewards are only generated after the client completes payment and the service is properly fulfilled',
  },
  art3Payment2: {
    ja: '顧客が返金を申請した場合、対応する報酬は控除されます',
    'zh-CN': '如客户申请退款，相应报酬将被扣除',
    'zh-TW': '如客戶申請退款，相應報酬將被扣除',
    en: 'If a client requests a refund, the corresponding reward will be deducted',
  },
  art3Payment3: {
    ja: '報酬支払方法：WeChat送金、支付宝、銀行振込（手数料は乙負担）',
    'zh-CN': '报酬支付方式：微信转账、支付宝、银行汇款（手续费由乙方承担）',
    'zh-TW': '報酬支付方式：微信轉帳、支付寶、銀行匯款（手續費由乙方承擔）',
    en: 'Payment methods: WeChat transfer, Alipay, bank wire (handling fees borne by Party B)',
  },
  art3Payment4: {
    ja: '毎月15日までに前月の紹介報酬の支払いを完了',
    'zh-CN': '每月15日前完成上月介绍报酬的支付',
    'zh-TW': '每月15日前完成上月介紹報酬的支付',
    en: 'Payment of the previous month\'s referral rewards is completed by the 15th of each month',
  },
  art3Payment5: {
    ja: '最低出金額は1,000日円',
    'zh-CN': '最低提现金额为 1,000 日元',
    'zh-TW': '最低提現金額為 1,000 日元',
    en: 'Minimum withdrawal amount is 1,000 JPY',
  },
  article4Title: {
    ja: '第4条 乙の権利と義務',
    'zh-CN': '第四条 乙方的权利与义务',
    'zh-TW': '第四條 乙方的權利與義務',
    en: 'Article 4: Rights and Obligations of Party B',
  },
  partyBRights: {
    ja: '乙の権利：',
    'zh-CN': '乙方的权利：',
    'zh-TW': '乙方的權利：',
    en: 'Rights of Party B:',
  },
  right1: { ja: '専用紹介リンクと紹介コードの取得', 'zh-CN': '获得专属推荐连结和推荐码', 'zh-TW': '獲得專屬推薦連結和推薦碼', en: 'Obtain dedicated referral links and referral codes' },
  right2: { ja: '甲が提供するブランド展示サイトサービスの使用（要サブスクリプション）', 'zh-CN': '使用甲方提供的品牌展示网站服务（需订阅）', 'zh-TW': '使用甲方提供的品牌展示網站服務（需訂閱）', en: 'Use the branded display website service provided by Party A (subscription required)' },
  right3: { ja: 'リアルタイムの注文・紹介報酬データの閲覧', 'zh-CN': '查看实时的订单和介绍报酬数据', 'zh-TW': '查看實時的訂單和介紹報酬數據', en: 'View real-time order and referral reward data' },
  right4: { ja: '甲が提供する研修とサポート', 'zh-CN': '获得甲方提供的培训和支援', 'zh-TW': '獲得甲方提供的培訓和支援', en: 'Receive training and support from Party A' },
  partyBObligations: {
    ja: '乙の義務：',
    'zh-CN': '乙方的义务：',
    'zh-TW': '乙方的義務：',
    en: 'Obligations of Party B:',
  },
  obligation1: { ja: '真実かつ正確な個人/企業情報の提供', 'zh-CN': '提供真实、准确的个人/企业信息', 'zh-TW': '提供真實、準確的個人/企業信息', en: 'Provide truthful and accurate personal/business information' },
  obligation2: { ja: '現地の法律法規に従った顧客紹介活動', 'zh-CN': '遵守当地法律法规进行客户介绍活动', 'zh-TW': '遵守當地法律法規進行客戶介紹活動', en: 'Conduct client referral activities in compliance with local laws and regulations' },
  obligation3: { ja: '虚偽の宣伝や顧客の誤認を禁止', 'zh-CN': '不得进行虚假宣传或误导客户', 'zh-TW': '不得進行虛假宣傳或誤導客戶', en: 'No false advertising or misleading clients' },
  obligation4: { ja: '不正注文や詐欺行為の禁止', 'zh-CN': '不得恶意刷单或进行欺诈行为', 'zh-TW': '不得惡意刷單或進行欺詐行為', en: 'No fraudulent orders or deceptive practices' },
  obligation5: { ja: 'アカウントとパスワードの適切な管理、譲渡・貸与の禁止', 'zh-CN': '妥善保管账号密码，不得转让或出借', 'zh-TW': '妥善保管帳號密碼，不得轉讓或出借', en: 'Properly manage account credentials; transfer or lending is prohibited' },
  obligation6: { ja: '自己の名義で顧客と旅行サービス契約を締結しないこと', 'zh-CN': '不得以自己的名义与客户签订任何旅行服务合同', 'zh-TW': '不得以自己的名義與客戶簽訂任何旅行服務合同', en: 'Do not enter into any travel service contracts with clients in your own name' },
  obligation7: { ja: 'サービス提供者が新島交通株式会社であることを顧客に明確に説明すること', 'zh-CN': '向客户明确说明服务提供者为新岛交通株式会社', 'zh-TW': '向客戶明確說明服務提供者為新島交通株式會社', en: 'Clearly inform clients that the service provider is Niijima Kotsu Co., Ltd.' },
  article5Title: { ja: '第5条 甲の権利と義務', 'zh-CN': '第五条 甲方的权利与义务', 'zh-TW': '第五條 甲方的權利與義務', en: 'Article 5: Rights and Obligations of Party A' },
  partyARights: { ja: '甲の権利：', 'zh-CN': '甲方的权利：', 'zh-TW': '甲方的權利：', en: 'Rights of Party A:' },
  aRight1: { ja: '乙の提携パートナー資格の審査', 'zh-CN': '审核乙方的提携伙伴资格', 'zh-TW': '審核乙方的提攜夥伴資格', en: 'Review Party B\'s affiliated partner qualifications' },
  aRight2: { ja: '紹介報酬ポリシーの調整（30日前に通知）', 'zh-CN': '调整介绍报酬政策（提前30天通知）', 'zh-TW': '調整介紹報酬政策（提前30天通知）', en: 'Adjust referral reward policies (with 30 days\' prior notice)' },
  aRight3: { ja: '違反行為への対処（協力終了を含む）', 'zh-CN': '对违规行为进行处理，包括终止合作', 'zh-TW': '對違規行為進行處理，包括終止合作', en: 'Take action on violations, including termination of cooperation' },
  aRight4: { ja: '本契約の最終解釈権', 'zh-CN': '解释本协议的最终解释权', 'zh-TW': '解釋本協議的最終解釋權', en: 'Final interpretation authority of this Agreement' },
  partyAObligations: { ja: '甲の義務：', 'zh-CN': '甲方的义务：', 'zh-TW': '甲方的義務：', en: 'Obligations of Party A:' },
  aObligation1: { ja: '乙が受け取るべき紹介報酬の適時支払い', 'zh-CN': '按时支付乙方应得的介绍报酬', 'zh-TW': '按時支付乙方應得的介紹報酬', en: 'Timely payment of referral rewards due to Party B' },
  aObligation2: { ja: '安定した技術プラットフォームのサポート提供', 'zh-CN': '提供稳定的技术平台支援', 'zh-TW': '提供穩定的技術平台支援', en: 'Provide stable technical platform support' },
  aObligation3: { ja: '乙の個人情報の安全保護', 'zh-CN': '保护乙方的个人信息安全', 'zh-TW': '保護乙方的個人信息安全', en: 'Protect Party B\'s personal information security' },
  aObligation4: { ja: '必要な研修とカスタマーサポートの提供', 'zh-CN': '提供必要的培训和客服支援', 'zh-TW': '提供必要的培訓和客服支援', en: 'Provide necessary training and customer support' },
  aObligation5: { ja: '旅行サービス提供者として、顧客に対する旅行サービス契約義務の履行', 'zh-CN': '作为旅行服务提供者，对客户履行旅行服务合同义务', 'zh-TW': '作為旅行服務提供者，對客戶履行旅行服務合同義務', en: 'As the travel service provider, fulfill travel service contract obligations to clients' },
  article6Title: { ja: '第6条 禁止行為', 'zh-CN': '第六条 禁止行为', 'zh-TW': '第六條 禁止行為', en: 'Article 6: Prohibited Conduct' },
  art6Intro: { ja: '乙は以下の行為を行ってはなりません。違反した場合は直ちに協力を終了し、法的責任を追及します：', 'zh-CN': '乙方不得从事以下行为，违者将被立即终止合作并追究法律责任：', 'zh-TW': '乙方不得從事以下行為，違者將被立即終止合作並追究法律責任：', en: 'Party B shall not engage in the following conduct. Violations will result in immediate termination and legal liability:' },
  prohibit1: { ja: '顧客情報や注文の偽造', 'zh-CN': '伪造客户信息或订单', 'zh-TW': '偽造客戶信息或訂單', en: 'Falsifying client information or orders' },
  prohibit2: { ja: '虚偽または誤解を招く広告内容の使用', 'zh-CN': '使用虚假或误导性的广告内容', 'zh-TW': '使用虛假或誤導性的廣告內容', en: 'Using false or misleading advertising content' },
  prohibit3: { ja: '甲の名義を騙って未承認の商業活動を行うこと', 'zh-CN': '冒用甲方名义进行未授权的商业活动', 'zh-TW': '冒用甲方名義進行未授權的商業活動', en: 'Conducting unauthorized commercial activities in Party A\'s name' },
  prohibit4: { ja: '甲のシステムへの攻撃やデータの窃取', 'zh-CN': '恶意攻击甲方系统或窃取数据', 'zh-TW': '惡意攻擊甲方系統或竊取數據', en: 'Maliciously attacking Party A\'s systems or stealing data' },
  prohibit5: { ja: 'コミッションのマネーロンダリング等の違法使用', 'zh-CN': '将佣金用于洗钱等非法用途', 'zh-TW': '將佣金用於洗錢等非法用途', en: 'Using commission for money laundering or other illegal purposes' },
  prohibit6: { ja: '競合他社への甲の営業秘密の漏洩', 'zh-CN': '向竞争对手泄露甲方商业机密', 'zh-TW': '向競爭對手洩露甲方商業機密', en: 'Disclosing Party A\'s trade secrets to competitors' },
  article7Title: { ja: '第7条 契約終了', 'zh-CN': '第七条 协议终止', 'zh-TW': '第七條 協議終止', en: 'Article 7: Agreement Termination' },
  art7Item1: { ja: '乙はいつでも協力終了を申請でき、発生済みのコミッションは通常通り精算されます', 'zh-CN': '乙方可随时申请终止合作，已产生的佣金将正常结算', 'zh-TW': '乙方可隨時申請終止合作，已產生的佣金將正常結算', en: 'Party B may apply to terminate cooperation at any time; accrued commission will be settled normally' },
  art7Item2: { ja: '甲は乙が本契約に違反した場合、直ちに協力を終了する権利を有します', 'zh-CN': '甲方有权在乙方违反本协议时立即终止合作', 'zh-TW': '甲方有權在乙方違反本協議時立即終止合作', en: 'Party A reserves the right to immediately terminate cooperation if Party B violates this Agreement' },
  art7Item3: { ja: '契約終了後、乙は甲のすべての販促リソースの使用を停止しなければなりません', 'zh-CN': '协议终止后，乙方应停止使用甲方的所有推广资源', 'zh-TW': '協議終止後，乙方應停止使用甲方的所有推廣資源', en: 'After termination, Party B shall cease using all of Party A\'s promotional resources' },
  art7Item4: { ja: '終了後30日以内に最後のコミッション精算を完了', 'zh-CN': '终止后30天内完成最后一笔佣金结算', 'zh-TW': '終止後30天內完成最後一筆佣金結算', en: 'Complete the final commission settlement within 30 days of termination' },
  article8Title: { ja: '第8条 免責事項', 'zh-CN': '第八条 免责声明', 'zh-TW': '第八條 免責聲明', en: 'Article 8: Disclaimer' },
  art8Item1: { ja: '甲は乙の顧客紹介行為について連帯責任を負いません', 'zh-CN': '甲方不对乙方的客户介绍行为承担连带责任', 'zh-TW': '甲方不對乙方的客戶介紹行為承擔連帶責任', en: 'Party A shall not bear joint liability for Party B\'s client referral activities' },
  art8Item2: { ja: '不可抗力によるサービス中断について、甲は責任を負いません', 'zh-CN': '因不可抗力导致的服务中断，甲方不承担责任', 'zh-TW': '因不可抗力導致的服務中斷，甲方不承擔責任', en: 'Party A shall not be liable for service interruptions caused by force majeure' },
  art8Item3: { ja: '乙は紹介報酬に関する税務問題（雑所得等）を自ら処理する必要があります', 'zh-CN': '乙方应自行处理介绍报酬产生的税务问题（杂所得等）', 'zh-TW': '乙方應自行處理介紹報酬產生的稅務問題（雜所得等）', en: 'Party B shall handle tax matters related to referral rewards (miscellaneous income, etc.) independently' },
  article9Title: { ja: '第9条 法律関係の明確化（重要）', 'zh-CN': '第九条 法律关系明确（重要）', 'zh-TW': '第九條 法律關係明確（重要）', en: 'Article 9: Clarification of Legal Relationship (Important)' },
  art9Warning: { ja: '本条は本契約の核心条項です。乙は必ず注意深くお読みください', 'zh-CN': '本条款为本协议核心条款，乙方务必仔细阅读', 'zh-TW': '本條款為本協議核心條款，乙方務必仔細閱讀', en: 'This article is the core provision of this Agreement. Party B must read it carefully' },
  art9Item1: { ja: 'サービス提供者：本契約に関わるすべての旅行関連サービス（医療健診、ゴルフ予約、ナイトクラブ予約、ビジネス視察等を含むがこれらに限定されない）は、甲（新島交通株式会社、大阪府知事登録旅行業 第2-3115号）が提供します。', 'zh-CN': '服务提供者：本协议所涉及的所有旅行相关服务（包括但不限于医疗体检、高尔夫预约、夜总会预约、商务考察等）均由甲方（新岛交通株式会社，大阪府知事登录旅行业 第2-3115号）提供。', 'zh-TW': '服務提供者：本協議所涉及的所有旅行相關服務（包括但不限於醫療體檢、高爾夫預約、夜總會預約、商務考察等）均由甲方（新島交通株式會社，大阪府知事登錄旅行業 第2-3115號）提供。', en: 'Service Provider: All travel-related services covered by this Agreement (including but not limited to medical checkups, golf reservations, nightclub reservations, business visits, etc.) are provided by Party A (Niijima Kotsu Co., Ltd., Osaka Governor Registered Travel Agency No. 2-3115).' },
  art9Item2: { ja: '乙の役割：本契約における乙の役割は「顧客紹介者」であり、潜在顧客に甲のサービスを紹介する責任を負います。乙は独立した旅行サービス提供者ではなく、旅行業経営資格を有しておらず、また有する必要もありません。', 'zh-CN': '乙方的角色：乙方在本协议下的角色为"客户介绍者"，负责向潜在客户介绍甲方的服务。乙方不是独立的旅行服务提供者，不具备旅行业经营资格，也不需要具备旅行业经营资格。', 'zh-TW': '乙方的角色：乙方在本協議下的角色為「客戶介紹者」，負責向潛在客戶介紹甲方的服務。乙方不是獨立的旅行服務提供者，不具備旅行業經營資格，也不需要具備旅行業經營資格。', en: 'Party B\'s Role: Party B\'s role under this Agreement is as a "Client Referrer," responsible for introducing Party A\'s services to potential clients. Party B is not an independent travel service provider, does not hold, and is not required to hold, a travel business license.' },
  art9Item3: { ja: '契約関係：すべての旅行サービス契約は甲と顧客の間で締結されます。乙と顧客の間に直接的なサービス契約関係は存在しません。', 'zh-CN': '合同关系：所有旅行服务合同均在甲方与客户之间签订。乙方与客户之间不存在直接的服务合同关系。', 'zh-TW': '合同關係：所有旅行服務合同均在甲方與客戶之間簽訂。乙方與客戶之間不存在直接的服務合同關係。', en: 'Contractual Relationship: All travel service contracts are entered into between Party A and the client. There is no direct service contract relationship between Party B and the client.' },
  art9Item4: { ja: '独立経営の禁止：乙は自己の名義で顧客と旅行サービス契約を締結してはならず、顧客から旅行サービス料金を受領してはならず、顧客に旅行サービスの請求書や領収書を発行してはなりません。', 'zh-CN': '禁止独立经营：乙方不得以自己的名义与客户签订任何旅行服务合同，不得收取客户支付的旅行服务费用，不得向客户出具旅行服务发票或收据。', 'zh-TW': '禁止獨立經營：乙方不得以自己的名義與客戶簽訂任何旅行服務合同，不得收取客戶支付的旅行服務費用，不得向客戶出具旅行服務發票或收據。', en: 'Prohibition of Independent Operation: Party B shall not enter into any travel service contracts with clients in its own name, shall not collect travel service fees from clients, and shall not issue travel service invoices or receipts to clients.' },
  art9Item5: { ja: '紹介報酬の性質：乙が顧客の紹介に成功して得る報酬は「紹介手数料」であり、旅行業務収入を構成せず、旅行業法の関連規定は適用されません。', 'zh-CN': '介绍报酬性质：乙方因成功介绍客户而获得的报酬，其性质为"紹介手数料"（介绍费），不构成旅行业务收入，不适用旅行业法的相关规定。', 'zh-TW': '介紹報酬性質：乙方因成功介紹客戶而獲得的報酬，其性質為「紹介手数料」（介紹費），不構成旅行業務收入，不適用旅行業法的相關規定。', en: 'Nature of Referral Rewards: The reward obtained by Party B for successfully referring clients is a "referral commission" (referral fee), which does not constitute travel business income and is not subject to travel business law regulations.' },
  art9Item6: { ja: 'ブランド展示サイト：乙が使用するブランド展示サイトは甲のシステムの授権使用であり、サイト上のすべてのサービスは甲が提供します。サイトのフッターには「本サービスは新島交通株式会社が提供しています」および甲の旅行業登録番号が明記されます。', 'zh-CN': '品牌展示网站：乙方使用的品牌展示网站为甲方系统的授权使用，网站上的所有服务由甲方提供。网站底部将明确标示"本サービスは新島交通株式会社が提供しています"及甲方的旅行业登录号。', 'zh-TW': '品牌展示網站：乙方使用的品牌展示網站為甲方系統的授權使用，網站上的所有服務由甲方提供。網站底部將明確標示「本サービスは新島交通株式会社が提供しています」及甲方的旅行業登錄號。', en: 'Branded Display Website: The branded display website used by Party B is an authorized use of Party A\'s system, and all services on the website are provided by Party A. The website footer will clearly indicate "This service is provided by Niijima Kotsu Co., Ltd." and Party A\'s travel business registration number.' },
  art9Item7: { ja: '顧客告知義務：乙が顧客にサービスを紹介する際、サービス提供者が新島交通株式会社であり、契約は新島交通株式会社と締結されることを顧客に明確に告知しなければなりません。', 'zh-CN': '客户告知义务：乙方在向客户介绍服务时，应明确告知客户：服务提供者为新岛交通株式会社，合同将与新岛交通株式会社签订。', 'zh-TW': '客戶告知義務：乙方在向客戶介紹服務時，應明確告知客戶：服務提供者為新島交通株式會社，合同將與新島交通株式會社簽訂。', en: 'Client Disclosure Obligation: When introducing services to clients, Party B must clearly inform them that the service provider is Niijima Kotsu Co., Ltd. and the contract will be entered into with Niijima Kotsu Co., Ltd.' },
  article10Title: { ja: '第10条 紛争解決', 'zh-CN': '第十条 争议解决', 'zh-TW': '第十條 爭議解決', en: 'Article 10: Dispute Resolution' },
  art10Item1: { ja: '本契約の解釈には日本法が適用されます', 'zh-CN': '本协议的解释适用日本法律', 'zh-TW': '本協議的解釋適用日本法律', en: 'This Agreement shall be interpreted under Japanese law' },
  art10Item2: { ja: '両当事者はまず友好的な協議により紛争を解決するものとします', 'zh-CN': '双方应首先通过友好协商解决争议', 'zh-TW': '雙方應首先通過友好協商解決爭議', en: 'Both parties shall first attempt to resolve disputes through amicable negotiation' },
  art10Item3: { ja: '協議による解決ができない場合、大阪地方裁判所の管轄に付します', 'zh-CN': '协商不成的，提交大阪地方裁判所管辖', 'zh-TW': '協商不成的，提交大阪地方裁判所管轄', en: 'If negotiation fails, the matter shall be submitted to the jurisdiction of the Osaka District Court' },
  article11Title: { ja: '第11条 連絡先', 'zh-CN': '第十一条 联系方式', 'zh-TW': '第十一條 聯繫方式', en: 'Article 11: Contact Information' },
  companyName: { ja: '新島交通株式会社', 'zh-CN': '新岛交通株式会社', 'zh-TW': '新島交通株式會社', en: 'Niijima Kotsu Co., Ltd.' },
  partnerDept: { ja: '提携パートナープログラム運営部', 'zh-CN': '提携伙伴计划运营部', 'zh-TW': '提攜夥伴計劃運營部', en: 'Affiliated Partner Program Operations' },
  address: { ja: '〒556-0014 大阪府大阪市浪速区大国1-2-21-602', 'zh-CN': '〒556-0014 大阪府大阪市浪速区大国1-2-21-602', 'zh-TW': '〒556-0014 大阪府大阪市浪速區大國1-2-21-602', en: '〒556-0014 1-2-21-602 Daikoku, Naniwa-ku, Osaka, Japan' },
  phone: { ja: '電話: 06-6632-8807', 'zh-CN': '电话: 06-6632-8807', 'zh-TW': '電話: 06-6632-8807', en: 'Phone: 06-6632-8807' },
  enactmentDate: { ja: '制定日：2025年1月1日', 'zh-CN': '制定日：2025年1月1日', 'zh-TW': '制定日：2025年1月1日', en: 'Enacted: January 1, 2025' },
  lastRevisionDate: { ja: '最終改定日：2025年1月18日', 'zh-CN': '最终修订日：2025年1月18日', 'zh-TW': '最終改定日：2025年1月18日', en: 'Last Revised: January 18, 2025' },
  agreeTitle: { ja: '登録をもって同意とみなします', 'zh-CN': '注册即表示同意', 'zh-TW': '註冊即表示同意', en: 'Registration Constitutes Consent' },
  agreeDesc: { ja: '提携パートナー登録を完了した時点で、本契約のすべての条項（特に第9条「法律関係の明確化」）を読み、理解し、同意したものとみなされます。ご不明な点がございましたら、登録前にカスタマーサポートまでお問い合わせください。', 'zh-CN': '当您完成提携伙伴注册时，即表示您已阅读、理解并同意本协议的全部条款，特别是第九条"法律关系明确"的内容。如有任何疑问，请在注册前联系我们的客服团队。', 'zh-TW': '當您完成提攜夥伴註冊時，即表示您已閱讀、理解並同意本協議的全部條款，特別是第九條「法律關係明確」的內容。如有任何疑問，請在註冊前聯繫我們的客服團隊。', en: 'By completing the affiliated partner registration, you confirm that you have read, understood, and agreed to all terms of this Agreement, particularly Article 9 "Clarification of Legal Relationship." If you have any questions, please contact our support team before registering.' },
  privacyPolicy: { ja: 'プライバシーポリシー →', 'zh-CN': '隐私政策 →', 'zh-TW': '隱私政策 →', en: 'Privacy Policy →' },
  generalTerms: { ja: '一般利用規約 →', 'zh-CN': '一般利用规约 →', 'zh-TW': '一般利用規約 →', en: 'General Terms →' },
  applyNow: { ja: '今すぐ申請 →', 'zh-CN': '立即申请 →', 'zh-TW': '立即申請 →', en: 'Apply Now →' },
  footerCopyright: { ja: '新島交通株式会社 All Rights Reserved.', 'zh-CN': '新岛交通株式会社 All Rights Reserved.', 'zh-TW': '新島交通株式會社 All Rights Reserved.', en: 'Niijima Kotsu Co., Ltd. All Rights Reserved.' },
  footerLicense: { ja: '大阪府知事登録旅行業 第2-3115号 ｜ 一般社団法人 日本旅行業協会（JATA）正会員', 'zh-CN': '大阪府知事登录旅行业 第2-3115号 ｜ 一般社团法人 日本旅行业协会（JATA）正会员', 'zh-TW': '大阪府知事登錄旅行業 第2-3115號 ｜ 一般社團法人 日本旅行業協會（JATA）正會員', en: 'Osaka Governor Registered Travel Agency No. 2-3115 | JATA Full Member' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

export default function GuidePartnerTermsPage() {
  const lang = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/guide-partner" className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-brand-600" />
            <span className="font-bold text-gray-900">NIIJIMA</span>
          </Link>
          <Link
            href="/guide-partner"
            className="flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition"
          >
            <ArrowLeft size={18} />
            <span>{t('back', lang)}</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('mainTitle', lang)}
        </h1>
        <p className="text-gray-500 mb-8">{t('mainSubtitle', lang)}</p>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
          {/* 序文 */}
          <p className="text-gray-700 leading-relaxed">
            {t('preamble', lang)}
          </p>

          <Section title={t('article1Title', lang)}>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>{t('art1Item1', lang).split('：')[0]}</strong>：{t('art1Item1', lang).split('：').slice(1).join('：')}</li>
              <li><strong>{t('art1Item2', lang).split('：')[0]}</strong>：{t('art1Item2', lang).split('：').slice(1).join('：')}</li>
              <li><strong>{t('art1Item3', lang).split('：')[0]}</strong>：{t('art1Item3', lang).split('：').slice(1).join('：')}</li>
              <li><strong>{t('art1Item4', lang).split('：')[0]}</strong>：{t('art1Item4', lang).split('：').slice(1).join('：')}</li>
            </ul>
          </Section>

          <Section title={t('article2Title', lang)}>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>{t('art2Item1', lang)}</li>
              <li>{t('art2Item2', lang)}</li>
              <li>{t('art2Item3', lang)}</li>
              <li>{t('art2Item4', lang)}</li>
              <li><strong>{t('art2Item5', lang)}</strong></li>
            </ol>
          </Section>

          <Section title={t('article3Title', lang)}>
            <div className="space-y-4">
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                <h4 className="font-bold text-brand-800 mb-2">{t('commissionFormula', lang)}</h4>
                <p className="text-brand-700">{t('formulaText', lang)}</p>
                <p className="text-sm text-brand-600 mt-1">{t('formulaNote', lang)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">{t('commissionTiers', lang)}</h4>
                <p className="text-sm text-gray-500 mb-3">{t('tiersNote', lang)}</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{t('tierHeader', lang)}</th>
                      <th className="text-left py-2">{t('quarterlyPerformance', lang)}</th>
                      <th className="text-left py-2">{t('rewardRate', lang)}</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="py-2">{t('tierBronze', lang)}</td>
                      <td className="py-2">0 - 100{lang === 'en' ? '0K JPY' : lang === 'ja' ? '万円' : lang === 'zh-TW' ? '萬日元' : '万日元'}</td>
                      <td className="py-2 font-medium text-brand-600">10%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">{t('tierSilver', lang)}</td>
                      <td className="py-2">100{lang === 'en' ? '0K' : lang === 'ja' ? '万' : lang === 'zh-TW' ? '萬' : '万'} - 300{lang === 'en' ? '0K JPY' : lang === 'ja' ? '万円' : lang === 'zh-TW' ? '萬日元' : '万日元'}</td>
                      <td className="py-2 font-medium text-gray-500">12%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">{t('tierGold', lang)}</td>
                      <td className="py-2">300{lang === 'en' ? '0K' : lang === 'ja' ? '万' : lang === 'zh-TW' ? '萬' : '万'} - 500{lang === 'en' ? '0K JPY' : lang === 'ja' ? '万円' : lang === 'zh-TW' ? '萬日元' : '万日元'}</td>
                      <td className="py-2 font-medium text-yellow-600">15%</td>
                    </tr>
                    <tr>
                      <td className="py-2">{t('tierDiamond', lang)}</td>
                      <td className="py-2">500{lang === 'en' ? '0K+ JPY' : lang === 'ja' ? '万円以上' : lang === 'zh-TW' ? '萬日元以上' : '万日元以上'}</td>
                      <td className="py-2 font-medium text-blue-600">20%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">{t('newClientBonus', lang)}</h4>
                <p className="text-purple-700">{t('newClientBonusDesc', lang)}</p>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>{t('art3Payment1', lang)}</li>
                <li>{t('art3Payment2', lang)}</li>
                <li>{t('art3Payment3', lang)}</li>
                <li>{t('art3Payment4', lang)}</li>
                <li>{t('art3Payment5', lang)}</li>
              </ol>
            </div>
          </Section>

          <Section title={t('article4Title', lang)}>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('partyBRights', lang)}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>{t('right1', lang)}</li>
                  <li>{t('right2', lang)}</li>
                  <li>{t('right3', lang)}</li>
                  <li>{t('right4', lang)}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('partyBObligations', lang)}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>{t('obligation1', lang)}</li>
                  <li>{t('obligation2', lang)}</li>
                  <li>{t('obligation3', lang)}</li>
                  <li>{t('obligation4', lang)}</li>
                  <li>{t('obligation5', lang)}</li>
                  <li><strong>{t('obligation6', lang)}</strong></li>
                  <li><strong>{t('obligation7', lang)}</strong></li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title={t('article5Title', lang)}>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('partyARights', lang)}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>{t('aRight1', lang)}</li>
                  <li>{t('aRight2', lang)}</li>
                  <li>{t('aRight3', lang)}</li>
                  <li>{t('aRight4', lang)}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('partyAObligations', lang)}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>{t('aObligation1', lang)}</li>
                  <li>{t('aObligation2', lang)}</li>
                  <li>{t('aObligation3', lang)}</li>
                  <li>{t('aObligation4', lang)}</li>
                  <li><strong>{t('aObligation5', lang)}</strong></li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title={t('article6Title', lang)}>
            <p className="mb-3 text-gray-700">{t('art6Intro', lang)}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>{t('prohibit1', lang)}</li>
              <li>{t('prohibit2', lang)}</li>
              <li>{t('prohibit3', lang)}</li>
              <li>{t('prohibit4', lang)}</li>
              <li>{t('prohibit5', lang)}</li>
              <li>{t('prohibit6', lang)}</li>
            </ul>
          </Section>

          <Section title={t('article7Title', lang)}>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>{t('art7Item1', lang)}</li>
              <li>{t('art7Item2', lang)}</li>
              <li>{t('art7Item3', lang)}</li>
              <li>{t('art7Item4', lang)}</li>
            </ol>
          </Section>

          <Section title={t('article8Title', lang)}>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>{t('art8Item1', lang)}</li>
              <li>{t('art8Item2', lang)}</li>
              <li>{t('art8Item3', lang)}</li>
            </ol>
          </Section>

          <Section title={t('article9Title', lang)}>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-bold mb-2">{t('art9Warning', lang)}</p>
            </div>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>{t('art9Item1', lang)}</li>
              <li>{t('art9Item2', lang)}</li>
              <li>{t('art9Item3', lang)}</li>
              <li>{t('art9Item4', lang)}</li>
              <li>{t('art9Item5', lang)}</li>
              <li>{t('art9Item6', lang)}</li>
              <li>{t('art9Item7', lang)}</li>
            </ol>
          </Section>

          <Section title={t('article10Title', lang)}>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>{t('art10Item1', lang)}</li>
              <li>{t('art10Item2', lang)}</li>
              <li>{t('art10Item3', lang)}</li>
            </ol>
          </Section>

          <Section title={t('article11Title', lang)}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-gray-900">{t('companyName', lang)}</p>
              <p className="text-sm text-gray-600">{t('partnerDept', lang)}</p>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>{t('address', lang)}</p>
                <p>{t('phone', lang)}</p>
                <p>Email: partner@niijima-koutsu.jp</p>
              </div>
            </div>
          </Section>

          {/* 制定日 */}
          <div className="pt-6 border-t text-sm text-gray-500">
            <p>{t('enactmentDate', lang)}</p>
            <p>{t('lastRevisionDate', lang)}</p>
          </div>
        </div>

        {/* 同意確認區域 */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-800">{t('agreeTitle', lang)}</h3>
              <p className="text-green-700 text-sm mt-1">
                {t('agreeDesc', lang)}
              </p>
            </div>
          </div>
        </div>

        {/* 相關連結 */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/legal/privacy" className="text-brand-600 hover:underline text-sm">
            {t('privacyPolicy', lang)}
          </Link>
          <Link href="/legal/terms" className="text-brand-600 hover:underline text-sm">
            {t('generalTerms', lang)}
          </Link>
          <Link href="/guide-partner/register" className="text-brand-600 hover:underline text-sm">
            {t('applyNow', lang)}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t('footerCopyright', lang)}</p>
          <p className="mt-2">{t('footerLicense', lang)}</p>
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
