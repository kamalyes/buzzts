import { StorageWrapper } from './storage';
import { StorageType } from './typed';

describe('StorageWrapper 测试', () => {
  let localStorageWrapper: StorageWrapper;
  let sessionStorageWrapper: StorageWrapper;

  beforeEach(() => {
    localStorageWrapper = new StorageWrapper(StorageType.Local);
    sessionStorageWrapper = new StorageWrapper(StorageType.Session);
    localStorage.clear();
    sessionStorage.clear();
  });

  test('localStorage set/get/remove/clear', () => {
    const key = 'testKey';
    const value = { a: 1, b: 'test' };

    // set & get
    localStorageWrapper.set(key, value);
    expect(localStorageWrapper.get(key)).toEqual(value);

    // remove
    localStorageWrapper.remove(key);
    expect(localStorageWrapper.get(key)).toBeNull();

    // clear
    localStorageWrapper.set(key, value);
    localStorageWrapper.clear();
    expect(localStorageWrapper.get(key)).toBeNull();
  });

  test('sessionStorage set/get/remove/clear', () => {
    const key = 'sessionKey';
    const value = [1, 2, 3];

    sessionStorageWrapper.set(key, value);
    expect(sessionStorageWrapper.get(key)).toEqual(value);

    sessionStorageWrapper.remove(key);
    expect(sessionStorageWrapper.get(key)).toBeNull();

    sessionStorageWrapper.set(key, value);
    sessionStorageWrapper.clear();
    expect(sessionStorageWrapper.get(key)).toBeNull();
  });

  test('使用空键时不应存储任何内容', () => {
    localStorageWrapper.set('', { a: 1 });
    expect(localStorageWrapper.get('')).toBeNull();
  });

  test('使用 undefined 或函数值时应记录警告', () => {
    console.warn = jest.fn(); // 模拟 console.warn

    localStorageWrapper.set('testKey', undefined);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('value 是 undefined 或函数类型，忽略存储'));

    localStorageWrapper.set('testKey', () => {});
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('value 是 undefined 或函数类型，忽略存储'));
  });

  test('获取非 JSON 字符串', () => {
    const key = 'stringKey';
    const value = 'Hello, World!';

    localStorageWrapper.set(key, value);
    expect(localStorageWrapper.get(key)).toBe(value);
  });

  test('在设置时处理错误', () => {
    const originalSetItem = Storage.prototype.setItem;
    // 模拟抛出错误
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error('Storage error');
    });

    console.error = jest.fn(); // 模拟 console.error
    localStorageWrapper.set('testKey', { a: 1 });
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('set 出错:'), expect.any(Error));

    // 恢复原始方法
    Storage.prototype.setItem = originalSetItem;
  });

  test('在获取时处理错误', () => {
    const originalGetItem = Storage.prototype.getItem;
    // 模拟抛出错误
    Storage.prototype.getItem = jest.fn(() => {
      throw new Error('Storage error');
    });

    console.error = jest.fn(); // 模拟 console.error
    expect(localStorageWrapper.get('testKey')).toBeNull();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('get 出错:'), expect.any(Error));

    // 恢复原始方法
    Storage.prototype.getItem = originalGetItem;
  });

  test('在删除时处理错误', () => {
    const originalRemoveItem = Storage.prototype.removeItem;
    // 模拟抛出错误
    Storage.prototype.removeItem = jest.fn(() => {
      throw new Error('Storage error');
    });

    console.error = jest.fn(); // 模拟 console.error
    localStorageWrapper.remove('testKey');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('remove 出错:'), expect.any(Error));

    // 恢复原始方法
    Storage.prototype.removeItem = originalRemoveItem;
  });

  test('在清空时处理错误', () => {
    const originalClear = Storage.prototype.clear;
    // 模拟抛出错误
    Storage.prototype.clear = jest.fn(() => {
      throw new Error('Storage error');
    });

    console.error = jest.fn(); // 模拟 console.error
    localStorageWrapper.clear();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('clear 出错:'), expect.any(Error));

    // 恢复原始方法
    Storage.prototype.clear = originalClear;
  });
});
