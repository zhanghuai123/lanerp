/**
 * 字符串处理工具模块
 * @module string
 */

/**
 * HTML解码
 * @param {string} html - 需要解码的HTML字符串
 * @returns {string} 解码后的纯文本
 */
const htmlDecode = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.innerText
}

/**
 * 手机号中间4位加密
 * @param {string} phone - 手机号
 * @returns {string} 加密后的手机号 (例: 138****5678)
 */
const phoneEncryption = (phone) => {
    const reg = /^(\d{3})\d{4}(\d{4})$/
    const newPhone = phone.replace(reg, "$1****$2")
    return newPhone
}

/**
 * 判断输入了几个字符
 * @param {string} value - 输入的字符串
 * @returns {number} 字符数量（汉字占1个，英文占0.5个）
 */
const calculateLength = (value) => {
    let count = 0;
    for (let char of value) {
        // 判断是否为汉字
        if (/[\u4e00-\u9fa5]/.test(char)) {
            count += 1; // 汉字占1个字
        } else if (/[【】《》（）]/.test(char)) {
            count += 1; // 中文括号占1个字
        } else if (/[{}]/.test(char)) {
            count += 0.5; // 英文括号占0.5个字
        } else {
            count += 0.5; // 英文、空格和其他符号占0.5个字
        }
    }
    return count;
}

/**
 * 根据字符串是否包含某些子字符串，如果包含则从该子字符串开始截取到末尾
 * @param {string} sourceStr - 原始字符串
 * @param {string|string[]} targetStrs - 要查找的子字符串或子字符串数组
 * @param {boolean} [includeTarget=false] - 是否包含目标子字符串在结果中
 * @returns {string} 截取后的字符串，如果没有找到则返回原字符串
 */
const sliceFromMatch = (sourceStr, targetStrs, includeTarget = false) => {
    if (!sourceStr || !targetStrs) return '';

    // 统一处理为数组形式
    const targets = Array.isArray(targetStrs) ? targetStrs : [targetStrs];

    for (const target of targets) {
        const index = sourceStr.indexOf(target);
        if (index !== -1) {
            return includeTarget ?
                sourceStr.slice(index) :
                sourceStr.slice(index + target.length);
        }
    }

    return sourceStr;
}

/**
 * 获取除了标签之外的纯文本字符长度
 * @param {string} html - HTML字符串
 * @returns {number} 纯文本长度
 */
const getPlainTextLength = (html) => {
    // 替换HTML标签和特殊字符
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').length
}

/**
 * 处理 HTML 格式的换行压缩，出现多个换行的时候最多保留2个换行
 * @param {string} html - HTML字符串
 * @returns {string} 压缩换行后的HTML字符串
 */
const limitLineBreaksWithHtml = (html) => {
    // 匹配 3 个及以上连续 \n
    let processedText = html.replace(/\n{3,}/g, '\n\n');

    // 匹配 3 个及以上连续 <br> 或 <div><br></div>
    processedText = processedText.replace(/(<br\s*\/?>){3,}/gi, '<br><br>'); // 压缩 <br> 换行
    processedText = processedText.replace(/(<div>\s*<br\s*\/?>\s*<\/div>){3,}/gi, '$1$1'); // 压缩块级换行
    processedText = processedText.replace(/(<p>\s*<br\s*\/?>\s*<\/p>){3,}/gi, '$1$1'); // 压缩块级换行

    // 移除空的div标签
    processedText = processedText.replace(/<div>\s*<\/div>/gi, '');

    // 移除多余的换行符
    processedText = processedText.replace(/\n\s*\n/g, '\n\n');

    return processedText
}

/**
 * 获取富文本字符串中是否包含img标签和video标签
 * @param {string} html - HTML字符串
 * @returns {Object} { containsImg: boolean, containsVideo: boolean }
 */
const containsMediaTags = (html) => {
    // 创建虚拟DOM元素
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 检查是否存在img或video标签
    const containsImg = doc.querySelector('img') !== null;
    const containsVideo = doc.querySelector('video') !== null;

    return { containsImg, containsVideo };
}

/**
 * 构建重定向URL
 * @param {Object} params - 参数对象，必须包含 redirect 属性
 * @param {string} params.redirect - 重定向路径
 * @returns {string} 构建好的URL路径（包含查询参数）
 */
const buildRedirectUrl = (params) => {
    if (!params.redirect) return '';

    const url = new URL(params.redirect, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
        if (key !== "redirect" && value != null) {
            url.searchParams.set(key, String(value));
        }
    });
    return url.pathname + url.search;
}

/**
 * 数字转中文（一二三）
 * @param {number} num - 要转换的数字 (0-99)
 * @returns {string} 中文数字
 */
const numberToChinese = (num) => {
    const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

    if (num < 10) return chineseNumbers[num];
    if (num < 20) return num === 10 ? '十' : '十' + chineseNumbers[num - 10];
    if (num < 100) {
        const tens = Math.floor(num / 10);
        const ones = num % 10;
        return (tens === 1 ? '十' : chineseNumbers[tens] + '十') +
            (ones === 0 ? '' : chineseNumbers[ones]);
    }
    return num.toString(); // 超过100返回原数字
}

module.exports = {
    htmlDecode,
    phoneEncryption,
    calculateLength,
    sliceFromMatch,
    getPlainTextLength,
    limitLineBreaksWithHtml,
    containsMediaTags,
    buildRedirectUrl,
    numberToChinese
}
