import { deepEqual } from '../typed';
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
