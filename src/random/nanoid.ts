// import { nanoid } from 'nanoid'
// 不要重复造轮子，要学会使用
// 特点：130 bytes，它比 UUID 快 60%
// https://github.com/ai/nanoid/blob/main/README.zh-CN.md
// const uuid = nanoid()
// 该字母表使用 `A-Za-z0-9_-` 符号，字符顺序经过优化以提升 gzip 和 brotli 压缩效果。

const scopedUrlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

const POOL_SIZE_MULTIPLIER = 128;

let pool: Uint8Array | null = null;
let poolOffset = 0;

/**
 * 填充随机池，确保有足够的随机字节可用
 * @param bytes 需要的随机字节数
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
 * 获取指定字节数的随机值
 * @param bytes 需要的随机字节数
 * @returns 返回随机字节的子数组
 */
export function random(bytes: number): Uint8Array {
  bytes |= 0;
  fillPool(bytes);
  return pool!.subarray(poolOffset - bytes, poolOffset);
}

/**
 * 生成自定义字母表的随机ID生成器
 * @param alphabet 字母表字符串
 * @param defaultSize 默认ID长度
 * @param getRandom 获取随机字节的函数
 * @returns 返回一个生成指定长度ID的函数
 */
export function customRandom(alphabet: string, defaultSize: number, getRandom: (bytes: number) => Uint8Array) {
  // 计算掩码，使随机字节映射到字母表范围内
  const mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;

  // 计算每次生成多少随机字节，避免频繁系统调用
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
 * 使用默认随机函数和自定义字母表生成 ID
 * @param alphabet 字母表字符串
 * @param size 生成 ID 长度，默认21
 * @returns 生成的随机 ID
 */
export const customAlphabet = (alphabet: string, size = 21) => customRandom(alphabet, size, random);

/**
 * 生成默认字母表的随机 ID
 * @param size 生成 ID 长度，默认21
 * @returns 生成的随机 ID
 */
export function nanoid(size = 21): string {
  size |= 0;
  fillPool(size);
  let id = '';
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += scopedUrlAlphabet[pool![i] & 63];
  }
  return id;
}
