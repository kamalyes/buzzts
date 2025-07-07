import { toDate } from './basic';
import { DateInput } from './types';

/**
 * @func formatDate
 * @param {string} format - 格式字符串，如 'YYYY-MM-DD HH:mm:ss'
 * @param {DateInput} [date=new Date()] - 需要格式化的日期
 * @return {string | null} 格式化后的字符串，输入无效返回 null
 * @example
 * formatDate('YYYY-MM-DD', '2023-06-23') // '2023-06-23'
 * @desc   根据格式字符串格式化日期，支持常用占位符
 */
export function formatDate(format: string, date: DateInput = new Date()): string | null {
  const d = toDate(date);
  if (!d) return null;

  const map: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: (d.getMonth() + 1).toString().padStart(2, '0'),
    DD: d.getDate().toString().padStart(2, '0'),
    HH: d.getHours().toString().padStart(2, '0'),
    mm: d.getMinutes().toString().padStart(2, '0'),
    ss: d.getSeconds().toString().padStart(2, '0'),
  };

  let result = format;
  for (const k in map) {
    result = result.replace(new RegExp(k, 'g'), map[k]);
  }
  return result;
}

/**
 * @func formatDuration
 * @param {number} seconds - 持续时间，单位秒
 * @return {string} 格式化的持续时间，如 '01:23:36'
 * @example
 * formatDuration(5016) // '01:23:36'
 * @desc   将秒数格式化为 HH:mm:ss 格式字符串
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${h}:${m}:${s}`;
}
