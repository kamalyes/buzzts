module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  roots: ['src'],  // 只扫描 src 目录里的测试文件
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'], // 测试文件匹配规则
  collectCoverage: true,  // 启用覆盖率收集
  coverageDirectory: 'coverage',  // 指定覆盖率报告输出目录
  coverageReporters: [
      'text',  // 在控制台输出覆盖率
      'lcov',  // 生成 lcov 格式的覆盖率报告
      'json'    // 生成 JSON 格式的覆盖率报告
  ]
};
