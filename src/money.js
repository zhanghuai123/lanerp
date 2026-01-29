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
/**
 * 将数字金额转换为大写中文金额
 * @param {number|string} money - 金额数字
 * @param {boolean} [has_unit=false] - 是否包含"元"单位
 * @returns {string} 中文大写金额
 */
const numberPriceToChinese = (money, has_unit) => {
    //汉字的数字
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    //基本单位
    const cnIntRadice = ['', '拾', '佰', '仟']
    //对应整数部分扩展单位
    const cnIntUnits = ['', '万', '亿', '兆']
    //对应小数部分单位
    const cnDecUnits = ['角', '分', '毫', '厘']
    //整数金额时后面跟的字符
    const cnInteger = '整'
    //整型完以后的单位
    const cnIntLast = has_unit ? '元' : ''
    //最大处理的数字
    const maxNum = 999999999999999.9999
    //金额整数部分
    let integerNum
    //金额小数部分
    let decimalNum
    //输出的中文金额字符串
    let chineseStr = ''
    //分离金额后用的数组，预定义
    let parts
    if (money === '') {
        return ''
    }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字
        return ''
    }
    if (money < 0) {
        chineseStr += '负'
        money = Math.abs(money)
    }
    if (money === 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger
        return chineseStr
    }
    //转换为字符串
    money = money.toString()
    if (money.indexOf('.') === -1) {
        integerNum = money
        decimalNum = ''
    } else {
        parts = money.split('.')
        integerNum = parts[0]
        decimalNum = parts[1].substr(0, 4)
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        let zeroCount = 0
        const IntLen = integerNum.length
        for (let i = 0; i < IntLen; i++) {
            let n = integerNum.substr(i, 1)
            let p = IntLen - i - 1
            let q = p / 4
            let m = p % 4
            if (n === '0') {
                zeroCount++
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0]
                }
                //归零
                zeroCount = 0
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
            }
            if (m === 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q]
            }
        }
        chineseStr += cnIntLast
    }
    //小数部分
    if (decimalNum !== '') {
        var decLen = decimalNum.length
        for (let i = 0; i < decLen; i++) {
            let n = decimalNum.substr(i, 1)
            if (n !== '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i]
            }
        }
    }
    if (chineseStr === '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger
    } else if (decimalNum === '') {
        chineseStr += cnInteger
    }
    return chineseStr
}

/**
 * 商品单价优惠情况文字
 * @param {Object} goods - 商品对象
 * @param {number} goods.guide_price - 指导价
 * @param {Object} goods.price - 价格对象
 * @param {number} goods.price.value - 实际价格
 * @param {number} goods.num - 数量
 * @returns {Object} { class: string, text: string }
 */
const goodsPriceDiscountsText = (goods) => {
    const { guide_price = 0, price } = goods
    if (Number(price.value) === 0) {
        return {
            class: 'gift',
            text: '赠送'
        }
    } else if (Number(price.value) > Number(guide_price)) {
        const total = (Number(price.value) - Number(guide_price)) * goods.num
        return {
            class: 'premium',
            text: '溢价' + formatThousands(formatToFixed(total))
        }
    } else {
        const total = (Number(guide_price) - Number(price.value)) * goods.num
        return {
            class: 'discount',
            text: '优惠' + formatThousands(formatToFixed(total))
        }
    }
}

// 内部辅助函数
const formatToFixed = (value, decimalPlaces = 2) => {
    const num = parseFloat(value);
    if (isNaN(num)) return `0.${'0'.repeat(decimalPlaces)}`;
    return num.toLocaleString('fullwide', {
        useGrouping: false,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    });
}

module.exports = {
    formatThousands,
    formatThousandsPrice,
    numberPriceToChinese,
    goodsPriceDiscountsText
}