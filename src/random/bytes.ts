import { randInt } from './number';
import { DEC_BYTES, HEX_BYTES } from './ascii';

/**
 * @func randNumber
 * @param {number} length - 生成字符串长度
 * @param {string} [customBytes] - 可选自定义数字字符集，默认"0123456789"
 * @return {string} 随机数字字符串
 * @example randNumber(6) // "593027"
 * @desc   生成指定长度的随机数字字符串
 */
export function randNumber(length: number, customBytes?: string): string {
  const bytes = customBytes ?? DEC_BYTES;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += bytes.charAt(randInt(0, bytes.length));
  }
  return result;
}

/**
 * @func randHex
 * @param {number} bytesLen - 生成字节长度（实际字符串长度是 bytesLen * 2）
 * @param {string} [customBytes] - 可选自定义16进制字符集，默认"ABCDEF0123456789"
 * @return {string} 随机十六进制字符串
 * @example randHex(4) // "A1B2C3D4"
 * @desc   生成指定字节长度的随机十六进制字符串
 */
export function randHex(bytesLen: number, customBytes?: string): string {
  const bytes = customBytes ?? HEX_BYTES;
  let result = '';
  for (let i = 0; i < bytesLen * 2; i++) {
    result += bytes.charAt(randInt(0, bytes.length));
  }
  return result;
}
