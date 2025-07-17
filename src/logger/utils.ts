import { LogLevel } from './level';
import { LoggerOptions } from './options';
import { LogEntry } from './entry';

/**
 * 初始化日志等级
 * @param logLevel 日志等级
 * @returns 初始化后的日志等级
 */
export function initializeLogLevel(logLevel?: LoggerOptions['logLevel']): LogLevel {
  return logLevel !== undefined ? (typeof logLevel === 'string' ? LogLevel[logLevel] : logLevel) : LogLevel.log;
}

/**
 * 初始化忽略回调
 * @param ignore 忽略的正则或函数
 * @returns 初始化后的忽略回调
 */
export function initializeIgnore(ignore?: LoggerOptions['ignore']) {
  if (ignore instanceof RegExp) {
    return (log: string | Error | LogEntry, logLevel: LogLevel, persistent?: boolean) => ignore.test(log.toString());
  }
  return ignore;
}
