import {api} from '../../utils/api'  

// localStorage数据获取：每次刷新和页面跳转，重新渲染时时，首先从localStroage中取值，如果没有，则取默认值为一个空对象
// const estudy = JSON.parse(localStorage.getItem("eStudy")) || {};  // 需解析字符串格式的JSON对象
 
const state = {                                      
    // loginSwitch: estudy.switch || false,                  // 用于登录后组件页面切换
    // info: estudy.info ? JSON.parse(estudy.info) : {}      // 用于登录到学生/老师页面判断

    loginSwitch: false,                 // 初始化。Vuex.persistedstate插件使用，此处取默认值即可
    info: {} 
}
const getters = {
    
}
const mutations = {
    // 在第一次登录成功后，这两个数据值就被vuex-peisistedstate插件自动存放在了localStorage中，页面刷新时，会自动从localStorage中取出这俩数据，从而实现页面组件的直接跳转，不再需登录
    loginMutation(state,data){          // mutatetion函数第一个默认为state，第二个参数才为异步函数中commit传入的参数result
        state.loginSwitch = true;       // 通过mutation函数改变 VueX中的state数据
        state.info = data;              // 存取并接受Post请求后从后台传回的数据
        // 登录成功后，就把token值放入所有api的请求头中，这样在后续就不用再重复穿token值在headers中
        api.defaults.headers.common["Token"] = state.info.token  
        

        // localStorage数据存放：登录成功后，把此俩数据存入localStroage，数据键值名为estude。再次刷新页面时，首先从LocalStorage里取两者数据，并把其值作为两数据的初始化值，实现直接跳转到学生/老师页面
        // localStorage.setItem("estudy",JSON.stringify( {loginSwitch:true, info:JSON.stringify(data)} ));   // 不能直接存对象，要转变成字符串格式的JSON对象
    },

    updateToken(state,token){
        state.info.token = token;       // 续期，更新state内的token值
    },
    logout(state){            
        state.loginSwitch = false;      // 恢复初始值
        state.info = {};
        // 退出时，删除token值
        api.defaults.headers.common["Token"] = ''
    }
}
const actions = {
    // 通过axios发送一个Ajax请求。此处为请求成功的回调函数result，没有写请求失败的回调函数
    loginAction({commit},form){
        api.post("/auth/login",form).then((result) => {                      
            console.log("用户登录请求成功:");
            console.log(result);
            commit("loginMutation",result);                                  // 登录成功后，把数据传给一个计算函数，并改变loginSwitch实现页面组件切换
        }).catch(()=>{
            console.log("用户登录请求失败");
        })
    },
    // 异步函数发送请求给接口，让后台验证当前localStorage中的token是否过期
    checkedLogin({commit,state,dispatch}){                                          
        console.log("Token验证请求发送");
        // 给后台传入接口要求传入的参数(info.token)，给后台验证当前TOken是否过期。因其他接口也需要此Token值，所以直接给所有api的header头传入当前的Token值。
        api.defaults.headers.common["Token"] = state.info.token               // 登录后刷新页面时，也需把token值放入所有api的请求头中
        api.post("/auth/refreshToken",{}, {cancelWindow:true} ).then((token) => {  // ！！！第二个参数为传入的数据，第三个参数为请求的配置config
            console.log("Token验证成功");
            commit("updateToken",token);                                      // 请求成功(Token没过期)，根据返回的新token值，通过mutation更新token值(续期)
        }).catch(() => {
            console.log("Token验证失败");
            dispatch("logout");                                               // 请求失败(Token过期)，触发dispacht异步函数logout，恢复初始值(此处是为了练习action函数触发过程，也可直接触发一个Mutation函数logout)
        })
    },
    logout({commit}){                                                         // commit环境对象，触发logout同步函数
        commit("logout");
    }
}
export default {
    namespaced: true,     // 命名空间 （模块作用域）
    state,
    getters,
    mutations,
    actions 
}