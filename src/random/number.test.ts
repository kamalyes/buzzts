import { randInt, randFloat, randAngle, randCirclePointInside } from './number';

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

describe('几何随机函数测试', () => {
  describe('randAngle', () => {
    test('返回值在0到360之间', () => {
      for (let i = 0; i < 1000; i++) {
        const angle = randAngle();
        expect(angle).toBeGreaterThanOrEqual(0);
        expect(angle).toBeLessThan(360);
      }
    });
  });

  describe('randCirclePointInside', () => {
    const radius = 10;

    test('返回点在圆内', () => {
      for (let i = 0; i < 1000; i++) {
        const point = randCirclePointInside(radius);
        const dist = Math.sqrt(point.x ** 2 + point.y ** 2);
        expect(dist).toBeLessThanOrEqual(radius);
      }
    });

    test('点均匀分布（简单统计半径均值）', () => {
      // 理论上半径的均值为 2/3 * radius
      // E[r] = ∫0^radius r * (2r / radius^2) dr = 2/3 * radius
      // 这里用采样平均距离中心的距离验证
      const trials = 10000;
      let sumDist = 0;
      for (let i = 0; i < trials; i++) {
        const p = randCirclePointInside(radius);
        sumDist += Math.sqrt(p.x ** 2 + p.y ** 2);
      }
      const meanDist = sumDist / trials;
      const expectedMean = (2 / 3) * radius;
      expect(meanDist).toBeGreaterThanOrEqual(expectedMean - 0.1);
      expect(meanDist).toBeLessThanOrEqual(expectedMean + 0.1);
    });
  });
});
