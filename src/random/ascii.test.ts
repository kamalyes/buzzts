import { createASCIIList, initASCII, matchCapital, matchLowercase, matchNumber, matchSpecial } from './ascii';

describe('ASCII Utilities', () => {
  beforeEach(() => {
    // 由于 initASCII 只执行一次，测试时可能需要重置状态（如果实现允许）
    // 这里假设初始化函数只能执行一次，测试时按顺序执行即可
  });

  describe('createASCIIList', () => {
    it('生成65到67的ASCII码数组', () => {
      expect(createASCIIList(65, 67)).toEqual([65, 66, 67]);
    });

    it('start等于end时返回单元素数组', () => {
      expect(createASCIIList(50, 50)).toEqual([50]);
    });

    it('start大于end时返回空数组', () => {
      expect(createASCIIList(100, 90)).toEqual([]);
    });
  });

  describe('initASCII', () => {
    it('初始化后matchCapital包含A-Z的ASCII码', () => {
      initASCII();
      expect(matchCapital).toEqual(createASCIIList(65, 90));
    });

    it('初始化后matchLowercase包含a-z的ASCII码', () => {
      initASCII();
      expect(matchLowercase).toEqual(createASCIIList(97, 122));
    });

    it('初始化后matchNumber包含0-9的ASCII码', () => {
      initASCII();
      expect(matchNumber).toEqual(createASCIIList(48, 57));
    });

    it('初始化后matchSpecial包含指定特殊字符的ASCII码', () => {
      initASCII();
      const specialChars = '.@$!%*#_~?&^';
      const expected = Array.from(specialChars).map(c => c.charCodeAt(0));
      expect(matchSpecial).toEqual(expected);
    });

    it('多次调用initASCII不会重复初始化', () => {
      initASCII();
      const firstMatchCapital = [...matchCapital];
      initASCII();
      expect(matchCapital).toEqual(firstMatchCapital);
    });
  });
});
