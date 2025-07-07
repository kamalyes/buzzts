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
  return isNull(val) || isUndefined(val);
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

/**
 * @func isEqual
 * @param {T} x - 需要比较的第一个值
 * @param {T} y - 需要比较的第二个值
 * @param {WeakMap<object, object>} [seen=new WeakMap()] - 内部使用，循环引用检测映射
 * @returns {boolean} 返回两个值是否深度相等
 * @desc
 * 深度比较两个值是否相等，支持基本类型、Date、RegExp、Array、Map、Set、普通对象等。
 * 内部使用 WeakMap 防止循环引用导致的死循环。
 * 函数类型默认认为不相等（除非引用相等）。
 *
 * @example
 * isEqual(1, 1) // true
 * isEqual({ a: 1 }, { a: 1 }) // true
 * isEqual(new Date(123), new Date(123)) // true
 * isEqual([1, 2], [1, 2]) // true
 * isEqual(new Map([['a', 1]]), new Map([['a', 1]])) // true
 * isEqual(new Set([1, 2]), new Set([2, 1])) // true
 * isEqual(() => {}, () => {}) // false
 */
export const isEqual = <T>(x: T, y: T, seen = new WeakMap()): boolean => {
  if (Object.is(x, y)) return true;

  if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
    return false;
  }

  if (seen.has(x)) {
    return seen.get(x) === y;
  }
  seen.set(x, y);

  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }

  if (x instanceof RegExp && y instanceof RegExp) {
    return x.toString() === y.toString();
  }

  if (x instanceof Map && y instanceof Map) {
    if (x.size !== y.size) return false;
    for (const [key, val] of x) {
      if (!y.has(key) || !isEqual(val, y.get(key), seen)) return false;
    }
    return true;
  }

  if (x instanceof Set && y instanceof Set) {
    if (x.size !== y.size) return false;
    for (const val of x) {
      let hasMatch = false;
      for (const yVal of y) {
        if (isEqual(val, yVal, seen)) {
          hasMatch = true;
          break;
        }
      }
      if (!hasMatch) return false;
    }
    return true;
  }

  if (Array.isArray(x) && Array.isArray(y)) {
    if (x.length !== y.length) return false;
    for (let i = 0; i < x.length; i++) {
      if (!isEqual(x[i], y[i], seen)) return false;
    }
    return true;
  }

  if (typeof x === 'function' && typeof y === 'function') {
    return false;
  }

  const keysX = Reflect.ownKeys(x);
  const keysY = Reflect.ownKeys(y);
  if (keysX.length !== keysY.length) return false;

  const keysYSet = new Set(keysY);
  for (const key of keysX) {
    if (!keysYSet.has(key)) return false;
    // @ts-ignore
    if (!isEqual((x as any)[key], (y as any)[key], seen)) return false;
  }

  return true;
};

/**
 * @func deepEqual
 * @param {unknown} a - 第一个值
 * @param {unknown} b - 第二个值
 * @param {WeakMap<object, object>} [seen=new WeakMap()] - 内部使用，循环引用检测映射
 * @returns {boolean} 是否深度相等
 * @desc
 * 深度比较两个值是否相等，支持基本类型、Date、RegExp、Array、Map、Set、普通对象、Symbol 属性等。
 * 通过 WeakMap 支持循环引用检测，防止死循环。
 * 区分不同构造函数的实例。
 * 支持 NaN 相等判断。
 *
 * @example
 * deepEqual(1, 1); // true
 * deepEqual(NaN, NaN); // true
 * deepEqual({ a: 1 }, { a: 1 }); // true
 * deepEqual(new Date(123), new Date(123)); // true
 * deepEqual([1, 2], [1, 2]); // true
 * deepEqual(new Map([['a', 1]]), new Map([['a', 1]])); // true
 * deepEqual(new Set([1, 2]), new Set([2, 1])); // true
 * deepEqual(Symbol('foo'), Symbol('foo')); // false，Symbol 不同实例不相等
 */
export function deepEqual(a: unknown, b: unknown, seen = new WeakMap<object, object>()): boolean {
  if (a === b) return true;

  // 处理 NaN 相等
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
  }

  // 非对象或 null 直接比较
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // 循环引用检测
  if (seen.has(a as object)) {
    return seen.get(a as object) === b;
  }
  seen.set(a as object, b as object);

  // 构造函数不同视为不等
  if ((a as object).constructor !== (b as object).constructor) {
    return false;
  }

  // 处理 Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 处理 RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // 处理 Array
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], seen)) return false;
    }
    return true;
  }

  // 处理 Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a.entries()) {
      if (!b.has(key)) return false;
      if (!deepEqual(val, b.get(key), seen)) return false;
    }
    return true;
  }

  // 处理 Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const val of a.values()) {
      let hasEqual = false;
      for (const bVal of b.values()) {
        if (deepEqual(val, bVal, seen)) {
          hasEqual = true;
          break;
        }
      }
      if (!hasEqual) return false;
    }
    return true;
  }

  // 处理普通对象（包括 Symbol 属性）
  const aKeys = Reflect.ownKeys(a);
  const bKeys = Reflect.ownKeys(b);
  if (aKeys.length !== bKeys.length) return false;

  const bKeysSet = new Set(bKeys);
  for (const key of aKeys) {
    if (!bKeysSet.has(key)) return false;
    // @ts-ignore
    if (!deepEqual((a as any)[key], (b as any)[key], seen)) return false;
  }

  return true;
}

export const isValidJson = (str: string): boolean => {
  if (typeof str !== 'string' || str.trim() === '') {
    return false;
  }

  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
};

/**
 * @func isJsonObject
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否为有效的 JSON 对象或数组格式字符串
 * @desc
 * 判断传入的字符串是否为有效的 JSON 格式，且解析结果必须是对象或数组
 * 该函数会尝试使用 `JSON.parse` 解析字符串，并检查解析结果的类型
 * 空字符串或仅包含空白字符的字符串会返回 false
 *
 * @example
 * isJsonObject('{"a":1}'); // true
 * isJsonObject('[1, 2, 3]'); // true
 * isJsonObject('123'); // false，数字不是对象或数组
 * isJsonObject('true'); // false，布尔值不是对象或数组
 * isJsonObject(''); // false，空字符串不是有效 JSON
 * isJsonObject('abc'); // false，非法 JSON 字符串
 */
export const isJsonObject = (str: string): boolean => {
  if (typeof str !== 'string' || str.trim() === '') {
    return false;
  }

  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
};
