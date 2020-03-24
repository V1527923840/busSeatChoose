<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 签到管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
               <el-date-picker
                    v-model="searchForm.startTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    @change="getData"
                    placeholder="选择日期">
                </el-date-picker>
                <el-button type="primary" @click="handleAdd">添加行程</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="行程ID"  align="center" width="70px"></el-table-column>
                <el-table-column prop="driverName" label="司机"></el-table-column>
                <el-table-column prop="carNum" label="车牌号码"></el-table-column>
                <el-table-column prop="fromPlace" :show-overflow-tooltip="true" label="起点"></el-table-column>
                <el-table-column prop="toPlace" :show-overflow-tooltip="true" label="终点"></el-table-column>
                <el-table-column prop="description" :show-overflow-tooltip="true" label="行程描述"></el-table-column>
                <el-table-column prop="startTime" label="开车时间"></el-table-column>
                <el-table-column prop="createdTime" label="创建时间"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status===1?'success':(scope.row.status===2?'danger':'')"
                        >{{scope.row.status===1?'正常':(scope.row.status===2?'取消':(scope.row.status===3?'座位已满':''))}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleCancel(scope.$index, scope.row)"
                        >取消</el-button>
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

        <!-- 添加行程弹出框 -->
        <el-dialog title="添加行程" :visible.sync="addVisible" width="40%">
            <el-form ref="form" :model="addForm" label-width="70px">
                <el-form-item label="司机ID">
                    <el-input v-model="addForm.driverId"></el-input>
                </el-form-item>
                <el-form-item label="车辆ID">
                    <el-input v-model="addForm.carId"></el-input>
                </el-form-item>
                <el-form-item label="起点">
                    <el-input v-model="addForm.fromPlace"></el-input>
                </el-form-item>
                <el-form-item label="终点">
                    <el-input v-model="addForm.toPlace"></el-input>
                </el-form-item>
                <el-form-item label="开车时间">
                    <el-date-picker
                    v-model="addForm.startTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期">
                </el-date-picker>
                </el-form-item>
                <el-form-item label="行程描述">
                    <textarea name="" id="addDescription" v-model="addForm.description" cols="30" rows="10" maxlength="200"></textarea>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {Get,Post} from '../common/http'
export default {
    data() {
        return {
            searchForm:{
                startTime:'',
            },
            query: {
                pageIndex: 1,
                pageSize: 10,
                total:3,
            },
            tableData: [
                {
                    id: 1,//行程ID
                    fromPlace: "海珠",//起点
                    toPlace: "白云",//终点
                    description: "",//行程描述
                    startTime: "2019-01-01 11:20",//开车时间
                    createdTime: null,//创建时间
                    status: 1,//状态 1正常，2取消，3座位已满
                    driverName: "a",//司机
                    carNum: "粤A1234"//车牌号码
                },
                 {
                    id: 2,//行程ID
                    fromPlace: "海珠",//起点
                    toPlace: "白云",//终点
                    description: "",//行程描述
                    startTime: "2019-01-01 11:20",//开车时间
                    createdTime: null,//创建时间
                    status: 2,//状态 1正常，2取消，3座位已满
                    driverName: "a",//司机
                    carNum: "粤A1234"//车牌号码
                },
                 {
                    id: 3,//行程ID
                    fromPlace: "海珠",//起点
                    toPlace: "白云",//终点
                    description: "",//行程描述
                    startTime: "2019-01-01 11:20",//开车时间
                    createdTime: null,//创建时间
                    status: 3,//状态 1正常，2取消，3座位已满
                    driverName: "a",//司机
                    carNum: "粤A1234"//车牌号码
                },
            ],
            addVisible: false,
            addForm: {
                driverId: "1",//司机ID
                carId: "1",//车辆ID
                fromPlace: "海珠",//起点
                toPlace: "白云",//终点
                startTime: "2019-01-01 11:20",//开车时间
                description: ""
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
            Post('/pc/schedule/list',this.searchForm)
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
        // 添加行程
        handleAdd() {
            this.addVisible = true;
            for(var i in this.addForm){
                this.addForm[i] = '';
            }
        },
        //保存添加行程
        saveAdd(){
            console.log(this.addForm);
            Post('/pc/schedule/add',this.addForm)
            .then(res=>{
                console.log(res);
                if(res.code == 200){
                    this.$message.success('添加行程成功');
                    this.addVisible = false;
                    for(var i in this.addForm){
                        console.log(this.addForm[i]);
                        this.addForm[i] = '';
                    }
                }else{
                    this.$message.success(res.message);
                }
            })
            .catch(err=>{
                this.$message.error(err.message)
            })
        },
        // 取消操作
        handleCancel(index, row) {
            // 二次确认删除
            this.$confirm('确定要取消此行程吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                     Post('/pc/schedule/cancel',{id:row.id})
                    .then(res=>{
                        console.log(res);
                        if(res.code == 200){
                            this.getData();
                            this.$message.success('取消成功');
                        }else{
                            this.$message.success(res.message);
                        }
                    })
                    .catch(err=>{
                        this.$message.error(err.message)
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
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
#addDescription{
    resize: none;
    outline: none;
    width: 100%;
}
</style>
