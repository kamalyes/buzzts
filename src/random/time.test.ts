import { randTime, randPastTime, randTimeBetween, randDate, randTimestamp, randISOTime } from './time';

describe('随机时间函数测试', () => {
  test('randTime 返回未来时间，且大于当前时间', () => {
    const now = Date.now();
    const t = randTime();
    expect(t).toBeInstanceOf(Date);
    expect(t.getTime()).toBeGreaterThan(now);
    // 未来时间最多1000小时后，约等于 1000*3600*1000 毫秒
    expect(t.getTime()).toBeLessThanOrEqual(now + 1000 * 3600 * 1000);
  });

  test('randPastTime 返回过去时间，且小于当前时间', () => {
    const now = Date.now();
    const t = randPastTime();
    expect(t).toBeInstanceOf(Date);
    expect(t.getTime()).toBeLessThan(now);
    expect(t.getTime()).toBeGreaterThanOrEqual(now - 1000 * 3600 * 1000);
  });

  test('randTimeBetween 返回时间在指定范围内', () => {
    const start = new Date('2023-01-01T00:00:00Z');
    const end = new Date('2023-12-31T23:59:59Z');
    const t = randTimeBetween(start, end);
    expect(t).toBeInstanceOf(Date);
    expect(t.getTime()).toBeGreaterThanOrEqual(start.getTime());
    expect(t.getTime()).toBeLessThanOrEqual(end.getTime());
  });

  test('randTimeBetween 抛出错误，start晚于end', () => {
    const start = new Date('2023-12-31');
    const end = new Date('2023-01-01');
    expect(() => randTimeBetween(start, end)).toThrow('start 时间必须早于 end 时间');
  });

  test('randDate 返回日期在指定年份范围内，时间为00:00:00', () => {
    const startYear = 2000;
    const endYear = 2020;
    const d = randDate(startYear, endYear);
    expect(d).toBeInstanceOf(Date);
    expect(d.getFullYear()).toBeGreaterThanOrEqual(startYear);
    expect(d.getFullYear()).toBeLessThanOrEqual(endYear);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
  });

  test('randTimestamp 返回时间戳在指定范围内', () => {
    const startTs = 1609459200000; // 2021-01-01T00:00:00Z
    const endTs = 1640995199999; // 2021-12-31T23:59:59.999Z
    const ts = randTimestamp(startTs, endTs);
    expect(typeof ts).toBe('number');
    expect(ts).toBeGreaterThanOrEqual(startTs);
    expect(ts).toBeLessThanOrEqual(endTs);
  });

  test('randTimestamp 抛出错误，startTimestamp大于endTimestamp', () => {
    const startTs = 1640995200000;
    const endTs = 1609459200000;
    expect(() => randTimestamp(startTs, endTs)).toThrow('startTimestamp 必须小于或等于 endTimestamp');
  });

  test('randISOTime 返回 ISO 格式字符串，且为未来时间', () => {
    const now = Date.now();
    const isoStr = randISOTime();
    expect(typeof isoStr).toBe('string');
    const t = new Date(isoStr);
    expect(t.getTime()).toBeGreaterThan(now);
  });
});
