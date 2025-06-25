import { randBool } from './bool';

describe('randBool', () => {
  it('返回值是布尔类型', () => {
    const val = randBool();
    expect(typeof val).toBe('boolean');
  });

  it('多次调用返回true和false都出现', () => {
    const results = new Set<boolean>();
    for (let i = 0; i < 100; i++) {
      results.add(randBool());
      if (results.size === 2) break;
    }
    expect(results.has(true)).toBe(true);
    expect(results.has(false)).toBe(true);
  });
});
