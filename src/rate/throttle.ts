type AnyFunction = (...args: any[]) => any;

interface ThrottleOptions {
  leading?: boolean; // 是否立即执行，默认 true
  trailing?: boolean; // 是否在结束后执行，默认 true
  maxWait?: number; // 最大等待时间，保证函数不会被无限延迟
  timeFn?: () => number; // 自定义时间函数，默认 Date.now
}

interface ThrottleMethods {
  cancel: () => void; // 取消当前定时任务，清理状态
  flush: () => void; // 立即执行等待中的函数（如果有）
  pause: () => void; // 暂停节流，停止触发
  resume: () => void; // 恢复暂停状态
}

/**
 * 节流类，控制函数调用频率，支持 leading/trailing/maxWait/pause/resume 等功能
 * @template T 被节流的函数类型
 */
export class Throttle<T extends AnyFunction> implements ThrottleMethods {
  private fn: T;
  private wait: number;
  private leading: boolean;
  private trailing: boolean;
  private maxWait?: number;
  private timeFn: () => number;

  private timer: ReturnType<typeof setTimeout> | null = null;
  private lastCallTime = 0;
  private lastInvokeTime = 0;
  private lastArgs: any[] | null = null;
  private lastThis: any = null;
  private paused = false;

  /**
   * @param fn 需要节流的函数
   * @param wait 节流时间间隔（毫秒）
   * @param options 配置选项
   */
  constructor(fn: T, wait = 300, options: ThrottleOptions = {}) {
    this.fn = fn;
    this.wait = wait;
    this.leading = options.leading !== undefined ? options.leading : true;
    this.trailing = options.trailing !== undefined ? options.trailing : true;
    this.maxWait = options.maxWait;
    this.timeFn = options.timeFn || Date.now;
  }

  /**
   * 判断当前时间是否满足执行条件
   * @param time 当前时间戳
   * @returns 是否应该执行函数
   */
  private shouldInvoke(time: number): boolean {
    if (this.lastCallTime === 0) return true;
    const timeSinceLastCall = time - this.lastCallTime;
    const timeSinceLastInvoke = time - this.lastInvokeTime;

    if (timeSinceLastCall >= this.wait || timeSinceLastCall < 0) return true;

    if (this.maxWait !== undefined && timeSinceLastInvoke >= this.maxWait) return true;

    return false;
  }

  /**
   * 执行目标函数，更新执行时间戳，清理参数引用
   * @param time 当前时间戳
   * @returns 函数返回值
   */
  private invoke(time: number) {
    this.lastInvokeTime = time;
    const result = this.fn.apply(this.lastThis, this.lastArgs!);
    this.lastArgs = this.lastThis = null;
    return result;
  }

  /**
   * 计算剩余等待时间
   * @param time 当前时间戳
   * @returns 剩余等待时间（毫秒）
   */
  private remainingWait(time: number): number {
    const timeSinceLastCall = time - this.lastCallTime;
    const timeSinceLastInvoke = time - this.lastInvokeTime;
    const timeWaiting = this.wait - timeSinceLastCall;

    if (this.maxWait !== undefined) {
      return Math.min(timeWaiting, this.maxWait - timeSinceLastInvoke);
    }
    return timeWaiting;
  }

  /**
   * 定时器回调，处理尾部执行逻辑
   */
  private timerExpired = () => {
    const time = this.timeFn();

    if (this.shouldInvoke(time)) {
      if (this.trailing && this.lastArgs) {
        this.invoke(time);
      }
      this.timer = null;
      this.lastCallTime = 0;
    } else {
      const waitTime = this.remainingWait(time);
      this.timer = setTimeout(this.timerExpired, waitTime);
    }
  };

  /**
   * 节流函数主体，调用时触发
   * @param args 传入目标函数的参数
   * @returns 目标函数返回值或 null
   */
  public throttled = (...args: any[]) => {
    if (this.paused) return null;

    const time = this.timeFn();
    const isInvoking = this.shouldInvoke(time);

    this.lastArgs = args;
    this.lastThis = this;
    this.lastCallTime = time;

    if (!isInvoking) {
      if (!this.timer) {
        this.timer = setTimeout(this.timerExpired, this.wait);
      }
      return null;
    }

    if (!this.timer) {
      if (this.leading) {
        return this.invoke(time);
      }
      this.timer = setTimeout(this.timerExpired, this.wait);
      return null;
    }

    if (this.maxWait !== undefined) {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.timerExpired, this.wait);
      return this.invoke(time);
    }

    return null;
  };

  /**
   * 取消当前定时任务，清理状态
   */
  public cancel() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.lastCallTime = 0;
    this.lastInvokeTime = 0;
    this.lastArgs = this.lastThis = null;
  }

  /**
   * 立即执行等待中的函数（如果有）
   */
  public flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      if (this.lastArgs && this.trailing) {
        this.invoke(this.timeFn());
        this.lastCallTime = 0;
      }
    }
  }

  /**
   * 暂停节流，停止触发并取消定时器
   */
  public pause() {
    this.paused = true;
    this.cancel();
  }

  /**
   * 恢复暂停状态，重置时间戳，等待下一次调用触发
   */
  public resume() {
    if (!this.paused) return;
    this.paused = false;
    this.lastCallTime = 0;
    this.lastInvokeTime = 0;
  }
}

/**
 * 创建节流函数
 * @param fn 需要节流的函数
 * @param wait 节流时间间隔（毫秒）
 * @param options 配置选项
 * @returns 具有 cancel/flush/pause/resume 方法的节流函数
 * @example
 * ```ts
 * const throttler = new Throttle(() => {
 *   console.log('节流函数执行了');
 * }, 500);
 *
 * const throttledFn = throttler.throttled;
 *
 * throttledFn();
 * throttledFn.cancel();
 * throttledFn.flush();
 * throttler.pause();
 * throttler.resume();
 * ```
 */
export function throttle<T extends AnyFunction>(fn: T, wait = 300, options?: ThrottleOptions): T & ThrottleMethods {
  const throttler = new Throttle(fn, wait, options);
  // 绑定方法
  const boundFn = throttler.throttled.bind(throttler) as T & ThrottleMethods;
  boundFn.cancel = throttler.cancel.bind(throttler);
  boundFn.flush = throttler.flush.bind(throttler);
  boundFn.pause = throttler.pause.bind(throttler);
  boundFn.resume = throttler.resume.bind(throttler);
  return boundFn;
}
