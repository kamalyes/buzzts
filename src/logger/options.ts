import { LogLevel } from './level';
import { LogEntry } from './entry';

/**
 * 表示日志记录器的选项
 */
export interface LoggerOptions {
  /**
   * 设置日志等级，控制哪些日志消息会被记录
   * 可以是 LogLevel 枚举值或其字符串键名
   */
  logLevel?: LogLevel | keyof typeof LogLevel;

  /**
   * 可选的回调函数或正则表达式，用于决定是否忽略某条日志
   * 如果是函数，接收日志信息、日志等级和持久化标志作为参数，返回布尔值
   */
  ignore?: RegExp | ((log: string | Error | LogEntry, logLevel: LogLevel, persistent?: boolean) => boolean);

  /**
   * 是否在日志消息中包含时间戳
   */
  timestamp?: boolean;

  /**
   * 是否持久化日志，持久化日志意味着日志不会被清除
   */
  persistent?: boolean;

  /**
   * 是否启用日志记录
   * @type {boolean}
   */
  enableLogging?: boolean;

  /**
   * 最大日志数量，超过此数量的日志将被删除
   */
  maxLogs?: number;

  /**
   * 时区
   */
  timezone?: string;

  /**
   * 自定义跟踪图标
   */
  traceIcon?: string;

  /**
   * 自定义调试图标
   */
  debugIcon?: string;

  /**
   * 自定义普通图标
   */
  infoIcon?: string;

  /**
   * 自定义成功图标
   */
  successIcon?: string;

  /**
   * 自定义警告图标
   */
  warningIcon?: string;

  /**
   * 自定义错误图标
   */
  errorIcon?: string;

  /**
   * 自定义致命错误图标
   */
  fatalIcon?: string;
}
