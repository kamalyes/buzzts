import { strReplace, chunkString } from './replace';

describe('strReplace 函数测试', () => {
  test('替换区间3-6为*', () => {
    expect(strReplace('123756789', 3, 6, '*')).toBe('123*89');
  });

  test('负数索引替换', () => {
    expect(strReplace('123756789', -6, -3, '#')).toBe('123#89');
  });

  test('多字符替换', () => {
    expect(strReplace('abcdefg', 2, 5, 'XY')).toBe('abXYg');
  });

  test('删除区间字符', () => {
    expect(strReplace('abcdefg', 2, 5, '')).toBe('abg');
  });

  test('开始结束位置交换', () => {
    expect(strReplace('abcdefg', 5, 2, 'Z')).toBe('abZg');
  });

  test('空字符串返回', () => {
    expect(strReplace('', 0, 1, '*')).toBe('');
  });

  test('替换区间长度为0', () => {
    expect(strReplace('abc', 0, 0, '*')).toBe('*bc');
  });

  test('替换区间长度为0-单字符', () => {
    expect(strReplace('abc', 1, 1, '*')).toBe('a*c');
  });

  test('替换整个字符串', () => {
    expect(strReplace('abc', 0, 3, 'X')).toBe('X');
  });

  test('负数索引部分替换', () => {
    expect(strReplace('abc', -3, -1, 'Y')).toBe('Y');
  });

  test('混合正负索引', () => {
    expect(strReplace('abc', -1, 3, 'Z')).toBe('abZ');
  });
});

describe('chunkString', () => {
  test('正常分割，chunkSize=3', () => {
    expect(chunkString('abcdefghijklmnopqrstuvwxyz', 3)).toEqual([
      'abc',
      'def',
      'ghi',
      'jkl',
      'mno',
      'pqr',
      'stu',
      'vwx',
      'yz',
    ]);
  });

  test('正常分割，chunkSize=5', () => {
    expect(chunkString('abcdefghijklmnopqrstuvwxyz', 5)).toEqual(['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxy', 'z']);
  });

  test('chunkSize 大于字符串长度，返回整个字符串', () => {
    expect(chunkString('abc', 10)).toEqual(['abc']);
  });

  test('chunkSize 等于字符串长度', () => {
    expect(chunkString('abc', 3)).toEqual(['abc']);
  });

  test('chunkSize 为 1，返回单字符数组', () => {
    expect(chunkString('abc', 1)).toEqual(['a', 'b', 'c']);
  });

  test('空字符串返回空数组', () => {
    expect(chunkString('', 3)).toEqual([]);
  });

  test('chunkSize 非整数抛错', () => {
    expect(() => chunkString('abc', 0)).toThrow(RangeError);
    expect(() => chunkString('abc', -1)).toThrow(RangeError);
    expect(() => chunkString('abc', 1.5)).toThrow(RangeError);
  });

  test('str 不是字符串抛错', () => {
    // @ts-expect-error 测试异常输入
    expect(() => chunkString(123, 3)).toThrow(TypeError);
    // @ts-expect-error 测试异常输入
    expect(() => chunkString(null, 3)).toThrow(TypeError);
  });
});
