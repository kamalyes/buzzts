/**
 * @class Viewport
 * @description 兼容所有浏览器的视口尺寸工具类，提供宽高属性，支持监听窗口尺寸变化事件。
 *
 * @example
 * import Viewport from './Viewport';
 * const viewport = new Viewport();
 * console.log(viewport.width, viewport.height);
 * console.log(viewport.size());
 * viewport.onResize(() => {
 *   console.log('尺寸变化', viewport.size());
 * });
 */
export class Viewport {
  /**
   * 当前视口宽度，单位：像素
   * @type {number}
   */
  width: number;

  /**
   * 当前视口高度，单位：像素
   * @type {number}
   */
  height: number;

  /**
   * 内部保存的窗口尺寸变化事件处理函数引用，用于添加和移除监听器
   * @private
   * @type {((this: Window, ev: UIEvent) => any) | null}
   */
  private resizeHandler: ((this: Window, ev: UIEvent) => any) | null;

  /**
   * 创建一个 Viewport 实例，初始化宽高值
   */
  constructor() {
    this.width = this._calcWidth();
    this.height = this._calcHeight();
    this.resizeHandler = null;
  }

  /**
   * 计算当前视口宽度（兼容所有浏览器）
   *
   * @private
   * @returns {number} 返回视口宽度（单位：像素），若非浏览器环境返回 0
   */
  private _calcWidth(): number {
    if (typeof window === 'undefined') return 0;
    if (document.compatMode === 'CSS1Compat') {
      return document.documentElement.clientWidth || 0;
    }
    return document.body.clientWidth || 0;
  }

  /**
   * 计算当前视口高度（兼容所有浏览器）
   *
   * @private
   * @returns {number} 返回视口高度（单位：像素），若非浏览器环境返回 0
   */
  private _calcHeight(): number {
    if (typeof window === 'undefined') return 0;
    if (document.compatMode === 'CSS1Compat') {
      return document.documentElement.clientHeight || 0;
    }
    return document.body.clientHeight || 0;
  }

  /**
   * 获取当前视口尺寸
   *
   * @returns {{width: number, height: number}} 返回包含宽度和高度的对象，单位均为像素
   */
  size(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * 手动刷新视口宽高，重新计算当前视口尺寸
   *
   * @returns {void}
   */
  refresh(): void {
    this.width = this._calcWidth();
    this.height = this._calcHeight();
  }

  /**
   * 监听窗口尺寸变化事件，自动刷新宽高并执行回调函数
   *
   * @param {() => void} callback - 窗口尺寸变化时调用的回调函数
   * @returns {void}
   *
   * @example
   * viewport.onResize(() => {
   *   console.log('窗口尺寸变化', viewport.size());
   * });
   */
  onResize(callback: () => void): void {
    if (typeof window === 'undefined') return;

    this.resizeHandler = () => {
      this.refresh();
      callback();
    };

    if (window.addEventListener) {
      window.addEventListener('resize', this.resizeHandler, false);
    } else if ((window as any).attachEvent) {
      (window as any).attachEvent('onresize', this.resizeHandler);
    }
  }

  /**
   * 取消监听窗口尺寸变化事件，移除绑定的回调函数
   *
   * @returns {void}
   */
  offResize(): void {
    if (typeof window === 'undefined' || !this.resizeHandler) return;

    if (window.removeEventListener) {
      window.removeEventListener('resize', this.resizeHandler, false);
    } else if ((window as any).detachEvent) {
      (window as any).detachEvent('onresize', this.resizeHandler);
    }

    this.resizeHandler = null;
  }
}
