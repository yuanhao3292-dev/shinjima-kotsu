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
  /** 企业简介（英文） */
  descEn: string;
  /** 官方网站 URL */
  url: string;
  /** 所在地区（繁体中文） */
  location: string;
  /** 所在地区（英文） */
  locationEn: string;
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
    { name: '豐田產業技術紀念館', nameEn: 'Toyota Commemorative Museum', desc: '豐田生產方式(TPS)與改善哲學的聖地', descEn: 'Birthplace of the Toyota Production System (TPS) and Kaizen philosophy', url: 'https://www.tcmit.org/', location: '名古屋', locationEn: 'Nagoya' },
    { name: '豐田汽車', nameEn: 'Toyota Motor Corporation', desc: '全球最大汽車製造商・混合動力先驅', descEn: 'World\'s largest automaker & hybrid vehicle pioneer', url: 'https://www.toyota.co.jp/', location: '愛知', locationEn: 'Aichi' },
    { name: '本田技研工業', nameEn: 'Honda Motor', desc: '摩托車世界第一・ASIMO機器人', descEn: 'World\'s #1 motorcycle maker & ASIMO robotics', url: 'https://www.honda.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '日產汽車', nameEn: 'Nissan Motor', desc: '電動車先驅・ProPILOT自動駕駛', descEn: 'EV pioneer & ProPILOT autonomous driving', url: 'https://www.nissan.co.jp/', location: '橫濱', locationEn: 'Yokohama' },
    { name: '馬自達', nameEn: 'Mazda Motor', desc: '創馳藍天技術・轉子引擎傳奇', descEn: 'SKYACTIV technology & rotary engine legacy', url: 'https://www.mazda.co.jp/', location: '廣島', locationEn: 'Hiroshima' },
    { name: '斯巴魯', nameEn: 'Subaru Corporation', desc: '水平對臥引擎・EyeSight安全系統', descEn: 'Boxer engine & EyeSight safety system', url: 'https://www.subaru.co.jp/', location: '群馬', locationEn: 'Gunma' },
    { name: '三菱汽車', nameEn: 'Mitsubishi Motors', desc: '四輪驅動技術・電動車戰略', descEn: '4WD technology & EV strategy', url: 'https://www.mitsubishi-motors.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '鈴木汽車', nameEn: 'Suzuki Motor', desc: '輕型車世界領導者・印度市場霸主', descEn: 'Global kei car leader & India market leader', url: 'https://www.suzuki.co.jp/', location: '靜岡', locationEn: 'Shizuoka' },
    { name: '電裝', nameEn: 'DENSO', desc: '汽車零件世界第二・ADAS先進駕駛', descEn: 'World\'s #2 auto parts supplier & ADAS leader', url: 'https://www.denso.com/jp/ja/', location: '愛知', locationEn: 'Aichi' },
    { name: '愛信精機', nameEn: 'Aisin Corporation', desc: '變速箱世界頂級・豐田集團核心', descEn: 'World-class transmissions & Toyota Group core', url: 'https://www.aisin.com/', location: '愛知', locationEn: 'Aichi' },
  ],

  // 2. 电子与半导体
  electronics: [
    { name: '索尼', nameEn: 'SONY', desc: '影像感測器世界第一・娛樂帝國', descEn: 'World\'s #1 image sensor & entertainment empire', url: 'https://www.sony.com/ja/', location: '東京', locationEn: 'Tokyo' },
    { name: '東京威力科創', nameEn: 'Tokyo Electron', desc: '半導體製造設備世界前三', descEn: 'Top 3 global semiconductor equipment maker', url: 'https://www.tel.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '村田製作所', nameEn: 'Murata Manufacturing', desc: '電子元件世界龍頭・MLCC霸主', descEn: 'Global electronic components leader & MLCC dominant', url: 'https://www.murata.com/ja-jp', location: '京都', locationEn: 'Kyoto' },
    { name: '京瓷', nameEn: 'KYOCERA', desc: '精密陶瓷・太陽能・稻盛哲學', descEn: 'Fine ceramics, solar energy & Inamori philosophy', url: 'https://www.kyocera.co.jp/', location: '京都', locationEn: 'Kyoto' },
    { name: '日本電產', nameEn: 'Nidec Corporation', desc: '精密馬達世界第一・永守經營學', descEn: 'World\'s #1 precision motor & Nagamori management', url: 'https://www.nidec.com/ja-JP/', location: '京都', locationEn: 'Kyoto' },
    { name: '羅姆半導體', nameEn: 'ROHM Semiconductor', desc: 'SiC功率半導體領導者', descEn: 'SiC power semiconductor leader', url: 'https://www.rohm.co.jp/', location: '京都', locationEn: 'Kyoto' },
    { name: 'TDK', nameEn: 'TDK Corporation', desc: '電子材料・感測器・電池技術', descEn: 'Electronic materials, sensors & battery tech', url: 'https://www.tdk.com/ja/', location: '東京', locationEn: 'Tokyo' },
    { name: '瑞薩電子', nameEn: 'Renesas Electronics', desc: '車用MCU世界第一・IoT解決方案', descEn: 'World\'s #1 automotive MCU & IoT solutions', url: 'https://www.renesas.com/jp/ja', location: '東京', locationEn: 'Tokyo' },
    { name: '迪思科', nameEn: 'DISCO Corporation', desc: '半導體切割研磨設備世界第一', descEn: 'World\'s #1 semiconductor dicing & grinding equipment', url: 'https://www.disco.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '愛德萬測試', nameEn: 'Advantest', desc: '半導體測試設備世界領導者', descEn: 'Global leader in semiconductor test equipment', url: 'https://www.advantest.com/ja/', location: '東京', locationEn: 'Tokyo' },
  ],

  // 3. 精密机械与自动化
  precision: [
    { name: '發那科', nameEn: 'FANUC', desc: '工業機器人世界第一・CNC控制器', descEn: 'World\'s #1 industrial robot & CNC controller', url: 'https://www.fanuc.co.jp/', location: '山梨', locationEn: 'Yamanashi' },
    { name: '安川電機', nameEn: 'Yaskawa Electric', desc: '伺服馬達・變頻器・機器人', descEn: 'Servo motors, inverters & robotics', url: 'https://www.yaskawa.co.jp/', location: '福岡', locationEn: 'Fukuoka' },
    { name: 'DMG森精機', nameEn: 'DMG MORI', desc: '工具機世界頂尖・5軸加工技術', descEn: 'World-class machine tools & 5-axis machining', url: 'https://www.dmgmori.co.jp/', location: '名古屋', locationEn: 'Nagoya' },
    { name: '基恩斯', nameEn: 'KEYENCE', desc: 'FA感測器・營業利益率50%傳奇', descEn: 'FA sensors & legendary 50% operating margin', url: 'https://www.keyence.co.jp/', location: '大阪', locationEn: 'Osaka' },
    { name: '不二越', nameEn: 'Nachi-Fujikoshi', desc: '工業機器人・軸承・工具機', descEn: 'Industrial robots, bearings & machine tools', url: 'https://www.nachi-fujikoshi.co.jp/', location: '富山', locationEn: 'Toyama' },
    { name: '歐姆龍', nameEn: 'OMRON', desc: 'FA控制器・感測器・自動化解決方案', descEn: 'FA controllers, sensors & automation solutions', url: 'https://www.omron.co.jp/', location: '京都', locationEn: 'Kyoto' },
    { name: '三菱電機', nameEn: 'Mitsubishi Electric', desc: 'FA系統・電梯・空調・衛星', descEn: 'FA systems, elevators, HVAC & satellites', url: 'https://www.mitsubishielectric.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '日立製作所', nameEn: 'Hitachi', desc: '社會基礎設施・IT・能源系統', descEn: 'Social infrastructure, IT & energy systems', url: 'https://www.hitachi.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '三菱重工業', nameEn: 'Mitsubishi Heavy Industries', desc: '航空航天・能源・造船重工', descEn: 'Aerospace, energy & shipbuilding', url: 'https://www.mhi.com/jp/', location: '東京', locationEn: 'Tokyo' },
  ],

  // 4. 医疗与健康照护
  medical: [
    { name: '奧林巴斯', nameEn: 'Olympus', desc: '內視鏡世界市佔率70%', descEn: '70% global endoscope market share', url: 'https://www.olympus.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '泰爾茂', nameEn: 'Terumo', desc: '醫療器材・血液製品・心血管', descEn: 'Medical devices, blood products & cardiovascular', url: 'https://www.terumo.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '朝日英達', nameEn: 'Asahi Intecc', desc: '導管導絲・微創醫療器材', descEn: 'Guidewires & minimally invasive medical devices', url: 'https://www.asahi-intecc.co.jp/', location: '愛知', locationEn: 'Aichi' },
    { name: '日本光電', nameEn: 'Nihon Kohden', desc: '生理機能檢查設備・AED', descEn: 'Physiological monitoring equipment & AED', url: 'https://www.nihonkohden.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '島津製作所', nameEn: 'Shimadzu Corporation', desc: '分析儀器・醫療診斷設備', descEn: 'Analytical instruments & medical diagnostics', url: 'https://www.shimadzu.co.jp/', location: '京都', locationEn: 'Kyoto' },
  ],

  // 5. 家电与消费电子
  appliances: [
    { name: '大金工業', nameEn: 'Daikin Industries', desc: '空調世界第一・熱泵技術', descEn: 'World\'s #1 HVAC & heat pump technology', url: 'https://www.daikin.co.jp/', location: '大阪', locationEn: 'Osaka' },
    { name: '夏普', nameEn: 'Sharp', desc: '液晶技術・鴻海集團旗下', descEn: 'LCD technology & Foxconn subsidiary', url: 'https://jp.sharp/', location: '大阪', locationEn: 'Osaka' },
    { name: '百樂', nameEn: 'PILOT', desc: '書寫工具世界品牌・摩擦筆', descEn: 'Global writing instrument brand & FriXion pen', url: 'https://www.pilot.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '卡西歐', nameEn: 'CASIO', desc: '電子計算機・手錶・電子樂器', descEn: 'Calculators, watches & electronic instruments', url: 'https://www.casio.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '佳能', nameEn: 'Canon', desc: '相機・影印機・醫療設備', descEn: 'Cameras, copiers & medical equipment', url: 'https://global.canon/', location: '東京', locationEn: 'Tokyo' },
    { name: '尼康', nameEn: 'Nikon', desc: '光學・精密設備・半導體曝光機', descEn: 'Optics, precision equipment & semiconductor lithography', url: 'https://www.nikon.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '精工愛普生', nameEn: 'Seiko Epson', desc: '印表機・投影機・機器人', descEn: 'Printers, projectors & robotics', url: 'https://www.epson.jp/', location: '長野', locationEn: 'Nagano' },
  ],

  // 6. 零售与服务业
  retail: [
    { name: '高島屋', nameEn: 'Takashimaya', desc: '百貨公司・日本款待服務', descEn: 'Department store & Japanese hospitality', url: 'https://www.takashimaya.co.jp/', location: '大阪', locationEn: 'Osaka' },
    { name: '三越伊勢丹', nameEn: 'Isetan Mitsukoshi', desc: '百貨龍頭・顧客服務標竿', descEn: 'Leading department store & customer service benchmark', url: 'https://www.mistore.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '唐吉訶德', nameEn: 'Don Quijote', desc: '折扣店・24小時・觀光客人氣', descEn: 'Discount store, 24-hour & tourist favorite', url: 'https://www.donki.com/', location: '全國', locationEn: 'Nationwide' },
    { name: '宜得利', nameEn: 'NITORI', desc: '家居用品・製造零售一體化', descEn: 'Home furnishings & vertically integrated retail', url: 'https://www.nitori.co.jp/', location: '北海道', locationEn: 'Hokkaido' },
    { name: '無印良品', nameEn: 'MUJI / Ryohin Keikaku', desc: '簡約生活・永續發展・全球展店', descEn: 'Minimal living, sustainability & global expansion', url: 'https://www.ryohin-keikaku.jp/', location: '東京', locationEn: 'Tokyo' },
  ],

  // 7. 饭店与款待业
  hospitality: [
    { name: '星野集團', nameEn: 'Hoshino Resorts', desc: '日本頂級度假村・虹夕諾雅品牌', descEn: 'Japan\'s top resort group & Hoshinoya brand', url: 'https://www.hoshinoresorts.com/', location: '長野', locationEn: 'Nagano' },
    { name: '東急飯店', nameEn: 'Tokyu Hotels', desc: '都市型飯店・商務服務', descEn: 'Urban hotels & business services', url: 'https://www.tokyuhotels.co.jp/', location: '全國', locationEn: 'Nationwide' },
    { name: 'APA飯店', nameEn: 'APA Hotels', desc: '商務飯店連鎖・效率經營', descEn: 'Business hotel chain & efficient operations', url: 'https://www.apahotel.com/', location: '全國', locationEn: 'Nationwide' },
    { name: '東橫INN', nameEn: 'Toyoko Inn', desc: '經濟型商務飯店・標準化經營', descEn: 'Budget business hotel & standardized operations', url: 'https://www.toyoko-inn.com/', location: '全國', locationEn: 'Nationwide' },
    { name: '加賀屋', nameEn: 'Kagaya', desc: '日本第一溫泉旅館・極致款待', descEn: 'Japan\'s #1 ryokan & ultimate hospitality', url: 'https://www.kagaya.co.jp/', location: '石川', locationEn: 'Ishikawa' },
    { name: '界', nameEn: 'Kai (Hoshino)', desc: '星野旗下・地域特色溫泉旅館', descEn: 'Hoshino brand & regional onsen ryokan', url: 'https://kai-ryokan.jp/', location: '全國', locationEn: 'Nationwide' },
  ],

  // 8. 食品与饮料产业
  food: [
    { name: '養樂多', nameEn: 'Yakult', desc: '乳酸菌飲料・腸道健康科學', descEn: 'Probiotic drinks & gut health science', url: 'https://www.yakult.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '可果美', nameEn: 'Kagome', desc: '番茄加工・蔬菜飲料領導者', descEn: 'Tomato processing & vegetable beverage leader', url: 'https://www.kagome.co.jp/', location: '愛知', locationEn: 'Aichi' },
    { name: '龜甲萬', nameEn: 'Kikkoman', desc: '醬油世界品牌・發酵技術', descEn: 'World soy sauce brand & fermentation technology', url: 'https://www.kikkoman.com/', location: '千葉', locationEn: 'Chiba' },
    { name: '明治控股', nameEn: 'Meiji Holdings', desc: '乳製品・巧克力・製藥', descEn: 'Dairy, chocolate & pharmaceuticals', url: 'https://www.meiji.com/', location: '東京', locationEn: 'Tokyo' },
    { name: '森永製菓', nameEn: 'Morinaga', desc: '糖果・巧克力・健康食品', descEn: 'Confectionery, chocolate & health foods', url: 'https://www.morinaga.co.jp/', location: '東京', locationEn: 'Tokyo' },
  ],

  // 9. 物流与运输
  logistics: [
    { name: 'JR東日本', nameEn: 'JR East', desc: '新幹線・站前開發・Suica', descEn: 'Shinkansen, station development & Suica', url: 'https://www.jreast.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: 'JR西日本', nameEn: 'JR West', desc: '關西鐵道網・觀光列車', descEn: 'Kansai rail network & sightseeing trains', url: 'https://www.westjr.co.jp/', location: '大阪', locationEn: 'Osaka' },
    { name: '全日空', nameEn: 'ANA', desc: '日本最大航空・星空聯盟', descEn: 'Japan\'s largest airline & Star Alliance member', url: 'https://www.ana.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '日本航空', nameEn: 'JAL', desc: '日本航空・寰宇一家', descEn: 'Japan Airlines & Oneworld alliance', url: 'https://www.jal.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '日本郵船', nameEn: 'NYK Line', desc: '海運・物流・郵輪', descEn: 'Shipping, logistics & cruise lines', url: 'https://www.nyk.com/', location: '東京', locationEn: 'Tokyo' },
    { name: '商船三井', nameEn: 'MOL', desc: '國際海運・LNG運輸', descEn: 'International shipping & LNG transport', url: 'https://www.mol.co.jp/', location: '東京', locationEn: 'Tokyo' },
  ],

  // 10. 科技与通讯
  tech: [
    { name: '軟銀集團', nameEn: 'SoftBank Group', desc: 'ARM收購・願景基金・AI投資', descEn: 'ARM acquisition, Vision Fund & AI investment', url: 'https://www.softbank.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '樂天', nameEn: 'Rakuten', desc: '電商・金融・通訊一體化生態系', descEn: 'E-commerce, fintech & telecom ecosystem', url: 'https://www.rakuten.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: 'LINE', nameEn: 'LINE Corporation', desc: '日本第一通訊APP・韓國Naver旗下', descEn: 'Japan\'s #1 messaging app & Naver subsidiary', url: 'https://linecorp.com/ja/', location: '東京', locationEn: 'Tokyo' },
    { name: 'DeNA', nameEn: 'DeNA', desc: '手遊・AI・橫濱棒球隊', descEn: 'Mobile gaming, AI & Yokohama baseball team', url: 'https://dena.com/', location: '東京', locationEn: 'Tokyo' },
    { name: 'CyberAgent', nameEn: 'CyberAgent', desc: 'ABEMA・廣告・遊戲', descEn: 'ABEMA streaming, advertising & gaming', url: 'https://www.cyberagent.co.jp/', location: '東京', locationEn: 'Tokyo' },
    { name: '富士通', nameEn: 'Fujitsu', desc: 'IT服務・超級電腦・量子計算', descEn: 'IT services, supercomputers & quantum computing', url: 'https://www.fujitsu.com/jp/', location: '東京', locationEn: 'Tokyo' },
    { name: 'NEC', nameEn: 'NEC Corporation', desc: '5G・AI・生物識別', descEn: '5G, AI & biometric identification', url: 'https://jpn.nec.com/', location: '東京', locationEn: 'Tokyo' },
    { name: 'GMO網路', nameEn: 'GMO Internet', desc: '網域・雲端・金融科技', descEn: 'Domain, cloud & fintech services', url: 'https://www.gmo.jp/', location: '東京', locationEn: 'Tokyo' },
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
