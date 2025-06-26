import { ALPHA_BYTES } from './ascii';

/**
 * @const POOL_SIZE_MULTIPLIER
 * @desc   随机池大小的倍数，用于预分配足够的随机字节，提升性能
 */
const POOL_SIZE_MULTIPLIER = 128;

/**
 * @var pool
 * @desc  预分配的随机字节池，使用 Uint8Array 存储
 */
let pool: Uint8Array | null = null;

/**
 * @var poolOffset
 * @desc  当前随机池的使用偏移量，指示下一个可用随机字节的位置
 */
let poolOffset = 0;

/**
 * @var lastNanoTime
 * @desc  上一次的纳秒
 */
let lastNanoTime = 0;

/**
 * @func fillPool
 * @param {number} bytes - 需要的随机字节数
 * @return {void}
 * @desc   填充随机池，确保有足够的随机字节可用
 */
function fillPool(bytes: number) {
  if (!pool || pool.length < bytes) {
    pool = new Uint8Array(bytes * POOL_SIZE_MULTIPLIER);
    crypto.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    crypto.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}

/**
 * @func random
 * @param {number} bytes - 需要的随机字节数
 * @return {Uint8Array} 返回随机字节的子数组
 * @desc   获取指定字节数的随机值
 * @example
 * const buf = random(10); // Uint8Array(10)
 */
export function random(bytes: number): Uint8Array {
  bytes |= 0;
  fillPool(bytes);
  return pool!.subarray(poolOffset - bytes, poolOffset);
}

/**
 * @func customRandom
 * @param {string} alphabet - 字母表字符串
 * @param {number} defaultSize - 默认ID长度
 * @param {(bytes: number) => Uint8Array} getRandom - 获取随机字节的函数
 * @return {(size?: number) => string} 返回一个生成指定长度ID的函数
 * @desc   生成自定义字母表的随机ID生成器
 * @example
 * const generate = customRandom('abc123', 5, random);
 * console.log(generate()); // 例如: "a1b2c"
 */
export function customRandom(alphabet: string, defaultSize: number, getRandom: (bytes: number) => Uint8Array) {
  const mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
  const step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length);

  return (size = defaultSize): string => {
    let id = '';
    while (true) {
      const bytes = getRandom(step);
      for (let i = 0; i < step; i++) {
        id += alphabet[bytes[i] & mask] || '';
        if (id.length >= size) return id;
      }
    }
  };
}

/**
 * @func customAlphabet
 * @param {string} alphabet - 字母表字符串
 * @param {number} [size=21] - 生成 ID 长度，默认21
 * @return {(size?: number) => string} 生成指定长度的随机 ID 函数
 * @desc   使用默认随机函数和自定义字母表生成 ID
 * @example
 * const generate = customAlphabet('abc123');
 * console.log(generate(10)); // 例如: "a1b2c3a1b2"
 */
export const customAlphabet = (alphabet: string, size = 21) => customRandom(alphabet, size, random);

/**
 * @func nanoid
 * @param {number} [size=21] - 生成 ID 的长度，默认21
 * @param {string} [alphabet=ALPHA_BYTES] - 用于生成 ID 的字母表，默认使用 ALPHA_BYTES
 * @return {string} 生成的随机 ID 字符串
 * @desc
 * 生成随机 ID，基于纳秒时间戳和随机数的异或混合，
 * 保证时间戳单调递增以防止时间回拨导致重复，
 * 支持自定义字母表和长度。
 * @example
 * nanoid(); // 使用默认长度和字母表生成 ID
 * nanoid(10, '0123456789ABCDEF'); // 使用自定义长度和字母表生成 ID
 */
export function nanoid(size = 21, alphabet = ALPHA_BYTES): string {
  size |= 0;
  let id = '';
  const alphabetLength = alphabet.length;
  // 负数要加保护
  const mask = Math.max((2 << (31 - Math.clz32(Math.max(alphabetLength - 1, 0)))) - 1, 0);

  let nanoTime: number;
  if (typeof process !== 'undefined' && process.hrtime) {
    nanoTime = Number(process.hrtime.bigint() % BigInt(Number.MAX_SAFE_INTEGER));
  } else if (typeof performance !== 'undefined' && performance.now) {
    nanoTime = Math.floor(performance.now() * 1e6);
  } else {
    nanoTime = Date.now() * 1e6;
  }

  // 保证时间戳单调递增，防止时间回拨
  if (nanoTime <= lastNanoTime) {
    nanoTime = lastNanoTime + 1;
  }
  lastNanoTime = nanoTime;

  for (let i = 0; i < size; i++) {
    const timePart = (nanoTime >> i) & mask;
    const randPart = Math.floor(Math.random() * (mask + 1));
    const index = (timePart ^ randPart) % alphabetLength;
    id += alphabet[index];
  }

  return id;
}
