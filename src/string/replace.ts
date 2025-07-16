/**
 * @desc 将字符串中指定区间的字符替换为指定字符串（支持多字符替换、删除、负数索引）
 *       替换区间包含结束索引
 * @param str 原始字符串，必须是字符串类型
 * @param start 开始替换位置，支持负数索引（负数表示从字符串末尾开始计数）
 * @param end 结束替换位置，支持负数索引（替换区间包含该位置）
 * @param replacement 替换字符串，必传参数，可以是多字符字符串，传空字符串表示删除该区间字符
 * @returns 返回替换后的新字符串，原字符串不变
 *
 * @example
 * strReplace('123756789', 3, 6, '*') // 返回 "123****789"
 * strReplace('123756789', -6, -3, '#') // 返回 "123####789"
 * strReplace('abcdefg', 2, 5, 'XY') // 返回 "abXYg"
 * strReplace('abcdefg', 2, 5, '') // 返回 "abg"
 */
export function strReplace(str: string, start: number, end: number, replacement: string): string {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }

  const len = str.length;

  let realStart = start < 0 ? len + start : start;
  let realEnd = end < 0 ? len + end : end;

  realStart = Math.max(0, Math.min(realStart, len));
  realEnd = Math.max(0, Math.min(realEnd, len));

  if (realStart > realEnd) {
    [realStart, realEnd] = [realEnd, realStart];
  }

  // 替换区间包含结束索引，长度加1
  const replaceLength = realEnd - realStart + 1;

  if (replaceLength <= 0) {
    return str;
  }

  const first = str.slice(0, realStart);
  // 这里切片要从 realEnd + 1 开始，跳过包含结束索引的字符
  const last = str.slice(realEnd + 1);

  return first + replacement + last;
}

/**
 * @desc 将输入字符串按照指定的块大小分割成多个子字符串
 * @param {string} str - 要分割的字符串
 * @param {number} chunkSize - 每个子字符串的长度，必须是大于 0 的整数
 * @returns {string[]} 返回一个包含分割后的子字符串的数组
 *
 * @throws {TypeError} 当 `str` 不是字符串时抛出
 * @throws {RangeError} 当 `chunkSize` 不是正整数时抛出
 *
 * @example
 * import { chunkString } from '@mt-utils/tools';
 * console.log(chunkString('abcde', 3)); // 输出: ['abc', 'yz']
 * console.log(chunkString('abcdefghijklmnopqrstuvwxyz', 5)); // 输出: ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxy', 'z']
 */
export function chunkString(str: string, chunkSize: number): string[] {
  if (typeof str !== 'string') {
    throw new TypeError('参数 str 必须是字符串');
  }
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new RangeError('参数 chunkSize 必须是大于 0 的整数');
  }

  const len = str.length;
  const result: string[] = [];
  let chunk = '';

  for (let i = 0; i < len; i++) {
    chunk += str[i];
    if (chunk.length === chunkSize) {
      result.push(chunk);
      chunk = '';
    }
  }
  if (chunk.length > 0) {
    result.push(chunk);
  }
  return result;
}

/**
 * @desc 替换字符串里面的回车换行符，将输入字符串中的回车符（\r）和换行符（\n）替换为指定的替换字符串
 * @param {string} v - 需要进行替换的字符串
 * @param {string} [replacement='<br/>'] - 替换字符串，默认为 '<br/>'
 * @returns {string} 返回替换后的字符串，其中所有的回车和换行符均被替换为指定的替换字符串
 * @example
 * const input = "Hello,\nWorld!\rThis is a test.";
 * const output = replaceCRLF(input);
 * console.log(output); // "Hello,<br/>World!<br/>This is a test."
 *
 * const customOutput = replaceCRLF(input, '---');
 * console.log(customOutput); // "Hello,---World!---This is a test."
 */
export function replaceCRLF(v: string, replacement: string = '<br/>') {
  return v.replace(/\r|\n/gi, replacement);
}

/**
 * @desc 替换指定范围内的字符为指定的分隔符
 * @param {string} val - 需要进行过滤的字符串
 * @param {string} [sep='*'] - 替换字符的分隔符，默认为 '*'
 * @param {number} [start=0] - 替换开始的索引，默认为 0
 * @param {number} [end] - 替换结束的索引，默认为字符串的长度
 * @returns {string} 返回过滤后的字符串，其中指定范围内的字符被替换为分隔符
 * @example
 * const input = "Hello, World!";
 * const output = filterString(input, '*', 7, 12);
 * console.log(output); // "Hello, *****!"
 *
 * const output2 = filterString(input);
 * console.log(output2); // "Hello, World!" (没有替换)
 */
export function filterString(val: string, sep: string = '*', start: number = 0, end?: number): string {
  return val
    .split('')
    .map((s, index) => {
      if (index >= start && index < (end ?? val.length)) {
        return sep;
      }
      return s;
    })
    .join('');
}
