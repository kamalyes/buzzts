import { Throttle } from './throttle';

jest.useFakeTimers();

describe('Throttle 类测试', () => {
  let fn: jest.Mock;
  let throttler: Throttle<(...args: any[]) => void>;

  beforeEach(() => {
    fn = jest.fn();
    throttler = new Throttle(fn, 100);
  });

  afterEach(() => {
    jest.clearAllTimers();
    fn.mockClear();
  });

  test('基本节流行为 - leading 默认执行', () => {
    const throttled = throttler.throttled;

    throttled();
    throttled();
    throttled();

    // 第一次调用立即执行
    expect(fn).toHaveBeenCalledTimes(1);

    // 快进时间 50ms，函数不应该再执行
    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);

    // 快进时间到 100ms 后，尾部执行
    jest.advanceTimersByTime(60);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('cancel 方法取消定时器和清理状态', () => {
    const throttled = throttler.throttled;

    throttled();
    throttled();
    throttler.cancel();

    // 立即执行一次（leading）
    expect(fn).toHaveBeenCalledTimes(1);

    // 快进时间超过 wait，尾部不应该执行，因为已取消
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('flush 方法立即执行等待中的函数', () => {
    const throttled = throttler.throttled;

    throttled();
    throttled();

    // flush 立即执行尾部函数
    throttler.flush();

    expect(fn).toHaveBeenCalledTimes(2);

    // 快进时间后不应再执行
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('pause 方法暂停节流，resume 恢复', () => {
    const throttled = throttler.throttled;

    throttled();
    throttler.pause();

    // 暂停后调用不执行
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    // 快进时间超过 wait，尾部不执行
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);

    throttler.resume();
    throttled();

    // 恢复后调用立即执行
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('maxWait 确保最大等待时间执行', () => {
    throttler = new Throttle(fn, 100, { maxWait: 250 });
    const throttled = throttler.throttled;

    throttled();
    jest.advanceTimersByTime(90);
    throttled();
    jest.advanceTimersByTime(90);
    throttled();

    // 此时总时间 180ms，函数最多等待 250ms，仍未执行第二次
    expect(fn).toHaveBeenCalledTimes(1);

    // 快进到超过 maxWait，函数强制执行
    jest.advanceTimersByTime(80);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('leading = false 时不立即执行', () => {
    throttler = new Throttle(fn, 100, { leading: false });
    const throttled = throttler.throttled;

    throttled();
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('trailing = false 时不执行尾部', () => {
    throttler = new Throttle(fn, 100, { trailing: false });
    const throttled = throttler.throttled;

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    throttled();
    jest.advanceTimersByTime(200);
    // 不执行尾部，调用次数仍为 1
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
