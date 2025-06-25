import { randInt } from './int';

/**
 * @func randTime
 * @return {Date} 随机生成的未来时间，当前时间加1~1000小时
 * @example randTime() // 2025-06-23T20:37:06.000Z
 * @desc   生成当前时间向后随机若干小时的时间
 */
export function randTime(): Date {
  const hoursToAdd = randInt(1, 1000);
  const now = new Date();
  now.setHours(now.getHours() + hoursToAdd);
  return now;
}
