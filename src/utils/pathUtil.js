import path from 'path';

const rootPath = path.resolve(__dirname, '../..');

const getPath = (...args) => path.join(rootPath, ...args);

export {
  rootPath,
  getPath,
}
