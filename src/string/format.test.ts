import {
  camelToSnake,
  snakeToCamel,
  toConstantCase,
  camelToSpace,
  capitalizeFirstLetter,
  maskPhoneNumber,
  truncateText,
} from './format';

describe('命名风格转换工具', () => {
  describe('camelToSnake', () => {
    test('基础转换', () => {
      expect(camelToSnake('userName')).toBe('user_name');
      expect(camelToSnake('XMLHttpRequest')).toBe('xml_http_request');
    });

    test('带前缀下划线', () => {
      expect(camelToSnake('_privateField')).toBe('private_field');
      expect(camelToSnake('_privateField', { keepUnderscorePrefix: true })).toBe('_private_field');
    });

    test('异常处理', () => {
      expect(camelToSnake(null as any)).toBe('');
      expect(camelToSnake(123 as any)).toBe('');
    });
  });

  describe('snakeToCamel', () => {
    test('基础转换', () => {
      expect(snakeToCamel('user_name')).toBe('userName');
      expect(snakeToCamel('first_name_last_name')).toBe('firstNameLastName');
    });

    test('帕斯卡模式', () => {
      expect(snakeToCamel('user_name', { pascalCase: true })).toBe('UserName');
      expect(snakeToCamel('_private_field', { pascalCase: true })).toBe('PrivateField');
    });

    test('异常处理', () => {
      expect(snakeToCamel(null as any)).toBe('');
      expect(snakeToCamel('')).toBe('');
    });
  });

  describe('toConstantCase', () => {
    test('基础转换', () => {
      expect(toConstantCase('userName')).toBe('USER_NAME');
      expect(toConstantCase('kebab-case')).toBe('KEBAB_CASE');
    });

    test('空值处理', () => {
      expect(toConstantCase(null)).toBe('');
      expect(toConstantCase(null, { preserveNull: true })).toBeNull();
    });

    test('特殊字符', () => {
      expect(toConstantCase('  extra  spaces  ')).toBe('EXTRA_SPACES');
      expect(toConstantCase('already_CONSTANT')).toBe('ALREADY_CONSTANT');
    });
  });

  describe('camelToSpace', () => {
    test('基础转换', () => {
      expect(camelToSpace('userName')).toBe('user name');
      expect(camelToSpace('camelCaseString')).toBe('camel case string');
    });

    test('首字母大写', () => {
      expect(camelToSpace('userName', { capitalize: true })).toBe('User name');
      expect(camelToSpace('pdfGenerator', { capitalize: true })).toBe('Pdf generator');
    });

    test('边界情况', () => {
      expect(camelToSpace('')).toBe('');
      expect(camelToSpace('A')).toBe('a');
    });
  });
});

describe('字符串工具函数测试套件', () => {
  // ==================== capitalizeFirstLetter 测试 ====================
  describe('capitalizeFirstLetter() - 首字母大写', () => {
    it('应转换英文字符串首字母', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
    });

    it('应忽略非字母字符或非ASCII字符', () => {
      expect(capitalizeFirstLetter('你好')).toBe('你好');
      expect(capitalizeFirstLetter('123abc')).toBe('123abc');
    });

    it('应处理空字符串或非字符串输入', () => {
      expect(capitalizeFirstLetter('')).toBe('');
      // @ts-expect-error 测试非法类型
      expect(capitalizeFirstLetter(null)).toBe(null);
    });

    it('应保持其他字母不变', () => {
      expect(capitalizeFirstLetter('hElLo')).toBe('HElLo');
    });
  });

  // ==================== maskPhoneNumber 测试 ====================
  describe('maskPhoneNumber() - 手机号加密', () => {
    it('应正确加密标准手机号', () => {
      expect(maskPhoneNumber('13812345678')).toBe('138****5678');
      expect(maskPhoneNumber(13987654321)).toBe('139****4321');
    });

    it('应支持自定义加密字符和长度', () => {
      expect(maskPhoneNumber('13812345678', { maskChar: '#', maskLength: 6 })).toBe('138######78');
      expect(maskPhoneNumber('15812345678', { maskLength: 2 })).toBe('158**345678');
    });

    it('应拒绝非法格式手机号并返回原值', () => {
      // 非1开头
      expect(maskPhoneNumber('23812345678')).toBe('23812345678');
      // 长度不足
      expect(maskPhoneNumber('138123456')).toBe('138123456');
      // 非数字
      expect(maskPhoneNumber('abc')).toBe('abc');
    });

    it('应处理边界值', () => {
      // 最小加密长度
      expect(maskPhoneNumber('13812345678', { maskLength: 0 })).toBe('13812345678');
      // 超长加密（超过手机号剩余位数）
      expect(maskPhoneNumber('13812345678', { maskLength: 10 })).toBe('138********');
    });
  });

  // ==================== truncateText 测试 ====================
  describe('truncateText() - 智能截断字符串', () => {
    it('应截断超长文本并添加省略号', () => {
      expect(truncateText('Hello world', 5)).toBe('Hello...');
      expect(truncateText('Hello world', 8)).toBe('Hello...');
    });

    it('应支持关闭单词保持功能', () => {
      expect(truncateText('Hello world', 6, { keepWords: false })).toBe('Hello ...');
      expect(truncateText('Hello world', 3, { keepWords: false })).toBe('Hel...');
    });

    it('应处理空字符串或短文本', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText('Hi', 10)).toBe('Hi');
    });

    it('应支持自定义省略符号', () => {
      expect(truncateText('Hello world', 5, { ellipsis: '###' })).toBe('Hello###');
    });

    it('应正确处理无空格文本', () => {
      expect(truncateText('abcdefghijk', 5)).toBe('abcde...');
    });

    it('应处理Unicode字符', () => {
      expect(truncateText('你好世界', 2)).toBe('你好...');
    });
  });
});
