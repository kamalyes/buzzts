/**
 * @func scrollToTop
 * @returns {void}
 * @desc 📝 平滑滚动到顶部
 * @example scrollToTop();
 */
export const scrollToTop = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return; // SSR 环境不执行

  const scrollElement = document.documentElement || document.body;
  const currentScroll = scrollElement.scrollTop;

  if (currentScroll > 0) {
    const step = Math.max(currentScroll / 8, 1); // 最小步长1，避免停滞
    window.scrollTo(0, currentScroll - step);
    window.requestAnimationFrame(scrollToTop);
  }
};
