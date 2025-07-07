import { DateInput } from './types';

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
  if (d == null) return null;

  if (d instanceof Date) return isValidDate(d) ? d : null;

  if (typeof d === 'number') {
    // 判断数字是秒还是毫秒：秒时间戳一般是10位，毫秒是13位
    // 这里用 1e11 作为阈值更稳妥（约为 1973-03-03）
    const timestamp = d < 1e11 ? d * 1000 : d;
    const date = new Date(timestamp);
    return isValidDate(date) ? date : null;
  }

  if (typeof d === 'string') {
    const date = new Date(d);
    return isValidDate(date) ? date : null;
  }

  return null;
}

/**
 * @internal
 * @desc 统一处理日期转换，返回 null 或 Date 对象
 * @param {DateInput} date
 * @returns {Date | null}
 */
function parseDate(date: DateInput): Date | null {
  const d = toDate(date);
  return d && isValidDate(d) ? d : null;
}

/**
 * 统一处理日期加时间的函数
 * @param {DateInput} date - 基准日期
 * @param {number} amount - 增加的数量（可为负数）
 * @param {'Date' | 'Hours' | 'Minutes' | 'Seconds'} unit - 时间单位
 * @returns {Date | null} 新的日期对象，输入无效返回 null
 */
export function addTime(date: DateInput, amount: number, unit: 'date' | 'hours' | 'minutes' | 'seconds'): Date | null {
  const d = parseDate(date);
  if (!d) return null;
  const result = new Date(d);
  switch (unit) {
    case 'date':
      result.setDate(d.getDate() + amount);
      break;
    case 'hours':
      result.setHours(d.getHours() + amount);
      break;
    case 'minutes':
      result.setMinutes(d.getMinutes() + amount);
      break;
    case 'seconds':
      result.setSeconds(d.getSeconds() + amount);
      break;
  }
  return result;
}

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
  return addTime(date, days, 'date');
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
  return addTime(date, hours, 'hours');
}

/**
 * @func addMinutes
 * @param {DateInput} date - 基准日期
 * @param {number} minutes - 增加的分钟数
 * @return {Date | null} 新的日期对象，输入无效返回 null
 * @desc 在基准日期上增加指定分钟数，返回新日期
 * @example
 * addMinutes('2023-06-23T10:00:00', 30) // 返回 2023-06-23T10:30:00 的 Date 对象
 */
export function addMinutes(date: DateInput, minutes: number): Date | null {
  return addTime(date, minutes, 'minutes');
}

/**
 * @func addSeconds
 * @param {DateInput} date - 基准日期
 * @param {number} seconds - 增加的秒数
 * @return {Date | null} 新的日期对象，输入无效返回 null
 * @desc 在基准日期上增加指定秒数，返回新日期
 * @example
 * addSeconds('2023-06-23T10:00:00', 55) // 返回 2023-06-23T10:00:55 的 Date 对象
 */
export function addSeconds(date: DateInput, seconds: number): Date | null {
  return addTime(date, seconds, 'seconds');
}

/**
 * @func diffDaysWithDecimal
 * @param {DateInput} dateA - 日期A
 * @param {DateInput} dateB - 日期B
 * @return {number | null} 两日期之间相差的天数（带小数），输入无效时返回 null
 * @desc 计算两个日期之间相差的天数
 * @example
 * diffDaysWithDecimal("2023-06-22T12:00:00", "2023-06-20T00:00:00"); // 返回约 2.5
 * diffDaysWithDecimal(new Date(2023, 5, 22), new Date(2023, 5, 20)); // 返回 2
 * diffDaysWithDecimal("invalid date", "2023-06-20"); // 返回 null
 */
export function diffDaysWithDecimal(dateA: DateInput, dateB: DateInput): number | null {
  const d1 = parseDate(dateA);
  const d2 = parseDate(dateB);
  if (!d1 || !d2) return null;
  const diffMs = Math.abs(d1.getTime() - d2.getTime());
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays;
}

/**
 * @func getBoundaryOfDay
 * @param {DateInput} date - 指定日期
 * @param {'start' | 'end'} boundary - 'start' 返回当天开始时间，'end' 返回当天结束时间
 * @return {Date | null} 指定日期当天的开始或结束时间，输入无效返回 null
 * @desc 获取指定日期当天的开始时间（00:00:00）或结束时间（23:59:59.999）
 * @example
 * getBoundaryOfDay('2023-06-23T15:30:00', 'start') // 返回 2023-06-23T00:00:00
 * getBoundaryOfDay('2023-06-23T15:30:00', 'end')   // 返回 2023-06-23T23:59:59.999
 */
export function getBoundaryOfDay(date: DateInput, boundary: 'start' | 'end'): Date | null {
  const d = parseDate(date);
  if (!d) return null;
  if (boundary === 'start') return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/**
 * @func startOfDay
 * @param {DateInput} date - 指定日期
 * @return {Date | null} 指定日期当天的开始时间（00:00:00），输入无效返回 null
 * @desc 获取指定日期当天的开始时间（00:00:00）
 * @example
 * startOfDay('2023-06-23T15:30:00') // 返回 2023-06-23T00:00:00 的 Date 对象
 */
export function startOfDay(date: DateInput): Date | null {
  return getBoundaryOfDay(date, 'start');
}

/**
 * @func endOfDay
 * @param {DateInput} date - 指定日期
 * @return {Date | null} 指定日期当天的结束时间（23:59:59.999），输入无效返回 null
 * @desc 获取指定日期当天的结束时间（23:59:59.999）
 * @example
 * endOfDay('2023-06-23T15:30:00') // 返回 2023-06-23T23:59:59.999 的 Date 对象
 */
export function endOfDay(date: DateInput): Date | null {
  return getBoundaryOfDay(date, 'end');
}

/**
 * @func getDayOfWeek
 * @param {DateInput} date - 指定日期
 * @return {number | null} 日期对应的星期（0-周日，6-周六），输入无效返回 null
 * @desc 获取日期对应的星期
 * @example
 * getDayOfWeek('2023-06-23') // 返回 5 （周五）
 */
export function getDayOfWeek(date: DateInput): number | null {
  const d = parseDate(date);
  return d ? d.getDay() : null;
}

/**
 * @func getYear
 * @param {DateInput} date - 指定日期
 * @return {number | null} 年份，输入无效返回 null
 * @desc 获取日期的年份
 * @example
 * getYear('2023-06-23') // 2023
 */
export function getYear(date: DateInput): number | null {
  const d = parseDate(date);
  return d ? d.getFullYear() : null;
}

/**
 * @func getMonth
 * @param {DateInput} date - 指定日期
 * @return {number | null} 月份，1-12，输入无效返回 null
 * @desc 获取日期的月份（1-12）
 * @example
 * getMonth('2023-06-23') // 6
 */
export function getMonth(date: DateInput): number | null {
  const d = parseDate(date);
  return d ? d.getMonth() + 1 : null;
}

/**
 * @func getDay
 * @param {DateInput} date - 指定日期
 * @return {number | null} 日期中的“日”，1-31，输入无效返回 null
 * @desc 获取日期的日（1-31）
 * @example
 * getDay('2023-06-23') // 23
 */
export function getDay(date: DateInput): number | null {
  const d = parseDate(date);
  return d ? d.getDate() : null;
}

/**
 * @func getHours
 * @param {DateInput} date - 指定日期
 * @return {number | null} 小时，0-23，输入无效返回 null
 * @desc 获取日期的小时（0-23）
 * @example
 * getHours('2023-06-23T14:30:00') // 14
 */
export function getHours(date: DateInput): number | null {
  const d = parseDate(date);
  return d ? d.getHours() : null;
}

/**
 * @func getMinutes
 * @param {DateInput} date - 指定日期
 * @return {number | null} 分钟，0-59，输入无效返回 null
 * @desc 获取日期的分钟（0-59）
 * @example
 * getMinutes('2023-06-23T14:30:00') // 30
 */
export function getMinutes(date: DateInput): number | null {
  const d = parseDate(date);
  return d ? d.getMinutes() : null;
}

/**
 * @func getSeconds
 * @param {DateInput} date - 指定日期
 * @return {number | null} 秒数，0-59，输入无效返回 null
 * @desc 获取日期的秒数（0-59）
 * @example
 * getSeconds('2023-06-23T14:30:45') // 45
 */
export function getSeconds(date: DateInput): number | null {
  const d = parseDate(date);
  return d ? d.getSeconds() : null;
}

/**
 * @func getMilliseconds
 * @param {DateInput} date - 指定日期
 * @return {number | null} 毫秒数，0-999，输入无效返回 null
 * @desc 获取日期的毫秒数（0-999）
 * @example
 * getMilliseconds('2023-06-23T14:30:45.123') // 123
 */
export function getMilliseconds(date: DateInput): number | null {
  const d = parseDate(date);
  return d ? d.getMilliseconds() : null;
}

/**
 * 表示一周七天的计数对象
 */
export interface WeekdayCount {
  /** 周日的出现次数 */
  sunday: number;
  /** 周一的出现次数 */
  monday: number;
  /** 周二的出现次数 */
  tuesday: number;
  /** 周三的出现次数 */
  wednesday: number;
  /** 周四的出现次数 */
  thursday: number;
  /** 周五的出现次数 */
  friday: number;
  /** 周六的出现次数 */
  saturday: number;
}

/**
 * 计算指定日期所在月份中，每个星期几出现的次数
 *
 * @param {DateInput} [date=new Date()] - 指定日期，默认当前日期
 * @returns {WeekdayCount | null} 返回一个对象，包含该月中每个星期几出现的次数
 *
 * @example
 * const counts = getWeekdayCountInMonth(new Date('2023-06-15'));
 * console.log(counts.monday);  // 输出该月周一的天数
 * console.log(counts.sunday);  // 输出该月周日的天数
 */
export function getWeekdayCountInMonth(date: DateInput = new Date()): WeekdayCount | null {
  const d = parseDate(date);
  if (!d) return null;

  const year = d.getFullYear();
  const month = d.getMonth();

  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const keys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

  const weekdayCount: WeekdayCount = {
    sunday: 0,
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
  };

  for (let day = 1; day <= lastDay; day++) {
    const utcDate = new Date(Date.UTC(year, month, day));
    const localDate = new Date(utcDate.getTime() - d.getTimezoneOffset() * 60 * 1000);
    const weekday = localDate.getUTCDay();
    weekdayCount[keys[weekday]]++;
  }

  return weekdayCount;
}

/**
 * @func getUnixTimestamp
 * @param {DateInput} [date=new Date()] - 需要转换的日期
 * @return {number | null} Unix 时间戳（秒），输入无效返回 null
 * @example
 * getUnixTimestamp('2023-06-23') // 1687497600
 * getUnixTimestamp()             // 当前时间戳
 * @desc 获取指定日期的 Unix 时间戳（秒）
 */
export function getUnixTimestamp(date: DateInput = new Date()): number | null {
  const d = parseDate(date);
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
 * @desc 将秒或毫秒时间戳转换为 Date 对象
 */
export function timestampToDate(timestamp: number | string): Date | null {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(ts)) return null;
  const date = ts < 1e12 ? new Date(ts * 1000) : new Date(ts);
  return isValidDate(date) ? date : null;
}
