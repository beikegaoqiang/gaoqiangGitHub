var play = document.getElementsByClassName("header-list-deng")[0];
var list = document.getElementsByClassName("header-list")[0];
play.onclick = function () {
    if (document.getElementsByClassName("header-list-active")[0]) { // 判断是否有这个类名
        list.classList.remove ("header-list-active" );  // classList: class的一个数组
    } else {
        list.classList.add ("header-list-active"); 
    }
}   