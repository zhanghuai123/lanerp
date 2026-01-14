/**
 * lanjing-npm - 示例npm包
 */

/**
 * 问候函数
 * @param {string} name - 要问候的名字
 * @returns {string} 问候语
 */
function greet(name) {
  return `你好, ${name}！欢迎使用lanerp`;
}

/**
 * 加法函数
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b;
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

module.exports = {
  greet,
  add,
  formatDate
};
