import CryptoJS from 'crypto-js';

import jsPDF from "jspdf";
import htmlDocx from "html-docx-js/dist/html-docx";

import {useRouter} from 'vue-router';
import _ from 'lodash'
// 定义一个全局变量来存储路由实例
let routerInstance = null;
// 初始化路由实例的函数
export const initRouter = (router) => {
    routerInstance = router;
};

//获取列表的高度
export const getTableHeight = height => {
    let tableHeight
    if (window.innerHeight - height <= 300) {
        tableHeight = 300
    } else {
        tableHeight = window.innerHeight - height
    }
    return tableHeight
}

//获取列表的动态高度
export const getTableStateHeight = (outerDom, topDom, otherHeight = 0) => {
    const outerDomHeight = document.getElementsByClassName(outerDom)[0] ? document.getElementsByClassName(outerDom)[0].clientHeight : 0
    const searchDomHeight = document.getElementsByClassName(topDom)[0] ? document.getElementsByClassName(topDom)[0].clientHeight : 0
    let tableHeight
    if (outerDomHeight - searchDomHeight - otherHeight <= 300) {
        tableHeight = 300
    } else {
        tableHeight = outerDomHeight - searchDomHeight - otherHeight
    }
    return tableHeight
}

// 计算两个日期中所有的日期
export const getDaysBetween = (start, end) => {
    //初始化日期列表，数组
    let diffDate = new Array()
    let i = 0
    //开始日期小于等于结束日期,并循环
    while (start <= end) {
        diffDate[i] = start
        //获取开始日期时间戳
        let stime_ts = new Date(start).getTime()
        //增加一天时间戳后的日期
        let next_date = stime_ts + (24 * 60 * 60 * 1000)
        //拼接年月日，这里的月份会返回（0-11），所以要+1
        let next_dates_y = new Date(next_date).getFullYear() + '-'
        let next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-'
        let next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate()
        start = next_dates_y + next_dates_m + next_dates_d
        //增加数组key
        i++
    }
    return diffDate
}

export const htmlDecode = html => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.innerText
}

export const isMobile = () => {
    let flag = navigator.userAgent.match(
        /(phone|pad|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows phone)/i
    );
    return flag;
}

// 手机号中间4位加密
export const phoneEncryption = phone => {
    const reg = /^(\d{3})\d{4}(\d{4})$/
    const newPhone = phone.replace(reg, "$1****$2")
    return newPhone
}

/*
params:
exp - 普通表达式，例如 a + b * (c + d)
exp_values - 表达式对应数据内容，例如 { a: 1, b: 2, c: 3, d: 4 }
*/
const PATTERN_EXP = /((?:[a-zA-Z0-9_.]+)|(?:[\(\)\+\-\*\/])){1}/g;
const EXP_PRIORITIES = { '+': 1, '-': 1, '*': 2, '/': 2, '(': 0, ')': 0 };

export function calculate(exp, exp_values) {
    const exp_arr = parseExp(exp); // 将表达式字符串解析为列表
    if (!Array.isArray(exp_arr)) {
        return null;
    }
    const output_queue = nifix2rpn(exp_arr);
    return calculateValue(output_queue, exp_values);
}

// 将字符串中每个操作项和预算符都解析出来
function parseExp(exp) {
    const match = exp.match(PATTERN_EXP);
    return match ? match : null;
}

// 将中缀表达式转为后缀表达式
function nifix2rpn(input_queue) {
    const exp_stack = [];
    const output_queue = [];
    for (const input of input_queue) {
        if (input in EXP_PRIORITIES) {
            if (input === '(') {
                exp_stack.push(input);
                continue;
            }
            if (input === ')') {
                let tmp_exp = exp_stack.pop();
                while (tmp_exp && tmp_exp !== '(') {
                    output_queue.push(tmp_exp);
                    tmp_exp = exp_stack.pop();
                }
                continue;
            }
            for (const exp of [...exp_stack].reverse()) {
                if (EXP_PRIORITIES[input] <= EXP_PRIORITIES[exp]) {
                    exp_stack.pop();
                    output_queue.push(exp);
                } else {
                    break;
                }
            }
            exp_stack.push(input);
        } else {
            output_queue.push(input);
        }
    }
    for (const exp of [...exp_stack].reverse()) {
        output_queue.push(exp);
    }
    return output_queue;
}

// 传入后缀表达式队列、各项对应值的数组，计算出结果
function calculateValue(output_queue, exp_values) {
    const res_stack = [];
    for (const out of output_queue) {
        if (out in EXP_PRIORITIES) {
            const a = res_stack.pop();
            const b = res_stack.pop();
            let res;
            switch (out) {
                case '+':
                    res = b + a;
                    break;
                case '-':
                    res = b - a;
                    break;
                case '*':
                    res = b * a;
                    break;
                case '/':
                    res = b / a;
                    break;
            }
            res_stack.push(res);
        } else {
            if (!isNaN(out)) {
                res_stack.push(Math.floor(out * 1000000) / 1000000);
            } else {
                res_stack.push(exp_values[out]);
            }
        }
    }
    return res_stack.length === 1 ? res_stack[0] : null;
}

// 获取上传附件的大小
export function formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${parseFloat(size.toFixed(2))}${units[unitIndex]}`;
}

//自定义表单组件过滤规则
export function componentsFilterRule(field_form) {
    const data = {
        users: ['input', 'textarea', 'number', 'money', 'telephone', 'radio', 'checkbox', 'cascader', 'date', 'date_range', 'address', 'contact', 'department', 'table', 'image', 'file', 'id_card',],
        purchases: ['input', 'textarea', 'number', 'money', 'explain', 'compute_mode', 'location', 'serial_number', 'checkbox_check_record', 'paying_teller', 'invoice', 'telephone', 'radio', 'checkbox', 'cascader', 'date', 'date_range', 'address', 'contact', 'department', 'table', 'image', 'file',],
        approve: ['input', 'textarea', 'number', 'explain', 'number', 'money', 'compute_mode', 'telephone', 'radio', 'checkbox', 'cascader', 'date', 'date_range', 'address', 'location', 'contact', 'department', 'table', 'image', 'file', 'checkbox_approval', 'checkbox_check_record', 'id_card', 'rate', 'paying_teller', 'invoice'],
        project_stage_tasks: ['input', 'textarea', 'number', 'explain', 'number', 'money', 'telephone', 'radio', 'checkbox', 'cascader', 'date', 'date_range', 'address', 'location', 'contact', 'department', 'image', 'file', 'checkbox_approval', 'checkbox_check_record', 'paying_teller'],
        customer_contacts: ['input', 'textarea', 'number', 'explain', 'number', 'money', 'compute_mode', 'telephone', 'radio', 'checkbox', 'cascader', 'date', 'date_range', 'address', 'location'],
    }
    return data[field_form] || []
}

// 传入字段值返回对应的名称
export function fieldOperatorText(type) {
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

// 判断输入了几个字符
export function calculateLength(value) {
    let count = 0;
    for (let char of value) {
        // 判断是否为汉字
        if (/[\u4e00-\u9fa5]/.test(char)) {
            count += 1; // 汉字占1个字
        } else if (/[$$【】《》（）]/.test(char)) {
            count += 1; // 中文括号占1个字
        } else if (/[$$$${}]/.test(char)) {
            count += 0.5; // 英文括号占0.5个字
        } else {
            count += 0.5; // 英文、空格和其他符号占0.5个字
        }
    }
    return count;
}


//获取树形结构父级路径
export const getItemByIdInTree = (tree, value, path = "") => {
    for (var i = 0; i < tree.length; i++) {
        let tempPath = path
        tempPath = `${tempPath ? tempPath + '/' : tempPath}${tree[i].relate_name}` // 避免出现在最前面的/
        if (tree[i].relate_id === value) {
            return tempPath
        } else if (tree[i].children) {
            let reuslt = getItemByIdInTree(tree[i].children, value, tempPath)
            if (reuslt) {
                return reuslt
            }
        }
    }
}

export const findObjectById = (data, id) => {
    for (const obj of data) {
        if (obj.relate_id === id) {
            return obj;
        }
        if (obj.children) {
            const foundObj = findObjectById(obj.children, id);
            if (foundObj) {
                return foundObj;
            }
        }
    }
    return null;
}

//格式化日期
export const formatDate = (dateString, date_type) => {
    if (typeof dateString === 'string') {
        // 将日期字符串中的'-'替换为'/'，以兼容iOS
        dateString = dateString.replace(/-/g, '/');
    }
    // 创建日期对象
    const dateObj = new Date(dateString)
    // 获取年、月、日
    const year = dateObj.getFullYear()
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2)
    const day = ('0' + dateObj.getDate()).slice(-2)
    const hours = ('0' + dateObj.getHours()).slice(-2)
    const minutes = ('0' + dateObj.getMinutes()).slice(-2)
    const seconds = ('0' + dateObj.getSeconds()).slice(-2)
    let formattedDateTime = ''
    if (date_type === 'date') {
        formattedDateTime = year + '-' + month + '-' + day
    } else if (date_type === 'year-month') {
        formattedDateTime = year + '-' + month
    } else if (date_type === 'datetime') {
        formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
    } else if (date_type === 'hourtime') {
        formattedDateTime = hours + ':' + minutes + ":" + seconds
    } else if (date_type === 'month') {
        formattedDateTime = month + '-' + day
    } else if (date_type === 'date-second-time') {
        formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ":" + seconds
    } else if (date_type === 'hour') {
        formattedDateTime = hours + ':' + minutes
    } else {
        formattedDateTime = year + '-' + month + '-' + day
    }
    return formattedDateTime
}

//获取当前时间
export const getNowDate = (date_type) => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1
    const date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
    const hours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours()
    const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()

    let str = ''
    if (date_type === 'year-month') {
        str = `${year}-${month}`
    } else if (date_type === 'datetime') {
        str = `${year}-${month}-${date} ${hours}:${minutes}`
    } else if (date_type === 'time') {
        str = `${hours}:${minutes}`
    } else {
        str = `${year}-${month}-${date}`
    }
    return str
}

//将数字金额转换为大写中文金额
export const numberPriceToChinese = (money, has_unit) => {
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

//列表字段回显
export const tableDataFieldShow = (fields_list, data_list, is_hide_phone_prefix) => {
    fields_list.forEach(field => {
        data_list.forEach(async item => {
            // 如果列表中没有这个自定义字段，则添加并置为空
            if (item.hasOwnProperty(field.field_key)) {
                if (field.field_type === 'telephone') {
                    if(is_hide_phone_prefix) {
                        // 隐藏电话类型
                        item[field.field_key] = item[field.field_key].value || ""
                    } else {
                        item[field.field_key] = item[field.field_key].prefix && item[field.field_key].value ? item[field.field_key].prefix + ' ' + item[field.field_key].value : ''
                    }
                } else if (field.field_type === 'rate' || field.field_type === 'rate_remind') {
                    field.min_widtn = '100px'
                    item[field.field_key] = item[field.field_key].text
                } else if (field.field_type === 'checkbox' ||
                    field.field_type === 'checkbox_user_tag' ||
                    field.field_type === 'department' ||
                    field.field_type === 'contact' || field.field_type === 'customer_contact' || field.field_type === 'workorder_role') {
                    item[field.field_key] = item[field.field_key].text && item[field.field_key].text.length ? item[field.field_key].text : []
                } else if (field.field_type === 'radio') {
                    if(field.field_key == 'deliver_type'){
                        field.min_widtn = '140px'
                    }else{
                        field.min_widtn = '120px'
                        item[field.field_key] = item[field.field_key].text ? item[field.field_key].text : ''
                    }
                } else if (field.field_type === 'radio_workorder_type') {
                    item[field.field_key] = item[field.field_key].text ? item[field.field_key].text : ''
                } else if (field.field_type === 'address' ||
                    field.field_type === 'date_range' ||
                    field.field_type === 'cascader') {
                    field.min_widtn = '240px'
                    item[field.field_key] = item[field.field_key].text && item[field.field_key].text.length ? item[field.field_key].text : ''
                } else if (field.field_type === 'input' ||
                    field.field_type === 'textarea' ||
                    field.field_type === 'date' || field.field_type === 'serial_number' || field.field_type === 'location') {
                    item[field.field_key] = item[field.field_key].value ? item[field.field_key].value : ''
                    if (field.field_type === 'textarea') {
                        field.min_widtn = '240px'
                    } else {
                        field.min_widtn = '180px'
                    }
                } else if (field.field_type === 'date_range_apm') {
                    field.min_widtn = '280px'
                    item[field.field_key] = item[field.field_key].text ? item[field.field_key].text : ''
                } else if (field.field_type === 'id_card') {
                    field.min_widtn = '220px'
                    if (field.extend.data_desensitization && item[field.field_key].value) {
                        item[field.field_key].text = item[field.field_key].value.replace(/(\d{4})\d+(\d{2})/, '$1********$2');
                    } else {
                        item[field.field_key].text = item[field.field_key].value
                    }
                } else if (field.field_type === 'paying_teller') {
                    field.min_widtn = '220px'
                } else if (field.field_type === 'number') {
                    field.align = 'right'
                    item[field.field_key] = item[field.field_key].value ? item[field.field_key].value : ''
                } else if (field.field_type === 'money') {
                    field.align = 'right'
                    item[field.field_key] = item[field.field_key].value ? (item[field.field_key].unit ? item[field.field_key].unit + item[field.field_key].text : item[field.field_key].text) : ''
                } else if (field.field_type === 'compute_mode') {
                    field.align = 'right'
                    item[field.field_key] = item[field.field_key].text ? item[field.field_key].text : ''
                } else if (field.field_type === 'money_compute_mode') {
                    field.align = 'right'
                    item[field.field_key] = item[field.field_key].text ? item[field.field_key].text : ''
                } else if (field.field_type === 'order_amount_compute_mode') {
                    field.align = 'right'
                    if (field.extend.num_display_style === '2') {
                        item[field.field_key] = item[field.field_key].text ? item[field.field_key].text + '%' : ''
                    } else {
                        item[field.field_key] = item[field.field_key].text ? item[field.field_key].text : ''
                    }
                } else if (field.field_type === 'file') {
                    field.min_widtn = '280px'
                } else if (field.field_type === 'radio_project') {
                    field.min_widtn = '230px'
                } else if (field.field_type === 'invoice') {
                    field.min_widtn = '300px'
                }
            } else {
                item[field.field_key] = ''
                if (field.field_type === 'order_amount_compute_mode') {
                    field.align = 'right'
                }
            }
        })
    })
}

//获取当前业务是否需要审批
export const getBusinessIsApproval = async (approval_type) => {
    const { getIsApproval } = await import('@/api')
    return new Promise((resolve, reject) => {
        getIsApproval({
            approval_type
        }).then(res => {
            if (res.code === 200) {
                resolve(res.data[approval_type])
            } else {
                reject(res.message)
            }
        })
    })
}

var SECRET_KEY = CryptoJS.enc.Utf8.parse('3QG1525dyenPf3RBHb9yPptMddE5P4e7'); // 16 位 AES 加密密钥
var SECRET_IV = CryptoJS.enc.Utf8.parse('mdHp1GGHsEzczAz7');  // 16 位初始向量 IV
// AES 加密函数
export const encryptAES = (data) => {
    let srcs = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(srcs, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    })
    return encodeURIComponent(CryptoJS.enc.Base64.stringify(encrypted.ciphertext));
}
// AES 解密函数
export const decryptAES = (data) => {
    let base64 = CryptoJS.enc.Base64.parse(decodeURIComponent(data));
    let srcs = CryptoJS.enc.Base64.stringify(base64);
    const decrypt = CryptoJS.AES.decrypt(srcs, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
}

// 删除当前标签页
export const removeTag = async (route) => {
    const store = await import('@/store')
    let tagList = store.default.state.tagList;
    // 过滤函数：排除与当前路由匹配的项
    const filteredRoutes = tagList.filter(currentRoute => {
        // 1. 比较 name 是否相同
        const isSameName = route.name === currentRoute.name;

        // 2. 比较 query 是否相同（需处理空 query 情况）
        const isSameQuery =
            (Object.keys(route.query).length === 0 && Object.keys(currentRoute.query).length === 0) || // 两者 query 均为空
            JSON.stringify(route.query) === JSON.stringify(currentRoute.query); // 或 query 完全一致
        // 保留不匹配当前路由的项
        return !(isSameName && isSameQuery);
    });
    store.default.dispatch('saveTagInfo', filteredRoutes)
}

export const getDateRange = (value) => {
    var end = ''
    var start = ''
    var today = new Date();
    switch (value) {
        case 'today':
            end = new Date();
            start = new Date();
            break;
        case 'yesterday':
            end = new Date();
            start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            end.setTime(end.getTime() - 3600 * 1000 * 24);
            break;
        case 'week':
            // 设置今天的日期

            const dayOfWeek = today.getDay();
            const dayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            start = new Date(today);
            start.setDate(start.getDate() + dayOffset);
            end = new Date(start);
            end.setDate(end.getDate() + 6);
            break;
        case 'last_week':

            const day = today.getDay() || 7; // 将getDay()返回的0（周日）转换为7
            start = new Date(today);
            start.setDate(today.getDate() - day - 6); // 上周一的日期
            end = new Date(today);
            end.setDate(today.getDate() - day); // 上周日的日期
            break;
        case 'month':
            end = new Date();
            start = new Date(end.getFullYear(), end.getMonth(), 1);
            break;
        case 'last_month':
            end = new Date();
            start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
            end.setMonth(end.getMonth(), 0); // 上月的最后一天
            break;
        case 'month_all':
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // 关键代码
            break;
        case 'year':
            start = new Date(new Date().getFullYear(), 0, 1);
            end = new Date(new Date().getFullYear(), 11, 31);
            break;
        case 'quarter':
            start = new Date();
            start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
            start.setHours(0, 0, 0, 0);

            end = new Date(start);
            end.setMonth(start.getMonth() + 3, 0);
            end.setHours(23, 59, 59, 999);
            break;
        default:
            return 'Invalid value';
    }
    return `${formatDate(start, 'date')} - ${formatDate(end, 'date')}`;
}

// 获取定位信息
export const getLocation = (options = {}) => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("浏览器不支持定位功能"));
            return;
        }

        // 配置定位参数（可选）
        const defaultOptions = {
            enableHighAccuracy: true, // 高精度模式
            timeout: 5000,           // 超时时间（毫秒）
            maximumAge: 0            // 缓存位置的最大寿命（0表示必须实时获取）
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            (error) => {
                reject(error);
            },
            { ...defaultOptions, ...options }
        );
    });
};

/**
 * 根据字符串是否包含某些子字符串，如果包含则从该子字符串开始截取到末尾
 * @param {string} sourceStr - 原始字符串
 * @param {string|string[]} targetStrs - 要查找的子字符串或子字符串数组
 * @param {boolean} [includeTarget=true] - 是否包含目标子字符串在结果中
 * @returns {string} 截取后的字符串，如果没有找到则返回空字符串
 */
export const sliceFromMatch = (sourceStr, targetStrs, includeTarget = false) => {
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

// 获取两个日期之间的所有日期
export const getDatesBetween = (startDate, endDate) => {
    // 解析日期并验证有效性
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) return [];

    // 标准化为本地时间的 0 点
    const normalize = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    // 确保开始日期 <= 结束日期
    let startNorm = normalize(start);
    let endNorm = normalize(end);
    if (startNorm > endNorm) [startNorm, endNorm] = [endNorm, startNorm];

    // 生成日期数组
    const dates = [];
    let current = new Date(startNorm);
    while (current <= endNorm) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1); // 自动处理跨月/年
    }

    return dates;
}

export const getFileType = (filename) => {
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
    }else if(pptExtensions.includes(extension)){
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

// 数字保留2位小数 -- 输出数字类型
export const formatToNumber = (value, decimalPlaces = 2) => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
}

// 保留2位小数
export const formatToFixed = (value, decimalPlaces = 2) => {
    // const num = parseFloat(value);
    // if (isNaN(num) || num < 0) return "0.00";
    //
    // let str = num.toFixed(decimalPlaces);
    // // 确保小数点后有两位
    // if (!str.includes('.')) str += '.';
    // str += '0'.repeat(decimalPlaces).slice(-decimalPlaces);
    // return str.replace(/(\.\d{2})\d*/, '$1');
    const num = parseFloat(value);
    if (isNaN(num)) return `0.${'0'.repeat(decimalPlaces)}`;

    return num.toLocaleString('fullwide', {
        useGrouping: false,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    });
}

//商品单价优惠情况文字
export const goodsPriceDiscountsText = (goods) => {
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
    } else if (Number(price.value) < Number(guide_price)) {
        const total = (Number(guide_price) - Number(price.value)) * goods.num
        return {
            class: 'discount',
            text: '优惠' + formatThousands(formatToFixed(total))
        }
    } else {
        return {
            class: '',
            text: ''
        }
    }
}

// 是否显示隐藏
export const isFieldShowHide = (field_auth, field_key) => {
    return !(field_auth.length && field_auth.find(find => (find.field_key == field_key && find.field_auth == 3)))
}

// 是否只读
export const isFieldDisabled = (field_auth, field_key) => {
    return field_auth.length && field_auth.find(find => (find.field_key == field_key && find.field_auth == 1)) ? true : false
}

// 获取判断按钮权限
export const getButtonPermissions = (button, permission_type, route_name) => {
    let route;
    if (!route_name) {
        if (!routerInstance) {
            console.log('路由器实例未初始化。请先调用initRouter函数。');
        }
        route = routerInstance.currentRoute;
        permission_type = permission_type || route.meta?.permission_type;
        route_name = route_name || route.name;
    }
    let state = JSON.parse(localStorage.getItem("vuex"))
    let userModulePermissions = state.userModulePermissions;
    if (permission_type) {
        let current_module = userModulePermissions.find(item => item.name_en == permission_type)
        let current_route = current_module.children.find(item => item.name_en == route_name)
        // 防止当没有button_list时会报错
        return (current_route?.button_list || []).some(find => find.indexOf(button) > -1)
    } else {
        return false
    }
}

//合并数组并去重
export const mergeArrays = (a, b) => {
    const merged = [...b]; // 复制 b 数组
    const idSet = new Set(b.map(item => item.id)); // 创建 b 中所有 id 的集合

    // 遍历 a 数组，将不存在于 b 中的项添加到 merged
    a.forEach(item => {
        if (!idSet.has(item.id)) {
            merged.push(item);
        }
    });

    return merged;
}

//获取路由对应的图标
export const getRouteIcon = (route_name) => {
    const routeObj = {
        'DepartmentPersonnel': 'https://download.hecoos.com/enlightv/2025-51/7ffc61b892570334de4ae00b6a1d798b.png',
        'DimissionManage': 'https://download.hecoos.com/enlightv/2025-51/0cec85ed8d37f77779136b83d3e62421.png',
        'Attendance': 'https://download.hecoos.com/enlightv/2025-51/2ce35a88a49909367e51aed9bd169568.png',
        'CustomerHighSeas': 'https://download.hecoos.com/enlightv/2025-13/53d953953f37e9954ed7727271990ca4.png',
        'CustomerHighSeasDetail': 'https://download.hecoos.com/enlightv/2025-13/7b5c942da750fd052c95b9badf14dcae.png',
        'CustomerPrivateSeas': 'https://download.hecoos.com/enlightv/2025-51/4e2508ea59bebd23d219625a3ef43b8f.png',
        'CustomerPrivateSeasDetail': 'https://download.hecoos.com/enlightv/2025-13/68cdc0ef908ad3c105eaba75c763ca5f.png',
        'Project': 'https://download.hecoos.com/enlightv/2025-51/639ae82883e3d00a5bef44ad005e1941.png',
        'BusinessDetail': 'https://download.hecoos.com/enlightv/2025-13/3354c3ad7a728ee0ccaa52db912c74a4.png',
        'QuotationDetails': 'https://download.hecoos.com/enlightv/2025-13/78e02834a69620a926568a7ccb2fc286.png',
        'WarehouseManagement': 'https://download.hecoos.com/enlightv/2025-51/b188ae74b91547230bbab3b13736d2b9.png',
        'printCode': 'https://download.hecoos.com/enlightv/2025-51/b188ae74b91547230bbab3b13736d2b9.png',
        'EnterpriseSetup': 'https://download.hecoos.com/enlightv/2025-13/ccf1f033d8cbe90bb84d1c682d21f7aa.png',
        'OutWarehouseManagement': 'https://download.hecoos.com/enlightv/2025-13/97dee74119ea87cd4447c1167b7abcfb.png',
        'Purchase': 'https://download.hecoos.com/enlightv/2025-51/d40128daa85378514d8b83da42826dca.png',
        'InWarehouseManagement': 'https://download.hecoos.com/enlightv/2025-13/e8f5f62673a8fec3405d1b8f365a13fb.png',
        'InWarehouseAdd': 'https://download.hecoos.com/enlightv/2025-13/bc52c734defc47e681225e0c1319906a.png',
        'OutWarehouseAdd': 'https://download.hecoos.com/enlightv/2025-13/1e02cea5eb65e3c5f17716b84c2963ab.png',
        'WeChatTicket': 'https://download.hecoos.com/enlightv/2025-13/5bec2b01b99cec199a2c045406ddacc3.png',
        'Order': 'https://download.hecoos.com/enlightv/2025-51/1d384467b0163952184a8d031b13e02a.png',
        'OrderDetail': 'https://download.hecoos.com/enlightv/2025-13/4c7d4c4282cf70cf60cb13eac17407fa.png',
        'Commission': 'https://download.hecoos.com/enlightv/2025-51/7d520e8437fccba7abc5472a2ae38746.png',
        'CommissionedOrder':'https://download.hecoos.com/enlightv/2025-51/7d520e8437fccba7abc5472a2ae38746.png',
        'CommissionReviewList':'https://download.hecoos.com/enlightv/2025-51/7d520e8437fccba7abc5472a2ae38746.png',
        'CommissionApply': 'https://download.hecoos.com/enlightv/2025-51/7d520e8437fccba7abc5472a2ae38746.png',
        'CommissionReview': 'https://download.hecoos.com/enlightv/2025-51/7d520e8437fccba7abc5472a2ae38746.png',
        'CommissionDetail': 'https://download.hecoos.com/enlightv/2025-51/7d520e8437fccba7abc5472a2ae38746.png',
        'CommissionSummary': 'https://download.hecoos.com/enlightv/2025-51/7d520e8437fccba7abc5472a2ae38746.png',
        'HistoryCommissionDetail': 'https://download.hecoos.com/enlightv/2025-51/7d520e8437fccba7abc5472a2ae38746.png',
        'WorkOrder': 'https://download.hecoos.com/enlightv/2025-51/a2eae000d21ef9bb80f135622535ad22.png',
        'WorkOrderDetail': 'https://download.hecoos.com/enlightv/2025-13/3fb5040ef5c773124ba9e9a7888491e7.png',
        'WeChatRole': 'https://download.hecoos.com/enlightv/2025-13/1949d68812757c7ee28af1f6a3e668b7.png',
        'InvoiceManage': 'https://download.hecoos.com/enlightv/2025-13/129b125d535ae4aea702798625b451e3.png',
        'ProjectManagement': 'https://download.hecoos.com/enlightv/2025-51/fc014d0f0208fd720328020495d08bc1.png',
        'ProjectDetail': 'https://download.hecoos.com/enlightv/2025-13/6cf519194c406b101d4a46176ecd1ef5.png',
        'PayableManage': 'https://download.hecoos.com/enlightv/2025-51/9adb99ca1ad6daaa0de45757eaf7d9a3.png',
        'ReceivableManage': 'https://download.hecoos.com/enlightv/2025-13/bf741ad0e40d5332eb9464267ab6fa0f.png',
        'ProductShelves': 'https://download.hecoos.com/enlightv/2025-13/b0e8017e1677180b5f6b4b562868b698.png',
        'WeChatIndex': 'https://download.hecoos.com/enlightv/2025-13/33ec9653cbf489048ddc5aa9b0994d72.png',
        'WorkOrderAdd': 'https://download.hecoos.com/enlightv/2025-13/87769293deaf8f9af083326c016d2606.png',
        'WorkOrderAddAgain': 'https://download.hecoos.com/enlightv/2025-13/87769293deaf8f9af083326c016d2606.png',
        'QuotationAdd': 'https://download.hecoos.com/enlightv/2025-13/cc935e8a3e6624e59566f6484fb51254.png',
        'approveAdd': 'https://download.hecoos.com/enlightv/2025-13/cfd543d0e860a9bb8a4a867125d7c4c3.png',
        'ImportRoster': 'https://download.hecoos.com/enlightv/2025-13/a3e3667da5a8ef2afdf68af9df36a154.png',
        'ProductShelvesAdd': 'https://download.hecoos.com/enlightv/2025-13/f98c651211f59c8175a8ad400d1e5aef.png',
        'InWarehouseAudit': 'https://download.hecoos.com/enlightv/2025-13/3ca2f6f1d6951143ae1cf33b72d5b44d.png',
        'OutWarehouseAudit': 'https://download.hecoos.com/enlightv/2025-13/7dab872b3103a872cc023551d8916298.png',
        'WorkBench': 'https://download.hecoos.com/enlightv/2025-13/228875ce71dad187eea571e471a1bc36.png',
        'Message': 'https://download.hecoos.com/enlightv/2025-13/6cac42885bc570c190df2b4f8e8d8ba0.png',
        'Approve': 'https://download.hecoos.com/enlightv/2025-13/8f1919f7b0f6f28f1694d411de44d58e.png',
        "HolidayBalanceImport": "https://download.hecoos.com/enlightv/2025-13/a3e3667da5a8ef2afdf68af9df36a154.png",
        "WarehouseImport": "https://download.hecoos.com/enlightv/2025-13/a3e3667da5a8ef2afdf68af9df36a154.png",
        "MCustomerSeas": "https://download.hecoos.com/enlightv/2025-51/4e2508ea59bebd23d219625a3ef43b8f.png",
        "Business": "https://download.hecoos.com/enlightv/2025-51/639ae82883e3d00a5bef44ad005e1941.png",
        "InventoryManagement": "https://download.hecoos.com/enlightv/2025-51/b188ae74b91547230bbab3b13736d2b9.png",
        "FinanceManagement": "https://download.hecoos.com/enlightv/2025-51/9adb99ca1ad6daaa0de45757eaf7d9a3.png",
        "mobileClockIn": "https://download.hecoos.com/enlightv/2025-51/2ce35a88a49909367e51aed9bd169568.png",
        "VersionHistory": "https://download.hecoos.com/enlightv/2025-14/bf962d50e2a91153f8591cf6546391ae.png",
        "HelpCenter": "https://download.hecoos.com/enlightv/2025-14/07e29f985a2506b84ed56ad6cdbb975f.png",
        "QuotationTemplateEdit": "https://download.hecoos.com/enlightv/2025-15/c5ff869052d570a45a861aa95e551242.png",
        'CodeManagement': 'https://download.hecoos.com/enlightv/2025-51/d456e50bf5e43a900d1af3ee1ea26e0a.png',
        "Daily": "https://download.hecoos.com/enlightv/2025-51/a8894c6119e8eec49bce675c2e4e6e19.png",
        "AssetManagement": "https://download.hecoos.com/enlightv/2025-51/d2b876949b2e4811b80e0c977b8ea5bf.png",
        "PersonalAssets": "https://download.hecoos.com/enlightv/2025-23/8426b9c593aec9994907940a7bc60b05.png",
        "Notice": "https://download.hecoos.com/enlightv/2025-51/7f9eb00b7041f364670dcf7521b083f4.png",
        "announcement": "https://download.hecoos.com/enlightv/2025-51/7f9eb00b7041f364670dcf7521b083f4.png",
        "NoticeAdd": "https://download.hecoos.com/enlightv/2025-51/7f9eb00b7041f364670dcf7521b083f4.png",
        "mobileWorkBench": "https://download.hecoos.com/enlightv/2025-25/a42de4dbe343aecf12f63a1be3b9825d.png",
        "mobileAllFunctions": "https://download.hecoos.com/enlightv/2025-25/27a71584eb7e70923813e8b96e6963cb.png",
        "AdminPermission": "https://download.hecoos.com/enlightv/2025-25/13b2dc4b8ec631154126c494c6e9fc70.png",
        "ReimbursementManage": "https://download.hecoos.com/enlightv/2025-51/3ffca46a24bf0ac2a80f69c2208de675.png",
        "ReimbursementStatistics": "https://download.hecoos.com/enlightv/2025-51/3ffca46a24bf0ac2a80f69c2208de675.png",
        "KnowledgeBase": "https://download.hecoos.com/enlightv/2025-51/c5458ec2826cebeee6b2d0fdc4dab32c.png",
        "KnowledgeBaseDetails": "https://download.hecoos.com/enlightv/2025-51/c5458ec2826cebeee6b2d0fdc4dab32c.png",
        "ModulePermission":"https://download.hecoos.com/enlightv/2025-13/8e3028f4b0dc724dda2a0b7fe593b10a.png",
        "contract":"https://download.hecoos.com/enlightv/2025-41/7f505c5bdcd1bd15e119e57a354bda19.png",
        "contractDetail":"https://download.hecoos.com/enlightv/2025-41/7f505c5bdcd1bd15e119e57a354bda19.png",
        "AttendanceReportSettings": "https://download.hecoos.com/enlightv/2025-26/b96dd70ddc5bf4a43b2961cc9364f335.png",
        'AttendanceAdminManagement': 'https://download.hecoos.com/enlightv/2025-51/2ce35a88a49909367e51aed9bd169568.png',
        'SalesStatistics': 'https://download.hecoos.com/enlightv/2025-30/54e8b8d4111d6998218c2dabf9ae3f05.png',
        'dataDetails':'https://download.hecoos.com/enlightv/2025-30/54e8b8d4111d6998218c2dabf9ae3f05.png',
        'CustomChartDetails': 'https://download.hecoos.com/enlightv/2025-30/54e8b8d4111d6998218c2dabf9ae3f05.png',
        'AdminSalesStatistics': 'https://download.hecoos.com/enlightv/2025-30/54e8b8d4111d6998218c2dabf9ae3f05.png',
        'adminSalesDetails': 'https://download.hecoos.com/enlightv/2025-30/54e8b8d4111d6998218c2dabf9ae3f05.png',
        'salesTargetSetting': 'https://download.hecoos.com/enlightv/2025-30/54e8b8d4111d6998218c2dabf9ae3f05.png',
        'customizeChartSettings': 'https://download.hecoos.com/enlightv/2025-30/54e8b8d4111d6998218c2dabf9ae3f05.png',
        'contractAdminManagement': 'https://download.hecoos.com/enlightv/2025-41/7f505c5bdcd1bd15e119e57a354bda19.png',
        'contractFill': 'https://download.hecoos.com/enlightv/2025-41/7f505c5bdcd1bd15e119e57a354bda19.png',
        "InventoryStatistics":"https://download.hecoos.com/enlightv/2025-37/c74609bd30c50b436a9d363e8fa0a33c.png",
        "ProductionManagement":"https://download.hecoos.com/enlightv/2025-37/8c5712553c4bf6b06972b9a65eb553f2.png",
        "ExecuteProduction":"https://download.hecoos.com/enlightv/2025-37/7e47d1abb619f7980863de7a918036d3.png",
        "SelfProduction":"https://download.hecoos.com/enlightv/2025-37/167a206a225cde0a0c87fbf7313ee4c9.png",
        "ShipmentManagement":"https://download.hecoos.com/enlightv/2025-37/7e47d1abb619f7980863de7a918036d3.png",
        "ShipmentAdd":"https://download.hecoos.com/enlightv/2025-37/7e47d1abb619f7980863de7a918036d3.png",
        "ShipmentDetail":"https://download.hecoos.com/enlightv/2025-37/7e47d1abb619f7980863de7a918036d3.png",
        "ExecuteDisassemble":"https://download.hecoos.com/enlightv/2025-44/cf1effd2e7d98e6b357603061260c6d5.svg",
        "ExecuteDisassembleOrder":"https://download.hecoos.com/enlightv/2025-44/cf1effd2e7d98e6b357603061260c6d5.svg",
        'preinstallProject': 'https://download.hecoos.com/enlightv/2025-13/b0e8017e1677180b5f6b4b562868b698.png',
        'ImportProducts': 'https://download.hecoos.com/enlightv/2025-13/b0e8017e1677180b5f6b4b562868b698.png',
        'BatchList': 'https://download.hecoos.com/enlightv/2025-13/b0e8017e1677180b5f6b4b562868b698.png',
        'ManageInventory':'https://download.hecoos.com/enlightv/2025-44/2810a5003eb0460c23364a89c52a9b52.png',
        'ManageInventoryAdminManagement':'https://download.hecoos.com/enlightv/2025-44/2810a5003eb0460c23364a89c52a9b52.png',
        "AttendanceConfirmDetail": "https://download.hecoos.com/enlightv/2025-36/24eef748d7eca43ec36a1a4bafc767b4.png",
        "PersonalAttendance": "https://download.hecoos.com/enlightv/2025-36/c35df27944fd02326049712264474892.png",
         "SupplierManagement":"https://download.hecoos.com/enlightv/2025-47/fdb2327e3a8af00018caaa43a0142e43.png",
        "SupplierManagementDetail":"https://download.hecoos.com/enlightv/2025-48/32ec920968f8069c49df6405f61ade72.png",
        "Performance": "https://download.hecoos.com/enlightv/2025-43/dc16b2e6d9d622e74b134517a27065a1.png",
        'PersonalPerformance':'https://download.hecoos.com/enlightv/2025-43/3cc7b94053b139b14e68e6422a8069e8.png',
        'Todo':'https://download.hecoos.com/enlightv/2025-43/df0e65ea95b4b93d72e711e066b8ddf2.png',
        "AssessmentTemplate":"https://download.hecoos.com/enlightv/2025-43/dc16b2e6d9d622e74b134517a27065a1.png",
        "PerformanceAdminManagement":"https://download.hecoos.com/enlightv/2025-43/dc16b2e6d9d622e74b134517a27065a1.png",
        "DailyAdd": "https://download.hecoos.com/enlightv/2025-51/a8894c6119e8eec49bce675c2e4e6e19.png",
        "importContract": 'https://download.hecoos.com/enlightv/2025-13/a3e3667da5a8ef2afdf68af9df36a154.png',
        "HistoryTodo": 'https://download.hecoos.com/enlightv/2025-50/9e0cd4a62fab713310ab1811807ec3ef.png',
        "mobileTodo": "https://download.hecoos.com/enlightv/2025-43/df0e65ea95b4b93d72e711e066b8ddf2.png"
    }
    const defaultIcon = 'https://download.hecoos.com/enlightv/2025-13/69c8c175d80d6ba37d8bc672b3669bc8.png'
    return routeObj[route_name] ? routeObj[route_name] : defaultIcon
}

export const getProcessButtonList = (userModulePermissions) => {
    // 初始化 button_list 数组
    let button_list = [];
    // 遍历 userModulePermissions 数组
    if (Array.isArray(userModulePermissions)) {
        userModulePermissions.forEach((item) => {
            if (item.children && item.has_permission) {
                item.children.forEach((child) => {
                    if (child.has_permission && child.button_list) {
                        button_list = button_list.concat(child.button_list)
                    }
                });
            }
        });
    }
    return button_list
}

//发票信息比对
export const isInvoiceMatched = (invoice, compareList) => {
    // 存储错误字段
    let errorFields = [];
    let isMatched = false;

    // if(!compareList.find(find => find.purchaser_name == invoice.purchaser_name)){
    //   errorFields.push('purchaser_name');
    // }else{
    //   errorFields = errorFields.filter(item => item !== "purchaser_name")
    // }
    // if(!compareList.find(find => find.purchaser_tax_number.replace(/[^\w\u4e00-\u9fa5]/g, '') == invoice.purchaser_tax_number.replace(/[^\w\u4e00-\u9fa5]/g, ''))){
    //   errorFields.push('purchaser_tax_number');
    // }else{
    //   errorFields = errorFields.filter(item => item !== "purchaser_tax_number")
    // }
    // if(invoice.hasOwnProperty('purchaser_contact_info') && !compareList.find(find => find.purchaser_contact_info.replace(/[^\w\u4e00-\u9fa5]/g, '') == invoice.purchaser_contact_info.replace(/[^\w\u4e00-\u9fa5]/g, ''))){
    //   errorFields.push('purchaser_contact_info');
    // }else{
    //   errorFields = errorFields.filter(item => item !== "purchaser_contact_info")
    // }
    // if(invoice.hasOwnProperty('purchaser_bank_account_info') && !compareList.find(find => find.purchaser_bank_account_info.replace(/[^\w\u4e00-\u9fa5]/g, '') == invoice.purchaser_bank_account_info.replace(/[^\w\u4e00-\u9fa5]/g, ''))){
    //   errorFields.push('purchaser_bank_account_info');
    // }else{
    //   errorFields = errorFields.filter(item => item !== "purchaser_bank_account_info")
    // }
    // if (errorFields.length === 0) {
    //    isMatched = true;
    // }
    // // 遍历比对列表
    for (const compareInfo of compareList) {
      // 重置错误字段数组
      errorFields = [];
      // 检查 purchaser_name 和 purchaser_tax_number 是否匹配
      if (invoice.purchaser_name !== compareInfo.purchaser_name && !isMatched) {
            errorFields.push('purchaser_name');
        }
        if (invoice.purchaser_tax_number !== compareInfo.purchaser_tax_number && invoice.purchaser_tax_number.replace(/[^\w\u4e00-\u9fa5]/g, '') !== compareInfo.purchaser_tax_number.replace(/[^\w\u4e00-\u9fa5]/g, '') && !isMatched) {
            errorFields.push('purchaser_tax_number');
        }
        // 检查 purchaser_contact_info 是否匹配（可以为空或不存在）
        if (invoice.hasOwnProperty('purchaser_contact_info') && invoice.purchaser_contact_info && invoice.purchaser_contact_info.replace(/[^\w\u4e00-\u9fa5]/g, '') !== compareInfo.purchaser_contact_info.replace(/[^\w\u4e00-\u9fa5]/g, '')&& !isMatched) {
            errorFields.push('purchaser_contact_info');
        }
        // 检查 purchaser_bank_account_info 是否匹配（可以为空或不存在）
        if (invoice.hasOwnProperty('purchaser_bank_account_info') && invoice.purchaser_bank_account_info && invoice.purchaser_bank_account_info.replace(/[^\w\u4e00-\u9fa5]/g, '') !== compareInfo.purchaser_bank_account_info.replace(/[^\w\u4e00-\u9fa5]/g, '')&& !isMatched) {
            errorFields.push('purchaser_bank_account_info');
        }
        // 如果没有错误字段，说明匹配成功
        if (errorFields.length === 0) {
            isMatched = true;
            break; // 找到匹配后，停止进一步检查
        }
    }
    // 返回包含匹配结果和错误字段的对象
    return {
        isMatched: isMatched,
        errorFields: errorFields,
    };
};

/**
 * 计算表格高度（适用于 el-dialog 中的 el-table）
 * @param {HTMLElement} containerEl - 容器元素（通常是 this.$el）
 * @param {number} [vhRatio=0.8] - 视口高度比例（默认 80vh）
 * @param {number} [minHeight=100] - 最小高度（默认 100px）
 * @param {number} [extraPadding=98] - 额外的内边距/边距 + 搜索盒子（默认 98px）
 * @returns {number} 计算后的表格高度（向下取整的整数）
 */
export const calculateTableHeight = (
    containerEl,
    vhRatio = 0.8,
    minHeight = 100,
    extraPadding = 98
) => {
    if (!containerEl) return minHeight;
    const vh = window.innerHeight * vhRatio;
    const headerHeight = containerEl.querySelector('.el-dialog__header')?.clientHeight || 0;
    const footerHeight = containerEl.querySelector('.el-dialog__footer')?.clientHeight || 52;
    const paginationHeight = containerEl.querySelector('.el-pagination')?.clientHeight || 0;
    return Math.floor(
        Math.max(minHeight, vh - headerHeight - footerHeight - extraPadding - paginationHeight)
    );
};

/**
 * VxeTable固定列高度同步工具
 * @param {Object} options 配置选项
 * @param {Object} options.tableRef 表格ref对象
 * @param {Number} [options.debounceTime=30] 防抖时间(ms)
 * @returns {Object} 返回包含init和destroy方法的对象
 */
export const vxeTableHeightSync = (options = {}) => {
    const { tableRef, debounceTime = 30 } = options
    if (!tableRef) {
        console.error('vxeTableHeightSync: tableRef is required')
        return
    }

    // 防抖处理的高度同步方法
    const syncHeights = _.debounce(() => {
        try {
            const tableEl = tableRef.value?.$el || tableRef.$el
            if (!tableEl) return

            const mainRows = tableEl.querySelectorAll('.vxe-table--main-wrapper .vxe-body--row')
            const fixedLeftRows = tableEl.querySelectorAll('.vxe-table--fixed-left-wrapper .vxe-body--row')
            const fixedRightRows = tableEl.querySelectorAll('.vxe-table--fixed-right-wrapper .vxe-body--row')

            mainRows.forEach((row, index) => {
                const height = `${row.offsetHeight}px`
                // 同步主表格行高（防止某些情况下不一致）
                row.style.height = height

                // 同步左侧固定列
                if (fixedLeftRows[index]) {
                    fixedLeftRows[index].style.height = height
                }

                // 同步右侧固定列
                if (fixedRightRows[index]) {
                    fixedRightRows[index].style.height = height
                }
            })
        } catch (error) {
            console.error('vxeTableHeightSync error:', error)
        }
    }, debounceTime)

    // 初始化滚动监听
    const initScrollListener = () => {
        const tableEl = tableRef.value?.$el || tableRef.$el
        if (!tableEl) return

        const scrollWrapper = tableEl.querySelector('.vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--body-inner-wrapper')

        if (scrollWrapper) {
            scrollWrapper.addEventListener('scroll', syncHeights, { passive: true })
        }
    }

    // 销毁监听
    const destroy = () => {
        const tableEl = tableRef.value?.$el || tableRef.$el
        if (!tableEl) return

        const scrollWrapper = tableEl.querySelector('.vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--body-inner-wrapper')

        if (scrollWrapper) {
            scrollWrapper.removeEventListener('scroll', syncHeights)
        }
    }

    // 初始同步
    const init = () => {
        initScrollListener()
        syncHeights() // 立即执行一次
    }

    return {
        init,
        destroy,
        sync: syncHeights // 暴露手动同步方法
    }
}

// 获取除了标签之外的纯文本字符长度
export const getPlainTextLength = (html) => {
    // 替换HTML标签和特殊字符
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').length
}

// 处理 HTML 格式的换行压缩，出现多个换行的时候最多保留2个换行
export const limitLineBreaksWithHtml = (html) => {
    // 匹配 3 个及以上连续 \n
    let processedText = html.replace(/\n{3,}/g, '\n\n');

    // 匹配 3 个及以上连续 <br> 或 <div><br></div>
    processedText = processedText.replace(/(<br\s*\/?>){3,}/gi, '<br><br>'); // 压缩 <br> 换行
    processedText = processedText.replace(/(<div>\s*<br\s*\/?>\s*<\/div>){3,}/gi, '$1$1'); // 压缩块级换行
    processedText = processedText.replace(/(<p>\s*<br\s*\/?>\s*<\/p>){3,}/gi, '$1$1'); // 压缩块级换行

    // 新增：移除空的div标签
    processedText = processedText.replace(/<div>\s*<\/div>/gi, '');

    // 新增：移除多余的换行符
    processedText = processedText.replace(/\n\s*\n/g, '\n\n');

    return processedText
}

// 获取富文本字符串中是否包含img标签和video标签
export const containsMediaTags = (html) => {
    // 创建虚拟DOM元素
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 检查是否存在img或video标签
    const containsImg = doc.querySelector('img') !== null;
    const containsVideo = doc.querySelector('video') !== null;

    return { containsImg, containsVideo };
}

/**
 * 获取月份的开始和结束时间（兼容iOS）
 * @param {Date|string|number} [date] - 可选，指定日期/时间戳/日期字符串（默认当前时间）
 * @returns {Object} 包含start和end属性的对象
 */
export const getMonthRange = (date) => {
    // 安全解析日期（兼容iOS）
    const safeDate = parseDateForIOS(date || new Date());
    // const safeDate = new Date()

    if (isNaN(safeDate.getTime())) {
        throw new Error('Invalid date provided');
    }

    // 获取月份开始时间（当月第一天 00:00:00）
    const start = new Date(safeDate.getFullYear(), safeDate.getMonth(), 1);

    // 获取月份结束时间（当月最后一天 23:59:59.999）
    const end = new Date(safeDate.getFullYear(), safeDate.getMonth() + 1, 0, 23, 59, 59, 999);

    // return {
    //     start,
    //     end,
    //     startISO: start.toISOString(),
    //     endISO: end.toISOString()
    // };
    return [formatDate(start, 'date'), formatDate(end, 'date')]
}

/**
 * 安全解析日期（兼容iOS的特殊处理）
 * @param {Date|string|number} dateInput
 * @returns {Date}
 */
function parseDateForIOS(dateInput) {
    // 如果已经是Date对象，直接返回
    if (dateInput instanceof Date) {
        return dateInput;
    }

    // 如果是时间戳
    if (typeof dateInput === 'number') {
        return new Date(dateInput);
    }

    // 如果是字符串
    if (typeof dateInput === 'string') {
        // iOS特殊处理：替换空格为T并添加Z时区标识
        const isoString = dateInput.trim()
            .replace(' ', 'T')  // 替换空格为T
            .replace(/(\d{4}-\d{2}-\d{2})$/, '$1T00:00:00') // 如果只有日期部分，补充时间
            + (dateInput.includes('Z') ? '' : 'Z'); // 如果没有Z时区标识，添加Z

        return new Date(isoString);
    }

    // 其他情况尝试直接创建Date对象
    return new Date(dateInput);
}

export const buildRedirectUrl = (params) => {
    if (!params.redirect){return  ''}

    const url = new URL(params.redirect, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
        if (key !== "redirect" && value != null) {
            url.searchParams.set(key, String(value));
        }
    });
    return url.pathname + url.search;
}
// 数值转千分位
export const  formatThousands=(num)=>{
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
/**
 * 将 html2canvas 生成的 canvas 导出为分页 PDF
 * @param {HTMLCanvasElement} canvas 源 canvas
 * @param {string} filename 导出的 PDF 文件名
 * @param {Object} margins 页边距，单位 pt
 * @param {number} margins.top    上边距
 * @param {number} margins.left   左边距
 * @param {number} margins.right  右边距
 * @param {number} margins.bottom 下边距
 * @param {boolean} autoSave 是否自动保存，默认 true
 * @returns {jsPDF} 返回 pdf 对象
 */
export const exportCanvasToPdf = (
  canvas,
  filename = "document.pdf",
  margins = { top: 40, left: 40, right: 40, bottom: 40 },
  autoSave = true
) => {
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const { top: marginTop = 0, left: marginLeft = 0, right: marginRight = 0, bottom: marginBottom = 0 } = margins;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const contentHeight = pageHeight - marginTop - marginBottom;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  // px -> pt 缩放比例
  const pxToPt = contentWidth / canvasWidth;
  // 每页在源 canvas 对应的像素高度
  const pageHeightPx = Math.floor(contentHeight / pxToPt);
  // 总页数
  const totalPages = Math.ceil(canvasHeight / pageHeightPx);
  // 复用临时 canvas
  const pageCanvas = document.createElement("canvas");
  pageCanvas.width = canvasWidth;
  const ctx = pageCanvas.getContext("2d");
  for (let page = 0; page < totalPages; page++) {
    const yStart = page * pageHeightPx;
    const hPx = Math.min(pageHeightPx, canvasHeight - yStart);
    pageCanvas.height = hPx;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, yStart, canvasWidth, hPx, 0, 0, canvasWidth, hPx);

    const imgData = pageCanvas.toDataURL("image/png");
    const imgHeightPt = hPx * pxToPt;
    if (page > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", marginLeft, marginTop, contentWidth, imgHeightPt);
  }
  if (autoSave) {
    pdf.save(filename);
  }
  return pdf;
}

/**
 * 将 wangEditor HTML 转成 Word 并下载
 * @param {string} htmlContent - wangEditor HTML
 * @param {string} fileName - 导出文件名
 */
export const exportWordFromEditor=(htmlContent, fileName = "document.docx")=>{
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    function processNode(node) {
        if (node.nodeType === 3) return node.textContent; // 文本节点
        let content = Array.from(node.childNodes).map(processNode).join("");
        if (node.nodeType !== 1) return content;
        // 图片处理
        if (node.tagName === "IMG") {
            const src = node.getAttribute("src") || "";
            const style = node.getAttribute("style") || "";
            // 尝试从 style 提取 px 数值
            let widthMatch = style.match(/width\s*:\s*([\d.]+)px/);
            let heightMatch = style.match(/height\s*:\s*([\d.]+)px/);
            const width = widthMatch ? widthMatch[1] : node.getAttribute("width") || 300;
            const height = heightMatch ? heightMatch[1] : node.getAttribute("height") || "auto";
            // 用 HTML 属性控制尺寸，style 用于额外样式，不写 width/height
            const imgHtml = `<img src="${src}" width="${width}" height="${height}" style="display:block; max-width:600px;" />`;
            return imgHtml;
        }
        // 处理自定义控件 data-control-extend
        const extendAttr = node.getAttribute("data-control-extend");
        if (extendAttr) {
            try {
            let extend = JSON.parse(extendAttr);
            // 兼容 extend 是对象或数组
            const getValue = (key) => {
                if (Array.isArray(extend)) {
                return extend.find(e => e.key === key)?.value;
                } else if (typeof extend === "object") {
                return extend[key];
                }
                return null;
            };
            // 字体
            const fontFamily = getValue("fontFamily");
            if (fontFamily) content = `<span style="font-family:${fontFamily}">${content}</span>`;
            // 字号
            const fontSize = getValue("fontSize");
            if (fontSize) {
                const ptSize = Math.ceil(fontSize * 0.857);
                content = `<span style="font-size:${ptSize}pt">${content}</span>`
            };
            // 样式：加粗 / 斜体 / 下划线
            const fontStyle = getValue("fontStyle");
            if (fontStyle === "italic") content = `<i>${content}</i>`;
            // const underline = getValue("underline");
            // if (!underline) content = `<u>${content}</u>`;
            const bold = getValue("bold");
            if (bold) content = `<b>${content}</b>`;
            // 颜色
            const fontColor = getValue("fontColor");
            if (fontColor) content = `<span style="color:${fontColor}">${content}</span>`;
            } catch (e) {
            console.warn("解析 data-control-extend 失败", e, node);
            }
        }
        // 表格
        // 处理表格
        if (node.tagName === "TABLE") return processTable(node);
        // 保留原标签
        return `<${node.tagName.toLowerCase()}>${content}</${node.tagName.toLowerCase()}>`;
    }
    function processTable(tableNode) {
        const rows = Array.from(tableNode.rows).map((tr) => {
            const cells = Array.from(tr.cells).map((td) => {
            // 保留跨列跨行
            const colspan = td.getAttribute("colspan") || "";
            const rowspan = td.getAttribute("rowspan") || "";
            // 递归处理 td 内部内容
            const cellContent = Array.from(td.childNodes).map(processNode).join("");
            let attrs = "";
            if (colspan) attrs += ` colspan="${colspan}"`;
            if (rowspan) attrs += ` rowspan="${rowspan}"`;
            // 保留 td 边框
            return `<td style="border:1px solid #000; padding:2px"${attrs}>${cellContent}</td>`;
            }).join("");
            return `<tr>${cells}</tr>`;
        }).join("");
        return `<table style="border-collapse:collapse; width:100%">${rows}</table>`;
    }
    const processedHtml = Array.from(doc.body.childNodes)
        .map(processNode)
        .join("");
    const blob = htmlDocx.asBlob(processedHtml);
    return blob;
}

export const reimbursement_status_text = (status) =>{
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
// 采购，应收
export const ProcurementReceivables = (business_fields) => {
    let text = "";
    if (business_fields.controls == 'purchase') {
        // 采购
        switch (business_fields.purchase_status) {
            case 2:
                text = "申请作废";
                break;
            case 4:
                text = "已发起部分采购";
                break;
            case 5:
                text = "已发起采购";
                break;
        }
    } else if (business_fields.controls == 'pay') {
        // 应收
         // 采购
        switch (business_fields.pay_status) {
            case 3:
                text = "付款取消";
                break;
            case 4:
                text = "已部分付款";
                break;
            case 2:
                text = "已付款";
                break;
        }
    }
    return text;
}
//表单校验
export const deepFormValidate = (name, that) => {
    return new Promise(function (resolve, reject) {
        if (that.$refs[name]) {
            if (Array.isArray(that.$refs[name])) {
                that.$refs[name][0].validate().then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            } else {
                that.$refs[name].validate().then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            }
        } else {
            resolve()
        }
    })
}

// 财务支付文本获取
export const financialPaymentMethodText = (value) => {
    let text = "";
    switch (value) {
        case 1:
            text = "电汇";
            break;
        case 2:
            text = "微信";
            break;
        case 3:
            text = "支付宝";
            break;
        case 4:
            text = "现金";
            break;
        case 5:
            text = "银行承兑";
            break;
        case 6:
            text = "商业承兑";
            break;
        case 7:
            text = "支票";
            break;
    }
    return text;
}
// 财务支付列表获取
export const financialPaymentMethodList = () => {
    return [
        { text: '电汇', name: "电汇", value: 1 },
        { text: '微信', name: "微信", value: 2 },
        { text: '支付宝', name: "支付宝", value: 3 },
        { text: '现金', name: "现金", value: 4 },
        { text: '银行承兑', name: "银行承兑", value: 5 },
        { text: '商业承兑', name: "商业承兑", value: 6 },
        { text: '支票', name: "支票", value: 7 },
    ];
}

// 数字 1,2,3 转为 一二三
export const numberToChinese = (num) => {
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

/**
 * 判断是否是微信浏览器
 * @returns {boolean} 是否是微信浏览器
 */
export const isWeixin = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') > -1;
};

/**
 * 判断数据是否是对象格式
 * @param value
 * @returns {Boolean}
 */
export const isObject = (value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
// 获取佣金模式
export const commissionModelText = (commissionModel) => {
    switch (commissionModel) {
        case "tiered":
            return "阶梯提成";
        case "order":
            return "按单提成";
        case "order_goods":
            return "按订单产品提成";
        case "fixed_ratio":
            return "固定比例提成";
        case "order_tiered":
            return "按单+阶梯提成";
    }
}
//  获取审核节点名称
export const getTypeText = (type, tail) => {
    const typeMap = {
        'user_apply': '员工发起',
        'user_audit': '部门初审',
        'department_apply': '部门汇总',
        'department_audit': '公司复审',
        'company_apply': '公司汇总',
        'company_audit': '终审'
    }
    const tailObj = {
        'user_apply': '',
        'user_audit': '审核中',
        'department_apply': '汇总中',
        'department_audit': '审核中',
        'company_apply': '汇总中',
        'company_audit': '审核中'
    }
    let returnObj;
    if (tail) {
        // 尾巴
        returnObj = tailObj[type] || ''
    } else {
        // 审核title
        returnObj = typeMap[type] || ''
    }
    return returnObj
}
// 获取提成模式隐藏表格
export const getTableShow = (tableKey, commissionModel) => {
    // console.log(commissionModel, 51900)
    // order_tiered 按单+阶梯
    //  fixed_ratio 固定比例
    // order_goods 按订单产品提成
    // order 按单提成
    // tiered 阶梯提成


    //   单独模式判断
    if (commissionModel == 'tiered') {
        if (tableKey == 'order_repay_price') {
            return true;
        } else if (tableKey == 'commission_amount') {
            return true;
        } else if (tableKey == 'commission_base_amount') {
            return true;
        } else if (tableKey == 'type_base_value') {
            return true;
        } else if (tableKey == 'type_calculate_value') {
            return true;
        } else if (tableKey == 'contribution_base_amount') {
            return true;
        } else if (tableKey == 'commission_base_value') {
            return true;
        } else if (tableKey == 'commission_ratio') {
            return true;
        }
    } else if (commissionModel == 'order') {
        if (tableKey == 'contribution_commission_amount') {
            return true
        } else if (tableKey == 'contribution_commission_amount') {
            return true
        }
    } else if (commissionModel == 'order_goods') {

        if (tableKey == 'contribution_commission_amount') {
            return true
        }
    } else if (commissionModel == 'fixed_ratio') {
        if (tableKey == 'order_repay_price') {
            return true
        } else if (tableKey == 'commission_amount') {
            return true
        } else if (tableKey == 'commission_base_amount') {
            return true
        } else if (tableKey == 'contribution_base_amount') {
            return true
        } else if (tableKey == 'type_base_value') {
            return true
        } else if (tableKey == 'type_calculate_value') {
            return true
        } else if (tableKey == 'commission_ratio') {
            return true;
        } else if (tableKey == 'commission_base_value') {
            return true;
        }
    } else if (commissionModel == 'order_tiered') {
        if (tableKey == 'contribution_commission_amount') {
            return true
        } else if (tableKey == 'type_calculate_value_num') {
            return true
        } else if (tableKey == 'type_base_value_num') {
            return true
        } else if (tableKey == 'type_calculate_value_and_type_base_value') {
            return true
        }
    }

    return false

}
// 获取commissionModel
export const getDetailsCommissionType = (commissionOrders, historicalCommissionOrders) => {
    if (commissionOrders.length > 0) {
        return {
            commission_type: commissionOrders[0].commission_type,
            commission_rule_version: commissionOrders[0].commission_rule_version,

        }
    } else if (historicalCommissionOrders.length > 0) {
        return {
            commission_type: historicalCommissionOrders[0].commission_type,
            commission_rule_version: historicalCommissionOrders[0].commission_rule_version,


        }
    }
    return {

    }
}


export const thousands = {
    inserted: function (el) {
        // 获取input节点
        if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
            el = el.getElementsByTagName('input')[0]
        }

        // 初始化时，格式化值为千分位
        const numberValue = parseFloat(el.value.replace(/,/g, ''))
        if (!isNaN(numberValue)) {
            el.value = numberValue.toLocaleString('zh', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        }

        // 聚焦时转化为数字格式（去除千分位）
        el.onfocus = () => {
            if (!isNaN(parseFloat(el.value.replace(/,/g, '')).toFixed(2))) {
                el.value = parseFloat(el.value.replace(/,/g, '')).toFixed(2)
            }
        }

        // 失去焦点时转化为千分位
        el.onblur = () => {
            const onBlurValue = parseFloat(el.value.replace(/,/g, ''))
            if (!isNaN(onBlurValue)) {
                el.value = onBlurValue.toLocaleString('zh', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        }
        el.oninput = (e) => {
            let value = e.target.value.replace(/-/g, '').replace(/[^\d.]/g, '');
            value = value.replace(/\.{2,}/g, '.');
            value = value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
            if (value.startsWith('.')) {
                value = '0' + value;
            }
            e.target.value = value;
        }
    }
}
export const init_thousand_separator = (numberValue)=>{

    numberValue = Number(numberValue);
    if(!isNaN(numberValue)){
        return numberValue.toLocaleString('zh', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
        })
    }
    return '--'

}
export const num_is_it_less_than_0 = (num) => {
    num = Number(num);
    if(num <0){
        // 负数
        return 'E44144_text'
    }
    return ''
}
// 获取订单样式状态
export const  getOrderStatus = (commission_status, last_audit_status)=> {
      if (last_audit_status == 3) {
        // last_audit_status=3 已拒绝
        return 'commission_status_4';
      } else {
        // commission_status=1 未提成
        // commission_status=2 部分未提
        // commission_status=3 不可提成
        if (commission_status == 1) {
          return 'commission_status_1';
        } else if (commission_status == 2) {
          return 'commission_status_2';
        } else {
          return 'commission_status_3';
        }
      }

    }
// 获取无法提成原因
export const getFreezeTitle = (status)=> {
      switch (status) {
        case 11:
          return '管理员已将订单冻结无法提成，若有问题请联系公司管理员';
        case 12:
          return '离职冻结';
        case 13:
          return '订单回款金额暂未达到提成标准，无法提成';
        case 14:
          return '提成基数为0，无法提成';
        default:
          return '';
      }
    }
/**
 * 数组去重,根据字段去重
 */
export const arrayDuplicate = (array, field) => {
    const result = [];
    const seenIds = {};
    console.log(field, 'field==')

    array.forEach(item => {
        if (!seenIds[item[field]]) {
        seenIds[item[field]] = true;
        result.push(item);
        }
    });
    return result;
}
// 人员组织-员工类型
export const userTypeOptions = () => {
    return [
        {label: '正式员工', value: 1},
        {label: '试用期员工', value: 5},
        {label: '实习生', value: 2},
        {label: '外协支持', value: 3},
        {label: '合作伙伴', value: 4}
    ]
}
export const delOrderContributorNone = (data) => {
    // 去除提成 角色空为题
        if(data.order_contributor){
            data.order_contributor = data.order_contributor.filter((item) => {
                if(item.user_id.value.length>0&&item.contributor_role_id.value){
                return item
                }

            })
        }
      return data
}
// 查询接口
export const findCustomSetting = async (id) => {
  const { getUserCustomFormTitle } = await import('@/api')
  return new Promise(resolve => {
      getUserCustomFormTitle({ route: id }).then(res => {
        if (res.code == 200) {
          resolve(JSON.parse(res.data?.content || '{}'));
        }else{
            //不是200展示默认
          resolve(JSON.parse('{}'));
        }
      }).catch(() => {
        // 处理请求失败的情况
        resolve({});
      });
  });
};
// 保存接口
export const saveCustomSetting = async (id, storeData) => {
  const { postUserCustomFormTitle } = await import('@/api')
  return new Promise(resolve => {
    postUserCustomFormTitle({ route: id, content: JSON.stringify(storeData) }).then(res => {
      if (res.code == 200) {
        resolve();
      }
    })
  });
};
// 人员组织-合同记录
export const contractTypeOptions = () => {
    return [
        {label: '固定期限劳动合同', value: 1},
        {label: '无固定期限劳动合同', value: 2},
        {label: '实习协议', value: 3},
        {label: '外包协议', value: 4},
        {label: '劳务派遣合同', value: 5},
        {label: '返聘协议', value: 6},
        {label: '其他', value: 7},
    ]
}
/**
 * 校验表单的必填字段是否都填写
 * @param {string} data - 表单数据
 * @param {string} fields - 必填字段的一维数组
 */
export const validateRequired = (data, fields) => {
    let newArr = []
    fields.forEach(async field=> {
        const key = field.field_key
        const type = field.field_type
        if(data.hasOwnProperty(field.field_key)) {
            if(type === 'telephone' && !data[key]?.value)  {
                newArr.push(field)
            } else if((type === 'rate' || type === 'rate_remind') && !data[key]?.text) {
                newArr.push(field)
            } else if(field.field_type === 'checkbox' ||
            field.field_type === 'checkbox_user_tag' ||
            field.field_type === 'department' ||
            field.field_type === 'contact' || field.field_type === 'customer_contact' || field.field_type === 'workorder_role') {
                if(data[key]?.text && data[key].text.length) {

                } else {
                    newArr.push(field)
                }
            } else if(type === 'radio' && !data[key]?.value) {
                newArr.push(field)
            } else if(type === 'radio_workorder_type' && !data[key]?.text) {
                newArr.push(field)
            } else if(type === 'address' || type === 'date_range' || type === 'cascader') {
                if(data[key].text && data[key].text.length) {

                } else {
                    newArr.push(field)
                }
            } else if((type === 'input' || type === 'textarea' || type === 'date' || type === 'serial_number' || type === 'location') && !data[key]?.value) {

                newArr.push(field)
            } else if(type === 'date_range_apm' && !data[key]?.text) {
                newArr.push(field)
            } else if(type === 'id_card' && !data[key]?.value) {
                newArr.push(field)
            } else if(type === 'paying_teller') {

            } else if(type === 'number' && !data[key]?.value) {
                newArr.push(field)
            } else if(type === 'money' && !data[key]?.value) {
                newArr.push(field)
            } else if(type === 'compute_mode' && !data[key]?.text) {
                newArr.push(field)
            } else if(type === 'money_compute_mode' && !data[key]?.text) {
                newArr.push(field)
            } else if(type === 'order_amount_compute_mode' && !data[key]?.text) {
                newArr.push(field)
            } else if(type === 'file' && !data[key]?.length) {
                newArr.push(field)
            } else if(type === 'radio_project') {

            } else if(type === 'invoice') {

            }
        } else {
            newArr.push(field)
        }
    })
    return newArr.length ? false : true
}


export const isValid = (value) =>{
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim() !== ''
  // 根据业务需求添加其他类型验证
  return (
    value !== undefined &&
    value !== null &&
    value !== false &&
    !Number.isNaN(value)
  )
}
// 数字字符串类型 千分符统一返回.00
export const formatThousandsPrice = (num,unit='') => {
    if(typeof num === 'number'){
      num =  num.toFixed(2)
    }
    return num||num===0?unit+formatThousands(num):'--'
}

/**
 * 防抖函数
 * @param {Function} fn 要防抖的函数
 * @param {Number} delay 延迟时间（毫秒）
 * @param {Boolean} immediate 是否立即执行（第一次触发时立即执行，后续触发重置延迟）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay = 500, immediate = false) {
  let timer = null; // 存储定时器ID
  return function (...args) {
    // 清除之前的定时器（重置延迟）
    if (timer) clearTimeout(timer);

    // 立即执行：第一次触发时直接执行，后续触发仅重置延迟
    if (immediate && !timer) {
      fn.apply(this, args);
    }

    // 重新设置定时器，延迟执行
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(this, args);
      }
      timer = null; // 执行后清空定时器
    }, delay);
  };
}

/**
 * 判断是否是数字
 * @returns {boolean} 是否是数字
 */
export const isNumber = (value) => {
    // 排除 null、空字符串、布尔值、数组等
    if (value === null || value === '' || Array.isArray(value)) {
        return false;
    }
    
    // 使用 Number 转换并验证
    const num = Number(value);
    return !isNaN(num) && isFinite(num);
};

/**
 * 保持指定精度位数的格式化方法
 * @returns {String} 格式化后的数字字符串
 */
export const formatNumberWithPrecision = (value, precision)=> {
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

