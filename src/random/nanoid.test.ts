import { nanoid, customAlphabet } from './nanoid';

const alphabet = 'abc123';

describe('nanoid', () => {
  it('默认长度21', () => {
    const id = nanoid();
    expect(id).toHaveLength(21);
  });

  it('生成的字符均在默认字母表内', () => {
    const id = nanoid();
    for (const ch of id) {
      expect('useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict').toContain(ch);
    }
  });
});

describe('customAlphabet', () => {
  it('生成指定长度的ID', () => {
    const size = 10;
    const gen = customAlphabet(alphabet, size);
    const id = gen();
    expect(id).toHaveLength(size);
  });

  it('生成的字符均在自定义字母表内', () => {
    const gen = customAlphabet(alphabet, 15);
    const id = gen();
    for (const ch of id) {
      expect(alphabet).toContain(ch);
    }
  });
});
