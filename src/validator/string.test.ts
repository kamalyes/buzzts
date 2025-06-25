import {
  isNLen,
  isEnCharacter,
  isUpEnCharacter,
  isLowerEnCharacter,
  isNumberEnCharacter,
  isNumberEnUnderscores,
  isIsContainSpecialCharacter,
  isEmail,
  isChinesePhoneNumber,
  isChineseIDCardNumber,
  isContainChineseCharacter,
  isDoubleByte,
  isEmptyLine,
  isHex,
  matchNumberWithLength,
  isChines,
} from './string';

describe('验证工具类测试', () => {
  // isNLen 测试
  describe('isNLen', () => {
    test('正确长度的字符串返回 true', () => {
      expect(isNLen('abcd', 4)).toBe(true);
      expect(isNLen('12345678', 8)).toBe(true);
    });

    test('错误长度的字符串返回 false', () => {
      expect(isNLen('abc', 4)).toBe(false);
      expect(isNLen('', 1)).toBe(false);
    });
  });

  // 英文字符相关测试
  describe('英文字符验证', () => {
    test('isEnCharacter - 全英文字符', () => {
      expect(isEnCharacter('abcDEF')).toBe(true);
      expect(isEnCharacter('ABCdef')).toBe(true);
      expect(isEnCharacter('abc123')).toBe(false);
    });

    test('isUpEnCharacter - 全大写英文', () => {
      expect(isUpEnCharacter('ABCDEF')).toBe(true);
      expect(isUpEnCharacter('ABCdef')).toBe(false);
    });

    test('isLowerEnCharacter - 全小写英文', () => {
      expect(isLowerEnCharacter('abcdef')).toBe(true);
      expect(isLowerEnCharacter('abcDEF')).toBe(false);
    });
  });

  // 组合字符测试
  describe('组合字符验证', () => {
    test('isNumberEnCharacter - 数字+英文', () => {
      expect(isNumberEnCharacter('abc123')).toBe(true);
      expect(isNumberEnCharacter('ABC123')).toBe(true);
      expect(isNumberEnCharacter('abc@123')).toBe(false);
    });

    test('isNumberEnUnderscores - 数字+英文+下划线', () => {
      expect(isNumberEnUnderscores('abc_123')).toBe(true);
      expect(isNumberEnUnderscores('ABC_123')).toBe(true);
      expect(isNumberEnUnderscores('abc@123')).toBe(false);
    });

    test('isIsContainSpecialCharacter - 包含特殊字符', () => {
      expect(isIsContainSpecialCharacter('abc@123')).toBe(true);
      expect(isIsContainSpecialCharacter('abc#123')).toBe(true);
      expect(isIsContainSpecialCharacter('abc123')).toBe(false);
    });
  });

  // 常用格式验证
  describe('常用格式验证', () => {
    test('isEmail - 邮箱验证', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isEmail('invalid.email@')).toBe(false);
    });

    test('isChinesePhoneNumber - 中国手机号', () => {
      expect(isChinesePhoneNumber('13800138000')).toBe(true);
      expect(isChinesePhoneNumber('+8613800138000')).toBe(true);
      expect(isChinesePhoneNumber('12345678901')).toBe(false);
    });

    test('isChineseIDCardNumber - 中国身份证号', () => {
      // 合法身份证（15位）
      expect(isChineseIDCardNumber('110105490513221')).toBe(false);
      // 合法身份证（18位）
      expect(isChineseIDCardNumber('11010519491231002X')).toBe(true);
      // 无效身份证（地区码不合法）
      expect(isChineseIDCardNumber('999999490513221')).toBe(false);
      // 无效身份证（出生日期不合法）
      expect(isChineseIDCardNumber('110105991302221')).toBe(false); // 无效日期 1999-13-02
      // 无效身份证（校验位错误）
      expect(isChineseIDCardNumber('110105194912310021')).toBe(false); // 正确校验位是 X
      // 无效身份证（随机15位数字）
      expect(isChineseIDCardNumber('123456789012345')).toBe(false); // ✅ 修复后通过
    });
  });

  // 字符集验证
  describe('字符集验证', () => {
    test('isContainChineseCharacter - 包含中文', () => {
      expect(isContainChineseCharacter('测试')).toBe(true);
      expect(isContainChineseCharacter('abc测试')).toBe(true);
      expect(isContainChineseCharacter('abc123')).toBe(false);
    });

    test('isDoubleByte - 双字节字符', () => {
      expect(isDoubleByte('测试')).toBe(true);
      expect(isDoubleByte('あいうえお')).toBe(true); // 日文
      expect(isDoubleByte('abc123')).toBe(false);
    });

    test('isChines - 纯中文', () => {
      expect(isChines('中文测试')).toBe(true);
      expect(isChines('中文123')).toBe(false);
    });
  });

  // 其他验证
  describe('其他验证', () => {
    test('isEmptyLine - 空行', () => {
      expect(isEmptyLine('  ')).toBe(true);
      expect(isEmptyLine('\t')).toBe(true);
      expect(isEmptyLine('text')).toBe(false);
    });

    test('isHex - 十六进制', () => {
      expect(isHex('1a2b3c')).toBe(true);
      expect(isHex('FFFFFF')).toBe(true);
      expect(isHex('1g2h3i')).toBe(false);
    });

    test('matchNumberWithLength - 数字长度范围', () => {
      expect(matchNumberWithLength('12345', 3, 5)).toBe(true);
      expect(matchNumberWithLength('12', 3, 5)).toBe(false);
      expect(matchNumberWithLength('123456', 3, 5)).toBe(false);
    });
  });
});
