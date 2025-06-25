/**
 * @func sleep
 * @desc 返回一个可取消的 Promise，延迟指定毫秒后完成，常用于异步等待。
 *       支持传入回调函数，等待结束时执行。
 * @param {number} wait - 等待时间，单位为毫秒
 * @param {() => void} [callback] - 可选，等待结束时调用的回调函数
 * @returns {{ promise: Promise<void>, cancel: () => void }} 包含 Promise 和取消函数
 * @example
 * const { promise, cancel } = sleep(3000, () => console.log('3秒结束'));
 * await promise;
 * 如果需要取消等待
 * cancel();
 */
export function sleep(wait: number, callback?: () => void): { promise: Promise<void>; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let rejectFn: ((reason?: any) => void) | null = null;

  const promise = new Promise<void>((resolve, reject) => {
    rejectFn = reject;
    timer = setTimeout(() => {
      callback?.();
      resolve();
      timer = null;
      rejectFn = null; // 清理，防止 cancel 后调用 reject
    }, wait);
  });

  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      if (rejectFn) {
        rejectFn(new Error('sleep 被取消'));
        rejectFn = null;
      }
    }
  };

  return { promise, cancel };
}

/**
 * @func timeoutPromise
 * @desc 给 Promise 设置超时时间，超时后自动拒绝
 * @param {Promise<T>} promise - 需要设置超时的 Promise
 * @param {number} ms - 超时时间，单位毫秒
 * @returns {Promise<T>} 带超时限制的 Promise
 * @example
 * await timeoutPromise(fetch(url), 5000); // 5秒内必须完成请求，否则抛出超时错误
 */
export function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('操作超时')), ms);
    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
