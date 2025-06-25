import { randInt, randFloat } from './int';

describe('randInt', () => {
  it('返回整数且在[min, max)范围内', () => {
    const min = 5;
    const max = 10;
    for (let i = 0; i < 100; i++) {
      const val = randInt(min, max);
      expect(Number.isInteger(val)).toBe(true);
      expect(val).toBeGreaterThanOrEqual(min);
      expect(val).toBeLessThan(max);
    }
  });

  it('当min === max时返回min', () => {
    expect(randInt(7, 7)).toBe(7);
  });

  it('当max < min时自动交换参数', () => {
    const min = 10;
    const max = 5;
    for (let i = 0; i < 100; i++) {
      const val = randInt(min, max);
      expect(Number.isInteger(val)).toBe(true);
      expect(val).toBeGreaterThanOrEqual(max);
      expect(val).toBeLessThan(min);
    }
  });
});

describe('randFloat', () => {
  it('返回浮点数且在[min, max)范围内', () => {
    const min = 1.5;
    const max = 3.5;
    for (let i = 0; i < 100; i++) {
      const val = randFloat(min, max);
      expect(typeof val).toBe('number');
      expect(val).toBeGreaterThanOrEqual(min);
      expect(val).toBeLessThan(max);
    }
  });

  it('当min === max时返回min', () => {
    const val = randFloat(2, 2);
    expect(val).toBe(2);
  });

  it('当max < min时，返回值应在[min, max)区间（自动交换）', () => {
    const min = 4.5;
    const max = 2.5;
    for (let i = 0; i < 100; i++) {
      const val = randFloat(min, max);
      expect(typeof val).toBe('number');
      expect(val).toBeGreaterThanOrEqual(max);
      expect(val).toBeLessThan(min);
    }
  });
});
