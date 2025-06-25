import type { DateInput } from './types';
import { toDate } from './convert';

/**
 * @func addDays
 * @param {DateInput} date - 基准日期
 * @param {number} days - 增加的天数（可为负数）
 * @return {Date | null} 新的日期对象，输入无效返回 null
 * @desc 在基准日期上增加指定天数，返回新日期
 * @example
 * addDays('2023-06-23', 5) // 返回 2023-06-28 的 Date 对象
 */
export function addDays(date: DateInput, days: number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setDate(d.getDate() + days);
  return result;
}

/**
 * @func addHours
 * @param {DateInput} date - 基准日期
 * @param {number} hours - 增加的小时数
 * @return {Date | null} 新的日期对象，输入无效返回 null
 * @desc 在基准日期上增加指定小时数，返回新日期
 * @example
 * addHours('2023-06-23T10:00:00', 3) // 返回 2023-06-23T13:00:00 的 Date 对象
 */
export function addHours(date: DateInput, hours: number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setHours(d.getHours() + hours);
  return result;
}

/**
 * @func addMinutes
 * @param {DateInput} date
 * @param {number} minutes
 * @return {Date | null}
 * @desc 在基准日期上增加指定分钟数，返回新日期
 * @example
 * addMinutes('2023-06-23T10:00:00', 30) // 返回 2023-06-23T10:30:00 的 Date 对象
 */
export function addMinutes(date: DateInput, minutes: number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setMinutes(d.getMinutes() + minutes);
  return result;
}

/**
 * @func addSeconds
 * @param {DateInput} date
 * @param {number} seconds
 * @return {Date | null}
 * @desc 在基准日期上增加指定秒数，返回新日期
 * @example
 * addSeconds('2023-06-23T10:00:00', 55) // 返回 2023-06-23T10:00:55 的 Date 对象
 */
export function addSeconds(date: DateInput, seconds: number): Date | null {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setSeconds(d.getSeconds() + seconds);
  return result;
}

/**
 * @func diffDays
 * @param {DateInput} dateA
 * @param {DateInput} dateB
 * @return {number | null} 两日期之间相差的完整天数（绝对值），输入无效返回 null
 * @desc 计算两个日期之间相差的天数
 * @example
 * diffDays('2023-06-23', '2023-06-20') // 返回 3
 */
export function diffDays(dateA: DateInput, dateB: DateInput): number | null {
  const d1 = toDate(dateA);
  const d2 = toDate(dateB);
  if (!d1 || !d2) return null;
  const diffMs = Math.abs(d1.getTime() - d2.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
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

/**
 * @func startOfDay
 * @param {DateInput} date
 * @return {Date | null}
 * @desc 获取指定日期当天的开始时间（00:00:00）
 * @example
 * startOfDay('2023-06-23T15:30:00') // 返回 2023-06-23T00:00:00 的 Date 对象
 */
export function startOfDay(date: DateInput): Date | null {
  const d = toDate(date);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * @func endOfDay
 * @param {DateInput} date
 * @return {Date | null}
 * @desc 获取指定日期当天的结束时间（23:59:59.999）
 * @example
 * endOfDay('2023-06-23T15:30:00') // 返回 2023-06-23T23:59:59.999 的 Date 对象
 */
export function endOfDay(date: DateInput): Date | null {
  const d = toDate(date);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/**
 * @func isBefore
 * @param {DateInput} dateA
 * @param {DateInput} dateB
 * @return {boolean | null}
 * @desc 判断 dateA 是否早于 dateB，输入无效返回 null
 * @example
 * isBefore('2023-06-20', '2023-06-23') // 返回 true
 */
export function isBefore(dateA: DateInput, dateB: DateInput): boolean | null {
  const d1 = toDate(dateA);
  const d2 = toDate(dateB);
  if (!d1 || !d2) return null;
  return d1.getTime() < d2.getTime();
}

/**
 * @func isAfter
 * @param {DateInput} dateA
 * @param {DateInput} dateB
 * @return {boolean | null}
 * @desc 判断 dateA 是否晚于 dateB，输入无效返回 null
 * @example
 * isAfter('2023-06-25', '2023-06-23') // 返回 true
 */
export function isAfter(dateA: DateInput, dateB: DateInput): boolean | null {
  const d1 = toDate(dateA);
  const d2 = toDate(dateB);
  if (!d1 || !d2) return null;
  return d1.getTime() > d2.getTime();
}

/**
 * @func isBetween
 * @param {DateInput} target
 * @param {DateInput} start
 * @param {DateInput} end
 * @return {boolean | null}
 * @desc 判断目标日期是否在起始日期和结束日期之间（包含边界），输入无效返回 null
 * @example
 * isBetween('2023-06-22', '2023-06-20', '2023-06-25') // 返回 true
 */
export function isBetween(target: DateInput, start: DateInput, end: DateInput): boolean | null {
  const t = toDate(target);
  const s = toDate(start);
  const e = toDate(end);
  if (!t || !s || !e) return null;
  return t.getTime() >= s.getTime() && t.getTime() <= e.getTime();
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
 * @func getDayOfWeek
 * @param {DateInput} date
 * @return {number | null}
 * @desc 获取日期对应的星期（0-周日，6-周六），输入无效返回 null
 * @example
 * getDayOfWeek('2023-06-23') // 返回 5 （周五）
 */
export function getDayOfWeek(date: DateInput): number | null {
  const d = toDate(date);
  if (!d) return null;
  return d.getDay();
}

/**
 * @func getYear
 * @param {DateInput} date
 * @return {number | null} 年份，输入无效返回 null
 * @example
 * getYear('2023-06-23') // 2023
 * @desc   获取日期的年份
 */
export function getYear(date: DateInput): number | null {
  const d = toDate(date);
  return d ? d.getFullYear() : null;
}

/**
 * @func getMonth
 * @param {DateInput} date
 * @return {number | null} 月份，1-12，输入无效返回 null
 * @example
 * getMonth('2023-06-23') // 6
 * @desc   获取日期的月份（1-12）
 */
export function getMonth(date: DateInput): number | null {
  const d = toDate(date);
  return d ? d.getMonth() + 1 : null;
}
