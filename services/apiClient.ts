import { ItineraryRequest, QuoteResponse } from '../types';

// API 基础 URL（根据环境自动切换）
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://www.niijima-koutsu.jp'
  : 'http://localhost:3000';

/**
 * 调用后端 API 计算报价
 */
export async function calculateQuoteAPI(request: ItineraryRequest): Promise<QuoteResponse> {
  const response = await fetch(`${API_BASE_URL}/api/calculate-quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '报价计算失败');
  }

  return response.json();
}

/**
 * 调用后端 API 解析行程文本
 */
export async function parseItineraryAPI(text: string): Promise<Partial<ItineraryRequest>> {
  const response = await fetch(`${API_BASE_URL}/api/parse-itinerary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'AI 解析失败');
  }

  return response.json();
}
