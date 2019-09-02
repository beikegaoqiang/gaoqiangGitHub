import axios from "axios"     // axios实现请求
import Vue from "vue"         // 引入Vue构造函数，此时的Vue有notification属性(main.js是最先执行)

const api = axios.create({    // 创建一个axios实例
    baseURL: "http://sandbox_api.estudy.chanke.xyz"
})

// 全局axios配置
api.defaults.headers.post["Content-Type"] = "application/json";  // post传入的数据是json格式的

//拦截器，拦截请求完成后的响应(对所有请求都有效)。回复成功(200)时执行respon并返回,失败(400)时执行error，且都返回的是一个Promise对象
api.interceptors.response.use(response => {         // 返回数据前先拦截，执行完拦截函数后再进行then函数操作 
    
    return response.data.data;   // 只返回需要的部分数据 
                                 // 当用户请求成功时，return了一个非Promise对象，即此时拦截器返回的就是一个result状态的Promise对象，就会执行post请求(then)的成功回调函数
}, error => {
    // console.log(error);       // 打印错误信息(status code 400)
    
    console.dir(error);          // 暴露出具体的错误对象信息，打印出来
           
    // alert(error.response.data.errorMessage);     // 弹窗提示请求错误信息

    if(!error.config.cancelWindow){    // ！！！在Token验证请求中：在返回的错误信息error内对当前请求配置config内的自定义配置cancelWindow进行判断，决定是否要进行错误提示弹窗，实现其特殊化的目的
            // 通过组件优化错误提示的样式
            // this.$notification：通过引入组件把一些变量注入Vue实例，但此api.js中无法获取到Vue实例，故可以自己把组件注入Vue构造函数中
            Vue.$notification.error({                         // 在Vue实例下使用vue vaildate插件的error错误信息提示弹窗组件 
            message: "API Error",                             // 自定义标题
            description: error.response.data.errorMessage     // 错误提示内容（是由后端人员给接口定义的400码下的错误信息）
            })
    }
    return Promise.reject(error);    // 当用户请求失败时，拦截器返回的是一个reject状态的Prmoise对象，就会执行post请求(then)的失败的回调函数
                                     // 注意：如果此处不return,则return undefined，也是个非Promise对象，返回的是result状态的Promise对象，也会执行post请求成功的回调函数
})

export { api } 