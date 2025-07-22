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

  test('在设置 Cookie 时处理错误', () => {
    const originalDocumentCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');

    // 确保 originalDocumentCookie 是有效的
    if (originalDocumentCookie) {
      Object.defineProperty(Document.prototype, 'cookie', {
        set: () => {
          throw new Error('Cookie set error');
        },
      });

      console.error = jest.fn(); // 模拟 console.error
      cookieWrapper.set('testKey', { a: 1 });
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Cookie set 出错:'), expect.any(Error));

      // 恢复原始方法
      Object.defineProperty(Document.prototype, 'cookie', originalDocumentCookie);
    }
  });

  test('在获取 Cookie 时处理错误', () => {
    const originalDocumentCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');

    // 确保 originalDocumentCookie 是有效的
    if (originalDocumentCookie) {
      Object.defineProperty(Document.prototype, 'cookie', {
        get: () => {
          throw new Error('Cookie get error');
        },
      });

      console.error = jest.fn(); // 模拟 console.error
      expect(cookieWrapper.get('testKey')).toBeNull();
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Cookie get 出错:'), expect.any(Error));

      // 恢复原始方法
      Object.defineProperty(Document.prototype, 'cookie', originalDocumentCookie);
    }
  });
});
