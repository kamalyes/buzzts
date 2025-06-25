module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    roots: ['src'],  // 只扫描 src 目录里的测试文件
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: ['**/*.test.ts', '**/*.spec.ts'], // 测试文件匹配规则
  };
  