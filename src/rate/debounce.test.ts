import { debounce } from './debounce';

jest.useFakeTimers();

describe('debounce', () => {
  let fn: jest.Mock;
  let debounced: ReturnType<typeof debounce>;

  beforeEach(() => {
    fn = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('非立即执行模式，函数延迟调用', () => {
    debounced = debounce(fn, 100, false);

    debounced('a');
    expect(fn).not.toHaveBeenCalled();

    // 快进时间，触发执行
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  test('非立即执行模式，多次调用只执行一次，参数为最后一次', () => {
    debounced = debounce(fn, 100, false);

    debounced('a');
    debounced('b');
    debounced('c');

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  test('立即执行模式，第一次调用立即执行，后续调用忽略', () => {
    debounced = debounce(fn, 100, true);

    debounced('a');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    debounced('b');
    debounced('c');
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);

    // 100ms后再调用，可以再次立即执行
    debounced('d');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('d');
  });

  test('cancel 方法取消等待执行', () => {
    debounced = debounce(fn, 100, false);

    debounced('a');
    debounced.cancel();

    jest.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  test('flush 方法立即执行等待中的函数（非立即执行模式）', () => {
    debounced = debounce(fn, 100, false);

    debounced('a');
    expect(fn).not.toHaveBeenCalled();

    debounced.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    // flush 后定时器清空，后续时间快进不会再调用
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('flush 在立即执行模式下不执行函数', () => {
    debounced = debounce(fn, 100, true);

    debounced('a');
    expect(fn).toHaveBeenCalledTimes(1);

    debounced.flush();
    // flush 对立即执行模式无效，不会额外调用
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('返回值为最后一次调用的结果', () => {
    const fnReturn = jest.fn((x: number) => x * 2);

    // 非立即执行模式，返回 undefined（因为延迟执行）
    debounced = debounce(fnReturn, 100, false);
    expect(debounced(2)).toBeUndefined();

    jest.advanceTimersByTime(100);
    expect(fnReturn).toHaveBeenCalledWith(2);

    // 立即执行模式，返回函数执行结果
    debounced = debounce(fnReturn, 100, true);
    expect(debounced(3)).toBe(6);
  });
});
