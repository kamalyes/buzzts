/**
 * @func isSupportWebP
 * @desc 判断浏览器是否支持webP格式图片
 * @returns {boolean}
 * @example if (isSupportWebP()) {...}
 */
export const isSupportWebP = (): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // SSR 环境默认不支持
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    if (!!canvas.getContext && canvas.getContext('2d')) {
      const dataUrl = canvas.toDataURL('image/webp');
      return dataUrl.startsWith('data:image/webp');
    }
    return false;
  } catch {
    return false;
  }
};
