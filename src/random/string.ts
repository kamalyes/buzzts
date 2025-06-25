import { RandType } from './types';
import { initASCII, matchCapital, matchLowercase, matchNumber, matchSpecial } from './ascii';
import { randInt } from './int';

/**
 * @func randString
 * @param {number} n - 生成字符串长度
 * @param {RandType} mode - 字符类型掩码，如 RandType.CAPITAL | RandType.NUMBER
 * @return {string} 随机生成的字符串
 * @example randString(10, RandType.CAPITAL | RandType.NUMBER) // "A1B2C3D4E5"
 * @desc   根据模式生成随机字符串
 */
export function randString(n: number, mode: RandType): string {
  initASCII();

  let ascii: number[] = [];

  if (mode & RandType.CAPITAL) ascii = ascii.concat(matchCapital);
  if (mode & RandType.LOWERCASE) ascii = ascii.concat(matchLowercase);
  if (mode & RandType.SPECIAL) ascii = ascii.concat(matchSpecial);
  if (mode & RandType.NUMBER) ascii = ascii.concat(matchNumber);

  if (ascii.length === 0) return '';

  let result = '';
  for (let i = 0; i < n; i++) {
    const idx = randInt(0, ascii.length);
    result += String.fromCharCode(ascii[idx]);
  }
  return result;
}

/**
 * @func randStringSlice
 * @param {number} count - 生成字符串个数
 * @param {number} len - 每个字符串长度
 * @param {RandType} mode - 字符类型掩码
 * @return {string[]} 随机字符串数组
 * @example randStringSlice(3, 5, RandType.LOWERCASE) // ["abcde", "fghij", "klmno"]
 * @desc   生成指定数量和长度的随机字符串数组
 */
export function randStringSlice(count: number, len: number, mode: RandType): string[] {
  const arr: string[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(randString(len, mode));
  }
  return arr;
}
