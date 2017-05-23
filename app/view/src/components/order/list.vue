<template>
    <div class="order-wrap">
        <el-form :inline="true" :model="orderParams" class="demo-form-inline">
            <el-form-item label="订单号:">
                <el-input v-model="orderParams.id" placeholder="支持模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchOrder">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
            <el-table :data="orderList" stripe style="width: 100%" :load="loading">
                <el-table-column prop="orderNo" label="订单号" width=""/>
                <el-table-column prop="createTime" :formatter="dateFormat" label="下单时间" width=""/>
                <el-table-column prop="supplierCount" width='160' label="供应商数量"/>
                <el-table-column prop="orderWeight" label="总吨位"/>
                <el-table-column prop="orderPrice" label="总价"/>
                <el-table-column prop="orderAdjust" label="采购下浮总额"/>
                <el-table-column prop="userId" width='80' label="下单人"/>
                <el-table-column prop="validate" :formatter="statusFormatter" width="80" label="状态"/>
                <el-table-column label="操作" align="center" property="id">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.index, scope.row)" type="info">查看详情</el-button>
                        <el-button :disabled="scope.row.validate == 1" size="small" @click="enterNum(scope.index, scope.row)" type="warning">删除</el-button>
                    </template>
               </el-table-column>
            </el-table>
       </div>

     </div>
</template>

<script>
    import {
        loadOrderList,
        removeOrderList
    } from '../../vuex/action'
    
    export default {
        vuex: {
            actions: {
               loadOrderList,
               removeOrderList
            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo,
                orderList: ({
                    order
                }) => order.orderList
            }
        },
        data() {
            return {
                ordParams: {
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                    charAmount: '',
                    supplierInventoryId: '',
                    id:''
                },
                orderParams: {
                    id: '',
                    comId: this.userInfo.comId
                },
                loading:true
            }
        },
        methods: {
            searchOrder() {
                this.loadOrderList(this.orderParams)
            },
            statusFormatter(row,column){
                return row.validate === 0 ? '未审核' : '已审核';
            },
            dateFormat(row, column) {
                return new Date(parseInt(row.createTime)).formatDate('yyyy-MM-dd hh:mm:ss')
            },
            enterNum(index, row) {
             
                this.ordParams.id = row.id;
                 
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!',
                  },
                  this.removeOrderList(this.ordParams.id)

                  );
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });          
                });
      
            }
        },
        mounted: function() {
            this.loadOrderList(this.orderParams)
        }
    }
</script>
