// 数组相关
const array = require('./src/array');
// 计算相关
const calculate = require('./src/calculate');
// 时间相关
const date = require('./src/date');
// 环境相关
const environment = require('./src/environment');
// 格式化相关
const format = require('./src/format');
// 辅助函数
const helper = require('./src/helper');
// 金钱相关
const money = require('./src/money');
// 加密安全
const security = require('./src/security');
// 字符串相关
const string = require('./src/string');
// UI相关
const ui = require('./src/ui');
// 验证相关
const validation = require('./src/validation');

module.exports = {
  ...array,
  ...calculate,
  ...date,
  ...environment,
  ...format,
  ...helper,
  ...money,
  ...security,
  ...string,
  ...ui,
  ...validation
};
