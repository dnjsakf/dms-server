// jest.config.js
module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  watchPathIgnorePatterns: ['.*'], // 모든 파일 변경 무시
  moduleDirectories: ['node_modules', '../node_modules'],
  transformIgnorePatterns: ['/node_modules/'],
};
