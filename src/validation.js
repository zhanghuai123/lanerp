/**
 * 数据验证工具模块
 * @module validation
 */

/**
 * 判断数据是否是对象格式
 * @param {*} value - 要判断的值
 * @returns {boolean} 是否为纯对象
 */
const isObject = (value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 判断数据是否有效
 * @param {*} value - 要验证的值
 * @returns {boolean} 值是否有效
 */
const isValid = (value) => {
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

/**
 * 判断是否是数字
 * @param {*} value - 要判断的值
 * @returns {boolean} 是否是数字
 */
const isNumber = (value) => {
    // 排除 null、空字符串、布尔值、数组等
    if (value === null || value === '' || Array.isArray(value)) {
        return false;
    }
    
    // 使用 Number 转换并验证
    const num = Number(value);
    return !isNaN(num) && isFinite(num);
}

/**
 * 校验表单的必填字段是否都填写
 * @param {Object} data - 表单数据
 * @param {Array} fields - 必填字段的一维数组
 * @returns {boolean} 是否全部填写（true表示通过，false表示有未填写字段）
 */
const validateRequired = (data, fields) => {
    let newArr = []
    fields.forEach(async field => {
        const key = field.field_key
        const type = field.field_type
        if (data.hasOwnProperty(field.field_key)) {
            if (type === 'telephone' && !data[key]?.value) {
                newArr.push(field)
            } else if ((type === 'rate' || type === 'rate_remind') && !data[key]?.text) {
                newArr.push(field)
            } else if (field.field_type === 'checkbox' ||
                field.field_type === 'checkbox_user_tag' ||
                field.field_type === 'department' ||
                field.field_type === 'contact' || field.field_type === 'customer_contact' || field.field_type === 'workorder_role') {
                if (data[key]?.text && data[key].text.length) {

                } else {
                    newArr.push(field)
                }
            } else if (type === 'radio' && !data[key]?.value) {
                newArr.push(field)
            } else if (type === 'radio_workorder_type' && !data[key]?.text) {
                newArr.push(field)
            } else if (type === 'address' || type === 'date_range' || type === 'cascader') {
                if (data[key].text && data[key].text.length) {

                } else {
                    newArr.push(field)
                }
            } else if ((type === 'input' || type === 'textarea' || type === 'date' || type === 'serial_number' || type === 'location') && !data[key]?.value) {

                newArr.push(field)
            } else if (type === 'date_range_apm' && !data[key]?.text) {
                newArr.push(field)
            } else if (type === 'id_card' && !data[key]?.value) {
                newArr.push(field)
            } else if (type === 'paying_teller') {

            } else if (type === 'number' && !data[key]?.value) {
                newArr.push(field)
            } else if (type === 'money' && !data[key]?.value) {
                newArr.push(field)
            } else if (type === 'compute_mode' && !data[key]?.text) {
                newArr.push(field)
            } else if (type === 'money_compute_mode' && !data[key]?.text) {
                newArr.push(field)
            } else if (type === 'order_amount_compute_mode' && !data[key]?.text) {
                newArr.push(field)
            } else if (type === 'file' && !data[key]?.length) {
                newArr.push(field)
            } else if (type === 'radio_project') {

            } else if (type === 'invoice') {

            }
        } else {
            newArr.push(field)
        }
    })
    return newArr.length ? false : true
}

/**
 * 深度表单校验（Vue 2）
 * @param {string} name - ref名称
 * @param {Object} that - Vue组件实例
 * @returns {Promise} 校验结果Promise
 */
const deepFormValidate = (name, that) => {
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

module.exports = {
    isObject,
    isValid,
    isNumber,
    validateRequired,
    deepFormValidate
}
