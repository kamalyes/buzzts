/**
 * @func mergeObject
 * @param {object} [source] - 外部的参数对象
 * @param {object} [defaults] - 默认参数对象
 * @desc 深拷贝合并对象，优先使用 source 中的值覆盖 defaults
 * @returns {object} 合并后的新对象
 * @example
 * mergeObject({a:1}, {a:0, b:2}) // {a:1, b:2}
 */
export const mergeObject = (source?: object, defaults?: object): object => {
  // 辅助函数判断是否为普通对象
  const isObj = (val: any): val is object => val !== null && typeof val === 'object' && !Array.isArray(val);

  // 如果 source 不是对象，使用空对象替代
  if (!isObj(source)) source = {};
  // 如果 defaults 不是对象，使用空对象替代
  if (!isObj(defaults)) defaults = {};

  // 先浅拷贝 defaults，避免修改原对象
  const result = { ...defaults };

  for (const key of Object.keys(source)) {
    if (key === '__proto__' || key === 'constructor') {
      // 防止原型污染，跳过危险属性
      continue;
    }

    const sourceVal = (source as any)[key];
    const defaultVal = (defaults as any)[key];

    // 跳过 null 值（如果业务允许合并 null，请删除此判断）
    if (sourceVal === null) {
      continue;
    }

    // 如果 sourceVal 和 defaultVal 都是对象，递归合并
    if (isObj(sourceVal) && isObj(defaultVal)) {
      result[key] = mergeObject(sourceVal, defaultVal);
    } else {
      // 否则直接覆盖
      result[key] = sourceVal;
    }
  }

  return result;
};

/**
 * @typedef {Record<string | symbol, any>} deepCloneObject
 * @description
 * 表示一个深度克隆对象的类型。
 *
 * 该类型可以包含任意数量的属性，属性名可以是字符串或符号。
 * 属性值可以是任意类型，包括基本数据类型、对象、数组、函数等。
 *
 * 使用此类型可以确保在进行深度克隆操作时，能够正确处理各种类型的对象。
 */
export type deepCloneObject = Record<string | symbol, any>;

/**
 * @func deepClone
 * @param {T} obj - 将要复制的对象
 * @param {WeakMap<any, any>} [hash=new WeakMap()] - 用于处理循环引用的哈希表
 * @returns {T} 复制后的对象
 * @desc 深度复制对象，支持循环引用、日期、正则、原型链和属性描述符
 */
export function deepClone<T extends deepCloneObject>(obj: T, hash: WeakMap<any, any> = new WeakMap()): T {
  // 如果是原始类型或函数，直接返回
  if (obj === null || typeof obj !== 'object') return obj;

  // 处理日期对象
  if (obj instanceof Date) return new Date(obj) as any;

  // 处理正则对象
  if (obj instanceof RegExp) return new RegExp(obj) as any;

  // 处理循环引用
  if (hash.has(obj)) return hash.get(obj);

  // 获取对象所有自身属性描述符（包括不可枚举属性和Symbol属性）
  const allDesc = Object.getOwnPropertyDescriptors(obj);

  // 创建新对象，继承原对象的原型
  const cloneObj = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));

  // 记录循环引用
  hash.set(obj, cloneObj);

  // 遍历所有自身属性（包括 Symbol）
  for (const key of Reflect.ownKeys(obj)) {
    const val = obj[key as keyof T]; // 使用类型断言
    // 递归深拷贝对象属性
    if (typeof val === 'object' && val !== null) {
      (cloneObj as deepCloneObject)[key] = deepClone(val, hash);
    } else {
      // 直接赋值原始值，避免只读属性问题
      (cloneObj as deepCloneObject)[key] = val;
    }

    // 如果需要，设置属性描述符
    const descriptor = allDesc[key];
    if (descriptor) {
      Object.defineProperty(cloneObj, key, {
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable,
        writable: descriptor.writable,
        value: (cloneObj as deepCloneObject)[key], // 确保值是最新的
      });
    }
  }

  return cloneObj;
}

/**
 * @func filterObject
 * @param {object} object 来源对象
 * @param {string[]} paths 要被选中的或忽略的属性数组
 * @param {PropertyAction} action 操作类型，选择或忽略
 * @returns {object} 返回新对象
 * @description 根据操作类型选择或忽略对象的属性
 * @example
 * const object = { a: 1, b: '2', c: 3 }
 * filterObject(object, ['a', 'c'], 'pick') => { a: 1, c: 3 }
 * filterObject(object, ['a', 'c'], 'omit') => { b: '2' }
 */
export function filterObject<T extends object>(object: T, paths: string[], action: 'pick' | 'omit'): Partial<T> {
  const pathSet = new Set(paths);
  return Object.keys(object).reduce((acc, key) => {
    const keyTyped = key as keyof T;
    const shouldInclude = action === 'pick' ? pathSet.has(key) : !pathSet.has(key);
    if (shouldInclude) {
      acc[keyTyped] = object[keyTyped]; // 直接赋值
    }
    return acc;
  }, {} as Partial<T>);
}
