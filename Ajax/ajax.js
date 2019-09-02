// （1） web浏览器
// （2） ajax对象       
// （3） 初始化 HTTP 请求参数(请求方式, 地址, 同步or异步)  open
// （4） 发送请求  xml.send
// （5） 监控数据  xml.onreadystatechange
// （6） 检查数据 使用  xml.status  callback


// （1） web浏览器
function ajax(method, url, callback, data, flag) {
    // （2） ajax对象
    var xml = null;       // 先定义一个空，免得下面定义会出现undefined
    if (window.XMLHttpRequest) {
        xml = new XMLHttpRequest();
    } else {
        xml = new ActiveXObject('Microsoft.XMLHttp');
    }
    // （3） 初始化 HTTP 请求参数(请求方式, 地址, 同步异步)
    // （4） 发送请求
    method = method.toUpperCase();
    if (method == 'GET') {
        var date = new Date();
        timer = date.getTime();   // 通过时间戳
        xml.open(method, url + '?' + data + '&timer=' + timer, flag);  // data是get请求中所传递的数据，timer是为了解决get方法的浏览器缓存问题
        xml.send();
    } else if (method == 'POST') {
        xml.open(method, url, flag);
        xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xml.send(data);
    }
    // （5） 监控数据  0 1 2 3 4 
    xml.onreadystatechange = function () {  // 数据状态改变触发事件
        if (xml.readyState == 4) {
            // （6） 检查数据 使用
            if (xml.status == 200) {
                callback(xml.responseText); // 执行回调函数，处理响应回来的解析完成的数据
            }
        }
    }
}


