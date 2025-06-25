import { isFunction, isArray, isObject } from './object';

describe('Object Validators', () => {
  describe('isFunction', () => {
    it('should identify functions correctly', () => {
      // 箭头函数
      expect(isFunction(() => {})).toBe(true);
      // 普通函数
      expect(isFunction(function () {})).toBe(true);
      // 构造函数
      expect(isFunction(class {})).toBe(true);
    });

    it('should reject non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(123)).toBe(false);
      expect(isFunction('function')).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should identify arrays correctly', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array(5))).toBe(true);
    });

    it('should reject non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray({ length: 0 })).toBe(false); // 类数组对象
      expect(isArray(null)).toBe(false);
      expect(isArray('[]')).toBe(false);
      expect(isArray(123)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should identify plain objects correctly', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(new Object())).toBe(true);
    });

    it('should reject non-plain-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject(new Date())).toBe(true);
      expect(isObject(123)).toBe(false);
      expect(isObject('{}')).toBe(false);
      expect(isObject(() => {})).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isObject(Object.create(null))).toBe(true); // 无原型对象
      expect(isObject(new (class {})())).toBe(true); // 类实例
    });
  });
});
