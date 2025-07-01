import { debounce, Debounce } from './debounce';

jest.useFakeTimers();

describe('Debounce class', () => {
  let fn: jest.Mock;
  let debouncer: Debounce<typeof fn>;

  beforeEach(() => {
    fn = jest.fn();
  });

  test('trailing debounce: function is called after wait time', () => {
    debouncer = new Debounce(fn, 100, false);

    debouncer.call(1);
    debouncer.call(2);

    // 函数尚未执行
    expect(fn).not.toHaveBeenCalled();

    // 快进时间，触发执行
    jest.advanceTimersByTime(100);

    // 只执行一次，且参数为最后一次调用的参数
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  test('leading debounce: function is called immediately once', () => {
    debouncer = new Debounce(fn, 100, true);

    // 第一次调用立即执行
    const result1 = debouncer.call(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    // 第二次调用在等待时间内，不会执行
    const result2 = debouncer.call(2);
    expect(fn).toHaveBeenCalledTimes(1);

    // 快进时间，等待时间结束
    jest.advanceTimersByTime(100);

    // 再次调用，立即执行
    const result3 = debouncer.call(3);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith(3);
  });

  test('cancel prevents delayed execution', () => {
    debouncer = new Debounce(fn, 100, false);

    debouncer.call(1);
    debouncer.cancel();

    jest.advanceTimersByTime(100);

    expect(fn).not.toHaveBeenCalled();
  });

  test('flush executes immediately if waiting', () => {
    debouncer = new Debounce(fn, 100, false);

    debouncer.call(1);
    expect(fn).not.toHaveBeenCalled();

    // flush 立即执行
    debouncer.flush();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    // 快进时间，不会重复执行
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('flush does nothing if no pending execution', () => {
    debouncer = new Debounce(fn, 100, false);

    expect(debouncer.flush()).toBeUndefined();
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('debounce factory function', () => {
  let fn: jest.Mock;
  let debouncedFn: ReturnType<typeof debounce>;

  beforeEach(() => {
    fn = jest.fn();
  });

  test('trailing debounce works with factory function', () => {
    debouncedFn = debounce(fn, 100, false);

    debouncedFn(1);
    debouncedFn(2);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  test('leading debounce works with factory function', () => {
    debouncedFn = debounce(fn, 100, true);

    debouncedFn(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    debouncedFn(2);
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);

    debouncedFn(3);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith(3);
  });

  test('cancel stops delayed execution', () => {
    debouncedFn = debounce(fn, 100, false);

    debouncedFn(1);
    debouncedFn.cancel();

    jest.advanceTimersByTime(100);

    expect(fn).not.toHaveBeenCalled();
  });

  test('flush immediately executes delayed function', () => {
    debouncedFn = debounce(fn, 100, false);

    debouncedFn(1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn.flush();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
