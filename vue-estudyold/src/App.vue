<template>
  <a-layout id="app">

    <a-layout-header class="header flexrow">

      <h2>GQ作业系统</h2>

      <!-- 登录成功后才进行头部信息组件渲染 -->
      <div class="flexrow" v-if="loginSwitch">

        <!-- 老师页面的头部信息组件渲染 -->
        <div v-if="isTeacher" class="flexrow leftTeacher">
          <h4>{{ info.name }}</h4>
          <a-button icon="file-add" 
                    class="vcenter" 
                    type="primary"
                    @click="newAssignments=true;">
                    新建作业
          </a-button>
        </div>

        <!-- 学生页面的头部信息组件渲染 -->
        <div v-else class="flexrow leftStudent">                  
          <h4 class="flexcol">
            <span>{{ info.full_name }}</span>
            <span>学号：{{ info.name }}</span>
          </h4>
          <h5 class="flexcol">
            <span v-for="(org,index) in student.orgs" :key="`${org}+${index}`">{{org}}</span> 
          </h5>
          <div class="stats">
            <span class="label">{{ student.stats.uncommitted }}个作业待提交</span>
            <span class="label">{{ student.stats.revising }}个作业待批改</span>
            <span class="label">{{ student.stats.improvable }}个作业待完善</span>
            <span class="label">{{ student.stats.finished }}个作业已完成</span>
          </div>
        </div>

        <a href="http://vipgit.chanke.xyz" target="_blank">
            <a-button icon="home" class="vcenter">代码仓库</a-button>
        </a>
        <a-button icon="logout" class="vcenter" @click="$store.dispatch('user/logout')">退出</a-button>

      </div>

    </a-layout-header>

    <a-layout-content>
        <!-- ant design布局中 所要切换的组件部分(v-if)： -->
        <!-- <content-register v-if="!switch1" @switchEvent1="switch1=true"></content-register>  -->
        <!-- ！！！注意通过计算属性获取的数据变量，要通过计算属性名字进行使用 -->
        <content-register v-if="!loginSwitch" ></content-register>       
        <div v-else>
          <Teacher v-if="isTeacher" :teacher="teacher">老师页面</Teacher>
          <!-- 向子组件传入父组件中从后台获取的student数据 -->
          <Student v-else :student="student" >学生页面</Student>
          
        </div>
    </a-layout-content>

    <!-- a-model框："新建作业"-->
    <a-modal :visible="newAssignments" @cancel="newAssignments=false" :footer="null">
        <form>
          <a-form-item label="新建作业所属课程">
              <a-select v-model="assignmentsDetail.org_id">
                  <a-select-option v-for="(org_name,org_id) in allAssignments" :value="org_id" :key="org_id">  
                      {{ org_name }}         
                      <!-- ？？？此处仅找到三个对应ID课程，故只能新建这三个课程下的作业  -->
                  </a-select-option>
              </a-select>
          </a-form-item>

          <a-form-item label="新建作业名称">
              <a-input v-model="assignmentsDetail.name"></a-input>
          </a-form-item>

          <a-form-item label="开始日期">
              <a-input v-model="assignmentsDetail.start_time" ></a-input>
          </a-form-item>

          <a-form-item label="结束日期">
              <a-input v-model="assignmentsDetail.end_time" ></a-input>
          </a-form-item>

           <p>日期格式要求：****-**-**</p>

          <a-form-item >
              <!-- ！！！通过函数发送post请求实现新建作业，需要穿的参数有：Token、org_id、name、start_time、end_time -->
              <a-button type="primary" @click="submit">提交</a-button>
          </a-form-item>
        </form>
    </a-modal> 

  </a-layout>
</template>

<script>
import Register from "./compontents/register"; // 登录页局部组件引入
import Teacher from  "./compontents/teacher";  // 老师页面局部组件引入
import Student from  "./compontents/student";  // 学生页面局部组件引入
import {mapState} from "vuex";                 // 容器辅助函数的使用
import {api}  from "./utils/api"   
export default {
  name: "app",

  computed:{                                           // ！！！计算属性,即其内所监测的数据发生变化时，执行函数并返回值(可无返回值)。
    // loginSwitch(){
    //   return this.$store.state.user.loginSwitch     // 通过计算属性获取到当前Vuex容器中的state数据。  数据一发生改变，计算属性就执行更新数据。
    // },
    // info(){
    //   return this.$store.state.user.info
    // },
    ...mapState("user",["info","loginSwitch"]),        // 辅助函数，快速获取user模块下面的数据

    isTeacher(){
      return this.info.is_admin > 0;                   // 返回值为true/false 
    }
  },
  components: {
    contentRegister: Register,                         // 登录页局部组件注册
    Teacher, 
    Student
  },
  data(){
    return{
        student:{                                      // 存放从后台获取的学生信息
          orgs: [],
          stats: {},
          assignments: []
        }, 
        teacher:{
          orgs: [],
          assignments: []
        },

        newAssignments: false,                          // “新建作业”a-modal框显示/隐藏标志位的初始化
        assignmentsDetail: {                            // 初始值
          org_id: "",
          name: "",
          start_time:"",
          end_time:"",
        },
        allAssignments: {
          "4": "一期实战班",
          "41": "二期实战班",
          "69": "三期就业班",
          "70": "三期框架班",
          "88": "四期就业班",
          "89": "四期框架班"
        }
    }
  },
  // 当登录成功时，所监听的loginSwitch值发生变化时进行作业详情请求
  watch:{                                              
    loginSwitch(val){     
      if(val){
        this.loadDetails();          
      }
    }
  },
  // 当登录成功后再次点击刷新页面时，会通过构造函数进行作业详情请求。(即虽loginSwitch值不改变，但也能触发函数去获取用户信息)
  created(){
    if(this.loginSwitch){                              
        this.loadDetails();                             // 获取老师/学生的作业详情数据
    }
  },
  methods:{
    loadDetails(){
      if(this.isTeacher){
        console.log("老师作业详情请求发送")
        api.get("/teacher/detail").then(data => {        // 将获取回来的数据存在变量中
          console.log("老师作业详情请求成功:");
          console.log(data);
          this.teacher.orgs = data.orgs;                 // 所管理的所有课程(班级)
          this.teacher.assignments = data.assignments;   // 具体作业信息(老师组件中所需渲染的数据)
        })  
      }else{
        console.log("学生作业详情请求发送")
        // api.get("/student/detail",{headers:{Token:this.info.token}})   // 在use.js登录成功后的计算函数中已经将token值传入headers头中，此处不需再传入
        api.get("/student/detail").then(data => {        // 将获取回来的数据存在变量中
          console.log("学生作业详情请求成功:");
          console.log(data);
          this.student.orgs = data.orgs;                 // 所在班级信息
          this.student.assignments = data.assignments;   // 具体作业信息(表格所需渲染的数据)
          this.student.stats = data.stats;               // 作业完成情况
        })
      }
    },
    submit(){
      api.post("/teacher/createAssignment",this.assignmentsDetail).then(data => {
        console.log(data);     // 此处返回的是当前新建的assginment作业项数据
        // ！！！(同批改意见保存提交请求)新建作业请求成功后，后台的assignments数组中已经有了此新添的assignment作业项，且是被设置在开头的，但还要根据返回数据对本地teacher.assignments进行更新，以达到重新渲染当前页面中的大表格，及时更新的目的。
        // 所以把新建的assingment项添加到本地数据teacher.assignments数组中的开头。
        // 此时由于数据绑定，大表格中渲染的teacher.assignments数组发生了变化，所以会重新渲染大表格，即实现了大表格的及时更新。
        // BUG：返回的新建作业项assingment数据中无student_count字段，故重新根据更新后的本地数据渲染大表格时，此新建作业项的"状态“中学员人数为undefined。点击页面刷新时，重新从后台获取数据重新渲染时，会显示出来。
        // 解决方案：直接在新建作业请求完成后，再次触发loadDetails函数，重新从后台获取作业详情数据，这样的话，也就不用更新本地数据了。(耗费性能，多请求一次数据)
        this.loadDetails();     
      }).finally(() => { 
          this.newAssignments = false;
          this.assignmentsDetail = {};
      })
    }
  }


};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
.header {
  font-size: 1.2em;              // 1.2倍的字体大小
  h2, h4, h5 {
    color: white;
  }
  .flexrow > .flexrow > * {
    margin-right: 25px;
  }
  .label{
    padding: 0 5px;
    color: white;
  }
}

.flexrow{                         // flex布局
  display: flex;   
  flex-direction: row;
  flex-wrap: nowrap;
}
.leftTeacher{
  margin-left: 700px;
}
.leftStudent{
  margin-left: 130px;
}
.flexcol{
  display: flex;              
  flex-direction: column;
  flex-wrap: nowrap;   
  justify-content: space-evenly;  // 子元素间隔一样
  height: 100%;                   // 让h4占满整个一行
  span{
    flex: 1;                      // 各span占据相同的空间
    max-height: 20px;             // span内的文字上下居中
    line-height: 20px;
  }
}
.vcenter{
  align-self: center;             // flex行布局：在行中间
}
</style>
