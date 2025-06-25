import { randInt } from './int';

/**
 * @func randBool
 * @return {boolean} 随机布尔值
 * @example randBool() // true
 * @desc   生成随机布尔值，概率均等
 */
export function randBool(): boolean {
  return randInt(0, 2) === 0;
}
