// JS控制标签和商品内容切换显示
var tabs = document.getElementById("tabs").getElementsByTagName("li");// 把列表li定义成一组数组tabs[i]
console.log(tabs);  
//！！！！！/在JS中，一般先获取外层元素ID  如对ul操作，获取外层div的ID。对li操作，获取外层ul的ID。

var lists = document.getElementById("lists").getElementsByTagName("ul");
//  F12打开控制台，刷新一下即得打印结果
// 上述即通过ID和标签名来进行节点的查找获取，通过最大节点document进行查找的
// ！！！！！ID获取节点的方法只能通过document，Tag和Class可通过任意节点使用
// ！！！！！/ Tag和Class查找的是一个数组
console.log(lists);  





// 遍历已经获取的数组，给每一个li绑定一个事件，事变再触发自定义的函数
for(var i = 0; i < tabs.length; i++){
    tabs[i].onclick = showlist;   // 给每一个li绑定一个点击函数事件(点击时调用执行)
}

function showlist(){           // 对li的class="active"进行遍历，对标签名进行更改操作

    for( var i = 0; i<tabs.length; i++){  //通过遍历操作进行class转换
        if (tabs[i] === this){    // ！！！！！ this指的是我们此刻点击的这个li对象
            tabs[i].className = "active";  // ****即把所点击的这个li的class变成active
            lists[i].className = "active"; // ****假设点击的tabs是第3个，则同样使lists也是第3个状态
        }
        else{
            tabs[i].className = "";  // 即把其他非点击的li的class变空
            lists[i].className = "clearfix"; // 其他的不作更改
        }
    } // 被点击到的标签tabs对应商品内容，对被点到的那个ul的class进行更改，改为css定义中可以显示的class,其他的ul则继续保留css定义中被隐藏的class
}     // 注意此处的在CSS里的可以显示的class必须是第一个ul的，如果是第二个ul的，则在页面点击第一个Ul的时候会出现跳转到第二个，因为默认第一个ul抢购时间对应第一个Ul（逻辑涉及的现实显示问题）
      /* 思想是五个Ul都同时存在，只不过进行了对被点击到的Ul和其他的ul的class的不同更改，对应CSS中的显示与不显示罢了
       clearfix active为显示  clearfix为隐藏
       例如：当不点击的时候（默认）：第一个Ul的class为显示的class，其他Ul为隐藏的class
            当点击第3个的时候：第3个ul的class为显示的class，其他ul为隐藏的class
                注意在HTML中把显示的class先写给第一个ul作为默认 */




var seckillNav = document.getElementById("seckillNav")
window.onscroll = function(){  //设定监听浏览器页面滚动的事件，在F12控制台中可以看到实时打印效果。设定达到一定高度值进行相应固定操作即可
    var scrollTop = document.documentElement.scrollTop; // 可以获取到滚动的高度值，高度为距离页面顶高度，最上时为0
    /* 注意：老版本的IE需要用：doucument.body.scrollTop 获取高度值   
              苹果需要用：window.pageYOffset
    为了增加浏览器类型适用性（兼容性），可以利用或字符将三种方式都书写出来,最后可以或上0，增加保险性*/
    if (scrollTop >= 300){
        seckillNav.className = "seckill-nav seckill-navfixed";   // 两种css样式叠加
    }
    else{
        seckillNav.className = "seckill-nav";                    // 仅含一种css样式
    }
    console.log(scrollTop);  //也可在F12控制台中输入document.documentElement.scrollTop获取当前的滚动高度值
}     
        
//  var bcf = confirm("confirm 弹窗");  /* 返回的是布尔值 */
//    if(bcf){  
//       location.replace("htttp://www.baidu.com/");
//    }
//    else{
//      location.reload();
//     }        