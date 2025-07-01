type AnyFunction = (...args: any[]) => any;

interface DebounceControl {
  cancel: () => void; // 取消等待执行的任务
  flush: () => void; // 立即执行等待中的函数
}

/**
 * @class Debounce
 * @description 防抖类，保证函数在指定时间间隔内只执行一次
 *              支持立即执行（leading）和延迟执行（trailing）两种模式
 *              提供 cancel 和 flush 方法控制防抖行为
 *
 * @template T - 目标函数类型
 */
export class Debounce<T extends AnyFunction> implements DebounceControl {
  private timer: ReturnType<typeof setTimeout> | null = null; // 定时器句柄，null 表示无定时器
  private lastArgs: Parameters<T> | null = null; // 保存最后一次调用的参数
  private lastThis: any = null; // 保存最后一次调用的上下文（this）
  private result: ReturnType<T> | undefined; // 保存函数执行的返回结果
  private fn: T; // 目标函数
  private wait: number; // 延迟时间，单位毫秒
  private immediate: boolean; // 是否立即执行（leading）

  /**
   * @constructor
   * @param fn 目标函数
   * @param wait 延迟时间，单位毫秒
   * @param immediate 是否立即执行（leading），默认为 false（trailing）
   */
  constructor(fn: T, wait: number, immediate: boolean = false) {
    this.fn = fn;
    this.wait = wait;
    this.immediate = immediate;
  }

  /**
   * @method call
   * @description 调用防抖函数，返回函数执行结果或 undefined
   *
   * @param args - 函数调用时的参数列表
   * @returns 函数执行结果（立即执行模式下）或 undefined（延迟执行模式下）
   */
  public call = (...args: Parameters<T>): ReturnType<T> | undefined => {
    // 记录当前调用的参数和上下文
    this.lastArgs = args;
    this.lastThis = this;

    if (this.immediate) {
      // 立即执行模式（leading）

      // 只有当前没有定时器时，才立即执行函数，防止重复执行
      const canCallNow = !this.timer;
      if (canCallNow) {
        this.result = this.fn.apply(this.lastThis, this.lastArgs);
        // 清空参数和上下文，避免内存泄漏
        this.lastArgs = null;
        this.lastThis = null;
      }

      // 如果已有定时器，先清除，防止重复计时
      if (this.timer) {
        clearTimeout(this.timer);
      }

      // 设置定时器，等待 wait 毫秒后清空定时器句柄
      // 目的是在 wait 时间内阻止再次立即执行
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.wait);

      // 返回立即执行的结果
      return this.result;
    } else {
      // 延迟执行模式（trailing）

      // 每次调用都清除之前的定时器，重新计时
      if (this.timer) {
        clearTimeout(this.timer);
      }

      // 设置新的定时器，wait 毫秒后执行函数
      this.timer = setTimeout(() => {
        this.timer = null;
        // 如果参数为空，说明已被取消或执行过，直接返回
        if (!this.lastArgs) return;

        // 执行函数，传入最后一次调用的参数和上下文
        this.result = this.fn.apply(this.lastThis, this.lastArgs);
        // 执行完毕后清空参数和上下文，避免内存泄漏
        this.lastArgs = null;
        this.lastThis = null;
      }, this.wait);

      // 延迟执行时，调用时返回 undefined（结果尚未产生）
      return this.result;
    }
  };

  /**
   * @method cancel
   * @description 取消等待执行的任务，清除定时器和缓存的参数、上下文
   */
  public cancel(): void {
    if (!this.timer) return; // 没有定时器则直接返回
    clearTimeout(this.timer);
    this.timer = null;
    this.lastArgs = null;
    this.lastThis = null;
  }

  /**
   * @method flush
   * @description 立即执行等待中的函数（只在非立即执行模式下有效）
   *              清除定时器后，立即调用最后一次保存的函数
   * @returns 函数执行结果或 undefined
   */
  public flush(): ReturnType<T> | undefined {
    if (!this.timer) return; // 没有等待任务，直接返回
    clearTimeout(this.timer);
    this.timer = null;

    // 只有非立即执行模式下才执行等待中的函数
    if (!this.immediate && this.lastArgs) {
      this.result = this.fn.apply(this.lastThis, this.lastArgs);
      this.lastArgs = null;
      this.lastThis = null;
    }
    return this.result;
  }
}

/**
 * @function debounce
 * @description 工厂函数，基于 Debounce 类创建防抖函数
 *
 * @template T - 目标函数类型
 * @param fn - 目标函数
 * @param wait - 延迟时间，单位毫秒
 * @param immediate - 是否立即执行（leading），默认 false（trailing）
 * @returns 防抖函数，带 cancel 和 flush 方法
 */
export function debounce<T extends AnyFunction>(fn: T, wait: number, immediate: boolean = false): T & DebounceControl {
  const debouncer = new Debounce(fn, wait, immediate);

  // 创建一个函数，调用类实例的 call 方法
  const debouncedFn = function (this: any, ...args: Parameters<T>) {
    return debouncer.call.apply(this, args);
  } as T & DebounceControl;

  // 绑定 cancel 和 flush 方法
  debouncedFn.cancel = () => debouncer.cancel();
  debouncedFn.flush = () => debouncer.flush();

  return debouncedFn;
}
