import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex)

import createPersistedstate from "vuex-persistedstate"    // 在Vuex引入自动登录插件

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules:{
    user
  },

  // Vuex的插件数组，写成函数执行的格式，各插件可配置。
 
  plugins:  [          
    // 自动登录：当模块中的mutation触发时，自动把对应模块下的mutation函数的变量存入localStorage中去，实现自动存取(自动更新)，setItem、getItem、eStudy等相关可省略
    createPersistedstate({  
      key:"newEstudy",        
      pahts:["user"],

      // 把验证token是否过期的异步函数写在此插件下的一个构造函数内
      // 页面刷新时(不等同于页面跳转)，会重新创建一个Vuex实例，就会重新加载此自动登录插件，也就会执行插件内的构造函数subscriber，进而触发token值验证的异步请求函数
      subscriber(store){                      
            
        store.dispatch("user/checkedLogin");   // store为此Vuex实例，其下有dispatch方法，可触发模块内的异步函数

        // 此构造函数的默认部分
        return function(hander){
          return store.subscribe(hander)
        }
      }

    }),
    // 其他Vuex插件
  ]         

})
