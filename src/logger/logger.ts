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
   * 是否启用日志记录
   * @type {boolean}
   */
  private enableLogging: boolean;

  /**
   * 最大日志数量，超过此数量的日志将被删除
   * @type {number}
   */
  private maxLogs: number;

  /**
   * 时区
   * @type {string}
   */
  private timezone: string;

  /**
   * 用于存储日志分组的栈
   * @type {string[]}
   */
  private _logGroupStack: string[] = [];

  /**
   * 图标对象，存储不同日志类型的图标
   * @type {Record<string, string>}
   */
  private icons: Record<string, string>;

  /**
   * 获取当前环境的配置
   * @param {LoggerOptions} options - 附加选项，允许用户自定义日志记录器的行为
   * @returns {{ enableLogging: boolean, timezone: string }} - 当前环境的日志启用状态和时区
   */
  private getEnvironmentConfig(options: LoggerOptions): { enableLogging: boolean; timezone: string } {
    const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

    const enableLogging = isNode
      ? process.env.ENABLE_LOGGING === 'true'
      : options.enableLogging !== undefined
      ? options.enableLogging
      : true;

    const timezone = isNode
      ? options.timezone || process.env.TIMEZONE || 'Asia/Shanghai'
      : options.timezone || 'Asia/Shanghai';

    return { enableLogging, timezone };
  }

  /**
   * 初始化新的日志记录器
   * @param {LoggerOptions} options - 附加选项，允许用户自定义日志记录器的行为
   */
  constructor(options: LoggerOptions = {}) {
    this.logLevel = initializeLogLevel(options.logLevel);
    this.ignore = initializeIgnore(options.ignore);
    this.timestamp = options.timestamp !== false;
    this.persistent = options.persistent ?? false;
    this.maxLogs = options.maxLogs ?? 500;
    // 获取环境配置
    const { enableLogging, timezone } = this.getEnvironmentConfig(options);
    this.enableLogging = enableLogging;
    this.timezone = timezone;
    this.icons = this.initializeIcons(options);
  }

  private initializeIcons(options: LoggerOptions): Record<string, string> {
    return {
      trace: options.traceIcon || '🔍',
      debug: options.debugIcon || '🐞',
      info: options.infoIcon || '📝',
      success: options.successIcon || '✅',
      warning: options.warningIcon || '⚠️',
      error: options.errorIcon || '❌',
      fatal: options.fatalIcon || '💀',
    };
  }

  /**
   * 获取当前日志等级
   * @returns {LogLevel} - 当前日志等级
   */
  public getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * 设置日志等级
   * @param {LogLevel} level - 新的日志等级
   */
  public setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  /**
   * 设置日志记录的启用状态
   * @param {boolean} enable - 如果为 true，则启用日志记录；如果为 false，则禁用日志记录
   */
  public setEnableLogging(enable: boolean): void {
    this.enableLogging = enable;
  }

  /**
   * 获取当前日志记录的启用状态
   * @returns {boolean} - 返回当前日志记录是否启用
   */
  public getEnableLogging(): boolean {
    return this.enableLogging;
  }

  /**
   * 将日志消息写入存储
   * @param {string} message - 要写入的日志消息
   */
  private writeLogToStorage(message: string): void {
    if (this.enableLogging && this.persistent) {
      const logs = this.getStoredLogs();
      logs.push(message);
      if (logs.length > this.maxLogs) {
        logs.shift(); // 删除最旧的日志
      }
      this.storeLogs(logs);
    }
  }

  /**
   * 获取存储的日志
   * @returns {string[]} - 存储的日志数组
   */
  private getStoredLogs(): string[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      return JSON.parse(window.localStorage.getItem('logs') || '[]');
    }
    return []; // 在 Node.js 环境中返回空数组
  }

  /**
   * 存储日志
   * @param {string[]} logs - 要存储的日志数组
   */
  private storeLogs(logs: string[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('logs', JSON.stringify(logs));
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
    const timestamp = this.timestamp ? `[${new Date().toLocaleString('en-US', { timeZone: this.timezone })}] ` : '';
    return `${timestamp}${message}`;
  }

  /**
   * 记录日志消息，输出到控制台以及LocalStorage
   * @param {string} message - 要输出的日志消息
   * @param {LogLevel} [level=LogLevel.log] - 日志等级，默认为 LogLevel.log
   */
  public log(message: string, level: LogLevel = LogLevel.log): void {
    if (this.enableLogging && this.shouldLog(level, message)) {
      console.log(this.formatMessage(message));
      this.writeLogToStorage(this.formatMessage(message));
    }
  }

  /**
   * 记录调试信息
   * @param {string} message - 要记录的调试信息
   */
  public debug(message: string): void {
    this.log(`${this.icons.debug} ${message}`, LogLevel.debug);
  }

  /**
   * 记录调试信息
   * @param {string} message - 要记录的调试信息
   */
  public trace(message: string): void {
    this.log(`${this.icons.trace} ${message}`, LogLevel.debug);
  }

  /**
   * 记录信息日志
   * @param {string} message - 要记录的信息消息
   */
  public info(message: string): void {
    this.log(`${this.icons.info} ${message}`, LogLevel.info);
  }

  /**
   * 记录警告日志
   * @param {string} message - 要记录的警告消息
   */
  public warn(message: string): void {
    this.log(`${this.icons.warning} ${message}`, LogLevel.warning);
  }

  /**
   * 记录错误日志
   * @param {string} message - 要记录的错误消息
   */
  public error(message: string): void {
    this.log(`${this.icons.error} ${message}`, LogLevel.error);
  }

  /**
   * 记录致命错误日志
   * @param {string} message - 要记录的致命错误消息
   */
  public fatal(message: string): void {
    this.log(`${this.icons.fatal} ${message}`, LogLevel.fatal);
  }

  /**
   * 记录成功日志
   * @param {string} message - 要记录的成功消息
   */
  public success(message: string): void {
    this.log(`${this.icons.success} ${message}`, LogLevel.success);
  }

  /**
   * 记录fire日志
   */
  public fire(): void {
    const messages = [
      '👋 欢迎接手这个项目，当你看到这的时候说明我已经撤离了',
      '🚨 警告：可能面临Bankruptcy Escape',
      '😢 这是一个艰难的时刻，请保持冷静',
      '📊 回顾过去的项目，感恩每一个成长的机会',
      '🤝 感谢团队的支持与合作',
      '💪 无论结果如何，保持积极的心态',
      '✨ 未来会有更多的机会，继续努力',
      '💬 如果有问题，请随时联系我 mryu168@163.com,兄弟姊妹保重！！！'
    ];
    const currentSeconds = new Date().getSeconds(); // 获取当前秒数
    if (currentSeconds % 2 === 0 && Math.random() < 0.2) return ; // 20%的概率
    messages.forEach(message => {
        console.log(message);
    });
  }

  /**
   * 开始分组
   * @param {string} label - 分组的标签
   */
  public group(label: string): void {
    this._logGroupStack.push(label);
    console.group(label);
    this.log(`开始分组: ${label}`, LogLevel.log);
  }

  /**
   * 结束分组
   */
  public groupEnd(): void {
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
  public groupCollapsed(label: string): void {
    this._logGroupStack.push(label);
    console.groupCollapsed(label);
    this.log(`开始折叠分组: ${label}`, LogLevel.log);
  }

  /**
   * 记录表格信息
   * @param {any} data - 要记录的数据，可以是数组或对象
   */
  public table(data: any): void {
    console.table(data);
    this.logData('表格数据', data);
  }

  /**
   * 记录对象信息
   * @param {object} obj - 要记录的对象
   */
  public dir(obj: any): void {
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
    this.writeLogToStorage(this.formatMessage(logMessage));
  }

  /**
   * 清除日志
   */
  public clearLogs(): void {
    if (this.persistent) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('logs'); // 清空日志
      }
    }
    console.clear();
  }
}
