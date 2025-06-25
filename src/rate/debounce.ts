type AnyFunction = (...args: any[]) => any;

interface DebounceControl {
  cancel: () => void; // 取消等待执行的任务
  flush: () => void; // 立即执行等待中的函数
}

/**
 * @func debounce
 * @desc 防抖函数，保证函数在指定时间间隔内只执行一次
 * @param fn 目标函数
 * @param wait 延迟时间，单位毫秒
 * @param immediate 是否立即执行（leading），否则延迟执行（trailing）
 * @returns 包装后的防抖函数，带 cancel 和 flush 方法
 */
export function debounce<T extends AnyFunction>(fn: T, wait: number, immediate: boolean = false): T & DebounceControl {
  let timer: ReturnType<typeof setTimeout> | null = null; // 定时器句柄，null 表示无定时器
  let lastArgs: any[] | null = null; // 保存最后一次调用的参数
  let lastThis: any = null; // 保存最后一次调用的上下文（this）
  let result: any; // 保存函数执行的返回结果

  /**
   * 取消等待执行的任务
   * 清除定时器，重置参数和上下文
   */
  const cancel = () => {
    if (!timer) return; // 没有定时器，直接返回
    clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = null;
  };

  /**
   * 立即执行等待中的函数（只在非立即执行模式下有效）
   * 清除定时器后，立即调用最后一次保存的函数
   */
  const flush = () => {
    if (!timer) return; // 没有等待任务，直接返回
    clearTimeout(timer);
    timer = null;

    // 只有非立即执行模式下才执行等待中的函数
    if (!immediate && lastArgs) {
      result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
    return result;
  };

  /**
   * 防抖包装函数
   * 根据 immediate 参数决定立即执行还是延迟执行
   */
  function debounced(this: any, ...args: any[]) {
    lastArgs = args;
    lastThis = this;

    if (immediate) {
      // 立即执行模式（leading）

      // 只有当定时器不存在时，才立即执行函数
      // 这是修复的关键：避免每次调用都清除定时器导致 timer 始终为 null
      const canCallNow = !timer;
      if (canCallNow) {
        result = fn.apply(lastThis, lastArgs);
        lastArgs = null;
        lastThis = null;
      }

      // 如果定时器存在，先清除，防止重复计时
      if (timer) {
        clearTimeout(timer);
      }

      // 设置一个新的定时器，等待 wait 毫秒后清空 timer
      // 目的是在 wait 时间内阻止再次立即执行
      timer = setTimeout(() => {
        timer = null;
      }, wait);

      // 返回函数执行结果（立即执行时有效）
      return result;
    } else {
      // 非立即执行模式（trailing）

      // 每次调用都清除之前的定时器，重新计时
      if (timer) {
        clearTimeout(timer);
      }

      // 设置新的定时器，wait 毫秒后执行函数
      timer = setTimeout(() => {
        timer = null;
        // 如果参数为空，说明已被取消或执行过，直接返回
        if (!lastArgs) return;

        // 执行函数，传入最后一次调用的参数和上下文
        result = fn.apply(lastThis, lastArgs);
        lastArgs = null;
        lastThis = null;
      }, wait);

      // 非立即执行时，调用时返回 undefined（result 尚未产生）
      return result;
    }
  }

  // 绑定 cancel 和 flush 方法到防抖函数上
  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as T & DebounceControl;
}
