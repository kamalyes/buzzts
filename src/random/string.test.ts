import { randString, randStringSlice, randEmail } from './string';
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

describe('randEmail', () => {
  test('生成邮箱默认域名是example.com', () => {
    const email = randEmail();
    expect(email.endsWith('@example.com')).toBe(true);
  });

  test('生成邮箱自定义域名生效', () => {
    const domain = 'gmail.com';
    const email = randEmail(domain);
    expect(email.endsWith(`@${domain}`)).toBe(true);
  });

  test('用户名长度在5到12之间', () => {
    for (let i = 0; i < 100; i++) {
      const email = randEmail();
      const username = email.split('@')[0];
      expect(username.length).toBeGreaterThanOrEqual(5);
      expect(username.length).toBeLessThanOrEqual(12);
    }
  });

  test('用户名只包含小写字母', () => {
    const lowercaseRegex = /^[a-z]+$/;
    for (let i = 0; i < 100; i++) {
      const email = randEmail();
      const username = email.split('@')[0];
      expect(lowercaseRegex.test(username)).toBe(true);
    }
  });
});
