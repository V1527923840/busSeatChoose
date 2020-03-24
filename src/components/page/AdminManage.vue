<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-s-home"></i> 管理员管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="addVisible = true">新建系统管理员</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="managerId" label="管理员ID" width="100" align="center"></el-table-column>
                <el-table-column prop="loginName" label="账号"></el-table-column>
                <el-table-column prop="nickName" label="用户名"></el-table-column>
                <el-table-column  label="角色">
                    <template slot-scope="scope">
                        {{scope.row.roleId === 1 ?'超级管理员':(scope.row.roleId === 2 ? '普通管理员' : '')}}
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                         <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="handleReset(scope.$index, scope.row)"
                        >重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="query.total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新建弹出框 -->
        <el-dialog title="编辑" :visible.sync="addVisible" width="32%">
            <el-form :model="addForm" ref="addFormRef"  label-width="70px">
                <el-form-item label="账户">
                    <el-input v-model="addForm.loginName" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="addForm.nickName" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="addForm.loginPassword" style="width:250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="32%">
            <el-form :model="editform" ref="editFormRef"  label-width="70px">
                <el-form-item label="账户">
                    <el-input v-model="editform.loginName" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="editform.nickName" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="editform.loginPassword" style="width:250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {Get,Post} from '../common/http'
export default {
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                total: 2,
            },
            tableData: [
                {
                    managerId: 1,//管理员id
                    loginName: "admin",//账号 
                    nickName: "admin",//用户名
                    roleId: 2,//角色（1：超级管理员 2：普通管理员
                    createdTime: "2020-02-04 09:34:39",//创建时间 
                },
                {
                    managerId: 2,//管理员id
                    loginName: "admin",//账号 
                    nickName: "admin",//用户名
                    roleId: 2,//角色（1：超级管理员 2：普通管理员
                    createdTime: "2020-02-04 09:34:39",//创建时间 
                }
            ],
            multipleSelection: [],
            delList: [],
            addVisible:false,
            addForm:{
                loginName:'',//账户
                nickName:'',//用户名
                loginPassword:'',//密码
            },
            editVisible: false,
            editRow:{},
            editform: {
                // loginName:'',//账户
                // nickName:'',//用户名
                // loginPassword:'',//密码
            },
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
           Get('/pc/systemManager/list')
           .then(res=>{
               console.log(res);
               if(res.code == 200){
                   this.tableData = res.data.result;
                   this.query.total = res.data.result.length;
               }else{
                   this.$message.error(res.message)
               }
           })
           .catch(err=>{
               this.$message.error(err.message)
           })
        },
        // 保存新增
        saveAdd() {
            Post('/pc/systemManager/add',this.addForm)
            .then(res=>{
                console.log(res);
                if(res.code == 200){
                    that.$message.success('新增成功');
                }else{
                    that.$message.error(res.message)
                }
            })
            .catch(err=>{
                that.$message.error(err.message)
            })
        },
        cancelAdd(){
            this.addVisible = false;
            this.addForm.loginName = '';
            this.addForm.nickName = '';
            this.addForm.loginPassword = '';
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            let that = this;
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    Post('/pc/systemManager/delete',row)
                    .then(res=>{
                        console.log(res);
                        if(res.code == 200){
                            that.$message.success('删除成功');
                            that.tableData.splice(index, 1);
                        }else{
                            that.$message.error(res.message)
                        }
                    })
                    .catch(err=>{
                        that.$message.error(err.message)
                    })
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            console.log(row);
            this.idx = index;
            this.editVisible = true;
            this.editRow = JSON.stringify(row)
            this.editform = JSON.parse(this.editRow);
        },
        // 保存编辑
        saveEdit() {
            Post('/pc/systemManager/edit',this.editform)
            .then(res=>{
                console.log(res);
                if(res.code == 200){
                    this.editVisible = false;
                    this.$message.success(`修改管理员信息成功`);
                }else{
                    this.$message.success(res.message);
                }
            })
            .catch(err=>{
                this,$message.error(err.message)
            })
        },
        //重置密码
        handleReset(index, row){
            // 二次确认重置
            let that = this;
            this.$confirm('确定要重置密码吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    Post('/pc/systemManager/reset',row)
                    .then(res=>{
                        console.log(res);
                        if(res.code == 200){
                            that.$message.success('重置密码成功');
                        }else{
                            that.$message.error(res.message)
                        }
                    })
                    .catch(err=>{
                        that.$message.error(err.message)
                    })
                })
                .catch(() => {});
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style>
.el-table td,.el-table th{
    text-align: center !important
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
