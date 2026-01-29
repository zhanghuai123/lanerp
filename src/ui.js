/**
 * UI相关工具模块
 * @module ui
 */

/**
 * 获取列表的高度
 * @param {number} height - 减去的高度值
 * @returns {number} 计算后的表格高度
 */
const getTableHeight = (height) => {
    let tableHeight
    if (window.innerHeight - height <= 300) {
        tableHeight = 300
    } else {
        tableHeight = window.innerHeight - height
    }
    return tableHeight
}

/**
 * 获取列表的动态高度
 * @param {string} outerDom - 外层容器的class名
 * @param {string} topDom - 顶部元素的class名
 * @param {number} [otherHeight=0] - 其他需要减去的高度
 * @returns {number} 计算后的表格高度
 */
const getTableStateHeight = (outerDom, topDom, otherHeight = 0) => {
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

/**
 * 计算表格高度（适用于 el-dialog 中的 el-table）
 * @param {HTMLElement} containerEl - 容器元素（通常是 this.$el）
 * @param {number} [vhRatio=0.8] - 视口高度比例（默认 80vh）
 * @param {number} [minHeight=100] - 最小高度（默认 100px）
 * @param {number} [extraPadding=98] - 额外的内边距/边距 + 搜索盒子（默认 98px）
 * @returns {number} 计算后的表格高度（向下取整的整数）
 */
const calculateTableHeight = (
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
}

/**
 * VxeTable固定列高度同步工具
 * @param {Object} options - 配置选项
 * @param {Object} options.tableRef - 表格ref对象
 * @param {number} [options.debounceTime=30] - 防抖时间(ms)
 * @returns {Object} 返回包含init和destroy方法的对象
 */
const vxeTableHeightSync = (options = {}) => {
    const { tableRef, debounceTime = 30 } = options
    if (!tableRef) {
        console.error('vxeTableHeightSync: tableRef is required')
        return
    }

    // 简单的防抖实现
    const debounce = (fn, delay) => {
        let timer = null;
        return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        };
    }

    // 防抖处理的高度同步方法
    const syncHeights = debounce(() => {
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

module.exports = {
    getTableHeight,
    getTableStateHeight,
    calculateTableHeight,
    vxeTableHeightSync
}
