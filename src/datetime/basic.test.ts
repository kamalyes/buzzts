import {
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  diffDays,
  isSameDay,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  isBetween,
  isLeapYear,
  isWeekend,
  getDayOfWeek,
  getYear,
  getMonth,
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

  test('diffDays 计算日期差', () => {
    expect(diffDays('2023-06-23', '2023-06-20')).toBe(3);
  });

  test('isSameDay 判断同一天', () => {
    expect(isSameDay('2023-06-23T10:00:00', '2023-06-23T23:59:59')).toBe(true);
    expect(isSameDay('2023-06-23', '2023-06-24')).toBe(false);
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

  test('isBefore 和 isAfter 判断', () => {
    expect(isBefore('2023-06-20', '2023-06-23')).toBe(true);
    expect(isAfter('2023-06-25', '2023-06-23')).toBe(true);
  });

  test('isBetween 判断区间', () => {
    expect(isBetween('2023-06-22', '2023-06-20', '2023-06-25')).toBe(true);
    expect(isBetween('2023-06-19', '2023-06-20', '2023-06-25')).toBe(false);
  });

  test('isLeapYear 判断闰年', () => {
    expect(isLeapYear(2020)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
  });

  test('isWeekend 判断周末', () => {
    expect(isWeekend('2023-06-24')).toBe(true); // 周六
    expect(isWeekend('2023-06-23')).toBe(false); // 周五
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
});
