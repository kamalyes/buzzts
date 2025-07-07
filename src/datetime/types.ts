/**
 * 支持的日期输入类型，可以是 Date 对象、日期字符串或时间戳数字
 *
 * @typedef {Date | string | number} DateInput
 *
 * @example
 * /** @type {DateInput} *\/
 * const d1 = new Date();
 * const d2 = '2023-06-23';
 * const d3 = 1687488000000;
 */
export type DateInput = Date | string | number;
