import { isNumberWithRules, isScientificNotation } from './number';

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

  // 测试无效的最小整数部分长度时应抛出错误
  test('应在无效的 minIntegerLength 时抛出错误', () => {
    expect(() => isNumberWithRules('123', { minIntegerLength: -1 })).toThrow('整数部分长度配置错误');
  });

  // 测试无效的最大整数部分长度时应抛出错误
  test('应在无效的 maxIntegerLength 时抛出错误', () => {
    expect(() => isNumberWithRules('123', { minIntegerLength: 1, maxIntegerLength: 0 })).toThrow(
      '整数部分长度配置错误',
    );
    expect(() => isNumberWithRules('123', { minIntegerLength: 2, maxIntegerLength: 1 })).toThrow(
      '整数部分长度配置错误',
    );
  });

  // 测试无效的最小小数部分长度时应抛出错误
  test('应在无效的 minDecimalLength 时抛出错误', () => {
    expect(() => isNumberWithRules('123.45', { minDecimalLength: -1 })).toThrow('小数部分长度配置错误');
  });

  // 测试无效的最大小数部分长度时应抛出错误
  test('应在无效的 maxDecimalLength 时抛出错误', () => {
    expect(() => isNumberWithRules('123.45', { minDecimalLength: 1, maxDecimalLength: 0 })).toThrow(
      '小数部分长度配置错误',
    );
    expect(() => isNumberWithRules('123.45', { minDecimalLength: 2, maxDecimalLength: 1 })).toThrow(
      '小数部分长度配置错误',
    );
  });

  // 测试当不允许小数但指定了小数位数时应抛出错误
  test('当不允许小数但指定小数位数时应抛出错误', () => {
    expect(() => isNumberWithRules('123.45', { allowDecimal: false, minDecimalLength: 1 })).toThrow(
      '不允许小数时，小数位数应为0',
    );
    expect(() => isNumberWithRules('123.45', { allowDecimal: false, maxDecimalLength: 1 })).toThrow(
      '不允许小数时，小数位数应为0',
    );
  });

  // 测试有效配置时不应抛出错误
  test('应在有效配置时不抛出错误', () => {
    expect(() => isNumberWithRules('123', { minIntegerLength: 1 })).not.toThrow(); // 最小整数长度为 1
    expect(() => isNumberWithRules('123.45', { allowDecimal: true, minDecimalLength: 0 })).not.toThrow(); // 允许小数且最小小数长度为 0
    expect(() => isNumberWithRules('+123', { allowPositiveSign: true })).not.toThrow(); // 允许正号
    expect(() => isNumberWithRules('-123.45', { allowNegativeSign: true, allowDecimal: true })).not.toThrow(); // 允许负号和小数
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

describe('isScientificNotation', () => {
  test('应在有效的科学计数法时返回 true', () => {
    expect(isScientificNotation('1.23e10')).toBe(true);
    expect(isScientificNotation('4.56E-5')).toBe(true);
    expect(isScientificNotation('-7.89e+3')).toBe(true);
    expect(isScientificNotation('.5e2')).toBe(true);
    expect(isScientificNotation('123e4')).toBe(true);
    expect(isScientificNotation('0e0')).toBe(true); // 边界情况
    expect(isScientificNotation('1e-10')).toBe(true); // 负指数
    expect(isScientificNotation('1.0E+0')).toBe(true); // 正指数为0
    expect(isScientificNotation('2.5e+15')).toBe(true); // 大数
    expect(isScientificNotation('-0.123E-4')).toBe(true); // 负小数和负指数
    expect(isScientificNotation('3.14159e+2')).toBe(true); // π 的近似值
    expect(isScientificNotation('1.23456789e10')).toBe(true); // 长小数
  });

  test('应在无效的科学计数法时返回 false', () => {
    expect(isScientificNotation('not a number')).toBe(false);
    expect(isScientificNotation('1.2.3e4')).toBe(false);
    expect(isScientificNotation('123abc')).toBe(false);
    expect(isScientificNotation('1.2e-3.4')).toBe(false);
    expect(isScientificNotation('')).toBe(false);
    expect(isScientificNotation('e10')).toBe(false); // 缺少底数
    expect(isScientificNotation('1e')).toBe(false); // 缺少指数
    expect(isScientificNotation('1e+')).toBe(false); // 指数符号后缺少数字
    expect(isScientificNotation('1e-')).toBe(false); // 指数符号后缺少数字
    expect(isScientificNotation('1.2e3.4')).toBe(false); // 指数部分有小数
    expect(isScientificNotation('++1.2e3')).toBe(false); // 多个正号
    expect(isScientificNotation('--1.2e3')).toBe(false); // 多个负号
    expect(isScientificNotation('1.2e3.4e5')).toBe(false); // 多个科学计数法
    expect(isScientificNotation('1.2e3e4')).toBe(false); // 嵌套的科学计数法
    expect(isScientificNotation('1.2e3.4e5')).toBe(false); // 嵌套的科学计数法
    expect(isScientificNotation('1.2e+3.4')).toBe(false); // 指数部分有小数
    expect(isScientificNotation('1.2e-10.2')).toBe(false); // 指数部分有小数
    expect(isScientificNotation('1.2e10e5')).toBe(false); // 额外的科学计数法
    expect(isScientificNotation('NaN')).toBe(false); // 特殊值 NaN
    expect(isScientificNotation('Infinity')).toBe(false); // 特殊值 Infinity
    expect(isScientificNotation('1.0e+')).toBe(false); // 指数符号后缺少数字
    expect(isScientificNotation('1e+2.5')).toBe(false); // 指数部分有小数
    expect(isScientificNotation('1.2e-')).toBe(false); // 指数符号后缺少数字
    expect(isScientificNotation(' ')).toBe(false); // 空格
    expect(isScientificNotation('1.2e3 ')).toBe(false); // 尾随空格
    expect(isScientificNotation(' 1.2e3')).toBe(false); // 前导空格
  });
});
