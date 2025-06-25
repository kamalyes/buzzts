import { randString, randStringSlice } from './string';
import { RandType } from './types';

describe('randString', () => {
  it('生成指定长度字符串', () => {
    const str = randString(10, RandType.CAPITAL);
    expect(str).toHaveLength(10);
    expect(/^[A-Z]+$/.test(str)).toBe(true);
  });

  it('传入多个掩码生成混合字符串', () => {
    const str = randString(20, RandType.CAPITAL | RandType.NUMBER);
    expect(str).toHaveLength(20);
    expect(/^[A-Z0-9]+$/.test(str)).toBe(true);
  });

  it('mode为0时返回空字符串', () => {
    expect(randString(10, 0)).toBe('');
  });

  it('长度为0时返回空字符串', () => {
    expect(randString(0, RandType.CAPITAL)).toBe('');
  });
});

describe('randStringSlice', () => {
  it('生成指定数量字符串数组', () => {
    const arr = randStringSlice(5, 8, RandType.LOWERCASE);
    expect(arr).toHaveLength(5);
    arr.forEach(str => {
      expect(str).toHaveLength(8);
      expect(/^[a-z]+$/.test(str)).toBe(true);
    });
  });

  it('count为0时返回空数组', () => {
    expect(randStringSlice(0, 5, RandType.CAPITAL)).toEqual([]);
  });
});
