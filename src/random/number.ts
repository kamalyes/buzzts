/**
 * @func randInt
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（不包含）
 * @return {number} 介于[min, max)之间的随机整数
 * @example
 *   randInt(1, 10)    // 正数范围，可能返回 3
 *   randInt(-5, 5)    // 跨零范围，可能返回 -2
 *   randInt(-10, -1)  // 负数范围，可能返回 -7
 * @desc 生成指定范围内的随机整数（支持正数、负数和跨零范围）
 */
export function randInt(min: number, max: number): number {
  // 处理相等情况
  if (max === min) return min;

  // 自动交换大小值（支持反向参数）
  if (max < min) [min, max] = [max, min];

  // 特殊处理间隔为1的情况
  if (max - min === 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 计算范围时考虑负数情况
  const range = max - min;
  return Math.floor(Math.random() * range) + min;
}

/**
 * @func randFloat
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {number} [precision=16] - 小数位数 (默认16位)
 * @return {number} 介于[min, max)之间的高精度随机浮点数
 * @example
 *   randFloat(0, 1)        // 正数范围：0.1234567890123456
 *   randFloat(-1, 1)       // 跨零范围：-0.4567890123456789
 *   randFloat(-2.5, -1.5)  // 负数范围：-1.8765432109876543
 *   randFloat(0.1, 0.2, 8) // 指定精度：0.12345678
 * @desc 生成指定范围内的高精度随机浮点数（支持正数、负数和跨零范围）
 */
export function randFloat(min: number, max: number, precision: number = 16): number {
  // 验证精度参数
  if (precision < 0 || precision > 16) {
    throw new Error('Precision must be between 0 and 16');
  }

  // 处理相等情况
  if (max === min) return parseFloat(min.toFixed(precision));

  // 自动交换大小值（支持反向参数）
  if (max < min) [min, max] = [max, min];

  // 生成高精度随机数（自动处理正负数）
  let random;
  do {
    // 生成更均匀分布的随机数
    random = min + Math.random() * (max - min);
  } while (random >= max); // 确保不会等于max

  // 处理精度
  return parseFloat(random.toFixed(precision));
}

/**
 * @func randPositiveInt
 * @param {number} min - 最小正整数（包含）
 * @param {number} max - 最大正整数（不包含）
 * @return {number} 介于[min, max)之间的随机正整数
 * @throws 如果参数不是正数
 * @example randPositiveInt(1, 10) // 可能返回 3
 * @desc 专门生成正整数范围内的随机整数
 */
export function randPositiveInt(min: number, max: number): number {
  if (min <= 0 || max <= 0) {
    throw new Error('Parameters must be positive numbers');
  }
  return randInt(min, max);
}

/**
 * @func randPositiveFloat
 * @param {number} min - 最小正数
 * @param {number} max - 最大正数
 * @param {number} [precision=16] - 小数位数
 * @return {number} 介于[min, max)之间的随机正浮点数
 * @throws 如果参数不是正数
 * @example randPositiveFloat(0.1, 1.5) // 可能返回 0.3456789012345678
 * @desc 专门生成正数范围内的随机浮点数
 */
export function randPositiveFloat(min: number, max: number, precision: number = 16): number {
  if (min <= 0 || max <= 0) {
    throw new Error('Parameters must be positive numbers');
  }
  return randFloat(min, max, precision);
}

/**
 * @func randAngle
 * @return {number} 0~360度随机角度
 * @example randAngle() // 123.45
 * @desc   生成0~360度的随机角度
 */
export function randAngle() {
  return Math.random() * 360;
}

/**
 * @func randCirclePointInside
 * @param {number} radius - 圆半径
 * @return {{x:number,y:number}} 圆内随机点坐标
 * @example randCirclePointInside(10) // {x:3.2, y:-4.5}
 * @desc   生成圆内均匀分布的随机点
 */
export function randCirclePointInside(radius: number) {
  const t = 2 * Math.PI * Math.random();
  const r = radius * Math.sqrt(Math.random());
  return {
    x: r * Math.cos(t),
    y: r * Math.sin(t),
  };
}
