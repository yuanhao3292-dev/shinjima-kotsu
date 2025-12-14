
import { LocationType } from "./types";

// --- PRICING DATABASE (JPY) ---

// 1. Transport Costs (Daily 10H)
// As per user specification
export const VEHICLE_RATES = {
  alphard: 45000,    // 7-seater
  hiace: 50000,      // Toyota Hiace
  coaster: 77000,    // Small Bus (Toyota Coaster)
  medium_bus: 88000, // Medium Bus
  large_bus: 100000, // Large Bus (45+ seats)
};

export const VEHICLE_LABELS = {
  alphard: '豐田 Alphard (7座)',
  hiace: '豐田海獅 Hiace (9-13座)',
  coaster: '豐田考斯特 Coaster (20座)',
  medium_bus: '中型巴士 (28座)',
  large_bus: '大型遊覽車 (45座)',
};

// 2. Guide Costs (Daily 10H)
export const GUIDE_RATES = {
  zh: 25000, // Chinese Guide
  en: 33000, // English Guide
};

// 3. Hotel Baseline Rates (Per Room / Per Night)
// Estimated B2B Contract Rates for 2024-2025
export const HOTEL_RATES: Record<string, Record<number, number>> = {
  [LocationType.OSAKA]: {
    3: 12000, // Business Hotel
    4: 28000, // City Hotel (e.g. Hankyu Respire)
    5: 65000, // Luxury (e.g. Conrad/Swissotel)
  },
  [LocationType.TOKYO]: {
    3: 15000,
    4: 35000,
    5: 85000, // Tokyo prices are higher
  },
  [LocationType.KYOTO]: {
    3: 14000,
    4: 32000,
    5: 75000, // High demand
  },
  [LocationType.HOKKAIDO]: {
    3: 10000,
    4: 25000,
    5: 55000,
  },
  [LocationType.FUKUOKA]: {
    3: 9000,
    4: 20000,
    5: 45000,
  },
};

export const MARGIN_RATE = 0.15; // 15% Profit Margin (Adjustable in Settings)

export const LOCATIONS = [
  { value: LocationType.OSAKA, label: '大阪 (關西)' },
  { value: LocationType.TOKYO, label: '東京 (關東)' },
  { value: LocationType.HOKKAIDO, label: '北海道' },
  { value: LocationType.KYOTO, label: '京都' },
  { value: LocationType.FUKUOKA, label: '福岡' },
];

export const STARS = [
  { value: 3, label: '3星 (商務型)' },
  { value: 4, label: '4星 (舒適型)' },
  { value: 5, label: '5星 (豪華型)' },
];
