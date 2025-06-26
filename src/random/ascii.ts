/**
 * @const DEC_BYTES
 * @desc   十进制数字字符集
 */
export const DEC_BYTES = '0123456789';

/**
 * @const HEX_BYTES
 * @desc   十六进制字符集（大写字母 + 数字），顺序为字母ABCDEF在前，数字0123456789在后
 */
export const HEX_BYTES = 'ABCDEF0123456789';

/**
 * @const HEX_CHARS
 * @desc   十六进制字符集（数字 + 大写字母），顺序为数字0123456789在前，字母ABCDEF在后
 */
export const HEX_CHARS = '0123456789ABCDEF';

/**
 * @const ALPHA_BYTES
 * @desc   字母和数字混合字符集（大小写字母 + 数字）
 */
export const ALPHA_BYTES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * @var matchCapital
 * @desc  用于存储匹配到的大写字母的字符码数组
 */
let matchCapital: number[] = [];

/**
 * @var matchLowercase
 * @desc  用于存储匹配到的小写字母的字符码数组
 */
let matchLowercase: number[] = [];

/**
 * @var matchNumber
 * @desc  用于存储匹配到的数字字符码数组
 */
let matchNumber: number[] = [];

/**
 * @var matchSpecial
 * @desc  用于存储匹配到的特殊字符（如 .@$!%*#_~?&^）的字符码数组
 */
let matchSpecial: number[] = [];

/**
 * @var initialized
 * @desc  标记是否已完成初始化（如字符码数组的填充），防止重复初始化
 */
let initialized = false;

/**
 * @const SPECIAL_BYTES
 * @desc 特殊字符集字符串，包含常用的特殊符号字符。
 *      该字符集通常用于匹配或生成密码、令牌、随机字符串中的特殊字符部分，
 *      以增加字符串的复杂度和安全性。
 *      包含的字符有：'.', '@', '$', '!', '%', '*', '#', '_', '~', '?', '&', '^'
 */
export const SPECIAL_BYTES = '.@$!%*#_~?&^';

/**
 * @const HEX_PATTERN
 * @desc 用于验证字符串是否仅包含合法的十六进制字符的正则表达式。
 *      匹配字符范围包括数字0-9和字母a-f（不区分大小写）。
 *      该正则常用于校验自定义的十六进制字符集是否合法，
 *      确保生成的颜色字符串或其他十六进制编码字符串的有效性。
 */
export const HEX_PATTERN = /^[0-9a-fA-F]+$/;

/**
 * @func createASCIIList
 * @param {number} start - ASCII码起始值
 * @param {number} end - ASCII码结束值
 * @return {number[]} 包含从start到end的ASCII码数组
 * @example createASCIIList(65, 67) // [65, 66, 67]
 * @desc   创建指定范围的ASCII码列表
 */
export function createASCIIList(start: number, end: number): number[] {
  const list: number[] = [];
  for (let i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
}

/**
 * @func initASCII
 * @desc   初始化ASCII码表，只执行一次，填充大写字母、小写字母、数字和特殊字符的ASCII码数组
 * @example initASCII()
 */
export function initASCII() {
  if (initialized) return;
  matchCapital = createASCIIList(65, 90);
  matchLowercase = createASCIIList(97, 122);
  matchNumber = createASCIIList(48, 57);
  matchSpecial = Array.from(SPECIAL_BYTES).map(c => c.charCodeAt(0));
  initialized = true;
}

export { matchCapital, matchLowercase, matchNumber, matchSpecial };
