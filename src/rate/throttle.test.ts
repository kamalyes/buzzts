import { throttle } from './throttle';

jest.useFakeTimers();

describe('throttle', () => {
  let fn: jest.Mock;
  let throttled: ReturnType<typeof throttle>;

  beforeEach(() => {
    fn = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('默认配置，leading=true, trailing=true，首次调用立即执行', () => {
    throttled = throttle(fn, 100);

    // 首次调用立即执行
    throttled('a');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    // 在等待时间内多次调用只执行一次
    throttled('b');
    throttled('c');
    expect(fn).toHaveBeenCalledTimes(1);

    // 等待时间后执行尾部调用
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('c');
  });

  test('leading=false，首次调用不立即执行，等待时间后执行', () => {
    throttled = throttle(fn, 100, { leading: false, trailing: true });

    throttled('a');
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  test('trailing=false，首次调用立即执行，尾部不执行', () => {
    throttled = throttle(fn, 100, { leading: true, trailing: false });

    throttled('a');
    expect(fn).toHaveBeenCalledTimes(1);

    throttled('b');
    throttled('c');
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('leading=false, trailing=false，函数永远不执行', () => {
    throttled = throttle(fn, 100, { leading: false, trailing: false });

    throttled('a');
    throttled('b');
    jest.advanceTimersByTime(1000);
    expect(fn).not.toHaveBeenCalled();
  });

  test('maxWait 确保最大等待时间内执行', () => {
    throttled = throttle(fn, 100, { maxWait: 300 });

    // 连续调用，超过 maxWait 后强制执行
    throttled('a');
    jest.advanceTimersByTime(50);
    throttled('b');
    jest.advanceTimersByTime(50);
    throttled('c');

    // 此时距离第一次执行已经 100ms，仍未触发 maxWait
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2); // 第一次和maxWait触发

    // 再次调用，检查 maxWait 重新计时
    throttled('d');
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('cancel 方法取消定时器和清理状态', () => {
    throttled = throttle(fn, 100);

    throttled('a');
    throttled.cancel();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // 立即执行了第一次调用
    // 尾部调用被取消，不会执行
    expect(fn).not.toHaveBeenCalledTimes(2);
  });

  test('flush 方法立即执行等待中的函数', () => {
    throttled = throttle(fn, 100);

    throttled('a');
    throttled('b');

    throttled.flush();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('b');

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('pause 和 resume 方法控制节流状态', () => {
    throttled = throttle(fn, 100);

    throttled.pause();
    throttled('a');
    expect(fn).not.toHaveBeenCalled();

    throttled.resume();
    throttled('b');
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
