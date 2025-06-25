/**
 * @func upperMoney
 * @param  {number} n
 * @return {string}
 * @desc   现金额转大写
 * @example upperMoney(123456789.123) // 壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元叁角肆分
 */
export function upperMoney(n: number): string {
  if (typeof n !== 'number' || isNaN(n)) return '';
  if (n === 0) return '零元整';

  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];

  let head = n < 0 ? '负' : '';
  n = Math.abs(n);

  let s = '';

  // 处理小数部分
  for (let i = 0; i < fraction.length; i++) {
    const m = Math.floor(n * 10 * Math.pow(10, i)) % 10;
    if (m !== 0) {
      s += digit[m] + fraction[i];
    }
  }
  if (s === '') s = '整';

  // 处理整数部分
  n = Math.floor(n);

  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    let part = n % 10000;
    n = Math.floor(n / 10000);

    for (let j = 0; j < unit[1].length && part > 0; j++) {
      const d = part % 10;
      part = Math.floor(part / 10);
      if (d !== 0) {
        p = digit[d] + unit[1][j] + p;
      } else {
        // 避免连续零
        if (!p.startsWith(digit[0])) {
          p = digit[0] + p;
        }
      }
    }
    // 去除末尾多余零
    p = p.replace(/(零)+$/g, '');
    // 替换连续多个零为一个零
    p = p.replace(/(零)+/g, '零');

    if (p !== '') {
      s = p + unit[0][i] + s;
    } else {
      // 如果当前四位为0且不是第一块，且s开头不是零，则加零
      if (!s.startsWith(digit[0]) && s !== '整') {
        s = digit[0] + s;
      }
    }
  }

  // 处理结果中多余零
  s = s.replace(/(零)+/g, '零');
  // 去除零元前面的零
  s = s.replace(/零元/, '元');
  // 去除末尾零
  s = s.replace(/零+$/, '');
  // 如果结尾不是整，加上“整”
  if (!s.endsWith('角') && !s.endsWith('分') && !s.endsWith('整')) {
    s += '整';
  }

  return head + s;
}

/**
 * @func intToLowerChinese
 * @param  {string | number} value
 * @return {string}
 * @example intToLowerChinese(123456789) // 一亿二千三百四十五万六千七百八十九
 * @desc   数字转中文(小写)
 */
export const intToLowerChinese = (value: string | number): string => {
  const str = String(value);
  if (!/^\d+$/.test(str)) throw new Error('输入必须为非负整数字符串或数字');
  if (str === '0') return '零';

  const num = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千'];
  const bigUnits = ['', '万', '亿', '万亿'];

  // 将数字从右往左每4位一组切分
  const splitToGroups = (s: string): string[] => {
    const groups = [];
    let i = s.length;
    while (i > 0) {
      const start = Math.max(i - 4, 0);
      groups.unshift(s.substring(start, i));
      i = start;
    }
    return groups;
  };

  // 处理每组4位数字，转成中文
  const fourDigitToChinese = (fourDigitStr: string): string => {
    let res = '';
    const len = fourDigitStr.length;
    let zeroFlag = false; // 标记是否遇到零

    for (let i = 0; i < len; i++) {
      const digit = +fourDigitStr[i];
      const pos = len - i - 1; // 单位位置

      if (digit === 0) {
        zeroFlag = true;
      } else {
        if (zeroFlag) {
          res += '零';
          zeroFlag = false;
        }
        res += num[digit] + units[pos];
      }
    }
    return res;
  };

  const groups = splitToGroups(str);
  let result = '';
  let zeroBetweenGroups = false; // 标记组间是否有零

  for (let i = 0; i < groups.length; i++) {
    const groupStr = groups[i];
    const groupChinese = fourDigitToChinese(groupStr);

    if (groupChinese) {
      if (zeroBetweenGroups) {
        result += '零';
        zeroBetweenGroups = false;
      }
      result += groupChinese + bigUnits[groups.length - i - 1];
    } else {
      // 该组全为0，下一组非零时需要插入零
      zeroBetweenGroups = true;
    }
  }

  // 处理开头“壹十”简写为“十”
  if (result.startsWith('一十')) {
    result = result.slice(1);
  }

  return result;
};

/**
 * @func sumAverage
 * @param {number[]} numberArr
 * @return {number}
 * @desc 计算数组平均值
 * @example sumAverage([1,2,3,4,5]) // 3
 */
export const sumAverage = (numberArr: number[]): number => {
  return numberArr.reduce((acc, curr) => acc + curr, 0) / numberArr.length;
};

/**
 * @func getDistance
 * @param {object} point1
 * @param {object} point2
 * @returns {number} 距离
 * @desc 计算两坐标点之间的距离
 * @example getDistance({x:1,y:2},{x:3,y:4}) // 2.8284271247461903
 */
interface Point {
  x: number;
  y: number;
}
export const getDistance = (point1: Point, point2: Point): number => {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
