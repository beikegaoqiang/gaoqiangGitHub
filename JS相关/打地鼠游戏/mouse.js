function Mouse(){
    this.Looptime = 30;   // 老鼠上升的速度
    this.top1 = 104;
    this.top2 = 0;
    this.nowtop = 104;
    this.nowtime = 0;
    this.maxtime = 1000;   // 老鼠到达指定位置后停留  
    this.mouseLoop = null;     // 老鼠冒出动作的定时器
    this.moremouseLoop = null; // 多个老鼠随机单个出现定时器
    this.scorenum = 0;   // 计分
    this.mouseAry = [];
    this.hollowAry = [];
    // 一、随机产生老鼠，列数组
    for (var i = 0; i < 9; i++) {
        this.hollowAry[i] = document.getElementById("hollow" + (i + 1));
        this.mouseAry[i] = this.hollowAry[i].getElementsByTagName("img")[0];
    }
    // 二、多个老鼠随机单个出现设计
    function moremouseshow() {           
        if (mouseLoop == null) {
            mouseID = parseInt(Math.random() * 9);
            nowtop = 104;    // ！！！ 注意应是全局变量 ，要不进入mouseshow中使用nowtop和nowtime时，没达到初始化的目的
            nowtime = 0;
            // 定时器是window对象在使用，所以通过传入参数this使使用定时器的当前对象变成m新对象newMouse
            mouseLoop = setInterval(mouseshow, Looptime,this);   // ！！！启动老鼠冒出函数  一定要注意此处的定时器函数变量mouseLoop前不要加var，要是全局变量 
            mouseAry[mouseID].src = "打地鼠/mouse1.png";
            scene.onclick = mouseclick;
        }
    }
     // 五、老鼠冒出函数设计 (在多个老鼠随机出现设计中通过定时器的启动)
     function mouseshow(self) {
        if (nowtop > top2) {
            nowtop -= 4;                        // （104-0）/4 * Looptime(30) = 26*30 = 780ms 
        }
        if (nowtop <= top2) {
            nowtop = top2;
            if (nowtime < maxtime) {
                nowtime += 50;           // 当老鼠头到达指定位置时，开始通过变量nowtime进行叠加，当达到maxtime时，取消计时器并返回老鼠图片的初试top
            }                                  //  (1000-0)/50 * Looptime(30) = 600ms
            if (nowtime >= maxtime) {
                clearInterval(mouseLoop);
                mouseLoop = null;        // ！！！保险：保证只开一个定时器
                nowtop = top1;           // 使老鼠图片恢复原样(top=104)
            }
        }
        mouseAry[mouseID].style.top = nowtop + "px";
    }
}