/**
 * @func isUndefined
 * @desc 判断是否为 undefined
 * @param {any} val - 任意值
 * @return {boolean} 是否 undefined
 * @example
 * isUndefined(undefined) // true
 * isUndefined(null) // false
 */
export function isUndefined(val: any): val is undefined {
  return val === undefined;
}

/**
 * @func isNull
 * @desc 判断是否为 null
 * @param {any} val - 任意值
 * @return {boolean} 是否 null
 * @example
 * isNull(null) // true
 * isNull(undefined) // false
 */
export function isNull(val: any): val is null {
  return val === null;
}

/**
 * @func isNil
 * @desc 判断是否为 null 或 undefined
 * @param {any} val - 任意值
 * @return {boolean} 是否 null 或 undefined
 * @example
 * isNil(null) // true
 * isNil(undefined) // true
 * isNil('') // false
 */
export function isNil(val: any): val is null | undefined {
  return val === null || val === undefined;
}

/**
 * @func isBoolean
 * @desc 判断是否为布尔值
 * @param {any} val - 任意值
 * @return {boolean} 是否布尔值
 * @example
 * isBoolean(true) // true
 * isBoolean(false) // true
 * isBoolean(0) // false
 */
export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean';
}

/**
 * @func isNumber
 * @desc 判断是否为有效数字（非 NaN 和 Infinity）
 * @param {any} val - 任意值
 * @return {boolean} 是否有效数字
 * @example
 * isNumber(123) // true
 * isNumber(NaN) // false
 * isNumber(Infinity) // false
 */
export function isNumber(val: any): val is number {
  return typeof val === 'number' && isFinite(val);
}

/**
 * @func isString
 * @desc 判断是否为字符串
 * @param {any} val - 任意值
 * @return {boolean} 是否字符串
 * @example
 * isString('abc') // true
 * isString('') // true
 * isString(123) // false
 */
export function isString(val: any): val is string {
  return typeof val === 'string';
}

/**
 * @func isSymbol
 * @desc 判断是否为 Symbol 类型
 * @param {any} val - 任意值
 * @return {boolean} 是否 Symbol 类型
 * @example
 * isSymbol(Symbol()) // true
 * isSymbol('abc') // false
 */
export function isSymbol(val: any): val is symbol {
  return typeof val === 'symbol';
}

/**
 * @func isBigInt
 * @desc 判断是否为 BigInt 类型
 * @param {any} val - 任意值
 * @return {boolean} 是否 BigInt 类型
 * @example
 * isBigInt(BigInt(123)) // true
 * isBigInt(123) // false
 */
export function isBigInt(val: any): val is bigint {
  return typeof val === 'bigint';
}

/**
 * @func isEmpty
 * @desc 判断是否为空值（null、undefined、空字符串、空数组、空对象）
 * @param {any} val - 任意值
 * @return {boolean} 是否空值
 * @example
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * isEmpty('') // true
 * isEmpty(' ') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty([1]) // false
 * isEmpty({ a: 1 }) // false
 */
export function isEmpty(val: any): boolean {
  if (val == null) return true;
  if (typeof val === 'string') return val.trim().length === 0;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'object') {
    // 排除所有内置对象
    const typeStr = Object.prototype.toString.call(val);
    if (typeStr !== '[object Object]') {
      return false; // 非普通对象（如 Date、RegExp 等）不算空
    }
    return Object.keys(val).length === 0;
  }
  return false;
}

/**
 * @func getTypeOf
 * @param {unknown} param - 需要判断类型的参数
 * @returns {string} 返回参数的具体类型名称（首字母大写）
 * @desc 获取参数类型，支持基本类型和常见内置对象类型
 * @example
 * getTypeOf('abc') // "String"
 * getTypeOf([]) // "Array"
 * getTypeOf(async function(){}) // "AsyncFunction"
 */
export const getTypeOf = (param: unknown): string => {
  // 利用 Object.prototype.toString 获取类型标签
  const rawType = Object.prototype.toString.call(param).slice(8, -1);

  // 统一首字母大写，其他小写
  return rawType.charAt(0).toUpperCase() + rawType.slice(1);
};

/**
 * 通用匹配函数
 * @param {RegExp} regexp - 正则表达式
 * @param {string} str - 待匹配字符串
 * @return {boolean} 是否匹配
 */
export function match(regexp: RegExp, str: string): boolean {
  return regexp.test(str);
}
