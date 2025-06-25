/**
 * @func isFunction
 * @desc 判断是否为函数
 * @param {any} val - 任意值
 * @return {boolean} 是否函数
 * @example
 * isFunction(() => {}) // true
 * isFunction(function() {}) // true
 * isFunction({}) // false
 */
export function isFunction(val: any): val is Function {
  return typeof val === 'function';
}

/**
 * @func isArray
 * @desc 判断是否为数组
 * @param {any} val - 任意值
 * @return {boolean} 是否数组
 * @example
 * isArray([]) // true
 * isArray([1, 2]) // true
 * isArray('') // false
 * isArray({}) // false
 */
export function isArray(val: any): val is any[] {
  return Array.isArray(val);
}

/**
 * @func isObject
 * @desc 判断是否为普通对象（非 null，非数组）
 * @param {any} val - 任意值
 * @return {boolean} 是否普通对象
 * @example
 * isObject({}) // true
 * isObject(null) // false
 * isObject([]) // false
 */
export function isObject(val: any): val is object {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}
