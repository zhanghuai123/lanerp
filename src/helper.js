/**
 * 辅助函数模块
 * @module helper
 */

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} [delay=500] - 延迟时间（毫秒）
 * @param {boolean} [immediate=false] - 是否立即执行（第一次触发时立即执行，后续触发重置延迟）
 * @returns {Function} 防抖后的函数
 */
const debounce = (fn, delay = 500, immediate = false) => {
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
 * 千分符指令（Vue 2 指令）
 * 用于输入框自动格式化为千分位
 * @example v-thousands
 */
const thousands = {
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
        
        // 输入时限制格式
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

module.exports = {
    debounce,
    thousands
}
