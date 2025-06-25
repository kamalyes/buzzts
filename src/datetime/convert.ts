import { DateInput } from './types';

/**
 * @typedef {Date | string | number} DateInput
 * @desc 支持的日期输入类型：Date 对象、时间戳（秒或毫秒）、日期字符串
 */

/**
 * @func isValidDate
 * @param {any} date - 需要判断的对象
 * @return {boolean} 是否为有效的 Date 对象
 * @example
 * isValidDate(new Date())          // true
 * isValidDate(new Date('invalid')) // false
 * @desc   判断一个对象是否为有效的日期对象
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * @func toDate
 * @param {DateInput} d - 任意支持的日期输入
 * @return {Date | null} 有效的 Date 对象，解析失败返回 null
 * @example
 * toDate('2023-06-23')    // Date 对象
 * toDate(1687497600000)   // Date 对象
 * toDate(new Date())      // 原 Date 对象
 * toDate('invalid date')  // null
 * @desc   将多种类型的日期输入统一转换为 Date 对象，方便内部函数调用
 */
export function toDate(d: DateInput): Date | null {
  if (d instanceof Date) return isValidDate(d) ? d : null;

  if (typeof d === 'number') {
    // 判断数字是秒还是毫秒
    return new Date(d < 1e12 ? d * 1000 : d);
  }

  if (typeof d === 'string') {
    // 检测纯日期格式 YYYY-MM-DD，强制加上 UTC 时区标识
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const date = new Date(d + 'T00:00:00Z');
      return isValidDate(date) ? date : null;
    }
    // 其他字符串按默认方式解析
    const date = new Date(d);
    return isValidDate(date) ? date : null;
  }

  return null;
}

/**
 * @func getUnixTimestamp
 * @param {DateInput} [date=new Date()] - 需要转换的日期
 * @return {number | null} Unix 时间戳（秒），输入无效返回 null
 * @example
 * getUnixTimestamp('2023-06-23') // 1687497600
 * getUnixTimestamp()             // 当前时间戳
 * @desc   获取指定日期的 Unix 时间戳（秒）
 */
export function getUnixTimestamp(date: DateInput = new Date()): number | null {
  const d = toDate(date);
  if (!d) return null;
  return Math.floor(d.getTime() / 1000);
}

/**
 * @func timestampToDate
 * @param {number | string} timestamp - 时间戳（秒或毫秒）
 * @return {Date | null} 转换后的 Date 对象，失败返回 null
 * @example
 * timestampToDate(1687497600)       // Date 对象
 * timestampToDate('1687497600000')  // Date 对象
 * @desc   将秒或毫秒时间戳转换为 Date 对象
 */
export function timestampToDate(timestamp: number | string): Date | null {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(ts)) return null;
  const date = ts < 1e12 ? new Date(ts * 1000) : new Date(ts);
  return isValidDate(date) ? date : null;
}
