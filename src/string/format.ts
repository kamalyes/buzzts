/**
 * 将字符串首字母大写
 * @param input 输入字符串
 * @returns 首字母大写的字符串
 * @example
 * capitalizeFirstLetter('hello') => 'Hello'
 * capitalizeFirstLetter('你好') => '你好'
 */
export const capitalizeFirstLetter = (input: string): string => {
  if (typeof input !== 'string' || input.length === 0) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
};

/**
 * @desc 驼峰命名转蛇形命名
 * @param camelCaseStr 驼峰命名字符串
 * @param options 配置选项
 * @param options.keepUnderscorePrefix 是否保留前导下划线，默认为false
 * @returns 蛇形命名字符串
 * @example
 * camelToSnake('userName') => 'user_name'
 * camelToSnake('_internalData', { keepUnderscorePrefix: true }) => '_internal_data'
 */
export const camelToSnake = (camelCaseStr: string, options: { keepUnderscorePrefix?: boolean } = {}): string => {
  const { keepUnderscorePrefix = false } = options;
  if (typeof camelCaseStr !== 'string') return '';

  // 处理连续大写字母（如 XML -> xml）
  let result = camelCaseStr
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2') // 处理连续大写后跟小写
    .replace(/([a-z])([A-Z])/g, '$1_$2') // 处理驼峰部分
    .toLowerCase();

  // 保留前导下划线
  if (keepUnderscorePrefix && camelCaseStr.startsWith('_')) {
    result = '_' + result.replace(/^_/, '');
  } else {
    result = result.replace(/^_/, '');
  }

  return result;
};

/**
 * @desc 蛇形命名转驼峰命名
 * @param snakeCaseStr 蛇形命名字符串
 * @param options 配置选项
 * @param options.pascalCase 是否转换为帕斯卡命名，默认为false
 * @returns 驼峰命名字符串
 * @example
 * snakeToCamel('user_name') => 'userName'
 * snakeToCamel('user_name', { pascalCase: true }) => 'UserName'
 */
export const snakeToCamel = (snakeCaseStr: string, options: { pascalCase?: boolean } = {}): string => {
  const { pascalCase = false } = options;
  if (typeof snakeCaseStr !== 'string') return '';

  const result = snakeCaseStr.replace(/(?:^|_)([a-z])/g, (_, c) => c.toUpperCase());
  return pascalCase ? result : result.charAt(0).toLowerCase() + result.slice(1);
};

/**
 * @desc 转换为常量命名（全大写下划线）
 * @param str 输入字符串
 * @param options 配置选项
 * @param options.preserveNull 输入非字符串时是否返回原值，默认为false
 * @returns 常量命名字符串
 * @example
 * toConstantCase('userName') => 'USER_NAME'
 * toConstantCase('  extra  spaces  ') => 'EXTRA_SPACES'
 */
/**
 * @desc 转换为常量命名（全大写下划线）
 * @param str 输入字符串
 * @param options 配置选项
 * @param options.preserveNull 输入非字符串时是否返回原值，默认为false
 * @returns 常量命名字符串
 * @example
 * toConstantCase('userName') => 'USER_NAME'
 * toConstantCase('already_CONSTANT') => 'ALREADY_CONSTANT'
 * toConstantCase('  extra  spaces  ') => 'EXTRA_SPACES'
 */
export const toConstantCase = (str: string | null, options: { preserveNull?: boolean } = {}): string | null => {
  const { preserveNull = false } = options;
  if (typeof str !== 'string') return preserveNull ? str : '';

  // 如果已经是常量命名格式（全大写+下划线），直接返回
  if (/^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/.test(str)) {
    return str;
  }

  // 其他情况：统一处理
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // 驼峰转下划线（userName → user_Name）
    .replace(/[ -]+/g, '_') // 空格/连字符转下划线
    .toUpperCase() // 全大写
    .replace(/_+/g, '_') // 合并连续下划线
    .replace(/^_+|_+$/g, ''); // 去除首尾下划线
};

/**
 * @desc 驼峰命名转空格命名
 * @param camelCaseStr 驼峰命名字符串
 * @param options 配置选项
 * @param options.capitalize 是否首字母大写，默认为false
 * @returns 空格分隔的字符串
 * @example
 * camelToSpace('A') => 'a'
 * camelToSpace('UserName', { capitalize: true }) => 'User name'
 */
export const camelToSpace = (camelCaseStr: string, options: { capitalize?: boolean } = {}): string => {
  const { capitalize = false } = options;
  if (typeof camelCaseStr !== 'string') return '';

  // 添加空格并转小写，然后去除首尾空格
  let result = camelCaseStr
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();

  // 处理首字母大写
  if (capitalize && result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
};

/**
 * 加密手机号中间部分
 * @param phoneNumber 手机号码(字符串或数字)
 * @param options 配置选项
 * @param options.maskChar 替换字符，默认为'*'
 * @param options.maskLength 替换长度，默认为4
 * @returns 加密后的手机号
 * @example
 * maskPhoneNumber('13812345678') => '138****5678'
 * maskPhoneNumber(13812345678, { maskChar: '#', maskLength: 6 }) => '138######78'
 */
export const maskPhoneNumber = (
  phoneNumber: string | number,
  options: { maskChar?: string; maskLength?: number } = {},
): string => {
  const { maskChar = '*', maskLength = 4 } = options;
  const phoneStr = String(phoneNumber).trim();

  if (!/^1[3-9]\d{9}$/.test(phoneStr)) {
    console.warn('Invalid phone number format');
    return phoneStr;
  }

  // 前段保留位数（固定前3位）
  const prefixLength = 3;
  // 实际需要加密的位数（不能超过剩余位数）
  const actualMaskLength = Math.min(maskLength, phoneStr.length - prefixLength);

  return (
    phoneStr.substring(0, prefixLength) +
    maskChar.repeat(actualMaskLength) +
    phoneStr.substring(prefixLength + actualMaskLength)
  );
};

/**
 * 智能截断字符串
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param options 配置选项
 * @param options.ellipsis 省略符号，默认为'...'
 * @param options.keepWords 是否保持单词完整，默认为true
 * @returns 截断后的字符串
 * @example
 * truncateText('Hello world', 8) => 'Hello...'
 * truncateText('Hello world', 6, { keepWords: false }) => 'Hello ...'
 */
export const truncateText = (
  text: string,
  maxLength: number,
  options: { ellipsis?: string; keepWords?: boolean } = {},
): string => {
  const { ellipsis = '...', keepWords = true } = options;
  if (typeof text !== 'string' || text.length <= maxLength) return text;

  if (keepWords) {
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + ellipsis : truncated + ellipsis;
  }

  return text.substring(0, maxLength) + ellipsis;
};
