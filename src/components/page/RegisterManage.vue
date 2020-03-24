<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 行程管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="searchForm.status" @change="getData" clearable placeholder="签到情况" class="handle-select mr10">
                    <el-option v-for="i in statusOptions" :key="i.value" :value="i.value" :label="i.label" ></el-option>
                </el-select>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="scheduleId" label="行程ID"  align="center"></el-table-column>
                <el-table-column prop="studentName" label="学生"></el-table-column>
                <el-table-column prop="carNum" label="车辆"></el-table-column>
                <el-table-column  label="签到情况">
                    <template slot-scope="scope">
                        {{scope.row.status === 1?'已签到':(scope.row.status === 2?'未签到':'')}}
                    </template>
                </el-table-column>
                <el-table-column prop="signTime" label="签到时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-document"
                            @click="handleDetail(scope.$index, scope.row)"
                        >行程详情</el-button>
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

        <!-- 行程详情弹出框 -->
        <el-dialog title="行程详情" :visible.sync="detailVisible" width="30%">
            <el-form ref="detailForm" :model="detailForm" label-width="">
                <el-form-item label="行程ID：">
                    {{detailForm.id}}
                </el-form-item>
                <el-form-item label="起点--终点：">
                    {{detailForm.fromPlace}}--{{detailForm.toPlace}}
                </el-form-item>
                <el-form-item label="开车时间：">
                    {{detailForm.startTime}}
                </el-form-item>
                 <el-form-item label="司机：">
                    {{detailForm.driverName}}
                </el-form-item>
                <el-form-item label="车辆号码：">
                    {{detailForm.carNum}}
                </el-form-item>
                 <el-form-item label="签到二维码：">
                     <img :src="detailForm.code" style="width:100px;height:100px;display:inline-block">
                </el-form-item>
                 <el-form-item label="行程描述：">
                    <textarea  readonly="readonly" v-model="detailForm.description" id="Description" cols="20" rows="10"></textarea>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {Get,Post} from '../common/http'
export default {
    data() {
        return {
            statusOptions:[
                {value:1,label:'已签到'},
                {value:2,label:'未签到'},
            ],
            searchForm:{
                status:'',
            },
            query: {
                pageIndex: 1,
                pageSize: 10,
                total:3,
            },
            tableData: [
                {
                    scheduleId: 1,//行程ID
                    status: 1,//签到情况 1已签到，2未签到
                    signTime: "2019-01-01 11:10",//签到时间
                    studentName: "a",//学生
                    carNum: "粤A1234" //车辆
                },
                {
                    scheduleId: 1,//行程ID
                    status: 2,//签到情况 1已签到，2未签到
                    signTime: "2019-01-01 11:10",//签到时间
                    studentName: "a",//学生
                    carNum: "粤A1234" //车辆
                },
                {
                    scheduleId: 1,//行程ID
                    status: 2,//签到情况 1已签到，2未签到
                    signTime: "2019-01-01 11:10",//签到时间
                    studentName: "a",//学生
                    carNum: "粤A1234" //车辆
                },
            ],
            detailVisible: false,
            detailForm: {
                id: 14,//行程id
                fromPlace: "海珠",//起点
                toPlace: "白云",//终点
                description: "sfhskjafhkjshdfkjshdkjfh",//行程描述
                startTime: "2019-01-01 11:20",//开车时间
                code: "F:\\p/1581059754601.jpg",//签到二维码
                driverName: "a",//司机
                carNum: "粤A1234" //车牌号码
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
            console.log(this.searchForm);
            Post('/pc/seat/sign/list',this.searchForm)
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
        //行程详情操作
        handleDetail(index, row) {
            this.idx = index;
            Post('/pc/schedule/detail',{scheduleId:row.scheduleId})
            .then(res=>{
                console.log(res);
                if(res.code == 200){
                    this.detailForm = res.data.result;
                    this.detailVisible = true;
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
#Description{
    border: none;
    resize: none;
    outline: none;
    width: 100%;
}
</style>
