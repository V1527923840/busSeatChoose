<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                 <el-date-picker
                    v-model="searchForm.createdTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="日期筛选"
                    @change="getData">
                </el-date-picker>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="managerNickname" label="管理员"></el-table-column>
                <el-table-column label="角色">
                    <template slot-scope="scope">
                        {{scope.row.roleType === 1?'超级管理员':(scope.row.roleType === 2?'普通管理员':'')}}
                    </template>
                </el-table-column>
                <el-table-column prop="description" :show-overflow-tooltip="true" label="操作描述"></el-table-column>
                <el-table-column prop="createdTime" label="操作日期"></el-table-column>
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
            searchForm:{
                createdTime:'',
            },
            query: {
                pageIndex: 1,
                pageSize: 10,
                total:2,
            },
            tableData: [
                {
                    id: 3,//id
                    managerNickname: "admin",//管理员
                    roleType: 1,//类型 1超级管理员，2普通管理员
                    description: "查询管理员列表",//操作描述
                    createdTime: "2020-02-06 08:18:58" //操作日期
                },
                {
                    id:4,//id
                    managerNickname: "admin",//管理员
                    roleType: 1,//类型 1超级管理员，2普通管理员
                    description: "查询管理员列表",//操作描述
                    createdTime: "2020-02-06 08:18:58" //操作日期
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
            Post('/pc/systemLog/list',this.searchForm)
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
