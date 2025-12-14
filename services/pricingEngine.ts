
import { ItineraryRequest, QuoteResponse } from "../types";
import { VEHICLE_RATES, GUIDE_RATES, HOTEL_RATES, MARGIN_RATE, VEHICLE_LABELS } from "../constants";

export const calculateQuote = async (request: ItineraryRequest): Promise<QuoteResponse> => {
  // Simulate calculation delay for UX
  await new Promise(resolve => setTimeout(resolve, 600));

  // --- 1. Transport Cost ---
  let transportCost = 0;
  if (request.need_bus) {
    const dailyRate = VEHICLE_RATES[request.bus_type] || 100000;
    transportCost = dailyRate * request.travel_days;
  }

  // --- 2. Guide Cost ---
  // Guide is needed for all days
  const guideDaily = GUIDE_RATES[request.guide_language] || 25000;
  const guideCost = guideDaily * request.travel_days;

  // --- 3. Hotel Cost ---
  // Lookup base rate from constants based on Location & Stars
  const cityRates = HOTEL_RATES[request.hotel_req.location] || HOTEL_RATES['Osaka'];
  const roomRate = cityRates[request.hotel_req.stars] || 25000;
  
  const hotelTotal = roomRate * request.hotel_req.rooms * request.hotel_req.nights;

  // --- 4. Totals & Margin ---
  const costBasis = transportCost + guideCost + hotelTotal;
  const marginAmount = Math.ceil(costBasis * MARGIN_RATE);
  const finalPrice = costBasis + marginAmount;

  // Strategy description
  const vehicleName = VEHICLE_LABELS[request.bus_type] || request.bus_type;
  const guideType = request.guide_language === 'zh' ? '中文導遊' : '英文導遊';
  const strategyNote = `車: ${vehicleName} | 導: ${guideType} (10H) | 宿: ${request.hotel_req.location} ${request.hotel_req.stars}星`;

  return {
    id: "Q" + Math.floor(Math.random() * 1000000).toString(),
    status: 'success',
    estimated_total_jpy: Math.floor(finalPrice),
    per_person_jpy: Math.floor(finalPrice / request.pax),
    breakdown: {
      transport: transportCost,
      guide: guideCost,
      hotel_cost_basis: hotelTotal,
      sourcing_strategy: strategyNote,
      margin: marginAmount,
      extras_note: "注意：報價不含高速費、停車費、司機導遊餐費 (實報實銷)"
    },
    system_note: "正在連線 AI 分析...", 
    timestamp: new Date()
  };
};
