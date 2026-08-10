-- =====================================================
-- 117: venues 关联 fankura 店铺官网(详情页)链接
-- =====================================================
-- 夜总会预约选店时可打开每家店的官网。venues 原本无官网列。按店名匹配自 fankura 目录:
-- 136 家用 fankura 店铺详情页(https://www.fankura.com/shop/shop_key/<id>),
-- 10 家 fankura 链到其独立官网的则直接用真官网(http://...),合计 146/149 命中。
-- 其余 3 家(エマクラブ 中洲 / D2 / メルセゾン)fankura 现目录已无,留空,UI 不显示链接。
--
-- ⚠️ 本项目无迁移自动跟踪,需手动在生产库执行本文件。

ALTER TABLE venues ADD COLUMN IF NOT EXISTS website_url TEXT;

UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20154' WHERE name = 'ある夜、ビルの片隅で';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20137' WHERE name = 'インタイトル 恵比寿';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20220' WHERE name = 'エマクラブ 江坂';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20111' WHERE name = 'エルミネ 新横浜';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20013' WHERE name = 'エルミネ 和歌山';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20198' WHERE name = 'ELENA HOUSE';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20233' WHERE name = 'エレナハウス 高知';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20212' WHERE name = 'エレナハウス 梅田';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20199' WHERE name = 'ELENA HOUSE 京都';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20269' WHERE name = 'エンジェルフェザー ミナミ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20138' WHERE name = 'エンジェル・フェザー 池袋';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20046' WHERE name = 'エンジェル・フェザー 北新地';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20203' WHERE name = 'エンジェル・フェザー 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20125' WHERE name = 'エンジェル・フェザー 仙台';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20040' WHERE name = '錵乃音 京都';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20041' WHERE name = '錵乃音 祇園';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20039' WHERE name = '錵乃音 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20171' WHERE name = '錵乃音 和歌山';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20172' WHERE name = '川崎 Garden';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20160' WHERE name = '神田茶屋';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20155' WHERE name = 'ジェム 立川';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20195' WHERE name = 'KATY STUDIO';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20243' WHERE name = 'ゴールドトリガー仙台';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20226' WHERE name = 'サンセットラウンジェット 四日市';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20107' WHERE name = 'サンセットラウンジェット 金沢';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20104' WHERE name = 'サンセットラウンジェット 祇園';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20133' WHERE name = 'サンセットラウンジェット 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20254' WHERE name = 'サンセットラウンジェット 新橋';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20097' WHERE name = 'ザ・バーレスク';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20123' WHERE name = 'シークレットガーデン京都';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20257' WHERE name = '翠彩';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/10424' WHERE name = 'シークレットガーデン 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/45' WHERE name = 'シークレットガーデン 西中島';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20235' WHERE name = 'シャトリス';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20250' WHERE name = 'XEE';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20261' WHERE name = 'ジェム 錦';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20192' WHERE name = 'ジェム 川崎';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20267' WHERE name = 'ジェムサロン 岡山';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20219' WHERE name = 'ジェムサロン 草津';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20118' WHERE name = 'ジェムサロン 町田';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20209' WHERE name = 'ジェム 新横浜';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20211' WHERE name = 'ジェム四日市';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20116' WHERE name = 'ZOO 東京';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/159' WHERE name = 'ZOO 金沢';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20237' WHERE name = 'ZOO 京都';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/21' WHERE name = 'ZOO 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20075' WHERE name = 'ZOO 仙台';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/25' WHERE name = 'ZOO ミナミ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20140' WHERE name = '17マイルドライブ 加古川';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20190' WHERE name = '17MAP';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20258' WHERE name = '禅の月';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20185' WHERE name = 'チャリンコ 加古川';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20206' WHERE name = 'チャリンコ 十三';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20182' WHERE name = 'TSUKI NO KITANOZAKA';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20174' WHERE name = 'テラスグリーン';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20253' WHERE name = 'ドルチェガールズ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20242' WHERE name = 'ドルチェラグレス';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20115' WHERE name = 'ドレスライン 立川';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20173' WHERE name = 'ナルシス';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20259' WHERE name = 'NANSHIKA YAMATOYA';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20139' WHERE name = 'バニーバーチャリンコ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20181' WHERE name = 'バニーバーチャリンコ 高松';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20224' WHERE name = 'バニーバーチャリンコ 四日市';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20193' WHERE name = 'バニーバーチャリンコ 奈良';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20202' WHERE name = 'バニーラウンジB4';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20252' WHERE name = 'バニーラウンジB4 上野';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20161' WHERE name = 'バンチオブローゼス 岐阜';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20165' WHERE name = 'バンチオブローゼス 西中島';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20231' WHERE name = 'B4 赤坂';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20232' WHERE name = 'B4 京都';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20249' WHERE name = 'B4 草津';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20270' WHERE name = 'B4 仙台';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20248' WHERE name = 'B4 立川';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20251' WHERE name = 'B4 広島';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20230' WHERE name = 'B4 町田';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20241' WHERE name = 'B4 上野';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20207' WHERE name = 'B4 梅田';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20196' WHERE name = 'B4 神田';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20208' WHERE name = 'B4 新橋';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20191' WHERE name = '美人茶屋 上野';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20244' WHERE name = '美人茶屋 梅田';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20221' WHERE name = '美人茶屋 岡山';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20168' WHERE name = '美人茶屋 金沢';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20228' WHERE name = '美人茶屋 新橋';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20217' WHERE name = '美人茶屋 高松';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20163' WHERE name = '美人茶屋 北新地';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20126' WHERE name = '美人茶屋 新宿';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20121' WHERE name = '美人茶屋 六本木';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20102' WHERE name = '美人茶屋 祇園';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/10411' WHERE name = '美人茶屋 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/10412' WHERE name = '美人茶屋 広島';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/215' WHERE name = '美人茶屋 ミナミ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20215' WHERE name = 'ビゼ 上野';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20238' WHERE name = 'ビゼ 新宿';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20234' WHERE name = 'ビゼ 中洲';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20262' WHERE name = 'ビゼ 広島';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20098' WHERE name = 'ビゼ 池袋';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20047' WHERE name = 'ビゼ 北新地';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/10418' WHERE name = 'ビゼ 祇園';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20049' WHERE name = 'ビゼ ミナミ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20180' WHERE name = 'ピースオブチョコレート 仙台';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20179' WHERE name = 'ピースオブチョコレート 広島';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20051' WHERE name = 'フィッツ 岐阜';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20003' WHERE name = 'フィッツ 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/10422' WHERE name = 'フィッツ 奈良';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20229' WHERE name = 'ベロア 岡山';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20189' WHERE name = 'ベロア 北新地';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20164' WHERE name = 'ベロア 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20170' WHERE name = 'ベロア 仙台';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20239' WHERE name = 'ベロア 錦';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20204' WHERE name = 'ベロア 十三';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/37' WHERE name = 'ポニーテール 堺東';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20050' WHERE name = 'ミスト ミナミ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20266' WHERE name = 'ミュゼルヴァ 中洲';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20114' WHERE name = 'ミュゼルヴァ 六本木';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20001' WHERE name = 'ミュゼルヴァ 北新地';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20048' WHERE name = 'ミュゼルヴァ 祇園';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20150' WHERE name = 'ミュゼルヴァ 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20143' WHERE name = 'ミュゼルヴァ 広島';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20147' WHERE name = 'ミュゼルヴァ ミナミ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20223' WHERE name = 'ミリブルー 高槻';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20222' WHERE name = 'ミリルージュ 布施';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20236' WHERE name = 'ミリルージュ 京橋';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20176' WHERE name = '柳ヶ瀬 Garden';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20130' WHERE name = 'ゆめうつつ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20218' WHERE name = '夢露地 祇園';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20268' WHERE name = '夢露地 神戸';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20225' WHERE name = '夢露地 ミナミ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20247' WHERE name = '夢露地 四日市';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20210' WHERE name = '夢露地 金沢';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/10415' WHERE name = 'ラ・ポッチャポッチャ';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20256' WHERE name = 'ラ・レーヌ・ゴート';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/10419' WHERE name = 'リブレット';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20169' WHERE name = 'ワールドトリップ 広島';
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20081' WHERE name = 'ヴォレ 梅田';

-- 另 10 家:fankura 目录里没有独立 shop_key 详情页,但链到了各店【自己的独立官网】,
-- 直接用真官网(比 fankura 详情页更正)。这 10 家原在"未命中"名单里,现补齐。
UPDATE venues SET website_url = 'http://www.osaka-merhen.jp/' WHERE name = '大阪メルヘン';
UPDATE venues SET website_url = 'http://bloom-lounge.com/' WHERE name = 'カラオケ&ダイニング ブルームラウンジ';
UPDATE venues SET website_url = 'http://bellebeige.com/' WHERE name = 'クラブ・ラウンジ ベルベージュ';
UPDATE venues SET website_url = 'http://club-kikyo.com/' WHERE name = 'クラブ桔梗 祇園邸';
UPDATE venues SET website_url = 'http://www.club-chloris.com/' WHERE name = 'クロリス 六本木';
UPDATE venues SET website_url = 'http://club-tsukinosou.com/' WHERE name = '月ノ湊';
UPDATE venues SET website_url = 'http://www.doorlounge-n.com/' WHERE name = 'ドアラウンジ 北新地';
UPDATE venues SET website_url = 'http://www.wine-bar-bb.com/' WHERE name = 'ビーノワール 六本木';
UPDATE venues SET website_url = 'http://www.club-binoma.com/' WHERE name = '美ノ間 六本木';
UPDATE venues SET website_url = 'http://room-lounge-dasyl.com/' WHERE name = 'ルームラウンジダジール';

-- 仍未匹配(3 家,fankura 现目录已无):エマクラブ 中洲 / D2 / メルセゾン。website_url 留空。
UPDATE venues SET website_url = 'https://www.fankura.com/shop/shop_key/20141' WHERE name = 'ヴォレ 京橋';
