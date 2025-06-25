/**
 * @func typeasy
 * @desc 基础数据类型检测工具（支持 15+ 常见类型识别）
 * @param {any} data - 需要检测类型的值
 * @returns {string} 返回全小写的类型字符串
 * @example
 * // 基础类型检测
 * typeasy(null)        // 'null'
 * typeasy(undefined)   // 'undefined'
 * typeasy(42)          // 'number'
 * typeasy(NaN)         // 'nan'
 * typeasy(Infinity)    // 'infinity'
 * typeasy(-0)          // 'negative-zero'
 *
 * // 引用类型检测
 * typeasy([])          // 'array'
 * typeasy({})          // 'object'
 * typeasy(/regex/)     // 'regexp'
 * typeasy(new Date())  // 'date'
 * typeasy(() => {})    // 'function'
 */
function typeasy(data: unknown): string {
  if (data === null) return 'null';
  // 1. 优先处理 null 和 undefined
  if (data === null) return 'null';
  if (data === undefined) return 'undefined';

  // 2. 处理标准原始类型（typeof 能识别的类型）
  const type = typeof data;
  if (type !== 'object' && type !== 'function') {
    // 特殊数字类型处理
    if (type === 'number') {
      if (isNaN(data as number)) return 'nan'; // NaN 检测
      if (!isFinite(data as number)) return 'infinity'; // 无穷大检测
      if (Object.is(data, -0)) return 'negative-zero'; // -0 检测
    }
    return type; // 常规原始类型直接返回
  }

  // 3. 处理函数类型（typeof function === 'function'）
  // 增强的类和函数检测
  if (type === 'function') {
    // 类型断言确保 data 是函数类型
    const func = data as Function;
    // 更安全的类检测方法
    const isClass =
      'prototype' in func &&
      func.prototype &&
      func.prototype.constructor === func &&
      Function.prototype.toString.call(func).startsWith('class ');
    return isClass ? 'class' : 'function';
  }

  // 4. 处理数组（优先于对象检测）
  if (Array.isArray(data)) return 'array';

  // 5. 使用 Object.prototype.toString 获取精确类型
  const objType = Object.prototype.toString
    .call(data)
    .slice(8, -1) // 截取 [object Type] 中的 Type 部分
    .toLowerCase(); // 统一转为小写

  // 6. 常见内置对象类型映射
  switch (objType) {
    // JavaScript 核心对象
    case 'regexp':
      return 'regexp'; // 正则表达式
    case 'date':
      return 'date'; // 日期对象
    case 'error':
      return 'error'; // 错误对象
    case 'map':
      return 'map'; // Map 集合
    case 'set':
      return 'set'; // Set 集合
    case 'weakmap':
      return 'weakmap'; // WeakMap
    case 'weakset':
      return 'weakset'; // WeakSet
    case 'promise':
      return 'promise'; // Promise 对象
  }
  // 7. 默认返回 object 类型
  return 'object';
}

/**
 * @func typeasy.is
 * @desc 精确类型验证工具
 * @param {any} data - 要检测的值
 * @param {string} type - 预期的类型字符串
 * @returns {boolean} 类型是否匹配
 * @example
 * typeasy.is([], 'array')        // true
 * typeasy.is(new Date(), 'date') // true
 */
typeasy.is = (data: unknown, type: string): boolean => typeasy(data) === type;

/**
 * @func typeasy.isPrimitive
 * @desc 检测是否为原始类型（非引用类型）
 * @param {any} data - 要检测的值
 * @returns {boolean} 是否为原始类型
 * @example
 * typeasy.isPrimitive(42)       // true (number 是原始类型)
 * typeasy.isPrimitive({})       // false (object 是引用类型)
 */
typeasy.isPrimitive = (data: unknown): boolean => {
  const type = typeasy(data);
  return [
    'null',
    'undefined', // 特殊原始类型
    'number',
    'nan',
    'infinity',
    'negative-zero', // 数字类型
    'string',
    'boolean', // 基本类型
    'symbol',
    'bigint', // ES6+ 新增类型
  ].includes(type);
};

export default typeasy;
