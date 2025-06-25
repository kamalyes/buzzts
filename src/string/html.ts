/**
 * HTML特殊字符转义
 * @param htmlStr 包含HTML的字符串
 * @returns 转义后的安全字符串
 * @example
 * escapeHtml('<div>"test"</div>') => '&lt;div&gt;&quot;test&quot;&lt;/div&gt;'
 */
export const escapeHtml = (htmlStr: string): string => {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
    '/': '&#x2F;',
  };
  return htmlStr.replace(/[&<>"'`\/]/g, char => escapeMap[char]);
};

/**
 * HTML实体反转义
 * @param escapedStr 转义后的字符串
 * @returns 原始字符串
 * @example
 * unescapeHtml('&lt;div&gt;') => '<div>'
 */
export const unescapeHtml = (escapedStr: string): string => {
  const unescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#96;': '`',
    '&#x2F;': '/',
  };
  return escapedStr.replace(/&(amp|lt|gt|quot|#39|#x27|#96|#x2F);/g, entity => unescapeMap[entity] || entity);
};
