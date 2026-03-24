'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'ja';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
      return value as Language;
    }
  }
  return 'ja';
}

const t: Record<Language, {
  heroTag: string;
  heroTitle: string;
  heroSub: string;
  legalNote: string;
  intro: string;
  ch1: string;
  art1title: string;
  art1: string;
  ch2: string;
  art2title: string;
  art2: string;
  art3title: string;
  art3: string;
  art4title: string;
  art4intro: string;
  art4items: string[];
  ch3: string;
  art5title: string;
  art5: string;
  ch4: string;
  art6title: string;
  art6intro: string;
  art6items: string[];
  art6medical: string;
  art7title: string;
  art7intro: string;
  art7items: string[];
  ch5: string;
  art8title: string;
  art8: string;
  ch6: string;
  art9title: string;
  art9: string;
  art9medical: string;
  art10title: string;
  art10: string;
  ch7: string;
  art11title: string;
  art11: string;
  art11health: string;
  ch8: string;
  art12title: string;
  art12: string;
  art12consent: string;
  appendix: string;
  appendixDate: string;
  linkTokushoho: string;
  linkTerms: string;
  linkPrivacy: string;
}> = {
  ja: {
    heroTag: 'Travel Terms',
    heroTitle: '旅行業約款',
    heroSub: '旅行業法 第12条の2 に基づく旅行業約款',
    legalNote: '',
    intro: '新島交通株式会社（以下「当社」）は、大阪府知事登録旅行業 第2-3115号の登録を受けた第2種旅行業者として、一般社団法人日本旅行業協会（JATA）正会員の立場から、標準旅行業約款に準拠した旅行業約款を定めます。',
    ch1: '第1章 総則',
    art1title: '第1条（適用範囲）',
    art1: '当社が手配する旅行契約は、この約款の定めるところによります。この約款に定めのない事項については、法令または一般に確立された慣習によります。当社が法令に反せず、かつ旅行者の不利にならない範囲で書面により特約を結んだときは、その特約が優先します。',
    ch2: '第2章 契約の締結',
    art2title: '第2条（契約の申込み）',
    art2: '当社と手配旅行契約を締結しようとする旅行者は、当社所定の申込書に所要事項を記入のうえ、当社が別に定める金額の申込金とともに、当社に提出しなければなりません。なお、当社ウェブサイトからのオンライン予約の場合は、所定のフォームへの入力および決済手続きの完了をもって申込みとします。',
    art3title: '第3条（契約の成立時期）',
    art3: '手配旅行契約は、当社が契約の締結を承諾し、申込金を受理した時に成立するものとします。オンライン決済の場合は、決済が正常に完了した時点で契約が成立します。',
    art4title: '第4条（契約締結の拒否）',
    art4intro: '当社は、次に掲げる場合において、手配旅行契約の締結に応じないことがあります：',
    art4items: [
      '旅行者が他の旅行者に迷惑を及ぼし、又は団体旅行の円滑な実施を妨げるおそれがあるとき',
      '当社の業務上の都合があるとき',
      '旅行者が暴力団員その他の反社会的勢力であると認められるとき',
      '旅行者からの通信契約による申込みの場合、クレジットカード会社の承認が得られないとき',
    ],
    ch3: '第3章 契約の変更',
    art5title: '第5条（契約内容の変更）',
    art5: '旅行者は、当社に対し、旅行日程、旅行サービスの内容その他の手配旅行契約の内容の変更を求めることができます。この場合、当社は、可能な限り旅行者の求めに応じます。',
    ch4: '第4章 契約の解除',
    art6title: '第6条（旅行者による任意解除）',
    art6intro: '旅行者は、いつでも手配旅行契約の全部又は一部を解除することができます。ただし、当該契約の解除により当社に損害が生じた場合、旅行者は以下の取消料を支払うものとします：',
    art6items: [
      'サービス提供日の14日前まで：無料',
      'サービス提供日の7日前～14日前：旅行代金の50%',
      'サービス提供日の7日前以降：旅行代金の100%',
    ],
    art6medical: 'なお、具体的なキャンセル料の金額・料率は、各サービスページおよび特定商取引法に基づく表記に定めるところによります。医療サービスについては、提携医療機関の個別のキャンセルポリシーが適用される場合があります。',
    art7title: '第7条（当社による解除）',
    art7intro: '当社は、次に掲げる場合において、手配旅行契約を解除することがあります：',
    art7items: [
      '旅行者が所定の期日までに旅行代金を支払わないとき',
      '天災地変、戦乱、暴動等により旅行の安全かつ円滑な実施が不可能となったとき',
      '旅行者が暴力団員その他の反社会的勢力であることが判明したとき',
    ],
    ch5: '第5章 団体・グループ手配',
    art8title: '第8条（団体・グループ手配の特則）',
    art8: '当社は、同一の行程で旅行する複数の旅行者が、その代表者を定めて申し込んだ手配旅行契約の締結については、特約を結ぶことがあります。',
    ch6: '第6章 当社の責任',
    art9title: '第9条（当社の責任）',
    art9: '当社は、手配旅行契約の履行に当たって、当社又は当社の手配代行者が故意又は過失により旅行者に損害を与えたときは、その損害を賠償する責に任じます。ただし、損害発生の翌日から起算して2年以内に当社に対して通知があったときに限ります。',
    art9medical: '当社は、手配した旅行サービス提供機関（医療機関、宿泊施設、運送機関等）の提供するサービスそのものの不具合については責任を負いません。医療サービスの結果については、提携医療機関が直接責任を負います。',
    art10title: '第10条（特別補償）',
    art10: '当社は、第9条の規定に基づく当社の責任が生じるか否かを問わず、手配旅行契約の履行に際し、別途定める特別補償規程に基づき、旅行者が手配旅行参加中にその生命、身体又は手荷物の上に被った一定の損害について、補償金及び見舞金を支払います。',
    ch7: '第7章 旅行者の責任',
    art11title: '第11条（旅行者の責任）',
    art11: '旅行者の故意又は過失により当社が損害を被ったときは、当該旅行者は損害を賠償しなければなりません。',
    art11health: '旅行者は、当社から提供される情報を活用し、旅行者の権利義務等について理解するよう努めなければなりません。旅行者は、自らの健康状態等に関する正確な情報を当社に提供しなければなりません。',
    ch8: '第8章 医療ツーリズムに関する特則',
    art12title: '第12条（医療サービスの取扱い）',
    art12: '当社が手配する医療ツーリズムサービスにおいて、医療行為は提携医療機関が直接提供します。当社は、医療機関との予約手配、通訳翻訳、渡航手配等の旅行サービスを提供する立場であり、医療行為そのものの提供者ではありません。',
    art12consent: '治療効果には個人差があり、結果を保証するものではありません。旅行者は、医療機関との間で別途インフォームドコンセント（説明と同意）の手続きを行います。',
    appendix: '附則',
    appendixDate: 'この約款は、2025年1月1日より適用します。',
    linkTokushoho: '特定商取引法に基づく表記',
    linkTerms: '利用規約',
    linkPrivacy: 'プライバシーポリシー',
  },
  'zh-TW': {
    heroTag: 'Travel Terms',
    heroTitle: '旅行業約款',
    heroSub: '根據日本旅行業法第12條之2制定的旅行業約款',
    legalNote: '※ 本約款以日語版為法律效力文本，翻譯僅供參考。',
    intro: '新島交通株式會社（以下簡稱「本公司」）作為持有大阪府知事登錄旅行業第2-3115號的第2種旅行業者，並為一般社團法人日本旅行業協會（JATA）正式會員，依據標準旅行業約款制定本旅行業約款。',
    ch1: '第一章 總則',
    art1title: '第1條（適用範圍）',
    art1: '本公司安排之旅行合約，依本約款之規定辦理。本約款未規定之事項，依法令或一般確立之慣例辦理。本公司在不違反法令且不損害旅客利益之範圍內，以書面達成特別約定時，該特別約定優先適用。',
    ch2: '第二章 合約之締結',
    art2title: '第2條（合約之申請）',
    art2: '欲與本公司締結旅行安排合約之旅客，須在本公司指定之申請書上填寫必要事項，連同本公司另行規定之訂金一併提交。透過本公司網站進行線上預約時，以完成指定表單之填寫及付款手續作為申請。',
    art3title: '第3條（合約成立時間）',
    art3: '旅行安排合約於本公司同意締結合約並收取訂金時成立。線上付款時，以付款正常完成之時點合約成立。',
    art4title: '第4條（拒絕締結合約）',
    art4intro: '本公司在以下情況下，可能不接受旅行安排合約之締結：',
    art4items: [
      '旅客可能對其他旅客造成困擾，或妨礙團體旅行之順利實施',
      '基於本公司業務上之需要',
      '旅客被認定為暴力團成員或其他反社會勢力',
      '以通信合約申請時，無法取得信用卡公司之核准',
    ],
    ch3: '第三章 合約之變更',
    art5title: '第5條（合約內容之變更）',
    art5: '旅客可向本公司要求變更旅行日程、旅行服務內容或其他旅行安排合約之內容。本公司將盡可能配合旅客之要求。',
    ch4: '第四章 合約之解除',
    art6title: '第6條（旅客之任意解除）',
    art6intro: '旅客可隨時解除旅行安排合約之全部或部分。但因解除合約導致本公司受到損害時，旅客須支付以下取消費用：',
    art6items: [
      '服務提供日14天前：免費',
      '服務提供日7至14天前：旅行費用之50%',
      '服務提供日7天以內：旅行費用之100%',
    ],
    art6medical: '具體之取消費用金額及費率，以各服務頁面及特定商取引法標示之規定為準。關於醫療服務，可能適用合作醫療機構之個別取消政策。',
    art7title: '第7條（本公司之解除）',
    art7intro: '本公司在以下情況下，可解除旅行安排合約：',
    art7items: [
      '旅客未在規定期限內支付旅行費用',
      '因天災、戰亂、暴動等導致旅行無法安全順利實施',
      '確認旅客為暴力團成員或其他反社會勢力',
    ],
    ch5: '第五章 團體旅行安排',
    art8title: '第8條（團體旅行安排之特別規定）',
    art8: '對於多位旅客以相同行程、由代表人提出申請之旅行安排合約，本公司可達成特別約定。',
    ch6: '第六章 本公司之責任',
    art9title: '第9條（本公司之責任）',
    art9: '在履行旅行安排合約時，因本公司或本公司委託之代理人之故意或過失而對旅客造成損害時，本公司負賠償責任。但限於損害發生翌日起2年內向本公司提出通知者。',
    art9medical: '本公司對所安排之旅行服務提供機構（醫療機構、住宿設施、運輸機構等）所提供之服務本身之問題不負責任。醫療服務之結果由合作醫療機構直接負責。',
    art10title: '第10條（特別補償）',
    art10: '不論第9條規定之本公司責任是否成立，在履行旅行安排合約時，依另行制定之特別補償規程，對旅客在參加旅行安排期間其生命、身體或手提行李所遭受之一定損害，支付補償金及慰問金。',
    ch7: '第七章 旅客之責任',
    art11title: '第11條（旅客之責任）',
    art11: '因旅客之故意或過失導致本公司受到損害時，該旅客須賠償損害。',
    art11health: '旅客應善加利用本公司提供之資訊，努力理解旅客之權利義務等。旅客須向本公司提供關於自身健康狀況等之準確資訊。',
    ch8: '第八章 醫療旅遊特別規定',
    art12title: '第12條（醫療服務之處理）',
    art12: '在本公司安排之醫療旅遊服務中，醫療行為由合作醫療機構直接提供。本公司之角色為提供與醫療機構之預約安排、口譯翻譯、交通行程安排等旅行服務，並非醫療行為之提供者。',
    art12consent: '治療效果因人而異，不保證結果。旅客須與醫療機構另行進行知情同意（說明與同意）之程序。',
    appendix: '附則',
    appendixDate: '本約款自2025年1月1日起適用。',
    linkTokushoho: '特定商取引法標示',
    linkTerms: '使用條款',
    linkPrivacy: '隱私政策',
  },
  'zh-CN': {
    heroTag: 'Travel Terms',
    heroTitle: '旅行业约款',
    heroSub: '根据日本旅行业法第12条之2制定的旅行业约款',
    legalNote: '※ 本约款以日语版为法律效力文本，翻译仅供参考。',
    intro: '新岛交通株式会社（以下简称"本公司"）作为持有大阪府知事登录旅行业第2-3115号的第2种旅行业者，并为一般社团法人日本旅行业协会（JATA）正式会员，依据标准旅行业约款制定本旅行业约款。',
    ch1: '第一章 总则',
    art1title: '第1条（适用范围）',
    art1: '本公司安排之旅行合同，依本约款之规定办理。本约款未规定之事项，依法令或一般确立之惯例办理。本公司在不违反法令且不损害旅客利益之范围内，以书面达成特别约定时，该特别约定优先适用。',
    ch2: '第二章 合同之缔结',
    art2title: '第2条（合同之申请）',
    art2: '欲与本公司缔结旅行安排合同之旅客，须在本公司指定之申请书上填写必要事项，连同本公司另行规定之订金一并提交。通过本公司网站进行线上预约时，以完成指定表单之填写及付款手续作为申请。',
    art3title: '第3条（合同成立时间）',
    art3: '旅行安排合同于本公司同意缔结合同并收取订金时成立。线上付款时，以付款正常完成之时点合同成立。',
    art4title: '第4条（拒绝缔结合同）',
    art4intro: '本公司在以下情况下，可能不接受旅行安排合同之缔结：',
    art4items: [
      '旅客可能对其他旅客造成困扰，或妨碍团体旅行之顺利实施',
      '基于本公司业务上之需要',
      '旅客被认定为暴力团成员或其他反社会势力',
      '以通信合同申请时，无法取得信用卡公司之核准',
    ],
    ch3: '第三章 合同之变更',
    art5title: '第5条（合同内容之变更）',
    art5: '旅客可向本公司要求变更旅行日程、旅行服务内容或其他旅行安排合同之内容。本公司将尽可能配合旅客之要求。',
    ch4: '第四章 合同之解除',
    art6title: '第6条（旅客之任意解除）',
    art6intro: '旅客可随时解除旅行安排合同之全部或部分。但因解除合同导致本公司受到损害时，旅客须支付以下取消费用：',
    art6items: [
      '服务提供日14天前：免费',
      '服务提供日7至14天前：旅行费用之50%',
      '服务提供日7天以内：旅行费用之100%',
    ],
    art6medical: '具体之取消费用金额及费率，以各服务页面及特定商取引法标示之规定为准。关于医疗服务，可能适用合作医疗机构之个别取消政策。',
    art7title: '第7条（本公司之解除）',
    art7intro: '本公司在以下情况下，可解除旅行安排合同：',
    art7items: [
      '旅客未在规定期限内支付旅行费用',
      '因天灾、战乱、暴动等导致旅行无法安全顺利实施',
      '确认旅客为暴力团成员或其他反社会势力',
    ],
    ch5: '第五章 团体旅行安排',
    art8title: '第8条（团体旅行安排之特别规定）',
    art8: '对于多位旅客以相同行程、由代表人提出申请之旅行安排合同，本公司可达成特别约定。',
    ch6: '第六章 本公司之责任',
    art9title: '第9条（本公司之责任）',
    art9: '在履行旅行安排合同时，因本公司或本公司委托之代理人之故意或过失而对旅客造成损害时，本公司负赔偿责任。但限于损害发生翌日起2年内向本公司提出通知者。',
    art9medical: '本公司对所安排之旅行服务提供机构（医疗机构、住宿设施、运输机构等）所提供之服务本身之问题不负责任。医疗服务之结果由合作医疗机构直接负责。',
    art10title: '第10条（特别补偿）',
    art10: '不论第9条规定之本公司责任是否成立，在履行旅行安排合同时，依另行制定之特别补偿规程，对旅客在参加旅行安排期间其生命、身体或手提行李所遭受之一定损害，支付补偿金及慰问金。',
    ch7: '第七章 旅客之责任',
    art11title: '第11条（旅客之责任）',
    art11: '因旅客之故意或过失导致本公司受到损害时，该旅客须赔偿损害。',
    art11health: '旅客应善加利用本公司提供之信息，努力理解旅客之权利义务等。旅客须向本公司提供关于自身健康状况等之准确信息。',
    ch8: '第八章 医疗旅游特别规定',
    art12title: '第12条（医疗服务之处理）',
    art12: '在本公司安排之医疗旅游服务中，医疗行为由合作医疗机构直接提供。本公司之角色为提供与医疗机构之预约安排、口译翻译、交通行程安排等旅行服务，并非医疗行为之提供者。',
    art12consent: '治疗效果因人而异，不保证结果。旅客须与医疗机构另行进行知情同意（说明与同意）之程序。',
    appendix: '附则',
    appendixDate: '本约款自2025年1月1日起适用。',
    linkTokushoho: '特定商取引法标示',
    linkTerms: '使用条款',
    linkPrivacy: '隐私政策',
  },
  en: {
    heroTag: 'Travel Terms',
    heroTitle: 'Travel Agency Terms',
    heroSub: 'Travel Agency Terms pursuant to Article 12-2 of the Travel Agency Act',
    legalNote: '※ The Japanese version is the legally binding text. This translation is for reference only.',
    intro: 'Niijima Kotsu Co., Ltd. (hereinafter "the Company"), as a Type 2 registered travel agency under Osaka Prefectural Governor Registration No. 2-3115 and a full member of the Japan Association of Travel Agents (JATA), establishes these Travel Agency Terms in accordance with the Standard Travel Agency Terms.',
    ch1: 'Chapter 1: General Provisions',
    art1title: 'Article 1 (Scope of Application)',
    art1: 'Travel contracts arranged by the Company shall be governed by these Terms. Matters not stipulated in these Terms shall be governed by applicable laws or generally established customs. If the Company enters into a special agreement in writing that does not violate laws and is not disadvantageous to the traveler, such special agreement shall take precedence.',
    ch2: 'Chapter 2: Formation of Contract',
    art2title: 'Article 2 (Application for Contract)',
    art2: 'A traveler wishing to enter into an arranged travel contract with the Company must submit a completed application form along with the deposit amount separately determined by the Company. For online reservations through our website, submission of the designated form and completion of payment procedures shall constitute the application.',
    art3title: 'Article 3 (Time of Contract Formation)',
    art3: 'The arranged travel contract shall be formed when the Company accepts the contract and receives the deposit. For online payments, the contract shall be formed at the time the payment is successfully completed.',
    art4title: 'Article 4 (Refusal to Enter into Contract)',
    art4intro: 'The Company may decline to enter into an arranged travel contract in the following cases:',
    art4items: [
      'When the traveler may cause inconvenience to other travelers or hinder the smooth operation of group travel',
      'Due to the Company\'s operational requirements',
      'When the traveler is identified as a member of organized crime groups or other antisocial forces',
      'When credit card company approval cannot be obtained for applications via communication contracts',
    ],
    ch3: 'Chapter 3: Changes to Contract',
    art5title: 'Article 5 (Changes to Contract Content)',
    art5: 'The traveler may request the Company to change the travel itinerary, travel service content, or other content of the arranged travel contract. The Company shall accommodate such requests to the extent possible.',
    ch4: 'Chapter 4: Cancellation of Contract',
    art6title: 'Article 6 (Voluntary Cancellation by Traveler)',
    art6intro: 'The traveler may cancel all or part of the arranged travel contract at any time. However, if the cancellation causes damage to the Company, the traveler shall pay the following cancellation fees:',
    art6items: [
      'Up to 14 days before service date: Free',
      '7 to 14 days before service date: 50% of travel cost',
      'Within 7 days of service date: 100% of travel cost',
    ],
    art6medical: 'Specific cancellation fee amounts and rates are as set forth on each service page and in the Specified Commercial Transactions disclosure. For medical services, individual cancellation policies of partner medical institutions may apply.',
    art7title: 'Article 7 (Cancellation by the Company)',
    art7intro: 'The Company may cancel the arranged travel contract in the following cases:',
    art7items: [
      'When the traveler fails to pay the travel cost by the specified date',
      'When safe and smooth travel becomes impossible due to natural disasters, war, riots, etc.',
      'When the traveler is confirmed to be a member of organized crime groups or other antisocial forces',
    ],
    ch5: 'Chapter 5: Group Travel Arrangements',
    art8title: 'Article 8 (Special Provisions for Group Travel)',
    art8: 'For arranged travel contracts where multiple travelers traveling on the same itinerary apply through a designated representative, the Company may enter into special agreements.',
    ch6: 'Chapter 6: Company Liability',
    art9title: 'Article 9 (Company Liability)',
    art9: 'The Company shall be liable for damages caused to travelers through intentional act or negligence by the Company or its agents in the performance of the arranged travel contract. However, this is limited to cases where notification is made to the Company within 2 years from the day following the occurrence of damage.',
    art9medical: 'The Company shall not be liable for deficiencies in services provided by travel service providers (medical institutions, accommodation facilities, transport operators, etc.). The results of medical services shall be the direct responsibility of partner medical institutions.',
    art10title: 'Article 10 (Special Compensation)',
    art10: 'Regardless of whether Company liability under Article 9 arises, the Company shall pay compensation and condolence money for certain damages suffered by the traveler to their life, body, or carry-on luggage during participation in the arranged travel, pursuant to the separately established Special Compensation Rules.',
    ch7: 'Chapter 7: Traveler Responsibility',
    art11title: 'Article 11 (Traveler Responsibility)',
    art11: 'When the Company suffers damage due to the traveler\'s intentional act or negligence, the traveler must compensate for such damage.',
    art11health: 'The traveler shall endeavor to understand their rights and obligations by utilizing information provided by the Company. The traveler must provide accurate information regarding their health condition to the Company.',
    ch8: 'Chapter 8: Special Provisions for Medical Tourism',
    art12title: 'Article 12 (Handling of Medical Services)',
    art12: 'In medical tourism services arranged by the Company, medical procedures are directly provided by partner medical institutions. The Company\'s role is to provide travel services such as appointment arrangements with medical institutions, interpretation and translation, and travel arrangements, and is not a provider of medical procedures.',
    art12consent: 'Treatment outcomes vary between individuals and results are not guaranteed. The traveler shall undergo separate informed consent procedures with the medical institution.',
    appendix: 'Supplementary Provisions',
    appendixDate: 'These Terms shall be effective from January 1, 2025.',
    linkTokushoho: 'Specified Commercial Transactions',
    linkTerms: 'Terms of Use',
    linkPrivacy: 'Privacy Policy',
  },
};

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
  const [lang, setLang] = useState<Language>('ja');
  useEffect(() => { setLang(getInitialLang()); }, []);
  const l = t[lang];

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
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">{l.heroTag}</span>
              <div className="h-[1px] w-12 bg-gold-400"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight">
              {l.heroTitle}
            </h1>
            <p className="mt-4 text-neutral-400 text-sm">{l.heroSub}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl space-y-6">
          {l.legalNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs">
              {l.legalNote}
            </div>
          )}

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8">
            <p className="text-neutral-700 text-sm leading-relaxed">{l.intro}</p>
          </div>

          <Section title={l.ch1}>
            <p><strong>{l.art1title}</strong></p>
            <p>{l.art1}</p>
          </Section>

          <Section title={l.ch2}>
            <p><strong>{l.art2title}</strong></p>
            <p>{l.art2}</p>
            <p><strong>{l.art3title}</strong></p>
            <p>{l.art3}</p>
            <p><strong>{l.art4title}</strong></p>
            <p>{l.art4intro}</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 ml-4">
              {l.art4items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </Section>

          <Section title={l.ch3}>
            <p><strong>{l.art5title}</strong></p>
            <p>{l.art5}</p>
          </Section>

          <Section title={l.ch4}>
            <p><strong>{l.art6title}</strong></p>
            <p>{l.art6intro}</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 ml-4">
              {l.art6items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <p className="mt-2">{l.art6medical}</p>
            <p className="mt-4"><strong>{l.art7title}</strong></p>
            <p>{l.art7intro}</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 ml-4">
              {l.art7items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </Section>

          <Section title={l.ch5}>
            <p><strong>{l.art8title}</strong></p>
            <p>{l.art8}</p>
          </Section>

          <Section title={l.ch6}>
            <p><strong>{l.art9title}</strong></p>
            <p>{l.art9}</p>
            <p className="mt-2">{l.art9medical}</p>
            <p className="mt-4"><strong>{l.art10title}</strong></p>
            <p>{l.art10}</p>
          </Section>

          <Section title={l.ch7}>
            <p><strong>{l.art11title}</strong></p>
            <p>{l.art11}</p>
            <p className="mt-2">{l.art11health}</p>
          </Section>

          <Section title={l.ch8}>
            <p><strong>{l.art12title}</strong></p>
            <p>{l.art12}</p>
            <p className="mt-2">{l.art12consent}</p>
          </Section>

          <Section title={l.appendix}>
            <p>{l.appendixDate}</p>
          </Section>

          {/* 関連リンク */}
          <div className="flex flex-wrap gap-6 pt-8 border-t border-neutral-200">
            <Link href="/legal/tokushoho" className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors">
              {l.linkTokushoho} <ArrowRight size={14} />
            </Link>
            <Link href="/legal/terms" className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors">
              {l.linkTerms} <ArrowRight size={14} />
            </Link>
            <Link href="/legal/privacy" className="text-brand-700 hover:text-brand-900 text-sm flex items-center gap-1 transition-colors">
              {l.linkPrivacy} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
