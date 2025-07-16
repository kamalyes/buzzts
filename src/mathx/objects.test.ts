import { mergeObject, deepClone, filterObject } from './objects';

describe('mergeObject', () => {
  test('merges source and defaults, overriding defaults', () => {
    const source = { a: 1 };
    const defaults = { a: 0, b: 2 };
    const result = mergeObject(source, defaults);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  test('handles undefined source and defaults', () => {
    const result = mergeObject(undefined, undefined);
    expect(result).toEqual({});
  });

  test('merges nested objects', () => {
    const source = { a: { x: 1 } };
    const defaults = { a: { x: 0, y: 2 }, b: 2 };
    const result = mergeObject(source, defaults);
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 2 });
  });

  test('skips null values in source', () => {
    const source = { a: null };
    const defaults = { a: 0, b: 2 };
    const result = mergeObject(source, defaults);
    expect(result).toEqual({ a: 0, b: 2 });
  });

  test('merges arrays as shallow copies', () => {
    const source = { a: [1, 2] };
    const defaults = { a: [0], b: 2 };
    const result = mergeObject(source, defaults);
    expect(result).toEqual({ a: [1, 2], b: 2 });
  });

  test('prevents prototype pollution', () => {
    const source = { a: 1, __proto__: { b: 2 } };
    const defaults = { a: 0, b: 2 };
    const result = mergeObject(source, defaults);
    expect(result).toEqual({ a: 1, b: 2 });
    expect(({} as any).b).toBeUndefined(); // 确保没有污染原型
  });
});

describe('deepClone', () => {
  test('clones a simple object', () => {
    const obj = { a: 1, b: 2 };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj); // 确保是不同的引用
  });

  test('clones nested objects', () => {
    const obj = { a: { b: 2 } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.a).not.toBe(obj.a); // 确保嵌套对象也是不同的引用
  });

  test('clones arrays', () => {
    const arr = [1, 2, { a: 3 }];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr); // 确保是不同的引用
    expect(cloned[2]).not.toBe(arr[2]); // 确保嵌套对象也是不同的引用
  });

  test('clones dates', () => {
    const date = new Date();
    const cloned = deepClone(date);
    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date); // 确保是不同的引用
  });

  test('clones regex', () => {
    const regex = /test/i;
    const cloned = deepClone(regex);
    expect(cloned).toEqual(regex);
    expect(cloned).not.toBe(regex); // 确保是不同的引用
  });

  test('handles circular references', () => {
    const obj: any = {};
    obj.self = obj; // 循环引用
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj); // 确保是不同的引用
  });

  test('clones objects with property descriptors', () => {
    const obj = Object.create(
      {},
      {
        a: { value: 1, writable: true },
        b: { value: 2, enumerable: true },
      },
    );
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(Object.getOwnPropertyDescriptor(cloned, 'a')).toEqual(Object.getOwnPropertyDescriptor(obj, 'a'));
    expect(Object.getOwnPropertyDescriptor(cloned, 'b')).toEqual(Object.getOwnPropertyDescriptor(obj, 'b'));
  });

  test('clones objects with symbols', () => {
    const sym = Symbol('test');
    const obj = { [sym]: 1 };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(Object.getOwnPropertySymbols(cloned)).toEqual(Object.getOwnPropertySymbols(obj));
  });
});

describe('filterObject', () => {
  const object = { a: 1, b: '2', c: 3, d: null };

  test('pick properties', () => {
    const result = filterObject(object, ['a', 'c'], 'pick');
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('omit properties', () => {
    const result = filterObject(object, ['a', 'c'], 'omit');
    expect(result).toEqual({ b: '2', d: null });
  });

  test('pick no properties', () => {
    const result = filterObject(object, [], 'pick');
    expect(result).toEqual({});
  });

  test('omit all properties', () => {
    const result = filterObject(object, ['a', 'b', 'c', 'd'], 'omit');
    expect(result).toEqual({});
  });

  test('pick properties with non-existent keys', () => {
    const result = filterObject(object, ['a', 'x'], 'pick');
    expect(result).toEqual({ a: 1 });
  });

  test('omit properties with non-existent keys', () => {
    const result = filterObject(object, ['x'], 'omit');
    expect(result).toEqual(object);
  });
});
