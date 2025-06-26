import { parseWeek, parseWeekStr, parseWeekdays } from './week';

describe('parseWeek', () => {
  test('数字字符串0-6转换正确', () => {
    for (let i = 0; i <= 6; i++) {
      expect(parseWeek(i.toString())).toBe(i);
    }
  });

  test('英文缩写正确解析', () => {
    expect(parseWeek('Mon')).toBe(1);
    expect(parseWeek('m')).toBe(1);
    expect(parseWeek('TUE')).toBe(2);
    expect(parseWeek('w')).toBe(3);
    expect(parseWeek('Thu')).toBe(4);
    expect(parseWeek('F')).toBe(5);
    expect(parseWeek('Sat')).toBe(6);
    expect(parseWeek('Sun')).toBe(0);
    expect(parseWeek('u')).toBe(0);
  });

  test('无效字符串返回null', () => {
    expect(parseWeek('Sundayy')).toBeNull();
    expect(parseWeek('8')).toBeNull();
    expect(parseWeek('')).toBeNull();
  });

  test('忽略大小写和空白', () => {
    expect(parseWeek(' mon ')).toBe(1);
    expect(parseWeek('  t  ')).toBe(2);
  });
});

describe('parseWeekStr', () => {
  test('逗号和空格分隔字符串解析', () => {
    expect(parseWeekStr('Mon,Wed,Fri')).toEqual([1, 3, 5]);
    expect(parseWeekStr('Mon Wed Fri')).toEqual([1, 3, 5]);
    expect(parseWeekStr('Mon, Wed, Fri')).toEqual([1, 3, 5]);
  });

  test('去重且排序', () => {
    expect(parseWeekStr('Mon,Mon,Fri,Wed')).toEqual([1, 3, 5]);
  });

  test('忽略无效项', () => {
    expect(parseWeekStr('Mon,abc,Fri')).toEqual([1, 5]);
  });

  test('空字符串返回空数组', () => {
    expect(parseWeekStr('')).toEqual([]);
  });
});

describe('parseWeekdays', () => {
  test('默认 zeroBased 风格中文星期解析', () => {
    expect(parseWeekdays('周日,周一,周三')).toEqual([0, 1, 3]);
    expect(parseWeekdays('星期二，星期四')).toEqual([2, 4]);
  });

  test('默认 zeroBased 风格数字解析', () => {
    expect(parseWeekdays('0,1,3')).toEqual([0, 1, 3]);
    expect(parseWeekdays('6')).toEqual([6]);
    expect(parseWeekdays('7')).toEqual([]); // 7无效
  });

  test('oneBased 风格中文星期解析', () => {
    expect(parseWeekdays('周日,周一,周三', { style: 'oneBased' })).toEqual([7, 1, 3]);
    expect(parseWeekdays('星期二，星期四', { style: 'oneBased' })).toEqual([2, 4]);
  });

  test('oneBased 风格数字解析', () => {
    expect(parseWeekdays('0,1,3', { style: 'oneBased' })).toEqual([7, 1, 3]);
    expect(parseWeekdays('7', { style: 'oneBased' })).toEqual([7]);
    expect(parseWeekdays('8', { style: 'oneBased' })).toEqual([]);
  });

  test('忽略无效项', () => {
    expect(parseWeekdays('周一,abc,5')).toEqual([1, 5]);
    expect(parseWeekdays('周八,9')).toEqual([]);
  });

  test('空字符串或非字符串输入', () => {
    expect(parseWeekdays('')).toEqual([]);
    expect(parseWeekdays(null as any)).toEqual([]);
    expect(parseWeekdays(undefined as any)).toEqual([]);
  });
});
