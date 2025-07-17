import { LogLevel } from './level';
import { LogEntry } from './entry';
import { LoggerOptions } from './options';
import { initializeLogLevel, initializeIgnore } from './utils';

/**
 * 表示一个日志记录器，提供多种日志记录功能，包括不同的日志等级、颜色输出、时间戳等
 */
export class Logger {
  private logLevel: LogLevel;

  /**
   * 可选的回调函数，用于决定是否忽略某条日志
   * @type {(log: string | Error | LogEntry, logLevel: LogLevel, persistent?: boolean) => boolean}
   */
  private ignore?: (log: string | Error | LogEntry, logLevel: LogLevel, persistent?: boolean) => boolean;

  /**
   * 是否启用颜色输出，默认为 true，当 stdout 是 TTY 且未禁用颜色
   * @type {boolean}
   */
  private colors: boolean;

  /**
   * 是否启用 Emoji，默认为根据操作系统决定
   * @type {boolean}
   */
  private emoji: boolean;

  /**
   * 是否在日志消息中包含时间戳，默认为 true
   * @type {boolean}
   */
  private timestamp: boolean;

  /**
   * 是否持久化日志，持久化日志意味着日志不会被清除
   * @type {boolean}
   */
  private persistent: boolean;

  /**
   * 最大日志数量，超过此数量的日志将被删除
   * @type {number}
   */
  private maxLogs: number;

  /**
   * 用于存储日志分组的栈
   * @type {string[]}
   */
  private _logGroupStack: string[] = [];

  /**
   * 图标对象，存储不同日志类型的图标
   * @type {{ success: string, warning: string, error: string, fatal: string }}
   */
  private icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    fatal: '❌',
  };

  /**
   * 初始化新的日志记录器
   * @param {LoggerOptions} options - 附加选项，允许用户自定义日志记录器的行为
   */
  constructor(options: LoggerOptions = {}) {
    this.logLevel = initializeLogLevel(options.logLevel);
    this.ignore = initializeIgnore(options.ignore);
    this.colors = options.colors ?? (process.stdout.isTTY && !process.env['NODE_DISABLE_COLORS']);
    this.emoji = options.emoji ?? (process.platform !== 'win32' || !/^\d\./.test(require('os').release()));
    this.timestamp = options.timestamp !== false;
    this.persistent = options.persistent ?? false;
    this.maxLogs = options.maxLogs ?? 500;

    // 自定义图标
    this.icons.success = options.successIcon || this.icons.success;
    this.icons.warning = options.warningIcon || this.icons.warning;
    this.icons.error = options.errorIcon || this.icons.error;
    this.icons.fatal = options.fatalIcon || this.icons.fatal;
  }

  /**
   * 获取当前日志等级
   * @returns {LogLevel} - 当前日志等级
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * 设置日志等级
   * @param {LogLevel} level - 新的日志等级
   */
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  /**
   * 将日志消息写入存储
   * @param {string} message - 要写入的日志消息
   */
  private writeLogToStorage(message: string): void {
    if (this.persistent) {
      const logs = JSON.parse(localStorage.getItem('logs') || '[]');
      logs.push(message);
      if (logs.length > this.maxLogs) {
        logs.shift(); // 删除最旧的日志
      }
      localStorage.setItem('logs', JSON.stringify(logs));
    }
  }

  /**
   * 判断是否应该记录日志
   * @param {LogLevel} level - 日志等级
   * @param {string | Error | LogEntry} log - 日志内容
   * @param {boolean} [persistent=false] - 是否持久化日志
   * @returns {boolean} - 是否应该记录日志
   */
  private shouldLog(level: LogLevel, log: string | Error | LogEntry, persistent: boolean = false): boolean {
    return level >= this.logLevel && !(this.ignore && this.ignore(log, level, persistent));
  }

  /**
   * 格式化日志消息
   * @param {string} message - 要格式化的日志消息
   * @returns {string} - 格式化后的日志消息
   */
  private formatMessage(message: string): string {
    const timestamp = this.timestamp ? `[${new Date().toISOString()}] ` : '';
    return `${timestamp}${message}`;
  }

  /**
   * 将日志消息输出到控制台
   * @param {string} message - 要输出的日志消息
   */
  private logToConsole(message: string): void {
    console.log(this.formatMessage(message));
    this.writeLogToStorage(this.formatMessage(message));
  }

  /**
   * 记录日志消息
   * @param {string} message - 要记录的日志消息
   * @param {LogLevel} [level=LogLevel.log] - 日志等级，默认为 LogLevel.log
   */
  log(message: string, level: LogLevel = LogLevel.log): void {
    if (this.shouldLog(level, message)) {
      this.logToConsole(message);
    }
  }

  /**
   * 记录信息日志
   * @param {string} message - 要记录的信息消息
   */
  info(message: string): void {
    this.log(message, LogLevel.info);
  }

  /**
   * 记录警告日志
   * @param {string} message - 要记录的警告消息
   */
  warn(message: string): void {
    this.log(`${this.icons.warning} ${message}`, LogLevel.warning);
  }

  /**
   * 记录错误日志
   * @param {string} message - 要记录的错误消息
   */
  error(message: string): void {
    this.log(`${this.icons.error} ${message}`, LogLevel.error);
  }

  /**
   * 记录致命错误日志
   * @param {string} message - 要记录的致命错误消息
   */
  fatal(message: string): void {
    this.log(`${this.icons.fatal} ${message}`, LogLevel.fatal);
  }

  /**
   * 记录成功日志
   * @param {string} message - 要记录的成功消息
   */
  success(message: string): void {
    this.log(`${this.icons.success} ${message}`, LogLevel.success);
  }

  /**
   * 开始分组
   * @param {string} label - 分组的标签
   */
  group(label: string): void {
    this._logGroupStack.push(label);
    console.group(label);
    this.log(`开始分组: ${label}`, LogLevel.log);
  }

  /**
   * 结束分组
   */
  groupEnd(): void {
    const label = this._logGroupStack.pop();
    if (label) {
      console.groupEnd();
      this.log(`结束分组: ${label}`, LogLevel.log);
    }
  }

  /**
   * 以折叠方式开始分组
   * @param {string} label - 分组的标签
   */
  groupCollapsed(label: string): void {
    this._logGroupStack.push(label);
    console.groupCollapsed(label);
    this.log(`开始折叠分组: ${label}`, LogLevel.log);
  }

  /**
   * 记录调试信息
   * @param {string} message - 要记录的调试信息
   */
  debug(message: string): void {
    this.log(message, LogLevel.debug);
  }

  /**
   * 记录表格信息
   * @param {any} data - 要记录的数据，可以是数组或对象
   */
  table(data: any): void {
    console.table(data);
    this.logData('表格数据', data);
  }

  /**
   * 记录对象信息
   * @param {object} obj - 要记录的对象
   */
  dir(obj: any): void {
    console.dir(obj);
    this.logData('对象数据', obj);
  }

  /**
   * 将数据记录到存储
   * @param {string} label - 数据的标签
   * @param {any} data - 要记录的数据
   */
  private logData(label: string, data: any): void {
    const groupPrefix = this._logGroupStack.length > 0 ? `[${this._logGroupStack.join(' > ')}] ` : '';
    const logMessage = `${groupPrefix}${label}: ${JSON.stringify(data, null, 2)}`;
    this.writeLogToStorage(logMessage);
  }

  /**
   * 清除日志
   */
  clearLogs(): void {
    if (this.persistent) {
      localStorage.removeItem('logs'); // 清空日志
    }
    console.clear();
  }
}
