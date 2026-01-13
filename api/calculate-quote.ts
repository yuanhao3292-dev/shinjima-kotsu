import { ItineraryRequest, QuoteResponse } from '../types';
import { calculateQuote } from '../services/pricingEngine';

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

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // 仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // CORS 配置（仅允许自己的域名）
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

  try {
    const requestData: ItineraryRequest = req.body;

    // 验证输入
    const validation = validateRequest(requestData);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // 在服务端计算报价（保护商业逻辑）
    const quote: QuoteResponse = await calculateQuote(requestData);

    // 返回结果
    return res.status(200).json(quote);

  } catch (error: any) {
    console.error('Quote calculation error:', error);
    return res.status(500).json({
      error: '报价计算失败',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
