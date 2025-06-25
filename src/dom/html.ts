/**
 * DOM 操作工具集
 * 提供了一系列常用的DOM操作方法，包括剪贴板操作、样式操作、类名操作、属性操作等
 */

/**
 * @func getFromClipboard
 * @desc 📝 安全获取剪贴板文本内容
 * @returns {Promise<string>} resolve时返回剪贴板文本，reject时返回错误
 * @throws {DOMException} 当用户未授权剪贴板权限时抛出
 * @example
 * getFromClipboard()
 *   .then(text => console.log('剪贴板内容:', text))
 *   .catch(err => console.error('读取失败:', err));
 */
export const getFromClipboard = (): Promise<string> => {
  // 检查剪贴板API是否可用
  if (!navigator.clipboard) {
    return Promise.reject(new Error('Clipboard API not available'));
  }

  return navigator.clipboard.readText();
};

/**
 * @func copyToClipboard
 * @desc 📝 安全写入文本到剪贴板
 * @param {string} text - 要写入的文本
 * @returns {Promise<void>}
 * @throws {DOMException} 当用户未授权剪贴板权限时抛出
 * @example
 * copyToClipboard('Hello World')
 *   .then(() => console.log('复制成功'))
 *   .catch(err => console.error('复制失败:', err));
 */
export const copyToClipboard = (text: string): Promise<void> => {
  if (!navigator.clipboard) {
    return Promise.reject(new Error('Clipboard API not available'));
  }

  return navigator.clipboard.writeText(text);
};

/**
 * @func removeHTMLTag
 * @desc 📝 移除字符串中的所有HTML标签，保留纯文本
 * @param {string} str - 包含HTML的字符串
 * @return {string} 清理后的纯文本
 * @example
 * const cleanText = removeHTMLTag('<p>Hello <b>World</b></p>'); // 'Hello World'
 */
export const removeHTMLTag = (str: string): string => str.replace(/<[^>]+>/g, '');

/**
 * @func escapeHTML
 * @desc 📝 转义HTML特殊字符，防止XSS攻击
 * @param {string} str - 需要转义的字符串
 * @return {string} 转义后的安全字符串
 * @example
 * escapeHTML('<script>alert("xss")</script>') // '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export const escapeHTML = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

type CSSStyleProps = Partial<{
  [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? string | null : never;
}>;

/**
 * @func setElementStyle
 * @desc 📝 批量设置元素的内联样式
 * @param {HTMLElement | null} el - 目标元素，为null时静默失败
 * @param {CSSStyleProps} styleObj - 样式键值对
 * @returns {void}
 * @example
 * setElementStyle(document.getElementById('app'), {
 *   color: 'red',
 *   fontSize: '16px',
 *   display: null // 移除该样式
 * });
 */

/**
 * @func setElementStyle
 * @desc 📝 批量设置元素的内联样式
 * @param {HTMLElement | null} el - 目标元素，为null时静默失败
 * @param {CSSStyleProps} styleObj - 样式键值对
 * @returns {void}
 * @example
 * setElementStyle(document.getElementById('app'), {
 *   color: 'red',
 *   fontSize: '16px',
 *   display: null // 移除该样式
 * });
 */
export const setElementStyle = (el: HTMLElement | null, styleObj: CSSStyleProps): void => {
  if (!el) return;

  Object.entries(styleObj).forEach(([key, value]) => {
    if (value === null) {
      el.style.removeProperty(key);
    } else if (typeof value === 'string') {
      // 只处理字符串类型的值，过滤掉undefined和其他类型
      el.style[key as any] = value;
    }
  });
};

/**
 * @func getElementStyle
 * @desc 📝 获取元素的计算样式值
 * @param {HTMLElement} el - 目标元素
 * @param {string} property - 要获取的CSS属性名
 * @return {string} 计算后的样式值
 * @example
 * const width = getElementStyle(element, 'width');
 */
export const getElementStyle = (el: HTMLElement, property: string): string => {
  return window.getComputedStyle(el).getPropertyValue(property);
};

/**
 * @func setProperties
 * @desc 📝 批量设置CSS自定义属性
 * @param {HTMLElement | null} el - 目标元素，为null时静默失败
 * @param {Record<string, string | null>} properties - 属性键值对
 * @returns {void}
 * @example
 * setProperties(document.documentElement, {
 *   '--primary-color': '#1890ff',
 *   '--old-color': null // 移除该属性
 * });
 */
export const setProperties = (el: HTMLElement | null, properties: Record<string, string | null>): void => {
  if (!el) return;

  Object.entries(properties).forEach(([key, value]) => {
    if (value === null) {
      el.style.removeProperty(key);
    } else {
      el.style.setProperty(key, value);
    }
  });
};

/**
 * @func toggleClass
 * @desc 📝 切换元素的类名
 * @param {HTMLElement} ele - 目标元素
 * @param {string} className - 要切换的类名
 * @param {boolean} [force] - 强制添加(true)或移除(false)
 * @returns {boolean} 操作后类名是否存在
 * @example
 * toggleClass(element, 'active'); // 切换类名
 * toggleClass(element, 'active', true); // 强制添加
 */
export const toggleClass = (ele: HTMLElement, className: string, force?: boolean): boolean => {
  const has = hasClass(ele, className);

  if (typeof force !== 'undefined') {
    force = Boolean(force);
    if (force !== has) {
      force ? addClass(ele, className) : removeClass(ele, className);
    }
    return force;
  }

  has ? removeClass(ele, className) : addClass(ele, className);
  return !has;
};

/**
 * @func hasClass
 * @desc 📝 检查元素是否包含指定类名
 * @param {HTMLElement} ele - 目标元素
 * @param {string} className - 要检查的类名
 * @return {boolean} 是否包含该类名
 * @example
 * if (hasClass(element, 'hidden')) { ... }
 */
export const hasClass = (ele: HTMLElement, className: string): boolean => {
  return ele.classList.contains(className);
};

/**
 * @func addClass
 * @desc 📝 为元素添加一个或多个类名
 * @param {HTMLElement} ele - 目标元素
 * @param {string | string[]} className - 要添加的类名(单个或多个)
 * @returns {void}
 * @example
 * addClass(element, 'active'); // 添加单个
 * addClass(element, ['active', 'highlight']); // 添加多个
 */
export const addClass = (ele: HTMLElement, className: string | string[]): void => {
  const classes = Array.isArray(className) ? className : [className];
  ele.classList.add(...classes);
};

/**
 * @func removeClass
 * @desc 📝 从元素移除一个或多个类名
 * @param {HTMLElement} ele - 目标元素
 * @param {string | string[]} className - 要移除的类名(单个或多个)
 * @returns {void}
 * @example
 * removeClass(element, 'active'); // 移除单个
 * removeClass(element, ['active', 'highlight']); // 移除多个
 */
export const removeClass = (ele: HTMLElement, className: string | string[]): void => {
  const classes = Array.isArray(className) ? className : [className];
  ele.classList.remove(...classes);
};

/**
 * @func getData
 * @desc 📝 获取元素的自定义data属性值
 * @param {HTMLElement} ele - 目标元素
 * @param {string} key - 属性名(不带data-前缀)
 * @return {string | null} 属性值，不存在时返回null
 * @example
 * const userId = getData(element, 'user-id');
 */
export const getData = (ele: HTMLElement, key: string): string | null => {
  return ele.dataset[key] || null;
};

/**
 * @func setData
 * @desc 📝 设置元素的自定义data属性
 * @param {HTMLElement} ele - 目标元素
 * @param {string} key - 属性名(不带data-前缀)
 * @param {string} value - 要设置的值
 * @returns {void}
 * @example
 * setData(element, 'user-id', '12345');
 */
export const setData = (ele: HTMLElement, key: string, value: string): void => {
  ele.dataset[key] = value;
};

/**
 * @func removeData
 * @desc 📝 移除元素的自定义data属性
 * @param {HTMLElement} ele - 目标元素
 * @param {string} key - 属性名(不带data-前缀)
 * @returns {void}
 * @example
 * removeData(element, 'user-id');
 */
export const removeData = (ele: HTMLElement, key: string): void => {
  delete ele.dataset[key];
};

/**
 * @func createElement
 * @desc 📝 快速创建带有属性和子元素的DOM元素
 * @param {string} tag - 标签名
 * @param {Record<string, string | boolean | EventListener>} [attrs] - 属性对象
 * @param {(string|Node|(string|Node)[])} [children] - 子元素或子元素数组
 * @return {HTMLElement} 创建的元素
 * @example
 * const el = createElement('div', { class: 'container' }, [
 *   createElement('span', {}, 'Hello'),
 *   ' World'
 * ]);
 */
export const createElement = (
  tag: string,
  attrs: Record<string, string | boolean | EventListener> = {},
  children?: string | Node | (string | Node)[],
): HTMLElement => {
  const el = document.createElement(tag);

  // 处理属性
  Object.entries(attrs).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      // 处理事件监听器
      el.addEventListener(key.substring(2).toLowerCase(), value as EventListener);
    } else if (typeof value === 'boolean') {
      // 处理布尔属性
      if (value) {
        el.setAttribute(key, '');
        (el as any)[key] = true;
      } else {
        el.removeAttribute(key);
        (el as any)[key] = false;
      }
    } else {
      // 处理普通属性
      el.setAttribute(key, String(value));
    }
  });

  // 处理子元素
  if (children !== undefined) {
    const childrenArray = Array.isArray(children) ? children : [children];
    childrenArray.forEach(child => {
      if (child !== null && child !== undefined) {
        el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
      }
    });
  }

  return el;
};

/**
 * @func appendChildren
 * @desc 📝 批量向父元素追加子节点（支持字符串、节点和空值过滤）
 * @param {HTMLElement} parent - 要追加到的父元素
 * @param {string | Node | (string | Node | null | undefined)[]} children - 子元素数组（支持字符串自动转文本节点）
 * @example
 * appendChildren(document.body, [
 *   '文本节点',
 *   document.createElement('div'),
 *   null,  // 自动跳过
 *   undefined // 自动跳过
 * ]); // 基础用法
 *
 * appendChildren(ulElement, items.map(item => {
 *   return item.valid ? createListItem(item) : null; // 动态创建列表
 * }));
 */
export function appendChildren(parent: HTMLElement, children: string | Node | (string | Node | null | undefined)[]) {
  const items = Array.isArray(children) ? children : [children];
  items.forEach(child => {
    if (child == null) return;

    const node = typeof child === 'string' ? document.createTextNode(child) : child;
    parent.appendChild(node);
  });
}

/**
 * @func delegateEvent
 * @desc 📝 事件委托工具
 * @param {HTMLElement} parent - 委托父元素
 * @param {string} event - 事件类型
 * @param {string} selector - 子元素选择器
 * @param {(el: HTMLElement, e: Event) => void} handler - 处理函数
 * @return {Function} 取消委托的函数
 * @example
 * const removeDelegate = delegateEvent(
 *   document.body,
 *   'click',
 *   '.btn',
 *   (el, e) => console.log('Button clicked:', el)
 * );
 * removeDelegate(); // 取消委托
 */
export const delegateEvent = (
  parent: HTMLElement,
  event: string,
  selector: string,
  handler: (el: HTMLElement, e: Event) => void,
): (() => void) => {
  const listener = (e: Event) => {
    const target = e.target as HTMLElement;
    const matched = target.closest(selector);
    if (matched && parent.contains(matched)) {
      handler(matched as HTMLElement, e);
    }
  };
  parent.addEventListener(event, listener);
  return () => parent.removeEventListener(event, listener);
};

/**
 * @func serializeForm
 * @desc 📝 序列化表单数据为对象
 * @param {HTMLFormElement} form - 表单元素
 * @return {Record<string, string>} 表单数据对象
 * @example
 * const data = serializeForm(document.querySelector('form')); // { username: 'john', password: '123' }
 */
export const serializeForm = (form: HTMLFormElement): Record<string, string> => {
  return Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
};

/**
 * @func setFormValues
 * @desc 📝 批量设置表单值
 * @param {HTMLFormElement} form - 表单元素
 * @param {Record<string, string>} values - 值对象
 * @example
 * setFormValues(form, { username: 'admin', remember: 'true' });
 */
export const setFormValues = (form: HTMLFormElement, values: Record<string, string>): void => {
  Object.entries(values).forEach(([name, value]) => {
    const element = form.elements.namedItem(name) as HTMLInputElement;
    if (element) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = element.value === value;
      } else {
        element.value = value;
      }
    }
  });
};

/**
 * @func isInViewport
 * @desc 📝 检测元素是否在可视区域内
 * @param {HTMLElement} el - 目标元素
 * @param {number} [threshold=0] - 可见比例阈值(0-1)
 * @return {boolean} 是否可见
 * @example
 * if (isInViewport(element, 0.5)) {
 *
 * } // 至少50%可见
 */
export const isInViewport = (el: HTMLElement, threshold = 0): boolean => {
  const rect = el.getBoundingClientRect();
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);

  const visibleHeight = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, viewWidth) - Math.max(rect.left, 0);

  const visibleArea = visibleHeight * visibleWidth;
  const totalArea = rect.height * rect.width;

  return visibleArea / totalArea >= threshold;
};

/**
 * @func animateTo
 * @desc 📝 使用Web Animations API执行动画
 * @param {HTMLElement} el - 目标元素
 * @param {Keyframe[]} keyframes - 关键帧
 * @param {number} duration - 持续时间(ms)
 * @param {KeyframeAnimationOptions} [options] - 动画选项
 * @return {Animation} 动画实例
 * @example
 * animateTo(element, [
 *   { opacity: 0 },
 *   { opacity: 1 }
 * ], 1000).finished.then(() => console.log('动画完成'));
 */
export const animateTo = (
  el: HTMLElement,
  keyframes: Keyframe[],
  duration: number,
  options?: KeyframeAnimationOptions,
): Animation => {
  return el.animate(keyframes, {
    duration,
    fill: 'both',
    ...options,
  });
};

/**
 * @func getElementRect
 * @desc 📝 获取元素相对于文档的位置和尺寸
 * @param {HTMLElement} el - 目标元素
 * @return {DOMRect} 元素的位置和尺寸信息
 * @example
 * const rect = getElementRect(element);
 * console.log(rect.width, rect.height);
 */
export const getElementRect = (el: HTMLElement): DOMRect => {
  const rect = el.getBoundingClientRect();
  return {
    ...rect,
    x: rect.x + window.scrollX,
    y: rect.y + window.scrollY,
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
  } as DOMRect;
};

/**
 * @func smoothScrollTo
 * @desc 📝 平滑滚动到指定位置或元素
 * @param {HTMLElement | number} target - 目标元素或位置
 * @param {'x' | 'y'} [direction='y'] - 滚动方向
 * @param {number} [offset=0] - 偏移量
 * @example
 * smoothScrollTo(document.getElementById('section')); // 滚动到元素顶部
 * smoothScrollTo(500); // 滚动到垂直位置500px
 */
export const smoothScrollTo = (target: HTMLElement | number, direction: 'x' | 'y' = 'y', offset = 0): void => {
  const position = typeof target === 'number' ? target : direction === 'y' ? target.offsetTop : target.offsetLeft;

  window.scrollTo({
    [direction === 'y' ? 'top' : 'left']: position + offset,
    behavior: 'smooth',
  });
};
