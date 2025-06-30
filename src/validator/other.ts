import { RegexRules } from './rules';
import { match } from './basic';

/**
 * @func isDataTime
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否为简单时间格式
 * @example isDataTime("2023-06-23 16:52:15") // true
 * @desc   简单时间格式校验，支持日期和时间部分
 */
export function isDataTime(str: string): boolean {
  return match(RegexRules.dateTime, str);
}

/**
 * @func isPostCode
 * @param {number|string} value
 * @returns {boolean}
 * @desc 校验是否是大陆邮政编码
 */
export const isPostCode = (value: number | string): boolean => {
  return RegexRules.postCode.test(String(value));
};

/**
 * @func isTelNumber
 * @param {string} str
 * @returns {boolean}
 * @desc 是否是手机号
 */
export const isTelNumber = (str: string): boolean => {
  return RegexRules.telNumber.test(str);
};

/**
 * @func isHasEmoji
 * @param {string} value
 * @returns {boolean}
 * @desc 是否包含emoji表情
 */
export const isHasEmoji = (value: string): boolean => {
  value = String(value);
  for (let i = 0; i < value.length; i++) {
    const hs = value.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (value.length > i + 1) {
        const ls = value.charCodeAt(i + 1);
        const uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (value.length > i + 1) {
      const ls = value.charCodeAt(i + 1);
      if (ls === 0x20e3) {
        return true;
      }
    } else {
      if (
        (0x2100 <= hs && hs <= 0x27ff) ||
        (0x2b05 <= hs && hs <= 0x2b07) ||
        (0x2934 <= hs && hs <= 0x2935) ||
        (0x3297 <= hs && hs <= 0x3299) ||
        [0xa9, 0xae, 0x303d, 0x3030, 0x2b55, 0x2b1c, 0x2b1b, 0x2b50].includes(hs)
      ) {
        return true;
      }
    }
  }
  return false;
};

/**
 * @func isHexColor
 * @param {string} str
 * @returns {boolean}
 * @desc 是否是Hex Color
 */
export const isHexColor = (str: string): boolean => {
  return RegexRules.hexColor.test(str);
};

/**
 * @func isUrl
 * @param {string} url
 * @returns {boolean}
 * @desc 简单判断是否 URL 格式
 */
export function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
