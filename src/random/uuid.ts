/**
 * @func randUUIDv1
 * @return {string} 随机UUID v1字符串（基于时间和随机数）
 * @example randUUIDv1() // "f47ac10b-58cc-11cf-8f0a-0800200c9a66"
 * @desc   生成基于时间的UUID v1，非严格实现，仅模拟效果
 */
export function randUUIDv1() {
  const time = Date.now();
  const timeHex = time.toString(16).padStart(12, '0');
  const randomHex = () =>
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, '0');
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${randomHex().slice(
    1,
  )}-${randomHex()}-${randomHex()}${randomHex()}${randomHex()}`;
}

/**
 * @func randUUIDv4
 * @return {string} 随机UUID v4字符串
 * @example randUUIDv4() // "3f2504e0-4f89-41d3-9a0c-0305e82c3301"
 * @desc   生成符合UUID v4标准的随机字符串
 */
export function randUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
