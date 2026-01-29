// Venue pricing multi-language translations
// Supports: ja (Japanese), zh-TW (Traditional Chinese), zh-CN (Simplified Chinese), en (English)

export type PricingLocale = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

// Common pricing terms translations
export const pricingTerms: Record<string, Record<PricingLocale, string>> = {
  // Basic info
  business_hours: {
    ja: '営業時間',
    'zh-TW': '營業時間',
    'zh-CN': '营业时间',
    en: 'Business Hours'
  },
  closed_days: {
    ja: '定休日',
    'zh-TW': '公休日',
    'zh-CN': '公休日',
    en: 'Closed Days'
  },
  service_charge: {
    ja: 'サービス料',
    'zh-TW': '服務費',
    'zh-CN': '服务费',
    en: 'Service Charge'
  },
  website: {
    ja: '公式サイト',
    'zh-TW': '官方網站',
    'zh-CN': '官方网站',
    en: 'Website'
  },

  // Pricing system
  system_price: {
    ja: '料金システム',
    'zh-TW': '價格系統',
    'zh-CN': '价格系统',
    en: 'Pricing System'
  },
  all_time: {
    ja: '全時間帯',
    'zh-TW': '全時段',
    'zh-CN': '全时段',
    en: 'All Time'
  },
  per_60min: {
    ja: '60分制',
    'zh-TW': '60分鐘制',
    'zh-CN': '60分钟制',
    en: '60 min'
  },
  per_50min: {
    ja: '50分制',
    'zh-TW': '50分鐘制',
    'zh-CN': '50分钟制',
    en: '50 min'
  },
  member: {
    ja: 'メンバー',
    'zh-TW': '會員',
    'zh-CN': '会员',
    en: 'Member'
  },
  visitor: {
    ja: 'ビジター',
    'zh-TW': '訪客',
    'zh-CN': '访客',
    en: 'Visitor'
  },
  per_person: {
    ja: 'お一人様',
    'zh-TW': '每位',
    'zh-CN': '每位',
    en: 'Per Person'
  },
  '1_person': {
    ja: '1名様',
    'zh-TW': '1位',
    'zh-CN': '1位',
    en: '1 Person'
  },
  '2_plus': {
    ja: '2名様以上',
    'zh-TW': '2位以上',
    'zh-CN': '2位以上',
    en: '2+ People'
  },

  // Extension
  extension: {
    ja: '延長料金',
    'zh-TW': '延長費',
    'zh-CN': '延长费',
    en: 'Extension Fee'
  },
  '30min': {
    ja: '30分',
    'zh-TW': '30分鐘',
    'zh-CN': '30分钟',
    en: '30 min'
  },
  '60min': {
    ja: '60分',
    'zh-TW': '60分鐘',
    'zh-CN': '60分钟',
    en: '60 min'
  },

  // Nomination/Dohan
  nomination: {
    ja: '指名料金',
    'zh-TW': '指名費',
    'zh-CN': '指名费',
    en: 'Nomination Fee'
  },
  w_nomination: {
    ja: 'W指名料金',
    'zh-TW': '雙人指名費',
    'zh-CN': '双人指名费',
    en: 'Double Nomination'
  },
  dohan: {
    ja: '同伴料金',
    'zh-TW': '同伴費',
    'zh-CN': '同伴费',
    en: 'Companion Fee'
  },
  dohan_free: {
    ja: '同伴無料',
    'zh-TW': '同伴免費',
    'zh-CN': '同伴免费',
    en: 'Companion Free'
  },

  // VIP
  vip_room: {
    ja: 'VIPルーム',
    'zh-TW': 'VIP包廂',
    'zh-CN': 'VIP包厢',
    en: 'VIP Room'
  },
  semi_vip: {
    ja: 'セミVIP',
    'zh-TW': '半包廂',
    'zh-CN': '半包厢',
    en: 'Semi-VIP'
  },
  private_room: {
    ja: '個室',
    'zh-TW': '包廂',
    'zh-CN': '包厢',
    en: 'Private Room'
  },
  room_charge: {
    ja: 'ルームチャージ',
    'zh-TW': '包廂費',
    'zh-CN': '包厢费',
    en: 'Room Charge'
  },
  single_use_charge: {
    ja: '1名様でのご利用',
    'zh-TW': '單人使用',
    'zh-CN': '单人使用',
    en: 'Single Use'
  },

  // Bottles
  house_bottle: {
    ja: 'ハウスボトル',
    'zh-TW': '店內酒水',
    'zh-CN': '店内酒水',
    en: 'House Bottle'
  },
  free_bottle: {
    ja: 'フリーボトル',
    'zh-TW': '免費酒水',
    'zh-CN': '免费酒水',
    en: 'Free Bottle'
  },
  bottle_keep: {
    ja: 'ボトルキープ',
    'zh-TW': '保存酒瓶',
    'zh-CN': '保存酒瓶',
    en: 'Bottle Keep'
  },
  nomihodai: {
    ja: '飲み放題',
    'zh-TW': '暢飲',
    'zh-CN': '畅饮',
    en: 'All-You-Can-Drink'
  },

  // Other charges
  mochikomi: {
    ja: '持ち込み料',
    'zh-TW': '自帶費',
    'zh-CN': '自带费',
    en: 'Bring-Your-Own Fee'
  },
  order_separate: {
    ja: 'オーダー別途',
    'zh-TW': '另點另計',
    'zh-CN': '另点另计',
    en: 'Orders Charged Separately'
  },
  tax_included: {
    ja: '税込',
    'zh-TW': '含稅',
    'zh-CN': '含税',
    en: 'Tax Included'
  },
  tax_excluded: {
    ja: '税別',
    'zh-TW': '未稅',
    'zh-CN': '未税',
    en: 'Tax Excluded'
  },

  // Days
  sunday: {
    ja: '日曜日',
    'zh-TW': '週日',
    'zh-CN': '周日',
    en: 'Sunday'
  },
  monday: {
    ja: '月曜日',
    'zh-TW': '週一',
    'zh-CN': '周一',
    en: 'Monday'
  },
  holiday: {
    ja: '祝日',
    'zh-TW': '國定假日',
    'zh-CN': '国定假日',
    en: 'National Holiday'
  },

  // Floor types
  main_floor: {
    ja: 'メインフロア',
    'zh-TW': '主樓層',
    'zh-CN': '主楼层',
    en: 'Main Floor'
  },
  executive_floor: {
    ja: 'エグゼクティブフロア',
    'zh-TW': '行政樓層',
    'zh-CN': '行政楼层',
    en: 'Executive Floor'
  },

  // Remarks
  remarks: {
    ja: '備考',
    'zh-TW': '備註',
    'zh-CN': '备注',
    en: 'Remarks'
  },
  note: {
    ja: '注意',
    'zh-TW': '注意',
    'zh-CN': '注意',
    en: 'Note'
  },
};

// Time period translations
export const timePeriods: Record<string, Record<PricingLocale, string>> = {
  '〜20時': { ja: '〜20時', 'zh-TW': '〜20:00', 'zh-CN': '〜20:00', en: 'Until 20:00' },
  '〜21時': { ja: '〜21時', 'zh-TW': '〜21:00', 'zh-CN': '〜21:00', en: 'Until 21:00' },
  '〜22時': { ja: '〜22時', 'zh-TW': '〜22:00', 'zh-CN': '〜22:00', en: 'Until 22:00' },
  '〜23時': { ja: '〜23時', 'zh-TW': '〜23:00', 'zh-CN': '〜23:00', en: 'Until 23:00' },
  '20時以降': { ja: '20時以降', 'zh-TW': '20:00後', 'zh-CN': '20:00后', en: 'After 20:00' },
  '21時以降': { ja: '21時以降', 'zh-TW': '21:00後', 'zh-CN': '21:00后', en: 'After 21:00' },
  '22時以降': { ja: '22時以降', 'zh-TW': '22:00後', 'zh-CN': '22:00后', en: 'After 22:00' },
  '23時以降': { ja: '23時以降', 'zh-TW': '23:00後', 'zh-CN': '23:00后', en: 'After 23:00' },
  '21時〜': { ja: '21時〜', 'zh-TW': '21:00起', 'zh-CN': '21:00起', en: 'From 21:00' },
  'OPEN〜20:59': { ja: 'OPEN〜20:59', 'zh-TW': '開店〜20:59', 'zh-CN': '开店〜20:59', en: 'Open - 20:59' },
  '21:00〜LAST': { ja: '21:00〜LAST', 'zh-TW': '21:00〜打烊', 'zh-CN': '21:00〜打烊', en: '21:00 - Close' },
  'ALL TIME': { ja: '全時間帯', 'zh-TW': '全時段', 'zh-CN': '全时段', en: 'All Time' },
};

// Format currency
export function formatCurrency(amount: number | string, locale: PricingLocale): string {
  if (typeof amount === 'string') {
    // Handle special cases like "無料" (free)
    if (amount === '無料') {
      return { ja: '無料', 'zh-TW': '免費', 'zh-CN': '免费', en: 'Free' }[locale];
    }
    return amount;
  }
  return `¥${amount.toLocaleString()}`;
}

// Translate a term
export function translateTerm(term: string, locale: PricingLocale): string {
  // Check direct match
  if (pricingTerms[term]) {
    return pricingTerms[term][locale];
  }

  // Check time periods
  if (timePeriods[term]) {
    return timePeriods[term][locale];
  }

  // Return original if no translation found
  return term;
}

// Generate formatted pricing text for a venue
export function generatePricingText(
  venue: {
    name: string;
    business_hours?: string;
    closed_days?: string;
    service_charge?: string;
    website?: string;
    pricing_info?: Record<string, unknown>;
  },
  locale: PricingLocale
): string {
  const lines: string[] = [];
  const t = (term: string) => translateTerm(term, locale);

  // Header
  lines.push(`【${venue.name}】`);
  lines.push('');

  // Basic info
  if (venue.business_hours) {
    lines.push(`${t('business_hours')}: ${venue.business_hours}`);
  }
  if (venue.closed_days) {
    lines.push(`${t('closed_days')}: ${venue.closed_days}`);
  }
  if (venue.service_charge) {
    lines.push(`${t('service_charge')}: ${venue.service_charge}`);
  }
  if (venue.website) {
    lines.push(`${t('website')}: ${venue.website}`);
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━');

  // Pricing info
  if (venue.pricing_info) {
    const info = venue.pricing_info;

    // System pricing (60min/50min)
    const systemKeys = Object.keys(info).filter(k =>
      k.includes('system') || k.includes('all_time') || k.includes('main_')
    );

    if (systemKeys.length > 0) {
      lines.push('');
      lines.push(`【${t('system_price')}】`);

      for (const key of systemKeys) {
        const value = info[key];
        if (typeof value === 'number') {
          lines.push(`  ${formatCurrency(value, locale)}`);
        } else if (typeof value === 'object' && value !== null) {
          for (const [period, price] of Object.entries(value as Record<string, unknown>)) {
            if (typeof price === 'number') {
              lines.push(`  ${translateTerm(period, locale)}: ${formatCurrency(price, locale)}`);
            } else if (typeof price === 'object' && price !== null) {
              // Nested object (e.g., { '1名様': 6050, '2名様以上': 5500 })
              const priceStr = Object.entries(price as Record<string, number>)
                .map(([k, v]) => `${translateTerm(k, locale)} ${formatCurrency(v, locale)}`)
                .join(' / ');
              lines.push(`  ${translateTerm(period, locale)}: ${priceStr}`);
            }
          }
        }
      }
    }

    // Extension
    if (info.extension) {
      lines.push('');
      lines.push(`【${t('extension')}】`);
      const ext = info.extension as Record<string, unknown>;
      for (const [time, price] of Object.entries(ext)) {
        if (typeof price === 'number') {
          lines.push(`  ${translateTerm(time, locale)}: ${formatCurrency(price, locale)}`);
        } else if (typeof price === 'object' && price !== null) {
          // Nested by time period
          for (const [period, p] of Object.entries(price as Record<string, number>)) {
            lines.push(`  ${translateTerm(time, locale)} (${translateTerm(period, locale)}): ${formatCurrency(p, locale)}`);
          }
        }
      }
    }

    // Nomination
    const nomKeys = Object.keys(info).filter(k => k.includes('nomination'));
    if (nomKeys.length > 0) {
      lines.push('');
      lines.push(`【${t('nomination')}】`);
      for (const key of nomKeys) {
        const price = info[key];
        if (typeof price === 'number') {
          if (key.includes('2nd') || key.includes('w_')) {
            lines.push(`  ${t('w_nomination')}: ${formatCurrency(price, locale)}`);
          } else {
            lines.push(`  ${formatCurrency(price, locale)}`);
          }
        }
      }
    }

    // Dohan
    if (info.dohan !== undefined) {
      lines.push('');
      lines.push(`【${t('dohan')}】`);
      const dohanValue = info.dohan;
      if (typeof dohanValue === 'number') {
        lines.push(`  ${formatCurrency(dohanValue, locale)}`);
      } else if (dohanValue === '無料') {
        lines.push(`  ${formatCurrency('無料', locale)}`);
      }
    }

    // VIP
    const vipKeys = Object.keys(info).filter(k =>
      k.includes('vip') || k.includes('private') || k.includes('semi_vip')
    );
    if (vipKeys.length > 0) {
      lines.push('');
      lines.push(`【${t('vip_room')}】`);
      for (const key of vipKeys) {
        const value = info[key];
        if (key.includes('note')) continue; // Skip notes

        if (typeof value === 'number') {
          const label = key.includes('semi') ? t('semi_vip') :
                       key.includes('single') ? t('single_use_charge') : '';
          lines.push(`  ${label ? label + ': ' : ''}${formatCurrency(value, locale)}`);
        } else if (typeof value === 'object' && value !== null) {
          for (const [room, price] of Object.entries(value as Record<string, number>)) {
            lines.push(`  ${room}: ${formatCurrency(price, locale)}`);
          }
        }
      }

      // VIP notes
      if (info.vip_note) {
        lines.push(`  ※ ${info.vip_note}`);
      }
    }

    // Bottles/Drinks
    const bottleKeys = ['house_bottle', 'free_bottle', 'nomihodai_charge', 'bottle_keep'];
    const hasBottles = bottleKeys.some(k => info[k] !== undefined);
    if (hasBottles) {
      lines.push('');
      for (const key of bottleKeys) {
        if (info[key] !== undefined) {
          const value = info[key];
          if (typeof value === 'number') {
            lines.push(`${t(key.replace('_charge', ''))}: ${formatCurrency(value, locale)}`);
          } else if (value === true) {
            lines.push(`${t(key)}: ${t('tax_included')}`);
          }
        }
      }
    }

    // Remarks
    if (info.remarks) {
      lines.push('');
      lines.push(`【${t('remarks')}】`);
      lines.push(`${info.remarks}`);
    }
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━');

  // Footer
  const footerText: Record<PricingLocale, string> = {
    ja: '※上記は税込価格です。詳細は店舗にお問い合わせください。',
    'zh-TW': '※以上為含稅價格。詳情請洽店家。',
    'zh-CN': '※以上为含税价格。详情请咨询店家。',
    en: '※Prices include tax. Please contact the venue for details.'
  };
  lines.push(footerText[locale]);

  return lines.join('\n');
}

// Locale display names
export const localeDisplayNames: Record<PricingLocale, string> = {
  ja: '日本語',
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  en: 'English'
};

// Locale flags
export const localeFlags: Record<PricingLocale, string> = {
  ja: '🇯🇵',
  'zh-TW': '🇹🇼',
  'zh-CN': '🇨🇳',
  en: '🇺🇸'
};
