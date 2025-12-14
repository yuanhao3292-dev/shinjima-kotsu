
export interface HotelRequest {
  stars: number;
  rooms: number;
  nights: number;
  location: string;
}

export interface ItineraryRequest {
  agency_name: string;
  pax: number;
  travel_days: number;
  hotel_req: HotelRequest;
  need_bus: boolean;
  bus_type: 'alphard' | 'hiace' | 'coaster' | 'medium_bus' | 'large_bus';
  guide_language: 'zh' | 'en'; // Chinese or English
}

export interface CostBreakdown {
  transport: number;
  guide: number;
  hotel_cost_basis: number;
  sourcing_strategy: string;
  margin: number;
  extras_note?: string; // For highway/parking notes
}

export interface QuoteResponse {
  id: string; // Unique ID for the quote
  status: 'success' | 'error';
  estimated_total_jpy: number;
  per_person_jpy: number;
  breakdown: CostBreakdown;
  system_note: string; // AI Generated analysis
  timestamp: Date;
}

export enum LocationType {
  OSAKA = 'Osaka',
  TOKYO = 'Tokyo',
  HOKKAIDO = 'Hokkaido',
  KYOTO = 'Kyoto',
  FUKUOKA = 'Fukuoka'
}

export interface UserProfile {
  companyName: string;
  email: string;
}
