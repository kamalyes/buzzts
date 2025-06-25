import { sleep, timeoutPromise } from './time';

jest.useFakeTimers();

describe('sleep', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
  test('sleep 正常延迟后执行回调和完成 Promise', async () => {
    const callback = jest.fn();

    const { promise } = sleep(1000, callback);

    // 还没到时间，回调和 resolve 不应执行
    jest.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    // 快进到1000ms，触发回调和 resolve
    jest.advanceTimersByTime(1);

    await expect(promise).resolves.toBeUndefined();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('timeoutPromise', () => {
  test('promise 在超时前完成', async () => {
    const promise = new Promise<string>(resolve => {
      setTimeout(() => resolve('done'), 500);
    });

    const wrapped = timeoutPromise(promise, 1000);

    jest.advanceTimersByTime(500);

    await expect(wrapped).resolves.toBe('done');
  });

  test('promise 超时后拒绝', async () => {
    const promise = new Promise<string>(resolve => {
      setTimeout(() => resolve('done'), 2000);
    });

    const wrapped = timeoutPromise(promise, 1000);

    jest.advanceTimersByTime(1000);

    await expect(wrapped).rejects.toThrow('操作超时');
  });

  test('promise 拒绝时正确传递错误', async () => {
    const error = new Error('fail');
    const promise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(error), 500);
    });

    const wrapped = timeoutPromise(promise, 1000);

    jest.advanceTimersByTime(500);

    await expect(wrapped).rejects.toThrow('fail');
  });
});
