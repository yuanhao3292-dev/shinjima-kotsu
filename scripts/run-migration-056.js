// 运行 056-fankura-venues 迁移
// 导入 fankura.com 合作方的 150 家夜总会店铺
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// fankura 店铺数据
const fankuraVenues = [
  // Page 1
  { name: 'ある夜、ビルの片隅で', name_ja: 'ある夜、ビルの片隅で', brand: 'ファンクラ', city: '大阪', area: '中央区', address: '大阪府大阪市中央区宗右衛門町2-17', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'インタイトル 恵比寿', name_ja: 'インタイトル 恵比寿', brand: 'ファンクラ', city: '東京', area: '恵比寿', address: '東京都渋谷区恵比寿南1丁目4番13号 REMAX恵比寿ビル5階・6階', category: 'nightclub', is_active: true, description: 'ガールズラウンジ', features: ['ガールズラウンジ'] },
  { name: 'エマクラブ 江坂', name_ja: 'エマクラブ 江坂', brand: 'ファンクラ', city: '大阪', area: '江坂', address: '大阪府吹田市垂水町3-35-25江坂第一レジャービル T&T 3F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エマクラブ 中洲', name_ja: 'エマクラブ 中洲', brand: 'ファンクラ', city: '福岡', area: '中洲', address: '福岡県福岡市博多区中洲4-2-14 グラン中洲8F', category: 'nightclub', is_active: true, description: 'ニュークラブ', features: ['ニュークラブ'] },
  { name: 'エルミネ 新横浜', name_ja: 'エルミネ 新横浜', brand: 'ファンクラ', city: '神奈川', area: '新横浜', address: '横浜市港北区新横浜2-4-5 天満ビル3階', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エルミネ 和歌山', name_ja: 'エルミネ 和歌山', brand: 'ファンクラ', city: '和歌山', area: '新内', address: '和歌山市新内6 奥野ビル2F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ELENA HOUSE', name_ja: 'ELENA HOUSE', brand: 'ファンクラ', city: '三重', area: '松阪', address: '三重県松阪市愛宕町3-57 松阪観光第二ビル 2F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エレナハウス 高知', name_ja: 'エレナハウス 高知', brand: 'ファンクラ', city: '高知', area: '追手筋', address: '高知市追手筋1-5-4 ロイヤルビル1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エレナハウス 梅田', name_ja: 'エレナハウス 梅田', brand: 'ファンクラ', city: '大阪', area: '梅田', address: '大阪市北区堂山町5-9 扇会館4F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  // Page 2
  { name: 'ELENA HOUSE 京都', name_ja: 'ELENA HOUSE 京都', brand: 'ファンクラ', city: '京都', area: '木屋町', address: '京都市中京区東木屋町通四条上ル2丁目下樵木町205 モンドビル1F・2F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エンジェルフェザー ミナミ', name_ja: 'エンジェルフェザー ミナミ', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪府大阪市中央区東心斎橋2-5-22 岩伸ミカドビル1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エンジェル・フェザー 池袋', name_ja: 'エンジェル・フェザー 池袋', brand: 'ファンクラ', city: '東京', area: '池袋', address: '東京都豊島区東池袋1-4-2 三経33ビル 1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エンジェル・フェザー 北新地', name_ja: 'エンジェル・フェザー 北新地', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪市北区曽根崎新地1-2-34 新谷安ビル2F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エンジェル・フェザー 神戸', name_ja: 'エンジェル・フェザー 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区中山手通1-5-8 東門ＩＮＢビル 4F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'エンジェル・フェザー 仙台', name_ja: 'エンジェル・フェザー 仙台', brand: 'ファンクラ', city: '宮城', area: '仙台', address: '宮城県仙台市青葉区国分町2-13-1 セブンコートビルB1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: '大阪メルヘン', name_ja: '大阪メルヘン', brand: 'ファンクラ', city: '大阪', area: '梅田', address: '大阪市北区小松原町1-26 レジャービル寿楽B1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: '錵乃音 京都', name_ja: '錵乃音（かのね） 京都', brand: 'ファンクラ', city: '京都', area: '木屋町', address: '京都府京都市中京区東木屋町通四条上ﾙ2丁目 下樵木町205 モンドビル4F･5F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '錵乃音 祇園', name_ja: '錵乃音（かのね） 祇園', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都市東山区大和大路通四条上る富永町108-1 タケトミビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 3
  { name: '錵乃音 神戸', name_ja: '錵乃音（かのね） 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '神戸市中央区中山手通1-5-8 東門INBビル3F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '錵乃音 和歌山', name_ja: '錵乃音（かのね） 和歌山', brand: 'ファンクラ', city: '和歌山', area: '新内', address: '和歌山県和歌山市新内5番地 O\'sビル', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'カラオケ&ダイニング ブルームラウンジ', name_ja: 'カラオケ&ダイニング ブルームラウンジ', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-10-4 六本木パークビル1F', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['カラオケ', 'ダイニング'] },
  { name: '川崎 Garden', name_ja: '川崎 Garden', brand: 'ファンクラ', city: '神奈川', area: '川崎', address: '神奈川県川崎市川崎区砂子二丁目6番19号 林ビル2F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: '神田茶屋', name_ja: '神田茶屋', brand: 'ファンクラ', city: '東京', area: '神田', address: '東京都千代田区内神田3-8-7 星座ビルB1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ジェム 立川', name_ja: 'ジェム 立川', brand: 'ファンクラ', city: '東京', area: '立川', address: '東京都立川市曙町2-7-20 カメヤビルB１F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'クラブ・ラウンジ ベルベージュ', name_ja: 'クラブ・ラウンジ ベルベージュ', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪府大阪市北区曽根崎新地1-6-16 メッセージビル3F', category: 'nightclub', is_active: true, description: 'クラブラウンジ', features: ['クラブ', 'ラウンジ'] },
  { name: 'クラブ桔梗 祇園邸', name_ja: 'クラブ桔梗 祇園邸', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都府', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'クロリス 六本木', name_ja: 'クロリス 六本木', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-14-11 六本木KENTO\'Sビル5F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 4
  { name: 'KATY STUDIO', name_ja: 'KATY STUDIO', brand: 'ファンクラ', city: '三重', area: '松阪', address: '三重県松阪市愛宕町3丁目19-1 豊和ビル', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ゴールドトリガー仙台', name_ja: 'ゴールドトリガー仙台', brand: 'ファンクラ', city: '宮城', area: '仙台', address: '宮城県仙台市青葉区国分町2-2-28 第一藤原屋ビル２F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'サンセットラウンジェット 四日市', name_ja: 'サンセットラウンジェット 四日市', brand: 'ファンクラ', city: '三重', area: '四日市', address: '三重県四日市市諏訪栄町7-29 アーバンホーリービル1F', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'サンセットラウンジェット 金沢', name_ja: 'サンセットラウンジェット 金沢', brand: 'ファンクラ', city: '石川', area: '金沢', address: '石川県金沢市片町1-6-3夢館ビル B1F', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'サンセットラウンジェット 祇園', name_ja: 'サンセットラウンジェット 祇園', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都市東山区常盤町164', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'サンセットラウンジェット 神戸', name_ja: 'サンセットラウンジェット 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区北長狭通1-5-8 コースト35ビル3F', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ', '昼夜営業'] },
  { name: 'サンセットラウンジェット 新橋', name_ja: 'サンセットラウンジェット 新橋', brand: 'ファンクラ', city: '東京', area: '新橋', address: '東京都港区新橋2-15-18 プラザT2ビル4F', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'ザ・バーレスク', name_ja: 'ザ・バーレスク', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪府大阪市中央区心斎橋筋2-3-7ロイヤル北川ビル B1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'シークレットガーデン京都', name_ja: 'シークレットガーデン京都', brand: 'ファンクラ', city: '京都', area: '木屋町', address: '京都市中京区木屋町通三条下ル材木町179 FS木屋町ビル', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ', '昼夜営業'] },
  { name: '翠彩', name_ja: '翠彩', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都府京都市東山区新橋通大和大路東入2清本町371-1', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 5
  { name: 'シークレットガーデン 神戸', name_ja: 'シークレットガーデン 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区加納町4-7-4 ゴールドプラザ 1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'シークレットガーデン 西中島', name_ja: 'シークレットガーデン 西中島', brand: 'ファンクラ', city: '大阪', area: '西中島', address: '大阪市淀川区西中島3-16-15 Refuge NISHINAKAJIMA B1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'シャトリス', name_ja: 'シャトリス', brand: 'ファンクラ', city: '大阪', area: '堂島', address: '大阪府大阪市北区堂島1-3-38 京松ビル 1棟', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'XEE', name_ja: 'XEE', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木３-8-15 六本木日拓ビル2F・3F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ジェム 錦', name_ja: 'ジェム 錦', brand: 'ファンクラ', city: '愛知', area: '名古屋', address: '愛知県名古屋市中区錦3-12-25 名古屋サミットビルB1F 6F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ジェム 川崎', name_ja: 'ジェム 川崎', brand: 'ファンクラ', city: '神奈川', area: '川崎', address: '神奈川県川崎市川崎区砂子2-6-19 林ビル5F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ジェムサロン 岡山', name_ja: 'ジェムサロン 岡山', brand: 'ファンクラ', city: '岡山', area: '岡山', address: '岡山県岡山市北区中央町4-23-3サルーテ中央町3F', category: 'nightclub', is_active: true, description: 'サロン', features: ['サロン'] },
  { name: 'ジェムサロン 草津', name_ja: 'ジェムサロン 草津', brand: 'ファンクラ', city: '滋賀', area: '草津', address: '滋賀県草津市大路1丁目16-30　クオリア大路1階', category: 'nightclub', is_active: true, description: 'サロン', features: ['サロン'] },
  { name: 'ジェムサロン 町田', name_ja: 'ジェムサロン 町田', brand: 'ファンクラ', city: '東京', area: '町田', address: '東京都町田市原町田4-4-7 スカイプラザ8F', category: 'nightclub', is_active: true, description: 'サロン', features: ['サロン'] },
  // Page 6
  { name: 'ジェム 新横浜', name_ja: 'ジェム 新横浜', brand: 'ファンクラ', city: '神奈川', area: '新横浜', address: '神奈川県横浜市港北区新横浜2-4-5 天満ビル5F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ジェム四日市', name_ja: 'ジェム四日市', brand: 'ファンクラ', city: '三重', area: '四日市', address: '三重県四日市市諏訪栄町7－29 アーバンホーリービル2階', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ZOO 東京', name_ja: 'ZOO 東京', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-14-11 ケントスビル2F・3F・4F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ZOO 金沢', name_ja: 'ZOO 金沢', brand: 'ファンクラ', city: '石川', area: '金沢', address: '石川県金沢市片町2-21-27 オーロラビルＢ１Ｆ', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ZOO 京都', name_ja: 'ZOO 京都', brand: 'ファンクラ', city: '京都', area: '木屋町', address: '京都府 京都市中京区 大黒町 67-3 ﾌｫｰﾗﾑ西木屋町 2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ZOO 神戸', name_ja: 'ZOO 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区加納町4-3-5 シャトー北野坂2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ZOO 仙台', name_ja: 'ZOO 仙台', brand: 'ファンクラ', city: '宮城', area: '仙台', address: '宮城県仙台市青葉区国分町2丁目9番32号 千鳥屋ビル2階', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ZOO ミナミ', name_ja: 'ZOO ミナミ', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪市中央区東心斎橋2-7-18 暫ビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 7
  { name: '17マイルドライブ 加古川', name_ja: '17マイルドライブ 加古川', brand: 'ファンクラ', city: '兵庫', area: '加古川', address: '兵庫県加古川市平岡町新在家2-270-1フジビルディング4F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '17MAP', name_ja: '17MAP', brand: 'ファンクラ', city: '兵庫', area: '加古川', address: '兵庫県加古川市平岡町新在家2-270-1フジビルディング2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '禅の月', name_ja: '禅の月', brand: 'ファンクラ', city: '大阪', area: '京橋', address: '大阪府大阪市都島区東野田町3-10-19サンピアザビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'チャリンコ 加古川', name_ja: 'チャリンコ 加古川', brand: 'ファンクラ', city: '兵庫', area: '加古川', address: '兵庫県加古川市平岡町新在家2-264-5 IKKOUビル1F', category: 'nightclub', is_active: true, description: 'バー', features: ['バー'] },
  { name: 'チャリンコ 十三', name_ja: 'チャリンコ 十三', brand: 'ファンクラ', city: '大阪', area: '十三', address: '大阪市淀川区十三本町1-17-22 ステラミカサビル2F', category: 'nightclub', is_active: true, description: 'バー', features: ['バー'] },
  { name: 'TSUKI NO KITANOZAKA', name_ja: 'TSUKI NO KITANOZAKA', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区加納町4-3-5 シャトー北野坂8F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '月ノ湊', name_ja: '月ノ湊', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-8-15 六本木日拓ビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'テラスグリーン', name_ja: 'テラスグリーン', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪府大阪市中央区東心斎橋2丁目6番21号 19番街プラザ地下1階', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'D2', name_ja: 'D2', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪府大阪府大阪市中央区心斎橋筋2-1-8藤田ビル２F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 8
  { name: 'ドアラウンジ 北新地', name_ja: 'ドアラウンジ 北新地', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪市北区曽根崎新地1-2-13 ふじ久ビル１F', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'ドルチェガールズ', name_ja: 'ドルチェガールズ', brand: 'ファンクラ', city: '高知', area: '帯屋町', address: '高知県高知市帯屋町1-4-7 久家ビル1F', category: 'nightclub', is_active: true, description: 'ガールズバー', features: ['ガールズバー'] },
  { name: 'ドルチェラグレス', name_ja: 'ドルチェラグレス', brand: 'ファンクラ', city: '大阪', area: '十三', address: '大阪府 大阪市淀川区 十三本町 1-14-10ビリセンビル2階', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'ドレスライン 立川', name_ja: 'ドレスライン 立川', brand: 'ファンクラ', city: '東京', area: '立川', address: '東京都立川市錦町2-1-31 STビル1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ナルシス', name_ja: 'ナルシス', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪府大阪市中央区東心斎橋2-7-20 サザンパレスビル 2Ｆ', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'NANSHIKA YAMATOYA', name_ja: 'NANSHIKA YAMATOYA', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪府大阪市中央区宗右衛門町7-8MUSOUビルB1Ｆ', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'バニーバーチャリンコ', name_ja: 'バニーバーチャリンコ', brand: 'ファンクラ', city: '三重', area: '松阪', address: '三重県松阪市愛宕町1-37 鹿鳴館ビル1-E', category: 'nightclub', is_active: true, description: 'バニーバー', features: ['バニーバー'] },
  { name: 'バニーバーチャリンコ 高松', name_ja: 'バニーバーチャリンコ 高松', brand: 'ファンクラ', city: '香川', area: '高松', address: '香川県高松市古馬場町8-22 ダイアナビル1F', category: 'nightclub', is_active: true, description: 'バニーバー', features: ['バニーバー'] },
  { name: 'バニーバーチャリンコ 四日市', name_ja: 'バニーバーチャリンコ 四日市', brand: 'ファンクラ', city: '三重', area: '四日市', address: '三重県四日市市諏訪栄町8番6号　みそのビル2F', category: 'nightclub', is_active: true, description: 'バニーバー', features: ['バニーバー'] },
  // Page 9
  { name: 'バニーバーチャリンコ 奈良', name_ja: 'バニーバーチャリンコ 奈良', brand: 'ファンクラ', city: '奈良', area: '大宮町', address: '奈良県奈良市大宮町6-3-29 アルファグランデ1F-3', category: 'nightclub', is_active: true, description: 'バニーバー', features: ['バニーバー'] },
  { name: 'バニーラウンジB4', name_ja: 'バニーラウンジB4', brand: 'ファンクラ', city: '神奈川', area: '川崎', address: '神奈川県川崎市川崎区小川町14-16 小川町ビル4F', category: 'nightclub', is_active: true, description: 'バニーラウンジ', features: ['バニーラウンジ'] },
  { name: 'バニーラウンジB4 上野', name_ja: 'バニーラウンジB4 上野', brand: 'ファンクラ', city: '東京', area: '上野', address: '東京都文京区湯島3-42-12 こけしビル2F', category: 'nightclub', is_active: true, description: 'バニーラウンジ', features: ['バニーラウンジ'] },
  { name: 'バンチオブローゼス 岐阜', name_ja: 'バンチオブローゼス 岐阜', brand: 'ファンクラ', city: '岐阜', area: '柳ヶ瀬', address: '岐阜県岐阜市柳ヶ瀬通3丁目24番 EAST1ビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'バンチオブローゼス 西中島', name_ja: 'バンチオブローゼス 西中島', brand: 'ファンクラ', city: '大阪', area: '西中島', address: '大阪市淀川区西中島3-16-15 Refuge NISHINAKAJIMAビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ビーノワール 六本木', name_ja: 'ビーノワール 六本木', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-9-5 ゼックスバウム館1階', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 赤坂', name_ja: 'B4 赤坂', brand: 'ファンクラ', city: '東京', area: '赤坂', address: '東京都港区赤坂3-10-6 ルルド赤坂ビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 京都', name_ja: 'B4 京都', brand: 'ファンクラ', city: '京都', area: '木屋町', address: '京都府京都市中京区東木屋町通四条上ル3丁目材木町185番地 1階2階', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 草津', name_ja: 'B4 草津', brand: 'ファンクラ', city: '滋賀', area: '草津', address: '滋賀県草津市大路1丁目16-30 クオリア大路1階B号室', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 10
  { name: 'B4 仙台', name_ja: 'B4 仙台', brand: 'ファンクラ', city: '宮城', area: '仙台', address: '宮城県仙台市青葉区国分町2-9-32 千鳥屋ビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 立川', name_ja: 'B4 立川', brand: 'ファンクラ', city: '東京', area: '立川', address: '東京都立川市錦町1丁目3-21 WATERビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 広島', name_ja: 'B4 広島', brand: 'ファンクラ', city: '広島', area: '広島', address: '広島県広島市中区堀川町3-6 DOLCE堀川町1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 町田', name_ja: 'B4 町田', brand: 'ファンクラ', city: '東京', area: '町田', address: '東京都町田市原町田6-11－17 共同ビル 1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 上野', name_ja: 'B4 上野', brand: 'ファンクラ', city: '東京', area: '上野', address: '東京都文京区湯島3-42-12 こけしビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 梅田', name_ja: 'B4 梅田', brand: 'ファンクラ', city: '大阪', area: '梅田', address: '大阪府大阪市北区堂山町5-5EASTビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 神田', name_ja: 'B4 神田', brand: 'ファンクラ', city: '東京', area: '神田', address: '東京都千代田区内神田3-8-7 星座ビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'B4 新橋', name_ja: 'B4 新橋', brand: 'ファンクラ', city: '東京', area: '新橋', address: '東京都港区新橋2-14-6 HT新橋ビル3F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 上野', name_ja: '美人茶屋 上野', brand: 'ファンクラ', city: '東京', area: '上野', address: '東京都台東区上野4-4-6 上野B&Vビル10F・11F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 11
  { name: '美人茶屋 梅田', name_ja: '美人茶屋 梅田', brand: 'ファンクラ', city: '大阪', area: '梅田', address: '大阪府大阪市北区 堂山町17ｰ8 北シャトービル B1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 岡山', name_ja: '美人茶屋 岡山', brand: 'ファンクラ', city: '岡山', area: '岡山', address: '岡山市北区中央町2番14 号 中央20ビル1001号室', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 金沢', name_ja: '美人茶屋 金沢', brand: 'ファンクラ', city: '石川', area: '金沢', address: '石川県金沢市片町2-21-27 オーロラビル8F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 新橋', name_ja: '美人茶屋 新橋', brand: 'ファンクラ', city: '東京', area: '新橋', address: '東京都港区新橋2-14-6 HT新橋ビル4・5F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 高松', name_ja: '美人茶屋 高松', brand: 'ファンクラ', city: '香川', area: '高松', address: '香川県高松市古馬場町8-22　ダイアナビル2Ｆ', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 北新地', name_ja: '美人茶屋 北新地', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪府大阪市北区曾根崎新地一丁目2-12 橘ビル1階', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 新宿', name_ja: '美人茶屋 新宿', brand: 'ファンクラ', city: '東京', area: '新宿', address: '東京都新宿区歌舞伎町2-23-1 風林会館4F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 六本木', name_ja: '美人茶屋 六本木', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-14-11 ケントスビル7F・8F・9F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 祇園', name_ja: '美人茶屋 祇園', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都市東山区常盤町158-1', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 12
  { name: '美人茶屋 神戸', name_ja: '美人茶屋 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '神戸市中央区下山手通1-3-8 月世界ビル5F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 広島', name_ja: '美人茶屋 広島', brand: 'ファンクラ', city: '広島', area: '広島', address: '広島県広島市中区流川町2-15 羅針盤ビル', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美人茶屋 ミナミ', name_ja: '美人茶屋 ミナミ', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪市中央区東心斎橋2-7-3 KB会館 地下1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ビゼ 上野', name_ja: 'ビゼ 上野', brand: 'ファンクラ', city: '東京', area: '上野', address: '東京都文京区湯島3-38-11 エスパス上野広小路3F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ビゼ 新宿', name_ja: 'ビゼ 新宿', brand: 'ファンクラ', city: '東京', area: '新宿', address: '東京都新宿区歌舞伎町2-22-5 叙々苑新宿ビルII 4F・5F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ビゼ 中洲', name_ja: 'ビゼ 中洲', brand: 'ファンクラ', city: '福岡', area: '中洲', address: '福岡県福岡市博多区中洲4-7-8 ラ・パピヨンビル 1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ビゼ 広島', name_ja: 'ビゼ 広島', brand: 'ファンクラ', city: '広島', area: '広島', address: '広島市中区堀川町3-6 DOLCE堀河町 2F 3F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ビゼ 池袋', name_ja: 'ビゼ 池袋', brand: 'ファンクラ', city: '東京', area: '池袋', address: '東京都豊島区東池袋1-4-2 三経33ビル 2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ビゼ 北新地', name_ja: 'ビゼ 北新地', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪市北区曽根崎新地1-3-26 ぐらん･ぱれビルB1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 13
  { name: 'ビゼ 祇園', name_ja: 'ビゼ 祇園', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都市東山区八坂新地富永町136番地(1棟)', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ビゼ ミナミ', name_ja: 'ビゼ ミナミ', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪市中央区東心斎橋2-7-20 サザンパレスビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '美ノ間 六本木', name_ja: '美ノ間 六本木', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-8-18 六本木三経41ビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ピースオブチョコレート 仙台', name_ja: 'ピースオブチョコレート 仙台', brand: 'ファンクラ', city: '宮城', area: '仙台', address: '宮城県仙台市青葉区国分町2-11-8 MSCビルB1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ピースオブチョコレート 広島', name_ja: 'ピースオブチョコレート 広島', brand: 'ファンクラ', city: '広島', area: '広島', address: '広島県広島市中区流川町1-18 サクセスビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'フィッツ 岐阜', name_ja: 'フィッツ 岐阜', brand: 'ファンクラ', city: '岐阜', area: '柳ヶ瀬', address: '岐阜県岐阜市若宮町4-20 TAISEIビル2F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'フィッツ 神戸', name_ja: 'フィッツ 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区中山手通1−4−11 ニューゲートビルB1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'フィッツ 奈良', name_ja: 'フィッツ 奈良', brand: 'ファンクラ', city: '奈良', area: '奈良', address: '奈良県奈良市三条町321-7 松本ビル1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  // Page 14
  { name: 'ベロア 岡山', name_ja: 'ベロア 岡山', brand: 'ファンクラ', city: '岡山', area: '岡山', address: '岡山県岡山市北区中央町7-1K&Kビル B1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ベロア 北新地', name_ja: 'ベロア 北新地', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪府 大阪市北区 曽根崎新地 1-6-16 メッセージビル 1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ベロア 神戸', name_ja: 'ベロア 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区中山手通1丁目5-8 東門INBビル 2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ベロア 仙台', name_ja: 'ベロア 仙台', brand: 'ファンクラ', city: '宮城', area: '仙台', address: '宮城県仙台市青葉区国分町2-12-1 ニュー国分町ビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ベロア 錦', name_ja: 'ベロア 錦', brand: 'ファンクラ', city: '愛知', area: '名古屋', address: '愛知県名古屋市中区錦3-19-5 ピボットスクエアビル5F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ベロア 十三', name_ja: 'ベロア 十三', brand: 'ファンクラ', city: '大阪', area: '十三', address: '大阪府大阪市淀川区十三本町1-17-22 ステラミカサビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ポニーテール 堺東', name_ja: 'ポニーテール 堺東', brand: 'ファンクラ', city: '大阪', area: '堺東', address: '大阪府堺市堺区南花田口町1-3-13 ジョイント2ビル2F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ミスト ミナミ', name_ja: 'ミスト ミナミ', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪市中央区東心斎橋2-7-18 暫ビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミュゼルヴァ 中洲', name_ja: 'ミュゼルヴァ 中洲', brand: 'ファンクラ', city: '福岡', area: '中洲', address: '福岡県福岡市博多区中洲2-3-5 中洲会館2・3・4F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 15
  { name: 'ミュゼルヴァ 六本木', name_ja: 'ミュゼルヴァ 六本木', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-8-18 六本木三経41ビルB2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミュゼルヴァ 北新地', name_ja: 'ミュゼルヴァ 北新地', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪市北区曽根崎新地1-6-16 メッセージビルB1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミュゼルヴァ 祇園', name_ja: 'ミュゼルヴァ 祇園', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都府京都市東山区八坂新地富永町106-4', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミュゼルヴァ 神戸', name_ja: 'ミュゼルヴァ 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区中山手通1-9-24 エムズ北野坂ビル2・3F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミュゼルヴァ 広島', name_ja: 'ミュゼルヴァ 広島', brand: 'ファンクラ', city: '広島', area: '広島', address: '広島県広島市中区堀川町1-19 森脇ビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミュゼルヴァ ミナミ', name_ja: 'ミュゼルヴァ ミナミ', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪市中央区東心斎橋2-8-6 リュクスビル1F・2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミリブルー 高槻', name_ja: 'ミリブルー 高槻', brand: 'ファンクラ', city: '大阪', area: '高槻', address: '高槻市城北町2-11-3 ベルエポックビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミリルージュ 布施', name_ja: 'ミリルージュ 布施', brand: 'ファンクラ', city: '大阪', area: '布施', address: '大阪府東大阪市足代新町4-11 ニューグランドビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ミリルージュ 京橋', name_ja: 'ミリルージュ 京橋', brand: 'ファンクラ', city: '大阪', area: '京橋', address: '大阪府大阪市都島区東野田町3-10-19京橋サンピアザビル205号室', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 16
  { name: 'メルセゾン', name_ja: 'メルセゾン', brand: 'ファンクラ', city: '東京', area: '赤坂', address: '東京都港区赤坂３丁目１１−７ ソシアル赤坂 4F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '柳ヶ瀬 Garden', name_ja: '柳ヶ瀬 Garden', brand: 'ファンクラ', city: '岐阜', area: '柳ヶ瀬', address: '岐阜市柳ケ瀬通3-14 ファイブスタービル1F', category: 'nightclub', is_active: true, description: 'キャバクラ', features: ['キャバクラ'] },
  { name: 'ゆめうつつ', name_ja: 'ゆめうつつ', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都市東山区富永町139番1', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '夢露地 祇園', name_ja: '夢露地 祇園', brand: 'ファンクラ', city: '京都', area: '祇園', address: '京都市東山区大和大路通四条上る二筋目東入末吉町99番地6 祇園中央グランビルディング(B1.1F)', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '夢露地 神戸', name_ja: '夢露地 神戸', brand: 'ファンクラ', city: '兵庫', area: '神戸', address: '兵庫県神戸市中央区中山手通1-5-8INBビル 6F 東門', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '夢露地 ミナミ', name_ja: '夢露地 ミナミ', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪府大阪市中央区東心斎橋2-8-14 リップル千扇ビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '夢露地 四日市', name_ja: '夢露地 四日市', brand: 'ファンクラ', city: '三重', area: '四日市', address: '三重県四日市市西新地6番4号第一川喜ビル1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: '夢露地 金沢', name_ja: '夢露地 金沢', brand: 'ファンクラ', city: '石川', area: '金沢', address: '石川県金沢市昭和町12-7 金駅ビル2階', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ラ・ポッチャポッチャ', name_ja: 'ラ・ポッチャポッチャ', brand: 'ファンクラ', city: '大阪', area: 'ミナミ', address: '大阪市中央区宗右衛門町7-11 ピースビル 2Ｆ', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  // Page 17
  { name: 'ラ・レーヌ・ゴート', name_ja: 'ラ・レーヌ・ゴート', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪府大阪市北区堂島1-3-31 堂島ビル2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'リブレット', name_ja: 'リブレット', brand: 'ファンクラ', city: '大阪', area: '北新地', address: '大阪市北区堂島1-2-27 オーシャンビルB1F', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'ルームラウンジダジール', name_ja: 'ルームラウンジダジール', brand: 'ファンクラ', city: '東京', area: '六本木', address: '東京都港区六本木3-9-5 ゼックスバウム館1F', category: 'nightclub', is_active: true, description: 'ラウンジ', features: ['ラウンジ'] },
  { name: 'ワールドトリップ 広島', name_ja: 'ワールドトリップ 広島', brand: 'ファンクラ', city: '広島', area: '広島', address: '広島県広島市中区堀川町3-5 中村屋ビルB1F〜2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ヴォレ 梅田', name_ja: 'ヴォレ 梅田', brand: 'ファンクラ', city: '大阪', area: '梅田', address: '大阪市北区堂山町5-9 扇会館B1F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
  { name: 'ヴォレ 京橋', name_ja: 'ヴォレ 京橋', brand: 'ファンクラ', city: '大阪', area: '京橋', address: '大阪市都島区東野田町3-10-19 サンピアザビルB2F', category: 'nightclub', is_active: true, description: 'クラブ', features: ['クラブ'] },
];

async function runMigration() {
  console.log('========================================');
  console.log('运行 056-fankura-venues 迁移');
  console.log(`准备导入 ${fankuraVenues.length} 家 fankura 合作店铺`);
  console.log('========================================\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const venue of fankuraVenues) {
    // 检查是否已存在（按名称）
    const { data: existing } = await supabase
      .from('venues')
      .select('id')
      .eq('name', venue.name)
      .single();

    if (existing) {
      console.log(`  ⏭ 跳过 (已存在): ${venue.name}`);
      skipCount++;
      continue;
    }

    // 插入新店铺
    const { error } = await supabase
      .from('venues')
      .insert(venue);

    if (error) {
      console.log(`  ✗ 失败: ${venue.name} - ${error.message}`);
      errorCount++;
    } else {
      console.log(`  ✓ 成功: ${venue.name}`);
      successCount++;
    }
  }

  console.log('\n========================================');
  console.log('迁移完成');
  console.log(`  成功: ${successCount}`);
  console.log(`  跳过: ${skipCount}`);
  console.log(`  失败: ${errorCount}`);
  console.log('========================================\n');

  // 验证总数
  const { count } = await supabase
    .from('venues')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'nightclub');

  console.log(`📊 数据库中夜总会店铺总数: ${count}`);

  // 按城市统计
  const { data: cityStats } = await supabase
    .from('venues')
    .select('city')
    .eq('category', 'nightclub');

  if (cityStats) {
    const cityCounts = {};
    cityStats.forEach(v => {
      cityCounts[v.city] = (cityCounts[v.city] || 0) + 1;
    });
    console.log('\n📍 按城市分布:');
    Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([city, count]) => {
        console.log(`  ${city}: ${count}`);
      });
  }
}

runMigration().catch(err => {
  console.error('迁移失败:', err);
  process.exit(1);
});
