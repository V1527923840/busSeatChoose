<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-user-solid"></i> 学生管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="searchForm.name" placeholder="搜索信息" class="handle-input mr10" clearable></el-input>
                <el-select v-model="searchForm.status" placeholder="状态" class="handle-select mr10" clearable>
                    <el-option v-for="i in statusOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
               
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="userId" label="学生ID" align="center"></el-table-column>
                <el-table-column prop="nickname" label="微信昵称"></el-table-column>
                <el-table-column prop="name" label="名字"></el-table-column>
                <el-table-column prop="phone" label="手机号码"></el-table-column>
                <el-table-column label="状态" width="80px" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status===1?'success':(scope.row.status===2?'danger':'')"
                        >{{scope.row.status === 1?'正常':(scope.row.status === 2?'冻结':'')}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createdTime" label="创建日期"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            class="red"
                            icon="el-icon-warning-outline"
                            @click="handleFreeze(scope.$index, scope.row)"
                        >冻结</el-button>
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
    </div>
</template>

<script>
import {Get,Post} from '../common/http'
export default {
    data() {
        return {
            statusOptions:[
                {value:1,label:"正常"},
                {value:2,label:"冻结"},
            ],
            searchForm:{
                type:1,//2为司机,1为学生
                status:'',//状态：1正常，2冻结
                name:'',//搜索框内容
            },
            query: {
                pageIndex: 1,
                pageSize: 10,
                total:2,
            },
            tableData: [
                {
                    userId: 1,//学生ID
                    nickname: "a",//微信昵称
                    name: "a",//名字
                    phone: 1,//手机号码
                    status: 1,//状态：1正常，2冻结
                    createdTime: "2020-02-06 17:46:51"//创建时间
                },
                 {
                    userId: 2,//学生ID
                    nickname: "a",//微信昵称
                    name: "a",//名字
                    phone: 1,//手机号码
                    status: 2,//状态：1正常，2冻结
                    createdTime: "2020-02-06 17:46:51"//创建时间
                },
            ],
            form: {},
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
            console.log(this.searchForm);
            Post('/pc/user/list',this.searchForm)
            .then(res=>{
                console.log(res);
                if(res.code == 200){
                    this.tableData = res.data.result;
                    this.query.pageIndex = 1;
                    this.query.total = res.data.result.length;
                }else{
                    this.$message.success(res.message);
                }
            })
            .catch(err=>{
                this.$message.error(err.message)
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        //冻结操作
        handleFreeze(index,row){
            // 二次确认冻结
            console.log(row)
            this.$confirm('确定要冻结此账号吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                Post('/pc/user/student/freeze',{userId:row.userId})
                .then(res=>{
                    console.log(res);
                    if(res.code === 200){
                        this.$message.success('冻结成功');
                        this.getData();
                    }else{
                        this.$message.success(res.message);
                    }
                })
                .catch(err=>{
                    this,$message.error(err.message)
                })
            })
            .catch(() => {});
        },
        
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
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
