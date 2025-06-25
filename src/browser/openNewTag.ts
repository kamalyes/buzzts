/**
 * @func openNewTag
 * @param {string} url - 目标链接
 * @param {number} [tagType=1] - 打开方式，1=新标签页，2=弹窗，其他=嵌入（待实现）
 * @returns {void}
 * @desc 打开新标签页或弹窗
 */
export function openNewTag(url: string, tagType: number = 1): void {
  if (typeof window === 'undefined' || typeof window.open !== 'function') return; // 非浏览器环境或不支持 window.open，直接返回

  switch (tagType) {
    case 1: // 新标签页打开
      window.open(url, '_blank');
      break;
    case 2: // 新建无状态弹窗打开
      window.open(
        url,
        '_blank',
        'width=800,height=600,top=150,left=300,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,modal=false,alwaysRaised=yes',
      );
      break;
    default: // UUOA内嵌页面打开（待实现）
      console.warn('openNewTag: 内嵌页面打开方式尚未实现');
      break;
  }
}
