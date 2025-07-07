import { getDayOfWeek, toDate } from './basic';
import { DateInput } from './types';

/**
 * @func compareTwoDates
 * @param {DateInput} dateA - 第一个日期，支持字符串、数字时间戳或 Date 对象
 * @param {DateInput} dateB - 第二个日期，支持字符串、数字时间戳或 Date 对象
 * @param {'before' | 'after'} type - 比较类型，'before' 判断 dateA 是否早于 dateB，'after' 判断 dateA 是否晚于 dateB
 * @return {boolean|null} 返回比较结果，true 或 false；如果任一日期无效，则返回 null
 * @example
 * compareTwoDates('2023-06-20', '2023-06-23', 'before') // true
 * compareTwoDates(new Date(2023, 5, 25), '2023-06-23', 'after') // true
 * @desc 比较两个日期，判断第一个日期是否在第二个日期之前或之后
 */
export function compareTwoDates(dateA: DateInput, dateB: DateInput, type: 'before' | 'after'): boolean | null {
  const dA = toDate(dateA);
  const dB = toDate(dateB);
  if (!dA || !dB) return null;
  if (type === 'before') return dA.getTime() < dB.getTime();
  return dA.getTime() > dB.getTime();
}

/**
 * @func isBetween
 * @param {DateInput} target - 目标日期，支持字符串、数字时间戳或 Date 对象
 * @param {DateInput} start - 起始日期，支持字符串、数字时间戳或 Date 对象
 * @param {DateInput} end - 结束日期，支持字符串、数字时间戳或 Date 对象
 * @return {boolean|null} 返回目标日期是否在区间内，true 或 false；如果任一日期无效，则返回 null
 * @example
 * isBetween('2023-06-22', '2023-06-20', '2023-06-25') // true
 * isBetween('2023-06-19', '2023-06-20', '2023-06-25') // false
 * @desc 判断目标日期是否位于起始日期和结束日期之间（包含边界）
 */
export function isBetween(target: DateInput, start: DateInput, end: DateInput): boolean | null {
  const t = toDate(target);
  const s = toDate(start);
  const e = toDate(end);
  if (!t || !s || !e) return null;

  const time = t.getTime();
  return time >= s.getTime() && time <= e.getTime();
}

/**
 * @func isLeapYear
 * @param {number} year - 年份，如 2023
 * @return {boolean} 是否为闰年
 * @example
 * isLeapYear(2020) // true
 * isLeapYear(2023) // false
 * @desc   判断指定年份是否为闰年
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * @func isWeekend
 * @param {DateInput} date
 * @return {boolean | null}
 * @desc 判断日期是否为周末（周六或周日），输入无效返回 null
 * @example
 * isWeekend('2023-06-23') // 返回 false
 * isWeekend('2023-06-24') // 返回 true （周六）
 */
export function isWeekend(date: DateInput): boolean | null {
  const day = getDayOfWeek(date);
  return day === null ? null : [0, 6, 7].includes(day);
}

/**
 * @func isSameDay
 * @param {DateInput} dateA
 * @param {DateInput} dateB
 * @return {boolean | null} 是否为同一天，输入无效返回 null
 * @desc 判断两个日期是否是同一天
 * @example
 * isSameDay('2023-06-23T10:00:00', '2023-06-23T23:59:59') // 返回 true
 */
export function isSameDay(dateA: DateInput, dateB: DateInput): boolean | null {
  const d1 = toDate(dateA);
  const d2 = toDate(dateB);
  if (!d1 || !d2) return null;
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}
