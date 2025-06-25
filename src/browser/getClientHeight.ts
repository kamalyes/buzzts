/**
 * @func getClientHeight
 * @returns {number}
 * @desc 📝 获取可视窗口的高度
 * @example getClientHeight();
 */
export const getClientHeight = (): number => {
  if (typeof window === 'undefined') return 0; // 防止非浏览器环境报错

  const bodyHeight = document.body?.clientHeight || 0;
  const docElHeight = document.documentElement?.clientHeight || 0;

  // 返回两者中较小的非零值，如果都为0，则返回0
  if (bodyHeight && docElHeight) {
    return Math.min(bodyHeight, docElHeight);
  }

  return bodyHeight || docElHeight || 0;
};
