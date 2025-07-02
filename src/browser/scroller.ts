/**
 * 缓动函数类型
 * @param t 归一化时间进度，取值范围 [0, 1]
 * @returns 缓动结果，取值范围 [0, 1]
 */
export type EasingFunction = (t: number) => number;

/**
 * 滚动动画配置选项
 */
export interface ScrollerOptions {
  /** 动画持续时间，单位毫秒，默认500 */
  duration?: number;
  /** 缓动函数，默认使用 easeInOutQuad */
  easing?: EasingFunction;
  /** 滚动容器，默认为 window */
  container?: HTMLElement | Window;
}

/**
 * 默认缓动函数：easeInOutQuad
 * @param t 归一化时间进度，范围 0~1
 * @returns 缓动结果，范围 0~1
 */
const defaultEasing: EasingFunction = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/**
 * 平滑滚动控制类，支持横向和纵向的绝对及相对滚动，
 * 提供暂停、恢复和取消动画功能。
 */
export class Scroller {
  /** 滚动容器，HTMLElement 或 window */
  private container: HTMLElement | Window;

  /** 当前动画帧请求ID，用于取消动画 */
  private animationId: number | null = null;

  /** 动画起始时间戳（毫秒） */
  private startTime: number = 0;

  /** 动画起始横向滚动位置（像素） */
  private startX: number = 0;

  /** 动画起始纵向滚动位置（像素） */
  private startY: number = 0;

  /** 目标横向滚动位置（像素） */
  private targetX: number = 0;

  /** 目标纵向滚动位置（像素） */
  private targetY: number = 0;

  /** 动画持续时长，单位毫秒 */
  private duration: number = 500;

  /** 缓动函数 */
  private easing: EasingFunction = defaultEasing;

  /** 动画是否处于暂停状态 */
  private paused: boolean = false;

  /** 暂停时的时间戳 */
  private pauseTime: number = 0;

  /** 当前动画进度，范围 [0, 1] */
  private progress: number = 0;

  /**
   * 构造函数
   * @param container 滚动容器，默认为 window
   */
  constructor(container?: HTMLElement | Window) {
    this.container = container ?? window;
  }

  /**
   * 获取当前纵向滚动位置
   * @returns 当前纵向滚动偏移，单位像素
   */
  private getScrollTop(): number {
    if (this.container === window) {
      return window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    return (this.container as HTMLElement).scrollTop;
  }

  /**
   * 获取当前横向滚动位置
   * @returns 当前横向滚动偏移，单位像素
   */
  private getScrollLeft(): number {
    if (this.container === window) {
      return window.pageXOffset || document.documentElement.scrollLeft || 0;
    }
    return (this.container as HTMLElement).scrollLeft;
  }

  /**
   * 设置纵向滚动位置
   * @param value 目标纵向滚动值，单位像素
   */
  private setScrollTop(value: number): void {
    if (this.container === window) {
      window.scrollTo(this.getScrollLeft(), value);
    } else {
      (this.container as HTMLElement).scrollTop = value;
    }
  }

  /**
   * 设置横向滚动位置
   * @param value 目标横向滚动值，单位像素
   */
  private setScrollLeft(value: number): void {
    if (this.container === window) {
      window.scrollTo(value, this.getScrollTop());
    } else {
      (this.container as HTMLElement).scrollLeft = value;
    }
  }

  /**
   * 动画执行函数，逐帧更新滚动位置
   * 根据当前进度计算滚动位置，支持暂停功能
   */
  private animate(): void {
    if (this.paused) {
      // 暂停时更新时间戳，保持动画暂停状态
      this.pauseTime = performance.now();
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }

    const now = performance.now();
    const elapsed = now - this.startTime;
    this.progress = Math.min(elapsed / this.duration, 1);
    const easedProgress = this.easing(this.progress);

    // 计算当前滚动位置
    const currentX = this.startX + (this.targetX - this.startX) * easedProgress;
    const currentY = this.startY + (this.targetY - this.startY) * easedProgress;

    this.setScrollLeft(currentX);
    this.setScrollTop(currentY);

    if (this.progress < 1) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      // 动画完成，清理动画ID
      this.animationId = null;
    }
  }

  /**
   * 纵向滚动到指定绝对位置
   * @param targetY 目标纵向滚动位置，单位像素
   * @param options 动画配置，可选
   * @returns 当前实例，支持链式调用
   */
  yTo(targetY: number, options?: Omit<ScrollerOptions, 'container'>): this {
    const currentY = this.getScrollTop();
    if (currentY === targetY) {
      // 当前位置等于目标位置，无需动画
      this.cancel();
      return this;
    }
    this.cancel();
    this.startY = this.getScrollTop();
    this.targetY = targetY;
    this.startX = this.getScrollLeft();
    this.targetX = this.startX; // 横向保持不变
    this.duration = options?.duration ?? 500;
    this.easing = options?.easing ?? defaultEasing;
    this.paused = false;
    this.startTime = performance.now();
    this.animationId = requestAnimationFrame(() => this.animate());
    return this;
  }

  /**
   * 横向滚动到指定绝对位置
   * @param targetX 目标横向滚动位置，单位像素
   * @param options 动画配置，可选
   * @returns 当前实例，支持链式调用
   */
  xTo(targetX: number, options?: Omit<ScrollerOptions, 'container'>): this {
    const currentX = this.getScrollLeft();
    if (currentX === targetX) {
      // 当前位置等于目标位置，无需动画
      this.cancel();
      return this;
    }
    this.cancel();
    this.startX = this.getScrollLeft();
    this.targetX = targetX;
    this.startY = this.getScrollTop();
    this.targetY = this.startY; // 纵向保持不变
    this.duration = options?.duration ?? 500;
    this.easing = options?.easing ?? defaultEasing;
    this.paused = false;
    this.startTime = performance.now();
    this.animationId = requestAnimationFrame(() => this.animate());
    return this;
  }

  /**
   * 纵向相对滚动指定距离
   * @param deltaY 纵向滚动偏移量，正值向下，负值向上，单位像素
   * @param options 动画配置，可选
   * @returns 当前实例，支持链式调用
   */
  moveY(deltaY: number, options?: Omit<ScrollerOptions, 'container'>): this {
    const targetY = this.getScrollTop() + deltaY;
    return this.yTo(targetY, options);
  }

  /**
   * 横向相对滚动指定距离
   * @param deltaX 横向滚动偏移量，正值向右，负值向左，单位像素
   * @param options 动画配置，可选
   * @returns 当前实例，支持链式调用
   */
  moveX(deltaX: number, options?: Omit<ScrollerOptions, 'container'>): this {
    const targetX = this.getScrollLeft() + deltaX;
    return this.xTo(targetX, options);
  }

  /**
   * 取消当前滚动动画，停止动画帧请求
   * @returns 当前实例，支持链式调用
   */
  cancel(): this {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.paused = false;
    return this;
  }

  /**
   * 暂停当前滚动动画
   * @returns 当前实例，支持链式调用
   */
  pause(): this {
    if (!this.paused && this.animationId !== null) {
      this.paused = true;
      this.pauseTime = performance.now();
    }
    return this;
  }

  /**
   * 恢复暂停的滚动动画，调整起始时间以保证动画连贯
   * @returns 当前实例，支持链式调用
   */
  resume(): this {
    if (this.paused) {
      this.paused = false;
      const now = performance.now();
      const pauseDuration = now - this.pauseTime;
      this.startTime += pauseDuration;
      this.animationId = requestAnimationFrame(() => this.animate());
    }
    return this;
  }

  /**
   * 判断当前是否处于滚动动画中（非暂停状态）
   * @returns {boolean} true 表示正在滚动，false 表示空闲或暂停
   */
  isScrolling(): boolean {
    return this.animationId !== null && !this.paused;
  }
}
