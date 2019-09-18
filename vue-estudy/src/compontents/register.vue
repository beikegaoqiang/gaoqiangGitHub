<template>
  <div class="rigster-flex">
    <form @submit.prevent="sunbmitFunction">
      <div class="rigster-style">
        <a-input
          type="text"
          placeholder="请输入用户名"
          v-validate="'required'"
          name="user"
          data-vv-as="用户名"
          v-model="form.name"
          :class="{errorBox: errors.has('user')}"
        >
          <a-icon class="rigster-icon" slot="prefix" type="user"></a-icon>
        </a-input>
        <span class="error-message">{{ errors.first("user") }}</span>
      </div>
      <div class="rigster-style">
        <a-input
          type="password"
          placeholder="请输入密码"
          v-validate="'required'"
          name="password"
          data-vv-as="密码"
          v-model="form.password"
          :class="{errorBox: errors.has('password')}"
        >
          <a-icon class="rigster-icon" slot="prefix" type="lock"></a-icon>
        </a-input>
        <span class="error-message">{{ errors.first("password") }}</span>
      </div>
      <div class="rigster-style">
        <a-button type="primary" htmlType="submit">提交</a-button>
      </div>
    </form>
  </div>
</template>

<script>
// import {api}  from "../utils/api"               
// 引入axios：因为不是通过default暴露的，所以需通过命名的方式{}获取到api变量，这个变量是对象格式的axios实例

export default {
  data() {
    return {
      form: {
        // v-model 双向数据绑定表单提交的数据
        name: "",                 
        password: ""
      }
    };
  },
  methods: {
    sunbmitFunction() {                   // 点击button(submit)提交时，此函数被触发
      this.$validator.validateAll().then(result => {
      // ant design插件实现：执行validateAll方法验证input框内是否填了数据，通过返回值result来验证，如果都填了，返回值result为true，只有一个么没填就为false，进而再通过回调函数在true的时候完成数据提交，达到目的
        console.log(result);              // ture或false
        console.log(this.form.name);
        console.log(this.form.password);

      // 表单点击提交触发了sunbmitFunction函数，并且通过vee validate插件验证Input框都填了数据后，才通过axios进行post请求
        if (result){          
            // api.post("/auth/login",this.form).then(result =>{  // 通过axios发送一个Ajax请求。此处只写了请求成功的回调函数result，没有写请求失败的回调函数
            //     console.log("post请求完成，执行post'请求成功'后的回调函数");
            //     console.log(result);          // result接收的是由拦截器返回的数据(此处为response.data.data)，而不是后台直接返回的。当请求失败时，此处为undefined
            //     this.$emit("switchEvent1");   // 父传子。绑定并触发父组件的自定义switchEvent1事件，然后调用父组件此事件下的回调函数，完成值的改变。因为此处仅需改变布尔值，所以不需要子向父传值，触发自定义事件即可
            // });

            // 功能：表单提交后，触发actions异步函数发送post请求，且把App.vue(父组件)中switch1值改变
            this.$store.dispatch("user/loginAction",this.form);   // 注意要通过一层命名空间才能获触发actions异步函数
        }
 
      });
    }
  }
};
</script>

<style lang="scss">
.rigster-flex {
  // 使用flex布局使表单居中
  display: flex;
  justify-content: center;
}
form {
  width: 300px;
}
.rigster-style {
  margin: 20px;
  button {
    width: 100%;
  }
}
.rigster-icon {
  opacity: 0.3;
}
.error-message {
  color: red;
  font-size: 10px;
}
.errorBox {
  border: 1px solid red;
}
</style>