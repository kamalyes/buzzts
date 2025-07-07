import { formatDate, formatDuration } from './format';

describe('formatDate', () => {
  test('格式化有效日期字符串', () => {
    expect(formatDate('YYYY-MM-DD', '2023-06-23')).toBe('2023-06-23');
  });

  test('格式化 Date 对象', () => {
    const date = new Date('2023-06-23T15:04:05');
    expect(formatDate('YYYY-MM-DD HH:mm:ss', date)).toBe('2023-06-23 15:04:05');
  });

  test('默认参数为当前时间，返回非空字符串', () => {
    const result = formatDate('YYYY-MM-DD');
    expect(typeof result).toBe('string');
    expect(result).not.toBeNull();
  });

  test('传入无效日期返回 null', () => {
    // 这里假设 toDate(null) 返回 null
    expect(formatDate('YYYY-MM-DD', null as any)).toBeNull();

    // 传入空字符串等无效值也应返回 null
    expect(formatDate('YYYY-MM-DD', '' as any)).toBeNull();
  });
});

describe('formatDuration', () => {
  test('格式化秒数为 HH:mm:ss', () => {
    expect(formatDuration(5016)).toBe('01:23:36');
    expect(formatDuration(0)).toBe('00:00:00');
    expect(formatDuration(59)).toBe('00:00:59');
    expect(formatDuration(3600)).toBe('01:00:00');
  });
});
