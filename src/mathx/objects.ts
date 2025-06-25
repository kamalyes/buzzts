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
 * @func deepClone
 * @param {T} obj - 将要复制的对象
 * @param {WeakMap<any, any>} [hash=new WeakMap()] - 用于处理循环引用的哈希表
 * @returns {T} 复制后的对象
 * @desc 深度复制对象，支持循环引用、日期、正则、原型链和属性描述符
 */
export function deepClone<T>(obj: T, hash: WeakMap<any, any> = new WeakMap()): T {
  // 原始类型或函数直接返回
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
  const cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);

  // 记录循环引用
  hash.set(obj, cloneObj);

  // 遍历所有自身属性（包括 Symbol）
  for (const key of Reflect.ownKeys(obj)) {
    const val = (obj as any)[key];
    // 递归深拷贝对象属性
    if (typeof val === 'object' && val !== null) {
      (cloneObj as any)[key] = deepClone(val, hash);
    } else {
      (cloneObj as any)[key] = val;
    }
  }

  return cloneObj;
}
