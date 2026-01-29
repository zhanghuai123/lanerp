# lanerp

[![npm version](https://badge.fury.io/js/lanerp.svg)](https://www.npmjs.com/package/lanerp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个全面的 JavaScript 工具库，提供 50+ 实用函数，涵盖日期处理、数字格式化、字符串处理、数组操作、数据验证、UI 辅助等多个领域。

## ✨ 特性

- 🎯 **模块化设计** - 12个独立模块，按需导入
- 🚀 **轻量高效** - 核心模块零依赖
- 📦 **开箱即用** - 支持 CommonJS 和 ES Module
- 🔧 **生产验证** - 来自真实业务场景的最佳实践
- 📝 **完整文档** - 每个函数都有详细说明和示例
- ✅ **全面测试** - 52个工具函数全部测试通过

## 📦 安装

```bash
npm install lanerp
```

## 🚀 快速开始

```javascript
// 统一导入（推荐）
const {
  formatDate,           // 日期格式化
  formatThousands,      // 千分位格式化
  isMobile,             // 移动端检测
  phoneEncryption,      // 手机号加密
  isValid,              // 数据验证
  debounce              // 防抖函数
} = require('lanerp');

// 或按模块导入
const { formatDate } = require('lanerp/src/date');
const { formatThousands } = require('lanerp/src/money');
```

### 常用示例

```javascript
const lanerp = require('lanerp');

// 日期格式化
lanerp.formatDate(new Date(), 'datetime');
// => "2026-01-29 16:30"

// 金额千分位
lanerp.formatThousands(1234567.89);
// => "1,234,567.89"

// 金额转中文大写
lanerp.numberPriceToChinese(12345.67, true);
// => "壹万贰仟叁佰肆拾伍元陆角柒分"

// 手机号加密
lanerp.phoneEncryption('13812345678');
// => "138****5678"

// 数据验证
lanerp.isNumber(123);        // => true
lanerp.isObject({});         // => true
lanerp.isValid('hello');     // => true

// 防抖函数
const handleSearch = lanerp.debounce((keyword) => {
  console.log('搜索:', keyword);
}, 500);
```

## 📚 完整 API 文档

### 📅 日期时间模块 (src/date.js)

提供日期格式化、日期范围计算等功能，兼容 iOS 系统。

#### `formatDate(dateString, date_type)`

格式化日期为指定格式。

**参数**:
- `dateString` (string|Date): 日期字符串或日期对象
- `date_type` (string): 格式类型
  - `'date'`: 年-月-日 (默认)
  - `'datetime'`: 年-月-日 时:分
  - `'date-second-time'`: 年-月-日 时:分:秒
  - `'year-month'`: 年-月
  - `'month'`: 月-日
  - `'hour'`: 时:分
  - `'hourtime'`: 时:分:秒

**示例**:
```javascript
formatDate('2026-01-29', 'date');              // "2026-01-29"
formatDate(new Date(), 'datetime');            // "2026-01-29 16:30"
formatDate('2026-01-29 16:30:45', 'date-second-time'); // "2026-01-29 16:30:45"
```

#### `getNowDate(date_type)`

获取当前日期时间。

**示例**:
```javascript
getNowDate();                  // "2026-01-29"
getNowDate('datetime');        // "2026-01-29 16:30"
getNowDate('year-month');      // "2026-01"
```

#### `getDaysBetween(start, end)`

计算两个日期之间的所有日期（旧版）。

**示例**:
```javascript
getDaysBetween('2026-01-01', '2026-01-03');
// => ['2026-01-01', '2026-01-02', '2026-01-03']
```

#### `getDatesBetween(startDate, endDate)`

获取日期范围内的所有日期（新版，支持 Date 对象）。

**示例**:
```javascript
getDatesBetween('2026-01-01', '2026-01-03');
// => [Date, Date, Date] // 3个Date对象
```

#### `getDateRange(value)`

根据预设类型获取日期范围。

**参数**: `'today'` | `'yesterday'` | `'week'` | `'last_week'` | `'month'` | `'last_month'` | `'year'` | `'quarter'`

**示例**:
```javascript
getDateRange('today');      // "2026-01-29 - 2026-01-29"
getDateRange('week');       // "2026-01-27 - 2026-02-02"
getDateRange('month');      // "2026-01-01 - 2026-01-29"
```

#### `getMonthRange(date)`

获取指定月份的开始和结束日期（兼容iOS）。

**示例**:
```javascript
getMonthRange(new Date()); // ["2026-01-01", "2026-01-31"]
```

---

### 💰 金额处理模块 (src/money.js)

提供金额格式化、千分位、中文大写等功能。

#### `formatThousands(num)`

数值转千分位。

**示例**:
```javascript
formatThousands(1234567.89);     // "1,234,567.89"
formatThousands(-1234567.89);    // "-1,234,567.89"
```

#### `formatThousandsPrice(num, unit)`

格式化价格（带单位，数字类型保留2位小数）。

**示例**:
```javascript
formatThousandsPrice(1234.56, '¥');  // "¥1,234.56"
formatThousandsPrice(1234.5, '$');   // "$1,234.50"
formatThousandsPrice(null);          // "--"
```

#### `numberPriceToChinese(money, has_unit)`

数字金额转中文大写。

**参数**:
- `money` (number): 金额
- `has_unit` (boolean): 是否包含"元"单位

**示例**:
```javascript
numberPriceToChinese(12345.67, true);  
// => "壹万贰仟叁佰肆拾伍元陆角柒分"

numberPriceToChinese(100, false);      
// => "壹佰整"
```

#### `goodsPriceDiscountsText(goods)`

计算商品优惠情况。

**示例**:
```javascript
goodsPriceDiscountsText({
  guide_price: 100,
  price: { value: 80 },
  num: 2
});
// => { class: 'discount', text: '优惠40.00' }
```

---

### 🔤 字符串处理模块 (src/string.js)

提供字符串处理、加密、HTML处理等功能。

#### `htmlDecode(html)`

HTML 解码（需浏览器环境）。

**示例**:
```javascript
htmlDecode('&lt;div&gt;');  // "<div>"
```

#### `phoneEncryption(phone)`

手机号中间4位加密。

**示例**:
```javascript
phoneEncryption('13812345678');  // "138****5678"
```

#### `calculateLength(value)`

计算字符长度（汉字1个，英文0.5个）。

**示例**:
```javascript
calculateLength('Hello世界');  // 4.5
calculateLength('你好');        // 2
```

#### `sliceFromMatch(sourceStr, targetStrs, includeTarget)`

从匹配的子字符串开始截取。

**示例**:
```javascript
sliceFromMatch('hello-world', '-');           // "world"
sliceFromMatch('hello-world', '-', true);     // "-world"
sliceFromMatch('path/to/file.js', ['/', '.']); // "to/file.js"
```

#### `numberToChinese(num)`

数字转中文（0-99）。

**示例**:
```javascript
numberToChinese(15);   // "十五"
numberToChinese(8);    // "八"
numberToChinese(25);   // "二十五"
```

#### 其他方法

- `getPlainTextLength(html)` - 获取HTML纯文本长度
- `limitLineBreaksWithHtml(html)` - 压缩HTML换行
- `containsMediaTags(html)` - 检测img/video标签
- `buildRedirectUrl(params)` - 构建重定向URL

---

### ✅ 数据验证模块 (src/validation.js)

提供数据类型判断和表单验证功能。

#### `isObject(value)`

判断是否为纯对象。

**示例**:
```javascript
isObject({});           // true
isObject([]);           // false
isObject(null);         // false
```

#### `isValid(value)`

判断数据是否有效。

**示例**:
```javascript
isValid('hello');       // true
isValid('');            // false
isValid([1, 2]);        // true
isValid([]);            // false
```

#### `isNumber(value)`

判断是否为数字。

**示例**:
```javascript
isNumber(123);          // true
isNumber('123');        // true
isNumber('abc');        // false
isNumber(null);         // false
```

#### `validateRequired(data, fields)`

校验表单必填字段（支持多种字段类型）。

#### `deepFormValidate(name, that)`

深度表单校验（Vue 2 专用）。

---

### 🔢 数组处理模块 (src/array.js)

提供数组合并、去重、查找等功能。

#### `mergeArrays(a, b)`

合并数组并去重（基于 id 字段）。

**示例**:
```javascript
const a = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
const b = [{ id: 2, name: 'b2' }, { id: 3, name: 'c' }];
mergeArrays(a, b);
// => [{ id: 2, name: 'b2' }, { id: 3, name: 'c' }, { id: 1, name: 'a' }]
```

#### `arrayDuplicate(array, field)`

根据指定字段去重。

**示例**:
```javascript
const arr = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 1, name: 'a2' }
];
arrayDuplicate(arr, 'id');
// => [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
```

#### `findObjectById(data, id)`

在数组中根据ID查找对象（支持嵌套children）。

#### `getItemByIdInTree(tree, value, path)`

获取树形结构中指定ID的路径。

---

### 🎨 格式化模块 (src/format.js)

提供文件大小、数字、类型等格式化功能。

#### `formatFileSize(size)`

格式化文件大小。

**示例**:
```javascript
formatFileSize(1024);       // "1KB"
formatFileSize(1048576);    // "1MB"
formatFileSize(1073741824); // "1GB"
```

#### `formatToNumber(value, decimalPlaces)`

数字保留小数（返回数字类型）。

**示例**:
```javascript
formatToNumber(3.1415926, 2);  // 3.14
```

#### `formatToFixed(value, decimalPlaces)`

数字保留小数（返回字符串类型）。

**示例**:
```javascript
formatToFixed(3.1415926, 2);  // "3.14"
formatToFixed(3.1, 2);        // "3.10"
```

#### `formatNumberWithPrecision(value, precision)`

保持指定精度格式化。

#### `getFileType(filename)`

获取文件类型。

**示例**:
```javascript
getFileType('photo.jpg');   // "image"
getFileType('doc.pdf');     // "pdf"
getFileType('data.xlsx');   // "excel"
```

#### 其他方法

- `init_thousand_separator(numberValue)` - 初始化千分符
- `num_is_it_less_than_0(num)` - 判断是否小于0
- `fieldOperatorText(type)` - 字段操作符文本
- `reimbursement_status_text(status)` - 报销状态文本

---

### 🛠️ 辅助函数模块 (src/helper.js)

#### `debounce(fn, delay, immediate)`

防抖函数。

**参数**:
- `fn` (Function): 要防抖的函数
- `delay` (number): 延迟时间（毫秒），默认 500
- `immediate` (boolean): 是否立即执行，默认 false

**示例**:
```javascript
const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword);
}, 500);

handleSearch('a');
handleSearch('ab');
handleSearch('abc'); // 只会执行最后一次
```

#### `thousands`

千分符指令（Vue 2 指令）。

**用法**:
```javascript
// 在 Vue 组件中注册
directives: {
  thousands
}

// 模板中使用
<input v-thousands />
```

---

### 🖥️ UI工具模块 (src/ui.js)

提供表格高度计算、VxeTable 辅助等功能。

#### `getTableHeight(height)`

计算表格高度（基于窗口高度）。

**示例**:
```javascript
getTableHeight(200);  // window.innerHeight - 200
```

#### `getTableStateHeight(outerDom, topDom, otherHeight)`

计算列表动态高度。

#### `calculateTableHeight(containerEl, vhRatio, minHeight, extraPadding)`

计算 el-dialog 中的表格高度。

**示例**:
```javascript
// 在 Vue 组件中
mounted() {
  this.$nextTick(() => {
    this.tableHeight = calculateTableHeight(this.$el, 0.8, 100, 98);
  });
}
```

#### `vxeTableHeightSync(options)`

VxeTable 固定列高度同步工具。

**示例**:
```javascript
const sync = vxeTableHeightSync({
  tableRef: this.$refs.table,
  debounceTime: 30
});

sync.init();  // 初始化
// sync.destroy();  // 销毁监听
```

---

### 🧮 计算工具模块 (src/calculate.js)

提供表达式解析和计算功能。

#### `calculate(exp, exp_values)`

计算表达式。

**示例**:
```javascript
calculate('a + b', { a: 10, b: 20 });
// => 30

calculate('a + b * (c + d)', { a: 1, b: 2, c: 3, d: 4 });
// => 15 (1 + 2 * 7)

calculate('total / count', { total: 100, count: 4 });
// => 25
```

**支持运算符**: `+`, `-`, `*`, `/`, `(`, `)`

---

### 🔐 加密安全模块 (src/security.js)

提供 AES 加密解密功能（需 CryptoJS 库）。

#### `encryptAES(data)`

AES 加密。

**示例**:
```javascript
const encrypted = encryptAES('Hello World');
// => "encoded-string"
```

#### `decryptAES(data)`

AES 解密。

**示例**:
```javascript
const decrypted = decryptAES(encrypted);
// => "Hello World"
```

**注意**: 需要在浏览器环境中引入 CryptoJS 库。

---

### 📱 环境检测模块 (src/environment.js)

#### `isMobile()`

判断是否为移动端设备。

**示例**:
```javascript
if (isMobile()) {
  console.log('移动端');
} else {
  console.log('PC端');
}
```

**支持检测**: iPhone, iPad, Android, Mobile, BlackBerry, IEMobile 等

#### `isWeixin()`

判断是否为微信浏览器。

**示例**:
```javascript
if (isWeixin()) {
  console.log('在微信中打开');
}
```

---

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

---

## 🔧 使用场景

### 日期处理
```javascript
const { formatDate, getDateRange, getDaysBetween } = require('lanerp');

// 格式化订单时间
const orderTime = formatDate(order.created_at, 'datetime');

// 获取本周范围用于报表查询
const weekRange = getDateRange('week');

// 计算请假天数
const leaveDays = getDaysBetween('2026-01-01', '2026-01-05');
```

### 金额计算
```javascript
const { formatThousands, numberPriceToChinese, goodsPriceDiscountsText } = require('lanerp');

// 商品价格显示
const price = formatThousands(goods.price); // "1,234.56"

// 发票金额大写
const invoiceAmount = numberPriceToChinese(12345.67, true); // "壹万贰仟叁佰肆拾伍元陆角柒分"

// 优惠信息
const discount = goodsPriceDiscountsText({ guide_price: 100, price: { value: 80 }, num: 2 });
```

### 表单验证
```javascript
const { validateRequired, isValid, isNumber } = require('lanerp');

// 必填字段验证
const validation = validateRequired(formData, [
  { key: 'name', name: '姓名' },
  { key: 'phone', name: '手机号' },
  { key: 'items', name: '明细', type: 'array' }
]);

if (!validation.pass) {
  alert(validation.msg);
}
```

### 数组操作
```javascript
const { mergeArrays, findObjectById, getItemByIdInTree } = require('lanerp');

// 合并并去重
const merged = mergeArrays(localData, serverData);

// 树形结构查找
const path = getItemByIdInTree(deptTree, '001');
// => [{ id: '001', name: '总部', children: [...] }]
```

### UI 辅助
```javascript
const { calculateTableHeight, vxeTableHeightSync, debounce } = require('lanerp');

// 计算弹窗中的表格高度
mounted() {
  this.$nextTick(() => {
    this.tableHeight = calculateTableHeight(this.$el, 0.8, 100, 98);
  });
}

// VxeTable 固定列同步
const sync = vxeTableHeightSync({ tableRef: this.$refs.table });
sync.init();

// 搜索防抖
const handleSearch = debounce((keyword) => {
  this.fetchData(keyword);
}, 500);
```

---

## 📦 模块导出清单

| 模块 | 方法数 | 核心功能 |
|-----|-------|---------|
| **date.js** | 7 | 日期格式化、范围计算、iOS兼容 |
| **money.js** | 4 | 千分位、中文大写、价格比较 |
| **string.js** | 9 | HTML处理、手机号加密、中文转换 |
| **validation.js** | 5 | 类型判断、表单校验 |
| **array.js** | 4 | 数组合并、去重、树形查找 |
| **format.js** | 9 | 文件大小、数字格式、类型判断 |
| **helper.js** | 2 | 防抖、Vue指令 |
| **ui.js** | 4 | 表格高度、VxeTable辅助 |
| **calculate.js** | 4 | 表达式计算、RPN解析 |
| **security.js** | 2 | AES加密/解密 |
| **environment.js** | 2 | 移动端/微信检测 |

**总计**: 52 个精选实用方法

---

## 🎯 迁移指南

如果你的项目使用旧版 `old-utils/index.js`，可以逐步迁移到新的模块化结构:

### 方式一: 完全迁移
```javascript
// 旧代码
const utils = require('lanerp/old-utils');
utils.formatDate('2026-01-29');

// 新代码
const { formatDate } = require('lanerp');
formatDate('2026-01-29');
```

### 方式二: 按需迁移
```javascript
// 保留旧版兼容
const oldUtils = require('lanerp/old-utils');

// 引入新模块
const { formatThousands, phoneEncryption } = require('lanerp');

// 混合使用
const date = oldUtils.formatDate('2026-01-29');  // 旧版
const price = formatThousands(1234.56);          // 新版
```

### 方式三: 子模块导入
```javascript
// 只导入需要的模块
const dateUtils = require('lanerp/src/date');
const moneyUtils = require('lanerp/src/money');

dateUtils.formatDate('2026-01-29');
moneyUtils.formatThousands(1234.56);
```

---

## 📂 项目结构

```
lanerp/
├── src/                    # 新模块化代码
│   ├── index.js           # 统一导出入口
│   ├── date.js            # 日期处理 (7方法)
│   ├── money.js           # 金额处理 (4方法)
│   ├── string.js          # 字符串处理 (9方法)
│   ├── validation.js      # 数据验证 (5方法)
│   ├── array.js           # 数组操作 (4方法)
│   ├── format.js          # 格式化工具 (9方法)
│   ├── helper.js          # 辅助函数 (2方法)
│   ├── ui.js              # UI工具 (4方法)
│   ├── calculate.js       # 计算工具 (4方法)
│   ├── security.js        # 加密安全 (2方法)
│   └── environment.js     # 环境检测 (2方法)
├── old-utils/             # 旧版代码(兼容)
│   └── index.js           # 2107行原始文件
├── test/                  # 测试文件
│   ├── index.test.js      # 完整测试套件
│   └── TEST-REPORT.md     # 测试结果报告
├── .github/
│   └── utils.md           # 重构规划文档
├── index.js               # 主入口
├── package.json
└── README.md
```

---

## 🧪 运行测试

```bash
# 克隆仓库
git clone https://github.com/zhanghuai123/lanerp.git
cd lanerp

# 安装依赖
npm install

# 运行测试
npm test

# 查看测试报告
cat test/TEST-REPORT.md
```

测试覆盖所有 52 个方法,确保代码质量。

---

## 🤝 贡献指南

欢迎贡献代码! 请遵循以下规范:

1. **代码风格**: 遵循项目的 ESLint 配置
2. **模块化**: 新功能应归类到合适的模块
3. **测试**: 所有新方法必须包含测试用例
4. **文档**: 更新 README.md 和 JSDoc 注释

提交 PR 前请确保:
```bash
npm test  # 测试通过
```

---

## 📋 版本历史

### v2.0.0 (2026-01)
- ✨ 完成模块化重构 (12个模块, 52个方法)
- ✅ 添加完整测试套件
- 📚 重写文档系统
- 🔧 保持向后兼容

### v1.0.3 (2026-01-15)
- 🎉 功能完善
- ✨ 日期、数字、环境检测优化
- 📝 文档更新

### v1.0.2 (2026-01-15)
- 🔧 功能优化

### v1.0.1 (2026-01-14)
- 🎉 首次发布 (单文件模式)

---

## 📝 License

[MIT](LICENSE)

---

## 👤 作者

**zhanghuai**

---

## 📮 链接

- 📦 [npm 包地址](https://www.npmjs.com/package/lanerp)
- 💻 [GitHub 仓库](https://github.com/zhanghuai123/lanerp)

---

**📌 温馨提示**: 
- 🔍 详细 API 文档请参考上方各模块说明
- 🧪 完整测试报告见 [test/TEST-REPORT.md](test/TEST-REPORT.md)
- 📋 重构规划文档见 [.github/utils.md](.github/utils.md)

---

如有问题或建议，欢迎提 [Issue](https://github.com/zhanghuai123/lanerp/issues)！

