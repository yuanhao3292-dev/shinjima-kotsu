'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Mail, MessageCircle, ArrowRight, X } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

const WECHAT_QR_URL = '/wechat-qr.png';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

interface FAQItem {
  question: Record<Language, string>;
  answer: Record<Language, string>;
  category: string;
}

// Category keys and labels
const CATEGORY_LABELS: Record<string, Record<Language, string>> = {
  all: { ja: 'すべて', 'zh-TW': '全部', 'zh-CN': '全部', en: 'All' },
  cancer: { ja: 'がん治療', 'zh-TW': '重症治療', 'zh-CN': '重症治疗', en: 'Cancer Treatment' },
  checkup: { ja: '健診・人間ドック', 'zh-TW': '精密體檢', 'zh-CN': '精密体检', en: 'Health Checkup' },
  golf: { ja: 'ゴルフ', 'zh-TW': '高爾夫', 'zh-CN': '高尔夫', en: 'Golf' },
  business: { ja: 'ビジネス視察', 'zh-TW': '商務考察', 'zh-CN': '商务考察', en: 'Business Tour' },
  ground: { ja: 'ランドオペレーター', 'zh-TW': '日本地接', 'zh-CN': '日本地接', en: 'Ground Service' },
};

const CATEGORY_KEYS = ['all', 'cancer', 'checkup', 'golf', 'business', 'ground'];

const FAQ_DATA: FAQItem[] = [
  // ===== Cancer Treatment =====
  {
    category: 'cancer',
    question: {
      ja: '日本ではどのようながん治療を受けられますか？中国と比べてどんな優位性がありますか？',
      'zh-TW': '日本能治療哪些類型的癌症？與國內相比有什麼優勢？',
      'zh-CN': '日本能治疗哪些类型的癌症？与国内相比有什么优势？',
      en: 'What types of cancer can be treated in Japan? What are the advantages compared to China?',
    },
    answer: {
      ja: '日本は消化器がん（胃・大腸・肝臓・食道）の治療で世界的にリードしており、5年生存率は国際平均を大きく上回っています。主な優位性：（1）精密検査による高い早期発見率（2）腹腔鏡・ロボット手術（ダヴィンチ等）の高い普及率（3）陽子線・重粒子線治療施設が世界最多（全国30施設以上）（4）集学的治療（MDT）体制が充実し、複数の専門医が共同で治療方針を決定。代表的な専門病院に、がん研有明病院、国立がん研究センターなどがあります。',
      'zh-TW': '日本在消化系統腫瘤（胃癌、腸癌、肝癌、食道癌）的治療方面全球領先，五年生存率顯著高於國際平均水平。核心優勢包括：（1）早期發現率高，精密檢查體系完善（2）微創手術技術成熟，腹腔鏡、達芬奇機器人手術等普及率高（3）質子重離子治療設施數量全球最多（全國約30餘處）（4）多學科聯合診療（MDT）制度完善，由外科、內科、放療科等多學科專家共同制定治療方案。知名的癌症專科醫院包括癌研有明病院和國立癌症研究中心等。',
      'zh-CN': '日本在消化系统肿瘤（胃癌、肠癌、肝癌、食道癌）的治疗方面全球领先，五年生存率显著高于国际平均水平。核心优势包括：（1）早期发现率高，精密检查体系完善（2）微创手术技术成熟，腹腔镜、达芬奇机器人手术等普及率高（3）质子重离子治疗设施数量全球最多（全国约30余处）（4）多学科联合诊疗（MDT）制度完善，由外科、内科、放疗科等多学科专家共同制定治疗方案。知名的癌症专科医院包括癌研有明病院和国立癌症研究中心等。',
      en: 'Japan leads globally in treating digestive cancers (stomach, colon, liver, esophageal), with 5-year survival rates significantly above international averages. Key advantages: (1) High early detection rates through precision screening (2) Widespread minimally invasive surgery including da Vinci robotic surgery (3) World\'s most proton/heavy ion therapy facilities (~30+ nationwide) (4) Well-established MDT (Multi-Disciplinary Team) system where specialists jointly develop treatment plans. Leading hospitals include Cancer Institute Hospital Ariake and National Cancer Center.',
    },
  },
  {
    category: 'cancer',
    question: {
      ja: '日本で治療を受けるにはどんなビザが必要ですか？手続きの流れは？',
      'zh-TW': '赴日就醫需要辦理什麼簽證？流程是怎樣的？',
      'zh-CN': '赴日就医需要办理什么签证？流程是怎样的？',
      en: 'What visa is needed for medical treatment in Japan? What is the process?',
    },
    answer: {
      ja: '「医療滞在ビザ」の取得が必要です。2011年から外国人患者向けに設けられた専用ビザです。手続きの流れ：（1）患者の診療記録を翻訳し、日本の病院に評価を依頼（2）病院から受入確認書・治療計画書を取得（3）日本政府認定の身元保証機関から身元保証書を取得（4）パスポート・申請書・残高証明（10万人民元以上）・治療計画書等を揃え、日本大使館指定の代理店で申請。準備から発給まで約3-4週間、有効期間は通常30-90日。当社は身元保証から申請手続きまで一括サポートいたします。',
      'zh-TW': '需要申請「醫療滯在簽證」，這是日本政府自2011年起專門面向海外患者開設的簽證類別。辦理流程：（1）患者提供病歷資料，由我們翻譯後提交日本醫院評估（2）日本醫院出具接收通知書和治療計劃書（3）由具備「身元保證」資質的機構出具擔保函（4）攜帶護照、簽證申請表、存款證明（不少於10萬元人民幣）、治療計劃書等材料到日本大使館指定機構遞交申請。從準備到出簽約需3-4週，簽證有效期通常為30-90天。我們提供從身元擔保到簽證申請的全程協助。',
      'zh-CN': '需要申请"医疗滞在签证"，这是日本政府自2011年起专门面向海外患者开设的签证类别。办理流程：（1）患者提供病历资料，由我们翻译后提交日本医院评估（2）日本医院出具接收通知书和治疗计划书（3）由具备"身元保证"资质的机构出具担保函（4）携带护照、签证申请表、存款证明（不少于10万元人民币）、治疗计划书等材料到日本大使馆指定机构递交申请。从准备到出签约需3-4周，签证有效期通常为30-90天。我们提供从身元担保到签证申请的全程协助。',
      en: 'You need a "Medical Stay Visa," established in 2011 specifically for overseas patients. Process: (1) Submit translated medical records for Japanese hospital evaluation (2) Obtain acceptance letter and treatment plan from the hospital (3) Get a guarantor letter from an authorized institution (4) Submit passport, application form, bank statement (min. RMB 100,000), treatment plan, etc. to the designated agency. Processing takes 3-4 weeks, with validity of 30-90 days. We provide full support from guarantor arrangements to visa application.',
    },
  },
  {
    category: 'cancer',
    question: {
      ja: '陽子線・重粒子線治療はどのような患者に適していますか？',
      'zh-TW': '質子重離子治療適合哪些患者？',
      'zh-CN': '质子重离子治疗适合哪些患者？',
      en: 'Which patients are suitable for proton/heavy ion therapy?',
    },
    answer: {
      ja: '陽子線・重粒子線治療は高精度放射線治療で、腫瘍組織をピンポイントで照射し、周辺の正常組織へのダメージを最小限に抑えます。適応疾患：頭頸部腫瘍、頭蓋底腫瘍、早期非小細胞肺がん、肝がん、前列腺がん、骨・軟部肉腫、小児腫瘍など。治療期間は通常1-2ヶ月（毎日照射、1回約20-30分、合計10-30回）。費用は約250-350万円です。ただし、広範囲に転移した進行がんには適応外の場合が多いため、まず診療記録をお送りいただき、日本の専門病院で適応評価を行います。',
      'zh-TW': '質子重離子治療是一種精準放射治療技術，能精確打擊腫瘤組織，對周圍正常組織損傷極小。適合病種包括：頭頸部腫瘤、顱底腫瘤、早期非小細胞肺癌、肝癌、前列腺癌、骨與軟組織肉瘤、小兒腫瘤等。治療週期通常為1-2個月（每日照射，每次約20-30分鐘，共10-30次）。費用約250-350萬日元（折合人民幣約12-18萬元）。需要注意的是，廣泛轉移的晚期癌症患者通常不適合。建議先將病歷資料提交日本專科醫院評估是否有適應症。',
      'zh-CN': '质子重离子治疗是一种精准放射治疗技术，能精确打击肿瘤组织，对周围正常组织损伤极小。适合病种包括：头颈部肿瘤、颅底肿瘤、早期非小细胞肺癌、肝癌、前列腺癌、骨与软组织肉瘤、小儿肿瘤等。治疗周期通常为1-2个月（每日照射，每次约20-30分钟，共10-30次）。费用约250-350万日元（折合人民币约12-18万元）。需要注意的是，广泛转移的晚期癌症患者通常不适合。建议先将病历资料提交日本专科医院评估是否有适应症。',
      en: 'Proton/heavy ion therapy precisely targets tumors while minimizing damage to surrounding tissues. Suitable for: head/neck tumors, skull base tumors, early-stage NSCLC, liver cancer, prostate cancer, bone/soft tissue sarcomas, and pediatric tumors. Treatment typically lasts 1-2 months (daily sessions of 20-30 minutes, 10-30 sessions total), costing approximately ¥2.5-3.5 million. Note: widely metastasized advanced cancers are generally not suitable. We recommend submitting medical records for evaluation first.',
    },
  },
  {
    category: 'cancer',
    question: {
      ja: '日本でのがん治療の費用はどのくらいかかりますか？',
      'zh-TW': '去日本治療癌症大概需要花多少錢？',
      'zh-CN': '去日本治疗癌症大概需要花多少钱？',
      en: 'How much does cancer treatment in Japan cost?',
    },
    answer: {
      ja: '費用はがんの種類・治療法により大きく異なります。参考価格：（1）陽子線治療：約250-350万円（2）消化器系がん手術：約300-500万円（3）総合がん治療（手術＋化学療法＋放射線）：約1,500-2,000万円。医療費以外に、仲介サービス料、医療通訳費、渡航費・宿泊費なども必要です。外国人患者は日本の国民健康保険を利用できないため全額自費となります。当社では初回相談時に詳細な費用見積もりをお出しし、治療費の事前送金手続きもサポートいたします。',
      'zh-TW': '費用因病種和治療方案不同差異較大。參考價格：（1）質子治療：約250-350萬日元（折合人民幣約12-18萬元）（2）消化系統腫瘤外科手術：約300-500萬日元（3）綜合癌症治療（含手術、化療、放療等）：約1500-2000萬日元（折合人民幣80-100萬元）。除醫療費外，還需考慮：服務機構的中介服務費、醫療翻譯費、往返機票和住宿費等。外國患者在日本不能使用國民健康保險，需全額自費。我們會在初次諮詢時提供詳細費用估算。',
      'zh-CN': '费用因病种和治疗方案不同差异较大。参考价格：（1）质子治疗：约250-350万日元（折合人民币约12-18万元）（2）消化系统肿瘤外科手术：约300-500万日元（3）综合癌症治疗（含手术、化疗、放疗等）：约1500-2000万日元（折合人民币80-100万元）。除医疗费外，还需考虑：服务机构的中介服务费、医疗翻译费、往返机票和住宿费等。外国患者在日本不能使用国民健康保险，需全额自费。我们会在初次咨询时提供详细费用估算。',
      en: 'Costs vary significantly by condition and treatment. Reference prices: (1) Proton therapy: ~¥2.5-3.5M (2) Digestive cancer surgery: ~¥3-5M (3) Comprehensive treatment (surgery + chemo + radiation): ~¥15-20M. Additional costs include service fees, medical interpretation, flights, and accommodation. Foreign patients cannot use Japan\'s national health insurance and must pay in full. We provide detailed cost estimates during initial consultation.',
    },
  },
  {
    category: 'cancer',
    question: {
      ja: '日本語ができなくても大丈夫ですか？病院に中国語サービスはありますか？',
      'zh-TW': '赴日就醫語言不通怎麼辦？醫院有中文服務嗎？',
      'zh-CN': '赴日就医语言不通怎么办？医院有中文服务吗？',
      en: 'What about language barriers? Is Chinese language support available?',
    },
    answer: {
      ja: '言語サポートは万全です：（1）医学知識を持つ日中バイリンガル医療通訳が問診・検査・治療説明のすべてに同席（2）一部の大病院（がん研有明病院、国立国際医療研究センター等）には中国語コーディネーターが常駐（3）診療記録は事前に専門医療翻訳者が日本語に翻訳し、医学的な正確性を確保（4）当社が全行程の通訳手配と入退院時のサポートを行います。一般的な観光通訳では医療場面の正確なコミュニケーションは困難なため、医療通訳資格を持つ専門スタッフの利用を強くお勧めします。',
      'zh-TW': '語言問題已有成熟解決方案：（1）我們安排具有醫學背景的中日雙語翻譯全程陪同，從問診、檢查到治療方案說明均有翻譯在場（2）部分大型醫院（如癌研有明病院、國立國際醫療研究中心等）設有國際患者服務部門，配備中文協調員（3）病歷資料會由專業醫療翻譯事先翻譯為日文並經醫學審核（4）我們提供入院到出院的全程語言支援。普通旅遊翻譯無法滿足醫學場景的精準溝通需求，強烈建議使用具有醫療翻譯資質的專業人員。',
      'zh-CN': '语言问题已有成熟解决方案：（1）我们安排具有医学背景的中日双语翻译全程陪同，从问诊、检查到治疗方案说明均有翻译在场（2）部分大型医院（如癌研有明病院、国立国际医疗研究中心等）设有国际患者服务部门，配备中文协调员（3）病历资料会由专业医疗翻译事先翻译为日文并经医学审核（4）我们提供入院到出院的全程语言支援。普通旅游翻译无法满足医学场景的精准沟通需求，强烈建议使用具有医疗翻译资质的专业人员。',
      en: 'Language support is comprehensive: (1) We arrange bilingual medical interpreters with medical knowledge for all consultations and procedures (2) Some major hospitals have Chinese coordinators in their international patient departments (3) Medical records are professionally translated and medically verified before submission (4) We provide full language support from admission to discharge. General tourism interpreters cannot handle medical precision—we strongly recommend certified medical interpreters.',
    },
  },
  // ===== Health Checkup =====
  {
    category: 'checkup',
    question: {
      ja: '日本の人間ドックには何が含まれますか？中国の健康診断と何が違いますか？',
      'zh-TW': '日本高端體檢一般包含哪些項目？與國內體檢有什麼不同？',
      'zh-CN': '日本高端体检一般包含哪些项目？与国内体检有什么不同？',
      en: 'What does a Japanese premium health checkup include? How does it differ from Chinese checkups?',
    },
    answer: {
      ja: '日本の人間ドック（総合健診）は通常以下を含みます：基礎検査（血圧、体脂肪率等）、血液検査（肝腎機能、脂質、腫瘍マーカー等）、尿検査、心電図、腹部超音波、胸部CT、胃カメラ、甲状腺超音波、眼底検査、肺機能検査など。ハイグレードプランではPET-CT全身腫瘍スクリーニング、頭部MRI/MRA、大腸内視鏡も選択可能です。中国との主な違い：（1）CT・MRIの分解能がミリ単位で極めて精密（2）胃カメラが標準で、経鼻法や鎮静法で苦痛が少ない（3）マンツーマンの専属サポート、すべて中国語対応（4）報告書に詳細な健康アドバイスとフォローアップ計画を添付。',
      'zh-TW': '日本高端體檢（人間ドック）通常包含：基礎檢查（血壓、體脂率等）、血液檢查（肝腎功能、血脂、腫瘤標誌物等）、尿檢、心電圖、腹部超聲波、胸部CT、胃鏡、甲狀腺超聲波、眼底檢查、肺功能等。高端套餐可加選PET-CT全身腫瘤篩查、頭部MRI/MRA、大腸鏡。與國內體檢的主要區別：（1）影像設備分辨率達毫米級，可發現極早期病變（2）胃鏡是標配，日本醫生操作技術精湛，可選無痛胃鏡（3）全程一對一專屬服務，配備中文醫療翻譯（4）報告附詳細健康建議和後續隨訪方案。',
      'zh-CN': '日本高端体检（人间Dock/综合体检）通常包含：基础检查（血压、体脂率等）、血液检查（肝肾功能、血脂、肿瘤标志物等）、尿检、心电图、腹部超声波、胸部CT、胃镜、甲状腺超声波、眼底检查、肺功能等。高端套餐可加选PET-CT全身肿瘤筛查、头部MRI/MRA、大肠镜。与国内体检的主要区别：（1）影像设备分辨率达毫米级，可发现极早期病变（2）胃镜是标配，日本医生操作技术精湛，可选无痛胃镜（3）全程一对一专属服务，配备中文医疗翻译（4）报告附详细健康建议和后续随访方案。',
      en: 'Japanese premium health checkups (Ningen Dock) typically include: basic measurements, blood tests (liver/kidney function, lipids, tumor markers), urinalysis, ECG, abdominal ultrasound, chest CT, gastroscopy, thyroid ultrasound, fundoscopy, and pulmonary function tests. Premium packages add PET-CT, brain MRI/MRA, and colonoscopy. Key differences from Chinese checkups: (1) Millimeter-level imaging resolution for ultra-early detection (2) Gastroscopy is standard, with painless sedation options (3) One-on-one service with Chinese medical interpreter (4) Reports include detailed health advice and follow-up plans.',
    },
  },
  {
    category: 'checkup',
    question: {
      ja: 'PET-CT検査は必須ですか？どのような方に適していますか？',
      'zh-TW': 'PET-CT 檢查是必須做的嗎？適合什麼人群？',
      'zh-CN': 'PET-CT检查是必须做的吗？适合什么人群？',
      en: 'Is PET-CT mandatory? Who is it suitable for?',
    },
    answer: {
      ja: 'PET-CTは必須ではありませんが、がんの早期発見に有効な検査です。がん細胞が正常細胞の3-8倍のブドウ糖を取り込む特性を利用し、全身の代謝異常部位を検出します。推奨対象：（1）40-70歳の方（2）がんの家族歴がある方（3）長期喫煙・飲酒者（4）腫瘍の全身への転移評価が必要な方。ただし5mm以下の微小腫瘍や一部の低代謝腫瘍には限界があるため、通常の検査を補完する位置づけです。費用は約7-10万円（人民元で約3,500〜5,000元）。当社では受診者の年齢・病歴に応じて最適なプランをご提案します。',
      'zh-TW': 'PET-CT 並非人人必做，但對癌症早期篩查非常有效。原理是利用癌細胞吸收葡萄糖能力比正常細胞強3-8倍的特點來掃描全身。適合人群：（1）40-70歲人群（2）有癌症家族史者（3）長期吸煙飲酒者（4）已確診腫瘤需評估全身轉移情況的患者。但需注意，PET-CT 對早期微小腫瘤（小於5mm）和某些低代謝腫瘤的檢出率有限，因此更適合作為綜合體檢的補充。費用約7-10萬日元（折合人民幣約3500-5000元）。我們會根據您的年齡和病史推薦最適合的套餐。',
      'zh-CN': 'PET-CT 并非人人必做，但对癌症早期筛查非常有效。原理是利用癌细胞吸收葡萄糖能力比正常细胞强3-8倍的特点来扫描全身。适合人群：（1）40-70岁人群（2）有癌症家族史者（3）长期吸烟饮酒者（4）已确诊肿瘤需评估全身转移情况的患者。但需注意，PET-CT 对早期微小肿瘤（小于5mm）和某些低代谢肿瘤的检出率有限，因此更适合作为综合体检的补充。费用约7-10万日元（折合人民币约3500-5000元）。我们会根据您的年龄和病史推荐最适合的套餐。',
      en: 'PET-CT is not mandatory but very effective for early cancer screening. It detects metabolic abnormalities since cancer cells absorb 3-8x more glucose than normal cells. Recommended for: (1) Ages 40-70 (2) Family history of cancer (3) Long-term smokers/drinkers (4) Patients needing metastasis assessment. Limitations exist for tumors under 5mm and some low-metabolism types. Cost: ~¥70,000-100,000. We recommend the optimal package based on your age and medical history.',
    },
  },
  {
    category: 'checkup',
    question: {
      ja: '人間ドックの予約はどのくらい前に必要ですか？当日の注意事項は？',
      'zh-TW': '體檢需要提前多久預約？當天有什麼注意事項？',
      'zh-CN': '体检需要提前多久预约？当天有什么注意事项？',
      en: 'How far in advance should I book? What should I prepare for the day?',
    },
    answer: {
      ja: '国際予約・ビザ手続き・問診票準備等を含め、4-6週間前のご予約をお勧めします。春・秋のシーズンはさらに早めのご予約が安心です。当日の注意：（1）前日21時以降は絶食、当日朝は飲食不可（少量の水は可）。PET-CT検査は6時間以上の絶食が必須（2）前日の激しい運動・飲酒は避ける（3）脱着しやすいゆったりした服装で、金属アクセサリーは外す（4）過去の検査結果があればお持ちください。検査時間は半日〜1日、結果は約3-4週間後に中国語レポートを国際郵便でお届けします。',
      'zh-TW': '由於涉及國際預約、簽證辦理和問診材料準備，建議提前4-6週預約。春秋旺季建議更早。當天注意事項：（1）體檢前一晚9點後禁食，當天禁食禁水（可少量飲白開水），PET-CT 需嚴格空腹至少6小時（2）前一天避免劇烈運動和飲酒（3）穿寬鬆易穿脫衣物，避免金屬飾品（4）攜帶既往檢查報告供醫生參考。體檢過程約半天到一天，結果約3-4週後通過國際快遞送達中文翻譯版報告。',
      'zh-CN': '由于涉及国际预约、签证办理和问诊材料准备，建议提前4-6周预约。春秋旺季建议更早。当天注意事项：（1）体检前一晚9点后禁食，当天禁食禁水（可少量饮白开水），PET-CT 需严格空腹至少6小时（2）前一天避免剧烈运动和饮酒（3）穿宽松易穿脱衣物，避免金属饰品（4）携带既往检查报告供医生参考。体检过程约半天到一天，结果约3-4周后通过国际快递送达中文翻译版报告。',
      en: 'We recommend booking 4-6 weeks in advance due to international scheduling, visa processing, and questionnaire preparation. Tips for the day: (1) Fast after 9 PM the night before; PET-CT requires 6+ hours fasting (2) Avoid strenuous exercise and alcohol the day before (3) Wear loose, comfortable clothing without metal accessories (4) Bring previous medical reports. The checkup takes half to one full day, with Chinese-translated results delivered by international courier in 3-4 weeks.',
    },
  },
  {
    category: 'checkup',
    question: {
      ja: '人間ドックの費用はどのくらいかかりますか？',
      'zh-TW': '日本體檢費用大概是多少？',
      'zh-CN': '日本体检费用大概是多少？',
      en: 'How much does a health checkup in Japan cost?',
    },
    answer: {
      ja: 'プラン内容により異なります。参考価格：（1）基本人間ドック（半日）：約5-8万円 — 血液検査、超音波、心電図、胸部X線等（2）標準プラン（胃カメラ含む）：約8-12万円（3）がんスクリーニング（PET-CT＋MRI）：約15-25万円（4）最上級全身精密検査：約30-50万円 — PET-CT、全身MRI、脳MRI/MRA、胃大腸内視鏡等を全て含む。上記は純粋な検査費用で、航空券・宿泊・通訳費は含みません。当社では通訳同行・送迎・宿泊手配込みのワンストップパッケージもご用意しています。',
      'zh-TW': '費用因套餐內容不同差異較大。參考價格：（1）基礎人間ドック（半日）：約5-8萬日元（折合人民幣2500-4000元）——血液、超聲波、心電圖、胸部X線等（2）標準套餐（含胃鏡）：約8-12萬日元（3）癌症篩查套餐（PET-CT + MRI）：約15-25萬日元（4）頂級全身精密檢查：約30-50萬日元——含PET-CT、全身MRI、腦MRI/MRA、胃腸鏡等全部項目。以上為純體檢費用，不含機票、住宿和翻譯。我們提供包含翻譯陪同、接送、住宿安排的一站式套餐。',
      'zh-CN': '费用因套餐内容不同差异较大。参考价格：（1）基础人间Dock（半日）：约5-8万日元（折合人民币2500-4000元）——血液、超声波、心电图、胸部X线等（2）标准套餐（含胃镜）：约8-12万日元（3）癌症筛查套餐（PET-CT + MRI）：约15-25万日元（4）顶级全身精密检查：约30-50万日元——含PET-CT、全身MRI、脑MRI/MRA、胃肠镜等全部项目。以上为纯体检费用，不含机票、住宿和翻译。我们提供包含翻译陪同、接送、住宿安排的一站式套餐。',
      en: 'Costs vary by package: (1) Basic Ningen Dock (half-day): ~¥50,000-80,000 (2) Standard with gastroscopy: ~¥80,000-120,000 (3) Cancer screening (PET-CT + MRI): ~¥150,000-250,000 (4) Comprehensive full-body: ~¥300,000-500,000 including PET-CT, full-body MRI, brain MRI/MRA, and endoscopies. These are checkup-only prices, excluding flights, accommodation, and interpretation. We offer all-inclusive packages with interpreter, transfers, and hotel arrangements.',
    },
  },
  // ===== Golf =====
  {
    category: 'golf',
    question: {
      ja: '日本にはどんな有名なゴルフ場がありますか？',
      'zh-TW': '日本有哪些著名的高爾夫球場值得打？',
      'zh-CN': '日本有哪些著名的高尔夫球场值得打？',
      en: 'What famous golf courses does Japan have?',
    },
    answer: {
      ja: '日本には2,600以上のゴルフ場があり、世界的な名コースも多数あります。おすすめ：（1）廣野ゴルフ倶楽部（兵庫）—各種ランキングで日本1位評価、アジアでも最高評価（完全会員制）（2）川奈ホテルゴルフコース・富士コース（静岡）—富士山と太平洋を望む絶景コース、ホテル宿泊者予約可（3）太平洋クラブ御殿場コース—プロトーナメント開催コース（4）那覇空港からアクセスの良い沖縄コース—年中プレー可能。当社ではお客様のレベルやご希望に合わせて最適なコースをご提案し、予約から送迎まで一括手配いたします。',
      'zh-TW': '日本擁有超過2600家高爾夫球場，其中不乏知名球場。推薦：（1）廣野高爾夫俱樂部（兵庫縣）——各大排名中位居日本第一，純會員制（2）川奈酒店高爾夫·富士球場（靜岡縣）——可遠眺富士山和太平洋，酒店住客可預約（3）太平洋俱樂部·御殿場球場——多次舉辦職業賽事（4）沖繩球場——四季皆可打球，海景絕佳。我們會根據您的水平和偏好推薦最適合的球場，從預約到接送全程安排。',
      'zh-CN': '日本拥有超过2600家高尔夫球场，其中不乏知名球场。推荐：（1）广野高尔夫俱乐部（兵库县）——各大排名中位居日本第一，纯会员制（2）川奈酒店高尔夫·富士球场（静冈县）——可远眺富士山和太平洋，酒店住客可预约（3）太平洋俱乐部·御殿场球场——多次举办职业赛事（4）冲绳球场——四季皆可打球，海景绝佳。我们会根据您的水平和偏好推荐最适合的球场，从预约到接送全程安排。',
      en: 'Japan has over 2,600 golf courses with many renowned options: (1) Hirono Golf Club (Hyogo) — consistently ranked #1 in Japan by major golf publications, members-only (2) Kawana Hotel Golf Course Fuji Course (Shizuoka) — stunning Mt. Fuji & Pacific views, hotel guests can book (3) Taiheiyo Club Gotemba — hosts professional tournaments (4) Okinawa courses — playable year-round with ocean views. We recommend the best course for your level and handle everything from booking to transfers.',
    },
  },
  {
    category: 'golf',
    question: {
      ja: '外国人はどのようにゴルフ場を予約できますか？',
      'zh-TW': '外國人如何預約日本的高爾夫球場？',
      'zh-CN': '外国人如何预约日本的高尔夫球场？',
      en: 'How can foreigners book golf courses in Japan?',
    },
    answer: {
      ja: '日本のゴルフ場予約は主に以下の方法があります：（1）楽天GORAやGDO等のオンライン予約サイト（日本語のみ）（2）当社のようなゴルフ旅行専門サービスに代行予約を依頼（最もスムーズ）（3）ホテルのコンシェルジュに依頼（4）直接電話予約（日本語対応が必要）。予約時期の目安：一般のパブリックコースは3日以上前、名門・会員制コースは1ヶ月以上前。一部の会員制コースは非会員の予約不可で、会員の同伴が必要です。お支払いは現金またはクレジットカード対応、中国系モバイル決済は原則不可。当社では予約代行からスタート時間の調整まで全て対応いたします。',
      'zh-TW': '日本高爾夫球場預約方式：（1）通過樂天GORA、GDO等網站在線預約——但大部分僅支持日語（2）通過我們這樣的專業高爾夫旅行服務公司代為預約（最順暢的方式）（3）通過入住酒店的禮賓部代約（4）電話直接聯繫球場——需要日語。預約建議：普通球場至少提前3天以上（週末/節假日更早），名門會員制球場需提前1個月以上。部分高端會員制球場不接受非會員預約，需會員帶客。支付方面，多數球場接受現金和信用卡，微信支付寶等基本無法使用。',
      'zh-CN': '日本高尔夫球场预约方式：（1）通过乐天GORA、GDO等网站在线预约——但大部分仅支持日语（2）通过我们这样的专业高尔夫旅行服务公司代为预约（最顺畅的方式）（3）通过入住酒店的礼宾部代约（4）电话直接联系球场——需要日语。预约建议：普通球场至少提前3天以上（周末/节假日更早），名门会员制球场需提前1个月以上。部分高端会员制球场不接受非会员预约，需会员带客。支付方面，多数球场接受现金和信用卡，微信支付宝等基本无法使用。',
      en: 'Booking methods: (1) Japanese booking sites like Rakuten GORA or GDO (Japanese only) (2) Through our professional golf travel service (smoothest option) (3) Hotel concierge (4) Direct phone booking (Japanese required). Timing: public courses 3+ days ahead, prestigious/member courses 1+ month ahead. Some exclusive clubs require member accompaniment. Payment is typically cash or credit card; Chinese mobile payments are generally not accepted.',
    },
  },
  {
    category: 'golf',
    question: {
      ja: '日本のゴルフ場の服装規定やマナーは？',
      'zh-TW': '日本打高爾夫有什麼著裝要求和禮儀規範？',
      'zh-CN': '日本打高尔夫有什么着装要求和礼仪规范？',
      en: 'What are the dress codes and etiquette rules at Japanese golf courses?',
    },
    answer: {
      ja: '日本のゴルフ場はマナーに厳格です。服装：（1）襟付き袖付きのシャツを着用し、裾はパンツにイン（2）ジーンズ・サンダル・スニーカー・ノースリーブ禁止（3）ソフトスパイクまたはスパイクレスの専用シューズ（金属スパイク禁止）（4）名門クラブではクラブハウスへの入退場時にジャケット着用が必要。マナー：（1）スタート時間の30-60分前に到着（2）各ホール15分以内のプレーペース維持（3）グリーンのボールマーク修復・バンカーならし必須（4）携帯電話はマナーモード/電源OFF（5）コース内での大声禁止。日本特有の慣習として、前半9ホール終了後に約1時間の昼食休憩があります。',
      'zh-TW': '日本對高爾夫禮儀要求非常嚴格。著裝：（1）必須穿有領有袖上衣，上衣紮進褲子（2）禁止牛仔褲、運動褲、拖鞋、無袖上衣（3）球鞋必須為軟釘或無釘（禁止金屬釘鞋）（4）名門俱樂部進出會館需穿西裝外套。禮儀：（1）提前30-60分鐘到場（2）每洞控制在15分鐘以內（3）打完每洞修復果嶺球痕和沙坑（4）手機靜音或關機（5）球場內禁止大聲喧嘩。日本特有習慣：前9洞與後9洞之間有約1小時的午餐休息時間。',
      'zh-CN': '日本对高尔夫礼仪要求非常严格。着装：（1）必须穿有领有袖上衣，上衣扎进裤子（2）禁止牛仔裤、运动裤、拖鞋、无袖上衣（3）球鞋必须为软钉或无钉（禁止金属钉鞋）（4）名门俱乐部进出会馆需穿西装外套。礼仪：（1）提前30-60分钟到场（2）每洞控制在15分钟以内（3）打完每洞修复果岭球痕和沙坑（4）手机静音或关机（5）球场内禁止大声喧哗。日本特有习惯：前9洞与后9洞之间有约1小时的午餐休息时间。',
      en: 'Japanese golf courses have strict etiquette. Dress code: (1) Collared shirts tucked into pants (2) No jeans, athletic pants, sandals, or sleeveless tops (3) Soft-spike or spikeless golf shoes only (4) Jacket required at prestigious clubs. Etiquette: (1) Arrive 30-60 minutes early (2) Keep pace under 15 minutes per hole (3) Repair divots and rake bunkers (4) Phones on silent/off (5) No loud talking. A Japanese tradition: there\'s a ~1-hour lunch break between the front and back nine.',
    },
  },
  {
    category: 'golf',
    question: {
      ja: '最適なシーズンや費用の目安は？キャディは付きますか？',
      'zh-TW': '日本打高爾夫最佳季節和費用？有球童嗎？',
      'zh-CN': '日本打高尔夫最佳季节和费用？有球童吗？',
      en: 'What is the best season and cost? Are caddies available?',
    },
    answer: {
      ja: 'ベストシーズンは春（4-5月、桜）と秋（10-11月、紅葉）。夏は北海道が人気、冬は沖縄が最適。費用目安：平日パブリックコース約8,000-15,000円/人、週末約12,000-25,000円/人、名門コース約30,000-80,000円/人。キャディ：上位コースでは予約時にリクエスト可能（約10,000-15,000円/組・4名共有）。日本のキャディはコースを熟知しており、距離やライン読みのアドバイスも的確です。なお、日本にはチップの習慣はなく、キャディ料金は総額に含まれます。別途、昼食代、ロッカー代、入湯税等の少額費用がかかります。',
      'zh-TW': '最佳季節為春季（4-5月，櫻花季）和秋季（10-11月，紅葉季）。夏季北海道是熱門選擇，冬季沖繩全年可打。費用參考：平日公眾球場約8000-15000日元/人（400-750元），週末約12000-25000日元/人，名門球場約30000-80000日元/人。球童：中高端球場可預約申請（約10000-15000日元/組，4人共享一名），日本球童素質極高，能提供精準碼數和果嶺讀線建議。日本沒有給小費的習慣，球童費已包含在內。另需準備午餐費、更衣櫃費和入浴稅等小額費用。',
      'zh-CN': '最佳季节为春季（4-5月，樱花季）和秋季（10-11月，红叶季）。夏季北海道是热门选择，冬季冲绳全年可打。费用参考：平日公众球场约8000-15000日元/人（400-750元），周末约12000-25000日元/人，名门球场约30000-80000日元/人。球童：中高端球场可预约申请（约10000-15000日元/组，4人共享一名），日本球童素质极高，能提供精准码数和果岭读线建议。日本没有给小费的习惯，球童费已包含在内。另需准备午餐费、更衣柜费和入浴税等小额费用。',
      en: 'Best seasons: spring (Apr-May, cherry blossoms) and autumn (Oct-Nov, fall foliage). Hokkaido for summer, Okinawa year-round. Costs: weekday public courses ~¥8,000-15,000/person, weekends ~¥12,000-25,000, premium courses ~¥30,000-80,000. Caddies: available at mid-high end courses (~¥10,000-15,000/group of 4), highly skilled with precise yardage and green-reading advice. No tipping in Japan. Additional small fees apply for lunch, locker, and bathing tax.',
    },
  },
  // ===== Business Tour =====
  {
    category: 'business',
    question: {
      ja: '日本ではどのような業界・企業を視察できますか？',
      'zh-TW': '日本商務考察可以參觀哪些行業和企業？',
      'zh-CN': '日本商务考察可以参观哪些行业和企业？',
      en: 'What industries and companies can be visited in Japan?',
    },
    answer: {
      ja: '人気の視察テーマ：（1）リーン製造・自動車産業—トヨタ工場見学とTPS（トヨタ生産方式）体験（2）経営管理—京セラのアメーバ経営研修、パナソニックの経営理念研修（3）スマートファクトリー—ファナック（FANUC）ロボット工場、オムロンのオートメーション工場（4）製品設計—TOTO工場見学（多品種少量生産のモデルケース）（5）小売・サービス—セブンイレブンのサプライチェーン管理（6）医療・介護—先進病院や介護施設の見学（7）農業・食品—高品質農業・食品安全の取り組み。お客様の業種や学習目標に合わせ、テクノパーク・大学・研究機関の視察も手配可能です。',
      'zh-TW': '熱門考察方向：（1）精益製造/汽車工業——豐田工廠參觀及TPS豐田生產方式體驗（2）經營管理——京瓷阿米巴經營學習、松下經營理念研修（3）智能製造——發那科（FANUC）機器人工廠、歐姆龍自動化工廠（4）產品設計——TOTO工廠（多品種小批量典範）（5）零售/服務業——7-11便利店供應鏈管理（6）醫療/健康產業——日本知名醫院和養老設施參觀（7）農業/食品——精品農業、食品安全體系考察。我們會根據您的行業背景和學習目標深度定製行程。',
      'zh-CN': '热门考察方向：（1）精益制造/汽车工业——丰田工厂参观及TPS丰田生产方式体验（2）经营管理——京瓷阿米巴经营学习、松下经营理念研修（3）智能制造——发那科（FANUC）机器人工厂、欧姆龙自动化工厂（4）产品设计——TOTO工厂（多品种小批量典范）（5）零售/服务业——7-11便利店供应链管理（6）医疗/健康产业——日本知名医院和养老设施参观（7）农业/食品——精品农业、食品安全体系考察。我们会根据您的行业背景和学习目标深度定制行程。',
      en: 'Popular study themes: (1) Lean manufacturing — Toyota factory tour & TPS experience (2) Management — Kyocera Amoeba Management, Panasonic philosophy (3) Smart manufacturing — FANUC robotics, Omron automation (4) Product design — TOTO factory (multi-variety small-batch model) (5) Retail — 7-Eleven supply chain (6) Healthcare — hospital & elderly care facilities (7) Agriculture & food safety systems. We customize itineraries based on your industry and learning objectives.',
    },
  },
  {
    category: 'business',
    question: {
      ja: '商用ビザの取得方法と必要書類は？',
      'zh-TW': '商務考察簽證如何辦理？需要什麼材料？',
      'zh-CN': '商务考察签证如何办理？需要什么材料？',
      en: 'How do I get a business visa? What documents are needed?',
    },
    answer: {
      ja: '「短期滞在ビザ（商用目的）」を申請します。必要書類：【申請者側】パスポート原本・申請書・証明写真・在職証明書・会社営業許可証コピー・訪問者名簿。【日本側（招へい元）】招へい理由書（訪問目的と日程）・滞在予定表・身元保証書・会社登記事項証明書。審査は通常5-7営業日で、有効期間90日、1回の滞在は最長15日または30日。2-3週間前のご準備をお勧めします。当社が招へい状の発行から申請サポートまで一括で対応いたします。',
      'zh-TW': '通常申請「短期商用簽證」。所需材料分三部分：【申請人】護照原件、簽證申請表、照片、在職證明、公司營業執照副本、申請人名簿。【日本邀請方需提供】招聘理由書（說明邀請目的和行程）、滯在預定表（詳細日程）、身元保證書、邀請方公司登記證明。審核一般需5-7個工作日，建議提前2-3週準備。商務簽證有效期90天，單次停留最長15天或30天。我們提供邀請函開具和簽證申請全程協助。',
      'zh-CN': '通常申请"短期商用签证"。所需材料分三部分：【申请人】护照原件、签证申请表、照片、在职证明、公司营业执照副本、申请人名簿。【日本邀请方需提供】招聘理由书（说明邀请目的和行程）、滞在预定表（详细日程）、身元保证书、邀请方公司登记证明。审核一般需5-7个工作日，建议提前2-3周准备。商务签证有效期90天，单次停留最长15天或30天。我们提供邀请函开具和签证申请全程协助。',
      en: 'Apply for a "Short-term Business Visa." Required documents: [Applicant] passport, application form, photo, employment certificate, business license. [Japanese inviter] invitation letter with purpose/itinerary, schedule, guarantor letter, company registration. Processing: 5-7 business days; validity: 90 days, max stay 15 or 30 days. Plan 2-3 weeks ahead. We handle invitation letters and full visa application support.',
    },
  },
  {
    category: 'business',
    question: {
      ja: '視察行程はどのように組まれますか？カスタマイズは可能ですか？',
      'zh-TW': '考察行程一般怎麼安排？可以定制嗎？',
      'zh-CN': '考察行程一般怎么安排？可以定制吗？',
      en: 'How are itineraries arranged? Can they be customized?',
    },
    answer: {
      ja: '標準的なビジネス視察は5-7日間、2-3都市をカバーします。典型例：1日目—来日・オリエンテーション、2-3日目—企業視察（1日1-2社、工場見学・経営層との意見交換・事例紹介）、4日目—専門研修または大学交流、5日目—文化体験（茶道・伝統工芸等）、6日目—都市間移動または追加視察、7日目—総括会・帰国。行程は完全カスタマイズ可能です。当社はお客様の業種・目的に合わせ、企業アポイント調整・専門通訳手配・交通宿泊・ビザサポートまでワンストップでご提供。標準グループ（10〜30名）から少人数VIPグループ（5名以下）まで対応しています。',
      'zh-TW': '標準行程一般5-7天，覆蓋2-3個城市。典型安排：第1天——抵達日本、行程說明會；第2-3天——企業參訪（每天1-2家，含工廠車間參觀、管理層座談、案例分享）；第4天——專題研修或大學交流；第5天——文化體驗（茶道、傳統工藝等）；第6天——城市間移動或補充參訪；第7天——總結分享會、返程。行程完全可以根據您的行業背景和學習目標深度定製。我們提供從行程設計、企業對接、翻譯陪同、交通住宿到簽證的一站式服務，支持10-30人標準團和5人以下VIP小團。',
      'zh-CN': '标准行程一般5-7天，覆盖2-3个城市。典型安排：第1天——抵达日本、行程说明会；第2-3天——企业参访（每天1-2家，含工厂车间参观、管理层座谈、案例分享）；第4天——专题研修或大学交流；第5天——文化体验（茶道、传统工艺等）；第6天——城市间移动或补充参访；第7天——总结分享会、返程。行程完全可以根据您的行业背景和学习目标深度定制。我们提供从行程设计、企业对接、翻译陪同、交通住宿到签证的一站式服务，支持10-30人标准团和5人以下VIP小团。',
      en: 'Standard tours run 5-7 days across 2-3 cities. Typical schedule: Day 1 — arrival & orientation; Days 2-3 — company visits (1-2/day: factory tours, executive talks, case studies); Day 4 — specialized training or university exchange; Day 5 — cultural experiences; Day 6 — city transfer or additional visits; Day 7 — wrap-up & departure. Fully customizable to your industry and goals. We provide end-to-end service including scheduling, interpretation, logistics, and visa support for groups of 5-30+.',
    },
  },
  {
    category: 'business',
    question: {
      ja: 'ビジネス視察の費用はどのくらいですか？',
      'zh-TW': '商務考察的費用大概是多少？',
      'zh-CN': '商务考察的费用大概是多少？',
      en: 'How much does a business study tour cost?',
    },
    answer: {
      ja: '費用は行程・企業レベル・団体規模により異なります。参考価格：（1）標準グループ（10〜20名、5〜7日間）：約2〜4万人民元/人 — 企業視察費・通訳・国内交通・宿泊・一部食事含む（2）ハイエンドカスタムグループ（5〜10名、6〜8日間、一流企業の集中視察）：約5〜8万人民元/人（3）VIP少人数グループ（3〜5名）：約8〜15万人民元/人。上記は国際航空券・ビザ費用を含みません。企業視察費が主要コストの一つで、有名企業（トヨタ等）の正式な視察受け入れには相応の調整費が必要です。当社では予算に応じた最適なプランをご提案します。2-3ヶ月前からの準備をお勧めします。',
      'zh-TW': '費用因行程、企業級別和團組規模不同差異較大。參考價格：（1）標準團（10-20人，5-7天）：約2-4萬元人民幣/人——含企業參訪費、翻譯、日本境內交通、住宿和部分餐飲（2）高端定製團（5-10人，6-8天，頂級企業深度參訪）：約5-8萬元/人（3）VIP小團（3-5人）：約8-15萬元/人。以上不含國際機票和簽證費。建議提前2-3個月啟動籌備，以預留充足時間進行企業對接和簽證辦理。',
      'zh-CN': '费用因行程、企业级别和团组规模不同差异较大。参考价格：（1）标准团（10-20人，5-7天）：约2-4万元人民币/人——含企业参访费、翻译、日本境内交通、住宿和部分餐饮（2）高端定制团（5-10人，6-8天，顶级企业深度参访）：约5-8万元/人（3）VIP小团（3-5人）：约8-15万元/人。以上不含国际机票和签证费。建议提前2-3个月启动筹备，以预留充足时间进行企业对接和签证办理。',
      en: 'Costs vary by itinerary, company tier, and group size. Reference: (1) Standard group (10-20 people, 5-7 days): ~¥20,000-40,000 CNY/person including visits, interpretation, domestic transport, accommodation (2) Premium custom (5-10 people, 6-8 days): ~¥50,000-80,000/person (3) VIP small group (3-5 people): ~¥80,000-150,000/person. International flights and visa fees not included. We recommend starting preparations 2-3 months in advance.',
    },
  },
  // ===== Ground Service =====
  {
    category: 'ground',
    question: {
      ja: 'ランドオペレーターサービスにはどのようなものが含まれますか？',
      'zh-TW': '日本地接服務具體包含哪些內容？',
      'zh-CN': '日本地接服务具体包含哪些内容？',
      en: 'What does Japan ground handling service include?',
    },
    answer: {
      ja: 'ランドオペレーターサービスは訪日のお客様へのワンストップサービスです：（1）空港送迎—中国語対応ドライバーがネームボードでお出迎え（2）ホテル手配—予算・好みに合わせたホテルや温泉旅館の予約（3）専用車チャーター—トヨタアルファードなどのミニバン・ワゴン車をドライバー付きで手配（4）プランニング—旅行・ビジネス・健診等のオーダーメイド行程作成（5）中国語ガイド—通訳案内士資格を持つ中国語ガイドの手配（6）レストラン予約—ミシュラン星付き店や名店の代行予約（7）体験予約—茶道・着物体験等の手配（8）24時間対応の中国語緊急サポート。',
      'zh-TW': '日本地接服務是為赴日客人提供的一站式落地服務：（1）機場接送——安排中文司機在成田/羽田/關西等機場接機（2）酒店預訂——根據預算和偏好代訂酒店或日式溫泉旅館（3）包車服務——提供豐田阿爾法德等商務車，含中文司機（4）行程規劃——定製旅遊/商務/體檢等行程方案（5）中文導遊——安排持日本導遊資格證的中文導遊陪同（6）餐廳預約——代訂米其林星級餐廳、壽司名店等（7）體驗預約——茶道、和服體驗等（8）24小時中文緊急聯繫熱線。',
      'zh-CN': '日本地接服务是为赴日客人提供的一站式落地服务：（1）机场接送——安排中文司机在成田/羽田/关西等机场接机（2）酒店预订——根据预算和偏好代订酒店或日式温泉旅馆（3）包车服务——提供丰田阿尔法德等商务车，含中文司机（4）行程规划——定制旅游/商务/体检等行程方案（5）中文导游——安排持日本导游资格证的中文导游陪同（6）餐厅预约——代订米其林星级餐厅、寿司名店等（7）体验预约——茶道、和服体验等（8）24小时中文紧急联系热线。',
      en: 'Japan ground service is a one-stop landing service: (1) Airport transfers with Chinese-speaking drivers (2) Hotel booking — hotels or traditional ryokan/onsen based on budget (3) Charter car service — Toyota Alphard etc. with Chinese driver (4) Itinerary planning — custom travel/business/medical schedules (5) Chinese guides with Japanese guide certification (6) Restaurant reservations including Michelin-starred venues (7) Experience bookings — tea ceremony, kimono, etc. (8) 24/7 Chinese emergency hotline.',
    },
  },
  {
    category: 'ground',
    question: {
      ja: '専用車チャーターの費用と車種は？',
      'zh-TW': '包車服務費用和車型？',
      'zh-CN': '包车服务费用和车型？',
      en: 'What are the charter car costs and vehicle options?',
    },
    answer: {
      ja: '車種・時間別の参考料金：（1）5人乗りセダン（トヨタクラウン等）：約25,000-30,000円/10時間（2）7人乗りミニバン（トヨタアルファード）：約35,000-45,000円/10時間（3）9人乗りワゴン：約40,000-50,000円/10時間（4）大型バス（20-45人乗り）：約80,000-150,000円/日。上記は燃料費・ドライバー料込み、高速料金・駐車場代は実費別途。超過料金は約3,000-5,000円/時間。タクシー（成田→東京市内で約2-3万円）と比較しても、チャーター車はコストパフォーマンスが高く、中国語対応・車内ゆったり・スケジュールの自由度の点でお勧めです。',
      'zh-TW': '按車型和時長計算，參考價格：（1）5座轎車（豐田皇冠等）：約25000-30000日元/10小時（折合人民幣1250-1500元）（2）7座商務MPV（豐田阿爾法德）：約35000-45000日元/10小時（3）9座商務車：約40000-50000日元/10小時（4）大巴（20-45座）：約80000-150000日元/天。以上含燃油費和司機費，高速公路費和停車費另計。超時約3000-5000日元/小時。相比打出租車（如成田到東京市區約2-3萬日元），包車更划算且有中文服務。',
      'zh-CN': '按车型和时长计算，参考价格：（1）5座轿车（丰田皇冠等）：约25000-30000日元/10小时（折合人民币1250-1500元）（2）7座商务MPV（丰田阿尔法德）：约35000-45000日元/10小时（3）9座商务车：约40000-50000日元/10小时（4）大巴（20-45座）：约80000-150000日元/天。以上含燃油费和司机费，高速公路费和停车费另计。超时约3000-5000日元/小时。相比打出租车（如成田到东京市区约2-3万日元），包车更划算且有中文服务。',
      en: 'Reference rates by vehicle: (1) 5-seat sedan (Toyota Crown): ~¥25,000-30,000/10hrs (2) 7-seat MPV (Toyota Alphard): ~¥35,000-45,000/10hrs (3) 9-seat van: ~¥40,000-50,000/10hrs (4) Coach (20-45 seats): ~¥80,000-150,000/day. Prices include fuel and driver; highway tolls and parking are extra. Overtime: ~¥3,000-5,000/hr. Compared to taxis (Narita to Tokyo ~¥20,000-30,000), charter cars offer better value with Chinese language service.',
    },
  },
  {
    category: 'ground',
    question: {
      ja: 'オーダーメイド行程は可能ですか？どうやって要望を伝えればいいですか？',
      'zh-TW': '可以安排定制行程嗎？如何對接需求？',
      'zh-CN': '可以安排定制行程吗？如何对接需求？',
      en: 'Can I get a customized itinerary? How do I communicate my needs?',
    },
    answer: {
      ja: 'もちろん可能です。オーダーメイド行程は当社の強みの一つです。ご依頼の流れ：（1）ヒアリング—WeChatまたはメールで人数・日程・予算・興味（グルメ/買い物/文化/自然/親子等）・特別なご要望（車椅子/チャイルドシート/ハラール食等）をお伺い（2）プラン作成—1-3営業日以内にカスタム行程案をお出しします（日別の詳細スケジュール・ホテル・費用見積り含む）（3）調整・確定—ご要望に合わせて修正を繰り返し、最終確定（4）お支払い—確定後にデポジット30-50%、残金は出発前または現地精算（5）現地実行—専属ドライバーガイドがスケジュール通りご案内、途中変更も柔軟に対応。観光・健診＋旅行・ゴルフ＋温泉・ビジネス＋文化体験など様々な組み合わせが可能です。',
      'zh-TW': '完全可以，定製行程是我們的核心優勢。對接流程：（1）需求溝通——通過微信或郵件告知出行人數、日期、預算、興趣偏好（美食/購物/文化/自然/親子等）和特殊需求（輪椅通道、兒童座椅、清真飲食等）（2）方案設計——1-3個工作日內出具定製行程方案，含每日詳細安排、推薦酒店、費用明細（3）確認調整——反覆溝通至滿意（4）確認付款——確認後支付定金30-50%，餘款出行前付清或現場結算（5）出行執行——全程由專屬司導按行程執行，期間可靈活調整。可涵蓋純觀光、體檢+旅遊、高爾夫+溫泉、商務考察+文化體驗等各種組合。',
      'zh-CN': '完全可以，定制行程是我们的核心优势。对接流程：（1）需求沟通——通过微信或邮件告知出行人数、日期、预算、兴趣偏好（美食/购物/文化/自然/亲子等）和特殊需求（轮椅通道、儿童座椅、清真饮食等）（2）方案设计——1-3个工作日内出具定制行程方案，含每日详细安排、推荐酒店、费用明细（3）确认调整——反复沟通至满意（4）确认付款——确认后支付定金30-50%，余款出行前付清或现场结算（5）出行执行——全程由专属司导按行程执行，期间可灵活调整。可涵盖纯观光、体检+旅游、高尔夫+温泉、商务考察+文化体验等各种组合。',
      en: 'Absolutely — custom itineraries are our specialty. Process: (1) Consultation — share group size, dates, budget, interests (food/shopping/culture/nature/family), and special needs via WeChat or email (2) Planning — we deliver a custom itinerary within 1-3 days with daily details, hotel suggestions, and cost breakdown (3) Refinement — iterate until perfect (4) Payment — 30-50% deposit, balance before departure or on-site (5) Execution — dedicated driver-guide follows the plan with flexible adjustments. Combinations include sightseeing, checkup + travel, golf + onsen, business + cultural experiences.',
    },
  },
  {
    category: 'ground',
    question: {
      ja: '空港送迎の予約方法は？飛行機が遅延した場合は？',
      'zh-TW': '機場接機怎麼預約？航班延誤怎麼辦？',
      'zh-CN': '机场接机怎么预约？航班延误怎么办？',
      en: 'How do I book airport pickup? What if my flight is delayed?',
    },
    answer: {
      ja: '予約方法：2-3日前までに当社ウェブサイト・WeChat・電話でご予約ください。便名・到着日時・人数・お名前・目的地をお知らせいただきます。車種と料金確認後、前日にドライバー情報（氏名・電話番号・車両ナンバー）をお送りします。到着ロビーでネームボードを持ったドライバーがお待ちしています。フライトが遅延した場合：当社はフライト状況をリアルタイムで監視しており、遅延時はドライバーが自動的に待機時間を調整します。2時間以内の遅延は無料で対応、2時間超過は超過料金（約3,000-5,000円/時間）が発生します。欠航の場合は無料で日程変更または全額返金いたします。',
      'zh-TW': '預約方式：提前2-3天通過我們的網站、微信或電話預約，提供航班號、到達時間、人數、姓名和目的地。確認車型和費用後，出發前一天收到司機信息（姓名、電話、車牌號）。抵達後在出口處找到持姓名牌的司機即可。航班延誤：我們會實時監控航班動態，司機會自動調整等候時間。2小時以內延誤免費等候，超過2小時按超時費計算（約3000-5000日元/小時）。航班取消可免費改期或全額退款。',
      'zh-CN': '预约方式：提前2-3天通过我们的网站、微信或电话预约，提供航班号、到达时间、人数、姓名和目的地。确认车型和费用后，出发前一天收到司机信息（姓名、电话、车牌号）。抵达后在出口处找到持姓名牌的司机即可。航班延误：我们会实时监控航班动态，司机会自动调整等候时间。2小时以内延误免费等候，超过2小时按超时费计算（约3000-5000日元/小时）。航班取消可免费改期或全额退款。',
      en: 'Book 2-3 days ahead via our website, WeChat, or phone with flight number, arrival time, passenger count, names, and destination. Driver details (name, phone, plate number) are sent the day before. Find your driver holding a name board at arrivals. For delays: we monitor flights in real-time and drivers adjust automatically. Free waiting up to 2 hours; overtime charges of ~¥3,000-5,000/hr beyond that. Flight cancellations get free rescheduling or full refund.',
    },
  },
];

// Page UI translations
const pageTranslations = {
  heroTitle1: {
    ja: 'よくある質問',
    'zh-TW': '常見問題',
    'zh-CN': '常见问题',
    en: 'Frequently Asked Questions',
  },
  heroTitle2: {
    ja: 'お気軽にお問い合わせください',
    'zh-TW': '我們隨時為您解答',
    'zh-CN': '我们随时为您解答',
    en: 'We are here to help',
  },
  heroDesc: {
    ja: 'がん治療・精密健診・ゴルフ・ビジネス視察・ランドオペレーターなど、お客様からよくいただくご質問をまとめました。',
    'zh-TW': '重症治療、精密體檢、高爾夫、商務考察、日本地接等，我們整理了客戶最常問的問題。',
    'zh-CN': '重症治疗、精密体检、高尔夫、商务考察、日本地接等，我们整理了客户最常问的问题。',
    en: 'We have compiled the most frequently asked questions about cancer treatment, health checkups, golf, business tours, and Japan ground services.',
  },
  btnBrowse: {
    ja: '質問を見る',
    'zh-TW': '瀏覽問題',
    'zh-CN': '浏览问题',
    en: 'Browse Questions',
  },
  btnContact: {
    ja: 'お問い合わせ',
    'zh-TW': '聯繫我們',
    'zh-CN': '联系我们',
    en: 'Contact Us',
  },
  contactTitle: {
    ja: 'その他のご質問がありますか？',
    'zh-TW': '還有其他問題？',
    'zh-CN': '还有其他问题？',
    en: 'Have more questions?',
  },
  contactSubtitle: {
    ja: '上記のリストに回答がない場合は、お気軽にカスタマーサービスへお問い合わせください。',
    'zh-TW': '如果您的問題未在上述列表中找到答案，歡迎直接聯繫我們的客服團隊。',
    'zh-CN': '如果您的问题未在上述列表中找到答案，欢迎直接联系我们的客服团队。',
    en: 'If your question is not answered above, feel free to contact our customer service team directly.',
  },
  lineConsult: { ja: 'LINEで相談', 'zh-TW': 'LINE 諮詢', 'zh-CN': 'LINE 咨询', en: 'LINE Chat' },
  wechatConsult: { ja: 'WeChatで相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat' },
  emailConsult: { ja: 'メール送信', 'zh-TW': '發送郵件', 'zh-CN': '发送邮件', en: 'Send Email' },
  wechatTitle: { ja: 'WeChat相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat' },
  wechatScanQR: { ja: 'QRコードをスキャンして追加', 'zh-TW': '請用微信掃描二維碼添加客服', 'zh-CN': '请用微信扫描二维码添加客服', en: 'Scan QR code to add our service' },
  wechatOnline: { ja: 'WeChat オンライン', 'zh-TW': '微信客服在線', 'zh-CN': '微信客服在线', en: 'WeChat Online' },
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [showWechatQR, setShowWechatQR] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('ja');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
  }, []);

  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];

  const filteredFAQs = activeCategory === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <PublicLayout showFooter>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-brand-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=2094&auto=format&fit=crop"
            alt="FAQ"
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={75}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/85 to-brand-900/70"></div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
          <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400"></div>
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
              {t('heroTitle1')}
              <br />
              <span className="text-gold-400">{t('heroTitle2')}</span>
            </h1>

            <p className="text-xl text-neutral-300 mb-8 leading-relaxed font-light max-w-2xl">
              {t('heroDesc')}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#faq-list"
                className="inline-flex items-center px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium tracking-wider hover:bg-gold-300 transition-colors"
              >
                {t('btnBrowse')}
                <ArrowRight size={16} className="ml-2" />
              </a>
              <a
                href="#faq-contact"
                className="inline-flex items-center px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm tracking-wider hover:bg-white/20 transition-colors"
              >
                {t('btnContact')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section id="faq-list" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORY_KEYS.map(key => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-5 py-2 text-sm font-medium tracking-wide transition-colors ${
                  activeCategory === key
                    ? 'bg-brand-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {CATEGORY_LABELS[key][currentLang]}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.map((faq) => {
              const globalIndex = FAQ_DATA.indexOf(faq);
              const isOpen = openItems.includes(globalIndex);

              return (
                <div
                  key={globalIndex}
                  className="border border-neutral-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(globalIndex)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 pr-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-gold-400/20 text-gold-600 rounded-full flex items-center justify-center font-bold text-sm">
                        Q
                      </span>
                      <span className="font-medium text-brand-900">{faq.question[currentLang]}</span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5">
                      <div className="flex gap-4 pl-0 md:pl-12">
                        <span className="hidden md:flex flex-shrink-0 w-8 h-8 bg-neutral-100 text-neutral-500 rounded-full items-center justify-center font-bold text-sm">
                          A
                        </span>
                        <p className="text-neutral-600 leading-relaxed">{faq.answer[currentLang]}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div id="faq-contact" className="mt-16 border border-neutral-200 p-8 text-center">
            <h2 className="text-2xl font-serif text-brand-900 mb-4">{t('contactTitle')}</h2>
            <p className="text-neutral-600 mb-8">
              {t('contactSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://line.me/ti/p/j3XxBP50j9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white px-6 py-3 text-sm font-medium tracking-wider transition-colors"
              >
                <MessageCircle size={20} />
                {t('lineConsult')}
              </a>
              <button
                onClick={() => setShowWechatQR(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#07C160] hover:bg-[#06ad56] text-white px-6 py-3 text-sm font-medium tracking-wider transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
                </svg>
                {t('wechatConsult')}
              </button>
              <a
                href="mailto:haoyuan@niijima-koutsu.jp"
                className="inline-flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white px-6 py-3 text-sm font-medium tracking-wider transition-colors"
              >
                <Mail size={20} />
                {t('emailConsult')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WeChat QR Modal */}
      {showWechatQR && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowWechatQR(false)}
        >
          <div
            className="bg-white p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg text-brand-900">{t('wechatTitle')}</h3>
              <button
                onClick={() => setShowWechatQR(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-neutral-50 p-4 flex justify-center">
              <Image
                src={WECHAT_QR_URL}
                alt="WeChat QR Code"
                width={256}
                height={256}
                quality={75}
                className="w-64 h-64 object-contain"
              />
            </div>

            <p className="text-center text-neutral-600 mt-4 text-sm">
              {t('wechatScanQR')}
            </p>

            <div className="mt-4 text-center text-xs px-3 py-2 bg-[#07C160]/10 text-[#07C160]">
              {t('wechatOnline')}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
