var oLi = document.getElementsByTagName('li');
var flag = false;   // 用于ajax锁
var num = 1;        // 用于更换capage,以获取不同页的数据

function sendData(){   // Ajax请求函数
    if(!flag){
        ajax('get', './getPics.php', dealData, 'cpage='+num, true);
        // ！！！传入的数据“capage=num”(表示要第n页的数据) 是由接口文档定义的
        num ++;
    }
    flag = true;  // 更改flag，锁上
}
sendData();   // 一开始需先调用一次Ajax请求

function dealData(data) {   // get请求的回调函数
    var data1 = JSON.parse(data);   // 将获取到的字符串数据转成由一个个对象组成的数组
                                    // ！！！无论是一个个对象组成的数组还是一个个对象，都可以对其使用forEach 
    console.log(data1);
    if( num !=5 ){
        // forEach实现功能： 将获取的数据建立的图片块(div),并插入到最短的li中
        data1.forEach(function (ele, index) {  // 对数组使用forEach循环
            var oItem = document.createElement('div');  // 1.创建图片div外框
            oItem.className = 'item';

            var oImg = new Image();                     // 2.创建图片
            oImg.height = 200 * ele.height / ele.width; // 先占好图片块的位置
    // BUG： 在插入图片块的时候，可能图片还在加载过程中，所有当前图片块(div)的高度就仅为10px(上下padding值)，
    // 所以导致大量图片块元素(oTtem)在某一列堆积，等到图片加载完毕返回大小时，再撑开各元素，
    // 即此BUG会造成某一列(第一个元素图片最短)有大量图片排列某一列(第一个元素图片最长)几乎没有。
    // 解决方案： 先固定好图片的高度（先占好位置），等图片慢慢加载完毕后，再进行显示。
            oImg.src = ele.image;   // 图片的绝对地址在返回的各个对象的image属性中
            oItem.appendChild(oImg);                     // 3.把图片放入div外框内

            // oImg.onload = funciton(){}
            var number1 = shorttest(oLi);                // 4.调用shorttest函数找出最短Li
            oLi[number1].appendChild(oItem);             // 5.把图片块插入到最短的li内

            flag = false;  // ajax请求已完成，更改flag，把锁解开。
        });
    }else {
        alert("数据已经获取光了！！！");
    }
    // ！！！当获取到某一页数据已经为空（data.length == 0）的时候,进行针对空数据的操作。
    // 不同于视频，视频里cpage=6时是一个空的数组。此处仅有5个cpage，且都有内容，所以不会触发alert。
    //    所以把if(data.length > 0)改成if(num!=5),则达到与视频同样的效果
}

function shorttest(list) {   // 找最短Li的函数
    var length = list.length;
    var mixNumber = 0;
    var min = list[0].offsetHeight;       // 先假设第一个是li最短的
    for (var i = 1; i < length; i++) {    // 从第二个li(i=1)开始进行比较
        if (list[i].offsetHeight < min) {  //  !!! offestHeight获取DOM元素的高度
            min = list[i].offsetHeight;
            mixNumber = i;
        }
    }
    return mixNumber;
}
 
window.onscroll = function () {   // 滚动条滚动事件：当滚动到一定位置时，继续触发Ajax请求获取数据并显示。
    var number2 = shorttest(oLi);
    var h = oLi[number2].offsetHeight; // 最短列的高度
    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;  // 滚动条已经滚动的高度
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;   // 窗口高度
    if (scrollHeight + clientHeight > h) {  
          sendData();   // 触发Ajax请求
    }
    // BUG: ajax加载需要时间，即h(最短列高度)不能立马更新，所以当滚动到底部，会随着继续滚动，多次触发onscroll事件内的if，所以ajax会触发多次。
    // ！！！解决方案： 在触发Ajax的函数内，手动建立flag锁，使得当前的ajax请求完成后才能进行下一个ajax请求的触发。即flag==false的时候才能触发ajax请求。
}

console.log(oLi[1].offsetHeight);
 // ！！！此句执行的先于console.log(data1);，因为ajax的是异步的，且请求速度稍微慢