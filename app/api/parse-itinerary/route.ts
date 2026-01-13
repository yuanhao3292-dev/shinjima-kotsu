import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryRequest } from "@/types";

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

// Next.js App Router API Handler
export async function POST(request: NextRequest) {
  // 检查 API 密钥
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'API 配置错误' },
      { status: 500 }
    );
  }

  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: '文本内容不能为空' },
        { status: 400 }
      );
    }

    // 限制输入长度（防止滥用）
    if (text.length > 5000) {
      return NextResponse.json(
        { error: '文本内容过长（最多 5000 字符）' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    if (!data) {
      return NextResponse.json(
        { error: '无法解析内容' },
        { status: 400 }
      );
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

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('AI parsing error:', error);
    return NextResponse.json(
      {
        error: 'AI 解析失败',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// CORS 预检请求
export async function OPTIONS(request: NextRequest) {
  const allowedOrigins = [
    'https://www.niijima-koutsu.jp',
    'https://niijima-koutsu.jp',
    'http://localhost:3000'
  ];

  const origin = request.headers.get('origin') || '';

  if (allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}
