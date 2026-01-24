'use client';

import { useMemo } from 'react';
import { useLanguage, type Language } from './useLanguage';

/**
 * 翻译消息类型
 */
type Messages = {
  [key: string]: string | Messages | string[];
};

/**
 * 从嵌套对象中获取值
 */
function getNestedValue(obj: Messages, path: string): any {
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * 加载翻译消息
 */
async function loadMessages(lang: Language): Promise<Messages> {
  try {
    const messages = await import(`@/messages/${lang}.json`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for ${lang}:`, error);
    // Fallback to Japanese
    const fallback = await import('@/messages/ja.json');
    return fallback.default;
  }
}

/**
 * 统一的翻译管理 Hook
 *
 * @param namespace - 翻译命名空间（如 'business.golf'）
 * @returns 翻译函数和当前语言
 *
 * @example
 * const { t, lang } = useTranslations('business.golf');
 * const title = t('title'); // 获取 business.golf.title
 * const items = t('features.course.items'); // 获取数组
 */
export function useTranslations(namespace: string = '') {
  const lang = useLanguage();

  // 同步加载翻译（使用 require 而不是动态 import）
  const messages = useMemo(() => {
    try {
      const allMessages = require(`@/messages/${lang}.json`);

      if (namespace) {
        const namespaced = getNestedValue(allMessages, namespace);
        return namespaced || {};
      }

      return allMessages;
    } catch (error) {
      console.error(`Failed to load messages for ${lang}:`, error);
      // Fallback to Japanese
      try {
        const fallbackMessages = require('@/messages/ja.json');
        return namespace ? getNestedValue(fallbackMessages, namespace) || {} : fallbackMessages;
      } catch {
        return {};
      }
    }
  }, [lang, namespace]);

  /**
   * 翻译函数
   * @param key - 翻译键（相对于 namespace）
   * @param fallback - 可选的后备文本
   */
  const t = (key: string, fallback?: string): any => {
    const value = getNestedValue(messages, key);

    if (value !== undefined) {
      return value;
    }

    if (fallback !== undefined) {
      return fallback;
    }

    // 如果没有找到翻译，返回键本身（开发模式下便于调试）
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Translation missing: ${namespace ? `${namespace}.` : ''}${key} (${lang})`);
    }

    return key;
  };

  return {
    t,
    lang,
    messages,
  };
}

/**
 * 获取多语言对象中当前语言的值
 *
 * @param obj - 多语言对象，如 { ja: '日本語', 'zh-CN': '中文' }
 * @param lang - 当前语言
 * @returns 当前语言的值，如果不存在则返回日语
 */
export function getLocalizedValue<T>(
  obj: Record<Language, T> | T,
  lang: Language
): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj as T;
  }

  const multiLangObj = obj as Record<Language, T>;
  return multiLangObj[lang] || multiLangObj['ja'];
}
