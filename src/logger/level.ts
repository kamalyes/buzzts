/** 表示日志的等级 */
export enum LogLevel {
  /** 跟踪信息 */
  trace,
  /** 调试信息 */
  debug,
  /** 普通日志 */
  log,
  /** 重要信息 */
  info,
  /** 成功信息 */
  success,
  /** 警告 */
  warning,
  /** 错误 */
  error,
  /** 致命错误 */
  fatal,
  /** 无日志 */
  silent,
}
