# NPM包开发与发布指南

## 一、准备工作

### 1.1 安装Node.js和npm
确保已安装Node.js（会自动包含npm）
```bash
node -v
npm -v
```

### 1.2 注册npm账号
- 访问 [https://www.npmjs.com/](https://www.npmjs.com/)
- 注册账号并验证邮箱

### 1.3 本地登录npm
```bash
npm login
# 输入用户名、密码、邮箱
```

验证登录状态：
```bash
npm whoami
```

---

## 二、创建npm项目

### 2.1 初始化项目
```bash
mkdir my-npm-package
cd my-npm-package
npm init
```

或使用默认配置快速初始化：
```bash
npm init -y
```

### 2.2 配置package.json
```json
{
  "name": "your-package-name",
  "version": "1.0.0",
  "description": "包的描述",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["关键词1", "关键词2"],
  "author": "你的名字",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  },
  "bugs": {
    "url": "https://github.com/username/repo/issues"
  },
  "homepage": "https://github.com/username/repo#readme"
}
```

**重要字段说明：**
- `name`: 包名（必须唯一，可在npmjs.com搜索检查）
- `version`: 版本号（遵循语义化版本规范）
- `main`: 入口文件
- `keywords`: 便于用户搜索
- `files`: 指定发布时包含的文件

### 2.3 创建入口文件
创建 `index.js`：
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

module.exports = {
  greet
};
```

---

## 三、编写代码和文档

### 3.1 目录结构建议
```
@lanerp/
├── src/              # 源代码
├── lib/              # 编译后的代码
├── test/             # 测试文件
├── index.js          # 入口文件
├── package.json      # 项目配置
├── README.md         # 使用文档
├── LICENSE           # 许可证
└── .gitignore        # Git忽略文件
```

### 3.2 创建README.md
```markdown
# 包名

## 安装
\`\`\`bash
npm install your-package-name
\`\`\`

## 使用方法
\`\`\`javascript
const myPackage = require('your-package-name');
myPackage.greet('World');
\`\`\`

## API文档
...

## 许可证
MIT
```

### 3.3 创建.gitignore
```
node_modules/
.DS_Store
*.log
.env
dist/
coverage/
```

### 3.4 创建.npmignore
指定发布时不包含的文件：
```
test/
*.test.js
.git/
.vscode/
.idea/
*.md
!README.md
```

---

## 四、测试和验证

### 4.1 本地测试
在项目目录中：
```bash
npm link
```

在其他项目中测试：
```bash
npm link your-package-name
```

### 4.2 运行测试
```bash
npm test
```

### 4.3 检查包内容
查看将要发布的文件：
```bash
npm pack --dry-run
```

---

## 五、发布npm包

### 5.1 检查包名是否可用
```bash
npm search your-package-name
```

或访问：`https://www.npmjs.com/package/your-package-name`

### 5.2 更新版本号
```bash
# 补丁版本 1.0.0 -> 1.0.1
npm version patch

# 次版本 1.0.0 -> 1.1.0
npm version minor

# 主版本 1.0.0 -> 2.0.0
npm version major
```

### 5.3 发布包
```bash
npm publish
```

**发布为公开包（默认）：**
```bash
npm publish --access public
```

**发布为私有包（需付费账号）：**
```bash
npm publish --access restricted
```

### 5.4 验证发布
访问：`https://www.npmjs.com/package/your-package-name`

或在其他项目安装测试：
```bash
npm install your-package-name
```

---

## 六、更新和维护

### 6.1 更新包
1. 修改代码
2. 更新版本号：`npm version patch/minor/major`
3. 重新发布：`npm publish`

### 6.2 撤销发布
```bash
# 撤销特定版本（24小时内）
npm unpublish your-package-name@1.0.0

# 撤销整个包（24小时内）
npm unpublish your-package-name --force
```

### 6.3 废弃包
```bash
npm deprecate your-package-name@1.0.0 "这个版本已废弃，请使用2.0.0"
```

---

## 七、常见问题

### 7.1 包名冲突
- 使用作用域包：`@username/package-name`
- 发布作用域包：`npm publish --access public`

### 7.2 版本管理
遵循语义化版本（Semver）：
- **主版本号**：不兼容的API修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 7.3 .npmrc配置
创建 `.npmrc` 文件配置npm：
```
registry=https://registry.npmjs.org/
```

### 7.4 使用其他registry
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 恢复官方源
npm config set registry https://registry.npmjs.org/
```

---

## 八、最佳实践

### 8.1 代码质量
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 编写单元测试

### 8.2 持续集成
- 配置GitHub Actions或其他CI/CD
- 自动运行测试
- 自动发布新版本

### 8.3 文档完善
- 详细的README.md
- API文档
- 使用示例
- 更新日志（CHANGELOG.md）

### 8.4 TypeScript支持
如果使用TypeScript，确保：
- 编译为JavaScript
- 包含类型定义文件（.d.ts）
- 配置package.json的types字段

---

## 九、常用npm命令速查

```bash
# 初始化项目
npm init / npm init -y

# 安装依赖
npm install <package>
npm install <package> --save-dev

# 登录/登出
npm login
npm logout

# 查看登录用户
npm whoami

# 发布包
npm publish

# 更新版本
npm version patch/minor/major

# 查看包信息
npm view <package>
npm info <package>

# 搜索包
npm search <keyword>

# 本地链接
npm link
npm unlink

# 查看即将发布的文件
npm pack --dry-run

# 撤销发布
npm unpublish <package>@<version>

# 废弃包
npm deprecate <package>@<version> "message"
```

---

## 十、参考资源

- [npm官方文档](https://docs.npmjs.com/)
- [package.json配置说明](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [npm包开发最佳实践](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

---

**祝你的npm包发布成功！🎉**
