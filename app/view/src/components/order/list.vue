<template>
    <div class="order-wrap">
        <el-form :inline="true" :model="stockParams" class="demo-form-inline">
            <el-form-item label="订单号">
                <el-input v-model="stockParams.spec" placeholder="支持模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchStock">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
            <el-table :data="stockList" stripe style="width: 100%">
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
                        <el-button size="small" @click="enterNum(scope.index, scope.row)" type="warning">下单</el-button>
                    </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="" v-model="dlgShopVisible">
      <el-form :model="cartParams">
        <el-form-item label="需求数量：">
          <el-input v-model="cartParams.charAmount" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgSupVisible = false">取 消</el-button>
        <el-button type="warning" @click="confirmTocart">确 定</el-button>
      </div>
  </el-dialog>
  </div>
</template>

<script>
    import {
        loadStock,
        addTocart
    } from '../../vuex/action'
    
    export default {
        vuex: {
            actions: {
                loadStock,
                addTocart
            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo,
                stockList: ({
                    order
                }) => order.stockList
            }
        },
        data() {
            return {
                cartParams: {
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                    charAmount: '',
                    supplierInventoryId: ''
                },
                stockParams: {
                    spec: '',
                    material: '',
                    type: '',
                    region: '',
                    comId: this.userInfo.comId
                },
                dlgShopVisible: false
            }
        },
        methods: {
            searchStock() {
                this.loadStock(this.stockParams)
            },
            confirmTocart() {
                this.addTocart(this.cartParams)
                    .then(rs => {
                        this.$message({
                            message: `成功添加到购物车`,
                            type: 'success'
                        });
                        this.dlgShopVisible = false;
                    });
            },
            enterNum(index, row) {
                this.dlgShopVisible = true;
                this.cartParams.supplierInventoryId = row.supplierInventoryId;
            }
        },
        mounted: function() {
            this.loadStock(this.stockParams)
        }
    }
</script>
