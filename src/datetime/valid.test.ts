import {
  compareTwoDates,
  isBetween,
  isLeapYear,
  isValidYear,
  isValidDay,
  isValidMonth,
  isWeekend,
  isSameDay,
  isValidDateT,
} from './valid';

describe('比较两个日期', () => {
  test('dateA 在 dateB 之前返回 true', () => {
    expect(compareTwoDates('2023-06-20', '2023-06-23', 'before')).toBe(true);
  });

  test('dateA 在 dateB 之后返回 true', () => {
    expect(compareTwoDates('2023-06-25', '2023-06-23', 'after')).toBe(true);
  });

  test('无效日期返回 null', () => {
    expect(compareTwoDates('invalid', '2023-06-23', 'before')).toBeNull();
  });
});

describe('判断日期是否在范围内', () => {
  test('日期在范围内返回 true', () => {
    expect(isBetween('2023-06-22', '2023-06-20', '2023-06-25')).toBe(true);
  });

  test('日期不在范围内返回 false', () => {
    expect(isBetween('2023-06-19', '2023-06-20', '2023-06-25')).toBe(false);
  });

  test('无效日期返回 null', () => {
    expect(isBetween('invalid', '2023-06-20', '2023-06-25')).toBeNull();
  });
});

describe('日期验证函数', () => {
  describe('判断是否为闰年', () => {
    test('应该对闰年返回 true', () => {
      expect(isLeapYear(2020)).toBe(true);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(1900)).toBe(false); // 1900 不是闰年
    });

    test('应该对非闰年返回 false', () => {
      expect(isLeapYear(2021)).toBe(false);
      expect(isLeapYear(2023)).toBe(false);
    });
  });

  describe('判断年份是否有效', () => {
    test('应该对有效年份返回 true', () => {
      expect(isValidYear(2023)).toBe(true);
      expect(isValidYear(1900)).toBe(true);
    });

    test('应该对无效年份返回 false', () => {
      expect(isValidYear(1899)).toBe(false);
      expect(isValidYear(2050)).toBe(false); // 假设当前年份是 2023
    });
  });

  describe('判断月份是否有效', () => {
    test('应该对有效月份返回 true', () => {
      expect(isValidMonth(1)).toBe(true); // 一月
      expect(isValidMonth(12)).toBe(true); // 十二月
    });

    test('应该对无效月份返回 false', () => {
      expect(isValidMonth(0)).toBe(false);
      expect(isValidMonth(13)).toBe(false);
    });
  });

  describe('判断日期是否有效', () => {
    test('应该对有效日期返回 true', () => {
      expect(isValidDay(31, 1, 2023)).toBe(true); // 一月31日
      expect(isValidDay(29, 2, 2020)).toBe(true); // 闰年
      expect(isValidDay(28, 2, 2023)).toBe(true); // 非闰年
    });

    test('应该对无效日期返回 false', () => {
      expect(isValidDay(30, 2, 2023)).toBe(false); // 二月30日
      expect(isValidDay(32, 1, 2023)).toBe(false); // 一月32日
      expect(isValidDay(0, 1, 2023)).toBe(false); // 无效日期
    });
  });

  describe('判断日期字符串是否有效', () => {
    test('应该对有效日期字符串返回 true', () => {
      expect(isValidDateT('20230228')).toBe(true); // 2023年2月28日
      expect(isValidDateT('20200229')).toBe(true); // 2020年2月29日
      expect(isValidDateT('19001231')).toBe(true); // 1900年12月31日
    });

    test('应该对无效日期字符串返回 false', () => {
      expect(isValidDateT('20230229')).toBe(false); // 2023年2月29日
      expect(isValidDateT('20230132')).toBe(false); // 2023年1月32日
      expect(isValidDateT('20231301')).toBe(false); // 2023年13月1日
      expect(isValidDateT('18991231')).toBe(false); // 1899年12月31日
    });

    test('应该正确处理 YYMMDD 格式', () => {
      expect(isValidDateT('990229')).toBe(false); // 1999年2月29日（没有这一天）
      expect(isValidDateT('990228')).toBe(true); // 1999年2月28日
      expect(isValidDateT('990230')).toBe(false); // 1999年2月30日
    });
  });
});

describe('判断是否为周末', () => {
  test('2023-06-23（星期五）返回 false', () => {
    expect(isWeekend('2023-06-23')).toBe(false);
  });

  test('2023-06-24（星期六）返回 true', () => {
    expect(isWeekend('2023-06-24')).toBe(true);
  });

  test('2023-06-25（星期日）返回 true', () => {
    expect(isWeekend('2023-06-25')).toBe(true);
  });

  test('无效日期返回 null', () => {
    expect(isWeekend('invalid')).toBeNull();
  });
});

describe('判断是否为同一天', () => {
  test('同一天返回 true', () => {
    expect(isSameDay('2023-06-23T10:00:00', '2023-06-23T23:59:59')).toBe(true);
  });

  test('不同天返回 false', () => {
    expect(isSameDay('2023-06-23T23:59:59', '2023-06-24T00:00:00')).toBe(false);
  });

  test('无效日期返回 null', () => {
    expect(isSameDay('invalid', '2023-06-23')).toBeNull();
  });
});

describe('判断日期字符串是否有效', () => {
  test('有效的6位日期字符串', () => {
    expect(isValidDateT('990101')).toBe(true); // 1999年1月1日
    expect(isValidDateT('000101')).toBe(true); // 2000年1月1日
    expect(isValidDateT('991231')).toBe(true); // 1999年12月31日
  });

  test('有效的8位日期字符串', () => {
    expect(isValidDateT('20230101')).toBe(true); // 2023年1月1日
    expect(isValidDateT('20230228')).toBe(true); // 2023年2月28日
    expect(isValidDateT('20230229')).toBe(false); // 2023年2月29日（非闰年）
  });

  test('无效的8位日期字符串', () => {
    expect(isValidDateT('20231301')).toBe(false); // 2023年13月1日（无效月份）
    expect(isValidDateT('20230230')).toBe(false); // 2023年2月30日（无效日期）
    expect(isValidDateT('20230132')).toBe(false); // 2023年1月32日（无效日期）
  });

  test('边界情况', () => {
    expect(isValidDateT('19000101')).toBe(true); // 1900年1月1日
    expect(isValidDateT('18991231')).toBe(false); // 1899年12月31日（小于1900年）
  });
});
