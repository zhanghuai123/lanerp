/**
 * 测试文件示例
 */

const lanjing = require('../index');

// 简单的测试函数
function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(error.message);
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, but got ${actual}`);
  }
}

// 测试 greet 函数
test('greet() 应该返回正确的问候语', () => {
  const result = lanjing.greet('蓝鲸');
  assertEquals(result, '你好, 蓝鲸！欢迎使用lanjing-npm');
});

// 测试 add 函数
test('add() 应该正确计算两数之和', () => {
  const result = lanjing.add(10, 20);
  assertEquals(result, 30);
});

test('add() 应该正确处理负数', () => {
  const result = lanjing.add(-5, 10);
  assertEquals(result, 5);
});

// 测试 formatDate 函数
test('formatDate() 应该返回正确格式的日期', () => {
  const date = new Date('2024-12-25');
  const result = lanjing.formatDate(date);
  assertEquals(result, '2024-12-25');
});

console.log('\n所有测试完成！');
