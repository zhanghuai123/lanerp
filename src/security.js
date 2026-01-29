/**
 * 加密安全工具模块
 * @module security
 * @description AES加密解密工具（依赖 CryptoJS）
 */

// 16 位 AES 加密密钥
const SECRET_KEY = typeof CryptoJS !== 'undefined' 
    ? CryptoJS.enc.Utf8.parse('3QG1525dyenPf3RBHb9yPptMddE5P4e7') 
    : null;

// 16 位初始向量 IV
const SECRET_IV = typeof CryptoJS !== 'undefined' 
    ? CryptoJS.enc.Utf8.parse('mdHp1GGHsEzczAz7') 
    : null;

/**
 * AES 加密函数
 * @param {string} data - 要加密的数据
 * @returns {string} 加密后的字符串（URL编码）
 */
const encryptAES = (data) => {
    if (typeof CryptoJS === 'undefined') {
        throw new Error('CryptoJS is not loaded');
    }
    
    let srcs = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(srcs, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    })
    return encodeURIComponent(CryptoJS.enc.Base64.stringify(encrypted.ciphertext));
}

/**
 * AES 解密函数
 * @param {string} data - 要解密的数据（URL编码的Base64字符串）
 * @returns {string} 解密后的字符串
 */
const decryptAES = (data) => {
    if (typeof CryptoJS === 'undefined') {
        throw new Error('CryptoJS is not loaded');
    }
    
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

module.exports = {
    encryptAES,
    decryptAES
}
