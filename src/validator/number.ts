export interface NumberCheckOptions {
  allowPositiveSign?: boolean; // 是否允许正号 '+', 默认 true
  allowNegativeSign?: boolean; // 是否允许负号 '-', 默认 true
  minIntegerLength?: number; // 整数部分最小长度，默认1
  maxIntegerLength?: number; // 整数部分最大长度，默认不限
  allowDecimal?: boolean; // 是否允许小数，默认 false
  minDecimalLength?: number; // 小数部分最小长度，默认0
  maxDecimalLength?: number; // 小数部分最大长度，默认0
  allowNoIntegerPart?: boolean; // 是否允许无整数部分（如 .55），默认 false
  nonZeroStart?: boolean; // 整数部分是否必须非零开头，默认 true
}

/**
 * @func isNumberWithRules
 * @param {string} str - 待校验字符串
 * @param {NumberCheckOptions} options - 配置项对象
 * @param {boolean} [options.allowPositiveSign=true] - 是否允许正号 '+'
 * @param {boolean} [options.allowNegativeSign=true] - 是否允许负号 '-'
 * @param {number} [options.minIntegerLength=1] - 整数部分最小长度
 * @param {number} [options.maxIntegerLength] - 整数部分最大长度，默认不限
 * @param {boolean} [options.allowDecimal=false] - 是否允许小数
 * @param {number} [options.minDecimalLength=0] - 小数部分最小长度
 * @param {number} [options.maxDecimalLength=0] - 小数部分最大长度
 * @param {boolean} [options.allowNoIntegerPart=false] - 是否允许无整数部分（如 .55）
 * @param {boolean} [options.nonZeroStart=true] - 整数部分是否必须非零开头
 * @return {boolean} 是否是符合规则的数字字符串（整数或浮点数）
 * @example
 *   isNumberWithRules("123", { allowDecimal: false }) // true
 * @example
 *   isNumberWithRules("+123.55", { allowDecimal: true, maxDecimalLength: 2 }) // true
 * @example
 *   isNumberWithRules(".55", { allowDecimal: true, allowNoIntegerPart: true, maxDecimalLength: 2 }) // true
 * @example
 *   isNumberWithRules(".55", { allowDecimal: true, allowNoIntegerPart: false }) // false
 * @desc 校验字符串是否为符合指定整数和小数位数规则的数字，支持符号、整数长度、小数长度、无整数部分等配置
 */
export function isNumberWithRules(str: string, options: NumberCheckOptions = {}): boolean {
  const {
    allowPositiveSign = true,
    allowNegativeSign = true,
    minIntegerLength = 1,
    maxIntegerLength,
    allowDecimal = false,
    minDecimalLength = 0,
    maxDecimalLength,
    allowNoIntegerPart = false,
    nonZeroStart = true,
  } = options;

  // 简单校验参数合法性
  if (minIntegerLength < 0 || (maxIntegerLength !== undefined && maxIntegerLength < minIntegerLength))
    throw new Error('整数部分长度配置错误');
  if (minDecimalLength < 0 || (maxDecimalLength !== undefined && maxDecimalLength < minDecimalLength))
    throw new Error('小数部分长度配置错误');
  if (!allowDecimal && (minDecimalLength > 0 || (maxDecimalLength ?? 0) > 0))
    throw new Error('不允许小数时，小数位数应为0');

  // 1. 符号部分
  const signChars = [allowPositiveSign ? '\\+' : '', allowNegativeSign ? '-' : ''].filter(Boolean).join('');
  const signPart = signChars ? `[${signChars}]?` : '';

  // 2. 整数部分
  const intLenRange =
    maxIntegerLength !== undefined ? `{${minIntegerLength},${maxIntegerLength}}` : `{${minIntegerLength},}`;
  const integerPart = nonZeroStart
    ? minIntegerLength === 1 && maxIntegerLength === 1
      ? '[1-9]'
      : `[1-9]\\d${
          maxIntegerLength !== undefined
            ? `{${Math.max(0, minIntegerLength - 1)},${maxIntegerLength - 1}}`
            : `{${Math.max(0, minIntegerLength - 1)},}`
        }`
    : `\\d${intLenRange}`;

  // 3. 小数部分
  const decimalPart = allowDecimal ? `(\\.\\d{${minDecimalLength},${maxDecimalLength ?? ''}})` : '';

  // 4. 主体
  const mainPart =
    allowNoIntegerPart && allowDecimal
      ? `(${integerPart}${decimalPart}|${decimalPart})`
      : `${integerPart}${decimalPart}`;

  // 5. 组合正则
  const regex = new RegExp(`^${signPart}${mainPart}$`);
  return regex.test(str);
}
