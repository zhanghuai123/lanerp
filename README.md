# lanerp

[![npm version](https://badge.fury.io/js/lanerp.svg)](https://www.npmjs.com/package/lanerp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个实用的 JavaScript 工具库，提供日期处理、数字格式化、环境检测等常用功能。

## 特性

✨ 简单易用的 API  
🚀 轻量级，无依赖  
📦 支持 CommonJS 模块  
🔧 专注于实际业务场景  
📝 详细的文档说明

## 安装

```bash
npm install lanerp
```

## 快速开始

```javascript
const lanerp = require('lanerp');

// 检测移动端设备
console.log(lanerp.isMobile());
// 输出: ['iPhone', index: 0, input: '...'] 或 null

// 格式化数字为千分位
console.log(lanerp.formatThousands(1234567.89));
// 输出: "1,234,567.89"

// 格式化价格（带千分位）
console.log(lanerp.formatThousandsPrice(1234567.89, '¥'));
// 输出: "¥1,234,567.89"

// 格式化日期
console.log(lanerp.formatDate('2026-01-15', 'date'));
// 输出: "2026-01-15"

// 获取当前日期
console.log(lanerp.getNowDate());
// 输出: "2026-01-15"
```

## API 文档

### 环境检测模块 (src/environment.js)

#### isMobile()

判断当前是否为移动端设备。

- **返回**: Array | null - 匹配结果数组或 null
- **示例**:
  ```javascript
  const { isMobile } = require('lanerp');
  
  if (isMobile()) {
    console.log('当前是移动端设备');
  } else {
    console.log('当前是桌面端设备');
  }
  ```
- **支持检测**: iPhone, iPad, Android, Mobile, BlackBerry, IEMobile, MQQBrowser 等

### 数字格式化模块 (src/money.js)

#### formatThousands(num)

将数字格式化为千分位表示。

- **参数**:
  - `num` (number|string): 需要格式化的数字
- **返回**: (string) 千分位格式的字符串
- **示例**:
  ```javascript
  const { formatThousands } = require('lanerp');
  
  formatThousands(1234567);        // "1,234,567"
  formatThousands(1234567.89);     // "1,234,567.89"
  formatThousands(-1234567.89);    // "-1,234,567.89"
  formatThousands('1234567');      // "1,234,567"
  formatThousands('');             // ""
  formatThousands(null);           // ""
  ```

#### formatThousandsPrice(num, unit)

格式化价格，带单位和千分位，数字类型自动保留两位小数。

- **参数**:
  - `num` (number|string): 需要格式化的数字
  - `unit` (string): 货币单位，默认为空字符串
- **返回**: (string) 格式化后的价格字符串，无效值返回 '--'
- **示例**:
  ```javascript
  const { formatThousandsPrice } = require('lanerp');
  
  formatThousandsPrice(1234567.89, '¥');    // "¥1,234,567.89"
  formatThousandsPrice(1234567.8, '$');     // "$1,234,567.80"
  formatThousandsPrice('1234567.89', '€');  // "€1,234,567.89"
  formatThousandsPrice(0, '¥');             // "¥0"
  formatThousandsPrice(null);               // "--"
  formatThousandsPrice(undefined);          // "--"
  ```

### 日期处理模块 (src/date.js)

#### formatDate(dateString, date_type)

格式化日期为指定格式。兼容 iOS 系统（自动处理日期分隔符）。

- **参数**:
  - `dateString` (string|Date): 日期字符串或日期对象
  - `date_type` (string): 日期格式类型
    - `'date'`: 年-月-日 (默认)
    - `'year-month'`: 年-月
    - `'month'`: 月-日
    - `'datetime'`: 年-月-日 时:分
    - `'date-second-time'`: 年-月-日 时:分:秒
    - `'hour'`: 时:分
    - `'hourtime'`: 时:分:秒
- **返回**: (string) 格式化后的日期字符串
- **示例**:
  ```javascript
  const { formatDate } = require('lanerp');
  
  formatDate('2026-01-15', 'date');               // "2026-01-15"
  formatDate('2026-01-15', 'year-month');         // "2026-01"
  formatDate('2026-01-15', 'month');              // "01-15"
  formatDate('2026-01-15 14:30:00', 'datetime');  // "2026-01-15 14:30"
  formatDate('2026-01-15 14:30:45', 'date-second-time'); // "2026-01-15 14:30:45"
  formatDate('2026-01-15 14:30:00', 'hour');      // "14:30"
  formatDate('2026-01-15 14:30:45', 'hourtime');  // "14:30:45"
  ```

#### getNowDate(date_type)

获取当前日期时间。

- **参数**:
  - `date_type` (string): 日期格式类型
    - 默认: 年-月-日
    - `'year-month'`: 年-月
    - `'datetime'`: 年-月-日 时:分
    - `'time'`: 时:分
- **返回**: (string) 当前日期时间字符串
- **示例**:
  ```javascript
  const { getNowDate } = require('lanerp');
  
  getNowDate();                  // "2026-01-15"
  getNowDate('year-month');      // "2026-01"
  getNowDate('datetime');        // "2026-01-15 14:30"
  getNowDate('time');            // "14:30"
  ```

#### getDaysBetween(start, end)

计算两个日期之间的所有日期列表。

- **参数**:
  - `start` (string): 开始日期 (格式: YYYY-MM-DD)
  - `end` (string): 结束日期 (格式: YYYY-MM-DD)
- **返回**: (Array) 日期字符串数组
- **示例**:
  ```javascript
  const { getDaysBetween } = require('lanerp');
  
  getDaysBetween('2026-01-15', '2026-01-18');
  // 返回: ['2026-01-15', '2026-01-16', '2026-01-17', '2026-01-18']
  
  getDaysBetween('2026-01-01', '2026-01-03');
  // 返回: ['2026-01-01', '2026-01-02', '2026-01-03']
  ```

## 主入口模块

从 `index.js` 可以直接导入所有功能：

```javascript
const {
  // 环境检测
  isMobile,
  
  // 数字格式化
  formatThousands,
  formatThousandsPrice,
  
  // 日期处理
  formatDate,
  getNowDate,
  getDaysBetween
} = require('lanerp');
```

或者按需导入子模块：

```javascript
const { isMobile } = require('lanerp/src/environment');
const { formatThousands, formatThousandsPrice } = require('lanerp/src/money');
const { formatDate, getNowDate, getDaysBetween } = require('lanerp/src/date');
```

## 项目结构

```
lanerp/
├── src/                    # 源代码目录
│   ├── date.js            # 日期处理模块
│   ├── environment.js     # 环境检测模块
│   └── money.js           # 数字格式化模块
├── test/                   # 测试文件
│   └── index.test.js      # 单元测试
├── lib/                    # 编译后的代码（预留）
├── index.js               # 主入口文件
├── package.json           # 项目配置
├── README.md              # 项目文档
└── .gitignore             # Git忽略配置
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

### 本地开发调试

在本地项目中测试此包：

```bash
# 在 lanerp 目录下创建软链接
npm link

# 在你的测试项目中使用软链接
npm link lanerp
```

## 更新日志

### 1.0.3 (2026-01-15)

- 🎉 最新版本
- ✨ 完善日期、数字、环境检测功能
- 📝 更新文档

### 1.0.2 (2026-01-15)

- 🔧 功能优化

### 1.0.1 (2026-01-14)

- 🎉 首次发布

## 许可证

[MIT](LICENSE)

## 作者

zhanghuai

## 链接

- [npm 包地址](https://www.npmjs.com/package/lanerp)
- [GitHub 仓库](https://github.com/zhanghuai123/lanerp)

---

如有问题或建议，欢迎提 Issue！
