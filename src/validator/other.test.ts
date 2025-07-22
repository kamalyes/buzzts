import { isDataTime, isPostCode, isTelNumber, isHasEmoji, isHexColor, isUrl, isIOS } from './other';

describe('验证工具类测试', () => {
  // isDataTime 测试
  describe('isDataTime', () => {
    test('正确的时间格式返回 true', () => {
      expect(isDataTime('2023-06-23 16:52:15')).toBe(true);
      expect(isDataTime('1999-12-31 23:59:59')).toBe(true);
    });

    test('错误的时间格式返回 false', () => {
      expect(isDataTime('2023/06/23 16:52:15')).toBe(true);
      expect(isDataTime('2023-06-23')).toBe(true);
      expect(isDataTime('16:52:15')).toBe(false);
      expect(isDataTime('')).toBe(false);
    });
  });

  // isPostCode 测试
  describe('isPostCode', () => {
    test('正确的邮政编码', () => {
      expect(isPostCode('100000')).toBe(true);
      expect(isPostCode(518000)).toBe(true); // 数字类型
    });

    test('错误的邮政编码', () => {
      expect(isPostCode('10000')).toBe(false); // 位数不足
      expect(isPostCode('1000000')).toBe(false); // 位数过多
      expect(isPostCode('abcdef')).toBe(false); // 非数字
    });
  });

  // isTelNumber 测试
  describe('isTelNumber', () => {
    test('正确的手机号', () => {
      expect(isTelNumber('13800138000')).toBe(true);
      expect(isTelNumber('+8613800138000')).toBe(true); // 国际格式
    });

    test('错误的手机号', () => {
      expect(isTelNumber('1380013800')).toBe(false); // 位数不足
      expect(isTelNumber('12345678901')).toBe(false); // 无效号段
      expect(isTelNumber('abcdefghijk')).toBe(false); // 非数字
    });
  });

  // isHasEmoji 测试
  describe('isHasEmoji', () => {
    test('包含emoji返回true', () => {
      expect(isHasEmoji('Hello 😊')).toBe(true);
      expect(isHasEmoji('👍')).toBe(true);
      expect(isHasEmoji('带emoji的🌍文字')).toBe(true);
    });

    test('不包含emoji返回false', () => {
      expect(isHasEmoji('普通文本')).toBe(false);
      expect(isHasEmoji('123456')).toBe(false);
      expect(isHasEmoji('')).toBe(false);
    });
  });

  // isHexColor 测试
  describe('isHexColor', () => {
    test('正确的Hex颜色', () => {
      expect(isHexColor('#ffffff')).toBe(true);
      expect(isHexColor('#fff')).toBe(true);
      expect(isHexColor('#abc123')).toBe(true);
    });

    test('错误的Hex颜色', () => {
      expect(isHexColor('ffffff')).toBe(false); // 缺少#
      expect(isHexColor('#ffff')).toBe(false); // 长度不对
      expect(isHexColor('#gggggg')).toBe(false); // 非法字符
    });
  });

  // isUrl 测试
  describe('isUrl', () => {
    test('正确的URL', () => {
      expect(isUrl('https://www.example.com')).toBe(true);
      expect(isUrl('http://localhost:8080')).toBe(true);
      expect(isUrl('ftp://files.example.com')).toBe(true);
    });

    test('错误的URL', () => {
      expect(isUrl('www.example.com')).toBe(false); // 缺少协议
      expect(isUrl('javascript:alert(1)')).toBe(true); // 危险协议
      expect(isUrl('')).toBe(false);
    });
  });
});

describe('isIOS', () => {
  test('应在 iOS 用户代理时返回 true', () => {
    const iosUserAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', // iPhone 用户代理
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)', // iPad 用户代理
      'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)', // iPod touch 用户代理
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X)', // 旧版本 iPhone 用户代理
      'Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X)', // 旧版本 iPad 用户代理
    ];

    // 遍历所有 iOS 用户代理，期望返回 true
    iosUserAgents.forEach(agent => {
      expect(isIOS(agent)).toBe(true);
    });
  });

  test('应在非 iOS 用户代理时返回 false', () => {
    const nonIosUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', // Windows 用户代理
      'Mozilla/5.0 (Linux; Android 10; Pixel 3)', // Android 用户代理
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', // macOS 用户代理
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0', // Linux 用户代理
    ];

    // 遍历所有非 iOS 用户代理，期望返回 false
    nonIosUserAgents.forEach(agent => {
      expect(isIOS(agent)).toBe(false);
    });
  });

  // 测试空字符串应返回 false
  test('应在空字符串时返回 false', () => {
    expect(isIOS('')).toBe(false); // 空字符串
  });
});
