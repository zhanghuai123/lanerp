// 判断是否为移动端设备
const isMobile = () => {
    let flag = navigator.userAgent.match(
        /(phone|pad|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows phone)/i
    );
    return flag;
}

module.exports = {
    isMobile
}