/**
 * @func getClientWidth
 * @returns {number}
 * @desc 📝 获取可视窗口的宽度
 * @example const clientW = getClientWidth();
 */
export const getClientWidth = (): number => {
  if (typeof window === 'undefined') return 0; // SSR 环境保护

  const doc = document;
  const isQuirksMode = doc.compatMode === 'BackCompat';
  const el = isQuirksMode ? doc.body : doc.documentElement;

  return el?.clientWidth || 0;
};
