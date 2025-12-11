import { GoogleGenAI, Type } from "@google/genai";
import { QuoteResponse, ItineraryRequest } from "../types";

// Helper to validate/fix AI response
const cleanJsonString = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    // Sometimes AI wraps in ```json ... ```
    const match = str.match(/```json([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
    return null;
  }
};

const generateAIAnalysis = async (quote: QuoteResponse, request: ItineraryRequest): Promise<string> => {
  if (!process.env.API_KEY) return "AI 分析不可用：缺少 API 金鑰。";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a Senior Travel Operations Manager for a Japanese DMC.
      Analyze the following quote calculation for a B2B client.
      
      Client: ${request.agency_name}
      Pax: ${request.pax}
      Location: ${request.hotel_req.location}
      Strategy Used: ${quote.breakdown.sourcing_strategy}
      Total Price: ¥${quote.estimated_total_jpy.toLocaleString()}
      Margin: ¥${quote.breakdown.margin.toLocaleString()}

      Write a short, internal system note (max 2 sentences) in **Traditional Chinese (Taiwan)**.
      1. Comment on whether the sourcing strategy (OTA vs Contract) was effective.
      2. Mention a quick selling point about the destination or current market trend.
      
      Tone: Professional, concise, analytical, business-like.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "分析完成。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 分析生成失敗。";
  }
};

const parseSmartImport = async (text: string): Promise<Partial<ItineraryRequest> | null> => {
  if (!process.env.API_KEY) throw new Error("缺少 API 金鑰");

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Define the schema for structured output
    const schema = {
      type: Type.OBJECT,
      properties: {
        agency_name: { type: Type.STRING, description: "Travel agency name, default to 'Unknown' if not found" },
        pax: { type: Type.INTEGER, description: "Total number of people" },
        travel_days: { type: Type.INTEGER, description: "Total travel days" },
        location: { type: Type.STRING, description: "Main city: 'Osaka', 'Tokyo', 'Hokkaido', 'Kyoto', 'Fukuoka'" },
        hotel_stars: { type: Type.INTEGER, description: "Hotel stars (3, 4, 5). Default 4." },
        hotel_rooms: { type: Type.INTEGER, description: "Number of rooms. If not specified, calculate as ceil(pax/2)." },
        need_bus: { type: Type.BOOLEAN, description: "Is a private bus needed?" },
        bus_type: { type: Type.STRING, description: "'coach' (big bus) or 'minibus' (small bus)" }
      },
      required: ["pax", "travel_days", "location"]
    };

    const prompt = `
      你是一個專業的旅遊訂單處理 AI。請分析以下【非結構化需求文本】，提取關鍵資訊並輸出 JSON。
      
      規則：
      1. 地點請映射到：Osaka (大阪/關西), Tokyo (東京/關東), Hokkaido (北海道), Kyoto (京都), Fukuoka (福岡/九州)。
      2. 如果沒有提到星級，預設為 4 星。
      3. 如果沒有提到房間數，預設為人數的一半。
      4. 如果提到 "大巴" 或 "遊覽車" -> bus_type: 'coach'。 "小巴" -> bus_type: 'minibus'。
      5. 忽略禮貌用語，只提取數據。

      【需求文本】：
      "${text}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const data = cleanJsonString(response.text || "{}");
    
    if (!data) return null;

    // Convert flat JSON to nested ItineraryRequest structure
    return {
      agency_name: data.agency_name,
      pax: data.pax,
      travel_days: data.travel_days,
      need_bus: data.need_bus,
      bus_type: data.bus_type || 'coach',
      hotel_req: {
        stars: data.hotel_stars || 4,
        rooms: data.hotel_rooms || Math.ceil((data.pax || 0) / 2),
        nights: (data.travel_days || 1) - 1, // Usually nights = days - 1
        location: data.location || 'Osaka'
      }
    } as any; // Cast to any to merge easily in UI

  } catch (error) {
    console.error("Smart Import Error:", error);
    return null;
  }
};

export { generateAIAnalysis, parseSmartImport };
