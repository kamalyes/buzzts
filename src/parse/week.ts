/**
 * @func parseWeek
 * @param {string} week - 星期字符串（数字或英文缩写）
 * @return {number|null} 返回数字0-6表示星期，null表示无效
 * @example parseWeek("Mon") // 1
 * @desc   解析星期字符串，支持数字(0-6)和英文缩写
 */
export function parseWeek(week: string): number | null {
  const weeks: Record<string, number> = {
    M: 1,
    MON: 1,
    MONDAY: 1,
    T: 2,
    TUE: 2,
    TUESDAY: 2,
    W: 3,
    WED: 3,
    WEDNESDAY: 3,
    R: 4,
    THU: 4,
    THURSDAY: 4,
    F: 5,
    FRI: 5,
    FRIDAY: 5,
    S: 6,
    SAT: 6,
    SATURDAY: 6,
    U: 0,
    SUN: 0,
    SUNDAY: 0,
  };
  const upperWeek = week.trim().toUpperCase();
  if (/^[0-6]$/.test(upperWeek)) {
    return Number(upperWeek);
  }
  return weeks[upperWeek] ?? null;
}

/**
 * @func parseWeekStr
 * @param {string} weekStr - 逗号或空格分隔的星期字符串集合
 * @return {number[]} 返回数字数组，表示星期0-6
 * @example parseWeekStr("Mon,Wed,Fri") // [1,3,5]
 * @desc   解析一串星期字符串，返回对应数字数组，忽略无效项
 */
export function parseWeekStr(weekStr: string): number[] {
  if (!weekStr) return [];
  const parts = weekStr.split(/[,\s]+/);
  const result: number[] = [];
  for (const part of parts) {
    const dayNum = parseWeek(part);
    if (dayNum !== null && !result.includes(dayNum)) {
      result.push(dayNum);
    }
  }
  return result.sort((a, b) => a - b);
}

/**
 * 解析星期字符串为数字数组
 * @param weekStr 星期字符串，如 "周一,周三,周五" 或 "1,3,5"
 * @param options 配置项
 * @param options.style 返回风格，'zeroBased' 返回 0~6（周日为0），'oneBased' 返回 1~7（周一为1），默认 'zeroBased'
 * @returns 数字数组，根据 style 返回对应范围的星期数字
 * @example
 * parseWeekdays('周一,周三,周五') => [1,3,5] （默认zeroBased）
 * parseWeekdays('1,3,5', { style: 'oneBased' }) => [1,3,5]
 */
export const parseWeekdays = (weekStr: string, options: { style?: 'zeroBased' | 'oneBased' } = {}): number[] => {
  if (typeof weekStr !== 'string') return [];

  const { style = 'zeroBased' } = options;

  // 映射：中文星期 -> 0~6 (周日0)
  const mapZeroBased: Record<string, number> = {
    // 中文
    周日: 0,
    星期日: 0,
    周天: 0,
    星期天: 0,
    日: 0,
    天: 0,
    周一: 1,
    星期一: 1,
    一: 1,
    周二: 2,
    星期二: 2,
    二: 2,
    周三: 3,
    星期三: 3,
    三: 3,
    周四: 4,
    星期四: 4,
    四: 4,
    周五: 5,
    星期五: 5,
    五: 5,
    周六: 6,
    星期六: 6,
    六: 6,
    // 英文缩写
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
    // 英文全称
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  // 根据风格调整数字
  return weekStr
    .split(/[,，\s]+/)
    .map(item => {
      const trimmed = item.trim();
      if (/^[0-7]$/.test(trimmed)) {
        const num = Number(trimmed);
        if (style === 'oneBased') {
          // 如果输入数字是0，转换成7（周日）
          if (num === 0) return 7;
          if (num >= 1 && num <= 7) return num;
        } else {
          // zeroBased，数字0~6有效，7无效
          if (num >= 0 && num <= 6) return num;
        }
        return NaN;
      }

      const mapped = mapZeroBased[trimmed];
      if (mapped === undefined) return NaN;

      if (style === 'oneBased') {
        // zeroBased 0~6 转成 1~7（周日7）
        return mapped === 0 ? 7 : mapped;
      }
      return mapped;
    })
    .filter(n => !isNaN(n));
};
