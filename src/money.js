// 数值转千分位
const formatThousands = (num) => {
    // 处理空值或非数字情况
    if (num === null || num === undefined || num === '') {
        return '';
    }

    // 将输入转换为字符串（处理数字类型和字符串类型输入）
    let str = String(num).trim();

    // 检查是否为有效数字格式（整数、小数、负数）
    if (!/^[-+]?(\d+)(\.\d+)?$/.test(str)) {
        // console.warn('输入不是有效的数字格式:', num);
        return str; // 非有效数字返回原内容
    }

    // 分割符号、整数部分和小数部分
    let sign = '';
    let integerPart = '';
    let decimalPart = '';

    // 处理正负号
    if (str.startsWith('-') || str.startsWith('+')) {
        sign = str[0];
        str = str.slice(1);
    }

    // 分割整数和小数部分
    if (str.includes('.')) {
        [integerPart, decimalPart] = str.split('.');
        // 保留小数部分（去除末尾多余的0，可选）
        // decimalPart = decimalPart.replace(/0+$/, '');
    } else {
        integerPart = str;
    }

    // 处理整数部分加千分位
    // 正则：从右向左每三位数字前加逗号（忽略开头的0）
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // 组合结果（符号 + 格式化的整数部分 + 小数部分）
    let result = sign + formattedInteger;
    if (decimalPart) {
        result += '.' + decimalPart;
    }

    return result;
}
// 数字字符串类型 千分符统一返回.00
const formatThousandsPrice = (num,unit='') => {
    if(typeof num === 'number'){
      num =  num.toFixed(2)
    }
    return num||num===0?unit+formatThousands(num):'--'
}
module.exports = {
    formatThousands,
    formatThousandsPrice
}