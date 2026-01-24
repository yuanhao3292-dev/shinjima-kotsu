export type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';
export type VehicleCategory = 'all' | 'taxi' | 'minibus' | 'mediumbus' | 'largebus';

export interface Vehicle {
  id: string;
  name: Record<Language, string>;
  category: VehicleCategory;
  image: string;
  capacity: {
    passengers: number;
    maxPassengers?: number;
    luggage: number;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  features: Record<Language, string[]>;
  suitableFor: Record<Language, string[]>;
  highlight: Record<Language, string>;
  seatLayout: {
    rows: string[][];
    legend?: Record<Language, string>;
  };
}

export interface PageTranslations {
  [key: string]: Record<Language, string>;
}

export type CategoryLabels = {
  [K in VehicleCategory]: Record<Language, string>;
}
