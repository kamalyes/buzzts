type AnyFunction = (...args: any[]) => any;

interface ThrottleMethods {
  cancel: () => void; // 取消当前定时任务，清理状态
  flush: () => void; // 立即执行等待中的函数（如果有）
  pause: () => void; // 暂停节流/防抖，停止触发
  resume: () => void; // 恢复暂停状态
}

interface ThrottleOptions {
  leading?: boolean; // 节流时是否立即执行，默认 true
  trailing?: boolean; // 节流时是否在结束后执行，默认 true
  maxWait?: number; // 最大等待时间，保证函数不会被无限延迟
  timeFn?: () => number; // 自定义时间函数，默认 Date.now
}

/**
 * @func throttle
 * @desc 函数节流，每隔一段时间执行一次，防止函数过于频繁调用，导致性能问题
 * @param {Function} fn 将要处理的函数
 * @param {number} wait 时间, 单位为毫秒
 * @param {ThrottleOptions} options 配置选项
 * @returns 节流函数实现，支持 cancel/flush/pause/resume/maxWait/leading/trailing/timeFn
 * @example
 * 创建一个节流函数，等待时间为 500ms
 * const throttledFn = throttle(() => {
 *   console.log('节流函数执行了');
 * }, 500);
 *
 * 连续调用，实际只会每 500ms 执行一次
 * throttledFn();
 * throttledFn();
 * throttledFn();
 *
 * 取消节流
 * throttledFn.cancel();
 *
 * 立即执行等待中的函数
 * throttledFn.flush();
 *
 * 暂停节流
 * throttledFn.pause();
 *
 * 恢复节流
 * throttledFn.resume();
 */
export function throttle<T extends AnyFunction>(fn: T, wait = 300, options: ThrottleOptions = {}): T & ThrottleMethods {
  const { leading = true, trailing = true, maxWait, timeFn = Date.now } = options;

  let timer: ReturnType<typeof setTimeout> | null = null; // 定时器ID
  let lastCallTime = 0; // 上一次调用节流函数的时间
  let lastInvokeTime = 0; // 上一次真正执行目标函数的时间
  let lastArgs: any; // 上一次调用参数
  let lastThis: any; // 上一次调用上下文
  let paused = false; // 暂停标志

  /**
   * 判断是否满足执行条件
   * @param time 当前时间戳
   * @returns 是否应该执行函数
   */
  const shouldInvoke = (time: number) => {
    if (lastCallTime === 0) return true; // 第一次调用
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // 时间回拨，或者超过 wait 时间
    if (timeSinceLastCall >= wait || timeSinceLastCall < 0) return true;

    // maxWait 存在且超过最大等待时间
    if (maxWait !== undefined && timeSinceLastInvoke >= maxWait) return true;

    return false;
  };

  /**
   * 执行目标函数，更新执行时间戳，清理参数引用
   * @param time 当前时间戳
   * @returns 函数返回值
   */
  const invoke = (time: number) => {
    lastInvokeTime = time;
    const result = fn.apply(lastThis, lastArgs);
    lastArgs = lastThis = null;
    return result;
  };

  /**
   * 定时器回调，处理尾部执行逻辑
   */
  const timerExpired = () => {
    const time = timeFn();

    if (shouldInvoke(time)) {
      // 满足执行条件且允许尾部执行，则执行
      if (trailing && lastArgs) {
        invoke(time);
      }
      timer = null;
      lastCallTime = 0; // 重置，等待下一次调用
    } else {
      // 不满足条件，继续等待剩余时间
      const waitTime = remainingWait(time);
      timer = setTimeout(timerExpired, waitTime);
    }
  };

  const remainingWait = (time: number) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    if (maxWait !== undefined) {
      return Math.min(timeWaiting, maxWait - timeSinceLastInvoke);
    }
    return timeWaiting;
  };

  /**
   * 取消定时器和清理状态
   */
  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastCallTime = 0;
    lastInvokeTime = 0;
    lastArgs = lastThis = null;
  };

  /**
   * 立即执行等待中的函数（如果有）
   */
  const flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      if (lastArgs && trailing) {
        invoke(timeFn());
        lastCallTime = 0;
      }
    }
  };

  /**
   * 暂停节流，停止触发并取消定时器
   */
  const pause = () => {
    paused = true;
    cancel();
  };

  /**
   * 恢复暂停状态，重置时间戳，等待下一次调用触发
   */
  const resume = () => {
    if (!paused) return;
    paused = false;
    lastCallTime = 0;
    lastInvokeTime = 0;
  };

  /**
   * 节流函数主体
   */
  function throttled(this: any, ...args: any[]) {
    if (paused) return; // 暂停时不执行

    const time = timeFn();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (!isInvoking) {
      // 不满足执行条件，确保有定时器等待下一次触发
      if (!timer) {
        timer = setTimeout(timerExpired, wait);
      }
      return null;
    }

    if (!timer) {
      // 没有定时器，判断是否立即执行（leading）
      if (leading) {
        return invoke(time);
      }
      // 如果不允许立即执行，设置定时器等待尾部执行
      timer = setTimeout(timerExpired, wait);
      return null;
    }

    // 有定时器且设置了 maxWait，重置定时器并立即执行
    if (maxWait !== undefined) {
      clearTimeout(timer);
      timer = setTimeout(timerExpired, wait);
      return invoke(time);
    }

    return null;
  }

  throttled.cancel = cancel;
  throttled.flush = flush;
  throttled.pause = pause;
  throttled.resume = resume;

  return throttled as T & ThrottleMethods;
}
