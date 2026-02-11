/**
 * 医疗服务提供方（provider）注册表
 *
 * checkout 页面通过 ?provider=xxx 读取，显示上下文横幅并写入订单
 */

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

export interface ProviderConfig {
  key: string;
  name: Record<Language, string>;
  shortName: Record<Language, string>;
}

export const PROVIDERS: Record<string, ProviderConfig> = {
  hyogo_medical: {
    key: 'hyogo_medical',
    name: {
      ja: '兵庫医科大学病院',
      'zh-TW': '兵庫醫科大學病院',
      'zh-CN': '兵库医科大学病院',
      en: 'Hyogo Medical University Hospital',
    },
    shortName: {
      ja: '兵庫医大',
      'zh-TW': '兵庫醫大',
      'zh-CN': '兵库医大',
      en: 'Hyogo Medical',
    },
  },
};

/** 已知 provider key 列表（用于 Zod 白名单校验） */
export const VALID_PROVIDER_KEYS = Object.keys(PROVIDERS);

export function isValidProvider(key: string | null | undefined): key is string {
  return !!key && key in PROVIDERS;
}
