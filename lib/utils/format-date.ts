/**
 * Unified date formatting utilities.
 * Replaces 13 duplicate formatDate() implementations across the codebase.
 */

/** Date + Time in zh-TW compact format: YYYY/MM/DD HH:MM */
export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Date only in zh-TW long format: YYYY年M月D日 */
export function formatDateLong(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Date + Time in zh-TW long format: YYYY年M月D日 HH:MM */
export function formatDateTimeLong(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Date only in Japanese dot format: YYYY.MM.DD */
export function formatDateJP(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '.');
}

/** Date in Japanese kanji format: YYYY年M月D日 */
export function formatDateJPKanji(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** Date only in slash format: YYYY/MM/DD */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

/** Simple zh-TW locale date format */
export function formatDateSimple(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('zh-TW');
}

/** Simple zh-TW locale date+time format */
export function formatDateTimeSimple(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('zh-TW');
}
