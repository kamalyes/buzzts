type BetweenOptions<T> = {
  step?: number; // 递增步长，数字或天数
  compare?: (current: T, end: T) => boolean; // 判断是否继续
  next: (current: T, step: number) => T; // 计算下一个值
};

/**
 * 通用区间遍历函数
 * @param start 起点
 * @param end 终点
 * @param options 递增规则和比较规则
 * @returns 包含起止的所有值数组，输入无效返回 null
 *
 * @example 日期区间遍历，按天递增
 * ```ts
 * const startDate = new Date('2023-06-20T00:00:00');
 * const endDate = new Date('2023-06-23T00:00:00');
 * const dates = getBetween<Date>(startDate, endDate, {
 *   step: 1,
 *   compare: (current, end) => current <= end,
 *   next: (current, step) => {
 *     const d = new Date(current);
 *     d.setDate(d.getDate() + step);
 *     return d;
 *   },
 * });
 * console.log(dates); // [2023-06-20T00:00:00, 2023-06-21T00:00:00, 2023-06-22T00:00:00, 2023-06-23T00:00:00]
 * ```
 *
 * @example 数字区间遍历
 * ```ts
 * const numbers = getBetween<number>(1, 5, {
 *   step: 1,
 *   next: (current, step) => current + step,
 * });
 * console.log(numbers); // [1, 2, 3, 4, 5]
 * ```
 *
 * @example 字符串区间遍历，单字符递增
 * ```ts
 * function nextChar(c: string, step: number): string {
 *   return String.fromCharCode(c.charCodeAt(0) + step);
 * }
 * const chars = getBetween<string>('a', 'e', {
 *   step: 1,
 *   compare: (current, end) => current.charCodeAt(0) <= end.charCodeAt(0),
 *   next: nextChar,
 * });
 * console.log(chars); // ['a', 'b', 'c', 'd', 'e']
 * ```
 */
export function getBetween<T extends {}>(start: T, end: T, options: BetweenOptions<T>): T[] | null {
  const { step = 1, compare, next } = options;
  if (start === null || end === null || next === undefined) return null;

  // 默认比较函数：current <= end
  const cmp =
    compare ??
    ((current, end) => {
      if (typeof current === 'number' && typeof end === 'number') {
        return current <= end;
      }
      throw new Error('请提供 compare 函数');
    });

  const result: T[] = [];
  let current: T = start; // 显式声明

  while (cmp(current, end)) {
    result.push(current);
    current = next(current, step);
  }

  return result;
}
