import { createInterval } from './interval';

describe('createInterval', () => {
  jest.useFakeTimers(); // 使用 Jest 的假定时器

  it('should start and run the callback', () => {
    const callback = jest.fn();
    const interval = createInterval(callback, 1000);

    interval.start();

    // 进程时间前进 1000 毫秒
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    // 再次推进时间
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should stop the interval', () => {
    const callback = jest.fn();
    const interval = createInterval(callback, 1000);

    interval.start();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    interval.stop();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1); // 确保回调没有被调用
  });

  it('should not start if already running', () => {
    const callback = jest.fn();
    const interval = createInterval(callback, 1000);

    interval.start();
    interval.start(); // 再次启动

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1); // 仍然只调用一次
  });

  it('should return the running state', () => {
    const callback = jest.fn();
    const interval = createInterval(callback, 1000);

    expect(interval.isRunning()).toBe(false); // 初始状态

    interval.start();
    expect(interval.isRunning()).toBe(true); // 启动后

    interval.stop();
    expect(interval.isRunning()).toBe(false); // 停止后
  });
});
