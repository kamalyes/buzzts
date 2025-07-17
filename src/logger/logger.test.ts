import { Logger } from './logger';
import { LogLevel } from './level';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger({ logLevel: LogLevel.debug, timestamp: false }); // 启用时间戳为 false
    console.log = jest.fn(); // Mock console.log
    console.group = jest.fn(); // Mock console.group
    console.groupEnd = jest.fn(); // Mock console.groupEnd
    console.groupCollapsed = jest.fn(); // Mock console.groupCollapsed
    console.table = jest.fn(); // Mock console.table
    console.dir = jest.fn(); // Mock console.dir
  });

  afterEach(() => {
    jest.clearAllMocks(); // 清除所有 Mock
  });

  test('should log a log message', () => {
    logger.log('This is a log message', LogLevel.log);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('This is a log message'));
  });

  test('should log an info message', () => {
    logger.info('This is an info message');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('This is an info message'));
  });

  test('should log a warning message', () => {
    logger.warn('This is a warning message');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('⚠️ This is a warning message'));
  });

  test('should log an error message', () => {
    logger.error('This is an error message');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('❌ This is an error message'));
  });

  test('should log a fatal message', () => {
    logger.fatal('This is a fatal message');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('❌ This is a fatal message'));
  });

  test('should log a success message', () => {
    logger.success('This is a success message');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✅ This is a success message'));
  });

  test('should not log messages below the log level', () => {
    logger.setLogLevel(LogLevel.warning);

    logger.log('This is a log message', LogLevel.log);
    expect(console.log).not.toHaveBeenCalled();

    logger.info('This is an info message');
    expect(console.log).not.toHaveBeenCalled();
  });

  test('should group logs', () => {
    logger.group('Test Group');
    expect(console.group).toHaveBeenCalledWith('Test Group');

    logger.groupEnd();
    expect(console.groupEnd).toHaveBeenCalled();
  });

  test('should log tables', () => {
    const data = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
    ];
    logger.table(data);
    expect(console.table).toHaveBeenCalledWith(data);
  });

  test('should log objects', () => {
    const obj = { key: 'value' };
    logger.dir(obj);
    expect(console.dir).toHaveBeenCalledWith(obj);
  });
});
