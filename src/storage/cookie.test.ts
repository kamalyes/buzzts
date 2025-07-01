import { CookieWrapper } from './cookie';
import { CookieOptions } from './typed';

describe('CookieWrapper 测试', () => {
  let cookieWrapper: CookieWrapper;

  beforeEach(() => {
    cookieWrapper = new CookieWrapper();
    // 清空所有 cookie
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    });
  });

  test('Cookie set/get/remove', () => {
    const key = 'cookieKey';
    const value = { user: 'Alice', id: 123 };
    const options: CookieOptions = { expires: 1, path: '/' };

    // set & get
    cookieWrapper.set(key, value, options);
    expect(cookieWrapper.get(key)).toEqual(value);

    // remove
    cookieWrapper.remove(key);
    expect(cookieWrapper.get(key)).toBeNull();
  });

  test('Cookie clear', () => {
    cookieWrapper.set('key1', 'val1', { path: '/' });
    cookieWrapper.set('key2', 'val2', { path: '/' });
    cookieWrapper.clear();
    expect(cookieWrapper.get('key1')).toBeNull();
    expect(cookieWrapper.get('key2')).toBeNull();
  });
});
