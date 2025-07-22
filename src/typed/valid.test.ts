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
  deepEqual,
  isJsonObject,
  isMap,
  isSet,
  isWeakMap,
  isWeakSet,
  isEqual,
} from './valid';

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
});
describe('类型检测函数', () => {
  describe('isMap', () => {
    test('应该对 Map 对象返回 true', () => {
      expect(isMap(new Map())).toBe(true);
    });

    test('应该对非 Map 对象返回 false', () => {
      expect(isMap({})).toBe(false);
      expect(isMap([])).toBe(false);
      expect(isMap(null)).toBe(false);
      expect(isMap(undefined)).toBe(false);
    });
  });

  describe('isSet', () => {
    test('应该对 Set 对象返回 true', () => {
      expect(isSet(new Set())).toBe(true);
    });

    test('应该对非 Set 对象返回 false', () => {
      expect(isSet({})).toBe(false);
      expect(isSet([])).toBe(false);
      expect(isSet(null)).toBe(false);
      expect(isSet(undefined)).toBe(false);
    });
  });

  describe('isWeakMap', () => {
    test('应该对 WeakMap 对象返回 true', () => {
      expect(isWeakMap(new WeakMap())).toBe(true);
    });

    test('应该对非 WeakMap 对象返回 false', () => {
      expect(isWeakMap(new Map())).toBe(false);
      expect(isWeakMap({})).toBe(false);
      expect(isWeakMap(null)).toBe(false);
      expect(isWeakMap(undefined)).toBe(false);
    });
  });

  describe('isWeakSet', () => {
    test('应该对 WeakSet 对象返回 true', () => {
      expect(isWeakSet(new WeakSet())).toBe(true);
    });

    test('应该对非 WeakSet 对象返回 false', () => {
      expect(isWeakSet(new Set())).toBe(false);
      expect(isWeakSet({})).toBe(false);
      expect(isWeakSet(null)).toBe(false);
      expect(isWeakSet(undefined)).toBe(false);
    });
  });

  describe('isEqual', () => {
    test('应该对相等的原始值返回 true', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('test', 'test')).toBe(true);
    });

    test('应该对不相等的原始值返回 false', () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('test', 'TEST')).toBe(false);
    });

    test('应该对相等的对象返回 true', () => {
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(isEqual(new Date(123), new Date(123))).toBe(true);
      expect(isEqual([1, 2], [1, 2])).toBe(true);
      expect(isEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true);
      expect(isEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    });

    test('应该对不相等的对象返回 false', () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false);
    });

    test('应该对函数返回 false', () => {
      expect(
        isEqual(
          () => {},
          () => {},
        ),
      ).toBe(false);
    });

    test('应该对深度嵌套的相等对象返回 true', () => {
      const obj1 = { a: { b: { c: 1 } } };
      const obj2 = { a: { b: { c: 1 } } };
      expect(isEqual(obj1, obj2)).toBe(true);
    });

    test('应该对深度嵌套的不相等对象返回 false', () => {
      const obj1 = { a: { b: { c: 1 } } };
      const obj2 = { a: { b: { c: 2 } } };
      expect(isEqual(obj1, obj2)).toBe(false);
    });

    interface CircularReference {
      a: number;
      self?: CircularReference; // 可选的 self 属性
    }

    test('应该处理循环引用', () => {
      const obj1: CircularReference = { a: 1 };
      obj1.self = obj1; // obj1 的循环引用

      const obj2: CircularReference = { a: 1 };
      obj2.self = obj2; // obj2 的循环引用

      // 两个对象的结构相同，应该相等
      expect(isEqual(obj1, obj2)).toBe(true);

      // 修改 obj2 的属性，应该不相等
      obj2.a = 2;
      expect(isEqual(obj1, obj2)).toBe(false);
    });

    test('应该对键顺序不同的相等对象返回 true', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 2, a: 1 };
      expect(isEqual(obj1, obj2)).toBe(true);
    });

    test('应该对不同类型返回 false', () => {
      expect(isEqual({}, [])).toBe(false);
    });

    test('应该对不相等的数组返回 false', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
      expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    test('应该对不相等的 map 返回 false', () => {
      const map1 = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const map2 = new Map([
        ['a', 1],
        ['b', 3],
      ]);
      expect(isEqual(map1, map2)).toBe(false);
    });

    test('应该对不相等的 set 返回 false', () => {
      const set1 = new Set([1, 2]);
      const set2 = new Set([2, 3]);
      expect(isEqual(set1, set2)).toBe(false);
    });
  });
});

describe('deepEqual', () => {
  it('简单类型相等返回 true', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('abc', 'abc')).toBe(true);
  });

  it('简单类型不等返回 false', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('abc', 'def')).toBe(false);
  });

  it('对象深度相等返回 true', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
  });

  it('对象深度不等返回 false', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
  });

  it('数组深度相等返回 true', () => {
    expect(deepEqual([1, 2, { a: 3 }], [1, 2, { a: 3 }])).toBe(true);
  });

  it('数组深度不等返回 false', () => {
    expect(deepEqual([1, 2, { a: 3 }], [1, 2, { a: 4 }])).toBe(false);
  });

  it('null 和 undefined 比较', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
  });

  it('类型不同返回 false', () => {
    expect(deepEqual(1, '1')).toBe(false);
    expect(deepEqual({}, [])).toBe(false);
  });

  it('Date 对象比较', () => {
    expect(deepEqual(new Date(123), new Date(123))).toBe(true);
    expect(deepEqual(new Date(123), new Date(456))).toBe(false);
  });

  it('RegExp 对象比较', () => {
    expect(deepEqual(/abc/i, /abc/i)).toBe(true);
    expect(deepEqual(/abc/i, /abc/g)).toBe(false);
    expect(deepEqual(/abc/i, /def/i)).toBe(false);
  });

  it('Map 对象比较', () => {
    const map1 = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const map2 = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const map3 = new Map([
      ['a', 1],
      ['b', 3],
    ]);
    expect(deepEqual(map1, map2)).toBe(true);
    expect(deepEqual(map1, map3)).toBe(false);
  });

  it('Set 对象比较', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([3, 2, 1]);
    const set3 = new Set([1, 2]);
    expect(deepEqual(set1, set2)).toBe(true);
    expect(deepEqual(set1, set3)).toBe(false);
  });
  class MyClass {
    constructor(public x: number, public y: number) {}
  }

  it('自定义类实例比较', () => {
    const obj1 = new MyClass(1, 2);
    const obj2 = new MyClass(1, 2);
    const obj3 = new MyClass(1, 3);
    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj1, obj3)).toBe(false);
    expect(deepEqual(obj1, { x: 1, y: 2 })).toBe(false); // 不同构造函数
  });
  it('复杂嵌套结构比较', () => {
    const a = {
      date: new Date(123),
      map: new Map([['key', { val: 1 }]]),
      set: new Set([1, 2]),
      nested: {
        arr: [1, 2, 3],
        regexp: /test/i,
      },
    };
    const b = {
      date: new Date(123),
      map: new Map([['key', { val: 1 }]]),
      set: new Set([2, 1]),
      nested: {
        arr: [1, 2, 3],
        regexp: /test/i,
      },
    };
    expect(deepEqual(a, b)).toBe(true);
  });
  it('NaN 比较', () => {
    expect(deepEqual(NaN, NaN)).toBe(true); // 如果你想支持这个，需要在代码里特殊判断
  });

  it('-0 和 +0 比较', () => {
    expect(deepEqual(-0, +0)).toBe(true);
  });
});

describe('isJsonObject', () => {
  test('有效的 JSON 对象字符串', () => {
    expect(isJsonObject('{"a":1}')).toBe(true);
  });

  test('有效的 JSON 数组字符串', () => {
    expect(isJsonObject('[1, 2, 3]')).toBe(true);
  });

  test('数字类型的 JSON 字符串，返回 false', () => {
    expect(isJsonObject('123')).toBe(false);
  });

  test('布尔类型的 JSON 字符串，返回 false', () => {
    expect(isJsonObject('true')).toBe(false);
  });

  test('空字符串返回 false', () => {
    expect(isJsonObject('')).toBe(false);
  });

  test('仅包含空白字符的字符串返回 false', () => {
    expect(isJsonObject('   \n\t')).toBe(false);
  });

  test('非法 JSON 字符串返回 false', () => {
    expect(isJsonObject('abc')).toBe(false);
  });

  test('null 字符串，解析结果是 null，返回 false', () => {
    expect(isJsonObject('null')).toBe(false);
  });

  test('JSON 字符串是函数或其他非对象类型，返回 false', () => {
    // JSON 不支持函数，解析会失败，返回 false
    expect(isJsonObject('function() {}')).toBe(false);
  });

  test('对象中包含数组，仍然返回 true', () => {
    expect(isJsonObject('{"arr":[1,2,3]}')).toBe(true);
  });

  test('数组中包含对象，返回 true', () => {
    expect(isJsonObject('[{"a":1}, {"b":2}]')).toBe(true);
  });
});
