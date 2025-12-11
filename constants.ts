import { LocationType } from "./types";

// Internal Contract Costs (JPY)
export const INTERNAL_COSTS = {
  bus_daily: {
    minibus: 60000,
    coach: 90000,
  },
  guide_daily: 30000,
  // Base hotel contract rates per night per room
  hotel_avg: {
    3: 8000,
    4: 12000,
    5: 25000,
  },
};

export const MARGIN_RATE = 0.15; // 15% Profit Margin

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