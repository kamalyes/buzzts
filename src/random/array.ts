/**
 * @function rangeWithStep
 * @param {number} start - 区间的起始值
 * @param {number} end - 区间的结束值
 * @param {number} [step=1] - 步长，默认为1，支持正数和负数，且可以是小数
 * @returns {number[]} 返回一个包含区间内所有数字的数组，保证从小到大排列
 * @desc 该函数接收两个数字作为区间边界，自动规范顺序后，返回该区间内所有数字的数组，支持指定步长，兼容浮点数。
 * @example
 * rangeWithStep(1, 3) // [1, 2, 3]
 * rangeWithStep(3, 1) // [1, 2, 3]
 * rangeWithStep(0, 1, 0.2) // [0, 0.2, 0.4, 0.6, 0.8, 1]
 * rangeWithStep(1, 3, 0.5) // [1, 1.5, 2, 2.5, 3]
 * rangeWithStep(3, 1, 0.5) // [1, 1.5, 2, 2.5, 3]
 */
export function rangeWithStep(start: number, end: number, step = 1): number[] {
  if (step <= 0) throw new Error('step 必须为正数');

  const result: number[] = [];
  const [min, max] = start < end ? [start, end] : [end, start];

  // 浮点数精度处理辅助
  const toFixedNumber = (num: number, digits = 12) => Number(num.toFixed(digits));

  for (let val = min; val <= max + 1e-10; val = toFixedNumber(val + step)) {
    result.push(toFixedNumber(val));
  }

  return result;
}

/**
 * @func randUniformArray
 * @param {number} length - 数组长度
 * @param {number} [min=0] - 最小值
 * @param {number} [max=1] - 最大值
 * @return {number[]} 均匀分布随机数组
 * @example randUniformArray(5, 10, 20) // [12.3, 19.8, 10.1, 15.2, 18.9]
 * @desc   生成指定长度，元素在[min,max]均匀分布的随机浮点数组
 */
export function randUniformArray(length: number, min = 0, max = 1) {
  return Array.from({ length }, () => Math.random() * (max - min) + min);
}

/**
 * @func randSelectWeighted
 * @param {any[]} items - 选项数组
 * @param {number[]} weights - 权重数组，长度与items相同
 * @return {any} 根据权重随机选中的元素
 * @example randSelectWeighted(['a','b','c'], [1,3,6]) // 'b'或'c'概率较大
 * @desc   根据权重数组随机选取一个元素
 */
export function randSelectWeighted(items: any[], weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
}

/**
 * @func randSample
 * @param {any[]} array - 源数组
 * @param {number} n - 抽样数量
 * @return {any[]} 随机抽样结果，允许重复
 * @example randSample([1,2,3,4], 2) // [3,1]
 * @desc   从数组中随机抽取n个元素，可能重复
 */
export function randSample(array: any[], n: number) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(array[Math.floor(Math.random() * array.length)]);
  }
  return result;
}

/**
 * @func randUniqueSample
 * @param {any[]} array - 源数组
 * @param {number} n - 抽样数量
 * @return {any[]} 不重复随机抽样结果
 * @example randUniqueSample([1,2,3,4], 3) // [2,4,1]
 * @desc   从数组中随机抽取n个不重复元素，n不得大于数组长度
 */
export function randUniqueSample(array: any[], n: number) {
  if (n > array.length) throw new Error('抽样数量不能大于数组长度');
  const copy = [...array];
  const result = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

/**
 * @func randShuffle
 * @param {any[]} array - 待打乱数组
 * @return {any[]} 打乱后的新数组
 * @example randShuffle([1,2,3,4]) // [3,1,4,2]
 * @desc   对数组进行随机洗牌，返回新数组
 */
export function randShuffle(array: any[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
