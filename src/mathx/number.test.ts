import { compareNumber } from './number';

describe('compareNumber 函数测试', () => {
  test('基准值大于当前值', () => {
    // 测试基准值大于当前值的情况
    const result = compareNumber(5, 3);
    expect(result).toBe(2);
  });

  test('基准值小于当前值', () => {
    // 测试基准值小于当前值的情况
    const result = compareNumber(3, 5);
    expect(result).toBe(-2);
  });

  test('基准值等于当前值', () => {
    // 测试基准值等于当前值的情况
    const result = compareNumber(4, 4);
    expect(result).toBe(0);
  });

  test('基准值为负数，当前值为正数', () => {
    // 测试基准值为负数，当前值为正数的情况
    const result = compareNumber(-3, 2);
    expect(result).toBe(-5);
  });

  test('基准值为正数，当前值为负数', () => {
    // 测试基准值为正数，当前值为负数的情况
    const result = compareNumber(2, -3);
    expect(result).toBe(5);
  });

  test('基准值和当前值都是负数', () => {
    // 测试基准值和当前值都是负数的情况
    const result = compareNumber(-5, -3);
    expect(result).toBe(-2);
  });
});
