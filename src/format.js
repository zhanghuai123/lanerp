/**
 * 格式化工具模块
 * @module format
 */

/**
 * 格式化文件大小
 * @param {number} size - 文件大小（字节）
 * @returns {string} 格式化后的文件大小（例: 1.23MB）
 */
const formatFileSize = (size) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${parseFloat(size.toFixed(2))}${units[unitIndex]}`;
}

/**
 * 数字保留指定小数位（输出数字类型）
 * @param {number} value - 要格式化的数字
 * @param {number} [decimalPlaces=2] - 小数位数
 * @returns {number} 格式化后的数字
 */
const formatToNumber = (value, decimalPlaces = 2) => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
}

/**
 * 数字保留指定小数位（输出字符串类型）
 * @param {number} value - 要格式化的数字
 * @param {number} [decimalPlaces=2] - 小数位数
 * @returns {string} 格式化后的字符串
 */
const formatToFixed = (value, decimalPlaces = 2) => {
    const num = parseFloat(value);
    if (isNaN(num)) return `0.${'0'.repeat(decimalPlaces)}`;

    return num.toLocaleString('fullwide', {
        useGrouping: false,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    });
}

/**
 * 保持指定精度位数的格式化方法
 * @param {number|string} value - 要格式化的值
 * @param {number} precision - 精度位数
 * @returns {string} 格式化后的数字字符串
 */
const formatNumberWithPrecision = (value, precision) => {
    if (value === null || value === undefined || value === '') {
        return value;
    }

    const num = Number(value);
    if (isNaN(num)) {
        return value;
    }

    // 将数字转换为字符串
    let strValue = num.toString();
    
    if (precision === 0) {
        // 如果精度为0，只取整数部分
        const integerPart = strValue.split('.')[0];
        return parseInt(integerPart, 10).toString();
    }

    // 分割整数和小数部分
    const parts = strValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    let formattedDecimalPart;
    if (decimalPart.length > precision) {
        // 如果小数部分超过精度，截取指定长度
        formattedDecimalPart = decimalPart.substring(0, precision);
    } else {
        // 如果小数部分不足精度，补0
        formattedDecimalPart = decimalPart.padEnd(precision, '0');
    }

    // 组合整数部分和格式化后的小数部分
    return `${integerPart}.${formattedDecimalPart}`;
}

/**
 * 初始化千分符格式化
 * @param {number|string} numberValue - 要格式化的数字
 * @returns {string} 千分符格式化后的字符串（保留2位小数）
 */
const init_thousand_separator = (numberValue) => {
    numberValue = Number(numberValue);
    if (!isNaN(numberValue)) {
        return numberValue.toLocaleString('zh', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }
    return '--'
}

/**
 * 判断数字是否小于0
 * @param {number|string} num - 要判断的数字
 * @returns {string} 小于0返回 'E44144_text'，否则返回空字符串
 */
const num_is_it_less_than_0 = (num) => {
    num = Number(num);
    if (num < 0) {
        // 负数
        return 'E44144_text'
    }
    return ''
}

/**
 * 获取文件类型
 * @param {string} filename - 文件名
 * @returns {string} 文件类型 (image|pdf|video|excel|doc|ppt|unknown)
 */
const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const pdfExtensions = ['pdf'];
    const videoExtensions = ['mp4', 'webm'];
    const excelExtensions = ['xls', 'xlsx'];
    const docExtensions = ['doc', 'docx'];
    const pptExtensions = ['ppt', 'pptx'];
    
    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (pdfExtensions.includes(extension)) {
        return 'pdf';
    } else if (pptExtensions.includes(extension)) {
        return 'ppt';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    } else if (excelExtensions.includes(extension)) {
        return 'excel';
    } else if (docExtensions.includes(extension)) {
        return 'doc';
    } else {
        return 'unknown';
    }
}

/**
 * 字段操作符文本
 * @param {string} type - 操作符类型
 * @returns {string} 对应的中文文本
 */
const fieldOperatorText = (type) => {
    var string = ''
    switch (type) {
        case 'in':
            string = '选中'
            break
        case 'not_in':
            string = '未选中'
            break
        case 'eq':
            string = '等于'
            break
        case 'between':
            string = '包含以下任意'
            break
        case 'not_between':
            string = '不包含'
            break
        case 'gt':
            string = '大于'
            break
        case 'egt':
            string = '大于等于'
            break
        case 'elt':
            string = '小于等于'
            break
        case 'lt':
            string = '小于'
            break
    }
    return string
}

/**
 * 报销状态文本
 * @param {number} status - 状态码
 * @returns {string} 状态文本
 */
const reimbursement_status_text = (status) => {
    let text = "";
    switch (status) {
        case 0:
            text = "财务审核中";
            break;
        case 1:
            text = "财务待发放";
            break;
        case 2:
            text = "财务已发放";
            break;
        case 3:
            text = "财务已驳回";
            break;
    }
    return text;
}

module.exports = {
    formatFileSize,
    formatToNumber,
    formatToFixed,
    formatNumberWithPrecision,
    init_thousand_separator,
    num_is_it_less_than_0,
    getFileType,
    fieldOperatorText,
    reimbursement_status_text
}
