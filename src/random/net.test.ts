import { randIPv4, randIPv6, randMAC } from './net';

describe('随机网络地址生成函数测试', () => {
  test('randIPv4 生成合法IPv4地址', () => {
    for (let i = 0; i < 100; i++) {
      const ip = randIPv4();
      expect(ip).toMatch(/^(\d{1,3}\.){3}\d{1,3}$/);
      const parts = ip.split('.').map(Number);
      expect(parts.length).toBe(4);
      parts.forEach(part => {
        expect(part).toBeGreaterThanOrEqual(0);
        expect(part).toBeLessThanOrEqual(255);
      });
    }
  });

  test('randIPv6 生成合法IPv6地址格式', () => {
    for (let i = 0; i < 100; i++) {
      const ip6 = randIPv6();
      expect(ip6).toMatch(/^([0-9a-f]{4}:){7}[0-9a-f]{4}$/);
      const parts = ip6.split(':');
      expect(parts.length).toBe(8);
      parts.forEach(part => {
        expect(part.length).toBe(4);
        expect(parseInt(part, 16)).toBeGreaterThanOrEqual(0);
        expect(parseInt(part, 16)).toBeLessThanOrEqual(0xffff);
      });
    }
  });

  test('randMAC 生成合法MAC地址格式且首字节最低位为0', () => {
    for (let i = 0; i < 100; i++) {
      const mac = randMAC();
      expect(mac).toMatch(/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/);
      const bytes = mac.split(':').map(b => parseInt(b, 16));
      expect(bytes.length).toBe(6);
      // 检查首字节最低位为0 (单播地址)
      expect(bytes[0] & 1).toBe(0);
      // 每个字节范围0~255
      bytes.forEach(b => {
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(255);
      });
    }
  });
});
