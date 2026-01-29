/**
 * 工具函数统一导出
 * @description 统一导出所有工具函数模块，保持向后兼容
 */

// ========== 核心工具 ==========
// 日期时间工具
const dateUtils = require('./date.js')
// 金额处理工具
const moneyUtils = require('./money.js')
// 环境检测工具
const environmentUtils = require('./environment.js')
// 字符串处理工具
const stringUtils = require('./string.js')
// 数据验证工具
const validationUtils = require('./validation.js')
// 数组处理工具
const arrayUtils = require('./array.js')
// 格式化工具
const formatUtils = require('./format.js')
// 辅助函数
const helperUtils = require('./helper.js')

// ========== 功能工具 ==========
// UI相关工具
const uiUtils = require('./ui.js')
// 计算工具
const calculateUtils = require('./calculate.js')
// 加密安全工具
const securityUtils = require('./security.js')

// 统一导出
module.exports = {
    // 日期时间
    ...dateUtils,
    
    // 金额处理
    ...moneyUtils,
    
    // 环境检测
    ...environmentUtils,
    
    // 字符串处理
    ...stringUtils,
    
    // 数据验证
    ...validationUtils,
    
    // 数组处理
    ...arrayUtils,
    
    // 格式化
    ...formatUtils,
    
    // 辅助函数
    ...helperUtils,
    
    // UI相关
    ...uiUtils,
    
    // 计算工具
    ...calculateUtils,
    
    // 加密安全
    ...securityUtils
}
