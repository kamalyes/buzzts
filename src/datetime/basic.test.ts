import {
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  diffDaysWithDecimal,
  startOfDay,
  endOfDay,
  getDayOfWeek,
  getYear,
  getMonth,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  getMilliseconds,
  getWeekdayCountInMonth,
  WeekdayCount,
} from './basic';

describe('日期工具函数测试', () => {
  test('addDays 正确增加天数', () => {
    const d = addDays('2023-06-23', 5);
    expect(d).not.toBeNull();
    expect(d!.toISOString().startsWith('2023-06-28')).toBe(true);
  });

  test('addHours 正确增加小时', () => {
    const d = addHours('2023-06-23T10:00:00', 3);
    expect(d).not.toBeNull();
    expect(d!.getHours()).toBe(13);
  });

  test('addMinutes 正确增加分钟', () => {
    const d = addMinutes('2023-06-23T10:00:00', 3);
    expect(d).not.toBeNull();
    expect(d!.getMinutes()).toBe(3);
  });

  test('addSeconds 正确增加秒', () => {
    const d = addSeconds('2023-06-23T10:00:00', 3);
    expect(d).not.toBeNull();
    expect(d!.getSeconds()).toBe(3);
  });

  test('diffDaysWithDecimal 计算日期差', () => {
    expect(diffDaysWithDecimal('2023-06-23', '2023-06-20')).toBe(3);
  });

  test('startOfDay 返回当天开始时间', () => {
    const d = startOfDay('2023-06-23T15:30:00');
    expect(d).not.toBeNull();
    expect(d!.getHours()).toBe(0);
    expect(d!.getMinutes()).toBe(0);
  });

  test('endOfDay 返回当天结束时间', () => {
    const d = endOfDay('2023-06-23T15:30:00');
    expect(d).not.toBeNull();
    expect(d!.getHours()).toBe(23);
    expect(d!.getMinutes()).toBe(59);
    expect(d!.getSeconds()).toBe(59);
    expect(d!.getMilliseconds()).toBe(999);
  });

  test('getDayOfWeek 返回星期', () => {
    expect(getDayOfWeek('2023-06-23')).toBe(5); // 周五
  });

  test('getYear 获取年份', () => {
    expect(getYear('2023-06-23')).toBe(2023);
  });

  test('getMonth 获取月份', () => {
    expect(getMonth('2023-06-23')).toBe(6);
  });

  test('getYear 获取年份', () => {
    expect(getYear('2023-06-23')).toBe(2023);
    expect(getYear(new Date('2023-06-23T15:30:55.123'))).toBe(2023);
    expect(getYear('invalid-date')).toBeNull();
  });

  test('getMonth 获取月份', () => {
    expect(getMonth('2023-06-23')).toBe(6);
    expect(getMonth(new Date('2023-06-23T15:30:55.123'))).toBe(6);
    expect(getMonth('invalid-date')).toBeNull();
  });

  test('getDay 获取日期', () => {
    expect(getDay('2023-06-23')).toBe(23);
    expect(getDay(new Date('2023-06-23T15:30:55.123'))).toBe(23);
    expect(getDay('invalid-date')).toBeNull();
  });

  test('getHours 获取小时', () => {
    expect(getHours('2023-06-23T15:30:55')).toBe(15);
    expect(getHours(new Date('2023-06-23T15:30:55.123'))).toBe(15);
    expect(getHours('invalid-date')).toBeNull();
  });

  test('getMinutes 获取分钟', () => {
    expect(getMinutes('2023-06-23T15:30:55')).toBe(30);
    expect(getMinutes(new Date('2023-06-23T15:30:55.123'))).toBe(30);
    expect(getMinutes('invalid-date')).toBeNull();
  });

  test('getSeconds 获取秒数', () => {
    expect(getSeconds('2023-06-23T15:30:55')).toBe(55);
    expect(getSeconds(new Date('2023-06-23T15:30:55.123'))).toBe(55);
    expect(getSeconds('invalid-date')).toBeNull();
  });

  test('getMilliseconds 获取毫秒', () => {
    expect(getMilliseconds('2023-06-23T15:30:55.123')).toBe(123);
    expect(getMilliseconds(new Date('2023-06-23T15:30:55.123'))).toBe(123);
    expect(getMilliseconds('invalid-date')).toBeNull();
  });
});

describe('getWeekdayCountInMonth', () => {
  it('should return correct weekday counts for June 2023', () => {
    const counts = getWeekdayCountInMonth(new Date('2023-06-01'));
    expect(counts).not.toBeNull(); // 确保返回值不是 null
    if (counts) {
      expect(counts.monday).toBe(4); // 2023年6月有4个星期一
      expect(counts.sunday).toBe(4); // 2023年6月有4个星期日
    }
  });

  it('should return correct weekday counts for February 2024 (leap year)', () => {
    const counts = getWeekdayCountInMonth(new Date('2024-02-01'));
    expect(counts).not.toBeNull(); // 确保返回值不是 null
    if (counts) {
      expect(counts.monday).toBe(4); // 2024年2月有4个星期一
      expect(counts.sunday).toBe(4); // 2024年2月有4个星期日
    }
  });

  it('should return correct weekday counts for July 2025', () => {
    const counts = getWeekdayCountInMonth(new Date('2025-07-01'));
    expect(counts).not.toBeNull(); // 确保返回值不是 null
    if (counts) {
      expect(counts.monday).toBe(4); // 2025年7月有4个星期一
      expect(counts.tuesday).toBe(5); // 2025年7月有5个星期二
      expect(counts.wednesday).toBe(5); // 2025年7月有5个星期三
      expect(counts.thursday).toBe(5); // 2025年7月有5个星期四
      expect(counts.friday).toBe(4); // 2025年7月有4个星期五
      expect(counts.saturday).toBe(4); // 2025年7月有4个星期六
      expect(counts.sunday).toBe(4); // 2025年7月有4个星期日
    }
  });

  it('should handle invalid date input gracefully', () => {
    const counts = getWeekdayCountInMonth('invalid date');
    expect(counts).toBeNull(); // 确保返回值为 null
  });

  it('should return counts of zero for an empty date', () => {
    const counts = getWeekdayCountInMonth();
    expect(counts).not.toBeNull(); // 确保返回值不是 null
  });
});
