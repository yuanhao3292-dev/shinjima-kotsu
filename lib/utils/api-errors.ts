/**
 * API 错误处理模块
 * 提供统一的错误分类和响应格式
 */
import { NextResponse } from 'next/server';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  /** 参数验证错误 */
  VALIDATION = 'VALIDATION_ERROR',
  /** 身份认证错误 */
  AUTH = 'AUTH_ERROR',
  /** 权限不足 */
  FORBIDDEN = 'FORBIDDEN',
  /** 资源不存在 */
  NOT_FOUND = 'NOT_FOUND',
  /** 业务逻辑错误 */
  BUSINESS = 'BUSINESS_ERROR',
  /** 外部服务错误（Stripe、Supabase 等） */
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  /** 速率限制 */
  RATE_LIMIT = 'RATE_LIMIT',
  /** 服务器内部错误 */
  INTERNAL = 'INTERNAL_ERROR',
}

/**
 * API 错误接口
 */
export interface APIError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * 错误类型对应的 HTTP 状态码
 */
const ERROR_STATUS_CODES: Record<ErrorType, number> = {
  [ErrorType.VALIDATION]: 400,
  [ErrorType.AUTH]: 401,
  [ErrorType.FORBIDDEN]: 403,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.BUSINESS]: 422,
  [ErrorType.EXTERNAL_SERVICE]: 502,
  [ErrorType.RATE_LIMIT]: 429,
  [ErrorType.INTERNAL]: 500,
};

/**
 * 创建标准化的错误响应
 */
export function createErrorResponse(
  error: APIError,
  headers?: Headers
): NextResponse {
  const status = ERROR_STATUS_CODES[error.type] || 500;

  const body: Record<string, unknown> = {
    error: error.message,
    type: error.type,
  };

  if (error.code) {
    body.code = error.code;
  }

  if (error.details && process.env.NODE_ENV !== 'production') {
    body.details = error.details;
  }

  return NextResponse.json(body, { status, headers });
}

/**
 * 从未知错误创建 APIError
 * 用于 catch 块中的错误处理
 */
export function normalizeError(error: unknown): APIError {
  // 已经是 APIError
  if (isAPIError(error)) {
    return error;
  }

  // 标准 Error 对象
  if (error instanceof Error) {
    // Stripe 错误
    if ('type' in error && typeof (error as any).type === 'string') {
      const stripeError = error as any;
      if (stripeError.type.startsWith('Stripe')) {
        return {
          type: ErrorType.EXTERNAL_SERVICE,
          message: '支付服务暂时不可用',
          code: stripeError.code,
          details: { originalMessage: stripeError.message },
        };
      }
    }

    // Supabase 错误
    if ('code' in error && 'message' in error) {
      const supabaseError = error as any;
      // 认证相关错误
      if (supabaseError.code?.startsWith('PGRST') || supabaseError.status === 401) {
        return {
          type: ErrorType.AUTH,
          message: '认证失败',
          code: supabaseError.code,
        };
      }
      // 其他数据库错误
      return {
        type: ErrorType.EXTERNAL_SERVICE,
        message: '数据服务暂时不可用',
        code: supabaseError.code,
        details: { originalMessage: supabaseError.message },
      };
    }

    // 通用 Error
    return {
      type: ErrorType.INTERNAL,
      message: '服务器内部错误',
      details: { originalMessage: error.message },
    };
  }

  // 未知类型
  return {
    type: ErrorType.INTERNAL,
    message: '未知错误',
    details: { error: String(error) },
  };
}

/**
 * 类型守卫：检查是否为 APIError
 */
function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    Object.values(ErrorType).includes((error as any).type)
  );
}

/**
 * 便捷的错误创建函数
 */
export const Errors = {
  validation: (
    messageOrFields: string | Array<{ field: string; message: string }>,
    details?: unknown
  ): APIError => {
    if (typeof messageOrFields === 'string') {
      return {
        type: ErrorType.VALIDATION,
        message: messageOrFields,
        details,
      };
    }
    // 接受字段验证数组
    const firstError = messageOrFields[0];
    return {
      type: ErrorType.VALIDATION,
      message: firstError?.message || '参数验证失败',
      details: { fields: messageOrFields },
    };
  },

  auth: (message = '请先登录'): APIError => ({
    type: ErrorType.AUTH,
    message,
  }),

  forbidden: (message = '权限不足'): APIError => ({
    type: ErrorType.FORBIDDEN,
    message,
  }),

  notFound: (resource = '资源'): APIError => ({
    type: ErrorType.NOT_FOUND,
    message: `${resource}不存在`,
  }),

  business: (message: string, code?: string): APIError => ({
    type: ErrorType.BUSINESS,
    message,
    code,
  }),

  rateLimit: (retryAfter?: number): APIError => ({
    type: ErrorType.RATE_LIMIT,
    message: '请求过于频繁，请稍后再试',
    details: retryAfter ? { retryAfter } : undefined,
  }),

  internal: (message = '服务器内部错误'): APIError => ({
    type: ErrorType.INTERNAL,
    message,
  }),
};

/**
 * 日志格式化（用于服务端错误日志）
 */
export function logError(
  error: APIError,
  context?: {
    path?: string;
    method?: string;
    userId?: string;
    context?: string;
    [key: string]: string | undefined;
  }
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: error.type,
    message: error.message,
    code: error.code,
    ...context,
    details: error.details,
  };

  // 生产环境可以集成到日志服务（如 Sentry、DataDog）
  if (error.type === ErrorType.INTERNAL || error.type === ErrorType.EXTERNAL_SERVICE) {
    console.error('[API Error]', JSON.stringify(logEntry));
  } else {
    console.warn('[API Warning]', JSON.stringify(logEntry));
  }
}
