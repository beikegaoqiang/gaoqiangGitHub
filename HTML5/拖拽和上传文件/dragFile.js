function FileLoader(file,events){  // 封装文件读取函数类，并传入需要读取的文件file和用户自定义的附加操作对象event
    this.file = file;   // ！！意思：构造函数类中的file是传入函数内的参数file     
    this.step = 1024 * 1024;        // ！！意思：构造函数类中定义一个变量start（分段上传，每一段长度为1M）
    this.reader = new FileReader(); // 创建一个文件读取对象
    this.total = file.size;    // 所拖放文件的大小
    this.dataLoaded = 0;   
    // ！！！已经读取(上传)了的数据大小。由于下文不是对dataLoaded直接进行赋值，而是通过dataLoaded += num; 所以不先赋值明确其变量类型为数字的话，就会出现NaN
   
    this.events = events;
    this.readFile( 0 , this.step );   // 1.传参时首先进行第一段数据的读取
    this.bindEvent();                 // 2.进行事件的绑定
}

FileLoader.prototype = {  // 通过prototype对构造函数类对象进行属性（变量、函数）添加
    readFile: function(start,step) {    // 分段读取函数
        if (this.file.slice) {  // 先判断能否识别file.slice分段方法，如果不能则直接整个文件上传，不分段
            var blob = this.file.slice(start, start + step);
        } else {
            var blob = this.file;
        }
        this.reader.readAsText(blob);  // readFile用于执行文件分段读取操作，不需要函数返回值,所以没有retuen语句
    },

    bindEvent: function() {   // 时间绑定函数(仅仅起封装作用)
        var _this = this;  // ！！！！此处的this指的是Object全局
        this.reader.onprogress = function (e) {  // ！！！只要数据在读取就会触发(不同于函数:需要语句调用才触发)
            _this.onProgress(e.loaded);  // 在数据读取时进行进度条和百分比的动态更改
    // e.loaded：！！！存储这一 次已读取数据的大小。因为是分段读取，所以需要添加累加操作得出已经读取的文件数据大小
    // ！！！onProgress需要在Object全局下进行执行调用，所以要通过_this执行
    }
        this.reader.onload = function () { // 数据读取完成时候触发(此处为各段数据读取完成后触发)
            _this.onLoad();
        }
        // ！！！注意onProgress和onload函数都是在Object全局下执行的，注意this的指向。
    },

    onProgress: function(num) { // 读取进度条和百分比显示函数
        this.dataLoaded += num; // 对分段读取的数据进行在全局变量dataLoaded上的累加
        if(this.dataLoaded > this.total){   // 为了防止dataLoaded + step>total,则pervent>1，loaded.style.width会超出350
            this.dataLoaded = this.total;
        }
        var pervent = this.dataLoaded / this.total;
        this.events.progressIng(pervent);   // 执行读取过程中的用户自定义函数
    },

    onLoad: function() {  // 各段数据读取完成触发的函数：1.将读取的各段数据通过Ajax进行上传。2.分段读取未完成时，继续读取。

        // 此部分为将读取后的各段文件通过Ajax进行上传的代码

        // var result = reader.result;  // 获取到读取文件的结果
        this.events.stepLoad(this.dataLoaded);  // 执行文件各分段读取完成后的用户自定义函数
        if (this.dataLoaded < this.total) {
            this.readFile(this.dataLoaded,this.step); // ！！！从dataLoaded(已经读取的数据大小)位置开始新的文件段读取
        }else{
            this.events.finish(this.dataLoaded);// 执行文件读取完成后的用户自定义函数
        }
    }
}