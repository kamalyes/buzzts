import { compareTwoDates, isBetween, isLeapYear, isWeekend, isSameDay } from './valid';
import { toDate, isValidDate } from './basic';

describe('compareTwoDates', () => {
  test('dateA before dateB returns true', () => {
    expect(compareTwoDates('2023-06-20', '2023-06-23', 'before')).toBe(true);
  });

  test('dateA after dateB returns true', () => {
    expect(compareTwoDates('2023-06-25', '2023-06-23', 'after')).toBe(true);
  });

  test('invalid date returns null', () => {
    expect(compareTwoDates('invalid', '2023-06-23', 'before')).toBeNull();
  });
});

describe('isBetween', () => {
  test('date inside range returns true', () => {
    expect(isBetween('2023-06-22', '2023-06-20', '2023-06-25')).toBe(true);
  });

  test('date outside range returns false', () => {
    expect(isBetween('2023-06-19', '2023-06-20', '2023-06-25')).toBe(false);
  });

  test('invalid date returns null', () => {
    expect(isBetween('invalid', '2023-06-20', '2023-06-25')).toBeNull();
  });
});

describe('isLeapYear', () => {
  test('2020 is leap year', () => {
    expect(isLeapYear(2020)).toBe(true);
  });

  test('2023 is not leap year', () => {
    expect(isLeapYear(2023)).toBe(false);
  });

  test('1900 is not leap year', () => {
    expect(isLeapYear(1900)).toBe(false);
  });

  test('2000 is leap year', () => {
    expect(isLeapYear(2000)).toBe(true);
  });
});

describe('isWeekend', () => {
  test('2023-06-23 (Friday) returns false', () => {
    expect(isWeekend('2023-06-23')).toBe(false);
  });

  test('2023-06-24 (Saturday) returns true', () => {
    expect(isWeekend('2023-06-24')).toBe(true);
  });

  test('2023-06-25 (Sunday) returns true', () => {
    expect(isWeekend('2023-06-25')).toBe(true);
  });

  test('invalid date returns null', () => {
    expect(isWeekend('invalid')).toBeNull();
  });
});

describe('isSameDay', () => {
  test('same day returns true', () => {
    expect(isSameDay('2023-06-23T10:00:00', '2023-06-23T23:59:59')).toBe(true);
  });

  test('different day returns false', () => {
    expect(isSameDay('2023-06-23T23:59:59', '2023-06-24T00:00:00')).toBe(false);
  });

  test('invalid date returns null', () => {
    expect(isSameDay('invalid', '2023-06-23')).toBeNull();
  });
});

describe('isValidDate', () => {
  test('有效日期对象', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date('2023-06-23'))).toBe(true);
  });

  test('无效日期对象', () => {
    expect(isValidDate(new Date('invalid date'))).toBe(false);
    expect(isValidDate('2023-06-23')).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
  });
});

describe('toDate', () => {
  test('传入 Date 对象且有效', () => {
    const d = new Date('2023-06-23');
    expect(toDate(d)?.toISOString()).toBe(d.toISOString());
  });

  test('传入 Date 对象但无效', () => {
    expect(toDate(new Date('invalid'))).toBeNull();
  });

  test('传入时间戳（秒）', () => {
    const ts = 1687497600; // 2023-06-23 00:00:00 UTC
    const d = toDate(ts);
    expect(d).not.toBeNull();
    expect(d!.getUTCFullYear()).toBe(2023);
    expect(d!.getUTCMonth()).toBe(5); // 0-based, 5 = June
    expect(d!.getUTCDate()).toBe(23);
  });

  test('传入时间戳（毫秒）', () => {
    const tsMs = 1687497600000; // 同上，毫秒
    const d = toDate(tsMs);
    expect(d).not.toBeNull();
    expect(d!.getUTCFullYear()).toBe(2023);
  });

  test('传入日期字符串', () => {
    const d = toDate('2023-06-23');
    expect(d).not.toBeNull();
    expect(d!.getUTCFullYear()).toBe(2023);
  });

  test('传入无效日期字符串', () => {
    expect(toDate('invalid date')).toBeNull();
  });
});
