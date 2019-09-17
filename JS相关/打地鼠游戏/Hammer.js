     // 锤子封装
     function Hammer(){
        this.hammer = document.getElementById("hammer");  // this指代当前通过此类创建的新对象
        // var → hammer：var hammer = document.getElementById("hammer");
        
        // 注：原来的鼠标点击和抬起事件，是绑定在场景scene下的，现在改成绑定在锤子上，效果是一样的，锤子的形态改变也有效
        //     在scene下的锤子移动事件就不能改成绑定在锤子上了，与锤子本身没有关系，所以不能封装在锤子类里，需单独出去。
        this.hammer.onmousedown = function () {
            hammer.src = "打地鼠/hammer2.png";      
        }
        this.hammer.onmouseup = function () {
            hammer.src = "打地鼠/hammer1.png";      
        }
    }

    // 给Hammer原型定义一个属性，属性值是一个函数，则Hammer类下的对象都可以继承
    Hammer.prototype.changeXY = function(x,y){
        // 建立一个函数方法来改变当前对象的top和left值
        this.hammer.style.top = y + "px";     
        this.hammer.style.left = x + "px";
    }  

    Hammer.prototype.changeXY2 = function(x,y){
        // 建立一个函数方法来改变当前对象的top和left值
        this.hammer.style.top = -10000 + "px";     
        this.hammer.style.left = -10000 + "px";
    }  