import { isNumberWithRules } from './number';

describe('isNumberWithRules 函数测试', () => {
  test('默认配置下整数校验', () => {
    expect(isNumberWithRules('123')).toBe(true);
    expect(isNumberWithRules('+123')).toBe(true);
    expect(isNumberWithRules('-123')).toBe(true);
    expect(isNumberWithRules('0123')).toBe(false); // 非零开头默认true，不允许0开头
    expect(isNumberWithRules('0')).toBe(false); // 非零开头，0不通过
    expect(isNumberWithRules('')).toBe(false);
    expect(isNumberWithRules('+')).toBe(false);
  });

  test('允许正号关闭', () => {
    expect(isNumberWithRules('+123', { allowPositiveSign: false })).toBe(false);
    expect(isNumberWithRules('-123', { allowPositiveSign: false })).toBe(true);
  });

  test('允许负号关闭', () => {
    expect(isNumberWithRules('-123', { allowNegativeSign: false })).toBe(false);
    expect(isNumberWithRules('+123', { allowNegativeSign: false })).toBe(true);
  });

  test('整数部分长度限制', () => {
    expect(isNumberWithRules('12', { minIntegerLength: 3 })).toBe(false);
    expect(isNumberWithRules('123', { minIntegerLength: 3 })).toBe(true);
    expect(isNumberWithRules('1234', { maxIntegerLength: 3 })).toBe(false);
    expect(isNumberWithRules('123', { maxIntegerLength: 3 })).toBe(true);
  });

  test('允许小数且限制小数位数', () => {
    expect(isNumberWithRules('123.55', { allowDecimal: true, maxDecimalLength: 2 })).toBe(true);
    expect(isNumberWithRules('123.556', { allowDecimal: true, maxDecimalLength: 2 })).toBe(false);
    expect(isNumberWithRules('123.', { allowDecimal: true, minDecimalLength: 1 })).toBe(false);
    expect(isNumberWithRules('123.0', { allowDecimal: true, minDecimalLength: 1 })).toBe(true);
  });

  test('允许无整数部分', () => {
    expect(isNumberWithRules('.55', { allowDecimal: true, allowNoIntegerPart: true, maxDecimalLength: 2 })).toBe(true);
    expect(isNumberWithRules('.55', { allowDecimal: true, allowNoIntegerPart: false })).toBe(false);
  });

  test('非零开头关闭', () => {
    expect(isNumberWithRules('0123', { nonZeroStart: false })).toBe(true);
    expect(isNumberWithRules('0', { nonZeroStart: false })).toBe(true);
  });

  test('组合复杂测试', () => {
    expect(
      isNumberWithRules('+123.55', {
        allowPositiveSign: true,
        allowNegativeSign: true,
        allowDecimal: true,
        maxDecimalLength: 2,
        minDecimalLength: 1,
        minIntegerLength: 1,
        maxIntegerLength: 5,
        allowNoIntegerPart: false,
        nonZeroStart: true,
      }),
    ).toBe(true);

    expect(
      isNumberWithRules('-.55', {
        allowPositiveSign: true,
        allowNegativeSign: true,
        allowDecimal: true,
        maxDecimalLength: 2,
        allowNoIntegerPart: true,
      }),
    ).toBe(true);

    expect(
      isNumberWithRules('-0.55', {
        allowPositiveSign: true,
        allowNegativeSign: true,
        allowDecimal: true,
        maxDecimalLength: 2,
        allowNoIntegerPart: false,
        nonZeroStart: false,
      }),
    ).toBe(true);

    expect(
      isNumberWithRules('-0.55', {
        allowPositiveSign: true,
        allowNegativeSign: true,
        allowDecimal: true,
        maxDecimalLength: 2,
        allowNoIntegerPart: false,
        nonZeroStart: true,
      }),
    ).toBe(false); // 因为nonZeroStart为true，0开头不允许
  });
});
