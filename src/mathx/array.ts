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

/**
 * @desc 将数组分成指定数量的块（尽量平均分配）
 * @param data 要分块的数组
 * @param chunkCount 分块数量，必须为正整数，且不超过数组长度
 * @returns 分块后的二维数组
 * @throws 参数校验失败时抛错
 * @example
 * const arr = [1,2,3,4,5,6,7,8,9,10];
 * chunkArray(arr, 2); // [[1,2,3,4,5],[6,7,8,9,10]]
 * chunkArray(arr, 3); // [[1,2,3,4],[5,6,7],[8,9,10]]
 */
export function chunkArray<T>(data: T[], chunkCount: number): T[][] {
  if (!Array.isArray(data)) {
    throw new TypeError('Input data must be an array');
  }
  if (!Number.isInteger(chunkCount) || chunkCount <= 0) {
    throw new RangeError('chunkCount must be a positive integer');
  }
  if (chunkCount > data.length) {
    // 如果分块数大于数组长度，返回每个元素单独一块
    return data.map(item => [item]);
  }
  const result: T[][] = [];
  const baseSize = Math.floor(data.length / chunkCount); // 每块基础大小
  let remainder = data.length % chunkCount; // 余数，前 remainder 个块多一个元素
  let startIndex = 0;

  for (let i = 0; i < chunkCount; i++) {
    const currentSize = baseSize + (remainder > 0 ? 1 : 0);
    remainder--;
    result.push(data.slice(startIndex, startIndex + currentSize));
    startIndex += currentSize;
  }

  return result;
}
