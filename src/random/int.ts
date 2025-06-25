// 随机整数、浮点数相关函数

/**
 * @func randInt
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（不包含）
 * @return {number} 介于[min, max)之间的随机整数
 * @example randInt(1, 10) // 可能返回 3
 * @desc   生成指定范围内的随机整数
 */
export function randInt(min: number, max: number): number {
  if (max === min) return min;
  if (max < min) [min, max] = [max, min];
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @func randFloat
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @return {number} 介于[min, max)之间的随机浮点数
 * @example randFloat(0, 1) // 0.123456
 * @desc   生成指定范围内的随机浮点数
 */
export function randFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
