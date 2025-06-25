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
