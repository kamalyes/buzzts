import { RegexRules } from './rules';
import { match } from './basic';

/**
 * @func isIntOrFloat
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否是整数或最多两位小数的浮点数
 * @example isIntOrFloat("123.45") // true
 * @desc   校验字符串是否为整数或浮点数（最多两位小数）
 */
export function isIntOrFloat(str: string): boolean {
  return match(RegexRules.intOrFloat, str);
}

/**
 * @func isPositiveIntOrFloat
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否是正数（整数或最多两位小数）
 * @example isPositiveIntOrFloat("123.45") // true
 * @desc   校验字符串是否为正整数或正浮点数（最多两位小数）
 */
export function isPositiveIntOrFloat(str: string): boolean {
  return match(RegexRules.positiveIntOrFloat, str);
}

/**
 * @func isNegativeIntOrFloat
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否是负数（整数或最多两位小数）
 * @example isNegativeIntOrFloat("-123.45") // true
 * @desc   校验字符串是否为负整数或负浮点数（最多两位小数）
 */
export function isNegativeIntOrFloat(str: string): boolean {
  return match(RegexRules.negativeIntOrFloat, str);
}

/**
 * @func isLenNNumber
 * @param {string} str - 待校验字符串
 * @param {number} n - 指定长度
 * @return {boolean} 是否为指定长度的数字字符串
 * @example isLenNNumber("1234", 4) // true
 * @desc   校验字符串是否为长度为n的数字
 */
export function isLenNNumber(str: string, n: number): boolean {
  const reg = new RegExp(`^\\d{${n}}$`);
  return match(reg, str);
}

/**
 * @func isGeNNumber
 * @param {string} str - 待校验字符串
 * @param {number} n - 最小长度
 * @return {boolean} 是否为长度大于等于n的数字字符串
 * @example isGeNNumber("12345", 4) // true
 * @desc   校验字符串是否为长度大于等于n的数字
 */
export function isGeNNumber(str: string, n: number): boolean {
  const reg = new RegExp(`^\\d{${n},}$`);
  return match(reg, str);
}

/**
 * @func isMNIntervalNumber
 * @param {string} str - 待校验字符串
 * @param {number} m - 最小长度
 * @param {number} n - 最大长度
 * @return {boolean} 是否为长度在m到n之间的数字字符串
 * @example isMNIntervalNumber("1234", 3, 5) // true
 * @desc   校验字符串是否为长度在m到n之间的数字
 */
export function isMNIntervalNumber(str: string, m: number, n: number): boolean {
  const reg = new RegExp(`^\\d{${m},${n}}$`);
  return match(reg, str);
}

/**
 * @func isStartingWithNonZero
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否以非零数字开头
 * @example isStartingWithNonZero("123") // true
 * @desc   校验字符串是否以非零数字开头
 */
export function isStartingWithNonZero(str: string): boolean {
  return match(RegexRules.startingWithNonZero, str);
}

/**
 * @func isNNovelsOfRealNumber
 * @param {string} str - 待校验字符串
 * @param {number} n - 小数点后位数
 * @return {boolean} 是否为小数点后恰好n位的小数或整数
 * @example isNNovelsOfRealNumber("123.45", 2) // true
 * @desc   校验小数点后恰好n位小数
 */
export function isNNovelsOfRealNumber(str: string, n: number): boolean {
  const reg = new RegExp(`^[0-9]+(\\.[0-9]{${n}})?$`);
  return match(reg, str);
}

/**
 * @func isMNNovelsOfRealNumber
 * @param {string} str - 待校验字符串
 * @param {number} m - 小数点后最小位数
 * @param {number} n - 小数点后最大位数
 * @return {boolean} 是否为小数点后位数在m到n之间的小数或整数
 * @example isMNNovelsOfRealNumber("123.456", 2, 3) // true
 * @desc   校验小数点后m到n位小数
 */
export function isMNNovelsOfRealNumber(str: string, m: number, n: number): boolean {
  const reg = new RegExp(`^[0-9]+(\\.[0-9]{${m},${n}})?$`);
  return match(reg, str);
}

/**
 * @func isNanZeroNumber
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否为正整数且非零
 * @example isNanZeroNumber("123") // true
 * @desc   校验是否为正整数且非零
 */
export function isNanZeroNumber(str: string): boolean {
  return match(RegexRules.nonZeroPositiveInt, str);
}

/**
 * @func isNanZeroNegNumber
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否为负整数且非零
 * @example isNanZeroNegNumber("-123") // true
 * @desc   校验是否为负整数且非零
 */
export function isNanZeroNegNumber(str: string): boolean {
  return match(RegexRules.nonZeroNegativeInt, str);
}
