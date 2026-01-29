/**
 * 表达式计算工具模块
 * @module calculate
 * @description 支持基本四则运算表达式的解析和计算
 * @example
 * calculate('a + b * (c + d)', { a: 1, b: 2, c: 3, d: 4 }) // 返回 15
 */

const PATTERN_EXP = /((?:[a-zA-Z0-9_.]+)|(?:[\(\)\+\-\*\/])){1}/g;
const EXP_PRIORITIES = { '+': 1, '-': 1, '*': 2, '/': 2, '(': 0, ')': 0 };

/**
 * 表达式计算主函数
 * @param {string} exp - 普通表达式，例如 a + b * (c + d)
 * @param {Object} exp_values - 表达式对应数据内容，例如 { a: 1, b: 2, c: 3, d: 4 }
 * @returns {number|null} 计算结果
 */
const calculate = (exp, exp_values) => {
    const exp_arr = parseExp(exp); // 将表达式字符串解析为列表
    if (!Array.isArray(exp_arr)) {
        return null;
    }
    const output_queue = nifix2rpn(exp_arr);
    return calculateValue(output_queue, exp_values);
}

/**
 * 将字符串中每个操作项和运算符都解析出来
 * @param {string} exp - 表达式字符串
 * @returns {Array|null} 解析后的数组
 */
const parseExp = (exp) => {
    const match = exp.match(PATTERN_EXP);
    return match ? match : null;
}

/**
 * 将中缀表达式转为后缀表达式
 * @param {Array} input_queue - 中缀表达式数组
 * @returns {Array} 后缀表达式数组
 */
const nifix2rpn = (input_queue) => {
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

/**
 * 传入后缀表达式队列、各项对应值的数组，计算出结果
 * @param {Array} output_queue - 后缀表达式数组
 * @param {Object} exp_values - 变量对应的值
 * @returns {number|null} 计算结果
 */
const calculateValue = (output_queue, exp_values) => {
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

module.exports = {
    calculate,
    parseExp,
    nifix2rpn,
    calculateValue
}
