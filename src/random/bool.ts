import { randInt } from './number';

/**
 * @func randBool
 * @return {boolean} 随机布尔值
 * @example randBool() // true
 * @desc   生成随机布尔值，概率均等
 */
export function randBool(): boolean {
  return randInt(0, 2) === 0;
}

/**
 * @func randBoolWeighted
 * @param {number} [p=0.5] - 返回true的概率，范围0~1
 * @return {boolean}
 * @desc 根据概率p生成随机布尔值，默认均等概率
 * @example randBoolWeighted(0.8) // 80%几率返回true
 */
export function randBoolWeighted(p = 0.5): boolean {
  if (p <= 0) return false;
  if (p >= 1) return true;
  return Math.random() < p;
}

/**
 * @func randBernoulli
 * @param {number} p - 事件发生概率，0~1之间
 * @return {boolean} 随机布尔值，true概率为p
 * @example randBernoulli(0.7) // true 或 false
 * @desc   根据伯努利分布生成布尔值，true概率为p
 */
export function randBernoulli(p: number) {
  return Math.random() < p;
}

/**
 * @func randPoisson
 * @param {number} lambda - 泊松分布参数，平均事件数
 * @return {number} 泊松分布随机数
 * @example randPoisson(3) // 0,1,2,3,4等
 * @desc   生成符合泊松分布的随机整数
 */
export function randPoisson(lambda: number) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

/**
 * @func randExponential
 * @param {number} lambda - 指数分布参数，正数
 * @return {number} 指数分布随机数
 * @example randExponential(1.5) // 0 ~ ∞
 * @desc   生成符合指数分布的随机数
 */
export function randExponential(lambda: number) {
  return -Math.log(1 - Math.random()) / lambda;
}

/**
 * @func randBinomial
 * @param {number} n - 试验次数
 * @param {number} p - 单次成功概率
 * @return {number} 二项分布随机数
 * @example randBinomial(10, 0.5) // 0~10之间整数
 * @desc   生成符合二项分布的随机数
 */
export function randBinomial(n: number, p: number) {
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < p) count++;
  }
  return count;
}
