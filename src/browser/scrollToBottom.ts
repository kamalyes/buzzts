/**
 * @func scrollToBottom
 * @returns {void}
 * @desc 📝 平滑滚动到底部
 * @example scrollToBottom();
 */
export const scrollToBottom = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return; // SSR 环境不执行

  const scrollElement = document.documentElement || document.body;
  const currentScroll = scrollElement.scrollTop;
  const scrollHeight = scrollElement.scrollHeight;
  const clientHeight = window.innerHeight || scrollElement.clientHeight;

  // 目标位置是 scrollHeight - clientHeight
  const targetScroll = scrollHeight - clientHeight;

  if (currentScroll < targetScroll) {
    // 计算增量，距离底部的1/8
    const distance = targetScroll - currentScroll;
    const step = Math.max(distance / 8, 1); // 最小步长1，避免停滞

    window.scrollTo(0, currentScroll + step);
    window.requestAnimationFrame(scrollToBottom);
  }
};
