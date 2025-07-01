/**
 * 通用匹配函数
 * @param {RegExp} regexp - 正则表达式
 * @param {string} str - 待匹配字符串
 * @return {boolean} 是否匹配
 */
export function match(regexp: RegExp, str: string): boolean {
  return regexp.test(str);
}
