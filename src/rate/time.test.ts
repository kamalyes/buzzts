import { Sleep, TimeoutPromise } from './time';

describe('Sleep 类测试', () => {
  test('Sleep 正常等待完成', async () => {
    const sleepInstance = new Sleep(100);
    const callback = jest.fn();
    const sleepWithCallback = new Sleep(100, callback);

    await expect(sleepInstance.promise).resolves.toBeUndefined();
    await sleepWithCallback.promise;
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('Sleep 取消后 Promise 拒绝', async () => {
    const sleepInstance = new Sleep(500);
    sleepInstance.cancel();
    await expect(sleepInstance.promise).rejects.toThrow('Sleep 被取消');
  });
});

describe('TimeoutPromise 类测试', () => {
  test('TimeoutPromise 正常完成', async () => {
    const p = new Promise<string>(resolve => setTimeout(() => resolve('ok'), 100));
    const timeoutInstance = new TimeoutPromise(p, 200);
    await expect(timeoutInstance.promise).resolves.toBe('ok');
  });

  test('TimeoutPromise 超时拒绝', async () => {
    const p = new Promise<string>(resolve => setTimeout(() => resolve('ok'), 300));
    const timeoutInstance = new TimeoutPromise(p, 100);
    await expect(timeoutInstance.promise).rejects.toThrow('操作超时');
  });

  test('TimeoutPromise 原始 Promise 拒绝', async () => {
    const p = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('原始错误')), 100));
    const timeoutInstance = new TimeoutPromise(p, 200);
    await expect(timeoutInstance.promise).rejects.toThrow('原始错误');
  });
});
