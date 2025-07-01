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
  getDateInfo,
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

describe('getDateInfo', () => {
  test('传入标准日期字符串，自动兼容 iOS', () => {
    expect(getDateInfo('2023-01-01')).toEqual({
      year: '2023',
      month: '01',
      day: '01',
      hour: '00',
      minute: '00',
      second: '00',
    });
  });

  test('传入带时间的字符串', () => {
    expect(getDateInfo('2023-01-01 15:30:45')).toEqual({
      year: '2023',
      month: '01',
      day: '01',
      hour: '15',
      minute: '30',
      second: '45',
    });
  });

  test('传入 Date 对象', () => {
    const date = new Date(2023, 0, 1, 12, 0, 0);
    expect(getDateInfo(date)).toEqual({
      year: '2023',
      month: '01',
      day: '01',
      hour: '12',
      minute: '00',
      second: '00',
    });
  });

  test('传入时间戳（毫秒）', () => {
    expect(getDateInfo(1672531200000)).toEqual({
      year: '2023',
      month: '01',
      day: '01',
      hour: '08',
      minute: '00',
      second: '00',
    });
  });

  test('不传参数，默认当前时间', () => {
    const now = new Date();
    const result = getDateInfo();
    expect(result.year).toBe(now.getFullYear().toString());
    expect(result.month).toBe((now.getMonth() + 1).toString().padStart(2, '0'));
    expect(result.day).toBe(now.getDate().toString().padStart(2, '0'));
    expect(result.hour).toBe(now.getHours().toString().padStart(2, '0'));
    expect(result.minute).toBe(now.getMinutes().toString().padStart(2, '0'));
    expect(result.second).toBe(now.getSeconds().toString().padStart(2, '0'));
  });

  test('传入无效日期字符串抛出异常', () => {
    expect(() => getDateInfo('invalid-date-string')).toThrow('Invalid date format');
  });
});

describe('getWeekdayCountInMonth with timezone offset', () => {
  test('counts weekdays correctly in UTC+0', () => {
    const date = new Date('2025-06-01T00:00:00Z');
    const timezoneOffset = 0; // UTC+0

    const result = getWeekdayCountInMonth(date, timezoneOffset);

    expect(result).toEqual({
      sunday: 5, // 1,8,15,22,29
      monday: 5, // 2,9,16,23,30
      tuesday: 4, // 3,10,17,24
      wednesday: 4, // 4,11,18,25
      thursday: 4, // 5,12,19,26
      friday: 4, // 6,13,20,27
      saturday: 4, // 7,14,21,28
    });
  });

  test('counts weekdays correctly for June 2023 in UTC+8 (Beijing Time)', () => {
    const date = new Date('2023-06-15T00:00:00Z');
    const timezoneOffset = -8 * 60; // UTC+8，注意负号

    const result: WeekdayCount = getWeekdayCountInMonth(date, timezoneOffset);

    // 6月1日北京时间是6月1日凌晨，星期四，结果应和UTC+0相同
    expect(result).toEqual({
      sunday: 4,
      monday: 4,
      tuesday: 4,
      wednesday: 4,
      thursday: 5,
      friday: 5,
      saturday: 4,
    });
  });

  test('counts weekdays correctly for February 2024 (leap year) in UTC+0', () => {
    const date = new Date('2024-02-01T00:00:00Z');
    const timezoneOffset = 0;

    const result = getWeekdayCountInMonth(date, timezoneOffset);

    expect(result).toEqual({
      sunday: 4,
      monday: 4,
      tuesday: 4,
      wednesday: 4,
      thursday: 5,
      friday: 4,
      saturday: 4,
    });
  });

  test('defaults to local timezone offset when not provided', () => {
    const date = new Date('2023-06-15T00:00:00Z');
    const result = getWeekdayCountInMonth(date);

    // 只检查属性存在和类型
    expect(result).toHaveProperty('sunday');
    expect(typeof result.sunday).toBe('number');
  });
});
