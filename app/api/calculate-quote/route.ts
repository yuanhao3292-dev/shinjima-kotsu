import { NextRequest, NextResponse } from 'next/server';
import type { ItineraryRequest, QuoteResponse } from '../../../types';
import { calculateQuote } from '../../../services/pricingEngine';

// 输入验证
function validateRequest(req: ItineraryRequest): { valid: boolean; error?: string } {
  // 验证人数
  if (!req.pax || req.pax < 1 || req.pax > 1000) {
    return { valid: false, error: '人数必须在 1-1000 之间' };
  }

  // 验证天数
  if (!req.travel_days || req.travel_days < 1 || req.travel_days > 365) {
    return { valid: false, error: '天数必须在 1-365 之间' };
  }

  // 验证酒店房间数
  if (req.hotel_req?.rooms && (req.hotel_req.rooms < 1 || req.hotel_req.rooms > 500)) {
    return { valid: false, error: '房间数必须在 1-500 之间' };
  }

  // 验证酒店星级
  if (req.hotel_req?.stars && ![3, 4, 5].includes(req.hotel_req.stars)) {
    return { valid: false, error: '酒店星级必须为 3、4 或 5' };
  }

  // 验证旅行社名称
  if (!req.agency_name || req.agency_name.trim().length === 0) {
    return { valid: false, error: '旅行社名称不能为空' };
  }

  // 防止 XSS：检查是否包含 HTML 标签
  const htmlPattern = /<[^>]*>/g;
  if (htmlPattern.test(req.agency_name)) {
    return { valid: false, error: '旅行社名称包含非法字符' };
  }

  return { valid: true };
}

// Next.js App Router API Handler
export async function POST(request: NextRequest) {
  try {
    const body: ItineraryRequest = await request.json();

    // 验证输入
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 在服务端计算报价（保护商业逻辑）
    const quote: QuoteResponse = await calculateQuote(body);

    // 返回结果
    return NextResponse.json(quote);

  } catch (error: unknown) {
    console.error('Quote calculation error:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      {
        error: '报价计算失败',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
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
