import { getBetween } from './between';
describe('getBetween', () => {
  it('数字区间，默认比较函数', () => {
    const result = getBetween<number>(1, 5, {
      step: 1,
      next: (current, step) => current + step,
    });
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('数字区间，自定义比较函数', () => {
    const result = getBetween<number>(1, 5, {
      step: 2,
      compare: (current, end) => current <= end,
      next: (current, step) => current + step,
    });
    expect(result).toEqual([1, 3, 5]);
  });

  it('日期区间，按天递增', () => {
    const startDate = new Date('2023-06-20T00:00:00');
    const endDate = new Date('2023-06-23T00:00:00');
    const dates = getBetween<Date>(startDate, endDate, {
      step: 1,
      compare: (current, end) => current <= end,
      next: (current, step) => {
        const d = new Date(current);
        d.setDate(d.getDate() + step);
        return d;
      },
    });
    expect(dates).toHaveLength(4);
    expect(dates![0].toISOString()).toBe('2023-06-19T16:00:00.000Z');
    expect(dates![3].toISOString()).toBe('2023-06-22T16:00:00.000Z');
  });

  it('字符串区间，单字符递增', () => {
    function nextChar(c: string, step: number): string {
      return String.fromCharCode(c.charCodeAt(0) + step);
    }
    const chars = getBetween<string>('a', 'e', {
      step: 1,
      compare: (current, end) => current.charCodeAt(0) <= end.charCodeAt(0),
      next: nextChar,
    });
    expect(chars).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('未提供 next 函数时返回 null', () => {
    // @ts-expect-error 测试异常情况
    expect(getBetween(1, 5, { step: 1 })).toBeNull();
  });

  it('start 或 end 为 null 返回 null', () => {
    const next = (c: number, step: number) => c + step;
    expect(getBetween(null as any, 5, { step: 1, next })).toBeNull();
    expect(getBetween(1, null as any, { step: 1, next })).toBeNull();
  });

  it('不提供 compare 且类型非 number 抛错', () => {
    expect(() =>
      getBetween<string>('a', 'e', {
        step: 1,
        next: (c, step) => String.fromCharCode(c.charCodeAt(0) + step),
      }),
    ).toThrow('请提供 compare 函数');
  });

  it('比较函数返回 false 时返回只含起点数组', () => {
    const result = getBetween<number>(1, 5, {
      step: 1,
      compare: () => false,
      next: (current, step) => current + step,
    });
    expect(result).toEqual([]);
  });
});
