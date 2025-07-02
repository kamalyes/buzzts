/**
 * @class Fullscreen
 * @description 封装浏览器全屏操作，支持多浏览器兼容，并支持监听全屏状态变化。
 * @example
 * ```ts
 * const fullscreen = new Fullscreen(); // 默认全屏 body 元素
 * fullscreen.enter()
 *   .then(() => console.log('进入全屏成功'))
 *   .catch(err => console.error('进入全屏失败', err));
 *
 * fullscreen.onChange((isFull) => {
 *   console.log('全屏状态变化，当前是否全屏：', isFull);
 * });
 *
 * fullscreen.exit()
 *   .then(() => console.log('退出全屏成功'))
 *   .catch(err => console.error('退出全屏失败', err));
 *
 * fullscreen.toggle()
 *   .then(() => console.log('切换全屏成功'))
 *   .catch(console.error);
 *
 * if (!Fullscreen.isSupported()) {
 *   console.warn('当前浏览器不支持全屏API');
 * }
 * ```
 */
export class Fullscreen {
  private readonly doc: Document;

  private readonly element: HTMLElement & {
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
  };

  private readonly requestMethods = [
    'requestFullscreen',
    'mozRequestFullScreen',
    'webkitRequestFullscreen',
    'msRequestFullscreen',
  ] as const;

  private readonly exitMethods = [
    'exitFullscreen',
    'mozCancelFullScreen',
    'webkitExitFullscreen',
    'msExitFullscreen',
  ] as const;

  private changeEventNames = [
    'fullscreenchange',
    'mozfullscreenchange',
    'webkitfullscreenchange',
    'MSFullscreenChange',
  ];

  private changeListeners: Array<(isFullscreen: boolean) => void> = [];

  /**
   * 构造函数，绑定需要全屏的元素
   * @param {HTMLElement} [element=document.body] - 需要进入全屏的元素，默认 body
   */
  constructor(element?: HTMLElement) {
    this.doc = document;
    this.element = element || document.body;

    // 绑定全屏状态变化事件监听，触发内部回调
    this.changeEventNames.forEach(eventName => {
      this.doc.addEventListener(eventName, this.handleFullscreenChange);
    });
  }

  /**
   * 进入全屏
   * @returns {Promise<void>} Promise，支持链式调用
   */
  enter(): Promise<void> {
    if (!Fullscreen.isSupported()) {
      return Promise.reject(new Error('浏览器不支持 Fullscreen API'));
    }

    for (const method of this.requestMethods) {
      const fn = (this.element as any)[method];
      if (typeof fn === 'function') {
        try {
          const result = fn.call(this.element);
          // 某些旧浏览器可能不返回 Promise，做兼容处理
          if (result instanceof Promise) {
            return result;
          } else {
            return Promise.resolve();
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(new Error('无法调用任何全屏请求方法'));
  }

  /**
   * 退出全屏
   * @returns {Promise<void>} Promise，支持链式调用
   */
  exit(): Promise<void> {
    if (!Fullscreen.isSupported()) {
      return Promise.reject(new Error('浏览器不支持 Fullscreen API'));
    }

    for (const method of this.exitMethods) {
      const fn = (this.doc as any)[method];
      if (typeof fn === 'function') {
        try {
          const result = fn.call(this.doc);
          if (result instanceof Promise) {
            return result;
          } else {
            return Promise.resolve();
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(new Error('无法调用任何退出全屏方法'));
  }

  /**
   * 切换全屏状态，当前是全屏则退出，否则进入
   * @returns {Promise<void>} Promise，支持链式调用
   */
  toggle(): Promise<void> {
    if (this.isFullscreen()) {
      return this.exit();
    } else {
      return this.enter();
    }
  }

  /**
   * 判断当前是否为全屏状态，且全屏元素是否是绑定的元素
   * @returns {boolean} 是否处于绑定元素的全屏状态
   */
  isFullscreen(): boolean {
    const fullscreenElement =
      this.doc.fullscreenElement ||
      (this.doc as any).webkitFullscreenElement ||
      (this.doc as any).mozFullScreenElement ||
      (this.doc as any).msFullscreenElement;

    return fullscreenElement === this.element;
  }

  /**
   * 注册全屏状态变化监听器
   * @param {(isFullscreen: boolean) => void} callback - 状态变化回调，参数表示当前是否全屏
   */
  onChange(callback: (isFullscreen: boolean) => void): void {
    if (typeof callback === 'function') {
      this.changeListeners.push(callback);
    }
  }

  /**
   * 注销全屏状态变化监听器
   * @param {(isFullscreen: boolean) => void} callback - 之前注册的回调函数
   */
  offChange(callback: (isFullscreen: boolean) => void): void {
    this.changeListeners = this.changeListeners.filter(fn => fn !== callback);
  }

  /**
   * 内部处理全屏状态变化事件，触发所有监听函数
   * @private
   */
  private handleFullscreenChange = (): void => {
    const isFull = this.isFullscreen();
    this.changeListeners.forEach(callback => {
      try {
        callback(isFull);
      } catch (e) {
        // 忽略回调错误，避免影响其他监听
        console.error('Fullscreen change callback error:', e);
      }
    });
  };

  /**
   * 静态方法，判断当前浏览器是否支持全屏API
   * @returns {boolean} 是否支持全屏
   */
  static isSupported(): boolean {
    const doc = document;
    return !!(
      doc.fullscreenEnabled ||
      (doc as any).webkitFullscreenEnabled ||
      (doc as any).mozFullScreenEnabled ||
      (doc as any).msFullscreenEnabled
    );
  }

  /**
   * 销毁实例，移除事件监听，避免内存泄漏
   */
  destroy(): void {
    this.changeEventNames.forEach(eventName => {
      this.doc.removeEventListener(eventName, this.handleFullscreenChange);
    });
    this.changeListeners = [];
  }
}
