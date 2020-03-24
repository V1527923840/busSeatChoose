<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-user-solid"></i> 司机管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="searchForm.status" placeholder="状态" 
                @change='getData'
                clearable           class="handle-select mr10">
                    <el-option v-for="i in statusOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleAdd">新建</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="userId" label="司机ID" align="center"></el-table-column>
                <el-table-column prop="nickname" label="微信昵称"></el-table-column>
                <el-table-column prop="phone" label="手机号码"></el-table-column>
                <el-table-column width="80px" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status===1?'success':(scope.row.status===2?'danger':'')"
                        >{{scope.row.status === 1?'正常':(scope.row.status === 2?'冻结':'')}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createdTime" label="创建日期"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-star-off"
                            @click="handleDistribute(scope.$index, scope.row)"
                        >分配车辆</el-button>  
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

        <!-- 添加司机-->
        <el-dialog title="添加司机" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="addForm" label-width="70px">
                <el-form-item label="司机姓名">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配车辆 -->
        <el-dialog title="分配车辆" :visible.sync="disVisible" width="30%">
            <el-form ref="disForm" :model="disForm" label-width="70px">
                <el-form-item label="车牌号码">
                    <el-select v-model="disForm.carId">
                        <el-option v-for="i in carOptions" :key="i.carId" :label="i.carNum" :value="i.carId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="disVisible = false">取 消</el-button>
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
            carOptions:[
                {
                    carId: 1,
                    carNum: "粤A1234", 
                },
                {
                    carId: 2,
                    carNum: "粤A5678", 
                },
                {
                    carId: 3,
                    carNum: "粤A9874", 
                }
            ],
            statusOptions:[
                {value:1,label:"正常"},
                {value:2,label:"冻结"},
            ],
            searchForm:{
                type:2,//2为司机
                status:'',//状态：1正常，2冻结
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
                    status: 1,//状态：1正常；2冻结
                    createdTime: "2020-02-06 17:46:51",//创建时间
                },
                {
                    userId: 2,//学生ID
                    nickname: "b",//微信昵称
                    name: "b",//名字
                    phone: 2,//手机号码
                    status: 2,//状态：1正常；2冻结
                    createdTime: "2020-02-06 17:46:51",//创建时间
                }
            ],
            disVisible: false,
            disRow:{},
            disForm:{
                carId:'',
                userId:'',
            },
            addVisible: false,
            addForm: {
                name:'',
                phone:'',
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
        //新增操作
        handleAdd(){
            this.addVisible = true;
        },
        //保存新增
        saveAdd(){
            console.log(this.addForm);
            Post('/pc/user/add/driver',this.addForm)
            .then(res=>{
                console.log(res);
                if(res.code === 200){
                    this.$message.success('冻结成功');
                    this.addVisible = false;
                    this.addForm.name = '';
                    this.addForm.phone = '';
                }else{
                    this.$message.success(res.message);
                }
            })
            .catch(err=>{
                this,$message.error(err.message)
            })
           
        },
        //冻结操作
        handleFreeze(index,row){
            // 二次确认冻结
            console.log(row)
            this.$confirm('确定要冻结此账号吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                Post('/pc/user/freeze',{userId:row.userId})
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
        
        // 分配车辆操作
        handleDistribute(index, row) {
            Get('/pc/user/car/list').then(res=>{
                console.log(res);
                if(res.code == 200){
                    this.carOptions = res.data.result;
                    this.idx = index;
                    this.disForm = row;
                    this.disRow = JSON.stringify(row)
                    this.disForm = JSON.parse(this.disRow);
                    this.disVisible = true;
                }else{
                    this.$message.error(res.message)
                }
            }).catch(err=>{
                this.$message.error(err.message)
            })
        },
        // 保存分配车辆操作
        saveDis() {
            console.log(this.disForm);
            Post('/pc/relation/assign',this.disForm)
            .then(res=>{
                console.log(res);
                if(res.code == 200){
                    this.disVisible = false;
                    this.$message.success(`车辆分配成功`);
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
