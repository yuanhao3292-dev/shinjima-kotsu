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
  /** 企业简介（繁体中文） */
  desc: string;
  /** 官方网站 URL */
  url: string;
  /** 所在地区（繁体中文） */
  location: string;
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
    { name: '豐田產業技術紀念館', nameEn: 'Toyota Commemorative Museum', desc: '豐田生產方式(TPS)與改善哲學的聖地', url: 'https://www.tcmit.org/', location: '名古屋' },
    { name: '豐田汽車', nameEn: 'Toyota Motor Corporation', desc: '全球最大汽車製造商・混合動力先驅', url: 'https://www.toyota.co.jp/', location: '愛知' },
    { name: '本田技研工業', nameEn: 'Honda Motor', desc: '摩托車世界第一・ASIMO機器人', url: 'https://www.honda.co.jp/', location: '東京' },
    { name: '日產汽車', nameEn: 'Nissan Motor', desc: '電動車先驅・ProPILOT自動駕駛', url: 'https://www.nissan.co.jp/', location: '橫濱' },
    { name: '馬自達', nameEn: 'Mazda Motor', desc: '創馳藍天技術・轉子引擎傳奇', url: 'https://www.mazda.co.jp/', location: '廣島' },
    { name: '斯巴魯', nameEn: 'Subaru Corporation', desc: '水平對臥引擎・EyeSight安全系統', url: 'https://www.subaru.co.jp/', location: '群馬' },
    { name: '三菱汽車', nameEn: 'Mitsubishi Motors', desc: '四輪驅動技術・電動車戰略', url: 'https://www.mitsubishi-motors.co.jp/', location: '東京' },
    { name: '鈴木汽車', nameEn: 'Suzuki Motor', desc: '輕型車世界領導者・印度市場霸主', url: 'https://www.suzuki.co.jp/', location: '靜岡' },
    { name: '電裝', nameEn: 'DENSO', desc: '汽車零件世界第二・ADAS先進駕駛', url: 'https://www.denso.com/jp/ja/', location: '愛知' },
    { name: '愛信精機', nameEn: 'Aisin Corporation', desc: '變速箱世界頂級・豐田集團核心', url: 'https://www.aisin.com/', location: '愛知' },
  ],

  // 2. 电子与半导体
  electronics: [
    { name: '索尼', nameEn: 'SONY', desc: '影像感測器世界第一・娛樂帝國', url: 'https://www.sony.com/ja/', location: '東京' },
    { name: '東京威力科創', nameEn: 'Tokyo Electron', desc: '半導體製造設備世界前三', url: 'https://www.tel.co.jp/', location: '東京' },
    { name: '村田製作所', nameEn: 'Murata Manufacturing', desc: '電子元件世界龍頭・MLCC霸主', url: 'https://www.murata.com/ja-jp', location: '京都' },
    { name: '京瓷', nameEn: 'KYOCERA', desc: '精密陶瓷・太陽能・稻盛哲學', url: 'https://www.kyocera.co.jp/', location: '京都' },
    { name: '日本電產', nameEn: 'Nidec Corporation', desc: '精密馬達世界第一・永守經營學', url: 'https://www.nidec.com/ja-JP/', location: '京都' },
    { name: '羅姆半導體', nameEn: 'ROHM Semiconductor', desc: 'SiC功率半導體領導者', url: 'https://www.rohm.co.jp/', location: '京都' },
    { name: 'TDK', nameEn: 'TDK Corporation', desc: '電子材料・感測器・電池技術', url: 'https://www.tdk.com/ja/', location: '東京' },
    { name: '瑞薩電子', nameEn: 'Renesas Electronics', desc: '車用MCU世界第一・IoT解決方案', url: 'https://www.renesas.com/jp/ja', location: '東京' },
    { name: '迪思科', nameEn: 'DISCO Corporation', desc: '半導體切割研磨設備世界第一', url: 'https://www.disco.co.jp/', location: '東京' },
    { name: '愛德萬測試', nameEn: 'Advantest', desc: '半導體測試設備世界領導者', url: 'https://www.advantest.com/ja/', location: '東京' },
  ],

  // 3. 精密机械与自动化
  precision: [
    { name: '發那科', nameEn: 'FANUC', desc: '工業機器人世界第一・CNC控制器', url: 'https://www.fanuc.co.jp/', location: '山梨' },
    { name: '安川電機', nameEn: 'Yaskawa Electric', desc: '伺服馬達・變頻器・機器人', url: 'https://www.yaskawa.co.jp/', location: '福岡' },
    { name: 'DMG森精機', nameEn: 'DMG MORI', desc: '工具機世界頂尖・5軸加工技術', url: 'https://www.dmgmori.co.jp/', location: '名古屋' },
    { name: '基恩斯', nameEn: 'KEYENCE', desc: 'FA感測器・營業利益率50%傳奇', url: 'https://www.keyence.co.jp/', location: '大阪' },
    { name: '不二越', nameEn: 'Nachi-Fujikoshi', desc: '工業機器人・軸承・工具機', url: 'https://www.nachi-fujikoshi.co.jp/', location: '富山' },
    { name: '歐姆龍', nameEn: 'OMRON', desc: 'FA控制器・感測器・自動化解決方案', url: 'https://www.omron.co.jp/', location: '京都' },
    { name: '三菱電機', nameEn: 'Mitsubishi Electric', desc: 'FA系統・電梯・空調・衛星', url: 'https://www.mitsubishielectric.co.jp/', location: '東京' },
    { name: '日立製作所', nameEn: 'Hitachi', desc: '社會基礎設施・IT・能源系統', url: 'https://www.hitachi.co.jp/', location: '東京' },
    { name: '三菱重工業', nameEn: 'Mitsubishi Heavy Industries', desc: '航空航天・能源・造船重工', url: 'https://www.mhi.com/jp/', location: '東京' },
  ],

  // 4. 医疗与健康照护
  medical: [
    { name: '奧林巴斯', nameEn: 'Olympus', desc: '內視鏡世界市佔率70%', url: 'https://www.olympus.co.jp/', location: '東京' },
    { name: '泰爾茂', nameEn: 'Terumo', desc: '醫療器材・血液製品・心血管', url: 'https://www.terumo.co.jp/', location: '東京' },
    { name: '朝日英達', nameEn: 'Asahi Intecc', desc: '導管導絲・微創醫療器材', url: 'https://www.asahi-intecc.co.jp/', location: '愛知' },
    { name: '日本光電', nameEn: 'Nihon Kohden', desc: '生理機能檢查設備・AED', url: 'https://www.nihonkohden.co.jp/', location: '東京' },
    { name: '島津製作所', nameEn: 'Shimadzu Corporation', desc: '分析儀器・醫療診斷設備', url: 'https://www.shimadzu.co.jp/', location: '京都' },
  ],

  // 5. 家电与消费电子
  appliances: [
    { name: '大金工業', nameEn: 'Daikin Industries', desc: '空調世界第一・熱泵技術', url: 'https://www.daikin.co.jp/', location: '大阪' },
    { name: '夏普', nameEn: 'Sharp', desc: '液晶技術・鴻海集團旗下', url: 'https://jp.sharp/', location: '大阪' },
    { name: '百樂', nameEn: 'PILOT', desc: '書寫工具世界品牌・摩擦筆', url: 'https://www.pilot.co.jp/', location: '東京' },
    { name: '卡西歐', nameEn: 'CASIO', desc: '電子計算機・手錶・電子樂器', url: 'https://www.casio.co.jp/', location: '東京' },
    { name: '佳能', nameEn: 'Canon', desc: '相機・影印機・醫療設備', url: 'https://global.canon/', location: '東京' },
    { name: '尼康', nameEn: 'Nikon', desc: '光學・精密設備・半導體曝光機', url: 'https://www.nikon.co.jp/', location: '東京' },
    { name: '精工愛普生', nameEn: 'Seiko Epson', desc: '印表機・投影機・機器人', url: 'https://www.epson.jp/', location: '長野' },
  ],

  // 6. 零售与服务业
  retail: [
    { name: '高島屋', nameEn: 'Takashimaya', desc: '百貨公司・日本款待服務', url: 'https://www.takashimaya.co.jp/', location: '大阪' },
    { name: '三越伊勢丹', nameEn: 'Isetan Mitsukoshi', desc: '百貨龍頭・顧客服務標竿', url: 'https://www.mistore.jp/', location: '東京' },
    { name: '唐吉訶德', nameEn: 'Don Quijote', desc: '折扣店・24小時・觀光客人氣', url: 'https://www.donki.com/', location: '全國' },
    { name: '宜得利', nameEn: 'NITORI', desc: '家居用品・製造零售一體化', url: 'https://www.nitori.co.jp/', location: '北海道' },
    { name: '無印良品', nameEn: 'MUJI / Ryohin Keikaku', desc: '簡約生活・永續發展・全球展店', url: 'https://www.ryohin-keikaku.jp/', location: '東京' },
  ],

  // 7. 饭店与款待业
  hospitality: [
    { name: '星野集團', nameEn: 'Hoshino Resorts', desc: '日本頂級度假村・虹夕諾雅品牌', url: 'https://www.hoshinoresorts.com/', location: '長野' },
    { name: '東急飯店', nameEn: 'Tokyu Hotels', desc: '都市型飯店・商務服務', url: 'https://www.tokyuhotels.co.jp/', location: '全國' },
    { name: 'APA飯店', nameEn: 'APA Hotels', desc: '商務飯店連鎖・效率經營', url: 'https://www.apahotel.com/', location: '全國' },
    { name: '東橫INN', nameEn: 'Toyoko Inn', desc: '經濟型商務飯店・標準化經營', url: 'https://www.toyoko-inn.com/', location: '全國' },
    { name: '加賀屋', nameEn: 'Kagaya', desc: '日本第一溫泉旅館・極致款待', url: 'https://www.kagaya.co.jp/', location: '石川' },
    { name: '界', nameEn: 'Kai (Hoshino)', desc: '星野旗下・地域特色溫泉旅館', url: 'https://kai-ryokan.jp/', location: '全國' },
  ],

  // 8. 食品与饮料产业
  food: [
    { name: '養樂多', nameEn: 'Yakult', desc: '乳酸菌飲料・腸道健康科學', url: 'https://www.yakult.co.jp/', location: '東京' },
    { name: '可果美', nameEn: 'Kagome', desc: '番茄加工・蔬菜飲料領導者', url: 'https://www.kagome.co.jp/', location: '愛知' },
    { name: '龜甲萬', nameEn: 'Kikkoman', desc: '醬油世界品牌・發酵技術', url: 'https://www.kikkoman.com/', location: '千葉' },
    { name: '明治控股', nameEn: 'Meiji Holdings', desc: '乳製品・巧克力・製藥', url: 'https://www.meiji.com/', location: '東京' },
    { name: '森永製菓', nameEn: 'Morinaga', desc: '糖果・巧克力・健康食品', url: 'https://www.morinaga.co.jp/', location: '東京' },
  ],

  // 9. 物流与运输
  logistics: [
    { name: 'JR東日本', nameEn: 'JR East', desc: '新幹線・站前開發・Suica', url: 'https://www.jreast.co.jp/', location: '東京' },
    { name: 'JR西日本', nameEn: 'JR West', desc: '關西鐵道網・觀光列車', url: 'https://www.westjr.co.jp/', location: '大阪' },
    { name: '全日空', nameEn: 'ANA', desc: '日本最大航空・星空聯盟', url: 'https://www.ana.co.jp/', location: '東京' },
    { name: '日本航空', nameEn: 'JAL', desc: '日本航空・寰宇一家', url: 'https://www.jal.co.jp/', location: '東京' },
    { name: '日本郵船', nameEn: 'NYK Line', desc: '海運・物流・郵輪', url: 'https://www.nyk.com/', location: '東京' },
    { name: '商船三井', nameEn: 'MOL', desc: '國際海運・LNG運輸', url: 'https://www.mol.co.jp/', location: '東京' },
  ],

  // 10. 科技与通讯
  tech: [
    { name: '軟銀集團', nameEn: 'SoftBank Group', desc: 'ARM收購・願景基金・AI投資', url: 'https://www.softbank.jp/', location: '東京' },
    { name: '樂天', nameEn: 'Rakuten', desc: '電商・金融・通訊一體化生態系', url: 'https://www.rakuten.co.jp/', location: '東京' },
    { name: 'LINE', nameEn: 'LINE Corporation', desc: '日本第一通訊APP・韓國Naver旗下', url: 'https://linecorp.com/ja/', location: '東京' },
    { name: 'DeNA', nameEn: 'DeNA', desc: '手遊・AI・橫濱棒球隊', url: 'https://dena.com/', location: '東京' },
    { name: 'CyberAgent', nameEn: 'CyberAgent', desc: 'ABEMA・廣告・遊戲', url: 'https://www.cyberagent.co.jp/', location: '東京' },
    { name: '富士通', nameEn: 'Fujitsu', desc: 'IT服務・超級電腦・量子計算', url: 'https://www.fujitsu.com/jp/', location: '東京' },
    { name: 'NEC', nameEn: 'NEC Corporation', desc: '5G・AI・生物識別', url: 'https://jpn.nec.com/', location: '東京' },
    { name: 'GMO網路', nameEn: 'GMO Internet', desc: '網域・雲端・金融科技', url: 'https://www.gmo.jp/', location: '東京' },
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
