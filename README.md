# lanjing-npm

[![npm version](https://badge.fury.io/js/lanjing-npm.svg)](https://www.npmjs.com/package/lanjing-npm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个简单实用的JavaScript工具库，提供常用的工具函数。

## 特性

✨ 简单易用的API  
🚀 轻量级，无依赖  
📦 支持CommonJS模块  
✅ 完整的单元测试  
📝 详细的文档说明

## 安装

```bash
npm install lanjing-npm
```

## 快速开始

```javascript
const lanjing = require('lanjing-npm');

// 使用问候函数
console.log(lanjing.greet('蓝鲸'));
// 输出: 你好, 蓝鲸！欢迎使用lanjing-npm

// 使用加法函数
console.log(lanjing.add(10, 20));
// 输出: 30

// 格式化日期
console.log(lanjing.formatDate());
// 输出: 2026-01-14

console.log(lanjing.formatDate(new Date('2024-12-25')));
// 输出: 2024-12-25
```

## 工具函数

如果需要使用额外的工具函数：

```javascript
const utils = require('lanjing-npm/src/utils');

// 格式化货币
console.log(utils.formatCurrency(12345.67));
// 输出: ¥12345.67

console.log(utils.formatCurrency(99.99, '$'));
// 输出: $99.99

// 异步延迟
async function example() {
  console.log('开始');
  await utils.sleep(1000); // 延迟1秒
  console.log('1秒后');
}

// 生成随机字符串
console.log(utils.randomString(16));
// 输出: 类似 "aB3dE9fG1hI2jK3L"
```

## API 文档

### 主模块 (index.js)

#### greet(name)

问候函数，返回个性化的问候语。

- **参数**:
  - `name` (string): 要问候的名字
- **返回**: (string) 问候语
- **示例**:
  ```javascript
  lanjing.greet('张三');
  // 返回: "你好, 张三！欢迎使用lanjing-npm"
  ```

#### add(a, b)

加法函数，返回两数之和。

- **参数**:
  - `a` (number): 第一个数字
  - `b` (number): 第二个数字
- **返回**: (number) 两数之和
- **示例**:
  ```javascript
  lanjing.add(10, 20);  // 返回: 30
  lanjing.add(-5, 10);  // 返回: 5
  ```

#### formatDate(date)

格式化日期为 YYYY-MM-DD 格式。

- **参数**:
  - `date` (Date): 日期对象，默认为当前日期
- **返回**: (string) 格式化后的日期字符串
- **示例**:
  ```javascript
  lanjing.formatDate();
  // 返回: "2026-01-14" (当前日期)
  
  lanjing.formatDate(new Date('2024-12-25'));
  // 返回: "2024-12-25"
  ```

### 工具模块 (src/utils.js)

#### formatCurrency(amount, currency)

格式化货币金额。

- **参数**:
  - `amount` (number): 金额数字
  - `currency` (string): 货币符号，默认为 '¥'
- **返回**: (string) 格式化后的货币字符串
- **示例**:
  ```javascript
  utils.formatCurrency(12345.67);      // 返回: "¥12345.67"
  utils.formatCurrency(99.99, '$');    // 返回: "$99.99"
  utils.formatCurrency(100, '€');      // 返回: "€100.00"
  ```

#### sleep(ms)

异步延迟函数，返回一个Promise。

- **参数**:
  - `ms` (number): 延迟的毫秒数
- **返回**: (Promise) Promise对象
- **示例**:
  ```javascript
  async function delayedLog() {
    console.log('开始');
    await utils.sleep(2000);  // 延迟2秒
    console.log('2秒后执行');
  }
  ```

#### randomString(length)

生成指定长度的随机字符串。

- **参数**:
  - `length` (number): 字符串长度，默认为 8
- **返回**: (string) 随机字符串
- **示例**:
  ```javascript
  utils.randomString();      // 返回: "aB3dE9fG" (8位)
  utils.randomString(16);    // 返回: "aB3dE9fG1hI2jK3L" (16位)
  utils.randomString(4);     // 返回: "aB3d" (4位)
  ```

## 开发指南

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
npm test
```

测试将验证所有API函数是否正常工作。

### 项目结构

```
lanjing-npm/
├── src/              # 源代码目录
│   └── utils.js      # 工具函数模块
├── lib/              # 编译后的代码（预留）
├── test/             # 测试文件
│   └── index.test.js # 单元测试
├── index.js          # 主入口文件
├── package.json      # 项目配置
├── README.md         # 项目文档
└── LICENSE           # MIT许可证
```

### 本地开发

如果你想在本地项目中测试这个包：

```bash
# 在 lanjing-npm 目录下
npm link

# 在你的测试项目中
npm link lanjing-npm
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### 1.0.0 (2026-01-14)

- 🎉 首次发布
- ✨ 添加基础工具函数
- 📝 完善文档和测试

## 许可证

[MIT](LICENSE)

## 作者

zhanghuai

## 链接

- [npm包地址](https://www.npmjs.com/package/lanjing-npm)
- [GitHub仓库](https://github.com/yourusername/lanjing-npm)

---

如有问题或建议，欢迎提Issue！
