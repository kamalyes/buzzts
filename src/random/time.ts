import { randInt } from './number';

/**
 * @func randTime
 * @return {Date} 随机生成的未来时间，当前时间加1~1000小时
 * @desc 生成当前时间向后随机若干小时的时间
 * @example
 * randTime() // 2025-06-23T20:37:06.000Z
 */
export function randTime(): Date {
  const hoursToAdd = randInt(1, 1000);
  const now = new Date();
  now.setHours(now.getHours() + hoursToAdd);
  return now;
}

/**
 * @func randPastTime
 * @return {Date} 随机生成的过去时间，当前时间减1~1000小时
 * @desc 生成当前时间向前随机若干小时的时间
 * @example
 * randPastTime() // 2025-04-22T10:15:00.000Z
 */
export function randPastTime(): Date {
  const hoursToSub = randInt(1, 1000);
  const now = new Date();
  now.setHours(now.getHours() - hoursToSub);
  return now;
}

/**
 * @func randTimeBetween
 * @param {Date} start - 起始时间
 * @param {Date} end - 结束时间
 * @return {Date} 在 start 和 end 之间随机生成一个时间
 * @throws 如果 start 晚于 end，会抛出错误
 * @desc 生成指定时间区间内的随机时间
 * @example
 * randTimeBetween(new Date('2023-01-01'), new Date('2023-12-31')) // 2023-07-15T08:20:00.000Z
 */
export function randTimeBetween(start: Date, end: Date): Date {
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (startMs > endMs) {
    throw new Error('start 时间必须早于 end 时间');
  }
  const randMs = randInt(startMs, endMs);
  return new Date(randMs);
}

/**
 * @func randDate
 * @param {number} [startYear=1970] - 起始年份，默认为1970
 * @param {number} [endYear=当前年份+10] - 结束年份，默认为当前年份+10
 * @return {Date} 随机生成指定年份范围内的日期，时间部分为00:00:00
 * @desc 随机生成某年范围内的日期，时间清零
 * @example
 * randDate(2000, 2020) // 2010-05-21T00:00:00.000Z
 */
export function randDate(startYear = 1970, endYear = new Date().getFullYear() + 10): Date {
  const year = randInt(startYear, endYear);
  const month = randInt(0, 11);
  const maxDay = new Date(year, month + 1, 0).getDate();
  const day = randInt(1, maxDay);
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * @func randTimestamp
 * @param {number} startTimestamp - 起始时间戳（毫秒）
 * @param {number} endTimestamp - 结束时间戳（毫秒）
 * @return {number} 在指定时间戳范围内随机生成一个时间戳（毫秒）
 * @throws 如果 startTimestamp 大于 endTimestamp，会抛出错误
 * @desc 生成指定时间戳范围内的随机毫秒数
 * @example
 * randTimestamp(1672531200000, 1704067200000) // 1685000000000
 */
export function randTimestamp(startTimestamp: number, endTimestamp: number): number {
  if (startTimestamp > endTimestamp) {
    throw new Error('startTimestamp 必须小于或等于 endTimestamp');
  }
  return randInt(startTimestamp, endTimestamp);
}

/**
 * @func randISOTime
 * @return {string} 随机生成的未来时间的 ISO 8601 格式字符串
 * @desc 生成当前时间向后随机若干小时的时间，并转换为 ISO 格式字符串
 * @example
 * randISOTime() // "2025-06-23T20:37:06.000Z"
 */
export function randISOTime(): string {
  return randTime().toISOString();
}
