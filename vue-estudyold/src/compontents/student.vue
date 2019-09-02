<template>
    <div>
        <!-- columns:对应表格中各列的渲染  dataSource:渲染所需的数据(数组格式)  rowKey:a-table所需的key值，需函数形式，return值各不相同-->
        <a-table :columns="studentColumns" :dataSource="student.assignments" :rowKey="assignment=>assignment.assignment_id">

            
            <!-- 第四列所渲染的有DOM节点的template模板 -->
            <!-- slot-scope用于向所需要渲染的DOM节点(tempalte)传值，与customRender参数相同 -->
            <template slot="operation" slot-scope="text,record">
                <!-- 学生上传作业需要传的参数有：Token、作业id -->
                <a-upload 
                    name="file" 
                    :action="uploadHost" 
                    :headers="{Token: info.token}"
                    @change="changeUpload"
                    :showUploadList = "false"                   
                    :data="{id: record.assignment_id}">         <!-- 上传参数id，告诉后台上传的是哪一个作业 -->
                    <a-button icon="upload">上传</a-button>
                </a-upload>
                <!-- 通过aassignments数据字段内有无work数据，即已上传了作业，来判断是否可以进行下载，如果可以则增加“下载”按钮 -->
                <a v-if="record.work" :href=" `${downloadHost}?id=${record.work.id}&type=student` ">
                    <a-button icon="download">下载</a-button>
                </a>
            </template>

            <!-- 第五列所渲染的有DOM节点的template模板（学生作业上传了才渲染第五列）-->
            <template slot="message" slot-scope="text,record">
                <div v-if="record.work">
                    <!-- 作业状态：待批改     1.学生上传了，老师没下载 2.学生上传了，老师下载了-->
                    <div v-if="record.work.status==0">
                        <!-- 若老师没下载，则在返回的数据中，老师的下载时间为0000-00-00，此时便显示学生上传作业的时间，如果老师下载了，则显示老师下载的时间 -->
                        {{record.work.teacher_download_time.slice(0,10) == "0000-00-00" ? `${record.work.commit_time}作业已提交` : `${record.work.teacher_download_time}老师已下载`}}
                    </div>
                    <!-- 作业状态：需完善   可查看修改意见-->
                    <div v-else-if="record.work.status==1">
                        <p>{{`${record.work.review_time}老师提交修改意见`}}</p>
                        <a-button @click="visible=record.work">查看修改意见</a-button> 
                    </div>
                    <!-- 作业状态：已完成   可查看批阅详情-->
                    <div v-else>
                        <p>{{`${record.work.review_time}老师完成批改`}}</p>
                        <a-button @click="visible = record.work">查看批阅详情</a-button>
                        <!-- visible作用：1.实现a-modal框的显示与隐藏(需强转成布尔值) 2.存放当前项数据record.work作为a-modal中的数据渲染
                        技巧: @click="visible=record.work"  既保存了当前作业项数据(用于a-modal中传参visible.id)，又将当前项是否有work字段作为visible是否为true的判断标准  
                        注意：在v-modal中是无法获取到当前项record数据的，就得通过数据变量visible保存-->
                    </div>
                </div>
            </template>
        </a-table>

        <!-- a-model框：通过按钮点击使visible变为"true"显示 通过自带cancel关闭事件使visible变为false显示-->
        <a-modal :visible="Boolean(visible)" @cancel="visible=false" :footer="null">
        <!-- 当record.work存在时，visible强转为布尔值时为true -->
        <!-- cancel为自带事件，关闭框时触发：点击a-model框的关闭时，使visible变回flase，即让a-model框消失 -->
            <h4>老师意见:</h4>
            <p v-if="visible.teacher_review"> {{visible.teacher_review}} </p>
            <h4 v-if="visible.teacher_upload_name">老师附件:</h4>
            <p v-if="visible.teacher_upload_name">
                <!-- 通过接口进行附件的下载，id:要下载哪个作业下的附件 type:要下载作业下的文件种类(老师/学生) -->
                <a :href=" `${downloadHost}?id=${visible.id}&type=teacher` ">
                    <a-button>附件</a-button>
                </a>
            </p>
        </a-modal> 

    </div>
</template>

<script>    
import {mapState} from "vuex";                         // 容器辅助函数的使用
const HOST = "http://sandbox_api.estudy.chanke.xyz"    // 接口根URL定义
const work_status = {
        "0":"待批改",
        "1":"需完善",
        "2":"已完成"
}

export default {          
    props: ["student"],                                // 接受由父组件App.vue中通过"学生作业详情"接口从后台获取的所有作业信息的部分字段(orgs、stats、assingments)
    computed:{
        ...mapState("user",["info"])                   // 通过辅助函数快速获取容器中的数据info
    },
    methods:{
        changeUpload(upload){                          // 传入Info数据信息
            if(upload.file.status === "done" && upload.file.response.data){
                this.$message.info("上传成功")          // ant design内的信息提示组件
            }else if(upload.file.status === "error"){
                this.$notification.error({
                    message: "上传失败",
                    description: upload.file.response.errorMessage
                })
            }
        }
    },
    data(){
        return {
            visible: false,                             // 作用1：v-modal组件的显示与隐藏  作用2：存储打开v-modale的当前项的数据record.work
            uploadHost: HOST + "/student/upload",       // 学生上传作业的接口地址
            downloadHost: HOST + "/student/download",   // 学生下载作业的接口地址

            // 表格渲染的数据数组
            studentColumns:[{
                title: "课程", 
                dataIndex: "org_name"                   // 简单数据渲染    直接从数据中的某字段中取数据渲染到本列中
            },
            {
                title: "作业名称",
                dataIndex: "name"
            },
            {
                title: "开始-截止时间",
                customRender(text,record){              // 复杂数据渲染    text:当前此列各项值 record:当前此列各项数据 index:当前此列各项索引
                    return `${record.start_time}~${record.end_time}`   
                }   
            },
            {
                title: "操作",
                scopedSlots:{                           // 在表格内根据数据添加DOM节点
                    customRender: "operation"           // 此列渲染的是名为operation的template模板
                }
            },
            {
                title: "状态",
                customRender(text,record){ 
                    // record.work.status中有3个属性，0.1.2分别对应三种提交了作业的状态，所以在此需要进行对象映射进行转换 
                    // 如果record.work为false，说明未进行作业提交，故显示“未提交”
                    return record.work ? work_status[record.work.status] : "未提交"
                }
            },
            {
                title: "信息",
                scopedSlots: {
                    customRender: "message"              // 此列渲染的是名为customRender的template模板
                } 
            }
            ]
        }
    }
}


</script>

<style lang="scss">

</style>
