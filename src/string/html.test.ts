import { escapeHtml, unescapeHtml } from './html';

describe('HTML 转义与反转义测试套件', () => {
  // ==================== escapeHtml 测试 ====================
  describe('escapeHtml() - HTML特殊字符转义', () => {
    it('应转义常规HTML字符', () => {
      expect(escapeHtml('<div>"test"</div>')).toBe('&lt;div&gt;&quot;test&quot;&lt;&#x2F;div&gt;');
      expect(escapeHtml("'single' & `backtick`")).toBe('&#39;single&#39; &amp; &#96;backtick&#96;');
    });

    it('应处理空字符串', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('应忽略无需转义的普通文本', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });

    it('应转义混合内容中的特殊字符', () => {
      expect(escapeHtml('a<b>c&d"e\'f/g')).toBe('a&lt;b&gt;c&amp;d&quot;e&#39;f&#x2F;g');
    });

    // 性能测试（非必须，用于大文本场景）
    it('应高效处理长文本（性能测试）', () => {
      const longText = '<script>'.repeat(10000);
      const start = performance.now();
      escapeHtml(longText);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10); // 确保10ms内完成
    });
  });

  // ==================== unescapeHtml 测试 ====================
  describe('unescapeHtml() - HTML实体反转义', () => {
    it('应反转义标准HTML实体', () => {
      expect(unescapeHtml('&lt;div&gt;')).toBe('<div>');
      expect(unescapeHtml('&#39;quote&#39;')).toBe("'quote'");
      expect(unescapeHtml('&amp;&amp;')).toBe('&&');
    });

    it('应处理空字符串', () => {
      expect(unescapeHtml('')).toBe('');
    });

    it('应保留未转义的普通文本', () => {
      expect(unescapeHtml('Normal text')).toBe('Normal text');
    });

    it('应正确处理混合内容', () => {
      expect(unescapeHtml('a&lt;b&amp;c&quot;d')).toBe('a<b&c"d');
    });

    it('应忽略非法HTML实体', () => {
      expect(unescapeHtml('&fake;')).toBe('&fake;'); // 不存在的实体
      expect(unescapeHtml('&amp;lt;')).toBe('&lt;'); // 嵌套实体
    });

    // 边界测试
    it('应处理边界情况（如单独&符号）', () => {
      expect(unescapeHtml('&')).toBe('&'); // 单独的&不处理
      expect(unescapeHtml('&;')).toBe('&;'); // 不完整实体
    });
  });

  // ==================== 联合测试 ====================
  describe('escapeHtml + unescapeHtml 联合测试', () => {
    it('应保证转义后反转义还原原始字符串', () => {
      const original = '<script>alert("XSS")</script>';
      const escaped = escapeHtml(original);
      expect(unescapeHtml(escaped)).toBe(original);
    });

    it('应处理Unicode字符', () => {
      const text = '中文<script>测试';
      expect(unescapeHtml(escapeHtml(text))).toBe(text);
    });
  });
});
