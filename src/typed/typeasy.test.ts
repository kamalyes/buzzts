import { typeasy } from './typeasy';

describe('typeasy 类型检测工具', () => {
  test('基础类型检测', () => {
    expect(typeasy(null)).toBe('null');
    expect(typeasy(undefined)).toBe('undefined');
    expect(typeasy(42)).toBe('number');
    expect(typeasy(NaN)).toBe('nan');
    expect(typeasy(Infinity)).toBe('infinity');
    expect(typeasy(-0)).toBe('negative-zero');
    expect(typeasy('text')).toBe('string');
    expect(typeasy(true)).toBe('boolean');
    expect(typeasy(Symbol())).toBe('symbol');
    expect(typeasy(10n)).toBe('bigint');
  });

  test('引用类型检测', () => {
    expect(typeasy([])).toBe('array');
    expect(typeasy({})).toBe('object');
    expect(typeasy(/regex/)).toBe('regexp');
    expect(typeasy(new Date())).toBe('date');
    expect(typeasy(new Error())).toBe('error');
    expect(typeasy(new Map())).toBe('map');
    expect(typeasy(new Set())).toBe('set');
    expect(typeasy(new WeakMap())).toBe('weakmap');
    expect(typeasy(new WeakSet())).toBe('weakset');
    expect(typeasy(Promise.resolve())).toBe('promise');
  });

  test('函数和类检测', () => {
    // 普通函数
    expect(typeasy(function () {})).toBe('function');
    // 箭头函数
    expect(typeasy(() => {})).toBe('function');
    // 异步函数
    expect(typeasy(async function () {})).toBe('function');
    // 生成器函数
    expect(typeasy(function* () {})).toBe('function');

    // 类检测
    expect(typeasy(class Test {})).toBe('class');
    expect(typeasy(class {})).toBe('class');

    // 带构造函数的类
    class Person {}
    expect(typeasy(Person)).toBe('class');
  });

  test('工具方法验证', () => {
    // typeasy.is 方法
    expect(typeasy.is([], 'array')).toBe(true);
    expect(typeasy.is(new Date(), 'date')).toBe(true);
    expect(typeasy.is(class {}, 'class')).toBe(true);

    // typeasy.isPrimitive 方法
    expect(typeasy.isPrimitive(42)).toBe(true);
    expect(typeasy.isPrimitive(null)).toBe(true);
    expect(typeasy.isPrimitive({})).toBe(false);
    expect(typeasy.isPrimitive([])).toBe(false);
    expect(typeasy.isPrimitive(class {})).toBe(false);
  });
});
