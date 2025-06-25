'use strict';
module.exports = {
  // 对象字面量的大括号内加空格
  bracketSpacing: true,

  // 使用单引号代替双引号
  singleQuote: true,

  // JSX 标签的 > 符号不换行，保持在同一行
  bracketSameLine: true,

  // 末尾逗号风格，'es5' 表示在 ES5 允许的地方加逗号（对象、数组、函数参数）
  trailingComma: 'es5',

  // 每行最大长度为 120 字符
  printWidth: 120,

  // 缩进宽度为2空格
  tabWidth: 2,

  // 句尾加分号          
  semi: true,

  // 使用单引号
  singleQuote: true,

  // 默认解析器为 flow（Facebook 的静态类型检查工具），适用于 Flow 代码
  parser: 'flow',

  // 箭头函数参数只有一个时省略括号
  arrowParens: 'avoid',

  // 针对特定文件或路径的覆盖配置
  overrides: [
    {
      // 针对所有 .code-workspace 文件（VSCode 工作区配置文件）
      files: ['*.code-workspace'],
      options: {
        // 使用 JSON 字符串化解析器，保证格式正确
        parser: 'json-stringify',
      },
    },
    {
      // 针对所有 TypeScript 文件（.ts 和 .tsx）
      files: ['*.ts', '*.tsx'],
      options: {
        // 末尾逗号改为 'all'，增强代码一致性和 git diff 友好性
        trailingComma: 'all',

        // 解析器改为 typescript，支持 TS 语法和特性
        parser: 'typescript',
      },
    },
  ],
};
