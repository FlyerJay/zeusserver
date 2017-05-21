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
                <el-table-column prop="spec" label="订单号" width="">
                </el-table-column>
                <el-table-column prop="date" label="供应商数量" width="">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="">
                </el-table-column>
                <el-table-column prop="supplierName" label="总吨位">
                </el-table-column>
                <el-table-column prop="inventoryAmount" label="总价">
                </el-table-column>
                <el-table-column prop="inventoryWeight" label="采购下浮总额">
                </el-table-column>
                <el-table-column prop="freight" label="下单人">
                </el-table-column>
                <el-table-column prop="freight" label="状态">
                </el-table-column>
                <el-table-column label="操作" align="center" property="id">
                    <template scope="scope">
                        <el-button size="small" @click="enterNum(scope.index, scope.row)" type="warning">删除</el-button>
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
