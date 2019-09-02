<template>
    <div>
        <!-- 大表格 -->
        <a-table 
            :columns="columns" 
            :dataSource="teacher.assignments" 
            :rowKey="assignment=>assignment.assignment_id" 
            :pagination="false">
            <!-- 大表格中第六列所渲染的有DOM节点的template模板 -->
            <template slot="operation" slot-scope="text,record">
                <!-- ！！！此处的record指teacher.assignments据数组中的各assignment项 -->
                <div v-if="record.work_count > 0">
                    <a-button 
                        v-if="!unfoldFlag" 
                        type="primary" icon="plus-sqare" 
                        @click="unfoldFlag = record">  
                        <!-- ！！！unfoldFlag的作用：1.为大表格提供筛选条件 2.实现小表格的显示与隐藏 3.存放当前项数据record作为a-modal中的数据渲染-->
                        <!-- ！！！注意：在小表格中是无法获取到当前点击的此assignment项数据的，就得通过本地数据变量unfoldFlag进行保存-->
                        展开
                    </a-button>
                    <a-button 
                        v-else 
                        type="primary" 
                        icon="minus-sqare" 
                        @click="unfoldFlag = false">
                        收起
                    </a-button>
                    <!-- ！！！通过a链接下载全部学生提交的此项作业，需要传的参数有：assignment_id -->
                    <a :href=" `${DownloadHost}ALL?id=${record.assignment_id}` ">
                        <a-button icon="dounload">下载全部</a-button>
                    </a>
                </div>    
                <div v-else>
                    <!-- 气泡确认框：点击所包裹的a或button标签时，会弹出框确认是否要删除 -->
                    <!-- ！！！通过函数发送post请求实现作业删除，需要传的参数有：Token、asssinment_id -->
                    <a-popconfirm title="确实删除该作业吗？" okText="确认" cancelText="取消" @confirm="removeAssignment(record.assignment_id)">
                        <a-button icon="delete" type="danger">删除</a-button>
                    </a-popconfirm>
                </div>
            </template>
        </a-table>

        <!-- 小表格 -->
        <!-- ！！！所渲染数据数组为unfoldFlag(即当前点击“展开”所在的assingment作业项)中works字段内容，记录了所有学员的此作业的详细情况 -->
        <a-table 
            v-if="unfoldFlag" 
            :columns="teacherColumns" 
            :dataSource="unfoldFlag.works" 
            :rowKey="unfoldFlag => unfoldFlag.assignment_id" 
            :pagination="false">
            <!-- 小表格中第六列所渲染的有DOM节点的template模板 -->
            <template slot="smallOperation" slot-scope="text,record">
                <!-- ！！！此处的record指unfoldFlag.works数据数组中的各wrok项 -->
                <!-- ！！！通过a链接下载这个学生提交的这个作业，需要传的参数有：id -->
                <a :href="`${DownloadHost}?id=${record.id}&type=student`">
                    <a-button icon="download">下载</a-button>
                </a>
                <!-- 点击“批注”，打开a-model框，对学生提交的作业进行批注，提交附件 -->
                <a-button type="primary" icon="form" 
                          @click="teacherVisible=record; revisingForm.status=work_status[record.status]; revisingForm.review=record.teacher_review" >
                          批改
                </a-button>
                <!-- ！！！teacherVisible作用： 1.实现a-modal框的显示与隐藏(需强转成布尔值) 2.存放当前项数据record作为a-modal中的数据渲染  -->
                <!-- ！！！注意：在a-modal框中是无法获取到当前点击的此work项数据的，就得通过本地数据变量teacherVisible进行保存-->
                <!-- revisingForm.review=record.teacher_review: 使批改意见文本域初始时就显示此作业项的批改意见-->
            </template>
        </a-table>

        <!-- a-model框：通过按钮点击使teacherVisible变为"true"显示 通过自带cancel关闭事件或数据提交后的回调finally函数使teacherVisible变为false隐藏-->
        <a-modal :visible="Boolean(teacherVisible)" @cancel="teacherVisible=false" :footer="null">
            <!-- 提交form表单的a-modal框，表单提交的各项为form-item -->
            <form>
                <a-form-item label="状态">
                    <a-select v-model="revisingForm.status">
                        <!-- status_name: work_status中的各属性值   status：work_status中的各属性索引 -->
                        <!-- ！！！定义value属性对所选择项的索引进行存储，赋给本地数据revisingForm.status -->
                        <a-select-option v-for="(status_name,status) in work_status" :value="status" :key="status">
                            {{ status_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="批改意见">
                    <!-- textarea文本域的autosize属性:自动适配文本高度 -->
                    <a-textarea v-model="revisingForm.review" autosize></a-textarea>
                </a-form-item>

                <a-form-item label="附件">
                    <!-- ！！！通过upload实现文件上传，老师上传作业批改附件需要传的参数有：Token、id -->
                    <a-upload 
                        :action="UploadHost" 
                        :headers="{Token: info.token}"
                        :data="{id: teacherVisible.id}">               
                        <a-button icon="upload">上传</a-button>
                    </a-upload>
                </a-form-item>

                 <a-form-item label="保存批改意见">
                    <!-- ！！！通过函数发送post请求实现form表单数据上传，老师批改作业需要穿的参数有：id、review、status -->
                    <a-button type="primary" @click="save">保存</a-button>
                </a-form-item>
            </form>
        </a-modal>
    </div>
</template>

<script>
import {api} from "../utils/api"; 
import {mapState} from "vuex"; 
const HOST = "http://sandbox_api.estudy.chanke.xyz"     // 接口根URL定义
const work_status = {  // ！！！用于data内的teacherColumns数据数据中的“状态”列进行对象映射
    "0":"待批改",      // ！！！写在data外是因为此时仅实现对象映射功能，还不需要渲染到DOM中，所以不用写在data内
    "1":"需完善",
    "2":"已完成"
}

export default {
    props: ["teacher"],                                 // 接受由父组件App.vue中通过"所有作业"接口从后台获取的所有作业信息的部分字段(orgs、assingments)
    data(){
        return {
            DownloadHost: HOST + "/teacher/download",   // 老师下载作业的接口地址(若后面加了ALL就是批量下载)(都是通过a标签嵌套button使用)
            UploadHost: HOST + "/teacher/upload",       // 老师上传作业批改附件的接口地址(通过upload文件上传组件中action使用)
            unfoldFlag: false,
            teacherVisible: false,                      
            
            // a-modal框中from表单内的双向数据绑定: 1.select和textarea中的显示内容为revisingForm中的数据 2.select中所选择的项和textarea所输入的文本会改变revisingForm中的数据(便于在“保存按钮中”上传给后台)
            revisingForm: {  
                status: "1",                            // 初始值：在没有被批注过的作业form表单中显示
                review: ""
            },
            work_status,                                // ！！！把data之外的对象变为data中的数据，便于select进行遍历渲染

            // 小表格渲染的数据数组
            teacherColumns:[{
                title: "学员名字",
                dataIndex: "user.full_name"
            },
            {   
                title: "学号",
                dataIndex: "user.name"
            },
            {
                title: "提交的作业名称",
                dataIndex: "student_upload_name"
            },
            {
                title: "提交时间",
                dataIndex: "commit_time"
            },
            {
                title: "状态",
                customRender(text,record){
                    return work_status[record.status];  // 对象映射
                }
            },
            {
               title: "操作",
                scopedSlots:{                           // 在表格内根据数据添加DOM节点
                    customRender: "smallOperation"      // 此列渲染的是名为operation的template模板
                },
            }]
        }
    },
    computed:{
        ...mapState("user",["info"]),                   // 通过辅助函数快速获取容器中的数据info

        // 大表格渲染的数据数组
        columns(){
            return [{
                title: "课程", 
                dataIndex: "org_name"                   // 简单数据渲染    直接从数据中的某字段中取数据渲染到本列中
            },
            {
                title: "作业名称",
                dataIndex: "name"
            },
            {
                title: "开始-截止时间",
                customRender(text,record){
                    return `${record.start_time}~${record.end_time}`
                }
            },
            {
                title: "状态",
                customRender(text,record){
                    return `${record.student_count}个学员/${record.work_count}个提交` + (record.work_count > 0 ? `-${record.work_update_time}`:"")
                }
            },
            {
                title: "操作",
                scopedSlots:{                           // 在表格内根据数据添加DOM节点
                    customRender: "operation"           // 此列渲染的是名为operation的template模板
                },
                
                // 对大表格实现可控的筛选显示
                // 由"操作"列中template模板中的"展开"和"收起"按钮DOM节点来设置unfoldFlag值 以它作为筛选条件数据进行大表格的筛选/不筛选显示。
                // 1. filteredValue为此大表格的可控筛选条件。(此处在点击“展开”时，就把“展开”按钮所在作业项的assignment_id值赋给其作为筛选条件)
                filteredValue: this.unfoldFlag ? [this.unfoldFlag.assignment_id] : null,  
                // 2. 触发筛选回调函数onFilter，当filteredValue筛选条件有值时才触发：将该列筛选条件与所有项进行匹配，匹配成功时才保留项(此处肯定只有当前点击“展开”按钮所在项符合匹配)
                onFilter: (value,record) => value === record.assignment_id,  // value为筛选条件值(filteredValue)，record为各项
                // 3. 点击“收起”，unfoldFlag变为flase,一方面将小表格隐藏，另一方面filteredValue筛选条件变为null，不进行作业表格的筛选
                // 注：1.filteredValue当其有值时，才进行筛选，为null时不进行筛选
                //     2.大表格列数据放在计算属性中的原因：此处unfoldFlag是在计算属性中的，所以表格的变化会一直被监听，进行filteredValue值的改变
                key: "operation",                      // 用可控的筛选和排序时需要给当前筛选列增设key值 
            }]
        }
    },
    methods:{
        // 调用“删除作业布置”接口，发送删除作业的请求。  需传两个请求参数: 1.headers(token)已经在user.js中设置好了 2.作业的Id数据(以对象形式传入)
        removeAssignment(id){
            api.post("/teacher/deleteAssignment",{id:id}).then(()=>{        // ES6中{id:id}可简写成{id}
                // 请求成功后，后台数据库中虽已经删除了作业，但还需要把当前表格里的本地数据(teacher.assignments)中的对应作业(assignment)删除掉                   
                // ！！！findIndex方法循环assignments作业数据数组中的每一项，寻找有与当前传入的id值相同的assignment_id所在的assignments数据数组元素，找到后返回索引，此即为所要删除的作业
                const index = this.teacher.assignments.findIndex( (assignment) => {return assignment.assignment_id === id} )   // assignment即为自定义的assignments数据数组中的各元作业元素
                this.teacher.assignments.splice(index,1);   // ！！！从数组中的index索引开始切割数组，切割的元素数量为1个，即可实现从数组中删除指定索引元素
                // ！！！注意：splice方法从数组中添加/删除元素，然后返回被删除的项目  splice方法用于把一个字符串分割成字符串数组
                this.$message.info("删除成功");
            })
        },

        // 调用“批改作业”接口，上传form表单数据。  需传四个请求参数
        save(){
            const formData = {                              // ！！！post请求实现form表单数据上传，把所需传的数据打包成对象格式，且各属性名都不能错(接口定义的)
                id: this.teacherVisible.id,
                status: this.revisingForm.status,
                review: this.revisingForm.review
            }
            api.post("/teacher/review",formData).then(data => {
                console.log(data);                          // 返回的内容是由接口设置的。此处返回的是当前作业项中被批改的work项数据
                // ！！！(同新建作业提交请求)批改意见保存请求成功后，后台已经刷新了此所批改的work项，但还要根据返回数据重新渲染当前页面中小表格中所显示的作业项
                // 通过更新本地数据teacherVisible引用指向的work项来重新渲染此work项。此处用返回data替换掉teacherVisible内容即可(其实替换的是当前被选中的work项)。
                // 此时由于数据绑定，渲染的teacher.works数组中的当前被点击的work项发生了变化，所以会重新渲染小表格，即实现了小表格的及时更新。步骤如下：
                // 1.把对象data转为二维数组 如：{id:1,status:2} → [[id,1],[status,2]]
                // 2.遍历二维数组，item为一级数组元素，item[0]为二级数组元素。(在新本地teacherVisible中item[0]对应各key值(属性名)，item[1]对应各属性)
                console.log(this.teacherVisible);   
                // ？？？此时teacherVisible还没被更新，为何打印的是更新后的，即与236行打印出来的相同
                Object.entries(data).forEach(item => this.$set(this.teacherVisible,item[0],item[1]) );
                console.log(this.teacherVisible);
                // ？？此处是把本地teacherVisible存储的当前work项的数据更新成了最新的data，但是小表格中渲染的数据是从大表格传来的unfoldFlag.works数组数据中的work项，并不是本地teacherVisible变量中的
                // 答：此处的teacherVisible是引用值(对象)，指代当前点击选中的小表格works数据数组中work项，所以更新的直接就是works数据数组中的work项(record)。
                // ？？为什么小表格中被上传批注的work项目会重新渲染，此处并不是双向数据绑定，应该只有record → teacherVisible。如果是刷新页面，重新渲染的也应该是更新后的record
                // 答：数据绑定，此处小表格渲染的是works数组数据，数据发生改变了，DOM节点便更新。

            }).finally(() => {                              // ！！！ finally函数，不管请求成功/失败，都需在最后执行的函数
                this.teacherVisible = false;                // form表单批改意见数据保存上传后，关闭a-modal框
            })
        },
    }
}

</script>

<style lang="scss">

</style>
