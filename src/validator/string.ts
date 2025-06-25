import { RegexRules } from './rules';
import { match } from './basic';

/**
 * @func isNLen
 * @param {string} str - 待校验字符串
 * @param {number} n - 指定长度
 * @return {boolean} 是否为指定长度的任意字符字符串
 * @example isNLen("abcd", 4) // true
 * @desc   校验字符串是否为长度为n
 */
export function isNLen(str: string, n: number): boolean {
  const reg = new RegExp(`^.{${n}}$`);
  return match(reg, str);
}

/**
 * @func isEnCharacter
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否全英文字符
 * @example isEnCharacter("abcDEF") // true
 * @desc   校验字符串是否全部为英文字符（大小写均可）
 */
export function isEnCharacter(str: string): boolean {
  return match(RegexRules.enCharacter, str);
}

/**
 * @func isUpEnCharacter
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否全大写英文
 * @example isUpEnCharacter("ABCDEF") // true
 * @desc   校验字符串是否全部为大写英文字符
 */
export function isUpEnCharacter(str: string): boolean {
  return match(RegexRules.upperEnCharacter, str);
}

/**
 * @func isLowerEnCharacter
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否全小写英文
 * @example isLowerEnCharacter("abcdef") // true
 * @desc   校验字符串是否全部为小写英文字符
 */
export function isLowerEnCharacter(str: string): boolean {
  return match(RegexRules.lowerEnCharacter, str);
}

/**
 * @func isNumberEnCharacter
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否数字+英文组成
 * @example isNumberEnCharacter("abc123") // true
 * @desc   校验字符串是否只包含数字和英文字符
 */
export function isNumberEnCharacter(str: string): boolean {
  return match(RegexRules.numberEnCharacter, str);
}

/**
 * @func isNumberEnUnderscores
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否数字、英文及下划线组成
 * @example isNumberEnUnderscores("abc_123") // true
 * @desc   校验字符串是否只包含数字、英文和下划线
 */
export function isNumberEnUnderscores(str: string): boolean {
  return match(RegexRules.numberEnUnderscore, str);
}

/**
 * @func isIsContainSpecialCharacter
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否包含特殊字符
 * @example isIsContainSpecialCharacter("abc@123") // true
 * @desc   校验字符串是否包含特殊字符
 */
export function isIsContainSpecialCharacter(str: string): boolean {
  return match(RegexRules.containSpecialChar, str);
}

/**
 * @func isEmail
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否符合邮箱格式
 * @example isEmail("test@example.com") // true
 * @desc   校验字符串是否为合法邮箱地址
 */
export function isEmail(str: string): boolean {
  return match(RegexRules.email, str);
}

/**
 * @func isChinesePhoneNumber
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否符合中国手机号格式
 * @example isChinesePhoneNumber("13800138000") // true
 * @desc   校验字符串是否为合法中国大陆手机号
 */
export function isChinesePhoneNumber(str: string): boolean {
  return match(RegexRules.chinesePhoneNumber, str);
}

/**
 * @func isChineseIDCardNumber
 * @param {string} id - 待校验身份证号
 * @return {boolean} 是否为合法身份证号（15或18位）
 * @example isChineseIDCardNumber("11010519491231002X") // true
 * @desc   校验中国身份证号码格式及校验位
 */
export function isChineseIDCardNumber(id: string): boolean {
  // 1. 正则匹配
  if (!RegexRules.chineseIDCardNumber.test(id)) {
    return false;
  }

  // 2. 校验地区码（前6位）
  const regionCode = id.slice(0, 6);
  if (!isValidRegionCode(regionCode)) {
    return false;
  }

  // 3. 校验出生日期
  if (id.length === 15) {
    // 15位：YYMMDD → 19YY-MM-DD
    const birthDate = `19${id.slice(6, 12)}`;
    if (!isValidDate(birthDate)) {
      return false;
    }
  } else if (id.length === 18) {
    // 18位：YYYYMMDD
    const birthDate = id.slice(6, 14);
    if (!isValidDate(birthDate)) {
      return false;
    }
  }

  // 4. 校验位
  if (id.length === 15) {
    const id17 = id.slice(0, 6) + '19' + id.slice(6);
    const checksum = calculateChecksum(id17);
    return checksum === id[17]?.toUpperCase();
  } else if (id.length === 18) {
    return calculateChecksum(id.slice(0, 17)) === id[17].toUpperCase();
  }

  return false;
}

/** 校验地区码（前6位） */
function isValidRegionCode(regionCode: string): boolean {
  // 实际项目中应使用合法的行政区划代码库（如国家统计局数据）
  // 示例：仅简单校验是否为数字
  return /^\d{6}$/.test(regionCode);
}

/** 校验日期（支持 YYYYMMDD 或 YYMMDD → 19YYMMDD） */
function isValidDate(dateStr: string): boolean {
  // 15位：YYMMDD → 19YYMMDD
  if (dateStr.length === 6) {
    dateStr = `19${dateStr}`;
  }
  // 18位：YYYYMMDD
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6));
  const day = parseInt(dateStr.slice(6, 8));

  // 简单日期校验（实际项目应更严格）
  return year >= 1900 && year <= new Date().getFullYear() && month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

/**
 * @func calculateChecksum
 * @param {string} id17 - 身份证号前17位数字字符串
 * @return {string} 校验码字符（0-9或X）
 * @desc   根据身份证号前17位计算校验码
 */
function calculateChecksum(id17: string): string {
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(id17[i]) * weights[i];
  }
  const remainder = sum % 11;
  return checkCodes[remainder];
}

/**
 * @func isContainChineseCharacter
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否包含中文字符
 * @example isContainChineseCharacter("测试") // true
 * @desc   校验字符串是否包含中文字符
 */
export function isContainChineseCharacter(str: string): boolean {
  return match(RegexRules.containChineseChar, str);
}

/**
 * @func isDoubleByte
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否包含双字节字符
 * @example isDoubleByte("测试") // true
 * @desc   校验字符串是否包含双字节字符
 */
export function isDoubleByte(str: string): boolean {
  return match(RegexRules.doubleByte, str);
}

/**
 * @func isEmptyLine
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否为空行
 * @example isEmptyLine("  ") // true
 * @desc   校验字符串是否为空行（仅空白字符）
 */
export function isEmptyLine(str: string): boolean {
  return match(RegexRules.emptyLine, str);
}

/**
 * @func isHex
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否为十六进制字符串
 * @example isHex("1a2b3c") // true
 * @desc   校验字符串是否只包含十六进制字符
 */
export function isHex(str: string): boolean {
  return match(RegexRules.hex, str);
}

/**
 * @func matchNumberWithLength
 * @param {string} str - 待校验字符串
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @return {boolean} 是否为指定长度范围内的数字字符串
 * @example matchNumberWithLength("12345", 3, 5) // true
 * @desc   校验字符串是否为数字，长度在min到max之间
 */
export function matchNumberWithLength(str: string, min: number, max: number): boolean {
  const reg = new RegExp(`^\\d{${min},${max}}$`);
  return match(reg, str);
}

/**
 * @func isChines
 * @param {string} str
 * @returns {boolean}
 * @desc 是否是中文
 */
export const isChines = (str: string): boolean => {
  return RegexRules.chinese.test(str);
};
