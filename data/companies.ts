/**
 * 商务考察企业数据配置
 *
 * 将企业数据与视图分离，便于：
 * - 独立维护和更新企业信息
 * - 复用数据（如导出 JSON、API 使用）
 * - 保持 React 组件简洁
 */

// 企业数据类型定义
export interface Company {
  /** 企业名称（繁体中文） */
  name: string;
  /** 企业英文名称 */
  nameEn: string;
  /** 企业名称（日文） */
  nameJa: string;
  /** 企业简介（繁体中文） */
  desc: string;
  /** 企业简介（英文） */
  descEn: string;
  /** 企业简介（日文） */
  descJa: string;
  /** 官方网站 URL */
  url: string;
  /** 所在地区（繁体中文） */
  location: string;
  /** 所在地区（英文） */
  locationEn: string;
  /** 所在地区（日文） */
  locationJa: string;
}

// 本地化后的企业数据类型
export interface LocalizedCompany {
  name: string;
  nameEn: string;
  desc: string;
  url: string;
  location: string;
}

// 企业类别类型
export type CompanyCategory =
  | 'automotive'
  | 'electronics'
  | 'precision'
  | 'medical'
  | 'appliances'
  | 'retail'
  | 'hospitality'
  | 'food'
  | 'logistics'
  | 'tech';

// 所有企业数据
export const COMPANY_DATA: Record<CompanyCategory, Company[]> = {
  // 1. 汽车制造业
  automotive: [
    { name: '豐田產業技術紀念館', nameEn: 'Toyota Commemorative Museum', nameJa: 'トヨタ産業技術記念館', desc: '豐田生產方式(TPS)與改善哲學的聖地', descEn: 'Birthplace of the Toyota Production System (TPS) and Kaizen philosophy', descJa: 'トヨタ生産方式(TPS)とカイゼン哲学の聖地', url: 'https://www.tcmit.org/', location: '名古屋', locationEn: 'Nagoya', locationJa: '名古屋' },
    { name: '豐田汽車', nameEn: 'Toyota Motor Corporation', nameJa: 'トヨタ自動車', desc: '全球最大汽車製造商・混合動力先驅', descEn: 'World\'s largest automaker & hybrid vehicle pioneer', descJa: '世界最大の自動車メーカー・ハイブリッド先駆者', url: 'https://www.toyota.co.jp/', location: '愛知', locationEn: 'Aichi', locationJa: '愛知' },
    { name: '本田技研工業', nameEn: 'Honda Motor', nameJa: '本田技研工業', desc: '摩托車世界第一・ASIMO機器人', descEn: 'World\'s #1 motorcycle maker & ASIMO robotics', descJa: '二輪車世界第1位・ASIMOロボット', url: 'https://www.honda.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '日產汽車', nameEn: 'Nissan Motor', nameJa: '日産自動車', desc: '電動車先驅・ProPILOT自動駕駛', descEn: 'EV pioneer & ProPILOT autonomous driving', descJa: 'EV先駆者・ProPILOT自動運転', url: 'https://www.nissan.co.jp/', location: '橫濱', locationEn: 'Yokohama', locationJa: '横浜' },
    { name: '馬自達', nameEn: 'Mazda Motor', nameJa: 'マツダ', desc: '創馳藍天技術・轉子引擎傳奇', descEn: 'SKYACTIV technology & rotary engine legacy', descJa: 'SKYACTIV技術・ロータリーエンジンの伝説', url: 'https://www.mazda.co.jp/', location: '廣島', locationEn: 'Hiroshima', locationJa: '広島' },
    { name: '斯巴魯', nameEn: 'Subaru Corporation', nameJa: 'SUBARU', desc: '水平對臥引擎・EyeSight安全系統', descEn: 'Boxer engine & EyeSight safety system', descJa: '水平対向エンジン・EyeSight安全システム', url: 'https://www.subaru.co.jp/', location: '群馬', locationEn: 'Gunma', locationJa: '群馬' },
    { name: '三菱汽車', nameEn: 'Mitsubishi Motors', nameJa: '三菱自動車', desc: '四輪驅動技術・電動車戰略', descEn: '4WD technology & EV strategy', descJa: '4WD技術・EV戦略', url: 'https://www.mitsubishi-motors.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '鈴木汽車', nameEn: 'Suzuki Motor', nameJa: 'スズキ', desc: '輕型車世界領導者・印度市場霸主', descEn: 'Global kei car leader & India market leader', descJa: '軽自動車世界リーダー・インド市場首位', url: 'https://www.suzuki.co.jp/', location: '靜岡', locationEn: 'Shizuoka', locationJa: '静岡' },
    { name: '電裝', nameEn: 'DENSO', nameJa: 'デンソー', desc: '汽車零件世界第二・ADAS先進駕駛', descEn: 'World\'s #2 auto parts supplier & ADAS leader', descJa: '自動車部品世界第2位・ADAS先進運転', url: 'https://www.denso.com/jp/ja/', location: '愛知', locationEn: 'Aichi', locationJa: '愛知' },
    { name: '愛信精機', nameEn: 'Aisin Corporation', nameJa: 'アイシン', desc: '變速箱世界頂級・豐田集團核心', descEn: 'World-class transmissions & Toyota Group core', descJa: 'トランスミッション世界トップ・トヨタグループ中核', url: 'https://www.aisin.com/', location: '愛知', locationEn: 'Aichi', locationJa: '愛知' },
  ],

  // 2. 电子与半导体
  electronics: [
    { name: '索尼', nameEn: 'SONY', nameJa: 'ソニー', desc: '影像感測器世界第一・娛樂帝國', descEn: 'World\'s #1 image sensor & entertainment empire', descJa: 'イメージセンサー世界第1位・エンタメ帝国', url: 'https://www.sony.com/ja/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '東京威力科創', nameEn: 'Tokyo Electron', nameJa: '東京エレクトロン', desc: '半導體製造設備世界前三', descEn: 'Top 3 global semiconductor equipment maker', descJa: '半導体製造装置世界トップ3', url: 'https://www.tel.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '村田製作所', nameEn: 'Murata Manufacturing', nameJa: '村田製作所', desc: '電子元件世界龍頭・MLCC霸主', descEn: 'Global electronic components leader & MLCC dominant', descJa: '電子部品世界トップ・MLCC首位', url: 'https://www.murata.com/ja-jp', location: '京都', locationEn: 'Kyoto', locationJa: '京都' },
    { name: '京瓷', nameEn: 'KYOCERA', nameJa: '京セラ', desc: '精密陶瓷・太陽能・稻盛哲學', descEn: 'Fine ceramics, solar energy & Inamori philosophy', descJa: 'ファインセラミックス・太陽光・稲盛哲学', url: 'https://www.kyocera.co.jp/', location: '京都', locationEn: 'Kyoto', locationJa: '京都' },
    { name: '日本電產', nameEn: 'Nidec Corporation', nameJa: 'ニデック', desc: '精密馬達世界第一・永守經營學', descEn: 'World\'s #1 precision motor & Nagamori management', descJa: '精密モーター世界第1位・永守経営学', url: 'https://www.nidec.com/ja-JP/', location: '京都', locationEn: 'Kyoto', locationJa: '京都' },
    { name: '羅姆半導體', nameEn: 'ROHM Semiconductor', nameJa: 'ローム', desc: 'SiC功率半導體領導者', descEn: 'SiC power semiconductor leader', descJa: 'SiCパワー半導体リーダー', url: 'https://www.rohm.co.jp/', location: '京都', locationEn: 'Kyoto', locationJa: '京都' },
    { name: 'TDK', nameEn: 'TDK Corporation', nameJa: 'TDK', desc: '電子材料・感測器・電池技術', descEn: 'Electronic materials, sensors & battery tech', descJa: '電子材料・センサー・電池技術', url: 'https://www.tdk.com/ja/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '瑞薩電子', nameEn: 'Renesas Electronics', nameJa: 'ルネサスエレクトロニクス', desc: '車用MCU世界第一・IoT解決方案', descEn: 'World\'s #1 automotive MCU & IoT solutions', descJa: '車載MCU世界第1位・IoTソリューション', url: 'https://www.renesas.com/jp/ja', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '迪思科', nameEn: 'DISCO Corporation', nameJa: 'ディスコ', desc: '半導體切割研磨設備世界第一', descEn: 'World\'s #1 semiconductor dicing & grinding equipment', descJa: '半導体ダイシング・研削装置世界第1位', url: 'https://www.disco.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '愛德萬測試', nameEn: 'Advantest', nameJa: 'アドバンテスト', desc: '半導體測試設備世界領導者', descEn: 'Global leader in semiconductor test equipment', descJa: '半導体テスト装置世界リーダー', url: 'https://www.advantest.com/ja/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
  ],

  // 3. 精密机械与自动化
  precision: [
    { name: '發那科', nameEn: 'FANUC', nameJa: 'ファナック', desc: '工業機器人世界第一・CNC控制器', descEn: 'World\'s #1 industrial robot & CNC controller', descJa: '産業用ロボット世界第1位・CNC制御装置', url: 'https://www.fanuc.co.jp/', location: '山梨', locationEn: 'Yamanashi', locationJa: '山梨' },
    { name: '安川電機', nameEn: 'Yaskawa Electric', nameJa: '安川電機', desc: '伺服馬達・變頻器・機器人', descEn: 'Servo motors, inverters & robotics', descJa: 'サーボモーター・インバーター・ロボット', url: 'https://www.yaskawa.co.jp/', location: '福岡', locationEn: 'Fukuoka', locationJa: '福岡' },
    { name: 'DMG森精機', nameEn: 'DMG MORI', nameJa: 'DMG森精機', desc: '工具機世界頂尖・5軸加工技術', descEn: 'World-class machine tools & 5-axis machining', descJa: '工作機械世界トップ・5軸加工技術', url: 'https://www.dmgmori.co.jp/', location: '名古屋', locationEn: 'Nagoya', locationJa: '名古屋' },
    { name: '基恩斯', nameEn: 'KEYENCE', nameJa: 'キーエンス', desc: 'FA感測器・營業利益率50%傳奇', descEn: 'FA sensors & legendary 50% operating margin', descJa: 'FAセンサー・営業利益率50%の伝説', url: 'https://www.keyence.co.jp/', location: '大阪', locationEn: 'Osaka', locationJa: '大阪' },
    { name: '不二越', nameEn: 'Nachi-Fujikoshi', nameJa: '不二越', desc: '工業機器人・軸承・工具機', descEn: 'Industrial robots, bearings & machine tools', descJa: '産業用ロボット・ベアリング・工作機械', url: 'https://www.nachi-fujikoshi.co.jp/', location: '富山', locationEn: 'Toyama', locationJa: '富山' },
    { name: '歐姆龍', nameEn: 'OMRON', nameJa: 'オムロン', desc: 'FA控制器・感測器・自動化解決方案', descEn: 'FA controllers, sensors & automation solutions', descJa: 'FA制御機器・センサー・自動化ソリューション', url: 'https://www.omron.co.jp/', location: '京都', locationEn: 'Kyoto', locationJa: '京都' },
    { name: '三菱電機', nameEn: 'Mitsubishi Electric', nameJa: '三菱電機', desc: 'FA系統・電梯・空調・衛星', descEn: 'FA systems, elevators, HVAC & satellites', descJa: 'FAシステム・エレベーター・空調・人工衛星', url: 'https://www.mitsubishielectric.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '日立製作所', nameEn: 'Hitachi', nameJa: '日立製作所', desc: '社會基礎設施・IT・能源系統', descEn: 'Social infrastructure, IT & energy systems', descJa: '社会インフラ・IT・エネルギーシステム', url: 'https://www.hitachi.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '三菱重工業', nameEn: 'Mitsubishi Heavy Industries', nameJa: '三菱重工業', desc: '航空航天・能源・造船重工', descEn: 'Aerospace, energy & shipbuilding', descJa: '航空宇宙・エネルギー・造船', url: 'https://www.mhi.com/jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
  ],

  // 4. 医疗与健康照护
  medical: [
    { name: '奧林巴斯', nameEn: 'Olympus', nameJa: 'オリンパス', desc: '內視鏡世界市佔率70%', descEn: '70% global endoscope market share', descJa: '内視鏡世界シェア70%', url: 'https://www.olympus.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '泰爾茂', nameEn: 'Terumo', nameJa: 'テルモ', desc: '醫療器材・血液製品・心血管', descEn: 'Medical devices, blood products & cardiovascular', descJa: '医療機器・血液製品・心臓血管', url: 'https://www.terumo.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '朝日英達', nameEn: 'Asahi Intecc', nameJa: '朝日インテック', desc: '導管導絲・微創醫療器材', descEn: 'Guidewires & minimally invasive medical devices', descJa: 'ガイドワイヤー・低侵襲医療機器', url: 'https://www.asahi-intecc.co.jp/', location: '愛知', locationEn: 'Aichi', locationJa: '愛知' },
    { name: '日本光電', nameEn: 'Nihon Kohden', nameJa: '日本光電', desc: '生理機能檢查設備・AED', descEn: 'Physiological monitoring equipment & AED', descJa: '生体情報モニタリング・AED', url: 'https://www.nihonkohden.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '島津製作所', nameEn: 'Shimadzu Corporation', nameJa: '島津製作所', desc: '分析儀器・醫療診斷設備', descEn: 'Analytical instruments & medical diagnostics', descJa: '分析計測機器・医療診断装置', url: 'https://www.shimadzu.co.jp/', location: '京都', locationEn: 'Kyoto', locationJa: '京都' },
  ],

  // 5. 家电与消费电子
  appliances: [
    { name: '大金工業', nameEn: 'Daikin Industries', nameJa: 'ダイキン工業', desc: '空調世界第一・熱泵技術', descEn: 'World\'s #1 HVAC & heat pump technology', descJa: '空調世界第1位・ヒートポンプ技術', url: 'https://www.daikin.co.jp/', location: '大阪', locationEn: 'Osaka', locationJa: '大阪' },
    { name: '夏普', nameEn: 'Sharp', nameJa: 'シャープ', desc: '液晶技術・鴻海集團旗下', descEn: 'LCD technology & Foxconn subsidiary', descJa: '液晶技術・鴻海グループ傘下', url: 'https://jp.sharp/', location: '大阪', locationEn: 'Osaka', locationJa: '大阪' },
    { name: '百樂', nameEn: 'PILOT', nameJa: 'パイロット', desc: '書寫工具世界品牌・摩擦筆', descEn: 'Global writing instrument brand & FriXion pen', descJa: '筆記具世界ブランド・フリクションペン', url: 'https://www.pilot.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '卡西歐', nameEn: 'CASIO', nameJa: 'カシオ', desc: '電子計算機・手錶・電子樂器', descEn: 'Calculators, watches & electronic instruments', descJa: '電卓・腕時計・電子楽器', url: 'https://www.casio.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '佳能', nameEn: 'Canon', nameJa: 'キヤノン', desc: '相機・影印機・醫療設備', descEn: 'Cameras, copiers & medical equipment', descJa: 'カメラ・複合機・医療機器', url: 'https://global.canon/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '尼康', nameEn: 'Nikon', nameJa: 'ニコン', desc: '光學・精密設備・半導體曝光機', descEn: 'Optics, precision equipment & semiconductor lithography', descJa: '光学・精密機器・半導体露光装置', url: 'https://www.nikon.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '精工愛普生', nameEn: 'Seiko Epson', nameJa: 'セイコーエプソン', desc: '印表機・投影機・機器人', descEn: 'Printers, projectors & robotics', descJa: 'プリンター・プロジェクター・ロボット', url: 'https://www.epson.jp/', location: '長野', locationEn: 'Nagano', locationJa: '長野' },
  ],

  // 6. 零售与服务业
  retail: [
    { name: '高島屋', nameEn: 'Takashimaya', nameJa: '高島屋', desc: '百貨公司・日本款待服務', descEn: 'Department store & Japanese hospitality', descJa: '百貨店・日本のおもてなし', url: 'https://www.takashimaya.co.jp/', location: '大阪', locationEn: 'Osaka', locationJa: '大阪' },
    { name: '三越伊勢丹', nameEn: 'Isetan Mitsukoshi', nameJa: '三越伊勢丹', desc: '百貨龍頭・顧客服務標竿', descEn: 'Leading department store & customer service benchmark', descJa: '百貨店最大手・顧客サービスの模範', url: 'https://www.mistore.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '唐吉訶德', nameEn: 'Don Quijote', nameJa: 'ドン・キホーテ', desc: '折扣店・24小時・觀光客人氣', descEn: 'Discount store, 24-hour & tourist favorite', descJa: 'ディスカウントストア・24時間・観光客人気', url: 'https://www.donki.com/', location: '全國', locationEn: 'Nationwide', locationJa: '全国' },
    { name: '宜得利', nameEn: 'NITORI', nameJa: 'ニトリ', desc: '家居用品・製造零售一體化', descEn: 'Home furnishings & vertically integrated retail', descJa: 'ホームファニシング・製造小売一体化', url: 'https://www.nitori.co.jp/', location: '北海道', locationEn: 'Hokkaido', locationJa: '北海道' },
    { name: '無印良品', nameEn: 'MUJI / Ryohin Keikaku', nameJa: '良品計画', desc: '簡約生活・永續發展・全球展店', descEn: 'Minimal living, sustainability & global expansion', descJa: 'シンプル生活・サステナビリティ・グローバル展開', url: 'https://www.ryohin-keikaku.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
  ],

  // 7. 饭店与款待业
  hospitality: [
    { name: '星野集團', nameEn: 'Hoshino Resorts', nameJa: '星野リゾート', desc: '日本頂級度假村・虹夕諾雅品牌', descEn: 'Japan\'s top resort group & Hoshinoya brand', descJa: '日本最高級リゾート・星のや ブランド', url: 'https://www.hoshinoresorts.com/', location: '長野', locationEn: 'Nagano', locationJa: '長野' },
    { name: '東急飯店', nameEn: 'Tokyu Hotels', nameJa: '東急ホテルズ', desc: '都市型飯店・商務服務', descEn: 'Urban hotels & business services', descJa: '都市型ホテル・ビジネスサービス', url: 'https://www.tokyuhotels.co.jp/', location: '全國', locationEn: 'Nationwide', locationJa: '全国' },
    { name: 'APA飯店', nameEn: 'APA Hotels', nameJa: 'アパホテル', desc: '商務飯店連鎖・效率經營', descEn: 'Business hotel chain & efficient operations', descJa: 'ビジネスホテルチェーン・効率経営', url: 'https://www.apahotel.com/', location: '全國', locationEn: 'Nationwide', locationJa: '全国' },
    { name: '東橫INN', nameEn: 'Toyoko Inn', nameJa: '東横イン', desc: '經濟型商務飯店・標準化經營', descEn: 'Budget business hotel & standardized operations', descJa: 'エコノミービジネスホテル・標準化経営', url: 'https://www.toyoko-inn.com/', location: '全國', locationEn: 'Nationwide', locationJa: '全国' },
    { name: '加賀屋', nameEn: 'Kagaya', nameJa: '加賀屋', desc: '日本第一溫泉旅館・極致款待', descEn: 'Japan\'s #1 ryokan & ultimate hospitality', descJa: '日本一の温泉旅館・究極のおもてなし', url: 'https://www.kagaya.co.jp/', location: '石川', locationEn: 'Ishikawa', locationJa: '石川' },
    { name: '界', nameEn: 'Kai (Hoshino)', nameJa: '界（星野リゾート）', desc: '星野旗下・地域特色溫泉旅館', descEn: 'Hoshino brand & regional onsen ryokan', descJa: '星野リゾート・地域の特色ある温泉旅館', url: 'https://kai-ryokan.jp/', location: '全國', locationEn: 'Nationwide', locationJa: '全国' },
  ],

  // 8. 食品与饮料产业
  food: [
    { name: '養樂多', nameEn: 'Yakult', nameJa: 'ヤクルト', desc: '乳酸菌飲料・腸道健康科學', descEn: 'Probiotic drinks & gut health science', descJa: '乳酸菌飲料・腸内健康科学', url: 'https://www.yakult.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '可果美', nameEn: 'Kagome', nameJa: 'カゴメ', desc: '番茄加工・蔬菜飲料領導者', descEn: 'Tomato processing & vegetable beverage leader', descJa: 'トマト加工・野菜飲料リーダー', url: 'https://www.kagome.co.jp/', location: '愛知', locationEn: 'Aichi', locationJa: '愛知' },
    { name: '龜甲萬', nameEn: 'Kikkoman', nameJa: 'キッコーマン', desc: '醬油世界品牌・發酵技術', descEn: 'World soy sauce brand & fermentation technology', descJa: '醤油世界ブランド・発酵技術', url: 'https://www.kikkoman.com/', location: '千葉', locationEn: 'Chiba', locationJa: '千葉' },
    { name: '明治控股', nameEn: 'Meiji Holdings', nameJa: '明治ホールディングス', desc: '乳製品・巧克力・製藥', descEn: 'Dairy, chocolate & pharmaceuticals', descJa: '乳製品・チョコレート・製薬', url: 'https://www.meiji.com/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '森永製菓', nameEn: 'Morinaga', nameJa: '森永製菓', desc: '糖果・巧克力・健康食品', descEn: 'Confectionery, chocolate & health foods', descJa: '菓子・チョコレート・健康食品', url: 'https://www.morinaga.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
  ],

  // 9. 物流与运输
  logistics: [
    { name: 'JR東日本', nameEn: 'JR East', nameJa: 'JR東日本', desc: '新幹線・站前開發・Suica', descEn: 'Shinkansen, station development & Suica', descJa: '新幹線・駅前開発・Suica', url: 'https://www.jreast.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: 'JR西日本', nameEn: 'JR West', nameJa: 'JR西日本', desc: '關西鐵道網・觀光列車', descEn: 'Kansai rail network & sightseeing trains', descJa: '関西鉄道網・観光列車', url: 'https://www.westjr.co.jp/', location: '大阪', locationEn: 'Osaka', locationJa: '大阪' },
    { name: '全日空', nameEn: 'ANA', nameJa: '全日本空輸', desc: '日本最大航空・星空聯盟', descEn: 'Japan\'s largest airline & Star Alliance member', descJa: '日本最大の航空会社・スターアライアンス', url: 'https://www.ana.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '日本航空', nameEn: 'JAL', nameJa: '日本航空', desc: '日本航空・寰宇一家', descEn: 'Japan Airlines & Oneworld alliance', descJa: '日本航空・ワンワールド', url: 'https://www.jal.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '日本郵船', nameEn: 'NYK Line', nameJa: '日本郵船', desc: '海運・物流・郵輪', descEn: 'Shipping, logistics & cruise lines', descJa: '海運・物流・クルーズ', url: 'https://www.nyk.com/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '商船三井', nameEn: 'MOL', nameJa: '商船三井', desc: '國際海運・LNG運輸', descEn: 'International shipping & LNG transport', descJa: '国際海運・LNG輸送', url: 'https://www.mol.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
  ],

  // 10. 科技与通讯
  tech: [
    { name: '軟銀集團', nameEn: 'SoftBank Group', nameJa: 'ソフトバンクグループ', desc: 'ARM收購・願景基金・AI投資', descEn: 'ARM acquisition, Vision Fund & AI investment', descJa: 'ARM買収・ビジョンファンド・AI投資', url: 'https://www.softbank.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '樂天', nameEn: 'Rakuten', nameJa: '楽天グループ', desc: '電商・金融・通訊一體化生態系', descEn: 'E-commerce, fintech & telecom ecosystem', descJa: 'EC・金融・通信の一体化エコシステム', url: 'https://www.rakuten.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: 'LINE', nameEn: 'LINE Corporation', nameJa: 'LINEヤフー', desc: '日本第一通訊APP・韓國Naver旗下', descEn: 'Japan\'s #1 messaging app & Naver subsidiary', descJa: '日本第1位のメッセージアプリ・Naver傘下', url: 'https://linecorp.com/ja/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: 'DeNA', nameEn: 'DeNA', nameJa: 'ディー・エヌ・エー', desc: '手遊・AI・橫濱棒球隊', descEn: 'Mobile gaming, AI & Yokohama baseball team', descJa: 'モバイルゲーム・AI・横浜ベイスターズ', url: 'https://dena.com/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: 'CyberAgent', nameEn: 'CyberAgent', nameJa: 'サイバーエージェント', desc: 'ABEMA・廣告・遊戲', descEn: 'ABEMA streaming, advertising & gaming', descJa: 'ABEMA・広告・ゲーム', url: 'https://www.cyberagent.co.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: '富士通', nameEn: 'Fujitsu', nameJa: '富士通', desc: 'IT服務・超級電腦・量子計算', descEn: 'IT services, supercomputers & quantum computing', descJa: 'ITサービス・スーパーコンピュータ・量子コンピューティング', url: 'https://www.fujitsu.com/jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: 'NEC', nameEn: 'NEC Corporation', nameJa: 'NEC', desc: '5G・AI・生物識別', descEn: '5G, AI & biometric identification', descJa: '5G・AI・生体認証', url: 'https://jpn.nec.com/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
    { name: 'GMO網路', nameEn: 'GMO Internet', nameJa: 'GMOインターネットグループ', desc: '網域・雲端・金融科技', descEn: 'Domain, cloud & fintech services', descJa: 'ドメイン・クラウド・フィンテック', url: 'https://www.gmo.jp/', location: '東京', locationEn: 'Tokyo', locationJa: '東京' },
  ],
};

// 类别元数据（用于 UI 展示）
export const CATEGORY_META: Record<CompanyCategory, { titleKey: string; titleEn: string; icon: string }> = {
  automotive: { titleKey: '汽車製造業', titleEn: 'Automotive Manufacturing', icon: 'Car' },
  electronics: { titleKey: '電子與半導體產業', titleEn: 'Electronics & Semiconductor', icon: 'Cpu' },
  precision: { titleKey: '精密機械與自動化', titleEn: 'Precision Machinery & Automation', icon: 'Cog' },
  medical: { titleKey: '醫療與健康照護', titleEn: 'Medical & Healthcare', icon: 'Heart' },
  appliances: { titleKey: '家電與消費電子', titleEn: 'Appliances & Consumer Electronics', icon: 'Tv' },
  retail: { titleKey: '零售與服務業', titleEn: 'Retail & Services', icon: 'ShoppingBag' },
  hospitality: { titleKey: '飯店與款待業', titleEn: 'Hospitality', icon: 'Hotel' },
  food: { titleKey: '食品與飲料產業', titleEn: 'Food & Beverage', icon: 'UtensilsCrossed' },
  logistics: { titleKey: '物流與運輸', titleEn: 'Logistics & Transportation', icon: 'Truck' },
  tech: { titleKey: '科技與通訊', titleEn: 'Technology & Communications', icon: 'Smartphone' },
};

// 统计信息
export const COMPANY_STATS = {
  totalCompanies: Object.values(COMPANY_DATA).flat().length,
  totalCategories: Object.keys(COMPANY_DATA).length,
  prefecturesCovered: 47,
  successRate: 98,
};
