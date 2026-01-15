/**
 * TIMC 医疗健检报价计算器
 * 用于 B2B 询价表单，计算包含健检+翻译+交通+住宿的打包价格
 */

// 医疗套餐定义（与 PackageComparisonTable.tsx 同步）
export const TIMC_PACKAGES = [
  { id: 'dwibs', name: 'DWIBS', nameZh: '防癌篩查', price: 275000 },
  { id: 'basic', name: 'BASIC', nameZh: '基礎套餐', price: 550000 },
  { id: 'select-gastro', name: 'SELECT', nameZh: '胃鏡', price: 687500 },
  { id: 'select-both', name: 'SELECT', nameZh: '胃腸鏡', price: 825000 },
  { id: 'premium', name: 'PREMIUM', nameZh: '心臟精密', price: 825000 },
  { id: 'vip', name: 'VIP', nameZh: '頂級全能', price: 1512500 },
] as const;

// 增值服务价格
export const ADDON_PRICES = {
  airportTransfer: 35000,      // 机场接送（单程）
  translatorDaily: 25000,      // 翻译陪同（每天）
  reportTranslation: 15000,    // 报告翻译加急
} as const;

// 酒店价格表（按地点和星级）
export const HOTEL_RATES: Record<string, Record<number, number>> = {
  'Osaka': { 3: 12000, 4: 28000, 5: 65000 },
  'Tokyo': { 3: 15000, 4: 35000, 5: 85000 },
  'Kyoto': { 3: 14000, 4: 32000, 5: 75000 },
};

// B2B 利润率
export const MARGIN_RATE = 0.15;

// 请求类型
export interface TIMCQuoteRequest {
  packageId: string;
  guestCount: number;
  addOns: {
    airportTransfer: boolean;
    airportTransferRoundTrip: boolean;  // 来回
    translator: boolean;
    translatorDays: number;
    reportTranslation: boolean;
  };
  hotel?: {
    nights: number;
    rooms: number;
    stars: 3 | 4 | 5;
    location: string;
  };
  agencyInfo: {
    companyName: string;
    contactName: string;
    contactMethod: string;
    email: string;
  };
  preferredDate: string;
  alternateDate?: string;
  notes?: string;
}

// 报价结果类型
export interface TIMCQuoteResult {
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;

  // 套餐信息
  packageId: string;
  packageName: string;
  packageNameZh: string;
  packagePrice: number;
  guestCount: number;
  packageTotal: number;

  // 增值服务
  airportTransferPrice: number;
  translatorPrice: number;
  translatorDays: number;
  reportTranslationPrice: number;

  // 酒店
  hotelPrice: number;
  hotelDetails?: {
    nights: number;
    rooms: number;
    stars: number;
    location: string;
    pricePerNight: number;
  };

  // 汇总
  subtotal: number;
  margin: number;
  finalPrice: number;
  pricePerPerson: number;

  // 客户信息
  agencyInfo: TIMCQuoteRequest['agencyInfo'];
  preferredDate: string;
  alternateDate?: string;
  notes?: string;
}

// 生成报价编号
function generateQuoteNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TIMC-Q${dateStr}-${random}`;
}

// 计算报价
export function calculateTIMCQuote(request: TIMCQuoteRequest): TIMCQuoteResult {
  // 查找套餐
  const pkg = TIMC_PACKAGES.find(p => p.id === request.packageId);
  if (!pkg) {
    throw new Error(`Invalid package ID: ${request.packageId}`);
  }

  // 1. 套餐费用
  const packageTotal = pkg.price * request.guestCount;

  // 2. 机场接送
  let airportTransferPrice = 0;
  if (request.addOns.airportTransfer) {
    airportTransferPrice = request.addOns.airportTransferRoundTrip
      ? ADDON_PRICES.airportTransfer * 2
      : ADDON_PRICES.airportTransfer;
  }

  // 3. 翻译陪同
  let translatorPrice = 0;
  if (request.addOns.translator && request.addOns.translatorDays > 0) {
    translatorPrice = ADDON_PRICES.translatorDaily * request.addOns.translatorDays;
  }

  // 4. 报告翻译
  const reportTranslationPrice = request.addOns.reportTranslation
    ? ADDON_PRICES.reportTranslation * request.guestCount
    : 0;

  // 5. 酒店费用
  let hotelPrice = 0;
  let hotelDetails: TIMCQuoteResult['hotelDetails'] | undefined;
  if (request.hotel) {
    const locationRates = HOTEL_RATES[request.hotel.location] || HOTEL_RATES['Osaka'];
    const pricePerNight = locationRates[request.hotel.stars] || locationRates[4];
    hotelPrice = pricePerNight * request.hotel.rooms * request.hotel.nights;
    hotelDetails = {
      nights: request.hotel.nights,
      rooms: request.hotel.rooms,
      stars: request.hotel.stars,
      location: request.hotel.location,
      pricePerNight,
    };
  }

  // 6. 小计
  const subtotal = packageTotal + airportTransferPrice + translatorPrice + reportTranslationPrice + hotelPrice;

  // 7. 利润
  const margin = Math.ceil(subtotal * MARGIN_RATE);

  // 8. 最终价格
  const finalPrice = subtotal + margin;

  // 9. 人均价格
  const pricePerPerson = Math.ceil(finalPrice / request.guestCount);

  // 生成报价日期
  const now = new Date();
  const quoteDate = now.toISOString().slice(0, 10);
  const validUntilDate = new Date(now);
  validUntilDate.setDate(validUntilDate.getDate() + 30);
  const validUntil = validUntilDate.toISOString().slice(0, 10);

  return {
    quoteNumber: generateQuoteNumber(),
    quoteDate,
    validUntil,

    packageId: pkg.id,
    packageName: pkg.name,
    packageNameZh: pkg.nameZh,
    packagePrice: pkg.price,
    guestCount: request.guestCount,
    packageTotal,

    airportTransferPrice,
    translatorPrice,
    translatorDays: request.addOns.translatorDays || 0,
    reportTranslationPrice,

    hotelPrice,
    hotelDetails,

    subtotal,
    margin,
    finalPrice,
    pricePerPerson,

    agencyInfo: request.agencyInfo,
    preferredDate: request.preferredDate,
    alternateDate: request.alternateDate,
    notes: request.notes,
  };
}

// 格式化价格显示
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}
