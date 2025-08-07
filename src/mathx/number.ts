/**
 * 比较两个数字的大小
 *
 * @func compareNumber
 *
 * @param {number} pivotItem - 待比较的基准值
 * @param {number} currentItem - 当前需要比较的值
 *
 * @returns {number} - 返回一个数字：
 *   - 大于 0 表示 `pivotItem` 大于 `currentItem`（正序）
 *   - 小于 0 表示 `pivotItem` 小于 `currentItem`（倒序）
 *   - 等于 0 表示两者相等
 *
 * @example
 * const result = compareNumber(5, 3); // result 为 2
 * const result2 = compareNumber(3, 5); // result2 为 -2
 * const result3 = compareNumber(4, 4); // result3 为 0
 */
export function compareNumber(pivotItem: number, currentItem: number): number {
  return pivotItem - currentItem;
}
