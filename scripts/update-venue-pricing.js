// 更新店铺详细价格信息
// 从截图数据录入
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 截图数据 - 136个店铺
const venueUpdates = [
  // === 第一批 4个 ===
  {
    name: 'インタイトル 恵比寿',
    business_hours: '20:00〜翌1:00',
    closed_days: '日曜日・祝日',
    service_charge: '30%',
    website: 'https://intitle-ebisu.com',
    pricing_info: {
      main_60min: 12100,
      private_60min: 18700,
      extension_30min: { main: 5500, private: 7700 },
      nomination_60min: 3300,
      dohan_1time: 4400,
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'エマクラブ 江坂',
    business_hours: '19:30〜00:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://amaclub-esaka.com',
    pricing_info: {
      system_note: '時間帯・人数別料金',
      extension_30min: 3300,
      nomination_50min: 2200,
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'エルミネ 新横浜',
    business_hours: '19:00〜Last',
    closed_days: '日曜日',
    service_charge: 'メイン25%・VIP30%',
    website: 'https://hermine-yokohama.com',
    pricing_info: {
      system_note: '時間帯別料金・メイン/VIP個室別',
      extension_30min: { main: 3850, vip: 5500 },
      nomination: 3300,
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'エルミネ 和歌山',
    business_hours: '20:00〜24:00',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://hermine-wakayama.com',
    pricing_info: {
      system_note: '人数・時間帯別料金',
      extension_30min: 3300,
      nomination: 2200,
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第二批 5个 ===
  {
    name: 'エレナハウス',
    altNames: ['ELENA HOUSE'],
    city: '三重',
    business_hours: '19:00〜25:00',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.elena-house.com/',
    pricing_info: {
      system_50min: {
        'OPEN〜21時': 4400,
        '21時以降': 5500,
        '22時以降': 6600
      },
      extension: { '30min': 3300, '50min': 5500 },
      nomination_50min: 1100,
      w_nomination_50min: 4400,
      dohan_1person: 1100,
      remarks: '金額はお一人様50分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'エレナハウス 高知',
    altNames: ['エレナハウス コウチ'],
    city: '高知',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.elena-house-kochi.com/',
    pricing_info: {
      system_60min_1person: 5500,
      extension: { '30min': 3300, '60min': 5500 },
      nomination_60min: 1650,
      remarks: '金額はお一人様1セット料金です。無料ボトルあり。ご予約承ります。二次会やご接待などでご利用下さい。',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'エレナハウス 梅田',
    altNames: ['エレナハウスウメダ'],
    city: '大阪',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.elena-house-umeda.com/',
    pricing_info: {
      system_60min: {
        '〜21時': 5500,
        '〜22時': 6050,
        '〜23時': 7150,
        '23時以降': 7700
      },
      extension_before23: { '30min': 3850, '60min': 6600 },
      extension_after23: { '30min': 3850, '60min': 7700 },
      nomination_60min: 2200,
      nomination_60min_2nd: 4400,
      remarks: '金額はお一人様60分料金です。2人以上ご指名の場合は、2人目から指名料金は¥4,400となります。',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'エレナハウス京都',
    altNames: ['ELENA HOUSE 京都', 'エレナハウス 京都'],
    city: '京都',
    business_hours: '20:00〜25:00',
    closed_days: '月曜日・祝日',
    service_charge: '25%',
    website: 'https://www.elena-house-kyoto.com/',
    pricing_info: {
      system_50min: {
        'OPEN〜20:59': 5500,
        '21:00〜LAST': 6600
      },
      extension: { '30min': 3850, '50min': 6600 },
      nomination_50min: 2200,
      dohan_1person: 2200,
      vip_charge_50min: 11000,
      vip_extension_charge: 11000,
      remarks: '無料ボトルあります。金額はお一人様50分料金です。',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'エンジェルフェザー ミナミ',
    city: '大阪',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.angel-feather-minami.com/',
    pricing_info: {
      system_60min: {
        'OPEN〜21:59': 8800,
        '22:00〜LAST': 9900
      },
      vip_90min: {
        'OPEN〜21:59': 13200,
        '22:00〜LAST': 16500
      },
      extension: { '30min': 5500, '60min': 8800 },
      vip_room_charge: 11000,
      nomination: 3300,
      nomination_2nd: 5500,
      dohan: 2200,
      remarks: 'オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第三批 5个 ===
  {
    name: 'エンジェルフェザー 池袋',
    altNames: ['エンジェル・フェザー 池袋', 'エンジェルフェザーイケブクロ'],
    city: '東京',
    business_hours: '19:00〜Last',
    closed_days: '日曜日',
    service_charge: 'メイン25%・個室30%',
    website: 'https://angel-feather-ikebukuro.com',
    pricing_info: {
      basic_60min: {
        'OPEN〜20:59': 6600,
        '21:00〜21:59': 8800,
        '22:00〜Last': 9900
      },
      private_room: {
        'OPEN〜20:59': 16500,
        '21:00〜21:59': 16500,
        '22:00〜Last': 16500,
        '貸切（3名以下）': 27500
      },
      extension_30min: { 'メイン': 4400, '個室': 7700 },
      nomination_60min: 3300,
      dohan_1time: 3300,
      remarks: '消費税込み。オーダー料別途。お持込料別途。1セット60分。当店は自動延長制となっております',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'エンジェルフェザー 北新地',
    altNames: ['エンジェル・フェザー 北新地', 'エンジェルフェザーキタシンチ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '25%',
    website: 'https://angel-feather.jp',
    pricing_info: {
      system: {
        '〜23時': 9900,
        '23時以降': 11000
      },
      extension: {
        '〜23時': { '30min': 5500, '60min': 9900 },
        '23時以降': { '30min': 5500, '60min': 11000 }
      },
      nomination_60min: 3300,
      dohan_1time: 3300,
      vip_charge_60min_per_table: 22000,
      remarks: '消費税別途頂きます。上記金額はお一人様の料金です。VIPチャージは1テーブル1時間あたり。延長毎に追加されます',
      currency: 'JPY',
      tax_included: false
    }
  },
  {
    name: 'エンジェルフェザー 仙台',
    altNames: ['エンジェル・フェザー 仙台', 'エンジェルフェザーセンダイ'],
    city: '宮城',
    business_hours: '20時〜Last',
    closed_days: '日曜日（祝日・祭日は定休日を変更させて頂く場合あり）',
    service_charge: '15%（ロイヤルVIPのみ20%）',
    website: 'https://angel-feather-sendai.com',
    pricing_info: {
      basic: {
        'OPEN〜20:59': 4400,
        '21:00〜21:59': 5500,
        '22:00〜Last': 6600
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination: {
        '場内指名': 2200,
        '場外指名': 2200,
        'W指名（3人目から）': 3300
      },
      dohan: 3300,
      royal_vip: {
        'OPEN〜20:59': 3300,
        '21:00〜': 4400,
        'note': '3名様以上から利用可。サービス料20%。セット料金に追加'
      },
      vip: {
        'OPEN〜20:59': 3300,
        '21:00〜': 4400,
        'note': '2名様以上から利用可。セット料金に追加'
      },
      vip_extension: { '30min': 5500, '60min': 11000 },
      single_charge: 1100,
      remarks: '店内分煙。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '銚乃音 京都',
    altNames: ['銚乃音（かのね） 京都', 'カノネキョウト', 'かのね 京都'],
    city: '京都',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日（詳しくは店舗にご連絡ください）',
    service_charge: '25%',
    website: 'https://www.kanone-kiyamachi.com/',
    pricing_info: {
      system_50min: {
        'メンバー': { '〜22:00': 5500, '22:00〜': 6600 },
        'ビジター': { '〜22:00': 6600, '22:00〜': 7700 }
      },
      extension: { '30min': 3850, '50min': 6600 },
      nomination_50min: 2200,
      w_nomination: 5500,
      dohan_1person: 1100,
      vip_charge_50min: 2200,
      vip_extension_charge: 2200,
      remarks: '無料ボトルあります。金額はお一人様50分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '銚乃音 祇園',
    altNames: ['銚乃音（かのね） 祇園', 'カノネギオン', 'かのね 祇園'],
    city: '京都',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日（祝日等変更の場合あり。Instagram: @kanonegion_official）',
    service_charge: '15%',
    website: 'https://kanone-gion.com',
    pricing_info: {
      system_1person: {
        'ALL TIME': 7700
      },
      extension: { '30min': 3850, '50min': 6600 },
      nomination_50min: 2200,
      w_nomination_50min: 6600,
      dohan_1person: 3300,
      vip_charge: 2200,
      remarks: '金額はお一人様50分料金です。オーダーは別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第四批 5个 ===
  {
    name: '銚乃音 神戸',
    altNames: ['銚乃音（かのね） 神戸', 'カノネコウベ', 'かのね 神戸'],
    city: '兵庫',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日（三宮駅から北へ徒歩5分）',
    service_charge: '25%',
    website: 'https://www.kanone-kobe.com/',
    pricing_info: {
      system: {
        '〜22時': 6600,
        '22時から': 7700
      },
      extension: { '30min': 4400, '50min': 6600 },
      nomination_1person: 2200,
      dohan_1person: 2200,
      vip_room_per_set: 11000,
      remarks: 'VIPルーム料金は、1set毎に使用料金11000円を別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '銚乃音 和歌山',
    altNames: ['銚乃音（かのね） 和歌山', 'カノネワカヤマ', 'かのね 和歌山'],
    city: '和歌山',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.kanone-wakayama.com/',
    pricing_info: {
      system_1person: {
        'OPEN〜21:00': 5500,
        '21:00〜LAST': 6600
      },
      system_2person_or_more_per_person: {
        'OPEN〜21:00': 4400,
        '21:00〜LAST': 5500
      },
      extension: { '30min': 3300, '50min': 5500 },
      nomination_1person: 2200,
      dohan_1person: 2200,
      vip_60min: 11000,
      vip_note: 'VIPのみ60分制',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '川崎 Garden',
    altNames: ['川崎Garden', 'カワサキ ガーデン', 'カワサキガーデン'],
    city: '神奈川',
    business_hours: '19:30〜翌1:00',
    closed_days: '日曜日・祝日（祝日でも営業の場合あり）',
    service_charge: 'メイン・VIP・個室（相席）20%、個室（貸切）25%',
    website: 'https://kawasaki-garden.com',
    pricing_info: {
      basic_60min: {
        '19:30〜20:59': 5500,
        '21:00〜21:59': 6600,
        '22:00〜翌1:00': 7700
      },
      vip: {
        '19:30〜20:59': 6050,
        '21:00〜21:59': 7150,
        '22:00〜翌1:00': 8250
      },
      private_room_shared: {
        '19:30〜20:59': 7150,
        '21:00〜21:59': 8250,
        '22:00〜翌1:00': 9350,
        'note': 'カラオケ可能'
      },
      private_room_exclusive: {
        '19:30〜20:59': 8800,
        '21:00〜21:59': 9900,
        '22:00〜翌1:00': 11000,
        'note': '2名以上'
      },
      extension_30min: {
        'メイン': 3850,
        'VIP': 4400,
        '個室（相席）': 4950,
        '個室（貸切）': 5500
      },
      nomination_60min: 2200,
      dohan_1time: 2750,
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '神田茶屋',
    altNames: ['カンダチャヤ'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: 'メイン20%、個室（洋室・和室）30%',
    website: 'https://www.kanda-chaya.com/',
    pricing_info: {
      main_60min: {
        'OPEN〜20:59': 7150,
        '21:00〜LAST': 9350
      },
      private_western: {
        'OPEN〜20:59': 14300,
        '21:00〜LAST': 17600,
        'note': '2名様以上ご利用'
      },
      private_japanese: {
        'OPEN〜20:59': 12100,
        '21:00〜LAST': 13200,
        'note': '2名様以上ご利用'
      },
      extension_30min: {
        'メイン': 4950,
        '個室（洋室）': 7150,
        '個室（和室）': 7150
      },
      nomination_60min: 2750,
      dohan_1time: 3300,
      remarks: '1セット60分。オーダー別途。お持込み料別途。ハウスボトルあり。個室利用は2名様から。ボトルキープ期間は3ヶ月（最終来店日からカウント）',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ジェム 立川',
    altNames: ['クラブ ジェム', 'クラブジェム'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.club-gemme.jp/',
    pricing_info: {
      basic_60min: {
        '19:00〜19:59': 5500,
        '20:00〜20:59': 6600,
        '21:00〜LAST': 7700
      },
      extension_30min: {
        'メイン': 4400,
        'VIP&ロイヤル': 5500
      },
      nomination_per_set: 2750,
      dohan_1time: 2200,
      vip_charge_per_person: 3300,
      vip_note: '3名様以上で貸切も可（別途料金）',
      royal_charge_per_person: 6600,
      royal_note: '3名様以上でご利用可',
      remarks: 'オーダー別途。無料ボトル有り',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第五批 ===
  {
    name: 'クロリス 六本木',
    altNames: ['クラブ クロリス', 'Club Chloris'],
    city: '東京',
    business_hours: '20:00〜0:00',
    closed_days: '土曜日・日曜日・祝日',
    service_charge: 'MAIN 38%（23時以降43%）、VIP 40%（23時以降45%）',
    website: 'https://www.club-chloris.com/',
    pricing_info: {
      main_90min: {
        'セット': 20900,
        'テーブルチャージ': 3300,
        '延長料金（30分）': 4400
      },
      vip_90min: {
        'セット': 23100,
        'テーブルチャージ': 6600,
        '延長料金（30分）': 5500
      },
      kakari_fee: 4400,
      nomination: 3300,
      dohan: 4400,
      royal_vip_kashikiri: 55000,
      royal_vip_note: 'ROYAL VIPルームを1名様でご利用の際は、2名様分の料金になります',
      bring_in_fee: 3300,
      bring_in_note: 'お持込み料別途（一品：¥3,300〜）',
      same_industry_note: '同業者においては、2名に対し1名様分の料金が発生します',
      credit_cards: 'VISA・JCB・アメックス・Master・ダイナース・銀聯カード',
      remarks: 'オーダー別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第六批 5个 ===
  {
    name: 'KATY STUDIO',
    altNames: ['ケイティースタジオ', 'ケイティー スタジオ'],
    city: '三重',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '5%',
    website: 'https://katy-studio.com',
    pricing_info: {
      system_60min: {
        'ALL TIME': 4400
      },
      extension: { '30min': 2750, '60min': 4400 },
      dohan: 1100,
      box_seat_charge_per_60min: 1100,
      free_drinks: '焼酎JAPAN、ビール、烏龍茶',
      free_items: '氷、ミネラルウォーター',
      remarks: '金額はお一人様60分料金です。ボックス席はお一人様60分につき+1,100円。オーダー料別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ゴールドトリガー仙台',
    altNames: ['ゴールドトリガーセンダイ', 'GOLD TRIGGER 仙台'],
    city: '宮城',
    business_hours: '19:00〜Last',
    closed_days: '日曜日（祝前日の日曜日は営業）',
    service_charge: '15%',
    website: 'https://gold-trigger-sendai.com',
    pricing_info: {
      basic_50min: {
        '19:00〜20:59': 3850,
        '21:00〜21:59': 4400,
        '22:00〜翌1:00': 4950
      },
      semi_vip: {
        '19:00〜20:59': 4950,
        '21:00〜21:59': 5500,
        '22:00〜翌1:00': 6050
      },
      private_vip: {
        '19:00〜20:59': 7150,
        '21:00〜21:59': 8800,
        '22:00〜翌1:00': 9900
      },
      extension_30min: { 'メイン': 3300, 'セミVIP': 4400, '個室': 5500 },
      extension_50min: { 'メイン': 4950, 'セミVIP': 6050, '個室': 9350 },
      nomination_50min: 2200,
      dohan_1time: 3300,
      single_charge: 1100,
      remarks: '1セット50分です。オーダー別途。お持込み料別途。ボトルキープ期間は3ヶ月（最終来店日からカウント）',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'サンセットラウンジェット 四日市',
    altNames: ['サンセットラウンジェット ヨッカイチ'],
    city: '三重',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.sunset-lounget-yokkaichi.com/',
    pricing_info: {
      system_50min: {
        'OPEN〜22:00': 3300,
        '22:00〜LAST': 4400
      },
      extension: { '30min': 3300, '50min': 5500 },
      nomination_50min: 2200,
      dohan: 2200,
      free_bottle: true,
      remarks: '無料ボトル有ります。金額はお一人様50分料金です。上記金額は消費税込みの料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'サンセットラウンジェット 金沢',
    altNames: ['サンセットラウンジェットカナザワ'],
    city: '石川',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '20%',
    website: 'https://www.sunset-lounget-kanazawa.com/',
    pricing_info: {
      system_60min: {
        '〜20時': { '1名様': 5500, '2名様以上': 4400 },
        '〜21時': { '1名様': 6600, '2名様以上': 5500 },
        '21時から': { '1名様': 7700, '2名様以上': 6600 }
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      nomination_60min_2nd: 3300,
      dohan_1person: 2200,
      vip_charge_all_time: 11000,
      remarks: '金額はお一人様60分料金です。2人以上ご指名の場合は、2人目から指名料金は¥3,300となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'サンセットラウンジェット 神戸',
    altNames: ['サンセットラウンジェットコウベ'],
    city: '兵庫',
    business_hours: '【昼の部】13:00〜19:00 【夜の部】20:00〜25:00',
    closed_days: '日曜日',
    service_charge: '25%（昼の部・夜の部共通）',
    website: 'https://www.sunset-lounget-kobe.com/',
    pricing_info: {
      day_60min: {
        '12:00〜17:00': 4400
      },
      night_member_50min: {
        '19:00〜21:00': 5500,
        '21:00〜25:00': 6600,
        'note': 'キープボトル有りのお客様'
      },
      night_visitor_50min: {
        '19:00〜21:00': 6600,
        '21:00〜25:00': 7700,
        'note': 'ハウスボトル'
      },
      extension_day: { '30min': 2200, '60min': 4400 },
      extension_night: { '30min': 3300, '50min': 5500 },
      nomination_day_60min: 2200,
      nomination_night_50min: 2200,
      dohan_day: 2200,
      dohan_night: 2200,
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第七批 6个 ===
  {
    name: 'サンセットラウンジェット 新橋',
    altNames: ['サンセットラウンジェットシンバシ'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日・祝日',
    service_charge: '20%',
    website: 'https://www.sunset-lounget-shimbashi.com/',
    pricing_info: {
      basic_50min: {
        '19:00〜19:59': 4400,
        '20:00〜21:59': 5500,
        '22:00〜翌1:00': 7150
      },
      vip_room_50min: {
        '19:00〜19:59': 4950,
        '20:00〜21:59': 6600,
        '22:00〜翌1:00': 7700
      },
      extension_30min: { 'メイン': 2750, 'VIPルーム': 3300 },
      vip_kashikiri_60min: 11000,
      nomination_per_set: 2200,
      dohan_1time: 2200,
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ザ・バーレスク',
    altNames: ['ザ バーレスク', 'THE BURLESQUE'],
    city: '大阪',
    business_hours: '20:00〜Last',
    closed_days: '月曜日（祝日が重なる等し、連休になる場合は営業日程を変更する事がございます）',
    service_charge: null,
    website: 'https://www.the-burlesque.com/',
    pricing_info: {
      system_90min: {
        '20:00〜21:00': { '1名様': 6600, '2名様以上': 5500 },
        '21:00〜LAST': { '1名様': 7700, '2名様以上': 6600 }
      },
      extension: { '30min': 3300, '60min': 5500 },
      talk_request_15min: 2200,
      vip_charge_90min: 3300,
      vip_note: '1フード付。VIPはヘネシーVSも可能ですが、別途料金頂きます',
      free_drinks: '生ビール/焼酎(麦・芋)/チューハイ(レモン・ライム)/ウーロン茶　飲み放題',
      show_time: '20:30〜、22:30〜、24:00〜（ソロショータイムは随時）',
      remarks: '基本料金は1セット90分制です。基本的に飲み放題',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'シークレットガーデン京都',
    altNames: ['シークレットガーデン 京都', 'SECRET GARDEN 京都'],
    city: '京都',
    business_hours: '【昼の部】13:00〜　【夜の部】20:00〜Last',
    closed_days: '日曜日（祝日等の場合、稀に変更になる場合もございます）',
    service_charge: '25%（昼の部・夜の部共通）',
    website: 'https://www.secret-garden-kyoto.com/',
    pricing_info: {
      day_60min: {
        '13:00〜17:00': 4400
      },
      night_member_60min: {
        '19:00〜22:00': 5500,
        '22:00〜LAST': 6600
      },
      night_visitor_60min: {
        '19:00〜22:00': 6600,
        '22:00〜LAST': 7700
      },
      extension_day: { '30min': 2200, '60min': 4400 },
      extension_night: { '30min': 3850, '60min': 6600 },
      nomination_day_60min: 2200,
      nomination_night_60min: 2200,
      dohan_day: 2200,
      private_room_day_60min: 11000,
      private_room_night_60min: 11000,
      remarks: 'ハウスボトルはウイスキー、ブランデー。烏龍茶・緑茶飲み放題。金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'シークレットガーデン 神戸',
    altNames: ['シークレットガーデンコウベ', 'SECRET GARDEN 神戸'],
    city: '兵庫',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日（月曜日が祝日の場合は、日曜日営業する場合がございます）',
    service_charge: '25%',
    website: 'https://www.sg-kobe.com/',
    pricing_info: {
      system_60min: {
        '19:00〜22:00': 6600,
        '22:00〜Last': 7700
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      nomination_60min_2nd: 3300,
      dohan_1person: 2200,
      remarks: '金額はお一人様60分料金です。2人以上ご指名の場合は、2人目から指名料金は¥3,300となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'シークレットガーデン 西中島',
    altNames: ['シークレットガーデンニシナカジマ', 'SECRET GARDEN 西中島'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日（月曜日が祝日の場合、12月はイレギュラー営業させて頂く場合があります）',
    service_charge: '25%',
    website: 'https://www.secret-garden-nishinaka.com/',
    pricing_info: {
      system_60min: {
        '〜21時': 6600,
        '21時以降': 7700
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      semi_vip_charge: 2200,
      remarks: '金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'シャトリス',
    altNames: ['CHATRIS', 'クラブシャトリス'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '25%',
    website: 'https://www.club-chatris.com/',
    pricing_info: {
      system_60min: {
        '〜22時': 9900,
        '22時以降': 11000
      },
      extension: { '30min': 5500, '60min': 11000 },
      vip_room_set_60min: 13200,
      vip_room_extension: { '30min': 6600, '60min': 13200 },
      vip_room_charge_60min: 11000,
      vip_room_charge_note: '2名様以上ご利用時は、1名につき¥3,300',
      royal_vip_charge_60min: 27500,
      nomination_60min: 3300,
      nomination_multi_note: '1名のお客様が複数のご指名の場合には、1人につき+¥1,100',
      remarks: '全て税込み表記となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第八批 6个 ===
  {
    name: 'XEE',
    altNames: ['ジー', 'クラブ XEE'],
    city: '東京',
    business_hours: '20:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '30%',
    website: 'https://www.club-xee.com/',
    pricing_info: {
      main_60min: {
        '20:00〜21:59': 13200,
        '22:00〜翌1:00': 16500
      },
      vip_floor_60min: {
        '20:00〜21:59': 15400,
        '22:00〜翌1:00': 18700
      },
      royal_60min: {
        '20:00〜21:59': 19800,
        '22:00〜翌1:00': 24200
      },
      royal_vip_golf_room_60min: {
        '20:00〜21:59': 25300,
        '22:00〜翌1:00': 30800
      },
      extension_30min: {
        'メイン': 7700,
        'VIPフロア': 8800,
        'ロイヤル': 12100,
        'ロイヤルVIP': 14300
      },
      nomination_60min: 3300,
      dohan_1time: 5500,
      remarks: 'オーダー別途、お持込み料別途、自動延長制。ロイヤル/ロイヤルVIPを1名様でご利用の際は、2名様分の料金を頂戴いたします',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ジェム 錦',
    altNames: ['ジェムニシキ', 'GEMME 錦'],
    city: '愛知',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '30%',
    website: 'https://www.club-gemme-nishiki.com/',
    pricing_info: {
      main_50min: {
        '19:00〜19:59': 5000,
        '20:00〜21:59': 7000,
        '22:00〜翌1:00': 8000
      },
      vip_50min: {
        '19:00〜19:59': 6000,
        '20:00〜21:59': 8000,
        '22:00〜翌1:00': 9000
      },
      royal_vip_50min: {
        '19:00〜19:59': 10000,
        '20:00〜21:59': 12000,
        '22:00〜翌1:00': 13000
      },
      extension_30min: { 'メイン': 5000, 'VIP': 5500, 'ロイヤルVIP': 8000 },
      extension_50min: { 'メイン': 8000, 'VIP': 9000, 'ロイヤルVIP': 13000 },
      nomination: 2000,
      dohan: 3000,
      private_room_kashikiri: 30000,
      remarks: '個室貸切は、2名様以上または2名様分の料金となります。オーダー別途、お持込み料別途。個室1組貸切は、貸切料¥30,000を別途頂戴いたします。個室はボトルキープ制です(緑茶、ウーロン茶、麦茶は飲み放題)。個室は自動延長制です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ジェム 川崎',
    altNames: ['ジェムカワサキ', 'GEMME 川崎'],
    city: '神奈川',
    business_hours: '19:30〜翌1:00',
    closed_days: '日曜日',
    service_charge: 'メイン・VIP・個室（相席）: 20%、個室（貸切）: 25%',
    website: 'https://www.club-gemme-kawasaki.jp/',
    pricing_info: {
      basic_60min: {
        '19:30〜20:59': 4950,
        '21:00〜21:59': 6050,
        '22:00〜翌1:00': 7150
      },
      vip_60min: {
        '19:30〜20:59': 6050,
        '21:00〜21:59': 7150,
        '22:00〜翌1:00': 8250
      },
      private_room_shared_60min: {
        '19:30〜20:59': 7150,
        '21:00〜21:59': 8250,
        '22:00〜翌1:00': 9350,
        'note': 'カラオケ可能'
      },
      private_room_exclusive_60min: {
        '19:30〜20:59': 8800,
        '21:00〜21:59': 9900,
        '22:00〜翌1:00': 11000,
        'note': '2名以上'
      },
      extension_30min: {
        'メイン': 3850,
        'VIP': 4400,
        '個室（相席）': 4950,
        '個室（貸切）': 5500
      },
      nomination_60min: 2200,
      dohan_1time: 2750,
      remarks: '1セット60分。オーダー別途、お持込み料別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ジェムサロン 岡山',
    altNames: ['ジェムサロンオカヤマ', 'GEMME SALON 岡山'],
    city: '岡山',
    business_hours: '20:00〜LAST',
    closed_days: null,
    service_charge: '15%（別途）',
    website: 'https://www.gemme-salon-okayama.com/',
    pricing_info: {
      system_60min: {
        'ALL TIME': 6600
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination: 1650,
      dohan: 1650,
      vip_charge: 11000,
      vip_note: 'セット料金+¥11,000。VIPルームを1名様でご利用の場合には、2名様分のセット料金を頂きます',
      free_bottle: true,
      remarks: '金額はお一人様60分料金です。無料ボトルあります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ジェムサロン 草津',
    altNames: ['ジェムサロンクサツ', 'GEMME SALON 草津'],
    city: '滋賀',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '15%（別途）',
    website: 'https://www.club-gemme-salon-kusatsu.com/',
    pricing_info: {
      system_60min: {
        'OPEN〜20:59': 5500,
        '21:00〜21:59': 6600,
        '22:00〜LAST': 7700
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      nomination_60min_2nd: 5500,
      dohan: 3300,
      private_room_charge: 11000,
      free_bottle_charge: 1100,
      remarks: '金額はお一人様60分料金です。2人以降指名料金は¥5,500。フリーボトル¥1,100（税込）',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ジェムサロン 町田',
    altNames: ['ジェムサロンマチダ', 'GEMME SALON 町田'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日・祝日（祝日営業する場合もあります）',
    service_charge: '20%',
    website: 'https://www.club-gemme-salon.com/',
    pricing_info: {
      basic_60min: {
        '19:00〜20:59': 6600,
        '21:00〜21:59': 7700,
        '22:00〜翌1:00': 8800
      },
      extension_30min: 3850,
      nomination_60min: 2750,
      dohan_60min: 2200,
      vip_charge_per_60min: 1100,
      vip_note: 'メイン料金+¥1,100（60分毎）',
      executive_room: 33000,
      executive_room_extension: 5500,
      executive_room_note: '2名以上のご利用となります',
      remarks: 'オーダー別途、お持込み料別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第九批 6个 ===
  {
    name: 'ジェム 新横浜',
    altNames: ['ジェムシンヨコハマ', 'GEMME 新横浜'],
    city: '神奈川',
    business_hours: '19:00〜Last',
    closed_days: '日曜日',
    service_charge: 'メイン・セミVIP: 25%、VIP・ロイヤルVIP: 30%',
    website: 'https://www.club-gemme-shin-yokohama.jp/',
    pricing_info: {
      basic_60min: {
        '19:00〜19:59': 3850,
        '20:00〜20:59': 4950,
        '21:00〜LAST': 6050
      },
      semi_vip_60min: {
        '19:00〜19:59': 4950,
        '20:00〜20:59': 6050,
        '21:00〜LAST': 7150
      },
      vip_60min: {
        '19:00〜19:59': 6600,
        '20:00〜20:59': 7700,
        '21:00〜LAST': 8800,
        'note': 'ダーツ・カラオケ可能'
      },
      royal_vip_60min: {
        '19:00〜19:59': 7700,
        '20:00〜20:59': 9900,
        '21:00〜LAST': 12100,
        'note': 'カラオケ可能'
      },
      extension_30min: {
        'メイン': 3300,
        'セミVIP': 3850,
        'VIP': 4400,
        'ロイヤルVIP': 5500
      },
      nomination_60min: 3300,
      dohan_1time: 3300,
      vip_kashikiri_60min: 11000,
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ジェム四日市',
    altNames: ['ジェム 四日市', 'ジェムヨッカイチ', 'GEMME 四日市'],
    city: '三重',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.club-gemme-yokkaichi.com/',
    pricing_info: {
      normal_50min: {
        '〜21時': 4400,
        '21時〜': 5500,
        '22時〜': 6600
      },
      vip_50min: {
        '〜21時': 7700,
        '21時〜': 8800,
        '22時〜': 9900
      },
      extension_normal: { '30min': 4400, '50min': 6600 },
      extension_vip: { '30min': 7700, '50min': 9900 },
      nomination: 2200,
      dohan: 2200,
      remarks: '金額はお一人様50分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '翠彩',
    altNames: ['スイサイ', 'SUISAI'],
    city: '京都',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '15%',
    website: 'https://www.suisai-gion.com/',
    pricing_info: {
      member_60min: 9900,
      member_extension: { '30min': 4950, '60min': 9900 },
      visitor_60min: 11000,
      visitor_extension: { '30min': 4950, '60min': 9900 },
      vip_room_charge_60min: 22000,
      nomination: 2200,
      dohan: 3300,
      remarks: 'オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ZOO 東京',
    altNames: ['ズー トウキョウ', 'ZOO東京'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.zoo-tokyo.com/',
    pricing_info: {
      main_60min: {
        '19:00〜19:59': 6600,
        '20:00〜21:59': 8800,
        '22:00〜翌1:00': 12100
      },
      semi_vip_60min: {
        '19:00〜19:59': 7700,
        '20:00〜21:59': 9900,
        '22:00〜翌1:00': 13200
      },
      private_room_60min: {
        '19:00〜19:59': 11000,
        '20:00〜21:59': 13200,
        '22:00〜翌1:00': 17600
      },
      extension_30min: {
        'メイン': 6050,
        'セミVIP': 7150,
        '個室': 8250
      },
      nomination_60min: 3300,
      dohan_1time: 3300,
      remarks: '自動延長制、オーダー別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ZOO 金沢',
    altNames: ['ズー カナザワ', 'ZOO金沢'],
    city: '石川',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.zoo-kanazawa.com/',
    pricing_info: {
      main_60min: {
        '19:00〜19:59': 4400,
        '20:00〜21:59': 5500,
        '22:00〜翌1:00': 6600
      },
      vip_60min: {
        '19:00〜19:59': 5500,
        '20:00〜21:59': 6600,
        '22:00〜翌1:00': 7700
      },
      private_room_60min: {
        '19:00〜19:59': 7700,
        '20:00〜21:59': 9900,
        '22:00〜翌1:00': 12100
      },
      extension_30min: { 'メイン': 3300, 'VIP': 3850, '個室': 5500 },
      extension_60min: { 'メイン': 5500, 'VIP': 6600, '個室': 9900 },
      nomination_60min: 2200,
      dohan_1time: 3300,
      remarks: '1セット60分、オーダー別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ZOO 京都',
    altNames: ['ズー キョウト', 'ZOO京都'],
    city: '京都',
    business_hours: '19:00〜Last',
    closed_days: null,
    service_charge: '25%',
    website: 'https://www.club-zoo-kyoto.com/',
    pricing_info: {
      system_60min: {
        '19:00〜19:59': { '1名': 4950, '2名〜': 4400 },
        '20:00〜21:59': { '1名': 5500, '2名〜': 4950 },
        '22:00〜LAST': { '1名': 6050, '2名〜': 5500 }
      },
      extension: { '30min': 3300, '60min': 6600 },
      semi_vip_charge: 1100,
      semi_vip_note: 'システム料金+¥1,100',
      vip_room_60min: 11000,
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十批 5个 ===
  {
    name: 'ZOO 神戸',
    altNames: ['ズー コウベ', 'ZOO神戸'],
    city: '兵庫',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日（特別営業日有り）',
    service_charge: '25%',
    website: 'https://www.zoo-kobe.com/',
    pricing_info: {
      system_60min: {
        '〜20時': { '1名': 4950, '2名': 4400 },
        '〜22時': { '1名': 6050, '2名': 5500 },
        '〜23時': { '1名': 6600, '2名': 6050 },
        '23時〜': { '1名': 7150, '2名': 6600 }
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      nomination_60min_2nd: 3300,
      vip_2f_charge_60min: 2200,
      vip_3f_room_charge_60min: 11000,
      vip_3f_note: '1名様で3F VIPルーム利用の際は2名様分のセット料金となります',
      remarks: '金額はお一人様60分料金です。2人以上ご指名の場合は、2人目から指名料金は¥3,300となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ZOO 仙台',
    altNames: ['ズー センダイ', 'ZOO仙台'],
    city: '宮城',
    business_hours: '19:00〜01:00（ラストオーダー 24:30）',
    closed_days: '日曜日（祝日も変わらず営業となります）',
    service_charge: '15%',
    website: 'https://www.zoo-sendai.com/',
    pricing_info: {
      basic: {
        'OPEN〜20:59': 4400,
        '21:00〜21:59': 5500,
        '22:00〜': 6600
      },
      extension_30min: 3300,
      nomination_banai: 2200,
      nomination_bangai: 2200,
      nomination_2nd: 3300,
      dohan: 3300,
      vip_private_room: {
        'OPEN〜20:59': 3300,
        '21:00〜': 4400,
        'note': '2名様以上からの利用に限らせて戴きます'
      },
      single_charge: 1100,
      remarks: 'シングルチャージ 別途¥1,100頂きます。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ZOO ミナミ',
    altNames: ['ズー ミナミ', 'ZOOミナミ'],
    city: '大阪',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日（GWやお盆時期、年末等は特別に営業する事もございます）',
    service_charge: '25%',
    website: 'https://www.zoo-minami.com/',
    pricing_info: {
      system_60min: {
        '〜21時': 6600,
        '〜23時': 7150,
        '23時以降': 7700
      },
      private_vip_charge_60min: 11000,
      private_vip_single_charge: 16500,
      extension_before23: { '30min': 3300, '60min': 6600 },
      extension_after23: { '30min': 3850, '60min': 7700 },
      nomination_60min: 2200,
      w_nomination_60min: 4400,
      vip_charge_60min: 2200,
      remarks: '金額はお一人様60分料金です。1名様でのご利用の場合、シングルチャージは16,500円となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '17マイルドライブ 加古川',
    altNames: ['セブンティーンマイルドライブ カコガワ', '17MILE DRIVE 加古川'],
    city: '兵庫',
    business_hours: '20:00〜24:00',
    closed_days: '日曜日（日曜日特別営業あり お問い合わせください）',
    service_charge: '15%',
    website: 'https://www.17mile-drive-kakogawa.com/',
    pricing_info: {
      system_50min: {
        'OPEN〜22:00': { '2名様以上': 4400, '1名様': 5500 },
        '22:00〜LAST': { '2名様以上': 5500, '1名様': 6600 }
      },
      extension: { '30min': 3300, '50min': 5500 },
      nomination_50min: 2200,
      w_nomination: 4400,
      dohan: 0,
      free_bottle: true,
      remarks: '無料ボトルあります。オーダー別途いただきます。金額はお一人様基本50分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '禅の月',
    altNames: ['ゼンノツキ', 'ZEN NO TSUKI'],
    city: '大阪',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.zen-no-tsuki.com/',
    pricing_info: {
      system_60min: {
        '〜20時': { '1名様': 6050, '2名様以上': 5500 },
        '〜22時': { '1名様': 6600, '2名様以上': 6050 },
        '22時以降': { '1名様': 7700, '2名様以上': 7150 }
      },
      private_vip_charge_60min: 11000,
      private_vip_single_charge: 16500,
      extension: { '30min': 3850, '60min': 6600 },
      nomination_60min: 2200,
      w_nomination_60min: 4400,
      remarks: '金額はお一人様60分料金です。1名様でのご利用の場合、シングルチャージは16,500円（税込）となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十一批 4个 ===
  {
    name: 'チャリンコ 加古川',
    altNames: ['チャリンコ カコガワ', 'CHARINKO 加古川'],
    city: '兵庫',
    business_hours: '20:00〜0:00',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.charinko-kakogawa.com/',
    pricing_info: {
      charge_60min: 3300,
      charge_note: 'All time 3,300円、1セット60分制です',
      extension: { '30min': 2200, '60min': 3300 },
      remarks: 'オーダー料金別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'TSUKI NO KITANOZAKA',
    altNames: ['ツキノキタノザカ', '月の北野坂'],
    city: '兵庫',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.tsuki-no-kitanozaka.com/',
    pricing_info: {
      system_60min: {
        'OPEN〜22時': 6600,
        '22時〜23時': 7700,
        '23時〜LAST': 8800
      },
      extension_before22: { '30min': 3300, '60min': 6600 },
      extension_after22: { '30min': 3850, '60min': 7700 },
      nomination_60min: 2200,
      dohan: 2200,
      vip_room_charge_60min: 11000,
      vip_note: '別途、基本料金が必要です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '月ノ荘',
    altNames: ['ツキノソウ', 'TSUKINOSOU'],
    city: '東京',
    business_hours: '20:00〜1:00',
    closed_days: '日曜日',
    service_charge: 'メイン35%/40%、VIP40%/45%、ロイヤルルーム45%/50%（23時前後で変動）',
    website: 'https://www.club-tsukinosou.com/',
    pricing_info: {
      basic_90min: 22000,
      main: {
        'テーブルチャージ': 3300,
        '係料': 4400,
        '同伴料': 5500,
        '指名料': 4400,
        '延長料/30分': 5500,
        'サービスチャージ（〜22:59入店）': '35%',
        'サービスチャージ（23:00〜入店）': '40%'
      },
      vip: {
        'テーブルチャージ': 3300,
        'VIP・個室チャージ': 3300,
        '係料': 4400,
        '同伴料': 5500,
        '指名料': 4400,
        '延長料/30分': 7700,
        'サービスチャージ（〜22:59入店）': '40%',
        'サービスチャージ（23:00〜入店）': '45%'
      },
      royal_room: {
        'テーブルチャージ': 3300,
        'VIP・個室チャージ': 55000,
        '係料': 4400,
        '同伴料': 5500,
        '指名料': 4400,
        '延長料/30分': 7700,
        'サービスチャージ（〜22:59入店）': '45%',
        'サービスチャージ（23:00〜入店）': '50%'
      },
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '月ノ湊',
    altNames: ['ツキノミナト', 'TSUKINOMINATO'],
    city: '東京',
    business_hours: '20:00〜1:00',
    closed_days: '土・日・祝',
    service_charge: null,
    website: null,
    pricing_info: {
      remarks: '詳細料金は店舗へお問い合わせください（TEL: 03-6447-2600）',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十二批 7个 ===
  {
    name: 'テラスグリーン',
    altNames: ['TERRACE GREEN', 'テラス グリーン'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.terrace-green.com/',
    pricing_info: {
      system_60min: {
        '〜21時': 6600,
        '21時以降': 7700
      },
      extension_30min: 4400,
      nomination_60min: 2750,
      vip_room_charge_60min: 11000,
      remarks: '金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'D2',
    altNames: ['ディーツー', 'D2 ミナミ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.d2-minami.com/',
    pricing_info: {
      system: 'チャージ+飲み放題',
      shisha_available: true,
      remarks: 'シーシャあり。詳細料金は店舗へお問い合わせください',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ドルチェガールズ',
    altNames: ['DOLCE GIRLS', 'ドルチェ ガールズ'],
    city: '高知',
    business_hours: '20:00〜24:00',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.dolce-girls.com/',
    pricing_info: {
      system_60min: {
        '〜24:00': 3300
      },
      remarks: '金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ドルチェラグレス',
    altNames: ['DOLCE LUXRECE', 'ドルチェ ラグレス'],
    city: '大阪',
    business_hours: '15:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.dolce-luxrece.com/',
    pricing_info: {
      system_note: '時間帯別料金',
      vip_room_charge_60min: 11000,
      remarks: '15:00開店。詳細料金は店舗へお問い合わせください',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ドレスライン 立川',
    altNames: ['DOLES LINE 立川', 'ドレスライン タチカワ'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.club-doles-t.com/',
    pricing_info: {
      system_note: '時間帯別料金',
      vip_charge: 5500,
      remarks: '詳細料金は店舗へお問い合わせください',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ナルシス',
    altNames: ['NARCISSE', 'クラブ ナルシス'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.narcisse.jp/',
    pricing_info: {
      system_60min: {
        '〜22:00': 7700
      },
      vip_room_charge_60min: 11000,
      royal_vip_room_charge_60min: 22000,
      remarks: '金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'NANSHIKA YAMATOYA',
    altNames: ['ナンシカヤマトヤ', '南鹿大和屋'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '月曜日',
    service_charge: '25%',
    website: 'https://www.nanshika-yamatoya.com/',
    pricing_info: {
      system_note: '人数別料金',
      vip_room_charge: 13200,
      remarks: '月曜定休。詳細料金は店舗へお問い合わせください',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十三批 6个 ===
  {
    name: 'バニーバーチャリンコ',
    altNames: ['CHARINKO 松阪', 'チャリンコ 松阪'],
    city: '三重',
    business_hours: '20:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.charinko-matsusaka.com/',
    pricing_info: {
      system_40min: {
        '19:00〜20:59': 2200,
        '21:00〜21:59': 2750,
        '22:00〜LAST': 3300
      },
      extension_20min: 1650,
      free_drinks: 'オールタイムほぼ飲み放題（レッドブル・レッドブルカクテル・各種ミニボトル・テキーラコカボム以外）',
      food_from: 550,
      karaoke: '歌い放題',
      remarks: 'フード1品550円（税込）から。カラオケ歌い放題',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'バニーバーチャリンコ 高松',
    altNames: ['BBC 高松', 'チャリンコ タカマツ'],
    city: '香川',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日',
    service_charge: '5%',
    website: 'https://www.bbc-takamatsu.com/',
    pricing_info: {
      system_60min: {
        'OPEN〜21:59': 4400,
        '22:00〜LAST': 4950
      },
      extension: { '30min': 2470, '60min': 4950 },
      remarks: 'オーダー別途。金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'バニーバーチャリンコ 四日市',
    altNames: ['チャリンコ 四日市', 'CHARINKO 四日市'],
    city: '三重',
    business_hours: '18:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.charinko-yokkaichi.com/',
    pricing_info: {
      system_40min: {
        '19:00〜20:29': 2200,
        '20:30〜21:59': 2750,
        '22:00〜23:59': 3300,
        '24:00〜LAST': 3850
      },
      extension: { '20min': 1650, '40min': 3300 },
      table_seat_charge: 550,
      single_charge_per_set: 550,
      dohan: 2200,
      request_fee: 1100,
      free_drinks: '飲み放題付き',
      remarks: '上記金額はすべて飲み放題付きです。消費税込み価格。オーダー別途。テーブル席+¥550/人。シングルチャージ¥550/セット',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'バニーバーチャリンコ 奈良',
    altNames: ['チャリンコ 奈良', 'CHARINKO 奈良'],
    city: '奈良',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.charinko-nara.com/',
    pricing_info: {
      counter_60min: 3300,
      box_60min: 4400,
      extension_counter: { '30min': 2200, '60min': 3300 },
      extension_box: { '30min': 2750, '60min': 4400 },
      dohan: 1100,
      request_60min: 880,
      w_request_60min: 2200,
      remarks: '上記金額はお一人様60分料金です。オーダー料金別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'バニーラウンジB4',
    altNames: ['バニーラウンジ B4', 'BUNNY LOUNGE B4'],
    city: '神奈川',
    business_hours: '18:30〜LAST',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.bunny-lounge-b4.com/',
    pricing_info: {
      system_40min: {
        '18:30〜20:59': { '1名': 2200, '2名以上': 1650 },
        '21:00〜LAST': { '1名': 3300, '2名以上': 2750 }
      },
      extension_30min: {
        '18:30〜20:59': { '1名': 1650, '2名以上': 1100 },
        '21:00〜LAST': { '1名': 2500, '2名以上': 2000 }
      },
      extension_60min: {
        '18:30〜20:59': { '1名': 3300, '2名以上': 2200 },
        '21:00〜LAST': { '1名': 5000, '2名以上': 4000 }
      },
      nomination_40min: 2200,
      dohan_70min: 2200,
      dohan_note: '最初の1セット/40分＋ハーフセット/30分延長以上のご利用になります',
      female_guest: 'セット料金半額',
      darts: '無料',
      free_drinks: 'ウイスキー、焼酎水割り 無料',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'バニーラウンジB4 上野',
    altNames: ['バニーラウンジ B4 上野', 'BUNNY LOUNGE B4 上野'],
    city: '東京',
    business_hours: '18:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.bunny-lounge-b4-ueno.com/',
    pricing_info: {
      system_40min: {
        '18:00〜18:59': 2750,
        '19:00〜19:59': 3300,
        '20:00〜翌1:00': 3850
      },
      extension_20min: 1650,
      dohan: 2200,
      nomination_40min: 1100,
      darts_beerpong: '無料',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十四批 5个 ===
  {
    name: 'バンチオブローゼス 岐阜',
    altNames: ['BUNCH OF ROSES 岐阜', 'バンチオブローゼス ギフ'],
    city: '岐阜',
    business_hours: '19:00〜25:00',
    closed_days: '日曜日（月曜が祝日の場合、日曜に特別営業あり。要電話確認）',
    service_charge: '20%',
    website: 'https://www.bunch-of-roses-gifu.com/',
    pricing_info: {
      system_50min: {
        'OPEN〜20:59': 4400,
        '21:00〜LAST': 5500
      },
      vip_charge_per_set: 11000,
      vip_note: '2名様以上からのご利用になります',
      extension: { '30min': 3300, '50min': 5500 },
      nomination_50min: 2200,
      dohan: 2200,
      free_bottle: true,
      remarks: '金額はお一人様50分料金です。無料ボトルあり。オーダー別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'バンチオブローゼス 西中島',
    altNames: ['BUNCH OF ROSES 西中島', 'バンチオブローゼス ニシナカジマ'],
    city: '大阪',
    business_hours: '19:00〜24:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.bunch-of-roses-nishinakajima.com/',
    pricing_info: {
      system: {
        '〜21時': { '1名': 6600, '2名': 5500 },
        '21時以降': { '1名': 7700, '2名': 6600 }
      },
      extension: { '30min': 3300, '50min': 5500 },
      nomination: 2200,
      nomination_2nd: 4400,
      remarks: 'ご指名料金2名目から¥4,400頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 赤坂',
    altNames: ['ビーフォー アカサカ', 'B4 AKASAKA'],
    city: '東京',
    business_hours: '18:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '15%（23:00以降 +10%）',
    website: 'https://www.b4-akasaka.com/',
    pricing_info: {
      counter_50min: {
        '18:00〜18:59': 3300,
        '19:00〜20:59': 3850,
        '21:00〜LAST': 4400
      },
      counter_extension_20min: {
        '〜18:59': 1650,
        '〜20:59': 1980,
        '21:00〜': 2200
      },
      box_seat_60min: {
        '18:00〜18:59': 3300,
        '19:00〜20:59': 4400,
        '21:00〜LAST': 5500
      },
      box_extension_30min: {
        '〜18:59': 1650,
        '〜20:59': 2200,
        '21:00〜': 3300
      },
      request_20min: 1100,
      dohan: 3300,
      late_night_surcharge: '23:00以降 +10%',
      remarks: 'オーダー別途。お持込み料別途。飲み放題は飲み放題メニューよりお選びください。表示価格は消費税込み',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 京都',
    altNames: ['ビーフォー キョウト', 'B4 KYOTO'],
    city: '京都',
    business_hours: '18:00〜25:00',
    closed_days: '日曜日',
    service_charge: '20%（別途）',
    website: 'https://www.b4-kyoto.com/',
    pricing_info: {
      charge_60min: {
        '〜21時': 3850,
        '21時以降': 4950
      },
      sofa_charge: 550,
      extension: { '30min': 2750, '60min': 4950 },
      remarks: '会計はお一人様の料金です。オーダー別途頂きます。ソファチャージ¥550',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 草津',
    altNames: ['ビーフォー クサツ', 'B4 KUSATSU'],
    city: '滋賀',
    business_hours: '20:00〜3:00',
    closed_days: '日曜日・祝日',
    service_charge: '10%',
    website: 'https://www.b4-kusatsu.com/',
    pricing_info: {
      system_60min: 3300,
      extension: { '30min': 1650, '60min': 3300 },
      remarks: '会計はお一人様の料金です。オーダー別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十五批 6个 ===
  {
    name: 'B4 仙台',
    altNames: ['ビーフォー センダイ', 'B4 SENDAI'],
    city: '宮城',
    business_hours: '18:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.b4-sendai.com/',
    pricing_info: {
      system_50min_nomihodai: {
        '18:00〜19:59': 2200,
        '20:00〜21:59': 2750,
        '22:00〜翌1:00': 3850
      },
      extension: { '30min': 2750, '50min': 3850 },
      sofa_charge_per_set: 500,
      request_fee: 1100,
      remarks: '1セット50分。オーダー別途。お持込み料別途。飲み放題は飲み放題メニューよりお選びください。消費税込',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 立川',
    altNames: ['ビーフォー タチカワ', 'B4 TACHIKAWA'],
    city: '東京',
    business_hours: '18:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.b4-tachikawa.com/',
    pricing_info: {
      system_40min_nomihodai: {
        '18:00〜18:59': 2200,
        '19:00〜19:59': 2750,
        '20:00〜LAST': 3300
      },
      extension_20min: 1650,
      request_per_set: 1100,
      dohan_20min: 2200,
      remarks: '1セット40分。オーダー別途。お持込み料別途。飲み放題は飲み放題メニューよりお選びください。消費税込',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 広島',
    altNames: ['ビーフォー ヒロシマ', 'B4 HIROSHIMA'],
    city: '広島',
    business_hours: '20:00〜1:00',
    closed_days: null,
    service_charge: '20%',
    website: 'https://www.b4-hiroshima.com/',
    pricing_info: {
      counter_60min: 3850,
      sofa_box_60min: 4400,
      private_room_charge: 11000,
      private_room_note: 'カウンター席料金に+11,000円',
      extension_counter: { '30min': 2200, '60min': 3850 },
      extension_sofa_box: { '30min': 2200, '60min': 4400 },
      sofa_box_single_surcharge: 550,
      remarks: '料金表記は1セット60分となります。ソファBOX席は1名様でのご利用は+550円となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 町田',
    altNames: ['ビーフォー マチダ', 'B4 MACHIDA'],
    city: '東京',
    business_hours: '18:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.b4-machida.com/',
    pricing_info: {
      counter_40min: {
        '18:00〜19:59': 2750,
        '20:00〜LAST': 3300
      },
      extension_20min: 1650,
      request_40min: 1100,
      dohan: 2200,
      remarks: 'オーダー別途。お持込み料別途。飲み放題は飲み放題メニューよりお選びください。消費税込',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 上野',
    altNames: ['ビーフォー ウエノ', 'B4 UENO GIRLS BAR'],
    city: '東京',
    business_hours: '18:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '15%（0:00以降 +5%）',
    website: 'https://www.b4-ueno-girls-bar.com/',
    pricing_info: {
      system_40min_nomihodai: {
        '18:00〜18:59': 2950,
        '19:00〜19:59': 3520,
        '20:00〜LAST': 4070
      },
      extension_20min: 1650,
      request_per_set: 1100,
      dohan: 2200,
      late_night_surcharge: '0:00以降 +5%',
      remarks: '1セット40分。オーダー別途。お持込み料別途。飲み放題は飲み放題メニューよりお選びください',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 梅田',
    altNames: ['ビーフォー ウメダ', 'B4 UMEDA'],
    city: '大阪',
    business_hours: '18:00〜1:00',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.b4-umeda.com/',
    pricing_info: {
      plan_a_18_to_21: {
        'チャージ料金': 1650,
        'チャージ料金_2h目以降': 1100,
        '+飲み放題(スタンダード)': 2200,
        '+飲み放題(プレミアム)': 2750
      },
      plan_b_21_to_1: {
        'チャージ料金': 2200,
        'チャージ料金_2h目以降': 1100,
        '+飲み放題(スタンダード)': 2750,
        '+飲み放題(プレミアム)': 3300
      },
      drinks_standard: 'ハイボール/チューハイ/焼酎(麦・芋)/ウイスキー/烏龍茶',
      drinks_premium: '(スタンダード含む)ビール/グラスワイン(赤・白)/ソフトドリンク',
      remarks: '1SET/60min',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十六批 6个 ===
  {
    name: 'B4 神田',
    altNames: ['ビーフォー カンダ', 'B4 KANDA'],
    city: '東京',
    business_hours: '17:00〜翌1:00',
    closed_days: '日曜日・祝日',
    service_charge: '15%（22:00以降 +10%）',
    website: 'https://www.b4-kanda.com/',
    pricing_info: {
      counter_40min_nomihodai: {
        '17:00〜18:59': 2750,
        '19:00〜19:59': 3300,
        '20:00〜翌1:00': 3850
      },
      private_room_60min_nomihodai: {
        '17:00〜翌1:00': 3300
      },
      extension_counter_20min: 1650,
      extension_private_30min: 1650,
      private_room_kashikiri_60min: 11000,
      request_per_set: 1650,
      late_night_surcharge: '22:00以降 +10%',
      remarks: 'オーダー別途。お持込み料別途。個室利用は2名様からとなります。消費税込',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'B4 新橋',
    altNames: ['ビーフォー シンバシ', 'B4 SHIMBASHI'],
    city: '東京',
    business_hours: '17:00〜翌1:00',
    closed_days: '日曜日・祝日',
    service_charge: '15%（22:00以降 +10%）',
    website: 'https://www.b4-shimbashi.com/',
    pricing_info: {
      system_40min_nomihodai: {
        '17:00〜18:59': 3300,
        '19:00〜19:59': 3630,
        '20:00〜LAST': 4180
      },
      extension_20min: 1925,
      request_per_set: 1100,
      late_night_surcharge: '22:00以降 +10%',
      remarks: '1セット40分。オーダー別途。お持込み料別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 上野',
    altNames: ['ビジンチャヤ ウエノ', 'BIJIN CHAYA 上野'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: 'メイン・セミVIP・ロイヤルVIP 25%、ロイヤルスウィート 30%',
    website: 'https://www.bijin-chaya-ueno.com/',
    pricing_info: {
      main_60min: {
        '19:00〜20:59': 7700,
        '21:00〜21:59': 8800,
        '22:00〜翌1:00': 11000
      },
      semi_vip_60min: {
        '19:00〜20:59': 8800,
        '21:00〜21:59': 9900,
        '22:00〜翌1:00': 12100
      },
      royal_vip_60min: {
        '19:00〜20:59': 11000,
        '21:00〜21:59': 12100,
        '22:00〜翌1:00': 15400
      },
      royal_suite_60min: {
        '19:00〜20:59': 11000,
        '21:00〜21:59': 12100,
        '22:00〜翌1:00': 15400
      },
      extension_30min: {
        'メイン': 4400,
        'セミVIP': 5500,
        'ロイヤルVIP': 7150,
        'ロイヤルスウィート': 7150
      },
      nomination_60min: 2750,
      dohan: 2750,
      remarks: '1セット60分です。オーダー別途頂きます。お持込み料別途頂きます。ボトルキープ期間は3ヶ月となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 梅田',
    altNames: ['ビジンチャヤ ウメダ', 'BIJIN CHAYA 梅田'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '25%',
    website: 'https://www.bijin-chaya-umeda.jp/',
    pricing_info: {
      system_60min: {
        '19:00〜20:59': 6600,
        '21:00〜22:59': 7700,
        '23:00〜': 9900
      },
      extension: {
        '19:00〜20:59': { '30min': 3300, '60min': 6600 },
        '21:00〜22:59': { '30min': 3850, '60min': 7700 },
        '23:00〜': { '30min': 4950, '60min': 9900 }
      },
      vip_room_charge: {
        '座敷': 11000,
        '朱雀': 16500,
        '青龍': 16500,
        '白虎': 22000
      },
      house_bottle: 1100,
      remarks: '金額はお一人様60分料金です。オーダー別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 岡山',
    altNames: ['ビジンチャヤ オカヤマ', 'BIJIN CHAYA 岡山'],
    city: '岡山',
    business_hours: '20:00〜1:00',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.bijin-chaya-okayama.jp/',
    pricing_info: {
      system_60min: 7700,
      extension: { '30min': 4400, '50min': 7700 },
      nomination: 1650,
      vip_charge: 11000,
      vip_note: '1名様でご利用の場合には、セット料金を2名様分頂きます',
      remarks: '金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 金沢',
    altNames: ['ビジンチャヤ カナザワ', 'BIJIN CHAYA 金沢'],
    city: '石川',
    business_hours: '20:00〜Last',
    closed_days: '日曜日・祝日',
    service_charge: '20%',
    website: 'https://www.bijin-chaya-kanazawa.jp/',
    pricing_info: {
      system_60min: 7700,
      extension: { '30min': 3850, '60min': 7700 },
      nomination: 2200,
      nomination_2nd: 6600,
      dohan: 3300,
      private_room_charge_60min: {
        '石の間': 11000,
        '銅の間': 11000,
        '銀の間': 11000,
        '金の間': 11000,
        '木の間': 22000
      },
      house_bottle: 1100,
      vip_floor_charge_60min: 1100,
      bring_in_fee: 2200,
      remarks: 'オーダー別途いただきます。個室は自動延長となります。個室利用はSET料金別途いただきます。金額はお一人様60分料金です。指名料は2人目から¥6,600となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十七批 6个 ===
  {
    name: '美人茶屋 新橋',
    altNames: ['ビジンチャヤ シンバシ', 'BIJIN CHAYA 新橋'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.bijin-chaya-shimbashi.com/',
    pricing_info: {
      main_60min: {
        '19:00〜19:59': 6600,
        '20:00〜21:59': 7700,
        '22:00〜翌1:00': 8800
      },
      vip_60min: {
        '19:00〜19:59': 7700,
        '20:00〜21:59': 8800,
        '22:00〜翌1:00': 9900
      },
      private_room_60min: {
        '19:00〜19:59': 11000,
        '20:00〜21:59': 13200,
        '22:00〜翌1:00': 16500
      },
      extension_30min: { 'メイン': 4400, 'VIP': 5500, '個室': 7700 },
      nomination_60min: 2750,
      dohan: 2750,
      private_room_note: '個室のご利用は2名様以上。1名様でご利用の際は2名様分の料金となります',
      female_guest: '半額',
      remarks: '1セット60分。オーダー別途。お持込み料別途。自動延長制。ボトルキープ期間は3ヶ月',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 高松',
    altNames: ['ビジンチャヤ タカマツ', 'BIJIN CHAYA 高松'],
    city: '香川',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.bijin-chaya-takamatsu.jp/',
    pricing_info: {
      system_50min: {
        'OPEN〜22:00': 5950,
        '22:00〜25:00': 6500
      },
      extension: { '30min': 3300, '50min': 6500 },
      nomination: 1650,
      dohan: 1650,
      vip_charge: 11000,
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 北新地',
    altNames: ['ビジンチャヤ キタシンチ', 'BIJIN CHAYA 北新地'],
    city: '大阪',
    business_hours: '20:00〜Last',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.bijin-chaya-kitashinchi.jp/',
    pricing_info: {
      system_60min: {
        '〜23時': 9900,
        '23時〜': 11000
      },
      extension: {
        '〜23時': { '30min': 5500, '60min': 9900 },
        '23時〜': { '30min': 5500, '60min': 11000 }
      },
      nomination_60min: 3300,
      dohan: 3300,
      vip_room_charge: 27500,
      remarks: '金額はお一人様60分料金です。オーダー料別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 新宿',
    altNames: ['ビジンチャヤ シンジュク', 'BIJIN CHAYA 新宿'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: 'メイン・セミVIP・ロイヤルVIP 25%、ロイヤルスウィート 30%',
    website: 'https://www.bijin-chaya-shinjuku.com/',
    pricing_info: {
      main_60min: {
        '19:00〜19:59': 6600,
        '20:00〜20:59': 7700,
        '21:00〜21:59': 8800,
        '22:00〜翌1:00': 11000
      },
      semi_vip_60min: {
        '19:00〜20:59': 8800,
        '21:00〜21:59': 9900,
        '22:00〜翌1:00': 12100
      },
      royal_vip_60min: {
        '19:00〜20:59': 11000,
        '21:00〜21:59': 13200,
        '22:00〜翌1:00': 16500
      },
      royal_suite_60min: {
        '19:00〜20:59': 11000,
        '21:00〜21:59': 13200,
        '22:00〜翌1:00': 16500
      },
      extension_30min: {
        'メイン': 4950,
        'セミVIP': 6050,
        'ロイヤルVIP': 8250,
        'ロイヤルスウィート': 8250
      },
      nomination_60min: 3300,
      dohan: 3300,
      remarks: '1セット60分です。オーダー別途頂きます。お持込み料別途頂きます。ボトルキープ期間は3ヶ月となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 六本木',
    altNames: ['ビジンチャヤ ロッポンギ', 'BIJIN CHAYA 六本木'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日（祝日休業する場合もあります）',
    service_charge: '30%',
    website: 'https://www.bijin-chaya-roppongi.com/',
    pricing_info: {
      main_60min: {
        '19:00〜19:59': 8800,
        '20:00〜21:59': 11000,
        '22:00〜翌1:00': 14300
      },
      semi_vip_60min: {
        '19:00〜19:59': 9900,
        '20:00〜21:59': 12100,
        '22:00〜翌1:00': 15400
      },
      royal_vip_60min: {
        '19:00〜19:59': 13200,
        '20:00〜21:59': 15400,
        '22:00〜翌1:00': 19800
      },
      royal_private_60min: {
        '19:00〜19:59': 15400,
        '20:00〜21:59': 17600,
        '22:00〜翌1:00': 22000
      },
      extension_30min: {
        'メイン': 7150,
        'セミVIP': 7700,
        'ロイヤルVIP': 9900,
        'ロイヤルプライベート': 11000
      },
      nomination_60min: 3300,
      dohan: 5500,
      remarks: '1セット60分。オーダー別途。お持込み料別途。当店は自動延長制になっております',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 祇園',
    altNames: ['ビジンチャヤ ギオン', 'BIJIN CHAYA 祇園'],
    city: '京都',
    business_hours: '20:00〜Last',
    closed_days: '日曜日・祝日',
    service_charge: '15%',
    website: 'https://www.bijin-chaya-gion.jp/',
    pricing_info: {
      floor_1f_60min: 9900,
      floor_1f_60min_3plus_before_22: 7700,
      floor_2f_60min: 12100,
      extension: { '30min': 4400, '60min': 8800 },
      nomination: 2200,
      dohan: 3300,
      vip_room_charge_60min: {
        '金の間': 8800,
        '銀の間': 13200,
        '北斎の間': 11000,
        '宝の間': 22000,
        '輝の間': 22000
      },
      remarks: '金額はお一人様60分料金です。消費税込価格',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十八批 6个 ===
  {
    name: '美人茶屋 神戸',
    altNames: ['ビジンチャヤ コウベ', 'BIJIN CHAYA 神戸'],
    city: '兵庫',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日（特別営業有）',
    service_charge: '25%',
    website: 'https://www.bijin-chaya-kobe.jp/',
    pricing_info: {
      main_60min: {
        '〜21:00': 7700,
        '21:00〜23:00': 8800,
        '23:00〜': 9900
      },
      vip_60min: 11000,
      royal_vip_60min: 22000,
      extension: { '30min': 4400, '60min': 8800 },
      nomination: 2200,
      dohan: 2200,
      remarks: '金額はお一人様60分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 広島',
    altNames: ['ビジンチャヤ ヒロシマ', 'BIJIN CHAYA 広島'],
    city: '広島',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日（連休中営業あり）',
    service_charge: '20%',
    website: 'https://www.bijin-chaya-hiroshima.jp/',
    pricing_info: {
      all_time_60min: 8250,
      vip_60min: 11000,
      extension: { '30min': 4400, '60min': 8250 },
      nomination: 2200,
      dohan: 2200,
      remarks: '金額はお一人様60分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美人茶屋 ミナミ',
    altNames: ['ビジンチャヤ ミナミ', 'BIJIN CHAYA ミナミ', '美人茶屋'],
    city: '大阪',
    business_hours: '20:00〜Last',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.bijin-chaya.jp/',
    pricing_info: {
      main_60min: {
        '〜22:00': 7700,
        '22:00〜24:00': 8800,
        '24:00〜': 9900
      },
      vip_60min: {
        '2名様': 11000,
        '3名様以上': 9900
      },
      extension: { '30min': 4400, '60min': 8800 },
      nomination: 2200,
      dohan: 2200,
      remarks: '金額はお一人様60分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ビゼ 上野',
    altNames: ['BISSER 上野', 'Bisser 上野'],
    city: '東京',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: 'メイン25%・VIP30%',
    website: 'https://www.bisser-ueno.club/',
    pricing_info: {
      main_60min: {
        '〜20:00': 6600,
        '20:00〜22:00': 7700,
        '22:00〜': 8800
      },
      vip_60min: {
        '〜20:00': 8800,
        '20:00〜22:00': 9900,
        '22:00〜': 11000
      },
      extension_30min: { 'メイン': 4400, 'VIP': 5500 },
      nomination: 2200,
      dohan: 3300,
      remarks: '金額はお一人様60分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ビゼ 新宿',
    altNames: ['BISSER 新宿', 'Bisser 新宿'],
    city: '東京',
    business_hours: '20:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: 'メイン25%・VIP30%',
    website: 'https://www.bisser-shinjuku.club/',
    pricing_info: {
      main_60min: {
        '〜21:00': 7700,
        '21:00〜23:00': 8800,
        '23:00〜': 9900
      },
      vip_60min: {
        '〜21:00': 9900,
        '21:00〜23:00': 11000,
        '23:00〜': 13200
      },
      extension_30min: { 'メイン': 4400, 'VIP': 5500 },
      nomination: 2200,
      dohan: 3300,
      remarks: '金額はお一人様60分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ビゼ 中洲',
    altNames: ['BISSER 中洲', 'Bisser 中洲'],
    city: '福岡',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '20%',
    website: 'https://www.bisser-nakasu.com/',
    pricing_info: {
      all_time_60min: 11000,
      vip_60min: 22000,
      extension: { '30min': 5500, '60min': 11000 },
      nomination: 2200,
      dohan: 3300,
      remarks: '金額はお一人様60分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第十九批 6个 ===
  {
    name: 'ビゼ 広島',
    altNames: ['BISSER 広島', 'Bisser 広島', 'ビゼ ヒロシマ'],
    city: '広島',
    business_hours: '20:00〜LAST',
    closed_days: null,
    service_charge: '25%',
    website: 'https://www.bisser-hiroshima.com/',
    pricing_info: {
      system_60min: 7700,
      extension: { '30min': 4400, '60min': 7700 },
      vip_room_60min: 22000,
      nomination_60min: 2200,
      nomination_60min_2nd: 4400,
      dohan: 2200,
      single_charge_60min: 1100,
      remarks: '金額はお一人様60分料金です。指名料は二人目から¥4,400',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ビゼ 池袋',
    altNames: ['BISSER 池袋', 'Bisser 池袋', 'ビゼイケブクロ'],
    city: '東京',
    business_hours: '19:00〜Last',
    closed_days: '日曜日',
    service_charge: 'メイン・セミVIP 25%、ロイヤルVIP 30%',
    website: 'https://www.bisser-ikebukuro.club/',
    pricing_info: {
      main_60min: {
        'OPEN〜20:59': 6600,
        '21:00〜21:59': 8800,
        '22:00〜LAST': 9900
      },
      semi_vip_60min: {
        'OPEN〜20:59': 8800,
        '21:00〜21:59': 11000,
        '22:00〜LAST': 12100
      },
      royal_vip_60min: {
        'OPEN〜20:59': 16500,
        '21:00〜21:59': 16500,
        '22:00〜LAST': 16500,
        '貸切（3名以下）': 27500
      },
      extension_30min: { 'メイン': 4400, 'セミVIP': 5500, 'ロイヤルVIP': 7700 },
      nomination_60min: 3300,
      dohan: 3300,
      remarks: '消費税込み。オーダー料別途。お持込料別途。1セット60分。当店は自動延長制となっております',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ビゼ 北新地',
    altNames: ['BISSER 北新地', 'Bisser 北新地', 'ビゼキタシンチ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '25%',
    website: 'https://www.bisser.jp/',
    pricing_info: {
      system_60min: {
        '〜21時': 9900,
        '21時以降': 11000
      },
      extension: { '30min': 5500, '60min': 11000 },
      nomination_60min: 3300,
      dohan: 3300,
      vip_room_charge_60min: 27500,
      remarks: '※上記金額はお一人様の60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ビゼ 祇園',
    altNames: ['BISSER 祇園', 'Bisser 祇園', 'ビゼギオン'],
    city: '京都',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.bisser-gion.com/',
    pricing_info: {
      all_time_60min: 11000,
      semi_vip_60min: 13200,
      extension: { '30min': 5500, '60min': 11000 },
      extension_semi_vip: { '30min': 6600, '60min': 13200 },
      nomination: 2200,
      dohan: 3300,
      vip_room_charge: {
        '松': 22000,
        '竹': 11000,
        '梅': 16500
      },
      remarks: '金額はお一人様60分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ビゼ ミナミ',
    altNames: ['BISSER ミナミ', 'Bisser ミナミ', 'ビゼミナミ'],
    city: '大阪',
    business_hours: '20:00〜1:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.club-bisser.jp/',
    pricing_info: {
      all_time_60min: 11000,
      semi_vip_charge_60min: 1100,
      extension: { '30min': 5500, '60min': 9900 },
      vip_room_charge_60min: 22000,
      nomination_60min: 3300,
      nomination_60min_2nd: 5500,
      dohan: 3300,
      remarks: '金額はお一人様60分料金です。オーダー別途いただきます。指名料は2人目から¥5,500',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '美ノ間 六本木',
    altNames: ['ビノマ 六本木', 'BINOMA 六本木', 'Club 美ノ間'],
    city: '東京',
    business_hours: '20:00〜翌1:00',
    closed_days: '土曜日・日曜日・祝日',
    service_charge: 'メイン・VIP 〜22:59入店33%/23:00〜38%、ロイヤルルーム 〜22:59入店43%/23:00〜48%',
    website: 'https://www.club-binoma.com/',
    pricing_info: {
      base_90min: 20900,
      table_charge: { 'メイン': 3300, 'VIP': 3300, 'ロイヤルルーム': 3300 },
      vip_royal_charge: { 'VIP': 3300, 'ロイヤルルーム': 55000 },
      kakari_fee: { 'メイン': 4400, 'VIP': 4400, 'ロイヤルルーム': 4400 },
      dohan: { 'メイン': 4400, 'VIP': 4400, 'ロイヤルルーム': 4400 },
      nomination: { 'メイン': 3300, 'VIP': 3300, 'ロイヤルルーム': 3300 },
      extension_30min: { 'メイン': 4400, 'VIP': 6600, 'ロイヤルルーム': 6600 },
      service_charge_before_23: { 'メイン': '33%', 'VIP': '33%', 'ロイヤルルーム': '43%' },
      service_charge_after_23: { 'メイン': '38%', 'VIP': '38%', 'ロイヤルルーム': '48%' },
      remarks: '基本料金1set90分¥20,900。消費税10%込み。オーダー別途。クレジットカード:VISA・JCB・アメックス・Master・ダイナース・銀聯カード',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第二十批 5个 ===
  {
    name: 'ピースオブチョコレート 仙台',
    altNames: ['POC 仙台', 'ピースオブチョコレート センダイ'],
    city: '宮城',
    business_hours: '19:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '10%',
    website: 'https://www.poc-sendai.com/',
    pricing_info: {
      system_40min_nomihodai: {
        '19:00〜20:29': 2200,
        '20:30〜21:59': 2750,
        '22:00〜1:00': 3300
      },
      extension_40min_nomihodai: 3300,
      dohan: 2200,
      remarks: '飲み放題付き40分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ピースオブチョコレート 広島',
    altNames: ['POC 広島', 'ピースオブチョコレート ヒロシマ'],
    city: '広島',
    business_hours: '19:00〜25:00',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.poc-hiroshima.com/',
    pricing_info: {
      all_time_60min: 3300,
      extension: { '30min': 2200, '60min': 3300 },
      vip_charge: 11000,
      remarks: '※1set60分制となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'フィッツ 岐阜',
    altNames: ['FITS 岐阜', 'フィッツギフ'],
    city: '岐阜',
    business_hours: '19:00〜25:00',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.fits-gifu.com/',
    pricing_info: {
      system_50min: {
        'OPEN〜19:59': 4400,
        '20:00〜21:59': 5500,
        '22:00〜LAST': 6600
      },
      semi_vip_charge: 1100,
      private_vip_room_charge: 11000,
      extension: { '30min': 3300, '50min': 5500 },
      nomination_50min: 2200,
      dohan: 2200,
      remarks: '金額はお一人様50分料金です。無料ボトルあり。オーダー別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'フィッツ 神戸',
    altNames: ['FITS 神戸', 'フィッツコウベ'],
    city: '兵庫',
    business_hours: '20:00〜25:00',
    closed_days: '月曜日（随時変更あり）',
    service_charge: '25%',
    website: 'https://www.fits-kobe.com/',
    pricing_info: {
      system_50min: {
        '〜22:00': 5500,
        '22:00以降': 6600
      },
      extension: { '30min': 3300, '50min': 5500 },
      private_room_charge_50min: 11000,
      private_room_extension: { '30min': 11000, '50min': 11000 },
      private_room_shared_50min: {
        '〜22:00': 7700,
        '22:00以降': 8800
      },
      private_room_shared_extension: { '30min': 5500, '50min': 7700 },
      nomination_50min: 2200,
      dohan: 2200,
      remarks: 'サービス料別途25%いただきます。オーダー別途いただきます。無料ボトルあり。金額はお一人様50分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'フィッツ 奈良',
    altNames: ['FITS 奈良', 'フィッツナラ'],
    city: '奈良',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.fits-nara.com/',
    pricing_info: {
      system_50min: {
        '〜21:00': { 'メンバー': 4400, 'ビジター': 5500 },
        '21:00以降': { 'メンバー': 5500, 'ビジター': 6600 }
      },
      extension: { '30min': 3300, '50min': 5500 },
      nomination_50min: 2200,
      w_nomination_50min: 4400,
      vip_charge_50min: 11000,
      vip_extension_30min: 5500,
      remarks: '※無料ボトル有ります。※金額はお一人様50分料金です。※オーダー別途いただきます。※サービス料別途20%頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第二十一批 8个 ===
  {
    name: 'ベロア 岡山',
    altNames: ['VELOURS 岡山', 'ベロア オカヤマ'],
    city: '岡山',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.velours-okayama.com/',
    pricing_info: {
      system_60min: 6600,
      extension: { '30min': 3300, '50min': 6600 },
      nomination: 1650,
      dohan: 1100,
      vip_charge: 11000,
      remarks: '金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ベロア 北新地',
    altNames: ['VELOURS 北新地', 'ベロア キタシンチ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '25%',
    website: 'https://www.velours-kitashinchi.com/',
    pricing_info: {
      main_floor_all_time_60min: 11000,
      executive_floor_all_time_60min: 11000,
      extension: { '30min': 5500, '60min': 11000 },
      nomination_60min: 3300,
      dohan: 3300,
      vip_room_charge_60min: 22000,
      house_bottle: 1100,
      remarks: '金額はお一人様60分料金です。ハウスボトル料金¥1,100（税込）です。オーダー別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ベロア 神戸',
    altNames: ['VELOURS 神戸', 'ベロア コウベ'],
    city: '兵庫',
    business_hours: '20:00〜01:00',
    closed_days: '日曜日・祝日（祝日が金曜・土曜と週末の際は営業）',
    service_charge: '25%',
    website: 'https://www.velours-kobe.com/',
    pricing_info: {
      system_60min: {
        '〜22時': 6600,
        '〜23時': 7700,
        '23時〜': 8800
      },
      extension_before_22: { '30min': 3300, '60min': 6600 },
      extension_after_22: { '30min': 3850, '60min': 7700 },
      private_room_60min: 11000,
      nomination: 2200,
      dohan: 2200,
      remarks: '金額はお一人様60分料金です。オーダー別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ベロア 仙台',
    altNames: ['VELOURS 仙台', 'ベロア センダイ'],
    city: '宮城',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日（祝日特別休業や合同営業の場合あり）',
    service_charge: null,
    website: 'https://www.velours-sendai.com/',
    pricing_info: {
      system_60min: {
        'OPEN〜20:59': 4950,
        '21:00〜21:59': 6050,
        '22:00〜LAST': 7150
      },
      single_charge: 1100,
      extension: { '30min': 3300, '60min': 6600 },
      nomination_jonai: 2200,
      nomination_jogai: 2750,
      dohan: 3300,
      vip_charge: {
        'OPEN〜20:59': 9350,
        '21:00〜21:59': 12650,
        '22:00〜LAST': 13750
      },
      vip_extension: { '30min': 6000, '60min': 13200 },
      remarks: '※シングルチャージ別途¥1,100頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ベロア 十三',
    altNames: ['VELOURS 十三', 'ベロアジュウソウ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.velours-juso.com/',
    pricing_info: {
      system_60min: {
        '20時〜21時': { '1名様': 5500, '2名様以上': 4950 },
        '21時以降': { '1名様': 6600, '2名様以上': 6050 }
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      semi_vip_charge: 2200,
      private_vip_charge_hourly: 11000,
      dohan: 2200,
      remarks: '※金額はお一人様60分制料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ポニーテール 堺東',
    altNames: ['PONYTAIL 堺東', 'ポニーテールサカイヒガシ'],
    city: '大阪',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.club-ponytail.com/',
    pricing_info: {
      system_60min: {
        '〜21時': { '1名': 4950, '2名': 4400 },
        '〜22時': { '1名': 6050, '2名': 5500 },
        '22時以降': { '1名': 7150, '2名': 6600 }
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      nomination_60min_2nd: 4400,
      dohan: 2200,
      remarks: '金額はお一人様60分料金です。2人以上ご指名の場合は、2人目から指名料金は¥4,400となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミスト ミナミ',
    altNames: ['MIST ミナミ', 'ミストミナミ'],
    city: '大阪',
    business_hours: '18:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.club-mist.jp/',
    pricing_info: {
      main_60min_nomihodai: {
        '18:00〜20:59': 4950,
        '21:00〜22:59': 5500,
        '23:00〜翌1:00': 6600
      },
      extension: {
        '18:00〜20:59': { '30min': 2750, '60min': 4950 },
        '21:00〜22:59': { '30min': 3300, '60min': 5500 },
        '23:00〜翌1:00': { '30min': 3300, '60min': 5500 }
      },
      nomination: 2200,
      remarks: '※全て税込価格です。※オーダー別途いただきます。※金額はおひとり様60分料金です。飲み飲ませ放題（キャストのドリンク代も含まれています）',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミュゼルヴァ 中洲',
    altNames: ['MUSERVA 中洲', 'ミュゼルヴァ ナカス'],
    city: '福岡',
    business_hours: '20:00〜翌1:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.club-muserva-nakasu.com/',
    pricing_info: {
      main_60min: {
        '20:00〜20:59': 7700,
        '21:00〜21:59': 8800,
        '22:00〜翌1:00': 9900
      },
      semi_vip_60min: {
        '20:00〜20:59': 8800,
        '21:00〜21:59': 9900,
        '22:00〜翌1:00': 12100
      },
      private_60min: {
        '20:00〜20:59': 11000,
        '21:00〜21:59': 14300,
        '22:00〜翌1:00': 16500
      },
      extension_30min: { 'メイン': 4950, 'セミVIP': 6050, '個室': 8250 },
      nomination_60min: 2200,
      dohan: 3300,
      private_note: '個室のご利用は2名様以上。1名様でご利用の際は2名様分の料金となります',
      female_guest: '半額',
      remarks: '※1セット60分。※オーダー別途。※お持込み料別途。※当店は自動延長制になっております。※ボトルキープ期間は3ヶ月となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第二十二批 6个 ===
  {
    name: 'ミュゼルヴァ 六本木',
    altNames: ['MUSERVA 六本木', 'ミュゼルヴァ ロッポンギ'],
    city: '東京',
    business_hours: '20:00〜翌1:00',
    closed_days: '日曜日・祝日（祝日営業する場合もあり）',
    service_charge: '〜22:59 30%、23:00〜 35%',
    website: 'https://www.club-muserva.com/',
    pricing_info: {
      main_60min: {
        '20:00〜20:59': 12100,
        '21:00〜21:59': 14300,
        '22:00〜LAST': 16500
      },
      vip_60min: {
        '20:00〜20:59': 17600,
        '21:00〜21:59': 19800,
        '22:00〜LAST': 22000
      },
      premier_vip_60min: {
        '20:00〜20:59': 23100,
        '21:00〜21:59': 25300,
        '22:00〜LAST': 27500
      },
      royal_vip_60min: {
        '20:00〜20:59': 23100,
        '21:00〜21:59': 25300,
        '22:00〜LAST': 27500
      },
      extension_30min: { 'メイン': 6600, 'VIP/Premier VIP/Royal VIP': 9900 },
      private_rental: { 'Premier VIP': 33000, 'Royal VIP': 55000 },
      nomination_60min: 3300,
      dohan: 5500,
      cigar_charge: 1100,
      private_note: '個室VIPルームを1名様でご利用の際は、2名様分の料金を頂戴いたします',
      remarks: '消費税込み。オーダー別途。お持込料別途。シガーチャージ別途¥1,100。上記金額はお一人様の料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミュゼルヴァ 北新地',
    altNames: ['MUSERVA 北新地', 'ミュゼルヴァキタシンチ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '25%',
    website: 'https://www.muserva.com/',
    pricing_info: {
      main_floor_60min: {
        '〜21時': 9900,
        '21時以降': 11000
      },
      executive_floor_60min: {
        '〜21時': 12100,
        '21時以降': 13200
      },
      semi_vip_charge: 5500,
      vip_room_charge: 27500,
      extension_main: { '30min': 5500, '60min': 11000 },
      extension_executive: { '30min': 7700, '60min': 13200 },
      nomination_60min: 3300,
      dohan: 3300,
      house_bottle: 1100,
      remarks: 'ハウスボトル料金¥1,100。上記金額はお一人様の60分料金です。オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミュゼルヴァ 祇園',
    altNames: ['MUSERVA 祇園', 'ミュゼルヴァギオン'],
    city: '京都',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.muserva-gion.com/',
    pricing_info: {
      system_60min: {
        'メンバー通常': 8800,
        'メンバーセミVIP': 9900,
        'ビジター通常': 9900,
        'ビジターセミVIP': 11000
      },
      extension: { '30min': 4400, '60min': 8800 },
      nomination_60min: 2200,
      dohan: 3300,
      vip_room_charge: { '楽園': 11000, '雲海': 22000 },
      remarks: '金額はお一人様60分料金です。VIPチャージ料金は別途必要です。お車までご来店のお客様はお酒はご遠慮下さい。18歳未満の方のご入店はお断りいたします',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミュゼルヴァ 神戸',
    altNames: ['MUSERVA 神戸', 'ミュゼルヴァコウベ'],
    city: '兵庫',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.muserva-kobe.com/',
    pricing_info: {
      system_60min: {
        '〜22時': 6600,
        '〜23時': 7700,
        '23時〜': 8800
      },
      extension_before_22: { '30min': 3300, '60min': 6600 },
      extension_after_22: { '30min': 3850, '60min': 7700 },
      nomination: 2200,
      w_nomination_additional: 3300,
      dohan: 2200,
      vip_charge_60min: 11000,
      remarks: '○表は基本的にお一人様60分料金です。○オーダー別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミュゼルヴァ 広島',
    altNames: ['MUSERVA 広島', 'ミュゼルヴァヒロシマ'],
    city: '広島',
    business_hours: '20:00〜Last',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.muserva-hiroshima.com/',
    pricing_info: {
      all_time_60min: 8250,
      extension: { '30min': 4400, '60min': 8250 },
      nomination_60min: 2200,
      w_nomination: 3300,
      dohan_60min: 2200,
      dohan_w: 3300,
      vip_room_charge_60min: 11000,
      royal_vip_room_charge_60min: 16500,
      remarks: '※オーダー別途いただきます。※金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミュゼルヴァ ミナミ',
    altNames: ['MUSERVA ミナミ', 'ミュゼルヴァミナミ'],
    city: '大阪',
    business_hours: '20:00〜Last',
    closed_days: '日曜日・祝日',
    service_charge: '25%',
    website: 'https://www.muserva-minami.com/',
    pricing_info: {
      all_time_60min: { '1名様': 11000, '2名様以上': 9900 },
      extension: { '30min': 4950, '60min': 9900 },
      nomination_60min: 3300,
      dohan: 3300,
      semi_vip_charge_60min: 2200,
      vip_room_charge_60min: 12100,
      royal_vip_room_charge_60min: 23100,
      remarks: '金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第二十三批 6个 ===
  {
    name: 'ミリブルー 高槻',
    altNames: ['MIRI BLUE 高槻', 'ミリブルー タカツキ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.miri-blue.com/',
    pricing_info: {
      system_50min_member: {
        '〜21時': 5500,
        '21時以降': 6600
      },
      system_50min_visitor: {
        '〜21時': 6600,
        '21時以降': 7700
      },
      extension: { '30min': 3850, '50min': 6600 },
      nomination_50min: 2200,
      w_nomination_50min: 4400,
      remarks: '金額はお一人様50分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミリルージュ 布施',
    altNames: ['MIRI ROUGE 布施', 'ミリルージュ フセ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '20%',
    website: 'https://www.miri-rouge.com/',
    pricing_info: {
      system_60min: {
        'OPEN〜20:59': 4950,
        '21:00〜LAST': 6600
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      dohan: 2200,
      remarks: '金額はお一人様60分料金です。サービス料20%別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ミリルージュ 京橋',
    altNames: ['MIRI ROUGE 京橋', 'ミリルージュキョウバシ'],
    city: '大阪',
    business_hours: '19:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.miri-rouge-kyobashi.com/',
    pricing_info: {
      system_60min: {
        '〜20時': 6050,
        '〜22時': 6600,
        '22時以降': 7700
      },
      private_vip_charge_60min: 11000,
      private_vip_single_charge: 16500,
      extension: { '30min': 3850, '60min': 6600 },
      nomination_60min: 2200,
      nomination_60min_2nd: 4400,
      remarks: '2人以上ご指名の場合は、2人目から指名料金は¥4,400となります。金額はお一人様60分料金です。1名様でのVIPご利用の場合、シングルチャージは16,500円',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'メルセゾン',
    altNames: ['MERCEZON', 'メルセゾン 赤坂'],
    city: '東京',
    business_hours: '20:00〜翌1:00',
    closed_days: '日曜日・土曜日・祝日',
    service_charge: 'メイン25%・個室30%',
    website: null,
    pricing_info: {
      main_60min: {
        '20:00〜20:59': 4400,
        '21:00〜21:59': 5500,
        '22:00〜LAST': 6600
      },
      karaoke_private_60min: {
        '20:00〜20:59': 9900,
        '21:00〜21:59': 11000,
        '22:00〜LAST': 12100
      },
      extension_30min: { 'メイン': 3850, '個室': 6600 },
      nomination_60min: 3300,
      dohan: 3300,
      private_note: '個室を1名様でご利用の際は、2名様分の料金となります。同業者においては、2名に対し1名様分の料金が発生します',
      house_bottle: 'ハウスボトル（焼酎・ウイスキー）付き',
      remarks: '消費税込み。オーダー別途。お持込み料別途',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '柳ヶ瀬 Garden',
    altNames: ['ヤナガセ ガーデン', 'YANAGASE GARDEN'],
    city: '岐阜',
    business_hours: '19:00〜LAST',
    closed_days: '月曜日',
    service_charge: '20%',
    website: 'https://www.yanagase-garden.com/',
    pricing_info: {
      system_50min: {
        'OPEN〜20:59': 4400,
        '21:00〜LAST': 5500
      },
      vip_charge: 11000,
      extension: { '30min': 3300, '50min': 5500 },
      nomination: 2200,
      dohan: 2200,
      single_charge: 550,
      free_bottle: true,
      remarks: '※シングルチャージ +¥550頂きます。※無料ボトルあります。※オーダー別途頂きます。※金額はお一人様50分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ゆめうつつ',
    altNames: ['ユメウツツ', 'YUME UTSUTSU'],
    city: '京都',
    business_hours: '20時〜Last',
    closed_days: '日曜日',
    service_charge: '15%',
    website: 'https://www.yume-utsutsu.com/',
    pricing_info: {
      all_time_60min: 11000,
      extension: { '30min': 5500, '60min': 11000 },
      nomination: 2200,
      dohan: 3300,
      vip_room_charge_60min: {
        '大藤(おおふじ)': 22000,
        '紅樺(べにかば)': 11000,
        '白鼠(しろねずみ)': 11000,
        '庵治(あじ)': 22000
      },
      house_bottle_charge: 1100,
      vip_note: '別途、お一人様通常セット料金を頂戴いたします',
      remarks: '※ハウスボトルご利用のお客様はお一人様別途¥1,100（税込）いただきます。※金額はお一人様60分料金です。※オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第二十四批 6个 ===
  {
    name: '夢露地 祇園',
    altNames: ['YUMEROJI 祇園', 'ユメロジギオン'],
    city: '京都',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日・祝日',
    service_charge: '15%',
    website: 'https://www.yumeroji-gion.com/',
    pricing_info: {
      system_60min: {
        'メンバー': 9900,
        'ビジター': 11000
      },
      extension: { '30min': 4950, '60min': 9900 },
      nomination_60min: 2200,
      dohan: 3300,
      vip_room_charge_60min: {
        '如庵': 16500,
        '待庵': 22000,
        '密庵': 22000
      },
      vip_note: '別途、お一人様通常セット料金を頂戴いたします',
      remarks: '※金額はお一人様60分料金です。※オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '夢露地 神戸',
    altNames: ['YUMEROJI 神戸', 'ユメロジコウベ'],
    city: '兵庫',
    business_hours: '20:00〜25:00',
    closed_days: '要確認',
    service_charge: '要確認',
    website: 'https://www.yumeroji-kobe.com/',
    pricing_info: {
      note: '詳細料金は店舗にお問い合わせください',
      reservation: '予約受付中',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '夢露地 ミナミ',
    altNames: ['YUMEROJI ミナミ', 'ユメロジミナミ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '月曜日',
    service_charge: '25%',
    website: 'https://www.yumeroji-minami.com/',
    pricing_info: {
      system_60min: {
        '1名様': 11000,
        '2名様以上': 9900
      },
      extension: { '30min': 4950, '60min': 9900 },
      nomination_60min: 2200,
      dohan: 3300,
      semi_vip_charge_60min: 11000,
      vip_room_charge_60min: 22000,
      remarks: '※金額はお一人様60分料金です。※オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '夢露地 四日市',
    altNames: ['YUMEROJI 四日市', 'ユメロジヨッカイチ'],
    city: '三重',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日・祝日',
    service_charge: '20%',
    website: 'https://www.yumeroji-yokkaichi.com/',
    pricing_info: {
      system_50min: {
        '〜21時': 5500,
        '21時〜': 7700
      },
      extension: { '30min': 3850, '50min': 7700 },
      nomination_50min: 2200,
      dohan: 2200,
      free_bottle_charge: 1100,
      free_bottle_note: 'フリーボトル（焼酎）付き。その他のボトルご利用は¥1,100',
      remarks: '※金額はお一人様50分料金です。※オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: '夢露地 金沢',
    altNames: ['YUMEROJI 金沢', 'ユメロジカナザワ'],
    city: '石川',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日・祝日',
    service_charge: '20%',
    website: 'https://www.yumeroji-kanazawa.com/',
    pricing_info: {
      system_60min: {
        '〜21時': 5500,
        '21時〜': 6600
      },
      extension: { '30min': 3300, '60min': 6600 },
      nomination_60min: 2200,
      dohan: 2200,
      remarks: '※金額はお一人様60分料金です。※オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ラ・ポッチャポッチャ',
    altNames: ['LA POTCHA POTCHA', 'ラポッチャポッチャ'],
    city: '東京',
    business_hours: '20:00〜LAST',
    closed_days: '月曜日',
    service_charge: '15%',
    website: 'https://www.la-potcha2.com/',
    pricing_info: {
      system_50min: {
        '〜21時': 3850,
        '21時〜': 4950
      },
      extension: { '30min': 2750, '50min': 4950 },
      nomination_50min: 2200,
      dohan: 2200,
      nomihodai_charge: 1000,
      nomihodai_note: '飲み放題プラン +¥1,000',
      remarks: '※金額はお一人様50分料金です。※オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  // === 第二十五批 5个 ===
  {
    name: 'ラ・レーヌ・ゴート',
    altNames: ['LA REINE GOAT', 'ラレーヌゴート'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.la-reine-goat.com/',
    pricing_info: {
      all_time_60min: 11000,
      extension: { '30min': 5500, '60min': 11000 },
      vip_room_charge_60min: 27500,
      vip_extension_60min: 27500,
      vip_note: '※セット料金に追加させていただきます',
      nomination_60min: 3300,
      nomination_3plus_additional: 1100,
      nomination_note: '※お客様1名様につき、3人以上ご指名の場合、1人につきプラス1,100円（税込）の指名料をいただきます',
      dohan: 3300,
      house_bottle: 1100,
      remarks: '※金額はお一人様60分料金です。※オーダー別途いただきます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'リブレット',
    altNames: ['LIBRET', 'リブレット 北新地'],
    city: '大阪',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.club-libret.com/',
    pricing_info: {
      system_60min: {
        '〜23時': 9900,
        '23時以降': 11000
      },
      extension: {
        '〜23時': { '30min': 5500, '60min': 9900 },
        '23時以降': { '30min': 5500, '60min': 11000 }
      },
      nomination_60min: 3300,
      dohan: 3300,
      vip_room_charge_60min: 27500,
      remarks: '※金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ワールドトリップ 広島',
    altNames: ['WORLD TRIP 広島', 'ワールドトリップヒロシマ'],
    city: '広島',
    business_hours: '20:00〜Last',
    closed_days: '日曜日（年末年始12月31〜1月3日店休日）',
    service_charge: '20%',
    website: 'https://www.world-trip-hiroshima.com/',
    pricing_info: {
      all_time: 4950,
      extension: { '30min': 2750, '60min': 5500 },
      nomination: 2200,
      nomination_2nd: 4400,
      dohan: '無料',
      vip_charge: {
        '1Fフロア個別チャージ': 1100,
        'セミVIP(B1F)個別チャージ': 1100,
        '個室VIP(1階)1〜6名様ルームチャージ': 22000,
        '個室VIP(1階)7名様〜個別チャージ': 3300,
        '個室VIP(2階)1〜3名様ルームチャージ': 11000,
        '個室VIP(2階)4名様〜個別チャージ': 3300
      },
      remarks: '※オーダー別途頂きます',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ヴォレ 梅田',
    altNames: ['VOLER 梅田', 'ヴォレウメダ'],
    city: '大阪',
    business_hours: '20:00〜25:00',
    closed_days: '日曜日',
    service_charge: '25%',
    website: 'https://www.voler-umeda.com/',
    pricing_info: {
      system_60min: {
        '〜21時': 6050,
        '〜22時': 6600,
        '22時以降': 7700
      },
      extension: { '30min': 3850, '60min': 6600 },
      nomination_60min: 2200,
      nomination_2nd: 4400,
      mochikomi_charge: 1100,
      remarks: '※持ち込み料金¥1,100。※2名以上のご指名の場合は、1人の女の子から4,400円（サービス料別）となります',
      currency: 'JPY',
      tax_included: true
    }
  },
  {
    name: 'ヴォレ 京橋',
    altNames: ['VOLER 京橋', 'ヴォレキョウバシ'],
    city: '大阪',
    business_hours: '20:00〜LAST',
    closed_days: '日曜日（祝日等の兼ね合いで変更する場合あり）',
    service_charge: '25%',
    website: 'https://www.voler-kyobashi.com/',
    pricing_info: {
      system_60min: {
        '〜20時': { '1名様': 6050, '2名様以上': 5500 },
        '〜22時': { '1名様': 6600, '2名様以上': 6050 },
        '22時以降': { '1名様': 7700, '2名様以上': 7150 }
      },
      extension: { '30min': 3850, '60min': 6600 },
      nomination_60min: 2200,
      w_nomination: 4400,
      vip_room_charge_60min: 11000,
      vip_single_charge: 16500,
      vip_note: '※1名様でのご利用の場合、シングルチャージは16,500円（税込）となります',
      remarks: '※金額はお一人様60分料金です',
      currency: 'JPY',
      tax_included: true
    }
  }
];

async function findVenue(venue) {
  // 尝试精确匹配主名称
  let { data: found } = await supabase
    .from('venues')
    .select('id, name, city')
    .eq('name', venue.name)
    .maybeSingle();

  if (found) return found;

  // 尝试匹配别名
  if (venue.altNames) {
    for (const altName of venue.altNames) {
      const { data: altFound } = await supabase
        .from('venues')
        .select('id, name, city')
        .eq('name', altName)
        .maybeSingle();
      if (altFound) return altFound;
    }
  }

  // 尝试模糊匹配（名称包含）
  const searchName = venue.name.split(' ')[0];
  const { data: fuzzyList } = await supabase
    .from('venues')
    .select('id, name, city')
    .ilike('name', `%${searchName}%`)
    .limit(10);

  if (fuzzyList && fuzzyList.length > 0) {
    // 如果有城市信息，优先匹配同城市的
    if (venue.city) {
      const cityMatch = fuzzyList.find(v => v.city === venue.city);
      if (cityMatch) return cityMatch;
    }
    // 返回第一个匹配
    return fuzzyList[0];
  }

  return null;
}

async function updateVenues() {
  console.log('========================================');
  console.log('更新店铺详细价格信息');
  console.log(`共 ${venueUpdates.length} 个店铺`);
  console.log('========================================\n');

  let successCount = 0;
  let failCount = 0;

  for (const venue of venueUpdates) {
    console.log(`📌 更新: ${venue.name}${venue.city ? ` (${venue.city})` : ''}`);

    // 查找店铺
    const found = await findVenue(venue);

    if (!found) {
      console.log(`  ❌ 未找到店铺: ${venue.name}`);
      failCount++;
      continue;
    }

    if (found.name !== venue.name) {
      console.log(`  → 匹配到: ${found.name}`);
    }

    // 构建更新数据
    const updateData = {
      business_hours: venue.business_hours,
      closed_days: venue.closed_days,
      service_charge: venue.service_charge,
      pricing_info: venue.pricing_info,
      updated_at: new Date().toISOString()
    };

    // 如果有网站信息，也更新
    if (venue.website) {
      updateData.website = venue.website;
    }

    // 更新店铺
    const { error: updateErr } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', found.id);

    if (updateErr) {
      console.log(`  ❌ 更新失败: ${updateErr.message}`);
      failCount++;
    } else {
      console.log(`  ✓ 更新成功`);
      successCount++;
    }
  }

  console.log(`\n📊 统计: 成功 ${successCount}, 失败 ${failCount}`);

  // 验证
  console.log('\n📊 验证结果:');
  const { data: updated } = await supabase
    .from('venues')
    .select('name, business_hours, closed_days, service_charge, pricing_info')
    .not('business_hours', 'is', null)
    .limit(10);

  if (updated && updated.length > 0) {
    console.log(`\n已更新 ${updated.length} 个店铺的价格信息:`);
    updated.forEach(v => {
      console.log(`  ${v.name}`);
      console.log(`    营业: ${v.business_hours} | 定休: ${v.closed_days} | 服务费: ${v.service_charge}`);
    });
  }

  console.log('\n========================================');
  console.log('✅ 完成！');
  console.log('========================================');
}

updateVenues().catch(err => {
  console.error('更新失败:', err);
  process.exit(1);
});
