/**
 * @const DEC_BYTES
 * @desc   十进制数字字符集
 */
export const DEC_BYTES = '0123456789';

/**
 * @const HEX_BYTES
 * @desc   十六进制字符集（大写字母 + 数字）
 */
export const HEX_BYTES = 'ABCDEF0123456789';

/**
 * @const ALPHA_BYTES
 * @desc   字母和数字混合字符集（大小写字母 + 数字）
 */
export const ALPHA_BYTES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * @const LETTER_BYTES
 * @desc   字母和数字混合字符集（数字 + 小写字母 + 大写字母）
 */
export const LETTER_BYTES = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let matchCapital: number[] = [];
let matchLowercase: number[] = [];
let matchNumber: number[] = [];
let matchSpecial: number[] = [];

let initialized = false;

const SPECIAL_BYTES = '.@$!%*#_~?&^';

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
