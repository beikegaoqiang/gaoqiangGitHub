var mymusic = document.getElementById("music");  
//  播放时间
var nowTime = document.getElementsByClassName("current-time")[0];
var allTime = document.getElementsByClassName("all-time")[0];

//  播放暂停按钮切换
var c = 0;  // 解决进度条闪的问题
var myBtn = document.getElementsByClassName("btn")[0];
var btnPlay = myBtn.getElementsByClassName("iconfont")[0];
 
//  拖拽播放进度条
var lineActive = document.getElementsByClassName("line-active")[0];
var timer;
var duration;
var allWidth = 232;
var radioBox = document.getElementsByClassName("radio-box")[0];
var lineBox = document.getElementsByClassName("line-box")[0];
// var flag = false; 不在播放音乐时(播放按钮、上下首按钮)，播放进度条可以拖拽但不播放音乐

//  上下首歌曲切换、快进慢进
var rate = 200; // 用于快进慢放时加快图片转速
var btnPrevious = document.getElementsByClassName("btn-previous")[0];
var btnNext = document.getElementsByClassName("btn-next")[0];
var btnFast = document.getElementsByClassName("btn-fast")[0]; 
var btnLow = document.getElementsByClassName("btn-low")[0];

//  拖拽音量进度条
var d = 0;
var volumn = document.getElementsByClassName("volumn")[0];
var justify = document.getElementsByClassName("justify")[0];
var pointBox = document.getElementsByClassName("point-box")[0];
var justifyBox = document.getElementsByClassName("justify-box")[0];
var justifyActive = document.getElementsByClassName("justify-active")[0];
var allWidth2 = 142;

//  将10首(跟随机播放采用了Math.random有关)歌曲放入数组中  0-9
var i = 0;    
var musicList = ["比你更爱我的人.mp3","曾经的你.mp3","痴心绝对.mp3","等一分钟.mp3","都选C.mp3","飘向北方.mp3","拥抱的理由.mp3","勇气.mp3","最初的梦想.mp3","最天使.mp3"];
mymusic.src = "./source/" + musicList[0];  // 歌曲初始化

//  歌曲对应图片
var play = document.getElementsByClassName("play")[0];
var img = document.getElementById("img");
var musicImgList = ["20.jpg","21.jpg","22.jpg","23.jpg","24.png","25.png","26.png","27.png","28.png","29.png"];
var deg = 0;  // ！！!需要事先定义初值
var rotate;   // 图片旋转定时器变量

//  播放模式切换
var playStyle = document.getElementsByClassName("playstyle")[0];
var btnplayStyle = playStyle.getElementsByClassName("iconfont")[0];
var flag = 0;  // 播放模式的标志位

//  音乐播放列表显示
var playListBlock = document.getElementsByClassName("playListBlock")[0];
var liPalyListBlock = playListBlock.getElementsByTagName("li");
var spanPalyListBlock0 = liPalyListBlock[0].getElementsByClassName("iconfont")[0];



// 函数：将时间转换成标准格式
function conversion(time){  
    var sec = parseInt(time%60) < 10 ? "0" + parseInt(time%60) : parseInt(time%60);    /* 取余再取整*/
    var min = parseInt(time/60) < 10 ? "0" + parseInt(time/60) : parseInt(time/60);    /* 除了再取整*/ 
    return min + ":" + sec;
}
//  函数：音乐播放
function musicPlay(){  
    mymusic.play();
    btnPlay.innerHTML = "&#xe61b;";      // 更改图标
    timer = setInterval(movePro,200);     /* 进度条开始移动*/
    rate = 200;                           /* 当进行其他歌曲播放时，恢复正常播放速度*/
    rotate = setInterval(rotateImg,rate); /* 图片开始转动*/
    play.style.transform = "rotateZ(0)"; // ！！！换歌的时候角度重置，单单重置deg的话，无法在img.src更换前完成角度的重置
    deg = 0;

    liPalyListBlock[i].style.background = "pink";
    console.log("音乐播放");
    // ！！注意此处的时间尽量小于1000毫秒(1秒),因为定时器并不精准影响时间显示，容易跳过
} 
//  函数：音乐暂停
function musicPause(){ ;
    mymusic.pause();
    btnPlay.innerHTML = "&#xe624;";    
    clearInterval(timer);               /* 进度条暂停*/ 
    clearInterval(rotate);              /* 图片转动暂停*/
    console.log("音乐暂停");
}
// 函数：改变播放进度条长度、动态改变nowTime
function movePro(){
    // ！！！offsetWidth获取的是数值，lineActive.style.width是字符串
    // var w = lineActive.offsetWidth + 10;  
    // lineActive.style.width  = w +"px";

    // currentTime/duration = 当前长度值/总长度

    // 音乐已播放时长文本设置
    console.log("movePro"); 
    var currentTime = mymusic.currentTime;
    nowTime.innerHTML = conversion(currentTime);  
    // 进度条长度设置
    lineActive.style.width = currentTime/ duration * allWidth + 8 +  "px";
} 
//  函数：音乐播放时间nowTime和allTime初始化
function musicTime(){
    //  注意音频duration的获取条件(加载完成)，所以此函数有调用条件
    duration = mymusic.duration; 
    nowTime.innerHTML = conversion(mymusic.currentTime);  
    allTime.innerHTML = conversion(duration);
}
//  函数： 上一首播放 （封装上一首播放没有实际意义，为了与下一首播放对称）
function previousmusic(){

    musicPause();  // ！！！在音乐正在播放，因为切歌要开始新的播放的时候，要先清除计时器
    btnPlay.innerHTML = "&#xe61b;";

    liPalyListBlock[i].style.background = "transparent";

    console.log(deg);
    if( i > 0){
        i --;
        mymusic.src = "./source/" + musicList[i];        // 1.音乐资源更改
        img.src = "./img/" + musicImgList[i];            // 2.图片资源更改
        liPalyListBlock[i].style.background = "pink";    // 3.列表背景更改
       
        mymusic.oncanplay = function(){   //音频加载好了才能触发
            console.log("上一首音乐播放");
            musicTime();                  // 重新刷新音乐播放时间nowTime和allTime
            musicPlay();
        }
    }else if( i == 0 ){
        i = 9; 

        mymusic.src = "./source/" + musicList[i];
        img.src = "./img/" + musicImgList[i];
        liPalyListBlock[i].style.background = "pink";

        mymusic.oncanplay = function(){   
            console.log("上一首音乐播放");
            musicTime();
            musicPlay();
        }
    } 
   
}
//  函数： 下一首播放 (作用：用于音乐结束时自动跳转下一首)
function nextmusic(){

    musicPause(); // ！！！在音乐正在播放，因为切歌要开始新的播放的时候，要先清除计时器
    btnPlay.innerHTML = "&#xe61b;";

    liPalyListBlock[i].style.background = "transparent";

    if(i < 9){
        i ++;

        mymusic.src = "./source/" + musicList[i];
        img.src = "./img/" + musicImgList[i];
        liPalyListBlock[i].style.background = "pink";
       
        mymusic.oncanplay = function(){  
            console.log("下一首音乐播放");
            musicTime();
            musicPlay();
        }
    }else if( i == 9 ){
        i = 0; 

        mymusic.src = "./source/" + musicList[i];
        img.src = "./img/" + musicImgList[i];
        liPalyListBlock[i].style.background = "pink";

        mymusic.oncanplay = function(){   
            console.log("下一首音乐播放");
            musicTime();
            musicPlay();
        }
    } 
}
//  函数：图片旋转：1.音乐播放的时候旋转  2.音乐暂停的时候停止到当前位置  3.随着快进和慢放转速改变
function rotateImg(){
    deg += 3;
    console.log(deg);
    play.style.transform = "rotateZ(" + deg + "deg)";
} 
//  函数：单曲循环
function playOne(){

    musicPause(); // ！！！在音乐正在播放，因为切歌要开始新的播放的时候，要先清除计时器
    btnPlay.innerHTML = "&#xe61b;";
    
    mymusic.src = "./source/" + musicList[i];  // i不变。  src的赋值操作会触发oncanplay
 
    mymusic.oncanplay = function(){  
        console.log("单曲循环开始");
        musicTime();
        musicPlay();
    }
}
//  函数：随机播放
function playRandom(){

    musicPause(); // ！！！在音乐正在播放，因为切歌要开始新的播放的时候，要先清除计时器
    btnPlay.innerHTML = "&#xe61b;";
 
    liPalyListBlock[i].style.background = "transparent";

    i = parseInt(Math.random()*10);
    console.log(i);

    mymusic.src = "./source/" + musicList[i];  // i为随机数
    img.src = "./img/" + musicImgList[i];
    liPalyListBlock[i].style.background = "pink";
    mymusic.oncanplay = function(){  
        console.log("单曲循环开始");
        musicTime();
        musicPlay();
    }
}



//  事件：初始播放的那首音乐的时间显示
window.onload = function() { // ！！！因为用的是本地音乐，音乐资源加载快，所以不能用durationchange(网络开发时常用)
    console.log(this);
    musicTime();
}
//  事件：按钮控制音乐播放和暂停
myBtn.onmouseup = function() {   //绑定鼠标抬起事件
    console.log("按钮点击开始播放");
    if(mymusic.paused){
        musicPlay(); 
    }else{
        musicPause(); 
    }
}   
//  事件：播放结束触发
mymusic.onended = function (){
    // 1. 音乐先暂停
    // musicPause();  
    // 2. 音乐当前已播放时长设为0
    // mymusic.currentTime = 0;
    // 3. 音乐已播放时长文本设为0   
    // nowTime.innerHTML = conversion(0); 
    // 4. 进度条长度初始化
    // lineActive.style.width = 8 + "px";
    // 5. 音乐重新开始播放
    // musicPlay();
    musicPause();  // ！！！当前音乐播放结束时，停掉当前的定时器，否则下面的nextmusic()会多开启另一个定时器

    if( flag == 0 ){
        nextmusic();     // 调用下一首播放函数（默认的顺序播放模式）
    }
    else if( flag == 1 ){
        playOne();       // 调用单曲循环模式
    }
    else if( flag == 2 ){
        playRandom();    // 调用随机播放模式
    }

}
//  事件：拖拽播放进度条
radioBox.onmousedown = function(){
    // ！！首先要先清除计时器。不让进度条长度继续变长，不让已播放时长文本继续增加。
    // 注：此处并没有用暂停musicPause()，因为想让在拖动过程中音乐继续播放
    clearInterval(timer);  
                 // 如果不关，则移动的时候onmousemove的时候显示当前拖动的nowTime和进度条，不移动的时候由于计时器没关，会显示当前播放的nowTime和进度条
                 // 此处不用musicPause()方法的原因是为了当在拖拽过程中也能进行音乐的播放( 无music.pause() )。
    clearInterval(rotate);


    // 给body绑定鼠标移动事件
    document.body.onmousemove = function(e){
        var newWidth = e.clientX-lineBox.getBoundingClientRect().left;   // 定义进度条位置
        if(newWidth<8){
            newWidth = 8;
        }else if (newWidth>240){
            newWidth = 240;
        }
        // 进度条长度设置
        lineActive.style.width = newWidth + "px";
        // 已播放时长文本设置
        c = (newWidth-8)/allWidth * duration;          // 变量c出现，用于暂时存储拖拽条播放时间位置
        nowTime.innerHTML = conversion(c);
    }
   // 给body绑定鼠标抬起事件
    document.body.onmouseup = function(){
        // 事件取消 1 : 防止同时触发两个异名事件(body.onmousemove)
        document.body.onmousemove = null;
        // 事件取消 2 : 防止先后冒泡触发两个同名事件(！！如果在绑定了body.onmouseup后不取消绑定，则在触发myBtn.onmouseup时候，也会冒泡触发body.onmouseup) 
        document.body.onmouseup = null;
        // 使音频以新的currentTime开始播放
        mymusic.currentTime = c; // ！！！！使得音乐播放跳转到拖拽条当前的位置，应注意mymusic.currentTime一旦改变就会触发music.canplay事件
        if(!mymusic.paused){     // ！！！！在音乐播放的时候拖拽进度条释放时才会触发定时器
            console.log("拖拽后播放：!music.paused musicPlay");
            timer = setInterval(movePro,200);    /* 以新的currentTime重新开启定时器，进度条和nowTime开始改变(movePro)*/ 
                                     // 注：此时音乐还在继续播放,music.play()不用重新书写，直接以最新的currentTime进行播放
            rotate = setInterval(rotateImg,rate);
        }
    }
}
//  事件：上下首歌切换
btnPrevious.onclick = function(){  // 上一首
    
    if( flag == 0 || flag == 1){
        previousmusic(); // 调用上一首播放函数（默认的顺序播放模式）
    }
    else if(flag == 2){
        playRandom();    // 调用随机播放模式
    }

}
btnNext.onclick = function(){

    if( flag == 0 || flag == 1){
        nextmusic();     // 调用下一首播放函数（默认的顺序播放模式）
    }
    else if(flag == 2){
        playRandom();    // 调用随机播放模式
    }

}
//  事件：音量大小调节
volumn.onclick = function(){
    if(justify.style.display == "block"){
        justify.style.display = "none";
    }else{
        justify.style.display = "block";
    }
}
//  事件：拖拽音量进度条   ？？？？？？ mymusic.volumn为何被改变后，还是无效
pointBox.onmousedown = function(){

   //  clearInterval(timer);      // ！！！音量大小的改变与进度条和nowTime无关，所以不需要先停再起新定时器

   mymusic.oncanplay = null;  // 拖动使音量改变时也会触发oncanplay事件
  
   console.log("初始音量：" + mymusic.volumn);
   document.body.onmousemove = function(e){
       var newWidth = e.clientX-justifyBox.getBoundingClientRect().left;
       if(newWidth<8){
           newWidth = 8;
       }else if (newWidth>150){
           newWidth = 150;
       }
       // 进度条长度设置
       justifyActive.style.width = newWidth + "px";
       // 已播放时长文本设置
       d = (newWidth-8)/allWidth2;
   }
   // 给body绑定鼠标抬起事件
   document.body.onmouseup = function(){
  
       document.body.onmousemove = null;
       document.body.onmouseup = null;  
       
       mymusic.volumn = d;      
       console.log("修改音量：" + mymusic.volumn);
   }
}
//  事件：快进和慢放
btnFast.onclick = function () {
    clearInterval(timer);   // ！！！在音乐正在播放，因为播放速度要开始新的播放的时候，要先清除计时器
    clearInterval(rotate);
    console.log(music.playbackRate); 
    
    mymusic.oncanplay = null;   // 为了使在改变music.playbackRate(音乐播放速度)时，不触发oncanplay函数

    if( music.playbackRate < 2 ){
        music.playbackRate += 0.2;  // 提升音乐播放速度 
        rate -= 30;                 // 提升音乐图片转速
        timer = setInterval(movePro,200);  // 以新的palybackRate重新开启定时器，进度条和nowTime开始改变(movePro)
        rotate = setInterval(rotateImg,rate);
        console.log("快进速度：" + music.playbackRate);
        console.log("旋转速度：" + rate);
    } else{
        music.playbackRate = 2;
        timer = setInterval(movePro,200);
        rotate = setInterval(rotateImg,50);
        console.log("旋转速度：" + rate);
    }
}
btnLow.onclick = function () {
    clearInterval(timer);  
    clearInterval(rotate);
    console.log(music.playbackRate); 

    mymusic.oncanplay = null;

    if( music.playbackRate > 0.4 ){
        music.playbackRate -= 0.2;
        rate += 30;
        timer = setInterval(movePro,200);
        rotate = setInterval(rotateImg,rate);
        console.log("慢放速度：" + music.playbackRate);
        console.log("旋转速度：" + rate);
    } else{
        music.playbackRate = 0.4;
        timer = setInterval(movePro,200);
        rotate = setInterval(rotateImg,290);
        console.log("旋转速度：" + rate);
    }
}
//  事件：播放模式切换
playStyle.onclick = function(){
    if(flag == 0){
        btnplayStyle.innerHTML = "&#xe607;"; // 切换成单曲循环
        flag = 1;
        console.log("flag=1:单曲循环模式");
    }
    else if(flag == 1){
        btnplayStyle.innerHTML = "&#xe514;"; // 切换成随机播放
        flag = 2;
        console.log("flag=2:随机播放模式");
    }
    else if(flag == 2){
        btnplayStyle.innerHTML = "&#xe62b;"; // 切换成顺序播放(默认)
        flag = 0;
        console.log("flag=0:顺序播放模式(默认)");
    }
}

