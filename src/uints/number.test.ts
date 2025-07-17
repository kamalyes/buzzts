import { intToLowerChinese, sumAverage, getDistance, getPercentage } from './number';

describe('intToLowerChinese', () => {
  test('转换普通数字', () => {
    expect(intToLowerChinese('123456789')).toBe('一亿二千三百四十五万六千七百八十九');
  });

  test('转换包含零的数字', () => {
    expect(intToLowerChinese('1002003')).toBe('一百万二千零三');
  });

  test('转换十位数起始为1的数字', () => {
    expect(intToLowerChinese('10')).toBe('十');
    expect(intToLowerChinese('11')).toBe('十一');
  });

  test('转换零', () => {
    expect(intToLowerChinese('0')).toBe('零');
  });
});

describe('sumAverage', () => {
  test('计算平均值', () => {
    expect(sumAverage([1, 2, 3, 4, 5])).toBe(3);
  });

  test('空数组返回NaN', () => {
    expect(sumAverage([])).toBeNaN();
  });

  test('包含负数', () => {
    expect(sumAverage([-1, 0, 1])).toBe(0);
  });
});

describe('getDistance', () => {
  test('计算两点距离', () => {
    expect(getDistance({ x: 1, y: 2 }, { x: 4, y: 6 })).toBeCloseTo(5);
  });

  test('相同点距离为0', () => {
    expect(getDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
  });

  test('负坐标点', () => {
    expect(getDistance({ x: -1, y: -2 }, { x: 3, y: 2 })).toBeCloseTo(5.6569, 4);
  });
});

describe('getPercentage', () => {
  test('计算正常百分比，指定小数位', () => {
    expect(getPercentage(1, 2, 2)).toBe('50.00%');
    expect(getPercentage(1, 3, 3)).toBe('33.333%');
    expect(getPercentage(5, 4, 1)).toBe('125.0%');
  });

  test('默认小数位为2', () => {
    expect(getPercentage(1, 3)).toBe('33.33%');
  });

  test('total为0时返回0%', () => {
    expect(getPercentage(0, 0)).toBe('0.00%');
    expect(getPercentage(1, 0)).toBe('0.00%');
  });

  test('参数非数字时抛出异常', () => {
    // @ts-expect-error 故意传入错误类型测试异常
    expect(() => getPercentage('1', 2, 2)).toThrow('所有参数必须为数字');
    // @ts-expect-error
    expect(() => getPercentage(1, '2', 2)).toThrow('所有参数必须为数字');
    // @ts-expect-error
    expect(() => getPercentage(1, 2, '2')).toThrow('所有参数必须为数字');
  });
});
