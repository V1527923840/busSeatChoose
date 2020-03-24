<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 选座管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="searchForm.status" @change="getData" clearable placeholder="状态" class="handle-select mr10">
                    <el-option v-for="i in statusOptions" :key="i.value" :value="i.value" :label="i.label" ></el-option>
                </el-select>
                <el-date-picker
                    v-model="searchForm.takeTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    @change="getData"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="行程ID" align="center"></el-table-column>
                <el-table-column prop="studentName" label="学生"></el-table-column>
               <el-table-column prop="driverName" label="司机"></el-table-column>
               <el-table-column prop="carNum" label="车牌号码"></el-table-column>
               <el-table-column prop="takeTime" label="搭乘时间"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status=== 1?'success':(scope.row.status===3?'danger':(scope.row.status===2?'success':''))"
                        >{{scope.row.status===1?'正常':(scope.row.status===3?'取消':(scope.row.status===2?'正常':''))}}</el-tag>
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
                {value:1,label:'正常'},
                {value:2,label:'取消'},
            ],
            searchForm:{
                status: '',//1正常，2取消
                takeTime: ""
            },
            query: {
                pageIndex: 1,
                pageSize: 10,
                total:3,
            },
            tableData: [
                {
                    "id": 1,//id
                    "takeTime": "2019-01-01 11:20",//搭乘时间
                    "status": 1,//状态 1、2正常；3取消
                    "driverName": "a",//司机
                    "studentName": "a",//学生
                    "carNum": "粤A1234" //车牌号码
                },
                {
                    "id": 2,//id
                    "takeTime": "2019-01-01 11:20",//搭乘时间
                    "status": 2,//状态 1、2正常；3取消
                    "driverName": "a",//司机
                    "studentName": "a",//学生
                    "carNum": "粤A1234" //车牌号码
                },
                {
                    "id": 3,//id
                    "takeTime": "2019-01-01 11:20",//搭乘时间
                    "status": 3,//状态 1、2正常；3取消
                    "driverName": "a",//司机
                    "studentName": "a",//学生
                    "carNum": "粤A1234" //车牌号码
                },
            ],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
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
            Post('/pc/car/list',this.searchForm)
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
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
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
