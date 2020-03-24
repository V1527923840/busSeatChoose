<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-truck"></i> 车辆管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="searchForm.carNum" placeholder="搜索信息" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
                <el-button type="primary" @click="handleSearch">添加车辆</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="carNum" label="车辆号码" align="center"></el-table-column>
                <el-table-column prop="name" label="司机"></el-table-column>
                <el-table-column  label="类型">
                    <template slot-scope="scope">
                        {{scope.row.type === 1?'大型巴士':(scope.row.type === 2?'中型巴士':'')}}
                    </template>
                </el-table-column>
                <el-table-column  width='100px' prop="carPeople" label="载客人数"></el-table-column>
                <el-table-column prop="description" :show-overflow-tooltip="true" label="描述"></el-table-column>
                <el-table-column prop="createdTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >分配司机</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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

        <!-- 分配司机弹出框 -->
        <el-dialog title="分配司机" :visible.sync="disVisible" width="30%">
            <el-form ref="disForm" :model="disForm" label-width="70px">
                <el-form-item label="司机">
                    <el-select v-model="disForm.userId">
                        <el-option v-for="i in disOptions" :key="i.userId" :label="i.name" :value="i.userId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDis">取 消</el-button>
                <el-button type="primary" @click="saveDis">确 定</el-button>
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
                carNum:''
            },
            query: {
                pageIndex: 1,
                pageSize: 10,
                total:2,
            },
            tableData: [
                {
                    "carId": 1,
                    "type": 1,//类型 1大型巴士，2中型巴士
                    "carNum": "粤A1234",//车牌号码
                    "carPeople": 20,//载客人数
                    "description": 'shdfkshkjdhfsjhdflshdhlfsldjfds',//描述
                    "createdTime": "2020-02-06 20:00:15",//创建时间
                },
                {
                    "carId": 1,
                    "type": 2,//类型 1大型巴士，2中型巴士
                    "carNum": "粤A1234",//车牌号码
                    "carPeople": 20,//载客人数
                    "description": null,//描述
                    "createdTime": "2020-02-06 20:00:15",//创建时间
                },
                
            ],
            disVisible: false,
            disOptions:[
                {userId: 1,name: "aa",},
                {userId: 2,name: "bb",},
                {userId: 3,name: "cc",},   
            ],//分配司机列表
            disForm: {
                carId:'',
                userId:'',
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
                    Post('/pc/car/delete',{carId:row.carId})
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

            Get('/pc/car/driver/list').then(res=>{
                console.log(res);
                if(res.code == 200){
                    this.disOptions = res.data.result;
                    this.idx = index;
                    this.disForm.carId = row.carId;
                    this.disVisible = true;
                }else{
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.$message.error(err.message)
            })
        },
        // 保存分配
        saveDis() {
            console.log(this.disForm);
            Post('/pc/relation/assign',this.disForm)
            .then(res=>{
                console.log(res);
                if(res.code == 200){
                    this.disVisible = false;
                    this.$message.success(`司机分配成功`);
                }else{
                    this.$message.success(res.message);
                }
            })
            .catch(err=>{
                this,$message.error(err.message)
            })
        },
        //取消分配
        cancelDis(){
            this.disVisible = false;
            this.disForm.userId = '';
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
