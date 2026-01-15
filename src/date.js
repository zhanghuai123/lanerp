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

module.exports = {
  formatDate,
  getNowDate,
  getDaysBetween
}