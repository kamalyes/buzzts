import { randInt } from './number';
import { HEX_CHARS, HEX_PATTERN } from './ascii';

/**
 * 生成随机整数，包含min，不包含max
 * @param min
 * @param max
 */
function randIntInclusive(min: number, max: number): number {
  return randInt(min, max + 1);
}

/**
 * @func randColorRGB
 * @param rRange 红色通道范围，默认0~255
 * @param gRange 绿色通道范围，默认0~255
 * @param bRange 蓝色通道范围，默认0~255
 * @return {string} RGB颜色字符串
 * @desc 生成随机RGB颜色，支持指定区间范围
 */
export function randColorRGB(
  rRange: [number, number] = [0, 255],
  gRange: [number, number] = [0, 255],
  bRange: [number, number] = [0, 255],
): string {
  const r = randIntInclusive(rRange[0], rRange[1]);
  const g = randIntInclusive(gRange[0], gRange[1]);
  const b = randIntInclusive(bRange[0], bRange[1]);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * @func randColorCMYK
 * @param cRange 青色通道范围，默认0~100
 * @param mRange 品红通道范围，默认0~100
 * @param yRange 黄色通道范围，默认0~100
 * @param kRange 黑色通道范围，默认0~100
 * @return {string} CMYK颜色字符串
 * @desc 生成随机CMYK颜色，支持指定区间范围
 */
export function randColorCMYK(
  cRange: [number, number] = [0, 100],
  mRange: [number, number] = [0, 100],
  yRange: [number, number] = [0, 100],
  kRange: [number, number] = [0, 100],
): string {
  const c = randIntInclusive(cRange[0], cRange[1]);
  const m = randIntInclusive(mRange[0], mRange[1]);
  const y = randIntInclusive(yRange[0], yRange[1]);
  const k = randIntInclusive(kRange[0], kRange[1]);
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
}

/**
 * @func randColorHSL
 * @param hRange 色调范围，默认0~360
 * @param sRange 饱和度范围，默认0~100
 * @param lRange 亮度范围，默认0~100
 * @return {string} HSL颜色字符串
 * @desc 生成随机HSL颜色，支持指定区间范围
 */
export function randColorHSL(
  hRange: [number, number] = [0, 360],
  sRange: [number, number] = [0, 100],
  lRange: [number, number] = [0, 100],
): string {
  const h = randIntInclusive(hRange[0], hRange[1]);
  const s = randIntInclusive(sRange[0], sRange[1]);
  const l = randIntInclusive(lRange[0], lRange[1]);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * @func randColorHEX
 * @param length 生成的HEX字符串长度，默认6
 * @param customHexChars 自定义16进制字符集，默认 "0123456789ABCDEF"
 * @return {string} 随机HEX颜色字符串
 * @desc 生成随机HEX颜色字符串，长度和字符集可控
 */
export function randColorHEX(length = 6, customHexChars?: string): string {
  if (length <= 0) throw new Error('length must be positive');
  const chars = customHexChars ?? HEX_CHARS;
  if (!chars || chars.length === 0) throw new Error('customHexChars cannot be empty');
  if (!HEX_PATTERN.test(chars)) throw new Error('customHexChars must be hex digits only');
  let color = '#';
  for (let i = 0; i < length; i++) {
    color += chars.charAt(randInt(0, chars.length - 1));
  }
  return color;
}

/**
 * @func randColorHexShort
 * @param {string} hex HEX字符串长度，默认0123456789abcdef
 * @return {string} 三位短HEX颜色字符串，如"#abc"
 * @example randHexColorShort() // "#3fa"
 * @desc   生成短格式HEX颜色字符串
 */
export function randColorHexShort(hex = '0123456789abcdef') {
  return '#' + Array.from({ length: 3 }, () => hex.charAt(Math.floor(Math.random() * hex.length))).join('');
}
