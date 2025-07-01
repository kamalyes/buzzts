import { match } from './basic';

// match 测试组
describe('match', () => {
  test('应正确执行正则匹配', () => {
    expect(match(/^[a-z]+$/, 'abc')).toBe(true);
    expect(match(/\d+/, '123')).toBe(true);
    expect(match(/^[A-Z]/, 'abc')).toBe(false);
  });

  test('应处理特殊正则', () => {
    expect(match(/./, '')).toBe(false);
    expect(match(/.*/, '')).toBe(true);
  });
});
