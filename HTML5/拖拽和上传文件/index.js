var box = document.getElementsByClassName("box")[0];
var loaded = document.getElementsByClassName("loaded")[0];
var number = document.getElementsByClassName("number")[0];

// 拖拽事件绑定
box.addEventListener("dragover", function (e) {
    e.preventDefault();
})
box.addEventListener("drop", function (e) {
    e.preventDefault();  // 取消drop的默认事件：拖拽文件后默认直接打开
    file = e.dataTransfer.files[0]; // 获得所拖放的文件(此处仅有一个),将进行文件读取(上传)操作

    var fileLoader = new FileLoader(file,events);   // ！！！在拖动的鼠标放开时调用文件读取(上传)JS组件
    // total = file.size;   // 获取所拖放文件的大小
    // readFile(start,step);
    // bindEvent();
})

// ！！！将文件读取(上传)操作与用户自定义的附加操作分开且独立，增加独立封装性。
// 实现方法：前者封装成一个dragFile.js组件。后者建立一个名为events的对象
var events = {   // 建立一个对象，！用户集中自定义！想要实现的附加操作：进度条更改、百分比显示、打印等。
    progressIng: function(number1){   // 读取过程中的操作
        loaded.style.width = number1 * 350 + "px";
        number.innerHTML = Math.round(number1 * 100) + "%"; //Math.round：上下取整，四舍五入
    },
    stepLoad: function(number2){      // 读取完成每一段后的操作
        console.log("已上传文件大小" + number2);
    },
    finish: function(number3){        // 读取完成整个文件后的操作
        console.log("我终于读取(上传)完了,文件大小是" + number3);
    }
}