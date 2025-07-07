import { nanoid, RandType } from 'src/random';

/**
 * @class Fullscreen
 * @description 封装浏览器全屏操作，支持多浏览器兼容，并支持监听全屏状态变化
 * @example
 * // 创建 Fullscreen 实例，默认绑定 document.body，启用双击退出全屏，伪全屏背景色为透明
 * const fullscreen = new Fullscreen();
 *
 * // 进入全屏，成功后打印日志，失败捕获错误
 * fullscreen.enter()
 *   .then(() => console.log('进入全屏成功'))
 *   .catch(err => console.error('进入全屏失败', err));
 *
 * // 监听全屏状态变化，参数为当前是否全屏
 * fullscreen.onChange((isFull) => {
 *   console.log('全屏状态变化，当前是否全屏：', isFull);
 * });
 *
 * // 退出全屏，成功后打印日志，失败捕获错误
 * fullscreen.exit()
 *   .then(() => console.log('退出全屏成功'))
 *   .catch(err => console.error('退出全屏失败', err));
 *
 * // 切换全屏状态，当前是全屏则退出，否则进入
 * fullscreen.toggle()
 *   .then(() => console.log('切换全屏成功'))
 *   .catch(console.error);
 *
 * // 判断当前浏览器是否支持全屏API
 * if (!Fullscreen.isSupported()) {
 *   console.warn('当前浏览器不支持全屏API');
 * }
 *
 * // 注销全屏状态变化监听
 * const callback = (isFull: boolean) => console.log('状态变化:', isFull);
 * fullscreen.onChange(callback);
 * fullscreen.offChange(callback);
 *
 * // 销毁实例，移除所有事件监听，释放资源
 * fullscreen.destroy();
 */

export class Fullscreen {
  /**
   * 当前实例的唯一标识符（随机生成的字符串）
   * 用于区分多个 Fullscreen 实例，方便调试和管理
   *
   * @private
   * @readonly
   * @type {string}
   */
  private readonly id: string;
  /**
   * 当前文档对象引用，用于调用全屏相关的文档接口
   *
   * @private
   * @readonly
   * @type {Document}
   */
  private readonly doc: Document;

  /**
   * 绑定的全屏元素，默认是 document.body
   * 该元素可能包含各浏览器厂商前缀的全屏请求方法
   *
   * @private
   * @readonly
   * @type {HTMLElement & {
   *   mozRequestFullScreen?: () => Promise<void>;
   *   msRequestFullscreen?: () => Promise<void>;
   *   webkitRequestFullscreen?: () => Promise<void>;
   *   webkitEnterFullscreen?: () => void;
   * }}
   */
  private readonly element: HTMLElement & {
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    webkitEnterFullscreen?: () => void;
  };

  /**
   * 标准及各浏览器厂商前缀的请求进入全屏的方法名列表
   * 依次尝试调用这些方法实现全屏
   *
   * @readonly
   * @private
   * @type {readonly string[]}
   */
  private readonly requestMethods = [
    'requestFullscreen',
    'mozRequestFullScreen', // Firefox 旧版前缀
    'webkitRequestFullscreen', // Safari 和部分 WebKit 浏览器前缀
    'msRequestFullscreen', // IE / Edge 旧版前缀
  ] as const;

  /**
   * 标准及各浏览器厂商前缀的退出全屏的方法名列表
   * 依次尝试调用这些方法退出全屏
   *
   * @readonly
   * @private
   * @type {readonly string[]}
   */
  private readonly exitMethods = [
    'exitFullscreen',
    'mozCancelFullScreen', // Firefox 旧版前缀
    'webkitExitFullscreen', // Safari 和部分 WebKit 浏览器前缀
    'msExitFullscreen', // IE / Edge 旧版前缀
  ] as const;

  /**
   * 监听浏览器全屏状态变化的事件名集合
   * 兼容不同浏览器的事件名称
   *
   * @private
   * @type {string[]}
   */
  private changeEventNames = [
    'fullscreenchange', // 标准事件
    'mozfullscreenchange', // Firefox 旧版事件
    'webkitfullscreenchange', // Safari 和部分 WebKit 浏览器事件
    'MSFullscreenChange', // IE / Edge 旧版事件
  ];

  /**
   * 存储所有注册的全屏状态变化回调函数
   * 使用 Set 避免重复添加，方便删除
   *
   * @private
   * @type {Set<(isFullscreen: boolean) => void>}
   */
  private changeListeners: Set<(isFullscreen: boolean) => void> = new Set();

  /**
   * 标记当前是否处于伪全屏状态
   * 伪全屏指通过 CSS 样式模拟全屏效果（如在不支持全屏 API 的环境）
   *
   * @private
   * @type {boolean}
   */
  private isFakeFullscreen = false;

  /**
   * 伪全屏模式下的背景颜色
   *
   * 用于设置伪全屏时元素的背景色，默认值由构造函数传入
   * 该颜色会应用到元素的 style.backgroundColor 属性上，
   * 以支持调用者自定义伪全屏背景色
   *
   * @private
   * @type {string}
   */
  private fakeFullscreenBackgroundColor: string;

  /**
   * 保存伪全屏前元素的部分 CSS 样式属性
   * 用于退出伪全屏时恢复元素原有样式，避免样式丢失
   *
   * @private
   * @type {Record<string, string>}
   */
  private originalStyle: Record<string, string> = {};

  /**
   * 是否启用双击退出全屏功能
   * @private
   * @type {boolean}
   */
  private enableDblClickExit: boolean;

  /**
   * 标记实例是否已销毁，防止事件重复绑定或调用
   *
   * @private
   * @type {boolean}
   */
  private destroyed = false;

  /**
   * 缓存浏览器是否支持全屏API的结果，避免多次访问DOM
   *
   * @private
   * @static
   * @type {boolean | null}
   */
  private static _isSupported: boolean | null = null;

  /**
   * 判断当前设备是否为 iOS 系统（iPhone、iPad 或 iPod）
   *
   * 通过检测浏览器的 userAgent 字符串中是否包含 "iPad"、"iPhone" 或 "iPod" 来判断
   *
   * @private
   * @static
   * @returns {boolean} 如果是 iOS 设备返回 true，否则返回 false
   */
  private static isIOS(): boolean {
    return /iP(ad|hone|od)/.test(navigator.userAgent);
  }

  /**
   * 构造函数，绑定需要全屏的元素，并可选择是否启用双击退出全屏功能
   * @param {HTMLElement} [element=document.body] - 需要进入全屏的元素，默认 body
   * @param {boolean} [enableDblClickExit=true] - 是否启用双击退出全屏，默认启用
   * @param {string} [fakeFullscreenBackgroundColor='transparent'] - 伪全屏时元素的背景颜色，默认透明
   */
  constructor(element?: HTMLElement, enableDblClickExit = true, fakeFullscreenBackgroundColor = 'transparent') {
    this.id = nanoid(15);
    this.doc = document;
    this.element = element || document.body;
    this.enableDblClickExit = enableDblClickExit;
    this.fakeFullscreenBackgroundColor = fakeFullscreenBackgroundColor;

    // 绑定全屏状态变化事件监听，触发内部回调
    this.changeEventNames.forEach(eventName => {
      this.doc.addEventListener(eventName, this.handleFullscreenChange);
    });

    // 绑定双击事件，双击退出全屏
    if (this.enableDblClickExit) {
      this.element.addEventListener('dblclick', this.handleDblClick);
    }
  }

  /**
   * 双击事件处理函数，双击时退出全屏
   *
   * 如果当前处于绑定元素的全屏状态，则调用 `exit()` 退出全屏，
   * 并捕获退出失败的错误打印到控制台
   *
   * @private
   * @returns {void}
   */
  private handleDblClick = (): void => {
    console.group(`👆 [Fullscreen] ${this.id} handleDblClick() 双击事件触发`);
    if (this.isFullscreen()) {
      console.log('➡️ 当前处于全屏，双击退出全屏');
      this.exit()
        .then(() => {
          console.log('✅ 双击退出全屏成功');
          console.groupEnd();
        })
        .catch(err => {
          console.error('❌ 双击退出全屏失败:', err);
          console.groupEnd();
        });
    } else {
      console.log('➡️ 当前非全屏，双击无操作');
      console.groupEnd();
    }
  };

  /**
   * 进入伪全屏状态，通过修改元素样式实现全屏效果
   *
   * 如果当前已经处于伪全屏状态，则直接返回已完成的 Promise
   * 否则，保存元素当前的样式属性到 `originalStyle`，以便后续恢复
   * 然后设置元素的样式，使其覆盖整个视口，实现伪全屏效果
   * 标记 `isFakeFullscreen` 为 `true` 并触发全屏状态变化事件
   *
   * @returns {Promise<void>} 返回一个已完成的 Promise，表示伪全屏状态已生效
   * @private
   */
  private enterFakeFullscreen(): Promise<void> {
    if (this.isFakeFullscreen) return Promise.resolve();

    // 保存原始样式
    const style = this.element.style;
    this.originalStyle = {
      position: style.position || '',
      top: style.top || '',
      left: style.left || '',
      width: style.width || '',
      height: style.height || '',
      zIndex: style.zIndex || '',
      backgroundColor: style.backgroundColor || '',
      overflow: style.overflow || '',
      transition: 'all 0.01s ease',
    };

    // 设置伪全屏样式
    style.position = 'fixed';
    style.top = '0';
    style.left = '0';
    style.width = '100vw';
    style.height = '100vh';
    style.zIndex = '9999';
    style.backgroundColor = this.fakeFullscreenBackgroundColor; // 使用调用者传入的颜色
    style.overflow = '';

    this.isFakeFullscreen = true;
    this.triggerChange(true);
    return Promise.resolve();
  }

  /**
   * 触发全屏状态变化事件，通知所有注册的监听器
   *
   * 遍历 `changeListeners` 集合，依次调用每个回调函数，并传入当前是否全屏的状态
   * 如果某个回调执行出错，会捕获异常并在控制台输出错误信息，防止影响其他回调执行
   *
   * @param {boolean} isFull - 当前是否处于全屏状态，`true` 表示进入全屏，`false` 表示退出全屏
   * @private
   */
  private triggerChange(isFull: boolean): void {
    this.changeListeners.forEach(callback => {
      try {
        callback(isFull);
      } catch (e) {
        console.error('Fullscreen change callback error:', e);
      }
    });
  }

  /**
   * 退出伪全屏状态，恢复元素的原始样式
   *
   * 如果当前处于伪全屏状态，则遍历保存的 `originalStyle`，
   * 将对应的样式值恢复到元素上；若原始样式值为 `undefined`，则清空该样式属性
   * 最后将 `isFakeFullscreen` 标记为 `false`
   * 如果当前不是伪全屏状态，则方法直接返回，不做任何操作
   *
   * @private
   */
  private exitFakeFullscreen(): void {
    if (!this.isFakeFullscreen) return;

    const style = this.element.style;
    for (const key in this.originalStyle) {
      style[key as any] = this.originalStyle[key];
    }
    style.transition = 'all 0.01s ease'; // 添加过渡效果
    this.isFakeFullscreen = false;
  }

  /**
   * 进入全屏
   *
   * 优先处理 iOS 视频的特殊情况（webkitEnterFullscreen）
   * 然后尝试调用标准及各浏览器前缀的全屏请求方法
   * 如果不支持全屏API，则使用伪全屏方案
   *
   * @returns {Promise<void>} Promise，支持链式调用
   */
  enter(): Promise<void> {
    console.groupCollapsed(`🚀 [Fullscreen] ${this.id} enter() 开始进入全屏`);
    if (this.destroyed) {
      const err = new Error('实例已销毁,无法进入全屏');
      console.error(`❌ ${err.message}`);
      console.groupEnd();
      return Promise.reject(err);
    }

    // iOS video 特殊处理
    if (Fullscreen.isIOS()) {
      console.group('📱 检测到 iOS 设备');
      if (this.element.tagName.toLowerCase() === 'video') {
        const videoEl = this.element as HTMLVideoElement & {
          webkitEnterFullscreen?: () => void;
        };
        if (typeof videoEl.webkitEnterFullscreen === 'function') {
          try {
            videoEl.webkitEnterFullscreen();
            this.isFakeFullscreen = true; // 标记伪全屏状态
            this.triggerChange(true);
            console.log('✅ iOS 视频进入伪全屏成功');
            console.groupEnd();
            console.groupEnd();
            return Promise.resolve();
          } catch (e) {
            console.error('❌ iOS 视频进入全屏失败:', e);
            console.groupEnd();
            console.groupEnd();
            return Promise.reject(e);
          }
        }
      }
      console.groupEnd();
    }

    // 标准全屏API支持检测
    if (!Fullscreen.isSupported()) {
      console.warn('⚠️ 浏览器不支持全屏API，使用伪全屏');
      console.groupEnd();
      // 不支持全屏API，使用伪全屏方案
      return this.enterFakeFullscreen();
    }

    // 支持全屏API，尝试调用各厂商前缀的请求全屏方法
    for (const method of this.requestMethods) {
      const fn = (this.element as any)[method];
      if (typeof fn === 'function') {
        try {
          const result = fn.call(this.element);
          console.log(`✅ 调用全屏请求方法: ${method}`);
          console.groupEnd();
          // 统一返回 Promise，兼容不返回 Promise 的情况
          return Promise.resolve(result);
        } catch (err) {
          console.error(`❌ 调用全屏请求方法 ${method} 失败:`, err);
          console.groupEnd();
          return Promise.reject(err);
        }
      }
    }
    // 找不到可用的请求全屏方法，使用伪全屏
    console.warn('⚠️ 未找到可用的全屏请求方法，使用伪全屏');
    console.groupEnd();
    return this.enterFakeFullscreen();
  }

  /**
   * 退出全屏
   *
   * 优先退出伪全屏状态
   * 然后尝试调用标准及各浏览器前缀的退出全屏方法
   *
   * @returns {Promise<void>} Promise，支持链式调用
   */
  exit(): Promise<void> {
    console.groupCollapsed(`🛑 [Fullscreen] ${this.id} exit() 开始退出全屏`);
    if (this.destroyed) {
      const err = new Error('实例已销毁,无法退出全屏');
      console.error(`❌ ${err.message}`);
      console.groupEnd();
      return Promise.reject(err);
    }

    // 伪全屏状态优先退出
    if (this.isFakeFullscreen) {
      this.exitFakeFullscreen();
      this.triggerChange(false);
      console.log('✅ 退出伪全屏成功');
      console.groupEnd();
      return Promise.resolve();
    }

    if (!Fullscreen.isSupported()) {
      const err = new Error('浏览器不支持 Fullscreen API');
      console.error(`❌ ${err}`);
      console.groupEnd();
      return Promise.reject(err);
    }

    for (const method of this.exitMethods) {
      const fn = (this.doc as any)[method];
      if (typeof fn === 'function') {
        try {
          const result = fn.call(this.doc);
          console.log(`✅ 调用退出全屏方法: ${method}`);
          console.groupEnd();
          return Promise.resolve(result);
        } catch (err) {
          console.error(`❌ 调用退出全屏方法 ${method} 失败:`, err);
          console.groupEnd();
          return Promise.reject(err);
        }
      }
    }

    console.error('❌ 无法调用任何退出全屏方法');
    console.groupEnd();
    return Promise.reject(new Error('无法调用任何退出全屏方法'));
  }

  /**
   * 切换全屏状态，当前是全屏则退出，否则进入
   * @returns {Promise<void>} Promise，支持链式调用
   */
  toggle(): Promise<void> {
    console.groupCollapsed(`🔄 [Fullscreen] ${this.id} toggle() 开始切换全屏`);
    if (this.isFullscreen()) {
      console.log('➡️ 当前为全屏，准备退出全屏');
      const p = this.exit();
      p.finally(() => console.groupEnd());
      return p;
    } else {
      console.log('➡️ 当前非全屏，准备进入全屏');
      const p = this.enter();
      p.finally(() => console.groupEnd());
      return p;
    }
  }

  /**
   * 判断当前是否为全屏状态，且全屏元素是否是绑定的元素
   * @returns {boolean} 是否处于绑定元素的全屏状态
   */
  isFullscreen(): boolean {
    if (this.isFakeFullscreen) return true;

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
      this.changeListeners.add(callback);
    }
  }

  /**
   * 注销全屏状态变化监听器
   * @param {(isFullscreen: boolean) => void} callback - 之前注册的回调函数
   */
  offChange(callback: (isFullscreen: boolean) => void): void {
    this.changeListeners.delete(callback);
  }

  /**
   * 内部处理全屏状态变化事件，触发所有监听函数
   * @private
   */
  private handleFullscreenChange = (): void => {
    if (this.destroyed) return;
    console.groupCollapsed(`🔔 [Fullscreen] ${this.id} 全屏状态变化事件触发`);
    const isFull = this.isFullscreen();
    console.log(`当前是否全屏: ${isFull}`);
    this.changeListeners.forEach(callback => {
      try {
        callback(isFull);
      } catch (e) {
        // 忽略回调错误，避免影响其他监听
        console.error('❌ 全屏状态变化回调错误:', e);
      }
    });
    console.groupEnd();
  };

  /**
   * 静态方法，判断当前浏览器是否支持全屏API
   * 使用缓存结果，避免多次访问DOM
   *
   * @returns {boolean} 是否支持全屏
   */
  static isSupported(): boolean {
    if (this._isSupported !== null) return this._isSupported;
    const doc = document;
    this._isSupported = !!(
      doc.fullscreenEnabled ||
      (doc as any).webkitFullscreenEnabled ||
      (doc as any).mozFullScreenEnabled ||
      (doc as any).msFullscreenEnabled
    );
    return this._isSupported;
  }

  /**
   * 销毁实例，移除所有事件监听，避免内存泄漏
   *
   * 具体操作包括：
   * - 移除所有全屏状态变化事件监听
   * - 移除绑定元素上的双击退出全屏事件监听（如果启用了该功能）
   * - 清空所有注册的全屏状态变化回调
   * - 标记实例为已销毁，防止后续操作
   *
   * 调用该方法后，实例将不再响应任何事件，且不能再进行全屏操作
   *
   * @returns {void}
   */
  destroy(): void {
    if (this.destroyed) return;
    this.changeEventNames.forEach(eventName => {
      this.doc.removeEventListener(eventName, this.handleFullscreenChange);
    });

    if (this.enableDblClickExit) {
      this.element.removeEventListener('dblclick', this.handleDblClick);
    }

    this.changeListeners.clear();
    this.destroyed = true;
  }

  /**
   * 获取当前 Fullscreen 实例的唯一标识符
   *
   * @returns {string} 当前实例的唯一ID
   */
  getId(): string {
    return this.id;
  }
}
