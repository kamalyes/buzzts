import { RegexRules } from './rules';
import { match } from './basic';

/**
 * @func isIPv4
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否为合法IPv4地址
 * @example isIPv4("192.168.0.1") // true
 * @desc   校验字符串是否符合IPv4格式
 */
export function isIPv4(str: string): boolean {
  return match(RegexRules.ipv4, str);
}

/**
 * @func isIPv6
 * @param {string} str - 待校验字符串
 * @return {boolean} 是否为合法IPv6地址
 * @example isIPv6("2001:0db8:85a3::8a2e:0370:7334") // true
 * @desc   校验字符串是否为IPv6地址（支持完整和压缩格式，排除IPv4）
 */
export function isIPv6(str: string): boolean {
  // 先简单判断字符集和包含冒号，且排除IPv4格式
  if (!/^[0-9a-fA-F:]+$/.test(str) || !str.includes(':') || isIPv4(str)) {
    return false;
  }

  // 冒号数量不能超过7个
  const colonCount = (str.match(/:/g) || []).length;
  if (colonCount > 7) {
    return false;
  }

  // 根据是否包含 :: 使用不同正则校验
  if (str.includes('::')) {
    return RegexRules.ipv6Compressed.test(str);
  } else {
    return RegexRules.ipv6Full.test(str);
  }
}
