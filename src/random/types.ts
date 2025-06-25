/**
 * @enum RandType
 * @desc   随机字符串生成时的字符类型掩码枚举，用于指定包含哪些字符类别
 * @property {number} CAPITAL   - 大写字母（A-Z）
 * @property {number} LOWERCASE - 小写字母（a-z）
 * @property {number} SPECIAL   - 特殊字符（如 .@$!%*#_~?&^）
 * @property {number} NUMBER    - 数字字符（0-9）
 * @example
 * // 生成包含大写字母和数字的字符串
 * const mode = RandType.CAPITAL | RandType.NUMBER
 */
export enum RandType {
  CAPITAL = 1 << 0,
  LOWERCASE = 1 << 1,
  SPECIAL = 1 << 2,
  NUMBER = 1 << 3,
}

/**
 * @typedef {number} Numerical
 * @desc   数值类型别名，表示数字
 */
export type Numerical = number;
