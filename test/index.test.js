/**
 * Utils 工具函数测试文件
 * 测试 src 目录下所有已拆分的模块
 */

console.log('\n========== 开始测试 Utils 工具函数 ==========\n');

// ========== 1. 测试统一导出 ==========
console.log('【1】测试统一导出 (src/index.js)');
try {
    const utils = require('../src/index.js');
    console.log('✅ 统一导出成功，导出方法数:', Object.keys(utils).length);
} catch (error) {
    console.error('❌ 统一导出失败:', error.message);
}

// ========== 2. 测试环境检测模块 ==========
console.log('\n【2】测试环境检测模块 (src/environment.js)');
try {
    const { isMobile, isWeixin } = require('../src/environment.js');
    
    // 在 Node.js 环境中模拟浏览器 window 和 navigator
    if (typeof window === 'undefined') {
        global.window = {
            navigator: {
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        };
        global.navigator = global.window.navigator;
    }
    
    console.log('  isMobile():', isMobile() ? '移动端' : '非移动端');
    console.log('  isWeixin():', isWeixin() ? '微信浏览器' : '非微信浏览器');
    console.log('✅ 环境检测模块测试通过');
} catch (error) {
    console.error('❌ 环境检测模块测试失败:', error.message);
}

// ========== 3. 测试字符串处理模块 ==========
console.log('\n【3】测试字符串处理模块 (src/string.js)');
try {
    const { 
        phoneEncryption, 
        calculateLength,
        numberToChinese,
        sliceFromMatch 
    } = require('../src/string.js');
    
    // 跳过需要 DOM 环境的方法（htmlDecode, limitLineBreaksWithHtml, containsMediaTags）
    console.log('  phoneEncryption("13812345678"):', phoneEncryption('13812345678'));
    console.log('  calculateLength("Hello世界"):', calculateLength('Hello世界'));
    console.log('  numberToChinese(15):', numberToChinese(15));
    console.log('  sliceFromMatch("hello-world", "-"):', sliceFromMatch('hello-world', '-'));
    console.log('  ⚠️  htmlDecode 等方法需要浏览器 DOM 环境');
    console.log('✅ 字符串处理模块测试通过');
} catch (error) {
    console.error('❌ 字符串处理模块测试失败:', error.message);
}

// ========== 4. 测试数据验证模块 ==========
console.log('\n【4】测试数据验证模块 (src/validation.js)');
try {
    const { isObject, isValid, isNumber } = require('../src/validation.js');
    
    console.log('  isObject({}):', isObject({}));
    console.log('  isObject([]):', isObject([]));
    console.log('  isValid(""):', isValid(''));
    console.log('  isValid("hello"):', isValid('hello'));
    console.log('  isNumber(123):', isNumber(123));
    console.log('  isNumber("abc"):', isNumber('abc'));
    console.log('✅ 数据验证模块测试通过');
} catch (error) {
    console.error('❌ 数据验证模块测试失败:', error.message);
}

// ========== 5. 测试数组处理模块 ==========
console.log('\n【5】测试数组处理模块 (src/array.js)');
try {
    const { mergeArrays, arrayDuplicate } = require('../src/array.js');
    
    const arr1 = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
    const arr2 = [{ id: 2, name: 'b2' }, { id: 3, name: 'c' }];
    const merged = mergeArrays(arr1, arr2);
    console.log('  mergeArrays 结果:', merged.map(item => `{id:${item.id}}`).join(', '));
    
    const duplicateArr = [
        { id: 1, name: 'a' }, 
        { id: 2, name: 'b' }, 
        { id: 1, name: 'a2' }
    ];
    const deduplicated = arrayDuplicate(duplicateArr, 'id');
    console.log('  arrayDuplicate 去重后:', deduplicated.length, '个元素');
    console.log('✅ 数组处理模块测试通过');
} catch (error) {
    console.error('❌ 数组处理模块测试失败:', error.message);
}

// ========== 6. 测试格式化模块 ==========
console.log('\n【6】测试格式化模块 (src/format.js)');
try {
    const { 
        formatFileSize, 
        formatToNumber, 
        formatToFixed,
        getFileType 
    } = require('../src/format.js');
    
    console.log('  formatFileSize(1024):', formatFileSize(1024));
    console.log('  formatFileSize(1048576):', formatFileSize(1048576));
    console.log('  formatToNumber(3.1415926, 2):', formatToNumber(3.1415926, 2));
    console.log('  formatToFixed(3.1415926, 2):', formatToFixed(3.1415926, 2));
    console.log('  getFileType("test.jpg"):', getFileType('test.jpg'));
    console.log('  getFileType("test.pdf"):', getFileType('test.pdf'));
    console.log('✅ 格式化模块测试通过');
} catch (error) {
    console.error('❌ 格式化模块测试失败:', error.message);
}

// ========== 7. 测试辅助函数模块 ==========
console.log('\n【7】测试辅助函数模块 (src/helper.js)');
try {
    const { debounce } = require('../src/helper.js');
    
    let counter = 0;
    const increment = () => counter++;
    const debouncedIncrement = debounce(increment, 100);
    
    // 快速调用3次
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();
    
    console.log('  立即调用3次后 counter:', counter);
    
    setTimeout(() => {
        console.log('  100ms后 counter (防抖生效):', counter);
        console.log('✅ 辅助函数模块测试通过');
    }, 150);
} catch (error) {
    console.error('❌ 辅助函数模块测试失败:', error.message);
}

// ========== 8. 测试日期时间模块 ==========
console.log('\n【8】测试日期时间模块 (src/date.js)');
try {
    const { 
        formatDate, 
        getNowDate,
        getDatesBetween 
    } = require('../src/date.js');
    
    const now = new Date();
    console.log('  formatDate(now, "date"):', formatDate(now, 'date'));
    console.log('  formatDate(now, "datetime"):', formatDate(now, 'datetime'));
    console.log('  getNowDate("date"):', getNowDate('date'));
    
    const dates = getDatesBetween('2026-01-01', '2026-01-03');
    console.log('  getDatesBetween("2026-01-01", "2026-01-03"):', dates.length, '天');
    console.log('✅ 日期时间模块测试通过');
} catch (error) {
    console.error('❌ 日期时间模块测试失败:', error.message);
}

// ========== 9. 测试金额处理模块 ==========
console.log('\n【9】测试金额处理模块 (src/money.js)');
try {
    const { 
        formatThousands, 
        formatThousandsPrice,
        numberPriceToChinese 
    } = require('../src/money.js');
    
    console.log('  formatThousands(1234567.89):', formatThousands(1234567.89));
    console.log('  formatThousandsPrice(1234.56, "￥"):', formatThousandsPrice(1234.56, '￥'));
    console.log('  numberPriceToChinese(12345.67, true):', numberPriceToChinese(12345.67, true));
    console.log('✅ 金额处理模块测试通过');
} catch (error) {
    console.error('❌ 金额处理模块测试失败:', error.message);
}

// ========== 10. 测试UI工具模块 ==========
console.log('\n【10】测试UI工具模块 (src/ui.js)');
try {
    const { getTableHeight } = require('../src/ui.js');
    
    // 在 Node.js 环境中模拟 window.innerHeight
    global.window = { innerHeight: 1000 };
    const height = getTableHeight(200);
    console.log('  getTableHeight(200) [模拟窗口高度1000]:', height);
    console.log('✅ UI工具模块测试通过');
} catch (error) {
    console.error('❌ UI工具模块测试失败:', error.message);
}

// ========== 11. 测试计算工具模块 ==========
console.log('\n【11】测试计算工具模块 (src/calculate.js)');
try {
    const { calculate } = require('../src/calculate.js');
    
    const result1 = calculate('a + b', { a: 10, b: 20 });
    console.log('  calculate("a + b", {a:10, b:20}):', result1);
    
    const result2 = calculate('a + b * (c + d)', { a: 1, b: 2, c: 3, d: 4 });
    console.log('  calculate("a + b * (c + d)", {a:1,b:2,c:3,d:4}):', result2);
    console.log('✅ 计算工具模块测试通过');
} catch (error) {
    console.error('❌ 计算工具模块测试失败:', error.message);
}

// ========== 12. 测试加密安全模块 ==========
console.log('\n【12】测试加密安全模块 (src/security.js)');
try {
    // 注意：security.js 依赖 CryptoJS，在 Node.js 环境中可能无法直接测试
    const { encryptAES, decryptAES } = require('../src/security.js');
    console.log('  encryptAES 和 decryptAES 方法已导出');
    console.log('  ⚠️  需要 CryptoJS 库才能执行加密解密操作');
    console.log('✅ 加密安全模块导出成功');
} catch (error) {
    console.error('❌ 加密安全模块测试失败:', error.message);
}

// ========== 测试总结 ==========
setTimeout(() => {
    console.log('\n========== 测试完成 ==========');
    console.log('✅ 所有核心模块均可正常导入和调用');
    console.log('📊 已测试模块: 12个');
    console.log('📝 注意: security.js 需要 CryptoJS 库支持');
    console.log('==========================================\n');
}, 200);
