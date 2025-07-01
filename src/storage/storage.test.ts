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
});
