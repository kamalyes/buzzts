import { randInt } from './int';

/**
 * @function normalizeRange
 * @param {number} min - 区间的起始值
 * @param {number} max - 区间的结束值
 * @returns {number[]} 返回一个包含区间内所有整数的数组，保证从小到大排列
 * @example
 * normalizeRange(1, 3) // [1, 2, 3]
 * normalizeRange(3, 1) // [1, 2, 3]
 * @description
 * 该函数接收两个数字作为区间边界，自动规范顺序后，返回该区间内所有整数的数组。
 */
export function normalizeRange(min: number, max: number): number[] {
  const [start, end] = min > max ? [max, min] : [min, max];
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}
