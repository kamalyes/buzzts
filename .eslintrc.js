module.exports = {
    // 标记为根配置，防止 ESLint 向上查找配置文件
    root: true,

    // 使用 TypeScript 官方解析器，支持最新语法和类型信息
    parser: '@typescript-eslint/parser',

    parserOptions: {
        ecmaVersion: 2020, // 支持 ES2020 语法特性
        sourceType: 'module', // 支持 ES 模块语法
        ecmaFeatures: {
        jsx: true, // 如果项目用 React，可以开启 JSX 支持
        },
    },

    env: {
        browser: true,  // 浏览器全局变量，如 window
        node: true,     // Node.js 全局变量和作用域
        es6: true,      // ES6 全局变量
        jest: true,     // Jest 测试环境全局变量
    },

    // 启用的插件
    plugins: [
        '@typescript-eslint', // TypeScript 规则
        'jest',               // Jest 相关规则
        'prettier',           // Prettier 代码格式检查
    ],

    // 继承的基础规则集
    extends: [
        'eslint:recommended',               // ESLint 推荐规则
        'plugin:@typescript-eslint/recommended', // TypeScript 推荐规则
        'plugin:jest/recommended',          // Jest 推荐规则
        'plugin:prettier/recommended',      // 使 ESLint 支持 Prettier，关闭冲突规则
    ],

    rules: {
        // Prettier 规则作为错误提示，保证格式统一
        'prettier/prettier': 'error',

        // 关闭 ESLint 自带的 no-unused-vars，使用 TypeScript 版本
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
        'warn',
        {
            argsIgnorePattern: '^_', // 忽略以下划线开头的参数未使用警告
            varsIgnorePattern: '^_', // 忽略以下划线开头的变量未使用警告
            ignoreRestSiblings: true, // 忽略剩余参数解构警告
        },
        ],

        // 代码风格相关
        semi: ['error', 'always'], // 必须使用分号
        quotes: ['error', 'single', { avoidEscape: true }], // 单引号，允许转义使用双引号
        'comma-dangle': ['error', 'always-multiline'], // 多行时末尾必须有逗号
        'no-trailing-spaces': 'error', // 禁止行尾空格
        'eol-last': ['error', 'always'], // 文件末尾必须有换行符
        indent: ['error', 2], // 缩进2个空格

        // 代码质量相关
        eqeqeq: ['error', 'always'], // 必须使用 === 和 !==
        curly: ['error', 'all'], // 必须使用大括号包裹所有控制语句
        'no-console': 'warn', // 警告使用 console
        'no-debugger': 'error', // 禁止 debugger

        // Jest 相关规则
        'jest/no-disabled-tests': 'warn', // 警告禁用的测试
        'jest/no-focused-tests': 'error', // 禁止 focused 测试（it.only）
        'jest/no-identical-title': 'error', // 禁止相同测试名
        'jest/prefer-to-have-length': 'warn', // 建议使用 toHaveLength()
        'jest/valid-expect': 'error', // 确保 expect 使用正确
    },

    // 针对测试文件的覆盖配置
    overrides: [
        {
        files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
        rules: {
            // 测试文件中可以适当放松规则，比如允许 dev-only 代码等
            '@typescript-eslint/no-explicit-any': 'off',
        },
        },
    ],
};
  