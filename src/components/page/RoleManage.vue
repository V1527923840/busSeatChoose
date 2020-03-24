<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-s-home"></i> 角色管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="roleId" label="角色ID" align="center"></el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                       {{scope.row.roleType === 1 ?'超级管理员':(scope.row.roleType === 2 ? '普通管理员' : '')}}
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑权限</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="33%">
            <el-form ref="form" :model="editform" label-width="100px">
                <el-form-item label="角色ID">
                    <el-input v-model="editform.roleId" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="管理员类型">
                    <el-select v-model="editform.roleType" style="width:200px">
                        <el-option v-for="i in roleTypeOptions" :key="i.value" :value="i.value" :label="i.label"></el-option>
                    </el-select>
                    
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
            roleTypeOptions:[
                {value:1,label:'超级管理员'},
                {value:2,label:'普通管理员'},
            ],
            query: {
                pageIndex: 1,
                pageSize: 10,
                total:2,
            },
            tableData: [
                {
                    roleId: 1, //角色id
                    roleType: 1, //类型（1：超级管理员；2：普通管理员
                    createdTime: "2020-02-04 15:43:31" //创建时间
                },
                {
                    roleId: 2, //角色id
                    roleType: 2, //类型（1：超级管理员；2：普通管理员
                    createdTime: "2020-02-04 15:43:31" //创建时间
                }
            ],
            editVisible: false,
            editRow:{},
            editform: {},
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
            Get('/pc/systemRole/list')
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
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.editVisible = true;
            this.editRow = JSON.stringify(row)
            this.editform = JSON.parse(this.editRow);
        },
        // 保存编辑
        saveEdit() {
            console.log(this.editform)
           Post('/pc/systemRole/edit',this.editform)
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
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
