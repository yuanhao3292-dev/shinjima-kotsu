import { GoogleGenAI } from "@google/genai";
import { ItineraryRequest } from "../types";

// 清理 JSON 字符串
const cleanJsonString = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    const match = str.match(/```json([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
    return null;
  }
};

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // CORS 配置
  const allowedOrigins = [
    'https://linkquoteai.com',
    'https://www.linkquoteai.com',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 检查 API 密钥
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API 配置错误' });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: '文本内容不能为空' });
    }

    // 限制输入长度（防止滥用）
    if (text.length > 5000) {
      return res.status(400).json({ error: '文本内容过长（最多 5000 字符）' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const schema = {
      type: "object" as const,
      properties: {
        agency_name: { type: "string" as const, description: "Travel agency name, default to 'Unknown' if not found" },
        pax: { type: "integer" as const, description: "Total number of people" },
        travel_days: { type: "integer" as const, description: "Total travel days" },
        location: { type: "string" as const, description: "Main city: 'Osaka', 'Tokyo', 'Hokkaido', 'Kyoto', 'Fukuoka'" },
        hotel_stars: { type: "integer" as const, description: "Hotel stars (3, 4, 5). Default 4." },
        hotel_rooms: { type: "integer" as const, description: "Number of rooms. If not specified, calculate as ceil(pax/2)." },
        need_bus: { type: "boolean" as const, description: "Is a private bus needed?" },
        bus_type: { type: "string" as const, description: "'coach' (big bus) or 'minibus' (small bus)" }
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

    if (!data) {
      return res.status(400).json({ error: '无法解析内容' });
    }

    // 转换为嵌套结构
    const result: Partial<ItineraryRequest> = {
      agency_name: data.agency_name,
      pax: data.pax,
      travel_days: data.travel_days,
      need_bus: data.need_bus,
      bus_type: data.bus_type || 'coach',
      hotel_req: {
        stars: data.hotel_stars || 4,
        rooms: data.hotel_rooms || Math.ceil((data.pax || 0) / 2),
        nights: (data.travel_days || 1) - 1,
        location: data.location || 'Osaka'
      }
    };

    return res.status(200).json(result);

  } catch (error: any) {
    console.error('AI parsing error:', error);
    return res.status(500).json({
      error: 'AI 解析失败',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
