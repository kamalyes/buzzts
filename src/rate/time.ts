/**
 * @class Sleep
 * @classdesc 可取消的延迟等待类，封装了延迟 Promise 和取消功能
 *            常用于异步等待场景，支持在等待结束时执行回调，并可取消等待
 */
export class Sleep {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private rejectFn: ((reason?: any) => void) | null = null;
  public promise: Promise<void>;

  /**
   * 创建一个可取消的延迟等待实例
   * @param {number} wait - 等待时间，单位毫秒
   * @param {() => void} [callback] - 可选，等待结束时调用的回调函数
   *
   * @example
   * const sleepInstance = new Sleep(2000, () => console.log('等待结束'));
   * sleepInstance.promise.then(() => console.log('完成'));
   */
  constructor(wait: number, callback?: () => void) {
    this.promise = new Promise<void>((resolve, reject) => {
      this.rejectFn = reject;
      this.timer = setTimeout(() => {
        callback?.();
        resolve();
        this.clear();
      }, wait);
    });
  }

  /**
   * 取消等待，清理定时器并拒绝 Promise
   * 调用后，promise 会以错误形式拒绝，错误信息为 "Sleep 被取消"
   *
   * @example
   * const sleepInstance = new Sleep(5000);
   * sleepInstance.cancel(); // 取消等待，promise 会拒绝
   */
  public cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      if (this.rejectFn) {
        this.rejectFn(new Error('Sleep 被取消'));
        this.rejectFn = null;
      }
    }
  }

  /**
   * 清理内部状态，防止内存泄漏
   * @private
   */
  private clear(): void {
    this.timer = null;
    this.rejectFn = null;
  }
}

/**
 * @class TimeoutPromise
 * @classdesc 给 Promise 设置超时时间的包装类
 *            超过指定时间未完成，则自动拒绝并抛出超时错误
 * @template T Promise 返回值类型
 */
export class TimeoutPromise<T> {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private wrappedPromise: Promise<T>;

  /**
   * 构造函数，包装传入的 Promise，添加超时功能
   * @param {Promise<T>} promise - 需要设置超时的 Promise
   * @param {number} ms - 超时时间，单位毫秒
   *
   * @example
   * const timeoutInstance = new TimeoutPromise(fetch(url), 3000);
   * timeoutInstance.promise.then(res => console.log(res)).catch(err => console.error(err));
   */
  constructor(promise: Promise<T>, ms: number) {
    this.wrappedPromise = new Promise<T>((resolve, reject) => {
      this.timer = setTimeout(() => {
        reject(new Error('操作超时'));
        this.clear();
      }, ms);

      promise
        .then(value => {
          this.clear();
          resolve(value);
        })
        .catch(err => {
          this.clear();
          reject(err);
        });
    });
  }

  /**
   * 获取包装后的 Promise
   * @returns {Promise<T>} 带超时限制的 Promise
   */
  public get promise(): Promise<T> {
    return this.wrappedPromise;
  }

  /**
   * 清理定时器，防止内存泄漏
   * @private
   */
  private clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
