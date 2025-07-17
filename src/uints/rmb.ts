/**
 * @class RmbFormatter
 * @description 处理人民币金额单位之间的转换，包括元、角、分和厘
 */
export class RmbFormatter {
  private static readonly CONVERSION_FACTORS = {
    yuan: 100, // 1元 = 100分
    jiao: 10, // 1角 = 10分
    cents: 1, // 1分 = 1分
    li: 0.1, // 1厘 = 0.1分
  };

  private amount: number; // 当前金额，单位为分
  private precision: number; // 用户自定义精度

  /**
   * @constructor
   * 初始化 RmbFormatter 实例，不接受初始金额
   * @description 创建一个新的 RmbFormatter 实例，初始金额设置为0
   * @example
   * const formatter = new RmbFormatter(); // 创建一个 RmbFormatter 实例
   */
  constructor() {
    this.amount = 0; // 初始化金额为0
    this.precision = 2; // 默认精度为2位小数
  }

  /**
   * @func setAmount
   * @param {number | string} amount - 需要设置的金额，可以是数字或数字字符串
   * @param {'yuan' | 'jiao' | 'cents' | 'li'} from - 当前金额的单位，支持 'yuan', 'jiao', 'cents', 'li'
   * @throws {Error} 当输入金额无法转换为有效数字时抛出异常
   * @description 设置金额和单位，并将其转换为分
   * @example
   * const formatter = new RmbFormatter();
   * formatter.setAmount(100, 'yuan'); // 设置金额为100元
   * console.log(formatter.toCents()); // 输出: "10000.00"
   * formatter.setAmount(10, 'jiao'); // 设置金额为10角
   * console.log(formatter.toCents()); // 输出: "1000.00"
   * formatter.setAmount(1, 'cents'); // 设置金额为1分
   * console.log(formatter.toCents()); // 输出: "1.00"
   * formatter.setAmount(1, 'li'); // 设置金额为1厘
   * console.log(formatter.toCents()); // 输出: "0.10"
   */
  setAmount(amount: number | string, from: 'yuan' | 'jiao' | 'cents' | 'li'): void {
    this.amount = this.parseAmount(amount, from);
  }

  /**
   * @func setPrecision
   * @param {number} precision - 用户自定义的精度，必须为非负整数。
   * @throws {Error} 当精度无效时抛出异常。
   * @description 设置用户自定义的精度。
   * @example
   * formatter.setPrecision(3); // 设置精度为3位小数
   */
  setPrecision(precision: number): void {
    if (!Number.isInteger(precision) || precision < 0) {
      throw new Error('Precision must be a non-negative integer.');
    }
    this.precision = precision;
  }

  /**
   * @func parseAmount
   * @private
   * @param {number | string} amount - 需要解析的金额，可以是数字或数字字符串
   * @param {'yuan' | 'jiao' | 'cents' | 'li'} from - 当前金额的单位
   * @returns {number} 解析后的金额，单位为分
   * @throws {Error} 当参数无法转换为有效数字时抛出异常
   * @description 将输入的金额解析为数字，并确保其为非负数，返回以分为单位的金额
   */
  private parseAmount(amount: number | string, from: 'yuan' | 'jiao' | 'cents' | 'li'): number {
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      throw new Error('Invalid input: amount must be a non-negative number or a numeric string.');
    }
    // 根据单位转换为分
    const conversionFactor = RmbFormatter.CONVERSION_FACTORS[from];
    return Math.round(parsedAmount * conversionFactor * 100) / 100; // 确保精度,保证金额以分为单位
  }

  /**
   * @func toYuan
   * @returns {string} 转换为元的金额，保留两位小数
   * @description 将当前金额转换为元，并返回格式化的字符串
   * @example
   * const formatter = new RmbFormatter();
   * formatter.setAmount(100, 'cents');
   * console.log(formatter.toYuan()); // 输出: "1.00"
   * formatter.setAmount(250, 'cents');
   * console.log(formatter.toYuan()); // 输出: "2.50"
   */
  toYuan(): string {
    return (this.amount / RmbFormatter.CONVERSION_FACTORS.yuan).toFixed(this.precision);
  }

  /**
   * @func toJiao
   * @returns {string} 转换为角的金额，保留两位小数
   * @description 将当前金额转换为角，并返回格式化的字符串
   * @example
   * const formatter = new RmbFormatter();
   * formatter.setAmount(100, 'cents');
   * console.log(formatter.toJiao()); // 输出: "1.00"
   * formatter.setAmount(150, 'cents');
   * console.log(formatter.toJiao()); // 输出: "1.50"
   */
  toJiao(): string {
    return (this.amount / RmbFormatter.CONVERSION_FACTORS.jiao).toFixed(this.precision);
  }

  /**
   * @func toCents
   * @returns {string} 转换为分的金额，保留两位小数
   * @description 将当前金额转换为分，并返回格式化的字符串
   * @example
   * const formatter = new RmbFormatter();
   * formatter.setAmount(1, 'yuan');
   * console.log(formatter.toCents()); // 输出: "100.00"
   * formatter.setAmount(0.5, 'yuan');
   * console.log(formatter.toCents()); // 输出: "50.00"
   */
  toCents(): string {
    return this.amount.toFixed(this.precision); // 直接返回以分为单位的金额
  }

  /**
   * @func toLi
   * @returns {string} 转换为厘的金额，保留两位小数
   * @description 将当前金额转换为厘，并返回格式化的字符串
   * @example
   * const formatter = new RmbFormatter();
   * formatter.setAmount(1, 'cents');
   * console.log(formatter.toLi()); // 输出: "10.00"
   * formatter.setAmount(20, 'jiao');
   * console.log(formatter.toLi()); // 输出: "200.00"
   * formatter.setAmount(5, 'yuan');
   * console.log(formatter.toLi()); // 输出: "500.00"
   */
  toLi(): string {
    return (this.amount / RmbFormatter.CONVERSION_FACTORS.li).toFixed(this.precision); // 除以 0.1 以转换为厘
  }
}

/**
 * @func upperMoney
 * @param  {number} amount
 * @return {string}
 * @desc   现金额转大写
 * @example upperMoney(123456789.123) // 壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元叁角肆分叁厘
 */
export function upperMoney(amount: number): string {
  // 检查无效输入
  if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) return '';
  if (amount === 0) return '零元整';

  const fraction = ['角', '分', '厘'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];

  let head = amount < 0 ? '负' : '';
  amount = Math.abs(amount);

  let s = '';

  // 处理小数部分
  for (let i = 0; i < fraction.length; i++) {
    const m = Math.floor(amount * 10 * Math.pow(10, i)) % 10;
    if (m !== 0) {
      s += digit[m] + fraction[i];
    }
  }
  if (s === '') s = '整';

  // 处理整数部分
  amount = Math.floor(amount);

  for (let i = 0; i < unit[0].length && amount > 0; i++) {
    let p = '';
    let part = amount % 10000;
    amount = Math.floor(amount / 10000);

    for (let j = 0; j < unit[1].length && part > 0; j++) {
      const d = part % 10;
      part = Math.floor(part / 10);
      if (d !== 0) {
        p = digit[d] + unit[1][j] + p;
      } else {
        // 避免连续零
        if (!p.startsWith(digit[0])) {
          p = digit[0] + p;
        }
      }
    }
    // 去除末尾多余零
    p = p.replace(/(零)+$/g, '');
    // 替换连续多个零为一个零
    p = p.replace(/(零)+/g, '零');

    if (p !== '') {
      s = p + unit[0][i] + s;
    } else {
      // 如果当前四位为0且不是第一块，且s开头不是零，则加零
      if (!s.startsWith(digit[0]) && s !== '整') {
        s = digit[0] + s;
      }
    }
  }

  // 处理结果中多余零
  s = s.replace(/(零)+/g, '零');
  // 去除零元前面的零
  s = s.replace(/零元/, '元');
  // 去除末尾零
  s = s.replace(/零+$/, '');
  // 如果结尾不是整，加上“整”
  if (!s.endsWith('角') && !s.endsWith('分') && !s.endsWith('厘') && !s.endsWith('整')) {
    s += '整';
  }

  return head + s;
}
