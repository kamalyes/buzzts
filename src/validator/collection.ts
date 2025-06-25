/**
 * @func isMap
 * @desc 判断是否为 Map 对象（支持跨窗口检测）
 * @param {any} val - 任意值
 * @return {boolean} 是否 Map 对象
 * @example
 * isMap(new Map()) // true
 * isMap({}) // false
 * isMap(iframe.contentWindow.Map()) // true (跨窗口场景)
 */
export function isMap(val: any): val is Map<any, any> {
  return (
    val != null &&
    typeof val === 'object' &&
    (Object.prototype.toString.call(val) === '[object Map]' ||
      (val[Symbol.toStringTag] === 'Map' &&
        typeof val.set === 'function' &&
        typeof val.get === 'function' &&
        typeof val.delete === 'function' &&
        typeof val.has === 'function' &&
        typeof val.clear === 'function' &&
        'size' in val))
  );
}

/**
 * @func isSet
 * @desc 判断是否为 Set 对象（支持跨窗口检测）
 * @param {any} val - 任意值
 * @return {boolean} 是否 Set 对象
 * @example
 * isSet(new Set()) // true
 * isSet([]) // false
 * isSet(iframe.contentWindow.Set()) // true (跨窗口场景)
 */
export function isSet(val: any): val is Set<any> {
  return (
    val != null &&
    typeof val === 'object' &&
    (Object.prototype.toString.call(val) === '[object Set]' ||
      (val[Symbol.toStringTag] === 'Set' &&
        typeof val.add === 'function' &&
        typeof val.delete === 'function' &&
        typeof val.has === 'function' &&
        typeof val.clear === 'function' &&
        'size' in val))
  );
}

/**
 * @func isWeakMap
 * @desc 判断是否为 WeakMap 对象（支持跨窗口检测）
 * @param {any} val - 任意值
 * @return {boolean} 是否 WeakMap 对象
 * @example
 * isWeakMap(new WeakMap()) // true
 * isWeakMap(new Map()) // false
 * isWeakMap(iframe.contentWindow.WeakMap()) // true (跨窗口场景)
 */
export function isWeakMap(val: any): val is WeakMap<object, any> {
  return (
    val != null &&
    typeof val === 'object' &&
    (Object.prototype.toString.call(val) === '[object WeakMap]' ||
      (val[Symbol.toStringTag] === 'WeakMap' &&
        typeof val.set === 'function' &&
        typeof val.get === 'function' &&
        typeof val.delete === 'function' &&
        typeof val.has === 'function'))
  );
}

/**
 * @func isWeakSet
 * @desc 判断是否为 WeakSet 对象（支持跨窗口检测）
 * @param {any} val - 任意值
 * @return {boolean} 是否 WeakSet 对象
 * @example
 * isWeakSet(new WeakSet()) // true
 * isWeakSet(new Set()) // false
 * isWeakSet(iframe.contentWindow.WeakSet()) // true (跨窗口场景)
 */
export function isWeakSet(val: any): val is WeakSet<object> {
  return (
    val != null &&
    typeof val === 'object' &&
    (Object.prototype.toString.call(val) === '[object WeakSet]' ||
      (val[Symbol.toStringTag] === 'WeakSet' &&
        typeof val.add === 'function' &&
        typeof val.delete === 'function' &&
        typeof val.has === 'function'))
  );
}
