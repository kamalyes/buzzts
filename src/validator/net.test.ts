import { isIPv4, isIPv6 } from './net';
import { RegexRules } from './rules';

describe('IP地址校验工具', () => {
  // IPv4 测试组
  describe('isIPv4', () => {
    test('应识别合法IPv4地址', () => {
      expect(isIPv4('192.168.0.1')).toBe(true);
      expect(isIPv4('0.0.0.0')).toBe(true);
      expect(isIPv4('255.255.255.255')).toBe(true);
    });

    test('应拒绝非法IPv4地址', () => {
      // 边界值测试
      expect(isIPv4('256.1.1.1')).toBe(false); // 超过255
      expect(isIPv4('1.2.3.')).toBe(false); // 不完整
      expect(isIPv4('192.168.1')).toBe(false); // 只有3段
      expect(isIPv4('192.168.1.1.1')).toBe(false); // 超过4段

      // 格式错误
      expect(isIPv4('192.168.o.1')).toBe(false); // 包含字母o
      expect(isIPv4('192 .168.0.1')).toBe(false); // 包含空格
    });

    test('应拒绝非字符串输入', () => {
      // @ts-expect-error 测试类型错误
      expect(isIPv4(null)).toBe(false);
      // @ts-expect-error 测试类型错误
      expect(isIPv4(19216801)).toBe(false);
      expect(isIPv4('')).toBe(false);
    });

    test('应匹配底层正则规则', () => {
      // 确保使用统一的RegexRules
      const spy = jest.spyOn(RegexRules.ipv4, 'test');
      isIPv4('192.168.0.1');
      expect(spy).toHaveBeenCalled();
    });
  });

  // IPv6 测试组
  describe('isIPv6', () => {
    test('应识别合法IPv6地址', () => {
      // 完整格式
      expect(isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(isIPv6('FE80:0000:0000:0000:0202:B3FF:FE1E:8329')).toBe(true);

      // 压缩格式
      expect(isIPv6('2001:db8::8a2e:370:7334')).toBe(true);
      expect(isIPv6('::1')).toBe(true); // 本地地址
      expect(isIPv6('FF02::1')).toBe(true); // 多播地址
    });

    test('应拒绝IPv4映射的IPv6地址', () => {
      expect(isIPv6('::ffff:192.168.0.1')).toBe(false);
      expect(isIPv6('2001:db8::192.168.0.1')).toBe(false);
    });

    test('应拒绝非法IPv6地址', () => {
      // 格式错误
      expect(isIPv6('2001::25de::cade')).toBe(false); // 多个压缩段
      expect(isIPv6('2001:db8:::1')).toBe(false); // 连续冒号
      expect(isIPv6('2001:db8:0:0:0:0:1')).toBe(false); // 段不足

      // 非法字符
      expect(isIPv6('2001:dg8::1')).toBe(false); // 非法字符g
      expect(isIPv6('2001::db8%eth0')).toBe(false); // 包含%

      // 边界值
      expect(isIPv6(':2001:db8::1')).toBe(false); // 起始冒号
      expect(isIPv6('2001:db8::1:')).toBe(false); // 结尾冒号
    });

    test('应正确处理极端情况', () => {
      // 最大压缩
      expect(isIPv6('::')).toBe(true);
      // 全零展开
      expect(isIPv6('0:0:0:0:0:0:0:0')).toBe(true);
      // 部分压缩
      expect(isIPv6('2001:0:0:0:0:0:0:1')).toBe(true);
      expect(isIPv6('2001::1')).toBe(true);
    });

    test('性能测试: IPv6正则调用次数', () => {
      // 使用 jest.spyOn 监控正则表达式的 test 方法
      const ipv6Spy = jest.spyOn(RegexRules.ipv6Full, 'test');
      const compressedSpy = jest.spyOn(RegexRules.ipv6Compressed, 'test');

      // 1. 测试压缩格式的IPv6
      isIPv6('2001:db8::1');

      // 应该只检查压缩格式的正则（因为包含 ::）
      expect(compressedSpy).toHaveBeenCalledTimes(1);
      expect(ipv6Spy).not.toHaveBeenCalled();

      // 2. 测试完整格式的IPv6
      isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334');

      // 应该只检查完整格式的正则
      expect(ipv6Spy).toHaveBeenCalledTimes(1);
      expect(compressedSpy).toHaveBeenCalledTimes(1); // 保持不变

      // 3. 测试无效格式（不应调用任何正则）
      isIPv6('invalid.ipv6.address');
      expect(ipv6Spy).toHaveBeenCalledTimes(1); // 保持不变
      expect(compressedSpy).toHaveBeenCalledTimes(1); // 保持不变

      // 清理 spy
      ipv6Spy.mockRestore();
      compressedSpy.mockRestore();
    });
  });

  // 综合测试
  describe('IP版本互斥测试', () => {
    test('IPv4不应被识别为IPv6', () => {
      expect(isIPv6('192.168.0.1')).toBe(false);
    });

    test('IPv6不应被识别为IPv4', () => {
      expect(isIPv4('2001:db8::1')).toBe(false);
    });
  });

  // 正则规则覆盖测试
  describe('正则规则验证', () => {
    test('IPv4规则应覆盖所有情况', () => {
      const ipv4Regex = RegexRules.ipv4;
      expect('0.0.0.0'.match(ipv4Regex)).toBeTruthy();
      expect('255.255.255.255'.match(ipv4Regex)).toBeTruthy();
      expect('256.0.0.0'.match(ipv4Regex)).toBeFalsy();
    });

    test('IPv6压缩规则应允许合理压缩', () => {
      const compressedRegex = RegexRules.ipv6Compressed;
      // Full compression cases
      expect('::'.match(compressedRegex)).toBeTruthy();
      expect('2001:db8::1'.match(compressedRegex)).toBeTruthy();
      expect('::ffff'.match(compressedRegex)).toBeTruthy();
      expect('1::'.match(compressedRegex)).toBeTruthy();

      // Partial compression
      expect('2001:0db8:85a3::8a2e:0370:7334'.match(compressedRegex)).toBeTruthy();
      expect('fe80::1ff:fe23:4567:890a'.match(compressedRegex)).toBeTruthy();

      // Uncompressed full address
      expect('2001:0db8:85a3:08d3:1319:8a2e:0370:7334'.match(compressedRegex)).toBeTruthy();

      // Edge cases
      expect('::1'.match(compressedRegex)).toBeTruthy();
      expect('1::1'.match(compressedRegex)).toBeTruthy();
      expect('1:2:3:4:5:6:7::'.match(compressedRegex)).toBeTruthy();
      expect('::1:2:3:4:5:6:7'.match(compressedRegex)).toBeTruthy();
    });
  });
});
