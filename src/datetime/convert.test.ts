import { isValidDate, toDate, getUnixTimestamp, timestampToDate } from './convert';

describe('日期转换函数测试', () => {
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

  describe('getUnixTimestamp', () => {
    test('传入有效日期字符串', () => {
      // 期望值用 Date.UTC 计算
      const expectedTimestamp = Math.floor(Date.UTC(2023, 5, 23) / 1000);
      expect(getUnixTimestamp('2023-06-23')).toBe(expectedTimestamp);
    });

    test('传入无效日期', () => {
      expect(getUnixTimestamp('invalid')).toBeNull();
    });

    test('默认调用返回当前时间戳（秒）', () => {
      const now = Math.floor(Date.now() / 1000);
      const ts = getUnixTimestamp();
      expect(ts).not.toBeNull();
      if (ts !== null) {
        expect(ts).toBeGreaterThanOrEqual(now - 5);
        expect(ts).toBeLessThanOrEqual(now + 5);
      }
    });
  });

  describe('timestampToDate', () => {
    test('传入秒时间戳（数字）', () => {
      const ts = 1687497600;
      const d = timestampToDate(ts);
      expect(d).not.toBeNull();
      expect(d!.getUTCFullYear()).toBe(2023);
    });

    test('传入毫秒时间戳（数字）', () => {
      const tsMs = 1687497600000;
      const d = timestampToDate(tsMs);
      expect(d).not.toBeNull();
      expect(d!.getUTCFullYear()).toBe(2023);
    });

    test('传入秒时间戳（字符串）', () => {
      const d = timestampToDate('1687497600');
      expect(d).not.toBeNull();
      expect(d!.getUTCFullYear()).toBe(2023);
    });

    test('传入毫秒时间戳（字符串）', () => {
      const d = timestampToDate('1687497600000');
      expect(d).not.toBeNull();
      expect(d!.getUTCFullYear()).toBe(2023);
    });

    test('传入无效字符串', () => {
      expect(timestampToDate('invalid')).toBeNull();
    });
  });
});
