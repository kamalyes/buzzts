import {
  isUndefined,
  isNull,
  isNil,
  isBoolean,
  isNumber,
  isString,
  isSymbol,
  isBigInt,
  isEmpty,
  getTypeOf,
  match,
} from './basic';

describe('类型检测工具函数', () => {
  // isUndefined 测试组
  describe('isUndefined', () => {
    test('应识别 undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
      let undefVar;
      expect(isUndefined(undefVar)).toBe(true);
    });

    test('不应误判其他值', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
    });

    test('类型守卫应生效', () => {
      const testVar: string | undefined = Math.random() > 0.5 ? 'test' : undefined;
      if (isUndefined(testVar)) {
        // 此处 TypeScript 应能推断类型为 undefined
        expect(testVar).toBeUndefined();
      }
    });
  });

  // isNull 测试组
  describe('isNull', () => {
    test('应识别 null', () => {
      expect(isNull(null)).toBe(true);
    });

    test('不应误判其他值', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull({})).toBe(false);
    });
  });

  // isNil 测试组
  describe('isNil', () => {
    test('应识别 null 和 undefined', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
    });

    test('不应误判其他值', () => {
      expect(isNil(0)).toBe(false);
      expect(isNil('')).toBe(false);
      expect(isNil(false)).toBe(false);
    });
  });

  // isBoolean 测试组
  describe('isBoolean', () => {
    test('应识别布尔值', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    test('不应误判其他值', () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(null)).toBe(false);
    });
  });

  // isNumber 测试组
  describe('isNumber', () => {
    test('应识别有效数字', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(42)).toBe(true);
      expect(isNumber(-3.14)).toBe(true);
    });

    test('应排除特殊数值', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber(-Infinity)).toBe(false);
    });

    test('不应误判其他类型', () => {
      expect(isNumber('42')).toBe(false);
      expect(isNumber(null)).toBe(false);
    });
  });

  // isString 测试组
  describe('isString', () => {
    test('应识别字符串', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
      expect(isString(String(42))).toBe(true);
    });

    test('不应误判其他类型', () => {
      expect(isString(42)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(true)).toBe(false);
    });
  });

  // isSymbol 测试组
  describe('isSymbol', () => {
    test('应识别 Symbol', () => {
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol(Symbol('desc'))).toBe(true);
    });

    test('不应误判其他类型', () => {
      expect(isSymbol('symbol')).toBe(false);
      expect(isSymbol({})).toBe(false);
    });
  });

  // isBigInt 测试组
  describe('isBigInt', () => {
    test('应识别 BigInt', () => {
      expect(isBigInt(BigInt(42))).toBe(true);
      expect(isBigInt(42n)).toBe(true);
    });

    test('不应误判其他类型', () => {
      expect(isBigInt(42)).toBe(false);
      expect(isBigInt('42')).toBe(false);
    });
  });

  // isEmpty 测试组
  describe('isEmpty', () => {
    test('应识别空值', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    test('不应误判非空值', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(' text ')).toBe(false);
    });

    test('应处理特殊对象', () => {
      expect(isEmpty(new Map())).toBe(false);
      expect(isEmpty(new Set())).toBe(false);
      expect(isEmpty(new Date())).toBe(false);
    });
  });

  // getTypeOf 测试组
  describe('getTypeOf', () => {
    test('应返回正确类型名称', () => {
      expect(getTypeOf('')).toBe('String');
      expect(getTypeOf(42)).toBe('Number');
      expect(getTypeOf([])).toBe('Array');
      expect(getTypeOf({})).toBe('Object');
      expect(getTypeOf(() => {})).toBe('Function');
      expect(getTypeOf(async () => {})).toBe('AsyncFunction');
      expect(getTypeOf(/regex/)).toBe('RegExp');
      expect(getTypeOf(new Date())).toBe('Date');
      expect(getTypeOf(Symbol())).toBe('Symbol');
    });

    test('应处理 null 和 undefined', () => {
      expect(getTypeOf(null)).toBe('Null');
      expect(getTypeOf(undefined)).toBe('Undefined');
    });
  });

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
});
