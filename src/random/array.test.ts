import {
  rangeWithStep,
  randUniformArray,
  randSelectWeighted,
  randSample,
  randUniqueSample,
  randShuffle,
} from './array';

describe('rangeWithStep', () => {
  test('默认步长1，升序区间', () => {
    expect(rangeWithStep(1, 3)).toEqual([1, 2, 3]);
  });

  test('默认步长1，降序区间，输出升序', () => {
    expect(rangeWithStep(3, 1)).toEqual([1, 2, 3]);
  });

  test('浮点步长', () => {
    expect(rangeWithStep(0, 1, 0.2)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
  });

  test('浮点步长2', () => {
    expect(rangeWithStep(1, 3, 0.5)).toEqual([1, 1.5, 2, 2.5, 3]);
  });

  test('步长为0抛错', () => {
    expect(() => rangeWithStep(1, 3, 0)).toThrow('step 必须为正数');
  });

  test('步长为负数抛错', () => {
    expect(() => rangeWithStep(1, 3, -1)).toThrow('step 必须为正数');
  });

  test('start === end', () => {
    expect(rangeWithStep(2, 2)).toEqual([2]);
  });
});

describe('随机函数测试', () => {
  test('randUniformArray 生成指定长度且值在[min,max]范围内', () => {
    for (let i = 0; i < 50; i++) {
      const arr = randUniformArray(10, 5, 15);
      expect(arr.length).toBe(10);
      arr.forEach(v => {
        expect(v).toBeGreaterThanOrEqual(5);
        expect(v).toBeLessThanOrEqual(15);
      });
    }
  });

  test('randSelectWeighted 根据权重随机选择元素', () => {
    const items = ['a', 'b', 'c'];
    const weights = [0, 0, 10];
    // 权重前两个为0，必选第三个
    for (let i = 0; i < 20; i++) {
      expect(randSelectWeighted(items, weights)).toBe('c');
    }

    // 权重均非0，测试返回值是否在items中
    const w2 = [1, 3, 6];
    for (let i = 0; i < 100; i++) {
      const res = randSelectWeighted(items, w2);
      expect(items).toContain(res);
    }
  });

  test('randSample 允许重复抽样，长度正确，元素均来自原数组', () => {
    const arr = [1, 2, 3, 4, 5];
    for (let i = 0; i < 20; i++) {
      const sample = randSample(arr, 3);
      expect(sample.length).toBe(3);
      sample.forEach(v => {
        expect(arr).toContain(v);
      });
    }
  });

  test('randUniqueSample 不重复抽样且长度正确，超长抛错', () => {
    const arr = [1, 2, 3, 4, 5];
    for (let i = 0; i < 20; i++) {
      const sample = randUniqueSample(arr, 3);
      expect(sample.length).toBe(3);
      sample.forEach(v => {
        expect(arr).toContain(v);
      });
      // 检查无重复
      const set = new Set(sample);
      expect(set.size).toBe(sample.length);
    }
    // 抽样数量大于数组长度应抛错
    expect(() => randUniqueSample(arr, 10)).toThrow('抽样数量不能大于数组长度');
  });

  test('randShuffle 返回新数组，且包含原数组所有元素', () => {
    const arr = [1, 2, 3, 4, 5];
    for (let i = 0; i < 20; i++) {
      const shuffled = randShuffle(arr);
      expect(shuffled.length).toBe(arr.length);
      // 元素相同
      expect(shuffled.sort()).toEqual(arr.slice().sort());
      // 可能顺序不同
      // 这里不强制测试顺序不同，因为极端情况下可能相同
    }
  });
});
