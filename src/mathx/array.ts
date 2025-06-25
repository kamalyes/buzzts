/**
 * @func appendFieldByUniqueId
 * @param {Array} tree - 树形数据数组
 * @param {string|number} uniqueId - 唯一标识
 * @param {object} fieldObj - 需要追加的字段对象
 * @returns {Array} 修改后的树形数据
 * @desc 根据 uniqueId 在树中找到节点，追加或更新该节点的字段
 * @example
 * appendFieldByUniqueId(treeData, '1-2-3', { newField: 'value' });
 */
export function appendFieldByUniqueId(tree: any[], uniqueId: string | number, fieldObj: object): any[] {
  if (!Array.isArray(tree)) return [];
  for (const node of tree) {
    if (node.uniqueId === uniqueId && typeof fieldObj === 'object') {
      Object.assign(node, fieldObj);
    }
    if (node.children && node.children.length > 0) {
      appendFieldByUniqueId(node.children, uniqueId, fieldObj);
    }
  }
  return tree;
}

/**
 * @func arrayAllExist
 * @param {any[]} source - 源数组
 * @param {any[]} target - 目标数组
 * @returns {boolean}
 * @desc 判断 target 中的所有元素是否都存在于 source 中（浅比较）
 * @example
 * arrayAllExist([1,2,3], [2,3]); // true
 */
export function arrayAllExist(source: any[], target: any[]): boolean {
  if (!Array.isArray(source) || !Array.isArray(target)) return false;
  const setSource = new Set(source);
  return target.every(item => setSource.has(item));
}

/**
 * @func arrayAllExistDeep
 * @param {any[]} source - 源数组
 * @param {any[]} target - 目标数组
 * @returns {boolean}
 * @desc 判断 target 中的所有元素是否都深度存在于 source 中（深比较）
 * @example
 * arrayAllExistDeep([{a:1}], [{a:1}]); // true
 */
export function arrayAllExistDeep(source: any[], target: any[]): boolean {
  if (!Array.isArray(source) || !Array.isArray(target)) return false;
  return target.every(tItem => source.some(sItem => deepEqual(sItem, tItem)));
}

/**
 * @func arrayAnyExist
 * @param {any[]} source - 源数组
 * @param {any[]} target - 目标数组
 * @returns {boolean}
 * @desc 判断 target 中是否有任意一个元素存在于 source 中（浅比较）
 * @example
 * arrayAnyExist([1,2,3], [4,2]); // true
 */
export function arrayAnyExist(source: any[], target: any[]): boolean {
  if (!Array.isArray(source) || !Array.isArray(target)) return false;
  const setSource = new Set(source);
  return target.some(item => setSource.has(item));
}

/**
 * @func arrayAnyExistDeep
 * @param {any[]} source - 源数组
 * @param {any[]} target - 目标数组
 * @returns {boolean}
 * @desc 判断 target 中是否有任意一个元素深度存在于 source 中（深比较）
 * @example
 * arrayAnyExistDeep([{a:1}], [{b:2},{a:1}]); // true
 */
export function arrayAnyExistDeep(source: any[], target: any[]): boolean {
  if (!Array.isArray(source) || !Array.isArray(target)) return false;
  return target.some(tItem => source.some(sItem => deepEqual(sItem, tItem)));
}

/**
 * @func deepEqual
 * @param {any} a - 第一个值
 * @param {any} b - 第二个值
 * @returns {boolean} 是否相等
 * @desc 深度比较两个值是否相等
 * @example
 * deepEqual({a:1}, {a:1}); // true
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  // 支持 NaN 相等
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
  }

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object') return a === b;

  // 比较构造函数，区分不同类实例
  if (a.constructor !== b.constructor) return false;

  // 处理 Date
  if (a instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 处理 RegExp
  if (a instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // 处理 Array
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // 处理 Map
  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a.entries()) {
      if (!b.has(key)) return false;
      if (!deepEqual(val, b.get(key))) return false;
    }
    return true;
  }

  // 处理 Set
  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    // 因为 Set 无序，逐个检查 b 是否有 a 的每个元素
    for (const val of a.values()) {
      // 这里用 Array.from(b).some 判断是否有相等元素
      let hasEqual = false;
      for (const bVal of b.values()) {
        if (deepEqual(val, bVal)) {
          hasEqual = true;
          break;
        }
      }
      if (!hasEqual) return false;
    }
    return true;
  }

  // 处理普通对象和自定义类实例
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!bKeys.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}
