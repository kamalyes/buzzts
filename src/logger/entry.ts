/** 表示一条日志项 */
export interface LogEntry {
  /** 日志的来源 */
  source?: string;
  /** 日志的信息 */
  message?: string;
  /** 日志相关的文件名 */
  fileName?: string;
  /** 日志相关的行号（从 0 开始） */
  line?: number;
  /** 日志相关的列号（从 0 开始） */
  column?: number;
  /** 日志相关的结束行号（从 0 开始） */
  endLine?: number;
  /** 日志相关的结束列号（从 0 开始） */
  endColumn?: number;
  /** 日志的详情 */
  detail?: string;
  /** 日志相关的源代码片段 */
  codeFrame?: string;
  /** 错误堆栈信息 */
  stack?: string;
}
