import { RmbFormatter, upperMoney } from './rmb';

describe('RmbFormatter', () => {
  let formatter: RmbFormatter;

  beforeEach(() => {
    formatter = new RmbFormatter();
  });

  describe('setAmount', () => {
    test('对无效金额抛出错误', () => {
      expect(() => formatter.setAmount(-1, 'yuan')).toThrow(
        'Invalid input: amount must be a non-negative number or a numeric string.',
      );
      expect(() => formatter.setAmount('abc', 'jiao')).toThrow(
        'Invalid input: amount must be a non-negative number or a numeric string.',
      );
      expect(() => formatter.setAmount(NaN, 'cents')).toThrow(
        'Invalid input: amount must be a non-negative number or a numeric string.',
      );
    });

    test('可以设置有效的字符串金额', () => {
      formatter.setAmount('100', 'yuan');
      expect(formatter.toCents()).toBe('10000.00');
      formatter.setAmount('10.5', 'jiao');
      expect(formatter.toCents()).toBe('105.00');
    });
  });

  describe('setPrecision', () => {
    test('设置有效精度', () => {
      formatter.setPrecision(3);
      expect(formatter.toYuan()).toBe('0.000');
      formatter.setAmount(1, 'yuan');
      expect(formatter.toYuan()).toBe('1.000');
    });

    test('设置无效精度抛出错误', () => {
      expect(() => formatter.setPrecision(-1)).toThrow('Precision must be a non-negative integer.');
      expect(() => formatter.setPrecision(1.5)).toThrow('Precision must be a non-negative integer.');
    });
  });

  describe('toYuan', () => {
    test('分转元', () => {
      formatter.setAmount(10000, 'cents');
      expect(formatter.toYuan()).toBe('100.00');
    });

    test('角转元', () => {
      formatter.setAmount(1000, 'jiao');
      expect(formatter.toYuan()).toBe('100.00');
    });

    test('厘转元', () => {
      formatter.setAmount(1000, 'li');
      expect(formatter.toYuan()).toBe('1.00');
    });

    test('处理浮点数精度问题', () => {
      formatter.setAmount(100.123456, 'yuan');
      expect(formatter.toYuan()).toBe('100.12'); // 测试精度
    });

    test('处理零金额', () => {
      formatter.setAmount(0, 'yuan');
      expect(formatter.toYuan()).toBe('0.00');
    });
  });

  describe('toJiao', () => {
    test('分转角', () => {
      formatter.setAmount(1000, 'cents');
      expect(formatter.toJiao()).toBe('100.00');
    });

    test('元转角', () => {
      formatter.setAmount(1, 'yuan');
      expect(formatter.toJiao()).toBe('10.00');
    });

    test('厘转角', () => {
      formatter.setAmount(100, 'li');
      expect(formatter.toJiao()).toBe('1.00');
    });

    test('处理浮点数精度问题', () => {
      formatter.setAmount(0.123456, 'yuan');
      expect(formatter.toJiao()).toBe('1.23'); // 测试精度
    });

    test('处理零金额', () => {
      formatter.setAmount(0, 'yuan');
      expect(formatter.toJiao()).toBe('0.00');
    });
  });

  describe('toCents', () => {
    test('元转分', () => {
      formatter.setAmount(100, 'yuan');
      expect(formatter.toCents()).toBe('10000.00');
    });

    test('角转分', () => {
      formatter.setAmount(10, 'jiao');
      expect(formatter.toCents()).toBe('100.00');
    });

    test('分转分', () => {
      formatter.setAmount(1, 'cents');
      expect(formatter.toCents()).toBe('1.00');
    });

    test('厘转分', () => {
      formatter.setAmount(1, 'li');
      expect(formatter.toCents()).toBe('0.10');
    });

    test('处理浮点数精度问题', () => {
      formatter.setAmount(0.123456, 'yuan');
      expect(formatter.toCents()).toBe('12.35'); // 测试精度
    });

    test('处理零金额', () => {
      formatter.setAmount(0, 'yuan');
      expect(formatter.toCents()).toBe('0.00');
    });
  });

  describe('toLi', () => {
    test('分转厘', () => {
      formatter.setAmount(100, 'cents');
      expect(formatter.toLi()).toBe('1000.00');
    });

    test('元转厘', () => {
      formatter.setAmount(1, 'yuan');
      expect(formatter.toLi()).toBe('1000.00');
    });

    test('角转厘', () => {
      formatter.setAmount(1, 'jiao');
      expect(formatter.toLi()).toBe('100.00');
    });

    test('处理浮点数精度问题', () => {
      formatter.setAmount(0.123456, 'yuan');
      expect(formatter.toLi()).toBe('123.50'); // 测试精度
    });

    test('处理零金额', () => {
      formatter.setAmount(0, 'yuan');
      expect(formatter.toLi()).toBe('0.00');
    });
  });

  describe('重复调用', () => {
    test('多次设置和转换', () => {
      formatter.setAmount(1, 'yuan');
      expect(formatter.toCents()).toBe('100.00');
      formatter.setAmount(10, 'jiao');
      expect(formatter.toCents()).toBe('100.00');
      formatter.setAmount(100, 'cents');
      expect(formatter.toCents()).toBe('100.00');
    });
  });

  describe('边界值测试', () => {
    test('极小的金额', () => {
      formatter.setAmount(0.0001, 'yuan');
      expect(formatter.toCents()).toBe('0.01');
    });

    test('极大的金额', () => {
      formatter.setAmount(1000000, 'yuan');
      expect(formatter.toCents()).toBe('100000000.00');
    });
  });
});

describe('upperMoney', () => {
  test('转换整数', () => {
    expect(upperMoney(123456789)).toBe('壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元整');
    expect(upperMoney(1000)).toBe('壹仟元整');
    expect(upperMoney(0)).toBe('零元整');
  });

  test('转换小数', () => {
    expect(upperMoney(123456789.12)).toBe('壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元壹角贰分');
    expect(upperMoney(123456789.123)).toBe('壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元壹角贰分叁厘');
    expect(upperMoney(0.123)).toBe('壹角贰分叁厘');
  });

  test('处理负数', () => {
    expect(upperMoney(-123456789.12)).toBe('负壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元壹角贰分');
  });

  test('对于无效输入返回空', () => {
    expect(upperMoney(NaN)).toBe('');
    expect(upperMoney(Infinity)).toBe('');
    expect(upperMoney(-Infinity)).toBe('');
  });
});
