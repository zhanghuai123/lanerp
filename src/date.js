//格式化日期
 const formatDate = (dateString, date_type) => {
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
 const getNowDate = (date_type) => {
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
// 计算两个日期中所有的日期
 const getDaysBetween = (start, end) => {
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

// 获取两个日期之间的所有日期（新版，支持Date对象）
const getDatesBetween = (startDate, endDate) => {
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

/**
 * 获取日期范围文本
 * @param {string} value - 日期范围类型 (today|yesterday|week|last_week|month|last_month|year|quarter)
 * @returns {string} 日期范围字符串 (例: "2026-01-01 - 2026-01-31")
 */
const getDateRange = (value) => {
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
            const dayOfWeek = today.getDay();
            const dayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            start = new Date(today);
            start.setDate(start.getDate() + dayOffset);
            end = new Date(start);
            end.setDate(end.getDate() + 6);
            break;
        case 'last_week':
            const day = today.getDay() || 7;
            start = new Date(today);
            start.setDate(today.getDate() - day - 6);
            end = new Date(today);
            end.setDate(today.getDate() - day);
            break;
        case 'month':
            end = new Date();
            start = new Date(end.getFullYear(), end.getMonth(), 1);
            break;
        case 'last_month':
            end = new Date();
            start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
            end.setMonth(end.getMonth(), 0);
            break;
        case 'month_all':
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
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

/**
 * 获取月份的开始和结束时间（兼容iOS）
 * @param {Date|string|number} [date] - 可选，指定日期/时间戳/日期字符串（默认当前时间）
 * @returns {Array} [startDate, endDate] 格式化后的日期数组
 */
const getMonthRange = (date) => {
    // 安全解析日期（兼容iOS）
    const safeDate = parseDateForIOS(date || new Date());

    if (isNaN(safeDate.getTime())) {
        throw new Error('Invalid date provided');
    }

    // 获取月份开始时间（当月第一天 00:00:00）
    const start = new Date(safeDate.getFullYear(), safeDate.getMonth(), 1);

    // 获取月份结束时间（当月最后一天 23:59:59.999）
    const end = new Date(safeDate.getFullYear(), safeDate.getMonth() + 1, 0, 23, 59, 59, 999);

    return [formatDate(start, 'date'), formatDate(end, 'date')]
}

/**
 * 安全解析日期（兼容iOS的特殊处理）
 * @param {Date|string|number} dateInput - 日期输入
 * @returns {Date} 解析后的Date对象
 */
const parseDateForIOS = (dateInput) => {
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
            .replace(' ', 'T')
            .replace(/(\d{4}-\d{2}-\d{2})$/, '$1T00:00:00')
            + (dateInput.includes('Z') ? '' : 'Z');

        return new Date(isoString);
    }

    // 其他情况尝试直接创建Date对象
    return new Date(dateInput);
}

module.exports = {
    formatDate,
    getNowDate,
    getDaysBetween,
    getDatesBetween,
    getDateRange,
    getMonthRange,
    parseDateForIOS
}