import { deepEqual, isNil } from '../typed';
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
 * @func chunkArray
 * @param {T[]} data - 要分块的数组，类型为泛型数组，包含任意类型的元素
 * @param {number} chunkCount - 分块数量，必须为正整数，且不超过数组长度
 * @returns {T[][]} - 分块后的二维数组
 * @throws {TypeError} - 当输入数据不是数组时抛出
 * @throws {RangeError} - 当 chunkCount 不是正整数或大于数组长度时抛出
 * @desc 将数组分成指定数量的块，尽量平均分配若分块数量超过数组长度，则每个元素将单独成为一块
 * @example
 * const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * chunkArray(arr, 2); // [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
 * chunkArray(arr, 3); // [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10]]
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

/**
 * @func extractPropertyToArray
 * @param {Array<T> | null | undefined} items - 对象数组，每个对象应包含可选的指定属性
 * @param {K} key - 要提取的属性名，类型为对象的键
 * @param {boolean} excludeNil - 是否排除 null 和 undefined，默认为 false
 * @returns {Array<T[K]>} - 返回所有指定属性值的数组，如果未提供有效的 `items`，则返回空数组
 * @desc 提取给定对象数组中的所有指定属性的值可选地，排除值为 null 或 undefined 的项
 * @example
 * const items = [{ key: 'key1' }, { key: 'key2' }, { key: undefined }];
 * const keys = extractPropertyToArray(items, 'key'); // ['key1', 'key2']
 */
export const extractPropertyToArray = <T, K extends keyof T>(
  items: Array<T> | null | undefined,
  key: K,
  excludeNil: boolean = false,
): Array<T[K]> => {
  if (!Array.isArray(items)) return [];

  return items
    .map(item => item[key]) // 这里 TypeScript 应该能够推断出 item[key] 的类型
    .filter((value): value is T[K] => !excludeNil || (value !== null && value !== undefined)); // 过滤并确保类型正确
};

/**
 * @func arrayToObject
 * @param {T[] | null | undefined} stringArray - 字符串数组，若输入为 `null` 或 `undefined`，将返回空数组
 * @param {string} key - 要设置的属性名，默认为 'key'
 * @param {boolean} excludeNil - 是否排除 null 和 undefined，默认为 false
 * @returns {Array<{ [K in typeof key]: T }>} - 返回对象数组，每个对象包含指定的属性，对应数组中的字符串
 * @desc 将字符串数组转换为对象数组，每个对象包含指定的属性，对应数组中的字符串可选地，排除值为 null 的项
 * @example
 * const stringArray = ['item1', 'item2', null];
 * const objects = arrayToObject(stringArray, 'key'); // [{ key: 'item1' }, { key: 'item2' }]
 */
export const arrayToObject = <T extends string>(
  stringArray: (T | null)[] | null | undefined,
  key: string = 'key',
  excludeNil: boolean = false,
): Array<{ [K in typeof key]: T }> => {
  const resultArray: Array<{ [K in typeof key]: T }> = [];

  // 检查传入的参数是否为数组
  if (!Array.isArray(stringArray)) {
    return resultArray;
  }

  return stringArray
    .filter(item => !excludeNil || item !== null) // 过滤掉 null 值
    .map(item => ({ [key]: item as T })); // 使用类型断言
};

/**
 * @func mapItems
 * @template T
 * @template U
 * @param {Array<T> | null | undefined} items - 输入的对象数组
 * @param {function(T): U | null} mapper - 映射函数
 * @param {boolean} excludeNil - 是否排除值为空的项
 * @returns {Array<U>} - 返回映射后的数组
 * @desc 将对象数组映射为指定格式
 */
const mapItems = <T, U>(
  items: Array<T> | null | undefined,
  mapper: (item: T) => U | null,
  excludeNil: boolean,
): Array<U> => {
  return (
    items?.map(mapper).filter((item): item is U => {
      if (excludeNil) {
        // 检查是否是空值
        return item !== null && item !== undefined && !(typeof item === 'object' && Object.keys(item).length === 0);
      }
      return item !== null;
    }) ?? []
  );
};

/**
 * @func toMappedArray
 * @param {Array<{ [key: string]: any }> | null | undefined} items - 输入的对象数组
 * @param {Object} options - 选项对象
 * @param {string} [options.inKeyField='key'] - 输入的 key 字段名
 * @param {string} [options.inValueField='value'] - 输入的 value 字段名
 * @param {string} [options.outKeyField='key'] - 输出的 key 字段名
 * @param {string} [options.outValueField='value'] - 输出的 value 字段名
 * @param {boolean} [options.includeKey=true] - 是否输出 key
 * @param {boolean} [options.includeValue=true] - 是否输出 value
 * @param {boolean} [options.excludeNil=false] - 是否排除值为空的项
 * @returns {Array<{ [outKeyField]: string; label?: string; [outValueField]?: string }>} - 返回映射后的数组
 * @desc 将对象数组映射为指定格式
 * @example
 * const items = [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }];
 * const result = toMappedArray(items, { inKeyField: 'value', outKeyField: 'label', includeKey: true, includeValue: true });
 * console.log(result); // [{ key: '1', value: '1', label: 'One' }, { key: '2', value: '2', label: 'Two' }]
 */
export const toMappedArray = (
  items: Array<{ [key: string]: any }> | null | undefined,
  options: {
    inKeyField?: string;
    inValueField?: string;
    outKeyField?: string;
    outValueField?: string;
    includeKey?: boolean;
    includeValue?: boolean;
    excludeNil?: boolean;
  } = {},
) => {
  const {
    inKeyField = 'key',
    inValueField = 'value',
    outKeyField = 'key',
    outValueField = 'value',
    includeKey = true,
    includeValue = true,
    excludeNil = false,
  } = options;

  return mapItems(
    items,
    item => {
      const result: { [key: string]: any } = {};
      if (includeKey && item[inKeyField] !== undefined) {
        result[outKeyField] = item[inKeyField];
      }
      if (includeValue && item[inValueField] !== undefined) {
        result[outValueField] = item[inValueField];
      }

      // 这里确保只返回非空的对象
      return Object.keys(result).length > 0 ? result : null;
    },
    excludeNil,
  );
};

/**
 * @func findValueByKey
 * @param {Array<{ [key: string]: any }> | null | undefined} items - 输入的对象数组
 * @param {string} key - 要查找的键
 * @param {any} value - 要查找的值
 * @param {string | null | undefined} [returnKey] - 要返回的特定键，默认为 undefined，表示返回整个对象
 * @returns {any | null| undefined} - 返回匹配的整个对象或指定键的值，或 null | undefined
 * @desc 根据键和值查找对象的对应值
 * @example
 * const items = [{ id: '1', name: 'One' }, { id: '2', name: 'Two' }];
 * const result1 = findValueByKey(items, 'id', '1'); // 返回整个对象
 * console.log(result1); // { id: '1', name: 'One' }
 * const result2 = findValueByKey(items, 'id', '1', 'name'); // 返回指定键的值
 * console.log(result2); // 'One'
 */
export const findValueByKey = (
  items: Array<{ [key: string]: any }> | null | undefined,
  key: string,
  value: any,
  returnKey?: string | null | undefined, // 动态指定要返回的键
) => {
  if (!items) return null;

  const foundItem = items.find(item => item[key] === value);

  if (!foundItem) return null;

  // 如果 returnKey 是 null 或 undefined，返回整个对象
  return !isNil(returnKey) ? foundItem[returnKey] : foundItem;
};

/**
 * 交换数组中的两个元素
 *
 * @func swapArrayIndex
 *
 * @param {Array<Item>} array - 需要进行元素交换的数组，数组可以包含任意类型的元素。
 * @param {number} i - 需要交换的第一个元素的索引。必须在数组的有效范围内。
 * @param {number} j - 需要交换的第二个元素的索引。必须在数组的有效范围内。
 *
 * @returns {void} - 此函数没有返回值，直接修改原始数组。
 *
 * @desc 此函数将数组中索引为 `i` 和 `j` 的元素进行交换。如果 `i` 和 `j` 相同，则数组不会改变。
 *
 * @example
 * const arr = [1, 2, 3];
 * swapArrayIndex(arr, 0, 2); // arr 变为 [3, 2, 1]
 *
 * @example
 * const arr2 = ['a', 'b', 'c'];
 * swapArrayIndex(arr2, 1, 2); // arr2 变为 ['a', 'c', 'b']
 *
 * @example
 * const arr3 = [true, false];
 * swapArrayIndex(arr3, 0, 1); // arr3 变为 [false, true]
 */
export function swapArrayIndex<Item>(array: Item[], i: number, j: number): void {
  if (i !== j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
