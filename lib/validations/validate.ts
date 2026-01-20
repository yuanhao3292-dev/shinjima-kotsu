/**
 * 验证助手函数
 * 统一处理 Zod 验证错误
 */
import { NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';

/**
 * 验证成功结果
 */
export interface ValidationSuccess<T> {
  success: true;
  data: T;
  error?: never;
}

/**
 * 验证失败结果
 */
export interface ValidationFailure {
  success: false;
  error: NextResponse;
  data?: never;
}

/**
 * 验证结果类型 - 使用互斥属性确保类型缩窄正确工作
 */
export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * 验证请求体并返回类型安全的数据
 *
 * @example
 * const result = await validateBody(request, CreateCheckoutSessionSchema);
 * if (!result.success) return result.error;
 * const { packageSlug, customerInfo } = result.data;
 */
export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return {
        success: false,
        error: NextResponse.json(
          {
            error: '参数验证失败',
            details: errors,
          },
          { status: 400 }
        ),
      };
    }

    // JSON 解析错误
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: NextResponse.json(
          { error: '无效的 JSON 格式' },
          { status: 400 }
        ),
      };
    }

    // 其他错误
    return {
      success: false,
      error: NextResponse.json(
        { error: '请求处理失败' },
        { status: 400 }
      ),
    };
  }
}

/**
 * 验证查询参数
 *
 * @example
 * const result = validateQuery(searchParams, DateSchema);
 * if (!result.success) return result.error;
 */
export function validateQuery<T>(
  params: URLSearchParams | Record<string, string | null>,
  schema: ZodSchema<T>
): ValidationResult<T> {
  try {
    // 将 URLSearchParams 转为对象
    const obj: Record<string, string> = {};
    if (params instanceof URLSearchParams) {
      params.forEach((value, key) => {
        obj[key] = value;
      });
    } else {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null) {
          obj[key] = value;
        }
      });
    }

    const data = schema.parse(obj);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return {
        success: false,
        error: NextResponse.json(
          {
            error: '参数验证失败',
            details: errors,
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json(
        { error: '参数处理失败' },
        { status: 400 }
      ),
    };
  }
}

/**
 * 简单验证函数，直接返回验证后的数据或抛出错误
 * 用于内部验证，不用于 API 响应
 */
export function validate<T>(data: unknown, schema: ZodSchema<T>): T {
  return schema.parse(data);
}

/**
 * 安全验证函数，返回验证结果而不抛出错误
 */
export function safeParse<T>(
  data: unknown,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; errors: z.ZodError<T> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
