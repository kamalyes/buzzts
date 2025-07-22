import { randBool, randBoolWeighted, randBernoulli, randPoisson, randExponential, randBinomial } from './bool';

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

describe('randBoolWeighted', () => {
  // 测试当 p 小于等于 0 时，应该返回 false
  test('应该在 p <= 0 时返回 false', () => {
    expect(randBoolWeighted(0)).toBe(false); // p = 0 时返回 false
    expect(randBoolWeighted(-0.1)).toBe(false); // p = -0.1 时返回 false
  });

  // 测试当 p 大于等于 1 时，应该返回 true
  test('应该在 p >= 1 时返回 true', () => {
    expect(randBoolWeighted(1)).toBe(true); // p = 1 时返回 true
    expect(randBoolWeighted(1.5)).toBe(true); // p = 1.5 时返回 true
  });

  // 测试应该大约有 p% 的概率返回 true
  test('应该大约在 p% 的时间内返回 true', () => {
    const p = 0.8; // 设置概率 p 为 0.8
    const trials = 10000; // 进行 10000 次试验
    let trueCount = 0; // 统计返回 true 的次数

    for (let i = 0; i < trials; i++) {
      if (randBoolWeighted(p)) {
        trueCount++; // 如果返回 true，则计数加 1
      }
    }

    const trueProbability = trueCount / trials; // 计算返回 true 的概率
    expect(trueProbability).toBeGreaterThan(0.75); // 期望概率大于 75%
    expect(trueProbability).toBeLessThan(0.85); // 期望概率小于 85%
  });

  // 测试应该大约有 (1-p)% 的概率返回 false
  test('应该大约在 (1-p)% 的时间内返回 false', () => {
    const p = 0.2; // 设置概率 p 为 0.2
    const trials = 10000; // 进行 10000 次试验
    let falseCount = 0; // 统计返回 false 的次数

    for (let i = 0; i < trials; i++) {
      if (!randBoolWeighted(p)) {
        falseCount++; // 如果返回 false，则计数加 1
      }
    }

    const falseProbability = falseCount / trials; // 计算返回 false 的概率
    expect(falseProbability).toBeGreaterThan(0.75); // 期望概率大于 75%
    expect(falseProbability).toBeLessThan(0.85); // 期望概率小于 85%
  });

  // 测试默认 p 值时应该返回 true 或 false
  test('在默认 p 值下应该返回 true 或 false', () => {
    const trials = 10000; // 进行 10000 次试验
    let trueCount = 0; // 统计返回 true 的次数

    for (let i = 0; i < trials; i++) {
      if (randBoolWeighted()) {
        trueCount++; // 如果返回 true，则计数加 1
      }
    }

    const trueProbability = trueCount / trials; // 计算返回 true 的概率
    expect(trueProbability).toBeGreaterThan(0.45); // 期望概率大于 45%
    expect(trueProbability).toBeLessThan(0.55); // 期望概率小于 55%
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
