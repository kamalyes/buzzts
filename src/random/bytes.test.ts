import { randNumber, randHex } from './bytes';
import { DEC_BYTES, HEX_BYTES } from './ascii';

describe('randNumber', () => {
  it('生成指定长度的字符串，默认字符集为DEC_BYTES', () => {
    const length = 10;
    const result = randNumber(length);
    expect(result).toHaveLength(length);
    for (const ch of result) {
      expect(DEC_BYTES).toContain(ch);
    }
  });

  it('使用自定义字符集生成字符串', () => {
    const custom = '13579';
    const length = 5;
    const result = randNumber(length, custom);
    expect(result).toHaveLength(length);
    for (const ch of result) {
      expect(custom).toContain(ch);
    }
  });

  it('长度为0时返回空字符串', () => {
    expect(randNumber(0)).toBe('');
  });
});

describe('randHex', () => {
  it('生成指定字节长度的十六进制字符串，默认字符集HEX_BYTES', () => {
    const bytesLen = 4;
    const result = randHex(bytesLen);
    expect(result).toHaveLength(bytesLen * 2);
    for (const ch of result) {
      expect(HEX_BYTES).toContain(ch);
    }
  });

  it('使用自定义字符集生成十六进制字符串', () => {
    const custom = '012345';
    const bytesLen = 3;
    const result = randHex(bytesLen, custom);
    expect(result).toHaveLength(bytesLen * 2);
    for (const ch of result) {
      expect(custom).toContain(ch);
    }
  });

  it('字节长度为0时返回空字符串', () => {
    expect(randHex(0)).toBe('');
  });
});
