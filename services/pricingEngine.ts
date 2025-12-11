import { ItineraryRequest, QuoteResponse } from "../types";
import { INTERNAL_COSTS, MARGIN_RATE } from "../constants";

// Simulate fetching from an external OTA (e.g., Agoda/Booking)
// In production, this would be a real API call via a backend proxy
const fetchOtaPriceSnapshot = (location: string, stars: number): number => {
  // Get base internal price as reference
  const basePrice = INTERNAL_COSTS.hotel_avg[stars as keyof typeof INTERNAL_COSTS.hotel_avg] || 15000;
  
  // Simulate market fluctuation: 70% to 110% of our contract price
  // If it's < 1.0, it means OTA is undercutting our contract (opportunity for arbitrage)
  const fluctuation = 0.7 + Math.random() * 0.4; 
  
  return Math.floor(basePrice * fluctuation);
};

export const calculateQuote = async (request: ItineraryRequest): Promise<QuoteResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // 1. Transport Cost
  let transportCost = 0;
  if (request.need_bus) {
    const dailyRate = INTERNAL_COSTS.bus_daily[request.bus_type] || 90000;
    transportCost = dailyRate * request.travel_days;
  }

  // 2. Guide Cost
  const guideCost = INTERNAL_COSTS.guide_daily * request.travel_days;

  // 3. Hotel Cost Arbitration (The Core Logic)
  const internalUnit = INTERNAL_COSTS.hotel_avg[request.hotel_req.stars as keyof typeof INTERNAL_COSTS.hotel_avg] || 15000;
  const internalTotal = internalUnit * request.hotel_req.rooms * request.hotel_req.nights;

  const otaUnit = fetchOtaPriceSnapshot(request.hotel_req.location, request.hotel_req.stars);
  const otaTotal = otaUnit * request.hotel_req.rooms * request.hotel_req.nights;

  let chosenHotelCost = 0;
  let sourcingStrategy = "";

  // Logic: Pick the cheaper option to maximize margin or competitiveness
  if (otaUnit < internalUnit) {
    chosenHotelCost = otaTotal;
    sourcingStrategy = `OTA 套利 (發現 ¥${otaUnit.toLocaleString()} vs 合約 ¥${internalUnit.toLocaleString()})`;
  } else {
    chosenHotelCost = internalTotal;
    sourcingStrategy = "內部合約價";
  }

  // 4. Totals
  const totalCost = transportCost + guideCost + chosenHotelCost;
  const marginAmount = totalCost * MARGIN_RATE;
  const finalPrice = totalCost + marginAmount;

  return {
    id: Math.random().toString(36).substr(2, 9),
    status: 'success',
    estimated_total_jpy: Math.floor(finalPrice),
    per_person_jpy: Math.floor(finalPrice / request.pax),
    breakdown: {
      transport: transportCost,
      guide: guideCost,
      hotel_cost_basis: chosenHotelCost,
      sourcing_strategy: sourcingStrategy,
      margin: marginAmount
    },
    system_note: "正在進行 AI 分析...", // Placeholder
    timestamp: new Date()
  };
};