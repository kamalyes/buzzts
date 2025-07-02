/**
 * 弹窗参数配置接口
 */
interface PopupOptions {
  /** 弹窗宽度，单位px */
  width?: number;
  /** 弹窗高度，单位px */
  height?: number;
  /** 弹窗距离屏幕顶部的位置，单位px */
  top?: number;
  /** 弹窗距离屏幕左侧的位置，单位px */
  left?: number;
  /** 是否显示工具栏，'yes'或'no' */
  toolbar?: 'yes' | 'no';
  /** 是否显示地址栏，'yes'或'no' */
  location?: 'yes' | 'no';
  /** 是否显示状态栏，'yes'或'no' */
  status?: 'yes' | 'no';
  /** 是否显示菜单栏，'yes'或'no' */
  menubar?: 'yes' | 'no';
  /** 是否显示滚动条，'yes'或'no' */
  scrollbars?: 'yes' | 'no';
  /** 是否允许调整大小，'yes'或'no' */
  resizable?: 'yes' | 'no';
  /** 是否模态弹窗，默认为false */
  modal?: boolean;
  /** 是否总是置顶，默认为true */
  alwaysRaised?: boolean;
}

/**
 * 打开页面相关回调接口
 */
interface OpenCallbacks {
  /**
   * 打开窗口后的回调
   * @param win 新打开的窗口对象，弹窗或新标签页；内嵌方式返回null
   */
  onOpen?: (win: Window | null) => void;

  /**
   * 弹窗关闭时触发的回调，仅弹窗方式有效
   */
  onClose?: () => void;
}

/**
 * 页面打开工具类，支持新标签页、弹窗及内嵌iframe三种打开方式
 */
export class TagOpener {
  /**
   * 打开方式枚举，方便调用时传参
   */
  static OpenType = {
    /** 新标签页打开 */
    NEW_TAB: 1,
    /** 弹窗打开 */
    POPUP: 2,
    /** 内嵌iframe打开 */
    EMBEDDED: 3,
  } as const;

  /**
   * 默认弹窗参数配置
   */
  private static defaultPopupOptions: PopupOptions = {
    width: 800,
    height: 600,
    top: 150,
    left: 300,
    toolbar: 'no',
    location: 'no',
    status: 'no',
    menubar: 'no',
    scrollbars: 'yes',
    resizable: 'yes',
    modal: false,
    alwaysRaised: true,
  };

  /**
   * 打开页面
   * @param url 目标链接地址
   * @param tagType 打开方式，默认新标签页。可选值见 {@link TagOpener.OpenType}
   * @param popupOptions 弹窗参数，仅当tagType为POPUP时生效
   * @param callbacks 打开页面相关回调函数
   * @param embedContainer 内嵌打开时的容器元素，仅当tagType为EMBEDDED时生效
   */
  open(
    url: string,
    tagType: number = TagOpener.OpenType.NEW_TAB,
    popupOptions?: PopupOptions,
    callbacks?: OpenCallbacks,
    embedContainer?: HTMLElement,
  ): void {
    if (typeof window === 'undefined') {
      console.warn('TagOpener: 非浏览器环境，无法打开页面');
      return;
    }

    switch (tagType) {
      case TagOpener.OpenType.NEW_TAB:
        // 新标签页打开
        const newTab = window.open(url, '_blank');
        if (!newTab) {
          console.warn('TagOpener: 新标签页打开被拦截');
        }
        callbacks?.onOpen?.(newTab);
        break;

      case TagOpener.OpenType.POPUP: {
        // 弹窗打开，合并默认配置和传入配置
        const opts = { ...TagOpener.defaultPopupOptions, ...popupOptions };
        // 将配置转换成window.open的features字符串
        const features = Object.entries(opts)
          .map(([key, value]) => {
            if (typeof value === 'boolean') return `${key}=${value ? 'yes' : 'no'}`;
            return `${key}=${value}`;
          })
          .join(',');

        const popupWin = window.open(url, '_blank', features);
        if (!popupWin) {
          console.warn('TagOpener: 弹窗打开被拦截');
          callbacks?.onOpen?.(null);
          return;
        }
        callbacks?.onOpen?.(popupWin);

        // 监听弹窗关闭事件，定时检测窗口是否关闭
        if (callbacks?.onClose) {
          const timer = setInterval(() => {
            if (popupWin.closed) {
              clearInterval(timer);
              callbacks.onClose?.();
            }
          }, 500);
        }
        break;
      }

      case TagOpener.OpenType.EMBEDDED:
        // 内嵌iframe打开
        if (!embedContainer) {
          console.warn('TagOpener: 内嵌打开方式需要传入容器元素');
          return;
        }
        this.openEmbedded(url, embedContainer);
        callbacks?.onOpen?.(null);
        break;

      default:
        console.warn('TagOpener: 未知打开方式');
        break;
    }
  }

  /**
   * 内嵌打开实现，向指定容器插入iframe元素
   * @param url 目标链接地址
   * @param container 容器元素，iframe将被插入此元素内部
   */
  private openEmbedded(url: string, container: HTMLElement) {
    // 清空容器内容，避免重复插入多个iframe
    container.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    container.appendChild(iframe);
  }
}
