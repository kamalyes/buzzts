import {
  isIntOrFloat,
  isPositiveIntOrFloat,
  isNegativeIntOrFloat,
  isLenNNumber,
  isGeNNumber,
  isMNIntervalNumber,
  isStartingWithNonZero,
  isNNovelsOfRealNumber,
  isMNNovelsOfRealNumber,
  isNanZeroNumber,
  isNanZeroNegNumber,
} from './number';

describe('Number Validators', () => {
  describe('isIntOrFloat', () => {
    it('should validate integers', () => {
      expect(isIntOrFloat('123')).toBe(true);
      expect(isIntOrFloat('0')).toBe(true);
      expect(isIntOrFloat('-123')).toBe(true);
      // isPositiveIntOrFloat 测试
      expect(isPositiveIntOrFloat('123')).toBe(true); // 正整数
      expect(isPositiveIntOrFloat('123.45')).toBe(true); // 正浮点数
      expect(isPositiveIntOrFloat('-123')).toBe(false); // 负数（不通过）
      expect(isPositiveIntOrFloat('0')).toBe(true); // 0（视为非负）
      expect(isPositiveIntOrFloat('123.')).toBe(false); // 无效小数格式

      // isNegativeIntOrFloat 测试
      expect(isNegativeIntOrFloat('-123')).toBe(true); // 负整数
      expect(isNegativeIntOrFloat('-123.45')).toBe(true); // 负浮点数
      expect(isNegativeIntOrFloat('123')).toBe(false); // 正数（不通过）
      expect(isNegativeIntOrFloat('-0')).toBe(true); // -0（特殊情况，视业务决定是否允许）
      expect(isNegativeIntOrFloat('-123.')).toBe(false); // 无效小数格式
    });

    it('should validate floats with up to 2 decimal places', () => {
      expect(isIntOrFloat('123.45')).toBe(true);
      expect(isIntOrFloat('0.99')).toBe(true);
      expect(isIntOrFloat('-123.45')).toBe(true);
    });

    it('should reject invalid numbers', () => {
      expect(isIntOrFloat('123.456')).toBe(false); // 3 decimal places
      expect(isIntOrFloat('abc')).toBe(false);
      expect(isIntOrFloat('123.')).toBe(false);
      expect(isIntOrFloat('.45')).toBe(false);
    });
  });

  describe('isLenNNumber', () => {
    it('should validate numbers with exact length', () => {
      expect(isLenNNumber('1234', 4)).toBe(true);
      expect(isLenNNumber('1', 1)).toBe(true);
    });

    it('should reject numbers with wrong length', () => {
      expect(isLenNNumber('123', 4)).toBe(false);
      expect(isLenNNumber('12345', 4)).toBe(false);
      expect(isLenNNumber('abc', 3)).toBe(false);
    });
  });

  describe('isGeNNumber', () => {
    it('should validate numbers with length >= n', () => {
      expect(isGeNNumber('1234', 4)).toBe(true);
      expect(isGeNNumber('12345', 4)).toBe(true);
      expect(isGeNNumber('1', 1)).toBe(true);
    });

    it('should reject numbers with length < n', () => {
      expect(isGeNNumber('123', 4)).toBe(false);
      expect(isGeNNumber('abc', 3)).toBe(false);
    });
  });

  describe('isMNIntervalNumber', () => {
    it('should validate numbers with length between m and n', () => {
      expect(isMNIntervalNumber('123', 3, 5)).toBe(true);
      expect(isMNIntervalNumber('1234', 3, 5)).toBe(true);
      expect(isMNIntervalNumber('12345', 3, 5)).toBe(true);
    });

    it('should reject numbers outside length range', () => {
      expect(isMNIntervalNumber('12', 3, 5)).toBe(false);
      expect(isMNIntervalNumber('123456', 3, 5)).toBe(false);
      expect(isMNIntervalNumber('abc', 3, 5)).toBe(false);
    });
  });

  describe('isStartingWithNonZero', () => {
    it('should validate numbers starting with non-zero', () => {
      expect(isStartingWithNonZero('123')).toBe(true);
      expect(isStartingWithNonZero('5')).toBe(true);
    });

    it('should reject numbers starting with zero', () => {
      expect(isStartingWithNonZero('0123')).toBe(false);
      expect(isStartingWithNonZero('0')).toBe(false);
      expect(isStartingWithNonZero('abc')).toBe(false);
    });
  });

  describe('isNNovelsOfRealNumber', () => {
    it('should validate numbers with exactly n decimal places', () => {
      expect(isNNovelsOfRealNumber('123.45', 2)).toBe(true);
      expect(isNNovelsOfRealNumber('0.99', 2)).toBe(true);
      expect(isNNovelsOfRealNumber('123', 2)).toBe(true); // no decimal is allowed
    });

    it('should reject numbers with wrong decimal places', () => {
      expect(isNNovelsOfRealNumber('123.4', 2)).toBe(false);
      expect(isNNovelsOfRealNumber('123.456', 2)).toBe(false);
      expect(isNNovelsOfRealNumber('abc', 2)).toBe(false);
    });
  });

  describe('isMNNovelsOfRealNumber', () => {
    it('should validate numbers with m to n decimal places', () => {
      expect(isMNNovelsOfRealNumber('123.45', 2, 3)).toBe(true);
      expect(isMNNovelsOfRealNumber('123.456', 2, 3)).toBe(true);
      expect(isMNNovelsOfRealNumber('123', 2, 3)).toBe(true); // no decimal is allowed
    });

    it('should reject numbers with wrong decimal places', () => {
      expect(isMNNovelsOfRealNumber('123.4', 2, 3)).toBe(false);
      expect(isMNNovelsOfRealNumber('123.4567', 2, 3)).toBe(false);
      expect(isMNNovelsOfRealNumber('abc', 2, 3)).toBe(false);
    });
  });

  describe('isNanZeroNumber', () => {
    it('should validate positive non-zero integers', () => {
      expect(isNanZeroNumber('123')).toBe(true);
      expect(isNanZeroNumber('1')).toBe(true);
    });

    it('should reject invalid numbers', () => {
      expect(isNanZeroNumber('0')).toBe(false);
      expect(isNanZeroNumber('-123')).toBe(false);
      expect(isNanZeroNumber('123.45')).toBe(false);
      expect(isNanZeroNumber('abc')).toBe(false);
    });
  });

  describe('isNanZeroNegNumber', () => {
    it('should validate negative non-zero integers', () => {
      expect(isNanZeroNegNumber('-123')).toBe(true);
      expect(isNanZeroNegNumber('-1')).toBe(true);
    });

    it('should reject invalid numbers', () => {
      expect(isNanZeroNegNumber('0')).toBe(false);
      expect(isNanZeroNegNumber('123')).toBe(false);
      expect(isNanZeroNegNumber('-123.45')).toBe(false);
      expect(isNanZeroNegNumber('abc')).toBe(false);
    });
  });
});
