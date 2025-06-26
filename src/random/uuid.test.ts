import { randUUIDv1, randUUIDv4 } from './uuid';

describe('randUUIDv1', () => {
  test('格式符合UUID v1规范', () => {
    for (let i = 0; i < 100; i++) {
      const uuid = randUUIDv1();
      // UUID v1 格式：8-4-4-4-12 共36字符，版本号第15位为1
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/);

      // 额外验证长度和分隔符位置
      expect(uuid.length).toBe(36);
      expect(uuid[8]).toBe('-');
      expect(uuid[13]).toBe('-');
      expect(uuid[18]).toBe('-');
      expect(uuid[23]).toBe('-');
    }
  });
});

describe('randUUIDv4', () => {
  test('格式符合UUID v4规范', () => {
    for (let i = 0; i < 100; i++) {
      const uuid = randUUIDv4();

      // UUID v4 格式：8-4-4-4-12，版本号第15位为4
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);

      expect(uuid.length).toBe(36);
      expect(uuid[8]).toBe('-');
      expect(uuid[13]).toBe('-');
      expect(uuid[18]).toBe('-');
      expect(uuid[23]).toBe('-');

      // 版本号检查
      expect(uuid[14]).toBe('4');

      // variant字段检查，uuid[19] 应是 8,9,a,b 中之一
      expect(['8', '9', 'a', 'b']).toContain(uuid[19]);
    }
  });
});
