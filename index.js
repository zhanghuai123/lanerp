// 时间相关
const date = require('./src/date');
// 金钱相关
const money = require('./src/money');
// 环境相关
const environment = require('./src/environment');
module.exports = {
  ...date,
  ...money,
  ...environment
};
