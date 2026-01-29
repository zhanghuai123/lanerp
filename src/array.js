/**
 * 数组处理工具模块
 * @module array
 */

/**
 * 合并数组并去重（基于 id 字段）
 * @param {Array} a - 数组A
 * @param {Array} b - 数组B
 * @returns {Array} 合并后的数组（优先保留 b 中的元素）
 */
const mergeArrays = (a, b) => {
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

/**
 * 数组去重（根据指定字段）
 * @param {Array} array - 要去重的数组
 * @param {string} field - 去重依据的字段名
 * @returns {Array} 去重后的数组
 */
const arrayDuplicate = (array, field) => {
    const result = [];
    const seenIds = {};

    array.forEach(item => {
        if (!seenIds[item[field]]) {
            seenIds[item[field]] = true;
            result.push(item);
        }
    });
    return result;
}

/**
 * 根据ID在数组中查找对象（支持嵌套）
 * @param {Array} data - 数组数据
 * @param {string|number} id - 要查找的ID
 * @returns {Object|null} 找到的对象或null
 */
const findObjectById = (data, id) => {
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

/**
 * 获取树形结构中指定ID的父级路径
 * @param {Array} tree - 树形结构数组
 * @param {string|number} value - 要查找的节点ID
 * @param {string} [path=''] - 当前路径（递归用）
 * @returns {string|undefined} 路径字符串（用 / 分隔）
 */
const getItemByIdInTree = (tree, value, path = "") => {
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

module.exports = {
    mergeArrays,
    arrayDuplicate,
    findObjectById,
    getItemByIdInTree
}
