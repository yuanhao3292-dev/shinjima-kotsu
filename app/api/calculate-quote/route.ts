import { NextRequest, NextResponse } from 'next/server';
import type { QuoteResponse } from '../../../types';
import { calculateQuote } from '../../../services/pricingEngine';
import { validateBody } from '@/lib/validations/validate';
import { CalculateQuoteSchema } from '@/lib/validations/api-schemas';

// 防止 XSS：检查是否包含 HTML 标签
function containsHtmlTags(str: string): boolean {
  return /<[^>]*>/g.test(str);
}

// Next.js App Router API Handler
export async function POST(request: NextRequest) {
  try {
    // 使用 Zod Schema 验证输入
    const validation = await validateBody(request, CalculateQuoteSchema);
    if (!validation.success) return validation.error;
    const body = validation.data;

    // 额外的 XSS 安全检查
    if (containsHtmlTags(body.agency_name)) {
      return NextResponse.json(
        { error: '旅行社名称包含非法字符' },
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
