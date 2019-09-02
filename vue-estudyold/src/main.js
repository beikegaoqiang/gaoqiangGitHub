import Vue from 'vue'
import App from './App.vue'
import store from './store/store'      // 引入一个Vuex实例(可在一开始建立项目时配置)

import Antd from "ant-design-vue"      // 引入ant design所有组件
import "ant-design-vue/dist/antd.css"  // 引入ant design组件库样式
Vue.use(Antd)

import VeeValidate, { Validator } from "vee-validate" // 引入vee validate表单验证插件
import zh_CN from "vee-validate/dist/locale/zh_CN"    // 引入vee validate的中文语言包(本地化)
Vue.use(VeeValidate);
Validator.localize("zh_CN",zh_CN);                    // 使用Validator下的本地化方法使用中文

import Notification from "ant-design-vue/lib/notification" // 单独引入ant design中的“信息提示”组件
Vue.$notification = Notification                           // 自己手动将“信息提示”组件添加到Vue构造函数(在此可当做一个对象)中的自定义notification属性上



Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
 