import { randColorRGB, randColorCMYK, randColorHSL, randColorHEX, randColorHexShort } from './color';

describe('Color Generator Functions', () => {
  test('randColorRGB should return valid rgb string with correct range', () => {
    for (let i = 0; i < 10; i++) {
      const rgb = randColorRGB();
      expect(rgb).toMatch(/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/);

      const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(255);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(255);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(255);
    }
  });

  test('randColorCMYK should return valid cmyk string with correct range', () => {
    for (let i = 0; i < 10; i++) {
      const cmyk = randColorCMYK();
      expect(cmyk).toMatch(/^cmyk\(\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/);

      const [c, m, y, k] = cmyk.match(/\d+/g)!.map(Number);
      [c, m, y, k].forEach(val => {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      });
    }
  });

  test('randColorHSL should return valid hsl string with correct range', () => {
    for (let i = 0; i < 10; i++) {
      const hsl = randColorHSL();
      expect(hsl).toMatch(/^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/);

      const [h, s, l] = hsl.match(/\d+/g)!.map(Number);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(360);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
      expect(l).toBeGreaterThanOrEqual(0);
      expect(l).toBeLessThanOrEqual(100);
    }
  });

  test('randColorHEX should return valid hex string with default length (6)', () => {
    for (let i = 0; i < 10; i++) {
      const hex = randColorHEX();
      expect(hex).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  test('randColorHEX should return valid hex string with custom length', () => {
    const length = 3;
    for (let i = 0; i < 10; i++) {
      const hex = randColorHEX(length);
      const regex = new RegExp(`^#[0-9A-F]{${length}}$`, 'i');
      expect(hex).toMatch(regex);
    }
  });

  test('randColorHEX should support custom hex chars', () => {
    const customChars = 'ABCDEF';
    const length = 4;
    for (let i = 0; i < 10; i++) {
      const hex = randColorHEX(length, customChars);
      const regex = new RegExp(`^#[${customChars}]{${length}}$`, 'i');
      expect(hex).toMatch(regex);
    }
  });

  test('randColorHEX should handle invalid input gracefully', () => {
    expect(() => randColorHEX(0)).toThrow();
    expect(() => randColorHEX(-1)).toThrow();
    expect(() => randColorHEX(3, '')).toThrow();
    expect(() => randColorHEX(3, 'GHIJKL')).toThrow();
  });
});

describe('randColorHexShort 测试', () => {
  test('生成合法的三位短HEX颜色字符串', () => {
    for (let i = 0; i < 100; i++) {
      const color = randColorHexShort();
      // 格式必须是#加3个16进制字符
      expect(color).toMatch(/^#[0-9a-f]{3}$/);
      // 验证每个字符都在默认hex字符串中
      const hexChars = '0123456789abcdef';
      for (let j = 1; j < color.length; j++) {
        expect(hexChars.includes(color[j])).toBe(true);
      }
    }
  });

  test('自定义hex字符集生成合法颜色', () => {
    const customHex = 'abc'; // 限制字符集
    for (let i = 0; i < 50; i++) {
      const color = randColorHexShort(customHex);
      expect(color.length).toBe(4);
      expect(color[0]).toBe('#');
      for (let j = 1; j < color.length; j++) {
        expect(customHex.includes(color[j])).toBe(true);
      }
    }
  });
});
