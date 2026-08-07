/**
 * 白标匿名筛查的会话令牌传递方式
 * ============================================
 * sessionId 是匿名用户读取自己筛查结果的唯一凭据（服务端以
 * .eq('session_id', ...) 作授权判断），因此它等同于一个能力令牌。
 *
 * 令牌不能出现在 URL 里：query string 会被写进服务端访问日志、CDN 日志、
 * Referer 头和浏览器历史，任何拿到日志的人都能读取对应的健康问诊数据。
 * 统一改走自定义请求头。
 */

import type { NextRequest } from 'next/server';

export const SCREENING_SESSION_HEADER = 'x-screening-session';

/** 从请求头读取会话令牌；不存在则返回 null */
export function getScreeningSessionId(request: NextRequest): string | null {
  const value = request.headers.get(SCREENING_SESSION_HEADER);
  return value && value.trim() ? value.trim() : null;
}
