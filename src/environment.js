// 判断是否为移动端设备
const isMobile = () => {
    let flag = navigator.userAgent.match(
        /(phone|pad|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows phone)/i
    );
    return flag;
}
/**
 * 判断是否是微信浏览器
 * @returns {boolean} 是否是微信浏览器
 */
const isWeixin = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') > -1;
};

module.exports = {
    isMobile,
    isWeixin
}