import { randBool, randBernoulli, randPoisson, randExponential, randBinomial } from './bool';

describe('randBool', () => {
  it('返回值是布尔类型', () => {
    const val = randBool();
    expect(typeof val).toBe('boolean');
  });

  it('多次调用返回true和false都出现', () => {
    const results = new Set<boolean>();
    for (let i = 0; i < 100; i++) {
      results.add(randBool());
      if (results.size === 2) break;
    }
    expect(results.has(true)).toBe(true);
    expect(results.has(false)).toBe(true);
  });
});

describe('概率分布随机函数测试', () => {
  describe('randBernoulli', () => {
    test('概率边界0和1', () => {
      expect(randBernoulli(0)).toBe(false);
      expect(randBernoulli(1)).toBe(true);
    });

    test('概率大致符合p', () => {
      const p = 0.7;
      const trials = 10000;
      let trueCount = 0;
      for (let i = 0; i < trials; i++) {
        if (randBernoulli(p)) trueCount++;
      }
      const freq = trueCount / trials;
      expect(freq).toBeGreaterThanOrEqual(p - 0.05);
      expect(freq).toBeLessThanOrEqual(p + 0.05);
    });
  });

  describe('randPoisson', () => {
    test('输出为非负整数', () => {
      for (let i = 0; i < 1000; i++) {
        const val = randPoisson(3);
        expect(Number.isInteger(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(0);
      }
    });

    test('平均值接近lambda', () => {
      const lambda = 4;
      const trials = 10000;
      let sum = 0;
      for (let i = 0; i < trials; i++) {
        sum += randPoisson(lambda);
      }
      const mean = sum / trials;
      expect(mean).toBeGreaterThanOrEqual(lambda - 0.1);
      expect(mean).toBeLessThanOrEqual(lambda + 0.1);
    });
  });

  describe('randExponential', () => {
    test('输出非负', () => {
      for (let i = 0; i < 1000; i++) {
        expect(randExponential(1)).toBeGreaterThanOrEqual(0);
      }
    });

    test('均值接近1/lambda', () => {
      const lambda = 2;
      const trials = 10000;
      let sum = 0;
      for (let i = 0; i < trials; i++) {
        sum += randExponential(lambda);
      }
      const mean = sum / trials;
      expect(mean).toBeGreaterThanOrEqual(1 / lambda - 0.05);
      expect(mean).toBeLessThanOrEqual(1 / lambda + 0.05);
    });
  });

  describe('randBinomial', () => {
    test('输出在0到n之间', () => {
      const n = 10;
      const p = 0.5;
      for (let i = 0; i < 1000; i++) {
        const val = randBinomial(n, p);
        expect(Number.isInteger(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(n);
      }
    });

    test('均值接近n*p', () => {
      const n = 20;
      const p = 0.3;
      const trials = 10000;
      let sum = 0;
      for (let i = 0; i < trials; i++) {
        sum += randBinomial(n, p);
      }
      const mean = sum / trials;
      expect(mean).toBeGreaterThanOrEqual(n * p - 0.1);
      expect(mean).toBeLessThanOrEqual(n * p + 0.1);
    });
  });
});
