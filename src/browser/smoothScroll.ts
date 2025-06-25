/**
 * @func smoothScroll
 * @param {number} to 滚动到的位置
 * @param {number} duration 滚动的时间，单位毫秒，默认300ms
 * @returns {void}
 * @desc 📝 平滑滚动到指定位置，带缓动效果
 * @example smoothScroll(0, 1000);
 */
export const smoothScroll = (to: number, duration: number = 300): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return; // SSR 环境不执行

  const scrollElement = document.documentElement || document.body;
  const start = scrollElement.scrollTop;
  const change = to - start;
  const startTime = performance.now();

  const easeInOutQuad = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const tick = (): void => {
    const now = performance.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);

    window.scrollTo(0, start + change * easedProgress);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
};
